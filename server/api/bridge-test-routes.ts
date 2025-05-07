/**
 * Bridge Test Routes
 * 
 * This module provides API routes for testing cross-chain bridge functionality.
 */

import { Router, Request, Response } from 'express';
import { securityLogger } from '../monitoring/security-logger';
import { crossChainBridge, TokenStandard, BridgeTransactionStatus } from '../blockchain/cross-chain-bridge';
import { crossChainErrorHandler, CrossChainErrorCategory } from '../security/cross-chain-error-handler';
import { BlockchainType } from '../../shared/types';

const router = Router();

/**
 * Get supported blockchain pairs for bridging
 * 
 * @route GET /api/test/bridge/supported-pairs
 */
router.get('/bridge/supported-pairs', async (_req: Request, res: Response) => {
  try {
    securityLogger.info('Testing bridge supported pairs');
    
    const blockchains: BlockchainType[] = ['ETH', 'SOL', 'TON', 'POLYGON', 'BTC'];
    const supportedPairs: Array<{source: BlockchainType, target: BlockchainType}> = [];
    
    // Check all possible pairs
    for (const source of blockchains) {
      for (const target of blockchains) {
        if (source !== target) {
          const isSupported = await crossChainBridge.supportsPair(source, target);
          
          if (isSupported) {
            supportedPairs.push({ source, target });
          }
        }
      }
    }
    
    return res.json({
      success: true,
      data: supportedPairs,
      timestamp: Date.now()
    });
  } catch (error) {
    const handledError = crossChainErrorHandler.handle(error);
    securityLogger.error('Error getting supported bridge pairs', error);
    
    return res.status(500).json({
      success: false,
      error: crossChainErrorHandler.createClientSafeError(handledError),
      timestamp: Date.now()
    });
  }
});

/**
 * Get supported token standards for a blockchain pair
 * 
 * @route GET /api/test/bridge/token-standards
 */
router.get('/bridge/token-standards', async (req: Request, res: Response) => {
  try {
    const { sourceChain, targetChain } = req.query;
    
    if (!sourceChain || !targetChain) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: sourceChain and targetChain',
        timestamp: Date.now()
      });
    }
    
    securityLogger.info('Testing bridge token standards', { 
      sourceChain, 
      targetChain 
    });
    
    const tokenStandards = await crossChainBridge.getSupportedTokenStandards(
      sourceChain as BlockchainType, 
      targetChain as BlockchainType
    );
    
    return res.json({
      success: true,
      data: tokenStandards,
      timestamp: Date.now()
    });
  } catch (error) {
    const handledError = crossChainErrorHandler.handle(error);
    securityLogger.error('Error getting supported token standards', error);
    
    return res.status(500).json({
      success: false,
      error: crossChainErrorHandler.createClientSafeError(handledError),
      timestamp: Date.now()
    });
  }
});

/**
 * Estimate bridge fees
 * 
 * @route POST /api/test/bridge/estimate-fee
 */
router.post('/bridge/estimate-fee', async (req: Request, res: Response) => {
  try {
    const { sourceChain, targetChain, tokenStandard, amount } = req.body;
    
    if (!sourceChain || !targetChain || !tokenStandard || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: sourceChain, targetChain, tokenStandard, and amount',
        timestamp: Date.now()
      });
    }
    
    securityLogger.info('Testing bridge fee estimation', { 
      sourceChain, 
      targetChain,
      tokenStandard,
      amount
    });
    
    const feeEstimation = await crossChainBridge.estimateFee(
      sourceChain as BlockchainType,
      targetChain as BlockchainType,
      tokenStandard as TokenStandard,
      amount
    );
    
    return res.json({
      success: true,
      data: feeEstimation,
      timestamp: Date.now()
    });
  } catch (error) {
    const handledError = crossChainErrorHandler.handle(error, {
      category: CrossChainErrorCategory.BRIDGE_CONTRACT_ERROR
    });
    
    securityLogger.error('Error estimating bridge fees', error);
    
    return res.status(500).json({
      success: false,
      error: crossChainErrorHandler.createClientSafeError(handledError),
      timestamp: Date.now()
    });
  }
});

/**
 * Initiate a bridge transfer
 * 
 * @route POST /api/test/bridge/initiate-transfer
 */
router.post('/bridge/initiate-transfer', async (req: Request, res: Response) => {
  try {
    const { 
      sourceChain, 
      targetChain, 
      sourceAddress, 
      targetAddress,
      tokenStandard,
      tokenAddress,
      amount,
      options
    } = req.body;
    
    if (!sourceChain || !targetChain || !sourceAddress || !targetAddress || !tokenStandard || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters',
        timestamp: Date.now()
      });
    }
    
    securityLogger.info('Testing bridge transfer initiation', { 
      sourceChain, 
      targetChain,
      tokenStandard,
      amount
    });
    
    const bridgeTransaction = await crossChainBridge.initiateTransfer(
      sourceChain as BlockchainType,
      targetChain as BlockchainType,
      sourceAddress,
      targetAddress,
      tokenStandard as TokenStandard,
      tokenAddress,
      amount,
      options
    );
    
    return res.json({
      success: true,
      data: bridgeTransaction,
      timestamp: Date.now()
    });
  } catch (error) {
    const handledError = crossChainErrorHandler.handle(error, {
      category: CrossChainErrorCategory.BRIDGE_CONTRACT_ERROR
    });
    
    securityLogger.error('Error initiating bridge transfer', error);
    
    return res.status(500).json({
      success: false,
      error: crossChainErrorHandler.createClientSafeError(handledError),
      timestamp: Date.now()
    });
  }
});

