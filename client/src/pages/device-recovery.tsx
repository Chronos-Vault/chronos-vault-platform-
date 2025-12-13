import { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Shield, 
  AlertTriangle, 
  Lock, 
  Check, 
  X, 
  Loader2, 
  KeyRound,
  ExternalLink,
  Activity,
  Zap,
  Search
} from "lucide-react";

const TON_CONTRACTS = {
  TrinityConsensus: 'EQeGlYzwupSROVWGucOmKyUDbSaKmPfIpHHP5mV73odL8',
  ChronosVault: 'EQjUVidQfn4m-Rougn0fol7ECCthba2HV0M6xz9zAfax4',
  CrossChainBridge: 'EQgWobA9D4u6Xem3B8e6Sde_NEFZYicyy7_5_XvOT18mA',
};

const QUANTUM_ALGORITHMS = {
  keyEncapsulation: 'ML-KEM-1024 (CRYSTALS-Kyber)',
  signatures: 'CRYSTALS-Dilithium-5',
  hashFunction: 'SHAKE-256',
  securityLevel: 'NIST Level 5 (256-bit quantum)',
};

interface RecoveryVerification {
  chain: 'arbitrum' | 'solana' | 'ton';
  verified: boolean;
  status: 'pending' | 'verifying' | 'success' | 'failed';
}

interface HtlcSwap {
  id: number;
  swapId: string;
  sourceChain: string;
  destChain: string;
  amount: string;
  status: string;
  createdAt: string;
}

