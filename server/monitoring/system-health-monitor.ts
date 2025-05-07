/**
 * System Health Monitor
 * 
 * A service that integrates performance monitoring and security logging
 * to provide comprehensive system health insights.
 */

import { performanceOptimizer } from '../performance/optimization-service';
import { securityLogger, SecurityEventType, SecurityLogLevel } from './security-logger';
import config from '../config';

// Health status levels
export enum SystemHealthStatus {
  OPTIMAL = 'OPTIMAL',
  GOOD = 'GOOD',
  DEGRADED = 'DEGRADED',
  CRITICAL = 'CRITICAL'
}

// Component types
export enum SystemComponent {
  API_GATEWAY = 'API_GATEWAY',
  ETHEREUM_NODE = 'ETHEREUM_NODE',
  TON_NODE = 'TON_NODE',
  SOLANA_NODE = 'SOLANA_NODE',
  BITCOIN_NODE = 'BITCOIN_NODE',
  DATABASE = 'DATABASE',
  CACHE = 'CACHE',
  CROSS_CHAIN_BRIDGE = 'CROSS_CHAIN_BRIDGE',
  AUTHENTICATION = 'AUTHENTICATION'
}

// Interface for component health
interface ComponentHealth {
  status: SystemHealthStatus;
  latencyMs: number; 
  errorRate: number; // 0-1 (percentage as decimal)
  lastChecked: Date;
  details?: any;
}

// Interface for health check data
interface HealthCheckData {
  vaultOperations: {
    creationSuccess: number;
    creationFailed: number;
    accessSuccess: number;
    accessFailed: number;
    totalOperations: number;
  };
  crossChainOperations: {
    verificationSuccess: number;
    verificationFailed: number;
    totalOperations: number;
  };
  securityMetrics: {
    criticalAlerts: number;
    suspiciousActivities: number;
    authFailures: number;
  };
  performanceMetrics: {
    apiLatencyMs: number;
    databaseLatencyMs: number;
    cacheHitRate: number;
    cpuUtilization: number;
    memoryUtilization: number;
  };
}

/**
 * System Health Monitor
 * 
 * Monitors the overall health of the system by integrating:
 * - Performance metrics from the optimization service
 * - Security logs from the security logger
 * - Component-specific health checks
 */
class SystemHealthMonitor {
  private componentHealth: Map<SystemComponent, ComponentHealth> = new Map();
  private systemStatus: SystemHealthStatus = SystemHealthStatus.OPTIMAL;
  private healthCheckData: HealthCheckData = {
    vaultOperations: {
      creationSuccess: 0,
      creationFailed: 0,
      accessSuccess: 0,
      accessFailed: 0,
      totalOperations: 0
    },
    crossChainOperations: {
      verificationSuccess: 0,
      verificationFailed: 0,
      totalOperations: 0
    },
    securityMetrics: {
      criticalAlerts: 0,
      suspiciousActivities: 0,
      authFailures: 0
    },
    performanceMetrics: {
      apiLatencyMs: 0,
      databaseLatencyMs: 0,
      cacheHitRate: 0,
      cpuUtilization: 0,
      memoryUtilization: 0
    }
  };
  private lastHealthCheck: Date = new Date();
  private healthCheckInterval: NodeJS.Timeout | null = null;
  
  constructor() {
    // Initialize component health with default values
    Object.values(SystemComponent).forEach(component => {
      this.componentHealth.set(component as SystemComponent, {
        status: SystemHealthStatus.OPTIMAL,
        latencyMs: 0,
        errorRate: 0,
        lastChecked: new Date()
      });
    });
    
    // Start periodic health checks
    this.healthCheckInterval = setInterval(() => this.performHealthCheck(), 60000); // Every minute
  }
  
