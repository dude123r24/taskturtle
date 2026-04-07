/** Route → app bar title (longest prefix wins). */
const ROUTE_TITLES: { prefix: string; title: string }[] = [
    { prefix: '/admin', title: 'Admin' },
    { prefix: '/settings', title: 'Settings' },
    { prefix: '/planner', title: 'Planner' },
    { prefix: '/dashboard', title: 'Dashboard' },
    { prefix: '/features', title: 'Features' },
    { prefix: '/focus', title: 'Focus' },
    { prefix: '/chat', title: 'AI Assistant' },
    { prefix: '/calendar', title: 'Calendar' },
    { prefix: '/tasks', title: 'Tasks' },
]

export function getPageTitle(pathname: string): string {
    const hit = ROUTE_TITLES.find((r) => pathname === r.prefix || pathname.startsWith(`${r.prefix}/`))
    return hit?.title ?? 'TaskTurtle'
}

/**
 * Bottom nav: Dashboard · Tasks · Planner · More — other routes map to __more.
 */
export function getBottomNavValue(pathname: string): string {
    if (pathname === '/dashboard' || pathname.startsWith('/dashboard/')) return '/dashboard'
    if (pathname === '/tasks' || pathname.startsWith('/tasks/')) return '/tasks'
    if (pathname === '/planner' || pathname.startsWith('/planner/')) return '/planner'
    return '__more'
}
