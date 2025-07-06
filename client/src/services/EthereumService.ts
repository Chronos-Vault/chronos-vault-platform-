import { ethers } from 'ethers';
import { ethereumService } from '@/lib/ethereum/ethereum-service';

/**
 * EthereumService wrapper for the Triple-Chain Security architecture
 * Provides a standardized interface to interact with Ethereum contracts 
 * in the context of the Triple-Chain Security system
 */
class EthereumServiceWrapper {
  private provider: ethers.providers.Provider;
  private signer: ethers.Signer | null = null;
  private vaultContract: ethers.Contract | null = null;
  private bridgeContract: ethers.Contract | null = null;
  
  // Contract ABIs (simplified for demo)
  private vaultAbi = [
    "function createVault(uint256 unlockTime, uint8 securityLevel) public returns (uint256)",
    "function unlockVault(uint256 vaultId, bytes32 accessKey) public",
    "function getVaultInfo(uint256 vaultId) public view returns (address owner, uint256 unlockTime, uint8 securityLevel, bool isLocked)",
    "function setEmergencyRecovery(uint256 vaultId, bool enabled) public",
    "function verifyOnOtherChain(uint256 vaultId, uint8 chainId, bytes32 proofHash) public"
  ];
  
  private bridgeAbi = [
    "function verifyVaultOnTON(uint256 vaultId, bytes32 tonProof) public",
    "function verifyVaultOnSolana(uint256 vaultId, bytes32 solanaProof) public",
    "function isVaultVerified(uint256 vaultId) public view returns (bool ethereum, bool ton, bool solana)",
    "function submitCrossChainProof(uint256 vaultId, uint8 chainId, bytes32 proofHash) public",
    "function initiateEmergencyRecovery(uint256 vaultId, string reason) public"
  ];
  
  constructor() {
    // Use the existing Ethereum service for connection management
    this.provider = ethereumService.getProvider();
    this.initializeContracts();
  }
  
  /**
   * Initialize contract instances
   */
  private async initializeContracts() {
    try {
      // Get signer if available
      if (ethereumService.isConnected()) {
        this.signer = ethereumService.getSigner();
      }
      
      // Contract addresses - would come from configuration in production
      const vaultAddress = '0x8B26dE49A29F1f8C121dD7e168a43Fb4f5ba2cDB'; // Example address
      const bridgeAddress = '0x9876dE49A29F1f8C121dD7e168a43Fb4f5ba2FFE'; // Example address
      
      // Create contract instances
      if (this.signer) {
        // Connect with signer for write access
        this.vaultContract = new ethers.Contract(vaultAddress, this.vaultAbi, this.signer);
        this.bridgeContract = new ethers.Contract(bridgeAddress, this.bridgeAbi, this.signer);
      } else {
        // Connect with provider for read-only access
        this.vaultContract = new ethers.Contract(vaultAddress, this.vaultAbi, this.provider);
        this.bridgeContract = new ethers.Contract(bridgeAddress, this.bridgeAbi, this.provider);
      }
    } catch (error) {
      console.error('Failed to initialize Ethereum contracts', error);
    }
  }
  
  /**
   * Get the underlying provider
   */
  getProvider(): ethers.providers.Provider {
    return this.provider;
  }
  
  /**
   * Get the signer if connected
   */
  getSigner(): ethers.Signer | null {
    return this.signer;
  }
  
  /**
   * Create a new vault on Ethereum
   */
  async createVault(unlockTime: number, securityLevel: number, owner: string): Promise<string> {
    try {
      if (!this.vaultContract || !this.signer) {
        throw new Error('Ethereum vault contract not initialized or not connected');
      }
      
      // Ensure we have the latest signer
      await this.initializeContracts();
      
      console.log(`Creating vault with unlock time ${unlockTime} and security level ${securityLevel}`);
      
      // Call the contract
      const tx = await this.vaultContract.createVault(unlockTime, securityLevel);
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      console.log('Vault created on Ethereum', receipt.transactionHash);
      
      return receipt.transactionHash;
    } catch (error) {
      console.error('Failed to create vault on Ethereum', error);
      throw new Error(`Ethereum vault creation failed: ${error.message}`);
    }
  }
  
