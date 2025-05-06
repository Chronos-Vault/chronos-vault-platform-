/**
 * Zero-Knowledge API Routes
 * 
 * Provides endpoints for zero-knowledge proof generation and verification
 * for the Chronos Vault platform.
 */

import { Router, Request, Response } from 'express';
import { zeroKnowledgeShield, ZkProofType } from '../security/zero-knowledge-shield';
import { enhancedZeroKnowledgeService } from '../security/enhanced-zero-knowledge-service';
import { validateSession } from '../middleware/auth-middleware';
import { BlockchainType } from '../../shared/types';

export const zkRouter = Router();

// Add authentication middleware
zkRouter.use(validateSession);

/**
 * Generate a vault ownership proof
 * POST /api/zk/prove/ownership
 */
zkRouter.post('/prove/ownership', async (req: Request, res: Response) => {
  try {
    const { vaultId, ownerAddress, privateKey, blockchainType } = req.body;
    
    // Validate required fields
    if (!vaultId || !ownerAddress || !privateKey || !blockchainType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Only allow specific blockchain types
    if (!['ETH', 'SOL', 'TON'].includes(blockchainType)) {
      return res.status(400).json({ error: 'Invalid blockchain type' });
    }
    
    // Generate the proof
    const proof = await enhancedZeroKnowledgeService.generateVaultOwnershipProof(
      vaultId,
      ownerAddress,
      privateKey,
      blockchainType as BlockchainType
    );
    
    // Don't include the rawProof in the response for security
    const { rawProof, ...safeProof } = proof;
    
    res.status(200).json({
      success: true,
      proof: safeProof,
      message: 'Vault ownership proof generated successfully'
    });
  } catch (error) {
    console.error('Error generating vault ownership proof:', error);
    res.status(500).json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error generating proof'
    });
  }
});

/**
 * Generate a multi-signature proof
 * POST /api/zk/prove/multisig
 */
zkRouter.post('/prove/multisig', async (req: Request, res: Response) => {
  try {
    const { vaultId, threshold, signatures, blockchainType } = req.body;
    
    // Validate required fields
    if (!vaultId || !threshold || !signatures || !blockchainType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Validate threshold and signatures
    if (threshold <= 0) {
      return res.status(400).json({ error: 'Threshold must be a positive number' });
    }
    
    if (!Array.isArray(signatures) || signatures.length < threshold) {
      return res.status(400).json({ 
        error: `Insufficient signatures: required ${threshold}, got ${signatures?.length || 0}`
      });
    }
    
    // Only allow specific blockchain types
    if (!['ETH', 'SOL', 'TON'].includes(blockchainType)) {
      return res.status(400).json({ error: 'Invalid blockchain type' });
    }
    
    // Generate the proof
    const proof = await enhancedZeroKnowledgeService.generateMultiSigProof(
      vaultId,
      threshold,
      signatures,
      blockchainType as BlockchainType
    );
    
    // Don't include the rawProof in the response for security
    const { rawProof, ...safeProof } = proof;
    
    res.status(200).json({
      success: true,
      proof: safeProof,
      message: 'Multi-signature proof generated successfully'
    });
  } catch (error) {
    console.error('Error generating multi-signature proof:', error);
    res.status(500).json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error generating proof'
    });
  }
});

/**
 * Verify a zero-knowledge proof
 * POST /api/zk/verify
 */
zkRouter.post('/verify', async (req: Request, res: Response) => {
  try {
    const { proof, proofType, blockchainType } = req.body;
    
    // Validate required fields
    if (!proof || !proofType || !blockchainType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Validate proof type
    if (!Object.values(ZkProofType).includes(proofType)) {
      return res.status(400).json({ error: 'Invalid proof type' });
    }
    
    // Only allow specific blockchain types
    if (!['ETH', 'SOL', 'TON'].includes(blockchainType)) {
      return res.status(400).json({ error: 'Invalid blockchain type' });
    }
    
    // Verify the proof
    const verificationResult = await enhancedZeroKnowledgeService.verifyEnhancedProof(
      proof,
      proofType as ZkProofType,
      blockchainType as BlockchainType
    );
    
    res.status(200).json({
      success: verificationResult.success,
      verification: verificationResult,
      message: verificationResult.success 
        ? 'Proof verified successfully' 
        : 'Proof verification failed'
    });
  } catch (error) {
    console.error('Error verifying proof:', error);
    res.status(500).json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error verifying proof'
    });
  }
});

/**
 * Generate a cross-chain proof
 * POST /api/zk/prove/cross-chain
 */
zkRouter.post('/prove/cross-chain', async (req: Request, res: Response) => {
  try {
    const { vaultId, data, sourceChain, targetChains } = req.body;
    
    // Validate required fields
    if (!vaultId || !data || !sourceChain || !targetChains || !Array.isArray(targetChains)) {
      return res.status(400).json({ error: 'Missing or invalid required fields' });
    }
    
    // Validate chains
    const validChains = ['ETH', 'SOL', 'TON'];
    if (!validChains.includes(sourceChain)) {
      return res.status(400).json({ error: 'Invalid source chain' });
    }
    
    for (const chain of targetChains) {
      if (!validChains.includes(chain)) {
        return res.status(400).json({ error: `Invalid target chain: ${chain}` });
      }
    }
    
    // Generate the cross-chain proofs
    const proofs = await enhancedZeroKnowledgeService.generateCrossChainProof(
      vaultId,
      data,
      sourceChain as BlockchainType,
      targetChains as BlockchainType[]
    );
    
    // Create a safe version without raw proofs
    const safeProofs: Record<string, any> = {};
    for (const [chain, proof] of Object.entries(proofs)) {
      const { rawProof, ...safeProof } = proof;
      safeProofs[chain] = safeProof;
    }
    
    res.status(200).json({
      success: true,
      proofs: safeProofs,
      message: 'Cross-chain proofs generated successfully'
    });
  } catch (error) {
    console.error('Error generating cross-chain proofs:', error);
    res.status(500).json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error generating cross-chain proofs'
    });
  }
});

/**
 * Get ZK proof status
 * GET /api/zk/status
 */
zkRouter.get('/status', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    status: 'operational',
    features: {
      vaultOwnershipProofs: true,
      multiSignatureProofs: true,
      crossChainProofs: true,
      verificationAPI: true
    },
    supportedBlockchains: ['ETH', 'SOL', 'TON'],
    implementationDetails: {
      library: 'SnarkJS',
      protocol: 'Groth16',
      circuitVersion: '2.0'
    }
  });
});