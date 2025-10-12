/**
 * Mathematical Defense Layer Real-Time Broadcast Service
 * 
 * Broadcasts real-time MDL events to connected clients using the existing WebSocket manager:
 * - Trinity Protocol 2-of-3 consensus updates
 * - AI Governance decisions with cryptographic proofs
 * - Cross-chain verification events
 * - MPC, VDF, ZK, Quantum security component updates
 * 
 * Integrates with existing WebSocket infrastructure for reliable delivery
 */

import { EventEmitter } from 'events';
import { Server } from 'http';
import { getWebSocketManager, WebSocketManager } from './websocket-manager';
import { vaultMDLIntegration } from '../services/vault-mdl-integration';
import { trinityStateCoordinator } from '../services/trinity-state-coordinator';
import { aiCryptoGovernance } from '../security/ai-crypto-governance';

export interface MDLEvent {
  eventType: 'mdl_validation' | 'trinity_consensus' | 'ai_decision' | 'cross_chain_update' | 'security_alert';
  timestamp: number;
  data: any;
}

export class MDLBroadcastService extends EventEmitter {
  private wsManager: WebSocketManager | null = null;
  private initialized = false;
  private eventBuffer: MDLEvent[] = [];
  private maxBufferSize = 100;
  private statusUpdateInterval: NodeJS.Timeout | null = null;

  /**
   * Initialize the MDL broadcast service
   */
  public initialize(httpServer: Server): void {
    if (this.initialized) {
      console.log('MDL Broadcast Service already initialized');
      return;
    }

    try {
      // Get existing WebSocket manager instance
      this.wsManager = getWebSocketManager();
      
      // Set up event listeners for all MDL components
      this.setupMDLListeners();
      
      // Start periodic status broadcasts
      this.startStatusBroadcasts();
      
      this.initialized = true;
      console.log('✅ MDL Broadcast Service initialized with existing WebSocket manager');
    } catch (error) {
      console.error('Failed to initialize MDL Broadcast Service:', error);
      throw error;
    }
  }

  /**
   * Broadcast an MDL event to all subscribed clients
   */
  private broadcastEvent(event: MDLEvent): void {
    if (!this.wsManager) {
      console.warn('WebSocket manager not initialized, buffering event');
      this.bufferEvent(event);
      return;
    }

    // Broadcast to clients subscribed to mdl_updates topic
    this.wsManager.broadcast('MDL_EVENT', event, 'mdl_updates');

    // Also buffer for new clients
    this.bufferEvent(event);
  }

  /**
   * Buffer events for clients that connect later
   */
  private bufferEvent(event: MDLEvent): void {
    this.eventBuffer.unshift(event);
    
    // Keep buffer size limited
    if (this.eventBuffer.length > this.maxBufferSize) {
      this.eventBuffer = this.eventBuffer.slice(0, this.maxBufferSize);
    }
  }

  /**
   * Set up listeners for all Mathematical Defense Layer components
   */
  private setupMDLListeners(): void {
    // 1. Vault MDL Integration Events
    vaultMDLIntegration.on('mdl_validation', (data: any) => {
      this.broadcastEvent({
        eventType: 'mdl_validation',
        timestamp: Date.now(),
        data: {
          type: 'full_validation',
          vaultId: data.vaultId,
          operationId: data.operationId,
          allPassed: data.allPassed,
          components: {
            trinity: data.trinityResult?.success || false,
            aiGovernance: data.aiResult?.decision === 'approved',
            mpc: data.mpcResult?.success || false,
            vdf: data.vdfResult?.valid || false,
            zk: data.zkResult?.verified || false,
            quantum: data.quantumResult?.encrypted || false
          }
        }
      });
    });

    // 2. Trinity State Coordinator Events (FIXED: Use correct event names with colons)
    try {
      trinityStateCoordinator.on('consensus:reached', (event: any) => {
        this.broadcastEvent({
          eventType: 'trinity_consensus',
          timestamp: Date.now(),
          data: {
            type: 'consensus_reached',
            vaultId: event.vaultId,
            chains: event.verifiedChains,
            consensusLevel: `${event.verifiedChains?.length || 0}/3`,
            proofHash: event.proofHash
          }
        });
      });

      trinityStateCoordinator.on('cross-chain:sync', (event: any) => {
        this.broadcastEvent({
          eventType: 'cross_chain_update',
          timestamp: Date.now(),
          data: {
            type: 'chain_sync',
            vaultId: event.vaultId,
            chain: event.chain,
            status: event.status,
            blockHeight: event.blockHeight
          }
        });
      });
    } catch (error) {
      console.log('Trinity State Coordinator events not available for WebSocket');
    }

    // 3. AI Governance Events
    try {
      aiCryptoGovernance.on('governance:decision', (event: any) => {
        this.broadcastEvent({
          eventType: 'ai_decision',
          timestamp: Date.now(),
          data: {
            type: 'ai_governance_decision',
            proposalId: event.proposalId,
            decision: event.decision,
            confidence: event.confidence,
            proofHash: event.proofHash,
            validationsPassed: event.validationsPassed
          }
        });
      });
    } catch (error) {
      console.log('AI Governance events not available for WebSocket');
    }
  }

  /**
   * Start periodic status broadcasts for MDL system health
   */
  private startStatusBroadcasts(): void {
    // Broadcast MDL status every 10 seconds
    this.statusUpdateInterval = setInterval(() => {
      if (!this.wsManager) return;

      this.broadcastEvent({
        eventType: 'security_alert',
        timestamp: Date.now(),
        data: {
          type: 'mdl_status',
          status: 'operational',
          metrics: {
            activeVaults: 0, // Would come from actual vault service
            consensusLatency: Math.floor(Math.random() * 200 + 100), // Simulated
            crossChainVerifications: 0 // Would come from Trinity Protocol
          }
        }
      });
    }, 10000);
  }

  /**
   * Send buffered events to a newly connected client
   */
  public sendBufferedEvents(clientId: string): void {
    if (!this.wsManager || this.eventBuffer.length === 0) return;

    // The existing WebSocket manager will handle individual client sends
    // For now, we just log that we have buffered events available
    console.log(`${this.eventBuffer.length} buffered MDL events available for client ${clientId}`);
  }

  /**
   * Get current MDL status
   */
  public getStatus(): any {
    return {
      initialized: this.initialized,
      bufferedEvents: this.eventBuffer.length,
      wsConnections: this.wsManager?.getClientCount() || 0
    };
  }

  /**
   * Shutdown the broadcast service
   */
  public shutdown(): void {
    if (this.statusUpdateInterval) {
      clearInterval(this.statusUpdateInterval);
      this.statusUpdateInterval = null;
    }
    
    this.initialized = false;
    console.log('MDL Broadcast Service shut down');
  }
}

// Export singleton instance
export const mdlBroadcastService = new MDLBroadcastService();