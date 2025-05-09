/**
 * Multi-Chain State Synchronization API Routes
 * 
 * This file provides API endpoints for the multi-chain state synchronization
 * system, including state Merkle trees, time-weighted validation, and
 * automated recovery protocols.
 */

import { Router, Request, Response } from 'express';
import { securityLogger } from '../monitoring/security-logger';
import { stateMerkleTreeService } from '../security/state-merkle-tree';
import { timeWeightedValidation } from '../security/time-weighted-validation';
import { createAutomatedRecoveryProtocol } from '../security/automated-recovery-protocol';
import { ConnectorFactory } from '../blockchain/connector-factory';
import { BlockchainType } from '../../shared/types';

// Create router
const router = Router();

// Initialize recovery protocol with the connector factory
let automatedRecoveryProtocol: ReturnType<typeof createAutomatedRecoveryProtocol>;

// Initialize the recovery protocol
export function initializeMultiChainSync(connectorFactory: ConnectorFactory) {
  automatedRecoveryProtocol = createAutomatedRecoveryProtocol(connectorFactory);
  
  // Set up event handlers
  automatedRecoveryProtocol.on('recovery:started', (vaultId, primaryChain, fallbackChain) => {
    securityLogger.info(`Recovery started: ${vaultId} from ${primaryChain} to ${fallbackChain}`);
  });
  
  automatedRecoveryProtocol.on('recovery:completed', (vaultId, result) => {
    securityLogger.info(`Recovery completed: ${vaultId} success=${result.recoverySteps.slice(-1)[0].success}`);
  });
  
  automatedRecoveryProtocol.on('recovery:failed', (vaultId, error) => {
    securityLogger.error(`Recovery failed: ${vaultId} error=${error.message}`);
  });
  
  automatedRecoveryProtocol.on('chain:degraded', (chain, status) => {
    securityLogger.warn(`Chain degraded: ${chain} errors=${status.errorCount}`);
  });
  
  automatedRecoveryProtocol.on('chain:restored', (chain, status) => {
    securityLogger.info(`Chain restored: ${chain}`);
  });
  
  return automatedRecoveryProtocol;
}

