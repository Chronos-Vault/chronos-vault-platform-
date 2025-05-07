/**
 * Cross-Chain Stress Testing
 * 
 * This module provides comprehensive stress testing for cross-chain operations,
 * focusing on reliability, performance, and security under heavy load.
 */

import { securityLogger } from '../monitoring/security-logger';
import { ethersClient } from '../blockchain/ethereum-client';
import { solanaClient } from '../blockchain/solana-client';
import { tonClient } from '../blockchain/ton-client';
import { crossChainBridge } from '../blockchain/cross-chain-bridge';
import { crossChainVerification } from '../security/cross-chain-verification-protocol';
import { BlockchainType } from '../../shared/types';
import config from '../config';
import { 
  BlockchainError, 
  BlockchainErrorCategory,
  createBlockchainError,
  withBlockchainErrorHandling 
} from '../blockchain/enhanced-error-handling';

// Result interface for test runs
export interface StressTestResult {
  name: string;
  success: boolean;
  durationMs: number;
  operationsPerSecond: number;
  errorRate: number;
  errors: {
    category: string;
    count: number;
    examples: string[];
  }[];
  timestamp: number;
  details: any;
}

// Configuration interface for stress tests
export interface StressTestConfig {
  iterations: number;
  concurrency: number;
  delay: number;
  timeoutMs: number;
  chains: BlockchainType[];
}

class CrossChainStressTester {
  private initialized = false;
  
  /**
   * Initialize the stress tester
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }
    
    try {
      securityLogger.info('Initializing cross-chain stress tester');
      
      // Initialize all required clients
      if (!ethersClient.isInitialized()) {
        await ethersClient.initialize();
      }
      
      if (!solanaClient.isInitialized()) {
        await solanaClient.initialize();
      }
      
      if (!tonClient.isInitialized()) {
        await tonClient.initialize();
      }
      
      if (!crossChainBridge.isInitialized()) {
        await crossChainBridge.initialize();
      }
      
      this.initialized = true;
      securityLogger.info('Cross-chain stress tester initialized successfully');
    } catch (error) {
      securityLogger.error('Failed to initialize cross-chain stress tester', error);
      throw error;
    }
  }
  
  /**
   * Run a bridge stress test
   */
  async runBridgeStressTest(
    config: StressTestConfig
  ): Promise<StressTestResult> {
    if (!this.initialized) {
      await this.initialize();
    }
    
    const startTime = Date.now();
    const errors: any[] = [];
    const operationResults: { success: boolean; duration: number }[] = [];
    
    securityLogger.info('Starting bridge stress test', config);
    
    // Generate test vaults
    const testVaults = Array.from({ length: config.iterations }).map((_, i) => ({
      id: `stress-test-vault-${Date.now()}-${i}`,
      owner: `stress-test-owner-${Date.now()}-${i}`
    }));
    
    // Set up chains to test
    const chains = config.chains.length > 0 ? config.chains : ['ETH', 'SOL', 'TON'];
    
    // Run the operations with the specified concurrency
    await this.runWithConcurrency(
      async (index) => {
        const vault = testVaults[index];
        const sourceChain = chains[index % chains.length];
        const targetChain = chains[(index + 1) % chains.length];
        
        const opStartTime = Date.now();
        try {
          // Perform a bridge operation
          const result = await crossChainBridge.bridgeVaultVerification(
            vault.id,
            sourceChain,
            targetChain,
            vault.owner
          );
          
          const opDuration = Date.now() - opStartTime;
          operationResults.push({ success: result.success, duration: opDuration });
          
          return result;
        } catch (error) {
          const opDuration = Date.now() - opStartTime;
          operationResults.push({ success: false, duration: opDuration });
          
          // Record the error
          if (error instanceof BlockchainError) {
            errors.push({
              category: error.category,
              blockchain: error.blockchain,
              message: error.message,
              context: error.context
            });
          } else {
            errors.push({
              category: 'UNKNOWN',
              message: error instanceof Error ? error.message : 'Unknown error'
            });
          }
          
          // Rethrow in development mode for debugging
          if (config.isDevelopmentMode) {
            throw error;
          }
          
          return null;
        }
      },
      testVaults.length,
      config.concurrency,
      config.delay
    );
    
    const endTime = Date.now();
    const totalDuration = endTime - startTime;
    
    // Calculate performance metrics
    const successfulOps = operationResults.filter(r => r.success).length;
    const operationsPerSecond = (successfulOps / totalDuration) * 1000;
    const errorRate = errors.length / testVaults.length;
    
    // Group errors by category
    const errorsByCategory: Record<string, { count: number; examples: string[] }> = {};
    
    errors.forEach(error => {
      const category = error.category || 'UNKNOWN';
      
      if (!errorsByCategory[category]) {
        errorsByCategory[category] = { count: 0, examples: [] };
      }
      
      errorsByCategory[category].count++;
      
      if (errorsByCategory[category].examples.length < 3) {
        errorsByCategory[category].examples.push(error.message);
      }
    });
    
    // Format error categories for the result
    const errorCategories = Object.entries(errorsByCategory).map(([category, data]) => ({
      category,
      count: data.count,
      examples: data.examples
    }));
    
    // Create the final test result
    const result: StressTestResult = {
      name: 'Bridge Stress Test',
      success: errors.length === 0,
      durationMs: totalDuration,
      operationsPerSecond,
      errorRate,
      errors: errorCategories,
      timestamp: Date.now(),
      details: {
        iterations: config.iterations,
        concurrency: config.concurrency,
        chains,
        averageOperationTimeMs: operationResults.reduce((sum, r) => sum + r.duration, 0) / operationResults.length,
        maxOperationTimeMs: Math.max(...operationResults.map(r => r.duration)),
        minOperationTimeMs: Math.min(...operationResults.map(r => r.duration))
      }
    };
    
    securityLogger.info('Bridge stress test completed', {
      durationMs: result.durationMs,
      operationsPerSecond: result.operationsPerSecond,
      errorRate: result.errorRate,
      errors: result.errors.length
    });
    
    return result;
  }
  
