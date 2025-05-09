import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SentimentGauge } from "./sentiment-gauge";
import { SentimentRecommendations } from "./sentiment-recommendations";
import { SentimentAlerts } from "./sentiment-alerts";
import { AlertTriangle, Brain, Clock, RefreshCcw, Shield, Sparkles, Webhook } from "lucide-react";

// Types
export interface SentimentScore {
  score: number;
  magnitude: number;
  sentiment: 'very-bearish' | 'bearish' | 'neutral' | 'bullish' | 'very-bullish';
  confidence: number;
}

export interface SentimentSource {
  name: string;
  weight: number;
  score: number;
  timestamp: string;
  url?: string;
}

export interface SentimentData {
  assetSymbol: string;
  currentScore: SentimentScore;
  historicalScores: Array<{
    timestamp: string;
    score: number;
  }>;
  sources: SentimentSource[];
  keywords: Array<{
    word: string;
    count: number;
    sentiment: number;
  }>;
  lastUpdated: string;
}

export interface ActionRecommendation {
  type: 'hold' | 'buy' | 'sell' | 'reduce' | 'increase' | 'wait';
  confidence: number;
  reasoning: string;
  timeframe: 'immediate' | 'short-term' | 'medium-term' | 'long-term';
}

export interface SentimentAnalysisProps {
  assetSymbol: string;
  onSentimentUpdate?: (data: SentimentData) => void;
  onRecommendationsUpdate?: (recommendations: ActionRecommendation[]) => void;
}

// Helper function to determine sentiment category
const determineSentiment = (score: number): SentimentScore['sentiment'] => {
  if (score < -0.6) return 'very-bearish';
  if (score < -0.2) return 'bearish';
  if (score < 0.2) return 'neutral';
  if (score < 0.6) return 'bullish';
  return 'very-bullish';
};

// Helper function to format relative time
const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.round(diffMs / 1000);
  const diffMins = Math.round(diffSecs / 60);
  const diffHours = Math.round(diffMins / 60);
  const diffDays = Math.round(diffHours / 24);

  if (diffSecs < 60) {
    return `${diffSecs} seconds ago`;
  } else if (diffMins < 60) {
    return `${diffMins} minutes ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hours ago`;
  } else {
    return `${diffDays} days ago`;
  }
};

// Sample data generator
const generateSampleData = (assetSymbol: string): SentimentData => {
  const generateScore = () => Math.random() * 2 - 1; // Between -1 and 1
  const score = generateScore();
  
  // Generate historical data (30 days)
  const historicalScores = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      timestamp: date.toISOString(),
      score: generateScore()
    };
  });
  
  // Generate sources
  const sources = [
    {
      name: "Social Media",
      weight: 0.3,
      score: generateScore(),
      timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString()
    },
    {
      name: "News Articles",
      weight: 0.25,
      score: generateScore(),
      timestamp: new Date(Date.now() - Math.random() * 7200000).toISOString()
    },
    {
      name: "Trading Forums",
      weight: 0.2,
      score: generateScore(),
      timestamp: new Date(Date.now() - Math.random() * 5400000).toISOString()
    },
    {
      name: "Technical Analysis",
      weight: 0.15,
      score: generateScore(),
      timestamp: new Date(Date.now() - Math.random() * 10800000).toISOString()
    },
    {
      name: "Market Events",
      weight: 0.1,
      score: generateScore(),
      timestamp: new Date(Date.now() - Math.random() * 14400000).toISOString()
    }
  ];
  
  // Keywords with sentiment
  const sentimentWords = [
    { positive: ["bullish", "growth", "innovation", "adoption", "upgrade"], negative: ["bearish", "crash", "ban", "sell-off", "correction"] },
    { positive: ["rally", "accumulate", "breakthrough", "profit", "success"], negative: ["decline", "dump", "risk", "bubble", "warning"] }
  ];
  
  const keywords = [];
  const isPositive = score > 0;
  const wordPool = isPositive ? [...sentimentWords[0].positive, ...sentimentWords[1].positive] : [...sentimentWords[0].negative, ...sentimentWords[1].negative];
  
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * wordPool.length);
    const word = wordPool[randomIndex];
    const count = Math.floor(Math.random() * 100) + 20;
    const sentiment = isPositive ? Math.random() * 0.8 + 0.2 : Math.random() * -0.8 - 0.2;
    
    // Check if word is already added
    const existingIndex = keywords.findIndex(k => k.word === word);
    if (existingIndex === -1) {
      keywords.push({ word, count, sentiment });
    } else {
      // Increment count if word already exists
      keywords[existingIndex].count += count;
    }
  }
  
  // Sort by count
  keywords.sort((a, b) => b.count - a.count);
  
  return {
    assetSymbol,
    currentScore: {
      score,
      magnitude: Math.abs(score) * (0.8 + Math.random() * 0.4),
      sentiment: determineSentiment(score),
      confidence: 0.65 + Math.random() * 0.3
    },
    historicalScores,
    sources,
    keywords: keywords.slice(0, 5), // Top 5 keywords
    lastUpdated: new Date().toISOString()
  };
};

