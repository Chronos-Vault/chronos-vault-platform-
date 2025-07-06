import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { useOnboarding } from '@/contexts/onboarding-context';
import { ArrowRight, Check, Shield, Clock, LockKeyhole, Zap, Layers, Award } from 'lucide-react';

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
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-transparent bg-clip-text animate-fade-in">
              Welcome to Chronos Vault
            </h2>
            <p className="text-white mb-6 opacity-90">
              Your secure blockchain time vault for assets and digital memories.
            </p>
            
            {/* Animated feature cards */}
            <div className="space-y-3 mb-6">
              <div className="bg-gradient-to-r from-[#0A0118] to-[#120326] border border-[#6B00D7]/30 rounded-lg p-4 transition-all hover:border-[#FF5AF7]/40">
                <div className="flex items-center mb-2">
                  <div className="mr-3 rounded-full bg-[#6B00D7]/20 p-2">
                    <Shield className="w-5 h-5 text-[#FF5AF7]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#FF5AF7]">Multi-Chain Security</h3>
                </div>
                <p className="text-gray-300 text-sm ml-12">
                  Triple-layer protection across TON, Ethereum, and Solana networks
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-[#0A0118] to-[#120326] border border-[#6B00D7]/30 rounded-lg p-4 transition-all hover:border-[#FF5AF7]/40">
                <div className="flex items-center mb-2">
                  <div className="mr-3 rounded-full bg-[#6B00D7]/20 p-2">
                    <Clock className="w-5 h-5 text-[#FF5AF7]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#FF5AF7]">Time-Locked Vaults</h3>
                </div>
                <p className="text-gray-300 text-sm ml-12">
                  Program assets to unlock at precise dates with quantum-accurate timekeeping
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-[#0A0118] to-[#120326] border border-[#6B00D7]/30 rounded-lg p-4 transition-all hover:border-[#FF5AF7]/40">
                <div className="flex items-center mb-2">
                  <div className="mr-3 rounded-full bg-[#6B00D7]/20 p-2">
                    <LockKeyhole className="w-5 h-5 text-[#FF5AF7]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#FF5AF7]">Military-Grade Security</h3>
                </div>
                <p className="text-gray-300 text-sm ml-12">
                  Quantum-resistant encryption protecting your most valuable digital assets
                </p>
              </div>
            </div>
          </>
        );
        
      case 1:
        return (
          <>
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-transparent bg-clip-text animate-fade-in">
              Triple-Chain Security
            </h2>
            <p className="text-white mb-6 opacity-90">
              Your assets are secured by three independent blockchain networks.
            </p>
            
            {/* Animated security layer cards */}
            <div className="relative mb-6">
              {/* Connecting lines between layers */}
              <div className="absolute left-7 top-[5.5rem] bottom-16 w-0.5 bg-gradient-to-b from-[#6B00D7] to-[#FF5AF7] opacity-50"></div>
              
              <div className="relative z-10 bg-gradient-to-r from-[#0A0118] to-[#120326] border border-[#6B00D7]/30 rounded-lg p-4 mb-4 transition-all hover:border-[#FF5AF7]/40 hover:translate-x-1">
                <div className="flex">
                  <div className="mr-4 rounded-full bg-[#6B00D7]/20 h-10 w-10 flex items-center justify-center flex-shrink-0">
                    <div className="rounded-full bg-[#6B00D7] h-4 w-4"></div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#FF5AF7] mb-1">Primary Layer</h3>
                    <p className="text-white text-sm mb-1">Ethereum Network</p>
                    <p className="text-gray-400 text-xs">Handles ownership records and access control with ERC-4626 compliant vaults</p>
                  </div>
                </div>
              </div>
              
              <div className="relative z-10 bg-gradient-to-r from-[#0A0118] to-[#120326] border border-[#6B00D7]/30 rounded-lg p-4 mb-4 ml-4 transition-all hover:border-[#FF5AF7]/40 hover:translate-x-1">
                <div className="flex">
                  <div className="mr-4 rounded-full bg-[#6B00D7]/20 h-10 w-10 flex items-center justify-center flex-shrink-0">
                    <div className="rounded-full bg-[#FF5AF7] h-4 w-4"></div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#FF5AF7] mb-1">Security Layer</h3>
                    <p className="text-white text-sm mb-1">Solana Network</p>
                    <p className="text-gray-400 text-xs">Provides high-frequency monitoring and real-time validation</p>
                  </div>
                </div>
              </div>
              
              <div className="relative z-10 bg-gradient-to-r from-[#0A0118] to-[#120326] border border-[#6B00D7]/30 rounded-lg p-4 ml-8 transition-all hover:border-[#FF5AF7]/40 hover:translate-x-1">
                <div className="flex">
                  <div className="mr-4 rounded-full bg-[#6B00D7]/20 h-10 w-10 flex items-center justify-center flex-shrink-0">
                    <div className="rounded-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] h-4 w-4"></div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#FF5AF7] mb-1">Recovery Layer</h3>
                    <p className="text-white text-sm mb-1">TON Network</p>
                    <p className="text-gray-400 text-xs">Handles backup security and emergency recovery operations</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
        
      case 2:
        return (
          <>
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-transparent bg-clip-text animate-fade-in">
              Ready to Start
            </h2>
            <p className="text-white mb-6 opacity-90">
              Your Chronos Vault experience is ready. Create your first vault now.
            </p>
            
            {/* Getting started animation */}
            <div className="relative mb-6">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 rounded-lg opacity-50 blur-md"></div>
              <div className="relative bg-gradient-to-r from-[#0A0118] to-[#120326] border border-[#6B00D7]/30 rounded-lg p-5">
                <div className="flex items-center justify-center mb-4">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 animate-ping"></div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#6B00D7]/50 to-[#FF5AF7]/50 animate-pulse" style={{ animationDuration: '3s' }}></div>
                    <div className="absolute inset-3 rounded-full bg-black flex items-center justify-center">
                      <Zap className="w-6 h-6 text-[#FF5AF7]" />
                    </div>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-center text-white mb-3">
                  What's Next?
                </h3>
                
                <ul className="space-y-3">
                  <li className="flex items-start bg-black/30 p-2 rounded-lg">
                    <div className="bg-[#6B00D7]/20 rounded-full p-1 mr-3 mt-0.5">
                      <Check className="w-4 h-4 text-[#FF5AF7]" />
                    </div>
                    <span className="text-white text-sm">Create your first time-locked vault in seconds</span>
                  </li>
                  <li className="flex items-start bg-black/30 p-2 rounded-lg">
                    <div className="bg-[#6B00D7]/20 rounded-full p-1 mr-3 mt-0.5">
                      <Check className="w-4 h-4 text-[#FF5AF7]" />
                    </div>
                    <span className="text-white text-sm">Connect your wallet to secure digital assets</span>
                  </li>
                  <li className="flex items-start bg-black/30 p-2 rounded-lg">
                    <div className="bg-[#6B00D7]/20 rounded-full p-1 mr-3 mt-0.5">
                      <Check className="w-4 h-4 text-[#FF5AF7]" />
                    </div>
                    <span className="text-white text-sm">Customize security levels to your needs</span>
                  </li>
                </ul>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };
  
  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center p-5 overflow-hidden">
      {/* Enhanced gradient background with animated particles */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#6B00D7]/10 to-black pointer-events-none"></div>
      
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-[#FF5AF7]/10"
            style={{
              width: `${20 + Math.random() * 60}px`,
              height: `${20 + Math.random() * 60}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${20 + Math.random() * 40}s`,
              animationDelay: `${Math.random() * 10}s`,
              animation: 'float infinite linear',
              opacity: 0.3 + Math.random() * 0.4
            }}
          />
        ))}
      </div>
      
      {/* Animated blockchain line effects */}
      <div className="absolute inset-0 flex justify-between overflow-hidden pointer-events-none opacity-30">
        <div className="h-full w-px bg-gradient-to-b from-transparent via-[#6B00D7] to-transparent animate-pulse" style={{animationDuration: '4s'}}></div>
        <div className="h-full w-px bg-gradient-to-b from-transparent via-[#FF5AF7] to-transparent animate-pulse" style={{animationDuration: '7s'}}></div>
        <div className="h-full w-px bg-gradient-to-b from-transparent via-[#6B00D7] to-transparent animate-pulse" style={{animationDuration: '5s'}}></div>
      </div>
      
      {/* Enhanced Logo with glow effect */}
      <div className="relative z-10 mb-8">
        <div className="absolute -inset-2 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] rounded-full opacity-20 blur-md animate-pulse"></div>
        <div className="relative border-4 border-[#6B00D7] w-24 h-24 rounded-full bg-black flex items-center justify-center">
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
      </div>
      
      {/* Enhanced content area with animated border */}
      <div className="relative z-10 w-full max-w-sm">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] rounded-lg opacity-50 blur-sm"></div>
        <div className="relative bg-black/95 backdrop-blur-md rounded-lg p-6 mb-6 border border-[#6B00D7]/30">
          {renderStepContent()}
        </div>
      </div>
      
      {/* Enhanced navigation buttons */}
      <div className="relative z-10 w-full max-w-sm flex flex-col gap-3">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] rounded-md opacity-75 blur-sm group-hover:opacity-100 transition-opacity"></div>
          <Button
            className="relative w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#FF5AF7] hover:to-[#6B00D7] text-white font-medium py-6 transition-all duration-300 rounded-md"
            onClick={handleContinue}
          >
            {step < 2 ? "Continue" : "Get Started"} 
            <ArrowRight className="ml-2 h-4 w-4 animate-pulse" />
          </Button>
        </div>
        
        {step < 2 && (
          <Button
            variant="ghost"
            className="text-white/70 hover:text-white hover:bg-transparent transition-colors"
            onClick={handleSkip}
          >
            Skip Introduction
          </Button>
        )}
      </div>
      
      {/* Enhanced step indicator */}
      <div className="relative z-10 mt-8 flex gap-3">
        {[0, 1, 2].map((index) => (
          <div key={index} className="relative">
            {step === index && (
              <div className="absolute -inset-1 bg-[#FF5AF7]/30 rounded-full animate-pulse blur-sm"></div>
            )}
            <div 
              className={`w-3 h-3 rounded-full ${
                step === index 
                  ? 'bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]' 
                  : 'bg-white/30'
              } transition-all duration-300`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileDirect;