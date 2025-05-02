import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useMultiChain, BlockchainType } from '@/contexts/multi-chain-context';
import { Users, ArrowLeft, Shield, Lock, Wallet, AlertTriangle, Loader2, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSignatureConfig } from '@/components/vault/MultiSignatureConfig';
import { apiRequest } from '@/lib/queryClient';

// Multi-signature configuration type
type MultiSigConfig = {
  threshold: number;
  signers: { address: string; name?: string; weight: number }[];
  timeLimit: number;
  requireGeolocation: boolean;
};

const MultiSignatureVaultPage = () => {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const { isAnyWalletConnected, connectChain, walletInfo, chainStatus } = useMultiChain();
  
  const [activeBlockchain, setActiveBlockchain] = useState<BlockchainType>(BlockchainType.TON);
  const [multiSigConfig, setMultiSigConfig] = useState<MultiSigConfig | null>(null);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [vaultName, setVaultName] = useState('');
  const [vaultDescription, setVaultDescription] = useState('');
  const [assetAmount, setAssetAmount] = useState('0.1');

  // Format display address for readability
  const formatAddress = (address: string) => {
    if (!address) return "";
    if (address.length <= 12) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Check if wallet is connected for the selected blockchain
  const isWalletConnected = (blockchain: BlockchainType): boolean => {
    return chainStatus[blockchain]?.isConnected || false;
  };

  // Handle blockchain selection
  const handleBlockchainChange = (value: BlockchainType) => {
    setActiveBlockchain(value);
  };

  // Handle wallet connection
  const handleConnectWallet = async () => {
    setIsConnectingWallet(true);
    try {
      await connectChain(activeBlockchain);
      toast({
        title: "Wallet Connected",
        description: `Successfully connected to ${activeBlockchain} wallet`,
      });
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || `Failed to connect to ${activeBlockchain} wallet`,
        variant: "destructive",
      });
    } finally {
      setIsConnectingWallet(false);
    }
  };

  // Handle multi-signature configuration change
  const handleMultiSigConfigChange = (config: any) => {
    // Ensure timeLimit is always a number
    const updatedConfig = {
      ...config,
      timeLimit: config.timeLimit || 24 // Default to 24 hours if not provided
    };
    setMultiSigConfig(updatedConfig as MultiSigConfig);
  };

  // Create multi-signature vault
  const handleCreateMultiSigVault = async () => {
    if (!multiSigConfig) {
      toast({
        title: "Configuration Required",
        description: "Please complete the multi-signature configuration",
        variant: "destructive",
      });
      return;
    }

    if (!vaultName) {
      toast({
        title: "Vault Name Required",
        description: "Please provide a name for your multi-signature vault",
        variant: "destructive",
      });
      return;
    }

    if (!isWalletConnected(activeBlockchain)) {
      toast({
        title: "Wallet Connection Required",
        description: `Please connect your ${activeBlockchain} wallet first`,
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      // Get current wallet address
      let ownerAddress = '';
      
      // Handle different blockchain types properly
      if (activeBlockchain === BlockchainType.ETHEREUM) {
        ownerAddress = walletInfo.ethereum.address;
      } else if (activeBlockchain === BlockchainType.SOLANA) {
        ownerAddress = walletInfo.solana.address;
      } else if (activeBlockchain === BlockchainType.TON) {
        ownerAddress = walletInfo.ton.address;
      } else if (activeBlockchain === BlockchainType.BITCOIN) {
        // Note: When Bitcoin wallet info is available, update this
        // Currently using a placeholder since Bitcoin isn't fully implemented
        ownerAddress = '1BitcoinPlaceholderAddress';
      }
      
      if (!ownerAddress) {
        throw new Error("Could not determine owner address");
      }

      // Create the vault via API
      const response = await apiRequest("POST", "/api/vaults", {
        name: vaultName,
        description: vaultDescription,
        vaultType: "multi-signature",
        assetType: activeBlockchain,
        assetAmount,
        timeLockPeriod: multiSigConfig.timeLimit * 3600, // Convert hours to seconds
        metadata: JSON.stringify({
          multiSigConfig,
          securityLevel: "high",
        }),
        multisigEnabled: true,
        ethereumContractAddress: activeBlockchain === BlockchainType.ETHEREUM ? ownerAddress : undefined,
        solanaContractAddress: activeBlockchain === BlockchainType.SOLANA ? ownerAddress : undefined, 
        tonContractAddress: activeBlockchain === BlockchainType.TON ? ownerAddress : undefined,
        bitCoinAddress: activeBlockchain === BlockchainType.BITCOIN ? ownerAddress : undefined,
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Multi-Signature Vault Created",
          description: `Successfully created vault with ${multiSigConfig.signers.length} signers and threshold of ${multiSigConfig.threshold}`,
        });
        
        // Navigate to the vault details or list
        navigate("/my-vaults");
      } else {
        throw new Error(result.message || "Failed to create multi-signature vault");
      }
    } catch (error: any) {
      toast({
        title: "Vault Creation Failed",
        description: error.message || "An error occurred while creating the vault",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <section className="py-16 min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#121212]">
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
          <div className="text-center mb-12">
            <h1 className="font-poppins font-bold text-4xl mb-2">Multi-Signature Vault</h1>
            <p className="text-gray-400 max-w-3xl mx-auto">
              Create a high-security vault that requires multiple signatures for any operation.
              Perfect for team treasuries, family inheritance, or any assets requiring collective decision-making.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <Card className="bg-gradient-to-br from-[#111] to-[#161616] border-[#FF5AF7]/20 hover:border-[#FF5AF7]/40 transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-[#FF5AF7]/10 mb-4">
                    <Users className="h-6 w-6 text-[#FF5AF7]" />
                  </div>
                  <h3 className="font-poppins font-medium text-lg mb-2">Team Consensus</h3>
                  <p className="text-gray-400 text-sm">Requires agreement from multiple parties for any vault operation</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-[#111] to-[#161616] border-[#6B00D7]/20 hover:border-[#6B00D7]/40 transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-[#6B00D7]/10 mb-4">
                    <Shield className="h-6 w-6 text-[#6B00D7]" />
                  </div>
                  <h3 className="font-poppins font-medium text-lg mb-2">Enhanced Security</h3>
                  <p className="text-gray-400 text-sm">Protection against single points of failure or compromise</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-[#111] to-[#161616] border-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 hover:from-[#6B00D7]/40 hover:to-[#FF5AF7]/40 transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-gradient-to-r from-[#6B00D7]/10 to-[#FF5AF7]/10 mb-4">
                    <Lock className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-poppins font-medium text-lg mb-2">Customizable Permissions</h3>
                  <p className="text-gray-400 text-sm">Configure signature weights and approval thresholds to suit your needs</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="border-[#FF5AF7]/30 bg-gradient-to-br from-[#131313] to-[#1A1A1A] shadow-xl mb-10">
            <CardHeader>
              <CardTitle className="text-2xl font-poppins flex items-center">
                <Users className="mr-2 h-6 w-6 text-[#FF5AF7]" />
                Multi-Signature Configuration
              </CardTitle>
              <CardDescription>
                Configure who can access this vault and how many signatures are required
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue={BlockchainType.TON} onValueChange={(value) => handleBlockchainChange(value as BlockchainType)}>
                <TabsList className="grid w-full grid-cols-4 mb-8">
                  <TabsTrigger value={BlockchainType.TON}>TON</TabsTrigger>
                  <TabsTrigger value={BlockchainType.ETHEREUM}>Ethereum</TabsTrigger>
                  <TabsTrigger value={BlockchainType.SOLANA}>Solana</TabsTrigger>
                  <TabsTrigger value={BlockchainType.BITCOIN}>Bitcoin</TabsTrigger>
                </TabsList>
                
                <div className="mb-6">
                  {!isWalletConnected(activeBlockchain) ? (
                    <div className="p-4 border border-[#FF5AF7]/30 rounded-lg bg-[#1F1F1F] mb-6">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertTriangle className="h-5 w-5 text-[#FF5AF7]" />
                        <h3 className="font-medium text-white">Wallet Connection Required</h3>
                      </div>
                      <p className="text-gray-400 text-sm mb-4">
                        Connect your {activeBlockchain} wallet to create a multi-signature vault. 
                        This wallet will be the initial owner and administrator.
                      </p>
                      <Button 
                        onClick={handleConnectWallet}
                        disabled={isConnectingWallet}
                        className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#7B10E7] hover:to-[#FF6AF7] text-white w-full sm:w-auto"
                      >
                        {isConnectingWallet ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <Wallet className="h-4 w-4 mr-2" />
                            Connect {activeBlockchain} Wallet
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="p-4 border border-[#6B00D7]/30 rounded-lg bg-[#1F1F1F] mb-6">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <div>
                          <h3 className="font-medium text-white">{activeBlockchain} Wallet Connected</h3>
                          <p className="text-gray-400 text-sm">
                            {activeBlockchain === BlockchainType.ETHEREUM && formatAddress(walletInfo.ethereum.address || "")}
                            {activeBlockchain === BlockchainType.SOLANA && formatAddress(walletInfo.solana.address || "")}
                            {activeBlockchain === BlockchainType.TON && formatAddress(walletInfo.ton.address || "")}
                            {activeBlockchain === BlockchainType.BITCOIN && formatAddress('1BitcoinPlaceholderAddress')}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="vaultName">Vault Name</Label>
                      <Input 
                        id="vaultName"
                        value={vaultName}
                        onChange={(e) => setVaultName(e.target.value)}
                        placeholder="Team Treasury"
                        className="mt-1 bg-[#1A1A1A] border-[#6B00D7]/20"
                      />
                      <p className="text-xs text-gray-500 mt-1">Give your multi-signature vault a clear, identifiable name</p>
                    </div>
                    
                    <div>
                      <Label htmlFor="assetAmount">Amount to Lock ({activeBlockchain})</Label>
                      <Input 
                        id="assetAmount"
                        value={assetAmount}
                        onChange={(e) => setAssetAmount(e.target.value)}
                        type="text"
                        placeholder="0.1"
                        className="mt-1 bg-[#1A1A1A] border-[#6B00D7]/20"
                      />
                      <p className="text-xs text-gray-500 mt-1">The amount of {activeBlockchain} to secure in this vault</p>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="vaultDescription">Description (Optional)</Label>
                    <Input
                      id="vaultDescription"
                      value={vaultDescription}
                      onChange={(e) => setVaultDescription(e.target.value)}
                      placeholder="Purpose of this multi-signature vault"
                      className="mt-1 bg-[#1A1A1A] border-[#6B00D7]/20"
                    />
                    <p className="text-xs text-gray-500 mt-1">Add context about this vault's purpose and usage</p>
                  </div>
                </div>
              </Tabs>
            </CardContent>
          </Card>
          
          <MultiSignatureConfig 
            onConfigChange={handleMultiSigConfigChange}
            className="mb-10"
          />
          
          <div className="flex justify-end">
            <Button
              variant="outline"
              className="mr-2"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateMultiSigVault}
              disabled={isCreating || !isWalletConnected(activeBlockchain) || !multiSigConfig || !vaultName}
              className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#7B10E7] hover:to-[#FF6AF7] text-white"
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Vault...
                </>
              ) : (
                "Create Multi-Signature Vault"
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MultiSignatureVaultPage;
