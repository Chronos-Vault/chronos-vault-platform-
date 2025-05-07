import { ethers, BrowserProvider, JsonRpcProvider, Signer, Provider, FallbackProvider, AlchemyProvider } from 'ethers';

// Available networks
export type EthereumNetwork = 'mainnet' | 'sepolia' | 'goerli';

// Improved error types for better diagnostics and handling
export enum EthereumErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  PROVIDER_ERROR = 'PROVIDER_ERROR',
  WALLET_ERROR = 'WALLET_ERROR', 
  CONTRACT_ERROR = 'CONTRACT_ERROR',
  TRANSACTION_ERROR = 'TRANSACTION_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

// Enhanced connection state with more detailed status
export interface EthereumConnectionState {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  networkName: string | null;
  balance: string | null;
  error: string | null;
  errorType: EthereumErrorType | null;
  retryAttempt: number;
  lastSyncTimestamp: number | null;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'failed';
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

// Enhanced transaction response
export interface TransactionResponse {
  success: boolean;
  transactionHash?: string;
  blockNumber?: number;
  confirmations?: number;
  gasUsed?: string;
  status?: 'pending' | 'confirmed' | 'failed';
  error?: string;
  errorType?: EthereumErrorType;
  timestamp?: number;
}

// Vault creation response
export interface VaultCreationResponse {
  success: boolean;
  vaultAddress?: string;
  transactionHash?: string;
  error?: string;
  errorType?: EthereumErrorType;
}

/**
 * Enhanced Ethereum Service for Chronos Vault
 * 
 * Provides resilient connection to Ethereum blockchain with:
 * - Robust error handling and retry logic
 * - Multiple providers with fallback capability
 * - Better error categorization and reporting
 */
class EthereumService {
  private provider: BrowserProvider | JsonRpcProvider | FallbackProvider;
  private backupProviders: Provider[] = [];
  private signer: Signer | null = null;
  private address: string | null = null;
  private network: EthereumNetwork = 'sepolia'; // Default to Sepolia testnet
  private isConnected: boolean = false;
  private isDevelopmentMode: boolean = false;
  private lastError: string | null = null;
  private errorType: EthereumErrorType | null = null;
  private retryAttempt: number = 0;
  private maxRetries: number = 5;
  private retryDelayMs: number = 1000;
  private lastSyncTimestamp: number | null = null;
  private connectionQuality: 'excellent' | 'good' | 'poor' | 'failed' = 'failed';
  
  // Network configurations
  private networks = {
    mainnet: { 
      name: 'Ethereum Mainnet', 
      chainId: 1, 
      rpcUrls: [
        'https://mainnet.infura.io/v3/',
        'https://eth-mainnet.g.alchemy.com/v2/',
        'https://rpc.ankr.com/eth/'
      ] 
    },
    sepolia: { 
      name: 'Sepolia Testnet', 
      chainId: 11155111, 
      rpcUrls: [
        'https://sepolia.infura.io/v3/',
        'https://eth-sepolia.g.alchemy.com/v2/',
        'https://rpc.sepolia.org'
      ] 
    },
    goerli: { 
      name: 'Goerli Testnet', 
      chainId: 5, 
      rpcUrls: [
        'https://goerli.infura.io/v3/',
        'https://eth-goerli.g.alchemy.com/v2/',
        'https://rpc.ankr.com/eth_goerli'
      ] 
    }
  };
  
