import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  BookOpen, Shield, Code, Lock, Zap, ArrowRight, ExternalLink, Terminal,
  FileText, Users, Coins, Map, HelpCircle, GraduationCap, Cpu, Eye,
  Network, Key, Clock, Globe, Fingerprint, Database, Wallet, Search
} from 'lucide-react';
import { SiEthereum, SiSolana } from 'react-icons/si';
import { Helmet } from 'react-helmet';

interface SecurityLayer {
  id: string;
  layer: number;
  name: string;
  protocol: string;
  description: string;
  status: string;
}

interface VaultType {
  id: string;
  name: string;
  shortDescription: string;
  category: string;
}

const DocumentationPage = () => {
  const { data: overviewData, isLoading: overviewLoading } = useQuery<{
    success: boolean;
    metrics: {
      protocolVersion: string;
      attackProbability: string;
      activeValidators: number;
      chainsProtected: number;
      totalSecurityLayers: number;
    };
  }>({
    queryKey: ['/api/security-docs/overview'],
  });

  const { data: layersData, isLoading: layersLoading } = useQuery<{
    success: boolean;
    layers: SecurityLayer[];
  }>({
    queryKey: ['/api/security-docs/layers'],
  });

  const { data: vaultData, isLoading: vaultLoading } = useQuery<{
    success: boolean;
    totalVaults: number;
    vaultTypes: VaultType[];
  }>({
    queryKey: ['/api/vault-catalog'],
  });

  const metrics = overviewData?.metrics;
  const layers = layersData?.layers || [];
  const vaultTypes = vaultData?.vaultTypes || [];

  const docCategories = [
    {
      title: 'Getting Started',
      description: 'New to Chronos Vault? Start here',
      icon: <BookOpen className="h-8 w-8" />,
      color: 'from-purple-600 to-violet-600',
      links: [
        { label: 'Introduction', href: '/documentation', desc: 'Platform overview' },
        { label: 'Vault School', href: '/vault-school', desc: 'Learn vault basics' },
        { label: 'FAQ', href: '/faq', desc: 'Common questions' },
        { label: 'Quick Start Guide', href: '/vault-school-hub', desc: 'Create your first vault' },
      ]
    },
    {
      title: 'Security & Protocol',
      description: 'Trinity Protocol™ and MDL security layers',
      icon: <Shield className="h-8 w-8" />,
      color: 'from-pink-600 to-rose-600',
      links: [
        { label: 'Trinity Protocol', href: '/trinity-protocol-dashboard', desc: '2-of-3 consensus' },
        { label: 'Security Layers', href: '/security-documentation', desc: '8 MDL layers' },
        { label: 'Military-Grade Security', href: '/military-grade-security', desc: 'Enterprise security' },
        { label: 'Security Tutorials', href: '/security-tutorials', desc: 'Learn security' },
      ]
    },
    {
      title: 'Smart Contracts',
      description: 'Deployed contracts across 3 chains',
      icon: <Code className="h-8 w-8" />,
      color: 'from-cyan-600 to-blue-600',
      links: [
        { label: 'Contract Addresses', href: '/smart-contracts', desc: 'Arbitrum, Solana, TON' },
        { label: 'API Documentation', href: '/api-documentation', desc: 'REST & WebSocket' },
        { label: 'SDK Access', href: '/sdk-documentation', desc: 'Developer SDK' },
        { label: 'Integration Guide', href: '/security-integration-guide', desc: 'For developers' },
      ]
    },
    {
      title: 'Vault Types',
      description: `${vaultData?.totalVaults || 22} specialized vault types`,
      icon: <Lock className="h-8 w-8" />,
      color: 'from-emerald-600 to-teal-600',
      links: [
        { label: 'All Vault Types', href: '/vault-school-hub', desc: 'Browse catalog' },
        { label: 'Time-Lock Vaults', href: '/time-lock-vault', desc: 'Schedule releases' },
        { label: 'Multi-Sig Vaults', href: '/multi-signature-vault-doc', desc: 'Shared control' },
        { label: 'Quantum Vaults', href: '/quantum-resistant-vault', desc: 'Future-proof' },
      ]
    },
    {
      title: 'CVT Token',
      description: 'Tokenomics and utility',
      icon: <Coins className="h-8 w-8" />,
      color: 'from-amber-600 to-orange-600',
      links: [
        { label: 'Token Overview', href: '/cvt-token', desc: 'CVT features' },
        { label: 'Tokenomics', href: '/cvt-tokenomics', desc: 'Distribution' },
        { label: 'Staking', href: '/cvt-staking', desc: 'Earn rewards' },
        { label: 'Utility', href: '/cvt-utility', desc: 'Token utility' },
      ]
    },
    {
      title: 'Resources',
      description: 'Whitepaper, roadmap, and team',
      icon: <FileText className="h-8 w-8" />,
      color: 'from-indigo-600 to-purple-600',
      links: [
        { label: 'Whitepaper', href: '/whitepaper', desc: 'Full whitepaper' },
        { label: 'Technical Spec', href: '/technical-specification', desc: 'Architecture' },
        { label: 'Roadmap', href: '/roadmap', desc: '2024-2026 plans' },
        { label: 'Team', href: '/team', desc: 'Our team' },
      ]
    },
  ];

  const quickLinks = [
    { icon: <Network className="h-5 w-5" />, label: 'Trinity Scan', href: '/monitoring', badge: 'Explorer' },
    { icon: <Wallet className="h-5 w-5" />, label: 'Connect Wallet', href: '/wallet', badge: 'Start' },
    { icon: <Zap className="h-5 w-5" />, label: 'HTLC Bridge', href: '/htlc-bridge', badge: 'Swap' },
    { icon: <GraduationCap className="h-5 w-5" />, label: 'Vault School', href: '/vault-school', badge: 'Learn' },
  ];

  const getLayerIcon = (layerId: string) => {
    switch (layerId) {
      case 'zk-proofs': return <Eye className="h-5 w-5" />;
      case 'formal-verification': return <FileText className="h-5 w-5" />;
      case 'mpc-keys': return <Key className="h-5 w-5" />;
      case 'vdf-timelocks': return <Clock className="h-5 w-5" />;
      case 'ai-governance': return <Cpu className="h-5 w-5" />;
      case 'quantum-crypto': return <Lock className="h-5 w-5" />;
      case 'trinity-protocol': return <Network className="h-5 w-5" />;
      case 'trinity-shield': return <Shield className="h-5 w-5" />;
      default: return <Shield className="h-5 w-5" />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Documentation | Chronos Vault - Trinity Protocol™</title>
        <meta name="description" content="Complete documentation for Chronos Vault's Trinity Protocol™ multi-chain security platform. Learn about 2-of-3 consensus, 8 MDL security layers, and 22+ vault types." />
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
                {metrics?.protocolVersion || 'v3.5.23'} Documentation
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-[#FF5AF7] bg-clip-text text-transparent">
                Chronos Vault Documentation
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Complete guide to Trinity Protocol™ multi-chain security. {metrics?.totalSecurityLayers || 8} security layers, 
                {metrics?.chainsProtected || 3} chains, {metrics?.activeValidators || 3} validators.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-3 mb-12"
            >
              {quickLinks.map((link, i) => (
                <Link key={i} href={link.href}>
                  <Button 
                    variant="outline" 
                    className="border-purple-500/30 bg-purple-900/10 hover:bg-purple-900/30 hover:border-purple-500/50"
                    data-testid={`quick-link-${link.label.toLowerCase().replace(' ', '-')}`}
                  >
                    {link.icon}
                    <span className="ml-2">{link.label}</span>
                    <Badge variant="secondary" className="ml-2 text-xs">{link.badge}</Badge>
                  </Button>
                </Link>
              ))}
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border border-purple-500/20 rounded-xl p-6 text-center"
              >
                <div className="text-3xl font-bold text-[#FF5AF7]">{metrics?.totalSecurityLayers || 8}</div>
                <div className="text-sm text-gray-400">Security Layers</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-cyan-900/30 to-blue-900/20 border border-cyan-500/20 rounded-xl p-6 text-center"
              >
                <div className="text-3xl font-bold text-cyan-400">{metrics?.chainsProtected || 3}</div>
                <div className="text-sm text-gray-400">Protected Chains</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-emerald-900/30 to-teal-900/20 border border-emerald-500/20 rounded-xl p-6 text-center"
              >
                <div className="text-3xl font-bold text-emerald-400">{vaultData?.totalVaults || 22}</div>
                <div className="text-sm text-gray-400">Vault Types</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-br from-amber-900/30 to-orange-900/20 border border-amber-500/20 rounded-xl p-6 text-center"
              >
                <div className="text-3xl font-bold text-amber-400">{metrics?.attackProbability || '<10⁻¹⁸'}</div>
                <div className="text-sm text-gray-400">Attack Probability</div>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {docCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="h-full bg-gray-900/50 border-gray-800 hover:border-purple-500/30 transition-all duration-300 group" data-testid={`doc-category-${category.title.toLowerCase().replace(/\s+/g, '-')}`}>
                  <CardHeader>
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                      {category.icon}
                    </div>
                    <CardTitle className="text-xl text-white">{category.title}</CardTitle>
                    <CardDescription className="text-gray-400">{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {category.links.map((link, i) => (
                        <Link key={i} href={link.href}>
                          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 hover:bg-purple-900/30 transition-colors cursor-pointer group/link" data-testid={`doc-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}>
                            <div>
                              <div className="text-sm font-medium text-white group-hover/link:text-[#FF5AF7]">{link.label}</div>
                              <div className="text-xs text-gray-500">{link.desc}</div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-500 group-hover/link:text-[#FF5AF7] group-hover/link:translate-x-1 transition-all" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Shield className="h-6 w-6 text-[#FF5AF7]" />
              Mathematical Defense Layer (MDL)
            </h2>
            
            {layersLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="h-32 bg-gray-800" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {layers.map((layer) => (
                  <div
                    key={layer.id}
                    className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 hover:border-purple-500/30 transition-all group"
                    data-testid={`security-layer-${layer.id}`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-purple-900/50 flex items-center justify-center text-[#FF5AF7]">
                        {getLayerIcon(layer.id)}
                      </div>
                      <Badge variant="outline" className="text-xs">Layer {layer.layer}</Badge>
                    </div>
                    <h3 className="font-semibold text-white text-sm mb-1">{layer.name}</h3>
                    <p className="text-xs text-gray-500">{layer.protocol}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Globe className="h-6 w-6 text-cyan-400" />
              Multi-Chain Architecture
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-cyan-900/20 to-blue-900/10 border-cyan-500/20">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-cyan-600 flex items-center justify-center">
                      <SiEthereum className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-white">Arbitrum Sepolia</CardTitle>
                      <Badge className="bg-cyan-600 text-white">PRIMARY</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400 mb-3">Main execution layer with 95% lower fees than Ethereum mainnet.</p>
                  <div className="text-xs text-gray-500 font-mono">Chain ID: 421614</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-900/20 to-violet-900/10 border-purple-500/20">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center">
                      <SiSolana className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-white">Solana Devnet</CardTitle>
                      <Badge className="bg-purple-600 text-white">MONITOR</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400 mb-3">High-frequency monitoring with 2000+ TPS and &lt;5s SLA.</p>
                  <div className="text-xs text-gray-500 font-mono">Network ID: 103</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-900/20 to-cyan-900/10 border-blue-500/20">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
                      <div className="text-white font-bold text-xl">💎</div>
                    </div>
                    <div>
                      <CardTitle className="text-lg text-white">TON Testnet</CardTitle>
                      <Badge className="bg-blue-500 text-white">BACKUP</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400 mb-3">Quantum-resistant recovery with ML-KEM-1024 and Dilithium-5.</p>
                  <div className="text-xs text-gray-500 font-mono">Network ID: -3</div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="text-center"
          >
            <Card className="bg-gradient-to-r from-purple-900/30 via-pink-900/20 to-purple-900/30 border-purple-500/20">
              <CardContent className="py-12">
                <h2 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h2>
                <p className="text-gray-400 mb-6 max-w-xl mx-auto">
                  Connect your wallet and create your first secure vault with Trinity Protocol™ protection.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/wallet">
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500" data-testid="button-connect-wallet">
                      <Wallet className="h-4 w-4 mr-2" />
                      Connect Wallet
                    </Button>
                  </Link>
                  <Link href="/vault-school-hub">
                    <Button variant="outline" className="border-purple-500/50 hover:bg-purple-900/30" data-testid="button-explore-vaults">
                      <Lock className="h-4 w-4 mr-2" />
                      Explore Vault Types
                    </Button>
                  </Link>
                  <Link href="/faq">
                    <Button variant="ghost" className="hover:bg-purple-900/30" data-testid="button-faq">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      FAQ
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default DocumentationPage;
