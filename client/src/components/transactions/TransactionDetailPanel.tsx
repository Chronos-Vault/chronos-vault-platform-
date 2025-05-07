import React from 'react';
import { CrossChainTransaction, VerificationAttempt } from '@shared/transaction-types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRightLeft, Shield, Clock, CheckCircle2, AlertCircle, AlertTriangle, ArrowUpRight, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { useTransactionMonitoring } from '@/contexts/transaction-monitoring-context';

interface TransactionDetailPanelProps {
  transaction: CrossChainTransaction;
  className?: string;
}

const chainColors = {
  'Ethereum': 'bg-indigo-500/20 text-indigo-500 border-indigo-500/50',
  'Solana': 'bg-purple-500/20 text-purple-500 border-purple-500/50',
  'TON': 'bg-blue-500/20 text-blue-500 border-blue-500/50',
  'Bitcoin': 'bg-amber-500/20 text-amber-500 border-amber-500/50'
};

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

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4 text-amber-500" />;
    case 'confirming':
      return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
    case 'confirmed':
    case 'verified':
    case 'success':
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case 'failed':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case 'timeout':
      return <AlertTriangle className="h-4 w-4 text-purple-500" />;
    default:
      return null;
  }
};

const TransactionDetailPanel: React.FC<TransactionDetailPanelProps> = ({ transaction, className = '' }) => {
  const { verifyTransaction, getTransactionsByCorrelationId, getVerificationAttempts } = useTransactionMonitoring();
  const [verifyingTx, setVerifyingTx] = React.useState(false);
  
  // Get related transactions
  const relatedTransactions = getTransactionsByCorrelationId(transaction.correlationId)
    .filter(tx => tx.id !== transaction.id);
  
  // Get verification attempts
  const verificationAttempts = getVerificationAttempts(transaction.correlationId);
  
  // Handle manual verification
  const handleVerify = async () => {
    setVerifyingTx(true);
    await verifyTransaction(transaction.id);
    setVerifyingTx(false);
  };
  
  return (
    <Card className={`${className}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Badge className={`${chainColors[transaction.network]}`}>
                {transaction.network}
              </Badge>
              {transaction.label || transaction.type.replace('_', ' ')}
            </CardTitle>
            <CardDescription>
              {new Date(transaction.timestamp).toLocaleString()}
            </CardDescription>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge className={`flex items-center gap-1 ${statusColors[transaction.status]}`}>
              {getStatusIcon(transaction.status)}
              {transaction.status}
            </Badge>
            {transaction.verificationStatus !== 'not_required' && (
              <Badge className={`flex items-center gap-1 ${verificationStatusColors[transaction.verificationStatus]}`}>
                {getStatusIcon(transaction.verificationStatus)}
                Verification: {transaction.verificationStatus.replace('_', ' ')}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
            <TabsTrigger value="related">Related Txs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Transaction Hash</h4>
                <div className="font-mono text-sm break-all bg-muted p-2 rounded-md">
                  {transaction.txHash}
                </div>
              </div>
              
              {transaction.blockNumber && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Block Number</h4>
                  <div className="font-mono text-sm bg-muted p-2 rounded-md">
                    {transaction.blockNumber}
                  </div>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">From</h4>
                <div className="font-mono text-sm break-all bg-muted p-2 rounded-md">
                  {transaction.fromAddress}
                </div>
              </div>
              
              {transaction.toAddress && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">To</h4>
                  <div className="font-mono text-sm break-all bg-muted p-2 rounded-md">
                    {transaction.toAddress}
                  </div>
                </div>
              )}
              
              {transaction.amount && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Amount</h4>
                  <div className="font-mono text-sm bg-muted p-2 rounded-md">
                    {transaction.amount} {transaction.symbol || ''}
                  </div>
                </div>
              )}
              
              {transaction.fee && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Fee</h4>
                  <div className="font-mono text-sm bg-muted p-2 rounded-md">
                    {transaction.fee}
                  </div>
                </div>
              )}
              
              {transaction.confirmations !== undefined && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Confirmations</h4>
                  <div className="font-mono text-sm bg-muted p-2 rounded-md">
                    {transaction.confirmations}
                  </div>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Correlation ID</h4>
                <div className="font-mono text-sm break-all bg-muted p-2 rounded-md">
                  {transaction.correlationId}
                </div>
              </div>
            </div>
            
            {transaction.contractAddress && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Contract</h4>
                <div className="font-mono text-sm break-all bg-muted p-2 rounded-md">
                  {transaction.contractAddress}
                </div>
              </div>
            )}
            
            {transaction.securityLevel && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Security Level</h4>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Shield 
                      key={i} 
                      className={`h-5 w-5 ${i < transaction.securityLevel! ? 'text-emerald-500' : 'text-muted-foreground/30'}`} 
                    />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="verification" className="space-y-4 mt-4">
            {transaction.verificationStatus === 'not_required' ? (
              <div className="text-center p-4 border rounded-md bg-muted/50">
                <p className="text-muted-foreground">No verification required for this transaction</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Verification Status</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1"
                    onClick={handleVerify}
                    disabled={verifyingTx || transaction.verificationStatus === 'verified'}
                  >
                    {verifyingTx ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
                    {verifyingTx ? 'Verifying...' : 'Verify'}
                  </Button>
                </div>
                
                <div className="border rounded-md">
                  <div className="p-3 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      {getStatusIcon(transaction.verificationStatus)}
                      {transaction.verificationStatus.replace('_', ' ')}
                    </span>
                    {transaction.verificationTimestamp && (
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(transaction.verificationTimestamp), { addSuffix: true })}
                      </span>
                    )}
                  </div>
                  <Separator />
                  <div className="p-3">
                    <h4 className="text-sm font-medium mb-2">Verified By</h4>
                    {transaction.verifiedBy && transaction.verifiedBy.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {transaction.verifiedBy.map((chain) => (
                          <Badge key={chain} className={chainColors[chain]}>
                            {chain}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Not verified by any chains yet</p>
                    )}
                  </div>
                </div>
                
                <div className="border rounded-md">
                  <div className="p-3">
                    <h4 className="text-sm font-medium mb-2">Verification History</h4>
                    {verificationAttempts.length > 0 ? (
                      <div className="divide-y">
                        {verificationAttempts.map((attempt: VerificationAttempt) => (
                          <div key={attempt.id} className="py-2 first:pt-0 last:pb-0">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                <Badge className={attempt.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                  {getStatusIcon(attempt.status)}
                                  {attempt.status}
                                </Badge>
                                <Badge variant="outline">{attempt.network}</Badge>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(attempt.timestamp), { addSuffix: true })}
                              </span>
                            </div>
                            {attempt.reason && (
                              <p className="text-sm text-muted-foreground mt-1">{attempt.reason}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No verification attempts yet</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="related" className="space-y-4 mt-4">
            {relatedTransactions.length > 0 ? (
              <div className="border rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-2 text-left">Network</th>
                      <th className="p-2 text-left">Type</th>
                      <th className="p-2 text-left">Status</th>
                      <th className="p-2 text-left">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {relatedTransactions.map((related) => (
                      <tr key={related.id}>
                        <td className="p-2">
                          <Badge className={`${chainColors[related.network]}`}>
                            {related.network}
                          </Badge>
                        </td>
                        <td className="p-2">{related.label || related.type.replace('_', ' ')}</td>
                        <td className="p-2">
                          <span className="flex items-center gap-1">
                            {getStatusIcon(related.status)}
                            {related.status}
                          </span>
                        </td>
                        <td className="p-2 text-muted-foreground">
                          {formatDistanceToNow(new Date(related.timestamp), { addSuffix: true })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center p-4 border rounded-md bg-muted/50">
                <p className="text-muted-foreground">No related transactions found</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="sm" className="gap-1">
          <ArrowUpRight className="h-4 w-4" />
          Explorer
        </Button>
        <Button size="sm" className="gap-1">
          <ArrowRightLeft className="h-4 w-4" />
          View Group
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TransactionDetailPanel;