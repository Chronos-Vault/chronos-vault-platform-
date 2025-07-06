import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useOnboarding } from '@/contexts/onboarding-context';
import { RotateCcw, RefreshCcw, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * This is a special page that allows a force reset of the onboarding experience
 * Access it via /force-reset, /reset, /forcereset, /emergency-reset, or /mobile-reset
 * 
 * This page has been optimized for both desktop and mobile experiences
 */
const ForceResetPage: React.FC = () => {
  const { resetOnboarding } = useOnboarding();
  const [_, navigate] = useLocation();
  const [resetStatus, setResetStatus] = useState<
    'initializing' | 'clearing' | 'setting' | 'completed' | 'redirecting'
  >('initializing');
  const [countDown, setCountDown] = useState(3);
  
  // Mobile detection
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  
  useEffect(() => {
    console.log('EMERGENCY RESET: Force reset page loaded');
    console.log('Device type:', isMobile ? 'Mobile' : 'Desktop');
    
    const processReset = async () => {
      try {
        // STEP 1: Clear existing onboarding data
        setResetStatus('clearing');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Clear everything in localStorage related to onboarding
        localStorage.removeItem('chronosVault.onboardingStep');
        localStorage.removeItem('chronosVault.onboardingCompleted');
        localStorage.removeItem('chronosVault.firstVisit');
        
        // STEP 2: Set new values for fresh start
        setResetStatus('setting');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Set first visit explicitly
        localStorage.setItem('chronosVault.firstVisit', 'true');
        localStorage.setItem('chronosVault.onboardingStep', JSON.stringify('welcome'));
        localStorage.setItem('chronosVault.onboardingCompleted', 'false');
        
        // Set a flag for mobile optimization if needed
        if (isMobile) {
          localStorage.setItem('chronosVault.isMobile', 'true');
        } else {
          localStorage.removeItem('chronosVault.isMobile');
        }
        
        // STEP 3: Call the context method
        resetOnboarding();
        
        // STEP 4: Mark as completed
        setResetStatus('completed');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // STEP 5: Start countdown for redirect
        setResetStatus('redirecting');
        
        // Countdown timer
        for (let i = 3; i > 0; i--) {
          setCountDown(i);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // FINAL STEP: Redirect to onboarding
        navigate('/onboarding');
      } catch (e) {
        console.error('Error during reset process:', e);
        // If there's an error, try a simpler approach as fallback
        localStorage.clear();
        window.location.href = '/onboarding';
      }
    };
    
    // Start the reset process
    processReset();
  }, [resetOnboarding, navigate, isMobile]);
  
  // Function to handle manual redirect
  const handleManualRedirect = () => {
    navigate('/onboarding');
  };
  
  // Custom styling for mobile
  const containerClass = isMobile
    ? "flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black to-gray-900 text-white px-4 py-8"
    : "flex flex-col items-center justify-center min-h-screen bg-black text-white";
  
  // Status-specific icon
  const StatusIcon = () => {
    switch (resetStatus) {
      case 'initializing':
        return <RotateCcw className="h-10 w-10 text-primary animate-spin" />;
      case 'clearing':
        return <RefreshCcw className="h-10 w-10 text-primary animate-spin" />;
      case 'setting':
        return <RefreshCcw className="h-10 w-10 text-secondary animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-10 w-10 text-green-500" />;
      case 'redirecting':
        return <ArrowRight className="h-10 w-10 text-primary animate-pulse" />;
      default:
        return <RotateCcw className="h-10 w-10 text-primary animate-spin" />;
    }
  };
  
  return (
    <div className={containerClass}>
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-8">
        <StatusIcon />
      </div>
      
      <h1 className="text-3xl font-bold mb-4 text-center bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
        {resetStatus === 'redirecting' ? 'Reset Complete' : 'Emergency Reset'}
      </h1>
      
      <p className="text-center max-w-md mb-6">
        {resetStatus === 'initializing' && 'Preparing to reset your onboarding experience...'}
        {resetStatus === 'clearing' && 'Clearing previous onboarding data...'}
        {resetStatus === 'setting' && 'Setting up a fresh start...'}
        {resetStatus === 'completed' && 'Reset successful! Preparing to redirect...'}
        {resetStatus === 'redirecting' && `Redirecting to welcome screen in ${countDown}...`}
      </p>
      
      {/* Progress bar */}
      <div className="w-64 h-3 bg-gray-800 rounded-full mb-8 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300"
          style={{ 
            width: resetStatus === 'initializing' ? '10%' : 
                  resetStatus === 'clearing' ? '30%' : 
                  resetStatus === 'setting' ? '60%' : 
                  resetStatus === 'completed' ? '90%' : '100%' 
          }}
        ></div>
      </div>
      
      {/* Manual redirect button - only show when everything is ready */}
      {(resetStatus === 'completed' || resetStatus === 'redirecting') && (
        <Button
          onClick={handleManualRedirect}
          className="bg-gradient-to-r from-primary to-secondary text-white"
        >
          Continue Now <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}
      
      {/* Debug information - only in development mode */}
      {localStorage.getItem('chronosVault.devMode') === 'true' && (
        <div className="mt-8 text-xs text-gray-500 text-center">
          <p>Device: {isMobile ? 'Mobile' : 'Desktop'}</p>
          <p>Status: {resetStatus}</p>
          <p>localStorage: {Object.keys(localStorage).filter(k => k.startsWith('chronosVault')).join(', ')}</p>
        </div>
      )}
    </div>
  );
};

export default ForceResetPage;