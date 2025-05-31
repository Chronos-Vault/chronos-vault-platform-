/**
 * Real Testnet Wallet API Routes
 * 
 * Provides endpoints for interacting with real testnet wallets using actual private keys
 */

import express, { Request, Response, Router } from 'express';
import { testnetWalletService } from '../services/testnet-wallet-service';

const router: Router = express.Router();

/**
 * Get Solana testnet wallet information
 */
router.get('/solana', async (_req: Request, res: Response) => {
  try {
    const wallet = await testnetWalletService.getSolanaWallet();
    res.status(200).json({
      status: 'success',
      data: wallet
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch Solana wallet: ' + error.message
    });
  }
});

/**
 * Get TON testnet wallet information
 */
router.get('/ton', async (_req: Request, res: Response) => {
  try {
    const wallet = await testnetWalletService.getTonWallet();
    res.status(200).json({
      status: 'success',
      data: wallet
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch TON wallet: ' + error.message
    });
  }
});

/**
 * Get all wallet addresses
 */
router.get('/addresses', async (_req: Request, res: Response) => {
  try {
    const addresses = testnetWalletService.getWalletAddresses();
    res.status(200).json({
      status: 'success',
      data: addresses
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch wallet addresses: ' + error.message
    });
  }
});

/**
 * Request testnet tokens (airdrop)
 */
router.post('/airdrop', async (req: Request, res: Response) => {
  try {
    const { network } = req.body;
    
    if (!network || !['solana', 'ton'].includes(network)) {
      return res.status(400).json({
        status: 'error',
        message: 'Valid network (solana or ton) required'
      });
    }
    
    const result = await testnetWalletService.requestAirdrop(network);
    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Airdrop failed: ' + error.message
    });
  }
});

/**
 * Send testnet transaction
 */
router.post('/send', async (req: Request, res: Response) => {
  try {
    const { network, toAddress, amount } = req.body;
    
    if (!network || !toAddress || !amount) {
      return res.status(400).json({
        status: 'error',
        message: 'Network, toAddress, and amount are required'
      });
    }
    
    if (!['solana', 'ton'].includes(network)) {
      return res.status(400).json({
        status: 'error',
        message: 'Valid network (solana or ton) required'
      });
    }
    
    const result = await testnetWalletService.sendTransaction(network, toAddress, amount);
    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Transaction failed: ' + error.message
    });
  }
});

/**
 * Initialize wallet service
 */
router.post('/initialize', async (_req: Request, res: Response) => {
  try {
    await testnetWalletService.initialize();
    res.status(200).json({
      status: 'success',
      message: 'Wallet service initialized successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to initialize wallet service: ' + error.message
    });
  }
});

export { router as testnetWalletRoutes };