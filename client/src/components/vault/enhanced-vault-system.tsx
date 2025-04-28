import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Gift, Clock, Lock, Unlock, Sparkles, Layers, 
  Users, Key, Landmark, RotateCcw, Diamond, RefreshCw, Send
} from 'lucide-react';
import { useEthereum } from '@/contexts/ethereum-context';
import { useSolana } from '@/contexts/solana-context';
import { useTon } from '@/contexts/ton-context';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EnhancedMediaUploader } from "@/components/attachments/enhanced-media-uploader";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Advanced vault creation schema with gift functionality
const vaultFormSchema = z.object({
  // Basic vault info
  name: z.string().min(3, {
    message: "Vault name must be at least 3 characters.",
  }),
  description: z.string().optional(),
  
  // Financial settings
  vaultType: z.enum([
    "standard", 
    "gift", 
    "inheritance", 
    "timelock", 
    "milestone", 
    "multisig", 
    "recurring", 
    "halving",
    "cross-chain"
  ]),
  assetType: z.string().min(1, {
    message: "Asset type is required",
  }),
  assetAmount: z.string().min(1, {
    message: "Amount is required",
  }).refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Amount must be a positive number",
  }),
  
  // Time settings
  unlockStrategy: z.enum([
    "date", 
    "blocks", 
    "price", 
    "event", 
    "hybrid", 
    "manual", 
    "inheritance"
  ]),
  unlockDate: z.date().refine(date => date > new Date(), {
    message: "Unlock date must be in the future",
  }),
  timeLockPeriod: z.number().min(1, {
    message: "Time lock period must be at least 1 day",
  }),
  
  // Gift specific fields
  isGift: z.boolean().default(false),
  recipientAddress: z.string().optional(),
  giftMessage: z.string().optional(),
  sendImmediately: z.boolean().default(false),
  
  // Security features
  securityLevel: z.enum(["standard", "enhanced", "maximum"]).default("standard"),
  requireMultisig: z.boolean().default(false),
  multiSigThreshold: z.number().optional(),
  enableGeolocation: z.boolean().default(false),
  enableBiometrics: z.boolean().default(false),
  
  // Advanced settings
  networkChain: z.string(),
  recurringDeposit: z.boolean().default(false),
  recurringDepositAmount: z.string().optional(),
  recurringDepositPeriod: z.string().optional(),
  
  // Content
  includeAttachments: z.boolean().default(false),
  allowBeneficiaries: z.boolean().default(false),
  
  // Metadata for advanced features
  metadata: z.record(z.any()).optional(),
});

type VaultFormValues = z.infer<typeof vaultFormSchema>;

// Network chains supported by the platform
const SUPPORTED_NETWORKS = [
  { id: "ethereum", name: "Ethereum", icon: "⟠", color: "#62688F" },
  { id: "ton", name: "TON Network", icon: "💎", color: "#0098EA" },
  { id: "solana", name: "Solana", icon: "◎", color: "#9945FF" },
  { id: "bitcoin", name: "Bitcoin", icon: "₿", color: "#F7931A" },
  { id: "polygon", name: "Polygon", icon: "Ⓜ️", color: "#8247E5" },
  { id: "arbitrum", name: "Arbitrum", icon: "⚖️", color: "#28A0F0" },
  { id: "optimism", name: "Optimism", icon: "⚡", color: "#FF0420" },
  { id: "avalanche", name: "Avalanche", icon: "🔺", color: "#E84142" },
];

// Vault types with descriptions
const VAULT_TYPES = [
  { 
    id: "standard", 
    name: "Standard Vault", 
    description: "A basic time-locked vault for securely storing assets.",
    icon: <Lock className="h-5 w-5" />,
    color: "#6B00D7"
  },
  { 
    id: "gift", 
    name: "Gift Vault", 
    description: "Send crypto gifts to friends and family with optional time-locking.",
    icon: <Gift className="h-5 w-5" />,
    color: "#FF5AF7",
    highlight: true
  },
  { 
    id: "inheritance", 
    name: "Inheritance Vault", 
    description: "Create a digital inheritance plan for your crypto assets.",
    icon: <Landmark className="h-5 w-5" />,
    color: "#4A90E2"
  },
  { 
    id: "timelock", 
    name: "Deep Time Vault", 
    description: "Lock assets for very long periods with enhanced security.",
    icon: <Clock className="h-5 w-5" />,
    color: "#2ECC71"
  },
  { 
    id: "milestone", 
    name: "Milestone Vault", 
    description: "Unlock portions of assets when specific milestones are reached.",
    icon: <Layers className="h-5 w-5" />,
    color: "#E67E22"
  },
  { 
    id: "multisig", 
    name: "Multi-Signature Vault", 
    description: "Require multiple approvals to unlock the vault.",
    icon: <Users className="h-5 w-5" />,
    color: "#9B59B6"
  },
  { 
    id: "recurring", 
    name: "Recurring Vault", 
    description: "Set up recurring deposits or withdrawals on a schedule.",
    icon: <RotateCcw className="h-5 w-5" />,
    color: "#34495E"
  },
  { 
    id: "halving", 
    name: "Bitcoin Halving Vault", 
    description: "Automatically unlock based on Bitcoin halving events.",
    icon: <RefreshCw className="h-5 w-5" />,
    color: "#F7931A"
  },
  { 
    id: "cross-chain", 
    name: "Cross-Chain Vault", 
    description: "Enable assets to move between different blockchains.",
    icon: <Diamond className="h-5 w-5" />,
    color: "#16A085"
  },
];

