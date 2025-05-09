import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";
import { PriceFeed } from '@/services/chainlink-oracle-service';

interface OraclePriceFeedProps {
  feed?: PriceFeed;
  isLoading?: boolean;
  highlighted?: boolean;
}

export function OraclePriceFeed({ feed, isLoading = false, highlighted = false }: OraclePriceFeedProps) {
  // Format timestamp
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
  
  // Format currency with appropriate decimals
  const formatCurrency = (value?: number, decimals: number = 2): string => {
    if (value === undefined) return 'N/A';
    
    // If value is very large, don't use decimal places
    if (value > 1000) {
      return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    }
    
    // If value is small, use more decimal places
    if (value < 1) {
      return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD',
        minimumFractionDigits: 4,
        maximumFractionDigits: 4
      }).format(value);
    }
    
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className={cn(
        "border rounded-lg p-4 h-32 flex items-center justify-center",
        highlighted ? "bg-indigo-900/10 border-indigo-900/50" : "bg-black/30 border-gray-800"
      )}>
        <div className="h-6 w-6 border-4 border-t-transparent border-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!feed) {
    return (
      <div className={cn(
        "border rounded-lg p-4 h-32 flex flex-col items-center justify-center",
        highlighted ? "bg-indigo-900/10 border-indigo-900/50" : "bg-black/30 border-gray-800"
      )}>
        <p className="text-gray-400">No price feed data available</p>
        {highlighted && (
          <p className="text-xs text-gray-500 mt-1">Select a different asset or network</p>
        )}
      </div>
    );
  }

  const isPositive = feed.change24h >= 0;

  return (
    <div className={cn(
      "border rounded-lg p-4",
      highlighted 
        ? "bg-indigo-900/10 border-indigo-900/30" 
        : "bg-black/30 border-gray-800"
    )}>
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm text-gray-400">{feed.name}</div>
          <div className="text-2xl font-semibold mt-1">
            {formatCurrency(feed.value)}
          </div>
        </div>
        
        <Badge className={cn(
          "flex items-center",
          isPositive ? "bg-green-600 text-white" : "bg-red-600 text-white"
        )}>
          {isPositive 
            ? <ArrowUpRight className="h-3 w-3 mr-1" /> 
            : <ArrowDownRight className="h-3 w-3 mr-1" />}
          {Math.abs(feed.change24h).toFixed(2)}%
        </Badge>
      </div>
      
      <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
        <div className="flex items-center">
          <Clock className="h-3 w-3 mr-1" /> 
          Updated {formatUpdateTime(feed.timestamp)}
        </div>
        
        <div>
          Network: {feed.network}
        </div>
      </div>
    </div>
  );
}

export default OraclePriceFeed;