/**
 * Cross-Chain Verification and Multi-Signature Test Page
 *
 * This page demonstrates and tests the cross-chain verification and multi-signature functionality
 * of the Chronos Vault platform, allowing users to:
 * 
 * 1. Initiate a cross-chain verification test
 * 2. Test multi-signature processes across chains
 * 3. View verification results and chain-specific details
 */

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { LockKeyhole, Shield, ShieldCheck, RotateCcw, CheckCircle2, XCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useDevMode } from "@/contexts/dev-mode-context";
import { BlockchainType } from "@/types";

// Status colors mapping for visual feedback
const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  verified: "bg-green-100 text-green-800 hover:bg-green-200",
  failed: "bg-red-100 text-red-800 hover:bg-red-200",
  inconsistent: "bg-orange-100 text-orange-800 hover:bg-orange-200",
  timeout: "bg-gray-100 text-gray-800 hover:bg-gray-200"
};

// Interface for verification results
interface VerificationResult {
  requestId: string;
  sourceChain: BlockchainType;
  targetChains: BlockchainType[];
  overallStatus: "verified" | "pending" | "failed" | "inconsistent" | "timeout";
  consistencyScore: number;
  chainResults: Record<BlockchainType, {
    status: string;
    confirmations: number;
    transactionHash?: string;
    errors?: string[];
  }>;
  startTimestamp: number;
  completionTimestamp: number;
  totalExecutionTimeMs: number;
}

// Interface for multi-signature request
interface MultiSigResult {
  crossChainRequestId: string;
  sourceChain: BlockchainType;
  supportedChains: BlockchainType[];
  approvalRequests: Array<{
    chain: BlockchainType;
    requestId: string;
    status: string;
  }>;
  failedChains: BlockchainType[];
  status: "pending" | "approved" | "rejected" | "expired" | "cancelled";
  progress: number;
  chainStatuses?: Record<BlockchainType, {
    status: string;
    receivedSignatures: number;
    requiredSignatures: number;
    progress: number;
  }>;
  completedChains?: BlockchainType[];
  pendingChains?: BlockchainType[];
}