// Get service status
router.get('/status', (_req: Request, res: Response) => {
  try {
    const status = {
      services: {
        stateMerkleTree: 'operational',
        timeWeightedValidation: 'operational',
        automatedRecoveryProtocol: 'operational'
      },
      chainHealth: automatedRecoveryProtocol.getAllChainHealthStatus(),
      activeRecoveries: 0
    };
    
    res.json({
      success: true,
      status
    });
  } catch (error) {
    securityLogger.error('Error getting multi-chain sync status:', error);
    
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Create or update a state snapshot
router.post('/state/snapshot/:vaultId', async (req: Request, res: Response) => {
  try {
    const { vaultId } = req.params;
    const { chainStates } = req.body;
    
    if (!vaultId || !chainStates) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters'
      });
    }
    
    // Create state leaves for each chain
    const stateLeaves = {};
    
    for (const chain of Object.keys(chainStates)) {
      if (!['ETH', 'SOL', 'TON', 'BTC'].includes(chain)) {
        return res.status(400).json({
          success: false,
          error: `Invalid chain: ${chain}. Valid options are: ETH, SOL, TON, BTC`
        });
      }
      
      const state = chainStates[chain];
      
      stateLeaves[chain] = stateMerkleTreeService.createStateLeaf(
        vaultId,
        chain as BlockchainType,
        state,
        Date.now(),
        state.blockHeight,
        state.transactionId,
        state.metadata
      );
    }
    
    // Create or update the snapshot
    const snapshot = stateMerkleTreeService.updateVaultStateSnapshot(vaultId, stateLeaves as any);
    
    res.json({
      success: true,
      snapshot: {
        vaultId: snapshot.vaultId,
        rootHash: snapshot.rootHash,
        timestamp: snapshot.timestamp,
        chains: Object.keys(snapshot.chainStates)
      }
    });
  } catch (error) {
    securityLogger.error('Error creating state snapshot:', error);
    
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get a state snapshot
router.get('/state/snapshot/:vaultId', (req: Request, res: Response) => {
  try {
    const { vaultId } = req.params;
    
    const snapshot = stateMerkleTreeService.getVaultStateSnapshot(vaultId);
    
    if (!snapshot) {
      return res.status(404).json({
        success: false,
        error: 'Snapshot not found'
      });
    }
    
    res.json({
      success: true,
      snapshot: {
        vaultId: snapshot.vaultId,
        rootHash: snapshot.rootHash,
        timestamp: snapshot.timestamp,
        chains: Object.keys(snapshot.chainStates)
      }
    });
  } catch (error) {
    securityLogger.error('Error getting state snapshot:', error);
    
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Initiate time-weighted validation
router.post('/validation/initiate/:vaultId', (req: Request, res: Response) => {
  try {
    const { vaultId } = req.params;
    const { value, primaryChain, merkleRoot } = req.body;
    
    if (!vaultId || !value || !primaryChain) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters'
      });
    }
    
    // Validate the chain
    if (!['ETH', 'SOL', 'TON', 'BTC'].includes(primaryChain)) {
      return res.status(400).json({
        success: false,
        error: `Invalid chain: ${primaryChain}. Valid options are: ETH, SOL, TON, BTC`
      });
    }
    
    // Initiate validation
    const validationResult = timeWeightedValidation.initiateValidation({
      vaultId,
      value: parseFloat(value),
      primaryChain: primaryChain as BlockchainType,
      requestTimestamp: Date.now(),
      merkleRoot,
      requestMetadata: req.body.metadata
    });
    
    res.json({
      success: true,
      validation: validationResult
    });
  } catch (error) {
    securityLogger.error('Error initiating validation:', error);
    
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Add a validation confirmation
router.post('/validation/confirm/:vaultId', (req: Request, res: Response) => {
  try {
    const { vaultId } = req.params;
    const { chain, blockHeight, transactionId } = req.body;
    
    if (!vaultId || !chain) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters'
      });
    }
    
    // Validate the chain
    if (!['ETH', 'SOL', 'TON', 'BTC'].includes(chain)) {
      return res.status(400).json({
        success: false,
        error: `Invalid chain: ${chain}. Valid options are: ETH, SOL, TON, BTC`
      });
    }
    
    // Add confirmation
    const validationResult = timeWeightedValidation.addConfirmation({
      vaultId,
      chain: chain as BlockchainType,
      confirmationTimestamp: Date.now(),
      blockHeight,
      transactionId
    });
    
    if (!validationResult) {
      return res.status(404).json({
        success: false,
        error: 'No active validation found for this vault'
      });
    }
    
    res.json({
      success: true,
      validation: validationResult
    });
  } catch (error) {
    securityLogger.error('Error adding validation confirmation:', error);
    
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get validation status
router.get('/validation/:vaultId', (req: Request, res: Response) => {
  try {
    const { vaultId } = req.params;
    
    const validationResult = timeWeightedValidation.getValidationResult(vaultId);
    
    if (!validationResult) {
      return res.status(404).json({
        success: false,
        error: 'Validation not found'
      });
    }
    
    res.json({
      success: true,
      validation: validationResult
    });
  } catch (error) {
    securityLogger.error('Error getting validation status:', error);
    
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Initiate recovery
router.post('/recovery/initiate/:vaultId', (req: Request, res: Response) => {
  try {
    const { vaultId } = req.params;
    const { primaryChain, trigger, metadata } = req.body;
    
    if (!vaultId || !primaryChain || !trigger) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters'
      });
    }
    
    // Validate the chain
    if (!['ETH', 'SOL', 'TON', 'BTC'].includes(primaryChain)) {
      return res.status(400).json({
        success: false,
        error: `Invalid chain: ${primaryChain}. Valid options are: ETH, SOL, TON, BTC`
      });
    }
    
    // Initiate recovery
    const recoveryStatus = automatedRecoveryProtocol.initiateRecovery(
      vaultId,
      primaryChain as BlockchainType,
      trigger,
      metadata
    );
    
    res.json({
      success: true,
      recovery: recoveryStatus
    });
  } catch (error) {
    securityLogger.error('Error initiating recovery:', error);
    
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get recovery status
router.get('/recovery/:vaultId', (req: Request, res: Response) => {
  try {
    const { vaultId } = req.params;
    
    const recoveryStatus = automatedRecoveryProtocol.getRecoveryStatus(vaultId);
    
    if (!recoveryStatus) {
      return res.status(404).json({
        success: false,
        error: 'Recovery not found'
      });
    }
    
    res.json({
      success: true,
      recovery: recoveryStatus
    });
  } catch (error) {
    securityLogger.error('Error getting recovery status:', error);
    
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get chain health status
router.get('/chain-health', (_req: Request, res: Response) => {
  try {
    const chainHealth = automatedRecoveryProtocol.getAllChainHealthStatus();
    
    res.json({
      success: true,
      chainHealth
    });
  } catch (error) {
    securityLogger.error('Error getting chain health:', error);
    
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get specific chain health
router.get('/chain-health/:chain', (req: Request, res: Response) => {
  try {
    const { chain } = req.params;
    
    if (!['ETH', 'SOL', 'TON', 'BTC'].includes(chain)) {
      return res.status(400).json({
        success: false,
        error: `Invalid chain: ${chain}. Valid options are: ETH, SOL, TON, BTC`
      });
    }
    
    const chainHealth = automatedRecoveryProtocol.getChainHealthStatus(chain as BlockchainType);
    
    if (!chainHealth) {
      return res.status(404).json({
        success: false,
        error: 'Chain health information not found'
      });
    }
    
    res.json({
      success: true,
      chainHealth
    });
  } catch (error) {
    securityLogger.error('Error getting chain health:', error);
    
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;