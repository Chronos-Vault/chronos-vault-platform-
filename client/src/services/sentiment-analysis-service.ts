// Definition of sentiment analysis data types and service

// Sentiment level enum representing possible sentiment classifications
export type SentimentLevel = 
  | 'very_positive'
  | 'positive'
  | 'neutral' 
  | 'negative'
  | 'very_negative';

// Time range for analyzing sentiment
export type TimeRange = '24h' | '7d' | '30d' | '90d'; 

// Key factor affecting sentiment
export interface SentimentFactor {
  factor: string;
  impact: number; // -3 to +3 scale
}

// Source of sentiment data
export interface SentimentSource {
  source: string;
  sentiment: number; // -100 to 100 scale
  influence: number; // 0 to 1 scale, representing percentage of overall sentiment
}

// Action recommendation based on sentiment
export interface ActionRecommendation {
  id: string;
  action: 'buy' | 'sell' | 'hold' | 'reduce' | 'increase';
  reasoning: string;
  confidence: number; // 0 to 1 scale
  timeframe: string;
  suggestedAllocation?: number; // Percentage change in allocation
}

// Sentiment alert
export interface SentimentAlert {
  id: string;
  type: 'warning' | 'opportunity' | 'info' | 'risk';
  title: string;
  description: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
  dismissed?: boolean;
}

// Complete sentiment data structure
export interface SentimentData {
  score: number; // -100 to 100 scale
  level: SentimentLevel;
  previousScore?: number;
  confidence: number; // 0 to 1 scale
  timestamp: string;
  analysisText: string;
  keyFactors: SentimentFactor[];
  sources: SentimentSource[];
  recommendations: ActionRecommendation[];
  alerts: SentimentAlert[];
}

// Local cache to store sentiment data
interface SentimentCache {
  [key: string]: {
    data: SentimentData;
    timestamp: number;
  };
}

class SentimentAnalysisService {
  private cache: SentimentCache = {};
  private cacheValidityMs = 5 * 60 * 1000; // 5 minutes
  
  // Simulated API request for sentiment data
  async getSentimentAnalysis(
    assetSymbol: string = 'BTC',
    timeRange: TimeRange = '24h'
  ): Promise<SentimentData> {
    const cacheKey = `${assetSymbol}_${timeRange}`;
    
    // Check if we have a valid cache entry
    const now = Date.now();
    if (
      this.cache[cacheKey] && 
      now - this.cache[cacheKey].timestamp < this.cacheValidityMs
    ) {
      return this.cache[cacheKey].data;
    }
    
    // For development, we'll simulate a network request with a small delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate random data based on asset and time range
    const data = this.generateSentimentData(assetSymbol, timeRange);
    
    // Cache the result
    this.cache[cacheKey] = {
      data,
      timestamp: now
    };
    
    return data;
  }
  
  // Clear the cache to force fresh data
  clearCache(): void {
    this.cache = {};
  }
  
