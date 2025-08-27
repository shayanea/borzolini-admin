import type { LoadingState, User } from '@/types';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  loading: LoadingState;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setAuthenticated: (status: boolean) => void;
  setLoading: (loading: LoadingState) => void;
  setError: (error: string | null) => void;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  clearError: () => void;
  handleAuthFailure: () => void;
}

// Helper function to create custom events
const createCustomEvent = (type: string, detail: any) => {
  if (typeof window !== 'undefined') {
    if (window.CustomEvent) {
      return new window.CustomEvent(type, { detail });
    } else {
      // Fallback for older browsers
      const event = document.createEvent('CustomEvent');
      event.initCustomEvent(type, false, false, detail);
      return event;
    }
  }
  return null;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      loading: 'idle',
      error: null,

      // Actions
      setUser: user => set({ user }),

      setAuthenticated: status => set({ isAuthenticated: status }),

      setLoading: loading => set({ loading }),

      setError: error => set({ error }),

      login: user =>
        set({
          user,
          isAuthenticated: true,
          loading: 'success',
          error: null,
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          loading: 'idle',
          error: null,
        }),

      updateUser: updates => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...updates },
          });
        }
      },

      clearError: () => set({ error: null }),

      handleAuthFailure: () => {
        // Clear authentication state and redirect to login
        set({
          user: null,
          isAuthenticated: false,
          loading: 'idle',
          error: 'Authentication expired. Please login again.',
        });

        // Dispatch navigation event for React Router
        if (typeof window !== 'undefined') {
          const event = createCustomEvent('auth:redirect', { path: '/login' });
          if (event) {
            window.dispatchEvent(event);
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: state => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Selectors for better performance
export const useUser = () => useAuthStore(state => state.user);
export const useIsAuthenticated = () => useAuthStore(state => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore(state => state.loading);
export const useAuthError = () => useAuthStore(state => state.error);

// Actions
export const useAuthActions = () =>
  useAuthStore(state => ({
    setUser: state.setUser,
    setAuthenticated: state.setAuthenticated,
    setLoading: state.setLoading,
    setError: state.setError,
    login: state.login,
    logout: state.logout,
    updateUser: state.updateUser,
    clearError: state.clearError,
    handleAuthFailure: state.handleAuthFailure,
  }));

// Initialize auth failure listener when store is first used
let isListenerInitialized = false;

export const initializeAuthListener = () => {
  if (isListenerInitialized || typeof window === 'undefined') return;

  window.addEventListener('auth:unauthorized', () => {
    const { handleAuthFailure } = useAuthStore.getState();
    handleAuthFailure();
  });

  isListenerInitialized = true;
};
