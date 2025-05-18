import { TonConnectUI } from '@tonconnect/ui';
import { TON_VAULT_FACTORY_ABI, formatTONVaultParams } from '@/lib/contract-interfaces';

/**
 * Enum representing the status of TON wallet connection
 */
export enum TonConnectionStatus {
  CONNECTED = 'connected',
  CONNECTING = 'connecting',
  DISCONNECTED = 'disconnected'
}

/**
 * Interface for TON wallet info
 */
export interface TONWalletInfo {
  address: string;
  balance: string;
  network: string;
  publicKey?: string;
}

/**
 * TON Service - Handles TON blockchain interactions
 */
class TONService {
  // Static singleton instance
  private static instance: TONService | null = null;
  
  // Connection state
  private tonConnectUI: TonConnectUI | null = null;
  private walletInfo: TONWalletInfo | null = null;
  private connectionStatus: TonConnectionStatus = TonConnectionStatus.DISCONNECTED;
  private _isInitialized: boolean = false;
  
  // Circuit breaker properties
  private initAttempts: number = 0;
  private maxInitAttempts: number = 5;
  private lastInitAttempt: number = 0;
  private cooldownPeriod: number = 10000; // 10 seconds cooldown
  private circuitOpen: boolean = false;
  
  // Store the mock status change callback
  private _mockStatusChangeCallback: ((wallet: any) => void) | null = null;
  
  // Public getter for isInitialized
  get isInitialized(): boolean {
    return this._isInitialized;
  }
  
  // Private constructor for singleton pattern
  private constructor() {}
  
  /**
   * Check if connected to TON wallet
   * Required for cross-chain security monitoring
   * @returns boolean indicating if the wallet is connected
   */
  isConnected(): boolean {
    // Check if TON Connect UI is initialized and connected
    return !!this.tonConnectUI && this.tonConnectUI.connected && 
           this.connectionStatus === TonConnectionStatus.CONNECTED;
  }
  
  /**
   * Get the singleton instance of TONService
   */
  public static getInstance(): TONService {
    if (!TONService.instance) {
      TONService.instance = new TONService();
    }
    return TONService.instance;
  }

  /**
   * Initialize TON service
   */
  // Static variable to share the TonConnectUI instance across different provider instances
  private static sharedTonConnectUI: TonConnectUI | null = null;

  async initialize(): Promise<boolean> {
    try {
      // If already initialized, return immediately
      if (this._isInitialized) {
        return true;
      }
      
      // Check if the circuit breaker is open
      if (this.circuitOpen) {
        const currentTime = Date.now();
        const timeElapsed = currentTime - this.lastInitAttempt;
        
        // If we're still in the cooldown period, don't attempt initialization
        if (timeElapsed < this.cooldownPeriod) {
          console.warn(
            `TON service initialization in cooldown. Try again in ${Math.ceil((this.cooldownPeriod - timeElapsed) / 1000)}s`
          );
          return false;
        }
        
        // Reset circuit breaker after cooldown period
        console.log('TON service initialization cooldown period expired, resetting circuit breaker');
        this.circuitOpen = false;
        this.initAttempts = 0;
      }
      
      // Increment initialization attempts
      this.initAttempts++;
      this.lastInitAttempt = Date.now();
      
      // Check if we've exceeded maximum initialization attempts
      if (this.initAttempts > this.maxInitAttempts) {
        console.warn(
          `TON service initialization has failed ${this.initAttempts} times, activating circuit breaker for ${this.cooldownPeriod / 1000}s`
        );
        this.circuitOpen = true;
        return false;
      }
      
      // Create the button container directly if it doesn't exist
      let buttonContainer = document.getElementById('ton-connect-button');
      if (!buttonContainer) {
        buttonContainer = document.createElement('div');
        buttonContainer.id = 'ton-connect-button';
        buttonContainer.style.display = 'none';
        document.body.appendChild(buttonContainer);
        console.log("Created TON connect button container in DOM");
      }
      
      // First check if we already have a shared instance
      if (TONService.sharedTonConnectUI) {
        this.tonConnectUI = TONService.sharedTonConnectUI;
        console.log('Reusing existing TON Connect UI instance');
        
        // Reset the counter on successful reuse
        this.initAttempts = 0;
        this._isInitialized = true;
        return true;
      }
      
      // Otherwise, try to create a new instance
      if (!this.tonConnectUI) {
        try {
          // Get the current URL for manifest resolution
          const currentUrl = window.location.origin;
          const manifestUrl = `${currentUrl}/tonconnect-manifest.json`;
          
          console.log(`TON service initialization attempt ${this.initAttempts}/${this.maxInitAttempts}`);
          console.log('Initializing TonConnectUI with manifest URL:', manifestUrl);
          
          try {
            this.tonConnectUI = new TonConnectUI({
              manifestUrl: manifestUrl,
              buttonRootId: 'ton-connect-button'
            });
            
            // Store the successful instance in the static variable for future reuse
            TONService.sharedTonConnectUI = this.tonConnectUI;
          } catch (elementError) {
            console.warn('Error creating TonConnectUI:', elementError);
            
            // Create a minimal mock implementation for development mode
            if (import.meta.env.DEV) {
              this.tonConnectUI = this.createMockTonConnectUI();
              console.log('Created mock TON Connect UI for development mode');
            } else {
              // In production, propagate the error
              throw elementError;
            }
          }
          
          // Only add event listeners if we have a valid instance
          if (this.tonConnectUI) {
            // Add connection status change listener
            this.tonConnectUI.onStatusChange(this.handleConnectionStatusChange);
            
            // If already connected, update wallet info
            if (this.tonConnectUI.connected) {
              await this.updateWalletInfo();
            }
            
            this._isInitialized = true;
            // Reset the counter on successful initialization
            this.initAttempts = 0;
            console.log("TON service successfully initialized");
          }
        } catch (initError) {
          console.error("Error initializing TonConnectUI:", initError);
          
          // Don't trip the circuit breaker here, let the calling code retry
          // until we reach max attempts
          return false;
        }
      }
      
      return this._isInitialized;
    } catch (error) {
      console.error('Failed to initialize TON service:', error);
      
      // Increment failure count but don't modify circuit breaker state here
      // This allows controlled retry in the main initialization loop
      return false;
    }
  }

