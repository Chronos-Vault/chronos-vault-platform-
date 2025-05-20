# Chronos Vault API Reference

## Overview

This document provides comprehensive documentation for the Chronos Vault API. All endpoints are RESTful and return responses in JSON format.

## Base URL

All API endpoints are relative to:

```
https://api.chronosvault.org/api
```

For local development:

```
http://localhost:5000/api
```

## Authentication

Most API endpoints require authentication. The Chronos Vault API supports multiple authentication methods:

### Wallet-Based Authentication

Connect your blockchain wallet to authenticate. Supported wallets:

- Ethereum (MetaMask, WalletConnect)
- TON (Tonkeeper, TON Wallet)
- Solana (Phantom, Solflare)
- Bitcoin (via xPub)

### API Key Authentication

For programmatic access, use API key authentication:

```
Authorization: Bearer YOUR_API_KEY
```

## Core API Endpoints

### Health Check

```
GET /health-check
```

Lightweight endpoint to verify API availability.

#### Response

```json
{
  "status": "ok",
  "timestamp": 1716151282742,
  "version": "1.0.0"
}
```

### System Health

```
GET /health/system
```

Detailed system health information.

#### Response

```json
{
  "status": "healthy",
  "components": {
    "database": "connected",
    "blockchain": {
      "ethereum": "online",
      "ton": "online",
      "solana": "online",
      "bitcoin": "online"
    },
    "storage": "operational"
  },
  "uptime": 1234567,
  "timestamp": 1716151282742
}
```

## Vault Management API

### List Vaults

```
GET /vaults
```

Returns a list of vaults associated with the authenticated user.

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| type | string | Filter by vault type (e.g., "time-lock", "quantum-resistant") |
| status | string | Filter by status (e.g., "active", "pending", "locked") |
| page | integer | Page number for pagination |
| limit | integer | Number of items per page (default: 20, max: 100) |

#### Response

```json
{
  "vaults": [
    {
      "id": "v_1a2b3c4d5e6f",
      "name": "My Savings Vault",
      "type": "time-lock",
      "status": "active",
      "createdAt": "2025-04-15T12:34:56Z",
      "lockUntil": "2026-01-01T00:00:00Z",
      "chains": ["ethereum", "ton"],
      "assets": [
        {
          "assetId": "eth_mainnet_native",
          "amount": "1.5",
          "valueUsd": 4500.00
        }
      ]
    }
  ],
  "pagination": {
    "total": 12,
    "page": 1,
    "limit": 20,
    "hasMore": false
  }
}
```

### Get Vault Details

```
GET /vaults/:vaultId
```

Returns detailed information about a specific vault.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| vaultId | string | Unique identifier of the vault |

#### Response

```json
{
  "id": "v_1a2b3c4d5e6f",
  "name": "My Savings Vault",
  "description": "Long-term savings vault",
  "type": "time-lock",
  "status": "active",
  "createdAt": "2025-04-15T12:34:56Z",
  "lockUntil": "2026-01-01T00:00:00Z",
  "chains": ["ethereum", "ton"],
  "features": {
    "quantumResistant": true,
    "crossChainVerification": true,
    "multiSignature": false
  },
  "assets": [
    {
      "assetId": "eth_mainnet_native",
      "type": "native",
      "chain": "ethereum",
      "symbol": "ETH",
      "amount": "1.5",
      "valueUsd": 4500.00
    }
  ],
  "security": {
    "verificationLevel": "advanced",
    "requireMultiSignature": false,
    "timeDelay": 86400
  },
  "accessControl": {
    "owner": "0x1234567890abcdef1234567890abcdef12345678",
    "authorized": []
  }
}
```

### Create Vault

```
POST /vaults
```

Creates a new vault.

#### Request Body

```json
{
  "name": "My Savings Vault",
  "description": "Long-term savings vault",
  "type": "time-lock",
  "lockUntil": "2026-01-01T00:00:00Z",
  "chains": ["ethereum", "ton"],
  "features": {
    "quantumResistant": true,
    "crossChainVerification": true,
    "multiSignature": false
  },
  "security": {
    "verificationLevel": "advanced",
    "requireMultiSignature": false,
    "timeDelay": 86400
  }
}
```

#### Response

```json
{
  "id": "v_1a2b3c4d5e6f",
  "status": "created",
  "depositAddresses": {
    "ethereum": "0xabcdef1234567890abcdef1234567890abcdef12",
    "ton": "UQAkIXbCToQ6LowMrDNG2K3ERmMH8m4XB2owWgL0BAB14Jtl"
  },
  "createdAt": "2025-05-20T12:34:56Z"
}
```

