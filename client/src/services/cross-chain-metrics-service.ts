// Trinity Protocol v3.5.18 - Updated: 2025-11-25T19:32:01.926Z
import { BlockchainType } from '@/contexts/multi-chain-context';

// Types for cross-chain metrics
export interface ChainMetrics {
  chainId: BlockchainType;
  chainName: string;
  transactionFee: number; // in USD
  averageBlockTime: number; // in seconds
  securityScore: number; // 0-100
  congestionLevel: number; // 0-100
  performanceScore: number; // 0-100
  lastUpdated: Date;
}

export interface CrossChainComparisonData {
  chains: ChainMetrics[];
  recommendedChain: BlockchainType;
  potentialSavings: number; // in USD
  speedImprovement: number; // in percentage
  securityDifference: number; // in percentage (+ is better, - is worse)
}

// Chain-specific API interfaces
interface EthereumGasData {
  safeLow: number;
  standard: number;
  fast: number;
  fastest: number;
  blockTime: number;
  blockNumber: number;
}

interface SolanaNetworkData {
  currentSlot: number;
  averageSlotTime: number;
  transactionCount: number;
  validatorCount: number;
}

interface TonNetworkData {
  blockTime: number;
  validatorsCount: number;
  transactionFee: number;
}

/**
 * Service for collecting and analyzing cross-chain metrics
 */
class CrossChainMetricsService {
  private static instance: CrossChainMetricsService;
  private baseEthereumUrl = 'https://api.etherscan.io/api';
  private baseSolanaUrl = 'https://api.devnet.solana.com';
  private baseTonUrl = 'https://toncenter.com/api/v2';
  
  // API keys would normally be stored in environment variables
  private ethereumApiKey = ''; // To be provided securely
  private solanaApiKey = ''; // To be provided securely
  private tonApiKey = ''; // To be provided securely
  
  // Cache for metrics data to reduce API calls
  private metricsCache: Map<BlockchainType, ChainMetrics> = new Map();
  private lastFetchTime: Map<BlockchainType, number> = new Map();
  private cacheValidityPeriod = 60 * 1000; // 60 seconds in milliseconds
  
  // Default/fallback metrics for development/testing
  private defaultMetrics = {
    [BlockchainType.ETHEREUM]: {
      chainId: BlockchainType.ETHEREUM,
      chainName: 'Ethereum',
      transactionFee: 2.45,
      averageBlockTime: 12,
      securityScore: 95,
      congestionLevel: 70,
      performanceScore: 75,
      lastUpdated: new Date()
    },
    [BlockchainType.SOLANA]: {
      chainId: BlockchainType.SOLANA,
      chainName: 'Solana',
      transactionFee: 0.001,
      averageBlockTime: 0.4,
      securityScore: 80,
      congestionLevel: 30,
      performanceScore: 95,
      lastUpdated: new Date()
    },
    [BlockchainType.TON]: {
      chainId: BlockchainType.TON,
      chainName: 'TON',
      transactionFee: 0.01,
      averageBlockTime: 5,
      securityScore: 85,
      congestionLevel: 20,
      performanceScore: 90,
      lastUpdated: new Date()
    },
    [BlockchainType.BITCOIN]: {
      chainId: BlockchainType.BITCOIN,
      chainName: 'Bitcoin',
      transactionFee: 5.25,
      averageBlockTime: 600, // 10 minutes
      securityScore: 98,
      congestionLevel: 65,
      performanceScore: 60,
      lastUpdated: new Date()
    }
  };
  
  private constructor() {
    // Initialize with default values
    Object.values(BlockchainType).forEach(chainType => {
      if (typeof chainType === 'number') {
        this.metricsCache.set(chainType, this.defaultMetrics[chainType]);
        this.lastFetchTime.set(chainType, 0); // Force refresh on first access
      }
    });
  }
  
  /**
   * Get the singleton instance
   */
  public static getInstance(): CrossChainMetricsService {
    if (!CrossChainMetricsService.instance) {
      CrossChainMetricsService.instance = new CrossChainMetricsService();
    }
    return CrossChainMetricsService.instance;
  }
  
