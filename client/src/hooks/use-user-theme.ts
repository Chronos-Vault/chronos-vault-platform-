import { useState, useEffect } from 'react';

// Theme options
export type ThemeType = 'default' | 'luxury' | 'cyberpunk' | 'minimalist';

export function useUserTheme() {
  const [theme, setTheme] = useState<ThemeType>('default');
  
  const applyTheme = (newTheme: ThemeType) => {
    setTheme(newTheme);
    localStorage.setItem('chronos-vault-theme', newTheme);
    
    // Remove any existing theme classes
    document.documentElement.classList.remove(
      'theme-default',
      'theme-luxury',
      'theme-cyberpunk',
      'theme-minimalist'
    );
    
    // Add the new theme class
    document.documentElement.classList.add(`theme-${newTheme}`);
  };
  
  useEffect(() => {
    // Load saved theme on component mount
    const savedTheme = localStorage.getItem('chronos-vault-theme') as ThemeType | null;
    if (savedTheme) {
      applyTheme(savedTheme);
    }
  }, []);
  
  return { theme, setTheme: applyTheme };
}

export default useUserTheme;