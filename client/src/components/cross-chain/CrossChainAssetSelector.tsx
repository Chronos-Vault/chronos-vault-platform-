import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  PlusCircle, 
  Trash2, 
  ArrowLeftRight, 
  DollarSign, 
  Clock, 
  Shield, 
  Zap, 
  Network, 
  Globe, 
  Sparkles,
  Check,
  ChevronRight,
  Coins,
  Lock
} from 'lucide-react';

// Define BLOCKCHAINS and TOKENS directly here
const BLOCKCHAINS = [
  { id: 'TON', name: 'TON', color: '#0098EA' },
  { id: 'ETH', name: 'Ethereum', color: '#627EEA' },
  { id: 'SOL', name: 'Solana', color: '#9945FF' },
  { id: 'POLYGON', name: 'Polygon', color: '#8247E5' },
  { id: 'ARWEAVE', name: 'Arweave', color: '#222F33' },
];

const TOKENS = [
  { blockchain: 'TON', symbol: 'TON', name: 'Toncoin', color: '#0098EA' },
  { blockchain: 'ETH', symbol: 'ETH', name: 'Ethereum', color: '#627EEA' },
  { blockchain: 'ETH', symbol: 'USDT', name: 'Tether USD', color: '#26A17B' },
  { blockchain: 'ETH', symbol: 'USDC', name: 'USD Coin', color: '#2775CA' },
  { blockchain: 'SOL', symbol: 'SOL', name: 'Solana', color: '#9945FF' },
  { blockchain: 'POLYGON', symbol: 'MATIC', name: 'Polygon', color: '#8247E5' },
  { blockchain: 'ARWEAVE', symbol: 'AR', name: 'Arweave', color: '#222F33' },
  { blockchain: 'ETH', symbol: 'BTC', name: 'Wrapped Bitcoin', color: '#F7931A' },
];

// Helper functions
const getBlockchainColor = (blockchain: string): string => {
  const found = BLOCKCHAINS.find(b => b.id === blockchain);
  return found ? found.color : '#888888';
};

const getBlockchainTokens = (blockchain: string): Array<{ symbol: string, name: string, color: string }> => {
  return TOKENS.filter(token => token.blockchain === blockchain);
};

const formatBlockchainName = (chain: string): string => {
  const found = BLOCKCHAINS.find(b => b.id === chain);
  return found ? found.name : chain;
};

const calculateTransferFee = (sourceChain: string, targetChain: string, amount: number): number => {
  // Simulate different fee structures for different chains
  const baseFee = {
    'TON': 0.1,
    'ETH': 0.02,
    'SOL': 0.005,
    'POLYGON': 0.01,
    'ARWEAVE': 0.2,
  }[sourceChain] || 0.05;
  
  return baseFee + (amount * 0.001);
};

const getEstimatedTransferTime = (sourceChain: string, targetChain: string): number => {
  // Simulate different confirmation times for different chains (in minutes)
  const baseTime = {
    'TON': 2,
    'ETH': 20,
    'SOL': 1,
    'POLYGON': 3,
    'ARWEAVE': 45,
  }[sourceChain] || 10;
  
  return baseTime;
};

interface CrossChainAssetSelectorProps {
  onAssetsChange: (assets: Array<{blockchain: string, token: string, amount: number}>) => void;
  initialAmount?: number;
}

