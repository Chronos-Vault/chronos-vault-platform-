import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';
import { 
  Coins, Lock, TrendingUp, Clock, 
  ShieldCheck, Lightbulb, Sparkles, 
  Calendar, Timer, Shield, 
  Hourglass, ArrowRight, Filter, Medal,
  BarChart3, GanttChart, Bookmark, 
  CheckCircle, Key, Flame, BookOpen
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useAuthContext } from '@/contexts/auth-context';
import { useCVTToken } from '@/contexts/cvt-token-context';
import { Badge } from '@/components/ui/badge';

// Extended Progress component that accepts indicatorClassName
interface ProgressProps {
  value: number;
  className?: string;
  indicatorClassName?: string;
}

// Extended Progress component
const CustomProgress: React.FC<ProgressProps> = ({ value, className, indicatorClassName }) => {
  // Create a CSS class for the indicator styling
  React.useEffect(() => {
    // This adds a style tag to handle the indicator styling
    if (indicatorClassName) {
      // Sanitize the className to only allow safe CSS class patterns
      const sanitizedClassName = indicatorClassName.replace(/[^a-zA-Z0-9\-_\s]/g, '');
      
      const styleId = `progress-indicator-${Math.random().toString(36).slice(2, 9)}`;
      const styleTag = document.createElement('style');
      styleTag.id = styleId;
      
      // Use textContent instead of innerHTML to prevent XSS
      const cssRule = `.progress-bar-custom div { ${sanitizedClassName.includes('bg-gradient') ? sanitizedClassName : ''} }`;
      styleTag.textContent = cssRule;
      
      document.head.appendChild(styleTag);
      
      return () => {
        const existingStyle = document.getElementById(styleId);
        if (existingStyle) {
          existingStyle.remove();
        }
      };
    }
  }, [indicatorClassName]);
  
  return (
    <Progress 
      value={value} 
      className={`${className} progress-bar-custom`}
    />
  );
};

// Vault Interfaces
interface TimeReleaseEvent {
  year: number;
  amount: number;
  percentage: string;
  date: string;
  description: string;
  specialName: string;
  securityFeatures: string[];
  vaultType: string;
  blockchainDetails: {
    ethereum: string;
    solana: string;
    ton: string;
    smartContract?: string;
  };
  verificationDetails: {
    mechanism: string;
    difficulty: number;
    validators: number;
  };
}

interface OlympicVault {
  id: string;
  name: string;
  tier: string;
  description: string;
  icon: React.ReactNode;
  securityFeatures: string[];
  unlockYear: number;
  scarcityLevel: number;
  colorClass: string;
  gradientClass: string;
}

interface VerificationVault {
  id: string;
  name: string;
  tier: string;
  description: string;
  icon: React.ReactNode;
  verificationFeatures: string[];
  unlockYear: number;
  securityLevel: number;
  colorClass: string;
  gradientClass: string;
}

interface BurnProjection {
  year: number;
  totalSupply: number;
  burnedAmount: number;
  percentBurned: number;
}

