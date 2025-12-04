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
  
  // Enhanced blockchain connector simulation flags
  // Master flag - if true, all chains are simulated unless overridden by specific flags
  SKIP_BLOCKCHAIN_CONNECTOR_INIT: process.env.SKIP_BLOCKCHAIN_CONNECTOR_INIT === 'true' || false,
  
  // Chain-specific simulation flags - these override the master flag when explicitly set
  // ETHEREUM IS LIVE - Connected to deployed Sepolia contracts!
  SIMULATE_ETHEREUM: false, // ✅ REAL ETHEREUM CONNECTION - Contracts deployed on Sepolia!
  
  SIMULATE_SOLANA: process.env.SIMULATE_SOLANA === 'true' || 
    (process.env.SIMULATE_SOLANA !== 'false' && 
     (process.env.SKIP_BLOCKCHAIN_CONNECTOR_INIT === 'true' || false)),
  
  SIMULATE_TON: process.env.SIMULATE_TON === 'true' || 
    (process.env.SIMULATE_TON !== 'false' && 
     (process.env.SKIP_BLOCKCHAIN_CONNECTOR_INIT === 'true' || false)),
  
  SIMULATE_BITCOIN: process.env.SIMULATE_BITCOIN === 'true' || 
    (process.env.SIMULATE_BITCOIN !== 'false' && 
     (process.env.SKIP_BLOCKCHAIN_CONNECTOR_INIT === 'true' || true)),
};

// Trinity Protocol Layer 2 Configuration
// Network selection: arbitrum (default, 95% lower fees) or sepolia (legacy L1)
const ethereumNetwork = process.env.ETHEREUM_NETWORK || 'arbitrum';
const isArbitrum = ethereumNetwork === 'arbitrum';

// Arbitrum Sepolia RPC endpoints - prioritize paid Alchemy API
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const ARBITRUM_SEPOLIA_PUBLIC_RPCS = ALCHEMY_API_KEY 
  ? [
      `https://arb-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`, // Paid Alchemy (priority)
      'https://sepolia-rollup.arbitrum.io/rpc',           // Official Arbitrum fallback
      'https://arbitrum-sepolia.blockpi.network/v1/rpc/public', // BlockPI fallback
    ]
  : [
      'https://sepolia-rollup.arbitrum.io/rpc',           // Official Arbitrum
      'https://arbitrum-sepolia.blockpi.network/v1/rpc/public', // BlockPI
      'https://arb-sepolia.g.alchemy.com/v2/demo',        // Alchemy demo
    ];

