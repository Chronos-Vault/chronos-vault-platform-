import { useEffect, useState } from 'react';
import { useOnboarding } from '@/contexts/onboarding-context';
import { WelcomeAnimation } from './WelcomeAnimation';
import { ConceptIntroduction } from './ConceptIntroduction';
import { PersonalizedGreeting } from './PersonalizedGreeting';
import { BlockchainConcepts } from './BlockchainConcepts';
import WalletConnection from './WalletConnection';

/**
 * The main onboarding flow component that displays the appropriate
 * onboarding step based on current progress.
 */
export const OnboardingFlow = () => {
  const { currentStep, progress, resetOnboarding } = useOnboarding();
  const [forceWelcome, setForceWelcome] = useState(false);
  
  // Check if welcome should be forced on first render
  useEffect(() => {
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
      
      // Reset localStorage values
      localStorage.removeItem('chronosVault.onboardingStep');
      localStorage.removeItem('chronosVault.onboardingCompleted');
      localStorage.setItem('chronosVault.firstVisit', 'true');
    }
  }, []);
  
  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);
  
  // Render the appropriate step component
  const renderCurrentStep = () => {
    // Always show welcome if force welcome is true
    if (forceWelcome) {
      return <WelcomeAnimation />;
    }
    
    // Otherwise show the current step
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
        // If we have an invalid step, reset to welcome
        console.log('Invalid step detected, resetting to welcome');
        return <WelcomeAnimation />;
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
            ['welcome', 'concepts', 'personalization', 'blockchain-explainer', 'wallet-connection'].indexOf(currentStep) + 1 : 5} of 5
        </span>
      </div>
      
      {/* Current step content */}
      <div className="flex-1 flex flex-col">
        {renderCurrentStep()}
      </div>
      
      {/* Debug reset button - only visible in dev mode */}
      {localStorage.getItem('chronosVault.devMode') === 'true' && (
        <button 
          className="fixed top-16 right-3 z-50 bg-red-500 text-white text-xs rounded px-2 py-1"
          onClick={() => resetOnboarding()}
        >
          Reset Flow
        </button>
      )}
    </div>
  );
};