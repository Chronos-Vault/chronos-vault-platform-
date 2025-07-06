import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery } from '@tanstack/react-query';
import { Loader2, LockIcon, ChevronRight, Shield, Clock, Map, Users, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useBlockchain } from '@/hooks/use-blockchain';
import { WalletConnector } from '@/components/wallet/WalletConnector';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

import tonVaultService from '@/services/TonVaultService';
import cvtTokenService from '@/services/CVTTokenService';

// Form validation schema
const vaultFormSchema = z.object({
  name: z.string().min(3, { message: "Vault name must be at least 3 characters" }),
  unlockDate: z.date().refine((date) => date > new Date(), {
    message: "Unlock date must be in the future",
  }),
  assetType: z.enum(['ton', 'jetton']),
  amount: z.number().positive().min(0.01, { message: "Amount must be at least 0.01" }),
  jettonAddress: z.string().optional(),
  description: z.string().optional(),
  securityLevel: z.enum(['standard', 'enhanced', 'maximum', 'fortress']),
  multiSignature: z.boolean().default(false),
  beneficiaries: z.array(z.string()).optional(),
  requiredConfirmations: z.number().min(1).optional(),
  geolocation: z.boolean().default(false),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  radiusKm: z.number().optional(),
  optimized: z.boolean().default(true),
});

type VaultFormValues = z.infer<typeof vaultFormSchema>;

