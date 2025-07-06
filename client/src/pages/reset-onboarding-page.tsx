import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useOnboarding } from '@/contexts/onboarding-context';
import { RotateCcw } from 'lucide-react';

/**
 * This is a simple page component that resets the onboarding experience
 * and redirects to the onboarding page. It's used for special URL matches
 * like /resetOnboarding=true to provide an easy way to reset.
 */
const ResetOnboardingPage: React.FC = () => {
  const { resetOnboarding } = useOnboarding();
  const [_, navigate] = useLocation();
  
  useEffect(() => {
    // Log that we're resetting onboarding
    console.log('ResetOnboardingPage: Resetting onboarding');
    
    // Clear onboarding related localStorage items
    localStorage.removeItem('chronosVault.onboardingStep');
    localStorage.removeItem('chronosVault.onboardingCompleted');
    localStorage.setItem('chronosVault.firstVisit', 'true');
    
    // Call the context method
    resetOnboarding();
    
    // Navigate to onboarding page after a brief delay
    const timer = setTimeout(() => {
      navigate('/onboarding');
    }, 1500);
    
    // Clean up timer on unmount
    return () => {
      clearTimeout(timer);
    };
  }, [resetOnboarding, navigate]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div className="flex items-center justify-center mb-4">
        <RotateCcw className="animate-spin h-12 w-12 text-primary mr-4" />
        <h1 className="text-3xl font-bold">Resetting Onboarding</h1>
      </div>
      <p className="text-lg text-center max-w-md">
        Preparing a fresh start for you...
      </p>
    </div>
  );
};

export default ResetOnboardingPage;