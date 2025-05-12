import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { useOnboarding } from '@/contexts/onboarding-context';
import { ArrowRight, Check } from 'lucide-react';

/**
 * This is a completely self-contained mobile experience
 * that operates independently from the main onboarding flow.
 * It does not rely on animations, transitions, or complex effects
 * to maximize reliability on mobile devices.
 */
const MobileDirect = () => {
  const [_, navigate] = useLocation();
  const { resetOnboarding, completeOnboarding } = useOnboarding();
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState(0);
  
  // Reset onboarding state on mount
  useEffect(() => {
    console.log('MobileDirect: Initializing mobile-optimized experience');
    
    // Clear localStorage first
    try {
      localStorage.removeItem('chronosVault.onboardingStep');
      localStorage.removeItem('chronosVault.onboardingCompleted');
      localStorage.removeItem('chronosVault.firstVisit');
      
      // Then set to initial values
      localStorage.setItem('chronosVault.isMobile', 'true');
      
      // Use resetOnboarding to ensure context is synchronized
      resetOnboarding();
      
      // End loading after a brief delay
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    } catch (e) {
      console.error('Error initializing mobile experience:', e);
      // Show the UI anyway after a delay
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }
  }, [resetOnboarding]);
  
  // Handle continue button click
  const handleContinue = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      // Complete the onboarding on the final step
      completeOnboarding();
      navigate('/');
    }
  };
  
  // Handle skip button click
  const handleSkip = () => {
    completeOnboarding();
    navigate('/');
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-transparent bg-clip-text mb-6">
            Chronos Vault
          </h1>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full border-4 border-[#6B00D7] border-t-transparent animate-spin"></div>
          </div>
          <p className="text-white text-lg">Loading mobile experience...</p>
        </div>
      </div>
    );
  }
  
  // Render the current step content
  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <>
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-transparent bg-clip-text">
              Welcome to Chronos Vault
            </h2>
            <p className="text-white mb-6">
              Your secure blockchain time vault for assets and digital memories.
            </p>
            <div className="bg-[#1A1A1A] border border-[#6B00D7]/20 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-[#FF5AF7] mb-2">Key Features</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-[#FF5AF7] mr-2 mt-0.5" />
                  <span className="text-white">Multi-chain security across TON, Ethereum, Solana</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-[#FF5AF7] mr-2 mt-0.5" />
                  <span className="text-white">Time-locked assets with customizable unlock dates</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-[#FF5AF7] mr-2 mt-0.5" />
                  <span className="text-white">Military-grade security protocols</span>
                </li>
              </ul>
            </div>
          </>
        );
        
      case 1:
        return (
          <>
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-transparent bg-clip-text">
              Triple-Chain Security
            </h2>
            <p className="text-white mb-6">
              Your assets are secured by three independent blockchain networks.
            </p>
            <div className="grid grid-cols-1 gap-3 mb-6">
              <div className="bg-[#1A1A1A] border border-[#6B00D7]/20 rounded-lg p-3">
                <h3 className="text-lg font-semibold text-[#FF5AF7] mb-1">Primary Layer (Ethereum)</h3>
                <p className="text-white text-sm">Ownership records and access control</p>
              </div>
              
              <div className="bg-[#1A1A1A] border border-[#6B00D7]/20 rounded-lg p-3">
                <h3 className="text-lg font-semibold text-[#FF5AF7] mb-1">Security Layer (Solana)</h3>
                <p className="text-white text-sm">High-frequency monitoring and validation</p>
              </div>
              
              <div className="bg-[#1A1A1A] border border-[#6B00D7]/20 rounded-lg p-3">
                <h3 className="text-lg font-semibold text-[#FF5AF7] mb-1">Recovery Layer (TON)</h3>
                <p className="text-white text-sm">Backup security and emergency operations</p>
              </div>
            </div>
          </>
        );
        
      case 2:
        return (
          <>
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-transparent bg-clip-text">
              Ready to Start
            </h2>
            <p className="text-white mb-6">
              Your Chronos Vault experience is ready. Create your first vault now.
            </p>
            <div className="bg-[#1A1A1A] border border-[#6B00D7]/20 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-[#FF5AF7] mb-2">Getting Started</h3>
              <p className="text-white text-sm mb-4">
                On the next screen, you can:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-[#FF5AF7] mr-2 mt-0.5" />
                  <span className="text-white">Create your first time-locked vault</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-[#FF5AF7] mr-2 mt-0.5" />
                  <span className="text-white">Connect your wallet to secure assets</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-[#FF5AF7] mr-2 mt-0.5" />
                  <span className="text-white">Explore security settings for your vault</span>
                </li>
              </ul>
            </div>
          </>
        );

      default:
        return null;
    }
  };
  
  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center p-5">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#6B00D7]/5 to-black pointer-events-none"></div>
      
      {/* Logo */}
      <div className="relative z-10 mb-6 border-4 border-[#6B00D7] w-20 h-20 rounded-full bg-black flex items-center justify-center">
        <div className="w-10 h-10 text-[#FF5AF7] flex items-center justify-center">
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
      
      {/* Content area */}
      <div className="relative z-10 w-full max-w-sm bg-black/80 backdrop-blur-sm border border-[#6B00D7]/30 rounded-lg p-6 mb-6">
        {renderStepContent()}
      </div>
      
      {/* Navigation buttons */}
      <div className="relative z-10 w-full max-w-sm flex flex-col gap-3">
        <Button
          className="w-full bg-[#6B00D7] hover:bg-[#6B00D7]/90 text-white"
          onClick={handleContinue}
        >
          {step < 2 ? "Continue" : "Get Started"} 
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        
        {step < 2 && (
          <Button
            variant="ghost"
            className="text-white/70 hover:text-white hover:bg-transparent"
            onClick={handleSkip}
          >
            Skip Introduction
          </Button>
        )}
      </div>
      
      {/* Step indicator */}
      <div className="relative z-10 mt-6 flex gap-2">
        {[0, 1, 2].map((index) => (
          <div 
            key={index} 
            className={`w-2 h-2 rounded-full ${step === index ? 'bg-[#FF5AF7]' : 'bg-white/30'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default MobileDirect;