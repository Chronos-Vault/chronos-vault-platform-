// Bitcoin wallet connector service
import { BitcoinNetworkType } from './bitcoin-types';

// Types for Bitcoin wallet connection
export interface BitcoinWalletInfo {
  address: string;
  balance: number;
  network: BitcoinNetworkType;
  publicKey?: string;
  isConnected: boolean;
}

// BitcoinWallet class to handle wallet connections
export class BitcoinWalletConnector {
  private static instance: BitcoinWalletConnector;
  private walletInfo: BitcoinWalletInfo | null = null;
  private walletProviders: string[] = ['Unisat', 'Xverse', 'OKX', 'Leather']; // Supported wallet providers
  private detectInterval: NodeJS.Timeout | null = null;
  private callbacks: ((walletInfo: BitcoinWalletInfo | null) => void)[] = [];

  // Private constructor for singleton pattern
  private constructor() {
    this.detectWalletProviders();
  }

  // Get singleton instance
  public static getInstance(): BitcoinWalletConnector {
    if (!BitcoinWalletConnector.instance) {
      BitcoinWalletConnector.instance = new BitcoinWalletConnector();
    }
    return BitcoinWalletConnector.instance;
  }

  // Detect available Bitcoin wallet providers
  private detectWalletProviders(): void {
    this.detectInterval = setInterval(() => {
      // Check for window.unisat (Unisat wallet)
      if ((window as any).unisat) {
        console.log('Unisat wallet detected');
        clearInterval(this.detectInterval as NodeJS.Timeout);
        this.detectInterval = null;
      }
      
      // Check for window.xverse (Xverse wallet)
      if ((window as any).xverse) {
        console.log('Xverse wallet detected');
        clearInterval(this.detectInterval as NodeJS.Timeout);
        this.detectInterval = null;
      }
    }, 1000);
  }

  // Subscribe to wallet changes
  public subscribe(callback: (walletInfo: BitcoinWalletInfo | null) => void): void {
    this.callbacks.push(callback);
    
    // Immediately call with current wallet info
    if (this.walletInfo) {
      callback(this.walletInfo);
    }
  }

  // Unsubscribe from wallet changes
  public unsubscribe(callback: (walletInfo: BitcoinWalletInfo | null) => void): void {
    this.callbacks = this.callbacks.filter(cb => cb !== callback);
  }

  // Notify all subscribers of wallet changes
  private notifySubscribers(): void {
    this.callbacks.forEach(callback => callback(this.walletInfo));
  }

  // Get available wallet providers
  public getAvailableProviders(): string[] {
    const available: string[] = [];
    
    if ((window as any).unisat) {
      available.push('Unisat');
    }
    
    if ((window as any).xverse) {
      available.push('Xverse');
    }
    
    // More wallet detections can be added here
    
    return available;
  }

  // Connect to Bitcoin wallet
  public async connect(provider: string = 'Unisat'): Promise<BitcoinWalletInfo> {
    try {
      let connected = false;
      
      // Connect to Unisat Wallet
      if (provider === 'Unisat' && (window as any).unisat) {
        const unisat = (window as any).unisat;
        
        // Request accounts access
        const accounts = await unisat.requestAccounts();
        
        if (accounts && accounts.length > 0) {
          const address = accounts[0];
          const network = await unisat.getNetwork();
          const balance = await unisat.getBalance();
          const publicKey = await unisat.getPublicKey();
          
          this.walletInfo = {
            address,
            balance: balance.total / 100000000, // Convert sats to BTC
            network: network === 'livenet' ? 'mainnet' : network,
            publicKey,
            isConnected: true
          };
          
          connected = true;
          
          // Set up event listeners for account changes
          (window as any).addEventListener('unisat:accountsChanged', (accounts: string[]) => {
            if (accounts.length === 0) {
              this.disconnect();
            } else {
              this.refreshWalletInfo();
            }
          });
        }
      }
      
      // Connect to Xverse Wallet
      if (provider === 'Xverse' && (window as any).xverse) {
        const xverse = (window as any).xverse;
        
        // Request accounts access
        const response = await xverse.bitcoin.request('getAccounts');
        
        if (response && response.result && response.result.addresses) {
          const btcAddress = response.result.addresses.find((addr: any) => addr.type === 'p2wpkh');
          
          if (btcAddress) {
            this.walletInfo = {
              address: btcAddress.address,
              balance: 0, // Xverse doesn't provide balance directly
              network: response.result.network === 'mainnet' ? 'mainnet' : 'testnet',
              isConnected: true
            };
            
            connected = true;
            
            // Try to get balance if possible
            try {
              const balanceResponse = await xverse.bitcoin.request('getBalance', {
                address: btcAddress.address
              });
              
              if (balanceResponse && balanceResponse.result) {
                this.walletInfo.balance = balanceResponse.result.balance / 100000000; // Convert sats to BTC
              }
            } catch (error) {
              console.warn('Could not retrieve balance from Xverse wallet:', error);
            }
          }
        }
      }
      
      // If no wallet was connected, throw error
      if (!connected) {
        throw new Error(`Could not connect to ${provider} wallet. Make sure it's installed and unlocked.`);
      }
      
      // Notify subscribers about wallet connection
      this.notifySubscribers();
      
      return this.walletInfo as BitcoinWalletInfo;
    } catch (error) {
      console.error('Error connecting to Bitcoin wallet:', error);
      throw error;
    }
  }

