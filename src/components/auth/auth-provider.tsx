import { ReactNode } from 'react';
import { useAuthInitialization } from '@/hooks/auth';

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider component that initializes authentication from stored tokens
 * This should wrap the main App component to ensure authentication is checked on startup
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Initialize authentication from stored tokens
  useAuthInitialization();

  return <>{children}</>;
};

export default AuthProvider;
