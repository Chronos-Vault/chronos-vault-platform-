/**
 * Cross-Chain Vault Verification Service
 * 
 * This service implements our Triple-Chain Security architecture for vault verification.
 * It coordinates verification across multiple blockchains to ensure the highest level 
 * of security and reliability for vault operations.
 */

import { securityLogger } from '../monitoring/security-logger';
import { edgeCaseHandler } from './edge-case-handler';
import { ConnectorFactory } from './connector-factory';
import { transactionMonitor, TransactionStatus } from './transaction-monitor';
import { crossChainErrorHandler, CrossChainErrorCategory } from '../security/cross-chain-error-handler';
import { BlockchainType } from '../../shared/types';
import config from '../config';
import { SecurityEventType } from '../monitoring/security-logger';
import { EventEmitter } from 'events';

// Types for verification process

export enum VerificationStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  PARTIAL = 'partial'
}

export enum VerificationLevel {
  BASIC = 'basic',           // Single-chain verification
  STANDARD = 'standard',     // Two-chain verification
  ADVANCED = 'advanced'      // Full Triple-Chain verification
}

export interface VerificationResult {
  isValid: boolean;
  status: VerificationStatus;
  level: VerificationLevel;
  vaultId: string;
  primaryChain: BlockchainType;
  secondaryVerifications: Record<string, SecondaryVerification>;
  timestamp: Date;
  transactionIds: string[];
  signatures: string[];
  metadata?: Record<string, any>;
}

export interface SecondaryVerification {
  chainId: BlockchainType;
  status: VerificationStatus;
  isValid: boolean;
  timestamp: Date;
  transactionId?: string;
  signature?: string;
  error?: string;
}

/**
 * Cross-Chain Vault Verification Service
 */
class CrossChainVaultVerification extends EventEmitter {
  private static instance: CrossChainVaultVerification;
  private connectorFactory: ConnectorFactory;
  private verificationCache: Map<string, VerificationResult> = new Map();
  private verificationQueue: Map<string, NodeJS.Timeout> = new Map();
  
  // Define the roles of each chain in our Triple-Chain Security model
  private chainRoles: Record<BlockchainType, string> = {
    ethereum: 'ownership',       // Primary ownership records
    solana: 'monitoring',        // High-speed monitoring and validation
    ton: 'recovery',             // Backup and recovery operations
    bitcoin: 'timestamping'      // Immutable timestamping
  };
  
  private constructor(connectorFactory: ConnectorFactory) {
    super();
    this.connectorFactory = connectorFactory;
    
    // Set up event listeners for transaction status changes
    transactionMonitor.on('transaction:confirmed', (tx) => {
      if (tx.metadata.isVerification) {
        this.handleVerificationTransactionConfirmed(tx);
      }
    });
    
    transactionMonitor.on('transaction:failed', (tx) => {
      if (tx.metadata.isVerification) {
        this.handleVerificationTransactionFailed(tx);
      }
    });
    
    securityLogger.info('Cross-Chain Vault Verification service initialized', {
      supportedChains: Object.keys(this.chainRoles)
    });
  }
  
  /**
   * Get the singleton instance
   */
  public static getInstance(connectorFactory: ConnectorFactory): CrossChainVaultVerification {
    if (!CrossChainVaultVerification.instance) {
      CrossChainVaultVerification.instance = new CrossChainVaultVerification(connectorFactory);
    }
    return CrossChainVaultVerification.instance;
  }
  
