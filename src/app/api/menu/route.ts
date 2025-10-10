import { NextRequest, NextResponse } from "next/server";
import { MenuItemService } from "@/app/db/services/menuItemService";
import { CreateMenuItemData } from "@/app/db/models/MenuItem";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeUnavailable = searchParams.get('includeUnavailable') === 'true';
    const category = searchParams.get('category');
    const vegOnly = searchParams.get('vegOnly') === 'true';

    let menuItems;

    if (category) {
      menuItems = await MenuItemService.getMenuItemsByCategory(category);
    } else if (vegOnly) {
      menuItems = await MenuItemService.getVegMenuItems();
    } else {
      menuItems = await MenuItemService.getAllMenuItems(includeUnavailable);
    }

    return NextResponse.json({
      success: true,
      menuItems,
      count: menuItems.length
    });
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to fetch menu items" 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { name, ingredients, isVeg, price } = body;
    
    if (!name || !ingredients || typeof isVeg !== 'boolean' || typeof price !== 'number') {
      return NextResponse.json(
        { 
          success: false, 
          error: "Missing or invalid required fields: name, ingredients, isVeg, price" 
        },
        { status: 400 }
      );
    }

    if (price <= 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Price must be greater than 0" 
        },
        { status: 400 }
      );
    }

    if (name.trim().length < 2) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Name must be at least 2 characters long" 
        },
        { status: 400 }
      );
    }

    if (ingredients.trim().length < 10) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Ingredients description must be at least 10 characters long" 
        },
        { status: 400 }
      );
    }

    const menuItemData: CreateMenuItemData = {
      name: name.trim(),
      ingredients: ingredients.trim(),
      isVeg,
      price,
      category: body.category?.trim() || "Main Course",
      isAvailable: body.isAvailable !== undefined ? body.isAvailable : true
    };

    const newMenuItem = await MenuItemService.createMenuItem(menuItemData);

    return NextResponse.json({
      success: true,
      menuItem: newMenuItem,
      message: "Menu item created successfully"
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating menu item:", error);
    
    if (error instanceof Error && error.message.includes("already exists")) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to create menu item" 
      },
      { status: 500 }
    );
  }
}