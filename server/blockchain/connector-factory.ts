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
    // If the blockchain connector initialization is skipped, return a mock connector
    if (config.featureFlags.SKIP_BLOCKCHAIN_CONNECTOR_INIT) {
      // Return an empty connector that will be populated with mock methods
      const connector = {
        chainId,
        chainName: chainId.charAt(0).toUpperCase() + chainId.slice(1),
        isTestnet: true,
        connectWallet: async () => "simulated_address",
        disconnectWallet: async () => {},
        isConnected: async () => true,
        getAddress: async () => "simulated_address",
        getBalance: async () => "1000.0",
        createVault: async () => ({ success: true, transactionHash: `simulated_tx_${Date.now()}`, vaultId: `${chainId}_vault_${Date.now()}`, chainId }),
        getVaultInfo: async () => ({
          id: `${chainId}_vault_${Date.now()}`,
          owner: "simulated_address",
          unlockDate: new Date(Date.now() + 86400000 * 30), // 30 days from now
          isLocked: true,
          balance: "1000.0",
          chainId,
          network: "testnet",
          securityLevel: "medium",
          lastActivity: new Date()
        }),
        listVaults: async () => [],
        lockAssets: async () => ({ success: true, transactionHash: `simulated_tx_${Date.now()}`, chainId }),
        unlockAssets: async () => ({ success: true, transactionHash: `simulated_tx_${Date.now()}`, chainId }),
        addBeneficiary: async () => ({ success: true, transactionHash: `simulated_tx_${Date.now()}`, chainId }),
        removeBeneficiary: async () => ({ success: true, transactionHash: `simulated_tx_${Date.now()}`, chainId }),
        verifyVaultIntegrity: async () => ({ isValid: true, signatures: [], verifiedAt: new Date(), chainId }),
        signMessage: async () => "simulated_signature",
        verifySignature: async () => true,
        createMultiSigRequest: async () => "simulated_request_id",
        approveMultiSigRequest: async () => ({ success: true, transactionHash: `simulated_tx_${Date.now()}`, chainId }),
        getChainSpecificFeatures: () => ({}),
        getMultiSigStatus: async () => ({}),
        initiateVaultSync: async () => ({}),
        verifyVaultAcrossChains: async () => ({}),
        executeChainSpecificMethod: async () => ({}),
        subscribeToVaultEvents: () => () => {},
        subscribeToBlockchainEvents: () => () => {}
      } as BlockchainConnector;
      
      return connector;
    }
    
    // Otherwise create a real connector
    switch (chainId) {
      case 'ethereum':
        return new EthereumConnector(config.blockchainConfig.ethereum.isTestnet);
      
      case 'solana':
        return new SolanaConnector(config.blockchainConfig.solana.isTestnet);
      
      case 'ton':
        return new TonConnector(config.blockchainConfig.ton.isTestnet);
      
      case 'bitcoin':
        return new BitcoinConnector(config.blockchainConfig.bitcoin.isTestnet);
      
      default:
        throw new Error(`Unsupported blockchain: ${chainId}`);
    }
  }
  
  /**
   * Initialize all blockchain connectors
   */
  private initializeConnectors() {
    try {
      // Check if we should skip blockchain connector initialization
      if (config.featureFlags.SKIP_BLOCKCHAIN_CONNECTOR_INIT) {
        securityLogger.info('Skipping blockchain connector initialization due to SKIP_BLOCKCHAIN_CONNECTOR_INIT flag');
        
        // Create mock connectors for development
        if (config.isDevelopmentMode) {
          // Create simulated connectors for development
          const createMockConnector = (chainId: string) => {
            const connector = {
              chainId,
              chainName: chainId.charAt(0).toUpperCase() + chainId.slice(1),
              isTestnet: true,
              connectWallet: async () => "simulated_address",
              disconnectWallet: async () => {},
              isConnected: async () => true,
              getAddress: async () => "simulated_address",
              getBalance: async () => "1000.0",
              createVault: async () => ({ success: true, transactionHash: `simulated_tx_${Date.now()}`, vaultId: `${chainId}_vault_${Date.now()}`, chainId }),
              getVaultInfo: async () => ({
                id: `${chainId}_vault_${Date.now()}`,
                owner: "simulated_address",
                unlockDate: new Date(Date.now() + 86400000 * 30), // 30 days from now
                isLocked: true,
                balance: "1000.0",
                chainId,
                network: "testnet",
                securityLevel: "medium",
                lastActivity: new Date()
              }),
              listVaults: async () => [],
              lockAssets: async () => ({ success: true, transactionHash: `simulated_tx_${Date.now()}`, chainId }),
              unlockAssets: async () => ({ success: true, transactionHash: `simulated_tx_${Date.now()}`, chainId }),
              addBeneficiary: async () => ({ success: true, transactionHash: `simulated_tx_${Date.now()}`, chainId }),
              removeBeneficiary: async () => ({ success: true, transactionHash: `simulated_tx_${Date.now()}`, chainId }),
              verifyVaultIntegrity: async () => ({ isValid: true, signatures: [], verifiedAt: new Date(), chainId }),
              signMessage: async () => "simulated_signature",
              verifySignature: async () => true,
              createMultiSigRequest: async () => "simulated_request_id",
              approveMultiSigRequest: async () => ({ success: true, transactionHash: `simulated_tx_${Date.now()}`, chainId }),
              getChainSpecificFeatures: () => ({}),
              getMultiSigStatus: async () => ({}),
              initiateVaultSync: async () => ({}),
              verifyVaultAcrossChains: async () => ({}),
              executeChainSpecificMethod: async () => ({}),
              subscribeToVaultEvents: () => () => {},
              subscribeToBlockchainEvents: () => () => {}
            } as BlockchainConnector;
            
            return connector;
          };
          
          this.connectors.set('ethereum', createMockConnector('ethereum'));
          this.connectors.set('solana', createMockConnector('solana'));
          this.connectors.set('ton', createMockConnector('ton'));
          this.connectors.set('bitcoin', createMockConnector('bitcoin'));
          
          securityLogger.info('Initialized mock blockchain connectors for development mode');
        }
        
        return;
      }
      
      // Initialize only the connectors that are enabled in config
      if (config.blockchainConfig.ethereum.enabled) {
        this.connectors.set('ethereum', new EthereumConnector(config.blockchainConfig.ethereum.isTestnet));
      }
      
      if (config.blockchainConfig.solana.enabled) {
        this.connectors.set('solana', new SolanaConnector(config.blockchainConfig.solana.isTestnet));
      }
      
      if (config.blockchainConfig.ton.enabled) {
        this.connectors.set('ton', new TonConnector(config.blockchainConfig.ton.isTestnet));
      }
      
      if (config.blockchainConfig.bitcoin.enabled) {
        this.connectors.set('bitcoin', new BitcoinConnector(config.blockchainConfig.bitcoin.isTestnet));
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