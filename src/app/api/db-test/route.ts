import { NextResponse } from "next/server";
import { connectToDatabase, getConnectionStats } from "@/app/db/connection";

export async function GET() {
  try {
    console.log("=== DB Connection Test ===");

    // Test 1: Get initial connection
    console.log("Test 1: Getting initial connection...");
    const db1 = await connectToDatabase();
    console.log("✅ Got first connection");

    // Test 2: Get connection again (should reuse)
    console.log("Test 2: Getting connection again (should reuse)...");
    const db2 = await connectToDatabase();
    console.log("✅ Got second connection");

    // Test 3: Check if they're the same instance
    const sameInstance = db1 === db2;
    console.log(`Test 3: Same instance? ${sameInstance}`);

    // Test 4: Get connection stats
    const stats = await getConnectionStats();
    console.log("Test 4: Connection stats:", JSON.stringify(stats, null, 2));

    // Test 5: Simple query
    console.log("Test 5: Testing simple query...");
    await db1.admin().ping();
    console.log("✅ Ping successful");

    return NextResponse.json({
      success: true,
      tests: {
        connectionReuse: sameInstance,
        stats: stats,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("DB Test failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
