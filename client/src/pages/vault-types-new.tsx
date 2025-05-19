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
  }
];

// VaultCard component for displaying vault information
const VaultCard = ({ vault, selected, onClick }: { vault: any; selected: boolean; onClick: () => void }) => {
  const { title, description, icon, color, securityLevel, complexityLevel, features, tags } = vault;
  
  return (
    <motion.div 
      className={`relative rounded-xl p-5 transition-all duration-300 cursor-pointer ${
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
        {tags.map(tag => (
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
            {features.map((feature, idx) => (
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

      {/* Create button when selected */}
      {selected && (
        <div className="mt-4 pt-4 border-t border-gray-800">
          <Button 
            className="w-full bg-[#6B00D7] hover:bg-[#5A00B8] text-white"
            onClick={() => window.location.href = `/${vault.id}-vault/create`}
          >
            <Shield className="mr-2 h-4 w-4" />
            Create this Vault
          </Button>
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
        v.tags.includes('Quantum-Resistant'))
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

        {/* Vault Categories Tabs */}
        <Tabs 
          value={activeCategory} 
          onValueChange={setActiveCategory}
          className="mb-8"
        >
          <TabsList className="grid grid-cols-3 bg-black/20 p-1 rounded-lg border border-[#6B00D7]/30">
            {Object.entries(vaultCategories).map(([key, category]) => (
              <TabsTrigger 
                key={key} 
                value={key}
                className="data-[state=active]:bg-[#6B00D7] data-[state=active]:text-white"
              >
                <span className="mr-2">{category.icon}</span>
                {category.title}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        
        {/* Vault Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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