export default function CrossChainAssetSelector({ 
  onAssetsChange,
  initialAmount = 1000
}: CrossChainAssetSelectorProps) {
  const [assets, setAssets] = useState<Array<{blockchain: string, token: string, amount: number}>>([]);
  const [selectedAssetIndex, setSelectedAssetIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Initialize with default assets
  useEffect(() => {
    if (assets.length === 0 && initialAmount > 0) {
      // Set up some default cross-chain distribution
      const defaultAssets = [
        { blockchain: 'ETH', token: 'ETH', amount: initialAmount * 0.3 },
        { blockchain: 'SOL', token: 'SOL', amount: initialAmount * 0.2 },
        { blockchain: 'TON', token: 'TON', amount: initialAmount * 0.5 },
      ];
      
      setAssets(defaultAssets);
      
      // Only call onAssetsChange if it exists
      if (typeof onAssetsChange === 'function') {
        onAssetsChange(defaultAssets);
      }
    }
  }, [initialAmount, onAssetsChange]);
  
  // Function to add a new asset entry
  const addAsset = () => {
    // Find an unused blockchain
    const usedBlockchains = new Set(assets.map(a => a.blockchain));
    const availableBlockchains = BLOCKCHAINS.filter(b => !usedBlockchains.has(b.id));
    
    // Default to first available blockchain or first in list if all are used
    const defaultBlockchain = availableBlockchains.length > 0 ? 
      availableBlockchains[0].id : BLOCKCHAINS[0].id;
      
    // Get available tokens for this blockchain
    const tokens = getBlockchainTokens(defaultBlockchain);
    const defaultToken = tokens.length > 0 ? tokens[0].symbol : '';
    
    const newAsset = {
      blockchain: defaultBlockchain,
      token: defaultToken,
      amount: initialAmount * 0.1  // Default to 10% of initial amount
    };
    
    const updatedAssets = [...assets, newAsset];
    setAssets(updatedAssets);
    setSelectedAssetIndex(updatedAssets.length - 1);
    
    // Only call onAssetsChange if it exists
    if (typeof onAssetsChange === 'function') {
      onAssetsChange(updatedAssets);
    }
    
    // Show confirmation toast
    toast({
      title: "Cross-Chain Asset Added",
      description: `Added ${defaultToken} on ${formatBlockchainName(defaultBlockchain)} blockchain to your vault.`,
    });
  };
  
  // Function to remove an asset
  const removeAsset = (index: number) => {
    const blockchain = assets[index].blockchain;
    const token = assets[index].token;
    
    const updatedAssets = [...assets];
    updatedAssets.splice(index, 1);
    setAssets(updatedAssets);
    
    // Update selected index if needed
    if (selectedAssetIndex === index) {
      setSelectedAssetIndex(null);
    } else if (selectedAssetIndex !== null && selectedAssetIndex > index) {
      setSelectedAssetIndex(selectedAssetIndex - 1);
    }
    
    // Update parent component if callback exists
    if (typeof onAssetsChange === 'function') {
      onAssetsChange(updatedAssets);
    }
    
    // Show confirmation toast
    toast({
      title: "Asset Removed",
      description: `Removed ${token} on ${formatBlockchainName(blockchain)} from your cross-chain vault.`,
    });
  };
  
  // Update asset field
  const updateAsset = (index: number, field: string, value: string | number) => {
    const updatedAssets = [...assets];
    
    // If blockchain changes, update token to the first available token for that blockchain
    if (field === 'blockchain') {
      const tokens = getBlockchainTokens(value as string);
      const defaultToken = tokens.length > 0 ? tokens[0].symbol : '';
      updatedAssets[index] = {
        ...updatedAssets[index],
        blockchain: value as string, // Cast to string for blockchain
        token: defaultToken
      };
    } else if (field === 'token') {
      updatedAssets[index] = {
        ...updatedAssets[index],
        token: value as string // Cast to string for token
      };
    } else {
      // For amount (number field)
      updatedAssets[index] = {
        ...updatedAssets[index],
        amount: value as number
      };
    }
    
    setAssets(updatedAssets);
    
    // Update parent component if callback exists
    if (typeof onAssetsChange === 'function') {
      onAssetsChange(updatedAssets);
    }
  };
  
  // Calculate estimated fees and time for current assets
  const calculateEstimates = () => {
    let totalFee = 0;
    let maxTime = 0;
    
    assets.forEach(asset => {
      const fee = calculateTransferFee(asset.blockchain, 'TON', asset.amount);
      const time = getEstimatedTransferTime(asset.blockchain, 'TON');
      
      totalFee += fee;
      maxTime = Math.max(maxTime, time);
    });
    
    return { fee: totalFee, time: maxTime };
  };
  
  // Only calculate if we have assets
  const estimates = assets.length > 0 ? calculateEstimates() : { fee: 0, time: 0 };
  
  return (
    <div className="space-y-5">
      {/* Header with visual explanation */}
      <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-gradient-to-r from-primary/5 via-white/80 to-purple-600/5 dark:from-primary/10 dark:via-black/30 dark:to-purple-600/10 rounded-lg border border-primary/10 shadow-sm">
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-purple-600/40 rounded-full blur-lg opacity-50"></div>
          <div className="relative w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center">
            <Globe className="h-8 w-8 text-white" />
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Quantum-Secured Cross-Chain Distribution</span>
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Distribute your assets across multiple global blockchain networks for maximum security, quantum-resistant encryption, and optimized risk diversification.
          </p>
        </div>
      </div>
      
      {/* Asset cards with sophisticated styling */}
      <div className="space-y-3">
        {assets.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground border border-dashed rounded-lg bg-muted/10">
            <Network className="h-8 w-8 mx-auto mb-2 text-primary/50" />
            <p className="font-medium mb-1">No Cross-Chain Assets Added</p>
            <p className="text-xs max-w-xs mx-auto">
              Add assets from other blockchains to activate quantum-secured cross-chain protection
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {assets.map((asset, index) => (
              <Card 
                key={index} 
                className={`border overflow-hidden transition-all hover:shadow-md ${
                  selectedAssetIndex === index 
                    ? 'border-primary/50 shadow-lg shadow-primary/10' 
                    : 'border-muted/50'
                }`}
                onClick={() => setSelectedAssetIndex(index)}
              >
                <CardContent className="p-4 relative">
                  {/* Background effects */}
                  <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: getBlockchainColor(asset.blockchain) }}></div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800 shadow-sm" 
                          style={{ backgroundColor: getBlockchainColor(asset.blockchain) }}>
                          <div className="text-white text-xs font-bold">
                            {asset.blockchain.substring(0, 3)}
                          </div>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-gray-800 border border-muted flex items-center justify-center shadow-sm">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: TOKENS.find(t => t.symbol === asset.token)?.color }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-semibold flex items-center gap-1.5">
                          {formatBlockchainName(asset.blockchain)}
                          <span className="text-sm text-muted-foreground">({asset.token})</span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge className="bg-gradient-to-r from-primary/80 to-primary text-white border-0 shadow-sm text-[10px] py-0 px-1.5">
                            <Shield className="h-2.5 w-2.5 mr-0.5" />
                            <span>Quantum Secured</span>
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {getEstimatedTransferTime(asset.blockchain, 'TON')} min transfer
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-mono font-medium">
                          {asset.amount.toLocaleString(undefined, {maximumFractionDigits: 2})} {asset.token}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Fee: {calculateTransferFee(asset.blockchain, 'TON', asset.amount).toFixed(4)}
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        {selectedAssetIndex === index && (
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 border-muted/30"
                            onClick={() => setSelectedAssetIndex(null)}
                          >
                            <Check className="h-4 w-4 text-primary" />
                          </Button>
                        )}
                        
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={(e) => {
                            e.stopPropagation();
                            removeAsset(index);
                          }}
                          className="h-8 w-8 border-muted/30 hover:border-destructive/30 hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Expanded edit form */}
                  {selectedAssetIndex === index && (
                    <div className="mt-4 pt-4 border-t border-dashed border-muted/50 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium flex items-center gap-1.5">
                          <Network className="h-3.5 w-3.5 text-primary" />
                          Blockchain
                        </label>
                        <Select 
                          value={asset.blockchain}
                          onValueChange={(value) => updateAsset(index, 'blockchain', value)}
                        >
                          <SelectTrigger className="bg-white dark:bg-black/20 border-primary/20">
                            <SelectValue placeholder="Select blockchain" />
                          </SelectTrigger>
                          <SelectContent>
                            {BLOCKCHAINS.map(chain => (
                              <SelectItem key={chain.id} value={chain.id}>
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chain.color }}></div>
                                  <span>{chain.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium flex items-center gap-1.5">
                          <Coins className="h-3.5 w-3.5 text-primary" />
                          Asset Token
                        </label>
                        <Select 
                          value={asset.token}
                          onValueChange={(value) => updateAsset(index, 'token', value)}
                        >
                          <SelectTrigger className="bg-white dark:bg-black/20 border-primary/20">
                            <SelectValue placeholder="Select token" />
                          </SelectTrigger>
                          <SelectContent>
                            {getBlockchainTokens(asset.blockchain).map(token => (
                              <SelectItem key={token.symbol} value={token.symbol}>
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: token.color }}></div>
                                  <span>{token.name} ({token.symbol})</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium flex items-center gap-1.5">
                          <DollarSign className="h-3.5 w-3.5 text-primary" />
                          Amount
                        </label>
                        <div className="relative">
                          <Input
                            type="number"
                            value={asset.amount}
                            onChange={(e) => updateAsset(index, 'amount', parseFloat(e.target.value) || 0)}
                            className="pl-8 bg-white dark:bg-black/20 border-primary/20"
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                          />
                          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                            <span className="text-xs font-mono">{asset.token}</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between text-xs text-muted-foreground pt-1.5">
                          <div className="flex items-center">
                            <Zap className="h-3 w-3 mr-1 text-amber-500" /> 
                            <span>Quantum secured</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" /> 
                            <span>{getEstimatedTransferTime(asset.blockchain, 'TON')} min</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        <Button 
          variant="outline" 
          className="w-full relative overflow-hidden group border-primary/20 hover:border-primary/40 shadow-sm"
          onClick={addAsset}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-0 group-hover:opacity-100 animate-shimmer" style={{backgroundSize: '200% 100%'}}></div>
          <div className="relative flex items-center justify-center gap-2 z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-70" style={{animationDuration: '3s'}}></div>
              <PlusCircle className="h-4 w-4 text-primary relative z-10" />
            </div>
            <span className="font-medium">Add International Blockchain Asset</span>
          </div>
        </Button>
      </div>
      
      {/* Summary panel with visualization */}
      {assets.length > 0 && (
        <div className="mt-6 p-4 bg-gradient-to-br from-primary/5 via-white/90 to-purple-600/5 dark:from-primary/10 dark:via-black/40 dark:to-purple-600/10 rounded-lg border border-primary/10 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <h4 className="font-medium flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-primary" />
                <span>Cross-Chain Security Summary</span>
              </h4>
              
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex items-center gap-1.5">
                  <ChevronRight className="h-3.5 w-3.5 text-primary" />
                  <span><strong>{assets.length} assets</strong> across <strong>{new Set(assets.map(a => a.blockchain)).size} blockchains</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ChevronRight className="h-3.5 w-3.5 text-primary" />
                  <span>Maximum processing time: <strong>{estimates.time} minutes</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ChevronRight className="h-3.5 w-3.5 text-primary" />
                  <span>Estimated total fee: <strong>{estimates.fee.toFixed(4)}</strong></span>
                </div>
              </div>
              
              <div className="mt-3 space-x-2">
                {Array.from(new Set(assets.map(a => a.blockchain))).map(chain => (
                  <Badge 
                    key={chain} 
                    variant="outline"
                    className="border-primary/20 bg-white/50 dark:bg-black/20"
                  >
                    <div 
                      className="w-2 h-2 rounded-full mr-1.5" 
                      style={{ backgroundColor: getBlockchainColor(chain) }}
                    ></div>
                    {formatBlockchainName(chain)}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Simple distribution visualization */}
            <div className="flex-shrink-0 w-full sm:w-40 h-40">
              <div className="w-full h-full relative rounded-full overflow-hidden border border-primary/20 bg-white/50 dark:bg-black/20 shadow-inner">
                {assets.map((asset, i) => {
                  // Calculate total
                  const total = assets.reduce((sum, a) => sum + a.amount, 0);
                  
                  // Calculate percentages and angles for pie chart
                  const percentage = total > 0 ? (asset.amount / total) * 100 : 0;
                  
                  // Sum up all previous percentages
                  const prevPercentages = assets
                    .slice(0, i)
                    .reduce((sum, a) => sum + (a.amount / total) * 100, 0);
                    
                  return (
                    <div 
                      key={i}
                      className="absolute inset-0"
                      style={{
                        background: `conic-gradient(${getBlockchainColor(asset.blockchain)} ${prevPercentages}%, ${getBlockchainColor(asset.blockchain)} ${prevPercentages + percentage}%, transparent ${prevPercentages + percentage}%)`,
                      }}
                    ></div>
                  );
                })}
                
                {/* Center overlay with security icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-white/70 dark:bg-black/50 flex items-center justify-center shadow-sm">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-purple-600/20 flex items-center justify-center">
                      <Shield className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}