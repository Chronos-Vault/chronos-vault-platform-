import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  ArrowLeft, Shield, Fingerprint, Clock, ChevronRight, Wallet, Eye, Minus,
  Plus, CheckCircle, Lock, Key, QrCode, Globe, CheckSquare, AlertTriangle,
  RefreshCw, ShieldCheck, User, Network, EyeOff, Brain, Smartphone, Scan,
  CircleAlert, HelpCircle, Loader2
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
import { Progress } from "@/components/ui/progress";

// Biometric Type Enum
enum BiometricType {
  FINGERPRINT = 0,
  FACIAL = 1,
  IRIS = 2,
  VOICE = 3,
  MULTI_FACTOR = 4,
  BEHAVIORAL = 5
}

// Security Level Enum
enum SecurityLevel {
  STANDARD = 0,
  ENHANCED = 1,
  ADVANCED = 2,
  QUANTUM = 3
}

// SecurityLevelIndicator component
const SecurityLevelIndicator = ({ level }: { level: number }) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1 mb-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div 
            key={i}
            className={`h-1.5 w-6 rounded-full ${i < level ? "bg-gradient-to-r from-[#00D7C3] to-[#3F51FF]" : "bg-gray-700"}`}
          />
        ))}
      </div>
      <span className="text-xs text-gray-400">Security Level: {level}/5</span>
    </div>
  );
};

// Biometric Method Component
interface BiometricMethod {
  id: BiometricType;
  name: string;
  description: string;
  icon: React.ReactNode;
  securityLevel: number;
  scanTime: number;
}

const biometricMethods: BiometricMethod[] = [
  {
    id: BiometricType.FINGERPRINT,
    name: "Fingerprint",
    description: "Traditional fingerprint scanning",
    icon: <Fingerprint className="h-5 w-5 text-[#00D7C3]" />,
    securityLevel: 3,
    scanTime: 3
  },
  {
    id: BiometricType.FACIAL,
    name: "Facial Recognition",
    description: "Advanced 3D facial recognition",
    icon: <Eye className="h-5 w-5 text-[#00D7C3]" />,
    securityLevel: 4,
    scanTime: 4
  },
  {
    id: BiometricType.IRIS,
    name: "Iris Scanning",
    description: "High-security iris pattern verification",
    icon: <Eye className="h-5 w-5 text-[#00D7C3]" />,
    securityLevel: 5,
    scanTime: 5
  },
  {
    id: BiometricType.VOICE,
    name: "Voice Authentication",
    description: "Speech pattern and voice recognition",
    icon: <Smartphone className="h-5 w-5 text-[#00D7C3]" />,
    securityLevel: 3,
    scanTime: 4
  },
  {
    id: BiometricType.MULTI_FACTOR,
    name: "Multi-Factor Biometrics",
    description: "Combines multiple biometric factors",
    icon: <Shield className="h-5 w-5 text-[#00D7C3]" />,
    securityLevel: 5,
    scanTime: 8
  },
  {
    id: BiometricType.BEHAVIORAL,
    name: "Behavioral Biometrics",
    description: "Analyzes unique behavior patterns",
    icon: <Brain className="h-5 w-5 text-[#00D7C3]" />,
    securityLevel: 4,
    scanTime: 6
  }
];

// Encryption options
interface EncryptionOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  securityLevel: number;
}

const encryptionOptions: EncryptionOption[] = [
  {
    id: "standard",
    name: "Standard Encryption",
    description: "Industry-standard encryption protocols",
    icon: <Lock className="h-5 w-5 text-[#00D7C3]" />,
    securityLevel: 3
  },
  {
    id: "advanced",
    name: "Advanced Encryption",
    description: "Enhanced algorithms with higher security",
    icon: <ShieldCheck className="h-5 w-5 text-[#00D7C3]" />,
    securityLevel: 4
  },
  {
    id: "quantum",
    name: "Quantum-Resistant",
    description: "Protection against quantum computing attacks",
    icon: <Shield className="h-5 w-5 text-[#00D7C3]" />,
    securityLevel: 5
  }
];

// Biometric Scan Simulator Component
interface BiometricScannerProps {
  onScanComplete: () => void;
  biometricType: BiometricType;
  isScanning: boolean;
  setIsScanning: (value: boolean) => void;
}

