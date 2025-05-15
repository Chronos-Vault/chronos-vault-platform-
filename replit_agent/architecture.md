# Chronos Vault Architecture

## 1. Overview

Chronos Vault is a multi-chain digital vault platform that enables users to create secure, time-locked digital vaults across multiple blockchain networks (TON, Ethereum, and Solana). The platform implements a "Triple-Chain Security Architecture" to provide enhanced protection for digital assets with cross-chain verification.

The application follows a modern web architecture with a React frontend, Express.js backend, and PostgreSQL database. It incorporates blockchain technologies through specialized SDKs for each supported chain and implements a comprehensive security model for asset protection.

## 2. System Architecture

### 2.1 High-Level Architecture

Chronos Vault employs a client-server architecture with the following key components:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  React Frontend │────▶│  Express Server │────▶│   PostgreSQL    │
│                 │     │                 │     │    Database     │
│                 │     │                 │     │                 │
└────────┬────────┘     └────────┬────────┘     └─────────────────┘
         │                       │
         ▼                       ▼
┌────────────────────────────────────────────┐
│                                            │
│           Blockchain Integrations          │
│                                            │
│  ┌─────────┐    ┌─────────┐  ┌─────────┐  │
│  │   TON   │    │ Ethereum│  │ Solana  │  │
│  │         │    │         │  │         │  │
│  └─────────┘    └─────────┘  └─────────┘  │
│                                            │
└────────────────────────────────────────────┘
```

### 2.2 Cross-Chain Architecture

The platform implements a Triple-Chain Security model:

1. **TON Layer**: Primary blockchain for vault creation, management and time-lock operations
2. **Ethereum Layer**: Security verification and ownership validation
3. **Solana Layer**: High-frequency monitoring and rapid validation

This multi-chain approach ensures assets are secured by three independent blockchain networks, preventing single points of failure. TON was selected as the primary chain due to its lower gas fees, faster transaction speed, better scalability, and native time-based operations.

## 3. Key Components

### 3.1 Frontend

- **Framework**: React with TypeScript
- **State Management**: React Query for server state
- **Routing**: Wouter for navigation
- **UI Framework**: TailwindCSS with ShadCN UI components
- **Styling**: Custom theme with gradient effects and animations

Key frontend features:
- Wallet connection for multiple blockchain networks
- Vault creation and management interface
- Cross-chain asset visualization
- Security dashboard

### 3.2 Backend

- **Server**: Express.js with TypeScript
- **API**: RESTful endpoints for vault operations
- **Authentication**: Multi-chain wallet authentication using SIWE (Sign-In with Ethereum) pattern
- **Middleware**: Session handling, logging, error handling

Key backend features:
- Cross-chain transaction processing
- Vault management logic
- User authentication and session handling
- File storage for vault attachments

### 3.3 Database

- **Database**: PostgreSQL 
- **ORM**: DrizzleORM for database interactions
- **Schemas**: Users, vaults, beneficiaries, attachments

Key database tables:
- `users`: User information and wallet addresses
- `vaults`: Time-locked vault data
- `beneficiaries`: Authorized recipients for vaults
- `attachments`: Media and documents attached to vaults

### 3.4 Blockchain Integration

- **TON**: Primary blockchain using TON Connect SDK, handling vault creation and time-lock operations
- **Ethereum**: Validation layer via ethers.js, providing security verification and ownership validation
- **Solana**: Monitoring layer via @solana/web3.js, enabling high-frequency monitoring
- **Cross-Chain**: Custom bridge implementations for inter-chain security verification

Key blockchain features:
- Smart contracts for vault creation and management
- Cross-chain verification of assets
- Multi-signature security
- Time-lock mechanisms

### 3.5 Smart Contracts

- **TON Contracts**: Written in FunC
  - ChronosVault.fc: Main vault contract
  - CVT token contracts: Jetton implementation for the native token
  - Bridge contracts: Cross-chain functionality

- **Ethereum Contracts**: Written in Solidity
  - ChronosVault.sol: ERC-4626 compliant vault
  - CVTBridge.sol: Cross-chain bridge

- **Solana Programs**: Written in Rust
  - chronos_vault.rs: Main vault program
  - cvt_bridge: Cross-chain bridge implementation

## 4. Data Flow

### 4.1 Vault Creation Flow

1. User connects wallet (TON, Ethereum, or Solana)
2. User configures vault parameters (unlock date, security level, etc.)
3. Frontend sends vault creation request to backend
4. Backend validates request and interacts with appropriate blockchain
5. Smart contract creates the vault on the blockchain
6. Vault details are stored in the database
7. Confirmation is sent back to the frontend

### 4.2 Cross-Chain Verification Flow

1. Primary vault is created on one blockchain
2. Cross-chain verification contracts are deployed on secondary chains
3. Proof of vault existence is registered across all chains
4. Validators monitor and confirm vault status across chains
5. Any attempt to access the vault requires verification from all chains

### 4.3 Authentication Flow

1. User initiates authentication with blockchain wallet
2. Backend generates a nonce for the user to sign
3. User signs the nonce with their wallet
4. Signature is verified on the backend
5. User session is created and maintained

## 5. External Dependencies

### 5.1 Blockchain APIs

- **TON**: TON Connect SDK and TON Client
- **Ethereum**: Ethers.js for interaction with Ethereum
- **Solana**: Solana Web3.js for Solana interaction

### 5.2 UI Components

- **ShadCN UI**: Component library built on Radix UI
- **Lucide Icons**: Icon library for UI elements

### 5.3 Payment Processing

- **Stripe**: Integration for premium subscriptions

### 5.4 Development Tools

- **Vite**: Frontend build tool
- **TypeScript**: Static typing for JavaScript
- **ESBuild**: Fast JavaScript bundler

## 6. Deployment Strategy

### 6.1 Infrastructure

- **Node.js**: Server runtime environment
- **PostgreSQL**: Database service
- **Replit**: Development and hosting platform

### 6.2 Build Process

1. Frontend is built using Vite
2. Backend is compiled with ESBuild
3. Combined build is deployed as a single application

### 6.3 Environment Configuration

- Development: Local environment with hot reloading
- Production: Optimized build with environment-specific configurations

### 6.4 Deployment Steps

As defined in `.replit`:
1. Build command: `npm run build`
2. Run command: `npm run start`
3. Exposed port: 5000 mapped to 80

## 7. Security Considerations

### 7.1 Vault Security

- Multi-signature requirements for high-value vaults
- Time-lock mechanisms to prevent premature access
- Cross-chain verification to prevent single-chain attacks

### 7.2 User Security

- Non-custodial wallet integration
- Zero-knowledge privacy features
- Geolocation-based access restrictions (optional)

### 7.3 Platform Security

- AI-enhanced security monitoring
- Anomaly detection for unusual vault activities
- Cross-chain transaction verification

## 8. Future Architecture Extensions

### 8.1 Diamond Hands Bitcoin Vault

A specialized vault solution for Bitcoin maximalists scheduled for release in Q3 2025 with:
- Multi-signature security (2-of-3 keys)
- Quantum-resistant encryption
- Cross-chain security redundancy
- Halvening date verification

### 8.2 ChronosToken (CVT)

A deflationary token with:
- Fixed supply of 21,000,000 CVT
- Time-locked release schedule
- Automated buyback and burn mechanisms
- Cross-chain availability on TON, Ethereum, and Solana

## 9. Conclusion

Chronos Vault implements a sophisticated multi-chain architecture to provide secure, time-locked digital vaults across multiple blockchain networks. The system leverages the strengths of different blockchains to create a robust security model while maintaining a user-friendly interface. The modular design allows for future expansion to support additional blockchain networks and vault features.