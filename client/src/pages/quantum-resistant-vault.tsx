import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  ArrowLeft,
  ArrowRight,
  Shield,
  Check,
  Lock,
  KeyRound,
  FileSymlink,
  AlertTriangle,
  Fingerprint,
  Zap,
  Layers,
  RefreshCw,
  Cpu,
  Database,
  Network,
  ListChecks,
  ServerCrash,
  Key,
  ShieldAlert,
  ShieldCheck,
  Code,
  Wand2
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

type QuantumAlgorithm = "lattice" | "multivariate" | "hash" | "isogeny" | "custom";
type SecurityLevel = "basic" | "enhanced" | "maximum";
type KeySize = 256 | 384 | 512 | 1024 | 2048 | 3072 | 4096;
type KeyRotationSchedule = "monthly" | "quarterly" | "biannual" | "annual" | "custom";
type ChainIntegration = "ethereum" | "ton" | "solana" | "polkadot" | "cosmos" | "cardano" | "bitcoin" | "harmony";

interface FeatureOption {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  standard?: boolean;
}

interface AdvancedOption {
  id: string;
  name: string;
  description: string;
  level: number;
  enabled: boolean;
}

interface SecurityProtocol {
  id: string;
  name: string;
  type: string;
  strength: number;
  enabled: boolean;
}

