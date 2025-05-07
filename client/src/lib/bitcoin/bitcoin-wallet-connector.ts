import { BitcoinNetworkType, BitcoinWalletProvider } from './bitcoin-types';

// Type for Bitcoin wallet information
export interface BitcoinWalletInfo {
  address: string;
  balance: number;
  network: BitcoinNetworkType;
  isConnected: boolean;
}

// Callback type for wallet changes
type WalletChangeCallback = (walletInfo: BitcoinWalletInfo | null) => void;

/**
 * BitcoinWalletConnector class implements the Singleton pattern
 * to handle Bitcoin wallet connections
 */
export class BitcoinWalletConnector {
  private static instance: BitcoinWalletConnector;
  private walletInfo: BitcoinWalletInfo | null = null;
  private subscribers: WalletChangeCallback[] = [];
  private connectedProvider: string | null = null;

  // Private constructor to prevent direct instantiation
  private constructor() {}

  /**
   * Get the singleton instance of BitcoinWalletConnector
   */
  public static getInstance(): BitcoinWalletConnector {
    if (!BitcoinWalletConnector.instance) {
      BitcoinWalletConnector.instance = new BitcoinWalletConnector();
    }
    return BitcoinWalletConnector.instance;
  }

  /**
   * Connect to a Bitcoin wallet provider
   */
  public async connect(providerName: string): Promise<void> {
    try {
      // Check if window object exists (browser environment)
      if (typeof window === 'undefined') {
        throw new Error('Bitcoin wallet connection requires a browser environment');
      }

      // Detect and connect to the appropriate wallet provider
      switch (providerName) {
        case 'Unisat':
          await this.connectUnisat();
          break;
        case 'Xverse':
          await this.connectXverse();
          break;
        case 'OKX':
          await this.connectOKX();
          break;
        case 'Leather':
          await this.connectLeather();
          break;
        default:
          throw new Error(`Unsupported wallet provider: ${providerName}`);
      }

      // Save the connected provider name
      this.connectedProvider = providerName;

      // Notify subscribers about the wallet connection
      this.notifySubscribers();
    } catch (error) {
      console.error(`Failed to connect to ${providerName} wallet:`, error);
      throw error;
    }
  }

  /**
   * Disconnect from the currently connected wallet provider
   */
  public disconnect(): void {
    this.walletInfo = null;
    this.connectedProvider = null;
    // Notify subscribers about the wallet disconnection
    this.notifySubscribers();
  }

  /**
   * Subscribe to wallet changes
   */
  public subscribe(callback: WalletChangeCallback): void {
    if (!this.subscribers.includes(callback)) {
      this.subscribers.push(callback);
      // Immediately notify the new subscriber with current wallet state
      callback(this.walletInfo);
    }
  }

  /**
   * Unsubscribe from wallet changes
   */
  public unsubscribe(callback: WalletChangeCallback): void {
    this.subscribers = this.subscribers.filter(subscriber => subscriber !== callback);
  }

  /**
   * Get available Bitcoin wallet providers
   */
  public getAvailableProviders(): string[] {
    if (typeof window === 'undefined') {
      return [];
    }

    const providers: string[] = [];

    // Check for Unisat wallet
    if ((window as any).unisat) {
      providers.push('Unisat');
    }

    // Check for Xverse wallet
    if ((window as any).xverse) {
      providers.push('Xverse');
    }

    // Check for OKX wallet
    if ((window as any).okxwallet) {
      providers.push('OKX');
    }

    // Check for Leather wallet
    if ((window as any).leather) {
      providers.push('Leather');
    }

    return providers;
  }

  /**
   * Refresh wallet information (balance, etc.)
   */
  public async refreshWalletInfo(): Promise<void> {
    if (!this.connectedProvider || !this.walletInfo) {
      throw new Error('No wallet connected');
    }

    try {
      // Update wallet info based on the connected provider
      switch (this.connectedProvider) {
        case 'Unisat':
          await this.refreshUnisatWalletInfo();
          break;
        case 'Xverse':
          await this.refreshXverseWalletInfo();
          break;
        case 'OKX':
          await this.refreshOKXWalletInfo();
          break;
        case 'Leather':
          await this.refreshLeatherWalletInfo();
          break;
      }

      // Notify subscribers about the wallet update
      this.notifySubscribers();
    } catch (error) {
      console.error('Failed to refresh wallet info:', error);
      throw error;
    }
  }

  /**
   * Sign a message with the connected wallet
   */
  public async signMessage(message: string): Promise<string> {
    if (!this.connectedProvider || !this.walletInfo) {
      throw new Error('No wallet connected');
    }

    try {
      // Sign message based on the connected provider
      switch (this.connectedProvider) {
        case 'Unisat':
          return await this.signMessageWithUnisat(message);
        case 'Xverse':
          return await this.signMessageWithXverse(message);
        case 'OKX':
          return await this.signMessageWithOKX(message);
        case 'Leather':
          return await this.signMessageWithLeather(message);
        default:
          throw new Error(`Unsupported wallet provider: ${this.connectedProvider}`);
      }
    } catch (error) {
      console.error('Failed to sign message:', error);
      throw error;
    }
  }

