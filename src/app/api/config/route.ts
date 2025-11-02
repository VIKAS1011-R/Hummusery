import { NextRequest, NextResponse } from "next/server";
import { getBaseUrl, getApiUrl } from "@/app/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const baseUrl = getBaseUrl();
    const apiUrl = getApiUrl();
    
    return NextResponse.json({
      success: true,
      config: {
        baseUrl,
        apiUrl,
        environment: process.env.NODE_ENV,
        detectedFrom: getUrlSource(),
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

function getUrlSource(): string {
  if (process.env.VERCEL_URL) return "VERCEL_URL";
  if (process.env.URL) return "Netlify URL";
  if (process.env.NEXT_PUBLIC_APP_URL) return "NEXT_PUBLIC_APP_URL";
  if (process.env.RAILWAY_STATIC_URL) return "RAILWAY_STATIC_URL";
  return "localhost fallback";
}