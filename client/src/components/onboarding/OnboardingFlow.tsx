import { useEffect } from 'react';
import { useOnboarding } from '@/contexts/onboarding-context';
import WelcomeAnimation from './WelcomeAnimation';
import { ConceptIntroduction } from './ConceptIntroduction';
import { PersonalizedGreeting } from './PersonalizedGreeting';
import { BlockchainConcepts } from './BlockchainConcepts';
import WalletConnection from './WalletConnection';

/**
 * The main onboarding flow component that displays the appropriate
 * onboarding step based on current progress.
 */
export const OnboardingFlow = () => {
  const { currentStep, progress } = useOnboarding();
  
  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);
  
  // Render the appropriate step component
  const renderCurrentStep = () => {
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
        return <WelcomeAnimation />;
    }
  };
  
  // Show progress indicator
  return (
    <div className="flex flex-col h-full">
      {/* Progress indicator */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Current step content */}
      <div className="flex-1">
        {renderCurrentStep()}
      </div>
    </div>
  );
};