import { create } from 'zustand';
import { DESIGNERS } from '@/utils/constants';

type DesignerTheme = keyof typeof DESIGNERS;

interface ThemeState {
  currentTheme: DesignerTheme | null;
  isDarkMode: boolean;
  isLoading: boolean;
  setTheme: (theme: DesignerTheme | null) => void;
  toggleDarkMode: () => void;
  setLoading: (loading: boolean) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  currentTheme: null,
  isDarkMode: true,
  isLoading: false,
  setTheme: (theme) => set({ currentTheme: theme }),
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setLoading: (loading) => set({ isLoading: loading }),
}));