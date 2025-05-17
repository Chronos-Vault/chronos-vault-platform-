import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Lock, Clock, Milestone, Award, 
  Hourglass, BanknoteIcon, Key, CheckIcon, ScrollText, 
  Gift, HeartPulse, Users, Handshake, MapPin,
  Fingerprint, Layers, BrainCircuit, Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Define our vault categories with stunning visual identities
const VAULT_CATEGORIES = [
  {
    id: 'innovative',
    name: 'Innovative Smart Vaults',
    description: 'Cutting-edge vaults with AI and advanced technology',
    icon: <BrainCircuit className="h-6 w-6" />,
    color: '#00E676',
    vaults: [
      {
        id: 'sovereign-fortress',
        name: 'Sovereign Fortress Vault™',
        description: 'Ultimate all-in-one vault with supreme security & flexibility',
        icon: <Shield className="h-6 w-6" />,
        features: [
          "Triple-Chain Protection",
          "Quantum-Resistant Encryption",
          "Adaptive Security"
        ]
      },
      {
        id: 'ai-adaptive',
        name: 'AI-Adaptive Quantum Vault™',
        description: 'Self-evolving security protocols with quantum encryption',
        icon: <BrainCircuit className="h-6 w-6" />,
        features: [
          "AI Security Evolution",
          "Quantum Encryption",
          "Predictive Threat Detection"
        ]
      },
      {
        id: 'neural-vault',
        name: 'Neural Ownership Vault™',
        description: 'Biometric patterns drive the most secure personal vault',
        icon: <Fingerprint className="h-6 w-6" />,
        features: [
          "Biometric Authentication",
          "Neural Pattern Verification",
          "Zero-Knowledge Security"
        ]
      }
    ]
  },
  {
    id: 'asset',
    name: 'Asset & Investment',
    description: 'Manage your investments and cryptocurrency assets',
    icon: <BanknoteIcon className="h-6 w-6" />,
    color: '#2196F3',
    vaults: [
      {
        id: 'crypto-growth',
        name: 'Crypto Growth Vault™',
        description: 'Secure storage with built-in investment performance tracking',
        icon: <Award className="h-6 w-6" />,
        features: [
          "Performance Analytics", 
          "Market Insights", 
          "Historical Tracking"
        ]
      },
      {
        id: 'dividend',
        name: 'Dividend Protection Vault™',
        description: 'Secure investment yields and automate reinvestment',
        icon: <BanknoteIcon className="h-6 w-6" />,
        features: [
          "Yield Protection", 
          "Auto-Reinvestment", 
          "Payout Scheduling"
        ]
      },
      {
        id: 'portfolio',
        name: 'Portfolio Defense Vault™',
        description: 'Multi-asset protection with diversification tools',
        icon: <Layers className="h-6 w-6" />,
        features: [
          "Multi-Asset Protection", 
          "Risk Analysis", 
          "Diversification Tools"
        ]
      },
      {
        id: 'multi-signature',
        name: 'Multi-Signature Investment Vault™',
        description: 'Shared management with configurable approval thresholds',
        icon: <Users className="h-6 w-6" />,
        features: [
          "Approval Workflow", 
          "Threshold Configuration", 
          "Group Investments"
        ]
      }
    ]
  },
  {
    id: 'specialized',
    name: 'Specialized Purpose Vaults',
    description: 'Purpose-built vaults for specific usage scenarios',
    icon: <Target className="h-6 w-6" />,
    color: '#FF5AF7',
    vaults: [
      {
        id: 'legacy',
        name: 'Legacy Transfer Vault™',
        description: 'Securely pass digital assets to future generations',
        icon: <Gift className="h-6 w-6" />,
        features: [
          "Inheritance Planning", 
          "Beneficiary Management", 
          "Timeline Controls"
        ]
      },
      {
        id: 'medical',
        name: 'Medical Records Vault™',
        description: 'Securely store & share sensitive health information',
        icon: <HeartPulse className="h-6 w-6" />,
        features: [
          "Privacy Controls", 
          "Emergency Access", 
          "Provider Sharing"
        ]
      },
      {
        id: 'legal',
        name: 'Legal Document Vault™',
        description: 'Tamper-proof storage for critical legal documents',
        icon: <ScrollText className="h-6 w-6" />,
        features: [
          "Verification Timestamps", 
          "Authentication Trail", 
          "Authorized Access"
        ]
      },
      {
        id: 'milestone',
        name: 'Milestone Release Vault™',
        description: 'Goal-based access with verification requirements',
        icon: <Milestone className="h-6 w-6" />,
        features: [
          "Achievement Unlocks", 
          "Goal Verification", 
          "Incremental Access"
        ]
      }
    ]
  },
  {
    id: 'advanced',
    name: 'Advanced Security Vaults',
    description: 'Sophisticated vaults with extreme security measures',
    icon: <Shield className="h-6 w-6" />,
    color: '#F44336',
    vaults: [
      {
        id: 'geo-location',
        name: 'Geo-Location Vault™',
        description: 'Physical presence required for vault access',
        icon: <MapPin className="h-6 w-6" />,
        features: [
          "Location Verification", 
          "GPS Authentication", 
          "Designated Safe Zones"
        ]
      },
      {
        id: 'biometric',
        name: 'Biometric Access Vault™',
        description: 'Unique physical traits as your ultimate key',
        icon: <Fingerprint className="h-6 w-6" />,
        features: [
          "Multi-Factor Biometrics", 
          "Liveness Detection", 
          "Anti-Spoofing"
        ]
      },
      {
        id: 'multi-key',
        name: 'Multi-Key Authority Vault™',
        description: 'Split authority requiring multiple key holders',
        icon: <Key className="h-6 w-6" />,
        features: [
          "Key Sharding", 
          "Threshold Definition", 
          "Disaster Recovery"
        ]
      },
      {
        id: 'panic',
        name: 'Panic Protection Vault™',
        description: 'Emergency access protocols for crisis situations',
        icon: <Shield className="h-6 w-6" />,
        features: [
          "Duress Detection", 
          "Emergency Procedures", 
          "Delayed Countermeasures"
        ]
      }
    ]
  },
  {
    id: 'basic',
    name: 'Basic Time Vaults',
    description: 'Simple, reliable time-based security solutions',
    icon: <Clock className="h-6 w-6" />,
    color: '#FFC107',
    vaults: [
      {
        id: 'standard',
        name: 'Standard Time Vault™',
        description: 'Basic time-locked security for any digital asset',
        icon: <Lock className="h-6 w-6" />,
        features: [
          "Time Lock", 
          "Digital Notary", 
          "Basic Encryption"
        ]
      },
      {
        id: 'scheduled',
        name: 'Scheduled Release Vault™',
        description: 'Planned, timed disclosure of vault contents',
        icon: <Clock className="h-6 w-6" />,
        features: [
          "Schedule Planning", 
          "Release Calendar", 
          "Notification System"
        ]
      },
      {
        id: 'timelock',
        name: 'TimeStop™ Secure Vault',
        description: 'Minimum lock periods with emergency override options',
        icon: <Hourglass className="h-6 w-6" />,
        features: [
          "Minimum Lock Period", 
          "Override Controls", 
          "Extension Options"
        ]
      },
      {
        id: 'contract',
        name: 'Smart Contract Vault™',
        description: 'Condition-based access with programmable rules',
        icon: <Handshake className="h-6 w-6" />,
        features: [
          "Conditional Logic", 
          "Trigger Events", 
          "Programmable Rules"
        ]
      }
    ]
  }
];

