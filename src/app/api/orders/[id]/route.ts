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
      order,
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
      // Get the order before updating it (in case it gets moved to history)
      const orderBeforeUpdate = await OrderService.getOrderById(orderId);

      if (!orderBeforeUpdate) {
        return NextResponse.json(
          { success: false, error: "Order not found" },
          { status: 404 }
        );
      }

      const success = await OrderService.updateOrderStatus(
        orderId,
        body.status
      );

      if (!success) {
        return NextResponse.json(
          { success: false, error: "Order update failed" },
          { status: 404 }
        );
      }

      // Handle completed orders differently since they get moved to history
      if (body.status === "completed") {
        console.log("Order completed and moved to history:", orderId);
        // MongoDB Change Streams will automatically detect the deletion

        return NextResponse.json({
          success: true,
          message: "Order completed and moved to history",
        });
      } else {
        // For non-completed orders, get the updated order
        const updatedOrder = await OrderService.getOrderById(orderId);
        
        console.log("Order status updated:", orderId, "new status:", body.status);
        // MongoDB Change Streams will automatically detect this change

        return NextResponse.json({
          success: true,
          order: updatedOrder,
        });
      }
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
      message: "Order cancelled successfully",
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete order" },
      { status: 500 }
    );
  }
}
