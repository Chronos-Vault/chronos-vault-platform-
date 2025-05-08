/**
 * Blockchain Connector Interface
 * 
 * This interface defines the standard methods that each blockchain connector
 * must implement. It provides a consistent API for interacting with different
 * blockchain networks (Ethereum, Solana, TON, and Bitcoin).
 */

import {
  TransactionResult,
  VaultData,
  VaultCreationParams,
  MultiSigRequestStatus,
  SecurityVerification,
  WalletData,
  BitcoinData
} from '../types/blockchain-types';

/**
 * BlockchainConnector interface defining the standard methods for blockchain interactions
 */
export interface BlockchainConnector {
  // Chain identification
  readonly chainId: string;
  readonly isTestnet: boolean;
  
  // Connection management
  connect(): Promise<WalletData>;
  disconnect(): Promise<void>;
  isConnected(): Promise<boolean>;
  getNetworkStatus(): Promise<{ isConnected: boolean; network: string; blockHeight?: number }>;
  
  // Basic blockchain operations
  getBalance(address: string): Promise<string>;
  validateAddress(address: string): boolean;
  validateTransaction(txHash: string): Promise<TransactionResult>;
  estimateTransactionFee(to: string, amount: string, data?: any): Promise<string>;
  
  // Transaction operations
  sendTransaction(to: string, amount: string, data?: any): Promise<TransactionResult>;
  callContract(contractAddress: string, method: string, params: any[]): Promise<any>;
  
  // Vault operations
  createVault(params: VaultCreationParams): Promise<TransactionResult>;
  getVault(vaultId: string): Promise<VaultData | null>;
  depositToVault(vaultId: string, amount: string, assetType: string): Promise<TransactionResult>;
  withdrawFromVault(vaultId: string): Promise<TransactionResult>;
  
  // Multi-signature operations
  requestMultiSigOperation(
    vaultId: string,
    operation: 'create' | 'withdraw' | 'update' | 'transfer',
    params: any
  ): Promise<string>; // Returns request ID
  
  approveMultiSigRequest(requestId: string): Promise<TransactionResult>;
  rejectMultiSigRequest(requestId: string): Promise<TransactionResult>;
  getMultiSigStatus(requestId: string): Promise<MultiSigRequestStatus>;
  
  // Signature verification
  signMessage(message: string): Promise<string>;
  verifySignature(message: string, signature: string, address: string): Promise<boolean>;
  
  // Cross-chain operations
  initiateVaultSync(vaultId: string, targetChain: string): Promise<TransactionResult>;
  verifyVaultAcrossChains(vaultId: string): Promise<Record<string, SecurityVerification>>;
  
  // Chain-specific operations
  // These might differ based on the chain's capabilities
  executeSpecialOperation?(operationType: string, params: any): Promise<TransactionResult>;
  
  // Bitcoin-specific operations (will be implemented only in the Bitcoin connector)
  getBitcoinNetworkStats?(): Promise<BitcoinData>;
  getHalvingInfo?(): Promise<{
    blocksUntilHalving: number;
    estimatedHalvingDate: Date;
    daysUntilHalving: number;
    currentReward: number;
    nextReward: number;
  }>;
}