import { useEffect, useState, useRef } from 'react';
import { useOnboarding } from '@/contexts/onboarding-context';
import { WelcomeAnimation } from './WelcomeAnimation';
import { ConceptIntroduction } from './ConceptIntroduction';
import { PersonalizedGreeting } from './PersonalizedGreeting';
import { BlockchainConcepts } from './BlockchainConcepts';
import WalletConnection from './WalletConnection';
import MobileStaticWelcome from './MobileStaticWelcome';

/**
 * The main onboarding flow component that displays the appropriate
 * onboarding step based on current progress.
 */
export const OnboardingFlow = () => {
  const { currentStep, progress, resetOnboarding } = useOnboarding();
  const [forceWelcome, setForceWelcome] = useState(false);
  const isInitialMount = useRef(true);
  
  // Check if welcome should be forced, but only on first render
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      
      // Validate localStorage state
      const step = localStorage.getItem('chronosVault.onboardingStep');
      const completed = localStorage.getItem('chronosVault.onboardingCompleted');
      
      // Log debug information
      console.log('OnboardingFlow mounted with:', {
        currentStep,
        localStorage: {
          step,
          completed
        }
      });
      
      // If there's an inconsistency, force welcome screen
      if (!step || step === 'null' || step === 'undefined') {
        console.log('No step found in localStorage, forcing welcome animation');
        setForceWelcome(true);
        
        // Only set localStorage values once to avoid infinite loops
        try {
          localStorage.removeItem('chronosVault.onboardingStep');
          localStorage.removeItem('chronosVault.onboardingCompleted');
          localStorage.setItem('chronosVault.firstVisit', 'true');
        } catch (error) {
          console.error('Error setting localStorage values:', error);
        }
      }
    }
  }, []); // Empty dependency array ensures this only runs once
  
  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);
  
  // Check if we're on mobile
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  
  // Render the appropriate step component
  const renderCurrentStep = () => {
    // For mobile devices, use ultra-simplified welcome screen
    // to avoid any potential animation or rendering issues
    if (isMobile && (currentStep === 'welcome' || forceWelcome)) {
      console.log("Using mobile-optimized static welcome screen");
      return <MobileStaticWelcome />;
    }
    
    // Always show welcome if force welcome is true (desktop only)
    if (forceWelcome) {
      return <WelcomeAnimation />;
    }
    
    // Otherwise show the current step based on enum value
    switch (currentStep) {
      case 'welcome':
        return <WelcomeAnimation />;
      case 'concepts':
        return <ConceptIntroduction />;
      case 'personalization':
        return <PersonalizedGreeting />;
      case 'blockchain-explainer':
        return <BlockchainConcepts />;
      case 'wallet-connection':
        return <WalletConnection />;
      case 'complete':
        // When complete, automatically redirect to home (handled by useEffect in OnboardingRedirect.tsx)
        return null;
      default:
        // For safety, return welcome animation for any other value
        console.log('Invalid step detected, showing welcome animation:', currentStep);
        // Use mobile static version on mobile for safety
        return isMobile ? <MobileStaticWelcome /> : <WelcomeAnimation />;
    }
  };
  
  // Show progress indicator
  return (
    <div className="flex flex-col min-h-screen">
      {/* Progress indicator */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Mobile-friendly text indicator */}
      <div className="fixed top-2 right-3 z-50 bg-background/60 backdrop-blur-sm text-xs rounded-full px-2 py-1 border border-border shadow-sm">
        <span className="text-muted-foreground font-medium">
          Step {currentStep !== 'complete' ? 
            Math.max(1, ['welcome', 'concepts', 'personalization', 'blockchain-explainer', 'wallet-connection'].indexOf(currentStep) + 1) : 5} of 5
        </span>
      </div>
      
      {/* Current step content */}
      <div className="flex-1 flex flex-col">
        {renderCurrentStep()}
      </div>
      
      {/* Emergency reset button - only for development */}
      {typeof window !== 'undefined' && localStorage.getItem('chronosVault.devMode') === 'true' && (
        <button 
          className="fixed top-16 right-3 z-50 bg-red-500 text-white text-xs rounded px-2 py-1 opacity-70 hover:opacity-100"
          onClick={(e) => {
            e.preventDefault();
            console.log('Manual reset triggered');
            resetOnboarding();
          }}
        >
          Reset Flow
        </button>
      )}
    </div>
  );
};