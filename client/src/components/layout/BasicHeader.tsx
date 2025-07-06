import React, { useState } from 'react';
import { Link, useLocation } from "wouter";
import logoPath from "@assets/IMG_3753.jpeg";
import { 
  Menu, 
  X,
  Clock, 
  Users, 
  MapPin, 
  Fingerprint, 
  Lock, 
  Brain,
  BarChart3,
  Globe,
  Shield,
  FileText
} from 'lucide-react';
import { Button } from "@/components/ui/button";

const MobileMenuItem = ({ 
  icon, 
  label, 
  href, 
  isHeader = false,
  isNew = false,
  onClick,
  extraClasses = ""
}) => {
  const itemContent = (
    <div 
      className={`
        relative flex items-center gap-3 py-2.5 px-4 rounded-full w-full
        ${isHeader ? 'text-[#FF5AF7] font-semibold text-lg' : 'text-white text-base'}
        ${href || onClick ? 'cursor-pointer hover:bg-[#6B00D7]/20' : ''}
        ${extraClasses}
      `}
      onClick={onClick}
    >
      <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-[#2D0C4B]">
        {icon}
      </div>
      <span>{label}</span>
      {isNew && (
        <span className="absolute top-1 right-2 bg-[#FF5AF7] text-white text-[8px] px-1 py-0.5 rounded-full font-bold">
          NEW
        </span>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{itemContent}</Link>;
  }

  return itemContent;
};

const RoundMenuItem = ({ 
  icon, 
  label, 
  href, 
  isNew = false
}) => (
  <Link 
    href={href}
    className="relative flex flex-col items-center justify-center text-center p-3"
  >
    <div className="w-12 h-12 rounded-full bg-[#2D0C4B] flex items-center justify-center mb-1">
      {icon}
    </div>
    <span className="text-xs text-white mt-1">{label}</span>
    {isNew && (
      <span className="absolute top-0 right-0 bg-[#FF5AF7] text-white text-[8px] px-1 py-0.5 rounded-full font-bold">
        NEW
      </span>
    )}
  </Link>
);

const BasicHeader = () => {
  const [location] = useLocation();
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [currentMenuSection, setCurrentMenuSection] = useState("main");
  
  // Mobile slide menu sections
  const menuSections = {
    main: (
      <>
        <MobileMenuItem 
          icon={<div className="text-[#FF5AF7] text-lg">🏠</div>}
          label="Main" 
          isHeader 
        />
        <MobileMenuItem 
          icon={<div className="text-white text-md">🏠</div>}
          label="Home" 
          href="/" 
        />
        <MobileMenuItem 
          icon={<div className="text-white text-md">🔒</div>}
          label="Vaults" 
          href="/my-vaults" 
        />
        
        <MobileMenuItem 
          icon={<div className="text-[#FF5AF7] text-lg">🔍</div>}
          label="Explore" 
          isHeader 
          extraClasses="mt-4"
        />
        <MobileMenuItem 
          icon={<BarChart3 className="text-white w-4 h-4" />}
          label="Cross-Chain Monitor" 
          href="/cross-chain-monitor" 
        />
        <MobileMenuItem 
          icon={<BarChart3 className="text-white w-4 h-4" />}
          label="Cross-Chain Metrics" 
          href="/cross-chain-metrics" 
        />
        <MobileMenuItem 
          icon={<Globe className="text-white w-4 h-4" />}
          label="Cross-Chain Operations" 
          href="/cross-chain-operations"
          isNew
        />

        <MobileMenuItem 
          icon={<div className="text-[#FF5AF7] text-lg">🔒</div>}
          label="Security Features" 
          extraClasses="mt-4"
          onClick={() => setCurrentMenuSection("security")}
        />
      </>
    ),
    security: (
      <>
        <MobileMenuItem 
          icon={<div className="text-[#FF5AF7] text-lg">🔒</div>}
          label="Security Features" 
          isHeader 
        />
        <MobileMenuItem 
          icon={<Shield className="text-white w-4 h-4" />}
          label="Cross-Chain Security" 
          href="/cross-chain-security" 
        />
        <MobileMenuItem 
          icon={<Brain className="text-white w-4 h-4" />}
          label="Behavioral Authentication" 
          href="/behavioral-authentication" 
          isNew
        />
        <MobileMenuItem 
          icon={<Lock className="text-white w-4 h-4" />}
          label="Quantum-Resistant" 
          href="/quantum-resistant" 
          isNew
        />
        <MobileMenuItem 
          icon={<Users className="text-white w-4 h-4" />}
          label="Social Recovery" 
          href="/social-recovery" 
          isNew
        />
        
        <MobileMenuItem 
          icon={<div className="text-[#FF5AF7] text-lg">📚</div>}
          label="Vault School Hub" 
          extraClasses="mt-4"
          onClick={() => setCurrentMenuSection("school")}
        />
        
        <div className="grid grid-cols-2 gap-3 mt-4">
          <RoundMenuItem 
            icon={<FileText className="text-white w-5 h-5" />}
            label="Vault School Hub" 
            href="/vault-school-hub"
          />
          <RoundMenuItem 
            icon={<Shield className="text-white w-5 h-5" />}
            label="Military-Grade Security" 
            href="/military-grade-security"
            isNew
          />
        </div>
      </>
    ),
    school: (
      <>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <RoundMenuItem 
            icon={<FileText className="text-white w-5 h-5" />}
            label="Vault School Hub" 
            href="/vault-school-hub"
          />
          <RoundMenuItem 
            icon={<Shield className="text-white w-5 h-5" />}
            label="Military-Grade Security" 
            href="/military-grade-security"
            isNew
          />
          <RoundMenuItem 
            icon={<FileText className="text-white w-5 h-5" />}
            label="Security Tutorials" 
            href="/security-tutorials"
            isNew
          />
          <RoundMenuItem 
            icon={<FileText className="text-white w-5 h-5" />}
            label="Security Video Guides" 
            href="/security-video-guides"
            isNew
          />
          <RoundMenuItem 
            icon={<FileText className="text-white w-5 h-5" />}
            label="Technical Security Docs" 
            href="/technical-security-docs"
            isNew
          />
        </div>
        
        <MobileMenuItem 
          icon={<div className="text-[#FF5AF7] text-lg">➕</div>}
          label="Features" 
          isHeader 
          extraClasses="mt-4"
          onClick={() => setCurrentMenuSection("features")}
        />
        <MobileMenuItem 
          icon={<Users className="text-white w-4 h-4" />}
          label="Multi-Signature" 
          href="/multi-signature" 
        />
      </>
    ),
    features: (
      <>
        <MobileMenuItem 
          icon={<div className="text-white text-md">Ƀ</div>}
          label="Bitcoin Halving" 
          href="/bitcoin-halving" 
        />
        <MobileMenuItem 
          icon={<div className="text-white text-md">🎁</div>}
          label="Gift Crypto" 
          href="/gift-crypto" 
        />
        <MobileMenuItem 
          icon={<div className="text-white text-md">🪙</div>}
          label="Token Vaults" 
          href="/token-vaults" 
        />
        
        <MobileMenuItem 
          icon={<div className="text-[#FF5AF7] text-lg">🛠️</div>}
          label="Developer" 
          isHeader 
          extraClasses="mt-4"
          onClick={() => setCurrentMenuSection("developer")}
        />
        <MobileMenuItem 
          icon={<div className="text-white text-md">📖</div>}
          label="API Documentation" 
          href="/api-documentation" 
        />
        <MobileMenuItem 
          icon={<div className="text-white text-md">💻</div>}
          label="SDK Access" 
          href="/sdk-access" 
        />
        <MobileMenuItem 
          icon={<div className="text-white text-md">🔍</div>}
          label="Smart Contract Audit" 
          href="/smart-contract-audit" 
        />
      </>
    ),
    developer: (
      <>
        <MobileMenuItem 
          icon={<div className="text-white text-md">📖</div>}
          label="API Documentation" 
          href="/api-documentation" 
        />
        <MobileMenuItem 
          icon={<div className="text-white text-md">💻</div>}
          label="SDK Access" 
          href="/sdk-access" 
        />
        <MobileMenuItem 
          icon={<div className="text-white text-md">🔍</div>}
          label="Smart Contract Audit" 
          href="/smart-contract-audit" 
        />
        
        <MobileMenuItem 
          icon={<div className="text-[#FF5AF7] text-lg">📚</div>}
          label="Resources" 
          isHeader 
          extraClasses="mt-4"
          onClick={() => setCurrentMenuSection("resources")}
        />
      </>
    ),
    resources: (
      <>
        <MobileMenuItem 
          icon={<div className="text-[#FF5AF7] text-lg">📚</div>}
          label="Resources" 
          isHeader 
        />
        
        <div className="grid grid-cols-2 gap-3 mt-4">
          <RoundMenuItem 
            icon={<div className="text-white text-md">🪙</div>}
            label="CVT Token" 
            href="/cvt-token"
          />
          <RoundMenuItem 
            icon={<div className="text-white text-md">⚡</div>}
            label="CVT Utility" 
            href="/cvt-utility"
          />
          <RoundMenuItem 
            icon={<div className="text-white text-md">📊</div>}
            label="Tokenomics" 
            href="/tokenomics"
          />
          <RoundMenuItem 
            icon={<div className="text-white text-md">📄</div>}
            label="Whitepaper" 
            href="/whitepaper"
          />
          <RoundMenuItem 
            icon={<div className="text-white text-md">🔧</div>}
            label="Technical Spec" 
            href="/technical-spec"
          />
          <RoundMenuItem 
            icon={<div className="text-white text-md">📝</div>}
            label="Smart Contracts" 
            href="/smart-contracts"
          />
          <RoundMenuItem 
            icon={<div className="text-white text-md">🛣️</div>}
            label="Roadmap" 
            href="/roadmap"
          />
          <RoundMenuItem 
            icon={<div className="text-white text-md">👥</div>}
            label="Team" 
            href="/team"
          />
        </div>
      </>
    ),
    moreResources: (
      <>
        <div className="grid grid-cols-2 gap-3">
          <RoundMenuItem 
            icon={<div className="text-white text-md">📊</div>}
            label="Tokenomics" 
            href="/tokenomics"
          />
          <RoundMenuItem 
            icon={<div className="text-white text-md">📄</div>}
            label="Whitepaper" 
            href="/whitepaper"
          />
          <RoundMenuItem 
            icon={<div className="text-white text-md">🔧</div>}
            label="Technical Spec" 
            href="/technical-spec"
          />
          <RoundMenuItem 
            icon={<div className="text-white text-md">📝</div>}
            label="Smart Contracts" 
            href="/smart-contracts"
          />
          <RoundMenuItem 
            icon={<div className="text-white text-md">🛣️</div>}
            label="Roadmap" 
            href="/roadmap"
          />
          <RoundMenuItem 
            icon={<div className="text-white text-md">👥</div>}
            label="Team" 
            href="/team"
          />
          <RoundMenuItem 
            icon={<div className="text-white text-md">📑</div>}
            label="Docs" 
            href="/docs"
          />
          <RoundMenuItem 
            icon={<div className="text-white text-md">❓</div>}
            label="FAQ" 
            href="/faq"
          />
          <RoundMenuItem 
            icon={<div className="text-white text-md">ℹ️</div>}
            label="About" 
            href="/about"
          />
        </div>
      </>
    ),
  };
  
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
                onClick={() => setSideMenuOpen(true)}
              >
                <Menu className="w-5 h-5 text-[#FF5AF7]" />
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Sidebar Navigation */}
      {sideMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/70">
          <div className="fixed top-0 right-0 bottom-0 w-[320px] bg-[#141414] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#2D0C4B]/30">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] opacity-80 blur-sm"></div>
                  <div className="absolute inset-0.5 rounded-full bg-black flex items-center justify-center overflow-hidden">
                    <img src={logoPath} alt="Chronos Vault Logo" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="relative">
                  <h1 className="text-xl font-bold">
                    <span className="text-[#FF5AF7]">Chronos</span><span className="text-white">Vault</span>
                  </h1>
                  <div className="absolute -top-3 -right-8 bg-[#FF5AF7] text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold tracking-wider">
                    BETA
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSideMenuOpen(false)}
                className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-[#2D0C4B]/30"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Content Area */}
            <div className="p-4">
              {menuSections[currentMenuSection]}
              
              {/* Connect Wallets Section */}
              <div className="mt-6 pt-4 border-t border-[#2D0C4B]/30">
                <div className="flex items-center gap-2 text-gray-400 mb-3">
                  <div className="text-[#FF5AF7]">⚙️</div>
                  <span className="text-[#FF5AF7]">Connect Wallets</span>
                </div>
                <div className="mt-3 border border-[#2D0C4B]/50 rounded-lg p-3 flex justify-center">
                  <div className="text-white text-sm">📄</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BasicHeader;