import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to verify page without authentication
  if (pathname === '/verify') {
    return NextResponse.next();
  }

  // Check for verification cookie
  const verified = request.cookies.get('verified');

  if (!verified || verified.value !== 'true') {
    // Redirect to verify page if not authenticated
    return NextResponse.redirect(new URL('/verify', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
