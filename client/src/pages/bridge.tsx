import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { crossChainBridgeService } from '@/services/CrossChainBridgeService';
import { useBlockchain, type ChainType } from '@/hooks/use-blockchain';
import { useWallet } from '@/contexts/wallet-context';
import { useMultiChain, BlockchainType } from '@/contexts/multi-chain-context';
import { useAtomicSwap, AtomicSwapProvider } from '@/contexts/atomic-swap-context';
import { useToast } from "@/hooks/use-toast";
import { WalletConnector } from '@/components/wallet/WalletConnector';
import CrossChainSwapConfig from '@/components/vault/CrossChainSwapConfig';
import MultiSignatureSwapConfig from '@/components/vault/MultiSignatureSwapConfig';
import HTLCVerificationPanel from '@/components/cross-chain/HTLCVerificationPanel';
import SecurityFeaturePanel from '@/components/cross-chain/SecurityFeaturePanel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { 
  AlertCircle, 
  ArrowLeftRight, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Loader2, 
  ArrowRight,
  ArrowLeft,
  Shield,
  Zap,
  Wallet
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";

// Assets configuration - ONLY what our deployed contracts support
const ASSETS = {
  ethereum: [
    { symbol: 'ETH', name: 'Arbitrum ETH (Native)', decimals: 18 },
    { symbol: 'CVT', name: 'Chronos Vault Token', decimals: 18 },
  ],
  solana: [
    { symbol: 'SOL', name: 'Solana (Native)', decimals: 9 },
    { symbol: 'CVT', name: 'Chronos Vault Token', decimals: 9 },
  ],
  ton: [
    { symbol: 'TON', name: 'Toncoin (Native)', decimals: 9 },
    { symbol: 'CVT', name: 'Chronos Vault Token', decimals: 9 },
  ],
  bitcoin: [
    { symbol: 'BTC', name: 'Bitcoin (Native)', decimals: 8 },
  ],
};

// Schema for atomic swap form validation
const swapFormSchema = z.object({
  crossChainSource: z.string().min(1, "Source chain is required"),
  crossChainDestination: z.string().min(1, "Destination chain is required"),
  crossChainSourceAmount: z.string().min(1, "Amount is required"),
  crossChainDestAmount: z.string().min(1, "Destination amount is required"),
  htlcTimeout: z.string().min(1, "Timeout is required"),
  additionalChains: z.array(z.string()).optional(),
  multiSignatureConfig: z.any().optional(),
});

type FormValues = z.infer<typeof swapFormSchema>;

