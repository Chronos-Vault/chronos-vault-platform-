import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, RefreshCw, CheckCircle } from 'lucide-react';
import { useOnboarding } from '@/contexts/onboarding-context';

/**
 * Ultra-reliable welcome screen for mobile devices
 * Completely rebuilt for maximum reliability and error resilience
 */
const MobileStaticWelcome: React.FC = () => {
  const { completeCurrentStep, resetOnboarding } = useOnboarding();
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  
  // Initialize the component
  useEffect(() => {
    console.log("MobileStaticWelcome: Component mounted");
    
    // Safety check - ensure we have valid localStorage state
    try {
      // Ensure all required flags are properly set
      if (!localStorage.getItem('chronosVault.onboardingStep')) {
        localStorage.setItem('chronosVault.onboardingStep', JSON.stringify('welcome'));
      }
      
      if (!localStorage.getItem('chronosVault.onboardingCompleted')) {
        localStorage.setItem('chronosVault.onboardingCompleted', 'false');
      }
      
      if (!localStorage.getItem('chronosVault.firstVisit')) {
        localStorage.setItem('chronosVault.firstVisit', 'true');
      }
      
      // Mark that we're using the mobile experience
      localStorage.setItem('chronosVault.isMobile', 'true');
    } catch (error) {
      console.error("MobileStaticWelcome: Error initializing localStorage", error);
    }
  }, []);
  
  // Safe continue function with multiple fallbacks
  const handleContinue = () => {
    console.log("MobileStaticWelcome: Continue button clicked");
    setIsLoading(true);
    
    try {
      // First, try to mark onboarding as complete via localStorage
      localStorage.setItem('chronosVault.onboardingStep', JSON.stringify('complete'));
      localStorage.setItem('chronosVault.onboardingCompleted', 'true');
      localStorage.setItem('chronosVault.firstVisit', 'false');
      
      // Then try to update React context
      try {
        completeCurrentStep();
      } catch (contextError) {
        console.error("MobileStaticWelcome: Error updating context", contextError);
      }
      
      // Finally, navigate home after a brief delay
      setTimeout(() => {
        console.log("MobileStaticWelcome: Navigating to home");
        window.location.href = '/';
      }, 300);
    } catch (error) {
      console.error("MobileStaticWelcome: Critical error in continue flow", error);
      // Last resort - direct navigation
      window.location.href = '/';
    }
  };
  
  // Perform a full reset of localStorage and onboarding state
  const performReset = () => {
    console.log("MobileStaticWelcome: Reset button clicked");
    setIsLoading(true);
    
    try {
      // Clear all localStorage data
      localStorage.clear();
      
      // Set fresh values
      localStorage.setItem('chronosVault.onboardingStep', JSON.stringify('welcome'));
      localStorage.setItem('chronosVault.onboardingCompleted', 'false');
      localStorage.setItem('chronosVault.firstVisit', 'true');
      localStorage.setItem('chronosVault.isMobile', 'true');
      
      // Update React context
      try {
        resetOnboarding();
      } catch (contextError) {
        console.error("MobileStaticWelcome: Error resetting context", contextError);
      }
      
      // Show success message
      setResetSuccess(true);
      setIsLoading(false);
      
      // Reset the success message after a few seconds
      setTimeout(() => {
        setResetSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("MobileStaticWelcome: Error during reset", error);
      setIsLoading(false);
      // Hard reload as last resort
      window.location.reload();
    }
  };
  
  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      {/* Mobile-optimized animated gradient background - very subtle animation */}
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom, rgba(107, 0, 215, 0.1), rgba(0, 0, 0, 0.8))',
          opacity: 0.8
        }}
      ></div>
      
      {/* Logo */}
      <div className="relative z-10 mb-8 border-4 border-[#6B00D7] w-28 h-28 rounded-full bg-black flex items-center justify-center">
        <div className="w-14 h-14 text-[#FF5AF7] flex items-center justify-center">
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
      
      {/* Title with subtle animation */}
      <h1 
        className="relative z-10 text-3xl font-bold mb-3 text-center"
        style={{
          background: 'linear-gradient(to right, #6B00D7, #FF5AF7)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textFillColor: 'transparent'
        }}
      >
        Chronos Vault
      </h1>
      
      {/* Subtitle */}
      <p className="relative z-10 text-lg text-white/80 mb-8 text-center max-w-xs">
        Secure your digital future with time-locked blockchain vaults
      </p>
      
      {/* Feature list - static */}
      <div className="relative z-10 mb-10 w-full max-w-xs">
        <div className="bg-[#1A1A1A] border border-[#6B00D7]/30 rounded-lg p-5 mb-4 shadow-lg shadow-[#6B00D7]/5">
          <h3 className="text-[#FF5AF7] font-semibold mb-2 text-lg">Triple-Chain Security</h3>
          <p className="text-white/70">Assets secured across TON, Ethereum, and Solana networks</p>
        </div>
        <div className="bg-[#1A1A1A] border border-[#6B00D7]/30 rounded-lg p-5 shadow-lg shadow-[#6B00D7]/5">
          <h3 className="text-[#FF5AF7] font-semibold mb-2 text-lg">Premium Vault Experience</h3>
          <p className="text-white/70">Military-grade encryption with the luxurious Tesla × Rolex × Web3 experience</p>
        </div>
      </div>
      
      {/* Continue button */}
      <Button
        size="lg"
        className="relative z-10 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#FF5AF7] hover:to-[#6B00D7] text-white px-8 py-6 w-full max-w-xs text-lg font-bold h-auto transition-all duration-500"
        onClick={handleContinue}
        disabled={isLoading}
      >
        {isLoading ? (
          <RefreshCw className="h-5 w-5 animate-spin" />
        ) : (
          <>
            Begin <ArrowRight className="ml-2 h-5 w-5" />
          </>
        )}
      </Button>
      
      {/* Skip button */}
      <button 
        className="relative z-10 mt-4 text-white/60 hover:text-white text-base underline" 
        onClick={handleContinue}
        disabled={isLoading}
      >
        Skip intro
      </button>
      
      {/* Reset success message */}
      {resetSuccess && (
        <div className="fixed top-4 left-0 right-0 mx-auto z-50 bg-green-900/80 text-green-200 px-4 py-3 rounded-md max-w-xs flex items-center justify-center shadow-lg">
          <CheckCircle className="h-5 w-5 mr-2" />
          Reset successful!
        </div>
      )}
      
      {/* Emergency reset button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          className="bg-red-900/20 border border-red-500/30 text-red-300 text-xs"
          onClick={performReset}
          disabled={isLoading}
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            'Emergency Reset'
          )}
        </Button>
      </div>
    </div>
  );
};

export default MobileStaticWelcome;