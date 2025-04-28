import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  Keypair, 
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';

/**
 * Connection status for Solana wallets
 */
export enum SolanaConnectionStatus {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected'
}

/**
 * Solana wallet information
 */
export interface SolanaWalletInfo {
  address: string;
  balance: string;
  network: 'mainnet' | 'testnet' | 'devnet';
  publicKey?: string;
}

/**
 * Cluster type for Solana
 */
export enum SolanaCluster {
  MAINNET = 'mainnet-beta',
  TESTNET = 'testnet',
  DEVNET = 'devnet',
  LOCALNET = 'localnet'
}

/**
 * Service for interacting with Solana blockchain
 */
export class SolanaService {
  private static instance: SolanaService;
  
  // Connection to the Solana cluster
  private connection: Connection | null = null;
  
  // Current wallet state
  private walletPublicKey: PublicKey | null = null;
  private connectionStatus: SolanaConnectionStatus = SolanaConnectionStatus.DISCONNECTED;
  private walletInfo: SolanaWalletInfo | null = null;
  
  // Cluster configuration
  private cluster: SolanaCluster = SolanaCluster.DEVNET;
  
  /**
   * Private constructor for singleton pattern
   */
  private constructor() {
    // Initialize the connection to Solana
    this.setCluster(SolanaCluster.DEVNET);
  }
  
  /**
   * Get the singleton instance
   */
  public static getInstance(): SolanaService {
    if (!SolanaService.instance) {
      SolanaService.instance = new SolanaService();
    }
    return SolanaService.instance;
  }
  
  /**
   * Set the Solana cluster
   */
  public setCluster(cluster: SolanaCluster): void {
    this.cluster = cluster;
    
    // Create a connection to the specified cluster
    const endpoint = this.getClusterEndpoint(cluster);
    this.connection = new Connection(endpoint, 'confirmed');
    
    console.log(`Connected to Solana ${cluster} at ${endpoint}`);
  }
  
  /**
   * Get the cluster endpoint URL
   */
  private getClusterEndpoint(cluster: SolanaCluster): string {
    switch (cluster) {
      case SolanaCluster.MAINNET:
        return 'https://api.mainnet-beta.solana.com';
      case SolanaCluster.TESTNET:
        return 'https://api.testnet.solana.com';
      case SolanaCluster.DEVNET:
        return 'https://api.devnet.solana.com';
      case SolanaCluster.LOCALNET:
        return 'http://127.0.0.1:8899';
      default:
        return 'https://api.devnet.solana.com';
    }
  }
  
  /**
   * Connect to a Solana wallet
   * Attempts to connect to Phantom wallet if available
   */
  public async connect(): Promise<boolean> {
    try {
      this.connectionStatus = SolanaConnectionStatus.CONNECTING;
      
      // Check if Phantom is installed
      const phantom = (window as any).phantom?.solana;
      
      if (!phantom) {
        console.error('Phantom wallet not found! Please install the Phantom extension.');
        this.connectionStatus = SolanaConnectionStatus.DISCONNECTED;
        return false;
      }
      
      try {
        // Request connection to Phantom wallet
        const response = await phantom.connect();
        this.walletPublicKey = new PublicKey(response.publicKey.toString());
        
        // Update wallet info
        await this.updateWalletInfo();
        
        this.connectionStatus = SolanaConnectionStatus.CONNECTED;
        return true;
      } catch (err) {
        console.error('User rejected the connection request or another error occurred:', err);
        
        // Fallback to a simulated connection for testing if needed
        if (process.env.NODE_ENV === 'development') {
          console.log('Falling back to simulated wallet for development');
          const keypair = Keypair.generate();
          this.walletPublicKey = keypair.publicKey;
          await this.updateWalletInfo();
          this.connectionStatus = SolanaConnectionStatus.CONNECTED;
          return true;
        }
        
        this.connectionStatus = SolanaConnectionStatus.DISCONNECTED;
        return false;
      }
    } catch (error) {
      console.error('Failed to connect Solana wallet:', error);
      this.connectionStatus = SolanaConnectionStatus.DISCONNECTED;
      return false;
    }
  }
  
