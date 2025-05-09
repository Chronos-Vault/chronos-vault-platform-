import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActionRecommendation } from '@/services/sentiment-analysis-service';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  ShoppingCart,
  Clock,
  MinusCircle,
  PlusCircle,
  HandCoins,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SentimentRecommendationsProps {
  recommendations: ActionRecommendation[];
  isLoading?: boolean;
  asset?: string;
  onlyShowLatest?: boolean;
}

export function SentimentRecommendations({
  recommendations,
  isLoading = false,
  asset = 'BTC',
  onlyShowLatest = false
}: SentimentRecommendationsProps) {
  const [displayedRecommendations, setDisplayedRecommendations] = useState<ActionRecommendation[]>([]);
  
  // Update displayed recommendations when props change
  useEffect(() => {
    if (recommendations && recommendations.length > 0) {
      if (onlyShowLatest) {
        // Show only the highest confidence recommendation
        const sortedByConfidence = [...recommendations].sort((a, b) => b.confidence - a.confidence);
        setDisplayedRecommendations([sortedByConfidence[0]]);
      } else {
        setDisplayedRecommendations(recommendations);
      }
    } else {
      setDisplayedRecommendations([]);
    }
  }, [recommendations, onlyShowLatest]);
  
  // Get icon for action
  const getActionIcon = (action: string, className: string = "h-4 w-4 mr-2") => {
    switch (action) {
      case 'buy':
        return <ShoppingCart className={className} />;
      case 'sell':
        return <HandCoins className={className} />;
      case 'hold':
        return <Minus className={className} />;
      case 'reduce':
        return <MinusCircle className={className} />;
      case 'increase':
        return <PlusCircle className={className} />;
      default:
        return <AlertTriangle className={className} />;
    }
  };
  
  // Get color for action
  const getActionColor = (action: string): string => {
    switch (action) {
      case 'buy':
      case 'increase':
        return 'bg-green-600 hover:bg-green-700';
      case 'sell':
      case 'reduce':
        return 'bg-red-600 hover:bg-red-700';
      case 'hold':
        return 'bg-blue-600 hover:bg-blue-700';
      default:
        return 'bg-gray-600 hover:bg-gray-700';
    }
  };
  
  // Format allocation display
  const formatAllocation = (allocation?: number): string => {
    if (allocation === undefined) return '';
    
    const prefix = allocation > 0 ? '+' : '';
    return `${prefix}${allocation}%`;
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <Card className="bg-black/40 border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Action Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex justify-center items-center h-40">
            <div className="h-6 w-6 border-4 border-t-transparent border-indigo-500 rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Render no recommendations state
  if (!displayedRecommendations.length) {
    return (
      <Card className="bg-black/40 border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Action Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col items-center justify-center h-40 text-gray-500">
            <AlertTriangle className="h-8 w-8 mb-2 text-gray-600" />
            <p>No recommendations available</p>
            <p className="text-xs mt-1">Check back later for updates</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-black/40 border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Action Recommendations</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {displayedRecommendations.map((recommendation) => (
            <div 
              key={recommendation.id}
              className="border border-gray-800 rounded-md overflow-hidden"
            >
              <div className={cn(
                "p-3 flex justify-between items-center",
                getActionColor(recommendation.action)
              )}>
                <div className="flex items-center">
                  {getActionIcon(recommendation.action)}
                  <span className="font-medium capitalize">{recommendation.action}</span>
                  <span className="ml-2 text-xs opacity-80">{asset}</span>
                </div>
                
                {recommendation.suggestedAllocation !== undefined && (
                  <Badge variant="outline" className="bg-black/30 border-white/20">
                    {formatAllocation(recommendation.suggestedAllocation)}
                  </Badge>
                )}
              </div>
              
              <div className="p-3">
                <p className="text-sm text-gray-300 mb-3">{recommendation.reasoning}</p>
                
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {recommendation.timeframe}
                  </div>
                  
                  <div className="flex items-center">
                    <span>Confidence:</span>
                    <div className="ml-2 w-16 bg-gray-700 h-1.5 rounded overflow-hidden">
                      <div 
                        className="bg-indigo-500 h-full"
                        style={{ width: `${recommendation.confidence * 100}%` }}
                      ></div>
                    </div>
                    <span className="ml-1">{Math.round(recommendation.confidence * 100)}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default SentimentRecommendations;