import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useWallet, ChainType, isMobile, MOBILE_WALLET_DEEP_LINKS } from '@/contexts/wallet-context';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { SiEthereum, SiSolana } from 'react-icons/si';
import { 
  AlertCircle, 
  ArrowLeftRight, 
  CheckCircle, 
  Clock, 
  Loader2, 
  ArrowRight,
  ArrowLeft,
  Shield,
  Zap,
  Wallet,
  Lock,
  ExternalLink,
  Copy,
  RefreshCw,
  AlertTriangle,
  Timer,
  Eye,
  Link2,
  Unlink,
  PenTool
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type SwapScreen = 'configuration' | 'confirmation' | 'tracking';

type ChainId = 'arbitrum' | 'solana' | 'ton';

interface SwapConfig {
  sourceChain: ChainId;
  destinationChain: ChainId;
  sourceToken: string;
  destinationToken: string;
  amount: string;
  recipientAddress: string;
  timelockHours: number;
}

interface SwapDetails {
  swapId: string;
  operationId: string;
  hashLock: string;
  preimage?: string;
  timelock: number;
  timelockExpiry: Date;
  status: 'pending' | 'consensus_pending' | 'consensus_reached' | 'claimed' | 'refunded' | 'expired';
  consensusStatus: {
    arbitrum: 'pending' | 'signed' | 'failed';
    solana: 'pending' | 'signed' | 'failed';
    ton: 'pending' | 'signed' | 'failed';
    count: number;
    required: number;
  };
  sourceChain: ChainId;
  destinationChain: ChainId;
  sourceAmount: string;
  destinationAmount: string;
  sourceToken: string;
  destinationToken: string;
  recipientAddress: string;
  txHash?: string;
  createdAt: Date;
}

const CHAIN_CONFIG: Record<ChainId, { 
  name: string; 
  color: string; 
  icon: string; 
  role: string;
  explorer: string;
  tokens: { symbol: string; name: string }[];
}> = {
  arbitrum: {
    name: 'Arbitrum Sepolia',
    color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    icon: '🔷',
    role: 'PRIMARY',
    explorer: 'https://sepolia.arbiscan.io',
    tokens: [
      { symbol: 'ETH', name: 'Ethereum' },
      { symbol: 'CVT', name: 'Chronos Vault Token' },
    ],
  },
  solana: {
    name: 'Solana Devnet',
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    icon: '🟣',
    role: 'MONITOR',
    explorer: 'https://explorer.solana.com',
    tokens: [
      { symbol: 'SOL', name: 'Solana' },
      { symbol: 'CVT', name: 'Chronos Vault Token' },
    ],
  },
  ton: {
    name: 'TON Testnet',
    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    icon: '💎',
    role: 'BACKUP',
    explorer: 'https://testnet.tonviewer.com',
    tokens: [
      { symbol: 'TON', name: 'Toncoin' },
      { symbol: 'CVT', name: 'Chronos Vault Token' },
    ],
  },
};

const SWAP_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: 'Initiated', color: 'text-yellow-400' },
  consensus_pending: { label: 'Consensus Pending', color: 'text-orange-400' },
  consensus_reached: { label: 'Consensus Reached', color: 'text-green-400' },
  claimed: { label: 'Claimed', color: 'text-emerald-400' },
  refunded: { label: 'Refunded', color: 'text-blue-400' },
  expired: { label: 'Expired', color: 'text-red-400' },
};

const WALLET_ICONS: Record<string, JSX.Element> = {
  ethereum: <SiEthereum className="h-4 w-4" />,
  solana: <SiSolana className="h-4 w-4" />,
  ton: <span className="text-sm">💎</span>,
};

const WALLET_NAMES: Record<string, string> = {
  ethereum: 'MetaMask',
  solana: 'Phantom',
  ton: 'TON Keeper',
};

function getExplorerTxUrl(chain: ChainId, txHash: string): string {
  const baseUrl = CHAIN_CONFIG[chain].explorer;
  switch (chain) {
    case 'arbitrum':
      return `${baseUrl}/tx/${txHash}`;
    case 'solana':
      return `${baseUrl}/tx/${txHash}?cluster=devnet`;
    case 'ton':
      return `${baseUrl}/transaction/${txHash}`;
    default:
      return `${baseUrl}/tx/${txHash}`;
  }
}

