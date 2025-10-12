import { TonClient } from '@tonclient/core';
import { TonConnectUI } from '@tonconnect/ui';

/**
 * TON connector service for Chronos Vault
 * 
 * Provides connection to TON blockchain through TonConnect UI
 */
class TonConnector {
  private tonClient: TonClient | null = null;
  private tonConnectUI: TonConnectUI | null = null;
  private isConnected: boolean = false;
  private walletAddress: string | null = null;
  
  constructor() {
    this.initialize();
  }
  
  private async initialize() {
    try {
      // Create TON Client instance
      this.tonClient = new TonClient({
        network: {
          server_address: 'https://testnet.toncenter.com/api/v2/jsonRPC'
        }
      });
      
      // Check if window has global tonConnectUI instance to avoid duplicate creation
      const existingTonConnectUI = (window as any).__tonConnectUIInstance;
      
      if (existingTonConnectUI) {
        console.log('TON Connect UI elements already defined, reusing existing instance');
        this.tonConnectUI = existingTonConnectUI;
      } else {
        try {
          // Initialize TonConnectUI with proper error handling
          const manifestUrl = `${window.location.origin}/tonconnect-manifest.json`;
          console.log('Initializing TonConnectUI with manifest URL:', manifestUrl);
          
          // Ensure Buffer is available before creating TonConnectUI
          if (typeof window !== 'undefined' && !(window as any).Buffer) {
            try {
              const bufferModule = await import('buffer');
              (window as any).Buffer = bufferModule.Buffer;
              (window as any).global = window;
              (window as any).process = { env: {} };
            } catch (bufferError) {
              console.warn('Buffer polyfill failed, using fallback:', bufferError);
              // Provide a minimal Buffer polyfill
              (window as any).Buffer = {
                from: (data: any) => new Uint8Array(data),
                alloc: (size: number) => new Uint8Array(size),
                isBuffer: () => false
              };
            }
          }
          
          // Create new instance
          this.tonConnectUI = new TonConnectUI({
            manifestUrl
          });
          
          // Store as global instance
          (window as any).__tonConnectUIInstance = this.tonConnectUI;
          console.log('TonConnectUI successfully initialized');
        } catch (error) {
          console.error('Error creating TonConnectUI:', error);
          // Set to null to prevent further errors
          this.tonConnectUI = null;
        }
      }
      
      // Only continue with the rest if we have a valid instance
      if (this.tonConnectUI) {
        // Check if wallet is already connected
        this.isConnected = !!this.tonConnectUI.connected;
        
        if (this.isConnected) {
          try {
            const walletInfo = this.tonConnectUI.wallet;
            this.walletAddress = walletInfo?.account.address || null;
          } catch (error) {
            console.error('Error getting wallet info:', error);
          }
        }
        
        // Add listeners
        this.tonConnectUI.onStatusChange((wallet) => {
          this.isConnected = !!wallet;
          this.walletAddress = wallet?.account.address || null;
        });
      }
      
      console.log('TON service successfully initialized');
      console.log('Attempting to restore TON wallet session...');
    } catch (error) {
      console.error('Failed to initialize TON connector', error);
    }
  }
  
  /**
   * Get TON Client instance
   */
  getTonClient(): TonClient | null {
    return this.tonClient;
  }
  
  /**
   * Get TonConnectUI instance
   */
  getTonConnectUI(): TonConnectUI | null {
    return this.tonConnectUI;
  }
  
  /**
   * Connect to TON wallet
   */
  async connect(): Promise<boolean> {
    try {
      if (!this.tonConnectUI) {
        throw new Error('TonConnectUI not initialized');
      }
      
      await this.tonConnectUI.openModal();
      return true;
    } catch (error) {
      console.error('Failed to connect to TON wallet', error);
      return false;
    }
  }
  
  /**
   * Disconnect from TON wallet
   */
  async disconnect(): Promise<void> {
    try {
      if (this.tonConnectUI) {
        await this.tonConnectUI.disconnect();
      }
      
      this.isConnected = false;
      this.walletAddress = null;
    } catch (error) {
      console.error('Failed to disconnect from TON wallet', error);
    }
  }
  
  /**
   * Check if connected to TON wallet
   */
  isWalletConnected(): boolean {
    return this.isConnected;
  }
  
  /**
   * Get connected wallet address
   */
  getWalletAddress(): string | null {
    return this.walletAddress;
  }
}

// Singleton instance
const tonConnectorInstance = new TonConnector();

export const tonConnector = {
  getInstance: () => tonConnectorInstance
};