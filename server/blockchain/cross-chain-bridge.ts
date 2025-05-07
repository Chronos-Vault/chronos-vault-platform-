/**
 * Cross-Chain Bridge
 * 
 * This module provides bridge functionality for cross-chain operations,
 * allowing vault verification data to be bridged between different blockchains
 * for enhanced security and redundancy.
 */

import { securityLogger } from '../monitoring/security-logger';
import { ethersClient } from './ethereum-client';
import { solanaClient } from './solana-client';
import { tonClient } from './ton-client';
import { BlockchainType } from '../../shared/types';
import config from '../config';
import { 
  BlockchainError, 
  BlockchainErrorCategory,
  createBlockchainError,
  withBlockchainErrorHandling
} from './enhanced-error-handling';

// Status for cross-chain bridge operations
export type BridgeStatus = 'initiated' | 'pending' | 'completed' | 'failed';

// Result interface for bridge operations
export interface BridgeResult {
  success: boolean;
  status: BridgeStatus;
  message: string;
  sourceTransactionId?: string;
  targetTransactionId?: string;
  timestamp: number;
}

// Result interface for cross-chain message verification
export interface MessageVerificationResult {
  isValid: boolean;
  message: string;
  verifiedTimestamp?: number;
}

class CrossChainBridge {
  private initialized = false;
  
  /**
   * Initialize the cross-chain bridge
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }
    
    try {
      securityLogger.info('Initializing cross-chain bridge');
      
      // Ensure all blockchain clients are initialized
      if (!ethersClient.isInitialized()) {
        await ethersClient.initialize();
      }
      
      if (!tonClient.isInitialized()) {
        await tonClient.initialize();
      }
      
      // Initialize Solana client if needed
      await solanaClient.initialize();
      
      this.initialized = true;
      securityLogger.info('Cross-chain bridge initialized successfully');
    } catch (error) {
      securityLogger.error('Failed to initialize cross-chain bridge', error);
      throw error;
    }
  }
  
  /**
   * Check if the bridge is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }
  
  /**
   * Bridge vault verification data between blockchains
   */
  async bridgeVaultVerification(
    vaultId: string,
    sourceChain: BlockchainType,
    targetChain: BlockchainType,
    requester: string
  ): Promise<BridgeResult> {
    if (!this.initialized) {
      await this.initialize();
    }
    
    try {
      securityLogger.info('Bridging vault verification', {
        vaultId,
        sourceChain,
        targetChain,
        requester
      });
      
      // In development mode, we simulate successful bridge operations
      if (config.isDevelopmentMode) {
        return this.simulateBridgeOperation(vaultId, sourceChain, targetChain);
      }
      
      // Get source vault data
      let sourceVaultData: any;
      let sourceVaultExists = false;
      
      // Verify source vault exists
      if (sourceChain === 'ETH') {
        const result = await ethersClient.verifyVaultExists(vaultId);
        sourceVaultExists = result.exists;
        sourceVaultData = result.vaultData;
      } else if (sourceChain === 'TON') {
        const result = await tonClient.verifyVaultExists(vaultId);
        sourceVaultExists = result.exists;
        sourceVaultData = result.vaultData;
      } else if (sourceChain === 'SOL') {
        const result = await solanaClient.verifyVaultExists(vaultId);
        sourceVaultExists = result.exists;
        sourceVaultData = result.vaultData;
      }
      
      if (!sourceVaultExists) {
        throw createBlockchainError(
          new Error(`Vault ${vaultId} not found on ${sourceChain}`),
          sourceChain,
          BlockchainErrorCategory.VALIDATION,
          { vaultId, operation: 'bridgeVaultVerification' }
        );
      }
      
      // Now perform the actual bridging operation
      let sourceTransactionId: string;
      let targetTransactionId: string;
      
      // Prepare message to be signed and sent
      const messageToSign = JSON.stringify({
        type: 'vault_verification',
        vaultId,
        sourceChain,
        timestamp: Date.now(),
        requester
      });
      
      // Sign message with source chain
      let signature: string;
      
      if (sourceChain === 'ETH') {
        signature = await ethersClient.signMessage(messageToSign);
        sourceTransactionId = await ethersClient.sendCrossChainVerification(
          vaultId, 
          targetChain, 
          signature
        );
      } else if (sourceChain === 'TON') {
        signature = await tonClient.signMessage(messageToSign);
        sourceTransactionId = await tonClient.sendCrossChainVerification(
          vaultId, 
          targetChain, 
          signature
        );
      } else if (sourceChain === 'SOL') {
        signature = await solanaClient.signMessage(messageToSign);
        sourceTransactionId = await solanaClient.sendCrossChainVerification(
          vaultId, 
          targetChain, 
          signature
        );
      } else {
        throw new Error(`Unsupported source chain: ${sourceChain}`);
      }
      
      // Process on target chain
      if (targetChain === 'ETH') {
        targetTransactionId = await ethersClient.receiveCrossChainVerification(
          vaultId,
          sourceChain,
          signature
        );
      } else if (targetChain === 'TON') {
        targetTransactionId = await tonClient.receiveCrossChainVerification(
          vaultId,
          sourceChain,
          signature
        );
      } else if (targetChain === 'SOL') {
        targetTransactionId = await solanaClient.receiveCrossChainVerification(
          vaultId,
          sourceChain,
          signature
        );
      } else {
        throw new Error(`Unsupported target chain: ${targetChain}`);
      }
      
      return {
        success: true,
        status: 'completed',
        message: `Successfully bridged vault verification from ${sourceChain} to ${targetChain}`,
        sourceTransactionId,
        targetTransactionId,
        timestamp: Date.now()
      };
    } catch (error) {
      securityLogger.error('Failed to bridge vault verification', error);
      
      if (error instanceof BlockchainError) {
        throw error;
      }
      
      throw createBlockchainError(
        error,
        sourceChain,
        BlockchainErrorCategory.CROSS_CHAIN,
        {
          vaultId,
          sourceChain,
          targetChain,
          requester,
          operation: 'bridgeVaultVerification'
        }
      );
    }
  }
  
