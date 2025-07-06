#!/usr/bin/env node

/**
 * Chronos Vault Testing Framework CLI
 * Command-line interface for running tests and generating reports
 */

import { ChronosVaultTestingFramework } from './testing-framework';
import { BlockchainConnectorFactory } from '../blockchain/connector-factory';
import { DEFAULT_STRESS_TEST_CONFIG, DEFAULT_SECURITY_TEST_CONFIG, DEFAULT_TESTNET_CONFIG, getEnvironmentConfig } from './config';
import * as fs from 'fs';
import * as path from 'path';

// CLI help text
const HELP_TEXT = `
Chronos Vault Testing Framework

Usage: node testing-cli.js <command> [options]

Commands:
  stress        Run stress tests
  security      Run security tests
  testnet       Create enterprise testnet
  all           Run all tests
  report        Generate test report

Options:
  --env         Environment (development, staging, production) [default: development]
  --testnet     Use testnet (true/false) [default: true]
  --output      Output file for test results [default: ./test-results.json]
  --config      Path to custom config file
  --help        Show this help text

Examples:
  node testing-cli.js stress --env staging
  node testing-cli.js security --output ./security-report.json
  node testing-cli.js all --testnet true --env production
`;

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];
const options: Record<string, string> = {};

// Parse options
for (let i = 1; i < args.length; i += 2) {
  if (args[i].startsWith('--') && i + 1 < args.length) {
    options[args[i].substring(2)] = args[i + 1];
  }
}

// Show help if requested or no command provided
if (options.help || !command) {
  console.log(HELP_TEXT);
  process.exit(0);
}

// Set default options
const env = (options.env || 'development') as 'development' | 'staging' | 'production';
const useTestnet = options.testnet !== 'false';
const outputFile = options.output || './test-results.json';

// Load custom config if provided
let config = getEnvironmentConfig(env);
if (options.config) {
  try {
    const customConfig = JSON.parse(fs.readFileSync(options.config, 'utf8'));
    config = {
      ...config,
      ...customConfig
    };
    console.log(`Loaded custom config from ${options.config}`);
  } catch (error) {
    console.error(`Error loading custom config: ${error.message}`);
    process.exit(1);
  }
}

// Main function to run tests
async function runTests() {
  try {
    console.log(`Running on ${env} environment, testnet: ${useTestnet}`);
    
    // Initialize blockchain connectors
    const connectorFactory = BlockchainConnectorFactory.getInstance(useTestnet);
    const connectors = connectorFactory.getAllConnectors();
    
    if (connectors.length === 0) {
      console.error('No blockchain connectors available');
      process.exit(1);
    }
    
    console.log(`Using ${connectors.length} blockchain connectors: ${connectors.map(c => c.chainName).join(', ')}`);
    
    // Initialize testing framework
    const testingFramework = new ChronosVaultTestingFramework(connectors);
    
    // Run requested tests
    let results: any;
    
    switch (command) {
      case 'stress':
        console.log('Running stress tests...');
        results = await testingFramework.runStressTests(config.stressTest || DEFAULT_STRESS_TEST_CONFIG);
        break;
        
      case 'security':
        console.log('Running security tests...');
        results = await testingFramework.runSecurityTests(config.securityTest || DEFAULT_SECURITY_TEST_CONFIG);
        break;
        
      case 'testnet':
        console.log('Creating enterprise testnet...');
        results = await testingFramework.createEnterpriseTestnet(config.enterpriseTestnet || DEFAULT_TESTNET_CONFIG);
        break;
        
      case 'all':
        console.log('Running all tests...');
        results = await testingFramework.runComprehensiveTests(config);
        break;
        
      case 'report':
        console.log('Generating test report...');
        // This would generate a report based on previous test results
        results = { message: 'Report generation not implemented yet' };
        break;
        
      default:
        console.error(`Unknown command: ${command}`);
        console.log(HELP_TEXT);
        process.exit(1);
    }
    
    // Ensure output directory exists
    const outputDir = path.dirname(outputFile);
    if (outputDir !== '.' && !fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write results to file
    fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
    console.log(`Results written to ${outputFile}`);
    
    // Output summary to console
    console.log('\nTest Summary:');
    if (results.overallHealth) {
      console.log(`Reliability: ${results.overallHealth.reliability}/100`);
      console.log(`Security: ${results.overallHealth.security}/100`);
      console.log(`Performance: ${results.overallHealth.performance}/100`);
      console.log(`Robustness: ${results.overallHealth.robustness}/100`);
    } else if (results.testName) {
      console.log(`Test: ${results.testName}`);
      console.log(`Status: ${results.overallStatus}`);
      console.log(`Passed: ${results.passedTests}/${results.totalTests}`);
      console.log(`Failed: ${results.failedTests}/${results.totalTests}`);
    } else if (results.simulatedTotalValueUSD) {
      console.log(`Testnet: ${results.name}`);
      console.log(`Wallets: ${results.testWallets.length}`);
      console.log(`Vaults: ${results.testVaults.length}`);
      console.log(`Simulated Value: $${results.simulatedTotalValueUSD.toLocaleString()}`);
    } else if (results.totalTransactions) {
      console.log(`Total Transactions: ${results.totalTransactions}`);
      console.log(`Success Rate: ${(results.successfulTransactions / results.totalTransactions * 100).toFixed(2)}%`);
      console.log(`Transactions per Second: ${results.transactionsPerSecond.toFixed(2)}`);
    }
    
    // Print recommendations if available
    if (results.recommendations && results.recommendations.length > 0) {
      console.log('\nRecommendations:');
      results.recommendations.forEach((rec: string, index: number) => {
        console.log(`${index + 1}. ${rec}`);
      });
    }
    
  } catch (error) {
    console.error('Error running tests:', error);
    process.exit(1);
  }
}

// Run the tests
runTests();
