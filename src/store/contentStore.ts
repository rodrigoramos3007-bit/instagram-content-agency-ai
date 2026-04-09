import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ContentIdea, GeneratedContent, HashtagSet, GeneratedImage, ContentTemplate } from '@/types/content';

interface ContentState {
  ideas: ContentIdea[];
  contents: GeneratedContent[];
  hashtagSets: HashtagSet[];
  images: GeneratedImage[];
  templates: ContentTemplate[];
  favorites: string[];
  addIdea: (idea: ContentIdea) => void;
  updateIdea: (id: string, updates: Partial<ContentIdea>) => void;
  removeIdea: (id: string) => void;
  setIdeas: (ideas: ContentIdea[]) => void;
  addContent: (content: GeneratedContent) => void;
  updateContent: (id: string, updates: Partial<GeneratedContent>) => void;
  removeContent: (id: string) => void;
  addHashtagSet: (set: HashtagSet) => void;
  removeHashtagSet: (id: string) => void;
  addImage: (image: GeneratedImage) => void;
  removeImage: (id: string) => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  clearAll: () => void;
}

export const useContentStore = create<ContentState>()(
  persist(
    (set, get) => ({
      ideas: [],
      contents: [],
      hashtagSets: [],
      images: [],
      templates: [],
      favorites: [],
      addIdea: (idea) => set((s) => ({ ideas: [idea, ...s.ideas] })),
      updateIdea: (id, updates) =>
        set((s) => ({ ideas: s.ideas.map((i) => (i.id === id ? { ...i, ...updates } : i)) })),
      removeIdea: (id) => set((s) => ({ ideas: s.ideas.filter((i) => i.id !== id) })),
      setIdeas: (ideas) => set({ ideas }),
      addContent: (content) => set((s) => ({ contents: [content, ...s.contents] })),
      updateContent: (id, updates) =>
        set((s) => ({
          contents: s.contents.map((c) =>
            c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
          ),
        })),
      removeContent: (id) => set((s) => ({ contents: s.contents.filter((c) => c.id !== id) })),
      addHashtagSet: (set_) => set((s) => ({ hashtagSets: [set_, ...s.hashtagSets] })),
      removeHashtagSet: (id) => set((s) => ({ hashtagSets: s.hashtagSets.filter((h) => h.id !== id) })),
      addImage: (image) => set((s) => ({ images: [image, ...s.images] })),
      removeImage: (id) => set((s) => ({ images: s.images.filter((i) => i.id !== id) })),
      toggleFavorite: (id) =>
        set((s) => ({
          favorites: s.favorites.includes(id)
            ? s.favorites.filter((f) => f !== id)
            : [...s.favorites, id],
        })),
      isFavorite: (id) => get().favorites.includes(id),
      clearAll: () => set({ ideas: [], contents: [], hashtagSets: [], images: [], favorites: [] }),
    }),
    { name: 'content-storage' }
  )
);
