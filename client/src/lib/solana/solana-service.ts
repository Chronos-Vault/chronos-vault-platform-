import { Connection, Keypair, PublicKey, clusterApiUrl, Transaction, SystemProgram, LAMPORTS_PER_SOL, SendOptions } from '@solana/web3.js';
import { Buffer } from 'buffer';
import { 
  SolanaConnectionStatus, 
  SolanaCluster, 
  SolanaWalletInfo,
  SolanaWallet,
  SolanaErrorType,
  ConnectionQuality,
  EnhancedSolanaConnectionState,
  SolanaRpcEndpoint,
  SolanaTransactionVerification
} from '../../types/solana-common';

// Re-export types
export type { SolanaWallet };

// Default RPC endpoints for different networks
const DEFAULT_RPC_ENDPOINTS: Record<SolanaCluster, string[]> = {
  [SolanaCluster.MAINNET]: [
    'https://api.mainnet-beta.solana.com',
    'https://solana-api.projectserum.com',
    'https://rpc.ankr.com/solana'
  ],
  [SolanaCluster.DEVNET]: [
    'https://api.devnet.solana.com',
    'https://devnet.solana.rpcpool.com'
  ],
  [SolanaCluster.TESTNET]: [
    'https://api.testnet.solana.com'
  ]
};

// Solana connection state
export interface SolanaConnectionState {
  isConnected: boolean;
  wallet: SolanaWallet | null;
  balance: number | null;
  network: SolanaCluster;
  error: string | null;
  developmentMode: boolean;
}

// Transaction response
export interface SolanaTransactionResponse {
  success: boolean;
  signature?: string;
  error?: string;
}

// Vault creation parameters
export interface SolanaVaultCreationParams {
  unlockTime: number;
  amount: string;
  recipient?: string;
  comment?: string;
  securityLevel?: number;
}

// Vault creation response
export interface SolanaVaultCreationResponse {
  success: boolean;
  vaultAddress?: string;
  error?: string;
}

/**
 * Solana Service for Chronos Vault
 * 
 * Provides connection to Solana blockchain with enhanced reliability features:
 * - Multiple RPC endpoint support with failover
 * - Retry mechanism with exponential backoff
 * - Detailed error categorization and reporting
 * - Circuit breaker pattern to prevent cascading failures
 * - Connection quality monitoring
 */
class SolanaService {
  // Basic connection properties
  private connection: Connection | null = null;
  private keypair: Keypair | null = null;
  private isConnected: boolean = false;
  private network: SolanaCluster = SolanaCluster.DEVNET;
  private isDevelopmentMode: boolean = false;
  
  // Enhanced reliability properties
  private lastError: string | null = null;
  private errorType: SolanaErrorType | null = null;
  private endpoints: SolanaRpcEndpoint[] = [];
  private currentEndpointIndex: number = 0;
  private connectionQuality: ConnectionQuality = 'good';
  private lastSyncTimestamp: number = 0;
  private retryAttempt: number = 0;
  private maxRetries: number = 5;
  private retryDelayMs: number = 1000; // Base delay of 1 second
  private circuitBreakerOpen: boolean = false;
  private circuitBreakerResetTimeoutId: number | null = null;
  private errorThreshold: number = 5;
  private consecutiveErrors: number = 0;
  private circuitBreakerTimeoutMs: number = 30000; // 30 seconds
  
  constructor() {
    // Check for development environment
    this.isDevelopmentMode = process.env.NODE_ENV === 'development' || 
                           window.location.hostname.includes('replit') ||
                           window.location.hostname === 'localhost';
    
    // Initialize endpoints
    this.initializeEndpoints();
    
    // Initialize connection
    this.initialize();
  }
  
  /**
   * Initialize RPC endpoints
   */
  private initializeEndpoints(): void {
    // Start with default endpoints for the current network
    this.endpoints = DEFAULT_RPC_ENDPOINTS[this.network].map((url, index) => ({
      url,
      priority: index,
      weight: 10 - index, // Give higher weight to earlier endpoints
      isHealthy: true,
      lastChecked: 0
    }));
    
    console.log(`Initialized ${this.endpoints.length} Solana RPC endpoints for ${this.network}`);
  }
  
