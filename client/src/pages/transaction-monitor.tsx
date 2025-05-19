import React, { useState } from 'react';
import { useTransactionMonitoring } from '@/contexts/transaction-monitoring-context';
import TransactionStats from '@/components/transactions/TransactionStats';
import TransactionDetailPanel from '@/components/transactions/TransactionDetailPanel';
import { TransactionGraphCard } from '@/components/transactions/TransactionGraph';
import { CrossChainTransaction } from '@shared/transaction-types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Network, RefreshCw, Search, Filter, CheckCircle, XCircle, Clock, Shield, ExternalLink, ArrowUp, ArrowDown } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  let color = '';
  let icon = null;
  
  switch (status) {
    case 'pending':
      color = 'bg-amber-500/20 text-amber-500 border-amber-500/50';
      icon = <Clock className="h-3 w-3 mr-1" />;
      break;
    case 'confirming':
      color = 'bg-blue-500/20 text-blue-500 border-blue-500/50';
      icon = <RefreshCw className="h-3 w-3 mr-1 animate-spin" />;
      break;
    case 'confirmed':
      color = 'bg-green-500/20 text-green-500 border-green-500/50';
      icon = <CheckCircle className="h-3 w-3 mr-1" />;
      break;
    case 'failed':
      color = 'bg-red-500/20 text-red-500 border-red-500/50';
      icon = <XCircle className="h-3 w-3 mr-1" />;
      break;
    default:
      color = 'bg-gray-500/20 text-gray-500 border-gray-500/50';
  }
  
  return (
    <Badge variant="outline" className={`${color} px-2 py-0.5`}>
      {icon}
      <span className="capitalize">{status}</span>
    </Badge>
  );
};

// Network badge component
const NetworkBadge = ({ network }: { network: string }) => {
  let color = '';
  
  switch (network) {
    case 'Ethereum':
      color = 'bg-indigo-500/20 text-indigo-500 border-indigo-500/50';
      break;
    case 'Solana':
      color = 'bg-purple-500/20 text-purple-500 border-purple-500/50';
      break;
    case 'TON':
      color = 'bg-blue-500/20 text-blue-500 border-blue-500/50';
      break;
    case 'Bitcoin':
      color = 'bg-amber-500/20 text-amber-500 border-amber-500/50';
      break;
    default:
      color = 'bg-gray-500/20 text-gray-500 border-gray-500/50';
  }
  
  return (
    <Badge variant="outline" className={`${color}`}>
      {network}
    </Badge>
  );
};