  /**
   * Unlock a vault on Ethereum
   */
  async unlockVault(vaultId: string, accessKey: string): Promise<string> {
    try {
      if (!this.vaultContract || !this.signer) {
        throw new Error('Ethereum vault contract not initialized or not connected');
      }
      
      // Ensure we have the latest signer
      await this.initializeContracts();
      
      // Convert accessKey to bytes32
      const accessKeyBytes = ethers.utils.formatBytes32String(accessKey);
      
      // Convert vaultId to number
      const vaultIdNumber = parseInt(vaultId.replace('vault-', ''));
      
      console.log(`Unlocking vault ${vaultIdNumber} with access key`);
      
      // Call the contract
      const tx = await this.vaultContract.unlockVault(vaultIdNumber, accessKeyBytes);
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      console.log('Vault unlocked on Ethereum', receipt.transactionHash);
      
      return receipt.transactionHash;
    } catch (error) {
      console.error('Failed to unlock vault on Ethereum', error);
      throw new Error(`Ethereum vault unlock failed: ${error.message}`);
    }
  }
  
  /**
   * Check the status of a vault on Ethereum
   */
  async checkVaultStatus(vaultId: string): Promise<{
    exists: boolean;
    isUnlockable: boolean;
    isLocked: boolean;
    securityLevel: number;
    unlockTime: number;
  }> {
    try {
      if (!this.vaultContract) {
        throw new Error('Ethereum vault contract not initialized');
      }
      
      // Convert vaultId to number
      const vaultIdNumber = parseInt(vaultId.replace('vault-', ''));
      
      console.log(`Checking status of vault ${vaultIdNumber} on Ethereum`);
      
      try {
        // Call the contract to get vault info
        const [owner, unlockTime, securityLevel, isLocked] = await this.vaultContract.getVaultInfo(vaultIdNumber);
        
        // Vault exists if owner is not zero address
        const exists = owner !== ethers.constants.AddressZero;
        
        // Check if vault is unlockable (unlock time has passed)
        const now = Math.floor(Date.now() / 1000);
        const isUnlockable = exists && (now >= unlockTime.toNumber());
        
        return {
          exists,
          isUnlockable,
          isLocked,
          securityLevel: securityLevel.toNumber(),
          unlockTime: unlockTime.toNumber()
        };
      } catch (error) {
        // If we get an error, the vault probably doesn't exist
        console.log(`Vault ${vaultIdNumber} not found on Ethereum`);
        
        return {
          exists: false,
          isUnlockable: false,
          isLocked: true,
          securityLevel: 0,
          unlockTime: 0
        };
      }
    } catch (error) {
      console.error('Failed to check vault status on Ethereum', error);
      throw new Error(`Ethereum vault status check failed: ${error.message}`);
    }
  }
  
  /**
   * Get vault details from Ethereum
   */
  async getVaultStatus(vaultId: string): Promise<{
    exists: boolean;
    owner: string;
    unlockTime: number;
    securityLevel: number;
    isLocked: boolean;
  }> {
    try {
      if (!this.vaultContract) {
        throw new Error('Ethereum vault contract not initialized');
      }
      
      // Convert vaultId to number
      const vaultIdNumber = parseInt(vaultId.replace('vault-', ''));
      
      try {
        // Call the contract
        const [owner, unlockTime, securityLevel, isLocked] = await this.vaultContract.getVaultInfo(vaultIdNumber);
        
        // Vault exists if owner is not zero address
        const exists = owner !== ethers.constants.AddressZero;
        
        return {
          exists,
          owner,
          unlockTime: unlockTime.toNumber(),
          securityLevel: securityLevel.toNumber(),
          isLocked
        };
      } catch (error) {
        // If we get an error, the vault probably doesn't exist
        return {
          exists: false,
          owner: ethers.constants.AddressZero,
          unlockTime: 0,
          securityLevel: 0,
          isLocked: true
        };
      }
    } catch (error) {
      console.error('Failed to get vault status from Ethereum', error);
      throw new Error(`Ethereum vault status retrieval failed: ${error.message}`);
    }
  }
  
