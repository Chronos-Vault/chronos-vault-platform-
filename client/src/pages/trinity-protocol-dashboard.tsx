import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Check, 
  ExternalLink, 
  Activity, 
  Lock, 
  Layers,
  TrendingUp,
  Globe,
  Code,
  FileCode,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  GitBranch,
  Zap,
  RefreshCw,
  DollarSign
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';

interface PriceData {
  prices: {
    ethereum: { symbol: string; price: number; currency: string };
    solana: { symbol: string; price: number; currency: string };
    ton: { symbol: string; price: number; currency: string };
  };
  feeEconomics: {
    trinityFee: { amount: number; symbol: string; usd: string; description: string };
    feeBreakdown: Record<string, { usd: string; description: string }>;
    feePercentageBySize: Array<{ swapUsd: string; feePercent: string }>;
  };
  minimums: Record<string, { amount: number; symbol: string; usd: string; reason: string }>;
  updatedAt: string;
}

interface ChainStatus {
  name: string;
  network: string;
  status: 'online' | 'offline' | 'syncing';
  blockHeight: number;
  role: string;
  color: string;
}

const DEPLOYED_CONTRACTS = {
  arbitrum: {
    chain: 'Arbitrum Sepolia',
    chainId: '421614',
    explorer: 'https://sepolia.arbiscan.io/address/',
    contracts: [
      { name: 'TrinityConsensusVerifier', address: '0x59396D58Fa856025bD5249E342729d5550Be151C' },
      { name: 'HTLCChronosBridge', address: '0x82C3AbF6036cEE41E151A90FE00181f6b18af8ca' },
      { name: 'ChronosVaultOptimized', address: '0xAE408eC592f0f865bA0012C480E8867e12B4F32D' },
      { name: 'TrinityShieldVerifierV2', address: '0xf111D291afdf8F0315306F3f652d66c5b061F4e3' },
      { name: 'EmergencyMultiSig', address: '0x066A39Af76b625c1074aE96ce9A111532950Fc41' },
      { name: 'TrinityKeeperRegistry', address: '0xAe9bd988011583D87d6bbc206C19e4a9Bda04830' },
      { name: 'CrossChainMessageRelay', address: '0xC6F4f855fc690CB52159eE3B13C9d9Fb8D403E59' },
    ]
  },
  solana: {
    chain: 'Solana Devnet',
    chainId: 'devnet',
    explorer: 'https://explorer.solana.com/address/',
    explorerSuffix: '?cluster=devnet',
    contracts: [
      { name: 'TrinityProgram', address: 'CYaDJYRqm35udQ8vkxoajSER8oaniQUcV8Vvw5BqJyo2' },
      { name: 'DeploymentWallet', address: 'AjWeKXXgLpb2Cy3LfmqPjms3UkN1nAi596qBi8fRdLLQ' },
    ]
  },
  ton: {
    chain: 'TON Testnet',
    chainId: 'testnet',
    explorer: 'https://testnet.tonscan.org/address/',
    contracts: [
      { name: 'TrinityConsensus', address: 'EQeGlYzwupSROVWGucOmKyUDbSaKmPfIpHHP5mV73odL8' },
      { name: 'ChronosVault', address: 'EQjUVidQfn4m-Rougn0fol7ECCthba2HV0M6xz9zAfax4' },
      { name: 'CrossChainBridge', address: 'EQgWobA9D4u6Xem3B8e6Sde_NEFZYicyy7_5_XvOT18mA' },
    ]
  }
};

