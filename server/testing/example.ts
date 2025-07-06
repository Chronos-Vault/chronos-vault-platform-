/**
 * Example Usage of Chronos Vault Testing Framework
 * This file demonstrates how to use the testing framework in a real application
 */

import {
  ChronosVaultTestingFramework,
  VaultStressTester,
  SecurityPenetrationTester,
  EnterpriseTestnetEnvironment,
  CrossChainVerifier,
  ChainBenchmarker,
  BlockchainConnectorFactory,
  DEFAULT_STRESS_TEST_CONFIG,
  DEFAULT_SECURITY_TEST_CONFIG,
  DEFAULT_TESTNET_CONFIG,
  getEnvironmentConfig
} from './index';

/**
 * Example function showing how to run a comprehensive test suite
 */
async function runComprehensiveTests() {
  console.log('Starting Chronos Vault Comprehensive Tests');
  
  try {
    // Initialize blockchain connectors
    const connectorFactory = BlockchainConnectorFactory.getInstance(true); // Use testnet
    const blockchains = connectorFactory.getAllConnectors();
    
    if (blockchains.length === 0) {
      console.error('No blockchain connectors available. Make sure connectors are properly initialized.');
      return;
    }
    
    console.log(`Using ${blockchains.length} blockchain connectors: ${blockchains.map(b => b.chainName).join(', ')}`);
    
    // Create testing framework
    const testingFramework = new ChronosVaultTestingFramework(blockchains);
    
    // Get environment-specific configuration
    const env = process.env.NODE_ENV as 'development' | 'staging' | 'production' || 'development';
    console.log(`Running in ${env} environment`);
    const config = getEnvironmentConfig(env);
    
    // Run all tests
    console.log('Running comprehensive tests. This may take several minutes...');
    const results = await testingFramework.runComprehensiveTests(config);
    
    // Output results summary
    console.log('\nTest Results Summary:');
    console.log(`Overall Health:`);
    console.log(`- Reliability: ${results.overallHealth.reliability}/100`);
    console.log(`- Security: ${results.overallHealth.security}/100`);
    console.log(`- Performance: ${results.overallHealth.performance}/100`);
    console.log(`- Robustness: ${results.overallHealth.robustness}/100`);
    
    console.log('\nRecommendations:');
    results.recommendations.forEach((rec, i) => {
      console.log(`${i + 1}. ${rec}`);
    });
    
    console.log('\nComprehensive tests completed successfully.');
    return results;
    
  } catch (error) {
    console.error('Error running comprehensive tests:', error);
    throw error;
  }
}

/**
 * Example function showing how to run stress tests only
 */
async function runStressTestsOnly() {
  console.log('Starting Chronos Vault Stress Tests');
  
  try {
    // Initialize blockchain connectors
    const connectorFactory = BlockchainConnectorFactory.getInstance(true); // Use testnet
    const blockchains = connectorFactory.getAllConnectors();
    
    // Create stress tester directly
    const stressTester = new VaultStressTester(
      blockchains,
      {
        ...DEFAULT_STRESS_TEST_CONFIG,
        concurrentTransactions: 20,    // Reduce for example
        testDurationSeconds: 60,       // 1 minute test
        vaultsPerChain: 2              // 2 vaults per chain
      }
    );
    
    // Run stress test
    console.log('Running stress tests...');
    const results = await stressTester.runConcurrencyTest();
    
    // Output results summary
    console.log('\nStress Test Results:');
    console.log(`Total Transactions: ${results.totalTransactions}`);
    console.log(`Successful: ${results.successfulTransactions} (${(results.successfulTransactions / results.totalTransactions * 100).toFixed(2)}%)`);
    console.log(`Failed: ${results.failedTransactions}`);
    console.log(`Transactions Per Second: ${results.transactionsPerSecond.toFixed(2)}`);
    console.log(`Average Response Time: ${results.averageResponseTime.toFixed(2)}ms`);
    
    console.log('\nResponse Time Percentiles:');
    console.log(`50th Percentile: ${results.responseTimePercentiles.p50}ms`);
    console.log(`90th Percentile: ${results.responseTimePercentiles.p90}ms`);
    console.log(`95th Percentile: ${results.responseTimePercentiles.p95}ms`);
    console.log(`99th Percentile: ${results.responseTimePercentiles.p99}ms`);
    
    console.log('\nStress tests completed successfully.');
    return results;
    
  } catch (error) {
    console.error('Error running stress tests:', error);
    throw error;
  }
}

