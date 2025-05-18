import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  ArrowLeft, 
  LinkIcon,
  Shield, 
  Lock, 
  Clock, 
  Key, 
  CheckCircle2, 
  Layers,
  RefreshCw,
  AlertCircle,
  Zap,
  Network,
  Globe,
  ArrowRightLeft,
  Bitcoin,
  Wallet
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Enum for security tiers
enum SecurityTier {
  STANDARD = 'standard',
  ENHANCED = 'enhanced',
  MAXIMUM = 'maximum',
  FORTRESS = 'fortress'
}

// Enum for primary blockchain
enum PrimaryBlockchain {
  ETHEREUM = 'ethereum',
  SOLANA = 'solana',
  TON = 'ton'
}

// Enum for verification requirements
enum VerificationRequirement {
  TWO_OF_THREE = 'two_of_three',
  THREE_OF_THREE = 'three_of_three',
  THREE_OF_FOUR = 'three_of_four',
  CUSTOM = 'custom'
}

const CrossChainVaultForm: React.FC = () => {
  const { toast } = useToast();
  
  // Form state
  const [vaultName, setVaultName] = useState<string>('My Cross-Chain Vault');
  const [vaultDescription, setVaultDescription] = useState<string>('');
  const [primaryBlockchain, setPrimaryBlockchain] = useState<PrimaryBlockchain>(PrimaryBlockchain.TON);
  const [securityTier, setSecurityTier] = useState<SecurityTier>(SecurityTier.ENHANCED);
  const [verificationRequirement, setVerificationRequirement] = useState<VerificationRequirement>(VerificationRequirement.TWO_OF_THREE);
  
  // Blockchain selection
  const [useEthereum, setUseEthereum] = useState<boolean>(true);
  const [useSolana, setUseSolana] = useState<boolean>(true);
  const [useTon, setUseTon] = useState<boolean>(true);
  const [useBitcoin, setUseBitcoin] = useState<boolean>(false);
  
  // Advanced settings
  const [customThreshold, setCustomThreshold] = useState<number>(2);
  const [totalChains, setTotalChains] = useState<number>(3);
  const [autoFallback, setAutoFallback] = useState<boolean>(true);
  const [emergencyRecovery, setEmergencyRecovery] = useState<boolean>(true);
  const [crossChainMessaging, setCrossChainMessaging] = useState<boolean>(true);
  const [enableTimelock, setEnableTimelock] = useState<boolean>(false);
  const [timeLockDuration, setTimeLockDuration] = useState<number>(30); // days
  const [emergencyEmail, setEmergencyEmail] = useState<string>('');
  
  // UI state
  const [currentTab, setCurrentTab] = useState<string>('basics');
  const [securityScore, setSecurityScore] = useState<number>(0);
  const [deploymentProgress, setDeploymentProgress] = useState<number>(0);
  const [verificationProgress, setVerificationProgress] = useState<number>(0);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [vaultId, setVaultId] = useState<string>('');
  
  // Calculate total chains and update verification requirement if needed
  useEffect(() => {
    let chains = 0;
    if (useEthereum) chains++;
    if (useSolana) chains++;
    if (useTon) chains++;
    if (useBitcoin) chains++;
    
    setTotalChains(chains);
    
    // Reset custom threshold if it's greater than total chains
    if (customThreshold > chains) {
      setCustomThreshold(Math.max(chains - 1, 1));
    }
    
    // Adjust verification requirement if not enough chains are selected
    if (chains < 3 && verificationRequirement === VerificationRequirement.THREE_OF_THREE) {
      setVerificationRequirement(VerificationRequirement.TWO_OF_THREE);
    }
    if (chains < 4 && verificationRequirement === VerificationRequirement.THREE_OF_FOUR) {
      setVerificationRequirement(VerificationRequirement.THREE_OF_THREE);
    }
  }, [useEthereum, useSolana, useTon, useBitcoin, customThreshold, verificationRequirement]);
  
  // Update security score based on settings
  useEffect(() => {
    let score = 40; // Base score
    
    // Add points for each security feature
    if (securityTier === SecurityTier.ENHANCED) score += 10;
    if (securityTier === SecurityTier.MAXIMUM) score += 20;
    if (securityTier === SecurityTier.FORTRESS) score += 30;
    
    if (totalChains >= 4) score += 15;
    else if (totalChains === 3) score += 10;
    
    if (verificationRequirement === VerificationRequirement.THREE_OF_THREE) score += 10;
    if (verificationRequirement === VerificationRequirement.THREE_OF_FOUR) score += 15;
    
    if (emergencyRecovery) score += 5;
    if (autoFallback) score += 5;
    if (enableTimelock) score += 5;
    if (emergencyEmail) score += 5;
    
    // Cap at 100
    setSecurityScore(Math.min(score, 100));
  }, [
    securityTier,
    totalChains,
    verificationRequirement,
    emergencyRecovery,
    autoFallback,
    enableTimelock,
    emergencyEmail
  ]);
  
  // Simulated vault deployment
  const deployVault = () => {
    // Validation
    if (!vaultName.trim()) {
      toast({
        title: "Vault name required",
        description: "Please provide a name for your cross-chain vault",
        variant: "destructive",
      });
      return;
    }
    
    if (totalChains < 2) {
      toast({
        title: "Insufficient blockchain networks",
        description: "At least two blockchain networks are required for cross-chain security",
        variant: "destructive",
      });
      return;
    }
    
    setIsDeploying(true);
    setDeploymentProgress(0);
    
    // Simulate deployment process
    const deployInterval = setInterval(() => {
      setDeploymentProgress(prev => {
        if (prev >= 100) {
          clearInterval(deployInterval);
          setIsDeploying(false);
          
          // Start verification process
          startVerification();
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };
  
  // Simulated cross-chain verification
  const startVerification = () => {
    setIsVerifying(true);
    setVerificationProgress(0);
    
    // Simulate verification process
    const verifyInterval = setInterval(() => {
      setVerificationProgress(prev => {
        if (prev >= 100) {
          clearInterval(verifyInterval);
          setIsVerifying(false);
          
          // Generate fake vault ID
          const randomHex = [...Array(16)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
          setVaultId(`ccv-${randomHex}`);
          
          setIsSuccess(true);
          toast({
            title: "Vault creation successful",
            description: "Cross-chain vault successfully created and verified across all selected blockchains",
          });
          return 100;
        }
        return prev + 1;
      });
    }, 150);
  };
  
  // Get security tier description
  const getSecurityTierDescription = (tier: SecurityTier) => {
    switch(tier) {
      case SecurityTier.STANDARD:
        return "Basic cross-chain security with verification across selected blockchains";
      case SecurityTier.ENHANCED:
        return "Advanced cross-chain security with fault tolerance and automatic fallback";
      case SecurityTier.MAXIMUM:
        return "High-security implementation with Triple-Chain Security™ and cross-chain messaging";
      case SecurityTier.FORTRESS:
        return "Maximum security with all available cross-chain protections and multi-signature governance";
      default:
        return "";
    }
  };
  
  // Get verification description
  const getVerificationDescription = (requirement: VerificationRequirement) => {
    switch(requirement) {
      case VerificationRequirement.TWO_OF_THREE:
        return "Any 2 blockchains must verify access requests (balanced security and convenience)";
      case VerificationRequirement.THREE_OF_THREE:
        return "All 3 blockchains must verify access requests (maximum security)";
      case VerificationRequirement.THREE_OF_FOUR:
        return "Any 3 out of 4 blockchains must verify access requests (high security with fallback)";
      case VerificationRequirement.CUSTOM:
        return `Any ${customThreshold} out of ${totalChains} blockchains must verify (custom threshold)`;
      default:
        return "";
    }
  };
  
  // Render success state
  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-[#6B00D7]/20 mb-8">
            <CheckCircle2 className="h-12 w-12 text-[#6B00D7]" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Cross-Chain Vault Created!</h1>
          <p className="text-xl text-gray-300 mb-8">
            Your vault has been successfully deployed across
            {' ' + [
              useEthereum && 'Ethereum',
              useSolana && 'Solana',
              useTon && 'TON',
              useBitcoin && 'Bitcoin'
            ].filter(Boolean).join(', ')}.
          </p>
          
          <Card className="bg-[#151515] border-[#333] mb-8">
            <CardHeader>
              <CardTitle>Vault Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between bg-[#1A1A1A] p-3 rounded-md mb-4">
                <div className="font-mono text-sm text-gray-300">{vaultId}</div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    navigator.clipboard.writeText(vaultId);
                    toast({
                      title: "Vault ID copied",
                      description: "Vault ID copied to clipboard",
                    });
                  }}
                  className="text-[#6B00D7] hover:text-[#8B20F7] hover:bg-[#6B00D7]/10"
                >
                  Copy ID
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Primary Chain</p>
                  <p className="text-white">{primaryBlockchain.charAt(0).toUpperCase() + primaryBlockchain.slice(1)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Security Level</p>
                  <p className="text-white">{securityTier.charAt(0).toUpperCase() + securityTier.slice(1)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Verification Requirement</p>
                  <p className="text-white">
                    {verificationRequirement === VerificationRequirement.TWO_OF_THREE ? '2 of 3 chains' :
                     verificationRequirement === VerificationRequirement.THREE_OF_THREE ? 'All chains' :
                     verificationRequirement === VerificationRequirement.THREE_OF_FOUR ? '3 of 4 chains' :
                     `${customThreshold} of ${totalChains} chains`}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Security Score</p>
                  <p className="text-white">{securityScore}/100</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
            <Link href="/dashboard">
              <Button 
                className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#7B10E7] hover:to-[#FF6AF7] text-white px-8 py-6 h-auto text-lg rounded-xl shadow-lg"
              >
                Go to Dashboard
              </Button>
            </Link>
            <Button 
              variant="outline"
              className="border-[#6B00D7]/50 text-[#6B00D7] hover:bg-[#6B00D7]/10"
              onClick={() => {
                setIsSuccess(false);
                setVaultName('My Cross-Chain Vault');
                setVaultDescription('');
                setDeploymentProgress(0);
                setVerificationProgress(0);
                setVaultId('');
                setCurrentTab('basics');
              }}
            >
              Create Another Vault
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <Link href="/vault-types">
          <Button variant="ghost" className="mb-4 hover:bg-[#6B00D7]/10">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Vault Types
          </Button>
        </Link>

        <div className="flex items-center mb-4">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center shadow-lg shadow-[#6B00D7]/30 mr-4">
            <LinkIcon className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
            Cross-Chain Vault
          </h1>
        </div>
        
        <p className="text-lg text-gray-300 max-w-3xl">
          Create an advanced vault with distributed security across multiple blockchain networks using our Triple-Chain Security™ architecture.
        </p>
        
        <div className="flex flex-wrap gap-3 mt-4">
          <Badge variant="secondary" className="bg-[#6B00D7]/20 text-[#6B00D7] border-[#6B00D7]/50">
            <Network className="h-3 w-3 mr-1" /> Multi-Chain Security
          </Badge>
          <Badge variant="secondary" className="bg-[#FF5AF7]/20 text-[#FF5AF7] border-[#FF5AF7]/50">
            <Shield className="h-3 w-3 mr-1" /> Distributed Verification
          </Badge>
          <Badge variant="secondary" className="bg-[#00E5A0]/20 text-[#00E5A0] border-[#00E5A0]/50">
            <Lock className="h-3 w-3 mr-1" /> Fault Tolerance
          </Badge>
        </div>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Vault Setup */}
        <div className="lg:col-span-2">
          <Tabs 
            value={currentTab} 
            onValueChange={setCurrentTab}
            className="bg-black/30 backdrop-blur-sm rounded-xl border border-gray-800 p-6"
          >
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="basics" className="data-[state=active]:bg-[#6B00D7]/30">
                <div className="flex flex-col items-center py-1">
                  <Wallet className="h-5 w-5 mb-1" />
                  <span>Basics</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="chains" className="data-[state=active]:bg-[#FF5AF7]/30">
                <div className="flex flex-col items-center py-1">
                  <LinkIcon className="h-5 w-5 mb-1" />
                  <span>Blockchains</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-[#00E5A0]/30">
                <div className="flex flex-col items-center py-1">
                  <Shield className="h-5 w-5 mb-1" />
                  <span>Security</span>
                </div>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="basics" className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Vault Details</h2>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="vault-name">Vault Name</Label>
                    <Input 
                      id="vault-name"
                      value={vaultName}
                      onChange={(e) => setVaultName(e.target.value)}
                      className="bg-black/30 border-gray-700"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vault-description">Description (Optional)</Label>
                    <Textarea
                      id="vault-description"
                      value={vaultDescription}
                      onChange={(e) => setVaultDescription(e.target.value)}
                      className="bg-black/30 border-gray-700"
                      placeholder="Add details about this vault's purpose"
                    />
                  </div>
                </div>
                
                <Separator className="my-6 bg-gray-800" />
                
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Primary Blockchain</h2>
                  <p className="text-sm text-gray-400">
                    Select the primary blockchain for your vault. This chain will handle the main vault operations.
                  </p>
                  
                  <RadioGroup 
                    value={primaryBlockchain} 
                    onValueChange={(value) => setPrimaryBlockchain(value as PrimaryBlockchain)}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2"
                  >
                    <div className="flex items-center space-x-2 border border-gray-800 rounded-lg p-3 hover:bg-[#6B00D7]/5 cursor-pointer">
                      <RadioGroupItem value={PrimaryBlockchain.TON} id="ton" className="text-[#6B00D7]" />
                      <Label htmlFor="ton" className="cursor-pointer flex-1">
                        <div className="flex flex-col">
                          <span className="font-medium flex items-center">
                            <span className="inline-block w-5 h-5 rounded-full bg-cyan-900/30 text-cyan-400 flex items-center justify-center mr-2">
                              <span className="text-xs font-bold">T</span>
                            </span>
                            TON
                          </span>
                          <span className="text-xs text-gray-400">Optimized for crypto assets</span>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 border border-gray-800 rounded-lg p-3 hover:bg-[#6B00D7]/5 cursor-pointer">
                      <RadioGroupItem value={PrimaryBlockchain.ETHEREUM} id="ethereum" className="text-[#6B00D7]" />
                      <Label htmlFor="ethereum" className="cursor-pointer flex-1">
                        <div className="flex flex-col">
                          <span className="font-medium flex items-center">
                            <span className="inline-block w-5 h-5 rounded-full bg-blue-900/30 text-blue-400 flex items-center justify-center mr-2">
                              <span className="text-xs font-bold">E</span>
                            </span>
                            Ethereum
                          </span>
                          <span className="text-xs text-gray-400">Best for ERC-20 tokens</span>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 border border-gray-800 rounded-lg p-3 hover:bg-[#6B00D7]/5 cursor-pointer">
                      <RadioGroupItem value={PrimaryBlockchain.SOLANA} id="solana" className="text-[#6B00D7]" />
                      <Label htmlFor="solana" className="cursor-pointer flex-1">
                        <div className="flex flex-col">
                          <span className="font-medium flex items-center">
                            <span className="inline-block w-5 h-5 rounded-full bg-green-900/30 text-green-400 flex items-center justify-center mr-2">
                              <span className="text-xs font-bold">S</span>
                            </span>
                            Solana
                          </span>
                          <span className="text-xs text-gray-400">High-speed transactions</span>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button 
                  onClick={() => setCurrentTab('chains')}
                  className="bg-[#6B00D7] hover:bg-[#7B10E7] text-white"
                >
                  Continue to Blockchains
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="chains" className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Blockchain Networks</h2>
                <p className="text-sm text-gray-400">
                  Select at least two blockchain networks to form your Cross-Chain Vault security architecture.
                </p>
                
                <div className="space-y-4 mt-4">
                  <Card className="bg-black/20 border-gray-800 hover:bg-[#FF5AF7]/5 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-blue-900/30 text-blue-400 flex items-center justify-center mr-3">
                            <span className="text-lg font-bold">E</span>
                          </div>
                          <div>
                            <h3 className="text-base font-medium">Ethereum</h3>
                            <p className="text-xs text-gray-400">ERC-20 tokens and ownership verification</p>
                          </div>
                        </div>
                        <Switch 
                          id="ethereum-toggle"
                          checked={useEthereum}
                          onCheckedChange={(checked) => {
                            setUseEthereum(checked);
                            // Can't disable all chains
                            if (!checked && !useSolana && !useTon && !useBitcoin) {
                              toast({
                                title: "At least one blockchain required",
                                description: "Select at least one blockchain for your vault",
                                variant: "destructive",
                              });
                              setUseEthereum(true);
                            }
                          }}
                          className="data-[state=checked]:bg-[#FF5AF7]"
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-black/20 border-gray-800 hover:bg-[#FF5AF7]/5 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-green-900/30 text-green-400 flex items-center justify-center mr-3">
                            <span className="text-lg font-bold">S</span>
                          </div>
                          <div>
                            <h3 className="text-base font-medium">Solana</h3>
                            <p className="text-xs text-gray-400">High-frequency monitoring and validation</p>
                          </div>
                        </div>
                        <Switch 
                          id="solana-toggle"
                          checked={useSolana}
                          onCheckedChange={(checked) => {
                            setUseSolana(checked);
                            // Can't disable all chains
                            if (!checked && !useEthereum && !useTon && !useBitcoin) {
                              toast({
                                title: "At least one blockchain required",
                                description: "Select at least one blockchain for your vault",
                                variant: "destructive",
                              });
                              setUseSolana(true);
                            }
                          }}
                          className="data-[state=checked]:bg-[#FF5AF7]"
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-black/20 border-gray-800 hover:bg-[#FF5AF7]/5 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-cyan-900/30 text-cyan-400 flex items-center justify-center mr-3">
                            <span className="text-lg font-bold">T</span>
                          </div>
                          <div>
                            <h3 className="text-base font-medium">TON</h3>
                            <p className="text-xs text-gray-400">Asset management and recovery systems</p>
                          </div>
                        </div>
                        <Switch 
                          id="ton-toggle"
                          checked={useTon}
                          onCheckedChange={(checked) => {
                            setUseTon(checked);
                            // Can't disable all chains
                            if (!checked && !useEthereum && !useSolana && !useBitcoin) {
                              toast({
                                title: "At least one blockchain required",
                                description: "Select at least one blockchain for your vault",
                                variant: "destructive",
                              });
                              setUseTon(true);
                            }
                          }}
                          className="data-[state=checked]:bg-[#FF5AF7]"
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-black/20 border-gray-800 hover:bg-[#FF5AF7]/5 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-orange-900/30 text-orange-400 flex items-center justify-center mr-3">
                            <span className="text-lg font-bold">B</span>
                          </div>
                          <div>
                            <h3 className="text-base font-medium">Bitcoin (Optional)</h3>
                            <p className="text-xs text-gray-400">Immutable timestamping and additional verification</p>
                          </div>
                        </div>
                        <Switch 
                          id="bitcoin-toggle"
                          checked={useBitcoin}
                          onCheckedChange={setUseBitcoin}
                          className="data-[state=checked]:bg-[#FF5AF7]"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Alert className={`mt-6 bg-${totalChains < 2 ? 'destructive' : '[#00E5A0]'}/10 border-${totalChains < 2 ? 'destructive' : '[#00E5A0]'}/30`}>
                  <Network className={`h-4 w-4 text-${totalChains < 2 ? 'destructive' : '[#00E5A0]'}`} />
                  <AlertTitle className={`text-${totalChains < 2 ? 'destructive' : '[#00E5A0]'}`}>
                    {totalChains < 2 ? 'Insufficient Blockchains' : 'Multi-Chain Architecture Ready'}
                  </AlertTitle>
                  <AlertDescription className="text-gray-300">
                    {totalChains < 2 
                      ? 'Select at least two blockchain networks to enable cross-chain verification.' 
                      : `Your vault will use ${totalChains} blockchains for distributed security.`}
                  </AlertDescription>
                </Alert>
              </div>
              
              <div className="pt-4 flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentTab('basics')}
                >
                  Back
                </Button>
                <Button 
                  onClick={() => setCurrentTab('security')}
                  className="bg-[#FF5AF7] hover:bg-[#FF6AF7] text-white"
                  disabled={totalChains < 2}
                >
                  Continue to Security
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Security Configuration</h2>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Security Tier</Label>
                    <RadioGroup 
                      value={securityTier} 
                      onValueChange={(value) => setSecurityTier(value as SecurityTier)}
                      className="grid grid-cols-1 gap-4"
                    >
                      <div className="flex items-center space-x-2 border border-gray-800 rounded-lg p-3 hover:bg-[#00E5A0]/5 cursor-pointer">
                        <RadioGroupItem value={SecurityTier.STANDARD} id="standard" className="text-[#00E5A0]" />
                        <Label htmlFor="standard" className="cursor-pointer flex-1">
                          <div className="flex flex-col">
                            <span className="font-medium">Standard Security</span>
                            <span className="text-sm text-gray-400">{getSecurityTierDescription(SecurityTier.STANDARD)}</span>
                          </div>
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 border border-gray-800 rounded-lg p-3 hover:bg-[#00E5A0]/5 cursor-pointer">
                        <RadioGroupItem value={SecurityTier.ENHANCED} id="enhanced" className="text-[#00E5A0]" />
                        <Label htmlFor="enhanced" className="cursor-pointer flex-1">
                          <div className="flex flex-col">
                            <span className="font-medium">Enhanced Security</span>
                            <span className="text-sm text-gray-400">{getSecurityTierDescription(SecurityTier.ENHANCED)}</span>
                          </div>
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 border border-gray-800 rounded-lg p-3 hover:bg-[#00E5A0]/5 cursor-pointer">
                        <RadioGroupItem value={SecurityTier.MAXIMUM} id="maximum" className="text-[#00E5A0]" />
                        <Label htmlFor="maximum" className="cursor-pointer flex-1">
                          <div className="flex flex-col">
                            <span className="font-medium">Maximum Security</span>
                            <span className="text-sm text-gray-400">{getSecurityTierDescription(SecurityTier.MAXIMUM)}</span>
                          </div>
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 border border-gray-800 rounded-lg p-3 hover:bg-[#00E5A0]/5 cursor-pointer">
                        <RadioGroupItem value={SecurityTier.FORTRESS} id="fortress" className="text-[#00E5A0]" />
                        <Label htmlFor="fortress" className="cursor-pointer flex-1">
                          <div className="flex flex-col">
                            <span className="font-medium">Fortress™ Security</span>
                            <span className="text-sm text-gray-400">{getSecurityTierDescription(SecurityTier.FORTRESS)}</span>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <Separator className="my-6 bg-gray-800" />
                  
                  <div className="space-y-3">
                    <Label>Verification Requirements</Label>
                    <RadioGroup 
                      value={verificationRequirement} 
                      onValueChange={(value) => setVerificationRequirement(value as VerificationRequirement)}
                      className="grid grid-cols-1 gap-4"
                    >
                      <div className="flex items-center space-x-2 border border-gray-800 rounded-lg p-3 hover:bg-[#00E5A0]/5 cursor-pointer">
                        <RadioGroupItem value={VerificationRequirement.TWO_OF_THREE} id="two_of_three" className="text-[#00E5A0]" />
                        <Label htmlFor="two_of_three" className="cursor-pointer flex-1">
                          <div className="flex flex-col">
                            <span className="font-medium">2 of 3 Verification</span>
                            <span className="text-sm text-gray-400">{getVerificationDescription(VerificationRequirement.TWO_OF_THREE)}</span>
                          </div>
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 border border-gray-800 rounded-lg p-3 hover:bg-[#00E5A0]/5 cursor-pointer">
                        <RadioGroupItem 
                          value={VerificationRequirement.THREE_OF_THREE} 
                          id="three_of_three" 
                          className="text-[#00E5A0]"
                          disabled={totalChains < 3}
                        />
                        <Label htmlFor="three_of_three" className={`cursor-pointer flex-1 ${totalChains < 3 ? 'opacity-50' : ''}`}>
                          <div className="flex flex-col">
                            <span className="font-medium">3 of 3 Verification</span>
                            <span className="text-sm text-gray-400">
                              {totalChains < 3 
                                ? 'Requires at least 3 blockchains to be enabled' 
                                : getVerificationDescription(VerificationRequirement.THREE_OF_THREE)}
                            </span>
                          </div>
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 border border-gray-800 rounded-lg p-3 hover:bg-[#00E5A0]/5 cursor-pointer">
                        <RadioGroupItem 
                          value={VerificationRequirement.THREE_OF_FOUR} 
                          id="three_of_four" 
                          className="text-[#00E5A0]"
                          disabled={totalChains < 4}
                        />
                        <Label htmlFor="three_of_four" className={`cursor-pointer flex-1 ${totalChains < 4 ? 'opacity-50' : ''}`}>
                          <div className="flex flex-col">
                            <span className="font-medium">3 of 4 Verification</span>
                            <span className="text-sm text-gray-400">
                              {totalChains < 4 
                                ? 'Requires all 4 blockchains to be enabled' 
                                : getVerificationDescription(VerificationRequirement.THREE_OF_FOUR)}
                            </span>
                          </div>
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 border border-gray-800 rounded-lg p-3 hover:bg-[#00E5A0]/5 cursor-pointer">
                        <RadioGroupItem value={VerificationRequirement.CUSTOM} id="custom" className="text-[#00E5A0]" />
                        <Label htmlFor="custom" className="cursor-pointer flex-1">
                          <div className="flex flex-col">
                            <span className="font-medium">Custom Verification</span>
                            <span className="text-sm text-gray-400">{getVerificationDescription(VerificationRequirement.CUSTOM)}</span>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                    
                    {verificationRequirement === VerificationRequirement.CUSTOM && (
                      <div className="pl-6 border-l-2 border-gray-800 mt-2 space-y-3">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor="custom-threshold">Required Verifications</Label>
                            <span>{customThreshold} of {totalChains} chains</span>
                          </div>
                          <Slider
                            id="custom-threshold"
                            min={1}
                            max={totalChains}
                            step={1}
                            value={[customThreshold]}
                            onValueChange={(value) => setCustomThreshold(value[0])}
                            className="[&>span]:bg-[#00E5A0]"
                            disabled={totalChains < 2}
                          />
                          <div className="flex justify-between text-xs text-gray-400">
                            <span>Minimum: 1</span>
                            <span>Maximum: {totalChains}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <Separator className="my-6 bg-gray-800" />
                  
                  <div className="space-y-4">
                    <Card className="bg-black/20 border-gray-800">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg flex items-center">
                            <Shield className="h-5 w-5 mr-2 text-[#00E5A0]" />
                            Advanced Security Features
                          </CardTitle>
                          <Badge className="bg-[#00E5A0]/20 text-[#00E5A0] border-[#00E5A0]/50">
                            {securityScore}/100
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="w-full bg-gray-800 h-2.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              securityScore >= 90 ? 'bg-green-500' : 
                              securityScore >= 70 ? 'bg-blue-500' : 
                              securityScore >= 50 ? 'bg-yellow-500' : 
                              'bg-red-500'
                            }`} 
                            style={{ width: `${securityScore}%` }}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="cross-chain-messaging" className="cursor-pointer">Cross-Chain Messaging</Label>
                            <p className="text-xs text-gray-400">Enable communication between blockchain networks</p>
                          </div>
                          <Switch 
                            id="cross-chain-messaging"
                            checked={crossChainMessaging}
                            onCheckedChange={setCrossChainMessaging}
                            className="data-[state=checked]:bg-[#00E5A0]"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="auto-fallback" className="cursor-pointer">Automatic Fallback</Label>
                            <p className="text-xs text-gray-400">Switch to alternative chains during network issues</p>
                          </div>
                          <Switch 
                            id="auto-fallback"
                            checked={autoFallback}
                            onCheckedChange={setAutoFallback}
                            className="data-[state=checked]:bg-[#00E5A0]"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="emergency-recovery" className="cursor-pointer">Emergency Recovery Protocol</Label>
                            <p className="text-xs text-gray-400">Access in case of catastrophic multi-chain failures</p>
                          </div>
                          <Switch 
                            id="emergency-recovery"
                            checked={emergencyRecovery}
                            onCheckedChange={setEmergencyRecovery}
                            className="data-[state=checked]:bg-[#00E5A0]"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="time-lock" className="cursor-pointer">Time-Lock Mechanism</Label>
                            <p className="text-xs text-gray-400">Prevent withdrawals until specified time</p>
                          </div>
                          <Switch 
                            id="time-lock"
                            checked={enableTimelock}
                            onCheckedChange={setEnableTimelock}
                            className="data-[state=checked]:bg-[#00E5A0]"
                          />
                        </div>
                        
                        {enableTimelock && (
                          <div className="pl-6 border-l-2 border-gray-800 mt-2">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <Label htmlFor="time-lock-duration">Lock Duration (Days)</Label>
                                <span>{timeLockDuration} days</span>
                              </div>
                              <Slider
                                id="time-lock-duration"
                                min={1}
                                max={365}
                                step={1}
                                value={[timeLockDuration]}
                                onValueChange={(value) => setTimeLockDuration(value[0])}
                                className="[&>span]:bg-[#00E5A0]"
                              />
                              <div className="flex justify-between text-xs text-gray-400">
                                <span>1 day</span>
                                <span>1 year</span>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div className="space-y-2 pt-2">
                          <Label htmlFor="emergency-email">Emergency Recovery Email (Optional)</Label>
                          <Input 
                            id="emergency-email"
                            type="email" 
                            placeholder="your@email.com"
                            value={emergencyEmail}
                            onChange={(e) => setEmergencyEmail(e.target.value)}
                            className="bg-black/30 border-gray-700"
                          />
                          <p className="text-xs text-gray-400">
                            Emergency recovery instructions will be sent to this email if needed.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
              
              <div className="pt-6 space-y-6">
                {!isDeploying && !isVerifying ? (
                  <Button 
                    onClick={deployVault}
                    className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#7B10E7] hover:to-[#FF6AF7] text-white h-12 text-lg font-semibold"
                  >
                    Create Cross-Chain Vault
                  </Button>
                ) : (
                  <div className="space-y-4">
                    {isDeploying && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Deploying vault contracts...</span>
                          <span>{deploymentProgress}%</span>
                        </div>
                        <Progress value={deploymentProgress} className="h-2 [&>div]:bg-[#FF5AF7]" />
                        <p className="text-sm text-gray-400">
                          {deploymentProgress < 30 && "Creating primary vault on " + primaryBlockchain.toUpperCase() + "..."}
                          {deploymentProgress >= 30 && deploymentProgress < 60 && "Deploying verification contracts..."}
                          {deploymentProgress >= 60 && deploymentProgress < 90 && "Initializing cross-chain security..."}
                          {deploymentProgress >= 90 && "Finalizing deployment..."}
                        </p>
                      </div>
                    )}
                    
                    {isVerifying && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Cross-chain verification...</span>
                          <span>{verificationProgress}%</span>
                        </div>
                        <Progress value={verificationProgress} className="h-2 [&>div]:bg-[#00E5A0]" />
                        <p className="text-sm text-gray-400">
                          {verificationProgress < 25 && "Verifying on Ethereum..."}
                          {verificationProgress >= 25 && verificationProgress < 50 && "Verifying on Solana..."}
                          {verificationProgress >= 50 && verificationProgress < 75 && "Verifying on TON..."}
                          {verificationProgress >= 75 && "Establishing cross-chain security..."}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex justify-between">
                  <Button 
                    variant="outline"
                    onClick={() => setCurrentTab('chains')}
                    disabled={isDeploying || isVerifying}
                  >
                    Back
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Right Column - Info Cards */}
        <div className="space-y-6">
          <Card className="bg-black/30 backdrop-blur-sm border-gray-800 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]" />
            <CardHeader>
              <CardTitle>Triple-Chain Security™</CardTitle>
              <CardDescription>
                Multi-blockchain protection for your assets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-[#6B00D7]/20 p-1.5 rounded-full">
                  <LinkIcon className="h-5 w-5 text-[#6B00D7]" />
                </div>
                <div>
                  <h4 className="font-medium">Cross-Chain Verification</h4>
                  <p className="text-sm text-gray-400">Secure verification across multiple blockchains</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-[#FF5AF7]/20 p-1.5 rounded-full">
                  <Globe className="h-5 w-5 text-[#FF5AF7]" />
                </div>
                <div>
                  <h4 className="font-medium">Chain-Specific Roles</h4>
                  <p className="text-sm text-gray-400">Specialized security functions for each blockchain</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-[#00E5A0]/20 p-1.5 rounded-full">
                  <Zap className="h-5 w-5 text-[#00E5A0]" />
                </div>
                <div>
                  <h4 className="font-medium">Automatic Fallback</h4>
                  <p className="text-sm text-gray-400">Continuous operation during network disruptions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/20 border-gray-800">
            <CardHeader>
              <CardTitle className="text-lg">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">Network Architecture</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-black/30 border border-[#333]">
                  <div className="flex justify-center mb-1">
                    <div className="h-8 w-8 rounded-full bg-blue-900/30 text-blue-400 flex items-center justify-center">
                      <span className="text-sm font-bold">E</span>
                    </div>
                  </div>
                  <p className="font-medium text-blue-400">Ethereum</p>
                  <p className="text-gray-400">Validation</p>
                </div>
                
                <div className="p-2 rounded-lg bg-black/30 border border-[#333]">
                  <div className="flex justify-center mb-1">
                    <div className="h-8 w-8 rounded-full bg-green-900/30 text-green-400 flex items-center justify-center">
                      <span className="text-sm font-bold">S</span>
                    </div>
                  </div>
                  <p className="font-medium text-green-400">Solana</p>
                  <p className="text-gray-400">Monitoring</p>
                </div>
                
                <div className="p-2 rounded-lg bg-black/30 border border-[#333]">
                  <div className="flex justify-center mb-1">
                    <div className="h-8 w-8 rounded-full bg-cyan-900/30 text-cyan-400 flex items-center justify-center">
                      <span className="text-sm font-bold">T</span>
                    </div>
                  </div>
                  <p className="font-medium text-cyan-400">TON</p>
                  <p className="text-gray-400">Primary</p>
                </div>
                
                <div className="p-2 rounded-lg bg-black/30 border border-[#333]">
                  <div className="flex justify-center mb-1">
                    <div className="h-8 w-8 rounded-full bg-orange-900/30 text-orange-400 flex items-center justify-center">
                      <span className="text-sm font-bold">B</span>
                    </div>
                  </div>
                  <p className="font-medium text-orange-400">Bitcoin</p>
                  <p className="text-gray-400">Optional</p>
                </div>
              </div>
              
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-gray-700 to-transparent my-2"></div>
              
              <div className="text-center">
                <ArrowRightLeft className="h-5 w-5 mx-auto mb-1 text-[#FF5AF7]" />
                <p className="text-xs text-gray-300">Cross-Chain Messaging Protocol</p>
              </div>
            </CardContent>
          </Card>
          
          <Alert className="bg-[#00E5A0]/10 border-[#00E5A0]/30">
            <Shield className="h-4 w-4 text-[#00E5A0]" />
            <AlertTitle className="text-[#00E5A0]">Enhanced Security</AlertTitle>
            <AlertDescription className="text-gray-300">
              Your assets remain protected even if an entire blockchain network experiences issues.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
};

export default CrossChainVaultForm;