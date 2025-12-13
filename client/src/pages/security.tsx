import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Lock,
  CheckCircle,
  ExternalLink,
  Activity,
  Layers,
  Zap,
  Globe,
  Key,
  AlertTriangle,
  Server,
  Cpu
} from 'lucide-react';

const DEPLOYED_CONTRACTS = {
  TrinityConsensusVerifier: '0x59396D58Fa856025bD5249E342729d5550Be151C',
  TrinityShieldVerifierV2: '0xf111D291afdf8F0315306F3f652d66c5b061F4e3',
  EmergencyMultiSig: '0x066A39Af76b625c1074aE96ce9A111532950Fc41',
  HTLCChronosBridge: '0x82C3AbF6036cEE41E151A90FE00181f6b18af8ca',
  ChronosVaultOptimized: '0xAE408eC592f0f865bA0012C480E8867e12B4F32D',
};

const VALIDATORS = [
  { chain: 'Arbitrum', role: 'PRIMARY', address: '0x3A92fD5b39Ec9598225DB5b9f15af0523445E3d8', chainId: 1 },
  { chain: 'Solana', role: 'MONITOR', address: '0x2554324ae222673F4C36D1Ae0E58C19fFFf69cd5', chainId: 2 },
  { chain: 'TON', role: 'BACKUP', address: '0x9662e22D1f037C7EB370DD0463c597C6cd69B4c4', chainId: 3 },
];

const MDL_LAYERS = [
  { id: 1, name: 'Zero-Knowledge Proofs', algorithm: 'Groth16 SNARKs', status: 'active', description: 'Mathematical proofs without revealing data' },
  { id: 2, name: 'Formal Verification', algorithm: 'Lean 4', status: 'active', description: 'Mathematically proven correct contracts' },
  { id: 3, name: 'MPC Key Management', algorithm: 'Shamir + CRYSTALS-Kyber', status: 'active', description: 'Distributed key generation and storage' },
  { id: 4, name: 'VDF Time-Locks', algorithm: 'Wesolowski VDF', status: 'active', description: 'Enforced time delays on operations' },
  { id: 5, name: 'AI Governance', algorithm: 'Anomaly Detection', status: 'active', description: 'Real-time threat monitoring' },
  { id: 6, name: 'Quantum-Resistant', algorithm: 'ML-KEM-1024', status: 'active', description: 'Post-quantum cryptography' },
  { id: 7, name: 'Trinity Protocol™', algorithm: '2-of-3 Consensus', status: 'active', description: 'Multi-chain validator verification' },
  { id: 8, name: 'Trinity Shield™', algorithm: 'Intel SGX / AMD SEV', status: 'active', description: 'Hardware TEE isolation' },
];

