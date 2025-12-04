import { useQuery } from '@tanstack/react-query';
import { useLocation, Link } from 'wouter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  FileTextIcon, 
  ShieldCheckIcon, 
  KeySquareIcon, 
  UsersIcon, 
  CheckCircleIcon,
  AlertCircle,
  Globe,
  Lock,
  Zap,
  Eye,
  Cpu,
  Network,
  ExternalLink
} from 'lucide-react';
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
  documentation: string[];
}

const SecurityDocumentation = () => {
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
  const trinityShield = shieldData?.trinityShield;

  const getLayerIcon = (layerId: string) => {
    switch (layerId) {
      case 'zk-proofs': return <Eye className="w-6 h-6 text-[#FF5AF7]" />;
      case 'formal-verification': return <CheckCircleIcon className="w-6 h-6 text-[#FF5AF7]" />;
      case 'mpc-keys': return <Lock className="w-6 h-6 text-[#FF5AF7]" />;
      case 'vdf-timelocks': return <Zap className="w-6 h-6 text-[#FF5AF7]" />;
      case 'ai-governance': return <Cpu className="w-6 h-6 text-[#FF5AF7]" />;
      case 'quantum-crypto': return <KeySquareIcon className="w-6 h-6 text-[#FF5AF7]" />;
      case 'trinity-protocol': return <Network className="w-6 h-6 text-[#FF5AF7]" />;
      case 'trinity-shield': return <ShieldCheckIcon className="w-6 h-6 text-[#FF5AF7]" />;
      default: return <ShieldCheckIcon className="w-6 h-6 text-[#FF5AF7]" />;
    }
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <PageHeader 
        title="Technical Security Documentation"
        subtitle="Comprehensive technical specifications for the 8-layer Mathematical Defense System"
        icon={<FileTextIcon className="w-10 h-10 text-[#FF5AF7]" />}
      />

      {isLoading ? (
        <div className="space-y-6 mt-8">
          <Skeleton className="h-32 w-full bg-gray-800" />
          <Skeleton className="h-64 w-full bg-gray-800" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8 mb-8">
            <Card className="bg-gradient-to-br from-[#1A1A1A] to-[#111] border border-[#333]">
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-[#FF5AF7]">{metrics?.totalSecurityLayers}</p>
                <p className="text-sm text-gray-400">Security Layers</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-[#1A1A1A] to-[#111] border border-[#333]">
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-[#50E3C2]">{metrics?.attackProbability}</p>
                <p className="text-sm text-gray-400">Attack Probability</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-[#1A1A1A] to-[#111] border border-[#333]">
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-green-500">{metrics?.uptime}</p>
                <p className="text-sm text-gray-400">System Uptime</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-[#1A1A1A] to-[#111] border border-[#333]">
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-blue-500">{metrics?.chainsProtected}</p>
                <p className="text-sm text-gray-400">Protected Chains</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="layers" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-[#1A1A1A] border border-[#333] rounded-lg overflow-hidden p-0.5">
              <TabsTrigger 
                value="layers" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6B00D7] data-[state=active]:to-[#FF5AF7]"
                data-testid="tab-layers"
              >
                Security Layers
              </TabsTrigger>
              <TabsTrigger 
                value="validators"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6B00D7] data-[state=active]:to-[#FF5AF7]"
                data-testid="tab-validators"
              >
                Validators
              </TabsTrigger>
              <TabsTrigger 
                value="shield"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6B00D7] data-[state=active]:to-[#FF5AF7]"
                data-testid="tab-shield"
              >
                Trinity Shield™
              </TabsTrigger>
              <TabsTrigger 
                value="specs"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6B00D7] data-[state=active]:to-[#FF5AF7]"
                data-testid="tab-specs"
              >
                Technical Specs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="layers">
              <div className="mt-6 space-y-4">
                <h2 className="text-2xl font-bold text-white mb-4">8-Layer Mathematical Defense System</h2>
                {layers.map((layer) => (
                  <Card key={layer.id} className="bg-[#1A1A1A] border border-[#333]">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-purple-600/20 p-3 rounded-lg">
                          {getLayerIcon(layer.id)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <Badge className="bg-purple-600">Layer {layer.layer}</Badge>
                              <h3 className="text-lg font-semibold text-white">{layer.name}</h3>
                            </div>
                            <Badge variant="outline" className={layer.status === 'active' ? 'border-green-500 text-green-500' : 'border-yellow-500 text-yellow-500'}>
                              {layer.status}
                            </Badge>
                          </div>
                          <p className="text-gray-400 mb-3">{layer.description}</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge variant="outline" className="text-[#50E3C2] border-[#50E3C2]">{layer.protocol}</Badge>
                            {layer.features.map((feature, idx) => (
                              <Badge key={idx} variant="outline" className="text-gray-400">{feature}</Badge>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500">API Endpoint: <code className="text-[#50E3C2]">{layer.apiEndpoint}</code></p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="validators">
              <div className="mt-6">
                <h2 className="text-2xl font-bold text-white mb-4">Active Validators</h2>
                <p className="text-gray-400 mb-6">
                  Trinity Protocol uses 3 independent validators across different blockchains for 2-of-3 consensus.
                </p>
                <div className="grid gap-4">
                  {validators.map((validator) => (
                    <Card key={validator.chain} className="bg-[#1A1A1A] border border-[#333]">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="bg-purple-600/20 p-3 rounded-lg">
                              <Globe className="h-6 w-6 text-[#FF5AF7]" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-white">{validator.chain} Validator</h3>
                              <p className="text-sm text-gray-400">
                                Chain ID: {validator.chainId} • Role: <span className="text-[#FF5AF7]">{validator.role}</span>
                              </p>
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
                          <h4 className="text-lg font-semibold text-white mb-3">Key Features</h4>
                          <ul className="space-y-2">
                            {trinityShield.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-gray-400 text-sm">
                                <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3">Hardware Requirements</h4>
                          <div className="space-y-3">
                            {trinityShield.supportedHardware.map((hw, idx) => (
                              <div key={idx} className="bg-[#0D0D0D] p-3 rounded border border-[#444]">
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-white">{hw.name}</span>
                                  <Badge className={hw.status === 'supported' ? 'bg-green-600' : 'bg-yellow-600'}>
                                    {hw.status}
                                  </Badge>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{hw.processors}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h4 className="text-lg font-semibold text-white mb-3">Documentation</h4>
                        <div className="flex flex-wrap gap-2">
                          {trinityShield.documentation.map((doc, idx) => (
                            <Badge key={idx} variant="outline" className="text-[#50E3C2] border-[#50E3C2]">
                              {doc.split('/').pop()}
                            </Badge>
                          ))}
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

            <TabsContent value="specs">
              <div className="mt-6 space-y-6">
                <Card className="bg-[#1A1A1A] border border-[#333]">
                  <CardHeader>
                    <CardTitle className="text-white">Protocol Specifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-[#0D0D0D] p-4 rounded border border-[#444]">
                        <p className="text-xs text-gray-500">Protocol Version</p>
                        <p className="text-lg font-semibold text-[#FF5AF7]">{overviewData?.protocolVersion}</p>
                      </div>
                      <div className="bg-[#0D0D0D] p-4 rounded border border-[#444]">
                        <p className="text-xs text-gray-500">Consensus Mechanism</p>
                        <p className="text-lg font-semibold text-[#50E3C2]">2-of-3 Byzantine</p>
                      </div>
                      <div className="bg-[#0D0D0D] p-4 rounded border border-[#444]">
                        <p className="text-xs text-gray-500">Quantum Resistance</p>
                        <p className="text-lg font-semibold text-green-500">
                          {metrics?.quantumResistance ? 'Enabled' : 'Disabled'}
                        </p>
                      </div>
                      <div className="bg-[#0D0D0D] p-4 rounded border border-[#444]">
                        <p className="text-xs text-gray-500">Formal Verification</p>
                        <p className="text-lg font-semibold text-green-500">
                          {metrics?.formallyVerified ? 'Verified (Lean 4)' : 'Pending'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#1A1A1A] border border-[#333]">
                  <CardHeader>
                    <CardTitle className="text-white">Cryptographic Algorithms</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-[#0D0D0D] rounded border border-[#444]">
                        <span className="text-gray-400">Key Encapsulation</span>
                        <Badge className="bg-purple-600">ML-KEM-1024</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-[#0D0D0D] rounded border border-[#444]">
                        <span className="text-gray-400">Digital Signatures</span>
                        <Badge className="bg-purple-600">CRYSTALS-Dilithium-5</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-[#0D0D0D] rounded border border-[#444]">
                        <span className="text-gray-400">Zero-Knowledge Proofs</span>
                        <Badge className="bg-purple-600">Groth16</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-[#0D0D0D] rounded border border-[#444]">
                        <span className="text-gray-400">Time-Lock Functions</span>
                        <Badge className="bg-purple-600">Wesolowski VDF</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-[#0D0D0D] rounded border border-[#444]">
                        <span className="text-gray-400">Secret Sharing</span>
                        <Badge className="bg-purple-600">Shamir + MPC</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-[#1A1A1A] to-[#111] border border-[#333] rounded-lg p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Explore More</h3>
              <p className="text-gray-400 mb-6">
                Dive deeper into our security features with tutorials and integration guides.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <Button asChild className="bg-gradient-to-r from-[#FF5AF7] to-[#8F75FF]">
                  <Link href="/military-grade-security">
                    Security Architecture
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-[#FF5AF7] text-[#FF5AF7]">
                  <Link href="/security-tutorials">
                    Security Tutorials
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/security-integration-guide">
                    Integration Guide
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SecurityDocumentation;
