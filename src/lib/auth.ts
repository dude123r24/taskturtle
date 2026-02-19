import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
            authorization: {
                params: {
                    prompt: 'consent',
                    access_type: 'offline',
                    response_type: 'code',
                    scope:
                        'openid email profile https://www.googleapis.com/auth/calendar',
                },
            },
        }),
    ],
    session: {
        strategy: 'database',
    },
    callbacks: {
        async session({ session, user }) {
            // Attach userId to session for API routes
            session.user.id = user.id;

            // Refresh Google access token if expired
            const [googleAccount] = await prisma.account.findMany({
                where: { userId: user.id, provider: 'google' },
            });

            if (googleAccount?.expires_at && googleAccount.expires_at * 1000 < Date.now()) {
                try {
                    const response = await fetch('https://oauth2.googleapis.com/token', {
                        method: 'POST',
                        body: new URLSearchParams({
                            client_id: process.env.AUTH_GOOGLE_ID!,
                            client_secret: process.env.AUTH_GOOGLE_SECRET!,
                            grant_type: 'refresh_token',
                            refresh_token: googleAccount.refresh_token!,
                        }),
                    });

                    const tokens = await response.json();

                    if (!response.ok) throw tokens;

                    await prisma.account.update({
                        data: {
                            access_token: tokens.access_token,
                            expires_at: Math.floor(Date.now() / 1000 + tokens.expires_in),
                            refresh_token: tokens.refresh_token ?? googleAccount.refresh_token,
                        },
                        where: {
                            provider_providerAccountId: {
                                provider: 'google',
                                providerAccountId: googleAccount.providerAccountId,
                            },
                        },
                    });
                } catch (error) {
                    console.error('Error refreshing access_token', error);
                }
            }

            return session;
        },
    },
    pages: {
        signIn: '/login',
    },
});
