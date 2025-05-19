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
  Hourglass, ArrowRight, Filter, 
  BarChart3, GanttChart, Bookmark
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useAuthContext } from '@/contexts/auth-context';
import { useCVTToken } from '@/contexts/cvt-token-context';

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
      const styleId = `progress-indicator-${Math.random().toString(36).slice(2, 9)}`;
      const styleTag = document.createElement('style');
      styleTag.id = styleId;
      styleTag.innerHTML = `
        .progress-bar-custom div {
          ${indicatorClassName.includes('bg-gradient') ? indicatorClassName : ''}
        }
      `;
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
}

interface VaultType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  releaseEvents: TimeReleaseEvent[];
  features: string[];
  securityLevel: number;
  colorClass: string;
  gradientClass: string;
}

const TokenVaultsPage: React.FC = () => {
  const { isAuthenticated } = useAuthContext();
  // Not using these properties directly to avoid TypeScript errors
  const cvtToken = useCVTToken();
  const [activeVaultId, setActiveVaultId] = useState<string>('time-locked');
  
  // CVT Time-Release Events Data
  const timeReleaseEvents: TimeReleaseEvent[] = [
    { 
      year: 0, 
      amount: 6300000, 
      percentage: "30%", 
      date: "May 15, 2025", 
      description: "Initial circulation for strategic partners, development, and ecosystem fund" 
    },
    { 
      year: 4, 
      amount: 7350000, 
      percentage: "35%", 
      date: "May 15, 2029", 
      description: "First major time-lock release, significantly expanding token distribution" 
    },
    { 
      year: 8, 
      amount: 3675000, 
      percentage: "17.5%", 
      date: "May 15, 2033", 
      description: "Second scheduled release, enhancing liquidity while maintaining scarcity" 
    },
    { 
      year: 12, 
      amount: 1837500, 
      percentage: "8.75%", 
      date: "May 15, 2037", 
      description: "Third release coinciding with advanced platform features" 
    },
    { 
      year: 16, 
      amount: 918750, 
      percentage: "4.375%", 
      date: "May 15, 2041", 
      description: "Fourth release designed for long-term ecosystem sustainability" 
    },
    { 
      year: 21, 
      amount: 918750, 
      percentage: "4.375%", 
      date: "May 15, 2046", 
      description: "Final release completing the 21-year distribution cycle" 
    }
  ];
  
  // Innovative Vault Types
  const vaultTypes: VaultType[] = [
    {
      id: 'time-locked',
      name: 'Chronos Time-Locked Vault',
      description: 'The foundation of our ecosystem, designed with a 21-year release schedule that mathematically guarantees increasing scarcity. Each release phase is secured by immutable smart contracts with time-lock mechanisms that cannot be altered.',
      icon: <Hourglass className="h-5 w-5" />,
      releaseEvents: timeReleaseEvents,
      features: [
        'Immutable 21-year release schedule',
        'Mathematical guarantee of increasing scarcity',
        'Quantum-resistant time-lock encryption',
        'Transparent on-chain verification',
        'Cross-chain synchronized unlocking'
      ],
      securityLevel: 98,
      colorClass: 'text-purple-600 dark:text-purple-400',
      gradientClass: 'from-purple-500/10 to-fuchsia-500/10'
    },
    {
      id: 'deflationary',
      name: 'Deflationary Burn Vault',
      description: 'Our revolutionary burn mechanism permanently removes tokens from circulation based on platform usage, creating a continuous deflationary pressure unlike any other token. By Year 30, over 40% of all tokens ever created will be permanently burned.',
      icon: <TrendingUp className="h-5 w-5" />,
      releaseEvents: timeReleaseEvents,
      features: [
        'Algorithmic burning based on platform usage',
        'Automatic buyback mechanisms',
        'Verifiable burn addresses',
        'Predictable deflationary schedule',
        'Transparent burn rate calculations'
      ],
      securityLevel: 95,
      colorClass: 'text-blue-600 dark:text-blue-400',
      gradientClass: 'from-blue-500/10 to-cyan-500/10'
    },
    {
      id: 'staking',
      name: 'Triple-Tier Staking Vault',
      description: 'A unique three-tiered staking system with time-based multipliers that rewards long-term holders. Each tier provides escalating benefits, with Sovereign tier stakers receiving unprecedented control over vault security parameters.',
      icon: <Lock className="h-5 w-5" />,
      releaseEvents: timeReleaseEvents,
      features: [
        'Guardian, Architect, and Sovereign tiers',
        'Time-based staking multipliers (up to 2x)',
        'Compounding rewards options',
        'Governance power amplification',
        'Fee reduction benefits'
      ],
      securityLevel: 96,
      colorClass: 'text-green-600 dark:text-green-400',
      gradientClass: 'from-emerald-500/10 to-green-500/10'
    },
    {
      id: 'cross-chain',
      name: 'Cross-Chain Fragment Vault',
      description: 'Revolutionary vault technology that secures tokens across multiple blockchains simultaneously. Each vault fragment exists on a different chain (TON, Ethereum, Solana), requiring unanimous consensus for any modification.',
      icon: <Filter className="h-5 w-5" />,
      releaseEvents: timeReleaseEvents,
      features: [
        'Multi-chain fragmented security',
        'Cross-chain verification requirements',
        'Chain-specific utility features',
        'Blockchain redundancy protection',
        'Quantum-resistant synchronization'
      ],
      securityLevel: 99,
      colorClass: 'text-pink-600 dark:text-pink-400',
      gradientClass: 'from-pink-500/10 to-rose-500/10'
    },
    {
      id: 'governance',
      name: 'Progressive Governance Vault',
      description: 'A governance system that evolves over the 21-year journey, transitioning from foundation management to full decentralized control. Voting power is calculated using a sophisticated formula that rewards both quantity and duration of holding.',
      icon: <GanttChart className="h-5 w-5" />,
      releaseEvents: timeReleaseEvents,
      features: [
        'Three-phase governance evolution',
        'Stake-weighted voting mechanisms',
        'Anti-whale protections',
        'On-chain proposal execution',
        'Time-based voting weight multipliers'
      ],
      securityLevel: 94,
      colorClass: 'text-amber-600 dark:text-amber-400',
      gradientClass: 'from-yellow-500/10 to-amber-500/10'
    }
  ];
  
  // Find current active vault
  const activeVault = vaultTypes.find(vault => vault.id === activeVaultId) || vaultTypes[0];
  
  return (
    <>
      <Helmet>
        <title>CVT Token Vaults | 21-Year Journey</title>
        <meta 
          name="description" 
          content="Explore Chronos Vault Token's revolutionary 21-year journey through our innovative vault systems designed to ensure token scarcity and long-term value creation." 
        />
      </Helmet>
      
      <Container className="py-12">
        <PageHeader 
          heading="21-Year Token Vault Journey" 
          description="Discover how Chronos Vault's revolutionary token economics create unprecedented value through our innovative vault systems"
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
                  <p className="text-sm text-gray-400">Fixed maximum, never to increase</p>
                </div>
                
                <div className="space-y-2 flex flex-col items-center text-center p-4 rounded-lg bg-gradient-to-br from-purple-900/20 to-fuchsia-900/10 border border-purple-900/20">
                  <div className="rounded-full bg-gradient-to-r from-purple-700/30 to-fuchsia-700/30 p-3">
                    <Calendar className="h-6 w-6 text-purple-400" />
                  </div>
                  <h3 className="font-medium text-lg text-white">Distribution Cycle</h3>
                  <p className="text-2xl font-bold text-white">21 Years</p>
                  <p className="text-sm text-gray-400">Precise mathematical release schedule</p>
                </div>
                
                <div className="space-y-2 flex flex-col items-center text-center p-4 rounded-lg bg-gradient-to-br from-purple-900/20 to-fuchsia-900/10 border border-purple-900/20">
                  <div className="rounded-full bg-gradient-to-r from-purple-700/30 to-fuchsia-700/30 p-3">
                    <TrendingUp className="h-6 w-6 text-purple-400" />
                  </div>
                  <h3 className="font-medium text-lg text-white">Burn Mechanism</h3>
                  <p className="text-2xl font-bold text-white">~40.3%</p>
                  <p className="text-sm text-gray-400">Total supply burned by Year 30</p>
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
        
        <div className="space-y-12">
          {/* Distribution Timeline */}
          <Card className="border border-purple-900/30">
            <CardHeader className="bg-gradient-to-r from-purple-900/20 to-fuchsia-900/20">
              <div className="flex items-center gap-2">
                <Timer className="h-5 w-5 text-purple-400" />
                <CardTitle>21-Year Distribution Timeline</CardTitle>
              </div>
              <CardDescription>
                CVT's unique distribution schedule ensures predictable supply over two decades
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="relative">
                {/* Timeline Bar */}
                <div className="absolute top-8 left-0 w-full h-1 bg-gray-700"></div>
                
                {/* Timeline Points */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {timeReleaseEvents.map((event, index) => (
                    <div key={index} className="relative pt-10 pb-2 px-2">
                      <div className={`absolute top-7 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full 
                        ${index === 0 ? 'bg-purple-500' : 'bg-purple-700'} border-2 border-black z-10`}>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium text-purple-400">Year {event.year}</div>
                        <div className="text-lg font-bold">{event.percentage}</div>
                        <div className="text-xs text-gray-400">{event.amount.toLocaleString()} CVT</div>
                        <div className="text-xs text-gray-500 mt-1">{event.date}</div>
                        <div className="text-xs text-gray-400 mt-2 line-clamp-3">{event.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-800">
                <div className="text-sm text-gray-400">
                  <p className="mb-4">
                    Unlike Bitcoin's halving mechanism which reduces new issuance, CVT's distribution model systematically 
                    reduces the amount released from time-locked reserves while simultaneously burning tokens from circulation, 
                    creating mathematical scarcity that intensifies over time.
                  </p>
                  <div className="flex items-center gap-2 text-purple-400">
                    <Lightbulb className="h-4 w-4" />
                    <span>Each release event is secured by immutable smart contracts that cannot be modified, ensuring complete transparency and trust.</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Innovative Vault Systems */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-400" />
              <h2 className="text-xl font-semibold">Innovative Token Vault Systems</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <Tabs defaultValue={activeVaultId} onValueChange={setActiveVaultId} className="w-full">
                <TabsList className="grid grid-cols-2 md:grid-cols-5 bg-black/50 p-1 mb-6 border border-purple-900/30">
                  {vaultTypes.map(vault => (
                    <TabsTrigger 
                      key={vault.id} 
                      value={vault.id}
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-900/50 data-[state=active]:to-fuchsia-900/50"
                    >
                      <div className="flex items-center gap-1.5">
                        {vault.icon}
                        <span className="hidden md:inline">{vault.name.split(' ')[0]}</span>
                      </div>
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {vaultTypes.map(vault => (
                  <TabsContent key={vault.id} value={vault.id} className="w-full">
                    <Card className={`border border-purple-900/30 bg-gradient-to-br ${vault.gradientClass}`}>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-full bg-black/30">
                            {vault.icon}
                          </div>
                          <div>
                            <CardTitle className={vault.colorClass}>{vault.name}</CardTitle>
                            <CardDescription>{vault.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <ShieldCheck className="h-4 w-4 text-purple-400" />
                              <span className="text-sm font-medium">Security Rating</span>
                            </div>
                            <span className="text-sm font-bold">{vault.securityLevel}/100</span>
                          </div>
                          <CustomProgress value={vault.securityLevel} className="h-2 bg-gray-700" indicatorClassName="bg-gradient-to-r from-purple-500 to-fuchsia-500" />
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                            <Sparkles className="h-4 w-4 text-purple-400" />
                            <span>Key Features</span>
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {vault.features.map((feature, index) => (
                              <div key={index} className="flex items-start gap-1.5">
                                <ArrowRight className="h-3.5 w-3.5 mt-0.5 text-purple-400 flex-shrink-0" />
                                <span className="text-sm text-gray-300">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t border-purple-900/20 pt-4">
                        <div className="flex justify-between items-center w-full">
                          <div className="flex items-center gap-1.5 text-sm text-gray-400">
                            <BarChart3 className="h-4 w-4" />
                            <span>Performance tracked since 2025</span>
                          </div>
                          <Button variant="outline" size="sm" className="border-purple-500/30 hover:bg-purple-900/20">
                            <Bookmark className="h-4 w-4 mr-1.5" />
                            <span>Full Details</span>
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
          
          {/* Mathematical Certainty Section */}
          <Card className="border border-purple-900/30">
            <CardHeader className="bg-gradient-to-r from-purple-900/20 to-fuchsia-900/20">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-purple-400" />
                <CardTitle>Mathematical Certainty: Beyond Bitcoin</CardTitle>
              </div>
              <CardDescription>
                How CVT's token economics create a superior store of value compared to other cryptocurrencies
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-purple-400">Fixed Maximum vs. Decreasing Total</h3>
                  <p className="text-sm text-gray-400">
                    While Bitcoin's supply approaches but never exceeds 21 million, CVT's mathematically guaranteed burning 
                    mechanism ensures the total supply starts at 21 million and continuously decreases over time, creating 
                    true digital scarcity.
                  </p>
                  <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-900/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Bitcoin's Supply</span>
                      <span className="text-sm">Asymptotic Approach to 21M</span>
                    </div>
                    <Progress value={95} className="h-2 bg-gray-700" />
                    
                    <div className="flex items-center justify-between mt-4 mb-2">
                      <span className="text-sm font-medium">CVT's Supply</span>
                      <span className="text-sm">Starts at 21M, Perpetually Decreasing</span>
                    </div>
                    <CustomProgress value={60} className="h-2 bg-gray-700" indicatorClassName="bg-gradient-to-r from-purple-500 to-fuchsia-500" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-purple-400">Mining vs. Burning</h3>
                  <p className="text-sm text-gray-400">
                    Bitcoin releases new tokens through mining until reaching maximum supply. CVT's revolutionary approach 
                    permanently removes tokens from circulation through systematic burning, creating continuous deflationary pressure 
                    that intensifies with platform adoption.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
                      <div className="text-center mb-2">
                        <div className="inline-block rounded-full bg-gray-800 p-2 mb-1">
                          <TrendingUp className="h-4 w-4 text-yellow-500" />
                        </div>
                        <h4 className="text-sm font-medium">Bitcoin</h4>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>New BTC Mined</span>
                          <span>↓ Decreasing</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Supply Growth</span>
                          <span>↓ Slowing</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Final Supply</span>
                          <span>21M (Year ~2140)</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-900/30">
                      <div className="text-center mb-2">
                        <div className="inline-block rounded-full bg-purple-900/50 p-2 mb-1">
                          <TrendingUp className="h-4 w-4 text-purple-400" />
                        </div>
                        <h4 className="text-sm font-medium">CVT</h4>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>CVT Burned</span>
                          <span>↑ Increasing</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Supply Reduction</span>
                          <span>↑ Accelerating</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Projected Y100</span>
                          <span>~2.1M (89.8% ↓)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator className="bg-purple-900/30" />
              
              <div className="text-sm text-gray-400">
                <p>The CVT token vault system represents a fundamental evolution in tokenomics, combining time-locked 
                distribution with active supply reduction to create a mathematically superior store of value. Each 
                vault type in our ecosystem plays a specific role in ensuring this vision becomes reality over our 
                21-year journey.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </>
  );
};

export default TokenVaultsPage;