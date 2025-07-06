import { useState, useEffect } from 'react';
import { Link, useParams } from 'wouter';
import { ChevronLeft, Wallet, Shield, Lock, ArrowUpDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { QuantumProgressiveShieldCard } from '@/components/vault/quantum-progressive-shield-card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

type QuantumVault = {
  id: string;
  name: string;
  description: string;
  type: string;
  value: number;
  createdAt: string;
  updatedAt: string;
  securityInfo?: any;
};

export default function QuantumVaultPage() {
  const [vault, setVault] = useState<QuantumVault | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newValue, setNewValue] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  // Use useParams correctly to get the route parameters
  const params = useParams();
  const vaultId = params.id;
  
  // Fetch vault data
  useEffect(() => {
    const fetchVault = async () => {
      try {
        // If no vault ID is provided, we're in creation mode
        if (!vaultId) {
          console.log("No vault ID provided - initializing a new vault");
          // Create a default vault object for the creation form
          setVault({
            id: 'new',
            name: 'New Quantum-Progressive Vault',
            description: 'A vault secured by quantum-resistant cryptography that automatically adapts its security level based on the value of stored assets.',
            type: 'quantum-resistant',
            value: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            securityInfo: {
              securityTier: 'standard',
              quantumAlgorithms: {
                signatures: 'Falcon-512',
                encryption: 'Kyber-512'
              },
              securityStrength: 75,
              hasZeroKnowledgeProofs: false
            }
          });
          setLoading(false);
          return;
        }
        
        console.log("Fetching vault with ID:", vaultId);
        const response = await fetch(`/api/vaults/${vaultId}`);
        console.log("Vault response status:", response.status);
        const data = await response.json();
        console.log("Vault data received:", data);
        
        if (data.success) {
          console.log("Setting vault data:", data.vault);
          setVault(data.vault);
          if (data.vault.value) {
            setNewValue(data.vault.value.toString());
          }
        } else {
          console.error("API returned error:", data);
          setError(`Failed to load vault details: ${data.error || 'Unknown error'}`);
        }
      } catch (err) {
        console.error('Error fetching vault:', err);
        setError(`Error connecting to server: ${err.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchVault();
  }, [vaultId]);

  // Handle value update
  const handleValueUpdate = async () => {
    if (!vault || !newValue || isNaN(Number(newValue))) return;
    
    setUpdating(true);
    
    try {
      const response = await fetch(`/api/vaults/${vault.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          value: Number(newValue)
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setVault(data.vault);
        toast({
          title: "Value updated",
          description: "Quantum security parameters adjusted automatically",
        });
      } else {
        setError('Failed to update vault value');
        toast({
          variant: "destructive",
          title: "Update failed",
          description: "Could not update vault value",
        });
      }
    } catch (err) {
      console.error('Error updating vault value:', err);
      setError('Error connecting to server');
      toast({
        variant: "destructive",
        title: "Connection error",
        description: "Could not connect to server",
      });
    } finally {
      setUpdating(false);
    }
  };

  // Handle security upgrade
  const handleSecurityUpgrade = (newLevel: string) => {
    toast({
      title: "Security upgraded",
      description: `Quantum protection increased to ${newLevel} level`,
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 max-w-5xl">
        <div className="flex items-center mb-6">
          <Link href="/my-vaults">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Loading Quantum Vault...</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardContent className="py-10">
                <div className="h-40 flex items-center justify-center">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-1">
            <div className="h-full space-y-6">
              <div className="animate-pulse bg-muted h-32 rounded-md"></div>
              <div className="animate-pulse bg-muted h-64 rounded-md"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !vault) {
    return (
      <div className="container mx-auto py-6 max-w-5xl">
        <div className="flex items-center mb-6">
          <Link href="/my-vaults">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Vault Error</h1>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error || 'Failed to load quantum vault information. Please try again later.'}
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="flex items-center mb-4">
        <Link href="/my-vaults">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </Link>
        <Badge variant="outline" className="ml-auto bg-gradient-to-r from-[#6B00D7]/10 to-[#FF5AF7]/10 border-[#6B00D7]/30 text-[#FF5AF7]">
          Quantum-Progressive
        </Badge>
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] mb-2">
          {vault.name}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-3xl">
          Our most advanced vault technology featuring post-quantum cryptography that automatically
          scales security parameters based on asset value. Protected by {vault.securityInfo?.signatures?.algorithm || 'CRYSTALS-Dilithium'} 
          signatures and {vault.securityInfo?.encryption?.algorithm || 'Kyber-1024'} lattice-based encryption.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Shield className="h-5 w-5 mr-2 text-[#FF5AF7]" />
                Quantum-Resistant Vault Details
              </CardTitle>
              <CardDescription className="text-sm">
                <span className="text-[#6B00D7] font-medium">Triple-Chain Security Architecture</span> with progressive quantum-resistant encryption that automatically 
                scales based on value thresholds. Uses lattice-based cryptography that's resistant to quantum computing attacks.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Description */}
              {vault.description && (
                <div>
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-muted-foreground">{vault.description}</p>
                </div>
              )}
              
              <Separator />
              
              {/* Value Management */}
              <div>
                <h3 className="font-medium mb-4">Vault Value</h3>
                <div className="p-4 rounded-md border bg-[#0F0A1F] border-[#6B00D7]/30">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-1.5">Current Vault Value</p>
                      <div className="flex items-center">
                        <Wallet className="mr-2 h-4 w-4 text-[#FF5AF7]" />
                        <span className="font-bold text-white">{vault.value.toLocaleString()}</span>
                        <span className="text-gray-400 ml-1 text-sm">CVT Tokens</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1.5">Update Vault Value</p>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          value={newValue}
                          onChange={(e) => setNewValue(e.target.value)}
                          placeholder="Enter new value"
                          className="max-w-[180px] bg-[#1A1A1A] border-[#6B00D7]/30 text-white"
                        />
                        <Button 
                          onClick={handleValueUpdate}
                          disabled={updating || !newValue || isNaN(Number(newValue)) || Number(newValue) === vault.value}
                          size="sm"
                          className="whitespace-nowrap bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5500AB] hover:to-[#FF46E8] text-white"
                        >
                          <ArrowUpDown className="mr-2 h-4 w-4" />
                          {updating ? 'Updating...' : 'Update Value'}
                        </Button>
                      </div>
                      <p className="text-xs mt-1.5 text-gray-400">
                        Changing the vault value automatically adjusts security parameters
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Date Information */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-md border bg-gradient-to-r from-[#0F0A1F]/80 to-[#1A0F2E]/80 border-[#6B00D7]/20">
                <div>
                  <p className="text-sm text-gray-400 mb-1 font-medium">Created</p>
                  <p className="text-white">{new Date(vault.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1 font-medium">Last Updated</p>
                  <p className="text-white">{new Date(vault.updatedAt).toLocaleString()}</p>
                </div>
              </div>
              
              {/* Security Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-3 rounded-md bg-[#0F0A1F] border-[#6B00D7]/20 border text-center">
                  <p className="text-xs text-gray-400 mb-1">Signature Algorithm</p>
                  <p className="text-[#FF5AF7] font-bold">{vault.securityInfo?.signatures?.algorithm || 'CRYSTALS-Dilithium'}</p>
                </div>
                <div className="p-3 rounded-md bg-[#0F0A1F] border-[#6B00D7]/20 border text-center">
                  <p className="text-xs text-gray-400 mb-1">Security Strength</p>
                  <p className="text-[#FF5AF7] font-bold">{vault.securityInfo?.securityStrength || '90'}/100</p>
                </div>
                <div className="p-3 rounded-md bg-[#0F0A1F] border-[#6B00D7]/20 border text-center col-span-2 sm:col-span-1">
                  <p className="text-xs text-gray-400 mb-1">Zero-Knowledge Proofs</p>
                  <p className="text-[#FF5AF7] font-bold">{vault.securityInfo?.hasZeroKnowledgeProofs ? 'Enabled' : 'Disabled'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          {/* Quantum Shield Card */}
          <QuantumProgressiveShieldCard 
            vaultId={vault.id}
            vaultValue={vault.value}
            onSecurityUpgrade={handleSecurityUpgrade}
          />
          
          {/* Additional Actions Card */}
          <Card className="overflow-hidden border-[#6B00D7]/30 bg-gradient-to-b from-[#0F0A1F] to-[#1A1029]">
            <CardHeader className="pb-3 border-b border-[#6B00D7]/20">
              <CardTitle className="text-lg text-white">Vault Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-4">
              <Link href="/specialized-vault-creation?type=quantum-resistant">
                <Button className="w-full justify-start bg-[#1A1029] hover:bg-[#261540] border-[#6B00D7]/30 text-white">
                  <Wallet className="mr-2 h-4 w-4 text-[#FF5AF7]" />
                  Cryptocurrency Storage Options
                </Button>
              </Link>
              <Button className="w-full justify-start bg-[#1A1029] hover:bg-[#261540] border-[#6B00D7]/30 text-white">
                <Lock className="mr-2 h-4 w-4 text-[#FF5AF7]" />
                Multi-Chain Access Controls
              </Button>
              <Button className="w-full justify-start bg-[#1A1029] hover:bg-[#261540] border-[#6B00D7]/30 text-white">
                <Shield className="mr-2 h-4 w-4 text-[#FF5AF7]" />
                Advanced Quantum Settings
              </Button>
              <Separator className="my-2 bg-[#6B00D7]/20" />
              <div className="pt-1">
                <p className="text-xs text-gray-400 mb-2">Triple-Chain Security Status</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 rounded border border-[#6B00D7]/20 bg-[#0F0A1F] text-center">
                    <p className="text-[#FF5AF7] text-xs font-bold">ETH</p>
                    <div className="h-1.5 w-1.5 bg-green-500 rounded-full mx-auto mt-1"></div>
                  </div>
                  <div className="p-2 rounded border border-[#6B00D7]/20 bg-[#0F0A1F] text-center">
                    <p className="text-[#FF5AF7] text-xs font-bold">SOL</p>
                    <div className="h-1.5 w-1.5 bg-green-500 rounded-full mx-auto mt-1"></div>
                  </div>
                  <div className="p-2 rounded border border-[#6B00D7]/20 bg-[#0F0A1F] text-center">
                    <p className="text-[#FF5AF7] text-xs font-bold">TON</p>
                    <div className="h-1.5 w-1.5 bg-green-500 rounded-full mx-auto mt-1"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}