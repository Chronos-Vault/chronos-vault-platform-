/**
 * Ethereum Connector
 * 
 * This module provides an implementation of the BlockchainConnector interface
 * for the Ethereum blockchain. It handles wallet connections, smart contract
 * interactions, and security operations for Ethereum-based vaults.
 */

import { ethers } from 'ethers';
import { BlockchainConnector } from '../../shared/interfaces/blockchain-connector';
import { 
  VaultCreationParams, 
  VaultStatusInfo, 
  TransactionResult, 
  SecurityVerification
} from '../../shared/types/blockchain-types';
import { securityLogger } from '../monitoring/security-logger';
import config from '../config';

// ABI definitions for vault contracts
const VAULT_ABI = [
  "function createVault(uint256 unlockTimestamp, address[] beneficiaries, bool isMultiSig) external returns (uint256 vaultId)",
  "function getVaultInfo(uint256 vaultId) external view returns (address owner, uint256 unlockTimestamp, bool isLocked, uint256 balance)",
  "function lockAssets(uint256 vaultId) external payable",
  "function unlockAssets(uint256 vaultId) external",
  "function addBeneficiary(uint256 vaultId, address beneficiary) external",
  "function removeBeneficiary(uint256 vaultId, address beneficiary) external",
  "function isVaultOwner(uint256 vaultId, address account) external view returns (bool)",
  "function getVaultBeneficiaries(uint256 vaultId) external view returns (address[])",
  "event VaultCreated(uint256 indexed vaultId, address indexed owner, uint256 unlockTimestamp, bool isMultiSig)",
  "event AssetsLocked(uint256 indexed vaultId, uint256 amount)",
  "event AssetsUnlocked(uint256 indexed vaultId, uint256 amount)",
  "event BeneficiaryAdded(uint256 indexed vaultId, address indexed beneficiary)",
  "event BeneficiaryRemoved(uint256 indexed vaultId, address indexed beneficiary)"
];

// Contract addresses for different networks
const CONTRACT_ADDRESSES = {
  mainnet: {
    vault: "0x0000000000000000000000000000000000000000", // Replace with actual address when deployed
    bridge: "0x0000000000000000000000000000000000000000" // Replace with actual address when deployed
  },
  testnet: {
    vault: "0xEthVaultTestnetAddress000000000000000000", // Replace with actual testnet address
    bridge: "0xEthBridgeTestnetAddress000000000000000000" // Replace with actual testnet address
  }
};

export class EthereumConnector implements BlockchainConnector {
  // Properties required by BlockchainConnector interface
  chainId: string = 'ethereum';
  chainName: string = 'Ethereum';
  isTestnet: boolean;
  networkVersion: string;
  
  // Ethereum specific properties
  private provider: ethers.JsonRpcProvider | null = null;
  private vaultContract: ethers.Contract | null = null;
  private wallet: ethers.Wallet | null = null;
  private signer: ethers.Signer | null = null;
  private walletAddress: string | null = null;
  
