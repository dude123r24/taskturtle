import type { Metadata, Viewport } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import Providers from '@/components/Providers';
import { ThemeContextProvider } from '@/components/ThemeContext';
import './globals.css';

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
    themeColor: '#6C63FF',
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
        <html lang="en">
            <head>
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
                />
                <link rel="icon" href="/icons/icon-192.png" type="image/png" />
                <link rel="apple-touch-icon" href="/icons/icon-192.png" />
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
