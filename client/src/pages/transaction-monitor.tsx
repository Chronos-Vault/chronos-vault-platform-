import React, { useState } from 'react';
import { useTransactionMonitoring } from '@/contexts/transaction-monitoring-context';
import { 
  BlockchainNetwork, 
  CrossChainTransaction, 
  TransactionStatus, 
  VerificationStatus 
} from '@shared/transaction-types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  ArrowUpDown, 
  RefreshCw, 
  Search, 
  Shield, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Link as LinkIcon
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const statusColors = {
  'pending': 'bg-amber-500/20 text-amber-500 border-amber-500/50',
  'confirming': 'bg-blue-500/20 text-blue-500 border-blue-500/50',
  'confirmed': 'bg-green-500/20 text-green-500 border-green-500/50',
  'failed': 'bg-red-500/20 text-red-500 border-red-500/50'
};

const verificationStatusColors = {
  'not_required': 'bg-gray-500/20 text-gray-500 border-gray-500/50',
  'pending': 'bg-amber-500/20 text-amber-500 border-amber-500/50',
  'verified': 'bg-emerald-500/20 text-emerald-500 border-emerald-500/50',
  'failed': 'bg-red-500/20 text-red-500 border-red-500/50',
  'timeout': 'bg-purple-500/20 text-purple-500 border-purple-500/50'
};

const chainColors = {
  'Ethereum': 'bg-indigo-500/20 text-indigo-500 border-indigo-500/50',
  'Solana': 'bg-purple-500/20 text-purple-500 border-purple-500/50',
  'TON': 'bg-blue-500/20 text-blue-500 border-blue-500/50',
  'Bitcoin': 'bg-amber-500/20 text-amber-500 border-amber-500/50'
};