  /**
   * Send a Bitcoin transaction
   */
  public async sendTransaction(receiverAddress: string, amountBTC: number): Promise<string> {
    if (!this.connectedProvider || !this.walletInfo) {
      throw new Error('No wallet connected');
    }

    try {
      // Send transaction based on the connected provider
      switch (this.connectedProvider) {
        case 'Unisat':
          return await this.sendTransactionWithUnisat(receiverAddress, amountBTC);
        case 'Xverse':
          return await this.sendTransactionWithXverse(receiverAddress, amountBTC);
        case 'OKX':
          return await this.sendTransactionWithOKX(receiverAddress, amountBTC);
        case 'Leather':
          return await this.sendTransactionWithLeather(receiverAddress, amountBTC);
        default:
          throw new Error(`Unsupported wallet provider: ${this.connectedProvider}`);
      }
    } catch (error) {
      console.error('Failed to send transaction:', error);
      throw error;
    }
  }

  /**
   * Notify all subscribers about wallet changes
   */
  private notifySubscribers(): void {
    this.subscribers.forEach(callback => callback(this.walletInfo));
  }

  /* Provider-specific implementation methods */

  // Unisat wallet methods
  private async connectUnisat(): Promise<void> {
    const unisat = (window as any).unisat;
    if (!unisat) {
      throw new Error('Unisat wallet not found');
    }

    // Request accounts from Unisat
    const accounts = await unisat.requestAccounts();
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found in Unisat wallet');
    }

    // Get network and balance
    const network = await unisat.getNetwork();
    const balance = await unisat.getBalance();

