import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useMultiChain, BlockchainType } from "@/contexts/multi-chain-context";
import { useTon } from "@/contexts/ton-context";
import { CreateVaultForm } from "@/components/vault/create-vault-form";
import VaultTypeSelector, { SpecializedVaultType } from "@/components/vault/vault-type-selector";
import { MediaUploader, UploadedMedia } from "@/components/vault/media-uploader";
import MediaAttachmentsPreview from "@/components/vault/media-attachments-preview";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Clock, File, KeyRound, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { arweaveService } from "@/lib/arweave-service";

const CreateVault = () => {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const { isAnyWalletConnected, connectChain, walletInfo, chainStatus } = useMultiChain();
  const ton = useTon();
  
  const [vaultType, setVaultType] = useState<SpecializedVaultType>("standard");
  const [selectedBlockchain, setSelectedBlockchain] = useState(BlockchainType.TON);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const [showSpecializedTypes, setShowSpecializedTypes] = useState(false);
  const [mediaAttachments, setMediaAttachments] = useState<UploadedMedia[]>([]);
  const [isArweaveInitializing, setIsArweaveInitializing] = useState(false);
  
  useEffect(() => {
    // Parse query params
    const urlParams = new URLSearchParams(window.location.search);
    const typeParam = urlParams.get("type");
    const blockchainParam = urlParams.get("blockchain");
    
    // Also check path for specialized types
    const pathParts = window.location.pathname.split('/');
    const pathType = pathParts[pathParts.length - 1];
    
    // First check if the path contains a valid vault type
    if (pathType && [
      "standard",
      "multi-signature",
      "biometric", 
      "time-lock", 
      "geolocation", 
      "cross-chain", 
      "smart-contract", 
      "dynamic", 
      "nft-powered", 
      "unique"
    ].includes(pathType as SpecializedVaultType)) {
      console.log("Setting initial vault type from URL path:", pathType);
      setVaultType(pathType as SpecializedVaultType);
    }
    // If not in path, check query params
    else if (typeParam && [
      "standard",
      "multi-signature",
      "biometric", 
      "time-lock", 
      "geolocation", 
      "cross-chain", 
      "smart-contract", 
      "dynamic", 
      "nft-powered", 
      "unique"
    ].includes(typeParam as SpecializedVaultType)) {
      console.log("Setting initial vault type from URL param:", typeParam);
      setVaultType(typeParam as SpecializedVaultType);
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
  
  // Initialize Arweave connection for media uploads
  const handleInitArweave = async () => {
    setIsArweaveInitializing(true);
    try {
      // For demonstration, we'll use the Ethereum wallet as the provider
      // In production, you would use the appropriate provider based on selectedBlockchain
      const provider = window.ethereum;
      
      if (!provider) {
        throw new Error("No Ethereum provider found. Please install Metamask.");
      }
      
      const success = await arweaveService.initialize(provider);
      
      if (success) {
        toast({
          title: "Arweave Connected",
          description: "Successfully connected to Arweave for permanent storage",
        });
      } else {
        throw new Error("Failed to initialize Arweave connection");
      }
    } catch (error: any) {
      toast({
        title: "Arweave Connection Failed",
        description: error.message || "Failed to connect to Arweave",
        variant: "destructive",
      });
    } finally {
      setIsArweaveInitializing(false);
    }
  };
  
  // Handle media uploads
  const handleMediaUpload = (files: UploadedMedia[]) => {
    setMediaAttachments(files);
    
    toast({
      title: "Media Added",
      description: `${files.length} file(s) added to vault`,
    });
  };
  
  // Handle removal of media items
  const handleRemoveMedia = (mediaToRemove: UploadedMedia) => {
    setMediaAttachments(current => 
      current.filter(media => media.id !== mediaToRemove.id)
    );
  };
  
  return (
    <section className="py-6 sm:py-12 md:py-16 min-h-screen">
      <div className="container mx-auto px-3 sm:px-4">
        <Button
          variant="ghost" 
          className="mb-4 sm:mb-8 text-gray-400 hover:text-white"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="w-full max-w-4xl mx-auto">
          <div className="relative mb-12 sm:mb-16 overflow-hidden">
            {/* 3D Animated Background Effect */}
            <div className="absolute inset-0 -z-10 bg-[#0A0A0A]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#6B00D7]/10 to-transparent">
                <div className="absolute w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMTA3LCAwLCAyMTUsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiPjwvcmVjdD48L3N2Zz4=')]">
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70" />
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 px-4 py-8 sm:py-12 text-center">
              <div className="inline-block mb-4 animate-float">
                <div className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] p-3 rounded-xl transform rotate-3 shadow-[0_0_25px_rgba(107,0,215,0.5)] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                  <div className="relative transform -rotate-3 backdrop-blur-sm bg-black/30 p-2 rounded-lg border border-white/10">
                    <svg className="h-8 w-8 sm:h-10 sm:w-10 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <h1 className="font-poppins font-bold text-3xl sm:text-4xl md:text-5xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">Create Your Time-Locked Vault</h1>
              
              <p className="text-gray-300 max-w-2xl mx-auto mb-6 text-sm sm:text-base leading-relaxed">
                Design a secure vault to protect your assets with blockchain technology.
                <span className="hidden sm:inline"> Set the time lock period, add beneficiaries, and establish conditions for access.</span>
              </p>
              
              {/* Triple-Chain Security Banner */}
              <div className="max-w-3xl mx-auto bg-gradient-to-r from-[#6B00D7]/10 to-[#FF5AF7]/10 border border-[#6B00D7]/30 rounded-lg p-3 sm:p-4 mb-6 animate-pulse-slow transform hover:scale-[1.01] transition-transform">
                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left">
                  <div className="flex-shrink-0 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] p-2 rounded-full mb-2 sm:mb-0 sm:mr-4 shadow-glow-sm">
                    <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-medium text-white mb-1">Triple-Chain Security Architecture</h3>
                    <p className="text-xs sm:text-sm text-gray-300">Enable our state-of-the-art security system that distributes your vault's security across multiple blockchains for unmatched protection.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Top level Vault Type Selection is removed since we have it in the form */}

          <div className="flex flex-row flex-wrap md:flex-nowrap gap-4 mb-8">
            <Card className="flex-1 min-w-[240px] bg-gradient-to-r from-[#6B00D7]/5 to-[#6B00D7]/10 border-[#6B00D7]/20 hover:border-[#6B00D7]/40 transition-all transform hover:scale-[1.02] hover:shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-row sm:flex-col items-center sm:text-center">
                  <div className="p-2 sm:p-3 rounded-full bg-[#6B00D7]/20 mr-3 sm:mr-0 sm:mb-4 flex-shrink-0">
                    <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-[#6B00D7]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-poppins font-medium text-base sm:text-lg mb-1 sm:mb-2">Unbreakable Security</h3>
                    <p className="text-gray-400 text-xs sm:text-sm">Your assets are secured by blockchain technology, with no centralized access.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="flex-1 min-w-[240px] bg-gradient-to-r from-[#FF5AF7]/5 to-[#FF5AF7]/10 border-[#FF5AF7]/20 hover:border-[#FF5AF7]/40 transition-all transform hover:scale-[1.02] hover:shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-row sm:flex-col items-center sm:text-center">
                  <div className="p-2 sm:p-3 rounded-full bg-[#FF5AF7]/20 mr-3 sm:mr-0 sm:mb-4 flex-shrink-0">
                    <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-[#FF5AF7]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-poppins font-medium text-base sm:text-lg mb-1 sm:mb-2">Flexible Time Locks</h3>
                    <p className="text-gray-400 text-xs sm:text-sm">Set time periods from days to decades with precise unlocking conditions.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="flex-1 min-w-[240px] bg-gradient-to-r from-[#6B00D7]/5 to-[#FF5AF7]/10 border-[#6B00D7]/20 hover:border-[#6B00D7]/40 transition-all transform hover:scale-[1.02] hover:shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-row sm:flex-col items-center sm:text-center">
                  <div className="p-2 sm:p-3 rounded-full bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 mr-3 sm:mr-0 sm:mb-4 flex-shrink-0">
                    <File className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-poppins font-medium text-base sm:text-lg mb-1 sm:mb-2">Media Attachments</h3>
                    <p className="text-gray-400 text-xs sm:text-sm">Include documents, images, videos, or other digital assets in your vault.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Triple-Chain Security Banner */}
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-[#6B00D7]/10 to-[#FF5AF7]/10 border-2 border-dashed border-[#6B00D7]/30 hover:border-[#FF5AF7]/50 transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center mb-3">
                  <div className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] p-2 rounded-full mb-2 sm:mb-0 sm:mr-3">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-poppins font-semibold text-xl text-center sm:text-left bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
                    NEW: Triple-Chain Security Architecture
                  </h3>
                  <span className="mt-2 sm:mt-0 sm:ml-3 px-2 py-1 text-xs font-semibold uppercase tracking-wide bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 text-white rounded">
                    Premium
                  </span>
                </div>
                <p className="text-gray-300 mb-4 text-center sm:text-left">
                  Secure your assets with our revolutionary Triple-Chain Security architecture. This enterprise-grade protection distributes your vault's security across Ethereum, Solana, and TON blockchains for maximum protection against single-chain vulnerabilities.
                </p>
                <p className="text-sm text-gray-400 italic text-center sm:text-left">
                  Enable the Triple-Chain Security option in the vault creation form below to utilize this feature.
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Multi-Signature Vault Banner */}
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-[#FF5AF7]/10 to-[#6B00D7]/10 border-2 border-[#FF5AF7]/30 hover:border-[#FF5AF7]/50 transition-all transform hover:scale-[1.01]">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center mb-3">
                  <div className="bg-gradient-to-r from-[#FF5AF7] to-[#6B00D7] p-2 rounded-full mb-2 sm:mb-0 sm:mr-3">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-poppins font-semibold text-xl text-center sm:text-left bg-clip-text text-transparent bg-gradient-to-r from-[#FF5AF7] to-[#6B00D7]">
                    NEW: Advanced Multi-Signature Vault
                  </h3>
                  <span className="mt-2 sm:mt-0 sm:ml-3 px-2 py-1 text-xs font-semibold uppercase tracking-wide bg-gradient-to-r from-[#FF5AF7]/20 to-[#6B00D7]/20 text-white rounded">
                    Enhanced Security
                  </span>
                </div>
                <p className="text-gray-300 mb-4 text-center sm:text-left">
                  Take your security to the next level with our Multi-Signature Vault solution. Require multiple authorized parties to approve any operation, protecting your assets from single points of failure or compromise.
                </p>
                <div className="flex justify-center sm:justify-start">
                  <Button 
                    onClick={() => navigate('/multi-signature-vault')}
                    className="bg-gradient-to-r from-[#FF5AF7] to-[#6B00D7] hover:from-[#FF6AF7] hover:to-[#7B10E7] shadow-lg shadow-[#FF5AF7]/20"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Create Multi-Signature Vault
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Blockchain Selection */}
          <div className="mb-8">
            <Card className="bg-[#1A1A1A] border-[#6B00D7]/20">
              <CardContent className="p-4 sm:p-6">
                <h3 className="font-poppins font-medium text-xl mb-3 sm:mb-4">Select Blockchain</h3>
                <p className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">Choose which blockchain network to create your vault on:</p>
                
                <div className="flex flex-wrap gap-2 sm:gap-4 mb-6">
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
                  <div className="p-3 sm:p-4 border border-[#FF5AF7]/30 rounded-lg bg-[#1F1F1F] mb-4 shadow-lg shadow-[#FF5AF7]/5">
                    <div className="flex flex-col sm:flex-row sm:items-center mb-3">
                      <div className="flex items-center mb-2 sm:mb-0 sm:mr-3">
                        <KeyRound className="h-5 w-5 text-[#FF5AF7] mr-2" />
                        <h3 className="font-medium text-white text-base sm:text-lg">Connect Your Wallet</h3>
                      </div>
                      <div className="ml-0 sm:ml-auto flex-shrink-0 hidden sm:block">
                        <span className="px-2 py-1 text-xs bg-[#FF5AF7]/10 text-[#FF5AF7] rounded-full border border-[#FF5AF7]/20">
                          Required Step
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-xs sm:text-sm mb-4">
                      Connect your {selectedBlockchain} wallet to create a vault. This ensures your assets 
                      are properly secured and accessible to you when the time lock expires.
                    </p>
                    <div className="flex justify-center sm:justify-start">
                      <Button 
                        onClick={handleConnectWallet}
                        disabled={isConnectingWallet}
                        className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#7B10E7] hover:to-[#FF6AF7] text-white shadow-lg shadow-[#6B00D7]/10"
                      >
                        {isConnectingWallet ? (
                          <>
                            <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <KeyRound className="h-4 w-4 mr-2" />
                            Connect {selectedBlockchain} Wallet
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 sm:p-4 border border-[#6B00D7]/30 rounded-lg bg-[#1F1F1F] mb-4 shadow-lg shadow-[#6B00D7]/5">
                    <div className="flex items-center">
                      <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      </div>
                      <div>
                        <h3 className="font-medium text-white text-base sm:text-lg">{selectedBlockchain} Wallet Connected</h3>
                        <p className="text-gray-400 text-xs sm:text-sm">
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
            onVaultTypeChange={(type) => {
              console.log("Parent receiving vault type change:", type);
              setVaultType(type);
            }}
          />
          
          {/* Media Attachments Section */}
          <Card className="mb-6 overflow-hidden bg-black/20 backdrop-blur-sm border border-gray-800">
            <CardContent className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-white mb-2">
                  Media Attachments
                </h3>
                <p className="text-sm text-gray-400">
                  Add images, videos, documents, or other files to be permanently stored with your vault on Arweave network.
                </p>
              </div>
              
              {/* Display current media attachments */}
              {mediaAttachments.length > 0 && (
                <div className="mb-4">
                  <MediaAttachmentsPreview 
                    mediaAttachments={mediaAttachments}
                    onRemove={handleRemoveMedia}
                    showRemove={true}
                  />
                </div>
              )}
              
              {/* Arweave Connection Button */}
              {!arweaveService.isInitialized() && (
                <div className="mb-4">
                  <Button
                    onClick={handleInitArweave}
                    disabled={isArweaveInitializing || !isWalletConnected(BlockchainType.ETHEREUM)}
                    className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90 text-white shadow-lg mb-4"
                  >
                    {isArweaveInitializing ? (
                      <>
                        <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                        Connecting to Arweave...
                      </>
                    ) : (
                      <>
                        Connect to Arweave Storage
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-gray-400">
                    <span className="text-yellow-400">Note:</span> Arweave connection is required for permanent storage of media attachments. Connect your Ethereum wallet first.
                  </p>
                </div>
              )}
              
              {/* Media Uploader */}
              {arweaveService.isInitialized() && (
                <MediaUploader
                  onUploadComplete={handleMediaUpload}
                  maxFiles={10}
                  acceptedFileTypes="image/*,video/*,application/pdf,text/*"
                  maxSizeMB={50}
                  uploadedFiles={mediaAttachments}
                  className="border border-gray-700 rounded-lg p-4"
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CreateVault;