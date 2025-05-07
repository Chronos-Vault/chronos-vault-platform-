import React from 'react';
import { useTransactionMonitoring } from '@/contexts/transaction-monitoring-context';
import { CrossChainTransaction } from '@shared/transaction-types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CopyIcon, ExternalLinkIcon, ShieldCheckIcon, RefreshCw, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Network colors for badges
const networkColors = {
  'Ethereum': 'bg-indigo-500/20 text-indigo-500 border-indigo-500/50',
  'Solana': 'bg-purple-500/20 text-purple-500 border-purple-500/50',
  'TON': 'bg-blue-500/20 text-blue-500 border-blue-500/50',
  'Bitcoin': 'bg-amber-500/20 text-amber-500 border-amber-500/50'
};

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

// Property row component
interface PropertyRowProps {
  label: string;
  value: React.ReactNode;
  copyable?: boolean;
  link?: string;
}

const PropertyRow: React.FC<PropertyRowProps> = ({ label, value, copyable, link }) => {
  const handleCopy = () => {
    if (typeof value === 'string') {
      navigator.clipboard.writeText(value);
    }
  };

  return (
    <div className="flex flex-col space-y-1 py-2">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="flex items-center gap-2">
        <div className="text-sm break-all">{value}</div>
        {copyable && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 rounded-full hover:bg-muted"
            onClick={handleCopy}
          >
            <CopyIcon className="h-3 w-3" />
          </Button>
        )}
        {link && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 rounded-full hover:bg-muted"
            asChild
          >
            <a href={link} target="_blank" rel="noopener noreferrer">
              <ExternalLinkIcon className="h-3 w-3" />
            </a>
          </Button>
        )}
      </div>
    </div>
  );
};

interface TransactionDetailPanelProps {
  transaction: CrossChainTransaction;
}

