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
  ChevronLeft, 
  Download, 
  FileText, 
  Coins, 
  Users, 
  Flame, 
  LockKeyhole, 
  BarChart3, 
  Shield, 
  Database,
  Globe,
  Clock,
  Cpu,
  Network,
  Layers,
  ExternalLink,
  CheckCircle2
} from "lucide-react";

const WhitepaperPage = () => {
  const [_, setLocation] = useLocation();
  const [selectedTab, setSelectedTab] = useState("overview");

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

  const revenueModel = [
    { stream: 'Vault Fees', description: 'Small fee on ChronosVault deposits/withdrawals', status: 'Planned' },
    { stream: 'Cross-Chain Swap Fees', description: 'Fee on HTLC atomic swaps between chains', status: 'Contracts Deployed' },
    { stream: 'Validator Staking', description: 'Validators stake CVT to participate in consensus', status: 'Architecture Complete' },
  ];

  const developmentMilestones = [
    { period: '2022-2024', phase: 'Foundation & Development', completed: true, items: ['Trinity Protocol™ architecture design', '3+ years of solo development', 'Core infrastructure built', '23 smart contracts developed'] },
    { period: 'Q4 2024', phase: 'Testnet Deployment', completed: true, items: ['14 contracts on Arbitrum Sepolia', '4 programs on Solana Devnet', '2 contracts on TON Testnet', 'Cross-chain HTLC swaps working'] },
    { period: 'Q1 2025', phase: 'Team Building', completed: false, items: ['Seeking co-founders (CEO, CTO)', 'Core contributor recruitment', 'Community building', 'Security audits'] },
    { period: 'Q2-Q3 2025', phase: 'Mainnet Launch', completed: false, items: ['Mainnet contract deployment', 'CVT token launch', 'DEX liquidity provision', 'Protocol fee activation'] },
    { period: 'Q4 2025+', phase: 'Expansion', completed: false, items: ['Additional chain support', 'Enterprise partnerships', 'Decentralized governance', 'Global expansion'] },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#0a0a0f] via-[#121218] to-[#0a0a0f] text-white">
      <Helmet>
        <title>Whitepaper | Chronos Vault - Trinity Protocol™</title>
        <meta name="description" content="Trinity Protocol™ technical whitepaper. 21M fixed supply CVT token, 70% cryptographic time-locks, 2-of-3 multi-chain consensus." />
      </Helmet>
      
      <main className="flex-1">
        <section className="py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#FF5AF7]/10 to-transparent blur-3xl" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                Technical Documentation
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-[#FF5AF7] bg-clip-text text-transparent">
                Trinity Protocol™ Whitepaper
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                Mathematically proven 2-of-3 multi-chain consensus for enterprise-grade digital asset security
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
                  onClick={() => setLocation("/smart-contracts")}
                >
                  <Database className="h-4 w-4 mr-2" />
                  View Deployed Contracts
                </Button>
              </div>
            </motion.div>
            
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8 bg-gray-900/50 border border-gray-800">
                <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600/30">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="tokenomics" className="data-[state=active]:bg-purple-600/30">
                  Tokenomics
                </TabsTrigger>
                <TabsTrigger value="revenue" className="data-[state=active]:bg-purple-600/30">
                  Revenue Model
                </TabsTrigger>
                <TabsTrigger value="architecture" className="data-[state=active]:bg-purple-600/30">
                  Architecture
                </TabsTrigger>
                <TabsTrigger value="roadmap" className="data-[state=active]:bg-purple-600/30">
                  Roadmap
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
                      <CardTitle className="text-2xl text-white">What Is Trinity Protocol™?</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-gray-300">
                      <p className="text-lg">
                        Trinity Protocol™ is a mathematically provable 2-of-3 consensus verification system for enterprise-grade multi-chain security. It secures digital assets across Arbitrum (PRIMARY), Solana (MONITOR), and TON (BACKUP) blockchains.
                      </p>
                      <p>
                        <strong className="text-white">The core principle:</strong> No single validator or blockchain failure can compromise your assets. 2 out of 3 independent validators must agree before any operation proceeds.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-gray-900/50 border-gray-800">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                          What's Already Built
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-gray-300">
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            23 smart contracts deployed on 3 blockchains
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            Working HTLC atomic swaps (all 6 chain pairs)
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            Trinity consensus verification functional
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            Full dashboard and monitoring infrastructure
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            3+ years of development
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gray-900/50 border-gray-800">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <Shield className="h-5 w-5 text-purple-500" />
                          Security Features
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-gray-300">
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full" />
                            8 cryptographic security layers (MDL)
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full" />
                            Zero-Knowledge Proofs (Groth16)
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full" />
                            Post-quantum cryptography (ML-KEM, Dilithium)
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full" />
                            Hardware TEE support (SGX/SEV)
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full" />
                            VDF cryptographic time-locks
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card className="bg-gray-900/50 border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-white">Target Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-lg bg-purple-900/20 border border-purple-500/30">
                          <h4 className="font-semibold text-purple-400 mb-2">DeFi Users</h4>
                          <p className="text-sm text-gray-400">Anyone wanting multi-chain security for their digital assets</p>
                        </div>
                        <div className="p-4 rounded-lg bg-cyan-900/20 border border-cyan-500/30">
                          <h4 className="font-semibold text-cyan-400 mb-2">DAOs</h4>
                          <p className="text-sm text-gray-400">Treasury management requiring multi-signature consensus</p>
                        </div>
                        <div className="p-4 rounded-lg bg-pink-900/20 border border-pink-500/30">
                          <h4 className="font-semibold text-pink-400 mb-2">Protocols</h4>
                          <p className="text-sm text-gray-400">Projects needing secure cross-chain operations</p>
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
                      <CardTitle className="text-2xl text-white">CVT Token (Chronos Vault Token)</CardTitle>
                      <CardDescription className="text-gray-300">
                        Fixed supply with Bitcoin-like scarcity. 70% locked in cryptographic time-locks.
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
                          <div className="text-2xl font-bold text-amber-400">40%</div>
                          <div className="text-sm text-gray-400">Target Burn (10yr)</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gray-900/50 border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-white">Token Allocation</CardTitle>
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
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {vestingSchedule.map((item) => (
                          <div key={item.year} className="p-4 rounded-lg bg-purple-900/20 border border-purple-500/30 text-center">
                            <div className="text-lg font-bold text-purple-400">Year {item.year}</div>
                            <div className="text-sm text-white">{item.amount}</div>
                            <div className="text-xs text-gray-400">{item.percentage}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gray-900/50 border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Flame className="h-5 w-5 text-red-400" />
                        Deflationary Mechanism
                      </CardTitle>
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
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-white mb-3">Value Drivers</h4>
                          <ul className="space-y-2 text-gray-300">
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                              Extreme scarcity (only 30% circulating initially)
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                              Cross-chain utility (Arbitrum, Solana, TON)
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                              Fixed 21M supply (no inflation)
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gray-900/50 border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-white">Token Utility</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-lg bg-purple-900/20 border border-purple-500/30">
                          <h4 className="font-semibold text-purple-400 mb-2">Governance</h4>
                          <p className="text-sm text-gray-400">Vote on protocol upgrades and parameters</p>
                        </div>
                        <div className="p-4 rounded-lg bg-cyan-900/20 border border-cyan-500/30">
                          <h4 className="font-semibold text-cyan-400 mb-2">Validator Staking</h4>
                          <p className="text-sm text-gray-400">Stake to become a Trinity validator</p>
                        </div>
                        <div className="p-4 rounded-lg bg-pink-900/20 border border-pink-500/30">
                          <h4 className="font-semibold text-pink-400 mb-2">Fee Discounts</h4>
                          <p className="text-sm text-gray-400">Reduced fees for CVT holders</p>
                        </div>
                        <div className="p-4 rounded-lg bg-amber-900/20 border border-amber-500/30">
                          <h4 className="font-semibold text-amber-400 mb-2">Consensus Rewards</h4>
                          <p className="text-sm text-gray-400">Validators earn CVT for honest participation</p>
                        </div>
                        <div className="p-4 rounded-lg bg-red-900/20 border border-red-500/30">
                          <h4 className="font-semibold text-red-400 mb-2">Slashing Collateral</h4>
                          <p className="text-sm text-gray-400">Validators stake CVT as security deposit</p>
                        </div>
                        <div className="p-4 rounded-lg bg-green-900/20 border border-green-500/30">
                          <h4 className="font-semibold text-green-400 mb-2">Premium Features</h4>
                          <p className="text-sm text-gray-400">Access to advanced vault types</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="revenue">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <Card className="bg-gradient-to-br from-amber-900/30 to-orange-900/20 border-amber-500/30">
                    <CardHeader>
                      <CardTitle className="text-2xl text-white">Revenue Model</CardTitle>
                      <CardDescription className="text-gray-300">
                        Pre-launch - no revenue yet. Here's the planned model once we go live.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {revenueModel.map((item) => (
                      <Card key={item.stream} className="bg-gray-900/50 border-gray-800">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-white text-lg">{item.stream}</CardTitle>
                            <Badge className={item.status === 'Contracts Deployed' ? 'bg-green-600' : item.status === 'Architecture Complete' ? 'bg-cyan-600' : 'bg-gray-600'}>
                              {item.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-400">{item.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <Card className="bg-gray-900/50 border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-white">Honest Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-green-400 mb-3">What We Have</h4>
                          <ul className="space-y-2 text-gray-300">
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              Working codebase with deployed contracts
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              3+ years of development
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              Clear technical roadmap
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              Comprehensive documentation
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-amber-400 mb-3">What We Don't Have (Yet)</h4>
                          <ul className="space-y-2 text-gray-300">
                            <li className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-amber-500" />
                              Revenue (pre-launch)
                            </li>
                            <li className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-amber-500" />
                              External funding (bootstrapped)
                            </li>
                            <li className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-amber-500" />
                              Large team (seeking co-founders)
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="architecture">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border-purple-500/30">
                    <CardHeader>
                      <CardTitle className="text-2xl text-white">Trinity Protocol™ Architecture</CardTitle>
                      <CardDescription className="text-gray-300">
                        Fixed-layer architecture where each blockchain serves a dedicated security role
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-xl bg-purple-900/30 border border-purple-500/40">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-xl">⟠</div>
                            <div>
                              <h3 className="font-bold text-white">Arbitrum Sepolia</h3>
                              <Badge className="bg-purple-600 text-white">PRIMARY</Badge>
                            </div>
                          </div>
                          <p className="text-sm text-gray-300">Immutable ownership records via Layer 2 for 95% lower fees. Maximum decentralization and ecosystem support.</p>
                          <p className="mt-3 text-xs text-purple-300">14 contracts deployed</p>
                        </div>
                        
                        <div className="p-6 rounded-xl bg-cyan-900/30 border border-cyan-500/40">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center text-xl">◎</div>
                            <div>
                              <h3 className="font-bold text-white">Solana Devnet</h3>
                              <Badge className="bg-cyan-600 text-white">MONITOR</Badge>
                            </div>
                          </div>
                          <p className="text-sm text-gray-300">High-frequency monitoring and state verification. Lightning fast with ultra-low latency consensus.</p>
                          <p className="mt-3 text-xs text-cyan-300">4 programs deployed</p>
                        </div>
                        
                        <div className="p-6 rounded-xl bg-blue-900/30 border border-blue-500/40">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-xl">💎</div>
                            <div>
                              <h3 className="font-bold text-white">TON Testnet</h3>
                              <Badge className="bg-blue-600 text-white">BACKUP</Badge>
                            </div>
                          </div>
                          <p className="text-sm text-gray-300">Quantum-resistant recovery with ML-KEM-1024 and CRYSTALS-Dilithium-5. 48-hour emergency delay.</p>
                          <p className="mt-3 text-xs text-blue-300">2 contracts deployed</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gray-900/50 border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-white">Mathematical Defense Layer™ (8 Layers)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50">
                          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold">1</div>
                          <div>
                            <span className="text-white">Zero-Knowledge Proofs</span>
                            <span className="text-gray-400 text-sm ml-2">Groth16</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50">
                          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold">2</div>
                          <div>
                            <span className="text-white">Formal Verification</span>
                            <span className="text-gray-400 text-sm ml-2">Lean 4</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50">
                          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold">3</div>
                          <div>
                            <span className="text-white">MPC Key Management</span>
                            <span className="text-gray-400 text-sm ml-2">3-of-5 Shamir + Kyber</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50">
                          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold">4</div>
                          <div>
                            <span className="text-white">VDF Time-Locks</span>
                            <span className="text-gray-400 text-sm ml-2">Wesolowski</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50">
                          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold">5</div>
                          <div>
                            <span className="text-white">AI + Crypto Governance</span>
                            <span className="text-gray-400 text-sm ml-2">ML Anomaly Detection</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50">
                          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold">6</div>
                          <div>
                            <span className="text-white">Quantum-Resistant</span>
                            <span className="text-gray-400 text-sm ml-2">ML-KEM + Dilithium</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50">
                          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold">7</div>
                          <div>
                            <span className="text-white">Trinity Protocol™</span>
                            <span className="text-gray-400 text-sm ml-2">2-of-3 Multi-Chain</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50">
                          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold">8</div>
                          <div>
                            <span className="text-white">Trinity Shield™ TEE</span>
                            <span className="text-gray-400 text-sm ml-2">Intel SGX / AMD SEV</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="roadmap">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border-purple-500/30">
                    <CardHeader>
                      <CardTitle className="text-2xl text-white">Development Roadmap</CardTitle>
                      <CardDescription className="text-gray-300">
                        Honest timeline of what's been built and what's planned
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <div className="space-y-4">
                    {developmentMilestones.map((milestone, index) => (
                      <Card key={milestone.period} className={`border ${milestone.completed ? 'bg-green-900/10 border-green-500/30' : 'bg-gray-900/50 border-gray-800'}`}>
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${milestone.completed ? 'bg-green-600' : 'bg-gray-700'}`}>
                              {milestone.completed ? (
                                <CheckCircle2 className="h-5 w-5 text-white" />
                              ) : (
                                <Clock className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className={`font-bold ${milestone.completed ? 'text-green-400' : 'text-gray-400'}`}>
                                  {milestone.period}
                                </span>
                                <span className="text-white font-semibold">{milestone.phase}</span>
                                {milestone.completed && (
                                  <Badge className="bg-green-600 text-white">Completed</Badge>
                                )}
                              </div>
                              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {milestone.items.map((item, i) => (
                                  <li key={i} className="text-sm text-gray-400 flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full ${milestone.completed ? 'bg-green-500' : 'bg-gray-600'}`} />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
    </div>
  );
};

export default WhitepaperPage;
