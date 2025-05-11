import React, { useEffect, useState } from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, ArrowRightCircle, Check, ShieldAlert, RefreshCw } from "lucide-react";
import { ChainType } from "@shared/types/blockchain-types";
import { apiRequest } from '@/lib/queryClient';
import { useToast } from "@/hooks/use-toast";
import { useBlockchain } from '@/hooks/use-blockchain';

// Supported chains
const CHAINS = [
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', icon: '🔷' },
  { id: 'solana', name: 'Solana', symbol: 'SOL', icon: '🟣' },
  { id: 'ton', name: 'TON', symbol: 'TON', icon: '💎' },
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', icon: '🟠' }
];

// Supported assets per chain
const CHAIN_ASSETS = {
  ethereum: [
    { id: 'eth', name: 'Ethereum', symbol: 'ETH' },
    { id: 'usdc', name: 'USD Coin', symbol: 'USDC' },
    { id: 'usdt', name: 'Tether', symbol: 'USDT' },
    { id: 'cvt', name: 'Chronos Vault Token', symbol: 'CVT' },
  ],
  solana: [
    { id: 'sol', name: 'Solana', symbol: 'SOL' },
    { id: 'usdc', name: 'USD Coin', symbol: 'USDC' },
    { id: 'cvt', name: 'Chronos Vault Token', symbol: 'CVT' },
  ],
  ton: [
    { id: 'ton', name: 'TON', symbol: 'TON' },
    { id: 'cvt', name: 'Chronos Vault Token', symbol: 'CVT' },
  ],
  bitcoin: [
    { id: 'btc', name: 'Bitcoin', symbol: 'BTC' },
  ]
};

// Transfer form schema
const transferSchema = z.object({
  sourceChain: z.enum(["ethereum", "solana", "ton", "bitcoin"]),
  targetChain: z.enum(["ethereum", "solana", "ton", "bitcoin"]),
  assetType: z.string().min(1, "Asset is required"),
  amount: z.string().refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    },
    { message: "Amount must be a positive number" }
  ),
  recipientAddress: z.string().min(1, "Recipient address is required"),
});

// Atomic swap form schema
const atomicSwapSchema = z.object({
  initiatorChain: z.enum(["ethereum", "solana", "ton", "bitcoin"]),
  responderChain: z.enum(["ethereum", "solana", "ton", "bitcoin"]),
  initiatorAsset: z.string().min(1, "Asset is required"),
  responderAsset: z.string().min(1, "Asset is required"),
  initiatorAmount: z.string().refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    },
    { message: "Amount must be a positive number" }
  ),
  responderAmount: z.string().refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    },
    { message: "Amount must be a positive number" }
  ),
  responderAddress: z.string().min(1, "Recipient address is required"),
  timelock: z.number().int().min(1800, "Timelock must be at least 30 minutes").default(3600),
});