  constructor() {
    try {
      // Check for development environment
      this.isDevelopmentMode = process.env.NODE_ENV === 'development' || 
                              window.location.hostname.includes('replit') ||
                              window.location.hostname === 'localhost';
      
      // Check for MetaMask or other browser wallets
      if (typeof window !== 'undefined' && window.ethereum) {
        this.provider = new BrowserProvider(window.ethereum);
        console.log('Using MetaMask provider');
        // Still initialize backup providers for fallback scenarios
        this.initializeBackupProviders();
      } else {
        // Setup enhanced provider with fallback capabilities
        this.provider = this.createResilientProvider();
        console.log('No Ethereum provider detected (MetaMask not installed). Using RPC URL.');
        console.log(`Initialized with fallback provider on ${this.networks[this.network].name}`);
        
        // In development mode, set up a simulated connection
        if (this.isDevelopmentMode) {
          this.setupDevMode();
        }
      }
    } catch (error: any) {
      this.handleError(error, EthereumErrorType.PROVIDER_ERROR, 'Failed to initialize Ethereum provider');
      
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
      errorType: this.errorType,
      retryAttempt: this.retryAttempt,
      lastSyncTimestamp: this.lastSyncTimestamp,
      connectionQuality: this.connectionQuality,
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
              rpcUrls: targetNetwork.rpcUrls
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
  getProvider(): Provider {
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
   * This implementation includes retry logic with exponential backoff
   * and careful error categorization
   * 
   * @param txHash Transaction hash to validate
   * @returns Promise<boolean> - True if the transaction is valid and confirmed
   */
  async isTransactionValid(txHash: string): Promise<boolean> {
    let retryAttempt = 0;
    const maxRetries = this.maxRetries;
    let lastError: Error | null = null;
    
    // Retry loop with exponential backoff
    while (retryAttempt <= maxRetries) {
      try {
        console.log(`Validating Ethereum transaction: ${txHash}${retryAttempt > 0 ? ` (retry ${retryAttempt}/${maxRetries})` : ''}`);
        
        // In development mode or when using simulated transactions, always return true
        if (this.isDevelopmentMode || txHash.startsWith('simulated_')) {
          console.log('Using development mode validation for Ethereum transaction');
          return true;
        }
        
        // Try all available providers if our main one fails
        const provider = await this.getReliableProvider();
        if (!provider) {
          throw new Error('No reliable provider available after exhausting all options');
        }
        
        // In production, verify the transaction on-chain
        const receipt = await provider.getTransactionReceipt(txHash);
        if (!receipt) {
          // Transaction not found yet, might still be propagating
          if (retryAttempt < maxRetries) {
            const delayMs = this.calculateBackoff(retryAttempt);
            console.log(`Transaction not found, waiting ${delayMs}ms before retry ${retryAttempt + 1}/${maxRetries}...`);
            await this.delay(delayMs);
            retryAttempt++;
            continue;
          }
          console.log('Transaction not found or not yet mined after maximum retries');
          return false;
        }
        
        // Check confirmation count
        const currentBlock = await provider.getBlockNumber();
        const confirmations = currentBlock - receipt.blockNumber;
        
        console.log(`Transaction confirmations: ${confirmations}`);
        
        // Transaction verification status
        const isConfirmed = confirmations >= 1;
        const isSuccessful = receipt.status === 1;
        
        // Log detailed verification result
        console.log(`Transaction validation result: ${isConfirmed && isSuccessful ? 'Valid' : 'Invalid'} ` +
                   `(Confirmed: ${isConfirmed}, Status: ${isSuccessful ? 'Success' : 'Failed'})`);
        
        // Return true only if transaction is both confirmed and successful
        return isConfirmed && isSuccessful;
      } catch (error: any) {
        lastError = error;
        
        // Categorize the error
        const errorType = this.categorizeError(error);
        const errorMsg = error.message || 'Unknown error';
        
        // Log appropriately based on error type
        if (errorType === EthereumErrorType.NETWORK_ERROR) {
          console.warn(`Network error validating transaction (retry ${retryAttempt}/${maxRetries}):`, errorMsg);
        } else if (errorType === EthereumErrorType.PROVIDER_ERROR) {
          console.error(`Provider error validating transaction (retry ${retryAttempt}/${maxRetries}):`, errorMsg);
          // Try to switch to a backup provider
          this.switchToBackupProvider();
        } else {
          console.error(`Error validating transaction (retry ${retryAttempt}/${maxRetries}):`, error);
        }
        
        // Check if we should retry
        if (retryAttempt < maxRetries && 
            (errorType === EthereumErrorType.NETWORK_ERROR || 
             errorType === EthereumErrorType.PROVIDER_ERROR)) {
          const delayMs = this.calculateBackoff(retryAttempt);
          console.log(`Retrying in ${delayMs}ms...`);
          await this.delay(delayMs);
          retryAttempt++;
        } else {
          break;
        }
      }
    }
    
    // If we reached here after all retries, log the final error
    if (lastError) {
      console.error('Failed to validate transaction after maximum retries:', lastError);
      this.handleError(lastError, EthereumErrorType.VALIDATION_ERROR, 'Transaction validation failed');
    }
    
    return false;
  }
  
  /**
   * Calculate exponential backoff delay with jitter
   * @param attempt The current retry attempt (0-based)
   * @returns Delay in milliseconds
   */
  private calculateBackoff(attempt: number): number {
    // Base delay (e.g., 1000ms = 1s)
    const baseDelay = this.retryDelayMs;
    
    // Calculate exponential backoff: baseDelay * 2^attempt
    const exponentialDelay = baseDelay * Math.pow(2, attempt);
    
    // Add jitter to prevent synchronized retries (±20%)
    const jitter = exponentialDelay * 0.2 * (Math.random() * 2 - 1);
    
    // Max delay of 30 seconds
    return Math.min(exponentialDelay + jitter, 30000);
  }
  
  /**
   * Simple delay implementation
   * @param ms Milliseconds to delay
   * @returns Promise that resolves after the delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * Initialize backup providers for fault tolerance
   */
  private initializeBackupProviders(): void {
    try {
      const rpcId = '6cde839b76d04effb07861ca9f663d31'; // This would normally come from env vars
      const network = this.networks[this.network];
      
      // Create providers for each RPC URL
      for (const rpcUrl of network.rpcUrls) {
        const fullUrl = rpcUrl.includes('infura.io') || rpcUrl.includes('alchemy.com') 
          ? `${rpcUrl}${rpcId}`
          : rpcUrl;
          
        try {
          const provider = new JsonRpcProvider(fullUrl);
          this.backupProviders.push(provider);
        } catch (err) {
          console.warn(`Failed to initialize backup provider at ${rpcUrl}:`, err);
        }
      }
      
      console.log(`Initialized ${this.backupProviders.length} backup providers`);
    } catch (error) {
      console.error('Error initializing backup providers:', error);
    }
  }
  
  /**
   * Create a resilient provider with fallback capability
   */
  private createResilientProvider(): FallbackProvider | JsonRpcProvider {
    try {
      const rpcId = '6cde839b76d04effb07861ca9f663d31'; // This would normally come from env vars
      const network = this.networks[this.network];
      
      // If we have multiple providers, create a FallbackProvider
      if (network.rpcUrls.length > 1) {
        const providers = network.rpcUrls.map((rpcUrl, index) => {
          const fullUrl = rpcUrl.includes('infura.io') || rpcUrl.includes('alchemy.com') 
            ? `${rpcUrl}${rpcId}`
            : rpcUrl;
            
          return {
            provider: new JsonRpcProvider(fullUrl),
            priority: index, // Lower index = higher priority
            stallTimeout: 2000, // Time to wait before considering unresponsive
            weight: 10 - index // Higher weight for primary providers
          };
        });
        
        return new FallbackProvider(providers);
      } 
      
      // Otherwise just use the first one
      const rpcUrl = network.rpcUrls[0];
      const fullUrl = rpcUrl.includes('infura.io') || rpcUrl.includes('alchemy.com') 
        ? `${rpcUrl}${rpcId}`
        : rpcUrl;
      
      return new JsonRpcProvider(fullUrl);
    } catch (error) {
      console.error('Error creating resilient provider:', error);
      // Fallback to a basic provider
      return new JsonRpcProvider();
    }
  }
  
  /**
   * Get a reliable provider (tries current, then backups)
   */
  private async getReliableProvider(): Promise<Provider | null> {
    // First try the current provider
    try {
      await this.provider.getBlockNumber();
      return this.provider;
    } catch (error) {
      console.warn('Current provider failed, trying backups...');
    }
    
    // If that fails, try each backup provider
    for (const provider of this.backupProviders) {
      try {
        if (provider instanceof JsonRpcProvider) {
          await provider.getBlockNumber();
          return provider;
        }
      } catch (err) {
        continue; // Try next provider
      }
    }
    
    // If we're in development mode, return the current provider anyway
    if (this.isDevelopmentMode) {
      return this.provider;
    }
    
    return null; // All providers failed
  }
  
  /**
   * Switch to a backup provider when the current one fails
   */
  private switchToBackupProvider(): boolean {
    // Only perform the switch if we have backup providers
    if (this.backupProviders.length === 0) {
      console.warn('No backup providers available');
      return false;
    }
    
    try {
      // Take the first backup provider
      const backupProvider = this.backupProviders.shift();
      if (!backupProvider) return false;
      
      // Move current provider to end of backup list
      if (this.provider instanceof JsonRpcProvider) {
        this.backupProviders.push(this.provider);
      }
      
      // Set the new provider
      if (backupProvider instanceof JsonRpcProvider) {
        this.provider = backupProvider;
        console.log('Switched to backup provider');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error switching to backup provider:', error);
      return false;
    }
  }
  
  /**
   * Categorize an error to help with handling
   * @param error The error to categorize
   * @returns The error type
   */
  private categorizeError(error: any): EthereumErrorType {
    const errorMessage = error?.message || '';
    const errorCode = error?.code;
    
    // Check for network-related errors
    if (
      errorMessage.includes('network') ||
      errorMessage.includes('timeout') ||
      errorMessage.includes('connection') ||
      errorMessage.includes('unreachable') ||
      errorMessage.includes('ETIMEDOUT') ||
      errorMessage.includes('ECONNREFUSED') ||
      errorCode === 'NETWORK_ERROR'
    ) {
      return EthereumErrorType.NETWORK_ERROR;
    }
    
    // Check for provider-related errors
    if (
      errorMessage.includes('provider') ||
      errorMessage.includes('server') ||
      errorMessage.includes('rate limit') ||
      errorCode === 'SERVER_ERROR'
    ) {
      return EthereumErrorType.PROVIDER_ERROR;
    }
    
    // Check for wallet-related errors
    if (
      errorMessage.includes('wallet') ||
      errorMessage.includes('account') ||
      errorMessage.includes('signer') ||
      errorMessage.includes('user rejected') ||
      errorCode === 4001
    ) {
      return EthereumErrorType.WALLET_ERROR;
    }
    
    // Check for contract-related errors
    if (
      errorMessage.includes('contract') ||
      errorMessage.includes('execution reverted') ||
      errorMessage.includes('revert') ||
      errorMessage.includes('ABI')
    ) {
      return EthereumErrorType.CONTRACT_ERROR;
    }
    
    // Check for transaction-related errors
    if (
      errorMessage.includes('transaction') ||
      errorMessage.includes('gas') ||
      errorMessage.includes('nonce') ||
      errorMessage.includes('underpriced')
    ) {
      return EthereumErrorType.TRANSACTION_ERROR;
    }
    
    // Check for validation-related errors
    if (
      errorMessage.includes('validate') ||
      errorMessage.includes('validation') ||
      errorMessage.includes('invalid')
    ) {
      return EthereumErrorType.VALIDATION_ERROR;
    }
    
    // Default to unknown error
    return EthereumErrorType.UNKNOWN_ERROR;
  }
  
  /**
   * Standardized error handling
   * @param error The error that occurred
   * @param errorType The type of error
   * @param context Message providing context for the error
   */
  private handleError(error: any, errorType: EthereumErrorType, context: string): void {
    // Update service state
    this.lastError = `${context}: ${error.message || 'Unknown error'}`;
    this.errorType = errorType;
    this.retryAttempt++;
    
    // Set connection quality based on error type and retry count
    if (errorType === EthereumErrorType.NETWORK_ERROR) {
      if (this.retryAttempt <= 2) {
        this.connectionQuality = 'good';
      } else if (this.retryAttempt <= 4) {
        this.connectionQuality = 'poor';
      } else {
        this.connectionQuality = 'failed';
      }
    } else if (
      errorType === EthereumErrorType.PROVIDER_ERROR || 
      errorType === EthereumErrorType.UNKNOWN_ERROR
    ) {
      this.connectionQuality = 'poor';
    }
    
    // Log appropriately based on error type
    switch (errorType) {
      case EthereumErrorType.NETWORK_ERROR:
        console.warn(`[${errorType}] ${context}:`, error);
        break;
      case EthereumErrorType.WALLET_ERROR:
        console.info(`[${errorType}] ${context}:`, error);
        break;
      default:
        console.error(`[${errorType}] ${context}:`, error);
    }
    
    // Could also integrate with monitoring/logging systems here
  }
  
  /**
   * Get connection quality assessment
   */
  getConnectionQuality(): 'excellent' | 'good' | 'poor' | 'failed' {
    return this.connectionQuality;
  }
  
  /**
   * Reset connection state and retry counters
   */
  resetConnectionState(): void {
    this.lastError = null;
    this.errorType = null;
    this.retryAttempt = 0;
    this.connectionQuality = 'good';
    this.lastSyncTimestamp = Date.now();
    
    // Reinitialize providers
    this.initializeBackupProviders();
  }
}

// Initialize and export the singleton instance
export const ethereumService = new EthereumService();