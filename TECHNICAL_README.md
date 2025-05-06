# Chronos Vault Technical Documentation

## Project Architecture

Chronos Vault is built using a modern, scalable web architecture with blockchain integration:

### Frontend

- **Framework**: React.js with TypeScript
- **State Management**: React Query for server state
- **Routing**: Wouter
- **UI**: TailwindCSS with ShadCN components
- **Styling**: Custom theme with gradients and animations

### Backend

- **Server**: Express.js
- **Database**: PostgreSQL with DrizzleORM
- **Authentication**: Multi-chain wallet authentication

### Blockchain Integration

- **TON**: Primary blockchain using TON Connect SDK
- **Ethereum**: Integration via ethers.js
- **Solana**: Integration via @solana/web3.js
- **Cross-Chain**: Custom bridge implementations

## Development Setup

### Prerequisites

- Node.js v20 or higher
- PostgreSQL database
- Blockchain API keys (TON, Ethereum, Solana)

### Environment Variables

The following environment variables are required:

```
DATABASE_URL=postgresql://user:password@localhost:5432/chronos_vault
TON_API_KEY=your_ton_api_key
ETHEREUM_RPC_URL=your_ethereum_rpc_url
SOLANA_RPC_URL=your_solana_rpc_url
```

### Installation

```bash
npm install
npm run db:push  # Initialize database schema
npm run dev      # Start development server
```

## Core Components

### Triple-Chain Security System

The security system leverages three blockchains for maximum protection:

- **Ethereum Service**: Provides ownership verification and primary security
- **Solana Service**: High-frequency monitoring for rapid threat detection
- **TON Service**: Backup security system and recovery mechanisms

These services are coordinated by the `SecurityServiceAggregator` which manages cross-chain validation.

### Permanent Storage System

Chronos Vault uses Arweave with Bundlr for permanent, decentralized storage:

#### How Storage Works in Chronos Vault

When a user uploads files in our system:

1. **First Upload**: The file is uploaded through our interface to Bundlr
2. **Permanent Storage**: Bundlr processes the payment and stores the file permanently on Arweave network
3. **Link to Vault**: The transaction ID (like a receipt) is saved in our database and connected to the user's vault
4. **Cross-Chain Verification**: We record proof of this storage across multiple blockchains for extra security

This means:
- Files are stored permanently and can't be deleted
- Data is completely decentralized (not on our servers)
- Each file has a unique transaction ID that proves ownership
- Vaults contain references to these files but not the files themselves

This architecture provides users with both permanent decentralized storage and a user-friendly management interface.

### Cross-Chain Bridge

Chronos Vault implements a secure bridge system:

- Lock-and-mint mechanism for cross-chain asset transfer
- Multi-signature validator requirements
- Economic security through slashing mechanisms
- Cross-chain verification with proof-of-stake

### Zero-Knowledge Privacy Layer

The privacy system uses zero-knowledge proofs to enable:

- Selective disclosure of vault information
- Range proof generation
- Cross-chain proof verification
- Integration with the security infrastructure

## Smart Contracts

### TON Contracts

```
@name: CV_TON_Jetton
@max_supply: 21000000000000000 ; 21M with 9 decimals
@decimals: 9
@description: ChronosToken - Utility token for Chronos Vault platform
```

### Ethereum Contracts

```solidity
contract ChronosToken is ERC20, ERC20Burnable, Ownable, ERC20Permit, ERC20Votes {
    // Bridge address that can mint/burn tokens for cross-chain operations
    address public bridge;
    
    // Events
    event BridgeUpdated(address indexed previousBridge, address indexed newBridge);
}
```

### Solana Contracts

Implemented using the Solana Program Library (SPL) token standard with Metaplex extensions.

## Testing

```bash
npm run test        # Run unit tests
npm run test:e2e    # Run end-to-end tests
npm run test:chain  # Run blockchain integration tests
```

## Deployment

```bash
npm run build       # Build for production
npm run start       # Start production server
```

## Security Considerations

- All smart contracts undergo formal verification
- Security audits are performed by independent third parties
- Bug bounty program with substantial rewards is maintained
- Quantum-resistant cryptographic methods for long-term security
- Defense-in-depth approach to protocol operations

## Support and Contact

For technical inquiries and development support, please contact the Chronos Vault development team at chronosvault@chronosvault.org.
