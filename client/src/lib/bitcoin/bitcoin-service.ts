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

class BitcoinService {
  private static instance: BitcoinService;
  private apiBaseUrl: string = 'https://blockchain.info';
  private mockMode: boolean = true;
  
  private constructor() {
    // Initialize in production mode when BITCOIN_API_KEY is available
    // Uses development mode with fixed data otherwise
    this.mockMode = !import.meta.env.VITE_BITCOIN_API_KEY;
    if (this.mockMode) {
      console.log('Bitcoin service running in development mode with simulated data');
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
      // In production, we would use real API calls:
      // const response = await axios.get(`${this.apiBaseUrl}/stats`);
      // return this.transformNetworkStats(response.data);
      
      // Fallback to mocked data for now
      return this.getMockedNetworkStats();
    } catch (error) {
      console.error('Failed to fetch Bitcoin network stats:', error);
      return this.getMockedNetworkStats();
    }
  }
  
  public async getBitcoinPrice(): Promise<BitcoinPrice> {
    if (this.mockMode) {
      return this.getMockedPrice();
    }
    
    try {
      // In production, we would use real API calls:
      // const response = await axios.get(`${this.apiBaseUrl}/ticker`);
      // return this.transformPriceData(response.data);
      
      // Fallback to mocked data for now
      return this.getMockedPrice();
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
      // In a production environment, we would calculate this based on real blockchain data
      // Halving occurs every 210,000 blocks
      // const currentBlockHeight = await this.getCurrentBlockHeight();
      // return this.calculateHalvingInfo(currentBlockHeight);
      
      // Fallback to mocked data for now
      return this.getMockedHalvingInfo();
    } catch (error) {
      console.error('Failed to fetch Bitcoin halving information:', error);
      return this.getMockedHalvingInfo();
    }
  }
  
  // Calculate next halving date: approximately every 4 years
  public getNextHalvingDate(): Date {
    // The latest halving occurred on April 19, 2024
    const lastHalvingDate = new Date('2024-04-19T00:00:00Z');
    
    // Next halving approximately 4 years later
    const nextHalvingDate = new Date(lastHalvingDate);
    nextHalvingDate.setFullYear(nextHalvingDate.getFullYear() + 4);
    
    return nextHalvingDate;
  }
  
  private async getCurrentBlockHeight(): Promise<number> {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/q/getblockcount`);
      return parseInt(response.data, 10);
    } catch (error) {
      console.error('Failed to fetch current block height:', error);
      return 840000; // Fallback approximately for May 2024
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
    const lastHalvingDate = new Date('2024-04-19T00:00:00Z');
    const nextHalvingDate = this.getNextHalvingDate();
    const now = new Date();
    
    const totalCycleTime = nextHalvingDate.getTime() - lastHalvingDate.getTime();
    const timeElapsed = now.getTime() - lastHalvingDate.getTime();
    
    return Math.min(100, Math.max(0, (timeElapsed / totalCycleTime) * 100));
  }
  
  // Mocked data for development mode
  private getMockedNetworkStats(): BitcoinNetworkStats {
    return {
      blockHeight: 840000,
      hashRate: '587.3',
      difficulty: '73.35T',
      nextDifficultyChange: '+2.1%',
      mempool: {
        count: 37420,
        size: '54.7',
        fees: {
          low: 18,
          medium: 32,
          high: 60
        }
      }
    };
  }
  
  private getMockedPrice(): BitcoinPrice {
    return {
      usd: 68850.42,
      usd24hChange: 2.4,
      lastUpdated: new Date()
    };
  }
  
  private getMockedHalvingInfo(): BitcoinHalvingInfo {
    const nextHalvingDate = this.getNextHalvingDate();
    
    return {
      currentBlock: 840000,
      blocksUntilHalving: 210000,
      estimatedTimeUntilHalving: nextHalvingDate,
      currentReward: 3.125,
      nextReward: 1.5625,
      currentHalvingEra: 4
    };
  }
}

// Export singleton instance
export const bitcoinService = BitcoinService.getInstance();