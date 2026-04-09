import type { Metadata, Viewport } from 'next';
import { Figtree, Instrument_Serif } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import Providers from '@/components/Providers';
import { ThemeContextProvider } from '@/components/ThemeContext';
import './globals.css';
import { cn } from "@/lib/utils";

const figtree = Figtree({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800'],
    variable: '--font-sans',
    display: 'swap',
});

const instrumentSerif = Instrument_Serif({
    subsets: ['latin'],
    weight: '400',
    style: ['normal', 'italic'],
    variable: '--font-display',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'TaskTurtle — Focus on What Matters',
    description:
        'Eisenhower Matrix task manager with Google Calendar integration. Manage priorities, schedule time blocks, and get things done.',
    manifest: '/manifest.json',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black-translucent',
        title: 'TaskTurtle',
    },
};

export const viewport: Viewport = {
    themeColor: '#0a0f0c',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={cn('antialiased', figtree.variable, instrumentSerif.variable)}>
            <head>
                <link rel="icon" href="/icons/icon-192.png" type="image/png" />
                <link rel="apple-touch-icon" href="/icons/icon-192.png" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:ital,opsz,wght@0,6..144,100..700;1,6..144,100..700&family=Roboto:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap" rel="stylesheet" />
            </head>
            <body>
                <Providers>
                    <AppRouterCacheProvider>
                        <ThemeContextProvider>
                            {children}
                        </ThemeContextProvider>
                    </AppRouterCacheProvider>
                </Providers>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            if ('serviceWorker' in navigator) {
                                window.addEventListener('load', () => {
                                    navigator.serviceWorker.register('/sw.js');
                                });
                            }
                        `,
                    }}
                />
            </body>
        </html>
    );
}
