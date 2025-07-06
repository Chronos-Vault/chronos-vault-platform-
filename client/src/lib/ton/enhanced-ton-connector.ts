import { TonConnectUI, WalletInfoInjected, WalletInfoRemote } from '@tonconnect/ui';

// Chain identifiers
export const CHAIN_TON = 'TON';
export const CHAIN_ETHEREUM = 'ETHEREUM';
export const CHAIN_SOLANA = 'SOLANA';
export const CHAIN_BITCOIN = 'BITCOIN';

// Error types
export interface ChainError {
  chain: string;
  message: string;
  critical: boolean;
  timestamp?: number;
  errorCode?: string;
}

// In-memory store for chain errors
const errorStore: Record<string, ChainError[]> = {
  [CHAIN_TON]: [],
  [CHAIN_ETHEREUM]: [],
  [CHAIN_SOLANA]: [],
  [CHAIN_BITCOIN]: [],
};

/**
 * Add an error to the chain-specific error store
 */
export function addError(error: ChainError): void {
  if (!error.chain || !errorStore[error.chain]) {
    console.error('Attempted to add error for unknown chain:', error);
    return;
  }
  
  errorStore[error.chain].push({
    ...error,
    timestamp: error.timestamp || Date.now(),
  });
  
  // Limit number of errors stored (keep most recent)
  const maxErrors = 10;
  if (errorStore[error.chain].length > maxErrors) {
    errorStore[error.chain] = errorStore[error.chain].slice(-maxErrors);
  }
  
  // Log critical errors to console
  if (error.critical) {
    console.error(`Critical ${error.chain} error:`, error.message);
  }
}

/**
 * Clear all errors for a specific chain
 */
export function clearChainErrors(chain: string): void {
  if (!chain || !errorStore[chain]) {
    return;
  }
  
  errorStore[chain] = [];
}

export enum TonWalletType {
  TONKEEPER = 'tonkeeper',
  TONHUB = 'tonhub',
  OPENMASK = 'openmask',
  MYTONWALLET = 'mytonwallet',
  TONWALLET = 'tonwallet',
  EXTENSION = 'extension',
  OTHER = 'other'
}

export enum ConnectionStatus {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  ERROR = 'error'
}

export interface WalletInfo {
  address: string;
  type: TonWalletType;
  publicKey?: string;
  name: string;
  balance?: string;
  chainId?: number;
  connectionMethod: 'injected' | 'remote';
}

interface TonConnectorOptions {
  manifestUrl?: string;
  preferredWallets?: TonWalletType[];
  delayInit?: boolean;
  autoReconnect?: boolean;
  buttonRootId?: string;
  walletStyle?: 'light' | 'dark' | 'system';
  enableDevMode?: boolean;
}

const defaultOptions: TonConnectorOptions = {
  manifestUrl: undefined, // Will use origin by default
  preferredWallets: [
    TonWalletType.TONKEEPER, 
    TonWalletType.TONHUB,
    TonWalletType.OPENMASK,
    TonWalletType.MYTONWALLET
  ],
  delayInit: false,
  autoReconnect: true,
  walletStyle: 'dark',
  enableDevMode: false
};

/**
 * Enhanced TON wallet connector with support for multiple wallets and improved UX
 */
export class EnhancedTonConnector {
  private tonConnectUI: TonConnectUI | null = null;
  private options: TonConnectorOptions;
  private status: ConnectionStatus = ConnectionStatus.DISCONNECTED;
  private walletInfo: WalletInfo | null = null;
  private connectionListeners: ((status: ConnectionStatus, wallet: WalletInfo | null) => void)[] = [];
  private debugMode: boolean = false;

  constructor(options: Partial<TonConnectorOptions> = {}) {
    this.options = { ...defaultOptions, ...options };
    this.debugMode = this.options.enableDevMode || false;
    
    if (!this.options.delayInit) {
      this.initialize();
    }
  }

