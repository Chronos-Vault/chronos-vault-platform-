/**
 * Security Verification API Routes
 * 
 * Implements API endpoints for transaction verification, cross-chain security,
 * and multi-signature operations.
 */

import { Router, Request, Response } from 'express';
import { crossChainVerification } from '../security/cross-chain-verification-protocol';
import { VerificationMethod } from '../../shared/types';
import { crossChainMultiSignature } from '../security/cross-chain-multi-signature';
import { initializeBlockchainValidators } from '../security/blockchain-validators';
import { ApprovalType } from '../security/multi-signature-gateway';
import { BlockchainType } from '../../shared/types';

// Initialize blockchain validators
initializeBlockchainValidators();

const securityRouter = Router();

/**
 * Verify a transaction across multiple blockchains
 * POST /api/security/verify-transaction
 */
securityRouter.post('/verify-transaction', async (req: Request, res: Response) => {
  try {
    const { 
      txHash, 
      vaultId, 
      sourceChain,
      targetChains,
      method = 'standard' 
    } = req.body;
    
    if (!txHash || !sourceChain) {
      return res.status(400).json({ 
        error: 'Missing required parameters', 
        message: 'Transaction hash and source chain are required' 
      });
    }
    
    // Map the method string to the enum
    const verificationMethod = method === 'deep' ? VerificationMethod.DEEP :
                              method === 'zero-knowledge' ? VerificationMethod.ZERO_KNOWLEDGE :
                              method === 'quantum-resistant' ? VerificationMethod.QUANTUM_RESISTANT :
                              VerificationMethod.STANDARD;
                              
    // Set default target chains if not provided
    const finalTargetChains = targetChains || ['ETH', 'SOL', 'TON'].filter(
      chain => chain !== sourceChain
    ) as BlockchainType[];
    
    console.log(`Starting verification for tx ${txHash} from ${sourceChain} across chains:`, finalTargetChains);
    
    const verificationResult = await crossChainVerification.verifyTransactionAcrossChains(
      txHash,
      sourceChain as BlockchainType,
      finalTargetChains,
      {
        timeoutMs: 20000, // 20 seconds timeout
        requiredConfirmations: 12, // Default confirmations
        includeProofs: false
      }
    );
    
    // Transform the result for the API response
    const response = {
      success: verificationResult.success,
      method: verificationResult.method,
      sourceChain: verificationResult.sourceChain,
      targetChains: verificationResult.targetChains,
      verifiedOn: verificationResult.verifiedOn,
      pendingOn: verificationResult.pendingOn,
      failedOn: verificationResult.failedOn,
      timestamp: verificationResult.timestamp,
      message: verificationResult.message,
      progress: calculateProgress({
        verified: verificationResult.verifiedOn.length,
        total: verificationResult.targetChains.length
      })
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error verifying transaction:', error);
    res.status(500).json({ 
      error: 'Verification failed', 
      message: error.message 
    });
  }
});

/**
 * Create a multi-signature request across chains
 * POST /api/security/create-multisig-request
 */
securityRouter.post('/create-multisig-request', async (req: Request, res: Response) => {
  try {
    const { 
      vaultId, 
      creatorId, 
      sourceChain,
      secondaryChains,
      approvalType,
      transactionData,
      requiredConfirmations,
      options 
    } = req.body;
    
    if (!vaultId || !creatorId || !sourceChain || !approvalType || !transactionData) {
      return res.status(400).json({ 
        error: 'Missing required parameters',
        message: 'Vault ID, creator ID, source chain, approval type, and transaction data are required'
      });
    }
    
    // Map the approval type string to the enum
    const mappedApprovalType = mapApprovalType(approvalType);
    
    if (!mappedApprovalType) {
      return res.status(400).json({
        error: 'Invalid approval type',
        message: `Approval type '${approvalType}' is not recognized`
      });
    }
    
    // Prepare transaction data with all necessary context
    const approvalData = {
      vaultId, 
      creatorId, 
      sourceChain: sourceChain as BlockchainType,
      secondaryChains: secondaryChains || [],
      approvalType: mappedApprovalType,
      transactionData: transactionData
    };
    
    // Create signers array from source chain and secondary chains
    const signers = [
      { 
        id: creatorId, 
        blockchain: sourceChain as BlockchainType, 
        address: creatorId // Using creatorId as address
      },
      ...(secondaryChains || []).map(chain => ({
        id: `${creatorId}-${chain}`,
        blockchain: chain as BlockchainType,
        address: creatorId
      }))
    ];
    
    // Create the cross-chain approval request with updated parameter structure
    const request = await crossChainMultiSignature.createApprovalRequest(
      approvalData,
      signers,
      {
        requiredSignatures: requiredConfirmations || 2,
        ...options
      }
    );
    
    res.json(request);
  } catch (error) {
    console.error('Error creating multi-signature request:', error);
    res.status(500).json({ 
      error: 'Failed to create multi-signature request', 
      message: error.message 
    });
  }
});

/**
 * Check the status of a cross-chain multi-signature request
 * GET /api/security/multisig-status/:requestId
 */
securityRouter.get('/multisig-status/:requestId', async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;
    
    if (!requestId) {
      return res.status(400).json({ 
        error: 'Missing request ID',
        message: 'Request ID is required'
      });
    }
    
    // For the request status, we need to provide the signers
    // Since we don't have them in the params, we'll create a dummy array with a single entry
    // In a real implementation, these would be fetched from the database based on the requestId
    const signers = [
      { id: 'primary-signer', blockchain: 'ETH' as BlockchainType, address: 'primary-address' }
    ];
    
    const status = await crossChainMultiSignature.getRequestStatus(requestId, signers);
    res.json(status);
  } catch (error) {
    console.error('Error getting multi-signature status:', error);
    res.status(500).json({ 
      error: 'Failed to get multi-signature status', 
      message: error.message 
    });
  }
});

