import { BlockchainConnector } from '../../shared/interfaces/blockchain-connector';
import { EthereumConnector } from './ethereum-connector';
import { SolanaConnector } from './solana-connector';
import { TonConnector } from './ton-connector';
import { BitcoinConnector } from './bitcoin-connector';
import { PolygonConnector } from './polygon-connector';

/**
 * Blockchain Connector Factory
 * Creates and manages blockchain connector instances for all supported chains
 */

export class BlockchainConnectorFactory {
  private static instance: BlockchainConnectorFactory;
  private connectors: Map<string, BlockchainConnector> = new Map();
  private isTestnet: boolean;
  
  private constructor(isTestnet: boolean = true) {
    this.isTestnet = isTestnet;
    this.initializeConnectors();
  }
  
  /**
   * Get the singleton instance of the connector factory
   */
  public static getInstance(isTestnet: boolean = true): BlockchainConnectorFactory {
    if (!BlockchainConnectorFactory.instance) {
      BlockchainConnectorFactory.instance = new BlockchainConnectorFactory(isTestnet);
    }
    return BlockchainConnectorFactory.instance;
  }
  
  /**
   * Initialize all supported blockchain connectors
   */
  private initializeConnectors(): void {
    // Initialize connectors for each supported blockchain
    try {
      // Add Ethereum connector
      const ethereumConnector = new EthereumConnector(this.isTestnet);
      this.connectors.set(ethereumConnector.chainId, ethereumConnector);
      
      // Add Solana connector
      const solanaConnector = new SolanaConnector(this.isTestnet);
      this.connectors.set(solanaConnector.chainId, solanaConnector);
      
      // Add TON connector
      const tonConnector = new TonConnector(this.isTestnet);
      this.connectors.set(tonConnector.chainId, tonConnector);
      
      // Add Bitcoin connector
      const bitcoinConnector = new BitcoinConnector(this.isTestnet);
      this.connectors.set(bitcoinConnector.chainId, bitcoinConnector);
      
      // Add Polygon connector (for EVM compatibility)
      const polygonConnector = new PolygonConnector(this.isTestnet);
      this.connectors.set(polygonConnector.chainId, polygonConnector);
    } catch (error) {
      console.error('Error initializing blockchain connectors:', error);
    }
    
    console.info(`Initialized ${this.connectors.size} blockchain connectors`);
  }
  
  /**
   * Get a connector for a specific blockchain
   */
  public getConnector(chainId: string): BlockchainConnector {
    const connector = this.connectors.get(chainId);
    if (!connector) {
      throw new Error(`No connector available for chain ID: ${chainId}`);
    }
    return connector;
  }
  
  /**
   * Get all available connectors
   */
  public getAllConnectors(): BlockchainConnector[] {
    return Array.from(this.connectors.values());
  }
  
  /**
   * Get connectors for specified chains
   */
  public getConnectors(chainIds: string[]): BlockchainConnector[] {
    return chainIds.map(id => this.getConnector(id));
  }
  
  /**
   * Check if a connector is available for a specific chain
   */
  public hasConnector(chainId: string): boolean {
    return this.connectors.has(chainId);
  }
  
  /**
   * Add a new connector (for testing or dynamic addition)
   */
  public addConnector(connector: BlockchainConnector): void {
    this.connectors.set(connector.chainId, connector);
  }
  
  /**
   * Remove a connector
   */
  public removeConnector(chainId: string): boolean {
    return this.connectors.delete(chainId);
  }
  
  /**
   * Recreate all connectors (useful for environment changes)
   */
  public resetConnectors(isTestnet?: boolean): void {
    if (isTestnet !== undefined) {
      this.isTestnet = isTestnet;
    }
    
    this.connectors.clear();
    this.initializeConnectors();
  }
}
