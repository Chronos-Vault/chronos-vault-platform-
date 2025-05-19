import React, { useState } from 'react';
import { Link, useLocation } from "wouter";
import logoPath from "@assets/IMG_3753.jpeg";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  Home, Layers, Shield, Book, Activity, Globe, BarChart3, 
  Clock, Users, MapPin, Fingerprint, Lock, Hexagon, 
  Brain, Diamond, KeyRound, Menu, X, Settings
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";

const BasicHeader = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Desktop navigation links
  const desktopNavigationLinks = [
    { name: "Home", href: "/", icon: <Home className="w-4 h-4 mr-1.5" /> },
    { name: "My Vaults", href: "/my-vaults", icon: <Layers className="w-4 h-4 mr-1.5" /> },
    { name: "Vault Types", href: "/vault-types", icon: <Shield className="w-4 h-4 mr-1.5" /> },
    { name: "Vault School", href: "/vault-school", icon: <Book className="w-4 h-4 mr-1.5" /> },
    { 
      name: "Monitoring", 
      icon: <Activity className="w-4 h-4 mr-1.5" />,
      isDropdown: true,
      children: [
        { name: "Transaction Monitor", href: "/transaction-monitor", icon: <BarChart3 className="w-4 h-4 mr-2" /> },
        { name: "Cross-Chain Monitor", href: "/cross-chain-monitor", icon: <Globe className="w-4 h-4 mr-2" /> }
      ]
    },
    { name: "Security", href: "/security-verification-demo", icon: <KeyRound className="w-4 h-4 mr-1.5" /> },
    { name: "CVT Token", href: "/cvt-token", icon: <Diamond className="w-4 h-4 mr-1.5" /> },
  ];
  
  // Mobile categories for better UX
  const mobileCategoryMenu = [
    {
      id: "main",
      title: "Main",
      icon: "🏠",
      items: [
        { name: "Home", href: "/", icon: <Home className="w-4 h-4" /> },
        { name: "My Vaults", href: "/my-vaults", icon: <Layers className="w-4 h-4" /> },
        { name: "Vault Types", href: "/vault-types", icon: <Shield className="w-4 h-4" /> },
      ]
    },
    {
      id: "vault-types",
      title: "Vault Types",
      icon: "🔐",
      items: [
        { name: "Time Lock Vault", href: "/time-lock-vault", icon: <Clock className="w-4 h-4" /> },
        { name: "Multi-Signature", href: "/multi-signature-vault", icon: <Users className="w-4 h-4" /> },
        { name: "Geo-Location Vault", href: "/geo-location-vault", icon: <MapPin className="w-4 h-4" /> },
        { name: "Biometric Vault", href: "/biometric-vault", icon: <Fingerprint className="w-4 h-4" /> },
        { name: "Quantum-Resistant", href: "/quantum-resistant-vault", icon: <Lock className="w-4 h-4" /> },
        { name: "Sovereign Fortress", href: "/sovereign-fortress-vault", icon: <Hexagon className="w-4 h-4" /> },
        { name: "AI-Assisted Investment", href: "/ai-assisted-investment-vault", icon: <Brain className="w-4 h-4" /> },
      ]
    },
    {
      id: "monitoring",
      title: "Monitoring",
      icon: "📊",
      items: [
        { name: "Transaction Monitor", href: "/transaction-monitor", icon: <BarChart3 className="w-4 h-4" /> },
        { name: "Cross-Chain Monitor", href: "/cross-chain-monitor", icon: <Globe className="w-4 h-4" /> },
      ]
    },
    {
      id: "resources",
      title: "Resources",
      icon: "📚",
      items: [
        { name: "Security", href: "/security-verification-demo", icon: <KeyRound className="w-4 h-4" /> },
        { name: "CVT Token", href: "/cvt-token", icon: <Diamond className="w-4 h-4" /> },
        { name: "Vault School", href: "/vault-school", icon: <Book className="w-4 h-4" /> },
      ]
    }
  ];
  
  return (
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
          
          {/* Navigation Menu - Desktop */}
          <div className="hidden lg:flex items-center space-x-1">
            {desktopNavigationLinks.map((link, index) => 
              link.isDropdown ? (
                <DropdownMenu key={link.name}>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className={`flex items-center text-sm px-3 py-1.5 rounded-lg border-b-2 transition-colors duration-200 ${
                        location.includes(link.name.toLowerCase()) 
                          ? "bg-[#6B00D7]/10 text-purple-400 border-purple-500" 
                          : "text-gray-400 hover:text-purple-400 border-transparent hover:bg-[#6B00D7]/5"
                      }`}
                    >
                      {link.icon}
                      {link.name}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-black/90 backdrop-blur-lg border border-purple-900/40 text-white">
                    {link.children.map((childLink) => (
                      <DropdownMenuItem key={childLink.name} asChild>
                        <Link href={childLink.href} className="flex items-center text-sm cursor-pointer hover:bg-[#6B00D7]/20">
                          {childLink.icon}
                          {childLink.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link 
                  key={link.name}
                  href={link.href} 
                  className={`
                    flex items-center transition-colors duration-200
                    ${location === link.href ? "bg-[#6B00D7]/10 text-purple-400 border-purple-500" : "text-gray-400 hover:text-purple-400 border-transparent hover:bg-[#6B00D7]/5"}
                    px-3 py-1.5 rounded-lg text-sm border-b-2
                  `}
                >
                  {link.icon}
                  {link.name}
                </Link>
              )
            )}
          </div>
          
          {/* Right Side - Network Status and Create Vault Button */}
          <div className="hidden md:flex items-center space-x-4">
            {/* CVT Token Balance Display */}
            <div className="flex items-center bg-black/40 rounded-full px-3 py-1 text-xs border border-[#6B00D7]/20">
              <div className="h-5 w-5 rounded-full bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center mr-2">
                <span className="text-[10px] font-bold text-white">CVT</span>
              </div>
              <span className="text-[#FF5AF7]">1,000 CVT</span>
            </div>
            
            {/* Network Status */}
            <div className="flex items-center bg-black/40 rounded-full px-3 py-1 text-xs border border-[#6B00D7]/20">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse mr-2"></div>
              <span className="text-green-400">Network Secure</span>
            </div>
            
            {/* Create Vault Button */}
            <Link 
              href="/vault-selector" 
              className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#FF5AF7] hover:to-[#6B00D7] text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-all duration-500 hover:shadow-[0_0_20px_rgba(107,0,215,0.5)]"
            >
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
        </nav>
      </div>
      
      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-purple-900/20 py-3 px-4 bg-gradient-to-b from-[#0a0014] to-black">
          {mobileCategoryMenu.map((category) => (
            <div key={category.id} className="mb-4">
              <div className="text-xs text-purple-400 mb-2">{category.title}</div>
              <div className="grid grid-cols-2 gap-2">
                {category.items.map((link) => (
                  <Link 
                    key={link.name}
                    href={link.href} 
                    className={`
                      flex flex-col items-center justify-center text-center p-2 rounded-lg text-xs
                      ${location === link.href ? 'bg-[#6B00D7]/20 text-[#FF5AF7]' : 'text-gray-400 hover:bg-[#6B00D7]/10 hover:text-[#FF5AF7]'}
                    `}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className={`
                      w-8 h-8 mb-1 rounded-full flex items-center justify-center
                      ${location === link.href ? 'bg-[#6B00D7]/30' : 'bg-black/50'}
                    `}>
                      {link.icon}
                    </div>
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          
          <div className="mt-4 flex justify-center">
            <Link 
              href="/vault-selector" 
              className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#FF5AF7] hover:to-[#6B00D7] text-white text-sm font-medium px-6 py-2 rounded-lg transition-all duration-500 hover:shadow-[0_0_20px_rgba(107,0,215,0.5)] w-full text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Create New Vault
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default BasicHeader;