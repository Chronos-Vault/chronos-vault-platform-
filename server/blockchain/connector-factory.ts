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
    // Check if this specific blockchain should be simulated using the blockchain-specific flags
    if (config.shouldSimulateBlockchain(chainId as any)) {
      // Get the simulation configuration for this chain
      const simConfig = config.simulation[chainId as keyof typeof config.simulation];
      
      // Use more realistic simulation data from the configuration
      const walletAddress = simConfig?.walletAddress || "simulated_address";
      const defaultBalance = simConfig?.balances?.default || "1000.0";
      const successRates = simConfig?.transactions?.successRates || { 
        vaultCreation: 0.98,
        assetDeposit: 0.99,
        assetWithdrawal: 0.97,
        beneficiaryUpdate: 0.995
      };
      
      // Helper function to simulate transaction delay
      const simulateDelay = async (min: number = 1000, max: number = 5000): Promise<void> => {
        if (!config.isDevelopmentMode) return;
        
        const delayTime = Math.floor(
          Math.random() * (max - min + 1) + min
        );
        
        if (process.env.VERBOSE_LOGGING === 'true') {
          securityLogger.debug(`Simulating ${chainId} blockchain delay: ${delayTime}ms`);
        }
        
        return new Promise(resolve => setTimeout(resolve, delayTime));
      };
      
      // Helper function to simulate transaction with success rate
      const simulateTransaction = async (
        operationType: keyof typeof successRates,
        transactionType: string,
        minDelay: number = 1000,
        maxDelay: number = 5000
      ) => {
        // Apply success rate
        const isSuccessful = Math.random() <= successRates[operationType];
        
        // Simulate transaction delay
        await simulateDelay(minDelay, maxDelay);
        
        if (!isSuccessful) {
          return {
            success: false,
            error: `Transaction failed: ${chainId} network congestion or validation error`,
            chainId
          };
        }
        
        // Generate a more realistic transaction hash
        const timestamp = Date.now();
        const txHash = `0x${timestamp.toString(16)}_${Math.floor(Math.random() * 1000000).toString(16)}`;
        
        return {
          success: true,
          transactionHash: txHash,
          vaultId: `${chainId}_vault_${timestamp}`,
          chainId
        };
      };
      
      // Return a mock connector with realistic simulation
      const connector = {
        chainId,
        chainName: chainId.charAt(0).toUpperCase() + chainId.slice(1),
        isTestnet: true,
        connectWallet: async () => walletAddress,
        disconnectWallet: async () => {},
        isConnected: async () => true,
        getAddress: async () => walletAddress,
        getBalance: async () => defaultBalance,
        createVault: async () => simulateTransaction('vaultCreation', 'create_vault',
          simConfig?.simulatedDelay?.transaction?.min,
          simConfig?.simulatedDelay?.transaction?.max
        ),
        getVaultInfo: async (vaultId: string) => {
          // Simulate delay for read operations
          await simulateDelay(100, 1000);
          
          const now = new Date();
          return {
            id: vaultId || `${chainId}_vault_${Date.now()}`,
            owner: walletAddress,
            unlockDate: new Date(now.getTime() + 86400000 * 30), // 30 days from now
            isLocked: true,
            balance: defaultBalance,
            chainId,
            network: "testnet",
            securityLevel: "medium",
            lastActivity: new Date(now.getTime() - 24 * 60 * 60 * 1000) // 1 day ago
          };
        },
        listVaults: async () => {
          // Simulate delay
          await simulateDelay(200, 2000);
          
          // Return a few simulated vaults
          const now = new Date();
          return [
            {
              id: `${chainId}_vault_${Date.now() - 86400000 * 7}`, // 1 week old
              owner: walletAddress,
              unlockDate: new Date(now.getTime() + 86400000 * 30), // 30 days from now
              isLocked: true,
              balance: defaultBalance,
              chainId,
              network: "testnet",
              securityLevel: "high",
              lastActivity: new Date(now.getTime() - 86400000 * 3) // 3 days ago
            },
            {
              id: `${chainId}_vault_${Date.now() - 86400000}`, // 1 day old
              owner: walletAddress,
              unlockDate: new Date(now.getTime() + 86400000 * 10), // 10 days from now
              isLocked: true,
              balance: (parseFloat(defaultBalance) / 2).toString(),
              chainId,
              network: "testnet",
              securityLevel: "medium",
              lastActivity: new Date(now.getTime() - 12 * 60 * 60 * 1000) // 12 hours ago
            }
          ];
        },
        lockAssets: async () => simulateTransaction('assetDeposit', 'lock_assets',
          simConfig?.simulatedDelay?.transaction?.min,
          simConfig?.simulatedDelay?.transaction?.max
        ),
        unlockAssets: async () => simulateTransaction('assetWithdrawal', 'unlock_assets',
          simConfig?.simulatedDelay?.transaction?.min,
          simConfig?.simulatedDelay?.transaction?.max
        ),
        addBeneficiary: async () => simulateTransaction('beneficiaryUpdate', 'add_beneficiary',
          simConfig?.simulatedDelay?.transaction?.min,
          simConfig?.simulatedDelay?.transaction?.max
        ),
        removeBeneficiary: async () => simulateTransaction('beneficiaryUpdate', 'remove_beneficiary',
          simConfig?.simulatedDelay?.transaction?.min,
          simConfig?.simulatedDelay?.transaction?.max
        ),
        verifyVaultIntegrity: async () => {
          await simulateDelay(500, 3000);
          return { 
            isValid: true, 
            signatures: [`${chainId}_sig_${Date.now()}`], 
            verifiedAt: new Date(), 
            chainId 
          };
        },
        signMessage: async () => `${chainId}_signature_${Date.now()}`,
        verifySignature: async () => true,
        createMultiSigRequest: async () => `${chainId}_request_${Date.now()}`,
        approveMultiSigRequest: async () => simulateTransaction('beneficiaryUpdate', 'approve_multisig',
          simConfig?.simulatedDelay?.transaction?.min,
          simConfig?.simulatedDelay?.transaction?.max
        ),
        getChainSpecificFeatures: () => ({}),
        getMultiSigStatus: async () => ({ 
          approved: 1, 
          required: 3, 
          status: 'pending',
          approvers: [walletAddress] 
        }),
        initiateVaultSync: async () => ({ success: true }),
        verifyVaultAcrossChains: async () => ({
          [chainId]: {
            isValid: true,
            signatures: [`${chainId}_cross_sig_${Date.now()}`],
            verifiedAt: new Date(),
            chainId
          }
        }),
        executeChainSpecificMethod: async () => ({ success: true }),
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
      // Create an array of supported chains
      const supportedChains = ['ethereum', 'solana', 'ton', 'bitcoin'];
      
      // Check chain-specific simulation flags and create appropriate connectors
      // This allows for mixed mode operation - some chains can be simulated while others use real connections
      for (const chainId of supportedChains) {
        // Use our new shouldSimulateBlockchain helper to check chain-specific flags
        if (config.shouldSimulateBlockchain(chainId as any)) {
          securityLogger.info(`Using simulated connector for ${chainId} based on blockchain-specific simulation flags`);
          
          // Create the connector using our createConnector method which handles simulation
          const simulatedConnector = this.createConnector(chainId);
          this.connectors.set(chainId, simulatedConnector);
        } else if (config.blockchainConfig[chainId as keyof typeof config.blockchainConfig].enabled) {
          // Initialize real connector only if not simulated and enabled in config
          securityLogger.info(`Initializing real ${chainId} connector`);
          
          // Create a real connector for this chain
          switch (chainId) {
            case 'ethereum':
              this.connectors.set(chainId, new EthereumConnector(config.blockchainConfig.ethereum.isTestnet));
              break;
            case 'solana':
              this.connectors.set(chainId, new SolanaConnector(config.blockchainConfig.solana.isTestnet));
              break;
            case 'ton':
              this.connectors.set(chainId, new TonConnector(config.blockchainConfig.ton.isTestnet));
              break;
            case 'bitcoin':
              this.connectors.set(chainId, new BitcoinConnector(config.blockchainConfig.bitcoin.isTestnet));
              break;
          }
        }
      }
      
      // Log information about initialized connectors
      const initializedChains = Array.from(this.connectors.keys());
      if (initializedChains.length > 0) {
        securityLogger.info('Blockchain connectors initialized', {
          enabledConnectors: initializedChains,
          simulatedChains: initializedChains.filter(chain => 
            config.shouldSimulateBlockchain(chain as any)
          )
        });
      } else {
        securityLogger.warn('No blockchain connectors were initialized');
      }
      
      // Return early as we've already set up all required connectors
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