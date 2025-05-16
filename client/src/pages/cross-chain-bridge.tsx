/**
 * Cross-Chain Bridge Page
 * 
 * This page provides the interface for cross-chain transfers and atomic swaps.
 * Direct implementation with no redirects.
 */

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { crossChainBridgeService } from '@/services/CrossChainBridgeService';
import { useBlockchain, type ChainType } from '@/hooks/use-blockchain';
import { useToast } from "@/hooks/use-toast";
import WalletConnect, { WalletInfo } from '@/components/wallet/WalletConnect';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertCircle, ChevronRight, ArrowLeftRight, RefreshCw, CheckCircle, XCircle, Clock, Wallet } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { useUserTheme } from '@/hooks/use-user-theme';
import { websocketService } from '@/services/websocket-service';

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
  className?: string;
}) => (
  <div className={`mb-6 ${className}`}>
    <h1 className="text-3xl font-bold tracking-tight">
      {title} {' '}
      {gradientText && (
        <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          {gradientText}
        </span>
      )}
    </h1>
    {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
  </div>
);

// Assets configuration for each chain
const ASSETS = {
  ethereum: [
    { symbol: 'ETH', name: 'Ethereum', decimals: 18 },
    { symbol: 'USDT', name: 'Tether', decimals: 6 },
    { symbol: 'USDC', name: 'USD Coin', decimals: 6 },
    { symbol: 'DAI', name: 'Dai', decimals: 18 },
    { symbol: 'WBTC', name: 'Wrapped Bitcoin', decimals: 8 },
  ],
  solana: [
    { symbol: 'SOL', name: 'Solana', decimals: 9 },
    { symbol: 'USDC', name: 'USD Coin (Solana)', decimals: 6 },
    { symbol: 'RAY', name: 'Raydium', decimals: 6 },
    { symbol: 'SRM', name: 'Serum', decimals: 6 },
  ],
  ton: [
    { symbol: 'TON', name: 'Toncoin', decimals: 9 },
    { symbol: 'JETTON', name: 'Jetton', decimals: 9 },
    { symbol: 'CVT', name: 'Chronos Vault Token', decimals: 9 },
  ],
  bitcoin: [
    { symbol: 'BTC', name: 'Bitcoin', decimals: 8 },
    { symbol: 'WBTC', name: 'Wrapped Bitcoin', decimals: 8 },
  ],
};

export default function CrossChainBridgePage() {
  const { toast } = useToast();
  const blockchain = useBlockchain();
  const [activeTab, setActiveTab] = useState<'transfer' | 'swap'>('transfer');
  const [sourceChain, setSourceChain] = useState<ChainType>('ethereum');
  const [targetChain, setTargetChain] = useState<ChainType>('ton');
  const [sourceAsset, setSourceAsset] = useState('ETH');
  const [targetAsset, setTargetAsset] = useState('TON');
  const [amount, setAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [swapAmount, setSwapAmount] = useState('');
  const [swapReceiveAmount, setSwapReceiveAmount] = useState('');
  const [wsStatus, setWsStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const [bridgeHistory, setBridgeHistory] = useState<any[]>([]);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const { isDarkMode } = useUserTheme();
  const [walletError, setWalletError] = useState<string | null>(null);
  
  // Wallet dialog state for our integrated connector
  const [walletDialogOpen, setWalletDialogOpen] = useState(false);
  const [selectedChainForConnect, setSelectedChainForConnect] = useState<ChainType>('ton');
  
  // Get access to connected wallets
  const wallets = blockchain.connectedWallet ? { [blockchain.activeChain as ChainType]: blockchain.connectedWallet } : {};

  // Handle wallet connection through our integrated connector
  const handleWalletConnected = (chain: ChainType, walletInfo: WalletInfo) => {
    setWalletError(null);
    
    try {
      // Update wallet info in the blockchain context
      blockchain.connect(chain);
      toast({
        title: 'Wallet Connected',
        description: `Successfully connected to ${walletInfo.name}`,
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setWalletError("Failed to connect wallet. Please try again.");
      toast({
        title: 'Connection Failed',
        description: 'There was a problem connecting to your wallet.',
        variant: 'destructive',
      });
    }
  };

  // Quote price for cryptocurrency
  const { data: priceQuote, isLoading: isQuoteLoading } = useQuery({
    queryKey: ['/api/bridge/quote', sourceChain, targetChain, sourceAsset, targetAsset, amount],
    queryFn: () => crossChainBridgeService.getQuote(sourceChain, targetChain, sourceAsset, targetAsset, amount),
    enabled: !!amount && parseFloat(amount) > 0,
  });

  // Fetch swap rates 
  const { data: swapRates, isLoading: isSwapRatesLoading } = useQuery({
    queryKey: ['/api/bridge/swap-rates', sourceChain, targetChain, sourceAsset, targetAsset],
    queryFn: () => crossChainBridgeService.getSwapRates(sourceChain, targetChain, sourceAsset, targetAsset),
  });

  // Calculate swap receive amount based on input
  useEffect(() => {
    if (swapRates && swapAmount) {
      const amount = parseFloat(swapAmount);
      if (!isNaN(amount) && amount > 0) {
        const receiveAmount = amount * swapRates.rate;
        setSwapReceiveAmount(receiveAmount.toFixed(6));
      } else {
        setSwapReceiveAmount('');
      }
    }
  }, [swapRates, swapAmount]);

  // Swap chains function
  const handleSwapChains = () => {
    const tempChain = sourceChain;
    const tempAsset = sourceAsset;
    
    setSourceChain(targetChain);
    setSourceAsset(targetAsset);
    setTargetChain(tempChain);
    setTargetAsset(tempAsset);
    
    // Clear input values
    setAmount('');
  };

  // Reset form after successful transaction
  const resetForm = () => {
    setAmount('');
    setRecipientAddress('');
  };

  // Transfer funds mutation
  const transferMutation = useMutation({
    mutationFn: async () => {
      // Check if the wallet is connected for the source chain
      if (!blockchain.isConnected) {
        throw new Error(`Please connect your ${sourceChain} wallet first`);
      }
      
      if (blockchain.activeChain !== sourceChain) {
        throw new Error(`Please switch to ${sourceChain} wallet to perform this transfer`);
      }
      
      const wallet = blockchain.connectedWallet;
      if (!wallet || !wallet.address) {
        throw new Error(`Unable to access ${sourceChain} wallet. Please reconnect.`);
      }
      
      // Validate amount
      if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        throw new Error('Please enter a valid transfer amount');
      }
      
      // Use transferAsset from the service for the actual transfer
      return await crossChainBridgeService.transferAsset({
        sourceChain,
        targetChain,
        amount: parseFloat(amount),
        assetType: sourceAsset,
        senderAddress: wallet.address,
        recipientAddress: recipientAddress || wallet.address,
      });
    },
    onSuccess: (txId) => {
      toast({
        title: 'Transfer Initiated',
        description: `Transaction ID: ${txId.slice(0, 10)}...`,
        variant: 'default',
      });
      
      // Show success animation
      setShowSuccessAnimation(true);
      setTimeout(() => setShowSuccessAnimation(false), 3000);
      
      // Add to bridge history
      setBridgeHistory(prev => [{
        id: txId,
        sourceChain,
        targetChain,
        sourceAsset,
        targetAsset,
        amount: parseFloat(amount),
        status: 'pending',
        timestamp: new Date().toISOString()
      }, ...prev]);
      
      // Reset form
      resetForm();
    },
    onError: (error: Error) => {
      console.error('Transfer error:', error);
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
      websocketService.subscribeToBridgeUpdates((data) => {
        if (data.type === 'BRIDGE_TX_STATUS') {
          toast({
            title: `Bridge Update: ${data.status}`,
            description: data.message,
          });
        }
      });
      
      // Subscribe to transaction updates
      websocketService.subscribeToTransactionUpdates((data) => {
        // Add transaction to history
        setBridgeHistory((prev) => [...prev, data]);
      });
      
      // Cleanup function
      return () => {
        websocketService.disconnect();
      };
    });
  }, [toast]);

  // Convert progress to percentage
  const getProgressPercentage = (value: number) => {
    return Math.min(Math.max(value * 100, 0), 100);
  };
  
  return (
    <div className="container py-6 max-w-7xl mx-auto">
      <PageTitle 
        title="Cross-Chain Bridge" 
        gradientText="& Atomic Swaps" 
        subtitle="Transfer assets and create swaps across multiple blockchains."
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Bridge Operations</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant={wsStatus === 'connected' ? 'success' : wsStatus === 'connecting' ? 'outline' : 'destructive'}>
                    {wsStatus === 'connected' ? 'Bridge Online' : wsStatus === 'connecting' ? 'Connecting...' : 'Bridge Offline'}
                  </Badge>
                </div>
              </div>
              <CardDescription>
                Securely move assets across different blockchain networks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="transfer" onValueChange={(val) => setActiveTab(val as 'transfer' | 'swap')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="transfer">Asset Transfer</TabsTrigger>
                  <TabsTrigger value="swap">Atomic Swap</TabsTrigger>
                </TabsList>
                
                <TabsContent value="transfer" className="space-y-4 pt-4">
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
                            onClick={() => {
                              setSelectedChainForConnect(sourceChain);
                              setWalletDialogOpen(true);
                            }}
                          >
                            Connect {sourceChain.toUpperCase()} Wallet
                          </Button>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="sourceAsset">Source Asset</Label>
                        <Select
                          value={sourceAsset}
                          onValueChange={setSourceAsset}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select source asset" />
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
                        
                        {!wallets[targetChain]?.isConnected && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2 w-full"
                            onClick={() => {
                              setSelectedChainForConnect(targetChain);
                              setWalletDialogOpen(true);
                            }}
                          >
                            Connect {targetChain.toUpperCase()} Wallet
                          </Button>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="targetAsset">Target Asset</Label>
                        <Select
                          value={targetAsset}
                          onValueChange={setTargetAsset}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select target asset" />
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
                    
                    {/* Amount */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between">
                          <Label htmlFor="amount">Amount</Label>
                          {wallets[sourceChain]?.isConnected && (
                            <span className="text-xs text-muted-foreground">
                              Balance: {wallets[sourceChain]?.balance || "0.0"}
                            </span>
                          )}
                        </div>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="0.0"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="recipientAddress">Recipient Address (Optional)</Label>
                        <Input
                          id="recipientAddress"
                          placeholder="Enter recipient address"
                          value={recipientAddress}
                          onChange={(e) => setRecipientAddress(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Leave empty to send to your wallet on the target chain
                        </p>
                      </div>
                    </div>
                    
                    {/* Fee and rate information */}
                    {amount && parseFloat(amount) > 0 && (
                      <div className="rounded-md border p-3 space-y-2">
                        <div className="text-sm font-medium">Transaction Details</div>
                        
                        {isQuoteLoading ? (
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-4 w-2/3" />
                          </div>
                        ) : priceQuote ? (
                          <div className="grid grid-cols-2 gap-1 text-sm">
                            <div className="text-muted-foreground">You Send:</div>
                            <div>{amount} {sourceAsset}</div>
                            
                            <div className="text-muted-foreground">You Receive:</div>
                            <div>{priceQuote.receiveAmount} {targetAsset}</div>
                            
                            <div className="text-muted-foreground">Exchange Rate:</div>
                            <div>1 {sourceAsset} = {priceQuote.rate} {targetAsset}</div>
                            
                            <div className="text-muted-foreground">Bridge Fee:</div>
                            <div>{priceQuote.fee} {sourceAsset} ({Math.round(priceQuote.feePercentage * 100) / 100}%)</div>
                            
                            <div className="text-muted-foreground">Estimated Time:</div>
                            <div>{priceQuote.estimatedTime}</div>
                          </div>
                        ) : (
                          <Alert variant="destructive" className="py-2">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle className="text-xs">Unable to fetch quote</AlertTitle>
                            <AlertDescription className="text-xs">
                              Please try again or select different assets
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    )}
                    
                    {/* Transfer Button */}
                    <Button 
                      className="w-full"
                      disabled={!amount || parseFloat(amount) <= 0 || transferMutation.isPending || !wallets[sourceChain]?.isConnected}
                      onClick={() => transferMutation.mutate()}
                    >
                      {transferMutation.isPending ? (
                        <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Processing Transfer</>
                      ) : showSuccessAnimation ? (
                        <><CheckCircle className="mr-2 h-4 w-4" /> Transfer Initiated</>
                      ) : (
                        <>Transfer {amount ? `${amount} ${sourceAsset} to ${targetChain.toUpperCase()}` : 'Assets'}</>
                      )}
                    </Button>
                    
                    {/* Info message about wallet connection */}
                    {!wallets[sourceChain]?.isConnected && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Wallet Required</AlertTitle>
                        <AlertDescription>
                          Connect your {sourceChain.toUpperCase()} wallet to use the bridge
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="swap" className="space-y-4 pt-4">
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
                            onClick={() => {
                              setSelectedChainForConnect(sourceChain);
                              setWalletDialogOpen(true);
                            }}
                          >
                            Connect {sourceChain.toUpperCase()} Wallet
                          </Button>
                        )}
                      </div>
                      
                      <div>
                        <div className="flex justify-between">
                          <Label htmlFor="swapAmount">Amount</Label>
                          {wallets[sourceChain]?.isConnected && (
                            <span className="text-xs text-muted-foreground">
                              Balance: {wallets[sourceChain]?.balance || "0.0"}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Select
                            value={sourceAsset}
                            onValueChange={setSourceAsset}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Asset" />
                            </SelectTrigger>
                            <SelectContent>
                              {ASSETS[sourceChain].map((asset) => (
                                <SelectItem key={asset.symbol} value={asset.symbol}>
                                  {asset.symbol}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
                            onClick={() => {
                              setSelectedChainForConnect(targetChain);
                              setWalletDialogOpen(true);
                            }}
                          >
                            Connect {targetChain.toUpperCase()} Wallet
                          </Button>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="receiveAmount">Receive Amount</Label>
                        <div className="flex items-center space-x-2">
                          <Select
                            value={targetAsset}
                            onValueChange={setTargetAsset}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Asset" />
                            </SelectTrigger>
                            <SelectContent>
                              {ASSETS[targetChain].map((asset) => (
                                <SelectItem key={asset.symbol} value={asset.symbol}>
                                  {asset.symbol}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            id="receiveAmount"
                            type="number"
                            placeholder="0.0"
                            value={swapReceiveAmount}
                            readOnly
                            className="bg-muted/50"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Swap Rates */}
                    {swapAmount && parseFloat(swapAmount) > 0 && (
                      <div className="rounded-md border p-3 space-y-2">
                        <div className="text-sm font-medium">Swap Details</div>
                        
                        {isSwapRatesLoading ? (
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                          </div>
                        ) : swapRates ? (
                          <div className="grid grid-cols-2 gap-1 text-sm">
                            <div className="text-muted-foreground">Exchange Rate:</div>
                            <div>1 {sourceAsset} = {swapRates.rate} {targetAsset}</div>
                            
                            <div className="text-muted-foreground">Network Fee:</div>
                            <div>{swapRates.networkFee} {sourceAsset}</div>
                            
                            <div className="text-muted-foreground">Minimum Amount:</div>
                            <div>{swapRates.minimumAmount} {sourceAsset}</div>
                            
                            <div className="text-muted-foreground">Timelock:</div>
                            <div>2 hours</div>
                          </div>
                        ) : (
                          <Alert variant="destructive" className="py-2">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle className="text-xs">Unable to fetch swap rates</AlertTitle>
                            <AlertDescription className="text-xs">
                              Please try again or select different assets
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    )}
                    
                    {/* Create Swap Button */}
                    <Button 
                      className="w-full"
                      disabled={
                        !swapAmount || 
                        parseFloat(swapAmount) <= 0 || 
                        !swapReceiveAmount || 
                        createSwapMutation.isPending || 
                        !wallets[sourceChain]?.isConnected || 
                        !wallets[targetChain]?.isConnected
                      }
                      onClick={() => createSwapMutation.mutate()}
                    >
                      {createSwapMutation.isPending ? (
                        <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Creating Swap</>
                      ) : (
                        <>Create Atomic Swap</>
                      )}
                    </Button>
                    
                    {/* Info message about wallet connection */}
                    {(!wallets[sourceChain]?.isConnected || !wallets[targetChain]?.isConnected) && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Multiple Wallets Required</AlertTitle>
                        <AlertDescription>
                          Atomic swaps require connecting wallets for both chains.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Bridge Status</CardTitle>
              <CardDescription>Real-time updates and history</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="font-medium">ETH → TON</div>
                  <Badge variant="outline" className="bg-green-500/10">Operational</Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="font-medium">TON → ETH</div>
                  <Badge variant="outline" className="bg-green-500/10">Operational</Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="font-medium">SOL → TON</div>
                  <Badge variant="outline" className="bg-yellow-500/10">Degraded</Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="font-medium">BTC → TON</div>
                  <Badge variant="outline" className="bg-green-500/10">Operational</Badge>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Recent Transactions</h4>
                {bridgeHistory.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    No recent transactions
                  </div>
                ) : (
                  bridgeHistory.slice(0, 5).map((tx) => (
                    <div key={tx.id} className="rounded-md border p-2 space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">{tx.sourceChain} → {tx.targetChain}</span>
                        {tx.status === 'completed' ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : tx.status === 'failed' ? (
                          <XCircle className="h-4 w-4 text-red-500" />
                        ) : (
                          <Clock className="h-4 w-4 text-amber-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span>{tx.sourceAmount} {tx.sourceAsset}</span>
                        <span>→</span>
                        <span>{tx.targetAmount} {tx.targetAsset}</span>
                      </div>
                      <Progress value={getProgressPercentage(tx.progress)} className="h-1" />
                      <div className="text-xs text-muted-foreground">
                        {tx.txHash && `Tx: ${tx.txHash.slice(0, 8)}...${tx.txHash.slice(-8)}`}
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <div className="mt-6 space-y-2">
                <h4 className="font-medium mb-2">Resources</h4>
                <Link href="/bridge-faq">
                  <Button variant="outline" className="w-full justify-start">
                    <ChevronRight className="mr-2 h-4 w-4" />
                    Bridge FAQ
                  </Button>
                </Link>
                
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
      
      {/* Integrated Wallet Connection Dialog */}
      <WalletConnect
        isOpen={walletDialogOpen}
        onClose={() => setWalletDialogOpen(false)}
        initialChain={selectedChainForConnect}
        onWalletConnected={handleWalletConnected}
      />
    </div>
  );
}