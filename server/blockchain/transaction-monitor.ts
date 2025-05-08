/**
 * Transaction Monitor
 * 
 * This module provides real-time monitoring of blockchain transactions,
 * tracking their status and handling errors or delays across multiple chains.
 */

import { securityLogger } from '../monitoring/security-logger';
import { edgeCaseHandler } from './edge-case-handler';
import { BlockchainType } from '../../shared/types';
import config from '../config';
import { EventEmitter } from 'events';

// Transaction status
export enum TransactionStatus {
  PENDING = 'pending',
  CONFIRMING = 'confirming',
  CONFIRMED = 'confirmed',
  FAILED = 'failed',
  TIMEOUT = 'timeout',
  UNKNOWN = 'unknown'
}

// Transaction record
export interface TransactionRecord {
  id: string;
  hash: string;
  chainId: BlockchainType;
  status: TransactionStatus;
  operation: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  confirmations: number;
  attempts: number;
  error?: string;
}

/**
 * Transaction Monitor Class
 */
class TransactionMonitor extends EventEmitter {
  private static instance: TransactionMonitor;
  private transactions: Map<string, TransactionRecord> = new Map();
  private monitoringInterval: NodeJS.Timeout | null = null;
  private readonly CHECK_INTERVAL_MS = 15000; // Check every 15 seconds
  private readonly TRANSACTION_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes
  
  private constructor() {
    super();
  }
  
  /**
   * Get singleton instance
   */
  public static getInstance(): TransactionMonitor {
    if (!TransactionMonitor.instance) {
      TransactionMonitor.instance = new TransactionMonitor();
    }
    return TransactionMonitor.instance;
  }
  
  /**
   * Initialize the transaction monitor
   */
  public initialize(): void {
    if (this.monitoringInterval) {
      return;
    }
    
    // Start monitoring interval
    this.monitoringInterval = setInterval(() => {
      this.checkPendingTransactions();
    }, this.CHECK_INTERVAL_MS);
    
    securityLogger.info('Transaction monitor initialized', {
      checkIntervalMs: this.CHECK_INTERVAL_MS,
      transactionTimeoutMs: this.TRANSACTION_TIMEOUT_MS
    });
  }
  
  /**
   * Stop the transaction monitor
   */
  public shutdown(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    
    securityLogger.info('Transaction monitor shut down');
  }
  
  /**
   * Add a transaction to be monitored
   */
  public addTransaction(
    hash: string,
    chainId: BlockchainType,
    operation: string,
    metadata: Record<string, any> = {}
  ): string {
    const id = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    
    const transaction: TransactionRecord = {
      id,
      hash,
      chainId,
      status: TransactionStatus.PENDING,
      operation,
      metadata,
      createdAt: new Date(),
      updatedAt: new Date(),
      confirmations: 0,
      attempts: 0
    };
    
    this.transactions.set(id, transaction);
    
    securityLogger.info(`Transaction added to monitor: ${hash}`, {
      id,
      chainId,
      operation
    });
    
    // Emit event for new transaction
    this.emit('transaction:new', transaction);
    
    return id;
  }
  
  /**
   * Update transaction status
   */
  public updateTransaction(
    id: string,
    update: Partial<Pick<TransactionRecord, 'status' | 'confirmations' | 'error'>>
  ): TransactionRecord | null {
    const transaction = this.transactions.get(id);
    
    if (!transaction) {
      return null;
    }
    
    // Update fields
    const updatedTransaction = {
      ...transaction,
      ...update,
      updatedAt: new Date()
    };
    
    // If status changed, emit event
    if (transaction.status !== updatedTransaction.status) {
      this.emit(`transaction:${updatedTransaction.status}`, updatedTransaction);
    }
    
    // Store updated transaction
    this.transactions.set(id, updatedTransaction);
    
    return updatedTransaction;
  }
  
  /**
   * Get a transaction by ID
   */
  public getTransaction(id: string): TransactionRecord | null {
    return this.transactions.get(id) || null;
  }
  
  /**
   * Get transactions by chain ID
   */
  public getTransactionsByChain(chainId: BlockchainType): TransactionRecord[] {
    return Array.from(this.transactions.values())
      .filter(tx => tx.chainId === chainId);
  }
  
  /**
   * Check for pending transactions
   */
  private async checkPendingTransactions(): Promise<void> {
    const pendingTransactions = Array.from(this.transactions.values())
      .filter(tx => 
        tx.status === TransactionStatus.PENDING || 
        tx.status === TransactionStatus.CONFIRMING
      );
    
    if (pendingTransactions.length === 0) {
      return;
    }
    
    securityLogger.info(`Checking ${pendingTransactions.length} pending transactions`);
    
    // Group by chain ID for batch processing
    const txByChain = pendingTransactions.reduce<Record<string, TransactionRecord[]>>(
      (acc, tx) => {
        if (!acc[tx.chainId]) {
          acc[tx.chainId] = [];
        }
        acc[tx.chainId].push(tx);
        return acc;
      },
      {}
    );
    
    // Process each chain's transactions
    for (const [chainId, transactions] of Object.entries(txByChain)) {
      this.processChainTransactions(chainId as BlockchainType, transactions);
    }
  }
  
