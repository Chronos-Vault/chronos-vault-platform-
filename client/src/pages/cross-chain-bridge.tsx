/**
 * Cross-Chain Bridge Page
 * 
 * This page provides the interface for cross-chain transfers and atomic swaps.
 * Direct implementation with no redirects.
 */

import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { crossChainBridgeService, BridgeTransactionStatus } from '@/services/CrossChainBridgeService';
import { useBlockchain, type ChainType } from '@/hooks/use-blockchain';
import { useWallet } from '@/contexts/wallet-context';
import { useToast } from "@/hooks/use-toast";
import WalletConnect from '@/components/wallet/WalletConnect';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertCircle, ChevronRight, ArrowLeftRight, RefreshCw, CheckCircle, XCircle, Clock, Loader2, ClockIcon, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { useUserTheme } from '@/hooks/use-user-theme';

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
  const { theme } = useUserTheme();
  const wallet = useWallet();
  const blockchain = useBlockchain();
  
  // State for the bridge interface
  const [activeTab, setActiveTab] = useState<'transfer' | 'swap'>('transfer');
  const [sourceChain, setSourceChain] = useState<ChainType>('ethereum');
  const [targetChain, setTargetChain] = useState<ChainType>('ton');
  const [sourceAsset, setSourceAsset] = useState('ETH');
  const [targetAsset, setTargetAsset] = useState('TON');
  const [amount, setAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [showWalletDialog, setShowWalletDialog] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  
  // Check if wallet is connected for source chain
  const isSourceWalletConnected = 
    wallet.connectedWallets[sourceChain] && 
    wallet.status[sourceChain] === 'connected';

  // Get source wallet address if connected
  const sourceWalletAddress = isSourceWalletConnected && wallet.connectedWallets[sourceChain]
    ? wallet.connectedWallets[sourceChain].address
    : '';

  // Form reset function
  const resetForm = () => {
    setAmount('');
    setRecipientAddress('');
  };

  // Fetch bridge status
  const { data: bridgeStatus, isLoading: isStatusLoading } = useQuery({
    queryKey: ['/api/bridge/status', sourceChain, targetChain],
    queryFn: async () => {
      try {
        return await crossChainBridgeService.getBridgeStatus(sourceChain, targetChain);
      } catch (error) {
        console.error("Failed to fetch bridge status:", error);
        return null;
      }
    },
    refetchInterval: 15000, // Refresh every 15 seconds
  });
  
  // Fetch transactions for history
  const { data: transactions, isLoading: isTransactionsLoading } = useQuery({
    queryKey: ['/api/bridge/transactions'],
    queryFn: async () => {
      try {
        return await crossChainBridgeService.getTransactions();
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
        return [];
      }
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

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
    setRecipientAddress('');
  };

  // Transfer funds mutation
  const transferMutation = useMutation({
    mutationFn: async () => {
      // Validate wallet connection
      if (!isSourceWalletConnected) {
        throw new Error(`Please connect your ${sourceChain} wallet first`);
      }
      
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        throw new Error('Please enter a valid amount');
      }
      
      // Use the recipientAddress if provided, otherwise use the source wallet address
      const recipient = recipientAddress.trim() || sourceWalletAddress;
      if (!recipient) {
        throw new Error('Please provide a recipient address');
      }
      
      // Call the API to transfer the asset
      return await crossChainBridgeService.transferAsset({
        sourceChain,
        targetChain,
        amount: parsedAmount,
        assetType: sourceAsset,
        senderAddress: sourceWalletAddress,
        recipientAddress: recipient,
      });
    },
    onSuccess: (txId) => {
      toast({
        title: 'Transfer Initiated',
        description: `Transaction ID: ${txId.slice(0, 10)}...`,
      });
      
      // Show success animation
      setShowSuccessAnimation(true);
      setTimeout(() => setShowSuccessAnimation(false), 3000);
      
      // Reset form
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: 'Transfer Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Initialize the bridge between chains
  const initializeBridgeMutation = useMutation({
    mutationFn: async () => {
      return await crossChainBridgeService.initializeBridge(sourceChain, targetChain);
    },
    onSuccess: () => {
      toast({
        title: 'Bridge Initialized',
        description: `Connection established between ${sourceChain} and ${targetChain}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Bridge Initialization Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Connect wallet handler
  const handleConnectWallet = () => {
    blockchain.connect(sourceChain);
  };

  // Initialize the bridge when chains change
  useEffect(() => {
    if (isSourceWalletConnected) {
      initializeBridgeMutation.mutate();
    }
  }, [sourceChain, targetChain, isSourceWalletConnected]);

  return (
    <div className="container py-8 max-w-5xl">
      <div className="mb-8">
        <div className="relative">
          <PageTitle 
            title="Cross-Chain"
            gradientText="Bridge"
            subtitle="Transfer assets securely between Ethereum, Solana, TON, and Bitcoin networks"
          />
          <div className="absolute -top-10 -right-10 -z-10 h-40 w-40 bg-gradient-to-br from-purple-600/30 to-pink-500/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 -z-10 h-40 w-40 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-full blur-3xl"></div>
        </div>
        <div className="mt-6 p-4 border border-border bg-card rounded-lg shadow-sm">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
              <span>Triple-Chain Security</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-blue-500"></div>
              <span>Zero-Knowledge Transfers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-purple-500"></div>
              <span>Quantum-Resistant Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-pink-500"></div>
              <span>Cross-Chain Verification</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="relative overflow-hidden border-purple-500/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-b from-purple-600/10 to-pink-500/10 rounded-bl-full"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-t from-blue-600/10 to-purple-600/10 rounded-tr-full"></div>
            
            <CardHeader className="pb-3 relative z-10">
              <div className="flex items-center gap-2">
                <div className="h-6 w-1 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                <CardTitle className="text-xl font-bold">Transfer Assets</CardTitle>
              </div>
              <CardDescription className="mt-1">
                Move your assets securely between blockchain networks with Triple-Chain verification
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'transfer' | 'swap')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="transfer">Transfer</TabsTrigger>
                  <TabsTrigger value="swap">Atomic Swap</TabsTrigger>
                </TabsList>
                
                <TabsContent value="transfer" className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Source Chain</Label>
                      <Select 
                        value={sourceChain} 
                        onValueChange={(value) => setSourceChain(value as ChainType)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ethereum">Ethereum</SelectItem>
                          <SelectItem value="solana">Solana</SelectItem>
                          <SelectItem value="ton">TON</SelectItem>
                          <SelectItem value="bitcoin">Bitcoin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="relative">
                      <Label>Target Chain</Label>
                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <Select 
                            value={targetChain} 
                            onValueChange={(value) => setTargetChain(value as ChainType)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ethereum">Ethereum</SelectItem>
                              <SelectItem value="solana">Solana</SelectItem>
                              <SelectItem value="ton">TON</SelectItem>
                              <SelectItem value="bitcoin">Bitcoin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="mb-[2px]"
                          onClick={handleSwapChains}
                        >
                          <ArrowLeftRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <Label>Asset</Label>
                      <Select 
                        value={sourceAsset} 
                        onValueChange={setSourceAsset}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ASSETS[sourceChain].map((asset) => (
                            <SelectItem key={asset.symbol} value={asset.symbol}>
                              {asset.name} ({asset.symbol})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Target Asset</Label>
                      <Select 
                        value={targetAsset} 
                        onValueChange={setTargetAsset}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ASSETS[targetChain].map((asset) => (
                            <SelectItem key={asset.symbol} value={asset.symbol}>
                              {asset.name} ({asset.symbol})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Amount</Label>
                      <Input 
                        type="number" 
                        value={amount} 
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                    
                    <div>
                      <Label>Recipient Address (Optional)</Label>
                      <Input
                        value={recipientAddress}
                        onChange={(e) => setRecipientAddress(e.target.value)}
                        placeholder="Leave empty to send to your wallet"
                      />
                    </div>
                  </div>
                  
                  <div className="py-2">
                    {isSourceWalletConnected ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Connected to {sourceChain.charAt(0).toUpperCase() + sourceChain.slice(1)}</span>
                        <Badge variant="outline" className="text-xs">
                          {sourceWalletAddress.slice(0, 6)}...{sourceWalletAddress.slice(-4)}
                        </Badge>
                      </div>
                    ) : (
                      <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Wallet Required</AlertTitle>
                        <AlertDescription>
                          You need to connect a {sourceChain} wallet to transfer assets
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {isSourceWalletConnected ? (
                      <Button 
                        className="w-full" 
                        onClick={() => transferMutation.mutate()}
                        disabled={transferMutation.isPending}
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
                    ) : (
                      <Button 
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-500"
                        onClick={handleConnectWallet}
                      >
                        Connect Wallet
                      </Button>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="swap" className="space-y-4 pt-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Atomic Swaps Coming Soon</AlertTitle>
                    <AlertDescription>
                      The atomic swap feature will be available in the next update.
                    </AlertDescription>
                  </Alert>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="mb-4 overflow-hidden relative border-purple-500/20">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-gradient-radial from-purple-600/20 to-transparent rounded-full"></div>
            <div className="absolute -left-4 -bottom-4 w-16 h-16 bg-gradient-radial from-pink-500/20 to-transparent rounded-full"></div>
            
            <CardHeader className="pb-2 relative z-10">
              <div className="flex items-center gap-2">
                <div className="h-4 w-1 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                <CardTitle className="text-lg font-medium">Bridge Status</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              {isStatusLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-4/5" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-6 w-5/6" />
                </div>
              ) : bridgeStatus ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Status:</span>
                    <Badge 
                      className={
                        bridgeStatus.status === 'operational' 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700' 
                          : bridgeStatus.status === 'degraded' 
                            ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700' 
                            : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700'
                      }
                    >
                      {bridgeStatus.status.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Latency:</span>
                      <span className="text-sm font-medium">{bridgeStatus.latency.toFixed(0)}ms</span>
                    </div>
                    <Progress 
                      value={100 - Math.min(bridgeStatus.latency / 10, 100)}
                      className="h-1.5" 
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Success Rate:</span>
                      <span className="text-sm font-medium">{(bridgeStatus.successRate * 100).toFixed(1)}%</span>
                    </div>
                    <Progress 
                      value={bridgeStatus.successRate * 100}
                      className="h-1.5" 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Pending Transactions:</span>
                    <div className="flex items-center">
                      <span className="text-sm font-medium">{bridgeStatus.pendingTransactions}</span>
                      {bridgeStatus.pendingTransactions > 0 && (
                        <div className="ml-2 h-2 w-2 rounded-full bg-amber-500 animate-pulse"></div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="w-full group bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20"
                      onClick={() => initializeBridgeMutation.mutate()}
                      disabled={initializeBridgeMutation.isPending}
                    >
                      {initializeBridgeMutation.isPending ? (
                        <>
                          <RefreshCw className="mr-2 h-3 w-3 animate-spin text-purple-500" />
                          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">Initializing...</span>
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-2 h-3 w-3 text-purple-500 group-hover:rotate-180 transition-transform duration-700" />
                          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">Refresh Connection</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center p-4">
                  <div className="relative mx-auto w-16 h-16 mb-3">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 animate-pulse"></div>
                    <AlertCircle className="h-8 w-8 text-purple-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-sm text-muted-foreground">No bridge status available</p>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="w-full mt-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20"
                    onClick={() => initializeBridgeMutation.mutate()}
                    disabled={initializeBridgeMutation.isPending}
                  >
                    {initializeBridgeMutation.isPending ? (
                      <>
                        <RefreshCw className="mr-2 h-3 w-3 animate-spin text-purple-500" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">Initializing...</span>
                      </>
                    ) : (
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">Initialize Bridge</span>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="mb-4 overflow-hidden relative border-purple-500/20">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-gradient-radial from-purple-600/20 to-transparent rounded-full"></div>
            <div className="absolute -left-4 -bottom-4 w-16 h-16 bg-gradient-radial from-pink-500/20 to-transparent rounded-full"></div>
            
            <CardHeader className="pb-2 relative z-10">
              <div className="flex items-center gap-2">
                <div className="h-4 w-1 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                <CardTitle className="text-lg font-medium">Wallet Status</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <WalletConnect />
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden relative border-purple-500/20">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-gradient-radial from-purple-600/20 to-transparent rounded-full"></div>
            <div className="absolute -left-4 -bottom-4 w-16 h-16 bg-gradient-radial from-pink-500/20 to-transparent rounded-full"></div>
            
            <CardHeader className="pb-2 relative z-10">
              <div className="flex items-center gap-2">
                <div className="h-4 w-1 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                <CardTitle className="text-lg font-medium">Recent Transactions</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0 relative z-10">
              {isTransactionsLoading ? (
                <div className="p-6 space-y-3">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : transactions && transactions.length > 0 ? (
                <div className="divide-y divide-border/20">
                  {transactions.slice(0, 5).map((tx) => (
                    <div 
                      key={tx.id} 
                      className="p-4 bg-gradient-to-r from-transparent to-purple-950/5 hover:from-transparent hover:to-purple-950/10 transition-colors"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <div className="relative h-6 w-6 flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10"></div>
                            <ArrowRight className="h-3 w-3 text-purple-500" />
                          </div>
                          <div className="font-medium text-sm">
                            <span className="text-purple-400">{tx.sourceChain}</span>
                            <span className="mx-1">→</span>
                            <span className="text-pink-400">{tx.targetChain}</span>
                          </div>
                        </div>
                        <Badge 
                          className={
                            tx.status === BridgeTransactionStatus.COMPLETED 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700' 
                              : tx.status === BridgeTransactionStatus.FAILED 
                                ? 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700'
                                : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700'
                          }
                        >
                          {tx.status === BridgeTransactionStatus.PENDING && (
                            <Loader2 className="mr-1 h-2.5 w-2.5 animate-spin" />
                          )}
                          {tx.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <div className="font-medium">
                          <span className="text-primary">{tx.amount}</span>
                          <span className="ml-1 text-muted-foreground">{tx.assetType}</span>
                        </div>
                        <div className="text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(tx.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="relative mx-auto w-20 h-20 mb-4">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10"></div>
                    <ClockIcon className="h-10 w-10 text-purple-500/50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-sm text-muted-foreground">No transactions yet</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    Completed transfers will appear here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Success animation */}
      {showSuccessAnimation && (
        <div className="fixed inset-0 flex items-center justify-center bg-background/70 z-50">
          <div className="bg-card p-8 rounded-full shadow-lg">
            <CheckCircle className="h-16 w-16 text-green-500 animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
}