### Update Vault

```
PATCH /vaults/:vaultId
```

Updates an existing vault.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| vaultId | string | Unique identifier of the vault |

#### Request Body

```json
{
  "name": "Updated Vault Name",
  "description": "Updated description",
  "security": {
    "verificationLevel": "maximum"
  }
}
```

#### Response

```json
{
  "id": "v_1a2b3c4d5e6f",
  "status": "updated",
  "updatedAt": "2025-05-20T13:45:12Z"
}
```

### Deposit Assets

```
POST /vaults/:vaultId/deposit
```

Initiates a deposit to a vault.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| vaultId | string | Unique identifier of the vault |

#### Request Body

```json
{
  "chain": "ethereum",
  "assetType": "native",
  "amount": "0.5"
}
```

#### Response

```json
{
  "depositId": "d_7h8j9k0l1m2n",
  "status": "pending",
  "depositAddress": "0xabcdef1234567890abcdef1234567890abcdef12",
  "expiresAt": "2025-05-20T14:34:56Z"
}
```

### Withdraw Assets

```
POST /vaults/:vaultId/withdraw
```

Initiates a withdrawal from a vault.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| vaultId | string | Unique identifier of the vault |

#### Request Body

```json
{
  "chain": "ethereum",
  "assetType": "native",
  "amount": "0.5",
  "destinationAddress": "0x1234567890abcdef1234567890abcdef12345678"
}
```

#### Response

```json
{
  "withdrawalId": "w_7h8j9k0l1m2n",
  "status": "pending",
  "estimatedCompletionTime": "2025-05-21T12:34:56Z"
}
```

## Security and Verification API

### Vault Verification

```
GET /vault-verification/:vaultId
```

Verifies the security and integrity of a vault.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| vaultId | string | Unique identifier of the vault |

#### Response

```json
{
  "vaultId": "v_1a2b3c4d5e6f",
  "verificationStatus": "verified",
  "crossChainVerification": {
    "ethereum": {
      "status": "verified",
      "blockNumber": 12345678,
      "transactionHash": "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
    },
    "ton": {
      "status": "verified",
      "blockNumber": 87654321,
      "transactionHash": "97a5bbd8581347aaa99e2d3af5301102c4048cca571a55311fe2ffeb6beeec88"
    }
  },
  "integrityCheck": {
    "status": "passed",
    "lastVerified": "2025-05-20T12:00:00Z"
  },
  "quantumResistanceLevel": "high"
}
```

### Progressive Quantum Vault Configuration

```
POST /security/progressive-quantum/:vaultId
```

Configures progressive quantum security settings for a vault.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| vaultId | string | Unique identifier of the vault |

#### Request Body

```json
{
  "algorithms": ["lattice-based", "multivariate", "hash-based"],
  "keySize": "maximum",
  "adaptiveMode": true
}
```

#### Response

```json
{
  "vaultId": "v_1a2b3c4d5e6f",
  "status": "configured",
  "quantumResistanceLevel": "maximum",
  "estimatedProtectionYears": 50
}
```

## Intent-Based Inheritance API

### Configure Inheritance

```
POST /intent-inheritance/:vaultId
```

Configures intent-based inheritance for a vault.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| vaultId | string | Unique identifier of the vault |

#### Request Body

```json
{
  "beneficiaries": [
    {
      "address": "0x9876543210abcdef9876543210abcdef98765432",
      "email": "beneficiary@example.com",
      "allocation": 100,
      "unlockConditions": {
        "timeBasedTrigger": {
          "inactivityPeriod": 31536000
        }
      }
    }
  ],
  "verificationRequirements": {
    "requireLegalDocumentation": true,
    "identityVerificationLevel": "advanced"
  }
}
```

#### Response

```json
{
  "vaultId": "v_1a2b3c4d5e6f",
  "status": "configured",
  "inheritanceId": "i_7h8j9k0l1m2n",
  "activationDate": "2025-05-20T13:00:00Z"
}
```

## WebSocket API

In addition to REST endpoints, Chronos Vault offers real-time updates via WebSockets.

### Connection

```
wss://api.chronosvault.org/ws
```

Authentication is required via:

```
?token=YOUR_API_KEY
```

### Events

#### Transaction Updates

```json
{
  "type": "TRANSACTION_CONFIRMED",
  "data": {
    "transactionId": "tx_7h8j9k0l1m2n",
    "vaultId": "v_1a2b3c4d5e6f",
    "chainId": "ethereum",
    "status": "confirmed",
    "blockNumber": 12345678,
    "timestamp": "2025-05-20T13:00:00Z"
  }
}
```

