import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/db/connection";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: "Reset token is required" },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    // Find user by reset token
    const user = await usersCollection.findOne({
      passwordResetToken: token
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid reset token" },
        { status: 400 }
      );
    }

    // Check if token has expired
    if (!user.passwordResetExpiry || new Date() > new Date(user.passwordResetExpiry)) {
      return NextResponse.json(
        { error: "Reset token has expired. Please request a new password reset." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Reset token is valid"
    });

  } catch (error) {
    console.error("Error validating reset token:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}