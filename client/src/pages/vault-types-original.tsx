import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Shield, Lock, Cpu, Clock, Fingerprint, Globe, Key, BarChart4, Landmark, FileCode, Image, Database, ChevronsRight } from 'lucide-react';
import { useTon } from '@/contexts/ton-context';
import { useEthereum } from '@/contexts/ethereum-context';
import { useSolana } from '@/contexts/solana-context';
import { useCVTToken } from '@/contexts/cvt-token-context';

const VAULT_TYPES = [
  {
    id: "sovereign-fortress",
    name: "Sovereign Fortress Vault™",
    description: "Ultimate all-in-one vault with supreme security & flexibility",
    icon: "👑",
    color: "#6B00D7",
    features: ["Adaptive Multi-Layered Security", "Quantum-Resistant Encryption", "Triple-Chain Protection System", "Instant Disaster Recovery"],
    securityLevel: 5,
    complexityLevel: 3,
    tags: ["Triple-Chain", "Zero-Knowledge", "Advanced Security", "Quantum-Resistant"]
  },
  {
    id: "multi-signature",
    name: "Multi-Signature Vault",
    description: "Our advanced implementation with Triple-Chain security",
    icon: "🔐",
    color: "#FF5AF7",
    features: ["Triple-Chain verification", "Hardware key authentication", "Advanced transaction signing", "Biometric security options"],
    securityLevel: 5,
    complexityLevel: 3,
    tags: ["Triple-Chain", "Zero-Knowledge", "Advanced Security"]
  },
  {
    id: "biometric",
    name: "Biometric Vault",
    description: "Secure with fingerprint or facial recognition",
    icon: "👆",
    color: "#00D7C3",
    features: ["Fingerprint verification", "Facial recognition options", "Multi-factor authentication", "Tamper-proof security"],
    securityLevel: 4,
    complexityLevel: 2,
    tags: ["Advanced Security"]
  },
  {
    id: "time-lock",
    name: "Advanced Time-Lock",
    description: "Schedule complex time-based unlocking",
    icon: "⏱️",
    color: "#D76B00",
    features: ["Scheduled unlocking periods", "Multiple time conditions", "Calendar-based scheduling", "Emergency override options"],
    securityLevel: 4,
    complexityLevel: 3,
    tags: ["Triple-Chain", "Zero-Knowledge", "Advanced Security"]
  },
  {
    id: "geolocation",
    name: "Geolocation Vault",
    description: "Access only from specific locations",
    icon: "📍",
    color: "#00D74B",
    features: ["Location-based access", "Multiple safe zones", "GPS verification", "Travel permissions"],
    securityLevel: 4,
    complexityLevel: 3,
    tags: ["Triple-Chain", "Zero-Knowledge", "Advanced Security"]
  },
  {
    id: "cross-chain",
    name: "Cross-Chain Verification",
    description: "Verify assets across multiple blockchains",
    icon: "⛓️",
    color: "#8B00D7",
    features: ["Triple-Chain Security", "Cross-chain verification protocols", "Multi-network validation", "Unified security monitoring"],
    securityLevel: 5,
    complexityLevel: 4,
    tags: ["Triple-Chain", "Zero-Knowledge", "Advanced Security"]
  },
  {
    id: "smart-contract",
    name: "Smart Contract Vault",
    description: "Automated rules and conditions",
    icon: "📜",
    color: "#5271FF",
    features: ["Conditional access rules", "Automated actions", "Event-based triggers", "Custom logic implementation"],
    securityLevel: 4,
    complexityLevel: 5,
    tags: ["Advanced Security"]
  },
  {
    id: "dynamic",
    name: "Dynamic Vault",
    description: "Adapt to market or user behavior",
    icon: "📊",
    color: "#FF5151",
    features: ["Behavioral adaptability", "Market response strategies", "Self-adjusting security", "Custom security settings"],
    securityLevel: 4,
    complexityLevel: 5,
    tags: ["Advanced Security"]
  },
  {
    id: "nft-powered",
    name: "NFT-Powered Vault",
    description: "Use NFTs as access keys to your vault",
    icon: "🖼️",
    color: "#CE19FF",
    features: ["NFT access verification", "Transferable vault access", "Digital collectible integration", "NFT-based permissions"],
    securityLevel: 4,
    complexityLevel: 3,
    tags: ["Triple-Chain", "Advanced Security"]
  },
  {
    id: "unique",
    name: "Unique Security Vault",
    description: "Enhanced security with custom protocols",
    icon: "🛡️",
    color: "#fca103",
    features: ["Zero-Knowledge Privacy Layer", "Military-grade encryption", "Quantum-resistant protocols", "Custom security combinations"],
    securityLevel: 5,
    complexityLevel: 4,
    tags: ["Triple-Chain", "Zero-Knowledge", "Advanced Security"]
  },
  {
    id: "ai-intent-inheritance",
    name: "AI Intent Inheritance Vault",
    description: "Natural language inheritance planning",
    icon: "🧠",
    color: "#9E00FF",
    features: ["Express intent in plain language", "AI-powered smart contract generation", "Conditional inheritance rules", "Adaptable to complex real-world scenarios"],
    securityLevel: 5,
    complexityLevel: 3,
    tags: ["Triple-Chain", "Zero-Knowledge", "Advanced Security"]
  },
  {
    id: "memory-vault",
    name: "Time-Locked Memory Vault",
    description: "Digital assets with multimedia memories",
    icon: "📦",
    color: "#FF3A8C",
    features: ["Combined assets and personal media", "Photos, videos and messages storage", "Synchronized unlocking on future date", "Perfect for gifts and personal time capsules"],
    securityLevel: 4,
    complexityLevel: 3,
    tags: ["Triple-Chain", "Zero-Knowledge", "Advanced Security"]
  },
  {
    id: "quantum-resistant",
    name: "Quantum-Resistant Vault",
    description: "Progressive security that scales with value",
    icon: "🔒",
    color: "#00B8FF",
    features: ["Auto-scaling security tiers", "Post-quantum cryptography", "Value-based security enforcement", "Adaptive security protocols"],
    securityLevel: 5,
    complexityLevel: 4,
    tags: ["Triple-Chain", "Zero-Knowledge", "Advanced Security", "Quantum-Resistant"]
  },
  {
    id: "composite-vault",
    name: "Cross-Chain Fragment Vault",
    description: "Splits your assets across multiple blockchains",
    icon: "🧩",
    color: "#00E5A0",
    features: ["Asset splitting across chains", "Multiple blockchain storage", "Fragmented recovery system", "Protection from single-chain failures"],
    securityLevel: 5, 
    complexityLevel: 5,
    tags: ["Triple-Chain", "Zero-Knowledge", "Advanced Security"]
  },
  {
    id: "geo-temporal",
    name: "Location-Time Restricted Vault",
    description: "Access only at specific locations during set times",
    icon: "🌎",
    color: "#47A0FF",
    features: ["Dual verification: location + time window", "Physical presence requirement", "Scheduled access periods", "Perfect for location-sensitive business assets"],
    securityLevel: 5,
    complexityLevel: 4,
    tags: ["Triple-Chain", "Zero-Knowledge", "Advanced Security"]
  },
  {
    id: "diamond-hands",
    name: "Investment Discipline Vault",
    description: "Prevents emotional selling during market volatility",
    icon: "💎",
    color: "#3F51FF",
    features: ["Programmable exit conditions", "Market event-based triggers", "Time-locked investment periods", "Protection from panic-selling"],
    securityLevel: 4,
    complexityLevel: 3,
    tags: ["Triple-Chain", "Zero-Knowledge", "Advanced Security"]
  }
];

