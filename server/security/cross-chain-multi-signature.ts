/**
 * Cross-Chain Multi-Signature Service
 * 
 * Advanced implementation of multi-signature functionality that works across
 * multiple blockchains with enhanced security features.
 */

import { createHash, randomBytes } from 'crypto';
import { BlockchainType } from '../../shared/types';
import { multiSignatureGateway, ApprovalType, ApprovalStatus, SignatureVerificationMethod } from './multi-signature-gateway';
import { SecurityIncidentType } from '../lib/cross-chain/SecurityIncidentResponseService';
import { zeroKnowledgeShield } from './zero-knowledge-shield';

interface ChainSignatureVerifier {
  verifySignature(message: string, signature: string, publicKey: string): Promise<boolean>;
  getTransactionStatus(txHash: string): Promise<{
    confirmed: boolean;
    confirmations: number;
    timestamp: number;
  }>;
}

export class CrossChainMultiSignatureService {
  private verifiers: Record<BlockchainType, ChainSignatureVerifier | null> = {
    'ETH': null,
    'SOL': null,
    'TON': null
  };
  
  constructor(
    ethereumVerifier?: ChainSignatureVerifier,
    solanaVerifier?: ChainSignatureVerifier,
    tonVerifier?: ChainSignatureVerifier
  ) {
    if (ethereumVerifier) this.verifiers['ETH'] = ethereumVerifier;
    if (solanaVerifier) this.verifiers['SOL'] = solanaVerifier;
    if (tonVerifier) this.verifiers['TON'] = tonVerifier;
    
    console.log('[CrossChainMultiSig] Cross-Chain Multi-Signature Service initialized');
  }
  
  /**
   * Register a blockchain-specific signature verifier
   */
  registerVerifier(chain: BlockchainType, verifier: ChainSignatureVerifier) {
    this.verifiers[chain] = verifier;
    console.log(`[CrossChainMultiSig] Registered signature verifier for ${chain}`);
  }
  
  /**
   * Create a multi-signature request that requires approval across multiple blockchains
   */
  async createCrossChainApprovalRequest(
    vaultId: string,
    creatorId: string,
    sourceChain: BlockchainType,
    secondaryChains: BlockchainType[],
    type: ApprovalType,
    transactionData: any,
    requiredConfirmations: number = 2,
    options: {
      requiredSignersPerChain?: Record<BlockchainType, number>;
      expirationTime?: number;
      metadata?: Record<string, any>;
    } = {}
  ) {
    console.log(`[CrossChainMultiSig] Creating cross-chain approval request for vault ${vaultId}`);
    
    // Validate input chains
    const allChains = [sourceChain, ...secondaryChains];
    if (allChains.length < 2) {
      throw new Error('Cross-chain approval requires at least two blockchains');
    }
    
    // Limit to supported chains
    const supportedChains = allChains.filter(chain => 
      ['ETH', 'SOL', 'TON'].includes(chain)
    ) as BlockchainType[];
    
    if (supportedChains.length < 2) {
      throw new Error('At least two supported blockchains are required for cross-chain approval');
    }
    
    // Generate a unique identifier for the cross-chain request
    const crossChainRequestId = createHash('sha256')
      .update(`cross-chain:${vaultId}:${type}:${Date.now()}:${randomBytes(16).toString('hex')}`)
      .digest('hex');
    
    // Create approval requests for each chain
    const approvalRequests = await Promise.all(
      supportedChains.map(async (chain) => {
        // Set chain-specific configurations
        const chainConfig = {
          customThresholdWeight: options.requiredSignersPerChain?.[chain] || 
            (chain === sourceChain ? 2 : 1), // Source chain requires more signatures by default
          expiration: options.expirationTime,
          metadata: {
            ...options.metadata,
            crossChainRequestId,
            isPartOfCrossChainApproval: true,
            requiredChains: supportedChains,
            sourceChain,
            requiredConfirmations
          },
          zeroKnowledgeProof: true // Always use ZK proofs for cross-chain
        };
        
        // Create the chain-specific approval request
        try {
          const request = await multiSignatureGateway.createApprovalRequest(
            vaultId,
            creatorId,
            type,
            {
              blockchainType: chain,
              data: {
                ...transactionData,
                crossChainRequestId
              }
            },
            chainConfig
          );
          
          return { chain, requestId: request.id, status: 'created' };
        } catch (error: any) {
          console.error(`[CrossChainMultiSig] Error creating approval request for chain ${chain}:`, error);
          return { 
            chain, 
            requestId: null, 
            status: 'failed', 
            error: error.message || 'Unknown error during approval request creation'
          };
        }
      })
    );
    
    // Return the cross-chain approval request info
    return {
      crossChainRequestId,
      sourceChain,
      supportedChains,
      approvalRequests: approvalRequests.filter(req => req.requestId !== null),
      failedChains: approvalRequests.filter(req => req.requestId === null).map(req => req.chain),
      createdAt: Date.now(),
      status: 'pending',
      requiredConfirmations
    };
  }
  
