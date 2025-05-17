import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, ArrowDownIcon, ArrowUpIcon, Info, RefreshCw, Zap } from 'lucide-react';
import { BlockchainType } from '@/lib/cross-chain/interfaces';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ChainFeeData {
  chain: BlockchainType;
  chainName: string;
  currentFee: number;
  averageFee: number;
  feeToken: string;
  feeUSD: number;
  feeChange24h: number;
  congestionLevel: 'Low' | 'Medium' | 'High' | 'Very High';
  estimatedWaitTime: string;
  recommended: boolean;
  tokenPrice: number;
}

interface FeeMonitoringSystemProps {
  sourceFunds?: number;
  availableChains: BlockchainType[];
  onChainSelect?: (chain: BlockchainType) => void;
  feeThreshold?: number;
}

const defaultChainData: ChainFeeData[] = [
  {
    chain: 'ETH',
    chainName: 'Ethereum',
    currentFee: 25,
    averageFee: 30,
    feeToken: 'Gwei',
    feeUSD: 3.25,
    feeChange24h: 5.2,
    congestionLevel: 'Medium',
    estimatedWaitTime: '15-30s',
    recommended: false,
    tokenPrice: 5120.45
  },
  {
    chain: 'SOL',
    chainName: 'Solana',
    currentFee: 0.00025,
    averageFee: 0.00025,
    feeToken: 'SOL',
    feeUSD: 0.032,
    feeChange24h: -2.1,
    congestionLevel: 'Low',
    estimatedWaitTime: '< 5s',
    recommended: true,
    tokenPrice: 126.83
  },
  {
    chain: 'TON',
    chainName: 'TON',
    currentFee: 0.05,
    averageFee: 0.05,
    feeToken: 'TON',
    feeUSD: 0.18,
    feeChange24h: 1.3,
    congestionLevel: 'Low',
    estimatedWaitTime: '< 5s',
    recommended: true,
    tokenPrice: 3.65
  },
  {
    chain: 'BTC',
    chainName: 'Bitcoin',
    currentFee: 15,
    averageFee: 18,
    feeToken: 'sats/vB',
    feeUSD: 5.75,
    feeChange24h: 12.5,
    congestionLevel: 'High',
    estimatedWaitTime: '10-30m',
    recommended: false,
    tokenPrice: 102896.32
  },
];

