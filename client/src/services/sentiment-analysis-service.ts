/**
 * Sentiment Analysis Service
 * 
 * This service integrates with market sentiment APIs to provide real-time
 * market sentiment data for cryptocurrency markets. It helps users make
 * better investment decisions by identifying periods of extreme fear or greed.
 */

// Sentiment score ranges
export enum SentimentLevel {
  EXTREME_FEAR = 'extreme_fear',
  FEAR = 'fear',
  NEUTRAL = 'neutral', 
  GREED = 'greed',
  EXTREME_GREED = 'extreme_greed'
}

export interface SentimentData {
  value: number;           // 0-100 sentiment value
  classification: SentimentLevel;
  previousValue?: number;  // Yesterday's value
  previousClose?: number;  // Previous day close value
  timestamp: string;       // ISO date string
  source: string;          // Source of sentiment data
}

export interface MarketIndicators {
  volatility: number;      // 0-100 market volatility
  momentum: number;        // -100 to 100 market momentum
  trendStrength: number;   // 0-100 trend strength
  volumeRatio: number;     // Ratio of current volume to average
}

// Sentiment threshold configuration
export interface SentimentThresholds {
  extremeFear: number;     // 0-25 default
  fear: number;            // 26-40 default
  neutral: number;         // 41-60 default
  greed: number;           // 61-75 default
  extremeGreed: number;    // 76-100 default
}

const DEFAULT_THRESHOLDS: SentimentThresholds = {
  extremeFear: 25,
  fear: 40,
  neutral: 60,
  greed: 75,
  extremeGreed: 100
};

export class SentimentAnalysisService {
  private sentimentCache: Map<string, SentimentData> = new Map();
  private indicatorsCache: Map<string, MarketIndicators> = new Map();
  private thresholds: SentimentThresholds = DEFAULT_THRESHOLDS;
  
  constructor(customThresholds?: Partial<SentimentThresholds>) {
    if (customThresholds) {
      this.thresholds = { ...DEFAULT_THRESHOLDS, ...customThresholds };
    }
  }
  
  /**
   * Fetch current market sentiment for a specific asset
   * @param assetSymbol The cryptocurrency symbol (BTC, ETH, etc.)
   * @returns Promise with sentiment data
   */
  async getSentiment(assetSymbol: string): Promise<SentimentData> {
    const cachedData = this.sentimentCache.get(assetSymbol);
    const now = new Date();
    
    // Check if we have recent cached data (last 60 minutes)
    if (cachedData && now.getTime() - new Date(cachedData.timestamp).getTime() < 60 * 60 * 1000) {
      return cachedData;
    }
    
    try {
      // In a real implementation, we would fetch data from an external API
      // For this example, we generate realistic but simulated data
      const sentimentData = this.simulateSentimentData(assetSymbol);
      
      // Update cache
      this.sentimentCache.set(assetSymbol, sentimentData);
      
      return sentimentData;
    } catch (error) {
      console.error('Error fetching sentiment data:', error);
      throw new Error('Failed to retrieve sentiment data');
    }
  }
  
  /**
   * Get market indicators for an asset
   * @param assetSymbol The cryptocurrency symbol (BTC, ETH, etc.)
   * @returns Promise with market indicators
   */
  async getMarketIndicators(assetSymbol: string): Promise<MarketIndicators> {
    const cachedData = this.indicatorsCache.get(assetSymbol);
    const now = new Date();
    
    // Check if we have recent cached data (last 30 minutes)
    if (cachedData && now.getTime() - new Date().getTime() < 30 * 60 * 1000) {
      return cachedData;
    }
    
    try {
      // In a real implementation, we would fetch data from an external API
      // For this example, we generate realistic but simulated data
      const marketIndicators = this.simulateMarketIndicators(assetSymbol);
      
      // Update cache
      this.indicatorsCache.set(assetSymbol, marketIndicators);
      
      return marketIndicators;
    } catch (error) {
      console.error('Error fetching market indicators:', error);
      throw new Error('Failed to retrieve market indicators');
    }
  }
  
