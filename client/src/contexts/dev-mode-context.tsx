import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

// Type definition for the dev mode context
interface DevModeContextType {
  devModeEnabled: boolean;
  isDevMode: boolean;  // Alias for devModeEnabled for compatibility
  toggleDevMode: () => void;
  isDevelopmentEnvironment: boolean;
  bypassWalletRequirements: boolean;
  setBypassWalletRequirements: (value: boolean) => void;
}

// Create the context with default values
export const DevModeContext = createContext<DevModeContextType>({
  devModeEnabled: false,
  isDevMode: false,
  toggleDevMode: () => {},
  isDevelopmentEnvironment: false,
  bypassWalletRequirements: false,
  setBypassWalletRequirements: () => {},
});

// Props for the provider component
interface DevModeProviderProps {
  children: ReactNode;
}

// The provider component
export function DevModeProvider({ children }: DevModeProviderProps) {
  // Check if we're in development mode
  const isDevelopmentEnvironment = 
    import.meta.env.MODE === 'development' || 
    import.meta.env.DEV === true;

  // State to track if dev mode and bypass wallet are enabled
  const [devModeEnabled, setDevModeEnabled] = useState<boolean>(false);
  const [bypassWalletRequirements, setBypassWalletRequirements] = useState<boolean>(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    // Load dev mode setting
    const savedDevMode = localStorage.getItem('chronosVault_devMode');
    if (savedDevMode === 'true') {
      setDevModeEnabled(true);
    }
    
    // Load bypass wallet setting
    const savedBypassWallet = localStorage.getItem('chronosVault_bypassWallet');
    if (savedBypassWallet === 'true') {
      setBypassWalletRequirements(true);
    }
  }, []);

  // Function to toggle dev mode
  const toggleDevMode = () => {
    const newValue = !devModeEnabled;
    setDevModeEnabled(newValue);
    localStorage.setItem('chronosVault_devMode', newValue.toString());
    
    // Log the state change for debugging
    console.log(`Development mode ${newValue ? 'enabled' : 'disabled'}`);
  };

  // Create the context value
  const contextValue: DevModeContextType = {
    devModeEnabled,
    isDevMode: devModeEnabled, // Alias for compatibility
    toggleDevMode,
    isDevelopmentEnvironment,
  };

  // Provide the context to children
  return (
    <DevModeContext.Provider value={contextValue}>
      {children}
    </DevModeContext.Provider>
  );
}

// Custom hook to use the dev mode context
export function useDevMode() {
  const context = useContext(DevModeContext);
  
  if (context === undefined) {
    throw new Error('useDevMode must be used within a DevModeProvider');
  }
  
  return context;
}