  /**
   * Run a cross-chain verification stress test
   */
  async runVerificationStressTest(
    config: StressTestConfig
  ): Promise<StressTestResult> {
    if (!this.initialized) {
      await this.initialize();
    }
    
    const startTime = Date.now();
    const errors: any[] = [];
    const operationResults: { success: boolean; duration: number }[] = [];
    
    securityLogger.info('Starting verification stress test', config);
    
    // Generate test vaults
    const testVaults = Array.from({ length: config.iterations }).map((_, i) => ({
      id: `stress-verify-${Date.now()}-${i}`,
      data: `data-${Date.now()}-${i}`
    }));
    
    // Set up chains to test
    const chains = config.chains.length > 0 ? config.chains : ['ETH', 'SOL', 'TON'];
    
    // Run the operations with the specified concurrency
    await this.runWithConcurrency(
      async (index) => {
        const vault = testVaults[index];
        const primaryChain = chains[index % chains.length];
        const secondaryChains = chains.filter(chain => chain !== primaryChain);
        
        const opStartTime = Date.now();
        try {
          // Perform a cross-chain verification
          const result = await crossChainVerification.verifyVaultAcrossChains(
            vault.id,
            primaryChain,
            secondaryChains
          );
          
          const opDuration = Date.now() - opStartTime;
          operationResults.push({ success: result.success, duration: opDuration });
          
          return result;
        } catch (error) {
          const opDuration = Date.now() - opStartTime;
          operationResults.push({ success: false, duration: opDuration });
          
          // Record the error
          if (error instanceof BlockchainError) {
            errors.push({
              category: error.category,
              blockchain: error.blockchain,
              message: error.message,
              context: error.context
            });
          } else {
            errors.push({
              category: 'UNKNOWN',
              message: error instanceof Error ? error.message : 'Unknown error'
            });
          }
          
          // Rethrow in development mode for debugging
          if (config.isDevelopmentMode) {
            throw error;
          }
          
          return null;
        }
      },
      testVaults.length,
      config.concurrency,
      config.delay
    );
    
    const endTime = Date.now();
    const totalDuration = endTime - startTime;
    
    // Calculate performance metrics
    const successfulOps = operationResults.filter(r => r.success).length;
    const operationsPerSecond = (successfulOps / totalDuration) * 1000;
    const errorRate = errors.length / testVaults.length;
    
    // Group errors by category
    const errorsByCategory: Record<string, { count: number; examples: string[] }> = {};
    
    errors.forEach(error => {
      const category = error.category || 'UNKNOWN';
      
      if (!errorsByCategory[category]) {
        errorsByCategory[category] = { count: 0, examples: [] };
      }
      
      errorsByCategory[category].count++;
      
      if (errorsByCategory[category].examples.length < 3) {
        errorsByCategory[category].examples.push(error.message);
      }
    });
    
    // Format error categories for the result
    const errorCategories = Object.entries(errorsByCategory).map(([category, data]) => ({
      category,
      count: data.count,
      examples: data.examples
    }));
    
    // Create the final test result
    const result: StressTestResult = {
      name: 'Verification Stress Test',
      success: errors.length === 0,
      durationMs: totalDuration,
      operationsPerSecond,
      errorRate,
      errors: errorCategories,
      timestamp: Date.now(),
      details: {
        iterations: config.iterations,
        concurrency: config.concurrency,
        chains,
        averageOperationTimeMs: operationResults.reduce((sum, r) => sum + r.duration, 0) / operationResults.length,
        maxOperationTimeMs: Math.max(...operationResults.map(r => r.duration)),
        minOperationTimeMs: Math.min(...operationResults.map(r => r.duration))
      }
    };
    
    securityLogger.info('Verification stress test completed', {
      durationMs: result.durationMs,
      operationsPerSecond: result.operationsPerSecond,
      errorRate: result.errorRate,
      errors: result.errors.length
    });
    
    return result;
  }
  
