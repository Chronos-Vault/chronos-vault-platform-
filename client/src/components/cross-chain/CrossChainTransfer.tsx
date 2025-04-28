import React, { useState, useEffect } from 'react';
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useMultiChain } from "@/contexts/multi-chain-context";
import { SiTon, SiSolana, SiEthereum, SiBitcoin } from "react-icons/si";
import { bridgeService } from "@/lib/cross-chain/bridge";
import { liquidityOptimizer } from "@/lib/cross-chain/LiquidityOptimizer";
import { TransferPriority, BlockchainType as BridgeChainType } from '@/lib/cross-chain/interfaces';

// Bridge adapter to convert between our ChainType and the bridge's BlockchainType
const bridgeAdapter = {
  toChainType(bridgeType: BridgeChainType): ChainType {
    switch(bridgeType) {
      case 'TON': return 'TON';
      case 'SOL': return 'SOLANA';
      case 'ETH': return 'ETHEREUM';
      case 'BNB': return 'BITCOIN'; // For now mapping to Bitcoin
      case 'MATIC': return 'BITCOIN'; // For now mapping to Bitcoin
      default: return 'TON';
    }
  },
  
  toBridgeType(chainType: ChainType): BridgeChainType {
    switch(chainType) {
      case 'TON': return 'TON';
      case 'SOLANA': return 'SOL';
      case 'ETHEREUM': return 'ETH';
      case 'BITCOIN': return 'BNB'; // For now mapping to BNB
      default: return 'TON';
    }
  }
};
import { useAuthContext } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';

// Define our chain types locally to avoid conflicts
type ChainType = 'TON' | 'SOLANA' | 'ETHEREUM' | 'BITCOIN';

// Local BlockchainIcon component
const BlockchainIcon: React.FC<{ chainId: ChainType, size?: 'sm' | 'md' | 'lg', className?: string }> = ({ 
  chainId, 
  size = 'md',
  className = ''
}) => {
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };
  
  const sizeClass = sizeMap[size];
  const colorClass = 
    chainId === 'TON' ? 'text-teal-500' : 
    chainId === 'SOLANA' ? 'text-purple-500' :
    chainId === 'ETHEREUM' ? 'text-blue-500' :
    chainId === 'BITCOIN' ? 'text-orange-500' : '';
                    
  switch (chainId) {
    case 'TON':
      return <SiTon className={`${sizeClass} ${colorClass} ${className}`} />;
    case 'SOLANA':
      return <SiSolana className={`${sizeClass} ${colorClass} ${className}`} />;
    case 'ETHEREUM':
      return <SiEthereum className={`${sizeClass} ${colorClass} ${className}`} />;
    case 'BITCOIN':
      return <SiBitcoin className={`${sizeClass} ${colorClass} ${className}`} />;
    default:
      return <div className={`${sizeClass} ${className}`}>{chainId}</div>;
  }
};

