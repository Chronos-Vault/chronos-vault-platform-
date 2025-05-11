import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useOnboarding } from '@/contexts/onboarding-context';

/**
 * This component handles automatic redirection to the onboarding flow
 * for first-time users, and also handles redirection from onboarding to home
 * when onboarding is complete.
 */
export const OnboardingRedirect = () => {
  const { hasCompletedOnboarding, currentStep } = useOnboarding();
  const [location, navigate] = useLocation();
  
  useEffect(() => {
    // Redirect users who haven't completed onboarding from home to onboarding
    if (location === '/' && !hasCompletedOnboarding) {
      navigate('/onboarding');
    }
    
    // Redirect users who have completed onboarding from onboarding page to home
    if (location === '/onboarding' && hasCompletedOnboarding) {
      navigate('/');
    }
    
    // Also redirect if the current step is 'complete'
    if (location === '/onboarding' && currentStep === 'complete') {
      navigate('/');
    }
  }, [location, hasCompletedOnboarding, currentStep, navigate]);
  
  // This is a logical component, not a visual one
  return null;
};