const CrossChainBridgeHub = () => {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const wallet = useWallet();
  const blockchain = useBlockchain();
  const { walletInfo } = useMultiChain();
  const atomicSwap = useAtomicSwap();
  
  // State management
  const [activeMode, setActiveMode] = useState<'bridge' | 'swap'>('bridge');
  const [sourceChain, setSourceChain] = useState<ChainType>('ethereum');
  const [targetChain, setTargetChain] = useState<ChainType>('ton');
  const [sourceAsset, setSourceAsset] = useState('ETH');
  const [targetAsset, setTargetAsset] = useState('TON');
  const [amount, setAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [showWalletDialog, setShowWalletDialog] = useState(false);
  
  // Check if wallet is connected for source chain
  const isSourceWalletConnected = 
    wallet.connectedWallets[sourceChain] && 
    wallet.status[sourceChain] === 'connected';

  // Atomic swap form
  const form = useForm<FormValues>({
    resolver: zodResolver(swapFormSchema),
    defaultValues: {
      crossChainSource: BlockchainType.TON,
      crossChainDestination: BlockchainType.ETHEREUM,
      crossChainSourceAmount: "",
      crossChainDestAmount: "",
      htlcTimeout: "24",
      additionalChains: [],
      multiSignatureConfig: {
        requiredSignatures: 2,
        signers: [],
        timeoutPeriod: 48,
        timeoutUnit: "hours",
        enableSecurityDelay: false,
        securityDelayPeriod: 12,
        useAtomicMultiSig: false,
        useBackupRecovery: false,
        recoveryAddress: "",
        geolocationRestricted: false,
        allowedGeolocationHashes: [],
        securityLevel: "standard" as const,
      }
    },
  });

  // Fetch bridge status from backend API
  const { data: bridgeStatus, isLoading: isStatusLoading } = useQuery<{
    statistics: {
      totalVolume: string;
      activeSwaps: number;
      completedSwaps: number;
      averageTime: string;
      successRate: number;
    };
    liquidity: {
      ethereum: { available: number; locked: number; utilization: number };
      solana: { available: number; locked: number; utilization: number };
      ton: { available: number; locked: number; utilization: number };
    };
    recentSwaps: Array<{
      id: string;
      from: string;
      to: string;
      amount: string;
      status: string;
      timestamp: string;
    }>;
    activeOperations: Array<{
      id: string;
      type: string;
      chains: string[];
      status: string;
      progress: number;
    }>;
    lastUpdated: string;
  }>({
    queryKey: ['/api/bridge/status'],
    refetchInterval: 15000,
  });

  // Fetch circuit breaker status from V3 contracts
  const { data: circuitBreakerStatus } = useQuery({
    queryKey: ['/api/bridge/circuit-breaker/status'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/bridge/circuit-breaker/status');
        const data = await response.json();
        return data.success ? data.data : null;
      } catch (error) {
        console.error("Failed to fetch circuit breaker status:", error);
        return null;
      }
    },
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Fetch real-time DEX swap quote (Jupiter/Uniswap V3/DeDust)
  const { data: swapQuote, isLoading: isQuoteLoading } = useQuery({
    queryKey: ['/api/defi/swap/price', sourceChain, targetChain, sourceAsset, targetAsset, amount],
    queryFn: async () => {
      if (!amount || parseFloat(amount) <= 0) return null;
      
      try {
        const params = new URLSearchParams({
          fromToken: sourceAsset,
          toToken: targetAsset,
          amount: amount,
          fromNetwork: sourceChain,
          toNetwork: targetChain,
        });
        
        const response = await fetch(`/api/defi/swap/price?${params}`);
        const data = await response.json();
        return data.status === 'success' ? data.data : null;
      } catch (error) {
        console.error("Failed to fetch swap quote:", error);
        return null;
      }
    },
    enabled: !!amount && parseFloat(amount) > 0,
    refetchInterval: 15000, // Refresh every 15 seconds
  });

  // Bridge transfer mutation - REAL SMART CONTRACT INTEGRATION
  const bridgeMutation = useMutation({
    mutationFn: async () => {
      if (!amount || !recipientAddress) {
        throw new Error('Please fill in all required fields');
      }
      
      const userAddress = wallet.connectedWallets[sourceChain]?.address || 
        (sourceChain !== 'bitcoin' ? walletInfo?.[sourceChain]?.address : undefined);
      
      return await crossChainBridgeService.initiateBridge({
        sourceChain,
        targetChain,
        asset: sourceAsset,
        amount: parseFloat(amount),
        recipientAddress,
        userAddress,
        prioritizeSecurity: true, // Always use Trinity Protocol
      });
    },
    onSuccess: (data) => {
      toast({
        title: "✅ Real Bridge Transfer Initiated!",
        description: (
          <div className="space-y-1">
            <p>Transaction ID: {data.txId?.substring(0, 20)}...</p>
            <p className="text-xs text-green-400">Trinity Protocol: {data.trinityProtocol?.validProofCount}/{data.trinityProtocol?.requiredProofs} proofs</p>
            <p className="text-xs">Smart Contract: CrossChainBridgeV3</p>
          </div>
        ),
      });
      setAmount('');
      setRecipientAddress('');
    },
    onError: (error: Error) => {
      toast({
        title: "Transfer Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Atomic swap creation mutation - REAL HTLC IMPLEMENTATION
  const swapMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const sourceChainType = values.crossChainSource as ChainType;
      const userAddress = wallet.connectedWallets[sourceChainType]?.address || 
        (sourceChainType !== 'bitcoin' ? walletInfo?.[sourceChainType]?.address : undefined);
      
      // Call real HTLC atomic swap endpoint
      const response = await fetch('/api/bridge/swap/atomic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          initiatorChain: values.crossChainSource,
          responderChain: values.crossChainDestination,
          initiatorAsset: 'native',
          responderAsset: 'native',
          initiatorAmount: parseFloat(values.crossChainSourceAmount),
          responderAmount: parseFloat(values.crossChainDestAmount),
          initiatorAddress: userAddress || '0x0000000000000000000000000000000000000000',
          responderAddress: '0x0000000000000000000000000000000000000000',
          timelock: parseInt(values.htlcTimeout) * 3600 // Convert hours to seconds
        })
      });
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to create HTLC atomic swap');
      }
      
      return data.data;
    },
    onSuccess: (data) => {
      toast({
        title: "🔒 HTLC Atomic Swap Created!",
        description: (
          <div className="space-y-1">
            <p>Swap ID: {data.swapId?.substring(0, 20)}...</p>
            <p className="text-xs text-cyan-400">Hash Lock: {data.hashLock?.substring(0, 16)}...</p>
            <p className="text-xs">{data.htlcDetails?.security}</p>
            <p className="text-xs text-yellow-400">Timelock: {data.timelock}s</p>
          </div>
        ),
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Swap Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleBridgeTransfer = () => {
    if (!isSourceWalletConnected) {
      setShowWalletDialog(true);
      return;
    }
    bridgeMutation.mutate();
  };

  const handleAtomicSwapSubmit = form.handleSubmit((values) => {
    swapMutation.mutate(values);
  });

  const getChainBadgeColor = (chain: ChainType) => {
    switch (chain) {
      case 'ethereum': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'solana': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'ton': return 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20';
      case 'bitcoin': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getChainLabel = (chain: ChainType) => {
    switch (chain) {
      case 'ethereum': return 'ARB';
      case 'solana': return 'SOL';
      case 'ton': return 'TON';
      case 'bitcoin': return 'BTC';
      default: 
        const _exhaustiveCheck: never = chain;
        return String(_exhaustiveCheck).toUpperCase();
    }
  };

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setLocation('/')}
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-[#FF5AF7] to-[#6B00D7] bg-clip-text text-transparent">
              Cross-Chain Bridge Hub
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Seamless asset transfers across Arbitrum L2, Solana, TON, and Bitcoin
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!isSourceWalletConnected && (
            <Button
              onClick={() => setShowWalletDialog(true)}
              className="bg-gradient-to-r from-[#FF5AF7] to-[#6B00D7] hover:opacity-90"
              data-testid="button-connect-wallet"
            >
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet
            </Button>
          )}
          {isSourceWalletConnected && (
            <Badge className="bg-green-500/10 text-green-500 border-green-500/20 px-3 py-1">
              <CheckCircle className="h-3 w-3 mr-1" />
              {wallet.connectedWallets[sourceChain]?.address?.substring(0, 6)}...
            </Badge>
          )}
          <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
            <Shield className="h-3 w-3 mr-1" />
            Trinity Protocol
          </Badge>
        </div>
      </div>

      {/* Mode Selector */}
      <Tabs value={activeMode} onValueChange={(value) => setActiveMode(value as 'bridge' | 'swap')} className="space-y-6">
        <TabsList className="grid grid-cols-2 w-full max-w-md bg-[#1a1a1a] border border-[#333]">
          <TabsTrigger value="bridge" className="flex items-center gap-2" data-testid="tab-bridge">
            <ArrowLeftRight className="h-4 w-4" />
            Bridge Mode
          </TabsTrigger>
          <TabsTrigger value="swap" className="flex items-center gap-2" data-testid="tab-swap">
            <Zap className="h-4 w-4" />
            Atomic Swap
          </TabsTrigger>
        </TabsList>

        {/* Bridge Mode */}
        <TabsContent value="bridge" className="space-y-6" data-testid="content-bridge">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Bridge Interface */}
            <div className="lg:col-span-2">
              <Card className="border border-[#333] bg-[#121212]">
                <CardHeader>
                  <CardTitle>Transfer Assets</CardTitle>
                  <CardDescription>
                    Bridge assets between different blockchains with Trinity Protocol security
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Source Chain */}
                  <div className="space-y-2">
                    <Label>From Chain</Label>
                    <div className="flex gap-2">
                      <Select value={sourceChain} onValueChange={(value) => setSourceChain(value as ChainType)}>
                        <SelectTrigger className="bg-black border-[#333]" data-testid="select-source-chain">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ethereum">Arbitrum L2</SelectItem>
                          <SelectItem value="solana">Solana</SelectItem>
                          <SelectItem value="ton">TON</SelectItem>
                          <SelectItem value="bitcoin">Bitcoin</SelectItem>
                        </SelectContent>
                      </Select>
                      <Badge className={getChainBadgeColor(sourceChain)}>
                        {getChainLabel(sourceChain)}
                      </Badge>
                    </div>
                  </div>

                  {/* Source Asset */}
                  <div className="space-y-2">
                    <Label>Asset</Label>
                    <Select value={sourceAsset} onValueChange={setSourceAsset}>
                      <SelectTrigger className="bg-black border-[#333]" data-testid="select-source-asset">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ASSETS[sourceChain]?.map((asset) => (
                          <SelectItem key={asset.symbol} value={asset.symbol}>
                            {asset.symbol} - {asset.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Amount */}
                  <div className="space-y-2">
                    <Label>Amount</Label>
                    <Input
                      type="number"
                      placeholder="0.0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="bg-black border-[#333]"
                      data-testid="input-amount"
                    />
                    {/* Real-time DEX Quote Display */}
                    {swapQuote && amount && (
                      <div className="mt-2 p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-purple-400" />
                            <span className="text-sm text-gray-400">Real-time Quote:</span>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-white">
                              ≈ {parseFloat(swapQuote.price).toFixed(6)} {targetAsset}
                            </p>
                            <p className="text-xs text-gray-500">
                              Route: {swapQuote.route?.join(' → ') || 'Direct'} 
                              {swapQuote.priceImpact && ` • ${(swapQuote.priceImpact * 100).toFixed(2)}% impact`}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    {isQuoteLoading && amount && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Fetching best price from DEX...
                      </div>
                    )}
                  </div>

                  {/* Direction Indicator */}
                  <div className="flex justify-center">
                    <div className="bg-[#1a1a1a] p-3 rounded-full border border-[#333]">
                      <ArrowRight className="h-5 w-5 text-[#FF5AF7]" />
                    </div>
                  </div>

                  {/* Target Chain */}
                  <div className="space-y-2">
                    <Label>To Chain</Label>
                    <div className="flex gap-2">
                      <Select value={targetChain} onValueChange={(value) => setTargetChain(value as ChainType)}>
                        <SelectTrigger className="bg-black border-[#333]" data-testid="select-target-chain">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ethereum">Arbitrum L2</SelectItem>
                          <SelectItem value="solana">Solana</SelectItem>
                          <SelectItem value="ton">TON</SelectItem>
                          <SelectItem value="bitcoin">Bitcoin</SelectItem>
                        </SelectContent>
                      </Select>
                      <Badge className={getChainBadgeColor(targetChain)}>
                        {targetChain.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  {/* Recipient Address */}
                  <div className="space-y-2">
                    <Label>Recipient Address</Label>
                    <Input
                      placeholder={`Enter ${targetChain} address`}
                      value={recipientAddress}
                      onChange={(e) => setRecipientAddress(e.target.value)}
                      className="bg-black border-[#333] font-mono text-sm"
                      data-testid="input-recipient"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleBridgeTransfer}
                    disabled={bridgeMutation.isPending || !amount || !recipientAddress}
                    className="w-full bg-gradient-to-r from-[#FF5AF7] to-[#6B00D7] hover:opacity-90"
                    data-testid="button-initiate-bridge"
                  >
                    {bridgeMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ArrowLeftRight className="mr-2 h-4 w-4" />
                        Initiate Bridge Transfer
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Bridge Status */}
            <div className="space-y-4">
              <Card className="border border-[#333] bg-[#121212]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Bridge Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {bridgeStatus ? (
                    <>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Status:</span>
                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Online
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Estimated Time:</span>
                        <span>~5-10 min</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Security:</span>
                        <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                          2-of-3 Verified
                        </Badge>
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-sm text-gray-400 py-4">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                      Checking bridge status...
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Trinity Protocol Card */}
              <Card className="border border-[#333] bg-[#121212]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    Trinity Protocol
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Smart Contract:</span>
                      <span className="font-mono text-blue-400">CrossChainBridgeV3</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Bridge V3 Address:</span>
                      <span className="font-mono text-gray-300">0x3960...d54</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">CVT Bridge V3:</span>
                      <span className="font-mono text-gray-300">0x00d0...5d0</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Emergency MultiSig:</span>
                      <span className="font-mono text-gray-300">0xFafC...924</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Consensus:</span>
                      <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                        2-of-3 Mathematical
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Chain Proofs:</span>
                      <div className="flex gap-1">
                        <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-xs px-1">ARB</Badge>
                        <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20 text-xs px-1">SOL</Badge>
                        <Badge className="bg-cyan-500/10 text-cyan-500 border-cyan-500/20 text-xs px-1">TON</Badge>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-[#333]">
                      <p className="text-xs text-gray-400">
                        🔒 <span className="text-green-400">TRUSTLESS</span> - No human validators
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        ✓ Circuit breaker protection
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        ✓ Emergency multi-sig control
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Circuit Breaker Status Card - LIVE DATA */}
              <Card className="border border-[#333] bg-[#121212]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-4 w-4 text-yellow-500" />
                    Circuit Breaker Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {circuitBreakerStatus ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Status:</span>
                        <Badge className={circuitBreakerStatus.crossChainBridge.active || circuitBreakerStatus.crossChainBridge.emergencyPause ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-green-500/10 text-green-500 border-green-500/20"}>
                          {circuitBreakerStatus.crossChainBridge.active || circuitBreakerStatus.crossChainBridge.emergencyPause ? (
                            <><XCircle className="h-3 w-3 mr-1" />Paused</>
                          ) : (
                            <><CheckCircle className="h-3 w-3 mr-1" />Active</>
                          )}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Emergency Pause:</span>
                        <Badge className={circuitBreakerStatus.crossChainBridge.emergencyPause ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-gray-500/10 text-gray-400 border-gray-500/20"}>
                          {circuitBreakerStatus.crossChainBridge.emergencyPause ? 'ACTIVE' : 'Not Active'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Volume Threshold:</span>
                        <span className="text-green-400">{circuitBreakerStatus.crossChainBridge.volumeThreshold}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Failure Rate Limit:</span>
                        <span className="text-green-400">{circuitBreakerStatus.crossChainBridge.failureRateLimit}</span>
                      </div>
                      <div className="pt-2 border-t border-[#333]">
                        <p className="text-xs text-gray-400">
                          🛡️ Auto-pause on anomalies
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          ⏰ Auto-recovery: {circuitBreakerStatus.crossChainBridge.autoRecoveryDelay}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-sm text-gray-400 py-4">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                      Loading circuit breaker status...
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Emergency Controller Card - LIVE DATA */}
              <Card className="border border-[#333] bg-[#121212]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    Emergency Multi-Sig
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {circuitBreakerStatus?.emergencyController ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Controller:</span>
                        <span className="font-mono text-gray-300">{circuitBreakerStatus.emergencyController.address.substring(0, 6)}...{circuitBreakerStatus.emergencyController.address.slice(-4)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Required Sigs:</span>
                        <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20">
                          {circuitBreakerStatus.emergencyController.requiredSignatures}-of-{circuitBreakerStatus.emergencyController.owners.length || 3}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Time-Lock:</span>
                        <span className="text-yellow-400">{circuitBreakerStatus.emergencyController.timelock}</span>
                      </div>
                      <div className="pt-2 border-t border-[#333]">
                        <p className="text-xs text-gray-400">
                          🔒 IMMUTABLE controller
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          ✓ Manual emergency pause/resume
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-sm text-gray-400 py-4">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                      Loading emergency controller...
                    </div>
                  )}
                </CardContent>
              </Card>

              <SecurityFeaturePanel />
            </div>
          </div>
        </TabsContent>

        {/* Atomic Swap Mode */}
        <TabsContent value="swap" className="space-y-6" data-testid="content-swap">
          <Form {...form}>
            <form onSubmit={handleAtomicSwapSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Swap Interface */}
                <div className="lg:col-span-2 space-y-6">
                  <CrossChainSwapConfig form={form} />
                  <MultiSignatureSwapConfig form={form} />
                  
                  <Button
                    type="submit"
                    disabled={swapMutation.isPending}
                    className="w-full bg-gradient-to-r from-[#FF5AF7] to-[#6B00D7] hover:opacity-90"
                    data-testid="button-create-swap"
                  >
                    {swapMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Swap...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-4 w-4" />
                        Create Atomic Swap
                      </>
                    )}
                  </Button>
                </div>

                {/* HTLC Verification */}
                <div>
                  <HTLCVerificationPanel 
                    sourceChain={form.watch('crossChainSource') as BlockchainType || BlockchainType.ETHEREUM}
                    destinationChain={form.watch('crossChainDestination') as BlockchainType || BlockchainType.TON}
                    swapStatus={swapMutation.data?.status || 'pending'}
                  />
                </div>
              </div>
            </form>
          </Form>
        </TabsContent>
      </Tabs>

      {/* Wallet Connection Dialog */}
      <Dialog open={showWalletDialog} onOpenChange={setShowWalletDialog}>
        <DialogContent className="bg-[#121212] border border-[#333]">
          <DialogHeader>
            <DialogTitle>Connect Wallet</DialogTitle>
            <DialogDescription>
              Connect your {sourceChain} wallet to continue with the bridge transfer
            </DialogDescription>
          </DialogHeader>
          <WalletConnector 
            chain={sourceChain} 
            onWalletConnected={(connectedWallet) => {
              // Wallet is connected and persisted in localStorage
              // Close dialog and refresh page to update wallet state
              setShowWalletDialog(false);
              // Reload to pick up wallet connection
              window.location.reload();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Wrap with AtomicSwapProvider
const BridgePageWithProvider = () => {
  return (
    <AtomicSwapProvider>
      <CrossChainBridgeHub />
    </AtomicSwapProvider>
  );
};

export default BridgePageWithProvider;
