import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/db/connection";
import { sendPasswordResetEmail } from "@/app/lib/emailService";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    // Find user by email
    const user = await usersCollection.findOne({ email: email.toLowerCase() });

    // Always return success to prevent email enumeration attacks
    // But only send email if user exists
    if (user) {
      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

      // Save reset token to user document
      await usersCollection.updateOne(
        { _id: user._id },
        {
          $set: {
            passwordResetToken: resetToken,
            passwordResetExpiry: resetTokenExpiry,
            updatedAt: new Date()
          }
        }
      );

      // Send password reset email
      try {
        await sendPasswordResetEmail(email, user.name, resetToken);
      } catch (emailError) {
        console.error("Error sending password reset email:", emailError);
        // Don't return error to user to prevent information disclosure
      }
    }

    // Always return success message
    return NextResponse.json({
      success: true,
      message: "If an account with that email exists, we've sent a password reset link."
    });

  } catch (error) {
    console.error("Error in forgot password:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}