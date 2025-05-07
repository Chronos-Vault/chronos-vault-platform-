/**
 * Types used throughout the Chronos Vault application
 */

// Supported blockchain types in the application
export type BlockchainType = 'ETH' | 'SOL' | 'TON' | 'POLYGON' | 'BTC';

// Security level designations
export type SecurityLevel = 'BASIC' | 'ENHANCED' | 'ADVANCED';

// Verification methods for cross-chain operations
export type VerificationMethod = 
  | 'STANDARD' 
  | 'DEEP' 
  | 'ZERO_KNOWLEDGE' 
  | 'QUANTUM_RESISTANT';

// Status types for various operations
export type OperationStatus = 
  | 'PENDING' 
  | 'COMPLETED' 
  | 'FAILED' 
  | 'VERIFIED' 
  | 'INCONSISTENT'
  | 'TIMEOUT';

// Vault access control methods
export type AccessControlMethod = 
  | 'TIME_LOCK' 
  | 'MULTI_SIGNATURE' 
  | 'GEOLOCATION' 
  | 'CROSSCHAIN_VERIFICATION';

// Vault type designations
export type VaultType = 
  | 'PERSONAL' 
  | 'FAMILY' 
  | 'CORPORATE' 
  | 'INHERITANCE' 
  | 'DIAMOND_HANDS'
  | 'TIME_CAPSULE';