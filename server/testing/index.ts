/**
 * Chronos Vault Testing Framework Exports
 * Central file for exporting all testing components
 */

// Export testing framework
export { ChronosVaultTestingFramework } from './testing-framework';
export type { TestingFrameworkConfig, ComprehensiveTestResults } from './testing-framework';

// Export stress tester
export { VaultStressTester } from './stress-tester';
export type { StressTestConfig, TestResults, TestError, TestVault } from './stress-tester';

// Export security penetration tester
export { SecurityPenetrationTester } from '../security/penetration-tester';
export type { PenetrationTestConfig, SecurityTestResults, Vulnerability, SecurityRecommendation, TestResult } from '../security/penetration-tester';

// Export enterprise testnet
export { EnterpriseTestnetEnvironment } from './enterprise-testnet';
export type { TestnetConfig, TestnetEnvironment, TestWallet, TestVault as EnterpriseTestVault } from './enterprise-testnet';

// Export cross-chain verifier
export { CrossChainVerifier, DEFAULT_CROSS_CHAIN_VERIFIER_CONFIG } from './cross-chain-verifier';
export type { CrossChainVerificationResult, ChainVerificationResult, CrossChainInconsistency, CrossChainVerifierConfig } from './cross-chain-verifier';

// Export chain benchmarker
export { ChainBenchmarker } from './chain-benchmarker';
export type { BlockchainBenchmarkResult, ChainBenchmarkResult, TransactionBenchmarkResult } from './chain-benchmarker';
// Export benchmark configs - note that BlockchainBenchmarkConfig is a type, not a value
export { DEFAULT_BENCHMARK_CONFIG } from './config';
export type { BlockchainBenchmarkConfig } from './config';

// Export configurations
export { 
  DEFAULT_STRESS_TEST_CONFIG,
  DEFAULT_SECURITY_TEST_CONFIG,
  DEFAULT_TESTNET_CONFIG,
  DEFAULT_TESTING_FRAMEWORK_CONFIG,
  getEnvironmentConfig 
} from './config';

// Export blockchain connector interface for testing
export type { BlockchainConnector, VaultCreationParams, SecurityVerification, TransactionResult } from '../../shared/interfaces/blockchain-connector';

// Export blockchain connector factory for testing
export { BlockchainConnectorFactory } from '../blockchain/connector-factory';
