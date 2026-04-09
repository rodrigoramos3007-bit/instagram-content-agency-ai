import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Brand, BrandDiagnostic } from '@/types/brand';
import { generateId } from '@/lib/utils';

interface BrandState {
  brand: Brand | null;
  isOnboarded: boolean;
  setBrand: (brand: Brand) => void;
  updateBrand: (updates: Partial<Brand>) => void;
  setDiagnostic: (diagnostic: BrandDiagnostic) => void;
  setOnboarded: (value: boolean) => void;
  clearBrand: () => void;
}

export const useBrandStore = create<BrandState>()(
  persist(
    (set) => ({
      brand: null,
      isOnboarded: false,
      setBrand: (brand) => set({ brand }),
      updateBrand: (updates) =>
        set((state) => ({
          brand: state.brand ? { ...state.brand, ...updates, updatedAt: new Date().toISOString() } : null,
        })),
      setDiagnostic: (diagnostic) =>
        set((state) => ({
          brand: state.brand
            ? { ...state.brand, diagnostic, updatedAt: new Date().toISOString() }
            : {
                id: generateId(),
                name: 'Minha Marca',
                description: '',
                audience: '',
                country: 'Brasil',
                goals: [],
                preferredTone: 'profissional',
                diagnostic,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
        })),
      setOnboarded: (value) => set({ isOnboarded: value }),
      clearBrand: () => set({ brand: null, isOnboarded: false }),
    }),
    {
      name: 'brand-storage',
    }
  )
);
