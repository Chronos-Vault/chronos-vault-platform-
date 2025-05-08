/**
 * Application Configuration
 * 
 * This module contains the central configuration for the application,
 * including blockchain-specific settings, environment variables,
 * and feature flags.
 */

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Feature flags for controlling functionality
const featureFlags = {
  ENABLE_CROSSCHAIN_VERIFICATION: true,
  ENABLE_ZERO_KNOWLEDGE_PRIVACY: true,
  ENABLE_MULTI_SIGNATURE: true,
  ENABLE_GEOLOCATION_RESTRICTION: true,
  ENABLE_ADVANCED_SECURITY_LOGGING: true,
  ENABLE_AI_SECURITY_MONITORING: false, // Not ready for production yet
  ENABLE_TOKEN_STAKING: true,
  // Check if ENABLE_DEVELOPMENT_MODE is explicitly set in env, otherwise fall back to NODE_ENV check
  ENABLE_DEVELOPMENT_MODE: process.env.ENABLE_DEVELOPMENT_MODE === 'true' 
    ? true 
    : (process.env.ENABLE_DEVELOPMENT_MODE === 'false' 
        ? false 
        : process.env.NODE_ENV !== 'production'),
  // Disable blockchain connector initialization in case of compatibility issues
  SKIP_BLOCKCHAIN_CONNECTOR_INIT: process.env.SKIP_BLOCKCHAIN_CONNECTOR_INIT === 'true' || true, // defaulting to true for now to fix startup issues
};

// Blockchain-specific configuration
const blockchainConfig = {
  ethereum: {
    enabled: true,
    rpcUrl: process.env.ETHEREUM_RPC_URL || 'https://goerli.infura.io/v3/your-api-key',
    chainId: process.env.NODE_ENV === 'production' ? 1 : 5, // 1 = Mainnet, 5 = Goerli testnet
    contracts: {
      vaultFactory: process.env.ETH_VAULT_FACTORY_ADDRESS || '0x123...',
      cvtToken: process.env.ETH_CVT_TOKEN_ADDRESS || '0x456...',
      bridge: process.env.ETH_BRIDGE_ADDRESS || '0x789...',
    },
    isTestnet: process.env.NODE_ENV !== 'production',
    blockExplorerUrl: process.env.NODE_ENV === 'production' 
      ? 'https://etherscan.io' 
      : 'https://goerli.etherscan.io',
  },
  
  solana: {
    enabled: true,
    rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
    isTestnet: process.env.NODE_ENV !== 'production',
    programs: {
      vaultProgram: process.env.SOL_VAULT_PROGRAM_ID || 'VAULT_PROGRAM_ID',
      tokenProgram: process.env.SOL_TOKEN_PROGRAM_ID || 'TOKEN_PROGRAM_ID',
      bridgeProgram: process.env.SOL_BRIDGE_PROGRAM_ID || 'BRIDGE_PROGRAM_ID',
    },
    blockExplorerUrl: process.env.NODE_ENV === 'production'
      ? 'https://explorer.solana.com'
      : 'https://explorer.solana.com/?cluster=devnet',
  },
  
  ton: {
    enabled: true,
    apiKey: process.env.TON_API_KEY || 'TON_API_KEY',
    apiUrl: 'https://toncenter.com/api/v2/jsonRPC',
    isTestnet: process.env.NODE_ENV !== 'production',
    contracts: {
      vaultMaster: process.env.TON_VAULT_MASTER_ADDRESS || 'EQAvDfYmkVV2zFXzC0Hs2e2RGWJyMXHpnMTXH4jnI2W3AwLb',
      vaultFactory: process.env.TON_VAULT_FACTORY_ADDRESS || 'EQB0gCDoGJNTfoPUSCgBxLuZ_O-7aYUccU0P1Vj_QdO6rQTf',
      cvtToken: process.env.TON_CVT_TOKEN_ADDRESS || 'EQDi_PSI1WbigxBKCj7vEz2pAvUQfw0IFZz9Sz2aGHUFNpSw',
    },
    blockExplorerUrl: process.env.NODE_ENV === 'production'
      ? 'https://tonscan.org'
      : 'https://testnet.tonscan.org',
  },
  
  bitcoin: {
    enabled: true,
    rpcUrl: process.env.BITCOIN_RPC_URL || 'https://btc.getblock.io/testnet/',
    isTestnet: process.env.NODE_ENV !== 'production',
    apiKey: process.env.BITCOIN_API_KEY || 'your-api-key',
    network: process.env.NODE_ENV === 'production' ? 'bitcoin' : 'testnet',
    blockExplorerUrl: process.env.NODE_ENV === 'production'
      ? 'https://mempool.space'
      : 'https://mempool.space/testnet',
    // For Bitcoin, we only use script-based time locks, no smart contracts
  },
};

// Security settings
const securityConfig = {
  // Rate limiting for API endpoints
  rateLimits: {
    standardLimit: 300, // requests per minute
    vaultCreationLimit: 20, // vault creations per hour
    crossChainOperationLimit: 50, // operations per hour
  },
  
  // JWT and session configuration
  session: {
    secret: process.env.SESSION_SECRET || 'change-me-in-production',
    expiresIn: '24h',
  },
  
  // CORS configuration
  cors: {
    allowedOrigins: process.env.NODE_ENV === 'production'
      ? ['https://chronosvault.io', 'https://www.chronosvault.io']
      : ['http://localhost:3000', 'http://localhost:5000'],
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  },
  
  // Security logging levels
  logging: {
    securityLogLevel: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    saveLogsToDatabase: process.env.NODE_ENV === 'production',
    alertOnCriticalEvents: process.env.NODE_ENV === 'production',
  },
};

// Fee structure for vaults
const feeStructure = {
  baseFee: 5, // USD
  securityLevelMultipliers: [1, 2, 3], // Multiplier based on security level
  timeLockMultiplier: 0.1, // Per month
  valueBasedFee: 0.001, // 0.1% of value
  tokenDiscounts: {
    // Discount tiers based on CVT token holdings
    tier1: { tokenAmount: 1000, discount: 0.75 }, // 75% discount for 1,000+ CVT
    tier2: { tokenAmount: 10000, discount: 0.9 }, // 90% discount for 10,000+ CVT
    tier3: { tokenAmount: 100000, discount: 1.0 }, // 100% discount for 100,000+ CVT
  },
};

// Main configuration object
const config = {
  port: process.env.PORT ? parseInt(process.env.PORT) : 5000,
  environment: process.env.NODE_ENV || 'development',
  // Use the feature flag for development mode
  isDevelopmentMode: featureFlags.ENABLE_DEVELOPMENT_MODE,
  databaseUrl: process.env.DATABASE_URL,
  apiBasePath: '/api',
  featureFlags,
  blockchainConfig,
  securityConfig,
  feeStructure,
  
  // Get a feature flag value with optional override
  getFeatureFlag(flagName: keyof typeof featureFlags, overrideValue?: boolean): boolean {
    if (overrideValue !== undefined) {
      return overrideValue;
    }
    return featureFlags[flagName];
  },
};

export default config;