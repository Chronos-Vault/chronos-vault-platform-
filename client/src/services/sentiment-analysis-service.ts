/**
 * Market Sentiment Analysis Service
 * 
 * This service provides AI-powered market sentiment analysis functionality
 * by processing news, social media, and market data to generate insights.
 */

// Types for sentiment analysis
export type SentimentLevel = 'extremely_bearish' | 'bearish' | 'slightly_bearish' | 'neutral' | 'slightly_bullish' | 'bullish' | 'extremely_bullish';

export type NewsSource = 'twitter' | 'reddit' | 'news_articles' | 'blockchain_metrics' | 'exchange_data';

export type TimeRange = '24h' | '7d' | '30d' | '90d';

export interface SentimentAlert {
  id: string;
  asset: string;
  level: SentimentLevel;
  title: string;
  description: string;
  timestamp: number;
  source: NewsSource;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  tags: string[];
}

export interface ActionRecommendation {
  id: string;
  action: 'buy' | 'sell' | 'hold' | 'reduce' | 'increase';
  asset: string;
  confidence: number;
  reasoning: string;
  timeframe: string;
  suggestedAllocation?: number;
}

export interface SentimentData {
  asset: string;
  level: SentimentLevel;
  score: number; // -100 to +100
  timestamp: number;
  previousLevel?: SentimentLevel;
  previousScore?: number;
  confidence: number;
  sources: {
    source: NewsSource;
    influence: number; // 0 to 1
    sentiment: number; // -100 to +100
  }[];
  timeRange: TimeRange;
  alerts: SentimentAlert[];
  recommendations: ActionRecommendation[];
  analysisText: string;
  keyFactors: {
    factor: string;
    impact: number; // -3 to +3
  }[];
  trendDirection: 'improving' | 'deteriorating' | 'stable';
}

// Map sentiment level to numerical range
const sentimentLevelToRange = {
  extremely_bearish: [-100, -75],
  bearish: [-75, -40],
  slightly_bearish: [-40, -10],
  neutral: [-10, 10],
  slightly_bullish: [10, 40],
  bullish: [40, 75],
  extremely_bullish: [75, 100]
};

// Determine sentiment level from score
const getScoreFromLevel = (level: SentimentLevel): number => {
  const [min, max] = sentimentLevelToRange[level];
  return (min + max) / 2;
};

// Determine sentiment level from score
const getLevelFromScore = (score: number): SentimentLevel => {
  if (score <= -75) return 'extremely_bearish';
  if (score <= -40) return 'bearish';
  if (score <= -10) return 'slightly_bearish';
  if (score < 10) return 'neutral';
  if (score < 40) return 'slightly_bullish';
  if (score < 75) return 'bullish';
  return 'extremely_bullish';
};

