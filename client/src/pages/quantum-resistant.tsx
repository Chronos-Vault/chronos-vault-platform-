import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Lock,
  CheckCircle,
  ExternalLink,
  Activity,
  Layers,
  Zap,
  Cpu,
  Key,
  AlertTriangle,
  Server,
  RefreshCw
} from 'lucide-react';

const QUANTUM_ALGORITHMS = [
  {
    id: 'ml-kem',
    name: 'ML-KEM-1024 (CRYSTALS-Kyber)',
    type: 'Key Encapsulation',
    securityLevel: 'NIST Level 5',
    status: 'active',
    strength: 95,
    description: 'Lattice-based key encapsulation mechanism resistant to quantum attacks. Used for secure key exchange in Trinity Protocol.',
    deployedOn: 'TON Testnet'
  },
  {
    id: 'dilithium',
    name: 'CRYSTALS-Dilithium-5',
    type: 'Digital Signatures',
    securityLevel: 'NIST Level 5',
    status: 'active',
    strength: 92,
    description: 'Lattice-based digital signature scheme. Provides 256-bit quantum security for all Trinity Protocol signatures.',
    deployedOn: 'TON Testnet'
  },
  {
    id: 'shake',
    name: 'SHAKE-256',
    type: 'Hash Function',
    securityLevel: '256-bit',
    status: 'active',
    strength: 100,
    description: 'Extendable-output function from SHA-3 family. Quantum-resistant hash for merkle proofs and commitments.',
    deployedOn: 'All Chains'
  },
  {
    id: 'sphincs',
    name: 'SPHINCS+',
    type: 'Backup Signatures',
    securityLevel: 'NIST Level 5',
    status: 'standby',
    strength: 88,
    description: 'Hash-based signature scheme as backup. Stateless and conservative security assumptions.',
    deployedOn: 'Emergency Recovery'
  }
];

const TON_QUANTUM_CONTRACTS = {
  TrinityConsensus: 'EQeGlYzwupSROVWGucOmKyUDbSaKmPfIpHHP5mV73odL8',
  ChronosVault: 'EQjUVidQfn4m-Rougn0fol7ECCthba2HV0M6xz9zAfax4',
  CrossChainBridge: 'EQgWobA9D4u6Xem3B8e6Sde_NEFZYicyy7_5_XvOT18mA',
};

const SECURITY_METRICS = {
  overall: 94,
  keyManagement: 96,
  signatureSchemes: 92,
  hashFunctions: 100,
  emergencyRecovery: 88,
};

