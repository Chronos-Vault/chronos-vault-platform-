import React, { useState, useEffect } from 'react';
import { SentimentData } from './sentiment-analysis';

// Import service for fetching data
import { sentimentAnalysisService } from '@/services/sentiment-analysis-service';

interface SentimentGaugeProps {
  assetSymbol: string;
  sentimentData?: SentimentData | null;
  onSentimentUpdate?: (data: SentimentData) => void;
  isLoading?: boolean;
}

export function SentimentGauge({ 
  assetSymbol, 
  sentimentData: propsSentimentData,
  onSentimentUpdate,
  isLoading: propsIsLoading
}: SentimentGaugeProps) {
  const [localSentimentData, setLocalSentimentData] = useState<SentimentData | null>(null);
  const [isLoading, setIsLoading] = useState(propsIsLoading !== undefined ? propsIsLoading : true);
  
  // Use prop data or fetch our own
  useEffect(() => {
    if (propsSentimentData) {
      setLocalSentimentData(propsSentimentData);
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
        const data = await sentimentAnalysisService.getSentiment(assetSymbol);
        setLocalSentimentData(data);
        if (onSentimentUpdate) {
          onSentimentUpdate(data);
        }
      } catch (error) {
        console.error("Error fetching sentiment data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [assetSymbol, propsSentimentData, propsIsLoading, onSentimentUpdate]);
  
  // Calculate needle position based on sentiment score
  const getNeedlePosition = () => {
    if (!localSentimentData) return 50;
    
    // Convert score from -1 to 1 range to 0 to 100 range
    const position = ((localSentimentData.currentScore.score + 1) / 2) * 100;
    return Math.max(0, Math.min(100, position));
  };
  
  const needlePosition = getNeedlePosition();
  
  // Determine gauge color based on position
  const getGaugeGradient = () => {
    return 'linear-gradient(90deg, #FF4D4D 0%, #FFAB4D 33%, #EFEFEF 50%, #4DCA7A 67%, #2EA54F 100%)';
  };
  
  // Get label based on position
  const getSentimentLabel = () => {
    if (!localSentimentData) return 'Neutral';
    
    const { sentiment } = localSentimentData.currentScore;
    switch (sentiment) {
      case 'very-bearish': return 'Very Bearish';
      case 'bearish': return 'Bearish';
      case 'neutral': return 'Neutral';
      case 'bullish': return 'Bullish';
      case 'very-bullish': return 'Very Bullish';
      default: return 'Neutral';
    }
  };
  
  // Get label color based on position
  const getLabelColor = () => {
    if (!localSentimentData) return 'text-gray-300';
    
    const score = localSentimentData.currentScore.score;
    if (score < -0.6) return 'text-red-500';
    if (score < -0.2) return 'text-orange-500';
    if (score < 0.2) return 'text-gray-300';
    if (score < 0.6) return 'text-green-400';
    return 'text-green-500';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-2">
        <h3 className="text-sm font-medium text-gray-300">Market Sentiment</h3>
        <p className="text-xs text-gray-500">{assetSymbol}</p>
      </div>
      
      <div className="relative w-full h-36">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 border-4 border-t-transparent border-purple-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Gauge background */}
            <div 
              className="absolute h-24 w-full rounded-t-full overflow-hidden"
              style={{ 
                background: getGaugeGradient(),
                clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 0)'
              }}
            ></div>
            
            {/* Gauge center point */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-800 border-2 border-gray-700 rounded-full z-10"></div>
            
            {/* Gauge needle */}
            <div 
              className="absolute bottom-0 left-1/2 h-20 w-1 bg-gray-200 rounded-t-full origin-bottom transform -translate-x-1/2 transition-transform duration-500"
              style={{ transform: `translateX(-50%) rotate(${(needlePosition - 50) * 1.8}deg)` }}
            ></div>
            
            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 text-center -mb-8">
              <div className={`text-xl font-bold ${getLabelColor()}`}>
                {getSentimentLabel()}
              </div>
              <div className="text-sm text-gray-500">
                {localSentimentData ? `Score: ${localSentimentData.currentScore.score.toFixed(2)}` : ''}
              </div>
            </div>
            
            {/* Scale markers */}
            <div className="absolute bottom-0 w-full flex justify-between px-2 -mb-2">
              <span className="text-xs text-red-500">Very<br/>Bearish</span>
              <span className="text-xs text-orange-500">Bearish</span>
              <span className="text-xs text-gray-400">Neutral</span>
              <span className="text-xs text-green-400">Bullish</span>
              <span className="text-xs text-green-500">Very<br/>Bullish</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SentimentGauge;