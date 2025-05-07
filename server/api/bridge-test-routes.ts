/**
 * Bridge Test Routes
 * 
 * Test endpoints for cross-chain bridge functionality, allowing
 * developers to verify bridge operations without interacting directly
 * with the blockchain.
 */

import { Router, Request, Response } from 'express';
import { securityLogger } from '../monitoring/security-logger';
import { crossChainBridge } from '../blockchain/cross-chain-bridge';
import { zeroKnowledgeShield } from '../privacy/zero-knowledge-shield';
import { BlockchainType } from '@shared/types';

const router = Router();

/**
 * Test bridge initialization
 * GET /api/test/bridge/status
 */
router.get('/bridge/status', async (_req: Request, res: Response) => {
  try {
    const bridges = await crossChainBridge.getBridgeStatuses();
    
    return res.json({
      success: true,
      data: bridges,
      timestamp: Date.now()
    });
  } catch (error) {
    securityLogger.error('Error getting bridge status', error);
    
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now()
    });
  }
});

/**
 * Test bridge initialization between two chains
 * GET /api/test/bridge/init/:sourceChain/:targetChain
 */
router.get('/bridge/init/:sourceChain/:targetChain', async (req: Request, res: Response) => {
  try {
    const { sourceChain, targetChain } = req.params;
    
    if (!sourceChain || !targetChain) {
      return res.status(400).json({
        success: false,
        error: 'Source and target chains are required',
        timestamp: Date.now()
      });
    }
    
    const bridgeDetails = await crossChainBridge.initializeBridge(
      sourceChain as BlockchainType,
      targetChain as BlockchainType
    );
    
    return res.json({
      success: true,
      data: bridgeDetails,
      timestamp: Date.now()
    });
  } catch (error) {
    securityLogger.error('Error initializing bridge', error);
    
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now()
    });
  }
});

/**
 * Test bridge asset transfer between two chains
 * POST /api/test/bridge/transfer
 */
router.post('/bridge/transfer', async (req: Request, res: Response) => {
  try {
    const {
      sourceChain,
      targetChain,
      amount,
      assetType,
      senderAddress,
      recipientAddress
    } = req.body;
    
    if (!sourceChain || !targetChain || !amount || !assetType || !senderAddress || !recipientAddress) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters',
        timestamp: Date.now()
      });
    }
    
    const transferResult = await crossChainBridge.transferAsset({
      sourceChain: sourceChain as BlockchainType,
      targetChain: targetChain as BlockchainType,
      amount: parseFloat(amount),
      assetType,
      senderAddress,
      recipientAddress,
      timestamp: Date.now()
    });
    
    return res.json({
      success: true,
      data: transferResult,
      timestamp: Date.now()
    });
  } catch (error) {
    securityLogger.error('Error in bridge transfer test', error);
    
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now()
    });
  }
});

/**
 * Test bridge relay message between chains
 * POST /api/test/bridge/relay
 */
router.post('/bridge/relay', async (req: Request, res: Response) => {
  try {
    const {
      sourceChain,
      targetChain,
      message,
      senderAddress
    } = req.body;
    
    if (!sourceChain || !targetChain || !message || !senderAddress) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters',
        timestamp: Date.now()
      });
    }
    
    // Generate a cross-chain proof for the message relay
    const proof = await zeroKnowledgeShield.generateCrossChainProof(
      sourceChain as BlockchainType,
      targetChain as BlockchainType,
      { message, sender: senderAddress }
    );
    
    // Relay the message with the proof
    const relayResult = await crossChainBridge.relayMessage({
      sourceChain: sourceChain as BlockchainType,
      targetChain: targetChain as BlockchainType,
      message,
      senderAddress,
      proof: proof,
      timestamp: Date.now()
    });
    
    return res.json({
      success: true,
      data: relayResult,
      timestamp: Date.now()
    });
  } catch (error) {
    securityLogger.error('Error in bridge relay test', error);
    
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now()
    });
  }
});

/**
 * Test bridge verification for cross-chain transaction
 * GET /api/test/bridge/verify/:sourceChain/:targetChain/:txHash
 */
router.get('/bridge/verify/:sourceChain/:targetChain/:txHash', async (req: Request, res: Response) => {
  try {
    const { sourceChain, targetChain, txHash } = req.params;
    
    if (!sourceChain || !targetChain || !txHash) {
      return res.status(400).json({
        success: false,
        error: 'Source chain, target chain, and transaction hash are required',
        timestamp: Date.now()
      });
    }
    
    const verificationResult = await crossChainBridge.verifyTransaction(
      txHash,
      sourceChain as BlockchainType,
      targetChain as BlockchainType
    );
    
    return res.json({
      success: true,
      data: verificationResult,
      timestamp: Date.now()
    });
  } catch (error) {
    securityLogger.error('Error in bridge verification test', error);
    
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now()
    });
  }
});

export { router as bridgeTestRoutes };