  /**
   * Perform a comprehensive health check of the system
   */
  private async performHealthCheck(): Promise<void> {
    try {
      // Update timestamp
      this.lastHealthCheck = new Date();
      
      // 1. Check performance metrics
      await this.checkPerformanceMetrics();
      
      // 2. Check security metrics
      await this.checkSecurityMetrics();
      
      // 3. Update overall system status
      this.updateSystemStatus();
      
      // 4. Log the health check
      if (config.isDevelopmentMode) {
        console.log(`[HEALTH CHECK] System status: ${this.systemStatus}`);
      }
      
      // Log critical issues
      if (this.systemStatus === SystemHealthStatus.CRITICAL) {
        securityLogger.critical(
          `System health degraded to CRITICAL status`,
          SecurityEventType.SYSTEM_ERROR,
          { 
            componentHealth: Object.fromEntries(this.componentHealth),
            healthCheckData: this.healthCheckData
          }
        );
      } else if (this.systemStatus === SystemHealthStatus.DEGRADED) {
        securityLogger.error(
          `System health degraded to DEGRADED status`,
          SecurityEventType.SYSTEM_ERROR,
          { 
            componentHealth: Object.fromEntries(this.componentHealth),
            healthCheckData: this.healthCheckData
          }
        );
      }
    } catch (error: any) {
      console.error('Error performing health check:', error);
      securityLogger.error(
        `Health check failed: ${error.message}`,
        SecurityEventType.SYSTEM_ERROR,
        { error: error.stack }
      );
    }
  }
  
  /**
   * Check performance metrics from the performance optimization service
   */
  private async checkPerformanceMetrics(): Promise<void> {
    try {
      // Get performance metrics
      const metrics = performanceOptimizer.getPerformanceMetrics();
      
      // Get cache statistics
      const cacheStats = performanceOptimizer.getCacheStatistics();
      
      // Update performance metrics in health check data
      const perfData = this.healthCheckData.performanceMetrics;
      
      // Convert Map to object for metrics
      const metricsObj: any = {};
      for (const [key, value] of metrics.entries()) {
        metricsObj[key] = value;
      }
      
      // Set API Gateway latency from API_REQUEST metrics if available
      if (metricsObj.API_REQUEST) {
        perfData.apiLatencyMs = metricsObj.API_REQUEST.averageExecutionTimeMs || 0;
        
        // Update API Gateway component health
        const errorRate = metricsObj.API_REQUEST.failureCount / 
                         (metricsObj.API_REQUEST.totalExecutions || 1);
        
        this.updateComponentHealth(
          SystemComponent.API_GATEWAY, 
          {
            latencyMs: perfData.apiLatencyMs,
            errorRate
          }
        );
      }
      
      // Estimate cache hit rate from all caches
      const totalSize = cacheStats.vaultDataCache.size + 
                       cacheStats.userDataCache.size + 
                       cacheStats.blockchainDataCache.size +
                       cacheStats.calculationResultsCache.size;
                       
      const totalMaxSize = cacheStats.vaultDataCache.maxSize +
                         cacheStats.userDataCache.maxSize +
                         cacheStats.blockchainDataCache.maxSize +
                         cacheStats.calculationResultsCache.maxSize;
                         
      // Calculate utilization as a proxy for hit rate (in a real system we'd track actual hit/miss)
      perfData.cacheHitRate = totalSize / totalMaxSize;
      
      // Update CACHE component health
      this.updateComponentHealth(
        SystemComponent.CACHE,
        {
          latencyMs: 0, // We don't have cache latency metrics
          errorRate: 0, // We don't have cache error metrics
          details: cacheStats
        }
      );
      
      // Vault operations - track success/failure rates
      if (metricsObj.VAULT_CREATION) {
        this.healthCheckData.vaultOperations.creationSuccess = metricsObj.VAULT_CREATION.successCount;
        this.healthCheckData.vaultOperations.creationFailed = metricsObj.VAULT_CREATION.failureCount;
      }
      
      if (metricsObj.VAULT_VERIFICATION) {
        this.healthCheckData.vaultOperations.accessSuccess = metricsObj.VAULT_VERIFICATION.successCount;
        this.healthCheckData.vaultOperations.accessFailed = metricsObj.VAULT_VERIFICATION.failureCount;
      }
      
      this.healthCheckData.vaultOperations.totalOperations = 
        this.healthCheckData.vaultOperations.creationSuccess +
        this.healthCheckData.vaultOperations.creationFailed +
        this.healthCheckData.vaultOperations.accessSuccess +
        this.healthCheckData.vaultOperations.accessFailed;
      
      // Cross-chain operations
      if (metricsObj.CROSS_CHAIN_TRANSFER) {
        this.healthCheckData.crossChainOperations.verificationSuccess = 
          metricsObj.CROSS_CHAIN_TRANSFER.successCount;
        this.healthCheckData.crossChainOperations.verificationFailed = 
          metricsObj.CROSS_CHAIN_TRANSFER.failureCount;
        this.healthCheckData.crossChainOperations.totalOperations = 
          metricsObj.CROSS_CHAIN_TRANSFER.totalExecutions;
          
        // Update CROSS_CHAIN_BRIDGE component health
        const errorRate = metricsObj.CROSS_CHAIN_TRANSFER.failureCount / 
                         (metricsObj.CROSS_CHAIN_TRANSFER.totalExecutions || 1);
        
        this.updateComponentHealth(
          SystemComponent.CROSS_CHAIN_BRIDGE, 
          {
            latencyMs: metricsObj.CROSS_CHAIN_TRANSFER.averageExecutionTimeMs,
            errorRate
          }
        );
      }
      
      // Placeholder for CPU and memory utilization
      // In a real system, these would come from infrastructure monitoring
      // For now, we'll generate some values based on operation counts
      const totalOps = this.healthCheckData.vaultOperations.totalOperations + 
                      this.healthCheckData.crossChainOperations.totalOperations;
                      
      perfData.cpuUtilization = Math.min(0.1 + (totalOps * 0.01), 0.9);
      perfData.memoryUtilization = Math.min(0.2 + (totalOps * 0.005), 0.85);
      
    } catch (error: any) {
      console.error('Error checking performance metrics:', error);
      securityLogger.error(
        `Performance metrics check failed: ${error.message}`,
        SecurityEventType.SYSTEM_ERROR,
        { error: error.stack }
      );
    }
  }
  
