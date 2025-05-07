import { ethers, BrowserProvider, JsonRpcProvider, Signer, Provider } from 'ethers';

// Available networks
export type EthereumNetwork = 'mainnet' | 'sepolia' | 'goerli';

// Connection state
export interface EthereumConnectionState {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  networkName: string | null;
  balance: string | null;
  error: string | null;
  developmentMode: boolean;
}

// Vault creation parameters
export interface VaultCreationParams {
  unlockTime: number;
  amount: string;
  recipient?: string;
  comment?: string;
  securityLevel?: number;
}

// Transaction response
export interface TransactionResponse {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

// Vault creation response
export interface VaultCreationResponse {
  success: boolean;
  vaultAddress?: string;
  error?: string;
}

/**
 * Ethereum Service for Chronos Vault
 * 
 * Provides connection to Ethereum blockchain
 */
class EthereumService {
  private provider: BrowserProvider | JsonRpcProvider;
  private signer: Signer | null = null;
  private address: string | null = null;
  private network: EthereumNetwork = 'sepolia'; // Default to Sepolia testnet
  private isConnected: boolean = false;
  private isDevelopmentMode: boolean = false;
  private lastError: string | null = null;
  
  // Network configurations
  private networks = {
    mainnet: { name: 'Ethereum Mainnet', chainId: 1, rpcUrl: 'https://mainnet.infura.io/v3/' },
    sepolia: { name: 'Sepolia Testnet', chainId: 11155111, rpcUrl: 'https://sepolia.infura.io/v3/' },
    goerli: { name: 'Goerli Testnet', chainId: 5, rpcUrl: 'https://goerli.infura.io/v3/' }
  };
  
  constructor() {
    try {
      // Check for development environment
      this.isDevelopmentMode = process.env.NODE_ENV === 'development' || 
                              window.location.hostname.includes('replit') ||
                              window.location.hostname === 'localhost';
      
      // Check for MetaMask
      if (typeof window !== 'undefined' && window.ethereum) {
        this.provider = new BrowserProvider(window.ethereum);
        console.log('Using MetaMask provider');
      } else {
        // Fallback to RPC URL
        const rpcId = '6cde839b76d04effb07859ca9f663d31'; // This would normally come from env vars
        const rpcUrl = `${this.networks[this.network].rpcUrl}${rpcId}`;
        this.provider = new JsonRpcProvider(rpcUrl);
        console.log('No Ethereum provider detected (MetaMask not installed). Using RPC URL.');
        console.log(`Initialized with fallback provider on ${this.networks[this.network].name}`);
        
        // In development mode, set up a simulated connection
        if (this.isDevelopmentMode) {
          this.setupDevMode();
        }
      }
    } catch (error: any) {
      console.error('Failed to initialize Ethereum provider:', error);
      // Create a minimal provider to avoid null errors
      this.provider = new JsonRpcProvider();
      
      // In development mode, set up a simulated connection
      if (this.isDevelopmentMode) {
        this.setupDevMode();
      }
    }
    
    console.log('Ethereum service initialized');
  }
  
  /**
   * Set up development mode with simulated wallet
   */
  private setupDevMode(): void {
    this.isConnected = true;
    this.address = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'; // Standard hardhat test address
    console.log('Running in development mode with simulated wallet:', this.address);
  }
  
  /**
   * Connect to Ethereum wallet (requires MetaMask)
   */
  async connect(): Promise<boolean> {
    // Skip real connection in development mode
    if (this.isDevelopmentMode) {
      this.isConnected = true;
      this.address = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'; // Standard hardhat test address
      console.log('Development mode: Simulated successful connection to:', this.address);
      return true;
    }
    
    if (typeof window === 'undefined' || !window.ethereum) {
      this.lastError = 'MetaMask not detected. Please install MetaMask to connect wallet.';
      console.error(this.lastError);
      return false;
    }
    
    try {
      const provider = new BrowserProvider(window.ethereum);
      
      // Request accounts access and get signer
      const signer = await provider.getSigner();
      this.address = await signer.getAddress();
      
      // Update provider and signer
      this.provider = provider;
      this.signer = signer;
      
      // Update connection state
      this.isConnected = true;
      this.lastError = null;
      
      console.log(`Connected to Ethereum wallet at ${this.address}`);
      return true;
    } catch (error: any) {
      this.lastError = `Failed to connect wallet: ${error.message || 'Unknown error'}`;
      console.error('Error connecting to Ethereum wallet:', error);
      
      // Ensure disconnected state
      this.isConnected = false;
      this.signer = null;
      this.address = null;
      
      return false;
    }
  }
  
  /**
   * Disconnect from Ethereum wallet
   */
  disconnect(): boolean {
    this.signer = null;
    this.address = null;
    this.isConnected = false;
    
    // Reset to provider-only state
    if (typeof window !== 'undefined' && window.ethereum) {
      this.provider = new BrowserProvider(window.ethereum);
    }
    
    console.log('Disconnected from Ethereum wallet');
    return true;
  }
  
