import React, { useState } from 'react';
import { TripleChainSecurityVerifier } from '@/components/security/TripleChainSecurityVerifier';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  LockIcon, 
  UnlockIcon, 
  AlertTriangle, 
  BarChart3, 
  Database, 
  Globe, 
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { OnboardingProvider } from '@/contexts/onboarding-context';

export default function TripleChainSecurity() {
  const { toast } = useToast();
  const [vaultId, setVaultId] = useState('vault-1683246549872');
  const [showVerifier, setShowVerifier] = useState(false);
  
  const handleVaultIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vaultId.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a valid Vault ID',
        variant: 'destructive'
      });
      return;
    }
    
    setShowVerifier(true);
  };
  
  const handleVerificationComplete = (status: {
    success: boolean;
    ethereumVerified: boolean;
    tonVerified: boolean;
    solanaVerified: boolean;
  }) => {
    if (status.success) {
      toast({
        title: 'Verification Complete',
        description: 'The vault has been successfully verified across all chains.',
        variant: 'default'
      });
    } else {
      toast({
        title: 'Verification Failed',
        description: 'There was an issue verifying the vault across all chains.',
        variant: 'destructive'
      });
    }
  };
  
  return (
    <OnboardingProvider>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold tracking-tight text-primary">
            Triple-Chain Security™
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Chronos Vault's revolutionary security architecture leverages
            Ethereum, TON, and Solana blockchains for unparalleled digital asset protection.
          </p>
        </div>
        
        <div className="mx-auto mb-12 max-w-4xl">
          <Card className="bg-gradient-to-br from-slate-900 to-slate-950 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                How Trinity Protocol Works
              </CardTitle>
              <CardDescription className="text-slate-300">
                Each blockchain serves a specific role in our 2-of-3 security architecture with Ethereum Layer 2 (Arbitrum) for affordable primary security.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 rounded-lg bg-[#6B00D7]/10 border border-[#6B00D7]/30 p-4">
                <div className="mb-2 flex items-center gap-2 font-medium text-purple-400">
                  <Shield className="h-5 w-5" />
                  <h3>Fixed Layer Architecture</h3>
                </div>
                <p className="text-sm text-slate-300">
                  Each blockchain has a dedicated role in protecting your vault. The Trinity Protocol uses Ethereum Layer 2 (Arbitrum) deployment 
                  for 95% lower fees while maintaining 2-of-3 mathematical consensus across all three layers.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="rounded-lg bg-slate-800/50 p-4 border border-[#6B00D7]/50">
                  <div className="mb-3 flex items-center gap-2 font-medium text-purple-400">
                    <LockIcon className="h-5 w-5" />
                    <h3>Ethereum Layer 2 (Arbitrum)</h3>
                  </div>
                  <p className="text-sm text-slate-300 mb-3">
                    Primary Security layer with immutable ownership records. Deployed via Arbitrum Layer 2 for 95% lower fees while maintaining maximum decentralization.
                  </p>
                  <div className="text-xs text-slate-400">
                    <div className="flex justify-between mb-1">
                      <span>Role:</span>
                      <span className="text-purple-400">Primary Security</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="text-purple-400">LAYER 2 OPTIMIZED</span>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg bg-slate-800/50 p-4 border border-[#6B00D7]/50">
                  <div className="mb-3 flex items-center gap-2 font-medium text-purple-400">
                    <BarChart3 className="h-5 w-5" />
                    <h3>Solana</h3>
                  </div>
                  <p className="text-sm text-slate-300 mb-3">
                    Rapid Validation layer providing high-frequency monitoring and state verification with lightning-fast transaction speeds.
                  </p>
                  <div className="text-xs text-slate-400">
                    <div className="flex justify-between mb-1">
                      <span>Role:</span>
                      <span className="text-purple-400">Rapid Validation</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="text-purple-400">NETWORK ACTIVE</span>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg bg-slate-800/50 p-4 border border-[#6B00D7]/50">
                  <div className="mb-3 flex items-center gap-2 font-medium text-purple-400">
                    <Database className="h-5 w-5" />
                    <h3>TON</h3>
                  </div>
                  <p className="text-sm text-slate-300 mb-3">
                    Recovery System layer with quantum-resistant backup and recovery capabilities using cutting-edge cryptography.
                  </p>
                  <div className="text-xs text-slate-400">
                    <div className="flex justify-between mb-1">
                      <span>Role:</span>
                      <span className="text-purple-400">Recovery System</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="text-purple-400">NETWORK ACTIVE</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 rounded-lg bg-primary/10 p-4">
                <div className="mb-2 flex items-center gap-2 font-medium text-primary">
                  <Shield className="h-5 w-5" />
                  <h3>2-of-3 Mathematical Consensus</h3>
                </div>
                <p className="text-sm text-slate-300">
                  Your vault requires verification from at least 2 out of 3 blockchain layers for all operations. 
                  This mathematical consensus ensures maximum security—even if one blockchain is compromised, your assets remain protected by the other two layers.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Verify a Vault</CardTitle>
                <CardDescription>
                  Enter a vault ID to check its Triple-Chain Security™ status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleVaultIdSubmit} className="flex items-center gap-2">
                  <Input
                    placeholder="Enter Vault ID"
                    value={vaultId}
                    onChange={(e) => setVaultId(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit">
                    Verify
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          {showVerifier && (
            <div className="mb-8">
              <TripleChainSecurityVerifier
                vaultId={vaultId}
                onVerificationComplete={handleVerificationComplete}
              />
            </div>
          )}
          
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Triple-Chain Security™ Features</CardTitle>
                <CardDescription>
                  Key security benefits of our distributed architecture
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <AlertTriangle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Compromise Protection</h3>
                      <p className="text-sm text-muted-foreground">
                        Even if one blockchain is compromised, your assets remain secure as
                        operations require verification from multiple chains.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Globe className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Geolocation Restrictions</h3>
                      <p className="text-sm text-muted-foreground">
                        Enhanced security through geographic verification, ensuring vaults
                        can only be accessed from pre-approved locations.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <UnlockIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Emergency Recovery</h3>
                      <p className="text-sm text-muted-foreground">
                        Distributed recovery mechanisms ensure you can always access your assets
                        even if one blockchain network is down.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Real-time Monitoring</h3>
                      <p className="text-sm text-muted-foreground">
                        Continuous cross-chain verification and high-frequency security checks
                        detect and prevent unauthorized access attempts in real-time.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </OnboardingProvider>
  );
}