/**
 * Submit a signature for a cross-chain multi-signature request
 * POST /api/security/submit-signature
 */
securityRouter.post('/submit-signature', async (req: Request, res: Response) => {
  try {
    const { 
      requestId, 
      signerAddress, 
      signatures, 
      method 
    } = req.body;
    
    if (!requestId || !signerAddress || !signatures) {
      return res.status(400).json({ 
        error: 'Missing required parameters',
        message: 'Request ID, signer address, and signatures are required'
      });
    }
    
    // Extract the chain information from the signer address or determine it based on the provided data
    // In a real implementation, we would look up the blockchain type and signer ID from the database
    const blockchain = 'ETH' as BlockchainType;
    const signerId = signerAddress.split('-')[0] || signerAddress;
    
    // Verify the signatures with the updated parameters
    const result = await crossChainMultiSignature.verifySignature(
      requestId,
      signerId,
      blockchain,
      signerAddress,
      signatures,
      { action: 'verify', timestamp: Date.now() } // Mock transaction data
    );
    
    res.json(result);
  } catch (error) {
    console.error('Error submitting signature:', error);
    res.status(500).json({ 
      error: 'Failed to submit signature', 
      message: error.message 
    });
  }
});

/**
 * Generate a zero-knowledge proof for a cross-chain transaction
 * GET /api/security/generate-zk-proof/:requestId
 */
securityRouter.get('/generate-zk-proof/:requestId', async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;
    
    if (!requestId) {
      return res.status(400).json({ 
        error: 'Missing request ID',
        message: 'Request ID is required'
      });
    }
    
    // For ZK proof generation, need to specify the blockchain
    // In a real implementation, we would determine this based on the requestId
    const blockchain = 'ETH' as BlockchainType;
    const zkProof = await crossChainMultiSignature.generateZKProof(requestId, blockchain);
    
    if (!zkProof) {
      return res.status(404).json({ 
        error: 'Failed to generate ZK proof',
        message: 'Could not generate a zero-knowledge proof for the given request'
      });
    }
    
    res.json({ requestId, zkProof });
  } catch (error) {
    console.error('Error generating ZK proof:', error);
    res.status(500).json({ 
      error: 'Failed to generate ZK proof', 
      message: error.message 
    });
  }
});

// Helper functions

/**
 * Map the approval type string to the enum
 */
function mapApprovalType(type: string): ApprovalType | null {
  const typeMap: Record<string, ApprovalType> = {
    'create-vault': ApprovalType.CREATE_VAULT,
    'unlock-assets': ApprovalType.UNLOCK_ASSETS,
    'modify-vault': ApprovalType.MODIFY_VAULT,
    'add-beneficiary': ApprovalType.ADD_BENEFICIARY,
    'remove-beneficiary': ApprovalType.REMOVE_BENEFICIARY,
    'emergency-recovery': ApprovalType.EMERGENCY_RECOVERY,
    'threshold-change': ApprovalType.THRESHOLD_CHANGE
  };
  
  return typeMap[type.toLowerCase()] || null;
}

/**
 * Calculate the overall progress based on chain results
 */
function calculateProgress(data: { verified: number, total: number }): number {
  if (data.total === 0) {
    return 0;
  }
  
  return Math.round((data.verified / data.total) * 100);
}

/**
 * Get the required confirmations for a blockchain
 */
function getRequiredConfirmations(chain: BlockchainType): number {
  const confirmations: Record<string, number> = {
    'ETH': 12,
    'SOL': 32,
    'TON': 16,
    'POLYGON': 20,
    'BTC': 6
  };
  
  return confirmations[chain] || 12;
}

export default securityRouter;