import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Lightweight middleware that checks for an Auth.js session cookie.
 * We do NOT use the full `auth()` here because PrismaAdapter cannot
 * run in Edge Runtime. Actual session validation happens in API routes.
 */
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Public marketing/legal pages and auth endpoints (no session required)
    if (
        pathname === '/' ||
        pathname === '/privacy' ||
        pathname === '/terms' ||
        pathname.startsWith('/api/auth') ||
        pathname.startsWith('/_next') ||
        pathname === '/favicon.ico' ||
        pathname === '/sw.js' ||
        pathname === '/manifest.json' ||
        pathname.startsWith('/icons/')
    ) {
        return NextResponse.next();
    }

    const sessionCookie =
        request.cookies.get('authjs.session-token') ||
        request.cookies.get('__Secure-authjs.session-token');

    // Login: allow only when logged out; signed-in users go to dashboard
    if (pathname === '/login') {
        if (sessionCookie) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
        return NextResponse.next();
    }

    if (!sessionCookie) {
        if (pathname.startsWith('/api/')) {
            return NextResponse.next();
        }
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all routes except:
         * - api/auth (auth endpoints)
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico
         */
        '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
    ],
};