// Sample recommendation generator
const generateRecommendations = (sentiment: SentimentData): ActionRecommendation[] => {
  const { currentScore } = sentiment;
  const score = currentScore.score;
  const recommendations: ActionRecommendation[] = [];
  
  // Strong buy recommendation for very bullish sentiment
  if (score > 0.6) {
    recommendations.push({
      type: 'buy',
      confidence: 0.7 + Math.random() * 0.2,
      reasoning: 'Strong positive sentiment indicates potential upward momentum. Market participants are overwhelmingly bullish.',
      timeframe: 'short-term'
    });
    recommendations.push({
      type: 'increase',
      confidence: 0.6 + Math.random() * 0.3,
      reasoning: 'Consider increasing position as sentiment analysis suggests continued strength.',
      timeframe: 'medium-term'
    });
  }
  // Moderate buy for bullish sentiment
  else if (score > 0.2) {
    recommendations.push({
      type: 'buy',
      confidence: 0.5 + Math.random() * 0.3,
      reasoning: 'Positive sentiment with moderate strength suggests potential for growth.',
      timeframe: 'medium-term'
    });
    recommendations.push({
      type: 'hold',
      confidence: 0.6 + Math.random() * 0.2,
      reasoning: 'Current holders should maintain positions as market sentiment remains positive.',
      timeframe: 'long-term'
    });
  }
  // Hold/wait for neutral sentiment
  else if (score > -0.2) {
    recommendations.push({
      type: 'hold',
      confidence: 0.5 + Math.random() * 0.3,
      reasoning: 'Neutral market sentiment suggests maintaining current positions without significant changes.',
      timeframe: 'short-term'
    });
    recommendations.push({
      type: 'wait',
      confidence: 0.6 + Math.random() * 0.2,
      reasoning: 'Consider waiting for clearer sentiment signals before making new investment decisions.',
      timeframe: 'immediate'
    });
  }
  // Reduce for bearish sentiment
  else if (score > -0.6) {
    recommendations.push({
      type: 'reduce',
      confidence: 0.5 + Math.random() * 0.3,
      reasoning: 'Negative sentiment suggests considering a reduction in position size to manage risk.',
      timeframe: 'short-term'
    });
    recommendations.push({
      type: 'wait',
      confidence: 0.7 + Math.random() * 0.2,
      reasoning: 'Consider waiting for sentiment improvement before adding to positions.',
      timeframe: 'medium-term'
    });
  }
  // Strong sell for very bearish sentiment
  else {
    recommendations.push({
      type: 'sell',
      confidence: 0.6 + Math.random() * 0.3,
      reasoning: 'Strongly negative sentiment indicates potential for continued downward pressure.',
      timeframe: 'immediate'
    });
    recommendations.push({
      type: 'wait',
      confidence: 0.8 + Math.random() * 0.15,
      reasoning: 'Consider waiting for significant sentiment improvement before reentering.',
      timeframe: 'long-term'
    });
  }
  
  // Add contrarian recommendation with lower confidence
  if (score > 0.3) {
    recommendations.push({
      type: 'reduce',
      confidence: 0.3 + Math.random() * 0.2,
      reasoning: 'Contrarian perspective: Extremely positive sentiment can indicate market euphoria and potential reversal.',
      timeframe: 'medium-term'
    });
  } else if (score < -0.3) {
    recommendations.push({
      type: 'buy',
      confidence: 0.3 + Math.random() * 0.2,
      reasoning: 'Contrarian perspective: Extremely negative sentiment can indicate overselling and potential reversal.',
      timeframe: 'medium-term'
    });
  }
  
  return recommendations;
};

