import { ethers } from 'ethers';

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
}

/**
 * Ethereum Service for Chronos Vault
 * 
 * Provides connection to Ethereum blockchain
 */
class EthereumService {
  private provider: ethers.providers.Provider;
  private signer: ethers.Signer | null = null;
  private address: string | null = null;
  private network: EthereumNetwork = 'sepolia'; // Default to Sepolia testnet
  private isConnected: boolean = false;
  private lastError: string | null = null;
  
  // Network configurations
  private networks = {
    mainnet: { name: 'Ethereum Mainnet', chainId: 1, rpcUrl: 'https://mainnet.infura.io/v3/' },
    sepolia: { name: 'Sepolia Testnet', chainId: 11155111, rpcUrl: 'https://sepolia.infura.io/v3/' },
    goerli: { name: 'Goerli Testnet', chainId: 5, rpcUrl: 'https://goerli.infura.io/v3/' }
  };
  
  constructor() {
    // Check for MetaMask
    if (window.ethereum) {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log('Using MetaMask provider');
    } else {
      // Fallback to RPC URL
      const rpcId = '6cde839b76d04effb07861ca9f663d31'; // This would normally come from env vars
      const rpcUrl = `${this.networks[this.network].rpcUrl}${rpcId}`;
      this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);
      console.log('No Ethereum provider detected (MetaMask not installed). Using RPC URL.');
      console.log(`Initialized with fallback provider on ${this.networks[this.network].name}`);
    }
    
    console.log('Ethereum service initialized');
  }
  
  /**
   * Connect to Ethereum wallet (requires MetaMask)
   */
  async connect(): Promise<boolean> {
    if (!window.ethereum) {
      this.lastError = 'MetaMask not detected. Please install MetaMask to connect wallet.';
      console.error(this.lastError);
      return false;
    }
    
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      
      // Request accounts access
      await provider.send('eth_requestAccounts', []);
      
      // Get signer and address
      this.signer = provider.getSigner();
      this.address = await this.signer.getAddress();
      
      // Update provider with connected signer
      this.provider = provider;
      
      // Update connection state
      this.isConnected = true;
      this.lastError = null;
      
      console.log(`Connected to Ethereum wallet at ${this.address}`);
      return true;
    } catch (error) {
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
    if (window.ethereum) {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
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
      error: this.lastError
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
    if (!window.ethereum) {
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
      } catch (switchError) {
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
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      
      // If connected, update signer
      if (this.isConnected) {
        this.signer = this.provider.getSigner();
      }
      
      return true;
    } catch (error) {
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
  getProvider(): ethers.providers.Provider {
    return this.provider;
  }
  
  /**
   * Get signer instance (if connected)
   */
  getSigner(): ethers.Signer | null {
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
}

// Initialize and export the singleton instance
export const ethereumService = new EthereumService();