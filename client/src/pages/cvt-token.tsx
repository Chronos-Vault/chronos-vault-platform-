import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { 
  Coins,
  LockKeyhole,
  Flame,
  Users,
  Shield,
  ExternalLink,
  CheckCircle2,
  TrendingUp,
  Vote,
  Zap,
  Database,
  Clock,
  ArrowRightLeft
} from "lucide-react";

export default function CVTTokenPage() {
  const [_, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

  const tokenAllocation = [
    { category: 'Sovereign Fortress Vaults', percentage: 40, amount: '8,400,000 CVT', description: '21-year VDF time-locks', color: 'bg-purple-600' },
    { category: 'Dynasty Trust Vaults', percentage: 20, amount: '4,200,000 CVT', description: 'Multi-generational inheritance', color: 'bg-pink-600' },
    { category: 'Team & Strategic Reserve', percentage: 10, amount: '2,100,000 CVT', description: '4-year vesting with cliff', color: 'bg-indigo-600' },
    { category: 'Jupiter DEX (Solana)', percentage: 10, amount: '2,100,000 CVT', description: 'Liquidity provision', color: 'bg-cyan-600' },
    { category: 'Uniswap V3 (Arbitrum)', percentage: 8, amount: '1,680,000 CVT', description: 'Liquidity provision', color: 'bg-blue-600' },
    { category: 'DeDust (TON)', percentage: 2, amount: '420,000 CVT', description: 'Liquidity provision', color: 'bg-sky-600' },
    { category: 'Core Development', percentage: 5, amount: '1,050,000 CVT', description: 'Ongoing development', color: 'bg-amber-600' },
    { category: 'Community Incentives', percentage: 3, amount: '630,000 CVT', description: 'Bounties & rewards', color: 'bg-green-600' },
    { category: 'Marketing & Growth', percentage: 2, amount: '420,000 CVT', description: 'Expansion initiatives', color: 'bg-red-600' },
  ];

  const vestingSchedule = [
    { year: 4, amount: '4,200,000 CVT', percentage: '50%' },
    { year: 8, amount: '2,100,000 CVT', percentage: '25%' },
    { year: 12, amount: '1,050,000 CVT', percentage: '12.5%' },
    { year: 16, amount: '525,000 CVT', percentage: '6.25%' },
    { year: 21, amount: '525,000 CVT', percentage: '6.25%' },
  ];

  const tokenUtility = [
    {
      icon: <Vote className="h-6 w-6" />,
      title: 'Governance',
      description: 'Vote on protocol upgrades and parameters across all three chains',
      color: 'from-purple-600 to-purple-500'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Validator Staking',
      description: 'Stake CVT to become a Trinity validator and earn rewards',
      color: 'from-cyan-600 to-cyan-500'
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Fee Discounts',
      description: 'Reduce vault operation fees by holding CVT',
      color: 'from-pink-600 to-pink-500'
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Consensus Rewards',
      description: 'Validators earn CVT for honest 2-of-3 consensus participation',
      color: 'from-amber-600 to-amber-500'
    },
    {
      icon: <LockKeyhole className="h-6 w-6" />,
      title: 'Slashing Collateral',
      description: 'Validators stake CVT as security deposit against malicious behavior',
      color: 'from-red-600 to-red-500'
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: 'Premium Vault Access',
      description: 'Access advanced vault types and features',
      color: 'from-green-600 to-green-500'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] via-[#121218] to-[#0a0a0f] text-white">
      <Helmet>
        <title>CVT Token | Chronos Vault - Trinity Protocol™</title>
        <meta 
          name="description" 
          content="CVT Token: 21M fixed supply, 70% cryptographic time-locks, multi-chain utility across Arbitrum, Solana, and TON." 
        />
      </Helmet>
      
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
            Chronos Vault Token
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-[#FF5AF7] bg-clip-text text-transparent">
            CVT Token
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Fixed supply utility token powering the Trinity Protocol™ ecosystem
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://github.com/Chronos-Vault/chronos-vault-platform-" target="_blank" rel="noopener noreferrer">
              <Button className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90 text-white px-6">
                <ExternalLink className="h-4 w-4 mr-2" />
                View on GitHub
              </Button>
            </a>
            <Button 
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
              onClick={() => setLocation("/whitepaper")}
            >
              Read Whitepaper
            </Button>
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8 bg-gray-900/50 border border-gray-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600/30">
              Overview
            </TabsTrigger>
            <TabsTrigger value="utility" className="data-[state=active]:bg-purple-600/30">
              Utility
            </TabsTrigger>
            <TabsTrigger value="tokenomics" className="data-[state=active]:bg-purple-600/30">
              Tokenomics
            </TabsTrigger>
            <TabsTrigger value="staking" className="data-[state=active]:bg-purple-600/30">
              Staking
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">What Is CVT?</CardTitle>
                  <CardDescription className="text-gray-300">
                    Chronos Vault Token - The utility token powering Trinity Protocol™
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 rounded-lg bg-gray-900/50 text-center">
                      <div className="text-2xl font-bold text-purple-400">21,000,000</div>
                      <div className="text-sm text-gray-400">Max Supply</div>
                    </div>
                    <div className="p-4 rounded-lg bg-gray-900/50 text-center">
                      <div className="text-2xl font-bold text-cyan-400">70%</div>
                      <div className="text-sm text-gray-400">Time-Locked</div>
                    </div>
                    <div className="p-4 rounded-lg bg-gray-900/50 text-center">
                      <div className="text-2xl font-bold text-pink-400">21 Years</div>
                      <div className="text-sm text-gray-400">Max Lock Duration</div>
                    </div>
                    <div className="p-4 rounded-lg bg-gray-900/50 text-center">
                      <div className="text-2xl font-bold text-amber-400">3 Chains</div>
                      <div className="text-sm text-gray-400">Multi-Chain</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 text-gray-300">
                    <p className="text-lg">
                      CVT is the native utility token of the Trinity Protocol™ ecosystem. With a fixed supply of 21 million tokens (similar to Bitcoin), CVT powers governance, validator staking, and fee reduction across three blockchains.
                    </p>
                    <p>
                      <strong className="text-white">Key Feature:</strong> 70% of supply is locked in cryptographic VDF (Verifiable Delay Function) time-locks that cannot be accelerated - creating extreme scarcity and predictable supply release over 21 years.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Coins className="h-5 w-5 text-purple-400" />
                      Fixed Supply
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 text-sm">
                      Total of 21,000,000 CVT tokens will ever exist. No inflation, no minting. Bitcoin-like scarcity model.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <ArrowRightLeft className="h-5 w-5 text-cyan-400" />
                      Multi-Chain
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 text-sm">
                      CVT operates on Arbitrum, Solana, and TON. Cross-chain utility and seamless bridging between ecosystems.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Flame className="h-5 w-5 text-red-400" />
                      Deflationary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 text-sm">
                      60% of DEX swap fees and 30% of bridge fees are used to buyback and burn CVT, reducing supply over time.
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Current Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-green-400 mb-3">Built & Deployed</h4>
                      <ul className="space-y-2 text-gray-300">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          Smart contracts on 3 blockchains
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          Trinity consensus verification functional
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          HTLC atomic swaps working
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          Full ecosystem infrastructure
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-amber-400 mb-3">Pre-Launch</h4>
                      <ul className="space-y-2 text-gray-300">
                        <li className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-amber-500" />
                          Token not yet launched
                        </li>
                        <li className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-amber-500" />
                          Awaiting security audits
                        </li>
                        <li className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-amber-500" />
                          Team building in progress
                        </li>
                        <li className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-amber-500" />
                          Q2-Q3 2025 mainnet target
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="utility">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">CVT Token Utility</CardTitle>
                  <CardDescription className="text-gray-300">
                    Multiple use cases across the Trinity Protocol™ ecosystem
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tokenUtility.map((item, index) => (
                  <Card key={index} className="bg-gray-900/50 border-gray-800 hover:border-purple-500/50 transition-colors">
                    <CardContent className="pt-6">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${item.color} p-0.5 mb-4`}>
                        <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center text-white">
                          {item.icon}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                      <p className="text-gray-400 text-sm">{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Fee Reduction Tiers</CardTitle>
                  <CardDescription className="text-gray-300">
                    Hold more CVT to unlock better fee discounts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-lg bg-gray-800/50 text-center border border-gray-700">
                      <div className="text-sm text-gray-400 mb-1">Standard</div>
                      <div className="text-2xl font-bold text-white mb-1">0%</div>
                      <div className="text-xs text-gray-500">0 CVT</div>
                    </div>
                    <div className="p-4 rounded-lg bg-purple-900/20 text-center border border-purple-500/30">
                      <div className="text-sm text-purple-400 mb-1">Bronze</div>
                      <div className="text-2xl font-bold text-white mb-1">10%</div>
                      <div className="text-xs text-purple-300">1,000+ CVT</div>
                    </div>
                    <div className="p-4 rounded-lg bg-cyan-900/20 text-center border border-cyan-500/30">
                      <div className="text-sm text-cyan-400 mb-1">Silver</div>
                      <div className="text-2xl font-bold text-white mb-1">25%</div>
                      <div className="text-xs text-cyan-300">10,000+ CVT</div>
                    </div>
                    <div className="p-4 rounded-lg bg-amber-900/20 text-center border border-amber-500/30">
                      <div className="text-sm text-amber-400 mb-1">Gold</div>
                      <div className="text-2xl font-bold text-white mb-1">50%</div>
                      <div className="text-xs text-amber-300">100,000+ CVT</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="tokenomics">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Token Allocation</CardTitle>
                  <CardDescription className="text-gray-300">
                    21,000,000 CVT fixed supply distribution
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tokenAllocation.map((item) => (
                      <div key={item.category} className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${item.color}`} />
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-white">{item.category}</span>
                            <span className="text-gray-400">{item.percentage}% ({item.amount})</span>
                          </div>
                          <Progress value={item.percentage} className="h-2" />
                          <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <LockKeyhole className="h-5 w-5 text-purple-400" />
                    Vesting Schedule (VDF Time-Locks)
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Cryptographic time-locks that cannot be accelerated - not even by the team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {vestingSchedule.map((item) => (
                      <div key={item.year} className="p-4 rounded-lg bg-purple-900/20 border border-purple-500/30 text-center">
                        <div className="text-lg font-bold text-purple-400">Year {item.year}</div>
                        <div className="text-sm text-white mt-1">{item.amount}</div>
                        <div className="text-xs text-gray-400">{item.percentage}</div>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-400 mt-4">
                    These VDF (Verifiable Delay Function) time-locks are cryptographically enforced. Even the team cannot unlock tokens early.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Flame className="h-5 w-5 text-red-400" />
                    Deflationary Mechanism
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Target: 40% reduction in circulating supply over 10 years
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-white mb-3">Burn Sources</h4>
                      <ul className="space-y-2 text-gray-300">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full" />
                          60% of DEX swap fees → Buyback & Burn
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full" />
                          30% of bridge transaction fees → Burn
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full" />
                          Slashed validator stakes → Permanent burn
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-3">Value Drivers</h4>
                      <ul className="space-y-2 text-gray-300">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          Extreme scarcity (70% locked)
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          Cross-chain utility (3 blockchains)
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          Fixed 21M supply (no inflation)
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          Continuous deflationary pressure
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="staking">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Validator Staking</CardTitle>
                  <CardDescription className="text-gray-300">
                    Stake CVT to become a Trinity Protocol™ validator
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-xl bg-purple-900/30 border border-purple-500/40 text-center">
                      <div className="text-3xl font-bold text-purple-400 mb-2">100,000+</div>
                      <div className="text-sm text-gray-300">CVT Required to Stake</div>
                    </div>
                    <div className="p-6 rounded-xl bg-cyan-900/30 border border-cyan-500/40 text-center">
                      <div className="text-3xl font-bold text-cyan-400 mb-2">2-of-3</div>
                      <div className="text-sm text-gray-300">Consensus Model</div>
                    </div>
                    <div className="p-6 rounded-xl bg-pink-900/30 border border-pink-500/40 text-center">
                      <div className="text-3xl font-bold text-pink-400 mb-2">Rewards</div>
                      <div className="text-sm text-gray-300">For Honest Validation</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-4">How Validator Staking Works</h4>
                    <ol className="space-y-3 text-gray-300">
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">1</div>
                        <div>
                          <strong className="text-white">Stake CVT:</strong> Lock minimum 100,000 CVT as collateral
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">2</div>
                        <div>
                          <strong className="text-white">Run Trinity Shield™ TEE:</strong> Set up hardware security module (Intel SGX or AMD SEV)
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">3</div>
                        <div>
                          <strong className="text-white">Validate Consensus:</strong> Participate in 2-of-3 multi-chain verification
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">4</div>
                        <div>
                          <strong className="text-white">Earn Rewards:</strong> Receive CVT rewards for honest participation
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">!</div>
                        <div>
                          <strong className="text-red-400">Risk:</strong> Malicious behavior results in stake slashing (permanent burn)
                        </div>
                      </li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Validator Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-purple-400 mb-3">Hardware Requirements</h4>
                      <ul className="space-y-2 text-gray-300 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          Intel Xeon E-2300+ with SGX support
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          OR AMD EPYC 7003+ with SEV-SNP
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          Minimum 16GB RAM
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          Stable internet connection
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-cyan-400 mb-3">Economic Requirements</h4>
                      <ul className="space-y-2 text-gray-300 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          100,000+ CVT staked
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          Lock period: minimum 6 months
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          Slashing risk: up to 100% for malicious behavior
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          Rewards: proportional to stake and uptime
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-amber-900/20 border-amber-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="h-5 w-5 text-amber-400" />
                    Interested in Becoming a Validator?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    We're currently seeking early validators to join the Trinity Protocol™ network. If you have the technical expertise and hardware, we'd love to hear from you.
                  </p>
                  <Button 
                    className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90"
                    onClick={() => setLocation("/validator-onboarding")}
                  >
                    Learn About Validator Onboarding
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
