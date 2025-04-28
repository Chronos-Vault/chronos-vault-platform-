import { 
  BlockchainType, 
  IWalletProvider, 
  NetworkType,
  WalletConnectionStatus,
  WalletInfo,
  TransactionResult,
  VaultCreationResult,
  CreateVaultParams
} from './types';

// Import wallet providers
import { solanaService } from '../solana/solana-service';
import { tonService } from '../ton/ton-service';

/**
 * Wallet Factory that manages all wallet providers
 */
export class WalletFactory {
  private static instance: WalletFactory;
  private walletProviders: Map<BlockchainType, IWalletProvider>;
  private currentBlockchain: BlockchainType;
  
  /**
   * Private constructor for singleton pattern
   */
  private constructor() {
    this.walletProviders = new Map();
    this.currentBlockchain = BlockchainType.ETHEREUM; // Default
    
    // Initialize wallet providers
    this.initializeWalletProviders();
  }
  
  /**
   * Initialize wallet providers for each supported blockchain
   */
  private initializeWalletProviders(): void {
    // Register Solana provider
    const solanaProvider: IWalletProvider = {
      connect: async () => {
        return await solanaService.connect();
      },
      disconnect: async () => {
        return await solanaService.disconnect();
      },
      getConnectionStatus: () => {
        // Convert Solana connection status to WalletConnectionStatus
        const status = solanaService.getConnectionStatus();
        switch (status) {
          case 'connected':
            return WalletConnectionStatus.CONNECTED;
          case 'connecting':
            return WalletConnectionStatus.CONNECTING;
          default:
            return WalletConnectionStatus.DISCONNECTED;
        }
      },
      getWalletInfo: () => {
        const walletInfo = solanaService.getWalletInfo();
        if (!walletInfo) return null;
        
        return {
          ...walletInfo,
          blockchain: BlockchainType.SOLANA
        } as WalletInfo;
      },
      getBlockchainType: () => BlockchainType.SOLANA,
      switchNetwork: (network: NetworkType) => {
        // Convert network type to Solana cluster
        switch (network) {
          case 'mainnet':
            solanaService.setCluster('mainnet-beta' as any);
            break;
          case 'testnet':
            solanaService.setCluster('testnet' as any);
            break;
          case 'devnet':
            solanaService.setCluster('devnet' as any);
            break;
          case 'localnet':
            solanaService.setCluster('localnet' as any);
            break;
        }
      },
      sendTransaction: async (params: { toAddress: string, amount: string }): Promise<TransactionResult> => {
        return await solanaService.sendSOL(params.toAddress, params.amount);
      },
      createVault: async (params: CreateVaultParams): Promise<VaultCreationResult> => {
        return await solanaService.createVault(params);
      }
    };
    
    // Register TON provider
    const tonProvider: IWalletProvider = {
      connect: async () => {
        return await tonService.connect();
      },
      disconnect: async () => {
        return await tonService.disconnect();
      },
      getConnectionStatus: () => {
        // Convert TON connection status to WalletConnectionStatus
        const status = tonService.getConnectionStatus();
        switch (status) {
          case 'connected':
            return WalletConnectionStatus.CONNECTED;
          case 'connecting':
            return WalletConnectionStatus.CONNECTING;
          default:
            return WalletConnectionStatus.DISCONNECTED;
        }
      },
      getWalletInfo: () => {
        const walletInfo = tonService.getWalletInfo();
        if (!walletInfo) return null;
        
        return {
          ...walletInfo,
          blockchain: BlockchainType.TON
        } as WalletInfo;
      },
      getBlockchainType: () => BlockchainType.TON,
      switchNetwork: (_network: NetworkType) => {
        // TON doesn't have network switching in our current implementation
        console.log('Network switching not implemented for TON');
      },
      sendTransaction: async (params: { toAddress: string, amount: string }): Promise<TransactionResult> => {
        return await tonService.sendTON(params.toAddress, params.amount);
      },
      createVault: async (params: CreateVaultParams): Promise<VaultCreationResult> => {
        return await tonService.createVault(params);
      }
    };
    
    // Add providers to the map
    this.walletProviders.set(BlockchainType.SOLANA, solanaProvider);
    this.walletProviders.set(BlockchainType.TON, tonProvider);
    
    // TODO: Implement Ethereum and Bitcoin providers when ready
  }
  
  /**
   * Get the singleton instance
   */
  public static getInstance(): WalletFactory {
    if (!WalletFactory.instance) {
      WalletFactory.instance = new WalletFactory();
    }
    return WalletFactory.instance;
  }
  
  /**
   * Get a wallet provider for a specific blockchain
   */
  public getProvider(blockchainType: BlockchainType): IWalletProvider | undefined {
    return this.walletProviders.get(blockchainType);
  }
  
  /**
   * Get the current active blockchain
   */
  public getCurrentBlockchain(): BlockchainType {
    return this.currentBlockchain;
  }
  
  /**
   * Switch the current active blockchain
   */
  public setCurrentBlockchain(blockchainType: BlockchainType): void {
    this.currentBlockchain = blockchainType;
  }
  
  /**
   * Get the current active wallet provider
   */
  public getCurrentProvider(): IWalletProvider | undefined {
    return this.getProvider(this.currentBlockchain);
  }
  
  /**
   * Connect to the current active wallet
   */
  public async connectCurrentWallet(): Promise<boolean> {
    const provider = this.getCurrentProvider();
    if (!provider) return false;
    
    return await provider.connect();
  }
  
  /**
   * Disconnect the current active wallet
   */
  public async disconnectCurrentWallet(): Promise<boolean> {
    const provider = this.getCurrentProvider();
    if (!provider) return false;
    
    return await provider.disconnect();
  }
  
  /**
   * Get all supported blockchains
   */
  public getSupportedBlockchains(): BlockchainType[] {
    return Array.from(this.walletProviders.keys());
  }
  
  /**
   * Check if a blockchain is supported
   */
  public isBlockchainSupported(blockchainType: BlockchainType): boolean {
    return this.walletProviders.has(blockchainType);
  }
}

export const walletFactory = WalletFactory.getInstance();