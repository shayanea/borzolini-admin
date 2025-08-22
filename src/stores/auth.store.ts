import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, LoadingState } from '@/types';

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
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      loading: 'idle',
      error: null,

      // Actions
      setUser: (user) => set({ user }),
      
      setAuthenticated: (status) => set({ isAuthenticated: status }),
      
      setLoading: (loading) => set({ loading }),
      
      setError: (error) => set({ error }),
      
      login: (user) => set({
        user,
        isAuthenticated: true,
        loading: 'success',
        error: null,
      }),
      
      logout: () => set({
        user: null,
        isAuthenticated: false,
        loading: 'idle',
        error: null,
      }),
      
      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...updates },
          });
        }
      },
      
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Selectors for better performance
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.loading);
export const useAuthError = () => useAuthStore((state) => state.error);

// Actions
export const useAuthActions = () => useAuthStore((state) => ({
  setUser: state.setUser,
  setAuthenticated: state.setAuthenticated,
  setLoading: state.setLoading,
  setError: state.setError,
  login: state.login,
  logout: state.logout,
  updateUser: state.updateUser,
  clearError: state.clearError,
}));
