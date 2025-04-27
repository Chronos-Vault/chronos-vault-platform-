/**
 * Liquidity Optimizer Service
 * 
 * This service identifies the most efficient routes for cross-chain transfers
 * by analyzing liquidity pools, gas costs, and exchange rates across different
 * protocols and chains.
 */

import { BlockchainType, TransferPriority } from './interfaces';
import { NETWORK_CONFIG } from './bridge';

/**
 * Liquidity pool information
 */
export interface LiquidityPool {
  id: string;
  protocol: string;
  blockchain: BlockchainType;
  token1: string;
  token2: string;
  totalLiquidity: number;
  fee: number; // In percentage (e.g., 0.3 for 0.3%)
  volume24h: number;
  apr: number;
}

/**
 * Exchange rate info
 */
export interface ExchangeRate {
  fromToken: string;
  toToken: string;
  rate: number;
  lastUpdated: number;
}

/**
 * Route option for transfers
 */
export interface RouteOption {
  id: string;
  name: string;
  description: string;
  path: Array<{
    from: {
      blockchain: BlockchainType;
      token: string;
    };
    to: {
      blockchain: BlockchainType;
      token: string;
    };
    protocol: string;
    estimatedFee: number;
    estimatedGas: number;
    estimatedTime: number; // In seconds
  }>;
  totalFee: number;
  totalGas: number;
  totalTime: number;
  priority: TransferPriority;
  securityScore: number; // 0-100
  recommendedFor: TransferPriority;
}

/**
 * Mock liquidity pools data for development
 */
const mockLiquidityPools: Record<string, LiquidityPool> = {
  'sushiswap-eth-cvt': {
    id: 'sushiswap-eth-cvt',
    protocol: 'SushiSwap',
    blockchain: 'ETH',
    token1: 'ETH',
    token2: 'CVT',
    totalLiquidity: 2500000,
    fee: 0.3,
    volume24h: 450000,
    apr: 6.4
  },
  'uniswap-eth-usdc': {
    id: 'uniswap-eth-usdc',
    protocol: 'Uniswap',
    blockchain: 'ETH',
    token1: 'ETH',
    token2: 'USDC',
    totalLiquidity: 8500000,
    fee: 0.3,
    volume24h: 1200000,
    apr: 4.2
  },
  'polygon-matic-cvt': {
    id: 'polygon-matic-cvt',
    protocol: 'QuickSwap',
    blockchain: 'MATIC',
    token1: 'MATIC',
    token2: 'CVT',
    totalLiquidity: 850000,
    fee: 0.25,
    volume24h: 125000,
    apr: 7.8
  },
  'tonswap-ton-cvt': {
    id: 'tonswap-ton-cvt',
    protocol: 'TONSwap',
    blockchain: 'TON',
    token1: 'TON',
    token2: 'CVT',
    totalLiquidity: 1200000,
    fee: 0.2,
    volume24h: 180000,
    apr: 8.5
  },
  'orca-sol-cvt': {
    id: 'orca-sol-cvt',
    protocol: 'Orca',
    blockchain: 'SOL',
    token1: 'SOL',
    token2: 'CVT',
    totalLiquidity: 1800000,
    fee: 0.25,
    volume24h: 320000,
    apr: 5.6
  },
  'pancake-bnb-cvt': {
    id: 'pancake-bnb-cvt',
    protocol: 'PancakeSwap',
    blockchain: 'BNB',
    token1: 'BNB',
    token2: 'CVT',
    totalLiquidity: 2000000,
    fee: 0.2,
    volume24h: 380000,
    apr: 6.1
  }
};

/**
 * Liquidity Optimizer Service
 */
