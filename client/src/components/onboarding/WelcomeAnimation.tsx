import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from '@/contexts/onboarding-context';
import { Button } from '@/components/ui/button';
import { ArrowRight, Info } from 'lucide-react';

export const WelcomeAnimation = () => {
  const { completeCurrentStep } = useOnboarding();
  const [animationComplete, setAnimationComplete] = useState(false);
  const [displayStatus, setDisplayStatus] = useState<'loading' | 'visible' | 'error'>('loading');
  
  // Flag to track if this is the first time the component has loaded
  useEffect(() => {
    // Force localStorage to record this as the first visit
    // This ensures the welcome animation will always be shown
    try {
      localStorage.setItem('chronosVault.firstVisit', 'true');
      localStorage.setItem('chronosVault.onboardingStep', 'welcome');
      localStorage.removeItem('chronosVault.onboardingCompleted');
      setDisplayStatus('visible');
    } catch (error) {
      console.error('Error setting localStorage values for welcome animation', error);
      setDisplayStatus('error');
    }
  }, []);
  
  // Start animation sequence when component mounts
  useEffect(() => {
    // Auto-complete animation after 4 seconds
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 4000);
    
    // Log when component mounts for debugging
    console.log("Welcome animation component mounted");
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleContinue = () => {
    console.log("Continue button clicked");
    completeCurrentStep();
  };
  
  // If we're still loading or have an error, show a placeholder
  if (displayStatus === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }
  
  // If we have an error, show an error message with retry button
  if (displayStatus === 'error') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="rounded-full bg-red-100 p-3 mb-4">
          <Info className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Welcome Animation Error</h2>
        <p className="text-center mb-6 max-w-md">
          There was a problem loading the welcome animation. This could be due to browser storage limitations.
        </p>
        <Button 
          className="bg-primary hover:bg-primary/90"
          onClick={() => {
            // Skip to next step
            completeCurrentStep();
          }}
        >
          Continue Anyway
        </Button>
      </div>
    );
  }
  
  // The main welcome animation 
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-gradient-to-b from-black to-gray-900 px-4 py-6">
      {/* Background gradient elements */}
      <motion.div
        className="absolute w-full h-full bg-gradient-radial from-purple-900/20 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />
      
      <motion.div
        className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-purple-900/30 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
      />
      
      {/* Logo animation */}
      <motion.div
        className="relative z-10 mb-10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            className="w-16 h-16 md:w-20 md:h-20 text-white"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
              fill="currentColor"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            <motion.path
              d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"
              fill="currentColor"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, delay: 1, ease: "easeInOut" }}
            />
          </svg>
        </div>
      </motion.div>
      
      {/* Title animation */}
      <motion.h1
        className="relative z-10 text-3xl md:text-6xl font-bold text-white mb-4 text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 1, ease: "easeOut" }}
      >
        Chronos Vault
      </motion.h1>
      
      {/* Subtitle animation */}
      <motion.p
        className="relative z-10 text-lg md:text-2xl text-white/80 mb-10 text-center max-w-md px-2"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 1.5, ease: "easeOut" }}
      >
        Secure your digital future with time-locked blockchain vaults
      </motion.p>
      
      {/* Continue button */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: animationComplete ? 1 : 0,
          y: animationComplete ? 0 : 20
        }}
        transition={{ duration: 0.5 }}
      >
        <Button
          size="lg"
          className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-8 py-6 text-lg"
          onClick={handleContinue}
        >
          Begin Journey <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </motion.div>
      
      {/* Added a skip button for users who may want to bypass onboarding */}
      <motion.div 
        className="mt-4 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: animationComplete ? 0.8 : 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <button 
          className="text-white/60 hover:text-white text-sm underline" 
          onClick={() => {
            console.log("Skip onboarding clicked");
            completeCurrentStep();
          }}
        >
          Skip intro
        </button>
      </motion.div>
      
      {/* Reset button (only visible in dev mode) */}
      {localStorage.getItem('chronosVault.devMode') === 'true' && (
        <button 
          className="absolute bottom-4 left-4 text-xs text-white/40 hover:text-white/80 bg-red-600/20 hover:bg-red-600/40 px-2 py-1 rounded"
          onClick={() => {
            localStorage.removeItem('chronosVault.onboardingStep');
            localStorage.removeItem('chronosVault.onboardingCompleted');
            localStorage.setItem('chronosVault.firstVisit', 'true');
            window.location.reload();
          }}
        >
          Reset Welcome
        </button>
      )}
    </div>
  );
};

// We export both as a named and default export for flexibility
export default WelcomeAnimation;