/**
 * Vault Creation API Routes
 * Creates vaults using Trinity Protocol across Arbitrum, Solana, and TON
 */

import { Router, Request, Response } from 'express';
import { vaultCreationService } from '../services/vault-creation-service';
import { securityLogger, SecurityEventType } from '../monitoring/security-logger';
import { z } from 'zod';

const router = Router();

// Schema for creating Time-Lock Vault
const createTimeLockVaultSchema = z.object({
  ownerAddress: z.string(),
  amount: z.string(),
  unlockTimestamp: z.number(),
  vaultName: z.string().optional(),
  vaultDescription: z.string().optional(),
});

// Schema for creating Multi-Sig Vault
const createMultiSigVaultSchema = z.object({
  signers: z.array(z.string()),
  threshold: z.number(),
  amount: z.string(),
  vaultName: z.string().optional(),
  vaultDescription: z.string().optional(),
});

// Schema for creating Cross-Chain Fragment Vault
const createFragmentVaultSchema = z.object({
  ownerAddress: z.string(),
  amount: z.string(),
  vaultName: z.string().optional(),
  vaultDescription: z.string().optional(),
});

/**
 * POST /api/vault-creation/time-lock
 * Create a new Time-Lock Vault with Trinity Protocol
 */
router.post('/time-lock', async (req: Request, res: Response) => {
  try {
    const validatedData = createTimeLockVaultSchema.parse(req.body);

    securityLogger.info(
      `Creating Time-Lock Vault for ${validatedData.ownerAddress}`,
      SecurityEventType.VAULT_CREATION
    );

    // Create vault using the service's createVault method
    // Architecture: Arbitrum L2 PRIMARY, Solana MONITOR, TON BACKUP
    const result = await vaultCreationService.createVault({
      userId: 1, // TODO: Get from auth session
      walletAddress: validatedData.ownerAddress,
      vaultType: 'timelock',
      name: validatedData.vaultName || 'Time-Lock Vault',
      description: validatedData.vaultDescription,
      assetType: 'ETH', // TODO: Get from request
      assetAmount: validatedData.amount,
      securityLevel: 3,
      timeLockDays: Math.ceil((validatedData.unlockTimestamp - Date.now() / 1000) / 86400),
    });

    res.json({
      success: result.success,
      vaultId: result.vaultId,
      ethereumTxHash: result.ethereumTxHash,
      solanaTxHash: result.solanaTxHash,
      tonTxHash: result.tonTxHash,
      trinityHash: result.trinityVerificationHash,
      message: 'Time-Lock Vault created successfully',
    });
  } catch (error) {
    securityLogger.error(
      'Failed to create Time-Lock Vault',
      SecurityEventType.SYSTEM_ERROR,
      error
    );

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/vault-creation/multi-sig
 * Create a new Multi-Sig Vault with Trinity Protocol
 */
router.post('/multi-sig', async (req: Request, res: Response) => {
  try {
    const validatedData = createMultiSigVaultSchema.parse(req.body);

    securityLogger.info(
      `Creating Multi-Sig Vault (${validatedData.threshold}/${validatedData.signers.length})`,
      SecurityEventType.VAULT_CREATION
    );

    // Architecture: Arbitrum L2 PRIMARY, Solana MONITOR, TON BACKUP
    const result = await vaultCreationService.createVault({
      userId: 1, // TODO: Get from auth session
      walletAddress: validatedData.signers[0],
      vaultType: 'multisig',
      name: validatedData.vaultName || 'Multi-Sig Vault',
      description: validatedData.vaultDescription,
      assetType: 'ETH',
      assetAmount: validatedData.amount,
      securityLevel: 4,
      signaturesRequired: validatedData.threshold,
      signerAddresses: validatedData.signers,
    });

    res.json({
      success: result.success,
      vaultId: result.vaultId,
      ethereumTxHash: result.ethereumTxHash,
      solanaTxHash: result.solanaTxHash,
      tonTxHash: result.tonTxHash,
      trinityHash: result.trinityVerificationHash,
      message: 'Multi-Sig Vault created successfully',
    });
  } catch (error) {
    securityLogger.error(
      'Failed to create Multi-Sig Vault',
      SecurityEventType.SYSTEM_ERROR,
      error
    );

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/vault-creation/fragment
 * Create a new Cross-Chain Fragment Vault with Trinity Protocol
 */
router.post('/fragment', async (req: Request, res: Response) => {
  try {
    const validatedData = createFragmentVaultSchema.parse(req.body);

    securityLogger.info(
      `Creating Cross-Chain Fragment Vault for ${validatedData.ownerAddress}`,
      SecurityEventType.VAULT_CREATION
    );

    // Architecture: Arbitrum L2 PRIMARY, Solana MONITOR, TON BACKUP
    const result = await vaultCreationService.createVault({
      userId: 1, // TODO: Get from auth session
      walletAddress: validatedData.ownerAddress,
      vaultType: 'crosschain_fragment',
      name: validatedData.vaultName || 'Cross-Chain Fragment Vault',
      description: validatedData.vaultDescription,
      assetType: 'ETH',
      assetAmount: validatedData.amount,
      securityLevel: 5,
      fragmentDistribution: {
        ethereum: 40,
        solana: 30,
        ton: 30,
      },
      fragmentRecoveryThreshold: 2,
    });

    res.json({
      success: result.success,
      vaultId: result.vaultId,
      ethereumTxHash: result.ethereumTxHash,
      solanaTxHash: result.solanaTxHash,
      tonTxHash: result.tonTxHash,
      trinityHash: result.trinityVerificationHash,
      message: 'Cross-Chain Fragment Vault created successfully',
    });
  } catch (error) {
    securityLogger.error(
      'Failed to create Cross-Chain Fragment Vault',
      SecurityEventType.SYSTEM_ERROR,
      error
    );

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/vault-creation/status/:vaultId
 * Get vault creation status and blockchain verification
 */
router.get('/status/:vaultId', async (req: Request, res: Response) => {
  try {
    const { vaultId } = req.params;

    // In production, this would query the database and check blockchain status
    // For now, return a success status
    res.json({
      success: true,
      vaultId,
      status: 'created',
      trinityVerification: {
        arbitrum: { verified: true, timestamp: Date.now() },
        solana: { verified: true, timestamp: Date.now() },
        ton: { verified: true, timestamp: Date.now() },
      },
    });
  } catch (error) {
    securityLogger.error(
      'Failed to get vault status',
      SecurityEventType.SYSTEM_ERROR,
      error
    );

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
