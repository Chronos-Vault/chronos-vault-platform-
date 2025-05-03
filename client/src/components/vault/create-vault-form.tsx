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
import { useCVTToken, StakingTier } from "@/contexts/cvt-token-context";
import { Coins, Wallet } from "lucide-react";

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
  // Gift-specific metadata
  giftExperience: z.object({
    experienceType: z.string().optional(),
    unlockStages: z.array(z.string()).optional(),
    augmentedMedia: z.boolean().optional(),
    appreciationRate: z.number().optional(),
    challenges: z.array(z.string()).optional()
  }).optional()
});

// Extend the vault schema with additional validation
const formSchema = insertVaultSchema.extend({
  confirmAmount: z.string().min(1, "Please confirm the amount"),
  includeAttachments: z.boolean().optional().default(true),
  unlockDate: z.string(), // Modified to handle string for date ISO
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
  requiredSignatures: z.string().optional(),
  
  // Biometric vault fields
  biometricType: z.string().optional(),
  
  // Time-lock vault fields
  scheduleType: z.string().optional(),
  
  // Geolocation vault fields
  geoRadius: z.string().optional(),
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
  securityLevel: z.string().optional(),
  
  // Gift-specific fields
  giftType: z.string().optional(),
  giftRecipient: z.string().optional(),
  giftMessage: z.string().optional()
}).refine((data) => data.assetAmount === data.confirmAmount, {
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
}

const CreateVaultForm = ({ 
  initialVaultType = "standard",
  selectedBlockchain = BlockchainType.TON,
  isWalletConnected = false,
  walletInfo,
  ton
}: CreateVaultFormProps) => {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(initialVaultType);
  const [createdVaultId, setCreatedVaultId] = useState<number | null>(null);
  const [showAttachmentUpload, setShowAttachmentUpload] = useState(false);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [useTripleChainSecurity, setUseTripleChainSecurity] = useState<boolean>(false);
  
  // Get CVT token context for balance and pricing
  const { tokenBalance, currentStakingTier } = useCVTToken();
  
  // Function to get vault creation cost based on vault type
  const getCreationCost = () => {
    const vaultType = form?.watch('vaultType') || initialVaultType;
    
    // Base costs in CVT tokens
    const costs = {
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
    const nativeCosts = {
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
        attachmentsEncryption: "AES-256"
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
      const response = await apiRequest("POST", "/api/vaults", data);
      return response.json();
    },
    onSuccess: (data) => {
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
                      <SelectItem value="recurring">Recurring Schedule</SelectItem>
                      <SelectItem value="conditional">Conditional Release</SelectItem>
                      <SelectItem value="phased">Phased Release</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Type of time-lock schedule for this vault
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>
        );
        
      case 'geolocation':
        return (
          <div className="space-y-4 border border-[#00D74B]/20 rounded-lg p-4 bg-gradient-to-r from-[#1A1A1A] to-[#1A2A1F]">
            <h3 className="text-lg text-[#00D74B] font-medium">Geolocation Vault Settings</h3>
            <p className="text-sm text-gray-300">Configure geolocation access settings for this vault</p>
            
            <FormField
              control={form.control}
              name="geoRadius"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Safe Zone Radius (meters)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="100" {...field} />
                  </FormControl>
                  <FormDescription>
                    Radius in meters around the specified location
                  </FormDescription>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="geoLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location (Latitude, Longitude)</FormLabel>
                  <FormControl>
                    <Input placeholder="40.7128, -74.0060" {...field} />
                  </FormControl>
                  <FormDescription>
                    Specify the center point coordinates of the safe zone
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>
        );
        
      case 'cross-chain':
        return (
          <div className="space-y-4 border border-[#8B00D7]/20 rounded-lg p-4 bg-gradient-to-r from-[#1A1A1A] to-[#231A2A]">
            <h3 className="text-lg text-[#8B00D7] font-medium">Cross-Chain Vault Settings</h3>
            <p className="text-sm text-gray-300">Configure cross-chain security settings for this vault</p>
            
            <FormField
              control={form.control}
              name="additionalChains"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Blockchains</FormLabel>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="chain-ethereum" />
                      <label htmlFor="chain-ethereum" className="text-sm">Ethereum</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="chain-solana" />
                      <label htmlFor="chain-solana" className="text-sm">Solana</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="chain-bsc" />
                      <label htmlFor="chain-bsc" className="text-sm">Binance Smart Chain</label>
                    </div>
                  </div>
                  <FormDescription>
                    Select additional blockchains to use for cross-chain security
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>
        );
        
      case 'smart-contract':
        return (
          <div className="space-y-4 border border-[#5271FF]/20 rounded-lg p-4 bg-gradient-to-r from-[#1A1A1A] to-[#1A1E2A]">
            <h3 className="text-lg text-[#5271FF] font-medium">Smart Contract Vault Settings</h3>
            <p className="text-sm text-gray-300">Configure automation rules for this smart contract vault</p>
            
            <FormField
              control={form.control}
              name="contractCondition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contract Condition Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || "time"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="time">Time-based</SelectItem>
                      <SelectItem value="oracle">Oracle</SelectItem>
                      <SelectItem value="price">Price Trigger</SelectItem>
                      <SelectItem value="event">Event Trigger</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Type of condition that will trigger this smart contract
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>
        );
        
      case 'dynamic':
        return (
          <div className="space-y-4 border border-[#FF5151]/20 rounded-lg p-4 bg-gradient-to-r from-[#1A1A1A] to-[#2A1A1A]">
            <h3 className="text-lg text-[#FF5151] font-medium">Dynamic Vault Settings</h3>
            <p className="text-sm text-gray-300">Configure dynamic behavior rules for this vault</p>
            
            <FormField
              control={form.control}
              name="dynamicRules"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dynamic Rule Set</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || "market"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select rule set" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="market">Market Conditions</SelectItem>
                      <SelectItem value="user">User Behavior</SelectItem>
                      <SelectItem value="network">Network Activity</SelectItem>
                      <SelectItem value="custom">Custom Rules</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Set of rules that determines how this vault behaves dynamically
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>
        );
        
      case 'nft-powered':
        return (
          <div className="space-y-4 border border-[#CE19FF]/20 rounded-lg p-4 bg-gradient-to-r from-[#1A1A1A] to-[#261A2A]">
            <h3 className="text-lg text-[#CE19FF] font-medium">NFT-Powered Vault Settings</h3>
            <p className="text-sm text-gray-300">Configure NFT requirements for this vault</p>
            
            <FormField
              control={form.control}
              name="nftType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NFT Requirement Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || "ownership"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select NFT requirement" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ownership">Ownership Proof</SelectItem>
                      <SelectItem value="fractional">Fractional Ownership</SelectItem>
                      <SelectItem value="collection">Collection Membership</SelectItem>
                      <SelectItem value="dao">DAO Membership</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Type of NFT requirement for accessing this vault
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>
        );
        
      case 'unique':
        return (
          <div className="space-y-4 border border-[#fca103]/20 rounded-lg p-4 bg-gradient-to-r from-[#1A1A1A] to-[#2A231A]">
            <h3 className="text-lg text-[#fca103] font-medium">Unique Security Vault Settings</h3>
            <p className="text-sm text-gray-300">Configure unique security protocols for this vault</p>
            
            <FormField
              control={form.control}
              name="securityLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Security Level</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || "enterprise"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select security level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="enhanced">Enhanced</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Level of security protocols for this vault
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
    
    if (isWalletConnected && selectedBlockchain) {
      try {
        setIsBlockchainDeploying(true);
        
        // Process payment based on payment type
        if (data.paymentType === 'cvt') {
          setDeploymentStatus("Processing CVT payment...");
          // Check if user has enough CVT tokens
          const userBalance = parseFloat(tokenBalance || '0');
          if (userBalance < creationCost.amount) {
            throw new Error(`Insufficient CVT balance. Need ${creationCost.amount} CVT but you have ${userBalance} CVT.`);
          }
          
          // In a real implementation, we would call the CVT token contract to transfer tokens
          await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate token transfer
          setDeploymentStatus("CVT payment confirmed!");
          paymentSuccess = true;
        } else {
          // Native token payment
          setDeploymentStatus(`Processing ${creationCost.currency} payment...`);
          // Would check native token balance here
          await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate token transfer
          setDeploymentStatus(`${creationCost.currency} payment confirmed!`);
          paymentSuccess = true;
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
        tripleChainSecurity: useTripleChainSecurity, // Add our Triple-Chain Security flag
        securityLevel: useTripleChainSecurity ? 5 : 3, // Increase security level if Triple-Chain is enabled
        attachments: attachments.length > 0 ? attachments : undefined,
        ...(giftExperience && { giftExperience }),
        ...(deploymentMetadata && { blockchain: deploymentMetadata }),
        ...(useTripleChainSecurity && { 
          securityArchitecture: {
            type: "triple-chain",
            chains: ["TON", "Ethereum", "Solana"],
            crossValidation: true,
            redundancy: "Progressive",
            securityLevel: "Enterprise"
          }
        }),
      }
    };
    
    // Store in database
    mutation.mutate(vaultData as FormValues);
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
                          <Input placeholder="My Legacy Vault" {...field} />
                        </FormControl>
                        <FormDescription>
                          Give your vault a memorable name
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
                        <FormLabel>Time Lock Period</FormLabel>
                        <Select 
                          onValueChange={handleTimeLockChange}
                          defaultValue={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a time period" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="30">1 Month</SelectItem>
                            <SelectItem value="90">3 Months</SelectItem>
                            <SelectItem value="180">6 Months</SelectItem>
                            <SelectItem value="365">1 Year</SelectItem>
                            <SelectItem value="730">2 Years</SelectItem>
                            <SelectItem value="1825">5 Years</SelectItem>
                            <SelectItem value="3650">10 Years</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Assets will be locked until this period expires
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
                          placeholder="Describe the purpose of this vault"
                          className="resize-none"
                          value={field.value || ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormDescription>
                        Add any details about this vault's purpose or beneficiaries
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Enhanced Media Uploader - shown when includeAttachments is checked */}
                {form.watch("includeAttachments") && !showAttachmentUpload && (
                  <div className="border border-[#FF5AF7]/20 rounded-lg p-4 bg-[#1A1A1A] mt-4 mb-4">
                    <h3 className="text-lg font-semibold mb-2 text-[#FF5AF7]">Media Attachments</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Add multimedia files to your vault. These files will be encrypted and only 
                      accessible after the time-lock period expires.
                    </p>
                    
                    <EnhancedMediaUploader
                      onAttachmentsChange={handleAttachmentsChange}
                      maxUploads={5}
                      allowedTypes={["image/*", "application/pdf", "video/*", "audio/*"]}
                      initialAttachments={attachments}
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                            <SelectItem value="USDC">USD Coin (USDC)</SelectItem>
                            <SelectItem value="USDT">Tether (USDT)</SelectItem>
                            <SelectItem value="DAI">Dai (DAI)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select the type of asset to lock
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="assetAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Asset Amount</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter the amount to lock in your vault
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="confirmAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Amount</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormDescription>
                        Re-enter the amount to confirm
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="includeAttachments"
                  render={({ field }) => (
                    <FormItem className="p-4 border border-[#6B00D7]/20 rounded-lg bg-gradient-to-r from-[#6B00D7]/5 to-[#FF5AF7]/5">
                      <div className="flex items-center space-x-3">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="form-checkbox h-5 w-5 text-purple-600 rounded border-gray-400 focus:ring-purple-500"
                          />
                        </FormControl>
                        <div>
                          <FormLabel className="text-base font-medium">Include Media Attachments</FormLabel>
                          <FormDescription className="text-sm text-gray-400">
                            Add important documents, images, videos or other files to your vault
                          </FormDescription>
                        </div>
                      </div>
                    </FormItem>
                  )}
                />

                {/* Payment Options Section - New Dual Token System */}
                <div className="mb-6 mt-8">
                  <div className="p-5 border-2 border-[#6B00D7]/40 rounded-lg bg-gradient-to-r from-[#15121C] to-[#1E1A24]">
                    <div className="flex items-center mb-3">
                      <div className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] p-2 rounded-full mr-3">
                        <Coins className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="font-poppins font-semibold text-white text-lg">Payment Method</h3>
                    </div>
                    
                    <p className="text-gray-300 mb-4 ml-12">
                      Choose how you'd like to pay for your vault creation.
                    </p>
                    
                    <FormField
                      control={form.control}
                      name="paymentType"
                      render={({ field }) => (
                        <FormItem className="ml-12 space-y-4">
                          <RadioGroup
                            onValueChange={(value) => {
                              field.onChange(value);
                              // Force a re-render to update pricing
                              form.trigger();
                            }}
                            defaultValue={field.value}
                            className="flex flex-col space-y-3"
                          >
                            <FormItem className="p-4 border border-[#6B00D7]/40 rounded-lg bg-[#1A1A1A]/50 space-y-0">
                              <div className="flex items-center space-x-3">
                                <FormControl>
                                  <RadioGroupItem value="cvt" id="cvt-payment" className="text-[#FF5AF7]" />
                                </FormControl>
                                <div className="flex-1">
                                  <FormLabel htmlFor="cvt-payment" className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
                                    Pay with CVT Token
                                    <span className="ml-2 text-xs py-1 px-2 bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 text-[#FF5AF7] rounded-full">
                                      RECOMMENDED
                                    </span>
                                  </FormLabel>
                                  <FormDescription className="text-sm text-gray-300">
                                    Use Chronos Vault Tokens for benefits: Premium features, fee discounts, & governance rights
                                  </FormDescription>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Wallet className="h-4 w-4 text-[#FF5AF7]" />
                                  <span className="text-[#FF5AF7] font-medium">CVT</span>
                                </div>
                              </div>
                            </FormItem>
                            
                            <FormItem className="p-4 border border-gray-700/40 rounded-lg bg-[#1A1A1A]/50 space-y-0">
                              <div className="flex items-center space-x-3">
                                <FormControl>
                                  <RadioGroupItem value="native" id="native-payment" />
                                </FormControl>
                                <div className="flex-1">
                                  <FormLabel htmlFor="native-payment" className="text-lg font-medium text-white">
                                    Pay with Multi-Chain Tokens
                                  </FormLabel>
                                  <FormDescription className="text-sm text-gray-300">
                                    Pay with any major cryptocurrency for vault creation
                                  </FormDescription>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    <span className="px-2 py-1 text-xs bg-[#6B00D7]/20 text-white rounded-full border border-[#6B00D7]/30">TON</span>
                                    <span className="px-2 py-1 text-xs bg-[#6B00D7]/20 text-white rounded-full border border-[#6B00D7]/30">ETH</span>
                                    <span className="px-2 py-1 text-xs bg-[#6B00D7]/20 text-white rounded-full border border-[#6B00D7]/30">SOL</span>
                                    <span className="px-2 py-1 text-xs bg-[#6B00D7]/20 text-white rounded-full border border-[#6B00D7]/30">BTC</span>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <span className="text-gray-300">
                                    {selectedBlockchain === BlockchainType.TON ? '💎' : 
                                     selectedBlockchain === BlockchainType.ETHEREUM ? 'Ξ' : '◎'}
                                  </span>
                                </div>
                              </div>
                            </FormItem>
                          </RadioGroup>
                          
                          {/* Payment pricing details */}
                          {form?.formState.isValid && (
                            <div className="mt-4 p-4 border border-[#6B00D7]/20 rounded-lg bg-[#15121C]/80">
                              <div className="flex justify-between items-center">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-300">Estimated Cost:</h4>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <span className="text-lg font-bold text-white">
                                      {getCreationCost().amount} {getCreationCost().currency}
                                    </span>
                                    {getCreationCost().discount && (
                                      <span className="text-xs py-0.5 px-2 bg-[#6B00D7]/20 text-[#FF5AF7] rounded-full">
                                        {getCreationCost().discount} discount applied
                                      </span>
                                    )}
                                  </div>
                                </div>
                                
                                {form.watch('paymentType') === 'cvt' && (
                                  <div className="text-right">
                                    <span className="text-xs text-gray-400">Your CVT Balance</span>
                                    <p className="text-sm font-medium text-white">{tokenBalance || '0'} CVT</p>
                                  </div>
                                )}
                              </div>
                              
                              {/* Show CVT benefits if using CVT payment */}
                              {form.watch('paymentType') === 'cvt' && (
                                <div className="mt-3 pt-3 border-t border-[#6B00D7]/20">
                                  <span className="text-xs text-[#FF5AF7]">CVT Payment Benefits:</span>
                                  <ul className="mt-1 space-y-1 text-xs text-gray-400">
                                    <li className="flex items-start">
                                      <span className="text-[#FF5AF7] mr-1">•</span> Premium vault features unlocked
                                    </li>
                                    <li className="flex items-start">
                                      <span className="text-[#FF5AF7] mr-1">•</span> Voting rights for platform governance
                                    </li>
                                    <li className="flex items-start">
                                      <span className="text-[#FF5AF7] mr-1">•</span> Staking benefits and fee reductions
                                    </li>
                                  </ul>
                                </div>
                              )}
                              
                              {/* Staking Tier Information */}
                              {currentStakingTier !== StakingTier.NONE && form.watch('paymentType') === 'cvt' && (
                                <div className="mt-3 pt-3 border-t border-[#6B00D7]/20">
                                  <span className="text-xs text-[#FF5AF7]">
                                    {currentStakingTier} Tier Active
                                  </span>
                                  <p className="mt-1 text-xs text-gray-400">
                                    Your staking tier provides you with {getCreationCost().discount} discount on all vault creations.
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Triple-Chain Security Section - Made more prominent */}
                <div className="mb-6 mt-8">
                  <div className="p-5 border-2 border-[#6B00D7]/40 rounded-lg bg-gradient-to-r from-[#6B00D7]/10 to-[#FF5AF7]/10 animate-pulse-slow">
                    <div className="flex items-center mb-3">
                      <div className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] p-2 rounded-full mr-3">
                        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <h3 className="font-poppins font-semibold text-white text-lg">Triple-Chain Security Architecture</h3>
                    </div>
                    
                    <p className="text-gray-300 mb-4 ml-12">
                      Our revolutionary security system distributes your vault's security across multiple blockchains (TON, Ethereum, and Solana)
                      for unmatched protection against single-chain vulnerabilities.
                    </p>
                    
                    <FormField
                      control={form.control}
                      name="tripleChainSecurity"
                      render={({ field }) => (
                        <FormItem className="p-4 border border-[#6B00D7]/40 rounded-lg bg-[#1A1A1A]/50 ml-12">
                          <div className="flex items-center space-x-3">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={(e) => {
                                  field.onChange(e);
                                  setUseTripleChainSecurity(e.target.checked);
                                }}
                                className="form-checkbox h-6 w-6 text-[#6B00D7] rounded border-gray-400 focus:ring-[#6B00D7]"
                              />
                            </FormControl>
                            <div>
                              <FormLabel className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
                                Enable Triple-Chain Security
                              </FormLabel>
                              <FormDescription className="text-sm text-gray-300">
                                Increase your vault's security rating from Level 3 to Level 5 (Enterprise Grade)
                              </FormDescription>
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <TabsContent value="legacy" className="mt-0 space-y-6">
                  <div className="bg-[#6B00D7]/10 p-4 rounded-lg mb-4">
                    <div className="flex items-center mb-3">
                      <div className="bg-gradient-to-r from-[#6B00D7] to-[#9B4DFF] p-1.5 rounded-full mr-3">
                        <i className="ri-lock-password-line text-white text-xl"></i>
                      </div>
                      <h3 className="font-poppins font-semibold text-[#6B00D7]">Advanced Legacy Vault Features</h3>
                    </div>
                    
                    <p className="text-gray-300 mb-4 text-sm">
                      The most sophisticated inheritance solution in blockchain with revolutionary security and distribution features.
                    </p>
                    
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-line text-[#6B00D7] mt-0.5 mr-2"></i>
                        <span>Multi-chain inheritance protection with smart failover mechanisms</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-line text-[#6B00D7] mt-0.5 mr-2"></i>
                        <span>Add multiple beneficiaries with dynamic allocation percentages</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-line text-[#6B00D7] mt-0.5 mr-2"></i>
                        <span>Proof-of-life integration with automated verification</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-line text-[#6B00D7] mt-0.5 mr-2"></i>
                        <span>IPFS permanent storage for important family documents</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="border border-[#6B00D7]/30 rounded-lg p-3">
                      <h4 className="font-medium text-[#6B00D7] mb-2 text-sm">Multi-Chain Protection</h4>
                      <p className="text-xs text-gray-400">Distribute your assets across multiple blockchains for maximum protection against single-chain vulnerabilities.</p>
                      
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="enableEthereum"
                            className="form-checkbox h-4 w-4 text-[#6B00D7] rounded border-gray-400 focus:ring-[#6B00D7]"
                            defaultChecked
                          />
                          <label htmlFor="enableEthereum" className="ml-2 text-xs text-gray-300">Ethereum</label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="enableSolana"
                            className="form-checkbox h-4 w-4 text-[#6B00D7] rounded border-gray-400 focus:ring-[#6B00D7]"
                          />
                          <label htmlFor="enableSolana" className="ml-2 text-xs text-gray-300">Solana</label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="enableTON"
                            className="form-checkbox h-4 w-4 text-[#6B00D7] rounded border-gray-400 focus:ring-[#6B00D7]"
                          />
                          <label htmlFor="enableTON" className="ml-2 text-xs text-gray-300">TON</label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-[#6B00D7]/30 rounded-lg p-3">
                      <h4 className="font-medium text-[#6B00D7] mb-2 text-sm">Proof-of-Life Integration</h4>
                      <p className="text-xs text-gray-400">Set up periodic verification to prove your status. If verification stops, the vault will be released to beneficiaries.</p>
                      
                      <div className="mt-3">
                        <label className="block text-xs text-gray-300 mb-1">Check-In Period</label>
                        <select className="w-full bg-[#1A1A1A] border border-[#6B00D7]/30 rounded text-xs text-gray-300 p-1.5">
                          <option value="30">Monthly (30 days)</option>
                          <option value="90">Quarterly (90 days)</option>
                          <option value="180">Bi-Annually (180 days)</option>
                          <option value="365">Annually (365 days)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-[#6B00D7]/30 rounded-lg p-3 mb-2">
                    <h4 className="font-medium text-[#6B00D7] mb-2 text-sm">IPFS Document Storage</h4>
                    <p className="text-xs text-gray-400 mb-3">Important documents will be permanently stored using IPFS technology for decentralized and tamper-proof security.</p>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="enableIPFS"
                        className="form-checkbox h-4 w-4 text-[#6B00D7] rounded border-gray-400 focus:ring-[#6B00D7]"
                      />
                      <label htmlFor="enableIPFS" className="ml-2 text-xs text-gray-300">Enable IPFS Permanent Storage</label>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="investment" className="mt-0 space-y-6">
                  <div className="bg-[#FF5AF7]/10 p-4 rounded-lg mb-4">
                    <div className="flex items-center mb-3">
                      <div className="bg-gradient-to-r from-[#FF5AF7] to-[#FF00A8] p-1.5 rounded-full mr-3">
                        <i className="ri-line-chart-line text-white text-xl"></i>
                      </div>
                      <h3 className="font-poppins font-semibold text-[#FF5AF7]">Advanced Investment Vault</h3>
                    </div>
                    
                    <p className="text-gray-300 mb-4 text-sm">
                      Revolutionary investment vault with AI-powered yield optimization and multi-chain security features.
                    </p>
                    
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-line text-[#FF5AF7] mt-0.5 mr-2"></i>
                        <span>Cross-chain yield optimization with automated asset movement</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-line text-[#FF5AF7] mt-0.5 mr-2"></i>
                        <span>AI-powered portfolio rebalancing for optimal returns</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-line text-[#FF5AF7] mt-0.5 mr-2"></i>
                        <span>Price-triggered actions with Chainlink oracle integration</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-line text-[#FF5AF7] mt-0.5 mr-2"></i>
                        <span>Bitcoin halving event synchronization for strategic unlocking</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="border border-[#FF5AF7]/30 rounded-lg p-3">
                      <h4 className="font-medium text-[#FF5AF7] mb-2 text-sm">Cross-Chain Yield Optimization</h4>
                      <p className="text-xs text-gray-400">Automatically move assets across chains to maximize yield while maintaining security.</p>
                      
                      <div className="mt-3">
                        <label className="block text-xs text-gray-300 mb-1">Optimization Strategy</label>
                        <select className="w-full bg-[#1A1A1A] border border-[#FF5AF7]/30 rounded text-xs text-gray-300 p-1.5">
                          <option value="balanced">Balanced (Recommended)</option>
                          <option value="aggressive">Aggressive Yield</option>
                          <option value="conservative">Conservative</option>
                          <option value="custom">Custom Parameters</option>
                        </select>
                      </div>
                      
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="enableCrossChainYield"
                            className="form-checkbox h-4 w-4 text-[#FF5AF7] rounded border-gray-400 focus:ring-[#FF5AF7]"
                            defaultChecked
                          />
                          <label htmlFor="enableCrossChainYield" className="ml-2 text-xs text-gray-300">Enable Cross-Chain Yield</label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-[#FF5AF7]/30 rounded-lg p-3">
                      <h4 className="font-medium text-[#FF5AF7] mb-2 text-sm">Price-Triggered Actions</h4>
                      <p className="text-xs text-gray-400">Set asset price thresholds that will trigger unlocking or other actions.</p>
                      
                      <div className="mt-3">
                        <label className="block text-xs text-gray-300 mb-1">Trigger Price (Target)</label>
                        <div className="flex items-center">
                          <select className="w-1/3 bg-[#1A1A1A] border border-[#FF5AF7]/30 rounded-l text-xs text-gray-300 p-1.5">
                            <option value="ETH">ETH</option>
                            <option value="BTC">BTC</option>
                            <option value="SOL">SOL</option>
                          </select>
                          <input 
                            type="text" 
                            placeholder="0.00" 
                            className="w-2/3 bg-[#1A1A1A] border border-[#FF5AF7]/30 rounded-r text-xs text-gray-300 p-1.5"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                    <div className="border border-[#FF5AF7]/30 rounded-lg p-3">
                      <h4 className="font-medium text-[#FF5AF7] mb-2 text-sm">Halving-Event Synchronization</h4>
                      <p className="text-xs text-gray-400 mb-3">Time your vault unlock with the next Bitcoin halving event for strategic asset release.</p>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="enableHalvingSync"
                          className="form-checkbox h-4 w-4 text-[#FF5AF7] rounded border-gray-400 focus:ring-[#FF5AF7]"
                        />
                        <label htmlFor="enableHalvingSync" className="ml-2 text-xs text-gray-300">Sync with next Bitcoin halving</label>
                      </div>
                    </div>
                    
                    <div className="border border-[#FF5AF7]/30 rounded-lg p-3">
                      <h4 className="font-medium text-[#FF5AF7] mb-2 text-sm">Risk-Adjusted Time Locks</h4>
                      <p className="text-xs text-gray-400 mb-3">Longer lock periods receive proportionally higher yield compensation.</p>
                      
                      <div className="mt-1 text-xs text-[#FF5AF7]">
                        <div className="flex justify-between">
                          <span>Current Multiplier:</span>
                          <span className="font-bold">1.75x</span>
                        </div>
                        <div className="h-1 w-full bg-[#1A1A1A] rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#FF5AF7] to-[#FF00A8] rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 border border-[#FF5AF7]/30 rounded-lg bg-[#FF5AF7]/5 my-2">
                    <div className="flex-shrink-0 bg-[#FF5AF7]/10 p-2 rounded-full mr-3">
                      <i className="ri-ai-generate text-[#FF5AF7] text-lg"></i>
                    </div>
                    <div className="text-sm text-gray-300">
                      <span className="font-medium text-[#FF5AF7]">AI-Powered Rebalancing: </span>
                      Our machine learning models automatically adjust your portfolio for maximum returns based on market conditions.
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="project" className="mt-0 space-y-6">
                  <div className="bg-gradient-to-r from-[#6B00D7]/10 to-[#FF5AF7]/10 p-4 rounded-lg mb-4">
                    <div className="flex items-center mb-3">
                      <div className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] p-1.5 rounded-full mr-3">
                        <i className="ri-team-line text-white text-xl"></i>
                      </div>
                      <h3 className="font-poppins font-semibold text-white">Revolutionary Project Vault</h3>
                    </div>
                    
                    <p className="text-gray-300 mb-4 text-sm">
                      The ultimate collaborative vault solution for DAOs, teams, and projects with advanced governance and milestone features.
                    </p>
                    
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-line text-white mt-0.5 mr-2"></i>
                        <span>DAO Governance integration with on-chain voting</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-line text-white mt-0.5 mr-2"></i>
                        <span>Milestone achievement verification via Chainlink oracles</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-line text-white mt-0.5 mr-2"></i>
                        <span>Contribution-based access that adjusts dynamically</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-line text-white mt-0.5 mr-2"></i>
                        <span>Multi-signature with threshold adjustments based on phase</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="border border-purple-500/30 rounded-lg p-3">
                      <h4 className="font-medium text-white mb-2 text-sm">DAO Governance Integration</h4>
                      <p className="text-xs text-gray-400">Implement on-chain governance for team-based decisions on vault management.</p>
                      
                      <div className="mt-3">
                        <label className="block text-xs text-gray-300 mb-1">Governance Structure</label>
                        <select className="w-full bg-[#1A1A1A] border border-purple-500/30 rounded text-xs text-gray-300 p-1.5">
                          <option value="token">Token-weighted Voting</option>
                          <option value="equal">Equal Voting Rights</option>
                          <option value="quadratic">Quadratic Voting</option>
                          <option value="custom">Custom Governance</option>
                        </select>
                      </div>
                      
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="enableDAOIntegration"
                            className="form-checkbox h-4 w-4 text-purple-500 rounded border-gray-400 focus:ring-purple-500"
                          />
                          <label htmlFor="enableDAOIntegration" className="ml-2 text-xs text-gray-300">Enable DAO Integration</label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-purple-500/30 rounded-lg p-3">
                      <h4 className="font-medium text-white mb-2 text-sm">Milestone Verification</h4>
                      <p className="text-xs text-gray-400">Use oracles to verify real-world project milestones for automated unlocking.</p>
                      
                      <div className="mt-3">
                        <label className="block text-xs text-gray-300 mb-1">Milestone Type</label>
                        <select className="w-full bg-[#1A1A1A] border border-purple-500/30 rounded text-xs text-gray-300 p-1.5">
                          <option value="github">GitHub Releases/Commits</option>
                          <option value="api">API Integration</option>
                          <option value="manual">Manual Verification</option>
                          <option value="chainlink">Chainlink Verified Feed</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                    <div className="border border-purple-500/30 rounded-lg p-3">
                      <h4 className="font-medium text-white mb-2 text-sm">Multi-Signature Requirements</h4>
                      <p className="text-xs text-gray-400 mb-3">Set dynamic approval thresholds that adapt based on project phase.</p>
                      
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div>
                          <label className="block text-xs text-gray-300 mb-1">Initial Phase</label>
                          <select className="w-full bg-[#1A1A1A] border border-purple-500/30 rounded text-xs text-gray-300 p-1.5">
                            <option value="100">100% (All members)</option>
                            <option value="75">75% (Majority)</option>
                            <option value="50">50% (Half)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-300 mb-1">Final Phase</label>
                          <select className="w-full bg-[#1A1A1A] border border-purple-500/30 rounded text-xs text-gray-300 p-1.5">
                            <option value="75">75% (Majority)</option>
                            <option value="50">50% (Half)</option>
                            <option value="33">33% (One-third)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-purple-500/30 rounded-lg p-3">
                      <h4 className="font-medium text-white mb-2 text-sm">Cross-Project Dependency</h4>
                      <p className="text-xs text-gray-400 mb-3">Link this vault to other project vaults to create dependency relationships.</p>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="enableCrossDependency"
                          className="form-checkbox h-4 w-4 text-purple-500 rounded border-gray-400 focus:ring-purple-500"
                        />
                        <label htmlFor="enableCrossDependency" className="ml-2 text-xs text-gray-300">Enable Cross-Project Dependency</label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 border border-purple-500/30 rounded-lg bg-gradient-to-r from-[#6B00D7]/5 to-[#FF5AF7]/5 my-2">
                    <div className="flex-shrink-0 bg-gradient-to-r from-[#6B00D7]/10 to-[#FF5AF7]/10 p-2 rounded-full mr-3">
                      <i className="ri-scales-3-line text-white text-lg"></i>
                    </div>
                    <div className="text-sm text-gray-300">
                      <span className="font-medium text-white">Contribution-Based Access: </span>
                      Member access rights adjust dynamically based on their measured contributions to the project.
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="gift" className="mt-0 space-y-6">
                  <div className="bg-[#00D7C3]/10 p-4 rounded-lg mb-4">
                    <div className="flex items-center mb-3">
                      <div className="bg-gradient-to-r from-[#00D7C3] to-[#00A3FF] p-1.5 rounded-full mr-3">
                        <i className="ri-gift-2-fill text-black text-xl"></i>
                      </div>
                      <h3 className="font-poppins font-semibold text-[#00D7C3]">Revolutionary Gift Vault</h3>
                    </div>
                    
                    <p className="text-gray-300 mb-4 text-sm">
                      Create a unique time-locked gift experience that combines digital assets with real-world moments 
                      in ways never seen before in the crypto space.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                      <div className="border border-[#00D7C3]/30 rounded-lg p-3">
                        <h4 className="font-medium text-[#00D7C3] mb-2 text-sm">Memory Augmentation</h4>
                        <p className="text-xs text-gray-400">Upload AR-compatible media that can be revealed at specific physical locations, creating a scavenger hunt for their crypto gift.</p>
                      </div>
                      
                      <div className="border border-[#00D7C3]/30 rounded-lg p-3">
                        <h4 className="font-medium text-[#00D7C3] mb-2 text-sm">Achievement Unlocking</h4>
                        <p className="text-xs text-gray-400">Set specific challenges or tasks that the recipient must complete to gradually unlock portions of the gift.</p>
                      </div>
                    </div>
                    
                    <ul className="space-y-2 text-sm text-gray-300 mt-4">
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-line text-[#00D7C3] mt-0.5 mr-2"></i>
                        <span>Multi-stage revelation with sequential unlocking moments</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-line text-[#00D7C3] mt-0.5 mr-2"></i>
                        <span>Add personalized interactive experiences and puzzles</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-line text-[#00D7C3] mt-0.5 mr-2"></i>
                        <span>Trigger unlocks based on real-world events or achievements</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-line text-[#00D7C3] mt-0.5 mr-2"></i>
                        <span>Include appreciation multipliers that increase gift value over time</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="giftType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#00D7C3]">Gift Experience Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange}
                            defaultValue="surprise"
                          >
                            <FormControl>
                              <SelectTrigger className="border-[#00D7C3]/30 focus:ring-[#00D7C3]">
                                <SelectValue placeholder="Select gift experience type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="surprise">Surprise Moment</SelectItem>
                              <SelectItem value="journey">Discovery Journey</SelectItem>
                              <SelectItem value="milestone">Achievement Milestone</SelectItem>
                              <SelectItem value="adventure">Geo-Located Adventure</SelectItem>
                              <SelectItem value="appreciation">Value Appreciation</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription className="text-xs">
                            How would you like the gift to be revealed?
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="giftRecipient"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#00D7C3]">Recipient's Address</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="0x..." 
                              className="border-[#00D7C3]/30 focus:ring-[#00D7C3]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-xs">
                            Who will receive this special gift?
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="giftMessage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#00D7C3]">Personal Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Write a personal message that will be revealed when this gift is unlocked..."
                            className="resize-none border-[#00D7C3]/30 focus:ring-[#00D7C3]"
                            value={field.value || ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Add a heartfelt message to accompany your gift
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex items-center p-3 border border-[#00D7C3]/30 rounded-lg bg-[#00D7C3]/5 my-2">
                    <div className="flex-shrink-0 bg-[#00D7C3]/10 p-2 rounded-full mr-3">
                      <i className="ri-magic-line text-[#00D7C3] text-lg"></i>
                    </div>
                    <div className="text-sm text-gray-300">
                      <span className="font-medium text-[#00D7C3]">Revolutionary Feature: </span>
                      This gift vault will increase in value by 5% each year until it's claimed by the recipient.
                    </div>
                  </div>
                </TabsContent>

                {/* Triple-Chain Security and Advanced Features Section */}
                <div className="mt-8 pt-6 border-t border-[#333333]">
                  <div className="bg-gradient-to-r from-[#6B00D7]/10 to-[#FF5AF7]/10 p-5 rounded-lg mb-6 border border-purple-500/30">
                    <div className="flex items-start mb-4">
                      <div className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] p-2 rounded-full mr-3 mt-1">
                        <i className="ri-shield-keyhole-line text-white text-xl"></i>
                      </div>
                      <div>
                        <h3 className="font-poppins font-semibold text-white text-lg">Revolutionary Triple-Chain Security</h3>
                        <p className="text-sm text-gray-300 mt-1">
                          Our exclusive multi-chain protection ensures your vault has unprecedented security by utilizing the strengths of multiple blockchains simultaneously.
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                      <div className="flex items-center space-x-2 bg-[#1A1A1A] p-3 rounded-lg border border-purple-500/20">
                        <input
                          type="checkbox"
                          id="enableEthereumChain"
                          className="form-checkbox h-4 w-4 text-[#6B00D7] rounded border-gray-400 focus:ring-[#6B00D7]"
                          defaultChecked
                        />
                        <div>
                          <label htmlFor="enableEthereumChain" className="block text-sm text-gray-300">Ethereum</label>
                          <span className="text-xs text-gray-500">Primary Security</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 bg-[#1A1A1A] p-3 rounded-lg border border-purple-500/20">
                        <input
                          type="checkbox"
                          id="enableSolanaChain"
                          className="form-checkbox h-4 w-4 text-[#FF5AF7] rounded border-gray-400 focus:ring-[#FF5AF7]"
                        />
                        <div>
                          <label htmlFor="enableSolanaChain" className="block text-sm text-gray-300">Solana</label>
                          <span className="text-xs text-gray-500">Speed Layer</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 bg-[#1A1A1A] p-3 rounded-lg border border-purple-500/20">
                        <input
                          type="checkbox"
                          id="enableTONChain"
                          className="form-checkbox h-4 w-4 text-blue-400 rounded border-gray-400 focus:ring-blue-400"
                        />
                        <div>
                          <label htmlFor="enableTONChain" className="block text-sm text-gray-300">TON</label>
                          <span className="text-xs text-gray-500">Backup Layer</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-400 p-3 bg-[#1A1A1A] rounded-lg">
                      <p className="mb-1"><span className="text-white font-medium">How it works:</span> Your vault data is mirrored across all selected chains with unique cryptographic signing.</p>
                      <p>If one chain experiences issues, the others maintain access and security. This ensures unparalleled protection against any single point of failure.</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* IPFS & Arweave permanent storage */}
                    <div className="border border-gray-700 p-4 rounded-lg bg-[#1A1A1A]">
                      <div className="flex items-start mb-3">
                        <div className="bg-gradient-to-r from-green-500 to-teal-500 p-1.5 rounded-full mr-3">
                          <i className="ri-hard-drive-2-line text-black text-lg"></i>
                        </div>
                        <div>
                          <h4 className="font-medium text-white mb-1">IPFS & Arweave Integration</h4>
                          <p className="text-xs text-gray-400">Store vault data permanently with decentralized storage solutions</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center p-2 bg-gray-900 rounded border border-gray-700">
                          <input
                            type="checkbox"
                            id="enableIPFS"
                            className="form-checkbox h-4 w-4 text-green-500 rounded border-gray-400 focus:ring-green-500"
                          />
                          <div className="ml-2">
                            <label htmlFor="enableIPFS" className="block text-sm text-gray-300">IPFS Storage</label>
                            <p className="text-xs text-gray-500">Content-addressed immutable storage</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center p-2 bg-gray-900 rounded border border-gray-700">
                          <input
                            type="checkbox"
                            id="enableArweave"
                            className="form-checkbox h-4 w-4 text-yellow-500 rounded border-gray-400 focus:ring-yellow-500"
                          />
                          <div className="ml-2">
                            <label htmlFor="enableArweave" className="block text-sm text-gray-300">Arweave Permanent Storage</label>
                            <p className="text-xs text-gray-500">Pay once, store forever model</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Cross-Chain Atomic Swaps */}
                    <div className="border border-gray-700 p-4 rounded-lg bg-[#1A1A1A]">
                      <div className="flex items-start mb-3">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-1.5 rounded-full mr-3">
                          <i className="ri-exchange-box-line text-white text-lg"></i>
                        </div>
                        <div>
                          <h4 className="font-medium text-white mb-1">Cross-Chain Atomic Swaps</h4>
                          <p className="text-xs text-gray-400">Enable seamless asset type conversions within your vault</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center p-2 bg-gray-900 rounded border border-gray-700">
                          <input
                            type="checkbox"
                            id="enableAtomicSwaps"
                            className="form-checkbox h-4 w-4 text-blue-500 rounded border-gray-400 focus:ring-blue-500"
                          />
                          <div className="ml-2">
                            <label htmlFor="enableAtomicSwaps" className="block text-sm text-gray-300">Enable Atomic Swaps</label>
                            <p className="text-xs text-gray-500">Convert assets across chains automatically</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Swap Trigger</label>
                            <select className="w-full bg-gray-900 border border-gray-700 rounded text-xs text-gray-300 p-1.5">
                              <option value="manual">Manual Only</option>
                              <option value="price">Price-triggered</option>
                              <option value="time">Time-based</option>
                              <option value="hybrid">Hybrid Conditions</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Swap Strategy</label>
                            <select className="w-full bg-gray-900 border border-gray-700 rounded text-xs text-gray-300 p-1.5">
                              <option value="optimize">Yield Optimization</option>
                              <option value="stability">Stability Focus</option>
                              <option value="growth">Growth Focus</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-[#6B00D7]/5 to-[#FF5AF7]/5 rounded-lg border border-purple-500/20 mb-6">
                    <div className="flex items-start">
                      <div className="bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 p-2 rounded-full mr-3 flex-shrink-0 mt-1">
                        <i className="ri-lock-password-line text-white text-lg"></i>
                      </div>
                      <div>
                        <h4 className="font-medium text-white mb-1">Zero-Knowledge Verification</h4>
                        <p className="text-sm text-gray-300">
                          Our revolutionary zero-knowledge proof system allows proving ownership or status without revealing actual assets or sensitive information.
                        </p>
                        <div className="mt-3 flex items-center">
                          <input
                            type="checkbox"
                            id="enableZkProofs"
                            className="form-checkbox h-4 w-4 text-purple-500 rounded border-gray-400 focus:ring-purple-500"
                          />
                          <label htmlFor="enableZkProofs" className="ml-2 text-sm text-gray-300">Enable Zero-Knowledge Proofs for Enhanced Privacy</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Deployment Status */}
                {isBlockchainDeploying && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-[#1A1A1A] border border-[#6B00D7] p-6 rounded-lg max-w-md w-full">
                      <h3 className="text-xl font-semibold mb-4 text-white">Deploying to Blockchain</h3>
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="animate-spin h-5 w-5 border-2 border-[#6B00D7] border-t-transparent rounded-full"></div>
                        <p>{deploymentStatus || 'Preparing transaction...'}</p>
                      </div>
                      <p className="text-sm text-gray-400">Please wait while your vault is being deployed to the blockchain. This process may take a minute or two to complete.</p>
                    </div>
                  </div>
                )}
                
                {/* Contract Deployment Success */}
                {!isBlockchainDeploying && contractAddress && !showAttachmentUpload && (
                  <div className="border border-green-500/20 rounded-lg p-4 bg-[#1A1A1A] mt-4 mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="bg-green-500 rounded-full p-1">
                        <i className="ri-check-line text-black"></i>
                      </div>
                      <h3 className="text-lg font-semibold text-white">Contract Deployed Successfully</h3>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">
                      Your vault has been successfully deployed to the blockchain and is now secured with immutable smart contract technology.
                    </p>
                    <div className="bg-black/30 p-2 rounded-md text-xs font-mono text-green-400 break-all">
                      {contractAddress}
                    </div>
                  </div>
                )}
                
                {/* Blockchain Interaction Section */}
                {isWalletConnected && !showAttachmentUpload && (
                  <div className="border border-[#6B00D7]/20 rounded-lg p-4 bg-[#1A1A1A] mt-4 mb-4">
                    <h3 className="text-lg font-semibold mb-2 text-white">Blockchain Deployment</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Your vault will be deployed on {selectedBlockchain} blockchain. This ensures 
                      the highest level of security and immutability for your assets.
                    </p>
                    
                    {selectedBlockchain === BlockchainType.TON && (
                      <div className="flex items-center space-x-2 mb-4 p-3 bg-[#6B00D7]/10 rounded-lg">
                        <div className="h-6 w-6 rounded-full bg-[#6B00D7]/20 flex items-center justify-center text-xs">
                          💎
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white">TON Smart Contract</h4>
                          <p className="text-xs text-gray-400">Your vault will be created as a secure TON smart contract</p>
                        </div>
                      </div>
                    )}
                    
                    {selectedBlockchain === BlockchainType.ETHEREUM && (
                      <div className="flex items-center space-x-2 mb-4 p-3 bg-[#6B00D7]/10 rounded-lg">
                        <div className="h-6 w-6 rounded-full bg-[#6B00D7]/20 flex items-center justify-center text-xs">
                          Ξ
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white">Ethereum ERC-4626 Vault</h4>
                          <p className="text-xs text-gray-400">Your vault implements the tokenized vault standard</p>
                        </div>
                      </div>
                    )}
                    
                    {selectedBlockchain === BlockchainType.SOLANA && (
                      <div className="flex items-center space-x-2 mb-4 p-3 bg-[#6B00D7]/10 rounded-lg">
                        <div className="h-6 w-6 rounded-full bg-[#6B00D7]/20 flex items-center justify-center text-xs">
                          ◎
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white">Solana Program Vault</h4>
                          <p className="text-xs text-gray-400">High-performance, low-fee vault on Solana</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Cross-Chain Security */}
                {!showAttachmentUpload && (
                  <div className="border border-[#FF5AF7]/20 rounded-lg p-4 bg-[#1A1A1A] mt-4 mb-4">
                    <h3 className="text-lg font-semibold mb-2 text-[#FF5AF7]">Cross-Chain Security</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Chronos Vault leverages multiple blockchains for enhanced security and monitoring.
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 p-2 bg-[#FF5AF7]/10 rounded-lg">
                        <div className="h-5 w-5 rounded-full bg-[#FF5AF7]/20 flex items-center justify-center text-xs">
                          Ξ
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white">Ethereum Ownership Records</h4>
                          <p className="text-xs text-gray-400">Your ownership is cryptographically verified on Ethereum</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 p-2 bg-[#FF5AF7]/10 rounded-lg">
                        <div className="h-5 w-5 rounded-full bg-[#FF5AF7]/20 flex items-center justify-center text-xs">
                          ◎
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white">Solana Monitoring</h4>
                          <p className="text-xs text-gray-400">High-frequency security monitoring and validation</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 p-2 bg-[#FF5AF7]/10 rounded-lg">
                        <div className="h-5 w-5 rounded-full bg-[#FF5AF7]/20 flex items-center justify-center text-xs">
                          💎
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white">TON Recovery Mechanism</h4>
                          <p className="text-xs text-gray-400">Advanced recovery system via backup mechanisms</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {!showAttachmentUpload && (
                  <div className="pt-4 border-t border-[#333333]">
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white cta-button"
                      disabled={mutation.isPending || (selectedBlockchain && !isWalletConnected)}
                    >
                      {mutation.isPending || isBlockchainDeploying ? "Creating Your Vault..." : "Create and Lock Assets"}
                    </Button>
                    
                    {selectedBlockchain && !isWalletConnected && (
                      <div className="text-yellow-500 text-sm mt-2 text-center">
                        You need to connect your {selectedBlockchain} wallet before you can create a vault.
                      </div>
                    )}
                  </div>
                )}
              </form>
            </Form>
            
            {showAttachmentUpload && createdVaultId && (
              <div className="mt-8 space-y-6">
                <div className="bg-gradient-to-r from-[#6B00D7]/10 to-[#FF5AF7]/10 p-4 rounded-lg mb-4">
                  <h3 className="font-semibold mb-2">Add Media to Your Vault</h3>
                  <p className="text-sm text-gray-300">
                    Add images, documents, videos, or audio files to your vault. These will be securely encrypted and time-locked.
                  </p>
                </div>
                
                <FileUpload 
                  vaultId={createdVaultId} 
                  onUploadComplete={handleAttachmentComplete} 
                  className="mb-6"
                />
                
                <div className="border-t border-[#333333] pt-4">
                  <Button
                    onClick={handleFinishCreation}
                    className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white cta-button"
                  >
                    Complete Vault Creation
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default CreateVaultForm;
