/**
 * Solana Event Listener Service
 * 
 * Real-time monitoring of Chronos Vault Solana Program
 * Part of Trinity Protocol Cross-Chain State Synchronization
 * 
 * Monitors:
 * - Account state changes (vault initialization, state updates)
 * - Cross-chain consensus verification
 * - Program logs and events
 */

import { Connection, PublicKey, AccountInfo, Context, KeyedAccountInfo } from '@solana/web3.js';
import { EventEmitter } from 'events';
import config from '../config';
import { securityLogger, SecurityEventType } from '../monitoring/security-logger';
import { SolanaProgramClient } from '../blockchain/solana-program-client';

export interface SolanaVaultEvent {
  eventName: string;
  vaultId: string;
  slot: number;
  signature?: string;
  timestamp: number;
  data: any;
}

export class SolanaEventListener extends EventEmitter {
  private connection: Connection | null = null;
  private programClient: SolanaProgramClient | null = null;
  private programId: PublicKey | null = null;
  private isListening: boolean = false;
  private subscriptionIds: number[] = [];
  private lastProcessedSlot: number = 0;

  constructor() {
    super();
  }

  /**
   * Initialize the Solana event listener
   */
  async initialize(): Promise<void> {
    try {
      securityLogger.info('🎧 Initializing Solana Event Listener...', SecurityEventType.CROSS_CHAIN_VERIFICATION);

      // Initialize Solana connection
      const rpcUrl = config.blockchainConfig.solana.rpcUrl;
      this.connection = new Connection(rpcUrl, 'confirmed');

      // Test connection
      const version = await this.connection.getVersion();
      securityLogger.info(`   Connected to Solana ${version['solana-core']}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);

      // Initialize program client
      this.programClient = new SolanaProgramClient(rpcUrl);
      
      // Get program ID - DEPLOYED SOLANA VAULT PROGRAM (October 5, 2025)
      const DEPLOYED_PROGRAM_ID = 'CYaDJYRqm35udQ8vkxoajSER8oaniQUcV8Vvw5BqJyo2';
      let programIdStr = process.env.SOL_VAULT_PROGRAM_ID || DEPLOYED_PROGRAM_ID;
      
      // Validate program ID (check for placeholder values from config)
      if (programIdStr.includes('PROGRAM_ID') || programIdStr.includes('VAULT')) {
        securityLogger.warn(`   Invalid placeholder program ID detected: "${programIdStr}", using deployed program`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
        programIdStr = DEPLOYED_PROGRAM_ID;
      }
      
      securityLogger.info(`   Using Program ID: ${programIdStr}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
      
      this.programId = new PublicKey(programIdStr);
      securityLogger.info(`   Monitoring Program: ${programIdStr}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);

      // Get current slot
      this.lastProcessedSlot = await this.connection.getSlot();
      securityLogger.info(`   Starting from slot: ${this.lastProcessedSlot}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);

      securityLogger.info('✅ Solana Event Listener initialized successfully', SecurityEventType.CROSS_CHAIN_VERIFICATION);
    } catch (error) {
      securityLogger.error('❌ Failed to initialize Solana Event Listener', SecurityEventType.SYSTEM_ERROR, error);
      throw error;
    }
  }

  /**
   * Start listening to Solana program events
   */
  async startListening(): Promise<void> {
    if (this.isListening) {
      securityLogger.warn('Solana Event Listener is already running', SecurityEventType.CROSS_CHAIN_VERIFICATION);
      return;
    }

    if (!this.connection || !this.programId) {
      throw new Error('Solana Event Listener not initialized. Call initialize() first.');
    }

    this.isListening = true;
    securityLogger.info('🚀 Solana Event Listener started - monitoring program accounts', SecurityEventType.CROSS_CHAIN_VERIFICATION);

    // Subscribe to program account changes
    const subscriptionId = this.connection.onProgramAccountChange(
      this.programId,
      async (keyedAccountInfo: KeyedAccountInfo, context: Context) => {
        await this.handleAccountChange(keyedAccountInfo.accountInfo, context);
      },
      'confirmed'
    );

    this.subscriptionIds.push(subscriptionId);
    securityLogger.info(`   Subscribed to program account changes (ID: ${subscriptionId})`, SecurityEventType.CROSS_CHAIN_VERIFICATION);

    // Subscribe to logs (for event parsing)
    const logSubscriptionId = this.connection.onLogs(
      this.programId,
      async (logs, context) => {
        await this.handleProgramLogs(logs, context);
      },
      'confirmed'
    );

    this.subscriptionIds.push(logSubscriptionId);
    securityLogger.info(`   Subscribed to program logs (ID: ${logSubscriptionId})`, SecurityEventType.CROSS_CHAIN_VERIFICATION);

    // Poll for missed state changes every 10 seconds
    setInterval(() => this.pollForStateChanges(), 10000);
  }

  /**
   * Stop listening to events
   */
  async stopListening(): Promise<void> {
    if (!this.isListening || !this.connection) {
      return;
    }

    // Remove all subscriptions
    for (const id of this.subscriptionIds) {
      await this.connection.removeProgramAccountChangeListener(id);
      securityLogger.info(`   Unsubscribed from listener ${id}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
    }

    this.subscriptionIds = [];
    this.isListening = false;
    securityLogger.info('🛑 Solana Event Listener stopped', SecurityEventType.CROSS_CHAIN_VERIFICATION);
  }

  /**
   * Handle program account changes
   */
  private async handleAccountChange(accountInfo: AccountInfo<Buffer>, context: Context): Promise<void> {
    try {
      securityLogger.info(`📊 Solana account state changed at slot ${context.slot}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);

      // Deserialize vault state from account data
      const vaultState = this.deserializeVaultState(accountInfo.data);

      if (!vaultState) {
        return;
      }

      securityLogger.info(`   Vault ID: ${vaultState.vaultId}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
      securityLogger.info(`   State: ${this.getStateLabel(vaultState.state)}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
      securityLogger.info(`   Cross-chain consensus: ${vaultState.crossChainConsensus ? '✅' : '❌'}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);

      const event: SolanaVaultEvent = {
        eventName: 'AccountChanged',
        vaultId: vaultState.vaultId,
        slot: context.slot,
        timestamp: Date.now(),
        data: vaultState
      };

      // Check if this is a consensus change
      if (vaultState.crossChainConsensus) {
        securityLogger.info(`🔺 Cross-chain consensus reached for vault ${vaultState.vaultId}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
        this.emit('consensus:reached', event);
      }

      this.emit('account:changed', event);
      this.lastProcessedSlot = context.slot;
    } catch (error) {
      securityLogger.error('Error handling Solana account change', SecurityEventType.SYSTEM_ERROR, error);
    }
  }

  /**
   * Handle program logs
   */
  private async handleProgramLogs(logs: any, context: Context): Promise<void> {
    try {
      const logMessages = logs.logs || [];
      
      for (const log of logMessages) {
        // Parse vault initialization
        if (log.includes('Initializing Chronos Vault')) {
          const vaultId = this.extractVaultId(log);
          if (vaultId) {
            securityLogger.info(`🚀 Vault initialized on Solana: ${vaultId}`, SecurityEventType.VAULT_CREATION);
            
            const event: SolanaVaultEvent = {
              eventName: 'VaultInitialized',
              vaultId,
              slot: context.slot,
              signature: logs.signature,
              timestamp: Date.now(),
              data: { log }
            };
            
            this.emit('vault:initialized', event);
          }
        }

        // Parse state updates
        if (log.includes('Updating vault state')) {
          const vaultId = this.extractVaultId(log);
          const newState = this.extractState(log);
          
          if (vaultId) {
            securityLogger.info(`🔄 Vault state updated: ${vaultId} → ${this.getStateLabel(newState)}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
            
            const event: SolanaVaultEvent = {
              eventName: 'StateUpdated',
              vaultId,
              slot: context.slot,
              signature: logs.signature,
              timestamp: Date.now(),
              data: { state: newState, log }
            };
            
            this.emit('state:updated', event);
          }
        }

        // Parse cross-chain verification
        if (log.includes('Verifying cross-chain consensus')) {
          const vaultId = this.extractVaultId(log);
          
          if (vaultId) {
            securityLogger.info(`🔺 Cross-chain verification in progress: ${vaultId}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
            
            const event: SolanaVaultEvent = {
              eventName: 'CrossChainVerification',
              vaultId,
              slot: context.slot,
              signature: logs.signature,
              timestamp: Date.now(),
              data: { log }
            };
            
            this.emit('verification:started', event);
          }
        }
      }
    } catch (error) {
      securityLogger.error('Error parsing Solana program logs', SecurityEventType.SYSTEM_ERROR, error);
    }
  }

  /**
   * Poll for vault state changes (backup mechanism)
   */
  private async pollForStateChanges(): Promise<void> {
    if (!this.connection || !this.programClient) {
      return;
    }

    try {
      const currentSlot = await this.connection.getSlot();
      
      if (currentSlot > this.lastProcessedSlot) {
        // In production, query specific vault accounts
        // For now, log the slot progress
        securityLogger.info(`📈 Solana slot progress: ${currentSlot} (last: ${this.lastProcessedSlot})`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
      }
    } catch (error) {
      securityLogger.error('Error polling Solana state changes', SecurityEventType.SYSTEM_ERROR, error);
    }
  }

  /**
   * Deserialize vault state from account data
   */
  private deserializeVaultState(data: Buffer): any {
    try {
      // Simple deserialization (in production, use Borsh)
      // Format: vaultId (32 bytes) + owner (32 bytes) + state (1 byte) + ...
      
      const vaultIdBuffer = data.slice(0, 32);
      const vaultId = vaultIdBuffer.toString('utf8').replace(/\0/g, '').trim();
      
      if (!vaultId) {
        return null;
      }

      const state = data[64]; // State byte
      const crossChainConsensus = data[96] === 1; // Consensus flag

      return {
        vaultId,
        state,
        crossChainConsensus
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Extract vault ID from log message
   */
  private extractVaultId(log: string): string | null {
    const match = log.match(/vault[:\s]+([a-zA-Z0-9-]+)/i);
    return match ? match[1] : null;
  }

  /**
   * Extract state from log message
   */
  private extractState(log: string): number {
    const match = log.match(/state[:\s]+(\d+)/i);
    return match ? parseInt(match[1]) : 0;
  }

  /**
   * Get human-readable state label
   */
  private getStateLabel(state: number): string {
    const labels = ['locked', 'unlocked', 'active', 'emergency'];
    return labels[state] || 'unknown';
  }

  /**
   * Query vault state manually (for verification)
   */
  async getVaultState(vaultId: string): Promise<any> {
    if (!this.programClient) {
      throw new Error('Program client not initialized');
    }

    try {
      const vaultState = await this.programClient.getVaultState(vaultId);
      return vaultState;
    } catch (error) {
      securityLogger.error(`Error querying Solana vault state for ${vaultId}`, SecurityEventType.SYSTEM_ERROR, error);
      throw error;
    }
  }

  /**
   * Get current Solana slot
   */
  async getCurrentSlot(): Promise<number> {
    if (!this.connection) {
      throw new Error('Connection not initialized');
    }

    return await this.connection.getSlot();
  }
}

export const solanaEventListener = new SolanaEventListener();
