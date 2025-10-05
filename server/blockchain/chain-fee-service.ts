import { db } from '../db';
import { chainFeeEstimates } from '../../shared/schema';
import type { InsertChainFeeEstimate } from '../../shared/schema';

interface ChainFeeData {
  blockchain: 'ethereum' | 'solana' | 'ton';
  operationType: string;
  estimatedFeeNative: string;
  estimatedFeeUsd: string;
  gasPrice?: string;
  networkCongestion: 'low' | 'medium' | 'high';
  estimatedTime: number;
  metadata?: Record<string, any>;
}

interface ChainComparison {
  ethereum: ChainFeeData;
  solana: ChainFeeData;
  ton: ChainFeeData;
  recommendation: 'ethereum' | 'solana' | 'ton';
  savings: {
    vsEthereum: string;
    percentSaved: number;
  };
}

export class ChainFeeService {
  private cachedPrices: Map<string, { price: number; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 60000;

  async getEthereumFee(operationType: string = 'vault_creation'): Promise<ChainFeeData> {
    try {
      const gasPrice = await this.getEthereumGasPrice();
      const gasLimit = this.getGasLimitForOperation(operationType);
      const ethPrice = await this.getTokenPrice('ethereum');
      
      const feeInWei = gasPrice * gasLimit;
      const feeInEth = feeInWei / 1e18;
      const feeInUsd = feeInEth * ethPrice;

      const congestion = this.determineEthereumCongestion(gasPrice);
      
      return {
        blockchain: 'ethereum',
        operationType,
        estimatedFeeNative: feeInEth.toFixed(6),
        estimatedFeeUsd: feeInUsd.toFixed(2),
        gasPrice: (gasPrice / 1e9).toFixed(2),
        networkCongestion: congestion,
        estimatedTime: this.getEstimatedTime('ethereum', congestion),
        metadata: {
          gasLimit,
          gasPriceGwei: (gasPrice / 1e9).toFixed(2),
          ethPriceUsd: ethPrice
        }
      };
    } catch (error) {
      console.error('Error getting Ethereum fee:', error);
      return this.getDefaultEthereumFee(operationType);
    }
  }

  async getSolanaFee(operationType: string = 'vault_creation'): Promise<ChainFeeData> {
    try {
      const baseFee = 0.000005;
      const operationMultiplier = this.getSolanaOperationMultiplier(operationType);
      const feeInSol = baseFee * operationMultiplier;
      
      const solPrice = await this.getTokenPrice('solana');
      const feeInUsd = feeInSol * solPrice;

      return {
        blockchain: 'solana',
        operationType,
        estimatedFeeNative: feeInSol.toFixed(6),
        estimatedFeeUsd: feeInUsd.toFixed(4),
        networkCongestion: 'low',
        estimatedTime: this.getEstimatedTime('solana', 'low'),
        metadata: {
          baseFee,
          operationMultiplier,
          solPriceUsd: solPrice
        }
      };
    } catch (error) {
      console.error('Error getting Solana fee:', error);
      return this.getDefaultSolanaFee(operationType);
    }
  }

  async getTonFee(operationType: string = 'vault_creation'): Promise<ChainFeeData> {
    try {
      const baseFee = 0.01;
      const operationMultiplier = this.getTonOperationMultiplier(operationType);
      const feeInTon = baseFee * operationMultiplier;
      
      const tonPrice = await this.getTokenPrice('ton');
      const feeInUsd = feeInTon * tonPrice;

      return {
        blockchain: 'ton',
        operationType,
        estimatedFeeNative: feeInTon.toFixed(6),
        estimatedFeeUsd: feeInUsd.toFixed(4),
        networkCongestion: 'low',
        estimatedTime: this.getEstimatedTime('ton', 'low'),
        metadata: {
          baseFee,
          operationMultiplier,
          tonPriceUsd: tonPrice
        }
      };
    } catch (error) {
      console.error('Error getting TON fee:', error);
      return this.getDefaultTonFee(operationType);
    }
  }

  async compareAllChains(operationType: string = 'vault_creation'): Promise<ChainComparison> {
    const [ethereum, solana, ton] = await Promise.all([
      this.getEthereumFee(operationType),
      this.getSolanaFee(operationType),
      this.getTonFee(operationType)
    ]);

    const ethFeeUsd = parseFloat(ethereum.estimatedFeeUsd);
    const solFeeUsd = parseFloat(solana.estimatedFeeUsd);
    const tonFeeUsd = parseFloat(ton.estimatedFeeUsd);

    const minFee = Math.min(ethFeeUsd, solFeeUsd, tonFeeUsd);
    let recommendation: 'ethereum' | 'solana' | 'ton' = 'ethereum';
    
    if (minFee === solFeeUsd) recommendation = 'solana';
    else if (minFee === tonFeeUsd) recommendation = 'ton';

    const savings = {
      vsEthereum: (ethFeeUsd - minFee).toFixed(2),
      percentSaved: parseFloat(((ethFeeUsd - minFee) / ethFeeUsd * 100).toFixed(1))
    };

    return {
      ethereum,
      solana,
      ton,
      recommendation,
      savings
    };
  }

  async saveChainFeeEstimate(feeData: ChainFeeData): Promise<void> {
    try {
      const insertData: InsertChainFeeEstimate = {
        blockchain: feeData.blockchain,
        operationType: feeData.operationType,
        estimatedFeeNative: feeData.estimatedFeeNative,
        estimatedFeeUsd: feeData.estimatedFeeUsd,
        gasPrice: feeData.gasPrice,
        networkCongestion: feeData.networkCongestion,
        estimatedTime: feeData.estimatedTime,
        metadata: feeData.metadata || {}
      };

      await db.insert(chainFeeEstimates).values(insertData);
    } catch (error) {
      console.error('Error saving chain fee estimate:', error);
    }
  }

  private async getEthereumGasPrice(): Promise<number> {
    const gasPrice = 50 * 1e9;
    return gasPrice;
  }

  private async getTokenPrice(token: 'ethereum' | 'solana' | 'ton'): Promise<number> {
    const cacheKey = `price_${token}`;
    const cached = this.cachedPrices.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.price;
    }

    const prices = {
      ethereum: 3800,
      solana: 180,
      ton: 5.5
    };

    const price = prices[token];
    this.cachedPrices.set(cacheKey, { price, timestamp: Date.now() });
    
    return price;
  }

