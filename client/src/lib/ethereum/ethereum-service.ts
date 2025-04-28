/**
 * Ethereum Service
 * 
 * Handles interactions with the Ethereum blockchain using ethers.js v6
 * Documentation: https://docs.ethers.org/v6/getting-started/
 */

import { ethers } from 'ethers';
import { BrowserProvider, JsonRpcSigner } from 'ethers';
import { VaultCreationParams } from '../cross-chain/interfaces';

// Default Ethereum networks
const NETWORKS = {
  mainnet: {
    name: 'Ethereum Mainnet',
    chainId: 1,
    rpcUrl: 'https://eth-mainnet.public.blastapi.io'
  },
  goerli: {
    name: 'Goerli Testnet',
    chainId: 5,
    rpcUrl: 'https://eth-goerli.public.blastapi.io'
  },
  sepolia: {
    name: 'Sepolia Testnet',
    chainId: 11155111,
    rpcUrl: 'https://eth-sepolia.public.blastapi.io'
  }
};

// ABI for the ChronosVault contract
// This is a simplified ABI with the most important functions
const CHRONOS_VAULT_ABI = [
  // Core functionality
  "constructor(address _asset, string memory _name, string memory _symbol, uint256 _unlockTime, uint8 _securityLevel, string memory _accessKey, bool _isPublic)",
  "function deposit(uint256 assets, address receiver) public returns (uint256)",
  "function withdraw(uint256 assets, address receiver, address owner) public returns (uint256)",
  "function redeem(uint256 shares, address receiver, address owner) public returns (uint256)",
  
  // Vault Management
  "function unlockEarly(string memory _accessKey) external",
  "function addAuthorizedRetriever(address _retriever) external",
  "function unlockTime() public view returns (uint256)",
  "function isUnlocked() public view returns (bool)",
  "function securityLevel() public view returns (uint8)",
  "function checkIfUnlocked() external view returns (bool)",
  
  // Events
  "event VaultCreated(address indexed creator, uint256 unlockTime, uint8 securityLevel)",
  "event VaultUnlocked(address indexed retriever, uint256 unlockTime)",
  "event AssetDeposited(address indexed from, uint256 amount)",
  "event AssetWithdrawn(address indexed to, uint256 amount)"
];

// Vault Contract Address (will be different per network)
const VAULT_CONTRACT_ADDRESS = {
  mainnet: '0x1234567890123456789012345678901234567890', // Placeholder for real address
  goerli: '0x1234567890123456789012345678901234567890',  // Placeholder for real address
  sepolia: '0x1234567890123456789012345678901234567890'  // Placeholder for real address
};

// Connection state
export interface EthereumConnectionState {
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  address: string | null;
  chainId: number | null;
  networkName: string | null;
  isConnected: boolean;
  balance: string | null;
  error: string | null;
}

// Default connection state
const defaultConnectionState: EthereumConnectionState = {
  provider: null,
  signer: null,
  address: null,
  chainId: null,
  networkName: null,
  isConnected: false,
  balance: null,
  error: null
};

class EthereumService {
  private _connectionState: EthereumConnectionState;
  private _vaultContract: ethers.Contract | null = null;
  private _currentNetwork: string = 'goerli'; // Default to testnet
  
  constructor() {
    this._connectionState = { ...defaultConnectionState };
    this.initializeProvider();
    
    // Listen for network changes if window.ethereum is available
    if (window.ethereum) {
      window.ethereum.on('chainChanged', this.handleChainChanged.bind(this));
      window.ethereum.on('accountsChanged', this.handleAccountsChanged.bind(this));
    }
    
    console.log('Ethereum service initialized');
  }
  
