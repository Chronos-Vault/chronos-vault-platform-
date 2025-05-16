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
import { AlertCircle, ChevronRight, ArrowLeftRight, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';
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
  const sourceWalletAddress = isSourceWalletConnected
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

  // Connect wallet handler
  const handleConnectWallet = () => {
    setShowWalletDialog(true);
  };

  return (
    <div className="container py-8 max-w-5xl">
      <PageTitle 
        title="Cross-Chain"
        gradientText="Bridge"
        subtitle="Transfer assets between Ethereum, Solana, TON, and Bitcoin networks"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Transfer Assets</CardTitle>
              <CardDescription>
                Move your assets securely between blockchain networks
              </CardDescription>
            </CardHeader>
            <CardContent>
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
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Wallet Status</CardTitle>
            </CardHeader>
            <CardContent>
              <WalletConnect />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isTransactionsLoading ? (
                <div className="p-6 space-y-3">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : transactions && transactions.length > 0 ? (
                <div className="divide-y divide-border">
                  {transactions.slice(0, 5).map((tx) => (
                    <div key={tx.id} className="p-4">
                      <div className="flex justify-between items-center mb-1">
                        <div className="font-medium text-sm">
                          {tx.sourceChain} → {tx.targetChain}
                        </div>
                        <Badge 
                          variant={
                            tx.status === BridgeTransactionStatus.COMPLETED ? 'default' :
                            tx.status === BridgeTransactionStatus.FAILED ? 'destructive' : 'outline'
                          }
                          className="text-xs"
                        >
                          {tx.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground flex justify-between">
                        <span>{tx.amount} {tx.assetType}</span>
                        <span>{new Date(tx.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-muted-foreground">
                  No recent transactions
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