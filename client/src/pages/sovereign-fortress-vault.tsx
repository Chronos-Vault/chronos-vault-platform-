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
import {
  ArrowLeft,
  ArrowRight,
  Crown,
  Shield,
  Check,
  FileSymlink,
  Lock,
  Layers,
  Sparkles,
  Key,
  AlertTriangle,
  Fingerprint,
  Globe,
  Network,
  Brain,
  Diamond,
  Gem,
  ScrollText,
  ChevronDown,
  MessageCircle,
  HardDrive,
  Landmark,
  Timer,
  FlaskConical,
  Download,
  Upload,
  Zap,
  ShieldCheck,
  ShieldAlert,
  Wallet
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

type Chain = "ethereum" | "ton" | "solana" | "bitcoin" | "polygon" | "avalanche" | "polkadot";
type RecoveryMethod = "seedPhrase" | "socialRecovery" | "biometric" | "keyFragments" | "custom";
type SecurityProtocol = "quantumResistant" | "zeroKnowledge" | "multiSig" | "timelockEncryption" | "geolocationLock" | "chainInvariant";
type GovernanceModel = "individual" | "dao" | "multisig" | "keyHolders" | "delegated" | "flexible";
type ChainProtection = "triple" | "double" | "single" | "custom";

interface VaultFeature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  premium?: boolean;
}

interface SecuritySetting {
  id: string;
  name: string;
  description: string;
  level: number;
  enabled: boolean;
}

interface RecoveryConfig {
  method: RecoveryMethod;
  numTrustedContacts?: number;
  timeDelay?: number;
  fragmentThreshold?: number;
  customConfig?: string;
}