const VAULT_CATEGORIES = [
  {
    id: "specialized",
    name: "Specialized Vaults",
    color: "#FF5AF7",
    description: "Advanced vault types with unique security features and specialized functionality",
    vaultTypes: ["ai-intent-inheritance", "geolocation", "smart-contract", "nft-powered", "dynamic"]
  },
  {
    id: "advanced-security",
    name: "Advanced Security",
    color: "#9E00FF",
    description: "Enhanced protection with multiple verification layers and distributed security",
    vaultTypes: ["multi-signature", "biometric", "cross-chain"]
  },
  {
    id: "basic-time",
    name: "Basic Time Vaults",
    color: "#00D7C3",
    description: "Simple and reliable time-locked storage with essential security features",
    vaultTypes: ["time-lock", "sovereign-fortress", "diamond-hands"]
  }
];

// Step indicator component
const StepIndicator = () => {
  return (
    <div className="flex items-center justify-center my-6">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-[#6B00D7] flex items-center justify-center">
          <Cpu className="w-5 h-5 text-white" />
        </div>
        <div className="h-1 w-14 bg-[#333339]"></div>
        <div className="w-10 h-10 rounded-full bg-[#333339] flex items-center justify-center">
          <Database className="w-5 h-5 text-gray-300" />
        </div>
        <div className="h-1 w-14 bg-[#333339]"></div>
        <div className="w-10 h-10 rounded-full bg-[#333339] flex items-center justify-center">
          <Shield className="w-5 h-5 text-gray-300" />
        </div>
        <div className="h-1 w-14 bg-[#333339]"></div>
        <div className="w-10 h-10 rounded-full bg-[#333339] flex items-center justify-center">
          <Clock className="w-5 h-5 text-gray-300" />
        </div>
        <div className="h-1 w-14 bg-[#333339]"></div>
        <div className="w-10 h-10 rounded-full bg-[#333339] flex items-center justify-center">
          <FileCode className="w-5 h-5 text-gray-300" />
        </div>
      </div>
    </div>
  );
};

// Premium features section component
const PremiumFeatures = () => {
  return (
    <div className="bg-[#2A1143] rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-3">All Vaults Include Premium Features</h2>
      <p className="text-gray-300 mb-6">
        Every vault type includes our revolutionary technologies, making Chronos Vault the most 
        secure solution in the world - accessible to everyone, with no blockchain knowledge required.
      </p>
      
      <div className="space-y-4">
        <div className="flex items-start">
          <div className="w-6 h-6 rounded-full bg-[#6B00D7]/20 flex items-center justify-center">
            <Shield className="h-3.5 w-3.5 text-[#6B00D7]" />
          </div>
          <div className="ml-3">
            <h3 className="font-medium text-white">Triple-Chain Security</h3>
            <p className="text-sm text-gray-300">Distributes security across Ethereum, Solana, and TON for unmatched protection</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="w-6 h-6 rounded-full bg-[#FF5AF7]/20 flex items-center justify-center">
            <Database className="h-3.5 w-3.5 text-[#FF5AF7]" />
          </div>
          <div className="ml-3">
            <h3 className="font-medium text-white">Cross-Chain Compatibility</h3>
            <p className="text-sm text-gray-300">Store and access your assets across multiple blockchain networks</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="w-6 h-6 rounded-full bg-[#00D7C3]/20 flex items-center justify-center">
            <Key className="h-3.5 w-3.5 text-[#00D7C3]" />
          </div>
          <div className="ml-3">
            <h3 className="font-medium text-white">CVT Token Discounts</h3>
            <p className="text-sm text-gray-300">Hold CVT tokens for reduced fees - stake ETH, SOL, or BTC with staking discounts</p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface VaultCardProps {
  vault: typeof VAULT_TYPES[0];
  isSelected: boolean;
  onSelect: () => void;
}

// Vault card component
const VaultCard = ({ vault, isSelected, onSelect }: VaultCardProps) => {
  return (
    <motion.div 
      className={`p-5 rounded-lg cursor-pointer border ${
        isSelected 
          ? 'bg-black/40 border-[' + vault.color + ']' 
          : 'bg-black/20 border-gray-800 hover:border-gray-700'
      }`}
      onClick={onSelect}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center mr-3 text-2xl">
          {vault.icon}
        </div>
        <div>
          <h3 className="font-medium text-white">{vault.name}</h3>
          <p className="text-sm text-gray-400">{vault.description}</p>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-1.5 mb-3">
        {vault.tags.map((tag: string, i: number) => (
          <span 
            key={i}
            className={`text-xs px-2 py-0.5 rounded-full ${
              tag === 'Triple-Chain' ? 'bg-[#6B00D7]/20 text-[#9E00FF] border border-[#6B00D7]/30' :
              tag === 'Zero-Knowledge' ? 'bg-[#FF5AF7]/20 text-[#FF5AF7] border border-[#FF5AF7]/30' :
              tag === 'Advanced Security' ? 'bg-[#00D7C3]/20 text-[#00D7C3] border border-[#00D7C3]/30' :
              'bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30'
            }`}
          >
            {tag}
          </span>
        ))}
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-400">Security</span>
            <span className="text-xs" style={{ color: vault.color }}>{vault.securityLevel}/5</span>
          </div>
          <div className="w-full h-1.5 bg-gray-900 rounded overflow-hidden">
            <div 
              className="h-full" 
              style={{
                width: `${(vault.securityLevel / 5) * 100}%`,
                backgroundColor: vault.color,
                opacity: 0.7
              }}
            />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-400">Complexity</span>
            <span className="text-xs text-amber-500">{vault.complexityLevel}/5</span>
          </div>
          <div className="w-full h-1.5 bg-gray-900 rounded overflow-hidden">
            <div 
              className="h-full bg-amber-500"
              style={{
                width: `${(vault.complexityLevel / 5) * 100}%`,
                opacity: 0.7
              }}
            />
          </div>
        </div>
      </div>
      
      <h4 className="text-xs font-semibold text-gray-300 mb-2">Key Features:</h4>
      <ul className="grid grid-cols-1 gap-1.5">
        {vault.features.slice(0, 4).map((feature: string, i: number) => (
          <li key={i} className="flex items-start">
            <span className="inline-block w-2 h-2 rounded-full mt-1.5 mr-2" style={{ backgroundColor: vault.color }}></span>
            <span className="text-xs text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
      
      {isSelected && (
        <div className="mt-3 text-xs text-center">
          <span className="inline-flex items-center text-green-400">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
              <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18457 2.99721 7.13633 4.39828 5.49707C5.79935 3.85782 7.69279 2.71538 9.79619 2.24015C11.8996 1.76491 14.1003 1.98234 16.07 2.86" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Selected
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default function VaultTypesOriginal() {
  const [_, navigate] = useLocation();
  const [selectedVaultType, setSelectedVaultType] = useState<string>('sovereign-fortress');
  const ton = useTon();
  const ethereum = useEthereum();
  const solana = useSolana();
  const cvtToken = useCVTToken();
  
  const handleVaultSelect = (id: string) => {
    setSelectedVaultType(id);
  };
  
  const handleContinue = () => {
    // Direct navigation to the specialized vault pages
    if (selectedVaultType === 'ai-intent-inheritance') {
      navigate('/intent-inheritance-vault');
    } else if (selectedVaultType === 'cross-chain') {
      navigate('/cross-chain-vault');
    } else if (selectedVaultType === 'multi-signature') {
      navigate('/multi-signature-vault');
    } else if (selectedVaultType === 'biometric') {
      navigate('/biometric-vault');
    } else if (selectedVaultType === 'geolocation') {
      navigate('/geo-vault');
    } else if (selectedVaultType === 'memory-vault') {
      navigate('/specialized-vault-memory');
    } else if (selectedVaultType === 'diamond-hands') {
      navigate('/investment-discipline-vault');
    } else if (selectedVaultType === 'quantum-resistant') {
      navigate('/quantum-vault');
    } else {
      // Use create-vault-enhanced which already has the TON integration
      navigate(`/create-vault-enhanced?type=${selectedVaultType}`);
    }
  };
  
  const selectedVault = VAULT_TYPES.find(vault => vault.id === selectedVaultType);
  
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="px-4 py-8 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-[#6B00D7]">Choose Your Vault Type</h1>
        </div>
        <p className="text-gray-400 mb-6">
          Select the type of vault that best fits your security needs
        </p>
        
        <button 
          onClick={() => navigate('/my-vaults')}
          className="flex items-center text-gray-400 mb-6 text-sm focus:outline-none"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to My Vaults
        </button>
        
        <StepIndicator />
        
        {/* Premium Features Box */}
        <PremiumFeatures />
        
        {/* Vault Categories */}
        <div className="space-y-6 mb-8">
          {VAULT_CATEGORIES.map(category => (
            <div key={category.id} className="bg-[#2A1143] rounded-lg p-5">
              <h3 className="text-xl font-semibold mb-2" style={{ color: category.color }}>
                {category.name}
              </h3>
              <p className="text-sm text-gray-300 mb-3">{category.description}</p>
              <ul className="space-y-1">
                {category.vaultTypes.map(typeId => {
                  const vault = VAULT_TYPES.find(v => v.id === typeId);
                  return vault ? (
                    <li key={typeId} className="text-sm text-gray-200">• {vault.name}</li>
                  ) : null;
                })}
              </ul>
            </div>
          ))}
        </div>
        
        <h2 className="text-xl font-bold mb-4">Select Your Vault Type</h2>
        <p className="text-sm text-gray-300 mb-6">
          Explore our 16 specialized vault types with unique features and security levels
        </p>
        
        {/* Vault Selection Grid */}
        <div className="space-y-4">
          {VAULT_TYPES.map(vault => (
            <VaultCard 
              key={vault.id} 
              vault={vault} 
              isSelected={selectedVaultType === vault.id}
              onSelect={() => handleVaultSelect(vault.id)}
            />
          ))}
        </div>
        
        {/* Fortress Security Section */}
        <div className="bg-[#1c0c31] rounded-lg p-5 mt-8 mb-6">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center mr-2 text-xl">
              ⭐
            </div>
            <h3 className="text-lg font-semibold text-[#FF5AF7]">Sovereign Fortress™ Security</h3>
          </div>
          <p className="text-sm text-gray-300 mb-3">Configure quantum-resistant security protocols for your vault</p>
          <button className="flex items-center text-sm text-[#FF5AF7] border border-[#FF5AF7]/30 rounded-lg px-4 py-2 w-full justify-center focus:outline-none">
            <Lock className="w-4 h-4 mr-2" />
            Configure Security
            <ChevronsRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        
        {/* Triple-Chain Security Section */}
        <div className="bg-[#1c0c31] rounded-lg p-5 mb-8">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center mr-2">
              <Shield className="w-4 h-4 text-[#6B00D7]" />
            </div>
            <h3 className="text-lg font-semibold text-[#6B00D7]">Triple-Chain Security Architecture</h3>
          </div>
          <p className="text-sm text-gray-300 mb-3">Distributes your vault security across Ethereum, Solana, and TON blockchains</p>
          <div className="flex items-center text-sm text-green-500">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
              <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18457 2.99721 7.13633 4.39828 5.49707C5.79935 3.85782 7.69279 2.71538 9.79619 2.24015C11.8996 1.76491 14.1003 1.98234 16.07 2.86" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Default for all vaults
          </div>
        </div>
        
        {/* Chain Integration Status */}
        <div className="bg-[#1c0c31] rounded-lg p-5 mb-8">
          <h3 className="text-lg font-semibold mb-3 text-white">Blockchain Integration Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-[#0098EA]/20 flex items-center justify-center mr-2">
                  <span className="text-xs text-[#0098EA]">💎</span>
                </div>
                <span className="text-sm text-gray-300">TON Network</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${ton.isConnected ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                {ton.isConnected ? 'Connected' : 'Ready to Connect'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-[#62688F]/20 flex items-center justify-center mr-2">
                  <span className="text-xs text-[#62688F]">⟠</span>
                </div>
                <span className="text-sm text-gray-300">Ethereum</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${ethereum.isConnected ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                {ethereum.isConnected ? 'Connected' : 'Ready to Connect'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-[#9945FF]/20 flex items-center justify-center mr-2">
                  <span className="text-xs text-[#9945FF]">◎</span>
                </div>
                <span className="text-sm text-gray-300">Solana</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${solana.isConnected ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                {solana.isConnected ? 'Connected' : 'Ready to Connect'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-[#6B00D7]/20 flex items-center justify-center mr-2">
                  <span className="text-xs text-[#6B00D7]">🔒</span>
                </div>
                <span className="text-sm text-gray-300">CVT Token</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${parseFloat(cvtToken?.tokenBalance || '0') > 0 ? 'bg-green-900/30 text-green-400' : 'bg-gray-900/30 text-gray-400'}`}>
                {parseFloat(cvtToken?.tokenBalance || '0') > 0 ? `${cvtToken?.tokenBalance} CVT` : 'Not Required'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Continue Button */}
        <div className="flex justify-end mb-12">
          <span className="text-xs text-gray-500 mr-auto mt-3">* Selection required to continue</span>
          <button 
            onClick={handleContinue}
            className="bg-[#6B00D7] hover:bg-[#7900F5] text-white px-5 py-2.5 rounded-md flex items-center"
          >
            Continue with {selectedVault?.name || 'Selected Vault'}
            <ChevronsRight className="ml-1 w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}