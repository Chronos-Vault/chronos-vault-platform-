import React, { useEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * This is a direct reset page component that forces the onboarding to reset
 * It's meant to be used as a fallback for URLs like /resetOnboarding=true
 */
const ResetOnboardingPage: React.FC = () => {
  const [_, navigate] = useLocation();
  
  // When component mounts, immediately reset everything
  useEffect(() => {
    // Clear all stored onboarding state
    console.log('ResetOnboardingPage: Completely resetting onboarding state');
    
    // Remove all localStorage state to ensure a fresh start
    localStorage.removeItem('chronosVault.onboardingStep');
    localStorage.removeItem('chronosVault.onboardingCompleted');
    localStorage.removeItem('chronosVault.firstVisit');
    
    // Set firstVisit to true to force welcome animation
    localStorage.setItem('chronosVault.firstVisit', 'true');
    
    // Navigate to onboarding page with a slight delay
    setTimeout(() => {
      navigate('/onboarding');
    }, 100);
  }, [navigate]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="w-16 h-16 mb-6 rounded-full bg-primary flex items-center justify-center">
        <svg 
          className="w-10 h-10 text-white" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
          />
        </svg>
      </div>
      
      <h1 className="text-2xl font-bold mb-4 text-center">Resetting Onboarding Experience</h1>
      <p className="text-center mb-8 max-w-md">
        We're resetting your onboarding progress and will redirect you to the welcome page momentarily...
      </p>
      
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-primary animate-pulse rounded-full"></div>
      </div>
    </div>
  );
};

export default ResetOnboardingPage;