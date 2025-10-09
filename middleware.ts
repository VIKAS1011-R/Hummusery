import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the request is for admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // In a real application, you would check for admin authentication here
    // For now, we'll just check if there's any authentication
    const authCookie = request.cookies.get('auth-token');
    
    if (!authCookie) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};