class LiquidityOptimizerService {
  /**
   * Find the best routes for a cross-chain transfer
   */
  async findOptimalRoutes(
    sourceChain: BlockchainType,
    targetChain: BlockchainType,
    sourceToken: string,
    targetToken: string,
    amount: number,
    priority: TransferPriority = 'speed'
  ): Promise<RouteOption[]> {
    // In a real implementation, this would analyze liquidity pools and network states
    // For now, we'll generate mock routes based on the parameters
    
    // Direct route (always available)
    const directRoute: RouteOption = {
      id: `direct-${sourceChain}-${targetChain}`,
      name: 'Direct Bridge',
      description: 'Direct transfer via Chronos Bridge',
      path: [
        {
          from: { blockchain: sourceChain, token: sourceToken },
          to: { blockchain: targetChain, token: targetToken },
          protocol: 'Chronos Bridge',
          estimatedFee: amount * 0.005, // 0.5%
          estimatedGas: this.calculateGasCost(sourceChain, targetChain),
          estimatedTime: this.calculateTransferTime(sourceChain, targetChain, 'direct')
        }
      ],
      totalFee: amount * 0.005,
      totalGas: this.calculateGasCost(sourceChain, targetChain),
      totalTime: this.calculateTransferTime(sourceChain, targetChain, 'direct'),
      priority: 'speed',
      securityScore: 85,
      recommendedFor: 'speed'
    };
    
    // Generate routes based on priority
    const routes: RouteOption[] = [directRoute];
    
    // Cost-optimized indirect route via Polygon
    if (sourceChain !== 'MATIC' && targetChain !== 'MATIC') {
      const polygonRoute: RouteOption = {
        id: `polygon-indirect-${sourceChain}-${targetChain}`,
        name: 'Polygon Route',
        description: 'Cost-efficient route via Polygon',
        path: [
          {
            from: { blockchain: sourceChain, token: sourceToken },
            to: { blockchain: 'MATIC', token: 'CVT' },
            protocol: 'Chronos Bridge',
            estimatedFee: amount * 0.003, // 0.3%
            estimatedGas: this.calculateGasCost(sourceChain, 'MATIC'),
            estimatedTime: this.calculateTransferTime(sourceChain, 'MATIC', 'direct')
          },
          {
            from: { blockchain: 'MATIC', token: 'CVT' },
            to: { blockchain: targetChain, token: targetToken },
            protocol: 'Chronos Bridge',
            estimatedFee: amount * 0.003, // 0.3%
            estimatedGas: this.calculateGasCost('MATIC', targetChain),
            estimatedTime: this.calculateTransferTime('MATIC', targetChain, 'direct')
          }
        ],
        totalFee: amount * 0.006, // 0.6%
        totalGas: this.calculateGasCost(sourceChain, 'MATIC') + this.calculateGasCost('MATIC', targetChain),
        totalTime: this.calculateTransferTime(sourceChain, 'MATIC', 'direct') + this.calculateTransferTime('MATIC', targetChain, 'direct'),
        priority: 'cost',
        securityScore: 75,
        recommendedFor: 'cost'
      };
      
      // Only add if it's actually more cost-efficient
      if (polygonRoute.totalFee + polygonRoute.totalGas < directRoute.totalFee + directRoute.totalGas) {
        routes.push(polygonRoute);
      }
    }
    
    // Security-optimized route via multiple validators
    const secureRoute: RouteOption = {
      id: `secure-${sourceChain}-${targetChain}`,
      name: 'Secure Multi-Validation',
      description: 'Highly secure route with multi-chain validation',
      path: [
        {
          from: { blockchain: sourceChain, token: sourceToken },
          to: { blockchain: 'ETH', token: 'CVT' },
          protocol: 'Secure Bridge',
          estimatedFee: amount * 0.004, // 0.4%
          estimatedGas: this.calculateGasCost(sourceChain, 'ETH') * 1.2,
          estimatedTime: this.calculateTransferTime(sourceChain, 'ETH', 'secure')
        },
        {
          from: { blockchain: 'ETH', token: 'CVT' },
          to: { blockchain: targetChain, token: targetToken },
          protocol: 'Secure Bridge',
          estimatedFee: amount * 0.004, // 0.4%
          estimatedGas: this.calculateGasCost('ETH', targetChain) * 1.2,
          estimatedTime: this.calculateTransferTime('ETH', targetChain, 'secure')
        }
      ],
      totalFee: amount * 0.008, // 0.8%
      totalGas: (this.calculateGasCost(sourceChain, 'ETH') + this.calculateGasCost('ETH', targetChain)) * 1.2,
      totalTime: this.calculateTransferTime(sourceChain, 'ETH', 'secure') + this.calculateTransferTime('ETH', targetChain, 'secure'),
      priority: 'security',
      securityScore: 95,
      recommendedFor: 'security'
    };
    
    routes.push(secureRoute);
    
    // Sort routes based on the requested priority
    return this.sortRoutesByPriority(routes, priority);
  }
  