export default function TrinityProtocolDashboard() {
  const { toast } = useToast();
  const [chains, setChains] = useState<ChainStatus[]>([
    { name: 'Arbitrum', network: 'Sepolia', status: 'online', blockHeight: 0, role: 'PRIMARY', color: 'blue' },
    { name: 'Solana', network: 'Devnet', status: 'online', blockHeight: 0, role: 'MONITOR', color: 'purple' },
    { name: 'TON', network: 'Testnet', status: 'online', blockHeight: 0, role: 'BACKUP', color: 'cyan' }
  ]);

  const { data: priceData, refetch: refetchPrices } = useQuery<{ success: boolean; data: PriceData }>({
    queryKey: ['/api/scanner/prices'],
  });

  const { data: statsData } = useQuery<{ success: boolean; data: any }>({
    queryKey: ['/api/scanner/stats'],
  });

  useEffect(() => {
    const fetchBlockchainData = async () => {
      try {
        const response = await fetch('/api/blockchain/status');
        if (response.ok) {
          const data = await response.json();
          setChains(prev => prev.map(chain => {
            if (chain.name === 'Arbitrum' && data.ethereum) {
              return { ...chain, blockHeight: data.ethereum.blockNumber || 0, status: data.ethereum.connected ? 'online' : 'offline' };
            }
            if (chain.name === 'Solana' && data.solana) {
              return { ...chain, blockHeight: data.solana.slot || 0, status: data.solana.connected ? 'online' : 'offline' };
            }
            if (chain.name === 'TON' && data.ton) {
              return { ...chain, blockHeight: data.ton.masterchainInfo?.last?.seqno || 0, status: data.ton.connected ? 'online' : 'offline' };
            }
            return chain;
          }));
        }
      } catch (error) {
        console.error('Failed to fetch blockchain status:', error);
      }
    };
    fetchBlockchainData();
    const interval = setInterval(fetchBlockchainData, 15000);
    return () => clearInterval(interval);
  }, []);

  const prices = priceData?.data?.prices;
  const feeEconomics = priceData?.data?.feeEconomics;
  const minimums = priceData?.data?.minimums;
  const stats = statsData?.data;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#0f0f2a] to-[#0a0a1a] text-white">
      <section className="relative py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF5AF7]/10 via-transparent to-[#6B00D7]/10" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-[#FF5AF7]" />
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <Activity className="w-3 h-3 mr-1 inline" /> Live on Testnet
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[#FF5AF7] to-[#6B00D7] bg-clip-text text-transparent">
            Trinity Protocol™ v3.5.23
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mb-6">
            Mathematically provable 2-of-3 consensus verification for enterprise-grade 
            multi-chain security. Even if 1 chain is compromised, your funds remain safe.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#1a1a3a]/80 border border-gray-700 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-[#FF5AF7]">{stats?.totalSwaps || 31}</div>
              <div className="text-sm text-gray-400">Total Swaps</div>
            </div>
            <div className="bg-[#1a1a3a]/80 border border-gray-700 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-400">${stats?.totalVolume || '570+'}</div>
              <div className="text-sm text-gray-400">Volume (USD)</div>
            </div>
            <div className="bg-[#1a1a3a]/80 border border-gray-700 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-blue-400">2/3</div>
              <div className="text-sm text-gray-400">Consensus Required</div>
            </div>
            <div className="bg-[#1a1a3a]/80 border border-gray-700 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-purple-400">3</div>
              <div className="text-sm text-gray-400">Active Chains</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link href="/bridge">
              <Button className="bg-gradient-to-r from-[#FF5AF7] to-[#6B00D7]" data-testid="button-try-bridge">
                Try the Bridge <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/monitoring">
              <Button variant="outline" className="border-gray-600" data-testid="button-trinity-scan">
                Trinity Scan <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="https://github.com/Chronos-Vault/chronos-vault-platform-" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-gray-600" data-testid="button-github">
                <GitBranch className="mr-2 h-4 w-4" /> GitHub
              </Button>
            </a>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-20">
        <Tabs defaultValue="architecture" className="space-y-8">
          <TabsList className="bg-[#1a1a3a] border border-gray-700 p-1 flex-wrap h-auto">
            <TabsTrigger value="architecture" className="data-[state=active]:bg-[#FF5AF7]/20">
              <Layers className="mr-2 h-4 w-4" /> Architecture
            </TabsTrigger>
            <TabsTrigger value="fees" className="data-[state=active]:bg-[#FF5AF7]/20">
              <DollarSign className="mr-2 h-4 w-4" /> Fee Economics
            </TabsTrigger>
            <TabsTrigger value="contracts" className="data-[state=active]:bg-[#FF5AF7]/20">
              <FileCode className="mr-2 h-4 w-4" /> Smart Contracts
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-[#FF5AF7]/20">
              <Shield className="mr-2 h-4 w-4" /> Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="architecture" className="space-y-6">
            <Card className="bg-[#1a1a3a]/80 border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Layers className="h-6 w-6 text-[#FF5AF7]" />
                  Multi-Chain Validator Network
                </CardTitle>
                <CardDescription>
                  2-of-3 consensus across Arbitrum, Solana, and TON
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {chains.map((chain) => (
                    <Card key={chain.name} className={`bg-[#0f0f2a] border-${chain.color}-500/30`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${chain.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                            <span className="font-semibold">{chain.name}</span>
                          </div>
                          <Badge className={`bg-${chain.color}-500/20 text-${chain.color}-400`}>{chain.role}</Badge>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">
                          {chain.name === 'Arbitrum' && 'Main security validator. Hosts HTLC contracts and provides initial consensus.'}
                          {chain.name === 'Solana' && 'High-frequency monitoring with <5s SLA. Validates cross-chain state.'}
                          {chain.name === 'TON' && 'Emergency recovery with quantum-resistant cryptography (ML-KEM-1024).'}
                        </p>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{chain.network}</span>
                          <span>Block: {chain.blockHeight.toLocaleString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-8 p-6 bg-[#0f0f2a] rounded-lg border border-[#FF5AF7]/20">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-[#FF5AF7]" />
                    How HTLC Atomic Swaps Work
                  </h3>
                  <div className="grid md:grid-cols-4 gap-4">
                    {[
                      { step: '1', title: 'Create HTLC', desc: 'User locks funds on source chain with secret hash' },
                      { step: '2', title: 'Arbitrum Validates', desc: 'Primary validator confirms and signs (1/3)' },
                      { step: '3', title: 'Solana Confirms', desc: 'Monitor validator verifies state (2/3 consensus!)' },
                      { step: '4', title: 'Claim Assets', desc: 'User reveals secret and claims on destination chain' }
                    ].map((item) => (
                      <div key={item.step} className="text-center">
                        <div className="w-10 h-10 rounded-full bg-[#FF5AF7]/20 text-[#FF5AF7] flex items-center justify-center mx-auto mb-2 font-bold">
                          {item.step}
                        </div>
                        <div className="font-medium text-sm">{item.title}</div>
                        <div className="text-xs text-gray-400 mt-1">{item.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fees" className="space-y-6">
            <Card className="bg-[#1a1a3a]/80 border-gray-700">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <DollarSign className="h-6 w-6 text-[#FF5AF7]" />
                      Fee Economics (Real-Time)
                    </CardTitle>
                    <CardDescription>
                      Live prices from CoinGecko • Updated {priceData?.data?.updatedAt ? new Date(priceData.data.updatedAt).toLocaleTimeString() : 'loading...'}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => refetchPrices()} className="border-gray-600">
                    <RefreshCw className="h-4 w-4 mr-1" /> Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  {prices && Object.entries(prices).map(([key, value]) => (
                    <Card key={key} className="bg-[#0f0f2a] border-gray-600">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold">${value.price.toLocaleString()}</div>
                        <div className="text-sm text-gray-400">{value.symbol}/USD</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-[#0f0f2a] border-[#FF5AF7]/30">
                    <CardHeader>
                      <CardTitle className="text-lg">Trinity Fee: ${feeEconomics?.trinityFee?.usd || '3.13'}</CardTitle>
                      <CardDescription>Flat fee per swap (0.001 ETH)</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <table className="w-full text-sm">
                        <tbody>
                          {feeEconomics?.feeBreakdown && Object.entries(feeEconomics.feeBreakdown).filter(([k]) => k !== 'total').map(([key, value]) => (
                            <tr key={key} className="border-b border-gray-700/50">
                              <td className="py-2 text-gray-400">{value.description}</td>
                              <td className="py-2 text-right">${value.usd}</td>
                            </tr>
                          ))}
                          <tr className="font-semibold">
                            <td className="py-2 text-[#FF5AF7]">Total</td>
                            <td className="py-2 text-right text-[#FF5AF7]">${feeEconomics?.trinityFee?.usd || '3.13'}</td>
                          </tr>
                        </tbody>
                      </table>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#0f0f2a] border-green-500/30">
                    <CardHeader>
                      <CardTitle className="text-lg">Fee % by Swap Size</CardTitle>
                      <CardDescription>Flat fee = lower % for larger swaps</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="py-2 text-left text-gray-400">Swap Size</th>
                            <th className="py-2 text-right text-gray-400">Fee %</th>
                          </tr>
                        </thead>
                        <tbody>
                          {feeEconomics?.feePercentageBySize?.map((item, i) => (
                            <tr key={i} className="border-b border-gray-700/50">
                              <td className="py-2">${item.swapUsd}</td>
                              <td className="py-2 text-right text-green-400">{item.feePercent}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-[#0f0f2a] border-yellow-500/30">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                      Minimum Swap Amounts (Dust Attack Prevention)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      {minimums && Object.entries(minimums).map(([chain, data]) => (
                        <div key={chain} className="p-4 bg-[#1a1a3a] rounded-lg">
                          <div className="font-semibold capitalize">{chain}</div>
                          <div className="text-2xl font-bold text-[#FF5AF7]">{data.amount} {data.symbol}</div>
                          <div className="text-sm text-gray-400">≈ ${data.usd}</div>
                          <div className="text-xs text-gray-500 mt-2">{data.reason}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contracts" className="space-y-6">
            <Card className="bg-[#1a1a3a]/80 border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <FileCode className="h-6 w-6 text-[#FF5AF7]" />
                  Deployed Smart Contracts
                </CardTitle>
                <CardDescription>
                  All contracts are deployed and verified on testnet
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(DEPLOYED_CONTRACTS).map(([network, data]) => (
                  <div key={network} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-[#FF5AF7]/20 text-[#FF5AF7]">{data.chain}</Badge>
                      <span className="text-sm text-gray-400">Chain ID: {data.chainId}</span>
                    </div>
                    <div className="grid gap-2">
                      {data.contracts.map((contract) => (
                        <div key={contract.name} className="flex items-center justify-between p-3 bg-[#0f0f2a] rounded-lg border border-gray-700/50">
                          <div>
                            <div className="font-medium">{contract.name}</div>
                            <code className="text-xs text-gray-400">{contract.address}</code>
                          </div>
                          <a 
                            href={`${data.explorer}${contract.address}${(data as any).explorerSuffix || ''}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#FF5AF7] hover:underline flex items-center gap-1"
                          >
                            View <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="bg-[#1a1a3a]/80 border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Shield className="h-6 w-6 text-[#FF5AF7]" />
                  Mathematical Defense Layer (MDL)
                </CardTitle>
                <CardDescription>
                  8 cryptographic security layers protecting your assets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { name: 'Zero-Knowledge Proofs', desc: 'Groth16 SNARK verification', icon: Lock },
                    { name: 'Formal Verification', desc: 'Lean 4 mathematical proofs', icon: CheckCircle2 },
                    { name: 'MPC Key Management', desc: 'Shamir Secret Sharing + CRYSTALS-Kyber', icon: Globe },
                    { name: 'VDF Time-Locks', desc: 'Wesolowski Verifiable Delay Functions', icon: Activity },
                    { name: 'Trinity Protocol™', desc: '2-of-3 multi-chain consensus', icon: Layers },
                    { name: 'Quantum-Resistant', desc: 'ML-KEM-1024, CRYSTALS-Dilithium-5', icon: Shield },
                    { name: 'Trinity Shield™', desc: 'Hardware TEE (Intel SGX/AMD SEV)', icon: Zap },
                    { name: 'AI Governance', desc: 'Anomaly detection + threat response', icon: TrendingUp },
                  ].map((layer) => (
                    <div key={layer.name} className="flex items-start gap-3 p-4 bg-[#0f0f2a] rounded-lg border border-gray-700/50">
                      <layer.icon className="h-5 w-5 text-[#FF5AF7] mt-0.5" />
                      <div>
                        <div className="font-medium">{layer.name}</div>
                        <div className="text-sm text-gray-400">{layer.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="flex items-center gap-2 text-green-400 font-semibold mb-2">
                    <CheckCircle2 className="h-5 w-5" />
                    Security Guarantee
                  </div>
                  <p className="text-sm text-gray-300">
                    Even if 1 blockchain is completely compromised, your funds remain secure. 
                    An attacker would need to simultaneously control 2 out of 3 independent 
                    validator networks across different blockchain ecosystems.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
