import { NextRequest, NextResponse } from "next/server";
import { MenuItemService } from "@/app/db/services/menuItemService";
import { UpdateMenuItemData } from "@/app/db/models/MenuItem";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const menuItem = await MenuItemService.getMenuItemById(id);

    if (!menuItem) {
      return NextResponse.json(
        { success: false, error: "Menu item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      menuItem
    });
  } catch (error) {
    console.error("Error fetching menu item:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to fetch menu item" 
      },
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

    // Validate fields if provided
    if (body.name && body.name.trim().length < 2) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Name must be at least 2 characters long" 
        },
        { status: 400 }
      );
    }

    if (body.ingredients && body.ingredients.trim().length < 10) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Ingredients description must be at least 10 characters long" 
        },
        { status: 400 }
      );
    }

    if (body.price !== undefined && (typeof body.price !== 'number' || body.price <= 0)) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Price must be a number greater than 0" 
        },
        { status: 400 }
      );
    }

    if (body.isVeg !== undefined && typeof body.isVeg !== 'boolean') {
      return NextResponse.json(
        { 
          success: false, 
          error: "isVeg must be a boolean value" 
        },
        { status: 400 }
      );
    }

    const updateData: UpdateMenuItemData = {};
    
    if (body.name !== undefined) updateData.name = body.name;
    if (body.ingredients !== undefined) updateData.ingredients = body.ingredients;
    if (body.isVeg !== undefined) updateData.isVeg = body.isVeg;
    if (body.price !== undefined) updateData.price = body.price;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.isAvailable !== undefined) updateData.isAvailable = body.isAvailable;

    const updatedMenuItem = await MenuItemService.updateMenuItem(id, updateData);

    if (!updatedMenuItem) {
      return NextResponse.json(
        { success: false, error: "Menu item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      menuItem: updatedMenuItem,
      message: "Menu item updated successfully"
    });

  } catch (error) {
    console.error("Error updating menu item:", error);
    
    if (error instanceof Error && error.message.includes("already exists")) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 409 }
      );
    }

    if (error instanceof Error && error.message.includes("Invalid")) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to update menu item" 
      },
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
    const deleted = await MenuItemService.deleteMenuItem(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Menu item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Menu item deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting menu item:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to delete menu item" 
      },
      { status: 500 }
    );
  }
}