// Unlock strategies
const UNLOCK_STRATEGIES = [
  { id: "date", name: "Date & Time", description: "Unlock on a specific date and time" },
  { id: "blocks", name: "Block Height", description: "Unlock after a specific blockchain block height is reached" },
  { id: "price", name: "Price Target", description: "Unlock when an asset reaches a target price" },
  { id: "event", name: "Blockchain Event", description: "Unlock based on specific blockchain events" },
  { id: "hybrid", name: "Hybrid Conditions", description: "Unlock based on multiple conditions" },
  { id: "manual", name: "Manual Verification", description: "Require manual verification to unlock" },
  { id: "inheritance", name: "Inheritance Protocol", description: "Special protocol for inheritance vaults" },
];

// Security levels
const SECURITY_LEVELS = [
  { 
    id: "standard", 
    name: "Standard Security",
    description: "Basic security features with wallet authentication.",
    features: ["Wallet Signature", "Timelock", "Secure Storage"]
  },
  { 
    id: "enhanced", 
    name: "Enhanced Security",
    description: "Advanced security with multi-factor authentication.",
    features: ["Multi-signature", "Scheduled Alerts", "Activity Logs", "Anti-phishing"]
  },
  { 
    id: "maximum", 
    name: "Maximum Security",
    description: "Military-grade security with advanced features.",
    features: ["Hardware Key Support", "Biometric Verification", "Geolocation Lock", "Duress Protection", "Advanced Encryption"]
  },
];

interface ChainAsset {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  chains: string[];
}

// Some example assets for different chains
const CHAIN_ASSETS: ChainAsset[] = [
  { id: "eth", name: "Ethereum", symbol: "ETH", icon: "⟠", chains: ["ethereum"] },
  { id: "ton", name: "Toncoin", symbol: "TON", icon: "💎", chains: ["ton"] },
  { id: "sol", name: "Solana", symbol: "SOL", icon: "◎", chains: ["solana"] },
  { id: "btc", name: "Bitcoin", symbol: "BTC", icon: "₿", chains: ["bitcoin"] },
  { id: "matic", name: "Polygon", symbol: "MATIC", icon: "Ⓜ️", chains: ["polygon"] },
  { id: "arb", name: "Arbitrum", symbol: "ARB", icon: "⚖️", chains: ["arbitrum"] },
  { id: "op", name: "Optimism", symbol: "OP", icon: "⚡", chains: ["optimism"] },
  { id: "avax", name: "Avalanche", symbol: "AVAX", icon: "🔺", chains: ["avalanche"] },
  { id: "usdt", name: "Tether", symbol: "USDT", icon: "₮", chains: ["ethereum", "solana", "polygon", "arbitrum", "optimism", "avalanche"] },
  { id: "usdc", name: "USD Coin", symbol: "USDC", icon: "💲", chains: ["ethereum", "solana", "polygon", "arbitrum", "optimism", "avalanche"] },
  { id: "dai", name: "Dai", symbol: "DAI", icon: "◈", chains: ["ethereum", "polygon", "arbitrum", "optimism"] },
  { id: "cvt", name: "Chronos Vault Token", symbol: "CVT", icon: "🔒", chains: ["ethereum", "solana", "ton"] },
];

interface EnhancedVaultSystemProps {
  userId: number;
  onVaultCreated?: (vault: any) => void;
  defaultVaultType?: string;
  initialGiftRecipient?: string;
  defaultChain?: string;
}

