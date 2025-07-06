import { useEffect, useState } from 'react';

/**
 * Hook to determine if the application is in development mode
 * This is used to enable/disable development-only features
 */
export function useDevMode() {
  const [isDevelopmentMode, setIsDevelopmentMode] = useState<boolean>(false);
  const DEV_MODE_KEY = 'chronosVault.devMode';
  
  useEffect(() => {
    // Check localStorage for dev mode flag
    const storedValue = localStorage.getItem(DEV_MODE_KEY);
    setIsDevelopmentMode(storedValue === 'true');
    
    // Debug logging to help with troubleshooting
    console.log(`Development mode is ${storedValue === 'true' ? 'enabled' : 'disabled'}`);
  }, []);
  
  const toggleDevelopmentMode = () => {
    const newValue = !isDevelopmentMode;
    localStorage.setItem(DEV_MODE_KEY, newValue ? 'true' : 'false');
    setIsDevelopmentMode(newValue);
    
    console.log(`Development mode ${newValue ? 'enabled' : 'disabled'}`);
    
    // Force reload to ensure all dev mode features are correctly applied
    window.location.reload();
  };
  
  const enableDevelopmentMode = () => {
    localStorage.setItem(DEV_MODE_KEY, 'true');
    setIsDevelopmentMode(true);
    console.log('Development mode enabled');
  };
  
  const disableDevelopmentMode = () => {
    localStorage.setItem(DEV_MODE_KEY, 'false');
    setIsDevelopmentMode(false);
    console.log('Development mode disabled');
  };
  
  return {
    isDevelopmentMode,
    toggleDevelopmentMode,
    enableDevelopmentMode,
    disableDevelopmentMode
  };
}