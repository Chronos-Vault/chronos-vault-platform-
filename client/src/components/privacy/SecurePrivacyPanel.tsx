/**
 * Secure Privacy Panel
 * 
 * This component showcases the integration between the Zero-Knowledge Privacy Layer
 * and the Triple-Chain Security architecture, allowing users to create and verify
 * proofs with different security levels.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ZkProofType } from '@/lib/privacy';
import { getPrivacySecurityConnector, PrivacySecurityLevel, SecurePrivacyResult } from '@/lib/cross-chain/PrivacySecurityConnector';
import { Shield, Lock, Check, AlertTriangle, Loader2, LockKeyhole, ServerCrash } from 'lucide-react';

interface SecurePrivacyPanelProps {
  vaultId?: string;
  className?: string;
}

export function SecurePrivacyPanel({ vaultId: initialVaultId, className }: SecurePrivacyPanelProps) {
  const [vaultId, setVaultId] = useState(initialVaultId || '');
  const [securityLevel, setSecurityLevel] = useState<PrivacySecurityLevel>(PrivacySecurityLevel.STANDARD);
  const [proofType, setProofType] = useState<ZkProofType>(ZkProofType.OWNERSHIP);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<SecurePrivacyResult | null>(null);
  const { toast } = useToast();

  const handleSecureOperation = async () => {
    if (!vaultId.trim()) {
      toast({
        title: 'Missing Vault ID',
        description: 'Please enter a valid vault identifier',
        variant: 'destructive'
      });
      return;
    }

    setIsProcessing(true);
    setResult(null);

    try {
      const connector = getPrivacySecurityConnector();
      let operationResult: SecurePrivacyResult;

      // Based on the proof type, perform the appropriate secure operation
      switch (proofType) {
        case ZkProofType.OWNERSHIP:
          operationResult = await connector.verifyVaultIntegrityWithPrivacy(vaultId, securityLevel);
          break;
          
        case ZkProofType.CONTENT_EXISTENCE:
          operationResult = await connector.generateSecureProof(vaultId, proofType, securityLevel, {
            contentHash: `content-${vaultId}-${Date.now()}`
          });
          break;
          
        case ZkProofType.BALANCE_RANGE:
          operationResult = await connector.createSecureRangeProof(vaultId, '100', '1000', securityLevel);
          break;
          
        default:
          operationResult = await connector.generateSecureProof(vaultId, proofType, securityLevel);
      }

      setResult(operationResult);
      
      // Show success or error toast
      if (operationResult.success) {
        toast({
          title: 'Operation Successful',
          description: operationResult.details || 'The secure privacy operation completed successfully',
          variant: 'default'
        });
      } else {
        toast({
          title: 'Operation Failed',
          description: operationResult.error || 'The secure privacy operation failed',
          variant: 'destructive'
        });
      }
    } catch (error: any) {
      console.error('Error in secure privacy operation:', error);
      toast({
        title: 'Operation Error',
        description: error.message || 'An unknown error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getSecurityLevelName = (level: PrivacySecurityLevel): string => {
    switch (level) {
      case PrivacySecurityLevel.BASIC: return 'Basic';
      case PrivacySecurityLevel.STANDARD: return 'Standard';
      case PrivacySecurityLevel.ADVANCED: return 'Advanced';
      case PrivacySecurityLevel.ENTERPRISE: return 'Enterprise';
      case PrivacySecurityLevel.MAXIMUM: return 'Maximum';
      default: return 'Unknown';
    }
  };

  const getProofTypeName = (type: ZkProofType): string => {
    switch (type) {
      case ZkProofType.OWNERSHIP: return 'Ownership Proof';
      case ZkProofType.CONTENT_EXISTENCE: return 'Content Existence';
      case ZkProofType.TIME_CONDITION: return 'Time Condition';
      case ZkProofType.BALANCE_RANGE: return 'Balance Range';
      case ZkProofType.ACCESS_RIGHTS: return 'Access Rights';
      case ZkProofType.IDENTITY: return 'Identity';
      case ZkProofType.MULTI_PARTY: return 'Multi-Party';
      default: return 'Unknown';
    }
  };

  return (
    <Card className={`border-border ${className || ''}`}>
      <CardHeader className="bg-gradient-to-r from-[#6B00D7]/10 to-[#FF5AF7]/10">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Shield className="h-5 w-5 text-[#FF5AF7]" />
          Secure Privacy Operations
        </CardTitle>
        <CardDescription>
          Create zero-knowledge proofs with Triple-Chain Security integration
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="vaultId">Vault ID</Label>
            <Input
              id="vaultId"
              value={vaultId}
              onChange={(e) => setVaultId(e.target.value)}
              placeholder="Enter vault identifier"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="proofType">Proof Type</Label>
              <Select 
                value={proofType} 
                onValueChange={(value) => setProofType(value as ZkProofType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select operation type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ZkProofType.OWNERSHIP}>Ownership Proof</SelectItem>
                  <SelectItem value={ZkProofType.CONTENT_EXISTENCE}>Content Existence</SelectItem>
                  <SelectItem value={ZkProofType.BALANCE_RANGE}>Balance Range</SelectItem>
                  <SelectItem value={ZkProofType.ACCESS_RIGHTS}>Access Rights</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="securityLevel">Security Level</Label>
              <Select 
                value={securityLevel.toString()} 
                onValueChange={(value) => setSecurityLevel(parseInt(value) as PrivacySecurityLevel)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select security level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PrivacySecurityLevel.BASIC.toString()}>Basic (Single Chain)</SelectItem>
                  <SelectItem value={PrivacySecurityLevel.STANDARD.toString()}>Standard (Dual Chain)</SelectItem>
                  <SelectItem value={PrivacySecurityLevel.ADVANCED.toString()}>Advanced (Triple Chain)</SelectItem>
                  <SelectItem value={PrivacySecurityLevel.ENTERPRISE.toString()}>Enterprise</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Higher security levels use more blockchains for verification
              </p>
            </div>
          </div>

          <Button
            onClick={handleSecureOperation}
            className="w-full bg-gradient-to-r from-[#6B00D7] to-[#9242FC] hover:from-[#5A00B3] hover:to-[#7E36DD]"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <LockKeyhole className="mr-2 h-4 w-4" />
                Execute Secure Operation
              </>
            )}
          </Button>

          {result && (
            <div className="mt-4">
              <div className={`p-4 rounded-md mb-4 ${result.success ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                <div className="flex items-center gap-2">
                  {result.success ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  )}
                  <div>
                    <h3 className={`font-medium ${result.success ? 'text-green-500' : 'text-red-500'}`}>
                      {result.success ? 'Operation Succeeded' : 'Operation Failed'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {result.details || result.error || 'No details available'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/30 p-4 rounded-md">
                <h4 className="font-medium mb-3">Operation Details</h4>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Proof ID:</span>
                    <span className="font-mono">{result.proofId ? result.proofId.substring(0, 16) + '...' : 'N/A'}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Security Level:</span>
                    <span>{getSecurityLevelName(result.securityLevel)} ({result.securityLevel})</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cross-Chain Consistency:</span>
                    <span>
                      {result.crossChainConsistency ? (
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
                    </span>
                  </div>

                  <div className="h-px bg-border my-2"></div>

                  <h5 className="font-medium text-xs mb-2 text-muted-foreground">BLOCKCHAIN VERIFICATION RESULTS</h5>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#6B00D7]/10 flex items-center justify-center">
                        <span className="text-xs font-bold text-[#6B00D7]">ETH</span>
                      </div>
                      <span>Ethereum</span>
                    </div>
                    {result.blockchainStatuses.ethereum !== undefined ? (
                      result.blockchainStatuses.ethereum ? (
                        <Badge className="bg-green-500/10 text-green-500">
                          <Check className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge className="bg-red-500/10 text-red-500">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Failed
                        </Badge>
                      )
                    ) : (
                      <Badge variant="outline">Not Checked</Badge>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#9242FC]/10 flex items-center justify-center">
                        <span className="text-xs font-bold text-[#9242FC]">SOL</span>
                      </div>
                      <span>Solana</span>
                    </div>
                    {result.blockchainStatuses.solana !== undefined ? (
                      result.blockchainStatuses.solana ? (
                        <Badge className="bg-green-500/10 text-green-500">
                          <Check className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge className="bg-red-500/10 text-red-500">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Failed
                        </Badge>
                      )
                    ) : (
                      <Badge variant="outline">Not Checked</Badge>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#FF5AF7]/10 flex items-center justify-center">
                        <span className="text-xs font-bold text-[#FF5AF7]">TON</span>
                      </div>
                      <span>TON</span>
                    </div>
                    {result.blockchainStatuses.ton !== undefined ? (
                      result.blockchainStatuses.ton ? (
                        <Badge className="bg-green-500/10 text-green-500">
                          <Check className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge className="bg-red-500/10 text-red-500">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Failed
                        </Badge>
                      )
                    ) : (
                      <Badge variant="outline">Not Checked</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="bg-muted/30 px-6 py-3 text-xs text-muted-foreground flex justify-between">
        <span>Zero-Knowledge Privacy Layer</span>
        <span>Triple-Chain Security Architecture</span>
      </CardFooter>
    </Card>
  );
}
