import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check, ShieldCheck, Sparkles, Clock } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SpecializedVaultType } from '@/components/vault/vault-type-selector';
import { motion } from 'framer-motion';

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
      "Instant Disaster Recovery",
      "Flexible Access Control Systems",
      "Customizable Security Protocols",
      "Intuitive Ownership Management" 
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
    tags: ['Triple-Chain', 'Zero-Knowledge', 'Advanced Security', 'Quantum-Resistant']
  },
  {
    id: 'biometric',
    title: 'Biometric',
    description: 'Secure with fingerprint or facial recognition',
    icon: '👆',
    color: '#00D7C3',
    securityLevel: 4,
    complexityLevel: 2,
    features: [
      "Fingerprint verification",
      "Facial recognition options",
      "Multi-factor authentication",
      "Tamper-proof security"
    ],
    tags: ['Triple-Chain', 'Zero-Knowledge', 'Advanced Security']
  },
  {
    id: 'time-lock',
    title: 'Advanced Time-Lock',
    description: 'Schedule complex time-based unlocking',
    icon: '⏱️',
    color: '#D76B00',
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
    id: 'geolocation',
    title: 'Geolocation',
    description: 'Access only from specific locations',
    icon: '📍',
    color: '#00D74B',
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
    color: '#8B00D7',
    securityLevel: 5,
    complexityLevel: 4,
    features: [
      "Triple-Chain Security", 
      "Cross-chain verification protocols",
      "Multi-network validation",
      "Unified security monitoring" 
    ],
    tags: ['Triple-Chain', 'Zero-Knowledge', 'Advanced Security', 'Quantum-Resistant']
  },
  {
    id: 'smart-contract',
    title: 'Smart Contract',
    description: 'Automated rules and conditions',
    icon: '📜',
    color: '#5271FF',
    securityLevel: 4,
    complexityLevel: 5,
    features: [
      "Conditional access rules", 
      "Automated actions",
      "Event-based triggers",
      "Custom logic implementation" 
    ],
    tags: ['Triple-Chain', 'Zero-Knowledge', 'Advanced Security']
  },
  {
    id: 'dynamic',
    title: 'Dynamic',
    description: 'Adapt to market or user behavior',
    icon: '📊',
    color: '#FF5151',
    securityLevel: 4,
    complexityLevel: 5,
    features: [
      "Behavioral adaptability", 
      "Market response strategies",
      "Self-adjusting security",
      "Custom security settings" 
    ],
    tags: ['Triple-Chain', 'Zero-Knowledge', 'Advanced Security']
  },
  {
    id: 'nft-powered',
    title: 'NFT-Powered',
    description: 'Use NFTs as access keys to your vault',
    icon: '🖼️',
    color: '#CE19FF',
    securityLevel: 4,
    complexityLevel: 3,
    features: [
      "NFT access verification", 
      "Transferable vault access",
      "Digital collectible integration",
      "NFT-based permissions" 
    ],
    tags: ['Triple-Chain', 'Zero-Knowledge', 'Advanced Security']
  },
  {
    id: 'unique',
    title: 'Unique Security',
    description: 'Enhanced security with custom protocols',
    icon: '🛡️',
    color: '#fca103',
    securityLevel: 5,
    complexityLevel: 4,
    features: [
      "Zero-Knowledge Privacy Layer", 
      "Military-grade encryption",
      "Quantum-resistant protocols",
      "Custom security combinations" 
    ],
    tags: ['Triple-Chain', 'Zero-Knowledge', 'Advanced Security', 'Quantum-Resistant']
  },
  {
    id: 'ai-intent-inheritance',
    title: 'AI Intent Inheritance',
    description: 'Natural language inheritance planning',
    icon: '🧠',
    color: '#9E00FF',
    securityLevel: 5,
    complexityLevel: 3,
    features: [
      "Express intent in plain language", 
      "AI-powered smart contract generation",
      "Conditional inheritance rules",
      "Adaptable to complex real-world scenarios"
    ],
    tags: ['Triple-Chain', 'Zero-Knowledge', 'Advanced Security', 'Quantum-Resistant']
  },
  {
    id: 'memory-vault',
    title: 'Time-Locked Memory Vault',
    description: 'Digital assets with multimedia memories',
    icon: '📦',
    color: '#FF3A8C',
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
    title: 'Quantum-Resistant',
    description: 'Progressive security that scales with value',
    icon: '🔐',
    color: '#00B8FF',
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
    id: 'composite-vault',
    title: 'Cross-Chain Fragment Vault',
    description: 'Splits your assets across multiple blockchains',
    icon: '🧩',
    color: '#00E5A0',
    securityLevel: 5,
    complexityLevel: 5,
    features: [
      "Asset splitting across chains",
      "Multiple blockchain storage",
      "Fragmented recovery system",
      "Protection from single-chain failures"
    ],
    tags: ['Triple-Chain', 'Zero-Knowledge', 'Advanced Security', 'Quantum-Resistant']
  },
  {
    id: 'geo-temporal',
    title: 'Location-Time Restricted Vault',
    description: 'Access only at specific locations during set times',
    icon: '🌎',
    color: '#47A0FF',
    securityLevel: 5,
    complexityLevel: 4,
    features: [
      "Dual verification: location + time window",
      "Physical presence requirement",
      "Scheduled access periods",
      "Perfect for location-sensitive business assets"
    ],
    tags: ['Triple-Chain', 'Zero-Knowledge', 'Advanced Security', 'Quantum-Resistant']
  },
  {
    id: 'diamond-hands',
    title: 'Investment Discipline Vault',
    description: 'Prevents emotional selling during market volatility',
    icon: '💎',
    color: '#3F51FF',
    securityLevel: 4,
    complexityLevel: 3,
    features: [
      "Programmable exit conditions",
      "Market event-based triggers",
      "Time-locked investment periods",
      "Protection from panic-selling"
    ],
    tags: ['Triple-Chain', 'Zero-Knowledge', 'Advanced Security']
  }
];

// Define vault categories
const VAULT_CATEGORIES = [
  {
    id: 'specialized',
    name: 'Specialized Vaults',
    description: 'Advanced vault types with unique security features and specialized functionality',
    vaultTypes: ['ai-intent-inheritance', 'geolocation', 'smart-contract', 'nft-powered', 'dynamic']
  },
  {
    id: 'security',
    name: 'Advanced Security',
    description: 'Enhanced protection with multiple verification layers and distributed security',
    vaultTypes: ['multi-signature', 'biometric', 'cross-chain']
  },
  {
    id: 'time',
    name: 'Basic Time Vaults',
    description: 'Simple and reliable time-locked storage with essential security features',
    vaultTypes: ['standard', 'time-lock']
  }
];

const VaultTypesPage = () => {
  const [_, navigate] = useLocation();
  const [selectedVaultType, setSelectedVaultType] = useState('standard');
  const [activeTab, setActiveTab] = useState('all');
  
  const handleVaultSelect = (id: string) => {
    setSelectedVaultType(id);
  };
  
  const handleContinue = () => {
    // Direct navigation to the enhanced vault system with the selected type
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
    <div className="container mx-auto py-8 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Choose Your Vault Type</h1>
          <p className="text-lg text-gray-400">Select the type of vault that best fits your security needs</p>
        </div>
        
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/my-vaults')}
            className="text-gray-400 hover:text-white flex items-center gap-1 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Vaults
          </Button>
          
          <div className="bg-black/30 border border-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-2">All Vaults Include Premium Features</h2>
            <p className="text-gray-400 mb-4">
              Every vault type includes our revolutionary technologies, making Chronos Vault 
              the most secure solution in the world - accessible to everyone, with no blockchain 
              knowledge required.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mt-6">
              <div className="bg-black/40 border border-[#6B00D7]/30 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="bg-[#6B00D7]/20 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                    <ShieldCheck className="h-5 w-5 text-[#6B00D7]" />
                  </div>
                  <h3 className="font-semibold text-[#6B00D7]/90">Triple-Chain Security</h3>
                </div>
                <p className="text-gray-400 text-sm">
                  Distributes security across Ethereum, Solana, and TON for unmatched protection
                </p>
              </div>
              
              <div className="bg-black/40 border border-[#FF5AF7]/30 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="bg-[#FF5AF7]/20 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                    <Sparkles className="h-5 w-5 text-[#FF5AF7]" />
                  </div>
                  <h3 className="font-semibold text-[#FF5AF7]/90">Cross-Chain Compatibility</h3>
                </div>
                <p className="text-gray-400 text-sm">
                  Store and access your assets across multiple blockchain networks
                </p>
              </div>
              
              <div className="bg-black/40 border border-[#00D7C3]/30 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="bg-[#00D7C3]/20 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                    <Clock className="h-5 w-5 text-[#00D7C3]" />
                  </div>
                  <h3 className="font-semibold text-[#00D7C3]/90">Flexible Payment Options</h3>
                </div>
                <p className="text-gray-400 text-sm">
                  Pay with CVT tokens, TON, ETH, SOL, or BTC with staking discounts
                </p>
              </div>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-4">Vault Categories</h2>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="bg-black/40 border border-gray-800 mb-4">
              <TabsTrigger value="all" className="data-[state=active]:bg-[#6B00D7]/20 data-[state=active]:text-white">
                All Vaults
              </TabsTrigger>
              {VAULT_CATEGORIES.map(category => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="data-[state=active]:bg-[#6B00D7]/20 data-[state=active]:text-white"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {VAULT_CATEGORIES.map(category => (
              <TabsContent key={category.id} value={category.id} className="mb-6">
                <div className="bg-black/30 border border-gray-800 rounded-lg p-4 mb-6">
                  <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                  <p className="text-gray-400">{category.description}</p>
                  
                  <div className="mt-4 space-y-2">
                    {category.vaultTypes.map(vaultId => {
                      const vault = VAULT_TYPES.find(v => v.id === vaultId);
                      if (!vault) return null;
                      return (
                        <div key={vaultId} className="flex items-center">
                          <span className="mr-2 text-lg">{vault.icon}</span>
                          <span className="font-medium">{vault.title}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
          
          <h2 className="text-2xl font-bold mb-4">Select Your Vault Type</h2>
          <p className="text-gray-400 mb-6">Explore our 16 specialized vault types with unique features and security levels</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {VAULT_TYPES.map(vault => (
            <VaultCard 
              key={vault.id}
              vault={vault}
              isSelected={selectedVaultType === vault.id}
              onSelect={() => handleVaultSelect(vault.id)}
            />
          ))}
        </div>
        
        {selectedVault && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/50 border border-[#6B00D7]/30 rounded-lg p-6 mb-8"
          >
            <h3 className="text-xl font-semibold mb-2 text-[#6B00D7]">Sovereign Fortress™ Security</h3>
            <p className="text-gray-400 mb-4">Configure quantum-resistant security protocols for your vault</p>
            
            <div className="bg-black/40 border border-gray-800 rounded-lg p-4 mb-6">
              <div className="flex items-center mb-2">
                <div className="bg-[#6B00D7]/20 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <ShieldCheck className="h-5 w-5 text-[#6B00D7]" />
                </div>
                <div>
                  <h4 className="font-semibold">Triple-Chain Security Architecture</h4>
                  <p className="text-sm text-gray-400">Distributes your vault security across Ethereum, Solana, and TON blockchains</p>
                </div>
              </div>
              <div className="flex items-center text-green-400 ml-12">
                <Check className="h-4 w-4 mr-1" />
                <span className="text-sm">Default for all vaults</span>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-red-400 text-sm mb-4">* Selection required to continue</p>
              <Button
                onClick={handleContinue}
                className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white hover:from-[#6B00D7]/90 hover:to-[#FF5AF7]/90 px-8 py-2"
              >
                Continue with {selectedVault.title}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

interface VaultCardProps {
  vault: {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    securityLevel: number;
    complexityLevel: number;
    features: string[];
    tags: string[];
  };
  isSelected: boolean;
  onSelect: () => void;
}

const VaultCard: React.FC<VaultCardProps> = ({ vault, isSelected, onSelect }) => {
  return (
    <div
      className={`rounded-lg cursor-pointer transition-all duration-200 h-full flex flex-col
        ${isSelected ? 'shadow-lg' : 'shadow'} 
        ${isSelected 
          ? 'bg-black/60 border-2' 
          : 'bg-black/40 hover:bg-black/50 border border-gray-800 hover:border-gray-700'
        }
      `}
      style={{
        borderColor: isSelected ? vault.color : undefined,
        boxShadow: isSelected ? `0 0 15px ${vault.color}30` : undefined,
      }}
      onClick={onSelect}
    >
      <div className="p-4">
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center text-xl
                ${isSelected 
                  ? 'bg-black/70 border border-white/20' 
                  : 'bg-black/60'
                }
              `}
              style={{
                boxShadow: isSelected ? `0 0 10px ${vault.color}30` : undefined,
                borderColor: isSelected ? vault.color : undefined
              }}
            >
              {vault.icon}
            </div>
            
            {isSelected && (
              <div className="w-6 h-6 flex items-center justify-center rounded-full bg-[#6B00D7]/20 border border-[#6B00D7]/50">
                <Check className="h-3 w-3 text-[#6B00D7]" />
              </div>
            )}
          </div>
          
          <h3 
            className={`font-semibold text-base ${isSelected ? 'text-white' : 'text-gray-200'} mb-1`}
          >
            {vault.title}
          </h3>
          
          <p className="text-xs text-gray-400 mb-3">{vault.description}</p>
          
          {/* Key Technologies */}
          <div className="flex flex-wrap gap-1 mb-3">
            {vault.tags.map((tag: string, i: number) => (
              <span 
                key={i}
                className="text-[10px] px-2 py-0.5 rounded-full bg-[#6B00D7]/10 border border-[#6B00D7]/30"
                style={{ color: tag === 'Zero-Knowledge' ? '#FF5AF7' : 
                        tag === 'Advanced Security' ? '#00D7C3' : 
                        tag === 'Quantum-Resistant' ? '#FFD700' : '#8B00D7' }}
              >
                {tag}
              </span>
            ))}
          </div>
          
          {/* Security & Complexity Levels */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] text-gray-400">Security</span>
                <span className="text-[10px]" style={{ color: vault.color }}>{vault.securityLevel}/5</span>
              </div>
              <div className="flex h-1.5 bg-gray-900 rounded overflow-hidden">
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
                <span className="text-[10px] text-gray-400">Complexity</span>
                <span className="text-[10px] text-amber-500">{vault.complexityLevel}/5</span>
              </div>
              <div className="flex h-1.5 bg-gray-900 rounded overflow-hidden">
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
          
          {/* Key Features */}
          <div className="mt-auto">
            {isSelected && (
              <div>
                <h4 className="text-xs font-semibold text-gray-300 mb-1.5">Key Features:</h4>
                <ul className="text-[10px] text-gray-400 space-y-1">
                  {vault.features.slice(0, 4).map((feature: string, i: number) => (
                    <li key={i} className="flex items-start">
                      <span className="text-green-400 mr-1.5 pt-0.5">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaultTypesPage;