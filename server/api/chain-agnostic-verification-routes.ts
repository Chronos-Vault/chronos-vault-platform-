/**
 * Chain-Agnostic Verification API Routes
 * 
 * These routes expose the chain-agnostic verification protocol and
 * zero-knowledge proof aggregation functionality to clients.
 */

import { Router, Request, Response } from 'express';
import { BlockchainType } from '../../shared/types';
import { ConnectorFactory } from '../blockchain/connector-factory';
import { createChainAgnosticVerification, VerificationRequest } from '../security/chain-agnostic-verification';
import { zkProofAggregation } from '../security/zk-proof-aggregation';
import { enhancedZeroKnowledgeService } from '../security/enhanced-zero-knowledge-service';
import { ZkProofType } from '../security/zero-knowledge-shield';
import { securityLogger } from '../monitoring/security-logger';

// Create router
const router = Router();

// Initialize the verification service
let chainAgnosticVerification: ReturnType<typeof createChainAgnosticVerification>;

// Initialize the verification service with the connector factory
export function initializeChainAgnosticVerification(connectorFactory: ConnectorFactory) {
  chainAgnosticVerification = createChainAgnosticVerification(connectorFactory);
  return chainAgnosticVerification;
}

// Verify a vault using the chain-agnostic protocol
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const { vaultId, ownerAddress, blockchainType, verificationLevel = 'standard', metadata } = req.body;
    
    // Validate required parameters
    if (!vaultId || !ownerAddress || !blockchainType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters'
      });
    }
    
    // Create a verification request
    const request: VerificationRequest = {
      vaultId,
      ownerAddress,
      nonce: Date.now().toString(),
      timestamp: Date.now(),
      blockchainType: blockchainType as BlockchainType,
      verificationLevel: verificationLevel as 'basic' | 'standard' | 'advanced',
      metadata
    };
    
    // Perform the verification
    const verificationResponse = await chainAgnosticVerification.verifyVault(request);
    
    // Return the result
    res.json({
      success: verificationResponse.success,
      verification: verificationResponse
    });
  } catch (error) {
    securityLogger.error('Error in chain-agnostic verification:', error);
    
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred during verification'
    });
  }
});

// Get the status of a verification
router.get('/verification/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Get the verification from the cache
    const verification = chainAgnosticVerification.getVerification(id);
    
    if (!verification) {
      return res.status(404).json({
        success: false,
        error: 'Verification not found'
      });
    }
    
    res.json({
      success: true,
      verification
    });
  } catch (error) {
    securityLogger.error('Error getting verification:', error);
    
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

// Get information about an aggregated proof
router.get('/aggregated-proof/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Get the aggregated proof
    const proof = zkProofAggregation.getAggregatedProof(id);
    
    if (!proof) {
      return res.status(404).json({
        success: false,
        error: 'Aggregated proof not found'
      });
    }
    
    res.json({
      success: true,
      proof: {
        id: proof.id,
        vaultId: proof.vaultId,
        timestamp: proof.timestamp,
        chains: proof.chains,
        primaryChain: proof.primaryChain,
        aggregationHash: proof.aggregationHash,
        validationThreshold: proof.validationThreshold,
        status: proof.status,
        validatedBy: proof.validatedBy
      }
    });
  } catch (error) {
    securityLogger.error('Error getting aggregated proof:', error);
    
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

// Generate a cross-chain proof for a specific chain
router.post('/generate-proof/:chain', async (req: Request, res: Response) => {
  try {
    const { chain } = req.params;
    const { vaultId, ownerAddress, privateKey } = req.body;
    
    // Validate required parameters
    if (!vaultId || !ownerAddress || !privateKey) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters'
      });
    }
    
    // Validate the chain
    const validChains: BlockchainType[] = ['ethereum', 'solana', 'ton', 'bitcoin'];
    if (!validChains.includes(chain as BlockchainType)) {
      return res.status(400).json({
        success: false,
        error: `Invalid chain: ${chain}. Valid options are: ${validChains.join(', ')}`
      });
    }
    
    // Generate the proof
    const proof = await enhancedZeroKnowledgeService.generateVaultOwnershipProof(
      vaultId,
      ownerAddress,
      privateKey,
      chain as BlockchainType
    );
    
    res.json({
      success: true,
      proof,
      message: `Successfully generated proof for ${chain}`
    });
  } catch (error) {
    securityLogger.error('Error generating cross-chain proof:', error);
    
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred during proof generation'
    });
  }
});

// Verify a proof for a specific chain
router.post('/verify-proof/:chain', async (req: Request, res: Response) => {
  try {
    const { chain } = req.params;
    const { proof, proofType = 'VAULT_OWNERSHIP' } = req.body;
    
    // Validate required parameters
    if (!proof) {
      return res.status(400).json({
        success: false,
        error: 'Missing proof parameter'
      });
    }
    
    // Validate the chain
    const validChains: BlockchainType[] = ['ethereum', 'solana', 'ton', 'bitcoin'];
    if (!validChains.includes(chain as BlockchainType)) {
      return res.status(400).json({
        success: false,
        error: `Invalid chain: ${chain}. Valid options are: ${validChains.join(', ')}`
      });
    }
    
    // Verify the proof
    const verificationResult = await enhancedZeroKnowledgeService.verifyEnhancedProof(
      proof,
      proofType as ZkProofType,
      chain as BlockchainType
    );
    
    res.json({
      success: verificationResult.success,
      verification: verificationResult,
      message: verificationResult.success ? 
        `Proof verified successfully on ${chain}` : 
        `Proof verification failed on ${chain}`
    });
  } catch (error) {
    securityLogger.error('Error verifying proof:', error);
    
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred during proof verification'
    });
  }
});

export default router;