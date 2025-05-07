/**
 * Shared Types
 *
 * Common types used across the application for consistent interfaces.
 */

export type BlockchainType = 'ETH' | 'SOL' | 'TON' | 'BTC';

export enum VerificationMethod {
  STANDARD = 'STANDARD',
  CROSS_CHAIN = 'CROSS_CHAIN',
  MULTI_SIG = 'MULTI_SIG',
  ZERO_KNOWLEDGE = 'ZERO_KNOWLEDGE'
}

export enum VaultType {
  STANDARD = 'STANDARD',
  TIME_LOCKED = 'TIME_LOCKED',
  MULTI_SIG = 'MULTI_SIG',
  CROSS_CHAIN = 'CROSS_CHAIN',
  CONDITION_BASED = 'CONDITION_BASED',
  BITCOIN_HALVING = 'BITCOIN_HALVING',
  BITCOIN_PRICE = 'BITCOIN_PRICE'
}

export enum SecurityLevel {
  BASIC = 1,
  ADVANCED = 2,
  MAXIMUM = 3
}

export interface StressTestConfig {
  iterations: number;
  concurrency: number;
  delay: number;
  timeoutMs: number;
  chains: BlockchainType[];
  isDevelopmentMode: boolean;
}