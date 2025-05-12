import { BlockchainType } from '@shared/types';
import { securityLogger } from '../utils/logger';
import { EventEmitter } from 'events';

/**
 * Interface for fallback record information
 */
interface FallbackRecord {
  vaultId: string;
  primaryChain: BlockchainType;
  fallbackChain: BlockchainType;
  strategy: string;
  reason: string;
  timestamp: Date;
  resolved?: boolean;
  resolvedAt?: Date;
}

/**
 * Class that tracks fallbacks between blockchains for operational monitoring and recovery
 */
class FallbackRegistry extends EventEmitter {
  private fallbacks: FallbackRecord[] = [];
  private activeFailovers: Map<string, FallbackRecord> = new Map();

  /**
   * Register a new fallback
   */
  public registerFallback(fallback: FallbackRecord): void {
    this.fallbacks.push(fallback);
    
    // Store this as an active failover keyed by vaultId
    this.activeFailovers.set(fallback.vaultId, fallback);
    
    // Log the fallback
    securityLogger.warn(`Registered fallback for vault ${fallback.vaultId}`, {
      primaryChain: fallback.primaryChain,
      fallbackChain: fallback.fallbackChain,
      reason: fallback.reason,
      strategy: fallback.strategy
    });
    
    // Emit an event for operational monitoring
    this.emit('fallback:registered', fallback);
  }

  /**
   * Mark a fallback as resolved
   */
  public resolveFailover(vaultId: string): boolean {
    const fallback = this.activeFailovers.get(vaultId);
    
    if (fallback) {
      fallback.resolved = true;
      fallback.resolvedAt = new Date();
      
      // Remove from active failovers
      this.activeFailovers.delete(vaultId);
      
      // Update in the main array
      const index = this.fallbacks.findIndex(f => 
        f.vaultId === vaultId && 
        f.primaryChain === fallback.primaryChain && 
        !f.resolved
      );
      
      if (index !== -1) {
        this.fallbacks[index] = fallback;
      }
      
      // Log the resolution
      securityLogger.info(`Resolved fallback for vault ${vaultId}`, {
        primaryChain: fallback.primaryChain,
        fallbackChain: fallback.fallbackChain,
        duration: fallback.resolvedAt.getTime() - fallback.timestamp.getTime()
      });
      
      // Emit an event for operational monitoring
      this.emit('fallback:resolved', {
        ...fallback,
        duration: fallback.resolvedAt.getTime() - fallback.timestamp.getTime()
      });
      
      return true;
    }
    
    return false;
  }

  /**
   * Get all active failovers
   */
  public getActiveFailovers(): FallbackRecord[] {
    return Array.from(this.activeFailovers.values());
  }

  /**
   * Get all failovers for a specific vault
   */
  public getVaultFailovers(vaultId: string): FallbackRecord[] {
    return this.fallbacks.filter(f => f.vaultId === vaultId);
  }

  /**
   * Get all failovers for a specific primary chain
   */
  public getChainFailovers(chain: BlockchainType): FallbackRecord[] {
    return this.fallbacks.filter(f => f.primaryChain === chain);
  }

  /**
   * Check if a vault has an active failover
   */
  public hasActiveFailover(vaultId: string): boolean {
    return this.activeFailovers.has(vaultId);
  }

  /**
   * Get an active failover for a vault if it exists
   */
  public getActiveFailover(vaultId: string): FallbackRecord | undefined {
    return this.activeFailovers.get(vaultId);
  }

  /**
   * Get statistics about failovers
   */
  public getFailoverStats(): {
    totalFailovers: number;
    activeFailovers: number;
    resolvedFailovers: number;
    byPrimaryChain: Record<BlockchainType, number>;
    byFallbackChain: Record<BlockchainType, number>;
  } {
    const stats = {
      totalFailovers: this.fallbacks.length,
      activeFailovers: this.activeFailovers.size,
      resolvedFailovers: this.fallbacks.filter(f => f.resolved).length,
      byPrimaryChain: {
        'ETH': 0,
        'SOL': 0,
        'TON': 0,
        'BTC': 0
      },
      byFallbackChain: {
        'ETH': 0,
        'SOL': 0,
        'TON': 0,
        'BTC': 0
      }
    };
    
    // Count by chain
    for (const fallback of this.fallbacks) {
      stats.byPrimaryChain[fallback.primaryChain]++;
      stats.byFallbackChain[fallback.fallbackChain]++;
    }
    
    return stats;
  }
}

export const fallbackRegistry = new FallbackRegistry();