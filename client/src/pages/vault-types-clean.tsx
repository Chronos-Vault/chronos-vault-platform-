import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
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
  }
];

// VaultCard component for displaying vault information
const VaultCard = ({ vault, selected, onClick }: { vault: any; selected: boolean; onClick: () => void }) => {
  const { title, description, icon, color, securityLevel, complexityLevel, features, tags } = vault;
  
  return (
    <motion.div 
      className={`relative rounded-xl p-6 transition-all duration-300 cursor-pointer ${
        selected ? 'bg-white/10 border-2' : 'bg-black/40 border border-gray-800 hover:bg-white/5'
      }`}
      style={{ borderColor: selected ? color : undefined }}
      onClick={onClick}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Icon and Title */}
      <div className="flex items-start mb-3">
        <div className="text-2xl mr-3">{icon}</div>
        <div>
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <div className="text-sm opacity-60">{description}</div>
        </div>
      </div>
      
      {/* Security & Complexity Meters */}
      <div className="flex justify-between mb-4">
        <div className="w-1/2 pr-2">
          <div className="text-xs uppercase tracking-wider opacity-60 mb-1">Security</div>
          <div className="flex items-center">
            {Array(5).fill(0).map((_, i) => (
              <div 
                key={i} 
                className="w-4 h-1 rounded-full mr-1" 
                style={{ 
                  backgroundColor: i < securityLevel 
                    ? color
                    : 'rgba(255,255,255,0.1)'
                }}
              />
            ))}
            <span className="text-xs ml-1">{securityLevel}/5</span>
          </div>
        </div>
        <div className="w-1/2 pl-2">
          <div className="text-xs uppercase tracking-wider opacity-60 mb-1">Complexity</div>
          <div className="flex items-center">
            {Array(5).fill(0).map((_, i) => (
              <div 
                key={i} 
                className="w-4 h-1 rounded-full mr-1" 
                style={{ 
                  backgroundColor: i < complexityLevel 
                    ? 'rgba(255,255,255,0.5)'
                    : 'rgba(255,255,255,0.1)'
                }}
              />
            ))}
            <span className="text-xs ml-1">{complexityLevel}/5</span>
          </div>
        </div>
      </div>
      
      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map((tag: string) => (
          <span 
            key={tag} 
            className="inline-block px-2 py-1 text-xs rounded-md"
            style={{ backgroundColor: `${color}20` }}
          >
            {tag}
          </span>
        ))}
      </div>
      
      {/* Features */}
      {selected && (
        <motion.div 
          className="mt-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-xs uppercase tracking-wider opacity-60 mb-2">Key Features</div>
          <ul className="space-y-1">
            {features.map((feature: string, idx: number) => (
              <li key={idx} className="flex items-start text-sm">
                <Check className="h-4 w-4 mr-2 mt-0.5" style={{ color }} />
                {feature}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
      
      {/* Selected indicator */}
      {selected && (
        <div 
          className="absolute -right-2 -top-2 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ backgroundColor: color }}
        >
          <Check className="h-3 w-3 text-black" />
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
      title: 'Sovereign Premium',
      color: '#FF5AF7',
      icon: '👑',
      vaults: VAULT_TYPES.filter(v => v.securityLevel === 5)
    },
    security: {
      title: 'Advanced Security',
      color: '#4CAF50',
      icon: '🛡️',
      vaults: VAULT_TYPES.filter(v => 
        v.tags.includes('Zero-Knowledge') || 
        v.tags.includes('Quantum-Resistant'))
    },
    investment: {
      title: 'Investment Solutions',
      color: '#00BCD4',
      icon: '💎',
      vaults: VAULT_TYPES.filter(v => 
        v.id === 'dynamic' || 
        v.id === 'smart-contract')
    },
    inheritance: {
      title: 'Legacy & Inheritance',
      color: '#795548',
      icon: '👪',
      vaults: VAULT_TYPES.filter(v => 
        v.id === 'family-heritage')
    }
  };
  
  // Get the current category vaults
  const currentVaults = vaultCategories[activeCategory as keyof typeof vaultCategories].vaults;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#1C0533] to-black text-white pb-16">
      {/* Simple Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Static Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        {/* Simple gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#6B00D7]/40 to-transparent"></div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 pt-8 relative z-10">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Select Your Vault</h1>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-300 hover:text-white border border-gray-800 backdrop-blur-sm bg-black/20"
            onClick={() => navigate('/my-vaults')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Vaults
          </Button>
        </div>
        
        {/* Create Vault Button */}
        <div className="bg-black/40 backdrop-blur-sm p-4 mb-8 text-center rounded-xl border border-purple-500/20">
          <p className="text-gray-300 mb-3">Ready to secure your assets?</p>
          <Button 
            className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg"
            onClick={() => navigate(`/create-vault/${selected}`)}
          >
            Create {selectedVault.title} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        {/* Category Tabs */}
        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
          <TabsList className="w-full grid grid-cols-2 md:grid-cols-5 bg-black/20 p-1">
            {Object.entries(vaultCategories).map(([key, category]) => (
              <TabsTrigger 
                key={key} 
                value={key}
                className="data-[state=active]:bg-white/10 data-[state=active]:text-white"
              >
                <span className="mr-2">{category.icon}</span>
                {category.title}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        
        {/* Vault Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentVaults.map((vault, index) => (
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