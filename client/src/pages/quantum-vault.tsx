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

    if (vaultId) {
      fetchVault();
    } else {
      console.error("No vault ID provided in URL parameters");
      setError("Missing vault ID parameter");
      setLoading(false);
    }
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
      <div className="flex items-center mb-6">
        <Link href="/my-vaults">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{vault.name}</h1>
        <Badge variant="outline" className="ml-4 bg-purple-50 text-purple-700 border-purple-100">
          Quantum-Progressive
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Shield className="h-5 w-5 mr-2 text-primary" />
                Quantum-Resistant Vault Details
              </CardTitle>
              <CardDescription>
                This vault uses progressive quantum-resistant encryption that adapts to the stored value
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
                <div className="p-4 rounded-md bg-slate-50 border">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1.5">Current Vault Value</p>
                      <div className="flex items-center">
                        <Wallet className="mr-2 h-4 w-4 text-primary" />
                        <span className="font-bold">{vault.value.toLocaleString()}</span>
                        <span className="text-muted-foreground ml-1 text-sm">CVT Tokens</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1.5">Update Vault Value</p>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          value={newValue}
                          onChange={(e) => setNewValue(e.target.value)}
                          placeholder="Enter new value"
                          className="max-w-[180px]"
                        />
                        <Button 
                          onClick={handleValueUpdate}
                          disabled={updating || !newValue || isNaN(Number(newValue)) || Number(newValue) === vault.value}
                          size="sm"
                          className="whitespace-nowrap"
                        >
                          <ArrowUpDown className="mr-2 h-4 w-4" />
                          {updating ? 'Updating...' : 'Update Value'}
                        </Button>
                      </div>
                      <p className="text-xs mt-1.5 text-muted-foreground">
                        Changing the vault value automatically adjusts security parameters
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Date Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Created</p>
                  <p>{new Date(vault.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
                  <p>{new Date(vault.updatedAt).toLocaleString()}</p>
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
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="outline">
                <Lock className="mr-2 h-4 w-4" />
                View Access Controls
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Shield className="mr-2 h-4 w-4" />
                Advanced Security Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}