    // Set wallet info
    this.walletInfo = {
      address: accounts[0],
      balance: balance.total / 100000000, // Convert from satoshis to BTC
      network: this.mapNetworkType(network),
      isConnected: true
    };
  }

  private async refreshUnisatWalletInfo(): Promise<void> {
    if (!this.walletInfo) return;

    const unisat = (window as any).unisat;
    if (!unisat) {
      throw new Error('Unisat wallet not found');
    }

    // Get updated balance
    const balance = await unisat.getBalance();
    
    // Update wallet info
    this.walletInfo = {
      ...this.walletInfo,
      balance: balance.total / 100000000 // Convert from satoshis to BTC
    };
  }

  private async signMessageWithUnisat(message: string): Promise<string> {
    const unisat = (window as any).unisat;
    if (!unisat) {
      throw new Error('Unisat wallet not found');
    }

    return await unisat.signMessage(message);
  }

  private async sendTransactionWithUnisat(receiverAddress: string, amountBTC: number): Promise<string> {
    const unisat = (window as any).unisat;
    if (!unisat) {
      throw new Error('Unisat wallet not found');
    }

    // Convert BTC to satoshis
    const amountSatoshis = Math.floor(amountBTC * 100000000);
    
    // Send transaction
    const txid = await unisat.sendBitcoin(receiverAddress, amountSatoshis);
    return txid;
  }

  // Xverse wallet methods
  private async connectXverse(): Promise<void> {
    const xverse = (window as any).xverse;
    if (!xverse) {
      throw new Error('Xverse wallet not found');
    }

    // Connect to Xverse (simplified implementation)
    const connection = await xverse.bitcoin.connect();
    const address = connection.address;
    const network = connection.network;
    
    // Get balance (implementation may vary based on Xverse API)
    const balance = await xverse.bitcoin.getBalance(address);

    // Set wallet info
    this.walletInfo = {
      address,
      balance: balance / 100000000, // Convert from satoshis to BTC
      network: this.mapNetworkType(network),
      isConnected: true
    };
  }

  private async refreshXverseWalletInfo(): Promise<void> {
    if (!this.walletInfo) return;

    const xverse = (window as any).xverse;
    if (!xverse) {
      throw new Error('Xverse wallet not found');
    }

    // Get updated balance
    const balance = await xverse.bitcoin.getBalance(this.walletInfo.address);
    
    // Update wallet info
    this.walletInfo = {
      ...this.walletInfo,
      balance: balance / 100000000 // Convert from satoshis to BTC
    };
  }

  private async signMessageWithXverse(message: string): Promise<string> {
    const xverse = (window as any).xverse;
    if (!xverse) {
      throw new Error('Xverse wallet not found');
    }

    const signature = await xverse.bitcoin.signMessage(this.walletInfo?.address || '', message);
    return signature;
  }

  private async sendTransactionWithXverse(receiverAddress: string, amountBTC: number): Promise<string> {
    const xverse = (window as any).xverse;
    if (!xverse) {
      throw new Error('Xverse wallet not found');
    }

    // Convert BTC to satoshis
    const amountSatoshis = Math.floor(amountBTC * 100000000);
    
    // Create and send transaction
    const txResponse = await xverse.bitcoin.sendBitcoin({
      recipients: [{ address: receiverAddress, amountSats: amountSatoshis }]
    });
    
    return txResponse.txid;
  }

  // OKX wallet methods
  private async connectOKX(): Promise<void> {
    const okxwallet = (window as any).okxwallet;
    if (!okxwallet) {
      throw new Error('OKX wallet not found');
    }

    // Request accounts from OKX
    const accounts = await okxwallet.bitcoin.requestAccounts();
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found in OKX wallet');
    }

    // Get network and balance
    const network = await okxwallet.bitcoin.getNetwork();
    const balance = await okxwallet.bitcoin.getBalance(accounts[0]);

    // Set wallet info
    this.walletInfo = {
      address: accounts[0],
      balance: balance / 100000000, // Convert from satoshis to BTC
      network: this.mapNetworkType(network),
      isConnected: true
    };
  }

  private async refreshOKXWalletInfo(): Promise<void> {
    if (!this.walletInfo) return;

    const okxwallet = (window as any).okxwallet;
    if (!okxwallet) {
      throw new Error('OKX wallet not found');
    }

    // Get updated balance
    const balance = await okxwallet.bitcoin.getBalance(this.walletInfo.address);
    
    // Update wallet info
    this.walletInfo = {
      ...this.walletInfo,
      balance: balance / 100000000 // Convert from satoshis to BTC
    };
  }

  private async signMessageWithOKX(message: string): Promise<string> {
    const okxwallet = (window as any).okxwallet;
    if (!okxwallet) {
      throw new Error('OKX wallet not found');
    }

    const signature = await okxwallet.bitcoin.signMessage(message, this.walletInfo?.address || '');
    return signature;
  }

  private async sendTransactionWithOKX(receiverAddress: string, amountBTC: number): Promise<string> {
    const okxwallet = (window as any).okxwallet;
    if (!okxwallet) {
      throw new Error('OKX wallet not found');
    }

    // Convert BTC to satoshis
    const amountSatoshis = Math.floor(amountBTC * 100000000);
    
    // Send transaction
    const txid = await okxwallet.bitcoin.sendTransaction({
      to: receiverAddress,
      amount: amountSatoshis,
      from: this.walletInfo?.address || ''
    });
    
    return txid;
  }

  // Leather wallet methods
  private async connectLeather(): Promise<void> {
    const leather = (window as any).leather;
    if (!leather) {
      throw new Error('Leather wallet not found');
    }

    // Connect to Leather
    const connection = await leather.enable();
    const address = await leather.getAddress();
    
    // Get network type
    const network = await leather.getNetwork();
    
    // Get balance
    const balance = await leather.getBalance(address);

    // Set wallet info
    this.walletInfo = {
      address,
      balance: balance / 100000000, // Convert from satoshis to BTC
      network: this.mapNetworkType(network),
      isConnected: true
    };
  }

  private async refreshLeatherWalletInfo(): Promise<void> {
    if (!this.walletInfo) return;

    const leather = (window as any).leather;
    if (!leather) {
      throw new Error('Leather wallet not found');
    }

    // Get updated balance
    const balance = await leather.getBalance(this.walletInfo.address);
    
    // Update wallet info
    this.walletInfo = {
      ...this.walletInfo,
      balance: balance / 100000000 // Convert from satoshis to BTC
    };
  }

  private async signMessageWithLeather(message: string): Promise<string> {
    const leather = (window as any).leather;
    if (!leather) {
      throw new Error('Leather wallet not found');
    }

    const signature = await leather.signMessage(message);
    return signature;
  }

  private async sendTransactionWithLeather(receiverAddress: string, amountBTC: number): Promise<string> {
    const leather = (window as any).leather;
    if (!leather) {
      throw new Error('Leather wallet not found');
    }

    // Convert BTC to satoshis
    const amountSatoshis = Math.floor(amountBTC * 100000000);
    
    // Send transaction
    const txid = await leather.sendTransaction({
      recipient: receiverAddress,
      amount: amountSatoshis,
      memo: "Chronos Vault Transfer"
    });
    
    return txid;
  }

  // Helper methods
  private mapNetworkType(networkValue: string): BitcoinNetworkType {
    // Map network value to BitcoinNetworkType
    switch (networkValue.toLowerCase()) {
      case 'mainnet':
      case 'main':
      case 'livenet':
        return 'mainnet';
      case 'testnet':
      case 'test':
        return 'testnet';
      case 'regtest':
        return 'regtest';
      default:
        // Default to testnet for safety
        return 'testnet';
    }
  }
}