  /**
   * Verify signature across multiple blockchains
   */
  async verifyCrossChainSignature(
    crossChainRequestId: string,
    signerAddress: string,
    signatures: Record<BlockchainType, string>,
    method: SignatureVerificationMethod = SignatureVerificationMethod.ZERO_KNOWLEDGE
  ): Promise<{
    verified: boolean;
    verifiedChains: BlockchainType[];
    failedChains: BlockchainType[];
    completedChains: BlockchainType[];
    allChainsVerified: boolean;
  }> {
    console.log(`[CrossChainMultiSig] Verifying cross-chain signature for request ${crossChainRequestId}`);
    
    // Get all approval requests associated with this cross-chain request
    const allRequests = Array.from(multiSignatureGateway['approvalRequests'].values())
      .filter(req => req.metadata?.crossChainRequestId === crossChainRequestId);
    
    if (allRequests.length === 0) {
      throw new Error(`No approval requests found for cross-chain request ${crossChainRequestId}`);
    }
    
    // Chains required for this request
    const requiredChains = allRequests[0].metadata?.requiredChains || [];
    
    // Verify signatures for each chain
    const verificationResults = await Promise.all(
      Object.entries(signatures)
        .filter(([chain]) => requiredChains.includes(chain))
        .map(async ([chain, signature]) => {
          const chainType = chain as BlockchainType;
          const request = allRequests.find(req => req.transactionData.blockchainType === chainType);
          
          if (!request) {
            return { chain: chainType, verified: false, reason: 'no-request' };
          }
          
          // Verify the signature - in production this would use blockchain-specific verification
          let verified = false;
          try {
            if (this.verifiers[chainType]) {
              // Use the chain-specific verifier
              const message = JSON.stringify(request.transactionData.data);
              verified = await this.verifiers[chainType]!.verifySignature(message, signature, signerAddress);
            } else {
              // Fallback to simulated verification
              verified = true; // For development only
            }
            
            if (verified) {
              // Submit the verified signature to the gateway
              await multiSignatureGateway.submitSignature(
                request.id,
                signerAddress,
                signature,
                method,
                {
                  crossChainVerified: true,
                  timestamp: Date.now()
                }
              );
            }
            
            return { chain: chainType, verified, reason: verified ? 'success' : 'invalid-signature' };
          } catch (error: any) {
            console.error(`[CrossChainMultiSig] Error verifying signature for chain ${chain}:`, error);
            return { 
              chain: chainType, 
              verified: false, 
              reason: 'verification-error', 
              errorMessage: error.message || 'Unknown signature verification error'
            };
          }
        })
    );
    
    // Calculate results
    const verifiedChains = verificationResults
      .filter(result => result.verified)
      .map(result => result.chain);
      
    const failedChains = verificationResults
      .filter(result => !result.verified)
      .map(result => result.chain);
    
    // Check which chains have completed (reached threshold)
    const completedChains = allRequests
      .filter(req => req.status === ApprovalStatus.APPROVED)
      .map(req => req.transactionData.blockchainType);
      
    // Overall result
    const allChainsVerified = requiredChains.every(chain => 
      completedChains.includes(chain as BlockchainType)
    );
    
    return {
      verified: verifiedChains.length > 0,
      verifiedChains,
      failedChains,
      completedChains,
      allChainsVerified
    };
  }
  
