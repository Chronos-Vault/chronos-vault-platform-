/**
 * Performance Optimization Service
 * 
 * Provides caching, rate limiting, and performance metrics for the application.
 * This service is crucial for handling high-volume requests and cross-chain operations.
 */

import { LRUCache } from 'lru-cache';
import config from '../config';

// Operation types that we track and optimize
enum OperationType {
  VAULT_CREATION = 'VAULT_CREATION',
  VAULT_VERIFICATION = 'VAULT_VERIFICATION',
  CROSS_CHAIN_TRANSFER = 'CROSS_CHAIN_TRANSFER',
  AUTHENTICATION = 'AUTHENTICATION',
  TOKEN_TRANSFER = 'TOKEN_TRANSFER',
  API_REQUEST = 'API_REQUEST'
}

// Structure to track operation statistics
interface OperationStats {
  totalExecutions: number;
  successCount: number;
  failureCount: number;
  totalExecutionTimeMs: number;
  averageExecutionTimeMs: number;
  lastExecutionTimeMs: number;
  lastExecutedAt: Date;
}

// Structure to track rate limiting information
interface RateLimitInfo {
  lastRequest: Date;
  requestCount: number;
  nextAllowedRequest: Date | null;
}

// Cache configuration with typed keys and values
interface CacheConfig<K, V> {
  maxSize: number;
  ttlMs: number;
  keyType: 'string' | 'number' | 'object';
  valueType: string;
}

/**
 * Performance Optimization Service that provides:
 * 1. LRU Caching for frequent operations
 * 2. Rate limiting to prevent abuse
 * 3. Performance metrics collection
 * 4. Adaptive batch processing
 */
class PerformanceOptimizationService {
  private initialized: boolean = false;
  
  // Caches for different operations
  private vaultDataCache: LRUCache<string, any>;
  private userDataCache: LRUCache<string, any>;
  private blockchainDataCache: LRUCache<string, any>;
  private calculationResultsCache: LRUCache<string, any>;
  
  // Rate limiting for different endpoints
  private rateLimits: Map<string, RateLimitInfo> = new Map();
  
  // Performance metrics
  private operationStats: Map<OperationType, OperationStats> = new Map();
  
  // Queue for batch processing
  private batchQueue: Map<OperationType, any[]> = new Map();
  private batchSizeThresholds: Map<OperationType, number> = new Map();
  private batchProcessingIntervalMs: number = 5000; // 5 seconds
  
  constructor() {
    // Initialize caches with appropriate configurations
    this.vaultDataCache = new LRUCache({
      max: 1000,
      ttl: 60 * 60 * 1000 // 1 hour
    });
    
    this.userDataCache = new LRUCache({
      max: 500,
      ttl: 30 * 60 * 1000 // 30 minutes
    });
    
    this.blockchainDataCache = new LRUCache({
      max: 2000,
      ttl: 10 * 60 * 1000 // 10 minutes
    });
    
    this.calculationResultsCache = new LRUCache({
      max: 5000,
      ttl: 5 * 60 * 1000 // 5 minutes
    });
    
    // Set initial batch size thresholds
    this.batchSizeThresholds.set(OperationType.TOKEN_TRANSFER, 50);
    this.batchSizeThresholds.set(OperationType.VAULT_VERIFICATION, 25);
    this.batchSizeThresholds.set(OperationType.CROSS_CHAIN_TRANSFER, 10);
    
    // Initialize stats for all operation types
    Object.values(OperationType).forEach(opType => {
      this.operationStats.set(opType as OperationType, {
        totalExecutions: 0,
        successCount: 0,
        failureCount: 0,
        totalExecutionTimeMs: 0,
        averageExecutionTimeMs: 0,
        lastExecutionTimeMs: 0,
        lastExecutedAt: new Date()
      });
      
      // Initialize batch queues
      this.batchQueue.set(opType as OperationType, []);
    });
  }
  
