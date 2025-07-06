import React from 'react';
import { CrossChainTransaction } from '@shared/transaction-types';
import { useTransactionMonitoring } from '@/contexts/transaction-monitoring-context';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Activity,
  AlertTriangle,
  ArrowRightLeft,
  CheckCircle,
  Clock,
  Copy,
  ExternalLink,
  RefreshCw,
  Shield,
  XCircle,
} from 'lucide-react';

interface TransactionDetailPanelProps {
  transaction: CrossChainTransaction;
}

const TransactionDetailPanel: React.FC<TransactionDetailPanelProps> = ({ transaction }) => {
  const { getRelatedTransactions, refreshTransaction } = useTransactionMonitoring();
  
  // Get related transactions
  const relatedTransactions = getRelatedTransactions(transaction.correlationId || '');
  
  // Format address for display
  const formatAddress = (address: string) => {
    if (!address) return '';
    if (address.length < 12) return address;
    return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`;
  };
  
  // Format amount with currency
  const formatAmount = (amount?: string | number, symbol?: string) => {
    if (!amount) return 'N/A';
    return `${amount} ${symbol || ''}`;
  };
  
  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    });
  };
  
  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };
  
  // Get status icon
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
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };
  
  // Get verification status color
  const getVerificationStatusClass = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-500/10 text-green-500 border-green-500/30';
      case 'pending':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
      case 'failed':
        return 'bg-red-500/10 text-red-500 border-red-500/30';
      case 'not_required':
        return 'bg-gray-500/10 text-gray-500 border-gray-500/30';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/30';
    }
  };
  
  // Get network color
  const getNetworkColor = (network: string) => {
    switch (network) {
      case 'Ethereum':
        return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/30';
      case 'Solana':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/30';
      case 'TON':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
      case 'Bitcoin':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/30';
    }
  };
  
  // Handle refresh
  const handleRefresh = async () => {
    await refreshTransaction(transaction.id);
  };
  
  // Get explorer URL based on network
  const getExplorerUrl = (txHash: string, network: string) => {
    switch (network) {
      case 'Ethereum':
        return `https://etherscan.io/tx/${txHash}`;
      case 'Solana':
        return `https://explorer.solana.com/tx/${txHash}`;
      case 'TON':
        return `https://tonscan.org/tx/${txHash}`;
      case 'Bitcoin':
        return `https://mempool.space/tx/${txHash}`;
      default:
        return `https://explorer.blockchain.com/tx/${txHash}`;
    }
  };
  
  return (
    <Card className="border border-[#6B00D7]/20 bg-gradient-to-b from-[#1A1A1A] to-[#121212] shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex gap-2 items-center">
              <Badge variant="outline" className={`${getNetworkColor(transaction.network)}`}>
                {transaction.network}
              </Badge>
              <span>{transaction.label || transaction.type.replace('_', ' ')}</span>
            </CardTitle>
            <CardDescription>
              {transaction.description || 'Transaction details'}
            </CardDescription>
          </div>
          <Button size="sm" variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid grid-cols-3 mb-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="related">Related ({relatedTransactions.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(transaction.status)}
                  <span className="capitalize">{transaction.status}</span>
                </div>
              </div>
              
              <Separator className="bg-[#333]" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Transaction Hash</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono">{formatAddress(transaction.txHash)}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6" 
                    onClick={() => copyToClipboard(transaction.txHash)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6"
                    asChild
                  >
                    <a 
                      href={getExplorerUrl(transaction.txHash, transaction.network)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </div>
              
              <Separator className="bg-[#333]" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">From</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono">{formatAddress(transaction.fromAddress)}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6" 
                    onClick={() => copyToClipboard(transaction.fromAddress)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              {transaction.toAddress && (
                <>
                  <Separator className="bg-[#333]" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">To</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono">{formatAddress(transaction.toAddress)}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        onClick={() => copyToClipboard(transaction.toAddress)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
              
              {transaction.amount && (
                <>
                  <Separator className="bg-[#333]" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Amount</span>
                    <span>{formatAmount(transaction.amount, transaction.symbol)}</span>
                  </div>
                </>
              )}
              
              <Separator className="bg-[#333]" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Timestamp</span>
                <span className="text-sm">{formatDate(transaction.timestamp)}</span>
              </div>
              
              {transaction.blockNumber && (
                <>
                  <Separator className="bg-[#333]" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Block Number</span>
                    <span>{transaction.blockNumber}</span>
                  </div>
                </>
              )}
              
              {transaction.fee && (
                <>
                  <Separator className="bg-[#333]" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Transaction Fee</span>
                    <span>{formatAmount(transaction.fee, transaction.feeCurrency || transaction.symbol)}</span>
                  </div>
                </>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Security Level</span>
                <Badge variant="outline" className="bg-[#6B00D7]/10 border-[#6B00D7]/30 text-[#FF5AF7]">
                  <Shield className="h-3 w-3 mr-1" />
                  Level {transaction.securityLevel || 1}
                </Badge>
              </div>
              
              <Separator className="bg-[#333]" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Verification Status</span>
                <Badge 
                  variant="outline" 
                  className={getVerificationStatusClass(transaction.verificationStatus || 'not_required')}
                >
                  {transaction.verificationStatus === 'verified' ? (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  ) : transaction.verificationStatus === 'pending' ? (
                    <Clock className="h-3 w-3 mr-1" />
                  ) : transaction.verificationStatus === 'failed' ? (
                    <XCircle className="h-3 w-3 mr-1" />
                  ) : (
                    <span className="h-3 w-3 mr-1" />
                  )}
                  {transaction.verificationStatus === 'not_required' 
                    ? 'Not Required' 
                    : transaction.verificationStatus?.charAt(0).toUpperCase() + transaction.verificationStatus?.slice(1)}
                </Badge>
              </div>
              
              {transaction.verifiedAt && (
                <>
                  <Separator className="bg-[#333]" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Verified At</span>
                    <span className="text-sm">{formatDate(transaction.verifiedAt)}</span>
                  </div>
                </>
              )}
              
              {transaction.verifierAddress && (
                <>
                  <Separator className="bg-[#333]" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Verifier</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono">{formatAddress(transaction.verifierAddress)}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        onClick={() => copyToClipboard(transaction.verifierAddress)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
              
              {transaction.confirmations !== undefined && (
                <>
                  <Separator className="bg-[#333]" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Confirmations</span>
                    <span>{transaction.confirmations}</span>
                  </div>
                </>
              )}
              
              {transaction.securityNotes && (
                <>
                  <Separator className="bg-[#333]" />
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Security Notes</span>
                    <p className="text-xs bg-[#1A1A1A] p-2 rounded-md border border-[#333]">
                      {transaction.securityNotes}
                    </p>
                  </div>
                </>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="related" className="space-y-4">
            {relatedTransactions.length > 0 ? (
              <div className="space-y-3">
                {relatedTransactions.map(tx => (
                  <div 
                    key={tx.id}
                    className={`p-3 rounded-lg border ${
                      tx.id === transaction.id 
                        ? 'border-[#6B00D7] bg-[#6B00D7]/10' 
                        : 'border-[#333] hover:border-[#6B00D7]/50 hover:bg-[#1A1A1A] cursor-pointer'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`${getNetworkColor(tx.network)}`}>
                          {tx.network}
                        </Badge>
                        <span className="text-sm">{tx.label || tx.type.replace('_', ' ')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(tx.status)}
                        <span className="text-xs capitalize">{tx.status}</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{formatDate(tx.timestamp)}</span>
                      {tx.amount && (
                        <span>{formatAmount(tx.amount, tx.symbol)}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <ArrowRightLeft className="h-8 w-8 text-[#6B00D7]/50 mx-auto mb-2" />
                <p className="text-muted-foreground">No related transactions found</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="justify-between border-t border-[#333] pt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Activity className="h-3 w-3" />
          <span>Transaction ID: {transaction.id.substring(0, 8)}...</span>
        </div>
        <div>
          {transaction.correlationId && (
            <span>Group: {transaction.correlationId.substring(0, 8)}...</span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default TransactionDetailPanel;