  /**
   * Submit a cross-chain verification proof to Ethereum
   */
  async submitCrossChainVerification(vaultId: string, chainId: number, proofHash: string): Promise<string> {
    try {
      if (!this.bridgeContract || !this.signer) {
        throw new Error('Ethereum bridge contract not initialized or not connected');
      }
      
      // Ensure we have the latest signer
      await this.initializeContracts();
      
      // Convert vaultId to number
      const vaultIdNumber = parseInt(vaultId.replace('vault-', ''));
      
      // Convert proofHash to bytes32
      const proofHashBytes = ethers.utils.arrayify(proofHash);
      
      console.log(`Submitting ${chainId === 1 ? 'TON' : 'Solana'} verification for vault ${vaultIdNumber} to Ethereum`);
      
      // Call the contract
      const tx = await this.bridgeContract.submitCrossChainProof(vaultIdNumber, chainId, proofHashBytes);
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      console.log('Cross-chain proof submitted to Ethereum', receipt.transactionHash);
      
      return receipt.transactionHash;
    } catch (error) {
      console.error('Failed to submit cross-chain verification to Ethereum', error);
      throw new Error(`Ethereum cross-chain verification failed: ${error.message}`);
    }
  }
  
  /**
   * Check if a vault is verified across chains
   */
  async isVaultVerifiedCrossChain(vaultId: string): Promise<{
    ethereum: boolean;
    ton: boolean;
    solana: boolean;
  }> {
    try {
      if (!this.bridgeContract) {
        throw new Error('Ethereum bridge contract not initialized');
      }
      
      // Convert vaultId to number
      const vaultIdNumber = parseInt(vaultId.replace('vault-', ''));
      
      console.log(`Checking cross-chain verification status for vault ${vaultIdNumber}`);
      
      try {
        // Call the contract
        const [ethereum, ton, solana] = await this.bridgeContract.isVaultVerified(vaultIdNumber);
        
        return { ethereum, ton, solana };
      } catch (error) {
        // If we get an error, return all false
        return { ethereum: false, ton: false, solana: false };
      }
    } catch (error) {
      console.error('Failed to check cross-chain verification status', error);
      throw new Error(`Cross-chain verification check failed: ${error.message}`);
    }
  }
  
  /**
   * Initiate emergency recovery for a vault on Ethereum
   */
  async initiateEmergencyRecovery(vaultId: string, reason: string): Promise<string> {
    try {
      if (!this.bridgeContract || !this.signer) {
        throw new Error('Ethereum bridge contract not initialized or not connected');
      }
      
      // Ensure we have the latest signer
      await this.initializeContracts();
      
      // Convert vaultId to number
      const vaultIdNumber = parseInt(vaultId.replace('vault-', ''));
      
      console.log(`Initiating emergency recovery for vault ${vaultIdNumber} on Ethereum`);
      
      // Call the contract
      const tx = await this.bridgeContract.initiateEmergencyRecovery(vaultIdNumber, reason);
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      console.log('Emergency recovery initiated on Ethereum', receipt.transactionHash);
      
      return receipt.transactionHash;
    } catch (error) {
      console.error('Failed to initiate emergency recovery on Ethereum', error);
      throw new Error(`Ethereum emergency recovery failed: ${error.message}`);
    }
  }
  
  /**
   * Get the latest block number from Ethereum
   */
  async getBlockNumber(): Promise<number> {
    try {
      return await this.provider.getBlockNumber();
    } catch (error) {
      console.error('Failed to get Ethereum block number', error);
      throw new Error(`Ethereum block number retrieval failed: ${error.message}`);
    }
  }
}

// Singleton instance
let instance: EthereumServiceWrapper | null = null;

/**
 * Get the Ethereum service instance
 */
export const getEthereumService = (): EthereumServiceWrapper => {
  if (!instance) {
    instance = new EthereumServiceWrapper();
  }
  return instance;
};