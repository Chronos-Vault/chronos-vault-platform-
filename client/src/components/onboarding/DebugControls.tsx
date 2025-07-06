import React, { useState } from 'react';
import { useOnboarding } from '@/contexts/onboarding-context';
import { useLocation } from 'wouter';

/**
 * Debug controls panel for onboarding
 * Only visible in development mode
 */
export const OnboardingDebugControls: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { 
    resetOnboarding, 
    currentStep, 
    setCurrentStep, 
    hasCompletedOnboarding,
    isFirstVisit,
    completeOnboarding
  } = useOnboarding();
  const [_, navigate] = useLocation();
  
  // Only show in development mode
  const isDevelopmentMode = localStorage.getItem('chronosVault.devMode') === 'true';
  if (!isDevelopmentMode) return null;
  
  // Get device type for better positioning
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  
  const handleReset = () => {
    console.log('Debug: Resetting onboarding...');
    resetOnboarding();
    localStorage.setItem('chronosVault.firstVisit', 'true');
    navigate('/onboarding');
  };
  
  // Fix type error by explicitly typing as OnboardingStep
  const handleDirectStep = (step: string) => {
    console.log(`Debug: Setting step to ${step}`);
    // Type assertion to match the expected OnboardingStep type
    setCurrentStep(step as any);
    navigate('/onboarding');
  };
  
  const handleComplete = () => {
    console.log('Debug: Marking onboarding as completed');
    completeOnboarding();
    navigate('/');
  };
  
  return (
    <div className={`fixed ${isMobile ? 'bottom-16' : 'bottom-4'} left-4 z-50 transition-all duration-300 
      ${isExpanded ? (isMobile ? 'h-60' : 'h-auto') : 'h-8'} 
      ${isMobile ? 'w-[calc(100%-2rem)]' : 'w-64'} 
      bg-black/80 border border-purple-500/30 rounded-md overflow-hidden text-xs`}>
      
      {/* Header bar */}
      <div 
        className="flex items-center justify-between bg-purple-900/50 px-2 py-1 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="text-white">🛠 Onboarding Debug Controls</span>
        <span className="text-white">{isExpanded ? '▼' : '▲'}</span>
      </div>
      
      {isExpanded && (
        <div className="p-2 text-white space-y-3">
          {/* Current state */}
          <div className="space-y-1">
            <p><span className="text-gray-400">Current step:</span> {currentStep}</p>
            <p><span className="text-gray-400">First visit:</span> {isFirstVisit ? 'Yes' : 'No'}</p>
            <p><span className="text-gray-400">Completed:</span> {hasCompletedOnboarding ? 'Yes' : 'No'}</p>
          </div>
          
          {/* Buttons */}
          <div className="flex flex-wrap gap-2">
            <button 
              className="px-2 py-1 bg-red-600/50 hover:bg-red-600 rounded text-white"
              onClick={handleReset}
            >
              Reset All
            </button>
            
            <button 
              className="px-2 py-1 bg-green-600/50 hover:bg-green-600 rounded text-white"
              onClick={handleComplete}
            >
              Complete
            </button>
          </div>
          
          {/* Step buttons */}
          <div className="flex flex-wrap gap-1">
            <p className="w-full text-gray-400">Go to step:</p>
            {[
              'welcome', 
              'concepts', 
              'personalization', 
              'blockchain-explainer', 
              'wallet-connection', 
              'complete'
            ].map(step => (
              <button 
                key={step}
                className={`px-2 py-1 rounded ${currentStep === step ? 'bg-blue-600' : 'bg-blue-600/30 hover:bg-blue-600/60'}`}
                onClick={() => handleDirectStep(step)}
              >
                {step.slice(0, 6)}...
              </button>
            ))}
          </div>
          
          {/* Emergency button */}
          <div className="border-t border-gray-700 pt-2">
            <button
              className="w-full px-2 py-1 bg-gradient-to-r from-red-600 to-orange-600 rounded font-medium text-white"
              onClick={() => navigate('/force-reset')}
            >
              EMERGENCY RESET
            </button>
          </div>
        </div>
      )}
    </div>
  );
};