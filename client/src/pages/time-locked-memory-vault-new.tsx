import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { 
  ArrowLeft, 
  Check, 
  Shield, 
  Clock, 
  Image, 
  Video, 
  Calendar, 
  Users, 
  Key,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Network,
  Diamond,
  Layers,
  Server as ServerStack,
  HardDrive,
  Timer
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { useTon } from "@/contexts/ton-context";
import { useEthereum } from "@/contexts/ethereum-context";
import { useSolana } from "@/contexts/solana-context";
import { cn } from "@/lib/utils";

// Custom components for blockchain icons
const Ethereum = () => (
  <svg viewBox="0 0 32 32" className="fill-current" width="100%" height="100%">
    <path d="M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16-7.163 16-16 16zm7.994-15.781L16.498 4 9 16.22l7.498 4.353 7.496-4.354zM16.498 27.11L9 17.638l7.498 4.353 7.496-4.354-7.496 9.473z" />
  </svg>
);

const Solana = () => (
  <svg viewBox="0 0 32 32" className="fill-current" width="100%" height="100%">
    <path d="M16 0c8.837 0 16 7.163 16 16s-7.163 16-16 16S0 24.837 0 16 7.163 0 16 0zm7.566 10.504h-7.115a.858.858 0 00-.604.25l-1.64 1.644a.25.25 0 000 .354l5.752 5.763a.25.25 0 00.354 0l3.254-3.262a.858.858 0 00.25-.604v-3.394a.75.75 0 00-.75-.75zm-4.947 5.2l-7.305 7.32a.25.25 0 01-.354 0L8.46 20.52a.858.858 0 01-.25-.605v-3.393a.75.75 0 01.75-.75h7.115a.858.858 0 01.604.25l1.64 1.644a.25.25 0 010 .354l-1.64 1.645a.25.25 0 01-.354 0l-5.752-5.763a.25.25 0 00-.354 0L8.96 15.51a.25.25 0 000 .354l5.752 5.763a.25.25 0 00.354 0l3.254-3.262a.858.858 0 00.25-.604v-3.394a.75.75 0 01.75-.75h1.512a.75.75 0 01.75.75v1.286z" />
  </svg>
);

const Ton = () => (
  <svg viewBox="0 0 32 32" className="fill-current" width="100%" height="100%">
    <path d="M16 0a16 16 0 1 0 0 32 16 16 0 0 0 0-32zm7.13 8.038l-2.723 2.724a.376.376 0 0 1-.53 0l-2.724-2.724a.376.376 0 0 1 0-.53l2.724-2.724a.376.376 0 0 1 .53 0l2.724 2.724a.376.376 0 0 1 0 .53zm-7.13 16.15-5.555-5.555a.376.376 0 0 1 0-.53l2.722-2.724a.376.376 0 0 1 .531 0l3.537 3.537a.752.752 0 0 0 1.06 0l3.538-3.538a.376.376 0 0 1 .53 0l2.724 2.724a.376.376 0 0 1 0 .53L16 24.189z" />
  </svg>
);

const Bitcoin = () => (
  <svg viewBox="0 0 32 32" className="fill-current" width="100%" height="100%">
    <path d="M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16-7.163 16-16 16zm1.922-16.825c.353.851-.106 1.264-.702 1.553l.702 2.092h-1.618l-.68-2.022h-1.53l.677 2.022h-1.595l-.677-2.043h-3.19v-1.514h.532c.446 0 .51-.17.552-.363V10.43c0-.128-.034-.276-.532-.276h-.552V8.596h3.19l-.001 2.034h.192c1.042 0 1.749.128 2.023.532.17.276.213.595.17.893h.147c1.382 0 2.215.595 2.215 2.01 0 .235-.042.639-.213 1.108l.89.002zm-3.965-1.683c-.149.276-.468.34-.88.34h-.659V12.01h.637c.383 0 .723.043.872.298.17.234.127.51.03.784zm1.999 1.044c.15.34-.085.659-.575.659h-.977v-1.639h.955c.468 0 .744.234.616.98h-.019z" />
  </svg>
);

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
};

