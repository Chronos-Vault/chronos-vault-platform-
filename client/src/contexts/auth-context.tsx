import { createContext, useContext, ReactNode } from 'react';
import useAuth from '@/hooks/use-auth';

// Define the auth context type
type AuthContextType = ReturnType<typeof useAuth>;

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

  // Provide the auth context to children
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

// Custom hook to consume the auth context
export function useAuthContext() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  
  return context;
}