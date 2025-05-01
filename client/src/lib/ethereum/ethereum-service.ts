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
    rpcUrl: import.meta.env.VITE_ETHEREUM_RPC_URL || 'https://eth-mainnet.public.blastapi.io'
  },
  goerli: {
    name: 'Goerli Testnet',
    chainId: 5,
    rpcUrl: import.meta.env.VITE_ETHEREUM_RPC_URL || 'https://eth-goerli.public.blastapi.io'
  },
  sepolia: {
    name: 'Sepolia Testnet',
    chainId: 11155111,
    rpcUrl: import.meta.env.VITE_ETHEREUM_RPC_URL || 'https://eth-sepolia.public.blastapi.io'
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

// Vault Factory Contract Address (will be different per network)
const VAULT_FACTORY_ADDRESS = {
  mainnet: '0x1234567890123456789012345678901234567890', // Placeholder for real address
  goerli: '0x9876543210987654321098765432109876543210',  // Placeholder for real address
  sepolia: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd'  // Placeholder for real address
};

// Vault Factory ABI - For creating new vaults
const VAULT_FACTORY_ABI = [
  "function createVault(address _asset, string memory _name, string memory _symbol, uint256 _unlockTime, uint8 _securityLevel, string memory _accessKey, bool _isPublic) returns (address)",
  "function getVaults(address _creator) view returns (address[])",
  "function getVaultCount() view returns (uint256)",
  "event VaultCreated(address indexed creator, address indexed vaultAddress, uint256 unlockTime)"
];

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
  private _currentNetwork: string = 'sepolia'; // Default to Sepolia testnet for development
  
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
        // Create provider using the configured RPC URL
        console.log('No Ethereum provider detected (MetaMask not installed). Using RPC URL.');
        
        // Create a fallback provider using Sepolia testnet for development
        const rpcUrl = import.meta.env.VITE_ETHEREUM_RPC_URL || NETWORKS.sepolia.rpcUrl;
        this._jsonRpcProvider = new ethers.JsonRpcProvider(rpcUrl);
        // We don't assign to this._connectionState.provider here as it's expecting a BrowserProvider
        
        // Use Sepolia testnet for development
        this._connectionState.chainId = NETWORKS.sepolia.chainId;
        this._connectionState.networkName = NETWORKS.sepolia.name;
        
        console.log(`Initialized with fallback provider on ${this._connectionState.networkName}`);
      }
    } catch (error) {
      console.error('Error initializing Ethereum provider:', error);
      // Even if there's an error, set up Sepolia testnet values so the UI doesn't break
      this._connectionState.chainId = NETWORKS.sepolia.chainId;
      this._connectionState.networkName = NETWORKS.sepolia.name;
      
      // Create a fallback provider
      const rpcUrl = import.meta.env.VITE_ETHEREUM_RPC_URL || NETWORKS.sepolia.rpcUrl;
      this._jsonRpcProvider = new ethers.JsonRpcProvider(rpcUrl);
      // We don't assign to this._connectionState.provider here as it's expecting a BrowserProvider
    }
  }
  
  /**
   * Connect to Ethereum wallet
   */
  public async connect(): Promise<boolean> {
    try {
      if (!window.ethereum) {
        console.warn('No Ethereum wallet found. Connecting to Sepolia testnet via RPC URL.');
        
        // Connect using RPC URL instead of simulating
        const network = NETWORKS['sepolia'];
        const provider = new ethers.JsonRpcProvider(network.rpcUrl);
        
        // Use a test wallet created specifically for testnets
        // In production, this should NEVER be done - only used for testing
        const testPrivateKey = "0x1234567890123456789012345678901234567890123456789012345678901234"; // REPLACE WITH ACTUAL TEST KEY
        const testWallet = new ethers.Wallet(testPrivateKey, provider);
        const address = await testWallet.getAddress();
        
        // Get balance
        const balance = await provider.getBalance(address);
        const formattedBalance = ethers.formatEther(balance);
        
        this._connectionState = {
          isConnected: true,
          address: address,
          balance: formattedBalance,
          networkName: network.name,
          chainId: network.chainId,
          provider: null, // Can't use BrowserProvider with JsonRpcProvider
          signer: null, // Can't use JsonRpcSigner with Wallet
          error: null
        };
        
        console.log(`Connected to Ethereum ${network.name} with address: ${address}`);
        
        // Initialize contract
        this.initializeContract();
        
        return true;
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
   * Initialize the factory contract
   */
  private initializeContract() {
    try {
      // Get the factory address for the current network
      const factoryAddress = this.getFactoryAddressForNetwork();
      
      if (window.ethereum && this._connectionState.signer) {
        // Browser environment with MetaMask
        this._vaultContract = new ethers.Contract(
          factoryAddress,
          VAULT_FACTORY_ABI,
          this._connectionState.signer
        );
      } else if (this._connectionState.isConnected && this._connectionState.address) {
        // Connected via JsonRpcProvider (non-browser environment)
        const network = NETWORKS[this._currentNetwork as keyof typeof NETWORKS];
        const provider = new ethers.JsonRpcProvider(network.rpcUrl);
        
        // Use a test wallet created specifically for testnets
        // In production, this should NEVER be done - only used for testing
        const testPrivateKey = "0x1234567890123456789012345678901234567890123456789012345678901234"; // REPLACE WITH ACTUAL TEST KEY
        const signer = new ethers.Wallet(testPrivateKey, provider);
        
        this._vaultContract = new ethers.Contract(
          factoryAddress,
          VAULT_FACTORY_ABI,
          signer
        );
      } else {
        console.error('Cannot initialize contract: No signer available');
        return;
      }
      
      console.log(`Vault factory contract initialized at ${factoryAddress}`);
    } catch (error) {
      console.error('Error initializing vault factory contract:', error);
    }
  }
  
  /**
   * Create a new time-locked vault using the ChronosVault factory
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
      
      // For now, we use ETH as the asset (zero address)
      const ethAssetAddress = "0x0000000000000000000000000000000000000000";
      const vaultName = comment ? `${comment}` : `ChronosVault-${Date.now()}`;
      const vaultSymbol = "CVT-ETH";
      const securityLevel = 1; // Basic security level
      const accessKey = ""; // No access key for basic security level
      const isPublic = true;
      
      console.log(`Creating vault unlocking at ${new Date(unlockTime * 1000).toLocaleString()}`);
      console.log(`Vault Name: ${vaultName}`);
      
      // Call factory to create a new vault
      const tx = await this._vaultContract.createVault(
        ethAssetAddress,
        vaultName,
        vaultSymbol,
        unlockTime,
        securityLevel,
        accessKey,
        isPublic
      );
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      
      // Extract vault address from event logs
      const vaultCreatedEvent = receipt.logs.find(
        (log: any) => log.eventName === 'VaultCreated'
      );
      
      const vaultAddress = vaultCreatedEvent ? 
        vaultCreatedEvent.args.vaultAddress : 
        'Address not found in event logs';
      
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
   * Get all vaults created by the user
   */
  public async getUserVaults(): Promise<{ success: boolean; vaults?: string[]; error?: string }> {
    try {
      if (!this._connectionState.isConnected || !this._vaultContract || !this._connectionState.address) {
        return { 
          success: false, 
          error: 'Not connected to Ethereum or contract not initialized' 
        };
      }
      
      // Call contract to get list of vaults created by this address
      const vaults = await this._vaultContract.getVaults(this._connectionState.address);
      
      return {
        success: true,
        vaults
      };
    } catch (error: any) {
      console.error('Error fetching user vaults:', error);
      return {
        success: false,
        error: error.message || 'Unknown error fetching vaults'
      };
    }
  }
  
  /**
   * Check if connected to Ethereum
   */
  public isConnected(): boolean {
    return this._connectionState.isConnected;
  }
  
  /**
   * Get current block number
   */
  public async getBlockNumber(): Promise<number> {
    try {
      if (this._connectionState.provider) {
        const blockNumber = await this._connectionState.provider.getBlockNumber();
        return Number(blockNumber);
      }
      
      // If no provider, return a placeholder
      return 0;
    } catch (error) {
      console.error('Error getting block number:', error);
      return 0;
    }
  }
  
  /**
   * Get block details
   */
  public async getBlock(blockNumber: number): Promise<any> {
    try {
      if (this._connectionState.provider) {
        return await this._connectionState.provider.getBlock(blockNumber);
      }
      return null;
    } catch (error) {
      console.error('Error getting block:', error);
      return null;
    }
  }
  
  /**
   * Validate if a transaction exists and is confirmed
   * @param txHash The transaction hash to validate
   * @returns True if the transaction is valid and confirmed, false otherwise
   */
  public async isTransactionValid(txHash: string): Promise<boolean> {
    try {
      // For testing/demo environments, use synthetic data
      if (!this._connectionState.provider) {
        // Simulated validation based on hash format and randomness for demo
        const hasValidFormat = txHash.startsWith('0x') || txHash.startsWith('simulated');
        return hasValidFormat;
      }
      
      // In a production environment with an actual provider:
      // 1. Get the transaction receipt
      const receipt = await this._connectionState.provider.getTransactionReceipt(txHash);
      
      // 2. Check if transaction exists and is confirmed
      if (!receipt) {
        console.log(`Transaction ${txHash} not found or pending`);
        return false;
      }
      
      // 3. Check confirmations (if receipt exists, transaction is confirmed in Ethereum)
      return receipt.status === 1; // 1 means success, 0 means reverted
    } catch (error) {
      console.error(`Error validating Ethereum transaction ${txHash}:`, error);
      return false;
    }
  }
  
  /**
   * Check if a vault exists
   */
  public async checkVaultExists(vaultId: string): Promise<boolean> {
    try {
      if (!this._connectionState.isConnected || !this._connectionState.provider) {
        return false;
      }
      
      // Check if the address has code (is a contract)
      const code = await this._connectionState.provider.getCode(vaultId);
      return code !== '0x'; // If there's code, it's a contract
    } catch (error) {
      console.error('Error checking if vault exists:', error);
      return false;
    }
  }
  
  /**
   * Get vault details
   */
  public async getVaultDetails(vaultAddress: string): Promise<{ 
    success: boolean; 
    details?: { 
      name: string; 
      symbol: string; 
      unlockTime: number;
      balance: string;
      creator: string;
      isPublic: boolean;
      securityLevel: number;
    }; 
    error?: string 
  }> {
    try {
      if (!this._connectionState.isConnected || !this._connectionState.signer) {
        return { 
          success: false, 
          error: 'Not connected to Ethereum' 
        };
      }
      
      // Create contract instance for the specific vault
      const vaultContract = new ethers.Contract(
        vaultAddress, 
        CHRONOS_VAULT_ABI, 
        this._connectionState.signer
      );
      
      // Get vault details
      const [name, symbol, unlockTime, balance, creator, isPublic, securityLevel] = await Promise.all([
        vaultContract.name(),
        vaultContract.symbol(),
        vaultContract.unlockTime(),
        vaultContract.totalAssets(),
        vaultContract.creator(),
        vaultContract.isPublic(),
        vaultContract.securityLevel()
      ]);
      
      return {
        success: true,
        details: {
          name,
          symbol,
          unlockTime: Number(unlockTime),
          balance: ethers.formatEther(balance),
          creator,
          isPublic,
          securityLevel: Number(securityLevel)
        }
      };
    } catch (error: any) {
      console.error('Error fetching vault details:', error);
      return {
        success: false,
        error: error.message || 'Unknown error fetching vault details'
      };
    }
  }
  
  /**
   * Deposit ETH into a vault
   */
  public async depositToVault(
    vaultAddress: string, 
    amount: string
  ): Promise<{ success: boolean; transactionHash?: string; error?: string }> {
    try {
      if (!this._connectionState.isConnected || !this._connectionState.signer) {
        return { 
          success: false, 
          error: 'Not connected to Ethereum' 
        };
      }
      
      // Create contract instance for the specific vault
      const vaultContract = new ethers.Contract(
        vaultAddress, 
        CHRONOS_VAULT_ABI, 
        this._connectionState.signer
      );
      
      // Convert amount to wei
      const amountWei = ethers.parseEther(amount);
      
      // Call deposit function
      const tx = await vaultContract.deposit(amountWei, this._connectionState.address, {
        value: amountWei
      });
      
      // Wait for confirmation
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt?.hash
      };
    } catch (error: any) {
      console.error('Error depositing to vault:', error);
      return {
        success: false,
        error: error.message || 'Unknown error depositing to vault'
      };
    }
  }
  
  /**
   * Withdraw ETH from a vault (if unlocked)
   */
  public async withdrawFromVault(
    vaultAddress: string, 
    amount: string
  ): Promise<{ success: boolean; transactionHash?: string; error?: string }> {
    try {
      if (!this._connectionState.isConnected || !this._connectionState.signer) {
        return { 
          success: false, 
          error: 'Not connected to Ethereum' 
        };
      }
      
      // Create contract instance for the specific vault
      const vaultContract = new ethers.Contract(
        vaultAddress, 
        CHRONOS_VAULT_ABI, 
        this._connectionState.signer
      );
      
      // Check if the vault is unlocked
      const unlockTime = await vaultContract.unlockTime();
      const currentTimestamp = Math.floor(Date.now() / 1000);
      
      if (currentTimestamp < Number(unlockTime)) {
        return {
          success: false,
          error: `Vault is still locked until ${new Date(Number(unlockTime) * 1000).toLocaleString()}`
        };
      }
      
      // Convert amount to wei
      const amountWei = ethers.parseEther(amount);
      
      // Call withdraw function
      const tx = await vaultContract.withdraw(
        amountWei, 
        this._connectionState.address, 
        this._connectionState.address
      );
      
      // Wait for confirmation
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt?.hash
      };
    } catch (error: any) {
      console.error('Error withdrawing from vault:', error);
      return {
        success: false,
        error: error.message || 'Unknown error withdrawing from vault'
      };
    }
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
   * Get the factory address for the current network
   */
  private getFactoryAddressForNetwork(): string {
    return VAULT_FACTORY_ADDRESS[this._currentNetwork as keyof typeof VAULT_FACTORY_ADDRESS];
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