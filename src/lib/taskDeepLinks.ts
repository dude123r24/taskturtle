/** Query-string routes for Tasks page deep links from dashboard. */
export const tasksDeepLinks = {
    active: '/tasks?status=active',
    done: '/tasks?status=done',
    overdue: '/tasks?due=overdue',
    dueToday: '/tasks?due=today',
    doFirst: '/tasks?quadrant=DO_FIRST',
    chase: '/tasks?chase=1',
    schedule: '/tasks?quadrant=SCHEDULE',
    backlog: '/tasks?quadrant=UNASSIGNED',
    all: '/tasks',
    /** Feature requests inbox (platform admin). */
    ideas: '/features',
} as const

/** Platform admin (feature pipeline & internal KPIs). */
export const PLATFORM_ADMIN_EMAIL = 'sanghviamit@gmail.com'

export function isPlatformAdmin(email: string | null | undefined): boolean {
    return !!email && email === PLATFORM_ADMIN_EMAIL
}