  /**
   * Verify a vault across multiple blockchains with enhanced error recovery
   */
  public async verifyVault(
    vaultId: string,
    primaryChain: BlockchainType,
    secondaryChains: BlockchainType[] = [],
    level: VerificationLevel = VerificationLevel.STANDARD
  ): Promise<VerificationResult> {
    try {
      // Check if we have a recent cached verification
      const cacheKey = `${vaultId}:${primaryChain}:${level}`;
      const cachedResult = this.verificationCache.get(cacheKey);
      
      if (cachedResult && this.isVerificationRecent(cachedResult)) {
        securityLogger.info(`Using cached verification for vault ${vaultId}`, {
          vaultId,
          primaryChain,
          cacheAge: Date.now() - cachedResult.timestamp.getTime()
        });
        return cachedResult;
      }
      
      // Make sure we have at least one secondary chain for standard/advanced verification
      if (level !== VerificationLevel.BASIC && secondaryChains.length === 0) {
        // Default secondary chains based on primary
        secondaryChains = this.getDefaultSecondaryChains(primaryChain);
      }
      
      // Determine chains to verify based on level
      const chainsToVerify = level === VerificationLevel.BASIC 
        ? [primaryChain]
        : level === VerificationLevel.STANDARD
          ? [primaryChain, secondaryChains[0]]
          : [primaryChain, ...secondaryChains];
      
      // Create initial verification result
      const verificationResult: VerificationResult = {
        isValid: false,
        status: VerificationStatus.IN_PROGRESS,
        level,
        vaultId,
        primaryChain,
        secondaryVerifications: {},
        timestamp: new Date(),
        transactionIds: [],
        signatures: [],
        metadata: {
          verificationAttempt: 1,
          recoveryAttempts: 0,
          atomicCommitPhase: 'started'
        }
      };
      
      // Store in cache immediately to prevent duplicate verifications
      this.verificationCache.set(cacheKey, verificationResult);
      
      // PHASE 1: Primary Chain Verification
      verificationResult.metadata.atomicCommitPhase = 'primary_verification';
      this.verificationCache.set(cacheKey, verificationResult);
      
      // Primary chain verification with retry on failure
      let primaryVerification: SecondaryVerification;
      let primaryVerificationError: any = null;
      
      try {
        primaryVerification = await this.verifyOnChain(vaultId, primaryChain);
      } catch (error) {
        primaryVerificationError = error;
        
        // Try to recover from primary chain verification error
        const crossChainError = crossChainErrorHandler.handle(error, {
          category: CrossChainErrorCategory.VERIFICATION_FAILURE,
          blockchain: primaryChain,
          vaultId,
          retryCount: verificationResult.metadata.recoveryAttempts
        });
        
        // Check if we should attempt recovery
        if (crossChainErrorHandler.shouldAttemptRecovery(crossChainError)) {
          verificationResult.metadata.recoveryAttempts++;
          securityLogger.warn(`Attempting recovery for primary chain verification`, {
            vaultId,
            primaryChain,
            recoveryAttempt: verificationResult.metadata.recoveryAttempts,
            errorMessage: crossChainError.message
          });
          
          // Update cache to reflect recovery attempt
          this.verificationCache.set(cacheKey, verificationResult);
          
          // Retry primary verification with exponential backoff
          const delayMs = Math.min(1000 * Math.pow(2, verificationResult.metadata.recoveryAttempts - 1), 30000);
          await new Promise(resolve => setTimeout(resolve, delayMs));
          
          try {
            primaryVerification = await this.verifyOnChain(vaultId, primaryChain);
            primaryVerificationError = null;
          } catch (retryError) {
            primaryVerificationError = retryError;
            
            // Check if fallback chain should be used
            const fallbackChain = crossChainErrorHandler.getRecommendedFallbackChain(primaryChain);
            if (fallbackChain) {
              securityLogger.warn(`Using fallback chain ${fallbackChain} for primary verification`, {
                vaultId,
                originalChain: primaryChain,
                fallbackChain
              });
              
              try {
                primaryVerification = await this.verifyOnChain(vaultId, fallbackChain);
                primaryVerificationError = null;
                
                // Update verification result to reflect fallback chain usage
                verificationResult.metadata.usedFallbackChain = fallbackChain;
                verificationResult.metadata.originalPrimaryChain = primaryChain;
                
                // Adjust chains to verify to include fallback chain
                if (!secondaryChains.includes(fallbackChain)) {
                  secondaryChains = secondaryChains.filter(c => c !== primaryChain);
                  secondaryChains.push(fallbackChain);
                }
              } catch (fallbackError) {
                // Both primary and fallback verifications failed
                primaryVerificationError = fallbackError;
                securityLogger.error(`Both primary and fallback chain verifications failed`, {
                  vaultId,
                  primaryChain,
                  fallbackChain,
                  primaryError: error.message,
                  fallbackError: fallbackError.message
                });
              }
            }
          }
        }
      }

      // Check if primary verification failed after all recovery attempts
      if (primaryVerificationError || !primaryVerification.isValid) {
        verificationResult.status = VerificationStatus.FAILED;
        verificationResult.isValid = false;
        verificationResult.metadata.failureReason = primaryVerificationError 
          ? primaryVerificationError.message 
          : 'Primary verification invalid';
        
        securityLogger.error(`Primary chain verification failed for vault ${vaultId}`, {
          vaultId,
          primaryChain,
          error: primaryVerificationError || primaryVerification.error,
          recoveryAttempts: verificationResult.metadata.recoveryAttempts
        });
        
        this.verificationCache.set(cacheKey, verificationResult);
        return verificationResult;
      }
      
      // Add primary transaction ID and signature
      if (primaryVerification.transactionId) {
        verificationResult.transactionIds.push(primaryVerification.transactionId);
      }
      
      if (primaryVerification.signature) {
        verificationResult.signatures.push(primaryVerification.signature);
      }
      
      // PHASE 2: Secondary Chain Verifications (if required by verification level)
      if (level !== VerificationLevel.BASIC) {
        verificationResult.metadata.atomicCommitPhase = 'secondary_verification';
        this.verificationCache.set(cacheKey, verificationResult);
        
        // Enhanced parallel verification with individual chain error handling
        const secondaryVerificationPromises = secondaryChains
          .filter(chain => chainsToVerify.includes(chain))
          .map(chain => this.verifyOnChainWithRecovery(vaultId, chain, verificationResult.metadata.recoveryAttempts || 0));
        
        const secondaryResults = await Promise.allSettled(secondaryVerificationPromises);
        
        // Process secondary results with advanced recovery handling
        let validSecondaryCount = 0;
        let partialSecondaryCount = 0;
        
        for (let i = 0; i < secondaryResults.length; i++) {
          const chain = secondaryChains[i];
          const result = secondaryResults[i];
          
          if (result.status === 'fulfilled') {
            const verification = result.value;
            verificationResult.secondaryVerifications[chain] = verification;
            
            if (verification.isValid) {
              validSecondaryCount++;
              
              // Add transaction ID and signature if available
              if (verification.transactionId) {
                verificationResult.transactionIds.push(verification.transactionId);
              }
              
              if (verification.signature) {
                verificationResult.signatures.push(verification.signature);
              }
            } else if (verification.status === VerificationStatus.PARTIAL) {
              // Track partial verifications separately
              partialSecondaryCount++;
            }
          } else {
            // Handle rejected promise
            securityLogger.warn(`Secondary verification failed for chain ${chain}`, {
              vaultId,
              chain,
              error: result.reason
            });
            
            // Add a failed verification entry
            verificationResult.secondaryVerifications[chain] = {
              chainId: chain,
              status: VerificationStatus.FAILED,
              isValid: false,
              timestamp: new Date(),
              error: result.reason?.message || String(result.reason)
            };
          }
        }
        
        // PHASE 3: Determine overall verification status with partial verification support
        verificationResult.metadata.atomicCommitPhase = 'consensus_determination';
        verificationResult.metadata.validSecondaryCount = validSecondaryCount;
        verificationResult.metadata.partialSecondaryCount = partialSecondaryCount;
        
        if (level === VerificationLevel.STANDARD) {
          // Standard level requires at least one valid secondary verification
          if (validSecondaryCount >= 1) {
            verificationResult.isValid = true;
            verificationResult.status = VerificationStatus.COMPLETED;
          } else if (validSecondaryCount === 0 && partialSecondaryCount >= 1) {
            // Partial verification might be acceptable if the primary chain is valid
            const partialDecision = crossChainErrorHandler.shouldAcceptPartialVerification(
              primaryChain, 
              Object.keys(verificationResult.secondaryVerifications) as BlockchainType[],
              1
            );
            
            if (partialDecision.shouldAccept) {
              verificationResult.isValid = true;
              verificationResult.status = VerificationStatus.PARTIAL;
              verificationResult.metadata.acceptedPartialVerification = true;
              verificationResult.metadata.partialVerificationReason = partialDecision.reason;
            } else {
              verificationResult.isValid = false;
              verificationResult.status = VerificationStatus.PARTIAL;
              verificationResult.metadata.acceptedPartialVerification = false;
              verificationResult.metadata.partialVerificationReason = partialDecision.reason;
            }
          } else {
            // No valid or partial secondary verifications
            verificationResult.isValid = false;
            verificationResult.status = VerificationStatus.FAILED;
          }
        } else if (level === VerificationLevel.ADVANCED) {
          // Advanced level normally requires at least two valid secondary verifications
          if (validSecondaryCount >= 2) {
            verificationResult.isValid = true;
            verificationResult.status = VerificationStatus.COMPLETED;
          } else if (validSecondaryCount + partialSecondaryCount >= 2) {
            // Consider accepting partial verifications for high availability
            const partialDecision = crossChainErrorHandler.shouldAcceptPartialVerification(
              primaryChain, 
              Object.keys(verificationResult.secondaryVerifications) as BlockchainType[],
              2
            );
            
            if (partialDecision.shouldAccept) {
              verificationResult.isValid = true;
              verificationResult.status = VerificationStatus.PARTIAL;
              verificationResult.metadata.acceptedPartialVerification = true;
              verificationResult.metadata.partialVerificationReason = partialDecision.reason;
            } else {
              verificationResult.isValid = false;
              verificationResult.status = VerificationStatus.PARTIAL;
              verificationResult.metadata.acceptedPartialVerification = false;
              verificationResult.metadata.partialVerificationReason = partialDecision.reason;
            }
          } else if (validSecondaryCount > 0) {
            // Some valid secondary verifications but not enough
            verificationResult.isValid = false;
            verificationResult.status = VerificationStatus.PARTIAL;
          } else {
            // No valid secondary verifications
            verificationResult.isValid = false;
            verificationResult.status = VerificationStatus.FAILED;
          }
        }
      } else {
        // Basic verification only requires primary chain
        verificationResult.isValid = true;
        verificationResult.status = VerificationStatus.COMPLETED;
      }
      
      // PHASE 4: Finalization
      verificationResult.metadata.atomicCommitPhase = 'completed';
      verificationResult.metadata.completedAt = new Date().toISOString();
      
      // Update cache with final result
      this.verificationCache.set(cacheKey, verificationResult);
      
      // Emit verification completed event
      this.emit('verification:completed', verificationResult);
      
      return verificationResult;
    } catch (error) {
      // Handle unexpected errors
      const crossChainError = crossChainErrorHandler.handle(error, {
        category: CrossChainErrorCategory.VALIDATION_FAILURE,
        blockchain: primaryChain
      });
      
      securityLogger.error(`Vault verification error for ${vaultId}`, {
        vaultId,
        primaryChain,
        errorCategory: crossChainError.category,
        errorMessage: crossChainError.message
      });
      
      // Return a failed verification result
      const failedResult: VerificationResult = {
        isValid: false,
        status: VerificationStatus.FAILED,
        level,
        vaultId,
        primaryChain,
        secondaryVerifications: {},
        timestamp: new Date(),
        transactionIds: [],
        signatures: [],
        metadata: {
          error: crossChainError.message,
          category: crossChainError.category,
          atomicCommitPhase: 'error'
        }
      };
      
      return failedResult;
    }
  }
  