export default function QuantumResistantPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: blockchainStatus, refetch } = useQuery<any>({
    queryKey: ['/api/blockchain/status'],
  });

  const { data: statsData } = useQuery<{ success: boolean; data: any }>({
    queryKey: ['/api/scanner/stats'],
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const tonStatus = blockchainStatus?.ton?.connected !== false;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#0f0f2a] to-[#0a0a1a] text-white">
      <section className="relative py-12 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-cyan-500/10" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-12 h-12 text-purple-400" />
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              <Shield className="w-3 h-3 mr-1 inline" /> NIST Level 5 Security
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Quantum-Resistant Security
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mb-6">
            Post-quantum cryptography protecting your assets against future quantum computer attacks. 
            Deployed on TON Testnet as the BACKUP chain with emergency recovery capabilities.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#1a1a3a]/80 border border-gray-700 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-purple-400">{SECURITY_METRICS.overall}%</div>
              <div className="text-sm text-gray-400">Security Score</div>
            </div>
            <div className="bg-[#1a1a3a]/80 border border-gray-700 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-cyan-400">4</div>
              <div className="text-sm text-gray-400">PQ Algorithms</div>
            </div>
            <div className="bg-[#1a1a3a]/80 border border-gray-700 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-400">256-bit</div>
              <div className="text-sm text-gray-400">Quantum Security</div>
            </div>
            <div className="bg-[#1a1a3a]/80 border border-gray-700 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <div className={`w-3 h-3 rounded-full ${tonStatus ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                <span className="text-lg font-bold text-white">{tonStatus ? 'Online' : 'Offline'}</span>
              </div>
              <div className="text-sm text-gray-400">TON Status</div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              onClick={handleRefresh}
              variant="outline" 
              className="border-gray-600"
              disabled={isRefreshing}
              data-testid="button-refresh"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh Status
            </Button>
            <Link href="/device-recovery">
              <Button className="bg-gradient-to-r from-purple-500 to-cyan-500" data-testid="button-recovery">
                <Key className="mr-2 h-4 w-4" /> Emergency Recovery
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-[#1a1a3a] border border-gray-700 p-1 flex-wrap h-auto">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-500/20">
              <Shield className="mr-2 h-4 w-4" /> Overview
            </TabsTrigger>
            <TabsTrigger value="algorithms" className="data-[state=active]:bg-purple-500/20">
              <Cpu className="mr-2 h-4 w-4" /> Algorithms
            </TabsTrigger>
            <TabsTrigger value="contracts" className="data-[state=active]:bg-purple-500/20">
              <Lock className="mr-2 h-4 w-4" /> TON Contracts
            </TabsTrigger>
            <TabsTrigger value="metrics" className="data-[state=active]:bg-purple-500/20">
              <Activity className="mr-2 h-4 w-4" /> Security Metrics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-[#1a1a3a]/80 border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Zap className="h-6 w-6 text-purple-400" />
                  Why Quantum-Resistant?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                    <div className="flex items-center gap-2 text-amber-400 font-semibold mb-2">
                      <AlertTriangle className="h-5 w-5" />
                      The Quantum Threat
                    </div>
                    <p className="text-sm text-gray-300">
                      Cryptographically-relevant quantum computers could break current encryption 
                      (RSA, ECDSA) within 10-15 years. Blockchain private keys using these algorithms 
                      would be vulnerable. "Harvest now, decrypt later" attacks are already happening.
                    </p>
                  </div>
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div className="flex items-center gap-2 text-green-400 font-semibold mb-2">
                      <CheckCircle className="h-5 w-5" />
                      Trinity Protocol's Solution
                    </div>
                    <p className="text-sm text-gray-300">
                      TON chain (BACKUP role) uses NIST-standardized post-quantum algorithms: 
                      ML-KEM-1024 for key exchange and CRYSTALS-Dilithium-5 for signatures. 
                      Your emergency recovery keys are quantum-safe.
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-[#0f0f2a] rounded-lg border border-purple-500/20">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Layers className="h-5 w-5 text-purple-400" />
                    How It Works in Trinity Protocol
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { role: 'PRIMARY', chain: 'Arbitrum', crypto: 'ECDSA (secp256k1)', note: 'Standard EVM security' },
                      { role: 'MONITOR', chain: 'Solana', crypto: 'Ed25519', note: 'Fast signature verification' },
                      { role: 'BACKUP', chain: 'TON', crypto: 'ML-KEM + Dilithium', note: 'Quantum-resistant recovery' },
                    ].map((item) => (
                      <div key={item.role} className="text-center p-4 bg-[#1a1a3a] rounded-lg">
                        <Badge className={`mb-2 ${item.role === 'BACKUP' ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-500/20 text-gray-400'}`}>
                          {item.role}
                        </Badge>
                        <div className="font-semibold">{item.chain}</div>
                        <div className="text-sm text-purple-400 mt-1">{item.crypto}</div>
                        <div className="text-xs text-gray-500 mt-1">{item.note}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="algorithms" className="space-y-6">
            <Card className="bg-[#1a1a3a]/80 border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Cpu className="h-6 w-6 text-purple-400" />
                  Post-Quantum Algorithms
                </CardTitle>
                <CardDescription>
                  NIST-standardized algorithms deployed in Trinity Protocol
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {QUANTUM_ALGORITHMS.map((algo) => (
                    <div key={algo.id} className="p-4 bg-[#0f0f2a] rounded-lg border border-gray-700">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${algo.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                          <div>
                            <div className="font-semibold">{algo.name}</div>
                            <div className="text-sm text-gray-400">{algo.type}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-purple-500/20 text-purple-400">{algo.securityLevel}</Badge>
                          <Badge className={algo.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}>
                            {algo.status}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">{algo.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-xs text-gray-500">Strength:</span>
                          <Progress value={algo.strength} className="flex-1 h-2" />
                          <span className="text-sm font-medium text-purple-400">{algo.strength}%</span>
                        </div>
                        <span className="text-xs text-gray-500 ml-4">Deployed: {algo.deployedOn}</span>
                      </div>
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
                  <Lock className="h-6 w-6 text-purple-400" />
                  TON Quantum-Resistant Contracts
                </CardTitle>
                <CardDescription>
                  Deployed on TON Testnet with quantum-safe cryptography
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(TON_QUANTUM_CONTRACTS).map(([name, address]) => (
                    <div key={name} className="flex items-center justify-between p-4 bg-[#0f0f2a] rounded-lg border border-gray-700">
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          {name}
                        </div>
                        <code className="text-xs text-gray-400">{address}</code>
                      </div>
                      <a 
                        href={`https://testnet.tonscan.org/address/${address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:underline flex items-center gap-1 text-sm"
                      >
                        View <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                  <div className="flex items-center gap-2 text-purple-400 font-semibold mb-2">
                    <Shield className="h-5 w-5" />
                    Quantum-Safe Features
                  </div>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• ML-KEM-1024 for secure key encapsulation</li>
                    <li>• CRYSTALS-Dilithium-5 for digital signatures</li>
                    <li>• 3-of-3 validator approval for emergency recovery</li>
                    <li>• 48-hour time-lock on recovery operations</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            <Card className="bg-[#1a1a3a]/80 border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Activity className="h-6 w-6 text-purple-400" />
                  Security Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(SECURITY_METRICS).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="capitalize text-gray-300">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className={`font-bold ${value >= 90 ? 'text-green-400' : value >= 80 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {value}%
                        </span>
                      </div>
                      <Progress value={value} className="h-2" />
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div className="text-green-400 font-semibold mb-2">Strengths</div>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• NIST Level 5 algorithms</li>
                      <li>• Hardware-isolated key storage</li>
                      <li>• Multi-chain redundancy</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                    <div className="text-amber-400 font-semibold mb-2">Considerations</div>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Larger key sizes than classical</li>
                      <li>• Higher computational cost</li>
                      <li>• Newer algorithm standards</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
