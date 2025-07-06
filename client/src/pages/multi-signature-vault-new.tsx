import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  ArrowLeft, Shield, Users, Clock, ChevronRight, Wallet, UserPlus, Minus,
  Plus, CheckCircle, Lock, Key, QrCode, Globe, CheckSquare, AlertTriangle,
  RefreshCw, ShieldCheck, User, Network, Fingerprint, Eye, EyeOff, LucideIcon,
  Ellipsis, CircleAlert, HelpCircle, KeyRound
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { BlockchainType } from '@/contexts/multi-chain-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { VaultCreationProgress, getDefaultVaultCreationSteps, type Step } from "@/components/vault/create-vault-progress";
import { Textarea } from "@/components/ui/textarea";

// Security level display component
const SecurityLevelIndicator = ({ level }: { level: number }) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1 mb-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div 
            key={i}
            className={`h-1.5 w-6 rounded-full ${i < level ? "bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]" : "bg-gray-700"}`}
          />
        ))}
      </div>
      <span className="text-xs text-gray-400">Security Level: {level}/5</span>
    </div>
  );
};

// Recovery Method Component
interface RecoveryMethod {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  securityLevel: number;
}

const recoveryMethods: RecoveryMethod[] = [
  {
    id: "social",
    name: "Social Recovery",
    description: "Allow trusted contacts to help recover vault access",
    icon: User,
    color: "#FF5AF7",
    securityLevel: 4
  },
  {
    id: "backup",
    name: "Hardware Key Backup",
    description: "Use physical security keys for recovery",
    icon: Key,
    color: "#6B00D7",
    securityLevel: 5
  },
  {
    id: "delay",
    name: "Time-Delayed Recovery",
    description: "Vault recovery with mandatory waiting period",
    icon: Clock,
    color: "#00D7C3",
    securityLevel: 3
  },
  {
    id: "biometric",
    name: "Biometric Verification",
    description: "Use fingerprint or facial recognition",
    icon: Fingerprint,
    color: "#00E5A0",
    securityLevel: 4
  }
];

// Encryption options
interface EncryptionOption {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  securityLevel: number;
}

const encryptionOptions: EncryptionOption[] = [
  {
    id: "standard",
    name: "Standard Encryption",
    description: "Industry-standard encryption protocols",
    icon: Lock,
    securityLevel: 3
  },
  {
    id: "advanced",
    name: "Advanced Encryption",
    description: "Enhanced algorithms with higher security",
    icon: ShieldCheck,
    securityLevel: 4
  },
  {
    id: "quantum",
    name: "Quantum-Resistant",
    description: "Protection against quantum computing attacks",
    icon: Shield,
    securityLevel: 5
  }
];

