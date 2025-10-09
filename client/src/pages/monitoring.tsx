import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Activity,
  ArrowLeft, 
  BarChart3, 
  CheckCircle, 
  DollarSign,
  ExternalLink, 
  Network, 
  RefreshCw, 
  Search, 
  Shield, 
  Zap,
  ArrowUp,
  ArrowDown,
  Clock,
  XCircle
} from 'lucide-react';
import { useDevMode } from '@/contexts/dev-mode-context';
import { useToast } from '@/hooks/use-toast';
import { useTransactionMonitoring } from '@/contexts/transaction-monitoring-context';
import { FeeMonitoringSystem } from '@/components/cross-chain/FeeMonitoringSystem';
import { MultiChainSecurityVerification } from '@/components/security/MultiChainSecurityVerification';
import { BlockchainType } from '@/lib/cross-chain/interfaces';
import { CrossChainTransaction } from '@shared/transaction-types';
import TransactionStats from '@/components/transactions/TransactionStats';

// Define types for dashboard data
interface ChainStatus {
  name: string;
  type: 'ethereum' | 'solana' | 'ton' | 'bitcoin';
  status: 'online' | 'degraded' | 'offline' | 'unknown';
  latency: number;
  lastBlock: number;
  transactions: number;
  peerCount: number;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'failed';
  lastUpdated: Date;
}

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  let color = '';
  let icon = null;
  
  switch (status.toLowerCase()) {
    case 'confirmed':
      color = 'bg-green-500/10 text-green-500 border-green-500/20';
      icon = <CheckCircle className="h-3 w-3 mr-1" />;
      break;
    case 'failed':
      color = 'bg-red-500/10 text-red-500 border-red-500/20';
      icon = <XCircle className="h-3 w-3 mr-1" />;
      break;
    case 'pending':
      color = 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      icon = <Clock className="h-3 w-3 mr-1" />;
      break;
    case 'verified':
      color = 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      icon = <Shield className="h-3 w-3 mr-1" />;
      break;
    default:
      color = 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  }
  
  return (
    <Badge variant="outline" className={`${color} flex items-center`}>
      {icon}
      {status}
    </Badge>
  );
};

// Direction badge component
const DirectionBadge = ({ direction }: { direction: string }) => {
  if (direction === 'incoming') {
    return (
      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 flex items-center">
        <ArrowDown className="h-3 w-3 mr-1" />
        Incoming
      </Badge>
    );
  } else {
    return (
      <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 flex items-center">
        <ArrowUp className="h-3 w-3 mr-1" />
        Outgoing
      </Badge>
    );
  }
};

// Format blockchain type to display name
const formatBlockchainType = (type: string): string => {
  switch (type.toLowerCase()) {
    case 'ethereum':
      return 'Ethereum';
    case 'solana':
      return 'Solana';
    case 'ton':
      return 'TON';
    case 'bitcoin':
      return 'Bitcoin';
    default:
      return type;
  }
};

// Format amount with appropriate decimals
const formatAmount = (amount: number, blockchain: string): string => {
  switch (blockchain.toLowerCase()) {
    case 'ethereum':
      return amount.toFixed(4) + ' ETH';
    case 'solana':
      return amount.toFixed(2) + ' SOL';
    case 'ton':
      return amount.toFixed(2) + ' TON';
    case 'bitcoin':
      return amount.toFixed(6) + ' BTC';
    default:
      return amount.toString();
  }
};

// Format timestamp
const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString();
};