// Helper function to generate random sentiment data
const generateRandomSentimentData = (
  asset: string = 'BTC',
  baseScore: number = 0,
  timeRange: TimeRange = '24h'
): SentimentData => {
  // Adjust base score with some randomness
  const randomVariation = Math.random() * 30 - 15; // -15 to +15 variation
  const score = Math.max(-100, Math.min(100, baseScore + randomVariation));
  
  // Determine sentiment level from score
  const level = getLevelFromScore(score);
  
  // Generate random previous score
  const previousVariation = Math.random() * 20 - 10; // -10 to +10 variation
  const previousScore = Math.max(-100, Math.min(100, score - previousVariation));
  const previousLevel = getLevelFromScore(previousScore);
  
  // Generate random source influences
  const sources = [
    {
      source: 'twitter' as NewsSource,
      influence: 0.3 + Math.random() * 0.4, // 0.3 to 0.7
      sentiment: score + (Math.random() * 30 - 15)
    },
    {
      source: 'reddit' as NewsSource,
      influence: 0.2 + Math.random() * 0.3, // 0.2 to 0.5
      sentiment: score + (Math.random() * 30 - 15)
    },
    {
      source: 'news_articles' as NewsSource,
      influence: 0.5 + Math.random() * 0.3, // 0.5 to 0.8
      sentiment: score + (Math.random() * 20 - 10)
    },
    {
      source: 'blockchain_metrics' as NewsSource,
      influence: 0.6 + Math.random() * 0.3, // 0.6 to 0.9
      sentiment: score + (Math.random() * 20 - 10)
    },
    {
      source: 'exchange_data' as NewsSource,
      influence: 0.4 + Math.random() * 0.4, // 0.4 to 0.8
      sentiment: score + (Math.random() * 25 - 12.5)
    }
  ];
  
  // Generate alerts
  const alerts: SentimentAlert[] = [];
  const alertCount = Math.floor(Math.random() * 4); // 0 to 3 alerts
  
  for (let i = 0; i < alertCount; i++) {
    // Choose a random news source
    const sourceIndex = Math.floor(Math.random() * sources.length);
    const source = sources[sourceIndex].source;
    
    // Generate a sentiment level based on the source's sentiment
    const alertSentiment = sources[sourceIndex].sentiment;
    const alertLevel = getLevelFromScore(alertSentiment) as SentimentLevel;
    
    // Determine impact based on the difference from overall sentiment
    const sentimentDiff = Math.abs(alertSentiment - score);
    let impact: 'high' | 'medium' | 'low' = 'low';
    if (sentimentDiff > 30) impact = 'high';
    else if (sentimentDiff > 15) impact = 'medium';
    
    // Generate alert text based on the source and sentiment
    let title = '';
    let description = '';
    
    switch (source) {
      case 'twitter':
        if (alertLevel.includes('bullish')) {
          title = `Positive ${asset} sentiment trend on Twitter`;
          description = `Social media analysis shows increasing positive sentiment around ${asset} with growing discussion volume.`;
        } else if (alertLevel.includes('bearish')) {
          title = `Negative ${asset} sentiment spreading on Twitter`;
          description = `Social media monitoring detected a surge in negative comments about ${asset} among influential accounts.`;
        } else {
          title = `Mixed ${asset} discussions on Twitter`;
          description = `Twitter sentiment is showing conflicting signals about ${asset} with no clear consensus.`;
        }
        break;
        
      case 'reddit':
        if (alertLevel.includes('bullish')) {
          title = `${asset} enthusiasm grows on Reddit forums`;
          description = `Reddit communities are showing increased optimism about ${asset} fundamentals and upcoming developments.`;
        } else if (alertLevel.includes('bearish')) {
          title = `Reddit communities express concern about ${asset}`;
          description = `Popular crypto forums on Reddit demonstrate growing skepticism about ${asset}'s near-term prospects.`;
        } else {
          title = `Balanced ${asset} discussions on Reddit`;
          description = `Reddit analysis shows community sentiment is balanced with equal positive and negative discussions.`;
        }
        break;
        
      case 'news_articles':
        if (alertLevel.includes('bullish')) {
          title = `Positive ${asset} coverage in financial press`;
          description = `Major financial news outlets are publishing favorable articles about ${asset}'s fundamentals and adoption metrics.`;
        } else if (alertLevel.includes('bearish')) {
          title = `Critical ${asset} reports in mainstream media`;
          description = `Recent news articles highlight potential risks and challenges facing ${asset} in the current market environment.`;
        } else {
          title = `Mixed ${asset} coverage in news outlets`;
          description = `Financial media presents balanced reporting on ${asset} with equal coverage of risks and opportunities.`;
        }
        break;
        
      case 'blockchain_metrics':
        if (alertLevel.includes('bullish')) {
          title = `Strong ${asset} on-chain fundamentals detected`;
          description = `On-chain analysis shows improving adoption metrics with increased active addresses and transaction volume.`;
        } else if (alertLevel.includes('bearish')) {
          title = `Concerning ${asset} on-chain trends`;
          description = `Blockchain analysis indicates decreasing network activity and potentially concerning distribution patterns.`;
        } else {
          title = `Steady ${asset} on-chain metrics`;
          description = `Blockchain data shows stable utilization with no significant changes in key network metrics.`;
        }
        break;
        
      case 'exchange_data':
        if (alertLevel.includes('bullish')) {
          title = `Bullish ${asset} exchange flows detected`;
          description = `Exchange outflows are exceeding inflows, suggesting accumulation and reduced selling pressure.`;
        } else if (alertLevel.includes('bearish')) {
          title = `${asset} exchange inflows accelerating`;
          description = `Large inflows to exchanges could signal increased selling pressure in the near term.`;
        } else {
          title = `Balanced ${asset} exchange flows`;
          description = `Exchange inflows and outflows are currently balanced with no clear directional signals.`;
        }
        break;
    }
    
    alerts.push({
      id: `alert-${i}-${Date.now()}`,
      asset,
      level: alertLevel,
      title,
      description,
      timestamp: Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000), // 0-24 hours ago
      source,
      confidence: 0.5 + Math.random() * 0.4, // 0.5 to 0.9
      impact,
      tags: generateRandomTags(source, alertLevel)
    });
  }
  
  // Generate recommendations
  const recommendations: ActionRecommendation[] = generateRecommendations(asset, score, level);
  
  // Generate key factors
  const keyFactors = generateKeyFactors(asset, score);
  
  // Generate trend direction
  let trendDirection: 'improving' | 'deteriorating' | 'stable';
  const scoreDiff = score - (previousScore || 0);
  if (Math.abs(scoreDiff) < 5) trendDirection = 'stable';
  else trendDirection = scoreDiff > 0 ? 'improving' : 'deteriorating';
  
  // Generate analysis text
  const analysisText = generateAnalysisText(asset, score, level, trendDirection, keyFactors);
  
  return {
    asset,
    level,
    score,
    timestamp: Date.now(),
    previousLevel,
    previousScore,
    confidence: 0.65 + Math.random() * 0.25, // 0.65 to 0.9
    sources,
    timeRange,
    alerts,
    recommendations,
    analysisText,
    keyFactors,
    trendDirection
  };
};