  /**
   * Initialize the Ethereum connector
   */
  constructor(isTestnet: boolean = true) {
    this.isTestnet = isTestnet;
    this.networkVersion = isTestnet ? 'sepolia' : 'mainnet';
    
    // Skip blockchain initialization if the flag is set
    if (config.featureFlags.SKIP_BLOCKCHAIN_CONNECTOR_INIT) {
      securityLogger.info('Skipping Ethereum connector initialization due to SKIP_BLOCKCHAIN_CONNECTOR_INIT flag');
      return;
    }
    
    // Determine RPC URL based on network
    // Use a more reliable public RPC URL if the environment variables are not set
    const rpcUrl = isTestnet
      ? process.env.ETHEREUM_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com"
      : process.env.ETHEREUM_MAINNET_RPC_URL || "https://eth.llamarpc.com";
      
    // Initialize provider (ethers v6 API) with specific network options to avoid additional network calls
    try {
      const networkName = isTestnet ? 'sepolia' : 'mainnet';
      // In ethers.js v6, network format is different - ensAddress is no longer needed
      // In ethers v6, we need to set up the network configuration differently
      // Network can be created using chainId or name
      const network = ethers.Network.from(
        isTestnet ? "sepolia" : "mainnet"
      );
      
      // Options must be passed in the correct format for v6
      const clientOptions = {
        staticNetwork: true, // This makes the provider keep the network even if chain changes
        polling: true // Enable polling for more reliable connections in server environments
      };
      
      // For v6, network is passed as an object with defined structure
      this.provider = new ethers.JsonRpcProvider(rpcUrl, network, clientOptions);
      
      // Initialize contract based on network
      const contractAddresses = isTestnet ? CONTRACT_ADDRESSES.testnet : CONTRACT_ADDRESSES.mainnet;
      
      if (process.env.ETHEREUM_PRIVATE_KEY) {
        this.wallet = new ethers.Wallet(process.env.ETHEREUM_PRIVATE_KEY, this.provider);
        this.signer = this.wallet;
        
        // Initialize contract with signer
        this.vaultContract = new ethers.Contract(contractAddresses.vault, VAULT_ABI, this.signer);
        this.walletAddress = this.wallet.address;
        
        securityLogger.info(`Ethereum connector initialized with wallet ${this.walletAddress} on ${this.networkVersion}`);
      } else if (config.isDevelopmentMode) {
        // For development, we'll use a hardcoded address for simulation
        this.walletAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // Common Hardhat test address
        securityLogger.info(`Ethereum connector initialized in dev mode with simulated wallet ${this.walletAddress}`);
      } else {
        // Initialize contract with provider (read-only)
        this.vaultContract = new ethers.Contract(contractAddresses.vault, VAULT_ABI, this.provider);
        securityLogger.info(`Ethereum connector initialized in read-only mode on ${this.networkVersion}`);
      }
    } catch (error) {
      securityLogger.error('Failed to initialize Ethereum connector', { error });
      throw new Error(`Failed to initialize Ethereum connector: ${error}`);
    }
  }
  
  /**
   * Connect to an Ethereum wallet
   * For server-side operations, this is typically not needed as we use a private key
   */
  async connectWallet(): Promise<string> {
    if (this.walletAddress) {
      return this.walletAddress;
    }
    
    if (config.isDevelopmentMode) {
      this.walletAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // Hardhat test address
      return this.walletAddress;
    }
    
    throw new Error('No wallet private key provided to Ethereum connector');
  }
  
  /**
   * Disconnect from the wallet
   */
  async disconnectWallet(): Promise<void> {
    // No action needed for server-side wallet
    return;
  }
  
  /**
   * Check if wallet is connected
   */
  async isConnected(): Promise<boolean> {
    return !!this.walletAddress;
  }
  
  /**
   * Get the connected wallet address
   */
  async getAddress(): Promise<string> {
    if (!this.walletAddress) {
      throw new Error('No wallet connected to Ethereum connector');
    }
    return this.walletAddress;
  }
  
  /**
   * Get the balance of an address in ETH
   */
  async getBalance(address: string): Promise<string> {
    // Check if this specific blockchain should be simulated
    if (config.shouldSimulateBlockchain('ethereum') || !this.provider) {
      if (config.isDevelopmentMode) {
        // Use more realistic simulation data from config
        // If the address matches our simulation address, use the preconfigured balance
        if (address.toLowerCase() === config.simulation.ethereum.walletAddress.toLowerCase()) {
          return config.simulation.ethereum.balances.default;
        }
        
        // For other addresses, generate a randomized balance to simulate testnet variety
        // Using a hash function of the address to always return the same value for the same address
        const seed = address.toLowerCase().split('').reduce((a, b) => {
          return a + b.charCodeAt(0);
        }, 0);
        
        // Generate a pseudo-random balance between 0.1 and 50 ETH
        const randomBalance = (seed % 500) / 10 + 0.1;
        return randomBalance.toFixed(4);
      }
      
      throw new Error('Provider not initialized or simulation mode enabled');
    }
    
    try {
      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      securityLogger.error(`Failed to get Ethereum balance for ${address}`, { error });
      throw new Error(`Failed to get balance: ${error}`);
    }
  }