const BiometricScanner: React.FC<BiometricScannerProps> = ({ 
  onScanComplete, 
  biometricType, 
  isScanning,
  setIsScanning
}) => {
  const [progress, setProgress] = useState(0);
  const method = biometricMethods.find(m => m.id === biometricType) || biometricMethods[0];
  const scanDuration = method.scanTime * 1000; // convert to ms
  const incrementAmount = 100 / (scanDuration / 100); // increase every 100ms
  
  useEffect(() => {
    if (!isScanning) {
      setProgress(0);
      return;
    }
    
    let interval: NodeJS.Timeout;
    
    if (progress < 100) {
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + incrementAmount;
          if (newProgress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              onScanComplete();
              setIsScanning(false);
            }, 500);
            return 100;
          }
          return newProgress;
        });
      }, 100);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [progress, isScanning, incrementAmount, onScanComplete, setIsScanning]);
  
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-black/30 rounded-lg border border-[#00D7C3]/30">
      <div className="mb-6">
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-[#00D7C3]/10 flex items-center justify-center">
            {method.icon}
            {isScanning && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full rounded-full border-2 border-[#00D7C3]/50 animate-ping"></div>
              </div>
            )}
          </div>
          
          {isScanning && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full rounded-full border-[3px] border-transparent border-t-[#00D7C3] animate-spin"></div>
            </div>
          )}
        </div>
      </div>
      
      <h3 className="text-lg font-medium mb-2">{method.name} Scan</h3>
      <p className="text-sm text-gray-400 mb-4 text-center">
        {isScanning 
          ? "Scanning in progress. Please remain still." 
          : "Press the Scan button to begin biometric verification."}
      </p>
      
      <div className="w-full mb-4">
        <Progress value={progress} className="h-2 bg-gray-700" indicatorClassName="bg-gradient-to-r from-[#00D7C3] to-[#3F51FF]" />
        {isScanning && <p className="text-xs text-center mt-2 text-gray-400">{Math.round(progress)}% complete</p>}
      </div>
      
      <Button 
        onClick={() => setIsScanning(true)} 
        disabled={isScanning}
        className="bg-gradient-to-r from-[#00D7C3] to-[#3F51FF] hover:from-[#00C0AE] hover:to-[#3646E5]"
      >
        {isScanning 
          ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
          : <Scan className="mr-2 h-4 w-4" />}
        {isScanning ? "Scanning..." : "Start Scan"}
      </Button>
    </div>
  );
};

