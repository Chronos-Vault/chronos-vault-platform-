import { Router } from 'express';
import { vaultChainService } from '../services/vault-chain-service';

const router = Router();

router.post('/plan', async (req, res) => {
  try {
    const { primaryChain, vaultType, assetAmount, assetType, securityLevel } = req.body;

    if (!primaryChain || !['ethereum', 'solana', 'ton'].includes(primaryChain)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid primary chain. Must be ethereum, solana, or ton'
      });
    }

    const plan = await vaultChainService.createVaultPlan({
      primaryChain,
      vaultType: vaultType || 'standard',
      assetAmount: assetAmount || '0',
      assetType: assetType || 'ETH',
      securityLevel: securityLevel || 3
    });

    res.json({
      success: true,
      data: plan,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Error creating vault plan:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create vault plan',
      message: error.message
    });
  }
});

router.post('/validate', async (req, res) => {
  try {
    const { primaryChain, userBalance } = req.body;

    if (!primaryChain || !['ethereum', 'solana', 'ton'].includes(primaryChain)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid primary chain'
      });
    }

    const validation = await vaultChainService.validateChainSelection(
      primaryChain,
      userBalance
    );

    res.json({
      success: true,
      data: validation,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Error validating chain selection:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate chain selection',
      message: error.message
    });
  }
});

router.get('/recommend', async (req, res) => {
  try {
    const preferences = {
      preferSpeed: req.query.preferSpeed === 'true',
      preferCost: req.query.preferCost === 'true',
      preferSecurity: req.query.preferSecurity === 'true'
    };

    const recommendation = await vaultChainService.getRecommendedChain(preferences);

    res.json({
      success: true,
      data: recommendation,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Error getting chain recommendation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get chain recommendation',
      message: error.message
    });
  }
});

router.get('/info/:chain', async (req, res) => {
  try {
    const chain = req.params.chain as 'ethereum' | 'solana' | 'ton';

    if (!['ethereum', 'solana', 'ton'].includes(chain)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid chain. Must be ethereum, solana, or ton'
      });
    }

    const info = vaultChainService.formatChainInfo(chain);

    res.json({
      success: true,
      data: info,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Error getting chain info:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get chain info',
      message: error.message
    });
  }
});

export default router;
