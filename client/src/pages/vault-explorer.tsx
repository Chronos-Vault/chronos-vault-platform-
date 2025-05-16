/**
 * Vault Explorer Page
 * 
 * A comprehensive explorer to view and verify vaults across multiple blockchains
 */
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search,
  BarChart,
  Clock,
  Filter,
  ExternalLink,
  Shield,
  PieChart,
  Layers,
  Calendar,
  Database,
  Lock,
  Unlock,
  HelpCircle,
  AlertCircle,
  Download,
  ArrowUpDown,
  Info,
  RefreshCw,
  Wallet
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BlockchainType, VaultInfo, VaultStatus, ExplorerStats, SecurityLevel } from '@shared/schema';
import { useChainExplorer } from '@/hooks/use-chain-explorer';
import { useQuery } from '@tanstack/react-query';
import { useLocation, Link } from 'wouter';
import { useWallet } from '@/contexts/wallet-context';

/**
 * Helper function to get color for vault status
 */
const getVaultStatusColor = (status: VaultStatus): string => {
  switch (status) {
    case 'active':
      return 'bg-green-500/10 text-green-500 border border-green-500/20';
    case 'locked':
      return 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20';
    case 'unlocked':
      return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
    case 'pending':
      return 'bg-purple-500/10 text-purple-500 border border-purple-500/20';
    default:
      return 'bg-gray-500/10 text-gray-500 border border-gray-500/20';
  }
};

/**
 * Helper function to get blockchain color
 */
const getBlockchainColor = (blockchain: BlockchainType): string => {
  switch (blockchain) {
    case 'ETH':
      return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
    case 'SOL':
      return 'bg-purple-500/10 text-purple-500 border border-purple-500/20';
    case 'TON':
      return 'bg-teal-500/10 text-teal-500 border border-teal-500/20';
    default:
      return 'bg-gray-500/10 text-gray-500 border border-gray-500/20';
  }
};

/**
 * Helper function to format dates
 */
const formatDate = (date: Date | string | null): string => {
  if (!date) return 'N/A';
  
  // Handle date string format from API
  if (typeof date === 'string') {
    try {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) return 'Invalid Date';
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(parsedDate);
    } catch (e) {
      return 'Invalid Date';
    }
  }
  
  // Handle Date object
  try {
    if (isNaN(date.getTime())) return 'Invalid Date';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  } catch (e) {
    return 'Invalid Date';
  }
};

/**
 * Component to display blockchain icon
 */
const BlockchainIcon = ({ blockchain }: { blockchain: BlockchainType }) => {
  switch (blockchain) {
    case 'ETH':
      return <span className="text-blue-500 font-bold">Ξ</span>;
    case 'SOL':
      return <span className="text-purple-500 font-bold">◎</span>;
    case 'TON':
      return <span className="text-teal-500 font-bold">💎</span>;
    default:
      return <span className="text-gray-500">?</span>;
  }
};

/**
 * Component to display vault security level
 */
const SecurityLevelBadge = ({ level }: { level: SecurityLevel }) => {
  const getColor = () => {
    switch (level) {
      case 'standard':
        return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
      case 'enhanced': 
        return 'bg-purple-500/10 text-purple-500 border border-purple-500/20';
      case 'maximum':
        return 'bg-red-500/10 text-red-500 border border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border border-gray-500/20';
    }
  };

  const getIcon = () => {
    switch (level) {
      case 'standard':
        return <Shield className="h-3 w-3 mr-1" />;
      case 'enhanced':
        return <Shield className="h-3 w-3 mr-1" />;
      case 'maximum':
        return <Shield className="h-3 w-3 mr-1" />;
      default:
        return <Shield className="h-3 w-3 mr-1" />;
    }
  };

  return (
    <Badge variant="outline" className={`${getColor()} text-xs py-0.5 flex items-center`}>
      {getIcon()}
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </Badge>
  );
};

/**
 * Component to display a vault card
 */
