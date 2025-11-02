import { NextRequest, NextResponse } from "next/server";
import { CategoryService } from "@/app/db/services/categoryService";
import { CreateCategoryData } from "@/app/db/models/Category";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "@/app/db/connection";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';

    // Initialize default categories if none exist
    await CategoryService.initializeDefaultCategories();

    const categories = await CategoryService.getAllCategories(includeInactive);

    return NextResponse.json({
      success: true,
      categories,
      count: categories.length
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to fetch categories" 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const db = await connectToDatabase();
    
    const user = await db.collection("users").findOne({
      _id: new ObjectId(decoded.userId)
    });

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    
    // Validate required fields
    const { name } = body;
    
    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { 
          success: false, 
          error: "Category name is required" 
        },
        { status: 400 }
      );
    }

    if (name.trim().length < 2) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Category name must be at least 2 characters long" 
        },
        { status: 400 }
      );
    }

    const categoryData: CreateCategoryData = {
      name: name.trim(),
      description: body.description?.trim() || "",
      isActive: body.isActive !== undefined ? body.isActive : true,
      sortOrder: body.sortOrder
    };

    const newCategory = await CategoryService.createCategory(categoryData);

    return NextResponse.json({
      success: true,
      category: newCategory,
      message: "Category created successfully"
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating category:", error);
    
    if (error instanceof Error && error.message.includes("already exists")) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to create category" 
      },
      { status: 500 }
    );
  }
}