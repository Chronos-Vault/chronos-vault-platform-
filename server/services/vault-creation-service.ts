/**
 * Vault Creation Service
 * 
 * Handles creation of all vault types with Trinity Protocol verification
 * and smart contract integration.
 * 
 * Supported Vault Types:
 * - timelock: Time-Lock Vault (simple time-based release)
 * - multisig: Multi-Signature Vault (m-of-n approvals)
 * - crosschain_fragment: Cross-Chain Fragment Vault (assets split across chains)
 */

import { ethers } from 'ethers';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { vaults, crossChainTransactions } from '@shared/schema';
import { trinityProtocol } from '../security/trinity-protocol';
import { OperationType } from '../security/trinity-protocol';
import { ethereumClient } from '../blockchain/ethereum-client';
import { SolanaProgramClient } from '../blockchain/solana-program-client';
import { tonClient } from '../blockchain/ton-client';
import { securityLogger, SecurityEventType } from '../monitoring/security-logger';
import { crossChainVaultRegistration } from './cross-chain-vault-registration';
import config from '../config';

export interface CreateVaultRequest {
  userId: number;
  walletAddress: string;
  vaultType: 'timelock' | 'multisig' | 'crosschain_fragment';
  name: string;
  description?: string;
  assetType: string; // ETH, SOL, TON, USDC, etc.
  assetAmount: string;
  // FIXED ARCHITECTURE: Arbitrum L2 PRIMARY, Solana MONITOR, TON BACKUP
  securityLevel: 1 | 2 | 3 | 4 | 5;
  
  // Time-lock specific
  timeLockDays?: number;
  
  // Multi-sig specific
  signaturesRequired?: number;
  signerAddresses?: string[];
  
  // Cross-chain fragment specific
  fragmentDistribution?: {
    ethereum?: number; // percentage
    solana?: number;
    ton?: number;
  };
  fragmentRecoveryThreshold?: number;
}

export interface VaultCreationResult {
  success: boolean;
  vaultId?: number;
  vaultData?: any;
  ethereumTxHash?: string;
  solanaTxHash?: string;
  tonTxHash?: string;
  trinityVerificationHash?: string;
  error?: string;
}

export class VaultCreationService {
  private solanaProgramClient: SolanaProgramClient;

  constructor() {
    this.solanaProgramClient = new SolanaProgramClient(
      config.blockchainConfig.solana.rpcUrl
    );
  }