  /**
   * Initialize the TON connector
   */
  public async initialize(): Promise<void> {
    try {
      this.debug('Initializing enhanced TON connector');
      
      // Determine manifest URL - use the provided one or construct from origin
      const manifestUrl = this.options.manifestUrl || `${window.location.origin}/tonconnect-manifest.json`;
      this.debug(`Using manifest URL: ${manifestUrl}`);
      
      // Check if there's already an instance in the window object to avoid duplicates
      const existingTonConnectUI = (window as any).__tonConnectUIInstance;
      
      if (existingTonConnectUI) {
        this.debug('Using existing TonConnectUI instance');
        this.tonConnectUI = existingTonConnectUI;
      } else {
        try {
          // Initialize TON Connect UI
          this.debug('Creating new TonConnectUI instance');
          this.tonConnectUI = new TonConnectUI({
            manifestUrl,
            buttonRootId: this.options.buttonRootId,
            uiPreferences: {
              theme: this.options.walletStyle || 'dark'
            }
          });
          
          // Store globally to prevent duplicates
          (window as any).__tonConnectUIInstance = this.tonConnectUI;
        } catch (error) {
          this.debug('Error creating TonConnectUI:', error);
          console.error('Failed to create TonConnectUI:', error);
          this.status = ConnectionStatus.ERROR;
          clearChainErrors(CHAIN_TON);
          addError({
            chain: CHAIN_TON,
            message: `Failed to initialize TON connector: ${(error as Error)?.message || 'Unknown error'}`,
            critical: true
          });
          
          return;
        }
      }
      
      // Configure wallet list - put preferred wallets first
      if (this.options.preferredWallets && this.options.preferredWallets.length > 0) {
        this.tonConnectUI.uiOptions = {
          ...this.tonConnectUI.uiOptions,
          walletsList: {
            includeWallets: this.options.preferredWallets as any // Type mismatch, but will work
          }
        };
      }
      
      // Set up event listeners
      this.setupWalletListeners();
      
      // Attempt auto-reconnect if enabled
      if (this.options.autoReconnect) {
        this.debug('Auto-reconnect enabled, checking existing connection');
        this.checkExistingConnection();
      }
      
      this.debug('Enhanced TON connector initialized successfully');
    } catch (error) {
      this.debug('Error during initialization:', error);
      console.error('Failed to initialize enhanced TON connector:', error);
      this.status = ConnectionStatus.ERROR;
      clearChainErrors(CHAIN_TON);
      addError({
        chain: CHAIN_TON,
        message: `Failed to initialize TON connector: ${(error as Error)?.message || 'Unknown error'}`,
        critical: true
      });
    }
  }

  /**
   * Set up wallet connection listeners
   */
  private setupWalletListeners(): void {
    if (!this.tonConnectUI) {
      return;
    }
    
    this.tonConnectUI.onStatusChange((wallet) => {
      if (wallet) {
        this.debug('Wallet connected:', wallet);
        this.status = ConnectionStatus.CONNECTED;
        this.walletInfo = this.parseWalletInfo(wallet);
      } else {
        this.debug('Wallet disconnected');
        this.status = ConnectionStatus.DISCONNECTED;
        this.walletInfo = null;
      }
      
      // Notify all listeners
      this.notifyListeners();
    });
  }

  /**
   * Check for existing connection
   */
  private checkExistingConnection(): void {
    if (!this.tonConnectUI) {
      return;
    }
    
    const wallet = this.tonConnectUI.wallet;
    if (wallet) {
      this.debug('Found existing wallet connection:', wallet);
      this.status = ConnectionStatus.CONNECTED;
      this.walletInfo = this.parseWalletInfo(wallet);
      this.notifyListeners();
    } else {
      this.debug('No existing wallet connection found');
    }
  }

  /**
   * Parse wallet info from TonConnect response
   */
  private parseWalletInfo(wallet: WalletInfoInjected | WalletInfoRemote): WalletInfo {
    // Determine wallet type
    let walletType = TonWalletType.OTHER;
    let walletName = 'Unknown Wallet';
    
    // Check if it's an embedded wallet or a known wallet app
    if ('jsBridgeKey' in wallet && wallet.jsBridgeKey) {
      // This is an injected wallet (browser extension)
      if (wallet.jsBridgeKey.includes('tonkeeper')) {
        walletType = TonWalletType.TONKEEPER;
        walletName = 'Tonkeeper';
      } else if (wallet.jsBridgeKey.includes('openmask')) {
        walletType = TonWalletType.OPENMASK;
        walletName = 'OpenMask';
      } else if (wallet.jsBridgeKey.includes('mytonwallet')) {
        walletType = TonWalletType.MYTONWALLET;
        walletName = 'MyTonWallet';
      } else {
        walletType = TonWalletType.EXTENSION;
        walletName = 'TON Extension';
      }
    } else if ('universalLink' in wallet && wallet.universalLink) {
      // This is a remote wallet (mobile app)
      if (wallet.universalLink.includes('tonkeeper')) {
        walletType = TonWalletType.TONKEEPER;
        walletName = 'Tonkeeper';
      } else if (wallet.universalLink.includes('tonhub')) {
        walletType = TonWalletType.TONHUB;
        walletName = 'Tonhub';
      } else if (wallet.universalLink.includes('mytonwallet')) {
        walletType = TonWalletType.MYTONWALLET;
        walletName = 'MyTonWallet';
      } else if (wallet.universalLink.includes('ton-wallet')) {
        walletType = TonWalletType.TONWALLET;
        walletName = 'TON Wallet';
      } else {
        walletType = TonWalletType.OTHER;
        walletName = 'TON Wallet';
      }
    }
    
    return {
      address: wallet.account.address,
      type: walletType,
      publicKey: wallet.account.publicKey,
      name: walletName,
      chainId: wallet.account.chain === 'mainnet' ? 1 : wallet.account.chain === 'testnet' ? 2 : 3,
      connectionMethod: 'jsBridgeKey' in wallet ? 'injected' : 'remote'
    };
  }