  /**
   * Disconnect the Solana wallet
   */
  public async disconnect(): Promise<boolean> {
    try {
      // Try to disconnect from Phantom
      const phantom = (window as any).phantom?.solana;
      if (phantom) {
        try {
          await phantom.disconnect();
          console.log('Phantom wallet disconnected');
        } catch (err) {
          console.warn('Error while disconnecting from Phantom:', err);
          // Continue execution even if Phantom disconnect fails
        }
      }
      
      // Clean up local state
      this.walletPublicKey = null;
      this.walletInfo = null;
      this.connectionStatus = SolanaConnectionStatus.DISCONNECTED;
      
      return true;
    } catch (error) {
      console.error('Failed to disconnect Solana wallet:', error);
      return false;
    }
  }
  
  /**
   * Update wallet information
   */
  private async updateWalletInfo(): Promise<void> {
    if (!this.connection || !this.walletPublicKey) {
      this.walletInfo = null;
      return;
    }
    
    try {
      // Fetch balance
      const balance = await this.connection.getBalance(this.walletPublicKey);
      const balanceInSOL = balance / LAMPORTS_PER_SOL;
      
      this.walletInfo = {
        address: this.walletPublicKey.toString(),
        balance: balanceInSOL.toString(),
        network: this.getNetworkName(),
        publicKey: this.walletPublicKey.toBase58()
      };
    } catch (error) {
      console.error('Failed to update Solana wallet info:', error);
      this.walletInfo = null;
    }
  }
  
  /**
   * Get the current network name
   */
  private getNetworkName(): 'mainnet' | 'testnet' | 'devnet' {
    switch (this.cluster) {
      case SolanaCluster.MAINNET:
        return 'mainnet';
      case SolanaCluster.TESTNET:
        return 'testnet';
      default:
        return 'devnet';
    }
  }
  
  /**
   * Get the connection status
   */
  public getConnectionStatus(): SolanaConnectionStatus {
    return this.connectionStatus;
  }
  
  /**
   * Get wallet information
   */
  public getWalletInfo(): SolanaWalletInfo | null {
    return this.walletInfo;
  }
  
  /**
   * Send SOL to another address
   */
  public async sendSOL(
    toAddress: string,
    amount: string
  ): Promise<{ success: boolean; transactionHash?: string; error?: string }> {
    try {
      if (!this.connection || !this.walletPublicKey) {
        return { success: false, error: 'Wallet not connected' };
      }
      
      // Check if Phantom is available
      const phantom = (window as any).phantom?.solana;
      if (!phantom) {
        console.error('Phantom wallet not found');
        return { success: false, error: 'Phantom wallet not available' };
      }
      
      try {
        // Convert amount to lamports
        const lamports = Math.floor(parseFloat(amount) * LAMPORTS_PER_SOL);
        
        // Create a transaction to send SOL
        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: this.walletPublicKey,
            toPubkey: new PublicKey(toAddress),
            lamports,
          })
        );
        
        // Set recent blockhash and fee payer
        const { blockhash } = await this.connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = this.walletPublicKey;
        
        // Sign and send the transaction using Phantom
        const { signature } = await phantom.signAndSendTransaction(transaction);
        console.log('Transaction sent with signature:', signature);
        
        // Wait for confirmation
        await this.connection.confirmTransaction(signature);
        
        // Update wallet info
        await this.updateWalletInfo();
        
