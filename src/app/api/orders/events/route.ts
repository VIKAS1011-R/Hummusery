import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import mongoChangeStreamsService from "@/app/lib/mongodb-changestreams";

export async function GET(request: NextRequest) {
  console.log('Real-time connection request received');
  
  // Verify authentication
  const token = request.cookies.get("auth-token")?.value;
  if (!token) {
    console.log('Real-time connection rejected: No auth token');
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET!) as { 
      userId: string; 
      email: string; 
      role: string; 
    };
    
    console.log('Real-time connection authenticated for user:', decoded.userId, 'role:', decoded.role);

    // Initialize MongoDB Change Streams
    await mongoChangeStreamsService.initialize();

    // Create SSE stream
    const stream = new ReadableStream({
      start(controller) {
        console.log('Real-time client connected, setting up change listener');

        // Send initial connection message
        const welcomeMessage = `data: ${JSON.stringify({
          type: 'connected',
          message: 'Connected to real-time order updates',
          userId: decoded.userId,
          role: decoded.role
        })}\n\n`;
        
        controller.enqueue(new TextEncoder().encode(welcomeMessage));

        // Set up MongoDB change listener
        const cleanup = mongoChangeStreamsService.addListener((event) => {
          try {
            const message = `data: ${JSON.stringify(event)}\n\n`;
            controller.enqueue(new TextEncoder().encode(message));
          } catch (error) {
            console.error('Error sending real-time message:', error);
          }
        });

        // Keep connection alive with periodic heartbeat
        const heartbeat = setInterval(() => {
          try {
            const heartbeatMessage = `data: ${JSON.stringify({
              type: 'heartbeat',
              timestamp: new Date().toISOString()
            })}\n\n`;
            controller.enqueue(new TextEncoder().encode(heartbeatMessage));
          } catch (error) {
            clearInterval(heartbeat);
            cleanup();
          }
        }, 30000); // Send heartbeat every 30 seconds

        // Cleanup on close
        request.signal.addEventListener('abort', () => {
          console.log('Real-time client disconnected, cleaning up');
          clearInterval(heartbeat);
          cleanup();
          controller.close();
        });
      },
      cancel() {
        // Connection closed by client
        console.log('Real-time connection cancelled');
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control',
        'Access-Control-Allow-Credentials': 'true',
        'X-Accel-Buffering': 'no', // Disable nginx buffering
      },
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Invalid token" },
      { status: 401 }
    );
  }
}