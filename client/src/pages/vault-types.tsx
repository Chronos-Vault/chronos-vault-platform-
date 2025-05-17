import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check, ShieldCheck, Sparkles, Clock, Shield, Lock } from 'lucide-react';
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
  }
];

// VaultCard component for displaying vault information
const VaultCard = ({ vault, selected, onClick }) => {
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
    </motion.div>
  );
};

// Security Feature Card
const SecurityFeatureCard = ({ title, description, icon, color }) => (
  <div className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6 transition-all hover:border-gray-700">
    <div className="flex items-center mb-3">
      <div 
        className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
        style={{ backgroundColor: `${color}20` }}
      >
        {icon}
      </div>
      <h3 className="text-lg font-bold">{title}</h3>
    </div>
    <p className="text-gray-400">{description}</p>
  </div>
);

// Main component
const VaultTypesPage = () => {
  const [selected, setSelected] = useState(VAULT_TYPES[0].id);
  const [activeCategory, setActiveCategory] = useState('all');
  const [, navigate] = useLocation();
  
  const selectedVault = VAULT_TYPES.find(v => v.id === selected) || VAULT_TYPES[0];
  const featuredVaults = [VAULT_TYPES[0], VAULT_TYPES[1], VAULT_TYPES[11], VAULT_TYPES[13]];
  
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
        v.id.includes('investment') || 
        v.id === 'milestone' || 
        v.id === 'family-heritage' ||
        v.id === 'ai-assisted')
    },
    inheritance: {
      title: 'Legacy & Inheritance',
      color: '#795548',
      icon: '👪',
      vaults: VAULT_TYPES.filter(v => 
        v.id === 'family-heritage' ||
        v.id === 'time-locked-memory' ||
        v.id === 'ai-intent')
    }
  };
  
  // Get the current category vaults
  const currentVaults = vaultCategories[activeCategory].vaults;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#1C0533] to-black text-white pb-16">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#6B00D7]/10 blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#FF5AF7]/10 blur-3xl animate-float-slow animation-delay-2000"></div>
        <div className="absolute top-3/4 right-1/3 w-40 h-40 rounded-full bg-[#00E676]/10 blur-3xl animate-float-slow animation-delay-1000"></div>
        
        {/* Animated Scan Line */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 animate-scan-vertical">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#6B00D7]/40 to-transparent"></div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 pt-8 relative z-10">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <motion.h1 
              className="text-3xl md:text-4xl font-bold"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Choose Your <span style={{ color: selectedVault.color }}>Vault</span>
            </motion.h1>
            <motion.p 
              className="text-gray-400 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Select from 19 specialized vault solutions with unparalleled security
            </motion.p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
            onClick={() => navigate('/my-vaults')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Vaults
          </Button>
        </div>
        
        {/* Featured Vault - Enhanced 3D Interactive Showcase */}
        <div className="mb-16">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center">
                <div className="relative mr-3">
                  <Sparkles className="h-6 w-6 absolute animate-pulse" style={{ color: selectedVault.color }} />
                  <Sparkles className="h-6 w-6" style={{ color: selectedVault.color }} />
                </div>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  Featured Vault: <span style={{ color: selectedVault.color }}>{selectedVault.title}</span>
                </span>
              </h2>
              
              <div className="flex space-x-1">
                {featuredVaults.map((vault, index) => (
                  <motion.button
                    key={vault.id}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      selected === vault.id ? 'w-8' : 'bg-gray-600'
                    }`}
                    style={{ 
                      backgroundColor: selected === vault.id ? vault.color : undefined,
                      boxShadow: selected === vault.id ? `0 0 12px ${vault.color}` : undefined
                    }}
                    onClick={() => setSelected(vault.id)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>
            </div>
            
            <motion.div 
              className="rounded-xl bg-gradient-to-br from-black/80 to-black/40 backdrop-blur-lg p-8 relative overflow-hidden border border-gray-800"
              animate={{ 
                boxShadow: `0 0 30px ${selectedVault.color}20`,
                borderColor: `${selectedVault.color}40` 
              }}
              transition={{ duration: 0.5 }}
              key={selectedVault.id}
            >
              {/* Animated Background Elements */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute w-full h-full bg-grid-pattern opacity-5"></div>
                
                {/* Animated Glow Effects */}
                <motion.div 
                  className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl"
                  style={{ backgroundColor: `${selectedVault.color}15` }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{ 
                    duration: 8,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
                
                <motion.div 
                  className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full blur-3xl"
                  style={{ backgroundColor: `${selectedVault.color}10` }}
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{ 
                    duration: 10,
                    delay: 1,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
                
                {/* Scan Lines */}
                <div className="absolute left-0 top-0 w-full h-full opacity-5">
                  <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent animate-scan-horizontal"></div>
                  <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-white to-transparent animate-scan-vertical"></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-10 relative z-10">
                {/* Left Column: Vault Info */}
                <div className="md:col-span-7">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    key={selectedVault.id}
                    className="h-full flex flex-col"
                  >
                    <div className="flex items-center mb-6">
                      <div 
                        className="text-5xl mr-5 p-4 rounded-2xl relative"
                        style={{ backgroundColor: `${selectedVault.color}20` }}
                      >
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-black/10 to-black/40 backdrop-blur-sm"></div>
                        <div className="relative z-10">{selectedVault.icon}</div>
                        
                        {/* Corner glows */}
                        <div className="absolute top-0 left-0 w-2 h-2 rounded-full" style={{ backgroundColor: selectedVault.color }}></div>
                        <div className="absolute top-0 right-0 w-2 h-2 rounded-full" style={{ backgroundColor: selectedVault.color }}></div>
                        <div className="absolute bottom-0 left-0 w-2 h-2 rounded-full" style={{ backgroundColor: selectedVault.color }}></div>
                        <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full" style={{ backgroundColor: selectedVault.color }}></div>
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold tracking-tight" style={{ color: selectedVault.color }}>{selectedVault.title}</h3>
                        <p className="text-gray-300 mt-1 text-lg">{selectedVault.description}</p>
                      </div>
                    </div>
                    
                    {/* Tags with animations */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {selectedVault.tags.map((tag, idx) => (
                        <motion.span 
                          key={tag} 
                          className="inline-block px-4 py-2 rounded-full text-sm font-medium"
                          style={{ 
                            backgroundColor: `${selectedVault.color}20`,
                            border: `1px solid ${selectedVault.color}40`
                          }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: idx * 0.1 }}
                          whileHover={{ 
                            scale: 1.05, 
                            backgroundColor: `${selectedVault.color}30` 
                          }}
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </div>
                    
                    {/* Key Features Section */}
                    <div className="mb-6 flex-grow">
                      <h4 className="text-lg font-semibold mb-4 flex items-center">
                        <div className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center mr-3 border border-gray-800">
                          <Check className="h-5 w-5" style={{ color: selectedVault.color }} />
                        </div>
                        <span>Key Security Features</span>
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedVault.features.map((feature, idx) => (
                          <motion.div 
                            key={idx} 
                            className="flex items-start p-3 rounded-xl bg-black/30 border border-gray-800"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: idx * 0.1 }}
                            whileHover={{ 
                              y: -5,
                              boxShadow: `0 8px 20px -5px ${selectedVault.color}20`
                            }}
                          >
                            <div 
                              className="h-10 w-10 rounded-lg flex items-center justify-center mr-3 shrink-0"
                              style={{ backgroundColor: `${selectedVault.color}20` }}
                            >
                              <Check className="h-5 w-5" style={{ color: selectedVault.color }} />
                            </div>
                            <div>
                              <div className="font-medium leading-tight">{feature}</div>
                              <div className="text-xs text-gray-400 mt-1">
                                {/* Feature-specific description */}
                                {feature.includes("Multi-Layered") && "Combines multiple security protocols for defense in depth"}
                                {feature.includes("Quantum") && "Resistant to attacks from future quantum computers"}
                                {feature.includes("Triple-Chain") && "Distributed verification across Ethereum, TON, and Solana"}
                                {feature.includes("Disaster") && "Rapid recovery from any security compromise"}
                                {feature.includes("Hardware") && "Secure key generation with hardware authentication"}
                                {feature.includes("Advanced") && "Enhanced security protocols for transaction signing"}
                                {feature.includes("Biometric") && "Integrated biometric validation options"}
                                {feature.includes("verification") && "Multi-factor cryptographic verification"}
                                {feature.includes("Fingerprint") && "Secure biometric identity verification"}
                                {feature.includes("Facial") && "Advanced facial recognition algorithms"}
                                {feature.includes("Multi-factor") && "Multiple security requirements for access"}
                                {feature.includes("Tamper") && "Detects and prevents unauthorized access attempts"}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Deploy Button */}
                    <motion.div 
                      className="mt-auto"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      <Button 
                        className="w-full py-6 text-lg font-bold relative overflow-hidden group"
                        style={{ 
                          backgroundColor: selectedVault.color,
                          boxShadow: `0 8px 20px -5px ${selectedVault.color}40`
                        }}
                        onClick={() => navigate(`/create-vault?type=${selectedVault.id}`)}
                      >
                        <span className="relative z-10 flex items-center justify-center">
                          Deploy {selectedVault.title}
                          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                        
                        {/* Button shine effect */}
                        <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
                      </Button>
                    </motion.div>
                  </motion.div>
                </div>
                
                {/* Right Column: Security Metrics */}
                <div className="md:col-span-5">
                  <motion.div 
                    className="h-full bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 flex flex-col"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    key={`${selectedVault.id}-metrics`}
                  >
                    <h4 className="text-xl font-semibold mb-6">Security Intelligence</h4>
                    
                    {/* Security level radial progress */}
                    <div className="flex items-center justify-between mb-8">
                      <div className="relative w-28 h-28">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <circle 
                            className="text-gray-800" 
                            strokeWidth="10" 
                            stroke="currentColor" 
                            fill="transparent" 
                            r="40" 
                            cx="50" 
                            cy="50" 
                          />
                          <circle 
                            className="transition-all duration-500 ease-in-out" 
                            strokeWidth="10" 
                            strokeDasharray={`${2 * Math.PI * 40 * (selectedVault.securityLevel/5)} ${2 * Math.PI * 40 * (1-selectedVault.securityLevel/5)}`}
                            strokeDashoffset="0"
                            strokeLinecap="round" 
                            stroke={selectedVault.color} 
                            fill="transparent"
                            r="40" 
                            cx="50" 
                            cy="50" 
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-3xl font-bold">{selectedVault.securityLevel}</div>
                        </div>
                      </div>
                      
                      <div className="flex-1 ml-6">
                        <h5 className="text-xl font-bold mb-1" style={{ color: selectedVault.color }}>Security Rating</h5>
                        <p className="text-gray-400 mb-3 text-sm">Protection against advanced threats</p>
                        <div className="flex items-center">
                          {Array(5).fill(0).map((_, i) => (
                            <div 
                              key={i} 
                              className="w-8 h-2 rounded-full mr-1" 
                              style={{ backgroundColor: i < selectedVault.securityLevel ? selectedVault.color : 'rgba(30,30,30,0.5)' }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Complexity bar */}
                    <div className="mb-8">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Complexity</span>
                        <div className="flex items-center">
                          <span className="text-sm font-bold mr-2">{selectedVault.complexityLevel}/5</span>
                          <div className="text-sm px-2 py-0.5 rounded bg-gray-800">
                            {selectedVault.complexityLevel <= 2 ? 'Easy' : 
                             selectedVault.complexityLevel <= 3 ? 'Moderate' : 
                             selectedVault.complexityLevel <= 4 ? 'Advanced' : 'Expert'}
                          </div>
                        </div>
                      </div>
                      <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full rounded-full"
                          style={{ backgroundColor: selectedVault.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${(selectedVault.complexityLevel / 5) * 100}%` }}
                          transition={{ duration: 0.8, delay: 0.1 }}
                        />
                      </div>
                    </div>
                    
                    {/* Blockchain support metrics */}
                    <div className="grid grid-cols-3 gap-3 mb-8">
                      <div className="bg-black/40 rounded-xl p-3 text-center border border-gray-800">
                        <img src="https://cryptologos.cc/logos/ethereum-eth-logo.svg" alt="Ethereum" className="h-8 mx-auto mb-2" />
                        <div className="text-xs font-medium">Ethereum</div>
                        <div className="text-xs text-green-500">Active</div>
                      </div>
                      
                      <div className="bg-black/40 rounded-xl p-3 text-center border border-gray-800">
                        <img src="https://ton.org/download/ton_symbol.svg" alt="TON" className="h-8 mx-auto mb-2" />
                        <div className="text-xs font-medium">TON</div>
                        <div className="text-xs text-green-500">Active</div>
                      </div>
                      
                      <div className="bg-black/40 rounded-xl p-3 text-center border border-gray-800">
                        <img src="https://cryptologos.cc/logos/solana-sol-logo.svg" alt="Solana" className="h-8 mx-auto mb-2" />
                        <div className="text-xs font-medium">Solana</div>
                        <div className="text-xs text-green-500">Active</div>
                      </div>
                    </div>
                    
                    {/* Featured stats */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-black/40 rounded-xl p-4 border border-gray-800">
                        <div className="text-lg font-bold" style={{ color: selectedVault.color }}>
                          {selectedVault.securityLevel === 5 ? "Military-grade" : "Advanced"}
                        </div>
                        <div className="text-sm text-gray-400">Security Protocol</div>
                      </div>
                      
                      <div className="bg-black/40 rounded-xl p-4 border border-gray-800">
                        <div className="text-lg font-bold" style={{ color: selectedVault.color }}>
                          {selectedVault.tags.includes('Zero-Knowledge') ? "Complete" : "Standard"}
                        </div>
                        <div className="text-sm text-gray-400">Privacy Level</div>
                      </div>
                    </div>
                    
                    {/* User satisfaction */}
                    <div className="mt-auto">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">User Satisfaction</span>
                        <span className="font-bold">98%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '98%' }}></div>
                      </div>
                      <div className="text-xs text-gray-400 mt-2 text-right italic">Based on 2,487 deployments</div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Vault Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <ShieldCheck className="h-5 w-5 mr-2" />
            <span>Vault Categories</span>
          </h2>

          <div className="flex items-center space-x-2 pb-4 overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-purple-900/50">
            {Object.entries(vaultCategories).map(([key, category]) => (
              <motion.button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  activeCategory === key 
                    ? 'bg-white/10 text-white' 
                    : 'bg-black/40 text-gray-400 hover:bg-white/5'
                }`}
                style={{ 
                  borderWidth: '1px',
                  borderColor: activeCategory === key ? category.color : 'transparent'
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-lg">{category.icon}</span>
                <span>{category.title}</span>
                <span className="bg-black/30 px-2 py-0.5 rounded-full text-xs">
                  {category.vaults.length}
                </span>
              </motion.button>
            ))}
          </div>
          
          {/* Category Description Banner */}
          <motion.div 
            className="mb-6 bg-black/40 backdrop-blur-sm border border-gray-800 rounded-xl p-4 flex items-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            key={activeCategory} // Re-animate when changing category
          >
            <div className="text-3xl mr-4">{vaultCategories[activeCategory].icon}</div>
            <div>
              <h3 className="text-xl font-semibold" style={{ color: vaultCategories[activeCategory].color }}>
                {vaultCategories[activeCategory].title}
              </h3>
              <p className="text-gray-400">
                {activeCategory === 'all' && 'All 19 specialized vaults with military-grade security for any need'}
                {activeCategory === 'premium' && 'Our premium vaults with maximum security ratings for the highest-value assets'}
                {activeCategory === 'security' && 'Advanced security vaults with zero-knowledge protocols and quantum resistance'}
                {activeCategory === 'investment' && 'Specialized investment solutions to protect and optimize your portfolio'}
                {activeCategory === 'inheritance' && 'Legacy planning vaults with inheritance and multimedia capabilities'}
              </p>
            </div>
          </motion.div>
          
          {/* Vault Grid with Animation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
            {currentVaults.map((vault, index) => (
              <motion.div
                key={vault.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.05, // Staggered animation
                  ease: [0.25, 0.1, 0.25, 1.0]
                }}
              >
                <VaultCard 
                  vault={vault}
                  selected={selected === vault.id}
                  onClick={() => setSelected(vault.id)}
                />
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Triple Chain Security Description - Enhanced World-Class Design */}
        <div className="mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="rounded-xl bg-black/40 backdrop-blur-md border border-purple-900/40 p-8 relative overflow-hidden"
          >
            {/* Animated Background Effects */}
            <div className="absolute inset-0 overflow-hidden opacity-20">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-scan-horizontal"></div>
              <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-transparent via-purple-500 to-transparent animate-scan-vertical"></div>
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-scan-horizontal animation-delay-1000"></div>
              <div className="absolute top-0 right-0 h-full w-px bg-gradient-to-b from-transparent via-purple-500 to-transparent animate-scan-vertical animation-delay-1000"></div>
              
              {/* Chain Network Visualization */}
              <div className="absolute inset-0 opacity-30">
                <svg width="100%" height="100%" className="absolute">
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(107, 0, 215, 0.2)" strokeWidth="1"/>
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  
                  {/* Network Nodes */}
                  <circle cx="20%" cy="30%" r="5" fill="rgba(255, 90, 247, 0.6)" className="animate-pulse"/>
                  <circle cx="50%" cy="70%" r="5" fill="rgba(0, 230, 118, 0.6)" className="animate-pulse animation-delay-700"/>
                  <circle cx="80%" cy="20%" r="5" fill="rgba(33, 150, 243, 0.6)" className="animate-pulse animation-delay-1500"/>
                  
                  {/* Network Connections */}
                  <line x1="20%" y1="30%" x2="50%" y2="70%" stroke="rgba(255, 90, 247, 0.6)" strokeWidth="1" strokeDasharray="5,5" className="animate-dash"/>
                  <line x1="50%" y1="70%" x2="80%" y2="20%" stroke="rgba(0, 230, 118, 0.6)" strokeWidth="1" strokeDasharray="5,5" className="animate-dash animation-delay-700"/>
                  <line x1="80%" y1="20%" x2="20%" y2="30%" stroke="rgba(33, 150, 243, 0.6)" strokeWidth="1" strokeDasharray="5,5" className="animate-dash animation-delay-1500"/>
                </svg>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-2 flex items-center">
              <div className="w-10 h-10 rounded-lg bg-purple-900/40 flex items-center justify-center mr-3">
                <ShieldCheck className="h-6 w-6 text-purple-400" />
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                Revolutionary Triple-Chain Security System
              </span>
            </h2>
            
            <p className="text-gray-300 mb-8 ml-13 max-w-3xl">
              Our groundbreaking security architecture distributes verification across Ethereum, TON, and Solana blockchains,
              creating an unprecedented security paradigm that remains robust even if multiple chains are compromised.
            </p>
            
            {/* Blockchain Security Component */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Ethereum Security */}
              <motion.div 
                className="bg-gradient-to-br from-black/60 to-purple-900/10 backdrop-blur-md border border-gray-800 rounded-xl p-5 relative overflow-hidden"
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(107, 0, 215, 0.3)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-600 to-transparent"></div>
                <div className="absolute -top-10 -right-10 w-20 h-20 bg-purple-600 rounded-full opacity-20 blur-xl"></div>
                
                <div className="flex items-center">
                  <img src="https://cryptologos.cc/logos/ethereum-eth-logo.svg" alt="Ethereum" className="w-10 h-10 mr-4" />
                  <h3 className="text-xl font-bold text-white">Ethereum Chain</h3>
                </div>
                
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 mr-2 text-purple-400 shrink-0" />
                    <span className="text-sm">Smart contract verification layer</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 mr-2 text-purple-400 shrink-0" />
                    <span className="text-sm">Multi-signature consensus protocols</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 mr-2 text-purple-400 shrink-0" />
                    <span className="text-sm">EVM-based ZK verification logic</span>
                  </li>
                </ul>
              </motion.div>
              
              {/* TON Security */}
              <motion.div 
                className="bg-gradient-to-br from-black/60 to-pink-900/10 backdrop-blur-md border border-gray-800 rounded-xl p-5 relative overflow-hidden"
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(255, 90, 247, 0.3)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-600 to-transparent"></div>
                <div className="absolute -top-10 -right-10 w-20 h-20 bg-pink-600 rounded-full opacity-20 blur-xl"></div>
                
                <div className="flex items-center">
                  <img src="https://ton.org/download/ton_symbol.svg" alt="TON" className="w-10 h-10 mr-4" />
                  <h3 className="text-xl font-bold text-white">TON Chain</h3>
                </div>
                
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 mr-2 text-pink-400 shrink-0" />
                    <span className="text-sm">High-performance transaction processing</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 mr-2 text-pink-400 shrink-0" />
                    <span className="text-sm">Fault-tolerant data replication</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 mr-2 text-pink-400 shrink-0" />
                    <span className="text-sm">Advanced workchain isolation</span>
                  </li>
                </ul>
              </motion.div>
              
              {/* Solana Security */}
              <motion.div 
                className="bg-gradient-to-br from-black/60 to-blue-900/10 backdrop-blur-md border border-gray-800 rounded-xl p-5 relative overflow-hidden"
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 123, 255, 0.3)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-600 to-transparent"></div>
                <div className="absolute -top-10 -right-10 w-20 h-20 bg-blue-600 rounded-full opacity-20 blur-xl"></div>
                
                <div className="flex items-center">
                  <img src="https://cryptologos.cc/logos/solana-sol-logo.svg" alt="Solana" className="w-10 h-10 mr-4" />
                  <h3 className="text-xl font-bold text-white">Solana Chain</h3>
                </div>
                
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 mr-2 text-blue-400 shrink-0" />
                    <span className="text-sm">High-throughput verification pipeline</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 mr-2 text-blue-400 shrink-0" />
                    <span className="text-sm">Proof-of-History temporal verification</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 mr-2 text-blue-400 shrink-0" />
                    <span className="text-sm">Parallel transaction execution</span>
                  </li>
                </ul>
              </motion.div>
            </div>
            
            {/* Security Technology Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-80 transition duration-300"></div>
                <SecurityFeatureCard 
                  title="Zero-Knowledge Proofs"
                  description="Our ZK system provides cryptographic verification without revealing sensitive data for complete transaction privacy across all chains."
                  icon={<Shield className="text-[#FF5AF7]" />}
                  color="#FF5AF7"
                />
              </div>
              
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg blur opacity-30 group-hover:opacity-80 transition duration-300"></div>
                <SecurityFeatureCard 
                  title="Quantum-Resistant Encryption"
                  description="Future-proof lattice-based cryptography provides protection against attacks from advanced quantum computers."
                  icon={<Lock className="text-[#00E676]" />}
                  color="#00E676"
                />
              </div>
              
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg blur opacity-30 group-hover:opacity-80 transition duration-300"></div>
                <SecurityFeatureCard 
                  title="Time-Locked Security"
                  description="Advanced temporal security layers using blockchain-verified time oracles for precise time-based access protocols."
                  icon={<Clock className="text-[#2196F3]" />}
                  color="#2196F3"
                />
              </div>
            </div>
            
            {/* Cross-Chain Security Stats */}
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-black/30 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">99.9997%</div>
                <div className="text-sm text-gray-400 mt-1">Uptime Guarantee</div>
              </div>
              
              <div className="bg-black/30 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-500">3-Chain</div>
                <div className="text-sm text-gray-400 mt-1">Verification System</div>
              </div>
              
              <div className="bg-black/30 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-500">Military</div>
                <div className="text-sm text-gray-400 mt-1">Grade Encryption</div>
              </div>
              
              <div className="bg-black/30 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">24/7/365</div>
                <div className="text-sm text-gray-400 mt-1">Security Monitoring</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default VaultTypesPage;