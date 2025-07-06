/**
 * Transaction Logger for monitoring cross-chain transactions
 * 
 * This utility provides structured logging and monitoring for blockchain 
 * transactions to help with performance optimization and troubleshooting.
 */

import fs from 'fs';
import path from 'path';
import { SECURITY_CONFIG } from '../config';

// Transaction types for logging
export enum TransactionType {
  SEND = 'send',
  RECEIVE = 'receive',
  SWAP = 'swap',
  VAULT_CREATE = 'vault_create',
  VAULT_UPDATE = 'vault_update',
  VAULT_WITHDRAW = 'vault_withdraw',
  HTLC_CREATE = 'htlc_create',
  HTLC_CLAIM = 'htlc_claim',
  HTLC_REFUND = 'htlc_refund',
  TOKEN_MINT = 'token_mint',
  TOKEN_BURN = 'token_burn',
  MULTI_SIG = 'multi_sig'
}

// Blockchain types
export enum BlockchainType {
  ETHEREUM = 'ETH',
  SOLANA = 'SOL',
  TON = 'TON'
}

// Transaction log entry interface
export interface TransactionLogEntry {
  id: string;
  timestamp: number;
  type: TransactionType;
  blockchain: BlockchainType;
  status: 'pending' | 'confirmed' | 'failed';
  txHash?: string;
  fromAddress?: string;
  toAddress?: string;
  amount?: string;
  asset?: string;
  gasUsed?: number;
  fee?: string;
  confirmationTime?: number; // in milliseconds
  error?: string;
  metadata?: Record<string, any>;
}

class TransactionLogger {
  private static instance: TransactionLogger;
  private logDir: string;
  private currentLogFile: string;
  private transactionCache: Map<string, TransactionLogEntry> = new Map();
  private isLogEnabled: boolean;

  private constructor() {
    // Initialize log directory
    this.logDir = path.join(process.cwd(), 'logs', 'transactions');
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
    
    // Set current log file with date
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    this.currentLogFile = path.join(this.logDir, `transactions-${today}.log`);
    
    // Check if transaction logging is enabled
    this.isLogEnabled = SECURITY_CONFIG.logging.logTransactions;
    
    // Log startup
    if (this.isLogEnabled) {
      this.logToFile({
        level: 'info',
        message: 'Transaction logger initialized',
        timestamp: new Date().toISOString()
      });
    }
    
    // Setup periodic cache cleanup
    setInterval(() => this.cleanupCache(), 24 * 60 * 60 * 1000); // Daily cleanup
  }

  public static getInstance(): TransactionLogger {
    if (!TransactionLogger.instance) {
      TransactionLogger.instance = new TransactionLogger();
    }
    return TransactionLogger.instance;
  }

  /**
   * Log a new transaction
   */
  public logTransaction(transaction: TransactionLogEntry): void {
    if (!this.isLogEnabled) return;
    
    // Cache the transaction for later updates
    this.transactionCache.set(transaction.id, transaction);
    
    // Log to file
    this.logToFile({
      level: 'info',
      message: `[${transaction.blockchain}] ${transaction.type} transaction ${transaction.status}`,
      transaction,
      timestamp: new Date().toISOString()
    });
    
    // If this is a performance-critical transaction (confirmed), log metrics
    if (transaction.status === 'confirmed' && transaction.confirmationTime) {
      console.log(`[METRICS] ${transaction.blockchain} ${transaction.type} confirmed in ${transaction.confirmationTime}ms, gas: ${transaction.gasUsed || 'N/A'}`);
    }
  }

