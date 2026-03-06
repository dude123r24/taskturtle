import { create } from 'zustand';

export type IdeaStatus = 'NEW' | 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';

export interface Idea {
    id: string;
    userId: string;
    title: string;
    description: string | null;
    status: IdeaStatus;
    impact: number;
    effort: number;
    createdAt: string;
    updatedAt: string;
}

interface IdeaStore {
    // State
    ideas: Idea[];
    isLoading: boolean;
    error: string | null;

    // Actions
    setIdeas: (ideas: Idea[]) => void;
    addIdea: (idea: Idea) => void;
    updateIdea: (id: string, updates: Partial<Idea>) => void;
    removeIdea: (id: string) => void;

    // Fetch helpers
    fetchIdeas: () => Promise<void>;
    createIdea: (data: Partial<Idea>) => Promise<Idea | null>;
    patchIdea: (id: string, data: Partial<Idea>) => Promise<void>;
    deleteIdea: (id: string) => Promise<void>;
}

export const useIdeaStore = create<IdeaStore>((set, get) => ({
    ideas: [],
    isLoading: false,
    error: null,

    setIdeas: (ideas) => set({ ideas }),
    addIdea: (idea) => set((s) => ({ ideas: [idea, ...s.ideas] })),
    updateIdea: (id, updates) =>
        set((s) => ({
            ideas: s.ideas.map((i) => (i.id === id ? { ...i, ...updates } : i)),
        })),
    removeIdea: (id) => set((s) => ({ ideas: s.ideas.filter((i) => i.id !== id) })),

    fetchIdeas: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await fetch('/api/ideas');
            if (!res.ok) throw new Error('Failed to fetch ideas');
            const ideas = await res.json();
            set({ ideas, isLoading: false });
        } catch (e) {
            set({ error: (e as Error).message, isLoading: false });
        }
    },

    createIdea: async (data) => {
        try {
            const res = await fetch('/api/ideas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to create idea');
            const idea = await res.json();
            get().addIdea(idea);
            return idea;
        } catch (e) {
            set({ error: (e as Error).message });
            return null;
        }
    },

    patchIdea: async (id, data) => {
        try {
            const res = await fetch(`/api/ideas/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to update idea');
            const updated = await res.json();
            get().updateIdea(id, updated);
        } catch (e) {
            set({ error: (e as Error).message });
        }
    },

    deleteIdea: async (id) => {
        try {
            const res = await fetch(`/api/ideas/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete idea');
            get().removeIdea(id);
        } catch (e) {
            set({ error: (e as Error).message });
        }
    },
}));
