/**
 * Security Verification API Routes
 * 
 * Implements API endpoints for transaction verification, cross-chain security,
 * and multi-signature operations.
 */

import { Router, Request, Response } from 'express';
import { crossChainVerificationProtocol, VerificationMethod } from '../security/cross-chain-verification-protocol';
import { crossChainMultiSignatureService } from '../security/cross-chain-multi-signature';
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
    
    const verificationResult = await crossChainVerificationProtocol.verifyTransaction(
      txHash,
      sourceChain as BlockchainType,
      finalTargetChains,
      verificationMethod,
      {
        timeout: 20000, // 20 seconds timeout
        requiredConfirmations: {
          'ETH': 12,
          'SOL': 32,
          'TON': 16
        },
        consistencyThreshold: 80, // 80% consistency required
        retryAttempts: 2
      }
    );
    
    // Transform the result for the API response
    const response = {
      requestId: verificationResult.requestId,
      overallStatus: verificationResult.overallStatus.toLowerCase(),
      progress: calculateProgress(verificationResult.chainResults),
      chainStatuses: Object.entries(verificationResult.chainResults).reduce((acc, [chain, result]) => {
        acc[chain] = {
          status: result.status.toLowerCase(),
          confirmations: result.confirmations,
          progress: (result.confirmations / getRequiredConfirmations(chain as BlockchainType)) * 100
        };
        return acc;
      }, {} as Record<string, any>),
      consistencyScore: verificationResult.consistencyScore,
      completedChains: Object.entries(verificationResult.chainResults)
        .filter(([_, result]) => result.status === 'VERIFIED')
        .map(([chain]) => chain),
      pendingChains: Object.entries(verificationResult.chainResults)
        .filter(([_, result]) => result.status === 'PENDING')
        .map(([chain]) => chain),
      errors: verificationResult.inconsistencies?.map(inc => inc.description)
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
    
    // Create the cross-chain approval request
    const request = await crossChainMultiSignatureService.createCrossChainApprovalRequest(
      vaultId,
      creatorId,
      sourceChain as BlockchainType,
      secondaryChains || [],
      mappedApprovalType,
      transactionData,
      requiredConfirmations || 2,
      options || {}
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
    
    const status = await crossChainMultiSignatureService.getCrossChainRequestStatus(requestId);
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
    
    // Verify the signatures
    const result = await crossChainMultiSignatureService.verifyCrossChainSignature(
      requestId,
      signerAddress,
      signatures,
      method
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
    
    const zkProof = await crossChainMultiSignatureService.generateCrossChainZKProof(requestId);
    
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
function calculateProgress(chainResults: Record<string, any>): number {
  const chains = Object.keys(chainResults);
  
  if (chains.length === 0) {
    return 0;
  }
  
  let totalProgress = 0;
  
  for (const chain of chains) {
    const result = chainResults[chain];
    const requiredConfirmations = getRequiredConfirmations(chain as BlockchainType);
    const chainProgress = Math.min(100, (result.confirmations / requiredConfirmations) * 100);
    totalProgress += chainProgress;
  }
  
  return Math.round(totalProgress / chains.length);
}

/**
 * Get the required confirmations for a blockchain
 */
function getRequiredConfirmations(chain: BlockchainType): number {
  const confirmations: Record<BlockchainType, number> = {
    'ETH': 12,
    'SOL': 32,
    'TON': 16
  };
  
  return confirmations[chain] || 12;
}

export default securityRouter;