// Helper function to generate random tags
const generateRandomTags = (source: NewsSource, level: SentimentLevel): string[] => {
  const baseTags = ['market_sentiment', 'analysis'];
  
  if (level.includes('bullish')) {
    baseTags.push('positive', 'optimistic');
  } else if (level.includes('bearish')) {
    baseTags.push('negative', 'cautious');
  } else {
    baseTags.push('neutral', 'mixed');
  }
  
  switch (source) {
    case 'twitter':
      baseTags.push('social_media', 'twitter');
      break;
    case 'reddit':
      baseTags.push('social_media', 'reddit', 'community');
      break;
    case 'news_articles':
      baseTags.push('news', 'media');
      break;
    case 'blockchain_metrics':
      baseTags.push('on_chain', 'fundamentals', 'blockchain_data');
      break;
    case 'exchange_data':
      baseTags.push('exchange', 'trading', 'flows');
      break;
  }
  
  return baseTags;
};

// Helper function to generate recommendations
const generateRecommendations = (asset: string, score: number, level: SentimentLevel): ActionRecommendation[] => {
  const recommendations: ActionRecommendation[] = [];
  
  // First recommendation is based on the overall sentiment
  if (score >= 40) {
    recommendations.push({
      id: `rec-1-${Date.now()}`,
      action: 'buy',
      asset,
      confidence: 0.6 + Math.random() * 0.3,
      reasoning: `Strong positive sentiment across multiple data sources suggests favorable conditions for ${asset} in the short term.`,
      timeframe: 'short-term',
      suggestedAllocation: 5 + Math.floor(Math.random() * 10) // 5-15%
    });
  } else if (score >= 10) {
    recommendations.push({
      id: `rec-1-${Date.now()}`,
      action: 'increase',
      asset,
      confidence: 0.5 + Math.random() * 0.3,
      reasoning: `Moderately positive market sentiment indicates potential upside for ${asset}. Consider increasing exposure gradually.`,
      timeframe: 'medium-term',
      suggestedAllocation: 3 + Math.floor(Math.random() * 5) // 3-8%
    });
  } else if (score <= -40) {
    recommendations.push({
      id: `rec-1-${Date.now()}`,
      action: 'reduce',
      asset,
      confidence: 0.6 + Math.random() * 0.3,
      reasoning: `Significant negative sentiment suggests increased downside risk. Consider reducing exposure to mitigate potential losses.`,
      timeframe: 'short-term',
      suggestedAllocation: -1 * (5 + Math.floor(Math.random() * 10)) // -5 to -15%
    });
  } else if (score <= -10) {
    recommendations.push({
      id: `rec-1-${Date.now()}`,
      action: 'hold',
      asset,
      confidence: 0.5 + Math.random() * 0.3,
      reasoning: `Slightly negative market sentiment, but no extreme signals. Maintain positions while closely monitoring market developments.`,
      timeframe: 'medium-term'
    });
  } else {
    recommendations.push({
      id: `rec-1-${Date.now()}`,
      action: 'hold',
      asset,
      confidence: 0.7 + Math.random() * 0.2,
      reasoning: `Neutral market sentiment indicates balanced risk-reward. Maintain current strategy without significant changes.`,
      timeframe: 'medium-term'
    });
  }
  
  // Second recommendation is more nuanced or contrarian
  if (Math.random() > 0.5) { // 50% chance of getting a second recommendation
    if (score >= 70) {
      // Extremely bullish sentiment might signal overheating
      recommendations.push({
        id: `rec-2-${Date.now()}`,
        action: 'hold',
        asset,
        confidence: 0.4 + Math.random() * 0.3,
        reasoning: `Despite very positive sentiment, consider the risk of market exuberance. Maintain positions but prepare for potential volatility.`,
        timeframe: 'long-term'
      });
    } else if (score <= -70) {
      // Extremely bearish sentiment might signal bottoming
      recommendations.push({
        id: `rec-2-${Date.now()}`,
        action: 'buy',
        asset,
        confidence: 0.4 + Math.random() * 0.3,
        reasoning: `Extreme negative sentiment can represent capitulation. Consider establishing small positions if aligned with long-term strategy.`,
        timeframe: 'long-term',
        suggestedAllocation: 2 + Math.floor(Math.random() * 3) // 2-5%
      });
    } else if (score >= 20 && score < 60) {
      // Moderately positive with some caution
      recommendations.push({
        id: `rec-2-${Date.now()}`,
        action: 'buy',
        asset,
        confidence: 0.5 + Math.random() * 0.2,
        reasoning: `Consider dollar-cost averaging strategy to take advantage of positive momentum while managing risk.`,
        timeframe: 'long-term',
        suggestedAllocation: 3 + Math.floor(Math.random() * 5) // 3-8%
      });
    }
  }
  
  return recommendations;
};