  /**
   * Create a new vault on Ethereum
   */
  async createVault(params: VaultCreationParams): Promise<TransactionResult> {
    try {
      // Check if this specific blockchain should be simulated
      if (config.shouldSimulateBlockchain('ethereum') || !this.vaultContract || !this.signer) {
        if (config.isDevelopmentMode) {
          securityLogger.info(`Creating simulated Ethereum vault in development mode`);
          
          // Add realistic simulation with configurable success rates and delays
          const simConfig = config.simulation.ethereum;
          
          // Apply success rate simulation - sometimes transactions can fail
          const isSuccessful = Math.random() <= simConfig.transactions.successRates.vaultCreation;
          
          if (!isSuccessful) {
            await this.simulateDelay(simConfig.simulatedDelay.transaction);
            return {
              success: false,
              error: "Transaction failed: insufficient gas or network congestion",
              chainId: this.chainId
            };
          }
          
          // Simulate transaction delay
          await this.simulateDelay(simConfig.simulatedDelay.transaction);
          
          // Generate deterministic but unique vault ID
          const timestamp = Date.now();
          const vaultId = `eth_vault_${timestamp}_${params.owner.substring(0, 6)}`;
          const txHash = `0x${timestamp.toString(16)}_${Math.floor(Math.random() * 1000000).toString(16)}`;
          
          // Simulate confirmation delay
          await this.simulateDelay(simConfig.simulatedDelay.confirmation);
          
          return {
            success: true,
            transactionHash: txHash,
            vaultId,
            chainId: this.chainId
          };
        }
        throw new Error('Vault contract or signer not initialized');
      }
      
      // Convert unlock date to timestamp
      const unlockTimestamp = Math.floor(new Date(params.unlockDate).getTime() / 1000);
      
      // Convert beneficiaries to array if needed
      const beneficiaries = Array.isArray(params.beneficiaries) 
        ? params.beneficiaries 
        : params.beneficiaries ? [params.beneficiaries] : [];
      
      // Determine if multi-sig vault
      const isMultiSig = params.securityLevel === 'high' || params.securityLevel === 3;
      
      // Create transaction
      const tx = await this.vaultContract.createVault(
        unlockTimestamp,
        beneficiaries,
        isMultiSig
      );
      
      // Wait for transaction confirmation (ethers v6 format)
      const receipt = await tx.wait();
      
      // Extract vault ID from events (ethers v6 changes the event format)
      // Find the VaultCreated event in the logs
      // Define proper type for log object to avoid implicit any
      interface Log {
        topics: ReadonlyArray<string>;
        data: string;
        transactionHash: string;
        blockHash: string;
        blockNumber: number;
        address: string;
        transactionIndex: number;
        logIndex: number;
      }
      
      const vaultCreatedEvent = receipt.logs.find((log: Log) => {
        try {
          const parsedLog = this.vaultContract!.interface.parseLog({
            topics: log.topics,
            data: log.data
          });
          return parsedLog && parsedLog.name === 'VaultCreated';
        } catch (e) {
          return false;
        }
      });
      
      if (!vaultCreatedEvent) {
        throw new Error('Vault creation event not found in transaction receipt');
      }
      
      // Parse the event with the contract interface
      const parsedEvent = this.vaultContract!.interface.parseLog({
        topics: vaultCreatedEvent.topics as string[],
        data: vaultCreatedEvent.data
      });
      
      const vaultId = parsedEvent!.args[0].toString(); // Assuming vaultId is first arg
      
      return {
        success: true,
        transactionHash: receipt.transactionHash,
        vaultId,
        chainId: this.chainId
      };
    } catch (error) {
      securityLogger.error('Failed to create Ethereum vault', { error, params });
      return {
        success: false,
        error: `Failed to create vault on Ethereum: ${error}`,
        chainId: this.chainId
      };
    }
  }
  
