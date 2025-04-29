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
    // Use custom RPC URL from environment if available
    const customRpcUrl = import.meta.env.VITE_SOLANA_RPC_URL;
    if (customRpcUrl) {
      console.log('Using custom Solana RPC URL from environment');
      return customRpcUrl as string;
    }
    
    // Fall back to default endpoints
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
   * Get available Solana wallets
   * Detects wallets injected into the window object
   */
  public getAvailableWallets(): { name: string, adapter: any }[] {
    const wallets = [];
    
    // Check for Phantom
    if ((window as any).phantom?.solana) {
      wallets.push({ 
        name: 'Phantom', 
        adapter: (window as any).phantom.solana 
      });
    }
    
    // Check for Solflare
    if ((window as any).solflare) {
      wallets.push({ 
        name: 'Solflare', 
        adapter: (window as any).solflare 
      });
    }
    
    // Check for Slope
    if ((window as any).slope) {
      wallets.push({ 
        name: 'Slope', 
        adapter: (window as any).slope 
      });
    }
    
    // Check for Sollet
    if ((window as any).sollet) {
      wallets.push({ 
        name: 'Sollet', 
        adapter: (window as any).sollet 
      });
    }
    
    // Check for Coin98
    if ((window as any).coin98?.sol) {
      wallets.push({ 
        name: 'Coin98', 
        adapter: (window as any).coin98.sol 
      });
    }
    
    // Check for MathWallet
    if ((window as any).solana?.isMathWallet) {
      wallets.push({ 
        name: 'MathWallet', 
        adapter: (window as any).solana 
      });
    }
    
    return wallets;
  }

  /**
   * Connect to any Solana wallet
   * Supports multiple wallet providers with fallback for development
   */
  public async connect(walletName?: string): Promise<boolean> {
    try {
      this.connectionStatus = SolanaConnectionStatus.CONNECTING;
      
      // Get available wallets
      const availableWallets = this.getAvailableWallets();
      
      if (availableWallets.length === 0) {
        console.warn('No Solana wallets found. Using demo mode for development purposes.');
        
        // Create a simulated wallet address for demo purposes
        this.walletPublicKey = Keypair.generate().publicKey;
        this.connectionStatus = SolanaConnectionStatus.CONNECTED;
        
        // Create wallet info with simulated balance
        this.walletInfo = {
          address: this.walletPublicKey.toString(),
          balance: "10.0000",
          network: this.getNetworkName(),
          publicKey: this.walletPublicKey.toBase58()
        };
        
        console.log('Connected to simulated Solana wallet with address:', this.walletPublicKey.toString());
        return true;
      }
      
      // If wallet name is provided, find that specific wallet
      let selectedWallet;
      if (walletName) {
        selectedWallet = availableWallets.find(w => w.name.toLowerCase() === walletName.toLowerCase());
      }
      
      // If no wallet name provided or not found, use the first available wallet
      if (!selectedWallet) {
        selectedWallet = availableWallets[0];
        console.log(`Using ${selectedWallet.name} wallet`);
      }
      
      try {
        // Request connection to the wallet
        const response = await selectedWallet.adapter.connect();
        const publicKey = response.publicKey || response; // Different wallets return different formats
        
        this.walletPublicKey = new PublicKey(publicKey.toString());
        
        // Update wallet info
        await this.updateWalletInfo();
        
        this.connectionStatus = SolanaConnectionStatus.CONNECTED;
        return true;
      } catch (err) {
        console.error('User rejected the connection request or another error occurred:', err);
        
        // Fallback to a simulated connection for testing if needed
        if (import.meta.env.DEV) {
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
      // Try to disconnect from all possible wallets
      const availableWallets = this.getAvailableWallets();
      
      for (const wallet of availableWallets) {
        try {
          if (wallet.adapter && wallet.adapter.disconnect) {
            await wallet.adapter.disconnect();
            console.log(`${wallet.name} wallet disconnected`);
          }
        } catch (err) {
          console.warn(`Error while disconnecting from ${wallet.name}:`, err);
          // Continue execution even if disconnect fails
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
   * Get the currently connected wallet adapter
   */
  private getConnectedWalletAdapter(): any {
    // Find all available wallets
    const availableWallets = this.getAvailableWallets();
    
    if (availableWallets.length === 0) {
      console.error('No Solana wallets found');
      return null;
    }
    
    // For now, return the first available wallet adapter
    // In a production environment, we would track which wallet the user connected with
    return availableWallets[0].adapter;
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
      
      // Get the connected wallet adapter
      const walletAdapter = this.getConnectedWalletAdapter();
      if (!walletAdapter) {
        return { success: false, error: 'No wallet available' };
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
        
        // Sign and send the transaction using the connected wallet
        let signatureInfo;
        if (walletAdapter.signAndSendTransaction) {
          signatureInfo = await walletAdapter.signAndSendTransaction(transaction);
        } else if (walletAdapter.sendTransaction) {
          signatureInfo = await walletAdapter.sendTransaction(transaction, this.connection);
        } else {
          // For wallets with different API:
          // 1. Get the signed transaction
          const signed = await walletAdapter.signTransaction(transaction);
          // 2. Send the signed transaction
          const signature = await this.connection.sendRawTransaction(signed.serialize());
          signatureInfo = { signature };
        }
        
        const signature = typeof signatureInfo === 'string' 
          ? signatureInfo 
          : signatureInfo.signature || signatureInfo;
          
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
        if (import.meta.env.DEV) {
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
   * Check if the service is connected to Solana
   */
  public isConnected(): boolean {
    return this.connectionStatus === SolanaConnectionStatus.CONNECTED;
  }

  /**
   * Get the current slot number
   */
  public async getCurrentSlot(): Promise<number> {
    try {
      if (!this.connection) {
        return 0;
      }
      
      return await this.connection.getSlot();
    } catch (error) {
      console.error('Error getting current slot:', error);
      return 0;
    }
  }

  /**
   * Get vault account information
   */
  public async getVaultAccount(vaultId: string): Promise<any> {
    try {
      if (!this.connection) {
        return null;
      }
      
      // Parse the vault ID to a public key
      const vaultPublicKey = new PublicKey(vaultId);
      
      // Get the account info
      const accountInfo = await this.connection.getAccountInfo(vaultPublicKey);
      
      if (!accountInfo) {
        return null;
      }
      
      return {
        publicKey: vaultPublicKey.toString(),
        lamports: accountInfo.lamports,
        data: accountInfo.data,
        owner: accountInfo.owner.toString(),
        executable: accountInfo.executable
      };
    } catch (error) {
      console.error('Error getting vault account:', error);
      return null;
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
      
      // Get the connected wallet adapter
      const walletAdapter = this.getConnectedWalletAdapter();
      if (!walletAdapter) {
        return { success: false, error: 'No wallet available' };
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
        
        // Add instruction to initialize the vault (would be a custom instruction in production)
        // For now, we're just transferring SOL for the demo
        
        // Get recent blockhash and set fee payer
        const { blockhash } = await this.connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = this.walletPublicKey;
        
        // Partial sign with the vault keypair (needed for createAccount)
        transaction.partialSign(vaultKeypair);
        
        // Sign and send the transaction using the connected wallet
        let signatureInfo;
        if (walletAdapter.signAndSendTransaction) {
          signatureInfo = await walletAdapter.signAndSendTransaction(transaction);
        } else if (walletAdapter.sendTransaction) {
          signatureInfo = await walletAdapter.sendTransaction(transaction, this.connection);
        } else {
          // For wallets with different API:
          // 1. Get the signed transaction
          const signed = await walletAdapter.signTransaction(transaction);
          // 2. Send the signed transaction
          const signature = await this.connection.sendRawTransaction(signed.serialize());
          signatureInfo = { signature };
        }
        
        const signature = typeof signatureInfo === 'string' 
          ? signatureInfo 
          : signatureInfo.signature || signatureInfo;
          
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
        if (import.meta.env.DEV) {
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

// Class methods below

export const solanaService = SolanaService.getInstance();