const CrossChainBridgePage: React.FC = () => {
  const { toast } = useToast();
  const { wallets, connected } = useBlockchain();
  const [bridgeStatuses, setBridgeStatuses] = useState<any[]>([]);
  const [loadingStatuses, setLoadingStatuses] = useState(true);
  const [activeTransactions, setActiveTransactions] = useState<any[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [activeSwaps, setActiveSwaps] = useState<any[]>([]);
  const [loadingSwaps, setLoadingSwaps] = useState(true);

  // Transfer form
  const transferForm = useForm<z.infer<typeof transferSchema>>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      sourceChain: "ethereum",
      targetChain: "ton",
      assetType: "",
      amount: "",
      recipientAddress: "",
    },
  });

  // Atomic swap form
  const swapForm = useForm<z.infer<typeof atomicSwapSchema>>({
    resolver: zodResolver(atomicSwapSchema),
    defaultValues: {
      initiatorChain: "ethereum",
      responderChain: "ton",
      initiatorAsset: "",
      responderAsset: "",
      initiatorAmount: "",
      responderAmount: "",
      responderAddress: "",
      timelock: 3600,
    },
  });

  // Watch for source chain changes to update asset type options
  const sourceChain = transferForm.watch("sourceChain");
  const targetChain = transferForm.watch("targetChain");
  const initiatorChain = swapForm.watch("initiatorChain");
  const responderChain = swapForm.watch("responderChain");

  // Reset asset type when source chain changes
  useEffect(() => {
    transferForm.setValue("assetType", "");
  }, [sourceChain, transferForm]);

  useEffect(() => {
    swapForm.setValue("initiatorAsset", "");
  }, [initiatorChain, swapForm]);

  useEffect(() => {
    swapForm.setValue("responderAsset", "");
  }, [responderChain, swapForm]);

  // Fetch bridge statuses
  const fetchBridgeStatuses = async () => {
    try {
      setLoadingStatuses(true);
      const response = await apiRequest("GET", "/api/bridge/status");
      const data = await response.json();
      
      if (data.success) {
        const statuses = Object.values(data.data || {});
        setBridgeStatuses(statuses);
      }
    } catch (error) {
      console.error("Error fetching bridge statuses:", error);
      toast({
        title: "Error",
        description: "Failed to fetch bridge statuses",
        variant: "destructive",
      });
    } finally {
      setLoadingStatuses(false);
    }
  };

  // Fetch active transactions
  const fetchTransactions = async () => {
    try {
      setLoadingTransactions(true);
      const response = await apiRequest("GET", "/api/bridge/transactions");
      const data = await response.json();
      
      if (data.success) {
        setActiveTransactions(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoadingTransactions(false);
    }
  };

  // Fetch active atomic swaps
  const fetchAtomicSwaps = async () => {
    try {
      setLoadingSwaps(true);
      const response = await apiRequest("GET", "/api/bridge/atomic-swaps");
      const data = await response.json();
      
      if (data.success) {
        setActiveSwaps(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching atomic swaps:", error);
    } finally {
      setLoadingSwaps(false);
    }
  };

  // Initialize page data
  useEffect(() => {
    fetchBridgeStatuses();
    fetchTransactions();
    fetchAtomicSwaps();

    // Refresh data every 30 seconds
    const interval = setInterval(() => {
      fetchBridgeStatuses();
      fetchTransactions();
      fetchAtomicSwaps();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Handle transfer submission
  const onTransferSubmit = async (values: z.infer<typeof transferSchema>) => {
    if (!connected) {
      toast({
        title: "Error",
        description: "You need to connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    try {
      const senderAddress = wallets[values.sourceChain as ChainType]?.address || "";
      
      if (!senderAddress) {
        toast({
          title: "Error",
          description: `${values.sourceChain} wallet not connected`,
          variant: "destructive",
        });
        return;
      }

      const response = await apiRequest("POST", "/api/bridge/transfer", {
        sourceChain: values.sourceChain,
        targetChain: values.targetChain,
        amount: parseFloat(values.amount),
        assetType: values.assetType,
        senderAddress,
        recipientAddress: values.recipientAddress,
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Transfer initiated successfully",
        });
        
        // Reset form
        transferForm.reset({
          sourceChain: "ethereum",
          targetChain: "ton",
          assetType: "",
          amount: "",
          recipientAddress: "",
        });
        
        // Refresh transactions
        fetchTransactions();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to initiate transfer",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error during transfer:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  // Handle atomic swap submission
  const onSwapSubmit = async (values: z.infer<typeof atomicSwapSchema>) => {
    if (!connected) {
      toast({
        title: "Error",
        description: "You need to connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    try {
      const initiatorAddress = wallets[values.initiatorChain as ChainType]?.address || "";
      
      if (!initiatorAddress) {
        toast({
          title: "Error",
          description: `${values.initiatorChain} wallet not connected`,
          variant: "destructive",
        });
        return;
      }

      const response = await apiRequest("POST", "/api/bridge/atomic-swap", {
        initiatorChain: values.initiatorChain,
        responderChain: values.responderChain,
        initiatorAsset: values.initiatorAsset,
        responderAsset: values.responderAsset,
        initiatorAmount: parseFloat(values.initiatorAmount),
        responderAmount: parseFloat(values.responderAmount),
        initiatorAddress,
        responderAddress: values.responderAddress,
        timelock: values.timelock,
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Atomic swap initiated successfully",
        });
        
        // Reset form
        swapForm.reset({
          initiatorChain: "ethereum",
          responderChain: "ton",
          initiatorAsset: "",
          responderAsset: "",
          initiatorAmount: "",
          responderAmount: "",
          responderAddress: "",
          timelock: 3600,
        });
        
        // Refresh swaps
        fetchAtomicSwaps();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to initiate atomic swap",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error during atomic swap:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  // Handle bridge initialization
  const initializeBridge = async (sourceChain: string, targetChain: string) => {
    try {
      const response = await apiRequest("POST", "/api/bridge/initialize", {
        sourceChain,
        targetChain,
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Bridge initialized successfully",
        });
        
        // Refresh statuses
        fetchBridgeStatuses();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to initialize bridge",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error initializing bridge:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
        Cross-Chain Bridge
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center text-white mr-2">
                <ArrowRightCircle size={18} />
              </div>
              Bridge Operations
            </CardTitle>
            <CardDescription>
              Transfer assets between different blockchain networks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="transfer">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="transfer">Asset Transfer</TabsTrigger>
                <TabsTrigger value="atomic-swap">Atomic Swap</TabsTrigger>
              </TabsList>
              
              <TabsContent value="transfer">
                <Form {...transferForm}>
                  <form onSubmit={transferForm.handleSubmit(onTransferSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={transferForm.control}
                        name="sourceChain"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Source Chain</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select chain" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {CHAINS.map((chain) => (
                                  <SelectItem key={chain.id} value={chain.id}>
                                    {chain.icon} {chain.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={transferForm.control}
                        name="targetChain"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Target Chain</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select chain" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {CHAINS.filter(c => c.id !== sourceChain).map((chain) => (
                                  <SelectItem key={chain.id} value={chain.id}>
                                    {chain.icon} {chain.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={transferForm.control}
                      name="assetType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Asset</FormLabel>
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
                              {CHAIN_ASSETS[sourceChain as keyof typeof CHAIN_ASSETS]?.map((asset) => (
                                <SelectItem key={asset.id} value={asset.id}>
                                  {asset.name} ({asset.symbol})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={transferForm.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <Input type="number" step="any" placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={transferForm.control}
                      name="recipientAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recipient Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter recipient address" {...field} />
                          </FormControl>
                          <FormDescription>
                            Address on the {targetChain} network
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full">
                      Initiate Transfer
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="atomic-swap">
                <Form {...swapForm}>
                  <form onSubmit={swapForm.handleSubmit(onSwapSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={swapForm.control}
                        name="initiatorChain"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Chain</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select chain" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {CHAINS.map((chain) => (
                                  <SelectItem key={chain.id} value={chain.id}>
                                    {chain.icon} {chain.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={swapForm.control}
                        name="responderChain"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Recipient Chain</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select chain" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {CHAINS.filter(c => c.id !== initiatorChain).map((chain) => (
                                  <SelectItem key={chain.id} value={chain.id}>
                                    {chain.icon} {chain.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={swapForm.control}
                        name="initiatorAsset"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Asset to Send</FormLabel>
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
                                {CHAIN_ASSETS[initiatorChain as keyof typeof CHAIN_ASSETS]?.map((asset) => (
                                  <SelectItem key={asset.id} value={asset.id}>
                                    {asset.name} ({asset.symbol})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={swapForm.control}
                        name="initiatorAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount to Send</FormLabel>
                            <FormControl>
                              <Input type="number" step="any" placeholder="0.00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={swapForm.control}
                        name="responderAsset"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Asset to Receive</FormLabel>
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
                                {CHAIN_ASSETS[responderChain as keyof typeof CHAIN_ASSETS]?.map((asset) => (
                                  <SelectItem key={asset.id} value={asset.id}>
                                    {asset.name} ({asset.symbol})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={swapForm.control}
                        name="responderAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount to Receive</FormLabel>
                            <FormControl>
                              <Input type="number" step="any" placeholder="0.00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={swapForm.control}
                      name="responderAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recipient Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter recipient address" {...field} />
                          </FormControl>
                          <FormDescription>
                            Address on the {responderChain} network
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={swapForm.control}
                      name="timelock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Timelock (seconds)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={1800} 
                              step={60} 
                              {...field} 
                              onChange={e => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            Time until the swap expires (minimum 30 minutes)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full">
                      Create Atomic Swap
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center text-white mr-2">
                <ShieldAlert size={18} />
              </div>
              Bridge Status
            </CardTitle>
            <CardDescription>
              Current status of cross-chain bridges
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loadingStatuses ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : bridgeStatuses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No bridges initialized yet</p>
                </div>
              ) : (
                bridgeStatuses.map((bridge, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className={`h-2 ${
                      bridge.status === 'operational' ? 'bg-green-500' :
                      bridge.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="flex items-center">
                            <span className="font-semibold">{bridge.sourceChain?.toUpperCase()}</span>
                            <ArrowRightCircle size={16} className="mx-2" />
                            <span className="font-semibold">{bridge.targetChain?.toUpperCase()}</span>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            Status: <span className={
                              bridge.status === 'operational' ? 'text-green-500' :
                              bridge.status === 'degraded' ? 'text-yellow-500' : 'text-red-500'
                            }>{bridge.status}</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Latency: {bridge.latency}ms • Success Rate: {bridge.successRate.toFixed(1)}%
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="ml-2"
                          onClick={() => initializeBridge(bridge.sourceChain, bridge.targetChain)}
                        >
                          Reinitialize
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}

              <div className="flex justify-end mt-4">
                <Button variant="outline" size="sm" onClick={fetchBridgeStatuses}>
                  <RefreshCw size={14} className="mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center text-white mr-2">
                <RefreshCw size={18} />
              </div>
              Active Transfers
            </CardTitle>
            <CardDescription>
              Your pending and recent transfers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {loadingTransactions ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : activeTransactions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No active transfers</p>
                </div>
              ) : (
                activeTransactions.map((tx, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between">
                      <div className="font-medium">
                        {tx.sourceChain?.toUpperCase()} → {tx.targetChain?.toUpperCase()}
                      </div>
                      <div className={`text-sm font-medium ${
                        tx.status === 'completed' ? 'text-green-500' :
                        tx.status === 'failed' ? 'text-red-500' : 'text-yellow-500'
                      }`}>
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </div>
                    </div>
                    <div className="text-sm mt-2">
                      {tx.amount} {tx.assetType?.toUpperCase()}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Transaction ID: {tx.id.substring(0, 16)}...
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Created: {new Date(tx.createdAt).toLocaleString()}
                    </div>
                    {tx.completedAt && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Completed: {new Date(tx.completedAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center text-white mr-2">
                <RefreshCw size={18} />
              </div>
              Atomic Swaps
            </CardTitle>
            <CardDescription>
              Your atomic swaps with other participants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {loadingSwaps ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : activeSwaps.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No atomic swaps</p>
                </div>
              ) : (
                activeSwaps.map((swap, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between">
                      <div className="font-medium">
                        {swap.initiatorChain?.toUpperCase()} ⇄ {swap.responderChain?.toUpperCase()}
                      </div>
                      <div className={`text-sm font-medium ${
                        swap.status === 'completed' ? 'text-green-500' :
                        swap.status === 'refunded' || swap.status === 'failed' || swap.status === 'expired' ? 'text-red-500' : 'text-yellow-500'
                      }`}>
                        {swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}
                      </div>
                    </div>
                    <div className="text-sm mt-2 grid grid-cols-2 gap-x-4">
                      <div>
                        Send: {swap.initiatorAmount} {swap.initiatorAsset?.toUpperCase()}
                      </div>
                      <div>
                        Receive: {swap.responderAmount} {swap.responderAsset?.toUpperCase()}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Swap ID: {swap.id.substring(0, 16)}...
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Created: {new Date(swap.createdAt).toLocaleString()}
                    </div>
                    {swap.completedAt && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Completed: {new Date(swap.completedAt).toLocaleString()}
                      </div>
                    )}
                    {swap.status !== 'completed' && swap.status !== 'refunded' && swap.status !== 'expired' && swap.status !== 'failed' && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Expires: {new Date(swap.expiresAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CrossChainBridgePage;