// Blockchain-specific configuration
const blockchainConfig = {
  ethereum: {
    enabled: true,
    network: ethereumNetwork, // 'arbitrum' or 'sepolia'
    rpcUrl: isArbitrum
      ? ARBITRUM_SEPOLIA_PUBLIC_RPCS[0] // Always use free official RPC
      : (process.env.ETHEREUM_RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com'),
    rpcUrls: isArbitrum ? ARBITRUM_SEPOLIA_PUBLIC_RPCS : [], // Fallback endpoints
    chainId: process.env.NODE_ENV === 'production'
      ? (isArbitrum ? 42161 : 1) // 42161 = Arbitrum One, 1 = Ethereum Mainnet
      : (isArbitrum ? 421614 : 11155111), // 421614 = Arbitrum Sepolia, 11155111 = Sepolia
    contracts: {
      vault: isArbitrum
        ? (process.env.ARBITRUM_VAULT_ADDRESS || '0x99444B0B1d6F7b21e9234229a2AC2bC0150B9d91')
        : (process.env.ETH_VAULT_ADDRESS || '0x29fd67501afd535599ff83AE072c20E31Afab958'),
      testToken: isArbitrum
        ? (process.env.ARBITRUM_TEST_TOKEN_ADDRESS || '0x6818bbb8f604b4c0b52320f633C1E5BF2c5b07bd')
        : (process.env.ETH_TEST_TOKEN_ADDRESS || '0xeb6C02FCD86B3dE11Dbae83599a002558Ace5eFc'),
      cvtToken: isArbitrum
        ? (process.env.ARBITRUM_CVT_TOKEN_ADDRESS || '0xFb419D8E32c14F774279a4dEEf330dc893257147')
        : (process.env.ETH_CVT_TOKEN_ADDRESS || '0xeb6C02FCD86B3dE11Dbae83599a002558Ace5eFc'),
      crossChainBridge: isArbitrum
        ? (process.env.ARBITRUM_BRIDGE_ADDRESS || '0x4a8Bc58f441Ae7E7eC2879e434D9D7e31CF80e30')
        : (process.env.ETH_BRIDGE_ADDRESS || '0xFb419D8E32c14F774279a4dEEf330dc893257147'),
      cvtBridge: isArbitrum
        ? (process.env.ARBITRUM_CVT_BRIDGE_ADDRESS || '0x21De95EbA01E31173Efe1b9c4D57E58bb840bA86')
        : (process.env.ETH_CVT_BRIDGE_ADDRESS || '0x2529A8900aD37386F6250281A5085D60Bd673c4B'),
    },
    contractAddresses: {
      vault: isArbitrum
        ? (process.env.ARBITRUM_VAULT_ADDRESS || '0x99444B0B1d6F7b21e9234229a2AC2bC0150B9d91')
        : (process.env.ETH_VAULT_ADDRESS || '0x29fd67501afd535599ff83AE072c20E31Afab958'),
      testToken: isArbitrum
        ? (process.env.ARBITRUM_TEST_TOKEN_ADDRESS || '0x6818bbb8f604b4c0b52320f633C1E5BF2c5b07bd')
        : (process.env.ETH_TEST_TOKEN_ADDRESS || '0xeb6C02FCD86B3dE11Dbae83599a002558Ace5eFc'),
      cvtToken: isArbitrum
        ? (process.env.ARBITRUM_CVT_TOKEN_ADDRESS || '0xFb419D8E32c14F774279a4dEEf330dc893257147')
        : (process.env.ETH_CVT_TOKEN_ADDRESS || '0xeb6C02FCD86B3dE11Dbae83599a002558Ace5eFc'),
      crossChainBridge: isArbitrum
        ? (process.env.ARBITRUM_BRIDGE_ADDRESS || '0x4a8Bc58f441Ae7E7eC2879e434D9D7e31CF80e30')
        : (process.env.ETH_BRIDGE_ADDRESS || '0xFb419D8E32c14F774279a4dEEf330dc893257147'),
      cvtBridge: isArbitrum
        ? (process.env.ARBITRUM_CVT_BRIDGE_ADDRESS || '0x21De95EbA01E31173Efe1b9c4D57E58bb840bA86')
        : (process.env.ETH_CVT_BRIDGE_ADDRESS || '0x2529A8900aD37386F6250281A5085D60Bd673c4B'),
    },
    isTestnet: process.env.NODE_ENV !== 'production',
    blockExplorerUrl: process.env.NODE_ENV === 'production'
      ? (isArbitrum ? 'https://arbiscan.io' : 'https://etherscan.io')
      : (isArbitrum ? 'https://sepolia.arbiscan.io' : 'https://sepolia.etherscan.io'),
  },
  
  solana: {
    enabled: true,
    rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
    isTestnet: process.env.NODE_ENV !== 'production',
    programs: {
      // DEPLOYED SOLANA PROGRAMS (October 2025)
      // ChronosVault Solana Program - High-speed monitoring for Trinity Protocol
      vaultProgram: process.env.SOL_VAULT_PROGRAM_ID || 'CYaDJYRqm35udQ8vkxoajSER8oaniQUcV8Vvw5BqJyo2',
      tokenProgram: process.env.SOL_TOKEN_PROGRAM_ID || 'TOKEN_PROGRAM_ID',
      bridgeProgram: process.env.SOL_BRIDGE_PROGRAM_ID || '6wo8Gso3uB8M6t9UGiritdGmc4UTPEtM5NhC6vbb9CdK', // Deployed Oct 5
      vestingProgram: process.env.SOL_VESTING_PROGRAM_ID || '3dxjcEGP8MurCtodLCJi1V6JBizdRRAYg91nZkhmX1sB', // Deployed Oct 5
      // CVT Token (Chronos Vault) - Deployed October 13, 2025
      cvtToken: process.env.SOL_CVT_TOKEN_MINT || '5g3TkqFxyVe1ismrC5r2QD345CA1YdfWn6s6p4AYNmy4',
      cvtMetadata: process.env.SOL_CVT_METADATA || 'D5qLqXpJnWDrfpZoePauQv8g22DbM8CbeVZcjeBhdDgF',
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
      // TRINITY PROTOCOL v3.5.20 - TON TESTNET DEPLOYED CONTRACTS (November 2025)
      // TrinityConsensus: 2-of-3 consensus verification with quantum-resistant recovery (ML-KEM-1024, Dilithium-5)
      trinityConsensus: process.env.TON_TRINITY_CONSENSUS_ADDRESS || 'EQeGlYzwupSROVWGucOmKyUDbSaKmPfIpHHP5mV73odL8',
      
      // ChronosVault: Time-locked vaults with per-vault accounting and Trinity consensus integration
      chronosVault: process.env.TON_CHRONOS_VAULT_ADDRESS || 'EQjUVidQfn4m-Rougn0fol7ECCthba2HV0M6xz9zAfax4',
      vaultMaster: process.env.TON_CHRONOS_VAULT_ADDRESS || 'EQjUVidQfn4m-Rougn0fol7ECCthba2HV0M6xz9zAfax4', // Alias for vault operations
      
      // CrossChainBridge: HTLC atomic swaps with 2-of-3 signatures and replay protection
      crossChainBridge: process.env.TON_CROSS_CHAIN_BRIDGE_ADDRESS || 'EQgWobA9D4u6Xem3B8e6Sde_NEFZYicyy7_5_XvOT18mA',
      cvtBridge: process.env.TON_CVT_BRIDGE_ADDRESS || 'EQgWobA9D4u6Xem3B8e6Sde_NEFZYicyy7_5_XvOT18mA',
      bridge: process.env.TON_CVT_BRIDGE_ADDRESS || 'EQgWobA9D4u6Xem3B8e6Sde_NEFZYicyy7_5_XvOT18mA', // Alias for bridge operations
      
      // Note: vaultFactory and cvtToken contracts are not yet deployed
      // These will be deployed separately when needed for factory pattern and token operations
      vaultFactory: null, // Not yet deployed
      cvtToken: null, // CVT token exists only on Solana as SPL token
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

// Simulation data for realistic testnet behavior
const simulationConfig = {
  // Realistic transaction data for simulations
  ethereum: {
    walletAddress: "0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf", // Standard Ethereum test address
    balances: {
      default: "10.0", // ETH
      cvt: "5000.0" // CVT token balance
    },
    transactions: {
      // Sample of recent transactions for the simulated wallet
      recentTxs: [
        {
          hash: "0xabc123def456",
          timestamp: new Date(Date.now() - 86400000), // 1 day ago
          type: "vault_creation",
          status: "confirmed"
        },
        {
          hash: "0xdef456abc789",
          timestamp: new Date(Date.now() - 43200000), // 12 hours ago
          type: "asset_deposit",
          status: "confirmed"
        }
      ],
      // Success rates for different operation types
      successRates: {
        vaultCreation: 0.98, // 98% success rate
        assetDeposit: 0.99,
        assetWithdrawal: 0.97,
        beneficiaryUpdate: 0.995
      },
      // Realistic gas ranges for different operation types (in gwei)
      gasPrices: {
        low: 20,
        average: 40,
        high: 80
      }
    },
    simulatedDelay: {
      // Realistic delays for different operations (in ms)
      transaction: {
        min: 2000,
        max: 10000
      },
      confirmation: {
        min: 5000,
        max: 20000
      }
    }
  },
  
  solana: {
    walletAddress: "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr", // Solana test address
    balances: {
      default: "20.0", // SOL
      cvt: "5000.0" // CVT token balance
    },
    simulatedDelay: {
      transaction: {
        min: 500, // Solana is faster
        max: 2500
      },
      confirmation: {
        min: 1000,
        max: 5000
      }
    }
  },
  
  ton: {
    walletAddress: "EQDrjaLahXa1xiM02skvUYxM6UGxu5taOUbjFMEVQiXXdNLQ", // TON test address
    balances: {
      default: "100.0", // TON
      cvt: "5000.0" // CVT token balance
    },
    simulatedDelay: {
      transaction: {
        min: 1000,
        max: 5000
      },
      confirmation: {
        min: 3000,
        max: 15000
      }
    }
  },
  
  bitcoin: {
    walletAddress: "tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx", // Bitcoin testnet address
    balances: {
      default: "0.5" // BTC
    },
    simulatedDelay: {
      transaction: {
        min: 10000, // Bitcoin is slower
        max: 30000
      },
      confirmation: {
        min: 600000, // ~10 minutes
        max: 3600000 // up to 1 hour
      }
    },
    halvingInfo: {
      // Data for Bitcoin halving simulation
      currentBlock: 840000,
      nextHalvingBlock: 1050000,
      currentReward: 3.125,
      nextReward: 1.5625,
      // Function to calculate estimated halving date
      getEstimatedHalvingDate: () => {
        const blocksRemaining = 1050000 - 840000;
        const avgBlockTimeSeconds = 600; // 10 minutes
        const totalSeconds = blocksRemaining * avgBlockTimeSeconds;
        return new Date(Date.now() + totalSeconds * 1000);
      }
    }
  }
};

// Cross-chain verification settings
const crossChainVerificationConfig = {
  // Cache TTL for verification results (ms)
  cacheTTL: 5 * 60 * 1000, // 5 minutes
  
  // Verification levels
  levels: {
    basic: {
      name: 'Basic',
      requiredChains: 1,
      description: 'Single-chain verification',
      fee: 1 // Base fee multiplier
    },
    standard: {
      name: 'Standard',
      requiredChains: 2,
      description: 'Two-chain verification with cross-validation',
      fee: 2 // 2x base fee
    },
    advanced: {
      name: 'Advanced',
      requiredChains: 3,
      description: 'Triple-chain verification with full security model',
      fee: 3 // 3x base fee
    }
  },
  
  // Chain priorities and roles in verification
  chainRoles: {
    ton: {
      role: 'primary',
      priority: 1,
      description: 'Primary vault creation, management and time-lock operations'
    },
    ethereum: {
      role: 'validation',
      priority: 2,
      description: 'Security verification and ownership validation'
    },
    solana: {
      role: 'monitoring',
      priority: 3,
      description: 'High-speed monitoring and rapid validation'
    },
    bitcoin: {
      role: 'timestamp',
      priority: 4,
      description: 'Immutable timestamping of major vault operations'
    }
  },
  
  // Retry settings
  retry: {
    maxRetries: 3,
    baseDelayMs: 2000,
    maxDelayMs: 30000,
    exponentialBackoff: true
  },
  
  // Fallback chains if primary verification fails
  fallbackChains: {
    ton: 'ethereum',
    ethereum: 'solana',
    solana: 'bitcoin',
    bitcoin: 'ethereum'
  },
  
  // Alternative endpoints for each blockchain (for resilience)
  alternativeEndpoints: {
    ton: [
      'https://toncenter.com/api/v2/jsonRPC',
      'https://ton.access.orbs.network/api/v2/jsonRPC'
    ],
    ethereum: [
      'https://rpc.ankr.com/arbitrum_sepolia', // Free Ankr endpoint
      'https://sepolia-rollup.arbitrum.io/rpc', // Official Arbitrum Sepolia
      'https://ethereum-sepolia-rpc.publicnode.com' // Sepolia fallback
    ],
    solana: [
      'https://api.devnet.solana.com',
      'https://devnet.solana.rpcpool.com',
      'https://solana-devnet.g.alchemy.com/v2/demo'
    ],
    bitcoin: [
      'https://btc1.trezor.io/api/v2',
      'https://blockstream.info/api'
    ]
  }
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
  simulation: simulationConfig, // Add simulation data to config
  crossChainVerification: crossChainVerificationConfig, // Add cross-chain verification config
  
  // Get a feature flag value with optional override
  getFeatureFlag(flagName: keyof typeof featureFlags, overrideValue?: boolean): boolean {
    if (overrideValue !== undefined) {
      return overrideValue;
    }
    return featureFlags[flagName];
  },
  
  // Helper to check if a specific blockchain should be simulated
  shouldSimulateBlockchain(chain: 'ethereum' | 'solana' | 'ton' | 'bitcoin'): boolean {
    switch (chain) {
      case 'ethereum':
        return this.featureFlags.SIMULATE_ETHEREUM;
      case 'solana':
        return this.featureFlags.SIMULATE_SOLANA;
      case 'ton':
        return this.featureFlags.SIMULATE_TON;
      case 'bitcoin':
        return this.featureFlags.SIMULATE_BITCOIN;
      default:
        return this.featureFlags.SKIP_BLOCKCHAIN_CONNECTOR_INIT;
    }
  },
  
  // Get alternative endpoint for a blockchain
  getAlternativeEndpoint(chain: 'ethereum' | 'solana' | 'ton' | 'bitcoin'): string | undefined {
    const endpoints = this.crossChainVerification.alternativeEndpoints[chain];
    if (!endpoints || endpoints.length === 0) {
      return undefined;
    }
    
    // Randomly select an alternative endpoint
    const randomIndex = Math.floor(Math.random() * endpoints.length);
    return endpoints[randomIndex];
  },
  
  // Get verification level details
  getVerificationLevel(level: 'basic' | 'standard' | 'advanced') {
    return this.crossChainVerification.levels[level];
  },
  
  // Get chain role information
  getChainRole(chain: 'ethereum' | 'solana' | 'ton' | 'bitcoin') {
    return this.crossChainVerification.chainRoles[chain];
  },
  
  // Get fallback chain for a primary chain
  getFallbackChain(primaryChain: 'ethereum' | 'solana' | 'ton' | 'bitcoin'): 'ethereum' | 'solana' | 'ton' | 'bitcoin' {
    return this.crossChainVerification.fallbackChains[primaryChain] as 'ethereum' | 'solana' | 'ton' | 'bitcoin';
  }
};

export default config;