import { NextResponse } from "next/server";
import { checkDatabaseHealth, getConnectionStats } from "@/app/db/connection";

export async function GET() {
  try {
    const isHealthy = await checkDatabaseHealth();
    const stats = await getConnectionStats();
    
    return NextResponse.json({
      success: true,
      healthy: isHealthy,
      timestamp: new Date().toISOString(),
      ...stats
    });
  } catch (error) {
    console.error("Database health check error:", error);
    return NextResponse.json(
      {
        success: false,
        healthy: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}