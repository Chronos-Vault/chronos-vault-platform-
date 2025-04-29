/**
 * Contract Deployment Panel Component
 * 
 * Provides an interface for testing the contract deployment API endpoints
 * for Chronos Vault smart contracts across multiple blockchains
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, PlusCircle, Trash2, Check, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

// Contract types
interface ChainContract {
  id: number;
  blockchain: string;
  contractType: string;
  contractName: string;
  contractAddress: string;
  network: string;
  deployedAt: string;
  abiReference?: string | null;
  deploymentTx?: string | null;
  isActive: boolean;
}

interface ContractForm {
  blockchain: string;
  contractType: string;
  contractName: string;
  contractAddress: string;
  network: string;
  abiReference?: string;
  deploymentTx?: string;
}

export function ContractDeploymentPanel() {
  const [contracts, setContracts] = useState<ChainContract[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ContractForm>({
    blockchain: 'ethereum',
    contractType: 'vault',
    contractName: '',
    contractAddress: '',
    network: 'testnet',
    abiReference: '',
    deploymentTx: ''
  });
  const { toast } = useToast();
  const [filterBlockchain, setFilterBlockchain] = useState<string>('all');

  // Load contracts on component mount
  useEffect(() => {
    fetchContracts();
  }, []);

  // Fetch all deployed contracts
  const fetchContracts = async () => {
    setLoading(true);
    try {
      const response = await apiRequest('GET', '/api/contracts');
      const data = await response.json();
      setContracts(data);
    } catch (error) {
      console.error('Error fetching contracts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load deployed contracts',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Register a new contract
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.contractName || !formData.contractAddress) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest('POST', '/api/contracts', formData);
      
      if (response.ok) {
        const newContract = await response.json();
        setContracts(prev => [...prev, newContract]);
        
        toast({
          title: 'Success',
          description: `Contract ${formData.contractName} deployed successfully`,
          variant: 'default'
        });
        
        // Reset form
        setFormData({
          blockchain: 'ethereum',
          contractType: 'vault',
          contractName: '',
          contractAddress: '',
          network: 'testnet',
          abiReference: '',
          deploymentTx: ''
        });
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to register contract');
      }
    } catch (error) {
      console.error('Error registering contract:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to register contract',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete a contract
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this contract? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest('DELETE', `/api/contracts/${id}`);
      
      if (response.ok) {
        setContracts(prev => prev.filter(contract => contract.id !== id));
        
        toast({
          title: 'Success',
          description: 'Contract deleted successfully',
          variant: 'default'
        });
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete contract');
      }
    } catch (error) {
      console.error('Error deleting contract:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete contract',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Get blockchain specific badge color
  const getBlockchainBadge = (blockchain: string) => {
    switch (blockchain.toLowerCase()) {
      case 'ethereum':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500">Ethereum</Badge>;
      case 'solana':
        return <Badge variant="outline" className="bg-purple-500/10 text-purple-500">Solana</Badge>;
      case 'ton':
        return <Badge variant="outline" className="bg-cyan-500/10 text-cyan-500">TON</Badge>;
      default:
        return <Badge variant="outline">{blockchain}</Badge>;
    }
  };

  // Get contract type badge color
  const getContractTypeBadge = (type: string) => {
    switch (type.toLowerCase()) {
      case 'vault':
        return <Badge variant="outline" className="bg-green-500/10 text-green-500">Vault</Badge>;
      case 'bridge':
        return <Badge variant="outline" className="bg-orange-500/10 text-orange-500">Bridge</Badge>;
      case 'factory':
        return <Badge variant="outline" className="bg-pink-500/10 text-pink-500">Factory</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  // Get network badge color
  const getNetworkBadge = (network: string) => {
    switch (network.toLowerCase()) {
      case 'mainnet':
        return <Badge variant="outline" className="bg-red-500/10 text-red-500">Mainnet</Badge>;
      case 'testnet':
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">Testnet</Badge>;
      case 'devnet':
        return <Badge variant="outline" className="bg-gray-500/10 text-gray-500">Devnet</Badge>;
      default:
        return <Badge variant="outline">{network}</Badge>;
    }
  };

  // Filter contracts by blockchain
  const filteredContracts = filterBlockchain === 'all' 
    ? contracts 
    : contracts.filter(contract => contract.blockchain.toLowerCase() === filterBlockchain);

  // Truncate long strings for display
  const truncateAddress = (address: string) => {
    if (!address) return '';
    return address.length > 10 ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : address;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-background border-border shadow-md">
        <CardHeader className="bg-gradient-to-r from-[#6B00D7]/10 to-[#FF5AF7]/10 rounded-t-lg">
          <CardTitle className="text-xl text-foreground">Contract Deployment Management</CardTitle>
          <CardDescription className="text-muted-foreground">
            Deploy and manage smart contracts across multiple blockchains
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Contract Registration Form */}
            <div className="md:col-span-1">
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-medium mb-4">Register New Contract</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="blockchain">Blockchain</Label>
                  <Select 
                    value={formData.blockchain} 
                    onValueChange={(value) => handleSelectChange('blockchain', value)}
                  >
                    <SelectTrigger id="blockchain">
                      <SelectValue placeholder="Select blockchain" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ethereum">Ethereum</SelectItem>
                      <SelectItem value="solana">Solana</SelectItem>
                      <SelectItem value="ton">TON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contractType">Contract Type</Label>
                  <Select 
                    value={formData.contractType} 
                    onValueChange={(value) => handleSelectChange('contractType', value)}
                  >
                    <SelectTrigger id="contractType">
                      <SelectValue placeholder="Select contract type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vault">Vault</SelectItem>
                      <SelectItem value="bridge">Bridge</SelectItem>
                      <SelectItem value="factory">Factory</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contractName">Contract Name</Label>
                  <Input 
                    id="contractName"
                    name="contractName"
                    value={formData.contractName}
                    onChange={handleInputChange}
                    placeholder="e.g., Chronos Vault V1"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contractAddress">Contract Address</Label>
                  <Input 
                    id="contractAddress"
                    name="contractAddress"
                    value={formData.contractAddress}
                    onChange={handleInputChange}
                    placeholder="0x..."
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="network">Network</Label>
                  <Select 
                    value={formData.network} 
                    onValueChange={(value) => handleSelectChange('network', value)}
                  >
                    <SelectTrigger id="network">
                      <SelectValue placeholder="Select network" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mainnet">Mainnet</SelectItem>
                      <SelectItem value="testnet">Testnet</SelectItem>
                      <SelectItem value="devnet">Devnet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deploymentTx">Deployment Transaction (Optional)</Label>
                  <Input 
                    id="deploymentTx"
                    name="deploymentTx"
                    value={formData.deploymentTx || ''}
                    onChange={handleInputChange}
                    placeholder="Transaction hash"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="abiReference">ABI Reference (Optional)</Label>
                  <Input 
                    id="abiReference"
                    name="abiReference"
                    value={formData.abiReference || ''}
                    onChange={handleInputChange}
                    placeholder="IPFS hash or URL"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-[#6B00D7] to-[#9242FC] hover:from-[#5A00B3] hover:to-[#7E36DD]"
                  disabled={loading}
                >
                  {loading ? (
                    <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Registering...</>
                  ) : (
                    <><PlusCircle className="mr-2 h-4 w-4" /> Register Contract</>
                  )}
                </Button>
              </form>
            </div>
            
            {/* Deployed Contracts List */}
            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Deployed Contracts</h3>
                
                <div className="flex gap-2">
                  <Select 
                    value={filterBlockchain} 
                    onValueChange={setFilterBlockchain}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Filter by chain" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Chains</SelectItem>
                      <SelectItem value="ethereum">Ethereum</SelectItem>
                      <SelectItem value="solana">Solana</SelectItem>
                      <SelectItem value="ton">TON</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={fetchContracts}
                    disabled={loading}
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>
              
              {filteredContracts.length === 0 ? (
                <div className="bg-muted/30 rounded-lg p-10 text-center">
                  <AlertCircle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-foreground mb-2">No Contracts Found</h4>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    {loading ? 
                      'Loading contracts...' : 
                      'Register your first smart contract by filling out the form.'}
                  </p>
                </div>
              ) : (
                <div className="border border-border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Blockchain</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Network</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredContracts.map((contract) => (
                        <TableRow key={contract.id}>
                          <TableCell>{getBlockchainBadge(contract.blockchain)}</TableCell>
                          <TableCell>{getContractTypeBadge(contract.contractType)}</TableCell>
                          <TableCell className="font-medium">{contract.contractName}</TableCell>
                          <TableCell className="font-mono text-xs">
                            <span title={contract.contractAddress}>
                              {truncateAddress(contract.contractAddress)}
                            </span>
                          </TableCell>
                          <TableCell>{getNetworkBadge(contract.network)}</TableCell>
                          <TableCell>
                            {contract.isActive ? (
                              <Badge variant="outline" className="bg-green-500/10 text-green-500">
                                <Check className="mr-1 h-3 w-3" /> Active
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-gray-500/10 text-gray-500">
                                Inactive
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDelete(contract.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-100/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ContractDeploymentPanel;
