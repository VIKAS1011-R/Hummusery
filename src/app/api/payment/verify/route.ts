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

// Background retry function for production
async function scheduleBackgroundRetry(
  orderData: OrderData,
  paymentId: string,
  razorpayOrderId: string
) {
  // In production, consider using a proper job queue like Bull, Agenda, or similar
  setTimeout(async () => {
    try {
      await OrderService.createOrder(orderData);
    } catch (error) {
      console.error("Background retry failed:", error);

      // Schedule final retry after 5 minutes
      setTimeout(async () => {
        try {
          await OrderService.createOrder(orderData);
        } catch (finalError) {
          console.error(
            "CRITICAL: Final retry failed - manual intervention required:",
            {
              paymentId,
              razorpayOrderId,
              error:
                finalError instanceof Error
                  ? finalError.message
                  : "Unknown error",
            }
          );
        }
      }, 5 * 60 * 1000);
    }
  }, 30 * 1000);
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
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
        email: string;
        isEmailVerified: boolean;
      };
      userId = decoded.userId;
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData, // The actual order data (items, etc.)
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
        paymentStatus: "completed",
      };

      // Retry mechanism for database operations
      const maxRetries = 3;
      let retryCount = 0;
      let lastError: Error | unknown = null;

      while (retryCount < maxRetries) {
        try {
          const newOrder = await OrderService.createOrder(orderToCreate);

          // MongoDB Change Streams will automatically detect this insertion

          return NextResponse.json({
            success: true,
            message: "Payment verified and order created successfully",
            order: newOrder,
            paymentId: razorpay_payment_id,
          });
        } catch (error) {
          lastError = error;
          retryCount++;

          console.error(
            `Database operation failed (attempt ${retryCount}/${maxRetries}):`,
            error instanceof Error ? error.message : "Unknown error"
          );

          if (retryCount < maxRetries) {
            // Wait before retrying (exponential backoff)
            const waitTime = Math.pow(2, retryCount) * 1000; // 2s, 4s, 8s
            await new Promise((resolve) => setTimeout(resolve, waitTime));
          }
        }
      }

      // All retries failed - log critical error but still return success for payment
      console.error(
        "CRITICAL: Payment verified but order creation failed after all retries!",
        {
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          userId,
          finalError:
            lastError instanceof Error ? lastError.message : "Unknown error",
          orderData: JSON.stringify(orderToCreate),
        }
      );

      // Schedule background retry (you could implement a job queue here)
      scheduleBackgroundRetry(
        orderToCreate,
        razorpay_payment_id,
        razorpay_order_id
      );

      return NextResponse.json({
        success: true,
        message: "Payment verified successfully - Order will be processed",
        paymentId: razorpay_payment_id,
        warning: "Order processing in progress",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
