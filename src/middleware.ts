import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// NOTE: Next.js Middleware runs on the Edge runtime.
// Edge does NOT support Node.js crypto APIs (used by jsonwebtoken/bcryptjs).
// We intentionally only check for cookie presence here as a fast gate.
// Cryptographic JWT verification (jsonwebtoken.verify) happens inside
// Server Actions (getSession) which run in the full Node.js runtime.

export function middleware(request: NextRequest) {
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard');
  const sessionToken = request.cookies.get('portfolio_session')?.value;

  if (isProtectedRoute && !sessionToken) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
