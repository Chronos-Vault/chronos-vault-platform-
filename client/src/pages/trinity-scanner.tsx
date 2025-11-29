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

  const stats: ScannerStats | null = statsResponse?.data ?? null;
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
            <TabsList className="bg-gray-800">
              <TabsTrigger value="overview" className="data-[state=active]:bg-cyan-600">Overview</TabsTrigger>
              <TabsTrigger value="transactions" className="data-[state=active]:bg-cyan-600">Transactions</TabsTrigger>
              <TabsTrigger value="consensus" className="data-[state=active]:bg-cyan-600">Consensus Ops</TabsTrigger>
              <TabsTrigger value="vaults" className="data-[state=active]:bg-cyan-600">Vaults</TabsTrigger>
              <TabsTrigger value="swaps" className="data-[state=active]:bg-cyan-600">HTLC Swaps</TabsTrigger>
              <TabsTrigger value="validators" className="data-[state=active]:bg-cyan-600">Validators</TabsTrigger>
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
                      <div key={tx.txHash} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <ChainIcon chainId={tx.chainId} />
                          <div>
                            <div className="font-mono text-sm text-cyan-400">
                              {tx.txHash.slice(0, 10)}...{tx.txHash.slice(-6)}
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
                      </div>
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
                        <tr key={tx.txHash} className="border-b border-gray-800">
                          <td className="py-3">
                            <Link href={`/trinity-scan/tx/${tx.txHash}`}>
                              <span className="font-mono text-cyan-400 hover:underline cursor-pointer">
                                {tx.txHash.slice(0, 10)}...
                              </span>
                            </Link>
                          </td>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <ChainIcon chainId={tx.chainId} />
                              <span className="capitalize">{tx.chainId}</span>
                            </div>
                          </td>
                          <td className="py-3 font-mono text-sm">{tx.blockNumber}</td>
                          <td className="py-3 font-mono text-sm text-gray-400">
                            {tx.fromAddress.slice(0, 8)}...
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
                      
                      {/* Chain Status */}
                      <div className="grid grid-cols-3 gap-4">
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

          {/* Swaps Tab */}
          <TabsContent value="swaps">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle>HTLC Atomic Swaps</CardTitle>
                <CardDescription>Track cross-chain atomic swaps</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-400">
                  <ArrowRightLeft className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Loading swap data...</p>
                  <Link href="/trinity-scan/swaps">
                    <Button variant="outline" className="mt-4">
                      View Swaps <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Validators Tab */}
          <TabsContent value="validators">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle>Trinity Shield Validators</CardTitle>
                <CardDescription>Monitor validator status and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-400">
                  <Cpu className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Loading validator data...</p>
                  <Link href="/trinity-scan/validators">
                    <Button variant="outline" className="mt-4">
                      View Validators <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
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
