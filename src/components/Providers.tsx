'use client';

import { SessionProvider } from 'next-auth/react';

/**
 * Pin basePath so client auth calls always hit /api/auth even if NEXTAUTH_URL
 * is missing or mis-inlined in the browser bundle.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
    return <SessionProvider basePath="/api/auth">{children}</SessionProvider>;
}
