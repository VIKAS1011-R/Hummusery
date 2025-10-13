import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    console.log("Auth check - Token exists:", !!token);

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const decoded = verify(token, JWT_SECRET) as { 
      userId: string; 
      email: string; 
      name: string; 
      phone: string;
      role: string; 
    };
    
    console.log("Auth check - Decoded token:", { 
      userId: decoded.userId, 
      email: decoded.email, 
      name: decoded.name 
    });
    
    return NextResponse.json({
      user: {
        id: decoded.userId,
        email: decoded.email,
        name: decoded.name,
        phone: decoded.phone,
        role: decoded.role
      }
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ user: null });
  }
}