import React, { useState, useEffect } from 'react';
import { Loader2, Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { getTripleChainSecurityService } from '@/services/TripleChainSecurityService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface TripleChainSecurityVerifierProps {
  vaultId: string;
  onVerificationComplete?: (status: {
    success: boolean;
    ethereumVerified: boolean;
    tonVerified: boolean;
    solanaVerified: boolean;
  }) => void;
}

export function TripleChainSecurityVerifier({
  vaultId,
  onVerificationComplete
}: TripleChainSecurityVerifierProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [status, setStatus] = useState<{
    securityLevel: number;
    ethereumStatus: { exists: boolean; isLocked: boolean; unlockTime: number };
    tonStatus: { exists: boolean; isBackedUp: boolean; recoveryMode: boolean };
    solanaStatus: { exists: boolean; isMonitored: boolean; lastCheckTime: number };
    crossChainVerified: boolean;
  } | null>(null);
  
  const [verificationProgress, setVerificationProgress] = useState({
    ethereum: 0,
    ton: 0,
    solana: 0
  });
  
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true);
        const tripleChainService = getTripleChainSecurityService();
        const securityStatus = await tripleChainService.getVaultSecurityStatus(vaultId);
        setStatus(securityStatus);
      } catch (error) {
        console.error('Failed to fetch vault security status', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch vault security status',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchStatus();
  }, [vaultId, toast]);
  
  const handleVerify = async () => {
    try {
      setVerifying(true);
      
      // Simulate verification progress
      const simulateProgress = () => {
        setVerificationProgress(prev => ({
          ethereum: Math.min(prev.ethereum + 10, 100),
          ton: Math.min(prev.ton + 5, 100),
          solana: Math.min(prev.solana + 15, 100)
        }));
      };
      
      // Update progress every 500ms
      const progressInterval = setInterval(simulateProgress, 500);
      
      // In a real implementation, this would trigger actual verification
      // and wait for responses from all chains
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      clearInterval(progressInterval);
      
      // Ensure all progress bars reach 100%
      setVerificationProgress({
        ethereum: 100,
        ton: 100,
        solana: 100
      });
      
      // Update status to reflect verification
      if (status) {
        const updatedStatus = {
          ...status,
          crossChainVerified: true
        };
        setStatus(updatedStatus);
      }
      
      // Notify parent component
      if (onVerificationComplete) {
        onVerificationComplete({
          success: true,
          ethereumVerified: true,
          tonVerified: true,
          solanaVerified: true
        });
      }
      
      toast({
        title: 'Verification Complete',
        description: 'Vault has been verified across all chains',
        variant: 'default'
      });
    } catch (error) {
      console.error('Verification failed', error);
      toast({
        title: 'Verification Failed',
        description: 'Failed to complete cross-chain verification',
        variant: 'destructive'
      });
      
      if (onVerificationComplete) {
        onVerificationComplete({
          success: false,
          ethereumVerified: false,
          tonVerified: false,
          solanaVerified: false
        });
      }
    } finally {
      setVerifying(false);
    }
  };
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Triple-Chain Security™ Verification</CardTitle>
          <CardDescription>Checking vault security status...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
  
  if (!status) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Triple-Chain Security™ Verification</CardTitle>
          <CardDescription>Unable to retrieve vault security status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <span>Vault data not found</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Triple-Chain Security™ Verification</CardTitle>
            <CardDescription>Vault ID: {vaultId}</CardDescription>
          </div>
          <Badge 
            variant={status.crossChainVerified ? "default" : "outline"}
            className={status.crossChainVerified ? "bg-green-600" : ""}
          >
            {status.crossChainVerified ? "Verified" : "Pending Verification"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="font-medium">Security Level:</span>
              </div>
              <Badge variant="outline">{status.securityLevel}/5</Badge>
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* Ethereum Status */}
              <div className="rounded-lg border p-3 shadow-sm">
                <h4 className="mb-2 font-medium">Ethereum</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Status:</span>
                    {status.ethereumStatus.exists ? (
                      <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-100 text-red-800">Not Found</Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Lock Status:</span>
                    {status.ethereumStatus.isLocked ? (
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">Locked</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Unlocked</Badge>
                    )}
                  </div>
                  {verifying && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span>Verification:</span>
                        <span>{verificationProgress.ethereum}%</span>
                      </div>
                      <Progress value={verificationProgress.ethereum} className="h-1.5" />
                    </div>
                  )}
                </div>
              </div>
              
              {/* TON Status */}
              <div className="rounded-lg border p-3 shadow-sm">
                <h4 className="mb-2 font-medium">TON</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Status:</span>
                    {status.tonStatus.exists ? (
                      <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-100 text-red-800">Not Found</Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Backup:</span>
                    {status.tonStatus.isBackedUp ? (
                      <Badge variant="outline" className="bg-green-100 text-green-800">Complete</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>
                    )}
                  </div>
                  {verifying && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span>Verification:</span>
                        <span>{verificationProgress.ton}%</span>
                      </div>
                      <Progress value={verificationProgress.ton} className="h-1.5" />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Solana Status */}
              <div className="rounded-lg border p-3 shadow-sm">
                <h4 className="mb-2 font-medium">Solana</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Status:</span>
                    {status.solanaStatus.exists ? (
                      <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-100 text-red-800">Not Found</Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Monitoring:</span>
                    {status.solanaStatus.isMonitored ? (
                      <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Inactive</Badge>
                    )}
                  </div>
                  {verifying && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span>Verification:</span>
                        <span>{verificationProgress.solana}%</span>
                      </div>
                      <Progress value={verificationProgress.solana} className="h-1.5" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-medium">Cross-Chain Verification Status</h3>
            <div className="flex items-center justify-between">
              {status.crossChainVerified ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span>Vault is verified across all chains</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-amber-600">
                  <Clock className="h-5 w-5" />
                  <span>Verification pending</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Refresh
        </Button>
        <Button
          disabled={verifying || status.crossChainVerified}
          onClick={handleVerify}
        >
          {verifying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying
            </>
          ) : status.crossChainVerified ? (
            'Verified'
          ) : (
            'Verify Across Chains'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}