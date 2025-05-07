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
    // Initialize in production mode by default
    // Only use mock mode when explicitly requested or if API calls fail
    this.mockMode = import.meta.env.VITE_BITCOIN_MOCK_MODE === 'true';
    
    if (this.mockMode) {
      console.log('Bitcoin service running in mock mode with simulated data');
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
      // Get latest block
      const latestBlockResponse = await axios.get<BlockstreamBlock>(`${this.blockstreamApiUrl}/blocks/tip`);
      const latestBlock = latestBlockResponse.data;
      
      // Get fee estimates
      const feeEstimatesResponse = await axios.get<BlockstreamFeeEstimates>(`${this.blockstreamApiUrl}/fee-estimates`);
      const feeEstimates = feeEstimatesResponse.data;
      
      // Get mempool info
      const mempoolInfoResponse = await axios.get(`${this.blockstreamApiUrl}/mempool`);
      const mempoolInfo = mempoolInfoResponse.data;
      
      // Get difficulty and hash rate
      const difficultyNumber = latestBlock.difficulty;
      // Format difficulty to human-readable format
      const difficultyFormatted = this.formatDifficulty(difficultyNumber);
      
      // Estimate hash rate (simplified calculation)
      const hashRateEstimate = difficultyNumber / 600 / Math.pow(2, 32) * Math.pow(10, -12);
      const hashRateFormatted = hashRateEstimate.toFixed(1);
      
      // Estimate next difficulty change (simplified)
      const nextDiffChange = '+1.5%'; // This would ideally be calculated from recent blocks
      
      return {
        blockHeight: latestBlock.height,
        hashRate: hashRateFormatted,
        difficulty: difficultyFormatted,
        nextDifficultyChange: nextDiffChange,
        mempool: {
          count: mempoolInfo.count || 0,
          size: ((mempoolInfo.vsize || 0) / 1000000).toFixed(1), // Convert to MB
          fees: {
            low: Math.round(feeEstimates['6'] || 10),    // 6 blocks (1 hour)
            medium: Math.round(feeEstimates['3'] || 20), // 3 blocks (30 min)
            high: Math.round(feeEstimates['1'] || 30)    // 1 block (10 min)
          }
        }
      };
    } catch (error) {
      console.error('Failed to fetch Bitcoin network stats:', error);
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
      // Use CoinGecko API to get Bitcoin price data
      const response = await axios.get(
        `${this.coingeckoApiUrl}/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`
      );
      
      const marketData = response.data.market_data;
      
      return {
        usd: marketData.current_price.usd,
        usd24hChange: marketData.price_change_percentage_24h,
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('Failed to fetch Bitcoin price data:', error);
      return this.getMockedPrice();
    }
  }
  
  public async getHalvingInfo(): Promise<BitcoinHalvingInfo> {
    if (this.mockMode) {
      return this.getMockedHalvingInfo();
    }
    
    try {
      // Get current block height from Blockstream API
      const currentBlockHeight = await this.getCurrentBlockHeight();
      
      // Bitcoin halving happens every 210,000 blocks
      const halvingInterval = 210000;
      
      // The last halving (to 3.125 BTC) happened at block 840000 on April 19, 2024
      const lastHalvingBlock = 840000;
      
      // Calculate blocks until next halving
      const nextHalvingBlock = lastHalvingBlock + halvingInterval;
      const blocksUntilHalving = nextHalvingBlock - currentBlockHeight;
      
      // Calculate current halvening era (4th era started at block 840000)
      const currentHalvingEra = Math.floor(currentBlockHeight / halvingInterval) + 1;
      
      // Calculate current and next rewards
      const currentReward = 50 / Math.pow(2, currentHalvingEra - 1);
      const nextReward = currentReward / 2;
      
      // Estimate time until next halving
      // Bitcoin produces a block every ~10 minutes on average
      const minutesUntilHalving = blocksUntilHalving * 10;
      const nextHalvingDate = new Date();
      nextHalvingDate.setMinutes(nextHalvingDate.getMinutes() + minutesUntilHalving);
      
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