/**
 * Development Mode Context
 * 
 * Provides development mode settings and controls
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DevModeContextType {
  devModeEnabled: boolean;
  toggleDevMode: () => void;
  isDevelopmentEnvironment: boolean;
  bypassWalletRequirements: boolean;
  setBypassWalletRequirements: (bypass: boolean) => void;
}

const DevModeContext = createContext<DevModeContextType | undefined>(undefined);

export function DevModeProvider({ children }: { children: ReactNode }) {
  const [devModeEnabled, setDevModeEnabled] = useState(process.env.NODE_ENV === 'development');
  const [bypassWalletRequirements, setBypassWalletRequirements] = useState(true);
  
  const isDevelopmentEnvironment = process.env.NODE_ENV === 'development';

  const toggleDevMode = () => {
    setDevModeEnabled(!devModeEnabled);
  };

  return (
    <DevModeContext.Provider value={{
      devModeEnabled,
      toggleDevMode,
      isDevelopmentEnvironment,
      bypassWalletRequirements,
      setBypassWalletRequirements
    }}>
      {children}
    </DevModeContext.Provider>
  );
}

export function useDevMode() {
  const context = useContext(DevModeContext);
  if (context === undefined) {
    throw new Error('useDevMode must be used within a DevModeProvider');
  }
  return context;
}