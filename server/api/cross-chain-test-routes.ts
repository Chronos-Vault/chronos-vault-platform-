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
    
    // With our updated verifyProof method, we can pass either a string or string array
    const result = await zeroKnowledgeShield.verifyProof(
      proof, 
      Array.isArray(publicInputs) ? publicInputs.map(String) : String(publicInputs), 
      'VAULT_OWNERSHIP'
    );
    
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

/**
 * Test cross-chain vault registration (Arbitrum + Solana + TON)
 * Triggers real transactions on all three chains
 * 
 * @route POST /api/test/cross-chain/register-vault
 */
router.post('/cross-chain/register-vault', async (req: Request, res: Response) => {
  try {
    const { vaultId, vaultName, ownerAddress, amount, securityLevel } = req.body;
    
    if (!vaultId || !vaultName || !ownerAddress) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: vaultId, vaultName, ownerAddress',
        timestamp: Date.now()
      });
    }
    
    securityLogger.info('Testing cross-chain vault registration (Arbitrum + Solana + TON)', { vaultId });
    
    // Import the cross-chain registration service
    const { CrossChainVaultRegistrationService } = await import('../services/cross-chain-vault-registration');
    const registrationService = CrossChainVaultRegistrationService.getInstance();
    
    const result = await registrationService.registerVaultOnAllChains({
      vaultId,
      vaultName,
      vaultType: 'standard',
      ownerAddress,
      amount: amount || '0.1',
      securityLevel: securityLevel || 3
    });
    
    return res.json({
      success: true,
      data: result,
      message: 'Cross-chain vault registration completed',
      timestamp: Date.now()
    });
  } catch (error) {
    securityLogger.error('Error in cross-chain vault registration test', error);
    
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now()
    });
  }
});

/**
 * Simple GET test routes for quick testing of cross-chain registration
 * Uses the public registerVaultCrossChain method which registers on all 3 chains
 */

// Test cross-chain registration (all 3 chains: Arbitrum, Solana, TON)
router.get('/all', async (req: Request, res: Response) => {
  try {
    const { crossChainVaultRegistration: service } = await import('../services/cross-chain-vault-registration');
    
    // Initialize the service if not already done
    await service.initialize();
    
    const vaultId = `test-vault-${Date.now()}`;
    
    const result = await service.registerVaultCrossChain({
      vaultId,
      vaultName: 'Trinity Protocol Test Vault',
      vaultType: 'timelock' as const,
      ownerAddress: '0x66e5046D136E82d17cbeB2FfEa5bd5205D962906',
      amount: '0.001',
      securityLevel: 3
    });
    
    return res.json({
      success: result.success,
      vaultId,
      chains: {
        arbitrum: result.arbitrumTxHash,
        solana: result.solanaTxSignature,
        ton: result.tonTxHash
      },
      trinityProofHash: result.trinityProofHash,
      explorerLinks: result.explorerLinks,
      error: result.error,
      timestamp: Date.now()
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now()
    });
  }
});

// Status check endpoint for the cross-chain service
router.get('/status', async (req: Request, res: Response) => {
  try {
    const { crossChainVaultRegistration: service } = await import('../services/cross-chain-vault-registration');
    
    // Initialize and get service status
    await service.initialize();
    
    return res.json({
      success: true,
      service: 'CrossChainVaultRegistration',
      chains: {
        arbitrum: {
          name: 'Arbitrum Sepolia',
          contract: '0x59396D58Fa856025bD5249E342729d5550Be151C',
          status: 'connected'
        },
        solana: {
          name: 'Solana Devnet',
          program: 'CYaDJYRqm35udQ8vkxoajSER8oaniQUcV8Vvw5BqJyo2',
          status: 'connected'
        },
        ton: {
          name: 'TON Testnet',
          wallet: '0QCctckQeh8Xo8-_U4L8PpXtjMBlG71S8PD8QZvr9OzmJvHK',
          status: 'connected'
        }
      },
      timestamp: Date.now()
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now()
    });
  }
});

export { router as crossChainTestRoutes };