import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CalendarPost, CalendarView } from '@/types/calendar';

interface CalendarState {
  posts: CalendarPost[];
  view: CalendarView;
  currentDate: string;
  addPost: (post: CalendarPost) => void;
  updatePost: (id: string, updates: Partial<CalendarPost>) => void;
  removePost: (id: string) => void;
  movePost: (id: string, newDate: string) => void;
  setView: (view: CalendarView) => void;
  setCurrentDate: (date: string) => void;
}

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set) => ({
      posts: [],
      view: 'month',
      currentDate: new Date().toISOString(),
      addPost: (post) => set((s) => ({ posts: [...s.posts, post] })),
      updatePost: (id, updates) =>
        set((s) => ({ posts: s.posts.map((p) => (p.id === id ? { ...p, ...updates } : p)) })),
      removePost: (id) => set((s) => ({ posts: s.posts.filter((p) => p.id !== id) })),
      movePost: (id, newDate) =>
        set((s) => ({ posts: s.posts.map((p) => (p.id === id ? { ...p, date: newDate } : p)) })),
      setView: (view) => set({ view }),
      setCurrentDate: (date) => set({ currentDate: date }),
    }),
    { name: 'calendar-storage' }
  )
);
