/**
 * Vault Verification API Routes
 * 
 * These routes handle cross-chain vault verification operations using our
 * Triple-Chain Security architecture.
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { securityLogger } from '../monitoring/security-logger';
import { createCrossChainVaultVerification, VerificationLevel } from '../blockchain/cross-chain-vault-verification';
import { ConnectorFactory } from '../blockchain/connector-factory';
import { crossChainErrorHandler, CrossChainErrorCategory } from '../security/cross-chain-error-handler';
import { BlockchainType } from '../../shared/types';
import config from '../config';

// Create a router for vault verification routes
const vaultVerificationRouter = Router();

// Input validation schemas
const verifyVaultSchema = z.object({
  vaultId: z.string().min(1, 'Vault ID is required'),
  primaryChain: z.enum(['ethereum', 'solana', 'ton', 'bitcoin'] as const),
  secondaryChains: z.array(z.enum(['ethereum', 'solana', 'ton', 'bitcoin'] as const)).optional(),
  level: z.enum(['basic', 'standard', 'advanced'] as const).optional().default('standard'),
  protocol: z.enum(['standard', 'zk', 'quantum'] as const).optional().default('standard')
});

const scheduleVerificationSchema = z.object({
  vaultId: z.string().min(1, 'Vault ID is required'),
  primaryChain: z.enum(['ethereum', 'solana', 'ton', 'bitcoin'] as const),
  secondaryChains: z.array(z.enum(['ethereum', 'solana', 'ton', 'bitcoin'] as const)).optional(),
  level: z.enum(['basic', 'standard', 'advanced'] as const).optional().default('standard'),
  delayMs: z.number().min(1000).max(3600000).optional().default(60000) // Between 1 second and 1 hour
});

const cancelVerificationSchema = z.object({
  verificationId: z.string().min(1, 'Verification ID is required')
});

// Get access to the connector factory
// Note: This would be initialized in your app entry point and passed here
let connectorFactory: ConnectorFactory;
let crossChainVerification: ReturnType<typeof createCrossChainVaultVerification>;

// Initialize the verification service
export function initializeVaultVerification(factory: ConnectorFactory) {
  connectorFactory = factory;
  crossChainVerification = createCrossChainVaultVerification(connectorFactory);
  
  securityLogger.info('Vault verification routes initialized');
  return crossChainVerification;
}

/**
 * Handles errors with appropriate response format
 */
function handleApiError(res: Response, error: any, context: string) {
  // Use the cross-chain error handler to categorize and process the error
  const processedError = crossChainErrorHandler.handle(error, {
    category: CrossChainErrorCategory.VERIFICATION_FAILURE,
    operation: context
  });
  
  // Determine HTTP status code based on error category
  let statusCode = 500;
  
  switch (processedError.category) {
    case CrossChainErrorCategory.VALIDATION_FAILURE:
      statusCode = 400; // Bad request
      break;
    case CrossChainErrorCategory.UNAUTHORIZED_ACCESS:
      statusCode = 403; // Forbidden
      break;
    case CrossChainErrorCategory.RATE_LIMIT_EXCEEDED:
      statusCode = 429; // Too many requests
      break;
    case CrossChainErrorCategory.ASSET_MISMATCH:
      statusCode = 409; // Conflict
      break;
    case CrossChainErrorCategory.CONNECTION_FAILURE:
      statusCode = 503; // Service unavailable
      break;
    default:
      statusCode = 500; // Internal server error
  }
  
  // Log the error
  securityLogger.error(`Vault verification API error: ${processedError.message}`, {
    errorCategory: processedError.category,
    errorMessage: processedError.message,
    statusCode,
    operation: context
  });
  
  // Return error response
  return res.status(statusCode).json({
    success: false,
    error: processedError.message,
    category: processedError.category,
    recoverable: processedError.recoverable,
    solution: processedError.solution
  });
}

/**
 * Route: Verify a vault across multiple blockchains
 */
