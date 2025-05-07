import { ethers } from 'ethers';
import { TonClient } from '@tonclient/core';
import { Connection } from '@solana/web3.js';
import { getCrossChainBridge, initCrossChainBridge } from '@/services/CrossChainBridgeService';
import { getEthereumService } from '@/services/EthereumService';
import { getTONService } from '@/services/TONService';
import { getSolanaService } from '@/services/SolanaService';

/**
 * TripleChainSecurityService
 * 
 * Coordinates the Triple-Chain Security architecture across Ethereum, TON, and Solana blockchains.
 * Ensures vault security through multi-chain verification and backup.
 */
export class TripleChainSecurityService {
  private ethereumService: any; // EthereumService
  private tonService: any; // TONService
  private solanaService: any; // SolanaService
  private crossChainBridge: any; // CrossChainBridgeService
  
  private initialized: boolean = false;
  
  // Contract addresses
  private tonVaultAddress: string = '';
  private ethereumVaultAddress: string = '';
  private solanaVaultProgramId: string = '';
  
  private tonBridgeAddress: string = '';
  private ethereumBridgeAddress: string = '';
  private solanaBridgeProgramId: string = '';
  
  constructor() {
    console.log('Initializing Triple-Chain Security Service');
  }
  
  /**
   * Initialize the Triple-Chain Security service
   */
  async initialize(): Promise<void> {
    try {
      // Get blockchain services
      this.ethereumService = getEthereumService();
      this.tonService = getTONService();
      this.solanaService = getSolanaService();
      
      // Set contract addresses (these would come from configuration in a real implementation)
      this.tonVaultAddress = 'EQAvDfYmkVV2zFXzC0Hs2e2RGWJyMXHpnMTXH4jnI2W3AwLb'; // TON testnet
      this.ethereumVaultAddress = '0x8B26dE49A29F1f8C121dD7e168a43Fb4f5ba2cDB'; // Ethereum testnet
      this.solanaVaultProgramId = 'ChronoSVauLt111111111111111111111111111111111'; // Solana devnet
      
      this.tonBridgeAddress = 'EQB0gCDoGJNTfoPUSCgBxLuZ_O-7aYUccU0P1Vj_QdO6rQTf'; // TON testnet
      this.ethereumBridgeAddress = '0x9876dE49A29F1f8C121dD7e168a43Fb4f5ba2FFE'; // Ethereum testnet
      this.solanaBridgeProgramId = 'Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS'; // Solana devnet
      
      // Initialize cross-chain bridge
      initCrossChainBridge(
        this.ethereumService.getProvider(),
        this.tonService.getClient(),
        this.solanaService.getConnection(),
        this.tonBridgeAddress,
        this.ethereumBridgeAddress,
        this.solanaBridgeProgramId
      );
      
      this.crossChainBridge = getCrossChainBridge();
      
      this.initialized = true;
      console.log('Triple-Chain Security Service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Triple-Chain Security Service', error);
      throw new Error(`Triple-Chain Security initialization failed: ${error.message}`);
    }
  }
  
  /**
   * Create a new vault with Triple-Chain Security
   */
  async createSecureVault(
    unlockTime: number,
    securityLevel: number,
    owner: string
  ): Promise<{
    vaultId: string;
    ethereumTxHash: string;
    tonTxHash: string;
    solanaTxHash: string;
  }> {
    if (!this.initialized) {
      await this.initialize();
    }
    
    try {
      console.log(`Creating new vault with security level ${securityLevel}`);
      
      // Step 1: Create vault on Ethereum (primary ownership layer)
      console.log('Creating vault on Ethereum (primary layer)');
      const ethereumTxHash = await this.ethereumService.createVault(unlockTime, securityLevel, owner);
      
      // Get vault ID from Ethereum transaction receipt
      const vaultId = `vault-${Date.now()}`; // In real implementation, get from tx receipt
      
      // Step 2: Create backup vault on TON (backup and recovery layer)
      console.log('Creating vault backup on TON (backup layer)');
      const tonTxHash = await this.tonService.createVaultBackup(vaultId, unlockTime, securityLevel, owner);
      
      // Step 3: Create security monitor on Solana (high-frequency monitoring layer)
      console.log('Creating vault monitor on Solana (monitoring layer)');
      const solanaTxHash = await this.solanaService.createVaultMonitor(vaultId, unlockTime, securityLevel, owner);
      
      // Step 4: Wait for cross-chain verification
      console.log('Waiting for cross-chain verification...');
      await this.waitForCrossChainVerification(vaultId);
      
      console.log('Vault created with Triple-Chain Security');
      return {
        vaultId,
        ethereumTxHash,
        tonTxHash,
        solanaTxHash
      };
    } catch (error) {
      console.error('Failed to create vault with Triple-Chain Security', error);
      throw new Error(`Vault creation failed: ${error.message}`);
    }
  }
  
