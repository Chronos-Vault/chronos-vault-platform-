import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { WelcomeAnimation } from './WelcomeAnimation';
import { ConceptIntroduction } from './ConceptIntroduction';
import { PersonalizedGreeting } from './PersonalizedGreeting';
import { BlockchainConcepts } from './BlockchainConcepts';
import { useOnboarding } from '@/hooks/use-onboarding';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export const OnboardingFlow = () => {
  const { 
    currentStep, 
    completeCurrentStep, 
    progress,
    skipToEnd
  } = useOnboarding();

  // Render the current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'welcome':
        return <WelcomeAnimation onComplete={completeCurrentStep} />;
        
      case 'concepts':
        return <ConceptIntroduction onComplete={completeCurrentStep} />;
        
      case 'personalization':
        return <PersonalizedGreeting onContinue={completeCurrentStep} />;
        
      case 'blockchain-explainer':
        return <BlockchainConcepts onComplete={completeCurrentStep} />;
        
      // Additional steps would be added here for wallet connection
        
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p>Loading...</p>
          </div>
        );
    }
  };
  
  // Update document title based on current step
  useEffect(() => {
    const stepTitles = {
      welcome: 'Welcome to Chronos Vault',
      concepts: 'Core Concepts - Chronos Vault',
      personalization: 'Your Personal Vault',
      'blockchain-explainer': 'Blockchain Fundamentals',
      'wallet-connection': 'Connect Your Wallet',
      complete: 'Chronos Vault'
    };
    
    document.title = stepTitles[currentStep];
    
    return () => {
      document.title = 'Chronos Vault';
    };
  }, [currentStep]);

  return (
    <div className="onboarding-flow h-full w-full flex flex-col">
      {/* Skip button (hidden on welcome screen) */}
      {currentStep !== 'welcome' && currentStep !== 'complete' && (
        <div className="absolute top-4 right-4 z-50">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={skipToEnd}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
      )}
      
      {/* Progress indicator */}
      {currentStep !== 'welcome' && currentStep !== 'complete' && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-muted z-50">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}
      
      {/* Content area with animations between steps */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="h-full w-full"
          >
            {renderCurrentStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};