  /**
   * Check health of all endpoints
   */
  private async checkEndpointsHealth(): Promise<void> {
    for (let i = 0; i < this.endpoints.length; i++) {
      const endpoint = this.endpoints[i];
      const startTime = performance.now();
      
      try {
        const connection = new Connection(endpoint.url, 'confirmed');
        
        // Add timeout for the request to avoid hanging
        const timeout = new Promise<null>((_, reject) => {
          setTimeout(() => reject(new Error('Connection timeout')), 5000);
        });
        
        // Race the getVersion call with a timeout
        await Promise.race([
          connection.getVersion(),
          timeout
        ]);
        
        const endTime = performance.now();
        endpoint.responseTime = endTime - startTime;
        endpoint.isHealthy = true;
        
        // Update endpoint health status
        this.endpoints[i] = {
          ...endpoint,
          lastChecked: Date.now()
        };
        
        console.log(`Solana endpoint ${endpoint.url} is healthy (${endpoint.responseTime.toFixed(0)}ms)`);
      } catch (error) {
        endpoint.isHealthy = false;
        endpoint.lastChecked = Date.now();
        
        console.warn(`Solana endpoint ${endpoint.url} is unhealthy:`, error);
      }
    }
    
    // Sort endpoints by health and response time
    this.endpoints.sort((a, b) => {
      // First prioritize healthy endpoints
      if (a.isHealthy && !b.isHealthy) return -1;
      if (!a.isHealthy && b.isHealthy) return 1;
      
      // Both are either healthy or unhealthy, sort by response time (if available)
      if (a.responseTime && b.responseTime) {
        return a.responseTime - b.responseTime;
      }
      
      // Fall back to original priority
      return a.priority - b.priority;
    });
  }
  
  /**
   * Initialize Solana connection
   */
  private async initialize() {
    try {
      // Get best endpoint
      await this.checkEndpointsHealth();
      const bestEndpoint = this.getBestEndpoint();
      
      // Initialize connection using the best endpoint
      this.connection = new Connection(bestEndpoint, 'confirmed');
      
      console.log(`Connected to Solana ${this.network} at ${bestEndpoint}`);
      
      // For demo purposes, generate a new keypair
      // In production, this would be securely stored or derived from a wallet
      this.keypair = new Keypair();
      
      this.isConnected = true;
      this.connectionQuality = 'good';
      this.consecutiveErrors = 0;
      this.retryAttempt = 0;
      
      console.log(`Solana service initialized with ${this.network} for testnet development`);
    } catch (error: any) {
      console.error('Failed to initialize Solana service', error);
      this.isConnected = false;
      this.lastError = 'Failed to initialize Solana service: ' + (error.message || 'Unknown error');
      this.errorType = this.categorizeError(error);
      this.connectionQuality = 'failed';
      
      if (this.isDevelopmentMode) {
        this.setupDevMode();
      }
    }
  }
  
  /**
   * Get the best available endpoint URL
   */
  private getBestEndpoint(): string {
    // Get the first healthy endpoint or fall back to default
    const healthyEndpoint = this.endpoints.find(e => e.isHealthy);
    if (healthyEndpoint) {
      return healthyEndpoint.url;
    }
    
    // If no healthy endpoint found, return the first one with a warning
    console.warn('No healthy Solana RPC endpoints available, using first endpoint');
    return this.endpoints[0]?.url || clusterApiUrl(this.network);
  }
  
  /**
   * Set up development mode with simulated wallet
   */
  private setupDevMode(): void {
    // Create a keypair from a known seed for consistent development testing
    try {
      const seed = new Uint8Array(32).fill(1);
      this.keypair = Keypair.fromSeed(seed);
      this.isConnected = true;
      this.connectionQuality = 'excellent'; // Development mode is always "excellent"
      console.log('Solana running in development mode with simulated wallet:', this.keypair.publicKey.toString());
    } catch (error) {
      console.error('Failed to setup development mode', error);
    }
  }
  
