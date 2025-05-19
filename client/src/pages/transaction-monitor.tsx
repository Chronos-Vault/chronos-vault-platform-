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
  return \`\${address.substring(0, 6)}...\${address.substring(address.length - 4)}\`;
};

const TransactionMonitorPage: React.FC = () => {
  const { 
    transactions, 
    transactionGroups, 
    refreshTransactions,
    loadingTransactions 
  } = useTransactionMonitoring();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBlockchain, setSelectedBlockchain] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDirection, setSelectedDirection] = useState<string>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<CrossChainTransaction | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>('all');
  
  // Filter transactions based on search and filters
  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = 
      tx.txHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.fromAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.toAddress.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesBlockchain = selectedBlockchain === 'all' || tx.blockchain.toLowerCase() === selectedBlockchain.toLowerCase();
    const matchesStatus = selectedStatus === 'all' || tx.status.toLowerCase() === selectedStatus.toLowerCase();
    const matchesDirection = selectedDirection === 'all' || tx.direction.toLowerCase() === selectedDirection.toLowerCase();
    
    return matchesSearch && matchesBlockchain && matchesStatus && matchesDirection;
  });
  
  // Get transactions for selected group in tab view
  const getTransactionsForTab = (tabId: string) => {
    if (tabId === 'all') {
      return filteredTransactions;
    } else {
      return transactions.filter(tx => tx.groupId === tabId);
    }
  };

  // Handle row click to select transaction
  const handleTransactionClick = (tx: CrossChainTransaction) => {
    setSelectedTransaction(tx);
  };
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setSelectedTab(value);
    setSelectedTransaction(null);
  };
  
  // Handle refresh button click
  const handleRefresh = async () => {
    try {
      await refreshTransactions();
    } catch (error) {
      console.error("Error refreshing transactions:", error);
    }
  };
  
  return (
    <div className="container mx-auto py-6 relative z-10 bg-gradient-to-b from-[#121212] to-[#19141E]">
      
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
            <CardHeader className="pb-0">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle>Transaction List</CardTitle>
                <div className="flex flex-wrap gap-2">
                  <div className="relative w-full md:w-auto">
                    <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-gray-500" />
                    <Input 
                      placeholder="Search by hash or address"
                      className="pl-8 w-full md:w-60 bg-black/20"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="bg-black/20 border-gray-800"
                    onClick={handleRefresh}
                    disabled={loadingTransactions}
                  >
                    <RefreshCw className={`h-4 w-4 ${loadingTransactions ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <Select value={selectedBlockchain} onValueChange={setSelectedBlockchain}>
                  <SelectTrigger className="w-32 bg-black/20 border-gray-800">
                    <SelectValue placeholder="Chain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Chains</SelectItem>
                    <SelectItem value="ethereum">Ethereum</SelectItem>
                    <SelectItem value="solana">Solana</SelectItem>
                    <SelectItem value="ton">TON</SelectItem>
                    <SelectItem value="bitcoin">Bitcoin</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-32 bg-black/20 border-gray-800">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedDirection} onValueChange={setSelectedDirection}>
                  <SelectTrigger className="w-32 bg-black/20 border-gray-800">
                    <SelectValue placeholder="Direction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Directions</SelectItem>
                    <SelectItem value="incoming">Incoming</SelectItem>
                    <SelectItem value="outgoing">Outgoing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            
            <CardContent className="pt-4 overflow-hidden">
              <Tabs value={selectedTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="w-full bg-black/20 p-0 h-10 overflow-x-auto flex-nowrap">
                  <TabsTrigger value="all" className="flex-1">All Transactions</TabsTrigger>
                  {transactionGroups.map(group => (
                    <TabsTrigger key={group.id} value={group.id} className="flex-1">
                      {group.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                <TabsContent value={selectedTab} className="mt-2">
                  <ScrollArea className="h-[460px] pr-4">
                    <Table>
                      <TableHeader className="bg-black/10">
                        <TableRow>
                          <TableHead>Transaction</TableHead>
                          <TableHead>Chain</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Direction</TableHead>
                          <TableHead>Time</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getTransactionsForTab(selectedTab).length > 0 ? (
                          getTransactionsForTab(selectedTab).map(tx => (
                            <TableRow 
                              key={tx.txHash} 
                              className={`cursor-pointer hover:bg-[#6B00D7]/10 ${selectedTransaction?.txHash === tx.txHash ? 'bg-[#6B00D7]/20' : ''}`}
                              onClick={() => handleTransactionClick(tx)}
                            >
                              <TableCell>
                                <div className="font-mono text-xs">
                                  {formatAddress(tx.txHash)}
                                </div>
                              </TableCell>
                              <TableCell>
                                {formatBlockchainType(tx.blockchain)}
                              </TableCell>
                              <TableCell>
                                {formatAmount(tx.amount, tx.blockchain)}
                              </TableCell>
                              <TableCell>
                                <StatusBadge status={tx.status} />
                              </TableCell>
                              <TableCell>
                                <DirectionBadge direction={tx.direction} />
                              </TableCell>
                              <TableCell className="text-xs">
                                {formatTimestamp(tx.timestamp)}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                              {loadingTransactions ? (
                                <div className="flex flex-col items-center">
                                  <RefreshCw className="h-6 w-6 animate-spin text-[#6B00D7] mb-2" />
                                  <p>Loading transactions...</p>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center">
                                  <p>No transactions found</p>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="mt-2"
                                    onClick={handleRefresh}
                                  >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Refresh
                                  </Button>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <TransactionGraphCard />
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