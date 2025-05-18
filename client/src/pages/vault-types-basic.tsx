import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Shield, 
  User, 
  Lock
} from 'lucide-react';

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
    color: '#4C00B0',
    securityLevel: 5,
    complexityLevel: 2,
    features: [
      "Multiple Signature Requirements",
      "Hierarchical Approval Structure",
      "Governance Voting Integration",
      "Enhanced Access Control"
    ],
    tags: ['Multi-Sig', 'Governance', 'Shared Control', 'Advanced Security']
  },
  {
    id: 'geo-vault',
    title: 'Geo-Location Vault',
    description: 'Advanced vault security with location-based authentication',
    icon: '🌍',
    color: '#0080FF',
    securityLevel: 4,
    complexityLevel: 2,
    features: [
      "Physical Presence Verification",
      "Location-Based Authentication",
      "Geofencing Security Controls",
      "Travel Mode Protection"
    ],
    tags: ['Geo-Location', 'Physical Security', 'Travel Protection', 'Biometric']
  },
  {
    id: 'inheritance',
    title: 'Intent Inheritance Vault',
    description: 'Secure asset transfer system with advanced succession planning',
    icon: '🏛️',
    color: '#00A3FF',
    securityLevel: 3,
    complexityLevel: 3,
    features: [
      "Secure Succession Planning",
      "Time-Controlled Transfers",
      "Multi-Tiered Beneficiary System",
      "Proof-of-Life Verification"
    ],
    tags: ['Inheritance', 'Estate Planning', 'Family Security', 'Long-Term']
  },
  {
    id: 'smart-contract',
    title: 'Smart Contract Vault',
    description: 'Programmable security with conditional access controls',
    icon: '📜',
    color: '#FF6B00',
    securityLevel: 4,
    complexityLevel: 4,
    features: [
      "Condition-Based Transactions",
      "Programmable Security Rules",
      "Event-Triggered Actions",
      "Advanced On-Chain Logic"
    ],
    tags: ['Programmable', 'Conditional', 'Automated', 'Advanced']
  }
];

// Organize vaults into categories
const vaultCategories = {
  all: {
    title: 'All Vaults',
    color: '#9333EA',
    icon: '🔒',
    vaults: VAULT_TYPES
  },
  premium: {
    title: 'Premium Vaults',
    color: '#6B00D7',
    icon: '👑',
    vaults: VAULT_TYPES.filter(v => v.securityLevel >= 5)
  },
  security: {
    title: 'Security Vaults',
    color: '#4C00B0',
    icon: '🔐',
    vaults: VAULT_TYPES.filter(v => v.tags.includes('Advanced Security'))
  },
  investment: {
    title: 'Investment Vaults',
    color: '#00A3FF',
    icon: '💰',
    vaults: VAULT_TYPES.filter(v => v.tags.includes('Investment') || v.id === 'smart-contract')
  },
  inheritance: {
    title: 'Inheritance Vaults',
    color: '#00805A',
    icon: '🏛️',
    vaults: VAULT_TYPES.filter(v => v.tags.includes('Inheritance') || v.id === 'inheritance')
  }
};

