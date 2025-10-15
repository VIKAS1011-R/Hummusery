import { NextRequest, NextResponse } from "next/server";
import { OrderService } from "@/app/db/services/orderService";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    // Get all active orders (for admin dashboard)
    const orders = await OrderService.getActiveOrders();
    
    return NextResponse.json({
      success: true,
      orders: orders
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    
    // Return empty orders array as fallback instead of error
    if (error instanceof Error && error.message.includes('Database connection failed')) {
      console.warn("Database unavailable, returning empty orders list");
      return NextResponse.json({
        success: true,
        orders: [],
        warning: "Database temporarily unavailable"
      });
    }
    
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.orderNumber || !body.items || !body.customerEmail) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get user ID from token
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    let userId: string;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; email: string };
      userId = decoded.userId;
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }
    
    // Create order in database
    const orderData = {
      ...body,
      userId,
      status: "pending" as const
    };

    const newOrder = await OrderService.createOrder(orderData);
    
    console.log("New order created:", newOrder.orderNumber);
    // MongoDB Change Streams will automatically detect this insertion
    
    return NextResponse.json({
      success: true,
      order: newOrder
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    );
  }
}