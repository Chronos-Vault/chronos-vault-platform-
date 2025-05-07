import { useContext } from 'react';
import { DevModeContext } from '@/contexts/dev-mode-context';

export function useDevMode() {
  const context = useContext(DevModeContext);
  
  if (!context) {
    throw new Error('useDevMode must be used within a DevModeProvider');
  }
  
  return context;
}