  // Disconnect from Bitcoin wallet
  public disconnect(): void {
    this.walletInfo = null;
    this.notifySubscribers();
  }

  // Check if wallet is connected
  public isConnected(): boolean {
    return this.walletInfo !== null && this.walletInfo.isConnected;
  }

  // Get current wallet info
  public getWalletInfo(): BitcoinWalletInfo | null {
    return this.walletInfo;
  }

  // Refresh wallet info (balance, etc.)
  public async refreshWalletInfo(): Promise<BitcoinWalletInfo | null> {
    if (!this.walletInfo || !this.walletInfo.isConnected) {
      return null;
    }
    
    try {
      // Refresh Unisat wallet info
      if ((window as any).unisat) {
        const unisat = (window as any).unisat;
        const network = await unisat.getNetwork();
        const balance = await unisat.getBalance();
        
        this.walletInfo = {
          ...this.walletInfo,
          balance: balance.total / 100000000, // Convert sats to BTC
          network: network === 'livenet' ? 'mainnet' : network
        };
      }
      
      // Refresh Xverse wallet info (if implemented)
      
      this.notifySubscribers();
      return this.walletInfo;
    } catch (error) {
      console.error('Error refreshing wallet info:', error);
      return this.walletInfo;
    }
  }

  // Sign a message with the connected wallet
  public async signMessage(message: string): Promise<string> {
    if (!this.walletInfo || !this.walletInfo.isConnected) {
      throw new Error('Wallet not connected');
    }
    
    try {
      // Sign with Unisat wallet
      if ((window as any).unisat) {
        const unisat = (window as any).unisat;
        const signature = await unisat.signMessage(message);
        return signature;
      }
      
      // Sign with Xverse wallet
      if ((window as any).xverse) {
        const xverse = (window as any).xverse;
        const response = await xverse.bitcoin.request('signMessage', {
          message,
          address: this.walletInfo.address
        });
        
        if (response && response.result && response.result.signature) {
          return response.result.signature;
        }
      }
      
      throw new Error('No compatible wallet found for signing');
    } catch (error) {
      console.error('Error signing message:', error);
      throw error;
    }
  }

  // Send Bitcoin transaction (simplified)
  public async sendTransaction(receiverAddress: string, amountBTC: number): Promise<string> {
    if (!this.walletInfo || !this.walletInfo.isConnected) {
      throw new Error('Wallet not connected');
    }
    
    try {
      // Send with Unisat wallet
      if ((window as any).unisat) {
        const unisat = (window as any).unisat;
        // Convert BTC to satoshis
        const amountSats = Math.floor(amountBTC * 100000000);
        const txid = await unisat.sendBitcoin(receiverAddress, amountSats);
        return txid;
      }
      
      // Send with Xverse wallet
      if ((window as any).xverse) {
        const xverse = (window as any).xverse;
        const response = await xverse.bitcoin.request('sendTransfer', {
          recipients: [
            {
              address: receiverAddress,
              amountSats: Math.floor(amountBTC * 100000000)
            }
          ],
          senderAddress: this.walletInfo.address
        });
        
        if (response && response.result && response.result.txid) {
          return response.result.txid;
        }
      }
      
      throw new Error('No compatible wallet found for sending transaction');
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  }

  // Clean up resources
  public cleanup(): void {
    if (this.detectInterval) {
      clearInterval(this.detectInterval);
      this.detectInterval = null;
    }
    
    this.callbacks = [];
    this.walletInfo = null;
  }
}

// Create a hook for using BitcoinWalletConnector
export function useBitcoinWallet() {
  return BitcoinWalletConnector.getInstance();
}