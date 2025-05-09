import React, { useState, useEffect } from 'react';
import { ActionRecommendation } from './sentiment-analysis';
import { sentimentAnalysisService } from '@/services/sentiment-analysis-service';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, ArrowBigDown, ArrowBigUp, Clock, Pause, ShoppingCart, Timer, Wallet } from 'lucide-react';

interface SentimentRecommendationsProps {
  assetSymbol: string;
  recommendations?: ActionRecommendation[];
  onRecommendationsUpdate?: (recommendations: ActionRecommendation[]) => void;
  isLoading?: boolean;
}

export function SentimentRecommendations({
  assetSymbol,
  recommendations: propsRecommendations,
  onRecommendationsUpdate,
  isLoading: propsIsLoading
}: SentimentRecommendationsProps) {
  const [localRecommendations, setLocalRecommendations] = useState<ActionRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(propsIsLoading !== undefined ? propsIsLoading : true);
  
  // Use prop data or fetch our own
  useEffect(() => {
    if (propsRecommendations && propsRecommendations.length > 0) {
      setLocalRecommendations(propsRecommendations);
      setIsLoading(false);
      return;
    }
    
    if (propsIsLoading !== undefined) {
      setIsLoading(propsIsLoading);
      return;
    }
    
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await sentimentAnalysisService.getActionRecommendations(assetSymbol);
        setLocalRecommendations(data);
        if (onRecommendationsUpdate) {
          onRecommendationsUpdate(data);
        }
      } catch (error) {
        console.error("Error fetching recommendation data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [assetSymbol, propsRecommendations, propsIsLoading, onRecommendationsUpdate]);
  
  // Function to get action icon
  const getActionIcon = (type: ActionRecommendation['type']) => {
    switch (type) {
      case 'buy':
        return <ShoppingCart className="h-4 w-4" />;
      case 'sell':
        return <ArrowBigDown className="h-4 w-4" />;
      case 'hold':
        return <Wallet className="h-4 w-4" />;
      case 'reduce':
        return <ArrowBigDown className="h-4 w-4" />;
      case 'increase':
        return <ArrowBigUp className="h-4 w-4" />;
      case 'wait':
        return <Pause className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  // Function to get action color
  const getActionColor = (type: ActionRecommendation['type']) => {
    switch (type) {
      case 'buy':
      case 'increase':
        return 'bg-green-600 text-white';
      case 'sell':
      case 'reduce':
        return 'bg-red-600 text-white';
      case 'hold':
        return 'bg-blue-600 text-white';
      case 'wait':
        return 'bg-amber-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };
  
  // Function to get timeframe icon
  const getTimeframeIcon = (timeframe: ActionRecommendation['timeframe']) => {
    switch (timeframe) {
      case 'immediate':
        return <Clock className="h-4 w-4" />;
      case 'short-term':
        return <Timer className="h-4 w-4" />;
      case 'medium-term':
        return <Clock className="h-4 w-4" />;
      case 'long-term':
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };
  
  // Function to get confidence badge color
  const getConfidenceBadgeColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-600 text-white';
    if (confidence >= 0.6) return 'bg-blue-600 text-white';
    if (confidence >= 0.4) return 'bg-yellow-600 text-white';
    return 'bg-red-600 text-white';
  };
  
  // Format action type
  const formatActionType = (type: ActionRecommendation['type']) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };
  
  // Format timeframe
  const formatTimeframe = (timeframe: ActionRecommendation['timeframe']) => {
    switch (timeframe) {
      case 'immediate':
        return 'Immediate';
      case 'short-term':
        return 'Short Term';
      case 'medium-term':
        return 'Medium Term';
      case 'long-term':
        return 'Long Term';
      default:
        return timeframe;
    }
  };

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="h-8 w-8 border-4 border-t-transparent border-indigo-500 rounded-full animate-spin"></div>
        </div>
      ) : localRecommendations.length > 0 ? (
        <div className="space-y-4">
          {localRecommendations.map((recommendation, index) => (
            <div 
              key={index} 
              className="bg-black/30 border border-gray-800 rounded-md p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Badge className={getActionColor(recommendation.type)}>
                    <span className="flex items-center">
                      {getActionIcon(recommendation.type)}
                      <span className="ml-1">{formatActionType(recommendation.type)}</span>
                    </span>
                  </Badge>
                  <Badge variant="outline" className="border-gray-700 text-gray-400">
                    <span className="flex items-center">
                      {getTimeframeIcon(recommendation.timeframe)}
                      <span className="ml-1">{formatTimeframe(recommendation.timeframe)}</span>
                    </span>
                  </Badge>
                </div>
                <Badge className={getConfidenceBadgeColor(recommendation.confidence)}>
                  {(recommendation.confidence * 100).toFixed(0)}% Confidence
                </Badge>
              </div>
              <p className="text-sm text-gray-300">{recommendation.reasoning}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
          <AlertCircle className="h-8 w-8 mb-2" />
          <p>No recommendations available</p>
        </div>
      )}
    </div>
  );
}

export default SentimentRecommendations;