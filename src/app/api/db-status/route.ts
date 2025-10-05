import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function GET() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    return NextResponse.json(
      {
        status: "error",
        message: "DATABASE_URL environment variable is not set",
        connected: false,
      },
      { status: 500 }
    );
  }

  const client = new MongoClient(connectionString);

  try {
    await client.connect();
    await client.db().admin().ping();

    return NextResponse.json({
      status: "success",
      message: "MongoDB connection successful",
      connected: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: `MongoDB connection failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        connected: false,
      },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
