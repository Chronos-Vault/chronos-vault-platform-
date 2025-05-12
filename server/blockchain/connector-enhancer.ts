/**
 * Blockchain Connector Enhancer
 * 
 * This module wraps blockchain connectors with enhanced reliability features,
 * including automatic retries, exponential backoff, error normalization,
 * and chain-specific edge case handling.
 */

import { BlockchainConnector } from '../../shared/interfaces/blockchain-connector';
import { edgeCaseHandler } from './edge-case-handler';
import { securityLogger } from '../monitoring/security-logger';
import { BlockchainType } from '../../shared/types';
import config from '../config';

/**
 * Enhanced connection options
 */
export interface EnhancedConnectionOptions {
  maxAttempts?: number;
  timeoutMs?: number;
  fallbackEndpoints?: string[];
  handleNetworkOutage?: boolean;
}

/**
 * Enhanced transaction options
 */
export interface EnhancedTransactionOptions {
  maxAttempts?: number;
  optimizeOnFailure?: boolean;
  timeoutMs?: number;
  waitForConfirmation?: boolean;
  confirmationBlocks?: number;
}

/**
 * Connector Enhancer Class
 */
export class ConnectorEnhancer {
  private connector: BlockchainConnector;
  private chainId: BlockchainType;
  private endpoints: Map<string, string> = new Map();
  private isSimulated: boolean;
  private maxRetries: number = 3;
  private retryDelayMs: number = 1000;
  private timeoutMs: number = 30000;
  private exponentialBackoff: boolean = true;
  private cacheTtlMs: number = 60000;
  private priorityEndpoint: string = 'default';
  
  constructor(connector: BlockchainConnector, chainId: BlockchainType) {
    this.connector = connector;
    this.chainId = chainId;
    this.isSimulated = config.shouldSimulateBlockchain(chainId);
    
    // Log enhancer initialization
    securityLogger.info(`Enhanced reliability wrapper initialized for ${chainId} connector`, {
      chainId,
      isSimulated: this.isSimulated
    });
  }
  
  /**
   * Add fallback endpoints
   */
  public addEndpoint(name: string, endpoint: string): void {
    this.endpoints.set(name, endpoint);
  }
  
  /**
   * Enhance a function call with retry logic
   */
  private async enhanceWithRetry<T, A extends any[]>(
    fn: (...args: A) => Promise<T>,
    operationType: 'connection' | 'transaction' | 'validation',
    context: Record<string, any>,
    ...args: A
  ): Promise<T> {
    // Skip enhancement for simulated connectors
    if (this.isSimulated) {
      return fn(...args);
    }
    
    // Use the custom retry configuration
    const retryConfig = {
      maxRetries: this.maxRetries,
      delayMs: this.retryDelayMs,
      exponentialBackoff: this.exponentialBackoff,
      timeoutMs: this.timeoutMs,
      priorityEndpoint: this.priorityEndpoint,
      cacheTtlMs: this.cacheTtlMs
    };
    
    // Merge retry configuration with existing context
    const enhancedContext = {
      ...context,
      retryConfig
    };
    
    // If we have a priority endpoint, use it instead of the default
    if (this.priorityEndpoint !== 'default' && this.endpoints.has(this.priorityEndpoint)) {
      enhancedContext.endpoint = this.endpoints.get(this.priorityEndpoint);
    }
    
    return edgeCaseHandler.withRetry(
      () => fn(...args),
      this.chainId,
      operationType,
      enhancedContext
    );
  }
  
  /**
   * Connect with enhanced reliability
   */
  public async connect(options: EnhancedConnectionOptions = {}): Promise<string> {
    try {
      // Use the edge case handler's retry wrapper
      return await this.enhanceWithRetry(
        this.connector.connect.bind(this.connector),
        'connection',
        { 
          endpoint: this.endpoints.get('default') || 'primary',
          ...options
        }
      );
    } catch (error) {
      // If network outage is detected, try fallback behavior
      if (options.handleNetworkOutage && edgeCaseHandler.isNetworkOutage(this.chainId)) {
        securityLogger.warn(`Network outage detected for ${this.chainId}, using fallback options`, {
          chainId: this.chainId
        });
        
        if (this.isSimulated) {
          return 'simulated_address_fallback';
        }
        
        throw error;
      }
      
      throw error;
    }
  }
  
