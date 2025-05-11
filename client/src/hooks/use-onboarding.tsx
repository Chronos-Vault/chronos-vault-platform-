import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';

export type OnboardingStep = 
  | 'welcome'
  | 'concepts'
  | 'personalization' 
  | 'blockchain-explainer'
  | 'wallet-connection'
  | 'complete';

type OnboardingContextType = {
  currentStep: OnboardingStep;
  setCurrentStep: (step: OnboardingStep) => void;
  progress: number;
  completeCurrentStep: () => void;
  skipToEnd: () => void;
  hasCompletedOnboarding: boolean;
};

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useLocalStorage<OnboardingStep>('onboarding-step', 'welcome');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useLocalStorage('onboarding-completed', false);
  
  const steps: OnboardingStep[] = [
    'welcome',
    'concepts',
    'personalization',
    'blockchain-explainer',
    'wallet-connection',
    'complete'
  ];
  
  const progress = Math.round(
    ((steps.indexOf(currentStep) + 1) / (steps.length - 1)) * 100
  );
  
  const completeCurrentStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    } else {
      setCurrentStep('complete');
      setHasCompletedOnboarding(true);
    }
  };
  
  const skipToEnd = () => {
    setCurrentStep('complete');
    setHasCompletedOnboarding(true);
  };
  
  return (
    <OnboardingContext.Provider value={{
      currentStep,
      setCurrentStep,
      progress,
      completeCurrentStep,
      skipToEnd,
      hasCompletedOnboarding
    }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};