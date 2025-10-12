/**
 * Authentication Context
 * 
 * Provides authentication state and methods throughout the application
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (credentials: any) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (credentials: any): Promise<boolean> => {
    setLoading(true);
    try {
      // Simulate login process
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsAuthenticated(true);
      setUser({ id: '1', name: 'User' });
      return true;
    } catch (error) {
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  useEffect(() => {
    // Check for existing auth on mount
    const checkAuth = () => {
      // In development mode, simulate authenticated state
      if (process.env.NODE_ENV === 'development') {
        setIsAuthenticated(true);
        setUser({ id: 'dev-user', name: 'Development User' });
      }
    };
    
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      login,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}