  /**
   * Set API keys for different blockchain services
   */
  public setApiKeys(ethereumApiKey: string, solanaApiKey: string, tonApiKey: string): void {
    this.ethereumApiKey = ethereumApiKey;
    this.solanaApiKey = solanaApiKey;
    this.tonApiKey = tonApiKey;
  }
  
  /**
   * Get metrics for a specific chain
   */
  public async getChainMetrics(chainType: BlockchainType): Promise<ChainMetrics> {
    const now = Date.now();
    const lastFetch = this.lastFetchTime.get(chainType) || 0;
    
    // If cache is valid, return cached data
    if (now - lastFetch < this.cacheValidityPeriod && this.metricsCache.has(chainType)) {
      return this.metricsCache.get(chainType)!;
    }
    
    // Otherwise fetch fresh data
    try {
      let metrics: ChainMetrics;
      
      switch (chainType) {
        case BlockchainType.ETHEREUM:
          metrics = await this.fetchEthereumMetrics();
          break;
        case BlockchainType.SOLANA:
          metrics = await this.fetchSolanaMetrics();
          break;
        case BlockchainType.TON:
          metrics = await this.fetchTonMetrics();
          break;
        case BlockchainType.BITCOIN:
          // For Bitcoin, we'll just use the default metrics for now
          metrics = this.defaultMetrics[chainType];
          break;
        default:
          throw new Error(`Unsupported blockchain type: ${chainType}`);
      }
      
      // Update cache
      this.metricsCache.set(chainType, metrics);
      this.lastFetchTime.set(chainType, now);
      
      return metrics;
    } catch (error) {
      console.error(`Error fetching metrics for ${chainType}:`, error);
      
      // If we have cached data, return it even if expired
      if (this.metricsCache.has(chainType)) {
        return this.metricsCache.get(chainType)!;
      }
      
      // Otherwise return default values
      return this.defaultMetrics[chainType];
    }
  }
  
  /**
   * Get metrics for all supported chains
   */
  public async getAllChainMetrics(): Promise<ChainMetrics[]> {
    const supportedChains = [
      BlockchainType.ETHEREUM,
      BlockchainType.SOLANA,
      BlockchainType.TON,
      BlockchainType.BITCOIN
    ];
    
    const metricsPromises = supportedChains.map(chain => this.getChainMetrics(chain));
    return Promise.all(metricsPromises);
  }
  
  /**
   * Generate cross-chain comparison data
   */
  public async getComparisonData(): Promise<CrossChainComparisonData> {
    const allMetrics = await this.getAllChainMetrics();
    
    // Determine the recommended chain based on a balanced score
    const balancedScores = allMetrics.map(chain => {
      // 40% weight to fees, 30% to performance, 30% to security
      return {
        chainId: chain.chainId,
        score: (40 * (1 - chain.transactionFee / 3)) + 
               (30 * chain.performanceScore / 100) + 
               (30 * chain.securityScore / 100)
      };
    });
    
    const recommendedChain = balancedScores.sort((a, b) => b.score - a.score)[0].chainId;
    
    // Calculate potential savings compared to most expensive chain
    const cheapestChain = [...allMetrics].sort((a, b) => a.transactionFee - b.transactionFee)[0];
    const mostExpensiveChain = [...allMetrics].sort((a, b) => b.transactionFee - a.transactionFee)[0];
    const potentialSavings = mostExpensiveChain.transactionFee - cheapestChain.transactionFee;
    
    // Calculate speed improvement compared to slowest chain
    const fastestChain = [...allMetrics].sort((a, b) => a.averageBlockTime - b.averageBlockTime)[0];
    const slowestChain = [...allMetrics].sort((a, b) => b.averageBlockTime - a.averageBlockTime)[0];
    const speedImprovement = ((slowestChain.averageBlockTime - fastestChain.averageBlockTime) / slowestChain.averageBlockTime) * 100;
    
    // Calculate security difference between most secure chain and average
    const avgSecurityScore = allMetrics.reduce((sum, chain) => sum + chain.securityScore, 0) / allMetrics.length;
    const mostSecureChain = [...allMetrics].sort((a, b) => b.securityScore - a.securityScore)[0];
    const securityDifference = mostSecureChain.securityScore - avgSecurityScore;
    
    return {
      chains: allMetrics,
      recommendedChain,
      potentialSavings,
      speedImprovement,
      securityDifference
    };
  }
  
