import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getAuthToken } from './services/utils';

export async function middleware(request: NextRequest) {
  // const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const token = await getAuthToken();
  const isAuthenticated = !!token;

  const { pathname } = request.nextUrl;

  if (pathname === '/') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/actionItems', request.url));
    } else {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (isAuthenticated && pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/actionItems', request.url));
  }

  if (!isAuthenticated && pathname.startsWith('/actionItems')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/actionItems/:path*'],
};
