/**
 * Cross-Chain Bridge Service
 * 
 * This service provides the frontend interface for interacting with the cross-chain bridge API.
 */

import { apiRequest } from "@/lib/queryClient";
import type { ChainType as BlockchainType } from "@/hooks/use-blockchain";

/**
 * Bridge transaction status
 */
export enum BridgeTransactionStatus {
  PENDING = 'pending',
  CONFIRMING = 'confirming',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

/**
 * Atomic swap status
 */
export enum AtomicSwapStatus {
  INITIATED = 'initiated',
  PARTICIPANT_JOINED = 'participant_joined',
  COMPLETED = 'completed',
  REFUNDED = 'refunded',
  EXPIRED = 'expired'
}

/**
 * Bridge transaction interface
 */
export interface BridgeTransaction {
  id: string;
  sourceChain: BlockchainType;
  targetChain: BlockchainType;
  amount: number;
  assetType: string;
  senderAddress: string;
  recipientAddress: string;
  status: BridgeTransactionStatus;
  sourceTransactionId?: string;
  targetTransactionId?: string;
  timestamp: string;
  lastUpdated: string;
  error?: string;
}

/**
 * Atomic swap transaction interface
 */
export interface AtomicSwapTransaction {
  id: string;
  initiatorChain: BlockchainType;
  responderChain: BlockchainType;
  initiatorAsset: string;
  responderAsset: string;
  initiatorAmount: number;
  responderAmount: number;
  initiatorAddress: string;
  responderAddress?: string;
  status: AtomicSwapStatus;
  timelock: number;
  hashLock?: string;
  secret?: string;
  initiatorTransactionId?: string;
  responderTransactionId?: string;
  timestamp: string;
  lastUpdated: string;
  error?: string;
}

/**
 * Bridge status interface
 */
export interface BridgeStatus {
  status: 'operational' | 'degraded' | 'down';
  latency: number;
  pendingTransactions: number;
  successRate: number;
}

/**
 * Cross-Chain Bridge Service class
 */
class CrossChainBridgeService {
  /**
   * Get all bridge statuses
   * @returns Record of bridge statuses by chain pair
   */
  async getBridgeStatuses(): Promise<Record<string, BridgeStatus>> {
    const response = await apiRequest("GET", "/api/bridge/status");
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || "Failed to get bridge statuses");
    }
    
