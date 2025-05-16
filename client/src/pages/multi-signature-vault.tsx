import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useMultiChain, BlockchainType } from '@/contexts/multi-chain-context';
import { 
  Users, ArrowLeft, Shield, ShieldCheck, Lock, Wallet, AlertTriangle, Loader2, 
  CheckCircle2, Globe, Key, FileKey, Database, Fingerprint, Crown,
  Clock, Shuffle, Zap, CircleCheck, CreditCard, Layers
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSignatureConfig } from '@/components/vault/MultiSignatureConfig';
import { apiRequest } from '@/lib/queryClient';
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useCVTToken } from '@/contexts/cvt-token-context';

// Enhanced security feature type
type SecurityFeature = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  premium: boolean;
};

// Recovery option type
type RecoveryOption = {
  id: string;
  name: string;
  description: string;
  securityLevel: number;
  enabled: boolean;
};

// Encryption level options
type EncryptionLevel = 'standard' | 'enhanced' | 'quantum-resistant' | 'fortress';

// Advanced Multi-signature configuration type
type MultiSigConfig = {
  threshold: number;
  signers: { 
    address: string; 
    name?: string; 
    weight: number;
    role: 'owner' | 'guardian' | 'beneficiary' | 'auditor';
    permissions: string[];
    recoveryKey?: boolean;
  }[];
  timeLimit: number;
  requireGeolocation: boolean;
  requireBiometrics: boolean;
  crossChainVerification: boolean;
  verificationChains: BlockchainType[];
  delayedExecution: boolean;
  executionDelay: number; // In hours
  encryptionLevel: EncryptionLevel;
  emergencyRecovery: boolean;
  socialRecoveryEnabled: boolean;
  voteThreshold: number; // Percentage required for approval
  expiryStrategy: 'extend' | 'approve' | 'reject';
};

