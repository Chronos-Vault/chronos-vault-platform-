import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useOnboarding } from '@/contexts/onboarding-context';

/**
 * This component handles automatic redirection to the onboarding flow
 * for first-time users, and also handles redirection from onboarding to home
 * when onboarding is complete.
 * 
 * IMPORTANT FIX - SIMPLIFIED IMPLEMENTATION TO STOP INFINITE LOOPS
 */
export const OnboardingRedirect = () => {
  const { hasCompletedOnboarding, currentStep, resetOnboarding, isFirstVisit } = useOnboarding();
  const [location, navigate] = useLocation();
  
  // Detect if we're on a mobile device
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  
  // One-time effect for mobile detection
  useEffect(() => {
    // Set mobile flag for optimizations
    if (isMobile) {
      localStorage.setItem('chronosVault.isMobile', 'true');
      console.log('Mobile device detected, optimizing onboarding experience');
    } else {
      localStorage.removeItem('chronosVault.isMobile');
    }
  }, [isMobile]);
  
  // Main redirection logic
  useEffect(() => {
    // Skip special paths that handle resets
    if (location.includes('reset') || location.includes('emergency')) {
      return;
    }
    
    // Handle case where user is on home but needs onboarding
    if (location === '/' && isFirstVisit && !hasCompletedOnboarding) {
      console.log('User at home but needs onboarding, redirecting');
      navigate(isMobile ? '/mobile-direct' : '/onboarding');
      return;
    }
    
    // Handle case where onboarding is complete but user is still on onboarding page
    if ((location === '/onboarding' || location === '/mobile-direct') && 
        hasCompletedOnboarding && currentStep === 'complete') {
      console.log('Onboarding complete, redirecting to home');
      navigate('/');
      return;
    }
  }, [location, hasCompletedOnboarding, currentStep, isFirstVisit, navigate, isMobile]);
  
  // Dev mode reset button
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
        resetButton.style.cursor = 'pointer';
        
        resetButton.onclick = () => {
          console.log('Performing onboarding reset');
          
          // Clear localStorage values
          localStorage.removeItem('chronosVault.onboardingStep');
          localStorage.removeItem('chronosVault.onboardingCompleted');
          localStorage.removeItem('chronosVault.firstVisit');
          
          // Set fresh values
          localStorage.setItem('chronosVault.firstVisit', 'true');
          localStorage.setItem('chronosVault.onboardingStep', JSON.stringify('welcome'));
          localStorage.setItem('chronosVault.onboardingCompleted', 'false');
          
          // Reset onboarding state in React context
          resetOnboarding();
          
          // Redirect to onboarding
          navigate(isMobile ? '/mobile-direct' : '/onboarding');
        };
        
        header.appendChild(resetButton);
      }
    }
    
    return () => {
      const button = document.getElementById('dev-onboarding-reset');
      if (button && button.parentNode) {
        button.parentNode.removeChild(button);
      }
    };
  }, [isMobile, navigate, resetOnboarding]);
  
  // Create a standalone emergency reset button (outside of dev mode)
  useEffect(() => {
    const existingButton = document.getElementById('emergency-reset-button');
    if (!existingButton) {
      const resetButton = document.createElement('button');
      resetButton.id = 'emergency-reset-button';
      resetButton.textContent = 'Emergency Reset';
      resetButton.style.position = 'fixed';
      resetButton.style.bottom = '10px';
      resetButton.style.right = '10px';
      resetButton.style.zIndex = '9999';
      resetButton.style.background = 'rgba(220, 38, 38, 0.2)';
      resetButton.style.color = 'rgba(252, 165, 165, 0.8)';
      resetButton.style.border = '1px solid rgba(220, 38, 38, 0.3)';
      resetButton.style.borderRadius = '4px';
      resetButton.style.padding = '5px 8px';
      resetButton.style.fontSize = '10px';
      resetButton.style.cursor = 'pointer';
      resetButton.style.display = 'none'; // Hidden by default
      
      // Show button only when holding Alt key
      document.addEventListener('keydown', (e) => {
        if (e.altKey) resetButton.style.display = 'block';
      });
      
      document.addEventListener('keyup', (e) => {
        if (!e.altKey) resetButton.style.display = 'none';
      });
      
      resetButton.onclick = () => {
        if (confirm('This will completely reset the application. Continue?')) {
          localStorage.clear();
          resetOnboarding();
          window.location.href = '/';
        }
      };
      
      document.body.appendChild(resetButton);
    }
    
    return () => {
      const button = document.getElementById('emergency-reset-button');
      if (button) document.body.removeChild(button);
    };
  }, [resetOnboarding]);
  
  // This is a logical component, not a visual one
  return null;
};