// Cross-Chain Transfer Form and Execution Component
const CrossChainTransfer: React.FC = () => {
  const { activeChain, setActiveChain, connectChain } = useMultiChain();
  const { isAuthenticated } = useAuthContext();
  const { toast } = useToast();
  
  // Convert activeChain to ChainType
  const currentChain: ChainType = 
    activeChain === 'ton' ? 'TON' :
    activeChain === 'solana' ? 'SOLANA' :
    activeChain === 'ethereum' ? 'ETHEREUM' :
    activeChain === 'bitcoin' ? 'BITCOIN' : 'TON';
  
  // Form state
  const [sourceChain, setSourceChain] = useState<ChainType>('TON');
  const [targetChain, setTargetChain] = useState<ChainType>('SOLANA');
  const [asset, setAsset] = useState('CVT');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [priority, setPriority] = useState<TransferPriority>('speed');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [routes, setRoutes] = useState<any[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  
  // Load available routes when parameters change
  useEffect(() => {
    const loadRoutes = async () => {
      if (sourceChain && targetChain && asset && amount && !isNaN(parseFloat(amount))) {
        try {
          // Convert ChainType to interface BlockchainType format
          const sourceBlockchain = sourceChain === 'TON' ? 'TON' : 
                                sourceChain === 'SOLANA' ? 'SOL' :
                                sourceChain === 'ETHEREUM' ? 'ETH' : 'BTC';
          const targetBlockchain = targetChain === 'TON' ? 'TON' : 
                                targetChain === 'SOLANA' ? 'SOL' :
                                targetChain === 'ETHEREUM' ? 'ETH' : 'BTC';
          
          const routes = await liquidityOptimizer.findOptimalRoutes(
            sourceBlockchain as any,
            targetBlockchain as any,
            asset,
            asset, // Destination asset same as source for now
            parseFloat(amount),
            priority
          );
          setRoutes(routes);
          // Auto-select the first route
          if (routes.length > 0) {
            setSelectedRouteId(routes[0].id);
          }
        } catch (error) {
          console.error('Error loading routes:', error);
        }
      }
    };
    
    loadRoutes();
  }, [sourceChain, targetChain, asset, amount, priority]);
  
  // Handle chain switching
  const handleSourceChainChange = async (newChain: ChainType) => {
    setSourceChain(newChain);
    
    // Convert ChainType to internal blockchain type
    let internalChain = 
      newChain === 'TON' ? 'ton' : 
      newChain === 'SOLANA' ? 'solana' :
      newChain === 'ETHEREUM' ? 'ethereum' :
      newChain === 'BITCOIN' ? 'bitcoin' : 'ton';
      
    // Set the active chain in the MultiChainContext
    setActiveChain(internalChain as any);
    await connectChain(internalChain as any);
    
    // If target chain is same as source, choose a different target
    if (newChain === targetChain) {
      const chains = bridgeService.getSupportedChains();
      const otherChain = chains.find(chain => chain !== newChain);
      if (otherChain) {
        setTargetChain(otherChain as ChainType);
      }
    }
  };
  
  // Handle transfer submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please connect your wallet to initiate transfers',
        variant: 'destructive'
      });
      return;
    }
    
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount',
        variant: 'destructive'
      });
      return;
    }
    
    if (!recipient) {
      toast({
        title: 'Recipient Required',
        description: 'Please enter a recipient address',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const transferRequest = await bridgeService.initiateTransfer(
        sourceChain,
        targetChain,
        asset,
        amount,
        recipient,
        priority
      );
      
      toast({
        title: 'Transfer Initiated',
        description: `Your transfer of ${amount} ${asset} has been initiated with ID: ${transferRequest.id.substring(0, 8)}...`,
        variant: 'default'
      });
      
      // Reset form
      setAmount('');
      setRecipient('');
    } catch (error) {
      console.error('Transfer error:', error);
      toast({
        title: 'Transfer Failed',
        description: 'There was an error initiating your transfer. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Get supported assets for the selected source chain
  const supportedAssets = bridgeService.getSupportedAssets(sourceChain);

  return (
    <Card className="shadow-xl border-purple-900/30 backdrop-blur-sm bg-black/40">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold">Cross-Chain Transfer</CardTitle>
        <CardDescription>
          Securely transfer assets between different blockchains with optimal routing
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Source and Target Chain Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="sourceChain">Source Chain</Label>
                <Select 
                  value={sourceChain} 
                  onValueChange={(value) => handleSourceChainChange(value as ChainType)}
                >
                  <SelectTrigger id="sourceChain" className="bg-gray-900/50 border-purple-900/30">
                    <SelectValue placeholder="Select source blockchain" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-purple-900/30">
                    {bridgeService.getSupportedChains().map((chain) => (
                      <SelectItem key={chain} value={chain} className="flex items-center">
                        <div className="flex items-center gap-2">
                          <BlockchainIcon chainId={chain} size="sm" />
                          <span>{bridgeService.getChainDetails(chain).name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="targetChain">Target Chain</Label>
                <Select 
                  value={targetChain} 
                  onValueChange={(value) => setTargetChain(value as ChainType)}
                >
                  <SelectTrigger id="targetChain" className="bg-gray-900/50 border-purple-900/30">
                    <SelectValue placeholder="Select target blockchain" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-purple-900/30">
                    {bridgeService.getSupportedChains()
                      .filter(chain => chain !== sourceChain)
                      .map((chain) => (
                        <SelectItem key={chain} value={chain}>
                          <div className="flex items-center gap-2">
                            <BlockchainIcon chainId={chain} size="sm" />
                            <span>{bridgeService.getChainDetails(chain).name}</span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Asset Selection and Amount */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="asset">Asset</Label>
                <Select 
                  value={asset} 
                  onValueChange={setAsset}
                >
                  <SelectTrigger id="asset" className="bg-gray-900/50 border-purple-900/30">
                    <SelectValue placeholder="Select asset" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-purple-900/30">
                    {supportedAssets.map((token) => (
                      <SelectItem key={token} value={token}>
                        {token}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-gray-900/50 border-purple-900/30"
                  min="0"
                  step="0.001"
                />
              </div>
            </div>
            
            {/* Recipient Address */}
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Address</Label>
              <Input
                id="recipient"
                placeholder="Enter recipient address"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="bg-gray-900/50 border-purple-900/30"
              />
            </div>
            
            {/* Transfer Priority */}
            <div className="space-y-2">
              <Label htmlFor="priority">Transfer Priority</Label>
              <Select 
                value={priority} 
                onValueChange={(value) => setPriority(value as TransferPriority)}
              >
                <SelectTrigger id="priority" className="bg-gray-900/50 border-purple-900/30">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-purple-900/30">
                  <SelectItem value="speed">Speed (Fastest)</SelectItem>
                  <SelectItem value="cost">Cost (Cheapest)</SelectItem>
                  <SelectItem value="security">Security (Safest)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Route Selection */}
            {routes.length > 0 && (
              <div className="mt-6 space-y-4">
                <Separator className="border-purple-900/20" />
                <Label>Available Routes</Label>
                
                <div className="space-y-3">
                  {routes.map(route => (
                    <div 
                      key={route.id}
                      className={`p-3 rounded-lg border border-purple-900/30 transition-all cursor-pointer
                                ${selectedRouteId === route.id 
                                  ? 'bg-purple-900/20 border-purple-500/50' 
                                  : 'bg-gray-900/30 hover:bg-gray-900/40'}`}
                      onClick={() => setSelectedRouteId(route.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="font-medium">{route.name}</div>
                        {route.recommendedFor === priority && (
                          <div className="text-sm text-purple-400 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Recommended
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">{route.description}</div>
                      
                      <div className="grid grid-cols-3 gap-2 mt-3 text-sm">
                        <div>
                          <div className="text-gray-500">Fee</div>
                          <div className="font-medium">{(route.totalFee).toFixed(4)} {asset}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Time</div>
                          <div className="font-medium">{Math.round(route.totalTime / 60)} min</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Security</div>
                          <div className="font-medium">{route.securityScore}/100</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </form>
      </CardContent>
      
      <CardFooter>
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#8500FF] hover:to-[#FF70FA]"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Initiating Transfer...
            </>
          ) : (
            <>
              Transfer {asset} <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CrossChainTransfer;