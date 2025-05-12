import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useOnboarding } from '@/contexts/onboarding-context';

/**
 * Simplified welcome component for mobile devices
 * No complex animations or effects to ensure maximum compatibility
 */
const MobileStaticWelcome: React.FC = () => {
  const { completeCurrentStep } = useOnboarding();
  
  // Handle continue button click - with safer implementation
  const handleContinue = () => {
    console.log("Mobile continue button clicked - using safer completion");
    try {
      localStorage.setItem('chronosVault.onboardingStep', JSON.stringify('complete'));
      localStorage.setItem('chronosVault.onboardingCompleted', 'true');
      localStorage.setItem('chronosVault.firstVisit', 'false');
      
      // Let the app know onboarding is now complete
      completeCurrentStep();
      
      // Force home navigation after a brief delay
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    } catch (e) {
      console.error("Error in mobile continue button:", e);
      // Fallback to regular continue
      completeCurrentStep();
    }
  };
  
  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      {/* Simple gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#6B00D7]/10 to-black"></div>
      
      {/* Logo */}
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
      
      {/* Title */}
      <h1 className="relative z-10 text-2xl font-bold text-white mb-3 text-center">
        Chronos Vault
      </h1>
      
      {/* Subtitle */}
      <p className="relative z-10 text-sm text-white/80 mb-6 text-center max-w-xs">
        Secure your digital future with time-locked blockchain vaults
      </p>
      
      {/* Feature list - static */}
      <div className="relative z-10 mb-8 w-full max-w-xs">
        <div className="bg-[#1A1A1A] border border-[#6B00D7]/30 rounded-lg p-4 mb-4">
          <h3 className="text-[#FF5AF7] font-semibold mb-2">Triple-Chain Security</h3>
          <p className="text-white/70 text-sm">Assets secured across TON, Ethereum, and Solana networks</p>
        </div>
        <div className="bg-[#1A1A1A] border border-[#6B00D7]/30 rounded-lg p-4">
          <h3 className="text-[#FF5AF7] font-semibold mb-2">Premium Vault Experience</h3>
          <p className="text-white/70 text-sm">Military-grade encryption with the luxurious Tesla × Rolex × Web3 experience</p>
        </div>
      </div>
      
      {/* Continue button */}
      <Button
        size="default"
        className="relative z-10 bg-[#6B00D7] hover:bg-[#6B00D7]/90 text-white px-6 py-2 w-full max-w-xs"
        onClick={handleContinue}
      >
        Begin <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
      
      {/* Skip button */}
      <button 
        className="relative z-10 mt-4 text-white/60 hover:text-white text-sm underline" 
        onClick={handleContinue}
      >
        Skip intro
      </button>
      
      {/* Emergency reset button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          className="bg-red-900/20 border border-red-500/30 text-red-300 text-xs"
          onClick={() => {
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