import axios from 'axios';

export interface BitcoinNetworkStats {
  blockHeight: number;
  hashRate: string; // TH/s
  difficulty: string;
  nextDifficultyChange: string;
  mempool: {
    count: number;
    size: string; // MB
    fees: {
      low: number;
      medium: number;
      high: number;
    };
  };
}

export interface BitcoinPrice {
  usd: number;
  usd24hChange: number;
  lastUpdated: Date;
}

export interface BitcoinHalvingInfo {
  currentBlock: number;
  blocksUntilHalving: number;
  estimatedTimeUntilHalving: Date;
  currentReward: number; // BTC per block
  nextReward: number; // BTC per block
  currentHalvingEra: number; // 4th era, 5th era, etc.
}

// Block data from Blockstream API
interface BlockstreamBlock {
  id: string;
  height: number;
  version: number;
  timestamp: number;
  tx_count: number;
  size: number;
  weight: number;
  merkle_root: string;
  previousblockhash: string;
  mediantime: number;
  nonce: number;
  bits: number;
  difficulty: number;
}

// Fee estimates from Blockstream API
interface BlockstreamFeeEstimates {
  [blocks: string]: number;
}

class BitcoinService {
  private static instance: BitcoinService;
  private blockstreamApiUrl: string = 'https://blockstream.info/api';
  private coingeckoApiUrl: string = 'https://api.coingecko.com/api/v3';
  private mockMode: boolean = false;
  
  private constructor() {
    // Initialize in development mode for now to avoid API rate limits and connectivity issues
    this.mockMode = true;
    
    // Log the mode we're operating in
    if (this.mockMode) {
      console.log('Bitcoin service running in development mode with simulated data');
    } else {
      console.log('Bitcoin service running with live Blockstream and CoinGecko API data');
    }
  }
  
  public static getInstance(): BitcoinService {
    if (!BitcoinService.instance) {
      BitcoinService.instance = new BitcoinService();
    }
    return BitcoinService.instance;
  }
  
  public async getNetworkStats(): Promise<BitcoinNetworkStats> {
    if (this.mockMode) {
      return this.getMockedNetworkStats();
    }
    
    try {
      console.log('Fetching Bitcoin network stats from Blockstream API');
      
      // Get latest block height
      const blockHeightResponse = await axios.get(`${this.blockstreamApiUrl}/blocks/tip/height`);
      const blockHeight = parseInt(blockHeightResponse.data, 10);
      
      // Get latest block details
      const latestBlockResponse = await axios.get(`${this.blockstreamApiUrl}/blocks/tip`);
      const latestBlock = latestBlockResponse.data;
      
      // Get fee estimates for different confirmation targets
      const feeEstimatesResponse = await axios.get(`${this.blockstreamApiUrl}/fee-estimates`);
      const feeEstimates = feeEstimatesResponse.data;
      
      // Get mempool statistics
      const mempoolStats = {
        count: 42000, // Default if we can't get real data
        size: '65.0',
        fees: {
          low: Math.round(feeEstimates['6'] || 24),
          medium: Math.round(feeEstimates['3'] || 45),
          high: Math.round(feeEstimates['1'] || 85)
        }
      };
      
      try {
        // Try to get mempool info - this endpoint sometimes is unavailable
        const mempoolInfoResponse = await axios.get(`${this.blockstreamApiUrl}/mempool`);
        const mempoolInfo = mempoolInfoResponse.data;
        
        if (mempoolInfo) {
          mempoolStats.count = mempoolInfo.count || mempoolStats.count;
          mempoolStats.size = ((mempoolInfo.vsize || 0) / 1000000).toFixed(1); // Convert to MB
        }
      } catch (mempoolError) {
        console.log('Could not fetch mempool details, using estimates', mempoolError);
      }
      
      // Format difficulty in a human-readable way (e.g., "78.43T")
      const difficultyNumber = latestBlock.difficulty || 7843000000000; // Fallback value
      const difficultyFormatted = this.formatDifficulty(difficultyNumber);
      
      // Calculate estimated hash rate (TH/s)
      // Simplified formula: difficulty * 2^32 / (600 seconds) / 10^12
      const hashRateEstimate = difficultyNumber / 600 / Math.pow(2, 32) * Math.pow(10, -12);
      const hashRateFormatted = hashRateEstimate.toFixed(1);
      
      // For simplicity, use a fixed next difficulty change estimate
      const nextDiffChangeFormatted = '+3.2%';
      
      console.log('Successfully fetched Bitcoin network stats');
      
      return {
        blockHeight: blockHeight,
        hashRate: hashRateFormatted,
        difficulty: difficultyFormatted,
        nextDifficultyChange: nextDiffChangeFormatted,
        mempool: mempoolStats
      };
    } catch (error) {
      console.error('Failed to fetch Bitcoin network stats:', error);
      // Fall back to mocked data if the API call fails
      return this.getMockedNetworkStats();
    }
  }
  
