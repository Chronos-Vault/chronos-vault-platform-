# Trinity Protocol API Reference

Complete API documentation for Trinity Protocol cross-chain state synchronization system.

## Table of Contents

- [Trinity State Coordinator](#trinity-state-coordinator)
- [Event Listeners](#event-listeners)
- [Merkle Proof Verifier](#merkle-proof-verifier)
- [Circuit Breaker Service](#circuit-breaker-service)
- [Emergency Recovery Protocol](#emergency-recovery-protocol)
- [Trinity Protocol Core](#trinity-protocol-core)

---

## Trinity State Coordinator

Main orchestrator for cross-chain state synchronization.

### `initialize()`

Initialize the Trinity Protocol State Coordinator.

```typescript
await trinityStateCoordinator.initialize();
```

**Returns:** `Promise<void>`

**Throws:** Error if initialization fails

---

### `start()`

Start the coordinator and all event listeners.

```typescript
await trinityStateCoordinator.start();
```

**Returns:** `Promise<void>`

---

### `stop()`

Stop the coordinator and all event listeners.

```typescript
await trinityStateCoordinator.stop();
```

**Returns:** `Promise<void>`

---

### `getVaultState(vaultId: string)`

Get cross-chain state for a specific vault.

```typescript
const state = trinityStateCoordinator.getVaultState('vault-001');
```

**Parameters:**
- `vaultId` (string): Vault identifier

**Returns:** `CrossChainState | undefined`

```typescript
interface CrossChainState {
  vaultId: string;
  arbitrum: {
    state: string;
    verified: boolean;
    blockNumber: number;
    timestamp: number;
  };
  solana: {
    state: string;
    verified: boolean;
    slot: number;
    timestamp: number;
  };
  ton: {
    state: string;
    verified: boolean;
    timestamp: number;
  };
  consensusReached: boolean;
  lastSync: number;
}
```

---

### `getAllVaultStates()`

Get all vault cross-chain states.

```typescript
const allStates = trinityStateCoordinator.getAllVaultStates();
```

**Returns:** `CrossChainState[]`

---

### `healthCheck()`

Check health of all chains.

```typescript
const health = await trinityStateCoordinator.healthCheck();
```

**Returns:** `Promise<{ healthy: boolean; chains: any }>`

---

### Events

#### `state:initialized`

Emitted when a new vault state is initialized.

```typescript
trinityStateCoordinator.on('state:initialized', (state: CrossChainState) => {
  console.log(`State initialized for ${state.vaultId}`);
});
```

#### `state:updated`

Emitted when vault state is updated.

```typescript
trinityStateCoordinator.on('state:updated', (state: CrossChainState) => {
  console.log(`State updated for ${state.vaultId}`);
});
```

#### `consensus:reached`

Emitted when 2-of-3 consensus is reached.

```typescript
trinityStateCoordinator.on('consensus:reached', (data) => {
  console.log(`Consensus reached for ${data.vaultId}`);
});
```

#### `consensus:failed`

Emitted when consensus fails.

```typescript
trinityStateCoordinator.on('consensus:failed', (data) => {
  console.log(`Consensus failed for ${data.vaultId}`);
});
```

---

## Event Listeners

### Arbitrum Event Listener

#### `initialize()`

```typescript
await arbitrumEventListener.initialize();
```

#### `startListening()`

```typescript
await arbitrumEventListener.startListening();
```

#### `stopListening()`

```typescript
await arbitrumEventListener.stopListening();
```

#### `getVaultState(vaultId: string)`

```typescript
const state = await arbitrumEventListener.getVaultState('vault-001');
```

#### Events

- `vault:created` - New vault created
- `vault:unlocked` - Vault unlocked
- `vault:deposit` - Deposit made
- `vault:withdrawal` - Withdrawal made
- `trinity:verify` - Cross-chain verification requested
- `emergency:recovery` - Emergency recovery triggered

---

### Solana Event Listener

#### `initialize()`

```typescript
await solanaEventListener.initialize();
```

#### `getCurrentSlot()`

```typescript
const slot = await solanaEventListener.getCurrentSlot();
```

#### Events

- `vault:initialized` - Vault initialized on Solana
- `state:updated` - State updated
- `consensus:reached` - Cross-chain consensus reached
- `verification:started` - Verification started

---

### TON Event Listener

#### `initialize()`

```typescript
await tonEventListener.initialize();
```

#### `addVaultToTracking(vaultId: string)`

```typescript
tonEventListener.addVaultToTracking('vault-001');
```

#### `getVaultBackupData(vaultId: string)`

```typescript
const backup = await tonEventListener.getVaultBackupData('vault-001');
```

#### Events

- `backup:updated` - Vault backup updated
- `emergency:triggered` - Emergency recovery triggered

---

## Merkle Proof Verifier

### `generateProof(vaultStates: VaultStateData[], targetVaultId: string)`

Generate Merkle proof for a specific vault.

```typescript
const proof = merkleProofVerifier.generateProof(vaultStates, 'vault-001');
```

**Returns:** `MerkleProof | null`

```typescript
interface MerkleProof {
  root: string;
  leaf: string;
  proof: string[];
  verified: boolean;
  index: number;
}
```

---

### `verifyProof(proof: MerkleProof)`

Verify a Merkle proof.

```typescript
const isValid = merkleProofVerifier.verifyProof(proof);
```

**Returns:** `boolean`

---

### `generateCrossChainProof(...)`

Generate cross-chain consensus proof.

```typescript
const crossChainProof = merkleProofVerifier.generateCrossChainProof(
  arbitrumStates,
  solanaStates,
  tonStates,
  'vault-001'
);
```

**Returns:** `CrossChainStateProof | null`

---

### `verifyCrossChainProof(proof: CrossChainStateProof)`

Verify cross-chain consensus proof.

```typescript
const isValid = merkleProofVerifier.verifyCrossChainProof(crossChainProof);
```

**Returns:** `boolean`

---

## Circuit Breaker Service

### `startMonitoring()`

Start monitoring chain health.

```typescript
await circuitBreakerService.startMonitoring();
```

---

### `stopMonitoring()`

Stop monitoring.

```typescript
circuitBreakerService.stopMonitoring();
```

---

### `getChainHealth(chain: 'arbitrum' | 'solana' | 'ton')`

Get health status for a specific chain.

```typescript
const health = circuitBreakerService.getChainHealth('arbitrum');
```

**Returns:** `ChainHealth | undefined`

```typescript
interface ChainHealth {
  chain: 'arbitrum' | 'solana' | 'ton';
  status: ChainStatus; // HEALTHY | DEGRADED | FAILED | RECOVERING
  circuitState: CircuitState; // CLOSED | OPEN | HALF_OPEN
  failureCount: number;
  lastFailure: number;
  lastSuccess: number;
  responseTime: number;
}
```

---

### `getTrinityStatus()`

Get overall Trinity Protocol status.

```typescript
const status = circuitBreakerService.getTrinityStatus();
```

**Returns:**
```typescript
{
  healthy: boolean;
  healthyChains: number;
  degradedChains: number;
  failedChains: number;
  status: string; // 'OPERATIONAL' | 'DEGRADED' | 'CRITICAL'
}
```

---

### `resetCircuit(chain: 'arbitrum' | 'solana' | 'ton')`

Manually reset circuit breaker.

```typescript
circuitBreakerService.resetCircuit('arbitrum');
```

---

### Events

- `chain:degraded` - Chain degraded
- `chain:failed` - Chain failed
- `chain:recovered` - Chain recovered
- `circuit:open` - Circuit breaker opened
- `trinity:degraded` - Trinity Protocol degraded (2/3 healthy)
- `trinity:critical` - Trinity Protocol critical (<2 healthy)
- `emergency:activate` - Emergency activation requested

---

## Emergency Recovery Protocol

### `start()`

Start emergency recovery protocol.

```typescript
await emergencyRecoveryProtocol.start();
```

---

### `stop()`

Stop emergency recovery protocol.

```typescript
emergencyRecoveryProtocol.stop();
```

---

### `getRecoveryStatus()`

Get current recovery status.

```typescript
const status = emergencyRecoveryProtocol.getRecoveryStatus();
```

**Returns:**
```typescript
interface RecoveryStatus {
  mode: RecoveryMode; // NORMAL | DEGRADED | CRITICAL | EMERGENCY
  healthyChains: string[];
  failedChains: string[];
  degradedChains: string[];
  canOperate: boolean;
  requiresIntervention: boolean;
  timestamp: number;
}
```

---

### `executeEmergencyVaultRecovery(vaultId: string, recoveryKey: string)`

Execute emergency vault recovery.

```typescript
const success = await emergencyRecoveryProtocol.executeEmergencyVaultRecovery(
  'vault-001',
  'recovery-key-123'
);
```

**Returns:** `Promise<boolean>`

---

### `createEmergencyRecoverySignature(vaultAddress: string, recoveryPrivateKey: string, nonce: number)` 🆕

**CRITICAL BUG FIX**: Create nonce-based emergency recovery signature (replaces broken timestamp-based signatures).

```typescript
// Create signature with nonce for replay protection
const { signature, nonce } = await emergencyRecoveryProtocol.createEmergencyRecoverySignature(
  '0x99444B0B1d6F7b21e9234229a2AC2bC0150B9d91', // vault address
  '0x...recoveryPrivateKey',                      // authorized recovery key
  Date.now()                                       // unique nonce (timestamp or random)
);

// Use signature to activate emergency mode on contract
await vaultContract.activateEmergencyMode(signature, nonce);
```

**Parameters:**
- `vaultAddress` - Ethereum address of the vault contract
- `recoveryPrivateKey` - Private key authorized for emergency recovery
- `nonce` - Unique number to prevent replay attacks (recommended: `Date.now()` or random)

**Returns:** `Promise<{ signature: string; nonce: number }>`

**Important Notes:**
- 🔴 **Bug Fix**: Previous implementation used `block.timestamp` which caused signature verification failures
- ✅ **New Implementation**: Uses nonce-based replay protection for reliable signature verification
- 🔒 **Security**: Each nonce can only be used once (prevents replay attacks)

---

### Events

- `recovery:status-changed` - Recovery status changed
- `protocol:critical` - Protocol critical state
- `emergency:activated` - Emergency mode activated
- `emergency:approved` - Emergency recovery approved
- `emergency:denied` - Emergency recovery denied

---

## Trinity Protocol Core

### `initialize()`

Initialize Trinity Protocol.

```typescript
await trinityProtocol.initialize();
```

---

### `verifyOperation(request: TrinityVerificationRequest)`

Execute 2-of-3 consensus verification.

```typescript
const result = await trinityProtocol.verifyOperation({
  operationId: 'op-001',
  operationType: OperationType.VAULT_UNLOCK,
  vaultId: 'vault-001',
  requester: 'USER_ADDRESS',
  data: { unlockTime: Date.now() },
  requiredChains: 2
});
```

**Returns:** `Promise<TrinityVerificationResult>`

```typescript
interface TrinityVerificationResult {
  success: boolean;
  verifications: ChainVerification[];
  consensusReached: boolean;
  timestamp: number;
  proofHash: string;
}
```

---

### `emergencyRecovery(vaultId: string, recoveryKey: string)`

Execute emergency recovery (requires all 3 chains).

```typescript
const result = await trinityProtocol.emergencyRecovery('vault-001', 'recovery-key');
```

**Returns:** `Promise<TrinityVerificationResult>`

---

### `healthCheck()`

Check if all chains are healthy.

```typescript
const health = await trinityProtocol.healthCheck();
```

**Returns:** `Promise<{ ethereum: boolean; solana: boolean; ton: boolean }>`

---

## Operation Types

```typescript
enum OperationType {
  VAULT_CREATE = 'VAULT_CREATE',
  VAULT_UNLOCK = 'VAULT_UNLOCK',
  VAULT_WITHDRAW = 'VAULT_WITHDRAW',
  VAULT_MODIFY = 'VAULT_MODIFY',
  EMERGENCY_RECOVERY = 'EMERGENCY_RECOVERY'
}
```

---

## Error Handling

All async methods can throw errors. Always use try-catch:

```typescript
try {
  await trinityStateCoordinator.initialize();
} catch (error) {
  console.error('Initialization failed:', error);
}
```

---

## Rate Limits

- Event listeners: No rate limit (real-time)
- Health checks: Every 5 seconds
- Merkle proof generation: No limit
- Emergency recovery: Max 3 attempts per chain

---

## Support

For API questions or issues:
- Email: chronosvault@chronosvault.org
- GitHub: https://github.com/Chronos-Vault

---

**Last Updated:** October 11, 2025
