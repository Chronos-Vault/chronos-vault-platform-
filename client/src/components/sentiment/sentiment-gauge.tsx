import React, { useEffect, useState } from 'react';
import { 
  SentimentLevel, 
  SentimentData, 
  sentimentAnalysisService 
} from '@/services/sentiment-analysis-service';
import { AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface SentimentGaugeProps {
  assetSymbol: string;
  onSentimentUpdate?: (sentiment: SentimentData) => void;
  className?: string;
}

export function SentimentGauge({ 
  assetSymbol, 
  onSentimentUpdate,
  className = '' 
}: SentimentGaugeProps) {
  const [sentiment, setSentiment] = useState<SentimentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    async function fetchSentiment() {
      try {
        setLoading(true);
        const data = await sentimentAnalysisService.getSentiment(assetSymbol);
        setSentiment(data);
        
        if (onSentimentUpdate) {
          onSentimentUpdate(data);
        }
        
        if (data.classification === SentimentLevel.EXTREME_FEAR || 
            data.classification === SentimentLevel.EXTREME_GREED) {
          toast({
            title: `Extreme ${data.classification === SentimentLevel.EXTREME_FEAR ? 'Fear' : 'Greed'} Detected`,
            description: `Market sentiment is currently showing extreme ${data.classification === SentimentLevel.EXTREME_FEAR ? 'fear' : 'greed'}. Investment strategy adjustments recommended.`,
            variant: data.classification === SentimentLevel.EXTREME_FEAR ? 'destructive' : 'default',
          });
        }
      } catch (err) {
        setError('Failed to fetch sentiment data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchSentiment();
    
    // Refresh every 30 minutes
    const intervalId = setInterval(fetchSentiment, 30 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [assetSymbol, onSentimentUpdate, toast]);
  
  // Get color based on sentiment classification
  const getSentimentColor = () => {
    if (!sentiment) return 'bg-gray-600';
    
    switch (sentiment.classification) {
      case SentimentLevel.EXTREME_FEAR:
        return 'bg-red-600';
      case SentimentLevel.FEAR:
        return 'bg-orange-500';
      case SentimentLevel.NEUTRAL:
        return 'bg-yellow-500';
      case SentimentLevel.GREED:
        return 'bg-lime-500';
      case SentimentLevel.EXTREME_GREED:
        return 'bg-green-600';
      default:
        return 'bg-gray-600';
    }
  };
  
  // Get text classes based on sentiment classification
  const getSentimentTextClass = () => {
    if (!sentiment) return 'text-gray-400';
    
    switch (sentiment.classification) {
      case SentimentLevel.EXTREME_FEAR:
        return 'text-red-500';
      case SentimentLevel.FEAR:
        return 'text-orange-500';
      case SentimentLevel.NEUTRAL:
        return 'text-yellow-500';
      case SentimentLevel.GREED:
        return 'text-lime-500';
      case SentimentLevel.EXTREME_GREED:
        return 'text-green-500';
      default:
        return 'text-gray-400';
    }
  };
  
  // Get formatted text for sentiment level
  const getSentimentText = () => {
    if (!sentiment) return 'Loading...';
    
    const level = sentiment.classification.replace('_', ' ');
    return level.charAt(0).toUpperCase() + level.slice(1);
  };
  
  // Get trend indicator based on previous value
  const getTrendIndicator = () => {
    if (!sentiment || !sentiment.previousValue) return null;
    
    if (sentiment.value > sentiment.previousValue) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (sentiment.value < sentiment.previousValue) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
    return null;
  };
  
  if (error) {
    return (
      <div className={`p-4 rounded-lg bg-black/30 border border-red-900 ${className}`}>
        <div className="flex items-center text-red-500 mb-2">
          <AlertTriangle className="mr-2 h-5 w-5" />
          <p>Error loading sentiment data</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`p-4 rounded-lg bg-black/30 border border-gray-800 ${className}`}>
      <h3 className="text-lg font-medium text-gray-200 mb-2">
        Market Sentiment: {assetSymbol}
      </h3>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-400">Fear</span>
          <div className="flex items-center">
            <span className={`text-sm font-medium ${getSentimentTextClass()}`}>
              {sentiment ? sentiment.value : '--'}
            </span>
            <span className="text-sm text-gray-400 mx-1">/</span>
            <span className="text-sm text-gray-500">100</span>
            {getTrendIndicator()}
          </div>
          <span className="text-sm text-gray-400">Greed</span>
        </div>
        
        <Progress 
          value={sentiment ? sentiment.value : 0} 
          max={100}
          className="h-2 bg-gray-800"
        />
      </div>
      
      <div className="flex justify-between items-center">
        <span className={`text-sm font-semibold ${getSentimentTextClass()}`}>
          {getSentimentText()}
        </span>
        <span className="text-xs text-gray-500">
          {sentiment ? new Date(sentiment.timestamp).toLocaleString() : '--'}
        </span>
      </div>
      
      {sentiment && (
        <div className="mt-4 pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Recommendations</h4>
          <ul className="text-xs text-gray-400 space-y-1">
            {sentiment.classification === SentimentLevel.EXTREME_FEAR && (
              <>
                <li>• Consider reducing planned sell targets</li>
                <li>• Implement cooling-off period before executing sells</li>
                <li>• Review your emergency protocols</li>
              </>
            )}
            {sentiment.classification === SentimentLevel.FEAR && (
              <>
                <li>• Proceed with caution on sell decisions</li>
                <li>• Maintain original strategy with minor adjustments</li>
              </>
            )}
            {sentiment.classification === SentimentLevel.NEUTRAL && (
              <>
                <li>• Maintain your original investment plan</li>
                <li>• No sentiment-based adjustments needed</li>
              </>
            )}
            {sentiment.classification === SentimentLevel.GREED && (
              <>
                <li>• Consider increasing profit-taking targets</li>
                <li>• Watch for potential local tops forming</li>
              </>
            )}
            {sentiment.classification === SentimentLevel.EXTREME_GREED && (
              <>
                <li>• Strongly consider raising profit-taking percentages</li>
                <li>• Enable FOMO protection measures</li>
                <li>• Watch for potential bubble conditions</li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

interface SentimentAlertProps {
  assetSymbol: string;
  sentimentData?: SentimentData;
}

export function SentimentAlert({ assetSymbol, sentimentData }: SentimentAlertProps) {
  const [sentiment, setSentiment] = useState<SentimentData | null>(sentimentData || null);
  
  useEffect(() => {
    if (sentimentData) {
      setSentiment(sentimentData);
      return;
    }
    
    async function fetchSentiment() {
      try {
        const data = await sentimentAnalysisService.getSentiment(assetSymbol);
        setSentiment(data);
      } catch (err) {
        console.error('Failed to fetch sentiment data for alert:', err);
      }
    }
    
    fetchSentiment();
  }, [assetSymbol, sentimentData]);
  
  if (!sentiment || 
      (sentiment.classification !== SentimentLevel.EXTREME_FEAR && 
       sentiment.classification !== SentimentLevel.EXTREME_GREED)) {
    return null;
  }
  
  const isExtremeFear = sentiment.classification === SentimentLevel.EXTREME_FEAR;
  
  return (
    <div className={`p-3 rounded-md ${isExtremeFear ? 'bg-red-950/30 border border-red-800' : 'bg-yellow-950/30 border border-yellow-800'} mb-4`}>
      <div className="flex items-start">
        <AlertTriangle className={`mr-2 h-5 w-5 ${isExtremeFear ? 'text-red-500' : 'text-yellow-500'} flex-shrink-0 mt-0.5`} />
        <div>
          <h4 className={`text-sm font-medium ${isExtremeFear ? 'text-red-400' : 'text-yellow-400'}`}>
            {isExtremeFear ? 'Extreme Fear Detected' : 'Extreme Greed Detected'}
          </h4>
          <p className="text-xs text-gray-300 mt-1">
            {isExtremeFear 
              ? 'Market sentiment indicates extreme fear. Be cautious about selling during emotional market conditions.'
              : 'Market sentiment indicates extreme greed. Consider activating protection against FOMO-driven decisions.'}
          </p>
          <div className={`text-xs ${isExtremeFear ? 'text-red-400' : 'text-yellow-400'} mt-2`}>
            <strong>Recommendation:</strong>{' '}
            <span className="text-gray-300">
              {isExtremeFear 
                ? 'Reduce planned sell percentages and implement a cooling-off period.' 
                : 'Consider raising profit-taking targets and enabling FOMO protection.'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SentimentRecommendationsProps {
  assetSymbol: string;
  onRecommendationsUpdate?: (recommendations: string[]) => void;
}

export function SentimentRecommendations({ 
  assetSymbol,
  onRecommendationsUpdate 
}: SentimentRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchRecommendations() {
      try {
        setLoading(true);
        const recs = await sentimentAnalysisService.getActionRecommendations(assetSymbol);
        setRecommendations(recs);
        
        if (onRecommendationsUpdate) {
          onRecommendationsUpdate(recs);
        }
      } catch (err) {
        console.error('Failed to fetch sentiment recommendations:', err);
        setRecommendations([
          'Unable to generate recommendations due to data retrieval issues'
        ]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchRecommendations();
    
    // Refresh recommendations hourly
    const intervalId = setInterval(fetchRecommendations, 60 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [assetSymbol, onRecommendationsUpdate]);
  
  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="animate-pulse h-4 bg-gray-800 rounded w-3/4 mx-auto mb-2"></div>
        <div className="animate-pulse h-4 bg-gray-800 rounded w-1/2 mx-auto"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-1">
      {recommendations.map((rec, index) => (
        <div key={index} className="text-sm text-gray-300">
          • {rec}
        </div>
      ))}
    </div>
  );
}