/**
 * Gift Vaults API Routes
 * Handles creation, retrieval, and claiming of crypto gift vaults
 */

import { Router, Request, Response } from 'express';
import { storage } from '../storage';
import { z } from 'zod';
import { insertVaultSchema, insertBeneficiarySchema, insertAttachmentSchema } from '@shared/schema';

const router = Router();

// Gift vault creation schema with occasion support
const createGiftVaultSchema = z.object({
  senderWallet: z.string().min(1, 'Sender wallet required'),
  recipientWallet: z.string().min(1, 'Recipient wallet required'),
  recipientName: z.string().optional(),
  recipientEmail: z.string().email().optional(),
  recoveryWalletAddress: z.string().optional(), // Recovery/fallback wallet
  
  // Gift assets
  assetType: z.enum(['ETH', 'SOL', 'TON', 'USDC', 'USDT', 'CVT', 'ARB']),
  assetAmount: z.string().min(1, 'Amount required'),
  network: z.string().optional(), // For USDC/USDT network selection
  
  // Gift details
  occasion: z.enum(['birthday', 'holiday', 'anniversary', 'wedding', 'graduation', 'thank_you', 'custom']),
  customOccasion: z.string().optional(),
  giftMessage: z.string().max(500).optional(),
  
  // Time-lock settings
  unlockDate: z.string().optional(),
  timeLockDays: z.number().min(0).optional(),
  
  // Security & customization
  securityLevel: z.enum(['standard', 'premium', 'military']).default('standard'),
  visualTheme: z.enum(['elegant', 'luxury', 'minimalist', 'futuristic', 'birthday', 'holiday']).default('elegant'),
  crossChainEnabled: z.boolean().default(false),
  privacyEnabled: z.boolean().default(false),
  primaryChain: z.enum(['ethereum', 'solana', 'ton']).default('ethereum'),
  
  // Attachments metadata (files uploaded separately)
  attachmentIds: z.array(z.number()).optional(),
});

type CreateGiftVaultInput = z.infer<typeof createGiftVaultSchema>;

/**
 * POST /api/gift-vaults
 * Create a new gift vault
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const input = createGiftVaultSchema.parse(req.body);
    
    // Calculate unlock date
    const unlockDate = input.unlockDate 
      ? new Date(input.unlockDate)
      : new Date(Date.now() + (input.timeLockDays || 30) * 24 * 60 * 60 * 1000);
    
    // Determine security level number
    const securityLevelMap = { standard: 1, premium: 2, military: 3 };
    const securityLevel = securityLevelMap[input.securityLevel];
    
    // Create vault metadata with gift-specific info
    const vaultMetadata = {
      giftType: 'gift_vault',
      occasion: input.occasion,
      customOccasion: input.customOccasion,
      giftMessage: input.giftMessage,
      visualTheme: input.visualTheme,
      senderWallet: input.senderWallet,
      recipientEmail: input.recipientEmail,
      recipientName: input.recipientName,
      recoveryWalletAddress: input.recoveryWalletAddress,
      network: input.network,
      createdAt: new Date().toISOString(),
      claimed: false,
      claimedAt: null,
      notificationSent: false,
    };
    
    // Create the vault
    const vault = await storage.createVault({
      userId: 1, // Gift vaults don't require user accounts
      name: `${input.occasion === 'custom' ? input.customOccasion : input.occasion} Gift for ${input.recipientName || input.recipientWallet.slice(0, 8)}`,
      description: input.giftMessage || `A ${input.assetType} gift vault`,
      vaultType: 'gift',
      assetType: input.assetType,
      assetAmount: input.assetAmount,
      timeLockPeriod: input.timeLockDays || 30,
      unlockDate,
      metadata: vaultMetadata,
      primaryChain: input.primaryChain,
      securityLevel,
      crossChainEnabled: input.crossChainEnabled,
      privacyEnabled: input.privacyEnabled,
    });
    
    // Add recipient as beneficiary
    if (vault && vault.id) {
      await storage.createBeneficiary({
        vaultId: vault.id,
        name: input.recipientName || 'Gift Recipient',
        walletAddress: input.recipientWallet,
        share: 100, // Recipient gets 100% of the gift
      });
      
      // Link existing attachments to vault if provided
      if (input.attachmentIds && input.attachmentIds.length > 0) {
        for (const attachmentId of input.attachmentIds) {
          try {
            // Update attachment to link to this vault
            await storage.updateAttachment(attachmentId, { vaultId: vault.id });
          } catch (err) {
            console.error(`Failed to link attachment ${attachmentId} to vault:`, err);
          }
        }
      }
    }
    
    // Generate a unique claim code for the gift
    const claimCode = generateClaimCode(vault.id!);
    
    res.json({
      success: true,
      vault,
      claimCode,
      claimUrl: `${process.env.BASE_URL || 'https://chronos-vault.repl.co'}/gift-claim/${claimCode}`,
      message: 'Gift vault created successfully!',
    });
  } catch (error: any) {
    console.error('Error creating gift vault:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      });
    }
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create gift vault',
    });
  }
});

/**
 * GET /api/gift-vaults/by-recipient/:walletAddress
 * Get all gift vaults for a recipient
 */
router.get('/by-recipient/:walletAddress', async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.params;
    
    // Get all vaults and filter by beneficiary wallet address
    const allVaults = await storage.getAllVaults();
    const giftVaults = [];
    
    for (const vault of allVaults) {
      if (vault.vaultType === 'gift') {
        const beneficiaries = await storage.getBeneficiariesByVault(vault.id!);
        const isRecipient = beneficiaries.some((b: any) => 
          b.walletAddress.toLowerCase() === walletAddress.toLowerCase()
        );
        
        if (isRecipient) {
          const attachments = await storage.getAttachmentsByVault(vault.id!);
          giftVaults.push({
            ...vault,
            attachments,
            beneficiaries,
          });
        }
      }
    }
    
    res.json({
      success: true,
      vaults: giftVaults,
      count: giftVaults.length,
    });
  } catch (error: any) {
    console.error('Error fetching recipient gift vaults:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch gift vaults',
    });
  }
});

