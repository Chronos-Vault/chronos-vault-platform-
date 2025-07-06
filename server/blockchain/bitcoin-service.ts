/**
 * Bitcoin Service
 * 
 * This module provides Bitcoin blockchain connectivity and utility functions
 * for the Chronos Vault platform, including halvening date calculation and
 * address validation.
 */

import { securityLogger } from '../monitoring/security-logger';
import { BlockchainErrorCategory, createBlockchainError } from './enhanced-error-handling';
import config from '../config';

interface BitcoinBalance {
  confirmedBalance: number;
  unconfirmedBalance: number;
  totalBalance: number;
}

interface BitcoinTransaction {
  txid: string;
  blockHeight: number;
  confirmations: number;
  timestamp: number;
  amount: number;
  fee: number;
  inputs: {
    address: string;
    value: number;
  }[];
  outputs: {
    address: string;
    value: number;
  }[];
}

interface BitcoinNetworkStats {
  difficulty: number;
  hashRate: number;
  blockHeight: number;
  mempoolSize: number;
  mempoolBytes: number;
  nextDifficultyChange: number;
}

interface BitcoinPriceData {
  usd: number;
  usd_24h_change: number;
}

export interface BitcoinHalvingInfo {
  currentBlock: number;
  nextHalveningBlock: number;
  blocksUntilHalving: number;
  estimatedNextHalving: string; // ISO date string
  daysUntilHalving: number;
  currentReward: number;
  nextReward: number;
}

class BitcoinService {
  private initialized = false;
  private networkStats: BitcoinNetworkStats | null = null;
  private priceData: BitcoinPriceData | null = null;
  private halveningInfo: BitcoinHalvingInfo | null = null;
  
  // Set true to use real blockchain data or false for development
  private readonly useRealData = true;
  
  /**
   * Initialize the Bitcoin service
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }
    
    try {
      securityLogger.info('Initializing Bitcoin service');
      
      // Get current stats to initialize the service
      await this.fetchNetworkStats();
      await this.fetchPriceData();
      await this.calculateHalveningInfo();
      
      // Log that everything is good to go
      securityLogger.info('Bitcoin service running with live Blockstream and CoinGecko API data');
      
      this.initialized = true;
    } catch (error) {
      securityLogger.error('Failed to initialize Bitcoin service', error);
      
      // We'll still initialize with defaults in case of API failures
      if (!this.networkStats) {
        this.networkStats = {
          difficulty: 93948906532894.3,
          hashRate: 657251982.4,
          blockHeight: 895560,
          mempoolSize: 12653,
          mempoolBytes: 27183402,
          nextDifficultyChange: 895680
        };
      }
      
      if (!this.priceData) {
        this.priceData = {
          usd: 96572.38,
          usd_24h_change: 1.98
        };
      }
      
      if (!this.halveningInfo) {
        this.calculateHalveningInfo();
      }
      
      this.initialized = true;
    }
  }
  
  /**
   * Get Bitcoin network statistics
   */
  async getNetworkStats(): Promise<BitcoinNetworkStats> {
    if (!this.initialized) {
      await this.initialize();
    }
    
    // Refresh network stats if we're using real data
    if (this.useRealData) {
      await this.fetchNetworkStats();
    }
    
    return this.networkStats as BitcoinNetworkStats;
  }
  
  /**
   * Get current Bitcoin price information
   */
  async getPriceData(): Promise<BitcoinPriceData> {
    if (!this.initialized) {
      await this.initialize();
    }
    
    // Refresh price data if we're using real data
    if (this.useRealData) {
      await this.fetchPriceData();
    }
    
    return this.priceData as BitcoinPriceData;
  }
  
  /**
   * Get information about the next Bitcoin halvening
   */
  async getHalvingInfo(): Promise<BitcoinHalvingInfo> {
    if (!this.initialized) {
      await this.initialize();
    }
    
    // Recalculate halvening info based on latest block height
    await this.calculateHalveningInfo();
    
    return this.halveningInfo as BitcoinHalvingInfo;
  }
  
