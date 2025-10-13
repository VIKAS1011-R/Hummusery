import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { OrderService } from "@/app/db/services/orderService";

export async function POST(request: NextRequest) {
  try {
    // Get user ID from authentication token (admin only)
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    let user: { userId: string; email: string };
    try {
      user = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
        email: string;
      };
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    // Check if user is admin (you might want to add role checking)
    // For now, we'll allow any authenticated user to retry their own orders

    const body = await request.json();
    const { orderData, paymentId, razorpayOrderId } = body;

    if (!orderData || !paymentId || !razorpayOrderId) {
      return NextResponse.json(
        { success: false, error: "Missing required data for order retry" },
        { status: 400 }
      );
    }

    console.log(
      "Manual retry: Attempting to create order for payment:",
      paymentId
    );

    // Attempt to create the order
    const newOrder = await OrderService.createOrder({
      ...orderData,
      paymentId,
      razorpayOrderId,
      paymentStatus: "completed",
    });

    console.log("Manual retry: Order created successfully!", newOrder._id);

    return NextResponse.json({
      success: true,
      message: "Order created successfully via manual retry",
      order: newOrder,
      paymentId,
    });
  } catch (error) {
    console.error("Manual retry failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create order via manual retry",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
