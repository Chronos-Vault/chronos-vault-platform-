import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useMultiChain } from '@/contexts/multi-chain-context';
import { MultiSignatureConfig } from './MultiSignatureConfig';
import { GeolocationSetup } from './GeolocationSetup';
import { CVTIntegration } from '../token/CVTIntegration';
import { useLocation } from 'wouter';
import * as z from 'zod';
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  Coins,
  Fingerprint,
  Globe,
  Lock,
  Shield,
  Unlock,
  Upload,
  Users,
  Wallet,
  Info,
  Plus,
  Sparkles,
} from 'lucide-react';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Define schema for the vault form
const vaultFormSchema = z.object({
  name: z.string().min(1, { message: 'Vault name is required' }),
  description: z.string().optional(),
  vaultType: z.enum([
    'standard',
    'timelock',
    'multisig',
    'geolocation',
    'biometric',
    'cross-chain',
    'advanced',
  ]),
  blockchain: z.string().min(1, { message: 'Blockchain is required' }),
  tokenAmount: z.string().min(1, { message: 'Token amount is required' }),
  tokenAddress: z.string().optional(),
  unlockDate: z.date().refine(date => date > new Date(), {
    message: 'Unlock date must be in the future',
  }),
  unlockType: z.enum(['time', 'event', 'hybrid', 'multisig']),
  securityLevel: z.enum(['standard', 'enhanced', 'maximum']),
  // Optional features
  enableGeolocation: z.boolean().default(false),
  enableMultisig: z.boolean().default(false),
  enableBiometrics: z.boolean().default(false),
  enableCVTStaking: z.boolean().default(false),
  // Advanced metadata will be stored as JSON
  metadata: z.record(z.any()).optional(),
});

type VaultFormValues = z.infer<typeof vaultFormSchema>;

interface CreateVaultFormProps {
  userId: number;
  onVaultCreated?: (vault: any) => void;
  defaultVaultType?: string;
}

