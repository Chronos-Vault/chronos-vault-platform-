import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUp, ArrowDown, Clock } from "lucide-react";
import { type PriceFeed } from '@/services/chainlink-oracle-service';

interface OraclePriceFeedProps {
  feed?: PriceFeed;
  isLoading?: boolean;
}

const OraclePriceFeed: React.FC<OraclePriceFeedProps> = ({ feed, isLoading = false }) => {
  if (isLoading) {
    return (
      <Card className="bg-black/20 border-gray-800">
        <CardContent className="pt-4 pb-4">
          <div className="flex justify-between items-center mb-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-8 w-full mb-2" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-32" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!feed) {
    return (
      <Card className="bg-black/20 border-gray-800">
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-col items-center justify-center h-24">
            <p className="text-gray-400">No price data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isPositiveChange = feed.change24h > 0;
  
  // Format the timestamp to a readable time
  const lastUpdated = new Date(feed.lastUpdate).toLocaleTimeString();

  return (
    <Card className="bg-black/20 border-gray-800 hover:border-[#3F51FF]/50 transition-all">
      <CardContent className="pt-4 pb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="font-medium text-gray-200">{feed.pair}</div>
          <Badge className="bg-[#3F51FF] text-xs">
            {feed.network === 'ton' ? 'TON Oracle' : 'Chainlink Oracle'}
          </Badge>
        </div>
        <div className="text-2xl font-bold mb-2">
          ${typeof feed.value === 'number' ? feed.value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : feed.value}
        </div>
        <div className="flex justify-between text-xs">
          <div className={`flex items-center ${isPositiveChange ? 'text-green-500' : 'text-red-500'}`}>
            {isPositiveChange ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
            {Math.abs(feed.change24h).toFixed(2)}%
          </div>
          <div className="flex items-center text-gray-400">
            <Clock className="h-3 w-3 mr-1" />
            Last update: {lastUpdated}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OraclePriceFeed;