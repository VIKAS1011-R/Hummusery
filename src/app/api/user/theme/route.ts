import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/db/connection";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET(request: NextRequest) {
  try {
    // Get user from JWT token
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const db = await connectToDatabase();
    
    const user = await db.collection("users").findOne({
      _id: new ObjectId(decoded.userId)
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      theme: user.theme || "dark"
    });

  } catch (error) {
    console.error("Error fetching user theme:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Get user from JWT token
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const { theme } = await request.json();

    // Validate theme
    if (!theme || (theme !== "light" && theme !== "dark")) {
      return NextResponse.json(
        { error: "Invalid theme. Must be 'light' or 'dark'" },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(decoded.userId) },
      { 
        $set: { 
          theme: theme,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Theme updated successfully",
      theme: theme
    });

  } catch (error) {
    console.error("Error updating user theme:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}