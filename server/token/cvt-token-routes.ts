/**
 * CVT Token API Routes
 * 
 * This module defines the API routes for interacting with the CVT token,
 * including token data, staking, rewards, and tokenomics.
 */

import { Router, Request, Response } from 'express';
import { CVTTokenService } from './cvt-token-service';
import { ConnectorFactory } from '../blockchain/connector-factory';
import config from '../config';
import { securityLogger } from '../monitoring/security-logger';

/**
 * Create and configure the token routes
 * 
 * @param connectorFactory The blockchain connector factory
 * @returns Router with configured token routes
 */
export function createTokenRoutes(connectorFactory: ConnectorFactory): Router {
  const router = Router();
  const tokenService = new CVTTokenService(connectorFactory);
  
  /**
   * GET /api/token/data/:chain
   * Get token data for a specific blockchain
   */
  router.get('/data/:chain', async (req: Request, res: Response) => {
    try {
      const { chain } = req.params;
      
      // Validate chain parameter
      if (!['ethereum', 'solana', 'ton'].includes(chain)) {
        return res.status(400).json({
          success: false,
          error: `Unsupported chain: ${chain}. Supported chains are ethereum, solana, and ton.`
        });
      }
      
      // Get token data
      const tokenData = await tokenService.getTokenData(chain);
      
      return res.status(200).json({
        success: true,
        data: tokenData
      });
    } catch (error) {
      securityLogger.error('Failed to get token data', {
        error,
        path: req.path
      });
      
      return res.status(500).json({
        success: false,
        error: 'Failed to get token data'
      });
    }
  });
  
  /**
   * GET /api/token/balance/:chain/:address
   * Get token balance for an address on a specific blockchain
   */
  router.get('/balance/:chain/:address', async (req: Request, res: Response) => {
    try {
      const { chain, address } = req.params;
      
      // Validate chain parameter
      if (!['ethereum', 'solana', 'ton'].includes(chain)) {
        return res.status(400).json({
          success: false,
          error: `Unsupported chain: ${chain}. Supported chains are ethereum, solana, and ton.`
        });
      }
      
      // Validate address parameter based on chain
      const connector = connectorFactory.getConnector(chain);
      if (!connector.validateAddress(address)) {
        return res.status(400).json({
          success: false,
          error: `Invalid ${chain} address format`
        });
      }
      
      // Get token balance
      const balance = await tokenService.getTokenBalance(address, chain);
      
      return res.status(200).json({
        success: true,
        data: {
          address,
          chain,
          balance,
          formatted: balance.toString()
        }
      });
    } catch (error) {
      securityLogger.error('Failed to get token balance', {
        error,
        path: req.path
      });
      
      return res.status(500).json({
        success: false,
        error: 'Failed to get token balance'
      });
    }
  });
  
  /**
   * GET /api/token/staking/:chain/:address
   * Get staking information for an address on a specific blockchain
   */
  router.get('/staking/:chain/:address', async (req: Request, res: Response) => {
    try {
      const { chain, address } = req.params;
      
      // Validate chain parameter
      if (!['ethereum', 'solana', 'ton'].includes(chain)) {
        return res.status(400).json({
          success: false,
          error: `Unsupported chain: ${chain}. Supported chains are ethereum, solana, and ton.`
        });
      }
      
      // Validate address parameter based on chain
      const connector = connectorFactory.getConnector(chain);
      if (!connector.validateAddress(address)) {
        return res.status(400).json({
          success: false,
          error: `Invalid ${chain} address format`
        });
      }
      
      // Get staking info
      const stakingInfo = await tokenService.getStakingInfo(address, chain);
      
      // Calculate estimated APY based on tier
      let estimatedApy = 0;
      switch (stakingInfo.tier) {
        case 'VAULT_SOVEREIGN':
          estimatedApy = 15.0; // 15% APY
          break;
        case 'VAULT_ARCHITECT':
          estimatedApy = 12.5; // 12.5% APY
          break;
        case 'VAULT_GUARDIAN':
          estimatedApy = 10.0; // 10% APY
          break;
        default:
          estimatedApy = 0;
      }
      
      // Add APY to response
      const responseData = {
        ...stakingInfo,
        estimatedApy
      };
      
      return res.status(200).json({
        success: true,
        data: responseData
      });
    } catch (error) {
      securityLogger.error('Failed to get staking info', {
        error,
        path: req.path
      });
      
      return res.status(500).json({
        success: false,
        error: 'Failed to get staking information'
      });
    }
  });
  
  /**
   * POST /api/token/stake
   * Stake CVT tokens
   */
  router.post('/stake', async (req: Request, res: Response) => {
    try {
      const { address, amount, lockPeriod, chain } = req.body;
      
      // Validate required parameters
      if (!address || !amount || !lockPeriod || !chain) {
        return res.status(400).json({
          success: false,
          error: 'Missing required parameters: address, amount, lockPeriod, and chain are required'
        });
      }
      
      // Validate chain parameter
      if (!['ethereum', 'solana', 'ton'].includes(chain)) {
        return res.status(400).json({
          success: false,
          error: `Unsupported chain: ${chain}. Supported chains are ethereum, solana, and ton.`
        });
      }
      
      // Validate lock period (must be at least 1 month, at most 48 months)
      if (lockPeriod < 1 || lockPeriod > 48) {
        return res.status(400).json({
          success: false,
          error: 'Lock period must be between 1 and 48 months'
        });
      }
      
      // Validate amount (must be positive)
      if (amount <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Amount must be greater than 0'
        });
      }
      
      // Validate address parameter based on chain
      const connector = connectorFactory.getConnector(chain);
      if (!connector.validateAddress(address)) {
        return res.status(400).json({
          success: false,
          error: `Invalid ${chain} address format`
        });
      }
      
      // Stake tokens
      const result = await tokenService.stakeTokens(address, amount, lockPeriod, chain);
      
      return res.status(result.success ? 200 : 400).json({
        success: result.success,
        ...result
      });
    } catch (error) {
      securityLogger.error('Failed to stake tokens', {
        error,
        path: req.path
      });
      
      return res.status(500).json({
        success: false,
        error: 'Failed to stake tokens'
      });
    }
  });
  
  /**
   * POST /api/token/unstake
   * Unstake CVT tokens
   */
  router.post('/unstake', async (req: Request, res: Response) => {
    try {
      const { address, amount, chain } = req.body;
      
      // Validate required parameters
      if (!address || !amount || !chain) {
        return res.status(400).json({
          success: false,
          error: 'Missing required parameters: address, amount, and chain are required'
        });
      }
      
      // Validate chain parameter
      if (!['ethereum', 'solana', 'ton'].includes(chain)) {
        return res.status(400).json({
          success: false,
          error: `Unsupported chain: ${chain}. Supported chains are ethereum, solana, and ton.`
        });
      }
      
      // Validate amount (must be positive)
      if (amount <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Amount must be greater than 0'
        });
      }
      
      // Validate address parameter based on chain
      const connector = connectorFactory.getConnector(chain);
      if (!connector.validateAddress(address)) {
        return res.status(400).json({
          success: false,
          error: `Invalid ${chain} address format`
        });
      }
      
      // Unstake tokens
      const result = await tokenService.unstakeTokens(address, amount, chain);
      
      return res.status(result.success ? 200 : 400).json({
        success: result.success,
        ...result
      });
    } catch (error) {
      securityLogger.error('Failed to unstake tokens', {
        error,
        path: req.path
      });
      
      return res.status(500).json({
        success: false,
        error: 'Failed to unstake tokens'
      });
    }
  });
  
  /**
   * POST /api/token/claim-rewards
   * Claim staking rewards
   */
  router.post('/claim-rewards', async (req: Request, res: Response) => {
    try {
      const { address, chain } = req.body;
      
      // Validate required parameters
      if (!address || !chain) {
        return res.status(400).json({
          success: false,
          error: 'Missing required parameters: address and chain are required'
        });
      }
      
      // Validate chain parameter
      if (!['ethereum', 'solana', 'ton'].includes(chain)) {
        return res.status(400).json({
          success: false,
          error: `Unsupported chain: ${chain}. Supported chains are ethereum, solana, and ton.`
        });
      }
      
      // Validate address parameter based on chain
      const connector = connectorFactory.getConnector(chain);
      if (!connector.validateAddress(address)) {
        return res.status(400).json({
          success: false,
          error: `Invalid ${chain} address format`
        });
      }
      
      // Claim rewards
      const result = await tokenService.claimRewards(address, chain);
      
      return res.status(result.success ? 200 : 400).json({
        success: result.success,
        ...result
      });
    } catch (error) {
      securityLogger.error('Failed to claim rewards', {
        error,
        path: req.path
      });
      
      return res.status(500).json({
        success: false,
        error: 'Failed to claim rewards'
      });
    }
  });
  
  /**
   * GET /api/token/fee-discount/:chain/:address
   * Get fee discount for an address
   */
  router.get('/fee-discount/:chain/:address', async (req: Request, res: Response) => {
    try {
      const { chain, address } = req.params;
      
      // Validate chain parameter
      if (!['ethereum', 'solana', 'ton'].includes(chain)) {
        return res.status(400).json({
          success: false,
          error: `Unsupported chain: ${chain}. Supported chains are ethereum, solana, and ton.`
        });
      }
      
      // Validate address parameter based on chain
      const connector = connectorFactory.getConnector(chain);
      if (!connector.validateAddress(address)) {
        return res.status(400).json({
          success: false,
          error: `Invalid ${chain} address format`
        });
      }
      
      // Get fee discount
      const discount = await tokenService.getFeeDiscount(address, chain);
      
      // Get staking info for detailed response
      const stakingInfo = await tokenService.getStakingInfo(address, chain);
      
      return res.status(200).json({
        success: true,
        data: {
          address,
          chain,
          discount,
          discountPercentage: discount * 100,
          tier: stakingInfo.tier,
          amountStaked: stakingInfo.amountStaked
        }
      });
    } catch (error) {
      securityLogger.error('Failed to get fee discount', {
        error,
        path: req.path
      });
      
      return res.status(500).json({
        success: false,
        error: 'Failed to get fee discount'
      });
    }
  });
  
  /**
   * POST /api/token/calculate-fee
   * Calculate vault fee with discount
   */
  router.post('/calculate-fee', async (req: Request, res: Response) => {
    try {
      const {
        baseFeeDollars,
        securityLevel,
        lockTimeMonths,
        valueInVault,
        address,
        chain
      } = req.body;
      
      // Validate required parameters
      if (
        baseFeeDollars === undefined ||
        !securityLevel ||
        !lockTimeMonths ||
        valueInVault === undefined ||
        !address ||
        !chain
      ) {
        return res.status(400).json({
          success: false,
          error: 'Missing required parameters'
        });
      }
      
      // Validate chain parameter
      if (!['ethereum', 'solana', 'ton'].includes(chain)) {
        return res.status(400).json({
          success: false,
          error: `Unsupported chain: ${chain}. Supported chains are ethereum, solana, and ton.`
        });
      }
      
      // Validate security level
      if (![1, 2, 3].includes(securityLevel)) {
        return res.status(400).json({
          success: false,
          error: 'Security level must be 1, 2, or 3'
        });
      }
      
      // Calculate fee
      const fee = await tokenService.calculateVaultFee(
        baseFeeDollars,
        securityLevel,
        lockTimeMonths,
        valueInVault,
        address,
        chain
      );
      
      // Get discount for the response
      const discount = await tokenService.getFeeDiscount(address, chain);
      
      return res.status(200).json({
        success: true,
        data: {
          baseFeeDollars,
          securityLevel,
          lockTimeMonths,
          valueInVault,
          appliedDiscount: discount,
          appliedDiscountPercentage: discount * 100,
          finalFee: fee
        }
      });
    } catch (error) {
      securityLogger.error('Failed to calculate fee', {
        error,
        path: req.path
      });
      
      return res.status(500).json({
        success: false,
        error: 'Failed to calculate fee'
      });
    }
  });
  
  /**
   * GET /api/token/tokenomics
   * Get CVT tokenomics information
   */
  router.get('/tokenomics', (_req: Request, res: Response) => {
    try {
      // Return tokenomics data
      const tokenomics = {
        totalSupply: 21000000,
        initialDistribution: 5250000, // 25%
        teamAllocation: 2100000, // 10%
        treasuryAllocation: 4200000, // 20%
        reserveAllocation: 2100000, // 10%
        stakingRewardsPool: 7350000, // 35%
        vestingPeriods: {
          team: {
            months: 24,
            cliff: 6
          },
          advisors: {
            months: 18,
            cliff: 3
          }
        },
        stakingTiers: {
          vaultGuardian: {
            minimumTokens: 1000,
            feeDiscount: 75, // 75%
            apy: 10
          },
          vaultArchitect: {
            minimumTokens: 10000,
            feeDiscount: 90, // 90%
            apy: 12.5
          },
          vaultSovereign: {
            minimumTokens: 100000,
            feeDiscount: 100, // 100%
            apy: 15
          }
        },
        buybackSchedule: {
          frequency: 'quarterly',
          percentage: '5% of platform fees'
        }
      };
      
      return res.status(200).json({
        success: true,
        data: tokenomics
      });
    } catch (error) {
      securityLogger.error('Failed to get tokenomics data', {
        error
      });
      
      return res.status(500).json({
        success: false,
        error: 'Failed to get tokenomics data'
      });
    }
  });
  
  /**
   * POST /api/token/buyback-burn
   * Trigger a buyback and burn operation (admin only)
   */
  router.post('/buyback-burn', async (req: Request, res: Response) => {
    try {
      const { amount, chain } = req.body;
      
      // Validate required parameters
      if (!amount || !chain) {
        return res.status(400).json({
          success: false,
          error: 'Missing required parameters: amount and chain are required'
        });
      }
      
      // Validate chain parameter
      if (!['ethereum', 'solana', 'ton'].includes(chain)) {
        return res.status(400).json({
          success: false,
          error: `Unsupported chain: ${chain}. Supported chains are ethereum, solana, and ton.`
        });
      }
      
      // Validate amount (must be positive)
      if (amount <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Amount must be greater than 0'
        });
      }
      
      // In production, check authorization
      if (!config.isDevelopmentMode) {
        // Add authorization check here
        const isAuthorized = false; // This would be replaced with actual auth check
        
        if (!isAuthorized) {
          return res.status(403).json({
            success: false,
            error: 'Unauthorized to perform buyback and burn operations'
          });
        }
      }
      
      // Execute buyback and burn
      const result = await tokenService.executeBuybackAndBurn(amount, chain);
      
      return res.status(result.success ? 200 : 400).json({
        success: result.success,
        ...result
      });
    } catch (error) {
      securityLogger.error('Failed to execute buyback and burn', {
        error,
        path: req.path
      });
      
      return res.status(500).json({
        success: false,
        error: 'Failed to execute buyback and burn'
      });
    }
  });
  
  /**
   * GET /api/token/distribution-events
   * Get token distribution events
   */
  router.get('/distribution-events', (req: Request, res: Response) => {
    try {
      const eventTypes = req.query.types ? (req.query.types as string).split(',') : undefined;
      const chain = req.query.chain as string | undefined;
      
      // Get distribution events
      const events = tokenService.getDistributionEvents(eventTypes, chain);
      
      return res.status(200).json({
        success: true,
        data: events
      });
    } catch (error) {
      securityLogger.error('Failed to get distribution events', {
        error,
        path: req.path
      });
      
      return res.status(500).json({
        success: false,
        error: 'Failed to get distribution events'
      });
    }
  });
  
  return router;
}