// Floating animation component
const FloatingOrb = ({ color, size, x, y, delay }) => {
  return (
    <motion.div
      className="absolute rounded-full blur-3xl"
      style={{ 
        backgroundColor: color,
        width: size,
        height: size,
        top: `${y}%`,
        left: `${x}%`,
        opacity: 0.15
      }}
      animate={{
        y: ["-5%", "5%", "-5%"],
        x: ["-2%", "2%", "-2%"]
      }}
      transition={{
        duration: 10,
        ease: "easeInOut",
        repeat: Infinity,
        delay
      }}
    />
  );
};

// Scan line animation
const ScanLine = ({ color }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute inset-0 w-full"
        animate={{ 
          y: ["-100%", "200%"] 
        }}
        transition={{ 
          duration: 8, 
          ease: "linear", 
          repeat: Infinity,
          repeatType: "loop"
        }}
      >
        <div 
          className="h-px w-full" 
          style={{ 
            background: `linear-gradient(90deg, transparent 0%, ${color}40 50%, transparent 100%)` 
          }}
        />
      </motion.div>
    </div>
  );
};

// 3D Card component with beautiful hover effects
const Vault3DCard = ({ vault, color, category, onSelect }) => {
  return (
    <motion.div
      className="relative bg-black/40 backdrop-blur-sm rounded-xl overflow-hidden"
      whileHover={{ 
        scale: 1.05, 
        boxShadow: `0 0 30px ${color}30`,
        y: -5
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
      }}
      onClick={() => onSelect(vault)}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20" 
          style={{ 
            background: `radial-gradient(circle at 50% 0%, ${color}60 0%, transparent 70%)` 
          }}
        />
      </div>
      
      <div className="relative p-6 h-full flex flex-col">
        {/* Top section with icon and name */}
        <div className="flex items-center mb-4">
          <div 
            className="p-3 rounded-full mr-4" 
            style={{ backgroundColor: `${color}15` }}
          >
            {React.cloneElement(vault.icon, { 
              style: { color: color } 
            })}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{vault.name}</h3>
            <p 
              className="text-sm opacity-70"
              style={{ color: color }}
            >
              {category}
            </p>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-gray-300 text-sm mb-4">{vault.description}</p>
        
        {/* Features */}
        <div className="mt-auto">
          <h4 className="text-xs uppercase tracking-wider text-gray-400 mb-2">Key Features</h4>
          <ul className="space-y-1">
            {vault.features.map((feature, idx) => (
              <li key={idx} className="flex items-center text-xs text-gray-300">
                <CheckIcon className="h-3 w-3 mr-2" style={{ color: color }} />
                {feature}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Bottom border effect */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-1" 
          style={{ backgroundColor: color }}
        />
      </div>
    </motion.div>
  );
};

// Category button component
const CategoryButton = ({ category, isActive, onClick }) => {
  return (
    <button
      className={`relative rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
        isActive 
          ? 'text-white' 
          : 'text-gray-400 hover:text-gray-200'
      }`}
      onClick={onClick}
    >
      {/* Background highlight when active */}
      {isActive && (
        <motion.div
          layoutId="categoryHighlight"
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: `${category.color}20` }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      
      {/* Icon and text */}
      <span className="relative flex items-center">
        {React.cloneElement(category.icon, { 
          className: "h-4 w-4 mr-2",
          style: { color: isActive ? category.color : undefined } 
        })}
        {category.name}
      </span>
    </button>
  );
};

// Main component
const StunningVaultShowcase = () => {
  const [activeCategory, setActiveCategory] = useState(VAULT_CATEGORIES[0].id);
  const [selectedVault, setSelectedVault] = useState(null);
  const [, navigate] = useLocation();
  const currentCategory = VAULT_CATEGORIES.find(cat => cat.id === activeCategory);
  
  // Dynamic background color based on selected category
  const backgroundColor = currentCategory ? currentCategory.color : '#6B00D7';
  
  // Handle vault selection
  const handleVaultSelect = (vault) => {
    setSelectedVault(vault);
    // In a real app, we'd navigate to the vault details
    // For now, let's just log it
    console.log(`Selected vault: ${vault.name}`);
    // navigate(`/vault-details?type=${vault.id}`);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Dynamic background effects */}
      <div className="fixed inset-0 bg-grid-pattern opacity-10" />
      
      {/* Floating animated orbs with category colors */}
      <FloatingOrb color={backgroundColor} size="400px" x={10} y={30} delay={0} />
      <FloatingOrb color={backgroundColor} size="300px" x={70} y={60} delay={2} />
      <FloatingOrb color={backgroundColor} size="250px" x={80} y={20} delay={1} />
      
      {/* Animated scan line */}
      <ScanLine color={backgroundColor} />
      
      {/* Main content container */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="mb-16 text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Choose Your <span style={{ color: backgroundColor }}>Vault</span>
          </motion.h1>
          <motion.p 
            className="text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Select from our 19 specialized vault solutions organized into 5 intuitive categories.
            Each vault is designed with military-grade security and revolutionary technology.
          </motion.p>
        </div>
        
        {/* Category selection */}
        <div className="mb-12">
          <motion.div 
            className="flex flex-wrap justify-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {VAULT_CATEGORIES.map((category) => (
              <CategoryButton
                key={category.id}
                category={category}
                isActive={activeCategory === category.id}
                onClick={() => setActiveCategory(category.id)}
              />
            ))}
          </motion.div>
        </div>
        
        {/* Active category description */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          key={`desc-${activeCategory}`}
        >
          <h2 className="text-2xl font-semibold mb-2" style={{ color: backgroundColor }}>
            {currentCategory.name}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {currentCategory.description}
          </p>
        </motion.div>
        
        {/* Vault grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`grid-${activeCategory}`}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {currentCategory.vaults.map((vault, index) => (
              <motion.div
                key={vault.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: index * 0.1 }
                }}
              >
                <Vault3DCard 
                  vault={vault} 
                  color={backgroundColor}
                  category={currentCategory.name}
                  onSelect={handleVaultSelect}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
        
        {/* Back to My Vaults button */}
        <div className="mt-12 text-center">
          <Button
            variant="outline"
            className="border-gray-700 hover:bg-gray-800 text-gray-300"
            onClick={() => navigate('/my-vaults')}
          >
            Back to My Vaults
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StunningVaultShowcase;