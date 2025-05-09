/**
 * Zero-Knowledge Verification Page
 * 
 * This page showcases the Zero-Knowledge Proof Layer for cross-chain verification.
 */

import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';
import { CrossChainVerificationPanel } from '../components/verification/cross-chain-verification-panel';
import { zkVerificationService } from '../services/zk-verification-service';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShieldCheckIcon, Server, Lock, WrenchIcon } from 'lucide-react';

export default function ZeroKnowledgeVerificationPage() {
  // Fetch the ZK service status
  const { data: zkStatus, error, isLoading } = useQuery({
    queryKey: ['/api/zk/status'],
    queryFn: () => zkVerificationService.getZkServiceStatus(),
  });

  return (
    <div className="container py-8 max-w-6xl">
      <Helmet>
        <title>Zero-Knowledge Verification | Chronos Vault</title>
      </Helmet>
      
      <div className="mb-8 space-y-3">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">Zero-Knowledge Verification</h1>
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            New Feature
          </Badge>
        </div>
        
        <p className="text-muted-foreground max-w-3xl">
          Chronos Vault's Zero-Knowledge Proof Layer enables secure, private cross-chain
          verification without revealing sensitive vault information.
        </p>
      </div>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-4 mb-10">
        <Card className="col-span-1 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Server className="mr-2 h-4 w-4 text-primary" />
              ZK Service Status
            </CardTitle>
            <CardDescription>
              Current system status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="animate-pulse h-20 bg-muted rounded-md" />
            ) : error ? (
              <div className="text-destructive">Error loading status</div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status:</span>
                  <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                    {zkStatus?.status || 'Unknown'}
                  </Badge>
                </div>
                
                <Separator className="my-2" />
                
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Supported Chains:</h4>
                  <div className="flex flex-wrap gap-1">
                    {zkStatus?.supportedBlockchains?.map((chain: string) => (
                      <Badge key={chain} variant="outline">
                        {chain}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Implementation:</h4>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex justify-between">
                      <span>Protocol:</span>
                      <span className="font-mono">{zkStatus?.implementationDetails?.protocol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Library:</span>
                      <span className="font-mono">{zkStatus?.implementationDetails?.library}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Version:</span>
                      <span className="font-mono">{zkStatus?.implementationDetails?.circuitVersion}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="col-span-1 lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <ShieldCheckIcon className="mr-2 h-4 w-4 text-primary" />
                  Chain-Agnostic Verification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Standardized verification protocol that works across Ethereum, Solana, 
                  TON, and Bitcoin blockchains.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Lock className="mr-2 h-4 w-4 text-primary" />
                  Zero-Knowledge Proofs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Generate proofs that verify ownership without revealing 
                  sensitive vault data or private keys.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <WrenchIcon className="mr-2 h-4 w-4 text-primary" />
                  Proof Aggregation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Combine proofs from multiple chains into a single verifiable credential
                  for enhanced security.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <CrossChainVerificationPanel />
        </div>
      </div>
    </div>
  );
};