export default function DeviceRecoveryPage() {
  const { toast } = useToast();
  const [vaultId, setVaultId] = useState('');
  const [recoveryKey, setRecoveryKey] = useState('');
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState<'input' | 'verifying' | 'complete'>('input');
  const [chainVerifications, setChainVerifications] = useState<RecoveryVerification[]>([
    { chain: 'arbitrum', verified: false, status: 'pending' },
    { chain: 'solana', verified: false, status: 'pending' },
    { chain: 'ton', verified: false, status: 'pending' }
  ]);

  const { data: swapsData } = useQuery<{ success: boolean; data: { swaps: HtlcSwap[] } }>({
    queryKey: ['/api/scanner/swaps'],
  });

  const { data: blockchainStatus } = useQuery<any>({
    queryKey: ['/api/blockchain/status'],
  });

  const swaps = swapsData?.data?.swaps || [];

  const handleSelectVault = (swapId: string) => {
    setVaultId(swapId);
  };

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
    setChainVerifications([
      { chain: 'arbitrum', verified: false, status: 'verifying' },
      { chain: 'solana', verified: false, status: 'pending' },
      { chain: 'ton', verified: false, status: 'pending' }
    ]);

    try {
      const response = await fetch('/api/trinity/emergency-recovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vaultId, recoveryKey })
      });

      if (response.ok) {
        const result = await response.json();
        
        const updatedVerifications: RecoveryVerification[] = [
          { chain: 'arbitrum', verified: result.verifications?.find((v: any) => v.chain === 'ethereum')?.verified || false, status: result.verifications?.find((v: any) => v.chain === 'ethereum')?.verified ? 'success' : 'failed' },
          { chain: 'solana', verified: result.verifications?.find((v: any) => v.chain === 'solana')?.verified || false, status: result.verifications?.find((v: any) => v.chain === 'solana')?.verified ? 'success' : 'failed' },
          { chain: 'ton', verified: result.verifications?.find((v: any) => v.chain === 'ton')?.verified || false, status: result.verifications?.find((v: any) => v.chain === 'ton')?.verified ? 'success' : 'failed' }
        ];
        
        setChainVerifications(updatedVerifications);

        if (result.success && result.consensusReached) {
          setRecoveryStep('complete');
          toast({
            title: "Recovery Successful!",
            description: "All 3 chains verified your recovery. Access restored!",
          });
        } else {
          toast({
            title: "Recovery Failed",
            description: `Only ${result.verifications?.filter((v: any) => v.verified).length || 0}/3 chains verified. All 3 required for emergency recovery.`,
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
      setChainVerifications(prev => prev.map(v => ({ ...v, status: 'failed' as const })));
    } finally {
      setIsRecovering(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#0f0f2a] to-[#0a0a1a] text-white">
      <section className="relative py-12 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-cyan-400" />
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
              <Zap className="w-3 h-3 mr-1 inline" /> Quantum-Safe Recovery
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            TON Emergency Recovery
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Trinity Protocol™ 3-of-3 chain verification with quantum-resistant cryptography.
          </p>

          <Alert className="mb-6 border-amber-500/30 bg-amber-500/10">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <AlertTitle className="text-amber-500">Maximum Security Protocol</AlertTitle>
            <AlertDescription className="text-gray-300">
              Emergency recovery requires ALL 3 chains to verify. This is the highest security 
              level in Trinity Protocol, designed for recovering access to your vault when 
              standard 2-of-3 consensus is insufficient.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-[#1a1a3a]/80 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-cyan-400" />
                Recovery Form
              </CardTitle>
              <CardDescription>
                Select a vault from Trinity Scan or enter manually
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Select from Trinity Scan ({swaps.length} swaps available)</Label>
                <Select onValueChange={handleSelectVault}>
                  <SelectTrigger className="bg-[#0f0f2a] border-gray-600" data-testid="select-vault">
                    <SelectValue placeholder="Select a vault/swap ID..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a3a] border-gray-600">
                    {swaps.slice(0, 10).map((swap) => (
                      <SelectItem key={swap.id} value={swap.swapId || `swap-${swap.id}`}>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs">{swap.swapId?.slice(0, 16) || `ID: ${swap.id}`}...</span>
                          <Badge className="text-xs">{swap.sourceChain} → {swap.destChain}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Link href="/monitoring" className="text-xs text-cyan-400 hover:underline mt-1 inline-flex items-center gap-1">
                  <Search className="h-3 w-3" /> View all in Trinity Scan
                </Link>
              </div>

              <div>
                <Label htmlFor="vaultId">Vault/Swap ID</Label>
                <Input
                  id="vaultId"
                  placeholder="0x... or swap-..."
                  value={vaultId}
                  onChange={(e) => setVaultId(e.target.value)}
                  className="bg-[#0f0f2a] border-gray-600 font-mono text-sm"
                  data-testid="input-vault-id"
                />
              </div>
              <div>
                <Label htmlFor="recoveryKey">Recovery Key</Label>
                <Input
                  id="recoveryKey"
                  type="password"
                  placeholder="Your recovery key..."
                  value={recoveryKey}
                  onChange={(e) => setRecoveryKey(e.target.value)}
                  className="bg-[#0f0f2a] border-gray-600"
                  data-testid="input-recovery-key"
                />
              </div>
              <Button 
                onClick={handleEmergencyRecovery}
                disabled={isRecovering || !vaultId || !recoveryKey}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500"
                data-testid="button-recover"
              >
                {isRecovering ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...</>
                ) : (
                  <><Lock className="mr-2 h-4 w-4" /> Initiate Recovery</>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a3a]/80 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-cyan-400" />
                Chain Verification Status
              </CardTitle>
              <CardDescription>
                All 3 chains must verify for recovery
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {chainVerifications.map((chain) => (
                <div key={chain.chain} className="flex items-center justify-between p-3 bg-[#0f0f2a] rounded-lg border border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      chain.status === 'success' ? 'bg-green-500' :
                      chain.status === 'verifying' ? 'bg-yellow-500 animate-pulse' :
                      chain.status === 'failed' ? 'bg-red-500' : 'bg-gray-500'
                    }`} />
                    <span className="capitalize font-medium">{chain.chain}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {chain.status === 'success' && <Check className="h-4 w-4 text-green-400" />}
                    {chain.status === 'failed' && <X className="h-4 w-4 text-red-400" />}
                    {chain.status === 'verifying' && <Loader2 className="h-4 w-4 text-yellow-400 animate-spin" />}
                    <Badge className={`text-xs ${
                      chain.status === 'success' ? 'bg-green-500/20 text-green-400' :
                      chain.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                      chain.status === 'verifying' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {chain.status}
                    </Badge>
                  </div>
                </div>
              ))}
              
              {recoveryStep === 'complete' && (
                <Alert className="border-green-500/30 bg-green-500/10">
                  <Check className="h-4 w-4 text-green-500" />
                  <AlertTitle className="text-green-400">Recovery Complete!</AlertTitle>
                  <AlertDescription className="text-gray-300">
                    Your vault access has been restored.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6 bg-[#1a1a3a]/80 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-400" />
              Quantum-Resistant Algorithms (TON)
            </CardTitle>
            <CardDescription>
              Post-quantum cryptography protecting your recovery
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(QUANTUM_ALGORITHMS).map(([key, value]) => (
                <div key={key} className="p-3 bg-[#0f0f2a] rounded-lg border border-gray-700">
                  <div className="text-sm text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                  <div className="font-medium text-purple-400">{value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6 bg-[#1a1a3a]/80 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-cyan-400" />
              TON Recovery Contracts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(TON_CONTRACTS).map(([name, address]) => (
                <div key={name} className="flex items-center justify-between p-3 bg-[#0f0f2a] rounded-lg border border-gray-700">
                  <div>
                    <div className="font-medium">{name}</div>
                    <code className="text-xs text-gray-400">{address}</code>
                  </div>
                  <a 
                    href={`https://testnet.tonscan.org/address/${address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline flex items-center gap-1 text-sm"
                  >
                    View <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
