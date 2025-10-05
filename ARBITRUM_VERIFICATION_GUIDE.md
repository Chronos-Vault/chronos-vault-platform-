# Arbitrum Sepolia Contract Verification Guide

## Overview
All Trinity Protocol contracts have been successfully deployed to Arbitrum Sepolia Layer 2. Due to Etherscan API V1 deprecation, automated verification requires manual steps or an API v2-compatible tool.

## Deployed Contracts ✅

| Contract | Address | Purpose |
|----------|---------|---------|
| **CVT Token** | `0xFb419D8E32c14F774279a4dEEf330dc893257147` | ChronosVault governance token |
| **CVTBridge** | `0x21De95EbA01E31173Efe1b9c4D57E58bb840bA86` | Trinity Protocol 2-of-3 bridge |
| **Test USDC** | `0x6818bbb8f604b4c0b52320f633C1E5BF2c5b07bd` | Vault asset for testing |
| **ChronosVault** | `0x99444B0B1d6F7b21e9234229a2AC2bC0150B9d91` | Time-locked vault |
| **CrossChainBridgeV1** | `0x13dc7df46c2e87E8B2010A28F13404580158Ed9A` | HTLC atomic swaps |

## Trinity Protocol Validators (2-of-3 Consensus) 🔐

**CRITICAL SECURITY NOTE**: These are deterministic testnet validators. Replace before mainnet!

- **Ethereum L2**: `0x955Bb279Af6cf954d077290dD96C370e35ac5b3F`
- **Solana**: `0x7701D6f186002EBBf37b4171831A44BBEABA72e7`
- **TON**: `0x26782123B2C8631Fc6F83b04408eFDB4620090F5`

## Manual Verification on Arbiscan

### Option 1: Web Interface (Recommended)

1. **Visit Arbiscan Sepolia**: https://sepolia.arbiscan.io

2. **For each contract**:
   - Navigate to the contract address
   - Click "Contract" tab → "Verify and Publish"
   - Select verification method: "Solidity (Single file)" or "Standard JSON Input"

3. **Compiler Settings**:
   - Compiler: `v0.8.20+commit.a1b79de6`
   - EVM Version: `paris`
   - Optimization: Enabled (200 runs)
   - License: MIT

### Constructor Arguments (Encoded)

#### 1. CVT Token (`0xFb419D8E32c14F774279a4dEEf330dc893257147`)
```
Constructor Arguments:
- name: "ChronosVault Token"
- symbol: "CVT"
```

To get ABI-encoded arguments:
```bash
npx hardhat run scripts/encode-constructor-args.js --constructor CVTToken
```

#### 2. CVTBridge (`0x21De95EbA01E31173Efe1b9c4D57E58bb840bA86`)
```
Constructor Arguments:
- cvtToken: 0xFb419D8E32c14F774279a4dEEf330dc893257147
- bridgeFee: 1000000000000000 (0.001 ETH)
- minAmount: 10000000000000000000 (10 CVT)
- initialValidators: [
    0x955Bb279Af6cf954d077290dD96C370e35ac5b3F,
    0x7701D6f186002EBBf37b4171831A44BBEABA72e7,
    0x26782123B2C8631Fc6F83b04408eFDB4620090F5
  ]
- threshold: 2
```

#### 3. Test USDC (`0x6818bbb8f604b4c0b52320f633C1E5BF2c5b07bd`)
```
Constructor Arguments:
- name: "Test USDC"
- symbol: "USDC"
```

#### 4. ChronosVault (`0x99444B0B1d6F7b21e9234229a2AC2bC0150B9d91`)
```
Constructor Arguments:
- asset: 0x6818bbb8f604b4c0b52320f633C1E5BF2c5b07bd
- name: "Trinity Vault"
- symbol: "TVAULT"
- unlockTime: 1791199762
- securityLevel: 2
- accessKey: 0x61d30d6e12af5f3ff009689cc0cb6f7f389c5394b814f7dfcd4c744e31e1c5e2
- isPublic: false
```

#### 5. CrossChainBridgeV1 (`0x13dc7df46c2e87E8B2010A28F13404580158Ed9A`)
```
No constructor arguments
```

### Option 2: Hardhat CLI (When API v2 Support Added)

Once Hardhat supports Etherscan API v2:

```bash
# Verify CVTBridge
npx hardhat verify --network arbitrumSepolia \
  0x21De95EbA01E31173Efe1b9c4D57E58bb840bA86 \
  "0xFb419D8E32c14F774279a4dEEf330dc893257147" \
  "1000000000000000" \
  "10000000000000000000" \
  '["0x955Bb279Af6cf954d077290dD96C370e35ac5b3F","0x7701D6f186002EBBf37b4171831A44BBEABA72e7","0x26782123B2C8631Fc6F83b04408eFDB4620090F5"]' \
  "2"
```

## Verification Status Tracking

| Contract | Verified | Arbiscan Link |
|----------|----------|---------------|
| CVT Token | ⏳ Pending | [View](https://sepolia.arbiscan.io/address/0xFb419D8E32c14F774279a4dEEf330dc893257147) |
| CVTBridge | ⏳ Pending | [View](https://sepolia.arbiscan.io/address/0x21De95EbA01E31173Efe1b9c4D57E58bb840bA86) |
| Test USDC | ⏳ Pending | [View](https://sepolia.arbiscan.io/address/0x6818bbb8f604b4c0b52320f633C1E5BF2c5b07bd) |
| ChronosVault | ⏳ Pending | [View](https://sepolia.arbiscan.io/address/0x99444B0B1d6F7b21e9234229a2AC2bC0150B9d91) |
| CrossChainBridgeV1 | ⏳ Pending | [View](https://sepolia.arbiscan.io/address/0x13dc7df46c2e87E8B2010A28F13404580158Ed9A) |

## Trinity Protocol Security Verification ✅

**Confirmed on-chain** (via `scripts/verify-trinity-consensus.cjs`):

✅ **3/3 Validators Active**
- Ethereum L2, Solana, TON - all distinct addresses
- No single point of failure

✅ **2-of-3 Threshold Verified**
- Mathematical consensus requires 2 validator signatures
- Implements trustless bridge security

✅ **Bridge Parameters**
- Fee: 0.001 ETH (0.1%)
- Min Amount: 10 CVT
- All economic parameters correctly set

## Next Steps

1. **Manual Verification**: Use Arbiscan web interface to verify contracts
2. **Mainnet Preparation**: Replace deterministic validators with real multi-party keys
3. **Testing**: Execute bridge transactions to test Trinity Protocol consensus
4. **Monitoring**: Set up block explorer monitoring for all contracts

## Resources

- **Deployment Data**: `deployment-arbitrum.json`
- **Hardhat Config**: `hardhat.config.cjs`
- **Verification Script**: `scripts/verify-arbitrum-contracts.cjs`
- **Consensus Test**: `scripts/verify-trinity-consensus.cjs`
- **Arbiscan**: https://sepolia.arbiscan.io
- **Chain ID**: 421614 (Arbitrum Sepolia)
- **RPC**: https://arbitrum-sepolia-rpc.publicnode.com

---

**⚠️ Security Notice**: Trinity Protocol validators are currently deterministic test wallets. Before mainnet deployment, implement proper multi-party key management for the three validator addresses to ensure true decentralization and security.
