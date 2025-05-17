import React from 'react';
import { useLocation } from 'wouter';
import VaultTypesSelectorNew from './vault-types-selector-new';

const VaultSelectionShowcase = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#1C0533] to-black">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Animated grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#6B00D7]/10 blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#FF5AF7]/10 blur-3xl animate-float animation-delay-2000"></div>
        <div className="absolute top-3/4 right-1/3 w-40 h-40 rounded-full bg-[#00E676]/10 blur-3xl animate-float animation-delay-1000"></div>
        
        {/* Animated scan line */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 animate-scan-vertical">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#6B00D7]/40 to-transparent"></div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <VaultTypesSelectorNew />
    </div>
  );
};

export default VaultSelectionShowcase;