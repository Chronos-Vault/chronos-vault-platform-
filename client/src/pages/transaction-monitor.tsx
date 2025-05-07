import React, { useState, useEffect } from 'react';
import { useTransactionMonitoring } from '@/contexts/transaction-monitoring-context';
import { CrossChainTransaction, TransactionGroup } from '@shared/transaction-types';
import TransactionStats from '@/components/transactions/TransactionStats';
import { TransactionGraphCard } from '@/components/transactions/TransactionGraph';
import TransactionDetailPanel from '@/components/transactions/TransactionDetailPanel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  RefreshCw, 
  Search, 
  ArrowUpDown, 
  Filter, 
  BarChart3, 
  Network, 
  History, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  XCircle 
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

// Status icon helper function
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4 text-amber-500" />;
    case 'confirming':
      return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
    case 'confirmed':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'failed':
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return null;
  }
};

// Verification status icon helper function
const getVerificationIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4 text-amber-500" />;
    case 'verified':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'failed':
      return <XCircle className="h-4 w-4 text-red-500" />;
    case 'timeout':
      return <AlertTriangle className="h-4 w-4 text-purple-500" />;
    case 'not_required':
      return null;
    default:
      return null;
  }
};

// Network colors for badges
const networkColors = {
  'Ethereum': 'bg-indigo-500/20 text-indigo-500 border-indigo-500/50',
  'Solana': 'bg-purple-500/20 text-purple-500 border-purple-500/50',
  'TON': 'bg-blue-500/20 text-blue-500 border-blue-500/50',
  'Bitcoin': 'bg-amber-500/20 text-amber-500 border-amber-500/50'
};

// Transaction list item component
interface TransactionListItemProps {
  transaction: CrossChainTransaction;
  isSelected: boolean;
  onClick: () => void;
}