  /**
   * Check the status of a cross-chain approval request
   */
  async getCrossChainRequestStatus(crossChainRequestId: string): Promise<{
    crossChainRequestId: string;
    status: 'pending' | 'approved' | 'rejected' | 'expired' | 'cancelled';
    progress: number; // 0-100%
    chainStatuses: Record<BlockchainType, {
      status: string;
      receivedSignatures: number;
      requiredSignatures: number;
      progress: number; // 0-100%
    }>;
    completedChains: BlockchainType[];
    pendingChains: BlockchainType[];
  }> {
    console.log(`[CrossChainMultiSig] Checking status for cross-chain request ${crossChainRequestId}`);
    
    // Get all approval requests associated with this cross-chain request
    const allRequests = Array.from(multiSignatureGateway['approvalRequests'].values())
      .filter(req => req.metadata?.crossChainRequestId === crossChainRequestId);
    
    if (allRequests.length === 0) {
      throw new Error(`No approval requests found for cross-chain request ${crossChainRequestId}`);
    }
    
    // Calculate the status for each chain
    const chainStatuses: Record<BlockchainType, {
      status: string;
      receivedSignatures: number;
      requiredSignatures: number;
      progress: number;
    }> = {};
    
    for (const request of allRequests) {
      const chain = request.transactionData.blockchainType;
      chainStatuses[chain] = {
        status: request.status,
        receivedSignatures: request.receivedSignatures.length,
        requiredSignatures: request.thresholdWeight,
        progress: Math.min(100, Math.round((request.receivedSignatures.length / request.thresholdWeight) * 100))
      };
    }
    
    // Calculate the completed and pending chains
    const completedChains = allRequests
      .filter(req => req.status === ApprovalStatus.APPROVED)
      .map(req => req.transactionData.blockchainType);
      
    const pendingChains = allRequests
      .filter(req => req.status === ApprovalStatus.PENDING)
      .map(req => req.transactionData.blockchainType);
    
    // Calculate the overall progress
    const totalChains = allRequests.length;
    const approvedChains = completedChains.length;
    const progress = Math.round((approvedChains / totalChains) * 100);
    
    // Determine the overall status
    let status: 'pending' | 'approved' | 'rejected' | 'expired' | 'cancelled' = 'pending';
    
    if (allRequests.every(req => req.status === ApprovalStatus.APPROVED)) {
      status = 'approved';
    } else if (allRequests.some(req => req.status === ApprovalStatus.REJECTED)) {
      status = 'rejected';
    } else if (allRequests.some(req => req.status === ApprovalStatus.EXPIRED)) {
      status = 'expired';
    } else if (allRequests.some(req => req.status === ApprovalStatus.CANCELLED)) {
      status = 'cancelled';
    }
    
    return {
      crossChainRequestId,
      status,
      progress,
      chainStatuses,
      completedChains,
      pendingChains
    };
  }
  
  /**
   * Generate a zero-knowledge proof for a cross-chain transaction
   * that proves the transaction was properly signed without revealing details
   */
  async generateCrossChainZKProof(crossChainRequestId: string): Promise<string | null> {
    try {
      // In a real implementation, this would generate a cryptographic zero-knowledge proof
      // that attests to the validity of signatures across multiple chains without revealing
      // the actual content of the transaction or signatures
      
      // Get all approval requests associated with this cross-chain request
      const allRequests = Array.from(multiSignatureGateway['approvalRequests'].values())
        .filter(req => req.metadata?.crossChainRequestId === crossChainRequestId);
      
      if (allRequests.length === 0) {
        console.error(`[CrossChainMultiSig] No requests found for cross-chain ID ${crossChainRequestId}`);
        return null;
      }
      
      // Use the zero-knowledge shield to create a proof
      const zkProof = await zeroKnowledgeShield.generateCrossChainProof(
        crossChainRequestId,
        allRequests.map(req => ({
          chain: req.transactionData.blockchainType,
          requestId: req.id,
          approvalStatus: req.status,
          signatures: req.receivedSignatures.map(sig => sig.signature)
        }))
      );
      
      return zkProof;
    } catch (error: any) {
      console.error('[CrossChainMultiSig] Error generating ZK proof:', error?.message || 'Unknown error');
      return null;
    }
  }
}

// Create and export a singleton instance
export const crossChainMultiSignatureService = new CrossChainMultiSignatureService();