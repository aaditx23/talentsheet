import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Next.js 16+ proxy convention (replaces middleware.ts)
// Only checks cookie presence — full JWT verification happens in Server Actions (Node.js runtime)
// since Edge runtime does not support Node.js crypto modules.

export default function proxy(request: NextRequest) {
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
