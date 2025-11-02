import { NextRequest, NextResponse } from "next/server";
import { MenuItemService } from "@/app/db/services/menuItemService";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "@/app/db/connection";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

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
      menuItem,
    });
  } catch (error) {
    console.error("Error fetching menu item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Update menu item
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin authentication
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const db = await connectToDatabase();

    const user = await db.collection("users").findOne({
      _id: new ObjectId(decoded.userId),
    });

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const updateData = await request.json();

    // Validate required fields
    if (
      !updateData.name ||
      !updateData.ingredients ||
      updateData.price === undefined
    ) {
      return NextResponse.json(
        { error: "Name, ingredients, and price are required" },
        { status: 400 }
      );
    }

    const updatedMenuItem = await MenuItemService.updateMenuItem(id, {
      ...updateData,
      updatedAt: new Date(),
    });

    if (!updatedMenuItem) {
      return NextResponse.json(
        { error: "Menu item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      menuItem: updatedMenuItem,
    });
  } catch (error) {
    console.error("Error updating menu item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Delete menu item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin authentication
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const db = await connectToDatabase();

    const user = await db.collection("users").findOne({
      _id: new ObjectId(decoded.userId),
    });

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const { id } = await params;

    const deleted = await MenuItemService.deleteMenuItem(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Menu item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