  /**
   * Initialize provider without connecting
   */
  private async initializeProvider() {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        this._connectionState.provider = provider;
        
        // Get network info
        const network = await provider.getNetwork();
        this._connectionState.chainId = Number(network.chainId);
        this._connectionState.networkName = this.getNetworkName(Number(network.chainId));
        
        console.log(`Initialized on ${this._connectionState.networkName}`);
      } else {
        console.log('No Ethereum provider detected (MetaMask not installed)');
      }
    } catch (error) {
      console.error('Error initializing Ethereum provider:', error);
    }
  }
  
  /**
   * Connect to Ethereum wallet
   */
  public async connect(): Promise<boolean> {
    try {
      if (!window.ethereum) {
        this._connectionState.error = 'No Ethereum wallet found. Please install MetaMask.';
        console.error(this._connectionState.error);
        return false;
      }
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      this._connectionState.provider = provider;
      
      // Request accounts
      const accounts = await provider.send('eth_requestAccounts', []);
      
      if (accounts.length === 0) {
        this._connectionState.error = 'No accounts found. Please unlock your wallet.';
        return false;
      }
      
      // Get signer and address
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      // Get network details
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);
      const networkName = this.getNetworkName(chainId);
      
      // Get balance
      const balance = await provider.getBalance(address);
      const formattedBalance = ethers.formatEther(balance);
      
      // Update connection state
      this._connectionState = {
        provider,
        signer,
        address,
        chainId,
        networkName,
        isConnected: true,
        balance: formattedBalance,
        error: null
      };
      
      // Initialize contract
      this.initializeContract();
      
      console.log(`Connected to Ethereum: ${address} on ${networkName}`);
      return true;
    } catch (error: any) {
      this._connectionState.error = error.message || 'Failed to connect to Ethereum';
      console.error('Error connecting to Ethereum:', error);
      return false;
    }
  }
  
  /**
   * Disconnect from Ethereum wallet
   */
  public disconnect(): boolean {
    try {
      // MetaMask doesn't have a formal disconnect method, so we just clear state
      this._connectionState = { ...defaultConnectionState };
      this._vaultContract = null;
      
      console.log('Disconnected from Ethereum wallet');
      return true;
    } catch (error) {
      console.error('Error disconnecting from Ethereum:', error);
      return false;
    }
  }
  
  /**
   * Initialize the vault contract
   */
  private initializeContract() {
    try {
      if (!this._connectionState.signer) {
        console.error('Cannot initialize contract: No signer available');
        return;
      }
      
      const contractAddress = this.getContractAddressForNetwork();
      
      this._vaultContract = new ethers.Contract(
        contractAddress,
        CHRONOS_VAULT_ABI,
        this._connectionState.signer
      );
      
      console.log(`Vault contract initialized at ${contractAddress}`);
    } catch (error) {
      console.error('Error initializing vault contract:', error);
    }
  }
  
  /**
   * Create a new time-locked vault using the ChronosVault contract
   */
  public async createVault(params: VaultCreationParams): Promise<{ success: boolean; vaultAddress?: string; error?: string }> {
    try {
      if (!this._connectionState.isConnected || !this._vaultContract) {
        return { 
          success: false, 
          error: 'Not connected to Ethereum or contract not initialized' 
        };
      }
      
      const { unlockTime, amount, recipient, comment } = params;
      
      // ChronosVault requires an ERC20 token address, name, symbol, and other parameters
      // For this implementation, we'll use a dummy ERC20 token address
      const dummyERC20Address = "0x0000000000000000000000000000000000000000"; // Use a real token address in production
      const vaultName = `ChronosVault-${Date.now()}`;
      const vaultSymbol = "CVT-TL";
      const securityLevel = 1; // Basic security level
      const accessKey = ""; // No access key for basic security level
      const isPublic = true;
      
      console.log(`Creating vault unlocking at ${new Date(unlockTime * 1000).toLocaleString()}`);
      console.log(`Beneficiary: ${recipient || 'Self'}`);
      
      // Call contract constructor
      // For a real implementation, we would deploy a new ChronosVault contract instance
      // This is simplified for demonstration purposes
      const tx = await this._vaultContract.constructor(
        dummyERC20Address,
        vaultName,
        vaultSymbol,
        unlockTime,
        securityLevel,
        accessKey,
        isPublic
      );
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      
      // Extract vault address from the receipt
      // In a real implementation, this would come from the deployment address
      const vaultAddress = receipt.contractAddress || "0x";
      
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
   * Send ETH to another address
   */
  public async sendETH(
    toAddress: string,
    amount: string
  ): Promise<{ success: boolean; transactionHash?: string; error?: string }> {
    try {
      if (!this._connectionState.isConnected || !this._connectionState.signer) {
        return { 
          success: false, 
          error: 'Not connected to Ethereum' 
        };
      }
      
      // Convert amount to wei
      const amountWei = ethers.parseEther(amount);
      
      // Create transaction
      const tx = await this._connectionState.signer.sendTransaction({
        to: toAddress,
        value: amountWei
      });
      
      // Wait for confirmation
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt?.hash
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
   * Get current connection state
   */
  public getConnectionState(): EthereumConnectionState {
    return { ...this._connectionState };
  }
  
  /**
   * Get wallet information in a simplified format
   */
  public getWalletInfo() {
    if (!this._connectionState.isConnected) {
      return null;
    }
    
    return {
      address: this._connectionState.address,
      balance: this._connectionState.balance,
      network: this._connectionState.networkName,
      chainId: this._connectionState.chainId
    };
  }
  
  /**
   * Get available networks
   */
  public getAvailableNetworks() {
    return Object.keys(NETWORKS).map(id => ({
      id,
      name: NETWORKS[id as keyof typeof NETWORKS].name,
      chainId: NETWORKS[id as keyof typeof NETWORKS].chainId
    }));
  }
  
  /**
   * Switch to a different network
   */
  public async switchNetwork(networkId: string): Promise<boolean> {
    try {
      if (!window.ethereum || !this._connectionState.provider) {
        console.error('No Ethereum provider available');
        return false;
      }
      
      const network = NETWORKS[networkId as keyof typeof NETWORKS];
      if (!network) {
        console.error(`Network ${networkId} not found`);
        return false;
      }
      
      // Try to switch to the network
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${network.chainId.toString(16)}` }]
        });
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: `0x${network.chainId.toString(16)}`,
                  chainName: network.name,
                  rpcUrls: [network.rpcUrl]
                }
              ]
            });
          } catch (addError) {
            console.error('Error adding network:', addError);
            return false;
          }
        } else {
          console.error('Error switching network:', switchError);
          return false;
        }
      }
      
      // Update current network
      this._currentNetwork = networkId;
      
      // If connected, reinitialize contract with new network
      if (this._connectionState.isConnected) {
        this.initializeContract();
      }
      
      return true;
    } catch (error) {
      console.error('Error switching network:', error);
      return false;
    }
  }
  
  /**
   * Get the contract address for the current network
   */
  private getContractAddressForNetwork(): string {
    return VAULT_CONTRACT_ADDRESS[this._currentNetwork as keyof typeof VAULT_CONTRACT_ADDRESS];
  }
  
  /**
   * Get network name from chain ID
   */
  private getNetworkName(chainId: number): string {
    const network = Object.values(NETWORKS).find(net => net.chainId === chainId);
    return network ? network.name : `Unknown (${chainId})`;
  }
  
  /**
   * Handle chain changed event
   */
  private async handleChainChanged(chainIdHex: string) {
    console.log(`Chain changed to ${chainIdHex}`);
    
    if (this._connectionState.isConnected) {
      // Force refresh
      window.location.reload();
    }
  }
  
  /**
   * Handle accounts changed event
   */
  private async handleAccountsChanged(accounts: string[]) {
    if (accounts.length === 0) {
      // User disconnected
      this.disconnect();
    } else if (this._connectionState.isConnected && 
               this._connectionState.address !== accounts[0]) {
      // Account switched
      console.log(`Account changed to ${accounts[0]}`);
      // Force refresh
      window.location.reload();
    }
  }
}

// Initialize and export the singleton instance
export const ethereumService = new EthereumService();

// Add window.ethereum type
// This is a simplified interface for MetaMask's Ethereum provider
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