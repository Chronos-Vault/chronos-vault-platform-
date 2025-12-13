import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Code, 
  BookOpen,
  Braces,
  ServerCog,
  Rocket,
  Activity,
  BarChart3,
  ExternalLink,
  GitBranch,
  Shield,
  Zap,
  Lock
} from "lucide-react";

const DEPLOYED_CONTRACTS = {
  arbitrum: {
    chain: 'Arbitrum Sepolia',
    contracts: [
      { name: 'TrinityConsensusVerifier', address: '0x59396D58Fa856025bD5249E342729d5550Be151C' },
      { name: 'HTLCChronosBridge', address: '0x82C3AbF6036cEE41E151A90FE00181f6b18af8ca' },
      { name: 'ChronosVaultOptimized', address: '0xAE408eC592f0f865bA0012C480E8867e12B4F32D' },
    ]
  },
  solana: {
    chain: 'Solana Devnet',
    contracts: [
      { name: 'TrinityProgram', address: 'CYaDJYRqm35udQ8vkxoajSER8oaniQUcV8Vvw5BqJyo2' },
    ]
  },
  ton: {
    chain: 'TON Testnet',
    contracts: [
      { name: 'TrinityConsensus', address: 'EQeGlYzwupSROVWGucOmKyUDbSaKmPfIpHHP5mV73odL8' },
      { name: 'ChronosVault', address: 'EQjUVidQfn4m-Rougn0fol7ECCthba2HV0M6xz9zAfax4' },
    ]
  }
};

const API_ENDPOINTS = [
  { method: 'GET', path: '/api/scanner/stats', desc: 'Get platform statistics' },
  { method: 'GET', path: '/api/scanner/htlc-swaps', desc: 'List all HTLC swaps' },
  { method: 'GET', path: '/api/scanner/prices', desc: 'Get real-time token prices' },
  { method: 'POST', path: '/api/htlc/create', desc: 'Create new HTLC swap' },
  { method: 'GET', path: '/api/blockchain/status', desc: 'Get chain connection status' },
  { method: 'POST', path: '/api/trinity/verify-consensus', desc: 'Verify 2-of-3 consensus' },
];

export default function DeveloperPortal() {
  const { data: statsData, isLoading: loadingStats } = useQuery<{ success: boolean; data: any }>({
    queryKey: ['/api/scanner/stats'],
  });

  const { data: priceData } = useQuery<{ success: boolean; data: any }>({
    queryKey: ['/api/scanner/prices'],
  });

  const stats = statsData?.data;
  const prices = priceData?.data?.prices;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#0f0f2a] to-[#0a0a1a] text-white">
      <section className="relative py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-transparent to-cyan-500/10" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Code className="w-12 h-12 text-indigo-400" />
            <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30">
              <Activity className="w-3 h-3 mr-1 inline" /> Developer Portal
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Build with Trinity Protocol
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mb-8">
            Integrate multi-chain vault technology into your applications. 
            Access our APIs, smart contracts, and developer resources.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/developer-blog">
              <Button className="bg-gradient-to-r from-indigo-500 to-cyan-500" data-testid="button-docs">
                <BookOpen className="mr-2 h-4 w-4" /> Documentation
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-[#1a1a3a]/80 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-indigo-400">{stats?.totalSwaps || 31}</div>
              <div className="text-sm text-gray-400">Total Swaps</div>
            </CardContent>
          </Card>
          <Card className="bg-[#1a1a3a]/80 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-cyan-400">3</div>
              <div className="text-sm text-gray-400">Active Chains</div>
            </CardContent>
          </Card>
          <Card className="bg-[#1a1a3a]/80 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-green-400">{stats?.successRate || 100}%</div>
              <div className="text-sm text-gray-400">Success Rate</div>
            </CardContent>
          </Card>
          <Card className="bg-[#1a1a3a]/80 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-purple-400">v3.5.23</div>
              <div className="text-sm text-gray-400">Protocol Version</div>
            </CardContent>
          </Card>
        </div>

        <Separator className="bg-gray-700 my-8" />

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-[#1a1a3a]/80 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Braces className="h-5 w-5 text-indigo-400" />
                REST API Endpoints
              </CardTitle>
              <CardDescription>Available API endpoints for integration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {API_ENDPOINTS.map((endpoint, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 bg-[#0f0f2a] rounded border border-gray-700">
                    <Badge className={`text-xs ${endpoint.method === 'GET' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {endpoint.method}
                    </Badge>
                    <code className="text-xs text-gray-300 flex-1">{endpoint.path}</code>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a3a]/80 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-cyan-400" />
                Live Prices
              </CardTitle>
              <CardDescription>Real-time token prices from CoinGecko</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {prices && Object.entries(prices).map(([key, value]: [string, any]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-[#0f0f2a] rounded border border-gray-700">
                    <span className="capitalize font-medium">{key}</span>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-400">${value.price.toLocaleString()}</div>
                      <div className="text-xs text-gray-400">{value.symbol}/USD</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-[#1a1a3a]/80 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-purple-400" />
              Deployed Smart Contracts
            </CardTitle>
            <CardDescription>Production contracts on testnets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {Object.entries(DEPLOYED_CONTRACTS).map(([network, data]) => (
                <div key={network} className="space-y-2">
                  <Badge className="bg-indigo-500/20 text-indigo-400">{data.chain}</Badge>
                  <div className="space-y-2">
                    {data.contracts.map((contract) => (
                      <div key={contract.name} className="p-2 bg-[#0f0f2a] rounded border border-gray-700">
                        <div className="font-medium text-sm">{contract.name}</div>
                        <code className="text-xs text-gray-400 block truncate">{contract.address}</code>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/bridge">
            <Card className="bg-[#1a1a3a]/80 border-gray-700 hover:border-indigo-500/50 transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-indigo-400" />
                  Trinity Bridge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">Create cross-chain HTLC atomic swaps with 2-of-3 consensus.</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/monitoring">
            <Card className="bg-[#1a1a3a]/80 border-gray-700 hover:border-indigo-500/50 transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-cyan-400" />
                  Trinity Scan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">Blockchain explorer for all Trinity Protocol transactions.</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/trinity-protocol">
            <Card className="bg-[#1a1a3a]/80 border-gray-700 hover:border-indigo-500/50 transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-400" />
                  Protocol Docs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">Learn about Trinity Protocol architecture and security.</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  );
}
