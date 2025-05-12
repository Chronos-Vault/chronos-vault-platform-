import { useEffect, useState } from 'react';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { useOnboarding } from '@/contexts/onboarding-context';
import { Loader2 } from 'lucide-react';

/**
 * Enhanced onboarding page with built-in error handling and recovery
 */
export default function OnboardingPage() {
  const { resetOnboarding, currentStep } = useOnboarding();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Detect if we're on a mobile device
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  
  // Initialize the page
  useEffect(() => {
    console.log('OnboardingPage: Initializing with step:', currentStep);
    
    // Safety check - ensure we have valid localStorage state
    try {
      const savedStep = localStorage.getItem('chronosVault.onboardingStep');
      if (!savedStep || savedStep === 'null' || savedStep === 'undefined') {
        console.log('OnboardingPage: Missing step in localStorage, resetting');
        localStorage.setItem('chronosVault.onboardingStep', JSON.stringify('welcome'));
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('OnboardingPage: Error checking localStorage:', error);
      setHasError(true);
      setIsLoading(false);
    }
  }, []);
  
  // If there's an error, provide a way to recover
  if (hasError) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black">
        <div className="p-8 bg-[#111] rounded-lg border border-[#6B00D7]/30 max-w-md text-center">
          <div className="w-16 h-16 mx-auto mb-4 text-red-500">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Onboarding Error</h1>
          <p className="text-gray-300 mb-6">There was a problem loading the onboarding experience.</p>
          <button 
            className="w-full py-3 px-4 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white rounded-md font-medium"
            onClick={() => {
              resetOnboarding();
              setHasError(false);
              setTimeout(() => window.location.reload(), 100);
            }}
          >
            Reset & Try Again
          </button>
        </div>
      </div>
    );
  }
  
  // Show a loader while initializing
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-black">
        <div className="text-[#FF5AF7] animate-pulse flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin mb-4" />
          <p className="text-lg font-medium">Loading onboarding experience...</p>
        </div>
      </div>
    );
  }
  
  // Render the normal onboarding flow once everything is initialized
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-black">
      <OnboardingFlow />
      
      {/* Emergency reset button - always visible on this page */}
      <button 
        className="fixed bottom-4 right-4 z-50 px-3 py-1 bg-red-900/30 border border-red-500/30 
                   text-red-300 text-xs rounded-md hover:bg-red-900/50 transition-colors"
        onClick={() => {
          console.log('Emergency reset triggered from onboarding page');
          localStorage.clear();
          resetOnboarding();
          setTimeout(() => window.location.reload(), 100);
        }}
      >
        Emergency Reset
      </button>
    </div>
  );
}