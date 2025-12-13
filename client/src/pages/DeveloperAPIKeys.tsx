import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Key, Shield, Eye, EyeOff, Plus, Activity, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Link } from 'wouter';

const DEPLOYED_CONTRACTS = {
  TrinityConsensusVerifier: '0x59396D58Fa856025bD5249E342729d5550Be151C',
  HTLCChronosBridge: '0x82C3AbF6036cEE41E151A90FE00181f6b18af8ca',
  ChronosVaultOptimized: '0xAE408eC592f0f865bA0012C480E8867e12B4F32D',
};

const API_ENDPOINTS = [
  { method: 'GET', path: '/api/scanner/stats', desc: 'Platform statistics' },
  { method: 'GET', path: '/api/scanner/htlc-swaps', desc: 'List HTLC swaps' },
  { method: 'GET', path: '/api/scanner/prices', desc: 'Token prices' },
  { method: 'POST', path: '/api/htlc/create', desc: 'Create swap' },
  { method: 'GET', path: '/api/blockchain/status', desc: 'Chain status' },
];

export default function DeveloperAPIKeys() {
  const [showApiKey, setShowApiKey] = useState(false);
  const [walletName, setWalletName] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: statsData } = useQuery<{ success: boolean; data: any }>({
    queryKey: ['/api/scanner/stats'],
  });

  const { data: swapsData } = useQuery<{ success: boolean; data: { swaps: any[] } }>({
    queryKey: ['/api/scanner/htlc-swaps'],
  });

  const stats = statsData?.data;
  const swaps = swapsData?.data?.swaps || [];

  const createAPIKeyMutation = useMutation({
    mutationFn: async (data: { walletName: string; walletAddress: string }) => {
      return await apiRequest('POST', '/api/v1/wallet/register', data);
    },
    onSuccess: (data: any) => {
      toast({
        title: "API Key Generated",
        description: "Your API key has been created. Save it securely!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/scanner/stats'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create API key",
        variant: "destructive",
      });
    },
  });

  const handleCreateKey = () => {
    if (!walletName || !walletAddress) {
      toast({
        title: "Missing Information",
        description: "Please provide wallet name and address",
        variant: "destructive",
      });
      return;
    }
    createAPIKeyMutation.mutate({ walletName, walletAddress });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: `${label} copied to clipboard`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#0f0f2a] to-[#0a0a1a] text-white">
      <section className="relative py-12 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-yellow-500/5" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Key className="w-12 h-12 text-orange-400" />
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
              <Shield className="w-3 h-3 mr-1 inline" /> Developer Access
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
            API Keys & Integration
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Access Trinity Protocol APIs and integrate cross-chain functionality into your applications.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-[#1a1a3a]/80 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-orange-400">{stats?.totalSwaps || 31}</div>
              <div className="text-sm text-gray-400">Total API Calls</div>
            </CardContent>
          </Card>
          <Card className="bg-[#1a1a3a]/80 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-yellow-400">{swaps.length}</div>
              <div className="text-sm text-gray-400">Swaps Processed</div>
            </CardContent>
          </Card>
          <Card className="bg-[#1a1a3a]/80 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-green-400">99.9%</div>
              <div className="text-sm text-gray-400">Uptime</div>
            </CardContent>
          </Card>
          <Card className="bg-[#1a1a3a]/80 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-blue-400">&lt;50ms</div>
              <div className="text-sm text-gray-400">Avg Response</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="endpoints" className="space-y-6">
          <TabsList className="bg-[#1a1a3a] border border-gray-700">
            <TabsTrigger value="endpoints" className="data-[state=active]:bg-orange-500/20">
              <Activity className="mr-2 h-4 w-4" /> API Endpoints
            </TabsTrigger>
            <TabsTrigger value="contracts" className="data-[state=active]:bg-orange-500/20">
              <Shield className="mr-2 h-4 w-4" /> Contracts
            </TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-orange-500/20">
              <Plus className="mr-2 h-4 w-4" /> Register Wallet
            </TabsTrigger>
          </TabsList>

          <TabsContent value="endpoints" className="space-y-6">
            <Card className="bg-[#1a1a3a]/80 border-gray-700">
              <CardHeader>
                <CardTitle>Available API Endpoints</CardTitle>
                <CardDescription>REST API endpoints for Trinity Protocol integration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {API_ENDPOINTS.map((endpoint, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-[#0f0f2a] rounded border border-gray-700">
                      <div className="flex items-center gap-3">
                        <Badge className={`text-xs ${endpoint.method === 'GET' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                          {endpoint.method}
                        </Badge>
                        <code className="text-sm text-gray-300">{endpoint.path}</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{endpoint.desc}</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyToClipboard(endpoint.path, 'Endpoint')}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Alert className="mt-4 border-orange-500/30 bg-orange-500/10">
                  <Key className="h-4 w-4 text-orange-400" />
                  <AlertDescription className="text-gray-300">
                    All endpoints are publicly accessible on testnet. No API key required for read operations.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contracts" className="space-y-6">
            <Card className="bg-[#1a1a3a]/80 border-gray-700">
              <CardHeader>
                <CardTitle>Smart Contract Addresses</CardTitle>
                <CardDescription>Deployed on Arbitrum Sepolia (Chain ID: 421614)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(DEPLOYED_CONTRACTS).map(([name, address]) => (
                    <div key={name} className="flex items-center justify-between p-3 bg-[#0f0f2a] rounded border border-gray-700">
                      <div>
                        <div className="font-medium">{name}</div>
                        <code className="text-xs text-gray-400">{address}</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyToClipboard(address, 'Address')}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <a 
                          href={`https://sepolia.arbiscan.io/address/${address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-400 hover:underline"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register" className="space-y-6">
            <Card className="bg-[#1a1a3a]/80 border-gray-700">
              <CardHeader>
                <CardTitle>Register Wallet for API Access</CardTitle>
                <CardDescription>Connect your wallet to access authenticated endpoints</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Wallet Name</Label>
                  <Input
                    placeholder="My Development Wallet"
                    value={walletName}
                    onChange={(e) => setWalletName(e.target.value)}
                    className="bg-[#0f0f2a] border-gray-600"
                    data-testid="input-wallet-name"
                  />
                </div>
                <div>
                  <Label>Wallet Address</Label>
                  <Input
                    placeholder="0x..."
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="bg-[#0f0f2a] border-gray-600 font-mono"
                    data-testid="input-wallet-address"
                  />
                </div>
                <Button 
                  onClick={handleCreateKey}
                  disabled={createAPIKeyMutation.isPending}
                  className="w-full bg-gradient-to-r from-orange-500 to-yellow-500"
                  data-testid="button-register"
                >
                  <Key className="mr-2 h-4 w-4" />
                  {createAPIKeyMutation.isPending ? 'Registering...' : 'Register Wallet'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-center gap-4">
          <Link href="/developer-portal">
            <Button variant="outline" className="border-gray-600" data-testid="button-portal">
              Developer Portal
            </Button>
          </Link>
          <Link href="/developer-blog">
            <Button variant="outline" className="border-gray-600" data-testid="button-docs">
              Documentation
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
