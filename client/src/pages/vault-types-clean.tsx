import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check, ChevronUp, ChevronDown, Shield, Brain, Clock, Target, BanknoteIcon } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';

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
    tags: ['Triple-Chain', 'Zero-Knowledge', 'Advanced Security', 'AI-Powered']
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
  const [showSovereignInfo, setShowSovereignInfo] = useState(false);
  const [, navigate] = useLocation();
  
  // Track category selections to maintain state when switching tabs
  const [categorySelections, setCategorySelections] = useState({
    all: 'standard',
    innovative: 'ai-intent',
    investment: 'investment-discipline',
    specialized: 'time-locked-memory',
    security: 'multi-signature',
    basic: 'time-lock'
  });
  
  // Update selection tracking when vault is selected
  useEffect(() => {
    setCategorySelections(prev => ({
      ...prev,
      [activeCategory]: selected
    }));
  }, [selected]);
  
  // Update selected vault when changing categories
  useEffect(() => {
    const categorySelection = categorySelections[activeCategory as keyof typeof categorySelections];
    // Verify the selection exists in the current category
    const vaultExists = vaultCategories[activeCategory as keyof typeof vaultCategories].vaults
      .some(v => v.id === categorySelection);
    
    if (vaultExists) {
      setSelected(categorySelection);
    } else {
      // If not, select the first vault in the category
      const firstVaultInCategory = vaultCategories[activeCategory as keyof typeof vaultCategories].vaults[0];
      if (firstVaultInCategory) {
        setSelected(firstVaultInCategory.id);
        setCategorySelections(prev => ({
          ...prev,
          [activeCategory]: firstVaultInCategory.id
        }));
      }
    }
  }, [activeCategory]);
  
  const selectedVault = VAULT_TYPES.find(v => v.id === selected) || VAULT_TYPES[0];
  
  // Organize vaults into categories
  const vaultCategories = {
    all: {
      title: 'All Vaults',
      color: '#6B00D7',
      icon: '🏰',
      component: <BanknoteIcon className="h-4 w-4" />,
      vaults: VAULT_TYPES
    },
    innovative: {
      title: 'Innovative Smart Vaults',
      color: '#00E676',
      icon: '🧠',
      component: <Brain className="h-4 w-4" />,
      vaults: VAULT_TYPES.filter(v => 
        v.id === 'ai-intent' || 
        v.id === 'ai-assisted' || 
        v.id === 'dynamic' || 
        v.id === 'smart-contract' ||
        v.id === 'quantum-resistant')
    },
    investment: {
      title: 'Asset & Investment',
      color: '#00BCD4',
      icon: '💎',
      component: <BanknoteIcon className="h-4 w-4" />,
      vaults: VAULT_TYPES.filter(v => 
        v.id === 'investment-discipline' || 
        v.id === 'ai-assisted' ||
        v.id === 'milestone' ||
        v.id === 'cross-chain-fragment')
    },
    specialized: {
      title: 'Specialized Purpose',
      color: '#FF9800',
      icon: '🎯',
      component: <Target className="h-4 w-4" />,
      vaults: VAULT_TYPES.filter(v => 
        v.id === 'time-locked-memory' ||
        v.id === 'nft-powered' ||
        v.id === 'milestone' ||
        v.id === 'location-time')
    },
    security: {
      title: 'Advanced Security',
      color: '#F44336',
      icon: '🛡️',
      component: <Shield className="h-4 w-4" />,
      vaults: VAULT_TYPES.filter(v => 
        v.tags.includes('Zero-Knowledge') || 
        v.tags.includes('Quantum-Resistant') ||
        v.id === 'multi-signature' ||
        v.id === 'biometric' ||
        v.id === 'geo-location' ||
        v.id === 'unique-security')
    },
    basic: {
      title: 'Basic Time Vaults',
      color: '#9C27B0',
      icon: '⏱️',
      component: <Clock className="h-4 w-4" />,
      vaults: VAULT_TYPES.filter(v => 
        v.id === 'time-lock' ||
        v.id === 'standard')
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
        
        {/* Triple-Chain Security Feature - Focused on our vault system */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/30 rounded-xl p-4 shadow-lg relative overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              <div className="w-full sm:w-1/2 mb-3 sm:mb-0">
                <h2 className="text-xl font-bold text-white mb-1 flex items-center">
                  <span className="h-8 w-8 flex items-center justify-center rounded-full bg-purple-800 mr-2">⛓️</span>
                  Triple-Chain Security
                </h2>
                <p className="text-purple-200 text-sm mb-2">Secures your assets across Ethereum, TON and Solana for unparalleled protection</p>
              </div>
              <div className="w-full sm:w-1/2">
                <h2 className="text-xl font-bold text-white mb-1 flex items-center">
                  <span className="h-8 w-8 flex items-center justify-center rounded-full bg-indigo-800 mr-2">🧠</span>
                  AI-Powered Intelligence
                </h2>
                <p className="text-purple-200 text-sm">Smart security protocols that adapt to threats in real-time</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Category Tabs - Better mobile layout */}
        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
          <TabsList className="w-full grid grid-cols-3 md:grid-cols-6 bg-black/20 p-1 gap-1">
            {Object.entries(vaultCategories).map(([key, category]) => (
              <TabsTrigger 
                key={key} 
                value={key}
                className="data-[state=active]:bg-white/10 data-[state=active]:text-white h-12 px-1 sm:px-3"
                style={{ 
                  borderColor: category.color,
                  borderWidth: activeCategory === key ? '1px' : '0px'
                }}
              >
                {category.component ? (
                  <span className="mr-1">{category.component}</span>
                ) : (
                  <span className="mr-1">{category.icon}</span>
                )}
                <span className="hidden sm:inline text-xs sm:text-sm">{category.title}</span>
                <span className="sm:hidden text-xs">{category.title.split(' ')[0]}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        
        {/* Category Description - Completely redesigned for mobile */}
        <div className="mb-4 bg-black/20 backdrop-blur-sm p-3 rounded-xl border border-gray-800 static" 
          style={{ borderColor: `${vaultCategories[activeCategory as keyof typeof vaultCategories].color}40` }}>
          <div className="flex items-center mb-1">
            <span className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full mr-2" 
                style={{ backgroundColor: `${vaultCategories[activeCategory as keyof typeof vaultCategories].color}40` }}>
              {vaultCategories[activeCategory as keyof typeof vaultCategories].component ? (
                vaultCategories[activeCategory as keyof typeof vaultCategories].component
              ) : (
                <span>{vaultCategories[activeCategory as keyof typeof vaultCategories].icon}</span>
              )}
            </span>
            <h2 className="text-base sm:text-lg font-bold" 
                style={{ color: vaultCategories[activeCategory as keyof typeof vaultCategories].color }}>
              {vaultCategories[activeCategory as keyof typeof vaultCategories].title}
            </h2>
          </div>
          <p className="text-gray-300 text-xs sm:text-sm">
            {activeCategory === 'all' ? 
              `Showing all ${currentVaults.length} vault types available in Chronos Vault platform. Browse categories for specialized solutions.` : 
              vaultCategories[activeCategory as keyof typeof vaultCategories].vaults.length === 0 ? 
                'No vaults found in this category.' : 
                `Showing ${vaultCategories[activeCategory as keyof typeof vaultCategories].vaults.length} vault types optimized for ${vaultCategories[activeCategory as keyof typeof vaultCategories].title.toLowerCase()}.`
            }
          </p>
        </div>
        
        {/* Vault Grid - Improved mobile layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
          {currentVaults.map((vault, index) => (
            <VaultCard
              key={vault.id}
              vault={vault}
              selected={selected === vault.id}
              onClick={() => setSelected(vault.id)}
            />
          ))}
        </div>
        
        {/* Selected Vault Details */}
        {selectedVault && (
          <motion.div 
            className="mt-6 bg-black/40 backdrop-blur-sm p-3 sm:p-4 rounded-xl border"
            style={{ borderColor: `${selectedVault.color}40` }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            key={selectedVault.id}
          >
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-3">{selectedVault.icon}</span>
              <div>
                <h2 className="text-xl font-bold text-white">{selectedVault.title}</h2>
                <p className="text-sm text-gray-300">{selectedVault.description}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs uppercase tracking-wider opacity-60 mb-1">Security Features</div>
                <ul className="space-y-1">
                  {selectedVault.features.slice(0, 2).map((feature, idx) => (
                    <li key={idx} className="flex items-start text-xs sm:text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 mr-1.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <div className="text-xs uppercase tracking-wider opacity-60 mb-1">Technology</div>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedVault.tags.slice(0, 3).map((tag: string) => (
                    <span 
                      key={tag} 
                      className="inline-block px-2 py-0.5 text-xs rounded-full border"
                      style={{ 
                        backgroundColor: `${selectedVault.color}10`,
                        borderColor: `${selectedVault.color}40`
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Create Vault Button */}
            <Button 
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg mt-2"
              onClick={() => navigate(`/create-vault/${selected}`)}
            >
              Create {selectedVault.title} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default VaultTypesPage;