  /**
   * Check if current market conditions indicate a potential bubble
   * @param assetSymbol The cryptocurrency symbol
   * @returns Promise<boolean> indicating if bubble conditions are present
   */
  async isBubbleCondition(assetSymbol: string): Promise<boolean> {
    try {
      const sentiment = await this.getSentiment(assetSymbol);
      const indicators = await this.getMarketIndicators(assetSymbol);
      
      // Define bubble conditions (extreme greed with high volatility and momentum)
      return (
        sentiment.classification === SentimentLevel.EXTREME_GREED &&
        indicators.volatility > 75 &&
        indicators.momentum > 80 &&
        indicators.volumeRatio > 2.5
      );
    } catch (error) {
      console.error('Error detecting bubble condition:', error);
      return false;
    }
  }
  
  /**
   * Check if current market conditions indicate a potential panic selloff
   * @param assetSymbol The cryptocurrency symbol
   * @returns Promise<boolean> indicating if panic conditions are present
   */
  async isPanicCondition(assetSymbol: string): Promise<boolean> {
    try {
      const sentiment = await this.getSentiment(assetSymbol);
      const indicators = await this.getMarketIndicators(assetSymbol);
      
      // Define panic conditions (extreme fear with high volatility and negative momentum)
      return (
        sentiment.classification === SentimentLevel.EXTREME_FEAR &&
        indicators.volatility > 70 &&
        indicators.momentum < -70 &&
        indicators.volumeRatio > 3
      );
    } catch (error) {
      console.error('Error detecting panic condition:', error);
      return false;
    }
  }
  
  /**
   * Get recommended adjustment for investment strategy based on market sentiment
   * @param assetSymbol The cryptocurrency symbol
   * @param basePercentage The base percentage for the action
   * @returns Promise with the adjusted percentage
   */
  async getAdjustedPercentage(assetSymbol: string, basePercentage: number): Promise<number> {
    try {
      const sentiment = await this.getSentiment(assetSymbol);
      
      // Adjust percentages based on sentiment
      switch (sentiment.classification) {
        case SentimentLevel.EXTREME_FEAR:
          // During extreme fear, reduce sell percentages (buying opportunity)
          return Math.max(basePercentage * 0.5, 5);
          
        case SentimentLevel.FEAR:
          // During fear, slightly reduce sell percentages
          return Math.max(basePercentage * 0.8, 5);
          
        case SentimentLevel.NEUTRAL:
          // No adjustment during neutral sentiment
          return basePercentage;
          
        case SentimentLevel.GREED:
          // During greed, increase sell percentages
          return Math.min(basePercentage * 1.2, 100);
          
        case SentimentLevel.EXTREME_GREED:
          // During extreme greed, strongly increase sell percentages (selling opportunity)
          return Math.min(basePercentage * 1.5, 100);
          
        default:
          return basePercentage;
      }
    } catch (error) {
      console.error('Error calculating adjusted percentage:', error);
      return basePercentage; // Fall back to the base percentage
    }
  }
  
  /**
   * Get action recommendations based on current market sentiment
   * @param assetSymbol The cryptocurrency symbol
   * @returns Promise with recommended actions
   */
  async getActionRecommendations(assetSymbol: string): Promise<string[]> {
    try {
      const sentiment = await this.getSentiment(assetSymbol);
      const indicators = await this.getMarketIndicators(assetSymbol);
      const recommendations: string[] = [];
      
      // Generate recommendations based on sentiment and indicators
      switch (sentiment.classification) {
        case SentimentLevel.EXTREME_FEAR:
          recommendations.push("Consider reducing planned sell amounts during this period of extreme fear");
          recommendations.push("Implement a cooling-off period before making large sell decisions");
          if (indicators.volatility > 80) {
            recommendations.push("High market volatility detected - enable volatility protection");
          }
          break;
          
        case SentimentLevel.FEAR:
          recommendations.push("Market sentiment shows fear - proceed with caution on sell decisions");
          if (indicators.trendStrength > 70 && indicators.momentum < -50) {
            recommendations.push("Strong downtrend detected - consider adjusting time-based exit points");
          }
          break;
          
        case SentimentLevel.NEUTRAL:
          recommendations.push("Market sentiment is neutral - maintain original strategy");
          break;
          
        case SentimentLevel.GREED:
          recommendations.push("Market showing signs of greed - consider increasing profit-taking targets");
          if (indicators.momentum > 60) {
            recommendations.push("Strong positive momentum - watch for potential local tops");
          }
          break;
          
        case SentimentLevel.EXTREME_GREED:
          recommendations.push("Extreme greed detected - raise profit-taking percentages");
          recommendations.push("Enable FOMO protection to prevent impulsive buying");
          if (await this.isBubbleCondition(assetSymbol)) {
            recommendations.push("WARNING: Potential market bubble conditions detected");
          }
          break;
      }
      
      return recommendations;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return ["Unable to generate recommendations due to data retrieval issues"];
    }
  }
  