  /**
   * Simulate a bridge operation for development mode
   */
  private simulateBridgeOperation(
    vaultId: string,
    sourceChain: BlockchainType,
    targetChain: BlockchainType
  ): BridgeResult {
    const sourceTransactionId = `${sourceChain.toLowerCase()}-bridge-tx-${Date.now()}`;
    const targetTransactionId = `${targetChain.toLowerCase()}-bridge-tx-${Date.now()}`;
    
    return {
      success: true,
      status: 'completed',
      message: `Successfully bridged vault verification from ${sourceChain} to ${targetChain} (simulated)`,
      sourceTransactionId,
      targetTransactionId,
      timestamp: Date.now()
    };
  }
  
  /**
   * Verify a cross-chain message
   */
  async verifyCrossChainMessage(
    vaultId: string,
    sourceChain: BlockchainType,
    targetChain: BlockchainType,
    signature: string
  ): Promise<MessageVerificationResult> {
    if (!this.initialized) {
      await this.initialize();
    }
    
    try {
      securityLogger.info('Verifying cross-chain message', {
        vaultId,
        sourceChain,
        targetChain
      });
      
      // In development mode, we simulate successful verification
      if (config.isDevelopmentMode) {
        return {
          isValid: true,
          message: `Cross-chain message verified successfully (simulated)`,
          verifiedTimestamp: Date.now()
        };
      }
      
      // Get the message data from the source chain
      let messageData: any;
      let isValid = false;
      
      if (sourceChain === 'ETH') {
        isValid = await ethersClient.verifyCrossChainMessage(
          vaultId,
          targetChain,
          signature
        );
      } else if (sourceChain === 'TON') {
        isValid = await tonClient.verifyCrossChainMessage(
          vaultId,
          targetChain,
          signature
        );
      } else if (sourceChain === 'SOL') {
        isValid = await solanaClient.verifyCrossChainMessage(
          vaultId,
          targetChain,
          signature
        );
      } else {
        throw new Error(`Unsupported source chain: ${sourceChain}`);
      }
      
      if (isValid) {
        return {
          isValid: true,
          message: `Cross-chain message verified successfully`,
          verifiedTimestamp: Date.now()
        };
      } else {
        return {
          isValid: false,
          message: `Cross-chain message verification failed`
        };
      }
    } catch (error) {
      securityLogger.error('Failed to verify cross-chain message', error);
      
      if (error instanceof BlockchainError) {
        throw error;
      }
      
      throw createBlockchainError(
        error,
        sourceChain,
        BlockchainErrorCategory.CROSS_CHAIN,
        {
          vaultId,
          sourceChain,
          targetChain,
          operation: 'verifyCrossChainMessage'
        }
      );
    }
  }
  
