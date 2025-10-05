import { chainFeeService } from '../blockchain/chain-fee-service';
import { dynamicTrinityProtocol, TrinityRoles } from '../security/dynamic-trinity-protocol';

interface VaultCreationRequest {
  primaryChain: 'ethereum' | 'solana' | 'ton';
  vaultType: string;
  assetAmount: string;
  assetType: string;
  securityLevel?: number;
}

interface VaultCreationPlan {
  primaryChain: 'ethereum' | 'solana' | 'ton';
  trinityRoles: TrinityRoles;
  feeEstimates: {
    ethereum: string;
    solana: string;
    ton: string;
  };
  selectedFee: string;
  savings: {
    vsEthereum: string;
    percentSaved: number;
  };
  deploymentPriority: string[];
  securityConfig: {
    level: number;
    requiresVerification: {
      ethereum: boolean;
      solana: boolean;
      ton: boolean;
    };
  };
  metadata: any;
}

export class VaultChainService {
  
  async createVaultPlan(request: VaultCreationRequest): Promise<VaultCreationPlan> {
    const operationType = 'vault_creation';
    const securityLevel = request.securityLevel || 3;

    const feeComparison = await chainFeeService.compareAllChains(operationType);
    
    const trinityConfig = dynamicTrinityProtocol.assignRoles(request.primaryChain);
    
    const deploymentInfo = dynamicTrinityProtocol.getContractDeploymentPriority(trinityConfig.roles);
    
    const feeData = {
      ethereum: parseFloat(feeComparison.ethereum.estimatedFeeUsd),
      solana: parseFloat(feeComparison.solana.estimatedFeeUsd),
      ton: parseFloat(feeComparison.ton.estimatedFeeUsd)
    };
    
    const savings = dynamicTrinityProtocol.calculateFeeSavings(request.primaryChain, feeData);
    
    const verificationRequirements = dynamicTrinityProtocol.requiresVerification(
      request.primaryChain,
      securityLevel
    );

    const trinityMetadata = dynamicTrinityProtocol.generateTrinityMetadata(
      request.primaryChain,
      {
        ethereum: feeComparison.ethereum.estimatedFeeUsd,
        solana: feeComparison.solana.estimatedFeeUsd,
        ton: feeComparison.ton.estimatedFeeUsd
      }
    );

    return {
      primaryChain: request.primaryChain,
      trinityRoles: trinityConfig.roles,
      feeEstimates: {
        ethereum: feeComparison.ethereum.estimatedFeeUsd,
        solana: feeComparison.solana.estimatedFeeUsd,
        ton: feeComparison.ton.estimatedFeeUsd
      },
      selectedFee: savings.selectedFee.toFixed(2),
      savings: {
        vsEthereum: savings.vsEthereum.toFixed(2),
        percentSaved: savings.percentSaved
      },
      deploymentPriority: deploymentInfo.priority,
      securityConfig: {
        level: securityLevel,
        requiresVerification: verificationRequirements
      },
      metadata: {
        trinityDescription: trinityConfig.description,
        chainInfo: trinityMetadata.chainInfo,
        securityModel: trinityMetadata.securityModel,
        primaryResponsibilities: trinityConfig.primaryResponsibilities,
        verifierResponsibilities: trinityConfig.verifierResponsibilities
      }
    };
  }

  async validateChainSelection(
    primaryChain: 'ethereum' | 'solana' | 'ton',
    userBalance?: number
  ): Promise<{
    valid: boolean;
    warnings: string[];
    recommendations: string[];
  }> {
    const warnings: string[] = [];
    const recommendations: string[] = [];
    
    const feeComparison = await chainFeeService.compareAllChains('vault_creation');
    const selectedFeeUsd = parseFloat(feeComparison[primaryChain].estimatedFeeUsd);

    if (primaryChain === 'ethereum' && selectedFeeUsd > 20) {
      warnings.push('Ethereum gas fees are currently high');
      recommendations.push('Consider using Solana or TON for significant fee savings');
    }

    if (userBalance && userBalance < selectedFeeUsd * 2) {
      warnings.push('Low balance for selected chain');
      recommendations.push('Ensure you have sufficient funds to cover fees');
    }

    const congestion = feeComparison[primaryChain].networkCongestion;
    if (congestion === 'high') {
      warnings.push(`${primaryChain.toUpperCase()} network is experiencing high congestion`);
      recommendations.push('Transaction may take longer than usual');
    }

    return {
      valid: true,
      warnings,
      recommendations
    };
  }

  async getRecommendedChain(
    userPreferences?: {
      preferSpeed?: boolean;
      preferCost?: boolean;
      preferSecurity?: boolean;
    }
  ): Promise<{
    recommended: 'ethereum' | 'solana' | 'ton';
    reason: string;
    alternatives: Array<{ chain: string; reason: string }>;
  }> {
    const feeComparison = await chainFeeService.compareAllChains('vault_creation');
    
    if (userPreferences?.preferSpeed) {
      return {
        recommended: 'solana',
        reason: 'Fastest transaction finality (~1 second)',
        alternatives: [
          { chain: 'ton', reason: 'Good speed with low fees (~5 seconds)' },
          { chain: 'ethereum', reason: 'Most established, slower (~15-60 seconds)' }
        ]
      };
    }

    if (userPreferences?.preferCost) {
      const cheapest = feeComparison.recommendation;
      return {
        recommended: cheapest,
        reason: `Lowest fees: $${feeComparison[cheapest].estimatedFeeUsd}`,
        alternatives: [
          { chain: 'solana', reason: 'Ultra-low fees' },
          { chain: 'ton', reason: 'Very affordable' }
        ]
      };
    }

    return {
      recommended: feeComparison.recommendation,
      reason: `Best balance of cost, speed, and security`,
      alternatives: [
        { chain: 'ethereum', reason: 'Maximum ecosystem maturity' },
        { chain: 'solana', reason: 'Optimal speed and cost' }
      ]
    };
  }

  formatChainInfo(chain: 'ethereum' | 'solana' | 'ton'): {
    name: string;
    symbol: string;
    avgBlockTime: string;
    ecosystem: string;
    maturity: string;
  } {
    const chainData = {
      ethereum: {
        name: 'Ethereum',
        symbol: 'ETH',
        avgBlockTime: '12-15 seconds',
        ecosystem: 'Largest DeFi ecosystem',
        maturity: 'Most battle-tested'
      },
      solana: {
        name: 'Solana',
        symbol: 'SOL',
        avgBlockTime: '400ms',
        ecosystem: 'Fast-growing DeFi',
        maturity: 'Proven high-performance'
      },
      ton: {
        name: 'TON',
        symbol: 'TON',
        avgBlockTime: '5 seconds',
        ecosystem: 'Telegram integration',
        maturity: 'Strong mobile focus'
      }
    };

    return chainData[chain];
  }
}

export const vaultChainService = new VaultChainService();