  /**
   * Initialize the performance optimization service
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }
    
    console.log('Initializing Performance Optimization Service...');
    
    // Start the batch processing interval
    setInterval(() => this.processBatchQueues(), this.batchProcessingIntervalMs);
    
    // Adjust rate limits based on server config
    this.configureDynamicRateLimits();
    
    this.initialized = true;
    console.log('Performance Optimization Service initialized successfully');
  }
  
  /**
   * Configure dynamic rate limits based on the server environment
   */
  private configureDynamicRateLimits(): void {
    // In development mode, set more permissive rate limits
    const requestsPerMinute = config.isDevelopmentMode ? 300 : 120;
    
    console.log(`Setting rate limits to ${requestsPerMinute} requests per minute`);
  }
  
  /**
   * Process all batch operation queues that have reached their thresholds
   */
  private processBatchQueues(): void {
    for (const [opType, queue] of this.batchQueue.entries()) {
      const threshold = this.batchSizeThresholds.get(opType);
      
      if (threshold && queue.length >= threshold) {
        const items = queue.splice(0, threshold);
        this.processBatch(opType, items);
      }
    }
  }
  
  /**
   * Process a batch of operations
   */
  private processBatch(opType: OperationType, items: any[]): void {
    console.log(`Processing batch of ${items.length} ${opType} operations`);
    
    // In a real implementation, this would perform the actual batch processing
    // such as making a single blockchain transaction for multiple transfers
  }
  
  /**
   * Cache data with a specific key
   */
  cacheData(cacheType: 'vault' | 'user' | 'blockchain' | 'calculation', key: string, data: any): void {
    const cache = this.getCacheByType(cacheType);
    cache.set(key, data);
  }
  
  /**
   * Retrieve cached data
   */
  getCachedData(cacheType: 'vault' | 'user' | 'blockchain' | 'calculation', key: string): any {
    const cache = this.getCacheByType(cacheType);
    return cache.get(key);
  }
  
  /**
   * Check if data exists in cache
   */
  hasCachedData(cacheType: 'vault' | 'user' | 'blockchain' | 'calculation', key: string): boolean {
    const cache = this.getCacheByType(cacheType);
    return cache.has(key);
  }
  
  /**
   * Delete cached data
   */
  deleteCachedData(cacheType: 'vault' | 'user' | 'blockchain' | 'calculation', key: string): void {
    const cache = this.getCacheByType(cacheType);
    cache.delete(key);
  }
  
  /**
   * Get cache by type
   */
  getCacheByType(cacheType: 'vault' | 'user' | 'blockchain' | 'calculation'): LRUCache<string, any> {
    switch (cacheType) {
      case 'vault':
        return this.vaultDataCache;
      case 'user':
        return this.userDataCache;
      case 'blockchain':
        return this.blockchainDataCache;
      case 'calculation':
        return this.calculationResultsCache;
      default:
        return this.calculationResultsCache;
    }
  }
  
  /**
   * Check rate limit for a specific endpoint
   */
  checkRateLimit(endpoint: string, clientId: string): boolean {
    const key = `${endpoint}-${clientId}`;
    const now = new Date();
    
    if (!this.rateLimits.has(key)) {
      this.rateLimits.set(key, {
        lastRequest: now,
        requestCount: 1,
        nextAllowedRequest: null
      });
      return true;
    }
    
    const limit = this.rateLimits.get(key)!;
    
    // If there's a next allowed request time and we haven't reached it yet
    if (limit.nextAllowedRequest && now < limit.nextAllowedRequest) {
      return false;
    }
    
    // Check if the last request was within the last minute
    const oneMinuteAgo = new Date(now.getTime() - 60000);
    
    if (limit.lastRequest > oneMinuteAgo) {
      // Within rate limit window
      limit.requestCount++;
      
      // Check if rate limit exceeded
      const maxRequestsPerMinute = config.isDevelopmentMode ? 300 : 120;
      
      if (limit.requestCount > maxRequestsPerMinute) {
        // Set next allowed request to 1 minute from now
        limit.nextAllowedRequest = new Date(now.getTime() + 60000);
        return false;
      }
    } else {
      // Outside rate limit window, reset counter
      limit.requestCount = 1;
      limit.nextAllowedRequest = null;
    }
    
    limit.lastRequest = now;
    return true;
  }
  
