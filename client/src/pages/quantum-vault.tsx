import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Shield, ArrowLeft, Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import QuantumProgressiveShieldCard from '@/components/vault/quantum-progressive-shield-card';

const QuantumVaultPage: React.FC = () => {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [vaultId, setVaultId] = useState<string>('');
  const [vaultValue, setVaultValue] = useState<number>(0);
  const [selectedTab, setSelectedTab] = useState<string>('create');
  const [loading, setLoading] = useState<boolean>(false);
  const [createdVault, setCreatedVault] = useState<any>(null);

  const handleCreateVault = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!vaultId || vaultValue <= 0) {
      toast({
        title: "Missing information",
        description: "Please provide a vault ID and value",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // First create a basic vault entry
      const response = await apiRequest('POST', '/api/vaults', {
        id: vaultId,
        name: `Quantum Vault ${vaultId}`,
        description: 'A vault protected by progressive quantum-resistant encryption',
        type: 'quantum-progressive',
        value: vaultValue,
        metadata: {
          securityTier: 'auto',
          progressiveProtection: true,
          quantumResistant: true
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to create vault');
      }
      
      const data = await response.json();
      setCreatedVault(data.vault);
      
      toast({
        title: "Vault created",
        description: "Quantum-resistant vault created successfully"
      });
      
      // Switch to manage tab
      setSelectedTab('manage');
    } catch (error) {
      console.error('Error creating vault:', error);
      toast({
        title: "Creation failed",
        description: "Failed to create quantum-resistant vault",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewVault = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!vaultId) {
      toast({
        title: "Missing information",
        description: "Please provide a vault ID",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await apiRequest('GET', `/api/vaults/${vaultId}`);
      
      if (!response.ok) {
        throw new Error('Failed to find vault');
      }
      
      const data = await response.json();
      setCreatedVault(data.vault);
      setVaultValue(data.vault.value || 0);
      
      toast({
        title: "Vault loaded",
        description: "Quantum-resistant vault loaded successfully"
      });
    } catch (error) {
      console.error('Error loading vault:', error);
      toast({
        title: "Loading failed",
        description: "Failed to load quantum-resistant vault",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateValue = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!createdVault || vaultValue <= 0) {
      toast({
        title: "Missing information",
        description: "Please provide a valid vault value",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await apiRequest('PATCH', `/api/vaults/${createdVault.id}`, {
        value: vaultValue
      });
      
      if (!response.ok) {
        throw new Error('Failed to update vault value');
      }
      
      const data = await response.json();
      setCreatedVault(data.vault);
      
      toast({
        title: "Value updated",
        description: "Vault value updated successfully"
      });
    } catch (error) {
      console.error('Error updating vault value:', error);
      toast({
        title: "Update failed",
        description: "Failed to update vault value",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setLocation('/vault-types-selector')}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold flex items-center">
          <Shield className="mr-3 h-8 w-8 text-primary" />
          Quantum-Resistant Progressive Vault
        </h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Progressive Quantum Protection</CardTitle>
              <CardDescription>
                Secure your assets with cutting-edge quantum-resistant encryption that
                automatically adapts and strengthens as your vault value increases.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="create">Create New</TabsTrigger>
                  <TabsTrigger value="manage">Manage Existing</TabsTrigger>
                </TabsList>
                
                <TabsContent value="create">
                  <form onSubmit={handleCreateVault}>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="vault-id">Vault ID</Label>
                        <Input 
                          id="vault-id"
                          placeholder="Enter a unique identifier for your vault"
                          value={vaultId}
                          onChange={(e) => setVaultId(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="vault-value">Vault Value (USD)</Label>
                        <Input 
                          id="vault-value"
                          type="number"
                          min="0"
                          step="100"
                          placeholder="Enter the value of assets in this vault"
                          value={vaultValue}
                          onChange={(e) => setVaultValue(parseFloat(e.target.value))}
                          required
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Security tier will be automatically determined based on value
                        </p>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={loading}
                      >
                        {loading ? "Creating..." : "Create Quantum Vault"}
                      </Button>
                    </div>
                  </form>
                </TabsContent>
                
                <TabsContent value="manage">
                  {createdVault ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between bg-muted/50 p-3 rounded-md">
                        <div>
                          <h3 className="font-medium">{createdVault.name}</h3>
                          <p className="text-sm text-muted-foreground">ID: {createdVault.id}</p>
                        </div>
                        <p className="text-xl font-bold">${createdVault.value.toLocaleString()}</p>
                      </div>
                      
                      <form onSubmit={handleUpdateValue} className="space-y-4">
                        <div>
                          <Label htmlFor="update-value">Update Vault Value (USD)</Label>
                          <div className="flex gap-2">
                            <Input 
                              id="update-value"
                              type="number"
                              min="0"
                              step="100"
                              placeholder="Update vault value"
                              value={vaultValue}
                              onChange={(e) => setVaultValue(parseFloat(e.target.value))}
                              required
                              className="flex-1"
                            />
                            <Button 
                              type="submit" 
                              variant="outline"
                              disabled={loading}
                            >
                              {loading ? "Updating..." : "Update"}
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Security will be automatically adjusted based on new value
                          </p>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <form onSubmit={handleViewVault}>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="view-vault-id">Vault ID</Label>
                          <Input 
                            id="view-vault-id"
                            placeholder="Enter vault ID to manage"
                            value={vaultId}
                            onChange={(e) => setVaultId(e.target.value)}
                            required
                          />
                        </div>
                        
                        <Button 
                          type="submit" 
                          variant="outline"
                          className="w-full"
                          disabled={loading}
                        >
                          {loading ? "Loading..." : "Load Vault"}
                        </Button>
                      </div>
                    </form>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {createdVault && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Security Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Lock className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-sm">Post-Quantum Cryptography</span>
                    </li>
                    <li className="flex items-center">
                      <Lock className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-sm">Progressive Security Levels</span>
                    </li>
                    <li className="flex items-center">
                      <Lock className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-sm">Lattice-Based Encryption</span>
                    </li>
                    <li className="flex items-center">
                      <Lock className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-sm">Time-Based Parameter Hardening</span>
                    </li>
                    <li className="flex items-center">
                      <Lock className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-sm">Automatic Security Assessment</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Value Thresholds</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span>Standard Protection:</span>
                      <span>$0 - $10,000</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Enhanced Protection:</span>
                      <span>$10,000 - $100,000</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Advanced Protection:</span>
                      <span>$100,000 - $1,000,000</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Maximum Security:</span>
                      <span>$1,000,000+</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
        
        <div>
          {createdVault && (
            <QuantumProgressiveShieldCard 
              vaultId={createdVault.id} 
              vaultValue={createdVault.value}
            />
          )}
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 text-sm list-decimal pl-4">
                <li>Create a vault with an initial value</li>
                <li>Security tier is automatically determined based on value</li>
                <li>As value increases, security is automatically strengthened</li>
                <li>Lattice parameters mutate over time for increased security</li>
                <li>Manually upgrade to higher tiers for additional protection</li>
              </ol>
              
              <p className="mt-4 text-sm text-muted-foreground">
                Quantum-resistant encryption protects your assets from both 
                current threats and future quantum computer attacks.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuantumVaultPage;