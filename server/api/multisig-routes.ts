/**
 * Multi-Signature Wallet API Routes
 * 
 * RESTful API endpoints for managing multi-signature wallets and transactions
 */

import { Router, Request, Response } from 'express';
import { multiSigService } from '../security/multisig-service';

const router = Router();

/**
 * Create a new multi-signature wallet
 */
router.post('/wallets', async (req: Request, res: Response) => {
  try {
    const { name, network, signers, requiredSignatures } = req.body;

    if (!name || !network || !signers || !requiredSignatures) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields: name, network, signers, requiredSignatures'
      });
    }

    if (!Array.isArray(signers) || signers.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Signers must be a non-empty array'
      });
    }

    if (requiredSignatures > signers.length || requiredSignatures < 1) {
      return res.status(400).json({
        status: 'error',
        message: 'Required signatures must be between 1 and the number of signers'
      });
    }

    const wallet = await multiSigService.createMultiSigWallet(
      name,
      network,
      signers,
      requiredSignatures
    );

    res.json({
      status: 'success',
      data: wallet
    });
  } catch (error) {
    console.error('Error creating multi-sig wallet:', error);
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to create wallet'
    });
  }
});

/**
 * Get wallets for a specific signer
 */
router.get('/wallets/:signerAddress', async (req: Request, res: Response) => {
  try {
    const { signerAddress } = req.params;
    const wallets = multiSigService.getWalletsForSigner(signerAddress);

    res.json({
      status: 'success',
      data: wallets
    });
  } catch (error) {
    console.error('Error fetching wallets:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch wallets'
    });
  }
});

/**
 * Get wallet details by ID
 */
router.get('/wallet/:walletId', async (req: Request, res: Response) => {
  try {
    const { walletId } = req.params;
    const wallet = multiSigService.getWallet(walletId);

    if (!wallet) {
      return res.status(404).json({
        status: 'error',
        message: 'Wallet not found'
      });
    }

    res.json({
      status: 'success',
      data: wallet
    });
  } catch (error) {
    console.error('Error fetching wallet:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch wallet'
    });
  }
});

/**
 * Propose a new transaction
 */
router.post('/transactions/propose', async (req: Request, res: Response) => {
  try {
    const { walletId, recipient, amount, proposer, metadata } = req.body;

    if (!walletId || !recipient || !amount || !proposer) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields: walletId, recipient, amount, proposer'
      });
    }

    const transaction = await multiSigService.proposeTransaction(
      walletId,
      recipient,
      amount,
      proposer,
      metadata
    );

    res.json({
      status: 'success',
      data: transaction
    });
  } catch (error) {
    console.error('Error proposing transaction:', error);
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to propose transaction'
    });
  }
});

/**
 * Sign a pending transaction
 */
router.post('/transactions/:transactionId/sign', async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.params;
    const { signer, signature } = req.body;

    if (!signer || !signature) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields: signer, signature'
      });
    }

    const transaction = await multiSigService.signTransaction(
      transactionId,
      signer,
      signature
    );

    res.json({
      status: 'success',
      data: transaction
    });
  } catch (error) {
    console.error('Error signing transaction:', error);
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to sign transaction'
    });
  }
});

/**
 * Execute an approved transaction
 */
router.post('/transactions/:transactionId/execute', async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.params;
    const txHash = await multiSigService.executeTransaction(transactionId);

    res.json({
      status: 'success',
      data: {
        transactionHash: txHash,
        transactionId
      }
    });
  } catch (error) {
    console.error('Error executing transaction:', error);
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to execute transaction'
    });
  }
});

/**
 * Get pending transactions for a signer
 */
router.get('/transactions/pending/:signerAddress', async (req: Request, res: Response) => {
  try {
    const { signerAddress } = req.params;
    const transactions = multiSigService.getPendingTransactionsForSigner(signerAddress);

    res.json({
      status: 'success',
      data: transactions
    });
  } catch (error) {
    console.error('Error fetching pending transactions:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch pending transactions'
    });
  }
});

/**
 * Get transaction details by ID
 */
router.get('/transaction/:transactionId', async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.params;
    const transaction = multiSigService.getTransaction(transactionId);

    if (!transaction) {
      return res.status(404).json({
        status: 'error',
        message: 'Transaction not found'
      });
    }

    res.json({
      status: 'success',
      data: transaction
    });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch transaction'
    });
  }
});

export { router as multiSigRoutes };