// Vault card component
const VaultCard = ({ vault, onClick }: { vault: any, onClick: any }) => {
  return (
    <div 
      className="relative bg-black/40 rounded-xl p-5 border border-purple-600/20 hover:border-purple-500/50 
                transition-all cursor-pointer hover:shadow-lg hover:shadow-purple-900/20"
      onClick={onClick}
    >
      {/* Security Level */}
      <div className="absolute top-3 right-3 flex items-center bg-black/50 rounded-full px-2 py-0.5">
        <span className="text-xs text-gray-300 mr-1">Security</span>
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className={`w-1.5 h-1.5 rounded-full mx-0.5 ${i < vault.securityLevel ? 'bg-purple-500' : 'bg-gray-700'}`}
            />
          ))}
        </div>
      </div>
      
      {/* Icon */}
      <div 
        className="w-14 h-14 rounded-xl flex items-center justify-center mb-3 text-2xl"
        style={{ backgroundColor: `${vault.color}20` }}
      >
        {vault.icon}
      </div>
      
      {/* Title and Description */}
      <h3 className="font-bold text-lg mb-1" style={{ color: vault.color }}>
        {vault.title}
      </h3>
      <p className="text-gray-300 text-sm mb-4">
        {vault.description}
      </p>
      
      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {vault.tags.slice(0, 3).map((tag: string) => (
          <span 
            key={tag} 
            className="inline-block text-xs px-2 py-1 rounded-full text-white"
            style={{ backgroundColor: `${vault.color}40` }}
          >
            {tag}
          </span>
        ))}
      </div>
      
      {/* Features */}
      <div className="space-y-1">
        {vault.features.slice(0, 2).map((feature: string, idx: number) => (
          <div key={idx} className="flex items-center">
            <Check className="h-3 w-3 mr-2 text-green-500" />
            <span className="text-xs text-gray-300">{feature}</span>
          </div>
        ))}
      </div>
      
      {/* Button */}
      <Button 
        className="w-full mt-4"
        style={{ backgroundColor: vault.color }}
      >
        Select This Vault
      </Button>
    </div>
  );
};

// Main component
const VaultTypesPage = () => {
  const [location, setLocation] = useLocation();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedVault, setSelectedVault] = useState(VAULT_TYPES[0]);

  // Handle vault selection
  const handleVaultSelect = (vault: any) => {
    setSelectedVault(vault);
    // Navigate to the appropriate vault creation page based on vault type
    setLocation(`/${vault.id}-vault`);
  };

  return (
    <div className="container mx-auto py-8 px-4 text-white">
      <div className="mb-8">
        <Button 
          variant="outline" 
          onClick={() => setLocation('/my-vaults')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to My Vaults
        </Button>
        
        <h1 className="text-3xl font-bold mb-2 text-center md:text-left">Choose Your Vault Type</h1>
        <p className="text-gray-400 text-center md:text-left">
          Select the type of vault that best fits your security needs
        </p>
      </div>
      
      {/* Category Selection */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          <span>Vault Categories</span>
        </h2>

        {/* Simple Mobile Category Buttons */}
        <div className="md:hidden mb-6">
          <div className="bg-black/40 rounded-md border border-purple-500/30 p-4">
            <label className="block text-white text-sm mb-2 font-semibold">Choose Category:</label>
            
            <div className="grid grid-cols-1 gap-2 mb-2">
              {Object.entries(vaultCategories).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`w-full p-2.5 rounded border text-left ${
                    activeCategory === key 
                      ? 'bg-white/10 border-purple-500' 
                      : 'bg-black/40 border-gray-800'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="mr-2">{category.icon}</span>
                    <span>{category.title}</span>
                    <span className="ml-auto bg-black/30 px-2 rounded-full text-xs">
                      {category.vaults.length}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Desktop Categories */}
        <div className="hidden md:flex space-x-4 mb-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-purple-900/30">
          {Object.entries(vaultCategories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-5 py-3 rounded-lg whitespace-nowrap border ${
                activeCategory === key 
                  ? 'border-purple-500 bg-purple-900/20' 
                  : 'border-gray-800 bg-black/40'
              }`}
              style={{ 
                color: activeCategory === key ? category.color : 'white',
              }}
            >
              <div className="flex items-center">
                <span className="mr-2">{category.icon}</span>
                <span>{category.title}</span>
                <span className="ml-2 bg-black/30 px-2 rounded-full text-xs">
                  {category.vaults.length}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Vault Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vaultCategories[activeCategory as keyof typeof vaultCategories].vaults.map((vault) => (
          <VaultCard 
            key={vault.id} 
            vault={vault} 
            onClick={() => handleVaultSelect(vault)} 
          />
        ))}
      </div>
    </div>
  );
};

export default VaultTypesPage;