import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, LockKeyhole, Clock, Layers, ChevronRight } from 'lucide-react';
import { useOnboarding } from '@/contexts/onboarding-context';

/**
 * Professional luxury welcome component for mobile devices
 * Enhanced with subtle animations and premium UI elements
 * Optimized for mobile performance
 */
const MobileStaticWelcome: React.FC = () => {
  const { completeCurrentStep } = useOnboarding();
  const [activeFeature, setActiveFeature] = useState(0);
  const [showHighlight, setShowHighlight] = useState(false);
  
  // Features array for the rotating display
  const features = [
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Triple-Chain Security",
      description: "Assets secured by TON, Ethereum, and Solana networks"
    },
    {
      icon: <LockKeyhole className="w-5 h-5" />,
      title: "Quantum-Resistant",
      description: "Military-grade encryption for your digital assets"
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Time-Locked Vaults",
      description: "Program precise unlock dates for future access"
    },
    {
      icon: <Layers className="w-5 h-5" />,
      title: "Cross-Chain Verification",
      description: "Enhanced protection with multi-network validation"
    }
  ];
  
  // Auto-rotate features every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
      // Briefly show highlight animation
      setShowHighlight(true);
      setTimeout(() => setShowHighlight(false), 300);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Handle continue button click with safer implementation
  const handleContinue = () => {
    console.log("Mobile welcome continue button clicked");
    try {
      // Set all necessary flags for completion
      localStorage.setItem('chronosVault.onboardingStep', JSON.stringify('complete'));
      localStorage.setItem('chronosVault.onboardingCompleted', 'true');
      localStorage.setItem('chronosVault.firstVisit', 'false');
      
      // Let the app know onboarding is complete
      completeCurrentStep();
      
      // Navigate to home after a brief delay
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    } catch (e) {
      console.error("Error in welcome continue button:", e);
      // Fallback
      completeCurrentStep();
      window.location.href = '/';
    }
  };
  
  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col overflow-hidden">
      {/* Enhanced background with gradient and particle effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#120326] via-black to-black"></div>
      
      {/* Gradient rays */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-gradient-to-b from-[#6B00D7]/20 to-transparent blur-3xl"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] rounded-full bg-gradient-to-t from-[#FF5AF7]/10 to-transparent blur-3xl"></div>
      </div>
      
      {/* Subtle grid lines */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Header section with luxury branding */}
      <div className="relative z-10 pt-12 pb-4 px-6 flex flex-col items-center">
        {/* Logo with glow effect */}
        <div className="relative mb-6">
          <div className="absolute -inset-3 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] rounded-full opacity-20 blur-xl"></div>
          <div className="relative border-4 border-[#6B00D7] w-24 h-24 rounded-full bg-black/80 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-[#6B00D7]/20">
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
        
        {/* Title with gradient text */}
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-[#FF5AF7] bg-clip-text text-transparent">
          Chronos Vault
        </h1>
        
        {/* Luxury tagline */}
        <p className="text-sm text-white/80 mb-1 text-center max-w-xs">
          The Future of Digital Asset Security
        </p>
        
        {/* Premium descriptor */}
        <div className="flex items-center justify-center mb-6">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#6B00D7]/50"></div>
          <p className="px-3 text-xs uppercase tracking-widest text-[#FF5AF7]">Time-Locked Blockchain Vaults</p>
          <div className="h-[1px] w-12 bg-gradient-to-r from-[#6B00D7]/50 to-transparent"></div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 flex-grow flex flex-col px-6">
        {/* Feature showcase - auto-rotating */}
        <div className="relative mb-6 bg-gradient-to-b from-[#0A0118] to-black border border-[#6B00D7]/30 rounded-lg p-6 shadow-lg shadow-[#6B00D7]/5">
          {/* Subtle highlight animation when feature changes */}
          {showHighlight && (
            <div className="absolute inset-0 bg-[#FF5AF7]/5 rounded-lg animate-fade-in"></div>
          )}
          
          <div className="flex items-center mb-4">
            <div className={`mr-4 rounded-full bg-[#6B00D7]/20 p-3 transition-colors ${showHighlight ? 'bg-[#6B00D7]/40' : ''}`}>
              {features[activeFeature].icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#FF5AF7]">{features[activeFeature].title}</h3>
            </div>
          </div>
          
          <p className="text-gray-300 text-sm pl-12 leading-relaxed">
            {features[activeFeature].description}
          </p>
          
          {/* Feature indicator dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {features.map((_, index) => (
              <div 
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-500 ${
                  index === activeFeature 
                    ? 'bg-[#FF5AF7] w-5'
                    : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* Premium description */}
        <div className="mb-10 text-center">
          <p className="text-white/80 text-sm leading-relaxed">
            Create secure time-locked vaults with military-grade encryption and triple-chain protection. The gold standard for digital asset security.
          </p>
        </div>
      </div>
      
      {/* Footer with buttons */}
      <div className="relative z-10 px-6 pb-12">
        {/* Primary action button with gradient and shadow */}
        <div className="relative mb-3 group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] rounded-lg opacity-70 blur-sm group-hover:opacity-100 transition-opacity"></div>
          <Button
            className="relative w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#FF5AF7] hover:to-[#6B00D7] text-white font-medium py-6 rounded-lg shadow-lg shadow-[#6B00D7]/20 transition-all duration-300"
            onClick={handleContinue}
          >
            Enter Vault Experience
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
        
        {/* Skip link with understated style */}
        <button 
          className="w-full text-center text-white/60 hover:text-white text-sm pt-2 pb-4 transition-colors" 
          onClick={handleContinue}
        >
          Skip Introduction
        </button>
        
        {/* Ultra-premium descriptor */}
        <div className="flex justify-center items-center mt-2">
          <div className="h-[1px] w-6 bg-[#6B00D7]/30"></div>
          <p className="px-2 text-[10px] text-[#FF5AF7]/70 uppercase tracking-widest">Tesla × Rolex × Web3</p>
          <div className="h-[1px] w-6 bg-[#6B00D7]/30"></div>
        </div>
      </div>
      
      {/* Emergency button in case of issues - hidden in a less obtrusive way */}
      <div className="fixed bottom-2 right-2 z-50 opacity-30 hover:opacity-100 transition-opacity">
        <Button
          variant="outline"
          size="sm"
          className="bg-black/80 border border-red-500/30 text-red-300/80 text-xs px-2 py-1 h-auto"
          onClick={() => {
            localStorage.clear();
            window.location.href = '/';
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default MobileStaticWelcome;