    return data.data;
  }
  
  /**
   * Get status for a specific bridge
   * @param sourceChain Source blockchain
   * @param targetChain Target blockchain
   * @returns Bridge status
   */
  async getBridgeStatus(sourceChain: BlockchainType, targetChain: BlockchainType): Promise<BridgeStatus> {
    const response = await apiRequest("GET", `/api/bridge/status/${sourceChain}/${targetChain}`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || "Failed to get bridge status");
    }
    
    return data.data;
  }
  
  /**
   * Initialize a bridge
   * @param sourceChain Source blockchain
   * @param targetChain Target blockchain
   * @returns Initialization result
   */
  async initializeBridge(sourceChain: BlockchainType, targetChain: BlockchainType): Promise<any> {
    const response = await apiRequest("POST", "/api/bridge/initialize", {
      sourceChain,
      targetChain
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || "Failed to initialize bridge");
    }
    
    return data.data;
  }
  
  /**
   * Transfer an asset across chains
   * @param params Transfer parameters
   * @returns Transaction ID
   */
  async transferAsset(params: {
    sourceChain: BlockchainType;
    targetChain: BlockchainType;
    amount: number;
    assetType: string;
    senderAddress: string;
    recipientAddress: string;
  }): Promise<string> {
    const response = await apiRequest("POST", "/api/bridge/transfer", params);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || "Failed to transfer asset");
    }
    
    return data.data.id;
  }
  
  /**
   * Get all bridge transactions
   * @returns List of transactions
   */
  async getTransactions(): Promise<BridgeTransaction[]> {
    const response = await apiRequest("GET", "/api/bridge/transactions");
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || "Failed to get transactions");
    }
    
    return data.data;
  }
  
  /**
   * Get a specific transaction
   * @param id Transaction ID
   * @returns Transaction details
   */
  async getTransaction(id: string): Promise<BridgeTransaction> {
    const response = await apiRequest("GET", `/api/bridge/transactions/${id}`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || "Failed to get transaction");
    }
    
    return data.data;
  }
  
  /**
   * Verify a transaction
   * @param id Transaction ID
   * @param sourceChain Source blockchain
   * @param targetChain Target blockchain
   * @returns Verification result
   */
  async verifyTransaction(id: string, sourceChain: BlockchainType, targetChain: BlockchainType): Promise<any> {
    const response = await apiRequest("GET", `/api/bridge/verify/${id}?sourceChain=${sourceChain}&targetChain=${targetChain}`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || "Failed to verify transaction");
    }
    
    return data.data;
  }
  
  /**
   * Create an atomic swap
   * @param params Swap parameters
   * @returns Swap ID
   */
  async createAtomicSwap(params: {
    initiatorChain: BlockchainType;
    responderChain: BlockchainType;
    initiatorAsset: string;
    responderAsset: string;
    initiatorAmount: number;
    responderAmount: number;
    initiatorAddress: string;
    responderAddress: string;
    timelock: number;
  }): Promise<string> {
    const response = await apiRequest("POST", "/api/bridge/atomic-swap", params);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || "Failed to create atomic swap");
    }
    
    return data.data.id;
  }
  
  /**
   * Get all atomic swaps
   * @returns List of atomic swaps
   */
  async getAtomicSwaps(): Promise<AtomicSwapTransaction[]> {
    const response = await apiRequest("GET", "/api/bridge/atomic-swaps");
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || "Failed to get atomic swaps");
    }
    
    return data.data;
  }
  
  /**
   * Get a specific atomic swap
   * @param id Swap ID
   * @returns Swap details
   */
  async getAtomicSwap(id: string): Promise<AtomicSwapTransaction> {
    const response = await apiRequest("GET", `/api/bridge/atomic-swaps/${id}`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || "Failed to get atomic swap");
    }
    
    return data.data;
  }
  
  /**
   * Participate in an atomic swap
   * @param id Swap ID
   * @param responderAddress Responder's blockchain address
   * @returns Participation result
   */
  async participateInAtomicSwap(id: string, responderAddress: string): Promise<any> {
    const response = await apiRequest("POST", `/api/bridge/atomic-swaps/${id}/participate`, {
      responderAddress
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || "Failed to participate in atomic swap");
    }
    
    return data.data;
  }
  
  /**
   * Complete an atomic swap
   * @param id Swap ID
   * @param secret Secret to unlock the hashlock
   * @returns Completion result
   */
  async completeAtomicSwap(id: string, secret: string): Promise<any> {
    const response = await apiRequest("POST", `/api/bridge/atomic-swaps/${id}/complete`, {
      secret
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || "Failed to complete atomic swap");
    }
    
    return data.data;
  }
  
  /**
   * Refund an atomic swap
   * @param id Swap ID
   * @returns Refund result
   */
  async refundAtomicSwap(id: string): Promise<any> {
    const response = await apiRequest("POST", `/api/bridge/atomic-swaps/${id}/refund`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || "Failed to refund atomic swap");
    }
    
    return data.data;
  }
  
  /**
   * Connect to a blockchain wallet
   * @param chain Blockchain to connect to
   * @returns Connection result
   */
  async connectWallet(chain: BlockchainType): Promise<any> {
    const response = await apiRequest("POST", "/api/bridge/connect", { chain });
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || "Failed to connect wallet");
    }
    
    return data.data;
  }
  
  /**
   * Disconnect from a blockchain wallet
   * @param chain Blockchain to disconnect from
   * @returns Disconnection result
   */
  async disconnectWallet(chain: BlockchainType): Promise<boolean> {
    const response = await apiRequest("POST", "/api/bridge/disconnect", { chain });
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || "Failed to disconnect wallet");
    }
    
    return true;
  }
  
  /**
   * Refresh wallet balances
   * @param chains List of blockchains to refresh
   * @returns Updated balances
   */
  async refreshBalances(chains: BlockchainType[]): Promise<Record<BlockchainType, any>> {
    const response = await apiRequest("POST", "/api/bridge/refresh-balances", { chains });
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || "Failed to refresh balances");
    }
    
    return data.data;
  }
}

// Export a singleton instance
export const crossChainBridgeService = new CrossChainBridgeService();