// Biometric Vault Page Component
const BiometricVaultNewPage: React.FC = () => {
  const { toast } = useToast();
  const [activeStep, setActiveStep] = useState("basics");
  const [steps, setSteps] = useState<Step[]>(getDefaultVaultCreationSteps("details"));
  
  // Vault basics
  const [vaultName, setVaultName] = useState("");
  const [vaultDescription, setVaultDescription] = useState("");
  const [selectedBlockchain, setSelectedBlockchain] = useState<BlockchainType>(BlockchainType.TON);
  const [vaultTags, setVaultTags] = useState<string[]>([]);
  
  // Biometric settings
  const [selectedBiometricType, setSelectedBiometricType] = useState<BiometricType>(BiometricType.FINGERPRINT);
  const [biometricVerified, setBiometricVerified] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [requiredFactors, setRequiredFactors] = useState(1);
  const [additionalBiometricMethods, setAdditionalBiometricMethods] = useState<BiometricType[]>([]);
  const [authorizationAttempts, setAuthorizationAttempts] = useState(3);
  
  // Advanced security options
  const [selectedEncryption, setSelectedEncryption] = useState<string>("standard");
  const [vaultSecurityLevel, setVaultSecurityLevel] = useState(3);
  const [enableBackupKey, setEnableBackupKey] = useState(true);
  const [backupEmail, setBackupEmail] = useState("");
  const [enableQuantumResistance, setEnableQuantumResistance] = useState(false);
  const [enableZeroKnowledge, setEnableZeroKnowledge] = useState(true);
  const [enableBehavioralBiometrics, setEnableBehavioralBiometrics] = useState(false);
  const [enableContinuousAuthentication, setEnableContinuousAuthentication] = useState(false);
  const [geolocationLock, setGeolocationLock] = useState(false);
  
  // Vault access
  const [privateVault, setPrivateVault] = useState(false);
  const [accessLog, setAccessLog] = useState(true);
  const [notifyOnAccess, setNotifyOnAccess] = useState(true);
  const [requireReauthentication, setRequireReauthentication] = useState(true);
  const [reauthenticationInterval, setReauthenticationInterval] = useState(24);
  
  // Creation states
  const [isLoading, setIsLoading] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [vaultId, setVaultId] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  // Update security level based on selected options
  useEffect(() => {
    let securityScore = 2; // Base score
    
    // Add points for various security features
    const biometricMethod = biometricMethods.find(m => m.id === selectedBiometricType);
    if (biometricMethod) {
      securityScore += (biometricMethod.securityLevel - 3) / 2 + 1;
    }
    
    if (additionalBiometricMethods.length > 0) securityScore += 0.5;
    if (additionalBiometricMethods.length > 1) securityScore += 0.5;
    
    if (selectedEncryption !== "standard") {
      const encryption = encryptionOptions.find(e => e.id === selectedEncryption);
      if (encryption) securityScore += (encryption.securityLevel - 3) / 2;
    }
    
    if (enableQuantumResistance) securityScore += 0.5;
    if (enableZeroKnowledge) securityScore += 0.5;
    if (enableBehavioralBiometrics) securityScore += 0.75;
    if (enableContinuousAuthentication) securityScore += 0.5;
    if (geolocationLock) securityScore += 0.25;
    if (requireReauthentication) securityScore += 0.25;
    
    // Cap at 5
    securityScore = Math.min(5, securityScore);
    
    setVaultSecurityLevel(Math.round(securityScore));
  }, [
    selectedBiometricType, additionalBiometricMethods, selectedEncryption,
    enableQuantumResistance, enableZeroKnowledge, enableBehavioralBiometrics,
    enableContinuousAuthentication, geolocationLock, requireReauthentication
  ]);

  // Connect wallet simulation
  const connectWallet = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const simulatedAddress = "EQDrjaLahX...v67Npqw";
      setWalletAddress(simulatedAddress);
      setWalletConnected(true);
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

  // Handle biometric scan completion
  const handleScanComplete = () => {
    setBiometricVerified(true);
    toast({
      title: "Biometric Verification Successful",
      description: "Your biometric signature has been verified and securely encrypted.",
    });
  };

  // Toggle additional biometric method
  const toggleAdditionalBiometric = (biometricType: BiometricType) => {
    setAdditionalBiometricMethods(prev => 
      prev.includes(biometricType) 
        ? prev.filter(type => type !== biometricType)
        : [...prev, biometricType]
    );
  };

  // Generate vault ID
  const generateVaultId = () => {
    return "bio-" + Math.random().toString(36).substring(2, 10);
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
    
    if (activeStep === "biometrics" && !biometricVerified) {
      toast({
        title: "Biometric Verification Required",
        description: "Please complete the biometric scan to continue.",
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
      case "biometrics": return "security";
      case "security": return "security";
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

    if (!biometricVerified) {
      toast({
        title: "Biometric Verification Required",
        description: "Please complete the biometric scan to continue.",
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
        description: `Biometric Vault created with ID: ${newVaultId}`,
      });
      setIsLoading(false);
    }, 2000);
  };

  // Reset form for a new vault
  const createNewVault = () => {
    setActiveStep("wallet");
    setVaultName("");
    setVaultDescription("");
    setSelectedBlockchain(BlockchainType.TON);
    setVaultTags([]);
    setSelectedBiometricType(BiometricType.FINGERPRINT);
    setBiometricVerified(false);
    setIsScanning(false);
    setRequiredFactors(1);
    setAdditionalBiometricMethods([]);
    setAuthorizationAttempts(3);
    setSelectedEncryption("standard");
    setEnableBackupKey(true);
    setBackupEmail("");
    setEnableQuantumResistance(false);
    setEnableZeroKnowledge(true);
    setEnableBehavioralBiometrics(false);
    setEnableContinuousAuthentication(false);
    setGeolocationLock(false);
    setPrivateVault(false);
    setAccessLog(true);
    setNotifyOnAccess(true);
    setRequireReauthentication(true);
    setReauthenticationInterval(24);
    setWalletConnected(false);
    setWalletAddress("");
    setIsCreated(false);
    setVaultId("");
    setSteps(getDefaultVaultCreationSteps("wallet"));
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header Section */}
      <div className="mb-6">
        <Link href="/vault-types">
          <Button variant="ghost" className="mb-4 hover:bg-[#00D7C3]/10">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Vault Types
          </Button>
        </Link>

        <div className="flex flex-col md:flex-row md:items-center mb-4 md:mb-6">
          <div className="flex items-center mb-3 md:mb-0 md:mr-6">
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#00D7C3] to-[#3F51FF] flex items-center justify-center shadow-lg shadow-[#00D7C3]/30 mr-4">
              <Fingerprint className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00D7C3] to-[#3F51FF]">
              Biometric Vault
            </h1>
          </div>

          {!isCreated && (
            <div className="flex items-center ml-0 md:ml-auto">
              <SecurityLevelIndicator level={vaultSecurityLevel} />
            </div>
          )}
        </div>
        
        <p className="text-gray-400 max-w-3xl">
          Advanced vault security with privacy-preserving biometric authentication, offering unparalleled 
          protection for your assets using cutting-edge Zero-Knowledge technology.
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
                <div className="w-24 h-24 bg-gradient-to-br from-[#00D7C3]/20 to-[#3F51FF]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-12 w-12 text-[#00D7C3]" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Vault Created Successfully!</h2>
                <p className="text-gray-300 mb-6">Your Biometric Vault is now active and ready to use</p>
                <div className="bg-[#111] rounded-md p-3 mb-4 flex items-center justify-center">
                  <span className="font-mono text-[#00D7C3] font-medium">{vaultId}</span>
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
                    <CardTitle className="text-lg">Biometric Security</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-400">Primary Biometric Method</p>
                      <p className="font-medium flex items-center">
                        {biometricMethods.find(m => m.id === selectedBiometricType)?.icon}
                        <span className="ml-2">
                          {biometricMethods.find(m => m.id === selectedBiometricType)?.name || "Fingerprint"}
                        </span>
                      </p>
                    </div>
                    
                    {additionalBiometricMethods.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-400">Additional Methods</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {additionalBiometricMethods.map(type => (
                            <div key={type} className="flex items-center bg-[#1A1A1A] px-2 py-1 rounded-md">
                              {biometricMethods.find(m => m.id === type)?.icon}
                              <span className="ml-1 text-xs">
                                {biometricMethods.find(m => m.id === type)?.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <p className="text-sm text-gray-400">Encryption</p>
                      <p className="font-medium">
                        {selectedEncryption === "quantum" ? "Quantum-Resistant" : 
                         selectedEncryption === "advanced" ? "Advanced Encryption" : 
                         "Standard Encryption"}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-400">Advanced Features</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {enableZeroKnowledge && (
                          <span className="text-xs bg-[#00D7C3]/20 text-[#00D7C3] px-2 py-0.5 rounded-full">
                            Zero-Knowledge Proofs
                          </span>
                        )}
                        {enableQuantumResistance && (
                          <span className="text-xs bg-[#3F51FF]/20 text-[#3F51FF] px-2 py-0.5 rounded-full">
                            Quantum Resistance
                          </span>
                        )}
                        {enableBehavioralBiometrics && (
                          <span className="text-xs bg-[#00D7C3]/20 text-[#00D7C3] px-2 py-0.5 rounded-full">
                            Behavioral Analysis
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  variant="outline" 
                  className="flex-1 border-[#00D7C3] text-[#00D7C3] hover:bg-[#00D7C3]/10"
                  onClick={createNewVault}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Another Vault
                </Button>
                <Link href="/my-vaults">
                  <Button 
                    className="flex-1 sm:min-w-[180px] bg-gradient-to-r from-[#00D7C3] to-[#3F51FF] hover:from-[#00C0AE] hover:to-[#3646E5]"
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
                  Connect your blockchain wallet to create and manage your biometric vault
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-6 space-y-4">
                  <div className="h-20 w-20 rounded-full bg-[#00D7C3]/10 flex items-center justify-center mb-2">
                    <Wallet className="h-8 w-8 text-[#00D7C3]" />
                  </div>
                  
                  {walletConnected ? (
                    <div className="text-center">
                      <p className="text-green-400 mb-2">Wallet Connected</p>
                      <p className="font-mono text-sm text-gray-400">{walletAddress}</p>
                    </div>
                  ) : (
                    <div className="text-center max-w-md">
                      <p className="text-gray-400 mb-4">
                        Connect your wallet to create a Biometric Vault with zero-knowledge privacy protection
                      </p>
                    </div>
                  )}
                  
                  <Button 
                    onClick={connectWallet}
                    disabled={isLoading || walletConnected}
                    className="w-full max-w-xs bg-gradient-to-r from-[#00D7C3] to-[#3F51FF] hover:from-[#00C0AE] hover:to-[#3646E5]"
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
                  <div className="bg-[#111] rounded-md p-4 text-sm text-gray-400">
                    <p className="flex items-start">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        In the next steps, you'll set up biometric verification. Your biometric data is processed locally and only a cryptographic proof is stored on-chain, ensuring your privacy.
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={() => goToStep("basics")}
                  disabled={!walletConnected}
                  className="bg-gradient-to-r from-[#00D7C3] to-[#3F51FF] hover:from-[#00C0AE] hover:to-[#3646E5]"
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
                  Set up the basic information for your biometric vault
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="vault-name">Vault Name</Label>
                    <Input 
                      id="vault-name" 
                      placeholder="e.g., My Secure Biometric Vault" 
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
                      {["Personal", "Business", "Identity", "High Security", "Healthcare", "Financial"].map(tag => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setVaultTags(prev => 
                            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                          )}
                          className={`
                            text-xs px-3 py-1.5 rounded-full transition-colors duration-200
                            ${vaultTags.includes(tag) 
                              ? 'bg-[#00D7C3] text-black' 
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
                  onClick={() => goToStep("biometrics")}
                  className="bg-gradient-to-r from-[#00D7C3] to-[#3F51FF] hover:from-[#00C0AE] hover:to-[#3646E5]"
                >
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Step: Biometric Setup */}
          {activeStep === "biometrics" && (
            <Card className="bg-[#1A1A1A] border-[#333]">
              <CardHeader>
                <CardTitle className="text-xl text-white">Biometric Authentication</CardTitle>
                <CardDescription>
                  Set up your biometric security features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-medium mb-3">Biometric Method</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {biometricMethods.slice(0, 6).map(method => (
                        <Card 
                          key={method.id}
                          className={`bg-[#222] cursor-pointer transition-all hover:bg-[#2A2A2A] ${
                            selectedBiometricType === method.id ? 'ring-2 ring-[#00D7C3]' : 'ring-1 ring-[#333]'
                          }`}
                          onClick={() => setSelectedBiometricType(method.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-[#00D7C3]/20 flex items-center justify-center mr-2">
                                  {method.icon}
                                </div>
                                <h4 className="font-medium text-sm">{method.name}</h4>
                              </div>
                              <div className="flex items-center justify-center w-6 h-6 rounded-full border border-gray-600">
                                {selectedBiometricType === method.id && (
                                  <div className="w-3 h-3 rounded-full bg-[#00D7C3]" />
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-gray-400 min-h-[40px]">{method.description}</p>
                            <div className="mt-2">
                              <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <div 
                                    key={i}
                                    className={`h-1 w-3 rounded-full ${i < method.securityLevel ? "bg-gradient-to-r from-[#00D7C3] to-[#3F51FF]" : "bg-gray-700"}`}
                                  />
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-base font-medium mb-4">Biometric Verification</h3>
                    
                    {!biometricVerified ? (
                      <BiometricScanner 
                        onScanComplete={handleScanComplete} 
                        biometricType={selectedBiometricType}
                        isScanning={isScanning}
                        setIsScanning={setIsScanning}
                      />
                    ) : (
                      <div className="bg-[#222] p-6 rounded-lg border border-green-500/20">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mr-4">
                            <CheckCircle className="h-6 w-6 text-green-500" />
                          </div>
                          <div>
                            <h4 className="text-lg font-medium text-white">Biometric Verification Complete</h4>
                            <p className="text-gray-400">Your biometric signature has been securely encrypted</p>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-300 mb-4">
                          Your {biometricMethods.find(m => m.id === selectedBiometricType)?.name.toLowerCase()} data has been processed locally 
                          and only a cryptographic proof is stored. The original biometric data never leaves your device.
                        </p>
                        
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setBiometricVerified(false);
                            setIsScanning(false);
                          }}
                          className="border-[#00D7C3] text-[#00D7C3] hover:bg-[#00D7C3]/10"
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Re-scan Biometrics
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-base font-medium mb-3">Multi-Factor Biometrics (Optional)</h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Add additional biometric factors to enhance security. Each factor adds an extra layer of protection.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {biometricMethods.filter(m => m.id !== selectedBiometricType && m.id !== BiometricType.MULTI_FACTOR).map(method => (
                        <div 
                          key={method.id}
                          className={`
                            flex items-center justify-between p-3 rounded-md cursor-pointer
                            ${additionalBiometricMethods.includes(method.id) 
                              ? 'bg-[#00D7C3]/10 border border-[#00D7C3]/40' 
                              : 'bg-[#222] border border-gray-700 hover:bg-[#333]'}
                          `}
                          onClick={() => toggleAdditionalBiometric(method.id)}
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-[#00D7C3]/10 flex items-center justify-center mr-2">
                              {method.icon}
                            </div>
                            <span>{method.name}</span>
                          </div>
                          {additionalBiometricMethods.includes(method.id) && (
                            <CheckSquare className="h-4 w-4 text-[#00D7C3]" />
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {additionalBiometricMethods.length > 0 && (
                      <div className="mt-4">
                        <Label>Required factors ({requiredFactors} of {additionalBiometricMethods.length + 1})</Label>
                        <div className="mt-2">
                          <Slider
                            value={[requiredFactors]}
                            min={1}
                            max={additionalBiometricMethods.length + 1}
                            step={1}
                            onValueChange={(value) => setRequiredFactors(value[0])}
                            className="mt-2"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-2">
                            <span>Any one factor</span>
                            <span>All factors</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <Label>Authentication Attempts Before Lockout</Label>
                    <Select 
                      value={authorizationAttempts.toString()} 
                      onValueChange={(value) => setAuthorizationAttempts(parseInt(value))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select attempts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 attempt (maximum security)</SelectItem>
                        <SelectItem value="3">3 attempts (recommended)</SelectItem>
                        <SelectItem value="5">5 attempts</SelectItem>
                        <SelectItem value="10">10 attempts</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      After this many failed attempts, vault access will be temporarily locked
                    </p>
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
                  className="bg-gradient-to-r from-[#00D7C3] to-[#3F51FF] hover:from-[#00C0AE] hover:to-[#3646E5]"
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
                    <TabsTrigger value="backup">Backup & Recovery</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced Security</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="encryption" className="space-y-6">
                    <div>
                      <h3 className="text-base font-medium mb-3">Encryption Level</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {encryptionOptions.map(option => (
                          <Card 
                            key={option.id}
                            className={`bg-[#222] cursor-pointer transition-all hover:bg-[#2A2A2A] ${
                              selectedEncryption === option.id ? 'ring-2 ring-[#00D7C3]' : 'ring-1 ring-[#333]'
                            }`}
                            onClick={() => setSelectedEncryption(option.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-full bg-[#00D7C3]/20 flex items-center justify-center mr-2">
                                    {option.icon}
                                  </div>
                                  <h4 className="font-medium text-sm">{option.name}</h4>
                                </div>
                                <div className="flex items-center justify-center w-6 h-6 rounded-full border border-gray-600">
                                  {selectedEncryption === option.id && (
                                    <div className="w-3 h-3 rounded-full bg-[#00D7C3]" />
                                  )}
                                </div>
                              </div>
                              <p className="text-xs text-gray-400 min-h-[40px]">{option.description}</p>
                              <div className="mt-2">
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <div 
                                      key={i}
                                      className={`h-1 w-3 rounded-full ${i < option.securityLevel ? "bg-gradient-to-r from-[#00D7C3] to-[#3F51FF]" : "bg-gray-700"}`}
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
                          <Shield className="h-4 w-4 text-[#00D7C3] mr-2" />
                          <h3 className="font-medium">Zero-Knowledge Proofs</h3>
                        </div>
                        <Switch 
                          checked={enableZeroKnowledge} 
                          onCheckedChange={setEnableZeroKnowledge} 
                        />
                      </div>
                      <p className="text-xs text-gray-400 pl-6">
                        Enhances privacy by enabling verification without revealing biometric data
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Shield className="h-4 w-4 text-[#00D7C3] mr-2" />
                          <h3 className="font-medium">Quantum-Resistant Encryption</h3>
                        </div>
                        <Switch 
                          checked={enableQuantumResistance} 
                          onCheckedChange={setEnableQuantumResistance} 
                        />
                      </div>
                      <p className="text-xs text-gray-400 pl-6">
                        Future-proof your vault against quantum computing attacks
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="backup" className="space-y-6">
                    <Card className="bg-[#222] border-[#333]">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold flex items-center">
                              <Key className="h-4 w-4 mr-2 text-[#00D7C3]" /> Backup Recovery Key
                            </h3>
                            <p className="text-sm text-gray-400 mt-1">
                              Generate a secure backup key in case biometric authentication fails
                            </p>
                          </div>
                          <Switch 
                            checked={enableBackupKey} 
                            onCheckedChange={setEnableBackupKey} 
                          />
                        </div>
                        
                        {enableBackupKey && (
                          <div className="mt-6 space-y-4">
                            <div>
                              <Label>Recovery Email</Label>
                              <Input
                                type="email"
                                placeholder="e.g., your@email.com"
                                value={backupEmail}
                                onChange={(e) => setBackupEmail(e.target.value)}
                                className="mt-2"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Your encrypted backup key will be sent to this email
                              </p>
                            </div>
                            
                            <div className="bg-[#1A1A1A] p-4 rounded-md">
                              <h4 className="text-sm font-medium mb-2">Recovery Process:</h4>
                              <ol className="text-xs text-gray-400 space-y-2 list-decimal list-inside">
                                <li>A recovery key will be securely generated for you</li>
                                <li>The key will be encrypted and sent to your email</li>
                                <li>If biometric access fails, you can use this key to regain access</li>
                                <li>The key requires additional verification steps when used</li>
                              </ol>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="advanced" className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Brain className="h-4 w-4 text-[#00D7C3] mr-2" />
                          <h3 className="font-medium">Behavioral Biometrics</h3>
                        </div>
                        <Switch 
                          checked={enableBehavioralBiometrics} 
                          onCheckedChange={setEnableBehavioralBiometrics} 
                        />
                      </div>
                      <p className="text-xs text-gray-400 pl-6">
                        Analyzes behavior patterns like typing rhythm and gesture dynamics for additional security
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <RefreshCw className="h-4 w-4 text-[#00D7C3] mr-2" />
                          <h3 className="font-medium">Continuous Authentication</h3>
                        </div>
                        <Switch 
                          checked={enableContinuousAuthentication} 
                          onCheckedChange={setEnableContinuousAuthentication} 
                        />
                      </div>
                      <p className="text-xs text-gray-400 pl-6">
                        Periodically verifies user identity during vault access sessions
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Globe className="h-4 w-4 text-[#00D7C3] mr-2" />
                          <h3 className="font-medium">Geolocation Lock</h3>
                        </div>
                        <Switch 
                          checked={geolocationLock} 
                          onCheckedChange={setGeolocationLock} 
                        />
                      </div>
                      <p className="text-xs text-gray-400 pl-6">
                        Restricts vault access to specified geographic locations
                      </p>
                    </div>
                    
                    <div className="mt-6">
                      <Label className="flex items-center">
                        <CircleAlert className="h-4 w-4 text-yellow-500 mr-2" />
                        Authentication Timeout
                      </Label>
                      <div className="flex items-center mt-2">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <Switch 
                              checked={requireReauthentication} 
                              onCheckedChange={setRequireReauthentication} 
                              className="mr-2"
                            />
                            <span>Require re-authentication after inactivity</span>
                          </div>
                        </div>
                        
                        {requireReauthentication && (
                          <div className="flex items-center ml-4">
                            <Select 
                              value={reauthenticationInterval.toString()} 
                              onValueChange={(value) => setReauthenticationInterval(parseInt(value))}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select timeout" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1 hour</SelectItem>
                                <SelectItem value="12">12 hours</SelectItem>
                                <SelectItem value="24">24 hours</SelectItem>
                                <SelectItem value="48">48 hours</SelectItem>
                                <SelectItem value="168">7 days</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Automatically logs out after the specified period of inactivity
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="ghost" 
                  onClick={() => goToStep("biometrics")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button 
                  onClick={() => goToStep("access")}
                  className="bg-gradient-to-r from-[#00D7C3] to-[#3F51FF] hover:from-[#00C0AE] hover:to-[#3646E5]"
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
                <CardTitle className="text-xl text-white">Access Controls</CardTitle>
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
                              <EyeOff className="h-4 w-4 mr-2 text-[#00D7C3]" /> Private Vault
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
                              <Clock className="h-4 w-4 mr-2 text-[#00D7C3]" /> Access Log
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
                              <Bell className="h-4 w-4 mr-2 text-[#00D7C3]" /> Access Notifications
                            </p>
                            <p className="text-sm text-gray-400 mt-1">
                              Notify you when vault is accessed
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
                  
                  <Card className="bg-[#222] border-[#333]">
                    <CardContent className="pt-4">
                      <h3 className="font-medium mb-4">Biometric Authentication Policies</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <Label>Access Expiration</Label>
                          <Select 
                            defaultValue="720"
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Select expiration" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 hour</SelectItem>
                              <SelectItem value="24">24 hours</SelectItem>
                              <SelectItem value="168">7 days</SelectItem>
                              <SelectItem value="720">30 days</SelectItem>
                              <SelectItem value="never">Never (not recommended)</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-gray-400 mt-1">
                            Automatically revokes access after this period, requiring re-authentication
                          </p>
                        </div>
                        
                        <div>
                          <Label>Biometric Data Renewal</Label>
                          <Select 
                            defaultValue="180"
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Select renewal period" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="30">30 days</SelectItem>
                              <SelectItem value="90">90 days</SelectItem>
                              <SelectItem value="180">180 days</SelectItem>
                              <SelectItem value="365">365 days</SelectItem>
                              <SelectItem value="never">Never (not recommended)</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-gray-400 mt-1">
                            Periodically re-scan biometrics to maintain security over time
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="bg-[#1A1A1A] p-4 rounded-lg border border-yellow-600/30">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-yellow-500">Biometric Privacy Notice</h3>
                        <p className="text-sm text-gray-300 mt-1">
                          Your biometric data never leaves your device. We use zero-knowledge proofs to verify your 
                          identity without storing the actual biometric data. Only cryptographic signatures derived 
                          from your biometrics are used for authentication.
                        </p>
                      </div>
                    </div>
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
                  onClick={() => goToStep("review")}
                  className="bg-gradient-to-r from-[#00D7C3] to-[#3F51FF] hover:from-[#00C0AE] hover:to-[#3646E5]"
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
                        <CardTitle className="text-lg">Biometric Security</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-400">Primary Biometric Method</p>
                          <p className="font-medium flex items-center">
                            {biometricMethods.find(m => m.id === selectedBiometricType)?.icon}
                            <span className="ml-2">
                              {biometricMethods.find(m => m.id === selectedBiometricType)?.name || "Fingerprint"}
                            </span>
                          </p>
                        </div>
                        
                        {additionalBiometricMethods.length > 0 && (
                          <div>
                            <p className="text-sm text-gray-400">Additional Methods</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {additionalBiometricMethods.map(type => (
                                <div key={type} className="flex items-center bg-[#1A1A1A] px-2 py-1 rounded-md">
                                  {biometricMethods.find(m => m.id === type)?.icon}
                                  <span className="ml-1 text-xs">
                                    {biometricMethods.find(m => m.id === type)?.name}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div>
                          <p className="text-sm text-gray-400">Encryption</p>
                          <p className="font-medium">
                            {selectedEncryption === "quantum" ? "Quantum-Resistant" : 
                             selectedEncryption === "advanced" ? "Advanced Encryption" : 
                             "Standard Encryption"}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-400">Advanced Features</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {enableZeroKnowledge && (
                              <span className="text-xs bg-[#00D7C3]/20 text-[#00D7C3] px-2 py-0.5 rounded-full">
                                Zero-Knowledge Proofs
                              </span>
                            )}
                            {enableQuantumResistance && (
                              <span className="text-xs bg-[#3F51FF]/20 text-[#3F51FF] px-2 py-0.5 rounded-full">
                                Quantum Resistance
                              </span>
                            )}
                            {enableBehavioralBiometrics && (
                              <span className="text-xs bg-[#00D7C3]/20 text-[#00D7C3] px-2 py-0.5 rounded-full">
                                Behavioral Analysis
                              </span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card className="bg-[#222] border-[#333]">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Biometric Security Features</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2">
                          <div className="h-4 w-4 rounded-full bg-[#00D7C3]"></div>
                          <span>Zero-Knowledge Privacy</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="h-4 w-4 rounded-full bg-[#3F51FF]"></div>
                          <span>Triple-Chain Security</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="h-4 w-4 rounded-full bg-[#00D7C3]"></div>
                          <span>Biometric Authentication</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="h-4 w-4 rounded-full bg-[#3F51FF]"></div>
                          <span>Secure Recovery Options</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="h-4 w-4 rounded-full bg-[#00D7C3]"></div>
                          <span>Decentralized Storage</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="h-4 w-4 rounded-full bg-[#3F51FF]"></div>
                          <span>Tamper-Proof Technology</span>
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
                          You're about to create a Biometric Vault with advanced security features. 
                          Your biometric data is processed locally and only cryptographic proofs are stored on-chain. 
                          Verify all details before continuing.
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
                  className="bg-gradient-to-r from-[#00D7C3] to-[#3F51FF] hover:from-[#00C0AE] hover:to-[#3646E5]"
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

export default BiometricVaultNewPage;