/**
 * Trinity Protocol State Coordinator
 * 
 * Orchestrates cross-chain state synchronization across Arbitrum, Solana, and TON
 * This is the brain of Trinity Protocol that ensures 2-of-3 consensus
 * 
 * Functionality:
 * - Listens to events from all 3 chains
 * - Triggers automatic cross-chain verification
 * - Maintains state consistency
 * - Handles emergency recovery coordination
 */

import { EventEmitter } from 'events';
import { arbitrumEventListener } from './arbitrum-event-listener';
import { solanaEventListener } from './solana-event-listener';
import { tonEventListener } from './ton-event-listener';
import { trinityProtocol, TrinityVerificationRequest, OperationType } from '../security/trinity-protocol';
import { securityLogger, SecurityEventType } from '../monitoring/security-logger';

export interface CrossChainState {
  vaultId: string;
  arbitrum: {
    state: string;
    verified: boolean;
    blockNumber: number;
    timestamp: number;
  };
  solana: {
    state: string;
    verified: boolean;
    slot: number;
    timestamp: number;
  };
  ton: {
    state: string;
    verified: boolean;
    timestamp: number;
  };
  consensusReached: boolean;
  lastSync: number;
}

export class TrinityStateCoordinator extends EventEmitter {
  private vaultStates: Map<string, CrossChainState> = new Map();
  private isRunning: boolean = false;

  constructor() {
    super();
  }

  /**
   * Initialize the Trinity Protocol State Coordinator
   * Gracefully handles failures - server will continue running even if some chains fail
   */
  async initialize(): Promise<void> {
    try {
      securityLogger.info('🔺 Initializing Trinity Protocol State Coordinator...', SecurityEventType.CROSS_CHAIN_VERIFICATION);

      // Initialize all event listeners (each handles its own errors gracefully)
      await arbitrumEventListener.initialize().catch(err => {
        securityLogger.warn('⚠️ Arbitrum listener initialization failed - will continue without it', SecurityEventType.SYSTEM_ERROR);
      });
      
      await solanaEventListener.initialize().catch(err => {
        securityLogger.warn('⚠️ Solana listener initialization failed - will continue without it', SecurityEventType.SYSTEM_ERROR);
      });
      
      await tonEventListener.initialize().catch(err => {
        securityLogger.warn('⚠️ TON listener initialization failed - will continue without it', SecurityEventType.SYSTEM_ERROR);
      });

      // Initialize Trinity Protocol
      await trinityProtocol.initialize().catch(err => {
        securityLogger.warn('⚠️ Trinity Protocol initialization failed - basic operations will still work', SecurityEventType.SYSTEM_ERROR);
      });

      securityLogger.info('✅ Trinity Protocol State Coordinator initialized (degraded mode if some chains failed)', SecurityEventType.CROSS_CHAIN_VERIFICATION);
    } catch (error) {
      securityLogger.error('❌ Failed to initialize Trinity Protocol State Coordinator', SecurityEventType.SYSTEM_ERROR, error);
      // Don't throw - let the server continue running
      securityLogger.info('ℹ️ Server will continue running with limited cross-chain functionality', SecurityEventType.CROSS_CHAIN_VERIFICATION);
    }
  }

