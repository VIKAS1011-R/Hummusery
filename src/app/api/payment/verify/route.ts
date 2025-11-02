import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { OrderService } from "@/app/db/services/orderService";

interface OrderData {
  orderNumber: string;
  items: Array<{
    id: string;
    name: string;
    description: string;
    isVeg: boolean;
    quantity: number;
    price: number;
  }>;
  status: "pending";
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  totalAmount: number;
  userId: string;
  paymentId?: string;
  razorpayOrderId?: string;
  paymentStatus?: "pending" | "completed" | "failed";
}

// Background retry function
async function scheduleBackgroundRetry(orderData: OrderData, paymentId: string, razorpayOrderId: string) {
  // In a production environment, you would use a job queue like Bull, Agenda, or similar
  // For now, we'll do a simple background retry with setTimeout
  
  console.log("Scheduling background retry for order creation...");
  
  setTimeout(async () => {
    try {
      console.log("Background retry: Attempting to create order...");
      const newOrder = await OrderService.createOrder(orderData);
      console.log("Background retry: Order created successfully!", newOrder._id);
    } catch (error) {
      console.error("Background retry failed:", error);
      
      // Schedule another retry after 5 minutes
      setTimeout(async () => {
        try {
          console.log("Final background retry: Attempting to create order...");
          const newOrder = await OrderService.createOrder(orderData);
          console.log("Final background retry: Order created successfully!", newOrder._id);
        } catch (finalError) {
          console.error("FINAL RETRY FAILED - Manual intervention required:", {
            paymentId,
            razorpayOrderId,
            error: finalError instanceof Error ? finalError.message : 'Unknown error',
            orderData: JSON.stringify(orderData)
          });
        }
      }, 5 * 60 * 1000); // 5 minutes
    }
  }, 30 * 1000); // 30 seconds initial delay
}

export async function POST(request: NextRequest) {
  try {
    // Get user ID from authentication token
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    let userId: string;
    let userEmail: string;
    let isEmailVerified: boolean;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { 
        userId: string; 
        email: string; 
        isEmailVerified: boolean 
      };
      userId = decoded.userId;
      userEmail = decoded.email;
      isEmailVerified = decoded.isEmailVerified;
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    // Check if email is verified before processing payment verification
    if (!isEmailVerified) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Email verification required to complete payment", 
          requiresVerification: true 
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      orderData // The actual order data (items, etc.)
    } = body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Missing payment verification data" },
        { status: 400 }
      );
    }

    // Verify payment signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // Payment is verified, now create the order in our database with retry mechanism
    if (orderData) {
      const orderToCreate = {
        ...orderData,
        userId,
        status: "pending" as const,
        paymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
        paymentStatus: "completed"
      };

      // Retry mechanism for database operations
      const maxRetries = 3;
      let retryCount = 0;
      let lastError: Error | unknown = null;

      while (retryCount < maxRetries) {
        try {
          console.log(`Attempting to create order in database (attempt ${retryCount + 1}/${maxRetries})`);
          
          const newOrder = await OrderService.createOrder(orderToCreate);
          
          console.log("Order created successfully in database:", newOrder._id);
          // MongoDB Change Streams will automatically detect this insertion
          
          return NextResponse.json({
            success: true,
            message: "Payment verified and order created successfully",
            order: newOrder,
            paymentId: razorpay_payment_id
          });
          
        } catch (error) {
          lastError = error;
          retryCount++;
          
          console.error(`Database operation failed (attempt ${retryCount}/${maxRetries}):`, {
            error: error instanceof Error ? error.message : 'Unknown error',
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            userId
          });
          
          if (retryCount < maxRetries) {
            // Wait before retrying (exponential backoff)
            const waitTime = Math.pow(2, retryCount) * 1000; // 2s, 4s, 8s
            console.log(`Waiting ${waitTime}ms before retry...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
          }
        }
      }

      // All retries failed - log critical error but still return success for payment
      console.error("CRITICAL: Payment verified but order creation failed after all retries!", {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        userId,
        finalError: lastError instanceof Error ? lastError.message : 'Unknown error',
        orderData: JSON.stringify(orderToCreate)
      });

      // Schedule background retry (you could implement a job queue here)
      scheduleBackgroundRetry(orderToCreate, razorpay_payment_id, razorpay_order_id);
      
      return NextResponse.json({
        success: true,
        message: "Payment verified successfully - Order will be processed",
        paymentId: razorpay_payment_id,
        warning: "Order processing in progress"
      });
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      paymentId: razorpay_payment_id
    });

  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}