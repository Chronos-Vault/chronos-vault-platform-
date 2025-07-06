import { ethers, Contract } from 'ethers';
import { CHRONOS_VAULT_ABI } from '../contract-interfaces';
import { useToast } from '@/hooks/use-toast';

// This interface matches the parameters from the Smart Contract Vault creation form
export interface CreateVaultParams {
  name: string;
  symbol: string;
  asset: string;
  unlockTime: number | Date; // Unix timestamp or Date object
  securityLevel: number;
  accessKey?: string;
  isPublic: boolean;
  description?: string;
  tags?: string[] | string;
  enableCrossChain: boolean;
  enableMultiSig: boolean;
  enableGeoLock: boolean;
}

// Network config for different environments
const NETWORK_CONFIG = {
  mainnet: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: import.meta.env.VITE_ETHEREUM_RPC_URL || 'https://eth-mainnet.public.blastapi.io',
    explorerUrl: 'https://etherscan.io',
    vaultFactoryAddress: '0x0000000000000000000000000000000000000000' // Replace with real address when deployed
  },
  sepolia: {
    chainId: 11155111,
    name: 'Sepolia Testnet',
    rpcUrl: 'https://eth-sepolia.g.alchemy.com/v2/demo',
    explorerUrl: 'https://sepolia.etherscan.io',
    vaultFactoryAddress: '0x1234567890123456789012345678901234567890' // Replace with test address
  }
};

// Use testnet by default in development
const currentNetwork = import.meta.env.DEV ? 'sepolia' : 'mainnet';
const networkConfig = NETWORK_CONFIG[currentNetwork as keyof typeof NETWORK_CONFIG];

/**
 * VaultContractService - Handles interactions with Ethereum smart contracts
 */
class VaultContractService {
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Signer | null = null;
  private isConnected: boolean = false;
  private factoryContract: Contract | null = null;

  constructor() {
    // Initialize provider
    this.provider = new ethers.JsonRpcProvider(networkConfig.rpcUrl);
    
    // In development, use a predefined wallet
    if (import.meta.env.DEV) {
      // This is a development wallet - NEVER use in production
      const DEVELOPMENT_PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
      this.signer = new ethers.Wallet(DEVELOPMENT_PRIVATE_KEY, this.provider);
      this.isConnected = true;
      console.log('Using development wallet:', (this.signer as ethers.Wallet).address);
      this._initializeContracts();
    }
  }

  /**
   * Initialize contract instances
   */
  private _initializeContracts() {
    if (!this.signer) return;
    
    this.factoryContract = new Contract(
      networkConfig.vaultFactoryAddress,
      [
        "function createVault(string name, string symbol, address asset, uint256 unlockTime, uint8 securityLevel, string accessKey, bool isPublic) external returns (address)",
        "function getVaultsByOwner(address owner) external view returns (address[])",
        "event VaultCreated(address indexed vault, address indexed owner, uint256 timestamp)"
      ],
      this.signer
    );
  }

  /**
   * Connect wallet using MetaMask or other injected provider
   */
  async connectWallet(): Promise<boolean> {
    try {
      // Check if window.ethereum is available (MetaMask or other wallet)
      if (window.ethereum) {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Create Web3Provider and get signer
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        this.signer = await web3Provider.getSigner();
        this.isConnected = true;
        
        // Initialize contracts
        this._initializeContracts();
        
        console.log('Wallet connected:', accounts[0]);
        
        return true;
      } else {
        console.error('No ethereum wallet found');
        return false;
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      return false;
    }
  }

  /**
   * Check if wallet is connected
   */
  isWalletConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Create a new vault
   */
  async createVault(params: CreateVaultParams): Promise<{ success: boolean; vaultAddress?: string; txHash?: string; error?: string }> {
    try {
      if (!this.signer || !this.factoryContract) {
        throw new Error('Wallet not connected or contracts not initialized');
      }

      console.log('Creating vault with params:', params);

      // Convert Date to unix timestamp if needed
      const unlockTimeUnix = typeof params.unlockTime === 'number' 
        ? params.unlockTime 
        : Math.floor(new Date(params.unlockTime).getTime() / 1000);

      // Split tags string into array if needed
      const tagsArray = typeof params.tags === 'string' 
        ? params.tags.split(',').map((tag: string) => tag.trim()) 
        : params.tags || [];

      // Prepare transaction
      const tx = await this.factoryContract.createVault(
        params.name,
        params.symbol,
        params.asset,
        unlockTimeUnix,
        params.securityLevel,
        params.accessKey || "",
        params.isPublic
      );

      console.log('Transaction sent:', tx.hash);

      // Wait for transaction to be mined
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);

      // Find the VaultCreated event to get the vault address
      const vaultCreatedEvent = receipt.logs
        .filter((log: any) => this.factoryContract?.interface.parseLog(log)?.name === 'VaultCreated')
        .map((log: any) => this.factoryContract?.interface.parseLog(log)?.args)[0];

      if (!vaultCreatedEvent) {
        throw new Error('Vault creation event not found in transaction receipt');
      }

      const vaultAddress = vaultCreatedEvent.vault;

      // In a real implementation, we would now set up the additional features
      if (params.enableCrossChain || params.enableMultiSig || params.enableGeoLock) {
        await this._setupAdvancedFeatures(vaultAddress, params);
      }

      return {
        success: true,
        vaultAddress,
        txHash: tx.hash
      };
    } catch (error: any) {
      console.error('Error creating vault:', error);
      return {
        success: false,
        error: error.message || 'Unknown error creating vault'
      };
    }
  }

