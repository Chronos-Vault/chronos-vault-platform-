/**
 * Universal Blockchain Connector Interface
 * This provides a standardized way to interact with multiple blockchains
 * while abstracting away the implementation details specific to each chain.
 */

export interface VaultCreationParams {
  ownerAddress: string;
  name: string;
  description?: string;
  timelock?: number; // In seconds
  beneficiaries?: string[];
  securityLevel: 'standard' | 'enhanced' | 'maximum';
  vaultType: 'standard' | 'legacy' | 'multi-signature' | 'event-triggered';
  crossChainEnabled: boolean;
  zkPrivacyEnabled: boolean;
  initialBalance?: string;
  initialAssetType?: string;
  extraParams?: Record<string, any>; // Chain-specific parameters
}

export interface SecurityVerification {
  isIntact: boolean;
  lastVerified: Date;
  crossChainConfirmations: number;
  signatureValidations: number;
  integrityScore: number; // 0-100
  securityAlerts: SecurityAlert[];
}

export interface SecurityAlert {
  level: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: Date;
  recommendedAction?: string;
}

export interface ChainFeatures {
  supportsSmartContracts: boolean;
  transactionSpeed: 'slow' | 'medium' | 'fast' | 'instant';
  costEfficiency: 'low' | 'medium' | 'high';
  securityLevel: 'standard' | 'high' | 'maximum';
  specialCapabilities: string[];
  maxTransactionValue?: string;
  governanceFeatures?: string[];
  privacyFeatures?: string[];
}

export interface VaultStatusInfo {
  vaultId: string;
  chainId: string;
  ownerAddress: string;
  createdAt: Date;
  lastModified: Date;
  status: 'active' | 'pending' | 'locked' | 'unlocked';
  balance: string;
  assetType: string;
  unlockDate?: Date;
  securityInfo: SecurityVerification;
  crossChainStatus?: Record<string, string>;
}

export interface TransactionResult {
  success: boolean;
  transactionHash: string;
  blockNumber?: number;
  timestamp: Date;
  fee: string;
  confirmations: number;
  status: 'pending' | 'confirmed' | 'failed';
  errorMessage?: string;
}

/**
 * Primary interface that defines the standard methods available
 * for all blockchain integrations in Chronos Vault
 */
export interface BlockchainConnector {
  chainId: string;
  chainName: string;
  isTestnet: boolean;
  networkVersion: string;
  
  // Wallet connection
  connectWallet(): Promise<string>; // Returns address
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
  
  // Multi-signature features
  createMultiSigRequest(vaultId: string, operation: string, params: any): Promise<string>; // Returns request ID
  approveMultiSigRequest(requestId: string): Promise<TransactionResult>;
  getMultiSigStatus(requestId: string): Promise<{approved: number, required: number, executed: boolean}>;
  
  // Cross-chain operations
  initiateVaultSync(vaultId: string, targetChain: string): Promise<TransactionResult>;
  verifyVaultAcrossChains(vaultId: string): Promise<Record<string, SecurityVerification>>;
  
  // Chain-specific features
  getChainSpecificFeatures(): ChainFeatures;
  executeChainSpecificMethod(methodName: string, params: any): Promise<any>;
  
  // Event subscription
  subscribeToVaultEvents(vaultId: string, callback: (event: any) => void): () => void; // Returns unsubscribe function
  subscribeToBlockchainEvents(eventType: string, callback: (event: any) => void): () => void;
}
