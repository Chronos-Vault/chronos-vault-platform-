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
import { WalletConnector } from '@/components/wallet/WalletConnector';
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

// PageTitle component
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
  const { wallets, connect, disconnect } = useBlockchain();
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
  
  // Wallet dialog state for our integrated connector
  const [walletDialogOpen, setWalletDialogOpen] = useState(false);
  const [selectedChainForConnect, setSelectedChainForConnect] = useState<ChainType>('ton');
  
  // Handle wallet connection through our integrated connector
  const handleWalletConnected = (chain: ChainType, walletInfo: WalletInfo) => {
    // Update wallet info in the blockchain context
    connect(chain);
    toast({
      title: 'Wallet Connected',
      description: `Successfully connected to ${walletInfo.name}`,
    });
  };

  // Quote price (mock data for demo)
  const [priceQuote, setPriceQuote] = useState<{ amount: number, fee: number, estimatedTime: string } | null>(null);
  const [isQuoteLoading, setIsQuoteLoading] = useState(false);

  // Get quote data when amount changes
  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      setIsQuoteLoading(true);
      
      // Simulate API call delay
      setTimeout(() => {
        setPriceQuote({
          amount: parseFloat(amount) * 0.96, // 4% fee
          fee: parseFloat(amount) * 0.04,
          estimatedTime: '10-15'
        });
        setIsQuoteLoading(false);
      }, 800);
    } else {
      setPriceQuote(null);
    }
  }, [amount, sourceChain, targetChain, sourceAsset, targetAsset]);

  // Swap rates (mock data for demo)
  const [swapRates, setSwapRates] = useState<{ rate: number, networkFee: string } | null>(null);
  const [isSwapRatesLoading, setIsSwapRatesLoading] = useState(false);

  // Get swap rates when chains/assets change
  useEffect(() => {
    setIsSwapRatesLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const rates: Record<string, number> = {
        'ETH-TON': 200.5,
        'TON-ETH': 0.005,
        'SOL-TON': 48.3,
        'TON-SOL': 0.021,
        'BTC-TON': 3600.2,
        'TON-BTC': 0.00028
      };
      
      const key = `${sourceAsset}-${targetAsset}`;
      const fallbackKey = `${sourceChain}-${targetChain}`;
      
      setSwapRates({
        rate: rates[key] || rates[fallbackKey] || 1.0,
        networkFee: '0.001 ' + sourceAsset
      });
      setIsSwapRatesLoading(false);
    }, 800);
  }, [sourceChain, targetChain, sourceAsset, targetAsset]);

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

  // Transfer mutation
  const [transferPending, setTransferPending] = useState(false);
  
  const handleTransfer = () => {
    const wallet = wallets[sourceChain];
      
    if (!wallet || !wallet.isConnected) {
      toast({
        title: 'Transfer Failed',
        description: `Please connect your ${sourceChain} wallet first`,
        variant: 'destructive',
      });
      return;
    }
    
    setTransferPending(true);
    
    // Simulate transaction processing
    setTimeout(() => {
      setTransferPending(false);
      
      const txHash = "0x" + Math.random().toString(16).substring(2, 12) + "...";
      
      toast({
        title: 'Transfer Initiated',
        description: `Transaction hash: ${txHash}`,
        variant: 'default',
      });
      
      // Show success animation
      setShowSuccessAnimation(true);
      setTimeout(() => setShowSuccessAnimation(false), 3000);
      
      // Add to history
      setBridgeHistory(prev => [
        {
          txHash,
          sourceChain,
          targetChain,
          sourceAsset,
          targetAsset,
          amount,
          targetAmount: priceQuote?.amount.toFixed(6),
          status: 'processing',
          progress: 0.2,
          timestamp: new Date().toISOString()
        },
        ...prev
      ]);
      
      // Reset form
      resetForm();
      
      // Simulate progress updates
      setTimeout(() => {
        setBridgeHistory(prev => {
          const updated = [...prev];
          updated[0] = { ...updated[0], progress: 0.5 };
          return updated;
        });
      }, 4000);
      
      setTimeout(() => {
        setBridgeHistory(prev => {
          const updated = [...prev];
          updated[0] = { ...updated[0], progress: 1.0, status: 'completed' };
          return updated;
        });
        
        toast({
          title: 'Transfer Complete',
          description: `Your ${amount} ${sourceAsset} has been transferred to ${targetChain}`,
          variant: 'default',
        });
      }, 8000);
    }, 2000);
  };

  // Create atomic swap mutation
  const [createSwapPending, setCreateSwapPending] = useState(false);
  
  const handleCreateSwap = () => {
    const initiatorWallet = wallets[sourceChain];
    const responderWallet = wallets[targetChain];
    
    if (!initiatorWallet || !initiatorWallet.isConnected) {
      toast({
        title: 'Swap Creation Failed',
        description: `Please connect your ${sourceChain} wallet first`,
        variant: 'destructive',
      });
      return;
    }
    
    if (!responderWallet || !responderWallet.isConnected) {
      toast({
        title: 'Swap Creation Failed',
        description: `Please connect your ${targetChain} wallet first`,
        variant: 'destructive',
      });
      return;
    }
    
    setCreateSwapPending(true);
    
    // Simulate transaction processing
    setTimeout(() => {
      setCreateSwapPending(false);
      
      const swapId = Math.random().toString(16).substring(2, 10);
      
      toast({
        title: 'Atomic Swap Created',
        description: `Swap ID: ${swapId}`,
        variant: 'default',
      });
      
      // Reset form
      setSwapAmount('');
      setSwapReceiveAmount('');
      
      // Add to history
      setBridgeHistory(prev => [
        {
          txHash: swapId,
          sourceChain,
          targetChain,
          sourceAsset,
          targetAsset,
          amount: swapAmount,
          targetAmount: swapReceiveAmount,
          status: 'processing',
          progress: 0.3,
          timestamp: new Date().toISOString()
        },
        ...prev
      ]);
      
      // Simulate progress updates
      setTimeout(() => {
        setBridgeHistory(prev => {
          const updated = [...prev];
          updated[0] = { ...updated[0], progress: 0.7 };
          return updated;
        });
      }, 5000);
      
      setTimeout(() => {
        setBridgeHistory(prev => {
          const updated = [...prev];
          updated[0] = { ...updated[0], progress: 1.0, status: 'completed' };
          return updated;
        });
        
        toast({
          title: 'Swap Complete',
          description: `Your atomic swap has completed successfully`,
          variant: 'default',
        });
      }, 10000);
    }, 2000);
  };
  
  // Initialize WebSocket connection simulation
  useEffect(() => {
    setWsStatus('connecting');
    
    // Simulate connection being established
    setTimeout(() => {
      setWsStatus('connected');
    }, 1500);
    
    // Cleanup function
    return () => {
      // Cleanup would go here in a real implementation
    };
  }, []);

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
                  <Badge variant={wsStatus === 'connected' ? 'outline' : wsStatus === 'connecting' ? 'outline' : 'destructive'}>
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
                    <div>
                      <Label htmlFor="amount">Amount to Transfer</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                    
                    {/* Recipient Address */}
                    <div>
                      <Label htmlFor="recipientAddress">
                        Recipient Address <span className="text-xs text-muted-foreground">(Optional - defaults to your address)</span>
                      </Label>
                      <Input
                        id="recipientAddress"
                        placeholder={`${targetChain.toUpperCase()} address`}
                        value={recipientAddress}
                        onChange={(e) => setRecipientAddress(e.target.value)}
                      />
                    </div>
                    
                    {/* Fee & Quote */}
                    {amount && parseFloat(amount) > 0 && (
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Transfer Summary</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>You send:</span>
                            <span className="font-medium">{amount} {sourceAsset}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Recipient gets:</span>
                            {isQuoteLoading ? (
                              <Skeleton className="h-5 w-24" />
                            ) : (
                              <span className="font-medium">
                                {priceQuote?.amount.toFixed(6)} {targetAsset}
                              </span>
                            )}
                          </div>
                          <div className="flex justify-between">
                            <span>Bridge fee:</span>
                            {isQuoteLoading ? (
                              <Skeleton className="h-5 w-24" />
                            ) : (
                              <span className="font-medium">
                                {priceQuote?.fee.toFixed(6)} {sourceAsset}
                              </span>
                            )}
                          </div>
                          <div className="flex justify-between">
                            <span>Estimated completion:</span>
                            <span className="font-medium">~{priceQuote?.estimatedTime || "10-15"} mins</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Transfer Button */}
                    <Button 
                      className="w-full" 
                      onClick={handleTransfer}
                      disabled={transferPending || !wallets[sourceChain]?.isConnected}
                    >
                      {transferPending ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Transfer Assets'
                      )}
                    </Button>
                    
                    {/* Warning for unconnected wallet */}
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
                        <Label htmlFor="swapReceiveAmount">Estimated Amount</Label>
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
                            id="swapReceiveAmount"
                            type="number"
                            placeholder="0.0"
                            value={swapReceiveAmount}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Exchange Rate */}
                    {swapRates && (
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Swap Details</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Exchange rate:</span>
                            <span className="font-medium">
                              1 {sourceAsset} = {swapRates.rate.toFixed(6)} {targetAsset}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Network fee:</span>
                            <span className="font-medium">
                              ~{swapRates.networkFee}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Time lock:</span>
                            <span className="font-medium">2 hours</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Create Swap Button */}
                    <Button 
                      className="w-full" 
                      onClick={handleCreateSwap}
                      disabled={
                        createSwapPending || 
                        !swapAmount || 
                        !wallets[sourceChain]?.isConnected || 
                        !wallets[targetChain]?.isConnected
                      }
                    >
                      {createSwapPending ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Creating Swap...
                        </>
                      ) : (
                        'Create Atomic Swap'
                      )}
                    </Button>
                    
                    {/* Warning for unconnected wallets */}
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
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* Side content */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Transfers</CardTitle>
              <CardDescription>Your latest bridge transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bridgeHistory.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="mx-auto h-12 w-12 mb-3 opacity-20" />
                    <p>No transaction history yet</p>
                    <p className="text-sm">Transfers will appear here</p>
                  </div>
                ) : (
                  bridgeHistory.map((tx, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{tx.sourceChain} → {tx.targetChain}</span>
                        <Badge variant={
                          tx.status === 'completed' ? 'outline' : 
                          tx.status === 'failed' ? 'destructive' : 'outline'
                        }>
                          {tx.status === 'completed' ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : tx.status === 'failed' ? (
                            <XCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <Clock className="h-3 w-3 mr-1" />
                          )}
                          {tx.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>{tx.amount} {tx.sourceAsset}</span>
                        <span>→</span>
                        <span>{tx.targetAmount} {tx.targetAsset}</span>
                      </div>
                      <Progress value={getProgressPercentage(tx.progress)} className="h-1" />
                      <div className="text-xs text-muted-foreground">
                        {tx.txHash && `Tx: ${tx.txHash}`}
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