/**
 * Cross-Chain Bridge Routes
 * 
 * This module provides API routes for cross-chain bridge operations,
 * including asset transfers, atomic swaps, and bridge status checks.
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { crossChainBridge } from '../blockchain/cross-chain-bridge';
import { securityLogger, SecurityEventType } from '../monitoring/security-logger';
import { AuthenticationStatus, requireAuth } from '../middleware/auth-middleware';

const router = Router();

// Schema for transfer request
const transferSchema = z.object({
  sourceChain: z.string(),
  targetChain: z.string(),
  amount: z.number().positive(),
  assetType: z.string(),
  senderAddress: z.string(),
  recipientAddress: z.string(),
});

// Schema for atomic swap request
const atomicSwapSchema = z.object({
  initiatorChain: z.string(),
  responderChain: z.string(),
  initiatorAsset: z.string(),
  responderAsset: z.string(),
  initiatorAmount: z.number().positive(),
  responderAmount: z.number().positive(),
  initiatorAddress: z.string(),
  responderAddress: z.string(),
  timelock: z.number().int().min(300), // Minimum 5 minutes
});

// Schema for bridge initialization
const bridgeInitSchema = z.object({
  sourceChain: z.string(),
  targetChain: z.string(),
});

// Schema for swap participation
const swapParticipationSchema = z.object({
  responderAddress: z.string(),
});

// Schema for swap completion
const swapCompletionSchema = z.object({
  secret: z.string(),
});

// Bridge status route
router.get('/status', async (_req: Request, res: Response) => {
  try {
    const statuses = await crossChainBridge.getBridgeStatuses();
    res.json({
      success: true,
      data: statuses
    });
  } catch (error) {
    securityLogger.error('Failed to get bridge statuses', SecurityEventType.API_ERROR, {
      error: error instanceof Error ? error.message : String(error)
    });
    
    res.status(500).json({
      success: false,
      error: 'Failed to get bridge statuses'
    });
  }
});

// Specific bridge status route
router.get('/status/:sourceChain/:targetChain', async (req: Request, res: Response) => {
  try {
    const { sourceChain, targetChain } = req.params;
    
    const status = await crossChainBridge.getBridgeStatus(
      sourceChain as any,
      targetChain as any
    );
    
    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    securityLogger.error('Failed to get specific bridge status', SecurityEventType.API_ERROR, {
      error: error instanceof Error ? error.message : String(error),
      sourceChain: req.params.sourceChain,
      targetChain: req.params.targetChain
    });
    
    res.status(500).json({
      success: false,
      error: 'Failed to get bridge status'
    });
  }
});

// Initialize bridge route
router.post('/initialize', requireAuth(AuthenticationStatus.AUTHENTICATED), async (req: Request, res: Response) => {
  try {
    const { sourceChain, targetChain } = bridgeInitSchema.parse(req.body);
    
    const result = await crossChainBridge.initializeBridge(
      sourceChain as any,
      targetChain as any
    );
    
    securityLogger.info('Bridge initialized', SecurityEventType.BRIDGE_OPERATION, {
      sourceChain,
      targetChain,
      userId: req.user?.id
    });
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    securityLogger.error('Failed to initialize bridge', SecurityEventType.API_ERROR, {
      error: error instanceof Error ? error.message : String(error),
      userId: req.user?.id
    });
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: error.format()
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to initialize bridge'
    });
  }
});

// Transfer asset route
router.post('/transfer', requireAuth(AuthenticationStatus.AUTHENTICATED), async (req: Request, res: Response) => {
  try {
    const transferData = transferSchema.parse(req.body);
    
    const txId = await crossChainBridge.transferAsset(transferData);
    
    securityLogger.info('Asset transfer initiated', SecurityEventType.BRIDGE_OPERATION, {
      ...transferData,
      userId: req.user?.id
    });
    
    res.json({
      success: true,
      data: {
        id: txId
      }
    });
  } catch (error) {
    securityLogger.error('Failed to transfer asset', SecurityEventType.API_ERROR, {
      error: error instanceof Error ? error.message : String(error),
      userId: req.user?.id
    });
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: error.format()
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to transfer asset'
    });
  }
});

// Get list of all transactions
router.get('/transactions', requireAuth(AuthenticationStatus.AUTHENTICATED), async (req: Request, res: Response) => {
  try {
    const transactions = await crossChainBridge.listBridgeTransactions();
    
    res.json({
      success: true,
      data: transactions
    });
  } catch (error) {
    securityLogger.error('Failed to get bridge transactions', SecurityEventType.API_ERROR, {
      error: error instanceof Error ? error.message : String(error),
      userId: req.user?.id
    });
    
    res.status(500).json({
      success: false,
      error: 'Failed to get bridge transactions'
    });
  }
});

// Get specific transaction
router.get('/transactions/:id', requireAuth(AuthenticationStatus.AUTHENTICATED), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const transaction = await crossChainBridge.getTransaction(id);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }
    
    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    securityLogger.error('Failed to get transaction', SecurityEventType.API_ERROR, {
      error: error instanceof Error ? error.message : String(error),
      transactionId: req.params.id,
      userId: req.user?.id
    });
    
    res.status(500).json({
      success: false,
      error: 'Failed to get transaction'
    });
  }
});

// Create atomic swap route
router.post('/atomic-swap', requireAuth(AuthenticationStatus.AUTHENTICATED), async (req: Request, res: Response) => {
  try {
    const swapData = atomicSwapSchema.parse(req.body);
    
    const swapId = await crossChainBridge.createAtomicSwap(swapData);
    
    securityLogger.info('Atomic swap initiated', SecurityEventType.BRIDGE_OPERATION, {
      ...swapData,
      userId: req.user?.id
    });
    
    res.json({
      success: true,
      data: {
        id: swapId
      }
    });
  } catch (error) {
    securityLogger.error('Failed to create atomic swap', SecurityEventType.API_ERROR, {
      error: error instanceof Error ? error.message : String(error),
      userId: req.user?.id
    });
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: error.format()
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to create atomic swap'
    });
  }
});

// Get list of all atomic swaps
router.get('/atomic-swaps', requireAuth(AuthenticationStatus.AUTHENTICATED), async (req: Request, res: Response) => {
  try {
    const swaps = await crossChainBridge.listAtomicSwaps();
    
    res.json({
      success: true,
      data: swaps
    });
  } catch (error) {
    securityLogger.error('Failed to get atomic swaps', SecurityEventType.API_ERROR, {
      error: error instanceof Error ? error.message : String(error),
      userId: req.user?.id
    });
    
    res.status(500).json({
      success: false,
      error: 'Failed to get atomic swaps'
    });
  }
});

// Get specific atomic swap
router.get('/atomic-swaps/:id', requireAuth(AuthenticationStatus.AUTHENTICATED), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const swap = await crossChainBridge.getAtomicSwap(id);
    
    if (!swap) {
      return res.status(404).json({
        success: false,
        error: 'Atomic swap not found'
      });
    }
    
    res.json({
      success: true,
      data: swap
    });
  } catch (error) {
    securityLogger.error('Failed to get atomic swap', SecurityEventType.API_ERROR, {
      error: error instanceof Error ? error.message : String(error),
      swapId: req.params.id,
      userId: req.user?.id
    });
    
    res.status(500).json({
      success: false,
      error: 'Failed to get atomic swap'
    });
  }
});

// Participate in atomic swap
router.post('/atomic-swaps/:id/participate', requireAuth(AuthenticationStatus.AUTHENTICATED), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { responderAddress } = swapParticipationSchema.parse(req.body);
    
    const result = await crossChainBridge.participateInAtomicSwap(id, responderAddress);
    
    securityLogger.info('Participated in atomic swap', SecurityEventType.BRIDGE_OPERATION, {
      swapId: id,
      responderAddress,
      userId: req.user?.id
    });
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    securityLogger.error('Failed to participate in atomic swap', SecurityEventType.API_ERROR, {
      error: error instanceof Error ? error.message : String(error),
      swapId: req.params.id,
      userId: req.user?.id
    });
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: error.format()
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to participate in atomic swap'
    });
  }
});

// Complete atomic swap
router.post('/atomic-swaps/:id/complete', requireAuth(AuthenticationStatus.AUTHENTICATED), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { secret } = swapCompletionSchema.parse(req.body);
    
    const result = await crossChainBridge.completeAtomicSwap(id, secret);
    
    securityLogger.info('Completed atomic swap', SecurityEventType.BRIDGE_OPERATION, {
      swapId: id,
      userId: req.user?.id
    });
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    securityLogger.error('Failed to complete atomic swap', SecurityEventType.API_ERROR, {
      error: error instanceof Error ? error.message : String(error),
      swapId: req.params.id,
      userId: req.user?.id
    });
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: error.format()
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to complete atomic swap'
    });
  }
});

// Refund atomic swap
router.post('/atomic-swaps/:id/refund', requireAuth(AuthenticationStatus.AUTHENTICATED), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await crossChainBridge.refundAtomicSwap(id);
    
    securityLogger.info('Refunded atomic swap', SecurityEventType.BRIDGE_OPERATION, {
      swapId: id,
      userId: req.user?.id
    });
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    securityLogger.error('Failed to refund atomic swap', SecurityEventType.API_ERROR, {
      error: error instanceof Error ? error.message : String(error),
      swapId: req.params.id,
      userId: req.user?.id
    });
    
    res.status(500).json({
      success: false,
      error: 'Failed to refund atomic swap'
    });
  }
});

// Verify transaction
router.get('/verify/:id', requireAuth(AuthenticationStatus.AUTHENTICATED), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { sourceChain, targetChain } = req.query as { sourceChain: string; targetChain: string };
    
    if (!sourceChain || !targetChain) {
      return res.status(400).json({
        success: false,
        error: 'Source chain and target chain are required query parameters'
      });
    }
    
    const result = await crossChainBridge.verifyTransaction(
      id,
      sourceChain as any,
      targetChain as any
    );
    
    securityLogger.info('Transaction verified', SecurityEventType.BRIDGE_OPERATION, {
      transactionId: id,
      sourceChain,
      targetChain,
      userId: req.user?.id
    });
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    securityLogger.error('Failed to verify transaction', SecurityEventType.API_ERROR, {
      error: error instanceof Error ? error.message : String(error),
      transactionId: req.params.id,
      userId: req.user?.id
    });
    
    res.status(500).json({
      success: false,
      error: 'Failed to verify transaction'
    });
  }
});

// Get the user's wallets
router.get('/wallets', requireAuth(AuthenticationStatus.AUTHENTICATED), async (req: Request, res: Response) => {
  try {
    // This route would typically be implemented to retrieve wallet connections
    // from either a database or existing sessions
    
    // For now, return a sample response with no connected wallets
    res.json({
      success: true,
      data: {
        ethereum: null,
        solana: null,
        ton: null,
        bitcoin: null
      }
    });
  } catch (error) {
    securityLogger.error('Failed to get wallets', SecurityEventType.API_ERROR, {
      error: error instanceof Error ? error.message : String(error),
      userId: req.user?.id
    });
    
    res.status(500).json({
      success: false,
      error: 'Failed to get wallets'
    });
  }
});

// Connect to a blockchain wallet
router.post('/connect', requireAuth(AuthenticationStatus.AUTHENTICATED), async (req: Request, res: Response) => {
  try {
    const { chain } = req.body;
    
    if (!chain) {
      return res.status(400).json({
        success: false,
        error: 'Chain parameter is required'
      });
    }
    
    // This route would typically be implemented to connect to a wallet
    // using the appropriate connector
    
    // For now, return a sample response with a simulated wallet
    res.json({
      success: true,
      data: {
        address: `simulated_${chain}_address`,
        network: 'testnet',
        balance: {
          total: '1000',
          formatted: '1,000.00',
          symbol: chain === 'ethereum' ? 'ETH' : 
                 chain === 'solana' ? 'SOL' : 
                 chain === 'ton' ? 'TON' : 'BTC',
          decimals: 18
        },
        isConnected: true,
        isTestnet: true
      }
    });
  } catch (error) {
    securityLogger.error('Failed to connect wallet', SecurityEventType.API_ERROR, {
      error: error instanceof Error ? error.message : String(error),
      userId: req.user?.id
    });
    
    res.status(500).json({
      success: false,
      error: 'Failed to connect wallet'
    });
  }
});

// Disconnect from a blockchain wallet
router.post('/disconnect', requireAuth(AuthenticationStatus.AUTHENTICATED), async (req: Request, res: Response) => {
  try {
    const { chain } = req.body;
    
    if (!chain) {
      return res.status(400).json({
        success: false,
        error: 'Chain parameter is required'
      });
    }
    
    // This route would typically be implemented to disconnect from a wallet
    
    // For now, return a success response
    res.json({
      success: true
    });
  } catch (error) {
    securityLogger.error('Failed to disconnect wallet', SecurityEventType.API_ERROR, {
      error: error instanceof Error ? error.message : String(error),
      userId: req.user?.id
    });
    
    res.status(500).json({
      success: false,
      error: 'Failed to disconnect wallet'
    });
  }
});

// Refresh wallet balances
router.post('/refresh-balances', requireAuth(AuthenticationStatus.AUTHENTICATED), async (req: Request, res: Response) => {
  try {
    const { chains } = req.body;
    
    if (!chains || !Array.isArray(chains) || chains.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Chains parameter must be a non-empty array'
      });
    }
    
    // This route would typically be implemented to refresh wallet balances
    
    // For now, return a sample response with simulated balances
    const balances: Record<string, any> = {};
    
    chains.forEach(chain => {
      balances[chain] = {
        total: `${1000 + Math.random() * 100}`,
        formatted: `${(1000 + Math.random() * 100).toFixed(2)}`,
        symbol: chain === 'ethereum' ? 'ETH' : 
               chain === 'solana' ? 'SOL' : 
               chain === 'ton' ? 'TON' : 'BTC',
        decimals: 18
      };
    });
    
    res.json({
      success: true,
      data: balances
    });
  } catch (error) {
    securityLogger.error('Failed to refresh balances', SecurityEventType.API_ERROR, {
      error: error instanceof Error ? error.message : String(error),
      userId: req.user?.id
    });
    
    res.status(500).json({
      success: false,
      error: 'Failed to refresh balances'
    });
  }
});

export default router;