const SovereignFortressVault: React.FC = () => {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basic");
  const [progress, setProgress] = useState(20);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentProgress, setDeploymentProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [vaultId, setVaultId] = useState("");
  
  // Basic vault details
  const [vaultName, setVaultName] = useState("Sovereign Fortress Vault™");
  const [vaultDescription, setVaultDescription] = useState("");
  const [securityLevel, setSecurityLevel] = useState<"standard" | "enhanced" | "sovereign">("sovereign");
  const [chainProtection, setChainProtection] = useState<ChainProtection>("triple");
  const [accessControl, setAccessControl] = useState<"standard" | "advanced" | "fortress">("fortress");
  
  // Multi-chain settings
  const [chains, setChains] = useState<Chain[]>(["ethereum", "ton", "solana"]);
  const [primaryChain, setPrimaryChain] = useState<Chain>("ethereum");
  const [crossChainEnabled, setCrossChainEnabled] = useState(true);
  const [assetDistribution, setAssetDistribution] = useState<{[key: string]: number}>({
    ethereum: 40,
    ton: 30,
    solana: 30
  });
  
  // Security protocols
  const [protocols, setProtocols] = useState<SecurityProtocol[]>(["quantumResistant", "zeroKnowledge", "multiSig"]);
  const [customProtocol, setCustomProtocol] = useState("");
  const [governanceModel, setGovernanceModel] = useState<GovernanceModel>("multisig");
  const [multisigThreshold, setMultisigThreshold] = useState(3);
  const [totalSigners, setTotalSigners] = useState(5);
  
  // Advanced recovery
  const [recoveryConfig, setRecoveryConfig] = useState<RecoveryConfig>({
    method: "keyFragments",
    numTrustedContacts: 5,
    timeDelay: 72, // hours
    fragmentThreshold: 3
  });
  
  // Access controls
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [geolocationEnabled, setGeolocationEnabled] = useState(true);
  const [timeBasedEnabled, setTimeBasedEnabled] = useState(true);
  const [behavioralEnabled, setBehavioralEnabled] = useState(true);
  const [aiMonitoringEnabled, setAiMonitoringEnabled] = useState(true);
  
  // Time lock settings
  const [timeLockEnabled, setTimeLockEnabled] = useState(false);
  const [unlockDate, setUnlockDate] = useState<Date | undefined>(undefined);
  const [emergencyAccessEnabled, setEmergencyAccessEnabled] = useState(true);
  const [emergencyTimePeriod, setEmergencyTimePeriod] = useState(48); // hours
  
  // Premium features
  const [features, setFeatures] = useState<VaultFeature[]>([
    {
      id: "quantum-resistant",
      name: "Quantum-Resistant Encryption",
      description: "Future-proof your assets against quantum computing attacks",
      enabled: true,
      premium: true
    },
    {
      id: "cross-chain",
      name: "Triple Chain Protection",
      description: "Distribute assets and encryption across multiple blockchains",
      enabled: true,
      premium: true
    },
    {
      id: "inheritance",
      name: "Dynasty Inheritance Protocol",
      description: "Configurable generational wealth transfer system",
      enabled: true,
      premium: true
    },
    {
      id: "geo-protection",
      name: "Sovereign Geographic Protection",
      description: "Multi-jurisdictional legal protection framework",
      enabled: true,
      premium: true
    },
    {
      id: "fortress-recovery",
      name: "Fortress Recovery System",
      description: "Industry-leading key recovery with multiple security layers",
      enabled: true,
      premium: true
    },
    {
      id: "zkproofs",
      name: "Zero-Knowledge Authentication",
      description: "Prove ownership without revealing sensitive information",
      enabled: true,
      premium: true
    },
    {
      id: "adaptive-security",
      name: "Adaptive Security Intelligence",
      description: "AI-powered security that adapts to emerging threats",
      enabled: true
    },
    {
      id: "fortress-governance",
      name: "Fortress Governance",
      description: "Customizable governance model for vault management",
      enabled: true,
      premium: true
    }
  ]);
  
  // Security settings
  const [securitySettings, setSecuritySettings] = useState<SecuritySetting[]>([
    {
      id: "key-size",
      name: "Encryption Key Size",
      description: "Determines the strength of your encryption",
      level: 4, // 1-5
      enabled: true
    },
    {
      id: "key-rotation",
      name: "Key Rotation Frequency",
      description: "How often encryption keys are automatically rotated",
      level: 3, // 1-5
      enabled: true
    },
    {
      id: "audit-logging",
      name: "Comprehensive Audit Logging",
      description: "Detailed immutable records of all vault activity",
      level: 5, // 1-5
      enabled: true
    },
    {
      id: "intrusion-detection",
      name: "Advanced Intrusion Detection",
      description: "ML-powered system to detect unauthorized access attempts",
      level: 4, // 1-5
      enabled: true
    },
    {
      id: "emergency-lockdown",
      name: "Emergency Lockdown Protocol",
      description: "Automatically locks vault on suspicious activity",
      level: 3, // 1-5
      enabled: true
    },
    {
      id: "privacy-filter",
      name: "Privacy Shield Technology",
      description: "Prevents metadata leakage and transaction tracking",
      level: 5, // 1-5
      enabled: true
    }
  ]);
  
  // Update progress based on active tab
  React.useEffect(() => {
    switch(activeTab) {
      case "basic":
        setProgress(16);
        break;
      case "chains":
        setProgress(32);
        break;
      case "security":
        setProgress(48);
        break;
      case "recovery":
        setProgress(64);
        break;
      case "access":
        setProgress(80);
        break;
      case "review":
        setProgress(100);
        break;
    }
  }, [activeTab]);
  
  // Toggle chain selection
  const toggleChain = (chain: Chain) => {
    if (chains.includes(chain)) {
      // Don't remove if it's the last chain
      if (chains.length <= 1) {
        toast({
          title: "Cannot remove last blockchain",
          description: "At least one blockchain must be selected",
          variant: "destructive"
        });
        return;
      }
      
      // Remove the chain
      const newChains = chains.filter(c => c !== chain);
      setChains(newChains);
      
      // If removing primary chain, set a new one
      if (primaryChain === chain) {
        setPrimaryChain(newChains[0]);
      }
      
      // Redistribute asset allocation
      const totalRemaining = Object.entries(assetDistribution)
        .filter(([c]) => c !== chain && newChains.includes(c as Chain))
        .reduce((acc, [_, value]) => acc + value, 0);
      
      const newDistribution = { ...assetDistribution };
      delete newDistribution[chain];
      
      // Redistribute proportionally
      if (totalRemaining > 0) {
        const scaleFactor = 100 / totalRemaining;
        for (const c of newChains) {
          newDistribution[c] = Math.round(newDistribution[c] * scaleFactor);
        }
        
        // Ensure total is 100%
        const newTotal = Object.values(newDistribution).reduce((acc, val) => acc + val, 0);
        if (newTotal !== 100 && newChains.length > 0) {
          newDistribution[newChains[0]] += (100 - newTotal);
        }
      } else {
        // If all removed, set equal distribution
        const equalShare = Math.floor(100 / newChains.length);
        newChains.forEach(c => {
          newDistribution[c] = equalShare;
        });
        
        // Add remainder to first chain
        if (newChains.length > 0) {
          newDistribution[newChains[0]] += 100 - (equalShare * newChains.length);
        }
      }
      
      setAssetDistribution(newDistribution);
    } else {
      // Add the chain
      const newChains = [...chains, chain];
      setChains(newChains);
      
      // Redistribute asset allocation
      const totalExisting = Object.values(assetDistribution).reduce((acc, val) => acc + val, 0);
      const newShare = 20; // Default new chain gets 20%
      const scaleFactor = (100 - newShare) / totalExisting;
      
      const newDistribution = { ...assetDistribution };
      for (const c of chains) {
        newDistribution[c] = Math.round(newDistribution[c] * scaleFactor);
      }
      newDistribution[chain] = newShare;
      
      // Ensure total is 100%
      const newTotal = Object.values(newDistribution).reduce((acc, val) => acc + val, 0);
      if (newTotal !== 100) {
        newDistribution[primaryChain] += (100 - newTotal);
      }
      
      setAssetDistribution(newDistribution);
    }
  };
  
  // Toggle security protocol
  const toggleProtocol = (protocol: SecurityProtocol) => {
    if (protocols.includes(protocol)) {
      if (protocols.length <= 1) {
        toast({
          title: "Cannot remove all protocols",
          description: "At least one security protocol must be enabled",
          variant: "destructive"
        });
        return;
      }
      setProtocols(protocols.filter(p => p !== protocol));
    } else {
      setProtocols([...protocols, protocol]);
    }
  };
  
  // Toggle feature
  const toggleFeature = (id: string) => {
    setFeatures(features.map(feature => 
      feature.id === id ? { ...feature, enabled: !feature.enabled } : feature
    ));
  };
  
  // Toggle security setting
  const toggleSecuritySetting = (id: string) => {
    setSecuritySettings(securitySettings.map(setting => 
      setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
    ));
  };
  
  // Update security setting level
  const updateSecurityLevel = (id: string, level: number) => {
    setSecuritySettings(securitySettings.map(setting => 
      setting.id === id ? { ...setting, level } : setting
    ));
  };
  
  // Update asset distribution
  const updateAssetDistribution = (chain: Chain, value: number) => {
    const currentValue = assetDistribution[chain] || 0;
    const difference = value - currentValue;
    
    // If increasing one chain, decrease others proportionally
    const newDistribution = { ...assetDistribution, [chain]: value };
    
    if (difference > 0) {
      const otherChains = chains.filter(c => c !== chain);
      const totalOther = otherChains.reduce((acc, c) => acc + (assetDistribution[c] || 0), 0);
      
      if (totalOther > 0) {
        // Reduce other chains proportionally
        for (const c of otherChains) {
          const currentShare = assetDistribution[c] || 0;
          const reductionFactor = (totalOther - difference) / totalOther;
          newDistribution[c] = Math.max(0, Math.round(currentShare * reductionFactor));
        }
      }
    } else if (difference < 0) {
      // If decreasing one chain, increase others proportionally
      const otherChains = chains.filter(c => c !== chain);
      const totalOther = otherChains.reduce((acc, c) => acc + (assetDistribution[c] || 0), 0);
      
      if (totalOther > 0) {
        // Increase other chains proportionally
        const increaseFactor = (totalOther - difference) / totalOther;
        for (const c of otherChains) {
          const currentShare = assetDistribution[c] || 0;
          newDistribution[c] = Math.round(currentShare * increaseFactor);
        }
      }
    }
    
    // Ensure total is 100%
    const total = Object.values(newDistribution).reduce((acc, val) => acc + val, 0);
    if (total !== 100) {
      // Add/subtract the remainder from the primary chain if not the current one being adjusted
      if (primaryChain !== chain) {
        newDistribution[primaryChain] += (100 - total);
      } else {
        // Find another chain to adjust
        const adjustChain = chains.find(c => c !== chain) || chains[0];
        if (adjustChain) {
          newDistribution[adjustChain] += (100 - total);
        }
      }
    }
    
    setAssetDistribution(newDistribution);
  };
  
  // Calculate overall security score
  const calculateSecurityScore = (): number => {
    let score = 0;
    
    // Base score from security level
    if (securityLevel === "standard") score += 15;
    else if (securityLevel === "enhanced") score += 25;
    else if (securityLevel === "sovereign") score += 40;
    
    // Score from chain protection
    if (chainProtection === "single") score += 5;
    else if (chainProtection === "double") score += 10;
    else if (chainProtection === "triple") score += 15;
    
    // Score from number of chains
    score += Math.min(10, chains.length * 3);
    
    // Score from security protocols
    score += Math.min(15, protocols.length * 3);
    
    // Score from security settings
    const settingsScore = securitySettings
      .filter(s => s.enabled)
      .reduce((acc, setting) => acc + setting.level, 0);
    score += Math.min(15, settingsScore * 0.5);
    
    // Score from features
    score += Math.min(10, features.filter(f => f.enabled).length);
    
    // Score from access controls
    if (biometricEnabled) score += 2;
    if (geolocationEnabled) score += 2;
    if (timeBasedEnabled) score += 2;
    if (behavioralEnabled) score += 2;
    if (aiMonitoringEnabled) score += 2;
    
    return Math.min(100, score);
  };
  
  // Get protocol icon
  const getProtocolIcon = (protocol: SecurityProtocol) => {
    switch(protocol) {
      case "quantumResistant": return <Shield className="h-5 w-5 text-purple-500" />;
      case "zeroKnowledge": return <Sparkles className="h-5 w-5 text-indigo-500" />;
      case "multiSig": return <Key className="h-5 w-5 text-blue-500" />;
      case "timelockEncryption": return <Timer className="h-5 w-5 text-green-500" />;
      case "geolocationLock": return <Globe className="h-5 w-5 text-amber-500" />;
      case "chainInvariant": return <Network className="h-5 w-5 text-pink-500" />;
    }
  };
  
  // Get protocol name
  const getProtocolName = (protocol: SecurityProtocol): string => {
    switch(protocol) {
      case "quantumResistant": return "Quantum-Resistant Encryption";
      case "zeroKnowledge": return "Zero-Knowledge Proofs";
      case "multiSig": return "Multi-Signature Protocol";
      case "timelockEncryption": return "Timelock Encryption";
      case "geolocationLock": return "Geolocation Verification";
      case "chainInvariant": return "Chain Invariant Security";
    }
  };
  
  // Get chain icon
  const getChainIcon = (chain: Chain) => {
    switch(chain) {
      case "ethereum": return <div className="text-xl">⟠</div>;
      case "ton": return <div className="text-xl">💎</div>;
      case "solana": return <div className="text-xl">◎</div>;
      case "bitcoin": return <div className="text-xl">₿</div>;
      case "polygon": return <div className="text-xl">⬡</div>;
      case "avalanche": return <div className="text-xl">🔺</div>;
      case "polkadot": return <div className="text-xl">●</div>;
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!vaultName.trim()) {
      toast({
        title: "Vault name required",
        description: "Please provide a name for your vault",
        variant: "destructive"
      });
      return;
    }
    
    if (chains.length === 0) {
      toast({
        title: "Blockchain selection required",
        description: "Please select at least one blockchain for your vault",
        variant: "destructive"
      });
      return;
    }
    
    if (protocols.length === 0) {
      toast({
        title: "Security protocol required",
        description: "Please enable at least one security protocol",
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
        const newProgress = prev + Math.floor(Math.random() * 5) + 1;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsDeploying(false);
          setIsSuccess(true);
          
          // Generate a random vault ID
          const id = `sov-${Math.random().toString(36).substring(2, 10)}`;
          setVaultId(id);
          
          toast({
            title: "Vault Created Successfully",
            description: "Your Sovereign Fortress Vault™ has been deployed",
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
              <CardTitle className="text-center text-2xl">Sovereign Fortress Vault™ Created!</CardTitle>
              <CardDescription className="text-center">
                Your ultra-secure, multi-chain vault is now active
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
                    <p className="text-sm text-gray-500">Security Level</p>
                    <p className="font-medium capitalize">{securityLevel}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Chain Protection</p>
                    <p className="font-medium capitalize">{chainProtection}</p>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
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
                    <Shield className="h-5 w-5 text-purple-500 flex-shrink-0" />
                    <span className="text-sm">Fortress-Level Security</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/80 dark:bg-black/20 p-2 rounded shadow-sm">
                    <Network className="h-5 w-5 text-blue-500 flex-shrink-0" />
                    <span className="text-sm">{chains.length} Blockchain{chains.length !== 1 ? "s" : ""}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/80 dark:bg-black/20 p-2 rounded shadow-sm">
                    <Key className="h-5 w-5 text-pink-500 flex-shrink-0" />
                    <span className="text-sm">{multisigThreshold}-of-{totalSigners} Signatures</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/80 dark:bg-black/20 p-2 rounded shadow-sm">
                    <Fingerprint className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                    <span className="text-sm">Quantum-Resistant Keys</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-600 dark:text-gray-400">Chain Distribution:</h4>
                  <div className="space-y-2">
                    {chains.map(chain => (
                      <div key={chain} className="flex items-center gap-3">
                        <div className="w-8">{getChainIcon(chain)}</div>
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full",
                              chain === "ethereum" ? "bg-blue-500" :
                              chain === "ton" ? "bg-purple-500" :
                              chain === "solana" ? "bg-green-500" :
                              chain === "bitcoin" ? "bg-orange-500" :
                              chain === "polygon" ? "bg-indigo-500" :
                              chain === "avalanche" ? "bg-red-500" :
                              "bg-pink-500"
                            )}
                            style={{ width: `${assetDistribution[chain] || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-10 text-right">{assetDistribution[chain] || 0}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <Alert className="bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900">
                <Crown className="h-4 w-4 text-purple-500" />
                <AlertTitle className="text-purple-700 dark:text-purple-400">Sovereign Protection Active</AlertTitle>
                <AlertDescription className="text-purple-600 dark:text-purple-300">
                  Your assets are now protected with the most advanced security system in the blockchain industry, distributed across {chains.length} chain{chains.length !== 1 ? "s" : ""} with {protocols.length} security protocol{protocols.length !== 1 ? "s" : ""}.
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
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
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
              <CardTitle className="text-center">Creating Your Sovereign Fortress Vault™</CardTitle>
              <CardDescription className="text-center">
                Please wait while we establish your multi-chain sovereign protection
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="w-full max-w-md mb-6">
                <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 ease-in-out"
                    style={{ width: `${deploymentProgress}%` }}
                  ></div>
                </div>
                <p className="text-right text-sm text-gray-500 mt-1">{deploymentProgress}%</p>
              </div>
              
              <div className="space-y-4 w-full max-w-md">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Initializing sovereign vault foundation</span>
                </div>
                <div className="flex items-center gap-3">
                  {deploymentProgress >= 20 ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300 border-t-purple-600 animate-spin" />
                  )}
                  <span>Establishing quantum-resistant key generation</span>
                </div>
                <div className="flex items-center gap-3">
                  {deploymentProgress >= 40 ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300 border-t-purple-600 animate-spin opacity-60" />
                  )}
                  <span className={deploymentProgress < 40 ? "text-gray-400" : ""}>Deploying multi-chain asset distribution</span>
                </div>
                <div className="flex items-center gap-3">
                  {deploymentProgress >= 60 ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300 border-t-purple-600 animate-spin opacity-40" />
                  )}
                  <span className={deploymentProgress < 60 ? "text-gray-400" : ""}>Configuring multi-signature governance</span>
                </div>
                <div className="flex items-center gap-3">
                  {deploymentProgress >= 80 ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300 border-t-purple-600 animate-spin opacity-20" />
                  )}
                  <span className={deploymentProgress < 80 ? "text-gray-400" : ""}>Setting up fortress-level access controls</span>
                </div>
                <div className="flex items-center gap-3">
                  {deploymentProgress >= 95 ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300 border-t-purple-600 animate-spin opacity-20" />
                  )}
                  <span className={deploymentProgress < 95 ? "text-gray-400" : ""}>Finalizing sovereign protection system</span>
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
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                Create Sovereign Fortress Vault™
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Ultimate all-in-one vault with supreme security & flexibility
              </p>
            </div>
            <Badge className="ml-auto bg-gradient-to-r from-purple-600 to-pink-600">Premium</Badge>
          </div>
        </motion.div>

        <div className="mb-8">
          <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 ease-in-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span className={activeTab === "basic" ? "font-medium text-purple-600" : ""}>Basics</span>
            <span className={activeTab === "chains" ? "font-medium text-purple-600" : ""}>Chains</span>
            <span className={activeTab === "security" ? "font-medium text-purple-600" : ""}>Security</span>
            <span className={activeTab === "recovery" ? "font-medium text-purple-600" : ""}>Recovery</span>
            <span className={activeTab === "access" ? "font-medium text-purple-600" : ""}>Access</span>
            <span className={activeTab === "review" ? "font-medium text-purple-600" : ""}>Review</span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-6 mb-6">
              <TabsTrigger value="basic">Basics</TabsTrigger>
              <TabsTrigger value="chains">Chains</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="recovery">Recovery</TabsTrigger>
              <TabsTrigger value="access">Access</TabsTrigger>
              <TabsTrigger value="review">Review</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Crown className="mr-2 h-5 w-5 text-purple-500" />
                    Basic Configuration
                  </CardTitle>
                  <CardDescription>
                    Set up the fundamental details for your Sovereign Fortress Vault™
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
                    <h3 className="text-lg font-medium">Protection Level</h3>
                    <RadioGroup 
                      value={securityLevel} 
                      onValueChange={(value: any) => setSecurityLevel(value)}
                      className="space-y-3"
                    >
                      <div className="flex items-start space-x-3 border rounded-md p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                        <RadioGroupItem value="standard" id="standard" className="mt-1" />
                        <div>
                          <Label htmlFor="standard" className="font-medium cursor-pointer">Standard Protection</Label>
                          <p className="text-xs text-gray-500">Basic security with single-chain protection</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3 border rounded-md p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                        <RadioGroupItem value="enhanced" id="enhanced" className="mt-1" />
                        <div>
                          <Label htmlFor="enhanced" className="font-medium cursor-pointer">Enhanced Protection</Label>
                          <p className="text-xs text-gray-500">Advanced security with dual-chain asset distribution</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3 border rounded-md p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200 dark:border-purple-800">
                        <RadioGroupItem value="sovereign" id="sovereign" className="mt-1" />
                        <div>
                          <Label htmlFor="sovereign" className="font-medium cursor-pointer">Sovereign Fortress Protection</Label>
                          <p className="text-xs text-gray-500">Maximum security with triple-chain encryption and asset protection</p>
                          <Badge className="mt-2 bg-gradient-to-r from-purple-600 to-pink-600">Premium</Badge>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Chain Protection</h3>
                    <RadioGroup 
                      value={chainProtection} 
                      onValueChange={(value: any) => setChainProtection(value)}
                      className="space-y-3"
                    >
                      <div className="flex items-start space-x-3 border rounded-md p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                        <RadioGroupItem value="single" id="single" className="mt-1" />
                        <div>
                          <Label htmlFor="single" className="font-medium cursor-pointer">Single Chain</Label>
                          <p className="text-xs text-gray-500">Assets and security managed on a single blockchain</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3 border rounded-md p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                        <RadioGroupItem value="double" id="double" className="mt-1" />
                        <div>
                          <Label htmlFor="double" className="font-medium cursor-pointer">Double Chain</Label>
                          <p className="text-xs text-gray-500">Assets and security distributed across two blockchains</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3 border rounded-md p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200 dark:border-purple-800">
                        <RadioGroupItem value="triple" id="triple" className="mt-1" />
                        <div>
                          <Label htmlFor="triple" className="font-medium cursor-pointer">Triple Chain</Label>
                          <p className="text-xs text-gray-500">Maximum security with assets distributed across three+ blockchains</p>
                          <Badge className="mt-2 bg-gradient-to-r from-purple-600 to-pink-600">Premium</Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3 border rounded-md p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                        <RadioGroupItem value="custom" id="custom-chain" className="mt-1" />
                        <div>
                          <Label htmlFor="custom-chain" className="font-medium cursor-pointer">Custom Configuration</Label>
                          <p className="text-xs text-gray-500">Manually configure chain distribution and security settings</p>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Access Control Level</h3>
                    <RadioGroup 
                      value={accessControl} 
                      onValueChange={(value: any) => setAccessControl(value)}
                      className="space-y-3"
                    >
                      <div className="flex items-start space-x-3 border rounded-md p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                        <RadioGroupItem value="standard" id="standard-access" className="mt-1" />
                        <div>
                          <Label htmlFor="standard-access" className="font-medium cursor-pointer">Standard Access</Label>
                          <p className="text-xs text-gray-500">Basic password and two-factor authentication</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3 border rounded-md p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                        <RadioGroupItem value="advanced" id="advanced-access" className="mt-1" />
                        <div>
                          <Label htmlFor="advanced-access" className="font-medium cursor-pointer">Advanced Access</Label>
                          <p className="text-xs text-gray-500">Multi-signature protection with time-delay security</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3 border rounded-md p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200 dark:border-purple-800">
                        <RadioGroupItem value="fortress" id="fortress-access" className="mt-1" />
                        <div>
                          <Label htmlFor="fortress-access" className="font-medium cursor-pointer">Fortress Access</Label>
                          <p className="text-xs text-gray-500">Comprehensive multi-factor authentication with AI security monitoring</p>
                          <Badge className="mt-2 bg-gradient-to-r from-purple-600 to-pink-600">Premium</Badge>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <Alert className="bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900">
                    <Crown className="h-4 w-4 text-purple-500" />
                    <AlertTitle className="text-purple-700 dark:text-purple-400">Sovereign Fortress Protection</AlertTitle>
                    <AlertDescription className="text-purple-600 dark:text-purple-300">
                      The Sovereign Fortress Vault™ combines the most advanced security features available in blockchain technology, providing unparalleled protection for your digital assets.
                    </AlertDescription>
                  </Alert>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button 
                    onClick={() => setActiveTab("chains")}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="chains">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Network className="mr-2 h-5 w-5 text-purple-500" />
                    Multi-Chain Distribution
                  </CardTitle>
                  <CardDescription>
                    Configure how your assets and security are distributed across blockchains
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Blockchain Selection</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Select the blockchains where your vault will operate
                    </p>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      {[
                        { id: "ethereum", name: "Ethereum", icon: <div className="text-xl">⟠</div> },
                        { id: "ton", name: "TON", icon: <div className="text-xl">💎</div> },
                        { id: "solana", name: "Solana", icon: <div className="text-xl">◎</div> },
                        { id: "bitcoin", name: "Bitcoin", icon: <div className="text-xl">₿</div> },
                        { id: "polygon", name: "Polygon", icon: <div className="text-xl">⬡</div> },
                        { id: "avalanche", name: "Avalanche", icon: <div className="text-xl">🔺</div> },
                        { id: "polkadot", name: "Polkadot", icon: <div className="text-xl">●</div> }
                      ].map(chain => (
                        <div
                          key={chain.id}
                          className={cn(
                            "border rounded-md p-3 cursor-pointer transition-all",
                            chains.includes(chain.id as Chain)
                              ? "border-purple-500 bg-purple-50 dark:bg-purple-950/30"
                              : "hover:bg-slate-50 dark:hover:bg-slate-900"
                          )}
                          onClick={() => toggleChain(chain.id as Chain)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            {chain.icon}
                            {chains.includes(chain.id as Chain) && (
                              <Check className="h-4 w-4 text-purple-500" />
                            )}
                          </div>
                          <p className="font-medium text-sm">{chain.name}</p>
                        </div>
                      ))}
                    </div>
                    
                    {chains.length === 0 && (
                      <div className="text-red-500 text-sm mt-2">
                        Please select at least one blockchain
                      </div>
                    )}
                    
                    {/* Chain protection warning */}
                    {chainProtection === "triple" && chains.length < 3 && (
                      <Alert variant="warning">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Triple Chain Protection</AlertTitle>
                        <AlertDescription>
                          You've selected Triple Chain Protection but have only selected {chains.length} blockchain{chains.length !== 1 ? "s" : ""}. 
                          Please select at least 3 blockchains for optimal security.
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {chainProtection === "double" && chains.length < 2 && (
                      <Alert variant="warning">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Double Chain Protection</AlertTitle>
                        <AlertDescription>
                          You've selected Double Chain Protection but have only selected 1 blockchain. 
                          Please select at least 2 blockchains.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                  
                  <Separator />
                  
                  {chains.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Primary Chain</h3>
                        <Badge variant="outline" className="font-medium">
                          Main Security Chain
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Select the blockchain that will serve as the primary security layer
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {chains.map(chain => (
                          <div
                            key={`primary-${chain}`}
                            className={cn(
                              "border rounded-md p-3 cursor-pointer transition-all",
                              primaryChain === chain
                                ? "border-purple-500 bg-purple-50 dark:bg-purple-950/30"
                                : "hover:bg-slate-50 dark:hover:bg-slate-900"
                            )}
                            onClick={() => setPrimaryChain(chain)}
                          >
                            <div className="flex items-center justify-between mb-2">
                              {getChainIcon(chain)}
                              {primaryChain === chain && (
                                <Crown className="h-4 w-4 text-purple-500" />
                              )}
                            </div>
                            <p className="font-medium text-sm capitalize">{chain}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <Separator />
                  
                  {chains.length > 1 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium">Cross-Chain Integration</h3>
                          <p className="text-sm text-gray-500">Enable seamless asset movement between chains</p>
                        </div>
                        <Switch 
                          checked={crossChainEnabled}
                          onCheckedChange={setCrossChainEnabled}
                        />
                      </div>
                      
                      {crossChainEnabled && (
                        <Alert className="bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900">
                          <Shield className="h-4 w-4 text-purple-500" />
                          <AlertTitle className="text-purple-700 dark:text-purple-400">Cross-Chain Security</AlertTitle>
                          <AlertDescription className="text-purple-600 dark:text-purple-300">
                            Cross-chain integration requires additional security measures that will be automatically configured for optimal protection.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  )}
                  
                  <Separator />
                  
                  {chains.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Asset Distribution</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Configure how your assets will be distributed across chains
                      </p>
                      
                      <div className="space-y-4">
                        {chains.map(chain => (
                          <div key={`dist-${chain}`} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="flex items-center gap-2">
                                {getChainIcon(chain)}
                                <span className="capitalize">{chain}</span>
                              </Label>
                              <span className="text-sm font-medium">{assetDistribution[chain] || 0}%</span>
                            </div>
                            <Slider
                              min={0}
                              max={100}
                              step={5}
                              value={[assetDistribution[chain] || 0]}
                              onValueChange={(value) => updateAssetDistribution(chain, value[0])}
                            />
                          </div>
                        ))}
                      </div>
                      
                      <p className="text-xs text-gray-500 italic">
                        Note: Adjusting one chain's percentage will automatically balance others to maintain a total of 100%
                      </p>
                    </div>
                  )}
                  
                  <Alert className="bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900">
                    <Sparkles className="h-4 w-4 text-indigo-500" />
                    <AlertTitle className="text-indigo-700 dark:text-indigo-400">Fortress-Level Security</AlertTitle>
                    <AlertDescription className="text-indigo-600 dark:text-indigo-300">
                      Distributing assets across multiple blockchains provides exceptional protection against chain-specific risks and vulnerabilities.
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
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
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
                    <ShieldCheck className="mr-2 h-5 w-5 text-purple-500" />
                    Security Protocols
                  </CardTitle>
                  <CardDescription>
                    Configure advanced security protocols for your vault
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Security Protocols</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Select the security protocols that will protect your assets
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        "quantumResistant", 
                        "zeroKnowledge", 
                        "multiSig", 
                        "timelockEncryption", 
                        "geolocationLock", 
                        "chainInvariant"
                      ].map((protocol) => (
                        <div
                          key={protocol}
                          className={cn(
                            "border rounded-md p-3 cursor-pointer transition-all",
                            protocols.includes(protocol as SecurityProtocol)
                              ? "border-purple-500 bg-purple-50 dark:bg-purple-950/30"
                              : "hover:bg-slate-50 dark:hover:bg-slate-900"
                          )}
                          onClick={() => toggleProtocol(protocol as SecurityProtocol)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5">
                              {getProtocolIcon(protocol as SecurityProtocol)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="font-medium">{getProtocolName(protocol as SecurityProtocol)}</p>
                                {protocols.includes(protocol as SecurityProtocol) && (
                                  <Check className="h-4 w-4 text-purple-500" />
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {protocol === "quantumResistant" && "Future-proof encryption resistant to quantum computers"}
                                {protocol === "zeroKnowledge" && "Prove ownership without revealing sensitive information"}
                                {protocol === "multiSig" && "Require multiple signatures for high-value transactions"}
                                {protocol === "timelockEncryption" && "Time-based encryption that unlocks after set periods"}
                                {protocol === "geolocationLock" && "Enhance security with location-based verification"}
                                {protocol === "chainInvariant" && "Cross-chain consistency validation for asset integrity"}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {protocols.length === 0 && (
                      <div className="text-red-500 text-sm mt-2">
                        Please select at least one security protocol
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Governance Model</h3>
                    
                    <RadioGroup 
                      value={governanceModel} 
                      onValueChange={(value: any) => setGovernanceModel(value)}
                      className="grid grid-cols-1 md:grid-cols-2 gap-3"
                    >
                      <div className="flex items-start space-x-3 border rounded-md p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                        <RadioGroupItem value="individual" id="individual" className="mt-1" />
                        <div>
                          <Label htmlFor="individual" className="font-medium cursor-pointer">Individual Control</Label>
                          <p className="text-xs text-gray-500">You maintain full control over your vault</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3 border rounded-md p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                        <RadioGroupItem value="multisig" id="multisig" className="mt-1" />
                        <div>
                          <Label htmlFor="multisig" className="font-medium cursor-pointer">Multi-Signature</Label>
                          <p className="text-xs text-gray-500">Require multiple approvals for transactions</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3 border rounded-md p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                        <RadioGroupItem value="dao" id="dao" className="mt-1" />
                        <div>
                          <Label htmlFor="dao" className="font-medium cursor-pointer">DAO Governance</Label>
                          <p className="text-xs text-gray-500">Decentralized autonomous organization controls</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3 border rounded-md p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                        <RadioGroupItem value="keyHolders" id="keyHolders" className="mt-1" />
                        <div>
                          <Label htmlFor="keyHolders" className="font-medium cursor-pointer">Key Holders</Label>
                          <p className="text-xs text-gray-500">Designated key holders have specific access rights</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3 border rounded-md p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                        <RadioGroupItem value="delegated" id="delegated" className="mt-1" />
                        <div>
                          <Label htmlFor="delegated" className="font-medium cursor-pointer">Delegated Control</Label>
                          <p className="text-xs text-gray-500">Appointed trustees manage with oversight</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3 border rounded-md p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                        <RadioGroupItem value="flexible" id="flexible" className="mt-1" />
                        <div>
                          <Label htmlFor="flexible" className="font-medium cursor-pointer">Flexible Hierarchy</Label>
                          <p className="text-xs text-gray-500">Different access levels for different operations</p>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <Separator />
                  
                  {governanceModel === "multisig" && (
                    <div className="space-y-4 p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
                      <h3 className="text-lg font-medium">Multi-Signature Configuration</h3>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Total Signers</Label>
                            <span className="text-sm font-medium">{totalSigners}</span>
                          </div>
                          <Slider
                            min={2}
                            max={10}
                            step={1}
                            value={[totalSigners]}
                            onValueChange={(value) => {
                              setTotalSigners(value[0]);
                              setMultisigThreshold(Math.min(multisigThreshold, value[0]));
                            }}
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>2</span>
                            <span>10</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Required Signatures</Label>
                            <span className="text-sm font-medium">{multisigThreshold} of {totalSigners}</span>
                          </div>
                          <Slider
                            min={1}
                            max={totalSigners}
                            step={1}
                            value={[multisigThreshold]}
                            onValueChange={(value) => setMultisigThreshold(value[0])}
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>1</span>
                            <span>{totalSigners}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Time Lock Settings</h3>
                      <Switch 
                        checked={timeLockEnabled}
                        onCheckedChange={setTimeLockEnabled}
                      />
                    </div>
                    
                    {timeLockEnabled && (
                      <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border">
                        <div className="space-y-2">
                          <Label>Unlock Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                {unlockDate ? format(unlockDate, "PPP") : "Select unlock date"}
                                <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={unlockDate}
                                onSelect={setUnlockDate}
                                initialFocus
                                disabled={(date) => date < new Date()}
                              />
                            </PopoverContent>
                          </Popover>
                          <p className="text-xs text-gray-500">
                            Assets will be locked until this date
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Emergency Access</Label>
                              <p className="text-xs text-gray-500">Allow emergency access with additional verification</p>
                            </div>
                            <Switch 
                              checked={emergencyAccessEnabled}
                              onCheckedChange={setEmergencyAccessEnabled}
                            />
                          </div>
                          
                          {emergencyAccessEnabled && (
                            <div className="space-y-2 mt-3">
                              <div className="flex items-center justify-between">
                                <Label>Emergency Access Time Delay</Label>
                                <span className="text-sm font-medium">{emergencyTimePeriod} hours</span>
                              </div>
                              <Slider
                                min={24}
                                max={168}
                                step={12}
                                value={[emergencyTimePeriod]}
                                onValueChange={(value) => setEmergencyTimePeriod(value[0])}
                              />
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>24 hours</span>
                                <span>1 week</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <Alert className="bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900">
                    <ShieldAlert className="h-4 w-4 text-purple-500" />
                    <AlertTitle className="text-purple-700 dark:text-purple-400">Sovereign-Grade Security</AlertTitle>
                    <AlertDescription className="text-purple-600 dark:text-purple-300">
                      The Sovereign Fortress Vault™ combines multiple security protocols to provide unparalleled protection for your assets, including quantum-resistant encryption, multi-signature governance, and cross-chain protection.
                    </AlertDescription>
                  </Alert>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab("chains")}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("recovery")}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="recovery">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Key className="mr-2 h-5 w-5 text-purple-500" />
                    Recovery System
                  </CardTitle>
                  <CardDescription>
                    Configure your fortress-level recovery protocol
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Recovery Method</h3>
                    
                    <RadioGroup 
                      value={recoveryConfig.method} 
                      onValueChange={(value: any) => 
                        setRecoveryConfig({...recoveryConfig, method: value})
                      }
                      className="space-y-3"
                    >
                      <div className="flex items-start space-x-3 border rounded-md p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                        <RadioGroupItem value="seedPhrase" id="seedPhrase" className="mt-1" />
                        <div>
                          <Label htmlFor="seedPhrase" className="font-medium cursor-pointer">Seed Phrase Recovery</Label>
                          <p className="text-xs text-gray-500">Standard recovery using a 24-word seed phrase</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3 border rounded-md p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                        <RadioGroupItem value="socialRecovery" id="socialRecovery" className="mt-1" />
                        <div>
                          <Label htmlFor="socialRecovery" className="font-medium cursor-pointer">Social Recovery</Label>
                          <p className="text-xs text-gray-500">Recovery through trusted contacts who verify your identity</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3 border rounded-md p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                        <RadioGroupItem value="biometric" id="biometric" className="mt-1" />
                        <div>
                          <Label htmlFor="biometric" className="font-medium cursor-pointer">Biometric Recovery</Label>
                          <p className="text-xs text-gray-500">Use biometric verification for recovery</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3 border rounded-md p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200 dark:border-purple-800">
                        <RadioGroupItem value="keyFragments" id="keyFragments" className="mt-1" />
                        <div>
                          <Label htmlFor="keyFragments" className="font-medium cursor-pointer">Shamir's Key Fragments</Label>
                          <p className="text-xs text-gray-500">Advanced key splitting requiring a threshold of fragments to recover</p>
                          <Badge className="mt-2 bg-gradient-to-r from-purple-600 to-pink-600">Premium</Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3 border rounded-md p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                        <RadioGroupItem value="custom" id="customRecovery" className="mt-1" />
                        <div>
                          <Label htmlFor="customRecovery" className="font-medium cursor-pointer">Custom Recovery System</Label>
                          <p className="text-xs text-gray-500">Define your own custom recovery protocol</p>
                        </div>
                      </div>
                    </RadioGroup>
                    
                    {recoveryConfig.method === "customRecovery" && (
                      <div className="mt-2">
                        <Textarea 
                          placeholder="Describe your custom recovery method"
                          value={recoveryConfig.customConfig || ""}
                          onChange={(e) => setRecoveryConfig({
                            ...recoveryConfig,
                            customConfig: e.target.value
                          })}
                          rows={3}
                        />
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  {recoveryConfig.method === "socialRecovery" && (
                    <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border">
                      <h3 className="text-base font-medium">Social Recovery Settings</h3>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Trusted Contacts</Label>
                          <span className="text-sm font-medium">{recoveryConfig.numTrustedContacts || 3}</span>
                        </div>
                        <Slider
                          min={2}
                          max={7}
                          step={1}
                          value={[recoveryConfig.numTrustedContacts || 3]}
                          onValueChange={(value) => setRecoveryConfig({
                            ...recoveryConfig,
                            numTrustedContacts: value[0]
                          })}
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>2</span>
                          <span>7</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Recovery Time Delay</Label>
                          <span className="text-sm font-medium">{recoveryConfig.timeDelay || 48} hours</span>
                        </div>
                        <Slider
                          min={24}
                          max={168}
                          step={12}
                          value={[recoveryConfig.timeDelay || 48]}
                          onValueChange={(value) => setRecoveryConfig({
                            ...recoveryConfig,
                            timeDelay: value[0]
                          })}
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>24 hours</span>
                          <span>1 week</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {recoveryConfig.method === "keyFragments" && (
                    <div className="space-y-4 p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
                      <h3 className="text-base font-medium">Shamir's Key Fragments</h3>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Total Key Fragments</Label>
                          <span className="text-sm font-medium">{recoveryConfig.numTrustedContacts || 5}</span>
                        </div>
                        <Slider
                          min={3}
                          max={9}
                          step={1}
                          value={[recoveryConfig.numTrustedContacts || 5]}
                          onValueChange={(value) => {
                            const newValue = value[0];
                            setRecoveryConfig({
                              ...recoveryConfig,
                              numTrustedContacts: newValue,
                              fragmentThreshold: Math.min(recoveryConfig.fragmentThreshold || 3, newValue)
                            });
                          }}
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>3</span>
                          <span>9</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Required Fragments (Threshold)</Label>
                          <span className="text-sm font-medium">
                            {recoveryConfig.fragmentThreshold || 3} of {recoveryConfig.numTrustedContacts || 5}
                          </span>
                        </div>
                        <Slider
                          min={2}
                          max={Math.max(2, (recoveryConfig.numTrustedContacts || 5) - 1)}
                          step={1}
                          value={[recoveryConfig.fragmentThreshold || 3]}
                          onValueChange={(value) => setRecoveryConfig({
                            ...recoveryConfig,
                            fragmentThreshold: value[0]
                          })}
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>2</span>
                          <span>{Math.max(2, (recoveryConfig.numTrustedContacts || 5) - 1)}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-purple-600 dark:text-purple-300">
                        Your master key will be split into {recoveryConfig.numTrustedContacts || 5} fragments, 
                        requiring {recoveryConfig.fragmentThreshold || 3} for recovery. This provides exceptional 
                        security with redundancy.
                      </p>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Recovery Security Settings</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border rounded-md p-3">
                        <div>
                          <p className="font-medium">Time-Delayed Recovery</p>
                          <p className="text-sm text-gray-500">Adds a waiting period to any recovery attempt</p>
                        </div>
                        <Switch defaultChecked={true} />
                      </div>
                      
                      <div className="flex items-center justify-between border rounded-md p-3">
                        <div>
                          <p className="font-medium">Multi-Chain Verification</p>
                          <p className="text-sm text-gray-500">Requires verification across multiple blockchains</p>
                        </div>
                        <Switch defaultChecked={chains.length > 1} disabled={chains.length < 2} />
                      </div>
                      
                      <div className="flex items-center justify-between border rounded-md p-3">
                        <div>
                          <p className="font-medium">Advanced Fraud Detection</p>
                          <p className="text-sm text-gray-500">AI-powered detection of suspicious recovery attempts</p>
                        </div>
                        <Switch defaultChecked={true} />
                      </div>
                      
                      <div className="flex items-center justify-between border rounded-md p-3">
                        <div>
                          <p className="font-medium">Recovery Notifications</p>
                          <p className="text-sm text-gray-500">Send alerts through multiple channels when recovery is initiated</p>
                        </div>
                        <Switch defaultChecked={true} />
                      </div>
                    </div>
                  </div>
                  
                  <Alert className="bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900">
                    <Key className="h-4 w-4 text-indigo-500" />
                    <AlertTitle className="text-indigo-700 dark:text-indigo-400">Fortress Recovery System</AlertTitle>
                    <AlertDescription className="text-indigo-600 dark:text-indigo-300">
                      Sovereign Fortress Vault™ recovery system employs advanced cryptographic techniques to ensure you never lose access to your assets while maintaining maximum security.
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
                    onClick={() => setActiveTab("access")}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="access">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Fingerprint className="mr-2 h-5 w-5 text-purple-500" />
                    Access Controls
                  </CardTitle>
                  <CardDescription>
                    Configure fortress-level access protection
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Multi-Factor Authentication</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border rounded-md p-3">
                        <div>
                          <p className="font-medium">Biometric Verification</p>
                          <p className="text-sm text-gray-500">Use fingerprint, face, or other biometric identification</p>
                        </div>
                        <Switch 
                          checked={biometricEnabled}
                          onCheckedChange={setBiometricEnabled}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between border rounded-md p-3">
                        <div>
                          <p className="font-medium">Geolocation Verification</p>
                          <p className="text-sm text-gray-500">Verify access from authorized locations</p>
                        </div>
                        <Switch 
                          checked={geolocationEnabled}
                          onCheckedChange={setGeolocationEnabled}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between border rounded-md p-3">
                        <div>
                          <p className="font-medium">Time-Based Verification</p>
                          <p className="text-sm text-gray-500">Add time-based one-time password (TOTP) verification</p>
                        </div>
                        <Switch 
                          checked={timeBasedEnabled}
                          onCheckedChange={setTimeBasedEnabled}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between border rounded-md p-3">
                        <div>
                          <p className="font-medium">Behavioral Analysis</p>
                          <p className="text-sm text-gray-500">Analyze behavioral patterns to detect unauthorized access</p>
                        </div>
                        <Switch 
                          checked={behavioralEnabled}
                          onCheckedChange={setBehavioralEnabled}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">AI Security Monitoring</h3>
                        <p className="text-sm text-gray-500">Advanced AI monitoring of access patterns and suspicious activity</p>
                      </div>
                      <Switch 
                        checked={aiMonitoringEnabled}
                        onCheckedChange={setAiMonitoringEnabled}
                      />
                    </div>
                    
                    {aiMonitoringEnabled && (
                      <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
                        <h4 className="font-medium mb-3">AI Security Features</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-purple-500" />
                            <span className="text-sm">Anomaly detection across all access attempts</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-purple-500" />
                            <span className="text-sm">Continuous learning from access patterns</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-purple-500" />
                            <span className="text-sm">Real-time security alerts across multiple channels</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-purple-500" />
                            <span className="text-sm">Automatic lockdown on suspicious activity</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-purple-500" />
                            <span className="text-sm">Advanced threat intelligence integration</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Premium Features</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {features.map(feature => (
                        <div
                          key={feature.id}
                          className={cn(
                            "border rounded-md p-3",
                            feature.premium ? 
                              "bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200 dark:border-purple-800" : ""
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium">{feature.name}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                              {feature.premium && (
                                <Badge className="mt-2 bg-gradient-to-r from-purple-600 to-pink-600">Premium</Badge>
                              )}
                            </div>
                            <Switch 
                              checked={feature.enabled}
                              onCheckedChange={() => toggleFeature(feature.id)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
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
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {calculateSecurityScore() >= 90 
                        ? "Sovereign Grade: Your vault has exceptional security with comprehensive protections"
                        : calculateSecurityScore() >= 70
                        ? "Enhanced Security: Your vault has strong protection but could be improved further"
                        : "Standard Security: Consider enabling more security features for better protection"
                      }
                    </p>
                  </div>
                  
                  <Alert className="bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900">
                    <Wallet className="h-4 w-4 text-purple-500" />
                    <AlertTitle className="text-purple-700 dark:text-purple-400">Sovereign Fortress Access</AlertTitle>
                    <AlertDescription className="text-purple-600 dark:text-purple-300">
                      Fortress-level access control combines multiple authentication factors with AI-powered security to provide unprecedented protection for your digital assets.
                    </AlertDescription>
                  </Alert>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab("recovery")}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("review")}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
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
                    <Check className="mr-2 h-5 w-5 text-purple-500" />
                    Review Configuration
                  </CardTitle>
                  <CardDescription>
                    Review your Sovereign Fortress Vault™ configuration before deployment
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
                          <span className="text-gray-500">Security Level:</span>
                          <span className="font-medium capitalize">{securityLevel}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-500">Chain Protection:</span>
                          <span className="font-medium capitalize">{chainProtection}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-500">Access Control:</span>
                          <span className="font-medium capitalize">{accessControl}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-500">Recovery Method:</span>
                          <span className="font-medium">
                            {recoveryConfig.method === "keyFragments" ? "Key Fragments" :
                             recoveryConfig.method === "socialRecovery" ? "Social Recovery" :
                             recoveryConfig.method === "biometric" ? "Biometric" :
                             recoveryConfig.method === "seedPhrase" ? "Seed Phrase" :
                             "Custom Recovery"}
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
                      
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold">Blockchain Distribution</h3>
                        <div className="mt-2 space-y-2">
                          {chains.map(chain => (
                            <div key={`review-${chain}`} className="flex items-center gap-3">
                              <div className="w-8">{getChainIcon(chain)}</div>
                              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                                <div 
                                  className={cn(
                                    "h-full rounded-full",
                                    chain === "ethereum" ? "bg-blue-500" :
                                    chain === "ton" ? "bg-purple-500" :
                                    chain === "solana" ? "bg-green-500" :
                                    chain === "bitcoin" ? "bg-orange-500" :
                                    chain === "polygon" ? "bg-indigo-500" :
                                    chain === "avalanche" ? "bg-red-500" :
                                    "bg-pink-500"
                                  )}
                                  style={{ width: `${assetDistribution[chain] || 0}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium w-10 text-right">{assetDistribution[chain] || 0}%</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2">
                          <span className="text-gray-500 text-sm">Primary Chain:</span>
                          <span className="text-sm font-medium capitalize ml-2">{primaryChain}</span>
                        </div>
                        <div className="mt-1">
                          <span className="text-gray-500 text-sm">Cross-Chain:</span>
                          <span className="text-sm ml-2">{crossChainEnabled ? "Enabled" : "Disabled"}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">Security Configuration</h3>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Security Protocols:</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {protocols.map(protocol => (
                            <div key={`review-protocol-${protocol}`} className="flex items-center gap-2">
                              {getProtocolIcon(protocol)}
                              <span className="text-sm">{getProtocolName(protocol)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-2 mt-3">
                        <h4 className="font-medium">Governance:</h4>
                        <p className="text-sm">
                          {governanceModel === "multisig" 
                            ? `Multi-Signature (${multisigThreshold} of ${totalSigners})` 
                            : governanceModel === "dao" 
                            ? "DAO Governance"
                            : governanceModel === "keyHolders"
                            ? "Key Holders"
                            : governanceModel === "delegated"
                            ? "Delegated Control"
                            : governanceModel === "flexible"
                            ? "Flexible Hierarchy"
                            : "Individual Control"}
                        </p>
                      </div>
                      
                      {recoveryConfig.method === "keyFragments" && (
                        <div className="space-y-2 mt-3">
                          <h4 className="font-medium">Key Fragments:</h4>
                          <p className="text-sm">
                            {recoveryConfig.fragmentThreshold} of {recoveryConfig.numTrustedContacts} fragments required for recovery
                          </p>
                        </div>
                      )}
                      
                      <div className="space-y-2 mt-3">
                        <h4 className="font-medium">Access Controls:</h4>
                        <div className="space-y-1">
                          {biometricEnabled && (
                            <div className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-500" />
                              <span className="text-sm">Biometric Verification</span>
                            </div>
                          )}
                          {geolocationEnabled && (
                            <div className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-500" />
                              <span className="text-sm">Geolocation Verification</span>
                            </div>
                          )}
                          {timeBasedEnabled && (
                            <div className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-500" />
                              <span className="text-sm">Time-Based Verification</span>
                            </div>
                          )}
                          {behavioralEnabled && (
                            <div className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-500" />
                              <span className="text-sm">Behavioral Analysis</span>
                            </div>
                          )}
                          {aiMonitoringEnabled && (
                            <div className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-500" />
                              <span className="text-sm">AI Security Monitoring</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="font-medium">Enabled Premium Features:</h4>
                        <div className="space-y-1 mt-2">
                          {features.filter(f => f.enabled).map(feature => (
                            <div key={`review-feature-${feature.id}`} className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-purple-500" />
                              <span className="text-sm">{feature.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-4">
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
                      The Sovereign Fortress Vault™ offers the highest level of security available, but please ensure you maintain proper backups of your recovery information according to your chosen method.
                    </AlertDescription>
                  </Alert>
                  
                  <Alert className="bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900">
                    <Crown className="h-4 w-4 text-purple-500" />
                    <AlertTitle className="text-purple-700 dark:text-purple-400">Sovereign-Grade Protection</AlertTitle>
                    <AlertDescription className="text-purple-600 dark:text-purple-300">
                      Your Sovereign Fortress Vault™ combines military-grade encryption, quantum-resistant algorithms, multi-blockchain distribution, and AI security monitoring to provide unparalleled protection for your digital assets.
                    </AlertDescription>
                  </Alert>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab("access")}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Create Sovereign Fortress Vault™
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

export default SovereignFortressVault;