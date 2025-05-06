/**
 * Chronos Vault Testing Framework Exports
 * Central file for exporting all testing components
 */

// Export testing framework
export { ChronosVaultTestingFramework, TestingFrameworkConfig } from './testing-framework';

// Export stress tester
export { VaultStressTester, StressTestConfig, TestResults, TestError, TestVault } from './stress-tester';

// Export security penetration tester
export { SecurityPenetrationTester, PenetrationTestConfig, SecurityTestResults, Vulnerability, SecurityRecommendation } from '../security/penetration-tester';

// Export enterprise testnet
export { EnterpriseTestnetEnvironment, TestnetConfig, TestnetEnvironment, TestWallet, TestVault as TestnetVault } from './enterprise-testnet';

// Export cross-chain verifier
export { CrossChainVerifier, CrossChainVerifierConfig, CrossChainVerificationResult } from './cross-chain-verifier';

// Export chain benchmarker
export { ChainBenchmarker, BlockchainBenchmarkConfig, BlockchainBenchmarkResult } from './chain-benchmarker';

// Export configurations
export { 
  DEFAULT_STRESS_TEST_CONFIG,
  DEFAULT_SECURITY_TEST_CONFIG,
  DEFAULT_TESTNET_CONFIG,
  DEFAULT_TESTING_FRAMEWORK_CONFIG,
  getEnvironmentConfig 
} from './config';

// Export blockchain connector interface for testing
export { BlockchainConnector } from '../../shared/interfaces/blockchain-connector';

// Export blockchain connector factory for testing
export { BlockchainConnectorFactory } from '../blockchain/connector-factory';
