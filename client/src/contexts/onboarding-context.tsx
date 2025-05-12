import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';

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
  setCurrentStep: (step: OnboardingStep) => void;  // Added for debug controls
  completeCurrentStep: () => void;
  completeOnboarding: () => void;  // Added for debug controls
  skipToEnd: () => void;
  resetOnboarding: () => void;
  progress: number;
  hasCompletedOnboarding: boolean;
  isFirstVisit: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

// Constants for localStorage keys
const STEP_KEY = 'chronosVault.onboardingStep';
const COMPLETED_KEY = 'chronosVault.onboardingCompleted';
const FIRST_VISIT_KEY = 'chronosVault.firstVisit';

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
  // Detect if we're on a mobile device for optimizations
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  
  // Handle potential localStorage corruptions through safe initialization
  useEffect(() => {
    // Set mobile flag for optimizations
    if (isMobile) {
      localStorage.setItem('chronosVault.isMobile', 'true');
      console.log('Mobile device detected, optimizing onboarding experience');
    } else {
      localStorage.removeItem('chronosVault.isMobile');
    }
    
    // Check for corrupted localStorage values and fix them
    try {
      // Validate firstVisit flag
      const firstVisit = localStorage.getItem(FIRST_VISIT_KEY);
      if (firstVisit !== 'true' && firstVisit !== 'false' && firstVisit !== null) {
        console.warn('Corrupted firstVisit flag detected, resetting:', firstVisit);
        localStorage.setItem(FIRST_VISIT_KEY, 'true');
      }
      
      // Validate onboardingCompleted flag
      const completed = localStorage.getItem(COMPLETED_KEY);
      if (completed !== 'true' && completed !== 'false' && completed !== null) {
        console.warn('Corrupted completed flag detected, resetting:', completed);
        localStorage.setItem(COMPLETED_KEY, 'false');
      }
      
      // Validate onboardingStep
      try {
        const step = localStorage.getItem(STEP_KEY);
        if (step) JSON.parse(step);
      } catch (e) {
        console.warn('Corrupted step detected, resetting');
        localStorage.setItem(STEP_KEY, JSON.stringify('welcome'));
      }
    } catch (e) {
      console.error('Error validating localStorage:', e);
    }
  }, [isMobile]);
  
  // Track whether this is the user's first visit
  const [isFirstVisit, setIsFirstVisit] = useLocalStorage(FIRST_VISIT_KEY, true);
  
  // Use localStorage to persist onboarding progress
  const [savedStep, setSavedStep] = useLocalStorage<OnboardingStep>(STEP_KEY, 'welcome');
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(savedStep);
  
  // Track whether onboarding has been fully completed
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useLocalStorage(COMPLETED_KEY, false);
  
  // Log initial state for debugging
  useEffect(() => {
    console.log('Onboarding context initialized:', {
      savedStep,
      currentStep,
      hasCompletedOnboarding,
      isFirstVisit,
      isMobile,
      localStorage: {
        step: localStorage.getItem(STEP_KEY),
        completed: localStorage.getItem(COMPLETED_KEY),
        firstVisit: localStorage.getItem(FIRST_VISIT_KEY)
      }
    });
    
    // CRITICAL FIX: Only set firstVisit to false after onboarding is completed
    // This ensures that the welcome animation is shown properly
    if (isFirstVisit && currentStep === 'complete' && hasCompletedOnboarding) {
      console.log('Onboarding completed, setting firstVisit to false');
      setIsFirstVisit(false);
    }
  }, [isFirstVisit, currentStep, hasCompletedOnboarding]);
  
  // Update localStorage when currentStep changes
  useEffect(() => {
    console.log('Step changed to:', currentStep);
    setSavedStep(currentStep);
    
    // If we've reached the 'complete' step, mark onboarding as completed
    if (currentStep === 'complete') {
      setHasCompletedOnboarding(true);
      console.log('Onboarding marked as completed');
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
      console.log(`Moving from step ${currentStep} to ${ONBOARDING_STEPS[currentIndex + 1]}`);
      setCurrentStep(ONBOARDING_STEPS[currentIndex + 1]);
    }
  };
  
  // Skip to the end of onboarding
  // Method for completing onboarding 
  const completeOnboarding = () => {
    console.log('Directly completing onboarding (debug)');
    setCurrentStep('complete');
    setHasCompletedOnboarding(true);
    setIsFirstVisit(false);
  };
  
  // Skip to the end of onboarding
  const skipToEnd = () => {
    console.log('Skipping to end of onboarding');
    setCurrentStep('complete');
    setHasCompletedOnboarding(true);
  };
  
  // Reset onboarding state - CRITICAL FIX
  const resetOnboarding = () => {
    console.log('CRITICAL FIX: Resetting onboarding state properly');
    
    // First, update React state to avoid race conditions
    setCurrentStep('welcome');
    setHasCompletedOnboarding(false);
    setIsFirstVisit(true);
    
    // Then clear and reset localStorage values
    try {
      // Clear existing values
      localStorage.removeItem(STEP_KEY);
      localStorage.removeItem(COMPLETED_KEY);
      localStorage.removeItem(FIRST_VISIT_KEY);
      
      // Explicitly set values to ensure consistency
      localStorage.setItem(STEP_KEY, JSON.stringify('welcome'));
      localStorage.setItem(COMPLETED_KEY, 'false');
      localStorage.setItem(FIRST_VISIT_KEY, 'true');
      
      console.log('Reset successful, localStorage values:', {
        step: localStorage.getItem(STEP_KEY),
        completed: localStorage.getItem(COMPLETED_KEY),
        firstVisit: localStorage.getItem(FIRST_VISIT_KEY)
      });
    } catch (error) {
      console.error('Error during localStorage reset:', error);
    }
    
    // We don't force reload anymore - let React handle the navigation
    // This prevents the "flash of unstyled content" and provides a smoother UX
  };
  
  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        setCurrentStep,  // Added for debug controls
        completeCurrentStep,
        completeOnboarding,  // Added for debug controls
        skipToEnd,
        resetOnboarding,
        progress,
        hasCompletedOnboarding,
        isFirstVisit
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