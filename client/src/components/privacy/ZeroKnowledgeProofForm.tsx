/**
 * Zero Knowledge Proof Form
 * 
 * This component provides a user interface for creating and verifying
 * zero-knowledge proofs using the ZK Privacy Layer.
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getPrivacyLayerService } from '@/lib/privacy';
import { ZkProofStatus, ZkProofType, ZkProof } from '@/lib/privacy/zk-proof-service';
import { BlockchainType } from '@/lib/cross-chain/interfaces';
import { Check, Clock, Shield, AlertTriangle, Lock, Fingerprint, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Form schema
const proofFormSchema = z.object({
  vaultId: z.string().min(1, { message: 'Vault ID is required' }),
  proofType: z.nativeEnum(ZkProofType),
  blockchain: z.enum(['ETH', 'SOL', 'TON']),
  useCrossChain: z.boolean().default(false),
  additionalParams: z.string().optional()
});

type ProofFormValues = z.infer<typeof proofFormSchema>;

// Component props
interface ZeroKnowledgeProofFormProps {
  initialVaultId?: string;
  onProofGenerated?: (proof: ZkProof) => void;
}

export function ZeroKnowledgeProofForm({ initialVaultId, onProofGenerated }: ZeroKnowledgeProofFormProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [currentProof, setCurrentProof] = useState<ZkProof | null>(null);
  const [verificationResult, setVerificationResult] = useState<any | null>(null);
  const { toast } = useToast();
  
  const form = useForm<ProofFormValues>({
    resolver: zodResolver(proofFormSchema),
    defaultValues: {
      vaultId: initialVaultId || '',
      proofType: ZkProofType.OWNERSHIP,
      blockchain: 'ETH',
      useCrossChain: false,
      additionalParams: '{}'
    }
  });
  
  const handleSubmit = async (values: ProofFormValues) => {
    setIsGenerating(true);
    setCurrentProof(null);
    setVerificationResult(null);
    
    try {
      const privacyService = getPrivacyLayerService();
      
      let proof: ZkProof | null = null;
      let additionalParams = {};
      
      // Parse additional params if provided
      try {
        if (values.additionalParams) {
          additionalParams = JSON.parse(values.additionalParams);
        }
      } catch (e) {
        console.error('Failed to parse additional params:', e);
        toast({
          title: 'Invalid Parameters',
          description: 'The additional parameters are not valid JSON.',
          variant: 'destructive'
        });
        setIsGenerating(false);
        return;
      }
      
      // Generate proof
      if (values.useCrossChain) {
        // Use cross-chain proof generation
        const verification = await privacyService.generateCrossChainProofs(
          values.vaultId,
          values.proofType,
          ['ETH', 'SOL', 'TON'],
          additionalParams
        );
        
        // Get the first proof
        const firstProofId = verification.proofId;
        proof = await privacyService.getZkProofService().getProof(firstProofId);
      } else {
        // Single blockchain proof
        proof = await privacyService.generateProofForBlockchain(
          values.vaultId,
          values.proofType,
          values.blockchain as BlockchainType,
          additionalParams
        );
      }
      
      if (proof) {
        setCurrentProof(proof);
        if (onProofGenerated) {
          onProofGenerated(proof);
        }
        
        toast({
          title: 'Proof Generated',
          description: `ZK Proof ${proof.id.substring(0, 8)}... generated successfully.`,
          variant: 'default'
        });
      }
    } catch (error: any) {
      toast({
        title: 'Proof Generation Failed',
        description: error.message || 'An unknown error occurred',
        variant: 'destructive'
      });
      console.error('Error generating proof:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleVerify = async () => {
    if (!currentProof) return;
    
    setIsVerifying(true);
    setVerificationResult(null);
    
    try {
      const privacyService = getPrivacyLayerService();
      
      // Verify the proof
      const result = await privacyService.verifyProofOnBlockchain(
        currentProof.id,
        currentProof.blockchain
      );
      
      setVerificationResult(result);
      
      toast({
        title: result.isValid ? 'Proof Verified' : 'Proof Invalid',
        description: result.details || (result.isValid 
          ? 'The zero-knowledge proof has been successfully verified.'
          : 'The proof verification failed.'),
        variant: result.isValid ? 'default' : 'destructive'
      });
    } catch (error: any) {
      toast({
        title: 'Verification Failed',
        description: error.message || 'An unknown error occurred',
        variant: 'destructive'
      });
      console.error('Error verifying proof:', error);
    } finally {
      setIsVerifying(false);
    }
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card className="bg-background border-border shadow-md">
        <CardHeader className="bg-gradient-to-r from-[#6B00D7]/10 to-[#FF5AF7]/10 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Fingerprint className="h-5 w-5 text-[#FF5AF7]" />
            <span>Zero-Knowledge Proof Generator</span>
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Generate privacy-preserving zero-knowledge proofs to verify vault properties without revealing sensitive information.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Vault ID */}
            <div className="space-y-2">
              <Label htmlFor="vaultId">Vault ID</Label>
              <Input
                id="vaultId"
                placeholder="Enter vault identifier"
                {...form.register('vaultId')}
              />
              {form.formState.errors.vaultId && (
                <p className="text-red-500 text-sm">{form.formState.errors.vaultId.message}</p>
              )}
            </div>
            
            {/* Proof Type */}
            <div className="space-y-2">
              <Label htmlFor="proofType">Proof Type</Label>
              <Select 
                onValueChange={(value) => form.setValue('proofType', value as ZkProofType)}
                defaultValue={form.getValues('proofType')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select proof type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ZkProofType.OWNERSHIP}>Ownership Proof</SelectItem>
                  <SelectItem value={ZkProofType.CONTENT_EXISTENCE}>Content Existence Proof</SelectItem>
                  <SelectItem value={ZkProofType.TIME_CONDITION}>Time Condition Proof</SelectItem>
                  <SelectItem value={ZkProofType.BALANCE_RANGE}>Balance Range Proof</SelectItem>
                  <SelectItem value={ZkProofType.ACCESS_RIGHTS}>Access Rights Proof</SelectItem>
                  <SelectItem value={ZkProofType.MULTI_PARTY}>Multi-Party Proof</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.proofType && (
                <p className="text-red-500 text-sm">{form.formState.errors.proofType.message}</p>
              )}
            </div>
            
            {/* Blockchain */}
            <div className="space-y-2">
              <Label htmlFor="blockchain">Blockchain</Label>
              <Select 
                onValueChange={(value) => form.setValue('blockchain', value as BlockchainType)}
                defaultValue={form.getValues('blockchain')}
                disabled={form.getValues('useCrossChain')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select blockchain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ETH">Ethereum</SelectItem>
                  <SelectItem value="SOL">Solana</SelectItem>
                  <SelectItem value="TON">TON</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Cross-Chain Option */}
            <div className="flex items-center space-x-2">
              <Switch
                id="useCrossChain"
                checked={form.getValues('useCrossChain')}
                onCheckedChange={(checked) => {
                  form.setValue('useCrossChain', checked);
                }}
              />
              <Label htmlFor="useCrossChain" className="cursor-pointer">Use Cross-Chain Proof (Triple-Chain Security)</Label>
            </div>
            
            {/* Additional Parameters */}
            <div className="space-y-2">
              <Label htmlFor="additionalParams">Additional Parameters (JSON)</Label>
              <Input
                id="additionalParams"
                placeholder='{"param1": "value1", "param2": "value2"}'
                {...form.register('additionalParams')}
              />
              <p className="text-xs text-muted-foreground">
                Optional JSON parameters specific to the proof type
              </p>
            </div>
            
            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-[#6B00D7] to-[#9242FC] hover:from-[#5A00B3] hover:to-[#7E36DD]"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Proof...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Generate Zero-Knowledge Proof
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        
        {currentProof && (
          <>
            <Separator />
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-500" />
                Generated Proof
              </h3>
              
              <div className="bg-muted/40 p-4 rounded-md mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Proof ID</p>
                    <p className="font-mono text-sm">{currentProof.id.substring(0, 16)}...</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <div className="flex items-center">
                      {currentProof.status === ZkProofStatus.VERIFIED ? (
                        <Check className="h-4 w-4 text-green-500 mr-1" />
                      ) : currentProof.status === ZkProofStatus.PENDING ? (
                        <Clock className="h-4 w-4 text-yellow-500 mr-1" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span>{currentProof.status}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Vault ID</p>
                    <p className="font-mono text-sm">{currentProof.vaultId}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Blockchain</p>
                    <p>{currentProof.blockchain}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Created</p>
                    <p>{new Date(currentProof.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Expires</p>
                    <p>{new Date(currentProof.expiresAt).toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm font-medium text-muted-foreground">Public Inputs (Revealed Data)</p>
                  <pre className="bg-background p-2 rounded text-xs overflow-auto mt-1 max-h-20">
                    {JSON.stringify(currentProof.publicInputs, null, 2)}
                  </pre>
                </div>
              </div>
              
              <Button
                onClick={handleVerify}
                variant="outline"
                className="w-full"
                disabled={isVerifying}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Verify Proof
                  </>
                )}
              </Button>
              
              {verificationResult && (
                <div className={`mt-4 p-4 rounded-md ${verificationResult.isValid ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                  <div className="flex items-start">
                    {verificationResult.isValid ? (
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                    )}
                    <div>
                      <h4 className={`font-medium ${verificationResult.isValid ? 'text-green-500' : 'text-red-500'}`}>
                        {verificationResult.isValid ? 'Proof Verified' : 'Verification Failed'}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {verificationResult.details || (verificationResult.isValid
                          ? 'The zero-knowledge proof has been successfully verified.'
                          : 'The proof verification failed.')}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Verified at: {new Date(verificationResult.verifiedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </>
        )}
        
        <CardFooter className="bg-muted/30 px-6 py-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-muted-foreground/70" />
            <span>Zero-Knowledge Proofs protect your privacy while proving authenticity</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}