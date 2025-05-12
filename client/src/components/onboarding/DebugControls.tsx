import { useState } from 'react';
import { useOnboarding } from '@/contexts/onboarding-context';
import { useLocation } from 'wouter';

/**
 * Debug controls for resetting and testing the onboarding flow
 * Only displayed in development mode
 */
export const OnboardingDebugControls = () => {
  const { resetOnboarding } = useOnboarding();
  const [_, navigate] = useLocation();
  const [debugVisible, setDebugVisible] = useState(false);
  const isDevelopmentMode = localStorage.getItem('chronosVault.devMode') === 'true';
  
  if (!isDevelopmentMode) {
    return null;
  }
  
  return (
    <div className="fixed top-20 right-4 z-50">
      <button
        className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-2 py-1 rounded shadow"
        onClick={() => setDebugVisible(!debugVisible)}
      >
        {debugVisible ? 'Hide Debug' : 'Show Debug'}
      </button>
      
      {debugVisible && (
        <div className="mt-2 bg-black/80 backdrop-blur-sm p-3 rounded shadow border border-yellow-500 w-64">
          <h3 className="text-white font-bold text-sm mb-2">Onboarding Debug</h3>
          
          <div className="space-y-2">
            <button 
              className="w-full bg-red-600 hover:bg-red-700 text-white text-xs p-1 rounded"
              onClick={() => {
                console.log('MANUAL HARD RESET');
                
                // Clear localStorage directly
                localStorage.removeItem('chronosVault.onboardingStep');
                localStorage.removeItem('chronosVault.onboardingCompleted');
                localStorage.removeItem('chronosVault.firstVisit');
                
                // Set firstVisit flag
                localStorage.setItem('chronosVault.firstVisit', 'true');
                localStorage.setItem('chronosVault.onboardingStep', JSON.stringify('welcome'));
                
                // Use context method
                resetOnboarding();
                
                // Navigate with delay
                setTimeout(() => navigate('/onboarding'), 100);
              }}
            >
              Hard Reset Onboarding
            </button>
            
            <button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs p-1 rounded"
              onClick={() => {
                navigate('/reset-onboarding');
              }}
            >
              Go to Reset Page
            </button>
            
            <div className="text-xs text-white/70 mt-2 space-y-1">
              <div>
                <span className="text-white font-bold">firstVisit:</span>{' '}
                {localStorage.getItem('chronosVault.firstVisit') || 'not set'}
              </div>
              <div>
                <span className="text-white font-bold">step:</span>{' '}
                {localStorage.getItem('chronosVault.onboardingStep') || 'not set'}
              </div>
              <div>
                <span className="text-white font-bold">completed:</span>{' '}
                {localStorage.getItem('chronosVault.onboardingCompleted') || 'not set'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingDebugControls;