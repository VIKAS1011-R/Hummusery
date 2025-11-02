import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/db/connection";
import { sendWelcomeEmail } from "@/app/lib/emailService";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    // Find user by verification token
    const user = await usersCollection.findOne({ 
      emailVerificationToken: token 
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid verification token" },
        { status: 400 }
      );
    }

    if (user.isEmailVerified) {
      return NextResponse.json(
        { error: "Email is already verified" },
        { status: 400 }
      );
    }

    // Check if token is not expired
    if (!user.tokenExpiresAt || new Date() > new Date(user.tokenExpiresAt)) {
      return NextResponse.json(
        { error: "Verification token has expired. Please request a new verification email." },
        { status: 400 }
      );
    }

    // Update user as verified and clear verification fields
    await usersCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          isEmailVerified: true,
          updatedAt: new Date()
        },
        $unset: {
          emailVerificationOTP: "",
          emailVerificationToken: "",
          otpExpiresAt: "",
          tokenExpiresAt: ""
        }
      }
    );

    // Generate new JWT token with updated verification status
    const jwtToken = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        name: user.name,
        phone: user.phone || "",
        role: user.role || "customer",
        isEmailVerified: true // Updated verification status
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // Send welcome email (don't wait for it)
    sendWelcomeEmail(user.email, user.name).catch(error => {
      console.error("Error sending welcome email:", error);
    });

    const response = NextResponse.json({
      success: true,
      message: "Email verified successfully! Welcome to Hummusery!",
      user: {
        name: user.name,
        email: user.email
      }
    });

    // Set the updated token as a cookie
    response.cookies.set("auth-token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/"
    });

    return response;

  } catch (error) {
    console.error("Error verifying token:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}