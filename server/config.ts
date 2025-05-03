/**
 * Configuration for blockchain connections and API keys
 * 
 * This file centralizes all blockchain configuration to make deployment 
 * and environment management easier.
 */

// RPC Endpoint Configuration
export const BLOCKCHAIN_CONFIG = {
  // Ethereum Configuration
  ethereum: {
    rpcUrl: process.env.ETHEREUM_RPC_URL || 'https://sepolia.infura.io/v3/your-api-key',
    network: process.env.ETHEREUM_NETWORK || 'sepolia',
    contractAddresses: {
      vaultFactory: process.env.ETH_VAULT_FACTORY_ADDRESS || '0x1234567890123456789012345678901234567890',
      cvtToken: process.env.ETH_CVT_TOKEN_ADDRESS || '0x0987654321098765432109876543210987654321'
    },
    // Gas price settings
    gasSettings: {
      maxFeePerGas: process.env.ETH_MAX_FEE_PER_GAS || '150000000000', // in wei
      maxPriorityFeePerGas: process.env.ETH_MAX_PRIORITY_FEE || '1500000000', // in wei
    }
  },
  
  // Solana Configuration
  solana: {
    rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
    network: process.env.SOLANA_NETWORK || 'devnet',
    programIds: {
      vaultProgram: process.env.SOL_VAULT_PROGRAM_ID || 'ChronoSVauLt111111111111111111111111111111111',
      bridgeProgram: process.env.SOL_BRIDGE_PROGRAM_ID || 'Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS'
    },
    // Commitment level for transactions
    commitment: process.env.SOL_COMMITMENT || 'confirmed'
  },
  
  // TON Configuration
  ton: {
    apiKey: process.env.TON_API_KEY || '5216ae7e1e4328d7c3e07bc4d32d2694db47f2c5dd20e56872b766b2fdb7fb02',
    network: process.env.TON_NETWORK || 'testnet',
    contractAddresses: {
      vaultFactory: process.env.TON_VAULT_FACTORY_ADDRESS || 'EQB0gCDoGJNTfoPUSCgBxLuZ_O-7aYUccU0P1Vj_QdO6rQTf',
      cvtMaster: process.env.TON_CVT_MASTER_ADDRESS || 'EQAvDfYmkVV2zFXzC0Hs2e2RGWJyMXHpnMTXH4jnI2W3AwLb',
      stakingContract: process.env.TON_STAKING_ADDRESS || 'EQDi_PSI1WbigxBKCj7vEz2pAvUQfw0IFZz9Sz2aGHUFNpSw'
    },
    // Manifest URL for TON Connect
    manifestUrl: process.env.TON_MANIFEST_URL ||
      'https://8e33114e-6bdb-4fc9-a798-e4b7d77b5366-00-23l8s2c5r5iyx.spock.replit.dev/tonconnect-manifest.json'
  }
};

// Security settings for deployment
export const SECURITY_CONFIG = {
  // CORS settings
  allowedOrigins: process.env.ALLOWED_ORIGINS ? 
    process.env.ALLOWED_ORIGINS.split(',') : 
    ['https://chronosvault.com', 'https://testnet.chronosvault.com'],
  
  // Rate limiting
  rateLimit: {
    windowMs: process.env.RATE_LIMIT_WINDOW || 15 * 60 * 1000, // 15 minutes by default
    max: process.env.RATE_LIMIT_MAX || 100 // limit each IP to 100 requests per windowMs
  },
  
  // Logging configuration
  logging: {
    // Log levels: 'error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'
    level: process.env.LOG_LEVEL || 'info',
    // Whether to log blockchain transactions
    logTransactions: process.env.LOG_TRANSACTIONS === 'true' || true
  }
};

// Stripe configuration for payments
export const PAYMENT_CONFIG = {
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripePublicKey: process.env.VITE_STRIPE_PUBLIC_KEY,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  productPrices: {
    premiumVaultMonthly: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID,
    premiumVaultYearly: process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID
  }
};

// Database configuration
export const DATABASE_CONFIG = {
  url: process.env.DATABASE_URL,
  pool: {
    min: parseInt(process.env.DB_POOL_MIN || '2'),
    max: parseInt(process.env.DB_POOL_MAX || '10')
  }
};

// Server configuration
export const SERVER_CONFIG = {
  port: parseInt(process.env.PORT || '5000'),
  sessionSecret: process.env.SESSION_SECRET || 'chronos-vault-secret-key',
  environment: process.env.NODE_ENV || 'development',
  // Deployment type for scaling
  deploymentType: process.env.DEPLOYMENT_TYPE || 'standard', // 'standard', 'autoscaling', 'serverless'
};

export default {
  blockchain: BLOCKCHAIN_CONFIG,
  security: SECURITY_CONFIG,
  payment: PAYMENT_CONFIG,
  database: DATABASE_CONFIG,
  server: SERVER_CONFIG
};
