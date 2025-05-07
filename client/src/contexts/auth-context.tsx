import { createContext, useContext, ReactNode, useEffect } from 'react';
import useAuth from '@/hooks/use-auth';
import { useDevMode } from './dev-mode-context';

// Define the auth context type
type AuthContextType = ReturnType<typeof useAuth> & {
  // Add a development mode override property
  isAuthenticated: boolean;
};

// Create the auth context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export function AuthProvider({ children }: AuthProviderProps) {
  // Use the auth hook
  const auth = useAuth();
  
  // Get development mode state
  const { devModeEnabled } = useDevMode();
  
  // Override isAuthenticated when in development mode
  const enhancedAuth: AuthContextType = {
    ...auth,
    // When in dev mode, always return true for isAuthenticated
    isAuthenticated: devModeEnabled ? true : auth.isAuthenticated
  };
  
  // Log development mode authentication status changes
  useEffect(() => {
    if (devModeEnabled) {
      console.log('Development mode enabled: bypassing authentication requirements');
    }
  }, [devModeEnabled]);

  // Provide the enhanced auth context to children
  return <AuthContext.Provider value={enhancedAuth}>{children}</AuthContext.Provider>;
}

// Custom hook to consume the auth context
export function useAuthContext() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  
  return context;
}