export default function CreateTonVaultPage() {
  const { toast } = useToast();
  const { connectedWallet, activeChain } = useBlockchain();
  
  const [createdVaultId, setCreatedVaultId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form definition
  const form = useForm<VaultFormValues>({
    resolver: zodResolver(vaultFormSchema),
    defaultValues: {
      name: '',
      unlockDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days in the future
      assetType: 'ton',
      amount: 0,
      description: '',
      securityLevel: 'enhanced',
      multiSignature: false,
      beneficiaries: [],
      requiredConfirmations: 1,
      geolocation: false,
      optimized: true,
    },
  });
  
  // Get security levels
  const { data: securityLevels, isLoading: isLoadingSecurityLevels } = useQuery({
    queryKey: ['securityLevels'],
    queryFn: () => tonVaultService.getSecurityLevels(),
  });
  
  // Calculate fee based on selected security level
  const selectedSecurityLevel = form.watch('securityLevel');
  const securityLevelFee = securityLevels?.find(level => level.level === selectedSecurityLevel)?.fee || 0;
  
  // Get fee discount based on CVT staking
  const { data: feeDiscount, isLoading: isLoadingFeeDiscount } = useQuery({
    queryKey: ['feeDiscount', connectedWallet?.address],
    queryFn: () => connectedWallet?.address 
      ? cvtTokenService.calculateFeeDiscount(connectedWallet.address, securityLevelFee) 
      : Promise.resolve({ originalFee: securityLevelFee, discountedFee: securityLevelFee, discountPercent: 0, tier: 'None' }),
    enabled: !!connectedWallet?.address && securityLevelFee > 0,
  });
  
  // Generate beneficiary fields
  const beneficiaryCount = form.watch('multiSignature') ? form.watch('beneficiaries')?.length || 0 : 0;
  
  const addBeneficiary = () => {
    const currentBeneficiaries = form.getValues('beneficiaries') || [];
    form.setValue('beneficiaries', [...currentBeneficiaries, '']);
  };
  
  const removeBeneficiary = (index: number) => {
    const currentBeneficiaries = form.getValues('beneficiaries') || [];
    const newBeneficiaries = [...currentBeneficiaries];
    newBeneficiaries.splice(index, 1);
    
    form.setValue('beneficiaries', newBeneficiaries);
    
    // Ensure requiredConfirmations is not greater than the number of beneficiaries
    const currentRequired = form.getValues('requiredConfirmations') || 1;
    if (currentRequired > newBeneficiaries.length) {
      form.setValue('requiredConfirmations', newBeneficiaries.length);
    }
  };
  
  // Handle form submission
  const onSubmit = async (values: VaultFormValues) => {
    if (!connectedWallet) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a vault",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Prepare vault parameters
      const vaultParams = {
        name: values.name,
        unlockDate: values.unlockDate,
        assets: [
          {
            type: values.assetType,
            amount: values.amount,
            address: values.assetType === 'jetton' ? values.jettonAddress : undefined,
          }
        ],
        description: values.description,
        beneficiaries: values.multiSignature ? values.beneficiaries : [],
        requiredConfirmations: values.multiSignature ? values.requiredConfirmations : 1,
        geolocationRestriction: values.geolocation ? {
          latitude: values.latitude!,
          longitude: values.longitude!,
          radiusKm: values.radiusKm!
        } : undefined,
      };
      
      let vaultId;
      
      // Use optimized time-lock if selected and no special features are required
      if (values.optimized && 
          !values.multiSignature && 
          !values.geolocation && 
          values.assetType === 'ton' && 
          values.securityLevel === 'standard') {
        
        const optimizedResult = await tonVaultService.createOptimizedTimeLock(
          values.unlockDate, 
          values.amount
        );
        
        vaultId = optimizedResult.vaultId;
        
        // Show savings notification
        toast({
          title: "Optimized Vault Created",
          description: `Saved ${optimizedResult.comparisonToEthereum.savingsPercent.toFixed(1)}% in fees using TON's optimized time-lock`,
        });
      } else {
        // Create standard vault
        vaultId = await tonVaultService.createVault(vaultParams);
        
        toast({
          title: "Vault Created",
          description: `Your ${values.securityLevel} TON vault has been created successfully`,
        });
      }
      
      setCreatedVaultId(vaultId);
    } catch (error) {
      console.error("Vault creation error:", error);
      toast({
        title: "Vault creation failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Success view after vault creation
  const renderSuccess = () => {
    if (!createdVaultId) return null;
    
    return (
      <Card className="border border-green-500/20 bg-green-500/5">
        <CardHeader>
          <CardTitle className="text-green-500 flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckIcon className="h-3 w-3 text-green-500" />
            </div>
            Vault Created Successfully
          </CardTitle>
          <CardDescription>
            Your time-locked vault has been successfully created on the TON blockchain
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-secondary/30 rounded-lg">
              <div className="font-medium mb-1">Vault ID:</div>
              <div className="font-mono text-sm break-all">{createdVaultId}</div>
            </div>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Vault Locked</AlertTitle>
              <AlertDescription>
                Your assets are now securely locked until the specified unlock date
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => {
            form.reset();
            setCreatedVaultId(null);
          }}>
            Create Another Vault
          </Button>
          <Button onClick={() => {
            // This would navigate to vault details
            console.log("View vault details");
          }}>
            View Vault Details
          </Button>
        </CardFooter>
      </Card>
    );
  };
  
  // Main render function
  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text mb-2">
          Create TON Time Vault
        </h1>
        <p className="text-muted-foreground">
          Securely lock your TON assets with advanced time-based security features
        </p>
      </div>
      
      {createdVaultId ? (
        renderSuccess()
      ) : !connectedWallet ? (
        <Card className="border border-purple-800/20">
          <CardHeader>
            <CardTitle>Connect Wallet</CardTitle>
            <CardDescription>
              Connect your TON wallet to create a time-locked vault
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WalletConnector />
          </CardContent>
        </Card>
      ) : (
        <div>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="access">Access Control</TabsTrigger>
              <TabsTrigger value="review">Review</TabsTrigger>
            </TabsList>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <TabsContent value="basic">
                  <Card className="border border-purple-800/20">
                    <CardHeader>
                      <CardTitle>Basic Vault Information</CardTitle>
                      <CardDescription>
                        Configure the essential details for your time-locked vault
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      {/* Vault Name */}
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Vault Name</FormLabel>
                            <FormControl>
                              <Input placeholder="My TON Time Vault" {...field} />
                            </FormControl>
                            <FormDescription>
                              Enter a descriptive name for your vault
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Unlock Date */}
                      <FormField
                        control={form.control}
                        name="unlockDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Unlock Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date < new Date()
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormDescription>
                              Select when the vault will be unlockable
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Asset Type */}
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
                                  <SelectValue placeholder="Select asset type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="ton">TON</SelectItem>
                                <SelectItem value="jetton">Jetton</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Select the type of asset to lock in the vault
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Jetton Address (conditional) */}
                      {form.watch('assetType') === 'jetton' && (
                        <FormField
                          control={form.control}
                          name="jettonAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Jetton Address</FormLabel>
                              <FormControl>
                                <Input placeholder="Jetton contract address" {...field} />
                              </FormControl>
                              <FormDescription>
                                Enter the contract address of the Jetton
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      
                      {/* Amount */}
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.0"
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value);
                                  field.onChange(isNaN(value) ? 0 : value);
                                }}
                              />
                            </FormControl>
                            <FormDescription>
                              Amount of {form.watch('assetType') === 'ton' ? 'TON' : 'Jetton'} to lock
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Description */}
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Add description or notes about this vault" 
                                className="resize-none" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Provide additional details about the purpose of this vault
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" type="button" disabled>
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={() => form.trigger(['name', 'unlockDate', 'assetType', 'amount']).then(isValid => {
                          if (isValid) {
                            document.querySelector('[data-value="security"]')?.click();
                          }
                        })}
                      >
                        Next <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="security">
                  <Card className="border border-purple-800/20">
                    <CardHeader>
                      <CardTitle>Security Settings</CardTitle>
                      <CardDescription>
                        Configure the security features for your time-locked vault
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      {/* Security Level */}
                      <FormField
                        control={form.control}
                        name="securityLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Security Level</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid grid-cols-1 gap-4"
                              >
                                {isLoadingSecurityLevels ? (
                                  <div className="flex items-center justify-center p-4">
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                  </div>
                                ) : (
                                  securityLevels?.map((level) => (
                                    <div
                                      key={level.level}
                                      className={cn(
                                        "flex items-center space-x-2 rounded-md border p-4",
                                        field.value === level.level && "border-primary bg-primary/5"
                                      )}
                                    >
                                      <RadioGroupItem value={level.level} id={level.level} />
                                      <div className="flex-1 ml-2">
                                        <label
                                          htmlFor={level.level}
                                          className="flex items-center justify-between font-medium cursor-pointer"
                                        >
                                          <span className="capitalize">{level.level}</span>
                                          <Badge variant="outline">
                                            {feeDiscount && feeDiscount.discountPercent > 0 ? (
                                              <span>
                                                <span className="line-through text-muted-foreground mr-1">{level.fee} TON</span>
                                                {(level.fee * (1 - feeDiscount.discountPercent / 100)).toFixed(2)} TON
                                              </span>
                                            ) : (
                                              <span>{level.fee} TON</span>
                                            )}
                                          </Badge>
                                        </label>
                                        <div className="text-sm text-muted-foreground mt-1">{level.description}</div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                          {level.algorithms.map((algo) => (
                                            <Badge key={algo} variant="secondary">
                                              {algo}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </RadioGroup>
                            </FormControl>
                            <FormDescription>
                              Choose the security level for your vault
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Optimized Time Lock */}
                      <FormField
                        control={form.control}
                        name="optimized"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Optimized TON-Native Time Lock</FormLabel>
                              <FormDescription>
                                Use TON's native time-lock mechanism for lower fees (basic features only)
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
                    </CardContent>
                    
                    <CardFooter className="flex justify-between">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => document.querySelector('[data-value="basic"]')?.click()}
                      >
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={() => form.trigger(['securityLevel']).then(isValid => {
                          if (isValid) {
                            document.querySelector('[data-value="access"]')?.click();
                          }
                        })}
                      >
                        Next <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="access">
                  <Card className="border border-purple-800/20">
                    <CardHeader>
                      <CardTitle>Access Control</CardTitle>
                      <CardDescription>
                        Configure who can access the vault and under what conditions
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      {/* Multi-Signature */}
                      <FormField
                        control={form.control}
                        name="multiSignature"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Multi-Signature Protection</FormLabel>
                              <FormDescription>
                                Require multiple signatures to unlock the vault
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
                      
                      {/* Beneficiary Addresses */}
                      {form.watch('multiSignature') && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium mb-1">Beneficiaries</h4>
                              <p className="text-sm text-muted-foreground">
                                Add wallet addresses that can sign to unlock the vault
                              </p>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={addBeneficiary}
                            >
                              Add Beneficiary
                            </Button>
                          </div>
                          
                          {form.watch('beneficiaries')?.map((_, index) => (
                            <div key={index} className="flex gap-2 items-start">
                              <FormField
                                control={form.control}
                                name={`beneficiaries.${index}`}
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <Input placeholder="Beneficiary TON address" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeBeneficiary(index)}
                              >
                                <XIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          
                          {/* Required Confirmations */}
                          {beneficiaryCount > 0 && (
                            <FormField
                              control={form.control}
                              name="requiredConfirmations"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Required Confirmations</FormLabel>
                                  <Select
                                    onValueChange={(value) => field.onChange(parseInt(value))}
                                    defaultValue={field.value?.toString()}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select required confirmations" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {Array.from({ length: beneficiaryCount }, (_, i) => i + 1).map((count) => (
                                        <SelectItem key={count} value={count.toString()}>
                                          {count} of {beneficiaryCount}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormDescription>
                                    Number of signatures required to unlock the vault
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                        </div>
                      )}
                      
                      {/* Geolocation Restriction */}
                      <FormField
                        control={form.control}
                        name="geolocation"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Geolocation Restriction</FormLabel>
                              <FormDescription>
                                Require the recipient to be in a specific location to unlock the vault
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
                      
                      {/* Geolocation Details */}
                      {form.watch('geolocation') && (
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="latitude"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Latitude</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.000001"
                                    placeholder="0.0"
                                    onChange={(e) => {
                                      const value = parseFloat(e.target.value);
                                      field.onChange(isNaN(value) ? 0 : value);
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="longitude"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Longitude</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.000001"
                                    placeholder="0.0"
                                    onChange={(e) => {
                                      const value = parseFloat(e.target.value);
                                      field.onChange(isNaN(value) ? 0 : value);
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="radiusKm"
                            render={({ field }) => (
                              <FormItem className="col-span-2">
                                <FormLabel>Radius (km)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.1"
                                    placeholder="0.0"
                                    onChange={(e) => {
                                      const value = parseFloat(e.target.value);
                                      field.onChange(isNaN(value) ? 0 : value);
                                    }}
                                  />
                                </FormControl>
                                <FormDescription>
                                  The radius in kilometers around the specified coordinates
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                    </CardContent>
                    
                    <CardFooter className="flex justify-between">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => document.querySelector('[data-value="security"]')?.click()}
                      >
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          const fieldsToValidate = ['securityLevel'];
                          
                          if (form.watch('multiSignature')) {
                            fieldsToValidate.push('beneficiaries', 'requiredConfirmations');
                          }
                          
                          if (form.watch('geolocation')) {
                            fieldsToValidate.push('latitude', 'longitude', 'radiusKm');
                          }
                          
                          form.trigger(fieldsToValidate as any).then(isValid => {
                            if (isValid) {
                              document.querySelector('[data-value="review"]')?.click();
                            }
                          });
                        }}
                      >
                        Next <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="review">
                  <Card className="border border-purple-800/20">
                    <CardHeader>
                      <CardTitle>Review & Create Vault</CardTitle>
                      <CardDescription>
                        Review your vault configuration before creation
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Vault Name</h3>
                            <p>{form.getValues('name')}</p>
                          </div>
                          
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Unlock Date</h3>
                            <p>{format(form.getValues('unlockDate'), "PPP")}</p>
                          </div>
                          
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Assets</h3>
                            <p>{form.getValues('amount')} {form.getValues('assetType') === 'ton' ? 'TON' : 'Jetton'}</p>
                            {form.getValues('assetType') === 'jetton' && (
                              <p className="text-xs font-mono mt-1 truncate">{form.getValues('jettonAddress')}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Security Level</h3>
                            <p className="capitalize">{form.getValues('securityLevel')}</p>
                          </div>
                          
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Features</h3>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {form.getValues('optimized') && (
                                <Badge variant="outline">Optimized</Badge>
                              )}
                              {form.getValues('multiSignature') && (
                                <Badge variant="outline">
                                  Multi-Signature ({form.getValues('requiredConfirmations')} of {form.getValues('beneficiaries')?.length})
                                </Badge>
                              )}
                              {form.getValues('geolocation') && (
                                <Badge variant="outline">Geolocation Restricted</Badge>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Fee</h3>
                            {feeDiscount && feeDiscount.discountPercent > 0 ? (
                              <div>
                                <span className="line-through text-muted-foreground mr-1">{securityLevelFee} TON</span>
                                <span>{feeDiscount.discountedFee.toFixed(2)} TON</span>
                                <Badge className="ml-2 bg-gradient-to-r from-purple-600/10 to-pink-500/10 border-purple-600/30">
                                  {feeDiscount.discountPercent}% Discount
                                </Badge>
                              </div>
                            ) : (
                              <p>{securityLevelFee} TON</p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {form.getValues('description') && (
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                          <p className="text-sm">{form.getValues('description')}</p>
                        </div>
                      )}
                      
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Important</AlertTitle>
                        <AlertDescription>
                          Once created, the vault cannot be modified or cancelled. Assets will be locked until the specified unlock date.
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                    
                    <CardFooter className="flex justify-between">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => document.querySelector('[data-value="access"]')?.click()}
                      >
                        Back
                      </Button>
                      <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90">
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating Vault...
                          </>
                        ) : (
                          <>
                            Create Vault
                            <LockIcon className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </form>
            </Form>
          </Tabs>
        </div>
      )}
      
      <Separator className="my-8" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-purple-800/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              Time-Locked Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Assets are securely time-locked and cannot be accessed until the specified unlock date
            </p>
          </CardContent>
        </Card>
        
        <Card className="border border-purple-800/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              Quantum-Resistant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Our Fortress™ security level uses quantum-resistant encryption to protect your assets
            </p>
          </CardContent>
        </Card>
        
        <Card className="border border-purple-800/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-500" />
              Multi-Signature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Enhance security by requiring multiple approvals to unlock your valuable assets
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Icons
const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);