  /**
   * Get information about a vault
   */
  async getVaultInfo(vaultId: string): Promise<VaultStatusInfo> {
    try {
      if (!this.vaultContract) {
        if (config.isDevelopmentMode) {
          return this.getSimulatedVaultInfo(vaultId);
        }
        throw new Error('Vault contract not initialized');
      }
      
      const [owner, unlockTimestamp, isLocked, balance] = await this.vaultContract.getVaultInfo(vaultId);
      
      return {
        id: vaultId,
        owner,
        unlockDate: new Date(unlockTimestamp.toNumber() * 1000),
        isLocked,
        balance: ethers.formatEther(balance),
        chainId: this.chainId,
        network: this.networkVersion,
        securityLevel: await this.determineVaultSecurityLevel(vaultId),
        lastActivity: new Date()
      };
    } catch (error) {
      securityLogger.error(`Failed to get Ethereum vault info for ${vaultId}`, { error });
      throw new Error(`Failed to get vault info: ${error}`);
    }
  }
  
  /**
   * Get all vaults owned by an address
   */
  async listVaults(ownerAddress: string): Promise<VaultStatusInfo[]> {
    if (config.isDevelopmentMode) {
      return [
        this.getSimulatedVaultInfo(`eth_vault_${Date.now() - 86400000}`),
        this.getSimulatedVaultInfo(`eth_vault_${Date.now()}`)
      ];
    }
    
    // In a real implementation, we would need an event-based approach or indexing service
    // to efficiently query vaults by owner
    throw new Error('Not implemented: Vault listing requires a subgraph or other indexing service');
  }
  
