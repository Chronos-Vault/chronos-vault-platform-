/**
 * DeFi API Routes
 * 
 * RESTful API endpoints for cross-chain swaps, staking, and yield farming
 */

import { Router, Request, Response } from 'express';
import { atomicSwapService } from '../defi/atomic-swap-service';
import { stakingYieldService } from '../defi/staking-yield-service';

const router = Router();

/**
 * Get optimal swap routes
 */
router.post('/swap/routes', async (req: Request, res: Response) => {
  try {
    const { fromToken, toToken, amount, fromNetwork, toNetwork } = req.body;

    if (!fromToken || !toToken || !amount || !fromNetwork || !toNetwork) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields: fromToken, toToken, amount, fromNetwork, toNetwork'
      });
    }

    const routes = await atomicSwapService.findOptimalRoute(
      fromToken,
      toToken,
      amount,
      fromNetwork,
      toNetwork
    );

    res.json({
      status: 'success',
      data: routes
    });
  } catch (error) {
    console.error('Error finding swap routes:', error);
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to find swap routes'
    });
  }
});

/**
 * Get swap price quote
 */
router.get('/swap/price', async (req: Request, res: Response) => {
  try {
    const { fromToken, toToken, amount, fromNetwork, toNetwork } = req.query;

    if (!fromToken || !toToken || !amount || !fromNetwork || !toNetwork) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required query parameters'
      });
    }

    const priceData = await atomicSwapService.getSwapPrice(
      fromToken as string,
      toToken as string,
      amount as string,
      fromNetwork as any,
      toNetwork as any
    );

    res.json({
      status: 'success',
      data: priceData
    });
  } catch (error) {
    console.error('Error getting swap price:', error);
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to get swap price'
    });
  }
});

/**
 * Create atomic swap order
 */
router.post('/swap/create', async (req: Request, res: Response) => {
  try {
    const {
      userAddress,
      fromToken,
      toToken,
      fromAmount,
      minAmount,
      fromNetwork,
      toNetwork
    } = req.body;

    if (!userAddress || !fromToken || !toToken || !fromAmount || !minAmount || !fromNetwork || !toNetwork) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields'
      });
    }

    const order = await atomicSwapService.createAtomicSwap(
      userAddress,
      fromToken,
      toToken,
      fromAmount,
      minAmount,
      fromNetwork,
      toNetwork
    );

    res.json({
      status: 'success',
      data: order
    });
  } catch (error) {
    console.error('Error creating atomic swap:', error);
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to create atomic swap'
    });
  }
});

/**
 * Execute atomic swap
 */
router.post('/swap/:orderId/execute', async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const txHash = await atomicSwapService.executeAtomicSwap(orderId);

    res.json({
      status: 'success',
      data: {
        orderId,
        txHash
      }
    });
  } catch (error) {
    console.error('Error executing atomic swap:', error);
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to execute atomic swap'
    });
  }
});

/**
 * Lock swap funds
 */
router.post('/swap/:orderId/lock', async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { secret } = req.body;

    if (!secret) {
      return res.status(400).json({
        status: 'error',
        message: 'Secret is required'
      });
    }

    const lockTxHash = await atomicSwapService.lockSwapFunds(orderId, secret);

    res.json({
      status: 'success',
      data: {
        orderId,
        lockTxHash
      }
    });
  } catch (error) {
    console.error('Error locking swap funds:', error);
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to lock swap funds'
    });
  }
});

/**
 * Get user swap orders
 */
router.get('/swap/orders/:userAddress', async (req: Request, res: Response) => {
  try {
    const { userAddress } = req.params;
    const orders = atomicSwapService.getUserSwapOrders(userAddress);

    res.json({
      status: 'success',
      data: orders
    });
  } catch (error) {
    console.error('Error fetching user swap orders:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch swap orders'
    });
  }
});

/**
 * Get swap order status
 */
router.get('/swap/order/:orderId', async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const order = atomicSwapService.getSwapOrderStatus(orderId);

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Swap order not found'
      });
    }

    res.json({
      status: 'success',
      data: order
    });
  } catch (error) {
    console.error('Error fetching swap order status:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch swap order status'
    });
  }
});

/**
 * Staking Pools
 */
router.get('/staking/pools', async (req: Request, res: Response) => {
  try {
    const { network } = req.query;
    const pools = stakingYieldService.getStakingPools(network as any);

    res.json({
      status: 'success',
      data: pools
    });
  } catch (error) {
    console.error('Error fetching staking pools:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch staking pools'
    });
  }
});

