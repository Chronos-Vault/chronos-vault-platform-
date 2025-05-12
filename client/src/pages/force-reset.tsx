import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useOnboarding } from '@/contexts/onboarding-context';

/**
 * This is a special page that allows a force reset of the onboarding experience
 * Access it via /force-reset for emergencies
 */
const ForceResetPage: React.FC = () => {
  const { resetOnboarding } = useOnboarding();
  const [_, navigate] = useLocation();
  
  useEffect(() => {
    console.log('EMERGENCY RESET: Force reset page loaded');
    
    // Clear everything in localStorage related to onboarding
    localStorage.removeItem('chronosVault.onboardingStep');
    localStorage.removeItem('chronosVault.onboardingCompleted');
    localStorage.removeItem('chronosVault.firstVisit');
    
    // Set first visit explicitly
    localStorage.setItem('chronosVault.firstVisit', 'true');
    localStorage.setItem('chronosVault.onboardingStep', JSON.stringify('welcome'));
    localStorage.setItem('chronosVault.onboardingCompleted', 'false');
    
    // Call the context method
    resetOnboarding();
    
    // Redirect after a delay to ensure state is updated
    setTimeout(() => {
      navigate('/onboarding');
    }, 1500);
  }, [resetOnboarding, navigate]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div className="w-20 h-20 rounded-full border-4 border-primary border-t-transparent animate-spin mb-8"></div>
      <h1 className="text-3xl font-bold mb-4">Emergency Reset</h1>
      <p className="text-center max-w-md mb-8">
        Completely resetting your onboarding experience. 
        You'll be redirected to the welcome screen momentarily...
      </p>
      <div className="w-64 h-2 bg-gray-800 rounded-full">
        <div className="h-full bg-primary animate-pulse rounded-full"></div>
      </div>
    </div>
  );
};

export default ForceResetPage;