/**
 * Blockchain Connector Interface
 * 
 * Common interface for all blockchain connectors.
 * This ensures consistent operation across different blockchain implementations.
 */

import { 
  VaultCreationParams, 
  VaultStatusInfo, 
  TransactionResult, 
  SecurityVerification, 
  MultiSigRequestStatus 
} from '../types/blockchain-types';

/**
 * BlockchainConnector interface
 * All blockchain implementations must adhere to this interface
 */
export interface BlockchainConnector {
  // Common properties
  chainId: string;
  chainName: string;
  isTestnet: boolean;
  networkVersion: string;
  
  // Wallet operations
  connectWallet(): Promise<string>;
  disconnectWallet(): Promise<void>;
  isConnected(): Promise<boolean>;
  getAddress(): Promise<string>;
  getBalance(address: string): Promise<string>;
  
  // Vault operations
  createVault(params: VaultCreationParams): Promise<TransactionResult>;
  getVaultInfo(vaultId: string): Promise<VaultStatusInfo>;
  listVaults(ownerAddress: string): Promise<VaultStatusInfo[]>;
  lockAssets(vaultId: string, amount: string, assetType: string): Promise<TransactionResult>;
  unlockAssets(vaultId: string): Promise<TransactionResult>;
  addBeneficiary(vaultId: string, beneficiaryAddress: string): Promise<TransactionResult>;
  removeBeneficiary(vaultId: string, beneficiaryAddress: string): Promise<TransactionResult>;
  
  // Security operations
  verifyVaultIntegrity(vaultId: string): Promise<SecurityVerification>;
  signMessage(message: string): Promise<string>;
  verifySignature(message: string, signature: string, address: string): Promise<boolean>;
  
  // Multi-signature operations
  createMultiSigRequest(vaultId: string, operation: string, params: any): Promise<string>;
  approveMultiSigRequest(requestId: string): Promise<TransactionResult>;
  getMultiSigStatus(requestId: string): Promise<MultiSigRequestStatus>;
  
  // Cross-chain operations
  initiateVaultSync(vaultId: string, targetChain: string): Promise<TransactionResult>;
  verifyVaultAcrossChains(vaultId: string): Promise<Record<string, SecurityVerification>>;
  
  // Miscellaneous
  getChainSpecificFeatures(): any;
  executeChainSpecificMethod(methodName: string, params: any): Promise<any>;
  
  // Event subscriptions
  subscribeToVaultEvents(vaultId: string, callback: (event: any) => void): () => void;
  subscribeToBlockchainEvents(eventType: string, callback: (event: any) => void): () => void;
}