import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Shield, Lock, CheckCircle2, Zap, ChevronRight, Globe, KeyRound, FileKey, ListChecks, Server, FlaskConical, UserPlus, Calendar, Wallet, ChevronsRight, Fingerprint, Loader2, AlertTriangle, Clock } from "lucide-react";
import { useTon } from "@/contexts/ton-context";
import { useEthereum } from "@/contexts/ethereum-context";
import { useSolana } from "@/contexts/solana-context";
import { useCVTToken } from "@/contexts/cvt-token-context";
import { BlockchainType } from "@/contexts/multi-chain-context";
import { MediaUploader, UploadedMedia } from '@/components/vault/media-uploader';

// Specialized security options for Sovereign Fortress
interface SecurityFeature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  premium: boolean;
  required: boolean;
}

interface AuthorizedParty {
  id: string;
  name: string;
  address: string;
  role: 'owner' | 'guardian' | 'beneficiary' | 'auditor';
  permissions: string[];
}

interface RecoveryOption {
  id: string;
  name: string;
  description: string;
  securityLevel: number;
  selected: boolean;
}

type EncryptionMode = 'standard' | 'enhanced' | 'quantum-resistant' | 'fortress';

const SovereignFortressVaultPage = () => {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const ton = useTon();
  const ethereum = useEthereum();
  const solana = useSolana();
  const cvtToken = useCVTToken();
  
  // Basic vault information
  const [step, setStep] = useState<number>(1);
  const [vaultName, setVaultName] = useState<string>("");
  const [vaultDescription, setVaultDescription] = useState<string>("");
  const [selectedBlockchain, setSelectedBlockchain] = useState<BlockchainType>(BlockchainType.TON);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mediaAttachments, setMediaAttachments] = useState<UploadedMedia[]>([]);
  const [encryptionMode, setEncryptionMode] = useState<EncryptionMode>('fortress');
  const [estimatedGasFee, setEstimatedGasFee] = useState<number>(0);
  const [cvtStakingDiscount, setCvtStakingDiscount] = useState<number>(0);
  const [securityScore, setSecurityScore] = useState<number>(85);
  
  // Time lock settings
  const [unlockDate, setUnlockDate] = useState<string>("");
  const [hasUnlockWindow, setHasUnlockWindow] = useState<boolean>(false);
  const [unlockWindowDays, setUnlockWindowDays] = useState<number>(7);
  const [emergencyUnlock, setEmergencyUnlock] = useState<boolean>(true);
  
  // Multi-signature settings
  const [requiredSignatures, setRequiredSignatures] = useState<number>(2);
  const [authorizedParties, setAuthorizedParties] = useState<AuthorizedParty[]>([
    {
      id: '1',
      name: 'Primary Owner',
      address: '',
      role: 'owner',
      permissions: ['full-access', 'recovery', 'withdrawal']
    }
  ]);
  
  // Cross-chain verification
  const [crossChainVerification, setCrossChainVerification] = useState<boolean>(true);
  const [verificationChains, setVerificationChains] = useState<BlockchainType[]>([
    BlockchainType.ETHEREUM, 
    BlockchainType.SOLANA
  ]);
  
  // Security features 
  const [securityFeatures, setSecurityFeatures] = useState<SecurityFeature[]>([
    {
      id: 'quantum-resistant',
      name: 'Quantum-Resistant Encryption',
      description: 'Future-proof encryption resistant to quantum computing attacks',
      enabled: true,
      premium: true,
      required: true
    },
    {
      id: 'zero-knowledge-proofs',
      name: 'Zero-Knowledge Proofs',
      description: 'Verify ownership without revealing sensitive information',
      enabled: true,
      premium: true,
      required: true
    },
    {
      id: 'multi-chain-locking',
      name: 'Triple-Chain Locking Mechanism',
      description: 'Assets secured simultaneously across TON, Ethereum, and Solana networks',
      enabled: true,
      premium: true,
      required: true
    },
    {
      id: 'time-lock',
      name: 'Temporal Security Protocol',
      description: 'Time-based access restrictions with adaptive unlock windows',
      enabled: true,
      premium: false,
      required: false
    },
    {
      id: 'biometric',
      name: 'Biometric Verification Layer',
      description: 'Add fingerprint or facial recognition as an additional security factor',
      enabled: false,
      premium: true,
      required: false
    },
    {
      id: 'geo-restriction',
      name: 'Geographic Access Controls',
      description: 'Restrict vault access to specific geographic locations',
      enabled: false,
      premium: true,
      required: false
    }
  ]);
  
  // Recovery options
  const [recoveryOptions, setRecoveryOptions] = useState<RecoveryOption[]>([
    {
      id: 'social-recovery',
      name: 'Social Guardian Recovery',
      description: 'Designated trusted guardians can help recover access',
      securityLevel: 4,
      selected: true
    },
    {
      id: 'delayed-recovery',
      name: 'Time-Delayed Recovery',
      description: 'Recovery process requires a mandatory waiting period with notifications',
      securityLevel: 5,
      selected: true
    },
    {
      id: 'multi-chain-verification',
      name: 'Cross-Chain Verification',
      description: 'Recovery requires verification across multiple blockchain networks',
      securityLevel: 5,
      selected: true
    }
  ]);
  
  // Effect to calculate security score based on selections
  useEffect(() => {
    let score = 85; // Base score for Sovereign Fortress
    
    // Add points for enabled security features
    securityFeatures.forEach(feature => {
      if (feature.enabled && !feature.required) {
        score += 2;
      }
    });
    
    // Add points for recovery options
    recoveryOptions.forEach(option => {
      if (option.selected) {
        score += option.securityLevel;
      }
    });
    
    // Add points for multi-signature setup
    if (requiredSignatures > 1) {
      score += (requiredSignatures * 3);
    }
    
    // Add points for cross-chain verification
    if (crossChainVerification) {
      score += (verificationChains.length * 2);
    }
    
    // Cap at 100
    score = Math.min(score, 100);
    
    setSecurityScore(score);
  }, [securityFeatures, recoveryOptions, requiredSignatures, crossChainVerification, verificationChains]);
  
  // Effect to calculate gas fees and discounts
  useEffect(() => {
    // Base fee for Sovereign Fortress vault
    let baseFee = 250;
    
    // Add fees for additional security features
    const enabledPremiumFeatures = securityFeatures.filter(f => f.enabled && f.premium && !f.required).length;
    baseFee += (enabledPremiumFeatures * 50);
    
    // Add fees for additional authorized parties
    baseFee += ((authorizedParties.length - 1) * 25);
    
    // Calculate CVT staking discount
    let discount = 0;
    if (cvtToken.stakedAmount >= 100000) {
      discount = 100; // 100% discount for 100k+ CVT (Vault Sovereign tier)
    } else if (cvtToken.stakedAmount >= 10000) {
      discount = 90; // 90% discount for 10k+ CVT (Vault Architect tier)
    } else if (cvtToken.stakedAmount >= 1000) {
      discount = 75; // 75% discount for 1k+ CVT (Vault Guardian tier)
    } else if (cvtToken.stakedAmount >= 100) {
      discount = 25; // 25% discount for 100+ CVT
    }
    
    setEstimatedGasFee(baseFee);
    setCvtStakingDiscount(discount);
  }, [securityFeatures, authorizedParties, cvtToken.stakedAmount]);
  
  // Add a new authorized party
  const addAuthorizedParty = () => {
    const newParty: AuthorizedParty = {
      id: (authorizedParties.length + 1).toString(),
      name: `Guardian ${authorizedParties.length}`,
      address: '',
      role: 'guardian',
      permissions: ['recovery', 'audit']
    };
    setAuthorizedParties([...authorizedParties, newParty]);
  };
  
  // Update an authorized party
  const updateAuthorizedParty = (id: string, field: keyof AuthorizedParty, value: any) => {
    const updatedParties = authorizedParties.map(party => {
      if (party.id === id) {
        return { ...party, [field]: value };
      }
      return party;
    });
    setAuthorizedParties(updatedParties);
  };
  
  // Remove an authorized party
  const removeAuthorizedParty = (id: string) => {
    // Don't remove the primary owner
    if (id === '1') return;
    
    const updatedParties = authorizedParties.filter(party => party.id !== id);
    setAuthorizedParties(updatedParties);
  };
  
  // Toggle security feature
  const toggleSecurityFeature = (id: string) => {
    const updatedFeatures = securityFeatures.map(feature => {
      if (feature.id === id && !feature.required) {
        return { ...feature, enabled: !feature.enabled };
      }
      return feature;
    });
    setSecurityFeatures(updatedFeatures);
  };
  
  // Toggle recovery option
  const toggleRecoveryOption = (id: string) => {
    const updatedOptions = recoveryOptions.map(option => {
      if (option.id === id) {
        return { ...option, selected: !option.selected };
      }
      return option;
    });
    setRecoveryOptions(updatedOptions);
  };
  
  // Handle blockchain selection
  const handleBlockchainSelect = (blockchain: BlockchainType) => {
    setSelectedBlockchain(blockchain);
  };
  
  // Check if wallet is connected for the selected blockchain
  const isWalletConnected = (blockchain: BlockchainType): boolean => {
    switch(blockchain) {
      case BlockchainType.TON:
        return Boolean(ton.isConnected && ton.walletInfo?.address);
      case BlockchainType.ETHEREUM:
        return Boolean(ethereum.isConnected);
      case BlockchainType.SOLANA:
        return Boolean(solana.isConnected);
      default:
        return false;
    }
  };
  
  // Get wallet address for display
  const getWalletAddress = (blockchain: BlockchainType): string => {
    switch(blockchain) {
      case BlockchainType.TON:
        return ton.walletInfo?.address || 'Not connected';
      case BlockchainType.ETHEREUM:
        return ethereum.walletAddress || 'Not connected';
      case BlockchainType.SOLANA:
        return solana.walletAddress || 'Not connected';
      default:
        return 'Not connected';
    }
  };
  
  // Validate current step and proceed to next
  const handleNextStep = () => {
    if (step === 1) {
      if (!vaultName) {
        toast({
          title: "Vault Name Required",
          description: "Please provide a name for your Sovereign Fortress Vault",
          variant: "destructive",
        });
        return;
      }
    } else if (step === 2) {
      if (!unlockDate && !hasUnlockWindow) {
        toast({
          title: "Time Settings Required",
          description: "Please configure either an unlock date or an unlock window",
          variant: "destructive",
        });
        return;
      }
    } else if (step === 3) {
      if (authorizedParties.some(party => party.address === '')) {
        toast({
          title: "Address Required",
          description: "Please provide blockchain addresses for all authorized parties",
          variant: "destructive",
        });
        return;
      }
    } else if (step === 4) {
      if (!isWalletConnected(selectedBlockchain)) {
        toast({
          title: "Wallet Connection Required",
          description: `Please connect your ${selectedBlockchain} wallet to deploy the vault`,
          variant: "destructive",
        });
        return;
      }
    }
    
    setStep(step + 1);
  };
  
  // Go back to previous step
  const handlePreviousStep = () => {
    setStep(Math.max(1, step - 1));
  };
  
  // Create the Sovereign Fortress vault
  const handleCreateVault = async () => {
    setIsLoading(true);
    
    try {
      // Build complete vault configuration
      const vaultConfig = {
        name: vaultName,
        description: vaultDescription,
        encryptionMode: encryptionMode,
        timeLock: {
          unlockDate: unlockDate || undefined,
          hasUnlockWindow: hasUnlockWindow,
          unlockWindowDays: unlockWindowDays,
          emergencyUnlock: emergencyUnlock
        },
        multiSignature: {
          requiredSignatures: requiredSignatures,
          authorizedParties: authorizedParties
        },
        security: {
          features: securityFeatures.filter(f => f.enabled).map(f => f.id),
          recoveryOptions: recoveryOptions.filter(r => r.selected).map(r => r.id),
          crossChainVerification: crossChainVerification,
          verificationChains: verificationChains
        },
        blockchain: {
          primaryNetwork: selectedBlockchain,
          deploymentAddress: getWalletAddress(selectedBlockchain)
        },
        attachments: mediaAttachments
      };
      
      console.log("Creating Sovereign Fortress vault with config:", vaultConfig);
      
      // Simulate successful vault creation for development
      setTimeout(() => {
        setIsLoading(false);
        toast({
          title: "Sovereign Fortress Vault Deployed",
          description: "Your ultimate security vault has been successfully created",
        });
        
        // Navigate to my vaults page after creation
        navigate("/my-vaults");
      }, 3000);
      
    } catch (error) {
      console.error("Error creating Sovereign Fortress vault:", error);
      setIsLoading(false);
      toast({
        title: "Error Creating Vault",
        description: "There was an error creating your vault. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Step progress indicators for the creation process
  const steps = [
    {
      id: 1,
      name: "Vault Details",
      icon: <FileKey className="h-5 w-5 text-[#6B00D7]" />
    },
    {
      id: 2,
      name: "Time Controls",
      icon: <Clock className="h-5 w-5 text-[#6B00D7]" />
    },
    {
      id: 3,
      name: "Security Matrix",
      icon: <Shield className="h-5 w-5 text-[#6B00D7]" />
    },
    {
      id: 4,
      name: "Blockchain",
      icon: <Globe className="h-5 w-5 text-[#6B00D7]" />
    },
    {
      id: 5,
      name: "Review & Deploy",
      icon: <Wallet className="h-5 w-5 text-[#6B00D7]" />
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-4"
          onClick={() => navigate("/vault-types")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center shadow-lg shadow-[#6B00D7]/30 mr-4">
          <Shield className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
            Sovereign Fortress Vault™
          </h1>
          <Badge variant="default" className="bg-[#6B00D7] hover:bg-[#6B00D7] text-white mt-1">
            Premium Vault
          </Badge>
        </div>
      </div>
      
      <p className="text-lg text-gray-300 max-w-3xl mb-8">
        The ultimate all-in-one vault with supreme security & flexibility, combining cutting-edge cryptographic protection across multiple blockchains.
      </p>

      {/* Step Progress Indicator */}
      <div className="flex items-center justify-between mb-8 px-4 py-2 bg-black/20 rounded-lg">
        {steps.map((s, i) => (
          <div key={s.id} className="flex flex-col items-center relative">
            <div 
              className={`w-12 h-12 rounded-full flex items-center justify-center z-10 ${
                step > s.id 
                  ? "bg-[#6B00D7]" 
                  : step === s.id 
                    ? "bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] animate-pulse" 
                    : "bg-gray-800"
              }`}
            >
              {step > s.id ? (
                <CheckCircle2 className="h-6 w-6 text-white" />
              ) : (
                <div className="text-white">{s.icon}</div>
              )}
            </div>
            <span className={`text-sm mt-2 ${step === s.id ? "font-bold text-white" : "text-gray-400"}`}>
              {s.name}
            </span>
            
            {i < steps.length - 1 && (
              <div className={`absolute top-6 left-[calc(100%_-_12px)] h-0.5 w-[calc(100%_+_8px)] -z-0 ${
                step > s.id ? "bg-[#6B00D7]" : "bg-gray-800"
              }`} />
            )}
          </div>
        ))}
      </div>
      
      {/* Current Security Score */}
      <div className="mb-8 bg-black/20 p-4 rounded-lg">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Security Rating</span>
          <span className="text-sm font-bold text-[#6B00D7]">{securityScore}%</span>
        </div>
        <Progress value={securityScore} className="h-2" />
        <div className="flex items-center justify-center mt-3">
          <Lock className="h-4 w-4 text-[#6B00D7] mr-1" />
          <span className="text-xs">Sovereign Fortress provides military-grade security for your digital assets</span>
        </div>
      </div>
      
      {/* Step 1: Basic Vault Information */}
      {step === 1 && (
        <Card className="bg-[#1A1A1A] border-[#333]">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <FileKey className="h-5 w-5 text-[#6B00D7] mr-2" />
              Vault Configuration
            </CardTitle>
            <CardDescription>
              Set up the basic details of your Sovereign Fortress Vault
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="vaultName">Vault Name</Label>
              <Input
                id="vaultName"
                placeholder="Enter a name for your vault"
                value={vaultName}
                onChange={(e) => setVaultName(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="vaultDescription">Description (Optional)</Label>
              <Textarea
                id="vaultDescription"
                placeholder="Describe the purpose of this vault"
                value={vaultDescription}
                onChange={(e) => setVaultDescription(e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>
            
            <div>
              <Label>Encryption Protocol</Label>
              <RadioGroup 
                value={encryptionMode} 
                onValueChange={(value) => setEncryptionMode(value as EncryptionMode)}
                className="mt-2"
              >
                <div className="flex items-start space-x-2 p-2 hover:bg-black/20 rounded-md">
                  <RadioGroupItem value="fortress" id="fortress" className="mt-1" />
                  <div>
                    <Label htmlFor="fortress" className="font-bold cursor-pointer flex items-center">
                      Fortress Protocol <Badge className="ml-2 bg-[#6B00D7]">Maximum</Badge>
                    </Label>
                    <p className="text-sm text-gray-400 mt-1">
                      Military-grade encryption with SPHINCS+ signatures and FrodoKEM-1344 key exchange
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 p-2 hover:bg-black/20 rounded-md">
                  <RadioGroupItem value="quantum-resistant" id="quantum-resistant" className="mt-1" />
                  <div>
                    <Label htmlFor="quantum-resistant" className="cursor-pointer">
                      Quantum-Resistant Protocol
                    </Label>
                    <p className="text-sm text-gray-400 mt-1">
                      CRYSTALS-Dilithium signatures with Kyber-1024 key exchange
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label>Media Attachments (Optional)</Label>
              <p className="text-sm text-gray-400 mb-2">
                Add media or documents to your vault. All files are encrypted with your selected protocol.
              </p>
              <MediaUploader onUploadComplete={setMediaAttachments} />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end">
            <Button onClick={handleNextStep} className="bg-[#6B00D7] hover:bg-[#8B00D7]">
              Continue
              <ChevronsRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {/* Step 2: Time-lock Controls */}
      {step === 2 && (
        <Card className="bg-[#1A1A1A] border-[#333]">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <Clock className="h-5 w-5 text-[#6B00D7] mr-2" />
              Temporal Security Layer
            </CardTitle>
            <CardDescription>
              Configure time-based access restrictions for your vault
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="unlockDate">Unlock Date (Optional)</Label>
              <Input
                id="unlockDate"
                type="date"
                value={unlockDate}
                onChange={(e) => setUnlockDate(e.target.value)}
                className="mt-1"
              />
              <p className="text-sm text-gray-400 mt-1">
                The vault will remain locked until this date. Leave blank for no time-lock.
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="unlockWindow"
                checked={hasUnlockWindow}
                onCheckedChange={setHasUnlockWindow}
              />
              <Label htmlFor="unlockWindow" className="cursor-pointer">
                Enable Unlock Window
              </Label>
            </div>
            
            {hasUnlockWindow && (
              <div>
                <Label htmlFor="unlockWindowDays">Unlock Window Duration (Days)</Label>
                <Input
                  id="unlockWindowDays"
                  type="number"
                  min="1"
                  max="365"
                  value={unlockWindowDays}
                  onChange={(e) => setUnlockWindowDays(parseInt(e.target.value))}
                  className="mt-1"
                />
                <p className="text-sm text-gray-400 mt-1">
                  The vault can only be accessed during this window after the unlock date
                </p>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Switch
                id="emergencyUnlock"
                checked={emergencyUnlock}
                onCheckedChange={setEmergencyUnlock}
              />
              <Label htmlFor="emergencyUnlock" className="cursor-pointer">
                Enable Emergency Access Protocol
              </Label>
            </div>
            
            {emergencyUnlock && (
              <Alert>
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <AlertTitle>Emergency Access Enabled</AlertTitle>
                <AlertDescription className="text-sm text-gray-400">
                  Guardians can initiate a time-delayed emergency access procedure with multi-chain verification.
                  This provides a safety net while maintaining high security.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handlePreviousStep}>
              Back
            </Button>
            <Button onClick={handleNextStep} className="bg-[#6B00D7] hover:bg-[#8B00D7]">
              Continue
              <ChevronsRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {/* Step 3: Security Configuration */}
      {step === 3 && (
        <Card className="bg-[#1A1A1A] border-[#333]">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <Shield className="h-5 w-5 text-[#6B00D7] mr-2" />
              Advanced Security Matrix
            </CardTitle>
            <CardDescription>
              Configure multi-signature access and security features
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Multi-signature Configuration */}
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <KeyRound className="h-5 w-5 text-[#6B00D7] mr-2" />
                Multi-Signature Setup
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="requiredSignatures">Required Signatures</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Input
                      id="requiredSignatures"
                      type="number"
                      min="1"
                      max={authorizedParties.length}
                      value={requiredSignatures}
                      onChange={(e) => setRequiredSignatures(parseInt(e.target.value))}
                      className="w-20"
                    />
                    <span>of {authorizedParties.length} authorized parties</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>Authorized Parties</Label>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={addAuthorizedParty}
                      className="text-xs flex items-center"
                    >
                      <UserPlus className="h-3 w-3 mr-1" />
                      Add Guardian
                    </Button>
                  </div>
                  
                  {authorizedParties.map((party) => (
                    <div key={party.id} className="border border-gray-800 rounded-md p-3 mb-3">
                      <div className="grid grid-cols-4 gap-3 mb-3">
                        <div className="col-span-1">
                          <Label htmlFor={`party-name-${party.id}`} className="text-xs">Name</Label>
                          <Input
                            id={`party-name-${party.id}`}
                            value={party.name}
                            onChange={(e) => updateAuthorizedParty(party.id, 'name', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor={`party-address-${party.id}`} className="text-xs">Blockchain Address</Label>
                          <Input
                            id={`party-address-${party.id}`}
                            value={party.address}
                            onChange={(e) => updateAuthorizedParty(party.id, 'address', e.target.value)}
                            className="mt-1"
                            placeholder="Enter address or ENS name"
                          />
                        </div>
                        <div className="col-span-1">
                          <Label htmlFor={`party-role-${party.id}`} className="text-xs">Role</Label>
                          <select
                            id={`party-role-${party.id}`}
                            value={party.role}
                            onChange={(e) => updateAuthorizedParty(party.id, 'role', e.target.value)}
                            className="w-full h-9 mt-1 rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground"
                            disabled={party.id === '1'} // Primary owner role cannot be changed
                          >
                            <option value="owner">Owner</option>
                            <option value="guardian">Guardian</option>
                            <option value="beneficiary">Beneficiary</option>
                            <option value="auditor">Auditor</option>
                          </select>
                        </div>
                      </div>
                      
                      {party.id !== '1' && (
                        <div className="flex justify-end">
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => removeAuthorizedParty(party.id)}
                            className="text-xs"
                          >
                            Remove
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Advanced Security Features */}
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Shield className="h-5 w-5 text-[#6B00D7] mr-2" />
                Security Features
              </h3>
              
              <div className="space-y-3">
                {securityFeatures.map((feature) => (
                  <div key={feature.id} className={`flex items-start space-x-3 p-2 rounded-md ${feature.premium ? 'bg-[#2A1143]/50' : 'hover:bg-black/20'}`}>
                    <Switch
                      id={`feature-${feature.id}`}
                      checked={feature.enabled}
                      onCheckedChange={() => toggleSecurityFeature(feature.id)}
                      disabled={feature.required}
                    />
                    <div>
                      <Label htmlFor={`feature-${feature.id}`} className="flex items-center cursor-pointer">
                        {feature.name}
                        {feature.premium && <Badge className="ml-2 bg-[#6B00D7]/70 text-xs">Premium</Badge>}
                        {feature.required && <Badge className="ml-2 bg-[#6B00D7] text-xs">Required</Badge>}
                      </Label>
                      <p className="text-sm text-gray-400 mt-1">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Recovery Options */}
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Shield className="h-5 w-5 text-[#6B00D7] mr-2" />
                Recovery Protocol
              </h3>
              
              <div className="space-y-3">
                {recoveryOptions.map((option) => (
                  <div key={option.id} className="flex items-start space-x-3 p-2 hover:bg-black/20 rounded-md">
                    <Switch
                      id={`recovery-${option.id}`}
                      checked={option.selected}
                      onCheckedChange={() => toggleRecoveryOption(option.id)}
                    />
                    <div>
                      <Label htmlFor={`recovery-${option.id}`} className="flex items-center cursor-pointer">
                        {option.name}
                        <Badge className="ml-2 bg-gray-700 text-xs">Level {option.securityLevel}</Badge>
                      </Label>
                      <p className="text-sm text-gray-400 mt-1">{option.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Cross-Chain Verification */}
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Globe className="h-5 w-5 text-[#6B00D7] mr-2" />
                Cross-Chain Security
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="crossChainVerification"
                    checked={crossChainVerification}
                    onCheckedChange={setCrossChainVerification}
                    disabled={true}
                  />
                  <Label htmlFor="crossChainVerification" className="cursor-pointer flex items-center">
                    Triple-Chain Protection System
                    <Badge className="ml-2 bg-[#6B00D7] text-xs">Required</Badge>
                  </Label>
                </div>
                
                <p className="text-sm text-gray-400 ml-10">
                  Sovereign Fortress uses a revolutionary Triple-Chain Protection system to secure your assets 
                  simultaneously across TON, Ethereum, and Solana networks.
                </p>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handlePreviousStep}>
              Back
            </Button>
            <Button onClick={handleNextStep} className="bg-[#6B00D7] hover:bg-[#8B00D7]">
              Continue
              <ChevronsRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {/* Step 4: Blockchain Selection */}
      {step === 4 && (
        <Card className="bg-[#1A1A1A] border-[#333]">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <Globe className="h-5 w-5 text-[#6B00D7] mr-2" />
              Select Primary Blockchain
            </CardTitle>
            <CardDescription>
              Choose the main blockchain to deploy your vault
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card 
                className={`border-2 cursor-pointer ${selectedBlockchain === BlockchainType.TON ? 'border-[#0098EA]' : 'border-gray-800 hover:border-gray-700'}`}
                onClick={() => handleBlockchainSelect(BlockchainType.TON)}
              >
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-[#0098EA]/10 flex items-center justify-center mb-3">
                    <span className="text-2xl text-[#0098EA]">💎</span>
                  </div>
                  <h3 className="font-medium mb-1">TON Network</h3>
                  <p className="text-sm text-gray-400 mb-2">Fast & Low Fees</p>
                  <div className={`text-xs px-2 py-1 rounded-full ${isWalletConnected(BlockchainType.TON) ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                    {isWalletConnected(BlockchainType.TON) ? 'Connected' : 'Connect Wallet'}
                  </div>
                </CardContent>
              </Card>
              
              <Card 
                className={`border-2 cursor-pointer ${selectedBlockchain === BlockchainType.ETHEREUM ? 'border-[#62688F]' : 'border-gray-800 hover:border-gray-700'}`}
                onClick={() => handleBlockchainSelect(BlockchainType.ETHEREUM)}
              >
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-[#62688F]/10 flex items-center justify-center mb-3">
                    <span className="text-2xl text-[#62688F]">⟠</span>
                  </div>
                  <h3 className="font-medium mb-1">Ethereum</h3>
                  <p className="text-sm text-gray-400 mb-2">Highest Security</p>
                  <div className={`text-xs px-2 py-1 rounded-full ${isWalletConnected(BlockchainType.ETHEREUM) ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                    {isWalletConnected(BlockchainType.ETHEREUM) ? 'Connected' : 'Connect Wallet'}
                  </div>
                </CardContent>
              </Card>
              
              <Card 
                className={`border-2 cursor-pointer ${selectedBlockchain === BlockchainType.SOLANA ? 'border-[#9945FF]' : 'border-gray-800 hover:border-gray-700'}`}
                onClick={() => handleBlockchainSelect(BlockchainType.SOLANA)}
              >
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-[#9945FF]/10 flex items-center justify-center mb-3">
                    <span className="text-2xl text-[#9945FF]">◎</span>
                  </div>
                  <h3 className="font-medium mb-1">Solana</h3>
                  <p className="text-sm text-gray-400 mb-2">High Speed & Scale</p>
                  <div className={`text-xs px-2 py-1 rounded-full ${isWalletConnected(BlockchainType.SOLANA) ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                    {isWalletConnected(BlockchainType.SOLANA) ? 'Connected' : 'Connect Wallet'}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Triple-Chain Explanation */}
            <Alert className="bg-[#2A1143]/50 border-[#6B00D7]/50">
              <Shield className="h-5 w-5 text-[#6B00D7]" />
              <AlertTitle>Triple-Chain Protection System</AlertTitle>
              <AlertDescription className="text-sm text-gray-300">
                While you select a primary blockchain for deployment, the Sovereign Fortress Vault employs a revolutionary 
                Triple-Chain Protection System. Your assets will be secured by cryptographic verifications on TON, Ethereum, 
                and Solana simultaneously, preventing single-chain vulnerabilities.
              </AlertDescription>
            </Alert>
            
            {/* Fee Estimation */}
            <div className="bg-black/20 border border-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3">Deployment Cost Estimate</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Base Deployment Fee:</span>
                  <span>{estimatedGasFee} CVT</span>
                </div>
                {cvtStakingDiscount > 0 && (
                  <div className="flex justify-between items-center text-green-400">
                    <span>CVT Staking Discount:</span>
                    <span>-{cvtStakingDiscount}%</span>
                  </div>
                )}
                <div className="border-t border-gray-800 pt-2 mt-2">
                  <div className="flex justify-between items-center font-bold">
                    <span>Final Cost:</span>
                    <span>
                      {cvtStakingDiscount === 100 
                        ? "FREE" 
                        : `${Math.max(0, estimatedGasFee * (1 - cvtStakingDiscount / 100))} CVT`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handlePreviousStep}>
              Back
            </Button>
            <Button onClick={handleNextStep} className="bg-[#6B00D7] hover:bg-[#8B00D7]">
              Continue
              <ChevronsRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {/* Step 5: Review & Create */}
      {step === 5 && (
        <Card className="bg-[#1A1A1A] border-[#333]">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <ListChecks className="h-5 w-5 text-[#6B00D7] mr-2" />
              Review & Deploy Vault
            </CardTitle>
            <CardDescription>
              Review your vault configuration and create your Sovereign Fortress
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Vault Configuration</h3>
                
                <div className="bg-black/30 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Name:</span>
                    <span className="font-medium">{vaultName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Security Score:</span>
                    <span className="font-medium text-[#6B00D7]">{securityScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Encryption:</span>
                    <span className="font-medium">{encryptionMode === 'fortress' ? 'Fortress Protocol' : 'Quantum-Resistant'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Primary Blockchain:</span>
                    <span className="font-medium">{selectedBlockchain}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Multi-Signature:</span>
                    <span className="font-medium">{requiredSignatures} of {authorizedParties.length}</span>
                  </div>
                  {unlockDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Unlock Date:</span>
                      <span className="font-medium">{new Date(unlockDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {hasUnlockWindow && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Unlock Window:</span>
                      <span className="font-medium">{unlockWindowDays} days</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-400">Media Attachments:</span>
                    <span className="font-medium">{mediaAttachments.length}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Security Features</h3>
                
                <div className="bg-black/30 rounded-lg p-4 space-y-2">
                  {securityFeatures.filter(f => f.enabled).map(feature => (
                    <div key={feature.id} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-[#6B00D7] mr-2 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium">{feature.name}</div>
                        <div className="text-xs text-gray-400">{feature.description}</div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t border-gray-800 my-2 pt-2">
                    <div className="font-medium mb-1">Recovery Protocols:</div>
                    {recoveryOptions.filter(o => o.selected).map(option => (
                      <div key={option.id} className="ml-2 text-sm flex items-center mb-1">
                        <CheckCircle2 className="h-4 w-4 text-[#6B00D7] mr-1" />
                        {option.name}
                      </div>
                    ))}
                  </div>
                </div>
                
                <Alert className="bg-[#2A1143]/50 border-[#6B00D7]/50">
                  <Shield className="h-4 w-4 text-[#6B00D7]" />
                  <AlertTitle className="text-sm">Triple-Chain Protection Active</AlertTitle>
                  <AlertDescription className="text-xs text-gray-300">
                    Your vault is protected by our revolutionary Triple-Chain system, 
                    distributing security across TON, Ethereum, and Solana.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
            
            <Alert>
              <FlaskConical className="h-4 w-4 text-amber-400" />
              <AlertTitle>Deployment Information</AlertTitle>
              <AlertDescription className="text-sm text-gray-400">
                Creating a Sovereign Fortress Vault will deploy smart contracts across multiple blockchains.
                This is an advanced operation that requires sufficient tokens on your selected primary blockchain.
                Please ensure your wallet is connected and has adequate funds.
              </AlertDescription>
            </Alert>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handlePreviousStep}>
              Back
            </Button>
            <Button 
              onClick={handleCreateVault}
              disabled={isLoading}
              className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deploying Vault...
                </>
              ) : (
                <>
                  Deploy Sovereign Fortress Vault
                  <ChevronsRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {/* Premium Features Showcase */}
      <div className="mt-8 bg-[#1A1A1A] border-[#333] border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Zap className="mr-2 h-5 w-5 text-[#FF5AF7]" /> Sovereign Fortress Exclusive Features
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-black/30 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <div className="h-8 w-8 rounded-full bg-[#6B00D7]/20 flex items-center justify-center mr-3">
                <Shield className="h-4 w-4 text-[#6B00D7]" />
              </div>
              <h3 className="font-medium">Military-Grade Security</h3>
            </div>
            <p className="text-sm text-gray-400">
              SPHINCS+ signatures and FrodoKEM-1344 encryption provide security that's resistant to both classical and quantum attacks.
            </p>
          </div>
          
          <div className="bg-black/30 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <div className="h-8 w-8 rounded-full bg-[#6B00D7]/20 flex items-center justify-center mr-3">
                <Globe className="h-4 w-4 text-[#6B00D7]" />
              </div>
              <h3 className="font-medium">Triple-Chain Protection</h3>
            </div>
            <p className="text-sm text-gray-400">
              Revolutionary technology that secures your assets simultaneously across TON, Ethereum, and Solana networks.
            </p>
          </div>
          
          <div className="bg-black/30 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <div className="h-8 w-8 rounded-full bg-[#6B00D7]/20 flex items-center justify-center mr-3">
                <KeyRound className="h-4 w-4 text-[#6B00D7]" />
              </div>
              <h3 className="font-medium">Advanced Access Control</h3>
            </div>
            <p className="text-sm text-gray-400">
              Customizable multi-signature requirements, time-locks, and role-based permissions for ultimate control.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SovereignFortressVaultPage;