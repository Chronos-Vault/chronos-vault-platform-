import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery } from '@tanstack/react-query';
import { Loader2, ArrowRightLeft, AlertCircle, Info } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ChainType } from '@/contexts/wallet-context';
import WalletConnect from '@/components/wallet/WalletConnect';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import tonBridgeService from '@/services/TonBridgeService';
import cvtTokenService, { StakingTier } from '@/services/CVTTokenService';

// Form validation schema
const bridgeFormSchema = z.object({
  sourceChain: z.enum(['ton', 'ethereum', 'solana', 'bitcoin']),
  targetChain: z.enum(['ton', 'ethereum', 'solana', 'bitcoin']),
  amount: z.number().positive().min(0.001, { message: "Amount must be at least 0.001" }),
  token: z.string(),
  recipientAddress: z.string().min(10, { message: "Please enter a valid recipient address" }),
  slippage: z.number().min(0.1).max(5).optional(),
});

type BridgeFormValues = z.infer<typeof bridgeFormSchema>;

export default function CrossChainBridgePage() {
  const { toast } = useToast();
  // Temporarily set mock data since we removed the hook
  const connectedWallet = null;
  const activeChain = null;
  const connect = async () => false;
  const disconnect = () => {};
  
  const [sourceChain, setSourceChain] = useState<ChainType>(activeChain || 'ton');
  const [targetChain, setTargetChain] = useState<ChainType>(activeChain === 'ton' ? 'ethereum' : 'ton');
  const [quote, setQuote] = useState<any>(null);
  const [pendingTx, setPendingTx] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<any>(null);
  
  // Form definition
  const form = useForm<BridgeFormValues>({
    resolver: zodResolver(bridgeFormSchema),
    defaultValues: {
      sourceChain: sourceChain,
      targetChain: targetChain,
      amount: 0,
      token: '',
      recipientAddress: '',
      slippage: 1.0,
    },
  });
  
  // Reset form when connected wallet changes
  useEffect(() => {
    if (connectedWallet) {
      form.setValue('recipientAddress', connectedWallet.address);
      
      if (activeChain) {
        setSourceChain(activeChain);
        setTargetChain(activeChain === 'ton' ? 'ethereum' : 'ton');
        form.setValue('sourceChain', activeChain);
        form.setValue('targetChain', activeChain === 'ton' ? 'ethereum' : 'ton');
      }
    }
  }, [connectedWallet, activeChain, form]);
  
  // Get supported tokens for source chain
  const { data: sourceTokens, isLoading: isLoadingSourceTokens } = useQuery({
    queryKey: ['bridgeTokens', sourceChain],
    queryFn: () => tonBridgeService.getSupportedTokens(sourceChain),
    enabled: !!sourceChain,
  });
  
  // Get supported tokens for target chain
  const { data: targetTokens, isLoading: isLoadingTargetTokens } = useQuery({
    queryKey: ['bridgeTokens', targetChain],
    queryFn: () => tonBridgeService.getSupportedTokens(targetChain),
    enabled: !!targetChain,
  });
  
  // Get fee discount based on CVT staking
  const { data: feeDiscount, isLoading: isLoadingFeeDiscount } = useQuery({
    queryKey: ['feeDiscount', connectedWallet?.address],
    queryFn: () => connectedWallet?.address ? tonBridgeService.getFeeDiscount(connectedWallet.address) : Promise.resolve({ discountPercent: 0, tier: 'None', stakedAmount: 0 }),
    enabled: !!connectedWallet?.address,
  });
  
  // Handle source chain change
  const handleSourceChainChange = (value: ChainType) => {
    setSourceChain(value);
    form.setValue('sourceChain', value);
    
    // Ensure source and target chains are different
    if (value === targetChain) {
      const newTargetChain = value === 'ton' ? 'ethereum' : 'ton';
      setTargetChain(newTargetChain);
      form.setValue('targetChain', newTargetChain);
    }
    
    // Reset token selection
    form.setValue('token', '');
  };
  
  // Handle target chain change
  const handleTargetChainChange = (value: ChainType) => {
    setTargetChain(value);
    form.setValue('targetChain', value);
    
    // Ensure source and target chains are different
    if (value === sourceChain) {
      const newSourceChain = value === 'ton' ? 'ethereum' : 'ton';
      setSourceChain(newSourceChain);
      form.setValue('sourceChain', newSourceChain);
    }
  };
  
  // Handle form submission
  const onSubmit = async (values: BridgeFormValues) => {
    if (!connectedWallet) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to continue",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const txHash = await tonBridgeService.bridgeAssets({
        sourceChain: values.sourceChain,
        targetChain: values.targetChain,
        amount: values.amount,
        tokenAddress: sourceTokens?.find(t => t.symbol === values.token)?.address,
        recipientAddress: values.recipientAddress,
        slippage: values.slippage,
      });
      
      toast({
        title: "Bridge transaction initiated",
        description: `Transaction hash: ${txHash}`,
      });
      
      setPendingTx(txHash);
      
      // Poll for transaction status
      const statusInterval = setInterval(async () => {
        try {
          const status = await tonBridgeService.getTransactionStatus(txHash);
          setTxStatus(status);
          
          if (status.status === 'completed' || status.status === 'failed') {
            clearInterval(statusInterval);
            
            toast({
              title: status.status === 'completed' ? "Bridge successful" : "Bridge failed",
              description: status.status === 'completed' 
                ? `Assets transferred to ${values.targetChain}`
                : "There was an issue with the bridge operation",
              variant: status.status === 'completed' ? "default" : "destructive",
            });
          }
        } catch (error) {
          console.error("Error checking transaction status:", error);
          clearInterval(statusInterval);
        }
      }, 5000);
      
    } catch (error) {
      console.error("Bridge error:", error);
      toast({
        title: "Bridge error",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };
  
  // Get a quote when amount and tokens are selected
  useEffect(() => {
    const getQuote = async () => {
      const amount = form.getValues('amount');
      const token = form.getValues('token');
      
      if (amount > 0 && token && sourceChain && targetChain) {
        try {
          const tokenObj = sourceTokens?.find(t => t.symbol === token);
          const quoteResult = await tonBridgeService.getQuote(
            sourceChain,
            targetChain,
            amount,
            tokenObj?.address
          );
          setQuote(quoteResult);
        } catch (error) {
          console.error("Error getting quote:", error);
        }
      }
    };
    
    getQuote();
  }, [form.watch('amount'), form.watch('token'), sourceChain, targetChain, sourceTokens]);
  
  // UI for transaction status
  const renderTransactionStatus = () => {
    if (!pendingTx || !txStatus) return null;
    
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Bridge Transaction Status</CardTitle>
          <CardDescription>
            Transaction Hash: {pendingTx}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold capitalize">{txStatus.status}</div>
            <Badge variant={
              txStatus.status === 'completed' ? "success" : 
              txStatus.status === 'failed' ? "destructive" : 
              "secondary"
            }>
              {txStatus.status}
            </Badge>
          </div>
          <Progress value={txStatus.progress * 100} className="h-2" />
          
          {txStatus.targetTxHash && (
            <div className="mt-4 p-3 bg-secondary/30 rounded-md">
              <div className="text-sm font-medium mb-1">Target Transaction:</div>
              <div className="text-sm font-mono break-all">{txStatus.targetTxHash}</div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };
  
  // Render the bridge page
  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text mb-2">
          Cross-Chain Bridge
        </h1>
        <p className="text-muted-foreground">
          Securely transfer assets between TON, Ethereum, and Solana blockchains
        </p>
      </div>
      
      {!connectedWallet ? (
        <Card className="border border-purple-800/20">
          <CardHeader>
            <CardTitle>Connect Wallet</CardTitle>
            <CardDescription>
              Connect your wallet to use the cross-chain bridge
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WalletConnect />
          </CardContent>
        </Card>
      ) : (
        <div>
          <Tabs defaultValue="bridge" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="bridge">Bridge Assets</TabsTrigger>
              <TabsTrigger value="history">Transaction History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="bridge">
              <Card className="border border-purple-800/20">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Bridge Assets</CardTitle>
                      <CardDescription>
                        Transfer assets across different blockchains
                      </CardDescription>
                    </div>
                    
                    {feeDiscount && feeDiscount.discountPercent > 0 && (
                      <Badge variant="outline" className="bg-gradient-to-r from-purple-600/10 to-pink-500/10 border-purple-600/30">
                        {feeDiscount.tier} - {feeDiscount.discountPercent}% Fee Discount
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="sourceChain"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Source Chain</FormLabel>
                              <Select
                                onValueChange={(value) => handleSourceChainChange(value as ChainType)}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select source chain" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="ton">TON</SelectItem>
                                  <SelectItem value="ethereum">Ethereum</SelectItem>
                                  <SelectItem value="solana">Solana</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="targetChain"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Target Chain</FormLabel>
                              <Select
                                onValueChange={(value) => handleTargetChainChange(value as ChainType)}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select target chain" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="ton">TON</SelectItem>
                                  <SelectItem value="ethereum">Ethereum</SelectItem>
                                  <SelectItem value="solana">Solana</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="flex justify-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const currentSource = form.getValues('sourceChain');
                            const currentTarget = form.getValues('targetChain');
                            
                            setSourceChain(currentTarget);
                            setTargetChain(currentSource);
                            
                            form.setValue('sourceChain', currentTarget);
                            form.setValue('targetChain', currentSource);
                            form.setValue('token', '');
                          }}
                        >
                          <ArrowRightLeft className="h-5 w-5" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="token"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Token</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select token" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {isLoadingSourceTokens ? (
                                    <div className="flex items-center justify-center p-2">
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    </div>
                                  ) : (
                                    sourceTokens?.map((token) => (
                                      <SelectItem key={token.symbol} value={token.symbol}>
                                        {token.symbol} - {token.name}
                                      </SelectItem>
                                    ))
                                  )}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Amount</FormLabel>
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
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="recipientAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Recipient Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter recipient address" {...field} />
                            </FormControl>
                            <FormDescription>
                              Address on the target chain to receive the bridged assets
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="slippage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Slippage Tolerance (%)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.1"
                                placeholder="1.0"
                                defaultValue={1.0}
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value);
                                  field.onChange(isNaN(value) ? 1.0 : value);
                                }}
                              />
                            </FormControl>
                            <FormDescription>
                              Maximum allowed slippage during the bridge operation
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {quote && (
                        <div className="p-4 border rounded-lg bg-card/50">
                          <h3 className="font-medium mb-2">Bridge Quote</h3>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="text-muted-foreground">You send:</div>
                            <div className="font-medium text-right">{quote.sourceAmount} {form.getValues('token')}</div>
                            
                            <div className="text-muted-foreground">You receive (estimated):</div>
                            <div className="font-medium text-right">{quote.targetAmount.toFixed(6)} {form.getValues('token')}</div>
                            
                            <div className="text-muted-foreground">Fee:</div>
                            <div className="font-medium text-right">
                              {feeDiscount && feeDiscount.discountPercent > 0 ? (
                                <span>
                                  <span className="line-through text-muted-foreground mr-1">{quote.fee.toFixed(6)}</span>
                                  {(quote.fee * (1 - feeDiscount.discountPercent / 100)).toFixed(6)} {form.getValues('token')}
                                </span>
                              ) : (
                                <span>{quote.fee.toFixed(6)} {form.getValues('token')}</span>
                              )}
                            </div>
                            
                            <div className="text-muted-foreground">Exchange rate:</div>
                            <div className="font-medium text-right">1 {form.getValues('token')} = {quote.exchangeRate.toFixed(6)} {form.getValues('token')}</div>
                            
                            <div className="text-muted-foreground">Estimated time:</div>
                            <div className="font-medium text-right">{quote.estimatedTime} minutes</div>
                          </div>
                        </div>
                      )}
                      
                      <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90">
                        Bridge Assets
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                
                <CardFooter className="flex flex-col border-t pt-6">
                  <Alert variant="default" className="bg-secondary/30 border-primary/20">
                    <Info className="h-4 w-4" />
                    <AlertTitle>About Cross-Chain Bridging</AlertTitle>
                    <AlertDescription>
                      Bridges allow you to transfer assets between different blockchains. The process typically takes 5-30 minutes depending on the chains involved.
                    </AlertDescription>
                  </Alert>
                  
                  {feeDiscount && feeDiscount.tier !== 'None' && (
                    <div className="mt-4 text-sm text-muted-foreground">
                      <span className="font-medium text-primary">CVT {feeDiscount.tier}:</span> You are receiving a {feeDiscount.discountPercent}% discount on bridge fees by staking {feeDiscount.stakedAmount.toLocaleString()} CVT tokens.
                    </div>
                  )}
                </CardFooter>
              </Card>
              
              {renderTransactionStatus()}
            </TabsContent>
            
            <TabsContent value="history">
              <Card className="border border-purple-800/20">
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>
                    Your recent cross-chain bridge transactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Info className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-1 text-lg font-medium">No transactions yet</h3>
                    <p className="text-sm">
                      Your cross-chain bridge transaction history will appear here
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
      
      <Separator className="my-8" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-purple-800/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Low Fees</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Benefit from TON's high performance and low gas fees when bridging assets
            </p>
          </CardContent>
        </Card>
        
        <Card className="border border-purple-800/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">CVT Staking Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Stake CVT tokens to receive up to 100% discount on all bridge fees
            </p>
          </CardContent>
        </Card>
        
        <Card className="border border-purple-800/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Multi-Chain Security</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Your assets are protected by our Triple-Chain Security Architecture
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}