  /**
   * Run a mixed cross-chain operation stress test
   */
  async runMixedOperationsStressTest(
    config: StressTestConfig
  ): Promise<StressTestResult> {
    if (!this.initialized) {
      await this.initialize();
    }
    
    const startTime = Date.now();
    const errors: any[] = [];
    const operationResults: { success: boolean; duration: number; type: string }[] = [];
    
    securityLogger.info('Starting mixed operations stress test', config);
    
    // Generate test vaults
    const testVaults = Array.from({ length: config.iterations }).map((_, i) => ({
      id: `stress-mixed-${Date.now()}-${i}`,
      owner: `stress-owner-${Date.now()}-${i}`
    }));
    
    // Set up chains to test
    const chains = config.chains.length > 0 ? config.chains : ['ETH', 'SOL', 'TON'];
    
    // Define operation types
    const operationTypes = [
      'bridge',
      'verification',
      'proof',
      'broadcast'
    ];
    
    // Run the operations with the specified concurrency
    await this.runWithConcurrency(
      async (index) => {
        const vault = testVaults[index];
        const operationType = operationTypes[index % operationTypes.length];
        const primaryChain = chains[index % chains.length];
        const secondaryChain = chains[(index + 1) % chains.length];
        const tertiaryChain = chains[(index + 2) % chains.length];
        
        const opStartTime = Date.now();
        try {
          let result: any;
          
          // Perform the selected operation
          switch (operationType) {
            case 'bridge':
              result = await crossChainBridge.bridgeVaultVerification(
                vault.id,
                primaryChain,
                secondaryChain,
                vault.owner
              );
              break;
              
            case 'verification':
              result = await crossChainVerification.verifyVaultAcrossChains(
                vault.id,
                primaryChain,
                [secondaryChain, tertiaryChain]
              );
              break;
              
            case 'proof':
              result = await crossChainBridge.createCrossChainProof(
                vault.id,
                primaryChain,
                [secondaryChain, tertiaryChain]
              );
              break;
              
            case 'broadcast':
              result = await crossChainBridge.broadcastVaultAction(
                vault.id,
                'create',
                primaryChain,
                [secondaryChain, tertiaryChain],
                { timestamp: Date.now(), owner: vault.owner }
              );
              break;
          }
          
          const opDuration = Date.now() - opStartTime;
          operationResults.push({
            success: result.success,
            duration: opDuration,
            type: operationType
          });
          
          return result;
        } catch (error) {
          const opDuration = Date.now() - opStartTime;
          operationResults.push({
            success: false,
            duration: opDuration,
            type: operationType
          });
          
          // Record the error
          if (error instanceof BlockchainError) {
            errors.push({
              category: error.category,
              blockchain: error.blockchain,
              message: error.message,
              context: error.context,
              operationType
            });
          } else {
            errors.push({
              category: 'UNKNOWN',
              message: error instanceof Error ? error.message : 'Unknown error',
              operationType
            });
          }
          
          // Rethrow in development mode for debugging
          if (config.isDevelopmentMode) {
            throw error;
          }
          
          return null;
        }
      },
      testVaults.length,
      config.concurrency,
      config.delay
    );
    
    const endTime = Date.now();
    const totalDuration = endTime - startTime;
    
    // Calculate performance metrics
    const successfulOps = operationResults.filter(r => r.success).length;
    const operationsPerSecond = (successfulOps / totalDuration) * 1000;
    const errorRate = errors.length / testVaults.length;
    
    // Group errors by category and operation type
    const errorsByCategory: Record<string, { count: number; examples: string[]; types: Record<string, number> }> = {};
    
    errors.forEach(error => {
      const category = error.category || 'UNKNOWN';
      const opType = error.operationType || 'unknown';
      
      if (!errorsByCategory[category]) {
        errorsByCategory[category] = { count: 0, examples: [], types: {} };
      }
      
      errorsByCategory[category].count++;
      
      if (!errorsByCategory[category].types[opType]) {
        errorsByCategory[category].types[opType] = 0;
      }
      
      errorsByCategory[category].types[opType]++;
      
      if (errorsByCategory[category].examples.length < 3) {
        errorsByCategory[category].examples.push(error.message);
      }
    });
    
    // Format error categories for the result
    const errorCategories = Object.entries(errorsByCategory).map(([category, data]) => ({
      category,
      count: data.count,
      examples: data.examples,
      operationTypes: data.types
    }));
    
    // Calculate per-operation type metrics
    const operationTypeMetrics: Record<string, {
      count: number;
      success: number;
      averageTimeMs: number;
      errorRate: number;
    }> = {};
    
    operationTypes.forEach(type => {
      const opsOfType = operationResults.filter(r => r.type === type);
      const successfulOpsOfType = opsOfType.filter(r => r.success);
      
      operationTypeMetrics[type] = {
        count: opsOfType.length,
        success: successfulOpsOfType.length,
        averageTimeMs: opsOfType.reduce((sum, r) => sum + r.duration, 0) / (opsOfType.length || 1),
        errorRate: (opsOfType.length - successfulOpsOfType.length) / (opsOfType.length || 1)
      };
    });
    
    // Create the final test result
    const result: StressTestResult = {
      name: 'Mixed Operations Stress Test',
      success: errors.length === 0,
      durationMs: totalDuration,
      operationsPerSecond,
      errorRate,
      errors: errorCategories,
      timestamp: Date.now(),
      details: {
        iterations: config.iterations,
        concurrency: config.concurrency,
        chains,
        operationTypeMetrics,
        averageOperationTimeMs: operationResults.reduce((sum, r) => sum + r.duration, 0) / operationResults.length,
        maxOperationTimeMs: Math.max(...operationResults.map(r => r.duration)),
        minOperationTimeMs: Math.min(...operationResults.map(r => r.duration))
      }
    };
    
    securityLogger.info('Mixed operations stress test completed', {
      durationMs: result.durationMs,
      operationsPerSecond: result.operationsPerSecond,
      errorRate: result.errorRate,
      errors: result.errors.length
    });
    
    return result;
  }
  
