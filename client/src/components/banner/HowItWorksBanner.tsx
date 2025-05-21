import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { X } from 'lucide-react';

/**
 * A prominent banner that promotes the How It Works page
 * Displays at the top of all pages with an option to dismiss
 */
const HowItWorksBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  
  // Check local storage on mount to see if user has dismissed the banner before
  useEffect(() => {
    const dismissed = localStorage.getItem('howItWorksBannerDismissed');
    if (dismissed) {
      setIsVisible(false);
    }
  }, []);
  
  const dismissBanner = () => {
    setIsVisible(false);
    // Store dismissal preference in local storage
    localStorage.setItem('howItWorksBannerDismissed', 'true');
  };
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] py-2 text-white shadow-lg">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="hidden sm:block w-8"></div> {/* Spacer for alignment */}
        
        <Link 
          href="/how-it-works" 
          className="flex-1 flex items-center justify-center gap-2 hover:underline"
        >
          <span className="text-lg animate-pulse">🔍</span>
          <span className="font-semibold text-sm sm:text-base">New to Chronos Vault?</span>
          <span className="font-bold text-sm sm:text-base underline">Learn How It Works</span>
          <span className="bg-white text-[#6B00D7] text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wider animate-pulse ml-1">NEW</span>
        </Link>
        
        <button 
          onClick={dismissBanner}
          className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default HowItWorksBanner;