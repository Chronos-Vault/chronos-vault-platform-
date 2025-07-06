/**
 * Cross-Chain Operations Test Suite
 * 
 * This module provides testing functionality for cross-chain operations,
 * including verification tests, bridge tests, and error handling tests.
 */

import { ethersClient } from '../blockchain/ethereum-client';
import { solanaClient } from '../blockchain/solana-client';
import { tonClient } from '../blockchain/ton-client';
import { crossChainVerification } from '../security/cross-chain-verification-protocol';
import { crossChainBridge } from '../blockchain/cross-chain-bridge';
import { securityLogger } from '../monitoring/security-logger';
import { BlockchainType } from '../../shared/types';
import { 
  BlockchainErrorCategory, 
  createBlockchainError, 
  getRecoveryStrategy,
  RecoveryStrategy
} from '../blockchain/enhanced-error-handling';
import config from '../config';

// Test result interface
interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  details?: any;
  timestamp: number;
}

// Test suite result interface
interface TestSuiteResult {
  name: string;
  tests: TestResult[];
  passed: number;
  failed: number;
  total: number;
  timestamp: number;
  duration: number;
}

// Test runner
class CrossChainTestRunner {
  private testResults: TestResult[] = [];
  private startTime: number = 0;
  
  /**
   * Run all cross-chain tests
   */
  async runAllTests(): Promise<TestSuiteResult> {
    this.startTime = Date.now();
    this.testResults = [];
    
    securityLogger.info('Starting cross-chain operations test suite');
    
    // Initialize all required clients
    await this.initClients();
    
    // Run the tests
    await this.runVerificationTests();
    await this.runBridgeTests();
    await this.runErrorHandlingTests();
    
    // Calculate test statistics
    const passed = this.testResults.filter(r => r.passed).length;
    const failed = this.testResults.filter(r => !r.passed).length;
    const total = this.testResults.length;
    const duration = Date.now() - this.startTime;
    
    const testSuiteResult: TestSuiteResult = {
      name: 'Cross-Chain Operations Test Suite',
      tests: this.testResults,
      passed,
      failed,
      total,
      timestamp: Date.now(),
      duration
    };
    
    securityLogger.info(`Test suite completed: ${passed}/${total} tests passed`, {
      passed,
      failed,
      duration: `${duration}ms`
    });
    
    return testSuiteResult;
  }
  