/**
 * Example function showing how to perform blockchain benchmarking
 */
async function runBlockchainBenchmarks() {
  console.log('Starting Blockchain Benchmark Tests');
  
  try {
    // Initialize blockchain connectors
    const connectorFactory = BlockchainConnectorFactory.getInstance(true); // Use testnet
    const blockchains = connectorFactory.getAllConnectors();
    
    // Create benchmarker
    const benchmarker = new ChainBenchmarker(blockchains, {
      operationsPerChain: 5,          // 5 operations per chain
      includeOperations: {
        createVault: true,
        readVaultInfo: true,
        updateVault: true,
        deleteVault: true,
        queryVaults: true
      },
      concurrentOperations: 2,
      warmupIterations: 1,
      cooldownBetweenTestsMs: 1000,
      includeGasAnalysis: true,
      includeRecommendations: true,
      timeoutMs: 30000 // 30 second timeout
    });
    
    // Run benchmarks
    console.log('Running blockchain benchmarks...');
    const results = await benchmarker.runBenchmarks();
    
    // Output results summary
    console.log('\nBlockchain Benchmark Results:');
    console.log('Rankings:');
    console.log(`- Fastest Chain: ${results.rankings.fastest}`);
    console.log(`- Most Reliable Chain: ${results.rankings.mostReliable}`);
    console.log(`- Most Cost-Effective Chain: ${results.rankings.mostCostEffective}`);
    console.log(`- Best Overall Chain: ${results.rankings.bestOverall}`);
    
    console.log('\nChain-Specific Results:');
    for (const chainId in results.chainResults) {
      const chainResult = results.chainResults[chainId];
      console.log(`\n${chainResult.chainName}:`);
      console.log(`- Performance Score: ${chainResult.performanceScore}/100`);
      console.log(`- Reliability Score: ${chainResult.reliabilityScore}/100`);
      console.log(`- Cost Efficiency Score: ${chainResult.costEfficiencyScore}/100`);
      console.log(`- Overall Score: ${chainResult.overallScore}/100`);
      
      console.log('  Strengths:');
      chainResult.strengths.forEach(strength => {
        console.log(`  - ${strength}`);
      });
      
      console.log('  Weaknesses:');
      chainResult.weaknesses.forEach(weakness => {
        console.log(`  - ${weakness}`);
      });
    }
    
    console.log('\nOverall Recommendations:');
    results.overallRecommendations.forEach((rec, i) => {
      console.log(`${i + 1}. ${rec}`);
    });
    
    console.log('\nBenchmark tests completed successfully.');
    return results;
    
  } catch (error) {
    console.error('Error running blockchain benchmarks:', error);
    throw error;
  }
}

/**
 * Example function showing how to verify cross-chain consistency
 */
