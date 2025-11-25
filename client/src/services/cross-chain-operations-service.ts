// Trinity Protocol v3.5.18 - Updated: 2025-11-25T19:32:03.045Z
import { BlockchainType } from '@/contexts/multi-chain-context';
import { OperationType, TransactionStatus } from '@/components/cross-chain/CrossChainControlPanel';

// Interface for cross-chain operation
export interface CrossChainOperation {
  id: string;
  userId?: string;
  type: OperationType;
  sourceChain: BlockchainType;
  destinationChain: BlockchainType;
  amount: number;
  asset: string;
  timestamp: Date;
  status: TransactionStatus;
  fee: number;
  estimatedCompletionTime: Date;
  prioritizeSpeed: boolean;
  prioritizeSecurity: boolean;
  slippageTolerance?: number;
  targetTxHash?: string;
}

// Interface for chain info
export interface ChainInfo {
  id: BlockchainType;
  name: string;
  isActive: boolean;
  feeRange: {
    min: number;
    max: number;
  };
}

// Interface for blockchain metrics
export interface BlockchainMetrics {
  [key: string]: {
    blockTime: number;
    transactionFee: number;
    congestionLevel: number;
    securityScore: number;
  };
}

/**
 * Service for cross-chain operations
 */
class CrossChainOperationsService {
  private static instance: CrossChainOperationsService;
  private readonly apiBaseUrl: string = '/api';

  private constructor() {
    // Singleton pattern
  }

  /**
   * Get service instance (singleton)
   */
  public static getInstance(): CrossChainOperationsService {
    if (!CrossChainOperationsService.instance) {
      CrossChainOperationsService.instance = new CrossChainOperationsService();
    }
    return CrossChainOperationsService.instance;
  }

