import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useOnboarding } from '@/contexts/onboarding-context';

/**
 * This component handles automatic redirection to the onboarding flow
 * for first-time users, and also handles redirection from onboarding to home
 * when onboarding is complete.
 */
export const OnboardingRedirect = () => {
  const { hasCompletedOnboarding, currentStep, resetOnboarding, isFirstVisit } = useOnboarding();
  const [location, navigate] = useLocation();
  
  useEffect(() => {
    // Debug logging
    console.log('OnboardingRedirect effect running with:', {
      location,
      hasCompletedOnboarding,
      currentStep,
      isFirstVisit,
      localStorage: {
        step: localStorage.getItem('chronosVault.onboardingStep'),
        completed: localStorage.getItem('chronosVault.onboardingCompleted'),
        firstVisit: localStorage.getItem('chronosVault.firstVisit')
      }
    });
    
    // Force reset onboarding if URL contains ?resetOnboarding=true
    if (window.location.search.includes('resetOnboarding=true')) {
      console.log('Forcing onboarding reset due to URL parameter');
      resetOnboarding();
      return; // Exit early as resetOnboarding will trigger a page reload
    }
    
    // If this is the first visit and user is not on onboarding page, redirect them
    if (isFirstVisit && location !== '/onboarding') {
      console.log('First visit detected, redirecting to onboarding');
      navigate('/onboarding');
      return;
    }
    
    // Redirect users who haven't completed onboarding from home to onboarding
    if (location === '/' && !hasCompletedOnboarding) {
      console.log('User has not completed onboarding, redirecting from home to onboarding');
      navigate('/onboarding');
      return;
    }
    
    // Redirect users who have completed onboarding from onboarding page to home
    if (location === '/onboarding' && hasCompletedOnboarding && currentStep === 'complete') {
      console.log('User has completed onboarding, redirecting from onboarding to home');
      navigate('/');
      return;
    }
    
    // Add a dev mode reset button to the header if in development mode
    const isDevelopmentMode = localStorage.getItem('chronosVault.devMode') === 'true';
    if (isDevelopmentMode) {
      if (!document.getElementById('dev-onboarding-reset')) {
        const header = document.querySelector('header');
        if (header) {
          const resetButton = document.createElement('button');
          resetButton.id = 'dev-onboarding-reset';
          resetButton.textContent = 'Reset Onboarding';
          resetButton.style.position = 'absolute';
          resetButton.style.top = '10px';
          resetButton.style.right = '10px';
          resetButton.style.zIndex = '1000';
          resetButton.style.background = '#6B00D7';
          resetButton.style.color = 'white';
          resetButton.style.border = 'none';
          resetButton.style.borderRadius = '4px';
          resetButton.style.padding = '4px 8px';
          resetButton.style.fontSize = '10px';
          resetButton.onclick = resetOnboarding;
          header.appendChild(resetButton);
        }
      }
    }
    
  }, [location, hasCompletedOnboarding, currentStep, navigate, resetOnboarding, isFirstVisit]);
  
  // This is a logical component, not a visual one
  return null;
};