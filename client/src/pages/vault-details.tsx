import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useMultiChain, BlockchainType } from "@/contexts/multi-chain-context";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Shield, Lock, Unlock, User, FileText, AlertTriangle, Loader2, ExternalLink } from "lucide-react";
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
}

const VaultDetails = () => {
  const params = useParams();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const { isAnyWalletConnected, walletInfo, chainStatus } = useMultiChain();
  
  const [isLoading, setIsLoading] = useState(true);
  const [vault, setVault] = useState<Vault | null>(null);

  // Sample vault data for demonstration
  const sampleVaults: Record<string, Vault> = {
    "1": {
      id: "1",
      name: "Savings Vault",
      description: "Long-term savings for future planning with advanced security measures applied. This vault uses triple-chain validation.",
      blockchain: BlockchainType.TON,
      unlockTime: Date.now() + 180 * 24 * 60 * 60 * 1000, // 180 days from now
      amount: "15.75",
      recipient: walletInfo.ton?.address || "EQAbc123...",
      isLocked: true,
      securityLevel: "enhanced",
      createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
      contractAddress: "EQD5xS7dQNM5mZu5hn_qDsHjUeJRVGbQYSCsB6MsJMP2zKqL",
      txHash: "97c17cd1afd8a5663c04fc93192b351dab6a88afd7c7ac847e9e457fc5fd034c"
    },
    "2": {
      id: "2",
      name: "Education Fund",
      description: "College savings for my children that will unlock in 3 years. This vault is protected by enhanced security measures.",
      blockchain: BlockchainType.TON,
      unlockTime: Date.now() + 365 * 3 * 24 * 60 * 60 * 1000, // 3 years from now
      amount: "50.0",
      recipient: walletInfo.ton?.address || "EQAbc123...",
      isLocked: true,
      securityLevel: "maximum",
      createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000, // 60 days ago
      contractAddress: "EQCT239WSjM_w4pcwSZmp9VvZ-fDnLNMnYpKwZIYhQHVBvuR",
      txHash: "ae8c5e37e9bf2c28e19f8f9adeabd1e01f3d7d49322bd9d5a6128e081622845c"
    },
    "3": {
      id: "3",
      name: "Retirement Test",
      description: "Small test vault for retirement planning. This vault has already been unlocked and funds can be withdrawn.",
      blockchain: BlockchainType.ETHEREUM,
      unlockTime: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago (unlocked)
      amount: "0.05",
      recipient: walletInfo.ethereum?.address || "0x1234...",
      isLocked: false,
      securityLevel: "standard",
      createdAt: Date.now() - 35 * 24 * 60 * 60 * 1000, // 35 days ago
      contractAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      txHash: "0xe6c5378a4e1a0c7fd5219fa70a0903db8ed1d4a67be5f6d83fb2fb11a5214943"
    }
  };

  // Load vault when component mounts
  useEffect(() => {
    const loadVault = async () => {
      setIsLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const vaultId = params.id;
        
        if (vaultId && sampleVaults[vaultId]) {
          setVault(sampleVaults[vaultId]);
        } else {
          toast({
            title: "Vault not found",
            description: "The requested vault could not be found.",
            variant: "destructive",
          });
          navigate("/my-vaults");
        }
      } catch (error) {
        console.error("Error loading vault:", error);
        toast({
          title: "Failed to load vault",
          description: "There was an error loading the vault details. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadVault();
  }, [params.id]);

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

  // Format date for display
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format address for display
  const formatAddress = (address: string): string => {
    if (!address) return "";
    if (address.length <= 10) return address;
    return `${address.substring(0, 10)}...${address.substring(address.length - 4)}`;
  };

  // Get blockchain explorer URL
  const getExplorerUrl = (blockchain: BlockchainType, type: 'address' | 'tx', hash: string): string => {
    switch (blockchain) {
      case BlockchainType.TON:
        return `https://testnet.tonscan.org/${type === 'address' ? 'address' : 'tx'}/${hash}`;
      case BlockchainType.ETHEREUM:
        return `https://sepolia.etherscan.io/${type === 'address' ? 'address' : 'tx'}/${hash}`;
      case BlockchainType.SOLANA:
        return `https://explorer.solana.com/${type === 'address' ? 'address' : 'tx'}/${hash}?cluster=devnet`;
      default:
        return '#';
    }
  };

  // Get security level label
  const getSecurityLevelInfo = (level: string) => {
    switch (level) {
      case 'standard':
        return {
          label: 'Standard Security',
          description: 'Basic security with single-chain protection',
          color: 'bg-[#6B00D7]/20 text-[#FF5AF7]'
        };
      case 'enhanced':
        return {
          label: 'Enhanced Security',
          description: 'Multi-chain protection with dual verification',
          color: 'bg-[#6B00D7]/30 text-[#FF5AF7]'
        };
      case 'maximum':
        return {
          label: 'Maximum Security',
          description: 'Triple-chain protection with zero-knowledge privacy',
          color: 'bg-[#6B00D7]/40 text-[#FF5AF7]'
        };
      default:
        return {
          label: 'Unknown Security Level',
          description: 'Security information unavailable',
          color: 'bg-gray-500/20 text-gray-400'
        };
    }
  };

  // Handle withdraw funds (if unlocked)
  const handleWithdraw = () => {
    if (!vault || vault.isLocked) return;
    
    toast({
      title: "Withdrawal Initiated",
      description: "This functionality will be available in the next release.",
    });
  };

  if (isLoading) {
    return (
      <section className="py-16 min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#121212]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-[#6B00D7]" />
          </div>
        </div>
      </section>
    );
  }

  if (!vault) {
    return (
      <section className="py-16 min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#121212]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Button
              variant="ghost" 
              className="mb-8 text-gray-400 hover:text-white"
              onClick={() => navigate("/my-vaults")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to My Vaults
            </Button>
            
            <Card className="bg-[#1A1A1A] border-[#FF5AF7]/30 mb-8">
              <CardContent className="p-10 text-center">
                <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-[#FF5AF7]" />
                <h3 className="text-2xl font-semibold text-white mb-2">Vault Not Found</h3>
                <p className="text-gray-400 mb-6">The vault you're looking for doesn't exist or you don't have access to it.</p>
                <Button 
                  className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]"
                  onClick={() => navigate("/my-vaults")}
                >
                  Return to My Vaults
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  const securityInfo = getSecurityLevelInfo(vault.securityLevel);

  return (
    <section className="py-16 min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#121212]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost" 
            className="mb-8 text-gray-400 hover:text-white"
            onClick={() => navigate("/my-vaults")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Vaults
          </Button>
          
          <div className="relative">
            <div className={`absolute top-0 left-0 w-full h-1 ${vault.isLocked ? 'bg-[#6B00D7]' : 'bg-[#4CAF50]'}`}></div>
            
            <Card className="bg-[#1A1A1A]/90 border-[#6B00D7]/30 shadow-xl overflow-hidden relative pt-4">
              <div className="absolute top-4 right-4">
                <Badge className={vault.isLocked ? 'bg-[#6B00D7]/20 text-[#FF5AF7] hover:bg-[#6B00D7]/30' : 'bg-[#4CAF50]/20 text-[#4CAF50] hover:bg-[#4CAF50]/30'}>
                  {vault.isLocked ? (
                    <>
                      <Lock className="h-3 w-3 mr-1" />
                      Locked
                    </>
                  ) : (
                    <>
                      <Unlock className="h-3 w-3 mr-1" />
                      Unlocked
                    </>
                  )}
                </Badge>
              </div>
              
              <CardHeader>
                <CardTitle className="text-3xl font-poppins">{vault.name}</CardTitle>
                {vault.description && (
                  <CardDescription className="text-gray-400 mt-2">
                    {vault.description}
                  </CardDescription>
                )}
              </CardHeader>
              
              <CardContent className="space-y-8">
                {/* Key Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-[#161616] border-[#6B00D7]/10">
                    <CardHeader className="pb-2">
                      <h3 className="text-lg font-medium text-white">Vault Information</h3>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-400">Blockchain</div>
                        <div className="flex items-center">
                          <div className="h-5 w-5 mr-2 rounded-full bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center">
                            {vault.blockchain === BlockchainType.TON ? '💎' : 
                             vault.blockchain === BlockchainType.ETHEREUM ? 'Ξ' : 
                             vault.blockchain === BlockchainType.SOLANA ? '◎' : '₿'}
                          </div>
                          <span className="font-medium">{formatBlockchainName(vault.blockchain)}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-sm text-gray-400">Amount</div>
                        <div className="font-medium text-white">
                          {vault.amount} {vault.blockchain === BlockchainType.TON ? 'TON' : 
                                        vault.blockchain === BlockchainType.ETHEREUM ? 'ETH' : 
                                        vault.blockchain === BlockchainType.SOLANA ? 'SOL' : 'BTC'}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-sm text-gray-400">Security Level</div>
                        <div>
                          <Badge className={securityInfo.color}>
                            <Shield className="h-3 w-3 mr-1" />
                            {securityInfo.label}
                          </Badge>
                          <div className="text-xs text-gray-400 mt-1">{securityInfo.description}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-[#161616] border-[#6B00D7]/10">
                    <CardHeader className="pb-2">
                      <h3 className="text-lg font-medium text-white">Time Information</h3>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-400">Created On</div>
                        <div className="font-medium text-white">{formatDate(vault.createdAt)}</div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-sm text-gray-400">Unlocks On</div>
                        <div className="font-medium text-white">{formatDate(vault.unlockTime)}</div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-sm text-gray-400">Status</div>
                        <div className="font-medium">
                          {vault.isLocked ? (
                            <div className="text-[#FF5AF7]">
                              <Clock className="h-4 w-4 inline-block mr-1" />
                              Time-locked until {formatDate(vault.unlockTime)}
                            </div>
                          ) : (
                            <div className="text-[#4CAF50]">
                              <Unlock className="h-4 w-4 inline-block mr-1" />
                              Unlocked and available for withdrawal
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Blockchain Details */}
                <Card className="bg-[#161616] border-[#6B00D7]/10">
                  <CardHeader className="pb-2">
                    <h3 className="text-lg font-medium text-white">Blockchain Details</h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-400">Recipient Address</div>
                        <div className="font-medium text-white flex items-center">
                          <User className="h-4 w-4 mr-1 text-gray-400" />
                          {formatAddress(vault.recipient)}
                          {vault.recipient && (
                            <a 
                              href={getExplorerUrl(vault.blockchain, 'address', vault.recipient)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-2 text-[#FF5AF7] hover:text-[#6B00D7] transition-colors"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-sm text-gray-400">Contract Address</div>
                        <div className="font-medium text-white flex items-center">
                          <FileText className="h-4 w-4 mr-1 text-gray-400" />
                          {vault.contractAddress ? formatAddress(vault.contractAddress) : 'N/A'}
                          {vault.contractAddress && (
                            <a 
                              href={getExplorerUrl(vault.blockchain, 'address', vault.contractAddress)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-2 text-[#FF5AF7] hover:text-[#6B00D7] transition-colors"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-sm text-gray-400">Transaction Hash</div>
                        <div className="font-medium text-white flex items-center">
                          <FileText className="h-4 w-4 mr-1 text-gray-400" />
                          {vault.txHash ? formatAddress(vault.txHash) : 'N/A'}
                          {vault.txHash && (
                            <a 
                              href={getExplorerUrl(vault.blockchain, 'tx', vault.txHash)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-2 text-[#FF5AF7] hover:text-[#6B00D7] transition-colors"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-sm text-gray-400">Explorer</div>
                        <div className="font-medium text-white">
                          <a 
                            href={getExplorerUrl(vault.blockchain, 'address', vault.contractAddress || vault.recipient)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#FF5AF7] hover:text-[#6B00D7] transition-colors flex items-center"
                          >
                            View on {vault.blockchain === BlockchainType.TON ? 'TONScan' : 
                                    vault.blockchain === BlockchainType.ETHEREUM ? 'Etherscan' : 
                                    vault.blockchain === BlockchainType.SOLANA ? 'Solana Explorer' : 'Explorer'}
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
              
              <CardFooter className="flex justify-end space-x-4 pt-4 border-t border-[#6B00D7]/10">
                <Button
                  variant="outline"
                  className="border-[#6B00D7]/40 text-[#FF5AF7] hover:bg-[#6B00D7]/10"
                  onClick={() => navigate("/my-vaults")}
                >
                  Back to My Vaults
                </Button>
                
                {!vault.isLocked && (
                  <Button
                    className="bg-gradient-to-r from-[#4CAF50] to-[#45a049] hover:from-[#45a049] hover:to-[#409945] text-white"
                    onClick={handleWithdraw}
                  >
                    <Unlock className="h-4 w-4 mr-2" />
                    Withdraw Funds
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VaultDetails;
