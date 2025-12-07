/**
 * Atomic Swap Metrics & Monitoring
 * 
 * Tracks performance, success rates, and system health
 * for Trinity Protocol HTLC atomic swaps
 * 
 * @author Chronos Vault Team
 * @version v3.0-PRODUCTION
 */

interface SwapMetrics {
  total: number;
  successful: number;
  failed: number;
  pending: number;
  refunded: number;
  averageCompletionTime: number;
  totalValueUSD: number;
}

interface PerformanceMetrics {
  avgSwapCreationTime: number;
  avgConsensusTime: number;
  avgClaimTime: number;
  p95SwapCreationTime: number;
  p99SwapCreationTime: number;
}

interface NetworkMetrics {
  [network: string]: {
    swapCount: number;
    successRate: number;
    avgGasCost: string;
  };
}

interface TokenPairMetrics {
  [pair: string]: {
    swapCount: number;
    totalVolume: string;
    successRate: number;
  };
}

export class AtomicSwapMetrics {
  private static instance: AtomicSwapMetrics;
  
  // In-memory metrics (reset on restart - production should use Redis/TimescaleDB)
  private swapMetrics: Map<string, any> = new Map();
  private performanceTimes: number[] = [];
  private networkStats: Map<string, any> = new Map();
  private tokenPairStats: Map<string, any> = new Map();
  
  // Rate limiting tracking
  private userSwapCounts: Map<string, { count: number; resetTime: number }> = new Map();
  
  private constructor() {
    // Start periodic cleanup
    this.startPeriodicCleanup();
  }
  
  public static getInstance(): AtomicSwapMetrics {
    if (!AtomicSwapMetrics.instance) {
      AtomicSwapMetrics.instance = new AtomicSwapMetrics();
    }
    return AtomicSwapMetrics.instance;
  }
  
  /**
   * Record swap creation
   */
  recordSwapCreation(orderId: string, data: {
    userAddress: string;
    fromToken: string;
    toToken: string;
    fromNetwork: string;
    toNetwork: string;
    amount: string;
  }): void {
    this.swapMetrics.set(orderId, {
      ...data,
      status: 'created',
      createdAt: Date.now(),
      events: [{ type: 'created', timestamp: Date.now() }]
    });
    
    // Track network stats
    this.incrementNetworkStat(data.fromNetwork, 'swapCount');
    
    // Track token pair stats
    const pair = `${data.fromToken}-${data.toToken}`;
    this.incrementTokenPairStat(pair, 'swapCount');
  }
  
  /**
   * Record swap status change
   */
  recordStatusChange(orderId: string, newStatus: string): void {
    const swap = this.swapMetrics.get(orderId);
    if (swap) {
      swap.status = newStatus;
      swap.events.push({ type: newStatus, timestamp: Date.now() });
      
      if (newStatus === 'executed') {
        swap.completedAt = Date.now();
        const completionTime = swap.completedAt - swap.createdAt;
        this.performanceTimes.push(completionTime);
      }
    }
  }
  
  /**
   * Record performance timing
   */
  recordTiming(operation: string, durationMs: number): void {
    const key = `timing_${operation}`;
    const existing = this.swapMetrics.get(key) || [];
    existing.push(durationMs);
    
    // Keep last 1000 measurements
    if (existing.length > 1000) {
      existing.shift();
    }
    
    this.swapMetrics.set(key, existing);
  }
  
  /**
   * Get current swap metrics
   */
  getSwapMetrics(): SwapMetrics {
    let total = 0;
    let successful = 0;
    let failed = 0;
    let pending = 0;
    let refunded = 0;
    let totalValueUSD = 0;
    let completionTimes: number[] = [];
    
    for (const [_, swap] of this.swapMetrics) {
      if (swap.status) {
        total++;
        switch (swap.status) {
          case 'executed':
            successful++;
            if (swap.completedAt && swap.createdAt) {
              completionTimes.push(swap.completedAt - swap.createdAt);
            }
            break;
          case 'failed':
            failed++;
            break;
          case 'pending':
          case 'locked':
          case 'consensus_pending':
          case 'consensus_achieved':
            pending++;
            break;
          case 'refunded':
            refunded++;
            break;
        }
      }
    }
    
    const avgCompletionTime = completionTimes.length > 0
      ? completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length
      : 0;
    
    return {
      total,
      successful,
      failed,
      pending,
      refunded,
      averageCompletionTime: Math.round(avgCompletionTime),
      totalValueUSD
    };
  }
  
  /**
   * Get performance metrics
   */
  getPerformanceMetrics(): PerformanceMetrics {
    const creationTimes = this.swapMetrics.get('timing_swap_creation') || [];
    const consensusTimes = this.swapMetrics.get('timing_consensus') || [];
    const claimTimes = this.swapMetrics.get('timing_claim') || [];
    
    return {
      avgSwapCreationTime: this.calculateAverage(creationTimes),
      avgConsensusTime: this.calculateAverage(consensusTimes),
      avgClaimTime: this.calculateAverage(claimTimes),
      p95SwapCreationTime: this.calculatePercentile(creationTimes, 95),
      p99SwapCreationTime: this.calculatePercentile(creationTimes, 99)
    };
  }
  