  /**
   * Get liquidity pools for a token
   */
  async getLiquidityPools(
    blockchain: BlockchainType,
    token: string
  ): Promise<LiquidityPool[]> {
    // Filter pools by blockchain and token
    return Object.values(mockLiquidityPools).filter(pool => 
      pool.blockchain === blockchain && (pool.token1 === token || pool.token2 === token)
    );
  }
  
  /**
   * Get exchange rate between tokens
   */
  async getExchangeRate(
    fromToken: string,
    toToken: string
  ): Promise<ExchangeRate> {
    // In a real implementation, this would fetch rates from oracles or exchanges
    // For now, return mock rates
    const rate = fromToken === toToken 
      ? 1 
      : this.getMockExchangeRate(fromToken, toToken);
    
    return {
      fromToken,
      toToken,
      rate,
      lastUpdated: Date.now()
    };
  }
  
  /**
   * Calculate estimated gas cost
   */
  private calculateGasCost(
    sourceChain: BlockchainType,
    targetChain: BlockchainType
  ): number {
    // Different chains have different gas costs
    const chainGasCosts: Record<BlockchainType, number> = {
      'ETH': 0.005,
      'TON': 0.001,
      'SOL': 0.0005,
      'MATIC': 0.0002,
      'BNB': 0.0004
    };
    
    // Calculate cost based on source and target chains
    return chainGasCosts[sourceChain] + chainGasCosts[targetChain] / 2;
  }
  
  /**
   * Calculate estimated transfer time
   */
  private calculateTransferTime(
    sourceChain: BlockchainType,
    targetChain: BlockchainType,
    routeType: 'direct' | 'secure'
  ): number {
    // Base times based on block times
    const sourceBlockTime = NETWORK_CONFIG[sourceChain].blockTime;
    const targetBlockTime = NETWORK_CONFIG[targetChain].blockTime;
    
    // Direct transfers need confirmation on both chains
    const sourceConfirmations = 15; // 15 blocks
    const targetConfirmations = 15; // 15 blocks
    
    // Calculate time based on route type
    if (routeType === 'direct') {
      return (sourceBlockTime * sourceConfirmations) + (targetBlockTime * targetConfirmations) + 60; // Add 1 minute for processing
    } else {
      // Secure routes require more confirmations
      return (sourceBlockTime * sourceConfirmations * 1.5) + (targetBlockTime * targetConfirmations * 1.5) + 120; // Add 2 minutes for processing
    }
  }
  
  /**
   * Sort routes based on priority
   */
  private sortRoutesByPriority(
    routes: RouteOption[],
    priority: TransferPriority
  ): RouteOption[] {
    switch (priority) {
      case 'speed':
        return routes.sort((a, b) => a.totalTime - b.totalTime);
      case 'cost':
        return routes.sort((a, b) => (a.totalFee + a.totalGas) - (b.totalFee + b.totalGas));
      case 'security':
        return routes.sort((a, b) => b.securityScore - a.securityScore);
      default:
        return routes;
    }
  }
  
  /**
   * Get mock exchange rate between tokens
   */
  private getMockExchangeRate(fromToken: string, toToken: string): number {
    // Mock exchange rates based on token pairs
    const rates: Record<string, number> = {
      'ETH:CVT': 350,
      'CVT:ETH': 1/350,
      'TON:CVT': 85,
      'CVT:TON': 1/85,
      'SOL:CVT': 70,
      'CVT:SOL': 1/70,
      'MATIC:CVT': 2.5,
      'CVT:MATIC': 1/2.5,
      'BNB:CVT': 120,
      'CVT:BNB': 1/120,
      'USDC:CVT': 1.5,
      'CVT:USDC': 1/1.5,
      'USDT:CVT': 1.51,
      'CVT:USDT': 1/1.51
    };
    
    const key = `${fromToken}:${toToken}`;
    return rates[key] || 1;
  }
}

// Export singleton instance
export const liquidityOptimizer = new LiquidityOptimizerService();