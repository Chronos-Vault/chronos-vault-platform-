import { useQuery } from '@tanstack/react-query';
import { useLocation, Link } from 'wouter';
import { 
  ShieldCheck, 
  Key, 
  Server, 
  Shield,
  Layers,
  ChevronRight,
  Zap,
  Lock,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Cpu,
  Globe,
  Clock
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import PageHeader from '@/components/layout/page-header';

interface SecurityLayer {
  id: string;
  layer: number;
  name: string;
  protocol: string;
  description: string;
  status: string;
  features: string[];
  apiEndpoint: string;
}

interface Validator {
  chain: string;
  chainId: number;
  address: string;
  role: string;
  status: string;
  hardware: string;
}

interface TrinityShieldData {
  name: string;
  tagline: string;
  layer: number;
  description: string;
  features: string[];
  contracts: {
    verifier: string;
    verifierV2: string;
  };
  supportedHardware: Array<{ name: string; processors: string; status: string }>;
}

interface ContractsData {
  arbitrumSepolia: {
    chainId: number;
    network: string;
    contracts: Record<string, string>;
    validators: Record<string, string>;
    explorerUrl: string;
  };
  solanaDevnet: {
    network: string;
    programId: string;
    deploymentWallet: string;
    role: string;
    features: string[];
  };
  tonTestnet: {
    network: string;
    contracts: Record<string, string>;
    features: string[];
  };
}

const MilitaryGradeSecurity = () => {
  const [, navigate] = useLocation();

  const { data: overviewData, isLoading: overviewLoading } = useQuery<{
    success: boolean;
    protocolVersion: string;
    metrics: {
      attackProbability: string;
      activeValidators: number;
      chainsProtected: number;
      totalSecurityLayers: number;
      quantumResistance: boolean;
      formallyVerified: boolean;
      uptime: string;
    };
  }>({
    queryKey: ['/api/security-docs/overview'],
  });

  const { data: layersData, isLoading: layersLoading } = useQuery<{
    success: boolean;
    totalLayers: number;
    layers: SecurityLayer[];
  }>({
    queryKey: ['/api/security-docs/layers'],
  });

  const { data: validatorsData } = useQuery<{
    success: boolean;
    validators: Validator[];
  }>({
    queryKey: ['/api/security-docs/validators'],
  });

  const { data: contractsData } = useQuery<{
    success: boolean;
    contracts: ContractsData;
  }>({
    queryKey: ['/api/security-docs/contracts'],
  });

  const { data: shieldData } = useQuery<{
    success: boolean;
    trinityShield: TrinityShieldData;
  }>({
    queryKey: ['/api/security-docs/trinity-shield'],
  });

  const isLoading = overviewLoading || layersLoading;
  const metrics = overviewData?.metrics;
  const layers = layersData?.layers || [];
  const validators = validatorsData?.validators || [];
  const contracts = contractsData?.contracts;
  const trinityShield = shieldData?.trinityShield;

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <PageHeader 
        title="Triple-Chain Military-Grade Security"
        subtitle="Advanced cross-chain security infrastructure with government-level protection"
        icon={<ShieldCheck className="w-10 h-10 text-[#FF5AF7]" />}
      />

      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-64 w-full bg-gray-800" />
          <Skeleton className="h-48 w-full bg-gray-800" />
        </div>
      ) : (
        <>
          <div className="my-8 p-6 bg-gradient-to-r from-[#1A1A1A] to-[#111] border border-[#333] rounded-lg shadow-xl">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-[#FF5AF7] to-[#6B00D7] bg-clip-text text-transparent">
                Trinity Protocol™ {overviewData?.protocolVersion}
              </h2>
              {metrics && (
                <div className="flex gap-2 flex-wrap">
                  <Badge className="bg-green-600">Attack Probability: {metrics.attackProbability}</Badge>
                  <Badge className="bg-purple-600">{metrics.totalSecurityLayers} Security Layers</Badge>
                  <Badge className="bg-blue-600">{metrics.chainsProtected} Chains Protected</Badge>
                  {metrics.quantumResistance && <Badge className="bg-cyan-600">Quantum-Resistant</Badge>}
                </div>
              )}
            </div>
            
            <p className="text-gray-400 mb-6">
              Chronos Vault's Trinity Protocol implements a <span className="text-[#FF5AF7] font-semibold">2-of-3 consensus mechanism</span> across 
              three independent blockchains with mathematically provable security.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#111] p-5 rounded-lg border border-[#333]">
                <div className="flex items-center mb-4">
                  <div className="bg-[#1a1a1a] p-2 rounded-lg mr-3">
                    <Shield className="h-6 w-6 text-[#FF5AF7]" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">PRIMARY: Arbitrum L2</h3>
                </div>
                <p className="text-gray-400 mb-2">
                  Primary security layer with <span className="text-[#50E3C2]">95% lower fees</span> than Ethereum L1.
                </p>
                {contracts?.arbitrumSepolia && (
                  <div className="mt-3 space-y-1">
                    <p className="text-xs text-gray-500">Chain ID: {contracts.arbitrumSepolia.chainId}</p>
                    <p className="text-xs text-gray-500 truncate">
                      Consensus: {contracts.arbitrumSepolia.contracts.TrinityConsensusVerifier?.slice(0, 10)}...
                    </p>
                    <a 
                      href={contracts.arbitrumSepolia.explorerUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-[#FF5AF7] flex items-center gap-1 hover:underline"
                    >
                      View on Arbiscan <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>
              
              <div className="bg-[#111] p-5 rounded-lg border border-[#333]">
                <div className="flex items-center mb-4">
                  <div className="bg-[#1a1a1a] p-2 rounded-lg mr-3">
                    <Layers className="h-6 w-6 text-[#FF5AF7]" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">MONITOR: Solana</h3>
                </div>
                <p className="text-gray-400 mb-2">
                  High-throughput verification with <span className="text-[#50E3C2]">2000+ TPS</span>.
                </p>
                {contracts?.solanaDevnet && (
                  <div className="mt-3 space-y-1">
                    <p className="text-xs text-gray-500">Network: {contracts.solanaDevnet.network}</p>
                    <p className="text-xs text-gray-500 truncate">
                      Program: {contracts.solanaDevnet.programId?.slice(0, 10)}...
                    </p>
                    <p className="text-xs text-gray-500">Role: {contracts.solanaDevnet.role}</p>
                  </div>
                )}
              </div>
              
              <div className="bg-[#111] p-5 rounded-lg border border-[#333]">
                <div className="flex items-center mb-4">
                  <div className="bg-[#1a1a1a] p-2 rounded-lg mr-3">
                    <ShieldCheck className="h-6 w-6 text-[#FF5AF7]" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">BACKUP: TON</h3>
                </div>
                <p className="text-gray-400 mb-2">
                  Quantum-resistant backup with <span className="text-[#50E3C2]">Byzantine Fault Tolerance</span>.
                </p>
                {contracts?.tonTestnet && (
                  <div className="mt-3 space-y-1">
                    <p className="text-xs text-gray-500">Network: {contracts.tonTestnet.network}</p>
                    <p className="text-xs text-gray-500 truncate">
                      Vault: {contracts.tonTestnet.contracts.ChronosVault?.slice(0, 10)}...
                    </p>
                    <ul className="text-xs text-gray-500 mt-2">
                      {contracts.tonTestnet.features?.slice(0, 2).map((f, i) => (
                        <li key={i}>• {f}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Tabs defaultValue="layers" className="w-full mt-8">
            <TabsList className="grid w-full grid-cols-4 bg-[#1A1A1A] border border-[#333] rounded-lg overflow-hidden p-0.5">
              <TabsTrigger value="layers" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6B00D7] data-[state=active]:to-[#FF5AF7]" data-testid="tab-layers">
                8 Security Layers
              </TabsTrigger>
              <TabsTrigger value="validators" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6B00D7] data-[state=active]:to-[#FF5AF7]" data-testid="tab-validators">
                Validators
              </TabsTrigger>
              <TabsTrigger value="contracts" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6B00D7] data-[state=active]:to-[#FF5AF7]" data-testid="tab-contracts">
                Deployed Contracts
              </TabsTrigger>
              <TabsTrigger value="shield" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6B00D7] data-[state=active]:to-[#FF5AF7]" data-testid="tab-shield">
                Trinity Shield™
              </TabsTrigger>
            </TabsList>

            <TabsContent value="layers">
              <div className="grid gap-4 mt-6">
                {layers.map((layer) => (
                  <Card key={layer.id} className="bg-[#1A1A1A] border border-[#333]">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge className="bg-purple-600">Layer {layer.layer}</Badge>
                          <CardTitle className="text-lg text-white">{layer.name}</CardTitle>
                        </div>
                        <Badge variant="outline" className={layer.status === 'active' ? 'border-green-500 text-green-500' : 'border-yellow-500 text-yellow-500'}>
                          {layer.status}
                        </Badge>
                      </div>
                      <CardDescription className="text-gray-400">{layer.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline" className="text-[#50E3C2] border-[#50E3C2]">{layer.protocol}</Badge>
                        {layer.features.map((feature, idx) => (
                          <Badge key={idx} variant="outline" className="text-gray-400">{feature}</Badge>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">API: {layer.apiEndpoint}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="validators">
              <div className="grid gap-4 mt-6">
                {validators.map((validator) => (
                  <Card key={validator.chain} className="bg-[#1A1A1A] border border-[#333]">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="bg-purple-600/20 p-3 rounded-lg">
                            <Server className="h-6 w-6 text-[#FF5AF7]" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">{validator.chain} Validator</h3>
                            <p className="text-sm text-gray-400">Chain ID: {validator.chainId} • Role: {validator.role}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={validator.status === 'active' ? 'bg-green-600' : 'bg-yellow-600'}>
                            {validator.status}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">{validator.hardware}</p>
                        </div>
                      </div>
                      <div className="mt-4 bg-[#0D0D0D] p-3 rounded border border-[#444]">
                        <p className="text-xs text-gray-500">Validator Address:</p>
                        <p className="text-sm text-[#50E3C2] font-mono break-all">{validator.address}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="contracts">
              <div className="mt-6 space-y-6">
                {contracts?.arbitrumSepolia && (
                  <Card className="bg-[#1A1A1A] border border-[#333]">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Globe className="h-5 w-5 text-[#FF5AF7]" />
                        {contracts.arbitrumSepolia.network} (Chain ID: {contracts.arbitrumSepolia.chainId})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Object.entries(contracts.arbitrumSepolia.contracts).map(([name, address]) => (
                          <div key={name} className="bg-[#0D0D0D] p-3 rounded border border-[#444]">
                            <p className="text-xs text-gray-500">{name}</p>
                            <p className="text-xs text-[#50E3C2] font-mono truncate">{address}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {contracts?.solanaDevnet && (
                  <Card className="bg-[#1A1A1A] border border-[#333]">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Zap className="h-5 w-5 text-[#FF5AF7]" />
                        {contracts.solanaDevnet.network}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="bg-[#0D0D0D] p-3 rounded border border-[#444]">
                          <p className="text-xs text-gray-500">Program ID</p>
                          <p className="text-sm text-[#50E3C2] font-mono">{contracts.solanaDevnet.programId}</p>
                        </div>
                        <div className="bg-[#0D0D0D] p-3 rounded border border-[#444]">
                          <p className="text-xs text-gray-500">Deployment Wallet</p>
                          <p className="text-sm text-[#50E3C2] font-mono">{contracts.solanaDevnet.deploymentWallet}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {contracts.solanaDevnet.features.map((f, i) => (
                            <Badge key={i} variant="outline">{f}</Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {contracts?.tonTestnet && (
                  <Card className="bg-[#1A1A1A] border border-[#333]">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Lock className="h-5 w-5 text-[#FF5AF7]" />
                        {contracts.tonTestnet.network}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Object.entries(contracts.tonTestnet.contracts).map(([name, address]) => (
                          <div key={name} className="bg-[#0D0D0D] p-3 rounded border border-[#444]">
                            <p className="text-xs text-gray-500">{name}</p>
                            <p className="text-xs text-[#50E3C2] font-mono break-all">{address}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {contracts.tonTestnet.features.map((f, i) => (
                          <Badge key={i} variant="outline">{f}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="shield">
              {trinityShield && (
                <div className="mt-6">
                  <Card className="bg-gradient-to-r from-[#1A1A1A] to-[#111] border border-[#333]">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="bg-purple-600/20 p-4 rounded-lg">
                          <Cpu className="h-10 w-10 text-[#FF5AF7]" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl text-white">{trinityShield.name}</CardTitle>
                          <CardDescription className="text-[#FF5AF7] font-semibold">
                            "{trinityShield.tagline}"
                          </CardDescription>
                        </div>
                        <Badge className="bg-purple-600 ml-auto">Layer {trinityShield.layer}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400 mb-6">{trinityShield.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3">Features</h4>
                          <ul className="space-y-2">
                            {trinityShield.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-gray-400 text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3">Supported Hardware</h4>
                          <div className="space-y-3">
                            {trinityShield.supportedHardware.map((hw, idx) => (
                              <div key={idx} className="bg-[#0D0D0D] p-3 rounded border border-[#444]">
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-white">{hw.name}</span>
                                  <Badge className={hw.status === 'supported' ? 'bg-green-600' : 'bg-yellow-600'}>
                                    {hw.status}
                                  </Badge>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Required: {hw.processors}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 bg-[#0D0D0D] p-4 rounded border border-[#444]">
                        <h4 className="text-sm font-semibold text-white mb-2">Verifier Contracts</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">TrinityShieldVerifier:</span>
                            <span className="text-xs text-[#50E3C2] font-mono">{trinityShield.contracts.verifier}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">TrinityShieldVerifierV2:</span>
                            <span className="text-xs text-[#50E3C2] font-mono">{trinityShield.contracts.verifierV2}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="mt-12 text-center">
            <div className="flex justify-center gap-4 flex-wrap">
              <Button asChild className="bg-gradient-to-r from-[#FF5AF7] to-[#8F75FF]">
                <Link href="/security-tutorials">
                  Security Tutorials
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-[#FF5AF7] text-[#FF5AF7] hover:bg-[#FF5AF7]/10">
                <Link href="/security-integration-guide">
                  Integration Guide
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/validator-onboarding">
                  Become a Validator
                </Link>
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MilitaryGradeSecurity;