  /**
   * Get operations for the current user
   */
  public async getUserOperations(userId: string): Promise<CrossChainOperation[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/cross-chain-operations/user?userId=${userId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch user operations');
      }
      
      const data = await response.json();
      
      // Convert the API response to our frontend model
      return this.mapOperationsFromApi(data.operations);
    } catch (error) {
      console.error('Error fetching user operations:', error);
      // For demo purposes, return some sample operations if the API fails
      return this.getFallbackOperations();
    }
  }

  /**
   * Get operation by ID
   */
  public async getOperationById(operationId: string): Promise<CrossChainOperation | null> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/cross-chain-operations/${operationId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch operation');
      }
      
      const data = await response.json();
      
      // Convert the API response to our frontend model
      return this.mapOperationFromApi(data.operation);
    } catch (error) {
      console.error(`Error fetching operation ${operationId}:`, error);
      return null;
    }
  }

  /**
   * Create a new cross-chain operation
   */
  public async createOperation(
    type: OperationType,
    sourceChain: BlockchainType,
    destinationChain: BlockchainType,
    amount: number,
    asset: string,
    prioritizeSpeed: boolean = false,
    prioritizeSecurity: boolean = false,
    slippageTolerance: number = 0.5,
    userId?: string
  ): Promise<CrossChainOperation> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/cross-chain-operations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type,
          sourceChain,
          destinationChain,
          amount,
          asset,
          prioritizeSpeed,
          prioritizeSecurity,
          slippageTolerance,
          userId
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create operation');
      }
      
      const data = await response.json();
      
      // Convert the API response to our frontend model
      return this.mapOperationFromApi(data.operation);
    } catch (error) {
      console.error('Error creating operation:', error);
      throw error;
    }
  }

  /**
   * Cancel an operation
   */
  public async cancelOperation(operationId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/cross-chain-operations/${operationId}/cancel`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel operation');
      }
      
      return true;
    } catch (error) {
      console.error(`Error canceling operation ${operationId}:`, error);
      return false;
    }
  }

  /**
   * Get supported chains
   */
  public async getSupportedChains(): Promise<ChainInfo[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/cross-chain-operations/chains`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch supported chains');
      }
      
      const data = await response.json();
      return data.supportedChains;
    } catch (error) {
      console.error('Error fetching supported chains:', error);
      // Fallback to default chains if API fails
      return this.getFallbackSupportedChains();
    }
  }

  /**
   * Get fee estimate
   */
  public async getFeeEstimate(
    type: OperationType,
    sourceChain: BlockchainType,
    destinationChain: BlockchainType,
    amount: number,
    prioritizeSpeed: boolean = false,
    prioritizeSecurity: boolean = false
  ): Promise<number> {
    try {
      const queryParams = new URLSearchParams({
        type,
        sourceChain,
        destinationChain,
        amount: amount.toString(),
        prioritizeSpeed: prioritizeSpeed.toString(),
        prioritizeSecurity: prioritizeSecurity.toString()
      });
      
      const response = await fetch(`${this.apiBaseUrl}/cross-chain-operations/fee-estimate?${queryParams.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch fee estimate');
      }
      
      const data = await response.json();
      return data.fee;
    } catch (error) {
      console.error('Error fetching fee estimate:', error);
      // Fallback to a simple estimate if API fails
      return this.calculateFallbackFee(type, amount, prioritizeSpeed, prioritizeSecurity);
    }
  }

  /**
   * Get blockchain metrics
   */
  public async getBlockchainMetrics(): Promise<BlockchainMetrics> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/cross-chain-operations/metrics`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch blockchain metrics');
      }
      
      const data = await response.json();
      return data.metrics;
    } catch (error) {
      console.error('Error fetching blockchain metrics:', error);
      // Fallback to default metrics if API fails
      return this.getFallbackBlockchainMetrics();
    }
  }

  // Helper methods for mapping API responses to frontend models

  private mapOperationFromApi(apiOperation: any): CrossChainOperation {
    return {
      id: apiOperation.id,
      userId: apiOperation.userId,
      type: apiOperation.type as OperationType,
      sourceChain: apiOperation.sourceChain as BlockchainType,
      destinationChain: apiOperation.destinationChain as BlockchainType,
      amount: apiOperation.amount,
      asset: apiOperation.asset,
      timestamp: new Date(apiOperation.timestamp),
      status: apiOperation.status as TransactionStatus,
      fee: apiOperation.fee,
      estimatedCompletionTime: new Date(apiOperation.estimatedCompletionTime),
      prioritizeSpeed: apiOperation.prioritizeSpeed,
      prioritizeSecurity: apiOperation.prioritizeSecurity,
      slippageTolerance: apiOperation.slippageTolerance,
      targetTxHash: apiOperation.targetTxHash
    };
  }

  private mapOperationsFromApi(apiOperations: any[]): CrossChainOperation[] {
    return apiOperations.map(operation => this.mapOperationFromApi(operation));
  }

  // Fallback methods for when the API is unavailable

  private getFallbackOperations(): CrossChainOperation[] {
    return [
      {
        id: 'fallback-op-1',
        type: OperationType.TRANSFER,
        sourceChain: BlockchainType.ETHEREUM,
        destinationChain: BlockchainType.SOLANA,
        amount: 1.5,
        asset: 'ETH',
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        status: TransactionStatus.COMPLETED,
        fee: 0.015,
        estimatedCompletionTime: new Date(Date.now() - 1200000), // 20 minutes ago
        prioritizeSpeed: true,
        prioritizeSecurity: false
      },
      {
        id: 'fallback-op-2',
        type: OperationType.SWAP,
        sourceChain: BlockchainType.TON,
        destinationChain: BlockchainType.ETHEREUM,
        amount: 50,
        asset: 'TON',
        timestamp: new Date(Date.now() - 7200000), // 2 hours ago
        status: TransactionStatus.COMPLETED,
        fee: 0.25,
        estimatedCompletionTime: new Date(Date.now() - 5400000), // 1.5 hours ago
        prioritizeSpeed: false,
        prioritizeSecurity: true
      },
      {
        id: 'fallback-op-3',
        type: OperationType.BRIDGE,
        sourceChain: BlockchainType.SOLANA,
        destinationChain: BlockchainType.TON,
        amount: 25,
        asset: 'SOL',
        timestamp: new Date(Date.now() - 900000), // 15 minutes ago
        status: TransactionStatus.PROCESSING,
        fee: 0.12,
        estimatedCompletionTime: new Date(Date.now() + 600000), // 10 minutes from now
        prioritizeSpeed: true,
        prioritizeSecurity: true
      }
    ];
  }

  private getFallbackSupportedChains(): ChainInfo[] {
    return [
      {
        id: BlockchainType.ETHEREUM,
        name: 'Ethereum',
        isActive: true,
        feeRange: { min: 0.001, max: 0.05 }
      },
      {
        id: BlockchainType.SOLANA,
        name: 'Solana',
        isActive: true,
        feeRange: { min: 0.0001, max: 0.01 }
      },
      {
        id: BlockchainType.TON,
        name: 'TON',
        isActive: true,
        feeRange: { min: 0.0005, max: 0.03 }
      },
      {
        id: BlockchainType.BITCOIN,
        name: 'Bitcoin',
        isActive: true,
        feeRange: { min: 0.0002, max: 0.02 }
      }
    ];
  }

  private calculateFallbackFee(
    type: OperationType,
    amount: number,
    prioritizeSpeed: boolean,
    prioritizeSecurity: boolean
  ): number {
    // Simple fallback calculation
    let baseFee = amount * 0.005; // 0.5% base fee
    
    if (type === OperationType.BRIDGE) {
      baseFee *= 1.5; // 50% more for bridges
    } else if (type === OperationType.SWAP) {
      baseFee *= 1.3; // 30% more for swaps
    }
    
    if (prioritizeSpeed) {
      baseFee *= 1.25; // 25% more for speed priority
    }
    
    if (prioritizeSecurity) {
      baseFee *= 1.2; // 20% more for security priority
    }
    
    return parseFloat(baseFee.toFixed(6));
  }

  private getFallbackBlockchainMetrics(): BlockchainMetrics {
    return {
      [BlockchainType.ETHEREUM]: {
        blockTime: 12, // seconds
        transactionFee: 0.002, // ETH
        congestionLevel: 65, // percentage
        securityScore: 92, // out of 100
      },
      [BlockchainType.SOLANA]: {
        blockTime: 0.4, // seconds
        transactionFee: 0.0002, // SOL
        congestionLevel: 30, // percentage
        securityScore: 87, // out of 100
      },
      [BlockchainType.TON]: {
        blockTime: 5, // seconds
        transactionFee: 0.0008, // TON
        congestionLevel: 25, // percentage
        securityScore: 85, // out of 100
      },
      [BlockchainType.BITCOIN]: {
        blockTime: 600, // seconds
        transactionFee: 0.0004, // BTC
        congestionLevel: 40, // percentage
        securityScore: 95, // out of 100
      }
    };
  }
}

export default CrossChainOperationsService;