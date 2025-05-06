/**
 * Blockchain Connector Exports
 * Central file for exporting all blockchain connector implementations
 */

// Export Polygon connector
export { PolygonConnector } from './polygon-connector';

// Export connector factory
export { BlockchainConnectorFactory } from './connector-factory';

// Note: The following connectors are referenced in the factory but not actually implemented yet.
// They are commented out to prevent compilation errors until actual implementations are added.

/*
// Export Ethereum connector
export { EthereumConnector } from './ethereum-connector';

// Export Solana connector
export { SolanaConnector } from './solana-connector';

// Export TON connector
export { TonConnector } from './ton-connector';

// Export Bitcoin connector
export { BitcoinConnector } from './bitcoin-connector';
*/

// Re-export blockchain connector interface
export { BlockchainConnector } from '../../shared/interfaces/blockchain-connector';
