import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import Providers from '@/components/Providers';
import { ThemeContextProvider } from '@/components/ThemeContext';
import './globals.css';

export const metadata: Metadata = {
    title: 'TaskTurtle — Focus on What Matters',
    description:
        'Eisenhower Matrix task manager with Google Calendar integration. Manage priorities, schedule time blocks, and get things done.',
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
            </head>
            <body>
                <Providers>
                    <AppRouterCacheProvider>
                        <ThemeContextProvider>
                            {children}
                        </ThemeContextProvider>
                    </AppRouterCacheProvider>
                </Providers>
            </body>
        </html>
    );
}
