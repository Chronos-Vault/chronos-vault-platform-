/**
 * Cross-Chain Proof Verification Component
 * 
 * This component provides an interface for verifying zero-knowledge proofs across
 * multiple blockchains, enhancing the security through the Triple-Chain architecture.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { getPrivacyLayerService } from '@/lib/privacy';
import { BlockchainType } from '@/lib/cross-chain/interfaces';
import { Loader2, Check, AlertTriangle, ShieldCheck, LockKeyhole } from 'lucide-react';

interface CrossChainProofVerificationProps {
  proofId?: string;
  className?: string;
}

export function CrossChainProofVerification({ proofId: initialProofId, className }: CrossChainProofVerificationProps) {
  const [proofId, setProofId] = useState(initialProofId || '');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResults, setVerificationResults] = useState<{
    ethereum?: { isValid: boolean; details?: string };
    solana?: { isValid: boolean; details?: string };
    ton?: { isValid: boolean; details?: string };
    crossChainConsistency: boolean;
    overallResult: boolean;
  } | null>(null);
  const { toast } = useToast();

  const handleVerify = async () => {
    if (!proofId.trim()) {
      toast({
        title: 'Missing Proof ID',
        description: 'Please enter a valid proof ID to verify',
        variant: 'destructive'
      });
      return;
    }

    setIsVerifying(true);
    setVerificationResults(null);

    try {
      const privacyService = getPrivacyLayerService();
      const zkProofService = privacyService.getZkProofService();
      
      // Retrieve the proof first
      const proof = await zkProofService.getProof(proofId.trim());
      
      if (!proof) {
        throw new Error('Proof not found');
      }

      // Verify on each blockchain
      const results = {
        ethereum: undefined as any,
        solana: undefined as any,
        ton: undefined as any,
        crossChainConsistency: false,
        overallResult: false
      };

      // Run verification on Ethereum
      try {
        results.ethereum = await privacyService.verifyProofOnBlockchain(proofId, 'ETH' as BlockchainType);
      } catch (error: any) {
        results.ethereum = { isValid: false, details: `Error: ${error.message}` };
      }

      // Run verification on Solana
      try {
        results.solana = await privacyService.verifyProofOnBlockchain(proofId, 'SOL' as BlockchainType);
      } catch (error: any) {
        results.solana = { isValid: false, details: `Error: ${error.message}` };
      }

      // Run verification on TON
      try {
        results.ton = await privacyService.verifyProofOnBlockchain(proofId, 'TON' as BlockchainType);
      } catch (error: any) {
        results.ton = { isValid: false, details: `Error: ${error.message}` };
      }

      // Calculate cross-chain consistency
      // At least 2 chains must agree for consistency
      const validResults = [
        results.ethereum?.isValid,
        results.solana?.isValid,
        results.ton?.isValid
      ].filter(Boolean).length;

      results.crossChainConsistency = validResults >= 2;

      // Overall result requires cross-chain consistency
      results.overallResult = results.crossChainConsistency && validResults > 0;

      setVerificationResults(results);
      
      toast({
        title: results.overallResult ? 'Proof Verified' : 'Verification Failed',
        description: results.overallResult 
          ? 'Zero-knowledge proof successfully verified across multiple chains' 
          : 'The proof could not be verified on multiple chains',
        variant: results.overallResult ? 'default' : 'destructive'
      });

    } catch (error: any) {
      console.error('Error during cross-chain verification:', error);
      toast({
        title: 'Verification Error',
        description: error.message || 'An unknown error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const getStatusBadge = (result?: { isValid: boolean }) => {
    if (!result) return (
      <Badge variant="outline" className="bg-muted text-muted-foreground">
        Not Verified
      </Badge>
    );

    return result.isValid ? (
      <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
        <Check className="h-3 w-3 mr-1" />
        Verified
      </Badge>
    ) : (
      <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20">
        <AlertTriangle className="h-3 w-3 mr-1" />
        Failed
      </Badge>
    );
  };

  return (
    <Card className={`border-border ${className || ''}`}>
      <CardHeader className="bg-gradient-to-r from-[#6B00D7]/5 to-[#FF5AF7]/5">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ShieldCheck className="h-5 w-5 text-[#FF5AF7]" />
          Cross-Chain Proof Verification
        </CardTitle>
        <CardDescription>
          Verify proofs across multiple blockchains for enhanced security
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="proofId">Proof ID</Label>
            <div className="flex gap-2">
              <Input
                id="proofId"
                value={proofId}
                onChange={(e) => setProofId(e.target.value)}
                placeholder="Enter the proof ID to verify"
                className="flex-1"
              />
              <Button 
                onClick={handleVerify} 
                disabled={isVerifying}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Verifying...
                  </>
                ) : (
                  <>Verify</>                  
                )}
              </Button>
            </div>
          </div>

          {verificationResults && (
            <div className="mt-6 space-y-4">
              <div className={`p-4 rounded-md ${verificationResults.overallResult ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                <div className="flex items-center gap-2">
                  {verificationResults.overallResult ? (
                    <ShieldCheck className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  )}
                  <div>
                    <h3 className={`font-medium ${verificationResults.overallResult ? 'text-green-500' : 'text-red-500'}`}>
                      {verificationResults.overallResult ? 'Cross-Chain Verification Successful' : 'Cross-Chain Verification Failed'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {verificationResults.overallResult 
                        ? 'The proof has been verified across multiple blockchains' 
                        : 'The proof could not be verified consistently across chains'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/30 p-4 rounded-md">
                <h4 className="font-medium mb-4">Verification Results by Chain</h4>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#6B00D7]/10 flex items-center justify-center">
                        <span className="text-xs font-bold text-[#6B00D7]">ETH</span>
                      </div>
                      <span>Ethereum</span>
                    </div>
                    {getStatusBadge(verificationResults.ethereum)}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#9242FC]/10 flex items-center justify-center">
                        <span className="text-xs font-bold text-[#9242FC]">SOL</span>
                      </div>
                      <span>Solana</span>
                    </div>
                    {getStatusBadge(verificationResults.solana)}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#FF5AF7]/10 flex items-center justify-center">
                        <span className="text-xs font-bold text-[#FF5AF7]">TON</span>
                      </div>
                      <span>TON</span>
                    </div>
                    {getStatusBadge(verificationResults.ton)}
                  </div>

                  <div className="h-px bg-border my-2"></div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <LockKeyhole className="h-4 w-4 text-foreground" />
                      <span className="font-medium">Cross-Chain Consistency</span>
                    </div>
                    {verificationResults.crossChainConsistency ? (
                      <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                        <Check className="h-3 w-3 mr-1" />
                        Consistent
                      </Badge>
                    ) : (
                      <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Inconsistent
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="bg-muted/30 px-6 py-3 text-xs text-muted-foreground flex justify-between">
        <span>Triple-Chain Security Architecture</span>
        <span>Requires 2/3 chain verification for consistency</span>
      </CardFooter>
    </Card>
  );
}