  /**
   * Set up advanced features for a vault
   */
  private async _setupAdvancedFeatures(vaultAddress: string, params: CreateVaultParams): Promise<void> {
    if (!this.signer) return;

    try {
      // Create contract instance for the newly created vault
      const vaultContract = new Contract(
        vaultAddress,
        CHRONOS_VAULT_ABI,
        this.signer
      );

      // Set up cross-chain verification if enabled
      if (params.enableCrossChain) {
        // This would add cross-chain addresses for TON and Solana
        // In a real implementation, we would deploy contracts on those chains first
        console.log('Setting up cross-chain verification for vault:', vaultAddress);
        
        // Example: these would be real addresses in production
        await vaultContract.addCrossChainAddress(
          "TON", 
          "EQAvDfYmkVV2zFXzC0Hs2e2RGWJyMXHpnMTXH4jnI2W3AwLb"
        );
        
        await vaultContract.addCrossChainAddress(
          "Solana", 
          "ChronoSVauLt111111111111111111111111111111111"
        );
      }

      // Set up multi-signature if enabled
      if (params.enableMultiSig) {
        // In a real implementation, we would configure the multi-sig settings
        console.log('Setting up multi-signature for vault:', vaultAddress);
        
        // This is just a placeholder - in a real app we would ask for signers and threshold
        // await vaultContract.setupMultiSig([signer1, signer2, signer3], 2);
      }

      // Set up geo-location lock if enabled
      if (params.enableGeoLock) {
        // In a real implementation, we would configure the geo-lock settings
        console.log('Setting up geo-location lock for vault:', vaultAddress);
        
        // This is just a placeholder - in a real app we would ask for region
        // await vaultContract.enableGeoLock("US", proofHash);
      }
    } catch (error) {
      console.error('Error setting up advanced features:', error);
      // We don't throw here to prevent blocking the main vault creation flow
      // Instead, we could queue these operations for retry
    }
  }

  /**
   * Get all vaults owned by the connected wallet
   */
  async getMyVaults(): Promise<string[]> {
    try {
      if (!this.signer || !this.factoryContract) {
        throw new Error('Wallet not connected or contracts not initialized');
      }

      const ownerAddress = await this.signer.getAddress();
      const vaults = await this.factoryContract.getVaultsByOwner(ownerAddress);
      
      return vaults;
    } catch (error) {
      console.error('Error getting vaults:', error);
      return [];
    }
  }

  /**
   * Get vault details
   */
  async getVaultDetails(vaultAddress: string): Promise<any> {
    try {
      if (!this.provider) {
        throw new Error('Provider not initialized');
      }

      const vaultContract = new Contract(
        vaultAddress,
        CHRONOS_VAULT_ABI,
        this.provider
      );

      // Get basic vault info
      const [
        name,
        symbol,
        unlockTime,
        securityLevel,
        isUnlocked
      ] = await Promise.all([
        vaultContract.name(),
        vaultContract.symbol(),
        vaultContract.unlockTime(),
        vaultContract.securityLevel(),
        vaultContract.isUnlocked()
      ]);

      // Get metadata
      const metadata = await vaultContract.getMetadata();

      return {
        address: vaultAddress,
        name,
        symbol,
        unlockTime: new Date(Number(unlockTime) * 1000),
        securityLevel: Number(securityLevel),
        isUnlocked,
        metadata: {
          name: metadata.name,
          description: metadata.description,
          tags: metadata.tags,
          contentHash: metadata.contentHash,
          isPublic: metadata.isPublic
        }
      };
    } catch (error) {
      console.error('Error getting vault details:', error);
      throw error;
    }
  }

  /**
   * Withdraw assets from a vault
   */
  async withdrawFromVault(vaultAddress: string, amount: string, accessKey?: string): Promise<boolean> {
    try {
      if (!this.signer) {
        throw new Error('Wallet not connected');
      }

      const vaultContract = new Contract(
        vaultAddress,
        CHRONOS_VAULT_ABI,
        this.signer
      );

      // Check if vault is unlocked
      const isUnlocked = await vaultContract.isUnlocked();
      
      // If not naturally unlocked, try to unlock with access key
      if (!isUnlocked && accessKey) {
        const unlockTx = await vaultContract.unlockEarly(accessKey);
        await unlockTx.wait();
      }

      // Get owner address
      const ownerAddress = await this.signer.getAddress();

      // Withdraw assets
      const tx = await vaultContract.withdraw(
        ethers.parseEther(amount), 
        ownerAddress,
        ownerAddress
      );

      await tx.wait();
      return true;
    } catch (error: any) {
      console.error('Error withdrawing from vault:', error);
      // Use the toast hook in component instead of directly here
      // This avoids errors with React hooks in non-component context
      console.error(error.message || "Could not withdraw from vault");
      return false;
    }
  }
}

// Export singleton instance
export const vaultContractService = new VaultContractService();

// For TypeScript support with window.ethereum
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (request: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
      selectedAddress?: string;
      chainId?: string;
    };
  }
}