  /**
   * Create vault with enhanced reliability and error handling
   */
  public async createVault(
    params: any, 
    options: EnhancedTransactionOptions = {}
  ): Promise<any> {
    if (this.isSimulated) {
      return this.connector.createVault(params);
    }
    
    try {
      // Attempt vault creation with retry logic
      return await this.enhanceWithRetry(
        this.connector.createVault.bind(this.connector),
        'transaction',
        {
          endpoint: this.endpoints.get('default') || 'primary',
          txType: 'createVault',
          ...options
        },
        params
      );
    } catch (error) {
      // Handle the transaction error to determine if we should retry with modifications
      const { shouldRetry, solution, crossChainError } = await edgeCaseHandler.handleTransactionError(
        error,
        this.chainId,
        { txType: 'createVault', ...params },
        { recoveryAttempts: 0 }
      );
      
      // If we should retry and can optimize, do so
      if (shouldRetry && solution && options.optimizeOnFailure !== false) {
        const optimizedParams = edgeCaseHandler.optimizeTransaction(
          this.chainId,
          params,
          solution
        );
        
        securityLogger.info(`Retrying createVault with optimized parameters for ${this.chainId}`, {
          solution,
          originalParams: Object.keys(params),
          optimizedParams: Object.keys(optimizedParams)
        });
        
        // Try again with optimized parameters
        return await this.connector.createVault(optimizedParams);
      }
      
      // Otherwise, rethrow the error
      throw error;
    }
  }
  
  /**
   * Lock assets with enhanced reliability
   */
  public async lockAssets(
    vaultId: string,
    amount: string,
    assetType: string,
    options: EnhancedTransactionOptions = {}
  ): Promise<any> {
    if (this.isSimulated) {
      return this.connector.lockAssets(vaultId, amount, assetType);
    }
    
    try {
      // Attempt asset locking with retry logic
      return await this.enhanceWithRetry(
        this.connector.lockAssets.bind(this.connector),
        'transaction',
        {
          endpoint: this.endpoints.get('default') || 'primary',
          txType: 'lockAssets',
          vaultId,
          ...options
        },
        vaultId,
        amount,
        assetType
      );
    } catch (error) {
      // Handle the transaction error to determine if we should retry with modifications
      const { shouldRetry, solution, crossChainError } = await edgeCaseHandler.handleTransactionError(
        error,
        this.chainId,
        { 
          txType: 'lockAssets', 
          vaultId, 
          amount, 
          assetType 
        },
        { recoveryAttempts: 0 }
      );
      
      // If we should retry and can optimize, do so
      if (shouldRetry && solution && options.optimizeOnFailure !== false) {
        // For lock assets, we may need special optimization
        if (solution === 'checkBalance' || solution === 'insufficientFunds') {
          throw new Error(`Insufficient funds to lock ${amount} ${assetType} in vault ${vaultId}`);
        }
        
        securityLogger.info(`Retrying lockAssets with solution ${solution} for ${this.chainId}`, {
          solution,
          vaultId,
          amount,
          assetType
        });
        
        // Try again with same parameters but potentially optimized transaction properties
        return await this.connector.lockAssets(vaultId, amount, assetType);
      }
      
      // Otherwise, rethrow the error
      throw error;
    }
  }
  
