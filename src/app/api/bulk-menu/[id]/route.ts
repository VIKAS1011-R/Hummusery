import { NextRequest, NextResponse } from "next/server";
import { BulkMenuService } from "@/app/db/services/bulkMenuService";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await BulkMenuService.getItemById(id);
    
    if (!item) {
      return NextResponse.json(
        { success: false, error: "Bulk menu item not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      item,
    });
  } catch (error) {
    console.error("Error fetching bulk menu item:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch bulk menu item" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const updatedItem = await BulkMenuService.updateItem(id, body);
    
    if (!updatedItem) {
      return NextResponse.json(
        { success: false, error: "Bulk menu item not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      item: updatedItem,
      message: "Bulk menu item updated successfully",
    });
  } catch (error) {
    console.error("Error updating bulk menu item:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update bulk menu item" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await BulkMenuService.deleteItem(id);
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: "Bulk menu item not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "Bulk menu item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting bulk menu item:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete bulk menu item" },
      { status: 500 }
    );
  }
}