  /**
   * Check security metrics from the security logger
   */
  private async checkSecurityMetrics(): Promise<void> {
    try {
      // Get security metrics
      const secMetrics = securityLogger.getSecurityMetrics();
      
      // Update security metrics in health check data
      const secData = this.healthCheckData.securityMetrics;
      
      // Count specific event types
      secData.criticalAlerts = secMetrics.byLevel.CRITICAL || 0;
      secData.suspiciousActivities = secMetrics.byEventType.SUSPICIOUS_ACTIVITY || 0;
      secData.authFailures = secMetrics.byEventType.AUTH_FAILURE || 0;
      
      // Update AUTHENTICATION component health
      const authErrorRate = secData.authFailures / 
                          (secMetrics.byEventType.AUTH_ATTEMPT + 
                           secMetrics.byEventType.AUTH_SUCCESS + 
                           secMetrics.byEventType.AUTH_FAILURE || 1);
                           
      this.updateComponentHealth(
        SystemComponent.AUTHENTICATION,
        {
          latencyMs: 0, // We don't have auth latency metrics yet
          errorRate: authErrorRate,
          details: {
            attempts: secMetrics.byEventType.AUTH_ATTEMPT,
            successes: secMetrics.byEventType.AUTH_SUCCESS,
            failures: secMetrics.byEventType.AUTH_FAILURE
          }
        }
      );
      
      // Check log integrity
      if (!secMetrics.logIntegrityIntact) {
        securityLogger.critical(
          'Security log integrity compromised - possible tampering detected',
          SecurityEventType.SUSPICIOUS_ACTIVITY,
          { logIntegrityIntact: false }
        );
        
        // Update system status directly 
        this.systemStatus = SystemHealthStatus.CRITICAL;
      }
      
    } catch (error: any) {
      console.error('Error checking security metrics:', error);
      securityLogger.error(
        `Security metrics check failed: ${error.message}`,
        SecurityEventType.SYSTEM_ERROR,
        { error: error.stack }
      );
    }
  }
  
