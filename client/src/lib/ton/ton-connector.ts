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
      
      // Initialize TonConnectUI
      const manifestUrl = `${window.location.origin}/tonconnect-manifest.json`;
      console.log('Initializing TonConnectUI with manifest URL:', manifestUrl);
      
      this.tonConnectUI = new TonConnectUI({
        manifestUrl,
        buttonRootId: 'ton-connect-button'
      });
      
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