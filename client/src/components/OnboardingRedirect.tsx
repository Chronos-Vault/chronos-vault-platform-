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
  
  // Handle common error patterns in URL
  useEffect(() => {
    // Fix common errors with reset URL parameter
    if (location === '/resetOnboarding=true' || 
        location === '/resetonboarding=true' ||
        location === '/resetOnboarding' || 
        location === '/resetonboarding') {
      console.log('Detected incorrect reset URL format, redirecting to correct format');
      
      // Reset localStorage directly - this covers edge cases where the context might not reset properly
      localStorage.removeItem('chronosVault.onboardingStep');
      localStorage.removeItem('chronosVault.onboardingCompleted');
      localStorage.removeItem('chronosVault.firstVisit');
      localStorage.setItem('chronosVault.firstVisit', 'true');
      
      // Navigate to onboarding page
      navigate('/onboarding');
      return;
    }
  }, [location, navigate]);
  
  // Primary onboarding redirect logic
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
    
    // Force reset onboarding if URL contains ?resetOnboarding=true (correct format)
    if (window.location.search.includes('resetOnboarding=true')) {
      console.log('Forcing onboarding reset due to URL parameter');
      
      // Reset localStorage directly for reliability
      localStorage.removeItem('chronosVault.onboardingStep');
      localStorage.removeItem('chronosVault.onboardingCompleted');
      localStorage.removeItem('chronosVault.firstVisit');
      localStorage.setItem('chronosVault.firstVisit', 'true');
      
      // Now call the context method to synchronize state
      resetOnboarding();
      
      // Navigate to onboarding page
      navigate('/onboarding');
      return;
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
    
  }, [location, hasCompletedOnboarding, currentStep, navigate, resetOnboarding, isFirstVisit]);
  
  // Add dev mode reset button
  useEffect(() => {
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
          resetButton.onclick = () => {
            console.log('Manual reset triggered from dev button');
            
            // Reset localStorage directly
            localStorage.removeItem('chronosVault.onboardingStep');
            localStorage.removeItem('chronosVault.onboardingCompleted');
            localStorage.removeItem('chronosVault.firstVisit');
            localStorage.setItem('chronosVault.firstVisit', 'true');
            
            // Use context method to synchronize state
            resetOnboarding();
            
            // Navigate to onboarding
            navigate('/onboarding');
          };
          header.appendChild(resetButton);
        }
      }
    }
  }, [navigate, resetOnboarding]);
  
  // This is a logical component, not a visual one
  return null;
};