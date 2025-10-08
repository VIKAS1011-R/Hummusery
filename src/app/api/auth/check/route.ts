import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const decoded = verify(token, JWT_SECRET) as { email: string; name: string };
    
    return NextResponse.json({
      user: {
        email: decoded.email,
        name: decoded.name
      }
    });
  } catch (error) {
    return NextResponse.json({ user: null });
  }
}