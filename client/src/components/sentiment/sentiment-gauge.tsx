import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SentimentLevel } from '@/services/sentiment-analysis-service';
import { TrendingUp, TrendingDown, Minus, ArrowRight, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SentimentGaugeProps {
  level: SentimentLevel;
  score: number;
  previousScore?: number;
  confidence: number;
  isLoading?: boolean;
  showTrend?: boolean;
}

export function SentimentGauge({
  level,
  score,
  previousScore,
  confidence,
  isLoading = false,
  showTrend = true
}: SentimentGaugeProps) {
  // Calculate rotate angle (-90 to 90 degrees) from score (-100 to 100)
  const getRotateAngle = (score: number): number => {
    return (score / 100) * 90;
  };
  
  // Get sentiment color based on level
  const getSentimentColor = (): string => {
    switch (level) {
      case 'extremely_bearish':
        return 'rgb(220, 38, 38)'; // red-600
      case 'bearish':
        return 'rgb(248, 113, 113)'; // red-400
      case 'slightly_bearish':
        return 'rgb(251, 146, 60)'; // orange-400
      case 'neutral':
        return 'rgb(161, 161, 170)'; // zinc-400
      case 'slightly_bullish':
        return 'rgb(134, 239, 172)'; // green-300
      case 'bullish':
        return 'rgb(34, 197, 94)'; // green-500
      case 'extremely_bullish':
        return 'rgb(22, 163, 74)'; // green-600
      default:
        return 'rgb(161, 161, 170)'; // zinc-400
    }
  };
  
  // Get sentiment text
  const getSentimentText = (): string => {
    switch (level) {
      case 'extremely_bearish':
        return 'Extremely Bearish';
      case 'bearish':
        return 'Bearish';
      case 'slightly_bearish':
        return 'Slightly Bearish';
      case 'neutral':
        return 'Neutral';
      case 'slightly_bullish':
        return 'Slightly Bullish';
      case 'bullish':
        return 'Bullish';
      case 'extremely_bullish':
        return 'Extremely Bullish';
      default:
        return 'Neutral';
    }
  };
  
  // Get trend icon and text
  const getTrendInfo = () => {
    if (!previousScore) return { icon: null, text: 'No change' };
    
    const diff = score - previousScore;
    const absDiff = Math.abs(diff).toFixed(1);
    
    if (Math.abs(diff) < 3) {
      return { 
        icon: <Minus className="h-4 w-4 text-gray-400" />,
        text: `Stable (${absDiff})`
      };
    }
    
    if (diff > 0) {
      return { 
        icon: <TrendingUp className="h-4 w-4 text-green-500" />,
        text: `Improving (+${absDiff})`
      };
    }
    
    return { 
      icon: <TrendingDown className="h-4 w-4 text-red-500" />,
      text: `Deteriorating (-${absDiff})`
    };
  };
  
  // Calculate confidence rating
  const getConfidenceRating = (): string => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Moderate';
    return 'Low';
  };
  
  const { icon, text } = getTrendInfo();
  const color = getSentimentColor();
  const rotateAngle = getRotateAngle(score);
  
  // Render loading state
  if (isLoading) {
    return (
      <Card className="bg-black/40 border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Market Sentiment</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex justify-center items-center h-40">
            <div className="h-6 w-6 border-4 border-t-transparent border-indigo-500 rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-black/40 border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Market Sentiment</span>
          {showTrend && (
            <Badge 
              variant="outline" 
              className="flex items-center bg-black/30 text-xs"
            >
              {icon}
              <span className="ml-1">{text}</span>
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Gauge visualization */}
        <div className="flex flex-col items-center mt-2">
          {/* Gauge meter */}
          <div className="relative w-40 h-20 mt-4 mb-2">
            {/* Gauge background track */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-gray-900/50 rounded-t-full"></div>
            </div>
            
            {/* Gauge filled portion */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
              <div
                className="absolute bottom-0 left-0 w-full bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 rounded-t-full transform-origin-bottom"
                style={{ height: '100%', clipPath: 'ellipse(100% 100% at 50% 100%)' }}
              ></div>
            </div>
            
            {/* Gauge ticks */}
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute bottom-0 left-1/4 w-px h-2 bg-gray-300"></div>
              <div className="absolute bottom-0 left-1/2 w-px h-2 bg-gray-300"></div>
              <div className="absolute bottom-0 left-3/4 w-px h-2 bg-gray-300"></div>
            </div>
            
            {/* Gauge needle */}
            <div 
              className="absolute bottom-0 left-1/2 w-1 h-16 bg-white rounded transform-origin-bottom transition-transform duration-700"
              style={{ transform: `translateX(-50%) rotate(${rotateAngle}deg)` }}
            ></div>
            
            {/* Needle center point */}
            <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-white rounded-full transform -translate-x-1/2 translate-y-1/2 border-2 border-gray-800"></div>
            
            {/* Labels */}
            <div className="absolute bottom-0 left-0 text-xs text-gray-400">Bearish</div>
            <div className="absolute bottom-0 right-0 text-xs text-gray-400">Bullish</div>
          </div>
          
          {/* Sentiment score and label */}
          <div className="text-center mt-4">
            <div 
              className="text-3xl font-bold" 
              style={{ color }}
            >
              {score.toFixed(0)}
            </div>
            <div 
              className="text-sm font-medium mt-1"
              style={{ color }}
            >
              {getSentimentText()}
            </div>
          </div>
          
          {/* Confidence indicator */}
          <div className="flex items-center mt-3 text-xs text-gray-400">
            <span>Confidence:</span>
            <span className="ml-2">{getConfidenceRating()}</span>
            <div className="ml-2 flex space-x-1">
              <div className={cn(
                "w-6 h-1.5 rounded",
                confidence >= 0.3 ? "bg-indigo-600" : "bg-gray-700"
              )}></div>
              <div className={cn(
                "w-6 h-1.5 rounded",
                confidence >= 0.6 ? "bg-indigo-600" : "bg-gray-700"
              )}></div>
              <div className={cn(
                "w-6 h-1.5 rounded",
                confidence >= 0.8 ? "bg-indigo-600" : "bg-gray-700"
              )}></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default SentimentGauge;