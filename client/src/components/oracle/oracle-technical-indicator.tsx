import { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, TrendingDown, Activity, RotateCcw, AlertCircle } from "lucide-react";
import { BlockchainType } from '@/contexts/multi-chain-context';
import { chainlinkOracleService, TechnicalIndicatorData } from '@/services/chainlink-oracle-service';

interface OracleTechnicalIndicatorProps {
  asset: string;
  indicator: 'ma' | 'rsi' | 'macd' | 'volume';
  period: number;
  secondaryPeriod?: number;
  signalPeriod?: number;
  blockchain: BlockchainType;
  refreshInterval?: number; // In milliseconds
}

export function OracleTechnicalIndicator({ 
  asset, 
  indicator, 
  period,
  secondaryPeriod,
  signalPeriod,
  blockchain, 
  refreshInterval = 30000, // Default 30 seconds
}: OracleTechnicalIndicatorProps) {
  const [indicatorData, setIndicatorData] = useState<TechnicalIndicatorData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get indicator name and description
  const getIndicatorInfo = () => {
    switch(indicator) {
      case 'ma':
        return {
          name: `${period}-Day Moving Average`,
          description: 'Average price over the specified period',
          threshold: 0 // No specific threshold
        };
      case 'rsi':
        return {
          name: `RSI (${period})`,
          description: 'Relative Strength Index',
          threshold: 70 // Overbought threshold
        };
      case 'macd':
        return {
          name: `MACD (${period}/${secondaryPeriod}/${signalPeriod})`,
          description: 'Moving Average Convergence Divergence',
          threshold: 0 // Signal line crossover
        };
      case 'volume':
        return {
          name: 'Volume',
          description: 'Trading volume relative to average',
          threshold: 150 // High volume threshold (% of average)
        };
      default:
        return {
          name: 'Technical Indicator',
          description: 'On-chain market data',
          threshold: 0
        };
    }
  };
  
  // Format the indicator value based on type
  const formatIndicatorValue = (value: number): string => {
    switch(indicator) {
      case 'ma':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: value > 100 ? 0 : 2,
          maximumFractionDigits: value > 100 ? 0 : value > 1 ? 2 : 4
        }).format(value);
      case 'rsi':
        return value.toFixed(2);
      case 'macd':
        return value.toFixed(4);
      case 'volume':
        return `${value.toFixed(0)}%`;
      default:
        return value.toString();
    }
  };
  
  // Get icon and color based on indicator value
  const getIndicatorStatus = () => {
    const { threshold } = getIndicatorInfo();
    
    if (!indicatorData) {
      return {
        icon: <Activity className="h-4 w-4" />,
        color: 'text-gray-400',
        bgColor: 'bg-gray-800'
      };
    }
    
    const value = indicatorData.value;
    
    switch(indicator) {
      case 'rsi':
        if (value > 70) {
          return {
            icon: <TrendingUp className="h-4 w-4" />,
            color: 'text-orange-500',
            bgColor: 'bg-orange-500/20',
            label: 'Overbought'
          };
        } else if (value < 30) {
          return {
            icon: <TrendingDown className="h-4 w-4" />,
            color: 'text-blue-500',
            bgColor: 'bg-blue-500/20',
            label: 'Oversold'
          };
        } else {
          return {
            icon: <Activity className="h-4 w-4" />,
            color: 'text-green-500',
            bgColor: 'bg-green-500/20',
            label: 'Neutral'
          };
        }
      case 'macd':
        if (value > 0) {
          return {
            icon: <TrendingUp className="h-4 w-4" />,
            color: 'text-green-500',
            bgColor: 'bg-green-500/20',
            label: 'Bullish'
          };
        } else {
          return {
            icon: <TrendingDown className="h-4 w-4" />,
            color: 'text-red-500',
            bgColor: 'bg-red-500/20',
            label: 'Bearish'
          };
        }
      case 'volume':
        if (value > 150) {
          return {
            icon: <TrendingUp className="h-4 w-4" />,
            color: 'text-purple-500',
            bgColor: 'bg-purple-500/20',
            label: 'High Volume'
          };
        } else if (value < 50) {
          return {
            icon: <TrendingDown className="h-4 w-4" />,
            color: 'text-gray-500',
            bgColor: 'bg-gray-500/20',
            label: 'Low Volume'
          };
        } else {
          return {
            icon: <Activity className="h-4 w-4" />,
            color: 'text-blue-500',
            bgColor: 'bg-blue-500/20',
            label: 'Normal'
          };
        }
      case 'ma':
      default:
        return {
          icon: <Activity className="h-4 w-4" />,
          color: 'text-[#3F51FF]',
          bgColor: 'bg-[#3F51FF]/20',
          label: 'Active'
        };
    }
  };
  
  // Fetch indicator data
  const fetchIndicatorData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await chainlinkOracleService.getTechnicalIndicator(
        asset, 
        indicator, 
        period, 
        blockchain
      );
      
      setIndicatorData(data);
    } catch (err) {
      console.error('Oracle indicator fetch error:', err);
      setError('Failed to fetch indicator data');
    } finally {
      setLoading(false);
    }
  };
  
  // Initial fetch and refresh interval
  useEffect(() => {
    fetchIndicatorData();
    
    // Set up the refresh interval
    const intervalId = setInterval(fetchIndicatorData, refreshInterval);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [asset, indicator, period, blockchain, refreshInterval]);
  
  // Indicator information
  const indicatorInfo = getIndicatorInfo();
  const indicatorStatus = getIndicatorStatus();
  
  // Handle loading state
  if (loading && !indicatorData) {
    return (
      <Card className="w-full bg-black/40 border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">{indicatorInfo.name}</CardTitle>
          <CardDescription className="text-xs">
            Loading indicator data...
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-3 flex justify-center">
          <div className="h-12 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border-2 border-[#3F51FF] border-t-transparent animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Handle error state
  if (error && !indicatorData) {
    return (
      <Card className="w-full bg-black/40 border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">{indicatorInfo.name}</CardTitle>
          <CardDescription className="text-xs text-red-400">
            {error}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-3 flex justify-center">
          <div className="h-12 flex flex-col items-center justify-center">
            <AlertCircle className="w-5 h-5 text-red-500 mb-2" />
            <button 
              onClick={fetchIndicatorData} 
              className="text-xs px-3 py-1 bg-[#3F51FF]/20 hover:bg-[#3F51FF]/30 text-[#3F51FF] rounded-full"
            >
              <RotateCcw className="h-3 w-3 inline mr-1" />
              Retry
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Render the indicator card
  return (
    <Card className="w-full bg-black/40 border-gray-800">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">{indicatorInfo.name}</CardTitle>
          {indicatorData && indicatorStatus.label && (
            <Badge 
              variant="outline" 
              className={`h-5 text-xs ${indicatorStatus.color} border-${indicatorStatus.color}`}
            >
              {indicatorStatus.label}
            </Badge>
          )}
        </div>
        <CardDescription className="text-xs">
          {indicatorInfo.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-3">
        {indicatorData && (
          <div className="space-y-2">
            <div className="flex items-center">
              <div className={`p-2 rounded-full ${indicatorStatus.bgColor} mr-3`}>
                {indicatorStatus.icon}
              </div>
              <div className="text-xl font-bold tracking-tight">
                {formatIndicatorValue(indicatorData.value)}
              </div>
            </div>
            
            <Separator className="my-2 bg-gray-800" />
            
            <div className="flex justify-between text-xs text-gray-400">
              <div>Lookback: {indicatorData.lookbackPeriod} days</div>
              <div>
                {new Date(indicatorData.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}