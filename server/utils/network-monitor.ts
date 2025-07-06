/**
 * Blockchain Network Monitor
 * 
 * This service monitors the connectivity and performance of all blockchain networks
 * used by the application. It can detect outages, latency issues, and provide
 * health metrics for each connected blockchain.
 */

import { BLOCKCHAIN_CONFIG } from '../config';

// Network status type
export type NetworkStatus = 'online' | 'degraded' | 'offline' | 'unknown';

// Network health metrics
export interface NetworkHealthMetrics {
  blockchain: 'ETH' | 'SOL' | 'TON';
  status: NetworkStatus;
  latencyMs: number;
  lastChecked: number;
  lastBlockHeight?: number;
  responseTimeMs?: number;
  errorCount: number;
  consecutiveErrors: number;
  healthScore: number; // 0-100
  details?: string;
}

// Alert thresholds
const ALERTS = {
  highLatency: 5000, // 5 seconds
  criticalLatency: 15000, // 15 seconds
  errorThreshold: 3, // After 3 consecutive errors, mark as degraded
  offlineThreshold: 10, // After 10 consecutive errors, mark as offline
  healthyBlockDiff: { // Maximum acceptable block delay
    ETH: 5, // 5 blocks
    SOL: 20, // 20 slots
    TON: 10 // 10 blocks
  }
};

class NetworkMonitor {
  private static instance: NetworkMonitor;
  private networkStatuses: Map<string, NetworkHealthMetrics> = new Map();
  private monitorInterval: NodeJS.Timeout | null = null;
  private alertCallbacks: Array<(network: string, status: NetworkStatus, metrics: NetworkHealthMetrics) => void> = [];
  
  private constructor() {
    // Initialize network statuses
    this.initializeNetworkStatuses();
    
    // Start monitoring
    this.startMonitoring();
  }

  public static getInstance(): NetworkMonitor {
    if (!NetworkMonitor.instance) {
      NetworkMonitor.instance = new NetworkMonitor();
    }
    return NetworkMonitor.instance;
  }

  /**
   * Initialize network status tracking for all chains
   */
  private initializeNetworkStatuses(): void {
    // Set initial status for Ethereum
    this.networkStatuses.set('ETH', {
      blockchain: 'ETH',
      status: 'unknown',
      latencyMs: 0,
      lastChecked: Date.now(),
      errorCount: 0,
      consecutiveErrors: 0,
      healthScore: 0
    });
    
    // Set initial status for Solana
    this.networkStatuses.set('SOL', {
      blockchain: 'SOL',
      status: 'unknown',
      latencyMs: 0,
      lastChecked: Date.now(),
      errorCount: 0,
      consecutiveErrors: 0,
      healthScore: 0
    });
    
    // Set initial status for TON
    this.networkStatuses.set('TON', {
      blockchain: 'TON',
      status: 'unknown',
      latencyMs: 0,
      lastChecked: Date.now(),
      errorCount: 0,
      consecutiveErrors: 0,
      healthScore: 0
    });
  }

  /**
   * Start the monitoring process
   */
  public startMonitoring(intervalMs: number = 60000): void {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
    }
    
    // Check network status every minute (or as configured)
    this.monitorInterval = setInterval(() => {
      this.checkAllNetworks();
    }, intervalMs);
    
    // Do an initial check immediately
    this.checkAllNetworks();
    