export function SentimentAnalysis({
  assetSymbol,
  onSentimentUpdate,
  onRecommendationsUpdate
}: SentimentAnalysisProps) {
  const [sentimentData, setSentimentData] = useState<SentimentData | null>(null);
  const [recommendations, setRecommendations] = useState<ActionRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [activeTab, setActiveTab] = useState('sentiment');
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  // Load sentiment data
  const loadSentimentData = () => {
    setIsLoading(true);
    
    // In a real implementation, this would be an API call
    // For now, we'll generate sample data
    setTimeout(() => {
      const data = generateSampleData(assetSymbol);
      setSentimentData(data);
      onSentimentUpdate?.(data);
      
      const recs = generateRecommendations(data);
      setRecommendations(recs);
      onRecommendationsUpdate?.(recs);
      
      setIsLoading(false);
    }, 800); // Simulate network delay
  };
  
  // Initial load
  useEffect(() => {
    loadSentimentData();
  }, [assetSymbol]);
  
  // Set up auto-refresh
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(loadSentimentData, 60000);
      setRefreshInterval(interval);
      return () => clearInterval(interval);
    } else if (refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
    }
  }, [autoRefresh, assetSymbol]);

  const getSentimentColor = (sentiment: SentimentScore['sentiment']) => {
    switch (sentiment) {
      case 'very-bearish': return 'text-red-500';
      case 'bearish': return 'text-orange-500';
      case 'neutral': return 'text-gray-400';
      case 'bullish': return 'text-green-400';
      case 'very-bullish': return 'text-green-500';
      default: return 'text-gray-400';
    }
  };

  const getSentimentBadge = (sentiment: SentimentScore['sentiment']) => {
    let color;
    let label;
    
    switch (sentiment) {
      case 'very-bearish':
        color = 'bg-red-600';
        label = 'Very Bearish';
        break;
      case 'bearish':
        color = 'bg-orange-600';
        label = 'Bearish';
        break;
      case 'neutral':
        color = 'bg-gray-600';
        label = 'Neutral';
        break;
      case 'bullish':
        color = 'bg-green-600';
        label = 'Bullish';
        break;
      case 'very-bullish':
        color = 'bg-emerald-600';
        label = 'Very Bullish';
        break;
      default:
        color = 'bg-gray-600';
        label = 'Unknown';
    }
    
    return <Badge className={color}>{label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-black/40 border-gray-800">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center">
                <Brain className="h-5 w-5 mr-2 text-purple-400" />
                <CardTitle>AI Sentiment Analysis</CardTitle>
              </div>
              <CardDescription>
                Real-time sentiment analysis for {assetSymbol}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadSentimentData}
                disabled={isLoading}
                className="h-8 border-gray-700"
              >
                <RefreshCcw className={`h-3.5 w-3.5 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="sentiment" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-gray-800 mb-4">
              <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
              <TabsTrigger value="sources">Data Sources</TabsTrigger>
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sentiment" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <SentimentGauge
                    assetSymbol={assetSymbol}
                    sentimentData={sentimentData}
                    isLoading={isLoading}
                  />
                  
                  {sentimentData && (
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Current Sentiment:</span>
                        <span className={getSentimentColor(sentimentData.currentScore.sentiment)}>
                          {getSentimentBadge(sentimentData.currentScore.sentiment)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Confidence:</span>
                        <span>{(sentimentData.currentScore.confidence * 100).toFixed(0)}%</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Last Updated:</span>
                        <span className="text-gray-300">{formatRelativeTime(sentimentData.lastUpdated)}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="lg:col-span-2">
                  <div className="bg-black/30 rounded-lg p-4 border border-gray-800 h-full">
                    <div className="mb-3 flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-200">
                        AI Recommendations
                      </h3>
                      <Badge variant="outline" className="bg-purple-900/30 text-purple-400 border-purple-800">
                        <Sparkles className="h-3 w-3 mr-1" /> AI-Powered
                      </Badge>
                    </div>
                    
                    <SentimentRecommendations
                      assetSymbol={assetSymbol}
                      recommendations={recommendations}
                      isLoading={isLoading}
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-2">
                <Card className="bg-black/20 border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center">
                      <Webhook className="h-4 w-4 mr-1 text-blue-400" />
                      Sentiment Keywords
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="h-16 flex items-center justify-center">
                        <div className="h-6 w-6 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                      </div>
                    ) : sentimentData?.keywords && sentimentData.keywords.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {sentimentData.keywords.map((keyword, index) => (
                          <div 
                            key={index}
                            className={`px-3 py-1.5 rounded-full text-sm ${
                              keyword.sentiment > 0 
                                ? 'bg-green-900/30 border border-green-900/50 text-green-400' 
                                : 'bg-red-900/30 border border-red-900/50 text-red-400'
                            }`}
                          >
                            {keyword.word}
                            <span className="ml-1 text-xs opacity-70">
                              {keyword.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500 text-sm">
                        No keyword data available
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="sources">
              <div className="space-y-4">
                <div className="text-sm text-gray-400 mb-2">
                  Data sources analyzed for sentiment calculation:
                </div>
                
                {isLoading ? (
                  <div className="h-32 flex items-center justify-center">
                    <div className="h-8 w-8 border-4 border-t-transparent border-indigo-500 rounded-full animate-spin"></div>
                  </div>
                ) : sentimentData?.sources && (
                  <ScrollArea className="h-64 pr-4">
                    <div className="space-y-3">
                      {sentimentData.sources.map((source, index) => (
                        <div key={index} className="border border-gray-800 bg-black/30 rounded-md p-3">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{source.name}</h4>
                            <Badge className={`${source.score > 0.2 ? 'bg-green-600' : source.score < -0.2 ? 'bg-red-600' : 'bg-gray-600'}`}>
                              {source.score > 0.2 ? 'Positive' : source.score < -0.2 ? 'Negative' : 'Neutral'}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-400 mt-1">
                            Weight: {(source.weight * 100).toFixed(0)}%
                          </div>
                          <div className="flex justify-between mt-2 text-xs text-gray-500">
                            <span>Score: {source.score.toFixed(2)}</span>
                            <span>Updated: {formatRelativeTime(source.timestamp)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
                
                <div className="text-xs text-gray-500 pt-2">
                  Sentiment analysis combines data from social media, news articles, trader forums, 
                  and technical analysis to provide a comprehensive view of market sentiment.
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="insights">
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/20 border border-purple-900/30 rounded-md p-4">
                  <div className="flex items-start">
                    <Sparkles className="h-5 w-5 text-purple-400 mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-purple-400 mb-1">AI-Generated Market Insight</h3>
                      <p className="text-gray-300 text-sm">
                        {!isLoading && sentimentData ? (
                          sentimentData.currentScore.sentiment === 'very-bullish' ? (
                            "The extremely positive sentiment surrounding BTC suggests strong market conviction. This often precedes sustained upward movements, particularly when backed by increasing adoption metrics and positive on-chain indicators."
                          ) : sentimentData.currentScore.sentiment === 'bullish' ? (
                            "Market sentiment for BTC remains positive with steady growth in network activity. The balance of positive news coverage and retail sentiment suggests continued strength, though with typical volatility."
                          ) : sentimentData.currentScore.sentiment === 'neutral' ? (
                            "BTC market sentiment appears balanced between bullish and bearish factors. This consolidation phase often precedes directional moves, with technical indicators suggesting a potential for both scenarios."
                          ) : sentimentData.currentScore.sentiment === 'bearish' ? (
                            "Negative sentiment prevails in BTC markets, with concerns about regulatory developments and macro economic factors. On-chain metrics show some distribution patterns from long-term holders."
                          ) : (
                            "Extremely bearish sentiment dominates BTC markets, with cascading negative news and technical breakdowns. Such extreme negativity can sometimes indicate capitulation phases that precede market bottoms."
                          )
                        ) : (
                          "Loading market insight..."
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-black/30 border border-gray-800 rounded-md p-4">
                    <h3 className="text-sm font-medium mb-2 flex items-center">
                      <Shield className="h-4 w-4 mr-2 text-blue-400" />
                      Risk Assessment
                    </h3>
                    {!isLoading && sentimentData ? (
                      <div className="space-y-2">
                        <div className="text-sm">
                          Sentiment Risk: {' '}
                          <Badge className={
                            sentimentData.currentScore.sentiment === 'very-bullish' || sentimentData.currentScore.sentiment === 'very-bearish' 
                              ? 'bg-red-600' 
                              : sentimentData.currentScore.sentiment === 'bullish' || sentimentData.currentScore.sentiment === 'bearish'
                                ? 'bg-yellow-600'
                                : 'bg-green-600'
                          }>
                            {sentimentData.currentScore.sentiment === 'very-bullish' || sentimentData.currentScore.sentiment === 'very-bearish'
                              ? 'High'
                              : sentimentData.currentScore.sentiment === 'bullish' || sentimentData.currentScore.sentiment === 'bearish'
                                ? 'Medium'
                                : 'Low'
                            }
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-400">
                          {sentimentData.currentScore.sentiment === 'very-bullish' || sentimentData.currentScore.sentiment === 'very-bearish'
                            ? 'Extreme sentiment often indicates elevated volatility risk.'
                            : sentimentData.currentScore.sentiment === 'bullish' || sentimentData.currentScore.sentiment === 'bearish'
                              ? 'Moderate sentiment divergence indicates normal market conditions.'
                              : 'Balanced sentiment suggests lower short-term volatility.'
                          }
                        </p>
                      </div>
                    ) : (
                      <div className="h-12 flex items-center justify-center">
                        <div className="h-4 w-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-black/30 border border-gray-800 rounded-md p-4">
                    <h3 className="text-sm font-medium mb-2 flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-purple-400" />
                      Sentiment Forecast
                    </h3>
                    {!isLoading && sentimentData ? (
                      <div className="space-y-2">
                        <div className="text-sm">
                          Trend: {' '}
                          <Badge className="bg-indigo-600">
                            {sentimentData.historicalScores.length > 2 && 
                             sentimentData.historicalScores[sentimentData.historicalScores.length - 1].score >
                             sentimentData.historicalScores[sentimentData.historicalScores.length - 5].score
                              ? 'Improving'
                              : 'Deteriorating'
                            }
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-400">
                          {sentimentData.historicalScores.length > 2 && 
                           sentimentData.historicalScores[sentimentData.historicalScores.length - 1].score >
                           sentimentData.historicalScores[sentimentData.historicalScores.length - 5].score
                            ? 'Sentiment is improving based on recent social and news metrics, suggesting potential strengthening in market outlook.'
                            : 'Sentiment shows a deteriorating trend over recent data points, suggesting caution may be warranted.'
                          }
                        </p>
                      </div>
                    ) : (
                      <div className="h-12 flex items-center justify-center">
                        <div className="h-4 w-4 border-2 border-t-transparent border-purple-500 rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-black/30 border border-gray-800 rounded-md p-4">
                  <h3 className="text-sm font-medium mb-3">Contrarian Analysis</h3>
                  {!isLoading && sentimentData ? (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-300">
                        {sentimentData.currentScore.sentiment === 'very-bullish' ? (
                          "From a contrarian perspective, extremely bullish sentiment can signal market euphoria and potential overvaluation. Historically, such periods often precede corrections as markets cycle between fear and greed."
                        ) : sentimentData.currentScore.sentiment === 'very-bearish' ? (
                          "From a contrarian perspective, extremely bearish sentiment can indicate capitulation and potential overselling. Such periods have historically presented accumulation opportunities for long-term investors."
                        ) : (
                          "Current sentiment levels don't suggest extreme positioning that would warrant a strong contrarian stance. Market participants appear rationally distributed between bullish and bearish positions."
                        )}
                      </p>
                      
                      {(sentimentData.currentScore.sentiment === 'very-bullish' || sentimentData.currentScore.sentiment === 'very-bearish') && (
                        <div className="bg-yellow-900/20 border border-yellow-900/30 rounded p-3 text-xs text-amber-400">
                          <AlertTriangle className="h-4 w-4 inline-block mr-1" />
                          <span>
                            {sentimentData.currentScore.sentiment === 'very-bullish'
                              ? "Extreme bullish sentiment detected - consider risk management strategies."
                              : "Extreme bearish sentiment detected - potential contrarian opportunity."
                            }
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-16 flex items-center justify-center">
                      <div className="h-5 w-5 border-2 border-t-transparent border-amber-500 rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="alerts">
              <SentimentAlerts assetSymbol={assetSymbol} sentimentData={sentimentData} />
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-between items-center border-t border-gray-800 pt-4">
          <div className="text-xs text-gray-500">
            Data sources: Social media, news articles, forum discussions, technical analysis
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="auto-refresh"
              checked={autoRefresh}
              onCheckedChange={setAutoRefresh}
            />
            <Label htmlFor="auto-refresh" className="text-xs">Auto-refresh</Label>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default SentimentAnalysis;