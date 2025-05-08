/**
 * Connector Factory
 * 
 * This factory creates and manages blockchain connector instances.
 * It ensures we only have one instance of each connector and provides
 * a simple interface for other parts of the application to access connectors.
 */

import { BlockchainConnector } from '../../shared/interfaces/blockchain-connector';
import { EthereumConnector } from './ethereum-connector';
import { SolanaConnector } from './solana-connector';
import { TonConnector } from './ton-connector';
import { BitcoinConnector } from './bitcoin-connector';
import config from '../config';
import { securityLogger } from '../monitoring/security-logger';

/**
 * Factory for creating and managing blockchain connector instances
 */
export class ConnectorFactory {
  private connectors: Map<string, BlockchainConnector>;
  
  constructor() {
    this.connectors = new Map();
    this.initializeConnectors();
  }
  
  /**
   * Get a connector for a specific blockchain
   * 
   * @param chainId The blockchain identifier (ethereum, solana, ton, bitcoin)
   * @returns The blockchain connector instance
   */
  getConnector(chainId: string): BlockchainConnector {
    // Normalize chainId to lowercase
    const normalizedChainId = chainId.toLowerCase();
    
    // Get the existing connector or create a new one
    let connector = this.connectors.get(normalizedChainId);
    
    if (!connector) {
      connector = this.createConnector(normalizedChainId);
      this.connectors.set(normalizedChainId, connector);
    }
    
    return connector;
  }
  
  /**
   * Create a new connector for a specific blockchain
   * 
   * @param chainId The blockchain identifier
   * @returns A new blockchain connector
   */
  private createConnector(chainId: string): BlockchainConnector {
    switch (chainId) {
      case 'ethereum':
        return new EthereumConnector(config.blockchainConfig.ethereum);
      
      case 'solana':
        return new SolanaConnector(config.blockchainConfig.solana);
      
      case 'ton':
        return new TonConnector(config.blockchainConfig.ton);
      
      case 'bitcoin':
        return new BitcoinConnector(config.blockchainConfig.bitcoin);
      
      default:
        throw new Error(`Unsupported blockchain: ${chainId}`);
    }
  }
  
  /**
   * Initialize all blockchain connectors
   */
  private initializeConnectors() {
    try {
      // Initialize only the connectors that are enabled in config
      if (config.blockchainConfig.ethereum.enabled) {
        this.connectors.set('ethereum', new EthereumConnector(config.blockchainConfig.ethereum));
      }
      
      if (config.blockchainConfig.solana.enabled) {
        this.connectors.set('solana', new SolanaConnector(config.blockchainConfig.solana));
      }
      
      if (config.blockchainConfig.ton.enabled) {
        this.connectors.set('ton', new TonConnector(config.blockchainConfig.ton));
      }
      
      if (config.blockchainConfig.bitcoin.enabled) {
        this.connectors.set('bitcoin', new BitcoinConnector(config.blockchainConfig.bitcoin));
      }
      
      securityLogger.info('Blockchain connectors initialized', {
        enabledConnectors: Array.from(this.connectors.keys())
      });
    } catch (error) {
      securityLogger.error('Failed to initialize blockchain connectors', {
        error
      });
    }
  }
  
  /**
   * Get all initialized connectors
   * 
   * @returns A record of all blockchain connectors
   */
  getAllConnectors(): Record<string, BlockchainConnector> {
    // Convert the map to a record
    const record: Record<string, BlockchainConnector> = {};
    
    for (const [chainId, connector] of this.connectors.entries()) {
      record[chainId] = connector;
    }
    
    return record;
  }
}