  /**
   * Fetch current Bitcoin network statistics from Blockstream API
   */
  private async fetchNetworkStats(): Promise<void> {
    try {
      securityLogger.info('Fetching Bitcoin network stats from Blockstream API');
      
      // Get current block info
      const blockHeightResponse = await fetch('https://blockstream.info/api/blocks/tip/height');
      const blockHeight = parseInt(await blockHeightResponse.text(), 10);
      
      // Get mempool info
      const mempoolResponse = await fetch('https://blockstream.info/api/mempool');
      const mempoolInfo = await mempoolResponse.json();
      
      // Get difficulty
      const diffResponse = await fetch('https://blockstream.info/api/blocks/tip');
      const blockInfo = await diffResponse.json();
      
      // Calculate next difficulty change block
      const nextDifficultyChange = Math.floor(blockHeight / 2016) * 2016 + 2016;
      
      // Estimate hash rate based on difficulty
      // Hashrate = difficulty * 2^32 / 600 seconds
      const hashRate = blockInfo.difficulty * Math.pow(2, 32) / 600 / 1e12; // in TH/s
      
      this.networkStats = {
        difficulty: blockInfo.difficulty,
        hashRate,
        blockHeight,
        mempoolSize: mempoolInfo.count || 0,
        mempoolBytes: mempoolInfo.vsize || 0,
        nextDifficultyChange
      };
      
      securityLogger.info('Successfully fetched Bitcoin network stats');
    } catch (error) {
      securityLogger.error('Failed to fetch Bitcoin network stats', error);
      throw createBlockchainError(
        error,
        'BTC',
        BlockchainErrorCategory.NETWORK,
        { operation: 'fetchNetworkStats' }
      );
    }
  }
  
  /**
   * Fetch current Bitcoin price data from CoinGecko API
   */
  private async fetchPriceData(): Promise<void> {
    try {
      securityLogger.info('Fetching Bitcoin price data from CoinGecko API');
      
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true'
      );
      
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.bitcoin) {
        throw new Error('CoinGecko API returned unexpected data format');
      }
      
      this.priceData = {
        usd: data.bitcoin.usd,
        usd_24h_change: data.bitcoin.usd_24h_change
      };
      
      securityLogger.info('Successfully fetched Bitcoin price:', this.priceData);
    } catch (error) {
      securityLogger.error('Failed to fetch Bitcoin price data', error);
      // Don't throw, use cached data
    }
  }
  
  /**
   * Calculate information about the next Bitcoin halvening
   */
  private async calculateHalveningInfo(): Promise<void> {
    try {
      securityLogger.info('Fetching Bitcoin halving information');
      
      // Get the current block height
      let currentBlock = 0;
      
      if (this.networkStats) {
        currentBlock = this.networkStats.blockHeight;
      } else {
        const response = await fetch('https://blockstream.info/api/blocks/tip/height');
        currentBlock = parseInt(await response.text(), 10);
        securityLogger.info('Current Bitcoin block height:', currentBlock);
      }
      
      // Bitcoin halving occurs every 210,000 blocks
      const halvingInterval = 210000;
      
      // Calculate which halving cycle we're in (0-based)
      const currentHalvingCycle = Math.floor(currentBlock / halvingInterval);
      
      // Calculate the block at which the next halving will occur
      const nextHalveningBlock = (currentHalvingCycle + 1) * halvingInterval;
      
      // Calculate how many blocks until the next halving
      const blocksUntilHalving = nextHalveningBlock - currentBlock;
      
      // Calculate the estimated date of the next halving
      // Bitcoin blocks are produced every 10 minutes on average
      const blocksPerDay = 144; // 6 blocks per hour * 24 hours
      const daysUntilHalving = Math.ceil(blocksUntilHalving / blocksPerDay);
      const nextHalvingDate = new Date();
      nextHalvingDate.setDate(nextHalvingDate.getDate() + daysUntilHalving);
      
      // Calculate the current block reward
      // The initial reward was 50 BTC, halving every 210,000 blocks
      const initialReward = 50;
      const currentReward = initialReward / Math.pow(2, currentHalvingCycle);
      const nextReward = currentReward / 2;
      
      this.halveningInfo = {
        currentBlock,
        nextHalveningBlock,
        blocksUntilHalving,
        estimatedNextHalving: nextHalvingDate.toISOString(),
        daysUntilHalving,
        currentReward,
        nextReward
      };
      
      securityLogger.info(`Successfully calculated halving info:
        Current Block: ${currentBlock}
        Blocks Until Halving: ${blocksUntilHalving}
        Estimated Next Halving: ${nextHalvingDate.toISOString()}
        Days Until Halving: ${daysUntilHalving}
        Current Reward: ${currentReward} BTC
        Next Reward: ${nextReward} BTC
      `);
    } catch (error) {
      securityLogger.error('Failed to calculate Bitcoin halving information', error);
      
      // Fallback to hardcoded values if the API fails
      const now = new Date();
      const nextHalvingDate = new Date(2028, 3, 15); // April 15, 2028 (approximate)
      
      // Calculate days until halving
      const daysUntilHalving = Math.ceil((nextHalvingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      this.halveningInfo = {
        currentBlock: 895704,
        nextHalveningBlock: 1050000,
        blocksUntilHalving: 1050000 - 895704,
        estimatedNextHalving: nextHalvingDate.toISOString(),
        daysUntilHalving,
        currentReward: 3.125,
        nextReward: 1.5625
      };
    }
  }
  
  /**
   * Get the balance of a Bitcoin address
   */
  async getBalance(address: string): Promise<BitcoinBalance> {
    if (!this.initialized) {
      await this.initialize();
    }
    
    try {
      const response = await fetch(`https://blockstream.info/api/address/${address}`);
      if (!response.ok) {
        throw new Error(`Error fetching balance: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Convert from satoshis to BTC
      const confirmedBalance = data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum;
      const unconfirmedBalance = data.mempool_stats.funded_txo_sum - data.mempool_stats.spent_txo_sum;
      
      return {
        confirmedBalance: confirmedBalance / 100000000,
        unconfirmedBalance: unconfirmedBalance / 100000000,
        totalBalance: (confirmedBalance + unconfirmedBalance) / 100000000
      };
    } catch (error) {
      securityLogger.error('Failed to get Bitcoin balance', error);
      throw createBlockchainError(
        error,
        'BTC',
        BlockchainErrorCategory.NETWORK,
        { operation: 'getBalance', address }
      );
    }
  }
  
  /**
   * Validate a Bitcoin address
   */
  async validateAddress(address: string): Promise<boolean> {
    if (!this.initialized) {
      await this.initialize();
    }
    
    if (config.isDevelopmentMode) {
      // In development mode, just do some basic validation
      const isValid = address.length >= 26 && address.length <= 35 &&
        (address.startsWith('1') || address.startsWith('3') || address.startsWith('bc1'));
      
      return isValid;
    }
    
    try {
      // In production, we'd validate the address format more thoroughly
      // For now, we'll use a simple regex for common Bitcoin address types
      const validBtcAddressRegex = /^(1[a-km-zA-HJ-NP-Z1-9]{25,34}|3[a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-zA-HJ-NP-Z0-9]{25,39})$/;
      
      const isValid = validBtcAddressRegex.test(address);
      
      if (!isValid) {
        securityLogger.warn(`Invalid Bitcoin address format: ${address}`);
      }
      
      return isValid;
    } catch (error) {
      securityLogger.error('Error validating Bitcoin address', error);
      return false;
    }
  }
  
  /**
   * Get transactions for a Bitcoin address
   */
  async getTransactions(address: string, limit: number = 10): Promise<BitcoinTransaction[]> {
    if (!this.initialized) {
      await this.initialize();
    }
    
    if (config.isDevelopmentMode) {
      // Generate mock transactions for dev mode
      return this.generateMockTransactions(address, limit);
    }
    
    try {
      const response = await fetch(`https://blockstream.info/api/address/${address}/txs`);
      if (!response.ok) {
        throw new Error(`Error fetching transactions: ${response.status} ${response.statusText}`);
      }
      
      const txData = await response.json();
      
      // Process first 'limit' transactions
      const transactions: BitcoinTransaction[] = [];
      
      for (let i = 0; i < Math.min(limit, txData.length); i++) {
        const tx = txData[i];
        
        // Calculate total input and output values
        let inputTotal = 0;
        const inputs = tx.vin.map((input: any) => {
          const value = input.prevout ? input.prevout.value : 0;
          inputTotal += value;
          return {
            address: input.prevout ? input.prevout.scriptpubkey_address : 'Unknown',
            value: value / 100000000 // Convert from satoshis to BTC
          };
        });
        
        let outputTotal = 0;
        const outputs = tx.vout.map((output: any) => {
          outputTotal += output.value;
          return {
            address: output.scriptpubkey_address || 'Unknown',
            value: output.value / 100000000 // Convert from satoshis to BTC
          };
        });
        
        // Calculate fee
        const fee = (inputTotal - outputTotal) / 100000000;
        
        // Determine if this is an incoming or outgoing transaction
        let amount = 0;
        for (const output of outputs) {
          if (output.address === address) {
            amount += output.value;
          }
        }
        for (const input of inputs) {
          if (input.address === address) {
            amount -= input.value;
          }
        }
        
        // Get block info if confirmed
        let blockHeight = 0;
        let confirmations = 0;
        let timestamp = Date.now() / 1000; // Default to current time if not confirmed
        
        if (tx.status.confirmed) {
          blockHeight = tx.status.block_height;
          
          // Calculate confirmations based on current block height
          if (this.networkStats) {
            confirmations = this.networkStats.blockHeight - blockHeight + 1;
          }
          
          // Get timestamp
          timestamp = tx.status.block_time;
        }
        
        transactions.push({
          txid: tx.txid,
          blockHeight,
          confirmations,
          timestamp: timestamp * 1000, // Convert to milliseconds
          amount,
          fee,
          inputs,
          outputs
        });
      }
      
      return transactions;
    } catch (error) {
      securityLogger.error('Failed to get Bitcoin transactions', error);
      throw createBlockchainError(
        error,
        'BTC',
        BlockchainErrorCategory.NETWORK,
        { operation: 'getTransactions', address }
      );
    }
  }
  
  /**
   * Generate mock transactions for development
   */
  private generateMockTransactions(address: string, limit: number): BitcoinTransaction[] {
    const transactions: BitcoinTransaction[] = [];
    const now = Date.now();
    
    for (let i = 0; i < limit; i++) {
      const isIncoming = Math.random() > 0.5;
      const counterparty = `bc1${Math.random().toString(36).substring(2, 15)}`;
      const amount = parseFloat((Math.random() * 2).toFixed(8));
      const fee = parseFloat((Math.random() * 0.001).toFixed(8));
      const timestamp = now - Math.floor(Math.random() * 30 * 86400000); // Random time in the last 30 days
      const confirmations = Math.floor(Math.random() * 2000);
      
      transactions.push({
        txid: `mock-tx-${i}-${Date.now()}`,
        blockHeight: this.networkStats?.blockHeight ? this.networkStats.blockHeight - confirmations : 890000 - confirmations,
        confirmations,
        timestamp,
        amount: isIncoming ? amount : -amount,
        fee,
        inputs: isIncoming 
          ? [{ address: counterparty, value: amount + fee }] 
          : [{ address, value: amount + fee }],
        outputs: isIncoming 
          ? [{ address, value: amount }] 
          : [{ address: counterparty, value: amount }]
      });
    }
    
    return transactions;
  }
}

export const bitcoinService = new BitcoinService();