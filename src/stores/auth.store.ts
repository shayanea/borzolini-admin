import type { LoadingState, User } from '@/types';

import { AuthService } from '@/services/auth.service';
import { create } from 'zustand';
import { emitAuthRedirect } from '@/services/event-emitter.service';
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

  // Token-based authentication
  checkTokenAuth: () => boolean;
  initializeFromTokens: () => Promise<void>;
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

      logout: () => {
        // Clear tokens from localStorage
        AuthService.clearStoredTokens();

        set({
          user: null,
          isAuthenticated: false,
          loading: 'idle',
          error: null,
        });
      },

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
        console.log('AuthStore: Handling auth failure, clearing state and emitting redirect');
        // Clear authentication state and redirect to login
        set({
          user: null,
          isAuthenticated: false,
          loading: 'idle',
          error: 'Authentication expired. Please login again.',
        });

        // Clear persisted state from localStorage
        try {
          localStorage.removeItem('auth-storage');
        } catch (error) {
          console.warn('Failed to clear auth storage:', error);
        }

        // Emit redirect event using event emitter service
        emitAuthRedirect('/login');
      },

      // Token-based authentication
      checkTokenAuth: () => {
        return AuthService.isAuthenticated();
      },

      initializeFromTokens: async () => {
        const { setLoading, setError, setUser, setAuthenticated } = get();

        try {
          setLoading('loading');

          // Check if we have valid tokens
          if (!AuthService.isAuthenticated()) {
            setLoading('idle');
            return;
          }

          // Try to get user info using the stored tokens
          const user = await AuthService.getCurrentUser();

          set({
            user,
            isAuthenticated: true,
            loading: 'success',
            error: null,
          });
        } catch (error) {
          console.error('Failed to initialize from tokens:', error);

          // Clear invalid tokens
          AuthService.clearStoredTokens();

          set({
            user: null,
            isAuthenticated: false,
            loading: 'idle',
            error: 'Session expired. Please login again.',
          });
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
    checkTokenAuth: state.checkTokenAuth,
    initializeFromTokens: state.initializeFromTokens,
  }));
