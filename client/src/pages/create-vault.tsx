import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useMultiChain, BlockchainType } from "@/contexts/multi-chain-context";
import { useTon } from "@/contexts/ton-context";
import CreateVaultForm from "@/components/vault/create-vault-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Clock, File, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CreateVault = () => {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const { isAnyWalletConnected, connectChain, walletInfo, chainStatus } = useMultiChain();
  const ton = useTon();
  
  const [vaultType, setVaultType] = useState("legacy");
  const [selectedBlockchain, setSelectedBlockchain] = useState(BlockchainType.TON);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  
  useEffect(() => {
    // Parse query params
    const urlParams = new URLSearchParams(window.location.search);
    const typeParam = urlParams.get("type");
    const blockchainParam = urlParams.get("blockchain");
    
    if (typeParam && ["legacy", "investment", "project", "gift"].includes(typeParam)) {
      setVaultType(typeParam);
    }
    
    if (blockchainParam) {
      const blockchain = blockchainParam as BlockchainType;
      if (Object.values(BlockchainType).includes(blockchain)) {
        setSelectedBlockchain(blockchain);
      }
    }
  }, []);
  
  // Check if wallet is connected for the selected blockchain
  const isWalletConnected = (blockchain: BlockchainType): boolean => {
    return chainStatus[blockchain]?.isConnected || false;
  };
  
  // Get wallet address for the selected blockchain
  const getWalletAddress = (blockchain: BlockchainType): string => {
    switch(blockchain) {
      case BlockchainType.TON:
        return walletInfo.ton?.address || '';
      case BlockchainType.ETHEREUM:
        return walletInfo.ethereum?.address || '';
      case BlockchainType.SOLANA:
        return walletInfo.solana?.address || '';
      default:
        return '';
    }
  };
  
  // Handle wallet connection
  const handleConnectWallet = async () => {
    setIsConnectingWallet(true);
    try {
      await connectChain(selectedBlockchain);
      toast({
        title: "Wallet Connected",
        description: `Successfully connected to ${selectedBlockchain} wallet`,
      });
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || `Failed to connect to ${selectedBlockchain} wallet`,
        variant: "destructive",
      });
    } finally {
      setIsConnectingWallet(false);
    }
  };
  
  return (
    <section className="py-16 min-h-screen">
      <div className="container mx-auto px-4">
        <Button
          variant="ghost" 
          className="mb-8 text-gray-400 hover:text-white"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-poppins font-bold text-3xl mb-2">Create Your Time-Locked Vault</h1>
            <p className="text-gray-400 max-w-2xl mx-auto mb-4">Design a secure vault to protect your assets with blockchain technology. Set the time lock period, add beneficiaries, and establish conditions for access.</p>
            
            <div className="w-full bg-gradient-to-r from-[#6B00D7]/10 to-[#FF5AF7]/10 border border-[#6B00D7]/30 rounded-lg p-4 mb-6 animate-pulse-slow">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] p-2 rounded-full mr-4">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="">
                  <h3 className="text-lg font-medium text-white">Triple-Chain Security Architecture</h3>
                  <p className="text-sm text-gray-300">Enable our state-of-the-art security system that distributes your vault's security across multiple blockchains for unmatched protection.</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-4">
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium bg-[#1A1A1A] text-white border border-gray-700 rounded-l-lg hover:bg-gray-800 focus:z-10 focus:ring-2 focus:ring-[#6B00D7] disabled:opacity-70"
                  disabled
                >
                  <span className="mr-1">⚡</span> Standard Vaults
                </button>
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white border border-[#6B00D7] rounded-r-lg hover:bg-gradient-to-r hover:from-[#7B10E7] hover:to-[#FF6AF7] focus:z-10 focus:ring-2 focus:ring-[#FF5AF7] flex items-center"
                  onClick={() => navigate('/specialized-vault-creation')}
                >
                  <span className="mr-1">🔐</span> Specialized Vaults
                  <span className="inline-flex items-center justify-center ml-2 w-4 h-4 text-xs font-semibold text-white bg-white/20 rounded-full">+</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-gradient-to-r from-[#6B00D7]/5 to-[#6B00D7]/10 border-[#6B00D7]/20 hover:border-[#6B00D7]/40 transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-[#6B00D7]/20 mb-4">
                    <Shield className="h-6 w-6 text-[#6B00D7]" />
                  </div>
                  <h3 className="font-poppins font-medium text-lg mb-2">Unbreakable Security</h3>
                  <p className="text-gray-400 text-sm">Your assets are secured by blockchain technology, with no centralized access.</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-[#FF5AF7]/5 to-[#FF5AF7]/10 border-[#FF5AF7]/20 hover:border-[#FF5AF7]/40 transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-[#FF5AF7]/20 mb-4">
                    <Clock className="h-6 w-6 text-[#FF5AF7]" />
                  </div>
                  <h3 className="font-poppins font-medium text-lg mb-2">Flexible Time Locks</h3>
                  <p className="text-gray-400 text-sm">Set time periods from days to decades with precise unlocking conditions.</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-[#6B00D7]/5 to-[#FF5AF7]/10 border-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 hover:from-[#6B00D7]/40 hover:to-[#FF5AF7]/40 transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 mb-4">
                    <File className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-poppins font-medium text-lg mb-2">Media Attachments</h3>
                  <p className="text-gray-400 text-sm">Include documents, images, videos, or other digital assets in your vault.</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Triple-Chain Security Banner */}
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-[#6B00D7]/10 to-[#FF5AF7]/10 border-2 border-dashed border-[#6B00D7]/30 hover:border-[#FF5AF7]/50 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center mb-3">
                  <div className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] p-2 rounded-full mr-3">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-poppins font-semibold text-xl bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
                    NEW: Triple-Chain Security Architecture
                  </h3>
                  <span className="ml-3 px-2 py-1 text-xs font-semibold uppercase tracking-wide bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 text-white rounded">
                    Premium
                  </span>
                </div>
                <p className="text-gray-300 mb-4">
                  Secure your assets with our revolutionary Triple-Chain Security architecture. This enterprise-grade protection distributes your vault's security across Ethereum, Solana, and TON blockchains for maximum protection against single-chain vulnerabilities.
                </p>
                <p className="text-sm text-gray-400 italic">
                  Enable the Triple-Chain Security option in the vault creation form below to utilize this feature.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Blockchain Selection */}
          <div className="mb-8">
            <Card className="bg-[#1A1A1A] border-[#6B00D7]/20">
              <CardContent className="p-6">
                <h3 className="font-poppins font-medium text-xl mb-4">Select Blockchain</h3>
                <p className="text-gray-400 mb-4">Choose which blockchain network to create your vault on:</p>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <Button 
                    variant={selectedBlockchain === BlockchainType.TON ? "default" : "outline"}
                    className={selectedBlockchain === BlockchainType.TON ? 
                      "bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#7B10E7] hover:to-[#FF6AF7] border-none" : 
                      "border-[#6B00D7]/30 hover:border-[#6B00D7]/60 text-gray-300"}
                    onClick={() => setSelectedBlockchain(BlockchainType.TON)}
                  >
                    <div className="h-4 w-4 mr-2 rounded-full bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center">
                      💎
                    </div>
                    TON Network
                  </Button>
                  
                  <Button 
                    variant={selectedBlockchain === BlockchainType.ETHEREUM ? "default" : "outline"}
                    className={selectedBlockchain === BlockchainType.ETHEREUM ? 
                      "bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#7B10E7] hover:to-[#FF6AF7] border-none" : 
                      "border-[#6B00D7]/30 hover:border-[#6B00D7]/60 text-gray-300"}
                    onClick={() => setSelectedBlockchain(BlockchainType.ETHEREUM)}
                  >
                    <div className="h-4 w-4 mr-2 rounded-full bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center">
                      Ξ
                    </div>
                    Ethereum
                  </Button>
                  
                  <Button 
                    variant={selectedBlockchain === BlockchainType.SOLANA ? "default" : "outline"}
                    className={selectedBlockchain === BlockchainType.SOLANA ? 
                      "bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#7B10E7] hover:to-[#FF6AF7] border-none" : 
                      "border-[#6B00D7]/30 hover:border-[#6B00D7]/60 text-gray-300"}
                    onClick={() => setSelectedBlockchain(BlockchainType.SOLANA)}
                  >
                    <div className="h-4 w-4 mr-2 rounded-full bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center">
                      ◎
                    </div>
                    Solana
                  </Button>
                </div>
                
                {/* Wallet Connection Status */}
                {!isWalletConnected(selectedBlockchain) ? (
                  <div className="p-4 border border-[#FF5AF7]/30 rounded-lg bg-[#1F1F1F] mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Wallet className="h-5 w-5 text-[#FF5AF7]" />
                      <h3 className="font-medium text-white">Connect Your Wallet</h3>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">
                      Connect your {selectedBlockchain} wallet to create a vault. This ensures your assets 
                      are properly secured and accessible to you when the time lock expires.
                    </p>
                    <Button 
                      onClick={handleConnectWallet}
                      disabled={isConnectingWallet}
                      className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#7B10E7] hover:to-[#FF6AF7] text-white w-full sm:w-auto"
                    >
                      {isConnectingWallet ? (
                        <>
                          <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <Wallet className="h-4 w-4 mr-2" />
                          Connect {selectedBlockchain} Wallet
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="p-4 border border-[#6B00D7]/30 rounded-lg bg-[#1F1F1F] mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center">
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{selectedBlockchain} Wallet Connected</h3>
                        <p className="text-gray-400 text-sm">
                          {getWalletAddress(selectedBlockchain) ? 
                            `${getWalletAddress(selectedBlockchain).substring(0, 6)}...${getWalletAddress(selectedBlockchain).substring(getWalletAddress(selectedBlockchain).length - 4)}` : 
                            "Connected"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <CreateVaultForm 
            initialVaultType={vaultType} 
            selectedBlockchain={selectedBlockchain}
            isWalletConnected={isWalletConnected(selectedBlockchain)}
            walletInfo={walletInfo}
            ton={ton}
          />
        </div>
      </div>
    </section>
  );
};

export default CreateVault;
