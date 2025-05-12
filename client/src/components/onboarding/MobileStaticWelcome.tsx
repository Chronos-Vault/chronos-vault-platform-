import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useOnboarding } from '@/contexts/onboarding-context';

/**
 * Ultra-simplified welcome component for mobile devices
 * Contains only static elements with no animations, transitions, or complex effects
 * This should work on any mobile device regardless of capabilities
 */
const MobileStaticWelcome: React.FC = () => {
  const { completeCurrentStep } = useOnboarding();
  
  // Handle continue button click
  const handleContinue = () => {
    console.log("Mobile continue button clicked");
    completeCurrentStep();
  };
  
  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      {/* Static background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#6B00D7]/5 to-black"></div>
      
      {/* Logo - static */}
      <div className="relative z-10 mb-6 border-4 border-[#6B00D7] w-24 h-24 rounded-full bg-black flex items-center justify-center">
        <div className="w-12 h-12 text-[#FF5AF7] flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
              fill="currentColor"
            />
            <path
              d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
      
      {/* Title - static */}
      <h1 className="relative z-10 text-2xl font-bold text-white mb-3 text-center">
        Chronos Vault
      </h1>
      
      {/* Subtitle - static */}
      <p className="relative z-10 text-sm text-white/80 mb-6 text-center max-w-xs">
        Secure your digital future with time-locked blockchain vaults
      </p>
      
      {/* Continue button - immediately visible */}
      <Button
        size="default"
        className="relative z-10 bg-[#6B00D7] hover:bg-[#6B00D7]/90 text-white px-6 py-2"
        onClick={handleContinue}
      >
        Begin <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
      
      {/* Skip button - also immediately visible */}
      <button 
        className="relative z-10 mt-4 text-white/60 hover:text-white text-sm underline" 
        onClick={handleContinue}
      >
        Skip intro
      </button>
      
      {/* Emergency button in case of issues */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          className="bg-red-900/20 border border-red-500/30 text-red-300 text-xs"
          onClick={() => {
            // Force reset and redirect
            localStorage.clear();
            window.location.href = '/';
          }}
        >
          Emergency Reset
        </Button>
      </div>
    </div>
  );
};

export default MobileStaticWelcome;