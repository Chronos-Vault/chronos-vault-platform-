import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { 
  Card, 
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Clock, ChevronsRight, Landmark, Users, Key, MapPin, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Icons for features and vault types
const TripleChainIcon = () => (
  <div className="w-6 h-6 rounded-full bg-[#6B00D7]/20 flex items-center justify-center">
    <Shield className="h-3.5 w-3.5 text-[#6B00D7]" />
  </div>
);

const CrossChainIcon = () => (
  <div className="w-6 h-6 rounded-full bg-[#FF5AF7]/20 flex items-center justify-center">
    <svg className="h-3.5 w-3.5 text-[#FF5AF7]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 20L16 4M8 4L16 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);

const CvtDiscountIcon = () => (
  <div className="w-6 h-6 rounded-full bg-[#00D7C3]/20 flex items-center justify-center">
    <svg className="h-3.5 w-3.5 text-[#00D7C3]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L15 8L21 9L17 14L18 20L12 17L6 20L7 14L3 9L9 8L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);

const StepIndicator = () => {
  return (
    <div className="flex items-center justify-center my-6">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-[#6B00D7] flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2V6M12 18V22M6 12H2M22 12H18M19.778 4.222L17 7M7 17L4.222 19.778M4.222 4.222L7 7M17 17L19.778 19.778" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="h-1 w-14 bg-[#333339]"></div>
        <div className="w-10 h-10 rounded-full bg-[#333339] flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6H20M4 12H20M4 18H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="h-1 w-14 bg-[#333339]"></div>
        <div className="w-10 h-10 rounded-full bg-[#333339] flex items-center justify-center">
          <Shield className="h-5 w-5 text-white" />
        </div>
        <div className="h-1 w-14 bg-[#333339]"></div>
        <div className="w-10 h-10 rounded-full bg-[#333339] flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 6V12L16 14M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="h-1 w-14 bg-[#333339]"></div>
        <div className="w-10 h-10 rounded-full bg-[#333339] flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 5H7C6.46957 5 5.96086 5.21071 5.58579 5.58579C5.21071 5.96086 5 6.46957 5 7V19C5 19.5304 5.21071 20.0391 5.58579 20.4142C5.96086 20.7893 6.46957 21 7 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V7C19 6.46957 18.7893 5.96086 18.4142 5.58579C18.0391 5.21071 17.5304 5 17 5H15M9 5C9 5.53043 9.21071 6.03914 9.58579 6.41421C9.96086 6.78929 10.4696 7 11 7H13C13.5304 7 14.0391 6.78929 14.4142 6.41421C14.7893 6.03914 15 5.53043 15 5M9 5C9 4.46957 9.21071 3.96086 9.58579 3.58579C9.96086 3.21071 10.4696 3 11 3H13C13.5304 3 14.0391 3.21071 14.4142 3.58579C14.7893 3.96086 15 4.46957 15 5M9 12H15M9 16H15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

// Main vault types list matching the design in screenshots
const VAULT_TYPES = [
  {
    id: "standard",
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
    name: "Biometric",
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
    name: "Geolocation",
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
    name: "Smart Contract",
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
    name: "Dynamic",
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
    name: "NFT-Powered",
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
    name: "Unique Security",
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
    name: "AI Intent Inheritance",
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
    name: "Quantum-Resistant",
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

// Group vaults by categories as shown in the screenshots
const VAULT_CATEGORIES = [
  {
    id: "specialized",
    name: "Specialized Vaults",
    description: "Advanced vault types with unique security features and specialized functionality",
    vaultTypes: ["ai-intent-inheritance", "geolocation", "smart-contract", "nft-powered", "dynamic"]
  },
  {
    id: "advanced-security",
    name: "Advanced Security",
    description: "Enhanced protection with multiple verification layers and distributed security",
    vaultTypes: ["multi-signature", "biometric", "cross-chain"]
  },
  {
    id: "basic-time",
    name: "Basic Time Vaults",
    description: "Simple and reliable time-locked storage with essential security features",
    vaultTypes: ["time-lock", "standard", "diamond-hands"]
  }
];

export default function VaultTypesNew() {
  const [_, navigate] = useLocation();
  const [selectedVaultType, setSelectedVaultType] = useState<string>('standard');
  
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
          className="flex items-center text-gray-400 mb-8 text-sm"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to My Vaults
        </button>
        
        <StepIndicator />
        
        {/* Premium Features Box */}
        <div className="bg-[#2A1143] rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-3">All Vaults Include Premium Features</h2>
          <p className="text-gray-300 mb-6">
            Every vault type includes our revolutionary technologies, making Chronos Vault the most 
            secure solution in the world - accessible to everyone, with no blockchain knowledge required.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <TripleChainIcon />
              <div className="ml-3">
                <h3 className="font-medium text-white">Triple-Chain Security</h3>
                <p className="text-sm text-gray-300">Distributes security across Ethereum, Solana, and TON for unmatched protection</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <CrossChainIcon />
              <div className="ml-3">
                <h3 className="font-medium text-white">Cross-Chain Compatibility</h3>
                <p className="text-sm text-gray-300">Store and access your assets across multiple blockchain networks</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <CvtDiscountIcon />
              <div className="ml-3">
                <h3 className="font-medium text-white">CVT Token Discounts</h3>
                <p className="text-sm text-gray-300">Hold CVT tokens for reduced fees - stake ETH, SOL, or BTC with staking discounts</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Vault Categories */}
        <div className="space-y-6 mb-8">
          {VAULT_CATEGORIES.map(category => (
            <div key={category.id} className={`bg-gradient-to-r ${
              category.id === 'specialized' ? 'from-[#2A1143] to-[#2F1157]' : 
              category.id === 'advanced-security' ? 'from-[#2A1143] to-[#2F1157]' : 
              'from-[#1E3D37] to-[#1E3D37]'
            } rounded-lg p-5`}>
              <h3 className={`text-xl font-semibold mb-2 ${
                category.id === 'specialized' ? 'text-[#FF5AF7]' : 
                category.id === 'advanced-security' ? 'text-[#9E00FF]' : 
                'text-[#00D7C3]'
              }`}>{category.name}</h3>
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
        
        {/* Vault Selection Grid - displaying the first few */}
        <div className="space-y-4 mb-6">
          {VAULT_TYPES.slice(0, 4).map(vault => (
            <div 
              key={vault.id}
              className={`p-5 rounded-lg cursor-pointer border ${
                selectedVaultType === vault.id 
                  ? 'bg-black/40 border-[' + vault.color + ']' 
                  : 'bg-black/20 border-gray-800 hover:border-gray-700'
              }`}
              onClick={() => handleVaultSelect(vault.id)}
            >
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center mr-3 text-2xl">
                  {vault.icon}
                </div>
                <div>
                  <h3 className="font-medium text-white">{vault.name}</h3>
                  <p className="text-sm text-gray-400">{vault.description}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1.5 mb-3">
                {vault.tags.map((tag, i) => (
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
              
              <h4 className="text-xs font-semibold text-gray-300 mb-1.5">Key Features:</h4>
              <ul className="grid grid-cols-1 gap-1.5">
                {vault.features.slice(0, 4).map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <span className="inline-block w-2 h-2 rounded-full mt-1.5 mr-2" style={{ backgroundColor: vault.color }}></span>
                    <span className="text-xs text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              
              {selectedVaultType === vault.id && (
                <div className="mt-2 text-xs text-center">
                  <span className="inline-flex items-center text-green-400">
                    <CheckCircle className="w-3 h-3 mr-1" /> Selected
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Fortress Security Section */}
        <div className="bg-[#1c0c31] rounded-lg p-5 mb-6">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center mr-2 text-xl">
              ⭐
            </div>
            <h3 className="text-lg font-semibold text-[#FF5AF7]">Sovereign Fortress™ Security</h3>
          </div>
          <p className="text-sm text-gray-300 mb-3">Configure quantum-resistant security protocols for your vault</p>
          <button className="flex items-center text-sm text-[#FF5AF7] border border-[#FF5AF7]/30 rounded-lg px-4 py-2 w-full justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
              <path d="M16 9V7C16 5.93913 15.5786 4.92172 14.8284 4.17157C14.0783 3.42143 13.0609 3 12 3C10.9391 3 9.92172 3.42143 9.17157 4.17157C8.42143 4.92172 8 5.93913 8 7V9M12 15V17M5 9H19C19.5304 9 20.0391 9.21071 20.4142 9.58579C20.7893 9.96086 21 10.4696 21 11V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V11C3 10.4696 3.21071 9.96086 3.58579 9.58579C3.96086 9.21071 4.46957 9 5 9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
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
            <CheckCircle className="w-4 h-4 mr-2" />
            Default for all vaults
          </div>
        </div>
        
        {/* Continue Button */}
        <div className="flex justify-end">
          <span className="text-xs text-gray-500 mr-auto">* Selection required to continue</span>
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