/**
 * Bitcoin wallet information interface
 */
export interface BitcoinWalletInfo {
  address: string;
  balance: number;
  network: string;
  isConnected: boolean;
}

/**
 * Bitcoin transaction interface
 */
export interface BitcoinTransaction {
  txid: string;
  amount: number;
  timestamp: number;
  receiverAddress?: string;
  senderAddress?: string;
  blockHeight?: number;
  confirmations?: number;
  fees?: number;
  status: 'pending' | 'confirmed' | 'failed';
}

/**
 * Bitcoin provider interface
 */
export interface BitcoinProvider {
  name: string;
  isAvailable: boolean;
  icon?: string;
  isInstalled: () => boolean;
  connect: () => Promise<BitcoinWalletInfo>;
  disconnect: () => Promise<void>;
  signMessage: (message: string) => Promise<string>;
  sendTransaction: (receiverAddress: string, amountBTC: number) => Promise<string>;
  getBalance: () => Promise<number>;
}

/**
 * Bitcoin halving information
 */
export interface BitcoinHalvingInfo {
  currentBlock: number;
  halvingBlock: number;
  blocksRemaining: number;
  estimatedDaysRemaining: number;
  blocksPerDay: number;
  currentReward: number;
  nextReward: number;
  currentEra: number;
  totalHalvings: number;
}

/**
 * Bitcoin network information
 */
export interface BitcoinNetworkInfo {
  networkType: 'mainnet' | 'testnet' | 'regtest';
  difficulty: number;
  hashrate: number;
  latestBlock: number;
  mempoolSize: number;
  nextDifficultyAdjustment: number;
}

/**
 * Bitcoin price information
 */
export interface BitcoinPriceInfo {
  usd: number;
  eur: number;
  percentChange24h: number;
  marketCap: number;
  volume24h: number;
  allTimeHigh: number;
  allTimeHighDate: string;
}

/**
 * Bitcoin halving vault configuration
 */
export interface BitcoinHalvingVaultConfig {
  unlockTime: 'after-halving' | 'custom-date';
  postHalvingPeriod?: '3months' | '6months' | '1year' | 'nexthalving';
  customDate?: Date;
  amount: number;
  name: string;
  isMultiSig: boolean;
  securityLevel: 'basic' | 'enhanced' | 'advanced';
  isPublic: boolean;
  participateInChallenge: boolean;
  additionalSigners?: string[];
  requiredSignatures?: number;
}