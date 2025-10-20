import { NextRequest, NextResponse } from "next/server";
import { MenuItemService } from "@/app/db/services/menuItemService";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const menuItem = await MenuItemService.getMenuItemById(id);

    if (!menuItem) {
      return NextResponse.json(
        { error: "Menu item not found" },
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
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}