// Format date helper
const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Format address helper
const formatAddress = (address: string) => {
  if (!address) return '';
  if (address.length < 12) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

import { withTransactionErrorBoundary, useTransactionErrorHandler } from '../components/error-boundary/TransactionErrorBoundary';

const TransactionMonitorPageContent: React.FC = () => {
  // Add error handler hook
  const { handleAsyncError, ErrorDisplay } = useTransactionErrorHandler();
  const { 
    transactions, 
    transactionGroups, 
    refreshTransactions,
    getMonitoringStatus
  } = useTransactionMonitoring();
  
  // Get monitoring status
  const { isMonitoring, lastUpdated } = getMonitoringStatus();
  
  // Set up state for transaction detail view
  const [selectedTransaction, setSelectedTransaction] = useState<CrossChainTransaction | null>(null);
  const [selectedGroup, setSelectedGroup] = useState(transactionGroups[0] || null);
  
  // Set up filtering state
  const [searchQuery, setSearchQuery] = useState('');
  const [networkFilter, setNetworkFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Handle filter change
  const handleSortChange = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  // Apply filters and sorting
  const filteredTransactions = transactions.filter(tx => {
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        tx.id.toLowerCase().includes(query) ||
        tx.txHash.toLowerCase().includes(query) ||
        tx.fromAddress.toLowerCase().includes(query) ||
        (tx.toAddress && tx.toAddress.toLowerCase().includes(query)) ||
        (tx.label && tx.label.toLowerCase().includes(query)) ||
        (tx.type && tx.type.toLowerCase().includes(query))
      );
    }
    
    // Apply network filter
    if (networkFilter !== 'all' && tx.network !== networkFilter) {
      return false;
    }
    
    // Apply status filter
    if (statusFilter !== 'all' && tx.status !== statusFilter) {
      return false;
    }
    
    return true;
  });
  
  // Apply sorting
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    let compareValue = 0;
    
    switch (sortField) {
      case 'timestamp':
        compareValue = a.timestamp - b.timestamp;
        break;
      case 'network':
        compareValue = a.network.localeCompare(b.network);
        break;
      case 'status':
        compareValue = a.status.localeCompare(b.status);
        break;
      case 'type':
        compareValue = a.type.localeCompare(b.type);
        break;
      default:
        compareValue = a.timestamp - b.timestamp;
    }
    
    return sortDirection === 'asc' ? compareValue : -compareValue;
  });
  
  // Handle transaction click
  const handleTransactionClick = (tx: CrossChainTransaction) => {
    setSelectedTransaction(tx);
    
    // Find the group this transaction belongs to
    const group = transactionGroups.find(g => g.id === tx.correlationId);
    if (group) {
      setSelectedGroup(group);
    }
  };
  
  // Handle refresh click
  const handleRefresh = async () => {
    await refreshTransactions();
  };
  
  // Handle refresh click with error handling
  const handleRefreshWithErrorHandling = async () => {
    try {
      await refreshTransactions();
    } catch (error) {
      handleAsyncError(
        error,
        CrossChainErrorCategory.CONNECTION_FAILURE,
        { action: 'refreshTransactions', time: new Date().toISOString() }
      );
    }
  };

  return (
    <div className="container mx-auto py-6 relative z-10 bg-gradient-to-b from-[#121212] to-[#19141E]">
      {/* Display any errors that might occur */}
      {ErrorDisplay}
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Transaction Monitor</h1>
        <p className="text-muted-foreground">
          Track and verify transactions across multiple blockchain networks
        </p>
      </div>
      
      <div className="mb-6">
        <TransactionStats />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border border-[#6B00D7]/20 bg-gradient-to-b from-[#1A1A1A] to-[#121212] shadow-md">
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <CardTitle>Transactions</CardTitle>
                  <CardDescription>
                    {isMonitoring 
                      ? `Auto-refreshing every ${getMonitoringStatus().pollingInterval / 1000}s` 
                      : 'Monitoring paused'}
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-none min-w-[200px]">
                    <Input
                      placeholder="Search transactions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 bg-[#111]/70 text-sm"
                    />
                    <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-muted-foreground" />
                  </div>
                  
                  <div className="flex gap-2">
                    <Select value={networkFilter} onValueChange={setNetworkFilter}>
                      <SelectTrigger className="w-[130px] h-9 text-xs">
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
                    
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[130px] h-9 text-xs">
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
                    
                    <Button size="sm" variant="outline" onClick={handleRefresh}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-[#333]">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#111]/70 hover:bg-[#111]/70">
                      <TableHead 
                        className="text-xs w-[60px] cursor-pointer"
                        onClick={() => handleSortChange('network')}
                      >
                        <div className="flex items-center gap-1">
                          Network
                          {sortField === 'network' && (
                            sortDirection === 'asc' ? 
                            <ArrowUp className="h-3 w-3" /> : 
                            <ArrowDown className="h-3 w-3" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="text-xs">Addresses</TableHead>
                      <TableHead 
                        className="text-xs cursor-pointer"
                        onClick={() => handleSortChange('type')}
                      >
                        <div className="flex items-center gap-1">
                          Type
                          {sortField === 'type' && (
                            sortDirection === 'asc' ? 
                            <ArrowUp className="h-3 w-3" /> : 
                            <ArrowDown className="h-3 w-3" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="text-xs cursor-pointer"
                        onClick={() => handleSortChange('timestamp')}
                      >
                        <div className="flex items-center gap-1">
                          Time
                          {sortField === 'timestamp' && (
                            sortDirection === 'asc' ? 
                            <ArrowUp className="h-3 w-3" /> : 
                            <ArrowDown className="h-3 w-3" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="text-xs cursor-pointer"
                        onClick={() => handleSortChange('status')}
                      >
                        <div className="flex items-center gap-1">
                          Status
                          {sortField === 'status' && (
                            sortDirection === 'asc' ? 
                            <ArrowUp className="h-3 w-3" /> : 
                            <ArrowDown className="h-3 w-3" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="text-xs w-[70px]">Security</TableHead>
                      <TableHead className="text-xs w-[70px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedTransactions.map(tx => (
                      <TableRow 
                        key={tx.id} 
                        className={`hover:bg-[#6B00D7]/5 cursor-pointer ${
                          selectedTransaction?.id === tx.id ? 'bg-[#6B00D7]/10' : ''
                        }`}
                        onClick={() => handleTransactionClick(tx)}
                      >
                        <TableCell>
                          <NetworkBadge network={tx.network} />
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1 text-xs">
                              <span className="text-muted-foreground">From:</span>
                              <span>{formatAddress(tx.fromAddress)}</span>
                            </div>
                            {tx.toAddress && (
                              <div className="flex items-center gap-1 text-xs">
                                <span className="text-muted-foreground">To:</span>
                                <span>{formatAddress(tx.toAddress)}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs">{tx.label || tx.type.replace('_', ' ')}</div>
                          {tx.amount && tx.symbol && (
                            <div className="text-xs text-muted-foreground">{tx.amount} {tx.symbol}</div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-xs">{formatDate(tx.timestamp)}</div>
                          {tx.blockNumber && (
                            <div className="text-xs text-muted-foreground">Block: {tx.blockNumber}</div>
                          )}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={tx.status} />
                          {tx.verificationStatus !== 'not_required' && (
                            <div className="mt-1">
                              <Badge variant="outline" className="px-1 py-0.5 text-xs">
                                <span className="text-[9px]">
                                  {tx.verificationStatus === 'verified' ? (
                                    <span className="text-green-500">Verified</span>
                                  ) : tx.verificationStatus === 'pending' ? (
                                    <span className="text-amber-500">Pending</span>
                                  ) : (
                                    <span className="text-red-500">Failed</span>
                                  )}
                                </span>
                              </Badge>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-[#6B00D7]/10 border-[#6B00D7]/30 text-[#FF5AF7]">
                            <Shield className="h-3 w-3 mr-1" />
                            L{tx.securityLevel || 1}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7"
                              asChild
                            >
                              <a 
                                href={`https://explorer.blockchain.com/tx/${tx.txHash}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {sortedTransactions.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <Search className="h-6 w-6 text-muted-foreground mb-2" />
                            <p className="text-muted-foreground">No transactions found</p>
                            <p className="text-xs text-muted-foreground">Try adjusting your filters</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {lastUpdated && (
                <div className="text-xs text-muted-foreground mt-2 text-right">
                  Last updated: {new Date(lastUpdated).toLocaleTimeString()}
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="mt-6">
            {selectedGroup && (
              <TransactionGraphCard
                transactionGroup={selectedGroup}
                width={800}
                height={400}
                onSelectTransaction={handleTransactionClick}
              />
            )}
          </div>
        </div>
        
        <div>
          {selectedTransaction ? (
            <TransactionDetailPanel transaction={selectedTransaction} />
          ) : (
            <Card className="border border-[#6B00D7]/20 bg-gradient-to-b from-[#1A1A1A] to-[#121212] shadow-md h-full flex flex-col justify-center items-center py-12">
              <div className="flex flex-col items-center p-6 max-w-xs mx-auto text-center">
                <Network className="h-12 w-12 text-[#6B00D7] mb-4" />
                <h3 className="text-xl font-semibold mb-2">Select a Transaction</h3>
                <p className="text-muted-foreground mb-6">
                  Click on any transaction from the table to view detailed information
                </p>
                <p className="text-xs text-muted-foreground">
                  Chronos Vault monitors transactions across multiple blockchains to ensure security and integrity
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionMonitorPage;