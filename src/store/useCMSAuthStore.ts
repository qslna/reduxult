import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Enhanced admin authentication with session management
interface CMSAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loginTime: number | null;
  sessionTimeout: number;
  attemptCount: number;
  lastAttemptTime: number | null;
  lockoutUntil: number | null;
  
  // Actions
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  checkSession: () => boolean;
  resetAttempts: () => void;
  isLockedOut: () => boolean;
}

const CORRECT_PASSWORD = 'redux2025';
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export const useCMSAuthStore = create<CMSAuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isLoading: false,
      error: null,
      loginTime: null,
      sessionTimeout: SESSION_TIMEOUT,
      attemptCount: 0,
      lastAttemptTime: null,
      lockoutUntil: null,

      login: async (password: string) => {
        const state = get();
        
        // Check if currently locked out
        if (state.isLockedOut()) {
          const remainingTime = Math.ceil((state.lockoutUntil! - Date.now()) / 1000 / 60);
          set({
            error: `Too many failed attempts. Please try again in ${remainingTime} minutes.`,
            isLoading: false
          });
          return false;
        }

        set({ isLoading: true, error: null });
        
        // Simulate async operation for better UX
        await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
        
        if (password === CORRECT_PASSWORD) {
          set({
            isAuthenticated: true,
            isLoading: false,
            error: null,
            loginTime: Date.now(),
            attemptCount: 0,
            lastAttemptTime: null,
            lockoutUntil: null
          });
          return true;
        } else {
          const newAttemptCount = state.attemptCount + 1;
          const now = Date.now();
          
          // Enhanced error messages based on password content
          let errorMessage = 'Invalid password.';
          if (password.toLowerCase().includes('redux')) {
            errorMessage = 'Close! Check the year and try again.';
          } else if (password.length < 4) {
            errorMessage = 'Password too short. Try the full admin password.';
          } else if (newAttemptCount === MAX_ATTEMPTS) {
            errorMessage = `Too many failed attempts. Account locked for ${LOCKOUT_DURATION / 1000 / 60} minutes.`;
          } else if (newAttemptCount > 3) {
            errorMessage = `Invalid password. ${MAX_ATTEMPTS - newAttemptCount} attempts remaining.`;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
            attemptCount: newAttemptCount,
            lastAttemptTime: now,
            lockoutUntil: newAttemptCount >= MAX_ATTEMPTS ? now + LOCKOUT_DURATION : null
          });
          return false;
        }
      },

      logout: () => {
        set({
          isAuthenticated: false,
          isLoading: false,
          error: null,
          loginTime: null
        });
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      checkSession: () => {
        const state = get();
        if (!state.isAuthenticated || !state.loginTime) {
          return false;
        }
        
        const sessionAge = Date.now() - state.loginTime;
        if (sessionAge > state.sessionTimeout) {
          // Session expired
          set({
            isAuthenticated: false,
            error: 'Session expired. Please log in again.',
            loginTime: null
          });
          return false;
        }
        
        return true;
      },

      resetAttempts: () => {
        set({
          attemptCount: 0,
          lastAttemptTime: null,
          lockoutUntil: null,
          error: null
        });
      },

      isLockedOut: () => {
        const state = get();
        if (!state.lockoutUntil) return false;
        
        if (Date.now() > state.lockoutUntil) {
          // Lockout period has expired, reset attempts
          set({
            lockoutUntil: null,
            attemptCount: 0,
            lastAttemptTime: null
          });
          return false;
        }
        
        return true;
      }
    }),
    {
      name: 'redux-cms-auth',
      version: 2, // Increment version for new state structure
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        loginTime: state.loginTime,
        attemptCount: state.attemptCount,
        lastAttemptTime: state.lastAttemptTime,
        lockoutUntil: state.lockoutUntil
      }),
      // Migration function for version updates
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Reset state for major version change
          return {
            isAuthenticated: false,
            isLoading: false,
            error: null,
            loginTime: null,
            sessionTimeout: SESSION_TIMEOUT,
            attemptCount: 0,
            lastAttemptTime: null,
            lockoutUntil: null
          };
        }
        return persistedState;
      }
    }
  )
);