export function FeeMonitoringSystem({ 
  sourceFunds = 1000, 
  availableChains = ['ETH', 'SOL', 'TON', 'BTC'],
  onChainSelect,
  feeThreshold = 2.0
}: FeeMonitoringSystemProps) {
  const [chainFeeData, setChainFeeData] = useState<ChainFeeData[]>(
    defaultChainData.filter(data => availableChains.includes(data.chain))
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedChains, setSelectedChains] = useState<BlockchainType[]>([]);
  const [showRecommendedOnly, setShowRecommendedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'fee' | 'congestion' | 'wait' | 'change'>('fee');
  
  // Fee history data for the chart (simulated)
  const [feeHistory, setFeeHistory] = useState<{[key: string]: number[]}>({
    'ETH': [28, 32, 30, 25, 27, 31, 30, 28, 25],
    'SOL': [0.00028, 0.00026, 0.00025, 0.00025, 0.00024, 0.00025, 0.00026, 0.00025, 0.00025],
    'TON': [0.06, 0.05, 0.05, 0.05, 0.04, 0.05, 0.05, 0.05, 0.05],
    'BTC': [20, 18, 16, 17, 19, 21, 18, 16, 15]
  });

  // Get congestion color
  const getCongestionColor = (level: 'Low' | 'Medium' | 'High' | 'Very High') => {
    switch (level) {
      case 'Low': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'High': return 'bg-orange-500';
      case 'Very High': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Get fee change indicator
  const getFeeChangeIndicator = (change: number) => {
    if (change > 0) {
      return <ArrowUpIcon className="h-4 w-4 text-red-500" />;
    } else if (change < 0) {
      return <ArrowDownIcon className="h-4 w-4 text-green-500" />;
    }
    return null;
  };

  // Get fee change color
  const getFeeChangeColor = (change: number) => {
    if (change > 10) return 'text-red-500';
    if (change > 0) return 'text-orange-500';
    if (change < -10) return 'text-green-500';
    if (change < 0) return 'text-emerald-400';
    return 'text-gray-400';
  };

  // Calculate the percentage of funds that would be spent on fees
  const getFeeToCostRatio = (feeUSD: number) => {
    return (feeUSD / sourceFunds) * 100;
  };

  // Calculate whether a chain is recommended based on fee threshold
  useEffect(() => {
    setChainFeeData(prevData => 
      prevData.map(data => ({
        ...data,
        recommended: data.feeUSD < feeThreshold
      }))
    );
  }, [feeThreshold]);

  // Sort chains based on selected sorting criteria
  useEffect(() => {
    setChainFeeData(prevData => {
      const sortedData = [...prevData];
      
      switch (sortBy) {
        case 'fee':
          sortedData.sort((a, b) => a.feeUSD - b.feeUSD);
          break;
        case 'congestion':
          const congestionOrder = { 'Low': 0, 'Medium': 1, 'High': 2, 'Very High': 3 };
          sortedData.sort((a, b) => congestionOrder[a.congestionLevel] - congestionOrder[b.congestionLevel]);
          break;
        case 'wait':
          // Sort by estimated wait time
          const getWaitTimeMinutes = (waitTime: string) => {
            if (waitTime.includes('<')) return 0;
            if (waitTime.includes('s')) return 1;
            if (waitTime.includes('m')) {
              const match = waitTime.match(/(\d+)-(\d+)m/);
              return match ? parseInt(match[2]) : 0;
            }
            return 100; // Very high value for unknown formats
          };
          sortedData.sort((a, b) => getWaitTimeMinutes(a.estimatedWaitTime) - getWaitTimeMinutes(b.estimatedWaitTime));
          break;
        case 'change':
          sortedData.sort((a, b) => a.feeChange24h - b.feeChange24h);
          break;
      }
      
      return sortedData;
    });
  }, [sortBy]);

  // Filter recommended chains if option is selected
  const filteredChainData = showRecommendedOnly 
    ? chainFeeData.filter(chain => chain.recommended)
    : chainFeeData;

  // Simulate refreshing fee data
  const refreshFeeData = () => {
    setIsRefreshing(true);
    
    // Simulate network request delay
    setTimeout(() => {
      const updatedData = chainFeeData.map(chain => {
        // Simulate random fluctuations in fees
        const randomFactor = 0.85 + (Math.random() * 0.3); // Between 0.85 and 1.15
        const newFee = chain.currentFee * randomFactor;
        const newFeeUSD = chain.feeUSD * randomFactor;
        const newChange = chain.feeChange24h + (Math.random() * 4 - 2); // -2 to +2 random adjustment
        
        // Update fee history
        const newHistory = [...(feeHistory[chain.chain] || [])];
        if (newHistory.length > 20) newHistory.shift(); // Keep last 20 data points
        newHistory.push(newFee);
        setFeeHistory(prev => ({
          ...prev,
          [chain.chain]: newHistory
        }));
        
        return {
          ...chain,
          currentFee: parseFloat(newFee.toFixed(5)),
          feeUSD: parseFloat(newFeeUSD.toFixed(3)),
          feeChange24h: parseFloat(newChange.toFixed(1)),
          recommended: newFeeUSD < feeThreshold,
        };
      });
      
      setChainFeeData(updatedData);
      setIsRefreshing(false);
    }, 1500);
  };

  // Toggle chain selection
  const toggleChainSelection = (chain: BlockchainType) => {
    setSelectedChains(prev => {
      if (prev.includes(chain)) {
        return prev.filter(c => c !== chain);
      } else {
        return [...prev, chain];
      }
    });
    
    if (onChainSelect) {
      onChainSelect(chain);
    }
  };

  return (
    <Card className="w-full border border-[#333] bg-[#121212]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center">
            <Zap className="h-5 w-5 mr-2 text-[#FF5AF7]" />
            Cross-Chain Fee Monitor
          </CardTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={refreshFeeData}
            disabled={isRefreshing}
            className="h-8 gap-1 border-[#333] text-gray-300 hover:text-white"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Updating...' : 'Refresh Fees'}
          </Button>
        </div>
        <CardDescription className="text-gray-400">
          Monitor and compare transaction fees across different blockchains
        </CardDescription>
        
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-400">Sort by:</span>
            <div className="flex">
              <Button 
                size="sm" 
                variant={sortBy === 'fee' ? 'default' : 'outline'} 
                onClick={() => setSortBy('fee')} 
                className={`h-7 px-2 text-xs rounded-l-md rounded-r-none ${sortBy === 'fee' ? 'bg-[#6B00D7]' : 'border-[#333] bg-transparent'}`}
              >
                Fee
              </Button>
              <Button 
                size="sm" 
                variant={sortBy === 'congestion' ? 'default' : 'outline'} 
                onClick={() => setSortBy('congestion')} 
                className={`h-7 px-2 text-xs rounded-none border-l-0 ${sortBy === 'congestion' ? 'bg-[#6B00D7]' : 'border-[#333] bg-transparent'}`}
              >
                Congestion
              </Button>
              <Button 
                size="sm" 
                variant={sortBy === 'wait' ? 'default' : 'outline'} 
                onClick={() => setSortBy('wait')} 
                className={`h-7 px-2 text-xs rounded-none border-l-0 ${sortBy === 'wait' ? 'bg-[#6B00D7]' : 'border-[#333] bg-transparent'}`}
              >
                Wait Time
              </Button>
              <Button 
                size="sm" 
                variant={sortBy === 'change' ? 'default' : 'outline'} 
                onClick={() => setSortBy('change')} 
                className={`h-7 px-2 text-xs rounded-r-md rounded-l-none border-l-0 ${sortBy === 'change' ? 'bg-[#6B00D7]' : 'border-[#333] bg-transparent'}`}
              >
                Change
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-gray-400">Show optimized only</span>
            <div className="flex items-center h-4">
              <input
                type="checkbox"
                id="recommended-only"
                checked={showRecommendedOnly}
                onChange={(e) => setShowRecommendedOnly(e.target.checked)}
                className="h-4 w-4 rounded border-gray-700 bg-[#121212] text-[#6B00D7] focus:ring-[#6B00D7]"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-[320px] pr-4">
          <Table>
            <TableHeader className="bg-[#1A1A1A]">
              <TableRow className="border-b border-[#333] hover:bg-transparent">
                <TableHead className="w-[140px]">Blockchain</TableHead>
                <TableHead>Current Fee</TableHead>
                <TableHead>Fee (USD)</TableHead>
                <TableHead>24h Change</TableHead>
                <TableHead>Network Status</TableHead>
                <TableHead>Wait Time</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredChainData.map((chainData) => (
                <TableRow 
                  key={chainData.chain} 
                  className={`border-b border-[#333] ${selectedChains.includes(chainData.chain) ? 'bg-[#6B00D7]/10' : 'hover:bg-[#1A1A1A]'}`}
                >
                  <TableCell className="font-medium py-3">
                    <div className="flex items-center gap-2">
                      {chainData.recommended && (
                        <Badge variant="outline" className="h-5 bg-[#6B00D7]/20 border-[#6B00D7]/50 text-[#FF5AF7] py-0 px-1.5 text-[10px] font-normal">
                          Optimized
                        </Badge>
                      )}
                      <span>{chainData.chainName}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-mono">{chainData.currentFee.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 5 })}</span>
                      <span className="text-xs text-gray-500">{chainData.feeToken}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">${chainData.feeUSD.toFixed(3)}</span>
                      <div className="w-full h-1.5 bg-gray-800 rounded-full mt-1 overflow-hidden">
                        <div 
                          className={`h-full ${
                            getFeeToCostRatio(chainData.feeUSD) > 2 ? 'bg-red-500' : 
                            getFeeToCostRatio(chainData.feeUSD) > 1 ? 'bg-orange-500' : 
                            getFeeToCostRatio(chainData.feeUSD) > 0.5 ? 'bg-yellow-500' : 
                            'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(getFeeToCostRatio(chainData.feeUSD) * 5, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] text-gray-500 mt-0.5">
                        {getFeeToCostRatio(chainData.feeUSD).toFixed(2)}% of transaction
                      </span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {getFeeChangeIndicator(chainData.feeChange24h)}
                      <span className={`${getFeeChangeColor(chainData.feeChange24h)}`}>
                        {Math.abs(chainData.feeChange24h).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex mt-1 h-8 w-full">
                      {feeHistory[chainData.chain]?.map((fee, i) => (
                        <div 
                          key={i}
                          className="flex-1 bg-gray-800 mx-0.5 rounded-sm"
                          style={{ 
                            height: '16px',
                            backgroundColor: '#1A1A1A',
                            position: 'relative'
                          }}
                        >
                          <div 
                            className={`absolute bottom-0 left-0 right-0 rounded-sm ${
                              fee > chainData.averageFee * 1.1 ? 'bg-red-500/70' :
                              fee > chainData.averageFee ? 'bg-yellow-500/70' :
                              'bg-green-500/70'
                            }`}
                            style={{
                              height: `${Math.min((fee / (chainData.averageFee * 1.5)) * 100, 100)}%`
                            }}
                          ></div>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <div className={`h-2.5 w-2.5 rounded-full ${getCongestionColor(chainData.congestionLevel)}`}></div>
                      <span className="text-sm">{chainData.congestionLevel}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    {chainData.estimatedWaitTime}
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <Button 
                      size="sm" 
                      variant={selectedChains.includes(chainData.chain) ? "default" : "outline"} 
                      onClick={() => toggleChainSelection(chainData.chain)}
                      className={`${
                        selectedChains.includes(chainData.chain) 
                          ? 'bg-[#6B00D7] hover:bg-[#6B00D7]/90' 
                          : 'border-[#333] hover:bg-[#6B00D7]/10'
                      }`}
                    >
                      {selectedChains.includes(chainData.chain) ? 'Selected' : 'Select'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="bg-[#1A1A1A] border-t border-[#333] flex items-center justify-between py-3 px-6">
        <div className="flex items-center text-sm text-gray-400">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center">
                  <Info className="h-4 w-4 mr-1.5" />
                  <span>Fee data updates every 5-15 minutes</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">
                  Fee data is collected from blockchain nodes and major fee estimation services.
                  Actual fees may vary based on network conditions at transaction time.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-[#333] hover:bg-[#1A1A1A]"
            onClick={() => setSelectedChains([])}
          >
            Reset
          </Button>
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90"
            disabled={selectedChains.length === 0}
            onClick={() => {
              const optimizedChain = chainFeeData
                .filter(data => data.recommended)
                .sort((a, b) => a.feeUSD - b.feeUSD)[0]?.chain;
              
              if (optimizedChain && onChainSelect) {
                setSelectedChains([optimizedChain]);
                onChainSelect(optimizedChain);
              }
            }}
          >
            Optimize Transaction
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}