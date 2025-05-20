import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Shield, 
  User, 
  Lock, 
  Clock, 
  Sparkles, 
  CheckCircle, 
  KeyRound 
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
    title: 'Multi-Signature Vault™',
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
    title: 'Biometric Vault™',
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
    title: 'Advanced Time-Lock™',
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
    title: 'Geolocation Vault™',
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
    title: 'Cross-Chain Verification™',
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
    title: 'Smart Contract Vault™',
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
    title: 'Dynamic Vault™',
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
    title: 'NFT-Powered Vault™',
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
    title: 'Unique Security Vault™',
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
    title: 'AI Intent Inheritance Vault™',
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
    title: 'Time-Locked Memory Vault™',
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
    title: 'Quantum-Resistant Vault™',
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
    title: 'Cross-Chain Fragment Vault™',
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
    title: 'Location-Time Restricted Vault™',
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
    title: 'Investment Discipline Vault™',
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
    title: 'AI-Assisted Investment Vault™',
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
    title: 'Milestone-Based Release Vault™',
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
        
        {/* Create Vault Button with backdrop */}
        <div className="bg-black/40 backdrop-blur-sm p-4 mb-8 text-center rounded-xl border border-purple-500/20">
          <p className="text-gray-300 mb-3">Ready to secure your assets?</p>
          <Button 
            className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg"
            onClick={() => setSelectedVault('standard')}
          >
            Create Sovereign Fortress Vault™ <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        {/* Revolutionary Premium Features Banner - Ultimate Cross-Chain Experience */}
        <motion.div
          className="w-full mb-10 overflow-hidden rounded-2xl relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Animated multi-layered background with advanced effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black/70 to-blue-900/30 z-0"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(76,29,149,0.2),transparent_70%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(219,39,119,0.15),transparent_70%)]"></div>
          
          {/* Dynamic circuit pattern overlay */}
          <div className="absolute inset-0 bg-circuit-pattern opacity-5"></div>
          
          {/* Animated cosmic particles */}
          <div className="absolute inset-0 overflow-hidden z-0">
            {/* Floating particles */}
            <div className="absolute h-1 w-1 rounded-full bg-purple-500 top-[15%] left-[25%] animate-float-particle"></div>
            <div className="absolute h-1 w-1 rounded-full bg-blue-500 top-[45%] left-[65%] animate-float-particle animation-delay-1000"></div>
            <div className="absolute h-1 w-1 rounded-full bg-green-500 top-[75%] left-[35%] animate-float-particle animation-delay-2000"></div>
            <div className="absolute h-1 w-1 rounded-full bg-pink-500 top-[25%] left-[85%] animate-float-particle animation-delay-3000"></div>
            <div className="absolute h-1 w-1 rounded-full bg-yellow-500 top-[65%] left-[15%] animate-float-particle animation-delay-4000"></div>
            
            {/* Blockchain Network Visualization - Enhanced 3D Effect */}
            <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 1000 300">
              {/* Network Core */}
              <circle cx="500" cy="150" r="15" fill="url(#coreGradient)" className="animate-pulse-slow"></circle>
              <circle cx="500" cy="150" r="30" fill="none" stroke="url(#coreStrokeGradient)" strokeWidth="1" strokeDasharray="5,5" className="animate-spin-slow"></circle>
              
              {/* Network Nodes */}
              <circle cx="300" cy="75" r="8" fill="url(#ethGradient)" className="animate-pulse"></circle>
              <circle cx="700" cy="100" r="8" fill="url(#solGradient)" className="animate-pulse animation-delay-700"></circle>
              <circle cx="400" cy="230" r="8" fill="url(#tonGradient)" className="animate-pulse animation-delay-1500"></circle>
              <circle cx="600" cy="200" r="8" fill="url(#btcGradient)" className="animate-pulse animation-delay-2200"></circle>
              
              {/* Primary Network Connections */}
              <line x1="500" y1="150" x2="300" y2="75" stroke="url(#purpleLineGradient)" strokeWidth="2" strokeDasharray="5,5" className="animate-dash-slow"></line>
              <line x1="500" y1="150" x2="700" y2="100" stroke="url(#greenLineGradient)" strokeWidth="2" strokeDasharray="5,5" className="animate-dash-slow animation-delay-700"></line>
              <line x1="500" y1="150" x2="400" y2="230" stroke="url(#blueLineGradient)" strokeWidth="2" strokeDasharray="5,5" className="animate-dash-slow animation-delay-1500"></line>
              <line x1="500" y1="150" x2="600" y2="200" stroke="url(#amberLineGradient)" strokeWidth="2" strokeDasharray="5,5" className="animate-dash-slow animation-delay-2200"></line>
              
              {/* Secondary Network Connections */}
              <line x1="300" y1="75" x2="700" y2="100" stroke="url(#secondaryGradient1)" strokeWidth="1" strokeDasharray="3,3" className="animate-dash-medium"></line>
              <line x1="400" y1="230" x2="700" y2="100" stroke="url(#secondaryGradient2)" strokeWidth="1" strokeDasharray="3,3" className="animate-dash-medium animation-delay-1000"></line>
              <line x1="300" y1="75" x2="400" y2="230" stroke="url(#secondaryGradient3)" strokeWidth="1" strokeDasharray="3,3" className="animate-dash-medium animation-delay-2000"></line>
              <line x1="600" y1="200" x2="300" y2="75" stroke="url(#secondaryGradient4)" strokeWidth="1" strokeDasharray="3,3" className="animate-dash-medium animation-delay-3000"></line>
              
              {/* Data Transfer Pulse Animations */}
              <circle cx="380" cy="105" r="3" fill="#7C3AED" className="animate-move-along-path1"></circle>
              <circle cx="570" cy="170" r="3" fill="#2563EB" className="animate-move-along-path2 animation-delay-1000"></circle>
              <circle cx="450" cy="190" r="3" fill="#10B981" className="animate-move-along-path3 animation-delay-2000"></circle>
              <circle cx="550" cy="130" r="3" fill="#F59E0B" className="animate-move-along-path4 animation-delay-3000"></circle>
              
              {/* Gradients Definitions */}
              <defs>
                <linearGradient id="coreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
                <linearGradient id="coreStrokeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#C084FC" />
                  <stop offset="100%" stopColor="#F472B6" />
                </linearGradient>
                <linearGradient id="ethGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7C3AED" />
                  <stop offset="100%" stopColor="#A78BFA" />
                </linearGradient>
                <linearGradient id="solGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#6EE7B7" />
                </linearGradient>
                <linearGradient id="tonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2563EB" />
                  <stop offset="100%" stopColor="#93C5FD" />
                </linearGradient>
                <linearGradient id="btcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#FCD34D" />
                </linearGradient>
                <linearGradient id="purpleLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7C3AED" stopOpacity="1" />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="greenLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="1" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="blueLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="1" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="amberLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="1" />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="secondaryGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.7" />
                </linearGradient>
                <linearGradient id="secondaryGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.7" />
                </linearGradient>
                <linearGradient id="secondaryGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0.7" />
                </linearGradient>
                <linearGradient id="secondaryGradient4" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.7" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Advanced Glowing Orbs with 3D Perspective */}
            <div className="absolute top-1/4 left-1/4 w-40 h-40 rounded-full bg-purple-600/10 blur-3xl animate-glow-pulse"></div>
            <div className="absolute bottom-10 right-1/4 w-64 h-64 rounded-full bg-pink-600/10 blur-3xl animate-glow-pulse animation-delay-2000"></div>
            <div className="absolute top-1/2 right-1/4 w-48 h-48 rounded-full bg-blue-600/10 blur-3xl animate-glow-pulse animation-delay-4000"></div>
          </div>
          
          <div className="relative z-10 p-8 md:p-10">
            {/* Modern Header with Back Button */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 blur-sm animate-spin-slow"></div>
                    <div className="relative bg-black p-2 rounded-full border border-purple-500/50">
                      <Lock className="h-5 w-5 text-purple-400" />
                    </div>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-white">
                    Select Your Vault
                  </h1>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white mt-4 md:mt-0 border border-gray-800 backdrop-blur-sm bg-black/20"
                onClick={() => navigate('/my-vaults')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to My Vaults
              </Button>
            </div>
            
            {/* Ultimate Cross-Chain Revolutionary Card */}
            <motion.div
              className="w-full mb-8 rounded-xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-0 overflow-hidden">
                {/* Header with glowing border effect */}
                <div className="relative bg-gradient-to-r from-purple-900/40 via-black/60 to-blue-900/40 p-5 border-b border-purple-500/20 overflow-hidden">
                  {/* Animated particle effects */}
                  <div className="absolute inset-0 overflow-hidden">
                    {/* Floating particles */}
                    <div className="absolute h-1 w-1 rounded-full bg-purple-500 top-[25%] left-[15%] animate-float-particle"></div>
                    <div className="absolute h-1 w-1 rounded-full bg-blue-500 top-[65%] left-[85%] animate-float-particle animation-delay-1200"></div>
                    <div className="absolute h-1 w-1 rounded-full bg-pink-500 top-[35%] left-[45%] animate-float-particle animation-delay-2400"></div>
                  </div>
                  
                  {/* Triple chain showcase with glow effects */}
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex -space-x-3 mr-4">
                        {/* Ethereum */}
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-900 to-purple-600 flex items-center justify-center border-2 border-purple-500 relative z-30 shadow-lg shadow-purple-900/30">
                          <div className="absolute inset-0 rounded-full bg-purple-600/20 animate-ping-slow opacity-60"></div>
                          <img src="https://cryptologos.cc/logos/ethereum-eth-logo.svg" alt="ETH" className="h-6 w-6" />
                        </div>
                        
                        {/* TON */}
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-900 to-blue-600 flex items-center justify-center border-2 border-blue-500 relative z-20 shadow-lg shadow-blue-900/30">
                          <div className="absolute inset-0 rounded-full bg-blue-600/20 animate-ping-slow opacity-60 animation-delay-700"></div>
                          <img src="https://ton.org/download/ton_symbol.svg" alt="TON" className="h-6 w-6" />
                        </div>
                        
                        {/* Solana */}
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-900 to-green-600 flex items-center justify-center border-2 border-green-500 relative z-10 shadow-lg shadow-green-900/30">
                          <div className="absolute inset-0 rounded-full bg-green-600/20 animate-ping-slow opacity-60 animation-delay-1400"></div>
                          <img src="https://cryptologos.cc/logos/solana-sol-logo.svg" alt="Solana" className="h-6 w-6" />
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300">
                          Triple-Chain Vault Security
                        </h3>
                        <p className="text-gray-300 text-sm">
                          Store, secure, and access your assets across <span className="text-purple-400">Ethereum</span>, <span className="text-blue-400">TON</span>, and <span className="text-green-400">Solana</span> simultaneously
                        </p>
                      </div>
                    </div>
                    
                    <div className="hidden lg:flex items-center">
                      <div className="px-3 py-1 bg-black/40 border border-purple-500/30 rounded-full text-xs font-medium text-purple-300 flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                        Triple-Chain Active
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Revolutionary Cross-Chain Technology Showcase */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  {/* Left: Interactive 3D Network Visualization */}
                  <div className="relative bg-black/60 h-80 lg:h-auto overflow-hidden border-b lg:border-b-0 lg:border-r border-purple-500/20">
                    {/* 3D Network Animation */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-full h-full">
                        {/* Central core with pulsing animation */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 blur-sm animate-pulse-slow"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 blur-sm"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-2 border-purple-500/50 animate-spin-slow"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-pink-500/30 animate-reverse-spin-slow"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-blue-500/20 animate-spin-slow animation-delay-2000"></div>
                        
                        {/* Ethereum Node */}
                        <div className="absolute top-[20%] left-[20%] w-10 h-10">
                          <div className="absolute inset-0 bg-purple-600/20 rounded-full animate-pulse"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-black/80 border border-purple-500 flex items-center justify-center">
                              <img src="https://cryptologos.cc/logos/ethereum-eth-logo.svg" alt="ETH" className="h-4 w-4" />
                            </div>
                          </div>
                        </div>
                        
                        {/* TON Node */}
                        <div className="absolute top-[30%] right-[20%] w-10 h-10">
                          <div className="absolute inset-0 bg-blue-600/20 rounded-full animate-pulse animation-delay-700"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-black/80 border border-blue-500 flex items-center justify-center">
                              <img src="https://ton.org/download/ton_symbol.svg" alt="TON" className="h-4 w-4" />
                            </div>
                          </div>
                        </div>
                        
                        {/* Solana Node */}
                        <div className="absolute bottom-[25%] left-[30%] w-10 h-10">
                          <div className="absolute inset-0 bg-green-600/20 rounded-full animate-pulse animation-delay-1400"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-black/80 border border-green-500 flex items-center justify-center">
                              <img src="https://cryptologos.cc/logos/solana-sol-logo.svg" alt="Solana" className="h-4 w-4" />
                            </div>
                          </div>
                        </div>
                        
                        {/* User Node */}
                        <div className="absolute bottom-[20%] right-[30%] w-10 h-10">
                          <div className="absolute inset-0 bg-pink-600/20 rounded-full animate-pulse animation-delay-2000"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-black/80 border border-pink-500 flex items-center justify-center">
                              <User className="h-4 w-4 text-pink-400" />
                            </div>
                          </div>
                        </div>
                        
                        {/* Connection lines with animated data transfers */}
                        <svg className="absolute inset-0 w-full h-full">
                          {/* Core to nodes connections */}
                          <line className="animate-draw-line" x1="50%" y1="50%" x2="20%" y2="20%" stroke="url(#pulsingPurple)" strokeWidth="2" strokeDasharray="3,3" />
                          <line className="animate-draw-line animation-delay-700" x1="50%" y1="50%" x2="80%" y2="30%" stroke="url(#pulsingBlue)" strokeWidth="2" strokeDasharray="3,3" />
                          <line className="animate-draw-line animation-delay-1400" x1="50%" y1="50%" x2="30%" y2="75%" stroke="url(#pulsingGreen)" strokeWidth="2" strokeDasharray="3,3" />
                          <line className="animate-draw-line animation-delay-2000" x1="50%" y1="50%" x2="70%" y2="80%" stroke="url(#pulsingPink)" strokeWidth="2" strokeDasharray="3,3" />
                          
                          {/* Cross-connections */}
                          <line className="animate-draw-line animation-delay-2800" x1="20%" y1="20%" x2="80%" y2="30%" stroke="url(#purpleBlueBlend)" strokeWidth="1" strokeDasharray="2,4" />
                          <line className="animate-draw-line animation-delay-3200" x1="30%" y1="75%" x2="70%" y2="80%" stroke="url(#greenPinkBlend)" strokeWidth="1" strokeDasharray="2,4" />
                          <line className="animate-draw-line animation-delay-3600" x1="20%" y1="20%" x2="30%" y2="75%" stroke="url(#purpleGreenBlend)" strokeWidth="1" strokeDasharray="2,4" />
                          <line className="animate-draw-line animation-delay-4000" x1="80%" y1="30%" x2="70%" y2="80%" stroke="url(#bluePinkBlend)" strokeWidth="1" strokeDasharray="2,4" />
                          
                          {/* Data packets */}
                          <circle r="3" fill="#7C3AED" className="animate-move-along-path">
                            <animateMotion 
                              path="M 50% 50% L 20% 20%" 
                              dur="3s" 
                              repeatCount="indefinite" 
                            />
                          </circle>
                          <circle r="3" fill="#2563EB" className="animate-move-along-path">
                            <animateMotion 
                              path="M 50% 50% L 80% 30%" 
                              dur="3s" 
                              repeatCount="indefinite"
                              begin="0.7s" 
                            />
                          </circle>
                          <circle r="3" fill="#10B981" className="animate-move-along-path">
                            <animateMotion 
                              path="M 50% 50% L 30% 75%" 
                              dur="3s" 
                              repeatCount="indefinite"
                              begin="1.4s" 
                            />
                          </circle>
                          <circle r="3" fill="#EC4899" className="animate-move-along-path">
                            <animateMotion 
                              path="M 50% 50% L 70% 80%" 
                              dur="3s" 
                              repeatCount="indefinite"
                              begin="2s" 
                            />
                          </circle>
                          
                          {/* Return data */}
                          <circle r="2" fill="#7C3AED" opacity="0.7" className="animate-move-along-path">
                            <animateMotion 
                              path="M 20% 20% L 50% 50%" 
                              dur="3s" 
                              repeatCount="indefinite"
                              begin="1.5s" 
                            />
                          </circle>
                          <circle r="2" fill="#2563EB" opacity="0.7" className="animate-move-along-path">
                            <animateMotion 
                              path="M 80% 30% L 50% 50%" 
                              dur="3s" 
                              repeatCount="indefinite"
                              begin="2.2s" 
                            />
                          </circle>
                          <circle r="2" fill="#10B981" opacity="0.7" className="animate-move-along-path">
                            <animateMotion 
                              path="M 30% 75% L 50% 50%" 
                              dur="3s" 
                              repeatCount="indefinite"
                              begin="2.9s" 
                            />
                          </circle>
                          <circle r="2" fill="#EC4899" opacity="0.7" className="animate-move-along-path">
                            <animateMotion 
                              path="M 70% 80% L 50% 50%" 
                              dur="3s" 
                              repeatCount="indefinite"
                              begin="3.5s" 
                            />
                          </circle>
                          
                          {/* Gradients */}
                          <defs>
                            <linearGradient id="pulsingPurple" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#7C3AED">
                                <animate attributeName="stop-color" values="#7C3AED; #A78BFA; #7C3AED" dur="3s" repeatCount="indefinite" />
                              </stop>
                              <stop offset="100%" stopColor="#A78BFA">
                                <animate attributeName="stop-color" values="#A78BFA; #7C3AED; #A78BFA" dur="3s" repeatCount="indefinite" />
                              </stop>
                            </linearGradient>
                            
                            <linearGradient id="pulsingBlue" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#2563EB">
                                <animate attributeName="stop-color" values="#2563EB; #93C5FD; #2563EB" dur="3s" repeatCount="indefinite" />
                              </stop>
                              <stop offset="100%" stopColor="#93C5FD">
                                <animate attributeName="stop-color" values="#93C5FD; #2563EB; #93C5FD" dur="3s" repeatCount="indefinite" />
                              </stop>
                            </linearGradient>
                            
                            <linearGradient id="pulsingGreen" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#10B981">
                                <animate attributeName="stop-color" values="#10B981; #6EE7B7; #10B981" dur="3s" repeatCount="indefinite" />
                              </stop>
                              <stop offset="100%" stopColor="#6EE7B7">
                                <animate attributeName="stop-color" values="#6EE7B7; #10B981; #6EE7B7" dur="3s" repeatCount="indefinite" />
                              </stop>
                            </linearGradient>
                            
                            <linearGradient id="pulsingPink" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#EC4899">
                                <animate attributeName="stop-color" values="#EC4899; #F9A8D4; #EC4899" dur="3s" repeatCount="indefinite" />
                              </stop>
                              <stop offset="100%" stopColor="#F9A8D4">
                                <animate attributeName="stop-color" values="#F9A8D4; #EC4899; #F9A8D4" dur="3s" repeatCount="indefinite" />
                              </stop>
                            </linearGradient>
                            
                            <linearGradient id="purpleBlueBlend" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#7C3AED" />
                              <stop offset="100%" stopColor="#2563EB" />
                            </linearGradient>
                            
                            <linearGradient id="greenPinkBlend" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#10B981" />
                              <stop offset="100%" stopColor="#EC4899" />
                            </linearGradient>
                            
                            <linearGradient id="purpleGreenBlend" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#7C3AED" />
                              <stop offset="100%" stopColor="#10B981" />
                            </linearGradient>
                            
                            <linearGradient id="bluePinkBlend" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#2563EB" />
                              <stop offset="100%" stopColor="#EC4899" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </div>
                    
                    {/* Network Statistics Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between p-4 text-xs text-gray-300">
                      <div className="bg-black/80 backdrop-blur-sm px-3 py-1 rounded-md border border-purple-500/30">
                        <div className="font-medium">Data Verification: <span className="text-green-400">Active</span></div>
                      </div>
                      <div className="bg-black/80 backdrop-blur-sm px-3 py-1 rounded-md border border-purple-500/30">
                        <div className="font-medium">Blockchain Sync: <span className="text-green-400">100%</span></div>
                      </div>
                    </div>
                    
                    {/* Edge glow effect */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-70"></div>
                      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-70"></div>
                      <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-transparent via-purple-500/50 to-transparent opacity-70"></div>
                      <div className="absolute top-0 right-0 h-full w-px bg-gradient-to-b from-transparent via-purple-500/50 to-transparent opacity-70"></div>
                    </div>
                  </div>
                  
                  {/* Right: Revolutionary Features Showcase */}
                  <div className="bg-black/40 p-6">
                    <div className="mb-5">
                      <h4 className="text-lg font-semibold text-white mb-2 flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-purple-400" />
                        Revolutionary Cross-Chain Technology
                      </h4>
                      <p className="text-gray-300 text-sm">
                        Access unprecedented security with our industry-first Triple-Chain architecture that distributes your assets across multiple blockchains simultaneously.
                      </p>
                    </div>
                    
                    {/* Feature Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Feature 1 */}
                      <motion.div 
                        className="bg-black/60 rounded-lg p-4 border border-purple-500/20 relative overflow-hidden group"
                        whileHover={{ y: -5, boxShadow: "0 10px 30px -5px rgba(124, 58, 237, 0.2)" }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        <div className="absolute right-0 bottom-0 w-20 h-20 bg-gradient-to-br from-purple-600/10 to-blue-600/5 rounded-tl-3xl"></div>
                        <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-purple-600/10 rounded-full blur-xl group-hover:opacity-70 transition-opacity"></div>
                        
                        <h5 className="text-purple-300 font-medium mb-2 flex items-start">
                          <div className="p-1.5 rounded-md bg-purple-900/40 mr-2 mt-0.5">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-purple-300">
                              <path d="M9 12L11 14L15 10M12 3L4 7L4 17L12 21L20 17V7L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          Fragmented Data Storage
                        </h5>
                        <p className="text-xs text-gray-400 ml-8">
                          Your assets are cryptographically split across Ethereum, TON, and Solana networks, making it impossible for attackers to access your complete data.
                        </p>
                      </motion.div>
                      
                      {/* Feature 2 */}
                      <motion.div 
                        className="bg-black/60 rounded-lg p-4 border border-blue-500/20 relative overflow-hidden group"
                        whileHover={{ y: -5, boxShadow: "0 10px 30px -5px rgba(37, 99, 235, 0.2)" }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      >
                        <div className="absolute right-0 bottom-0 w-20 h-20 bg-gradient-to-br from-blue-600/10 to-green-600/5 rounded-tl-3xl"></div>
                        <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-blue-600/10 rounded-full blur-xl group-hover:opacity-70 transition-opacity"></div>
                        
                        <h5 className="text-blue-300 font-medium mb-2 flex items-start">
                          <div className="p-1.5 rounded-md bg-blue-900/40 mr-2 mt-0.5">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-300">
                              <path d="M19.5 12.5722C17.8693 14.1022 15.2703 15.9941 12 15.9941C8.72971 15.9941 6.13066 14.1022 4.5 12.5722M12 19.9941V15.9941M21.9851 15.7582L19.5 12.5722M21.9851 15.7582C21.9951 15.6682 22 15.577 22 15.4855C22 15.394 21.9951 15.3028 21.9851 15.2128M4.5 12.5722L2.01489 15.7582M2.01489 15.7582C2.00495 15.6682 2 15.577 2 15.4855C2 15.394 2.00495 15.3028 2.01489 15.2128M21.9851 15.2128L19.5 12.0268M19.5 12.0268C17.8693 10.4968 15.2703 8.60498 12 8.60498C8.72971 8.60498 6.13066 10.4968 4.5 12.0268M21.9851 15.2128C21.9951 15.1228 22 15.0316 22 14.9401C22 14.8486 21.9951 14.7574 21.9851 14.6674L19.5 11.4814M19.5 11.4814C17.8693 9.95138 15.2703 8.05957 12 8.05957C8.72971 8.05957 6.13066 9.95138 4.5 11.4814M4.5 12.0268L2.01489 15.2128M2.01489 15.2128C2.00495 15.1228 2 15.0316 2 14.9401C2 14.8486 2.00495 14.7574 2.01489 14.6674M2.01489 14.6674L4.5 11.4814M2.01489 14.6674C2.00495 14.5774 2 14.4862 2 14.3947C2 14.3032 2.00495 14.212 2.01489 14.122L4.5 10.936M4.5 10.936C6.13066 9.40596 8.72971 7.51416 12 7.51416C15.2703 7.51416 17.8693 9.40596 19.5 10.936M19.5 10.936L21.9851 14.122M21.9851 14.122C21.9951 14.212 22 14.3032 22 14.3947C22 14.4862 21.9951 14.5774 21.9851 14.6674M12 4V8.05957" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          Seamless Cross-Chain Access
                        </h5>
                        <p className="text-xs text-gray-400 ml-8">
                          Access your assets through any of the supported chains with our unified interface that handles all the cross-chain complexity behind the scenes.
                        </p>
                      </motion.div>
                      
                      {/* Feature 3 */}
                      <motion.div 
                        className="bg-black/60 rounded-lg p-4 border border-green-500/20 relative overflow-hidden group"
                        whileHover={{ y: -5, boxShadow: "0 10px 30px -5px rgba(16, 185, 129, 0.2)" }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                      >
                        <div className="absolute right-0 bottom-0 w-20 h-20 bg-gradient-to-br from-green-600/10 to-amber-600/5 rounded-tl-3xl"></div>
                        <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-green-600/10 rounded-full blur-xl group-hover:opacity-70 transition-opacity"></div>
                        
                        <h5 className="text-green-300 font-medium mb-2 flex items-start">
                          <div className="p-1.5 rounded-md bg-green-900/40 mr-2 mt-0.5">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-300">
                              <path d="M12 16L12 21M12 21H7M12 21H17M17 12L17 7M17 7L20 10M17 7L14 10M7 12L7 17M7 17L10 14M7 17L4 14M21 3H3V15H21V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          Self-Healing Architecture
                        </h5>
                        <p className="text-xs text-gray-400 ml-8">
                          If any chain becomes compromised, our system automatically reconstructs your data from the remaining secure chains with zero data loss.
                        </p>
                      </motion.div>
                      
                      {/* Feature 4 */}
                      <motion.div 
                        className="bg-black/60 rounded-lg p-4 border border-pink-500/20 relative overflow-hidden group"
                        whileHover={{ y: -5, boxShadow: "0 10px 30px -5px rgba(236, 72, 153, 0.2)" }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                      >
                        <div className="absolute right-0 bottom-0 w-20 h-20 bg-gradient-to-br from-pink-600/10 to-purple-600/5 rounded-tl-3xl"></div>
                        <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-pink-600/10 rounded-full blur-xl group-hover:opacity-70 transition-opacity"></div>
                        
                        <h5 className="text-pink-300 font-medium mb-2 flex items-start">
                          <div className="p-1.5 rounded-md bg-pink-900/40 mr-2 mt-0.5">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-pink-300">
                              <path d="M9 10V8C9 6.89543 9.89543 6 11 6H13C14.1046 6 15 6.89543 15 8V10M9 10H15M9 10H7M15 10H17M7 10V18C7 19.1046 7.89543 20 9 20H15C16.1046 20 17 19.1046 17 18V10M17 10V8C17 6.89543 17.8954 6 19 6H19.5C20.6046 6 21.5 6.89543 21.5 8V18C21.5 19.1046 20.6046 20 19.5 20H19C17.8954 20 17 19.1046 17 18M7 10V8C7 6.89543 6.10457 6 5 6H4.5C3.39543 6 2.5 6.89543 2.5 8V18C2.5 19.1046 3.39543 20 4.5 20H5C6.10457 20 7 19.1046 7 18M12 10V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                          </div>
                          Chain-Agnostic Redundancy
                        </h5>
                        <p className="text-xs text-gray-400 ml-8">
                          Complete immunity from blockchain-specific attacks or outages with intelligent cross-chain fallback mechanisms that guarantee asset availability.
                        </p>
                      </motion.div>
                    </div>
                    
                    {/* Compatibility Status */}
                    <div className="mt-6 p-3 bg-black/60 rounded-lg border border-purple-500/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                          <span className="text-sm font-medium text-white">All premium features included with every vault type</span>
                        </div>
                        <div className="hidden md:flex items-center space-x-2">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          <span className="text-xs text-green-400">Blockchain Ready</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Premium Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
              <motion.div 
                className="bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-purple-900/40 relative overflow-hidden group"
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(107, 0, 215, 0.3)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              >
                <div className="absolute -top-10 -right-10 w-20 h-20 bg-purple-600 rounded-full opacity-20 blur-xl group-hover:opacity-40 transition-opacity"></div>
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-900/40 flex items-center justify-center mr-3">
                    <img src="https://cryptologos.cc/logos/ethereum-eth-logo.svg" alt="ETH" className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-white">Triple-Chain</h3>
                </div>
                <p className="text-xs text-gray-400">Distributed verification across Ethereum, TON & Solana for maximum security</p>
              </motion.div>
              
              <motion.div 
                className="bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-pink-900/40 relative overflow-hidden group"
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(255, 90, 247, 0.3)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              >
                <div className="absolute -top-10 -right-10 w-20 h-20 bg-pink-600 rounded-full opacity-20 blur-xl group-hover:opacity-40 transition-opacity"></div>
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-lg bg-pink-900/40 flex items-center justify-center mr-3">
                    <Shield className="h-4 w-4 text-pink-400" />
                  </div>
                  <h3 className="font-bold text-white">Zero-Knowledge</h3>
                </div>
                <p className="text-xs text-gray-400">Advanced ZK proofs provide complete privacy without revealing sensitive data</p>
              </motion.div>
              
              <motion.div 
                className="bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-green-900/40 relative overflow-hidden group"
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 230, 118, 0.3)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
              >
                <div className="absolute -top-10 -right-10 w-20 h-20 bg-green-600 rounded-full opacity-20 blur-xl group-hover:opacity-40 transition-opacity"></div>
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-lg bg-green-900/40 flex items-center justify-center mr-3">
                    <Lock className="h-4 w-4 text-green-400" />
                  </div>
                  <h3 className="font-bold text-white">Quantum-Resistant</h3>
                </div>
                <p className="text-xs text-gray-400">Future-proof lattice-based cryptography secure against quantum computer attacks</p>
              </motion.div>
              
              <motion.div 
                className="bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-blue-900/40 relative overflow-hidden group"
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(33, 150, 243, 0.3)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
              >
                <div className="absolute -top-10 -right-10 w-20 h-20 bg-blue-600 rounded-full opacity-20 blur-xl group-hover:opacity-40 transition-opacity"></div>
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-900/40 flex items-center justify-center mr-3">
                    <Clock className="h-4 w-4 text-blue-400" />
                  </div>
                  <h3 className="font-bold text-white">Time-Lock Tech</h3>
                </div>
                <p className="text-xs text-gray-400">Advanced temporal security layers with blockchain-verified time oracle protocols</p>
              </motion.div>
              
              <motion.div 
                className="bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-amber-900/40 relative overflow-hidden group"
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(255, 193, 7, 0.3)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
              >
                <div className="absolute -top-10 -right-10 w-20 h-20 bg-amber-600 rounded-full opacity-20 blur-xl group-hover:opacity-40 transition-opacity"></div>
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-900/40 flex items-center justify-center mr-3">
                    <Sparkles className="h-4 w-4 text-amber-400" />
                  </div>
                  <h3 className="font-bold text-white">Military-Grade</h3>
                </div>
                <p className="text-xs text-gray-400">Security protocols that meet or exceed US Department of Defense standards</p>
              </motion.div>
            </div>
          </div>
        </motion.div>
        
        {/* Enhanced Cross-Chain Visualization */}
        <motion.div 
          className="w-full mb-8 rounded-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative bg-black/30 backdrop-blur-md border border-purple-500/20 rounded-xl p-4 overflow-hidden">
            {/* Blockchain Network Visualization */}
            <div className="absolute inset-0 overflow-hidden">
              <svg className="absolute inset-0 w-full h-full opacity-15" viewBox="0 0 1000 120">
                {/* Network Core */}
                <circle cx="500" cy="60" r="10" fill="url(#coreGradient)" className="animate-pulse-slow"></circle>
                <circle cx="500" cy="60" r="20" fill="none" stroke="url(#coreStrokeGradient)" strokeWidth="1" strokeDasharray="5,5" className="animate-spin-slow"></circle>
                
                {/* Network Nodes */}
                <circle cx="300" cy="40" r="7" fill="url(#ethGradient)" className="animate-pulse"></circle>
                <circle cx="700" cy="40" r="7" fill="url(#solGradient)" className="animate-pulse animation-delay-700"></circle>
                <circle cx="400" cy="90" r="7" fill="url(#tonGradient)" className="animate-pulse animation-delay-1400"></circle>
                <circle cx="600" cy="90" r="7" fill="url(#btcGradient)" className="animate-pulse animation-delay-2100"></circle>
                
                {/* Connection Lines */}
                <path d="M500,60 L300,40" stroke="url(#purpleLineGradient)" strokeWidth="1.5" strokeDasharray="4,4" className="animate-dash-offset"></path>
                <path d="M500,60 L700,40" stroke="url(#greenLineGradient)" strokeWidth="1.5" strokeDasharray="4,4" className="animate-dash-offset animation-delay-700"></path>
                <path d="M500,60 L400,90" stroke="url(#blueLineGradient)" strokeWidth="1.5" strokeDasharray="4,4" className="animate-dash-offset animation-delay-1400"></path>
                <path d="M500,60 L600,90" stroke="url(#amberLineGradient)" strokeWidth="1.5" strokeDasharray="4,4" className="animate-dash-offset animation-delay-2100"></path>
                
                {/* Data Transfer Packets */}
                <circle cx="0" cy="0" r="3" fill="#FFFFFF" className="animate-data-packet1">
                  <animateMotion path="M300,40 L500,60" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="0" cy="0" r="3" fill="#FFFFFF" className="animate-data-packet2">
                  <animateMotion path="M700,40 L500,60" dur="3s" repeatCount="indefinite" />
                </circle>
                <circle cx="0" cy="0" r="3" fill="#FFFFFF" className="animate-data-packet3">
                  <animateMotion path="M400,90 L500,60" dur="2.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="0" cy="0" r="3" fill="#FFFFFF" className="animate-data-packet4">
                  <animateMotion path="M600,90 L500,60" dur="3.5s" repeatCount="indefinite" />
                </circle>
              </svg>
            </div>
            
            {/* Chain Information */}
            <div className="flex flex-wrap justify-between items-center gap-4 relative z-10">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-900 to-purple-600 flex items-center justify-center border border-purple-500 relative z-30">
                    <img src="https://cryptologos.cc/logos/ethereum-eth-logo.svg" alt="ETH" className="h-4 w-4" />
                  </div>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-900 to-blue-600 flex items-center justify-center border border-blue-500 relative z-20">
                    <img src="https://cryptologos.cc/logos/toncoin-ton-logo.svg" alt="TON" className="h-4 w-4" />
                  </div>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-900 to-green-600 flex items-center justify-center border border-green-500 relative z-10">
                    <img src="https://cryptologos.cc/logos/solana-sol-logo.svg" alt="Solana" className="h-4 w-4" />
                  </div>
                </div>
                <div className="hidden md:block">
                  <p className="text-xs text-gray-300">Cross-chain optimization with advanced security protocols</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <div className="bg-black/40 backdrop-blur-md border border-purple-500/30 rounded-lg p-1.5 px-3 text-xs flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-purple-400" />
                  <span className="text-gray-300">Military-Grade Security</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
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
                {VAULT_TYPES.slice(0, 3).map((vault, index) => (
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
                      
                      {/* Create Vault Button */}
                      <div className="mt-6">
                        <Button
                          onClick={() => window.location.href = '/create-vault'}
                          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          <KeyRound className="h-4 w-4" />
                          Create This Vault
                        </Button>
                      </div>
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
            <Shield className="h-5 w-5 mr-2" />
            <span>Vault Categories</span>
          </h2>

          {/* Super Simple Mobile Dropdown for Categories */}
          <div className="md:hidden mb-4">
            <div className="bg-black/40 rounded-md border border-purple-500/30 p-4">
              <label className="block text-white text-sm mb-2 font-semibold">Choose Vault Category:</label>
              
              {/* Simplified Category Selection Buttons */}
              <div className="grid grid-cols-1 gap-2 mb-2">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`w-full p-2 rounded border ${activeCategory === 'all' ? 'bg-white/10 border-purple-500' : 'bg-black/40 border-gray-800'}`}
                >
                  All Vaults
                </button>
                <button
                  onClick={() => setActiveCategory('premium')}
                  className={`w-full p-2 rounded border ${activeCategory === 'premium' ? 'bg-white/10 border-purple-500' : 'bg-black/40 border-gray-800'}`}
                >
                  Premium Vaults
                </button>
                <button
                  onClick={() => setActiveCategory('security')}
                  className={`w-full p-2 rounded border ${activeCategory === 'security' ? 'bg-white/10 border-purple-500' : 'bg-black/40 border-gray-800'}`}
                >
                  Security Vaults
                </button>
                <button
                  onClick={() => setActiveCategory('investment')}
                  className={`w-full p-2 rounded border ${activeCategory === 'investment' ? 'bg-white/10 border-purple-500' : 'bg-black/40 border-gray-800'}`}
                >
                  Investment Vaults
                </button>
                <button
                  onClick={() => setActiveCategory('inheritance')}
                  className={`w-full p-2 rounded border ${activeCategory === 'inheritance' ? 'bg-white/10 border-purple-500' : 'bg-black/40 border-gray-800'}`}
                >
                  Inheritance Vaults
                </button>
              </div>
              
              {/* Active Category Indicator */}
              <div className="mt-2 p-2 rounded bg-black/20 text-center border-t border-purple-500/20">
                <p className="text-white text-sm">
                  Showing <span className="font-bold">{vaultCategories[activeCategory].title}</span> ({vaultCategories[activeCategory].vaults.length})
                </p>
              </div>
            </div>
          </div>
          
          {/* Desktop Category Selector */}
          <div className="hidden md:block overflow-hidden bg-black/20 rounded-xl p-2 border border-purple-500/10">
            <div className="flex flex-row flex-nowrap overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-purple-900/50 snap-x gap-3">
              {Object.entries(vaultCategories).map(([key, category]) => (
                <motion.button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`flex items-center justify-between gap-2 px-3 py-3 rounded-full flex-shrink-0 transition-all ${
                    activeCategory === key 
                      ? 'bg-white/10 text-white shadow-lg shadow-purple-900/20' 
                      : 'bg-black/40 text-gray-400 hover:bg-white/5'
                  }`}
                  style={{ 
                    borderWidth: '1px',
                    borderColor: activeCategory === key ? category.color : 'transparent'
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg" style={{ color: activeCategory === key ? category.color : 'inherit' }}>{category.icon}</span>
                    <span className="text-sm">{category.title}</span>
                  </div>
                  <span className="bg-black/30 px-2 py-0.5 rounded-full text-xs min-w-[1.5rem] text-center flex-shrink-0">
                    {category.vaults.length}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
          
          {/* Category Description Banner - Static Version Without Animation */}
          <div className="mb-6 bg-black/40 backdrop-blur-sm border border-gray-800 rounded-xl p-4 flex items-center">
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
          </div>
          
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
        
      </div>
      {/* Professional Create Vault Button */}
      {selected && (
        <motion.div 
          className="fixed bottom-8 left-0 right-0 z-50 flex justify-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-black/60 backdrop-blur-md border border-purple-700/30 rounded-xl p-4 shadow-xl">
            <div className="text-center mb-2">
              <span className="text-gray-300 text-sm">Ready to secure your assets?</span>
            </div>
            <button 
              onClick={() => navigate(`/create-vault/${selected}`)}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-bold shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 hover:-translate-y-1 transition-all"
            >
              <span className="text-lg">Create {VAULT_TYPES.find(v => v.id === selected)?.title || 'Vault'}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default VaultTypesPage;