  /**
   * Run a security stress test focusing on malformed inputs
   */
  async runSecurityStressTest(
    config: StressTestConfig
  ): Promise<StressTestResult> {
    if (!this.initialized) {
      await this.initialize();
    }
    
    const startTime = Date.now();
    const errors: any[] = [];
    const operationResults: { success: boolean; duration: number; type: string }[] = [];
    
    securityLogger.info('Starting security stress test', config);
    
    // Generate valid test vaults for reference
    const validVaults = Array.from({ length: 5 }).map((_, i) => ({
      id: `valid-vault-${Date.now()}-${i}`,
      owner: `valid-owner-${Date.now()}-${i}`
    }));
    
    // Generate malicious/malformed test inputs
    const malformedInputs = [
      // SQL injection attempts
      { id: "vault-' OR '1'='1", owner: "owner-' OR '1'='1" },
      { id: "vault-'; DROP TABLE vaults; --", owner: "owner" },
      
      // XSS attempts
      { id: "vault-<script>alert('xss')</script>", owner: "owner" },
      { id: "vault-javascript:alert('xss')", owner: "owner" },
      
      // Buffer overflow attempts
      { id: "a".repeat(10000), owner: "owner" },
      { id: "vault", owner: "b".repeat(10000) },
      
      // Special characters
      { id: "vault-$%^&*()_+", owner: "owner-$%^&*()_+" },
      { id: "vault-\0\n\r\t", owner: "owner" },
      
      // Empty or null values
      { id: "", owner: "owner" },
      { id: null as any, owner: "owner" },
      { id: "vault", owner: "" },
      { id: "vault", owner: null as any },
      
      // Wrong types
      { id: 12345 as any, owner: "owner" },
      { id: { nested: "object" } as any, owner: "owner" },
      { id: "vault", owner: 12345 as any },
      
      // Invalid blockchain types
      { id: "vault", owner: "owner", blockchain: "INVALID" as any },
      { id: "vault", owner: "owner", blockchain: 12345 as any },
      
      // Valid but very long
      { id: "vault-" + "a".repeat(100), owner: "owner-" + "b".repeat(100) }
    ];
    
    // Set up chains to test
    const chains = config.chains.length > 0 ? config.chains : ['ETH', 'SOL', 'TON'];
    
    // Define operation types for security testing
    const operationTypes = [
      'bridge',
      'verification',
      'message',
      'proof'
    ];
    
    // Combine valid and malformed inputs
    const testInputs = [...validVaults, ...malformedInputs];
    
    // Run the operations with the specified concurrency
    await this.runWithConcurrency(
      async (index) => {
        const input = testInputs[index % testInputs.length];
        const operationType = operationTypes[index % operationTypes.length];
        const primaryChain = chains[index % chains.length];
        const secondaryChain = chains[(index + 1) % chains.length];
        
        const opStartTime = Date.now();
        try {
          let result: any;
          
          // Attempt the operation with potentially malformed input
          switch (operationType) {
            case 'bridge':
              result = await crossChainBridge.bridgeVaultVerification(
                input.id,
                primaryChain as BlockchainType,
                secondaryChain as BlockchainType,
                input.owner
              );
              break;
              
            case 'verification':
              result = await crossChainVerification.verifyVaultExists(
                input.id,
                primaryChain as BlockchainType
              );
              break;
              
            case 'message':
              // Generate a dummy signature for testing
              const signature = `test-sig-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
              result = await crossChainBridge.verifyCrossChainMessage(
                input.id,
                primaryChain as BlockchainType,
                secondaryChain as BlockchainType,
                signature
              );
              break;
              
            case 'proof':
              result = await crossChainBridge.createCrossChainProof(
                input.id,
                primaryChain as BlockchainType,
                [secondaryChain as BlockchainType]
              );
              break;
          }
          
          const opDuration = Date.now() - opStartTime;
          operationResults.push({
            success: result.success,
            duration: opDuration,
            type: operationType
          });
          
          // If a malformed input succeeded, this might indicate a security issue
          const isValid = validVaults.some(v => v.id === input.id);
          if (!isValid && result.success) {
            securityLogger.warn('Potentially dangerous input was accepted', {
              input,
              operationType,
              result
            });
          }
          
          return result;
        } catch (error) {
          const opDuration = Date.now() - opStartTime;
          operationResults.push({
            success: false,
            duration: opDuration,
            type: operationType
          });
          
          // Record the error
          if (error instanceof BlockchainError) {
            errors.push({
              category: error.category,
              blockchain: error.blockchain,
              message: error.message,
              context: error.context,
              operationType,
              input
            });
          } else {
            errors.push({
              category: 'UNKNOWN',
              message: error instanceof Error ? error.message : 'Unknown error',
              operationType,
              input
            });
          }
          
          // Only valid inputs should succeed, so errors on malformed inputs are expected
          const isValid = validVaults.some(v => v.id === input.id);
          if (!isValid) {
            // This is actually good - malformed input was rejected
            errors.pop(); // Remove from error count since this is expected behavior
          }
          
          return null;
        }
      },
      config.iterations,
      config.concurrency,
      config.delay
    );
    
    const endTime = Date.now();
    const totalDuration = endTime - startTime;
    
    // Calculate performance metrics
    const successfulOps = operationResults.filter(r => r.success).length;
    const operationsPerSecond = (successfulOps / totalDuration) * 1000;
    const errorRate = errors.length / config.iterations;
    
    // Group errors by category
    const errorsByCategory: Record<string, { count: number; examples: string[] }> = {};
    
    errors.forEach(error => {
      const category = error.category || 'UNKNOWN';
      
      if (!errorsByCategory[category]) {
        errorsByCategory[category] = { count: 0, examples: [] };
      }
      
      errorsByCategory[category].count++;
      
      if (errorsByCategory[category].examples.length < 3) {
        errorsByCategory[category].examples.push(error.message);
      }
    });
    
    // Format error categories for the result
    const errorCategories = Object.entries(errorsByCategory).map(([category, data]) => ({
      category,
      count: data.count,
      examples: data.examples
    }));
    
    // Create the final test result
    const result: StressTestResult = {
      name: 'Security Stress Test',
      success: errors.length === 0,
      durationMs: totalDuration,
      operationsPerSecond,
      errorRate,
      errors: errorCategories,
      timestamp: Date.now(),
      details: {
        iterations: config.iterations,
        concurrency: config.concurrency,
        chains,
        validInputs: validVaults.length,
        malformedInputs: malformedInputs.length,
        averageOperationTimeMs: operationResults.reduce((sum, r) => sum + r.duration, 0) / operationResults.length,
        securityIssuesDetected: operationResults.filter(r => r.success && !validVaults.some(v => v.id === testInputs[operationResults.indexOf(r) % testInputs.length].id)).length
      }
    };
    
    securityLogger.info('Security stress test completed', {
      durationMs: result.durationMs,
      operationsPerSecond: result.operationsPerSecond,
      errorRate: result.errorRate,
      errors: result.errors.length,
      securityIssuesDetected: result.details.securityIssuesDetected
    });
    
    return result;
  }
  
  /**
   * Helper method to run operations concurrently
   */
  private async runWithConcurrency<T>(
    operation: (index: number) => Promise<T>,
    count: number,
    concurrency: number,
    delay: number
  ): Promise<(T | null)[]> {
    const results: (T | null)[] = new Array(count).fill(null);
    const indices = Array.from({ length: count }, (_, i) => i);
    
    // Process in batches based on concurrency
    for (let i = 0; i < indices.length; i += concurrency) {
      const batch = indices.slice(i, i + concurrency);
      
      // Run the current batch concurrently
      const batchResults = await Promise.all(
        batch.map(async (index) => {
          try {
            // Add delay if specified
            if (delay > 0 && index > 0) {
              await new Promise(resolve => setTimeout(resolve, delay));
            }
            
            return await operation(index);
          } catch (error) {
            securityLogger.error(`Error in operation at index ${index}`, error);
            return null;
          }
        })
      );
      
      // Store the results
      batch.forEach((index, batchIndex) => {
        results[index] = batchResults[batchIndex];
      });
    }
    
    return results;
  }
}

export const crossChainStressTester = new CrossChainStressTester();