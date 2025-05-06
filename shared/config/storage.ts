/**
 * Storage configuration for Chronos Vault
 * 
 * This file contains configuration and constants for various storage options
 * used throughout the application.
 */

export const STORAGE_CONFIG = {
  // Arweave configuration
  ARWEAVE: {
    // Arweave gateway URL
    GATEWAY_URL: 'https://arweave.net',
    // Bundlr Network node URL (faster Arweave uploads)
    BUNDLR_NODE_1: 'https://node1.bundlr.network',
    BUNDLR_NODE_2: 'https://node2.bundlr.network',
    // Default currency for Bundlr (compatible with Arweave)
    DEFAULT_CURRENCY: 'arweave'
  },
  
  // File size limits (in bytes)
  FILE_SIZE_LIMITS: {
    // 100 MB max file size for standard users
    STANDARD: 100 * 1024 * 1024,
    // 500 MB max file size for enhanced security users
    ENHANCED: 500 * 1024 * 1024,
    // 2 GB max file size for maximum security users
    MAXIMUM: 2 * 1024 * 1024 * 1024
  },
  
  // Supported file types for vault storage
  SUPPORTED_FILE_TYPES: [
    // Images
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
    // Documents
    'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain', 'text/csv', 'text/html',
    // Audio
    'audio/mpeg', 'audio/wav', 'audio/ogg',
    // Video
    'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm',
    // Archives
    'application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed',
    // Blockchain
    'application/json'
  ],
  
  // Cross-chain verification settings
  CROSS_CHAIN_VERIFICATION: {
    // Minimum number of chains required for verification
    MIN_CHAINS: 2,
    // Verification interval in milliseconds (24 hours)
    VERIFICATION_INTERVAL: 24 * 60 * 60 * 1000
  },
  
  // Tags for Arweave transactions
  ARWEAVE_TAGS: {
    APP_NAME: 'Chronos-Vault',
    APP_VERSION: '1.0.0',
    CONTENT_TYPE: 'Content-Type',
    VAULT_ID: 'Vault-ID',
    ENCRYPTION: 'Encryption-Type',
    TIMESTAMP: 'Timestamp',
    USER_ID: 'User-ID',
    SECURITY_LEVEL: 'Security-Level',
    CROSS_CHAIN_TX: 'Cross-Chain-TX'
  }
};

// Export default for easy importing
export default STORAGE_CONFIG;
