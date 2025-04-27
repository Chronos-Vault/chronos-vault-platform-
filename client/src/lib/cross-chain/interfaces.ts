/**
 * Types and interfaces for cross-chain functionality
 */

/**
 * Supported blockchain types
 */
export type BlockchainType = 'TON' | 'ETH' | 'SOL' | 'MATIC' | 'BNB';

/**
 * Transfer status types
 */
export type TransferStatus = 'pending' | 'initiated' | 'in_progress' | 'completed' | 'failed';

/**
 * Transfer priority modes
 */
export type TransferPriority = 'speed' | 'cost' | 'security';

/**
 * Network configuration interface
 */
export interface NetworkConfig {
  name: string;
  displayName: string;
  description: string;
  icon: string;
  explorerURL: string;
  testnetExplorerURL?: string;
  color: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: {
    mainnet: string[];
    testnet: string[];
  };
  testnetName: string;
  blockTime: number; // in seconds
}

/**
 * Token configuration interface
 */
export interface TokenConfig {
  symbol: string;
  name: string;
  decimals: number;
  address: {
    mainnet: string;
    testnet: string;
  };
  icon: string;
  isStablecoin?: boolean;
}

/**
 * Interface for bridge transactions
 */
export interface BridgeTransaction {
  id: string;
  txHash: string;
  sourceChain: BlockchainType;
  targetChain: BlockchainType;
  sourceToken: string;
  targetToken: string;
  amount: number;
  sender: string;
  recipient: string;
  status: TransferStatus;
  timestamp: number;
  estimatedCompletionTime: number;
  fee: number;
  nonce: number;
}

/**
 * Interface for transfer routes
 */
export interface TransferRoute {
  path: Array<{
    network: BlockchainType;
    protocol: string;
  }>;
  estimatedTime: number;
  fees: {
    protocolFee: number;
    gasFee: number;
    totalFee: number;
  };
  security: 'low' | 'medium' | 'high';
}

/**
 * Interface for secure cross-chain transfer validation
 */
export interface SecureTransferRequest {
  id: string;
  sourceChain: BlockchainType;
  targetChain: BlockchainType;
  sourceAddress: string;
  targetAddress: string;
  sourceToken: string;
  targetToken: string;
  amount: number;
  usdValue: number;
  signatures: string[];
  status: 'pending' | 'validated' | 'rejected';
  validationThreshold: number;
  createdAt: number;
}

/**
 * Interface for cross-chain bridge
 */
export interface CrossChainBridge {
  bridgeOut(params: {
    sourceChain: BlockchainType;
    targetChain: BlockchainType;
    token: string;
    amount: number;
    recipient: string;
  }): Promise<{
    success: boolean;
    txHash?: string;
    id?: string;
    error?: string;
  }>;
  
  getBridgeStatus(id: string): Promise<{
    status: TransferStatus;
    progress: number;
    txHash?: string;
    error?: string;
  }>;
  
  estimateFee(params: {
    sourceChain: BlockchainType;
    targetChain: BlockchainType;
    token: string;
    amount: number;
  }): Promise<{
    fee: number;
    gasCost: number;
    totalCost: number;
  }>;
  
  estimateTime(params: {
    sourceChain: BlockchainType;
    targetChain: BlockchainType;
  }): Promise<{
    estimatedTime: number; // in seconds
  }>;
  
  getRoute(params: {
    sourceChain: BlockchainType;
    targetChain: BlockchainType;
    priority: TransferPriority;
  }): Promise<TransferRoute>;
  
  isBridgeable(params: {
    sourceChain: BlockchainType;
    targetChain: BlockchainType;
    token: string;
  }): Promise<{
    bridgeable: boolean;
    reason?: string;
  }>;
}