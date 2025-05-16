/**
 * Cross-Chain Bridge Page
 * 
 * This page provides the interface for cross-chain transfers and atomic swaps.
 */

import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { crossChainBridgeService } from '@/services/CrossChainBridgeService';
import { useBlockchain, type ChainType } from '@/hooks/use-blockchain';
import { useToast } from "@/hooks/use-toast";
import WalletConnect, { WalletInfo } from '@/components/wallet/WalletConnect';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { AlertCircle, ChevronRight, ArrowLeftRight, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';

// PageTitle component as a simple local component
const PageTitle = ({ 
  title, 
  subtitle, 
  gradientText, 
  className = '' 
}: { 
  title: string; 
  subtitle?: string; 
  gradientText?: string; 
  className?: string 
}) => {
  // Process the title to replace the gradient text if specified
  const renderTitle = () => {
    if (!gradientText || !title.includes(gradientText)) {
      return <h1 className="text-4xl font-extrabold tracking-tight">{title}</h1>;
    }

    const parts = title.split(gradientText);
    
    return (
      <h1 className="text-4xl font-extrabold tracking-tight flex flex-wrap">
        {parts[0]}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-600 ml-2 mr-2">
          {gradientText}
        </span>
        {parts[1]}
      </h1>
    );
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {renderTitle()}
      {subtitle && (
        <p className="text-lg text-muted-foreground max-w-2xl">{subtitle}</p>
      )}
    </div>
  );
};

// Asset options for each chain
const ASSETS = {
  ethereum: [
    { symbol: 'ETH', name: 'Ethereum', decimals: 18 },
    { symbol: 'USDT', name: 'Tether', decimals: 6 },
    { symbol: 'USDC', name: 'USD Coin', decimals: 6 },
  ],
  solana: [
    { symbol: 'SOL', name: 'Solana', decimals: 9 },
    { symbol: 'USDT', name: 'Tether', decimals: 6 },
    { symbol: 'USDC', name: 'USD Coin', decimals: 6 },
  ],
  ton: [
    { symbol: 'TON', name: 'Toncoin', decimals: 9 },
    { symbol: 'USDT', name: 'Tether', decimals: 6 },
    { symbol: 'USDC', name: 'USD Coin', decimals: 6 },
  ],
  bitcoin: [
    { symbol: 'BTC', name: 'Bitcoin', decimals: 8 },
    { symbol: 'WBTC', name: 'Wrapped Bitcoin', decimals: 8 },
  ],
};

export default function CrossChainBridgePage() {
  const [walletDialogOpen, setWalletDialogOpen] = useState(false);
  const [selectedChainForConnect, setSelectedChainForConnect] = useState<ChainType>('ton');
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'transfer' | 'swap'>('transfer');
  const [sourceChain, setSourceChain] = useState<ChainType>('ethereum');
  const [targetChain, setTargetChain] = useState<ChainType>('ton');
  const [sourceAsset, setSourceAsset] = useState('ETH');
  const [targetAsset, setTargetAsset] = useState('TON');
  const [amount, setAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [swapAmount, setSwapAmount] = useState('');
  const [swapReceiveAmount, setSwapReceiveAmount] = useState('');
  const [wsStatus, setWsStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [bridgeStatuses, setBridgeStatuses] = useState<Record<string, any>>({});
  
  const { connected, wallets, connect, refreshBalances } = useBlockchain();
  
  // Query bridge statuses
  const { data: bridgeStatusesData, isLoading: isLoadingStatuses } = useQuery({
    queryKey: ['/api/bridge/status'],
    queryFn: async () => {
      const statuses = await crossChainBridgeService.getBridgeStatuses();
      return statuses;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
  
  // Query transactions
  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['/api/bridge/transactions'],
    queryFn: async () => {
      const txs = await crossChainBridgeService.getTransactions();
      return txs;
    },
    refetchInterval: 15000, // Refresh every 15 seconds
  });
  
  // Query atomic swaps
  const { data: atomicSwaps, isLoading: isLoadingSwaps } = useQuery({
    queryKey: ['/api/bridge/atomic-swaps'],
    queryFn: async () => {
      const swaps = await crossChainBridgeService.getAtomicSwaps();
      return swaps;
    },
    refetchInterval: 15000, // Refresh every 15 seconds
  });
  
  // Transfer asset mutation
  const transferMutation = useMutation({
    mutationFn: async () => {
      if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        throw new Error('Please enter a valid amount');
      }
      
      if (!recipientAddress) {
        throw new Error('Please enter a recipient address');
      }
      
      const sourceWallet = wallets[sourceChain];
      if (!sourceWallet || !sourceWallet.isConnected) {
        throw new Error(`Please connect your ${sourceChain} wallet first`);
      }
      
      return await crossChainBridgeService.transferAsset({
        sourceChain,
        targetChain,
        amount: parseFloat(amount),
        assetType: sourceAsset,
        senderAddress: sourceWallet.address,
        recipientAddress,
      });
    },
    onSuccess: (txId) => {
      toast({
        title: 'Transfer Initiated',
        description: `Transaction ID: ${txId}`,
        variant: 'default',
      });
      
      // Reset form
      setAmount('');
      setRecipientAddress('');
    },
    onError: (error: Error) => {
      toast({
        title: 'Transfer Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Create atomic swap mutation
  const createSwapMutation = useMutation({
    mutationFn: async () => {
      if (!swapAmount || isNaN(parseFloat(swapAmount)) || parseFloat(swapAmount) <= 0) {
        throw new Error('Please enter a valid amount to swap');
      }
      
      if (!swapReceiveAmount || isNaN(parseFloat(swapReceiveAmount)) || parseFloat(swapReceiveAmount) <= 0) {
        throw new Error('Please enter a valid amount to receive');
      }
      
      const initiatorWallet = wallets[sourceChain];
      const responderWallet = wallets[targetChain];
      
      if (!initiatorWallet || !initiatorWallet.isConnected) {
        throw new Error(`Please connect your ${sourceChain} wallet first`);
      }
      
      if (!responderWallet || !responderWallet.isConnected) {
        throw new Error(`Please connect your ${targetChain} wallet first`);
      }
      
      return await crossChainBridgeService.createAtomicSwap({
        initiatorChain: sourceChain,
        responderChain: targetChain,
        initiatorAsset: sourceAsset,
        responderAsset: targetAsset,
        initiatorAmount: parseFloat(swapAmount),
        responderAmount: parseFloat(swapReceiveAmount),
        initiatorAddress: initiatorWallet.address,
        responderAddress: responderWallet.address,
        timelock: 7200, // 2 hours
      });
    },
    onSuccess: (swapId) => {
      toast({
        title: 'Atomic Swap Created',
        description: `Swap ID: ${swapId}`,
        variant: 'default',
      });
      
      // Reset form
      setSwapAmount('');
      setSwapReceiveAmount('');
    },
    onError: (error: Error) => {
      toast({
        title: 'Swap Creation Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Initialize WebSocket connection for real-time bridge status updates using the WebSocketService
  useEffect(() => {
    // Import the WebSocketService
    import('@/services/websocket-service').then(({ websocketService }) => {
      // Set initial connection status
      setWsStatus('connecting');
      
      // Connect to the WebSocket server
      websocketService.connect()
        .then(() => {
          setWsStatus('connected');
        })
        .catch((error) => {
          console.error('Failed to connect to WebSocket server:', error);
          setWsStatus('disconnected');
        });
      
      // Subscribe to bridge status updates
      const subscriberId = 'cross-chain-bridge-page';
      websocketService.subscribe(
        subscriberId,
        ['BRIDGE_STATUS_UPDATE', 'CONNECTED', 'TRANSACTION_CONFIRMED', 'TRANSACTION_FAILED'],
        (message) => {
          if (message.type === 'BRIDGE_STATUS_UPDATE') {
            setBridgeStatuses(message.data.bridges);
          } else if (message.type === 'CONNECTED') {
            setWsStatus('connected');
          } else if (message.type === 'TRANSACTION_CONFIRMED' || message.type === 'TRANSACTION_FAILED') {
            // Refresh the transactions data
            toast({
              title: message.type === 'TRANSACTION_CONFIRMED' ? 'Transaction Confirmed' : 'Transaction Failed',
              description: `${message.data.chainId}: ${message.data.transactionId.substring(0, 8)}...`,
              variant: message.type === 'TRANSACTION_CONFIRMED' ? 'default' : 'destructive',
            });
          }
        }
      );
      
      // Clean up WebSocket subscription and connection on component unmount
      return () => {
        websocketService.unsubscribe(subscriberId);
      };
    });
  }, [toast]);
  
  // Update display data when API data is received
  useEffect(() => {
    if (bridgeStatusesData) {
      setBridgeStatuses(bridgeStatusesData);
    }
  }, [bridgeStatusesData]);
  
  // Handle chain and asset swapping
  const handleSwapChains = () => {
    const tempChain = sourceChain;
    const tempAsset = sourceAsset;
    
    setSourceChain(targetChain);
    setSourceAsset(targetAsset);
    
    setTargetChain(tempChain);
    setTargetAsset(tempAsset);
  };
  
  // Get bridge status for the selected chains
  const getBridgeStatus = () => {
    const key = `${sourceChain}-${targetChain}`;
    const reverseKey = `${targetChain}-${sourceChain}`;
    
    return bridgeStatuses[key] || bridgeStatuses[reverseKey] || null;
  };
  
  const currentBridgeStatus = getBridgeStatus();
  
  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <PageTitle
        title="Cross-Chain Bridge"
        subtitle="Securely transfer assets between different blockchains"
        gradientText="Bridge"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'transfer' | 'swap')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="transfer">Asset Transfer</TabsTrigger>
              <TabsTrigger value="swap">Atomic Swap</TabsTrigger>
            </TabsList>
            
            <TabsContent value="transfer">
              <Card>
                <CardHeader>
                  <CardTitle>Transfer Assets Across Chains</CardTitle>
                  <CardDescription>
                    Move your assets securely between different blockchain networks
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-6">
                    {/* Source Chain */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="sourceChain">Source Chain</Label>
                        <Select
                          value={sourceChain}
                          onValueChange={(value) => {
                            setSourceChain(value as ChainType);
                            // Update source asset to first asset of the selected chain
                            setSourceAsset(ASSETS[value as ChainType][0].symbol);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select source chain" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ethereum">Ethereum</SelectItem>
                            <SelectItem value="solana">Solana</SelectItem>
                            <SelectItem value="ton">TON</SelectItem>
                            <SelectItem value="bitcoin">Bitcoin</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        {!wallets[sourceChain]?.isConnected && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2 w-full"
                            onClick={() => connect(sourceChain)}
                          >
                            Connect {sourceChain.charAt(0).toUpperCase() + sourceChain.slice(1)} Wallet
                          </Button>
                        )}
                        
                        {wallets[sourceChain]?.isConnected && (
                          <div className="mt-2 text-sm text-muted-foreground">
                            <span className="font-medium">Connected:</span> {wallets[sourceChain]?.address.slice(0, 6)}...
                            {wallets[sourceChain]?.address.slice(-4)} ({wallets[sourceChain]?.balance.formatted} {wallets[sourceChain]?.balance.symbol})
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="sourceAsset">Source Asset</Label>
                        <Select
                          value={sourceAsset}
                          onValueChange={setSourceAsset}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select asset" />
                          </SelectTrigger>
                          <SelectContent>
                            {ASSETS[sourceChain].map((asset) => (
                              <SelectItem key={asset.symbol} value={asset.symbol}>
                                {asset.symbol} - {asset.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {/* Swap Button */}
                    <div className="flex justify-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleSwapChains}
                        className="rounded-full bg-muted/50 hover:bg-muted"
                      >
                        <ArrowLeftRight className="h-5 w-5" />
                        <span className="sr-only">Swap chains</span>
                      </Button>
                    </div>
                    
                    {/* Target Chain */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="targetChain">Target Chain</Label>
                        <Select
                          value={targetChain}
                          onValueChange={(value) => {
                            setTargetChain(value as ChainType);
                            // Update target asset to first asset of the selected chain
                            setTargetAsset(ASSETS[value as ChainType][0].symbol);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select target chain" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ethereum">Ethereum</SelectItem>
                            <SelectItem value="solana">Solana</SelectItem>
                            <SelectItem value="ton">TON</SelectItem>
                            <SelectItem value="bitcoin">Bitcoin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="targetAsset">Target Asset</Label>
                        <Select
                          value={targetAsset}
                          onValueChange={setTargetAsset}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select asset" />
                          </SelectTrigger>
                          <SelectContent>
                            {ASSETS[targetChain].map((asset) => (
                              <SelectItem key={asset.symbol} value={asset.symbol}>
                                {asset.symbol} - {asset.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {/* Amount and Recipient */}
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="0.0"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="recipientAddress">Recipient Address</Label>
                        <Input
                          id="recipientAddress"
                          placeholder="Enter recipient address"
                          value={recipientAddress}
                          onChange={(e) => setRecipientAddress(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    {/* Bridge Status */}
                    {currentBridgeStatus && (
                      <div className="rounded-md border p-3">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">Bridge Status</div>
                          <Badge
                            variant={
                              currentBridgeStatus.status === 'operational'
                                ? 'default'
                                : currentBridgeStatus.status === 'degraded'
                                ? 'outline' 
                                : 'destructive'
                            }
                          >
                            {currentBridgeStatus.status}
                          </Badge>
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center justify-between mt-1">
                            <span>Latency</span>
                            <span>{currentBridgeStatus.latency}ms</span>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <span>Pending Transactions</span>
                            <span>{currentBridgeStatus.pendingTransactions}</span>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <span>Success Rate</span>
                            <span>{currentBridgeStatus.successRate}%</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Submit Button */}
                    <Button 
                      className="w-full" 
                      onClick={() => transferMutation.mutate()}
                      disabled={transferMutation.isPending || !wallets[sourceChain]?.isConnected}
                    >
                      {transferMutation.isPending ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Transfer Assets'
                      )}
                    </Button>
                    
                    {/* Warning about wallet connection */}
                    {!wallets[sourceChain]?.isConnected && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Wallet not connected</AlertTitle>
                        <AlertDescription>
                          Please connect your {sourceChain} wallet to transfer assets.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="swap">
              <Card>
                <CardHeader>
                  <CardTitle>Atomic Swap</CardTitle>
                  <CardDescription>
                    Exchange assets between different blockchains with secure atomic swaps
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-6">
                    {/* Source Chain */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="sourceChainSwap">You Send</Label>
                        <Select
                          value={sourceChain}
                          onValueChange={(value) => {
                            setSourceChain(value as ChainType);
                            setSourceAsset(ASSETS[value as ChainType][0].symbol);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select chain" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ethereum">Ethereum</SelectItem>
                            <SelectItem value="solana">Solana</SelectItem>
                            <SelectItem value="ton">TON</SelectItem>
                            <SelectItem value="bitcoin">Bitcoin</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        {!wallets[sourceChain]?.isConnected && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2 w-full"
                            onClick={() => connect(sourceChain)}
                          >
                            Connect {sourceChain.charAt(0).toUpperCase() + sourceChain.slice(1)} Wallet
                          </Button>
                        )}
                        
                        {wallets[sourceChain]?.isConnected && (
                          <div className="mt-2 text-sm text-muted-foreground">
                            <span className="font-medium">Connected:</span> {wallets[sourceChain]?.address.slice(0, 6)}...
                            {wallets[sourceChain]?.address.slice(-4)} ({wallets[sourceChain]?.balance.formatted} {wallets[sourceChain]?.balance.symbol})
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="sourceAssetSwap">Asset</Label>
                          <Select
                            value={sourceAsset}
                            onValueChange={setSourceAsset}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select asset" />
                            </SelectTrigger>
                            <SelectContent>
                              {ASSETS[sourceChain].map((asset) => (
                                <SelectItem key={asset.symbol} value={asset.symbol}>
                                  {asset.symbol} - {asset.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="swapAmount">Amount</Label>
                          <Input
                            id="swapAmount"
                            type="number"
                            placeholder="0.0"
                            value={swapAmount}
                            onChange={(e) => setSwapAmount(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Swap Button */}
                    <div className="flex justify-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleSwapChains}
                        className="rounded-full bg-muted/50 hover:bg-muted"
                      >
                        <ArrowLeftRight className="h-5 w-5" />
                        <span className="sr-only">Swap chains</span>
                      </Button>
                    </div>
                    
                    {/* Target Chain */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="targetChainSwap">You Receive</Label>
                        <Select
                          value={targetChain}
                          onValueChange={(value) => {
                            setTargetChain(value as ChainType);
                            setTargetAsset(ASSETS[value as ChainType][0].symbol);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select chain" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ethereum">Ethereum</SelectItem>
                            <SelectItem value="solana">Solana</SelectItem>
                            <SelectItem value="ton">TON</SelectItem>
                            <SelectItem value="bitcoin">Bitcoin</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        {!wallets[targetChain]?.isConnected && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2 w-full"
                            onClick={() => connect(targetChain)}
                          >
                            Connect {targetChain.charAt(0).toUpperCase() + targetChain.slice(1)} Wallet
                          </Button>
                        )}
                        
                        {wallets[targetChain]?.isConnected && (
                          <div className="mt-2 text-sm text-muted-foreground">
                            <span className="font-medium">Connected:</span> {wallets[targetChain]?.address.slice(0, 6)}...
                            {wallets[targetChain]?.address.slice(-4)} ({wallets[targetChain]?.balance.formatted} {wallets[targetChain]?.balance.symbol})
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="targetAssetSwap">Asset</Label>
                          <Select
                            value={targetAsset}
                            onValueChange={setTargetAsset}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select asset" />
                            </SelectTrigger>
                            <SelectContent>
                              {ASSETS[targetChain].map((asset) => (
                                <SelectItem key={asset.symbol} value={asset.symbol}>
                                  {asset.symbol} - {asset.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="swapReceiveAmount">Amount</Label>
                          <Input
                            id="swapReceiveAmount"
                            type="number"
                            placeholder="0.0"
                            value={swapReceiveAmount}
                            onChange={(e) => setSwapReceiveAmount(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Bridge Status */}
                    {currentBridgeStatus && (
                      <div className="rounded-md border p-3">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">Bridge Status</div>
                          <Badge
                            variant={
                              currentBridgeStatus.status === 'operational'
                                ? 'default'
                                : currentBridgeStatus.status === 'degraded'
                                ? 'outline'
                                : 'destructive'
                            }
                          >
                            {currentBridgeStatus.status}
                          </Badge>
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center justify-between mt-1">
                            <span>Success Rate</span>
                            <span>{currentBridgeStatus.successRate}%</span>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <span>Expected Time</span>
                            <span>~10-20 minutes</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Submit Button */}
                    <Button 
                      className="w-full" 
                      onClick={() => createSwapMutation.mutate()}
                      disabled={
                        createSwapMutation.isPending || 
                        !wallets[sourceChain]?.isConnected || 
                        !wallets[targetChain]?.isConnected
                      }
                    >
                      {createSwapMutation.isPending ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Creating Swap...
                        </>
                      ) : (
                        'Create Atomic Swap'
                      )}
                    </Button>
                    
                    {/* Warning about wallet connections */}
                    {(!wallets[sourceChain]?.isConnected || !wallets[targetChain]?.isConnected) && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Wallet not connected</AlertTitle>
                        <AlertDescription>
                          Please connect both {sourceChain} and {targetChain} wallets to create an atomic swap.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Transactions */}
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  Your recent cross-chain transactions
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {isLoadingTransactions ? (
                  <div className="space-y-3">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : transactions && transactions.length > 0 ? (
                  <div className="space-y-4">
                    {transactions.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between border-b pb-3">
                        <div>
                          <div className="font-medium flex items-center">
                            {tx.sourceChain.toUpperCase()}
                            <ChevronRight className="h-4 w-4 mx-1" />
                            {tx.targetChain.toUpperCase()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {tx.amount} {tx.assetType} • {new Date(tx.timestamp).toLocaleString()}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Badge
                            variant={
                              tx.status === 'completed'
                                ? 'default'
                                : tx.status === 'pending' || tx.status === 'confirming'
                                ? 'outline'
                                : 'destructive'
                            }
                            className="ml-2"
                          >
                            {tx.status}
                          </Badge>
                          {tx.status === 'pending' && <Clock className="ml-2 h-4 w-4 text-muted-foreground" />}
                          {tx.status === 'confirming' && <RefreshCw className="ml-2 h-4 w-4 animate-spin text-muted-foreground" />}
                          {tx.status === 'completed' && <CheckCircle className="ml-2 h-4 w-4 text-green-500" />}
                          {tx.status === 'failed' && <XCircle className="ml-2 h-4 w-4 text-red-500" />}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    No transactions found
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div>
          {/* Bridge Status */}
          <Card>
            <CardHeader>
              <CardTitle>Bridge Network Status</CardTitle>
              <CardDescription>
                Current status of cross-chain bridges
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {isLoadingStatuses ? (
                <div className="space-y-3">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(bridgeStatuses).map(([bridge, status]: [string, any]) => (
                    <div key={bridge} className="border-b pb-2">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">
                          {bridge.split('-')[0].toUpperCase()} ↔ {bridge.split('-')[1].toUpperCase()}
                        </div>
                        <Badge
                          variant={
                            status.status === 'operational'
                              ? 'default'
                              : status.status === 'degraded'
                              ? 'outline'
                              : 'destructive'
                          }
                        >
                          {status.status}
                        </Badge>
                      </div>
                      <div className="mt-1">
                        <div className="text-xs text-muted-foreground">
                          Success Rate: {status.successRate}%
                        </div>
                        <Progress 
                          value={status.successRate} 
                          className="h-1 mt-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <div>WebSocket Status:</div>
                <Badge
                  variant={
                    wsStatus === 'connected'
                      ? 'default'
                      : wsStatus === 'connecting'
                      ? 'outline'
                      : 'destructive'
                  }
                  className="text-xs"
                >
                  {wsStatus}
                </Badge>
              </div>
            </CardContent>
          </Card>
          
          {/* Atomic Swaps */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Atomic Swaps</CardTitle>
              <CardDescription>
                Your active and recent atomic swaps
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {isLoadingSwaps ? (
                <div className="space-y-3">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : atomicSwaps && atomicSwaps.length > 0 ? (
                <div className="space-y-4">
                  {atomicSwaps.map((swap) => (
                    <div key={swap.id} className="border rounded-md p-3">
                      <div className="font-medium flex items-center">
                        {swap.initiatorAsset} 
                        <ChevronRight className="h-4 w-4 mx-1" />
                        {swap.responderAsset}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {swap.initiatorAmount} {swap.initiatorAsset} ↔ {swap.responderAmount} {swap.responderAsset}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-xs text-muted-foreground">
                          {new Date(swap.timestamp).toLocaleString()}
                        </div>
                        <Badge
                          variant={
                            swap.status === 'completed'
                              ? 'default'
                              : swap.status === 'expired' || swap.status === 'refunded'
                              ? 'destructive'
                              : 'outline'
                          }
                        >
                          {swap.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  No atomic swaps found
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Helpful actions for bridge operations
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={refreshBalances}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Balances
                </Button>
                
                <Link href="/cross-chain-atomic-swap">
                  <Button variant="outline" className="w-full justify-start">
                    <ChevronRight className="mr-2 h-4 w-4" />
                    Learn About Atomic Swaps
                  </Button>
                </Link>
                
                <Link href="/cross-chain-security">
                  <Button variant="outline" className="w-full justify-start">
                    <ChevronRight className="mr-2 h-4 w-4" />
                    Bridge Security
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}