import React, { useState } from 'react';
import { Link, useLocation } from "wouter";
import logoPath from "@assets/IMG_3753.jpeg";
import { X } from 'lucide-react';

// Interface for menu items
interface MenuItemProps {
  icon?: React.ReactNode;
  label: string;
  href?: string;
  isHeader?: boolean;
  isNew?: boolean;
  onClick?: () => void;
  circleStyle?: boolean;
}

// Menu item component
const MenuItem: React.FC<MenuItemProps> = ({ 
  icon, 
  label, 
  href, 
  isHeader = false,
  isNew = false,
  onClick,
  circleStyle = false
}) => {
  const itemContent = (
    <div 
      className={`
        relative flex items-center gap-3 py-2.5 px-4 rounded-full w-full
        ${isHeader ? 'text-[#FF5AF7] font-semibold text-lg' : 'text-white text-base'}
        ${href ? 'cursor-pointer hover:bg-[#6B00D7]/20' : ''}
        ${circleStyle ? 'justify-center bg-[#2D0C4B] py-5 px-0 rounded-full' : ''}
      `}
      onClick={onClick}
    >
      {icon && (
        <div className={`
          flex-shrink-0 flex items-center justify-center
          ${circleStyle ? 'w-full h-full' : 'w-7 h-7 rounded-full bg-[#2D0C4B]'}
        `}>
          {icon}
        </div>
      )}
      {(!circleStyle || !icon) && (
        <span className={`${circleStyle ? 'text-center' : ''}`}>{label}</span>
      )}
      {isNew && (
        <span className="absolute top-1 right-1 bg-[#FF5AF7] text-white text-[8px] px-1 py-0.5 rounded-full font-bold">
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

// Main sidebar component
const Sidebar: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [currentMenu, setCurrentMenu] = useState<string>("main");

  // Helper to set active menu
  const setMenu = (menu: string) => {
    setCurrentMenu(menu);
  };

  return (
    <div 
      className={`
        fixed inset-0 z-50 transition-all duration-300 bg-black/70
        ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}
    >
      <div className={`
        fixed right-0 top-0 bottom-0 w-[320px] bg-[#141414] transition-transform duration-300 overflow-y-auto
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
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
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-[#2D0C4B]/30"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4">
          {/* Main Menu */}
          {currentMenu === "main" && (
            <div className="space-y-4">
              <MenuItem 
                icon={<div className="text-[#FF5AF7] text-xl font-bold">🏠</div>}
                label="Main" 
                isHeader 
              />
              <MenuItem 
                icon={<div className="text-white text-md">🏠</div>}
                label="Home" 
                href="/" 
              />
              <MenuItem 
                icon={<div className="text-white text-md">🔒</div>}
                label="Vaults" 
                href="/my-vaults" 
              />
              
              <MenuItem 
                icon={<div className="text-[#FF5AF7] text-xl font-bold">🔍</div>}
                label="Explore" 
                isHeader 
              />
              <MenuItem 
                icon={<div className="text-white text-md">📊</div>}
                label="Cross-Chain Monitor" 
                href="/cross-chain-monitor" 
              />
              <MenuItem 
                icon={<div className="text-white text-md">📊</div>}
                label="Cross-Chain Metrics" 
                href="/cross-chain-metrics" 
              />
              <MenuItem 
                icon={<div className="text-white text-md">🔄</div>}
                label="Cross-Chain Operations" 
                href="/cross-chain-operations"
                isNew
              />
              
              <div className="mt-4 pt-4 border-t border-[#2D0C4B]/30">
                <MenuItem 
                  icon={<div className="text-white text-md">⚙️</div>}
                  label="Connect Wallets" 
                  onClick={() => {}} 
                />
                <div className="mt-3 border border-[#2D0C4B]/50 rounded-lg p-3 flex justify-center">
                  <div className="text-white text-sm">📄</div>
                </div>
              </div>
            </div>
          )}

          {/* Explore Menu */}
          {currentMenu === "explore" && (
            <div className="space-y-4">
              <MenuItem 
                icon={<div className="text-[#FF5AF7] text-xl font-bold">🔍</div>}
                label="Explore" 
                isHeader 
              />
              <MenuItem 
                icon={<div className="text-white text-md">📄</div>}
                label="Transaction Verification" 
                href="/transaction-verification" 
              />
              <MenuItem 
                icon={<div className="text-white text-md">🔄</div>}
                label="Cross-Chain Bridge" 
                href="/cross-chain-bridge" 
              />
              <MenuItem 
                icon={<div className="text-white text-md">⚛️</div>}
                label="Atomic Swaps" 
                href="/atomic-swaps" 
              />
              <MenuItem 
                icon={<div className="text-white text-md">🔄</div>}
                label="Bridge vs Swap" 
                href="/bridge-vs-swap" 
                isNew
              />
              <MenuItem 
                icon={<div className="text-white text-md">🛡️</div>}
                label="Security Dashboard" 
                href="/security-dashboard" 
                isNew
              />
              <MenuItem 
                icon={<div className="text-white text-md">🔍</div>}
                label="Vault Explorer" 
                href="/vault-explorer" 
              />

              <MenuItem 
                icon={<div className="text-[#FF5AF7] text-xl font-bold">🔒</div>}
                label="Security Features" 
                onClick={() => setMenu("security")}
              />
              
              <div className="mt-4 pt-4 border-t border-[#2D0C4B]/30">
                <MenuItem 
                  icon={<div className="text-white text-md">⚙️</div>}
                  label="Connect Wallets" 
                  onClick={() => {}} 
                />
                <div className="mt-3 border border-[#2D0C4B]/50 rounded-lg p-3 flex justify-center">
                  <div className="text-white text-sm">📄</div>
                </div>
              </div>
            </div>
          )}

          {/* Security Features Menu */}
          {currentMenu === "security" && (
            <div className="space-y-4">
              <MenuItem 
                icon={<div className="text-[#FF5AF7] text-xl font-bold">🔒</div>}
                label="Security Features" 
                isHeader 
              />
              <MenuItem 
                icon={<div className="text-white text-md">🔗</div>}
                label="Cross-Chain Security" 
                href="/cross-chain-security" 
              />
              <MenuItem 
                icon={<div className="text-white text-md">🧠</div>}
                label="Behavioral Authentication" 
                href="/behavioral-authentication" 
                isNew
              />
              <MenuItem 
                icon={<div className="text-white text-md">🛡️</div>}
                label="Quantum-Resistant" 
                href="/quantum-resistant" 
                isNew
              />
              <MenuItem 
                icon={<div className="text-white text-md">👥</div>}
                label="Social Recovery" 
                href="/social-recovery" 
                isNew
              />
              
              <MenuItem 
                icon={<div className="text-[#FF5AF7] text-xl font-bold">📚</div>}
                label="Vault School Hub" 
                onClick={() => setMenu("school")}
              />
              
              <div className="flex justify-around mt-3">
                <MenuItem 
                  icon={<div className="text-white text-md">📚</div>}
                  label="Vault School Hub" 
                  href="/vault-school-hub"
                  circleStyle
                />
                <MenuItem 
                  icon={<div className="text-white text-md">🛡️</div>}
                  label="Military-Grade Security" 
                  href="/military-grade-security"
                  circleStyle
                  isNew
                />
              </div>
              
              <div className="mt-4 pt-4 border-t border-[#2D0C4B]/30">
                <MenuItem 
                  icon={<div className="text-white text-md">⚙️</div>}
                  label="Connect Wallets" 
                  onClick={() => {}} 
                />
                <div className="mt-3 border border-[#2D0C4B]/50 rounded-lg p-3 flex justify-center">
                  <div className="text-white text-sm">📄</div>
                </div>
              </div>
            </div>
          )}

          {/* Vault School Hub Menu */}
          {currentMenu === "school" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <MenuItem 
                  icon={<div className="text-white text-md">📚</div>}
                  label="Vault School Hub" 
                  href="/vault-school-hub"
                  circleStyle
                />
                <MenuItem 
                  icon={<div className="text-white text-md">🛡️</div>}
                  label="Military-Grade Security" 
                  href="/military-grade-security"
                  circleStyle
                  isNew
                />
                <MenuItem 
                  icon={<div className="text-white text-md">📖</div>}
                  label="Security Tutorials" 
                  href="/security-tutorials"
                  circleStyle
                  isNew
                />
                <MenuItem 
                  icon={<div className="text-white text-md">🎬</div>}
                  label="Security Video Guides" 
                  href="/security-video-guides"
                  circleStyle
                  isNew
                />
                <MenuItem 
                  icon={<div className="text-white text-md">📃</div>}
                  label="Technical Security Docs" 
                  href="/technical-security-docs"
                  circleStyle
                  isNew
                />
              </div>
              
              <MenuItem 
                icon={<div className="text-[#FF5AF7] text-xl font-bold">➕</div>}
                label="Features" 
                isHeader 
              />
              <MenuItem 
                icon={<div className="text-white text-md">👥</div>}
                label="Multi-Signature" 
                href="/multi-signature" 
              />
              
              <div className="mt-4 pt-4 border-t border-[#2D0C4B]/30">
                <MenuItem 
                  icon={<div className="text-white text-md">⚙️</div>}
                  label="Connect Wallets" 
                  onClick={() => {}} 
                />
                <div className="mt-3 border border-[#2D0C4B]/50 rounded-lg p-3 flex justify-center">
                  <div className="text-white text-sm">📄</div>
                </div>
              </div>
            </div>
          )}

          {/* Features Menu */}
          {currentMenu === "features" && (
            <div className="space-y-4">
              <div className="space-y-3">
                <MenuItem 
                  icon={<div className="text-white text-md">Ƀ</div>}
                  label="Bitcoin Halving" 
                  href="/bitcoin-halving" 
                />
                <MenuItem 
                  icon={<div className="text-white text-md">🎁</div>}
                  label="Gift Crypto" 
                  href="/gift-crypto" 
                />
                <MenuItem 
                  icon={<div className="text-white text-md">🪙</div>}
                  label="Token Vaults" 
                  href="/token-vaults" 
                />
                
                <MenuItem 
                  icon={<div className="text-[#FF5AF7] text-xl font-bold">🛠️</div>}
                  label="Developer" 
                  isHeader 
                />
                <MenuItem 
                  icon={<div className="text-white text-md">📖</div>}
                  label="API Documentation" 
                  href="/api-documentation" 
                />
                <MenuItem 
                  icon={<div className="text-white text-md">💻</div>}
                  label="SDK Access" 
                  href="/sdk-access" 
                />
                <MenuItem 
                  icon={<div className="text-white text-md">🔍</div>}
                  label="Smart Contract Audit" 
                  href="/smart-contract-audit" 
                />
              </div>
              
              <div className="mt-4 pt-4 border-t border-[#2D0C4B]/30">
                <MenuItem 
                  icon={<div className="text-white text-md">⚙️</div>}
                  label="Connect Wallets" 
                  onClick={() => {}} 
                />
                <div className="mt-3 border border-[#2D0C4B]/50 rounded-lg p-3 flex justify-center">
                  <div className="text-white text-sm">📄</div>
                </div>
              </div>
            </div>
          )}

          {/* Resources Menu */}
          {currentMenu === "resources" && (
            <div className="space-y-4">
              <MenuItem 
                icon={<div className="text-[#FF5AF7] text-xl font-bold">📚</div>}
                label="Resources" 
                isHeader 
              />
              
              <div className="grid grid-cols-2 gap-3">
                <MenuItem 
                  icon={<div className="text-white text-md">🪙</div>}
                  label="CVT Token" 
                  href="/cvt-token"
                  circleStyle
                />
                <MenuItem 
                  icon={<div className="text-white text-md">⚡</div>}
                  label="CVT Utility" 
                  href="/cvt-utility"
                  circleStyle
                />
                <MenuItem 
                  icon={<div className="text-white text-md">📊</div>}
                  label="Tokenomics" 
                  href="/tokenomics"
                  circleStyle
                />
                <MenuItem 
                  icon={<div className="text-white text-md">📄</div>}
                  label="Whitepaper" 
                  href="/whitepaper"
                  circleStyle
                />
                <MenuItem 
                  icon={<div className="text-white text-md">🔧</div>}
                  label="Technical Spec" 
                  href="/technical-spec"
                  circleStyle
                />
                <MenuItem 
                  icon={<div className="text-white text-md">📝</div>}
                  label="Smart Contracts" 
                  href="/smart-contracts"
                  circleStyle
                />
                <MenuItem 
                  icon={<div className="text-white text-md">🛣️</div>}
                  label="Roadmap" 
                  href="/roadmap"
                  circleStyle
                />
                <MenuItem 
                  icon={<div className="text-white text-md">👥</div>}
                  label="Team" 
                  href="/team"
                  circleStyle
                />
              </div>
              
              <div className="mt-4 pt-4 border-t border-[#2D0C4B]/30">
                <MenuItem 
                  icon={<div className="text-white text-md">⚙️</div>}
                  label="Connect Wallets" 
                  onClick={() => {}} 
                />
                <div className="mt-3 border border-[#2D0C4B]/50 rounded-lg p-3 flex justify-center">
                  <div className="text-white text-sm">📄</div>
                </div>
              </div>
            </div>
          )}

          {/* More Resources Menu */}
          {currentMenu === "more-resources" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <MenuItem 
                  icon={<div className="text-white text-md">📊</div>}
                  label="Tokenomics" 
                  href="/tokenomics"
                  circleStyle
                />
                <MenuItem 
                  icon={<div className="text-white text-md">📄</div>}
                  label="Whitepaper" 
                  href="/whitepaper"
                  circleStyle
                />
                <MenuItem 
                  icon={<div className="text-white text-md">🔧</div>}
                  label="Technical Spec" 
                  href="/technical-spec"
                  circleStyle
                />
                <MenuItem 
                  icon={<div className="text-white text-md">📝</div>}
                  label="Smart Contracts" 
                  href="/smart-contracts"
                  circleStyle
                />
                <MenuItem 
                  icon={<div className="text-white text-md">🛣️</div>}
                  label="Roadmap" 
                  href="/roadmap"
                  circleStyle
                />
                <MenuItem 
                  icon={<div className="text-white text-md">👥</div>}
                  label="Team" 
                  href="/team"
                  circleStyle
                />
                <MenuItem 
                  icon={<div className="text-white text-md">📑</div>}
                  label="Docs" 
                  href="/docs"
                  circleStyle
                />
                <MenuItem 
                  icon={<div className="text-white text-md">❓</div>}
                  label="FAQ" 
                  href="/faq"
                  circleStyle
                />
                <MenuItem 
                  icon={<div className="text-white text-md">ℹ️</div>}
                  label="About" 
                  href="/about"
                  circleStyle
                />
              </div>
              
              <div className="mt-4 pt-4 border-t border-[#2D0C4B]/30">
                <MenuItem 
                  icon={<div className="text-white text-md">⚙️</div>}
                  label="Connect Wallets" 
                  onClick={() => {}} 
                />
                <div className="mt-3 border border-[#2D0C4B]/50 rounded-lg p-3 flex justify-center">
                  <div className="text-white text-sm">📄</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;