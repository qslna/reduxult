import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Simplified admin authentication - only password "redux2025"
interface CMSAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useCMSAuthStore = create<CMSAuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (password: string) => {
        set({ isLoading: true, error: null });
        
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (password === 'redux2025') {
          set({
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
          return true;
        } else {
          set({
            error: 'Invalid password. Please enter "redux2025"',
            isLoading: false
          });
          return false;
        }
      },

      logout: () => {
        set({
          isAuthenticated: false,
          isLoading: false,
          error: null
        });
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      }
    }),
    {
      name: 'redux-cms-auth',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);