import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useOnboarding } from '@/contexts/onboarding-context';

/**
 * This component handles automatic redirection to the onboarding flow
 * for first-time users. It's separated from App.tsx to avoid dependency
 * cycles with context providers.
 */
export const OnboardingRedirect = () => {
  const { hasCompletedOnboarding } = useOnboarding();
  const [location, navigate] = useLocation();
  
  useEffect(() => {
    // Only redirect if the user is on the home page and hasn't completed onboarding
    if (location === '/' && !hasCompletedOnboarding) {
      navigate('/onboarding');
    }
  }, [location, hasCompletedOnboarding, navigate]);
  
  // This is a logical component, not a visual one
  return null;
};