/**
 * Stake tokens
 */
router.post('/staking/stake', async (req: Request, res: Response) => {
  try {
    const { poolId, userAddress, amount } = req.body;

    if (!poolId || !userAddress || !amount) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields: poolId, userAddress, amount'
      });
    }

    const position = await stakingYieldService.stakeTokens(poolId, userAddress, amount);

    res.json({
      status: 'success',
      data: position
    });
  } catch (error) {
    console.error('Error staking tokens:', error);
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to stake tokens'
    });
  }
});

/**
 * Unstake tokens
 */
router.post('/staking/unstake', async (req: Request, res: Response) => {
  try {
    const { positionId, userAddress } = req.body;

    if (!positionId || !userAddress) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields: positionId, userAddress'
      });
    }

    const txHash = await stakingYieldService.unstakeTokens(positionId, userAddress);

    res.json({
      status: 'success',
      data: { txHash }
    });
  } catch (error) {
    console.error('Error unstaking tokens:', error);
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to unstake tokens'
    });
  }
});

/**
 * Claim staking rewards
 */
router.post('/staking/claim', async (req: Request, res: Response) => {
  try {
    const { positionId, userAddress } = req.body;

    if (!positionId || !userAddress) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields: positionId, userAddress'
      });
    }

    const txHash = await stakingYieldService.claimStakingRewards(positionId, userAddress);

    res.json({
      status: 'success',
      data: { txHash }
    });
  } catch (error) {
    console.error('Error claiming rewards:', error);
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to claim rewards'
    });
  }
});

/**
 * Yield Farming Pools
 */
router.get('/farming/pools', async (req: Request, res: Response) => {
  try {
    const { network } = req.query;
    const pools = stakingYieldService.getYieldFarms(network as any);

    res.json({
      status: 'success',
      data: pools
    });
  } catch (error) {
    console.error('Error fetching yield farms:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch yield farms'
    });
  }
});

/**
 * Add liquidity to farm
 */
router.post('/farming/add-liquidity', async (req: Request, res: Response) => {
  try {
    const { farmId, userAddress, token0Amount, token1Amount } = req.body;

    if (!farmId || !userAddress || !token0Amount || !token1Amount) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields: farmId, userAddress, token0Amount, token1Amount'
      });
    }

    const position = await stakingYieldService.addLiquidity(
      farmId,
      userAddress,
      token0Amount,
      token1Amount
    );

    res.json({
      status: 'success',
      data: position
    });
  } catch (error) {
    console.error('Error adding liquidity:', error);
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to add liquidity'
    });
  }
});

/**
 * Remove liquidity from farm
 */
router.post('/farming/remove-liquidity', async (req: Request, res: Response) => {
  try {
    const { positionId, userAddress } = req.body;

    if (!positionId || !userAddress) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields: positionId, userAddress'
      });
    }

    const txHash = await stakingYieldService.removeLiquidity(positionId, userAddress);

    res.json({
      status: 'success',
      data: { txHash }
    });
  } catch (error) {
    console.error('Error removing liquidity:', error);
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to remove liquidity'
    });
  }
});

/**
 * Harvest farming rewards
 */
router.post('/farming/harvest', async (req: Request, res: Response) => {
  try {
    const { positionId, userAddress } = req.body;

    if (!positionId || !userAddress) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields: positionId, userAddress'
      });
    }

    const txHash = await stakingYieldService.harvestRewards(positionId, userAddress);

    res.json({
      status: 'success',
      data: { txHash }
    });
  } catch (error) {
    console.error('Error harvesting rewards:', error);
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to harvest rewards'
    });
  }
});

/**
 * Get user DeFi portfolio
 */
router.get('/portfolio/:userAddress', async (req: Request, res: Response) => {
  try {
    const { userAddress } = req.params;
    
    const stakePositions = stakingYieldService.getUserStakePositions(userAddress);
    const farmPositions = stakingYieldService.getUserFarmPositions(userAddress);
    const portfolioValue = stakingYieldService.getUserPortfolioValue(userAddress);

    res.json({
      status: 'success',
      data: {
        stakePositions,
        farmPositions,
        portfolioValue
      }
    });
  } catch (error) {
    console.error('Error fetching user portfolio:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch user portfolio'
    });
  }
});

export { router as defiRoutes };