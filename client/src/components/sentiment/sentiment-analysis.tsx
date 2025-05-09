import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart4, 
  RefreshCw, 
  AlertCircle, 
  MessageSquare, 
  TrendingUp, 
  Clock,
  PieChart
} from 'lucide-react';
import { SentimentGauge } from './sentiment-gauge';
import { SentimentAlerts } from './sentiment-alerts';
import { SentimentRecommendations } from './sentiment-recommendations';
import { 
  sentimentAnalysisService, 
  SentimentData, 
  TimeRange 
} from '@/services/sentiment-analysis-service';

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
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [timeRange, setTimeRange] = useState<TimeRange>(defaultTimeRange);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sentimentData, setSentimentData] = useState<SentimentData | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  
  // Load sentiment data on component mount and when params change
  useEffect(() => {
    loadSentimentData();
  }, [assetSymbol, timeRange]);
  
  const loadSentimentData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await sentimentAnalysisService.getSentimentAnalysis(assetSymbol, timeRange);
      setSentimentData(data);
    } catch (error) {
      console.error("Error loading sentiment data:", error);
      setError("Failed to load sentiment data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle refresh button click
  const handleRefresh = () => {
    sentimentAnalysisService.clearCache();
    loadSentimentData();
  };
  
  // Render error state
  if (error) {
    return (
      <Card className="bg-black/40 border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <BarChart4 className="h-5 w-5 mr-2 text-indigo-400" />
            Market Sentiment Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <AlertCircle className="h-10 w-10 text-red-500 mb-3" />
            <p className="text-center">{error}</p>
            {showRefreshButton && (
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={handleRefresh}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Render compact view
  if (compact) {
    return (
      <div className="space-y-4">
        <SentimentGauge 
          level={sentimentData?.level || 'neutral'}
          score={sentimentData?.score || 0}
          previousScore={sentimentData?.previousScore}
          confidence={sentimentData?.confidence || 0.5}
          isLoading={isLoading}
          showTrend={true}
        />
        
        {sentimentData && sentimentData.recommendations.length > 0 && (
          <SentimentRecommendations
            recommendations={sentimentData.recommendations}
            isLoading={isLoading}
            asset={assetSymbol}
            onlyShowLatest={true}
          />
        )}
      </div>
    );
  }
  
  return (
    <Card className="bg-black/40 border-gray-800">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <BarChart4 className="h-5 w-5 mr-2 text-indigo-400" />
            Market Sentiment Analysis
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            <Select
              value={timeRange}
              onValueChange={(value: TimeRange) => setTimeRange(value)}
            >
              <SelectTrigger className="w-[120px] bg-gray-800 border-gray-700 h-8">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7d</SelectItem>
                <SelectItem value="30d">Last 30d</SelectItem>
                <SelectItem value="90d">Last 90d</SelectItem>
              </SelectContent>
            </Select>
            
            {showRefreshButton && (
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-gray-700"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Main sentiment content */}
        <div className="p-4">
          {/* Sentiment summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="md:col-span-1">
              {/* Sentiment gauge */}
              <SentimentGauge 
                level={sentimentData?.level || 'neutral'}
                score={sentimentData?.score || 0}
                previousScore={sentimentData?.previousScore}
                confidence={sentimentData?.confidence || 0.5}
                isLoading={isLoading}
                showTrend={true}
              />
            </div>
            
            <div className="md:col-span-2">
              {/* Analysis text */}
              <Card className="bg-black/30 border-gray-800 h-full">
                <CardContent className="p-4">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-full py-10">
                      <div className="h-6 w-6 border-4 border-t-transparent border-indigo-500 rounded-full animate-spin"></div>
                    </div>
                  ) : sentimentData ? (
                    <>
                      <div className="text-sm leading-relaxed text-gray-300">{sentimentData.analysisText}</div>
                      
                      {sentimentData.keyFactors.length > 0 && (
                        <div className="mt-4">
                          <div className="text-sm font-medium mb-2">Key Factors:</div>
                          <div className="space-y-2">
                            {sentimentData.keyFactors.map((factor, index) => (
                              <div key={index} className="flex justify-between items-center">
                                <span className="text-sm text-gray-400">{factor.factor}</span>
                                <div className="flex items-center">
                                  <div className="w-16 bg-gray-700 h-1.5 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full ${factor.impact > 0 ? 'bg-green-500' : factor.impact < 0 ? 'bg-red-500' : 'bg-gray-500'}`}
                                      style={{ 
                                        width: `${Math.abs(factor.impact) * 33.3}%`,
                                        marginLeft: factor.impact >= 0 ? '50%' : `${50 - Math.abs(factor.impact) * 33.3}%`
                                      }}
                                    ></div>
                                  </div>
                                  <span className="ml-2 text-xs">
                                    {factor.impact > 0 ? '+' : ''}{factor.impact.toFixed(1)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-800 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Last updated: {new Date(sentimentData.timestamp).toLocaleString()}
                        </div>
                        
                        <div className="flex items-center">
                          <PieChart className="h-3 w-3 mr-1" />
                          {sentimentData.sources.length} data sources
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-center items-center h-full py-8 text-gray-500">
                      No sentiment data available
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Additional sentiment details */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-gray-800/60">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
              <TabsTrigger value="sources">Data Sources</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sentimentData && sentimentData.recommendations.length > 0 && (
                  <SentimentRecommendations
                    recommendations={[sentimentData.recommendations[0]]} // Just show the top recommendation
                    isLoading={isLoading}
                    asset={assetSymbol}
                    onlyShowLatest={true}
                  />
                )}
                
                <SentimentAlerts
                  alerts={sentimentData?.alerts || []}
                  isLoading={isLoading}
                  maxAlerts={3}
                  compact={true}
                  timeRange={timeRange}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="recommendations" className="mt-4">
              <SentimentRecommendations
                recommendations={sentimentData?.recommendations || []}
                isLoading={isLoading}
                asset={assetSymbol}
              />
            </TabsContent>
            
            <TabsContent value="alerts" className="mt-4">
              <SentimentAlerts
                alerts={sentimentData?.alerts || []}
                isLoading={isLoading}
                timeRange={timeRange}
              />
            </TabsContent>
            
            <TabsContent value="sources" className="mt-4">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="h-6 w-6 border-4 border-t-transparent border-indigo-500 rounded-full animate-spin"></div>
                </div>
              ) : sentimentData?.sources && sentimentData.sources.length > 0 ? (
                <div className="space-y-4">
                  <div className="bg-black/30 border border-gray-800 rounded-md p-4">
                    <div className="text-sm font-medium mb-3">Source Influence Breakdown</div>
                    <div className="space-y-3">
                      {sentimentData.sources.map((source, index) => (
                        <div key={index} className="flex flex-col space-y-1">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              {getSourceIcon(source.source)}
                              <span className="ml-2 capitalize text-sm">{source.source.replace('_', ' ')}</span>
                            </div>
                            <span className="text-xs text-gray-400">{Math.round(source.influence * 100)}% influence</span>
                          </div>
                          <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={getSourceSentimentColor(source.sentiment)}
                              style={{ width: `${source.influence * 100}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>Sentiment: {source.sentiment.toFixed(1)}</span>
                            <span>{getSentimentLabel(source.sentiment)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 p-3 bg-black/20 rounded border border-gray-800">
                    <div className="flex items-start">
                      <AlertCircle className="h-4 w-4 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                      <p>
                        Sentiment analysis is derived from multiple data sources using advanced AI processing. 
                        Accuracy and reliability may vary based on market conditions, source quality, and other factors.
                        This information should not be considered as financial advice.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center items-center py-12 text-gray-500">
                  No source data available
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to get icon for source
const getSourceIcon = (source: string) => {
  switch (source) {
    case 'twitter':
    case 'reddit':
      return <MessageSquare className="h-4 w-4 text-blue-400" />;
    case 'news_articles':
      return <AlertCircle className="h-4 w-4 text-amber-400" />;
    case 'blockchain_metrics':
      return <TrendingUp className="h-4 w-4 text-green-400" />;
    case 'exchange_data':
      return <BarChart4 className="h-4 w-4 text-purple-400" />;
    default:
      return <AlertCircle className="h-4 w-4 text-gray-400" />;
  }
};

// Helper function to get color for sentiment
const getSourceSentimentColor = (sentiment: number): string => {
  if (sentiment >= 60) return 'bg-green-500';
  if (sentiment >= 20) return 'bg-green-400';
  if (sentiment >= -20) return 'bg-gray-400';
  if (sentiment >= -60) return 'bg-red-400';
  return 'bg-red-500';
};

// Helper function to get label for sentiment
const getSentimentLabel = (sentiment: number): string => {
  if (sentiment >= 60) return 'Very Positive';
  if (sentiment >= 20) return 'Positive';
  if (sentiment >= -20) return 'Neutral';
  if (sentiment >= -60) return 'Negative';
  return 'Very Negative';
};

export default SentimentAnalysis;