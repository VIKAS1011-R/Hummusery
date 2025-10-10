import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export function middleware(request: NextRequest) {
  // Check if the request is for admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const authCookie = request.cookies.get('auth-token');
    
    if (!authCookie) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Verify and decode the JWT token
      const decoded = verify(authCookie.value, JWT_SECRET) as { 
        userId: string; 
        email: string; 
        name: string; 
        role: string; 
      };

      // Check if user has admin role
      if (decoded.role !== 'admin') {
        // Redirect to home page if not admin
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      // Invalid token, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};