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
import { Coins, Wallet, ArrowLeftRight, ArrowRightCircle } from "lucide-react";

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
                  
                  <FormField
                    control={form.control}
                    name="tripleChainSecurity"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-[#6B00D7]/30 p-4 shadow bg-[#1A1A1A]">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                              setUseTripleChainSecurity(!!checked);
                            }}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Enable Triple-Chain Security
                          </FormLabel>
                          <FormDescription>
                            Secures your vault across multiple blockchains for maximum security
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
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
