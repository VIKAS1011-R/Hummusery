import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/db/connection";
import { sendOTPEmail, generateOTP, generateVerificationToken } from "@/app/lib/emailService";
import { ObjectId } from "mongodb";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    // Find user by email
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.isEmailVerified) {
      return NextResponse.json(
        { error: "Email is already verified" },
        { status: 400 }
      );
    }

    // Generate OTP and verification token
    const otp = generateOTP();
    const verificationToken = generateVerificationToken();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update user with OTP and token
    await usersCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          emailVerificationOTP: otp,
          emailVerificationToken: verificationToken,
          otpExpiresAt,
          tokenExpiresAt,
          updatedAt: new Date()
        }
      }
    );

    // Send OTP email
    const emailSent = await sendOTPEmail(email, user.name, otp, verificationToken);

    if (!emailSent) {
      return NextResponse.json(
        { error: "Failed to send verification email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Verification code sent to your email",
      expiresAt: otpExpiresAt.toISOString()
    });

  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}