const TransactionDetailPanel: React.FC<TransactionDetailPanelProps> = ({ 
  transaction 
}) => {
  const { verifyTransaction, getVerificationAttempts } = useTransactionMonitoring();
  
  // Format date for better readability
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  
  // Get explorer URL based on network (simplified mock for demo)
  const getExplorerUrl = (network: string, txHash: string) => {
    switch (network) {
      case 'Ethereum':
        return `https://etherscan.io/tx/${txHash}`;
      case 'Solana':
        return `https://explorer.solana.com/tx/${txHash}`;
      case 'TON':
        return `https://tonwhales.com/explorer/transaction/${txHash}`;
      case 'Bitcoin':
        return `https://mempool.space/tx/${txHash}`;
      default:
        return '#';
    }
  };
  
  // Handle verify transaction
  const handleVerifyTransaction = async () => {
    await verifyTransaction(transaction.id);
  };
  
  // Get verification attempts for this transaction
  const verificationAttempts = getVerificationAttempts(transaction.correlationId);
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{transaction.label || transaction.type.replace('_', ' ')}</CardTitle>
            <CardDescription>Transaction Details</CardDescription>
          </div>
          <div className="flex flex-col items-end">
            <Badge className={networkColors[transaction.network]}>
              {transaction.network}
            </Badge>
            <span className="text-xs text-muted-foreground mt-1">
              Security Level {transaction.securityLevel || 1}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs defaultValue="details">
          <TabsList className="w-full">
            <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
            <TabsTrigger value="verification" className="flex-1">Verification</TabsTrigger>
            <TabsTrigger value="json" className="flex-1">JSON</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="p-6 space-y-6">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <Badge 
                  variant={
                    transaction.status === 'confirmed' ? 'default' : 
                    transaction.status === 'failed' ? 'destructive' : 
                    'outline'
                  }
                  className="px-3 py-1 text-xs"
                >
                  {getStatusIcon(transaction.status)}
                  <span className="ml-1">{transaction.status}</span>
                </Badge>
                
                {transaction.verificationStatus !== 'not_required' && (
                  <Badge 
                    variant={
                      transaction.verificationStatus === 'verified' ? 'default' : 
                      transaction.verificationStatus === 'failed' ? 'destructive' : 
                      'outline'
                    }
                    className="px-3 py-1 text-xs"
                  >
                    {getVerificationIcon(transaction.verificationStatus)}
                    <span className="ml-1">Verification: {transaction.verificationStatus}</span>
                  </Badge>
                )}
              </div>
              
              {transaction.verificationStatus === 'pending' && transaction.securityLevel && transaction.securityLevel > 1 && (
                <Button 
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full gap-2 border-dashed"
                  onClick={handleVerifyTransaction}
                >
                  <ShieldCheckIcon className="h-4 w-4 text-[#FF5AF7]" />
                  <span>Verify on {transaction.network === 'Ethereum' ? 'Solana' : 'Ethereum'}</span>
                </Button>
              )}
            </div>
            
            <Separator />
            
            <div className="space-y-0">
              <PropertyRow 
                label="Transaction Hash" 
                value={transaction.txHash} 
                copyable
                link={getExplorerUrl(transaction.network, transaction.txHash)}
              />
              <PropertyRow 
                label="From Address" 
                value={transaction.fromAddress} 
                copyable
              />
              {transaction.toAddress && (
                <PropertyRow 
                  label="To Address" 
                  value={transaction.toAddress} 
                  copyable
                />
              )}
              {transaction.contractAddress && (
                <PropertyRow 
                  label="Contract Address" 
                  value={transaction.contractAddress} 
                  copyable
                />
              )}
              <PropertyRow 
                label="Timestamp" 
                value={formatDate(transaction.timestamp)} 
              />
              {transaction.amount && transaction.symbol && (
                <PropertyRow 
                  label="Amount" 
                  value={`${transaction.amount} ${transaction.symbol}`} 
                />
              )}
              {transaction.fee && (
                <PropertyRow 
                  label="Fee" 
                  value={`${transaction.fee} ${transaction.symbol || getNetworkCurrency(transaction.network)}`} 
                />
              )}
              {transaction.blockNumber && (
                <PropertyRow 
                  label="Block Number" 
                  value={transaction.blockNumber} 
                />
              )}
              {transaction.confirmations && (
                <PropertyRow 
                  label="Confirmations" 
                  value={transaction.confirmations} 
                />
              )}
              <PropertyRow 
                label="Correlation ID" 
                value={transaction.correlationId} 
                copyable
              />
            </div>
          </TabsContent>
          
          <TabsContent value="verification" className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Verification Status</h3>
                <div className="p-3 rounded-md bg-[#1A1A1A]">
                  <div className="flex items-center justify-between">
                    <span>
                      Status: <span className={
                        transaction.verificationStatus === 'verified' ? 'text-green-500' :
                        transaction.verificationStatus === 'failed' ? 'text-red-500' :
                        transaction.verificationStatus === 'pending' ? 'text-amber-500' :
                        'text-muted-foreground'
                      }>
                        {transaction.verificationStatus}
                      </span>
                    </span>
                    {getVerificationIcon(transaction.verificationStatus)}
                  </div>
                  
                  {transaction.verificationTimestamp && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Verified at: {formatDate(transaction.verificationTimestamp)}
                    </div>
                  )}
                  
                  {transaction.verifiedBy && transaction.verifiedBy.length > 0 && (
                    <div className="mt-2">
                      <span className="text-xs text-muted-foreground">Verified by:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {transaction.verifiedBy.map(network => (
                          <Badge 
                            key={network}
                            variant="outline"
                            className={networkColors[network]}
                          >
                            {network}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {verificationAttempts.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Verification History</h3>
                  <ScrollArea className="h-[250px]">
                    <div className="space-y-2">
                      {verificationAttempts.map(attempt => (
                        <div 
                          key={attempt.id}
                          className="p-3 rounded-md bg-[#1A1A1A] border border-[#333]"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <Badge 
                                variant={attempt.status === 'success' ? 'default' : 'destructive'}
                                className="px-2 py-0 text-xs"
                              >
                                {attempt.status === 'success' ? 
                                  <CheckCircle className="h-3 w-3 mr-1" /> : 
                                  <XCircle className="h-3 w-3 mr-1" />
                                }
                                {attempt.status}
                              </Badge>
                              <div className="mt-1">
                                <span className="text-xs text-muted-foreground">
                                  Verification on {attempt.network}
                                </span>
                              </div>
                            </div>
                            <Badge 
                              variant="outline" 
                              className={networkColors[attempt.network]}
                            >
                              {attempt.network}
                            </Badge>
                          </div>
                          
                          <div className="text-xs text-muted-foreground mt-2">
                            {formatDate(attempt.timestamp)}
                          </div>
                          
                          {attempt.reason && (
                            <div className="mt-2 text-xs p-2 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                              {attempt.reason}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
              
              {transaction.securityLevel && transaction.securityLevel > 1 && transaction.verificationStatus !== 'verified' && (
                <Button 
                  variant="outline"
                  className="w-full gap-2 bg-[#6B00D7]/10 border-[#6B00D7]/30 hover:bg-[#6B00D7]/20"
                  onClick={handleVerifyTransaction}
                >
                  <ShieldCheckIcon className="h-4 w-4 text-[#FF5AF7]" />
                  <span>Verify on {transaction.network === 'Ethereum' ? 'Solana' : 'Ethereum'}</span>
                </Button>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="json" className="p-0">
            <ScrollArea className="h-[500px]">
              <pre className="p-4 text-xs font-mono whitespace-pre-wrap bg-[#1A1A1A] rounded-b-md text-gray-300">
                {JSON.stringify(transaction, null, 2)}
              </pre>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="bg-[#1A1A1A]/50 p-4 border-t border-[#6B00D7]/10">
        <div className="w-full flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              Transaction Type: {transaction.type}
            </span>
            <span className="text-xs text-muted-foreground">
              ID: {transaction.id.substring(0, 8)}...
            </span>
          </div>
          <div className="flex justify-between items-center">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-xs h-7 px-2 text-indigo-400"
              asChild
            >
              <a href={getExplorerUrl(transaction.network, transaction.txHash)} target="_blank" rel="noopener noreferrer">
                <ExternalLinkIcon className="h-3 w-3 mr-1" />
                View on Explorer
              </a>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-xs h-7 px-2"
              onClick={() => navigator.clipboard.writeText(transaction.txHash)}
            >
              <CopyIcon className="h-3 w-3 mr-1" />
              Copy Tx Hash
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

// Helper to get currency symbol for a blockchain network
function getNetworkCurrency(network: string): string {
  switch (network) {
    case 'Ethereum':
      return 'ETH';
    case 'Solana':
      return 'SOL';
    case 'TON':
      return 'TON';
    case 'Bitcoin':
      return 'BTC';
    default:
      return 'CRYPTO';
  }
}

export default TransactionDetailPanel;