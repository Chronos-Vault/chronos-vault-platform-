import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Shield, 
  Lock
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { motion } from 'framer-motion';

// Define all our vault types with full details
const VAULT_TYPES = [
  {
    id: 'standard',
    title: 'Sovereign Fortress Vault™',
    description: 'Ultimate all-in-one vault with supreme security & flexibility',
    icon: '👑',
    color: '#6B00D7',
    securityLevel: 5,
    complexityLevel: 3,
    features: [
      "Adaptive Multi-Layered Security",
      "Quantum-Resistant Encryption",
      "Triple-Chain Protection System",
      "Instant Disaster Recovery"
    ],
    tags: ['Triple-Chain', 'Zero-Knowledge', 'Advanced Security', 'Quantum-Resistant']
  },
  {
    id: 'multi-signature',
    title: 'Multi-Signature Vault',
    description: 'Our advanced implementation with Triple-Chain security',
    icon: '🔐',
    color: '#FF5AF7',
    securityLevel: 5,
    complexityLevel: 3,
    features: [
      "Triple-Chain verification",
      "Hardware key authentication",
      "Advanced transaction signing",
      "Biometric security options"
    ],
    tags: ['Triple-Chain', 'Zero-Knowledge', 'Advanced Security']
  },
  {
    id: 'biometric',
    title: 'Biometric Vault',
    description: 'Secure with fingerprint or facial recognition',
    icon: '👆',
    color: '#3F51B5',
    securityLevel: 4,
    complexityLevel: 2,
    features: [
      "Fingerprint verification",
      "Facial recognition options",
      "Multi-factor authentication",
      "Tamper-proof security"
    ],
    tags: ['Advanced Security']
  },
  {
    id: 'time-lock',
    title: 'Advanced Time-Lock',
    description: 'Schedule complex time-based unlocking',
    icon: '⏱️',
    color: '#FF9800',
    securityLevel: 4,
    complexityLevel: 3,
    features: [
      "Scheduled unlocking periods",
      "Multiple time conditions",
      "Calendar-based scheduling",
      "Emergency override options"
    ],
    tags: ['Triple-Chain', 'Zero-Knowledge', 'Advanced Security']
  },
  {
    id: 'geo-location',
    title: 'Geolocation Vault',
    description: 'Access only from specific locations',
    icon: '📍',
    color: '#4CAF50',
    securityLevel: 4,
    complexityLevel: 3,
    features: [
      "Location-based access",
      "Multiple safe zones",
      "GPS verification",
      "Travel permissions"
    ],
    tags: ['Triple-Chain', 'Zero-Knowledge', 'Advanced Security']
  },
  {
    id: 'cross-chain',
    title: 'Cross-Chain Verification',
    description: 'Verify assets across multiple blockchains',
    icon: '⛓️',
    color: '#2196F3',
    securityLevel: 5,
    complexityLevel: 4,
    features: [
      "Triple-Chain Security",
      "Cross-chain verification protocols",
      "Multi-network validation",
      "Unified security monitoring"
    ],
    tags: ['Triple-Chain', 'Zero-Knowledge', 'Advanced Security']
  },
  {
    id: 'smart-contract',
    title: 'Smart Contract Vault',
    description: 'Automated rules and conditions',
    icon: '📜',
    color: '#673AB7',
    securityLevel: 4,
    complexityLevel: 5,
    features: [
      "Conditional access rules",
      "Automated actions",
      "Event-based triggers",
      "Custom logic implementation"
    ],
    tags: ['Advanced Security']
  },
  {
    id: 'dynamic',
    title: 'Dynamic Vault',
    description: 'Adapt to market or user behavior',
    icon: '📊',
    color: '#009688',
    securityLevel: 4,
    complexityLevel: 5,
    features: [
      "Behavioral adaptability",
      "Market response strategies",
      "Self-adjusting security",
      "Custom security settings"
    ],
    tags: ['Advanced Security']
  },
  {
    id: 'nft-powered',
    title: 'NFT-Powered Vault',
    description: 'Use NFTs as access keys to your vault',
    icon: '🖼️',
    color: '#9C27B0',
    securityLevel: 4,
    complexityLevel: 3,
    features: [
      "NFT access verification",
      "Transferable vault access",
      "Digital collectible integration",
      "NFT-based permissions"
    ],
    tags: ['Triple-Chain', 'Advanced Security']
  },
  {
    id: 'unique-security',
    title: 'Unique Security Vault',
    description: 'Enhanced security with custom protocols',
    icon: '🛡️',
    color: '#F44336',
    securityLevel: 5,
    complexityLevel: 4,
    features: [
      "Zero-Knowledge Privacy Layer",
      "Military-grade encryption",
      "Quantum-resistant protocols",
      "Custom security combinations"
    ],
    tags: ['Triple-Chain', 'Zero-Knowledge', 'Advanced Security']
  },
  {
    id: 'ai-intent',
    title: 'AI Intent Inheritance Vault',
    description: 'Natural language inheritance planning',
    icon: '🧠',
    color: '#00BCD4',
    securityLevel: 5,
    complexityLevel: 3,
    features: [
      "Express intent in plain language",
      "AI-powered smart contract generation",
      "Conditional inheritance rules",
      "Adaptable to complex real-world scenarios"
    ],
    tags: ['Triple-Chain', 'Zero-Knowledge', 'Advanced Security']
  },
  {
    id: 'time-locked-memory',
    title: 'Time-Locked Memory Vault',
    description: 'Digital assets with multimedia memories',
    icon: '📦',
    color: '#CDDC39',
    securityLevel: 4,
    complexityLevel: 3,
    features: [
      "Combined assets and personal media",
      "Photos, videos and messages storage",
      "Synchronized unlocking on future date",
      "Perfect for gifts and personal time capsules"
    ],
    tags: ['Triple-Chain', 'Zero-Knowledge', 'Advanced Security']
  },
  {
    id: 'quantum-resistant',
    title: 'Quantum-Resistant Vault',
    description: 'Progressive security that scales with value',
    icon: '🔒',
    color: '#9C27B0',
    securityLevel: 5,
    complexityLevel: 4,
    features: [
      "Auto-scaling security tiers",
      "Post-quantum cryptography",
      "Value-based security enforcement",
      "Adaptive security protocols"
    ],
    tags: ['Triple-Chain', 'Zero-Knowledge', 'Advanced Security', 'Quantum-Resistant']
  },
  {
    id: 'cross-chain-fragment',
    title: 'Cross-Chain Fragment Vault',
    description: 'Splits your assets across multiple blockchains',
    icon: '🧩',
    color: '#3F51B5',
    securityLevel: 5,
    complexityLevel: 5,
    features: [
      "Asset splitting across chains",
      "Multiple blockchain storage",
      "Fragmented recovery system",
      "Protection from single-chain failures"
    ],
    tags: ['Triple-Chain', 'Zero-Knowledge', 'Advanced Security']
  },
  {
    id: 'location-time',
    title: 'Location-Time Restricted Vault',
    description: 'Access only at specific locations during set times',
    icon: '🌎',
    color: '#4CAF50',
    securityLevel: 5,
    complexityLevel: 4,
    features: [
      "Dual verification: location + time window",
      "Physical presence requirement",
      "Scheduled access periods",
      "Perfect for location-sensitive business assets"
    ],
    tags: ['Triple-Chain', 'Zero-Knowledge', 'Advanced Security']
  },
  {
    id: 'investment-discipline',
    title: 'Investment Discipline Vault',
    description: 'Prevents emotional selling during market volatility',
    icon: '💎',
    color: '#2196F3',
    securityLevel: 4,
    complexityLevel: 3,
    features: [
      "Programmable exit conditions",
      "Market event-based triggers",
      "Time-locked investment periods",
      "Protection from panic-selling"
    ],
    tags: ['Triple-Chain', 'Zero-Knowledge', 'Advanced Security']
  },
  {
    id: 'ai-assisted',
    title: 'AI-Assisted Investment Vault',
    description: 'AI-powered market analysis for optimal trading',
    icon: '🤖',
    color: '#00BCD4',
    securityLevel: 5,
    complexityLevel: 4,
    features: [
      "AI market trend analysis",
      "Smart trading suggestions",
      "Customizable investment strategies",
      "Automated risk assessment"
    ],
    tags: ['Triple-Chain', 'Zero-Knowledge', 'Advanced Security', 'AI-Powered']
  },
  {
    id: 'milestone',
    title: 'Milestone-Based Release Vault',
    description: 'Unlocks assets when you achieve personal goals',
    icon: '🏆',
    color: '#FF9800',
    securityLevel: 4,
    complexityLevel: 3,
    features: [
      "Achievement-based unlocking",
      "Progressive asset release",
      "Customizable goal verification",
      "Reward system integration"
    ],
    tags: ['Triple-Chain', 'Zero-Knowledge', 'Advanced Security']
  },
  {
    id: 'family-heritage',
    title: 'Family Heritage Vault',
    description: 'Secure generational wealth transfer with education',
    icon: '👪',
    color: '#795548',
    securityLevel: 5,
    complexityLevel: 4,
    features: [
      "Multi-generational planning",
      "Educational content integration",
      "Gradual inheritance mechanism",
      "Family governance protocols"
    ],
    tags: ['Triple-Chain', 'Zero-Knowledge', 'Advanced Security', 'Quantum-Resistant']
  },
  {
    id: 'bitcoin-halving',
    title: 'Bitcoin Halving Vault',
    description: 'Optimized for Bitcoin halving cycle investment strategy',
    icon: '₿',
    color: '#F7931A',
    securityLevel: 5,
    complexityLevel: 3,
    features: [
      "Bitcoin halving cycle optimization",
      "Automatic rebalancing",
      "Long-term value preservation",
      "Halving event-triggered actions"
    ],
    tags: ['Bitcoin', 'Investment', 'Advanced Security']
  },
  {
    id: 'gift-crypto',
    title: 'Gift Crypto Vault',
    description: 'Create memorable crypto gifts for special occasions',
    icon: '🎁',
    color: '#E91E63',
    securityLevel: 3,
    complexityLevel: 1,
    features: [
      "Personalized crypto gifts",
      "Customizable gift messages",
      "Special occasion scheduling",
      "Beginner-friendly interface"
    ],
    tags: ['Gift', 'Beginner-Friendly', 'Time-Based']
  },
  {
    id: 'behavioral-auth',
    title: 'Behavioral Authentication Vault',
    description: 'Secure with AI-powered behavioral biometrics',
    icon: '🔍',
    color: '#607D8B',
    securityLevel: 5,
    complexityLevel: 3,
    features: [
      "Pattern recognition security",
      "Continuous authentication",
      "Anomaly detection",
      "Fraud prevention system"
    ],
    tags: ['AI-Powered', 'Biometrics', 'Advanced Security']
  }
];

// VaultCard component for displaying vault information - enhanced design with more prominent visuals
const VaultCard = ({ vault, selected, onClick }: { vault: any; selected: boolean; onClick: () => void }) => {
  const { title, description, icon, color, features, tags } = vault;
  
  return (
    <motion.div 
      className={`relative rounded-xl overflow-hidden transition-all duration-500 cursor-pointer ${
        selected 
          ? 'bg-gradient-to-br from-black/80 via-[#2A0058]/80 to-black/80 border-2 shadow-lg shadow-[#6B00D7]/40' 
          : 'bg-gradient-to-br from-black/90 to-black/70 border border-gray-800 hover:border-gray-700'
      }`}
      style={{ borderColor: selected ? color : undefined }}
      onClick={onClick}
      whileHover={{ 
        y: -8, 
        boxShadow: `0 10px 25px -5px ${color}30, 0 8px 10px -6px ${color}20` 
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      {/* Header with color bar */}
      <div 
        className="h-2 w-full"
        style={{ backgroundColor: color }}
      />
      
      <div className="p-6">
        {/* Icon and Title */}
        <div className="flex items-start mb-4">
          <div 
            className="text-3xl mr-4 w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${color}20` }}
          >
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white leading-tight">{title}</h3>
            <div className="text-sm text-gray-300 mt-1">{description}</div>
          </div>
        </div>
        
        {/* Security Level - Always visible */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <div className="text-xs uppercase tracking-wider text-gray-400">Security Level</div>
            <span className="text-xs text-white font-bold px-2 py-1 rounded-full" 
                  style={{ backgroundColor: color }}>
              {vault.securityLevel}/5
            </span>
          </div>
          <div className="flex items-center">
            {Array(5).fill(0).map((_, i) => (
              <div 
                key={i} 
                className="h-1.5 rounded-full mr-1 flex-1" 
                style={{ 
                  backgroundColor: i < vault.securityLevel 
                    ? color
                    : 'rgba(255,255,255,0.1)'
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Tags - show only first 2 tags in non-selected state */}
        {!selected && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {tags.slice(0, 2).map(tag => (
              <span 
                key={tag} 
                className="inline-block px-2 py-1 text-xs rounded-md font-medium"
                style={{ backgroundColor: `${color}20`, color: `${color}` }}
              >
                {tag}
              </span>
            ))}
            {tags.length > 2 && (
              <span className="inline-block px-2 py-1 text-xs rounded-md bg-black/30 text-gray-400 font-medium">
                +{tags.length - 2} more
              </span>
            )}
          </div>
        )}
        
        {/* Selected state with features and create button */}
        {selected && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4"
          >
            {/* All tags in selected state */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {tags.map(tag => (
                <span 
                  key={tag} 
                  className="inline-block px-2 py-1 text-xs rounded-md font-medium"
                  style={{ backgroundColor: `${color}20`, color: `${color}` }}
                >
                  {tag}
                </span>
              ))}
            </div>
            
            {/* Features */}
            <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Key Features</div>
            <ul className="space-y-2 mb-6">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-start text-sm text-white">
                  <Check className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" style={{ color }} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            {/* Create button */}
            <Button 
              className="w-full bg-[#6B00D7] hover:bg-[#5A00B8] text-white font-medium h-12 rounded-lg shadow-lg shadow-[#6B00D7]/30"
              onClick={(e) => {
                e.stopPropagation();
                // Map directly to the cutting-edge, fully developed vault form components
                const formRoutes = {
                  // Basic Vault Types (fully developed form components)
                  'standard': '/sovereign-fortress-vault',
                  'multi-signature': '/multi-signature-vault-new', 
                  'biometric': '/biometric-vault',
                  'enhanced-biometric': '/enhanced-biometric-vault',
                  'geo-location': '/geo-location-vault',
                  'time-lock': '/time-lock-vault',
                  'smart-contract': '/smart-contract-vault',
                  
                  // Advanced Vault Types (fully developed form components)
                  'cross-chain': '/cross-chain-vault',
                  'cross-chain-fragment': '/cross-chain-fragment-vault',
                  'quantum-resistant': '/quantum-resistant-vault',
                  'nft-powered': '/nft-powered-vault',
                  'unique-security': '/unique-security-vault',
                  'enhanced-smart-contract': '/enhanced-smart-contract-vault',
                  
                  // Specialized Vault Types (fully developed form components)
                  'ai-assisted-investment': '/ai-investment-vault', // Use the specialized AI vault form
                  'intent-inheritance': '/intent-inheritance-vault',
                  'time-locked-memory': '/specialized-vault-memory', // Use specialized memory vault component
                  'investment-discipline': '/investment-discipline-vault',
                  'bitcoin-halving': '/bitcoin-halving-vault',
                  'family-heritage': '/family-heritage-vault', // Remove -form suffix to use enhanced component
                  'dynamic': '/dynamic-vault-form',
                  
                  // Additional mappings for variant names (all point to fully developed forms)
                  'geo-temporal': '/geo-location-vault',
                  'investment-strategy': '/investment-discipline-vault',
                  'memory-vault': '/specialized-vault-memory', // Updated memory vault path
                  'quantum': '/quantum-resistant-vault',
                  'milestone-based': '/milestone-based-vault',
                  'milestone': '/milestone-based-vault',
                  'ai-investment': '/ai-investment-vault',
                  'composite-vault': '/cross-chain-fragment-vault',
                  'diamond-hands': '/investment-discipline-vault',
                  'ai-intent': '/ai-intent-inheritance-vault',
                  'ai-intent-inheritance': '/ai-intent-inheritance-vault',
                  'sovereign': '/sovereign-fortress-vault'
                };
                
                // Direct to fully developed form component that matches the vault type
                const route = formRoutes[vault.id] || '/dynamic-vault-form';
                
                console.log(`Routing vault ID ${vault.id} to ${route}`);
                // Force the navigation by directly navigating to the specific page
                if (vault.id === 'multi-signature') {
                  console.log('Force redirecting to multi-signature vault form');
                  window.location.href = '/multi-signature-vault-new';
                  return; // Stop execution to ensure redirect happens
                } else {
                  window.location.href = route;
                }
              }}
            >
              <Shield className="mr-2 h-4 w-4" />
              Create this Vault
            </Button>
          </motion.div>
        )}
      </div>
      
      {/* Selected indicator */}
      {selected && (
        <div 
          className="absolute -right-2 -top-2 w-8 h-8 rounded-full flex items-center justify-center shadow-xl"
          style={{ backgroundColor: color }}
        >
          <Check className="h-4 w-4 text-white" />
        </div>
      )}
    </motion.div>
  );
};

// Main component
const VaultTypesPage = () => {
  const [selected, setSelected] = useState(VAULT_TYPES[0].id);
  const [activeCategory, setActiveCategory] = useState('all');
  const [, navigate] = useLocation();
  
  const selectedVault = VAULT_TYPES.find(v => v.id === selected) || VAULT_TYPES[0];
  
  // Organize vaults into categories
  const vaultCategories = {
    all: {
      title: 'All Vaults',
      color: '#6B00D7',
      icon: '🏰',
      vaults: VAULT_TYPES
    },
    premium: {
      title: 'Premium',
      color: '#FF5AF7',
      icon: '👑',
      vaults: VAULT_TYPES.filter(v => v.securityLevel === 5)
    },
    security: {
      title: 'Security',
      color: '#4CAF50',
      icon: '🛡️',
      vaults: VAULT_TYPES.filter(v => 
        v.tags.includes('Zero-Knowledge') || 
        v.tags.includes('Advanced Security') ||
        v.tags.includes('Quantum-Resistant'))
    },
    investment: {
      title: 'Investment',
      color: '#00BCD4',
      icon: '💎',
      vaults: VAULT_TYPES.filter(v => 
        v.tags.includes('Investment') || 
        v.id === 'milestone' || 
        v.id === 'family-heritage' ||
        v.id === 'ai-assisted' ||
        v.id === 'bitcoin-halving' ||
        v.id === 'investment-discipline')
    },
    time: {
      title: 'Time-Based',
      color: '#FF9800',
      icon: '⏱️',
      vaults: VAULT_TYPES.filter(v => 
        v.id.includes('time') || 
        v.tags.includes('Time-Based'))
    },
    special: {
      title: 'Special',
      color: '#E91E63',
      icon: '✨',
      vaults: VAULT_TYPES.filter(v => 
        v.id === 'gift-crypto' || 
        v.id === 'nft-powered' ||
        v.id === 'behavioral-auth')
    }
  };
  
  // Get the current category vaults
  const currentVaults = vaultCategories[activeCategory]?.vaults || vaultCategories.all.vaults;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1F0C3D] via-[#1C0533] to-black text-white pb-16">
      {/* Background with grid pattern */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Static Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        {/* Deep purple gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#6B00D7]/30 to-transparent"></div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 pt-8 relative z-10">
        {/* Simple Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">
            Select Your Vault
          </h1>
          
          <Button
            variant="outline"
            className="text-white hover:text-white border border-[#6B00D7] bg-black/20"
            onClick={() => navigate('/my-vaults')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Vaults
          </Button>
        </div>

        {/* Feature Cards at the top */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-black/40 border border-[#6B00D7]/30 rounded-xl p-5">
            <div className="flex items-start">
              <div className="mr-3 mt-1">
                {/* Triple Chain Icon - Three connected chains */}
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#FF5AF7]" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 8L3 12L7 16" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 12H3" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 16L21 12L17 8" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="21" cy="12" r="1" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="3" cy="12" r="1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Triple-Chain Security</h3>
                <p className="text-gray-300">Secures your assets across Ethereum, TON and Solana for unparalleled protection</p>
              </div>
            </div>
          </div>
          
          <div className="bg-black/40 border border-[#6B00D7]/30 rounded-xl p-5">
            <div className="flex items-start">
              <div className="mr-3 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-[#FF5AF7]"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">AI-Powered Intelligence</h3>
                <p className="text-gray-300">Smart security protocols that adapt to threats in real-time</p>
              </div>
            </div>
          </div>
        </div>

        {/* Vault Categories Tabs - Improved for mobile */}
        <div className="mb-8">
          <div className="text-lg font-medium mb-3 text-white">Select Vault Category:</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {Object.entries(vaultCategories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`flex items-center justify-center py-3 px-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeCategory === key 
                    ? 'bg-[#6B00D7] text-white shadow-lg' 
                    : 'bg-black/30 text-gray-300 border border-[#6B00D7]/20 hover:bg-black/40'
                }`}
              >
                <span className="mr-2 text-xl">{category.icon}</span>
                <span>{category.title}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Selected Category Title */}
        <div className="flex items-center mb-4">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center mr-3 text-xl"
            style={{ 
              backgroundColor: vaultCategories[activeCategory]?.color || '#6B00D7',
              color: 'white' 
            }}
          >
            {vaultCategories[activeCategory]?.icon}
          </div>
          <h2 className="text-2xl font-bold text-white">
            {vaultCategories[activeCategory]?.title || 'All Vaults'}
          </h2>
          <div className="ml-3 text-gray-400 text-sm">
            {currentVaults.length} vaults available
          </div>
        </div>
        
        {/* Vault Grid - optimized for mobile with improved spacing and performance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-2 sm:px-0 mx-auto">
          {currentVaults.map((vault) => (
            <VaultCard 
              key={vault.id}
              vault={vault}
              selected={selected === vault.id}
              onClick={() => setSelected(vault.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VaultTypesPage;