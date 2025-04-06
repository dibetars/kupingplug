import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isLoginPage = request.nextUrl.pathname === '/admin/login';
  
  // Get the session token from cookies
  const sessionToken = request.cookies.get('sessionToken')?.value;

  // If trying to access admin routes without being logged in
  if (isAdminRoute && !isLoginPage && !sessionToken) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // If already logged in and trying to access login page
  if (isLoginPage && sessionToken) {
    return NextResponse.redirect(new URL('/admin/artists', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}; 