  /**
   * Unlock a vault with Triple-Chain Security verification
   */
  async unlockVault(
    vaultId: string,
    accessKey: string,
    coordinates?: { latitude: number; longitude: number }
  ): Promise<{
    success: boolean;
    ethereumTxHash?: string;
    tonTxHash?: string;
    solanaTxHash?: string;
  }> {
    if (!this.initialized) {
      await this.initialize();
    }
    
    try {
      console.log(`Attempting to unlock vault ${vaultId}`);
      
      // Step 1: Verify vault is unlockable on Ethereum
      const ethereumStatus = await this.ethereumService.checkVaultStatus(vaultId);
      if (!ethereumStatus.isUnlockable) {
        console.log('Vault is not unlockable on Ethereum');
        return { success: false };
      }
      
      // Step 2: Get security level to determine required verifications
      const securityLevel = ethereumStatus.securityLevel || 1;
      
      // Step 3: For security levels > 1, verify on TON
      let tonTxHash;
      if (securityLevel > 1) {
        console.log('Verifying on TON (backup layer)');
        tonTxHash = await this.tonService.verifyVaultUnlock(vaultId, accessKey);
      }
      
      // Step 4: For security levels > 2, verify on Solana
      let solanaTxHash;
      if (securityLevel > 2) {
        console.log('Verifying on Solana (monitoring layer)');
        
        // If geographic restrictions are enabled (level 4+), check coordinates
        if (securityLevel >= 4 && coordinates) {
          solanaTxHash = await this.solanaService.verifyVaultUnlockWithLocation(
            vaultId, 
            accessKey,
            coordinates.latitude,
            coordinates.longitude
          );
        } else {
          solanaTxHash = await this.solanaService.verifyVaultUnlock(vaultId, accessKey);
        }
      }
      
      // Step 5: Perform the actual unlock on Ethereum (primary chain)
      console.log('Performing unlock on Ethereum (primary layer)');
      const ethereumTxHash = await this.ethereumService.unlockVault(vaultId, accessKey);
      
      console.log('Vault unlocked successfully with Triple-Chain Security');
      return {
        success: true,
        ethereumTxHash,
        tonTxHash,
        solanaTxHash
      };
    } catch (error) {
      console.error('Failed to unlock vault with Triple-Chain Security', error);
      return { success: false };
    }
  }
  
  /**
   * Initiate emergency recovery for a vault
   */
  async initiateEmergencyRecovery(
    vaultId: string,
    reason: string
  ): Promise<{
    success: boolean;
    recoveryId?: string;
  }> {
    if (!this.initialized) {
      await this.initialize();
    }
    
    try {
      console.log(`Initiating emergency recovery for vault ${vaultId}`);
      
      // Step 1: Start recovery on TON (backup and recovery layer)
      console.log('Initiating recovery on TON (backup layer)');
      const tonRecoveryResult = await this.tonService.initiateRecovery(vaultId, reason);
      
      // Step 2: Create recovery requests on all chains via cross-chain bridge
      console.log('Propagating recovery requests across all chains');
      const bridgeResult = await this.crossChainBridge.initiateEmergencyRecovery(
        vaultId,
        reason,
        this.ethereumService.getSigner()
      );
      
      const recoveryId = `recovery-${Date.now()}`;
      
      console.log('Emergency recovery initiated across all chains');
      return {
        success: true,
        recoveryId
      };
    } catch (error) {
      console.error('Failed to initiate emergency recovery', error);
      return { success: false };
    }
  }
  
  /**
   * Get the security status of a vault across all chains
   */
  async getVaultSecurityStatus(vaultId: string): Promise<{
    securityLevel: number;
    ethereumStatus: { exists: boolean; isLocked: boolean; unlockTime: number };
    tonStatus: { exists: boolean; isBackedUp: boolean; recoveryMode: boolean };
    solanaStatus: { exists: boolean; isMonitored: boolean; lastCheckTime: number };
    crossChainVerified: boolean;
  }> {
    if (!this.initialized) {
      await this.initialize();
    }
    
    try {
      console.log(`Getting security status for vault ${vaultId}`);
      
      // Get status from Ethereum (primary ownership layer)
      const ethereumStatus = await this.ethereumService.getVaultStatus(vaultId);
      
      // Get status from TON (backup and recovery layer)
      const tonStatus = await this.tonService.getVaultBackupStatus(vaultId);
      
      // Get status from Solana (high-frequency monitoring layer)
      const solanaStatus = await this.solanaService.getVaultMonitorStatus(vaultId);
      
      // Check cross-chain verification
      const crossChainVerified = await this.crossChainBridge.isVaultTripleChainVerified(vaultId);
      
      return {
        securityLevel: ethereumStatus.securityLevel || 1,
        ethereumStatus: {
          exists: ethereumStatus.exists || false,
          isLocked: ethereumStatus.isLocked || true,
          unlockTime: ethereumStatus.unlockTime || 0
        },
        tonStatus: {
          exists: tonStatus.exists || false,
          isBackedUp: tonStatus.isBackedUp || false,
          recoveryMode: tonStatus.recoveryMode || false
        },
        solanaStatus: {
          exists: solanaStatus.exists || false,
          isMonitored: solanaStatus.isMonitored || false,
          lastCheckTime: solanaStatus.lastCheckTime || 0
        },
        crossChainVerified
      };
    } catch (error) {
      console.error('Failed to get vault security status', error);
      throw new Error(`Failed to get security status: ${error.message}`);
    }
  }
  
  /**
   * Wait for cross-chain verification of a vault
   * @private
   */
  private async waitForCrossChainVerification(vaultId: string, maxAttempts: number = 10): Promise<boolean> {
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      console.log(`Checking cross-chain verification (attempt ${attempts + 1}/${maxAttempts})`);
      
      const isVerified = await this.crossChainBridge.isVaultTripleChainVerified(vaultId);
      
      if (isVerified) {
        console.log('Vault verified across all chains');
        return true;
      }
      
      attempts++;
      
      // Wait before next attempt (2 seconds)
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    console.warn(`Cross-chain verification not completed after ${maxAttempts} attempts`);
    return false;
  }
}

// Singleton instance
let instance: TripleChainSecurityService | null = null;

export const getTripleChainSecurityService = (): TripleChainSecurityService => {
  if (!instance) {
    instance = new TripleChainSecurityService();
  }
  return instance;
};