  /**
   * Categorize errors for better error handling
   */
  private categorizeError(error: any): SolanaErrorType {
    if (!error) {
      return SolanaErrorType.UNKNOWN_ERROR;
    }
    
    // Convert error to string for pattern matching
    const errorStr = error.toString().toLowerCase();
    const errorMessage = error.message?.toLowerCase() || '';
    
    // Check for network connectivity errors
    if (
      errorStr.includes('network') || 
      errorStr.includes('connection') || 
      errorStr.includes('econnrefused') ||
      errorStr.includes('timeout') ||
      errorStr.includes('network request failed')
    ) {
      return SolanaErrorType.NETWORK_ERROR;
    }
    
    // Check for RPC errors
    if (
      errorStr.includes('rpc') || 
      errorStr.includes('server') ||
      errorStr.includes('response') ||
      errorMessage.includes('429') // Too many requests
    ) {
      // Check if it's rate limiting specifically
      if (
        errorMessage.includes('429') ||
        errorStr.includes('too many requests') ||
        errorStr.includes('rate limit')
      ) {
        return SolanaErrorType.RATE_LIMIT_ERROR;
      }
      
      return SolanaErrorType.RPC_ERROR;
    }
    
    // Check for wallet errors
    if (
      errorStr.includes('wallet') || 
      errorStr.includes('account') ||
      errorStr.includes('key') ||
      errorStr.includes('permission') ||
      errorStr.includes('unauthorized')
    ) {
      return SolanaErrorType.WALLET_ERROR;
    }
    
    // Check for program errors (smart contract issues)
    if (
      errorStr.includes('program') || 
      errorStr.includes('instruction') ||
      errorStr.includes('account constraint') ||
      errorStr.includes('insufficient funds')
    ) {
      return SolanaErrorType.PROGRAM_ERROR;
    }
    
    // Check for transaction errors
    if (
      errorStr.includes('transaction') || 
      errorStr.includes('signature') ||
      errorStr.includes('blockhash')
    ) {
      return SolanaErrorType.TRANSACTION_ERROR;
    }
    
    // Check for validation errors
    if (
      errorStr.includes('invalid') || 
      errorStr.includes('validation') ||
      errorStr.includes('not found') ||
      errorStr.includes('expected')
    ) {
      return SolanaErrorType.VALIDATION_ERROR;
    }
    
    // Default
    return SolanaErrorType.UNKNOWN_ERROR;
  }
  
  /**
   * Handle errors with proper tracking, reporting, and circuit breaking
   */
  private handleError(error: any, errorType: SolanaErrorType, context: string): void {
    // Update service state
    this.lastError = `${context}: ${error?.message || error?.toString() || 'Unknown error'}`;
    this.errorType = errorType;
    
    // Track errors for circuit breaker
    this.consecutiveErrors++;
    
    // Log appropriately based on error type
    switch (errorType) {
      case SolanaErrorType.NETWORK_ERROR:
      case SolanaErrorType.RPC_ERROR:
        console.warn(`Solana service ${errorType}:`, this.lastError);
        
        // Network and RPC errors might be temporary, decrease connection quality
        this.updateConnectionQuality('poor');
        break;
        
      case SolanaErrorType.RATE_LIMIT_ERROR:
        console.warn('Solana service rate limited:', this.lastError);
        
        // Rate limiting requires backing off
        this.updateConnectionQuality('poor');
        
        // Switch to a different endpoint
        this.switchToNextEndpoint();
        break;
        
      default:
        console.error(`Solana service ${errorType}:`, this.lastError);
        break;
    }
    
    // Check if we need to trip the circuit breaker
    if (this.consecutiveErrors >= this.errorThreshold) {
      this.tripCircuitBreaker();
    }
  }
  
  /**
   * Trip the circuit breaker to prevent more requests when there are persistent issues
   */
  private tripCircuitBreaker(): void {
    if (this.circuitBreakerOpen) {
      return; // Already open
    }
    
    console.warn('Solana service circuit breaker tripped after multiple consecutive errors');
    
    this.circuitBreakerOpen = true;
    this.updateConnectionQuality('failed');
    
    // Set timeout to reset circuit breaker
    if (this.circuitBreakerResetTimeoutId !== null) {
      window.clearTimeout(this.circuitBreakerResetTimeoutId);
    }
    
    this.circuitBreakerResetTimeoutId = window.setTimeout(() => {
      this.resetCircuitBreaker();
    }, this.circuitBreakerTimeoutMs);
  }
  
  /**
   * Reset the circuit breaker after timeout
   */
  private resetCircuitBreaker(): void {
    console.log('Solana service circuit breaker reset');
    
    this.circuitBreakerOpen = false;
    this.consecutiveErrors = 0;
    this.updateConnectionQuality('poor'); // Start with poor until proven otherwise
    
    // Try to reconnect
    this.initialize();
  }
  
  /**
   * Update connection quality based on service health
   */
  private updateConnectionQuality(quality: ConnectionQuality): void {
    if (this.connectionQuality !== quality) {
      console.log(`Solana connection quality changed: ${this.connectionQuality} -> ${quality}`);
      this.connectionQuality = quality;
    }
  }
  
  /**
   * Switch to the next endpoint when the current one has issues
   */
  private switchToNextEndpoint(): void {
    // Don't switch if there's only one endpoint
    if (this.endpoints.length <= 1) {
      return;
    }
    
    // Move to next endpoint
    const previousIndex = this.currentEndpointIndex;
    this.currentEndpointIndex = (this.currentEndpointIndex + 1) % this.endpoints.length;
    
    // Log the change
    console.log(`Switching Solana RPC endpoint: ${this.endpoints[previousIndex].url} -> ${this.endpoints[this.currentEndpointIndex].url}`);
    
    // Reinitialize connection with new endpoint
    if (this.connection) {
      try {
        const newEndpoint = this.endpoints[this.currentEndpointIndex].url;
        this.connection = new Connection(newEndpoint, 'confirmed');
      } catch (error) {
        console.error('Failed to switch Solana RPC endpoint', error);
      }
    }
  }
  
