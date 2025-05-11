import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocalStorage } from './use-local-storage';

// Define the onboarding step type
type OnboardingStep = 
  | 'welcome'
  | 'concepts' 
  | 'personalization'
  | 'blockchain-explainer'
  | 'wallet-connection'
  | 'complete';

interface OnboardingContextType {
  currentStep: OnboardingStep;
  completeCurrentStep: () => void;
  skipToEnd: () => void;
  resetOnboarding: () => void;
  progress: number;
  hasCompletedOnboarding: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

// Steps in order
const ONBOARDING_STEPS: OnboardingStep[] = [
  'welcome',
  'concepts',
  'personalization',
  'blockchain-explainer',
  'wallet-connection',
  'complete'
];

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  // Use localStorage to persist onboarding progress
  const [savedStep, setSavedStep] = useLocalStorage<OnboardingStep>('chronosVault.onboardingStep', 'welcome');
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(savedStep);
  
  // Track whether onboarding has been fully completed
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useLocalStorage('chronosVault.onboardingCompleted', false);
  
  // Update localStorage when currentStep changes
  useEffect(() => {
    setSavedStep(currentStep);
    
    // If we've reached the 'complete' step, mark onboarding as completed
    if (currentStep === 'complete') {
      setHasCompletedOnboarding(true);
    }
  }, [currentStep, setSavedStep, setHasCompletedOnboarding]);
  
  // Calculate current progress percentage
  const progress = (() => {
    const totalSteps = ONBOARDING_STEPS.length - 1; // Exclude 'complete' from progress calculation
    const currentIndex = ONBOARDING_STEPS.indexOf(currentStep);
    
    if (currentIndex === -1 || currentStep === 'complete') {
      return 100;
    }
    
    return Math.round((currentIndex / (totalSteps - 1)) * 100);
  })();
  
  // Move to the next step in the flow
  const completeCurrentStep = () => {
    const currentIndex = ONBOARDING_STEPS.indexOf(currentStep);
    
    if (currentIndex < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(ONBOARDING_STEPS[currentIndex + 1]);
    }
  };
  
  // Skip to the end of onboarding
  const skipToEnd = () => {
    setCurrentStep('complete');
    setHasCompletedOnboarding(true);
  };
  
  // Reset onboarding state (for testing)
  const resetOnboarding = () => {
    setCurrentStep('welcome');
    setHasCompletedOnboarding(false);
  };
  
  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        completeCurrentStep,
        skipToEnd,
        resetOnboarding,
        progress,
        hasCompletedOnboarding
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  
  return context;
};