import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMultiChain, BlockchainType } from "@/contexts/multi-chain-context";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Clock, Lock, Unlock, ArrowRight, AlertTriangle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Vault interface
interface Vault {
  id: string;
  name: string;
  description?: string;
  blockchain: BlockchainType;
  unlockTime: number;
  amount: string;
  recipient: string;
  isLocked: boolean;
  securityLevel: string;
  createdAt: number;
  contractAddress?: string;
  txHash?: string;
  type?: string; // Add vault type for specialized vaults
  value?: number; // For quantum progressive vaults
}

const MyVaults = () => {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const { isAnyWalletConnected, walletInfo, chainStatus } = useMultiChain();
  
  type ActiveBlockchainType = BlockchainType | 'all';
  const [activeBlockchain, setActiveBlockchain] = useState<ActiveBlockchainType>(BlockchainType.TON);
  const [isLoading, setIsLoading] = useState(true);
  const [vaults, setVaults] = useState<Vault[]>([]);

  // Sample vaults for demonstration - these would come from an API in a real implementation
  const sampleVaults: Vault[] = [
    {
      id: "1",
      name: "Savings Vault",
      description: "Long-term savings for future planning",
      blockchain: BlockchainType.TON,
      unlockTime: Date.now() + 180 * 24 * 60 * 60 * 1000, // 180 days from now
      amount: "15.75",
      recipient: walletInfo.ton.address || "EQAbc123...",
      isLocked: true,
      securityLevel: "standard",
      createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
      contractAddress: "EQD5xS7dQNM5mZu5hn_qDsHjUeJRVGbQYSCsB6MsJMP2zKqL",
      txHash: "97c17cd1afd8a5663c04fc93192b351dab6a88afd7c7ac847e9e457fc5fd034c"
    },
    {
      id: "2",
      name: "Education Fund",
      description: "College savings for my children",
      blockchain: BlockchainType.TON,
      unlockTime: Date.now() + 365 * 3 * 24 * 60 * 60 * 1000, // 3 years from now
      amount: "50.0",
      recipient: walletInfo.ton.address || "EQAbc123...",
      isLocked: true,
      securityLevel: "enhanced",
      createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000, // 60 days ago
      contractAddress: "EQCT239WSjM_w4pcwSZmp9VvZ-fDnLNMnYpKwZIYhQHVBvuR",
      txHash: "ae8c5e37e9bf2c28e19f8f9adeabd1e01f3d7d49322bd9d5a6128e081622845c"
    },
    {
      id: "3",
      name: "Retirement Test",
      description: "Small test vault for retirement planning",
      blockchain: BlockchainType.ETHEREUM,
      unlockTime: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago (unlocked)
      amount: "0.05",
      recipient: walletInfo.ethereum.address || "0x1234...",
      isLocked: false,
      securityLevel: "standard",
      createdAt: Date.now() - 35 * 24 * 60 * 60 * 1000, // 35 days ago
      contractAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      txHash: "0xe6c5378a4e1a0c7fd5219fa70a0903db8ed1d4a67be5f6d83fb2fb11a5214943"
    },
    {
      id: "quantum-vault-1",
      name: "High-Value Quantum Vault",
      description: "Quantum-resistant vault with progressive security",
      blockchain: BlockchainType.TON,
      unlockTime: Date.now() + 365 * 2 * 24 * 60 * 60 * 1000, // 2 years from now
      amount: "125000",
      recipient: walletInfo.ton.address || "EQAbc123...",
      isLocked: true,
      securityLevel: "advanced",
      createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000, // 20 days ago
      contractAddress: "EQBvK49sjphKWXBw-mHaxjrmoIe_iFx-FNbKfzOWOUJrmdkT",
      txHash: "5e9c7b3d8a4f2e1d0c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d",
      type: "quantum-progressive",
      value: 125000
    },
    {
      id: "quantum-vault-2",
      name: "Medium Security Quantum Vault",
      description: "Medium-value assets with enhanced quantum protection",
      blockchain: BlockchainType.ETHEREUM,
      unlockTime: Date.now() + 365 * 1 * 24 * 60 * 60 * 1000, // 1 year from now
      amount: "25000",
      recipient: walletInfo.ethereum.address || "0x1234...",
      isLocked: true,
      securityLevel: "enhanced",
      createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000, // 15 days ago
      contractAddress: "0x89B4d7f12a5096edC84344D2c1EE10bCDEF7B8CA",
      txHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
      type: "quantum-progressive",
      value: 25000
    }
  ];

  // Load vaults when component mounts
  useEffect(() => {
    // This would be an API call in a real implementation
    const loadVaults = async () => {
      setIsLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setVaults(sampleVaults);
      } catch (error) {
        console.error("Error loading vaults:", error);
        toast({
          title: "Failed to load vaults",
          description: "There was an error loading your vaults. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadVaults();
  }, []);

  // Format time remaining
  const formatTimeRemaining = (unlockTime: number) => {
    const now = Date.now();
    const diff = unlockTime - now;
    
    if (diff <= 0) return "Unlocked";
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 365) {
      const years = (days / 365).toFixed(1);
      return `${years} years`;
    } else if (days > 30) {
      const months = Math.floor(days / 30);
      return `${months} months`;
    } else if (days > 0) {
      return `${days} days`;
    } else if (hours > 0) {
      return `${hours} hours`;
    } else {
      return `${minutes} minutes`;
    }
  };

  // Format blockchain name
  const formatBlockchainName = (blockchain: BlockchainType): string => {
    switch (blockchain) {
      case BlockchainType.TON:
        return "TON";
      case BlockchainType.ETHEREUM:
        return "Ethereum";
      case BlockchainType.SOLANA:
        return "Solana";
      case BlockchainType.BITCOIN:
        return "Bitcoin";
      default:
        return blockchain;
    }
  };

  // Format address for display
  const formatAddress = (address: string): string => {
    if (!address) return "";
    if (address.length <= 10) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Filter vaults by blockchain
  const filteredVaults = activeBlockchain === 'all' 
    ? vaults 
    : vaults.filter(vault => vault.blockchain === activeBlockchain);

  // Handle tab change
  const handleBlockchainChange = (value: string) => {
    setActiveBlockchain(value as BlockchainType | 'all');
  };

  // View vault details
  const viewVaultDetails = (vaultId: string) => {
    // Get the vault object
    const vault = vaults.find(v => v.id === vaultId);
    
    // Direct to the appropriate details page based on vault type
    if (vault?.type === 'quantum-progressive') {
      setLocation(`/quantum-vault/${vaultId}`);
    } else {
      setLocation(`/vault/${vaultId}`);
    }
  };

  return (
    <section className="py-16 min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#121212]">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h1 className="font-poppins font-bold text-4xl mb-2">My Vaults</h1>
              <p className="text-gray-400">
                Manage your time-locked vaults across multiple blockchains
              </p>
            </div>
            <Button
              className="mt-4 md:mt-0 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5500AB] hover:to-[#FF46E8] text-white"
              onClick={() => setLocation("/vault-types")}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Create New Vault
            </Button>
          </div>
          
          {!isAnyWalletConnected ? (
            <Card className="bg-[#1A1A1A] border-[#FF5AF7]/30 mb-8">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <AlertTriangle className="h-10 w-10 text-[#FF5AF7]" />
                  <div>
                    <h3 className="text-xl font-semibold text-white">No wallet connected</h3>
                    <p className="text-gray-400 mt-1">Connect a wallet to view your vaults</p>
                  </div>
                </div>
                <Button 
                  className="mt-4 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]"
                  onClick={() => setLocation("/wallet-manager")}
                >
                  Connect Wallet
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <Tabs defaultValue={BlockchainType.TON} onValueChange={handleBlockchainChange}>
                <TabsList className="bg-[#1A1A1A] mb-8">
                  <TabsTrigger value="all">All Chains</TabsTrigger>
                  <TabsTrigger value={BlockchainType.TON}>TON</TabsTrigger>
                  <TabsTrigger value={BlockchainType.ETHEREUM}>Ethereum</TabsTrigger>
                  <TabsTrigger value={BlockchainType.SOLANA}>Solana</TabsTrigger>
                </TabsList>
              </Tabs>
              
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-12 w-12 animate-spin text-[#6B00D7]" />
                </div>
              ) : filteredVaults.length === 0 ? (
                <Card className="bg-[#1A1A1A] border-[#6B00D7]/30 mb-8">
                  <CardContent className="p-10 text-center">
                    <h3 className="text-xl font-semibold text-white mb-2">No vaults found</h3>
                    <p className="text-gray-400 mb-6">You don't have any vaults on {activeBlockchain === 'all' ? 'any blockchain' : formatBlockchainName(activeBlockchain as BlockchainType)} yet</p>
                    <Button 
                      className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]"
                      onClick={() => setLocation("/vault-types")}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create Your First Vault
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVaults.map((vault) => (
                    <Card key={vault.id} className="bg-[#1A1A1A] border-[#6B00D7]/30 hover:border-[#FF5AF7]/50 transition-all overflow-hidden">
                      <div className={`h-2 w-full ${vault.isLocked ? 'bg-[#6B00D7]' : 'bg-[#4CAF50]'}`}></div>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="font-poppins">{vault.name}</CardTitle>
                            <CardDescription className="mt-1">
                              {vault.description || "No description"}
                            </CardDescription>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <div className={`px-2 py-1 rounded text-xs font-medium ${vault.isLocked ? 'bg-[#6B00D7]/20 text-[#FF5AF7]' : 'bg-[#4CAF50]/20 text-[#4CAF50]'}`}>
                              {vault.isLocked ? 'Locked' : 'Unlocked'}
                            </div>
                            {vault.type === 'quantum-progressive' && (
                              <div className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                                Quantum Shield
                              </div>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Blockchain</span>
                            <span className="text-white text-sm font-medium">{formatBlockchainName(vault.blockchain)}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Amount</span>
                            <span className="text-white text-sm font-medium">
                              {vault.amount} {vault.blockchain === BlockchainType.TON ? 'TON' : 
                                          vault.blockchain === BlockchainType.ETHEREUM ? 'ETH' : 
                                          vault.blockchain === BlockchainType.SOLANA ? 'SOL' : 'CRYPTO'}
                            </span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Time Remaining</span>
                            <span className="text-white text-sm font-medium">{formatTimeRemaining(vault.unlockTime)}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Recipient</span>
                            <span className="text-white text-sm font-medium">{formatAddress(vault.recipient)}</span>
                          </div>
                          
                          {vault.contractAddress && (
                            <div className="flex justify-between">
                              <span className="text-gray-400 text-sm">Contract</span>
                              <span className="text-white text-sm font-medium">{formatAddress(vault.contractAddress)}</span>
                            </div>
                          )}
                          
                          {vault.type === 'quantum-progressive' && (
                            <div className="flex justify-between">
                              <span className="text-gray-400 text-sm">Security Level</span>
                              <span className={`text-sm font-medium ${
                                vault.securityLevel === 'standard' ? 'text-blue-400' : 
                                vault.securityLevel === 'enhanced' ? 'text-indigo-400' : 
                                vault.securityLevel === 'advanced' ? 'text-purple-400' : 
                                'text-red-400'
                              }`}>
                                {vault.securityLevel.charAt(0).toUpperCase() + vault.securityLevel.slice(1)}
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      
                      <CardFooter className="flex justify-end pt-2">
                        <Button 
                          variant="outline" 
                          className="border-[#6B00D7] text-[#FF5AF7] hover:bg-[#6B00D7]/10 hover:text-white"
                          onClick={() => viewVaultDetails(vault.id)}
                        >
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default MyVaults;