  // Simulate data generation for development
  private generateSentimentData(
    assetSymbol: string,
    timeRange: TimeRange
  ): SentimentData {
    // The seed ensures consistent results for the same asset and time range
    const seed = this.hashString(`${assetSymbol}_${timeRange}`);
    const random = (min: number, max: number) => {
      const x = Math.sin(seed * 9999) * 10000;
      const r = x - Math.floor(x);
      return min + r * (max - min);
    };
    
    // Generate score between -100 and 100
    let score: number;
    switch (assetSymbol) {
      case 'BTC':
        score = random(20, 80); // Generally positive for BTC
        break;
      case 'ETH':
        score = random(10, 70); // Also positive for ETH
        break;
      case 'SOL':
        score = random(-30, 50); // Mixed for SOL
        break;
      case 'TON':
        score = random(0, 60); // Slightly positive for TON
        break;
      default:
        score = random(-40, 40); // Neutral for other assets
    }
    
    // Adjust based on time range
    if (timeRange === '90d') {
      score *= 0.8; // More conservative for longer time ranges
    } else if (timeRange === '24h') {
      score *= 1.2; // More volatile for shorter time ranges
    }
    
    // Ensure score stays in bounds
    score = Math.max(-100, Math.min(100, score));
    
    // Previous score with some random variation
    const previousScore = score + random(-15, 15);
    
    // Determine sentiment level based on score
    let level: SentimentLevel;
    if (score >= 60) level = 'very_positive';
    else if (score >= 20) level = 'positive';
    else if (score >= -20) level = 'neutral';
    else if (score >= -60) level = 'negative';
    else level = 'very_negative';
    
    // Confidence level (higher for extreme sentiments)
    const confidence = 0.5 + Math.abs(score) / 200 + random(0, 0.3);
    
    // Generate timestamp - within the last day
    const timestamp = new Date(Date.now() - random(0, 24 * 60 * 60 * 1000)).toISOString();
    
    // Generate analysis text based on sentiment level
    let analysisText = '';
    switch (level) {
      case 'very_positive':
        analysisText = `Market sentiment for ${assetSymbol} is extremely bullish in the ${timeRange} timeframe. Strong buying pressure and positive technical indicators suggest continued upward momentum. Institutional interest appears to be increasing, with significant accumulation observed on-chain.`;
        break;
      case 'positive':
        analysisText = `Overall sentiment for ${assetSymbol} is positive in the ${timeRange} period. Recent price action has been favorable, and market participants are generally optimistic. On-chain metrics indicate healthy accumulation patterns and reduced selling pressure.`;
        break;
      case 'neutral':
        analysisText = `Market sentiment for ${assetSymbol} is balanced over the ${timeRange} timeframe. While some indicators suggest potential upside, others indicate caution. Trading volume has been average, and price action remains within established ranges.`;
        break;
      case 'negative':
        analysisText = `Sentiment for ${assetSymbol} has turned bearish in the ${timeRange} timeframe. Recent market movements show increased selling pressure and weakening support levels. Technical indicators suggest possible further downside in the near term.`;
        break;
      case 'very_negative':
        analysisText = `Market sentiment for ${assetSymbol} is strongly bearish over the ${timeRange} period. Significant selling pressure from both retail and institutional participants has been observed. Technical and on-chain metrics indicate potential further decline.`;
        break;
    }
    
    // Generate key factors
    const keyFactors: SentimentFactor[] = [
      {
        factor: 'On-chain activity',
        impact: random(-3, 3)
      },
      {
        factor: 'Social media sentiment',
        impact: random(-3, 3)
      },
      {
        factor: 'Technical indicators',
        impact: random(-3, 3)
      },
      {
        factor: 'Exchange flows',
        impact: random(-3, 3)
      },
      {
        factor: 'Institutional interest',
        impact: random(-3, 3)
      }
    ].sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
    
    // Generate sources
    const sources: SentimentSource[] = [
      {
        source: 'social_media',
        sentiment: score * (0.8 + random(0, 0.4)),
        influence: 0.3 + random(0, 0.1)
      },
      {
        source: 'news_articles',
        sentiment: score * (0.7 + random(0, 0.6)),
        influence: 0.2 + random(0, 0.1)
      },
      {
        source: 'technical_analysis',
        sentiment: score * (0.9 + random(0, 0.2)),
        influence: 0.25 + random(0, 0.1)
      },
      {
        source: 'on_chain_metrics',
        sentiment: score * (0.85 + random(0, 0.3)),
        influence: 0.25 + random(0, 0.1)
      }
    ];
    
    // Normalize influences to sum to 1
    const totalInfluence = sources.reduce((sum, src) => sum + src.influence, 0);
    sources.forEach(src => src.influence = src.influence / totalInfluence);
    
    // Generate recommendations based on sentiment level
    const recommendations: ActionRecommendation[] = [];
    
    if (level === 'very_positive' || level === 'positive') {
      recommendations.push({
        id: '1',
        action: 'buy',
        reasoning: `Strong positive sentiment for ${assetSymbol} suggests potential upside. Technical indicators and on-chain metrics support continued growth.`,
        confidence: 0.7 + random(0, 0.3),
        timeframe: '1-3 months',
        suggestedAllocation: 5 + Math.round(random(0, 15))
      });
      
      if (random(0, 1) > 0.5) {
        recommendations.push({
          id: '2',
          action: 'hold',
          reasoning: `Despite positive outlook, maintaining current position is advised until clear resistance break is confirmed.`,
          confidence: 0.6 + random(0, 0.3),
          timeframe: '1-2 weeks'
        });
      }
    } else if (level === 'neutral') {
      if (score > 0) {
        recommendations.push({
          id: '1',
          action: 'hold',
          reasoning: `Market sentiment is balanced with slight positive bias. Current positions should be maintained while monitoring key resistance levels.`,
          confidence: 0.5 + random(0, 0.3),
          timeframe: '2-4 weeks'
        });
        
        if (random(0, 1) > 0.6) {
          recommendations.push({
            id: '2',
            action: 'increase',
            reasoning: `Consider small position increase if price breaks above key resistance levels.`,
            confidence: 0.4 + random(0, 0.3),
            timeframe: '1-2 weeks',
            suggestedAllocation: 2 + Math.round(random(0, 8))
          });
        }
      } else {
        recommendations.push({
          id: '1',
          action: 'hold',
          reasoning: `Market sentiment is balanced with slight negative bias. Current positions should be maintained while monitoring key support levels.`,
          confidence: 0.5 + random(0, 0.3),
          timeframe: '2-4 weeks'
        });
        
        if (random(0, 1) > 0.6) {
          recommendations.push({
            id: '2',
            action: 'reduce',
            reasoning: `Consider slight reduction in exposure if key support levels are broken.`,
            confidence: 0.4 + random(0, 0.3),
            timeframe: '1-2 weeks',
            suggestedAllocation: -1 * (2 + Math.round(random(0, 8)))
          });
        }
      }
    } else {
      recommendations.push({
        id: '1',
        action: 'reduce',
        reasoning: `Negative market sentiment indicates increased risk. Consider reducing exposure to minimize potential downside.`,
        confidence: 0.6 + random(0, 0.3),
        timeframe: '1-4 weeks',
        suggestedAllocation: -1 * (10 + Math.round(random(0, 20)))
      });
      
      if (level === 'very_negative' && random(0, 1) > 0.3) {
        recommendations.push({
          id: '2',
          action: 'sell',
          reasoning: `Strong bearish signals across multiple indicators. Technical and on-chain metrics suggest further downside.`,
          confidence: 0.7 + random(0, 0.3),
          timeframe: '1-2 months',
          suggestedAllocation: -100
        });
      }
    }
    
    // Generate alerts based on sentiment and recommendations
    const alerts: SentimentAlert[] = [];
    
    // Add only alerts that match current market conditions
    if (score > 60) {
      alerts.push({
        id: '1',
        type: 'opportunity',
        title: `Strong bullish signal for ${assetSymbol}`,
        description: `Multiple indicators suggest significant upside potential in the near term. Consider increasing allocation.`,
        timestamp: new Date(Date.now() - random(0, 12 * 60 * 60 * 1000)).toISOString(),
        priority: 'high'
      });
    } else if (score < -60) {
      alerts.push({
        id: '1',
        type: 'risk',
        title: `Critical bearish warning for ${assetSymbol}`,
        description: `Severe negative sentiment detected across multiple indicators. Consider reducing exposure immediately.`,
        timestamp: new Date(Date.now() - random(0, 12 * 60 * 60 * 1000)).toISOString(),
        priority: 'high'
      });
    } else if (score > 40) {
      alerts.push({
        id: '1',
        type: 'opportunity',
        title: `Positive momentum building for ${assetSymbol}`,
        description: `Sentiment analysis indicates growing bullish momentum. Technical indicators are trending positive.`,
        timestamp: new Date(Date.now() - random(0, 18 * 60 * 60 * 1000)).toISOString(),
        priority: 'medium'
      });
    } else if (score < -40) {
      alerts.push({
        id: '1',
        type: 'warning',
        title: `Bearish trend acceleration for ${assetSymbol}`,
        description: `Sentiment has turned increasingly negative. Consider reviewing your position and risk management strategy.`,
        timestamp: new Date(Date.now() - random(0, 18 * 60 * 60 * 1000)).toISOString(),
        priority: 'medium'
      });
    }
    
    // Sometimes add general market info alert
    if (random(0, 1) > 0.7) {
      alerts.push({
        id: alerts.length ? (parseInt(alerts[0].id) + 1).toString() : '1',
        type: 'info',
        title: `Market volatility expected`,
        description: `Upcoming economic events may increase market volatility. Consider adjusting stop losses and position sizing accordingly.`,
        timestamp: new Date(Date.now() - random(0, 24 * 60 * 60 * 1000)).toISOString(),
        priority: random(0, 1) > 0.5 ? 'medium' : 'low'
      });
    }
    
    return {
      score,
      level,
      previousScore,
      confidence,
      timestamp,
      analysisText,
      keyFactors,
      sources,
      recommendations,
      alerts
    };
  }
  
  // Simple string hash function for generating pseudo-random numbers
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }
}

export const sentimentAnalysisService = new SentimentAnalysisService();