  /**
   * Calculate exponential backoff delay with jitter
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
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * Get Solana connection
   */
  getConnection(): Connection | null {
    if (this.circuitBreakerOpen && !this.isDevelopmentMode) {
      console.warn('Circuit breaker is open, connection not available');
      return null;
    }
    
    return this.connection;
  }
  
  /**
   * Get Solana keypair
   */
  getKeyPair(): Keypair | null {
    return this.keypair;
  }
  
  /**
   * Check if connected to Solana
   */
  isServiceConnected(): boolean {
    if (this.circuitBreakerOpen && !this.isDevelopmentMode) {
      return false;
    }
    
    return this.isConnected && !!this.connection;
  }
  
  /**
   * Get current blockchain network
   */
  getNetwork(): string {
    return this.network;
  }
  
  /**
   * Get block number (slot) with retry mechanism
   */
  async getBlockNumber(): Promise<number> {
    if (this.circuitBreakerOpen && !this.isDevelopmentMode) {
      console.warn('Circuit breaker is open, cannot get block number');
      return 0;
    }
    
    if (!this.connection) {
      if (this.isDevelopmentMode) {
        return 1000000; // Mock block number for development
      }
      throw new Error('Solana connection not initialized');
    }
    
    let retryAttempt = 0;
    
    while (retryAttempt <= this.maxRetries) {
      try {
        const slot = await this.connection.getSlot();
        
        // Success, reset error count
        this.consecutiveErrors = 0;
        
        // Update service status
        this.lastSyncTimestamp = Date.now();
        this.retryAttempt = 0;
        
        // If we had poor connection quality but succeeded, upgrade to good
        if (this.connectionQuality === 'poor') {
          this.updateConnectionQuality('good');
        }
        
        return slot;
      } catch (error: any) {
        const errorType = this.categorizeError(error);
        
        // Log the error
        console.error(`Failed to get Solana slot (attempt ${retryAttempt + 1}/${this.maxRetries + 1})`, error);
        
        // Check if we should retry
        if (retryAttempt < this.maxRetries && 
           (errorType === SolanaErrorType.NETWORK_ERROR || 
            errorType === SolanaErrorType.RPC_ERROR)) {
          // Calculate delay with exponential backoff
          const delayMs = this.calculateBackoff(retryAttempt);
          
          console.log(`Retrying in ${delayMs}ms...`);
          await this.delay(delayMs);
          
          // Try the next endpoint if available
          if (errorType === SolanaErrorType.RPC_ERROR || errorType === SolanaErrorType.RATE_LIMIT_ERROR) {
            this.switchToNextEndpoint();
          }
          
          retryAttempt++;
        } else {
          // Update service status
          this.handleError(error, errorType, 'Failed to get block number');
          
          // Return default value
          return this.isDevelopmentMode ? 1000000 : 0;
        }
      }
    }
    
    // If we reach here after all retries, return default value
    return this.isDevelopmentMode ? 1000000 : 0;
  }
  
  /**
   * Get account info for a specific address with retry mechanism
   */
  async getAccountInfo(address: string): Promise<{
    address: string;
    lamports: number;
    exists: boolean;
  }> {
    if (this.circuitBreakerOpen && !this.isDevelopmentMode) {
      console.warn('Circuit breaker is open, cannot get account info');
      return {
        address,
        lamports: 0,
        exists: false
      };
    }
    
    if (!this.connection) {
      if (this.isDevelopmentMode) {
        return {
          address,
          lamports: 1000000000, // 1 SOL
          exists: true
        };
      }
      throw new Error('Solana connection not initialized');
    }
    
    let retryAttempt = 0;
    
    while (retryAttempt <= this.maxRetries) {
      try {
        const publicKey = new PublicKey(address);
        const accountInfo = await this.connection.getAccountInfo(publicKey);
        
        // Success, reset error count
        this.consecutiveErrors = 0;
        
        // If we had poor connection quality but succeeded, upgrade to good
        if (this.connectionQuality === 'poor') {
          this.updateConnectionQuality('good');
        }
        
        return {
          address,
          lamports: accountInfo?.lamports || 0,
          exists: !!accountInfo
        };
      } catch (error: any) {
        const errorType = this.categorizeError(error);
        
        // If it's a validation error (like invalid address), don't retry
        if (errorType === SolanaErrorType.VALIDATION_ERROR) {
          console.error('Invalid Solana address', error);
          
          return {
            address,
            lamports: 0,
            exists: false
          };
        }
        
        // For network or RPC errors, we can retry
        if (retryAttempt < this.maxRetries && 
           (errorType === SolanaErrorType.NETWORK_ERROR || 
            errorType === SolanaErrorType.RPC_ERROR)) {
          // Calculate delay with exponential backoff
          const delayMs = this.calculateBackoff(retryAttempt);
          
          console.log(`Retrying getAccountInfo in ${delayMs}ms...`);
          await this.delay(delayMs);
          
          // Try the next endpoint if available
          if (errorType === SolanaErrorType.RPC_ERROR) {
            this.switchToNextEndpoint();
          }
          
          retryAttempt++;
        } else {
          // Update service status
          this.handleError(error, errorType, 'Failed to get account info');
          
          return {
            address,
            lamports: 0,
            exists: false
          };
        }
      }
    }
    
    // If we reach here after all retries, return default value
    return {
      address,
      lamports: 0,
      exists: false
    };
  }
  
