/**
 * CVT Staking Service
 * 
 * This module provides functionality for managing CVT token staking,
 * including tracking staked amounts, calculating rewards, and applying
 * fee discounts based on staking tiers.
 */

import { securityLogger } from '../monitoring/security-logger';
import config from '../config';
import { storage } from '../storage';

// Define staking tiers and benefits
export enum StakingTier {
  NONE = 'none',
  VAULT_GUARDIAN = 'vault_guardian',    // 1,000+ CVT
  VAULT_ARCHITECT = 'vault_architect',  // 10,000+ CVT
  VAULT_SOVEREIGN = 'vault_sovereign',  // 100,000+ CVT
}

export interface StakingInfo {
  userId: number;
  amount: number;
  tier: StakingTier;
  since: Date;
  rewards: number;
  lastRewardCalculation: Date;
}

class CVTStakingService {
  /**
   * Get staked amount for a user
   */
  async getStakedAmount(userId: number): Promise<number> {
    try {
      // For development mode, return a simulated staking amount
      if (config.isDevelopmentMode) {
        // Generate a consistent amount based on user ID for testing tiers
        const hash = this.simpleHash(userId.toString());
        const modulo = hash % 4; // 0, 1, 2, or 3
        
        switch (modulo) {
          case 0: return 0; // No staking
          case 1: return 5000; // Vault Guardian tier (1,000+ CVT)
          case 2: return 25000; // Vault Architect tier (10,000+ CVT)
          case 3: return 150000; // Vault Sovereign tier (100,000+ CVT)
        }
      }
      
      // In a real implementation, this would fetch from the database
      const user = await storage.getUser(userId);
      
      if (!user) {
        return 0;
      }
      
      let userMetadata: any = {};
      
      try {
        if (user.metadata) {
          userMetadata = JSON.parse(user.metadata);
        }
      } catch (error) {
        securityLogger.warn('Failed to parse user metadata', error);
        return 0;
      }
      
      return userMetadata.stakedCVT || 0;
    } catch (error) {
      securityLogger.error('Failed to get staked amount', error);
      return 0;
    }
  }

  /**
   * Get staking tier for a user
   */
  async getStakingTier(userId: number): Promise<StakingTier> {
    const stakedAmount = await this.getStakedAmount(userId);
    
    if (stakedAmount >= 100000) {
      return StakingTier.VAULT_SOVEREIGN;
    } else if (stakedAmount >= 10000) {
      return StakingTier.VAULT_ARCHITECT;
    } else if (stakedAmount >= 1000) {
      return StakingTier.VAULT_GUARDIAN;
    } else {
      return StakingTier.NONE;
    }
  }

  /**
   * Calculate fee discount percentage based on staking amount
   */
  calculateFeeDiscount(stakingAmount: number): number {
    if (stakingAmount >= 100000) {
      // Vault Sovereign - 100% fee reduction
      return 1.0;
    } else if (stakingAmount >= 10000) {
      // Vault Architect - 90% fee reduction
      return 0.9;
    } else if (stakingAmount >= 1000) {
      // Vault Guardian - 75% fee reduction
      return 0.75;
    } else {
      // No discount
      return 0;
    }
  }

  /**
   * Apply discount to an amount based on staking tier
   */
  async applyStakingDiscount(userId: number, amount: number): Promise<number> {
    const stakedAmount = await this.getStakedAmount(userId);
    const discount = this.calculateFeeDiscount(stakedAmount);
    
    return amount * (1 - discount);
  }
  
  /**
   * Generate a simple hash for testing purposes
   * @private
   */
  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }
}

export const cvtStakingService = new CVTStakingService();

/**
 * Helper function for getting staked CVT amount
 */
export async function getStakedCVTAmount(userId: number): Promise<number> {
  return await cvtStakingService.getStakedAmount(userId);
}