const TokenVaultsPage: React.FC = () => {
  const { isAuthenticated } = useAuthContext();
  const cvtToken = useCVTToken();
  const [activeTab, setActiveTab] = useState<string>('journey');
  const [activeOlympicId, setActiveOlympicId] = useState<string>('gold');
  const [activeVerificationId, setActiveVerificationId] = useState<string>('diamond');
  
  // CVT Time-Release Events Data - The 21-Year Journey
  const timeReleaseEvents: TimeReleaseEvent[] = [
    { 
      year: 0, 
      amount: 6300000, 
      percentage: "30%", 
      date: "May 15, 2025", 
      description: "Initial circulation represents the foundation of the CVT ecosystem, distributed to strategic partners, platform development, and ecosystem fund to kickstart the platform's growth.",
      specialName: "Genesis Distribution",
      securityFeatures: ["Multi-signature requirements", "Transparent allocation", "Vesting schedules"],
      vaultType: "Foundation Vault",
      blockchainDetails: {
        ethereum: "0x6F3e7D82526e12051C151AE054F242Cc91e19438",
        solana: "CvT5oXeA9KFmBpAFRxvg7zdycBcFZv3TBHmNpANmzaQA",
        ton: "EQBYLdzkDjdjZLtXXgQTgMhpCaKDPfQQUKxpBNKmBiCY5_Y_",
        smartContract: "TimeLockFoundation v1.0"
      },
      verificationDetails: {
        mechanism: "Multi-Signature Time-Lock Protocol",
        difficulty: 85,
        validators: 7
      }
    },
    { 
      year: 4, 
      amount: 7350000, 
      percentage: "35%", 
      date: "May 15, 2029", 
      description: "The Gold Olympic Vaults open, unlocking 50% of all time-locked tokens. This major release coincides with platform maturity and transition to DAO governance, enabling expanded ecosystem development.",
      specialName: "Gold Olympic Unlock",
      securityFeatures: ["Triple-chain verification", "Government-grade encryption", "Zero-knowledge proof validation"],
      vaultType: "Gold Olympic Vault",
      blockchainDetails: {
        ethereum: "0x7A21438Ba88510Cf32E78E736AB440A84FD37Ae9",
        solana: "GLD5xNvZmYfAHyj2qWe94kzVn56mThL4X37jNgVNc7Uq",
        ton: "EQCGLdvault-gold-olympic-4y-eHu873BfqMn77rRt58",
        smartContract: "GoldOlympicVault v2.1"
      },
      verificationDetails: {
        mechanism: "Triple-Chain Consensus Protocol",
        difficulty: 92,
        validators: 21
      }
    },
    { 
      year: 8, 
      amount: 3675000, 
      percentage: "17.5%", 
      date: "May 15, 2033", 
      description: "Silver Olympic Vaults activate with 25% of time-locked tokens. Enhanced verification protocols and staking mechanisms provide advanced security and governance rights to long-term holders.",
      specialName: "Silver Olympic Revelation",
      securityFeatures: ["Dual-chain verification", "Behavioral authentication", "Enhanced staking rewards"],
      vaultType: "Silver Olympic Vault",
      blockchainDetails: {
        ethereum: "0x8B34c1A83b7C5F4dB8a78D9b71e1AbF28Cd24E7D",
        solana: "SLVRxNHu8dvYPJjZ44wQgUT7YxKeHR9LBmXJGW2FpX4",
        ton: "EQC-slvr-vault-8year-release-CnH83j4gDzv5Ytzd",
        smartContract: "SilverOlympicVault v3.2"
      },
      verificationDetails: {
        mechanism: "Dual-Chain Behavioral Authentication",
        difficulty: 88,
        validators: 35
      }
    },
    { 
      year: 12, 
      amount: 1837500, 
      percentage: "8.75%", 
      date: "May 15, 2037", 
      description: "Bronze Olympic Vaults open with 12.5% of time-locked tokens. Cross-chain verification systems reach full maturity, offering sophisticated portfolio tools and security features.",
      specialName: "Bronze Olympic Emergence",
      securityFeatures: ["Multi-signature requirements", "Automated security audits", "Cross-chain asset protection"],
      vaultType: "Bronze Olympic Vault",
      blockchainDetails: {
        ethereum: "0x9C45b1F58Af32D1aBdE7F57BC15Ed6f30BcA2783",
        solana: "BRZNzxcVQ6wHH3HZ8K9yyFh4MBPSoUnFZ2vBbG5pMfDq",
        ton: "EQD8vaultbronze-12y-release-Gft7UnpB9FTzv8e4",
        smartContract: "BronzeOlympicVault v4.0"
      },
      verificationDetails: {
        mechanism: "Multi-Signature Cross-Chain Audit Protocol",
        difficulty: 90,
        validators: 49
      }
    },
    { 
      year: 16, 
      amount: 918750, 
      percentage: "4.375%", 
      date: "May 15, 2041", 
      description: "Diamond Verification Vaults activate with 6.25% of time-locked tokens, introducing quantum-resistant security features and establishing verification authorities within the network.",
      specialName: "Diamond Verification Activation",
      securityFeatures: ["Quantum-resistant encryption", "Trusted verification authority", "Network security staking"],
      vaultType: "Diamond Verification Vault",
      blockchainDetails: {
        ethereum: "0xAe7D6F21D2B138c92bD36E7C8Eb2B7De45F5F218",
        solana: "DMNDqR3vYUw4kLVLzLJum5SGNHBzKnxC6dQmQmMQyR38",
        ton: "EQCDiamond-vault-16year-quantum-8hKBnM4wTztP",
        smartContract: "DiamondVerificationVault v5.1"
      },
      verificationDetails: {
        mechanism: "Quantum-Resistant Lattice Encryption",
        difficulty: 95,
        validators: 64
      }
    },
    { 
      year: 21, 
      amount: 918750, 
      percentage: "4.375%", 
      date: "May 15, 2046", 
      description: "Sovereign Fortress Vaults complete the 21-year cycle with the final 6.25% of time-locked tokens. These ultimate vaults represent complete sovereignty with military-grade security and verification.",
      specialName: "Sovereign Completion",
      securityFeatures: ["Military-grade security", "Perpetual inheritance system", "Global jurisdiction protection"],
      vaultType: "Sovereign Fortress Vault",
      blockchainDetails: {
        ethereum: "0xFd9A8E5c81B9Fc1D33E56DE8D7f58D79Eb21B3C2",
        solana: "SVRGNft7Th38b7P9ZwLkR4tDcH6MqxfJh9NLv2qFZDUm",
        ton: "EQB-sovereign-fortress-final-vault-Z8h4jtPn72F",
        smartContract: "SovereignFortressVault v6.0"
      },
      verificationDetails: {
        mechanism: "Military-Grade Triple-Chain Security Protocol",
        difficulty: 99,
        validators: 101
      }
    }
  ];
  
  // Projected Supply Changes with Burning System
  const burnProjections: BurnProjection[] = [
    { year: 0, totalSupply: 21000000, burnedAmount: 0, percentBurned: 0 },
    { year: 4, totalSupply: 13153000, burnedAmount: 497000, percentBurned: 2.4 },
    { year: 8, totalSupply: 15771000, burnedAmount: 1554000, percentBurned: 7.4 },
    { year: 12, totalSupply: 16345500, burnedAmount: 2817000, percentBurned: 13.4 },
    { year: 16, totalSupply: 15956250, burnedAmount: 4125000, percentBurned: 19.6 },
    { year: 21, totalSupply: 15279375, burnedAmount: 5720625, percentBurned: 27.2 },
    { year: 30, totalSupply: 12530000, burnedAmount: 8470000, percentBurned: 40.3 },
    { year: 50, totalSupply: 7742000, burnedAmount: 13258000, percentBurned: 63.1 },
    { year: 100, totalSupply: 2143000, burnedAmount: 18857000, percentBurned: 89.8 }
  ];
  
  // CVT Staking Vault Tiers
  const olympicVaults: OlympicVault[] = [
    {
      id: 'sovereign',
      name: 'Vault Sovereign',
      tier: 'Ultimate',
      description: 'The highest tier of CVT staking vault requiring at least 100,000 CVT. Provides 50% reduction on platform fees, premium AI optimization, unlimited capsules, concierge service, and 10x voting weight.',
      icon: <Shield className="h-5 w-5" />,
      securityFeatures: [
        'Premium AI optimization',
        'Unlimited time capsule capacity',
        'Concierge service',
        '10x voting power',
        '1.5x reward multiplier'
      ],
      unlockYear: 4,
      scarcityLevel: 95,
      colorClass: 'text-purple-500',
      gradientClass: 'from-purple-800/20 to-fuchsia-500/20'
    },
    {
      id: 'architect',
      name: 'Vault Architect',
      tier: 'Premium',
      description: 'A premium tier of CVT staking vault requiring at least 10,000 CVT. Provides 30% reduction on platform fees, advanced analytics, AI insights, up to 50 time capsules, and 3x voting weight.',
      icon: <GanttChart className="h-5 w-5" />,
      securityFeatures: [
        'Advanced analytics',
        'AI investment insights',
        'Up to 50 time capsules',
        '3x voting power',
        '1.25x reward multiplier'
      ],
      unlockYear: 8,
      scarcityLevel: 85,
      colorClass: 'text-blue-400',
      gradientClass: 'from-blue-800/20 to-cyan-500/20'
    },
    {
      id: 'guardian',
      name: 'Vault Guardian',
      tier: 'Standard',
      description: 'The entry-level CVT staking vault requiring at least 1,000 CVT. Provides 15% reduction on platform fees, basic portfolio analytics, up to 10 time capsules, and 1x voting weight.',
      icon: <ShieldCheck className="h-5 w-5" />,
      securityFeatures: [
        'Basic portfolio analytics',
        'Up to 10 time capsules',
        'Standard voting power',
        'Platform fee reduction',
        '1.1x reward multiplier'
      ],
      unlockYear: 12,
      scarcityLevel: 75,
      colorClass: 'text-green-500',
      gradientClass: 'from-green-800/20 to-emerald-500/20'
    }
  ];
  
  // Smart Contract Vault Types
  const verificationVaults: VerificationVault[] = [
    {
      id: 'timelock',
      name: 'Time-Lock Smart Contract Vault',
      tier: 'Core',
      description: 'The foundational smart contract vault that implements the time-lock release mechanism for the 21-year token distribution cycle with military-grade security and multi-chain verification.',
      icon: <Clock className="h-5 w-5" />,
      verificationFeatures: [
        'Time-based token release',
        'Multi-signature authorization',
        'Cross-chain verification',
        'Immutable lock periods',
        'Transparent execution'
      ],
      unlockYear: 4,
      securityLevel: 96,
      colorClass: 'text-amber-400',
      gradientClass: 'from-amber-800/20 to-orange-500/20'
    },
    {
      id: 'buyback',
      name: 'Buyback and Burn Vault',
      tier: 'Economic',
      description: 'An autonomous smart contract system that automatically purchases CVT tokens from public markets and permanently burns them, creating the deflationary mechanism central to CVT tokenomics.',
      icon: <Flame className="h-5 w-5" />,
      verificationFeatures: [
        'Automated token buybacks',
        'Permanent token burning',
        'Fee capture system',
        'Multi-DEX integration',
        'Supply reduction analytics'
      ],
      unlockYear: 1,
      securityLevel: 94,
      colorClass: 'text-red-400',
      gradientClass: 'from-red-900/20 to-orange-600/20'
    },
    {
      id: 'staking',
      name: 'Advanced Staking Vault',
      tier: 'Reward',
      description: 'A sophisticated staking system implementing tier-based multipliers, time-based bonuses, and auto-compounding rewards for CVT holders who contribute to ecosystem security and governance.',
      icon: <TrendingUp className="h-5 w-5" />,
      verificationFeatures: [
        'Tier-based reward multipliers',
        'Time-based staking bonuses',
        'Auto-compounding options',
        'Pool staking capabilities',
        'Governance power calculation'
      ],
      unlockYear: 2,
      securityLevel: 92,
      colorClass: 'text-blue-400',
      gradientClass: 'from-blue-800/20 to-cyan-500/20'
    }
  ];
  
  // Find active vaults
  const activeOlympic = olympicVaults.find(vault => vault.id === activeOlympicId) || olympicVaults[0];
  const activeVerification = verificationVaults.find(vault => vault.id === activeVerificationId) || verificationVaults[0];
  
  return (
    <>
      <Helmet>
        <title>CVT Token Vaults Journey | Revolutionary Tokenomics</title>
        <meta 
          name="description" 
          content="Explore Chronos Vault Token's revolutionary 21-year journey through Olympic vaults, verification systems, and deflationary burning mechanisms." 
        />
      </Helmet>
      
      <Container className="py-12">
        <PageHeader 
          heading="CVT Token Vaults Journey" 
          description="A revolutionary 21-year odyssey through Olympic vaults, verification authorities, and mathematical scarcity"
          separator
        />
        
        <div className="mt-8 mb-10">
          <Card className="bg-black/40 border border-purple-900/30 overflow-hidden">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-purple-500/5 to-transparent opacity-70"></div>
            <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-purple-500/10 to-transparent opacity-40"></div>
            
            <CardContent className="p-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="space-y-2 flex flex-col items-center text-center p-4 rounded-lg bg-gradient-to-br from-purple-900/20 to-fuchsia-900/10 border border-purple-900/20">
                  <div className="rounded-full bg-gradient-to-r from-purple-700/30 to-fuchsia-700/30 p-3">
                    <Coins className="h-6 w-6 text-purple-400" />
                  </div>
                  <h3 className="font-medium text-lg text-white">Total Supply</h3>
                  <p className="text-2xl font-bold text-white">21,000,000</p>
                  <p className="text-sm text-gray-400">Fixed maximum, perpetually decreasing</p>
                </div>
                
                <div className="space-y-2 flex flex-col items-center text-center p-4 rounded-lg bg-gradient-to-br from-purple-900/20 to-fuchsia-900/10 border border-purple-900/20">
                  <div className="rounded-full bg-gradient-to-r from-purple-700/30 to-fuchsia-700/30 p-3">
                    <Calendar className="h-6 w-6 text-purple-400" />
                  </div>
                  <h3 className="font-medium text-lg text-white">Olympic Cycle</h3>
                  <p className="text-2xl font-bold text-white">4-Year Releases</p>
                  <p className="text-sm text-gray-400">Gold, Silver, Bronze, Diamond, Sovereign</p>
                </div>
                
                <div className="space-y-2 flex flex-col items-center text-center p-4 rounded-lg bg-gradient-to-br from-purple-900/20 to-fuchsia-900/10 border border-purple-900/20">
                  <div className="rounded-full bg-gradient-to-r from-purple-700/30 to-fuchsia-700/30 p-3">
                    <Flame className="h-6 w-6 text-purple-400" />
                  </div>
                  <h3 className="font-medium text-lg text-white">Burning System</h3>
                  <p className="text-2xl font-bold text-white">89.8%</p>
                  <p className="text-sm text-gray-400">Supply reduction over 100 years</p>
                </div>
                
                <div className="space-y-2 flex flex-col items-center text-center p-4 rounded-lg bg-gradient-to-br from-purple-900/20 to-fuchsia-900/10 border border-purple-900/20">
                  <div className="rounded-full bg-gradient-to-r from-purple-700/30 to-fuchsia-700/30 p-3">
                    <Lock className="h-6 w-6 text-purple-400" />
                  </div>
                  <h3 className="font-medium text-lg text-white">Security Rating</h3>
                  <p className="text-2xl font-bold text-white">Military-Grade</p>
                  <p className="text-sm text-gray-400">Multi-chain verification system</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 h-auto bg-black/50 p-1 mb-8 border border-purple-900/30">
            <TabsTrigger value="journey" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-900/50 data-[state=active]:to-fuchsia-900/50">
              <div className="flex flex-col items-center py-1">
                <Timer className="h-4 w-4 mb-1" />
                <span>21-Year Journey</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="olympic" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-900/50 data-[state=active]:to-amber-800/50">
              <div className="flex flex-col items-center py-1">
                <Medal className="h-4 w-4 mb-1" />
                <span>Olympic Vaults</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="verification" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-900/50 data-[state=active]:to-cyan-900/50">
              <div className="flex flex-col items-center py-1">
                <CheckCircle className="h-4 w-4 mb-1" />
                <span>Verification Vaults</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="burning" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-900/50 data-[state=active]:to-orange-900/50">
              <div className="flex flex-col items-center py-1">
                <Flame className="h-4 w-4 mb-1" />
                <span>Burning System</span>
              </div>
            </TabsTrigger>
          </TabsList>
          
          {/* 21-Year Journey Tab */}
          <TabsContent value="journey" className="space-y-8">
            <Card className="border border-purple-900/30">
              <CardHeader className="bg-gradient-to-r from-purple-900/20 to-fuchsia-900/20">
                <div className="flex items-center gap-2">
                  <Timer className="h-5 w-5 text-purple-400" />
                  <CardTitle>The 21-Year Token Journey</CardTitle>
                </div>
                <CardDescription>
                  CVT's revolutionary time-locked distribution model spans 21 years with mathematically guaranteed scarcity
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="relative mb-12 perspective-1000">
                  {/* Enhanced 3D Timeline with Floating Background */}
                  <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 to-fuchsia-900/5 rounded-xl transform-gpu transition-transform duration-1000"></div>
                  
                  {/* 3D Timeline Line with Glowing Effect */}
                  <div className="absolute top-8 left-0 w-full h-1.5 bg-gradient-to-r from-purple-600/30 via-fuchsia-500/40 to-purple-600/30 rounded shadow-lg shadow-purple-500/10 transform-gpu hover:shadow-purple-500/20 transition-all duration-700"></div>
                  
                  {/* Animated Timeline Points */}
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {timeReleaseEvents.map((event, index) => (
                      <div key={index} className="pt-12 pb-2 px-2 relative perspective-card group/timeline-item">
                        {/* Enhanced Timeline Marker with Animation */}
                        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-7 h-7 rounded-full 
                          bg-gradient-to-r from-purple-600 to-fuchsia-600 border-2 border-black z-10 shadow-lg shadow-purple-500/30
                          animate-pulse-slow hover:scale-110 transition-all duration-700">
                          <div className="absolute inset-1 rounded-full bg-black opacity-60"></div>
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600/20 to-fuchsia-600/20 blur-sm"></div>
                        </div>
                        
                        {/* Animated Year Label */}
                        <div className="absolute top-14 left-1/2 transform -translate-x-1/2 text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400
                          group-hover/timeline-item:scale-110 group-hover/timeline-item:text-white transition-all duration-700">
                          Year {event.year}
                        </div>
                        
                        {/* Immersive 3D Event Card with Advanced Effects */}
                        <Card className="relative bg-gradient-to-br from-black/80 to-gray-900/80 border border-purple-900/30 
                          shadow-xl mt-6 transition-all duration-700 transform-gpu 
                          hover:scale-105 hover:translate-y-[-5px] hover:rotate-y-3
                          hover:shadow-purple-500/30 hover:shadow-2xl group perspective-card">
                          {/* 3D Layered Glowing Edges */}
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-xl blur opacity-0 group-hover:opacity-15 transition duration-1000"></div>
                          <div className="absolute -inset-1 bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-xl blur-md opacity-0 group-hover:opacity-10 transition duration-1000 delay-100"></div>
                          <div className="absolute -inset-1.5 bg-gradient-to-tr from-purple-600/20 via-fuchsia-500/20 to-purple-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-5 animate-pulse-slow transition duration-1000 delay-200"></div>
                          
                          <CardHeader className="p-4 relative">
                            <Badge variant="outline" className="bg-purple-900/30 text-purple-300 border-purple-700/50 mb-1 self-start transition-all duration-500 group-hover:bg-purple-900/50">
                              {event.vaultType}
                            </Badge>
                            <CardTitle className="text-md text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-fuchsia-500 transition-all duration-500">
                              {event.specialName}
                            </CardTitle>
                            <CardDescription className="text-xs flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {event.date}
                            </CardDescription>
                          </CardHeader>
                          
                          <CardContent className="p-4 pt-0 space-y-3">
                            <div>
                              <div className="flex justify-between mb-2">
                                <span className="text-sm text-gray-400">Amount:</span>
                                <span className="text-sm font-medium text-white">{event.amount.toLocaleString()} CVT</span>
                              </div>
                              <div className="flex justify-between mb-3">
                                <span className="text-sm text-gray-400">Percentage:</span>
                                <span className="text-sm font-medium text-white">{event.percentage}</span>
                              </div>
                              <p className="text-xs text-gray-300">{event.description}</p>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-2 justify-center">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 text-xs w-1/2 border-purple-900/50 hover:bg-purple-900/20 hover:text-purple-300 transition-all duration-300"
                                onClick={() => document.getElementById(`blockchain-details-${event.year}`)?.classList.toggle('hidden')}
                              >
                                <span className="flex items-center gap-1">
                                  <TrendingUp className="h-3 w-3" />
                                  Blockchain Details
                                </span>
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 text-xs w-1/2 border-purple-900/50 hover:bg-purple-900/20 hover:text-purple-300 transition-all duration-300"
                                onClick={() => document.getElementById(`verification-details-${event.year}`)?.classList.toggle('hidden')}
                              >
                                <span className="flex items-center gap-1">
                                  <ShieldCheck className="h-3 w-3" />
                                  Verification Details
                                </span>
                              </Button>
                            </div>
                            
                            {/* Collapsible Blockchain Details */}
                            <div id={`blockchain-details-${event.year}`} className="hidden pt-2 border-t border-gray-800 transition-all duration-500">
                              <div className="space-y-2">
                                <h4 className="text-xs font-medium text-purple-400 flex items-center gap-1">
                                  <TrendingUp className="h-3 w-3" />
                                  Smart Contract: {event.blockchainDetails.smartContract}
                                </h4>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="bg-black/40 p-2 rounded-md">
                                    <div className="text-xs font-medium text-white mb-1">Ethereum</div>
                                    <div className="text-[10px] text-gray-400 break-all">{event.blockchainDetails.ethereum}</div>
                                  </div>
                                  <div className="bg-black/40 p-2 rounded-md">
                                    <div className="text-xs font-medium text-white mb-1">TON</div>
                                    <div className="text-[10px] text-gray-400 break-all">{event.blockchainDetails.ton}</div>
                                  </div>
                                </div>
                                <div className="bg-black/40 p-2 rounded-md">
                                  <div className="text-xs font-medium text-white mb-1">Solana</div>
                                  <div className="text-[10px] text-gray-400">{event.blockchainDetails.solana}</div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Collapsible Verification Details */}
                            <div id={`verification-details-${event.year}`} className="hidden pt-2 border-t border-gray-800 transition-all duration-500">
                              <div className="space-y-2">
                                <h4 className="text-xs font-medium text-purple-400 flex items-center gap-1">
                                  <ShieldCheck className="h-3 w-3" />
                                  {event.verificationDetails.mechanism}
                                </h4>
                                <div className="grid grid-cols-2 gap-2 text-[10px]">
                                  <div className="bg-black/40 p-2 rounded-md">
                                    <div className="font-medium text-white mb-1">Security Level</div>
                                    <div className="flex items-center gap-1">
                                      <div className="h-1.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-full" style={{width: `${event.verificationDetails.difficulty}%`}}></div>
                                      <span className="text-gray-400">{event.verificationDetails.difficulty}/100</span>
                                    </div>
                                  </div>
                                  <div className="bg-black/40 p-2 rounded-md">
                                    <div className="font-medium text-white mb-1">Validators</div>
                                    <div className="text-purple-400 font-bold">{event.verificationDetails.validators}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-800 space-y-4">
                  <div className="text-sm text-gray-400">
                    <p className="mb-4">
                      Unlike Bitcoin's halving mechanism which reduces new issuance, CVT's distribution model systematically 
                      reduces the amount released from time-locked reserves while simultaneously burning tokens from circulation, 
                      creating mathematical scarcity that intensifies over time.
                    </p>
                    <div className="flex items-start gap-2 text-purple-400">
                      <Lightbulb className="h-4 w-4 mt-1 flex-shrink-0" />
                      <span>Each Olympic vault class represents a major milestone in the 21-year journey, bringing new security features and technological advancements to the platform.</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border border-purple-900/20 bg-gradient-to-br from-black/60 to-gray-900/60">
                      <CardHeader className="p-4">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-purple-400" />
                          <CardTitle className="text-md">Security Evolution</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="space-y-2">
                          {timeReleaseEvents.map((event, index) => (
                            index > 0 && (
                              <div key={index} className="flex items-start gap-2">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-900/30 to-fuchsia-900/30 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5">
                                  {event.year}
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-white">{event.vaultType}</div>
                                  <ul className="text-xs text-gray-400 mt-1">
                                    {event.securityFeatures.map((feature, idx) => (
                                      <li key={idx} className="flex items-center gap-1">
                                        <span className="text-purple-400">•</span> {feature}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            )
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border border-purple-900/20 bg-gradient-to-br from-black/60 to-gray-900/60">
                      <CardHeader className="p-4">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-purple-400" />
                          <CardTitle className="text-md">Supply Transformation</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="h-44 relative">
                          {/* Supply Chart */}
                          <div className="absolute inset-0 flex items-end justify-between gap-1">
                            {burnProjections.filter((_, idx) => idx < 7).map((proj, i) => (
                              <div key={i} className="flex-1 flex flex-col items-center group">
                                {/* Total Supply Bar */}
                                <div 
                                  className="w-full bg-gradient-to-t from-purple-900/50 to-fuchsia-800/50 rounded-t-sm"
                                  style={{ 
                                    height: `${(proj.totalSupply / 21000000) * 100}%`,
                                  }}
                                ></div>
                                
                                {/* Year Label */}
                                <div className="mt-1 text-xs text-gray-500">Y{proj.year}</div>
                                
                                {/* Hover Info */}
                                <div className="absolute bottom-full mb-2 bg-black/90 rounded p-2 text-xs border border-purple-900/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 w-28">
                                  <div className="font-medium text-white">Year {proj.year}</div>
                                  <div className="text-purple-400">Supply: {(proj.totalSupply / 1000000).toFixed(1)}M</div>
                                  <div className="text-red-400">Burned: {(proj.burnedAmount / 1000000).toFixed(1)}M</div>
                                  <div className="text-gray-400">-{proj.percentBurned.toFixed(1)}% total</div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* Grid Lines */}
                          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                            {[0, 25, 50, 75, 100].map((percent, i) => (
                              <div key={i} className="w-full h-px bg-gray-800 flex items-center">
                                <span className="text-[10px] text-gray-500 ml-1">{100 - percent}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mt-4 text-xs text-gray-400 space-y-2">
                          <div className="flex items-center gap-1">
                            <span className="w-3 h-3 bg-gradient-to-r from-purple-700 to-fuchsia-700 rounded-sm"></span>
                            <span>Circulating Supply</span>
                          </div>
                          <p>
                            By combining time-locked releases with automated burning, CVT's supply is projected to decrease by 
                            ~40% by Year 30 and nearly 90% by Year 100, creating true mathematical scarcity.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Olympic Vaults Tab */}
          <TabsContent value="olympic" className="space-y-8">
            <Card className="border border-amber-900/30">
              <CardHeader className="bg-gradient-to-r from-yellow-900/20 to-amber-900/20">
                <div className="flex items-center gap-2">
                  <Medal className="h-5 w-5 text-amber-400" />
                  <CardTitle>Olympic Vaults System</CardTitle>
                </div>
                <CardDescription>
                  Prestigious vault classes inspired by the Olympic games, each unlocking at 4-year intervals with enhanced security
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Olympic Vault Selection */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-amber-400 mb-2">Olympic Vault Classes</h3>
                    {olympicVaults.map(vault => (
                      <Card 
                        key={vault.id}
                        className={`cursor-pointer transition-all border ${
                          activeOlympicId === vault.id 
                            ? 'border-amber-600/50 bg-gradient-to-br from-amber-900/20 to-yellow-900/10' 
                            : 'border-gray-800 hover:border-amber-900/30'
                        }`}
                        onClick={() => setActiveOlympicId(vault.id)}
                      >
                        <CardContent className="p-4 flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${vault.gradientClass}`}>
                            {vault.icon}
                          </div>
                          <div>
                            <h4 className={`font-medium ${activeOlympicId === vault.id ? vault.colorClass : 'text-white'}`}>
                              {vault.name}
                            </h4>
                            <p className="text-xs text-gray-400">
                              Year {vault.unlockYear} Unlock • {vault.tier} Tier
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    <Card className="bg-gradient-to-br from-black/40 to-amber-950/20 border border-amber-900/20">
                      <CardHeader className="p-4">
                        <CardTitle className="text-md flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-amber-400" />
                          4-Year Cycle
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex space-x-1 mb-2">
                          {timeReleaseEvents.slice(1).map((event, i) => (
                            <div key={i} className="flex-1">
                              <div className={`h-2 rounded-sm ${
                                activeOlympic.unlockYear === event.year 
                                  ? activeOlympic.colorClass === 'text-yellow-500' 
                                    ? 'bg-yellow-600' 
                                    : activeOlympic.colorClass === 'text-gray-300' 
                                      ? 'bg-gray-500' 
                                      : 'bg-amber-700'
                                  : 'bg-gray-800'
                              }`}></div>
                              <div className="text-center mt-1">
                                <span className={`text-xs ${
                                  activeOlympic.unlockYear === event.year 
                                    ? activeOlympic.colorClass === 'text-yellow-500' 
                                      ? 'text-yellow-500' 
                                      : activeOlympic.colorClass === 'text-gray-300' 
                                        ? 'text-gray-300' 
                                        : 'text-amber-700'
                                    : 'text-gray-600'
                                }`}>
                                  Y{event.year}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          Like the Olympic Games, each vault class unlocks at 4-year intervals, 
                          introducing new security technologies and verification capabilities.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Olympic Vault Details */}
                  <div className="col-span-2">
                    <Card className="h-full border border-amber-900/20 bg-gradient-to-br from-black/60 to-gray-900/60">
                      <CardHeader className="p-6 border-b border-amber-900/20 bg-gradient-to-r from-amber-900/10 to-yellow-900/5">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-lg ${activeOlympic.gradientClass}`}>
                            {activeOlympic.icon}
                          </div>
                          <div>
                            <Badge variant="outline" className="mb-1 bg-amber-900/20 text-amber-300 border-amber-700/50">
                              {activeOlympic.tier} Class
                            </Badge>
                            <CardTitle className={activeOlympic.colorClass}>{activeOlympic.name}</CardTitle>
                            <CardDescription>Unlocks: Year {activeOlympic.unlockYear} • May 15, {2025 + activeOlympic.unlockYear}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-md font-medium text-white mb-2">Vault Description</h3>
                            <p className="text-gray-300">{activeOlympic.description}</p>
                          </div>
                          
                          <div>
                            <h3 className="text-md font-medium text-white mb-2">Security Features</h3>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {activeOlympic.securityFeatures.map((feature, idx) => (
                                <li key={idx} className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-amber-900/20 flex items-center justify-center flex-shrink-0">
                                    <ShieldCheck className={`h-3.5 w-3.5 ${activeOlympic.colorClass}`} />
                                  </div>
                                  <span className="text-sm text-gray-300">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h3 className="text-sm font-medium text-white mb-2">Scarcity Rating</h3>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-gray-400">Level:</span>
                                  <span className="font-medium text-white">{activeOlympic.scarcityLevel}/100</span>
                                </div>
                                <CustomProgress
                                  value={activeOlympic.scarcityLevel}
                                  className="h-2 bg-black/50"
                                  indicatorClassName={`bg-gradient-to-r ${
                                    activeOlympic.id === 'gold' 
                                      ? 'from-yellow-700 to-amber-500' 
                                      : activeOlympic.id === 'silver' 
                                        ? 'from-gray-500 to-gray-300' 
                                        : 'from-amber-800 to-amber-600'
                                  }`}
                                />
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="text-sm font-medium text-white mb-2">Distribution Phase</h3>
                              <div className="text-sm text-gray-300">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-gray-400">Tokens Unlocked:</span>
                                  <span>
                                    {timeReleaseEvents.find(e => e.year === activeOlympic.unlockYear)?.amount.toLocaleString()} CVT
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-400">Percentage:</span>
                                  <span>
                                    {timeReleaseEvents.find(e => e.year === activeOlympic.unlockYear)?.percentage} of total supply
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="pt-4 border-t border-gray-800">
                            <div className="flex items-start gap-2 text-amber-400 text-sm">
                              <Lightbulb className="h-4 w-4 mt-1 flex-shrink-0" />
                              <span>
                                {activeOlympic.id === 'gold' 
                                  ? 'Gold Olympic Vaults represent the pinnacle of security and prestige in the Chronos ecosystem, available only to early adopters and strategic partners.'
                                  : activeOlympic.id === 'silver'
                                    ? 'Silver Olympic Vaults introduce dual-chain verification technology, enabling cross-chain security with enhanced staking rewards.'
                                    : 'Bronze Olympic Vaults feature advanced multi-signature requirements and automated security audits to protect digital assets.'
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <div className="mt-8">
                  <Card className="border border-amber-900/20 bg-gradient-to-br from-black/60 to-amber-950/10">
                    <CardHeader className="p-4">
                      <CardTitle className="text-md">The Olympic Vault Ecosystem</CardTitle>
                      <CardDescription>
                        A comprehensive overview of how Olympic Vaults integrate with the 21-year token journey
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-sm font-medium text-amber-400 mb-3">The 4-Year Opening Cycle</h3>
                          <p className="text-sm text-gray-300 mb-4">
                            The Olympic Vaults follow a predetermined opening schedule inspired by the four-year Olympic games cycle. 
                            Each phase unlocks new capabilities and technologies, creating a predictable security roadmap.
                          </p>
                          
                          <div className="space-y-3 text-sm">
                            {timeReleaseEvents.slice(1, 4).map((event, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                                  i === 0 ? 'bg-yellow-900/30 text-yellow-500' : 
                                  i === 1 ? 'bg-gray-800/80 text-gray-300' : 
                                  'bg-amber-900/30 text-amber-700'
                                }`}>
                                  <Medal className="h-3 w-3" />
                                </div>
                                <div>
                                  <p className="font-medium text-white">
                                    {i === 0 ? 'Gold Vault' : i === 1 ? 'Silver Vault' : 'Bronze Vault'} (Year {event.year})
                                  </p>
                                  <p className="text-gray-400 text-xs">
                                    {event.specialName} • {event.date}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-amber-400 mb-3">Olympic Security Verification</h3>
                          <p className="text-sm text-gray-300 mb-4">
                            Each Olympic Vault class implements progressively more advanced security verification systems, 
                            from triple-chain verification in Gold to multi-signature requirements in Bronze.
                          </p>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between pb-2 border-b border-gray-800">
                              <span className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                                <span className="font-medium text-yellow-500">Gold Verification</span>
                              </span>
                              <span className="text-gray-300">Triple-Chain</span>
                            </div>
                            <div className="flex items-center justify-between pb-2 border-b border-gray-800">
                              <span className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                                <span className="font-medium text-gray-300">Silver Verification</span>
                              </span>
                              <span className="text-gray-300">Dual-Chain</span>
                            </div>
                            <div className="flex items-center justify-between pb-2 border-b border-gray-800">
                              <span className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-amber-700"></span>
                                <span className="font-medium text-amber-700">Bronze Verification</span>
                              </span>
                              <span className="text-gray-300">Multi-Signature</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 border-t border-amber-900/20 bg-amber-950/10">
                      <div className="flex items-center gap-2 text-xs text-amber-400">
                        <ShieldCheck className="h-4 w-4" />
                        <span>Olympic Vaults form the foundation of Chronos Vault's multi-chain security architecture, providing unprecedented protection for digital assets across time.</span>
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Verification Vaults Tab */}
          <TabsContent value="verification" className="space-y-8">
            <Card className="border border-blue-900/30">
              <CardHeader className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-400" />
                  <CardTitle>Verification Vault System</CardTitle>
                </div>
                <CardDescription>
                  Advanced verification authorities with quantum-resistant technology and military-grade security features
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Verification Vault Selection */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-blue-400 mb-2">Verification Authority Classes</h3>
                    {verificationVaults.map(vault => (
                      <Card 
                        key={vault.id}
                        className={`cursor-pointer transition-all border ${
                          activeVerificationId === vault.id 
                            ? 'border-blue-600/50 bg-gradient-to-br from-blue-900/20 to-cyan-900/10' 
                            : 'border-gray-800 hover:border-blue-900/30'
                        }`}
                        onClick={() => setActiveVerificationId(vault.id)}
                      >
                        <CardContent className="p-4 flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${vault.gradientClass}`}>
                            {vault.icon}
                          </div>
                          <div>
                            <h4 className={`font-medium ${activeVerificationId === vault.id ? vault.colorClass : 'text-white'}`}>
                              {vault.name}
                            </h4>
                            <p className="text-xs text-gray-400">
                              Year {vault.unlockYear} Unlock • {vault.tier} Tier
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    <Card className="bg-gradient-to-br from-black/40 to-blue-950/20 border border-blue-900/20">
                      <CardHeader className="p-4">
                        <CardTitle className="text-md flex items-center gap-2">
                          <Shield className="h-4 w-4 text-blue-400" />
                          Verification System
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-gray-300 mb-3">
                          Verification Vaults establish the holder as a trusted authority within the Chronos network, enabling:
                        </p>
                        <ul className="space-y-1.5 text-sm">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-3.5 w-3.5 text-blue-400" />
                            <span className="text-gray-300">Transaction validation rights</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-3.5 w-3.5 text-blue-400" />
                            <span className="text-gray-300">Quantum-resistant security</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-3.5 w-3.5 text-blue-400" />
                            <span className="text-gray-300">Cross-chain governance participation</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-3.5 w-3.5 text-blue-400" />
                            <span className="text-gray-300">Enhanced reward distribution</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Verification Vault Details */}
                  <div className="col-span-2">
                    <Card className="h-full border border-blue-900/20 bg-gradient-to-br from-black/60 to-gray-900/60">
                      <CardHeader className="p-6 border-b border-blue-900/20 bg-gradient-to-r from-blue-900/10 to-cyan-900/5">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-lg ${activeVerification.gradientClass}`}>
                            {activeVerification.icon}
                          </div>
                          <div>
                            <Badge variant="outline" className="mb-1 bg-blue-900/20 text-blue-300 border-blue-700/50">
                              {activeVerification.tier} Verification
                            </Badge>
                            <CardTitle className={activeVerification.colorClass}>{activeVerification.name}</CardTitle>
                            <CardDescription>Activates: Year {activeVerification.unlockYear} • May 15, {2025 + activeVerification.unlockYear}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-md font-medium text-white mb-2">Vault Description</h3>
                            <p className="text-gray-300">{activeVerification.description}</p>
                          </div>
                          
                          <div>
                            <h3 className="text-md font-medium text-white mb-2">Verification Capabilities</h3>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {activeVerification.verificationFeatures.map((feature, idx) => (
                                <li key={idx} className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle className={`h-3.5 w-3.5 ${activeVerification.colorClass}`} />
                                  </div>
                                  <span className="text-sm text-gray-300">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h3 className="text-sm font-medium text-white mb-2">Security Rating</h3>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-gray-400">Level:</span>
                                  <span className="font-medium text-white">{activeVerification.securityLevel}/100</span>
                                </div>
                                <CustomProgress
                                  value={activeVerification.securityLevel}
                                  className="h-2 bg-black/50"
                                  indicatorClassName={`bg-gradient-to-r ${
                                    activeVerification.id === 'diamond' 
                                      ? 'from-blue-700 to-cyan-500' 
                                      : 'from-purple-700 to-fuchsia-600'
                                  }`}
                                />
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="text-sm font-medium text-white mb-2">Distribution Phase</h3>
                              <div className="text-sm text-gray-300">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-gray-400">Tokens Unlocked:</span>
                                  <span>
                                    {timeReleaseEvents.find(e => e.year === activeVerification.unlockYear)?.amount.toLocaleString()} CVT
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-400">Percentage:</span>
                                  <span>
                                    {timeReleaseEvents.find(e => e.year === activeVerification.unlockYear)?.percentage} of total supply
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="pt-4 border-t border-gray-800">
                            <div className="flex items-start gap-2 text-blue-400 text-sm">
                              <Lightbulb className="h-4 w-4 mt-1 flex-shrink-0" />
                              <span>
                                {activeVerification.id === 'diamond' 
                                  ? 'Diamond Verification Vaults introduce quantum-resistant technology that future-proofs digital assets against advances in quantum computing threats.'
                                  : 'Sovereign Fortress Vaults represent the pinnacle of security with military-grade protection and complete sovereignty over digital assets.'
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <div className="mt-8">
                  <Card className="border border-blue-900/20 bg-gradient-to-br from-black/60 to-blue-950/10">
                    <CardHeader className="p-4">
                      <CardTitle className="text-md">Verification Authority Network</CardTitle>
                      <CardDescription>
                        How verification vaults establish a trustless security framework within the Chronos ecosystem
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-sm font-medium text-blue-400 mb-3">Verification Mechanics</h3>
                          <p className="text-sm text-gray-300 mb-4">
                            Verification Vaults establish a network of trusted verification authorities that collectively 
                            validate transactions and security parameters across the Chronos ecosystem, creating a 
                            decentralized security framework.
                          </p>
                          
                          <div className="space-y-3 text-sm">
                            <div className="p-3 bg-blue-900/10 border border-blue-900/20 rounded-lg">
                              <h4 className="font-medium text-blue-400 mb-1">Diamond Verification Process</h4>
                              <p className="text-xs text-gray-300">
                                Quantum-resistant cryptography powers the Diamond verification process, enabling secure 
                                transaction validation even against future quantum computing threats. Vault holders serve 
                                as trusted verification nodes within the network.
                              </p>
                            </div>
                            
                            <div className="p-3 bg-purple-900/10 border border-purple-900/20 rounded-lg">
                              <h4 className="font-medium text-purple-400 mb-1">Sovereign Verification Authority</h4>
                              <p className="text-xs text-gray-300">
                                Sovereign Fortress Vaults implement military-grade security with global jurisdiction protection, 
                                enabling secure asset management across international boundaries with comprehensive verification 
                                capabilities.
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-blue-400 mb-3">Verification Timeline</h3>
                          <div className="relative pb-2">
                            {/* Timeline */}
                            <div className="absolute left-[18px] top-0 bottom-0 w-px bg-blue-900/30"></div>
                            
                            {/* Timeline Points */}
                            <div className="space-y-5">
                              <div className="flex gap-3">
                                <div className="w-9 h-9 rounded-full bg-black border-2 border-blue-600 flex items-center justify-center z-10">
                                  <span className="text-xs font-bold text-blue-400">Y16</span>
                                </div>
                                <div className="pt-1">
                                  <p className="font-medium text-blue-400">Diamond Verification Activation</p>
                                  <p className="text-xs text-gray-300">May 15, 2041</p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    Quantum-resistant verification protocol established
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex gap-3">
                                <div className="w-9 h-9 rounded-full bg-black border-2 border-purple-600 flex items-center justify-center z-10">
                                  <span className="text-xs font-bold text-purple-400">Y21</span>
                                </div>
                                <div className="pt-1">
                                  <p className="font-medium text-purple-400">Sovereign Verification Completion</p>
                                  <p className="text-xs text-gray-300">May 15, 2046</p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    Military-grade security framework completed
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex gap-3">
                                <div className="w-9 h-9 rounded-full bg-black border-2 border-green-600 flex items-center justify-center z-10">
                                  <span className="text-xs font-bold text-green-400">Y30</span>
                                </div>
                                <div className="pt-1">
                                  <p className="font-medium text-green-400">Verification Network Maturity</p>
                                  <p className="text-xs text-gray-300">May 15, 2055</p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    Complete verification ecosystem established
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 border-t border-blue-900/20 bg-blue-950/10">
                      <div className="flex items-center gap-2 text-xs text-blue-400">
                        <ShieldCheck className="h-4 w-4" />
                        <span>Verification Vaults establish a network of trusted authorities that collectively ensure the security and integrity of the entire Chronos ecosystem.</span>
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Burning System Tab */}
          <TabsContent value="burning" className="space-y-8">
            <Card className="border border-red-900/30">
              <CardHeader className="bg-gradient-to-r from-red-900/20 to-orange-900/20">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-red-400" />
                  <CardTitle>Revolutionary Burning System</CardTitle>
                </div>
                <CardDescription>
                  A deflationary mechanism that permanently removes tokens from circulation, creating mathematical scarcity
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <Card className="border border-red-900/20 bg-gradient-to-br from-black/60 to-red-950/10">
                    <CardHeader className="p-4">
                      <div className="flex items-center gap-2">
                        <Flame className="h-4 w-4 text-red-400" />
                        <CardTitle className="text-md">Burning Mechanics</CardTitle>
                      </div>
                      <CardDescription>
                        How the automated burning system creates true token scarcity
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="space-y-4">
                        <p className="text-gray-300 text-sm">
                          Unlike traditional fixed-supply tokens, CVT implements an actively deflationary model where total 
                          supply continually decreases through an automated burning system:
                        </p>
                        
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-red-900/20 flex items-center justify-center flex-shrink-0">
                              <TrendingUp className="h-4 w-4 text-red-400" />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-white">Fee Capture</h4>
                              <p className="text-xs text-gray-400">
                                60% of all platform fees are allocated to token buybacks, converting transaction 
                                fees directly into burned tokens
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-red-900/20 flex items-center justify-center flex-shrink-0">
                              <ArrowRight className="h-4 w-4 text-red-400" />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-white">Automated Process</h4>
                              <p className="text-xs text-gray-400">
                                Smart contracts automatically purchase CVT tokens from liquidity pools and 
                                permanently burn them on a weekly schedule
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-red-900/20 flex items-center justify-center flex-shrink-0">
                              <Shield className="h-4 w-4 text-red-400" />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-white">Verifiable Burns</h4>
                              <p className="text-xs text-gray-400">
                                All token burns are publicly verifiable on-chain with complete transparency 
                                through the burning dashboard
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-red-900/20 flex items-center justify-center flex-shrink-0">
                              <Flame className="h-4 w-4 text-red-400" />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-white">Perpetual Scarcity</h4>
                              <p className="text-xs text-gray-400">
                                Target burn rate of 2% of circulating supply annually, creating mathematical 
                                scarcity that intensifies over time
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <div className="pt-4 border-t border-red-900/20">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-400">Total Supply Reduction (100Y):</span>
                          <span className="font-medium text-red-400">89.8% of Maximum Supply</span>
                        </div>
                        <CustomProgress value={89.8} className="h-2 bg-black/50" indicatorClassName="bg-gradient-to-r from-red-700 to-orange-500" />
                      </div>
                    </CardFooter>
                  </Card>
                  
                  <Card className="border border-red-900/20 bg-gradient-to-br from-black/60 to-red-950/10">
                    <CardHeader className="p-4">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-red-400" />
                        <CardTitle className="text-md">Supply Projection</CardTitle>
                      </div>
                      <CardDescription>
                        Projected supply reduction over the next 100 years
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="h-64 relative mb-4">
                        {/* Supply Chart */}
                        <div className="absolute inset-0 flex items-end justify-between gap-1">
                          {burnProjections.map((proj, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center group">
                              {/* Supply Bar */}
                              <div className="relative w-full">
                                {/* Total Supply Bar */}
                                <div 
                                  className="w-full bg-gradient-to-t from-blue-900/50 to-purple-800/50 rounded-t-sm"
                                  style={{ 
                                    height: `${(proj.totalSupply / 21000000) * 100}%`,
                                  }}
                                ></div>
                                
                                {/* Burned Amount Overlay */}
                                <div 
                                  className="absolute bottom-0 w-full bg-gradient-to-t from-red-700/50 to-orange-600/50 rounded-t-sm"
                                  style={{ 
                                    height: `${(proj.burnedAmount / 21000000) * 100}%`,
                                  }}
                                ></div>
                              </div>
                              
                              {/* Year Label */}
                              <div className="mt-1 text-xs text-gray-500">Y{proj.year}</div>
                              
                              {/* Hover Info */}
                              <div className="absolute bottom-full mb-2 bg-black/90 rounded p-2 text-xs border border-red-900/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 w-28">
                                <div className="font-medium text-white">Year {proj.year}</div>
                                <div className="text-purple-400">Supply: {(proj.totalSupply / 1000000).toFixed(1)}M</div>
                                <div className="text-red-400">Burned: {(proj.burnedAmount / 1000000).toFixed(1)}M</div>
                                <div className="text-gray-400">-{proj.percentBurned.toFixed(1)}% total</div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Grid Lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                          {[0, 25, 50, 75, 100].map((percent, i) => (
                            <div key={i} className="w-full h-px bg-gray-800 flex items-center">
                              <span className="text-[10px] text-gray-500 ml-1">{100 - percent}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-center gap-6 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-blue-700 to-purple-700"></div>
                          <span className="text-xs text-gray-300">Circulating Supply</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-red-700 to-orange-600"></div>
                          <span className="text-xs text-gray-300">Burned Tokens</span>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-400">
                        <p className="text-center">
                          By combining time-locked releases with automated burning, CVT's supply is projected to decrease by 
                          ~40% by Year 30 and nearly 90% by Year 100, creating true mathematical scarcity.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="border border-red-900/20 bg-gradient-to-br from-black/60 to-red-950/10">
                  <CardHeader className="p-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-red-400" />
                      <CardTitle className="text-md">Smart Contract Burning Implementation</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="bg-black/60 rounded p-4 font-mono text-xs text-gray-300 overflow-auto h-64 border border-gray-800">
                          <pre>
{`// Automated buyback and burn contract
contract CVTBuybackBurner {
  using SafeERC20 for IERC20;
  
  IERC20 public cvtToken;
  IERC20 public stablecoin;
  address public uniswapRouter;
  address public treasury;
  
  event TokensBurned(uint256 amount);
  
  constructor(
    address _cvtToken,
    address _stablecoin,
    address _uniswapRouter,
    address _treasury
  ) {
    cvtToken = IERC20(_cvtToken);
    stablecoin = IERC20(_stablecoin);
    uniswapRouter = _uniswapRouter;
    treasury = _treasury;
  }
  
  function executeBuyback(uint256 amount) 
    external onlyTreasury {
    // Transfer stablecoins from treasury
    stablecoin.safeTransferFrom(
      treasury, address(this), amount
    );
    
    // Approve router to spend stablecoins
    stablecoin.approve(uniswapRouter, amount);
    
    // Execute swap to buy CVT tokens
    uint256 cvtAmount = _swapStableForCVT(amount);
    
    // Burn the purchased CVT tokens
    cvtToken.burn(cvtAmount);
    
    emit TokensBurned(cvtAmount);
  }
}`}
                          </pre>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <p className="text-sm text-gray-300">
                          The burning mechanism is implemented as an autonomous smart contract system that operates across 
                          multiple blockchains (TON, Ethereum, and Solana) to ensure consistent deflationary pressure.
                        </p>
                        
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium text-white">Weekly Burning Schedule</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">1. Fee Collection</span>
                              <span className="text-gray-300">60% of all platform fees</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">2. Token Purchase</span>
                              <span className="text-gray-300">DEX liquidity pools</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">3. Permanent Burning</span>
                              <span className="text-gray-300">Verifiable on-chain</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">4. Supply Reduction</span>
                              <span className="text-gray-300">~2% annually</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-red-900/10 border border-red-900/20 rounded-lg">
                          <h4 className="text-sm font-medium text-red-400 mb-1 flex items-center gap-1">
                            <Flame className="h-3.5 w-3.5" />
                            Important Note
                          </h4>
                          <p className="text-xs text-gray-300">
                            All burning transactions are irreversible and permanently remove tokens from circulation.
                            The immutable smart contracts ensure this process cannot be altered or reversed.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="mt-8">
                  <Card className="border border-red-900/20 bg-gradient-to-br from-black/60 to-red-950/10">
                    <CardHeader className="p-4">
                      <CardTitle className="text-md">Token Burning vs. Traditional Models</CardTitle>
                      <CardDescription>
                        How CVT's deflationary model compares to traditional cryptocurrency models
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="border border-red-900/30 bg-gradient-to-b from-black/60 to-red-950/10">
                          <CardHeader className="p-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                              <Flame className="h-4 w-4 text-red-400" />
                              CVT Burning Model
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-3 pt-0 text-xs text-gray-300">
                            <ul className="space-y-1">
                              <li className="flex items-center gap-1.5">
                                <span className="text-red-400">•</span>
                                <span>Fixed max supply (21M)</span>
                              </li>
                              <li className="flex items-center gap-1.5">
                                <span className="text-red-400">•</span>
                                <span>Active burning decreases supply</span>
                              </li>
                              <li className="flex items-center gap-1.5">
                                <span className="text-red-400">•</span>
                                <span>Supply projected to decrease 89.8%</span>
                              </li>
                              <li className="flex items-center gap-1.5">
                                <span className="text-red-400">•</span>
                                <span>Mathematical scarcity intensifies over time</span>
                              </li>
                            </ul>
                          </CardContent>
                        </Card>
                        
                        <Card className="border border-amber-900/30 bg-gradient-to-b from-black/60 to-amber-950/10">
                          <CardHeader className="p-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                              <Coins className="h-4 w-4 text-amber-400" />
                              Bitcoin Model
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-3 pt-0 text-xs text-gray-300">
                            <ul className="space-y-1">
                              <li className="flex items-center gap-1.5">
                                <span className="text-amber-400">•</span>
                                <span>Fixed max supply (21M)</span>
                              </li>
                              <li className="flex items-center gap-1.5">
                                <span className="text-amber-400">•</span>
                                <span>Decreasing issuance via halving</span>
                              </li>
                              <li className="flex items-center gap-1.5">
                                <span className="text-amber-400">•</span>
                                <span>Supply approaches but never exceeds 21M</span>
                              </li>
                              <li className="flex items-center gap-1.5">
                                <span className="text-amber-400">•</span>
                                <span>No active supply reduction mechanism</span>
                              </li>
                            </ul>
                          </CardContent>
                        </Card>
                        
                        <Card className="border border-blue-900/30 bg-gradient-to-b from-black/60 to-blue-950/10">
                          <CardHeader className="p-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                              <BarChart3 className="h-4 w-4 text-blue-400" />
                              Inflationary Models
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-3 pt-0 text-xs text-gray-300">
                            <ul className="space-y-1">
                              <li className="flex items-center gap-1.5">
                                <span className="text-blue-400">•</span>
                                <span>Unlimited or very high maximum supply</span>
                              </li>
                              <li className="flex items-center gap-1.5">
                                <span className="text-blue-400">•</span>
                                <span>Continuous token issuance</span>
                              </li>
                              <li className="flex items-center gap-1.5">
                                <span className="text-blue-400">•</span>
                                <span>Supply increases indefinitely</span>
                              </li>
                              <li className="flex items-center gap-1.5">
                                <span className="text-blue-400">•</span>
                                <span>Value dilution over time</span>
                              </li>
                            </ul>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 border-t border-red-900/20 bg-red-950/10">
                      <div className="flex items-center gap-2 text-xs text-red-400">
                        <ShieldCheck className="h-4 w-4" />
                        <span>CVT's revolutionary burning model creates true mathematical scarcity that intensifies over time, unlike any other token in the market.</span>
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Container>
    </>
  );
};

export default TokenVaultsPage;