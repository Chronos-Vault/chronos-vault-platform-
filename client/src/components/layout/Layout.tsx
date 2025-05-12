import React, { useEffect, useState } from 'react';
import MainHeader from './MainHeader';
import Footer from './footer';
import { useLocation } from 'wouter';
import { useOnboarding } from '@/contexts/onboarding-context';
import { OnboardingDebugControls } from '@/components/onboarding/DebugControls';

interface LayoutProps {
  children: React.ReactNode;
}

// Add a direct reset function to window for emergencies
declare global {
  interface Window {
    resetOnboarding?: () => void;
    forceFirstVisit?: () => void;
  }
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [location] = useLocation();
  const { resetOnboarding } = useOnboarding();
  const [isDevelopmentMode, setIsDevelopmentMode] = useState(false);
  
  // Initialize development mode state from localStorage
  useEffect(() => {
    const devMode = localStorage.getItem('chronosVault.devMode') === 'true';
    setIsDevelopmentMode(devMode);
    
    if (devMode) {
      console.log('Development mode active');
    }
  }, []);
  
  // Check URL for force reset parameter - run only once
  useEffect(() => {
    if (window.location.search.includes('resetOnboarding=true')) {
      console.log('Forcing onboarding reset due to URL parameter');
      
      // Clear localStorage values
      localStorage.removeItem('chronosVault.onboardingStep');
      localStorage.removeItem('chronosVault.onboardingCompleted'); 
      localStorage.removeItem('chronosVault.firstVisit');
      
      // Set fresh values to ensure React state updates properly
      localStorage.setItem('chronosVault.onboardingStep', JSON.stringify('welcome'));
      localStorage.setItem('chronosVault.onboardingCompleted', 'false');
      localStorage.setItem('chronosVault.firstVisit', 'true');
      
      // IMPORTANT FIX: Only redirect if not already on onboarding page
      const currentPath = window.location.pathname;
      if (currentPath !== '/onboarding' && !currentPath.includes('mobile-direct')) {
        console.log('Redirecting to onboarding page');
        window.location.href = '/onboarding';
      } else {
        console.log('Already on onboarding page, reloading instead of redirecting');
        // Force a reload to pick up the new localStorage values
        setTimeout(() => window.location.reload(), 100);
      }
    }
  }, []); // Empty dependency array means this runs once on mount
  
  // Add emergency reset functions to window object in development mode - run only when isDevelopmentMode changes
  useEffect(() => {
    if (isDevelopmentMode) {
      window.resetOnboarding = () => {
        console.log('Emergency onboarding reset triggered');
        localStorage.removeItem('chronosVault.onboardingStep');
        localStorage.removeItem('chronosVault.onboardingCompleted');
        localStorage.removeItem('chronosVault.firstVisit');
        window.location.href = '/onboarding';
      };
      
      window.forceFirstVisit = () => {
        console.log('Forcing first visit flag');
        localStorage.setItem('chronosVault.firstVisit', 'true');
        localStorage.setItem('chronosVault.onboardingStep', 'welcome');
        localStorage.removeItem('chronosVault.onboardingCompleted');
        window.location.href = '/onboarding';
      };
      
      console.log('Added emergency reset functions:');
      console.log('window.resetOnboarding() - Completely reset onboarding state');
      console.log('window.forceFirstVisit() - Force first visit flag');
    }
  }, [isDevelopmentMode]); // Only depend on isDevelopmentMode

  const handleResetClick = () => {
    console.log('Reset button clicked');
    
    // First try to use the window method if available
    if (window.resetOnboarding) {
      window.resetOnboarding();
    } else {
      // Fallback to the hook method
      resetOnboarding();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <MainHeader />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      
      {/* Debug controls for onboarding */}
      <OnboardingDebugControls />
      
      {/* Emergency reset button in development mode */}
      {isDevelopmentMode && (
        <div 
          className="fixed bottom-4 right-4 z-50 bg-red-500 text-white p-2 rounded-md text-xs cursor-pointer opacity-70 hover:opacity-100"
          onClick={handleResetClick}
        >
          Reset Onboarding
        </div>
      )}
    </div>
  );
};

export default Layout;
