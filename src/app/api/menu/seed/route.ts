import { NextResponse } from "next/server";
import { seedMenuItems } from "@/app/db/seeds/menuItems";

export async function POST() {
  try {
    const result = await seedMenuItems();
    
    return NextResponse.json({
      success: true,
      message: "Menu items seeded successfully",
      created: result.created,
      skipped: result.skipped
    });
  } catch (error) {
    console.error("Error seeding menu items:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to seed menu items" 
      },
      { status: 500 }
    );
  }
}