// Format address to be shorter
const formatAddress = (address: string): string => {
  if (address.length < 12) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

export default function MonitoringPage() {
  const [, setLocation] = useLocation();
  const { devModeEnabled } = useDevMode();
  const { toast } = useToast();
  const { 
    transactions, 
    refreshTransactions,
    loadingTransactions 
  } = useTransactionMonitoring();
  
  const [activeTab, setActiveTab] = useState('network');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBlockchain, setSelectedBlockchain] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  // State for fee monitoring
  const [feeThreshold, setFeeThreshold] = useState(2.0);
  const [transactionAmount, setTransactionAmount] = useState(1000);
  const [selectedChain, setSelectedChain] = useState<BlockchainType | null>(null);
  const [availableChains] = useState<BlockchainType[]>(['ETH', 'SOL', 'TON', 'BTC']);
  
  // State for verification
  const [txHash, setTxHash] = useState('0x7f23c5bd38b3f3402e168cf4133cf05d5be18dcbd0ffb364ae1b66e19c1c0d33');
  const [sourceChain, setSourceChain] = useState<BlockchainType>('ETH');
  const [requiredChains] = useState<BlockchainType[]>(['ETH', 'SOL', 'TON']);
  
  // Fetch chain status from backend API using React Query
  const { data: chainData, isLoading: chainsLoading, refetch: refetchChains } = useQuery<{
    chains: ChainStatus[];
    lastUpdated: string;
  }>({
    queryKey: ['/api/monitoring/chains'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });
  
  const chainStatuses = chainData?.chains || [];
  
  // Load all dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      
      try {
        await refreshTransactions();
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast({
          title: 'Loading Error',
          description: 'Failed to load some dashboard data. Please refresh to try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetchChains();
    await refreshTransactions();
    setIsRefreshing(false);
    
    toast({
      title: 'Data Refreshed',
      description: 'All monitoring data has been updated',
    });
  };
  
  const handleChainSelect = (chain: BlockchainType) => {
    setSelectedChain(chain);
    toast({
      title: "Chain Selected",
      description: `Selected ${chain} for transaction routing`,
      variant: "default",
    });
  };
  
  const handleVerificationSuccess = () => {
    toast({
      title: "Verification Successful",
      description: "Transaction has been verified across all required chains",
      variant: "default",
    });
  };
  
  const handleVerificationError = (error: Error) => {
    toast({
      title: "Verification Failed",
      description: error.message || "Failed to verify transaction across chains",
      variant: "destructive",
    });
  };
  
  // Filter transactions
  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = searchQuery === '' || 
      tx.txHash?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBlockchain = selectedBlockchain === 'all' || tx.blockchain === selectedBlockchain;
    const matchesStatus = selectedStatus === 'all' || tx.status === selectedStatus;
    return matchesSearch && matchesBlockchain && matchesStatus;
  });
  
  const getChainStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-green-500';
      case 'degraded':
        return 'text-yellow-500';
      case 'offline':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };
  
  const getQualityBadge = (quality: string) => {
    switch (quality) {
      case 'excellent':
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Excellent</Badge>;
      case 'good':
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Good</Badge>;
      case 'poor':
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Poor</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Failed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setLocation('/')}
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-[#FF5AF7] to-[#6B00D7] bg-clip-text text-transparent">
              Operations & Monitoring Hub
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Real-time cross-chain monitoring powered by Trinity Protocol
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-[#333]"
          onClick={handleRefresh}
          disabled={isRefreshing}
          data-testid="button-refresh"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-3xl bg-[#1a1a1a] border border-[#333]">
          <TabsTrigger value="network" className="flex items-center gap-2" data-testid="tab-network">
            <Network className="h-4 w-4" />
            Network Health
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2" data-testid="tab-transactions">
            <Activity className="h-4 w-4" />
            Transaction Feed
          </TabsTrigger>
          <TabsTrigger value="verification" className="flex items-center gap-2" data-testid="tab-verification">
            <Shield className="h-4 w-4" />
            Verification
          </TabsTrigger>
          <TabsTrigger value="fees" className="flex items-center gap-2" data-testid="tab-fees">
            <DollarSign className="h-4 w-4" />
            Fee Analytics
          </TabsTrigger>
        </TabsList>

        {/* Network Health Tab */}
        <TabsContent value="network" className="space-y-6" data-testid="content-network">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {chainStatuses.map((chain) => (
              <Card key={chain.type} className="border border-[#333] bg-[#121212]">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">{chain.name}</CardTitle>
                    <Badge className={getChainStatusColor(chain.status)}>
                      {chain.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Latest Block:</span>
                    <span className="font-mono">{chain.lastBlock.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Latency:</span>
                    <span>{chain.latency}ms</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Transactions:</span>
                    <span>{chain.transactions.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Quality:</span>
                    {getQualityBadge(chain.connectionQuality)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Alert className="border-blue-500/20 bg-blue-500/10">
            <Shield className="h-4 w-4 text-blue-500" />
            <AlertTitle className="text-blue-500">Trinity Protocol Active</AlertTitle>
            <AlertDescription className="text-gray-300">
              2-of-3 consensus verification across Ethereum, Solana, and TON networks
            </AlertDescription>
          </Alert>
        </TabsContent>

        {/* Transaction Feed Tab */}
        <TabsContent value="transactions" className="space-y-6" data-testid="content-transactions">
          {/* Transaction Stats */}
          <TransactionStats />
          
          {/* Filters */}
          <Card className="border border-[#333] bg-[#121212]">
            <CardHeader>
              <CardTitle className="text-lg">Filter Transactions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <Input
                  placeholder="Search by hash or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-black border-[#333]"
                  data-testid="input-search"
                />
              </div>
              <Select value={selectedBlockchain} onValueChange={setSelectedBlockchain}>
                <SelectTrigger className="w-[180px] bg-black border-[#333]" data-testid="select-blockchain">
                  <SelectValue placeholder="All Blockchains" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Blockchains</SelectItem>
                  <SelectItem value="Ethereum">Ethereum</SelectItem>
                  <SelectItem value="Solana">Solana</SelectItem>
                  <SelectItem value="TON">TON</SelectItem>
                  <SelectItem value="Bitcoin">Bitcoin</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px] bg-black border-[#333]" data-testid="select-status">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Transaction Table */}
          <Card className="border border-[#333] bg-[#121212]">
            <CardHeader>
              <CardTitle>Live Transactions</CardTitle>
              <CardDescription>
                Showing {filteredTransactions.length} of {transactions.length} transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-[#333]">
                    <TableHead>Transaction</TableHead>
                    <TableHead>Blockchain</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.slice(0, 10).map((tx) => (
                    <TableRow key={tx.id} className="border-[#333]" data-testid={`row-transaction-${tx.id}`}>
                      <TableCell className="font-mono text-sm">
                        {formatAddress(tx.txHash || tx.id)}
                      </TableCell>
                      <TableCell>{formatBlockchainType(tx.blockchain)}</TableCell>
                      <TableCell><DirectionBadge direction={tx.direction} /></TableCell>
                      <TableCell>{formatAmount(tx.amount, tx.blockchain)}</TableCell>
                      <TableCell><StatusBadge status={tx.status} /></TableCell>
                      <TableCell className="text-sm text-gray-400">
                        {formatTimestamp(tx.timestamp)}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" data-testid={`button-view-${tx.id}`}>
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredTransactions.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  No transactions found matching your filters
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Verification Tab */}
        <TabsContent value="verification" className="space-y-6" data-testid="content-verification">
          <MultiChainSecurityVerification
            txHash={txHash}
            vaultId="vault-123"
            sourceChain={sourceChain}
            requiredChains={requiredChains}
            onSuccess={handleVerificationSuccess}
            onError={handleVerificationError}
          />
        </TabsContent>

        {/* Fee Analytics Tab */}
        <TabsContent value="fees" className="space-y-6" data-testid="content-fees">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <FeeMonitoringSystem 
                availableChains={availableChains}
                sourceFunds={transactionAmount}
                feeThreshold={feeThreshold}
                onChainSelect={handleChainSelect}
              />
            </div>

            <div className="space-y-4">
              <Card className="border border-[#333] bg-[#121212]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-[#FF5AF7]" />
                    Transaction Summary
                  </CardTitle>
                  <CardDescription>
                    Estimated costs for your transaction
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Transaction Amount:</span>
                      <span className="font-medium">${transactionAmount.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Selected Chain:</span>
                      <span className="font-medium">
                        {selectedChain || 'None'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Maximum Fee Threshold:</span>
                      <span className="font-medium">${feeThreshold.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
