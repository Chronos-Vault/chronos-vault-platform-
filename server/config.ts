/**
 * Server Configuration
 * 
 * This module provides configuration settings for the server,
 * including blockchain connection details, security parameters,
 * and development mode settings.
 */

interface BlockchainConfig {
  ethereum: {
    rpcUrl: string;
    network: 'mainnet' | 'goerli' | 'sepolia';
    contractAddresses: {
      vault: string;
      token: string;
      bridge: string;
    };
  };
  solana: {
    rpcUrl: string;
    network: 'mainnet-beta' | 'devnet' | 'testnet';
    programIds: {
      vault: string;
      token: string;
      bridge: string;
    };
  };
  ton: {
    apiKey: string;
    network: 'mainnet' | 'testnet';
    contractAddresses: {
      vault: string;
      token: string;
      bridge: string;
    };
  };
  bitcoin: {
    rpcUrl: string;
    network: 'mainnet' | 'testnet';
  };
  polygon: {
    rpcUrl: string;
    network: 'mainnet' | 'mumbai';
    contractAddresses: {
      vault: string;
      token: string;
      bridge: string;
    };
  };
}

interface SecurityConfig {
  zkEnabled: boolean;
  multiSigThreshold: number;
  minConfirmations: {
    ethereum: number;
    solana: number;
    ton: number;
    bitcoin: number;
    polygon: number;
  };
  verificationTimeoutMs: number;
}

interface ServerConfig {
  port: number;
  isDevelopmentMode: boolean;
  apiRateLimits: {
    standard: number;
    authenticated: number;
    whitelisted: number;
  };
}

// Default configuration object
const config = {
  // Blockchain connection configuration
  blockchainConfig: {
    ethereum: {
      rpcUrl: process.env.ETHEREUM_RPC_URL || 'https://sepolia.infura.io/v3/your-api-key',
      network: 'sepolia',
      contractAddresses: {
        vault: '0x1234567890123456789012345678901234567890',
        token: '0x0987654321098765432109876543210987654321',
        bridge: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd'
      }
    },
    solana: {
      rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
      network: 'devnet',
      programIds: {
        vault: 'VauLt1234567890123456789012345678901234567',
        token: 'TokenProg12345678901234567890123456789012',
        bridge: 'BridgePr12345678901234567890123456789012'
      }
    },
    ton: {
      apiKey: process.env.TON_API_KEY || 'your_ton_api_key',
      network: 'testnet',
      contractAddresses: {
        vault: 'EQB0gCDoGJNTfoPUSCgBxLuZ_O-7aYUccU0P1Vj_QdO6rQTf',
        token: 'EQAvDfYmkVV2zFXzC0Hs2e2RGWJyMXHpnMTXH4jnI2W3AwLb',
        bridge: 'EQDi_PSI1WbigxBKCj7vEz2pAvUQfw0IFZz9Sz2aGHUFNpSw'
      }
    },
    bitcoin: {
      rpcUrl: process.env.BITCOIN_RPC_URL || 'https://api.bitaps.com/btc/testnet/v1',
      network: 'testnet'
    },
    polygon: {
      rpcUrl: process.env.POLYGON_RPC_URL || 'https://rpc-mumbai.maticvigil.com',
      network: 'mumbai',
      contractAddresses: {
        vault: '0x2345678901234567890123456789012345678901',
        token: '0x3456789012345678901234567890123456789012',
        bridge: '0x4567890123456789012345678901234567890123'
      }
    }
  } as BlockchainConfig,
  
  // Security settings
  securityConfig: {
    zkEnabled: true,
    multiSigThreshold: 2,
    minConfirmations: {
      ethereum: 12,
      solana: 32,
      ton: 16,
      bitcoin: 6,
      polygon: 16
    },
    verificationTimeoutMs: 30000
  } as SecurityConfig,
  
  // Server settings
  port: parseInt(process.env.PORT || '5000', 10),
  
  // Development mode flag
  isDevelopmentMode: process.env.NODE_ENV !== 'production',
  
  // API rate limiting
  apiRateLimits: {
    standard: 100, // requests per minute
    authenticated: 300, // requests per minute
    whitelisted: 1000 // requests per minute
  }
} as const;

export default config;