const slideIn = {
  hidden: { x: 20, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// Type definitions
type MediaItem = {
  id: string;
  name: string;
  size: string;
  type: "image" | "video";
  status: "uploading" | "encrypted" | "stored";
  progress: number;
};

type UnlockMethod = "date" | "event" | "milestone" | "hybrid";
type RecoveryMethod = "social" | "geo" | "multi" | "quantum" | "customRecovery";
type StorageRedundancy = "standard" | "enhanced" | "maximum";

export default function TimeLockedMemoryVault() {
  const { toast } = useToast();
  const ton = useTon();
  const ethereum = useEthereum();
  const solana = useSolana();
  const [location, setLocation] = useLocation();
  
  // UI State
  const [activeTab, setActiveTab] = useState<string>("basic");
  const [step, setStep] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [securityAnalysisComplete, setSecurityAnalysisComplete] = useState<boolean>(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState<boolean>(false);
  const [uploadedImages, setUploadedImages] = useState<number>(0);
  const [uploadedVideos, setUploadedVideos] = useState<number>(0);
  
  // Vault Base Configuration
  const [vaultName, setVaultName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [primaryBlockchain, setPrimaryBlockchain] = useState<string>("Ethereum");
  const [secondaryChains, setSecondaryChains] = useState<string[]>(["Solana"]);
  
  // Time Lock Configuration
  const [unlockDate, setUnlockDate] = useState<string>("");
  const [unlockMethod, setUnlockMethod] = useState<UnlockMethod>("date");
  const [unlockEvents, setUnlockEvents] = useState<string[]>([]);
  const [currentUnlockEvent, setCurrentUnlockEvent] = useState<string>("");
  const [timeWindow, setTimeWindow] = useState<number>(24); // Hours
  const [earlyAccessFee, setEarlyAccessFee] = useState<number>(0);
  const [timeExtensionEnabled, setTimeExtensionEnabled] = useState<boolean>(false);
  
  // Beneficiaries and Permissions
  const [beneficiaries, setBeneficiaries] = useState<
    Array<{
      id: string;
      address: string;
      type: "wallet" | "email";
      permissions: Array<"view" | "extract" | "modify" | "delete">;
      notificationMethod: "onchain" | "email" | "both";
    }>
  >([]);
  const [beneficiaryInput, setBeneficiaryInput] = useState<string>("");
  const [beneficiaryType, setBeneficiaryType] = useState<"wallet" | "email">("wallet");
  const [selectedPermissions, setSelectedPermissions] = useState<Array<"view" | "extract" | "modify" | "delete">>(["view", "extract"]);
  
  // Media Content
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [personalMessage, setPersonalMessage] = useState<string>("");
  const [messageEncryption, setMessageEncryption] = useState<"standard" | "quantum">("standard");
  const [messageExpiry, setMessageExpiry] = useState<"never" | "with-vault" | "custom">("with-vault");
  
  // Storage Configuration
  const [storageRedundancy, setStorageRedundancy] = useState<StorageRedundancy>("enhanced");
  const [enableCrossChainBackup, setEnableCrossChainBackup] = useState<boolean>(true);
  const [permanentStorage, setPermanentStorage] = useState<boolean>(true);
  const [selectedStorageProviders, setSelectedStorageProviders] = useState<string[]>(["arweave", "ipfs"]);
  
  // Recovery Configuration
  const [recoveryMethod, setRecoveryMethod] = useState<RecoveryMethod>("social");
  const [recoveryThreshold, setRecoveryThreshold] = useState<number>(2);
  const [recoveryContacts, setRecoveryContacts] = useState<string[]>([]);
  const [recoveryOption, setRecoveryOption] = useState<string>("social");
  const [recoveryGeolocations, setRecoveryGeolocations] = useState<string[]>([]);
  const [quantumRecoveryKey, setQuantumRecoveryKey] = useState<string>("");
  
  // Security & Analytics
  const [securityScore, setSecurityScore] = useState<number>(0);
  const [encryptionStrength, setEncryptionStrength] = useState<"standard" | "enhanced" | "quantum">("enhanced");
  const [memoryVaultAnalytics, setMemoryVaultAnalytics] = useState<{
    storageRequirement: number;
    estimatedLifespan: number;
    vulnerabilityScore: number;
    backupRedundancy: number;
    privacyScore: number;
  }>({
    storageRequirement: 0,
    estimatedLifespan: 50,
    vulnerabilityScore: 0,
    backupRedundancy: 0,
    privacyScore: 0
  });
  const [processingProgress, setProcessingProgress] = useState<number>(0);

  // Helper functions
  const generateId = () => Math.random().toString(36).substring(2, 9);
  
  // Initialize security score calculation
  useEffect(() => {
    calculateSecurityScore();
  }, [
    primaryBlockchain, 
    secondaryChains, 
    unlockMethod, 
    beneficiaries, 
    storageRedundancy, 
    recoveryMethod,
    encryptionStrength,
    permanentStorage,
    selectedStorageProviders
  ]);
  
  // Calculate overall security and analytics scores
  const calculateSecurityScore = () => {
    // Base score
    let score = 60;
    
    // Blockchain factors
    if (primaryBlockchain === "Ethereum") score += 5;
    if (primaryBlockchain === "TON") score += 6;
    if (secondaryChains.length > 0) score += secondaryChains.length * 3;
    
    // Time lock factors
    if (unlockMethod === "hybrid") score += 8;
    else if (unlockMethod === "milestone") score += 6;
    else if (unlockMethod === "event") score += 4;
    
    // Content security
    if (encryptionStrength === "quantum") score += 10;
    else if (encryptionStrength === "enhanced") score += 6;
    
    // Storage factors
    if (storageRedundancy === "maximum") score += 8;
    else if (storageRedundancy === "enhanced") score += 5;
    if (permanentStorage) score += 4;
    if (selectedStorageProviders.includes("arweave")) score += 3;
    
    // Recovery factors
    if (recoveryMethod === "quantum") score += 9;
    else if (recoveryMethod === "multi") score += 7;
    else if (recoveryMethod === "geo") score += 5;
    else if (recoveryMethod === "social") score += 4;
    
    // Beneficiary security
    if (beneficiaries.length > 0) {
      const restrictedAccess = beneficiaries.filter(b => 
        !b.permissions.includes("modify") && !b.permissions.includes("delete")
      ).length;
      
      score += (restrictedAccess / beneficiaries.length) * 4;
    }
    
    // Cap the score at a maximum of 100
    score = Math.min(100, Math.round(score));
    setSecurityScore(score);
    
    // Update analytics based on security configuration
    setMemoryVaultAnalytics({
      storageRequirement: mediaItems.length * 25 + (personalMessage ? 1 : 0),
      estimatedLifespan: permanentStorage ? 99 : (storageRedundancy === "maximum" ? 75 : 50),
      vulnerabilityScore: Math.max(5, 100 - score),
      backupRedundancy: selectedStorageProviders.length * 25 + (enableCrossChainBackup ? 25 : 0),
      privacyScore: encryptionStrength === "quantum" ? 95 : encryptionStrength === "enhanced" ? 80 : 70
    });
    
    if (!securityAnalysisComplete && score > 0) {
      setSecurityAnalysisComplete(true);
    }
  };
  
  // Step navigation
  const nextStep = () => {
    if (step < 6) {
      setStep(step + 1);
      window.scrollTo(0, 0);
      
      // Simulate processing when advancing to final step
      if (step === 5) {
        setIsProcessing(true);
        setProcessingProgress(0);
        
        const interval = setInterval(() => {
          setProcessingProgress(prev => {
            if (prev >= 100) {
              clearInterval(interval);
              setIsProcessing(false);
              return 100;
            }
            return prev + 5;
          });
        }, 150);
      }
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Add a new media item
  const handleMediaUpload = (type: 'image' | 'video') => {
    setIsProcessing(true);
    
    // Simulate upload and encryption process
    setTimeout(() => {
      const newItem: MediaItem = {
        id: generateId(),
        name: type === 'image' ? `memory_image_${mediaItems.length + 1}.jpg` : `memory_video_${mediaItems.length + 1}.mp4`,
        size: type === 'image' ? `${Math.floor(Math.random() * 9) + 1}MB` : `${Math.floor(Math.random() * 90) + 10}MB`,
        type,
        status: 'uploading',
        progress: 0
      };
      
      setMediaItems(prev => [...prev, newItem]);
      
      // Simulate encryption process
      const encryptionInterval = setInterval(() => {
        setMediaItems(prev => {
          const updatedItems = [...prev];
          const itemIndex = updatedItems.findIndex(item => item.id === newItem.id);
          
          if (itemIndex !== -1) {
            const item = updatedItems[itemIndex];
            
            if (item.progress < 100) {
              updatedItems[itemIndex] = {
                ...item,
                progress: item.progress + 10,
                status: item.progress + 10 >= 100 ? 'encrypted' : 'uploading'
              };
            } else {
              clearInterval(encryptionInterval);
              setTimeout(() => {
                setMediaItems(prev => {
                  const finalItems = [...prev];
                  const finalIndex = finalItems.findIndex(item => item.id === newItem.id);
                  
                  if (finalIndex !== -1) {
                    finalItems[finalIndex] = {
                      ...finalItems[finalIndex],
                      status: 'stored'
                    };
                  }
                  
                  return finalItems;
                });
              }, 1000);
            }
          }
          
          return updatedItems;
        });
      }, 300);
      
      setIsProcessing(false);
      
      if (type === 'image') {
        setUploadedImages(prev => prev + 1);
      } else {
        setUploadedVideos(prev => prev + 1);
      }
      
      toast({
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Upload Started`,
        description: "File is being encrypted and stored securely.",
      });
    }, 800);
  };

  // Add a beneficiary
  const addBeneficiary = () => {
    if (beneficiaryInput && beneficiaries.findIndex(b => b.address === beneficiaryInput) === -1) {
      const newBeneficiary = {
        id: generateId(),
        address: beneficiaryInput,
        type: beneficiaryType,
        permissions: selectedPermissions,
        notificationMethod: "both" as const
      };
      
      setBeneficiaries(prev => [...prev, newBeneficiary]);
      setBeneficiaryInput("");
      
      toast({
        title: "Beneficiary Added",
        description: `${beneficiaryType === "wallet" ? "Wallet" : "Email"} added with ${selectedPermissions.length} permission(s).`,
      });
    }
  };

  // Remove a beneficiary
  const removeBeneficiary = (id: string) => {
    setBeneficiaries(prev => prev.filter(b => b.id !== id));
  };
  
  // Add an unlock event
  const addUnlockEvent = () => {
    if (currentUnlockEvent && !unlockEvents.includes(currentUnlockEvent)) {
      setUnlockEvents([...unlockEvents, currentUnlockEvent]);
      setCurrentUnlockEvent("");
    }
  };
  
  // Remove an unlock event
  const removeUnlockEvent = (event: string) => {
    setUnlockEvents(unlockEvents.filter(e => e !== event));
  };
  
  // Get a human-readable security level
  const getSecurityLevel = () => {
    if (securityScore >= 90) return "Maximum";
    if (securityScore >= 80) return "Fortress";
    if (securityScore >= 70) return "Advanced";
    if (securityScore >= 60) return "Enhanced";
    if (securityScore >= 40) return "Standard";
    return "Basic";
  };
  
  // Security level color
  const getSecurityColor = () => {
    if (securityScore >= 90) return "text-emerald-400";
    if (securityScore >= 80) return "text-[#FF5AF7]";
    if (securityScore >= 70) return "text-indigo-400";
    if (securityScore >= 60) return "text-blue-400";
    if (securityScore >= 40) return "text-yellow-400";
    return "text-red-400";
  };
  
  // Handle blockchain selection 
  const handleBlockchainSelect = (chain: string) => {
    setPrimaryBlockchain(chain);
    
    // Update security score based on selection
    let newScore = securityScore;
    
    if (chain === "Ethereum") newScore = 70;
    if (chain === "TON") newScore = 75;
    if (chain === "Solana") newScore = 72;
    
    // Bonus for enabling cross-chain backup
    if (enableCrossChainBackup) newScore += 15;
    
    setSecurityScore(newScore);
    
    toast({
      title: "Blockchain Selected",
      description: `Your vault will be primarily deployed on ${chain} blockchain.`,
    });
  };
  
  // Create the final vault
  const createVault = () => {
    setIsProcessing(true);
    
    // Simulate vault creation process with progress
    setProcessingProgress(0);
    
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsProcessing(false);
            
            toast({
              title: "Memory Vault Created Successfully",
              description: "Your time-locked memories are now securely stored in the vault.",
            });
            
            // Navigate to success or dashboard page
            // setLocation("/dashboard");
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };
  
  // Component to display the step indicator
  const StepIndicator = ({ currentStep }: { currentStep: number }) => {
    const steps = [
      { name: "Vault Basics", icon: <Sparkles className="h-4 w-4" /> },
      { name: "Time Lock", icon: <Clock className="h-4 w-4" /> },
      { name: "Memories", icon: <Image className="h-4 w-4" /> },
      { name: "Access", icon: <Users className="h-4 w-4" /> },
      { name: "Security", icon: <Shield className="h-4 w-4" /> },
      { name: "Review", icon: <Check className="h-4 w-4" /> }
    ];
    
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  index + 1 === currentStep 
                    ? "bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white"
                    : index + 1 < currentStep
                      ? "bg-[#6B00D7]/20 text-[#FF5AF7]" 
                      : "bg-[#242424] text-gray-500"
                }`}
              >
                {index + 1 < currentStep ? (
                  <Check className="h-5 w-5" />
                ) : (
                  step.icon
                )}
              </div>
              <span className={`text-xs mt-2 ${
                index + 1 === currentStep 
                  ? "text-[#FF5AF7]"
                  : index + 1 < currentStep
                    ? "text-gray-300" 
                    : "text-gray-500"
              }`}>
                {step.name}
              </span>
            </div>
          ))}
        </div>
        <div className="w-full bg-[#242424] h-1 mt-4 rounded-full overflow-hidden">
          <motion.div 
            className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] h-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / steps.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    );
  };
  
  // Component to display security badge
  const SecurityBadge = ({ score }: { score: number }) => {
    return (
      <div className="flex items-center gap-1">
        <div className={`px-2 py-0.5 rounded text-xs font-semibold ${
          score >= 80 
            ? "bg-[#6B00D7]/20 text-[#FF5AF7]" 
            : score >= 60 
              ? "bg-blue-500/20 text-blue-400" 
              : "bg-yellow-500/20 text-yellow-400"
        }`}>
          {getSecurityLevel()} Security
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Shield className="h-3 w-3" />
          {score}/100
        </div>
      </div>
    );
  };
  
  // Component to display the security score meter
  const SecurityMeter = ({ score }: { score: number }) => {
    return (
      <div className="relative h-2 w-full bg-[#242424] rounded-full overflow-hidden">
        <motion.div 
          className="absolute inset-0 h-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    );
  };

  return (
    <motion.div 
      className="min-h-screen bg-[#131313] pb-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Section with 3D-like gradient background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#6B00D7]/30 to-[#131313] z-0"></div>
        <div 
          className="absolute inset-0 opacity-20 z-0"
          style={{ 
            backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255, 90, 247, 0.4) 0%, transparent 25%), radial-gradient(circle at 80% 60%, rgba(107, 0, 215, 0.4) 0%, transparent 40%)'
          }}
        ></div>
        
        <div className="container mx-auto px-4 py-6 md:py-12 relative z-10">
          <Link href="/vault-types">
            <Button variant="ghost" className="mb-6 hover:bg-[#6B00D7]/10 text-gray-300">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Vault Types
            </Button>
          </Link>

          <div className="flex flex-col md:flex-row md:items-center mb-6 md:mb-10">
            <motion.div 
              className="h-16 w-16 rounded-xl bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center shadow-lg shadow-[#6B00D7]/30 mr-4 mb-4 md:mb-0"
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Clock className="h-8 w-8 text-white" />
            </motion.div>
            <div>
              <motion.h1 
                className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] tracking-tight"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Time-Locked Memory Vault
              </motion.h1>
              <motion.p 
                className="text-lg md:text-xl text-gray-300 max-w-3xl mt-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Create a quantum-secure vault that binds digital assets with precious memories, time-locked until the moment of your choosing.
              </motion.p>
            </div>
          </div>
          
          {/* Security Badge */}
          {securityAnalysisComplete && (
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <SecurityBadge score={securityScore} />
            </motion.div>
          )}
          
          {/* Step Indicator */}
          <StepIndicator currentStep={step} />
        </div>
      </div>

      {/* Main Content Section */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-[#1A1A1A] border-[#333] shadow-xl overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#6B00D7]/10 to-transparent pointer-events-none"></div>
                  
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold">Vault Details</CardTitle>
                    </div>
                    <CardDescription className="ml-10">
                      Create the foundation for your time-locked memory vault.
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="vault-name" className="text-sm font-medium text-gray-200">
                        Vault Name
                      </Label>
                      <Input
                        id="vault-name"
                        placeholder="Enter a name for your vault"
                        value={vaultName}
                        onChange={(e) => setVaultName(e.target.value)}
                        className="bg-[#252525] border-[#393939] focus:border-[#FF5AF7] focus:ring-[#6B00D7]/20"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="vault-description" className="text-sm font-medium text-gray-200">
                        Vault Description
                      </Label>
                      <Textarea
                        id="vault-description"
                        placeholder="Describe what this vault will contain..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="bg-[#252525] border-[#393939] min-h-[100px] focus:border-[#FF5AF7] focus:ring-[#6B00D7]/20"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-gray-200">
                        Primary Blockchain
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {['Ethereum', 'TON', 'Solana', 'Bitcoin'].map((chain) => (
                          <motion.div
                            key={chain}
                            className={`
                              p-3 rounded-lg border cursor-pointer
                              flex flex-col items-center justify-center text-center gap-2
                              transition-all duration-200 ease-in-out
                              ${primaryBlockchain === chain 
                                ? 'bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 border-[#FF5AF7]' 
                                : 'bg-[#252525] border-[#333] hover:border-[#6B00D7]/50 hover:bg-[#252525]/70'}
                            `}
                            onClick={() => handleBlockchainSelect(chain)}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {chain === 'Ethereum' && <div className="h-8 w-8"><Ethereum /></div>}
                            {chain === 'TON' && <div className="h-8 w-8"><Ton /></div>}
                            {chain === 'Solana' && <div className="h-8 w-8"><Solana /></div>}
                            {chain === 'Bitcoin' && <div className="h-8 w-8"><Bitcoin /></div>}
                            <span className="font-medium">{chain}</span>
                            {primaryBlockchain === chain && (
                              <span className="text-xs text-[#FF5AF7]">Primary</span>
                            )}
                          </motion.div>
                        ))}
                      </div>

                      <div className="mt-2 p-3 rounded-lg bg-[#252525]/50 border border-[#333]">
                        <div className="flex items-center">
                          <Shield className="h-4 w-4 text-[#FF5AF7] mr-2" />
                          <span className="text-sm font-medium text-gray-200">Security Insight</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {primaryBlockchain === 'Ethereum' && "Ethereum offers robust smart contract capabilities with strong community support. Excellent for complex time-lock mechanisms."}
                          {primaryBlockchain === 'TON' && "TON provides high transaction throughput with minimal fees. Ideal for frequent memory updates or storing larger data volumes."}
                          {primaryBlockchain === 'Solana' && "Solana delivers exceptional speed and low costs. Perfect for memory vaults with frequent interactions and media storage."}
                          {primaryBlockchain === 'Bitcoin' && "Bitcoin offers unparalleled security and longevity. Best for permanent time-capsules with maximum preservation guarantees."}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-200">
                        Storage Redundancy
                      </Label>
                      <Select
                        value={storageRedundancy}
                        onValueChange={(value: StorageRedundancy) => setStorageRedundancy(value)}
                      >
                        <SelectTrigger className="bg-[#252525] border-[#393939] focus:ring-[#6B00D7]/20">
                          <SelectValue placeholder="Select storage redundancy" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard (Single Chain)</SelectItem>
                          <SelectItem value="enhanced">Enhanced (Dual Chain Backup)</SelectItem>
                          <SelectItem value="maximum">Maximum (Triple Chain + DHT)</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <div className="p-3 rounded-lg bg-[#252525]/50 border border-[#333] text-xs">
                        <div className="flex gap-2 items-center mb-2">
                          {storageRedundancy === 'standard' && (
                            <ServerStack className="h-4 w-4 text-blue-400" />
                          )}
                          {storageRedundancy === 'enhanced' && (
                            <ServerStack className="h-4 w-4 text-indigo-400" />
                          )}
                          {storageRedundancy === 'maximum' && (
                            <ServerStack className="h-4 w-4 text-[#FF5AF7]" />
                          )}
                          <span className="font-medium text-gray-200">
                            {storageRedundancy === 'standard' && 'Standard Protection'}
                            {storageRedundancy === 'enhanced' && 'Enhanced Protection'}
                            {storageRedundancy === 'maximum' && 'Maximum Protection'}
                          </span>
                        </div>
                        
                        <div className="text-gray-400 space-y-1">
                          {storageRedundancy === 'standard' && (
                            <>
                              <p>• Memories stored only on the primary blockchain</p>
                              <p>• Standard redundancy within the chain's native network</p>
                              <p>• Lower cost, suitable for most personal memories</p>
                            </>
                          )}
                          {storageRedundancy === 'enhanced' && (
                            <>
                              <p>• Memories backed up on two different blockchains</p>
                              <p>• Cross-chain verification mechanisms</p>
                              <p>• Resistant to single blockchain vulnerabilities</p>
                            </>
                          )}
                          {storageRedundancy === 'maximum' && (
                            <>
                              <p>• Triple-chain distributed storage architecture</p>
                              <p>• Additional backup on decentralized storage networks</p>
                              <p>• Zero-knowledge proofs verify data consistency</p>
                              <p>• Maximum resilience against network failures or attacks</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between py-4 bg-[#1A1A1A]/80 border-t border-[#333]">
                    <Button
                      variant="outline" 
                      disabled
                      className="border-[#393939] text-gray-400"
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={() => nextStep()}
                      className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5500AC] hover:to-[#E741DE] text-white border-none"
                    >
                      Continue to Time Lock
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Time Lock Configuration */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-[#1A1A1A] border-[#333] shadow-xl overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#6B00D7]/10 to-transparent pointer-events-none"></div>
                  
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center">
                        <Clock className="h-4 w-4 text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold">Time Lock Settings</CardTitle>
                    </div>
                    <CardDescription className="ml-10">
                      Define when and how your memories can be accessed in the future.
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <Label className="text-sm font-medium text-gray-200">
                        Unlock Method
                      </Label>
                      <RadioGroup 
                        value={unlockMethod}
                        onValueChange={(value) => setUnlockMethod(value as UnlockMethod)}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        <div className={`flex items-start space-x-2 rounded-lg border border-[#333] p-3 ${
                          unlockMethod === 'date' ? 'bg-[#6B00D7]/10 border-[#FF5AF7]/50' : 'bg-[#252525]'
                        }`}>
                          <RadioGroupItem value="date" id="date" className="mt-1" />
                          <div className="grid gap-1.5">
                            <Label htmlFor="date" className="font-medium">Date Based</Label>
                            <p className="text-xs text-gray-400">
                              Unlock on a specific date in the future.
                            </p>
                          </div>
                        </div>

                        <div className={`flex items-start space-x-2 rounded-lg border border-[#333] p-3 ${
                          unlockMethod === 'event' ? 'bg-[#6B00D7]/10 border-[#FF5AF7]/50' : 'bg-[#252525]'
                        }`}>
                          <RadioGroupItem value="event" id="event" className="mt-1" />
                          <div className="grid gap-1.5">
                            <Label htmlFor="event" className="font-medium">Event Based</Label>
                            <p className="text-xs text-gray-400">
                              Unlock when specific events occur on-chain.
                            </p>
                          </div>
                        </div>

                        <div className={`flex items-start space-x-2 rounded-lg border border-[#333] p-3 ${
                          unlockMethod === 'milestone' ? 'bg-[#6B00D7]/10 border-[#FF5AF7]/50' : 'bg-[#252525]'
                        }`}>
                          <RadioGroupItem value="milestone" id="milestone" className="mt-1" />
                          <div className="grid gap-1.5">
                            <Label htmlFor="milestone" className="font-medium">Milestone Based</Label>
                            <p className="text-xs text-gray-400">
                              Unlock when certain conditions are met.
                            </p>
                          </div>
                        </div>

                        <div className={`flex items-start space-x-2 rounded-lg border border-[#333] p-3 ${
                          unlockMethod === 'hybrid' ? 'bg-[#6B00D7]/10 border-[#FF5AF7]/50' : 'bg-[#252525]'
                        }`}>
                          <RadioGroupItem value="hybrid" id="hybrid" className="mt-1" />
                          <div className="grid gap-1.5">
                            <Label htmlFor="hybrid" className="font-medium">Hybrid</Label>
                            <p className="text-xs text-gray-400">
                              Combine multiple methods for enhanced security.
                            </p>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Date-based settings */}
                    {(unlockMethod === 'date' || unlockMethod === 'hybrid') && (
                      <div className="p-4 rounded-lg bg-[#252525]/70 border border-[#333] space-y-4">
                        <h3 className="text-sm font-semibold flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-[#FF5AF7]" />
                          Date Unlock Configuration
                        </h3>
                        
                        <div className="space-y-2">
                          <Label htmlFor="unlock-date" className="text-xs">Unlock Date</Label>
                          <Input 
                            type="date" 
                            id="unlock-date"
                            value={unlockDate}
                            onChange={(e) => setUnlockDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="bg-[#2A2A2A] border-[#393939]"
                          />
                          <p className="text-xs text-gray-400">
                            Your memories will be unlocked on this date.
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="time-window" className="text-xs">Access Window</Label>
                            <span className="text-xs text-gray-400">{timeWindow} hours</span>
                          </div>
                          <Slider
                            id="time-window"
                            min={1}
                            max={168}
                            step={1}
                            value={[timeWindow]}
                            onValueChange={(value) => setTimeWindow(value[0])}
                            className="py-4"
                          />
                          <p className="text-xs text-gray-400">
                            Time window for accessing content after unlock date.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Event-based settings */}
                    {(unlockMethod === 'event' || unlockMethod === 'hybrid') && (
                      <div className="p-4 rounded-lg bg-[#252525]/70 border border-[#333] space-y-4">
                        <h3 className="text-sm font-semibold flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-[#FF5AF7]" />
                          Event Trigger Configuration
                        </h3>
                        
                        <div className="space-y-2">
                          <Label htmlFor="event-trigger" className="text-xs">Event Trigger</Label>
                          <div className="flex gap-2">
                            <Input 
                              id="event-trigger"
                              placeholder="Enter an unlock event"
                              value={currentUnlockEvent}
                              onChange={(e) => setCurrentUnlockEvent(e.target.value)}
                              className="bg-[#2A2A2A] border-[#393939] flex-1"
                            />
                            <Button 
                              onClick={addUnlockEvent} 
                              variant="outline"
                              className="border-[#6B00D7] text-[#FF5AF7] hover:bg-[#6B00D7]/10"
                              size="sm"
                            >
                              Add
                            </Button>
                          </div>
                          <p className="text-xs text-gray-400">
                            Define blockchain events that will trigger unlocking.
                          </p>
                        </div>
                        
                        {unlockEvents.length > 0 && (
                          <div className="space-y-2">
                            <Label className="text-xs">Event Triggers</Label>
                            <div className="bg-[#2A2A2A] rounded-lg p-2 border border-[#393939] max-h-[120px] overflow-y-auto">
                              {unlockEvents.map((event, index) => (
                                <div key={index} className="flex items-center justify-between py-1 px-2 hover:bg-[#333] rounded">
                                  <span className="text-sm">{event}</span>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                                    onClick={() => removeUnlockEvent(event)}
                                  >
                                    ✕
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Advanced options */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-gray-200">
                          Advanced Options
                        </Label>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-7 text-xs font-normal"
                          onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                        >
                          {showAdvancedOptions ? "Hide" : "Show"}
                        </Button>
                      </div>
                      
                      {showAdvancedOptions && (
                        <div className="space-y-4 p-4 rounded-lg bg-[#252525]/70 border border-[#333]">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <Label className="text-xs">Time Extension</Label>
                              <p className="text-xs text-gray-400">Allow extending the lock period</p>
                            </div>
                            <Switch 
                              checked={timeExtensionEnabled}
                              onCheckedChange={setTimeExtensionEnabled}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="early-access-fee" className="text-xs">Early Access Fee</Label>
                              <span className="text-xs text-gray-400">{earlyAccessFee} tokens</span>
                            </div>
                            <Slider
                              id="early-access-fee"
                              min={0}
                              max={100}
                              step={1}
                              value={[earlyAccessFee]}
                              onValueChange={(value) => setEarlyAccessFee(value[0])}
                              className="py-4"
                            />
                            <p className="text-xs text-gray-400">
                              Set a fee to enable early access (0 = disabled).
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between py-4 bg-[#1A1A1A]/80 border-t border-[#333]">
                    <Button
                      variant="outline" 
                      onClick={prevStep}
                      className="border-[#393939]"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    <Button 
                      onClick={nextStep}
                      className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5500AC] hover:to-[#E741DE] text-white border-none"
                    >
                      Continue to Memories
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Memory Content */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-[#1A1A1A] border-[#333] shadow-xl overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#6B00D7]/10 to-transparent pointer-events-none"></div>
                  
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center">
                        <Image className="h-4 w-4 text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold">Memory Content</CardTitle>
                    </div>
                    <CardDescription className="ml-10">
                      Add photos, videos, and personal messages to your time capsule.
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <Tabs defaultValue="media" className="w-full">
                      <TabsList className="grid grid-cols-2 mb-4">
                        <TabsTrigger value="media">Media Files</TabsTrigger>
                        <TabsTrigger value="message">Personal Message</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="media" className="space-y-6">
                        {/* Media upload section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card className="bg-[#252525] border-[#333] overflow-hidden">
                            <CardHeader className="py-3">
                              <CardTitle className="text-sm font-medium">Photos</CardTitle>
                            </CardHeader>
                            <CardContent className="pb-3 space-y-2">
                              <div className="border-2 border-dashed border-[#333] hover:border-[#6B00D7]/50 rounded-lg p-4 text-center transition-colors cursor-pointer" onClick={() => handleMediaUpload('image')}>
                                <Image className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                                <p className="text-sm text-gray-300">Click to upload images</p>
                                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                              </div>
                              <div className="text-xs text-gray-400 flex items-center justify-between">
                                <span>Uploaded images: {uploadedImages}</span>
                                <Badge variant="outline" className="text-[#FF5AF7] border-[#6B00D7]/30 bg-[#6B00D7]/10">
                                  {uploadedImages > 0 ? 'Quantum encrypted' : 'No images'}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-[#252525] border-[#333] overflow-hidden">
                            <CardHeader className="py-3">
                              <CardTitle className="text-sm font-medium">Videos</CardTitle>
                            </CardHeader>
                            <CardContent className="pb-3 space-y-2">
                              <div className="border-2 border-dashed border-[#333] hover:border-[#6B00D7]/50 rounded-lg p-4 text-center transition-colors cursor-pointer" onClick={() => handleMediaUpload('video')}>
                                <Video className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                                <p className="text-sm text-gray-300">Click to upload videos</p>
                                <p className="text-xs text-gray-500 mt-1">MP4, MOV up to 100MB</p>
                              </div>
                              <div className="text-xs text-gray-400 flex items-center justify-between">
                                <span>Uploaded videos: {uploadedVideos}</span>
                                <Badge variant="outline" className="text-[#FF5AF7] border-[#6B00D7]/30 bg-[#6B00D7]/10">
                                  {uploadedVideos > 0 ? 'Quantum encrypted' : 'No videos'}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                        
                        {/* Uploaded files list */}
                        {mediaItems.length > 0 && (
                          <div className="space-y-2">
                            <h3 className="text-sm font-medium">Uploaded Files</h3>
                            <div className="bg-[#1d1d1d] rounded-lg border border-[#333] overflow-hidden">
                              <div className="max-h-[200px] overflow-y-auto">
                                {mediaItems.map((item) => (
                                  <div key={item.id} className="flex items-center p-3 border-b border-[#333] last:border-0">
                                    <div className="mr-3">
                                      {item.type === 'image' ? (
                                        <Image className="h-5 w-5 text-blue-400" />
                                      ) : (
                                        <Video className="h-5 w-5 text-pink-400" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium truncate">{item.name}</p>
                                      <div className="flex items-center text-xs text-gray-400">
                                        <span className="mr-2">{item.size}</span>
                                        <span className={`
                                          ${item.status === 'uploading' ? 'text-yellow-400' : ''}
                                          ${item.status === 'encrypted' ? 'text-blue-400' : ''}
                                          ${item.status === 'stored' ? 'text-green-400' : ''}
                                        `}>
                                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                        </span>
                                      </div>
                                      {item.status !== 'stored' && (
                                        <div className="w-full h-1 bg-[#333] rounded-full mt-1">
                                          <div 
                                            className="h-1 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] rounded-full"
                                            style={{ width: `${item.progress}%` }}
                                          ></div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="message" className="space-y-6">
                        {/* Personal message section */}
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Your Personal Message</Label>
                            <Textarea
                              placeholder="Write a message to be unlocked in the future..."
                              value={personalMessage}
                              onChange={(e) => setPersonalMessage(e.target.value)}
                              className="min-h-[150px] bg-[#252525] border-[#333]"
                            />
                            <p className="text-xs text-gray-400">
                              This message will remain encrypted until your vault unlocks.
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Message Security</Label>
                            <Select
                              value={messageEncryption}
                              onValueChange={(value: "standard" | "quantum") => setMessageEncryption(value)}
                            >
                              <SelectTrigger className="bg-[#252525] border-[#333]">
                                <SelectValue placeholder="Select encryption level" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="standard">Standard Encryption</SelectItem>
                                <SelectItem value="quantum">Quantum-Resistant Encryption</SelectItem>
                              </SelectContent>
                            </Select>
                            <p className="text-xs text-gray-400">
                              {messageEncryption === "quantum" 
                                ? "Highest level of protection using lattice-based algorithms resistant to quantum computers." 
                                : "Strong industry-standard encryption suitable for most personal messages."}
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Message Expiry</Label>
                            <RadioGroup 
                              value={messageExpiry}
                              onValueChange={(value: "never" | "with-vault" | "custom") => setMessageExpiry(value)}
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="never" id="never" />
                                <Label htmlFor="never">Never (permanent)</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="with-vault" id="with-vault" />
                                <Label htmlFor="with-vault">Same as vault access window</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="custom" id="custom" />
                                <Label htmlFor="custom">Custom period after unlock</Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between py-4 bg-[#1A1A1A]/80 border-t border-[#333]">
                    <Button
                      variant="outline" 
                      onClick={prevStep}
                      className="border-[#393939]"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    <Button 
                      onClick={nextStep}
                      className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5500AC] hover:to-[#E741DE] text-white border-none"
                    >
                      Continue to Access
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )}

            {/* Step 4: Access Configuration */}
            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-[#1A1A1A] border-[#333] shadow-xl overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#6B00D7]/10 to-transparent pointer-events-none"></div>
                  
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center">
                        <Users className="h-4 w-4 text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold">Access Control</CardTitle>
                    </div>
                    <CardDescription className="ml-10">
                      Set permissions for who can access your memories in the future.
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="beneficiary-input">Beneficiary Address or Email</Label>
                          <Input
                            id="beneficiary-input"
                            placeholder={beneficiaryType === "wallet" ? "0x... or user.ton" : "email@example.com"}
                            value={beneficiaryInput}
                            onChange={(e) => setBeneficiaryInput(e.target.value)}
                            className="bg-[#252525] border-[#333]"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="beneficiary-type">Type</Label>
                          <Select
                            value={beneficiaryType}
                            onValueChange={(value: "wallet" | "email") => setBeneficiaryType(value)}
                          >
                            <SelectTrigger id="beneficiary-type" className="bg-[#252525] border-[#333]">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="wallet">Wallet Address</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Permissions</Label>
                        <div className="flex flex-wrap gap-2">
                          {(["view", "extract", "modify", "delete"] as const).map((permission) => (
                            <Button
                              key={permission}
                              variant="outline"
                              size="sm"
                              className={`px-3 py-1 capitalize ${
                                selectedPermissions.includes(permission)
                                  ? "bg-[#6B00D7]/20 border-[#FF5AF7] text-[#FF5AF7]"
                                  : "bg-[#252525] border-[#333] text-gray-400"
                              }`}
                              onClick={() => {
                                if (selectedPermissions.includes(permission)) {
                                  setSelectedPermissions(selectedPermissions.filter(p => p !== permission));
                                } else {
                                  setSelectedPermissions([...selectedPermissions, permission]);
                                }
                              }}
                            >
                              {permission}
                            </Button>
                          ))}
                        </div>
                        <p className="text-xs text-gray-400">
                          View: Can see content • Extract: Can download • Modify: Can change settings • Delete: Can remove the vault
                        </p>
                      </div>

                      <Button 
                        onClick={addBeneficiary} 
                        disabled={!beneficiaryInput}
                        className="bg-[#252525] border border-[#333] hover:bg-[#333] hover:text-white"
                      >
                        Add Beneficiary
                      </Button>
                    </div>

                    {beneficiaries.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Beneficiary List</h3>
                        <div className="bg-[#1d1d1d] rounded-lg border border-[#333] overflow-hidden">
                          <div className="max-h-[200px] overflow-y-auto">
                            {beneficiaries.map((beneficiary) => (
                              <div key={beneficiary.id} className="flex items-center justify-between p-3 border-b border-[#333] last:border-0">
                                <div className="flex items-center space-x-3">
                                  <div className="h-8 w-8 rounded-full bg-[#252525] flex items-center justify-center">
                                    {beneficiary.type === "wallet" ? (
                                      <Key className="h-4 w-4 text-[#FF5AF7]" />
                                    ) : (
                                      <span className="text-[#FF5AF7]">@</span>
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">{beneficiary.address}</p>
                                    <div className="flex items-center text-xs text-gray-400 space-x-1">
                                      <span>{beneficiary.type}</span>
                                      <span>•</span>
                                      <span>{beneficiary.permissions.join(", ")}</span>
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-gray-400 hover:text-white"
                                  onClick={() => removeBeneficiary(beneficiary.id)}
                                >
                                  ✕
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="p-4 rounded-lg bg-[#252525]/70 border border-[#333] space-y-3">
                      <h3 className="text-sm font-semibold flex items-center">
                        <Key className="h-4 w-4 mr-2 text-[#FF5AF7]" />
                        Recovery Settings
                      </h3>
                      
                      <div className="space-y-2">
                        <Label>Recovery Method</Label>
                        <Select
                          value={recoveryOption}
                          onValueChange={setRecoveryOption}
                        >
                          <SelectTrigger className="bg-[#252525] border-[#333]">
                            <SelectValue placeholder="Select recovery method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="social">Social Recovery</SelectItem>
                            <SelectItem value="geo">Geolocation Verification</SelectItem>
                            <SelectItem value="multi">Multi-Signature Recovery</SelectItem>
                            <SelectItem value="quantum">Quantum-Secure Backup Key</SelectItem>
                            <SelectItem value="customRecovery">Custom Recovery Logic</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-400">
                          {recoveryOption === "social" && "Trusted friends or family can help recover access."}
                          {recoveryOption === "geo" && "Require physical presence at specific locations to unlock."}
                          {recoveryOption === "multi" && "Multiple signatures required to regain access."}
                          {recoveryOption === "quantum" && "Use a quantum-resistant backup key for recovery."}
                          {recoveryOption === "customRecovery" && "Define custom conditions for recovery."}
                        </p>
                      </div>
                      
                      {recoveryOption === "social" && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="recovery-threshold" className="text-xs">Recovery Threshold</Label>
                            <span className="text-xs text-gray-400">{recoveryThreshold} guardians</span>
                          </div>
                          <Slider
                            id="recovery-threshold"
                            min={1}
                            max={5}
                            step={1}
                            value={[recoveryThreshold]}
                            onValueChange={(value) => setRecoveryThreshold(value[0])}
                            className="py-4"
                          />
                          <p className="text-xs text-gray-400">
                            Number of guardians required to recover access.
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between py-4 bg-[#1A1A1A]/80 border-t border-[#333]">
                    <Button
                      variant="outline" 
                      onClick={prevStep}
                      className="border-[#393939]"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    <Button 
                      onClick={nextStep}
                      className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5500AC] hover:to-[#E741DE] text-white border-none"
                    >
                      Continue to Security
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )}

            {/* Step 5: Security Configuration */}
            {step === 5 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-[#1A1A1A] border-[#333] shadow-xl overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#6B00D7]/10 to-transparent pointer-events-none"></div>
                  
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center">
                        <Shield className="h-4 w-4 text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold">Security Settings</CardTitle>
                    </div>
                    <CardDescription className="ml-10">
                      Configure advanced security options for your time-locked vault.
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="p-4 rounded-lg bg-[#252525]/70 border border-[#333] space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold flex items-center">
                          <ShieldCheck className="h-4 w-4 mr-2 text-[#FF5AF7]" />
                          Security Analysis
                        </h3>
                        <SecurityBadge score={securityScore} />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span>Security Score</span>
                          <span className={getSecurityColor()}>{securityScore}/100</span>
                        </div>
                        <SecurityMeter score={securityScore} />
                      </div>
                      
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="security-details" className="border-b-0">
                          <AccordionTrigger className="text-xs py-2 hover:no-underline">
                            View Detailed Analysis
                          </AccordionTrigger>
                          <AccordionContent className="space-y-3 pb-2">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="p-3 rounded bg-[#242424] text-xs">
                                <div className="flex items-center text-gray-300 mb-1">
                                  <Diamond className="h-3 w-3 mr-1 text-blue-400" />
                                  <span>Storage Redundancy</span>
                                </div>
                                <span className="text-sm font-medium">
                                  {storageRedundancy === "standard" ? "Basic" : 
                                   storageRedundancy === "enhanced" ? "Strong" : "Excellent"}
                                </span>
                              </div>
                              
                              <div className="p-3 rounded bg-[#242424] text-xs">
                                <div className="flex items-center text-gray-300 mb-1">
                                  <Timer className="h-3 w-3 mr-1 text-purple-400" />
                                  <span>Est. Vault Lifespan</span>
                                </div>
                                <span className="text-sm font-medium">
                                  {memoryVaultAnalytics.estimatedLifespan} years
                                </span>
                              </div>
                              
                              <div className="p-3 rounded bg-[#242424] text-xs">
                                <div className="flex items-center text-gray-300 mb-1">
                                  <Layers className="h-3 w-3 mr-1 text-emerald-400" />
                                  <span>Backup Redundancy</span>
                                </div>
                                <span className="text-sm font-medium">
                                  {memoryVaultAnalytics.backupRedundancy}%
                                </span>
                              </div>
                              
                              <div className="p-3 rounded bg-[#242424] text-xs">
                                <div className="flex items-center text-gray-300 mb-1">
                                  <Network className="h-3 w-3 mr-1 text-orange-400" />
                                  <span>Security Level</span>
                                </div>
                                <span className="text-sm font-medium">
                                  {getSecurityLevel()}
                                </span>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold">Encryption Settings</h3>
                      
                      <RadioGroup 
                        value={encryptionStrength}
                        onValueChange={(value: "standard" | "enhanced" | "quantum") => setEncryptionStrength(value)}
                        className="grid grid-cols-1 md:grid-cols-3 gap-3"
                      >
                        <div className={`rounded-lg border p-3 flex flex-col gap-1 ${
                          encryptionStrength === 'standard' 
                            ? 'bg-[#252525]/70 border-[#6B00D7] text-white' 
                            : 'bg-[#1d1d1d] border-[#333] text-gray-300'
                        }`}>
                          <div className="flex items-start gap-2">
                            <RadioGroupItem value="standard" id="standard" className="mt-1" />
                            <div>
                              <Label htmlFor="standard" className="font-medium">Standard</Label>
                              <p className="text-xs text-gray-400 mt-1">256-bit AES encryption</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className={`rounded-lg border p-3 flex flex-col gap-1 ${
                          encryptionStrength === 'enhanced' 
                            ? 'bg-[#252525]/70 border-[#6B00D7] text-white' 
                            : 'bg-[#1d1d1d] border-[#333] text-gray-300'
                        }`}>
                          <div className="flex items-start gap-2">
                            <RadioGroupItem value="enhanced" id="enhanced" className="mt-1" />
                            <div>
                              <Label htmlFor="enhanced" className="font-medium">Enhanced</Label>
                              <p className="text-xs text-gray-400 mt-1">Multi-layered encryption with enhanced protocols</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className={`rounded-lg border p-3 flex flex-col gap-1 ${
                          encryptionStrength === 'quantum' 
                            ? 'bg-[#252525]/70 border-[#6B00D7] text-white' 
                            : 'bg-[#1d1d1d] border-[#333] text-gray-300'
                        }`}>
                          <div className="flex items-start gap-2">
                            <RadioGroupItem value="quantum" id="quantum" className="mt-1" />
                            <div>
                              <Label htmlFor="quantum" className="font-medium">Quantum-Resistant</Label>
                              <p className="text-xs text-gray-400 mt-1">Future-proof against quantum computing attacks</p>
                            </div>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold">Storage Options</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">Enable Cross-Chain Backup</Label>
                            <Switch 
                              checked={enableCrossChainBackup}
                              onCheckedChange={setEnableCrossChainBackup}
                            />
                          </div>
                          <p className="text-xs text-gray-400">
                            Backup your data across multiple blockchains for enhanced security.
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">Permanent Storage</Label>
                            <Switch 
                              checked={permanentStorage}
                              onCheckedChange={setPermanentStorage}
                            />
                          </div>
                          <p className="text-xs text-gray-400">
                            Keep your data permanently stored, even after unlocking.
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm">Storage Providers</Label>
                        <div className="flex flex-wrap gap-2">
                          {['arweave', 'ipfs', 'filecoin', 'sia'].map((provider) => (
                            <Button
                              key={provider}
                              variant="outline"
                              size="sm"
                              className={`px-3 py-1 capitalize ${
                                selectedStorageProviders.includes(provider)
                                  ? "bg-[#6B00D7]/20 border-[#FF5AF7] text-[#FF5AF7]"
                                  : "bg-[#252525] border-[#333] text-gray-400"
                              }`}
                              onClick={() => {
                                if (selectedStorageProviders.includes(provider)) {
                                  setSelectedStorageProviders(
                                    selectedStorageProviders.filter(p => p !== provider)
                                  );
                                } else {
                                  setSelectedStorageProviders([...selectedStorageProviders, provider]);
                                }
                              }}
                            >
                              {provider}
                            </Button>
                          ))}
                        </div>
                        <p className="text-xs text-gray-400">
                          Select additional decentralized storage networks for your vault.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between py-4 bg-[#1A1A1A]/80 border-t border-[#333]">
                    <Button
                      variant="outline" 
                      onClick={prevStep}
                      className="border-[#393939]"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    <Button 
                      onClick={nextStep}
                      className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5500AC] hover:to-[#E741DE] text-white border-none"
                    >
                      Continue to Review
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )}

            {/* Step 6: Review and Create */}
            {step === 6 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-[#1A1A1A] border-[#333] shadow-xl overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#6B00D7]/10 to-transparent pointer-events-none"></div>
                  
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold">Review & Create Vault</CardTitle>
                    </div>
                    <CardDescription className="ml-10">
                      Review your time-locked memory vault settings before creation.
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Basic Information */}
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold flex items-center">
                          <Sparkles className="h-4 w-4 mr-2 text-[#FF5AF7]" />
                          Basic Information
                        </h3>
                        <div className="p-4 rounded-lg bg-[#252525]/50 border border-[#333] space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Vault Name</span>
                            <span className="font-medium">{vaultName || "Untitled Vault"}</span>
                          </div>
                          <Separator className="bg-[#333]" />
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Primary Blockchain</span>
                            <span className="font-medium">{primaryBlockchain}</span>
                          </div>
                          <Separator className="bg-[#333]" />
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Storage Redundancy</span>
                            <span className="font-medium capitalize">{storageRedundancy}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Time Lock Information */}
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-[#FF5AF7]" />
                          Time Lock Settings
                        </h3>
                        <div className="p-4 rounded-lg bg-[#252525]/50 border border-[#333] space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Unlock Method</span>
                            <span className="font-medium capitalize">{unlockMethod}</span>
                          </div>
                          {unlockDate && (
                            <>
                              <Separator className="bg-[#333]" />
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Unlock Date</span>
                                <span className="font-medium">{unlockDate}</span>
                              </div>
                            </>
                          )}
                          <Separator className="bg-[#333]" />
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Time Window</span>
                            <span className="font-medium">{timeWindow} hours</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Content Information */}
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold flex items-center">
                          <Image className="h-4 w-4 mr-2 text-[#FF5AF7]" />
                          Content Summary
                        </h3>
                        <div className="p-4 rounded-lg bg-[#252525]/50 border border-[#333] space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Photos</span>
                            <span className="font-medium">{uploadedImages} images</span>
                          </div>
                          <Separator className="bg-[#333]" />
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Videos</span>
                            <span className="font-medium">{uploadedVideos} videos</span>
                          </div>
                          <Separator className="bg-[#333]" />
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Message</span>
                            <span className="font-medium">{personalMessage ? "Included" : "None"}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Access Information */}
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold flex items-center">
                          <Users className="h-4 w-4 mr-2 text-[#FF5AF7]" />
                          Access Control
                        </h3>
                        <div className="p-4 rounded-lg bg-[#252525]/50 border border-[#333] space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Beneficiaries</span>
                            <span className="font-medium">{beneficiaries.length}</span>
                          </div>
                          <Separator className="bg-[#333]" />
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Recovery Method</span>
                            <span className="font-medium capitalize">{recoveryOption}</span>
                          </div>
                          {recoveryOption === "social" && (
                            <>
                              <Separator className="bg-[#333]" />
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Recovery Threshold</span>
                                <span className="font-medium">{recoveryThreshold} guardians</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold flex items-center">
                        <Shield className="h-4 w-4 mr-2 text-[#FF5AF7]" />
                        Security Overview
                      </h3>
                      <div className="p-4 rounded-lg bg-[#252525]/50 border border-[#333] space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full ${
                              securityScore >= 80 ? "bg-[#FF5AF7]" : 
                              securityScore >= 60 ? "bg-blue-400" : 
                              "bg-yellow-400"
                            } mr-2`}></div>
                            <span className="font-medium text-sm">{getSecurityLevel()} Security</span>
                          </div>
                          <span className={`text-sm ${getSecurityColor()}`}>{securityScore}/100</span>
                        </div>
                        
                        <SecurityMeter score={securityScore} />
                        
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="space-y-1">
                            <span className="text-gray-400">Encryption</span>
                            <div className="font-medium capitalize">{encryptionStrength}</div>
                          </div>
                          
                          <div className="space-y-1">
                            <span className="text-gray-400">Cross-Chain</span>
                            <div className="font-medium">{enableCrossChainBackup ? "Enabled" : "Disabled"}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Alert className="bg-[#6B00D7]/10 border border-[#FF5AF7]/30 text-[#FF5AF7]">
                      <ShieldCheck className="h-4 w-4" />
                      <AlertTitle>Ready for Creation</AlertTitle>
                      <AlertDescription className="text-gray-300">
                        Your Time-Locked Memory Vault will be created with {getSecurityLevel().toLowerCase()} security. Once created, some settings cannot be changed.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between py-4 bg-[#1A1A1A]/80 border-t border-[#333]">
                    <Button
                      variant="outline" 
                      onClick={prevStep}
                      className="border-[#393939]"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    <Button 
                      onClick={createVault}
                      disabled={isProcessing}
                      className="relative overflow-hidden bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5500AC] hover:to-[#E741DE] text-white border-none min-w-[150px]"
                    >
                      {isProcessing ? (
                        <>
                          <div 
                            className="absolute inset-0 bg-black bg-opacity-20" 
                            style={{ 
                              clipPath: `polygon(0 0, ${processingProgress}% 0, ${processingProgress}% 100%, 0 100%)` 
                            }}
                          ></div>
                          <span>Processing... {processingProgress}%</span>
                        </>
                      ) : (
                        <>
                          Create Memory Vault
                          <Shield className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )}
          </div>
          
          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Security Score Card */}
              <Card className="bg-[#1A1A1A] border-[#333] overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-[#FF5AF7]" />
                    Security Score
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="flex items-center space-x-4 mb-2">
                    <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
                      {securityScore}
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">{getSecurityLevel()} Security</div>
                      <div className="text-xs text-gray-400">
                        {securityScore >= 80 ? "Top-tier protection" : 
                         securityScore >= 60 ? "Strong protection" : 
                         "Basic protection"}
                      </div>
                    </div>
                  </div>
                  <SecurityMeter score={securityScore} />
                </CardContent>
              </Card>
              
              {/* Currently Editing Card */}
              <Card className="bg-[#1A1A1A] border-[#333] overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-[#FF5AF7]" />
                    Currently Editing
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-400">Step {step} of 6</div>
                      <div className="text-lg font-medium">
                        {step === 1 && "Vault Basics"}
                        {step === 2 && "Time Lock Settings"}
                        {step === 3 && "Memory Content"}
                        {step === 4 && "Access Control"}
                        {step === 5 && "Security Settings"}
                        {step === 6 && "Review & Create"}
                      </div>
                      <p className="text-xs text-gray-400">
                        {step === 1 && "Define the basic details and structure of your memory vault."}
                        {step === 2 && "Set when and how your memories will be unlocked."}
                        {step === 3 && "Add images, videos, and personal messages to preserve."}
                        {step === 4 && "Control who can access your memories in the future."}
                        {step === 5 && "Configure advanced security and storage options."}
                        {step === 6 && "Review all settings and create your memory vault."}
                      </p>
                    </div>
                    
                    <div className="h-1 w-full bg-[#252525] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]" 
                        style={{ width: `${(step / 6) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Features and Tips */}
              <Card className="bg-[#1A1A1A] border-[#333] overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Diamond className="h-5 w-5 mr-2 text-[#FF5AF7]" />
                    Features & Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <HardDrive className="h-3 w-3 text-[#FF5AF7]" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium">Cross-Chain Storage</h4>
                        <p className="text-xs text-gray-400">
                          Your memories are backed up across multiple blockchains for maximum security and redundancy.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Key className="h-3 w-3 text-[#FF5AF7]" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium">Quantum-Resistant Encryption</h4>
                        <p className="text-xs text-gray-400">
                          Future-proof your memories with encryption that can withstand quantum computing attacks.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Users className="h-3 w-3 text-[#FF5AF7]" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium">Social Recovery</h4>
                        <p className="text-xs text-gray-400">
                          Designate trusted guardians who can help recover access to your vault if needed.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}