  /**
   * Simulate market sentiment data
   * In a real implementation, this would be replaced with API calls
   */
  private simulateSentimentData(assetSymbol: string): SentimentData {
    // For demo purposes, we generate realistic but simulated sentiment values
    // In production, this would call an actual sentiment API
    const now = new Date();
    
    // Generate a sentiment value between 0-100 that varies by asset
    // This is just for demonstration - real data would come from APIs
    const baseValue = assetSymbol === 'BTC' ? 65 : 
                     assetSymbol === 'ETH' ? 72 :
                     assetSymbol === 'SOL' ? 58 : 55;
    
    // Add some randomness while keeping within realistic bounds
    const randomFactor = Math.random() * 20 - 10; // -10 to +10
    const value = Math.min(Math.max(baseValue + randomFactor, 0), 100);
    
    // Determine classification based on thresholds
    let classification: SentimentLevel;
    if (value <= this.thresholds.extremeFear) {
      classification = SentimentLevel.EXTREME_FEAR;
    } else if (value <= this.thresholds.fear) {
      classification = SentimentLevel.FEAR;
    } else if (value <= this.thresholds.neutral) {
      classification = SentimentLevel.NEUTRAL;
    } else if (value <= this.thresholds.greed) {
      classification = SentimentLevel.GREED;
    } else {
      classification = SentimentLevel.EXTREME_GREED;
    }
    
    return {
      value: Math.round(value),
      classification,
      previousValue: Math.round(value - (Math.random() * 8 - 4)),
      timestamp: now.toISOString(),
      source: 'Chronos Vault Sentiment Index'
    };
  }
  
  /**
   * Simulate market indicators
   * In a real implementation, this would be replaced with API calls
   */
  private simulateMarketIndicators(assetSymbol: string): MarketIndicators {
    // For demo purposes, generate realistic but simulated market indicators
    // In production, this would call actual market data APIs
    
    // Generate indicators specific to the asset type
    let volatility, momentum, trendStrength, volumeRatio;
    
    switch (assetSymbol) {
      case 'BTC':
        volatility = 35 + Math.random() * 20;
        momentum = 30 + Math.random() * 40;
        trendStrength = 65 + Math.random() * 15;
        volumeRatio = 1.2 + Math.random() * 0.8;
        break;
      case 'ETH':
        volatility = 40 + Math.random() * 25;
        momentum = 20 + Math.random() * 50;
        trendStrength = 55 + Math.random() * 20;
        volumeRatio = 1.5 + Math.random() * 1;
        break;
      case 'SOL':
        volatility = 50 + Math.random() * 30;
        momentum = 10 + Math.random() * 60;
        trendStrength = 45 + Math.random() * 25;
        volumeRatio = 1.8 + Math.random() * 1.2;
        break;
      default:
        volatility = 45 + Math.random() * 25;
        momentum = 0 + Math.random() * 50;
        trendStrength = 50 + Math.random() * 20;
        volumeRatio = 1.0 + Math.random() * 1.5;
    }
    
    return {
      volatility: Math.round(volatility),
      momentum: Math.round(momentum),
      trendStrength: Math.round(trendStrength),
      volumeRatio: parseFloat(volumeRatio.toFixed(2))
    };
  }
}

// Export singleton instance for use throughout the app
export const sentimentAnalysisService = new SentimentAnalysisService();