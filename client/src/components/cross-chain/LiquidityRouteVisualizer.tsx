import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  BarChart3, 
  CircleDollarSign, 
  Clock, 
  Droplets, 
  Info, 
  Loader2, 
  RefreshCw, 
  Shield, 
  Wallet,
  X
} from 'lucide-react';
import { BlockchainType } from '@/lib/cross-chain/interfaces';
import { liquidityOptimizer } from '@/lib/cross-chain/LiquidityOptimizer';
import { crossChainBridge, NETWORK_CONFIG } from '@/lib/cross-chain/bridge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface LiquidityRouteVisualizerProps {
  sourceChain: BlockchainType;
  targetChain: BlockchainType;
  sourceToken: string;
  targetToken: string;
  amount: number;
  onRouteSelected?: (routeInfo: any) => void;
}

export default function LiquidityRouteVisualizer({
  sourceChain,
  targetChain,
  sourceToken,
  targetToken,
  amount,
  onRouteSelected
}: LiquidityRouteVisualizerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [optimizedRoutes, setOptimizedRoutes] = useState<any>({
    fee: null,
    time: null,
    output: null
  });
  const [selectedStrategy, setSelectedStrategy] = useState<'fee' | 'time' | 'output'>('output');
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  
  // Fetch data on component mount or when inputs change
  useEffect(() => {
    const fetchOptimizedRoutes = async () => {
      setIsLoading(true);
      
      try {
        // Fetch all three optimization strategies in parallel
        const [feeOptimized, timeOptimized, outputOptimized, rateData] = await Promise.all([
          liquidityOptimizer.findOptimalRoute(
            sourceChain, targetChain, sourceToken, targetToken, amount, 'fee'
          ),
          liquidityOptimizer.findOptimalRoute(
            sourceChain, targetChain, sourceToken, targetToken, amount, 'time'
          ),
          liquidityOptimizer.findOptimalRoute(
            sourceChain, targetChain, sourceToken, targetToken, amount, 'output'
          ),
          liquidityOptimizer.getExchangeRates(
            sourceChain, targetChain, sourceToken, targetToken
          )
        ]);
        
        setOptimizedRoutes({
          fee: feeOptimized,
          time: timeOptimized,
          output: outputOptimized
        });
        
        setExchangeRate(rateData.rate);
        
        // Notify parent about the selected route
        if (onRouteSelected) {
          onRouteSelected(
            selectedStrategy === 'fee' ? feeOptimized : 
            selectedStrategy === 'time' ? timeOptimized : 
            outputOptimized
          );
        }
      } catch (error) {
        console.error('Error fetching optimized routes:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOptimizedRoutes();
  }, [sourceChain, targetChain, sourceToken, targetToken, amount]);
  
  // Update selected route when strategy changes
  useEffect(() => {
    if (optimizedRoutes[selectedStrategy] && onRouteSelected) {
      onRouteSelected(optimizedRoutes[selectedStrategy]);
    }
  }, [selectedStrategy, optimizedRoutes, onRouteSelected]);
  
  // Format numbers for display
  const formatNumber = (num: number, decimals: number = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  };
  
  // Format time in minutes for display
  const formatTime = (minutes: number) => {
    if (minutes < 1) {
      return 'Less than a minute';
    } else if (minutes < 60) {
      return `${Math.round(minutes)} minute${minutes === 1 ? '' : 's'}`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = Math.round(minutes % 60);
      return `${hours} hour${hours === 1 ? '' : 's'}${remainingMinutes > 0 ? ` ${remainingMinutes} minute${remainingMinutes === 1 ? '' : 's'}` : ''}`;
    }
  };
  
  // Refresh routes manually
  const handleRefresh = () => {
    // Trigger the effect to refetch routes
    setOptimizedRoutes({ fee: null, time: null, output: null });
  };
  
  // Get the currently selected route
  const selectedRoute = optimizedRoutes[selectedStrategy];
  
  // Generate a comparison table for routes
  const RouteComparisonTable = () => {
    if (isLoading || !optimizedRoutes.fee || !optimizedRoutes.time || !optimizedRoutes.output) {
      return (
        <div className="w-full space-y-2 mt-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      );
    }
    
    return (
      <div className="overflow-x-auto mt-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Strategy</th>
              <th className="text-left p-2">Fee</th>
              <th className="text-left p-2">Time</th>
              <th className="text-left p-2">Output</th>
              <th className="text-left p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              className={`border-b hover:bg-gray-50 dark:hover:bg-gray-800 ${selectedStrategy === 'fee' ? 'bg-primary/10' : ''}`}
            >
              <td className="p-2 flex items-center gap-2">
                <CircleDollarSign className="h-4 w-4 text-green-500" />
                <span>Lowest Fee</span>
              </td>
              <td className="p-2 font-medium text-green-500">
                ${formatNumber(optimizedRoutes.fee.totalFee)}
              </td>
              <td className="p-2">
                {formatTime(optimizedRoutes.fee.totalTime)}
              </td>
              <td className="p-2">
                {formatNumber(optimizedRoutes.fee.expectedOutput)} {targetToken}
              </td>
              <td className="p-2">
                <Button 
                  size="sm" 
                  variant={selectedStrategy === 'fee' ? "default" : "outline"}
                  onClick={() => setSelectedStrategy('fee')}
                >
                  {selectedStrategy === 'fee' ? 'Selected' : 'Select'}
                </Button>
              </td>
            </tr>
            <tr 
              className={`border-b hover:bg-gray-50 dark:hover:bg-gray-800 ${selectedStrategy === 'time' ? 'bg-primary/10' : ''}`}
            >
              <td className="p-2 flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span>Fastest</span>
              </td>
              <td className="p-2">
                ${formatNumber(optimizedRoutes.time.totalFee)}
              </td>
              <td className="p-2 font-medium text-blue-500">
                {formatTime(optimizedRoutes.time.totalTime)}
              </td>
              <td className="p-2">
                {formatNumber(optimizedRoutes.time.expectedOutput)} {targetToken}
              </td>
              <td className="p-2">
                <Button 
                  size="sm" 
                  variant={selectedStrategy === 'time' ? "default" : "outline"}
                  onClick={() => setSelectedStrategy('time')}
                >
                  {selectedStrategy === 'time' ? 'Selected' : 'Select'}
                </Button>
              </td>
            </tr>
            <tr 
              className={`hover:bg-gray-50 dark:hover:bg-gray-800 ${selectedStrategy === 'output' ? 'bg-primary/10' : ''}`}
            >
              <td className="p-2 flex items-center gap-2">
                <Wallet className="h-4 w-4 text-purple-500" />
                <span>Best Value</span>
              </td>
              <td className="p-2">
                ${formatNumber(optimizedRoutes.output.totalFee)}
              </td>
              <td className="p-2">
                {formatTime(optimizedRoutes.output.totalTime)}
              </td>
              <td className="p-2 font-medium text-purple-500">
                {formatNumber(optimizedRoutes.output.expectedOutput)} {targetToken}
              </td>
              <td className="p-2">
                <Button 
                  size="sm" 
                  variant={selectedStrategy === 'output' ? "default" : "outline"}
                  onClick={() => setSelectedStrategy('output')}
                >
                  {selectedStrategy === 'output' ? 'Selected' : 'Select'}
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };
  
  // Visualization for the selected route
  const RouteVisualization = () => {
    if (isLoading || !selectedRoute) {
      return (
        <div className="space-y-4 my-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      );
    }
    
    // Get route segments
    const { segments } = selectedRoute;
    
    return (
      <div className="my-4">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {segments.map((segment: any, index: number) => (
            <React.Fragment key={index}>
              {/* Source Pool */}
              <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-3 min-w-[140px]">
                <div className="text-xs text-gray-500 mb-1">
                  {index === 0 ? 'Source' : 'Intermediary'}
                </div>
                <div className="font-medium flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: NETWORK_CONFIG[sourceChain].color }}
                  />
                  <span>
                    {segment.sourceLiquidityPool.protocol} on {segment.sourceLiquidityPool.blockchain}
                  </span>
                </div>
                <div className="text-xs mt-1">
                  <span className="text-gray-500">TVL:</span> ${formatNumber(segment.sourceLiquidityPool.tvl / 1000000)}M
                </div>
              </div>
              
              {/* Bridge */}
              <div className="flex flex-col items-center">
                <div className="text-xs text-gray-500 mb-1">
                  {segment.bridgeProtocol}
                </div>
                <ArrowRight className="text-gray-400" />
                <div className="text-xs text-gray-500 mt-1">
                  ~{formatTime(segment.estimatedTime)}
                </div>
              </div>
              
              {/* Target Pool */}
              <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-3 min-w-[140px]">
                <div className="text-xs text-gray-500 mb-1">
                  {index === segments.length - 1 ? 'Destination' : 'Intermediary'}
                </div>
                <div className="font-medium flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: NETWORK_CONFIG[targetChain].color }}
                  />
                  <span>
                    {segment.targetLiquidityPool.protocol} on {segment.targetLiquidityPool.blockchain}
                  </span>
                </div>
                <div className="text-xs mt-1">
                  <span className="text-gray-500">TVL:</span> ${formatNumber(segment.targetLiquidityPool.tvl / 1000000)}M
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <CircleDollarSign className="h-4 w-4 text-green-500" />
                <span className="font-medium">Total Fee</span>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Includes protocol fees, bridge fees, and gas costs</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="text-xl font-semibold mt-1">
              ${formatNumber(selectedRoute.totalFee, 4)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {formatNumber(selectedRoute.totalFee / amount * 100, 2)}% of transfer amount
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Estimated Time</span>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Total time for transfer to complete across all chains</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="text-xl font-semibold mt-1">
              {formatTime(selectedRoute.totalTime)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Estimated completion at {new Date(Date.now() + selectedRoute.totalTime * 60 * 1000).toLocaleTimeString()}
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-purple-500" />
                <span className="font-medium">Expected Output</span>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Amount you'll receive after fees and slippage</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="text-xl font-semibold mt-1">
              {formatNumber(selectedRoute.expectedOutput, 4)} {targetToken}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Rate: 1 {sourceToken} = {formatNumber(exchangeRate || 0, 4)} {targetToken}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">
          Optimized Routes
        </CardTitle>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs 
          defaultValue="comparison" 
          className="w-full"
        >
          <TabsList className="mb-4">
            <TabsTrigger value="comparison">Route Comparison</TabsTrigger>
            <TabsTrigger value="visualization">Visualization</TabsTrigger>
          </TabsList>
          
          <TabsContent value="comparison">
            <RouteComparisonTable />
          </TabsContent>
          
          <TabsContent value="visualization">
            <RouteVisualization />
          </TabsContent>
        </Tabs>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              <span>Protected Transfer</span>
            </Badge>
            
            <Badge variant="outline" className="flex items-center gap-1">
              <BarChart3 className="h-3 w-3" />
              <span>Price Impact: {selectedRoute ? formatNumber(selectedRoute.estimatedSlippage * 100, 2) : '--'}%</span>
            </Badge>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-gray-500"
                  onClick={() => {
                    // Show detailed technical information in a dialog
                    if (selectedRoute) {
                      setShowDetailsDialog(true);
                    }
                  }}
                >
                  Advanced Details
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click to see detailed technical information about this route</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle>Route Technical Details</DialogTitle>
                  <DialogClose asChild>
                    <Button variant="ghost" size="icon">
                      <X className="h-4 w-4" />
                    </Button>
                  </DialogClose>
                </div>
                <DialogDescription>
                  Detailed information about the selected route
                </DialogDescription>
              </DialogHeader>
              
              {selectedRoute && (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-medium">Strategy:</div>
                    <div className="capitalize">{selectedStrategy}</div>
                    
                    <div className="font-medium">Source Chain:</div>
                    <div>{sourceChain}</div>
                    
                    <div className="font-medium">Target Chain:</div>
                    <div>{targetChain}</div>
                    
                    <div className="font-medium">Source Token:</div>
                    <div>{sourceToken}</div>
                    
                    <div className="font-medium">Target Token:</div>
                    <div>{targetToken}</div>
                    
                    <div className="font-medium">Amount:</div>
                    <div>{formatNumber(amount)} {sourceToken}</div>
                    
                    <div className="font-medium">Fee:</div>
                    <div>${formatNumber(selectedRoute.totalFee, 4)}</div>
                    
                    <div className="font-medium">Estimated Time:</div>
                    <div>{formatTime(selectedRoute.totalTime)}</div>
                    
                    <div className="font-medium">Price Impact:</div>
                    <div>{formatNumber(selectedRoute.estimatedSlippage * 100, 2)}%</div>
                    
                    <div className="font-medium">Expected Output:</div>
                    <div>{formatNumber(selectedRoute.expectedOutput, 4)} {targetToken}</div>
                    
                    <div className="font-medium">Exchange Rate:</div>
                    <div>1 {sourceToken} = {formatNumber(exchangeRate || 0, 4)} {targetToken}</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="font-medium border-b pb-1">Route Segments:</div>
                    {selectedRoute.segments.map((segment: any, index: number) => (
                      <div key={index} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md text-sm">
                        <div className="font-medium">Segment {index + 1}:</div>
                        <div className="grid grid-cols-2 gap-1 mt-1">
                          <div className="text-gray-500">Source:</div>
                          <div>{segment.sourceLiquidityPool.protocol}</div>
                          
                          <div className="text-gray-500">Target:</div>
                          <div>{segment.targetLiquidityPool.protocol}</div>
                          
                          <div className="text-gray-500">Bridge:</div>
                          <div>{segment.bridgeProtocol}</div>
                          
                          <div className="text-gray-500">Fee:</div>
                          <div>{formatNumber(segment.fee, 2)}%</div>
                          
                          <div className="text-gray-500">Time:</div>
                          <div>{formatTime(segment.estimatedTime)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <DialogFooter>
                <Button size="sm" onClick={() => setShowDetailsDialog(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}