  /**
   * Connect to Solana wallet
   */
  async connect(walletName?: string): Promise<boolean> {
    try {
      // In a real implementation, this would connect to an actual wallet
      console.log(`Connecting to Solana wallet${walletName ? ` (${walletName})` : ''}...`);
      
      // Simulate connection success for testing
      this.isConnected = true;
      
      return true;
    } catch (error: any) {
      const errorType = this.categorizeError(error);
      this.handleError(error, errorType, 'Failed to connect to wallet');
      
      this.isConnected = false;
      return false;
    }
  }
  
  /**
   * Disconnect from Solana wallet
   */
  async disconnect(): Promise<boolean> {
    try {
      // In a real implementation, this would disconnect from the wallet
      console.log('Disconnecting from Solana wallet...');
      
      // Simulate disconnection success
      this.isConnected = false;
      
      return true;
    } catch (error: any) {
      const errorType = this.categorizeError(error);
      this.handleError(error, errorType, 'Failed to disconnect from wallet');
      
      return false;
    }
  }
  
  /**
   * Get wallet info
   */
  getWalletInfo(): SolanaWalletInfo | null {
    if (!this.isConnected || !this.keypair) {
      return null;
    }
    
    // In a real implementation, this would return actual wallet info
    return {
      address: this.keypair.publicKey.toString(),
      balance: 100.0, // Mock balance
      network: this.network
    };
  }
  
  /**
   * Get enhanced connection state
   */
  getEnhancedConnectionState(): EnhancedSolanaConnectionState {
    return {
      isConnected: this.isConnected,
      connectionQuality: this.connectionQuality,
      lastError: this.lastError,
      errorType: this.errorType,
      lastSyncTimestamp: this.lastSyncTimestamp,
      retryAttempt: this.retryAttempt,
      circuitBreakerOpen: this.circuitBreakerOpen
    };
  }
  
  /**
   * Get connection state (basic, for backward compatibility)
   */
  getConnectionState(): SolanaConnectionState {
    return {
      isConnected: this.isConnected,
      wallet: this.keypair ? { 
        name: 'Development Wallet',
        adapter: {},
        publicKey: this.keypair.publicKey 
      } : null,
      balance: 100.0, // Mock balance for dev mode
      network: this.network,
      error: this.lastError,
      developmentMode: this.isDevelopmentMode
    };
  }

  /**
   * Send SOL tokens with retry mechanism
   */
  async sendSOL(
    toAddress: string,
    amount: string
  ): Promise<SolanaTransactionResponse> {
    if (this.isDevelopmentMode) {
      console.log(`Development mode: Simulated sending ${amount} SOL to ${toAddress}`);
      return { 
        success: true, 
        signature: `simulated_tx_${Date.now()}` 
      };
    }
    
    if (this.circuitBreakerOpen) {
      return { 
        success: false,
        error: 'Service unavailable: circuit breaker is open'
      };
    }
    
    if (!this.isConnected || !this.connection || !this.keypair) {
      return { 
        success: false,
        error: 'Wallet not connected'
      };
    }
    
    let retryAttempt = 0;
    
    while (retryAttempt <= this.maxRetries) {
      try {
        console.log(`Sending ${amount} SOL to ${toAddress}...${retryAttempt > 0 ? ` (retry ${retryAttempt})` : ''}`);
        
        const lamports = parseFloat(amount) * LAMPORTS_PER_SOL;
        const destPubkey = new PublicKey(toAddress);
        
        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: this.keypair.publicKey,
            toPubkey: destPubkey,
            lamports: lamports
          })
        );
        
