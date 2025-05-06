import { StressTestConfig } from './stress-tester';
import { PenetrationTestConfig } from '../security/penetration-tester';
import { TestnetConfig } from './enterprise-testnet';
import { TestingFrameworkConfig } from './testing-framework';

// Define the BlockchainBenchmarkConfig interface directly to avoid circular dependencies
// Using 'export type' to properly expose this interface
export type BlockchainBenchmarkConfig = {
  operationsPerChain: number;
  includeOperations: {
    createVault: boolean;
    readVaultInfo: boolean;
    updateVault: boolean;
    deleteVault: boolean;
    queryVaults: boolean;
  };
  concurrentOperations: number;
  warmupIterations: number;
  cooldownBetweenTestsMs: number;
  includeGasAnalysis: boolean;
  includeRecommendations: boolean;
  timeoutMs: number;
}

/**
 * Testing Configuration
 * Contains default configurations for all testing components
 */

// Default stress test configuration
export const DEFAULT_STRESS_TEST_CONFIG: StressTestConfig = {
  concurrentTransactions: 100,
  testDurationSeconds: 300, // 5 minutes
  vaultsPerChain: 5,
  transactionDistribution: {
    create: 15, // 15% of transactions are create operations
    lock: 30,   // 30% of transactions are lock operations
    unlock: 15, // 15% of transactions are unlock operations
    verify: 20, // 20% of transactions are verify operations
    multiSig: 10, // 10% of transactions are multi-sig operations
    crossChain: 10 // 10% of transactions are cross-chain operations
  },
  targetTPS: 20, // target 20 transactions per second
  rampUpPeriodSeconds: 30,
  rampDownPeriodSeconds: 30,
  logLevel: 'info'
};

// Default security penetration test configuration
export const DEFAULT_SECURITY_TEST_CONFIG: PenetrationTestConfig = {
  testTimeout: 60000, // 1 minute timeout for each test
  maxTestAttempts: 3,
  targetVaults: 3,
  includeTests: {
    replayAttacks: true,
    frontRunningAttacks: true,
    accessControlBypass: true,
    signatureForging: true,
    raceConditions: true,
    crossChainVulnerabilities: true,
    smartContractVulnerabilities: false, // Requires specific analysis tools
    rpcManipulation: true,
    clientSideAttacks: false, // Requires frontend testing
    socialEngineering: false // Requires human analysis
  },
  concurrentTests: false, // Run tests sequentially for more reliable results
  verbose: true
};

// Default enterprise testnet configuration
export const DEFAULT_TESTNET_CONFIG: TestnetConfig = {
  testnetName: 'Chronos Enterprise Testnet',
  walletCount: 5,
  vaultsPerWallet: 3,
  totalSimulatedValueUSD: 1000000, // $1M total simulated value
  maxVaultValueUSD: 250000, // $250k max per vault
  minVaultValueUSD: 10000, // $10k min per vault
  durationDays: 30,
  securityLevelDistribution: {
    standard: 20, // 20% standard security
    enhanced: 50, // 50% enhanced security
    maximum: 30 // 30% maximum security
  },
  blockchainDistribution: {
    'ethereum': 30, // 30% Ethereum
    'solana': 25, // 25% Solana
    'ton': 25, // 25% TON
    'polygon': 15, // 15% Polygon
    'bitcoin': 5 // 5% Bitcoin
  },
  simulateErrors: true,
  errorRate: 5, // 5% error rate for realistic testing
  advanced: {
    simulateHighNetworkLoad: true,
    simulateMarketVolatility: true,
    simulateSecurityIncidents: true,
    simulateCrossChainOperations: true
  }
};

// Complete testing framework configuration
export const DEFAULT_TESTING_FRAMEWORK_CONFIG: TestingFrameworkConfig = {
  stressTest: DEFAULT_STRESS_TEST_CONFIG,
  securityTest: DEFAULT_SECURITY_TEST_CONFIG,
  enterpriseTestnet: DEFAULT_TESTNET_CONFIG
};

// Default benchmark configuration
export const DEFAULT_BENCHMARK_CONFIG: BlockchainBenchmarkConfig = {
  operationsPerChain: 10,
  includeOperations: {
    createVault: true,
    readVaultInfo: true,
    updateVault: true,
    deleteVault: true,
    queryVaults: true
  },
  concurrentOperations: 5,
  warmupIterations: 2,
  cooldownBetweenTestsMs: 1000,
  includeGasAnalysis: true,
  includeRecommendations: true,
  timeoutMs: 60000 // 1 minute timeout
};

// Environment-specific configurations
export const getEnvironmentConfig = (env: 'development' | 'staging' | 'production'): TestingFrameworkConfig => {
  switch (env) {
    case 'development':
      return {
        stressTest: {
          ...DEFAULT_STRESS_TEST_CONFIG,
          concurrentTransactions: 20, // Reduced load for development
          testDurationSeconds: 60, // Shorter tests for development
          vaultsPerChain: 2
        },
        securityTest: {
          ...DEFAULT_SECURITY_TEST_CONFIG,
          targetVaults: 1
        },
        enterpriseTestnet: {
          ...DEFAULT_TESTNET_CONFIG,
          walletCount: 2,
          vaultsPerWallet: 2,
          totalSimulatedValueUSD: 100000 // $100k for development
        }
      };
    
    case 'staging':
      return DEFAULT_TESTING_FRAMEWORK_CONFIG; // Use defaults for staging
    
    case 'production':
      return {
        stressTest: {
          ...DEFAULT_STRESS_TEST_CONFIG,
          concurrentTransactions: 500, // Higher load for production testing
          testDurationSeconds: 1800, // 30 minutes for thorough testing
          vaultsPerChain: 10
        },
        securityTest: {
          ...DEFAULT_SECURITY_TEST_CONFIG,
          maxTestAttempts: 5, // More attempts for production
          targetVaults: 5
        },
        enterpriseTestnet: {
          ...DEFAULT_TESTNET_CONFIG,
          walletCount: 10,
          vaultsPerWallet: 5,
          totalSimulatedValueUSD: 5000000 // $5M for production
        }
      };
  }
};