export function EnhancedVaultSystem({
  userId,
  onVaultCreated,
  defaultVaultType = "standard",
  initialGiftRecipient,
  defaultChain = "ethereum"
}: EnhancedVaultSystemProps) {
  const { toast } = useToast();
  const { isConnected: isEthConnected, connect: connectEth, walletInfo: ethWallet } = useEthereum();
  const { isConnected: isSolConnected, connect: connectSol } = useSolana();
  const { isConnected: isTonConnected, connect: connectTon } = useTon();
  
  const [attachments, setAttachments] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [vaultPreviewVisible, setVaultPreviewVisible] = useState(false);
  const [securityScore, setSecurityScore] = useState(65);
  const [selectedTab, setSelectedTab] = useState("configuration");
  const [beneficiaries, setBeneficiaries] = useState<{address: string, share: number}[]>([]);
  const [showSecurityWarning, setShowSecurityWarning] = useState(false);
  
  const defaultValues: Partial<VaultFormValues> = {
    name: "",
    description: "",
    vaultType: defaultVaultType as any,
    assetType: "",
    assetAmount: "",
    unlockStrategy: "date",
    unlockDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 days from now
    timeLockPeriod: 30,
    isGift: defaultVaultType === "gift",
    recipientAddress: initialGiftRecipient || "",
    securityLevel: "standard",
    networkChain: defaultChain,
    includeAttachments: false,
    allowBeneficiaries: false,
    requireMultisig: false,
    enableGeolocation: false,
    enableBiometrics: false,
    recurringDeposit: false,
  };
  
  // Initialize the form
  const form = useForm<VaultFormValues>({
    resolver: zodResolver(vaultFormSchema),
    defaultValues,
  });
  
  // Watch form values for real-time updates
  const watchVaultType = form.watch("vaultType");
  const watchIsGift = form.watch("isGift");
  const watchNetworkChain = form.watch("networkChain");
  const watchSecurityLevel = form.watch("securityLevel");
  const watchRequireMultisig = form.watch("requireMultisig");
  const watchAllowBeneficiaries = form.watch("allowBeneficiaries");
  const watchIncludeAttachments = form.watch("includeAttachments");
  const watchSendImmediately = form.watch("sendImmediately");
  
  // Update form values when defaultVaultType changes
  useEffect(() => {
    if (defaultVaultType === "gift" && !form.getValues("isGift")) {
      form.setValue("isGift", true);
    }
  }, [defaultVaultType, form]);
  
  // Update recipient address when initialGiftRecipient changes
  useEffect(() => {
    if (initialGiftRecipient && initialGiftRecipient !== form.getValues("recipientAddress")) {
      form.setValue("recipientAddress", initialGiftRecipient);
    }
  }, [initialGiftRecipient, form]);
  
  // Handle vault type selection to update default settings
  useEffect(() => {
    if (watchVaultType === "gift" && !form.getValues("isGift")) {
      form.setValue("isGift", true);
    }
    
    if (watchVaultType === "multisig" && !form.getValues("requireMultisig")) {
      form.setValue("requireMultisig", true);
      form.setValue("multiSigThreshold", 2);
    }
    
    if (watchVaultType === "inheritance" && !form.getValues("allowBeneficiaries")) {
      form.setValue("allowBeneficiaries", true);
    }
    
    if (watchVaultType === "recurring" && !form.getValues("recurringDeposit")) {
      form.setValue("recurringDeposit", true);
    }
    
    // Update security score
    calculateSecurityScore();
  }, [watchVaultType, form]);
  
  // Calculate security score based on selected options
  const calculateSecurityScore = () => {
    let score = 65; // Base score
    
    // Add points for security features
    if (watchSecurityLevel === "enhanced") score += 10;
    if (watchSecurityLevel === "maximum") score += 20;
    if (watchRequireMultisig) score += 15;
    if (form.getValues("enableGeolocation")) score += 5;
    if (form.getValues("enableBiometrics")) score += 10;
    
    // Time-lock factor
    const timeLockPeriod = form.getValues("timeLockPeriod");
    if (timeLockPeriod > 365) score += 10;
    else if (timeLockPeriod > 180) score += 5;
    
    // Cap at 100
    score = Math.min(100, score);
    
    setSecurityScore(score);
    
    // Show security warning for low scores
    setShowSecurityWarning(score < 70);
  };
  
  // Update security score when relevant fields change
  useEffect(() => {
    calculateSecurityScore();
  }, [watchSecurityLevel, watchRequireMultisig, form.watch("enableGeolocation"), form.watch("enableBiometrics"), form.watch("timeLockPeriod")]);
  
  // Filter assets based on selected chain
  const chainAssets = CHAIN_ASSETS.filter(asset => 
    asset.chains.includes(watchNetworkChain)
  );
  
  // Check if the selected chain's wallet is connected
  const isChainWalletConnected = () => {
    switch(watchNetworkChain) {
      case "ethereum":
        return isEthConnected;
      case "solana":
        return isSolConnected;
      case "ton":
        return isTonConnected;
      default:
        return false;
    }
  };
  
  // Connect to the wallet for the selected chain
  const connectChainWallet = async () => {
    switch(watchNetworkChain) {
      case "ethereum":
        await connectEth();
        break;
      case "solana":
        await connectSol();
        break;
      case "ton":
        await connectTon();
        break;
      default:
        toast({
          title: "Wallet not supported",
          description: `${watchNetworkChain} wallet connection is not yet supported.`,
          variant: "destructive",
        });
    }
  };
  
  // Handle attachment upload
  const handleAttachmentUpload = (attachment: any) => {
    setAttachments(prev => [...prev, attachment]);
    toast({
      title: "File uploaded",
      description: "Your file has been uploaded successfully.",
    });
  };
  
  // Add beneficiary
  const addBeneficiary = (address: string, share: number) => {
    setBeneficiaries(prev => [...prev, { address, share }]);
  };
  
  // Remove beneficiary
  const removeBeneficiary = (index: number) => {
    setBeneficiaries(prev => prev.filter((_, i) => i !== index));
  };
  
  // Form submission handler
  const onSubmit = async (values: VaultFormValues) => {
    setIsCreating(true);
    
    try {
      // Check if wallet is connected for the selected chain
      if (!isChainWalletConnected()) {
        await connectChainWallet();
        if (!isChainWalletConnected()) {
          throw new Error("Wallet connection required to create vault");
        }
      }
      
      // Create metadata object
      const metadata: Record<string, any> = {
        securityLevel: values.securityLevel,
        unlockStrategy: values.unlockStrategy,
        ...(values.isGift && {
          giftDetails: {
            recipientAddress: values.recipientAddress,
            message: values.giftMessage,
            sendImmediately: values.sendImmediately
          }
        }),
        ...(values.requireMultisig && {
          multiSig: {
            threshold: values.multiSigThreshold || 2,
            approvers: []
          }
        }),
        networkChain: values.networkChain,
        ...(values.recurringDeposit && {
          recurringDetails: {
            amount: values.recurringDepositAmount,
            period: values.recurringDepositPeriod
          }
        }),
        securityFeatures: {
          multiSig: values.requireMultisig,
          geolocation: values.enableGeolocation,
          biometrics: values.enableBiometrics
        },
        ...(beneficiaries.length > 0 && {
          beneficiaries: beneficiaries
        }),
        ...(attachments.length > 0 && {
          attachmentIds: attachments.map(a => a.id)
        }),
        securityScore,
      };
      
      // Prepare vault data
      const vaultData = {
        userId,
        name: values.name,
        description: values.description || "",
        vaultType: values.vaultType,
        assetType: values.assetType,
        assetAmount: values.assetAmount,
        timeLockPeriod: values.timeLockPeriod,
        unlockDate: values.unlockDate.toISOString(),
        metadata,
      };
      
      // Create the vault
      const vault = await apiRequest("POST", "/api/vaults", vaultData);
      
      // If this is a gift that should be sent immediately, send it
      if (values.isGift && values.sendImmediately) {
        // Different logic based on chain
        switch(values.networkChain) {
          case "ethereum":
            // Code to send ETH gift would go here
            // This would likely involve the Ethereum provider's send/transfer function
            break;
          case "solana":
            // Code to send SOL gift would go here
            break;
          case "ton":
            // Code to send TON gift would go here
            break;
          default:
            // Handle unsupported chains
        }
      }
      
      // Process beneficiaries if allowed
      if (values.allowBeneficiaries && beneficiaries.length > 0) {
        for (const beneficiary of beneficiaries) {
          await apiRequest("POST", "/api/beneficiaries", {
            vaultId: vault.id,
            name: "Beneficiary",
            walletAddress: beneficiary.address,
            share: beneficiary.share
          });
        }
      }
      
      // Process attachments if included
      if (values.includeAttachments && attachments.length > 0) {
        // Associate attachments with the vault (if they're not already)
        for (const attachment of attachments) {
          if (!attachment.vaultId) {
            await apiRequest("PUT", `/api/attachments/${attachment.id}`, {
              vaultId: vault.id
            });
          }
        }
      }
      
      // Show success toast
      toast({
        title: "Vault created successfully",
        description: values.isGift 
          ? "Your gift vault has been created and will be delivered according to your settings."
          : "Your vault has been created successfully.",
      });
      
      // Call the onVaultCreated callback if provided
      if (onVaultCreated) {
        onVaultCreated(vault);
      }
      
      // Reset the form
      form.reset();
      setAttachments([]);
      setBeneficiaries([]);
      
    } catch (error) {
      console.error("Vault creation error:", error);
      toast({
        title: "Error creating vault",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  // Get the button text based on form state
  const getButtonText = () => {
    if (isCreating) return "Creating Vault...";
    if (watchVaultType === "gift") return watchSendImmediately ? "Create & Send Gift" : "Create Gift Vault";
    return "Create Vault";
  };
  
  // Helper to get color based on security score
  const getSecurityColor = () => {
    if (securityScore >= 90) return "text-green-500";
    if (securityScore >= 70) return "text-yellow-500";
    return "text-red-500";
  };
  
  return (
    <div className="w-full max-w-5xl mx-auto">
      <Tabs 
        defaultValue="configuration" 
        className="w-full" 
        value={selectedTab}
        onValueChange={setSelectedTab}
      >
        <TabsList className="grid grid-cols-3 mb-6 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-1">
          <TabsTrigger 
            value="configuration"
            className="data-[state=active]:bg-[#6B00D7] data-[state=active]:text-white"
          >
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Configuration</span>
            </div>
          </TabsTrigger>
          
          <TabsTrigger 
            value="preview"
            className="data-[state=active]:bg-[#6B00D7] data-[state=active]:text-white"
            onClick={() => setVaultPreviewVisible(true)}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>Vault Preview</span>
            </div>
          </TabsTrigger>
          
          <TabsTrigger 
            value="security"
            className="data-[state=active]:bg-[#6B00D7] data-[state=active]:text-white"
          >
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>Security</span>
            </div>
          </TabsTrigger>
        </TabsList>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <TabsContent value="configuration" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Shield className="h-5 w-5 text-[#6B00D7]" />
                      Vault Configuration
                    </CardTitle>
                    <CardDescription>
                      Configure your new vault with the type and settings you need
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Basic vault settings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Vault Name</FormLabel>
                            <FormControl>
                              <Input placeholder="My Savings Vault" {...field} />
                            </FormControl>
                            <FormDescription>
                              A name to help you identify this vault
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="vaultType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Vault Type</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select vault type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {VAULT_TYPES.map((type) => (
                                  <SelectItem key={type.id} value={type.id}>
                                    <div className="flex items-center gap-2">
                                      <div 
                                        className="w-5 h-5 flex items-center justify-center" 
                                        style={{ color: type.color }}
                                      >
                                        {type.icon}
                                      </div>
                                      <span className="font-medium">{type.name}</span>
                                      {type.highlight && (
                                        <Badge variant="secondary" className="ml-1 bg-[#FF5AF7]/20 text-[#FF5AF7] text-[10px]">
                                          NEW
                                        </Badge>
                                      )}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              {VAULT_TYPES.find(type => type.id === watchVaultType)?.description || "Select a vault type"}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Add details about the purpose of this vault..." 
                              className="resize-none h-20" 
                              {...field} 
                              value={field.value || ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Network and asset selection */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold">Asset Configuration</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="networkChain"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Blockchain Network</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select blockchain" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {SUPPORTED_NETWORKS.map((network) => (
                                    <SelectItem key={network.id} value={network.id}>
                                      <div className="flex items-center gap-2">
                                        <span className="text-base">{network.icon}</span>
                                        <span className="font-medium">{network.name}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Select the blockchain network for this vault
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="assetType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Asset Type</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select asset" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {chainAssets.map((asset) => (
                                    <SelectItem key={asset.id} value={asset.id}>
                                      <div className="flex items-center gap-2">
                                        <span className="text-base">{asset.icon}</span>
                                        <span>{asset.name} ({asset.symbol})</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Select the asset to store in this vault
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="assetAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  type="text"
                                  placeholder="0.00" 
                                  {...field} 
                                />
                                {form.getValues("assetType") && (
                                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    {CHAIN_ASSETS.find(asset => asset.id === form.getValues("assetType"))?.symbol}
                                  </div>
                                )}
                              </div>
                            </FormControl>
                            <FormDescription>
                              Enter the amount to deposit in this vault
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {/* Timelock settings */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold">Time Lock Settings</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="unlockStrategy"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Unlock Strategy</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select unlock strategy" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {UNLOCK_STRATEGIES.map((strategy) => (
                                    <SelectItem key={strategy.id} value={strategy.id}>
                                      <div className="flex flex-col">
                                        <span className="font-medium">{strategy.name}</span>
                                        <span className="text-xs text-muted-foreground">{strategy.description}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                How the vault will be unlocked
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="timeLockPeriod"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Lock Duration (Days)</FormLabel>
                              <FormControl>
                                <div className="flex gap-4">
                                  <Select 
                                    onValueChange={(value) => field.onChange(parseInt(value))} 
                                    defaultValue={field.value.toString()}
                                  >
                                    <SelectTrigger className="w-[150px]">
                                      <SelectValue placeholder="Select duration" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="7">1 Week</SelectItem>
                                      <SelectItem value="30">1 Month</SelectItem>
                                      <SelectItem value="90">3 Months</SelectItem>
                                      <SelectItem value="180">6 Months</SelectItem>
                                      <SelectItem value="365">1 Year</SelectItem>
                                      <SelectItem value="730">2 Years</SelectItem>
                                      <SelectItem value="1460">4 Years</SelectItem>
                                      <SelectItem value="3650">10 Years</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Input 
                                    type="number"
                                    placeholder="Custom days" 
                                    {...field}
                                    onChange={e => field.onChange(parseInt(e.target.value))}
                                  />
                                </div>
                              </FormControl>
                              <FormDescription>
                                How long assets will be locked in the vault
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="unlockDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unlock Date</FormLabel>
                            <FormControl>
                              <Input 
                                type="date"
                                min={new Date().toISOString().split('T')[0]}
                                {...field}
                                value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''}
                                onChange={e => {
                                  const date = new Date(e.target.value);
                                  field.onChange(date);
                                  // Update timeLockPeriod based on selected date
                                  const now = new Date();
                                  const diffTime = Math.abs(date.getTime() - now.getTime());
                                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                  form.setValue("timeLockPeriod", diffDays);
                                }}
                              />
                            </FormControl>
                            <FormDescription>
                              Exact date when the vault will unlock
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {/* Gift-specific settings */}
                    <FormField
                      control={form.control}
                      name="isGift"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base flex items-center gap-2">
                              <Gift className="h-4 w-4 text-[#FF5AF7]" />
                              Gift Vault
                            </FormLabel>
                            <FormDescription>
                              Configure this vault as a gift for someone else
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    {watchIsGift && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="rounded-lg border border-[#FF5AF7]/30 bg-[#FF5AF7]/5 p-4 space-y-4"
                      >
                        <h3 className="text-lg font-semibold text-[#FF5AF7] flex items-center gap-2">
                          <Gift className="h-5 w-5" />
                          Gift Settings
                        </h3>
                        
                        <FormField
                          control={form.control}
                          name="recipientAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Recipient Address</FormLabel>
                              <FormControl>
                                <Input placeholder="0x..." {...field} />
                              </FormControl>
                              <FormDescription>
                                The wallet address of the gift recipient
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="giftMessage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Gift Message (Optional)</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Add a personal message for the recipient..." 
                                  className="resize-none h-20" 
                                  {...field} 
                                  value={field.value || ''}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="sendImmediately"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base flex items-center gap-2">
                                  <Send className="h-4 w-4" />
                                  Send Immediately
                                </FormLabel>
                                <FormDescription>
                                  Send the gift right away instead of waiting for the recipient to claim it
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    )}
                    
                    {/* Advanced settings toggles */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Advanced Settings</h3>
                      
                      <FormField
                        control={form.control}
                        name="includeAttachments"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Media Attachments</FormLabel>
                              <FormDescription>
                                Include files, images or documents with this vault
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="allowBeneficiaries"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Beneficiaries</FormLabel>
                              <FormDescription>
                                Add beneficiaries who will gain access to this vault
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="recurringDeposit"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Recurring Deposits</FormLabel>
                              <FormDescription>
                                Set up automatic recurring deposits to this vault
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {/* Include attachments section */}
                    {watchIncludeAttachments && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <EnhancedMediaUploader
                          vaultId={-1}  // Temporary ID, will be updated after vault creation
                          onUploadComplete={handleAttachmentUpload}
                          onAttachmentsChange={setAttachments}
                          initialAttachments={attachments}
                          maxUploads={10}
                          className="mt-4"
                          allowedTypes={['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.mp4', '.mp3']}
                        />
                      </motion.div>
                    )}
                    
                    {/* Beneficiaries section */}
                    {watchAllowBeneficiaries && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <h3 className="text-lg font-semibold">Beneficiaries</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Input 
                            placeholder="Wallet Address" 
                            id="beneficiary-address"
                          />
                          <Input 
                            type="number" 
                            placeholder="Share %" 
                            min="1" 
                            max="100" 
                            id="beneficiary-share"
                          />
                          <Button 
                            type="button" 
                            onClick={() => {
                              const addressInput = document.getElementById('beneficiary-address') as HTMLInputElement;
                              const shareInput = document.getElementById('beneficiary-share') as HTMLInputElement;
                              
                              if (addressInput.value && shareInput.value) {
                                addBeneficiary(
                                  addressInput.value,
                                  parseInt(shareInput.value)
                                );
                                addressInput.value = '';
                                shareInput.value = '';
                              }
                            }}
                          >
                            Add Beneficiary
                          </Button>
                        </div>
                        
                        {beneficiaries.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium mb-2">Beneficiaries ({beneficiaries.length})</h4>
                            <ul className="space-y-2">
                              {beneficiaries.map((beneficiary, index) => (
                                <li key={index} className="flex items-center justify-between py-2 px-3 bg-[#1A1A1A] rounded-lg">
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-[#6B00D7]" />
                                    <span className="text-sm truncate max-w-[150px]">{beneficiary.address}</span>
                                    <Badge variant="outline">{beneficiary.share}%</Badge>
                                  </div>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => removeBeneficiary(index)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <span className="sr-only">Remove</span>
                                    ✕
                                  </Button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </motion.div>
                    )}
                    
                    {/* Recurring deposit section */}
                    {form.watch("recurringDeposit") && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <h3 className="text-lg font-semibold">Recurring Deposit Schedule</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="recurringDepositAmount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Deposit Amount</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="0.00" 
                                    {...field} 
                                    value={field.value || ''}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Amount to deposit on each schedule
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="recurringDepositPeriod"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Frequency</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select frequency" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="daily">Daily</SelectItem>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="quarterly">Quarterly</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  How often to make deposits
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
                
                <div className="pt-4 flex justify-end">
                  <Button 
                    type="button" 
                    onClick={() => setSelectedTab("security")}
                    className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#6B00D7]/90 hover:to-[#FF5AF7]/90"
                  >
                    Next: Security Settings
                  </Button>
                </div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Lock className="h-5 w-5 text-[#6B00D7]" />
                      Security Settings
                    </CardTitle>
                    <CardDescription>
                      Configure the security features for your vault
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Security score indicator */}
                    <div className="bg-[#1A1A1A] rounded-lg p-5">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold">Security Score</h3>
                        <span className={`text-xl font-bold ${getSecurityColor()}`}>{securityScore}%</span>
                      </div>
                      
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            securityScore >= 90 
                              ? 'bg-green-500' 
                              : securityScore >= 70 
                                ? 'bg-yellow-500' 
                                : 'bg-red-500'
                          }`}
                          style={{ width: `${securityScore}%` }}
                        ></div>
                      </div>
                      
                      {showSecurityWarning && (
                        <div className="mt-3 text-sm text-yellow-400 flex items-start gap-2">
                          <div className="shrink-0 mt-0.5">⚠️</div>
                          <div>
                            Your security score is below the recommended level. Consider enabling additional security features to protect your vault.
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Security level selection */}
                    <FormField
                      control={form.control}
                      name="securityLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Security Level</FormLabel>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {SECURITY_LEVELS.map((level) => (
                              <FormControl key={level.id}>
                                <div
                                  className={`
                                    flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-all
                                    ${field.value === level.id 
                                      ? 'border-[#6B00D7] bg-[#6B00D7]/10' 
                                      : 'border-transparent bg-[#1A1A1A] hover:border-[#6B00D7]/30'}
                                  `}
                                  onClick={() => field.onChange(level.id)}
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className={`w-4 h-4 rounded-full ${field.value === level.id ? 'bg-[#6B00D7]' : 'border border-[#6B00D7]'}`}></div>
                                    <h4 className="font-medium">{level.name}</h4>
                                  </div>
                                  <p className="text-xs text-gray-400 mb-3">{level.description}</p>
                                  <ul className="text-xs space-y-1">
                                    {level.features.map((feature, index) => (
                                      <li key={index} className="flex items-center gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-[#6B00D7]/30 flex items-center justify-center text-[8px]">✓</div>
                                        {feature}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </FormControl>
                            ))}
                          </div>
                          <FormDescription>
                            Choose the security level that meets your needs
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Additional security features */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Advanced Security</h3>
                      
                      <FormField
                        control={form.control}
                        name="requireMultisig"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Multi-Signature</FormLabel>
                              <FormDescription>
                                Require multiple signatures to unlock this vault
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      {watchRequireMultisig && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="pl-4 border-l-2 border-[#6B00D7]/30 ml-4"
                        >
                          <FormField
                            control={form.control}
                            name="multiSigThreshold"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Required Signatures</FormLabel>
                                <FormControl>
                                  <Select 
                                    onValueChange={(val) => field.onChange(parseInt(val))} 
                                    defaultValue={field.value?.toString() || "2"}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select threshold" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="2">2 signatures</SelectItem>
                                      <SelectItem value="3">3 signatures</SelectItem>
                                      <SelectItem value="4">4 signatures</SelectItem>
                                      <SelectItem value="5">5 signatures</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormDescription>
                                  How many signatures are required to unlock
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </motion.div>
                      )}
                      
                      <FormField
                        control={form.control}
                        name="enableGeolocation"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Geolocation Lock</FormLabel>
                              <FormDescription>
                                Restrict vault access to specific geographic locations
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="enableBiometrics"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Biometric Verification</FormLabel>
                              <FormDescription>
                                Require biometric verification for enhanced security
                              </FormDescription>
                              <div className="text-xs text-[#FF5AF7]">Coming Soon</div>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={true}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <div className="pt-4 flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setSelectedTab("configuration")}
                  >
                    Back to Configuration
                  </Button>
                  
                  <Button 
                    type="button" 
                    onClick={() => setSelectedTab("preview")}
                    className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#6B00D7]/90 hover:to-[#FF5AF7]/90"
                  >
                    Next: Vault Preview
                  </Button>
                </div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="preview" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {vaultPreviewVisible && (
                  <Card className="border-[#6B00D7]/30 overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-[#1A1A1A] to-[#6B00D7]/10 border-b border-[#6B00D7]/20">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <div className="flex items-center gap-3">
                          {/* Vault icon based on type */}
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center shadow-lg">
                            {VAULT_TYPES.find(type => type.id === watchVaultType)?.icon || <Lock className="h-5 w-5 text-white" />}
                          </div>
                          
                          {/* Vault name and type */}
                          <div>
                            <h2 className="font-bold text-xl">{form.getValues("name") || "Unnamed Vault"}</h2>
                            <p className="text-sm text-muted-foreground">
                              {VAULT_TYPES.find(type => type.id === watchVaultType)?.name || "Standard Vault"}
                            </p>
                          </div>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="p-0">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-[#6B00D7]/10">
                        {/* Asset Information */}
                        <div className="p-6 space-y-4">
                          <h3 className="text-sm font-medium text-muted-foreground">ASSET INFORMATION</h3>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Network:</span>
                              <span className="text-sm font-medium flex items-center gap-1">
                                {SUPPORTED_NETWORKS.find(network => network.id === watchNetworkChain)?.icon}
                                {SUPPORTED_NETWORKS.find(network => network.id === watchNetworkChain)?.name || watchNetworkChain}
                              </span>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Asset:</span>
                              <span className="text-sm font-medium">
                                {CHAIN_ASSETS.find(asset => asset.id === form.getValues("assetType"))?.name || form.getValues("assetType")}
                              </span>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Amount:</span>
                              <span className="text-sm font-medium">
                                {form.getValues("assetAmount") || "0"} {CHAIN_ASSETS.find(asset => asset.id === form.getValues("assetType"))?.symbol || ""}
                              </span>
                            </div>
                          </div>
                          
                          {watchIsGift && (
                            <div className="pt-4 space-y-2">
                              <h3 className="text-sm font-medium text-[#FF5AF7]">GIFT INFORMATION</h3>
                              
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Recipient:</span>
                                <span className="text-sm font-medium truncate max-w-[150px]">
                                  {form.getValues("recipientAddress") || "Not specified"}
                                </span>
                              </div>
                              
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Message:</span>
                                <span className="text-sm font-medium truncate max-w-[150px]">
                                  {form.getValues("giftMessage") ? "Included" : "None"}
                                </span>
                              </div>
                              
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Delivery:</span>
                                <span className="text-sm font-medium">
                                  {form.getValues("sendImmediately") ? "Immediate" : "On Unlock"}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Time Lock Information */}
                        <div className="p-6 space-y-4">
                          <h3 className="text-sm font-medium text-muted-foreground">TIME LOCK</h3>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Strategy:</span>
                              <span className="text-sm font-medium">
                                {UNLOCK_STRATEGIES.find(strategy => strategy.id === form.getValues("unlockStrategy"))?.name || form.getValues("unlockStrategy")}
                              </span>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Lock Period:</span>
                              <span className="text-sm font-medium">
                                {form.getValues("timeLockPeriod") || 0} Days
                              </span>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Unlock Date:</span>
                              <span className="text-sm font-medium">
                                {form.getValues("unlockDate") ? form.getValues("unlockDate").toLocaleDateString() : "Not set"}
                              </span>
                            </div>
                          </div>
                          
                          {/* Visual unlock countdown */}
                          <div className="mt-6">
                            <div className="w-full bg-[#1A1A1A] rounded-full h-3">
                              <div className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] h-3 rounded-full w-0"></div>
                            </div>
                            <div className="flex justify-between mt-1 text-xs">
                              <span>Now</span>
                              <span>{form.getValues("timeLockPeriod")} Days</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Security Information */}
                        <div className="p-6 space-y-4">
                          <h3 className="text-sm font-medium text-muted-foreground">SECURITY</h3>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Level:</span>
                              <span className="text-sm font-medium">
                                {SECURITY_LEVELS.find(level => level.id === watchSecurityLevel)?.name || watchSecurityLevel}
                              </span>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Score:</span>
                              <span className={`text-sm font-medium ${getSecurityColor()}`}>
                                {securityScore}%
                              </span>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Features:</span>
                              <span className="text-sm font-medium">
                                {[
                                  watchRequireMultisig ? "Multi-Sig" : null,
                                  form.getValues("enableGeolocation") ? "Geo-Lock" : null,
                                  form.getValues("enableBiometrics") ? "Biometric" : null
                                ].filter(Boolean).join(", ") || "Standard"}
                              </span>
                            </div>
                          </div>
                          
                          {/* Additional info */}
                          <div className="mt-4 pt-4 border-t border-[#6B00D7]/10">
                            <div className="space-y-2">
                              {watchIncludeAttachments && (
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Attachments:</span>
                                  <span className="text-sm font-medium">
                                    {attachments.length} files
                                  </span>
                                </div>
                              )}
                              
                              {watchAllowBeneficiaries && (
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Beneficiaries:</span>
                                  <span className="text-sm font-medium">
                                    {beneficiaries.length} beneficiaries
                                  </span>
                                </div>
                              )}
                              
                              {form.getValues("recurringDeposit") && (
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Deposits:</span>
                                  <span className="text-sm font-medium truncate max-w-[150px]">
                                    {form.getValues("recurringDepositAmount") || "0"} {form.getValues("recurringDepositPeriod") || ""}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Description section */}
                      {form.getValues("description") && (
                        <div className="px-6 py-4 border-t border-[#6B00D7]/10">
                          <h3 className="text-sm font-medium text-muted-foreground mb-2">DESCRIPTION</h3>
                          <p className="text-sm">{form.getValues("description")}</p>
                        </div>
                      )}
                    </CardContent>
                    
                    <CardFooter className="bg-gradient-to-r from-[#1A1A1A] to-[#6B00D7]/5 border-t border-[#6B00D7]/20 py-4">
                      <div className="w-full flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-[#6B00D7]/20 flex items-center justify-center">
                            <Shield className="h-4 w-4 text-[#6B00D7]" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Created by</p>
                            <p className="text-sm font-medium">You</p>
                          </div>
                        </div>
                        
                        <div>
                          <Badge 
                            variant="outline" 
                            className="text-[#6B00D7] border-[#6B00D7]/40 bg-[#6B00D7]/10"
                          >
                            Preview
                          </Badge>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                )}
                
                <div className="pt-4 flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setSelectedTab("security")}
                  >
                    Back to Security Settings
                  </Button>
                  
                  <Button 
                    type="submit"
                    disabled={isCreating}
                    className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#6B00D7]/90 hover:to-[#FF5AF7]/90 text-white"
                  >
                    {isCreating ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                        <span>Creating...</span>
                      </div>
                    ) : (
                      getButtonText()
                    )}
                  </Button>
                </div>
              </motion.div>
            </TabsContent>
          </form>
        </Form>
      </Tabs>
    </div>
  );
}