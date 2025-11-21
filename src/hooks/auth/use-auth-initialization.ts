import { useAuthActions } from '@/stores/auth.store';
import { useEffect } from 'react';

/**
 * Hook to initialize authentication from stored tokens
 * This should be used in the main App component to check for existing tokens
 * and restore the user session on app startup
 */
export const useAuthInitialization = () => {
  const { initializeFromTokens } = useAuthActions();

  useEffect(() => {
    // Initialize authentication from stored tokens
    initializeFromTokens();
  }, [initializeFromTokens]);
};

export default useAuthInitialization;