  /**
   * Get network-specific metrics
   */
  getNetworkMetrics(): NetworkMetrics {
    const metrics: NetworkMetrics = {};
    
    for (const [network, stats] of this.networkStats) {
      metrics[network] = {
        swapCount: stats.swapCount || 0,
        successRate: this.calculateSuccessRate(network),
        avgGasCost: stats.avgGasCost || '0'
      };
    }
    
    return metrics;
  }
  
  /**
   * Get token pair metrics
   */
  getTokenPairMetrics(): TokenPairMetrics {
    const metrics: TokenPairMetrics = {};
    
    for (const [pair, stats] of this.tokenPairStats) {
      metrics[pair] = {
        swapCount: stats.swapCount || 0,
        totalVolume: stats.totalVolume || '0',
        successRate: stats.successRate || 0
      };
    }
    
    return metrics;
  }
  
  /**
   * Get comprehensive metrics report
   */
  getMetricsReport(): {
    swaps: SwapMetrics;
    performance: PerformanceMetrics;
    networks: NetworkMetrics;
    tokenPairs: TokenPairMetrics;
    timestamp: number;
  } {
    return {
      swaps: this.getSwapMetrics(),
      performance: this.getPerformanceMetrics(),
      networks: this.getNetworkMetrics(),
      tokenPairs: this.getTokenPairMetrics(),
      timestamp: Date.now()
    };
  }
  
  /**
   * Export metrics for Prometheus/Datadog
   */
  exportPrometheusMetrics(): string {
    const swapMetrics = this.getSwapMetrics();
    const perfMetrics = this.getPerformanceMetrics();
    
    return `
# HELP atomic_swap_total Total number of atomic swaps
# TYPE atomic_swap_total counter
atomic_swap_total ${swapMetrics.total}

# HELP atomic_swap_successful Number of successful swaps
# TYPE atomic_swap_successful counter
atomic_swap_successful ${swapMetrics.successful}

# HELP atomic_swap_failed Number of failed swaps
# TYPE atomic_swap_failed counter
atomic_swap_failed ${swapMetrics.failed}

# HELP atomic_swap_pending Number of pending swaps
# TYPE atomic_swap_pending gauge
atomic_swap_pending ${swapMetrics.pending}

# HELP atomic_swap_avg_completion_time Average swap completion time in ms
# TYPE atomic_swap_avg_completion_time gauge
atomic_swap_avg_completion_time ${swapMetrics.averageCompletionTime}

# HELP atomic_swap_creation_time_p95 95th percentile swap creation time in ms
# TYPE atomic_swap_creation_time_p95 gauge
atomic_swap_creation_time_p95 ${perfMetrics.p95SwapCreationTime}

# HELP atomic_swap_creation_time_p99 99th percentile swap creation time in ms
# TYPE atomic_swap_creation_time_p99 gauge
atomic_swap_creation_time_p99 ${perfMetrics.p99SwapCreationTime}
`.trim();
  }
  
  // Helper methods
  
  private calculateAverage(values: number[]): number {
    if (values.length === 0) return 0;
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  }
  
  private calculatePercentile(values: number[], percentile: number): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return Math.round(sorted[index] || 0);
  }
  
  private calculateSuccessRate(network: string): number {
    let total = 0;
    let successful = 0;
    
    for (const [_, swap] of this.swapMetrics) {
      if (swap.fromNetwork === network || swap.toNetwork === network) {
        total++;
        if (swap.status === 'executed') successful++;
      }
    }
    
    return total > 0 ? (successful / total) * 100 : 0;
  }
  
  private incrementNetworkStat(network: string, key: string): void {
    const stats = this.networkStats.get(network) || {};
    stats[key] = (stats[key] || 0) + 1;
    this.networkStats.set(network, stats);
  }
  
  private incrementTokenPairStat(pair: string, key: string): void {
    const stats = this.tokenPairStats.get(pair) || {};
    stats[key] = (stats[key] || 0) + 1;
    this.tokenPairStats.set(pair, stats);
  }
  
  private startPeriodicCleanup(): void {
    // Clean up old metrics every hour
    setInterval(() => {
      const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
      
      for (const [orderId, swap] of this.swapMetrics) {
        if (swap.createdAt && swap.createdAt < oneDayAgo) {
          this.swapMetrics.delete(orderId);
        }
      }
      
      // Keep only last 1000 performance measurements
      if (this.performanceTimes.length > 1000) {
        this.performanceTimes = this.performanceTimes.slice(-1000);
      }
    }, 60 * 60 * 1000); // Every hour
  }
}

// Export singleton instance
export const atomicSwapMetrics = AtomicSwapMetrics.getInstance();
