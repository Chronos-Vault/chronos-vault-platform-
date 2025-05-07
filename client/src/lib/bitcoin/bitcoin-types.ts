/**
 * Interface for Bitcoin wallet information
 */
export interface BitcoinWalletInfo {
  address: string;
  balance: string;
  network: string;
  publicKey?: string;
  type?: string;
  isTestnet: boolean;
  utxos?: BitcoinUTXO[];
}

/**
 * Interface for Bitcoin UTXO (Unspent Transaction Output)
 */
export interface BitcoinUTXO {
  txid: string;
  vout: number;
  value: number;
  scriptPubKey?: string;
  confirmations?: number;
}

/**
 * Interface for Bitcoin transaction
 */
export interface BitcoinTransaction {
  txid: string;
  blockHash?: string;
  blockHeight?: number;
  timestamp?: number;
  confirmations: number;
  fee?: number;
  inputs: BitcoinTxInput[];
  outputs: BitcoinTxOutput[];
  size?: number;
  status: 'confirmed' | 'pending' | 'failed';
}

/**
 * Interface for Bitcoin transaction input
 */
export interface BitcoinTxInput {
  txid: string;
  vout: number;
  scriptSig?: string;
  address?: string;
  value?: number;
  sequence?: number;
}

/**
 * Interface for Bitcoin transaction output
 */
export interface BitcoinTxOutput {
  value: number;
  address?: string;
  scriptPubKey?: string;
  n: number;
  spent?: boolean;
}

/**
 * Interface for Bitcoin transaction history item
 */
export interface BitcoinTransactionHistory {
  txid: string;
  amount: string;
  type: 'send' | 'receive' | 'vault' | 'contract';
  timestamp: number;
  recipient?: string;
  sender?: string;
  description?: string;
  status: 'pending' | 'confirmed' | 'failed';
  confirmations: number;
  blockHeight?: number;
  fee?: string;
}

/**
 * Interface for Bitcoin price information
 */
export interface BitcoinPriceInfo {
  usd: number;
  usd_24h_change: number;
  usd_market_cap: number;
  last_updated_at: number;
}

/**
 * Interface for Bitcoin provider
 */
export interface BitcoinProvider {
  connect: () => Promise<boolean>;
  disconnect: () => Promise<boolean>;
  getWalletInfo: () => Promise<BitcoinWalletInfo | null>;
  sendBitcoin: (toAddress: string, amount: string) => Promise<{
    success: boolean;
    txid?: string;
    error?: string;
  }>;
  createVault: (params: {
    unlockDate: Date | number;
    recipient?: string;
    amount: string;
    description?: string;
  }) => Promise<{
    success: boolean;
    vaultAddress?: string;
    txid?: string;
    error?: string;
  }>;
  getTransactionHistory: () => Promise<BitcoinTransactionHistory[]>;
  getPriceInfo: () => Promise<BitcoinPriceInfo | null>;
  verifyMessage: (message: string, signature: string, address: string) => Promise<boolean>;
  signMessage: (message: string) => Promise<{
    success: boolean;
    signature?: string;
    error?: string;
  }>;
}

/**
 * Interface for Bitcoin network information
 */
export interface BitcoinNetworkInfo {
  difficulty: number;
  blocks: number;
  hashrate: number;
  chain: 'main' | 'test' | 'regtest';
  fees: {
    fastestFee: number;  // satoshis per byte
    halfHourFee: number;
    hourFee: number;
    economyFee: number;
    minimumFee: number;
  };
  nextHalvingBlock: number;
  blocksUntilHalving: number;
  estimatedHalvingDate: Date;
}

/**
 * Interface for Bitcoin halving information
 */
export interface BitcoinHalvingInfo {
  currentReward: number;
  nextReward: number;
  blocksUntilHalving: number;
  estimatedDaysUntilHalving: number;
  estimatedHalvingDate: Date;
  halvingIndex: number;  // which halving is next (4 = 4th halving)
  blockHeight: number;
}

/**
 * Interface for Bitcoin vault configuration
 */
export interface BitcoinVaultConfig {
  vaultType: 'time-locked' | 'multi-signature' | 'hash-locked' | 'diamond-hands';
  unlockDate?: Date;
  unlockHeight?: number;
  signaturesRequired?: number;
  totalSigners?: number;
  signers?: string[];  // Array of addresses
  hashLock?: string;   // For hash-locked contracts
  penalty?: number;    // For early withdrawal penalty (percentage)
  minHodlDays?: number; // Minimum holding period for diamond-hands vaults
}