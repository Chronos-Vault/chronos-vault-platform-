import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, AlertTriangle, Lock, Check, X, Loader2, KeyRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from '@/lib/queryClient';

interface RecoveryVerification {
  chain: 'ethereum' | 'solana' | 'ton';
  verified: boolean;
  timestamp: number;
  status: 'pending' | 'success' | 'failed';
}

/**
 * TON Emergency Recovery Page
 * 
 * Uses the Trinity Protocol's emergency recovery system which requires
 * ALL 3 chains to verify the recovery request. Fixed-role architecture ensures
 * maximum security: Ethereum (Primary), Solana (Rapid Validation), TON (Recovery System).
 */
const DeviceRecoveryPage = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Recovery form state
  const [vaultId, setVaultId] = useState('');
  const [recoveryKey, setRecoveryKey] = useState('');
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState<'input' | 'verifying' | 'complete'>('input');
  
  // Verification status for all 3 chains
  const [chainVerifications, setChainVerifications] = useState<RecoveryVerification[]>([
    { chain: 'ethereum', verified: false, timestamp: 0, status: 'pending' },
    { chain: 'solana', verified: false, timestamp: 0, status: 'pending' },
    { chain: 'ton', verified: false, timestamp: 0, status: 'pending' }
  ]);

  const handleEmergencyRecovery = async () => {
    if (!vaultId || !recoveryKey) {
      toast({
        title: "Missing Information",
        description: "Please provide both Vault ID and Recovery Key",
        variant: "destructive"
      });
      return;
    }

    setIsRecovering(true);
    setRecoveryStep('verifying');

    try {
      // Reset verification status
      setChainVerifications([
        { chain: 'ethereum', verified: false, timestamp: 0, status: 'pending' },
        { chain: 'solana', verified: false, timestamp: 0, status: 'pending' },
        { chain: 'ton', verified: false, timestamp: 0, status: 'pending' }
      ]);

      // Call Trinity Protocol emergency recovery endpoint
      const response = await fetch('/api/trinity/emergency-recovery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vaultId,
          recoveryKey
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        // Update chain verification status from response
        const updatedVerifications: RecoveryVerification[] = [
          {
            chain: 'ethereum',
            verified: result.verifications?.find((v: any) => v.chain === 'ethereum')?.verified || false,
            timestamp: Date.now(),
            status: result.verifications?.find((v: any) => v.chain === 'ethereum')?.verified ? 'success' : 'failed'
          },
          {
            chain: 'solana',
            verified: result.verifications?.find((v: any) => v.chain === 'solana')?.verified || false,
            timestamp: Date.now(),
            status: result.verifications?.find((v: any) => v.chain === 'solana')?.verified ? 'success' : 'failed'
          },
          {
            chain: 'ton',
            verified: result.verifications?.find((v: any) => v.chain === 'ton')?.verified || false,
            timestamp: Date.now(),
            status: result.verifications?.find((v: any) => v.chain === 'ton')?.verified ? 'success' : 'failed'
          }
        ];
        
        setChainVerifications(updatedVerifications);

        if (result.success && result.consensusReached) {
          setRecoveryStep('complete');
          toast({
            title: "🎉 Recovery Successful!",
            description: "All 3 chains verified your recovery. Access restored!",
          });
        } else {
          toast({
            title: "Recovery Failed",
            description: `Only ${result.verifications?.filter((v: any) => v.verified).length}/3 chains verified. All 3 required for emergency recovery.`,
            variant: "destructive"
          });
        }
      } else {
        throw new Error('Recovery request failed');
      }
    } catch (error) {
      console.error('Emergency recovery error:', error);
      toast({
        title: "Recovery Error",
        description: "Failed to process emergency recovery. Please try again.",
        variant: "destructive"
      });
      
      setChainVerifications(prev => prev.map(v => ({ ...v, status: 'failed' })));
    } finally {
      setIsRecovering(false);
    }
  };

  const getChainIcon = (chain: string) => {
    switch (chain) {
      case 'ethereum': return '⟠';
      case 'solana': return '◎';
      case 'ton': return '💎';
      default: return '🔗';
    }
  };

  const getChainRole = (chain: string) => {
    switch (chain) {
      case 'ethereum': return 'PRIMARY';
      case 'solana': return 'MONITOR';
      case 'ton': return 'BACKUP';
      default: return '';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            TON Emergency Recovery
          </h1>
          <p className="text-muted-foreground text-lg">
            Trinity Protocol™ 3-Chain Verification System
          </p>
          <Badge variant="outline" className="mt-2 border-purple-500 text-purple-300">
            Requires ALL 3 Chains • Maximum Security
          </Badge>
        </div>

        {/* Security Warning */}
        <Alert className="mb-6 border-amber-500/30 bg-amber-500/10">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertTitle className="text-amber-500">Maximum Security Protocol</AlertTitle>
          <AlertDescription className="text-amber-400/80">
            Emergency recovery requires mathematical consensus from ALL 3 blockchains (Ethereum + Solana + TON). 
            This ensures your vault cannot be recovered by compromising just one or two chains.
          </AlertDescription>
        </Alert>

        {recoveryStep === 'input' && (
          <Card className="border-purple-500/30 bg-black/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Initiate Emergency Recovery</CardTitle>
              <CardDescription className="text-gray-400">
                Enter your vault credentials to begin the Trinity Protocol verification process
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="vaultId" className="text-white">Vault ID</Label>
                <Input
                  id="vaultId"
                  placeholder="vault-1234567890-primary"
                  value={vaultId}
                  onChange={(e) => setVaultId(e.target.value)}
                  className="bg-black/50 border-gray-700 text-white"
                />
                <p className="text-sm text-gray-400">
                  Your unique vault identifier
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recoveryKey" className="text-white">Recovery Key</Label>
                <Input
                  id="recoveryKey"
                  type="password"
                  placeholder="Enter your recovery key"
                  value={recoveryKey}
                  onChange={(e) => setRecoveryKey(e.target.value)}
                  className="bg-black/50 border-gray-700 text-white"
                />
                <p className="text-sm text-gray-400">
                  The secure recovery key provided when you created your vault
                </p>
              </div>

              <Button 
                onClick={handleEmergencyRecovery}
                disabled={isRecovering || !vaultId || !recoveryKey}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isRecovering ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying Across 3 Chains...
                  </>
                ) : (
                  <>
                    <KeyRound className="mr-2 h-4 w-4" />
                    Start Emergency Recovery
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {recoveryStep === 'verifying' && (
          <Card className="border-purple-500/30 bg-black/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Trinity Protocol Verification</CardTitle>
              <CardDescription className="text-gray-400">
                Verifying your recovery request across all 3 blockchains
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {chainVerifications.map((verification, index) => (
                  <div 
                    key={verification.chain}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      verification.status === 'success' ? 'border-green-500/30 bg-green-500/10' :
                      verification.status === 'failed' ? 'border-red-500/30 bg-red-500/10' :
                      'border-gray-700 bg-black/30'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{getChainIcon(verification.chain)}</div>
                      <div>
                        <p className="text-white font-semibold capitalize">
                          {verification.chain}
                        </p>
                        <p className="text-sm text-gray-400">
                          Role: {getChainRole(verification.chain)}
                        </p>
                      </div>
                    </div>
                    <div>
                      {verification.status === 'pending' && (
                        <Loader2 className="h-6 w-6 text-purple-400 animate-spin" />
                      )}
                      {verification.status === 'success' && (
                        <div className="flex items-center text-green-400">
                          <Check className="h-6 w-6 mr-2" />
                          <span>Verified</span>
                        </div>
                      )}
                      {verification.status === 'failed' && (
                        <div className="flex items-center text-red-400">
                          <X className="h-6 w-6 mr-2" />
                          <span>Failed</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {recoveryStep === 'complete' && (
          <Card className="border-green-500/30 bg-green-500/10 backdrop-blur-sm">
            <CardHeader>
              <div className="text-center">
                <div className="inline-flex items-center justify-center p-4 bg-green-600 rounded-full mb-4">
                  <Check className="h-12 w-12 text-white" />
                </div>
                <CardTitle className="text-3xl text-green-400 mb-2">Recovery Successful!</CardTitle>
                <CardDescription className="text-gray-300 text-lg">
                  All 3 blockchains verified your recovery request
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <p className="text-white">
                  Your vault has been successfully recovered using the Trinity Protocol™.
                </p>
                <div className="flex justify-center gap-4">
                  {chainVerifications.map((v) => (
                    <div key={v.chain} className="flex items-center text-green-400">
                      <span className="text-2xl mr-2">{getChainIcon(v.chain)}</span>
                      <Check className="h-5 w-5" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={() => navigate("/my-vaults")}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  Access My Vaults
                </Button>
                <Button 
                  onClick={() => {
                    setRecoveryStep('input');
                    setVaultId('');
                    setRecoveryKey('');
                  }}
                  variant="outline"
                  className="flex-1 border-gray-700"
                >
                  Recover Another Vault
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* How It Works Section */}
        <Card className="mt-6 border-blue-500/30 bg-black/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-white">How Trinity Protocol Recovery Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                1
              </div>
              <div>
                <p className="font-semibold text-white">All 3 Chains Required</p>
                <p>Emergency recovery requires verification from Ethereum (PRIMARY), Solana (MONITOR), and TON (BACKUP). This is more secure than standard operations.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                2
              </div>
              <div>
                <p className="font-semibold text-white">Mathematical Verification</p>
                <p>Each blockchain independently verifies your recovery key against its records. No human operators, only mathematical proof.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                3
              </div>
              <div>
                <p className="font-semibold text-white">Consensus Required</p>
                <p>Only when all 3 chains agree is access granted. This ensures maximum security even in emergency situations.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DeviceRecoveryPage;
