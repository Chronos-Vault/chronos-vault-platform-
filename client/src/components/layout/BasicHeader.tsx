import React from 'react';
import { Link, useLocation } from "wouter";
import logoPath from "@assets/IMG_3753.jpeg";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Home, Layers, Shield, Book, Activity, Globe, BarChart3 } from 'lucide-react';

const BasicHeader = () => {
  const [location] = useLocation();
  
  return (
    <header className="relative z-20 border-b border-[#6B00D7]/20 backdrop-blur-sm bg-gradient-to-r from-[#121212]/90 to-[#1A1A1A]/90">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex justify-between items-center">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-12 w-12 rounded-full flex items-center justify-center shadow-xl shadow-[#FF5AF7]/40 group-hover:shadow-[#FF5AF7]/50 transition-all overflow-hidden border-2 border-white/40 animate-logo-glow">
              <img src={logoPath} alt="Chronos Vault Logo" className="w-full h-full object-cover" />
            </div>
            <div className="relative">
              <h1 className="text-xl md:text-2xl font-bold text-white">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] group-hover:from-[#FF5AF7] group-hover:to-[#6B00D7] transition-all">Chronos</span> 
                <span className="text-white">Vault</span>
              </h1>
              <div className="absolute -top-3 -right-3 bg-[#FF5AF7] text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold tracking-wider shadow-md shadow-[#FF5AF7]/30 animate-pulse">BETA</div>
            </div>
          </Link>
          
          {/* Navigation Menu - Desktop */}
          <div className="hidden md:flex items-center gap-1 lg:gap-4">
            {/* Home */}
            <Link 
              href="/" 
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-300 hover:text-white font-medium text-sm lg:text-base transition-all hover:bg-[#6B00D7]/10 ${
                location === '/' 
                ? 'text-white bg-[#6B00D7]/20 relative after:absolute after:bottom-[6px] after:left-[10px] after:right-[10px] after:h-[2px] after:bg-gradient-to-r after:from-[#6B00D7] after:to-[#FF5AF7] after:rounded-full' 
                : ''
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            
            {/* My Vaults */}
            <Link 
              href="/my-vaults" 
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-300 hover:text-white font-medium text-sm lg:text-base transition-all hover:bg-[#6B00D7]/10 ${
                location === '/my-vaults' 
                ? 'text-white bg-[#6B00D7]/20 relative after:absolute after:bottom-[6px] after:left-[10px] after:right-[10px] after:h-[2px] after:bg-gradient-to-r after:from-[#6B00D7] after:to-[#FF5AF7] after:rounded-full' 
                : ''
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>My Vaults</span>
            </Link>
            
            {/* Vault Types */}
            <Link 
              href="/vault-types" 
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-300 hover:text-white font-medium text-sm lg:text-base transition-all hover:bg-[#6B00D7]/10 ${
                location === '/vault-types' 
                ? 'text-white bg-[#6B00D7]/20 relative after:absolute after:bottom-[6px] after:left-[10px] after:right-[10px] after:h-[2px] after:bg-gradient-to-r after:from-[#6B00D7] after:to-[#FF5AF7] after:rounded-full' 
                : ''
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Vault Types</span>
            </Link>
            
            {/* Vault School */}
            <Link 
              href="/vault-school" 
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-300 hover:text-white font-medium text-sm lg:text-base transition-all hover:bg-[#6B00D7]/10 ${
                location === '/vault-school' 
                ? 'text-white bg-[#6B00D7]/20 relative after:absolute after:bottom-[6px] after:left-[10px] after:right-[10px] after:h-[2px] after:bg-gradient-to-r after:from-[#6B00D7] after:to-[#FF5AF7] after:rounded-full' 
                : ''
              }`}
            >
              <Book className="w-4 h-4" />
              <span>Vault School</span>
            </Link>
            
            {/* Monitoring Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-300 hover:text-white font-medium text-sm lg:text-base transition-all hover:bg-[#6B00D7]/10 ${
                    location.includes('/monitor') || location.includes('/transaction') 
                    ? 'text-white bg-[#6B00D7]/20 relative after:absolute after:bottom-[6px] after:left-[10px] after:right-[10px] after:h-[2px] after:bg-gradient-to-r after:from-[#6B00D7] after:to-[#FF5AF7] after:rounded-full' 
                    : ''
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  <span>Monitoring</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56 bg-[#1A1A1A] border border-[#333] shadow-xl">
                <Link href="/transaction-monitor">
                  <DropdownMenuItem className="flex items-center py-2 gap-2 cursor-pointer hover:bg-[#333]">
                    <BarChart3 className="w-4 h-4 text-[#FF5AF7]" />
                    <span>Transaction Monitor</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/cross-chain-monitor">
                  <DropdownMenuItem className="flex items-center py-2 gap-2 cursor-pointer hover:bg-[#333]">
                    <Globe className="w-4 h-4 text-[#FF5AF7]" />
                    <span>Cross-Chain Monitor</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Right Side - Create Vault Button */}
          <div className="flex items-center gap-4">
            <Link 
              href="/vault-selector" 
              className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#FF5AF7] hover:to-[#6B00D7] text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-all duration-500 hover:shadow-[0_0_20px_rgba(107,0,215,0.5)]"
            >
              Create Vault
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default BasicHeader;