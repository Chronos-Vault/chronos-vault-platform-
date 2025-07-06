/**
 * Hash Time Locked Contract (HTLC) Interface
 * 
 * This defines the standard interface for Hash Time Locked Contracts across multiple blockchains
 * to support Cross-Chain Atomic Swaps in Chronos Vault.
 */

import { BlockchainType } from "@/contexts/multi-chain-context";

export enum HTLCStatus {
  INACTIVE = 0,
  ACTIVE = 1,
  COMPLETED = 2,
  REFUNDED = 3,
  EXPIRED = 4
}

export interface HTLCConfig {
  chain: BlockchainType;
  tokenAddress?: string;      // Optional for native tokens like ETH, TON, SOL
  sender: string;             // Sender address
  receiver: string;           // Receiver address
  amount: string;             // Amount to transfer
  hashLock: string;           // Hash of the secret (SHA-256)
  timeLock: number;           // Timestamp when contract expires
  feePayer: string;           // Who pays the fee (sender, receiver, or other)
}

export interface HTLCInfo {
  id: string;                 // Contract ID or address
  config: HTLCConfig;         // HTLC configuration
  status: HTLCStatus;         // Current status
  createdAt: number;          // Creation timestamp
  completedAt?: number;       // Completion timestamp if completed
  refundedAt?: number;        // Refund timestamp if refunded
}

export interface IHTLCContract {
  /**
   * Creates a new HTLC on the specified blockchain
   * @param config The HTLC configuration
   * @returns The contract ID or address
   */
  create(config: HTLCConfig): Promise<string>;

  /**
   * Completes/claims the HTLC by providing the secret
   * @param id The contract ID
   * @param secret The secret that hashes to the hashLock
   * @returns Transaction hash
   */
  claim(id: string, secret: string): Promise<string>;

  /**
   * Refunds the HTLC to the sender (only available after timelock expires)
   * @param id The contract ID
   * @returns Transaction hash
   */
  refund(id: string): Promise<string>;

  /**
   * Gets information about an HTLC
   * @param id The contract ID
   * @returns HTLC information
   */
  getInfo(id: string): Promise<HTLCInfo>;

  /**
   * Generates a random secret and its hash
   * @returns Object containing secret and hashLock
   */
  generateSecret(): Promise<{ secret: string; hashLock: string; }>;

  /**
   * Verifies if a secret matches a hashLock
   * @param secret The secret
   * @param hashLock The hash lock
   * @returns True if the secret matches the hashLock
   */
  verifySecret(secret: string, hashLock: string): Promise<boolean>;
}

/**
 * Base implementation with common functionality across chains
 */
export abstract class BaseHTLCContract implements IHTLCContract {
  protected chain: BlockchainType;

  constructor(chain: BlockchainType) {
    this.chain = chain;
  }

  abstract create(config: HTLCConfig): Promise<string>;
  abstract claim(id: string, secret: string): Promise<string>;
  abstract refund(id: string): Promise<string>;
  abstract getInfo(id: string): Promise<HTLCInfo>;

  async generateSecret(): Promise<{ secret: string; hashLock: string; }> {
    // This would use a secure random generator and hash function in production
    // For now, we'll use a simple implementation
    const bytes = new Uint8Array(32);
    window.crypto.getRandomValues(bytes);
    const secret = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Calculate hash (using browser's native crypto API)
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(secret));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashLock = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return { secret, hashLock };
  }

  async verifySecret(secret: string, hashLock: string): Promise<boolean> {
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(secret));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const calculatedHashLock = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return calculatedHashLock.toLowerCase() === hashLock.toLowerCase();
  }
}
