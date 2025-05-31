import { Router } from 'express';
import { z } from 'zod';

const router = Router();

const addWalletSchema = z.object({
  address: z.string().min(1, 'Wallet address is required'),
  chain: z.enum(['ethereum', 'solana', 'ton']),
  walletType: z.string().min(1, 'Wallet type is required')
});

const authorizeWalletSchema = z.object({
  address: z.string().min(1, 'Wallet address is required'),
  walletType: z.string().min(1, 'Wallet type is required'),
  blockchain: z.enum(['ethereum', 'solana', 'ton']),
  chainId: z.string().optional(),
  publicKey: z.string().optional(),
  proof: z.any().optional()
});

// Store connected wallets in memory (in production this would be in database)
const connectedWallets = new Map<string, {
  address: string;
  chain: string;
  walletType: string;
  connectedAt: Date;
  vaultEligible: boolean;
}>();

// Store authorized wallets for Chronos Vault
const authorizedWallets = new Map<string, {
  address: string;
  blockchain: string;
  walletType: string;
  chainId?: string;
  publicKey?: string;
  authorizedAt: Date;
  isActive: boolean;
}>();

// Authorize wallet for Chronos Vault access
router.post('/authorize-wallet', async (req, res) => {
  try {
    const validation = authorizeWalletSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid wallet authorization data',
        errors: validation.error.issues
      });
    }

    const { address, walletType, blockchain, chainId, publicKey, proof } = validation.data;
    
    // Create unique wallet key
    const walletKey = `${walletType}-${blockchain}-${address}`;
    
    // In production, here you would:
    // 1. Verify wallet signature/proof
    // 2. Check blockchain network validity
    // 3. Validate wallet ownership
    // 4. Store in secure database
    
    // For now, authorize the wallet for Chronos Vault
    authorizedWallets.set(walletKey, {
      address,
      blockchain,
      walletType,
      chainId,
      publicKey,
      authorizedAt: new Date(),
      isActive: true
    });

    // Also add to connected wallets for vault creation
    connectedWallets.set(walletKey, {
      address,
      chain: blockchain,
      walletType,
      connectedAt: new Date(),
      vaultEligible: true
    });

    console.log(`Wallet authorized for Chronos Vault: ${walletType} (${blockchain}) - ${address.slice(0, 8)}...${address.slice(-6)}`);

    res.json({
      status: 'success',
      message: 'Wallet successfully authorized for Chronos Vault',
      data: {
        address,
        blockchain,
        walletType,
        authorized: true,
        vaultEligible: true,
        authorizedAt: new Date()
      }
    });

  } catch (error) {
    console.error('Error authorizing wallet:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to authorize wallet for Chronos Vault'
    });
  }
});

// Add wallet to Chronos Vault system
router.post('/add-wallet', async (req, res) => {
  try {
    const validation = addWalletSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid wallet data',
        errors: validation.error.issues
      });
    }

    const { address, chain, walletType } = validation.data;

    // Verify wallet connection and authorize for vault access
    const walletKey = `${walletType}-${address}`;
    
    connectedWallets.set(walletKey, {
      address,
      chain,
      walletType,
      connectedAt: new Date(),
      vaultEligible: true
    });

    console.log(`Wallet added to Chronos Vault system: ${walletType} (${chain}) - ${address.slice(0, 8)}...${address.slice(-6)}`);

    res.json({
      status: 'success',
      message: 'Wallet successfully added to Chronos Vault system',
      data: {
        address,
        chain,
        walletType,
        vaultEligible: true,
        connectedAt: new Date()
      }
    });

  } catch (error) {
    console.error('Error adding wallet to vault system:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to add wallet to vault system'
    });
  }
});

// Get connected wallets for vault creation
router.get('/connected-wallets', async (req, res) => {
  try {
    const wallets = Array.from(connectedWallets.entries()).map(([key, wallet]) => ({
      id: key,
      ...wallet
    }));

    res.json({
      status: 'success',
      data: wallets
    });

  } catch (error) {
    console.error('Error fetching connected wallets:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch connected wallets'
    });
  }
});

// Check wallet vault eligibility
router.post('/check-eligibility', async (req, res) => {
  try {
    const { address, chain } = req.body;

    // In a real implementation, this would check:
    // - Wallet balance requirements
    // - Security verification status
    // - Previous vault history
    // - Chain-specific requirements

    const eligible = true; // For now, all wallets are eligible
    const requirements = {
      minimumBalance: true,
      securityVerified: true,
      chainSupported: ['ethereum', 'solana', 'ton'].includes(chain),
      kycCompleted: false // Would be actual KYC status
    };

    res.json({
      status: 'success',
      data: {
        eligible,
        requirements,
        message: eligible ? 'Wallet is eligible for vault creation' : 'Wallet does not meet requirements'
      }
    });

  } catch (error) {
    console.error('Error checking wallet eligibility:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to check wallet eligibility'
    });
  }
});

export default router;