        // In a real production implementation:
        // 1. Get recent blockhash
        // const { blockhash } = await this.connection.getLatestBlockhash();
        // transaction.recentBlockhash = blockhash;
        // transaction.feePayer = this.keypair.publicKey;
        // 
        // 2. Sign transaction
        // const signedTx = await this.wallet.signTransaction(transaction);
        // 
        // 3. Send transaction with confirmation and retry options
        // const opts: SendOptions = {
        //   skipPreflight: false,
        //   preflightCommitment: 'confirmed',
        //   maxRetries: 3
        // };
        // const signature = await this.connection.sendRawTransaction(signedTx.serialize(), opts);
        // await this.connection.confirmTransaction(signature, 'confirmed');
        
        // Success, reset error count
        this.consecutiveErrors = 0;
        
        // Simulate transaction success (this would be a real signature in production)
        return {
          success: true,
          signature: `simulatedTx_${Date.now()}`
        };
      } catch (error: any) {
        const errorType = this.categorizeError(error);
        
        // Log the error
        console.error(`Failed to send SOL (attempt ${retryAttempt + 1}/${this.maxRetries + 1})`, error);
        
        // For network, RPC or transaction errors that might be temporary, we can retry
        if (retryAttempt < this.maxRetries && 
           (errorType === SolanaErrorType.NETWORK_ERROR || 
            errorType === SolanaErrorType.RPC_ERROR ||
            errorType === SolanaErrorType.TRANSACTION_ERROR)) {
          // Calculate delay with exponential backoff
          const delayMs = this.calculateBackoff(retryAttempt);
          
          console.log(`Retrying sendSOL in ${delayMs}ms...`);
          await this.delay(delayMs);
          
          // Try the next endpoint if available
          if (errorType === SolanaErrorType.RPC_ERROR) {
            this.switchToNextEndpoint();
          }
          
          retryAttempt++;
        } else {
          // Update service status
          this.handleError(error, errorType, 'Failed to send SOL');
          
          return {
            success: false,
            error: error.message || 'Unknown error'
          };
        }
      }
    }
    
    // If we reach here after all retries, return failure
    return {
      success: false,
      error: `Failed to send SOL after ${this.maxRetries} retry attempts`
    };
  }
  
  /**
   * Create a time-locked vault with retry mechanism
   */
  async createVault(params: SolanaVaultCreationParams): Promise<SolanaVaultCreationResponse> {
    if (this.isDevelopmentMode) {
      console.log(`Development mode: Simulated creating vault with ${params.amount} SOL unlocking at ${new Date(params.unlockTime).toLocaleString()}`);
      return { 
        success: true, 
        vaultAddress: `simulated_vault_${Date.now()}` 
      };
    }
    
    if (this.circuitBreakerOpen) {
      return { 
        success: false,
        error: 'Service unavailable: circuit breaker is open'
      };
    }
    
    if (!this.isConnected || !this.connection || !this.keypair) {
      return { 
        success: false,
        error: 'Wallet not connected'
      };
    }
    
    let retryAttempt = 0;
    
    while (retryAttempt <= this.maxRetries) {
      try {
        console.log(`Creating vault with ${params.amount} SOL unlocking at ${new Date(params.unlockTime).toLocaleString()}${retryAttempt > 0 ? ` (retry ${retryAttempt})` : ''}`);
        
        // In a real implementation, this would deploy a vault program
        // Here would be the code to interact with the smart contract
        
        // Success, reset error count
        this.consecutiveErrors = 0;
        
        // Simulate vault creation success (would be a real program ID in production)
        return {
          success: true,
          vaultAddress: `simulatedVault_${Date.now()}`
        };
      } catch (error: any) {
        const errorType = this.categorizeError(error);
        
        // Log the error
        console.error(`Failed to create vault (attempt ${retryAttempt + 1}/${this.maxRetries + 1})`, error);
        
        // For network, RPC or transaction errors that might be temporary, we can retry
        if (retryAttempt < this.maxRetries && 
           (errorType === SolanaErrorType.NETWORK_ERROR || 
            errorType === SolanaErrorType.RPC_ERROR ||
            errorType === SolanaErrorType.TRANSACTION_ERROR)) {
          // Calculate delay with exponential backoff
          const delayMs = this.calculateBackoff(retryAttempt);
          
          console.log(`Retrying createVault in ${delayMs}ms...`);
          await this.delay(delayMs);
          
          // Try the next endpoint if available
          if (errorType === SolanaErrorType.RPC_ERROR) {
            this.switchToNextEndpoint();
          }
          
          retryAttempt++;
        } else {
          // Update service status
          this.handleError(error, errorType, 'Failed to create vault');
          
          return {
            success: false,
            error: error.message || 'Unknown error'
          };
        }
      }
    }
    
    // If we reach here after all retries, return failure
    return {
      success: false,
      error: `Failed to create vault after ${this.maxRetries} retry attempts`
    };
  }
  
  /**
   * Set Solana cluster with endpoint health check
   */
  async setCluster(cluster: SolanaCluster): Promise<boolean> {
    try {
      // Update cluster and reinitialize endpoints
      this.network = cluster;
      this.initializeEndpoints();
      
      // Check endpoints health
      await this.checkEndpointsHealth();
      
      // Reinitialize the connection with the new network
      await this.initialize();
      
      return true;
    } catch (error: any) {
      const errorType = this.categorizeError(error);
      this.handleError(error, errorType, 'Failed to switch network');
      
      return false;
    }
  }
  
  /**
   * Validate if a transaction exists and is confirmed
   * This implementation includes retry logic with exponential backoff
   * and careful error categorization
   * 
   * @param txHash Transaction signature to validate
   * @returns Promise<boolean> - True if the transaction is valid and confirmed
   */
  async isTransactionValid(txHash: string): Promise<boolean> {
    let retryAttempt = 0;
    const maxRetries = this.maxRetries;
    let lastError: Error | null = null;
    
    // Retry loop with exponential backoff
    while (retryAttempt <= maxRetries) {
      try {
        console.log(`Validating Solana transaction: ${txHash}${retryAttempt > 0 ? ` (retry ${retryAttempt}/${maxRetries})` : ''}`);
        
        // In development mode or when using simulated transactions, always return true
        if (this.isDevelopmentMode || txHash.startsWith('simulated_')) {
          console.log('Using development mode validation for Solana transaction');
          return true;
        }
        
        if (this.circuitBreakerOpen) {
          console.warn('Circuit breaker is open, cannot validate transaction');
          return false;
        }
        
        if (!this.connection) {
          throw new Error('Solana connection not initialized');
        }
        
        // In production, verify the transaction on-chain
        const signature = txHash;
        const signatureStatus = await this.connection.getSignatureStatus(signature);
        
        if (!signatureStatus || !signatureStatus.value) {
          // Transaction not found yet, might still be propagating
          if (retryAttempt < maxRetries) {
            const delayMs = this.calculateBackoff(retryAttempt);
            console.log(`Transaction not found, waiting ${delayMs}ms before retry ${retryAttempt + 1}/${maxRetries}...`);
            await this.delay(delayMs);
            retryAttempt++;
            continue;
          }
          console.log('Transaction not found after maximum retries');
          return false;
        }
        
        // Check confirmation status
        const confirmations = signatureStatus.value.confirmations;
        const isConfirmed = confirmations !== null && confirmations >= 1;
        const isSuccessful = !signatureStatus.value.err;
        
        // Log detailed verification result
        console.log(`Transaction validation result: ${isConfirmed && isSuccessful ? 'Valid' : 'Invalid'} ` +
                   `(Confirmed: ${isConfirmed}, Status: ${isSuccessful ? 'Success' : 'Failed'})`);
        
        // Success, reset error count
        this.consecutiveErrors = 0;
        
        // Return true only if transaction is both confirmed and successful
        return isConfirmed && isSuccessful;
      } catch (error: any) {
        lastError = error;
        
        // Categorize the error
        const errorType = this.categorizeError(error);
        const errorMsg = error.message || 'Unknown error';
        
        // Log appropriately based on error type
        if (errorType === SolanaErrorType.NETWORK_ERROR) {
          console.warn(`Network error validating transaction (retry ${retryAttempt}/${maxRetries}):`, errorMsg);
        } else if (errorType === SolanaErrorType.RPC_ERROR) {
          console.error(`RPC error validating transaction (retry ${retryAttempt}/${maxRetries}):`, errorMsg);
          // Try to switch to a backup endpoint
          this.switchToNextEndpoint();
        } else {
          console.error(`Error validating transaction (retry ${retryAttempt}/${maxRetries}):`, error);
        }
        
        // Check if we should retry
        if (retryAttempt < maxRetries && 
            (errorType === SolanaErrorType.NETWORK_ERROR || 
             errorType === SolanaErrorType.RPC_ERROR)) {
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
      this.handleError(lastError, SolanaErrorType.VALIDATION_ERROR, 'Transaction validation failed');
    }
    
    return false;
  }
  
  /**
   * Get detailed transaction verification info
   */
  async getTransactionVerification(txHash: string): Promise<SolanaTransactionVerification> {
    let retryAttempt = 0;
    const maxRetries = this.maxRetries;
    
    // Retry loop with exponential backoff
    while (retryAttempt <= maxRetries) {
      try {
        console.log(`Getting Solana transaction details: ${txHash}${retryAttempt > 0 ? ` (retry ${retryAttempt}/${maxRetries})` : ''}`);
        
        // In development mode or when using simulated transactions, return simulated success
        if (this.isDevelopmentMode || txHash.startsWith('simulated_')) {
          console.log('Using development mode for Solana transaction details');
          return {
            isValid: true,
            confirmations: 32,
            slot: 1000000 + Math.floor(Math.random() * 1000),
            blockTime: Math.floor(Date.now() / 1000)
          };
        }
        
        if (this.circuitBreakerOpen) {
          return {
            isValid: false,
            confirmations: 0,
            error: 'Service unavailable: circuit breaker is open',
            errorType: SolanaErrorType.NETWORK_ERROR
          };
        }
        
        if (!this.connection) {
          throw new Error('Solana connection not initialized');
        }
        
        // Get the transaction status
        const signature = txHash;
        const signatureStatus = await this.connection.getSignatureStatus(signature);
        
        if (!signatureStatus || !signatureStatus.value) {
          // Transaction not found yet, might still be propagating
          if (retryAttempt < maxRetries) {
            const delayMs = this.calculateBackoff(retryAttempt);
            console.log(`Transaction not found, waiting ${delayMs}ms before retry ${retryAttempt + 1}/${maxRetries}...`);
            await this.delay(delayMs);
            retryAttempt++;
            continue;
          }
          
          return {
            isValid: false,
            confirmations: 0,
            error: 'Transaction not found',
            errorType: SolanaErrorType.VALIDATION_ERROR
          };
        }
        
        // Get transaction details
        const confirmations = signatureStatus.value.confirmations ?? 0;
        const slot = signatureStatus.value.slot;
        const isSuccessful = !signatureStatus.value.err;
        
        // Try to get block time
        let blockTime: number | undefined;
        try {
          if (slot) {
            const block = await this.connection.getBlock(slot);
            blockTime = block?.blockTime;
          }
        } catch (timeError) {
          console.warn('Failed to get block time:', timeError);
        }
        
        // Success, reset error count
        this.consecutiveErrors = 0;
        
        return {
          isValid: isSuccessful && confirmations > 0,
          confirmations,
          slot,
          blockTime,
          error: signatureStatus.value.err ? JSON.stringify(signatureStatus.value.err) : undefined,
          errorType: signatureStatus.value.err ? SolanaErrorType.TRANSACTION_ERROR : undefined
        };
      } catch (error: any) {
        // Categorize the error
        const errorType = this.categorizeError(error);
        const errorMsg = error.message || 'Unknown error';
        
        // Log appropriately based on error type
        if (errorType === SolanaErrorType.NETWORK_ERROR) {
          console.warn(`Network error getting transaction details (retry ${retryAttempt}/${maxRetries}):`, errorMsg);
        } else if (errorType === SolanaErrorType.RPC_ERROR) {
          console.error(`RPC error getting transaction details (retry ${retryAttempt}/${maxRetries}):`, errorMsg);
          // Try to switch to a backup endpoint
          this.switchToNextEndpoint();
        } else {
          console.error(`Error getting transaction details (retry ${retryAttempt}/${maxRetries}):`, error);
        }
        
        // Check if we should retry
        if (retryAttempt < maxRetries && 
            (errorType === SolanaErrorType.NETWORK_ERROR || 
             errorType === SolanaErrorType.RPC_ERROR)) {
          const delayMs = this.calculateBackoff(retryAttempt);
          console.log(`Retrying in ${delayMs}ms...`);
          await this.delay(delayMs);
          retryAttempt++;
        } else {
          // Update error status
          this.handleError(error, errorType, 'Transaction verification failed');
          
          return {
            isValid: false,
            confirmations: 0,
            error: errorMsg,
            errorType
          };
        }
      }
    }
    
    // If we reach here after all retries, return error status
    return {
      isValid: false,
      confirmations: 0,
      error: `Failed to verify transaction after ${maxRetries} retries`,
      errorType: SolanaErrorType.NETWORK_ERROR
    };
  }
  
  /**
   * Get available wallets
   */
  getAvailableWallets(): Array<SolanaWallet> {
    // In a real implementation, this would return actual wallet options
    return [
      { name: 'Phantom', adapter: {} },
      { name: 'Solflare', adapter: {} },
      { name: 'Backpack', adapter: {} }
    ];
  }
}

// Create singleton instance
const instance = new SolanaService();

// Export singleton
export const solanaService = instance;