  /**
   * Process transactions for a specific chain
   */
  private async processChainTransactions(
    chainId: BlockchainType,
    transactions: TransactionRecord[]
  ): Promise<void> {
    try {
      // Check for network outage
      if (edgeCaseHandler.isNetworkOutage(chainId)) {
        securityLogger.warn(`Network outage detected for ${chainId}, skipping transaction check`, {
          chainId,
          transactionCount: transactions.length
        });
        return;
      }
      
      // In a production environment, this would:
      // 1. Batch request transaction receipts/status from the blockchain
      // 2. Process each transaction and update its status
      
      // For simulation, we'll just update transaction status randomly
      if (config.shouldSimulateBlockchain(chainId)) {
        this.simulateTransactionUpdates(chainId, transactions);
        return;
      }
      
      // Check each transaction individually
      // This would use the appropriate connector in production
      for (const tx of transactions) {
        try {
          // Increment attempt counter
          tx.attempts += 1;
          
          // Check for timeout
          if (Date.now() - tx.createdAt.getTime() > this.TRANSACTION_TIMEOUT_MS) {
            this.updateTransaction(tx.id, {
              status: TransactionStatus.TIMEOUT,
              error: 'Transaction exceeded maximum wait time'
            });
            continue;
          }
          
          // Update confirmations (would come from blockchain in production)
          const newConfirmations = Math.min(
            tx.confirmations + Math.floor(Math.random() * 2), // 0 or 1 new confirmation
            12 // max confirmations
          );
          
          // Update status based on confirmations
          let newStatus = tx.status;
          if (newConfirmations >= 1 && tx.status === TransactionStatus.PENDING) {
            newStatus = TransactionStatus.CONFIRMING;
          } else if (newConfirmations >= 6) {
            newStatus = TransactionStatus.CONFIRMED;
          }
          
          // Update transaction
          this.updateTransaction(tx.id, {
            status: newStatus,
            confirmations: newConfirmations
          });
          
        } catch (error) {
          securityLogger.error(`Error checking transaction ${tx.hash}`, {
            chainId,
            hash: tx.hash,
            error
          });
        }
      }
    } catch (error) {
      securityLogger.error(`Error processing transactions for chain ${chainId}`, {
        error
      });
    }
  }
  
  /**
   * Simulate transaction updates for development
   */
  private simulateTransactionUpdates(
    chainId: BlockchainType,
    transactions: TransactionRecord[]
  ): void {
    for (const tx of transactions) {
      // Increment attempts
      tx.attempts += 1;
      
      // Check for timeout
      if (Date.now() - tx.createdAt.getTime() > this.TRANSACTION_TIMEOUT_MS) {
        this.updateTransaction(tx.id, {
          status: TransactionStatus.TIMEOUT,
          error: 'Transaction exceeded maximum wait time'
        });
        continue;
      }
      
      // Randomly update status
      const random = Math.random();
      
      if (tx.status === TransactionStatus.PENDING) {
        if (random < 0.7) { // 70% chance to start confirming
          this.updateTransaction(tx.id, {
            status: TransactionStatus.CONFIRMING,
            confirmations: 1
          });
        } else if (random < 0.8) { // 10% chance to fail
          this.updateTransaction(tx.id, {
            status: TransactionStatus.FAILED,
            error: 'Transaction rejected by network'
          });
        }
      } else if (tx.status === TransactionStatus.CONFIRMING) {
        if (random < 0.6) { // 60% chance to get more confirmations
          const newConfirmations = Math.min(tx.confirmations + 1, 12);
          
          this.updateTransaction(tx.id, {
            confirmations: newConfirmations,
            status: newConfirmations >= 6 ? TransactionStatus.CONFIRMED : TransactionStatus.CONFIRMING
          });
        } else if (random < 0.65) { // 5% chance to fail after initial confirmation
          this.updateTransaction(tx.id, {
            status: TransactionStatus.FAILED,
            error: 'Transaction dropped from mempool'
          });
        }
      }
    }
  }
  
  /**
   * Clean up old transactions to prevent memory leaks
   */
  public cleanupOldTransactions(maxAgeHours: number = 24): void {
    const cutoffTime = new Date(Date.now() - (maxAgeHours * 60 * 60 * 1000));
    let cleanupCount = 0;
    
    for (const [id, tx] of this.transactions.entries()) {
      if (tx.updatedAt < cutoffTime) {
        this.transactions.delete(id);
        cleanupCount++;
      }
    }
    
    if (cleanupCount > 0) {
      securityLogger.info(`Cleaned up ${cleanupCount} old transactions`, {
        remainingCount: this.transactions.size,
        olderThanHours: maxAgeHours
      });
    }
  }
}

export const transactionMonitor = TransactionMonitor.getInstance();