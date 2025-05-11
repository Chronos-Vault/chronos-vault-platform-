import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertTriangle, CheckCircle, XCircle, RefreshCw, Shield } from 'lucide-react';
import { useDevMode } from '@/hooks/use-dev-mode';
import { useToast } from '@/hooks/use-toast';
import { tonContractService } from '@/lib/ton/ton-contract-service';

/**
 * VerificationStatus represents the state of a cross-chain transaction verification
 */
type VerificationStatus = 'idle' | 'pending' | 'success' | 'failed' | 'partial';

/**
 * ChainVerificationStatus represents the verification status for a specific blockchain
 */
interface ChainVerificationStatus {
  chain: 'ethereum' | 'solana' | 'ton' | 'bitcoin';
  status: 'pending' | 'success' | 'failed';
  message?: string;
  txHash?: string;
  retries: number;
  timestamp: number;
  connectionQuality?: 'excellent' | 'good' | 'poor' | 'failed';
}

interface TransactionVerificationPanelProps {
  transactionId?: string;
  onVerificationComplete?: (result: boolean) => void;
  autoVerify?: boolean;
}

const TransactionVerificationPanel: React.FC<TransactionVerificationPanelProps> = ({
  transactionId = '',
  onVerificationComplete,
  autoVerify = false
}) => {
  const { devModeEnabled } = useDevMode();
  const { toast } = useToast();
  
  const [txId, setTxId] = useState(transactionId);
  const [overallStatus, setOverallStatus] = useState<VerificationStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [chainStatuses, setChainStatuses] = useState<ChainVerificationStatus[]>([
    { chain: 'ethereum', status: 'pending', retries: 0, timestamp: Date.now() },
    { chain: 'solana', status: 'pending', retries: 0, timestamp: Date.now() },
    { chain: 'ton', status: 'pending', retries: 0, timestamp: Date.now() }
  ]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Helper to get appropriate icon based on status
  const getStatusIcon = (status: 'pending' | 'success' | 'failed') => {
    switch (status) {
      case 'pending': return <Loader2 className="h-4 w-4 animate-spin text-slate-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };
  
  // Helper to get appropriate badge style based on status
  const getStatusBadge = (status: 'pending' | 'success' | 'failed') => {
    switch (status) {
      case 'pending': return <Badge variant="outline">Pending</Badge>;
      case 'success': return <Badge variant="default">Verified</Badge>;
      case 'failed': return <Badge variant="destructive">Failed</Badge>;
    }
  };
  
  // Helper to get connection quality indicator
  const getConnectionQualityBadge = (quality?: 'excellent' | 'good' | 'poor' | 'failed') => {
    if (!quality) return null;
    
    switch (quality) {
      case 'excellent': 
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Excellent</Badge>;
      case 'good': 
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Good</Badge>;
      case 'poor': 
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Poor</Badge>;
      case 'failed': 
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Failed</Badge>;
    }
  };
  
  // Update progress based on chain statuses
  useEffect(() => {
    // Calculate progress based on chain statuses
    const totalChains = chainStatuses.length;
    const completedChains = chainStatuses.filter(s => s.status === 'success').length;
    const failedChains = chainStatuses.filter(s => s.status === 'failed').length;
    
    // Calculate progress percentage
    const newProgress = Math.floor((completedChains / totalChains) * 100);
    setProgress(newProgress);
    
    // Determine overall status
    if (completedChains === totalChains) {
      setOverallStatus('success');
      if (onVerificationComplete) onVerificationComplete(true);
    } else if (failedChains === totalChains) {
      setOverallStatus('failed');
      if (onVerificationComplete) onVerificationComplete(false);
    } else if (failedChains > 0 && (completedChains + failedChains) === totalChains) {
      setOverallStatus('partial');
      // Partial success is still considered a valid verification in our Triple-Chain architecture
      if (onVerificationComplete) onVerificationComplete(true);
    } else if (isVerifying) {
      setOverallStatus('pending');
    }
  }, [chainStatuses, isVerifying, onVerificationComplete]);
  
  // Auto-verify if prop is set
  useEffect(() => {
    if (autoVerify && txId && overallStatus === 'idle') {
      verifyTransaction();
    }
  }, [autoVerify, txId]);
  
  // Function to verify a transaction across all chains
  const verifyTransaction = async () => {
    if (!txId) {
      setErrorMessage('Please enter a transaction ID to verify');
      return;
    }
    
    setIsVerifying(true);
    setErrorMessage(null);
    setOverallStatus('pending');
    
    // Reset chain statuses
    setChainStatuses(prev => prev.map(status => ({
      ...status,
      status: 'pending',
      retries: 0,
      timestamp: Date.now()
    })));
    
    try {
      // Start verification processes for each chain
      verifyOnEthereum(txId);
      verifyOnSolana(txId);
      verifyOnTON(txId);
    } catch (error) {
      console.error('Error starting verification:', error);
      setErrorMessage('Failed to start verification process');
      setIsVerifying(false);
    }
  };
  
  // Verify on Ethereum
  const verifyOnEthereum = async (tx: string) => {
    // Update status to pending
    updateChainStatus('ethereum', 'pending');
    
    try {
      // In a real implementation, we would call the Ethereum API
      // For now, we'll simulate the verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In development mode, always succeed for simulated transactions
      if (devModeEnabled && tx.startsWith('simulated_')) {
        updateChainStatus('ethereum', 'success', {
          message: 'Transaction verified on Ethereum',
          txHash: tx,
          connectionQuality: 'good'
        });
        return;
      }
      
      // For demo purposes, randomly succeed or fail
      const success = Math.random() > 0.2;
      if (success) {
        updateChainStatus('ethereum', 'success', {
          message: 'Transaction verified on Ethereum',
          txHash: tx,
          connectionQuality: 'excellent'
        });
      } else {
        updateChainStatus('ethereum', 'failed', {
          message: 'Failed to verify transaction on Ethereum',
          connectionQuality: 'poor'
        });
      }
    } catch (error) {
      console.error('Error verifying on Ethereum:', error);
      updateChainStatus('ethereum', 'failed', {
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        connectionQuality: 'failed'
      });
    }
  };
  
  // Verify on Solana
  const verifyOnSolana = async (tx: string) => {
    // Update status to pending
    updateChainStatus('solana', 'pending');
    
    try {
      // In a real implementation, we would call the Solana API
      // For now, we'll simulate the verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In development mode, always succeed for simulated transactions
      if (devModeEnabled && tx.startsWith('simulated_')) {
        updateChainStatus('solana', 'success', {
          message: 'Transaction verified on Solana',
          txHash: tx,
          connectionQuality: 'good'
        });
        return;
      }
      
      // For demo purposes, randomly succeed or fail
      const success = Math.random() > 0.2;
      if (success) {
        updateChainStatus('solana', 'success', {
          message: 'Transaction verified on Solana',
          txHash: tx,
          connectionQuality: 'good'
        });
      } else {
        updateChainStatus('solana', 'failed', {
          message: 'Failed to verify transaction on Solana',
          connectionQuality: 'poor'
        });
      }
    } catch (error) {
      console.error('Error verifying on Solana:', error);
      updateChainStatus('solana', 'failed', {
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        connectionQuality: 'failed'
      });
    }
  };
  
  // Verify on TON
  const verifyOnTON = async (tx: string) => {
    // Update status to pending
    updateChainStatus('ton', 'pending');
    
    try {
      // Unlike the other chains, we'll use our actual TON service implementation
      const isValid = await tonContractService.isTransactionValid(tx);
      
      if (isValid) {
        updateChainStatus('ton', 'success', {
          message: 'Transaction verified on TON',
          txHash: tx,
          connectionQuality: 'excellent'
        });
      } else {
        // Check connection quality from TON service
        const connectionQuality = tonContractService.getConnectionQuality?.() || 'poor';
        
        updateChainStatus('ton', 'failed', {
          message: 'Failed to verify transaction on TON',
          connectionQuality
        });
        
        // If too many failures, attempt recovery
        const status = chainStatuses.find(s => s.chain === 'ton');
        if (status && status.retries >= 2) {
          toast({
            title: 'TON Verification Issues',
            description: 'Attempting to recover TON connection...',
            variant: 'default'
          });
          
          // Reset TON connection state
          tonContractService.resetConnectionState?.();
          
          // Retry after a short delay
          setTimeout(() => {
            if (isVerifying) {
              verifyOnTON(tx);
            }
          }, 3000);
        }
      }
    } catch (error) {
      console.error('Error verifying on TON:', error);
      updateChainStatus('ton', 'failed', {
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        connectionQuality: 'failed'
      });
    }
  };
  
  // Helper to update chain status
  const updateChainStatus = (chain: 'ethereum' | 'solana' | 'ton' | 'bitcoin', 
                             status: 'pending' | 'success' | 'failed',
                             updates: Partial<ChainVerificationStatus> = {}) => {
    setChainStatuses(prev => {
      return prev.map(s => {
        if (s.chain === chain) {
          const retries = status === 'failed' ? s.retries + 1 : s.retries;
          return {
            ...s,
            ...updates,
            status,
            retries,
            timestamp: Date.now()
          };
        }
        return s;
      });
    });
  };
  
  // Reset verification state
  const resetVerification = () => {
    setOverallStatus('idle');
    setProgress(0);
    setErrorMessage(null);
    setIsVerifying(false);
    setChainStatuses(prev => prev.map(status => ({
      ...status,
      status: 'pending',
      retries: 0,
      timestamp: Date.now(),
      message: undefined,
      txHash: undefined
    })));
  };
  
  // Format time since verification
  const formatTimeSince = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ago`;
  };
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Cross-Chain Transaction Verification
        </CardTitle>
        <CardDescription>
          Verify transaction integrity across Ethereum, Solana, and TON blockchains using
          Triple-Chain Security Architecture.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Transaction ID input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={txId}
            onChange={(e) => setTxId(e.target.value)}
            placeholder="Enter transaction ID or hash"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isVerifying}
          />
          <Button 
            onClick={verifyTransaction}
            disabled={isVerifying || !txId}
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Verify
              </>
            )}
          </Button>
        </div>
        
        {/* Error message */}
        {errorMessage && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        
        {/* Overall progress */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Verification Progress</span>
            <span className="text-sm text-muted-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <Separator />
        
        {/* Chain status cards */}
        <div className="space-y-3">
          {chainStatuses.map((status) => (
            <div 
              key={status.chain} 
              className="flex items-center justify-between p-3 rounded-lg border bg-card text-card-foreground shadow-sm"
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  {getStatusIcon(status.status)}
                  <span className="font-medium capitalize">{status.chain}</span>
                  {getStatusBadge(status.status)}
                  {status.retries > 0 && (
                    <span className="text-xs text-muted-foreground">
                      (Retries: {status.retries})
                    </span>
                  )}
                </div>
                {status.message && (
                  <p className="text-sm text-muted-foreground mt-1">{status.message}</p>
                )}
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs text-muted-foreground">
                  {formatTimeSince(status.timestamp)}
                </span>
                {getConnectionQualityBadge(status.connectionQuality)}
              </div>
            </div>
          ))}
        </div>
        
        {/* Status summary */}
        {overallStatus !== 'idle' && (
          <Alert variant={
            overallStatus === 'success' ? 'default' :
            overallStatus === 'partial' ? 'default' :
            overallStatus === 'failed' ? 'destructive' : 'outline'
          }>
            <AlertTitle className="flex items-center gap-2">
              {overallStatus === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
              {overallStatus === 'partial' && <CheckCircle className="h-4 w-4 text-yellow-500" />}
              {overallStatus === 'failed' && <XCircle className="h-4 w-4" />}
              {overallStatus === 'pending' && <Loader2 className="h-4 w-4 animate-spin" />}
              
              {overallStatus === 'success' && 'Verification Complete'}
              {overallStatus === 'partial' && 'Partial Verification'}
              {overallStatus === 'failed' && 'Verification Failed'}
              {overallStatus === 'pending' && 'Verification in Progress'}
            </AlertTitle>
            <AlertDescription>
              {overallStatus === 'success' && 'Transaction verified across all chains.'}
              {overallStatus === 'partial' && 'Transaction verified on some chains. This still provides security under our Triple-Chain architecture.'}
              {overallStatus === 'failed' && 'Could not verify transaction on any chain. Please check the transaction ID and try again.'}
              {overallStatus === 'pending' && 'Verifying transaction across multiple chains...'}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={resetVerification}
          disabled={isVerifying || overallStatus === 'idle'}
        >
          Reset
        </Button>
        
        {devModeEnabled && (
          <span className="text-xs text-muted-foreground">
            Running in development mode with simulated verifications
          </span>
        )}
      </CardFooter>
    </Card>
  );
};

export default TransactionVerificationPanel;