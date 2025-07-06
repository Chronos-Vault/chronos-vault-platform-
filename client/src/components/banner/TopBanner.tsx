import React from 'react';
import { Link } from 'wouter';

/**
 * A simple, highly visible banner that appears at the top of all pages
 * to direct users to the How It Works page
 */
const TopBanner = () => {
  return (
    <div className="sticky top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] py-2 text-white shadow-lg">
      <div className="container mx-auto flex items-center justify-center">
        <Link 
          href="/how-it-works" 
          className="flex items-center gap-2 px-4 py-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-all"
        >
          <span className="text-lg animate-pulse">🔍</span>
          <span className="font-semibold">New to Chronos Vault?</span>
          <span className="font-bold underline">Learn How It Works</span>
          <span className="bg-white text-[#6B00D7] text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wider animate-pulse ml-1">NEW</span>
          <span className="ml-1">→</span>
        </Link>
      </div>
    </div>
  );
};

export default TopBanner;