  /**
   * Main vault creation method
   * FIXED ARCHITECTURE: Arbitrum L2 PRIMARY, Solana MONITOR, TON BACKUP
   */
  async createVault(request: CreateVaultRequest): Promise<VaultCreationResult> {
    securityLogger.info(`🏗️ Creating ${request.vaultType} vault with Trinity Protocol (Arbitrum L2 primary)`, SecurityEventType.VAULT_CREATION);
    
    try {
      // Validate request
      this.validateRequest(request);
      
      // Create vault in database first (using fixed Arbitrum-primary architecture)
      const vaultData = await this.createVaultInDatabase(request);
      
      // Deploy to primary chain based on vault type
      let deploymentResult: any;
      
      switch (request.vaultType) {
        case 'timelock':
          deploymentResult = await this.createTimeLockVault(vaultData, request);
          break;
        case 'multisig':
          deploymentResult = await this.createMultiSigVault(vaultData, request);
          break;
        case 'crosschain_fragment':
          deploymentResult = await this.createCrossChainFragmentVault(vaultData, request);
          break;
        default:
          throw new Error(`Unsupported vault type: ${request.vaultType}`);
      }
      
      // Update vault with deployment data
      await db.update(vaults)
        .set({
          ethereumTxHash: deploymentResult.ethereumTxHash,
          solanaTxHash: deploymentResult.solanaTxHash,
          tonTxHash: deploymentResult.tonTxHash,
          ethereumContractAddress: deploymentResult.ethereumContractAddress,
          solanaContractAddress: deploymentResult.solanaContractAddress,
          tonContractAddress: deploymentResult.tonContractAddress,
          trinityVerificationHash: deploymentResult.trinityVerificationHash,
          trinityVerificationStatus: deploymentResult.trinityVerified ? 'verified' : 'failed',
        })
        .where(eq(vaults.id, vaultData.id));
      
      securityLogger.info(`✅ Vault ${vaultData.id} created successfully!`, SecurityEventType.VAULT_CREATION);
      
      return {
        success: true,
        vaultId: vaultData.id,
        vaultData: vaultData,
        ...deploymentResult,
      };
      
    } catch (error: any) {
      securityLogger.error('❌ Vault creation failed', SecurityEventType.SYSTEM_ERROR, error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Validate vault creation request
   */
  private validateRequest(request: CreateVaultRequest): void {
    if (!request.walletAddress) {
      throw new Error('Wallet address is required');
    }
    
    if (!request.vaultType) {
      throw new Error('Vault type is required');
    }
    
    if (!request.assetAmount || parseFloat(request.assetAmount) <= 0) {
      throw new Error('Valid asset amount is required');
    }
    
    // Vault-type specific validation
    if (request.vaultType === 'timelock' && !request.timeLockDays) {
      throw new Error('Time lock period is required for time-lock vaults');
    }
    
    if (request.vaultType === 'multisig') {
      if (!request.signaturesRequired || !request.signerAddresses) {
        throw new Error('Signatures required and signer addresses are required for multi-sig vaults');
      }
      if (request.signaturesRequired > request.signerAddresses.length) {
        throw new Error('Signatures required cannot exceed number of signers');
      }
    }
    
    if (request.vaultType === 'crosschain_fragment') {
      if (!request.fragmentDistribution) {
        throw new Error('Fragment distribution is required for cross-chain fragment vaults');
      }
      const total = (request.fragmentDistribution.ethereum || 0) + 
                   (request.fragmentDistribution.solana || 0) + 
                   (request.fragmentDistribution.ton || 0);
      if (total !== 100) {
        throw new Error('Fragment distribution must total 100%');
      }
    }
  }

  /**
   * Create vault record in database
   * FIXED ARCHITECTURE: Arbitrum L2 PRIMARY, Solana MONITOR, TON BACKUP
   */
  private async createVaultInDatabase(
    request: CreateVaultRequest
  ): Promise<any> {
    const unlockDate = new Date();
    unlockDate.setDate(unlockDate.getDate() + (request.timeLockDays || 0));
    
    const [vault] = await db.insert(vaults).values({
      userId: request.userId,
      name: request.name,
      description: request.description,
      vaultType: request.vaultType,
      assetType: request.assetType,
      assetAmount: request.assetAmount,
      timeLockPeriod: request.timeLockDays || 0,
      unlockDate: unlockDate,
      primaryChain: 'ethereum', // Fixed: Arbitrum L2 (ethereum client)
      securityLevel: request.securityLevel,
      crossChainEnabled: request.securityLevel >= 4, // Enhanced and Maximum security
      trinityRoles: { primary: 'ethereum', monitor: 'solana', backup: 'ton' }, // Fixed roles
      trinityVerificationStatus: 'pending',
      signaturesRequired: request.signaturesRequired,
      signerAddresses: request.signerAddresses,
      fragmentDistribution: request.fragmentDistribution,
      fragmentRecoveryThreshold: request.fragmentRecoveryThreshold,
      metadata: {
        createdBy: request.walletAddress,
        creationTimestamp: new Date().toISOString(),
      },
    }).returning();
    
    return vault;
  }

  /**
   * Create Time-Lock Vault
   * PRIMARY: Arbitrum L2 (ethereum), MONITOR: Solana, BACKUP: TON
   * Now with REAL cross-chain registration for blockchain explorer visibility!
   */
  async createTimeLockVault(vaultData: any, request: CreateVaultRequest): Promise<any> {
    securityLogger.info(`⏱️ Creating Time-Lock Vault on Arbitrum L2 with ${request.timeLockDays} days lock`, SecurityEventType.VAULT_CREATION);
    
    const unlockTimestamp = Math.floor(Date.now() / 1000) + (request.timeLockDays! * 24 * 60 * 60);
    
    // Register vault across all three chains (creates REAL blockchain transactions)
    const crossChainResult = await crossChainVaultRegistration.registerVaultCrossChain({
      vaultId: vaultData.id.toString(),
      vaultName: request.name,
      ownerAddress: request.walletAddress,
      vaultType: 'timelock',
      amount: request.assetAmount,
      securityLevel: request.securityLevel,
    });
    
    // Trinity Protocol verification (2-of-3 or 3-of-3 based on security level)
    const requiredChains = request.securityLevel === 5 ? 3 : 2;
    const trinityVerification = await trinityProtocol.verifyOperation({
      operationId: `vault-create-${vaultData.id}`,
      operationType: OperationType.VAULT_CREATE,
      vaultId: vaultData.id.toString(),
      requester: request.walletAddress,
      data: {
        vaultType: 'timelock',
        unlockTimestamp,
        assetAmount: request.assetAmount,
        crossChainResult: crossChainResult.explorerLinks,
      },
      requiredChains,
    });
    
    return {
      ethereumTxHash: crossChainResult.arbitrumTxHash,
      solanaTxHash: crossChainResult.solanaTxSignature,
      tonTxHash: crossChainResult.tonTxHash,
      ethereumContractAddress: undefined, // Contract address comes from actual deployment
      solanaContractAddress: undefined,
      tonContractAddress: undefined,
      trinityVerificationHash: crossChainResult.trinityProofHash || trinityVerification.proofHash,
      trinityVerified: crossChainResult.success && trinityVerification.consensusReached,
      explorerLinks: crossChainResult.explorerLinks,
    };
  }

  /**
   * Create Multi-Signature Vault
   * PRIMARY: Arbitrum L2 (ethereum), MONITOR: Solana, BACKUP: TON
   * Now with REAL cross-chain registration for blockchain explorer visibility!
   */
  async createMultiSigVault(vaultData: any, request: CreateVaultRequest): Promise<any> {
    securityLogger.info(`🔐 Creating Multi-Sig Vault on Arbitrum L2 (${request.signaturesRequired}/${request.signerAddresses?.length})`, SecurityEventType.VAULT_CREATION);
    
    // Register vault across all three chains (creates REAL blockchain transactions)
    const crossChainResult = await crossChainVaultRegistration.registerVaultCrossChain({
      vaultId: vaultData.id.toString(),
      vaultName: request.name,
      ownerAddress: request.walletAddress,
      vaultType: 'multisig',
      amount: request.assetAmount,
      securityLevel: request.securityLevel,
    });
    
    // Trinity Protocol verification
    const requiredChains = request.securityLevel === 5 ? 3 : 2;
    const trinityVerification = await trinityProtocol.verifyOperation({
      operationId: `vault-create-${vaultData.id}`,
      operationType: OperationType.VAULT_CREATE,
      vaultId: vaultData.id.toString(),
      requester: request.walletAddress,
      data: {
        vaultType: 'multisig',
        signers: request.signerAddresses,
        threshold: request.signaturesRequired,
        crossChainResult: crossChainResult.explorerLinks,
      },
      requiredChains,
    });
    
    return {
      ethereumTxHash: crossChainResult.arbitrumTxHash,
      solanaTxHash: crossChainResult.solanaTxSignature,
      tonTxHash: crossChainResult.tonTxHash,
      ethereumContractAddress: undefined,
      solanaContractAddress: undefined,
      tonContractAddress: undefined,
      trinityVerificationHash: crossChainResult.trinityProofHash || trinityVerification.proofHash,
      trinityVerified: crossChainResult.success && trinityVerification.consensusReached,
      explorerLinks: crossChainResult.explorerLinks,
    };
  }

  /**
   * Create Cross-Chain Fragment Vault
   * Now with REAL cross-chain registration for blockchain explorer visibility!
   */
  async createCrossChainFragmentVault(vaultData: any, request: CreateVaultRequest): Promise<any> {
    securityLogger.info(`🧩 Creating Cross-Chain Fragment Vault`, SecurityEventType.VAULT_CREATION);
    
    const distribution = request.fragmentDistribution!;
    const totalAmount = parseFloat(request.assetAmount);
    
    // Calculate fragment amounts
    const ethAmount = (totalAmount * (distribution.ethereum || 0) / 100).toString();
    const solAmount = (totalAmount * (distribution.solana || 0) / 100).toString();
    const tonAmount = (totalAmount * (distribution.ton || 0) / 100).toString();
    
    // Register vault across all three chains (creates REAL blockchain transactions)
    const crossChainResult = await crossChainVaultRegistration.registerVaultCrossChain({
      vaultId: vaultData.id.toString(),
      vaultName: request.name,
      ownerAddress: request.walletAddress,
      vaultType: 'fragment',
      amount: request.assetAmount,
      securityLevel: request.securityLevel,
    });
    
    // Trinity Protocol verification (always 3-of-3 for fragment vaults)
    const trinityVerification = await trinityProtocol.verifyOperation({
      operationId: `vault-create-${vaultData.id}`,
      operationType: OperationType.VAULT_CREATE,
      vaultId: vaultData.id.toString(),
      requester: request.walletAddress,
      data: {
        vaultType: 'crosschain_fragment',
        fragments: {
          ethereum: ethAmount,
          solana: solAmount,
          ton: tonAmount,
        },
        recoveryThreshold: request.fragmentRecoveryThreshold,
        crossChainResult: crossChainResult.explorerLinks,
      },
      requiredChains: 3, // All 3 chains must verify
    });
    
    return {
      ethereumTxHash: crossChainResult.arbitrumTxHash,
      solanaTxHash: crossChainResult.solanaTxSignature,
      tonTxHash: crossChainResult.tonTxHash,
      ethereumContractAddress: undefined,
      solanaContractAddress: undefined,
      tonContractAddress: undefined,
      trinityVerificationHash: crossChainResult.trinityProofHash || trinityVerification.proofHash,
      trinityVerified: crossChainResult.success && trinityVerification.consensusReached,
      explorerLinks: crossChainResult.explorerLinks,
    };
  }
}

export const vaultCreationService = new VaultCreationService();
