import { create } from 'zustand';

export type EisenhowerQuadrant = 'DO_FIRST' | 'SCHEDULE' | 'DELEGATE' | 'ELIMINATE';
export type TaskHorizon = 'SHORT_TERM' | 'LONG_TERM';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'ARCHIVED';

export interface Task {
    id: string;
    title: string;
    description?: string;
    quadrant: EisenhowerQuadrant;
    horizon: TaskHorizon;
    status: TaskStatus;
    estimatedMinutes?: number;
    actualMinutes?: number;
    dueDate?: string;
    calendarEventId?: string;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
}

export interface DailyPlanTask {
    id: string;
    taskId: string;
    task: Task;
    timeSlotStart?: string;
    timeSlotEnd?: string;
    sortOrder: number;
}

export interface DailyPlan {
    id: string;
    date: string;
    tasks: DailyPlanTask[];
}

interface TaskStore {
    // Task state
    tasks: Task[];
    isLoading: boolean;
    error: string | null;

    // Daily plan
    todayPlan: DailyPlan | null;

    // Quick add dialog
    quickAddOpen: boolean;
    draftQuadrant: EisenhowerQuadrant | null;
    editingTask: Task | null;

    // Actions
    setTasks: (tasks: Task[]) => void;
    addTask: (task: Task) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    removeTask: (id: string) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setTodayPlan: (plan: DailyPlan | null) => void;
    setQuickAddOpen: (open: boolean, quadrant?: EisenhowerQuadrant) => void;
    setEditingTask: (task: Task | null) => void;

    // Fetch helpers
    fetchTasks: () => Promise<void>;
    createTask: (data: Partial<Task>) => Promise<Task | null>;
    patchTask: (id: string, data: Partial<Task>) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
    tasks: [],
    isLoading: false,
    error: null,
    todayPlan: null,
    quickAddOpen: false,
    draftQuadrant: null,
    editingTask: null,

    setTasks: (tasks) => set({ tasks }),
    addTask: (task) => set((s) => ({ tasks: [...s.tasks, task] })),
    updateTask: (id, updates) =>
        set((s) => ({
            tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),
    removeTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
    setTodayPlan: (todayPlan) => set({ todayPlan }),
    setQuickAddOpen: (open, quadrant) => set({ quickAddOpen: open, draftQuadrant: quadrant || null }),
    setEditingTask: (editingTask) => set({ editingTask, quickAddOpen: !!editingTask }),

    fetchTasks: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await fetch('/api/tasks');
            if (!res.ok) throw new Error('Failed to fetch tasks');
            const tasks = await res.json();
            set({ tasks, isLoading: false });
        } catch (e) {
            set({ error: (e as Error).message, isLoading: false });
        }
    },

    createTask: async (data) => {
        try {
            const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to create task');
            const task = await res.json();
            get().addTask(task);
            return task;
        } catch (e) {
            set({ error: (e as Error).message });
            return null;
        }
    },

    patchTask: async (id, data) => {
        try {
            const res = await fetch(`/api/tasks/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to update task');
            const updated = await res.json();
            get().updateTask(id, updated);
        } catch (e) {
            set({ error: (e as Error).message });
        }
    },

    deleteTask: async (id) => {
        try {
            const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete task');
            get().removeTask(id);
        } catch (e) {
            set({ error: (e as Error).message });
        }
    },
}));
