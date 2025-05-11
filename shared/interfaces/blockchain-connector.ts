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
  
  // Cross-chain bridge operations
  initializeBridge(targetChain: string): Promise<TransactionResult>;
  getBridgeStatus(targetChain: string): Promise<any>;
  lockAsset(amount: number, assetType: string, senderAddress: string, targetChain: string, recipientAddress: string): Promise<TransactionResult>;
  unlockAsset(txId: string, proof: string, amount: number, recipientAddress: string): Promise<TransactionResult>;
  verifyTransaction(txHash: string): Promise<{ verified: boolean; details: any }>;
  
  // Atomic swap operations
  initiateAtomicSwap(
    targetChain: string,
    assetType: string,
    amount: number,
    senderAddress: string,
    recipientAddress: string,
    hashLock: string,
    timelock: number
  ): Promise<TransactionResult>;
  
  participateInAtomicSwap(
    initiatorChain: string,
    assetType: string,
    amount: number,
    initiatorAddress: string,
    responderAddress: string,
    hashLock: string,
    timelock: number
  ): Promise<TransactionResult>;
  
  completeAtomicSwap(swapId: string, secret: string): Promise<TransactionResult>;
  refundAtomicSwap(swapId: string, refundAddress: string, timelock: number): Promise<TransactionResult>;
  getAtomicSwapStatus(swapId: string): Promise<{ status: string; details: any }>;
  
  // Message relay across chains
  sendCrossChainMessage(targetChain: string, message: any): Promise<TransactionResult>;
  receiveCrossChainMessage(sourceChain: string, messageId: string, message: any, proof: string): Promise<TransactionResult>;
  
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