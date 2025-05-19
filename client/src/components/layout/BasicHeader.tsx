import React, { useState } from 'react';
import { Link, useLocation } from "wouter";
import logoPath from "@assets/IMG_3753.jpeg";
import { Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Sidebar from '../navigation/Sidebar';

const BasicHeader = () => {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <>
      <header className="relative z-20 border-b border-[#6B00D7]/20 backdrop-blur-sm bg-gradient-to-r from-black via-[#0a0014] to-black">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex justify-between items-center">
            {/* Logo and Brand */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-12 h-12 mr-2">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] opacity-80 blur-sm"></div>
                <div className="absolute inset-0.5 rounded-full bg-black flex items-center justify-center overflow-hidden">
                  <img src={logoPath} alt="Chronos Vault Logo" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="relative">
                <h1 className="text-xl md:text-2xl font-bold text-white">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF5AF7] to-[#6B00D7] group-hover:from-[#6B00D7] group-hover:to-[#FF5AF7] transition-all duration-500">Chronos</span> 
                  <span className="text-white">Vault</span>
                </h1>
                <div className="absolute -top-3 -right-3 bg-[#FF5AF7] text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold tracking-wider shadow-md shadow-[#FF5AF7]/30 animate-pulse">BETA</div>
              </div>
            </Link>
            
            {/* Right Side - Network Status and Create Vault Button */}
            <div className="flex items-center space-x-4">
              {/* CVT Token Balance Display (hidden on mobile) */}
              <div className="hidden md:flex items-center bg-black/40 rounded-full px-3 py-1 text-xs border border-[#6B00D7]/20">
                <div className="h-5 w-5 rounded-full bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center mr-2">
                  <span className="text-[10px] font-bold text-white">CVT</span>
                </div>
                <span className="text-[#FF5AF7]">1,000 CVT</span>
              </div>
              
              {/* Network Status (hidden on mobile) */}
              <div className="hidden md:flex items-center bg-black/40 rounded-full px-3 py-1 text-xs border border-[#6B00D7]/20">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse mr-2"></div>
                <span className="text-green-400">Network Secure</span>
              </div>
              
              {/* Create Vault Button */}
              <Link 
                href="/vault-selector" 
                className="hidden md:flex bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#FF5AF7] hover:to-[#6B00D7] text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-all duration-500 hover:shadow-[0_0_20px_rgba(107,0,215,0.5)]"
              >
                Create Vault
              </Link>
              
              {/* Menu Button */}
              <Button 
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#2D0C4B] border border-purple-500/30 p-0"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5 text-[#FF5AF7]" />
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
};

export default BasicHeader;