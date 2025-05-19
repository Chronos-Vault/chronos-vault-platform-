import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Shield, Activity, Home, Layers, Book, Users, Clock, 
  Hexagon, Settings, BarChart3, Globe, KeyRound, 
  MapPin, Fingerprint, Lock, EyeOff, Brain, Landmark, Diamond 
} from 'lucide-react';
import { useCVTToken } from '@/contexts/cvt-token-context';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Main navigation component for the application
 */
export const NavBar: React.FC = () => {
  const [location] = useLocation();
  const { tokenBalance } = useCVTToken();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <div className="bg-gradient-to-r from-black via-[#0a0014] to-black border-b border-purple-900/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <div className="flex items-center">
              <div className="relative w-8 h-8 mr-2">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] opacity-80 blur-sm"></div>
                <div className="absolute inset-0.5 rounded-full bg-black flex items-center justify-center">
                  <Lock className="h-4 w-4 text-[#FF5AF7]" />
                </div>
              </div>
              <div className="text-xl font-bold bg-gradient-to-r from-[#FF5AF7] to-[#6B00D7] text-transparent bg-clip-text">
                ChronosVault
              </div>
            </div>
          </Link>
          
          <nav className="hidden lg:flex ml-8 space-x-1">
            {/* Main Navigation Links */}
            <NavLink to="/" isActive={location === '/'}>
              <Home className="h-4 w-4 mr-1.5" />
              Home
            </NavLink>
            
            <NavLink to="/my-vaults" isActive={location.startsWith('/my-vaults')}>
              <Layers className="h-4 w-4 mr-1.5" />
              My Vaults
            </NavLink>
            
            <NavLink to="/vault-types" isActive={location.startsWith('/vault-types')}>
              <Shield className="h-4 w-4 mr-1.5" />
              Vault Types
            </NavLink>
            
            <NavLink to="/vault-school" isActive={location.startsWith('/vault-school')}>
              <Book className="h-4 w-4 mr-1.5" />
              Vault School
            </NavLink>
            
            {/* Monitoring Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={cn(
                  "flex items-center text-sm px-3 py-1.5 rounded-lg border-b-2 transition-colors duration-200",
                  location.includes('/monitor') || location.includes('/transaction') 
                    ? "bg-[#6B00D7]/10 text-purple-400 border-purple-500" 
                    : "text-gray-400 hover:text-purple-400 border-transparent hover:bg-[#6B00D7]/5"
                )}>
                  <Activity className="h-4 w-4 mr-1.5" />
                  Monitoring
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black/90 backdrop-blur-lg border border-purple-900/40 text-white">
                <DropdownMenuItem asChild>
                  <Link href="/transaction-monitor" className="flex items-center text-sm cursor-pointer hover:bg-[#6B00D7]/20">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Transaction Monitor
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/cross-chain-monitor" className="flex items-center text-sm cursor-pointer hover:bg-[#6B00D7]/20">
                    <Globe className="h-4 w-4 mr-2" />
                    Cross-Chain Monitor
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          {/* CVT Token Balance Display */}
          <div className="flex items-center bg-black/40 rounded-full px-3 py-1 text-xs border border-[#6B00D7]/20">
            <div className="h-5 w-5 rounded-full bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center mr-2">
              <span className="text-[10px] font-bold text-white">CVT</span>
            </div>
            <span className="text-[#FF5AF7]">{tokenBalance.toLocaleString()} CVT</span>
          </div>
          
          {/* Network Status */}
          <div className="flex items-center bg-black/40 rounded-full px-3 py-1 text-xs border border-[#6B00D7]/20">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse mr-2"></div>
            <span className="text-green-400">Network Secure</span>
          </div>
          
          {/* Create Vault Button */}
          <Link href="/vault-selector" className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#FF5AF7] hover:to-[#6B00D7] text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-all duration-500 hover:shadow-[0_0_20px_rgba(107,0,215,0.5)]">
            Create Vault
          </Link>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-md bg-black/50 border border-purple-900/30"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <div className="space-y-1.5">
            <div className={`w-5 h-0.5 bg-purple-400 transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
            <div className={`w-5 h-0.5 bg-purple-400 transition-all ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></div>
            <div className={`w-5 h-0.5 bg-purple-400 transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
          </div>
        </button>
      </div>
      
      {/* Mobile navigation - Full featured */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-purple-900/20 py-3 px-4 bg-gradient-to-b from-[#0a0014] to-black">
          <div className="grid grid-cols-2 gap-2">
            <MobileNavLink to="/" icon={<Home className="h-4 w-4" />}>
              Home
            </MobileNavLink>
            
            <MobileNavLink to="/my-vaults" icon={<Layers className="h-4 w-4" />}>
              My Vaults
            </MobileNavLink>
            
            <MobileNavLink to="/vault-types" icon={<Shield className="h-4 w-4" />}>
              Vault Types
            </MobileNavLink>
            
            <MobileNavLink to="/vault-school" icon={<Book className="h-4 w-4" />}>
              Vault School
            </MobileNavLink>
            
            <MobileNavLink to="/transaction-monitor" icon={<Activity className="h-4 w-4" />}>
              Transaction Monitor
            </MobileNavLink>
            
            <MobileNavLink to="/cross-chain-monitor" icon={<Globe className="h-4 w-4" />}>
              Cross-Chain Monitor
            </MobileNavLink>
          </div>
          
          <div className="mt-4 border-t border-purple-900/10 pt-4">
            <div className="text-xs text-purple-400 mb-2">Vault Types</div>
            <div className="grid grid-cols-2 gap-2">
              <MobileNavLink to="/time-lock-vault" icon={<Clock className="h-4 w-4" />}>
                Time Lock Vault
              </MobileNavLink>
              
              <MobileNavLink to="/multi-signature-vault" icon={<Users className="h-4 w-4" />}>
                Multi-Signature
              </MobileNavLink>
              
              <MobileNavLink to="/geo-location-vault" icon={<MapPin className="h-4 w-4" />}>
                Geo-Location Vault
              </MobileNavLink>
              
              <MobileNavLink to="/biometric-vault" icon={<Fingerprint className="h-4 w-4" />}>
                Biometric Vault
              </MobileNavLink>
              
              <MobileNavLink to="/quantum-resistant-vault" icon={<Lock className="h-4 w-4" />}>
                Quantum-Resistant
              </MobileNavLink>
              
              <MobileNavLink to="/sovereign-fortress-vault" icon={<Hexagon className="h-4 w-4" />}>
                Sovereign Fortress
              </MobileNavLink>
              
              <MobileNavLink to="/ai-assisted-investment-vault" icon={<Brain className="h-4 w-4" />}>
                AI-Assisted Investment
              </MobileNavLink>
              
              <MobileNavLink to="/nft-powered-vault" icon={<Diamond className="h-4 w-4" />}>
                NFT-Powered Vault
              </MobileNavLink>
            </div>
          </div>
          
          <div className="mt-4 flex justify-center">
            <Link href="/vault-selector" className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#FF5AF7] hover:to-[#6B00D7] text-white text-sm font-medium px-6 py-2 rounded-lg transition-all duration-500 hover:shadow-[0_0_20px_rgba(107,0,215,0.5)] w-full text-center">
              Create New Vault
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

// Navigation link component for desktop menu
function NavLink({ 
  to, 
  isActive, 
  children 
}: { 
  to: string; 
  isActive: boolean; 
  children: React.ReactNode;
}) {
  return (
    <Link 
      href={to} 
      className={`
        flex items-center transition-colors duration-200
        ${isActive ? "bg-[#6B00D7]/10 text-purple-400 border-purple-500" : "text-gray-400 hover:text-purple-400 border-transparent hover:bg-[#6B00D7]/5"}
        px-3 py-1.5 rounded-lg text-sm border-b-2
      `}
    >
      {children}
    </Link>
  );
}

// Mobile navigation link component
function MobileNavLink({ 
  to, 
  icon, 
  children 
}: { 
  to: string; 
  icon: React.ReactNode; 
  children: React.ReactNode;
}) {
  const [location] = useLocation();
  const isActive = location === to || location.startsWith(`${to}/`);
  
  return (
    <Link 
      href={to} 
      className={`
        flex flex-col items-center justify-center text-center p-2 rounded-lg text-xs
        ${isActive ? 'bg-[#6B00D7]/20 text-[#FF5AF7]' : 'text-gray-400 hover:bg-[#6B00D7]/10 hover:text-[#FF5AF7]'}
      `}
    >
      <div className={`
        w-8 h-8 mb-1 rounded-full flex items-center justify-center
        ${isActive ? 'bg-[#6B00D7]/30' : 'bg-black/50'}
      `}>
        {icon}
      </div>
      {children}
    </Link>
  );
}