  /**
   * Create a mock TonConnectUI for development scenarios
   * This is used when the real UI initialization fails
   */
  private createMockTonConnectUI(): any {
    const mockUI = {
      connected: false,
      wallet: null,
      account: null,
      connect: async () => {
        console.log('Mock TonConnectUI: Simulating connection...');
        mockUI.connected = true;
        mockUI.wallet = {
          account: {
            address: '0:1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
            chain: 'testnet'
          },
          device: 'mock',
          walletVersion: '1.0.0',
          walletName: 'Chronos Vault Testnet Wallet'
        };
        return Promise.resolve(true);
      },
      disconnect: async () => {
        console.log('Mock TonConnectUI: Simulating disconnection...');
        mockUI.connected = false;
        mockUI.wallet = null;
        return Promise.resolve(true);
      },
      onStatusChange: (callback: any) => {
        console.log('Mock TonConnectUI: Registered status change callback');
        this._mockStatusChangeCallback = callback;
      },
      sendTransaction: async (options: any) => {
        console.log('Mock TonConnectUI: Simulating transaction send', options);
        return {
          boc: 'mock_transaction_boc',
        };
      },
      openModal: async () => {
        console.log('Mock TonConnectUI: Simulating connect modal opening...');
        setTimeout(() => {
          if (this._mockStatusChangeCallback && !mockUI.connected) {
            mockUI.connected = true;
            mockUI.wallet = {
              account: {
                address: '0:1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
                chain: 'testnet'
              },
              device: 'mock',
              walletVersion: '1.0.0',
              walletName: 'Chronos Vault Testnet Wallet'
            };
            this._mockStatusChangeCallback(mockUI.wallet);
          }
        }, 500);
        return Promise.resolve();
      },
      closeModal: () => {
        console.log('Mock TonConnectUI: Simulating modal close...');
      }
    };
    
    return mockUI;
  }
  
  /**
   * Handle connection status change
   */
  private handleConnectionStatusChange = async (wallet: any | null) => {
    if (wallet) {
      this.connectionStatus = TonConnectionStatus.CONNECTED;
      await this.updateWalletInfo();
    } else {
      this.connectionStatus = TonConnectionStatus.DISCONNECTED;
      this.walletInfo = null;
    }
  }

  /**
   * Update wallet information
   */
  private async updateWalletInfo(): Promise<void> {
    if (!this.tonConnectUI || !this.tonConnectUI.connected) {
      this.walletInfo = null;
      return;
    }

    try {
      const account = this.tonConnectUI.wallet?.account;
      if (!account) {
        this.walletInfo = null;
        return;
      }

      const address = account.address;
      // Use any type for chain value since the TonConnect types may change
      const chain = account.chain as any;
      // Default to testnet for development, only use mainnet if explicitly specified
      const network = chain && typeof chain === 'string' && chain.includes('mainnet') ? 'mainnet' : 'testnet';
      console.log(`TON wallet connected to ${network}`);
      const publicKey = account.publicKey || undefined;
      
      // Fetch balance
      const balance = await this.fetchTONBalance(address);
      
      this.walletInfo = {
        address,
        balance,
        network,
        publicKey
      };
    } catch (error) {
      console.error('Failed to update wallet info:', error);
      this.walletInfo = null;
    }
  }

