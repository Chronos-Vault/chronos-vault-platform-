import { Router } from 'express';
import { chainFeeService } from '../blockchain/chain-fee-service';

const router = Router();

router.get('/fees/compare', async (req, res) => {
  try {
    const operationType = (req.query.operationType as string) || 'vault_creation';
    
    const comparison = await chainFeeService.compareAllChains(operationType);
    
    await Promise.all([
      chainFeeService.saveChainFeeEstimate(comparison.ethereum),
      chainFeeService.saveChainFeeEstimate(comparison.solana),
      chainFeeService.saveChainFeeEstimate(comparison.ton)
    ]);

    res.json({
      success: true,
      data: comparison,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Error comparing chain fees:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to compare chain fees',
      message: error.message
    });
  }
});

router.get('/fees/:blockchain', async (req, res) => {
  try {
    const blockchain = req.params.blockchain as 'ethereum' | 'solana' | 'ton';
    const operationType = (req.query.operationType as string) || 'vault_creation';
    
    if (!['ethereum', 'solana', 'ton'].includes(blockchain)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid blockchain',
        validOptions: ['ethereum', 'solana', 'ton']
      });
    }

    let feeData;
    switch (blockchain) {
      case 'ethereum':
        feeData = await chainFeeService.getEthereumFee(operationType);
        break;
      case 'solana':
        feeData = await chainFeeService.getSolanaFee(operationType);
        break;
      case 'ton':
        feeData = await chainFeeService.getTonFee(operationType);
        break;
    }

    await chainFeeService.saveChainFeeEstimate(feeData);

    res.json({
      success: true,
      data: feeData,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error(`Error getting ${req.params.blockchain} fee:`, error);
    res.status(500).json({
      success: false,
      error: `Failed to get ${req.params.blockchain} fee`,
      message: error.message
    });
  }
});

router.get('/fees/recommendation/:operationType', async (req, res) => {
  try {
    const operationType = req.params.operationType || 'vault_creation';
    
    const comparison = await chainFeeService.compareAllChains(operationType);
    
    res.json({
      success: true,
      data: {
        recommended: comparison.recommendation,
        reason: `Lowest fee: $${comparison[comparison.recommendation].estimatedFeeUsd}`,
        savingsVsEthereum: comparison.savings,
        allOptions: {
          ethereum: {
            fee: comparison.ethereum.estimatedFeeUsd,
            time: comparison.ethereum.estimatedTime,
            congestion: comparison.ethereum.networkCongestion
          },
          solana: {
            fee: comparison.solana.estimatedFeeUsd,
            time: comparison.solana.estimatedTime,
            congestion: comparison.solana.networkCongestion
          },
          ton: {
            fee: comparison.ton.estimatedFeeUsd,
            time: comparison.ton.estimatedTime,
            congestion: comparison.ton.networkCongestion
          }
        }
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Error getting chain recommendation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get chain recommendation',
      message: error.message
    });
  }
});

export default router;
