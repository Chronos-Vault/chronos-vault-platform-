/**
 * Security API Routes
 * 
 * Provides endpoints for security monitoring, status, and cross-chain verification
 */

import { Router, Request, Response } from 'express';
import { crossChainFailover } from '../security/cross-chain-failover-mechanism';
import { BlockchainType, SecurityLevel, RecoveryStrategy } from '../../shared/types';
import { securityLogger, SecurityEventType } from '../monitoring/security-logger';
import config from '../config';

const router = Router();

// Get overall security status for dashboard
router.get('/status', async (req: Request, res: Response) => {
  try {
    // Get chain health status from failover mechanism
    const chainStatuses = await crossChainFailover.checkAllChainsHealth();
    const primaryChain = crossChainFailover.getPrimaryChain();
    
    // For demo/development purposes, we'll simulate some data
    // In production, this would come from actual monitoring
    const securityLevel = SecurityLevel.ADVANCED;
    
    // Simulate active failovers for any unavailable chains
    const activeFailovers: any[] = [];
    Object.entries(chainStatuses).forEach(([chain, status]) => {
      if (!status.isAvailable && chain === primaryChain) {
        // If primary chain is down, add a failover
        const fallbackChain = crossChainFailover.findBestFallbackChain(
          chain as BlockchainType, 
          [chain as BlockchainType]
        );
        
        if (fallbackChain) {
          activeFailovers.push({
            vaultId: `vault-${Date.now().toString().substring(7)}`,
            primaryChain: chain,
            fallbackChain,
            strategy: RecoveryStrategy.SWITCH_PRIMARY,
            reason: `${chain} chain is unavailable`,
            timestamp: Date.now() - Math.floor(Math.random() * 300000)
          });
        }
      }
    });
    
    // Simulate cross-chain sync status
    const syncPercentage = Math.min(100, 85 + Math.floor(Math.random() * 15));
    const crossChainSyncStatus = {
      isSynced: syncPercentage > 95,
      syncPercentage,
      lastSyncTime: Date.now() - Math.floor(Math.random() * 300000)
    };
    
    // Get any recent security events as alerts
    // In a real app, these would come from a security event log
    const securityAlerts = generateSecurityAlerts();
    
    // Combine all data into a single response
    const securityStatus = {
      chainStatuses,
      primaryChain,
      securityLevel,
      crossChainSyncStatus,
      activeFailovers,
      securityAlerts
    };
    
    securityLogger.info(
      'Security status requested', 
      SecurityEventType.MONITORING, 
      { timestamp: Date.now() }
    );
    
    res.status(200).json(securityStatus);
  } catch (error) {
    securityLogger.error(
      'Failed to get security status', 
      SecurityEventType.SYSTEM_ERROR, 
      { error }
    );
    res.status(500).json({ error: 'Failed to get security status' });
  }
});

// Get chain health status
router.get('/chain-health', async (req: Request, res: Response) => {
  try {
    const chainStatuses = await crossChainFailover.checkAllChainsHealth();
    res.status(200).json(chainStatuses);
  } catch (error) {
    securityLogger.error(
      'Failed to get chain health status', 
      SecurityEventType.SYSTEM_ERROR, 
      { error }
    );
    res.status(500).json({ error: 'Failed to get chain health status' });
  }
});

// Initiate failover for a specific vault
router.post('/initiate-failover', async (req: Request, res: Response) => {
  try {
    const { vaultId, primaryChain, securityLevel } = req.body;
    
    if (!vaultId || !primaryChain) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    const result = await crossChainFailover.executeFailover(
      vaultId,
      primaryChain as BlockchainType,
      {
        securityLevel: securityLevel || SecurityLevel.ADVANCED
      }
    );
    
    securityLogger.info(
      `Failover initiated for vault ${vaultId}`, 
      SecurityEventType.CROSS_CHAIN_VERIFICATION, 
      { vaultId, primaryChain, result }
    );
    
    res.status(200).json(result);
  } catch (error) {
    securityLogger.error(
      'Failed to initiate failover', 
      SecurityEventType.SYSTEM_ERROR, 
      { error }
    );
    res.status(500).json({ error: 'Failed to initiate failover' });
  }
});

// Helper function to generate simulated security alerts
function generateSecurityAlerts() {
  // In development mode, simulate random alerts
  if (config.isDevelopmentMode) {
    const alerts = [];
    const severities = ['low', 'medium', 'high', 'critical'];
    const messages = [
      'Unusual transaction pattern detected',
      'Delayed cross-chain verification',
      'Multiple failed verification attempts',
      'Potential cross-chain consensus conflict',
      'Bridge operation timeout'
    ];
    
    // Generate 0-3 random alerts
    const numAlerts = Math.floor(Math.random() * 4);
    for (let i = 0; i < numAlerts; i++) {
      alerts.push({
        id: `alert-${Date.now() + i}`,
        severity: severities[Math.floor(Math.random() * severities.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
        timestamp: Date.now() - Math.floor(Math.random() * 86400000),
        resolved: Math.random() > 0.8 // 20% chance of being resolved
      });
    }
    
    return alerts;
  }
  
  // In production, we would retrieve actual security alerts from a database or security event log
  return [];
}

export default router;