const TransactionListItem: React.FC<TransactionListItemProps> = ({ 
  transaction, 
  isSelected, 
  onClick 
}) => {
  return (
    <div 
      className={`p-3 border-b cursor-pointer hover:bg-accent/50 ${isSelected ? 'bg-primary/10' : ''}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{transaction.label || transaction.type.replace('_', ' ')}</span>
            <Badge className={`${networkColors[transaction.network]}`}>
              {transaction.network}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {new Date(transaction.timestamp).toLocaleString()}
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1">
            {getStatusIcon(transaction.status)}
            <span className="text-sm">{transaction.status}</span>
          </div>
          {transaction.verificationStatus !== 'not_required' && (
            <div className="flex items-center gap-1 mt-1">
              {getVerificationIcon(transaction.verificationStatus)}
              <span className="text-xs text-muted-foreground">
                {transaction.verificationStatus}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="mt-1 font-mono text-xs text-muted-foreground break-all">
        {transaction.txHash.substring(0, 12)}...{transaction.txHash.substring(transaction.txHash.length - 8)}
      </div>
    </div>
  );
};

// Transaction group list item component
interface TransactionGroupListItemProps {
  group: TransactionGroup;
  isSelected: boolean;
  onClick: () => void;
}

const TransactionGroupListItem: React.FC<TransactionGroupListItemProps> = ({
  group,
  isSelected,
  onClick
}) => {
  const primaryTx = group.primaryTransaction;
  const verificationCount = group.verificationTransactions.length;
  
  return (
    <div 
      className={`p-3 border-b cursor-pointer hover:bg-accent/50 ${isSelected ? 'bg-primary/10' : ''}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{primaryTx.label || primaryTx.type.replace('_', ' ')}</span>
            <Badge className={`${networkColors[primaryTx.network]}`}>
              {primaryTx.network}
            </Badge>
            {verificationCount > 0 && (
              <Badge variant="outline" className="bg-slate-500/10">
                {verificationCount} verifications
              </Badge>
            )}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {new Date(primaryTx.timestamp).toLocaleString()}
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1">
            {getStatusIcon(group.status)}
            <span className="text-sm">{group.status}</span>
          </div>
          <div className="mt-1">
            <Badge variant="outline" className="text-xs">
              Level {group.securityLevel}
            </Badge>
          </div>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {group.verificationTransactions.map(tx => (
          <Badge 
            key={tx.id} 
            variant="outline" 
            className={`text-xs ${networkColors[tx.network]}`}
          >
            {tx.network} {getStatusIcon(tx.status)}
          </Badge>
        ))}
      </div>
    </div>
  );
};

const TransactionMonitorPage: React.FC = () => {
  const { 
    transactions,
    transactionGroups,
    refreshTransactions,
    getMonitoringStatus,
    getTransactionGroup
  } = useTransactionMonitoring();
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [networkFilter, setNetworkFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  
  // Get the selected transaction and group
  const selectedTransaction = selectedTxId 
    ? transactions.find(tx => tx.id === selectedTxId) 
    : null;
    
  const selectedGroup = selectedGroupId 
    ? transactionGroups.find(g => g.id === selectedGroupId) 
    : selectedTransaction?.correlationId 
      ? getTransactionGroup(selectedTransaction.correlationId) 
      : null;
  
  // Filter transactions based on search query and filters
  const filteredTransactions = transactions.filter(tx => {
    // Search filter
    if (searchQuery && 
        !tx.txHash.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !tx.fromAddress.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !(tx.toAddress && tx.toAddress.toLowerCase().includes(searchQuery.toLowerCase())) &&
        !(tx.label && tx.label.toLowerCase().includes(searchQuery.toLowerCase())) &&
        !tx.type.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Network filter
    if (networkFilter && tx.network !== networkFilter) {
      return false;
    }
    
    // Status filter
    if (statusFilter && tx.status !== statusFilter) {
      return false;
    }
    
    return true;
  });
  
  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === 'newest') {
      return b.timestamp - a.timestamp;
    } else {
      return a.timestamp - b.timestamp;
    }
  });
  
  // Filter and sort groups
  const filteredGroups = transactionGroups.filter(group => {
    // Network filter
    if (networkFilter && 
        group.primaryTransaction.network !== networkFilter && 
        !group.verificationTransactions.some(tx => tx.network === networkFilter)) {
      return false;
    }
    
    // Status filter
    if (statusFilter && group.status !== statusFilter) {
      return false;
    }
    
    // Search query
    if (searchQuery) {
      const matchesPrimary = 
        group.primaryTransaction.txHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.primaryTransaction.fromAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (group.primaryTransaction.toAddress && group.primaryTransaction.toAddress.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (group.primaryTransaction.label && group.primaryTransaction.label.toLowerCase().includes(searchQuery.toLowerCase())) ||
        group.primaryTransaction.type.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesVerification = group.verificationTransactions.some(tx => 
        tx.txHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.fromAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tx.toAddress && tx.toAddress.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (tx.label && tx.label.toLowerCase().includes(searchQuery.toLowerCase())) ||
        tx.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      if (!matchesPrimary && !matchesVerification) {
        return false;
      }
    }
    
    return true;
  });
  
  // Sort groups
  const sortedGroups = [...filteredGroups].sort((a, b) => {
    if (sortBy === 'newest') {
      return b.createdAt - a.createdAt;
    } else {
      return a.createdAt - b.createdAt;
    }
  });
  
  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshTransactions();
    setIsRefreshing(false);
  };
  
  // Auto-refresh effect
  useEffect(() => {
    const monitoringStatus = getMonitoringStatus();
    if (monitoringStatus.isMonitoring) {
      // Just a visual indicator for auto-refresh happening in the background
      const timer = setInterval(() => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 500);
      }, monitoringStatus.pollingInterval);
      
      return () => clearInterval(timer);
    }
  }, [getMonitoringStatus]);
  
  // If a transaction is selected but no group is selected, try to get its group
  useEffect(() => {
    if (selectedTransaction && !selectedGroup && selectedTransaction.correlationId) {
      const group = getTransactionGroup(selectedTransaction.correlationId);
      if (group) {
        setSelectedGroupId(group.id);
      }
    }
  }, [selectedTransaction, selectedGroup, getTransactionGroup]);
  
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Transaction Monitor</h1>
          <p className="text-muted-foreground mt-1">
            Track and verify cross-chain transactions across the Chronos Vault network
          </p>
        </div>
        <Button 
          onClick={handleRefresh} 
          disabled={isRefreshing}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <TransactionStats className="mb-6" />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <Tabs defaultValue="groups">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="groups" className="gap-2">
                  <Network className="h-4 w-4" />
                  Transaction Groups
                </TabsTrigger>
                <TabsTrigger value="transactions" className="gap-2">
                  <History className="h-4 w-4" />
                  All Transactions
                </TabsTrigger>
                <TabsTrigger value="visualization" className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Visualization
                </TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <ArrowUpDown className="h-4 w-4" />
                  {sortBy === 'newest' ? 'Newest' : 'Oldest'}
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Search by transaction hash, address, or type..." 
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant={networkFilter === null ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setNetworkFilter(null)}
                >
                  All Networks
                </Badge>
                <Badge 
                  variant={networkFilter === 'Ethereum' ? 'default' : 'outline'}
                  className={`cursor-pointer ${networkFilter !== 'Ethereum' ? networkColors['Ethereum'] : ''}`}
                  onClick={() => setNetworkFilter('Ethereum')}
                >
                  Ethereum
                </Badge>
                <Badge 
                  variant={networkFilter === 'Solana' ? 'default' : 'outline'}
                  className={`cursor-pointer ${networkFilter !== 'Solana' ? networkColors['Solana'] : ''}`}
                  onClick={() => setNetworkFilter('Solana')}
                >
                  Solana
                </Badge>
                <Badge 
                  variant={networkFilter === 'TON' ? 'default' : 'outline'}
                  className={`cursor-pointer ${networkFilter !== 'TON' ? networkColors['TON'] : ''}`}
                  onClick={() => setNetworkFilter('TON')}
                >
                  TON
                </Badge>
                <Badge 
                  variant={networkFilter === 'Bitcoin' ? 'default' : 'outline'}
                  className={`cursor-pointer ${networkFilter !== 'Bitcoin' ? networkColors['Bitcoin'] : ''}`}
                  onClick={() => setNetworkFilter('Bitcoin')}
                >
                  Bitcoin
                </Badge>
                
                <Separator orientation="vertical" className="h-6 mx-2" />
                
                <Badge 
                  variant={statusFilter === null ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setStatusFilter(null)}
                >
                  All Statuses
                </Badge>
                <Badge 
                  variant={statusFilter === 'pending' ? 'default' : 'outline'}
                  className="cursor-pointer bg-amber-500/20 text-amber-500 border-amber-500/50"
                  onClick={() => setStatusFilter('pending')}
                >
                  <Clock className="h-3 w-3 mr-1" />
                  Pending
                </Badge>
                <Badge 
                  variant={statusFilter === 'confirming' ? 'default' : 'outline'}
                  className="cursor-pointer bg-blue-500/20 text-blue-500 border-blue-500/50"
                  onClick={() => setStatusFilter('confirming')}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Confirming
                </Badge>
                <Badge 
                  variant={statusFilter === 'confirmed' ? 'default' : 'outline'}
                  className="cursor-pointer bg-green-500/20 text-green-500 border-green-500/50"
                  onClick={() => setStatusFilter('confirmed')}
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Confirmed
                </Badge>
                <Badge 
                  variant={statusFilter === 'failed' ? 'default' : 'outline'}
                  className="cursor-pointer bg-red-500/20 text-red-500 border-red-500/50"
                  onClick={() => setStatusFilter('failed')}
                >
                  <XCircle className="h-3 w-3 mr-1" />
                  Failed
                </Badge>
              </div>
            </div>
            
            <TabsContent value="groups" className="mt-0">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-lg">Transaction Groups ({sortedGroups.length})</CardTitle>
                  <CardDescription>Cross-chain transaction groups with primary and verification transactions</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[600px]">
                    {sortedGroups.length > 0 ? (
                      <div className="border-t">
                        {sortedGroups.map(group => (
                          <TransactionGroupListItem 
                            key={group.id}
                            group={group}
                            isSelected={selectedGroupId === group.id}
                            onClick={() => {
                              setSelectedGroupId(group.id);
                              setSelectedTxId(group.primaryTransaction.id);
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-muted-foreground">
                        No transaction groups found matching your filters
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="transactions" className="mt-0">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-lg">All Transactions ({sortedTransactions.length})</CardTitle>
                  <CardDescription>Individual blockchain transactions across all supported networks</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[600px]">
                    {sortedTransactions.length > 0 ? (
                      <div className="border-t">
                        {sortedTransactions.map(transaction => (
                          <TransactionListItem 
                            key={transaction.id}
                            transaction={transaction}
                            isSelected={selectedTxId === transaction.id}
                            onClick={() => {
                              setSelectedTxId(transaction.id);
                              setSelectedGroupId(null);
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-muted-foreground">
                        No transactions found matching your filters
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="visualization" className="mt-0">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-lg">Transaction Visualization</CardTitle>
                  <CardDescription>
                    Visual representation of transaction flows across blockchain networks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {selectedGroup ? (
                      <TransactionGraphCard 
                        transactionGroup={selectedGroup}
                        onSelectTransaction={(tx) => setSelectedTxId(tx.id)}
                        width={700}
                        height={400}
                      />
                    ) : (
                      <div className="text-center p-12 bg-muted/30 rounded-md space-y-3">
                        <Network className="h-16 w-16 mx-auto text-muted-foreground/50" />
                        <div>
                          <h3 className="text-lg font-medium">No Transaction Group Selected</h3>
                          <p className="text-muted-foreground">
                            Select a transaction group to visualize cross-chain relationships
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            if (sortedGroups.length > 0) {
                              setSelectedGroupId(sortedGroups[0].id);
                              setSelectedTxId(sortedGroups[0].primaryTransaction.id);
                            }
                          }}
                          disabled={sortedGroups.length === 0}
                        >
                          Select Latest Group
                        </Button>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <Card>
                        <CardHeader className="py-3">
                          <CardTitle className="text-sm">Network Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[200px] flex items-center justify-center">
                            <div className="text-muted-foreground text-sm">
                              Network distribution visualization will appear here
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="py-3">
                          <CardTitle className="text-sm">Verification Success Rate</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[200px] flex items-center justify-center">
                            <div className="text-muted-foreground text-sm">
                              Verification success rate chart will appear here
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="lg:col-span-4">
          {selectedTransaction ? (
            <TransactionDetailPanel transaction={selectedTransaction} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Transaction Details</CardTitle>
                <CardDescription>Select a transaction to view details</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <History className="h-16 w-16 mb-4 text-muted-foreground/50" />
                <p>Select a transaction from the list to view its details</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    if (transactions.length > 0) {
                      setSelectedTxId(transactions[0].id);
                    }
                  }}
                  disabled={transactions.length === 0}
                >
                  View Latest Transaction
                </Button>
              </CardContent>
            </Card>
          )}
          
          {selectedGroup && (
            <Card className="mt-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Transaction Group</CardTitle>
                <CardDescription>Cross-chain verification status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-sm mb-1">Primary Transaction</h3>
                    <div className="bg-muted p-3 rounded-md">
                      <div className="flex justify-between">
                        <Badge className={networkColors[selectedGroup.primaryTransaction.network]}>
                          {selectedGroup.primaryTransaction.network}
                        </Badge>
                        <Badge variant={
                          selectedGroup.primaryTransaction.status === 'confirmed' ? 'default' : 
                          selectedGroup.primaryTransaction.status === 'failed' ? 'destructive' : 
                          'outline'
                        }>
                          {getStatusIcon(selectedGroup.primaryTransaction.status)}
                          {selectedGroup.primaryTransaction.status}
                        </Badge>
                      </div>
                      <div className="font-mono text-xs mt-2 break-all">
                        {selectedGroup.primaryTransaction.txHash}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-sm mb-1">Verification Transactions ({selectedGroup.verificationTransactions.length})</h3>
                    <div className="space-y-2">
                      {selectedGroup.verificationTransactions.length > 0 ? (
                        selectedGroup.verificationTransactions.map(tx => (
                          <div 
                            key={tx.id} 
                            className="bg-muted p-3 rounded-md cursor-pointer hover:bg-muted/80"
                            onClick={() => setSelectedTxId(tx.id)}
                          >
                            <div className="flex justify-between">
                              <Badge className={networkColors[tx.network]}>
                                {tx.network}
                              </Badge>
                              <Badge variant={
                                tx.status === 'confirmed' ? 'default' : 
                                tx.status === 'failed' ? 'destructive' : 
                                'outline'
                              }>
                                {getStatusIcon(tx.status)}
                                {tx.status}
                              </Badge>
                            </div>
                            <div className="font-mono text-xs mt-2 break-all">
                              {tx.txHash}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center p-4 border rounded-md">
                          <p className="text-muted-foreground text-sm">No verification transactions</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-sm mb-1">Security Level</h3>
                    <RadioGroup defaultValue={selectedGroup.securityLevel.toString()} disabled>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1" id="level-1" />
                        <Label htmlFor="level-1">Level 1 - Basic Time Lock</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="2" id="level-2" />
                        <Label htmlFor="level-2">Level 2 - Cross-Chain Verification</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="3" id="level-3" />
                        <Label htmlFor="level-3">Level 3 - Multi-Signature Security</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionMonitorPage;