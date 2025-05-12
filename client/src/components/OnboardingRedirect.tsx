import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { useOnboarding } from '@/contexts/onboarding-context';

/**
 * This component handles automatic redirection to the onboarding flow
 * for first-time users, and also handles redirection from onboarding to home
 * when onboarding is complete.
 * 
 * COMPLETELY REWRITTEN FOR MAXIMUM ROBUSTNESS
 */
export const OnboardingRedirect = () => {
  // Get all the values we need from the onboarding context
  const { hasCompletedOnboarding, currentStep, resetOnboarding, isFirstVisit } = useOnboarding();
  const [location, navigate] = useLocation();
  
  // Keep track of whether we've already performed a redirect
  // to prevent infinite loops or multiple redirects
  const hasRedirectedRef = useRef(false);
  
  // Detect if we're on a mobile device for optimizations
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  
  // IMPORTANT: This primary effect runs once on initial page load
  // and handles all initialization and redirection logic
  useEffect(() => {
    // Skip if we've already redirected
    if (hasRedirectedRef.current) return;
    
    // Log the current state for debugging
    console.log('OnboardingRedirect: Initial state check', {
      currentPath: location,
      isMobile,
      hasCompletedOnboarding,
      currentStep,
      isFirstVisit,
      localStorage: {
        step: localStorage.getItem('chronosVault.onboardingStep'),
        completed: localStorage.getItem('chronosVault.onboardingCompleted'),
        firstVisit: localStorage.getItem('chronosVault.firstVisit')
      }
    });
    
    // Set mobile flag to help other components optimize
    if (isMobile) {
      localStorage.setItem('chronosVault.isMobile', 'true');
    } else {
      localStorage.removeItem('chronosVault.isMobile');
    }
    
    // CASE 1: Special paths that should bypass onboarding logic
    if (location.includes('reset') || 
        location.includes('emergency') || 
        location.startsWith('/m-') || 
        location === '/mobile-reset') {
      console.log('OnboardingRedirect: Special path detected, bypassing redirection logic');
      return;
    }
    
    // CASE 2: URL has reset parameter
    if (window.location.search.includes('resetOnboarding=true')) {
      console.log('OnboardingRedirect: Reset parameter detected in URL');
      performCompleteReset();
      hasRedirectedRef.current = true;
      return;
    }
    
    // CASE 3: Missing or corrupted localStorage state
    try {
      const savedStep = localStorage.getItem('chronosVault.onboardingStep');
      const completedFlag = localStorage.getItem('chronosVault.onboardingCompleted');
      
      // Check for any issues with the saved state
      const hasCorruptStep = !savedStep || 
                             savedStep === 'null' || 
                             savedStep === 'undefined';
                             
      const hasCorruptFlag = completedFlag !== 'true' && completedFlag !== 'false' && completedFlag !== null;
      
      if (hasCorruptStep || hasCorruptFlag) {
        console.log('OnboardingRedirect: Corrupt localStorage state detected, resetting');
        performCompleteReset();
        hasRedirectedRef.current = true;
        return;
      }
    } catch (e) {
      console.error('OnboardingRedirect: Error checking localStorage state', e);
      performCompleteReset();
      hasRedirectedRef.current = true;
      return;
    }
    
    // CASE 4: First visit - needs to go through onboarding
    if (isFirstVisit) {
      console.log('OnboardingRedirect: First visit detected');
      
      // Skip redirection if already on the correct page
      if (location === '/onboarding' || 
          (isMobile && location === '/mobile-direct') || 
          (isMobile && location === '/md')) {
        console.log('OnboardingRedirect: Already on the correct page');
        return;
      }
      
      // Redirect based on device type
      if (isMobile) {
        console.log('OnboardingRedirect: Redirecting mobile user to mobile-direct');
        navigate('/mobile-direct');
      } else {
        console.log('OnboardingRedirect: Redirecting desktop user to onboarding');
        navigate('/onboarding');
      }
      
      hasRedirectedRef.current = true;
      return;
    }
    
    // CASE 5: Onboarding not completed, but not first visit
    if (!hasCompletedOnboarding && location === '/') {
      console.log('OnboardingRedirect: Onboarding not completed, redirecting from home');
      
      // Redirect based on device type
      if (isMobile) {
        navigate('/mobile-direct');
      } else {
        navigate('/onboarding');
      }
      
      hasRedirectedRef.current = true;
      return;
    }
    
    // CASE 6: Onboarding completed, but still on onboarding page
    if (hasCompletedOnboarding && currentStep === 'complete' && 
        (location === '/onboarding' || location === '/mobile-direct' || location === '/md')) {
      console.log('OnboardingRedirect: Onboarding completed, redirecting to home');
      navigate('/');
      hasRedirectedRef.current = true;
      return;
    }
    
  }, [currentStep, hasCompletedOnboarding, isFirstVisit, isMobile, location, navigate, resetOnboarding]);
  
  // This effect handles location changes after initial load
  useEffect(() => {
    // Skip special paths and initial load (which is handled by the primary effect)
    if (location.includes('reset') || 
        location.includes('emergency') || 
        hasRedirectedRef.current) {
      return;
    }
    
    // Reset the redirect flag when navigation occurs
    hasRedirectedRef.current = false;
    
  }, [location]);
  
  // Complete reset function - consolidated and simplified
  function performCompleteReset() {
    console.log('OnboardingRedirect: Performing complete reset');
    
    try {
      // Clear all localStorage values first
      localStorage.removeItem('chronosVault.onboardingStep');
      localStorage.removeItem('chronosVault.onboardingCompleted');
      localStorage.removeItem('chronosVault.firstVisit');
      
      // Set fresh values with forced delay to avoid race conditions
      setTimeout(() => {
        localStorage.setItem('chronosVault.firstVisit', 'true');
        localStorage.setItem('chronosVault.onboardingStep', JSON.stringify('welcome'));
        localStorage.setItem('chronosVault.onboardingCompleted', 'false');
        
        // Reset the React context state
        resetOnboarding();
        
        // Navigate with another small delay
        setTimeout(() => {
          if (isMobile) {
            navigate('/mobile-direct');
          } else {
            navigate('/onboarding');
          }
        }, 100);
      }, 100);
    } catch (e) {
      console.error('OnboardingRedirect: Error during reset', e);
      
      // Last resort - hard reload
      setTimeout(() => {
        window.location.href = isMobile ? '/mobile-direct' : '/onboarding';
      }, 200);
    }
  }
  
  // Dev mode reset button
  useEffect(() => {
    // Only add in dev mode
    if (localStorage.getItem('chronosVault.devMode') !== 'true') return;
    
    // Create the reset button if it doesn't exist
    if (!document.getElementById('dev-onboarding-reset')) {
      const header = document.querySelector('header');
      if (header) {
        const resetButton = document.createElement('button');
        resetButton.id = 'dev-onboarding-reset';
        resetButton.textContent = 'Reset Onboarding';
        resetButton.style.position = 'absolute';
        resetButton.style.top = '10px';
        resetButton.style.right = '10px';
        resetButton.style.zIndex = '9999'; // Increased z-index
        resetButton.style.background = '#FF5AF7';
        resetButton.style.color = 'white';
        resetButton.style.border = 'none';
        resetButton.style.borderRadius = '4px';
        resetButton.style.padding = '5px 10px';
        resetButton.style.fontSize = '12px';
        resetButton.style.fontWeight = 'bold';
        resetButton.style.cursor = 'pointer';
        resetButton.style.boxShadow = '0 2px 10px rgba(255, 90, 247, 0.5)';
        
        resetButton.onclick = performCompleteReset;
        header.appendChild(resetButton);
      }
    }
    
    // Clean up on unmount
    return () => {
      const button = document.getElementById('dev-onboarding-reset');
      if (button && button.parentNode) {
        button.parentNode.removeChild(button);
      }
    };
  }, []);
  
  // This is a logical component with no visual representation
  return null;
};