    console.log(`Network monitor started, checking every ${intervalMs/1000} seconds`);
  }

  /**
   * Stop the monitoring process
   */
  public stopMonitoring(): void {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = null;
      console.log('Network monitor stopped');
    }
  }

  /**
   * Check all network statuses
   */
  private async checkAllNetworks(): Promise<void> {
    await Promise.all([
      this.checkEthereumNetwork(),
      this.checkSolanaNetwork(),
      this.checkTONNetwork()
    ]);
  }

  /**
   * Check Ethereum network status
   */
  private async checkEthereumNetwork(): Promise<void> {
    const startTime = Date.now();
    const currentStatus = this.networkStatuses.get('ETH')!;
    
    try {
      // This would be replaced with actual RPC calls to Ethereum
      // For now we'll simulate a successful check
      const blockHeight = 12345678; // Would be fetched from the network
      const responseTime = Date.now() - startTime;
      
      // Update metrics
      const updatedMetrics: NetworkHealthMetrics = {
        ...currentStatus,
        status: 'online',
        latencyMs: responseTime,
        responseTimeMs: responseTime,
        lastBlockHeight: blockHeight,
        lastChecked: Date.now(),
        consecutiveErrors: 0,
        errorCount: currentStatus.errorCount,
        healthScore: this.calculateHealthScore('ETH', responseTime, 0)
      };
      
      this.networkStatuses.set('ETH', updatedMetrics);
      
      // If status changed from degraded/offline to online, trigger alert
      if (currentStatus.status !== 'online' && currentStatus.status !== 'unknown') {
        this.triggerAlert('ETH', 'online', updatedMetrics);
      }
      
    } catch (error) {
      this.handleNetworkError('ETH', error);
    }
  }

  /**
   * Check Solana network status
   */
  private async checkSolanaNetwork(): Promise<void> {
    const startTime = Date.now();
    const currentStatus = this.networkStatuses.get('SOL')!;
    
    try {
      // This would be replaced with actual RPC calls to Solana
      // For now we'll simulate a successful check
      const blockHeight = 98765432; // Would be fetched from the network
      const responseTime = Date.now() - startTime;
      
      // Update metrics
      const updatedMetrics: NetworkHealthMetrics = {
        ...currentStatus,
        status: 'online',
        latencyMs: responseTime,
        responseTimeMs: responseTime,
        lastBlockHeight: blockHeight,
        lastChecked: Date.now(),
        consecutiveErrors: 0,
        errorCount: currentStatus.errorCount,
        healthScore: this.calculateHealthScore('SOL', responseTime, 0)
      };
      
      this.networkStatuses.set('SOL', updatedMetrics);
      
      // If status changed from degraded/offline to online, trigger alert
      if (currentStatus.status !== 'online' && currentStatus.status !== 'unknown') {
        this.triggerAlert('SOL', 'online', updatedMetrics);
      }
      
    } catch (error) {
      this.handleNetworkError('SOL', error);
    }
  }

  /**
   * Check TON network status
   */
  private async checkTONNetwork(): Promise<void> {
    const startTime = Date.now();
    const currentStatus = this.networkStatuses.get('TON')!;
    
    try {
      // This would be replaced with actual API calls to TON
      // For now we'll simulate a successful check
      const blockHeight = 5432109; // Would be fetched from the network
      const responseTime = Date.now() - startTime;
      
      // Update metrics
      const updatedMetrics: NetworkHealthMetrics = {
        ...currentStatus,
        status: 'online',
        latencyMs: responseTime,
        responseTimeMs: responseTime,
        lastBlockHeight: blockHeight,
        lastChecked: Date.now(),
        consecutiveErrors: 0,
        errorCount: currentStatus.errorCount,
        healthScore: this.calculateHealthScore('TON', responseTime, 0)
      };
      
      this.networkStatuses.set('TON', updatedMetrics);
      
      // If status changed from degraded/offline to online, trigger alert
      if (currentStatus.status !== 'online' && currentStatus.status !== 'unknown') {
        this.triggerAlert('TON', 'online', updatedMetrics);
      }
      
    } catch (error) {
      this.handleNetworkError('TON', error);
    }
  }

  /**
   * Handle network check errors
   */
  private handleNetworkError(network: string, error: any): void {
    const currentStatus = this.networkStatuses.get(network)!;
    const newErrorCount = currentStatus.errorCount + 1;
    const newConsecutiveErrors = currentStatus.consecutiveErrors + 1;
    
    let newStatus: NetworkStatus = currentStatus.status;
    
    // Determine new status based on consecutive errors
    if (newConsecutiveErrors >= ALERTS.offlineThreshold) {
      newStatus = 'offline';
    } else if (newConsecutiveErrors >= ALERTS.errorThreshold) {
      newStatus = 'degraded';
    }
    
    const updatedMetrics: NetworkHealthMetrics = {
      ...currentStatus,
      status: newStatus,
      lastChecked: Date.now(),
      errorCount: newErrorCount,
      consecutiveErrors: newConsecutiveErrors,
      healthScore: this.calculateHealthScore(network as any, 0, newConsecutiveErrors),
      details: `Error: ${error?.message || 'Unknown error'}`
    };
    
    this.networkStatuses.set(network, updatedMetrics);
    
    // If status changed, trigger alert
    if (currentStatus.status !== newStatus) {
      this.triggerAlert(network, newStatus, updatedMetrics);
    }
  }

  /**
   * Calculate health score for a network (0-100)
   */
  private calculateHealthScore(
    network: 'ETH' | 'SOL' | 'TON',
    latencyMs: number,
    consecutiveErrors: number
  ): number {
    // Start with a perfect score
    let score = 100;
    
    // Deduct points for latency
    if (latencyMs > ALERTS.criticalLatency) {
      score -= 60; // Critical latency issue
    } else if (latencyMs > ALERTS.highLatency) {
      score -= 30; // High latency
    } else if (latencyMs > 1000) {
      score -= 10; // Moderate latency
    }
    
    // Deduct points for errors
    score -= consecutiveErrors * 10;
    
    // Ensure score is in valid range
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Get the current status of all networks
   */
  public getNetworkStatuses(): NetworkHealthMetrics[] {
    return Array.from(this.networkStatuses.values());
  }

  /**
   * Get the status of a specific network
   */
  public getNetworkStatus(network: string): NetworkHealthMetrics | null {
    return this.networkStatuses.get(network) || null;
  }

  /**
   * Register a callback for network status alerts
   */
  public onStatusChange(callback: (network: string, status: NetworkStatus, metrics: NetworkHealthMetrics) => void): void {
    this.alertCallbacks.push(callback);
  }

  /**
   * Trigger alerts when network status changes
   */
  private triggerAlert(network: string, status: NetworkStatus, metrics: NetworkHealthMetrics): void {
    console.log(`[NETWORK ALERT] ${network} status changed to ${status} (health: ${metrics.healthScore}/100)`);
    
    // Call all registered callbacks
    for (const callback of this.alertCallbacks) {
      try {
        callback(network, status, metrics);
      } catch (error) {
        console.error('Error in network status callback:', error);
      }
    }
  }
}

export const networkMonitor = NetworkMonitor.getInstance();