const MultiSignatureVaultPage = () => {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const { isAnyWalletConnected, connectChain, walletInfo, chainStatus } = useMultiChain();
  const cvtToken = useCVTToken();
  
  // Basic state
  const [activeBlockchain, setActiveBlockchain] = useState<BlockchainType>(BlockchainType.TON);
  const [multiSigConfig, setMultiSigConfig] = useState<MultiSigConfig | null>(null);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [vaultName, setVaultName] = useState('');
  const [vaultDescription, setVaultDescription] = useState('');
  const [assetAmount, setAssetAmount] = useState('0.1');
  
  // Premium features - Security
  const [securityScore, setSecurityScore] = useState<number>(78);
  const [encryptionLevel, setEncryptionLevel] = useState<EncryptionLevel>('enhanced');
  const [securityFeatures, setSecurityFeatures] = useState<SecurityFeature[]>([
    {
      id: 'cross-chain-verification',
      name: 'Cross-Chain Verification',
      description: 'Secure assets across multiple blockchains for enhanced protection',
      enabled: true,
      premium: true
    },
    {
      id: 'quantum-resistant',
      name: 'Quantum-Resistant Encryption',
      description: 'Future-proof encryption resistant to quantum computing attacks',
      enabled: false,
      premium: true
    },
    {
      id: 'biometric-verification',
      name: 'Biometric Verification',
      description: 'Add fingerprint or facial recognition as a security factor',
      enabled: false,
      premium: true
    },
    {
      id: 'geo-restriction',
      name: 'Geographic Access Controls',
      description: 'Restrict vault access to specific geographic locations',
      enabled: false,
      premium: true
    },
    {
      id: 'delayed-execution',
      name: 'Time-Delayed Execution',
      description: 'Add a waiting period for all transactions',
      enabled: true,
      premium: false
    },
  ]);
  
  // Recovery options
  const [recoveryOptions, setRecoveryOptions] = useState<RecoveryOption[]>([
    {
      id: 'social-recovery',
      name: 'Guardian Recovery',
      description: 'Designated trusted guardians can help recover access',
      securityLevel: 4,
      enabled: true
    },
    {
      id: 'delayed-recovery',
      name: 'Time-Delayed Recovery',
      description: 'Recovery process requires a mandatory waiting period',
      securityLevel: 3,
      enabled: true
    },
    {
      id: 'multi-chain-recovery',
      name: 'Cross-Chain Verification',
      description: 'Recovery requires verification across multiple blockchain networks',
      securityLevel: 5,
      enabled: false
    }
  ]);
  
  // Cross-chain verification
  const [crossChainVerification, setCrossChainVerification] = useState<boolean>(true);
  const [verificationChains, setVerificationChains] = useState<BlockchainType[]>([
    BlockchainType.ETHEREUM,
    BlockchainType.SOLANA
  ]);
  
  // Advanced settings
  const [executionDelay, setExecutionDelay] = useState<number>(24);
  const [voteThreshold, setVoteThreshold] = useState<number>(60);
  const [expiryStrategy, setExpiryStrategy] = useState<'extend' | 'approve' | 'reject'>('extend');
  const [estimatedGasFee, setEstimatedGasFee] = useState<number>(150);
  const [cvtStakingDiscount, setCvtStakingDiscount] = useState<number>(0);

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
      timeLimit: config.timeLimit || 24, // Default to 24 hours if not provided
      requireGeolocation: securityFeatures.find(f => f.id === 'geo-restriction')?.enabled || false,
      requireBiometrics: securityFeatures.find(f => f.id === 'biometric-verification')?.enabled || false,
      crossChainVerification: crossChainVerification,
      verificationChains: verificationChains,
      delayedExecution: securityFeatures.find(f => f.id === 'delayed-execution')?.enabled || false,
      executionDelay: executionDelay,
      encryptionLevel: encryptionLevel,
      emergencyRecovery: true,
      socialRecoveryEnabled: recoveryOptions.find(r => r.id === 'social-recovery')?.enabled || false,
      voteThreshold: voteThreshold,
      expiryStrategy: expiryStrategy
    };
    
    // Update signers with roles and permissions
    if (updatedConfig.signers && updatedConfig.signers.length > 0) {
      updatedConfig.signers = updatedConfig.signers.map((signer: any, index: number) => {
        return {
          ...signer,
          role: index === 0 ? 'owner' : 'guardian',
          permissions: index === 0 
            ? ['full-access', 'recovery', 'withdrawal'] 
            : ['approve', 'recovery'],
          recoveryKey: index > 0 && recoveryOptions.find(r => r.id === 'social-recovery')?.enabled
        };
      });
    }
    
    setMultiSigConfig(updatedConfig as MultiSigConfig);
  };
  
  // Toggle security feature
  const toggleSecurityFeature = (id: string) => {
    const updatedFeatures = securityFeatures.map(feature => {
      if (feature.id === id) {
        return { ...feature, enabled: !feature.enabled };
      }
      return feature;
    });
    setSecurityFeatures(updatedFeatures);
    
    // If quantum-resistant is enabled, upgrade encryption level
    if (id === 'quantum-resistant' && !securityFeatures.find(f => f.id === id)?.enabled) {
      setEncryptionLevel('quantum-resistant');
    } else if (id === 'quantum-resistant' && securityFeatures.find(f => f.id === id)?.enabled) {
      setEncryptionLevel('enhanced');
    }
    
    // Update security score
    calculateSecurityScore(updatedFeatures, recoveryOptions);
  };
  
  // Toggle recovery option
  const toggleRecoveryOption = (id: string) => {
    const updatedOptions = recoveryOptions.map(option => {
      if (option.id === id) {
        return { ...option, enabled: !option.enabled };
      }
      return option;
    });
    setRecoveryOptions(updatedOptions);
    
    // Update security score
    calculateSecurityScore(securityFeatures, updatedOptions);
  };
  
  // Calculate security score based on selected features
  const calculateSecurityScore = (features: SecurityFeature[], recovery: RecoveryOption[]) => {
    let score = 60; // Base score
    
    // Add points for enabled security features
    features.forEach(feature => {
      if (feature.enabled) {
        score += feature.premium ? 8 : 4;
      }
    });
    
    // Add points for recovery options
    recovery.forEach(option => {
      if (option.enabled) {
        score += option.securityLevel;
      }
    });
    
    // Add points for cross-chain verification
    if (crossChainVerification) {
      score += (verificationChains.length * 3);
    }
    
    // Add points for encryption level
    if (encryptionLevel === 'enhanced') score += 5;
    if (encryptionLevel === 'quantum-resistant') score += 10;
    if (encryptionLevel === 'fortress') score += 15;
    
    // Cap at 100
    score = Math.min(score, 100);
    
    setSecurityScore(score);
  };
  
  // Calculate CVT discount based on staked amount
  useEffect(() => {
    // Calculate discount based on CVT staking tier
    let discount = 0;
    
    if (cvtToken.stakedAmount >= 100000) {
      discount = 100; // 100% discount for Sovereign tier
    } else if (cvtToken.stakedAmount >= 10000) {
      discount = 90;  // 90% discount for Architect tier
    } else if (cvtToken.stakedAmount >= 1000) {
      discount = 75;  // 75% discount for Guardian tier
    } else if (cvtToken.stakedAmount >= 100) {
      discount = 25;  // 25% discount for smaller stakers
    }
    
    setCvtStakingDiscount(discount);
    
    // Calculate base gas fee
    let baseFee = 150;
    
    // Add fees for premium features
    const enabledPremiumFeatures = securityFeatures.filter(f => f.enabled && f.premium).length;
    baseFee += (enabledPremiumFeatures * 30);
    
    // Apply discount
    const discountedFee = baseFee * (1 - discount / 100);
    setEstimatedGasFee(Math.max(0, discountedFee));
    
  }, [cvtToken.stakedAmount, securityFeatures]);

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

    // Check if verification chains are connected for cross-chain verification
    if (crossChainVerification && verificationChains.length > 0) {
      const unconnectedChains = verificationChains.filter(chain => !isWalletConnected(chain));
      if (unconnectedChains.length > 0) {
        toast({
          title: "Verification Chain Not Connected",
          description: `Please connect ${unconnectedChains.join(', ')} wallet(s) for cross-chain verification`,
          variant: "destructive",
        });
        return;
      }
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

      // Build enhanced security metadata 
      const securityMetadata = {
        multiSigConfig: {
          ...multiSigConfig,
          requireGeolocation: securityFeatures.find(f => f.id === 'geo-restriction')?.enabled || false,
          requireBiometrics: securityFeatures.find(f => f.id === 'biometric-verification')?.enabled || false,
          crossChainVerification: crossChainVerification,
          verificationChains: verificationChains,
          delayedExecution: securityFeatures.find(f => f.id === 'delayed-execution')?.enabled || false,
          executionDelay: executionDelay,
          encryptionLevel: encryptionLevel
        },
        securityFeatures: securityFeatures.filter(f => f.enabled).map(f => f.id),
        recoveryOptions: recoveryOptions.filter(r => r.enabled).map(r => r.id),
        securityScore: securityScore,
        securityLevel: securityScore >= 90 ? "fortress" : 
                     securityScore >= 80 ? "quantum-resistant" : 
                     securityScore >= 70 ? "enhanced" : "standard",
        premium: securityFeatures.some(f => f.enabled && f.premium),
        crossChainAddresses: {
          ethereum: walletInfo.ethereum.address,
          solana: walletInfo.solana.address,
          ton: walletInfo.ton.address,
          bitcoin: '1BitcoinPlaceholderAddress', // Placeholder
        },
        cvtDiscount: cvtStakingDiscount,
        cvtStaked: cvtToken.stakedAmount,
        creationTimestamp: new Date().toISOString(),
        feePaid: estimatedGasFee
      };

      // Create the vault via API
      const response = await apiRequest("POST", "/api/vaults", {
        name: vaultName,
        description: vaultDescription,
        vaultType: "multi-signature",
        assetType: activeBlockchain,
        assetAmount,
        timeLockPeriod: multiSigConfig.timeLimit * 3600, // Convert hours to seconds
        metadata: JSON.stringify(securityMetadata),
        multisigEnabled: true,
        crossChainEnabled: crossChainVerification,
        ethereumContractAddress: activeBlockchain === BlockchainType.ETHEREUM ? ownerAddress : undefined,
        solanaContractAddress: activeBlockchain === BlockchainType.SOLANA ? ownerAddress : undefined, 
        tonContractAddress: activeBlockchain === BlockchainType.TON ? ownerAddress : undefined,
        bitCoinAddress: activeBlockchain === BlockchainType.BITCOIN ? ownerAddress : undefined,
      });

      const result = await response.json();

      if (response.ok) {
        // Calculate security tier for display
        let securityTier = "Standard";
        if (securityScore >= 90) securityTier = "Fortress";
        else if (securityScore >= 80) securityTier = "Quantum-Resistant";
        else if (securityScore >= 70) securityTier = "Enhanced";
        
        // Calculate features for display
        const enabledFeatures = securityFeatures.filter(f => f.enabled).length;
        const premiumFeatures = securityFeatures.filter(f => f.enabled && f.premium).length;
        
        toast({
          title: "Ultimate Multi-Signature Vault Created",
          description: `Created vault with ${multiSigConfig.signers.length} signers, ${securityTier} security, and ${enabledFeatures} advanced features`,
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
          
          {/* Advanced Security Matrix */}
          <Card className="border-[#6B00D7]/30 bg-gradient-to-br from-[#131313] to-[#1A1A1A] shadow-xl mb-10">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-poppins flex items-center justify-center">
                <Shield className="mr-2 h-6 w-6 text-[#6B00D7]" />
                Advanced Security Matrix
              </CardTitle>
              <CardDescription>
                Configure premium security features to protect your multi-signature vault
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="mb-8 text-center">
                <div className="mb-4">
                  <h3 className="text-xl font-medium mb-3">Security Score</h3>
                  <div className="relative inline-flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full flex items-center justify-center bg-gradient-to-r from-[#131313] to-[#1D1D1D] border-4 border-[#333]">
                      <div className={`w-28 h-28 rounded-full flex items-center justify-center text-2xl font-bold 
                        ${securityScore >= 90 
                          ? "bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white" 
                          : securityScore >= 80 
                            ? "bg-[#6B00D7]/20 text-[#FF5AF7]" 
                            : "bg-[#2D2D2D] text-gray-300"}`}
                      >
                        {securityScore}
                      </div>
                    </div>
                    <div className="absolute top-0 left-0 w-full h-full">
                      <svg width="100%" height="100%" viewBox="0 0 100 100" className="rotate-90">
                        <circle 
                          cx="50" cy="50" r="46" 
                          fill="none" 
                          stroke="#333" 
                          strokeWidth="6"
                        />
                        <circle 
                          cx="50" cy="50" r="46" 
                          fill="none" 
                          stroke={securityScore >= 90 ? "#FF5AF7" : securityScore >= 80 ? "#6B00D7" : "#555"} 
                          strokeWidth="6" 
                          strokeDasharray={`${securityScore * 2.9}, 1000`} 
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="max-w-lg mx-auto">
                  <Badge 
                    variant={securityScore >= 90 ? "default" : "outline"}
                    className={`mx-auto ${securityScore >= 90 
                      ? "bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]" 
                      : securityScore >= 80 
                        ? "border-[#6B00D7] text-[#6B00D7]" 
                        : "border-yellow-600 text-yellow-600"}`}
                  >
                    {securityScore >= 90 
                      ? "Fortress Grade Security" 
                      : securityScore >= 80 
                        ? "Enhanced Security" 
                        : "Standard Security"}
                  </Badge>
                  <p className="text-sm text-gray-300 mt-3">
                    {securityScore < 70 
                      ? "Your vault has basic security. Enable more premium features for enhanced protection." 
                      : securityScore < 90 
                        ? "Your vault has strong security. Add a few more features for maximum protection." 
                        : "Your vault has military-grade security with triple-chain protection."}
                  </p>
                </div>
              </div>
              
              <div className="mb-8 text-center">
                <h3 className="text-xl font-medium mb-4">Triple-Chain Security</h3>
                <RadioGroup 
                  defaultValue={encryptionLevel} 
                  onValueChange={(value) => setEncryptionLevel(value as EncryptionLevel)}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto"
                >
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="standard" id="standard" className="mt-1" />
                    <div className="grid gap-1">
                      <Label htmlFor="standard" className="font-medium">Standard Protection</Label>
                      <p className="text-sm text-gray-400">AES-256 encryption for basic security needs</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="enhanced" id="enhanced" className="mt-1" />
                    <div className="grid gap-1">
                      <Label htmlFor="enhanced" className="font-medium">
                        Enhanced Protection
                        <Badge variant="outline" className="ml-2 border-[#6B00D7] text-[#6B00D7]">Recommended</Badge>
                      </Label>
                      <p className="text-sm text-gray-400">Falcon-512 and Kyber-512 based encryption</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="quantum-resistant" id="quantum" className="mt-1" />
                    <div className="grid gap-1">
                      <Label htmlFor="quantum" className="font-medium">
                        Quantum-Resistant 
                        <Badge variant="outline" className="ml-2 border-[#FF5AF7] text-[#FF5AF7]">Premium</Badge>
                      </Label>
                      <p className="text-sm text-gray-400">CRYSTALS-Dilithium and Kyber-1024 quantum-safe encryption</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="fortress" id="fortress" className="mt-1" />
                    <div className="grid gap-1">
                      <Label htmlFor="fortress" className="font-medium">
                        Fortress-Grade
                        <Badge variant="outline" className="ml-2 border-gradient-br from-[#6B00D7] to-[#FF5AF7] text-transparent bg-clip-text bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">Ultimate</Badge>
                      </Label>
                      <p className="text-sm text-gray-400">SPHINCS+ and FrodoKEM-1344 military-grade protection</p>
                    </div>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="mb-8 text-center">
                <h3 className="text-xl font-medium mb-4">Zero-Knowledge Security</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  <div>
                    <h4 className="text-lg font-medium mb-4 border-b border-[#6B00D7]/20 pb-2">Security Features</h4>
                    <div className="space-y-4">
                      {securityFeatures.map(feature => (
                        <div key={feature.id} className="flex items-start justify-between bg-[#1A1A1A]/50 p-3 rounded-lg shadow-inner">
                          <div className="flex-1 text-left">
                            <div className="flex items-center">
                              <h4 className="font-medium">{feature.name}</h4>
                              {feature.premium && (
                                <Badge variant="outline" className="ml-2 border-[#FF5AF7] text-[#FF5AF7] text-xs">Premium</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-400">{feature.description}</p>
                          </div>
                          <Switch 
                            checked={feature.enabled}
                            onCheckedChange={() => toggleSecurityFeature(feature.id)}
                            className="mt-1"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium mb-4 border-b border-[#6B00D7]/20 pb-2">Recovery Options</h4>
                    <div className="space-y-4">
                      {recoveryOptions.map(option => (
                        <div key={option.id} className="flex items-start justify-between bg-[#1A1A1A]/50 p-3 rounded-lg shadow-inner">
                          <div className="flex-1 text-left">
                            <div className="flex items-center">
                              <h4 className="font-medium">{option.name}</h4>
                              <Badge 
                                variant="outline" 
                                className="ml-2 border-green-500 text-green-500 text-xs"
                              >
                                Level {option.securityLevel}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-400">{option.description}</p>
                          </div>
                          <Switch 
                            checked={option.enabled}
                            onCheckedChange={() => toggleRecoveryOption(option.id)}
                            className="mt-1"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-8 text-center">
                <h3 className="text-xl font-medium mb-4">Advanced Security</h3>
                <div className="max-w-3xl mx-auto bg-[#1A1A1A]/50 p-4 rounded-lg shadow-inner mb-4">
                  <div className="flex items-start justify-between">
                    <div className="text-left">
                      <div className="flex items-center">
                        <h4 className="font-medium">Triple-Chain Security™</h4>
                        <Badge 
                          variant="outline" 
                          className="ml-2 border-[#6B00D7] text-[#6B00D7] text-xs"
                        >
                          Recommended
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400">Secure your vault across multiple blockchains for enhanced protection</p>
                    </div>
                    <Switch 
                      checked={crossChainVerification}
                      onCheckedChange={() => setCrossChainVerification(!crossChainVerification)}
                    />
                  </div>
                </div>
                
                {crossChainVerification && (
                  <div className="max-w-2xl mx-auto bg-[#0F0F0F] p-5 rounded-xl border border-[#6B00D7]/20 shadow-md">
                    <p className="text-sm text-gray-300 mb-4 font-medium">Select verification chains for triple-chain protection:</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {Object.values(BlockchainType)
                        .filter(chain => chain !== activeBlockchain) // Don't show the primary chain
                        .map(chain => {
                          const isSelected = verificationChains.includes(chain);
                          return (
                            <div 
                              key={chain} 
                              className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-300 ${
                                isSelected 
                                  ? 'border-[#6B00D7] bg-[#6B00D7]/10' 
                                  : 'border-gray-700 bg-[#1A1A1A] hover:border-gray-500'
                              }`}
                              onClick={() => {
                                if (isSelected) {
                                  setVerificationChains(verificationChains.filter(c => c !== chain));
                                } else {
                                  setVerificationChains([...verificationChains, chain]);
                                }
                              }}
                            >
                              <Checkbox 
                                id={`chain-${chain}`}
                                checked={isSelected}
                                className="mr-2"
                                onCheckedChange={(checked: boolean) => {
                                  if (checked) {
                                    setVerificationChains([...verificationChains, chain]);
                                  } else {
                                    setVerificationChains(verificationChains.filter(c => c !== chain));
                                  }
                                }}
                              />
                              <div>
                                <Label 
                                  htmlFor={`chain-${chain}`}
                                  className={`font-medium ${isSelected ? 'text-[#FF5AF7]' : 'text-gray-300'}`}
                                >
                                  {chain}
                                </Label>
                                <p className="text-xs text-gray-500">
                                  {chain === BlockchainType.TON && "Fast, low gas fees"}
                                  {chain === BlockchainType.ETHEREUM && "Secure, widely adopted"}
                                  {chain === BlockchainType.SOLANA && "High-speed monitoring"}
                                  {chain === BlockchainType.BITCOIN && "Ultra-secure, trusted"}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                    <div className="mt-4 text-center">
                      <Badge 
                        variant="outline" 
                        className="mx-auto bg-[#6B00D7]/10 border-[#6B00D7] text-[#6B00D7]"
                      >
                        {verificationChains.length}/3 chains selected
                      </Badge>
                      <p className="text-xs text-gray-400 mt-2">
                        We recommend selecting at least 2 chains for optimum security
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mb-8 text-center">
                <h3 className="text-xl font-medium mb-4">Execution Parameters</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                  <div className="bg-[#1A1A1A]/50 p-4 rounded-lg shadow-inner">
                    <Label htmlFor="execution-delay" className="text-[#FF5AF7]">Transaction Execution Delay (hours)</Label>
                    <div className="flex items-center mt-2">
                      <Clock className="h-5 w-5 mr-2 text-[#6B00D7]/60" />
                      <Input 
                        id="execution-delay"
                        type="number"
                        value={executionDelay}
                        onChange={(e) => setExecutionDelay(parseInt(e.target.value) || 24)}
                        min={1}
                        max={72}
                        className="bg-[#0F0F0F] border-[#6B00D7]/20"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Time delay before executing approved transactions for security</p>
                  </div>
                  
                  <div className="bg-[#1A1A1A]/50 p-4 rounded-lg shadow-inner">
                    <Label htmlFor="vote-threshold" className="text-[#FF5AF7]">Approval Threshold (%)</Label>
                    <div className="flex items-center mt-2">
                      <Users className="h-5 w-5 mr-2 text-[#6B00D7]/60" />
                      <Input 
                        id="vote-threshold"
                        type="number"
                        value={voteThreshold}
                        onChange={(e) => setVoteThreshold(parseInt(e.target.value) || 60)}
                        min={50}
                        max={100}
                        className="bg-[#0F0F0F] border-[#6B00D7]/20"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Percentage of weighted votes required for transaction approval</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* CVT Staking Benefits */}
          <Card className="border-[#FF5AF7]/30 bg-gradient-to-br from-[#131313] to-[#1A1A1A] shadow-xl mb-10">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-poppins flex items-center justify-center">
                <Zap className="mr-2 h-6 w-6 text-[#FF5AF7]" />
                CVT Token Benefits
              </CardTitle>
              <CardDescription>
                Your CVT token holdings unlock premium features and discounts
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="mb-4">
                <Alert className={cvtStakingDiscount > 0 ? "bg-[#6B00D7]/20 border-[#6B00D7]" : "bg-gray-800 border-gray-700"}>
                  <Wallet className={cvtStakingDiscount > 0 ? "h-4 w-4 text-[#6B00D7]" : "h-4 w-4 text-gray-400"} />
                  <AlertTitle>{cvtStakingDiscount > 0 ? "CVT Staking Discount Applied" : "Stake CVT for Discounts"}</AlertTitle>
                  <AlertDescription>
                    {cvtStakingDiscount > 0 
                      ? `You are receiving a ${cvtStakingDiscount}% discount on fees thanks to your CVT stake.` 
                      : "Stake CVT tokens to receive up to 100% discount on vault creation and operation fees."}
                  </AlertDescription>
                </Alert>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <Card className="bg-[#1D1D1D] border-[#333]">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Estimated Gas Fee</h4>
                      <div className="text-right">
                        <span className="text-lg font-bold">{estimatedGasFee.toFixed(2)}</span>
                        <span className="text-sm text-gray-400 ml-1">{activeBlockchain}</span>
                      </div>
                    </div>
                    {cvtStakingDiscount > 0 && (
                      <div className="text-xs text-[#FF5AF7]">
                        {cvtStakingDiscount}% discount applied
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="bg-[#1D1D1D] border-[#333]">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Premium Features</h4>
                      <Badge variant="outline" className="border-[#FF5AF7] text-[#FF5AF7]">
                        {securityFeatures.filter(f => f.enabled && f.premium).length} Enabled
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-400">
                      Additional security features for enhanced protection
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
          
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
              className={`text-white ${securityScore >= 90 
                ? "bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#7B10E7] hover:to-[#FF6AF7]" 
                : securityScore >= 80 
                ? "bg-[#6B00D7] hover:bg-[#7B10E7]" 
                : "bg-gradient-to-r from-[#6B00D7] to-[#8B20E7] hover:from-[#7B10E7] hover:to-[#9B30F7]"}`}
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Ultimate Vault...
                </>
              ) : (
                <>
                  {securityScore >= 90 ? (
                    <Shield className="mr-2 h-4 w-4" />
                  ) : securityScore >= 80 ? (
                    <ShieldCheck className="mr-2 h-4 w-4" />
                  ) : (
                    <Lock className="mr-2 h-4 w-4" />
                  )}
                  {securityScore >= 90 
                    ? "Create Fortress Vault" 
                    : securityScore >= 80 
                    ? "Create Enhanced Vault" 
                    : "Create Multi-Signature Vault"}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MultiSignatureVaultPage;