  /**
   * Track performance metrics for an operation
   */
  trackOperation(opType: OperationType, startTime: number, success: boolean): void {
    const endTime = Date.now();
    const executionTime = endTime - startTime;
    
    if (!this.operationStats.has(opType)) {
      this.operationStats.set(opType, {
        totalExecutions: 0,
        successCount: 0,
        failureCount: 0,
        totalExecutionTimeMs: 0,
        averageExecutionTimeMs: 0,
        lastExecutionTimeMs: 0,
        lastExecutedAt: new Date()
      });
    }
    
    const stats = this.operationStats.get(opType)!;
    
    stats.totalExecutions++;
    stats.totalExecutionTimeMs += executionTime;
    stats.lastExecutionTimeMs = executionTime;
    stats.lastExecutedAt = new Date();
    
    if (success) {
      stats.successCount++;
    } else {
      stats.failureCount++;
    }
    
    stats.averageExecutionTimeMs = stats.totalExecutionTimeMs / stats.totalExecutions;
  }
  
  /**
   * Get performance metrics for all operations
   */
  getPerformanceMetrics(): Map<OperationType, OperationStats> {
    return new Map(this.operationStats);
  }
  
  /**
   * Get cache statistics
   */
  getCacheStatistics(): any {
    return {
      vaultDataCache: {
        size: this.vaultDataCache.size,
        maxSize: 1000,
        items: Array.from(this.vaultDataCache.keys()).length
      },
      userDataCache: {
        size: this.userDataCache.size,
        maxSize: 500,
        items: Array.from(this.userDataCache.keys()).length
      },
      blockchainDataCache: {
        size: this.blockchainDataCache.size,
        maxSize: 2000,
        items: Array.from(this.blockchainDataCache.keys()).length
      },
      calculationResultsCache: {
        size: this.calculationResultsCache.size,
        maxSize: 5000,
        items: Array.from(this.calculationResultsCache.keys()).length
      }
    };
  }
  
  /**
   * Clear all caches
   */
  clearAllCaches(): void {
    this.vaultDataCache.clear();
    this.userDataCache.clear();
    this.blockchainDataCache.clear();
    this.calculationResultsCache.clear();
  }
  
  /**
   * Reset rate limits for a specific client
   */
  resetRateLimit(clientId: string): void {
    for (const key of this.rateLimits.keys()) {
      if (key.endsWith(`-${clientId}`)) {
        this.rateLimits.delete(key);
      }
    }
  }
  
  /**
   * Add operation to batch queue
   */
  addToBatchQueue(opType: OperationType, data: any): void {
    if (!this.batchQueue.has(opType)) {
      this.batchQueue.set(opType, []);
    }
    
    this.batchQueue.get(opType)!.push(data);
    
    // Process immediately if we've reached the threshold
    const threshold = this.batchSizeThresholds.get(opType);
    if (threshold && this.batchQueue.get(opType)!.length >= threshold) {
      const items = this.batchQueue.get(opType)!.splice(0, threshold);
      this.processBatch(opType, items);
    }
  }
  
  /**
   * Get the current adaptive batch size for an operation type
   */
  getBatchSize(opType: OperationType): number {
    return this.batchSizeThresholds.get(opType) || 1;
  }
  
  /**
   * Update the batch size threshold based on current performance
   */
  updateBatchSize(opType: OperationType, newSize: number): void {
    this.batchSizeThresholds.set(opType, newSize);
  }
}

// Export singleton instance
export const performanceOptimizer = new PerformanceOptimizationService();