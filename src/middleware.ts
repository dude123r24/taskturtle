export { auth as middleware } from '@/lib/auth';

export const config = {
    matcher: [
        /*
         * Match all routes except:
         * - api/auth (auth endpoints)
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico
         * - login page
         */
        '/((?!api/auth|_next/static|_next/image|favicon.ico|login).*)',
    ],
};
