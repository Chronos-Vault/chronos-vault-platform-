import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Shield, Activity, Home, Layers, Book, Users, Clock, 
  Hexagon, Settings, BarChart3, Globe, KeyRound, 
  MapPin, Fingerprint, Lock, EyeOff, Brain, Landmark, Diamond,
  Search, ChevronRight, Menu, X, Database, Info, Cpu, Wallet
} from 'lucide-react';
import { useCVTToken } from '@/contexts/cvt-token-context';
import { useMultiChain } from '@/contexts/multi-chain-context';
import { useAuthContext } from '@/contexts/auth-context';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import logoPath from '@assets/IMG_3753.jpeg';

/**
 * Main navigation component for the application
 */
export const NavBar: React.FC = () => {
  const [location] = useLocation();
  const { tokenBalance } = useCVTToken();
  const { isConnected } = useMultiChain();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  // Close sidebar when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setSidebarOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarRef]);
  
  // Prevent scrolling when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);
  
  const closeSidebar = () => setSidebarOpen(false);
  
  return (
    <>
      {/* Main navigation bar */}
      <header className="bg-black sticky top-0 z-50 border-b border-purple-900/30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {/* Menu button only on mobile */}
              <button 
                className="mr-3 text-purple-400 hover:text-purple-300 transition-colors"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              {/* Logo */}
              <Link href="/" className="flex items-center">
                <div className="h-12 w-12 rounded-full flex items-center justify-center shadow-lg shadow-[#6B00D7]/20 hover:shadow-[#FF5AF7]/30 transition-all overflow-hidden border-2 border-white/20 mr-2">
                  <img src={logoPath} alt="Chronos Vault Logo" className="w-full h-full object-cover" />
                </div>
                <div className="relative">
                  <h1 className="text-xl font-bold">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">Chronos</span> 
                    <span className="text-white">Vault</span>
                  </h1>
                  <div className="absolute -top-4 -right-4 bg-[#FF5AF7] text-white text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wider shadow-md shadow-[#FF5AF7]/30 animate-pulse">BETA</div>
                </div>
              </Link>
            </div>
            
            {/* Right side items */}
            <div className="flex items-center space-x-3">
              {/* CVT Token Balance */}
              <div className="hidden md:flex items-center bg-black/60 rounded-full px-3 py-1.5 text-xs border border-purple-900/30">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center mr-2">
                  <span className="text-[10px] font-bold text-white">CVT</span>
                </div>
                <span className="text-pink-400">{tokenBalance.toLocaleString()} CVT</span>
              </div>
              
              {/* Network Status */}
              <div className="hidden md:flex items-center bg-black/60 rounded-full px-3 py-1.5 text-xs border border-purple-900/30">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse mr-2"></div>
                <span className="text-green-400">Network Secure</span>
              </div>
              
              {/* Create Vault Button */}
              <Link href="/vault-selector" className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-500 hover:to-purple-600 text-white text-sm font-medium px-4 py-2 rounded-full transition-all duration-300 hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                Create Vault
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      {/* Sidebar Navigation */}
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div 
          ref={sidebarRef}
          className={`fixed top-0 left-0 h-full w-80 bg-[#0E0318] shadow-[0_0_25px_rgba(107,0,215,0.3)] transition-transform duration-300 ease-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-5 border-b border-purple-900/30">
            <div className="flex items-center">
              <div className="h-14 w-14 rounded-full flex items-center justify-center shadow-lg shadow-[#6B00D7]/20 hover:shadow-[#FF5AF7]/30 transition-all overflow-hidden border-2 border-white/20 mr-3">
                <img src={logoPath} alt="Chronos Vault Logo" className="w-full h-full object-cover" />
              </div>
              
              <div className="relative">
                <h1 className="text-xl font-bold">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">Chronos</span> 
                  <span className="text-white">Vault</span>
                </h1>
                <div className="absolute -top-4 -right-4 bg-[#FF5AF7] text-white text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wider shadow-md shadow-[#FF5AF7]/30 animate-pulse">BETA</div>
              </div>
            </div>
            
            <button 
              onClick={closeSidebar}
              className="text-purple-400 hover:text-purple-300 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Sidebar Content */}
          <div className="px-3 py-5 overflow-y-auto h-[calc(100%-80px)]">
            {/* Main Section */}
            <SidebarSection icon={<Home className="h-5 w-5" />} title="Main">
              <SidebarItem 
                icon={<Home className="h-5 w-5" />} 
                label="Home" 
                href="/" 
                active={location === '/'}
                onClick={closeSidebar}
              />
              
              <SidebarItem 
                icon={<Layers className="h-5 w-5" />} 
                label="Vaults" 
                href="/my-vaults" 
                active={location.startsWith('/my-vaults')}
                onClick={closeSidebar}
              />
            </SidebarSection>
            
            {/* Explore Section */}
            <SidebarSection icon={<Search className="h-5 w-5" />} title="Explore">
              <SidebarItem 
                icon={<Database className="h-5 w-5" />} 
                label="Cross-Chain Monitor" 
                href="/cross-chain-monitor" 
                active={location === '/cross-chain-monitor'}
                onClick={closeSidebar}
              />
              
              <SidebarItem 
                icon={<Database className="h-5 w-5" />} 
                label="Cross-Chain Metrics" 
                href="/cross-chain-fee-monitor" 
                active={location === '/cross-chain-fee-monitor'}
                onClick={closeSidebar}
              />
              
              <SidebarItem 
                icon={<Database className="h-5 w-5" />} 
                label="Cross-Chain Operations" 
                href="/cross-chain-atomic-swap" 
                active={location === '/cross-chain-atomic-swap'}
                onClick={closeSidebar}
                isNew
              />
            </SidebarSection>
            
            {/* Security Section */}
            <SidebarSection icon={<Shield className="h-5 w-5" />} title="Security">
              <SidebarItem 
                icon={<Lock className="h-5 w-5" />} 
                label="Zero-Knowledge Verification" 
                href="/zero-knowledge-verification" 
                active={location === '/zero-knowledge-verification'}
                onClick={closeSidebar}
              />
              
              <SidebarItem 
                icon={<Shield className="h-5 w-5" />} 
                label="Triple-Chain Security" 
                href="/triple-chain-security-demo" 
                active={location === '/triple-chain-security-demo'}
                onClick={closeSidebar}
              />
            </SidebarSection>
            
            {/* Vault Types Section */}
            <SidebarSection icon={<Hexagon className="h-5 w-5" />} title="Vault Types">
              <SidebarItem 
                icon={<Clock className="h-5 w-5" />} 
                label="Time Lock Vault" 
                href="/time-lock-vault" 
                active={location === '/time-lock-vault'}
                onClick={closeSidebar}
              />
              
              <SidebarItem 
                icon={<Users className="h-5 w-5" />} 
                label="Multi-Signature Vault" 
                href="/multi-signature-vault" 
                active={location === '/multi-signature-vault'}
                onClick={closeSidebar}
              />
              
              <SidebarItem 
                icon={<MapPin className="h-5 w-5" />} 
                label="Geo-Location Vault" 
                href="/geo-location-vault" 
                active={location === '/geo-location-vault'}
                onClick={closeSidebar}
              />
              
              <SidebarItem 
                icon={<Cpu className="h-5 w-5" />} 
                label="Quantum-Resistant Vault" 
                href="/quantum-resistant-vault" 
                active={location === '/quantum-resistant-vault'}
                onClick={closeSidebar}
              />
              
              <SidebarItem 
                icon={<Hexagon className="h-5 w-5" />} 
                label="Sovereign Fortress Vault" 
                href="/sovereign-fortress-vault" 
                active={location === '/sovereign-fortress-vault'}
                onClick={closeSidebar}
                isNew
              />
            </SidebarSection>
            
            {/* Connect Wallets */}
            <div className="mt-8">
              <div className="flex items-center mb-3">
                <Settings className="h-5 w-5 text-purple-500 mr-2" />
                <span className="text-purple-400 font-medium">Connect Wallets</span>
              </div>
              
              <div className="bg-black/30 rounded-lg p-4 border border-purple-900/20">
                <p className="text-xs text-gray-400 mb-3">Connect your wallets to use all vault features</p>
                <Link 
                  href="/connect-ton" 
                  className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-500 hover:to-purple-600 text-white text-sm font-medium px-4 py-2 rounded-md flex items-center justify-center transition-all duration-300 hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] w-full"
                  onClick={closeSidebar}
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  Connect Wallets
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Sidebar section component
interface SidebarSectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ icon, title, children }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center mb-3">
        <div className="h-8 w-8 rounded-full bg-purple-900/30 flex items-center justify-center mr-2">
          <div className="text-purple-400">
            {icon}
          </div>
        </div>
        <span className="text-purple-400 font-medium">{title}</span>
      </div>
      <div className="space-y-1 pl-2">
        {children}
      </div>
    </div>
  );
};

// Sidebar item component
interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
  isNew?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon, 
  label, 
  href, 
  active = false, 
  onClick,
  isNew = false
}) => {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className={`flex items-center py-2.5 px-3 rounded-lg transition-colors ${
        active 
          ? 'bg-gradient-to-r from-purple-900/30 to-purple-900/10 text-white' 
          : 'text-gray-400 hover:text-white hover:bg-purple-900/20'
      }`}
    >
      <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${
        active ? 'bg-purple-900/50' : 'bg-black/40'
      }`}>
        {icon}
      </div>
      <span>{label}</span>
      {isNew && (
        <div className="ml-2 bg-pink-500 text-[10px] text-white font-bold px-1.5 py-0.5 rounded-sm">
          NEW
        </div>
      )}
    </Link>
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