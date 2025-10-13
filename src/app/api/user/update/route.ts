import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/app/db/connection";
import { ObjectId } from "mongodb";

export async function PATCH(request: NextRequest) {
  try {
    // Get user ID from authentication token
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    let userId: string;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; email: string };
      userId = decoded.userId;
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, email, phone } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Validate phone number if provided
    if (phone) {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(phone)) {
        return NextResponse.json(
          { success: false, error: "Please enter a valid 10-digit phone number" },
          { status: 400 }
        );
      }
    }

    // Update user in database
    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    // Check if email is already taken by another user
    const existingUser = await usersCollection.findOne({
      email: email.toLowerCase(),
      _id: { $ne: new ObjectId(userId) }
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Email is already taken by another account" },
        { status: 409 }
      );
    }

    // Update user
    const updateData: {
      name: string;
      email: string;
      updatedAt: Date;
      phone?: string;
    } = {
      name,
      email: email.toLowerCase(),
      updatedAt: new Date()
    };

    if (phone) {
      updateData.phone = phone;
    }

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully"
    });

  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update profile" },
      { status: 500 }
    );
  }
}