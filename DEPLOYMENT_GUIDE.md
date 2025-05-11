# Chronos Vault Testnet Deployment Guide

This guide details the process for deploying the Chronos Vault platform to testnet environments across all three blockchain networks.

## Prerequisites

Before proceeding with deployment, ensure you have:

1. All required API keys and access tokens
2. Testnet funds on all blockchain networks
3. All smart contracts successfully tested locally
4. All security systems fully tested and operational

## Environment Setup

Set the following environment variables before running the deployment script:

```shell
# Ethereum Configuration
export ETHEREUM_PRIVATE_KEY=<your_ethereum_private_key>
export ETHEREUM_RPC_URL=<sepolia_rpc_url>

# TON Configuration
export TON_API_KEY=<your_ton_api_key>

# Solana Configuration
export SOLANA_RPC_URL=<solana_devnet_rpc_url>

# Optional Parameters
export SECURITY_LEVEL=ENHANCED  # Options: STANDARD, ENHANCED, ADVANCED, MAXIMUM
```

## Deployment Process

### 1. Run the Deployment Script

Execute the deployment script to deploy all contracts:

```shell
npm run deploy:testnet
```

This will:
1. Deploy Ethereum contracts to Sepolia Testnet
2. Deploy TON contracts to TON Testnet
3. Deploy Solana programs to Solana Devnet
4. Configure cross-chain verification between all contracts
5. Save deployment information to `deployments/` directory

### 2. Verify Contract Deployments

After successful deployment, verify the contracts on their respective block explorers:

**Ethereum Sepolia Contracts:**
- Visit [Sepolia Etherscan](https://sepolia.etherscan.io/)
- Search for the deployed contract addresses
- Verify the contract source code

**TON Testnet Contracts:**
- Visit [TON Testnet Explorer](https://testnet.tonscan.org/)
- Search for the deployed contract addresses
- Verify the contract is operational

**Solana Devnet Programs:**
- Visit [Solana Explorer (Devnet)](https://explorer.solana.com/?cluster=devnet)
- Search for the deployed program IDs
- Verify the program is operational

### 3. Test Cross-Chain Functionality

After deployment, run the cross-chain test script to verify that all chains can communicate properly:

```shell
npm run test:cross-chain
```

This will:
1. Execute a test transaction from Ethereum to TON
2. Execute a test transaction from TON to Solana
3. Execute a test transaction from Solana to Ethereum
4. Verify that all cross-chain proofs are properly generated and validated

### 4. Configure Frontend

After successful deployment, update the frontend configuration with the new contract addresses:

```shell
npm run update-contracts -- --env=testnet
```

This will:
1. Update the contract addresses in the frontend configuration
2. Enable testnet mode in the application
3. Configure the development environment to use testnet networks

### 5. Deploy Frontend

Deploy the frontend application to make it accessible:

```shell
npm run deploy:frontend
```

## Triple-Chain Security Architecture Verification

After deployment, verify that the Triple-Chain Security Architecture is fully functional:

1. Create a test vault on Ethereum
2. Verify the vault is properly registered on TON and Solana
3. Execute a vault operation and verify it's properly secured across all chains
4. Test the fallback recovery mechanisms

## Advanced Security Settings

The deployment automatically configures security settings based on the `SECURITY_LEVEL` environment variable. The default level is `ENHANCED`, which provides strong security suitable for testnet deployment.

For production deployments, consider setting `SECURITY_LEVEL=MAXIMUM` to enable:

- Quantum-resistant encryption for all operations
- Multi-signature requirements for high-value operations
- Cross-chain verification for all transactions
- Zero-knowledge proofs for privacy

## Monitoring

After deployment, monitor the security of all contracts using:

```shell
npm run security:monitor
```

This will start a monitoring service that:
1. Tracks all cross-chain transactions
2. Monitors for security anomalies
3. Alerts on potential issues
4. Records all system activities

## Troubleshooting

### Common Issues

1. **Cross-Chain Verification Failure**
   - Check that all bridge contracts are properly configured with trusted bridges
   - Verify that the RPC endpoints are operational
   - Check for sufficient gas on all networks

2. **Contract Deployment Failures**
   - Ensure you have sufficient testnet funds
   - Check network connectivity to the respective testnets
   - Verify compiler settings match the network requirements

3. **Security System Alerts**
   - Check the security logs for detailed information
   - Verify that all security components are properly initialized
   - Ensure all environment variables are correctly set

For more assistance, contact the development team or consult the technical documentation.