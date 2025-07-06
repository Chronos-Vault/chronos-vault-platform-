import React from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, LineChart, HelpCircle, Info } from "lucide-react";
import { TechnicalIndicator } from '@/services/chainlink-oracle-service';

interface OracleTechnicalIndicatorProps {
  indicator?: TechnicalIndicator;
  secondaryIndicator?: TechnicalIndicator;
  isLoading?: boolean;
  type: TechnicalIndicator['type'];
}

export function OracleTechnicalIndicator({ 
  indicator, 
  secondaryIndicator,
  isLoading = false, 
  type 
}: OracleTechnicalIndicatorProps) {
  // Helper functions
  const formatValue = (value?: number): string => {
    if (value === undefined) return 'N/A';
    
    if (type === 'RSI') {
      return value.toFixed(2);
    }
    
    if (type === 'MACD') {
      return value.toFixed(2);
    }
    
    if (type === 'MA' || type === 'EMA') {
      return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    }
    
    return value.toFixed(2);
  };
  
  const formatUpdateTime = (timestamp?: number): string => {
    if (!timestamp) return 'N/A';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.round(diffMs / 1000);
    
    if (diffSecs < 60) return `${diffSecs} seconds ago`;
    if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)} minutes ago`;
    if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)} hours ago`;
    return `${Math.floor(diffSecs / 86400)} days ago`;
  };
  
  // Get display name based on indicator type
  const getIndicatorName = (): string => {
    switch (type) {
      case 'RSI':
        return 'Relative Strength Index';
      case 'MACD':
        return 'MACD';
      case 'MA':
        return 'Moving Average';
      case 'EMA':
        return 'Exponential MA';
      case 'Bollinger':
        return 'Bollinger Bands';
      default:
        return 'Technical Indicator';
    }
  };
  
  // Get status badge based on indicator type and value
  const getStatusBadge = () => {
    if (!indicator) return null;
    
    const status = indicator.status;
    
    const getBadgeClass = () => {
      switch (status) {
        case 'bullish':
          return 'bg-green-600 text-white';
        case 'bearish':
          return 'bg-red-600 text-white';
        case 'neutral':
          return 'bg-gray-600 text-white';
        default:
          return 'bg-gray-600 text-white';
      }
    };
    
    const getStatusIcon = () => {
      switch (status) {
        case 'bullish':
          return <TrendingUp className="h-3 w-3 mr-1" />;
        case 'bearish':
          return <TrendingDown className="h-3 w-3 mr-1" />;
        default:
          return null;
      }
    };
    
    return (
      <Badge className={cn("flex items-center", getBadgeClass())}>
        {getStatusIcon()}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };
  
  // Get a description of what the indicator means
  const getIndicatorDescription = (): string => {
    if (!indicator) return '';
    
    switch (type) {
      case 'RSI':
        const rsiValue = indicator.value;
        if (rsiValue > 70) return 'Potentially overbought';
        if (rsiValue < 30) return 'Potentially oversold';
        return 'Neutral market conditions';
        
      case 'MACD':
        return indicator.status === 'bullish' 
          ? 'Bullish momentum' 
          : indicator.status === 'bearish' 
            ? 'Bearish momentum' 
            : 'Neutral momentum';
        
      case 'MA':
        if (!secondaryIndicator) return 'Moving average price level';
        
        const ma1 = indicator.value;
        const ma2 = secondaryIndicator.value;
        
        if (ma1 > ma2) {
          return `${indicator.params.period}-day MA above ${secondaryIndicator.params.period}-day MA (bullish)`;
        } else if (ma1 < ma2) {
          return `${indicator.params.period}-day MA below ${secondaryIndicator.params.period}-day MA (bearish)`;
        } else {
          return 'Moving averages at similar levels';
        }
        
      case 'EMA':
        return 'Exponential moving average price level';
        
      default:
        return '';
    }
  };
  
  // Get the period of the indicator
  const getIndicatorPeriod = (): string => {
    if (!indicator || !indicator.params.period) return '';
    return `${indicator.params.period}-Period`;
  };
  
  // Check if the indicator is "stale" (old data)
  const isStaleData = (): boolean => {
    if (!indicator || !indicator.timestamp) return false;
    
    const now = new Date();
    const timestamp = new Date(indicator.timestamp);
    const diffHours = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60);
    
    // Consider data stale if it's more than 12 hours old
    return diffHours > 12;
  };
  
  if (isLoading) {
    return (
      <div className="bg-black/30 border border-gray-800 rounded-lg p-4 h-32 flex items-center justify-center">
        <div className="h-6 w-6 border-4 border-t-transparent border-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!indicator) {
    return (
      <div className="bg-black/30 border border-gray-800 rounded-lg p-4 h-32 flex flex-col items-center justify-center">
        <p className="text-gray-400">No {getIndicatorName()} data available</p>
        <p className="text-xs text-gray-500 mt-1">Select a different asset or network</p>
      </div>
    );
  }

  return (
    <div className="bg-black/30 border border-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center text-sm text-gray-400">
            <LineChart className="h-4 w-4 mr-1 text-indigo-400" />
            {getIndicatorName()}
            {getIndicatorPeriod() && (
              <span className="ml-1 text-xs bg-gray-800 px-1.5 py-0.5 rounded">
                {getIndicatorPeriod()}
              </span>
            )}
          </div>
          <div className="text-2xl font-semibold mt-1">
            {formatValue(indicator.value)}
          </div>
        </div>
        
        {getStatusBadge()}
      </div>
      
      {secondaryIndicator && (
        <div className="mt-2 pt-2 border-t border-gray-800">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-400">
              {secondaryIndicator.params.period}-Period
            </div>
            <div className="font-medium">
              {formatValue(secondaryIndicator.value)}
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-3">
        <p className="text-xs text-gray-400 flex items-start">
          <Info className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
          {getIndicatorDescription()}
        </p>
      </div>
      
      <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
        <div className="flex items-center">
          Updated {formatUpdateTime(indicator.timestamp)}
        </div>
        
        {isStaleData() && (
          <Badge variant="outline" className="text-amber-500 border-amber-900/50 text-xs">
            Stale Data
          </Badge>
        )}
      </div>
    </div>
  );
}

export default OracleTechnicalIndicator;