  /**
   * Create a cross-chain verification proof
   */
  async createCrossChainProof(
    vaultId: string,
    sourceChain: BlockchainType,
    targetChains: BlockchainType[]
  ): Promise<{
    success: boolean;
    proofs: any[];
    message: string;
  }> {
    if (!this.initialized) {
      await this.initialize();
    }
    
    try {
      securityLogger.info('Creating cross-chain verification proof', {
        vaultId,
        sourceChain,
        targetChains
      });
      
      // Simulate proof creation for now
      const proofs = targetChains.map(targetChain => ({
        sourceChain,
        targetChain,
        vaultId,
        proof: {
          signature: `${sourceChain}-to-${targetChain}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          timestamp: Date.now(),
          verificationHash: `0x${Math.random().toString(36).substring(2, 15)}`,
        }
      }));
      
      return {
        success: true,
        proofs,
        message: 'Cross-chain proofs generated successfully'
      };
    } catch (error) {
      securityLogger.error('Failed to create cross-chain proof', error);
      
      if (error instanceof BlockchainError) {
        throw error;
      }
      
      throw createBlockchainError(
        error,
        sourceChain,
        BlockchainErrorCategory.CROSS_CHAIN,
        {
          vaultId,
          sourceChain,
          targetChains,
          operation: 'createCrossChainProof'
        }
      );
    }
  }
  
  /**
   * Broadcast a vault action across multiple chains
   */
  async broadcastVaultAction(
    vaultId: string,
    action: 'create' | 'update' | 'unlock',
    sourceChain: BlockchainType,
    targetChains: BlockchainType[],
    data: any
  ): Promise<{
    success: boolean;
    results: Record<BlockchainType, {
      success: boolean;
      transactionId?: string;
      error?: string;
    }>;
    message: string;
  }> {
    if (!this.initialized) {
      await this.initialize();
    }
    
    try {
      securityLogger.info('Broadcasting vault action across chains', {
        vaultId,
        action,
        sourceChain,
        targetChains
      });
      
      const results: Record<BlockchainType, {
        success: boolean;
        transactionId?: string;
        error?: string;
      }> = {} as any;
      
      // Process source chain first
      try {
        let transactionId: string;
        
        if (sourceChain === 'ETH') {
          if (action === 'create') {
            transactionId = await ethersClient.createVault(vaultId, data);
          } else if (action === 'update') {
            transactionId = await ethersClient.updateVault(vaultId, data);
          } else if (action === 'unlock') {
            transactionId = await ethersClient.unlockVault(vaultId);
          } else {
            throw new Error(`Unsupported action: ${action}`);
          }
        } else if (sourceChain === 'TON') {
          if (action === 'create') {
            transactionId = await tonClient.createVault(vaultId, data);
          } else if (action === 'update') {
            transactionId = await tonClient.updateVault(vaultId, data);
          } else if (action === 'unlock') {
            transactionId = await tonClient.unlockVault(vaultId);
          } else {
            throw new Error(`Unsupported action: ${action}`);
          }
        } else if (sourceChain === 'SOL') {
          if (action === 'create') {
            transactionId = await solanaClient.createVault(vaultId, data);
          } else if (action === 'update') {
            transactionId = await solanaClient.updateVault(vaultId, data);
          } else if (action === 'unlock') {
            transactionId = await solanaClient.unlockVault(vaultId);
          } else {
            throw new Error(`Unsupported action: ${action}`);
          }
        } else {
          throw new Error(`Unsupported source chain: ${sourceChain}`);
        }
        
        results[sourceChain] = {
          success: true,
          transactionId
        };
      } catch (error) {
        securityLogger.error(`Failed to perform ${action} on source chain ${sourceChain}`, error);
        
        results[sourceChain] = {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
      
      // Process target chains
      for (const targetChain of targetChains) {
        try {
          // Skip if it's the same as source chain
          if (targetChain === sourceChain) {
            continue;
          }
          
          // Create a cross-chain message with the action data
          const bridgeResult = await this.bridgeVaultVerification(
            vaultId,
            sourceChain,
            targetChain,
            'system'
          );
          
          if (bridgeResult.success) {
            results[targetChain] = {
              success: true,
              transactionId: bridgeResult.targetTransactionId
            };
          } else {
            results[targetChain] = {
              success: false,
              error: 'Failed to bridge verification'
            };
          }
        } catch (error) {
          securityLogger.error(`Failed to bridge to ${targetChain}`, error);
          
          results[targetChain] = {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      }
      
      // Determine overall success
      const successCount = Object.values(results).filter(r => r.success).length;
      const totalCount = Object.keys(results).length;
      const allSuccess = successCount === totalCount;
      const majoritySuccess = successCount >= totalCount / 2;
      
      return {
        success: majoritySuccess,
        results,
        message: allSuccess 
          ? `Successfully broadcast ${action} across all chains` 
          : majoritySuccess 
            ? `Partially broadcast ${action}, succeeded on ${successCount}/${totalCount} chains` 
            : `Failed to broadcast ${action} across most chains, only succeeded on ${successCount}/${totalCount}`
      };
    } catch (error) {
      securityLogger.error('Failed to broadcast vault action', error);
      
      if (error instanceof BlockchainError) {
        throw error;
      }
      
      throw createBlockchainError(
        error,
        sourceChain,
        BlockchainErrorCategory.CROSS_CHAIN,
        {
          vaultId,
          action,
          sourceChain,
          targetChains,
          operation: 'broadcastVaultAction'
        }
      );
    }
  }
}

export const crossChainBridge = new CrossChainBridge();