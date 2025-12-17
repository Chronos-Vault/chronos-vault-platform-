import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Search, Activity, Shield, Clock, ArrowRightLeft, Database,
  CheckCircle2, XCircle, Timer, Zap, Globe, Lock, Unlock,
  TrendingUp, BarChart2, Users, Box, Layers, ExternalLink,
  ChevronRight, RefreshCw, Cpu
} from 'lucide-react';
import { SiEthereum, SiSolana } from 'react-icons/si';

interface ScannerStats {
  chains: {
    [key: string]: {
      chainId: string;
      name: string;
      status: string;
      lastBlock?: string;
      lastSlot?: string;
      txCount24h: number;
      avgBlockTime: number;
    };
  };
  protocol: {
    totalConsensusOps: number;
    pendingConsensusOps: number;
    confirmedConsensusOps: number;
    failedConsensusOps: number;
    averageConfirmationTime: number;
  };
  vaults: {
    totalVaults: number;
    activeVaults: number;
    lockedValue: string;
    lockedValueUsd: string;
  };
  swaps: {
    totalSwaps: number;
    activeSwaps: number;
    completedSwaps: number;
    volume24h: string;
    volumeUsd24h: string;
  };
  validators: {
    totalValidators: number;
    activeValidators: number;
    averageResponseTime: number;
    consensusSuccessRate: number;
  };
  bridge: {
    totalBridgeOps: number;
    pendingBridgeOps: number;
    completedBridgeOps: number;
    volume24h: string;
  };
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

function formatWei(wei: string): string {
  const eth = parseFloat(wei) / 1e18;
  if (eth >= 1000) return formatNumber(eth) + ' ETH';
  return eth.toFixed(4) + ' ETH';
}

function formatUsd(usd: string): string {
  const num = parseFloat(usd);
  if (num >= 1000000) return '$' + (num / 1000000).toFixed(2) + 'M';
  if (num >= 1000) return '$' + (num / 1000).toFixed(2) + 'K';
  return '$' + num.toFixed(2);
}

function formatTime(ms: number): string {
  if (ms >= 60000) return (ms / 60000).toFixed(1) + 'm';
  if (ms >= 1000) return (ms / 1000).toFixed(1) + 's';
  return ms + 'ms';
}

// TON wallet address for explorer links (external messages don't have direct tx lookups)
const TON_WALLET_ADDRESS = '0QCctckQeh8Xo8-_U4L8PpXtjMBlG71S8PD8QZvr9OzmJvHK';

function getExplorerUrl(chainId: string, txHash: string): string {
  switch (chainId) {
    case 'arbitrum':
    case 'arbitrum-sepolia':
      return `https://sepolia.arbiscan.io/tx/${txHash}`;
    case 'solana':
    case 'solana-devnet':
      return `https://explorer.solana.com/tx/${txHash}?cluster=devnet`;
    case 'ton':
    case 'ton-testnet':
      // TON external messages can't be looked up by tx hash, link to wallet transactions
      return `https://testnet.tonscan.org/address/${TON_WALLET_ADDRESS}#transactions`;
    default:
      return `#`;
  }
}

const TRINITY_VALIDATORS = [
  { 
    chain: 'arbitrum', 
    chainId: 1, 
    address: '0x3A92fD5b39Ec9598225DB5b9f15af0523445E3d8', 
    role: 'PRIMARY', 
    status: 'active', 
    description: 'Arbitrum L2 (95% lower fees)',
    features: ['Primary execution layer', 'Low-cost transactions', 'EVM-compatible smart contracts']
  },
  { 
    chain: 'solana', 
    chainId: 2, 
    address: '0x2554324ae222673F4C36D1Ae0E58C19fFFf69cd5', 
    role: 'MONITOR', 
    status: 'active', 
    description: 'Solana (2000+ TPS verification)',
    features: ['High-frequency monitoring', '<5s SLA verification', 'Proof submission on-chain']
  },
  { 
    chain: 'ton', 
    chainId: 3, 
    address: '0x9662e22D1f037C7EB370DD0463c597C6cd69B4c4', 
    role: 'BACKUP', 
    status: 'active', 
    description: 'TON (Quantum-resistant recovery)',
    features: ['ML-KEM-1024 key encapsulation', 'CRYSTALS-Dilithium-5 signatures', '48-hour emergency recovery']
  },
];

const DEFENSE_LAYERS = [
  { layer: 1, name: 'Zero-Knowledge Proof Engine', tech: 'Groth16', icon: '🔍', status: 'active', description: 'Privacy-preserving transaction verification with mathematical proofs' },
  { layer: 2, name: 'Formal Verification Pipeline', tech: 'Lean 4', icon: '📐', status: 'active', description: 'Mathematical proof of smart contract correctness' },
  { layer: 3, name: 'MPC Key Management', tech: 'Shamir Secret Sharing + CRYSTALS-Kyber', icon: '🔑', status: 'active', description: '3-of-5 threshold cryptography with quantum resistance' },
  { layer: 4, name: 'VDF Time-Locks', tech: 'Wesolowski VDF', icon: '⏰', status: 'active', description: 'Provable time-delayed execution preventing flash attacks' },
  { layer: 5, name: 'AI + Cryptographic Governance', tech: 'Claude + Formal Proofs', icon: '🤖', status: 'active', description: 'AI decisions validated by mathematical proofs' },
  { layer: 6, name: 'Quantum-Resistant Cryptography', tech: 'ML-KEM-1024 + CRYSTALS-Dilithium-5', icon: '🔐', status: 'active', description: 'NIST FIPS 203/204 compliant post-quantum security' },
  { layer: 7, name: 'Trinity Protocol™ Consensus', tech: '2-of-3 Multi-Chain', icon: '🔺', status: 'active', description: 'Cross-chain verification across Arbitrum, Solana, TON' },
  { layer: 8, name: 'Trinity Shield™ TEE', tech: 'Intel SGX / AMD SEV', icon: '🛡️', status: 'active', description: 'Hardware-isolated execution for validator operations' },
];

function ChainIcon({ chainId }: { chainId: string }) {
  switch (chainId) {
    case 'arbitrum':
      return <SiEthereum className="w-5 h-5 text-blue-500" />;
    case 'solana':
      return <SiSolana className="w-5 h-5 text-purple-500" />;
    case 'ton':
      return <div className="w-5 h-5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-xs font-bold text-white">T</div>;
    default:
      return <Globe className="w-5 h-5" />;
  }
}

export default function TrinityScannerPage() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  const { data: statsResponse, isLoading: statsLoading, error: statsError, refetch: refetchStats } = useQuery<{ success: boolean; data: ScannerStats }>({
    queryKey: ['/api/scanner/stats'],
  });

