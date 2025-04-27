/**
 * ProofVerificationCard Component
 * 
 * This component provides a user interface for generating and verifying
 * cryptographic proofs of vault integrity.
 */

import { useState } from 'react';
import { Check, AlertCircle, Shield, ShieldCheck, RefreshCw, BarChart4, Shield as ShieldIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProofVerification, ProofType, VerificationStatus, ChallengeType } from '@/hooks/use-proof-verification';

interface ProofVerificationCardProps {
  vaultId: number;
  userId: number;
  blockchains?: string[];
}

export function ProofVerificationCard({ vaultId, userId, blockchains = ['TON'] }: ProofVerificationCardProps) {
  const [activeTab, setActiveTab] = useState('merkle');
  const [progress, setProgress] = useState(0);
  
  const {
    generateProof,
    verifyProof,
    proofRecord,
    isGenerating,
    isVerifying,
    error
  } = useProofVerification();

  // Handle proof generation
  const handleGenerateProof = async () => {
    // Start progress animation
    setProgress(0);
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 5;
      });
    }, 300);
    
    // Generate the proof
    const proofType = activeTab as 'merkle' | 'cross-chain';
    await generateProof(vaultId, proofType, proofType === 'cross-chain' ? blockchains : undefined);
    
    // Complete progress animation
    clearInterval(progressInterval);
    setProgress(100);
  };

  // Handle proof verification
  const handleVerifyProof = async () => {
    if (!proofRecord) return;
    
    // Start progress animation
    setProgress(0);
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
    
    // Verify the proof
    await verifyProof(proofRecord.id, userId);
    
    // Complete progress animation
    clearInterval(progressInterval);
    setProgress(100);
  };

  // Render status badge based on verification status
  const renderStatusBadge = () => {
    if (!proofRecord) return null;
    
    switch (proofRecord.status) {
      case VerificationStatus.VERIFIED:
        return <Badge className="bg-green-500 hover:bg-green-600">Verified</Badge>;
      case VerificationStatus.PENDING:
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>;
      case VerificationStatus.FAILED:
        return <Badge className="bg-red-500 hover:bg-red-600">Failed</Badge>;
      case VerificationStatus.EXPIRED:
        return <Badge className="bg-gray-500 hover:bg-gray-600">Expired</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-lg shadow-lg border-primary/20">
      <CardHeader className="bg-gradient-to-br from-purple-600/10 to-blue-600/5 border-b border-primary/10">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-500" />
            Proof of Reservation
          </CardTitle>
          {renderStatusBadge()}
        </div>
        <CardDescription>
          Verify cryptographic proof that your vault assets have not been tampered with.
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-6 py-3 border-b border-border/50">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="merkle" className="text-sm">
              Merkle Proof
            </TabsTrigger>
            <TabsTrigger value="cross-chain" className="text-sm">
              Cross-Chain Proof
            </TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent className="pt-5">
          <TabsContent value="merkle" className="mt-0">
            <div className="space-y-4">
              <div className="text-sm">
                <p>
                  Merkle proof verification uses cryptographic hashing to prove that your vault data 
                  is intact and has not been modified since creation.
                </p>
              </div>
              
              {proofRecord && (
                <div className="rounded-md bg-primary/5 p-3 border border-primary/10">
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    Proof Details
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-muted-foreground">Proof ID:</div>
                    <div className="font-mono">{proofRecord.id.substring(0, 12)}...</div>
                    <div className="text-muted-foreground">Created:</div>
                    <div>{new Date(proofRecord.createdAt).toLocaleString()}</div>
                    <div className="text-muted-foreground">Status:</div>
                    <div className="capitalize">{proofRecord.status}</div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="cross-chain" className="mt-0">
            <div className="space-y-4">
              <div className="text-sm">
                <p>
                  Cross-chain verification provides enhanced security by validating your vault 
                  integrity across multiple blockchains simultaneously.
                </p>
              </div>
              
              {blockchains && blockchains.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {blockchains.map(chain => (
                    <Badge key={chain} variant="outline" className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div> {chain}
                    </Badge>
                  ))}
                </div>
              )}
              
              {proofRecord && proofRecord.proofType === ProofType.CROSS_CHAIN && (
                <div className="rounded-md bg-primary/5 p-3 border border-primary/10">
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <BarChart4 className="w-4 h-4 text-blue-500" />
                    Cross-Chain Verification
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-muted-foreground">Proof ID:</div>
                    <div className="font-mono">{proofRecord.id.substring(0, 12)}...</div>
                    <div className="text-muted-foreground">Chains:</div>
                    <div>{blockchains.join(', ')}</div>
                    <div className="text-muted-foreground">Status:</div>
                    <div className="capitalize">{proofRecord.status}</div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          {isGenerating || isVerifying ? (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span>{isGenerating ? 'Generating proof...' : 'Verifying proof...'}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          ) : null}
          
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Tabs>
      
      <CardFooter className="flex justify-between border-t border-border/50 p-4 bg-muted/20">
        {!proofRecord ? (
          <Button
            onClick={handleGenerateProof}
            disabled={isGenerating}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generating Proof
              </>
            ) : (
              <>
                <ShieldIcon className="mr-2 h-4 w-4" />
                Generate Proof
              </>
            )}
          </Button>
        ) : (
          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              onClick={handleGenerateProof}
              disabled={isGenerating || isVerifying}
              className="flex-1"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              New Proof
            </Button>
            
            <Button
              onClick={handleVerifyProof}
              disabled={isVerifying || proofRecord.status === VerificationStatus.VERIFIED}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Verifying
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Verify
                </>
              )}
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}