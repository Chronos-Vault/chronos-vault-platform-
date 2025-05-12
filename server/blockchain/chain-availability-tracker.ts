import { BlockchainType } from '@shared/types';
import { securityLogger } from '../utils/logger';
import { EventEmitter } from 'events';

/**
 * Interface for chain status information
 */
interface ChainStatus {
  isAvailable: boolean;
  lastCheck: number;
  consecutiveFailures: number;
  totalFailures: number;
  totalRequests: number;
  lastSuccess: number;
  recoveryAttempts: number;
  failureRate: number;
}

/**
 * Class that tracks the availability of blockchain networks
 * Used to make smart decisions about fallbacks and recovery strategies
 */
class ChainAvailabilityTracker extends EventEmitter {
  private chainStatuses: Record<BlockchainType, ChainStatus> = {
    'ETH': {
      isAvailable: true,
      lastCheck: Date.now(),
      consecutiveFailures: 0,
      totalFailures: 0,
      totalRequests: 0,
      lastSuccess: Date.now(),
      recoveryAttempts: 0,
      failureRate: 0
    },
    'SOL': {
      isAvailable: true,
      lastCheck: Date.now(),
      consecutiveFailures: 0,
      totalFailures: 0,
      totalRequests: 0,
      lastSuccess: Date.now(),
      recoveryAttempts: 0,
      failureRate: 0
    },
    'TON': {
      isAvailable: true,
      lastCheck: Date.now(),
      consecutiveFailures: 0,
      totalFailures: 0,
      totalRequests: 0,
      lastSuccess: Date.now(),
      recoveryAttempts: 0,
      failureRate: 0
    },
    'BTC': {
      isAvailable: true,
      lastCheck: Date.now(),
      consecutiveFailures: 0,
      totalFailures: 0,
      totalRequests: 0,
      lastSuccess: Date.now(),
      recoveryAttempts: 0,
      failureRate: 0
    }
  };

  /**
   * Record a successful operation for a blockchain
   */
  public recordSuccess(chain: BlockchainType): void {
    const now = Date.now();
    const status = this.chainStatuses[chain];
    
    status.isAvailable = true;
    status.lastCheck = now;
    status.lastSuccess = now;
    status.consecutiveFailures = 0;
    status.totalRequests++;
    
    // Update failure rate
    status.failureRate = status.totalFailures / status.totalRequests;
    
    // If previously we thought the chain was unavailable, emit an event
    if (status.consecutiveFailures > 3) {
      securityLogger.info(`Chain ${chain} is now available again after ${status.consecutiveFailures} consecutive failures`);
      
      this.emit('chain:recovered', {
        chain,
        downtime: now - status.lastSuccess,
        previousFailures: status.consecutiveFailures
      });
    }
    
    this.chainStatuses[chain] = status;
  }

  /**
   * Record a failed operation for a blockchain
   */
  public recordFailure(chain: BlockchainType): void {
    const now = Date.now();
    const status = this.chainStatuses[chain];
    
    status.lastCheck = now;
    status.consecutiveFailures++;
    status.totalFailures++;
    status.totalRequests++;
    
    // Update failure rate
    status.failureRate = status.totalFailures / status.totalRequests;
    
    // If we have multiple consecutive failures, consider the chain unavailable
    if (status.consecutiveFailures >= 3) {
      status.isAvailable = false;
      
      // Only emit the alert if this is exactly the third failure
      if (status.consecutiveFailures === 3) {
        securityLogger.warn(`Chain ${chain} appears to be unavailable after ${status.consecutiveFailures} consecutive failures`);
        
        this.emit('chain:unavailable', {
          chain,
          consecutiveFailures: status.consecutiveFailures,
          lastSuccess: status.lastSuccess,
          timeSinceLastSuccess: now - status.lastSuccess
        });
      }
    }
    
    this.chainStatuses[chain] = status;
  }

  /**
   * Record a recovery attempt for a blockchain
   */
  public recordRecoveryAttempt(chain: BlockchainType): void {
    this.chainStatuses[chain].recoveryAttempts++;
  }

  /**
   * Get the current status of a blockchain
   */
  public getChainStatus(chain: BlockchainType): ChainStatus {
    return this.chainStatuses[chain];
  }

  /**
   * Check if a chain is currently considered available
   */
  public isChainAvailable(chain: BlockchainType): boolean {
    return this.chainStatuses[chain].isAvailable;
  }

  /**
   * Get all chain statuses
   */
  public getAllChainStatuses(): Record<BlockchainType, ChainStatus> {
    return this.chainStatuses;
  }

  /**
   * Reset the status for a specific chain (for testing purposes)
   */
  public resetChainStatus(chain: BlockchainType): void {
    this.chainStatuses[chain] = {
      isAvailable: true,
      lastCheck: Date.now(),
      consecutiveFailures: 0,
      totalFailures: 0,
      totalRequests: 0,
      lastSuccess: Date.now(),
      recoveryAttempts: 0,
      failureRate: 0
    };
  }
}

export const chainAvailabilityTracker = new ChainAvailabilityTracker();