  /**
   * Update the health status of a specific component
   */
  updateComponentHealth(
    component: SystemComponent, 
    data: {
      latencyMs?: number;
      errorRate?: number;
      details?: any;
    }
  ): void {
    if (!this.componentHealth.has(component)) {
      this.componentHealth.set(component, {
        status: SystemHealthStatus.OPTIMAL,
        latencyMs: 0,
        errorRate: 0,
        lastChecked: new Date()
      });
    }
    
    const health = this.componentHealth.get(component)!;
    
    // Update provided values
    if (data.latencyMs !== undefined) health.latencyMs = data.latencyMs;
    if (data.errorRate !== undefined) health.errorRate = data.errorRate;
    if (data.details !== undefined) health.details = data.details;
    
    // Update timestamp
    health.lastChecked = new Date();
    
    // Update status based on metrics
    if (health.errorRate > 0.3 || health.latencyMs > 5000) {
      health.status = SystemHealthStatus.CRITICAL;
    } else if (health.errorRate > 0.1 || health.latencyMs > 2000) {
      health.status = SystemHealthStatus.DEGRADED;
    } else if (health.errorRate > 0.01 || health.latencyMs > 1000) {
      health.status = SystemHealthStatus.GOOD;
    } else {
      health.status = SystemHealthStatus.OPTIMAL;
    }
    
    // If component is in critical state, log it
    if (health.status === SystemHealthStatus.CRITICAL) {
      securityLogger.error(
        `Component ${component} health degraded to CRITICAL`,
        SecurityEventType.SYSTEM_ERROR,
        { 
          component,
          health 
        }
      );
    }
  }
  
  /**
   * Update the overall system status based on component health
   */
  private updateSystemStatus(): void {
    let criticalCount = 0;
    let degradedCount = 0;
    let goodCount = 0;
    let optimalCount = 0;
    
    for (const health of this.componentHealth.values()) {
      switch (health.status) {
        case SystemHealthStatus.CRITICAL:
          criticalCount++;
          break;
        case SystemHealthStatus.DEGRADED:
          degradedCount++;
          break;
        case SystemHealthStatus.GOOD:
          goodCount++;
          break;
        case SystemHealthStatus.OPTIMAL:
          optimalCount++;
          break;
      }
    }
    
    // Update system status based on component counts
    if (criticalCount > 0) {
      this.systemStatus = SystemHealthStatus.CRITICAL;
    } else if (degradedCount > 1) { 
      this.systemStatus = SystemHealthStatus.DEGRADED;
    } else if (degradedCount === 1 || goodCount > 2) {
      this.systemStatus = SystemHealthStatus.GOOD;
    } else {
      this.systemStatus = SystemHealthStatus.OPTIMAL;
    }
  }
  
  /**
   * Get the current health status of the system
   */
  getSystemHealth(): any {
    // Return a comprehensive health report
    return {
      status: this.systemStatus,
      lastChecked: this.lastHealthCheck,
      components: Object.fromEntries(this.componentHealth),
      metrics: this.healthCheckData,
      logIntegrity: securityLogger.verifyLogIntegrity()
    };
  }
  
  /**
   * Check if a specific component is healthy
   */
  isComponentHealthy(component: SystemComponent): boolean {
    if (!this.componentHealth.has(component)) return false;
    
    const health = this.componentHealth.get(component)!;
    return health.status === SystemHealthStatus.OPTIMAL || 
           health.status === SystemHealthStatus.GOOD;
  }
  
  /**
   * Force a health check to run immediately
   */
  async forceHealthCheck(): Promise<any> {
    await this.performHealthCheck();
    return this.getSystemHealth();
  }
  
  /**
   * Clear interval on shutdown
   */
  shutdown(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }
}

// Export singleton instance
export const systemHealthMonitor = new SystemHealthMonitor();