const QuantumResistantVault: React.FC = () => {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basic");
  const [progress, setProgress] = useState(20);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentProgress, setDeploymentProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [vaultId, setVaultId] = useState("");
  
  // Basic vault details
  const [vaultName, setVaultName] = useState("Quantum-Resistant Vault");
  const [vaultDescription, setVaultDescription] = useState("");
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<QuantumAlgorithm>("lattice");
  const [customAlgorithm, setCustomAlgorithm] = useState("");
  const [securityLevel, setSecurityLevel] = useState<SecurityLevel>("enhanced");
  const [keySize, setKeySize] = useState<KeySize>(3072);
  
  // Blockchain Integration
  const [selectedChains, setSelectedChains] = useState<ChainIntegration[]>(["ethereum", "ton", "solana"]);
  const [primaryChain, setPrimaryChain] = useState<ChainIntegration>("ethereum");
  const [crossChainEnabled, setCrossChainEnabled] = useState(true);
  
  // Key Management
  const [keyRotationSchedule, setKeyRotationSchedule] = useState<KeyRotationSchedule>("quarterly");
  const [customRotationDays, setCustomRotationDays] = useState(90);
  const [multiFactorAuth, setMultiFactorAuth] = useState(true);
  const [multiSignatureThreshold, setMultiSignatureThreshold] = useState(2);
  const [keyRecoveryEnabled, setKeyRecoveryEnabled] = useState(true);
  
  // Post-Quantum Features
  const [features, setFeatures] = useState<FeatureOption[]>([
    {
      id: "lattice-based-cryptography",
      name: "Lattice-Based Cryptography",
      description: "Uses mathematical structures that remain secure against quantum attacks",
      enabled: true,
      standard: true
    },
    {
      id: "hash-based-signatures",
      name: "Hash-Based Signatures",
      description: "Quantum-resistant digital signatures based on secure hash functions",
      enabled: true,
      standard: true
    },
    {
      id: "multivariate-cryptography",
      name: "Multivariate Cryptography",
      description: "Complex systems of multivariate polynomials for encryption",
      enabled: false
    },
    {
      id: "isogeny-based-crypto",
      name: "Isogeny-Based Cryptography",
      description: "Uses relationships between elliptic curves for quantum security",
      enabled: false
    },
    {
      id: "code-based-cryptography",
      name: "Code-Based Cryptography",
      description: "Uses error-correcting codes resistant to quantum computation",
      enabled: true
    },
    {
      id: "homomorphic-encryption",
      name: "Homomorphic Encryption",
      description: "Perform computations on encrypted data without decryption",
      enabled: false
    },
    {
      id: "zero-knowledge-proofs",
      name: "Zero-Knowledge Proofs",
      description: "Prove the validity of claims without revealing underlying data",
      enabled: true
    },
    {
      id: "quantum-key-distribution",
      name: "Quantum Key Distribution Simulation",
      description: "Simulation of quantum communication for key exchange",
      enabled: false
    }
  ]);
  
  // Advanced Security Options
  const [advancedOptions, setAdvancedOptions] = useState<AdvancedOption[]>([
    {
      id: "key-encapsulation",
      name: "Key Encapsulation Mechanism",
      description: "Advanced method for secure key exchange using quantum-resistant algorithms",
      level: 3,
      enabled: true
    },
    {
      id: "hybrid-cryptography",
      name: "Hybrid Cryptographic System",
      description: "Combines traditional and post-quantum cryptography for enhanced security",
      level: 2,
      enabled: true
    },
    {
      id: "ledger-immutability",
      name: "Quantum-Resistant Ledger Immutability",
      description: "Enhanced protections for blockchain integrity against quantum attacks",
      level: 3,
      enabled: true
    },
    {
      id: "entropy-enhancement",
      name: "Entropy Enhancement Protocol",
      description: "Increases randomness quality for cryptographic operations",
      level: 2,
      enabled: false
    },
    {
      id: "adversarial-resistance",
      name: "Adversarial Attack Resistance",
      description: "Mechanisms to detect and mitigate quantum algorithm attacks",
      level: 3,
      enabled: true
    },
    {
      id: "formal-verification",
      name: "Formal Verification",
      description: "Mathematical proof of security protocol correctness",
      level: 3,
      enabled: false
    }
  ]);
  
  // Security protocols
  const [securityProtocols, setSecurityProtocols] = useState<SecurityProtocol[]>([
    {
      id: "ntru",
      name: "NTRU Encryption",
      type: "lattice",
      strength: 90,
      enabled: true
    },
    {
      id: "kyber",
      name: "Kyber Key Encapsulation",
      type: "lattice",
      strength: 95,
      enabled: true
    },
    {
      id: "dilithium",
      name: "Dilithium Digital Signatures",
      type: "lattice",
      strength: 92,
      enabled: true
    },
    {
      id: "sphincs",
      name: "SPHINCS+ Signatures",
      type: "hash",
      strength: 88,
      enabled: false
    },
    {
      id: "mceliece",
      name: "McEliece Cryptosystem",
      type: "code",
      strength: 85,
      enabled: false
    },
    {
      id: "rainbow",
      name: "Rainbow Signature Scheme",
      type: "multivariate",
      strength: 82,
      enabled: false
    },
    {
      id: "sike",
      name: "SIKE Isogeny Key Exchange",
      type: "isogeny",
      strength: 80,
      enabled: false
    },
    {
      id: "falcon",
      name: "FALCON Signatures",
      type: "lattice",
      strength: 93,
      enabled: true
    }
  ]);
  
  // Update progress based on active tab
  React.useEffect(() => {
    switch(activeTab) {
      case "basic":
        setProgress(20);
        break;
      case "blockchain":
        setProgress(40);
        break;
      case "security":
        setProgress(60);
        break;
      case "advanced":
        setProgress(80);
        break;
      case "review":
        setProgress(100);
        break;
    }
  }, [activeTab]);
  
  // Filter protocols based on selected algorithm
  const filteredProtocols = securityProtocols.filter(protocol => {
    if (selectedAlgorithm === "custom") return true;
    return protocol.type === selectedAlgorithm;
  });
  
  // Toggle a feature
  const toggleFeature = (id: string) => {
    setFeatures(features.map(feature => 
      feature.id === id ? { ...feature, enabled: !feature.enabled } : feature
    ));
  };
  
  // Toggle an advanced option
  const toggleAdvancedOption = (id: string) => {
    setAdvancedOptions(advancedOptions.map(option => 
      option.id === id ? { ...option, enabled: !option.enabled } : option
    ));
  };
  
  // Toggle a security protocol
  const toggleProtocol = (id: string) => {
    setSecurityProtocols(securityProtocols.map(protocol => 
      protocol.id === id ? { ...protocol, enabled: !protocol.enabled } : protocol
    ));
  };
  
  // Add or remove a blockchain from selected chains
  const toggleChain = (chain: ChainIntegration) => {
    if (selectedChains.includes(chain)) {
      const newSelectedChains = selectedChains.filter(c => c !== chain);
      setSelectedChains(newSelectedChains);
      
      // If removing the primary chain, set a new one if available
      if (primaryChain === chain && newSelectedChains.length > 0) {
        setPrimaryChain(newSelectedChains[0]);
      }
    } else {
      setSelectedChains([...selectedChains, chain]);
    }
  };
  
  // Get appropriate key sizes based on selected algorithm
  const getKeySizeOptions = (): KeySize[] => {
    switch (selectedAlgorithm) {
      case "lattice":
        return [1024, 2048, 3072, 4096];
      case "hash":
        return [256, 384, 512];
      case "multivariate":
        return [1024, 2048, 3072];
      case "isogeny":
        return [384, 512, 1024];
      case "custom":
        return [256, 384, 512, 1024, 2048, 3072, 4096];
      default:
        return [1024, 2048, 3072, 4096];
    }
  };
  
  // Calculate overall security score
  const calculateSecurityScore = (): number => {
    let score = 0;
    
    // Base score from security level
    if (securityLevel === "basic") score += 20;
    else if (securityLevel === "enhanced") score += 35;
    else if (securityLevel === "maximum") score += 50;
    
    // Score from key size
    score += Math.min(25, Math.floor(keySize / 200));
    
    // Score from enabled features
    const enabledFeatures = features.filter(f => f.enabled).length;
    score += Math.min(10, enabledFeatures * 2);
    
    // Score from advanced options
    const advancedScore = advancedOptions
      .filter(o => o.enabled)
      .reduce((sum, option) => sum + option.level, 0);
    score += Math.min(15, advancedScore * 2);
    
    // Bonus for multi-factor and key rotation
    if (multiFactorAuth) score += 5;
    if (keyRotationSchedule === "monthly") score += 5;
    else if (keyRotationSchedule === "quarterly") score += 3;
    
    return Math.min(100, score);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!vaultName.trim()) {
      toast({
        title: "Vault name required",
        description: "Please provide a name for your quantum-resistant vault",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedAlgorithm === "custom" && !customAlgorithm.trim()) {
      toast({
        title: "Custom algorithm details required",
        description: "Please provide details about your custom quantum-resistant algorithm",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedChains.length === 0) {
      toast({
        title: "Blockchain selection required",
        description: "Please select at least one blockchain for integration",
        variant: "destructive"
      });
      return;
    }
    
    // Start vault deployment process
    setIsDeploying(true);
    setDeploymentProgress(0);
    
    // Simulate deployment process
    const interval = setInterval(() => {
      setDeploymentProgress(prev => {
        const newProgress = prev + Math.floor(Math.random() * 3) + 1;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsDeploying(false);
          setIsSuccess(true);
          
          // Generate a random vault ID
          const id = `qr-${Math.random().toString(36).substring(2, 10)}`;
          setVaultId(id);
          
          toast({
            title: "Quantum-Resistant Vault Created",
            description: "Your post-quantum secure vault is now active",
          });
          
          return 100;
        }
        
        return newProgress;
      });
    }, 150);
  };
  
  // If vault has been successfully created, show success screen
  if (isSuccess) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="border-green-200 dark:border-green-900">
            <CardHeader>
              <div className="mx-auto bg-green-100 dark:bg-green-900 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-center text-2xl">Quantum-Resistant Vault Created!</CardTitle>
              <CardDescription className="text-center">
                Your vault is now secured with post-quantum cryptography
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Vault Name</p>
                    <p className="font-medium">{vaultName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Vault ID</p>
                    <p className="font-medium">{vaultId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Primary Algorithm</p>
                    <p className="font-medium capitalize">
                      {selectedAlgorithm === "custom" 
                        ? customAlgorithm 
                        : `${selectedAlgorithm.charAt(0).toUpperCase() + selectedAlgorithm.slice(1)}-Based`}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Key Size</p>
                    <p className="font-medium">{keySize} bits</p>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Security Rating</h3>
                    <Badge 
                      className={cn(
                        "font-medium",
                        calculateSecurityScore() >= 90 ? "bg-green-500" :
                        calculateSecurityScore() >= 70 ? "bg-blue-500" :
                        "bg-yellow-500"
                      )}
                    >
                      {calculateSecurityScore()}/100
                    </Badge>
                  </div>
                  <Progress value={calculateSecurityScore()} className="h-2 mt-2" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 bg-white/80 dark:bg-black/20 p-2 rounded shadow-sm">
                    <ShieldCheck className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Quantum Attack Resistant</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/80 dark:bg-black/20 p-2 rounded shadow-sm">
                    <RefreshCw className="h-5 w-5 text-blue-500 flex-shrink-0" />
                    <span className="text-sm">{keyRotationSchedule.charAt(0).toUpperCase() + keyRotationSchedule.slice(1)} Key Rotation</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/80 dark:bg-black/20 p-2 rounded shadow-sm">
                    <Key className="h-5 w-5 text-purple-500 flex-shrink-0" />
                    <span className="text-sm">{securityLevel.charAt(0).toUpperCase() + securityLevel.slice(1)} Security</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/80 dark:bg-black/20 p-2 rounded shadow-sm">
                    <Fingerprint className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                    <span className="text-sm">{multiFactorAuth ? "Multi-Factor Authentication" : "Standard Authentication"}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-600 dark:text-gray-400">Active Post-Quantum Protocols:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {securityProtocols.filter(p => p.enabled).map(protocol => (
                      <div key={protocol.id} className="flex items-center gap-2">
                        <div 
                          className={cn(
                            "w-2 h-2 rounded-full",
                            protocol.strength >= 90 ? "bg-green-500" :
                            protocol.strength >= 80 ? "bg-blue-500" :
                            "bg-amber-500"
                          )}
                        ></div>
                        <span>{protocol.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
                <Shield className="h-4 w-4 text-blue-500" />
                <AlertTitle className="text-blue-700 dark:text-blue-400">Future-Proof Security</AlertTitle>
                <AlertDescription className="text-blue-600 dark:text-blue-300">
                  Your vault is protected with post-quantum cryptography algorithms designed to resist attacks from both classical and quantum computers.
                </AlertDescription>
              </Alert>
              
              <div className="flex flex-col gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/vaults')}
                  className="w-full"
                >
                  Go to My Vaults
                </Button>
                <Button 
                  onClick={() => {
                    setIsSuccess(false);
                    setActiveTab("basic");
                    setProgress(20);
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  Create Another Vault
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  // If vault is being deployed, show deployment progress
  if (isDeploying) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Creating Your Quantum-Resistant Vault</CardTitle>
              <CardDescription className="text-center">
                Please wait while we generate post-quantum secure keys and configure your vault
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="w-full max-w-md mb-6">
                <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 ease-in-out"
                    style={{ width: `${deploymentProgress}%` }}
                  ></div>
                </div>
                <p className="text-right text-sm text-gray-500 mt-1">{deploymentProgress}%</p>
              </div>
              
              <div className="space-y-4 w-full max-w-md">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Initializing quantum-resistant vault structure</span>
                </div>
                <div className="flex items-center gap-3">
                  {deploymentProgress >= 20 ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300 border-t-blue-600 animate-spin" />
                  )}
                  <span>Generating {keySize}-bit lattice-based keys</span>
                </div>
                <div className="flex items-center gap-3">
                  {deploymentProgress >= 40 ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300 border-t-blue-600 animate-spin opacity-60" />
                  )}
                  <span className={deploymentProgress < 40 ? "text-gray-400" : ""}>Establishing secure key encapsulation</span>
                </div>
                <div className="flex items-center gap-3">
                  {deploymentProgress >= 60 ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300 border-t-blue-600 animate-spin opacity-40" />
                  )}
                  <span className={deploymentProgress < 60 ? "text-gray-400" : ""}>Configuring multi-blockchain integration</span>
                </div>
                <div className="flex items-center gap-3">
                  {deploymentProgress >= 80 ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300 border-t-blue-600 animate-spin opacity-20" />
                  )}
                  <span className={deploymentProgress < 80 ? "text-gray-400" : ""}>Implementing post-quantum security protocols</span>
                </div>
                <div className="flex items-center gap-3">
                  {deploymentProgress >= 95 ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300 border-t-blue-600 animate-spin opacity-20" />
                  )}
                  <span className={deploymentProgress < 95 ? "text-gray-400" : ""}>Finalizing cross-chain secure access mechanisms</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  // Main form
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Create Quantum-Resistant Vault
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Future-proof security with post-quantum cryptographic protection
              </p>
            </div>
            <Badge className="ml-auto bg-gradient-to-r from-blue-600 to-indigo-600">Advanced</Badge>
          </div>
        </motion.div>

        <div className="mb-8">
          <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 ease-in-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span className={activeTab === "basic" ? "font-medium text-blue-600" : ""}>Basics</span>
            <span className={activeTab === "blockchain" ? "font-medium text-blue-600" : ""}>Blockchain</span>
            <span className={activeTab === "security" ? "font-medium text-blue-600" : ""}>Security</span>
            <span className={activeTab === "advanced" ? "font-medium text-blue-600" : ""}>Advanced</span>
            <span className={activeTab === "review" ? "font-medium text-blue-600" : ""}>Review</span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="basic">Basics</TabsTrigger>
              <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
              <TabsTrigger value="review">Review</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5 text-blue-500" />
                    Basic Configuration
                  </CardTitle>
                  <CardDescription>
                    Set up the fundamental details for your quantum-resistant vault
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="vault-name">Vault Name</Label>
                      <Input 
                        id="vault-name" 
                        value={vaultName} 
                        onChange={(e) => setVaultName(e.target.value)} 
                        placeholder="Enter vault name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="vault-description">Description (Optional)</Label>
                      <Textarea 
                        id="vault-description" 
                        value={vaultDescription} 
                        onChange={(e) => setVaultDescription(e.target.value)} 
                        placeholder="Add details about this vault's purpose"
                        rows={3}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Post-Quantum Algorithm</h3>
                    <RadioGroup 
                      value={selectedAlgorithm} 
                      onValueChange={(value: any) => setSelectedAlgorithm(value)}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                    >
                      <div className="flex items-start space-x-2 border rounded-md p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                        <RadioGroupItem value="lattice" id="lattice" className="mt-1" />
                        <div>
                          <Label htmlFor="lattice" className="font-medium cursor-pointer">Lattice-Based</Label>
                          <p className="text-xs text-gray-500">NIST-approved algorithms like Kyber and Dilithium</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-2 border rounded-md p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                        <RadioGroupItem value="hash" id="hash" className="mt-1" />
                        <div>
                          <Label htmlFor="hash" className="font-medium cursor-pointer">Hash-Based</Label>
                          <p className="text-xs text-gray-500">Stateless hash-based signature schemes like SPHINCS+</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-2 border rounded-md p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                        <RadioGroupItem value="multivariate" id="multivariate" className="mt-1" />
                        <div>
                          <Label htmlFor="multivariate" className="font-medium cursor-pointer">Multivariate-Based</Label>
                          <p className="text-xs text-gray-500">Systems of multivariate polynomials (Rainbow, etc.)</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-2 border rounded-md p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                        <RadioGroupItem value="isogeny" id="isogeny" className="mt-1" />
                        <div>
                          <Label htmlFor="isogeny" className="font-medium cursor-pointer">Isogeny-Based</Label>
                          <p className="text-xs text-gray-500">Supersingular isogeny key exchange (SIKE variants)</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-2 border rounded-md p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 sm:col-span-2">
                        <RadioGroupItem value="custom" id="custom" className="mt-1" />
                        <div className="w-full">
                          <Label htmlFor="custom" className="font-medium cursor-pointer">Custom/Hybrid Approach</Label>
                          <p className="text-xs text-gray-500 mb-2">Define your own algorithm combination</p>
                          
                          {selectedAlgorithm === "custom" && (
                            <Input 
                              value={customAlgorithm} 
                              onChange={(e) => setCustomAlgorithm(e.target.value)} 
                              placeholder="Describe your custom approach"
                              className="mt-2"
                            />
                          )}
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="security-level">Security Level</Label>
                        <Select 
                          value={securityLevel} 
                          onValueChange={(value: any) => setSecurityLevel(value)}
                        >
                          <SelectTrigger id="security-level">
                            <SelectValue placeholder="Select security level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="basic">Basic (128-bit)</SelectItem>
                            <SelectItem value="enhanced">Enhanced (192-bit)</SelectItem>
                            <SelectItem value="maximum">Maximum (256-bit)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="key-size">Key Size</Label>
                        <Select 
                          value={keySize.toString()} 
                          onValueChange={(value: string) => setKeySize(parseInt(value) as KeySize)}
                        >
                          <SelectTrigger id="key-size">
                            <SelectValue placeholder="Select key size" />
                          </SelectTrigger>
                          <SelectContent>
                            {getKeySizeOptions().map(size => (
                              <SelectItem key={size} value={size.toString()}>{size} bits</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <div className="flex items-center gap-2 mb-3">
                        <KeyRound className="h-4 w-4 text-blue-500" />
                        <h4 className="font-medium">Key Rotation Schedule</h4>
                      </div>
                      
                      <RadioGroup 
                        value={keyRotationSchedule} 
                        onValueChange={(value: any) => setKeyRotationSchedule(value)}
                        className="grid grid-cols-2 sm:grid-cols-4 gap-2"
                      >
                        <div className="flex items-center space-x-2 border rounded-md p-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                          <RadioGroupItem value="monthly" id="monthly" />
                          <Label htmlFor="monthly" className="cursor-pointer">Monthly</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2 border rounded-md p-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                          <RadioGroupItem value="quarterly" id="quarterly" />
                          <Label htmlFor="quarterly" className="cursor-pointer">Quarterly</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2 border rounded-md p-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                          <RadioGroupItem value="biannual" id="biannual" />
                          <Label htmlFor="biannual" className="cursor-pointer">Biannual</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2 border rounded-md p-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                          <RadioGroupItem value="annual" id="annual" />
                          <Label htmlFor="annual" className="cursor-pointer">Annual</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2 border rounded-md p-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 sm:col-span-4">
                          <RadioGroupItem value="custom" id="custom-rotation" />
                          <div className="w-full flex items-center">
                            <Label htmlFor="custom-rotation" className="cursor-pointer mr-2">Custom:</Label>
                            {keyRotationSchedule === "custom" && (
                              <div className="flex items-center gap-2 flex-1">
                                <Input 
                                  type="number" 
                                  min={1} 
                                  max={365} 
                                  value={customRotationDays} 
                                  onChange={(e) => setCustomRotationDays(parseInt(e.target.value) || 30)} 
                                  className="w-20"
                                />
                                <span className="text-sm">days</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                  
                  <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
                    <Cpu className="h-4 w-4 text-blue-500" />
                    <AlertTitle className="text-blue-700 dark:text-blue-400">Post-Quantum Protection</AlertTitle>
                    <AlertDescription className="text-blue-600 dark:text-blue-300">
                      Quantum-resistant algorithms are designed to withstand attacks from quantum computers that could break traditional cryptography like RSA and ECC.
                    </AlertDescription>
                  </Alert>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button 
                    onClick={() => setActiveTab("blockchain")}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="blockchain">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Network className="mr-2 h-5 w-5 text-blue-500" />
                    Blockchain Integration
                  </CardTitle>
                  <CardDescription>
                    Configure blockchain networks and cross-chain capabilities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Supported Blockchains</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Select the blockchains where your quantum-resistant vault will operate
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { id: "ethereum", name: "Ethereum", icon: <div className="text-xl">⟠</div> },
                        { id: "ton", name: "TON", icon: <div className="text-xl">💎</div> },
                        { id: "solana", name: "Solana", icon: <div className="text-xl">◎</div> },
                        { id: "polkadot", name: "Polkadot", icon: <div className="text-xl">●</div> },
                        { id: "cosmos", name: "Cosmos", icon: <div className="text-xl">⚛</div> },
                        { id: "cardano", name: "Cardano", icon: <div className="text-xl">₳</div> },
                        { id: "bitcoin", name: "Bitcoin", icon: <div className="text-xl">₿</div> },
                        { id: "harmony", name: "Harmony", icon: <div className="text-xl">𝍏</div> }
                      ].map(chain => (
                        <div
                          key={chain.id}
                          className={cn(
                            "border rounded-md p-3 cursor-pointer transition-all",
                            selectedChains.includes(chain.id as ChainIntegration)
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                              : "hover:bg-slate-50 dark:hover:bg-slate-900"
                          )}
                          onClick={() => toggleChain(chain.id as ChainIntegration)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            {chain.icon}
                            {selectedChains.includes(chain.id as ChainIntegration) && (
                              <Check className="h-4 w-4 text-blue-500" />
                            )}
                          </div>
                          <p className="font-medium text-sm">{chain.name}</p>
                        </div>
                      ))}
                    </div>
                    
                    {selectedChains.length === 0 && (
                      <p className="text-sm text-red-500">Please select at least one blockchain</p>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Cross-Chain Capability</h3>
                        <p className="text-sm text-gray-500">Enable secure asset transfer between chains</p>
                      </div>
                      <Switch 
                        id="cross-chain"
                        checked={crossChainEnabled}
                        onCheckedChange={setCrossChainEnabled}
                        disabled={selectedChains.length < 2}
                      />
                    </div>
                    
                    {crossChainEnabled && selectedChains.length >= 2 && (
                      <div className="space-y-3 p-4 border rounded-md bg-gray-50 dark:bg-gray-900">
                        <div className="space-y-2">
                          <Label htmlFor="primary-chain">Primary Chain</Label>
                          <Select 
                            value={primaryChain} 
                            onValueChange={(value: ChainIntegration) => setPrimaryChain(value)}
                          >
                            <SelectTrigger id="primary-chain">
                              <SelectValue placeholder="Select primary blockchain" />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedChains.map(chain => (
                                <SelectItem key={chain} value={chain}>
                                  {chain.charAt(0).toUpperCase() + chain.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-gray-500">
                            The primary chain will host the main vault contract and security parameters
                          </p>
                        </div>
                        
                        <div className="space-y-2 mt-4">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">Cross-Chain Security Level</Label>
                            <Badge variant="outline" className="font-normal">
                              {securityLevel === "maximum" ? "Maximum" : 
                               securityLevel === "enhanced" ? "Enhanced" : "Basic"}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500">
                            Cross-chain operations will maintain the same security level as your main vault
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {selectedChains.length < 2 && crossChainEnabled && (
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Multiple chains required</AlertTitle>
                        <AlertDescription>
                          Please select at least two blockchains to enable cross-chain capability
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Blockchain-Specific Configuration</h3>
                    {selectedChains.length > 0 ? (
                      <Accordion type="single" collapsible className="w-full">
                        {selectedChains.map(chain => (
                          <AccordionItem key={chain} value={chain}>
                            <AccordionTrigger className="text-base">
                              {chain.charAt(0).toUpperCase() + chain.slice(1)} Configuration
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-4 pt-2">
                                <div className="space-y-2">
                                  <Label>Network Type</Label>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="flex items-center space-x-2 border rounded-md p-2">
                                      <input 
                                        type="radio" 
                                        id={`${chain}-testnet`} 
                                        name={`${chain}-network`}
                                        defaultChecked={true}
                                        className="text-blue-600"
                                      />
                                      <Label htmlFor={`${chain}-testnet`} className="cursor-pointer">Testnet</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 border rounded-md p-2">
                                      <input 
                                        type="radio" 
                                        id={`${chain}-mainnet`} 
                                        name={`${chain}-network`}
                                        className="text-blue-600"
                                      />
                                      <Label htmlFor={`${chain}-mainnet`} className="cursor-pointer">Mainnet</Label>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor={`${chain}-gas-pref`}>Transaction Priority</Label>
                                  <Select defaultValue="standard">
                                    <SelectTrigger id={`${chain}-gas-pref`}>
                                      <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="economy">Economy</SelectItem>
                                      <SelectItem value="standard">Standard</SelectItem>
                                      <SelectItem value="fast">Fast</SelectItem>
                                      <SelectItem value="instant">Instant</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                {chain === primaryChain && (
                                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-900">
                                    Primary Chain
                                  </Badge>
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No blockchains selected</p>
                    )}
                  </div>
                  
                  <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
                    <Database className="h-4 w-4 text-blue-500" />
                    <AlertTitle className="text-blue-700 dark:text-blue-400">Multi-Chain Security</AlertTitle>
                    <AlertDescription className="text-blue-600 dark:text-blue-300">
                      Quantum-resistant protocols ensure that your assets remain secure across all supported blockchains, even against quantum computing threats.
                    </AlertDescription>
                  </Alert>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab("basic")}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("security")}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock className="mr-2 h-5 w-5 text-blue-500" />
                    Security Protocols
                  </CardTitle>
                  <CardDescription>
                    Configure post-quantum security mechanisms and access controls
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Access Control</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Multi-Factor Authentication</h4>
                          <p className="text-sm text-gray-500">Require multiple verification methods for access</p>
                        </div>
                        <Switch 
                          id="multi-factor" 
                          checked={multiFactorAuth}
                          onCheckedChange={setMultiFactorAuth}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Multi-Signature Protocol</h4>
                          <p className="text-sm text-gray-500">Require multiple approvals for high-value transactions</p>
                        </div>
                        <Switch 
                          id="multi-sig" 
                          checked={multiSignatureThreshold > 1}
                          onCheckedChange={(checked) => setMultiSignatureThreshold(checked ? 2 : 1)}
                        />
                      </div>
                      
                      {multiSignatureThreshold > 1 && (
                        <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-900">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="sig-threshold">Required Signatures</Label>
                              <span className="font-medium">{multiSignatureThreshold}</span>
                            </div>
                            <Slider
                              id="sig-threshold"
                              min={2}
                              max={5}
                              step={1}
                              value={[multiSignatureThreshold]}
                              onValueChange={(value) => setMultiSignatureThreshold(value[0])}
                              className="py-2"
                            />
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>2</span>
                              <span>3</span>
                              <span>4</span>
                              <span>5</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Key Recovery Protocol</h4>
                          <p className="text-sm text-gray-500">Enable secure recovery of lost vault access</p>
                        </div>
                        <Switch 
                          id="key-recovery" 
                          checked={keyRecoveryEnabled}
                          onCheckedChange={setKeyRecoveryEnabled}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Quantum-Resistant Protocols</h3>
                      <Badge variant="outline" className="font-normal">
                        {filteredProtocols.filter(p => p.enabled).length} of {filteredProtocols.length} Enabled
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      {filteredProtocols.map(protocol => (
                        <div
                          key={protocol.id}
                          className="flex items-start justify-between p-3 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-900"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{protocol.name}</h4>
                              <HoverCard>
                                <HoverCardTrigger>
                                  <div className="cursor-help p-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                                      <circle cx="12" cy="12" r="10"></circle>
                                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                      <path d="M12 17h.01"></path>
                                    </svg>
                                  </div>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-80">
                                  <div className="space-y-2">
                                    <h5 className="font-medium">{protocol.name}</h5>
                                    <p className="text-sm">
                                      {protocol.id === "ntru" && "NTRU is one of the oldest lattice-based encryption systems, offering strong quantum resistance."}
                                      {protocol.id === "kyber" && "Kyber is a key encapsulation mechanism based on module lattices, chosen by NIST as a post-quantum standard."}
                                      {protocol.id === "dilithium" && "Dilithium is a lattice-based digital signature scheme standardized by NIST."}
                                      {protocol.id === "sphincs" && "SPHINCS+ is a stateless hash-based signature scheme with minimal security assumptions."}
                                      {protocol.id === "mceliece" && "McEliece is one of the oldest post-quantum cryptosystems using error-correcting codes."}
                                      {protocol.id === "rainbow" && "Rainbow is a multivariate polynomial-based signature scheme."}
                                      {protocol.id === "sike" && "SIKE is based on supersingular isogeny key exchange mechanisms."}
                                      {protocol.id === "falcon" && "FALCON is a lattice-based digital signature scheme using NTRU lattices."}
                                    </p>
                                    <div className="pt-2">
                                      <div className="text-xs font-medium">Security Strength</div>
                                      <div className="flex items-center gap-2 mt-1">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                          <div
                                            className={cn(
                                              "h-2 rounded-full",
                                              protocol.strength >= 90 ? "bg-green-500" :
                                              protocol.strength >= 80 ? "bg-blue-500" :
                                              "bg-amber-500"
                                            )}
                                            style={{ width: `${protocol.strength}%` }}
                                          ></div>
                                        </div>
                                        <span className="text-xs">{protocol.strength}%</span>
                                      </div>
                                    </div>
                                  </div>
                                </HoverCardContent>
                              </HoverCard>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs font-normal",
                                  protocol.type === "lattice" ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" :
                                  protocol.type === "hash" ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300" :
                                  protocol.type === "multivariate" ? "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300" :
                                  protocol.type === "isogeny" ? "bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300" :
                                  "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                                )}
                              >
                                {protocol.type.charAt(0).toUpperCase() + protocol.type.slice(1)}-based
                              </Badge>
                              <span className="text-xs text-gray-500">
                                Strength: {protocol.strength}%
                              </span>
                            </div>
                          </div>
                          <Switch 
                            checked={protocol.enabled}
                            onCheckedChange={() => toggleProtocol(protocol.id)}
                          />
                        </div>
                      ))}
                    </div>
                    
                    {filteredProtocols.filter(p => p.enabled).length === 0 && (
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>No protocols enabled</AlertTitle>
                        <AlertDescription>
                          Please enable at least one quantum-resistant protocol to secure your vault
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Post-Quantum Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {features.map(feature => (
                        <div
                          key={feature.id}
                          className={cn(
                            "border rounded-md p-3",
                            feature.standard ? "border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/30" : ""
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium">{feature.name}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                              {feature.standard && (
                                <Badge variant="outline" className="mt-2 text-xs font-normal bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                  Recommended
                                </Badge>
                              )}
                            </div>
                            <Switch 
                              checked={feature.enabled}
                              onCheckedChange={() => toggleFeature(feature.id)}
                              disabled={feature.standard}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
                    <ShieldAlert className="h-4 w-4 text-blue-500" />
                    <AlertTitle className="text-blue-700 dark:text-blue-400">Quantum Computer Resistant</AlertTitle>
                    <AlertDescription className="text-blue-600 dark:text-blue-300">
                      These protocols have been mathematically proven to resist attacks from both current and future quantum computers, ensuring your assets remain secure in the post-quantum era.
                    </AlertDescription>
                  </Alert>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab("blockchain")}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("advanced")}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="advanced">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Cpu className="mr-2 h-5 w-5 text-blue-500" />
                    Advanced Configuration
                  </CardTitle>
                  <CardDescription>
                    Fine-tune advanced quantum-resistant security settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Advanced Security Options</h3>
                    
                    <div className="space-y-3">
                      {advancedOptions.map(option => (
                        <div
                          key={option.id}
                          className="flex items-start justify-between p-3 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-900"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{option.name}</h4>
                              <Badge 
                                variant="outline" 
                                className={cn(
                                  "text-xs font-normal",
                                  option.level === 3 ? "text-red-700 bg-red-50 dark:text-red-300 dark:bg-red-950/30" :
                                  option.level === 2 ? "text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/30" :
                                  "text-green-700 bg-green-50 dark:text-green-300 dark:bg-green-950/30"
                                )}
                              >
                                Level {option.level}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{option.description}</p>
                          </div>
                          <Switch 
                            checked={option.enabled}
                            onCheckedChange={() => toggleAdvancedOption(option.id)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Resource Allocation</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label htmlFor="computation">Computational Resources</Label>
                          <span className="text-sm font-medium">70%</span>
                        </div>
                        <Slider
                          id="computation"
                          min={10}
                          max={90}
                          step={10}
                          defaultValue={[70]}
                          className="py-2"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Higher values improve security but may increase transaction times
                        </p>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label htmlFor="storage">Storage Allocation</Label>
                          <span className="text-sm font-medium">50%</span>
                        </div>
                        <Slider
                          id="storage"
                          min={20}
                          max={80}
                          step={10}
                          defaultValue={[50]}
                          className="py-2"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Higher values support larger keys and more secure state storage
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Expert Settings</h3>
                    
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger className="font-medium">Performance Tuning</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 pt-2">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label htmlFor="operation-mode">Operation Mode</Label>
                                <Select defaultValue="balanced">
                                  <SelectTrigger id="operation-mode" className="w-[180px]">
                                    <SelectValue placeholder="Select mode" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="performance">Performance</SelectItem>
                                    <SelectItem value="balanced">Balanced</SelectItem>
                                    <SelectItem value="security">Maximum Security</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label htmlFor="parallelization">Parallel Processing</Label>
                                <Select defaultValue="auto">
                                  <SelectTrigger id="parallelization" className="w-[180px]">
                                    <SelectValue placeholder="Select threads" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="auto">Auto-detect</SelectItem>
                                    <SelectItem value="1">Single-thread</SelectItem>
                                    <SelectItem value="2">2 threads</SelectItem>
                                    <SelectItem value="4">4 threads</SelectItem>
                                    <SelectItem value="8">8 threads</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-2">
                        <AccordionTrigger className="font-medium">Cryptographic Parameters</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 pt-2">
                            <div>
                              <Label className="mb-2 block">Hash Function</Label>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex items-center space-x-2 border rounded-md p-2">
                                  <input 
                                    type="radio" 
                                    id="sha3-256" 
                                    name="hash-function"
                                    defaultChecked={true}
                                    className="text-blue-600"
                                  />
                                  <Label htmlFor="sha3-256" className="cursor-pointer">SHA3-256</Label>
                                </div>
                                <div className="flex items-center space-x-2 border rounded-md p-2">
                                  <input 
                                    type="radio" 
                                    id="sha3-512" 
                                    name="hash-function"
                                    className="text-blue-600"
                                  />
                                  <Label htmlFor="sha3-512" className="cursor-pointer">SHA3-512</Label>
                                </div>
                                <div className="flex items-center space-x-2 border rounded-md p-2">
                                  <input 
                                    type="radio" 
                                    id="blake2" 
                                    name="hash-function"
                                    className="text-blue-600"
                                  />
                                  <Label htmlFor="blake2" className="cursor-pointer">BLAKE2</Label>
                                </div>
                                <div className="flex items-center space-x-2 border rounded-md p-2">
                                  <input 
                                    type="radio" 
                                    id="custom-hash" 
                                    name="hash-function"
                                    className="text-blue-600"
                                  />
                                  <Label htmlFor="custom-hash" className="cursor-pointer">Custom</Label>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="ring-size">Lattice Parameter q</Label>
                              <Select defaultValue="12289">
                                <SelectTrigger id="ring-size">
                                  <SelectValue placeholder="Select size" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="7681">7681</SelectItem>
                                  <SelectItem value="12289">12289</SelectItem>
                                  <SelectItem value="40961">40961</SelectItem>
                                  <SelectItem value="65537">65537</SelectItem>
                                </SelectContent>
                              </Select>
                              <p className="text-xs text-gray-500">
                                Prime modulus for lattice-based operations
                              </p>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-3">
                        <AccordionTrigger className="font-medium">Custom Code Integration</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 pt-2">
                            <Label htmlFor="custom-code">Custom Security Logic (optional)</Label>
                            <Textarea 
                              id="custom-code" 
                              placeholder="Enter custom cryptographic operations or contract logic..." 
                              className="font-mono text-sm"
                              rows={5}
                            />
                            <p className="text-xs text-gray-500">
                              Advanced users can add custom cryptographic operations in Solidity, Move, or TON FunC
                            </p>
                            <div className="flex items-center pt-2">
                              <input type="checkbox" id="formal-verify" className="mr-2" />
                              <Label htmlFor="formal-verify" className="text-sm">Run formal verification on custom code</Label>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Security Assessment</h3>
                      <Badge 
                        className={cn(
                          "font-medium",
                          calculateSecurityScore() >= 90 ? "bg-green-500" :
                          calculateSecurityScore() >= 70 ? "bg-blue-500" :
                          "bg-yellow-500"
                        )}
                      >
                        {calculateSecurityScore()}/100
                      </Badge>
                    </div>
                    <Progress value={calculateSecurityScore()} className="h-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {calculateSecurityScore() >= 90 
                        ? "Excellent! Your vault has maximum protection against quantum attacks."
                        : calculateSecurityScore() >= 70
                        ? "Good quantum resistance. Consider enabling more security features for maximum protection."
                        : "Basic quantum protection. Enhance security by enabling additional protocols."
                      }
                    </p>
                  </div>
                  
                  <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
                    <Wand2 className="h-4 w-4 text-blue-500" />
                    <AlertTitle className="text-blue-700 dark:text-blue-400">Advanced Security</AlertTitle>
                    <AlertDescription className="text-blue-600 dark:text-blue-300">
                      These expert settings allow you to fine-tune your quantum-resistant vault's security posture and performance characteristics.
                    </AlertDescription>
                  </Alert>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab("security")}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("review")}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="review">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ListChecks className="mr-2 h-5 w-5 text-blue-500" />
                    Review Configuration
                  </CardTitle>
                  <CardDescription>
                    Review your quantum-resistant vault configuration before deployment
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">Basic Information</h3>
                      <div className="space-y-1">
                        <p className="flex justify-between">
                          <span className="text-gray-500">Name:</span>
                          <span className="font-medium">{vaultName || 'Not specified'}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-500">Algorithm:</span>
                          <span className="font-medium capitalize">
                            {selectedAlgorithm === "custom" 
                              ? (customAlgorithm || "Custom Approach") 
                              : `${selectedAlgorithm}-based`}
                          </span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-500">Security Level:</span>
                          <span className="font-medium capitalize">{securityLevel}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-500">Key Size:</span>
                          <span className="font-medium">{keySize} bits</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-500">Key Rotation:</span>
                          <span className="font-medium capitalize">
                            {keyRotationSchedule === "custom" 
                              ? `Every ${customRotationDays} days` 
                              : keyRotationSchedule}
                          </span>
                        </p>
                      </div>
                      
                      {vaultDescription && (
                        <div className="mt-2">
                          <p className="text-gray-500 mb-1">Description:</p>
                          <p className="text-sm border p-2 rounded bg-gray-50 dark:bg-gray-900">
                            {vaultDescription}
                          </p>
                        </div>
                      )}
                      
                      <div className="pt-3">
                        <h3 className="text-lg font-semibold mb-2">Blockchains ({selectedChains.length})</h3>
                        {selectedChains.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {selectedChains.map(chain => (
                              <Badge 
                                key={chain} 
                                variant="outline"
                                className={chain === primaryChain ? "bg-blue-100 dark:bg-blue-900" : ""}
                              >
                                {chain.charAt(0).toUpperCase() + chain.slice(1)}
                                {chain === primaryChain && " (Primary)"}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-red-500">No blockchains selected</p>
                        )}
                        
                        <p className="mt-2 text-sm">
                          <span className="text-gray-500">Cross-Chain:</span>{' '}
                          <span className={!crossChainEnabled ? "text-gray-500" : ""}>
                            {crossChainEnabled ? "Enabled" : "Disabled"}
                          </span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">Security Configuration</h3>
                      <div className="space-y-1">
                        <p className="flex justify-between">
                          <span className="text-gray-500">Multi-Factor Auth:</span>
                          <span className={!multiFactorAuth ? "text-gray-500" : ""}>
                            {multiFactorAuth ? "Enabled" : "Disabled"}
                          </span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-500">Multi-Signature:</span>
                          <span className={multiSignatureThreshold <= 1 ? "text-gray-500" : ""}>
                            {multiSignatureThreshold > 1 ? `${multiSignatureThreshold} signatures required` : "Disabled"}
                          </span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-500">Key Recovery:</span>
                          <span className={!keyRecoveryEnabled ? "text-gray-500" : ""}>
                            {keyRecoveryEnabled ? "Enabled" : "Disabled"}
                          </span>
                        </p>
                      </div>
                      
                      <div className="mt-3">
                        <h4 className="font-medium mb-2">Active Quantum-Resistant Protocols:</h4>
                        <div className="space-y-2">
                          {securityProtocols.filter(p => p.enabled).map(protocol => (
                            <div key={protocol.id} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div 
                                  className={cn(
                                    "w-2 h-2 rounded-full",
                                    protocol.strength >= 90 ? "bg-green-500" :
                                    protocol.strength >= 80 ? "bg-blue-500" :
                                    "bg-amber-500"
                                  )}
                                ></div>
                                <span>{protocol.name}</span>
                              </div>
                              <Badge 
                                variant="outline" 
                                className="text-xs font-normal"
                              >
                                {protocol.strength}%
                              </Badge>
                            </div>
                          ))}
                          
                          {securityProtocols.filter(p => p.enabled).length === 0 && (
                            <p className="text-sm text-red-500">No protocols enabled</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="pt-3">
                        <h4 className="font-medium mb-2">Advanced Security Features:</h4>
                        <div className="space-y-1">
                          {advancedOptions.filter(o => o.enabled).map(option => (
                            <div key={option.id} className="flex items-center">
                              <Check className="h-4 w-4 text-green-500 mr-2" />
                              <span>{option.name}</span>
                            </div>
                          ))}
                          
                          {advancedOptions.filter(o => o.enabled).length === 0 && (
                            <p className="text-sm text-gray-500 italic">No advanced features enabled</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="pt-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Security Rating</h4>
                          <Badge 
                            className={cn(
                              "font-medium",
                              calculateSecurityScore() >= 90 ? "bg-green-500" :
                              calculateSecurityScore() >= 70 ? "bg-blue-500" :
                              "bg-yellow-500"
                            )}
                          >
                            {calculateSecurityScore()}/100
                          </Badge>
                        </div>
                        <Progress value={calculateSecurityScore()} className="h-2 mt-2" />
                      </div>
                    </div>
                  </div>
                  
                  <Alert className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <AlertTitle className="text-amber-700 dark:text-amber-400">Important Information</AlertTitle>
                    <AlertDescription className="text-amber-600 dark:text-amber-300">
                      Quantum-resistant cryptography uses larger keys and more complex algorithms than traditional methods. This may result in slightly higher transaction costs and processing times.
                    </AlertDescription>
                  </Alert>
                  
                  <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
                    <ServerCrash className="h-4 w-4 text-blue-500" />
                    <AlertTitle className="text-blue-700 dark:text-blue-400">Quantum Threat Protection</AlertTitle>
                    <AlertDescription className="text-blue-600 dark:text-blue-300">
                      Your vault will be secured against attacks from both classical and quantum computers, providing future-proof protection for your blockchain assets.
                    </AlertDescription>
                  </Alert>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab("advanced")}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    Create Quantum-Resistant Vault
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </div>
    </div>
  );
};

export default QuantumResistantVault;