  /**
   * Lock assets into a vault
   */
  async lockAssets(vaultId: string, amount: string, assetType: string): Promise<TransactionResult> {
    try {
      if (!this.vaultContract || !this.signer) {
        if (config.isDevelopmentMode) {
          securityLogger.info(`Simulating Ethereum asset locking in development mode`);
          return {
            success: true,
            transactionHash: `eth_lock_${Date.now()}_${Math.floor(Math.random() * 1000000)}`,
            vaultId,
            chainId: this.chainId
          };
        }
        throw new Error('Vault contract or signer not initialized');
      }
      
      let tx;
      if (assetType === 'eth' || assetType === 'native') {
        // For native ETH, use value parameter
        const weiAmount = ethers.parseEther(amount);
        tx = await this.vaultContract.lockAssets(vaultId, { value: weiAmount });
      } else {
        // For other assets, we would need to interact with ERC20 contracts
        throw new Error('ERC20 token locking not implemented yet');
      }
      
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.transactionHash,
        vaultId,
        chainId: this.chainId
      };
    } catch (error) {
      securityLogger.error(`Failed to lock assets in Ethereum vault ${vaultId}`, { error, amount, assetType });
      return {
        success: false,
        error: `Failed to lock assets: ${error}`,
        vaultId,
        chainId: this.chainId
      };
    }
  }
  
  /**
   * Unlock assets from a vault
   */
  async unlockAssets(vaultId: string): Promise<TransactionResult> {
    try {
      if (!this.vaultContract || !this.signer) {
        if (config.isDevelopmentMode) {
          securityLogger.info(`Simulating Ethereum asset unlocking in development mode`);
          return {
            success: true,
            transactionHash: `eth_unlock_${Date.now()}_${Math.floor(Math.random() * 1000000)}`,
            vaultId,
            chainId: this.chainId
          };
        }
        throw new Error('Vault contract or signer not initialized');
      }
      
      const tx = await this.vaultContract.unlockAssets(vaultId);
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.transactionHash,
        vaultId,
        chainId: this.chainId
      };
    } catch (error) {
      securityLogger.error(`Failed to unlock assets from Ethereum vault ${vaultId}`, { error });
      return {
        success: false,
        error: `Failed to unlock assets: ${error}`,
        vaultId,
        chainId: this.chainId
      };
    }
  }
  
  /**
   * Add a beneficiary to a vault
   */
  async addBeneficiary(vaultId: string, beneficiaryAddress: string): Promise<TransactionResult> {
    try {
      if (!this.vaultContract || !this.signer) {
        if (config.isDevelopmentMode) {
          securityLogger.info(`Simulating Ethereum beneficiary addition in development mode`);
          return {
            success: true,
            transactionHash: `eth_add_ben_${Date.now()}_${Math.floor(Math.random() * 1000000)}`,
            vaultId,
            chainId: this.chainId
          };
        }
        throw new Error('Vault contract or signer not initialized');
      }
      
      const tx = await this.vaultContract.addBeneficiary(vaultId, beneficiaryAddress);
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.transactionHash,
        vaultId,
        chainId: this.chainId
      };
    } catch (error) {
      securityLogger.error(`Failed to add beneficiary to Ethereum vault ${vaultId}`, { error, beneficiaryAddress });
      return {
        success: false,
        error: `Failed to add beneficiary: ${error}`,
        vaultId,
        chainId: this.chainId
      };
    }
  }
  
  /**
   * Remove a beneficiary from a vault
   */
  async removeBeneficiary(vaultId: string, beneficiaryAddress: string): Promise<TransactionResult> {
    try {
      if (!this.vaultContract || !this.signer) {
        if (config.isDevelopmentMode) {
          securityLogger.info(`Simulating Ethereum beneficiary removal in development mode`);
          return {
            success: true,
            transactionHash: `eth_rem_ben_${Date.now()}_${Math.floor(Math.random() * 1000000)}`,
            vaultId,
            chainId: this.chainId
          };
        }
        throw new Error('Vault contract or signer not initialized');
      }
      
      const tx = await this.vaultContract.removeBeneficiary(vaultId, beneficiaryAddress);
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.transactionHash,
        vaultId,
        chainId: this.chainId
      };
    } catch (error) {
      securityLogger.error(`Failed to remove beneficiary from Ethereum vault ${vaultId}`, { error, beneficiaryAddress });
      return {
        success: false,
        error: `Failed to remove beneficiary: ${error}`,
        vaultId,
        chainId: this.chainId
      };
    }
  }
  
  /**
   * Verify the integrity of a vault
   */
  async verifyVaultIntegrity(vaultId: string): Promise<SecurityVerification> {
    try {
      if (config.isDevelopmentMode) {
        return {
          isValid: true,
          signatures: ['0xSimulatedEthereumSignature1', '0xSimulatedEthereumSignature2'],
          verifiedAt: new Date(),
          chainId: this.chainId
        };
      }
      
      if (!this.vaultContract) {
        throw new Error('Vault contract not initialized');
      }
      
      // In a real implementation, we would check various security conditions
      // Here, we're just verifying that the vault exists
      const [owner, , isLocked, ] = await this.vaultContract.getVaultInfo(vaultId);
      
      // Verify owner address is valid
      if (!ethers.isAddress(owner)) {
        return {
          isValid: false,
          error: 'Invalid vault owner address',
          verifiedAt: new Date(),
          chainId: this.chainId
        };
      }
      
      // For a complete implementation, we would check cross-chain verifications,
      // contract integrity, transaction history, etc.
      
      return {
        isValid: true,
        signatures: [`0x${owner.slice(2, 10)}...${owner.slice(-8)}_verified`],
        verifiedAt: new Date(),
        chainId: this.chainId
      };
    } catch (error) {
      securityLogger.error(`Failed to verify Ethereum vault integrity for ${vaultId}`, { error });
      return {
        isValid: false,
        error: `Verification failed: ${error}`,
        verifiedAt: new Date(),
        chainId: this.chainId
      };
    }
  }
  
  /**
   * Sign a message with the connected wallet
   */
  async signMessage(message: string): Promise<string> {
    if (!this.signer) {
      if (config.isDevelopmentMode) {
        return `0xSimulatedEthereumSignature_${Date.now()}_${message.slice(0, 10)}`;
      }
      throw new Error('No signer available');
    }
    
    try {
      return await this.signer.signMessage(message);
    } catch (error) {
      securityLogger.error('Failed to sign message with Ethereum wallet', { error, messagePreview: message.slice(0, 32) });
      throw new Error(`Failed to sign message: ${error}`);
    }
  }
  
  /**
   * Verify a signature against a message and address
   */
  async verifySignature(message: string, signature: string, address: string): Promise<boolean> {
    try {
      if (config.isDevelopmentMode && signature.startsWith('0xSimulated')) {
        return true;
      }
      
      const recoveredAddress = ethers.verifyMessage(message, signature);
      return recoveredAddress.toLowerCase() === address.toLowerCase();
    } catch (error) {
      securityLogger.error('Failed to verify Ethereum signature', { error, address, messagePreview: message.slice(0, 32) });
      return false;
    }
  }
  
  /**
   * Create a multi-signature request for vault operations
   */
  async createMultiSigRequest(vaultId: string, operation: string, params: any): Promise<string> {
    if (config.isDevelopmentMode) {
      return `eth_multisig_${vaultId}_${operation}_${Date.now()}`;
    }
    
    // In a real implementation, we would have a multi-sig request contract
    throw new Error('Multi-signature operations not implemented yet');
  }
  
  /**
   * Approve a multi-signature request
   */
  async approveMultiSigRequest(requestId: string): Promise<TransactionResult> {
    if (config.isDevelopmentMode) {
      return {
        success: true,
        transactionHash: `eth_approve_${requestId}_${Date.now()}`,
        chainId: this.chainId
      };
    }
    
    // In a real implementation, we would have a multi-sig request contract
    throw new Error('Multi-signature operations not implemented yet');
  }
  
  /**
   * Get chain-specific features (for client information)
   */
  getChainSpecificFeatures(): any {
    return {
      supportsERC20: true,
      supportsERC721: true,
      hasLowFees: false,
      gasEstimator: true,
      eip1559Support: true
    };
  }
  
  /**
   * Get the status of a multi-signature request
   */
  async getMultiSigStatus(requestId: string): Promise<any> {
    if (config.isDevelopmentMode) {
      return {
        requestId,
        operation: 'unlock',
        vaultId: `eth_vault_${Date.now().toString(36).substring(5, 9)}`,
        initiator: this.walletAddress || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        approvals: 1,
        requiredApprovals: 3,
        executed: false,
        chainId: this.chainId
      };
    }
    throw new Error('Multi-signature status retrieval not implemented yet');
  }
  
  /**
   * Initiate a vault sync across chains
   */
  async initiateVaultSync(vaultId: string, targetChain: string): Promise<any> {
    if (config.isDevelopmentMode) {
      return {
        success: true,
        transactionHash: `eth_sync_${Date.now()}_${Math.floor(Math.random() * 1000000)}`,
        vaultId,
        chainId: this.chainId
      };
    }
    throw new Error('Cross-chain vault sync not implemented yet');
  }
  
  /**
   * Verify a vault across multiple chains
   */
  async verifyVaultAcrossChains(vaultId: string): Promise<Record<string, any>> {
    if (config.isDevelopmentMode) {
      return {
        [this.chainId]: {
          isValid: true,
          signatures: ['0xSimulatedEthereumSignature1', '0xSimulatedEthereumSignature2'],
          verifiedAt: new Date(),
          chainId: this.chainId
        },
        'solana': {
          isValid: true,
          signatures: ['SimulatedSolanaSignature1'],
          verifiedAt: new Date(),
          chainId: 'solana'
        },
        'ton': {
          isValid: true,
          signatures: ['SimulatedTONSignature1'],
          verifiedAt: new Date(),
          chainId: 'ton'
        }
      };
    }
    throw new Error('Cross-chain verification not implemented yet');
  }
  
  /**
   * Execute a chain-specific method
   */
  async executeChainSpecificMethod(methodName: string, params: any): Promise<any> {
    if (config.isDevelopmentMode) {
      return { success: true, result: `Simulated execution of ${methodName}` };
    }
    throw new Error(`Chain-specific method ${methodName} not implemented`);
  }
  
  /**
   * Subscribe to vault events
   */
  subscribeToVaultEvents(vaultId: string, callback: (event: any) => void): () => void {
    if (config.isDevelopmentMode) {
      // Return an unsubscribe function
      return () => {};
    }
    throw new Error('Vault event subscription not implemented yet');
  }
  
  /**
   * Subscribe to blockchain events
   */
  subscribeToBlockchainEvents(eventType: string, callback: (event: any) => void): () => void {
    if (config.isDevelopmentMode) {
      // Return an unsubscribe function
      return () => {};
    }
    throw new Error('Blockchain event subscription not implemented yet');
  }
  
  // Private utility methods
  
  /**
   * Helper method to simulate realistic blockchain delays in development mode
   * @param delayConfig Object containing min and max delay times in milliseconds
   * @returns Promise that resolves after a random delay between min and max
   */
  private async simulateDelay(delayConfig: { min: number, max: number }): Promise<void> {
    if (!config.isDevelopmentMode) return;
    
    const delayTime = Math.floor(
      Math.random() * (delayConfig.max - delayConfig.min + 1) + delayConfig.min
    );
    
    // Only log in verbose mode to avoid cluttering the logs
    if (process.env.VERBOSE_LOGGING === 'true') {
      securityLogger.debug(`Simulating Ethereum blockchain delay: ${delayTime}ms`);
    }
    
    return new Promise(resolve => setTimeout(resolve, delayTime));
  }
  
  /**
   * Generate simulated vault info for development mode
   */
  private getSimulatedVaultInfo(vaultId: string): VaultStatusInfo {
    const now = new Date();
    const futureDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days in the future
    
    return {
      id: vaultId,
      owner: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      unlockDate: futureDate,
      isLocked: true,
      balance: '1.337',
      chainId: this.chainId,
      network: this.networkVersion,
      securityLevel: 'medium',
      lastActivity: new Date(now.getTime() - 24 * 60 * 60 * 1000)
    };
  }
  
  /**
   * Determine the security level of a vault based on its configuration
   */
  private async determineVaultSecurityLevel(vaultId: string): Promise<'low' | 'medium' | 'high'> {
    if (config.isDevelopmentMode) {
      // Randomly assign a security level for development
      const levels: ['low', 'medium', 'high'] = ['low', 'medium', 'high'];
      return levels[Math.floor(Math.random() * levels.length)];
    }
    
    if (!this.vaultContract) {
      throw new Error('Vault contract not initialized');
    }
    
    try {
      // Check if it's a multi-sig vault
      const isMultiSig = await this.vaultContract.isMultiSigVault(vaultId);
      if (isMultiSig) return 'high';
      
      // Check number of beneficiaries
      const beneficiaries = await this.vaultContract.getVaultBeneficiaries(vaultId);
      if (beneficiaries.length > 0) return 'medium';
      
      return 'low';
    } catch (error) {
      securityLogger.warn(`Failed to determine security level for vault ${vaultId}`, { error });
      return 'low'; // Default to low if cannot determine
    }
  }
}