vaultVerificationRouter.post('/verify', async (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = verifyVaultSchema.parse(req.body);
    
    // Extract parameters
    const { vaultId, primaryChain, level = 'standard', protocol = 'standard' } = validatedData;
    const secondaryChains = validatedData.secondaryChains || [];
    
    securityLogger.info(`Received vault verification request for vault ${vaultId}`, {
      vaultId,
      primaryChain,
      secondaryChains,
      level,
      protocol
    });
    
    // Type conversions for enum
    const verificationLevel = level === 'basic' 
      ? VerificationLevel.BASIC 
      : level === 'advanced' 
        ? VerificationLevel.ADVANCED 
        : VerificationLevel.STANDARD;
    
    // If using advanced protocol, use the special verification method
    let verificationResult;
    
    if (protocol !== 'standard' && level === 'advanced') {
      verificationResult = await crossChainVerification.initiateAdvancedVerification(
        vaultId,
        primaryChain as BlockchainType,
        protocol
      );
    } else {
      // Standard verification process
      verificationResult = await crossChainVerification.verifyVault(
        vaultId,
        primaryChain as BlockchainType,
        secondaryChains as BlockchainType[],
        verificationLevel
      );
    }
    
    // Return the verification result
    return res.status(200).json({
      success: true,
      result: verificationResult
    });
  } catch (error) {
    return handleApiError(res, error, 'verify_vault');
  }
});

/**
 * Route: Schedule a vault verification for later
 */
vaultVerificationRouter.post('/schedule', async (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = scheduleVerificationSchema.parse(req.body);
    
    // Extract parameters
    const { vaultId, primaryChain, delayMs = 60000, level = 'standard' } = validatedData;
    const secondaryChains = validatedData.secondaryChains || [];
    
    securityLogger.info(`Scheduling vault verification for vault ${vaultId}`, {
      vaultId,
      primaryChain,
      secondaryChains,
      level,
      delayMs
    });
    
    // Type conversions for enum
    const verificationLevel = level === 'basic' 
      ? VerificationLevel.BASIC 
      : level === 'advanced' 
        ? VerificationLevel.ADVANCED 
        : VerificationLevel.STANDARD;
    
    // Schedule the verification
    const verificationId = crossChainVerification.scheduleVerification(
      vaultId,
      primaryChain as BlockchainType,
      secondaryChains as BlockchainType[],
      verificationLevel,
      delayMs
    );
    
    // Return the verification ID for reference
    return res.status(200).json({
      success: true,
      verificationId,
      scheduledAt: new Date(),
      executionEstimate: new Date(Date.now() + delayMs)
    });
  } catch (error) {
    return handleApiError(res, error, 'schedule_verification');
  }
});

/**
 * Route: Cancel a scheduled verification
 */
vaultVerificationRouter.post('/cancel', async (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = cancelVerificationSchema.parse(req.body);
    
    // Extract parameters
    const { verificationId } = validatedData;
    
    securityLogger.info(`Cancelling scheduled verification ${verificationId}`);
    
    // Cancel the verification
    const cancelled = crossChainVerification.cancelScheduledVerification(verificationId);
    
    if (cancelled) {
      return res.status(200).json({
        success: true,
        message: `Verification ${verificationId} cancelled successfully`
      });
    } else {
      return res.status(404).json({
        success: false,
        message: `Verification ${verificationId} not found or already completed`
      });
    }
  } catch (error) {
    return handleApiError(res, error, 'cancel_verification');
  }
});

/**
 * Route: Get verification chains info
 */
vaultVerificationRouter.get('/chains', (req: Request, res: Response) => {
  try {
    // Return information about chain roles in verification
    const chainRoles = config.crossChainVerification.chainRoles;
    
    return res.status(200).json({
      success: true,
      chains: chainRoles
    });
  } catch (error) {
    return handleApiError(res, error, 'get_chain_info');
  }
});

/**
 * Route: Get verification levels info
 */
vaultVerificationRouter.get('/levels', (req: Request, res: Response) => {
  try {
    // Return information about verification levels
    const levels = config.crossChainVerification.levels;
    
    return res.status(200).json({
      success: true,
      levels
    });
  } catch (error) {
    return handleApiError(res, error, 'get_level_info');
  }
});

export default vaultVerificationRouter;