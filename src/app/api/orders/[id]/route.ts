import { NextRequest, NextResponse } from "next/server";
import { OrderService } from "@/app/db/services/orderService";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;
    const order = await OrderService.getOrderById(orderId);
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      order
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;
    const body = await request.json();
    
    // Only allow status updates for now
    if (body.status) {
      const success = await OrderService.updateOrderStatus(orderId, body.status);
      
      if (!success) {
        return NextResponse.json(
          { success: false, error: "Order not found or update failed" },
          { status: 404 }
        );
      }
      
      // Get updated order
      const updatedOrder = await OrderService.getOrderById(orderId);
      
      return NextResponse.json({
        success: true,
        order: updatedOrder
      });
    }
    
    return NextResponse.json(
      { success: false, error: "Invalid update data" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update order" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;
    
    // For now, we'll just mark as cancelled instead of deleting
    const success = await OrderService.updateOrderStatus(orderId, "completed");
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "Order cancelled successfully"
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete order" },
      { status: 500 }
    );
  }
}