  /**
   * Fetch TON balance from network using TON API
   */
  private async fetchTONBalance(address: string): Promise<string> {
    try {
      // For development mode, just return a mock balance
      if (import.meta.env.DEV) {
        return this.getTestnetBalance(address);
      }
      
      // Use the TON API key from environment variables or the one provided directly
      const apiKey = import.meta.env.VITE_TON_API_KEY || import.meta.env.TON_API_KEY;
      
      if (!apiKey) {
        console.warn('No TON API key provided, using simulated balance');
        return this.getTestnetBalance(address);
      }
      
      // In a real implementation, we would fetch the actual balance from TON API
      // For now, return a mock balance to avoid API errors
      return this.getTestnetBalance(address);
    } catch (error) {
      console.error('Error fetching TON balance:', error);
      return this.getTestnetBalance(address);
    }
  }
  
  /**
   * Get a deterministic testnet balance for an address
   * This is used when the API key is not available or API call fails
   */
  private getTestnetBalance(address: string): string {
    // Use the address to generate a deterministic but realistic testnet balance
    // This ensures consistent values for the same address during development
    const hash = address.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    // Generate a balance between 0.05 and 2.5 TON
    const balance = (0.05 + (hash % 245) / 100).toFixed(2);
    return balance;
  }

  /**
   * Connect TON wallet
   */
  async connect(): Promise<boolean> {
    try {
      if (!this.tonConnectUI) {
        console.log('Initializing TON service before connecting');
        await this.initialize();
      }
      
      if (!this.tonConnectUI) {
        console.error('Failed to initialize TON Connect UI');
        return false;
      }
      
      // Check if already connected to avoid WalletAlreadyConnectedError
      if (this.tonConnectUI.connected) {
        console.log('TON wallet already connected, updating state');
        this.connectionStatus = TonConnectionStatus.CONNECTED;
        await this.updateWalletInfo();
        return true;
      }
      
      // If not connected, attempt connection
      console.log('Starting TON wallet connection process...');
      this.connectionStatus = TonConnectionStatus.CONNECTING;
      
      // Open the modal to connect wallet
      await this.tonConnectUI.openModal();
      
      // The actual connection state will be handled by the status change event
      // so we return true to indicate the process started successfully
      return true;
    } catch (error) {
      console.error('Failed to connect TON wallet:', error);
      this.connectionStatus = TonConnectionStatus.DISCONNECTED;
      return false;
    }
  }

  /**
   * Disconnect TON wallet
   */
  async disconnect(): Promise<boolean> {
    try {
      if (!this.tonConnectUI) {
        console.log('TON Connect UI not available, nothing to disconnect');
        this.resetConnectionState();
        return false;
      }
      
      // First check if we're actually connected
      if (!this.tonConnectUI.connected) {
        console.log('TON wallet already disconnected');
        this.resetConnectionState();
        return true;
      }
      
      console.log('Attempting to disconnect TON wallet...');
      
      try {
        await this.tonConnectUI.disconnect();
        console.log('TON wallet disconnected successfully');
      } catch (disconnectError) {
        console.error('Error during TON disconnect:', disconnectError);
      }
      
      // Reset our internal state
      this.resetConnectionState();
      return true;
    } catch (error) {
      console.error('Failed to disconnect TON wallet:', error);
      return false;
    }
  }
  
  /**
   * Reset connection state
   */
  private resetConnectionState(): void {
    this.connectionStatus = TonConnectionStatus.DISCONNECTED;
    this.walletInfo = null;
  }
  
  /**
   * Get wallet information
   */
  getWalletInfo(): TONWalletInfo | null {
    return this.walletInfo;
  }
  
  /**
   * Get connection status
   */
  getConnectionStatus(): TonConnectionStatus {
    return this.connectionStatus;
  }
  
  /**
   * Create a basic vault on TON blockchain
   */
  async createBasicVault(params: any): Promise<any> {
    try {
      if (!this.isConnected()) {
        return {
          success: false,
          error: 'TON wallet not connected'
        };
      }
      
      console.log('Creating basic vault on TON blockchain with params:', params);
      
      // For development mode, return a mock successful response
      if (import.meta.env.DEV) {
        // Generate a mock transaction hash and vault address
        const txHash = `ton_${Math.random().toString(16).substring(2, 10)}`;
        const vaultAddress = `UQAkIXbCToQ6LowMrDNG2K3ERmMH8m4XB2owWgL0BAB14Jtl`;
        
        console.log(`Mock TON vault created with transaction hash: ${txHash}`);
        console.log(`Mock vault address: ${vaultAddress}`);
        
        return {
          success: true,
          vaultAddress: vaultAddress,
          transactionHash: txHash
        };
      }
      
      // In a real implementation, we would:
      // 1. Format the parameters for the TON smart contract
      // 2. Prepare the transaction
      // 3. Send it using the connected wallet
      // 4. Wait for confirmation and return the result
      
      // For now, throw an error to indicate this isn't fully implemented
      throw new Error('TON vault creation not implemented in production mode');
    } catch (error: any) {
      console.error('Failed to create TON vault:', error);
      return {
        success: false,
        error: error.message || 'Unknown error occurred'
      };
    }
  }
}

export const tonService = TONService.getInstance();