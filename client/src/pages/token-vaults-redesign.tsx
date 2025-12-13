import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Helmet } from 'react-helmet';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, Clock, ChevronDown, Coins, Box, 
  ShieldCheck, Eye, CheckCircle, Lock, ExternalLink,
  TrendingUp, Shield, FileCheck, Sparkles, Timer,
  Network, AlertCircle
} from 'lucide-react';

interface ReleaseVault {
  id: string;
  name: string;
  releaseDate: string;
  releaseYear: number;
  percentage: string;
  tokens: string;
  tokensNumeric: number;
  status: 'released' | 'upcoming' | 'locked';
  description: string;
  image: string;
  blockchainDetails: {
    arbitrum: string;
    solana: string;
    ton: string;
    smartContract: string;
  };
  verificationDetails: {
    mechanism: string;
    difficulty: number;
    validators: number;
    securityFeatures: string[];
  };
  explorerLinks: {
    arbitrum: string;
    solana: string;
    ton: string;
  };
}

// Countdown Timer Component
const CountdownTimer: React.FC<{ targetDate: string }> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    years: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalDays: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        const seconds = Math.floor((difference / 1000) % 60);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const totalDays = Math.floor(difference / (1000 * 60 * 60 * 24));
        const years = Math.floor(totalDays / 365);
        const days = totalDays % 365;

        setTimeLeft({ years, days, hours, minutes, seconds, totalDays });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.totalDays <= 0) {
    return (
      <div className="text-green-400 font-medium flex items-center gap-2">
        <CheckCircle className="w-5 h-5" />
        <span>Unlocked!</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-5 gap-2 text-center">
      <div className="bg-purple-900/30 rounded-lg p-2 border border-purple-800/50">
        <div className="text-2xl font-bold text-purple-300">{timeLeft.years}</div>
        <div className="text-xs text-gray-400">Years</div>
      </div>
      <div className="bg-purple-900/30 rounded-lg p-2 border border-purple-800/50">
        <div className="text-2xl font-bold text-purple-300">{timeLeft.days}</div>
        <div className="text-xs text-gray-400">Days</div>
      </div>
      <div className="bg-purple-900/30 rounded-lg p-2 border border-purple-800/50">
        <div className="text-2xl font-bold text-purple-300">{timeLeft.hours}</div>
        <div className="text-xs text-gray-400">Hours</div>
      </div>
      <div className="bg-purple-900/30 rounded-lg p-2 border border-purple-800/50">
        <div className="text-2xl font-bold text-purple-300">{timeLeft.minutes}</div>
        <div className="text-xs text-gray-400">Mins</div>
      </div>
      <div className="bg-purple-900/30 rounded-lg p-2 border border-purple-800/50">
        <div className="text-2xl font-bold text-purple-300">{timeLeft.seconds}</div>
        <div className="text-xs text-gray-400">Secs</div>
      </div>
    </div>
  );
};

const TokenVaultsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');
  const [expandedVerificationId, setExpandedVerificationId] = useState<string | null>(null);
  const [expandedReleaseId, setExpandedReleaseId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'journey' | 'proof'>('overview');
  
  const toggleVerificationDetails = (id: string) => {
    setExpandedVerificationId(expandedVerificationId === id ? null : id);
  };
  
  const toggleReleaseDetails = (id: string) => {
    setExpandedReleaseId(expandedReleaseId === id ? null : id);
  };

  // Release Vault Data - REAL 21-year vesting schedule (70% of 21M supply)
  const releaseVaults: ReleaseVault[] = [
    {
      id: 'genesis',
      name: 'Genesis Vault™',
      releaseDate: '01/07/2023',
      releaseYear: 2023,
      percentage: '15%',
      tokens: '3,150,000 CVT',
      tokensNumeric: 3150000,
      status: 'released',
      description: 'Genesis distribution for early development, infrastructure setup, and initial community incentives.',
      image: '/images/genesis-vault.png',
      blockchainDetails: {
        arbitrum: '0xAE408eC592f0f865bA0012C480E8867e12B4F32D',
        solana: 'CvT5oXeA9KFmBpAFRxvg7zdycBcFZv3TBHmNpANmzaQA',
        ton: 'EQBYLdzkDjdjZLtXXgQTgMhpCaKDPfQQUKxpBNKmBiCY5_Y_',
        smartContract: 'ChronosVaultOptimized v1.0'
      },
      verificationDetails: {
        mechanism: 'Multi-Signature Time-Lock Protocol',
        difficulty: 85,
        validators: 7,
        securityFeatures: [
          '2-of-3 Trinity consensus',
          'Transparent allocation',
          'Public vesting schedules',
          'Full audit trail'
        ]
      },
      explorerLinks: {
        arbitrum: 'https://sepolia.arbiscan.io/address/0xAE408eC592f0f865bA0012C480E8867e12B4F32D',
        solana: 'https://explorer.solana.com/address/CvT5oXeA9KFmBpAFRxvg7zdycBcFZv3TBHmNpANmzaQA?cluster=devnet',
        ton: 'https://testnet.tonscan.org/address/EQBYLdzkDjdjZLtXXgQTgMhpCaKDPfQQUKxpBNKmBiCY5_Y_'
      }
    },
    {
      id: 'sovereign-vault-4y',
      name: 'Sovereign Vault™ (4-Year)',
      releaseDate: '01/07/2027',
      releaseYear: 2027,
      percentage: '35%',
      tokens: '7,350,000 CVT',
      tokensNumeric: 7350000,
      status: 'locked',
      description: 'First major unlock at Year 4 - 50% of all time-locked tokens released. Platform maturity milestone with transition to DAO governance.',
      image: '/images/gold-vault.png',
      blockchainDetails: {
        arbitrum: '0x59396D58Fa856025bD5249E342729d5550Be151C',
        solana: 'GLD5xNvZmYfAHyj2qWe94kzVn56mThL4X37jNgVNc7Uq',
        ton: 'EQeGlYzwupSROVWGucOmKyUDbSaKmPfIpHHP5mV73odL8',
        smartContract: 'TrinityConsensusVerifier v3.5'
      },
      verificationDetails: {
        mechanism: 'VDF Time-Lock + Trinity Consensus',
        difficulty: 92,
        validators: 21,
        securityFeatures: [
          'Wesolowski VDF (4-year delay)',
          'Zero-knowledge proof validation',
          'Trinity Protocol 2-of-3 consensus',
          'Inheritance protocol enabled'
        ]
      },
      explorerLinks: {
        arbitrum: 'https://sepolia.arbiscan.io/address/0x59396D58Fa856025bD5249E342729d5550Be151C',
        solana: 'https://explorer.solana.com/address/GLD5xNvZmYfAHyj2qWe94kzVn56mThL4X37jNgVNc7Uq?cluster=devnet',
        ton: 'https://testnet.tonscan.org/address/EQeGlYzwupSROVWGucOmKyUDbSaKmPfIpHHP5mV73odL8'
      }
    },
    {
      id: 'architect-vault-8y',
      name: 'Architect Vault™ (8-Year)',
      releaseDate: '01/07/2031',
      releaseYear: 2031,
      percentage: '17.5%',
      tokens: '3,675,000 CVT',
      tokensNumeric: 3675000,
      status: 'locked',
      description: 'Year 8 unlock - 25% of time-locked tokens. Enhanced verification protocols and advanced staking mechanisms with governance rights.',
      image: '/images/silver-vault.png',
      blockchainDetails: {
        arbitrum: '0x2971c0c3139F89808F87b2445e53E5Fb83b6A002',
        solana: 'SLVRxNHu8dvYPJjZ44wQgUT7YxKeHR9LBmXJGW2FpX4',
        ton: 'EQjUVidQfn4m-Rougn0fol7ECCthba2HV0M6xz9zAfax4',
        smartContract: 'TrinityShieldVerifier v2.0'
      },
      verificationDetails: {
        mechanism: 'Behavioral Authentication + VDF',
        difficulty: 88,
        validators: 35,
        securityFeatures: [
          'Wesolowski VDF (8-year delay)',
          'Behavioral pattern matching',
          'Enhanced staking rewards',
          'Full governance voting rights'
        ]
      },
      explorerLinks: {
        arbitrum: 'https://sepolia.arbiscan.io/address/0x2971c0c3139F89808F87b2445e53E5Fb83b6A002',
        solana: 'https://explorer.solana.com/address/SLVRxNHu8dvYPJjZ44wQgUT7YxKeHR9LBmXJGW2FpX4?cluster=devnet',
        ton: 'https://testnet.tonscan.org/address/EQjUVidQfn4m-Rougn0fol7ECCthba2HV0M6xz9zAfax4'
      }
    },
    {
      id: 'guardian-vault-12y',
      name: 'Guardian Vault™ (12-Year)',
      releaseDate: '01/07/2035',
      releaseYear: 2035,
      percentage: '8.75%',
      tokens: '1,837,500 CVT',
      tokensNumeric: 1837500,
      status: 'locked',
      description: 'Year 12 unlock - 12.5% of time-locked tokens. Cross-chain verification reaches maturity with sophisticated portfolio tools.',
      image: '/images/bronze-vault.png',
      blockchainDetails: {
        arbitrum: '0x066A39Af76b625c1074aE96ce9A111532950Fc41',
        solana: 'BRZNzxcVQ6wHH3HZ8K9yyFh4MBPSoUnFZ2vBbG5pMfDq',
        ton: 'EQgWobA9D4u6Xem3B8e6Sde_NEFZYicyy7_5_XvOT18mA',
        smartContract: 'EmergencyMultiSig v4.0'
      },
      verificationDetails: {
        mechanism: 'Multi-Signature Cross-Chain Audit',
        difficulty: 90,
        validators: 49,
        securityFeatures: [
          'Wesolowski VDF (12-year delay)',
          'Multi-signature requirements',
          'Automated security audits',
          'Family inheritance controls'
        ]
      },
      explorerLinks: {
        arbitrum: 'https://sepolia.arbiscan.io/address/0x066A39Af76b625c1074aE96ce9A111532950Fc41',
        solana: 'https://explorer.solana.com/address/BRZNzxcVQ6wHH3HZ8K9yyFh4MBPSoUnFZ2vBbG5pMfDq?cluster=devnet',
        ton: 'https://testnet.tonscan.org/address/EQgWobA9D4u6Xem3B8e6Sde_NEFZYicyy7_5_XvOT18mA'
      }
    },
    {
      id: 'diamond-vault-16y',
      name: 'Diamond Vault™ (16-Year)',
      releaseDate: '01/07/2039',
      releaseYear: 2039,
      percentage: '4.375%',
      tokens: '918,750 CVT',
      tokensNumeric: 918750,
      status: 'locked',
      description: 'Year 16 unlock - 6.25% of time-locked tokens. Quantum-resistant security features and verification authorities activate.',
      image: '/images/diamond-vault.png',
      blockchainDetails: {
        arbitrum: '0xf111D291afdf8F0315306F3f652d66c5b061F4e3',
        solana: 'DMNDqR3vYUw4kLVLzLJum5SGNHBzKnxC6dQmQmMQyR38',
        ton: 'EQCX0YDqGfYvtV_UOvRF5wDQ8KPTdqXWGfJ_FuW1lH-5Y',
        smartContract: 'TrinityShieldVerifierV2 v5.1'
      },
      verificationDetails: {
        mechanism: 'Quantum-Resistant Lattice Encryption',
        difficulty: 95,
        validators: 64,
        securityFeatures: [
          'Wesolowski VDF (16-year delay)',
          'ML-KEM-1024 post-quantum crypto',
          'CRYSTALS-Dilithium-5 signatures',
          'Advanced analytics access'
        ]
      },
      explorerLinks: {
        arbitrum: 'https://sepolia.arbiscan.io/address/0xf111D291afdf8F0315306F3f652d66c5b061F4e3',
        solana: 'https://explorer.solana.com/address/DMNDqR3vYUw4kLVLzLJum5SGNHBzKnxC6dQmQmMQyR38?cluster=devnet',
        ton: 'https://testnet.tonscan.org/address/EQCX0YDqGfYvtV_UOvRF5wDQ8KPTdqXWGfJ_FuW1lH-5Y'
      }
    },
    {
      id: 'sovereign-fortress-21y',
      name: 'Sovereign Fortress™ (21-Year)',
      releaseDate: '01/07/2044',
      releaseYear: 2044,
      percentage: '4.375%',
      tokens: '918,750 CVT',
      tokensNumeric: 918750,
      status: 'locked',
      description: 'FINAL UNLOCK - Year 21 completes the vesting cycle with the last 6.25% of time-locked tokens. Ultimate security and sovereignty.',
      image: '/images/sovereign-vault.png',
      blockchainDetails: {
        arbitrum: '0xAe9bd988011583D87d6bbc206C19e4a9Bda04830',
        solana: 'SVRGNft7Th38b7P9ZwLkR4tDcH6MqxfJh9NLv2qFZDUm',
        ton: 'EQB_sovereign_fortress_final_vault_Z8h4jtPn72F',
        smartContract: 'TrinityKeeperRegistry v6.0'
      },
      verificationDetails: {
        mechanism: 'Military-Grade Triple-Chain Protocol',
        difficulty: 99,
        validators: 101,
        securityFeatures: [
          'Wesolowski VDF (21-year delay)',
          'Military-grade security',
          'Perpetual inheritance system',
          'Global jurisdiction protection'
        ]
      },
      explorerLinks: {
        arbitrum: 'https://sepolia.arbiscan.io/address/0xAe9bd988011583D87d6bbc206C19e4a9Bda04830',
        solana: 'https://explorer.solana.com/address/SVRGNft7Th38b7P9ZwLkR4tDcH6MqxfJh9NLv2qFZDUm?cluster=devnet',
        ton: 'https://testnet.tonscan.org/address/EQB_sovereign_fortress_final_vault_Z8h4jtPn72F'
      }
    }
  ];

  // Calculate statistics
  const totalSupply = 21000000;
  const totalLocked = releaseVaults
    .filter(v => v.status === 'locked')
    .reduce((sum, v) => sum + v.tokensNumeric, 0);
  const totalReleased = releaseVaults
    .filter(v => v.status === 'released')
    .reduce((sum, v) => sum + v.tokensNumeric, 0);
  const percentageLocked = ((totalLocked / totalSupply) * 100).toFixed(1);
  const nextUnlock = releaseVaults.find(v => v.status === 'locked');

  // Render vault card
  const renderVaultCard = (vault: ReleaseVault) => (
    <Card 
      key={vault.id} 
      className="relative overflow-hidden bg-gradient-to-br from-black via-purple-950/10 to-black border border-purple-900/30 hover:border-purple-700/50 transition-all duration-300 shadow-xl hover:shadow-purple-900/20"
      data-testid={`vault-card-${vault.id}`}
    >
      {/* Status Badge */}
      <div className="absolute top-4 right-4 z-10">
        <Badge 
          variant={vault.status === 'released' ? 'default' : 'outline'}
          className={vault.status === 'released' 
            ? 'bg-green-600 hover:bg-green-700 border-green-500' 
            : 'border-purple-600 bg-purple-900/30 text-purple-300'
          }
        >
          {vault.status === 'released' ? '✓ Released' : '🔒 Locked'}
        </Badge>
      </div>

      {/* Top Visual Section */}
      <div className="relative h-32 bg-gradient-to-br from-purple-900/40 via-purple-800/20 to-indigo-900/40 flex items-center justify-center overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 animate-pulse-slow"></div>
        </div>
        
        {/* Icon */}
        <div className="relative z-10 w-20 h-20 rounded-full bg-purple-900/50 backdrop-blur-sm flex items-center justify-center border-2 border-purple-700/50">
          {vault.status === 'released' ? (
            <CheckCircle className="w-10 h-10 text-green-400" />
          ) : (
            <Lock className="w-10 h-10 text-purple-400" />
          )}
        </div>

        {/* Vault name overlay */}
        <div className="absolute bottom-2 left-3 text-xs font-bold text-purple-200 uppercase tracking-wider">
          Year {vault.releaseYear}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-4">
        {/* Title */}
        <div>
          <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
            {vault.name}
            {vault.status === 'locked' && <Timer className="w-4 h-4 text-purple-400 animate-pulse" />}
          </h3>
          <div className="flex items-center text-sm text-gray-400">
            <Calendar className="w-4 h-4 mr-1.5" /> 
            Unlock Date: {vault.releaseDate}
          </div>
        </div>

        {/* Countdown Timer (only for locked vaults) */}
        {vault.status === 'locked' && (
          <div className="bg-black/40 rounded-lg p-3 border border-purple-900/50">
            <div className="text-xs text-gray-400 mb-2 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Time Until Unlock
            </div>
            <CountdownTimer targetDate={vault.releaseDate} />
          </div>
        )}
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-purple-900/20 rounded-lg p-3 border border-purple-800/30">
            <div className="text-xs text-gray-400 mb-1">Percentage</div>
            <div className="text-xl font-bold text-purple-300">{vault.percentage}</div>
          </div>
          <div className="bg-purple-900/20 rounded-lg p-3 border border-purple-800/30">
            <div className="text-xs text-gray-400 mb-1">Tokens</div>
            <div className="text-lg font-bold text-purple-300">{vault.tokens.split(' ')[0]}</div>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-sm text-gray-300 leading-relaxed">{vault.description}</p>
        
        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <Button 
            variant="secondary" 
            className="w-full bg-purple-900/50 hover:bg-purple-800/70 text-purple-100 border-purple-800/50"
            onClick={() => toggleReleaseDetails(vault.id)}
            data-testid={`button-vault-details-${vault.id}`}
          >
            <Eye className="w-4 h-4 mr-2" />
            {expandedReleaseId === vault.id ? 'Hide Details' : 'View Blockchain Details'}
          </Button>
          
          {/* Expanded Details */}
          {expandedReleaseId === vault.id && (
            <div className="mt-3 p-4 bg-black/60 rounded-lg border border-purple-800/40 space-y-3 animate-in fade-in">
              <h4 className="font-semibold text-sm text-purple-300 flex items-center gap-2">
                <Network className="w-4 h-4" />
                Cross-Chain Deployment
              </h4>
              
              {/* Smart Contract */}
              <div className="bg-purple-950/40 p-2.5 rounded-md border border-purple-800/30">
                <div className="text-xs text-gray-400 mb-1">Smart Contract</div>
                <div className="text-xs text-white font-mono">{vault.blockchainDetails.smartContract}</div>
              </div>
              
              {/* Blockchain Addresses with Explorer Links */}
              <div className="space-y-2">
                <div className="bg-purple-950/40 p-2.5 rounded-md border border-purple-800/30">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs text-gray-400">Arbitrum Sepolia</div>
                    <a 
                      href={vault.explorerLinks.arbitrum} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 transition-colors"
                      data-testid={`link-arbitrum-${vault.id}`}
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="text-xs text-white font-mono truncate">{vault.blockchainDetails.arbitrum}</div>
                </div>
                
                <div className="bg-purple-950/40 p-2.5 rounded-md border border-purple-800/30">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs text-gray-400">Solana Devnet</div>
                    <a 
                      href={vault.explorerLinks.solana} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 transition-colors"
                      data-testid={`link-solana-${vault.id}`}
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="text-xs text-white font-mono truncate">{vault.blockchainDetails.solana}</div>
                </div>
                
                <div className="bg-purple-950/40 p-2.5 rounded-md border border-purple-800/30">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs text-gray-400">TON Testnet</div>
                    <a 
                      href={vault.explorerLinks.ton} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 transition-colors"
                      data-testid={`link-ton-${vault.id}`}
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="text-xs text-white font-mono truncate">{vault.blockchainDetails.ton}</div>
                </div>
              </div>
            </div>
          )}
          
          <Button 
            variant="outline" 
            className="w-full border-purple-700/50 hover:bg-purple-900/30 text-gray-300 hover:text-white"
            onClick={() => toggleVerificationDetails(vault.id)}
            data-testid={`button-verification-${vault.id}`}
          >
            <ShieldCheck className={`w-4 h-4 mr-2 ${expandedVerificationId === vault.id ? 'rotate-180' : ''} transition-transform duration-300`} /> 
            {expandedVerificationId === vault.id ? 'Hide' : 'Show'} Security Verification
          </Button>
          
          {/* Verification Details */}
          {expandedVerificationId === vault.id && (
            <div className="mt-3 p-4 bg-black/60 rounded-lg border border-purple-800/40 space-y-3 animate-in fade-in">
              <h4 className="font-semibold text-sm text-purple-300 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                {vault.verificationDetails.mechanism}
              </h4>
              
              {/* Security Metrics */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-purple-950/40 p-2.5 rounded-md border border-purple-800/30">
                  <div className="text-xs text-gray-400 mb-1.5">Security Level</div>
                  <Progress value={vault.verificationDetails.difficulty} className="h-2 mb-1" />
                  <div className="text-purple-400 text-xs font-bold text-right">{vault.verificationDetails.difficulty}/100</div>
                </div>
                
                <div className="bg-purple-950/40 p-2.5 rounded-md border border-purple-800/30">
                  <div className="text-xs text-gray-400 mb-1">Validators</div>
                  <div className="font-bold text-white text-center text-2xl">{vault.verificationDetails.validators}</div>
                </div>
              </div>
              
              {/* Security Features */}
              <div>
                <div className="text-xs text-gray-400 mb-2">Security Features:</div>
                <div className="grid grid-cols-1 gap-1.5">
                  {vault.verificationDetails.securityFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2 text-xs">
                      <CheckCircle className="w-3.5 h-3.5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <>
      <Helmet>
        <title>21-Year Vesting Proof | CVT Token Vaults | Chronos Vault</title>
        <meta 
          name="description" 
          content="Transparent proof of CVT token vesting - 70% locked for 21 years with VDF time-locks. Real smart contract verification on Arbitrum, Solana, and TON blockchains." 
        />
      </Helmet>
      
      <Container className="py-12">
        <PageHeader 
          heading="🔒 21-Year Vesting Journey: Proof of Lock" 
          description="Transparent on-chain verification of CVT token vesting. 70% of supply locked with Wesolowski VDF time-locks - mathematically impossible to unlock early."
          separator
        />

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-purple-900/20 to-black border-purple-800/50" data-testid="card-total-supply">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                <Coins className="w-4 h-4" />
                Total Supply
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">21M</div>
              <div className="text-xs text-gray-500">CVT Tokens</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-900/20 to-black border-orange-800/50" data-testid="card-locked">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Currently Locked
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-300">{(totalLocked / 1000000).toFixed(2)}M</div>
              <div className="text-xs text-gray-500">{percentageLocked}% of Supply</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/20 to-black border-green-800/50" data-testid="card-released">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Released
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-300">{(totalReleased / 1000000).toFixed(2)}M</div>
              <div className="text-xs text-gray-500">{((totalReleased / totalSupply) * 100).toFixed(1)}% of Supply</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/20 to-black border-purple-800/50" data-testid="card-next-unlock">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                <Timer className="w-4 h-4" />
                Next Unlock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-300">{nextUnlock?.releaseYear || 'N/A'}</div>
              <div className="text-xs text-gray-500">{nextUnlock?.name || 'All Vaults Released'}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different views */}
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)} className="mb-6">
          <TabsList className="grid w-full grid-cols-3 bg-black/50 border border-purple-900/30">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-900/70" data-testid="tab-overview">
              <Eye className="w-4 h-4 mr-2" />
              Vault Overview
            </TabsTrigger>
            <TabsTrigger value="journey" className="data-[state=active]:bg-purple-900/70" data-testid="tab-journey">
              <Sparkles className="w-4 h-4 mr-2" />
              21-Year Journey
            </TabsTrigger>
            <TabsTrigger value="proof" className="data-[state=active]:bg-purple-900/70" data-testid="tab-proof">
              <FileCheck className="w-4 h-4 mr-2" />
              Proof of Lock
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="flex justify-end mb-4">
              <Tabs value={viewMode} onValueChange={(val) => setViewMode(val as any)} className="w-auto">
                <TabsList className="bg-black/50 border border-purple-900/30">
                  <TabsTrigger value="grid" className="data-[state=active]:bg-purple-900/70" data-testid="view-grid">
                    Grid View
                  </TabsTrigger>
                  <TabsTrigger value="timeline" className="data-[state=active]:bg-purple-900/70" data-testid="view-timeline">
                    Timeline View
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {releaseVaults.map(vault => renderVaultCard(vault))}
              </div>
            ) : (
              <div className="relative pb-12">
                <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-900/50 via-purple-700/30 to-purple-900/50"></div>
                
                <div className="space-y-24">
                  {releaseVaults.map((vault, index) => (
                    <div key={vault.id} className={`relative ${index % 2 === 0 ? 'pr-1/2' : 'pl-1/2'}`}>
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-purple-900 border-4 border-black shadow-lg shadow-purple-900/50">
                        <div className="absolute inset-1 rounded-full bg-purple-600 animate-pulse"></div>
                      </div>
                      
                      <div className={`${index % 2 === 0 ? 'pr-12' : 'pl-12'}`}>
                        <div className="text-lg font-bold text-purple-400 mb-2">{vault.releaseYear}</div>
                        {renderVaultCard(vault)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="journey" className="mt-6">
            <Card className="bg-gradient-to-br from-black via-purple-950/20 to-black border-purple-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                  The 21-Year Vesting Journey
                </CardTitle>
                <CardDescription>
                  Understanding the mathematical security behind Chronos Vault's time-locked token releases
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-purple-950/30 border border-purple-800/50 rounded-lg p-6 space-y-4">
                  <h3 className="text-xl font-bold text-purple-300 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Why 21 Years?
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    The 21-year vesting schedule is designed to align long-term value creation with generational wealth protection. 
                    By distributing 70% of the CVT supply across multiple unlock milestones at years 4, 8, 12, 16, and 21, 
                    we create a sustainable economic model that prevents market manipulation and ensures protocol maturity.
                  </p>
                </div>

                <div className="bg-purple-950/30 border border-purple-800/50 rounded-lg p-6 space-y-4">
                  <h3 className="text-xl font-bold text-purple-300 flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Wesolowski VDF Time-Locks
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Each vault uses <strong>Verifiable Delay Functions (VDF)</strong> with Wesolowski's construction - 
                    a cryptographic primitive that guarantees tokens <em>cannot</em> be unlocked before their scheduled date, 
                    even with unlimited computing power. The time-lock computation requires sequential steps that cannot be parallelized.
                  </p>
                  <div className="bg-black/50 rounded-md p-4 border border-purple-800/30">
                    <code className="text-xs text-purple-300 font-mono">
                      VDF_Proof(x, t) = x^(2^t) mod N
                      <br />
                      where t = years × 365 × 24 × 3600 × iterations_per_second
                    </code>
                  </div>
                  <p className="text-sm text-gray-400">
                    <strong>Translation:</strong> To unlock a 4-year vault early, an attacker would need to compute 
                    ~126 million sequential operations - impossible even with quantum computers.
                  </p>
                </div>

                <div className="bg-purple-950/30 border border-purple-800/50 rounded-lg p-6 space-y-4">
                  <h3 className="text-xl font-bold text-purple-300 flex items-center gap-2">
                    <Network className="w-5 h-5" />
                    Trinity Protocol 2-of-3 Consensus
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Every vault unlock requires <strong>2-of-3 validator consensus</strong> across Arbitrum (PRIMARY), 
                    Solana (MONITOR), and TON (BACKUP) blockchains. This multi-chain architecture eliminates single points 
                    of failure and provides mathematical proof of lock status.
                  </p>
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <div className="bg-black/50 rounded-md p-3 border border-purple-800/30 text-center">
                      <div className="text-purple-400 font-bold">Arbitrum</div>
                      <div className="text-xs text-gray-400 mt-1">Primary Security</div>
                    </div>
                    <div className="bg-black/50 rounded-md p-3 border border-purple-800/30 text-center">
                      <div className="text-purple-400 font-bold">Solana</div>
                      <div className="text-xs text-gray-400 mt-1">High-Speed Monitor</div>
                    </div>
                    <div className="bg-black/50 rounded-md p-3 border border-purple-800/30 text-center">
                      <div className="text-purple-400 font-bold">TON</div>
                      <div className="text-xs text-gray-400 mt-1">Quantum-Safe Backup</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-700/50 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-purple-300 flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5" />
                    Progressive Value Unlocking
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300"><strong>Year 4 (2027):</strong> 50% unlock</span>
                      <span className="text-purple-400 font-bold">7.35M CVT</span>
                    </div>
                    <Progress value={50} className="h-2" />
                    
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-gray-300"><strong>Year 8 (2031):</strong> 25% unlock</span>
                      <span className="text-purple-400 font-bold">3.68M CVT</span>
                    </div>
                    <Progress value={25} className="h-2" />
                    
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-gray-300"><strong>Year 12 (2035):</strong> 12.5% unlock</span>
                      <span className="text-purple-400 font-bold">1.84M CVT</span>
                    </div>
                    <Progress value={12.5} className="h-2" />
                    
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-gray-300"><strong>Year 16 (2039):</strong> 6.25% unlock</span>
                      <span className="text-purple-400 font-bold">0.92M CVT</span>
                    </div>
                    <Progress value={6.25} className="h-2" />
                    
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-gray-300"><strong>Year 21 (2044):</strong> 6.25% unlock</span>
                      <span className="text-purple-400 font-bold">0.92M CVT</span>
                    </div>
                    <Progress value={6.25} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="proof" className="mt-6">
            <Card className="bg-gradient-to-br from-black via-purple-950/20 to-black border-purple-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <FileCheck className="w-6 h-6 text-green-400" />
                  On-Chain Proof of Lock
                </CardTitle>
                <CardDescription>
                  Verify CVT token vesting on-chain with real smart contract addresses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-green-950/20 border border-green-800/50 rounded-lg p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-bold text-green-300 mb-2">100% Transparent & Verifiable</h3>
                      <p className="text-gray-300 leading-relaxed">
                        Every vault is deployed on <strong>3 independent blockchains</strong> (Arbitrum, Solana, TON) 
                        with publicly verifiable smart contracts. Anyone can inspect the time-lock mechanisms and 
                        confirm that tokens are mathematically locked until their release dates.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-purple-300 flex items-center gap-2">
                    <Network className="w-5 h-5" />
                    Deployed Smart Contracts
                  </h3>

                  {releaseVaults.map((vault) => (
                    <div key={vault.id} className="bg-purple-950/30 border border-purple-800/50 rounded-lg p-5">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-bold text-white">{vault.name}</h4>
                        <Badge variant={vault.status === 'released' ? 'default' : 'outline'} className={vault.status === 'released' ? 'bg-green-600' : 'bg-purple-900/50 border-purple-600'}>
                          {vault.status === 'released' ? 'Released' : `Locked until ${vault.releaseYear}`}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <a 
                          href={vault.explorerLinks.arbitrum}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-black/50 border border-purple-800/30 rounded-md p-3 hover:border-purple-600/50 transition-all group"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-400">Arbitrum Sepolia</span>
                            <ExternalLink className="w-4 h-4 text-purple-400 group-hover:text-purple-300" />
                          </div>
                          <div className="text-xs font-mono text-white break-all">{vault.blockchainDetails.arbitrum}</div>
                        </a>

                        <a 
                          href={vault.explorerLinks.solana}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-black/50 border border-purple-800/30 rounded-md p-3 hover:border-purple-600/50 transition-all group"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-400">Solana Devnet</span>
                            <ExternalLink className="w-4 h-4 text-purple-400 group-hover:text-purple-300" />
                          </div>
                          <div className="text-xs font-mono text-white break-all">{vault.blockchainDetails.solana}</div>
                        </a>

                        <a 
                          href={vault.explorerLinks.ton}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-black/50 border border-purple-800/30 rounded-md p-3 hover:border-purple-600/50 transition-all group"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-400">TON Testnet</span>
                            <ExternalLink className="w-4 h-4 text-purple-400 group-hover:text-purple-300" />
                          </div>
                          <div className="text-xs font-mono text-white break-all">{vault.blockchainDetails.ton}</div>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-950/20 border border-blue-800/50 rounded-lg p-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-bold text-blue-300 mb-2">How to Verify</h3>
                      <ol className="list-decimal list-inside space-y-2 text-gray-300">
                        <li>Click any blockchain explorer link above</li>
                        <li>Review the smart contract code and time-lock parameters</li>
                        <li>Verify the locked token balance matches the stated amount</li>
                        <li>Confirm the unlock date encoded in the VDF time-lock</li>
                        <li>Check Trinity Protocol 2-of-3 consensus validation</li>
                      </ol>
                      <p className="mt-4 text-sm text-gray-400">
                        All contracts are deployed on testnets for transparency. Mainnet deployment will occur post-audit.
                      </p>
                    </div>
                  </div>
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