  /**
   * Verify a vault on a specific blockchain
   */
  private async verifyOnChain(
    vaultId: string,
    chainId: BlockchainType
  ): Promise<SecondaryVerification> {
    try {
      securityLogger.info(`Verifying vault ${vaultId} on ${chainId}`, {
        vaultId,
        chainId,
        role: this.chainRoles[chainId]
      });
      
      // Use the edge case handler for reliable blockchain operations
      const connector = this.connectorFactory.getConnector(chainId);
      
      // If simulation mode is active, just simulate the verification
      if (config.shouldSimulateBlockchain(chainId)) {
        // Create a simulated transaction ID
        const transactionId = `simulated_verification_${chainId}_${vaultId}_${Date.now()}`;
        
        // Generate unique signature
        const signature = `sig_${chainId}_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
        
        // Add to transaction monitor
        transactionMonitor.addTransaction(
          transactionId,
          chainId,
          'vault_verification',
          { vaultId, isVerification: true }
        );
        
        // Return a successful verification
        return {
          chainId,
          status: VerificationStatus.COMPLETED,
          isValid: true,
          timestamp: new Date(),
          transactionId,
          signature
        };
      }
      
      // Get the blockchain-specific verification
      const verificationResult = await edgeCaseHandler.withRetry(
        async () => connector.verifyVaultIntegrity(vaultId),
        chainId,
        'validation',
        { vaultId, operation: 'vault_verification' }
      );
      
      // Transform the result into our standard format
      const secondaryVerification: SecondaryVerification = {
        chainId,
        status: VerificationStatus.COMPLETED,
        isValid: verificationResult.isValid,
        timestamp: new Date(),
        transactionId: verificationResult.transactionHash || undefined,
        signature: verificationResult.signatures?.[0] || undefined
      };
      
      // If there's a transaction hash, add it to the transaction monitor
      if (verificationResult.transactionHash) {
        transactionMonitor.addTransaction(
          verificationResult.transactionHash,
          chainId,
          'vault_verification',
          { vaultId, isVerification: true }
        );
      }
      
      return secondaryVerification;
    } catch (error) {
      // Handle validation errors
      const crossChainError = crossChainErrorHandler.handle(error, {
        category: CrossChainErrorCategory.VALIDATION_FAILURE,
        blockchain: chainId
      });
      
      securityLogger.warn(`Verification failed on ${chainId} for vault ${vaultId}`, {
        vaultId,
        chainId,
        errorCategory: crossChainError.category,
        errorMessage: crossChainError.message
      });
      
      // Return a failed verification
      return {
        chainId,
        status: VerificationStatus.FAILED,
        isValid: false,
        timestamp: new Date(),
        error: crossChainError.message
      };
    }
  }
  
  /**
   * Verify a vault on a specific blockchain with enhanced recovery mechanisms
   * Implements improved atomic commit protocol with multiple verification phases
   */
  private async verifyOnChainWithRecovery(
    vaultId: string, 
    chainId: BlockchainType,
    existingRetryCount: number = 0,
    recoveryPhase: 'initial' | 'retry' | 'alternative' | 'fallback' = 'initial',
    verificationContext: Record<string, any> = {}
  ): Promise<SecondaryVerification> {
    // Track verification progress and attempts for atomic operations
    const context = {
      startTime: verificationContext.startTime || Date.now(),
      attempts: verificationContext.attempts || 1,
      chains: verificationContext.chains || new Set([chainId]),
      recoveryPath: verificationContext.recoveryPath || [recoveryPhase],
      ...verificationContext
    };
    
    securityLogger.debug(`Starting verification phase: ${recoveryPhase}`, {
      vaultId,
      chainId,
      context
    });
    
    // First attempt normal verification
    try {
      // Begin the verification transaction with a pre-verification check
      const preCheckResult = await this.connectorFactory.getConnector(chainId).checkVaultExists(vaultId);
      
      if (!preCheckResult.exists) {
        return {
          chainId,
          status: VerificationStatus.FAILED,
          isValid: false,
          timestamp: new Date(),
          error: `Vault ${vaultId} does not exist on ${chainId}`
        };
      }
      
      // Perform the full verification if pre-check passed
      const result = await this.verifyOnChain(vaultId, chainId);
      
      // Track successful verification in chain availability
      chainAvailabilityTracker.recordSuccess(chainId);
      
      return result;
    } catch (error) {
      // Track chain failure in availability tracker
      chainAvailabilityTracker.recordFailure(chainId);
      
      // Process the error and determine recovery strategy with enhanced context
      const crossChainError = crossChainErrorHandler.handle(error, {
        category: CrossChainErrorCategory.VERIFICATION_FAILURE,
        blockchain: chainId,
        operation: 'verifyVault',
        vaultId,
        retryCount: existingRetryCount,
        verificationContext: context
      });
      
      // Enhanced error logging with detailed context
      securityLogger.error(`Verification failed for ${chainId}`, {
        vaultId,
        chainId,
        errorType: crossChainError.type,
        errorCategory: crossChainError.category,
        context,
        recoveryRecommended: crossChainErrorHandler.shouldAttemptRecovery(crossChainError)
      });
      
      // Check if the chain is having systemic issues
      const chainStatus = chainAvailabilityTracker.getChainStatus(chainId);
      if (chainStatus.consecutiveFailures > 3) {
        securityLogger.warn(`Chain ${chainId} appears to be experiencing systemic issues`, {
          consecutiveFailures: chainStatus.consecutiveFailures,
          failureRate: chainStatus.failureRate
        });
      }
      
      // Check if we should attempt recovery - enhanced decision logic
      if (crossChainErrorHandler.shouldAttemptRecovery(crossChainError)) {
        const retryCount = existingRetryCount + 1;
        
        // Record this recovery attempt 
        context.attempts++;
        context.recoveryPath.push(recoveryPhase === 'initial' ? 'retry' : recoveryPhase);
        
        // Enhanced recovery logging with detailed metrics
        securityLogger.warn(`Attempting enhanced recovery for verification`, {
          vaultId,
          chainId,
          recoveryAttempt: retryCount,
          recoveryPhase: recoveryPhase === 'initial' ? 'retry' : recoveryPhase,
          errorType: crossChainError.type,
          errorCategory: crossChainError.category,
          verificationDuration: Date.now() - context.startTime
        });
        
        // Implement enhanced exponential backoff for retries with jitter to prevent thundering herd
        const maxBackoff = 20000; // 20 seconds max
        const baseDelay = Math.min(1000 * Math.pow(1.8, retryCount - 1), maxBackoff);
        const jitter = Math.random() * 300; // Add randomness to prevent synchronized retries
        const delayMs = baseDelay + jitter;
        
        await new Promise(resolve => setTimeout(resolve, delayMs));
        
        // PHASE 1: RETRY with same chain if we're in the initial phase
        if (recoveryPhase === 'initial') {
          try {
            securityLogger.info(`Retry phase: Attempting verification with same chain`, {
              vaultId, 
              chainId,
              attempt: context.attempts
            });
            
            // Retry with the same chain
            return await this.verifyOnChainWithRecovery(
              vaultId, 
              chainId, 
              retryCount, 
              'retry',
              context
            );
          } catch (retryError) {
            // Retry failed, continue to alternative endpoint phase
            securityLogger.warn(`Retry phase failed, continuing to alternative endpoint`, {
              vaultId,
              chainId
            });
          }
        }
        
        // PHASE 2: ALTERNATIVE ENDPOINT if retry fails or we're already in alternative phase
        if (recoveryPhase === 'initial' || recoveryPhase === 'retry') {
          // Check if we should try an alternative endpoint
          if (crossChainError.retryStrategy?.alternativeEndpoint) {
            securityLogger.info(`Alternative endpoint phase: Trying alternative endpoint for ${chainId}`, {
              vaultId,
              chainId,
              alternativeEndpoint: crossChainError.retryStrategy.alternativeEndpoint
            });
            
            try {
              // Use connector factory to get connector with alternative endpoint
              const connector = this.connectorFactory.getConnectorWithEndpoint(
                chainId, 
                crossChainError.retryStrategy.alternativeEndpoint
              );
              
              if (connector) {
                context.alternativeEndpoint = crossChainError.retryStrategy.alternativeEndpoint;
                
                // Try verification with alternative endpoint
                if (config.shouldSimulateBlockchain(chainId)) {
                  // Simulate verification for the alternative endpoint
                  const transactionId = `simulated_alt_verification_${chainId}_${vaultId}_${Date.now()}`;
                  const signature = `sig_alt_${chainId}_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
                  
                  return {
                    chainId,
                    status: VerificationStatus.COMPLETED,
                    isValid: true,
                    timestamp: new Date(),
                    transactionId,
                    signature,
                    metadata: {
                      recoveryPath: context.recoveryPath,
                      alternativeEndpoint: true,
                      verificationDuration: Date.now() - context.startTime
                    }
                  };
                }
                
                // Perform actual verification with the alternative endpoint
                const altVerificationResult = await connector.verifyVaultIntegrity(vaultId);
                
                return {
                  chainId,
                  status: VerificationStatus.COMPLETED,
                  isValid: altVerificationResult.isValid,
                  timestamp: new Date(),
                  transactionId: altVerificationResult.transactionHash || undefined,
                  signature: altVerificationResult.signatures?.[0] || undefined,
                  metadata: {
                    recoveryPath: context.recoveryPath,
                    alternativeEndpoint: true,
                    verificationDuration: Date.now() - context.startTime
                  }
                };
              }
            } catch (alternativeError) {
              // Alternative endpoint failed, continue to fallback chain phase
              securityLogger.error(`Alternative endpoint for ${chainId} also failed`, {
                vaultId,
                chainId,
                error: alternativeError,
                proceedingToFallback: true
              });
              
              // Try the fallback chain phase
              return await this.verifyOnChainWithRecovery(
                vaultId, 
                chainId, 
                retryCount, 
                'fallback',
                context
              );
            }
          }
        }
        
        // PHASE 3: FALLBACK CHAIN if all other methods fail
        if (recoveryPhase === 'initial' || recoveryPhase === 'retry' || recoveryPhase === 'alternative' || recoveryPhase === 'fallback') {
          // Check if we should try a fallback chain
          const fallbackChain = crossChainErrorHandler.getRecommendedFallbackChain(chainId);
          
          if (fallbackChain && !context.chains.has(fallbackChain)) {
            securityLogger.info(`Fallback phase: Trying fallback chain ${fallbackChain} for ${chainId}`, {
              vaultId,
              originalChain: chainId,
              fallbackChain,
              attemptCount: context.attempts,
              recoveryPath: context.recoveryPath
            });
            
            try {
              // Record this fallback chain to prevent cycles
              context.chains.add(fallbackChain);
              
              // Use the fallback chain for verification - but start a fresh verification process
              const fallbackVerification = await this.verifyOnChain(vaultId, fallbackChain);
              
              // Successfully verified on fallback chain
              securityLogger.info(`Successfully verified on fallback chain ${fallbackChain}`, {
                vaultId,
                originalChain: chainId,
                fallbackChain,
                isValid: fallbackVerification.isValid
              });
              
              // Register this fallback for operational monitoring
              fallbackRegistry.registerFallback({
                vaultId,
                primaryChain: chainId,
                fallbackChain,
                strategy: fallbackVerification.isValid ? 'verification' : 'integrity_check',
                reason: `Primary chain ${chainId} unavailable: ${crossChainError.message}`,
                timestamp: new Date()
              });
              
              // Mark this as a partial verification with fallback chain
              return {
                chainId,
                status: VerificationStatus.PARTIAL,
                isValid: fallbackVerification.isValid,
                timestamp: new Date(),
                transactionId: fallbackVerification.transactionId,
                signature: fallbackVerification.signature,
                error: `Used fallback chain ${fallbackChain} due to ${chainId} unavailability`,
                metadata: {
                  originalChain: chainId,
                  fallbackChain,
                  recoveryPath: context.recoveryPath,
                  verificationDuration: Date.now() - context.startTime,
                  fallbackVerificationId: fallbackVerification.transactionId
                }
              };
            } catch (fallbackError) {
              // Both original and fallback chains failed
              securityLogger.error(`Both original and fallback chains failed for verification`, {
                vaultId,
                originalChain: chainId,
                fallbackChain,
                originalError: error.message,
                fallbackError: fallbackError.message,
                totalAttempts: context.attempts,
                recoveryPath: context.recoveryPath
              });
              
              // Try another fallback if available
              const secondaryFallback = crossChainErrorHandler.getSecondaryFallbackChain(chainId, [fallbackChain]);
              
              if (secondaryFallback && !context.chains.has(secondaryFallback)) {
                securityLogger.info(`Trying secondary fallback chain ${secondaryFallback}`, {
                  vaultId,
                  originalChain: chainId,
                  secondaryFallback
                });
                
                // Record this secondary fallback chain
                context.chains.add(secondaryFallback);
                context.attempts++;
                
                try {
                  // Use the secondary fallback chain for verification
                  const secondaryVerification = await this.verifyOnChain(vaultId, secondaryFallback);
                  
                  return {
                    chainId,
                    status: VerificationStatus.PARTIAL,
                    isValid: secondaryVerification.isValid,
                    timestamp: new Date(),
                    transactionId: secondaryVerification.transactionId,
                    signature: secondaryVerification.signature,
                    error: `Used secondary fallback chain ${secondaryFallback} after primary fallback failure`,
                    metadata: {
                      originalChain: chainId,
                      fallbackChain,
                      secondaryFallback,
                      recoveryPath: [...context.recoveryPath, 'secondary_fallback'],
                      verificationDuration: Date.now() - context.startTime
                    }
                  };
                } catch (secondaryError) {
                  // All chains have failed, proceed to partial verification with emergency protocol
                  securityLogger.error(`All fallback chains failed, proceeding with emergency protocol`, {
                    vaultId,
                    originalChain: chainId,
                    triedChains: Array.from(context.chains)
                  });
                  
                  // Trigger emergency notification if configured
                  if (config.getFeatureFlag('enableEmergencyProtocol')) {
                    this.emit('emergency:multiple-chain-failure', {
                      vaultId,
                      chainsFailed: Array.from(context.chains),
                      timestamp: new Date()
                    });
                  }
                }
              }
            }
          }
        }
        
        // If all attempts failed, implement graceful degradation with partial verification
        // This uses any available data to provide a best-effort verification status
        let partialVerificationStatus: VerificationStatus;
        let partialMessage: string;
        
        // Determine verification status based on context and recovery attempts
        if (context.attempts > 5) {
          partialVerificationStatus = VerificationStatus.EMERGENCY;
          partialMessage = `Emergency verification status: all recovery mechanisms failed after ${context.attempts} attempts`;
        } else if (context.recoveryPath.includes('fallback')) {
          partialVerificationStatus = VerificationStatus.PARTIAL;
          partialMessage = `Partial verification after fallback chain attempts: ${crossChainError.message}`;
        } else {
          partialVerificationStatus = VerificationStatus.PARTIAL;
          partialMessage = `Chain verification failed after ${retryCount} recovery attempts: ${crossChainError.message}`;
        }
        
        // Implement partial verification with any data we can gather
        return {
          chainId,
          status: partialVerificationStatus,
          isValid: false, // We can't confirm validity without successful verification
          timestamp: new Date(),
          error: partialMessage,
          metadata: {
            recoveryAttempts: context.attempts,
            recoveryPath: context.recoveryPath,
            chainsAttempted: Array.from(context.chains),
            verificationDuration: Date.now() - context.startTime,
            errorCategory: crossChainError.category,
            errorType: crossChainError.type
          }
        };
      } else {
        // Not recoverable, return standard failed verification with enhanced metadata
        return {
          chainId,
          status: VerificationStatus.FAILED,
          isValid: false,
          timestamp: new Date(),
          error: crossChainError.message,
          metadata: {
            recoveryAttempted: false,
            errorCategory: crossChainError.category,
            errorType: crossChainError.type,
            verificationDuration: Date.now() - context.startTime,
            recoveryPath: context.recoveryPath
          }
        };
      }
    }
  }

  /**
   * Queue verification for later
   */
  public scheduleVerification(
    vaultId: string,
    primaryChain: BlockchainType,
    secondaryChains: BlockchainType[] = [],
    level: VerificationLevel = VerificationLevel.STANDARD,
    delayMs: number = 60000 // Default delay of 1 minute
  ): string {
    const verificationId = `scheduled_${vaultId}_${Date.now()}`;
    
    const timeoutId = setTimeout(() => {
      this.verifyVault(vaultId, primaryChain, secondaryChains, level)
        .then(result => {
          this.emit('scheduled:completed', { verificationId, result });
          this.verificationQueue.delete(verificationId);
        })
        .catch(error => {
          securityLogger.error(`Scheduled verification ${verificationId} failed`, {
            vaultId,
            verificationId,
            error
          });
          this.verificationQueue.delete(verificationId);
        });
    }, delayMs);
    
    this.verificationQueue.set(verificationId, timeoutId);
    
    securityLogger.info(`Scheduled verification ${verificationId} for vault ${vaultId}`, {
      vaultId,
      delayMs,
      primaryChain,
      secondaryChains
    });
    
    return verificationId;
  }
  
  /**
   * Cancel a scheduled verification
   */
  public cancelScheduledVerification(verificationId: string): boolean {
    const timeoutId = this.verificationQueue.get(verificationId);
    
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.verificationQueue.delete(verificationId);
      securityLogger.info(`Cancelled scheduled verification ${verificationId}`);
      return true;
    }
    
    return false;
  }
  
  /**
   * Check if a verification result is recent enough to use from cache
   */
  private isVerificationRecent(result: VerificationResult): boolean {
    const maxAgeMs = 5 * 60 * 1000; // 5 minutes
    return (Date.now() - result.timestamp.getTime()) < maxAgeMs;
  }
  
  /**
   * Get default secondary chains based on primary chain
   */
  private getDefaultSecondaryChains(primaryChain: BlockchainType): BlockchainType[] {
    // Remove the primary chain from available chains and return the others
    const availableChains = Object.keys(this.chainRoles) as BlockchainType[];
    return availableChains.filter(chain => chain !== primaryChain);
  }
  
  /**
   * Handle when a verification transaction is confirmed
   */
  private handleVerificationTransactionConfirmed(transaction: any): void {
    const { vaultId } = transaction.metadata;
    
    securityLogger.info(`Verification transaction confirmed for vault ${vaultId}`, {
      vaultId,
      transactionId: transaction.hash,
      chainId: transaction.chainId
    });
    
    this.emit('verification:transaction:confirmed', {
      vaultId,
      transactionId: transaction.hash,
      chainId: transaction.chainId
    });
  }
  
  /**
   * Handle when a verification transaction fails
   */
  private handleVerificationTransactionFailed(transaction: any): void {
    const { vaultId } = transaction.metadata;
    
    securityLogger.warn(`Verification transaction failed for vault ${vaultId}`, {
      vaultId,
      transactionId: transaction.hash,
      chainId: transaction.chainId,
      error: transaction.error
    });
    
    this.emit('verification:transaction:failed', {
      vaultId,
      transactionId: transaction.hash,
      chainId: transaction.chainId,
      error: transaction.error
    });
  }
  
  /**
   * Initiate cross-chain verification with specific protocol
   */
  public async initiateAdvancedVerification(
    vaultId: string,
    primaryChain: BlockchainType,
    verificationProtocol: 'zk' | 'quantum' | 'standard' = 'standard'
  ): Promise<VerificationResult> {
    securityLogger.info(`Initiating ${verificationProtocol} verification for vault ${vaultId}`, {
      vaultId,
      primaryChain,
      protocol: verificationProtocol
    });
    
    // Get default secondary chains
    const secondaryChains = this.getDefaultSecondaryChains(primaryChain);
    
    // Create initial verification result
    const verificationResult: VerificationResult = {
      isValid: false,
      status: VerificationStatus.IN_PROGRESS,
      level: VerificationLevel.ADVANCED,
      vaultId,
      primaryChain,
      secondaryVerifications: {},
      timestamp: new Date(),
      transactionIds: [],
      signatures: [],
      metadata: {
        protocol: verificationProtocol
      }
    };
    
    try {
      // Get connectors for each chain
      const primaryConnector = this.connectorFactory.getConnector(primaryChain);
      
      // For each protocol type, use the appropriate verification method
      let primaryResult;
      
      switch (verificationProtocol) {
        case 'zk':
          // Zero-knowledge verification
          primaryResult = await edgeCaseHandler.withRetry(
            async () => {
              // Use the zkVerify method of validator if available
              // For simulation, just return a success
              if (config.shouldSimulateBlockchain(primaryChain)) {
                return {
                  isValid: true,
                  transactionHash: `simulated_zk_${primaryChain}_${Date.now()}`,
                  signatures: [`zk_sig_${Date.now()}`],
                  zkProof: `zk_proof_${Date.now()}`,
                  privacyLevel: 'high'
                };
              }
              
              // This would call the blockchain-specific ZK verification
              // In real implementation, this would use zkVerify method
              return await primaryConnector.verifyVaultIntegrity(vaultId);
            },
            primaryChain,
            'validation',
            { vaultId, operation: 'zk_verification' }
          );
          break;
          
        case 'quantum':
          // Quantum-resistant verification
          primaryResult = await edgeCaseHandler.withRetry(
            async () => {
              // Use quantum-resistant verification if available
              // For simulation, just return a success
              if (config.shouldSimulateBlockchain(primaryChain)) {
                return {
                  isValid: true,
                  transactionHash: `simulated_quantum_${primaryChain}_${Date.now()}`,
                  signatures: [`quantum_sig_${Date.now()}`],
                  qrAlgorithm: 'FALCON',
                  securityLevel: 'quantum-resistant'
                };
              }
              
              // This would call the blockchain-specific quantum verification
              return await primaryConnector.verifyVaultIntegrity(vaultId);
            },
            primaryChain,
            'validation',
            { vaultId, operation: 'quantum_verification' }
          );
          break;
          
        case 'standard':
        default:
          // Standard verification
          primaryResult = await edgeCaseHandler.withRetry(
            async () => primaryConnector.verifyVaultIntegrity(vaultId),
            primaryChain,
            'validation',
            { vaultId, operation: 'standard_verification' }
          );
          break;
      }
      
      // Check primary verification result
      if (!primaryResult.isValid) {
        verificationResult.status = VerificationStatus.FAILED;
        return verificationResult;
      }
      
      // Add transaction ID and signature
      if (primaryResult.transactionHash) {
        verificationResult.transactionIds.push(primaryResult.transactionHash);
      }
      
      if (primaryResult.signatures?.[0]) {
        verificationResult.signatures.push(primaryResult.signatures[0]);
      }
      
      // In parallel, verify on secondary chains
      const secondaryVerificationPromises = secondaryChains.map(async (chain) => {
        try {
          const connector = this.connectorFactory.getConnector(chain);
          
          // For each protocol type, use the appropriate verification method
          let secondaryResult;
          
          switch (verificationProtocol) {
            case 'zk':
              // Zero-knowledge verification
              secondaryResult = await edgeCaseHandler.withRetry(
                async () => {
                  if (config.shouldSimulateBlockchain(chain)) {
                    return {
                      isValid: true,
                      transactionHash: `simulated_zk_${chain}_${Date.now()}`,
                      signatures: [`zk_sig_${chain}_${Date.now()}`],
                      zkProof: `zk_proof_${chain}_${Date.now()}`,
                      privacyLevel: 'high'
                    };
                  }
                  
                  // This would call the blockchain-specific ZK verification
                  return await connector.verifyVaultIntegrity(vaultId);
                },
                chain,
                'validation',
                { vaultId, operation: 'zk_verification' }
              );
              break;
              
            case 'quantum':
              // Quantum-resistant verification
              secondaryResult = await edgeCaseHandler.withRetry(
                async () => {
                  if (config.shouldSimulateBlockchain(chain)) {
                    return {
                      isValid: true,
                      transactionHash: `simulated_quantum_${chain}_${Date.now()}`,
                      signatures: [`quantum_sig_${chain}_${Date.now()}`],
                      qrAlgorithm: 'FALCON',
                      securityLevel: 'quantum-resistant'
                    };
                  }
                  
                  // This would call the blockchain-specific quantum verification
                  return await connector.verifyVaultIntegrity(vaultId);
                },
                chain,
                'validation',
                { vaultId, operation: 'quantum_verification' }
              );
              break;
              
            case 'standard':
            default:
              // Standard verification
              secondaryResult = await edgeCaseHandler.withRetry(
                async () => connector.verifyVaultIntegrity(vaultId),
                chain,
                'validation',
                { vaultId, operation: 'standard_verification' }
              );
              break;
          }
          
          return {
            chain,
            result: {
              chainId: chain,
              status: VerificationStatus.COMPLETED,
              isValid: secondaryResult.isValid,
              timestamp: new Date(),
              transactionId: secondaryResult.transactionHash,
              signature: secondaryResult.signatures?.[0]
            }
          };
        } catch (error) {
          return {
            chain,
            result: {
              chainId: chain,
              status: VerificationStatus.FAILED,
              isValid: false,
              timestamp: new Date(),
              error: error instanceof Error ? error.message : String(error)
            }
          };
        }
      });
      
      // Wait for all secondary verifications to complete
      const secondaryResults = await Promise.all(secondaryVerificationPromises);
      
      // Process secondary results
      let validSecondaryCount = 0;
      
      for (const { chain, result } of secondaryResults) {
        verificationResult.secondaryVerifications[chain] = result;
        
        if (result.isValid) {
          validSecondaryCount++;
          
          // Add transaction ID and signature if available
          if (result.transactionId) {
            verificationResult.transactionIds.push(result.transactionId);
          }
          
          if (result.signature) {
            verificationResult.signatures.push(result.signature);
          }
        }
      }
      
      // Determine final verification status
      if (validSecondaryCount >= 2) {
        // Advanced level requires at least two valid secondary verifications
        verificationResult.isValid = true;
        verificationResult.status = VerificationStatus.COMPLETED;
      } else if (validSecondaryCount > 0) {
        // Some secondary verifications passed, but not enough
        verificationResult.isValid = false;
        verificationResult.status = VerificationStatus.PARTIAL;
      } else {
        // No secondary verifications passed
        verificationResult.isValid = false;
        verificationResult.status = VerificationStatus.FAILED;
      }
      
      // Emit verification completed event
      this.emit('verification:completed', verificationResult);
      
      return verificationResult;
    } catch (error) {
      // Handle unexpected errors
      securityLogger.error(`Advanced verification failed for vault ${vaultId}`, {
        vaultId,
        protocol: verificationProtocol,
        error
      });
      
      // Return a failed verification
      verificationResult.status = VerificationStatus.FAILED;
      verificationResult.metadata = {
        ...verificationResult.metadata,
        error: error instanceof Error ? error.message : String(error)
      };
      
      return verificationResult;
    }
  }
}

// Export as a factory function to ensure proper initialization
export function createCrossChainVaultVerification(connectorFactory: ConnectorFactory): CrossChainVaultVerification {
  return CrossChainVaultVerification.getInstance(connectorFactory);
}