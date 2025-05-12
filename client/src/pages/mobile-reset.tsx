import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useOnboarding } from '@/contexts/onboarding-context';

/**
 * Emergency mobile reset page to clear all local storage and state
 * This page helps users who are experiencing mobile onboarding issues
 */
const MobileReset: React.FC = () => {
  const { resetOnboarding } = useOnboarding();
  const [status, setStatus] = useState('pending');
  
  // Function to reset everything
  const performReset = () => {
    try {
      // Clear all localStorage keys
      localStorage.clear();
      
      // Set new values to ensure proper reset
      localStorage.setItem('chronosVault.firstVisit', 'true');
      localStorage.setItem('chronosVault.onboardingStep', JSON.stringify('welcome'));
      localStorage.setItem('chronosVault.onboardingCompleted', 'false');
      localStorage.setItem('chronosVault.isMobile', 'true');
      
      // Reset onboarding context
      resetOnboarding();
      
      setStatus('success');
    } catch (error) {
      console.error('Reset error:', error);
      setStatus('error');
    }
  };
  
  // Navigate to mobile-specific page after reset
  const goToMobileDirect = () => {
    window.location.href = '/mobile-direct';
  };
  
  // Navigate to regular onboarding
  const goToOnboarding = () => {
    window.location.href = '/onboarding';
  };
  
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      {/* Simple header */}
      <h1 className="text-2xl font-bold text-white mb-6 text-center">
        Mobile Emergency Reset
      </h1>
      
      {/* Status message */}
      {status === 'success' && (
        <div className="mb-6 p-3 bg-green-900/30 border border-green-500/30 rounded-md text-center">
          <p className="text-green-300">Reset successful!</p>
          <p className="text-sm text-green-200/80 mt-1">
            All local data has been cleared.
          </p>
        </div>
      )}
      
      {status === 'error' && (
        <div className="mb-6 p-3 bg-red-900/30 border border-red-500/30 rounded-md text-center">
          <p className="text-red-300">Reset failed.</p>
          <p className="text-sm text-red-200/80 mt-1">
            Please try again or contact support.
          </p>
        </div>
      )}
      
      {/* Instructions */}
      <div className="mb-6 max-w-xs text-center">
        <p className="text-white/80 mb-4">
          This page will reset all onboarding progress and clear any stored data to resolve mobile display issues.
        </p>
      </div>
      
      {/* Action buttons */}
      <div className="w-full max-w-xs space-y-4">
        {status !== 'success' ? (
          <Button 
            className="w-full bg-red-600 hover:bg-red-700 text-white" 
            onClick={performReset}
          >
            Reset All Data
          </Button>
        ) : (
          <>
            <Button 
              className="w-full bg-[#6B00D7] hover:bg-[#6B00D7]/90 text-white" 
              onClick={goToMobileDirect}
            >
              Go to Mobile Experience
            </Button>
            
            <Button 
              className="w-full bg-[#6B00D7]/70 hover:bg-[#6B00D7]/60 text-white" 
              onClick={goToOnboarding}
            >
              Try Regular Onboarding
            </Button>
          </>
        )}
      </div>
      
      {/* Version info */}
      <div className="fixed bottom-4 text-center text-white/40 text-xs">
        <p>Chronos Vault Mobile Reset</p>
        <p>Version 1.0</p>
      </div>
    </div>
  );
};

export default MobileReset;