import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SentimentLevel } from '@/services/sentiment-analysis-service';
import { BadgeCheck, TrendingDown, TrendingUp, AlertTriangle, Zap, MinusCircle } from 'lucide-react';
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
  showTrend = false
}: SentimentGaugeProps) {
  // Determine trend
  const trend: 'up' | 'down' | 'neutral' = 
    previousScore ? 
      (score > previousScore ? 'up' : 
       score < previousScore ? 'down' : 'neutral') : 
    'neutral';
  
  // Get color and class based on sentiment level
  const getSentimentColor = (level: SentimentLevel): string => {
    switch (level) {
      case 'very_positive':
        return 'text-green-500';
      case 'positive':
        return 'text-green-400';
      case 'neutral':
        return 'text-blue-400';
      case 'negative':
        return 'text-amber-400';
      case 'very_negative':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };
  
  // Get background color for gauge
  const getGaugeBackground = (level: SentimentLevel): string => {
    switch (level) {
      case 'very_positive':
        return 'from-green-600/20 to-green-400/5';
      case 'positive':
        return 'from-green-500/20 to-green-300/5';
      case 'neutral':
        return 'from-blue-600/20 to-blue-400/5';
      case 'negative':
        return 'from-amber-600/20 to-amber-400/5';
      case 'very_negative':
        return 'from-red-600/20 to-red-400/5';
      default:
        return 'from-gray-600/20 to-gray-400/5';
    }
  };
  
  // Get icon based on sentiment level
  const getSentimentIcon = (level: SentimentLevel) => {
    switch (level) {
      case 'very_positive':
        return <Zap className="h-5 w-5 text-green-500" />;
      case 'positive':
        return <BadgeCheck className="h-5 w-5 text-green-400" />;
      case 'neutral':
        return <MinusCircle className="h-5 w-5 text-blue-400" />;
      case 'negative':
        return <AlertTriangle className="h-5 w-5 text-amber-400" />;
      case 'very_negative':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <MinusCircle className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Get label for sentiment level
  const getSentimentLabel = (level: SentimentLevel): string => {
    switch (level) {
      case 'very_positive':
        return 'Very Bullish';
      case 'positive':
        return 'Bullish';
      case 'neutral':
        return 'Neutral';
      case 'negative':
        return 'Bearish';
      case 'very_negative':
        return 'Very Bearish';
      default:
        return 'Unknown';
    }
  };
  
  // Calculate needle position based on score
  const getNeedlePosition = (score: number): string => {
    // Score is between -100 and 100, but we need a percentage between 0 and 100
    const position = ((score + 100) / 2);
    return `${position}%`;
  };
  
  // Calculate trend text and value
  const getTrendText = (): { text: string; value: string; icon: React.ReactNode } => {
    if (!previousScore || score === previousScore) {
      return { 
        text: 'No change', 
        value: '0', 
        icon: <MinusCircle className="h-3 w-3 text-gray-400" /> 
      };
    }
    
    const diff = score - previousScore;
    const sign = diff > 0 ? '+' : '';
    
    return {
      text: diff > 0 ? 'Improved' : 'Declined',
      value: `${sign}${diff.toFixed(1)}`,
      icon: diff > 0 
        ? <TrendingUp className="h-3 w-3 text-green-400" /> 
        : <TrendingDown className="h-3 w-3 text-red-400" />
    };
  };
  
  const trendInfo = getTrendText();
  
  // Render skeleton if loading
  if (isLoading) {
    return (
      <Card className="bg-black/40 border-gray-800">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center h-40">
            <div className="h-6 w-6 border-4 border-t-transparent border-indigo-500 rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-black/40 border-gray-800 overflow-hidden">
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-50 pointer-events-none",
        getGaugeBackground(level)
      )}></div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          {getSentimentIcon(level)}
          <span className="ml-2">Market Sentiment</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex flex-col items-center">
          {/* The main sentiment display */}
          <div className="flex items-center justify-center mt-4 mb-6">
            <div className={cn(
              "text-4xl font-bold",
              getSentimentColor(level)
            )}>
              {score.toFixed(1)}
            </div>
          </div>
          
          {/* Sentiment gauge */}
          <div className="w-full px-4 mb-4">
            <div className="relative">
              {/* Gauge background */}
              <div className="h-2 rounded-full bg-gray-800 mb-1 overflow-hidden">
                <div className="absolute inset-0 flex">
                  <div className="h-full bg-red-500" style={{ width: '20%' }}></div>
                  <div className="h-full bg-amber-500" style={{ width: '20%' }}></div>
                  <div className="h-full bg-blue-500" style={{ width: '20%' }}></div>
                  <div className="h-full bg-green-400" style={{ width: '20%' }}></div>
                  <div className="h-full bg-green-500" style={{ width: '20%' }}></div>
                </div>
              </div>
              
              {/* Gauge needle */}
              <div 
                className="absolute top-0 w-0.5 h-3 bg-white"
                style={{ 
                  left: getNeedlePosition(score), 
                  transform: 'translateX(-50%)'
                }}
              ></div>
              
              {/* Gauge labels */}
              <div className="flex justify-between text-[10px] text-gray-500">
                <span>Very Bearish</span>
                <span>Neutral</span>
                <span>Very Bullish</span>
              </div>
            </div>
          </div>
          
          {/* Sentiment classification */}
          <div className="flex flex-col items-center space-y-1 mt-2">
            <div className={cn(
              "text-sm font-medium",
              getSentimentColor(level)
            )}>
              {getSentimentLabel(level)}
            </div>
            
            {/* Trend if available and requested */}
            {showTrend && previousScore !== undefined && (
              <div className="flex items-center text-xs text-gray-400 mt-2">
                {trendInfo.icon}
                <span className="ml-1">
                  {trendInfo.text} {trendInfo.value}
                </span>
              </div>
            )}
            
            {/* Confidence indicator */}
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <span>Confidence:</span>
              <div className="ml-2 w-16 bg-gray-700 h-1.5 rounded overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full"
                  style={{ width: `${confidence * 100}%` }}
                ></div>
              </div>
              <span className="ml-1">{Math.round(confidence * 100)}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default SentimentGauge;