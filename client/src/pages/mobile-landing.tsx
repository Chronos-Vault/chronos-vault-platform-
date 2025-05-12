import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useOnboarding } from '@/contexts/onboarding-context';

/**
 * This is a dedicated mobile landing page that completely bypasses
 * the normal onboarding flow and animation logic for maximum reliability.
 */
const MobileLanding = () => {
  const [_, navigate] = useLocation();
  const { resetOnboarding } = useOnboarding();
  
  useEffect(() => {
    // Force full reset of all state with no animations
    console.log('MOBILE LANDING: Forcing complete reset of all onboarding state');
    
    try {
      // First, ensure we're properly detected as mobile
      localStorage.setItem('chronosVault.isMobile', 'true');
      
      // Wait a bit to ensure the above setting is registered
      setTimeout(() => {
        // Direct localStorage manipulation for maximum reliability
        localStorage.removeItem('chronosVault.onboardingStep');
        localStorage.removeItem('chronosVault.onboardingCompleted');
        localStorage.removeItem('chronosVault.firstVisit');
        
        // Wait a bit more before setting the new values
        setTimeout(() => {
          // Set to proper initial state
          localStorage.setItem('chronosVault.firstVisit', 'true');
          localStorage.setItem('chronosVault.onboardingStep', JSON.stringify('welcome'));
          localStorage.setItem('chronosVault.onboardingCompleted', 'false');
          
          // Now that storage is set, update React state
          resetOnboarding();
          
          // Log the current state for debugging
          console.log('MOBILE LANDING: State reset complete, current localStorage state:', {
            step: localStorage.getItem('chronosVault.onboardingStep'),
            completed: localStorage.getItem('chronosVault.onboardingCompleted'),
            firstVisit: localStorage.getItem('chronosVault.firstVisit'),
            isMobile: localStorage.getItem('chronosVault.isMobile')
          });
          
          // Wait 500ms to ensure everything is ready, then navigate
          setTimeout(() => {
            console.log('MOBILE LANDING: Navigating to onboarding now');
            navigate('/onboarding');
          }, 500);
        }, 100);
      }, 100);
    } catch (e) {
      console.error('MOBILE LANDING: Error resetting state:', e);
      // Fallback: just navigate to mobile-direct
      setTimeout(() => {
        navigate('/mobile-direct');
      }, 500);
    }
  }, [navigate, resetOnboarding]);
  
  // Show a simple loading screen while we reset
  return (
    <div className="h-screen w-screen bg-black flex flex-col items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-3xl font-bold text-white mb-6">
          Chronos Vault
        </h1>
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full border-4 border-[#6B00D7] border-t-transparent animate-spin"></div>
        </div>
        <p className="text-white">Preparing your experience...</p>
      </div>
    </div>
  );
};

export default MobileLanding;