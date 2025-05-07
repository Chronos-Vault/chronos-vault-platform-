/**
 * Cross-Chain Test Routes
 * 
 * This module provides API routes for testing cross-chain functionality.
 */

import { Request, Response, Router } from 'express';
import { securityLogger } from '../monitoring/security-logger';
import { crossChainVerification } from '../security/cross-chain-verification-protocol';
import { crossChainMultiSignature } from '../security/cross-chain-multi-signature';
import { zeroKnowledgeShield } from '../privacy/zero-knowledge-shield';
import { VerificationMethod, BlockchainType } from '../../shared/types';

const router = Router();

/**
 * Test cross-chain verification of a vault
 * 
 * @route POST /api/test/cross-chain/verify-vault
 */
router.post('/cross-chain/verify-vault', async (req: Request, res: Response) => {
  try {
    const { vaultId, sourceChain, targetChains, options } = req.body;
    
    if (!vaultId || !sourceChain || !targetChains || !Array.isArray(targetChains)) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters',
        timestamp: Date.now()
      });
    }
    
    securityLogger.info('Testing cross-chain vault verification', { vaultId, sourceChain, targetChains });
    
    const result = await crossChainVerification.verifyVaultAcrossChains(
      vaultId,
      sourceChain as BlockchainType,
      targetChains as BlockchainType[],
      options
    );
    
    return res.json({
      success: true,
      data: result,
      timestamp: Date.now()
    });
  } catch (error) {
    securityLogger.error('Error in cross-chain vault verification test', error);
    
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now()
    });
  }
});

/**
 * Test cross-chain verification of a transaction
 * 
 * @route POST /api/test/cross-chain/verify-transaction
 */
router.post('/cross-chain/verify-transaction', async (req: Request, res: Response) => {
  try {
    const { transactionId, sourceChain, targetChains, options } = req.body;
    
    if (!transactionId || !sourceChain || !targetChains || !Array.isArray(targetChains)) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters',
        timestamp: Date.now()
      });
    }
    
    securityLogger.info('Testing cross-chain transaction verification', { transactionId, sourceChain, targetChains });
    
    const result = await crossChainVerification.verifyTransactionAcrossChains(
      transactionId,
      sourceChain as BlockchainType,
      targetChains as BlockchainType[],
      options
    );
    
    return res.json({
      success: true,
      data: result,
      timestamp: Date.now()
    });
  } catch (error) {
    securityLogger.error('Error in cross-chain transaction verification test', error);
    
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now()
    });
  }
});

/**
 * Test multi-signature request creation
 * 
 * @route POST /api/test/cross-chain/create-multisig
 */
router.post('/cross-chain/create-multisig', async (req: Request, res: Response) => {
  try {
    const { data, signers, options } = req.body;
    
    if (!data || !signers || !Array.isArray(signers) || signers.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters',
        timestamp: Date.now()
      });
    }
    
    securityLogger.info('Testing multi-signature request creation', { signerCount: signers.length });
    
    const result = await crossChainMultiSignature.createMultiSignatureRequest(
      data,
      signers,
      options
    );
    
    return res.json({
      success: true,
      data: result,
      timestamp: Date.now()
    });
  } catch (error) {
    securityLogger.error('Error in multi-signature request creation test', error);
    
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now()
    });
  }
});

/**
 * Test multi-signature status checking
 * 
 * @route POST /api/test/cross-chain/check-multisig
 */
router.post('/cross-chain/check-multisig', async (req: Request, res: Response) => {
  try {
    const { requestId, signers, options } = req.body;
    
    if (!requestId || !signers || !Array.isArray(signers) || signers.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters',
        timestamp: Date.now()
      });
    }
    
    securityLogger.info('Testing multi-signature status check', { requestId, signerCount: signers.length });
    
    const result = await crossChainMultiSignature.getMultiSignatureStatus(
      requestId,
      signers,
      options
    );
    
    return res.json({
      success: true,
      data: result,
      timestamp: Date.now()
    });
  } catch (error) {
    securityLogger.error('Error in multi-signature status check test', error);
    
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now()
    });
  }
});

/**
 * Test adding a signature to a multi-signature request
 * 
 * @route POST /api/test/cross-chain/add-signature
 */
router.post('/cross-chain/add-signature', async (req: Request, res: Response) => {
  try {
    const { requestId, signerId, blockchain, address, signature, data } = req.body;
    
    if (!requestId || !signerId || !blockchain || !address || !signature || !data) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters',
        timestamp: Date.now()
      });
    }
    
    securityLogger.info('Testing adding signature to multi-signature request', { requestId, signerId, blockchain });
    
    const result = await crossChainMultiSignature.addSignature(
      requestId,
      signerId,
      blockchain as BlockchainType,
      address,
      signature,
      data
    );
    
    return res.json({
      success: true,
      data: result,
      timestamp: Date.now()
    });
  } catch (error) {
    securityLogger.error('Error in adding signature test', error);
    
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now()
    });
  }
});

/**
 * Test generating a zero-knowledge proof
 * 
 * @route POST /api/test/cross-chain/generate-zk-proof
 */
router.post('/cross-chain/generate-zk-proof', async (req: Request, res: Response) => {
  try {
    const { sourceChain, targetChains, transactionId } = req.body;
    
    if (!sourceChain || !targetChains || !Array.isArray(targetChains) || !transactionId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters',
        timestamp: Date.now()
      });
    }
    
    securityLogger.info('Testing zero-knowledge proof generation', { sourceChain, targetChains, transactionId });
    
    // Call with corrected parameters to match the function signature
    const result = await zeroKnowledgeShield.generateCrossChainProof(
      sourceChain as BlockchainType,
      targetChains[0] as BlockchainType, // Using the first target chain
      {
        transactionId,
        chains: targetChains.map(chain => ({ chain, status: 'pending' }))
      }
    );
    
    return res.json({
      success: true,
      data: result,
      timestamp: Date.now()
    });
  } catch (error) {
    securityLogger.error('Error in zero-knowledge proof generation test', error);
    
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now()
    });
  }
});

/**
 * Test verifying a zero-knowledge proof
 * 
 * @route POST /api/test/cross-chain/verify-zk-proof
 */
router.post('/cross-chain/verify-zk-proof', async (req: Request, res: Response) => {
  try {
    const { proof, publicInputs } = req.body;
    
    if (!proof || !publicInputs || !Array.isArray(publicInputs)) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters',
        timestamp: Date.now()
      });
    }
    
    securityLogger.info('Testing zero-knowledge proof verification');
    
    const result = await zeroKnowledgeShield.verifyProof(proof, publicInputs);
    
    return res.json({
      success: true,
      data: { verified: result },
      timestamp: Date.now()
    });
  } catch (error) {
    securityLogger.error('Error in zero-knowledge proof verification test', error);
    
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now()
    });
  }
});

export { router as crossChainTestRoutes };