  /**
   * Unlock assets with enhanced reliability
   */
  public async unlockAssets(
    vaultId: string,
    options: EnhancedTransactionOptions = {}
  ): Promise<any> {
    if (this.isSimulated) {
      return this.connector.unlockAssets(vaultId);
    }
    
    try {
      // Attempt asset unlocking with retry logic
      return await this.enhanceWithRetry(
        this.connector.unlockAssets.bind(this.connector),
        'transaction',
        {
          endpoint: this.endpoints.get('default') || 'primary',
          txType: 'unlockAssets',
          vaultId,
          ...options
        },
        vaultId
      );
    } catch (error) {
      // Handle the transaction error
      const { shouldRetry, solution, crossChainError } = await edgeCaseHandler.handleTransactionError(
        error,
        this.chainId,
        { txType: 'unlockAssets', vaultId },
        { recoveryAttempts: 0 }
      );
      
      // If we should retry and can optimize, do so
      if (shouldRetry && solution && options.optimizeOnFailure !== false) {
        securityLogger.info(`Retrying unlockAssets with solution ${solution} for ${this.chainId}`, {
          solution,
          vaultId
        });
        
        // Try again with optimized parameters
        return await this.connector.unlockAssets(vaultId);
      }
      
      // Otherwise, rethrow the error
      throw error;
    }
  }
  
  /**
   * Verify vault integrity with enhanced reliability
   */
  public async verifyVaultIntegrity(
    vaultId: string,
    options: EnhancedTransactionOptions = {}
  ): Promise<any> {
    if (this.isSimulated) {
      return this.connector.verifyVaultIntegrity(vaultId);
    }
    
    try {
      // Attempt verification with retry logic
      return await this.enhanceWithRetry(
        this.connector.verifyVaultIntegrity.bind(this.connector),
        'validation',
        {
          endpoint: this.endpoints.get('default') || 'primary',
          txType: 'verifyVaultIntegrity',
          vaultId,
          ...options
        },
        vaultId
      );
    } catch (error) {
      // For integrity verification, network outages are particularly problematic
      // We might want to be more cautious here
      if (edgeCaseHandler.isNetworkOutage(this.chainId)) {
        securityLogger.warn(`Network outage during vault integrity verification for ${this.chainId}`, {
          vaultId,
          chainId: this.chainId
        });
        
        // Return a "pending" result rather than a validation failure
        return {
          isValid: null, // null indicates pending/inconclusive
          signatures: [],
          verifiedAt: new Date(),
          chainId: this.chainId,
          status: 'pending',
          reason: 'Network outage detected, verification postponed'
        };
      }
      
      throw error;
    }
  }
  
  /**
   * Add beneficiary with enhanced reliability
   */
  public async addBeneficiary(
    vaultId: string,
    beneficiaryAddress: string,
    options: EnhancedTransactionOptions = {}
  ): Promise<any> {
    if (this.isSimulated) {
      return this.connector.addBeneficiary(vaultId, beneficiaryAddress);
    }
    
    try {
      // Attempt to add beneficiary with retry logic
      return await this.enhanceWithRetry(
        this.connector.addBeneficiary.bind(this.connector),
        'transaction',
        {
          endpoint: this.endpoints.get('default') || 'primary',
          txType: 'addBeneficiary',
          vaultId,
          beneficiaryAddress,
          ...options
        },
        vaultId,
        beneficiaryAddress
      );
    } catch (error) {
      // Handle the transaction error
      const { shouldRetry, solution, crossChainError } = await edgeCaseHandler.handleTransactionError(
        error,
        this.chainId,
        { txType: 'addBeneficiary', vaultId, beneficiaryAddress },
        { recoveryAttempts: 0 }
      );
      
      // If we should retry and can optimize, do so
      if (shouldRetry && solution && options.optimizeOnFailure !== false) {
        securityLogger.info(`Retrying addBeneficiary with solution ${solution} for ${this.chainId}`, {
          solution,
          vaultId,
          beneficiaryAddress
        });
        
        // Try again with optimized parameters
        return await this.connector.addBeneficiary(vaultId, beneficiaryAddress);
      }
      
      // Otherwise, rethrow the error
      throw error;
    }
  }
  