export function CreateVaultFormEnhanced({
  userId,
  onVaultCreated,
  defaultVaultType = 'standard',
}: CreateVaultFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const { walletInfo, isConnected } = useMultiChain();
  
  // State for form options
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [securityScore, setSecurityScore] = useState(50);
  const [isCreatingContract, setIsCreatingContract] = useState(false);
  const [contractAddress, setContractAddress] = useState<string | null>(null);
  
  // State for advanced security options
  const [multiSigConfig, setMultiSigConfig] = useState<any>(null);
  const [geoConfig, setGeoConfig] = useState<any>(null);
  const [cvtStakingAmount, setCvtStakingAmount] = useState(0);
  const [cvtSecurityBoost, setCvtSecurityBoost] = useState(0);
  
  // Define steps
  const totalSteps = 4;
  
  // Form setup with default values
  const form = useForm<VaultFormValues>({
    resolver: zodResolver(vaultFormSchema),
    defaultValues: {
      name: '',
      description: '',
      vaultType: defaultVaultType as any,
      blockchain: 'ethereum',
      tokenAmount: '',
      unlockDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 days from now
      unlockType: 'time',
      securityLevel: 'standard',
      enableGeolocation: false,
      enableMultisig: false,
      enableBiometrics: false,
      enableCVTStaking: false,
    },
  });
  
  // Watch form values for real-time updates
  const vaultType = form.watch('vaultType');
  const securityLevel = form.watch('securityLevel');
  const enableMultisig = form.watch('enableMultisig');
  const enableGeolocation = form.watch('enableGeolocation');
  const enableBiometrics = form.watch('enableBiometrics');
  const enableCVTStaking = form.watch('enableCVTStaking');
  const blockchain = form.watch('blockchain');
  
  // Update default values based on vault type
  useEffect(() => {
    // Reset previous settings first
    form.setValue('enableMultisig', false);
    form.setValue('enableGeolocation', false);
    form.setValue('enableBiometrics', false);
    form.setValue('enableCVTStaking', false);
    
    // Apply settings based on vault type
    switch(vaultType) {
      case 'multisig':
        form.setValue('enableMultisig', true);
        form.setValue('unlockType', 'multisig');
        form.setValue('securityLevel', 'enhanced');
        break;
        
      case 'geolocation':
        form.setValue('enableGeolocation', true);
        form.setValue('securityLevel', 'enhanced');
        break;
        
      case 'biometric':
        form.setValue('enableBiometrics', true);
        form.setValue('securityLevel', 'maximum');
        break;
        
      case 'timelock':
        // Set a longer default timelock for timelock vaults
        const currentDate = new Date(form.getValues('unlockDate'));
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        
        if (currentDate < oneYearFromNow) {
          form.setValue('unlockDate', oneYearFromNow);
        }
        break;
        
      case 'cross-chain':
        form.setValue('securityLevel', 'maximum');
        form.setValue('enableCVTStaking', true);
        break;
        
      case 'standard':
      default:
        // Default values already set
        break;
    }
  }, [vaultType, form]);
  
  // Update security score when settings change
  useEffect(() => {
    let score = 50; // base score
    
    // Security level adds points
    if (securityLevel === 'enhanced') score += 15;
    if (securityLevel === 'maximum') score += 30;
    
    // Additional security features add points
    if (enableMultisig) score += 15;
    if (enableGeolocation) score += 10;
    if (enableBiometrics) score += 5;
    
    // CVT staking adds points based on the security boost
    score += cvtSecurityBoost;
    
    // Cap at 100
    setSecurityScore(Math.min(100, score));
  }, [securityLevel, enableMultisig, enableGeolocation, enableBiometrics, cvtSecurityBoost]);
  
  // Handle CVT staking
  const handleTokensStaked = (amount: number, securityBoost: number) => {
    setCvtStakingAmount(amount);
    setCvtSecurityBoost(securityBoost);
    toast({
      title: "CVT Staking Success",
      description: `${amount} CVT tokens staked, adding +${securityBoost}% to vault security`,
    });
  };
  
  // Mutation for creating a vault
  const createVaultMutation = useMutation({
    mutationFn: async (values: VaultFormValues) => {
      // First, create the vault contract if we have wallet connectivity
      if (isConnected && blockchain === 'ethereum' && walletInfo.ethereum.isConnected) {
        setIsCreatingContract(true);
        try {
          // This would call the blockchain service to deploy a vault contract
          // For now, we'll simulate it
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          // Generate a random contract address for demo purposes
          const randomAddress = `0x${Array.from({length: 40}, () => 
            Math.floor(Math.random() * 16).toString(16)).join('')}`;
          
          setContractAddress(randomAddress);
          setIsCreatingContract(false);
        } catch (error) {
          setIsCreatingContract(false);
          throw new Error('Failed to create vault contract on blockchain');
        }
      }
      
      // Prepare metadata with advanced security settings
      const metadata = {
        multiSigConfig: enableMultisig ? multiSigConfig : null,
        geoConfig: enableGeolocation ? geoConfig : null,
        biometricEnabled: enableBiometrics,
        cvtStaking: enableCVTStaking ? {
          amount: cvtStakingAmount,
          securityBoost: cvtSecurityBoost,
        } : null,
        contractAddress: contractAddress,
        securityScore: securityScore,
      };
      
      // Create vault in database
      const vaultData = {
        ...values,
        userId,
        metadata: JSON.stringify(metadata),
        createdAt: new Date().toISOString(),
        unlockDate: values.unlockDate.toISOString(),
        status: 'active',
      };
      
      return await apiRequest('POST', '/api/vaults', vaultData);
    },
    onSuccess: (response) => {
      // Parse the response to get data
      response.json().then(data => {
        toast({
          title: "Vault Created Successfully",
          description: `Your ${vaultType} vault has been created and is now active.`,
        });
        
        // Invalidate vaults query to reflect new vault
        queryClient.invalidateQueries({ queryKey: ['vaults'] });
        queryClient.invalidateQueries({ queryKey: ['vaults', userId] });
        
        // Notify parent component
        onVaultCreated?.(data);
        
        // Redirect to vault details after a short delay
        setTimeout(() => {
          setLocation(`/vault/${data.id}`);
        }, 1500);
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Create Vault",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    },
  });
  
  // Submit handler
  const onSubmit = (values: VaultFormValues) => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      return;
    }
    
    createVaultMutation.mutate(values);
  };
  
  // Navigation between steps
  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  };
  
  // Function to generate security level explanation based on selected level
  const getSecurityLevelExplanation = () => {
    switch (securityLevel) {
      case 'standard':
        return "Basic security with wallet authentication and timelock features. Suitable for personal vaults with lower value assets.";
      case 'enhanced':
        return "Advanced security with multi-signature support, scheduled alerts, and activity logs. Recommended for shared vaults and medium-value assets.";
      case 'maximum':
        return "Military-grade security with multi-signature, geolocation verification, biometrics, and CVT staking for maximum protection. Essential for high-value assets.";
      default:
        return "Select a security level for your vault.";
    }
  };
  
  // Function to get the security color based on score
  const getSecurityColor = () => {
    if (securityScore >= 80) return "text-green-500";
    if (securityScore >= 60) return "text-yellow-500";
    return "text-red-500";
  };
  
  return (
    <div className="space-y-8">
      {/* Step Indicators */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <div 
              key={idx} 
              className={`flex flex-col items-center ${currentStep > idx + 1 ? 'cursor-pointer' : ''}`}
              onClick={() => currentStep > idx + 1 && goToStep(idx + 1)}
            >
              <div 
                className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium ${currentStep > idx + 1 ? 'bg-[#6B00D7] text-white' : currentStep === idx + 1 ? 'bg-[#6B00D7] text-white' : 'bg-gray-800 text-gray-400 border border-[#6B00D7]/30'}`}
              >
                {currentStep > idx + 1 ? '✓' : idx + 1}
              </div>
              <div className={`text-xs mt-2 ${currentStep >= idx + 1 ? 'text-white' : 'text-gray-500'}`}>
                {idx === 0 ? 'Basics' : idx === 1 ? 'Security' : idx === 2 ? 'Advanced' : 'Review'}
              </div>
            </div>
          ))}
        </div>
        <div className="relative h-1 bg-gray-800 rounded-full mt-2">
          <div 
            className="absolute top-0 left-0 h-full bg-[#6B00D7] rounded-full"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Step 1: Basic Vault Information */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <Card className="border-[#6B00D7]/30 bg-black/40">
                <CardHeader>
                  <CardTitle className="text-xl">Vault Basics</CardTitle>
                  <CardDescription>
                    Create your new digital vault for secure asset storage
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vault Name</FormLabel>
                        <FormControl>
                          <Input placeholder="My Secure Vault" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the purpose of this vault..."
                            {...field}
                            className="resize-none min-h-[80px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            <SelectContent className="max-h-[300px]">
                              <SelectItem value="standard">
                                <div className="flex items-center gap-2">
                                  <Lock className="h-4 w-4" />
                                  <span>Standard Vault</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="timelock">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  <span>Time-Lock Vault</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="multisig">
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4" />
                                  <span>Multi-Signature Vault</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="geolocation">
                                <div className="flex items-center gap-2">
                                  <Globe className="h-4 w-4" />
                                  <span>Geolocation Vault</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="biometric">
                                <div className="flex items-center gap-2">
                                  <Fingerprint className="h-4 w-4" />
                                  <span>Biometric Vault</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="cross-chain">
                                <div className="flex items-center gap-2">
                                  <Shield className="h-4 w-4" />
                                  <span>Cross-Chain Vault</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="advanced">
                                <div className="flex items-center gap-2">
                                  <Sparkles className="h-4 w-4" />
                                  <span>Advanced Custom Vault</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            {vaultType === 'standard' && "Basic time-locked vault for secure asset storage"}
                            {vaultType === 'timelock' && "Advanced time-based vault with precise unlocking schedules and extended security"}
                            {vaultType === 'multisig' && "Enhanced security vault requiring multiple authorized signers to approve operations"}
                            {vaultType === 'geolocation' && "Location-secured vault requiring physical presence in designated safe zones"}
                            {vaultType === 'biometric' && "Highest level of personal authentication using biometric verification for access"}
                            {vaultType === 'cross-chain' && "Advanced vault with security distributed across multiple blockchains for ultimate protection"}
                            {vaultType === 'advanced' && "Fully customizable vault with all security features enabled"}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="blockchain"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Blockchain</FormLabel>
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
                              <SelectItem value="ethereum">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">⟠</span>
                                  <span>Ethereum</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="solana">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">◎</span>
                                  <span>Solana</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="ton">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">💎</span>
                                  <span>TON Network</span>
                                </div>
                              </SelectItem>
                              {vaultType === 'cross-chain' && (
                                <SelectItem value="multi-chain">
                                  <div className="flex items-center gap-2">
                                    <Globe className="h-4 w-4" />
                                    <span>Multi-Chain</span>
                                    <Badge className="ml-2 bg-purple-600/30 text-purple-400 text-xs">
                                      Premium
                                    </Badge>
                                  </div>
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="tokenAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Token Amount</FormLabel>
                          <div className="flex">
                            <FormControl>
                              <Input type="text" placeholder="0.0" {...field} />
                            </FormControl>
                            <Select
                              defaultValue="native"
                            >
                              <SelectTrigger className="w-40 ml-2">
                                <SelectValue placeholder="Token" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="native">
                                  {blockchain === 'ethereum' ? 'ETH' : blockchain === 'solana' ? 'SOL' : 'TON'}
                                </SelectItem>
                                <SelectItem value="usdt">USDT</SelectItem>
                                <SelectItem value="usdc">USDC</SelectItem>
                                <SelectItem value="cvt">CVT</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="unlockDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unlock Date</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <input
                                type="date"
                                className="w-full h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={field.value ? field.value.toISOString().split('T')[0] : ''}
                                onChange={(e) => {
                                  const date = new Date(e.target.value);
                                  field.onChange(date);
                                }}
                                min={new Date().toISOString().split('T')[0]}
                              />
                            </FormControl>
                            <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="unlockType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unlock Mechanism</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={vaultType === 'multisig'} // Force multisig unlock for multisig vaults
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select unlock mechanism" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="time">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>Time-based Unlock</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="event">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>Event-based Unlock</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="multisig">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                <span>Multi-signature Unlock</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="hybrid">
                              <div className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4" />
                                <span>Hybrid Conditions</span>
                                <Badge className="ml-2 bg-purple-600/30 text-purple-400 text-xs">
                                  Premium
                                </Badge>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          {field.value === 'time' && "Vault unlocks automatically at the specified date and time"}
                          {field.value === 'event' && "Vault unlocks when specific blockchain events or conditions are met"}
                          {field.value === 'multisig' && "Requires approval from multiple authorized signers to unlock"}
                          {field.value === 'hybrid' && "Combines multiple unlock conditions for enhanced security"}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex justify-between border-t border-[#6B00D7]/20 pt-6">
                  <Button type="button" variant="outline" disabled>
                    Back
                  </Button>
                  <Button type="button" onClick={goToNextStep}>
                    Continue to Security
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
          
          {/* Step 2: Security Settings */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <Card className="border-[#6B00D7]/30 bg-black/40">
                <CardHeader>
                  <CardTitle className="text-xl">Security Settings</CardTitle>
                  <CardDescription>
                    Configure the security features for your vault
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#6B00D7]/20 to-transparent rounded-lg border border-[#6B00D7]/20">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Security Score</h3>
                      <p className="text-sm text-gray-400">Your vault's current security rating</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getSecurityColor()}`}>
                        {securityScore}/100
                      </div>
                      <div className="text-sm text-gray-400">
                        {securityScore >= 80 ? 'Excellent' : securityScore >= 60 ? 'Good' : 'Basic'} Protection
                      </div>
                    </div>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="securityLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Security Level</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select security level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="standard">
                              <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-blue-500" />
                                <span>Standard Security</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="enhanced">
                              <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-purple-500" />
                                <span>Enhanced Security</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="maximum">
                              <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-green-500" />
                                <span>Maximum Security</span>
                                <Badge className="ml-1 bg-green-500/20 text-green-400 text-xs">
                                  Recommended
                                </Badge>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          {getSecurityLevelExplanation()}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Separator className="my-6 bg-[#6B00D7]/20" />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Additional Security Features</h3>
                    
                    <FormField
                      control={form.control}
                      name="enableMultisig"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[#6B00D7]/20 p-4 bg-[#6B00D7]/5">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base flex items-center gap-2">
                              <Users className="h-4 w-4 text-[#6B00D7]" />
                              Multi-Signature Protection
                              {vaultType === 'multisig' && (
                                <Badge className="ml-2 bg-purple-600/20 text-purple-400 text-xs">
                                  Required
                                </Badge>
                              )}
                            </FormLabel>
                            <FormDescription>
                              Require multiple authorized signatures to unlock or modify vault
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={vaultType === 'multisig'} // Can't disable multisig for multisig vaults
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="enableGeolocation"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[#6B00D7]/20 p-4 bg-[#6B00D7]/5">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base flex items-center gap-2">
                              <Globe className="h-4 w-4 text-[#6B00D7]" />
                              Geolocation Verification
                            </FormLabel>
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
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[#6B00D7]/20 p-4 bg-[#6B00D7]/5">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base flex items-center gap-2">
                              <Fingerprint className="h-4 w-4 text-[#6B00D7]" />
                              Biometric Authentication
                              {securityLevel === 'standard' && (
                                <Badge className="ml-2 bg-yellow-600/20 text-yellow-400 text-xs">
                                  Enhanced+ Only
                                </Badge>
                              )}
                            </FormLabel>
                            <FormDescription>
                              Require biometric verification to authorize vault actions
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={securityLevel === 'standard'}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="enableCVTStaking"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[#6B00D7]/20 p-4 bg-gradient-to-r from-[#6B00D7]/10 to-[#FF5AF7]/10">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base flex items-center gap-2">
                              <Coins className="h-4 w-4 text-[#FF5AF7]" />
                              CVT Security Staking
                              <Badge className="ml-2 bg-purple-600/20 text-purple-300 text-xs">
                                Premium
                              </Badge>
                            </FormLabel>
                            <FormDescription>
                              Stake CVT tokens to enhance vault security and earn rewards
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
                </CardContent>
                <CardFooter className="flex justify-between border-t border-[#6B00D7]/20 pt-6">
                  <Button type="button" variant="outline" onClick={goToPreviousStep}>
                    Back
                  </Button>
                  <Button type="button" onClick={goToNextStep}>
                    Continue to Advanced Settings
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
          
          {/* Step 3: Advanced Settings */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <Card className="border-[#6B00D7]/30 bg-black/40">
                <CardHeader>
                  <CardTitle className="text-xl">Advanced Configuration</CardTitle>
                  <CardDescription>
                    Configure advanced security features for your vault
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <Tabs defaultValue="general" className="w-full">
                    <TabsList className="grid grid-cols-3 mb-6">
                      <TabsTrigger value="general" className="text-xs">
                        General
                      </TabsTrigger>
                      {enableMultisig && (
                        <TabsTrigger value="multisig" className="text-xs">
                          Multi-Signature
                        </TabsTrigger>
                      )}
                      {enableGeolocation && (
                        <TabsTrigger value="geolocation" className="text-xs">
                          Geolocation
                        </TabsTrigger>
                      )}
                      {!enableMultisig && !enableGeolocation && (
                        <TabsTrigger value="empty1" className="text-xs" disabled>
                          Disabled
                        </TabsTrigger>
                      )}
                      {enableCVTStaking && (
                        <TabsTrigger value="staking" className="text-xs">
                          CVT Staking
                        </TabsTrigger>
                      )}
                      {!enableCVTStaking && (
                        <TabsTrigger value="empty2" className="text-xs" disabled>
                          Disabled
                        </TabsTrigger>
                      )}
                    </TabsList>
                    
                    <TabsContent value="general" className="space-y-4">
                      <div className="bg-[#6B00D7]/5 border border-[#6B00D7]/20 rounded-lg p-4">
                        <h3 className="flex items-center gap-2 text-lg font-medium mb-2">
                          <Shield className="h-5 w-5 text-[#6B00D7]" />
                          Security Configuration
                        </h3>
                        <p className="text-sm text-gray-400 mb-4">
                          Your vault is configured with {securityLevel} security settings. 
                          {securityScore < 60 && " Consider enabling additional security features to enhance protection."}
                        </p>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Security Score</span>
                            <span className={getSecurityColor()}>{securityScore}%</span>
                          </div>
                          <Progress value={securityScore} className="h-2" />
                          
                          <div className="mt-4 space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                              <span>80-100%: Excellent Protection</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                              <span>60-79%: Good Protection</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-red-500"></div>
                              <span>0-59%: Basic Protection</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-black/30 border border-gray-800 rounded-lg p-4">
                        <h3 className="flex items-center gap-2 text-base font-medium mb-2">
                          <Upload className="h-5 w-5 text-gray-400" />
                          Attachments & Documentation
                        </h3>
                        <p className="text-sm text-gray-400 mb-4">
                          Securely upload documents and media related to your vault.
                        </p>
                        
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer border-gray-700 bg-black/20">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="h-8 w-8 text-gray-400 mb-2" />
                              <p className="text-sm text-gray-400">Drag and drop files or click to upload</p>
                              <p className="text-xs text-gray-500 mt-1">Max 10MB per file</p>
                            </div>
                            <input type="file" className="hidden" />
                          </label>
                        </div>
                      </div>
                      
                      <div className="bg-black/30 border border-gray-800 rounded-lg p-4">
                        <h3 className="flex items-center gap-2 text-base font-medium mb-2">
                          <Info className="h-5 w-5 text-gray-400" />
                          Additional Metadata
                        </h3>
                        <p className="text-sm text-gray-400 mb-4">
                          Add custom tags and metadata to your vault for better organization.
                        </p>
                        
                        <div className="flex gap-2 mb-2">
                          <Input placeholder="Tag name (e.g., 'investment')" className="flex-1 bg-black/20" />
                          <Button variant="outline" size="sm" className="gap-1">
                            <Plus className="h-4 w-4" />
                            Add
                          </Button>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-4">
                          <Badge variant="outline" className="bg-[#6B00D7]/10 gap-1">
                            crypto
                            <button className="ml-1 hover:text-red-500">×</button>
                          </Badge>
                          <Badge variant="outline" className="bg-[#6B00D7]/10 gap-1">
                            investment
                            <button className="ml-1 hover:text-red-500">×</button>
                          </Badge>
                          <Badge variant="outline" className="bg-[#6B00D7]/10 gap-1">
                            long-term
                            <button className="ml-1 hover:text-red-500">×</button>
                          </Badge>
                        </div>
                      </div>
                    </TabsContent>
                    
                    {enableMultisig && (
                      <TabsContent value="multisig" className="space-y-4">
                        <MultiSignatureConfig 
                          onConfigChange={setMultiSigConfig}
                        />
                      </TabsContent>
                    )}
                    
                    {enableGeolocation && (
                      <TabsContent value="geolocation" className="space-y-4">
                        <GeolocationSetup 
                          onConfigChange={setGeoConfig}
                        />
                      </TabsContent>
                    )}
                    
                    {enableCVTStaking && (
                      <TabsContent value="staking" className="space-y-4">
                        <CVTIntegration 
                          vaultId={undefined} // Will be set after creation
                          requiresTokens={securityLevel === 'maximum'}
                          securityLevel={securityLevel}
                          onTokensStaked={handleTokensStaked}
                        />
                      </TabsContent>
                    )}
                  </Tabs>
                </CardContent>
                <CardFooter className="flex justify-between border-t border-[#6B00D7]/20 pt-6">
                  <Button type="button" variant="outline" onClick={goToPreviousStep}>
                    Back
                  </Button>
                  <Button type="button" onClick={goToNextStep}>
                    Continue to Review
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
          
          {/* Step 4: Review */}
          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <Card className="border-[#6B00D7]/30 bg-black/40">
                <CardHeader>
                  <CardTitle className="text-xl">Review & Create Vault</CardTitle>
                  <CardDescription>
                    Review your vault settings before finalization
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-gradient-to-r from-[#6B00D7]/10 to-transparent rounded-lg border border-[#6B00D7]/20">
                    <h3 className="text-lg font-medium flex items-center">
                      <Shield className="h-5 w-5 text-[#6B00D7] mr-2" />
                      Security Score: <span className={`ml-2 ${getSecurityColor()}`}>{securityScore}/100</span>
                    </h3>
                    <Progress value={securityScore} className="h-2 mt-2 mb-2" />
                    <p className="text-sm text-gray-400">
                      {securityScore >= 80 ? (
                        "Your vault has excellent security protection."
                      ) : securityScore >= 60 ? (
                        "Your vault has good security protection."
                      ) : (
                        "Consider adding more security features for better protection."
                      )}
                    </p>
                  </div>
                  
                  <Accordion type="single" collapsible className="w-full border-[#6B00D7]/20 rounded-md overflow-hidden">
                    <AccordionItem value="basics" className="border-[#6B00D7]/20 bg-black/30">
                      <AccordionTrigger className="px-4 hover:bg-[#6B00D7]/5">
                        <div className="flex items-center gap-2">
                          <Wallet className="h-5 w-5 text-[#6B00D7]" />
                          <span>Basic Information</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 pt-1">
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-1">
                            <div className="text-sm text-gray-400">Vault Name:</div>
                            <div className="text-sm font-medium">{form.getValues('name')}</div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-1">
                            <div className="text-sm text-gray-400">Vault Type:</div>
                            <div className="text-sm font-medium capitalize">{form.getValues('vaultType')} Vault</div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-1">
                            <div className="text-sm text-gray-400">Blockchain:</div>
                            <div className="text-sm font-medium capitalize">{form.getValues('blockchain')}</div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-1">
                            <div className="text-sm text-gray-400">Token Amount:</div>
                            <div className="text-sm font-medium">
                              {form.getValues('tokenAmount')} {blockchain === 'ethereum' ? 'ETH' : blockchain === 'solana' ? 'SOL' : 'TON'}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-1">
                            <div className="text-sm text-gray-400">Unlock Date:</div>
                            <div className="text-sm font-medium">
                              {form.getValues('unlockDate')?.toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-1">
                            <div className="text-sm text-gray-400">Unlock Mechanism:</div>
                            <div className="text-sm font-medium capitalize">{form.getValues('unlockType')}-based</div>
                          </div>
                          
                          {form.getValues('description') && (
                            <div className="border-t border-[#6B00D7]/10 pt-2 mt-2">
                              <div className="text-sm text-gray-400 mb-1">Description:</div>
                              <div className="text-sm">{form.getValues('description')}</div>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="security" className="border-[#6B00D7]/20 bg-black/30">
                      <AccordionTrigger className="px-4 hover:bg-[#6B00D7]/5">
                        <div className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-[#6B00D7]" />
                          <span>Security Settings</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 pt-1">
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-1">
                            <div className="text-sm text-gray-400">Security Level:</div>
                            <div className="text-sm font-medium capitalize">{form.getValues('securityLevel')}</div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-1">
                            <div className="text-sm text-gray-400">Multi-Signature:</div>
                            <div className="text-sm font-medium">
                              {form.getValues('enableMultisig') ? (
                                <span className="flex items-center text-green-500 gap-1">
                                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                  Enabled
                                </span>
                              ) : (
                                <span className="flex items-center text-gray-500 gap-1">
                                  <span className="h-2 w-2 rounded-full bg-gray-500"></span>
                                  Disabled
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-1">
                            <div className="text-sm text-gray-400">Geolocation Security:</div>
                            <div className="text-sm font-medium">
                              {form.getValues('enableGeolocation') ? (
                                <span className="flex items-center text-green-500 gap-1">
                                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                  Enabled
                                </span>
                              ) : (
                                <span className="flex items-center text-gray-500 gap-1">
                                  <span className="h-2 w-2 rounded-full bg-gray-500"></span>
                                  Disabled
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-1">
                            <div className="text-sm text-gray-400">Biometric Authentication:</div>
                            <div className="text-sm font-medium">
                              {form.getValues('enableBiometrics') ? (
                                <span className="flex items-center text-green-500 gap-1">
                                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                  Enabled
                                </span>
                              ) : (
                                <span className="flex items-center text-gray-500 gap-1">
                                  <span className="h-2 w-2 rounded-full bg-gray-500"></span>
                                  Disabled
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-1">
                            <div className="text-sm text-gray-400">CVT Security Staking:</div>
                            <div className="text-sm font-medium">
                              {form.getValues('enableCVTStaking') ? (
                                <span className="flex items-center text-green-500 gap-1">
                                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                  Enabled ({cvtStakingAmount} CVT staked)
                                </span>
                              ) : (
                                <span className="flex items-center text-gray-500 gap-1">
                                  <span className="h-2 w-2 rounded-full bg-gray-500"></span>
                                  Disabled
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Display advanced security configurations if enabled */}
                        {form.getValues('enableMultisig') && multiSigConfig && (
                          <div className="mt-4 border-t border-[#6B00D7]/10 pt-3">
                            <div className="text-sm font-medium mb-2">Multi-Signature Configuration:</div>
                            <div className="text-xs text-gray-400">
                              Requires {multiSigConfig.threshold} out of {multiSigConfig.signers?.length || 0} signatures.
                              {multiSigConfig.requireGeolocation && " Includes geolocation verification."}
                            </div>
                          </div>
                        )}
                        
                        {form.getValues('enableGeolocation') && geoConfig && (
                          <div className="mt-4 border-t border-[#6B00D7]/10 pt-3">
                            <div className="text-sm font-medium mb-2">Geolocation Configuration:</div>
                            <div className="text-xs text-gray-400">
                              {geoConfig.safeZones?.length || 0} safe zones configured.
                              {geoConfig.requireAllZones ? " All zones required for verification." : " Any configured zone can be used for verification."}
                            </div>
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  
                  {/* Smart Contract Deployment Section */}
                  <div className="p-4 border border-[#6B00D7]/20 rounded-lg bg-black/30">
                    <h3 className="text-base font-medium mb-2 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-[#FF5AF7]" />
                      Smart Contract Deployment
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">
                      The vault will be deployed as a smart contract on the {form.getValues('blockchain')} blockchain when you create it.
                    </p>
                    
                    {isConnected ? (
                      <div className="bg-[#6B00D7]/5 rounded-md p-3 flex justify-between items-center">
                        <div>
                          <div className="text-sm">
                            Connected to {blockchain} as:
                          </div>
                          <div className="text-xs text-gray-400 truncate max-w-64">
                            {blockchain === 'ethereum' ? walletInfo.ethereum.address : 
                             blockchain === 'solana' ? 'Solana Wallet' : 'TON Wallet'}
                          </div>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400 text-xs">
                          Ready to Deploy
                        </Badge>
                      </div>
                    ) : (
                      <Button variant="outline" className="w-full border-[#6B00D7]/50 hover:bg-[#6B00D7]/10">
                        Connect {blockchain} Wallet
                      </Button>
                    )}
                  </div>
                  
                  {/* Disclaimer */}
                  <div className="p-4 border border-gray-800 rounded-lg bg-black/20">
                    <h3 className="text-base font-medium mb-2">Legal Disclaimer</h3>
                    <p className="text-xs text-gray-400">
                      By creating this vault, you acknowledge that you are the rightful owner of the assets being stored 
                      and agree to abide by all applicable laws and regulations. Chronos Vault provides the technological 
                      infrastructure for secure asset storage but is not responsible for the assets themselves or any 
                      legal implications of their storage or transfer.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t border-[#6B00D7]/20 pt-6">
                  <Button type="button" variant="outline" onClick={goToPreviousStep}>
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-[#6B00D7] hover:bg-[#6B00D7]/80"
                    disabled={createVaultMutation.isPending || isCreatingContract}
                  >
                    {createVaultMutation.isPending || isCreatingContract ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        {isCreatingContract ? 'Deploying Contract...' : 'Creating Vault...'}
                      </>
                    ) : (
                      'Create Vault'
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </form>
      </Form>
    </div>
  );
}