  /**
   * Start the coordinator
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      securityLogger.warn('Trinity Protocol State Coordinator is already running', SecurityEventType.CROSS_CHAIN_VERIFICATION);
      return;
    }

    securityLogger.info('🚀 Starting Trinity Protocol State Coordinator...', SecurityEventType.CROSS_CHAIN_VERIFICATION);

    // Set up event listeners for cross-chain coordination
    this.setupArbitrumListeners();
    this.setupSolanaListeners();
    this.setupTONListeners();

    // Start all event listeners (gracefully handle failures)
    await arbitrumEventListener.startListening().catch(err => {
      securityLogger.warn('⚠️ Arbitrum listener failed to start - continuing without it', SecurityEventType.SYSTEM_ERROR);
    });
    await solanaEventListener.startListening().catch(err => {
      securityLogger.warn('⚠️ Solana listener failed to start - continuing without it', SecurityEventType.SYSTEM_ERROR);
    });
    await tonEventListener.startListening().catch(err => {
      securityLogger.warn('⚠️ TON listener failed to start - continuing without it', SecurityEventType.SYSTEM_ERROR);
    });

    this.isRunning = true;
    securityLogger.info('✅ Trinity Protocol State Coordinator is now running', SecurityEventType.CROSS_CHAIN_VERIFICATION);
    securityLogger.info('   🔺 Automatic cross-chain verification enabled', SecurityEventType.CROSS_CHAIN_VERIFICATION);
  }

  /**
   * Stop the coordinator
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    securityLogger.info('🛑 Stopping Trinity Protocol State Coordinator...', SecurityEventType.CROSS_CHAIN_VERIFICATION);

    await arbitrumEventListener.stopListening();
    await solanaEventListener.stopListening();
    await tonEventListener.stopListening();

    arbitrumEventListener.removeAllListeners();
    solanaEventListener.removeAllListeners();
    tonEventListener.removeAllListeners();

    this.isRunning = false;
    securityLogger.info('✅ Trinity Protocol State Coordinator stopped', SecurityEventType.CROSS_CHAIN_VERIFICATION);
  }

  /**
   * Setup Arbitrum event listeners
   */
  private setupArbitrumListeners(): void {
    // Vault created - Initialize cross-chain state
    arbitrumEventListener.on('vault:created', async (event) => {
      securityLogger.info(`🔔 [Arbitrum] Vault created: ${event.vaultId}`, SecurityEventType.VAULT_CREATION);
      await this.handleVaultCreated(event.vaultId, 'arbitrum', event);
    });

    // Vault unlocked - TRIGGER TRINITY PROTOCOL VERIFICATION
    arbitrumEventListener.on('vault:unlocked', async (event) => {
      securityLogger.info(`🔓 [Arbitrum] Vault unlocked: ${event.vaultId}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
      securityLogger.info(`   🔺 Triggering Trinity Protocol 2-of-3 consensus...`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
      
      await this.triggerCrossChainVerification(event.vaultId, OperationType.VAULT_UNLOCK, event.data);
    });

    // Vault withdrawal - Verify cross-chain permissions
    arbitrumEventListener.on('vault:withdrawal', async (event) => {
      securityLogger.info(`💸 [Arbitrum] Withdrawal detected: ${event.vaultId}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
      
      await this.triggerCrossChainVerification(event.vaultId, OperationType.VAULT_WITHDRAW, event.data);
    });

    // Emergency recovery triggered
    arbitrumEventListener.on('emergency:recovery', async (event) => {
      securityLogger.warn(`🚨 [Arbitrum] Emergency recovery: ${event.vaultId}`, SecurityEventType.SUSPICIOUS_ACTIVITY);
      
      await this.handleEmergencyRecovery(event.vaultId, 'arbitrum', event.data);
    });
  }

  /**
   * Setup Solana event listeners
   */
  private setupSolanaListeners(): void {
    // Vault initialized on Solana
    solanaEventListener.on('vault:initialized', async (event) => {
      securityLogger.info(`🔔 [Solana] Vault initialized: ${event.vaultId}`, SecurityEventType.VAULT_CREATION);
      await this.handleVaultCreated(event.vaultId, 'solana', event);
    });

    // State updated on Solana
    solanaEventListener.on('state:updated', async (event) => {
      securityLogger.info(`🔄 [Solana] State updated: ${event.vaultId}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
      await this.updateChainState(event.vaultId, 'solana', event);
    });

    // Cross-chain consensus reached on Solana
    solanaEventListener.on('consensus:reached', async (event) => {
      securityLogger.info(`✅ [Solana] Consensus reached: ${event.vaultId}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
      await this.handleConsensusReached(event.vaultId, 'solana');
    });
  }

  /**
   * Setup TON event listeners
   */
  private setupTONListeners(): void {
    // Vault backup updated on TON
    tonEventListener.on('backup:updated', async (event) => {
      securityLogger.info(`🔄 [TON] Backup updated: ${event.vaultId}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
      await this.updateChainState(event.vaultId, 'ton', event);
    });

    // Emergency recovery triggered on TON
    tonEventListener.on('emergency:triggered', async (event) => {
      securityLogger.warn(`🚨 [TON] Emergency recovery: ${event.vaultId}`, SecurityEventType.SUSPICIOUS_ACTIVITY);
      await this.handleEmergencyRecovery(event.vaultId, 'ton', event.data);
    });
  }

  /**
   * Handle vault creation across chains
   */
  private async handleVaultCreated(vaultId: string, chain: 'arbitrum' | 'solana' | 'ton', event: any): Promise<void> {
    let state = this.vaultStates.get(vaultId);

    if (!state) {
      // Initialize cross-chain state tracking
      state = {
        vaultId,
        arbitrum: { state: 'unknown', verified: false, blockNumber: 0, timestamp: 0 },
        solana: { state: 'unknown', verified: false, slot: 0, timestamp: 0 },
        ton: { state: 'unknown', verified: false, timestamp: 0 },
        consensusReached: false,
        lastSync: Date.now()
      };
      this.vaultStates.set(vaultId, state);
    }

    // Update the chain that created the vault
    if (chain === 'arbitrum') {
      state.arbitrum = {
        state: 'created',
        verified: true,
        blockNumber: event.blockNumber || 0,
        timestamp: event.timestamp
      };
    } else if (chain === 'solana') {
      state.solana = {
        state: 'created',
        verified: true,
        slot: event.slot || 0,
        timestamp: event.timestamp
      };
    } else if (chain === 'ton') {
      state.ton = {
        state: 'created',
        verified: true,
        timestamp: event.timestamp
      };
    }

    state.lastSync = Date.now();
    this.vaultStates.set(vaultId, state);

    securityLogger.info(`   📊 Cross-chain state initialized for ${vaultId}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
    this.emit('state:initialized', state);
  }

  /**
   * Trigger cross-chain verification (Trinity Protocol 2-of-3)
   */
  private async triggerCrossChainVerification(
    vaultId: string,
    operationType: OperationType,
    data: any
  ): Promise<void> {
    try {
      securityLogger.info(`🔺 Triggering Trinity Protocol verification for ${vaultId}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
      securityLogger.info(`   Operation: ${operationType}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);

      // Create verification request
      const request: TrinityVerificationRequest = {
        operationId: `${vaultId}-${operationType}-${Date.now()}`,
        operationType,
        vaultId,
        requester: 'TRINITY_STATE_COORDINATOR',
        data,
        requiredChains: 2 // 2-of-3 consensus
      };

      // Execute Trinity Protocol verification
      const result = await trinityProtocol.verifyOperation(request);

      securityLogger.info(`   🔺 Trinity verification result: ${result.consensusReached ? 'SUCCESS ✅' : 'FAILED ❌'}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
      securityLogger.info(`   - Arbitrum: ${result.verifications[0]?.verified ? '✅' : '❌'}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
      securityLogger.info(`   - Solana: ${result.verifications[1]?.verified ? '✅' : '❌'}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
      securityLogger.info(`   - TON: ${result.verifications[2]?.verified ? '✅' : '❌'}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);

      // Update vault state
      const state = this.vaultStates.get(vaultId);
      if (state) {
        state.consensusReached = result.consensusReached;
        state.lastSync = Date.now();
        
        // Update individual chain verifications
        result.verifications.forEach(v => {
          if (v.chain === 'ethereum') {
            state.arbitrum.verified = v.verified;
          } else if (v.chain === 'solana') {
            state.solana.verified = v.verified;
          } else if (v.chain === 'ton') {
            state.ton.verified = v.verified;
          }
        });

        this.vaultStates.set(vaultId, state);
      }

      // Emit consensus event
      if (result.consensusReached) {
        this.emit('consensus:reached', { vaultId, operationType, result });
        securityLogger.info(`🎉 Trinity Protocol consensus reached for ${vaultId}!`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
      } else {
        this.emit('consensus:failed', { vaultId, operationType, result });
        securityLogger.warn(`⚠️ Trinity Protocol consensus FAILED for ${vaultId}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
      }
    } catch (error) {
      securityLogger.error(`Error triggering Trinity Protocol verification for ${vaultId}`, SecurityEventType.SYSTEM_ERROR, error);
    }
  }

  /**
   * Update chain state
   */
  private async updateChainState(vaultId: string, chain: 'arbitrum' | 'solana' | 'ton', event: any): Promise<void> {
    let state = this.vaultStates.get(vaultId);

    if (!state) {
      // Initialize if doesn't exist
      await this.handleVaultCreated(vaultId, chain, event);
      return;
    }

    // Update chain-specific state
    if (chain === 'arbitrum' && event.blockNumber) {
      state.arbitrum.blockNumber = event.blockNumber;
      state.arbitrum.timestamp = event.timestamp;
    } else if (chain === 'solana' && event.slot) {
      state.solana.slot = event.slot;
      state.solana.timestamp = event.timestamp;
    } else if (chain === 'ton') {
      state.ton.timestamp = event.timestamp;
    }

    state.lastSync = Date.now();
    this.vaultStates.set(vaultId, state);

    this.emit('state:updated', state);
  }

  /**
   * Handle consensus reached
   */
  private async handleConsensusReached(vaultId: string, chain: string): Promise<void> {
    const state = this.vaultStates.get(vaultId);
    
    if (state) {
      state.consensusReached = true;
      this.vaultStates.set(vaultId, state);
      
      securityLogger.info(`🎉 Consensus confirmed by ${chain} for ${vaultId}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
    }
  }

  /**
   * Handle emergency recovery
   */
  private async handleEmergencyRecovery(vaultId: string, chain: string, data: any): Promise<void> {
    securityLogger.warn(`🚨 Emergency recovery initiated for ${vaultId} on ${chain}`, SecurityEventType.SUSPICIOUS_ACTIVITY);
    
    // Trigger Trinity Protocol emergency verification (requires all 3 chains)
    const request: TrinityVerificationRequest = {
      operationId: `emergency-${vaultId}-${Date.now()}`,
      operationType: OperationType.EMERGENCY_RECOVERY,
      vaultId,
      requester: 'EMERGENCY_SYSTEM',
      data,
      requiredChains: 3 // All 3 chains must agree for emergency recovery
    };

    const result = await trinityProtocol.verifyOperation(request);

    if (result.consensusReached) {
      securityLogger.warn(`✅ Emergency recovery approved by Trinity Protocol for ${vaultId}`, SecurityEventType.SUSPICIOUS_ACTIVITY);
      this.emit('emergency:approved', { vaultId, result });
    } else {
      securityLogger.warn(`❌ Emergency recovery DENIED by Trinity Protocol for ${vaultId}`, SecurityEventType.SUSPICIOUS_ACTIVITY);
      this.emit('emergency:denied', { vaultId, result });
    }
  }

  /**
   * Get vault cross-chain state
   */
  getVaultState(vaultId: string): CrossChainState | undefined {
    return this.vaultStates.get(vaultId);
  }

  /**
   * Get all vault states
   */
  getAllVaultStates(): CrossChainState[] {
    return Array.from(this.vaultStates.values());
  }

  /**
   * Health check - verify all chains are operational
   */
  async healthCheck(): Promise<{ healthy: boolean; chains: any }> {
    const chainHealth = await trinityProtocol.healthCheck();
    
    const healthy = chainHealth.ethereum && chainHealth.solana && chainHealth.ton;

    securityLogger.info(`🏥 Trinity Protocol Health Check: ${healthy ? 'HEALTHY ✅' : 'DEGRADED ⚠️'}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
    securityLogger.info(`   - Arbitrum: ${chainHealth.ethereum ? '✅' : '❌'}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
    securityLogger.info(`   - Solana: ${chainHealth.solana ? '✅' : '❌'}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
    securityLogger.info(`   - TON: ${chainHealth.ton ? '✅' : '❌'}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);

    return { healthy, chains: chainHealth };
  }
}

export const trinityStateCoordinator = new TrinityStateCoordinator();
