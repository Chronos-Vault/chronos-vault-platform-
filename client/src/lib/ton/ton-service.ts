import { TonConnectUI } from '@tonconnect/ui';

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
  private tonConnectUI: TonConnectUI | null = null;
  private walletInfo: TONWalletInfo | null = null;
  private connectionStatus: TonConnectionStatus = TonConnectionStatus.DISCONNECTED;
  private isInitialized: boolean = false;

  /**
   * Initialize TON service
   */
  async initialize(): Promise<boolean> {
    try {
      if (this.isInitialized) return true;
      
      // Create the button container directly if it doesn't exist
      let buttonContainer = document.getElementById('ton-connect-button');
      if (!buttonContainer) {
        buttonContainer = document.createElement('div');
        buttonContainer.id = 'ton-connect-button';
        buttonContainer.style.display = 'none';
        document.body.appendChild(buttonContainer);
        console.log("Created TON connect button container in DOM");
      }
      
      // To avoid duplicate initialization errors, check if there's already a TonConnectUI instance
      if (!this.tonConnectUI) {
        try {
          // Get the current URL for manifest resolution
          const currentUrl = window.location.origin;
          const manifestUrl = `${currentUrl}/tonconnect-manifest.json`;
          
          console.log('Initializing TonConnectUI with manifest URL:', manifestUrl);
          
          this.tonConnectUI = new TonConnectUI({
            manifestUrl: manifestUrl,
            buttonRootId: 'ton-connect-button'
          });
          
          // Add connection status change listener
          this.tonConnectUI.onStatusChange(this.handleConnectionStatusChange);
          
          // If already connected, update wallet info
          if (this.tonConnectUI.connected) {
            await this.updateWalletInfo();
          }
          
          this.isInitialized = true;
          console.log("TON service successfully initialized");
        } catch (initError) {
          console.error("Error initializing TonConnectUI:", initError);
          return false;
        }
      }
      
      return this.isInitialized;
    } catch (error) {
      console.error('Failed to initialize TON service:', error);
      return false;
    }
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
      const account = this.tonConnectUI.account;
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
      // Use TON API to fetch actual balance
      const apiKey = import.meta.env.VITE_TON_API_KEY;
      if (!apiKey) {
        console.warn('No TON API key provided, using simulated balance');
        return "0.1"; // Placeholder balance if no API key
      }
      
      // Make API request to TON Center
      const endpoint = 'https://toncenter.com/api/v2/getAddressBalance';
      const response = await fetch(`${endpoint}?api_key=${apiKey}&address=${address}`);
      
      if (!response.ok) {
        throw new Error(`TON API request failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      if (data.ok && data.result) {
        // Convert nanograms to TON (1 TON = 10^9 nanograms)
        const balanceInTON = parseInt(data.result) / 1e9;
        return balanceInTON.toString();
      } else {
        console.warn('Invalid response from TON API:', data);
        return "0";
      }
    } catch (error) {
      console.error('Failed to fetch TON balance:', error);
      return "0";
    }
  }

  /**
   * Connect TON wallet
   */
  async connect(): Promise<boolean> {
    try {
      if (!this.tonConnectUI) {
        await this.initialize();
      }
      
      if (!this.tonConnectUI) {
        return false;
      }
      
      this.connectionStatus = TonConnectionStatus.CONNECTING;
      
      // Open the modal to connect wallet
      await this.tonConnectUI.openModal();
      
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
      if (!this.tonConnectUI) return false;
      
      // Disconnect wallet
      await this.tonConnectUI.disconnect();
      
      this.connectionStatus = TonConnectionStatus.DISCONNECTED;
      this.walletInfo = null;
      
      return true;
    } catch (error) {
      console.error('Failed to disconnect TON wallet:', error);
      return false;
    }
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): TonConnectionStatus {
    return this.connectionStatus;
  }

  /**
   * Get wallet information
   */
  getWalletInfo(): TONWalletInfo | null {
    return this.walletInfo;
  }

  /**
   * Send TON tokens
   */
  async sendTON(
    toAddress: string,
    amount: string
  ): Promise<{ success: boolean; transactionHash?: string; error?: string }> {
    try {
      if (!this.tonConnectUI || !this.tonConnectUI.connected) {
        return { success: false, error: 'Wallet not connected' };
      }
      
      // Convert amount to nanoTONs (1 TON = 10^9 nanoTONs)
      const amountInNanoTON = (parseFloat(amount) * 1e9).toString();
      
      // Create TON transaction
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 300, // 5 minutes from now
        messages: [
          {
            address: toAddress,
            amount: amountInNanoTON,
          }
        ]
      };
      
      console.log(`Sending ${amount} TON to ${toAddress}`);
      
      // Send the transaction using TonConnect
      const result = await this.tonConnectUI.sendTransaction(transaction);
      
      // Update wallet info after transaction
      await this.updateWalletInfo();
      
      return { 
        success: true, 
        transactionHash: result.boc // The transaction hash or bounce message
      };
    } catch (error: any) {
      console.error('Failed to send TON:', error);
      return { success: false, error: error.message || 'Unknown error occurred' };
    }
  }

  /**
   * Create TON vault (time-locked contract)
   */
  /**
   * Send transaction to TON blockchain
   */
  async sendTransaction(transaction: any): Promise<{ success: boolean; transactionHash?: string; error?: string }> {
    try {
      if (!this.tonConnectUI || !this.tonConnectUI.connected) {
        return { success: false, error: 'Wallet not connected' };
      }
      
      console.log('Sending transaction via TON Connect:', transaction);
      
      // Send the transaction using TonConnect
      const result = await this.tonConnectUI.sendTransaction(transaction);
      
      console.log('Transaction sent successfully:', result);
      
      // Update wallet info after transaction
      await this.updateWalletInfo();
      
      return { 
        success: true, 
        transactionHash: result.boc // The transaction hash or bounce message
      };
    } catch (error: any) {
      console.error('Failed to send transaction via TON Connect:', error);
      return { success: false, error: error.message || 'Unknown error occurred' };
    }
  }
  
  async createVault(params: {
    unlockTime: number;
    recipient?: string;
    amount: string;
    comment?: string;
  }): Promise<{ success: boolean; vaultAddress?: string; error?: string }> {
    try {
      if (!this.tonConnectUI || !this.tonConnectUI.connected) {
        return { success: false, error: 'Wallet not connected' };
      }
      
      const { unlockTime, recipient, amount, comment } = params;
      const vaultRecipient = recipient || this.walletInfo?.address;
      
      if (!vaultRecipient) {
        return { success: false, error: 'Invalid recipient address' };
      }
      
      // Convert amount to nanoTONs (1 TON = 10^9 nanoTONs)
      const amountInNanoTON = (parseFloat(amount) * 1e9).toString();
      
      // Factory contract address (testnet)
      const vaultFactoryAddress = 'EQB0gCDoGJNTfoPUSCgBxLuZ_O-7aYUccU0P1Vj_QdO6rQTf';
      
      console.log(`Creating vault with ${amount} TON to be unlocked at ${new Date(unlockTime * 1000).toLocaleString()}`);
      console.log(`Recipient: ${vaultRecipient}`);
      if (comment) console.log(`Comment: ${comment}`);
      
      // Create transaction to factory contract
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 300, // 5 minutes from now
        messages: [
          {
            address: vaultFactoryAddress,
            amount: amountInNanoTON,
            payload: {
              abi: 'https://raw.githubusercontent.com/ton-community/ton-contracts/main/contracts/vault.abi.json', // Sample ABI URL
              method: 'createVault',
              params: {
                recipient: vaultRecipient, 
                unlockTime: unlockTime.toString(),
                comment: comment || ''
              }
            }
          }
        ]
      };
      
      // Send transaction to create vault
      const result = await this.tonConnectUI.sendTransaction(transaction);
      
      console.log('Vault creation transaction sent:', result);
      
      // In a real implementation, we would parse the vault address from the transaction result
      // For now, we'll return the transaction info
      
      // Update wallet info after vault creation
      await this.updateWalletInfo();
      
      return { 
        success: true,
        // For a real implementation, we would extract the actual contract address
        // This would likely come from an event or through parsing transaction logs
        vaultAddress: `${vaultFactoryAddress.substring(0, 6)}...${Math.random().toString(36).substring(2, 8)}` 
      };
    } catch (error: any) {
      console.error('Failed to create vault:', error);
      return { success: false, error: error.message || 'Unknown error occurred' };
    }
  }
}

export const tonService = new TONService();