  /**
   * Fetch Ethereum metrics from API
   * In a real implementation, this would call actual Ethereum APIs
   */
  private async fetchEthereumMetrics(): Promise<ChainMetrics> {
    try {
      // This would typically be an actual API call
      // For now, we'll simulate a network request with random variations
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulated gas data
      const gasData: EthereumGasData = {
        safeLow: 20 + Math.random() * 10,
        standard: 30 + Math.random() * 15,
        fast: 50 + Math.random() * 20,
        fastest: 80 + Math.random() * 40,
        blockTime: 12 + (Math.random() * 2 - 1), // 11-13 seconds
        blockNumber: 15000000 + Math.floor(Math.random() * 1000)
      };
      
      // Calculate transaction fee in USD (assuming ETH price around $3,000)
      const ethPrice = 3000 + (Math.random() * 300 - 150); // $2850-$3150
      const gasUsed = 21000; // Standard ETH transfer
      const gasPriceGwei = gasData.standard;
      const gasPriceEth = gasPriceGwei * 1e-9;
      const transactionFeeEth = gasPriceEth * gasUsed;
      const transactionFeeUsd = transactionFeeEth * ethPrice;
      
      // Calculate network congestion based on gas prices
      const congestionLevel = Math.min(100, (gasData.standard / 100) * 75);
      
      // Calculate security score (Ethereum typically has high security)
      const securityScore = 90 + (Math.random() * 10 - 5);
      
      // Calculate performance score based on block time and congestion
      const performanceScore = 100 - (gasData.blockTime * 3) - (congestionLevel * 0.2);
      
      return {
        chainId: BlockchainType.ETHEREUM,
        chainName: 'Ethereum',
        transactionFee: parseFloat(transactionFeeUsd.toFixed(4)),
        averageBlockTime: gasData.blockTime,
        securityScore: Math.round(securityScore),
        congestionLevel: Math.round(congestionLevel),
        performanceScore: Math.round(performanceScore),
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('Error fetching Ethereum metrics:', error);
      return this.defaultMetrics[BlockchainType.ETHEREUM];
    }
  }
  
  /**
   * Fetch Solana metrics from API
   * In a real implementation, this would call actual Solana APIs
   */
  private async fetchSolanaMetrics(): Promise<ChainMetrics> {
    try {
      // This would typically be an actual API call
      // For now, we'll simulate a network request with random variations
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulated Solana network data
      const networkData: SolanaNetworkData = {
        currentSlot: 150000000 + Math.floor(Math.random() * 10000),
        averageSlotTime: 0.4 + (Math.random() * 0.1 - 0.05), // 0.35-0.45 seconds
        transactionCount: 2000 + Math.floor(Math.random() * 1000),
        validatorCount: 1500 + Math.floor(Math.random() * 100)
      };
      
      // Calculate transaction fee in USD (Solana fees are very low)
      const solPrice = 100 + (Math.random() * 20 - 10); // $90-$110
      const transactionFeeSol = 0.000005 + (Math.random() * 0.000002);
      const transactionFeeUsd = transactionFeeSol * solPrice;
      
      // Calculate network congestion (Solana typically has low congestion)
      const congestionLevel = Math.min(100, 20 + Math.random() * 20);
      
      // Calculate security score
      const validatorFactor = Math.min(1, networkData.validatorCount / 2000);
      const securityScore = 75 + (validatorFactor * 15) + (Math.random() * 10 - 5);
      
      // Calculate performance score (Solana typically has high performance)
      const performanceScore = 95 - (networkData.averageSlotTime * 20) - (congestionLevel * 0.1);
      
      return {
        chainId: BlockchainType.SOLANA,
        chainName: 'Solana',
        transactionFee: parseFloat(transactionFeeUsd.toFixed(4)),
        averageBlockTime: networkData.averageSlotTime,
        securityScore: Math.round(securityScore),
        congestionLevel: Math.round(congestionLevel),
        performanceScore: Math.round(performanceScore),
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('Error fetching Solana metrics:', error);
      return this.defaultMetrics[BlockchainType.SOLANA];
    }
  }
  
  /**
   * Fetch TON metrics from API
   * In a real implementation, this would call actual TON APIs
   */
  private async fetchTonMetrics(): Promise<ChainMetrics> {
    try {
      // This would typically be an actual API call
      // For now, we'll simulate a network request with random variations
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulated TON network data
      const networkData: TonNetworkData = {
        blockTime: 5 + (Math.random() * 1 - 0.5), // 4.5-5.5 seconds
        validatorsCount: 200 + Math.floor(Math.random() * 30),
        transactionFee: 0.01 + (Math.random() * 0.004 - 0.002) // 0.008-0.012 TON
      };
      
      // Calculate transaction fee in USD
      const tonPrice = 6 + (Math.random() * 1 - 0.5); // $5.5-$6.5
      const transactionFeeUsd = networkData.transactionFee * tonPrice;
      
      // Calculate network congestion (TON typically has low congestion)
      const congestionLevel = Math.min(100, 15 + Math.random() * 15);
      
      // Calculate security score
      const validatorFactor = Math.min(1, networkData.validatorsCount / 300);
      const securityScore = 80 + (validatorFactor * 10) + (Math.random() * 10 - 5);
      
      // Calculate performance score
      const performanceScore = 90 - (networkData.blockTime * 2) - (congestionLevel * 0.1);
      
      return {
        chainId: BlockchainType.TON,
        chainName: 'TON',
        transactionFee: parseFloat(transactionFeeUsd.toFixed(4)),
        averageBlockTime: networkData.blockTime,
        securityScore: Math.round(securityScore),
        congestionLevel: Math.round(congestionLevel),
        performanceScore: Math.round(performanceScore),
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('Error fetching TON metrics:', error);
      return this.defaultMetrics[BlockchainType.TON];
    }
  }
  
  /**
   * Determine the optimal chain for a transaction based on user preferences
   * @param amount Transaction amount in USD
   * @param prioritizeSecurity Whether to prioritize security over cost
   * @param prioritizeSpeed Whether to prioritize speed over cost
   */
  public async getOptimalChain(
    amount: number, 
    prioritizeSecurity: boolean = false, 
    prioritizeSpeed: boolean = false
  ): Promise<BlockchainType> {
    const allMetrics = await this.getAllChainMetrics();
    
    // Apply different weights based on preferences
    const weightedScores = allMetrics.map(chain => {
      let feeWeight = 40;
      let securityWeight = 30;
      let speedWeight = 30;
      
      // Adjust weights based on preferences
      if (prioritizeSecurity) {
        securityWeight = 60;
        feeWeight = 20;
        speedWeight = 20;
      } else if (prioritizeSpeed) {
        speedWeight = 60;
        feeWeight = 20;
        securityWeight = 20;
      }
      
      // For high-value transactions, increase security weight regardless
      if (amount > 10000) {
        securityWeight = Math.max(securityWeight, 50);
        feeWeight = Math.min(feeWeight, 25);
        speedWeight = Math.min(speedWeight, 25);
      }
      
      // Calculate the fee as a percentage of transaction for better scaling
      const feePercentage = (chain.transactionFee / amount) * 100;
      const feeScore = 100 - Math.min(100, feePercentage * 20); // Cap at 100
      
      // Calculate speed score (lower block time is better)
      const speedScore = 100 - (chain.averageBlockTime / 15) * 100;
      
      // Calculate weighted score
      return {
        chainId: chain.chainId,
        chainName: chain.chainName,
        score: (feeWeight * feeScore / 100) + 
               (securityWeight * chain.securityScore / 100) + 
               (speedWeight * speedScore / 100)
      };
    });
    
    // Return the chain with the highest weighted score
    return weightedScores.sort((a, b) => b.score - a.score)[0].chainId;
  }
}

export default CrossChainMetricsService;