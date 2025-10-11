import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/db/connection";

export async function DELETE() {
  try {
    const db = await connectToDatabase();
    const menuItemsCollection = db.collection("menuItems");
    
    // Delete all menu items
    const result = await menuItemsCollection.deleteMany({});
    
    return NextResponse.json({
      success: true,
      message: `Cleared ${result.deletedCount} menu items from database`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error("Error clearing menu items:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to clear menu items" 
      },
      { status: 500 }
    );
  }
}