import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { useOnboarding } from '@/contexts/onboarding-context';

/**
 * This component handles automatic redirection to the onboarding flow
 * for first-time users, and also handles redirection from onboarding to home
 * when onboarding is complete.
 * 
 * IMPORTANT FIX - SIMPLIFIED IMPLEMENTATION TO STOP INFINITE LOOPS
 * NOW WITH MOBILE OPTIMIZATIONS
 */
export const OnboardingRedirect = () => {
  const { hasCompletedOnboarding, currentStep, resetOnboarding, isFirstVisit } = useOnboarding();
  const [location, navigate] = useLocation();
  
  // Detect if we're on a mobile device for optimizations
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  
  // One-time initialization effect - this runs only once on component mount
  useEffect(() => {
    // Debug information to help diagnose issues
    console.log('Initial OnboardingRedirect load. Current state:', {
      location,
      currentStep,
      isFirstVisit,
      isMobile,
      hasCompletedOnboarding,
      localStorage: {
        step: localStorage.getItem('chronosVault.onboardingStep'),
        completed: localStorage.getItem('chronosVault.onboardingCompleted'),
        firstVisit: localStorage.getItem('chronosVault.firstVisit'),
        devMode: localStorage.getItem('chronosVault.devMode')
      }
    });
    
    // Set mobile flag for optimizations
    if (isMobile) {
      localStorage.setItem('chronosVault.isMobile', 'true');
      console.log('Mobile device detected, optimizing onboarding experience');
    } else {
      localStorage.removeItem('chronosVault.isMobile');
    }
    
    // First time visitor detection and fixes
    try {
      // Check if firstVisit flag is missing, corrupt, or not defined properly
      const firstVisitFlag = localStorage.getItem('chronosVault.firstVisit');
      const onboardingStep = localStorage.getItem('chronosVault.onboardingStep');
      const completedFlag = localStorage.getItem('chronosVault.onboardingCompleted');
      
      // AUTO-FIX: If first time or any localStorage state is corrupt or missing
      if (!firstVisitFlag || 
          !onboardingStep ||
          onboardingStep === 'null' || 
          onboardingStep === 'undefined' ||
          typeof JSON.parse(onboardingStep) !== 'string' || 
          !completedFlag) {
        
        console.log('AUTO-FIX: Missing or corrupt onboarding state detected, fixing and redirecting to onboarding');
        
        // Properly set everything for first visit
        localStorage.setItem('chronosVault.firstVisit', 'true');
        localStorage.setItem('chronosVault.onboardingStep', JSON.stringify('welcome'));
        localStorage.setItem('chronosVault.onboardingCompleted', 'false');
        
        // Use the reset onboarding function to ensure context is updated
        resetOnboarding();
        
        // Force redirect to onboarding after a very short delay
        setTimeout(() => navigate('/onboarding'), 50);
        return;
      }
    } catch (e) {
      // If any error occurs, assume it's a first visit and reset
      console.error('Error checking onboarding state, resetting:', e);
      performFullReset();
      return;
    }
    
    // SPECIAL CASE: URL Parameter Reset - Highest Priority
    // This handles ?resetOnboarding=true in the URL
    if (window.location.search.includes('resetOnboarding=true')) {
      console.log('FULL RESET: ?resetOnboarding=true detected in URL');
      performFullReset();
      return;
    }
    
    // SPECIAL CASE: Manual path reset - High Priority
    // This handles paths like /resetOnboarding or /reset-onboarding
    // Also handle /force-reset path
    if (location.startsWith('/reset') || location === '/force-reset') {
      console.log('FULL RESET: Reset path detected:', location);
      // We don't need to navigate since the reset page will handle that
      return;
    }
    
    // Only do first-time redirects and checks on initial load
    if (isFirstVisit && location !== '/onboarding') {
      console.log('First visit detected, redirecting to onboarding');
      // Ensure we stay on first visit
      localStorage.setItem('chronosVault.firstVisit', 'true');
      // Navigate with a slight delay to avoid race conditions
      setTimeout(() => navigate('/onboarding'), isMobile ? 100 : 50);
      return;
    }
    
  }, []); // Empty dependency array means this only runs once on mount
  
  // Separate effect for ongoing navigation logic
  // This runs when location or onboarding state changes
  useEffect(() => {
    // Skip special reset paths that are handled separately
    if (location.startsWith('/reset')) {
      return;
    }
    
    // Handle case where user is on home but needs onboarding
    if (location === '/' && !hasCompletedOnboarding) {
      console.log('User at home without completed onboarding, redirecting to onboarding');
      navigate('/onboarding');
      return;
    }
    
    // Handle case where onboarding is complete but user is still on onboarding page
    if (location === '/onboarding' && hasCompletedOnboarding && currentStep === 'complete') {
      console.log('Onboarding complete, redirecting to home');
      navigate('/');
      return;
    }
  }, [location, hasCompletedOnboarding, currentStep, navigate]);
  
  // Helper function for full resets
  const performFullReset = () => {
    console.log('Performing full onboarding reset');
    
    // Reset localStorage directly
    localStorage.removeItem('chronosVault.onboardingStep');
    localStorage.removeItem('chronosVault.onboardingCompleted');
    localStorage.removeItem('chronosVault.firstVisit');
    
    // Force first visit flag
    localStorage.setItem('chronosVault.firstVisit', 'true');
    
    // Use context method to reset state
    resetOnboarding();
    
    // Navigate to onboarding page with delay
    setTimeout(() => {
      navigate('/onboarding');
    }, 100);
  };
  
  // Add dev mode reset button
  useEffect(() => {
    const isDevelopmentMode = localStorage.getItem('chronosVault.devMode') === 'true';
    if (!isDevelopmentMode) return;
    
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
        resetButton.onclick = performFullReset;
        
        header.appendChild(resetButton);
      }
    }
    
    return () => {
      const button = document.getElementById('dev-onboarding-reset');
      if (button && button.parentNode) {
        button.parentNode.removeChild(button);
      }
    };
  }, []);
  
  // This is a logical component, not a visual one
  return null;
};