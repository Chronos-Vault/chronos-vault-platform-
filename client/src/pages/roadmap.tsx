import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CheckCircle2, Clock, Rocket, Target, Shield, Zap, Globe, 
  ArrowRight, Calendar, Users, Cpu, Lock, Network, Coins
} from "lucide-react";
import { SiDiscord, SiX, SiTelegram } from 'react-icons/si';

interface RoadmapItem {
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  quarter: string;
  icon: JSX.Element;
  color: string;
  features?: string[];
}

export default function RoadmapPage() {
  const completed2024: RoadmapItem[] = [
    {
      title: 'Trinity Protocol™ v3.5',
      description: 'Deployed 2-of-3 multi-chain consensus verification across Arbitrum, Solana, and TON',
      status: 'completed',
      quarter: 'Q4 2024',
      icon: <Network className="h-5 w-5" />,
      color: 'from-emerald-600 to-green-600',
      features: ['ChronosVaultOptimized on Arbitrum Sepolia', 'Real HTLC atomic swaps', '8 MDL security layers']
    },
    {
      title: 'Multi-Chain Wallet Support',
      description: 'MetaMask, Phantom, and TON Keeper wallet connections with seamless switching',
      status: 'completed',
      quarter: 'Q4 2024',
      icon: <Shield className="h-5 w-5" />,
      color: 'from-emerald-600 to-green-600',
      features: ['EIP-1193 compliant', 'WalletConnect v2', 'Multi-signature support']
    },
    {
      title: 'Trinity Scan Explorer',
      description: 'Real-time blockchain explorer for monitoring all cross-chain operations',
      status: 'completed',
      quarter: 'Q4 2024',
      icon: <Globe className="h-5 w-5" />,
      color: 'from-emerald-600 to-green-600',
      features: ['Live transaction tracking', 'Consensus verification status', 'Validator activity']
    }
  ];

  const q1q2_2025: RoadmapItem[] = [
    {
      title: 'Trinity Shield™ Hardware TEE',
      description: 'Intel SGX/AMD SEV enclave support for hardware-isolated validator signing',
      status: 'in-progress',
      quarter: 'Q1 2025',
      icon: <Cpu className="h-5 w-5" />,
      color: 'from-purple-600 to-violet-600',
      features: ['Remote attestation on-chain', 'Hardware key isolation', 'Lean proof integration']
    },
    {
      title: 'Validator Onboarding System',
      description: 'Community validator registration with hardware attestation workflow',
      status: 'in-progress',
      quarter: 'Q1 2025',
      icon: <Users className="h-5 w-5" />,
      color: 'from-purple-600 to-violet-600',
      features: ['Operator registration portal', 'SGX/SEV attestation', 'Status dashboard']
    },
    {
      title: 'CVT Token Launch',
      description: 'Native governance token with staking rewards and fee discounts',
      status: 'upcoming',
      quarter: 'Q2 2025',
      icon: <Coins className="h-5 w-5" />,
      color: 'from-amber-600 to-orange-600',
      features: ['DEX listing', 'Staking mechanism', 'Governance voting']
    },
    {
      title: 'Enhanced HTLC Bridge',
      description: 'All 6 cross-chain swap combinations with optimized gas estimation',
      status: 'upcoming',
      quarter: 'Q2 2025',
      icon: <Zap className="h-5 w-5" />,
      color: 'from-cyan-600 to-blue-600',
      features: ['ARB↔SOL', 'ARB↔TON', 'SOL↔TON bidirectional']
    }
  ];

  const q3q4_2025: RoadmapItem[] = [
    {
      title: 'Mobile App (iOS/Android)',
      description: 'Native mobile applications with biometric authentication',
      status: 'upcoming',
      quarter: 'Q3 2025',
      icon: <Target className="h-5 w-5" />,
      color: 'from-pink-600 to-rose-600',
      features: ['Face ID / Touch ID', 'Push notifications', 'Offline signing']
    },
    {
      title: 'Bitcoin Vault Integration',
      description: 'Native Bitcoin support with time-locked UTXOs and multisig',
      status: 'upcoming',
      quarter: 'Q3 2025',
      icon: <Lock className="h-5 w-5" />,
      color: 'from-orange-600 to-amber-600',
      features: ['Taproot scripts', 'HTLC with BTC', 'Halvening vaults']
    },
    {
      title: 'GeoVault Gaming',
      description: 'Location-based vault discovery with AR treasure hunting',
      status: 'upcoming',
      quarter: 'Q4 2025',
      icon: <Globe className="h-5 w-5" />,
      color: 'from-emerald-600 to-teal-600',
      features: ['GPS verification', 'Community challenges', 'NFT rewards']
    },
    {
      title: 'Enterprise Multi-Sig Controls',
      description: 'Advanced role-based access control for institutional clients',
      status: 'upcoming',
      quarter: 'Q4 2025',
      icon: <Shield className="h-5 w-5" />,
      color: 'from-indigo-600 to-purple-600',
      features: ['Customizable thresholds', 'Audit logging', 'Compliance reports']
    }
  ];

  const future2026: RoadmapItem[] = [
    {
      title: 'Legacy Planning Suite',
      description: 'Comprehensive inheritance planning with legal integration',
      status: 'upcoming',
      quarter: 'Q1 2026',
      icon: <Users className="h-5 w-5" />,
      color: 'from-emerald-600 to-green-600'
    },
    {
      title: 'AI-Enhanced Security',
      description: 'Machine learning anomaly detection and behavioral analysis',
      status: 'upcoming',
      quarter: 'Q2 2026',
      icon: <Cpu className="h-5 w-5" />,
      color: 'from-rose-600 to-red-600'
    },
    {
      title: 'Enterprise Vault Solutions',
      description: 'Complete institutional custody with SOC 2 compliance',
      status: 'upcoming',
      quarter: 'Q3 2026',
      icon: <Target className="h-5 w-5" />,
      color: 'from-sky-600 to-blue-600'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-emerald-600 text-white border-0"><CheckCircle2 className="h-3 w-3 mr-1" />Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-purple-600 text-white border-0"><Clock className="h-3 w-3 mr-1" />In Progress</Badge>;
      default:
        return <Badge variant="outline" className="border-gray-600 text-gray-400"><Rocket className="h-3 w-3 mr-1" />Upcoming</Badge>;
    }
  };

  const RoadmapCard = ({ item }: { item: RoadmapItem }) => (
    <Card className="bg-gray-900/50 border-gray-800 hover:border-purple-500/30 transition-all duration-300 h-full" data-testid={`roadmap-item-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white`}>
            {item.icon}
          </div>
          {getStatusBadge(item.status)}
        </div>
        <CardTitle className="text-lg text-white">{item.title}</CardTitle>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          {item.quarter}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-400 mb-3">{item.description}</p>
        {item.features && (
          <div className="flex flex-wrap gap-1.5">
            {item.features.map((feature, i) => (
              <Badge key={i} variant="outline" className="text-xs bg-gray-800/50 border-gray-700 text-gray-300">
                {feature}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <>
      <Helmet>
        <title>Roadmap | Chronos Vault - Trinity Protocol™</title>
        <meta name="description" content="Chronos Vault product roadmap 2024-2026. Track our progress on Trinity Protocol™, multi-chain security, CVT token launch, and enterprise features." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] via-[#121218] to-[#0a0a0f]">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#FF5AF7]/10 to-transparent blur-3xl" />

          <div className="container mx-auto px-4 py-16 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                2024 - 2026
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-[#FF5AF7] bg-clip-text text-transparent">
                Product Roadmap
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Our vision for the future of secure, multi-chain digital asset vaults
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border border-purple-500/20 rounded-2xl p-8 mb-12"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Mission</h3>
                  <p className="text-gray-300 text-sm">
                    To provide unparalleled security, privacy, and functionality for digital assets 
                    across all major blockchains with mathematically provable guarantees.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Vision</h3>
                  <p className="text-gray-300 text-sm">
                    Become the universal standard for secure time-locked vaults and cross-chain 
                    asset management in the global blockchain ecosystem.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 pb-20">
          <Tabs defaultValue="2025" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-gray-900/50 border border-gray-800 p-2 rounded-xl">
                <TabsTrigger 
                  value="2024" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/30 data-[state=active]:to-pink-600/30 data-[state=active]:text-white px-6"
                >
                  2024 ✓
                </TabsTrigger>
                <TabsTrigger 
                  value="2025" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/30 data-[state=active]:to-pink-600/30 data-[state=active]:text-white px-6"
                >
                  2025
                </TabsTrigger>
                <TabsTrigger 
                  value="2026" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/30 data-[state=active]:to-pink-600/30 data-[state=active]:text-white px-6"
                >
                  2026+
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="2024" className="mt-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-8">
                  <h2 className="text-2xl font-bold text-white">2024 Achievements</h2>
                  <Badge className="bg-emerald-600 text-white border-0">Completed</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completed2024.map((item, i) => (
                    <RoadmapCard key={i} item={item} />
                  ))}
                </div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="2025" className="mt-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-12"
              >
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <h2 className="text-2xl font-bold text-white">Q1-Q2 2025</h2>
                    <Badge className="bg-purple-600 text-white border-0">Core Technology</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {q1q2_2025.map((item, i) => (
                      <RoadmapCard key={i} item={item} />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <h2 className="text-2xl font-bold text-white">Q3-Q4 2025</h2>
                    <Badge className="bg-pink-600 text-white border-0">User Experience</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {q3q4_2025.map((item, i) => (
                      <RoadmapCard key={i} item={item} />
                    ))}
                  </div>
                </div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="2026" className="mt-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-8">
                  <h2 className="text-2xl font-bold text-white">2026 & Beyond</h2>
                  <Badge variant="outline" className="border-purple-500/50 text-purple-300">Long-term Vision</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {future2026.map((item, i) => (
                    <RoadmapCard key={i} item={item} />
                  ))}
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16"
          >
            <Card className="bg-gradient-to-r from-purple-900/30 via-pink-900/20 to-purple-900/30 border-purple-500/20">
              <CardContent className="py-12 text-center">
                <h2 className="text-2xl font-bold text-white mb-4">Join Our Journey</h2>
                <p className="text-gray-400 mb-6 max-w-xl mx-auto">
                  The Chronos Vault roadmap is ambitious and evolving. We welcome community 
                  feedback and participation as we build the future of blockchain security together.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500" data-testid="button-join-community">
                    <Users className="h-4 w-4 mr-2" />
                    Join Community
                  </Button>
                  <Link href="/docs">
                    <Button variant="outline" className="border-purple-500/50 hover:bg-purple-900/30" data-testid="button-read-docs">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Read Documentation
                    </Button>
                  </Link>
                </div>
                <div className="flex justify-center gap-4 mt-8">
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800">
                    <SiDiscord className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800">
                    <SiX className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800">
                    <SiTelegram className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
}
