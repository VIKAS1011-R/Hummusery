import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/db/connection";
import { sendWelcomeEmail } from "@/app/lib/emailService";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    console.log("Verify OTP request:", { email, otp: otp ? "***" : undefined });

    if (!email || !otp) {
      console.log("Missing email or OTP");
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    // Find user by email
    const user = await usersCollection.findOne({ email });

    if (!user) {
      console.log("User not found:", email);
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    console.log("User found:", { 
      email: user.email, 
      isVerified: user.isEmailVerified,
      hasOTP: !!user.emailVerificationOTP,
      otpExpiry: user.otpExpiresAt
    });

    if (user.isEmailVerified) {
      console.log("Email already verified");
      return NextResponse.json(
        { error: "Email is already verified" },
        { status: 400 }
      );
    }

    // Check if OTP exists and is not expired
    if (!user.emailVerificationOTP || !user.otpExpiresAt) {
      console.log("No OTP or expiry found in database");
      return NextResponse.json(
        { error: "No verification code found. Please request a new one." },
        { status: 400 }
      );
    }

    if (new Date() > new Date(user.otpExpiresAt)) {
      console.log("OTP expired:", { 
        now: new Date(), 
        expiry: new Date(user.otpExpiresAt) 
      });
      return NextResponse.json(
        { error: "Verification code has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Verify OTP
    if (user.emailVerificationOTP !== otp) {
      console.log("OTP mismatch:", { 
        provided: otp, 
        stored: user.emailVerificationOTP 
      });
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 }
      );
    }

    console.log("OTP verified successfully");

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
    const token = jwt.sign(
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
    sendWelcomeEmail(email, user.name).catch(error => {
      console.error("Error sending welcome email:", error);
    });

    const response = NextResponse.json({
      success: true,
      message: "Email verified successfully! Welcome to Hummusery!"
    });

    // Set the updated token as a cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/"
    });

    return response;

  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}