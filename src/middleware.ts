import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Lightweight middleware that checks for an Auth.js session cookie.
 * We do NOT use the full `auth()` here because PrismaAdapter cannot
 * run in Edge Runtime. Actual session validation happens in API routes.
 */
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow root (Landing Page), login, auth endpoints, and static files through
    if (
        pathname === '/' ||
        pathname === '/login' ||
        pathname.startsWith('/api/auth') ||
        pathname.startsWith('/_next') ||
        pathname === '/favicon.ico'
    ) {
        return NextResponse.next();
    }

    // Check for Auth.js session cookie (database strategy uses this name)
    const sessionCookie =
        request.cookies.get('authjs.session-token') ||
        request.cookies.get('__Secure-authjs.session-token');

    if (!sessionCookie) {
        // No session cookie → redirect to login for page requests
        // For API requests → let the route handler return 401
        if (pathname.startsWith('/api/')) {
            return NextResponse.next();
        }
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    // If user is already authenticated and trying to access login page, redirect to dashboard
    if (pathname === '/login') {
        const dashboardUrl = new URL('/dashboard', request.url);
        return NextResponse.redirect(dashboardUrl);
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
