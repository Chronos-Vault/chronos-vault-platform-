import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Shield, XCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { BlockchainType } from '@/lib/cross-chain/interfaces';
import { apiRequest } from '@/lib/queryClient';
import { Loader2 } from 'lucide-react';

export interface MultiChainSecurityVerificationProps {
  vaultId: string;
  txHash: string;
  sourceChain: BlockchainType;
  requiredChains: BlockchainType[];
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export type VerificationStatus = 'pending' | 'verified' | 'failed' | 'inconsistent' | 'timeout';
export type VerificationMethod = 'standard' | 'deep' | 'zero-knowledge' | 'quantum-resistant';

interface ChainVerificationResult {
  chain: BlockchainType;
  status: VerificationStatus;
  confirmations: number;
  progress: number;
  details?: any;
}

interface VerificationResult {
  requestId: string;
  status: VerificationStatus;
  progress: number;
  chainResults: Record<BlockchainType, ChainVerificationResult>;
  consistencyScore: number;
  completedChains: BlockchainType[];
  pendingChains: BlockchainType[];
  method: VerificationMethod;
  errors?: string[];
  timestamp: number;
}

export function MultiChainSecurityVerification({
  vaultId,
  txHash,
  sourceChain,
  requiredChains,
  onSuccess,
  onError
}: MultiChainSecurityVerificationProps) {
  const [verificationMethod, setVerificationMethod] = useState<VerificationMethod>('standard');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  // Calculate time left for verification (60 seconds max)
  const getTimeLeft = (startTime: number) => {
    const elapsed = (Date.now() - startTime) / 1000;
    const timeLeft = Math.max(0, 60 - elapsed);
    return timeLeft.toFixed(0);
  };

  const handleVerification = async () => {
    setIsVerifying(true);
    setVerificationResult(null);
    
    try {
      const result = await apiRequest('POST', '/api/security/verify-transaction', {
        vaultId,
        txHash,
        sourceChain,
        targetChains: requiredChains.filter(chain => chain !== sourceChain),
        method: verificationMethod
      });
      
      const data = await result.json();
      
      setVerificationResult({
        requestId: data.requestId,
        status: data.overallStatus,
        progress: data.progress || 0,
        chainResults: data.chainStatuses || {},
        consistencyScore: data.consistencyScore || 0,
        completedChains: data.completedChains || [],
        pendingChains: data.pendingChains || [],
        method: verificationMethod,
        errors: data.errors,
        timestamp: Date.now()
      });
      
      if (data.overallStatus === 'verified' && onSuccess) {
        onSuccess();
      } else if (data.overallStatus === 'failed' && onError) {
        onError(new Error('Verification failed'));
      }
    } catch (error) {
      console.error('Verification failed:', error);
      if (onError) onError(error);
    } finally {
      setIsVerifying(false);
    }
  };

  // Get status icon based on verification status
  const getStatusIcon = (status: VerificationStatus) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'inconsistent':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case 'timeout':
        return <Clock className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  // Get status text and color
  const getStatusDisplay = (status: VerificationStatus) => {
    switch (status) {
      case 'verified':
        return { text: 'Verified', color: 'text-green-500' };
      case 'pending':
        return { text: 'Pending', color: 'text-yellow-500' };
      case 'failed':
        return { text: 'Failed', color: 'text-red-500' };
      case 'inconsistent':
        return { text: 'Inconsistent', color: 'text-orange-500' };
      case 'timeout':
        return { text: 'Timeout', color: 'text-red-500' };
      default:
        return { text: 'Unknown', color: 'text-gray-500' };
    }
  };

  return (
    <Card className="w-full shadow-xl border border-[#6B00D7]/20 bg-gradient-to-br from-black/60 to-[#6B00D7]/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl bg-gradient-to-r from-white to-[#FF5AF7] bg-clip-text text-transparent">
          Cross-Chain Security Verification
        </CardTitle>
        <CardDescription>
          Verify transaction security across multiple blockchains
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Verification Details</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span className="text-gray-400">Vault ID:</span>
                <span className="font-mono">
                  {vaultId && vaultId.length > 16 
                    ? `${vaultId.substring(0, 8)}...${vaultId.substring(vaultId.length - 8)}`
                    : vaultId || 'N/A'}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Transaction:</span>
                <span className="font-mono">
                  {txHash && txHash.length > 16 
                    ? `${txHash.substring(0, 8)}...${txHash.substring(txHash.length - 8)}`
                    : txHash || 'N/A'}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Source Chain:</span>
                <span>{sourceChain}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Required Chains:</span>
                <span>{requiredChains.join(', ')}</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Verification Method</h3>
            <Tabs defaultValue="standard" value={verificationMethod} onValueChange={(value) => setVerificationMethod(value as VerificationMethod)}>
              <TabsList className="grid grid-cols-2 mb-2">
                <TabsTrigger value="standard">Standard</TabsTrigger>
                <TabsTrigger value="deep">Advanced</TabsTrigger>
              </TabsList>
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="zero-knowledge">Zero-Knowledge</TabsTrigger>
                <TabsTrigger value="quantum-resistant">Quantum-Safe</TabsTrigger>
              </TabsList>
              
              <TabsContent value="standard" className="mt-2">
                <p className="text-xs text-gray-400">Standard verification confirms transaction validity across chains.</p>
              </TabsContent>
              <TabsContent value="deep" className="mt-2">
                <p className="text-xs text-gray-400">Deep verification performs detailed analysis of transaction effects.</p>
              </TabsContent>
              <TabsContent value="zero-knowledge" className="mt-2">
                <p className="text-xs text-gray-400">Zero-knowledge verification validates without revealing sensitive details.</p>
              </TabsContent>
              <TabsContent value="quantum-resistant" className="mt-2">
                <p className="text-xs text-gray-400">Quantum-resistant verification uses post-quantum cryptography algorithms.</p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {verificationResult && (
          <>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(verificationResult.status)}
                  <span className={`font-medium ${getStatusDisplay(verificationResult.status).color}`}>
                    {getStatusDisplay(verificationResult.status).text}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-400">Consistency: </span>
                  <span className={verificationResult.consistencyScore > 80 ? 'text-green-500' : 
                                   verificationResult.consistencyScore > 50 ? 'text-yellow-500' : 'text-red-500'}>
                    {verificationResult.consistencyScore}%
                  </span>
                </div>
              </div>
              
              <Progress 
                value={verificationResult.progress} 
                className="h-2 bg-gray-800"
                style={{
                  '--progress-background': verificationResult.status === 'verified' ? '#10B981' : 
                                          verificationResult.status === 'pending' ? '#F59E0B' : 
                                          verificationResult.status === 'inconsistent' ? '#F97316' : '#EF4444'
                } as React.CSSProperties}
              />
              
              {verificationResult.status === 'pending' && (
                <div className="text-xs text-center mt-1 text-gray-400">
                  Time remaining: {getTimeLeft(verificationResult.timestamp)}s
                </div>
              )}
            </div>
            
            <div className="space-y-2 mt-4">
              <h3 className="text-sm font-medium">Chain Results</h3>
              <div className="space-y-2">
                {Object.entries(verificationResult.chainResults).map(([chain, result]) => (
                  <div 
                    key={chain}
                    className="flex items-center justify-between p-2 bg-black/30 rounded-md border border-[#6B00D7]/20"
                  >
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(result.status as VerificationStatus)}
                      <span className="mr-1">{chain}:</span>
                      <span className={getStatusDisplay(result.status as VerificationStatus).color}>
                        {getStatusDisplay(result.status as VerificationStatus).text}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className="text-xs">
                        <span className="text-gray-400">Confirmations: </span>
                        {result.confirmations}
                      </span>
                      <Progress 
                        value={result.progress} 
                        className="w-16 h-1.5 bg-gray-800"
                        style={{
                          '--progress-background': result.status === 'verified' ? '#10B981' : 
                                                  result.status === 'pending' ? '#F59E0B' : 
                                                  result.status === 'inconsistent' ? '#F97316' : '#EF4444'
                        } as React.CSSProperties}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {verificationResult.errors && verificationResult.errors.length > 0 && (
              <Alert className="bg-red-900/20 border-red-900/30">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertTitle className="text-red-400">Verification Errors</AlertTitle>
                <AlertDescription className="text-xs mt-2">
                  <ul className="list-disc pl-4 space-y-1">
                    {verificationResult.errors.map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90 transition-opacity"
          onClick={handleVerification} 
          disabled={isVerifying}
        >
          {isVerifying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <Shield className="mr-2 h-4 w-4" />
              Verify Transaction
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}