  const { data: chainsResponse, isLoading: chainsLoading, error: chainsError } = useQuery<{ success: boolean; data: any[] }>({
    queryKey: ['/api/scanner/chains'],
  });

  const { data: txResponse, isLoading: txLoading, error: txError } = useQuery<{ success: boolean; data: { transactions: any[]; pagination: any } }>({
    queryKey: ['/api/scanner/transactions'],
  });

  const { data: consensusResponse, isLoading: consensusLoading, error: consensusError } = useQuery<{ success: boolean; data: { operations: any[]; pagination: any } }>({
    queryKey: ['/api/scanner/consensus'],
  });

  const { data: htlcSwapsResponse, isLoading: htlcSwapsLoading, refetch: refetchHtlcSwaps } = useQuery<{ success: boolean; swaps: any[]; count: number }>({
    queryKey: ['/api/htlc/swap/list'],
  });

  const stats: ScannerStats | null = statsResponse?.data ?? null;
  const htlcSwaps = htlcSwapsResponse?.swaps ?? [];
  const chains = chainsResponse?.data ?? [];
  const transactions = txResponse?.data?.transactions ?? [];
  const consensusOps = consensusResponse?.data?.operations ?? [];

  const isLoading = statsLoading || chainsLoading;
  const hasError = statsError || chainsError;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 3) {
      setIsSearching(true);
      try {
        const response = await fetch(`/api/scanner/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        if (data.success) {
          setSearchResults(data.data);
        }
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsSearching(false);
      }
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 mx-auto mb-4 text-cyan-400 animate-spin" />
          <p className="text-lg">Loading Trinity Scan...</p>
          <p className="text-sm text-gray-400 mt-2">Connecting to multi-chain explorers</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
          <p className="text-lg">Failed to load Trinity Scan</p>
          <p className="text-sm text-gray-400 mt-2">Please check your connection and try again</p>
          <Button onClick={() => refetchStats()} className="mt-4 bg-cyan-600 hover:bg-cyan-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3" data-testid="title-trinity-scan">
              <Shield className="w-8 h-8 text-cyan-400" />
              Trinity Scan
            </h1>
            <p className="text-gray-400 mt-1">Multi-Chain Blockchain Explorer for Trinity Protocol</p>
          </div>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="w-full md:w-auto">
            <div className="flex gap-2">
              <div className="relative flex-1 md:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by address, tx hash, operation ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
                  data-testid="input-search"
                />
              </div>
              <Button 
                type="submit" 
                className="bg-cyan-600 hover:bg-cyan-700" 
                data-testid="button-search"
                disabled={isSearching || searchQuery.trim().length < 3}
              >
                {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Search'}
              </Button>
              {searchResults && (
                <Button variant="ghost" onClick={clearSearch} className="text-gray-400">
                  Clear
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Search Results */}
        {searchResults && (
          <Card className="bg-gray-800/50 border-gray-700 mb-8">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Search className="w-5 h-5 text-cyan-400" />
                Search Results for "{searchQuery}"
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Object.values(searchResults).flat().length === 0 ? (
                <p className="text-gray-400 text-center py-4">No results found</p>
              ) : (
                <div className="space-y-4">
                  {searchResults.transactions?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Transactions</h4>
                      {searchResults.transactions.map((tx: any) => (
                        <div key={tx.txHash} className="p-3 bg-gray-900/50 rounded-lg flex items-center justify-between">
                          <span className="font-mono text-cyan-400">{tx.txHash.slice(0, 20)}...</span>
                          <Badge className="bg-green-600">{tx.status}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                  {searchResults.addresses?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Addresses</h4>
                      {searchResults.addresses.map((addr: any) => (
                        <div key={addr.address} className="p-3 bg-gray-900/50 rounded-lg flex items-center justify-between">
                          <span className="font-mono text-cyan-400">{addr.address}</span>
                          <Badge variant="outline">{addr.type}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                  {searchResults.operations?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Consensus Operations</h4>
                      {searchResults.operations.map((op: any) => (
                        <div key={op.operationId} className="p-3 bg-gray-900/50 rounded-lg flex items-center justify-between">
                          <span className="font-mono text-cyan-400">{op.operationId}</span>
                          <Badge className={op.status === 'confirmed' ? 'bg-green-600' : 'bg-yellow-600'}>{op.status}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                  {searchResults.swaps?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">HTLC Swaps</h4>
                      {searchResults.swaps.map((swap: any) => (
                        <div key={swap.swapId} className="p-3 bg-gray-900/50 rounded-lg flex items-center justify-between">
                          <span className="font-mono text-cyan-400">{swap.swapId}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-400">{swap.sourceChain} → {swap.destinationChain}</span>
                            <Badge className="bg-purple-600">{swap.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {searchResults.vaults?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Vaults</h4>
                      {searchResults.vaults.map((vault: any) => (
                        <div key={vault.id} className="p-3 bg-gray-900/50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-white">{vault.name}</span>
                            <Badge className={vault.trinityVerificationStatus === 'verified' ? 'bg-green-600' : 'bg-yellow-600'}>
                              {vault.trinityVerificationStatus || 'pending'}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            {vault.ethereumTxHash && (
                              <a href={`https://sepolia.arbiscan.io/tx/${vault.ethereumTxHash}`} target="_blank" rel="noopener noreferrer" 
                                className="text-cyan-400 hover:underline flex items-center gap-1">
                                <SiEthereum className="w-3 h-3" /> Arbitrum <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                            {vault.solanaTxHash && (
                              <a href={`https://explorer.solana.com/tx/${vault.solanaTxHash}?cluster=devnet`} target="_blank" rel="noopener noreferrer"
                                className="text-purple-400 hover:underline flex items-center gap-1">
                                <SiSolana className="w-3 h-3" /> Solana <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                            {vault.tonTxHash && (
                              <a href={`https://testnet.tonviewer.com/transaction/${vault.tonTxHash}`} target="_blank" rel="noopener noreferrer"
                                className="text-blue-400 hover:underline flex items-center gap-1">
                                <Globe className="w-3 h-3" /> TON <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Chain Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {chains.map((chain: any) => (
            <Card key={chain.chainId} className="bg-gray-800/50 border-gray-700" data-testid={`card-chain-${chain.chainId}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ChainIcon chainId={chain.chainId} />
                    <span className="font-medium">{chain.chainName}</span>
                  </div>
                  <Badge variant={chain.isActive ? "default" : "destructive"} className={chain.isActive ? "bg-green-600" : ""}>
                    {chain.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Network ID:</span>
                    <span className="text-white">{chain.networkId || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Native Token:</span>
                    <span className="text-white">{chain.nativeToken}</span>
                  </div>
                  {Object.entries(chain.contracts || {}).slice(0, 2).map(([name, address]: [string, any]) => (
                    <div key={name} className="flex justify-between text-gray-400">
                      <span className="truncate max-w-[120px]">{name}:</span>
                      <span className="text-cyan-400 font-mono text-xs truncate max-w-[150px]">
                        {typeof address === 'string' ? address.slice(0, 10) + '...' : 'N/A'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            <Card className="bg-gray-800/50 border-gray-700" data-testid="stat-consensus-ops">
              <CardContent className="p-4 text-center">
                <Layers className="w-6 h-6 mx-auto mb-2 text-cyan-400" />
                <div className="text-2xl font-bold">{formatNumber(stats.protocol.totalConsensusOps)}</div>
                <div className="text-xs text-gray-400">Consensus Ops</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50 border-gray-700" data-testid="stat-vaults">
              <CardContent className="p-4 text-center">
                <Lock className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                <div className="text-2xl font-bold">{stats.vaults.totalVaults}</div>
                <div className="text-xs text-gray-400">Active Vaults</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50 border-gray-700" data-testid="stat-tvl">
              <CardContent className="p-4 text-center">
                <Database className="w-6 h-6 mx-auto mb-2 text-green-400" />
                <div className="text-2xl font-bold">{formatUsd(stats.vaults.lockedValueUsd)}</div>
                <div className="text-xs text-gray-400">Total Value Locked</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50 border-gray-700" data-testid="stat-swaps">
              <CardContent className="p-4 text-center">
                <ArrowRightLeft className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
                <div className="text-2xl font-bold">{stats.swaps.totalSwaps}</div>
                <div className="text-xs text-gray-400">HTLC Swaps</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50 border-gray-700" data-testid="stat-validators">
              <CardContent className="p-4 text-center">
                <Shield className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                <div className="text-2xl font-bold">{stats.validators.activeValidators}/{stats.validators.totalValidators}</div>
                <div className="text-xs text-gray-400">Active Validators</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50 border-gray-700" data-testid="stat-success-rate">
              <CardContent className="p-4 text-center">
                <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-emerald-400" />
                <div className="text-2xl font-bold">{stats.validators.consensusSuccessRate}%</div>
                <div className="text-xs text-gray-400">Success Rate</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="bg-gray-800 flex-wrap">
              <TabsTrigger value="overview" className="data-[state=active]:bg-cyan-600">Overview</TabsTrigger>
              <TabsTrigger value="transactions" className="data-[state=active]:bg-cyan-600">Transactions</TabsTrigger>
              <TabsTrigger value="consensus" className="data-[state=active]:bg-cyan-600">Consensus Ops</TabsTrigger>
              <TabsTrigger value="htlc-swaps" className="data-[state=active]:bg-yellow-600">HTLC Swaps</TabsTrigger>
              <TabsTrigger value="vaults" className="data-[state=active]:bg-cyan-600">Vaults</TabsTrigger>
              <TabsTrigger value="validators" className="data-[state=active]:bg-cyan-600">Validators</TabsTrigger>
              <TabsTrigger value="defense" className="data-[state=active]:bg-cyan-600">8 Defense Layers</TabsTrigger>
            </TabsList>
            <Button variant="outline" size="sm" onClick={() => refetchStats()} data-testid="button-refresh">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Transactions */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg">Recent Transactions</CardTitle>
                  <Link href="/trinity-scan/transactions">
                    <Button variant="ghost" size="sm" className="text-cyan-400">
                      View All <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {transactions.slice(0, 5).map((tx: any) => (
                      <a 
                        key={tx.txHash} 
                        href={tx.explorerUrl || getExplorerUrl(tx.chainId, tx.txHash)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg hover:bg-gray-800/70 transition-colors cursor-pointer"
                        data-testid={`tx-link-${tx.txHash.slice(0, 10)}`}
                      >
                        <div className="flex items-center gap-3">
                          <ChainIcon chainId={tx.chainId} />
                          <div>
                            <div className="font-mono text-sm text-cyan-400 flex items-center gap-1">
                              {tx.txHash.slice(0, 10)}...{tx.txHash.slice(-6)}
                              <ExternalLink className="w-3 h-3" />
                            </div>
                            <div className="text-xs text-gray-400">
                              {tx.methodName || 'Transfer'}
                            </div>
                          </div>
                        </div>
                        <Badge variant={tx.status === 'success' ? 'default' : 'destructive'} 
                               className={tx.status === 'success' ? 'bg-green-600' : ''}>
                          {tx.status}
                        </Badge>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Consensus Operations */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg">Recent Consensus Operations</CardTitle>
                  <Link href="/trinity-scan/consensus">
                    <Button variant="ghost" size="sm" className="text-cyan-400">
                      View All <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {consensusOps.slice(0, 5).map((op: any) => (
                      <div key={op.operationId} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                        <div>
                          <div className="font-mono text-sm text-cyan-400">
                            {op.operationId.slice(0, 20)}...
                          </div>
                          <div className="text-xs text-gray-400 flex items-center gap-2">
                            <span>{op.operationType.replace('_', ' ')}</span>
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              {op.currentConfirmations}/{op.requiredConfirmations}
                            </span>
                          </div>
                        </div>
                        <Badge 
                          variant={op.status === 'confirmed' ? 'default' : op.status === 'partial' ? 'secondary' : 'destructive'}
                          className={op.status === 'confirmed' ? 'bg-green-600' : op.status === 'partial' ? 'bg-yellow-600' : ''}>
                          {op.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Protocol Performance */}
            {stats && (
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg">Protocol Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <div className="text-sm text-gray-400 mb-2">Consensus Success Rate</div>
                      <Progress value={stats.validators.consensusSuccessRate} className="h-2" />
                      <div className="text-sm mt-1">{stats.validators.consensusSuccessRate}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-2">Avg Confirmation Time</div>
                      <div className="text-2xl font-bold">{formatTime(stats.protocol.averageConfirmationTime)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-2">Validator Response Time</div>
                      <div className="text-2xl font-bold">{formatTime(stats.validators.averageResponseTime)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-2">24h Swap Volume</div>
                      <div className="text-2xl font-bold">{formatUsd(stats.swaps.volumeUsd24h)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle>All Transactions</CardTitle>
                <CardDescription>View all indexed transactions across chains</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-400 border-b border-gray-700">
                        <th className="pb-3 font-medium">Tx Hash</th>
                        <th className="pb-3 font-medium">Chain</th>
                        <th className="pb-3 font-medium">Block</th>
                        <th className="pb-3 font-medium">From</th>
                        <th className="pb-3 font-medium">To</th>
                        <th className="pb-3 font-medium">Method</th>
                        <th className="pb-3 font-medium">Status</th>
                        <th className="pb-3 font-medium">Age</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx: any) => (
                        <tr key={tx.txHash} className="border-b border-gray-800 hover:bg-gray-800/50">
                          <td className="py-3">
                            <a 
                              href={tx.explorerUrl || getExplorerUrl(tx.chainId, tx.txHash)} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="font-mono text-cyan-400 hover:underline cursor-pointer flex items-center gap-1"
                            >
                              {tx.txHash.slice(0, 10)}...
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </td>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <ChainIcon chainId={tx.chainId} />
                              <span className="capitalize">{tx.chainId?.replace('-', ' ')}</span>
                            </div>
                          </td>
                          <td className="py-3 font-mono text-sm">{tx.blockNumber || '-'}</td>
                          <td className="py-3 font-mono text-sm text-gray-400">
                            {tx.fromAddress?.slice(0, 8)}...
                          </td>
                          <td className="py-3 font-mono text-sm text-gray-400">
                            {tx.toAddress?.slice(0, 8)}...
                          </td>
                          <td className="py-3">
                            <Badge variant="outline">{tx.methodName || 'Transfer'}</Badge>
                          </td>
                          <td className="py-3">
                            <Badge className={tx.status === 'success' ? 'bg-green-600' : 'bg-red-600'}>
                              {tx.status}
                            </Badge>
                          </td>
                          <td className="py-3 text-gray-400 text-sm">
                            {Math.round((Date.now() - new Date(tx.timestamp).getTime()) / 60000)}m ago
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Consensus Tab */}
          <TabsContent value="consensus">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle>Trinity Consensus Operations</CardTitle>
                <CardDescription>2-of-3 multi-chain consensus operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {consensusOps.map((op: any) => (
                    <div key={op.operationId} className="p-4 bg-gray-900/50 rounded-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="font-mono text-cyan-400">{op.operationId}</div>
                          <div className="text-sm text-gray-400 capitalize mt-1">{op.operationType.replace('_', ' ')}</div>
                        </div>
                        <Badge 
                          className={op.status === 'confirmed' ? 'bg-green-600' : op.status === 'partial' ? 'bg-yellow-600' : 'bg-gray-600'}>
                          {op.status} ({op.currentConfirmations}/{op.requiredConfirmations})
                        </Badge>
                      </div>
                      
                      {/* Chain Status with Explorer Links */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <ChainIcon chainId="arbitrum" />
                            <span>Arbitrum</span>
                            {op.arbitrumStatus === 'confirmed' ? (
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            ) : op.arbitrumStatus === 'pending' ? (
                              <Timer className="w-4 h-4 text-yellow-500" />
                            ) : (
                              <span className="text-gray-500 text-xs">N/A</span>
                            )}
                          </div>
                          {op.arbitrumTxHash && (
                            <a href={`https://sepolia.arbiscan.io/tx/${op.arbitrumTxHash}`} target="_blank" rel="noopener noreferrer"
                              className="text-xs text-cyan-400 hover:underline flex items-center gap-1 ml-7">
                              {op.arbitrumTxHash.slice(0, 8)}... <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <ChainIcon chainId="solana" />
                            <span>Solana</span>
                            {op.solanaStatus === 'confirmed' ? (
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            ) : op.solanaStatus === 'pending' ? (
                              <Timer className="w-4 h-4 text-yellow-500" />
                            ) : (
                              <span className="text-gray-500 text-xs">N/A</span>
                            )}
                          </div>
                          {op.solanaTxHash && (
                            <a href={`https://explorer.solana.com/tx/${op.solanaTxHash}?cluster=devnet`} target="_blank" rel="noopener noreferrer"
                              className="text-xs text-purple-400 hover:underline flex items-center gap-1 ml-7">
                              {op.solanaTxHash.slice(0, 8)}... <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <ChainIcon chainId="ton" />
                            <span>TON</span>
                            {op.tonStatus === 'confirmed' ? (
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            ) : op.tonStatus === 'pending' ? (
                              <Timer className="w-4 h-4 text-yellow-500" />
                            ) : (
                              <span className="text-gray-500 text-xs">N/A</span>
                            )}
                          </div>
                          {op.tonTxHash && (
                            <a href={`https://testnet.tonviewer.com/transaction/${op.tonTxHash}`} target="_blank" rel="noopener noreferrer"
                              className="text-xs text-blue-400 hover:underline flex items-center gap-1 ml-7">
                              {op.tonTxHash.slice(0, 8)}... <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vaults Tab */}
          <TabsContent value="vaults">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle>ChronosVault Operations</CardTitle>
                <CardDescription>Track vault creation, deposits, and withdrawals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-400">
                  <Lock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Loading vault data...</p>
                  <Link href="/trinity-scan/vaults">
                    <Button variant="outline" className="mt-4">
                      Explore Vaults <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* HTLC Swaps Tab */}
          <TabsContent value="htlc-swaps">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowRightLeft className="w-5 h-5 text-yellow-400" />
                    HTLC Atomic Swaps
                  </CardTitle>
                  <CardDescription>Cross-chain swaps secured by Trinity Protocol™ 2-of-3 consensus</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => refetchHtlcSwaps()} data-testid="button-refresh-swaps">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </CardHeader>
              <CardContent>
                {htlcSwapsLoading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="w-8 h-8 mx-auto mb-4 text-yellow-400 animate-spin" />
                    <p className="text-gray-400">Loading swap data...</p>
                  </div>
                ) : htlcSwaps.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <ArrowRightLeft className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="mb-2">No active HTLC swaps</p>
                    <p className="text-sm">Initiate a swap from the Trinity Bridge to see it here</p>
                    <Link href="/trinity-bridge">
                      <Button variant="outline" className="mt-4">
                        Go to Trinity Bridge <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <Card className="bg-gray-900/50 border-gray-700">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-yellow-400">{htlcSwaps.length}</div>
                          <div className="text-xs text-gray-400">Total Swaps</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-gray-900/50 border-gray-700">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-green-400">
                            {htlcSwaps.filter((s: any) => s.status === 'completed' || s.status === 'claimed').length}
                          </div>
                          <div className="text-xs text-gray-400">Completed</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-gray-900/50 border-gray-700">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-cyan-400">
                            {htlcSwaps.filter((s: any) => s.status === 'pending' || s.status === 'initiated').length}
                          </div>
                          <div className="text-xs text-gray-400">Pending</div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="space-y-3">
                      {htlcSwaps.map((swap: any) => (
                        <div key={swap.swapId} className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 hover:border-yellow-600/50 transition-colors">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="font-mono text-sm text-yellow-400 flex items-center gap-2">
                                <ArrowRightLeft className="w-4 h-4" />
                                {swap.swapId.slice(0, 16)}...{swap.swapId.slice(-8)}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                Created: {new Date(swap.createdAt).toLocaleString()}
                              </div>
                            </div>
                            <Badge 
                              className={
                                swap.status === 'completed' || swap.status === 'claimed' ? 'bg-green-600' : 
                                swap.status === 'pending' || swap.status === 'initiated' ? 'bg-yellow-600' : 
                                swap.status === 'failed' || swap.status === 'refunded' ? 'bg-red-600' : 
                                'bg-gray-600'
                              }
                            >
                              {swap.status.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-400">From:</span>
                              <div className="flex items-center gap-2 mt-1">
                                <ChainIcon chainId={swap.sourceChain} />
                                <span className="capitalize">{swap.sourceChain}</span>
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-400">To:</span>
                              <div className="flex items-center gap-2 mt-1">
                                <ChainIcon chainId={swap.destinationChain} />
                                <span className="capitalize">{swap.destinationChain}</span>
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-400">Amount:</span>
                              <div className="font-medium mt-1">{swap.amount} ETH</div>
                            </div>
                            <div>
                              <span className="text-gray-400">Consensus:</span>
                              <div className="flex items-center gap-1 mt-1">
                                <span className="font-medium">{swap.consensusCount || 0}/3</span>
                                {swap.consensusCount >= 2 ? (
                                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                                ) : (
                                  <Timer className="w-4 h-4 text-yellow-500" />
                                )}
                              </div>
                            </div>
                          </div>
                          {swap.transactionHash && (
                            <div className="mt-3 pt-3 border-t border-gray-700/50">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-400">Tx Hash:</span>
                                  <span className="font-mono text-xs text-cyan-400">
                                    {swap.transactionHash.slice(0, 10)}...{swap.transactionHash.slice(-8)}
                                  </span>
                                </div>
                                <a 
                                  href={swap.explorerUrl || `https://sepolia.arbiscan.io/tx/${swap.transactionHash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                                  data-testid="link-explorer"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  View on Explorer
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 p-4 bg-gray-900/30 rounded-lg border border-gray-700">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">How HTLC Swaps Work</h4>
                  <p className="text-sm text-gray-400">
                    Hash Time-Locked Contracts (HTLC) enable trustless cross-chain swaps. Each swap requires 
                    <span className="text-yellow-400 font-bold"> 2-of-3 validator consensus</span> from Arbitrum, Solana, and TON 
                    before funds are released. If the swap isn't completed within the time lock, funds are automatically refunded.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Legacy Swaps Tab - redirect to HTLC Swaps */}
          <TabsContent value="swaps">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle>HTLC Atomic Swaps</CardTitle>
                <CardDescription>Track cross-chain atomic swaps</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-400">
                  <ArrowRightLeft className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Use the HTLC Swaps tab to view swap operations</p>
                  <Button variant="outline" className="mt-4" onClick={() => setActiveTab('htlc-swaps')}>
                    View HTLC Swaps <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Validators Tab */}
          <TabsContent value="validators">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  Trinity Protocol Validators
                </CardTitle>
                <CardDescription>2-of-3 multi-chain consensus validators (on-chain registered)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {TRINITY_VALIDATORS.map((validator) => (
                    <div key={validator.chain} className={`p-4 bg-gray-900/50 rounded-lg border ${validator.role === 'BACKUP' ? 'border-purple-500/50 bg-gradient-to-r from-purple-900/20 to-gray-900/50' : 'border-gray-700'}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <ChainIcon chainId={validator.chain} />
                          <div>
                            <div className="font-medium capitalize">{validator.chain}</div>
                            <div className="text-xs text-gray-400">{validator.description}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={validator.role === 'PRIMARY' ? 'bg-cyan-600' : validator.role === 'MONITOR' ? 'bg-purple-600' : 'bg-gradient-to-r from-purple-600 to-blue-600'}>
                            {validator.role === 'BACKUP' ? '🔐 QUANTUM BACKUP' : validator.role}
                          </Badge>
                          <Badge className="bg-green-600">
                            {validator.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-400">Chain ID:</span>
                          <span className="ml-2 font-mono">{validator.chainId}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Validator Address:</span>
                          <span className="ml-2 font-mono text-cyan-400">{validator.address.slice(0, 10)}...{validator.address.slice(-8)}</span>
                        </div>
                      </div>
                      {/* Show features for each validator */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {validator.features.map((feature: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs border-gray-600 text-gray-300">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-gray-900/30 rounded-lg border border-gray-700">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Consensus Requirement</h4>
                  <p className="text-sm text-gray-400">
                    Trinity Protocol requires <span className="text-cyan-400 font-bold">2-of-3</span> validator confirmations for all operations.
                    This ensures security against single points of failure while maintaining efficient cross-chain operations.
                  </p>
                </div>

                {/* TON Quantum Recovery Section */}
                <div className="mt-6 p-4 bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-lg border border-purple-500/50">
                  <h4 className="text-sm font-medium text-purple-300 mb-3 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    TON Quantum-Resistant Recovery System
                  </h4>
                  <p className="text-sm text-gray-300 mb-4">
                    The TON blockchain serves as the emergency recovery layer with <span className="text-purple-400 font-bold">post-quantum cryptography</span>. 
                    Even if quantum computers compromise other chains, your assets remain secure.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                      <div className="text-purple-400 font-medium mb-1">ML-KEM-1024</div>
                      <div className="text-gray-400 text-xs">NIST FIPS 203 key encapsulation for quantum-safe key exchange</div>
                    </div>
                    <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                      <div className="text-purple-400 font-medium mb-1">CRYSTALS-Dilithium-5</div>
                      <div className="text-gray-400 text-xs">NIST FIPS 204 signatures resistant to Shor's algorithm</div>
                    </div>
                    <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                      <div className="text-purple-400 font-medium mb-1">48-Hour Time Lock</div>
                      <div className="text-gray-400 text-xs">Emergency recovery with enforced delay for security review</div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <Badge className="bg-purple-600/50 text-purple-200">NIST Compliant</Badge>
                    <Badge className="bg-blue-600/50 text-blue-200">Post-Quantum Ready</Badge>
                    <a 
                      href={`https://testnet.tonscan.org/address/${TON_WALLET_ADDRESS}#transactions`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-auto"
                    >
                      <Button variant="outline" size="sm" className="text-xs">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        View TON Transactions
                      </Button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Defense Layers Tab */}
          <TabsContent value="defense">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-cyan-400" />
                  Mathematical Defense Layer (MDL)
                </CardTitle>
                <CardDescription>8 cryptographic layers providing enterprise-grade security</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {DEFENSE_LAYERS.map((layer) => (
                    <div key={layer.layer} className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 hover:border-cyan-600/50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{layer.icon}</div>
                          <div>
                            <div className="font-medium text-white">Layer {layer.layer}: {layer.name}</div>
                            <div className="text-xs text-cyan-400">{layer.tech}</div>
                          </div>
                        </div>
                        <Badge className="bg-green-600 text-xs">{layer.status}</Badge>
                      </div>
                      <p className="text-sm text-gray-400 mt-2">{layer.description}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-gradient-to-r from-cyan-900/30 to-purple-900/30 rounded-lg border border-cyan-700/50">
                  <h4 className="text-sm font-medium text-cyan-300 mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Trinity Shield™ Hardware Security
                  </h4>
                  <p className="text-sm text-gray-300">
                    "Mathematically Proven. Hardware Protected." - Our custom in-house TEE solution provides hardware-isolated 
                    execution for multi-chain validators using Intel SGX and AMD SEV enclaves with quantum-resistant key management.
                  </p>
                </div>

                <div className="mt-4 p-4 bg-gray-900/30 rounded-lg border border-gray-700">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">TON Testnet Funding</h4>
                  <p className="text-sm text-gray-400 mb-2">
                    To enable real TON testnet transactions, fund your TON wallet:
                  </p>
                  <ol className="text-sm text-gray-400 list-decimal ml-4 space-y-1">
                    <li>Visit <a href="https://t.me/testgiver_ton_bot" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">@testgiver_ton_bot</a> on Telegram</li>
                    <li>Send your wallet address to receive testnet TON</li>
                    <li>Wait for confirmation (usually 1-2 minutes)</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
          <p>Trinity Scan v1.0 - Multi-Chain Blockchain Explorer</p>
          <p className="mt-1">Powered by Trinity Protocol™ | Arbitrum Sepolia • Solana Devnet • TON Testnet</p>
        </div>
      </div>
    </div>
  );
}