/**
 * Get bridge transaction status
 * 
 * @route GET /api/test/bridge/transaction/:transactionId
 */
router.get('/bridge/transaction/:transactionId', async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.params;
    
    if (!transactionId) {
      return res.status(400).json({
        success: false,
        error: 'Missing transaction ID',
        timestamp: Date.now()
      });
    }
    
    securityLogger.info('Getting bridge transaction status', { transactionId });
    
    const transaction = await crossChainBridge.getTransactionStatus(transactionId);
    
    return res.json({
      success: true,
      data: transaction,
      timestamp: Date.now()
    });
  } catch (error) {
    const handledError = crossChainErrorHandler.handle(error, {
      category: CrossChainErrorCategory.TRANSACTION_NOT_FOUND
    });
    
    securityLogger.error('Error getting bridge transaction status', error);
    
    return res.status(500).json({
      success: false,
      error: crossChainErrorHandler.createClientSafeError(handledError),
      timestamp: Date.now()
    });
  }
});

/**
 * Complete a bridge transfer
 * 
 * @route POST /api/test/bridge/complete-transfer/:transactionId
 */
router.post('/bridge/complete-transfer/:transactionId', async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.params;
    
    if (!transactionId) {
      return res.status(400).json({
        success: false,
        error: 'Missing transaction ID',
        timestamp: Date.now()
      });
    }
    
    securityLogger.info('Completing bridge transfer', { transactionId });
    
    const transaction = await crossChainBridge.completeTransfer(transactionId);
    
    return res.json({
      success: true,
      data: transaction,
      timestamp: Date.now()
    });
  } catch (error) {
    const handledError = crossChainErrorHandler.handle(error, {
      category: CrossChainErrorCategory.BRIDGE_CONTRACT_ERROR
    });
    
    securityLogger.error('Error completing bridge transfer', error);
    
    return res.status(500).json({
      success: false,
      error: crossChainErrorHandler.createClientSafeError(handledError),
      timestamp: Date.now()
    });
  }
});

/**
 * Verify a bridge transaction
 * 
 * @route GET /api/test/bridge/verify/:transactionId
 */
router.get('/bridge/verify/:transactionId', async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.params;
    
    if (!transactionId) {
      return res.status(400).json({
        success: false,
        error: 'Missing transaction ID',
        timestamp: Date.now()
      });
    }
    
    securityLogger.info('Verifying bridge transaction', { transactionId });
    
    const isVerified = await crossChainBridge.verifyTransaction(transactionId);
    
    return res.json({
      success: true,
      data: { verified: isVerified },
      timestamp: Date.now()
    });
  } catch (error) {
    const handledError = crossChainErrorHandler.handle(error, {
      category: CrossChainErrorCategory.VALIDATION_FAILURE
    });
    
    securityLogger.error('Error verifying bridge transaction', error);
    
    return res.status(500).json({
      success: false,
      error: crossChainErrorHandler.createClientSafeError(handledError),
      timestamp: Date.now()
    });
  }
});

/**
 * Error test: intentionally trigger different error types to test error handling
 * 
 * @route POST /api/test/bridge/error-test
 */
router.post('/bridge/error-test', async (req: Request, res: Response) => {
  try {
    const { errorType } = req.body;
    
    if (!errorType) {
      return res.status(400).json({
        success: false,
        error: 'Missing error type',
        timestamp: Date.now()
      });
    }
    
    securityLogger.info('Testing bridge error handling', { errorType });
    
    let error;
    switch (errorType) {
      case 'connection':
        error = new Error('Connection failed to blockchain network');
        break;
      case 'timeout':
        error = new Error('Operation timed out after 30 seconds');
        break;
      case 'rate_limit':
        error = new Error('Rate limit exceeded for blockchain API');
        break;
      case 'signature':
        error = new Error('Invalid signature for transaction');
        break;
      case 'insufficient_funds':
        error = new Error('Insufficient funds for transaction');
        break;
      case 'validation':
        error = new Error('Transaction validation failed: data format error');
        break;
      case 'bridge_error':
        error = new Error('Bridge contract execution failed: gas limit exceeded');
        break;
      default:
        error = new Error('Unknown error during bridge operation');
    }
    
    const handledError = crossChainErrorHandler.handle(error);
    
    return res.json({
      success: false,
      data: {
        errorType,
        handledError: crossChainErrorHandler.createClientSafeError(handledError),
        recoverable: crossChainErrorHandler.shouldAttemptRecovery(handledError),
        recoveryDelay: crossChainErrorHandler.getRecoveryDelayMs(handledError)
      },
      timestamp: Date.now()
    });
  } catch (error) {
    const handledError = crossChainErrorHandler.handle(error);
    securityLogger.error('Error testing bridge error handling', error);
    
    return res.status(500).json({
      success: false,
      error: crossChainErrorHandler.createClientSafeError(handledError),
      timestamp: Date.now()
    });
  }
});

export { router as bridgeTestRoutes };