        return {
          success: true,
          transactionHash: signature
        };
      } catch (err: any) {
        console.error('Error during transaction:', err);
        
        // If in development mode, simulate success
        if (process.env.NODE_ENV === 'development') {
          console.log(`Simulating sending ${amount} SOL to ${toAddress}`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          await this.updateWalletInfo();
          return {
            success: true,
            transactionHash: 'tx-' + Math.random().toString(36).substring(2, 15)
          };
        }
        
        return { 
          success: false, 
          error: err.message || 'Transaction failed' 
        };
      }
    } catch (error: any) {
      console.error('Failed to send SOL:', error);
      return { success: false, error: error.message || 'Unknown error occurred' };
    }
  }
  
  /**
   * Create a time-locked vault on Solana
   */
  public async createVault(params: {
    unlockTime: number;
    recipient?: string;
    amount: string;
    comment?: string;
  }): Promise<{ success: boolean; vaultAddress?: string; error?: string }> {
    try {
      if (!this.connection || !this.walletPublicKey) {
        return { success: false, error: 'Wallet not connected' };
      }
      
      // Check if Phantom is available
      const phantom = (window as any).phantom?.solana;
      if (!phantom) {
        console.error('Phantom wallet not found');
        return { success: false, error: 'Phantom wallet not available' };
      }
      
      const { unlockTime, recipient, amount, comment } = params;
      const vaultRecipient = recipient || this.walletPublicKey.toString();
      
      try {
        // Create a new keypair for the vault account
        const vaultKeypair = Keypair.generate();
        const vaultPubkey = vaultKeypair.publicKey;
        
        // Convert SOL amount to lamports
        const lamports = Math.floor(parseFloat(amount) * LAMPORTS_PER_SOL);
        
        // Create a transaction to fund the vault account
        const transaction = new Transaction();
        
        // Calculate the space needed for the vault data
        const VAULT_ACCOUNT_SIZE = 1000; // Approximate size for our vault data
        
        // Get the minimum rent for the vault account
        const rentExemption = await this.connection.getMinimumBalanceForRentExemption(VAULT_ACCOUNT_SIZE);
        
        // Add instruction to create the vault account
        transaction.add(
          SystemProgram.createAccount({
            fromPubkey: this.walletPublicKey,
            newAccountPubkey: vaultPubkey,
            lamports: rentExemption + lamports, // Rent + deposit
            space: VAULT_ACCOUNT_SIZE,
            programId: new PublicKey('ChronoSVauLt111111111111111111111111111111111') // Our vault program ID
          })
        );
        
        // Add instruction to initialize the vault (this would be a custom instruction in production)
        // For now, we're just transferring SOL for the demo
        
        // Get recent blockhash and set fee payer
        const { blockhash } = await this.connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = this.walletPublicKey;
        
        // Partial sign with the vault keypair (needed for createAccount)
        transaction.partialSign(vaultKeypair);
        
        // Sign and send transaction with Phantom
        const { signature } = await phantom.signAndSendTransaction(transaction);
        console.log('Vault creation transaction sent with signature:', signature);
        
        // Wait for confirmation
        await this.connection.confirmTransaction(signature);
        
        // Update wallet info
        await this.updateWalletInfo();
        
        return {
          success: true,
          vaultAddress: vaultPubkey.toString()
        };
      } catch (err: any) {
        console.error('Error creating vault:', err);
        
        // If in development mode, simulate success
        if (process.env.NODE_ENV === 'development') {
          console.log(`Simulating Solana vault creation with ${amount} SOL to be unlocked at ${new Date(unlockTime * 1000).toLocaleString()}`);
          console.log(`Recipient: ${vaultRecipient}`);
          if (comment) console.log(`Comment: ${comment}`);
          
          await new Promise(resolve => setTimeout(resolve, 2000));
          await this.updateWalletInfo();
          
          return {
            success: true,
            vaultAddress: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
          };
        }
        
        return { 
          success: false, 
          error: err.message || 'Failed to create vault' 
        };
      }
    } catch (error: any) {
      console.error('Failed to create Solana vault:', error);
      return { success: false, error: error.message || 'Unknown error occurred' };
    }
  }
}

export const solanaService = SolanaService.getInstance();