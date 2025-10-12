import { NextRequest, NextResponse } from "next/server";
import { OrderService } from "@/app/db/services/orderService";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
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
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; email: string };
      userId = decoded.userId;
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    // Get user's completed order history from their user document
    const orderHistory = await OrderService.getUserOrderHistory(userId);
    
    // Also get user's active orders (pending/preparing/ready)
    const activeOrders = await OrderService.getUserActiveOrders(userId);
    
    // Transform to match expected format
    const formattedHistory = orderHistory.map(order => ({
      orderId: order._id?.toString() || "",
      orderNumber: order.orderNumber,
      items: order.items,
      totalAmount: order.totalAmount,
      status: "completed" as const,
      orderDate: order.completedAt.toISOString()
    }));

    // Add active orders to the history
    const formattedActiveOrders = activeOrders.map(order => ({
      orderId: order._id?.toString() || "",
      orderNumber: order.orderNumber,
      items: order.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        isVeg: item.isVeg
      })),
      totalAmount: order.totalAmount,
      status: order.status,
      orderDate: order.createdAt.toISOString()
    }));

    // Combine and sort by date (newest first)
    const allOrders = [...formattedHistory, ...formattedActiveOrders]
      .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
    
    return NextResponse.json({
      success: true,
      orderHistory: allOrders
    });
  } catch (error) {
    console.error("Error fetching order history:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch order history" },
      { status: 500 }
    );
  }
}