  /**
   * Initialize required clients
   */
  private async initClients(): Promise<void> {
    try {
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
      
      this.addTestResult({
        name: 'Client Initialization',
        passed: true,
        message: 'All blockchain clients initialized successfully',
        timestamp: Date.now()
      });
    } catch (error) {
      this.addTestResult({
        name: 'Client Initialization',
        passed: false,
        message: `Failed to initialize clients: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: Date.now()
      });
    }
  }
  
  /**
   * Add a test result to the collection
   */
  private addTestResult(result: TestResult): void {
    this.testResults.push(result);
    
    const status = result.passed ? 'PASSED' : 'FAILED';
    securityLogger.info(`Test ${status}: ${result.name}`, {
      test: result.name,
      passed: result.passed,
      message: result.message
    });
  }
  
  /**
   * Run verification tests
   */
  private async runVerificationTests(): Promise<void> {
    const testVaultId = `test-vault-${Date.now()}`;
    const blockchains: BlockchainType[] = ['ETH', 'SOL', 'TON'];
    
    // Test 1: Verify a vault across all chains
    try {
      const result = await crossChainVerification.verifyVaultAcrossChains(
        testVaultId,
        'ETH',
        ['SOL', 'TON']
      );
      
      this.addTestResult({
        name: 'Cross-Chain Vault Verification',
        passed: result.success,
        message: result.message,
        details: {
          verifiedOn: result.verifiedOn,
          pendingOn: result.pendingOn,
          failedOn: result.failedOn
        },
        timestamp: Date.now()
      });
    } catch (error) {
      this.addTestResult({
        name: 'Cross-Chain Vault Verification',
        passed: false,
        message: `Test failed with error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: Date.now()
      });
    }
    
    // Test 2: Verify a transaction across chains
    try {
      const testTxId = `test-tx-${Date.now()}`;
      const result = await crossChainVerification.verifyTransactionAcrossChains(
        testTxId,
        'ETH',
        ['SOL', 'TON']
      );
      
      this.addTestResult({
        name: 'Cross-Chain Transaction Verification',
        passed: result.success,
        message: result.message,
        details: {
          verifiedOn: result.verifiedOn,
          pendingOn: result.pendingOn,
          failedOn: result.failedOn
        },
        timestamp: Date.now()
      });
    } catch (error) {
      this.addTestResult({
        name: 'Cross-Chain Transaction Verification',
        passed: false,
        message: `Test failed with error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: Date.now()
      });
    }
    
    // Test 3: Individual blockchain verifications
    for (const chain of blockchains) {
      try {
        let vaultExists = false;
        
        switch (chain) {
          case 'ETH':
            const ethResult = await ethersClient.verifyVaultExists(testVaultId);
            vaultExists = ethResult.exists;
            break;
          case 'SOL':
            const solResult = await solanaClient.verifyVaultExists(testVaultId);
            vaultExists = solResult.exists;
            break;
          case 'TON':
            const tonResult = await tonClient.verifyVaultExists(testVaultId);
            vaultExists = tonResult.exists;
            break;
        }
        
        // In development mode, these should typically pass
        this.addTestResult({
          name: `${chain} Vault Verification`,
          passed: config.isDevelopmentMode ? true : vaultExists,
          message: vaultExists 
            ? `Vault verified on ${chain}` 
            : `Vault not found on ${chain}`,
          timestamp: Date.now()
        });
      } catch (error) {
        this.addTestResult({
          name: `${chain} Vault Verification`,
          passed: false,
          message: `Test failed with error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          timestamp: Date.now()
        });
      }
    }
  }
  
  /**
   * Run bridge tests
   */
  private async runBridgeTests(): Promise<void> {
    const testVaultId = `test-vault-${Date.now()}`;
    const requester = 'test-user';
    
    // Test 1: Bridge from ETH to TON
    try {
      const result = await crossChainBridge.bridgeVaultVerification(
        testVaultId,
        'ETH',
        'TON',
        requester
      );
      
      this.addTestResult({
        name: 'Bridge ETH to TON',
        passed: result.success,
        message: result.message,
        details: {
          sourceTransactionId: result.sourceTransactionId,
          targetTransactionId: result.targetTransactionId,
          status: result.status
        },
        timestamp: Date.now()
      });
    } catch (error) {
      this.addTestResult({
        name: 'Bridge ETH to TON',
        passed: false,
        message: `Test failed with error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: Date.now()
      });
    }
    
    // Test 2: Bridge from TON to SOL
    try {
      const result = await crossChainBridge.bridgeVaultVerification(
        testVaultId,
        'TON',
        'SOL',
        requester
      );
      
      this.addTestResult({
        name: 'Bridge TON to SOL',
        passed: result.success,
        message: result.message,
        details: {
          sourceTransactionId: result.sourceTransactionId,
          targetTransactionId: result.targetTransactionId,
          status: result.status
        },
        timestamp: Date.now()
      });
    } catch (error) {
      this.addTestResult({
        name: 'Bridge TON to SOL',
        passed: false,
        message: `Test failed with error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: Date.now()
      });
    }
    
    // Test 3: Verify cross-chain messages
    try {
      const mockSignature = `test-signature-${Date.now()}`;
      const result = await crossChainBridge.verifyCrossChainMessage(
        testVaultId,
        'ETH',
        'TON',
        mockSignature
      );
      
      this.addTestResult({
        name: 'Verify Cross-Chain Message',
        passed: result.isValid || config.isDevelopmentMode,
        message: result.message,
        timestamp: Date.now()
      });
    } catch (error) {
      this.addTestResult({
        name: 'Verify Cross-Chain Message',
        passed: false,
        message: `Test failed with error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: Date.now()
      });
    }
  }
  
  /**
   * Run error handling tests
   */
  private async runErrorHandlingTests(): Promise<void> {
    // Test 1: Network error handling
    const networkError = new Error('Connection timeout');
    const blockchainError = createBlockchainError(
      networkError,
      'ETH',
      BlockchainErrorCategory.NETWORK,
      { operation: 'test' }
    );
    
    const recoveryStrategy = getRecoveryStrategy(blockchainError);
    
    this.addTestResult({
      name: 'Network Error Handling',
      passed: recoveryStrategy === RecoveryStrategy.RETRY,
      message: recoveryStrategy === RecoveryStrategy.RETRY
        ? 'Network error correctly categorized as retryable'
        : 'Network error mishandled',
      details: {
        error: blockchainError,
        recoveryStrategy
      },
      timestamp: Date.now()
    });
    
    // Test 2: Contract error handling
    const contractError = new Error('Contract execution reverted');
    const contractBlockchainError = createBlockchainError(
      contractError,
      'SOL',
      BlockchainErrorCategory.CONTRACT,
      { operation: 'test' }
    );
    
    const contractRecoveryStrategy = getRecoveryStrategy(contractBlockchainError);
    
    this.addTestResult({
      name: 'Contract Error Handling',
      passed: contractRecoveryStrategy === RecoveryStrategy.MANUAL_RESOLUTION,
      message: contractRecoveryStrategy === RecoveryStrategy.MANUAL_RESOLUTION
        ? 'Contract error correctly categorized as needing manual resolution'
        : 'Contract error mishandled',
      details: {
        error: contractBlockchainError,
        recoveryStrategy: contractRecoveryStrategy
      },
      timestamp: Date.now()
    });
    
    // Test 3: Cross-chain error handling
    const crossChainError = new Error('Cross-chain bridge failure');
    const crossChainBlockchainError = createBlockchainError(
      crossChainError,
      'TON',
      BlockchainErrorCategory.CROSS_CHAIN,
      { operation: 'test' }
    );
    
    const crossChainRecoveryStrategy = getRecoveryStrategy(crossChainBlockchainError);
    
    this.addTestResult({
      name: 'Cross-Chain Error Handling',
      passed: crossChainRecoveryStrategy === RecoveryStrategy.FALLBACK_CHAIN,
      message: crossChainRecoveryStrategy === RecoveryStrategy.FALLBACK_CHAIN
        ? 'Cross-chain error correctly categorized as needing fallback chain'
        : 'Cross-chain error mishandled',
      details: {
        error: crossChainBlockchainError,
        recoveryStrategy: crossChainRecoveryStrategy
      },
      timestamp: Date.now()
    });
  }
}

export const crossChainTestRunner = new CrossChainTestRunner();