/**
 * GET /api/gift-vaults/claim/:claimCode
 * Get gift vault details by claim code
 */
router.get('/claim/:claimCode', async (req: Request, res: Response) => {
  try {
    const { claimCode } = req.params;
    const vaultId = decodeClaimCode(claimCode);
    
    if (!vaultId) {
      return res.status(404).json({
        success: false,
        error: 'Invalid claim code',
      });
    }
    
    const vault = await storage.getVault(vaultId);
    
    if (!vault || vault.vaultType !== 'gift') {
      return res.status(404).json({
        success: false,
        error: 'Gift vault not found',
      });
    }
    
    // Get attachments and beneficiaries
    const attachments = await storage.getAttachmentsByVault(vaultId);
    const beneficiaries = await storage.getBeneficiariesByVault(vaultId);
    
    res.json({
      success: true,
      vault: {
        ...vault,
        attachments,
        beneficiaries,
        metadata: vault.metadata || {},
      },
    });
  } catch (error: any) {
    console.error('Error fetching gift vault by claim code:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch gift vault',
    });
  }
});

/**
 * POST /api/gift-vaults/claim/:claimCode
 * Claim a gift vault
 */
router.post('/claim/:claimCode', async (req: Request, res: Response) => {
  try {
    const { claimCode } = req.params;
    const { walletAddress } = req.body;
    
    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        error: 'Wallet address required',
      });
    }
    
    const vaultId = decodeClaimCode(claimCode);
    
    if (!vaultId) {
      return res.status(404).json({
        success: false,
        error: 'Invalid claim code',
      });
    }
    
    const vault = await storage.getVault(vaultId);
    
    if (!vault || vault.vaultType !== 'gift') {
      return res.status(404).json({
        success: false,
        error: 'Gift vault not found',
      });
    }
    
    // Check if already claimed
    const metadata = vault.metadata as any;
    if (metadata?.claimed) {
      return res.status(400).json({
        success: false,
        error: 'Gift already claimed',
        claimedAt: metadata.claimedAt,
      });
    }
    
    // Verify the claiming wallet matches the recipient
    const beneficiaries = await storage.getBeneficiariesByVault(vaultId);
    const isRecipient = beneficiaries.some((b: any) => 
      b.walletAddress.toLowerCase() === walletAddress.toLowerCase()
    );
    
    if (!isRecipient) {
      return res.status(403).json({
        success: false,
        error: 'This gift is not intended for your wallet address',
      });
    }
    
    // Check if vault is unlocked
    if (vault.isLocked && new Date(vault.unlockDate) > new Date()) {
      return res.status(400).json({
        success: false,
        error: 'Gift vault is still time-locked',
        unlockDate: vault.unlockDate,
      });
    }
    
    // Mark as claimed
    const updatedMetadata = {
      ...metadata,
      claimed: true,
      claimedAt: new Date().toISOString(),
      claimedBy: walletAddress,
    };
    
    // Update vault status to claimed and unlock it
    const updatedVault = await storage.updateVault(vaultId, {
      metadata: updatedMetadata,
      isLocked: false,
      vaultStatus: 'claimed',
    });
    
    // Get attachments
    const attachments = await storage.getAttachmentsByVault(vaultId);
    
    res.json({
      success: true,
      message: 'Gift claimed successfully!',
      vault: {
        ...updatedVault,
        metadata: updatedMetadata,
        isLocked: false,
        attachments,
        beneficiaries,
      },
      claimCode,
      transactionDetails: {
        amount: vault.assetAmount,
        assetType: vault.assetType,
        claimedAt: new Date().toISOString(),
        recipientAddress: walletAddress,
      },
    });
  } catch (error: any) {
    console.error('Error claiming gift vault:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to claim gift vault',
    });
  }
});

/**
 * GET /api/gift-vaults/stats
 * Get overall gift vault statistics
 */
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const allVaults = await storage.getAllVaults();
    const giftVaults = allVaults.filter(v => v.vaultType === 'gift');
    
    const claimed = giftVaults.filter(v => {
      const metadata = v.metadata as any;
      return metadata?.claimed === true;
    }).length;
    
    const unclaimed = giftVaults.length - claimed;
    
    // Calculate total value (simplified - would need price feeds in production)
    const totalValueByAsset = giftVaults.reduce((acc, v) => {
      acc[v.assetType] = (acc[v.assetType] || 0) + parseFloat(v.assetAmount);
      return acc;
    }, {} as Record<string, number>);
    
    res.json({
      success: true,
      stats: {
        totalGiftVaults: giftVaults.length,
        claimedGifts: claimed,
        unclaimedGifts: unclaimed,
        totalValueByAsset,
      },
    });
  } catch (error: any) {
    console.error('Error fetching gift vault stats:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch stats',
    });
  }
});

// Helper function to generate claim code
function generateClaimCode(vaultId: number): string {
  // Simple encoding: base64(vaultId + timestamp + random)
  const data = `${vaultId}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  return Buffer.from(data).toString('base64').replace(/=/g, '').substring(0, 16).toUpperCase();
}

// Helper function to decode claim code
function decodeClaimCode(claimCode: string): number | null {
  try {
    const decoded = Buffer.from(claimCode, 'base64').toString('utf-8');
    const vaultId = parseInt(decoded.split('-')[0]);
    return isNaN(vaultId) ? null : vaultId;
  } catch {
    return null;
  }
}

export default router;
