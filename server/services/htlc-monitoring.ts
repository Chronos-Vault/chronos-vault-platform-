/**
 * HTLC Swap Monitoring Service
 * 
 * Monitors and alerts on failed on-chain submissions, tracking:
 * - Failed transaction reverts
 * - Swap status anomalies
 * - Consensus stalls
 * 
 * @version v3.5.22
 */

interface FailedSwapAlert {
  swapId: string;
  error: string;
  timestamp: Date;
  txHash?: string;
  sourceChain: string;
  destinationChain: string;
  amount: string;
  attempts: number;
}

interface MonitoringStats {
  totalSwaps: number;
  successfulSwaps: number;
  failedSwaps: number;
  pendingSwaps: number;
  lastFailure: Date | null;
  failureRate: number;
  alerts: FailedSwapAlert[];
}

class HTLCMonitoringService {
  private alerts: FailedSwapAlert[] = [];
  private stats: MonitoringStats = {
    totalSwaps: 0,
    successfulSwaps: 0,
    failedSwaps: 0,
    pendingSwaps: 0,
    lastFailure: null,
    failureRate: 0,
    alerts: [],
  };

  recordSwapAttempt(success: boolean) {
    this.stats.totalSwaps++;
    if (success) {
      this.stats.successfulSwaps++;
    }
    this.updateFailureRate();
  }

  recordFailure(alert: Omit<FailedSwapAlert, 'timestamp' | 'attempts'>) {
    this.stats.failedSwaps++;
    this.stats.lastFailure = new Date();

    const existingAlert = this.alerts.find(a => a.swapId === alert.swapId);
    if (existingAlert) {
      existingAlert.attempts++;
      existingAlert.error = alert.error;
      existingAlert.timestamp = new Date();
    } else {
      this.alerts.push({
        ...alert,
        timestamp: new Date(),
        attempts: 1,
      });
    }

    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-100);
    }

    this.updateFailureRate();
    this.logAlert(alert);
  }

  private updateFailureRate() {
    if (this.stats.totalSwaps > 0) {
      this.stats.failureRate = (this.stats.failedSwaps / this.stats.totalSwaps) * 100;
    }
  }

  private logAlert(alert: Omit<FailedSwapAlert, 'timestamp' | 'attempts'>) {
    console.log(`[HTLC ALERT] ⚠️ Swap failure detected:`);
    console.log(`   Swap ID: ${alert.swapId}`);
    console.log(`   Error: ${alert.error}`);
    console.log(`   Route: ${alert.sourceChain} → ${alert.destinationChain}`);
    console.log(`   Amount: ${alert.amount}`);
    if (alert.txHash) {
      console.log(`   Tx Hash: ${alert.txHash}`);
      console.log(`   Explorer: https://sepolia.arbiscan.io/tx/${alert.txHash}`);
    }
    console.log(`   Failure Rate: ${this.stats.failureRate.toFixed(2)}%`);

    if (this.stats.failureRate > 50 && this.stats.totalSwaps >= 5) {
      console.log(`[HTLC CRITICAL] ❌ High failure rate detected: ${this.stats.failureRate.toFixed(2)}%`);
      console.log(`   Consider investigating contract configuration or RPC issues.`);
    }
  }

  getStats(): MonitoringStats {
    return {
      ...this.stats,
      alerts: [...this.alerts],
    };
  }

  getRecentAlerts(count: number = 10): FailedSwapAlert[] {
    return this.alerts.slice(-count);
  }

  clearOldAlerts(maxAgeDays: number = 7) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - maxAgeDays);
    this.alerts = this.alerts.filter(a => a.timestamp > cutoff);
  }
}

export const htlcMonitor = new HTLCMonitoringService();
export type { FailedSwapAlert, MonitoringStats };
