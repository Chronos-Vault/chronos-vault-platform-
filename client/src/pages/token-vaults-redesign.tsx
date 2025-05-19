import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Helmet } from 'react-helmet';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, Clock, ChevronDown, Coins, Box, 
  ShieldCheck, Eye, CheckCircle
} from 'lucide-react';

interface ReleaseVault {
  id: string;
  name: string;
  releaseDate: string;
  releaseYear: number;
  percentage: string;
  tokens: string;
  status: 'released' | 'upcoming' | 'locked';
  description: string;
  image: string;
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
    securityFeatures: string[];
  };
}

const TokenVaultsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');
  const [expandedVerificationId, setExpandedVerificationId] = useState<string | null>(null);
  const [expandedReleaseId, setExpandedReleaseId] = useState<string | null>(null);
  
  // Toggle verification details visibility
  const toggleVerificationDetails = (id: string) => {
    if (expandedVerificationId === id) {
      setExpandedVerificationId(null);
    } else {
      setExpandedVerificationId(id);
    }
  };
  
  // Toggle release details visibility
  const toggleReleaseDetails = (id: string) => {
    if (expandedReleaseId === id) {
      setExpandedReleaseId(null);
    } else {
      setExpandedReleaseId(id);
    }
  };

  // Release Vault Data based on CVT tokenomics
  const releaseVaults: ReleaseVault[] = [
    {
      id: 'genesis',
      name: 'Genesis Vault™',
      releaseDate: '01/07/2023',
      releaseYear: 2023,
      percentage: '15%',
      tokens: '3,150,000 CVT',
      status: 'released',
      description: 'Genesis distribution for early backers, development, and community incentives.',
      image: '/images/genesis-vault.png',
      blockchainDetails: {
        ethereum: '0x6F3e7D82526e12051C151AE054F242Cc91e19438',
        solana: 'CvT5oXeA9KFmBpAFRxvg7zdycBcFZv3TBHmNpANmzaQA',
        ton: 'EQBYLdzkDjdjZLtXXgQTgMhpCaKDPfQQUKxpBNKmBiCY5_Y_',
        smartContract: 'TimeLockFoundation v1.0'
      },
      verificationDetails: {
        mechanism: 'Multi-Signature Time-Lock Protocol',
        difficulty: 85,
        validators: 7,
        securityFeatures: [
          'Triple-chain verification',
          'Transparent allocation',
          'Vesting schedules',
          'Audit trail verification'
        ]
      }
    },
    {
      id: 'sovereign-vault',
      name: 'Sovereign Vault™',
      releaseDate: '05/15/2029',
      releaseYear: 2029,
      percentage: '35%',
      tokens: '7,350,000 CVT',
      status: 'locked',
      description: 'The Sovereign Vault™ opens, unlocking 50% of all time-locked tokens. This major release coincides with platform maturity and transition to DAO governance.',
      image: '/images/gold-vault.png',
      blockchainDetails: {
        ethereum: '0x7A21438Ba88510Cf32E78E736AB440A84FD37Ae9',
        solana: 'GLD5xNvZmYfAHyj2qWe94kzVn56mThL4X37jNgVNc7Uq',
        ton: 'EQCGLdvault-gold-olympic-4y-eHu873BfqMn77rRt58',
        smartContract: 'SovereignVault v2.1'
      },
      verificationDetails: {
        mechanism: 'Triple-Chain Consensus Protocol',
        difficulty: 92,
        validators: 21,
        securityFeatures: [
          'Government-grade encryption',
          'Zero-knowledge proof validation',
          'Dedicated security auditing',
          'Inheritance protocol access'
        ]
      }
    },
    {
      id: 'architect-vault',
      name: 'Architect Vault™',
      releaseDate: '05/15/2033',
      releaseYear: 2033,
      percentage: '17.5%',
      tokens: '3,675,000 CVT',
      status: 'locked',
      description: 'Architect Vault™ activates with 25% of time-locked tokens. Enhanced verification protocols and staking mechanisms provide advanced security and governance rights.',
      image: '/images/silver-vault.png',
      blockchainDetails: {
        ethereum: '0x8B34c1A83b7C5F4dB8a78D9b71e1AbF28Cd24E7D',
        solana: 'SLVRxNHu8dvYPJjZ44wQgUT7YxKeHR9LBmXJGW2FpX4',
        ton: 'EQC-slvr-vault-8year-release-CnH83j4gDzv5Ytzd',
        smartContract: 'ArchitectVault v3.2'
      },
      verificationDetails: {
        mechanism: 'Dual-Chain Behavioral Authentication',
        difficulty: 88,
        validators: 35,
        securityFeatures: [
          'Behavioral authentication',
          'Enhanced staking rewards',
          'Portfolio rebalancing',
          'Governance voting rights'
        ]
      }
    },
    {
      id: 'guardian-vault',
      name: 'Guardian Vault™',
      releaseDate: '05/15/2037',
      releaseYear: 2037,
      percentage: '8.75%',
      tokens: '1,837,500 CVT',
      status: 'locked',
      description: 'Guardian Vault™ opens with 12.5% of time-locked tokens. Cross-chain verification systems reach full maturity, offering sophisticated portfolio tools.',
      image: '/images/bronze-vault.png',
      blockchainDetails: {
        ethereum: '0x9C45b1F58Af32D1aBdE7F57BC15Ed6f30BcA2783',
        solana: 'BRZNzxcVQ6wHH3HZ8K9yyFh4MBPSoUnFZ2vBbG5pMfDq',
        ton: 'EQD8vaultbronze-12y-release-Gft7UnpB9FTzv8e4',
        smartContract: 'GuardianVault v4.0'
      },
      verificationDetails: {
        mechanism: 'Multi-Signature Cross-Chain Audit Protocol',
        difficulty: 90,
        validators: 49,
        securityFeatures: [
          'Multi-signature requirements',
          'Automated security audits',
          'Cross-chain asset protection',
          'Family access controls'
        ]
      }
    },
    {
      id: 'diamond-verification',
      name: 'Diamond Verification Vault™',
      releaseDate: '05/15/2041',
      releaseYear: 2041,
      percentage: '4.375%',
      tokens: '918,750 CVT',
      status: 'locked',
      description: 'Diamond Verification Vault™ activates with 6.25% of time-locked tokens, introducing quantum-resistant security features and verification authorities.',
      image: '/images/diamond-vault.png',
      blockchainDetails: {
        ethereum: '0xAe7D6F21D2B138c92bD36E7C8Eb2B7De45F5F218',
        solana: 'DMNDqR3vYUw4kLVLzLJum5SGNHBzKnxC6dQmQmMQyR38',
        ton: 'EQCDiamond-vault-16year-quantum-8hKBnM4wTztP',
        smartContract: 'DiamondVerificationVault™ v5.1'
      },
      verificationDetails: {
        mechanism: 'Quantum-Resistant Lattice Encryption',
        difficulty: 95,
        validators: 64,
        securityFeatures: [
          'Quantum-resistant encryption',
          'Trusted verification authority',
          'Network security staking',
          'Advanced analytics access'
        ]
      }
    },
    {
      id: 'sovereign-fortress',
      name: 'Sovereign Fortress Vault™',
      releaseDate: '05/15/2046',
      releaseYear: 2046,
      percentage: '4.375%',
      tokens: '918,750 CVT',
      status: 'locked',
      description: 'Sovereign Fortress Vault™ completes the 21-year cycle with the final 6.25% of time-locked tokens - the ultimate security and sovereignty level.',
      image: '/images/sovereign-vault.png',
      blockchainDetails: {
        ethereum: '0xFd9A8E5c81B9Fc1D33E56DE8D7f58D79Eb21B3C2',
        solana: 'SVRGNft7Th38b7P9ZwLkR4tDcH6MqxfJh9NLv2qFZDUm',
        ton: 'EQB-sovereign-fortress-final-vault-Z8h4jtPn72F',
        smartContract: 'SovereignFortressVault™ v6.0'
      },
      verificationDetails: {
        mechanism: 'Military-Grade Triple-Chain Security Protocol',
        difficulty: 99,
        validators: 101,
        securityFeatures: [
          'Military-grade security',
          'Perpetual inheritance system',
          'Global jurisdiction protection',
          'Zero-fee transactions'
        ]
      }
    }
  ];

  // Render vault card
  const renderVaultCard = (vault: ReleaseVault) => (
    <Card key={vault.id} className="relative overflow-hidden bg-black border border-gray-800 hover:border-purple-800/50 transition-all duration-300">
      {/* Top Image Section */}
      <div className="relative h-40 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 flex items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-purple-900/30 flex items-center justify-center animate-pulse-slow">
          <div className="w-16 h-16 rounded-full bg-purple-700/40 flex items-center justify-center">
            {vault.status === 'released' ? (
              <CheckCircle className="w-8 h-8 text-green-400" />
            ) : (
              <Clock className="w-8 h-8 text-purple-400" />
            )}
          </div>
        </div>
        <div className="absolute bottom-3 left-3 text-sm font-medium text-gray-300">
          {vault.name} • {vault.releaseYear}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold text-white">{vault.name}</h3>
          <Badge 
            variant={vault.status === 'released' ? 'default' : 'outline'}
            className={vault.status === 'released' 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'border-gray-600 text-gray-400'
            }
          >
            {vault.status === 'released' ? 'Released' : 'Locked'}
          </Badge>
        </div>
        
        <div className="flex items-center text-sm text-gray-400 mb-4">
          <Calendar className="w-4 h-4 mr-1" /> 
          Release Date: {vault.releaseDate}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-sm text-gray-400">Percentage</div>
            <div className="text-lg font-medium text-white">{vault.percentage}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Tokens</div>
            <div className="text-lg font-medium text-white">{vault.tokens}</div>
          </div>
        </div>
        
        <p className="text-sm text-gray-300 mb-4">{vault.description}</p>
        
        <div className="space-y-2">
          <Button 
            variant="secondary" 
            className="w-full bg-purple-900/50 hover:bg-purple-800/70 text-purple-100"
            onClick={() => toggleReleaseDetails(vault.id)}
          >
            <Eye className="w-4 h-4 mr-1" />
            {expandedReleaseId === vault.id ? 'Hide Release Details' : 'View Release Details'}
          </Button>
          
          {expandedReleaseId === vault.id && (
            <div className="mt-3 p-3 bg-gray-900/50 rounded-md border border-gray-800 animate-in fade-in">
              <h4 className="font-medium text-sm text-white mb-2 flex items-center">
                <Box className="w-4 h-4 mr-1 text-purple-400" />
                Blockchain Implementation
              </h4>
              
              <div className="space-y-2 mb-3">
                <div className="bg-black/50 p-2 rounded-md">
                  <div className="text-xs text-gray-400 mb-1">Smart Contract</div>
                  <div className="text-xs text-white font-mono">{vault.blockchainDetails.smartContract}</div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-black/50 p-2 rounded-md">
                    <div className="text-gray-400 mb-1">Ethereum</div>
                    <div className="text-xs text-white font-mono truncate" title={vault.blockchainDetails.ethereum}>
                      {vault.blockchainDetails.ethereum.substring(0, 8)}...
                    </div>
                  </div>
                  
                  <div className="bg-black/50 p-2 rounded-md">
                    <div className="text-gray-400 mb-1">Solana</div>
                    <div className="text-xs text-white font-mono truncate" title={vault.blockchainDetails.solana}>
                      {vault.blockchainDetails.solana.substring(0, 8)}...
                    </div>
                  </div>
                  
                  <div className="bg-black/50 p-2 rounded-md">
                    <div className="text-gray-400 mb-1">TON</div>
                    <div className="text-xs text-white font-mono truncate" title={vault.blockchainDetails.ton}>
                      {vault.blockchainDetails.ton.substring(0, 8)}...
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-gray-400 pt-2 border-t border-gray-800 mt-2">
                <div className="flex items-center gap-1">
                  <Coins className="h-3 w-3 text-purple-400" />
                  <span className="text-gray-300">{vault.tokens} released on {vault.releaseDate}</span>
                </div>
                <p className="mt-1 text-gray-300">
                  {vault.status === 'released' 
                    ? 'This vault has been released and the tokens are now in circulation.' 
                    : `This vault is currently locked and will be released in ${vault.releaseYear - 2025} years.`}
                </p>
              </div>
            </div>
          )}
          
          <Button 
            variant="outline" 
            className="w-full border-gray-700 hover:bg-gray-800/70 flex items-center justify-center"
            onClick={() => toggleVerificationDetails(vault.id)}
          >
            <ChevronDown className={`w-4 h-4 mr-1 transition-transform duration-300 ${expandedVerificationId === vault.id ? 'rotate-180' : ''}`} /> 
            {expandedVerificationId === vault.id ? 'Hide Verification Details' : 'Show Verification Details'}
          </Button>
          
          {expandedVerificationId === vault.id && (
            <div className="mt-3 p-3 bg-gray-900/50 rounded-md border border-gray-800 animate-in fade-in">
              <h4 className="font-medium text-sm text-white mb-2 flex items-center">
                <ShieldCheck className="w-4 h-4 mr-1 text-purple-400" />
                {vault.verificationDetails.mechanism}
              </h4>
              
              <div className="grid grid-cols-2 gap-2 mb-2 text-xs">
                <div className="bg-black/50 p-2 rounded-md">
                  <div className="text-gray-400 mb-1">Security Level</div>
                  <div className="w-full h-1.5 bg-gray-800 rounded-full mb-1 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-600 to-fuchsia-600" 
                      style={{ width: `${vault.verificationDetails.difficulty}%` }}
                    ></div>
                  </div>
                  <div className="text-purple-400 text-right">{vault.verificationDetails.difficulty}/100</div>
                </div>
                
                <div className="bg-black/50 p-2 rounded-md">
                  <div className="text-gray-400 mb-1">Validators</div>
                  <div className="font-medium text-white text-center text-lg">{vault.verificationDetails.validators}</div>
                </div>
              </div>
              
              <div className="text-xs text-gray-400 mb-2">Security Features:</div>
              <div className="grid grid-cols-2 gap-1 text-xs">
                {vault.verificationDetails.securityFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-1">
                    <CheckCircle className="w-3 h-3 text-purple-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
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
        <title>CVT Release Verification Vaults | Chronos Vault</title>
        <meta 
          name="description" 
          content="Explore the CVT token release schedule across the 21-year journey with verification details for each vault phase." 
        />
      </Helmet>
      
      <Container className="py-12">
        <PageHeader 
          heading="CVT Release Verification Vaults" 
          description="Track the 21-year release schedule and verification details of the Chronos Vault Token"
          separator
        />
        
        <div className="flex justify-end mb-6">
          <Tabs defaultValue="grid" className="w-auto" onValueChange={(val) => setViewMode(val as 'grid' | 'timeline')}>
            <TabsList className="grid w-[240px] grid-cols-2 bg-black/50 border border-purple-900/30">
              <TabsTrigger value="grid" className="data-[state=active]:bg-purple-900/70">
                Grid View
              </TabsTrigger>
              <TabsTrigger value="timeline" className="data-[state=active]:bg-purple-900/70">
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
            {/* Timeline Track */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-purple-900/30"></div>
            
            {/* Timeline Events */}
            <div className="space-y-32">
              {releaseVaults.map((vault, index) => (
                <div key={vault.id} className={`relative ${index % 2 === 0 ? 'ml-1/2 pl-8' : 'mr-1/2 pr-8 text-right flex flex-col items-end'}`}>
                  {/* Timeline Marker */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-purple-900 border-2 border-black">
                    <div className="absolute inset-0.5 rounded-full bg-purple-700 animate-pulse"></div>
                  </div>
                  
                  {/* Year */}
                  <div className="text-sm font-bold text-purple-400 mb-2">{vault.releaseYear}</div>
                  
                  {/* Card */}
                  <Card className="w-80 bg-black border border-gray-800 hover:border-purple-800/50 transition-all duration-300">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{vault.name}</CardTitle>
                        <Badge 
                          variant={vault.status === 'released' ? 'default' : 'outline'}
                          className={vault.status === 'released' 
                            ? 'bg-green-600 hover:bg-green-700' 
                            : 'border-gray-600 text-gray-400'
                          }
                        >
                          {vault.status === 'released' ? 'Released' : 'Locked'}
                        </Badge>
                      </div>
                      <CardDescription className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" /> {vault.releaseDate}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0 pb-3 text-sm">
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div>
                          <div className="text-xs text-gray-400">Percentage</div>
                          <div className="font-medium">{vault.percentage}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">Tokens</div>
                          <div className="font-medium">{vault.tokens}</div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-300">{vault.description}</p>
                    </CardContent>
                    <CardFooter className="pt-0 flex-col space-y-2">
                      <Button 
                        variant="secondary" 
                        size="sm"
                        className="w-full bg-purple-900/50 hover:bg-purple-800/70 text-purple-100 text-xs"
                      >
                        <Eye className="w-3 h-3 mr-1" /> View Details
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        )}
      </Container>
    </>
  );
};

export default TokenVaultsPage;