const VaultCard = ({ vault, showExplorer = true }: { vault: VaultInfo, showExplorer?: boolean }) => {
  const chainExplorer = useChainExplorer(vault.blockchain, true);
  const [location, navigate] = useLocation();

  return (
    <Card className="overflow-hidden border border-white/5 bg-black/30 backdrop-blur-xl transition-all hover:border-[#6B00D7]/30 hover:shadow-md hover:shadow-[#6B00D7]/5">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BlockchainIcon blockchain={vault.blockchain} />
            <Badge variant="outline" className={getBlockchainColor(vault.blockchain)}>
              {vault.blockchain}
            </Badge>
            <Badge variant="outline" className={getVaultStatusColor(vault.status)}>
              {vault.status.charAt(0).toUpperCase() + vault.status.slice(1)}
            </Badge>
          </div>
          <SecurityLevelBadge level={vault.securityLevel} />
        </div>
        <CardTitle className="mt-2 cursor-pointer hover:text-[#FF5AF7] transition-colors" onClick={() => navigate(`/vault/${vault.id}`)}>
          {vault.name}
        </CardTitle>
        <CardDescription>
          ID: {vault.id}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-1 pb-0 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Owner:</span>
          <span className="font-mono text-xs truncate max-w-[200px]">{chainExplorer.formatAddress(vault.owner)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Value:</span>
          <span className="font-bold text-xs">{vault.value}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Unlock Date:</span>
          <span className="text-xs">{formatDate(vault.unlockDate)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Created:</span>
          <span className="text-xs">{formatDate(vault.createdAt)}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-4 pb-3 flex justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-[#6B00D7] hover:text-[#FF5AF7] text-xs"
          onClick={() => navigate(`/vault/${vault.id}`)}
        >
          View Details
        </Button>
        
        {showExplorer && vault.txHash && (
          <a 
            href={chainExplorer.getTransactionUrl(vault.txHash)} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#6B00D7] hover:text-[#FF5AF7] text-xs flex items-center gap-1 transition-colors"
          >
            View on {chainExplorer.name} <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </CardFooter>
    </Card>
  );
};

/**
 * Stats Card Component
 */
const StatsCard = ({ title, value, icon, description }: { 
  title: string; 
  value: string | number; 
  icon: React.ReactNode;
  description?: string;
}) => {
  return (
    <Card className="overflow-hidden border border-white/5 bg-black/30 backdrop-blur-xl">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium text-gray-400">{title}</CardTitle>
          <div className="p-2 rounded-full bg-[#6B00D7]/10 text-[#FF5AF7]">
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
};

/**
 * Main Vault Explorer Page
 */
const VaultExplorer = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBlockchain, setActiveBlockchain] = useState<BlockchainType | 'ALL'>('ALL');
  const [activeTab, setActiveTab] = useState('all');
  const { isConnected, connect } = useWallet();

  // Define response types for API endpoints
  type ApiResponse<T> = {
    success: boolean;
    stats?: ExplorerStats;
    vaults?: VaultInfo[];
    message?: string;
  };

  // Fetch explorer stats
  const { data: statsData, isLoading: statsLoading } = useQuery<ApiResponse<ExplorerStats>>({
    queryKey: ['/api/explorer/stats'],
    retry: 1
  });

  // Fetch recent vaults
  const { data: recentVaultsData, isLoading: recentVaultsLoading } = useQuery<ApiResponse<VaultInfo[]>>({
    queryKey: ['/api/explorer/recent'],
    retry: 1
  });

  // Fetch blockchain-specific vaults
  const { data: blockchainVaultsData, isLoading: blockchainVaultsLoading } = useQuery<ApiResponse<VaultInfo[]>>({
    queryKey: ['/api/explorer/blockchain', activeBlockchain],
    enabled: activeBlockchain !== 'ALL',
    retry: 1
  });

  // Fetch search results
  const { data: searchResultsData, isLoading: searchResultsLoading, refetch: refetchSearch } = useQuery<ApiResponse<VaultInfo[]>>({
    queryKey: ['/api/explorer/search'],
    enabled: false,
    retry: 1
  });

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      refetchSearch();
      setActiveTab('search');
    } else {
      toast({
        title: "Empty Search",
        description: "Please enter a vault ID, address, or transaction hash to search",
        variant: "destructive"
      });
    }
  };

  // Default empty stats
  const defaultStats: ExplorerStats = {
    totalVaults: 0,
    byChain: { ETH: 0, SOL: 0, TON: 0 },
    byStatus: { active: 0, locked: 0, unlocked: 0, pending: 0 },
    totalValue: { ETH: '0 ETH', SOL: '0 SOL', TON: '0 TON' }
  };

  // Extract stats from data
  const stats: ExplorerStats = statsData?.success && statsData.stats ? statsData.stats : defaultStats;

  // Extract vaults from data based on active tab
  const vaults: VaultInfo[] = (() => {
    if (activeTab === 'search') {
      return searchResultsData?.success && searchResultsData.vaults ? searchResultsData.vaults : [];
    } else if (activeTab === 'blockchain' && activeBlockchain !== 'ALL') {
      return blockchainVaultsData?.success && blockchainVaultsData.vaults ? blockchainVaultsData.vaults : [];
    } else {
      return recentVaultsData?.success && recentVaultsData.vaults ? recentVaultsData.vaults : [];
    }
  })();

  // Check if any data is loading
  const isLoading = statsLoading || recentVaultsLoading || 
    (activeTab === 'blockchain' && blockchainVaultsLoading) || 
    (activeTab === 'search' && searchResultsLoading);

  return (
    <div className="container pt-8 mb-16">
      <div className="flex flex-col">
        <div className="flex flex-col space-y-1.5">
          <h1 className="text-3xl font-bold tracking-tight">Vault Explorer</h1>
          <p className="text-gray-400 max-w-3xl">
            Track and verify vaults across Ethereum, Solana, and TON blockchains. The explorer provides a unified view of all vaults in the Chronos Vault ecosystem.
          </p>
        </div>

        {/* Connect Wallet Button */}
        {!isConnected && (
          <div className="mt-6 mb-4">
            <Card className="border border-yellow-500/20 bg-yellow-500/5">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-yellow-500" />
                  <p className="text-yellow-400">Connect your wallet to verify ownership and access your vaults</p>
                </div>
                <Button 
                  onClick={() => connect('TON')} 
                  className="bg-[#6B00D7] hover:bg-[#6B00D7]/90 text-white"
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  Connect Wallet
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search and Filter */}
        <div className="mt-6 mb-6">
          <Card className="border border-white/5 bg-black/30 backdrop-blur-xl overflow-hidden">
            <CardContent className="pt-6">
              <form onSubmit={handleSearch} className="flex gap-3">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <Input
                      placeholder="Search by Vault ID, Address or Transaction Hash"
                      className="border-0 bg-background pl-10 focus-visible:ring-1 focus-visible:ring-[#6B00D7]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <Button type="submit" className="shrink-0 bg-[#6B00D7] hover:bg-[#6B00D7]/90">
                  Search
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard 
            title="Total Vaults" 
            value={stats.totalVaults} 
            icon={<Database className="h-4 w-4" />}
            description="Total vaults across all blockchains" 
          />
          <StatsCard 
            title="Ethereum Vaults" 
            value={stats.byChain.ETH} 
            icon={<span className="text-blue-500 font-bold">Ξ</span>}
            description={`Total value: ${stats.totalValue.ETH}`} 
          />
          <StatsCard 
            title="Solana Vaults" 
            value={stats.byChain.SOL} 
            icon={<span className="text-purple-500 font-bold">◎</span>}
            description={`Total value: ${stats.totalValue.SOL}`} 
          />
          <StatsCard 
            title="TON Vaults" 
            value={stats.byChain.TON} 
            icon={<span className="text-teal-500 font-bold">💎</span>}
            description={`Total value: ${stats.totalValue.TON}`} 
          />
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Recent Vaults
            </TabsTrigger>
            <TabsTrigger value="blockchain" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              By Blockchain
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search Results
            </TabsTrigger>
          </TabsList>

          {/* Recent Vaults Tab */}
          <TabsContent value="all" className="py-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Recent Vaults</h3>
              <div className="flex gap-2">
                <Select defaultValue="created">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created">Created (newest)</SelectItem>
                    <SelectItem value="unlock">Unlock Date</SelectItem>
                    <SelectItem value="value">Value (highest)</SelectItem>
                    <SelectItem value="security">Security Level</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" className="h-10 w-10" title="Refresh">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-2 border-[#6B00D7] border-t-transparent rounded-full" />
              </div>
            ) : vaults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vaults.map((vault: VaultInfo) => (
                  <VaultCard key={vault.id} vault={vault} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-xl font-bold">No Vaults Found</h3>
                <p className="text-gray-400 max-w-md mt-2">
                  There are no recent vaults to display. Check back later or search for specific vaults.
                </p>
              </div>
            )}
          </TabsContent>

          {/* By Blockchain Tab */}
          <TabsContent value="blockchain" className="py-4">
            <h3 className="text-xl font-bold mb-4">Vaults by Blockchain</h3>
            
            <div className="flex mb-4 space-x-2">
              <Button 
                variant={activeBlockchain === 'ALL' ? 'default' : 'outline'} 
                onClick={() => setActiveBlockchain('ALL')}
                className="flex items-center gap-2"
              >
                <Layers className="h-4 w-4" />
                All
              </Button>
              <Button 
                variant={activeBlockchain === 'ETH' ? 'default' : 'outline'} 
                onClick={() => setActiveBlockchain('ETH')}
                className="flex items-center gap-2 text-blue-500"
              >
                <span className="font-bold">Ξ</span>
                Ethereum
              </Button>
              <Button 
                variant={activeBlockchain === 'SOL' ? 'default' : 'outline'} 
                onClick={() => setActiveBlockchain('SOL')}
                className="flex items-center gap-2 text-purple-500"
              >
                <span className="font-bold">◎</span>
                Solana
              </Button>
              <Button 
                variant={activeBlockchain === 'TON' ? 'default' : 'outline'} 
                onClick={() => setActiveBlockchain('TON')}
                className="flex items-center gap-2 text-teal-500"
              >
                <span className="font-bold">💎</span>
                TON
              </Button>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-2 border-[#6B00D7] border-t-transparent rounded-full" />
              </div>
            ) : vaults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vaults.map((vault: VaultInfo) => (
                  <VaultCard key={vault.id} vault={vault} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-xl font-bold">No Vaults Found</h3>
                <p className="text-gray-400 max-w-md mt-2">
                  No vaults found for the selected blockchain. Try another blockchain or use the search function.
                </p>
              </div>
            )}
          </TabsContent>

          {/* Search Results Tab */}
          <TabsContent value="search" className="py-4">
            <h3 className="text-xl font-bold mb-4">Search Results</h3>
            
            {searchQuery && (
              <div className="mb-4">
                <p className="text-sm text-gray-400">
                  Showing results for: <span className="font-medium text-white">{searchQuery}</span>
                </p>
              </div>
            )}
            
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-2 border-[#6B00D7] border-t-transparent rounded-full" />
              </div>
            ) : vaults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vaults.map((vault: VaultInfo) => (
                  <VaultCard key={vault.id} vault={vault} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-xl font-bold">No Results</h3>
                <p className="text-gray-400 max-w-md mt-2">
                  No vaults match your search criteria. Try using a different vault ID, address, or transaction hash.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Help Section */}
        <Card className="border border-white/5 bg-black/30 backdrop-blur-xl overflow-hidden mt-8 mb-12">
          <CardHeader>
            <div className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-[#FF5AF7]" />
              <CardTitle className="text-lg">How to Use the Vault Explorer</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div>
              <h4 className="font-bold mb-1">Searching for Vaults</h4>
              <p className="text-sm text-gray-400">
                Use the search bar to find vaults by Vault ID, wallet address, or transaction hash.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-1">Browsing by Blockchain</h4>
              <p className="text-sm text-gray-400">
                Select a specific blockchain (Ethereum, Solana, or TON) to view all vaults on that network.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-1">Verifying Transactions</h4>
              <p className="text-sm text-gray-400">
                Each vault card includes a link to view the transaction on the appropriate blockchain explorer.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-1">Cross-Chain Verification</h4>
              <p className="text-sm text-gray-400">
                For vaults with cross-chain security, you can verify the status on multiple blockchains from the vault details page.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VaultExplorer;