  private formatDifficulty(difficultyNumber: number): string {
    if (difficultyNumber >= 1000000000000) {
      return (difficultyNumber / 1000000000000).toFixed(2) + 'T';
    } else if (difficultyNumber >= 1000000000) {
      return (difficultyNumber / 1000000000).toFixed(2) + 'G';
    }
    return difficultyNumber.toString();
  }
  
  public async getBitcoinPrice(): Promise<BitcoinPrice> {
    if (this.mockMode) {
      return this.getMockedPrice();
    }
    
    try {
      console.log('Fetching Bitcoin price data from CoinGecko API');
      
      // Use CoinGecko API's simple price endpoint which is more reliable and has less rate limiting
      const response = await axios.get(
        `${this.coingeckoApiUrl}/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true&precision=2`
      );
      
      if (!response.data || !response.data.bitcoin) {
        throw new Error('Invalid response from CoinGecko API');
      }
      
      const bitcoinData = response.data.bitcoin;
      
      console.log('Successfully fetched Bitcoin price:', bitcoinData);
      
      return {
        usd: bitcoinData.usd || 97405.00,
        usd24hChange: bitcoinData.usd_24h_change || 3.8,
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('Failed to fetch Bitcoin price data:', error);
      
      // Try alternative endpoint if first one fails
      try {
        console.log('Trying alternative CoinGecko endpoint');
        const alternativeResponse = await axios.get(
          `${this.coingeckoApiUrl}/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`
        );
        
        const marketData = alternativeResponse.data.market_data;
        
        return {
          usd: marketData.current_price.usd,
          usd24hChange: marketData.price_change_percentage_24h,
          lastUpdated: new Date()
        };
      } catch (fallbackError) {
        console.error('Failed to fetch Bitcoin price from alternative endpoint:', fallbackError);
        return this.getMockedPrice();
      }
    }
  }
  
  public async getHalvingInfo(): Promise<BitcoinHalvingInfo> {
    if (this.mockMode) {
      return this.getMockedHalvingInfo();
    }
    
    try {
      console.log('Fetching Bitcoin halving information');
      
      // Get current block height from Blockstream API
      const currentBlockHeight = await this.getCurrentBlockHeight();
      console.log('Current Bitcoin block height:', currentBlockHeight);
      
      // Bitcoin halving happens every 210,000 blocks
      const halvingInterval = 210000;
      
      // The last halving (to 3.125 BTC) happened at block 840000 on April 19, 2024
      const lastHalvingBlock = 840000;
      const lastHalvingDate = new Date('2024-04-19T18:25:00Z');
      
      // Calculate blocks until next halving
      const nextHalvingBlock = lastHalvingBlock + halvingInterval;
      const blocksUntilHalving = nextHalvingBlock - currentBlockHeight;
      
      // Calculate current halvening era (4th era started at block 840000)
      const currentHalvingEra = Math.floor(currentBlockHeight / halvingInterval) + 1;
      
      // Calculate current and next rewards
      const currentReward = 50 / Math.pow(2, currentHalvingEra - 1);
      const nextReward = currentReward / 2;
      
      // Calculate the average block time over the last blocks (approximately 10 minutes)
      const averageBlockTimeMinutes = 10;
      
      // Estimate time until next halving based on current block height
      const minutesUntilHalving = blocksUntilHalving * averageBlockTimeMinutes;
      const nextHalvingDate = new Date();
      nextHalvingDate.setMinutes(nextHalvingDate.getMinutes() + minutesUntilHalving);
      
      // Calculate days until next halving
      const millisecondsPerDay = 1000 * 60 * 60 * 24;
      const daysUntilHalving = Math.ceil(minutesUntilHalving / (60 * 24));
      
      console.log(`Successfully calculated halving info:
        Current Block: ${currentBlockHeight}
        Blocks Until Halving: ${blocksUntilHalving}
        Estimated Next Halving: ${nextHalvingDate.toISOString()}
        Days Until Halving: ${daysUntilHalving}
        Current Reward: ${currentReward} BTC
        Next Reward: ${nextReward} BTC
      `);
      
      return {
        currentBlock: currentBlockHeight,
        blocksUntilHalving,
        estimatedTimeUntilHalving: nextHalvingDate,
        currentReward,
        nextReward,
        currentHalvingEra
      };
    } catch (error) {
      console.error('Failed to fetch Bitcoin halving information:', error);
      return this.getMockedHalvingInfo();
    }
  }
  
  // Calculate next halving date: approximately every 4 years
  public getNextHalvingDate(): Date {
    // The latest halving occurred on April 19, 2024
    const lastHalvingDate = new Date('2024-04-19T18:25:00Z');
    
    // Next halving approximately 4 years later
    const nextHalvingDate = new Date(lastHalvingDate);
    nextHalvingDate.setFullYear(nextHalvingDate.getFullYear() + 4);
    
    return nextHalvingDate;
  }
  
  private async getCurrentBlockHeight(): Promise<number> {
    try {
      const response = await axios.get(`${this.blockstreamApiUrl}/blocks/tip/height`);
      return parseInt(response.data, 10);
    } catch (error) {
      console.error('Failed to fetch current block height:', error);
      return 845721; // Fallback approximately for May 2024
    }
  }
  
  // Calculate days until next bitcoin halving
  public calculateDaysUntilHalving(): number {
    const nextHalvingDate = this.getNextHalvingDate();
    const now = new Date();
    const diffTime = Math.abs(nextHalvingDate.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  
  // Returns the percentage progress between halvings (0-100)
  public calculateHalvingCycleProgress(): number {
    const lastHalvingDate = new Date('2024-04-19T18:25:00Z');
    const nextHalvingDate = this.getNextHalvingDate();
    const now = new Date();
    
    const totalCycleTime = nextHalvingDate.getTime() - lastHalvingDate.getTime();
    const timeElapsed = now.getTime() - lastHalvingDate.getTime();
    
    return Math.min(100, Math.max(0, (timeElapsed / totalCycleTime) * 100));
  }
  
  // Mocked data for development mode
  private getMockedNetworkStats(): BitcoinNetworkStats {
    return {
      blockHeight: 845721,
      hashRate: '612.8',
      difficulty: '78.43T',
      nextDifficultyChange: '+3.2%',
      mempool: {
        count: 42560,
        size: '68.3',
        fees: {
          low: 24,
          medium: 45,
          high: 85
        }
      }
    };
  }
  
  private getMockedPrice(): BitcoinPrice {
    return {
      usd: 97405.00,
      usd24hChange: 3.8,
      lastUpdated: new Date()
    };
  }
  
  private getMockedHalvingInfo(): BitcoinHalvingInfo {
    const nextHalvingDate = this.getNextHalvingDate();
    
    return {
      currentBlock: 845721,
      blocksUntilHalving: 204279,
      estimatedTimeUntilHalving: nextHalvingDate,
      currentReward: 3.125,
      nextReward: 1.5625,
      currentHalvingEra: 4
    };
  }
}

// Export singleton instance
export const bitcoinService = BitcoinService.getInstance();