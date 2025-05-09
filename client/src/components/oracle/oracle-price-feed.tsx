import { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowUpCircle, ArrowDownCircle, Clock, Shield, AlertCircle } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BlockchainType } from '@/contexts/multi-chain-context';
import { chainlinkOracleService, PriceFeedData } from '@/services/chainlink-oracle-service';

interface OraclePriceFeedProps {
  asset: string;
  blockchain: BlockchainType;
  refreshInterval?: number; // In milliseconds
  showDetails?: boolean;
  showSources?: boolean;
}

export function OraclePriceFeed({ 
  asset, 
  blockchain, 
  refreshInterval = 15000, // Default 15 seconds
  showDetails = true,
  showSources = false
}: OraclePriceFeedProps) {
  const [priceData, setPriceData] = useState<PriceFeedData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [oracleHealth, setOracleHealth] = useState<boolean>(true);
  
  // Format currency with proper commas and decimals
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: value > 100 ? 0 : 2,
      maximumFractionDigits: value > 100 ? 0 : value > 1 ? 2 : 4
    }).format(value);
  };
  
  // Format time from timestamp
  const formatTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString();
  };
  
  // Calculate time since last update
  const getTimeSinceUpdate = (timestamp: number): string => {
    const secondsAgo = Math.floor((Date.now() - timestamp) / 1000);
    
    if (secondsAgo < 60) {
      return `${secondsAgo} sec ago`;
    } else if (secondsAgo < 3600) {
      return `${Math.floor(secondsAgo / 60)} min ago`;
    } else {
      return `${Math.floor(secondsAgo / 3600)} hr ago`;
    }
  };
  
  // Check if price change is positive
  const isPriceChangePositive = (): boolean => {
    return priceData?.change24h ? priceData.change24h > 0 : false;
  };
  
  // Fetch price data and oracle health
  const fetchOracleData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get oracle health status
      const health = await chainlinkOracleService.checkOracleHealth(asset, blockchain);
      setOracleHealth(health);
      
      if (health) {
        // Get price data
        const data = await chainlinkOracleService.getAssetPrice(asset, blockchain);
        setPriceData(data);
      } else {
        setError('Oracle feed is currently offline');
      }
    } catch (err) {
      console.error('Oracle data fetch error:', err);
      setError('Failed to fetch oracle data');
      setOracleHealth(false);
    } finally {
      setLoading(false);
    }
  };
  
  // Initial fetch and refresh interval
  useEffect(() => {
    fetchOracleData();
    
    // Set up the refresh interval
    const intervalId = setInterval(fetchOracleData, refreshInterval);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [asset, blockchain, refreshInterval]);
  
  // Handle loading state
  if (loading && !priceData) {
    return (
      <Card className="w-full bg-black/40 border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center">
            <div className="w-4 h-4 rounded-full bg-amber-500 animate-pulse mr-2"></div>
            {asset}/USD Oracle
          </CardTitle>
          <CardDescription className="text-xs">
            Fetching oracle data...
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2 flex justify-center">
          <div className="h-16 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-[#3F51FF] border-t-transparent animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Handle error state
  if (error && !priceData) {
    return (
      <Card className="w-full bg-black/40 border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center">
            <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
            {asset}/USD Oracle Error
          </CardTitle>
          <CardDescription className="text-xs text-red-400">
            {error}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2 flex justify-center">
          <div className="h-16 flex flex-col items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
            <button 
              onClick={fetchOracleData} 
              className="text-xs px-3 py-1 bg-[#3F51FF]/20 hover:bg-[#3F51FF]/30 text-[#3F51FF] rounded-full"
            >
              Retry
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Render the price feed card
  return (
    <Card className="w-full bg-black/40 border-gray-800">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center">
            <div className={`w-4 h-4 rounded-full ${oracleHealth ? 'bg-green-500' : 'bg-amber-500'} mr-2`}></div>
            {asset}/USD Oracle
          </CardTitle>
          <Badge variant={oracleHealth ? "outline" : "secondary"} className="h-5 text-xs">
            {oracleHealth ? 'Live' : 'Delayed'}
          </Badge>
        </div>
        <CardDescription className="text-xs flex justify-between">
          <span>Chainlink Price Feed</span>
          {priceData && (
            <span className="text-gray-400">
              <Clock className="h-3 w-3 inline mr-1" /> 
              {getTimeSinceUpdate(priceData.timestamp)}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        {priceData && (
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold tracking-tight">
                {formatCurrency(priceData.price)}
              </div>
              {priceData.change24h !== undefined && (
                <div className={`flex items-center ${isPriceChangePositive() ? 'text-green-500' : 'text-red-500'}`}>
                  {isPriceChangePositive() ? (
                    <ArrowUpCircle className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownCircle className="h-4 w-4 mr-1" />
                  )}
                  <span className="text-sm">
                    {priceData.change24h.toFixed(2)}%
                  </span>
                </div>
              )}
            </div>
            
            {showDetails && (
              <>
                <Separator className="my-2 bg-gray-800" />
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {priceData.twap !== undefined && (
                    <div>
                      <span className="text-gray-400">TWAP (24h): </span>
                      <span>{formatCurrency(priceData.twap)}</span>
                    </div>
                  )}
                  
                  <div>
                    <span className="text-gray-400">Last Update: </span>
                    <span>{formatTime(priceData.timestamp)}</span>
                  </div>
                  
                  <div>
                    <span className="text-gray-400">Decimals: </span>
                    <span>{priceData.decimals}</span>
                  </div>
                  
                  <div>
                    <span className="text-gray-400">Heartbeat: </span>
                    <span>{priceData.heartbeat}s</span>
                  </div>
                </div>
              </>
            )}
            
            {showSources && priceData.sources && priceData.sources.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-gray-400 mb-1">Data Sources:</p>
                <div className="flex flex-wrap gap-1">
                  {priceData.sources.map((source, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {source}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="w-full">
              <div className="w-full flex items-center justify-center text-xs text-gray-500 py-1 hover:bg-gray-900/30 rounded">
                <Shield className="h-3 w-3 mr-1" />
                <span>Secured by Chainlink Oracle Network</span>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-xs">
                This price feed is powered by Chainlink's decentralized oracle network,
                ensuring accurate, tamper-proof financial data from multiple high-quality sources.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
}