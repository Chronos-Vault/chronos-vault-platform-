/**
 * Progressive Quantum Vault API Routes
 * 
 * Endpoints for managing progressively strengthening quantum-resistant vaults
 */

import { Router, Request, Response } from 'express';
import { getProgressiveQuantumShield } from '../security/progressive-quantum-shield';

const router = Router();

// Initialize the progressive quantum shield service
const progressiveQuantumShield = getProgressiveQuantumShield();

/**
 * Initialize quantum security for a vault
 * POST /api/security/progressive-quantum/initialize
 */
router.post('/initialize', async (req: Request, res: Response) => {
  try {
    const { vaultId, vaultValue } = req.body;
    
    if (!vaultId || typeof vaultValue !== 'number') {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'vaultId and vaultValue are required'
      });
    }
    
    const metrics = progressiveQuantumShield.initializeVaultSecurity(vaultId, vaultValue);
    
    res.json({
      success: true,
      vaultId,
      securityTier: metrics.currentTier,
      securityStrength: metrics.securityStrength,
      metrics
    });
  } catch (error) {
    console.error('Error initializing quantum security:', error);
    res.status(500).json({
      error: 'Failed to initialize quantum security',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Update vault value and adjust security accordingly
 * POST /api/security/progressive-quantum/update-value
 */
router.post('/update-value', async (req: Request, res: Response) => {
  try {
    const { vaultId, newValue } = req.body;
    
    if (!vaultId || typeof newValue !== 'number') {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'vaultId and newValue are required'
      });
    }
    
    const metrics = progressiveQuantumShield.updateVaultValue(vaultId, newValue);
    
    res.json({
      success: true,
      vaultId,
      securityTier: metrics.currentTier,
      securityStrength: metrics.securityStrength,
      valueThresholdTriggered: metrics.lastUpgrade ? 
        metrics.lastUpgrade.getTime() > Date.now() - 60000 : false,
      metrics
    });
  } catch (error) {
    console.error('Error updating vault value:', error);
    res.status(500).json({
      error: 'Failed to update vault value',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Manually upgrade vault security tier
 * POST /api/security/progressive-quantum/upgrade
 */
router.post('/upgrade', async (req: Request, res: Response) => {
  try {
    const { vaultId, targetTierId } = req.body;
    
    if (!vaultId || !targetTierId) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'vaultId and targetTierId are required'
      });
    }
    
    const metrics = progressiveQuantumShield.upgradeSecurityTier(vaultId, targetTierId);
    
    res.json({
      success: true,
      vaultId,
      securityTier: metrics.currentTier,
      securityStrength: metrics.securityStrength,
      metrics
    });
  } catch (error) {
    console.error('Error upgrading vault security:', error);
    res.status(500).json({
      error: 'Failed to upgrade vault security',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get vault security metrics
 * GET /api/security/progressive-quantum/metrics/:vaultId
 */
router.get('/metrics/:vaultId', (req: Request, res: Response) => {
  try {
    const { vaultId } = req.params;
    
    if (!vaultId) {
      return res.status(400).json({
        error: 'Missing required parameter',
        message: 'vaultId is required'
      });
    }
    
    const metrics = progressiveQuantumShield.getVaultSecurityMetrics(vaultId);
    
    if (!metrics) {
      return res.status(404).json({
        error: 'Vault not found',
        message: `No security metrics found for vault ${vaultId}`
      });
    }
    
    res.json({
      success: true,
      vaultId,
      metrics
    });
  } catch (error) {
    console.error('Error getting vault security metrics:', error);
    res.status(500).json({
      error: 'Failed to get vault security metrics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Force refresh security levels for all vaults
 * POST /api/security/progressive-quantum/refresh
 */
router.post('/refresh', (req: Request, res: Response) => {
  try {
    progressiveQuantumShield.refreshSecurityLevels();
    
    res.json({
      success: true,
      message: 'Security levels refreshed successfully'
    });
  } catch (error) {
    console.error('Error refreshing security levels:', error);
    res.status(500).json({
      error: 'Failed to refresh security levels',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Encrypt data for a specific vault using appropriate quantum-resistant algorithm
 * POST /api/security/progressive-quantum/encrypt
 */
router.post('/encrypt', async (req: Request, res: Response) => {
  try {
    const { vaultId, data } = req.body;
    
    if (!vaultId || !data) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'vaultId and data are required'
      });
    }
    
    const encryptedData = await progressiveQuantumShield.encryptForVault(
      vaultId, 
      typeof data === 'string' ? data : JSON.stringify(data)
    );
    
    res.json({
      success: true,
      vaultId,
      encryptedData,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Error encrypting data for vault:', error);
    res.status(500).json({
      error: 'Failed to encrypt data for vault',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;