import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/db/connection";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Reset token and new password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
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

    // Hash the new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update user password and clear reset token
    await usersCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date()
        },
        $unset: {
          passwordResetToken: "",
          passwordResetExpiry: ""
        }
      }
    );

    return NextResponse.json({
      success: true,
      message: "Password has been reset successfully"
    });

  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}