  /**
   * Update an existing transaction
   */
  public updateTransaction(id: string, updates: Partial<TransactionLogEntry>): void {
    if (!this.isLogEnabled) return;
    
    const existingTx = this.transactionCache.get(id);
    if (!existingTx) {
      console.warn(`Cannot update transaction ${id}: not found in cache`);
      return;
    }
    
    // Update the transaction
    const updatedTx = { ...existingTx, ...updates };
    this.transactionCache.set(id, updatedTx);
    
    // Log the update
    this.logToFile({
      level: 'info',
      message: `[${updatedTx.blockchain}] ${updatedTx.type} transaction updated to ${updatedTx.status}`,
      transaction: updatedTx,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Log a transaction error
   */
  public logTransactionError(id: string, error: string, metadata?: Record<string, any>): void {
    if (!this.isLogEnabled) return;
    
    const existingTx = this.transactionCache.get(id);
    if (!existingTx) {
      // Log a new error entry if transaction not found
      this.logToFile({
        level: 'error',
        message: `Transaction error: ${error}`,
        transactionId: id,
        metadata,
        timestamp: new Date().toISOString()
      });
      return;
    }
    
    // Update the transaction with error info
    const updatedTx = { 
      ...existingTx, 
      status: 'failed' as const,
      error,
      metadata: { ...(existingTx.metadata || {}), ...(metadata || {}) }
    };
    
    this.transactionCache.set(id, updatedTx);
    
    // Log the error
    this.logToFile({
      level: 'error',
      message: `[${updatedTx.blockchain}] ${updatedTx.type} transaction failed: ${error}`,
      transaction: updatedTx,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Get transaction statistics for monitoring
   */
  public getTransactionStats(timeframe: 'hour' | 'day' | 'week' = 'day'): any {
    // This would normally analyze the logs to generate statistics
    // For now, we'll return placeholder data based on the cache
    
    const now = Date.now();
    let timeThreshold: number;
    
    switch (timeframe) {
      case 'hour':
        timeThreshold = now - (60 * 60 * 1000);
        break;
      case 'week':
        timeThreshold = now - (7 * 24 * 60 * 60 * 1000);
        break;
      case 'day':
      default:
        timeThreshold = now - (24 * 60 * 60 * 1000);
    }
    
    // Filter transactions within the timeframe
    const recentTxs = Array.from(this.transactionCache.values())
      .filter(tx => tx.timestamp >= timeThreshold);
    
    // Count by status
    const totalCount = recentTxs.length;
    const confirmedCount = recentTxs.filter(tx => tx.status === 'confirmed').length;
    const pendingCount = recentTxs.filter(tx => tx.status === 'pending').length;
    const failedCount = recentTxs.filter(tx => tx.status === 'failed').length;
    
    // Count by blockchain
    const ethCount = recentTxs.filter(tx => tx.blockchain === BlockchainType.ETHEREUM).length;
    const solCount = recentTxs.filter(tx => tx.blockchain === BlockchainType.SOLANA).length;
    const tonCount = recentTxs.filter(tx => tx.blockchain === BlockchainType.TON).length;
    
    // Calculate average confirmation time for confirmed transactions
    const confirmedTxs = recentTxs.filter(tx => tx.status === 'confirmed' && tx.confirmationTime);
    const avgConfirmationTime = confirmedTxs.length > 0
      ? confirmedTxs.reduce((sum, tx) => sum + (tx.confirmationTime || 0), 0) / confirmedTxs.length
      : 0;
    
    return {
      timeframe,
      totalCount,
      byStatus: {
        confirmed: confirmedCount,
        pending: pendingCount,
        failed: failedCount
      },
      byBlockchain: {
        [BlockchainType.ETHEREUM]: ethCount,
        [BlockchainType.SOLANA]: solCount,
        [BlockchainType.TON]: tonCount
      },
      performance: {
        avgConfirmationTimeMs: avgConfirmationTime,
        successRate: totalCount > 0 ? (confirmedCount / totalCount) * 100 : 0
      }
    };
  }

  /**
   * Write a log entry to the transaction log file
   */
  private logToFile(entry: any): void {
    try {
      // Check if we need to rotate the log file
      this.checkLogRotation();
      
      // Write to log file
      fs.appendFileSync(
        this.currentLogFile,
        JSON.stringify(entry) + '\n',
        { encoding: 'utf8' }
      );
    } catch (error) {
      console.error('Failed to write to transaction log:', error);
    }
  }

  /**
   * Check if we need to rotate to a new log file (daily)
   */
  private checkLogRotation(): void {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const expectedLogFile = path.join(this.logDir, `transactions-${today}.log`);
    
    if (this.currentLogFile !== expectedLogFile) {
      this.currentLogFile = expectedLogFile;
    }
  }

  /**
   * Clean up old entries from the transaction cache
   */
  private cleanupCache(): void {
    const now = Date.now();
    const retentionPeriod = 7 * 24 * 60 * 60 * 1000; // 7 days
    
    for (const [id, tx] of this.transactionCache.entries()) {
      // Remove entries older than retention period
      if (now - tx.timestamp > retentionPeriod) {
        this.transactionCache.delete(id);
      }
    }
  }
}

export const transactionLogger = TransactionLogger.getInstance();
