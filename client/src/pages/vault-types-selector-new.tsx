import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { Motion } from '../components/ui/motion';
import GlowingBackground from '../components/effects/glowing-background';
import VaultCard from '../components/vault/3d-vault-card';
import CategorySelector, { VaultCategory } from '../components/vault/category-selector';
import { 
  Shield, Lock, Clock, Milestone, Award, 
  Hourglass, BanknoteIcon, Key, CheckIcon, ScrollText, 
  Gift, HeartPulse, Users, Handshake, MapPin,
  Fingerprint, Layers, BrainCircuit, Target
} from 'lucide-react';

// Define our vault categories with stunning visual identities
const VAULT_CATEGORIES: VaultCategory[] = [
  {
    id: 'innovative',
    name: 'Innovative Smart Vaults',
    description: 'Cutting-edge vaults with AI and advanced technology',
    icon: <BrainCircuit />,
    color: '#00E676',
  },
  {
    id: 'asset',
    name: 'Asset & Investment',
    description: 'Manage your investments and cryptocurrency assets',
    icon: <BanknoteIcon />,
    color: '#2196F3',
  },
  {
    id: 'specialized',
    name: 'Specialized Purpose',
    description: 'Vaults designed for specific use cases and needs',
    icon: <Target />,
    color: '#FF9800',
  },
  {
    id: 'advanced',
    name: 'Advanced Security',
    description: 'Military-grade security for your most valuable assets',
    icon: <Shield />,
    color: '#F44336',
  },
  {
    id: 'basic',
    name: 'Basic Time Vaults',
    description: 'Simple time-locked vaults for standard needs',
    icon: <Clock />,
    color: '#9C27B0',
  },
];

// Define all vault types organized by category
const VAULT_TYPES = {
  innovative: [
    {
      id: 'ai-powered',
      title: 'AI-Powered Smart Vault',
      description: 'Advanced vault with AI-driven security analysis and threat detection',
      icon: <BrainCircuit />,
      color: '#00E676',
      route: '/ai-powered-vault',
    },
    {
      id: 'quantum-resistant',
      title: 'Quantum-Resistant Vault',
      description: 'Future-proof vault using quantum-resistant encryption algorithms',
      icon: <Layers />,
      color: '#00E676',
      route: '/quantum-vault',
    },
    {
      id: 'cross-chain',
      title: 'Cross-Chain Integration Vault',
      description: 'Seamlessly manage assets across multiple blockchain networks',
      icon: <Layers />,
      color: '#00E676',
      route: '/cross-chain-vault',
    },
  ],
  asset: [
    {
      id: 'investment',
      title: 'Investment Portfolio Vault',
      description: 'Secure long-term storage for your investment portfolios and strategies',
      icon: <BanknoteIcon />,
      color: '#2196F3',
      route: '/investment-vault',
    },
    {
      id: 'yield',
      title: 'Yield Optimization Vault',
      description: 'Automatically maximize returns on your stored digital assets',
      icon: <Target />,
      color: '#2196F3',
      route: '/yield-vault',
    },
    {
      id: 'diversified',
      title: 'Diversified Asset Vault',
      description: 'Balance risk with multi-asset storage across different blockchains',
      icon: <Layers />,
      color: '#2196F3',
      route: '/diversified-vault',
    },
  ],
  specialized: [
    {
      id: 'milestone',
      title: 'Milestone Vault',
      description: 'Release assets when specific project milestones are achieved',
      icon: <Milestone />,
      color: '#FF9800',
      route: '/milestone-vault',
    },
    {
      id: 'heritage',
      title: 'Heritage & Legacy Vault',
      description: 'Secure transfer of digital assets to future generations',
      icon: <ScrollText />,
      color: '#FF9800',
      route: '/heritage-vault',
    },
    {
      id: 'memory',
      title: 'Memory Capsule Vault',
      description: 'Preserve digital memories to be unlocked at future dates',
      icon: <Gift />,
      color: '#FF9800',
      route: '/memory-vault',
    },
    {
      id: 'health',
      title: 'Health Directive Vault',
      description: 'Store medical directives and health-related documentation',
      icon: <HeartPulse />,
      color: '#FF9800',
      route: '/health-vault',
    },
  ],
  advanced: [
    {
      id: 'multi-sig',
      title: 'Multi-Signature Vault',
      description: 'Require multiple approvals for enhanced security',
      icon: <Users />,
      color: '#F44336',
      route: '/multi-sig-vault',
    },
    {
      id: 'geo',
      title: 'Geo-Location Vault',
      description: 'Access restricted to specific geographic locations',
      icon: <MapPin />,
      color: '#F44336',
      route: '/geo-vault',
    },
    {
      id: 'biometric',
      title: 'Biometric Verification Vault',
      description: 'Unlock with advanced biometric authentication',
      icon: <Fingerprint />,
      color: '#F44336',
      route: '/biometric-vault',
    },
    {
      id: 'contract',
      title: 'Smart Contract Vault',
      description: 'Programmable conditions for automated asset management',
      icon: <Handshake />,
      color: '#F44336',
      route: '/contract-vault',
    },
  ],
  basic: [
    {
      id: 'time-locked',
      title: 'Time-Locked Vault',
      description: 'Basic vault with time-based unlocking mechanism',
      icon: <Clock />,
      color: '#9C27B0',
      route: '/time-locked-vault',
    },
    {
      id: 'standard',
      title: 'Standard Secure Vault',
      description: 'Simple and reliable vault for everyday digital assets',
      icon: <Lock />,
      color: '#9C27B0',
      route: '/standard-vault',
    },
    {
      id: 'backup',
      title: 'Backup & Recovery Vault',
      description: 'Redundant storage for critical recovery information',
      icon: <Key />,
      color: '#9C27B0',
      route: '/backup-vault',
    },
    {
      id: 'verification',
      title: 'Verification Vault',
      description: 'Authenticate documents and verify ownership',
      icon: <CheckIcon />,
      color: '#9C27B0',
      route: '/verification-vault',
    },
  ],
};

const VaultTypesSelectorNew: React.FC = () => {
  const [, setLocation] = useLocation();
  const [activeCategory, setActiveCategory] = useState<string>('innovative');
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    // Start animation sequence
    const timer = setTimeout(() => {
      setInitialLoad(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  return (
    <div className="min-h-screen">
      <GlowingBackground
        color={VAULT_CATEGORIES.find(cat => cat.id === activeCategory)?.color || '#6B00D7'}
        intensity="medium"
        animate={true}
        className="min-h-screen px-4 py-12 md:py-16"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <Motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Choose Your <span className="text-gradient">Vault Type</span>
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Select the type of vault that best fits your security needs. Each vault offers unique features and protection levels.
            </p>
          </Motion.div>

          {/* Category Selector */}
          <CategorySelector
            categories={VAULT_CATEGORIES}
            activeCategory={activeCategory}
            onCategorySelect={handleCategorySelect}
          />

          {/* Vault Types Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {VAULT_TYPES[activeCategory as keyof typeof VAULT_TYPES].map((vault, index) => (
              <VaultCard
                key={vault.id}
                id={vault.id}
                title={vault.title}
                description={vault.description}
                icon={vault.icon}
                color={vault.color}
                route={vault.route}
              />
            ))}
          </div>

          {/* Back Button */}
          <div className="mt-12 text-center">
            <Link to="/my-vaults">
              <button className="px-6 py-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors duration-300">
                Back to My Vaults
              </button>
            </Link>
          </div>
        </div>
      </GlowingBackground>
    </div>
  );
};

export default VaultTypesSelectorNew;