  private getGasLimitForOperation(operationType: string): number {
    const limits: Record<string, number> = {
      vault_creation: 500000,
      withdrawal: 150000,
      transfer: 100000,
      swap: 200000
    };
    
    return limits[operationType] || 200000;
  }

  private getSolanaOperationMultiplier(operationType: string): number {
    const multipliers: Record<string, number> = {
      vault_creation: 50,
      withdrawal: 10,
      transfer: 5,
      swap: 20
    };
    
    return multipliers[operationType] || 10;
  }

  private getTonOperationMultiplier(operationType: string): number {
    const multipliers: Record<string, number> = {
      vault_creation: 3,
      withdrawal: 1,
      transfer: 0.5,
      swap: 2
    };
    
    return multipliers[operationType] || 1;
  }

  private determineEthereumCongestion(gasPrice: number): 'low' | 'medium' | 'high' {
    const gasPriceGwei = gasPrice / 1e9;
    
    if (gasPriceGwei < 30) return 'low';
    if (gasPriceGwei < 80) return 'medium';
    return 'high';
  }

  private getEstimatedTime(blockchain: string, congestion: string): number {
    const times: Record<string, Record<string, number>> = {
      ethereum: { low: 15, medium: 30, high: 60 },
      solana: { low: 1, medium: 2, high: 5 },
      ton: { low: 5, medium: 10, high: 15 }
    };
    
    return times[blockchain]?.[congestion] || 30;
  }

  private getDefaultEthereumFee(operationType: string): ChainFeeData {
    return {
      blockchain: 'ethereum',
      operationType,
      estimatedFeeNative: '0.0095',
      estimatedFeeUsd: '36.10',
      gasPrice: '50',
      networkCongestion: 'medium',
      estimatedTime: 30,
      metadata: { isDefault: true }
    };
  }

  private getDefaultSolanaFee(operationType: string): ChainFeeData {
    return {
      blockchain: 'solana',
      operationType,
      estimatedFeeNative: '0.00025',
      estimatedFeeUsd: '0.045',
      networkCongestion: 'low',
      estimatedTime: 1,
      metadata: { isDefault: true }
    };
  }

  private getDefaultTonFee(operationType: string): ChainFeeData {
    return {
      blockchain: 'ton',
      operationType,
      estimatedFeeNative: '0.03',
      estimatedFeeUsd: '0.165',
      networkCongestion: 'low',
      estimatedTime: 5,
      metadata: { isDefault: true }
    };
  }
}

export const chainFeeService = new ChainFeeService();
