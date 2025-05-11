import { useEffect } from 'react';
import { useOnboarding } from '@/contexts/onboarding-context';
import { WelcomeAnimation } from './WelcomeAnimation';
import { ConceptIntroduction } from './ConceptIntroduction';
import { PersonalizedGreeting } from './PersonalizedGreeting';
import { BlockchainConcepts } from './BlockchainConcepts';
// Temporary solution until the WalletConnection component is registered
// We'll mock it with a placeholder for now
const WalletConnection = () => (
  <div className="flex flex-col items-center justify-center min-h-screen p-6">
    <h2 className="text-2xl font-bold mb-4">Wallet Connection</h2>
    <p className="text-muted-foreground mb-8">Connect your wallet to continue</p>
  </div>
);

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