const TransactionMonitorPage: React.FC = () => {
  const { 
    transactions, 
    transactionGroups, 
    recentTransactions, 
    pendingTransactions,
    refreshTransactions,
    getMonitoringStatus,
    getTransactionById,
    getTransactionsByCorrelationId,
  } = useTransactionMonitoring();
  
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState<CrossChainTransaction | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [networkFilter, setNetworkFilter] = useState<BlockchainNetwork | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { lastUpdated } = getMonitoringStatus();
  
  // Handle manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshTransactions();
    setIsRefreshing(false);
  };
  
  // Apply filters to transactions
  const filteredTransactions = transactions.filter(tx => {
    // Apply network filter
    if (networkFilter !== 'all' && tx.network !== networkFilter) return false;
    
    // Apply status filter
    if (statusFilter !== 'all' && tx.status !== statusFilter) return false;
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        tx.id.toLowerCase().includes(query) ||
        tx.txHash.toLowerCase().includes(query) ||
        tx.fromAddress.toLowerCase().includes(query) ||
        (tx.toAddress && tx.toAddress.toLowerCase().includes(query)) ||
        tx.correlationId.toLowerCase().includes(query) ||
        (tx.label && tx.label.toLowerCase().includes(query))
      );
    }
    
    return true;
  });
  
  // Format transaction time
  const formatTxTime = (timestamp: number) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };
  
  // Get related transactions
  const getRelatedTransactions = (tx: CrossChainTransaction) => {
    return getTransactionsByCorrelationId(tx.correlationId).filter(t => t.id !== tx.id);
  };
  
  // Get transaction status icon
  const getStatusIcon = (status: TransactionStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'confirming':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'confirmed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };
  
  // Get verification status icon
  const getVerificationIcon = (status: VerificationStatus) => {
    switch (status) {
      case 'not_required':
        return null;
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'verified':
        return <Shield className="h-4 w-4 text-emerald-500" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'timeout':
        return <AlertCircle className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Transaction Monitor</h1>
          <Button onClick={handleRefresh} disabled={isRefreshing} className="flex gap-2 items-center">
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground">
          {lastUpdated ? (
            <p>Last updated: {formatDistanceToNow(new Date(lastUpdated), { addSuffix: true })}</p>
          ) : (
            <p>Monitoring active</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>All Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{transactions.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{pendingTransactions.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Transaction Groups</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{transactionGroups.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Cross-Chain</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {transactionGroups.filter(group => group.verificationTransactions.length > 0).length}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions, addresses or hashes..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={networkFilter} onValueChange={(val) => setNetworkFilter(val as any)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Network" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Networks</SelectItem>
                <SelectItem value="Ethereum">Ethereum</SelectItem>
                <SelectItem value="Solana">Solana</SelectItem>
                <SelectItem value="TON">TON</SelectItem>
                <SelectItem value="Bitcoin">Bitcoin</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val as any)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirming">Confirming</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full md:w-[400px] grid-cols-3">
            <TabsTrigger value="all">All Transactions</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>
          
          <div className="mt-4">
            <TabsContent value="all" className="m-0">
              <TransactionTable 
                transactions={filteredTransactions} 
                onSelectTransaction={setSelectedTransaction} 
              />
            </TabsContent>
            
            <TabsContent value="recent" className="m-0">
              <TransactionTable 
                transactions={recentTransactions} 
                onSelectTransaction={setSelectedTransaction} 
              />
            </TabsContent>
            
            <TabsContent value="pending" className="m-0">
              <TransactionTable 
                transactions={pendingTransactions} 
                onSelectTransaction={setSelectedTransaction} 
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
      
      {selectedTransaction && (
        <TransactionDetail 
          transaction={selectedTransaction} 
          onClose={() => setSelectedTransaction(null)} 
          relatedTransactions={getRelatedTransactions(selectedTransaction)}
        />
      )}
    </div>
  );
};

// Transaction table component
interface TransactionTableProps {
  transactions: CrossChainTransaction[];
  onSelectTransaction: (tx: CrossChainTransaction) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, onSelectTransaction }) => {
  return (
    <div className="rounded-md border">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Network
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Type
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Transaction Hash
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Status
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Verification
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Amount
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Time
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={8} className="h-24 text-center text-muted-foreground">
                  No transactions found
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr 
                  key={tx.id} 
                  onClick={() => onSelectTransaction(tx)}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted cursor-pointer"
                >
                  <td className="p-4 align-middle">
                    <Badge className={`${chainColors[tx.network]}`}>
                      {tx.network}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle">
                    {tx.label || tx.type.replace('_', ' ')}
                  </td>
                  <td className="p-4 align-middle font-mono text-xs">
                    {tx.txHash.substring(0, 8)}...{tx.txHash.substring(tx.txHash.length - 8)}
                  </td>
                  <td className="p-4 align-middle">
                    <Badge className={`flex items-center gap-1 ${statusColors[tx.status]}`}>
                      {getStatusIcon(tx.status)}
                      {tx.status}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle">
                    <Badge className={`flex items-center gap-1 ${verificationStatusColors[tx.verificationStatus]}`}>
                      {getVerificationIcon(tx.verificationStatus)}
                      {tx.verificationStatus.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle">
                    {tx.amount ? `${tx.amount} ${tx.symbol || ''}` : '-'}
                  </td>
                  <td className="p-4 align-middle whitespace-nowrap">
                    {formatDistanceToNow(new Date(tx.timestamp), { addSuffix: true })}
                  </td>
                  <td className="p-4 align-middle">
                    <Button variant="ghost" size="sm" onClick={(e) => {
                      e.stopPropagation();
                      onSelectTransaction(tx);
                    }}>
                      Details
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Transaction detail modal
interface TransactionDetailProps {
  transaction: CrossChainTransaction;
  relatedTransactions: CrossChainTransaction[];
  onClose: () => void;
}

const TransactionDetail: React.FC<TransactionDetailProps> = ({ transaction, relatedTransactions, onClose }) => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card border rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">Transaction Details</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Network</h3>
              <Badge className={`${chainColors[transaction.network]}`}>
                {transaction.network}
              </Badge>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Transaction Type</h3>
              <p>{transaction.label || transaction.type.replace('_', ' ')}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
              <Badge className={`flex items-center gap-1 ${statusColors[transaction.status]}`}>
                {getStatusIcon(transaction.status)}
                {transaction.status}
              </Badge>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Verification</h3>
              <Badge className={`flex items-center gap-1 ${verificationStatusColors[transaction.verificationStatus]}`}>
                {getVerificationIcon(transaction.verificationStatus)}
                {transaction.verificationStatus.replace('_', ' ')}
              </Badge>
            </div>
            
            {transaction.amount && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Amount</h3>
                <p>{transaction.amount} {transaction.symbol || ''}</p>
              </div>
            )}
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Timestamp</h3>
              <p>{new Date(transaction.timestamp).toLocaleString()}</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Transaction Details</h3>
            <div className="grid grid-cols-1 gap-2">
              <div className="bg-muted p-3 rounded-md">
                <h4 className="text-sm font-medium text-muted-foreground">Transaction Hash</h4>
                <p className="font-mono text-sm break-all">{transaction.txHash}</p>
              </div>
              
              <div className="bg-muted p-3 rounded-md">
                <h4 className="text-sm font-medium text-muted-foreground">From Address</h4>
                <p className="font-mono text-sm break-all">{transaction.fromAddress}</p>
              </div>
              
              {transaction.toAddress && (
                <div className="bg-muted p-3 rounded-md">
                  <h4 className="text-sm font-medium text-muted-foreground">To Address</h4>
                  <p className="font-mono text-sm break-all">{transaction.toAddress}</p>
                </div>
              )}
              
              <div className="bg-muted p-3 rounded-md">
                <h4 className="text-sm font-medium text-muted-foreground">Correlation ID</h4>
                <p className="font-mono text-sm break-all">{transaction.correlationId}</p>
              </div>
              
              {transaction.blockNumber && (
                <div className="bg-muted p-3 rounded-md">
                  <h4 className="text-sm font-medium text-muted-foreground">Block Number</h4>
                  <p className="font-mono text-sm">{transaction.blockNumber}</p>
                </div>
              )}
              
              {transaction.confirmations !== undefined && (
                <div className="bg-muted p-3 rounded-md">
                  <h4 className="text-sm font-medium text-muted-foreground">Confirmations</h4>
                  <p className="font-mono text-sm">{transaction.confirmations}</p>
                </div>
              )}
            </div>
          </div>
          
          {relatedTransactions.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Related Transactions</h3>
              <div className="border rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-2 text-left">Network</th>
                      <th className="p-2 text-left">Type</th>
                      <th className="p-2 text-left">Status</th>
                      <th className="p-2 text-left">Hash</th>
                    </tr>
                  </thead>
                  <tbody>
                    {relatedTransactions.map((related) => (
                      <tr key={related.id} className="border-t">
                        <td className="p-2">
                          <Badge className={`${chainColors[related.network]}`}>
                            {related.network}
                          </Badge>
                        </td>
                        <td className="p-2">{related.label || related.type.replace('_', ' ')}</td>
                        <td className="p-2">
                          <Badge className={`flex items-center gap-1 ${statusColors[related.status]}`}>
                            {getStatusIcon(related.status)}
                            {related.status}
                          </Badge>
                        </td>
                        <td className="p-2 font-mono text-xs">
                          {related.txHash.substring(0, 6)}...{related.txHash.substring(related.txHash.length - 6)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button>
              View on Explorer
              <LinkIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionMonitorPage;