import { NextResponse } from "next/server";
import { createAdminUser } from "@/app/db/seeds/createAdmin";

export async function POST() {
  try {
    const result = await createAdminUser();
    
    return NextResponse.json({
      success: true,
      message: result.created ? "Admin user created successfully" : "Admin user already exists",
      created: result.created,
      ...(result.created && { credentials: result.credentials })
    });
  } catch (error) {
    console.error("Error creating admin user:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to create admin user" 
      },
      { status: 500 }
    );
  }
}