async function verifyVaultAcrossChains(vaultId: string) {
  console.log(`Starting Cross-Chain Verification for Vault ${vaultId}`);
  
  try {
    // Initialize blockchain connectors
    const connectorFactory = BlockchainConnectorFactory.getInstance(true); // Use testnet
    const blockchains = connectorFactory.getAllConnectors();
    
    // Create cross-chain verifier
    const verifier = new CrossChainVerifier(blockchains, {
      timeoutMs: 30000, // 30 seconds
      maxRetries: 3,
      consistencyChecks: {
        ownerAddress: true,
        beneficiaries: true,
        balance: true,
        status: true,
        metadata: true
      },
      requireAllChains: false,
      verifySignatures: true,
      detailedAnalysis: true
    });
    
    // Verify vault across chains
    console.log('Verifying vault across chains...');
    const result = await verifier.verifyVaultAcrossChains(vaultId);
    
    // Output results summary
    console.log('\nCross-Chain Verification Results:');
    console.log(`Verification Success: ${result.verificationSuccess}`);
    console.log(`Consistency Score: ${result.consistencyScore}%`);
    
    console.log('\nChain-Specific Results:');
    for (const chainId in result.chainResults) {
      const chainResult = result.chainResults[chainId];
      console.log(`\n${chainResult.chainName}:`);
      console.log(`- Verification Success: ${chainResult.verificationSuccess}`);
      console.log(`- Response Time: ${chainResult.responseTimeMs}ms`);
      console.log(`- Integrity Score: ${chainResult.securityVerification.integrityScore}/100`);
      
      if (chainResult.securityVerification.securityAlerts.length > 0) {
        console.log('  Security Alerts:');
        chainResult.securityVerification.securityAlerts.forEach(alert => {
          console.log(`  - ${alert.level.toUpperCase()}: ${alert.message}`);
        });
      }
    }
    
    if (result.inconsistencies.length > 0) {
      console.log('\nInconsistencies:');
      result.inconsistencies.forEach((inconsistency, i) => {
        console.log(`${i + 1}. ${inconsistency.severity.toUpperCase()} - ${inconsistency.field}: ${inconsistency.description}`);
        console.log(`   Affected Chains: ${inconsistency.affectedChains.join(', ')}`);
        console.log(`   Possible Cause: ${inconsistency.possibleCause}`);
      });
    }
    
    console.log('\nRecommended Actions:');
    result.recommendedActions.forEach((rec, i) => {
      console.log(`${i + 1}. ${rec}`);
    });
    
    console.log('\nCross-chain verification completed successfully.');
    return result;
    
  } catch (error) {
    console.error('Error running cross-chain verification:', error);
    throw error;
  }
}

/**
 * Example function showing how to create an enterprise testnet environment
 */
async function createEnterpriseTestnet() {
  console.log('Creating Enterprise Testnet Environment');
  
  try {
    // Initialize blockchain connectors
    const connectorFactory = BlockchainConnectorFactory.getInstance(true); // Use testnet
    const blockchains = connectorFactory.getAllConnectors();
    
    // Create enterprise testnet
    const testnetEnv = new EnterpriseTestnetEnvironment(
      blockchains,
      {
        ...DEFAULT_TESTNET_CONFIG,
        testnetName: 'Demo Enterprise Testnet',
        walletCount: 3,                  // 3 wallets per chain
        vaultsPerWallet: 2,              // 2 vaults per wallet
        totalSimulatedValueUSD: 500000   // $500k simulated value
      }
    );
    
    // Create testnet environment
    console.log('Creating enterprise testnet environment...');
    const result = await testnetEnv.createTestnetEnvironment();
    
    // Output results summary
    console.log('\nEnterprise Testnet Created:');
    console.log(`Testnet Name: ${result.name}`);
    console.log(`Testnet ID: ${result.id}`);
    console.log(`Creation Date: ${result.creationDate.toLocaleString()}`);
    console.log(`Expiry Date: ${result.expiryDate.toLocaleString()}`);
    
    console.log(`\nTest Resources:`);
    console.log(`- Wallets: ${result.testWallets.length}`);
    console.log(`- Vaults: ${result.testVaults.length}`);
    console.log(`- Simulated Total Value: $${result.simulatedTotalValueUSD.toLocaleString()}`);
    
    console.log(`\nMonitoring Info:`);
    console.log(`- Dashboard URL: ${result.monitoringDashboardUrl}`);
    console.log(`- Analytics URL: ${result.analyticsEndpointUrl}`);
    
    console.log('\nEnterprise testnet created successfully.');
    return result;
    
  } catch (error) {
    console.error('Error creating enterprise testnet:', error);
    throw error;
  }
}

// Export example functions
export {
  runComprehensiveTests,
  runStressTestsOnly,
  runBlockchainBenchmarks,
  verifyVaultAcrossChains,
  createEnterpriseTestnet
};

// Example usage (uncomment to run)
// if (require.main === module) {
//   // Run the example you want to test
//   runStressTestsOnly().catch(console.error);
// }