export default function TrinityBridge() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const wallet = useWallet();
  const queryClient = useQueryClient();
  
  const [isSigningMessage, setIsSigningMessage] = useState(false);
  const [signatureResult, setSignatureResult] = useState<string | null>(null);
  const [currentScreen, setCurrentScreen] = useState<SwapScreen>('configuration');
  const [swapConfig, setSwapConfig] = useState<SwapConfig>({
    sourceChain: 'arbitrum',
    destinationChain: 'solana',
    sourceToken: 'ETH',
    destinationToken: 'SOL',
    amount: '',
    recipientAddress: '',
    timelockHours: 24,
  });
  const [activeSwap, setActiveSwap] = useState<SwapDetails | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const isWalletConnected = (chain: ChainId): boolean => {
    const chainKey = chain === 'arbitrum' ? 'ethereum' : chain;
    return wallet.connectedWallets[chainKey]?.address !== undefined;
  };

  const getWalletAddress = (chain: ChainId): string | undefined => {
    const chainKey = chain === 'arbitrum' ? 'ethereum' : chain;
    return wallet.connectedWallets[chainKey]?.address;
  };

  const getWalletBalance = (chain: ChainId): string | undefined => {
    const chainKey = chain === 'arbitrum' ? 'ethereum' : chain;
    return wallet.connectedWallets[chainKey]?.balance?.formatted;
  };

  const handleConnectWallet = async (chainType: ChainType) => {
    try {
      await wallet.connect(chainType);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleDisconnectWallet = async (chainType: ChainType) => {
    try {
      await wallet.disconnect(chainType);
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  const handleSignMessage = async (chainType: ChainType) => {
    setIsSigningMessage(true);
    setSignatureResult(null);
    try {
      const message = `Chronos Vault Trinity Protocol\n\nSign this message to verify your wallet ownership.\n\nChain: ${chainType.toUpperCase()}\nTimestamp: ${new Date().toISOString()}`;
      const signature = await wallet.signMessage(chainType, message);
      setSignatureResult(signature);
      toast({
        title: "Message Signed",
        description: `Signature: ${signature.substring(0, 20)}...`,
      });
    } catch (error: any) {
      toast({
        title: "Signing Failed",
        description: error.message || "Failed to sign message",
        variant: "destructive",
      });
    } finally {
      setIsSigningMessage(false);
    }
  };

  const { data: swapQuote, isLoading: isQuoteLoading } = useQuery<{
    estimatedOutput?: string;
    fee?: string;
    networkFee?: string;
  }>({
    queryKey: ['/api/defi/swap/price', swapConfig.sourceChain, swapConfig.destinationChain, swapConfig.amount],
    enabled: !!swapConfig.amount && parseFloat(swapConfig.amount) > 0,
    staleTime: 15000,
  });

  const estimatedOutput = swapQuote?.estimatedOutput || 
    (parseFloat(swapConfig.amount || '0') * 0.95).toFixed(6);
  
  const estimatedFee = swapQuote?.fee || '0.001';
  const networkFee = swapQuote?.networkFee || '0.0005';

  const initiateSwapMutation = useMutation({
    mutationFn: async (config: SwapConfig) => {
      const response = await fetch('/api/htlc/swap/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceChain: config.sourceChain,
          destinationChain: config.destinationChain,
          sourceToken: config.sourceToken,
          destinationToken: config.destinationToken,
          amount: parseFloat(config.amount),
          recipientAddress: config.recipientAddress,
          timelockSeconds: config.timelockHours * 3600,
          senderAddress: getWalletAddress(config.sourceChain),
        }),
      });
      if (!response.ok) throw new Error('Failed to initiate swap');
      return response.json();
    },
    onSuccess: (data: any) => {
      const swapDetails: SwapDetails = {
        swapId: data.swapId,
        operationId: data.operationId,
        hashLock: data.hashLock,
        preimage: data.preimage,
        timelock: data.timelock,
        timelockExpiry: new Date(Date.now() + data.timelock * 1000),
        status: 'pending',
        consensusStatus: {
          arbitrum: 'pending',
          solana: 'pending',
          ton: 'pending',
          count: 0,
          required: 2,
        },
        sourceChain: swapConfig.sourceChain,
        destinationChain: swapConfig.destinationChain,
        sourceAmount: swapConfig.amount,
        destinationAmount: estimatedOutput,
        sourceToken: swapConfig.sourceToken,
        destinationToken: swapConfig.destinationToken,
        recipientAddress: swapConfig.recipientAddress,
        txHash: data.txHash,
        createdAt: new Date(),
      };
      setActiveSwap(swapDetails);
      setCurrentScreen('tracking');
      
      toast({
        title: "HTLC Swap Initiated",
        description: `Swap ID: ${data.swapId.substring(0, 16)}...`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Swap Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const claimSwapMutation = useMutation({
    mutationFn: async () => {
      if (!activeSwap) throw new Error('No active swap');
      const response = await fetch('/api/htlc/swap/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          swapId: activeSwap.swapId,
          preimage: activeSwap.preimage,
        }),
      });
      if (!response.ok) throw new Error('Failed to claim swap');
      return response.json();
    },
    onSuccess: () => {
      if (activeSwap) {
        setActiveSwap({ ...activeSwap, status: 'claimed' });
      }
      toast({
        title: "Funds Claimed Successfully",
        description: "Your swap has been completed!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Claim Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const refundSwapMutation = useMutation({
    mutationFn: async () => {
      if (!activeSwap) throw new Error('No active swap');
      const response = await fetch('/api/htlc/swap/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          swapId: activeSwap.swapId,
        }),
      });
      if (!response.ok) throw new Error('Failed to refund swap');
      return response.json();
    },
    onSuccess: () => {
      if (activeSwap) {
        setActiveSwap({ ...activeSwap, status: 'refunded' });
      }
      toast({
        title: "Refund Processed",
        description: "Your funds have been returned.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Refund Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const { data: consensusStatus } = useQuery<{
    status?: SwapDetails['status'];
    consensusStatus?: SwapDetails['consensusStatus'];
  }>({
    queryKey: ['/api/htlc/swap/status', activeSwap?.swapId],
    enabled: !!activeSwap && currentScreen === 'tracking' && 
             !['claimed', 'refunded', 'expired'].includes(activeSwap.status),
    refetchInterval: 3000,
  });

  useEffect(() => {
    if (consensusStatus && activeSwap) {
      setActiveSwap(prev => prev ? {
        ...prev,
        status: consensusStatus.status || prev.status,
        consensusStatus: consensusStatus.consensusStatus || prev.consensusStatus,
      } : null);
    }
  }, [consensusStatus]);

  const handleCopy = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const calculateTimeRemaining = (expiry: Date) => {
    const now = new Date();
    const diff = expiry.getTime() - now.getTime();
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getProgressPercentage = () => {
    if (!activeSwap) return 0;
    switch (activeSwap.status) {
      case 'pending': return 20;
      case 'consensus_pending': return 50;
      case 'consensus_reached': return 75;
      case 'claimed': return 100;
      case 'refunded': return 100;
      default: return 0;
    }
  };

  const [walletAvailability, setWalletAvailability] = useState<Record<ChainType, boolean>>({
    ethereum: false,
    solana: false,
    ton: false,
    bitcoin: false,
  });

  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    const mobile = isMobile();
    setIsMobileDevice(mobile);

    const checkWallets = () => {
      const phantomProvider = (window as any).phantom?.solana || (window as any).solana;
      
      setWalletAvailability({
        ethereum: mobile || (typeof window !== 'undefined' && typeof (window as any).ethereum !== 'undefined'),
        solana: mobile || (typeof window !== 'undefined' && phantomProvider?.isPhantom),
        ton: true,
        bitcoin: false,
      });
    };
    
    checkWallets();
    const timer = setTimeout(checkWallets, 1000);
    const timer2 = setTimeout(checkWallets, 2000);
    window.addEventListener('load', checkWallets);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      window.removeEventListener('load', checkWallets);
    };
  }, []);

  const WALLET_INSTALL_LINKS: Record<string, string> = {
    ethereum: 'https://metamask.io/download/',
    solana: 'https://phantom.app/download',
    ton: 'https://tonkeeper.com/',
  };

  const WalletConnectionPanel = () => {
    const chains: { id: ChainType; label: string; chainId: ChainId; network: string; color: string }[] = [
      { id: 'ethereum', label: 'Arbitrum', chainId: 'arbitrum', network: 'Sepolia Testnet', color: 'from-blue-500 to-blue-700' },
      { id: 'solana', label: 'Solana', chainId: 'solana', network: 'Devnet', color: 'from-purple-500 to-purple-700' },
      { id: 'ton', label: 'TON', chainId: 'ton', network: 'Testnet', color: 'from-cyan-500 to-cyan-700' },
    ];

    const connectedCount = chains.filter(c => isWalletConnected(c.chainId)).length;

    const isInIframe = window.self !== window.top;
    const appUrl = window.location.href;

    return (
      <div className="mb-6 space-y-4">
        {isInIframe && !wallet.isDevelopmentMode && (
          <Alert className="bg-amber-500/10 border-amber-500/30">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <AlertTitle className="text-amber-400">Open in Browser for Real Wallets</AlertTitle>
            <AlertDescription className="text-amber-300/80">
              <p className="mb-2">Wallet extensions like MetaMask and Phantom work best when opened in a new browser tab.</p>
              <div className="flex gap-2 flex-wrap">
                <Button 
                  size="sm" 
                  className="bg-amber-500 hover:bg-amber-600 text-black"
                  onClick={() => window.open(appUrl, '_blank')}
                  data-testid="button-open-new-tab"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in New Tab
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
                  onClick={() => wallet.toggleDevelopmentMode()}
                  data-testid="button-use-dev-mode"
                >
                  🧪 Use Dev Mode Instead
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-[#FF5AF7] to-[#6B00D7]">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Wallet Connections</h3>
              <p className="text-xs text-gray-400">
                {connectedCount === 0 ? 'Connect wallets to start swapping' : 
                 connectedCount === 3 ? 'All wallets connected!' : 
                 `${connectedCount}/3 wallets connected`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={`${wallet.isDevelopmentMode ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' : 'bg-gray-500/10 text-gray-400 border-gray-500/30'} cursor-pointer`}
              onClick={() => wallet.toggleDevelopmentMode()}
              data-testid="toggle-dev-mode"
            >
              {wallet.isDevelopmentMode ? '🧪 Dev Mode ON' : '🔗 Live Mode'}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {chains.map(({ id, label, chainId, network, color }) => {
            const isConnected = isWalletConnected(chainId);
            const address = getWalletAddress(chainId);
            const balance = getWalletBalance(chainId);
            const status = wallet.status[id];
            const isAvailable = walletAvailability[id] || wallet.isDevelopmentMode;

            return (
              <div 
                key={id} 
                className={`relative rounded-xl border overflow-hidden transition-all duration-300 ${
                  isConnected 
                    ? 'border-green-500/40 bg-gradient-to-br from-green-500/10 to-transparent' 
                    : 'border-[#333] bg-[#0a0a0a] hover:border-[#444]'
                }`}
              >
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${color} ${isConnected ? 'opacity-100' : 'opacity-30'}`} />
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg bg-gradient-to-r ${color}`}>
                        {WALLET_ICONS[id]}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{label}</p>
                        <p className="text-[10px] text-gray-500">{network}</p>
                      </div>
                    </div>
                    {isConnected && (
                      <div className="flex items-center gap-1 text-green-400">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                      </div>
                    )}
                  </div>

                  {isConnected && address ? (
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between p-2 bg-black/40 rounded-lg">
                        <div className="min-w-0 flex-1">
                          <p className="font-mono text-xs truncate text-white">{address.slice(0, 6)}...{address.slice(-4)}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 ml-2"
                          onClick={() => handleCopy(address, `address-${id}`)}
                        >
                          {copiedField === `address-${id}` ? (
                            <CheckCircle className="h-3 w-3 text-green-400" />
                          ) : (
                            <Copy className="h-3 w-3 text-gray-400" />
                          )}
                        </Button>
                      </div>
                      {balance && (
                        <div className="text-center">
                          <span className="text-lg font-bold bg-gradient-to-r from-[#FF5AF7] to-[#6B00D7] bg-clip-text text-transparent">
                            {balance}
                          </span>
                          <span className="text-xs text-gray-400 ml-1">
                            {chainId === 'arbitrum' ? 'ETH' : chainId === 'solana' ? 'SOL' : 'TON'}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : !isAvailable && !isMobileDevice ? (
                    <div className="mb-3 p-2 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                      <p className="text-xs text-orange-400 mb-2">
                        {WALLET_NAMES[id]} not detected
                      </p>
                      <a 
                        href={WALLET_INSTALL_LINKS[id]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#FF5AF7] hover:underline flex items-center gap-1"
                      >
                        Install {WALLET_NAMES[id]}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  ) : isMobileDevice && !isConnected ? (
                    <div className="mb-3 p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <p className="text-xs text-blue-400">
                        📱 Tap to open {WALLET_NAMES[id]} app
                      </p>
                    </div>
                  ) : null}

                  <div className="flex gap-2">
                    {isConnected ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs h-8 border-[#FF5AF7]/30 text-[#FF5AF7] hover:bg-[#FF5AF7]/10"
                          onClick={() => handleSignMessage(id)}
                          disabled={isSigningMessage}
                          data-testid={`button-sign-${id}`}
                        >
                          {isSigningMessage ? (
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          ) : (
                            <PenTool className="h-3 w-3 mr-1" />
                          )}
                          Verify
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs h-8 border-red-500/30 text-red-400 hover:bg-red-500/10"
                          onClick={() => handleDisconnectWallet(id)}
                          data-testid={`button-disconnect-${id}`}
                        >
                          <Unlink className="h-3 w-3 mr-1" />
                          Disconnect
                        </Button>
                      </>
                    ) : (
                      <Button
                        className={`w-full h-8 text-xs ${(isAvailable || isMobileDevice) ? 'bg-gradient-to-r from-[#FF5AF7] to-[#6B00D7] hover:opacity-90' : 'bg-gray-700 cursor-not-allowed'}`}
                        size="sm"
                        onClick={() => (isAvailable || isMobileDevice) && handleConnectWallet(id)}
                        disabled={status === 'connecting' || (!isAvailable && !isMobileDevice)}
                        data-testid={`button-connect-${id}`}
                      >
                        {status === 'connecting' ? (
                          <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                        ) : isMobileDevice ? (
                          <ExternalLink className="h-3 w-3 mr-2" />
                        ) : (
                          <Link2 className="h-3 w-3 mr-2" />
                        )}
                        {isMobileDevice 
                          ? `Open ${WALLET_NAMES[id]} App` 
                          : isAvailable 
                            ? `Connect ${WALLET_NAMES[id]}` 
                            : 'Install Wallet'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {signatureResult && (
          <div className="p-3 bg-green-500/5 border border-green-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <p className="text-sm font-medium text-green-400">Wallet Verified</p>
            </div>
            <p className="font-mono text-xs break-all text-gray-400">{signatureResult.substring(0, 66)}...</p>
          </div>
        )}
      </div>
    );
  };

  const ConfigurationScreen = () => (
    <>
      <WalletConnectionPanel />
      <Card className="border border-[#333] bg-[#121212]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl bg-gradient-to-r from-white via-[#FF5AF7] to-[#6B00D7] bg-clip-text text-transparent">
                Trinity Bridge
              </CardTitle>
              <CardDescription className="mt-1">
                Cross-chain atomic swaps secured by 2-of-3 Trinity Protocol consensus
              </CardDescription>
            </div>
            <Badge className="bg-green-500/10 text-green-500 border-green-500/30">
              <Shield className="h-3 w-3 mr-1" />
              HTLC Protected
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <span>From Chain</span>
                <Badge variant="outline" className={CHAIN_CONFIG[swapConfig.sourceChain].color}>
                  {CHAIN_CONFIG[swapConfig.sourceChain].role}
                </Badge>
              </Label>
              <Select 
                value={swapConfig.sourceChain} 
                onValueChange={(v: ChainId) => {
                  setSwapConfig(prev => ({ 
                    ...prev, 
                    sourceChain: v,
                    sourceToken: CHAIN_CONFIG[v].tokens[0].symbol,
                  }));
                }}
              >
                <SelectTrigger className="bg-black border-[#333]" data-testid="select-source-chain">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CHAIN_CONFIG).map(([id, config]) => (
                    <SelectItem key={id} value={id} disabled={id === swapConfig.destinationChain}>
                      {config.icon} {config.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Token</Label>
              <Select 
                value={swapConfig.sourceToken} 
                onValueChange={(v) => setSwapConfig(prev => ({ ...prev, sourceToken: v }))}
              >
                <SelectTrigger className="bg-black border-[#333]" data-testid="select-source-token">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CHAIN_CONFIG[swapConfig.sourceChain].tokens.map((token) => (
                    <SelectItem key={token.symbol} value={token.symbol}>
                      {token.symbol} - {token.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input
                type="text"
                inputMode="decimal"
                pattern="[0-9]*\.?[0-9]*"
                placeholder="0.1"
                value={swapConfig.amount}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
                    setSwapConfig(prev => ({ ...prev, amount: value }));
                  }
                }}
                className={`bg-black border-[#333] text-lg ${
                  swapConfig.amount && parseFloat(swapConfig.amount) < 0.01 
                    ? 'border-red-500' 
                    : ''
                }`}
                data-testid="input-amount"
              />
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">
                  Min: 0.01 {swapConfig.sourceToken} + 0.001 fee
                </span>
                {swapConfig.amount && parseFloat(swapConfig.amount) < 0.01 && (
                  <span className="text-red-500">
                    Amount below minimum (0.01)
                  </span>
                )}
              </div>
              {isWalletConnected(swapConfig.sourceChain) && (
                <p className="text-xs text-gray-500">
                  Balance: Loading...
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF5AF7]/20 to-[#6B00D7]/20 rounded-full blur-xl" />
              <Button 
                variant="outline" 
                size="icon"
                className="relative h-12 w-12 rounded-full border-2 border-[#FF5AF7]/50"
                onClick={() => {
                  setSwapConfig(prev => ({
                    ...prev,
                    sourceChain: prev.destinationChain,
                    destinationChain: prev.sourceChain,
                    sourceToken: prev.destinationToken,
                    destinationToken: prev.sourceToken,
                  }));
                }}
                data-testid="button-swap-chains"
              >
                <ArrowLeftRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <span>To Chain</span>
                <Badge variant="outline" className={CHAIN_CONFIG[swapConfig.destinationChain].color}>
                  {CHAIN_CONFIG[swapConfig.destinationChain].role}
                </Badge>
              </Label>
              <Select 
                value={swapConfig.destinationChain} 
                onValueChange={(v: ChainId) => {
                  setSwapConfig(prev => ({ 
                    ...prev, 
                    destinationChain: v,
                    destinationToken: CHAIN_CONFIG[v].tokens[0].symbol,
                  }));
                }}
              >
                <SelectTrigger className="bg-black border-[#333]" data-testid="select-destination-chain">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CHAIN_CONFIG).map(([id, config]) => (
                    <SelectItem key={id} value={id} disabled={id === swapConfig.sourceChain}>
                      {config.icon} {config.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Token</Label>
              <Select 
                value={swapConfig.destinationToken} 
                onValueChange={(v) => setSwapConfig(prev => ({ ...prev, destinationToken: v }))}
              >
                <SelectTrigger className="bg-black border-[#333]" data-testid="select-destination-token">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CHAIN_CONFIG[swapConfig.destinationChain].tokens.map((token) => (
                    <SelectItem key={token.symbol} value={token.symbol}>
                      {token.symbol} - {token.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>You Receive (Estimated)</Label>
              <div className="relative">
                <Input
                  type="text"
                  value={isQuoteLoading ? 'Loading...' : estimatedOutput}
                  disabled
                  className="bg-black/50 border-[#333] text-lg"
                  data-testid="input-output-amount"
                />
                {isQuoteLoading && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin" />
                )}
              </div>
            </div>
          </div>
        </div>
        
        <Separator className="bg-[#333]" />
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Recipient Address (on {CHAIN_CONFIG[swapConfig.destinationChain].name})</Label>
            <Input
              placeholder={swapConfig.destinationChain === 'solana' ? 'Enter Solana address...' : 
                          swapConfig.destinationChain === 'ton' ? 'Enter TON address...' : 
                          'Enter address (0x...)'}
              value={swapConfig.recipientAddress}
              onChange={(e) => setSwapConfig(prev => ({ ...prev, recipientAddress: e.target.value }))}
              className="bg-black border-[#333]"
              data-testid="input-recipient-address"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Time-Lock Duration</Label>
            <Select 
              value={String(swapConfig.timelockHours)} 
              onValueChange={(v) => setSwapConfig(prev => ({ ...prev, timelockHours: parseInt(v) }))}
            >
              <SelectTrigger className="bg-black border-[#333]" data-testid="select-timelock">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6 Hours</SelectItem>
                <SelectItem value="12">12 Hours</SelectItem>
                <SelectItem value="24">24 Hours (Recommended)</SelectItem>
                <SelectItem value="48">48 Hours</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Funds will be locked for this duration. If not claimed, they can be refunded after expiry.
            </p>
          </div>
        </div>
        
        <Card className="bg-[#0a0a0a] border-[#222]">
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Protocol Fee</span>
                <span>{estimatedFee} {swapConfig.sourceToken}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Network Fee</span>
                <span>~{networkFee} {swapConfig.sourceToken}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Exchange Rate</span>
                <span>1 {swapConfig.sourceToken} ≈ {(parseFloat(estimatedOutput) / parseFloat(swapConfig.amount || '1')).toFixed(4)} {swapConfig.destinationToken}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Security</span>
                <span className="text-green-400">2-of-3 Consensus</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
      <CardFooter className="flex gap-4">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => setLocation('/')}
          data-testid="button-cancel"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button 
          className="flex-1 bg-gradient-to-r from-[#FF5AF7] to-[#6B00D7] hover:opacity-90"
          onClick={() => setCurrentScreen('confirmation')}
          disabled={!swapConfig.amount || !swapConfig.recipientAddress || parseFloat(swapConfig.amount) < 0.01}
          data-testid="button-review-swap"
        >
          {parseFloat(swapConfig.amount || '0') < 0.01 ? 'Min 0.01 ETH Required' : 'Review Swap'}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
    </>
  );

  const ConfirmationScreen = () => (
    <Card className="border border-[#333] bg-[#121212]">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setCurrentScreen('configuration')}
            data-testid="button-back-to-config"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <CardTitle>Confirm Your Swap</CardTitle>
            <CardDescription>Review the details before locking your tokens</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <Card className={`border ${CHAIN_CONFIG[swapConfig.sourceChain].color.replace('text-', 'border-').replace('/10', '/30')}`}>
            <CardContent className="pt-4 text-center">
              <p className="text-2xl mb-1">{CHAIN_CONFIG[swapConfig.sourceChain].icon}</p>
              <p className="font-semibold">{CHAIN_CONFIG[swapConfig.sourceChain].name}</p>
              <p className="text-2xl font-bold mt-2">{swapConfig.amount} {swapConfig.sourceToken}</p>
              <Badge variant="outline" className={CHAIN_CONFIG[swapConfig.sourceChain].color}>
                {CHAIN_CONFIG[swapConfig.sourceChain].role}
              </Badge>
            </CardContent>
          </Card>
          
          <div className="flex flex-col items-center gap-2">
            <ArrowRight className="h-8 w-8 text-[#FF5AF7]" />
            <Badge className="bg-[#FF5AF7]/10 text-[#FF5AF7] border-[#FF5AF7]/30">
              <Lock className="h-3 w-3 mr-1" />
              HTLC Lock
            </Badge>
          </div>
          
          <Card className={`border ${CHAIN_CONFIG[swapConfig.destinationChain].color.replace('text-', 'border-').replace('/10', '/30')}`}>
            <CardContent className="pt-4 text-center">
              <p className="text-2xl mb-1">{CHAIN_CONFIG[swapConfig.destinationChain].icon}</p>
              <p className="font-semibold">{CHAIN_CONFIG[swapConfig.destinationChain].name}</p>
              <p className="text-2xl font-bold mt-2">{estimatedOutput} {swapConfig.destinationToken}</p>
              <Badge variant="outline" className={CHAIN_CONFIG[swapConfig.destinationChain].color}>
                {CHAIN_CONFIG[swapConfig.destinationChain].role}
              </Badge>
            </CardContent>
          </Card>
        </div>
        
        <Separator className="bg-[#333]" />
        
        <div className="space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Swap Details
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 bg-[#0a0a0a] rounded-lg">
              <p className="text-gray-500">Recipient Address</p>
              <p className="font-mono text-xs mt-1 break-all">{swapConfig.recipientAddress}</p>
            </div>
            <div className="p-3 bg-[#0a0a0a] rounded-lg">
              <p className="text-gray-500">Time-Lock Duration</p>
              <p className="font-semibold mt-1">{swapConfig.timelockHours} Hours</p>
            </div>
            <div className="p-3 bg-[#0a0a0a] rounded-lg">
              <p className="text-gray-500">Protocol Fee</p>
              <p className="font-semibold mt-1">{estimatedFee} {swapConfig.sourceToken}</p>
            </div>
            <div className="p-3 bg-[#0a0a0a] rounded-lg">
              <p className="text-gray-500">Network Fee</p>
              <p className="font-semibold mt-1">~{networkFee} {swapConfig.sourceToken}</p>
            </div>
          </div>
        </div>
        
        <Alert className="border-yellow-500/30 bg-yellow-500/5">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          <AlertTitle className="text-yellow-500">HTLC Security Notice</AlertTitle>
          <AlertDescription className="text-gray-400">
            Your tokens will be locked in a Hash Time-Locked Contract (HTLC). 
            The swap requires 2-of-3 Trinity Protocol validator consensus. 
            If not claimed within {swapConfig.timelockHours} hours, you can refund your tokens.
          </AlertDescription>
        </Alert>
        
        <Card className="bg-gradient-to-r from-[#FF5AF7]/5 to-[#6B00D7]/5 border-[#FF5AF7]/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="h-5 w-5 text-[#FF5AF7]" />
              <h4 className="font-semibold">Trinity Protocol Security</h4>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['arbitrum', 'solana', 'ton'] as ChainId[]).map((chain) => (
                <div key={chain} className="text-center p-2 bg-black/30 rounded">
                  <p className="text-lg">{CHAIN_CONFIG[chain].icon}</p>
                  <p className="text-xs text-gray-400">{CHAIN_CONFIG[chain].role}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              2-of-3 validator consensus required for swap completion
            </p>
          </CardContent>
        </Card>
      </CardContent>
      <CardFooter className="flex gap-4">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => setCurrentScreen('configuration')}
          data-testid="button-back-to-edit"
        >
          Edit
        </Button>
        <Button 
          className="flex-1 bg-gradient-to-r from-[#FF5AF7] to-[#6B00D7] hover:opacity-90"
          onClick={() => initiateSwapMutation.mutate(swapConfig)}
          disabled={initiateSwapMutation.isPending}
          data-testid="button-confirm-lock"
        >
          {initiateSwapMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Locking Tokens...
            </>
          ) : (
            <>
              <Lock className="h-4 w-4 mr-2" />
              Confirm & Lock Tokens
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );

  const TrackingScreen = () => {
    if (!activeSwap) return null;
    
    const canClaim = activeSwap.status === 'consensus_reached';
    const canRefund = activeSwap.status === 'expired' || 
      (new Date() > activeSwap.timelockExpiry && activeSwap.status !== 'claimed');
    const isComplete = ['claimed', 'refunded'].includes(activeSwap.status);
    
    return (
      <Card className="border border-[#333] bg-[#121212]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-[#FF5AF7]" />
                Swap Progress
              </CardTitle>
              <CardDescription>
                Tracking your cross-chain atomic swap
              </CardDescription>
            </div>
            <Badge className={`${SWAP_STATUS_LABELS[activeSwap.status].color} bg-opacity-10 border-current`}>
              {SWAP_STATUS_LABELS[activeSwap.status].label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Progress value={getProgressPercentage()} className="h-2" />
          
          <div className="grid grid-cols-5 gap-2 text-center text-xs">
            {[
              { step: 'Initiated', active: true },
              { step: 'Consensus Pending', active: ['consensus_pending', 'consensus_reached', 'claimed'].includes(activeSwap.status) },
              { step: 'Consensus Reached', active: ['consensus_reached', 'claimed'].includes(activeSwap.status) },
              { step: 'Claim Pending', active: activeSwap.status === 'consensus_reached' },
              { step: isComplete ? (activeSwap.status === 'claimed' ? 'Claimed' : 'Refunded') : 'Complete', active: isComplete },
            ].map((item, i) => (
              <div key={i} className={item.active ? 'text-[#FF5AF7]' : 'text-gray-600'}>
                <div className={`mx-auto w-6 h-6 rounded-full flex items-center justify-center mb-1 ${
                  item.active ? 'bg-[#FF5AF7]/20 border border-[#FF5AF7]' : 'bg-[#222] border border-[#444]'
                }`}>
                  {item.active ? <CheckCircle className="h-3 w-3" /> : (i + 1)}
                </div>
                {item.step}
              </div>
            ))}
          </div>
          
          <Separator className="bg-[#333]" />
          
          <Card className="bg-gradient-to-r from-[#FF5AF7]/5 to-[#6B00D7]/5 border-[#FF5AF7]/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Trinity Consensus Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {(['arbitrum', 'solana', 'ton'] as ChainId[]).map((chain) => {
                  const status = activeSwap.consensusStatus[chain];
                  return (
                    <div key={chain} className="text-center p-3 bg-black/30 rounded-lg">
                      <p className="text-xl mb-2">{CHAIN_CONFIG[chain].icon}</p>
                      <p className="text-xs text-gray-400 mb-1">{CHAIN_CONFIG[chain].name}</p>
                      <Badge 
                        variant="outline" 
                        className={
                          status === 'signed' ? 'text-green-400 border-green-400/30' :
                          status === 'failed' ? 'text-red-400 border-red-400/30' :
                          'text-yellow-400 border-yellow-400/30'
                        }
                      >
                        {status === 'signed' ? (
                          <><CheckCircle className="h-3 w-3 mr-1" /> Signed</>
                        ) : status === 'failed' ? (
                          <><AlertCircle className="h-3 w-3 mr-1" /> Failed</>
                        ) : (
                          <><Clock className="h-3 w-3 mr-1" /> Pending</>
                        )}
                      </Badge>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 text-center">
                <p className="text-sm">
                  <span className="text-[#FF5AF7] font-bold">{activeSwap.consensusStatus.count}</span>
                  <span className="text-gray-500"> of </span>
                  <span className="font-bold">{activeSwap.consensusStatus.required}</span>
                  <span className="text-gray-500"> signatures collected</span>
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#0a0a0a] border-[#222]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Timer className="h-4 w-4" />
                Time-Lock Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-[#FF5AF7]">
                    {calculateTimeRemaining(activeSwap.timelockExpiry)}
                  </p>
                  <p className="text-xs text-gray-500">Until refund available</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Expires at</p>
                  <p className="font-mono text-sm">{activeSwap.timelockExpiry.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Swap Details</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-[#0a0a0a] rounded-lg">
                <p className="text-gray-500 text-xs">Swap ID</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="font-mono text-xs truncate">{activeSwap.swapId}</p>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6"
                    onClick={() => handleCopy(activeSwap.swapId, 'swapId')}
                  >
                    {copiedField === 'swapId' ? <CheckCircle className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
              </div>
              <div className="p-3 bg-[#0a0a0a] rounded-lg">
                <p className="text-gray-500 text-xs">Hash Lock</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="font-mono text-xs truncate">{activeSwap.hashLock}</p>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6"
                    onClick={() => handleCopy(activeSwap.hashLock, 'hashLock')}
                  >
                    {copiedField === 'hashLock' ? <CheckCircle className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
              </div>
              {activeSwap.txHash && (
                <div className="p-3 bg-[#0a0a0a] rounded-lg col-span-2">
                  <p className="text-gray-500 text-xs">Transaction Hash</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="font-mono text-xs truncate">{activeSwap.txHash}</p>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => window.open(getExplorerTxUrl(activeSwap.sourceChain, activeSwap.txHash!), '_blank')}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-4">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => setLocation('/monitoring')}
            data-testid="button-view-trinity-scan"
          >
            <Eye className="h-4 w-4 mr-2" />
            View in Trinity Scan
          </Button>
          {canClaim && (
            <Button 
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90"
              onClick={() => claimSwapMutation.mutate()}
              disabled={claimSwapMutation.isPending}
              data-testid="button-claim-funds"
            >
              {claimSwapMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              Claim Funds
            </Button>
          )}
          {canRefund && !isComplete && (
            <Button 
              variant="outline"
              className="flex-1 border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
              onClick={() => refundSwapMutation.mutate()}
              disabled={refundSwapMutation.isPending}
              data-testid="button-refund"
            >
              {refundSwapMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refund
            </Button>
          )}
          {isComplete && (
            <Button 
              className="flex-1 bg-gradient-to-r from-[#FF5AF7] to-[#6B00D7] hover:opacity-90"
              onClick={() => {
                setActiveSwap(null);
                setCurrentScreen('configuration');
                setSwapConfig({
                  sourceChain: 'arbitrum',
                  destinationChain: 'solana',
                  sourceToken: 'ETH',
                  destinationToken: 'SOL',
                  amount: '',
                  recipientAddress: '',
                  timelockHours: 24,
                });
              }}
              data-testid="button-new-swap"
            >
              <ArrowLeftRight className="h-4 w-4 mr-2" />
              New Swap
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="mb-6 flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setLocation('/')}
            data-testid="button-home"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-[#FF5AF7] to-[#6B00D7] bg-clip-text text-transparent">
              Trinity Bridge
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              HTLC Atomic Swaps with 2-of-3 Multi-Chain Consensus
            </p>
          </div>
        </div>
        
        {currentScreen === 'configuration' && <ConfigurationScreen />}
        {currentScreen === 'confirmation' && <ConfirmationScreen />}
        {currentScreen === 'tracking' && <TrackingScreen />}
        
        <div className="mt-6 text-center text-xs text-gray-600">
          <p>Powered by <span className="text-[#FF5AF7]">Chronos Vault</span> Trinity Protocol™ v3.5.24</p>
          <p className="mt-1">Arbitrum (PRIMARY) • Solana (MONITOR) • TON (BACKUP)</p>
        </div>
      </div>
    </div>
  );
}
