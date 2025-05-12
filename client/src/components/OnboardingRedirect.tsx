import { useEffect, useRef } from 'react';
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
  const initialRenderRef = useRef(true);
  const redirectInProgressRef = useRef(false);
  
  // One-time effect to handle URL parameter for resetting onboarding
  useEffect(() => {
    if (window.location.search.includes('resetOnboarding=true')) {
      console.log('Forcing onboarding reset due to URL parameter');
      
      // Reset localStorage directly for reliability
      localStorage.removeItem('chronosVault.onboardingStep');
      localStorage.removeItem('chronosVault.onboardingCompleted');
      localStorage.removeItem('chronosVault.firstVisit');
      localStorage.setItem('chronosVault.firstVisit', 'true');
      
      // Now call the context method to synchronize state
      resetOnboarding();
      
      // Navigate to onboarding page with a slight delay to allow state to update
      setTimeout(() => {
        navigate('/onboarding');
      }, 100);
    }
  }, []); // Empty dependency array - runs once on mount
  
  // Primary onboarding redirect logic - with safeguards
  useEffect(() => {
    // Skip first render to avoid race conditions with state initialization
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      return;
    }
    
    // If a redirect is in progress, don't trigger another one
    if (redirectInProgressRef.current) {
      return;
    }
    
    // Skip special paths that are handled separately
    if (location.startsWith('/reset')) {
      return;
    }
    
    // Debug logging
    console.log('OnboardingRedirect effect running with:', {
      location,
      hasCompletedOnboarding,
      currentStep,
      isFirstVisit
    });
    
    // Prevent multiple redirects at once
    const startRedirect = () => {
      redirectInProgressRef.current = true;
      setTimeout(() => {
        redirectInProgressRef.current = false;
      }, 1000); // Prevent additional redirects for 1 second
    };
    
    // First visit handling - redirect to onboarding
    if (isFirstVisit && location !== '/onboarding') {
      console.log('First visit detected, redirecting to onboarding');
      startRedirect();
      navigate('/onboarding');
      return;
    }
    
    // Incomplete onboarding handling - redirect from home to onboarding
    if (location === '/' && !hasCompletedOnboarding) {
      console.log('User has not completed onboarding, redirecting from home to onboarding');
      startRedirect();
      navigate('/onboarding');
      return;
    }
    
    // Completed onboarding handling - redirect from onboarding to home
    if (location === '/onboarding' && hasCompletedOnboarding && currentStep === 'complete') {
      console.log('User has completed onboarding, redirecting from onboarding to home');
      startRedirect();
      navigate('/');
      return;
    }
    
  }, [location, hasCompletedOnboarding, currentStep, navigate, isFirstVisit]);
  
  // Add dev mode reset button in a separate effect
  useEffect(() => {
    // Only add the button in development mode
    const isDevelopmentMode = localStorage.getItem('chronosVault.devMode') === 'true';
    if (!isDevelopmentMode) return;
    
    // Only add the button once
    if (document.getElementById('dev-onboarding-reset')) return;
    
    // Get header element
    const header = document.querySelector('header');
    if (!header) return;
    
    // Create and add the reset button
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
      
      resetOnboarding();
      
      // Add some delay before navigation
      setTimeout(() => {
        navigate('/onboarding');
      }, 100);
    };
    
    // Add button to header
    header.appendChild(resetButton);
    
    // Cleanup on unmount
    return () => {
      try {
        const button = document.getElementById('dev-onboarding-reset');
        if (button && button.parentNode) {
          button.parentNode.removeChild(button);
        }
      } catch (error) {
        console.error('Error removing dev reset button:', error);
      }
    };
  }, []); // Empty dependency array - runs once
  
  // This is a logical component, not a visual one
  return null;
};