/**
 * Cross-Chain Bridge Service
 * 
 * This service provides methods for interacting with the Cross-Chain Bridge API
 * to transfer assets and perform atomic swaps between different blockchain networks.
 */

import { apiRequest } from '@/lib/queryClient';

import { 
  BridgeStatus, 
  BlockchainType, 
  BridgeTransactionParams,
  AtomicSwapParams,
  CrossChainTransaction
} from '@shared/types/blockchain-types';

export class CrossChainBridgeService {
  /**
   * Get the status of all cross-chain bridges
   * 
   * @returns A record of bridge statuses indexed by source-target chain pair
   */
  static async getBridgeStatuses(): Promise<Record<string, BridgeStatus>> {
    const response = await apiRequest('GET', '/api/bridge/status');
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch bridge statuses');
    }
    
    return data.data;
  }
  
  /**
   * Get the status of a specific bridge
   * 
   * @param sourceChain Source blockchain
   * @param targetChain Target blockchain
   * @returns Bridge status
   */
  static async getBridgeStatus(sourceChain: BlockchainType, targetChain: BlockchainType): Promise<BridgeStatus> {
    const response = await apiRequest('GET', `/api/bridge/status/${sourceChain}/${targetChain}`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch bridge status');
    }
    
    return data.data;
  }
  
  /**
   * Initialize a bridge between two chains
   * 
   * @param sourceChain Source blockchain
   * @param targetChain Target blockchain
   * @returns True if initialization was successful
   */
  static async initializeBridge(sourceChain: BlockchainType, targetChain: BlockchainType): Promise<boolean> {
    const response = await apiRequest('POST', '/api/bridge/initialize', {
      sourceChain,
      targetChain
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to initialize bridge');
    }
    
    return true;
  }
  
  /**
   * Transfer assets from one chain to another
   * 
   * @param params Transfer parameters
   * @returns Transaction ID
   */
  static async transferAsset(params: BridgeTransactionParams): Promise<string> {
    const response = await apiRequest('POST', '/api/bridge/transfer', params);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to transfer asset');
    }
    
    return data.data.id;
  }
  
  /**
   * Get a list of all active bridge transactions
   * 
   * @returns List of bridge transactions
   */
  static async getTransactions(): Promise<any[]> {
    const response = await apiRequest('GET', '/api/bridge/transactions');
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch transactions');
    }
    
    return data.data;
  }
  
  /**
   * Get details of a specific transaction
   * 
   * @param transactionId Transaction ID
   * @returns Transaction details
   */
  static async getTransaction(transactionId: string): Promise<any> {
    const response = await apiRequest('GET', `/api/bridge/transactions/${transactionId}`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch transaction');
    }
    
    return data.data;
  }
  
  /**
   * Create an atomic swap between two chains
   * 
   * @param params Atomic swap parameters
   * @returns Swap ID
   */
  static async createAtomicSwap(params: AtomicSwapParams): Promise<string> {
    const response = await apiRequest('POST', '/api/bridge/atomic-swap', params);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to create atomic swap');
    }
    
    return data.data.id;
  }
  
  /**
   * Get all atomic swaps
   * 
   * @returns List of atomic swaps
   */
  static async getAtomicSwaps(): Promise<any[]> {
    const response = await apiRequest('GET', '/api/bridge/atomic-swaps');
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch atomic swaps');
    }
    
    return data.data;
  }
  
  /**
   * Get details of a specific atomic swap
   * 
   * @param swapId Swap ID
   * @returns Swap details
   */
  static async getAtomicSwap(swapId: string): Promise<any> {
    const response = await apiRequest('GET', `/api/bridge/atomic-swaps/${swapId}`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch atomic swap');
    }
    
    return data.data;
  }
  
  /**
   * Participate in an atomic swap
   * 
   * @param swapId Swap ID
   * @param responderAddress Responder's address
   * @returns True if participation was successful
   */
  static async participateInAtomicSwap(swapId: string, responderAddress: string): Promise<boolean> {
    const response = await apiRequest('POST', `/api/bridge/atomic-swaps/${swapId}/participate`, {
      responderAddress
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to participate in atomic swap');
    }
    
    return true;
  }
  
  /**
   * Complete an atomic swap
   * 
   * @param swapId Swap ID
   * @param secret Secret to reveal
   * @returns True if completion was successful
   */
  static async completeAtomicSwap(swapId: string, secret: string): Promise<boolean> {
    const response = await apiRequest('POST', `/api/bridge/atomic-swaps/${swapId}/complete`, {
      secret
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to complete atomic swap');
    }
    
    return true;
  }
  
  /**
   * Refund an atomic swap
   * 
   * @param swapId Swap ID
   * @returns True if refund was successful
   */
  static async refundAtomicSwap(swapId: string): Promise<boolean> {
    const response = await apiRequest('POST', `/api/bridge/atomic-swaps/${swapId}/refund`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to refund atomic swap');
    }
    
    return true;
  }
  
  /**
   * Verify a transaction across chains
   * 
   * @param transactionId Transaction ID
   * @param sourceChain Source blockchain
   * @param targetChain Target blockchain
   * @returns Verification result
   */
  static async verifyTransaction(
    transactionId: string,
    sourceChain: BlockchainType,
    targetChain: BlockchainType
  ): Promise<{ verified: boolean; details: any }> {
    const response = await apiRequest('GET', `/api/bridge/verify/${transactionId}`, {
      sourceChain,
      targetChain
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to verify transaction');
    }
    
    return data.data;
  }
}

export default CrossChainBridgeService;