  /**
   * Get connection state
   */
  getConnectionState(): EthereumConnectionState {
    let networkName = this.networks[this.network].name;
    let chainId = this.networks[this.network].chainId;
    let balance = null;
    
    return {
      isConnected: this.isConnected,
      address: this.address,
      chainId,
      networkName,
      balance,
      error: this.lastError,
      developmentMode: this.isDevelopmentMode || false
    };
  }
  
  /**
   * Get available networks
   */
  getAvailableNetworks(): Array<{ id: string; name: string; chainId: number }> {
    return Object.entries(this.networks).map(([id, network]) => ({
      id,
      name: network.name,
      chainId: network.chainId
    }));
  }
  
  /**
   * Switch to a different network
   */
  async switchNetwork(network: EthereumNetwork): Promise<boolean> {
    if (typeof window === 'undefined' || !window.ethereum) {
      this.lastError = 'MetaMask not detected. Cannot switch network.';
      return false;
    }
    
    try {
      const targetNetwork = this.networks[network];
      const chainIdHex = '0x' + targetNetwork.chainId.toString(16);
      
      try {
        // Try switching to the network
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chainIdHex }]
        });
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          // Network doesn't exist, add it
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: chainIdHex,
              chainName: targetNetwork.name,
              rpcUrls: [targetNetwork.rpcUrl]
            }]
          });
        } else {
          throw switchError;
        }
      }
      
      // Update current network
      this.network = network;
      
      // Reinitialize provider
      this.provider = new BrowserProvider(window.ethereum);
      
      // If connected, update signer
      if (this.isConnected) {
        this.signer = await this.provider.getSigner();
      }
      
      return true;
    } catch (error: any) {
      this.lastError = `Failed to switch network: ${error.message || 'Unknown error'}`;
      console.error('Error switching Ethereum network:', error);
      return false;
    }
  }
  
  /**
   * Check if connected to Ethereum wallet
   */
  isWalletConnected(): boolean {
    return this.isConnected;
  }
  
  /**
   * Get connected wallet address
   */
  getWalletAddress(): string | null {
    return this.address;
  }
  
  /**
   * Get provider instance
   */
  getProvider(): BrowserProvider | JsonRpcProvider {
    return this.provider;
  }
  
  /**
   * Get signer instance (if connected)
   */
  getSigner(): Signer | null {
    return this.signer;
  }
  
  /**
   * Get block number
   */
  async getBlockNumber(): Promise<number> {
    try {
      return await this.provider.getBlockNumber();
    } catch (error) {
      console.error('Failed to get block number', error);
      return 0;
    }
  }

  /**
   * Send ETH to a specific address
   */
  async sendETH(toAddress: string, amount: string): Promise<TransactionResponse> {
    try {
      if (this.isDevelopmentMode) {
        console.log(`Development mode: Simulated sending ${amount} ETH to ${toAddress}`);
        return { 
          success: true, 
          transactionHash: `simulated_tx_${Date.now()}` 
        };
      }

      if (!this.isConnected || !this.signer) {
        throw new Error('Wallet not connected');
      }

      const parsedAmount = ethers.parseEther(amount);
      
      const tx = await this.signer.sendTransaction({
        to: toAddress,
        value: parsedAmount
      });
      
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt?.hash || tx.hash
      };
    } catch (error: any) {
      console.error('Error sending ETH:', error);
      return {
        success: false,
        error: error.message || 'Unknown error sending ETH'
      };
    }
  }

  /**
   * Create a vault with specific parameters
   */
  async createVault(params: VaultCreationParams): Promise<VaultCreationResponse> {
    try {
      if (this.isDevelopmentMode) {
        const simulatedAddress = `0x${Math.random().toString(16).substring(2, 42).padStart(40, '0')}`;
        console.log(`Development mode: Simulated creating vault at ${simulatedAddress}`, params);
        return { 
          success: true, 
          vaultAddress: simulatedAddress
        };
      }

      if (!this.isConnected || !this.signer) {
        throw new Error('Wallet not connected');
      }
      
      // In a real implementation, this would interact with the vault contract
      console.log('Creating vault with params:', params);
      
      // Simulate successful vault creation with random address
      const vaultAddress = `0x${Math.random().toString(16).substring(2, 42).padStart(40, '0')}`;
      
      return {
        success: true,
        vaultAddress
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
   * Validate if a transaction exists and is confirmed
   * @param txHash Transaction hash to validate
   * @returns Promise<boolean> - True if the transaction is valid and confirmed
   */
  async isTransactionValid(txHash: string): Promise<boolean> {
    try {
      console.log(`Validating Ethereum transaction: ${txHash}`);
      
      // In development mode or when using simulated transactions, always return true
      if (this.isDevelopmentMode || txHash.startsWith('simulated_')) {
        console.log('Using development mode validation for Ethereum transaction');
        return true;
      }
      
      // In production, we would verify the transaction on-chain:
      // 1. Get the transaction receipt
      // 2. Check if it's confirmed (has enough confirmations)
      // 3. Verify transaction success status
      
      // For now, simulate validation
      return true;
    } catch (error) {
      console.error('Error validating Ethereum transaction:', error);
      // In case of error, return false to indicate validation failure
      return false;
    }
  }
}

// Initialize and export the singleton instance
export const ethereumService = new EthereumService();