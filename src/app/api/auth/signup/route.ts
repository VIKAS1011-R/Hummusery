import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/app/db/services/userService";
import { CreateUserData } from "@/app/db/models/User";
import { sendOTPEmail, generateOTP, generateVerificationToken } from "@/app/lib/emailService";
import { cookies } from "next/headers";
import { sign } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    // Add timeout to the entire signup process
    const signupTimeout = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Signup process timeout after 25 seconds')), 25000)
    );

    const signupProcess = async () => {
      const body = await request.json();
      const { name, email, phone, password } = body;

    // Validate input
    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { error: "Name, email, phone, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Phone validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit phone number" },
        { status: 400 }
      );
    }

      // Create user (not verified initially)
      const user = await UserService.createUser({ name, email, phone, password });

      // Generate OTP and verification token
      const otp = generateOTP();
      const verificationToken = generateVerificationToken();
      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Update user with verification data
      await UserService.updateUserVerificationData(user._id, {
        emailVerificationOTP: otp,
        emailVerificationToken: verificationToken,
        otpExpiresAt,
        tokenExpiresAt
      });

      // Send OTP email (don't wait for it to complete to avoid timeout)
      sendOTPEmail(email, name, otp, verificationToken).catch(error => {
        console.error("Failed to send verification email to:", email, error);
      });

      // Generate JWT token for the unverified user
      const token = sign(
        { 
          userId: user._id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          role: user.role,
          isEmailVerified: false
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Set authentication cookie
      const cookieStore = await cookies();
      cookieStore.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60, // 24 hours
        path: '/',
      });

      return NextResponse.json(
        {
          message: "Account created successfully! Please check your email to verify your account.",
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            isEmailVerified: false,
            createdAt: user.createdAt,
          },
          requiresVerification: true,
          otpExpiresAt: otpExpiresAt.toISOString()
        },
        { status: 201 }
      );
    };

    // Race between signup process and timeout
    return await Promise.race([signupProcess(), signupTimeout]);
  } catch (error) {
    console.error("Signup error:", error);

    if (error instanceof Error) {
      if (error.message === "User with this email already exists") {
        return NextResponse.json(
          { error: "An account with this email already exists" },
          { status: 409 }
        );
      }
      
      if (error.message.includes('timeout')) {
        return NextResponse.json(
          { error: "Signup is taking longer than expected. Please try again or check your connection." },
          { status: 408 }
        );
      }
      
      if (error.message.includes('Connection')) {
        return NextResponse.json(
          { error: "Database connection issue. Please try again in a moment." },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
