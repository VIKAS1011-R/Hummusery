import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/db/connection";

export async function POST() {
  try {
    console.log("🔥 Warming up database connection...");
    
    // Establish connection
    const db = await connectToDatabase();
    
    // Perform a simple operation to ensure connection is working
    await db.admin().ping();
    
    // Optionally, you could also warm up collections
    const collections = await db.listCollections().toArray();
    
    console.log("✅ Database connection warmed up successfully");
    
    return NextResponse.json({
      success: true,
      message: "Database connection warmed up successfully",
      collections: collections.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("❌ Database warmup failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Also allow GET for easy testing
export async function GET() {
  return POST();
}