// Multi-signature Vault Page Component
const MultiSignatureVaultNewPage: React.FC = () => {
  const { toast } = useToast();
  const [activeStep, setActiveStep] = useState("basics");
  const [steps, setSteps] = useState<Step[]>(getDefaultVaultCreationSteps("details"));
  
  // Vault basics
  const [vaultName, setVaultName] = useState("");
  const [vaultDescription, setVaultDescription] = useState("");
  const [selectedBlockchain, setSelectedBlockchain] = useState<BlockchainType>(BlockchainType.TON);
  const [vaultTags, setVaultTags] = useState<string[]>([]);
  
  // Signers
  const [signers, setSigners] = useState([{ 
    name: "", 
    address: "", 
    email: "", 
    role: "standard", 
    recoveryEnabled: false 
  }]);
  const [threshold, setThreshold] = useState(1);
  const [selfAddedAsSigner, setSelfAddedAsSigner] = useState(true);
  
  // Advanced security options
  const [timelock, setTimelock] = useState(false);
  const [timelockDuration, setTimelockDuration] = useState(24);
  const [crossChainVerification, setCrossChainVerification] = useState(false);
  const [recoveryMechanism, setRecoveryMechanism] = useState<string>("none");
  const [selectedEncryption, setSelectedEncryption] = useState<string>("standard");
  const [vaultSecurityLevel, setVaultSecurityLevel] = useState(3);
  const [socialRecoveryContacts, setSocialRecoveryContacts] = useState([{ name: "", email: "", phone: "" }]);
  const [automatedBackups, setAutomatedBackups] = useState(true);
  const [geolocationLock, setGeolocationLock] = useState(false);
  const [emergencyContact, setEmergencyContact] = useState({ name: "", email: "", phone: "" });
  const [selectedCrosschainNetworks, setSelectedCrosschainNetworks] = useState<number[]>([]);
  
  // Vault access
  const [privateVault, setPrivateVault] = useState(false);
  const [accessLog, setAccessLog] = useState(true);
  const [notifyOnAccess, setNotifyOnAccess] = useState(true);
  const [customAccessMessage, setCustomAccessMessage] = useState("");
  
  // Vault transaction limits
  const [dailyLimit, setDailyLimit] = useState(false);
  const [dailyLimitAmount, setDailyLimitAmount] = useState(1000);
  const [twoFactorAuthentication, setTwoFactorAuthentication] = useState(false);
  
  // Creation states
  const [isLoading, setIsLoading] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [vaultId, setVaultId] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  // Update security level based on selected options
  useEffect(() => {
    let securityScore = 3; // Base score
    
    // Add points for various security features
    if (threshold > 1) securityScore += 0.5;
    if (threshold > signers.length / 2) securityScore += 0.5;
    if (timelock) securityScore += 0.5;
    if (crossChainVerification) securityScore += 1;
    if (recoveryMechanism !== "none") {
      const method = recoveryMethods.find(m => m.id === recoveryMechanism);
      if (method) securityScore += (method.securityLevel - 3) / 2;
    }
    if (selectedEncryption !== "standard") {
      const encryption = encryptionOptions.find(e => e.id === selectedEncryption);
      if (encryption) securityScore += (encryption.securityLevel - 3) / 2;
    }
    if (twoFactorAuthentication) securityScore += 0.5;
    if (automatedBackups) securityScore += 0.25;
    if (geolocationLock) securityScore += 0.5;
    
    // Cap at 5
    securityScore = Math.min(5, securityScore);
    
    setVaultSecurityLevel(Math.round(securityScore));
  }, [
    threshold, signers, timelock, crossChainVerification, 
    recoveryMechanism, selectedEncryption, twoFactorAuthentication,
    automatedBackups, geolocationLock
  ]);

  // Connect wallet simulation
  const connectWallet = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const simulatedAddress = "EQDrjaLahX...v67Npqw";
      setWalletAddress(simulatedAddress);
      setWalletConnected(true);
      
      // Add self as first signer
      if (selfAddedAsSigner) {
        const newSigners = [...signers];
        newSigners[0] = {
          ...newSigners[0],
          name: "You (Owner)",
          address: simulatedAddress,
          role: "owner"
        };
        setSigners(newSigners);
      }
      
      setIsLoading(false);
      
      // Update steps
      const updatedSteps = steps.map(step => 
        step.id === "wallet" 
          ? {...step, status: "complete"} 
          : step.id === "details" 
            ? {...step, status: "current"} 
            : step
      );
      setSteps(updatedSteps);
      
      toast({
        title: "Wallet Connected",
        description: `Successfully connected wallet: ${simulatedAddress}`,
      });
    }, 1500);
  };

  // Add new signer
  const addSigner = () => {
    if (signers.length < 10) {
      setSigners([...signers, { 
        name: "", 
        address: "", 
        email: "", 
        role: "standard", 
        recoveryEnabled: false 
      }]);
    }
  };

  // Remove signer
  const removeSigner = (index: number) => {
    if (signers.length > 1) {
      const newSigners = signers.filter((_, i) => i !== index);
      setSigners(newSigners);
      if (threshold > newSigners.length) {
        setThreshold(newSigners.length);
      }
    }
  };

  // Handle signer input changes
  const handleSignerChange = (index: number, field: string, value: any) => {
    const newSigners = [...signers];
    newSigners[index] = { ...newSigners[index], [field]: value };
    setSigners(newSigners);
  };

  // Add social recovery contact
  const addSocialRecoveryContact = () => {
    setSocialRecoveryContacts([...socialRecoveryContacts, { name: "", email: "", phone: "" }]);
  };

  // Remove social recovery contact
  const removeSocialRecoveryContact = (index: number) => {
    if (socialRecoveryContacts.length > 1) {
      setSocialRecoveryContacts(socialRecoveryContacts.filter((_, i) => i !== index));
    }
  };

  // Handle social recovery contact changes
  const handleSocialRecoveryChange = (index: number, field: string, value: string) => {
    const newContacts = [...socialRecoveryContacts];
    newContacts[index] = { ...newContacts[index], [field]: value };
    setSocialRecoveryContacts(newContacts);
  };

  // Handle emergency contact changes
  const handleEmergencyContactChange = (field: string, value: string) => {
    setEmergencyContact({ ...emergencyContact, [field]: value });
  };

  // Toggle cross-chain network selection
  const toggleCrossChainNetwork = (network: number) => {
    setSelectedCrosschainNetworks(prev => 
      prev.includes(network) 
        ? prev.filter(n => n !== network)
        : [...prev, network]
    );
  };

  // Generate vault ID
  const generateVaultId = () => {
    return "msig-" + Math.random().toString(36).substring(2, 10);
  };

  // Navigate between steps
  const goToStep = (step: string) => {
    let allValid = true;
    
    // Validate current step
    if (activeStep === "wallet" && !walletConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to continue.",
        variant: "destructive"
      });
      allValid = false;
    }
    
    if (activeStep === "basics" && !vaultName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a name for your vault.",
        variant: "destructive"
      });
      allValid = false;
    }
    
    if (activeStep === "signers" && signers.some(signer => !signer.address.trim())) {
      toast({
        title: "Missing Information",
        description: "All signers must have a valid address.",
        variant: "destructive"
      });
      allValid = false;
    }
    
    if (activeStep === "recovery" && recoveryMechanism === "social" && 
        socialRecoveryContacts.some(contact => !contact.name || !contact.email)) {
      toast({
        title: "Missing Information",
        description: "All social recovery contacts must have a name and email.",
        variant: "destructive"
      });
      allValid = false;
    }
    
    if (allValid) {
      // Update step status
      const updatedSteps = steps.map(s => {
        if (s.id === mapStepToId(activeStep)) {
          return {...s, status: "complete" as const};
        } else if (s.id === mapStepToId(step)) {
          return {...s, status: "current" as const};
        }
        return s;
      });
      
      setSteps(updatedSteps);
      setActiveStep(step);
    }
  };

  // Map UI steps to progress component step IDs
  const mapStepToId = (step: string): string => {
    switch (step) {
      case "wallet": return "wallet";
      case "basics": return "details";
      case "signers": return "security";
      case "security": return "security";
      case "recovery": return "security";
      case "access": return "assets";
      case "review": return "review";
      default: return step;
    }
  };

  // Submit form
  const handleSubmit = () => {
    setIsLoading(true);
    
    // Validation
    if (!vaultName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a name for your vault.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    if (signers.some(signer => !signer.address.trim())) {
      toast({
        title: "Missing Information",
        description: "All signers must have a valid address.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    // Success simulation
    setTimeout(() => {
      const newVaultId = generateVaultId();
      setVaultId(newVaultId);
      setIsCreated(true);
      
      // Update all steps to complete
      const finalSteps = steps.map(step => ({...step, status: "complete" as const}));
      setSteps(finalSteps);
      
      toast({
        title: "Success!",
        description: `Multi-Signature Vault created with ID: ${newVaultId}`,
      });
      setIsLoading(false);
    }, 2000);
  };

  // Reset form for a new vault
  const createNewVault = () => {
    setActiveStep("wallet");
    setVaultName("");
    setVaultDescription("");
    setSigners([{ name: "", address: "", email: "", role: "standard", recoveryEnabled: false }]);
    setThreshold(1);
    setTimelock(false);
    setTimelockDuration(24);
    setCrossChainVerification(false);
    setRecoveryMechanism("none");
    setSelectedEncryption("standard");
    setSocialRecoveryContacts([{ name: "", email: "", phone: "" }]);
    setWalletConnected(false);
    setWalletAddress("");
    setIsCreated(false);
    setVaultId("");
    setSteps(getDefaultVaultCreationSteps("wallet"));
    setSelfAddedAsSigner(true);
    setAutomatedBackups(true);
    setGeolocationLock(false);
    setEmergencyContact({ name: "", email: "", phone: "" });
    setSelectedCrosschainNetworks([]);
    setPrivateVault(false);
    setAccessLog(true);
    setNotifyOnAccess(true);
    setCustomAccessMessage("");
    setDailyLimit(false);
    setDailyLimitAmount(1000);
    setTwoFactorAuthentication(false);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header Section */}
      <div className="mb-6">
        <Link href="/vault-types">
          <Button variant="ghost" className="mb-4 hover:bg-[#6B00D7]/10">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Vault Types
          </Button>
        </Link>

        <div className="flex flex-col md:flex-row md:items-center mb-4 md:mb-6">
          <div className="flex items-center mb-3 md:mb-0 md:mr-6">
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center shadow-lg shadow-[#6B00D7]/30 mr-4">
              <Users className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
              Multi-Signature Vault
            </h1>
          </div>

          {!isCreated && (
            <div className="flex items-center ml-0 md:ml-auto">
              <SecurityLevelIndicator level={vaultSecurityLevel} />
            </div>
          )}
        </div>
        
        <p className="text-gray-400 max-w-3xl">
          Our advanced Multi-Signature Vault employs Triple-Chain technology to ensure exceptional security, 
          requiring multiple parties to approve transactions for enhanced protection of valuable assets.
        </p>
      </div>
      
      {/* Success View */}
      {isCreated ? (
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <VaultCreationProgress steps={steps} currentStepId="review" variant="horizontal" />
          </div>
          
          <Card className="bg-gradient-to-br from-[#1A1A1A] to-[#222] border border-[#333] overflow-hidden">
            <CardContent className="pt-6 pb-8 px-6">
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-12 w-12 text-[#FF5AF7]" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Vault Created Successfully!</h2>
                <p className="text-gray-300 mb-6">Your Multi-Signature Vault is now active and ready to use</p>
                <div className="bg-[#111] rounded-md p-3 mb-4 flex items-center justify-center">
                  <span className="font-mono text-[#FF5AF7] font-medium">{vaultId}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <Card className="bg-[#222] border-[#333]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Vault Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-400">Vault Name</p>
                      <p className="font-medium">{vaultName}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-400">Blockchain</p>
                      <p className="font-medium">
                        {selectedBlockchain === BlockchainType.TON ? "TON" : 
                         selectedBlockchain === BlockchainType.ETHEREUM ? "Ethereum" : 
                         selectedBlockchain === BlockchainType.SOLANA ? "Solana" : "Unknown"}
                      </p>
                    </div>
                    
                    {vaultDescription && (
                      <div>
                        <p className="text-sm text-gray-400">Description</p>
                        <p className="text-sm">{vaultDescription}</p>
                      </div>
                    )}
                    
                    <div>
                      <p className="text-sm text-gray-400">Security Level</p>
                      <div className="mt-1">
                        <SecurityLevelIndicator level={vaultSecurityLevel} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-[#222] border-[#333]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Security Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-400">Signature Requirement</p>
                      <p className="font-medium">{threshold} of {signers.length} signatures required</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-400">Encryption</p>
                      <p className="font-medium">
                        {selectedEncryption === "quantum" ? "Quantum-Resistant" : 
                         selectedEncryption === "advanced" ? "Advanced Encryption" : 
                         "Standard Encryption"}
                      </p>
                    </div>
                    
                    {recoveryMechanism !== "none" && (
                      <div>
                        <p className="text-sm text-gray-400">Recovery Method</p>
                        <p className="font-medium">
                          {recoveryMechanism === "social" ? "Social Recovery" :
                           recoveryMechanism === "backup" ? "Hardware Key Backup" :
                           recoveryMechanism === "delay" ? "Time-Delayed Recovery" :
                           recoveryMechanism === "biometric" ? "Biometric Verification" : "None"}
                        </p>
                      </div>
                    )}
                    
                    {timelock && (
                      <div>
                        <p className="text-sm text-gray-400">Time-Lock Protection</p>
                        <p className="font-medium">{timelockDuration} hour waiting period</p>
                      </div>
                    )}
                    
                    {crossChainVerification && (
                      <div>
                        <p className="text-sm text-gray-400">Cross-Chain Verification</p>
                        <p className="font-medium">Enabled with {selectedCrosschainNetworks.length} networks</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="bg-[#222] border-[#333] md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Signers ({signers.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {signers.map((signer, index) => (
                        <div key={index} className="bg-[#1A1A1A] p-3 rounded-md">
                          <div className="flex items-center mb-2">
                            <div className={`h-8 w-8 rounded-full ${signer.role === "owner" ? "bg-[#FF5AF7]/20" : "bg-[#6B00D7]/20"} flex items-center justify-center mr-2`}>
                              <User className={`h-4 w-4 ${signer.role === "owner" ? "text-[#FF5AF7]" : "text-[#6B00D7]"}`} />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{signer.name || `Signer #${index + 1}`}</p>
                              <p className="text-xs text-gray-500">{signer.role === "owner" ? "Owner" : "Signer"}</p>
                            </div>
                          </div>
                          <p className="text-xs font-mono text-gray-400 truncate">{signer.address}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  variant="outline" 
                  className="flex-1 border-[#6B00D7] text-[#FF5AF7] hover:bg-[#6B00D7]/10"
                  onClick={createNewVault}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Another Vault
                </Button>
                <Link href="/my-vaults">
                  <Button 
                    className="flex-1 sm:min-w-[180px] bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#7B10E7] hover:to-[#FF6AF7]"
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    Go to My Vaults
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          {/* Step Progress */}
          <div className="mb-8">
            <VaultCreationProgress 
              steps={steps} 
              currentStepId={mapStepToId(activeStep)} 
              variant="horizontal" 
            />
          </div>
          
          {/* Step: Connect Wallet */}
          {activeStep === "wallet" && (
            <Card className="bg-[#1A1A1A] border-[#333]">
              <CardHeader>
                <CardTitle className="text-xl text-white">Connect Your Wallet</CardTitle>
                <CardDescription>
                  Connect your blockchain wallet to create and manage your multi-signature vault
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-6 space-y-4">
                  <div className="h-20 w-20 rounded-full bg-[#6B00D7]/10 flex items-center justify-center mb-2">
                    <Wallet className="h-8 w-8 text-[#FF5AF7]" />
                  </div>
                  
                  {walletConnected ? (
                    <div className="text-center">
                      <p className="text-green-400 mb-2">Wallet Connected</p>
                      <p className="font-mono text-sm text-gray-400">{walletAddress}</p>
                    </div>
                  ) : (
                    <div className="text-center max-w-md">
                      <p className="text-gray-400 mb-4">
                        Connect your wallet to create a Multi-Signature Vault with Triple-Chain protection
                      </p>
                    </div>
                  )}
                  
                  <Button 
                    onClick={connectWallet}
                    disabled={isLoading || walletConnected}
                    className="w-full max-w-xs bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#7B10E7] hover:to-[#FF6AF7]"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Connecting...
                      </>
                    ) : walletConnected ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Connected
                      </>
                    ) : (
                      <>
                        <Wallet className="mr-2 h-4 w-4" />
                        Connect Wallet
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="mt-8 border-t border-gray-800 pt-6">
                  <div className="flex items-center mb-4">
                    <Checkbox 
                      id="add-self" 
                      checked={selfAddedAsSigner}
                      onCheckedChange={(checked) => setSelfAddedAsSigner(!!checked)}
                    />
                    <label htmlFor="add-self" className="ml-2 text-sm">
                      Add myself as a signer
                    </label>
                  </div>
                  <div className="bg-[#111] rounded-md p-4 text-sm text-gray-400">
                    <p className="flex items-start">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        Your wallet will be needed to sign transactions and manage the vault. Make sure you have access to this wallet.
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={() => goToStep("basics")}
                  disabled={!walletConnected}
                  className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#7B10E7] hover:to-[#FF6AF7]"
                >
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Step: Vault Basics */}
          {activeStep === "basics" && (
            <Card className="bg-[#1A1A1A] border-[#333]">
              <CardHeader>
                <CardTitle className="text-xl text-white">Vault Basics</CardTitle>
                <CardDescription>
                  Set up the basic information for your multi-signature vault
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="vault-name">Vault Name</Label>
                    <Input 
                      id="vault-name" 
                      placeholder="e.g., Family Emergency Fund" 
                      value={vaultName}
                      onChange={(e) => setVaultName(e.target.value)}
                      className="mt-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Choose a clear name to easily identify this vault
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="vault-description">Description (Optional)</Label>
                    <Textarea 
                      id="vault-description" 
                      placeholder="Describe the purpose of this vault..." 
                      value={vaultDescription}
                      onChange={(e) => setVaultDescription(e.target.value)}
                      className="mt-2 h-24"
                    />
                  </div>
                  
                  <div>
                    <Label>Blockchain</Label>
                    <Select 
                      value={selectedBlockchain.toString()} 
                      onValueChange={(value) => {
                        const blockchainValue = Number(value);
                        if (blockchainValue === BlockchainType.TON ||
                            blockchainValue === BlockchainType.ETHEREUM ||
                            blockchainValue === BlockchainType.SOLANA) {
                          setSelectedBlockchain(blockchainValue);
                        }
                      }}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select a blockchain" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={BlockchainType.TON.toString()}>
                          <div className="flex items-center">
                            <div className="w-4 h-4 mr-2 rounded-full bg-[#0088CC] flex items-center justify-center text-[10px] text-white font-bold">T</div>
                            TON
                          </div>
                        </SelectItem>
                        <SelectItem value={BlockchainType.ETHEREUM.toString()}>
                          <div className="flex items-center">
                            <div className="w-4 h-4 mr-2 rounded-full bg-[#627EEA] flex items-center justify-center text-[10px] text-white font-bold">E</div>
                            Ethereum
                          </div>
                        </SelectItem>
                        <SelectItem value={BlockchainType.SOLANA.toString()}>
                          <div className="flex items-center">
                            <div className="w-4 h-4 mr-2 rounded-full bg-[#9945FF] flex items-center justify-center text-[10px] text-white font-bold">S</div>
                            Solana
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      Choose the primary blockchain for your vault
                    </p>
                  </div>
                  
                  <div>
                    <Label>Vault Tags (Optional)</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {["Business", "Personal", "Family", "Emergency", "Investment", "Inheritance"].map(tag => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setVaultTags(prev => 
                            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                          )}
                          className={`
                            text-xs px-3 py-1.5 rounded-full transition-colors duration-200
                            ${vaultTags.includes(tag) 
                              ? 'bg-[#6B00D7] text-white' 
                              : 'bg-[#333] text-gray-300 hover:bg-[#444]'}
                          `}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="ghost" 
                  onClick={() => goToStep("wallet")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button 
                  onClick={() => goToStep("signers")}
                  className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#7B10E7] hover:to-[#FF6AF7]"
                >
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Step: Signers & Threshold */}
          {activeStep === "signers" && (
            <Card className="bg-[#1A1A1A] border-[#333]">
              <CardHeader>
                <CardTitle className="text-xl text-white">Signers & Threshold</CardTitle>
                <CardDescription>
                  Define who can sign transactions and how many signatures are required
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <Label className="text-base">Signers ({signers.length})</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={addSigner}
                              disabled={signers.length >= 10}
                            >
                              <UserPlus className="h-4 w-4 mr-1" /> Add Signer
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Add up to 10 signers to your vault</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    
                    <div className="space-y-4">
                      {signers.map((signer, index) => (
                        <Card key={index} className="bg-[#222]">
                          <CardContent className="pt-4">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center">
                                <div className={`h-8 w-8 rounded-full ${index === 0 && selfAddedAsSigner ? "bg-[#FF5AF7]/20" : "bg-[#6B00D7]/20"} flex items-center justify-center mr-2`}>
                                  <User className={`h-4 w-4 ${index === 0 && selfAddedAsSigner ? "text-[#FF5AF7]" : "text-[#6B00D7]"}`} />
                                </div>
                                <span className="font-medium text-white">{
                                  index === 0 && selfAddedAsSigner 
                                    ? "You (Owner)" 
                                    : `Signer #${index + 1}`
                                }</span>
                              </div>
                              {!(index === 0 && selfAddedAsSigner) && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0" 
                                  onClick={() => removeSigner(index)}
                                >
                                  <Minus className="h-4 w-4 text-red-400" />
                                </Button>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor={`signer-name-${index}`}>Name</Label>
                                <Input
                                  id={`signer-name-${index}`}
                                  placeholder="e.g., John Doe"
                                  value={signer.name}
                                  onChange={(e) => handleSignerChange(index, 'name', e.target.value)}
                                  className="mt-1"
                                  disabled={index === 0 && selfAddedAsSigner}
                                />
                              </div>
                              <div>
                                <Label htmlFor={`signer-address-${index}`}>Blockchain Address</Label>
                                <Input
                                  id={`signer-address-${index}`}
                                  placeholder="Enter wallet address"
                                  value={signer.address}
                                  onChange={(e) => handleSignerChange(index, 'address', e.target.value)}
                                  className="mt-1"
                                  disabled={index === 0 && selfAddedAsSigner}
                                />
                              </div>
                              <div>
                                <Label htmlFor={`signer-email-${index}`}>Email (Optional)</Label>
                                <Input
                                  id={`signer-email-${index}`}
                                  placeholder="e.g., john@example.com"
                                  value={signer.email}
                                  onChange={(e) => handleSignerChange(index, 'email', e.target.value)}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`signer-role-${index}`}>Role</Label>
                                <Select
                                  value={signer.role}
                                  onValueChange={(value) => handleSignerChange(index, 'role', value)}
                                  disabled={index === 0 && selfAddedAsSigner}
                                >
                                  <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select role" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="owner">{index === 0 ? "Owner (You)" : "Owner"}</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="standard">Standard</SelectItem>
                                    <SelectItem value="limited">Limited Access</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="md:col-span-2">
                                <div className="flex items-center space-x-2 mt-2">
                                  <Checkbox 
                                    id={`recovery-role-${index}`} 
                                    checked={signer.recoveryEnabled}
                                    onCheckedChange={(checked) => 
                                      handleSignerChange(index, 'recoveryEnabled', !!checked)
                                    }
                                  />
                                  <label
                                    htmlFor={`recovery-role-${index}`}
                                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    Grant recovery powers (can help recover vault access)
                                  </label>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-base">Required Signatures (M of N)</Label>
                    <div className="mt-4 bg-[#222] p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm">Minimum required:</span>
                        <span className="text-lg font-semibold">{threshold} of {signers.length}</span>
                      </div>
                      
                      <Slider
                        value={[threshold]}
                        min={1}
                        max={signers.length}
                        step={1}
                        onValueChange={(value) => setThreshold(value[0])}
                        className="mt-4"
                      />
                      
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>Lower Security</span>
                        <span>Higher Security</span>
                      </div>
                      
                      <div className="mt-4 text-sm">
                        {threshold === 1 ? (
                          <div className="flex items-start text-yellow-400">
                            <AlertTriangle className="h-4 w-4 mr-2 mt-0.5" />
                            <span>Only 1 signature is required, which offers basic security. Consider increasing for valuable assets.</span>
                          </div>
                        ) : threshold < signers.length / 2 ? (
                          <div className="flex items-start text-yellow-400">
                            <AlertTriangle className="h-4 w-4 mr-2 mt-0.5" />
                            <span>Less than half of signers are required. Consider higher threshold for valuable assets.</span>
                          </div>
                        ) : threshold === signers.length ? (
                          <div className="flex items-start text-green-400">
                            <ShieldCheck className="h-4 w-4 mr-2 mt-0.5" />
                            <span>All signers are required, providing maximum security but could cause delays if any signer is unavailable.</span>
                          </div>
                        ) : threshold > signers.length / 2 ? (
                          <div className="flex items-start text-green-400">
                            <ShieldCheck className="h-4 w-4 mr-2 mt-0.5" />
                            <span>Majority of signers required, providing good balance of security and usability.</span>
                          </div>
                        ) : (
                          <div className="flex items-start text-gray-400">
                            <Info className="h-4 w-4 mr-2 mt-0.5" />
                            <span>Select the number of signatures required for any transaction from this vault.</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="ghost" 
                  onClick={() => goToStep("basics")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button 
                  onClick={() => goToStep("security")}
                  className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#7B10E7] hover:to-[#FF6AF7]"
                >
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Step: Advanced Security Options */}
          {activeStep === "security" && (
            <Card className="bg-[#1A1A1A] border-[#333]">
              <CardHeader>
                <CardTitle className="text-xl text-white">Advanced Security</CardTitle>
                <CardDescription>
                  Configure additional security features for your vault
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="encryption" className="space-y-6">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="encryption">Encryption</TabsTrigger>
                    <TabsTrigger value="timelock">Time Lock</TabsTrigger>
                    <TabsTrigger value="crosschain">Cross-Chain</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="encryption" className="space-y-6">
                    <div>
                      <h3 className="text-base font-medium mb-3">Encryption Level</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {encryptionOptions.map(option => (
                          <Card 
                            key={option.id}
                            className={`bg-[#222] cursor-pointer transition-all hover:bg-[#2A2A2A] ${
                              selectedEncryption === option.id ? 'ring-2 ring-[#FF5AF7]' : 'ring-1 ring-[#333]'
                            }`}
                            onClick={() => setSelectedEncryption(option.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-full bg-[#6B00D7]/20 flex items-center justify-center mr-2">
                                    <option.icon className="h-4 w-4 text-[#FF5AF7]" />
                                  </div>
                                  <h4 className="font-medium text-sm">{option.name}</h4>
                                </div>
                                <div className="flex items-center justify-center w-6 h-6 rounded-full border border-gray-600">
                                  {selectedEncryption === option.id && (
                                    <div className="w-3 h-3 rounded-full bg-[#FF5AF7]" />
                                  )}
                                </div>
                              </div>
                              <p className="text-xs text-gray-400 min-h-[40px]">{option.description}</p>
                              <div className="mt-2">
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <div 
                                      key={i}
                                      className={`h-1 w-3 rounded-full ${i < option.securityLevel ? "bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]" : "bg-gray-700"}`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <ShieldCheck className="h-4 w-4 text-[#FF5AF7] mr-2" />
                          <h3 className="font-medium">Automated Backups</h3>
                        </div>
                        <Switch 
                          checked={automatedBackups} 
                          onCheckedChange={setAutomatedBackups} 
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Globe className="h-4 w-4 text-[#FF5AF7] mr-2" />
                          <h3 className="font-medium">Geolocation Lock</h3>
                        </div>
                        <Switch 
                          checked={geolocationLock} 
                          onCheckedChange={setGeolocationLock} 
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <QrCode className="h-4 w-4 text-[#FF5AF7] mr-2" />
                          <h3 className="font-medium">Two-Factor Authentication</h3>
                        </div>
                        <Switch 
                          checked={twoFactorAuthentication} 
                          onCheckedChange={setTwoFactorAuthentication} 
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="timelock" className="space-y-6">
                    <Card className="bg-[#222] border-[#333]">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-[#FF5AF7]" /> Time-Lock Protection
                            </h3>
                            <p className="text-sm text-gray-400 mt-1">
                              Add mandatory waiting period between transaction initiation and execution
                            </p>
                          </div>
                          <Switch 
                            checked={timelock} 
                            onCheckedChange={setTimelock} 
                          />
                        </div>
                        
                        {timelock && (
                          <div className="mt-6 space-y-4">
                            <div>
                              <Label>Waiting Period</Label>
                              <div className="flex items-center mt-2">
                                <Input
                                  type="number"
                                  min={1}
                                  max={168}
                                  value={timelockDuration}
                                  onChange={(e) => setTimelockDuration(parseInt(e.target.value) || 24)}
                                  className="w-24 mr-2"
                                />
                                <span>hours</span>
                              </div>
                            </div>
                            
                            <div className="bg-[#1A1A1A] p-4 rounded-md">
                              <h4 className="text-sm font-medium mb-2">How Time-Lock Works:</h4>
                              <ol className="text-xs text-gray-400 space-y-2 list-decimal list-inside">
                                <li>Transaction is initiated by required number of signers</li>
                                <li>Transaction enters waiting period of {timelockDuration} hours</li>
                                <li>Any signer can cancel the transaction during waiting period</li>
                                <li>After waiting period expires, transaction is automatically executed</li>
                              </ol>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-[#222] border-[#333]">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold flex items-center">
                              <Wallet className="h-4 w-4 mr-2 text-[#FF5AF7]" /> Daily Transaction Limit
                            </h3>
                            <p className="text-sm text-gray-400 mt-1">
                              Set maximum daily transaction amount
                            </p>
                          </div>
                          <Switch 
                            checked={dailyLimit} 
                            onCheckedChange={setDailyLimit} 
                          />
                        </div>
                        
                        {dailyLimit && (
                          <div className="mt-6">
                            <Label>Maximum Daily Amount</Label>
                            <div className="flex items-center mt-2">
                              <Input
                                type="number"
                                min={1}
                                value={dailyLimitAmount}
                                onChange={(e) => setDailyLimitAmount(parseInt(e.target.value) || 1000)}
                                className="w-32 mr-2"
                              />
                              <span>USD equivalent</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Amounts exceeding this limit will require additional verification
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="crosschain" className="space-y-6">
                    <Card className="bg-[#222] border-[#333]">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold flex items-center">
                              <Network className="h-4 w-4 mr-2 text-[#FF5AF7]" /> Cross-Chain Verification
                            </h3>
                            <p className="text-sm text-gray-400 mt-1">
                              Verify transactions across multiple blockchains for enhanced security
                            </p>
                          </div>
                          <Switch 
                            checked={crossChainVerification} 
                            onCheckedChange={setCrossChainVerification} 
                          />
                        </div>
                        
                        {crossChainVerification && (
                          <div className="mt-6">
                            <Label className="mb-2 block">Select verification networks:</Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {[
                                { id: 1, name: "Ethereum", color: "#627EEA" },
                                { id: 2, name: "TON", color: "#0088CC" },
                                { id: 3, name: "Solana", color: "#9945FF" },
                                { id: 4, name: "Bitcoin", color: "#F7931A" }
                              ].map(network => (
                                <button
                                  key={network.id}
                                  type="button"
                                  onClick={() => toggleCrossChainNetwork(network.id)}
                                  className={`
                                    flex items-center justify-between p-3 rounded-md border border-gray-700
                                    ${selectedCrosschainNetworks.includes(network.id) 
                                      ? `bg-[${network.color}]/10 border-[${network.color}]/40` 
                                      : 'bg-[#1A1A1A]'}
                                  `}
                                  style={{
                                    backgroundColor: selectedCrosschainNetworks.includes(network.id) 
                                      ? `${network.color}15` 
                                      : '#1A1A1A',
                                    borderColor: selectedCrosschainNetworks.includes(network.id) 
                                      ? `${network.color}50` 
                                      : undefined
                                  }}
                                >
                                  <span>{network.name}</span>
                                  {selectedCrosschainNetworks.includes(network.id) && (
                                    <CheckSquare className="h-4 w-4" style={{ color: network.color }} />
                                  )}
                                </button>
                              ))}
                            </div>
                            
                            <div className="bg-[#1A1A1A] p-4 rounded-md mt-4">
                              <p className="text-xs text-gray-400">
                                <strong>How Cross-Chain Verification Works:</strong> Transactions are verified across multiple blockchains, ensuring no single chain vulnerability can compromise your vault. This creates a distributed security system that requires multiple simultaneous breaches to compromise.
                              </p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="ghost" 
                  onClick={() => goToStep("signers")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button 
                  onClick={() => goToStep("recovery")}
                  className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#7B10E7] hover:to-[#FF6AF7]"
                >
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Step: Recovery Methods */}
          {activeStep === "recovery" && (
            <Card className="bg-[#1A1A1A] border-[#333]">
              <CardHeader>
                <CardTitle className="text-xl text-white">Vault Recovery</CardTitle>
                <CardDescription>
                  Set up recovery methods in case access is lost
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-medium mb-3">Recovery Method</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Card 
                        className={`bg-[#222] border border-[#333] cursor-pointer hover:bg-[#2A2A2A] ${
                          recoveryMechanism === "none" ? 'ring-2 ring-[#FF5AF7]' : ''
                        }`}
                        onClick={() => setRecoveryMechanism("none")}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-[#6B00D7]/20 flex items-center justify-center mr-2">
                                <Lock className="h-4 w-4 text-[#FF5AF7]" />
                              </div>
                              <h4 className="font-medium text-sm">No Recovery</h4>
                            </div>
                            <div className="flex items-center justify-center w-6 h-6 rounded-full border border-gray-600">
                              {recoveryMechanism === "none" && (
                                <div className="w-3 h-3 rounded-full bg-[#FF5AF7]" />
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-gray-400">No recovery method. Full vault security but potential permanent loss if access is lost.</p>
                        </CardContent>
                      </Card>
                      
                      {recoveryMethods.map(method => (
                        <Card 
                          key={method.id}
                          className={`bg-[#222] border border-[#333] cursor-pointer hover:bg-[#2A2A2A] ${
                            recoveryMechanism === method.id ? 'ring-2 ring-[#FF5AF7]' : ''
                          }`}
                          onClick={() => setRecoveryMechanism(method.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-[#6B00D7]/20 flex items-center justify-center mr-2">
                                  <method.icon className="h-4 w-4 text-[#FF5AF7]" />
                                </div>
                                <h4 className="font-medium text-sm">{method.name}</h4>
                              </div>
                              <div className="flex items-center justify-center w-6 h-6 rounded-full border border-gray-600">
                                {recoveryMechanism === method.id && (
                                  <div className="w-3 h-3 rounded-full bg-[#FF5AF7]" />
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-gray-400">{method.description}</p>
                            <div className="mt-2">
                              <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <div 
                                    key={i}
                                    className={`h-1 w-3 rounded-full ${i < method.securityLevel ? "bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]" : "bg-gray-700"}`}
                                  />
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Social Recovery Options */}
                  {recoveryMechanism === "social" && (
                    <div className="mt-6">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-base font-medium">
                          Trusted Recovery Contacts ({socialRecoveryContacts.length})
                        </h3>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={addSocialRecoveryContact}
                        >
                          <UserPlus className="h-4 w-4 mr-1" /> Add Contact
                        </Button>
                      </div>
                      
                      <div className="space-y-3">
                        {socialRecoveryContacts.map((contact, index) => (
                          <Card key={index} className="bg-[#222]">
                            <CardContent className="pt-4">
                              <div className="flex justify-between items-start mb-3">
                                <span className="font-medium text-white">Recovery Contact #{index + 1}</span>
                                {socialRecoveryContacts.length > 1 && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-7 w-7 p-0" 
                                    onClick={() => removeSocialRecoveryContact(index)}
                                  >
                                    <Minus className="h-4 w-4 text-red-400" />
                                  </Button>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                  <Label htmlFor={`contact-name-${index}`}>Name</Label>
                                  <Input
                                    id={`contact-name-${index}`}
                                    placeholder="e.g., Jane Doe"
                                    value={contact.name}
                                    onChange={(e) => handleSocialRecoveryChange(index, 'name', e.target.value)}
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`contact-email-${index}`}>Email</Label>
                                  <Input
                                    id={`contact-email-${index}`}
                                    placeholder="e.g., jane@example.com"
                                    value={contact.email}
                                    onChange={(e) => handleSocialRecoveryChange(index, 'email', e.target.value)}
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`contact-phone-${index}`}>Phone (Optional)</Label>
                                  <Input
                                    id={`contact-phone-${index}`}
                                    placeholder="e.g., +1234567890"
                                    value={contact.phone}
                                    onChange={(e) => handleSocialRecoveryChange(index, 'phone', e.target.value)}
                                    className="mt-1"
                                  />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      
                      <div className="bg-[#1A1A1A] p-4 rounded-md mt-4">
                        <p className="text-sm flex items-start">
                          <HelpCircle className="h-4 w-4 text-[#FF5AF7] mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-400 text-xs">
                            Social recovery allows these trusted contacts to help you regain access to your vault if access is lost. 
                            At least {Math.ceil(socialRecoveryContacts.length / 2)} of {socialRecoveryContacts.length} contacts 
                            will need to verify your identity to initiate the recovery process.
                          </span>
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Hardware Key Backup Options */}
                  {recoveryMechanism === "backup" && (
                    <div className="mt-6">
                      <Card className="bg-[#222]">
                        <CardContent className="p-4">
                          <h3 className="font-medium mb-3">Hardware Key Recovery</h3>
                          <p className="text-sm text-gray-400 mb-4">
                            This method uses physical hardware keys as backup access to your vault. You will need to set up at least 2 hardware keys.
                          </p>
                          
                          <div className="space-y-4">
                            <div className="bg-[#1A1A1A] p-4 rounded-md">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                  <KeyRound className="h-4 w-4 text-[#FF5AF7] mr-2" /> 
                                  <span className="text-sm font-medium">Primary Hardware Key</span>
                                </div>
                                <span className="text-xs text-green-400">Ready</span>
                              </div>
                              <p className="text-xs text-gray-400">Your current hardware key will be registered as the primary backup.</p>
                            </div>
                            
                            <div className="bg-[#1A1A1A] p-4 rounded-md">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                  <KeyRound className="h-4 w-4 text-[#FF5AF7] mr-2" /> 
                                  <span className="text-sm font-medium">Secondary Hardware Key</span>
                                </div>
                                <Button variant="outline" size="sm" className="h-7 py-0">Set Up</Button>
                              </div>
                              <p className="text-xs text-gray-400">Register a second hardware key as backup.</p>
                            </div>
                          </div>
                          
                          <div className="mt-4 p-3 bg-[#111] rounded-md">
                            <p className="text-xs text-gray-400">
                              <strong>Important:</strong> Store your hardware keys in secure, separate locations. Loss of both keys may result in permanent loss of vault access.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                  
                  {/* Time-Delayed Recovery Options */}
                  {recoveryMechanism === "delay" && (
                    <div className="mt-6">
                      <Card className="bg-[#222]">
                        <CardContent className="p-4">
                          <h3 className="font-medium mb-3">Time-Delayed Recovery Settings</h3>
                          
                          <div className="space-y-4">
                            <div>
                              <Label>Waiting Period</Label>
                              <Select defaultValue="30d">
                                <SelectTrigger className="mt-2">
                                  <SelectValue placeholder="Select waiting period" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="7d">7 days</SelectItem>
                                  <SelectItem value="14d">14 days</SelectItem>
                                  <SelectItem value="30d">30 days</SelectItem>
                                  <SelectItem value="60d">60 days</SelectItem>
                                  <SelectItem value="90d">90 days</SelectItem>
                                </SelectContent>
                              </Select>
                              <p className="text-xs text-gray-500 mt-1">
                                Recovery process will require this waiting period before access is granted
                              </p>
                            </div>
                            
                            <div>
                              <Label>Emergency Contact (Optional)</Label>
                              <Card className="bg-[#1A1A1A] mt-2">
                                <CardContent className="pt-4">                             
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div>
                                      <Label htmlFor="emergency-name">Name</Label>
                                      <Input
                                        id="emergency-name"
                                        placeholder="e.g., John Doe"
                                        value={emergencyContact.name}
                                        onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
                                        className="mt-1"
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="emergency-email">Email</Label>
                                      <Input
                                        id="emergency-email"
                                        placeholder="e.g., john@example.com"
                                        value={emergencyContact.email}
                                        onChange={(e) => handleEmergencyContactChange('email', e.target.value)}
                                        className="mt-1"
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="emergency-phone">Phone</Label>
                                      <Input
                                        id="emergency-phone"
                                        placeholder="e.g., +1234567890"
                                        value={emergencyContact.phone}
                                        onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
                                        className="mt-1"
                                      />
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                              <p className="text-xs text-gray-500 mt-1">
                                This person will be notified when recovery is initiated
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-4 p-3 bg-[#111] rounded-md">
                            <p className="text-xs text-gray-400">
                              <strong>How Time-Delayed Recovery Works:</strong> If you lose access, you can initiate recovery with your backup info. A countdown will begin, during which notifications are sent to all signers. If no objections are raised during the waiting period, access will be restored.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                  
                  {/* Biometric Verification Options */}
                  {recoveryMechanism === "biometric" && (
                    <div className="mt-6">
                      <Card className="bg-[#222]">
                        <CardContent className="p-4">
                          <h3 className="font-medium mb-3">Biometric Verification Setup</h3>
                          
                          <div className="space-y-4">
                            <div className="bg-[#1A1A1A] p-4 rounded-md flex items-center justify-between">
                              <div className="flex items-center">
                                <Fingerprint className="h-5 w-5 text-[#FF5AF7] mr-2" />
                                <div>
                                  <p className="font-medium">Fingerprint Verification</p>
                                  <p className="text-xs text-gray-400">Use your fingerprint for recovery</p>
                                </div>
                              </div>
                              <Button variant="outline" size="sm">Set Up</Button>
                            </div>
                            
                            <div className="bg-[#1A1A1A] p-4 rounded-md flex items-center justify-between">
                              <div className="flex items-center">
                                <Eye className="h-5 w-5 text-[#FF5AF7] mr-2" />
                                <div>
                                  <p className="font-medium">Facial Recognition</p>
                                  <p className="text-xs text-gray-400">Use facial recognition for recovery</p>
                                </div>
                              </div>
                              <Button variant="outline" size="sm">Set Up</Button>
                            </div>
                          </div>
                          
                          <div className="mt-4 p-3 bg-[#111] rounded-md">
                            <p className="text-xs text-gray-400">
                              <strong>Note:</strong> Biometric verification requires compatible hardware. You will need to set up your biometrics on each device you plan to use for vault recovery.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                  
                  {/* Emergency Override Section */}
                  <div className="mt-6">
                    <Card className="bg-[#222]">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <CircleAlert className="h-5 w-5 text-yellow-500 mr-2" />
                            <h3 className="font-medium">Emergency Override</h3>
                          </div>
                          <Button variant="outline" size="sm">Configure</Button>
                        </div>
                        <p className="text-sm text-gray-400">
                          Set up an emergency override mechanism that can be activated in exceptional circumstances, such as legal requirements or extreme emergencies.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="ghost" 
                  onClick={() => goToStep("security")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button 
                  onClick={() => goToStep("access")}
                  className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#7B10E7] hover:to-[#FF6AF7]"
                >
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Step: Vault Access Options */}
          {activeStep === "access" && (
            <Card className="bg-[#1A1A1A] border-[#333]">
              <CardHeader>
                <CardTitle className="text-xl text-white">Vault Access Controls</CardTitle>
                <CardDescription>
                  Configure how users access and interact with your vault
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <Card className="bg-[#222] border-[#333]">
                    <CardContent className="pt-4">
                      <h3 className="font-medium mb-4">Privacy Settings</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium flex items-center">
                              <EyeOff className="h-4 w-4 mr-2 text-[#FF5AF7]" /> Private Vault
                            </p>
                            <p className="text-sm text-gray-400 mt-1">
                              Hide this vault from public vault listings
                            </p>
                          </div>
                          <Switch 
                            checked={privateVault} 
                            onCheckedChange={setPrivateVault} 
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-[#FF5AF7]" /> Access Log
                            </p>
                            <p className="text-sm text-gray-400 mt-1">
                              Keep records of all access attempts
                            </p>
                          </div>
                          <Switch 
                            checked={accessLog} 
                            onCheckedChange={setAccessLog} 
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium flex items-center">
                              <Bell className="h-4 w-4 mr-2 text-[#FF5AF7]" /> Access Notifications
                            </p>
                            <p className="text-sm text-gray-400 mt-1">
                              Notify all signers when vault is accessed
                            </p>
                          </div>
                          <Switch 
                            checked={notifyOnAccess} 
                            onCheckedChange={setNotifyOnAccess} 
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div>
                    <Label htmlFor="access-message">Custom Access Message (Optional)</Label>
                    <Textarea 
                      id="access-message" 
                      placeholder="Enter a message to display when users access the vault..." 
                      value={customAccessMessage}
                      onChange={(e) => setCustomAccessMessage(e.target.value)}
                      className="mt-2 h-24"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This message will be shown to all signers when they access the vault
                    </p>
                  </div>
                  
                  <Card className="bg-[#222] border-[#333]">
                    <CardContent className="pt-4">
                      <h3 className="font-medium mb-4">Permissions</h3>
                      
                      <div className="space-y-3">
                        <div className="grid grid-cols-4 gap-2 text-sm">
                          <div className="col-span-2 font-medium">Action</div>
                          <div className="font-medium">Owner</div>
                          <div className="font-medium">Signers</div>
                        </div>
                        
                        <div className="h-px bg-gray-800 my-2"></div>
                        
                        {[
                          { action: "View vault balance", owner: true, signers: true },
                          { action: "Initiate transactions", owner: true, signers: true },
                          { action: "Sign transactions", owner: true, signers: true },
                          { action: "Add/remove signers", owner: true, signers: false },
                          { action: "Change vault settings", owner: true, signers: false },
                          { action: "View transaction history", owner: true, signers: true }
                        ].map((perm, i) => (
                          <div key={i} className="grid grid-cols-4 gap-2 text-sm py-1.5">
                            <div className="col-span-2 text-gray-300">{perm.action}</div>
                            <div>{perm.owner ? "✓" : "×"}</div>
                            <div>{perm.signers ? "✓" : "×"}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="ghost" 
                  onClick={() => goToStep("recovery")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button 
                  onClick={() => goToStep("review")}
                  className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#7B10E7] hover:to-[#FF6AF7]"
                >
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Step: Review and Create */}
          {activeStep === "review" && (
            <Card className="bg-[#1A1A1A] border-[#333]">
              <CardHeader>
                <CardTitle className="text-xl text-white">Review & Create Vault</CardTitle>
                <CardDescription>
                  Review all vault settings before creating
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-[#222] border-[#333]">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Vault Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-400">Vault Name</p>
                          <p className="font-medium">{vaultName}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-400">Blockchain</p>
                          <p className="font-medium">
                            {selectedBlockchain === BlockchainType.TON ? "TON" : 
                             selectedBlockchain === BlockchainType.ETHEREUM ? "Ethereum" : 
                             selectedBlockchain === BlockchainType.SOLANA ? "Solana" : "Unknown"}
                          </p>
                        </div>
                        
                        {vaultDescription && (
                          <div>
                            <p className="text-sm text-gray-400">Description</p>
                            <p className="text-sm">{vaultDescription}</p>
                          </div>
                        )}
                        
                        <div>
                          <p className="text-sm text-gray-400">Security Level</p>
                          <div className="mt-1">
                            <SecurityLevelIndicator level={vaultSecurityLevel} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-[#222] border-[#333]">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Security Settings</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-400">Signature Requirement</p>
                          <p className="font-medium">{threshold} of {signers.length} signatures required</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-400">Encryption</p>
                          <p className="font-medium">
                            {selectedEncryption === "quantum" ? "Quantum-Resistant" : 
                             selectedEncryption === "advanced" ? "Advanced Encryption" : 
                             "Standard Encryption"}
                          </p>
                        </div>
                        
                        {recoveryMechanism !== "none" && (
                          <div>
                            <p className="text-sm text-gray-400">Recovery Method</p>
                            <p className="font-medium">
                              {recoveryMechanism === "social" ? "Social Recovery" :
                               recoveryMechanism === "backup" ? "Hardware Key Backup" :
                               recoveryMechanism === "delay" ? "Time-Delayed Recovery" :
                               recoveryMechanism === "biometric" ? "Biometric Verification" : "None"}
                            </p>
                          </div>
                        )}
                        
                        {timelock && (
                          <div>
                            <p className="text-sm text-gray-400">Time-Lock Protection</p>
                            <p className="font-medium">{timelockDuration} hour waiting period</p>
                          </div>
                        )}
                        
                        {crossChainVerification && (
                          <div>
                            <p className="text-sm text-gray-400">Cross-Chain Verification</p>
                            <p className="font-medium">Enabled with {selectedCrosschainNetworks.length} networks</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card className="bg-[#222] border-[#333]">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Signers ({signers.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {signers.map((signer, index) => (
                          <div key={index} className="bg-[#1A1A1A] p-3 rounded-md">
                            <div className="flex items-center mb-2">
                              <div className={`h-8 w-8 rounded-full ${signer.role === "owner" ? "bg-[#FF5AF7]/20" : "bg-[#6B00D7]/20"} flex items-center justify-center mr-2`}>
                                <User className={`h-4 w-4 ${signer.role === "owner" ? "text-[#FF5AF7]" : "text-[#6B00D7]"}`} />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{signer.name || `Signer #${index + 1}`}</p>
                                <p className="text-xs text-gray-500">{signer.role === "owner" ? "Owner" : "Signer"}</p>
                              </div>
                            </div>
                            <p className="text-xs font-mono text-gray-400 truncate">{signer.address}</p>
                            {signer.recoveryEnabled && (
                              <div className="mt-2">
                                <span className="text-xs bg-[#6B00D7]/20 text-[#FF5AF7] px-2 py-0.5 rounded-full">Recovery Powers</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-[#222] border-[#333]">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Advanced Features</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2">
                          <div className="h-4 w-4 rounded-full bg-[#6B00D7]"></div>
                          <span>Triple-Chain Security</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="h-4 w-4 rounded-full bg-[#FF5AF7]"></div>
                          <span>Zero-Knowledge Privacy</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="h-4 w-4 rounded-full bg-[#00D7C3]"></div>
                          <span>AI-Assisted Security</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="h-4 w-4 rounded-full bg-[#6B00D7]"></div>
                          <span>Multi-Factor Authentication</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="h-4 w-4 rounded-full bg-[#FF5AF7]"></div>
                          <span>Advanced Threshold Signatures</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="h-4 w-4 rounded-full bg-[#00D7C3]"></div>
                          <span>Decentralized Security</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="p-4 bg-[#222] rounded-lg border border-yellow-600/30">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 mr-3" />
                      <div>
                        <h3 className="font-medium text-yellow-500">Important Security Notice</h3>
                        <p className="text-sm text-gray-300 mt-1">
                          You're about to create a Multi-Signature Vault with Triple-Chain security. Once created, certain
                          parameters cannot be modified. Please verify all details before continuing.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox id="terms" />
                    <label
                      htmlFor="terms"
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I understand the security implications and confirm all details are correct
                    </label>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="ghost" 
                  onClick={() => goToStep("access")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#7B10E7] hover:to-[#FF6AF7]"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Creating Vault...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Create Vault
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSignatureVaultNewPage;