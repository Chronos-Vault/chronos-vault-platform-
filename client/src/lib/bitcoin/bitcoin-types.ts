// Types for Bitcoin-related functionality

// Network types for Bitcoin
export type BitcoinNetworkType = 'mainnet' | 'testnet' | 'regtest';

// Bitcoin wallet provider types
export type BitcoinWalletProvider = 'Unisat' | 'Xverse' | 'OKX' | 'Leather';

// Bitcoin transaction status
export enum BitcoinTransactionStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  FAILED = 'failed'
}

// Bitcoin transaction type
export interface BitcoinTransaction {
  txid: string;
  sender: string;
  recipient: string;
  amount: number; // in BTC
  fee: number; // in BTC
  status: BitcoinTransactionStatus;
  confirmations: number;
  timestamp: number;
  blockHeight?: number;
}

// Bitcoin halving information
export interface BitcoinHalvingInfo {
  currentBlock: number;
  blocksUntilHalving: number;
  estimatedHalvingDate: Date;
  daysUntilHalving: number;
  currentReward: number; // BTC per block
  nextReward: number; // BTC per block
}

// Bitcoin vault configuration
export interface BitcoinVaultConfig {
  name: string;
  initialDeposit: number; // in BTC
  vaultType: 'personal' | 'multi-sig';
  unlockType: 'after-halving' | 'custom-date';
  lockDuration: '3months' | '6months' | '1year' | 'nexthalving';
  securityLevel: 'basic' | 'enhanced' | 'advanced';
  isPublic: boolean;
  diamondHandsChallenge: boolean;
}

// Bitcoin network stats
export interface BitcoinNetworkStats {
  hashRate: number; // hashes per second
  difficulty: number;
  blockHeight: number;
  mempoolSize: number; // number of transactions
  avgTransactionFee: number; // in satoshis
  medianTransactionFee: number; // in satoshis
  feeRates: {
    fastestFee: number; // satoshis per vbyte
    halfHourFee: number;
    hourFee: number;
    economyFee: number;
    minimumFee: number;
  };
}

// Bitcoin price data
export interface BitcoinPriceData {
  usd: number;
  usd_24h_change: number;
}