export default function CrossChainTestPage() {
  const { toast } = useToast();
  const { isDevMode } = useDevMode();
  
  // State for verification test
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [transactionId, setTransactionId] = useState<string>("");
  
  // State for multi-signature test
  const [isCreatingMultiSig, setIsCreatingMultiSig] = useState(false);
  const [multiSigResult, setMultiSigResult] = useState<MultiSigResult | null>(null);
  const [isSigningMultiSig, setIsSigningMultiSig] = useState(false);
  const [signatureDetails, setSignatureDetails] = useState<Record<BlockchainType, string>>({
    ETH: "",
    SOL: "",
    TON: "",
    POLYGON: "",
    BTC: ""
  });
  
  // State for details dialog
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedChain, setSelectedChain] = useState<BlockchainType | null>(null);
  
  // Generate a transaction ID for testing
  useEffect(() => {
    // In dev mode, use a predictable but unique ID
    if (isDevMode) {
      setTransactionId(`simulated_cross_chain_tx_${Date.now()}`);
    }
  }, [isDevMode]);
  
  // Function to test cross-chain verification
  const testCrossChainVerification = async () => {
    try {
      setIsVerifying(true);
      setVerificationResult(null);
      
      // Call the API to initiate verification
      const response = await fetch('/api/security/test-cross-chain-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionId,
          sourceChain: 'ETH',
          targetChains: ['SOL', 'TON'],
          requiredConfirmations: {
            ETH: 1,
            SOL: 1,
            TON: 1
          },
          method: 'standard'
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Verification failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      setVerificationResult(result);
      
      // Show appropriate toast based on result
      if (result.overallStatus === 'verified') {
        toast({
          title: 'Verification Successful',
          description: `Cross-chain verification completed with consistency score: ${result.consistencyScore}%`,
          variant: 'success',
        });
      } else if (result.overallStatus === 'pending') {
        toast({
          title: 'Verification Pending',
          description: 'Cross-chain verification is still in progress',
          variant: 'default',
        });
      } else {
        toast({
          title: 'Verification Issues',
          description: `Status: ${result.overallStatus}, Score: ${result.consistencyScore}%`,
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Verification Failed',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsVerifying(false);
    }
  };
  
  // Function to test cross-chain multi-signature
  const testCrossChainMultiSig = async () => {
    try {
      setIsCreatingMultiSig(true);
      setMultiSigResult(null);
      
      // Call the API to create a multi-signature request
      const response = await fetch('/api/security/test-cross-chain-multi-sig', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vaultId: `test-vault-${Date.now()}`,
          creatorId: 'test-user-1',
          sourceChain: 'ETH',
          secondaryChains: ['SOL', 'TON'],
          type: 'withdrawal',
          transactionData: {
            amount: '1.0',
            recipient: '0xSimulatedAddress',
            timestamp: Date.now()
          },
          requiredConfirmations: 2
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Multi-signature request failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      setMultiSigResult(result);
      
      toast({
        title: 'Multi-Signature Request Created',
        description: `Request ID: ${result.crossChainRequestId}`,
        variant: 'success',
      });
    } catch (error: any) {
      toast({
        title: 'Multi-Signature Request Failed',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsCreatingMultiSig(false);
    }
  };
  
  // Function to sign a multi-signature request
  const signMultiSigRequest = async () => {
    if (!multiSigResult) return;
    
    try {
      setIsSigningMultiSig(true);
      
      // Call the API to sign the request
      const response = await fetch('/api/security/test-sign-multi-sig', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          crossChainRequestId: multiSigResult.crossChainRequestId,
          signerAddress: '0xTestSigner',
          signatures: signatureDetails,
          method: 'zero_knowledge'
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Signing failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      // Update the multi-sig result status
      const updatedStatus = await fetchMultiSigStatus(multiSigResult.crossChainRequestId);
      setMultiSigResult(updatedStatus);
      
      toast({
        title: 'Signature Submitted',
        description: `Verified on ${result.verifiedChains.length} chains`,
        variant: 'success',
      });
    } catch (error: any) {
      toast({
        title: 'Signature Failed',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSigningMultiSig(false);
    }
  };
  
  // Function to fetch the current status of a multi-signature request
  const fetchMultiSigStatus = async (requestId: string): Promise<MultiSigResult> => {
    const response = await fetch(`/api/security/multi-sig-status/${requestId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch status: ${response.statusText}`);
    }
    
    return await response.json();
  };
  
  // Function to show chain details dialog
  const showChainDetails = (chain: BlockchainType) => {
    setSelectedChain(chain);
    setShowDetailsDialog(true);
  };
  
  // Function to refresh verification status
  const refreshVerificationStatus = async () => {
    if (!verificationResult) return;
    
    try {
      const response = await fetch(`/api/security/verification-status/${verificationResult.requestId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to refresh status: ${response.statusText}`);
      }
      
      const result = await response.json();
      setVerificationResult(result);
      
      toast({
        title: 'Status Refreshed',
        description: `Current status: ${result.overallStatus}`,
      });
    } catch (error: any) {
      toast({
        title: 'Refresh Failed',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };
  
  // Helper function to get CSS class based on status
  const getStatusClass = (status: string) => {
    return statusColors[status as keyof typeof statusColors] || statusColors.pending;
  };
  
  // Main render
  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
          Cross-Chain Security Testing
        </h1>
        
        {isDevMode && (
          <Alert className="mb-4 bg-amber-50 border-amber-200">
            <ShieldCheck className="h-5 w-5 text-amber-500" />
            <AlertTitle>Development Mode Active</AlertTitle>
            <AlertDescription>
              Running in development mode with simulated blockchain interactions.
              All operations are being performed with test data.
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue="verification" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="verification" className="text-lg">
              <Shield className="mr-2 h-4 w-4" />
              Cross-Chain Verification
            </TabsTrigger>
            <TabsTrigger value="multisig" className="text-lg">
              <LockKeyhole className="mr-2 h-4 w-4" />
              Multi-Signature Security
            </TabsTrigger>
          </TabsList>
          
          {/* Cross-Chain Verification Tab */}
          <TabsContent value="verification" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Test Cross-Chain Verification</CardTitle>
                <CardDescription>
                  Verify a transaction across multiple blockchains to ensure consistency and security.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Transaction ID</p>
                    <div className="relative">
                      <input
                        type="text"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Enter transaction ID"
                        disabled={isDevMode}
                      />
                      {isDevMode && (
                        <div className="absolute right-2 top-2">
                          <Badge variant="outline" className="bg-purple-50 text-purple-700">
                            Auto-generated
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={testCrossChainVerification} 
                    disabled={isVerifying || !transactionId}
                    className="w-full"
                  >
                    {isVerifying ? 'Verifying...' : 'Start Verification Test'}
                  </Button>
                </div>
              </CardContent>
              
              {verificationResult && (
                <CardFooter className="flex flex-col space-y-4 pt-4 border-t">
                  <div className="w-full flex justify-between items-center">
                    <h3 className="font-semibold">Verification Result</h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={refreshVerificationStatus}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Refresh
                    </Button>
                  </div>
                  
                  <div className="w-full space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Status:</span>
                      <Badge className={getStatusClass(verificationResult.overallStatus)}>
                        {verificationResult.overallStatus.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Consistency Score:</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={verificationResult.consistencyScore} className="w-32" />
                        <span>{verificationResult.consistencyScore}%</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Execution Time:</span>
                      <span>{(verificationResult.totalExecutionTimeMs / 1000).toFixed(2)}s</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Chain Results:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {Object.entries(verificationResult.chainResults).map(([chain, result]) => (
                          <Button
                            key={chain}
                            variant="outline"
                            className={`justify-between ${getStatusClass(result.status)}`}
                            onClick={() => showChainDetails(chain as BlockchainType)}
                          >
                            <span>{chain}</span>
                            <span>{result.confirmations} confirms</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
          
          {/* Multi-Signature Tab */}
          <TabsContent value="multisig" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Test Cross-Chain Multi-Signature</CardTitle>
                <CardDescription>
                  Create and manage multi-signature requests across multiple blockchains.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    onClick={testCrossChainMultiSig} 
                    disabled={isCreatingMultiSig}
                    className="w-full"
                  >
                    {isCreatingMultiSig ? 'Creating...' : 'Create Multi-Signature Request'}
                  </Button>
                </div>
              </CardContent>
              
              {multiSigResult && (
                <CardFooter className="flex flex-col space-y-4 pt-4 border-t">
                  <div className="w-full">
                    <h3 className="font-semibold">Multi-Signature Request</h3>
                    <p className="text-sm text-gray-500 break-all">
                      ID: {multiSigResult.crossChainRequestId}
                    </p>
                  </div>
                  
                  <div className="w-full space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Status:</span>
                      <Badge className={getStatusClass(multiSigResult.status)}>
                        {multiSigResult.status.toUpperCase()}
                      </Badge>
                    </div>
                    
                    {multiSigResult.progress !== undefined && (
                      <div className="flex items-center justify-between">
                        <span>Overall Progress:</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={multiSigResult.progress} className="w-32" />
                          <span>{multiSigResult.progress}%</span>
                        </div>
                      </div>
                    )}
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Chain Status:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {multiSigResult.approvalRequests.map((req) => (
                          <div 
                            key={req.chain} 
                            className="p-3 rounded border flex justify-between items-center"
                          >
                            <span>{req.chain}</span>
                            <Badge variant="outline">
                              {req.status.toUpperCase()}
                            </Badge>
                          </div>
                        ))}
                      </div>
                      
                      {multiSigResult.failedChains.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-medium text-red-600">Failed Chains:</h4>
                          <div className="flex space-x-2 mt-2">
                            {multiSigResult.failedChains.map((chain) => (
                              <Badge key={chain} variant="destructive">
                                {chain}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Sign Request:</h4>
                      
                      {multiSigResult.supportedChains.map((chain) => (
                        <div key={chain} className="flex items-center space-x-2">
                          <span className="min-w-20">{chain}:</span>
                          <input
                            type="text"
                            value={signatureDetails[chain] || ''}
                            onChange={(e) => {
                              setSignatureDetails({
                                ...signatureDetails,
                                [chain]: e.target.value
                              });
                            }}
                            className="flex-1 p-2 border rounded text-sm"
                            placeholder={`Enter ${chain} signature`}
                            disabled={isDevMode} // In dev mode, we'll auto-generate
                          />
                        </div>
                      ))}
                      
                      <Button 
                        onClick={signMultiSigRequest} 
                        disabled={isSigningMultiSig}
                        className="w-full mt-4"
                      >
                        {isSigningMultiSig ? 'Signing...' : 'Sign Request'}
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Chain Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedChain} Verification Details
            </DialogTitle>
            <DialogDescription>
              Chain-specific verification results and transaction data.
            </DialogDescription>
          </DialogHeader>
          
          {selectedChain && verificationResult && (
            <div className="space-y-4 py-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Status:</span>
                <Badge className={getStatusClass(verificationResult.chainResults[selectedChain].status)}>
                  {verificationResult.chainResults[selectedChain].status.toUpperCase()}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-medium">Confirmations:</span>
                <span>{verificationResult.chainResults[selectedChain].confirmations}</span>
              </div>
              
              {verificationResult.chainResults[selectedChain].transactionHash && (
                <div className="flex flex-col space-y-1">
                  <span className="font-medium">Transaction Hash:</span>
                  <code className="bg-gray-100 p-2 rounded text-xs break-all">
                    {verificationResult.chainResults[selectedChain].transactionHash}
                  </code>
                </div>
              )}
              
              {verificationResult.chainResults[selectedChain].errors && 
               verificationResult.chainResults[selectedChain].errors!.length > 0 && (
                <div className="flex flex-col space-y-1">
                  <span className="font-medium text-red-600">Errors:</span>
                  <div className="bg-red-50 border border-red-200 rounded p-2">
                    <ul className="list-disc list-inside">
                      {verificationResult.chainResults[selectedChain].errors!.map((error, idx) => (
                        <li key={idx} className="text-xs text-red-700">{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setShowDetailsDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}