import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const isAdmin = pathname.startsWith('/admin');
  const isLogin = pathname === '/admin/login';
  if (isAdmin && !isLogin) {
    const cookie = req.cookies.get('idr_admin');
    if (!cookie || cookie.value !== '1') {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};