import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import mongoChangeStreamsService from "@/app/lib/mongodb-changestreams";

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = verify(token, process.env.JWT_SECRET!) as { 
      userId: string; 
      email: string; 
      role: string; 
    };

    console.log('Initializing MongoDB Change Streams for user:', decoded.userId);

    // Initialize the MongoDB Change Streams service
    await mongoChangeStreamsService.initialize();

    const status = mongoChangeStreamsService.getConnectionStatus();

    return NextResponse.json({
      success: true,
      message: "MongoDB real-time service initialized",
      status: status
    });

  } catch (error) {
    console.error("Error initializing MongoDB real-time:", error);
    return NextResponse.json(
      { error: "Failed to initialize real-time service" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const status = mongoChangeStreamsService.getConnectionStatus();

    return NextResponse.json({
      success: true,
      status: status
    });

  } catch (error) {
    console.error("Error getting real-time status:", error);
    return NextResponse.json(
      { error: "Failed to get status" },
      { status: 500 }
    );
  }
}