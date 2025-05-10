import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { insertVaultSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { FileUpload } from "@/components/attachments/file-upload";
import { EnhancedMediaUploader } from "@/components/attachments/enhanced-media-uploader";
import VaultTypeSelector, { SpecializedVaultType } from "@/components/vault/vault-type-selector";
import { MemoryVaultContent } from "@/components/vault/memory-vault-content";
import { useCVTToken, StakingTier } from "@/contexts/cvt-token-context";
import { Coins, Wallet, ArrowLeftRight, ArrowRightCircle, Shield } from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define a more specific metadata type
const metadataSchema = z.object({
  allowsAttachments: z.boolean().default(true),
  attachmentsEncryption: z.string().default("AES-256"),
  attachments: z.array(z.any()).optional(),
  
  // Sovereign Fortress Vault specific metadata
  quantumResistant: z.boolean().optional().default(true),
  adaptiveSecurity: z.boolean().optional().default(true),
  instantRecovery: z.boolean().optional().default(true),
  securityLevel: z.string().optional().default("standard"),
  autoScalingSecurity: z.boolean().optional().default(true),
  threatMonitoring: z.boolean().optional().default(true),
  accessControls: z.object({
    multiFactorAuth: z.boolean().optional().default(true),
    temporaryAccess: z.boolean().optional().default(false),
    deviceRestrictions: z.boolean().optional().default(false),
    biometricAuth: z.boolean().optional().default(false)
  }).optional().default({}),
  
  // Gift-specific metadata
  giftExperience: z.object({
    experienceType: z.string().optional(),
    unlockStages: z.array(z.string()).optional(),
    augmentedMedia: z.boolean().optional(),
    appreciationRate: z.number().optional(),
    challenges: z.array(z.string()).optional()
  }).optional(),
  
  // Memory vault specific metadata
  memoryTitle: z.string().optional(),
  memoryDescription: z.string().optional(),
  revealMessage: z.string().optional(),
  showCountdown: z.boolean().default(true)
});

// Extend the vault schema with additional validation
const formSchema = insertVaultSchema.extend({
  confirmAmount: z.string().min(1, "Please confirm the amount"),
  includeAttachments: z.boolean().optional().default(true),
  unlockDate: z.union([z.string(), z.date()]), // Handle both string and Date objects
  tripleChainSecurity: z.boolean().optional().default(false),
  
  // Payment options for dual token system
  paymentType: z.enum(["native", "cvt"]).default("cvt"),
  applyStakingDiscount: z.boolean().optional().default(false),
  
  metadata: metadataSchema.optional().default({
    allowsAttachments: true,
    attachmentsEncryption: "AES-256"
  }),
  // Specialized vault type fields
  // Multi-signature vault fields
  requiredSignatures: z.union([z.string(), z.number()]).optional()
    .transform(val => typeof val === 'string' ? parseInt(val, 10) : val),
  
  // Biometric vault fields
  biometricType: z.string().optional(),
  
  // Time-lock vault fields
  scheduleType: z.string().optional(),
  
  // Geolocation vault fields
  geoRadius: z.union([z.string(), z.number()]).optional()
    .transform(val => typeof val === 'string' ? parseInt(val, 10) : val),
  geoLocation: z.string().optional(),
  
  // Cross-chain vault fields
  additionalChains: z.array(z.string()).optional().default([]),
  
  // Smart contract vault fields
  contractCondition: z.string().optional(),
  
  // Dynamic vault fields
  dynamicRules: z.string().optional(),
  
  // NFT-powered vault fields
  nftType: z.string().optional(),
  
  // Unique security vault fields
  securityLevel: z.union([z.string(), z.number()]).optional()
    .transform(val => typeof val === 'string' ? parseInt(val, 10) : val),
  
  // Gift-specific fields
  giftType: z.string().optional(),
  giftRecipient: z.string().optional(),
  giftMessage: z.string().optional(),
  
  // Make sure asset amount is properly typed as string to match database
  assetAmount: z.union([z.string(), z.number()])
    .transform(val => typeof val === 'string' ? val : String(val)),
}).refine((data) => {
  // Convert both to strings for comparison to avoid type issues
  return String(data.assetAmount) === String(data.confirmAmount);
}, {
  message: "Asset amounts do not match",
  path: ["confirmAmount"],
});

type FormValues = z.infer<typeof formSchema>;

import { useTon } from "@/contexts/ton-context";
import { BlockchainType } from "@/contexts/multi-chain-context";

interface CreateVaultFormProps {
  initialVaultType?: string;
  selectedBlockchain?: BlockchainType;
  isWalletConnected?: boolean;
  walletInfo?: {
    ethereum: any;
    solana: any;
    ton: any;
  };
  ton?: any; // Using any for now to fix the build
  onVaultTypeChange?: (type: SpecializedVaultType) => void;
}

export function CreateVaultForm({ 
  initialVaultType = "standard",
  selectedBlockchain = BlockchainType.TON,
  isWalletConnected = false,
  walletInfo,
  ton,
  onVaultTypeChange
}: CreateVaultFormProps) {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(initialVaultType);
  const [createdVaultId, setCreatedVaultId] = useState<number | null>(null);
  const [showAttachmentUpload, setShowAttachmentUpload] = useState(false);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [useTripleChainSecurity, setUseTripleChainSecurity] = useState<boolean>(false);
  
  // Get CVT token context for balance and pricing
  const { tokenBalance, currentStakingTier, payForVaultCreation } = useCVTToken();
  
  // Function to get vault creation cost based on vault type
  const getCreationCost = () => {
    const vaultType = form?.watch('vaultType') || initialVaultType;
    
    // Base costs in CVT tokens
    const costs: Record<string, number> = {
      'legacy': 20,
      'investment': 25,
      'gift': 15,
      'standard': 20,
      'multi-signature': 30,
      'biometric': 35,
      'time-lock': 25,
      'geolocation': 30,
      'cross-chain': 40,
      'smart-contract': 45,
      'dynamic': 50,
      'nft-powered': 35,
      'unique': 60
    };
    
    // Native token approximate costs (in USD equivalent)
    const nativeCosts: Record<string, number> = {
      'TON': costs[vaultType as keyof typeof costs] * 0.5, // TON price in USD
      'ETH': costs[vaultType as keyof typeof costs] * 0.0002, // ETH approximation
      'SOL': costs[vaultType as keyof typeof costs] * 0.02 // SOL approximation
    };
    
    // Apply staking discount if eligible
    const paymentType = form?.watch('paymentType') || 'cvt';
    
    if (paymentType === 'cvt') {
      // Apply staking tier discount
      let discount = 0;
      switch(currentStakingTier) {
        case StakingTier.GUARDIAN: discount = 0.75; break; // 75% discount
        case StakingTier.ARCHITECT: discount = 0.9; break; // 90% discount
        case StakingTier.SOVEREIGN: discount = 1.0; break; // 100% discount
        default: discount = 0; // No discount
      }
      
      return {
        amount: Math.max(5, Math.round(costs[vaultType as keyof typeof costs] * (1 - discount))),
        currency: 'CVT',
        discount: discount > 0 ? `${discount * 100}%` : null
      };
    } else {
      // Native token payment
      const nativeToken = selectedBlockchain === BlockchainType.TON ? 'TON' : 
                        selectedBlockchain === BlockchainType.ETHEREUM ? 'ETH' : 'SOL';
      return {
        amount: nativeCosts[nativeToken as keyof typeof nativeCosts],
        currency: nativeToken,
        discount: null
      };
    }
  };

  // Mocked user ID for demo purposes
  const userId = 1;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId,
      name: "",
      description: "",
      vaultType: initialVaultType,
      assetType: "ETH",
      assetAmount: "",
      confirmAmount: "",
      timeLockPeriod: 365, // Default to 1 year
      unlockDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      includeAttachments: true,
      tripleChainSecurity: false, // Our new Triple-Chain Security feature
      
      // Payment options for dual token system
      paymentType: "cvt", // Default to CVT token payment
      applyStakingDiscount: false,
      
      metadata: {
        allowsAttachments: true,
        attachmentsEncryption: "AES-256",
        // Sovereign Fortress Vault defaults
        quantumResistant: true,
        adaptiveSecurity: true,
        instantRecovery: true,
        securityLevel: "standard",
        autoScalingSecurity: true,
        threatMonitoring: true,
        accessControls: {
          multiFactorAuth: true,
          temporaryAccess: false,
          deviceRestrictions: false,
          biometricAuth: false
        },
        // Memory vault specific defaults
        memoryTitle: "",
        memoryDescription: "",
        revealMessage: "",
        showCountdown: true
      },
      // Add default values for specialized vault types
      requiredSignatures: "2",
      biometricType: "fingerprint",
      scheduleType: "fixed",
      geoRadius: "100",
      geoLocation: "40.7128, -74.0060",
      additionalChains: [],
      contractCondition: "time",
      dynamicRules: "market",
      nftType: "ownership",
      securityLevel: "enhanced",
      // Add default values for gift fields
      giftType: "surprise",
      giftRecipient: "",
      giftMessage: ""
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      console.log("Submitting vault data:", data);
      try {
        const response = await apiRequest("POST", "/api/vaults", data);
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          console.error("Server returned an error:", response.status, errorData);
          
          // Display more detailed error information
          let errorMessage = errorData?.message || `Server returned ${response.status}`;
          if (errorData?.errors) {
            const details = Array.isArray(errorData.errors) 
              ? errorData.errors.map((e: any) => `${e.path?.[0] || ''}: ${e.message}`).join(', ')
              : JSON.stringify(errorData.errors);
            errorMessage += `. Details: ${details}`;
          }
          
          throw new Error(errorMessage);
        }
        return response.json();
      } catch (err: any) {
        console.error("Error in vault creation request:", err);
        throw err;
      }
    },
    onSuccess: (data) => {
      console.log("Vault created successfully:", data);
      setCreatedVaultId(data.id);
      
      // If attachments were already uploaded with the enhanced uploader
      if (attachments.length > 0) {
        toast({
          title: "Vault created successfully",
          description: "Your vault has been created with all your media attachments.",
        });
        // Navigate directly to the vault details
        navigate(`/vault-details?id=${data.id}`);
      } else if (form.watch("includeAttachments")) {
        // Show the attachment upload step only if includeAttachments is checked
        setShowAttachmentUpload(true);
        toast({
          title: "Vault created successfully",
          description: "Your vault has been created. You can now add media attachments.",
        });
      } else {
        // No attachments needed, go directly to vault details
        toast({
          title: "Vault created successfully",
          description: "Your vault has been created successfully.",
        });
        navigate(`/vault-details?id=${data.id}`);
      }
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast({
        title: "Failed to create vault",
        description: error.message || "Something went wrong while creating your vault.",
        variant: "destructive",
      });
    },
  });
  
  const handleAttachmentComplete = (attachment: any) => {
    setAttachments(prevAttachments => [...prevAttachments, attachment]);
    toast({
      title: "File uploaded successfully",
      description: "Your attachment has been added to the vault.",
    });
  };
  
  const handleAttachmentsChange = (newAttachments: any[]) => {
    setAttachments(newAttachments);
  };
  
  const handleFinishCreation = () => {
    toast({
      title: "Vault creation complete",
      description: "Your vault has been created with all assets and attachments.",
    });
    navigate("/my-vaults");
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    form.setValue("vaultType", value);
  };
  
  const handleVaultTypeChange = (type: SpecializedVaultType) => {
    console.log("Changing vault type to:", type);
    form.setValue("vaultType", type);
    
    // Notify parent component of the change
    if (onVaultTypeChange) {
      onVaultTypeChange(type);
    }
  };

  const handleTimeLockChange = (value: string) => {
    const days = parseInt(value, 10);
    form.setValue("timeLockPeriod", days);
    
    // Also update the unlock date
    const unlockDate = new Date();
    unlockDate.setDate(unlockDate.getDate() + days);
    form.setValue("unlockDate", unlockDate.toISOString());
  };

  const [isBlockchainDeploying, setIsBlockchainDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<string | null>(null);
  const [contractAddress, setContractAddress] = useState<string | null>(null);
  
  // Function to get styling for the card based on vault type
  const getVaultTypeStyle = () => {
    const vaultType = form.watch('vaultType');
    switch(vaultType) {
      case 'multi-signature':
        return 'border-[#FF5AF7]/30';
      case 'biometric':
        return 'border-[#00D7C3]/30';
      case 'time-lock':
        return 'border-[#D76B00]/30';
      case 'geolocation':
        return 'border-[#00D74B]/30';
      case 'cross-chain':
        return 'border-[#8B00D7]/30';
      case 'smart-contract':
        return 'border-[#5271FF]/30';
      case 'dynamic':
        return 'border-[#FF5151]/30';
      case 'nft-powered':
        return 'border-[#CE19FF]/30';
      case 'unique':
        return 'border-[#fca103]/30';
      default:
        return 'border-[#6B00D7]/20';
    }
  };
  
  // Function to render specialized vault specific fields based on the vault type
  const renderSpecializedFields = () => {
    const currentVaultType = form.watch("vaultType");
    
    switch(currentVaultType) {
      case 'standard':
        return (
          <div className="space-y-4 border border-[#6B00D7]/30 rounded-lg p-4 bg-gradient-to-r from-[#1A1A1A] to-[#1A1A2A]">
            <h3 className="text-lg text-[#6B00D7] font-medium">Sovereign Fortress Vault™ Configuration</h3>
            <p className="text-sm text-gray-300">Configure your premium vault with advanced security features</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-4">
                <FormField
                  control={form.control as any}
                  name="tripleChainSecurity"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-[#6B00D7]/20 p-4 bg-black/30">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-[#6B00D7] data-[state=checked]:border-[#6B00D7]"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-white">Triple-Chain Security</FormLabel>
                        <FormDescription className="text-xs text-gray-400">
                          Enhances vault security by utilizing TON, Ethereum, and Solana simultaneously
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control as any}
                  name="metadata.quantumResistant"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-[#6B00D7]/20 p-4 bg-black/30">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-[#6B00D7] data-[state=checked]:border-[#6B00D7]"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-white">Quantum-Resistant Encryption</FormLabel>
                        <FormDescription className="text-xs text-gray-400">
                          Uses post-quantum cryptography to secure against future quantum computers
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-4">
                <FormField
                  control={form.control as any}
                  name="metadata.adaptiveSecurity"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-[#6B00D7]/20 p-4 bg-black/30">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-[#6B00D7] data-[state=checked]:border-[#6B00D7]"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-white">Adaptive Multi-Layered Security</FormLabel>
                        <FormDescription className="text-xs text-gray-400">
                          Automatically adjusts security levels based on asset value and risk assessment
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control as any}
                  name="metadata.instantRecovery"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-[#6B00D7]/20 p-4 bg-black/30">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-[#6B00D7] data-[state=checked]:border-[#6B00D7]"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-white">Instant Disaster Recovery</FormLabel>
                        <FormDescription className="text-xs text-gray-400">
                          Provides emergency access options with multi-factor authentication
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <FormField
              control={form.control as any}
              name="metadata.securityLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Security Protocol Level</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || "standard"}
                  >
                    <FormControl>
                      <SelectTrigger className="border-[#6B00D7]/30 bg-black/40">
                        <SelectValue placeholder="Select security level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="standard">Standard (Recommended)</SelectItem>
                      <SelectItem value="enhanced">Enhanced (High-Value Assets)</SelectItem>
                      <SelectItem value="maximum">Maximum (Institutional Grade)</SelectItem>
                      <SelectItem value="fortress">Fortress Supreme (Military Grade)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Higher security levels provide additional protection layers but may require additional verification steps
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>
        );
      case 'memory-vault':
        return (
          <div className="space-y-4 border border-[#FF3A8C]/20 rounded-lg p-4 bg-gradient-to-r from-[#1A1A1A] to-[#2A1A24]">
            <h3 className="text-lg text-[#FF3A8C] font-medium">Time-Locked Memory Vault Settings</h3>
            <p className="text-sm text-gray-300">Create a vault combining digital assets with multimedia memories</p>
            
            <MemoryVaultContent 
              form={form} 
              isSubmitting={mutation.isPending} 
            />
          </div>
        );
      
      case 'multi-signature':
        return (
          <div className="space-y-4 border border-[#FF5AF7]/20 rounded-lg p-4 bg-gradient-to-r from-[#1A1A1A] to-[#231A2A]">
            <h3 className="text-lg text-[#FF5AF7] font-medium">Multi-Signature Vault Settings</h3>
            <p className="text-sm text-gray-300">Configure required approvals for this multi-signature vault</p>
            
            <FormField
              control={form.control}
              name="requiredSignatures"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Required Signatures</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value?.toString() || "2"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select required signatures" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="2">2 signatures</SelectItem>
                      <SelectItem value="3">3 signatures</SelectItem>
                      <SelectItem value="4">4 signatures</SelectItem>
                      <SelectItem value="5">5 signatures</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Number of signatures required to unlock this vault
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>
        );
      
      case 'biometric':
        return (
          <div className="space-y-4 border border-[#00D7C3]/20 rounded-lg p-4 bg-gradient-to-r from-[#1A1A1A] to-[#1A2A29]">
            <h3 className="text-lg text-[#00D7C3] font-medium">Biometric Vault Settings</h3>
            <p className="text-sm text-gray-300">Configure biometric access settings for this vault</p>
            
            <FormField
              control={form.control}
              name="biometricType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biometric Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || "fingerprint"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select biometric type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="fingerprint">Fingerprint</SelectItem>
                      <SelectItem value="face">Facial Recognition</SelectItem>
                      <SelectItem value="voice">Voice Recognition</SelectItem>
                      <SelectItem value="multi">Multi-factor Biometric</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Type of biometric verification required
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>
        );
        
      case 'time-lock':
        return (
          <div className="space-y-4 border border-[#D76B00]/20 rounded-lg p-4 bg-gradient-to-r from-[#1A1A1A] to-[#2A211A]">
            <h3 className="text-lg text-[#D76B00] font-medium">Time-Lock Vault Settings</h3>
            <p className="text-sm text-gray-300">Configure advanced time-lock settings for this vault</p>
            
            <FormField
              control={form.control}
              name="scheduleType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Schedule Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || "fixed"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select schedule type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed Date</SelectItem>
                      <SelectItem value="recurring">Recurring</SelectItem>
                      <SelectItem value="conditional">Conditional</SelectItem>
                      <SelectItem value="tiered">Tiered Release</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    How the asset will be released from the time-lock
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  async function onSubmit(data: FormValues) {
    // Create gift experience metadata if vault type is "gift"
    let giftExperience;
    if (data.vaultType === "gift") {
      giftExperience = {
        experienceType: data.giftType || "surprise",
        recipientAddress: data.giftRecipient || "",
        message: data.giftMessage || "",
        unlockStages: [],
        augmentedMedia: true,
        appreciationRate: 1.05
      };
    }
    
    // Get the current timestamp + timelock period for the vault
    const currentTime = Math.floor(Date.now() / 1000);
    const unlockTime = currentTime + (data.timeLockPeriod * 24 * 60 * 60); // Convert days to seconds
    
    // Handle blockchain deployment if wallet is connected
    let blockchainTxHash = null;
    let blockchainAddress = null;
    let deploymentMetadata = null;
    
    // Get the Triple-Chain Security setting from our state
    // This is already synced with the form through the checkbox onChange handler
    
    // Get payment details based on the selected payment type and vault type
    const creationCost = getCreationCost();
    let paymentSuccess = false;
    
    // Add detailed tracking for the vault creation process
    console.log("Starting vault creation process", { 
      vaultType: data.vaultType,
      blockchain: selectedBlockchain,
      isWalletConnected,
      tripleChainSecurity: useTripleChainSecurity,
      paymentType: data.paymentType,
      creationCost
    });
    
    if (isWalletConnected && selectedBlockchain) {
      try {
        setIsBlockchainDeploying(true);
        
        // Process payment based on payment type
        if (data.paymentType === 'cvt') {
          setDeploymentStatus("Processing CVT payment...");
          // Check if user has enough CVT tokens
          const userBalance = parseFloat(tokenBalance || '0');
          if (userBalance < creationCost.amount) {
            toast({
              title: "Insufficient CVT balance",
              description: `Need ${creationCost.amount} CVT but you have ${userBalance} CVT.`,
              variant: "destructive"
            });
            throw new Error(`Insufficient CVT balance. Need ${creationCost.amount} CVT but you have ${userBalance} CVT.`);
          }
          
          // Use our CVT token context to process the payment
          try {
            console.log("Initiating CVT token payment", { amount: creationCost.amount, type: data.vaultType });
            // Get blockchain type as string for the token service
            const blockchainString = selectedBlockchain.toString();
            
            // Process the payment through our CVT token service
            const paymentResult = await payForVaultCreation(
              creationCost.amount,
              data.vaultType,
              blockchainString
            );
            
            if (paymentResult.success) {
              console.log("CVT payment confirmed", paymentResult);
              setDeploymentStatus(
                `CVT payment confirmed! ${paymentResult.burnAmount ? `(${paymentResult.burnAmount.toFixed(2)} CVT burned)` : ""}`
              );
              paymentSuccess = true;
              
              // Save the transaction hash for blockchain reference
              blockchainTxHash = paymentResult.transactionHash || null;
            } else {
              throw new Error(paymentResult.errorMessage || "Payment failed");
            }
          } catch (paymentError: any) {
            console.error("CVT payment failed", paymentError);
            toast({
              title: "Payment Failed",
              description: paymentError.message || "There was an error processing your CVT payment.",
              variant: "destructive"
            });
            throw new Error(`Payment failed: ${paymentError.message}`);
          }
        } else {
          // Native token payment
          setDeploymentStatus(`Processing ${creationCost.currency} payment...`);
          try {
            console.log(`Initiating ${creationCost.currency} token transfer`, { amount: creationCost.amount });
            // Would check native token balance here
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate token transfer
            console.log(`${creationCost.currency} payment confirmed`);
            setDeploymentStatus(`${creationCost.currency} payment confirmed!`);
            paymentSuccess = true;
          } catch (nativePaymentError: any) {
            console.error(`${creationCost.currency} payment failed`, nativePaymentError);
            toast({
              title: "Payment Failed",
              description: `There was an error processing your ${creationCost.currency} payment.`,
              variant: "destructive"
            });
            throw new Error(`Payment failed: ${nativePaymentError.message}`);
          }
        }
        
        // Only continue with deployment if payment was successful
        if (paymentSuccess) {
          setDeploymentStatus("Preparing deployment transaction...");
          
          // Deploy based on the selected blockchain
          if (selectedBlockchain === BlockchainType.TON && ton) {
            setDeploymentStatus("Deploying to TON Network...");
            
            // Convert amount to nanograms (TON's smallest unit)
            const amount = parseFloat(data.assetAmount) || 0.1; 
            const nanotons = Math.floor(amount * 1_000_000_000);
            
            // Make sure we have TonContractService
            if (ton.contractService) {
              const deployParams = {
                recipient: ton.wallet?.address || '', // Will be the owner
                unlockTime: unlockTime,
                securityLevel: useTripleChainSecurity ? 5 : 3, // Higher security level when Triple-Chain is enabled
                comment: data.description || 'ChronosVault',
                amount: nanotons,
                // Add payment information
                paymentType: data.paymentType,
                paymentAmount: creationCost.amount,
                paymentCurrency: creationCost.currency
              };
              
              // Deploy the vault contract
              const result = await ton.contractService.deployVault(deployParams);
              
              if (result.success) {
                blockchainTxHash = result.transactionHash;
                blockchainAddress = result.contractAddress || null;
                deploymentMetadata = {
                  blockchain: selectedBlockchain,
                  txHash: result.transactionHash,
                  contractAddress: result.contractAddress,
                  deployParams,
                  simulated: !!result.simulated,
                  payment: {
                    type: data.paymentType,
                    amount: creationCost.amount,
                    currency: creationCost.currency,
                    discount: creationCost.discount || null
                  }
                };
                
                setContractAddress(result.contractAddress || null);
                setDeploymentStatus("Successfully deployed to TON!");
              } else {
                throw new Error(result.error || 'Deployment failed');
              }
            } else {
              throw new Error('TON contract service not available');
            }
          } 
          else if (selectedBlockchain === BlockchainType.ETHEREUM) {
            setDeploymentStatus("Ethereum deployment not implemented yet");
            // Would connect to Ethereum wallet here
          } 
          else if (selectedBlockchain === BlockchainType.SOLANA) {
            setDeploymentStatus("Solana deployment not implemented yet");
            // Would connect to Solana wallet here
          }
        } else {
          throw new Error('Payment processing failed');
        }
        
      } catch (error: any) {
        setDeploymentStatus(`Deployment error: ${error.message}`);
        toast({
          title: "Blockchain Deployment Failed",
          description: error.message || "There was an error deploying to the blockchain",
          variant: "destructive",
        });
        setIsBlockchainDeploying(false);
        return; // Stop the submission process
      } finally {
        setIsBlockchainDeploying(false);
      }
    }
    
    // Include attachment information, gift data, and blockchain metadata in the vault metadata
    const vaultData = {
      ...data,
      blockchain: selectedBlockchain || undefined,
      blockchainAddress,
      blockchainTxHash,
      unlockTimestamp: unlockTime,
      // Include payment details
      payment: {
        type: data.paymentType,
        amount: creationCost.amount,
        currency: creationCost.currency,
        discount: creationCost.discount || null
      },
      metadata: {
        allowsAttachments: data.metadata?.allowsAttachments ?? true,
        attachmentsEncryption: data.metadata?.attachmentsEncryption ?? "AES-256",
        tripleChainSecurity: useTripleChainSecurity || data.tripleChainSecurity, // Add our Triple-Chain Security flag
        securityLevel: data.metadata?.securityLevel || (useTripleChainSecurity ? "fortress" : "standard"), // Use selected security level or default based on Triple-Chain
        
        // Sovereign Fortress Vault™ special features
        quantumResistant: data.metadata?.quantumResistant ?? true, 
        adaptiveSecurity: data.metadata?.adaptiveSecurity ?? true,
        instantRecovery: data.metadata?.instantRecovery ?? true,
        autoScalingSecurity: data.metadata?.autoScalingSecurity ?? true,
        threatMonitoring: data.metadata?.threatMonitoring ?? true,
        accessControls: data.metadata?.accessControls ?? {
          multiFactorAuth: true,
          temporaryAccess: false,
          deviceRestrictions: false,
          biometricAuth: false
        },
        
        // Add enhanced security protocols based on selected security level
        securityProtocols: data.vaultType === 'standard' ? {
          quantumResistance: {
            enabled: true, 
            algorithm: data.metadata?.securityLevel === "fortress" ? "SPHINCS+" : 
                       data.metadata?.securityLevel === "maximum" ? "CRYSTALS-Dilithium" : 
                       data.metadata?.securityLevel === "enhanced" ? "Falcon-1024" : "Falcon-512"
          },
          zeroKnowledgePrivacy: {
            enabled: true,
            level: data.metadata?.securityLevel === "fortress" ? "military" : 
                  data.metadata?.securityLevel === "maximum" ? "enterprise" : 
                  data.metadata?.securityLevel === "enhanced" ? "advanced" : "standard"
          },
          adaptiveSecurity: {
            enabled: true,
            responseLevel: data.metadata?.securityLevel === "fortress" ? "autonomous" : 
                          data.metadata?.securityLevel === "maximum" ? "advanced" : 
                          data.metadata?.securityLevel === "enhanced" ? "moderate" : "basic"
          }
        } : undefined,
        
        attachments: attachments.length > 0 ? attachments : undefined,
        ...(giftExperience && { giftExperience }),
        ...(deploymentMetadata && { blockchain: deploymentMetadata }),
        ...(useTripleChainSecurity && { 
          securityArchitecture: {
            type: "triple-chain",
            chains: ["TON", "Ethereum", "Solana"],
            crossValidation: true,
            redundancy: "Progressive",
            securityLevel: data.metadata?.securityLevel === "fortress" ? "Military" :
                          data.metadata?.securityLevel === "maximum" ? "Institutional" :
                          data.metadata?.securityLevel === "enhanced" ? "Enterprise" : "Standard"
          }
        }),
      }
    };
    
    // Before submitting to database, ensure the data follows the schema properly
    // Some fields might not exist in all states, so add defaults and handles nulls/undefined values
    const finalVaultData = {
      ...vaultData,
      // Make sure these required fields are properly formatted
      userId: 1, // Default user ID
      name: data.name || "",
      description: data.description || "",
      vaultType: data.vaultType || "standard",
      assetType: data.assetType || "ETH",
      // Ensure assetAmount is a string to match the database schema
      assetAmount: data.assetAmount ? 
        (typeof data.assetAmount === 'string' ? data.assetAmount : String(data.assetAmount)) : 
        "0",
      // Ensure timeLockPeriod is a number
      timeLockPeriod: data.timeLockPeriod ? 
        (typeof data.timeLockPeriod === 'string' ? parseInt(data.timeLockPeriod, 10) : Number(data.timeLockPeriod)) : 
        30,
      // Format the date consistently
      unlockDate: data.unlockDate ? 
        (data.unlockDate instanceof Date ? data.unlockDate.toISOString() : new Date(data.unlockDate).toISOString()) : 
        new Date(Date.now() + 30*24*60*60*1000).toISOString(),
      // Format metadata as a proper JSON-serializable object
      metadata: data.metadata ? 
        (typeof data.metadata === 'string' ? JSON.parse(data.metadata) : data.metadata) : 
        {}
    };
    
    // More detailed logging to help debug data type issues
    console.log("Final data being sent to server:", finalVaultData);
    console.log("Data types of important fields:", {
      assetAmount: typeof finalVaultData.assetAmount,
      timeLockPeriod: typeof finalVaultData.timeLockPeriod,
      unlockDate: typeof finalVaultData.unlockDate,
      metadata: typeof finalVaultData.metadata,
    });
    console.log("Sample values of fields:", {
      assetAmount: finalVaultData.assetAmount,
      timeLockPeriod: finalVaultData.timeLockPeriod,
      unlockDate: finalVaultData.unlockDate,
      metadata: JSON.stringify(finalVaultData.metadata).substring(0, 100) + "...",
    });
    
    // Store in database
    // Only pass the fields that are expected by the server
    const serverVaultData = {
      userId: finalVaultData.userId,
      name: finalVaultData.name,
      description: finalVaultData.description,
      vaultType: finalVaultData.vaultType,
      assetType: finalVaultData.assetType,
      assetAmount: finalVaultData.assetAmount,
      timeLockPeriod: finalVaultData.timeLockPeriod,
      unlockDate: finalVaultData.unlockDate,
      metadata: finalVaultData.metadata,
      ethereumContractAddress: finalVaultData.ethereumContractAddress,
      solanaContractAddress: finalVaultData.solanaContractAddress,
      tonContractAddress: finalVaultData.tonContractAddress,
      // Map security level string to numeric value
      securityLevel: typeof finalVaultData.securityLevel === 'string' 
        ? (finalVaultData.securityLevel === "fortress" ? 5 
            : finalVaultData.securityLevel === "maximum" ? 4 
            : finalVaultData.securityLevel === "enhanced" ? 3 
            : 2) 
        : (finalVaultData.securityLevel || 3),
      crossChainEnabled: finalVaultData.crossChainEnabled || false,
      privacyEnabled: finalVaultData.privacyEnabled || false
    };
    
    console.log("Final data to server:", serverVaultData);
    mutation.mutate(serverVaultData);
  }

  const getTabStyle = () => {
    switch (activeTab) {
      case "legacy":
        return "border-[#6B00D7]/30 hover:border-[#6B00D7]";
      case "investment":
        return "border-[#FF5AF7]/30 hover:border-[#FF5AF7]";
      case "project":
        return "border-gradient-to-r from-[#6B00D7]/30 to-[#FF5AF7]/30 hover:from-[#6B00D7] hover:to-[#FF5AF7]";
      case "gift":
        return "border-[#00D7C3]/30 hover:border-[#00D7C3]";
      default:
        return "border-[#6B00D7]/30 hover:border-[#6B00D7]";
    }
  };

  return (
    <div>
      <Tabs defaultValue={initialVaultType} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="legacy">Legacy Vault</TabsTrigger>
          <TabsTrigger value="investment">Investment Vault</TabsTrigger>
          <TabsTrigger value="project">Project Vault</TabsTrigger>
          <TabsTrigger value="gift">Gift Vault</TabsTrigger>
        </TabsList>

        <Card className={`bg-[#1E1E1E] border ${getVaultTypeStyle()} transition-all`}>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
                    Choose Vault Type
                  </h3>
                  <p className="text-gray-400 mb-4">Select a specialized vault type based on your security needs</p>
                  
                  <VaultTypeSelector 
                    selectedType={form.watch('vaultType') as SpecializedVaultType}
                    onChange={handleVaultTypeChange}
                  />
                </div>
                
                {/* Render specialized vault fields if vault type is specialized */}
                {['multi-signature', 'biometric', 'time-lock', 'geolocation', 'cross-chain', 'smart-contract', 'dynamic', 'nft-powered', 'unique'].includes(form.watch('vaultType')) && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
                      Specialized Vault Configuration
                    </h3>
                    {renderSpecializedFields()}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vault Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter a name for your vault" {...field} />
                        </FormControl>
                        <FormDescription>
                          A descriptive name to identify your vault
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
                              <SelectValue placeholder="Select an asset type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                            <SelectItem value="SOL">Solana (SOL)</SelectItem>
                            <SelectItem value="TON">TON</SelectItem>
                            <SelectItem value="USDT">Tether (USDT)</SelectItem>
                            <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                            <SelectItem value="CVT">Chronos Vault Token (CVT)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The type of asset to lock in the vault
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="assetAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Asset Amount</FormLabel>
                        <FormControl>
                          <Input 
                            type="text" 
                            placeholder="0.0" 
                            {...field} 
                            onChange={(e) => {
                              // Limit to numbers and a single decimal point
                              const value = e.target.value;
                              if (/^\d*\.?\d*$/.test(value)) {
                                field.onChange(value);
                              }
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Amount of the asset to lock in the vault
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="confirmAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Amount</FormLabel>
                        <FormControl>
                          <Input 
                            type="text" 
                            placeholder="0.0" 
                            {...field} 
                            onChange={(e) => {
                              // Limit to numbers and a single decimal point
                              const value = e.target.value;
                              if (/^\d*\.?\d*$/.test(value)) {
                                field.onChange(value);
                              }
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Re-enter the amount to confirm
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
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter a description for your vault"
                          className="resize-none"
                          value={field.value || ''}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormDescription>
                        A detailed description of the purpose of this vault
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="timeLockPeriod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time Lock Period</FormLabel>
                        <Select
                          onValueChange={(value) => handleTimeLockChange(value)}
                          defaultValue={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select time lock period" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="30">30 Days</SelectItem>
                            <SelectItem value="90">90 Days</SelectItem>
                            <SelectItem value="180">6 Months</SelectItem>
                            <SelectItem value="365">1 Year</SelectItem>
                            <SelectItem value="730">2 Years</SelectItem>
                            <SelectItem value="1825">5 Years</SelectItem>
                            <SelectItem value="3650">10 Years</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          How long the assets will be locked in the vault
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Advanced Technologies Section */}
                  <div className="bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 p-5 rounded-lg border-2 border-[#6B00D7]/40 mb-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-gradient-to-bl from-[#FF5AF7]/30 to-transparent w-32 h-32 rounded-bl-full"></div>
                    
                    <h3 className="text-xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">Advanced Security Technologies</h3>
                    <p className="text-gray-300 mb-4 text-sm">Our revolutionary security features protect your assets across multiple blockchains</p>
                    
                    <div className="space-y-4">
                      {/* Triple-Chain Security */}
                      <FormField
                        control={form.control}
                        name="tripleChainSecurity"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-[#6B00D7]/50 p-4 shadow-lg bg-[#1A1A1A] hover:border-[#FF5AF7]/50 transition-all">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={(checked) => {
                                  field.onChange(checked);
                                  setUseTripleChainSecurity(!!checked);
                                }}
                                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#6B00D7] data-[state=checked]:to-[#FF5AF7]"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-base font-medium text-white">
                                Triple-Chain Security Architecture
                              </FormLabel>
                              <FormDescription className="text-gray-300">
                                Distributes your vault security across Ethereum, Solana, and TON blockchains for unbreakable protection.
                                <span className="block mt-1 text-xs text-[#FF5AF7]">Recommended for all vaults</span>
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      {/* Sovereign Fortress Security Level Selector - Only displayed for Standard/Fortress vaults */}
                      {form.watch('vaultType') === 'standard' && (
                        <FormField
                          control={form.control}
                          name="metadata.securityLevel"
                          render={({ field }) => (
                            <FormItem className="rounded-md border border-[#6B00D7]/50 p-4 shadow-lg bg-[#1A1A1A]">
                              <FormLabel className="text-base font-medium text-white mb-3 block">
                                Sovereign Fortress™ Security Protocol Level
                              </FormLabel>
                              <FormDescription className="text-gray-300 mb-4">
                                Select the security level appropriate for your asset value
                              </FormDescription>
                              
                              <div className="grid grid-cols-2 gap-3 mt-3">
                                <div
                                  className={`border rounded-lg p-3 cursor-pointer transition-all duration-200 hover:border-[#FF5AF7] 
                                    ${field.value === 'standard' ? 'border-[#FF5AF7] bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20' : 'border-gray-700'}`}
                                  onClick={() => field.onChange('standard')}
                                >
                                  <div className="flex items-center mb-2">
                                    <div className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs mr-2">
                                      <span>1</span>
                                    </div>
                                    <h4 className="font-medium text-sm">Standard</h4>
                                  </div>
                                  <p className="text-xs text-gray-400">Basic security suitable for lower value assets</p>
                                  <div className="mt-2 text-xs text-gray-500">
                                    <div className="flex justify-between">
                                      <span>Falcon-512</span>
                                      <span>Kyber-512</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div
                                  className={`border rounded-lg p-3 cursor-pointer transition-all duration-200 hover:border-[#FF5AF7] 
                                    ${field.value === 'enhanced' ? 'border-[#FF5AF7] bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20' : 'border-gray-700'}`}
                                  onClick={() => field.onChange('enhanced')}
                                >
                                  <div className="flex items-center mb-2">
                                    <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs mr-2">
                                      <span>2</span>
                                    </div>
                                    <h4 className="font-medium text-sm">Enhanced</h4>
                                  </div>
                                  <p className="text-xs text-gray-400">Medium-grade security for valuable assets</p>
                                  <div className="mt-2 text-xs text-gray-500">
                                    <div className="flex justify-between">
                                      <span>Falcon-1024</span>
                                      <span>Kyber-768</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div
                                  className={`border rounded-lg p-3 cursor-pointer transition-all duration-200 hover:border-[#FF5AF7] 
                                    ${field.value === 'maximum' ? 'border-[#FF5AF7] bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20' : 'border-gray-700'}`}
                                  onClick={() => field.onChange('maximum')}
                                >
                                  <div className="flex items-center mb-2">
                                    <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs mr-2">
                                      <span>3</span>
                                    </div>
                                    <h4 className="font-medium text-sm">Maximum</h4>
                                  </div>
                                  <p className="text-xs text-gray-400">High-grade security for high-value assets</p>
                                  <div className="mt-2 text-xs text-gray-500">
                                    <div className="flex justify-between">
                                      <span>CRYSTALS-Dilithium</span>
                                      <span>Kyber-1024</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div
                                  className={`border rounded-lg p-3 cursor-pointer transition-all duration-200 hover:border-[#FF5AF7] 
                                    ${field.value === 'fortress' ? 'border-[#FF5AF7] bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20' : 'border-gray-700'}`}
                                  onClick={() => field.onChange('fortress')}
                                >
                                  <div className="flex items-center mb-2">
                                    <div className="w-5 h-5 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center text-xs mr-2">
                                      <span>★</span>
                                    </div>
                                    <h4 className="font-medium text-sm">Fortress™</h4>
                                  </div>
                                  <p className="text-xs text-gray-400">Military-grade for critical assets</p>
                                  <div className="mt-2 text-xs text-gray-500">
                                    <div className="flex justify-between">
                                      <span>SPHINCS+</span>
                                      <span>FrodoKEM-1344</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <p className="text-xs text-gray-500 mt-3 pl-2">
                                {field.value === 'standard' && "Recommended for assets under 10,000 USD"}
                                {field.value === 'enhanced' && "Recommended for assets between 10,000 - 100,000 USD"}
                                {field.value === 'maximum' && "Recommended for assets between 100,000 - 1,000,000 USD"}
                                {field.value === 'fortress' && "Recommended for assets over 1,000,000 USD"}
                              </p>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      
                      {/* Sovereign Fortress Premium Features - Only shown for standard vault type */}
                      {form.watch('vaultType') === 'standard' && (
                        <div className="rounded-md border border-[#FF5AF7]/50 p-4 shadow-lg bg-[#1A1A1A] mb-4">
                          <div className="flex items-start mb-3">
                            <div className="p-2 rounded-full bg-gradient-to-r from-[#FF5AF7]/20 to-[#6B00D7]/20 mr-3">
                              <Shield className="h-4 w-4 text-[#FF5AF7]" />
                            </div>
                            <div>
                              <h4 className="text-base font-medium text-white">Sovereign Fortress™ Premium Features</h4>
                              <p className="text-sm text-gray-400 mt-1">Enhanced security technologies exclusive to Sovereign Fortress™ vaults</p>
                            </div>
                          </div>
                          
                          {/* Security Feature Cards */}
                          <div className="grid grid-cols-2 gap-2 mt-3">
                            <div className="p-2 rounded bg-black/30 border border-[#6B00D7]/30">
                              <div className="flex items-center mb-1">
                                <span className="w-3 h-3 rounded-full bg-[#FF5AF7]/30 mr-2"></span>
                                <h5 className="text-xs font-medium text-white">Quantum-Resistant Encryption</h5>
                              </div>
                              <p className="text-[10px] text-gray-400">
                                {form.watch('metadata.securityLevel') === 'standard' && "Falcon-512 signatures with Kyber-512 encryption"}
                                {form.watch('metadata.securityLevel') === 'enhanced' && "Falcon-1024 signatures with Kyber-768 encryption"}
                                {form.watch('metadata.securityLevel') === 'maximum' && "CRYSTALS-Dilithium signatures with Kyber-1024 encryption"}
                                {form.watch('metadata.securityLevel') === 'fortress' && "SPHINCS+ signatures with FrodoKEM-1344 encryption"}
                              </p>
                            </div>
                            
                            <div className="p-2 rounded bg-black/30 border border-[#6B00D7]/30">
                              <div className="flex items-center mb-1">
                                <span className="w-3 h-3 rounded-full bg-[#FF5AF7]/30 mr-2"></span>
                                <h5 className="text-xs font-medium text-white">Adaptive Security</h5>
                              </div>
                              <p className="text-[10px] text-gray-400">
                                {form.watch('metadata.securityLevel') === 'standard' && "Basic threat monitoring & response"}
                                {form.watch('metadata.securityLevel') === 'enhanced' && "Moderate threat analysis & protection"}
                                {form.watch('metadata.securityLevel') === 'maximum' && "Advanced threat intelligence & prevention"}
                                {form.watch('metadata.securityLevel') === 'fortress' && "Military-grade autonomous defense system"}
                              </p>
                            </div>
                            
                            <div className="p-2 rounded bg-black/30 border border-[#6B00D7]/30">
                              <div className="flex items-center mb-1">
                                <span className="w-3 h-3 rounded-full bg-[#FF5AF7]/30 mr-2"></span>
                                <h5 className="text-xs font-medium text-white">Recovery Protocol</h5>
                              </div>
                              <p className="text-[10px] text-gray-400">
                                {form.watch('metadata.securityLevel') === 'standard' && "24-hour recovery timeframe"}
                                {form.watch('metadata.securityLevel') === 'enhanced' && "8-hour recovery timeframe"}
                                {form.watch('metadata.securityLevel') === 'maximum' && "1-hour recovery timeframe"}
                                {form.watch('metadata.securityLevel') === 'fortress' && "Instant recovery with zero downtime"}
                              </p>
                            </div>
                            
                            <div className="p-2 rounded bg-black/30 border border-[#6B00D7]/30">
                              <div className="flex items-center mb-1">
                                <span className="w-3 h-3 rounded-full bg-[#FF5AF7]/30 mr-2"></span>
                                <h5 className="text-xs font-medium text-white">Privacy Layer</h5>
                              </div>
                              <p className="text-[10px] text-gray-400">
                                {form.watch('metadata.securityLevel') === 'standard' && "Basic zero-knowledge proofs"}
                                {form.watch('metadata.securityLevel') === 'enhanced' && "Advanced zero-knowledge schemes"}
                                {form.watch('metadata.securityLevel') === 'maximum' && "Enterprise-grade privacy protections"}
                                {form.watch('metadata.securityLevel') === 'fortress' && "Military-grade obfuscation techniques"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Cross-Chain Storage Options */}
                      <div className="rounded-md border border-[#6B00D7]/50 p-4 shadow-lg bg-[#1A1A1A]">
                        <div className="flex items-start">
                          <div className="p-2 rounded-full bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 mr-3">
                            <ArrowLeftRight className="h-4 w-4 text-[#FF5AF7]" />
                          </div>
                          <div>
                            <h4 className="text-base font-medium text-white">Cross-Chain Storage Options</h4>
                            <p className="text-sm text-gray-300 mt-1">Your vault can store assets in any combination of supported blockchains</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="px-2 py-1 text-xs rounded-full bg-[#6B00D7]/20 text-white">Ethereum</span>
                              <span className="px-2 py-1 text-xs rounded-full bg-[#6B00D7]/20 text-white">Solana</span>
                              <span className="px-2 py-1 text-xs rounded-full bg-[#6B00D7]/20 text-white">TON</span>
                              <span className="px-2 py-1 text-xs rounded-full bg-[#6B00D7]/20 text-white">Bitcoin</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Flexible Payment Methods */}
                      <div className="rounded-md border border-[#6B00D7]/50 p-4 shadow-lg bg-[#1A1A1A]">
                        <div className="flex items-start">
                          <div className="p-2 rounded-full bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 mr-3">
                            <Coins className="h-4 w-4 text-[#FF5AF7]" />
                          </div>
                          <div>
                            <h4 className="text-base font-medium text-white">Multiple Payment Options</h4>
                            <p className="text-sm text-gray-300 mt-1">Pay for your vault with any cryptocurrency you prefer</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="px-2 py-1 text-xs rounded-full bg-[#FF5AF7]/20 text-white">CVT Token</span>
                              <span className="px-2 py-1 text-xs rounded-full bg-[#FF5AF7]/20 text-white">ETH</span>
                              <span className="px-2 py-1 text-xs rounded-full bg-[#FF5AF7]/20 text-white">SOL</span>
                              <span className="px-2 py-1 text-xs rounded-full bg-[#FF5AF7]/20 text-white">TON</span>
                              <span className="px-2 py-1 text-xs rounded-full bg-[#FF5AF7]/20 text-white">BTC</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-[#6B00D7]/10 to-[#FF5AF7]/10 p-4 rounded-lg border border-[#6B00D7]/20">
                  <h3 className="text-lg font-medium mb-3">Payment Options</h3>
                  <p className="text-sm text-gray-400 mb-4">Choose how you want to pay for vault creation</p>
                  
                  <FormField
                    control={form.control}
                    name="paymentType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-2"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="cvt" />
                              </FormControl>
                              <FormLabel className="font-normal flex items-center">
                                <Coins className="mr-2 h-4 w-4 text-[#FF5AF7]" />
                                Pay with CVT Tokens
                                {currentStakingTier !== StakingTier.NONE && (
                                  <span className="ml-2 text-xs bg-[#6B00D7] text-white px-2 py-0.5 rounded-full">
                                    {currentStakingTier === StakingTier.GUARDIAN && "75% discount"}
                                    {currentStakingTier === StakingTier.ARCHITECT && "90% discount"}
                                    {currentStakingTier === StakingTier.SOVEREIGN && "Free"}
                                  </span>
                                )}
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="native" />
                              </FormControl>
                              <FormLabel className="font-normal flex items-center">
                                <Wallet className="mr-2 h-4 w-4 text-[#6B00D7]" />
                                Pay with Native Token ({selectedBlockchain})
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="mt-4 flex justify-between items-center text-sm">
                    <span>Creation Fee:</span>
                    <span className="font-semibold flex items-center">
                      {getCreationCost().amount} {getCreationCost().currency}
                      {getCreationCost().discount && (
                        <span className="ml-2 text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full">
                          {getCreationCost().discount} discount applied
                        </span>
                      )}
                    </span>
                  </div>
                </div>
                
                {/* Enhanced Media Uploader - shown when includeAttachments is checked */}
                {form.watch("includeAttachments") && !showAttachmentUpload && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium mb-2">Media Attachments (Optional)</h3>
                    <EnhancedMediaUploader
                      vaultId={createdVaultId || undefined}
                      onAttachmentsChange={handleAttachmentsChange}
                    />
                  </div>
                )}

                {showAttachmentUpload && createdVaultId ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Add Attachments to Your Vault</h3>
                    <FileUpload
                      vaultId={createdVaultId}
                      onUploadComplete={handleAttachmentComplete}
                    />
                    <Button 
                      onClick={handleFinishCreation}
                      className="mt-4 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white">
                      Finish
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-end space-x-4 pt-4">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => form.reset()}
                    >
                      Reset
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={mutation.isPending || isBlockchainDeploying}
                      className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white"
                    >
                      {mutation.isPending || isBlockchainDeploying ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {deploymentStatus || "Creating Vault..."}
                        </div>
                      ) : (
                        <div className="flex items-center">
                          Create Vault
                          <ArrowRightCircle className="ml-2 h-4 w-4" />
                        </div>
                      )}
                    </Button>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}