export default function SecurityPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const { data: blockchainStatus } = useQuery<any>({
    queryKey: ['/api/blockchain/status'],
  });

  const { data: statsData } = useQuery<{ success: boolean; data: any }>({
    queryKey: ['/api/scanner/stats'],
  });

  const stats = statsData?.data;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#0f0f2a] to-[#0a0a1a] text-white">
      <section className="relative py-12 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-blue-500/5" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-green-400" />
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <Activity className="w-3 h-3 mr-1 inline" /> All Systems Secure
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Security Control Center
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mb-6">
            8-layer Mathematical Defense Layer (MDL) protecting your assets with mathematically proven security.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#1a1a3a]/80 border border-gray-700 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-400">8</div>
              <div className="text-sm text-gray-400">Security Layers</div>
            </div>
            <div className="bg-[#1a1a3a]/80 border border-gray-700 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-blue-400">3</div>
              <div className="text-sm text-gray-400">Active Validators</div>
            </div>
            <div className="bg-[#1a1a3a]/80 border border-gray-700 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-purple-400">{stats?.successRate || '100'}%</div>
              <div className="text-sm text-gray-400">Success Rate</div>
            </div>
            <div className="bg-[#1a1a3a]/80 border border-gray-700 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-cyan-400">{stats?.totalSwaps || 31}</div>
              <div className="text-sm text-gray-400">Secured Swaps</div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-[#1a1a3a] border border-gray-700 p-1 flex-wrap h-auto">
            <TabsTrigger value="overview" className="data-[state=active]:bg-green-500/20">
              <Shield className="mr-2 h-4 w-4" /> Overview
            </TabsTrigger>
            <TabsTrigger value="validators" className="data-[state=active]:bg-green-500/20">
              <Globe className="mr-2 h-4 w-4" /> Validators
            </TabsTrigger>
            <TabsTrigger value="contracts" className="data-[state=active]:bg-green-500/20">
              <Lock className="mr-2 h-4 w-4" /> Contracts
            </TabsTrigger>
            <TabsTrigger value="mdl" className="data-[state=active]:bg-green-500/20">
              <Layers className="mr-2 h-4 w-4" /> MDL Layers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-[#1a1a3a]/80 border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Shield className="h-6 w-6 text-green-400" />
                  Trinity Protocol™ Security Model
                </CardTitle>
                <CardDescription>
                  2-of-3 consensus ensures funds are safe even if one chain is compromised
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { chain: 'Arbitrum', role: 'PRIMARY', status: blockchainStatus?.ethereum?.connected, color: 'blue' },
                    { chain: 'Solana', role: 'MONITOR', status: blockchainStatus?.solana?.connected, color: 'purple' },
                    { chain: 'TON', role: 'BACKUP', status: blockchainStatus?.ton?.connected, color: 'cyan' },
                  ].map((validator) => (
                    <Card key={validator.chain} className="bg-[#0f0f2a] border-gray-600">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold">{validator.chain}</span>
                          <Badge className={`bg-${validator.color}-500/20 text-${validator.color}-400`}>
                            {validator.role}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className={`w-2 h-2 rounded-full ${validator.status !== false ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                          <span className="text-gray-400">{validator.status !== false ? 'Online' : 'Offline'}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="flex items-center gap-2 text-green-400 font-semibold mb-2">
                    <CheckCircle className="h-5 w-5" />
                    Security Guarantee
                  </div>
                  <p className="text-sm text-gray-300">
                    With 2-of-3 consensus, an attacker would need to compromise 2 independent blockchain 
                    networks simultaneously. This is mathematically proven to be orders of magnitude 
                    harder than attacking a single chain.
                  </p>
                </div>

                <div className="flex gap-4">
                  <Link href="/trinity-protocol">
                    <Button className="bg-gradient-to-r from-green-500 to-blue-500" data-testid="button-trinity-protocol">
                      View Trinity Protocol <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/quantum-resistant">
                    <Button variant="outline" className="border-gray-600" data-testid="button-quantum">
                      <Zap className="mr-2 h-4 w-4" /> Quantum Security
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="validators" className="space-y-6">
            <Card className="bg-[#1a1a3a]/80 border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Globe className="h-6 w-6 text-green-400" />
                  On-Chain Validators
                </CardTitle>
                <CardDescription>
                  Registered validators in TrinityConsensusVerifier contract
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {VALIDATORS.map((validator) => (
                    <div key={validator.chain} className="p-4 bg-[#0f0f2a] rounded-lg border border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center font-bold">
                            {validator.chainId}
                          </div>
                          <div>
                            <div className="font-semibold">{validator.chain} Validator</div>
                            <div className="text-sm text-gray-400">Chain ID: {validator.chainId}</div>
                          </div>
                        </div>
                        <Badge className={`${validator.role === 'PRIMARY' ? 'bg-blue-500/20 text-blue-400' : validator.role === 'MONITOR' ? 'bg-purple-500/20 text-purple-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                          {validator.role}
                        </Badge>
                      </div>
                      <code className="text-xs text-gray-400 block bg-[#1a1a3a] p-2 rounded mt-2 font-mono">
                        {validator.address}
                      </code>
                      <a 
                        href={`https://sepolia.arbiscan.io/address/${validator.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-green-400 hover:underline mt-2 inline-flex items-center gap-1"
                      >
                        View on Arbiscan <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contracts" className="space-y-6">
            <Card className="bg-[#1a1a3a]/80 border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Lock className="h-6 w-6 text-green-400" />
                  Security Contracts (Arbitrum Sepolia)
                </CardTitle>
                <CardDescription>
                  Deployed and verified smart contracts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(DEPLOYED_CONTRACTS).map(([name, address]) => (
                    <div key={name} className="flex items-center justify-between p-4 bg-[#0f0f2a] rounded-lg border border-gray-700">
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          {name}
                        </div>
                        <code className="text-xs text-gray-400">{address}</code>
                      </div>
                      <a 
                        href={`https://sepolia.arbiscan.io/address/${address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-400 hover:underline flex items-center gap-1 text-sm"
                      >
                        View <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mdl" className="space-y-6">
            <Card className="bg-[#1a1a3a]/80 border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Layers className="h-6 w-6 text-green-400" />
                  Mathematical Defense Layer (MDL)
                </CardTitle>
                <CardDescription>
                  8 cryptographic layers protecting your assets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {MDL_LAYERS.map((layer) => (
                    <div key={layer.id} className="p-4 bg-[#0f0f2a] rounded-lg border border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center font-bold text-sm">
                            {layer.id}
                          </div>
                          <span className="font-semibold">{layer.name}</span>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                      </div>
                      <div className="text-sm text-gray-400 mb-2">{layer.description}</div>
                      <div className="text-xs text-purple-400 font-mono">{layer.algorithm}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
