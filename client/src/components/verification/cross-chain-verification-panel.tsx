/**
 * Cross-Chain Verification Panel
 * 
 * This component provides a user interface for the chain-agnostic
 * verification system with zero-knowledge proofs.
 */

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowDownToLine, Lock, Shield, ShieldCheck, ShieldAlert, Zap } from 'lucide-react';
import { BlockchainType } from '../../types/blockchain.types';
import { zkVerificationService, ZkVerificationRequest } from '../../services/zk-verification-service';
import { useUserWallets } from '@/hooks/use-user-wallets';
import { queryClient } from '../../lib/queryClient';

interface VerificationResultProps {
  verificationId: string;
  success: boolean;
  chains: BlockchainType[];
  timestamp: number;
  aggregatedProofId?: string;
}

const VerificationResult = ({ 
  verificationId, 
  success, 
  chains, 
  timestamp,
  aggregatedProofId
}: VerificationResultProps) => {
  return (
    <Card className="mt-4 border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
          {success ? 
            <ShieldCheck className="mr-2 h-5 w-5 text-green-500" /> : 
            <ShieldAlert className="mr-2 h-5 w-5 text-red-500" />
          }
          Verification {success ? 'Successful' : 'Failed'}
        </CardTitle>
        <CardDescription>
          ID: {verificationId.substring(0, 10)}...
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Timestamp:</span>
            <span className="text-sm">{new Date(timestamp).toLocaleString()}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Chains Verified:</span>
            <div className="flex space-x-1">
              {chains.map(chain => (
                <Badge key={chain} variant={success ? "default" : "outline"}>
                  {chain}
                </Badge>
              ))}
            </div>
          </div>
          
          {aggregatedProofId && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Proof ID:</span>
              <span className="text-sm font-mono">{aggregatedProofId.substring(0, 12)}...</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export function CrossChainVerificationPanel() {
  const { toast } = useToast();
  const { getWalletAddress } = useUserWallets();
  
  const [vaultId, setVaultId] = useState('');
  const [verificationLevel, setVerificationLevel] = useState<'basic' | 'standard' | 'advanced'>('standard');
  const [blockchainType, setBlockchainType] = useState<BlockchainType>('ETH');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  
  // Create a mutation for verification
  const verifyMutation = useMutation({
    mutationFn: (request: ZkVerificationRequest) => {
      return zkVerificationService.verifyVault(request);
    },
    onSuccess: (data) => {
      setVerificationResult(data);
      toast({
        title: 'Verification completed',
        description: data.success 
          ? 'Cross-chain verification was successful!' 
          : 'Verification failed. Check the details below.',
        variant: data.success ? 'default' : 'destructive'
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Verification error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
  
  // Function to handle verification
  const handleVerify = async () => {
    if (!vaultId) {
      toast({
        title: 'Missing information',
        description: 'Please enter a vault ID to verify',
        variant: 'destructive'
      });
      return;
    }
    
    // Get the user's address for the selected blockchain
    const ownerAddress = getWalletAddress(blockchainType);
    
    if (!ownerAddress) {
      toast({
        title: 'No wallet connected',
        description: `Please connect your ${blockchainType} wallet first`,
        variant: 'destructive'
      });
      return;
    }
    
    const request: ZkVerificationRequest = {
      vaultId,
      ownerAddress,
      blockchainType,
      verificationLevel,
      metadata: {
        timestamp: Date.now(),
        clientId: 'web-client'
      }
    };
    
    verifyMutation.mutate(request);
  };
  
  // Function to get color based on verification level
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'basic': return 'bg-blue-500';
      case 'standard': return 'bg-purple-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-bold">
          <Shield className="mr-2 h-6 w-6 text-primary" />
          Cross-Chain Zero-Knowledge Verification
        </CardTitle>
        <CardDescription>
          Verify vault ownership across multiple blockchains using zero-knowledge proofs
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="verify" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="verify">Verify Vault</TabsTrigger>
            <TabsTrigger value="info">How It Works</TabsTrigger>
          </TabsList>
          
          <TabsContent value="verify" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vaultId">Vault ID</Label>
                <Input
                  id="vaultId"
                  placeholder="Enter vault ID to verify"
                  value={vaultId}
                  onChange={(e) => setVaultId(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="blockchain">Primary Blockchain</Label>
                  <Select 
                    value={blockchainType} 
                    onValueChange={(value) => setBlockchainType(value as BlockchainType)}
                  >
                    <SelectTrigger id="blockchain">
                      <SelectValue placeholder="Select blockchain" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ETH">Ethereum</SelectItem>
                      <SelectItem value="SOL">Solana</SelectItem>
                      <SelectItem value="TON">TON</SelectItem>
                      <SelectItem value="BTC">Bitcoin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="level">Verification Level</Label>
                  <Select 
                    value={verificationLevel} 
                    onValueChange={(value) => setVerificationLevel(value as any)}
                  >
                    <SelectTrigger id="level">
                      <SelectValue placeholder="Select verification level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic (Single Chain)</SelectItem>
                      <SelectItem value="standard">Standard (Dual Chain)</SelectItem>
                      <SelectItem value="advanced">Advanced (Triple Chain)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Security Level</span>
                  <span className="text-sm font-medium">
                    {verificationLevel === 'basic' ? '33%' : verificationLevel === 'standard' ? '66%' : '100%'}
                  </span>
                </div>
                <Progress 
                  value={verificationLevel === 'basic' ? 33 : verificationLevel === 'standard' ? 66 : 100} 
                  className={`h-2 ${getLevelColor(verificationLevel)}`}
                />
              </div>
            </div>
            
            {verificationResult && (
              <VerificationResult
                verificationId={verificationResult.verificationId}
                success={verificationResult.success}
                chains={verificationResult.chains}
                timestamp={verificationResult.timestamp}
                aggregatedProofId={verificationResult.aggregatedProofId}
              />
            )}
          </TabsContent>
          
          <TabsContent value="info" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="relative pl-6 border-l-2 border-primary/30">
                <h3 className="text-md font-semibold flex items-center">
                  <Zap className="mr-2 h-4 w-4 text-primary" />
                  Zero-Knowledge Proofs
                </h3>
                <p className="text-sm text-muted-foreground">
                  This verification uses zero-knowledge proofs to verify vault ownership 
                  without revealing sensitive information about the vault or its contents.
                </p>
              </div>
              
              <div className="relative pl-6 border-l-2 border-primary/30">
                <h3 className="text-md font-semibold flex items-center">
                  <ArrowDownToLine className="mr-2 h-4 w-4 text-primary" />
                  Cross-Chain Verification
                </h3>
                <p className="text-sm text-muted-foreground">
                  Security is enhanced by verifying the vault across multiple blockchains,
                  creating a distributed security model resistant to single-chain vulnerabilities.
                </p>
              </div>
              
              <div className="relative pl-6 border-l-2 border-primary/30">
                <h3 className="text-md font-semibold flex items-center">
                  <Lock className="mr-2 h-4 w-4 text-primary" />
                  Verification Levels
                </h3>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold">Basic:</span> Verifies on a single blockchain.<br />
                  <span className="font-semibold">Standard:</span> Verifies on two blockchains for additional security.<br />
                  <span className="font-semibold">Advanced:</span> Verifies across all supported blockchains for maximum security.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t px-6 py-4">
        <div className="flex items-center text-xs text-muted-foreground">
          <Lock className="mr-1 h-3 w-3" />
          Zero-knowledge enabled
        </div>
        <Button 
          onClick={handleVerify} 
          disabled={verifyMutation.isPending} 
          className="bg-primary hover:bg-primary/80"
        >
          {verifyMutation.isPending ? 'Verifying...' : 'Verify Vault'}
        </Button>
      </CardFooter>
    </Card>
  );
};