// Helper function to generate key factors
const generateKeyFactors = (asset: string, score: number): { factor: string; impact: number }[] => {
  const factors = [
    {
      factor: "Social media sentiment",
      impact: Math.round((Math.random() * 4 - 2 + Math.sign(score) * 1) * 10) / 10 // Biased toward overall sentiment
    },
    {
      factor: "Trading volume trends",
      impact: Math.round((Math.random() * 4 - 2 + Math.sign(score) * 1) * 10) / 10
    },
    {
      factor: "News cycle sentiment",
      impact: Math.round((Math.random() * 4 - 2 + Math.sign(score) * 0.8) * 10) / 10
    },
    {
      factor: "On-chain transaction activity",
      impact: Math.round((Math.random() * 4 - 2 + Math.sign(score) * 0.5) * 10) / 10
    },
    {
      factor: "Technical indicators",
      impact: Math.round((Math.random() * 4 - 2 + Math.sign(score) * 0.7) * 10) / 10
    }
  ];
  
  // Sort by absolute impact and take the top 3-5 factors
  return factors
    .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
    .slice(0, 3 + Math.floor(Math.random() * 3));
};

// Helper function to generate analysis text
const generateAnalysisText = (
  asset: string,
  score: number,
  level: SentimentLevel,
  trendDirection: 'improving' | 'deteriorating' | 'stable',
  keyFactors: { factor: string; impact: number }[]
): string => {
  const sentimentDescription = (() => {
    if (level === 'extremely_bullish') return 'extremely positive';
    if (level === 'bullish') return 'strongly positive';
    if (level === 'slightly_bullish') return 'somewhat positive';
    if (level === 'neutral') return 'neutral';
    if (level === 'slightly_bearish') return 'somewhat negative';
    if (level === 'bearish') return 'strongly negative';
    if (level === 'extremely_bearish') return 'extremely negative';
    return 'mixed';
  })();
  
  const trendDescription = (() => {
    if (trendDirection === 'improving') return 'improving';
    if (trendDirection === 'deteriorating') return 'deteriorating';
    return 'remaining stable';
  })();
  
  // Start with a summary of the sentiment
  let analysis = `Market sentiment for ${asset} is currently ${sentimentDescription} and ${trendDescription} compared to previous analysis. `;
  
  // Add information about key factors
  analysis += `The most significant factors influencing this sentiment are `;
  
  const positiveFactors = keyFactors.filter(f => f.impact > 0).map(f => f.factor.toLowerCase());
  const negativeFactors = keyFactors.filter(f => f.impact < 0).map(f => f.factor.toLowerCase());
  
  if (positiveFactors.length > 0) {
    analysis += `positive signals from ${positiveFactors.join(', ')}`;
    
    if (negativeFactors.length > 0) {
      analysis += `, while ${negativeFactors.join(', ')} contribute negative pressure. `;
    } else {
      analysis += `. `;
    }
  } else if (negativeFactors.length > 0) {
    analysis += `negative pressure from ${negativeFactors.join(', ')}. `;
  } else {
    analysis += `mixed signals across different indicators. `;
  }
  
  // Add conclusive sentiment based on the level
  if (level.includes('bullish')) {
    analysis += `The overall sentiment suggests favorable market conditions for ${asset} `;
    
    if (level === 'extremely_bullish') {
      analysis += `with potential for significant upward movement, though such extreme sentiment readings warrant caution for potential market euphoria.`;
    } else if (level === 'bullish') {
      analysis += `with solid support from multiple sentiment indicators.`;
    } else {
      analysis += `though the strength of this signal is relatively modest.`;
    }
  } else if (level.includes('bearish')) {
    analysis += `The overall sentiment suggests challenging market conditions for ${asset} `;
    
    if (level === 'extremely_bearish') {
      analysis += `with increased downside risk, though such extreme negative sentiment can sometimes indicate potential capitulation or overselling.`;
    } else if (level === 'bearish') {
      analysis += `with consistent negative signals across sentiment indicators.`;
    } else {
      analysis += `though the negative signals are relatively mild at this stage.`;
    }
  } else {
    analysis += `The overall sentiment is balanced with no strong directional bias, suggesting a period of consolidation or indecision in the market.`;
  }
  
  return analysis;
};

