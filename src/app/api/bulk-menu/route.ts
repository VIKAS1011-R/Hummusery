import { NextRequest, NextResponse } from "next/server";
import { BulkMenuService } from "@/app/db/services/bulkMenuService";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const includeUnavailable = searchParams.get("includeUnavailable") === "true";
    
    const items = await BulkMenuService.getAllItems(includeUnavailable);
    
    return NextResponse.json({
      success: true,
      items,
    });
  } catch (error) {
    console.error("Error fetching bulk menu items:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch bulk menu items" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = [
      "name",
      "description",
      "category",
      "servesPerUnit",
      "pricePerUnit",
      "unitType",
      "minimumOrder",
      "preparationTime",
      "advanceNoticeRequired",
    ];
    
    for (const field of requiredFields) {
      if (!body[field] && body[field] !== 0 && body[field] !== false) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    const newItem = await BulkMenuService.createItem(body);
    
    return NextResponse.json({
      success: true,
      item: newItem,
      message: "Bulk menu item created successfully",
    });
  } catch (error) {
    console.error("Error creating bulk menu item:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create bulk menu item" },
      { status: 500 }
    );
  }
}
