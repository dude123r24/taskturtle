import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Add admin emails here
const ADMIN_EMAILS = [
    'sanghviamit1@gmail.com',
];

export async function GET() {
    const session = await auth();
    if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // ── User Stats ──────────────────────────────────────────────────
    const totalUsers = await prisma.user.count();
    const newUsersLast7d = await prisma.user.count({
        where: { createdAt: { gte: sevenDaysAgo } },
    });
    const newUsersLast30d = await prisma.user.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
    });

    // Active users = users with at least one task updated in last 7 days
    const activeUsersLast7d = await prisma.task.groupBy({
        by: ['userId'],
        where: { updatedAt: { gte: sevenDaysAgo } },
    });

    // ── Task Stats ──────────────────────────────────────────────────
    const totalTasks = await prisma.task.count();
    const tasksByStatus = await prisma.task.groupBy({
        by: ['status'],
        _count: { id: true },
    });
    const tasksByQuadrant = await prisma.task.groupBy({
        by: ['quadrant'],
        _count: { id: true },
    });
    const tasksCreatedLast7d = await prisma.task.count({
        where: { createdAt: { gte: sevenDaysAgo } },
    });

    // ── Feature Usage ───────────────────────────────────────────────
    const totalDailyPlans = await prisma.dailyPlan.count();
    const dailyPlansLast7d = await prisma.dailyPlan.count({
        where: { createdAt: { gte: sevenDaysAgo } },
    });
    const plannerUsers = await prisma.dailyPlan.groupBy({ by: ['userId'] });

    const totalCalendarAccounts = await prisma.calendarAccount.count();
    const calendarUsers = await prisma.calendarAccount.groupBy({ by: ['userId'] });

    const settingsConfigured = await prisma.userSettings.count();

    // ── Per-User Summary ────────────────────────────────────────────
    const usersWithTaskCounts = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            _count: {
                select: {
                    tasks: true,
                    dailyPlans: true,
                    calendarAccounts: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
    });

    return NextResponse.json({
        users: {
            total: totalUsers,
            newLast7d: newUsersLast7d,
            newLast30d: newUsersLast30d,
            activeLast7d: activeUsersLast7d.length,
        },
        tasks: {
            total: totalTasks,
            createdLast7d: tasksCreatedLast7d,
            byStatus: Object.fromEntries(
                tasksByStatus.map((s) => [s.status, s._count.id])
            ),
            byQuadrant: Object.fromEntries(
                tasksByQuadrant.map((q) => [q.quadrant, q._count.id])
            ),
        },
        features: {
            planner: {
                totalPlans: totalDailyPlans,
                plansLast7d: dailyPlansLast7d,
                uniqueUsers: plannerUsers.length,
            },
            calendar: {
                totalAccounts: totalCalendarAccounts,
                uniqueUsers: calendarUsers.length,
            },
            settingsConfigured,
        },
        userList: usersWithTaskCounts.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            createdAt: u.createdAt,
            taskCount: u._count.tasks,
            planCount: u._count.dailyPlans,
            calendarCount: u._count.calendarAccounts,
        })),
    });
}
