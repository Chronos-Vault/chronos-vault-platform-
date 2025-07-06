import { Router, Request, Response } from 'express';
import { enhancedZeroKnowledgeService } from '../security/enhanced-zero-knowledge-service';
import { BlockchainType } from '../../shared/types';
import { ZkProofType } from '../security/zero-knowledge-shield';

const router = Router();

// Get Zero-Knowledge service status
router.get('/status', (req: Request, res: Response) => {
  try {
    const status = {
      status: 'operational',
      implementationDetails: {
        library: 'SnarkJS',
        protocol: 'Groth16',
        circuitVersion: '1.0.0',
      },
      supportedBlockchains: ['ETH', 'SOL', 'TON'],
      supportedProofTypes: [
        'VAULT_OWNERSHIP',
        'ASSET_VERIFICATION',
        'ACCESS_AUTHORIZATION',
        'TRANSACTION_VERIFICATION',
        'IDENTITY_VERIFICATION'
      ]
    };
    
    res.json(status);
  } catch (error) {
    console.error('[ZK-Routes] Error getting ZK service status:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get Zero-Knowledge service status' 
    });
  }
});

// Generate a vault ownership proof
router.post('/prove/ownership', async (req: Request, res: Response) => {
  try {
    const { vaultId, ownerAddress, privateKey, blockchainType } = req.body;
    
    if (!vaultId || !ownerAddress || !privateKey || !blockchainType) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required parameters' 
      });
    }
    
    const proof = await enhancedZeroKnowledgeService.generateVaultOwnershipProof(
      vaultId,
      ownerAddress, 
      privateKey,
      blockchainType as BlockchainType
    );
    
    res.json({ 
      success: true, 
      proof,
      message: 'Vault ownership proof generated successfully'
    });
  } catch (error) {
    console.error('[ZK-Routes] Error generating ownership proof:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to generate ownership proof' 
    });
  }
});

// Generate a multi-signature proof
router.post('/prove/multisig', async (req: Request, res: Response) => {
  try {
    const { vaultId, threshold, signatures, blockchainType } = req.body;
    
    if (!vaultId || !threshold || !signatures || !blockchainType) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required parameters' 
      });
    }
    
    if (!Array.isArray(signatures) || signatures.length < threshold) {
      return res.status(400).json({ 
        success: false, 
        error: `Insufficient signatures: required ${threshold}, got ${signatures?.length || 0}` 
      });
    }
    
    const proof = await enhancedZeroKnowledgeService.generateMultiSigProof(
      vaultId,
      threshold,
      signatures,
      blockchainType as BlockchainType
    );
    
    res.json({ 
      success: true, 
      proof,
      message: 'Multi-signature proof generated successfully'
    });
  } catch (error) {
    console.error('[ZK-Routes] Error generating multisig proof:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to generate multi-signature proof' 
    });
  }
});

// Verify a zero-knowledge proof
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const { proof, proofType, blockchainType } = req.body;
    
    if (!proof || !proofType || !blockchainType) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required parameters' 
      });
    }
    
    const verificationResult = await enhancedZeroKnowledgeService.verifyEnhancedProof(
      proof,
      proofType as ZkProofType,
      blockchainType as BlockchainType
    );
    
    res.json({ 
      success: verificationResult.success, 
      verification: verificationResult,
      message: verificationResult.success ? 
        'Proof verified successfully' : 
        'Proof verification failed'
    });
  } catch (error) {
    console.error('[ZK-Routes] Error verifying proof:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to verify proof' 
    });
  }
});

// Generate a cross-chain proof
router.post('/prove/cross-chain', async (req: Request, res: Response) => {
  try {
    const { vaultId, sourceChain, targetChains, data } = req.body;
    
    if (!vaultId || !sourceChain || !targetChains) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required parameters' 
      });
    }
    
    if (!Array.isArray(targetChains) || targetChains.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'targetChains must be a non-empty array' 
      });
    }
    
    const crossChainProofs = await enhancedZeroKnowledgeService.generateCrossChainProof(
      vaultId,
      data || {},
      sourceChain as BlockchainType,
      targetChains.map(chain => chain as BlockchainType)
    );
    
    res.json({ 
      success: true, 
      proofs: crossChainProofs,
      message: 'Cross-chain proofs generated successfully'
    });
  } catch (error) {
    console.error('[ZK-Routes] Error generating cross-chain proof:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to generate cross-chain proof' 
    });
  }
});

export default router;