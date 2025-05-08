/**
 * Application Configuration
 * 
 * Central configuration for the server-side application.
 * Includes environment-specific settings and feature flags.
 */

// Environment detection
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

// Development mode is always enabled in development environment
// but can also be overridden with an environment variable
const isDevelopmentMode = isDevelopment 
  || process.env.ENABLE_DEV_MODE === 'true'
  || process.env.DEVELOPMENT_MODE === 'true';

// Performance tuning parameters
const defaultCacheSize = 1000;
const defaultCacheTTL = 60 * 60 * 1000; // 1 hour in milliseconds
const defaultRateLimit = 300; // requests per minute

// Security configuration
const securityConfig = {
  // Hash algorithm for security logs
  hashAlgorithm: 'sha256',
  // Whether to enable detailed security logging
  detailedLogging: !isProduction || process.env.DETAILED_SECURITY_LOGGING === 'true',
  // How many milliseconds for timeouts on security operations
  operationTimeout: isProduction ? 30000 : 60000,
  // Minimum security level for production (can be overridden)
  minimumSecurityLevel: isProduction ? 'medium' : 'low'
};

// Feature flags
const featureFlags = {
  // Whether cross-chain verification is enabled
  enableCrossChainVerification: true,
  // Whether to use simulated blockchain data in development
  useSimulatedBlockchainData: isDevelopmentMode,
  // Whether to enable advanced monitoring
  enableAdvancedMonitoring: isProduction,
  // Whether to enable the Zero-Knowledge Privacy Layer
  enableZkPrivacy: true,
  // Whether the Diamond Hands Bitcoin Vault feature is enabled
  enableBitcoinVault: true
};

// API configuration
const apiConfig = {
  // Base paths for different API versions
  basePaths: {
    v1: '/api/v1',
    v2: '/api/v2'
  },
  // Default pagination settings
  defaultPageSize: 10,
  maxPageSize: 100
};

// Export a unified configuration object
export default {
  // Environment info
  isProduction,
  isDevelopment,
  isTest,
  isDevelopmentMode,
  
  // Performance configuration
  caching: {
    defaultSize: defaultCacheSize,
    defaultTTL: defaultCacheTTL
  },
  
  // Rate limiting
  rateLimit: {
    requestsPerMinute: process.env.RATE_LIMIT ? parseInt(process.env.RATE_LIMIT) : defaultRateLimit
  },
  
  // Security settings
  security: securityConfig,
  
  // Feature flags
  features: featureFlags,
  
  // API configuration
  api: apiConfig,
  
  // Get a feature flag value, with optional override
  getFeatureFlag(flagName: keyof typeof featureFlags, overrideValue?: boolean): boolean {
    if (overrideValue !== undefined) {
      return overrideValue;
    }
    return featureFlags[flagName];
  }
};