#### Security Alerts

```json
{
  "type": "SECURITY_ALERT",
  "data": {
    "alertId": "alert_7h8j9k0l1m2n",
    "vaultId": "v_1a2b3c4d5e6f",
    "severity": "high",
    "type": "UNUSUAL_ACTIVITY",
    "description": "Multiple failed authentication attempts detected",
    "timestamp": "2025-05-20T13:00:00Z",
    "recommendations": [
      "Review recent activity",
      "Consider enabling multi-signature"
    ]
  }
}
```

## Blockchain-Specific Endpoints

### Ethereum Integration

```
GET /blockchain/ethereum/gas-price
```

Returns current gas prices for Ethereum transactions.

#### Response

```json
{
  "slow": {
    "gwei": 20,
    "estimatedSeconds": 120
  },
  "standard": {
    "gwei": 30,
    "estimatedSeconds": 30
  },
  "fast": {
    "gwei": 40,
    "estimatedSeconds": 15
  },
  "timestamp": "2025-05-20T13:00:00Z"
}
```

### TON Integration

```
GET /blockchain/ton/account/:address
```

Returns TON account information.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| address | string | TON wallet address |

#### Response

```json
{
  "address": "UQAkIXbCToQ6LowMrDNG2K3ERmMH8m4XB2owWgL0BAB14Jtl",
  "balance": "10.5",
  "status": "active",
  "lastTransaction": {
    "hash": "97a5bbd8581347aaa99e2d3af5301102c4048cca571a55311fe2ffeb6beeec88",
    "timestamp": "2025-05-20T12:34:56Z"
  }
}
```

### Solana Integration

```
GET /blockchain/solana/account/:address
```

Returns Solana account information.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| address | string | Solana wallet address |

#### Response

```json
{
  "address": "Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS",
  "balance": "25.75",
  "status": "active",
  "lastTransaction": {
    "signature": "5UfgccJLrTWrUJcRXQZveqUZKfF15XaJLBAXrHxZJnzJ2r9Jgx6GphU35XGQTKZvSuLjbyxoZ1dyKXV2xSx4V3pJ",
    "slot": 123456789,
    "timestamp": "2025-05-20T12:34:56Z"
  }
}
```

### Bitcoin Integration

```
GET /blockchain/bitcoin/account/:address
```

Returns Bitcoin account information.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| address | string | Bitcoin address |

#### Response

```json
{
  "address": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  "balance": "0.25",
  "totalReceived": "1.5",
  "totalSent": "1.25",
  "unconfirmedBalance": "0",
  "lastTransaction": {
    "txid": "9f3c60e887a9ca8cff8a701aadad0c2874f8ac7a1fcb6b55149337010fa31b4b",
    "confirmations": 3,
    "timestamp": "2025-05-20T12:34:56Z"
  }
}
```

## Error Handling

All API errors follow a consistent format:

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested vault does not exist",
    "requestId": "req_7h8j9k0l1m2n",
    "timestamp": "2025-05-20T13:00:00Z"
  }
}
```

### Common Error Codes

| Code | Description |
|------|-------------|
| AUTHENTICATION_REQUIRED | Authentication is required |
| INVALID_CREDENTIALS | Invalid authentication credentials |
| RESOURCE_NOT_FOUND | Requested resource not found |
| PERMISSION_DENIED | Insufficient permissions |
| VALIDATION_ERROR | Invalid request parameters |
| RATE_LIMIT_EXCEEDED | API rate limit exceeded |
| INTERNAL_SERVER_ERROR | Internal server error |

## Rate Limiting

API requests are limited to 120 requests per minute per authenticated user.

Rate limit headers are included in all responses:

```
X-RateLimit-Limit: 120
X-RateLimit-Remaining: 119
X-RateLimit-Reset: 1716152182
```

## Webhook Notifications

Chronos Vault can send webhook notifications for various events:

### Configuration

```
POST /webhooks
```

#### Request Body

```json
{
  "url": "https://your-server.com/webhook",
  "events": [
    "vault.created",
    "vault.updated",
    "transaction.confirmed",
    "security.alert"
  ],
  "secret": "your_webhook_secret"
}
```

#### Response

```json
{
  "webhookId": "wh_7h8j9k0l1m2n",
  "status": "active",
  "createdAt": "2025-05-20T13:00:00Z"
}
```

## API Versioning

The current API version is v1.

API versioning is maintained through the URL path:

```
https://api.chronosvault.org/api/v1/...
```

## Support

For API support, please contact us at api-support@chronosvault.org.