  /**
   * Notify all listeners of status changes
   */
  private notifyListeners(): void {
    for (const listener of this.connectionListeners) {
      try {
        listener(this.status, this.walletInfo);
      } catch (error) {
        console.error('Error in TON wallet connection listener:', error);
      }
    }
  }

  /**
   * Connect to a TON wallet
   */
  public async connect(): Promise<WalletInfo | null> {
    this.debug('Connecting to TON wallet');
    
    try {
      if (!this.tonConnectUI) {
        await this.initialize();
        
        if (!this.tonConnectUI) {
          throw new Error('Failed to initialize TON Connect UI');
        }
      }
      
      // If already connected, return current wallet info
      if (this.status === ConnectionStatus.CONNECTED && this.walletInfo) {
        this.debug('Already connected to wallet:', this.walletInfo);
        return this.walletInfo;
      }
      
      // Set connecting status
      this.status = ConnectionStatus.CONNECTING;
      this.notifyListeners();
      
      // Open wallet selection modal
      this.debug('Opening wallet selection modal');
      await this.tonConnectUI.openModal();
      
      // Connection status will be updated by event listener
      return this.walletInfo;
    } catch (error) {
      this.debug('Error connecting to TON wallet:', error);
      console.error('Failed to connect to TON wallet:', error);
      
      this.status = ConnectionStatus.ERROR;
      clearChainErrors(CHAIN_TON);
      addError({
        chain: CHAIN_TON,
        message: `Failed to connect to TON wallet: ${(error as Error)?.message || 'Unknown error'}`,
        critical: false
      });
      
      this.notifyListeners();
      return null;
    }
  }

  /**
   * Disconnect from the wallet
   */
  public async disconnect(): Promise<void> {
    this.debug('Disconnecting from TON wallet');
    
    try {
      if (!this.tonConnectUI) {
        return;
      }
      
      await this.tonConnectUI.disconnect();
      
      // Status change listener will handle updating the status
    } catch (error) {
      this.debug('Error disconnecting from TON wallet:', error);
      console.error('Failed to disconnect from TON wallet:', error);
      
      // Force status update since the listener might not fire
      this.status = ConnectionStatus.DISCONNECTED;
      this.walletInfo = null;
      this.notifyListeners();
    }
  }

  /**
   * Check if wallet is connected
   */
  public isConnected(): boolean {
    return this.status === ConnectionStatus.CONNECTED && !!this.walletInfo;
  }

  /**
   * Get current wallet info
   */
  public getWalletInfo(): WalletInfo | null {
    return this.walletInfo;
  }

  /**
   * Get current connection status
   */
  public getStatus(): ConnectionStatus {
    return this.status;
  }

  /**
   * Add connection status listener
   */
  public addConnectionListener(
    listener: (status: ConnectionStatus, wallet: WalletInfo | null) => void
  ): void {
    this.connectionListeners.push(listener);
    
    // Immediately notify the new listener of the current status
    try {
      listener(this.status, this.walletInfo);
    } catch (error) {
      console.error('Error in TON wallet connection listener:', error);
    }
  }

  /**
   * Remove connection status listener
   */
  public removeConnectionListener(
    listener: (status: ConnectionStatus, wallet: WalletInfo | null) => void
  ): void {
    const index = this.connectionListeners.indexOf(listener);
    if (index !== -1) {
      this.connectionListeners.splice(index, 1);
    }
  }

  /**
   * Get the TonConnectUI instance
   */
  public getTonConnectUI(): TonConnectUI | null {
    return this.tonConnectUI;
  }

  /**
   * Log debug messages if debug mode is enabled
   */
  private debug(...args: any[]): void {
    if (this.debugMode) {
      console.log('[EnhancedTonConnector]', ...args);
    }
  }
}

// Create singleton instance
const tonConnector = new EnhancedTonConnector({
  enableDevMode: true
});

export { tonConnector };