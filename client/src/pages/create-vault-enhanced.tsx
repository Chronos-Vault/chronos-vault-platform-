import React, { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { useMultiChain, BlockchainType } from "@/contexts/multi-chain-context";
import { useTon } from "@/contexts/ton-context";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Clock, Shield, Wallet, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Define the schema for vault creation
const vaultFormSchema = z.object({
  name: z.string().min(3, "Vault name must be at least 3 characters"),
  description: z.string().optional(),
  unlockDate: z.string().refine(date => new Date(date) > new Date(), {
    message: "Unlock date must be in the future",
  }),
  blockchain: z.string().min(1, "Please select a blockchain"),
  assetAmount: z.string().min(1, "Please enter an amount to lock"),
  beneficiaryAddress: z.string().optional(),
  securityLevel: z.string().default("standard"),
});

type VaultFormValues = z.infer<typeof vaultFormSchema>;

const CreateVaultEnhanced = () => {
  const [_, navigate] = useLocation();
  const search = useSearch();
  const { toast } = useToast();
  const { isAnyWalletConnected, connectChain, walletInfo, chainStatus } = useMultiChain();
  const ton = useTon();
  
  const [isCreating, setIsCreating] = useState(false);
  const [activeBlockchain, setActiveBlockchain] = useState<BlockchainType>(BlockchainType.TON);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  
  // Get vault type from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(search);
    const vaultType = params.get('type');
    
    // Redirect to the intent inheritance vault page if that type is selected
    if (vaultType === 'intent-inheritance') {
      navigate('/intent-inheritance-vault');
    }
  }, [search, navigate]);

  // Initialize form with default values
  const form = useForm<VaultFormValues>({
    resolver: zodResolver(vaultFormSchema),
    defaultValues: {
      name: "",
      description: "",
      unlockDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().substring(0, 16), // 30 days from now
      blockchain: BlockchainType.TON,
      assetAmount: "0.1",
      beneficiaryAddress: "",
      securityLevel: "standard",
    },
  });

  // Format display address for readability
  const formatAddress = (address: string) => {
    if (!address) return "";
    if (address.length <= 12) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Check if wallet is connected for the selected blockchain
  const isWalletConnected = (blockchain: BlockchainType): boolean => {
    return chainStatus[blockchain]?.isConnected || false;
  };

  // Handle blockchain selection
  const handleBlockchainChange = (value: string) => {
    const chain = value as BlockchainType;
    setActiveBlockchain(chain);
    form.setValue("blockchain", value);
  };

  // Handle wallet connection
  const handleConnectWallet = async () => {
    setIsConnectingWallet(true);
    try {
      await connectChain(activeBlockchain);
      toast({
        title: "Wallet Connected",
        description: `Successfully connected to ${activeBlockchain} wallet`,
      });
      
      // Automatically fill beneficiary with wallet address if empty
      if (!form.getValues("beneficiaryAddress")) {
        const currentWalletInfo = walletInfo[activeBlockchain as keyof typeof walletInfo];
        if (currentWalletInfo?.address) {
          form.setValue("beneficiaryAddress", currentWalletInfo.address);
        }
      }
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || `Failed to connect to ${activeBlockchain} wallet`,
        variant: "destructive",
      });
    } finally {
      setIsConnectingWallet(false);
    }
  };

  // Create the vault
  const onSubmit = async (data: VaultFormValues) => {
    setIsCreating(true);
    try {
      // Ensure wallet is connected
      if (!isWalletConnected(activeBlockchain)) {
        throw new Error("Wallet must be connected to create a vault");
      }

      // Create vault differently based on blockchain
      if (activeBlockchain === BlockchainType.TON) {
        // Convert unlock date to Unix timestamp
        const unlockTime = Math.floor(new Date(data.unlockDate).getTime() / 1000);
        
        // Create TON vault
        const result = await ton.createVault({
          unlockTime,
          amount: data.assetAmount,
          recipient: data.beneficiaryAddress || ton.walletInfo?.address,
          comment: data.description || `Vault: ${data.name}`,
        });

        if (!result.success) {
          throw new Error(result.error || "Failed to create vault");
        }

        toast({
          title: "Vault Created Successfully",
          description: `Your vault will unlock on ${new Date(unlockTime * 1000).toLocaleDateString()}`,
        });

        // Navigate to vault details or list
        navigate("/my-vaults");
      } else {
        // For other blockchains, we'll implement later
        toast({
          title: "Feature Coming Soon",
          description: `Vault creation for ${activeBlockchain} will be available soon`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Vault Creation Failed",
        description: error.message || "Something went wrong while creating your vault",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <section className="py-16 min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#121212]">
      <div className="container mx-auto px-4">
        <Button
          variant="ghost" 
          className="mb-8 text-gray-400 hover:text-white"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-poppins font-bold text-4xl mb-2">Create Your Time Vault</h1>
            <p className="text-gray-400 max-w-3xl mx-auto">
              Lock your assets securely with blockchain technology. Set the unlock date and conditions for access.
              Your assets remain under your control but inaccessible until the time conditions are met.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <Card className="bg-gradient-to-br from-[#111] to-[#161616] border-[#6B00D7]/20 hover:border-[#6B00D7]/40 transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-[#6B00D7]/10 mb-4">
                    <Shield className="h-6 w-6 text-[#6B00D7]" />
                  </div>
                  <h3 className="font-poppins font-medium text-lg mb-2">Secure by Design</h3>
                  <p className="text-gray-400 text-sm">Your assets are secured by military-grade blockchain cryptography</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-[#111] to-[#161616] border-[#FF5AF7]/20 hover:border-[#FF5AF7]/40 transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-[#FF5AF7]/10 mb-4">
                    <Clock className="h-6 w-6 text-[#FF5AF7]" />
                  </div>
                  <h3 className="font-poppins font-medium text-lg mb-2">Time-Locked</h3>
                  <p className="text-gray-400 text-sm">Assets are automatically unlocked at your specified future date</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-[#111] to-[#161616] border-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 hover:from-[#6B00D7]/40 hover:to-[#FF5AF7]/40 transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-gradient-to-r from-[#6B00D7]/10 to-[#FF5AF7]/10 mb-4">
                    <Wallet className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-poppins font-medium text-lg mb-2">Multi-Chain Support</h3>
                  <p className="text-gray-400 text-sm">Create vaults across different blockchains for maximum security</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="border-[#6B00D7]/30 bg-gradient-to-br from-[#131313] to-[#1A1A1A] shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-poppins">Vault Configuration</CardTitle>
              <CardDescription>
                Configure the parameters for your new time-locked vault
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue={BlockchainType.TON} onValueChange={handleBlockchainChange}>
                <TabsList className="grid w-full grid-cols-4 mb-8">
                  <TabsTrigger value={BlockchainType.TON}>TON</TabsTrigger>
                  <TabsTrigger value={BlockchainType.ETHEREUM}>Ethereum</TabsTrigger>
                  <TabsTrigger value={BlockchainType.SOLANA}>Solana</TabsTrigger>
                  <TabsTrigger value={BlockchainType.BITCOIN}>Bitcoin</TabsTrigger>
                </TabsList>
                
                <div className="mb-6">
                  {!isWalletConnected(activeBlockchain) ? (
                    <div className="p-4 border border-[#FF5AF7]/30 rounded-lg bg-[#1F1F1F] mb-6">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertTriangle className="h-5 w-5 text-[#FF5AF7]" />
                        <h3 className="font-medium text-white">Wallet Connection Required</h3>
                      </div>
                      <p className="text-gray-400 text-sm mb-4">
                        Connect your {activeBlockchain} wallet to create a vault. This ensures your assets 
                        are properly secured and accessible to you when the time lock expires.
                      </p>
                      <Button 
                        onClick={handleConnectWallet}
                        disabled={isConnectingWallet}
                        className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#7B10E7] hover:to-[#FF6AF7] text-white w-full sm:w-auto"
                      >
                        {isConnectingWallet ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <Wallet className="h-4 w-4 mr-2" />
                            Connect {activeBlockchain} Wallet
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="p-4 border border-[#6B00D7]/30 rounded-lg bg-[#1F1F1F] mb-6">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <div>
                          <h3 className="font-medium text-white">{activeBlockchain} Wallet Connected</h3>
                          <p className="text-gray-400 text-sm">
                            {formatAddress(walletInfo[activeBlockchain as keyof typeof walletInfo]?.address || "")}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Vault Name</FormLabel>
                            <FormControl>
                              <Input placeholder="My Time Vault" {...field} className="bg-[#1A1A1A] border-[#6B00D7]/20" />
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
                        name="unlockDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unlock Date</FormLabel>
                            <FormControl>
                              <Input 
                                type="datetime-local" 
                                {...field}
                                className="bg-[#1A1A1A] border-[#6B00D7]/20" 
                              />
                            </FormControl>
                            <FormDescription>
                              When your assets will become accessible
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
                              placeholder="Add details about this vault's purpose"
                              className="resize-none bg-[#1A1A1A] border-[#6B00D7]/20 min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            This description will be stored with your vault
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="assetAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount to Lock</FormLabel>
                            <div className="flex items-center space-x-2">
                              <FormControl>
                                <Input 
                                  type="text" 
                                  placeholder="0.00" 
                                  {...field} 
                                  className="bg-[#1A1A1A] border-[#6B00D7]/20" 
                                />
                              </FormControl>
                              <div className="py-2 px-3 rounded bg-[#1F1F1F] text-white font-medium text-sm">
                                {activeBlockchain === BlockchainType.TON ? 'TON' : 
                                 activeBlockchain === BlockchainType.ETHEREUM ? 'ETH' : 
                                 activeBlockchain === BlockchainType.SOLANA ? 'SOL' :
                                 activeBlockchain === BlockchainType.BITCOIN ? 'BTC' : '???'}
                              </div>
                            </div>
                            <FormDescription>
                              The amount of {activeBlockchain === BlockchainType.TON ? 'TON' : 
                                            activeBlockchain === BlockchainType.ETHEREUM ? 'ETH' : 
                                            activeBlockchain === BlockchainType.SOLANA ? 'SOL' :
                                            activeBlockchain === BlockchainType.BITCOIN ? 'BTC' : 'tokens'} to lock
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="beneficiaryAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Beneficiary Address (Optional)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Leave empty to use your wallet address" 
                                {...field} 
                                className="bg-[#1A1A1A] border-[#6B00D7]/20" 
                              />
                            </FormControl>
                            <FormDescription>
                              Who can access the vault when unlocked
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="securityLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Security Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-[#1A1A1A] border-[#6B00D7]/20">
                                <SelectValue placeholder="Select security level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-[#1A1A1A] border-[#6B00D7]/50">
                              <SelectItem value="standard">Standard Security</SelectItem>
                              <SelectItem value="enhanced">Enhanced Security (Multi-Chain)</SelectItem>
                              <SelectItem value="maximum">Maximum Security (Triple Chain + Zero Knowledge)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Higher security levels use multiple blockchains for additional protection
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="pt-2">
                      <Button 
                        type="submit" 
                        disabled={isCreating || !isWalletConnected(activeBlockchain)}
                        className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#7B10E7] hover:to-[#FF6AF7] text-white w-full md:w-auto px-8"
                      >
                        {isCreating ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Creating Vault...
                          </>
                        ) : (
                          <>Create Vault</>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </Tabs>
            </CardContent>
            
            <CardFooter className="text-xs text-gray-400 flex flex-col items-start pt-6 border-t border-[#6B00D7]/10">
              <p>All vaults are deployed to blockchain networks and secured by cryptographic protocols.</p>
              <p className="mt-1">Testnet deployment mode: No real assets will be moved during testing.</p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CreateVaultEnhanced;