/**
 * Sentiment Analysis Service
 * This service provides AI-powered market sentiment analysis.
 */
class SentimentAnalysisService {
  private cachedSentiment: Record<string, Record<TimeRange, SentimentData>> = {};
  private lastUpdateTimestamp: number = 0;
  
  /**
   * Get sentiment analysis for a specific asset and time range
   */
  async getSentimentAnalysis(
    asset: string = 'BTC',
    timeRange: TimeRange = '24h'
  ): Promise<SentimentData> {
    const now = Date.now();
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    
    // Use cached data if available and fresh
    if (
      this.cachedSentiment[asset]?.[timeRange] &&
      now - this.lastUpdateTimestamp < CACHE_DURATION
    ) {
      return this.cachedSentiment[asset][timeRange];
    }

    try {
      // In a real implementation, we would fetch data from an API
      // For this demo, we'll generate sample data
      let baseScore = 0;
      switch (asset) {
        case 'BTC':
          baseScore = 45; // Bullish
          break;
        case 'ETH':
          baseScore = 20; // Slightly bullish
          break;
        case 'SOL':
          baseScore = 65; // Strongly bullish
          break;
        case 'LINK':
          baseScore = -10; // Slightly bearish
          break;
        default:
          baseScore = 0; // Neutral
      }
      
      // Adjust score based on time range
      if (timeRange === '7d') baseScore -= 10;
      else if (timeRange === '30d') baseScore -= 20;
      else if (timeRange === '90d') baseScore -= 30;
      
      const sentimentData = generateRandomSentimentData(asset, baseScore, timeRange);
      
      // Cache the result
      if (!this.cachedSentiment[asset]) {
        this.cachedSentiment[asset] = {} as Record<TimeRange, SentimentData>;
      }
      this.cachedSentiment[asset][timeRange] = sentimentData;
      this.lastUpdateTimestamp = now;
      
      return sentimentData;
    } catch (error) {
      console.error("Error fetching sentiment analysis:", error);
      throw error;
    }
  }
  
  /**
   * Get recent sentiment alerts for an asset
   */
  async getSentimentAlerts(
    asset: string = 'BTC',
    timeRange: TimeRange = '24h',
    limit: number = 5
  ): Promise<SentimentAlert[]> {
    const sentimentData = await this.getSentimentAnalysis(asset, timeRange);
    return sentimentData.alerts.slice(0, limit);
  }
  
  /**
   * Get action recommendations for an asset
   */
  async getActionRecommendations(
    asset: string = 'BTC',
    timeRange: TimeRange = '24h'
  ): Promise<ActionRecommendation[]> {
    const sentimentData = await this.getSentimentAnalysis(asset, timeRange);
    return sentimentData.recommendations;
  }
  
  /**
   * Clear the cache to force fresh data fetch
   */
  clearCache(): void {
    this.cachedSentiment = {};
    this.lastUpdateTimestamp = 0;
  }
}

export const sentimentAnalysisService = new SentimentAnalysisService();