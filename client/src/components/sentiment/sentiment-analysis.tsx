import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from 'lucide-react';
import { 
  sentimentAnalysisService, 
  TimeRange,
  SentimentData
} from '@/services/sentiment-analysis-service';
import { SentimentGauge } from './sentiment-gauge';
import { SentimentAlerts } from './sentiment-alerts';
import { SentimentRecommendations } from './sentiment-recommendations';

interface SentimentAnalysisProps {
  assetSymbol?: string;
  defaultTimeRange?: TimeRange;
  compact?: boolean;
  showRefreshButton?: boolean;
}

export function SentimentAnalysis({
  assetSymbol = 'BTC',
  defaultTimeRange = '24h',
  compact = false,
  showRefreshButton = true
}: SentimentAnalysisProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>(defaultTimeRange);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sentimentData, setSentimentData] = useState<SentimentData | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch sentiment data
  const fetchSentimentData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await sentimentAnalysisService.getSentimentAnalysis(assetSymbol, timeRange);
      setSentimentData(data);
    } catch (err) {
      console.error('Error fetching sentiment data:', err);
      setError('Failed to fetch sentiment data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch data on initial load and when dependencies change
  useEffect(() => {
    fetchSentimentData();
  }, [assetSymbol, timeRange]);
  
  // Extract recommendations as strings
  const getRecommendationTexts = (): string[] => {
    if (!sentimentData || !sentimentData.recommendations) return [];
    return sentimentData.recommendations.map(rec => rec.reasoning);
  };
  
  // Refresh button handler
  const handleRefresh = () => {
    sentimentAnalysisService.clearCache();
    fetchSentimentData();
  };
  
  // Render error state
  if (error) {
    return (
      <Card className="bg-black/40 border-gray-800">
        <CardHeader>
          <CardTitle>Market Sentiment Analysis</CardTitle>
          <CardDescription>Analysis of market sentiment for {assetSymbol}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <div className="text-red-500 mb-4">
            {error}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  // Render compact view (just the gauge)
  if (compact) {
    return (
      <SentimentGauge
        level={sentimentData?.level || 'neutral'}
        score={sentimentData?.score || 0}
        previousScore={sentimentData?.previousScore}
        confidence={sentimentData?.confidence || 0.5}
        isLoading={isLoading}
        showTrend={true}
      />
    );
  }
  
  // Render full view
  return (
    <Card className="bg-black/40 border-gray-800">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Market Sentiment Analysis</CardTitle>
            <CardDescription>Analysis of market sentiment for {assetSymbol}</CardDescription>
          </div>
          {showRefreshButton && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isLoading}
              className="h-8"
            >
              <RefreshCcw className={`h-3.5 w-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <Tabs defaultValue={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="24h">24H</TabsTrigger>
            <TabsTrigger value="7d">7D</TabsTrigger>
            <TabsTrigger value="30d">30D</TabsTrigger>
            <TabsTrigger value="90d">90D</TabsTrigger>
          </TabsList>
          
          <TabsContent value={timeRange} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Sentiment Gauge */}
                <SentimentGauge
                  level={sentimentData?.level || 'neutral'}
                  score={sentimentData?.score || 0}
                  previousScore={sentimentData?.previousScore}
                  confidence={sentimentData?.confidence || 0.5}
                  isLoading={isLoading}
                  showTrend={true}
                />
                
                {/* Analysis Text */}
                {!isLoading && sentimentData && (
                  <Card className="bg-black/40 border-gray-800">
                    <CardContent className="pt-4">
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {sentimentData.analysisText}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              {/* Right Column */}
              <div className="space-y-4">
                {/* Sentiment Alerts */}
                <SentimentAlerts
                  alerts={sentimentData?.alerts || []}
                  isLoading={isLoading}
                  maxAlerts={3}
                  timeRange={timeRange}
                />
                
                {/* Recommendations */}
                <SentimentRecommendations
                  recommendations={getRecommendationTexts()}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default SentimentAnalysis;