  // Helper method to reset connection failure tracking after successful operations
  public resetConnectionStatus(endpoint: string = 'default'): void {
    const actualEndpoint = this.endpoints.get(endpoint) || endpoint;
    edgeCaseHandler.resetEndpointStatus(actualEndpoint);
  }
  
  // Expose the underlying connector for methods we haven't enhanced
  public getUnderlyingConnector(): BlockchainConnector {
    return this.connector;
  }
  
  /**
   * Set maximum number of retry attempts
   */
  public setMaxRetries(maxRetries: number): void {
    this.maxRetries = maxRetries;
  }
  
  /**
   * Set retry delay in milliseconds
   */
  public setRetryDelay(retryDelayMs: number): void {
    this.retryDelayMs = retryDelayMs;
  }
  
  /**
   * Set timeout in milliseconds
   */
  public setTimeout(timeoutMs: number): void {
    this.timeoutMs = timeoutMs;
  }
  
  /**
   * Set whether to use exponential backoff for retries
   */
  public setExponentialBackoff(exponentialBackoff: boolean): void {
    this.exponentialBackoff = exponentialBackoff;
  }
  
  /**
   * Set cache TTL in milliseconds
   */
  public setCacheTtl(cacheTtlMs: number): void {
    this.cacheTtlMs = cacheTtlMs;
  }
  
  /**
   * Set priority endpoint name
   */
  public setPriorityEndpoint(endpointName: string): void {
    if (this.endpoints.has(endpointName)) {
      this.priorityEndpoint = endpointName;
    }
  }
}

/**
 * Create an enhanced blockchain connector
 */
/**
 * Enhancement options for connector
 */
export interface EnhancementOptions {
  maxRetries?: number;
  retryDelayMs?: number;
  timeoutMs?: number;
  exponentialBackoff?: boolean;
  cacheTtlMs?: number;
  priorityEndpoint?: string;
}

/**
 * Default enhancement options
 */
const DEFAULT_ENHANCEMENT_OPTIONS: EnhancementOptions = {
  maxRetries: 3,
  retryDelayMs: 1000,
  timeoutMs: 30000,
  exponentialBackoff: true,
  cacheTtlMs: 60000
};

/**
 * Enhance a blockchain connector with additional functionality
 * 
 * @param connector The base blockchain connector to enhance
 * @param chainId The blockchain identifier
 * @param endpoints Optional map of named endpoints
 * @param options Optional enhancement configuration options
 * @returns An enhanced connector with additional reliability features
 */
export function enhanceConnector(
  connector: BlockchainConnector, 
  chainId: BlockchainType,
  endpoints: Record<string, string> = {},
  options?: EnhancementOptions
): ConnectorEnhancer {
  // Create a new enhancer with the connector
  const enhancer = new ConnectorEnhancer(connector, chainId);
  
  // Add endpoints
  for (const [name, url] of Object.entries(endpoints)) {
    enhancer.addEndpoint(name, url);
  }
  
  // Apply custom enhancement options if provided
  if (options) {
    // Merge with defaults
    const mergedOptions = {
      ...DEFAULT_ENHANCEMENT_OPTIONS,
      ...options
    };
    
    // Apply enhancements
    enhancer.setMaxRetries(mergedOptions.maxRetries!);
    enhancer.setRetryDelay(mergedOptions.retryDelayMs!);
    enhancer.setTimeout(mergedOptions.timeoutMs!);
    enhancer.setExponentialBackoff(mergedOptions.exponentialBackoff!);
    
    if (mergedOptions.cacheTtlMs) {
      enhancer.setCacheTtl(mergedOptions.cacheTtlMs);
    }
    
    if (mergedOptions.priorityEndpoint && endpoints[mergedOptions.priorityEndpoint]) {
      enhancer.setPriorityEndpoint(mergedOptions.priorityEndpoint);
    }
  }
  
  return enhancer;
}