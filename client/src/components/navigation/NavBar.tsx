import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Shield, Activity, Home, Layers, Book, Users, Clock, 
  Hexagon, Settings, BarChart3, Globe, KeyRound, 
  MapPin, Fingerprint, Lock, EyeOff, Brain, Landmark, Diamond,
  Search, ChevronRight, Menu, X, Database, Info, Cpu, Wallet,
  Gift, Coins, Bitcoin, ListChecks, ShieldCheck, ShieldAlert,
  ArrowDownUp, ArrowRightLeft, Atom, Combine, BoxSelect,
  GraduationCap, Video, BookOpen, FileText, Library,
  Lightbulb, BarChart2, Code, FileCode, GitPullRequest,
  HelpCircle, LockKeyhole, Files
} from 'lucide-react';
import { useCVTToken } from '@/contexts/cvt-token-context';
import { useMultiChain } from '@/contexts/multi-chain-context';
import { useAuthContext } from '@/contexts/auth-context';
import logoPath from '@assets/IMG_3753.jpeg';
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
          <div className="grid grid-cols-12 items-center">
            {/* Logo Section - Left Side */}
            <div className="col-span-6 md:col-span-3 flex-shrink-0">
              {/* Logo - Matching Footer Style */}
              <Link href="/" className="flex items-center gap-3 group">
                <div className="h-12 w-12 rounded-full flex items-center justify-center shadow-lg shadow-[#6B00D7]/20 group-hover:shadow-[#FF5AF7] group-hover:shadow-xl transition-all duration-500 overflow-hidden border-2 border-white/20 group-hover:border-[#FF5AF7] transform group-hover:scale-125 relative animate-pulse group-hover:animate-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#6B00D7]/30 to-[#FF5AF7]/50 opacity-0 group-hover:opacity-100 transition-all duration-500 animate-ping"></div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#FF5AF7]/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse"></div>
                  <img 
                    src={logoPath} 
                    alt="Chronos Vault Logo" 
                    className="w-full h-full object-cover transition-all duration-500 group-hover:brightness-150 group-hover:saturate-200 group-hover:rotate-6" 
                  />
                </div>
                <div className="relative">
                  <h1 className="text-xl font-bold group-hover:scale-105 transition-transform duration-700">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] group-hover:from-[#FF5AF7] group-hover:to-[#6B00D7] transition-all duration-1000">Chronos</span> 
                    <span className="text-white group-hover:text-[#FF5AF7]/90 transition-colors duration-1000">Vault</span>
                  </h1>
                  <div className="absolute -top-4 -right-4 bg-gradient-to-r from-[#FF5AF7] to-[#FF5AF7] text-white text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wider shadow-md shadow-[#FF5AF7]/30 animate-pulse group-hover:shadow-[#FF5AF7]/50 group-hover:shadow-lg transition-all duration-700">BETA</div>
                </div>
              </Link>
            </div>
            
            {/* Mobile Menu Button - Right aligned on mobile */}
            <div className="col-span-6 md:hidden flex justify-end">
              <button 
                className="relative text-[#FF5AF7] hover:text-[#6B00D7] transition-colors duration-300 p-2 rounded-full overflow-hidden group"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open menu"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#6B00D7]/10 to-[#FF5AF7]/10 opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-500"></span>
                <span className="absolute inset-0 border border-[#FF5AF7]/20 rounded-full group-hover:border-[#FF5AF7]/40 transition-colors duration-500"></span>
                <Menu className="w-6 h-6 relative z-10" />
              </button>
            </div>
            
            {/* Right side: Navigation + Status - Centered in middle columns */}
            <div className="hidden md:col-span-9 md:flex items-center justify-end space-x-2">
              {/* How It Works - Prominent Navigation Item */}
              <Link href="/how-it-works" className="flex items-center px-3 py-2 mr-2 rounded-md bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white hover:opacity-90 transition-all shadow-md group">
                <div className="flex items-center relative">
                  <Search className="w-4 h-4 mr-1.5 group-hover:animate-pulse" /> 
                  <span>How It Works</span>
                  <span className="ml-1.5 flex items-center opacity-80">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:translate-x-0.5 transition-transform">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
              </Link>

              {/* Wallet - Prominent Navigation Item */}
              <Link href="/wallet" className="flex items-center px-3 py-2 mr-2 rounded-md bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:opacity-90 transition-all shadow-md group">
                <div className="flex items-center relative">
                  <Wallet className="w-4 h-4 mr-1.5 group-hover:animate-pulse" /> 
                  <span>Wallet</span>
                  <span className="ml-1.5 flex items-center opacity-80">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:translate-x-0.5 transition-transform">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
              </Link>
              
              {/* Vaults Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="text-gray-200 hover:text-[#FF5AF7] transition-colors px-3 py-2 rounded-md hover:bg-black/30 outline-none">
                  <div className="flex items-center">
                    Vaults <ChevronRight className="w-4 h-4 ml-1 rotate-90" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#0E0318] border border-purple-900/30 text-gray-200 p-2 rounded-lg shadow-lg shadow-[#6B00D7]/20 min-w-[200px] z-50">
                  <DropdownMenuItem asChild>
                    <Link href="/my-vaults" className="px-4 py-2 rounded-md hover:bg-[#6B00D7]/20 flex items-center">
                      <Layers className="w-4 h-4 mr-2" /> My Vaults
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/time-lock-vault" className="px-4 py-2 rounded-md hover:bg-[#6B00D7]/20 flex items-center">
                      <Clock className="w-4 h-4 mr-2" /> Time Lock Vault™
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/documentation/multi-signature-vault" className="px-4 py-2 rounded-md hover:bg-[#6B00D7]/20 flex items-center">
                      <Users className="w-4 h-4 mr-2" /> Multi-Signature Vault™
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/geo-location-vault" className="px-4 py-2 rounded-md hover:bg-[#6B00D7]/20 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" /> Geo-Location Vault™
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/quantum-resistant-vault" className="px-4 py-2 rounded-md hover:bg-[#6B00D7]/20 flex items-center">
                      <Cpu className="w-4 h-4 mr-2" /> Quantum-Resistant Vault™
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/sovereign-fortress-vault" className="px-4 py-2 rounded-md hover:bg-[#6B00D7]/20 flex items-center">
                      <Hexagon className="w-4 h-4 mr-2" /> Sovereign Fortress Vault™ 
                      <span className="ml-2 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white text-[10px] px-1.5 rounded-full">NEW</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Explore Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="text-gray-200 hover:text-[#FF5AF7] transition-colors px-3 py-2 rounded-md hover:bg-black/30 outline-none">
                  <div className="flex items-center">
                    Explore <ChevronRight className="w-4 h-4 ml-1 rotate-90" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#0E0318] border border-purple-900/30 text-gray-200 p-2 rounded-lg shadow-lg shadow-[#6B00D7]/20 min-w-[220px] z-50">
                  <DropdownMenuItem asChild>
                    <Link href="/cross-chain-monitor" className="px-4 py-2 rounded-md hover:bg-[#6B00D7]/20 flex items-center">
                      <Database className="w-4 h-4 mr-2" /> Cross-Chain Monitor
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/cross-chain-fee-monitor" className="px-4 py-2 rounded-md hover:bg-[#6B00D7]/20 flex items-center">
                      <Database className="w-4 h-4 mr-2" /> Cross-Chain Metrics
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/transaction-monitor" className="px-4 py-2 rounded-md hover:bg-[#6B00D7]/20 flex items-center">
                      <ListChecks className="w-4 h-4 mr-2" /> Transaction Monitor
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/transaction-verification" className="px-4 py-2 rounded-md hover:bg-[#6B00D7]/20 flex items-center">
                      <ShieldCheck className="w-4 h-4 mr-2" /> Transaction Verification
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/cross-chain-bridge" className="px-4 py-2 rounded-md hover:bg-[#6B00D7]/20 flex items-center">
                      <Combine className="w-4 h-4 mr-2" /> Cross-Chain Bridge
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/atomic-swaps" className="px-4 py-2 rounded-md hover:bg-[#6B00D7]/20 flex items-center">
                      <Atom className="w-4 h-4 mr-2" /> Atomic Swaps
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Security Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="text-gray-200 hover:text-[#FF5AF7] transition-colors px-3 py-2 rounded-md hover:bg-black/30 outline-none">
                  <div className="flex items-center">
                    Security <ChevronRight className="w-4 h-4 ml-1 rotate-90" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#0E0318] border border-purple-900/30 text-gray-200 p-2 rounded-lg shadow-lg shadow-[#6B00D7]/20 min-w-[240px] z-50">
                  <DropdownMenuItem asChild>
                    <Link href="/security-dashboard" className="px-4 py-2 rounded-md hover:bg-[#6B00D7]/20 flex items-center">
                      <ShieldAlert className="w-4 h-4 mr-2" /> Security Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/cross-chain-security" className="px-4 py-2 rounded-md hover:bg-[#6B00D7]/20 flex items-center">
                      <LockKeyhole className="w-4 h-4 mr-2" /> Cross-Chain Security Vault™
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/behavioral-auth" className="px-4 py-2 rounded-md hover:bg-[#6B00D7]/20 flex items-center">
                      <Fingerprint className="w-4 h-4 mr-2" /> Behavioral Authentication Vault™
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/quantum-resistant" className="px-4 py-2 rounded-md hover:bg-[#6B00D7]/20 flex items-center">
                      <KeyRound className="w-4 h-4 mr-2" /> Quantum Resistant Vault™
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/social-recovery" className="px-4 py-2 rounded-md hover:bg-[#6B00D7]/20 flex items-center">
                      <Users className="w-4 h-4 mr-2" /> Social Recovery Vault™
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Features Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="text-gray-200 hover:text-[#FF5AF7] transition-colors px-3 py-2 rounded-md hover:bg-black/30 outline-none">
                  <div className="flex items-center">
                    Features <ChevronRight className="w-4 h-4 ml-1 rotate-90" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#0E0318] border border-purple-900/30 text-gray-200 p-2 rounded-lg shadow-lg shadow-[#6B00D7]/20 min-w-[200px] z-50">
                  <DropdownMenuItem asChild>
                    <Link href="/features" className="px-4 py-2 rounded-md hover:bg-[#6B00D7]/20 flex items-center">
                      <Globe className="w-4 h-4 mr-2" /> All Features
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/bitcoin-halving" className="px-4 py-2 rounded-md hover:bg-[#6B00D7]/20 flex items-center">
                      <Bitcoin className="w-4 h-4 mr-2" /> Bitcoin Halving Vault™
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/gift-crypto" className="px-4 py-2 rounded-md hover:bg-[#6B00D7]/20 flex items-center">
                      <Gift className="w-4 h-4 mr-2" /> Gift Crypto Vault™
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/token-vaults" className="px-4 py-2 rounded-md hover:bg-[#6B00D7]/20 flex items-center">
                      <Coins className="w-4 h-4 mr-2" /> Token Vaults™
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Vault School Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="text-gray-200 hover:text-[#FF5AF7] transition-colors px-3 py-2 rounded-md hover:bg-black/30 outline-none">
                  <div className="flex items-center">
                    Vault School <ChevronRight className="w-4 h-4 ml-1 rotate-90" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#0E0318] border border-purple-900/30 text-gray-200 p-2 rounded-lg shadow-lg shadow-[#6B00D7]/20 min-w-[220px] z-50">
                  <DropdownMenuItem asChild>
                    <Link href="/vault-school-hub" className="px-4 py-2 rounded-md hover:bg-[#6B00D7]/20 flex items-center">
                      <GraduationCap className="w-4 h-4 mr-2" /> Vault School Hub
                      <span className="ml-2 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white text-[10px] px-1.5 rounded-full">NEW</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/military-grade-security" className="px-4 py-2 rounded-md hover:bg-[#6B00D7]/20 flex items-center">
                      <Shield className="w-4 h-4 mr-2" /> Military Grade Security
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/security-tutorials" className="px-4 py-2 rounded-md hover:bg-[#6B00D7]/20 flex items-center">
                      <BookOpen className="w-4 h-4 mr-2" /> Security Tutorials
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/security-video-guides" className="px-4 py-2 rounded-md hover:bg-[#6B00D7]/20 flex items-center">
                      <Video className="w-4 h-4 mr-2" /> Security Video Guides
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/technical-security-docs" className="px-4 py-2 rounded-md hover:bg-[#6B00D7]/20 flex items-center">
                      <FileText className="w-4 h-4 mr-2" /> Technical Security Docs
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Resources Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="text-gray-200 hover:text-[#FF5AF7] transition-colors px-3 py-2 rounded-md hover:bg-black/30 outline-none">
                  <div className="flex items-center">
                    Resources <ChevronRight className="w-4 h-4 ml-1 rotate-90" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#0E0318] border border-purple-900/30 text-gray-200 p-2 rounded-lg shadow-lg shadow-[#6B00D7]/20 min-w-[200px] z-50">
                  <DropdownMenuItem asChild>
                    <Link href="/how-it-works" className="px-4 py-2 rounded-md hover:bg-[#6B00D7]/20 flex items-center">
                      <Lightbulb className="w-4 h-4 mr-2" /> How it Works
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/cvt-token" className="px-4 py-2 rounded-md hover:bg-[#6B00D7]/20 flex items-center">
                      <Coins className="w-4 h-4 mr-2" /> CVT Token
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/tokenomics" className="px-4 py-2 rounded-md hover:bg-[#6B00D7]/20 flex items-center">
                      <BarChart2 className="w-4 h-4 mr-2" /> Tokenomics
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/whitepaper" className="px-4 py-2 rounded-md hover:bg-[#6B00D7]/20 flex items-center">
                      <FileText className="w-4 h-4 mr-2" /> Whitepaper
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/docs" className="px-4 py-2 rounded-md hover:bg-[#6B00D7]/20 flex items-center">
                      <Files className="w-4 h-4 mr-2" /> Docs
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/roadmap" className="px-4 py-2 rounded-md hover:bg-[#6B00D7]/20 flex items-center">
                      <GitPullRequest className="w-4 h-4 mr-2" /> Roadmap
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/faq" className="px-4 py-2 rounded-md hover:bg-[#6B00D7]/20 flex items-center">
                      <HelpCircle className="w-4 h-4 mr-2" /> FAQ
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Connect Wallet Button */}
              <Button 
                className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#FF5AF7] hover:to-[#6B00D7] text-white border-none shadow-md shadow-purple-900/20 hover:shadow-purple-900/40 transition-all duration-300"
                size="sm"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
              
              {/* Network Status */}
              <div className="hidden lg:flex items-center bg-black/60 rounded-full px-3 py-1.5 text-xs border border-purple-900/30">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse mr-2"></div>
                <span className="text-green-400">Network Secure</span>
              </div>
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
          className={`fixed top-0 right-0 h-full w-80 bg-[#0E0318] shadow-[-5px_0_25px_rgba(107,0,215,0.3)] transition-transform duration-300 ease-out ${
            sidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-5 border-b border-purple-900/30">
            <div className="flex items-center">
              <div className="h-14 w-14 rounded-full flex items-center justify-center shadow-lg shadow-[#6B00D7]/30 hover:shadow-[#FF5AF7] hover:shadow-xl transition-all duration-500 overflow-hidden border-2 border-[#9333EA]/30 hover:border-[#FF5AF7] transform hover:scale-110 mr-3 relative animate-pulse hover:animate-none">
                <div className="absolute inset-0 bg-gradient-to-r from-[#6B00D7]/40 to-[#FF5AF7]/60 opacity-0 hover:opacity-100 transition-all duration-500 animate-ping"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#FF5AF7]/20 to-transparent opacity-0 hover:opacity-100 hover:animate-pulse"></div>
                <img src={logoPath} alt="Chronos Vault Logo" className="w-full h-full object-cover transition-all duration-500 hover:brightness-150 hover:saturate-200 hover:rotate-12" />
              </div>
              
              <div className="relative">
                <h1 className="text-xl font-bold hover:scale-105 transition-transform duration-300">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#FF5AF7] hover:to-[#6B00D7] transition-all duration-500">Chronos</span> 
                  <span className="text-white hover:text-[#FF5AF7]/90 transition-colors duration-500">Vault</span>
                </h1>
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wider shadow-md shadow-[#FF5AF7]/30 animate-pulse hover:shadow-[#FF5AF7]/50 hover:shadow-lg transition-all duration-300">BETA</div>
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
              {/* Special How It Works Item with highlight */}
              <div className="mb-3 relative">
                <Link 
                  href="/how-it-works" 
                  className="flex items-center px-3 py-3 rounded-md bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 border border-[#FF5AF7]/30 text-white hover:bg-gradient-to-r hover:from-[#6B00D7]/30 hover:to-[#FF5AF7]/30 transition-all group"
                  onClick={closeSidebar}
                >
                  <div className="relative">
                    <Search className="h-5 w-5 mr-3 text-[#FF5AF7]" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#FF5AF7] rounded-full animate-ping opacity-75"></span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">How It Works</span>
                    <span className="text-xs text-gray-300">Simple guide to our platform</span>
                  </div>
                  <span className="ml-auto">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:translate-x-0.5 transition-transform text-[#FF5AF7]">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </Link>
              </div>

              {/* Wallet Item with highlight */}
              <div className="mb-3 relative">
                <Link 
                  href="/wallet" 
                  className="flex items-center px-3 py-3 rounded-md bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-white hover:bg-gradient-to-r hover:from-cyan-500/30 hover:to-purple-500/30 transition-all group"
                  onClick={closeSidebar}
                >
                  <div className="relative">
                    <Wallet className="h-5 w-5 mr-3 text-cyan-400" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-75"></span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">Chronos Wallet</span>
                    <span className="text-xs text-gray-300">Trinity Protocol Security</span>
                  </div>
                  <span className="ml-auto">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:translate-x-0.5 transition-transform text-cyan-400">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </Link>
              </div>
              
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
                icon={<ArrowDownUp className="h-5 w-5" />} 
                label="Cross-Chain Operations" 
                href="/cross-chain-operations" 
                active={location === '/cross-chain-operations'}
                onClick={closeSidebar}
              />

              <SidebarItem 
                icon={<ListChecks className="h-5 w-5" />} 
                label="Transaction Monitor" 
                href="/transaction-monitor" 
                active={location === '/transaction-monitor'}
                onClick={closeSidebar}
              />

              <SidebarItem 
                icon={<ShieldCheck className="h-5 w-5" />} 
                label="Transaction Verification" 
                href="/transaction-verification" 
                active={location === '/transaction-verification'}
                onClick={closeSidebar}
              />

              <SidebarItem 
                icon={<Combine className="h-5 w-5" />} 
                label="Cross-Chain Bridge" 
                href="/cross-chain-bridge" 
                active={location === '/cross-chain-bridge'}
                onClick={closeSidebar}
              />

              <SidebarItem 
                icon={<Atom className="h-5 w-5" />} 
                label="Atomic Swaps" 
                href="/atomic-swaps" 
                active={location === '/atomic-swaps'}
                onClick={closeSidebar}
              />

              <SidebarItem 
                icon={<ArrowRightLeft className="h-5 w-5" />} 
                label="Bridge vs Swap" 
                href="/bridge-vs-swap" 
                active={location === '/bridge-vs-swap'}
                onClick={closeSidebar}
              />

              <SidebarItem 
                icon={<ShieldAlert className="h-5 w-5" />} 
                label="Security Dashboard" 
                href="/security-dashboard" 
                active={location === '/security-dashboard'}
                onClick={closeSidebar}
              />

              <SidebarItem 
                icon={<BoxSelect className="h-5 w-5" />} 
                label="Vault Explorer" 
                href="/vault-explorer" 
                active={location === '/vault-explorer'}
                onClick={closeSidebar}
              />
            </SidebarSection>
            
            {/* Features Section */}
            <SidebarSection icon={<Globe className="h-5 w-5" />} title="Features">
              <SidebarItem 
                icon={<Bitcoin className="h-5 w-5" />} 
                label="Bitcoin Halving" 
                href="/bitcoin-halving" 
                active={location === '/bitcoin-halving'}
                onClick={closeSidebar}
              />

              <SidebarItem 
                icon={<Gift className="h-5 w-5" />} 
                label="Gift Crypto" 
                href="/gift-crypto" 
                active={location === '/gift-crypto'}
                onClick={closeSidebar}
              />

              <SidebarItem 
                icon={<Coins className="h-5 w-5" />} 
                label="Token Vaults" 
                href="/token-vaults" 
                active={location === '/token-vaults'}
                onClick={closeSidebar}
              />
            </SidebarSection>

            {/* Security Features Section */}
            <SidebarSection icon={<Shield className="h-5 w-5" />} title="Security Features">
              <SidebarItem 
                icon={<LockKeyhole className="h-5 w-5" />} 
                label="Cross-Chain Security" 
                href="/cross-chain-security" 
                active={location === '/cross-chain-security'}
                onClick={closeSidebar}
              />

              <SidebarItem 
                icon={<Fingerprint className="h-5 w-5" />} 
                label="Behavioral Authentication" 
                href="/behavioral-auth" 
                active={location === '/behavioral-auth'}
                onClick={closeSidebar}
              />

              <SidebarItem 
                icon={<KeyRound className="h-5 w-5" />} 
                label="Quantum Resistant" 
                href="/quantum-resistant" 
                active={location === '/quantum-resistant'}
                onClick={closeSidebar}
              />

              <SidebarItem 
                icon={<Users className="h-5 w-5" />} 
                label="Social Recovery" 
                href="/social-recovery" 
                active={location === '/social-recovery'}
                onClick={closeSidebar}
              />

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
                href="/triple-chain-security" 
                active={location === '/triple-chain-security'}
                onClick={closeSidebar}
              />
            </SidebarSection>
            
            {/* Developer Section */}
            <SidebarSection icon={<Code className="h-5 w-5" />} title="Developer">
              <SidebarItem 
                icon={<FileCode className="h-5 w-5" />} 
                label="API Documentation" 
                href="/api-documentation" 
                active={location === '/api-documentation'}
                onClick={closeSidebar}
              />
              
              <SidebarItem 
                icon={<GitPullRequest className="h-5 w-5" />} 
                label="Integration Guide" 
                href="/integration-guide" 
                active={location === '/integration-guide'}
                onClick={closeSidebar}
              />
              
              <SidebarItem 
                icon={<Cpu className="h-5 w-5" />} 
                label="Smart Contract SDK" 
                href="/smart-contract-sdk" 
                active={location === '/smart-contract-sdk'}
                onClick={closeSidebar}
              />
              
              <SidebarItem 
                icon={<Code className="h-5 w-5" />} 
                label="Developer Portal" 
                href="/developer-portal" 
                active={location === '/developer-portal'}
                onClick={closeSidebar}
              />
            </SidebarSection>
            
            {/* Vault School Hub Section */}
            <SidebarSection icon={<GraduationCap className="h-5 w-5" />} title="Vault School Hub">
              <SidebarItem 
                icon={<GraduationCap className="h-5 w-5" />} 
                label="Vault School Hub" 
                href="/vault-school-hub" 
                active={location === '/vault-school-hub'}
                onClick={closeSidebar}
                isNew={true}
              />
              
              <SidebarItem 
                icon={<Shield className="h-5 w-5" />} 
                label="Military Grade Security" 
                href="/military-grade-security" 
                active={location === '/military-grade-security'}
                onClick={closeSidebar}
              />

              <SidebarItem 
                icon={<BookOpen className="h-5 w-5" />} 
                label="Security Tutorials" 
                href="/security-tutorials" 
                active={location === '/security-tutorials'}
                onClick={closeSidebar}
              />

              <SidebarItem 
                icon={<Video className="h-5 w-5" />} 
                label="Security Video Guides" 
                href="/security-video-guides" 
                active={location === '/security-video-guides'}
                onClick={closeSidebar}
              />

              <SidebarItem 
                icon={<FileText className="h-5 w-5" />} 
                label="Technical Security Docs" 
                href="/technical-security-docs" 
                active={location === '/technical-security-docs'}
                onClick={closeSidebar}
              />
            </SidebarSection>

            {/* Resources Section */}
            <SidebarSection icon={<Library className="h-5 w-5" />} title="Resources">
              <SidebarItem 
                icon={<Coins className="h-5 w-5" />} 
                label="CVT Token" 
                href="/cvt-token" 
                active={location === '/cvt-token'}
                onClick={closeSidebar}
              />

              <SidebarItem 
                icon={<Lightbulb className="h-5 w-5" />} 
                label="CVT Utility" 
                href="/cvt-utility" 
                active={location === '/cvt-utility'}
                onClick={closeSidebar}
              />

              <SidebarItem 
                icon={<BarChart2 className="h-5 w-5" />} 
                label="Tokenomics" 
                href="/tokenomics" 
                active={location === '/tokenomics'}
                onClick={closeSidebar}
              />

              <SidebarItem 
                icon={<FileText className="h-5 w-5" />} 
                label="Whitepaper" 
                href="/whitepaper" 
                active={location === '/whitepaper'}
                onClick={closeSidebar}
              />

              <SidebarItem 
                icon={<Code className="h-5 w-5" />} 
                label="Technical Spec" 
                href="/technical-spec" 
                active={location === '/technical-spec'}
                onClick={closeSidebar}
              />

              <SidebarItem 
                icon={<FileCode className="h-5 w-5" />} 
                label="Smart Contracts" 
                href="/smart-contracts" 
                active={location === '/smart-contracts'}
                onClick={closeSidebar}
              />

              <SidebarItem 
                icon={<GitPullRequest className="h-5 w-5" />} 
                label="Roadmap" 
                href="/roadmap" 
                active={location === '/roadmap'}
                onClick={closeSidebar}
              />

              <SidebarItem 
                icon={<Users className="h-5 w-5" />} 
                label="Team" 
                href="/team" 
                active={location === '/team'}
                onClick={closeSidebar}
              />

              <SidebarItem 
                icon={<Files className="h-5 w-5" />} 
                label="Docs" 
                href="/docs" 
                active={location === '/docs'}
                onClick={closeSidebar}
              />

              <SidebarItem 
                icon={<HelpCircle className="h-5 w-5" />} 
                label="FAQ" 
                href="/faq" 
                active={location === '/faq'}
                onClick={closeSidebar}
              />

              <SidebarItem 
                icon={<Info className="h-5 w-5" />} 
                label="About" 
                href="/about" 
                active={location === '/about'}
                onClick={closeSidebar}
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
      className={`flex items-center py-2.5 px-3 rounded-lg transition-all duration-300 group ${
        active 
          ? 'bg-gradient-to-r from-[#6B00D7]/30 to-[#FF5AF7]/10 text-white shadow-md shadow-[#6B00D7]/10' 
          : 'text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-[#6B00D7]/20 hover:to-[#FF5AF7]/5'
      }`}
    >
      <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 transition-all duration-300 ${
        active 
          ? 'bg-[#6B00D7]/50 shadow-inner shadow-[#FF5AF7]/20 text-[#FF5AF7]' 
          : 'bg-black/40 group-hover:bg-[#6B00D7]/30 group-hover:text-[#FF5AF7] text-purple-400'
      } transform ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
        {icon}
      </div>
      <span className="transition-all duration-300">{label}</span>
      {isNew && (
        <div className="ml-2 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-[10px] text-white font-bold px-1.5 py-0.5 rounded-full shadow-sm shadow-[#FF5AF7]/30 animate-pulse">
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