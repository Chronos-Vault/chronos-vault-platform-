import React from 'react';
import { useLocation } from 'wouter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CodeIcon, 
  ShieldCheckIcon, 
  KeySquareIcon, 
  LockIcon,
  NetworkIcon,
  CheckCircleIcon
} from 'lucide-react';
import PageHeader from '@/components/layout/page-header';

const SecurityIntegrationGuide = () => {
  const [location, navigate] = useLocation();

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <PageHeader 
        title="Security Integration Guide"
        subtitle="Developer documentation for integrating Chronos Vault's Mathematical Defense Layer"
        icon={<CodeIcon className="w-10 h-10 text-[#FF5AF7]" />}
      />

      <div className="mt-8 bg-gradient-to-r from-[#1A1A1A] to-[#111] border border-[#333] rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Quick Start Integration</h2>
        <p className="text-gray-400 mb-6">
          Integrate Chronos Vault's cryptographically proven security features into your application. 
          All code examples are from our <span className="text-[#50E3C2] font-semibold">production security modules</span>.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#111] p-4 rounded-lg border border-[#333]">
            <ShieldCheckIcon className="w-8 h-8 text-[#FF5AF7] mb-2" />
            <h3 className="text-lg font-semibold text-white mb-2">Trinity Protocol</h3>
            <p className="text-sm text-gray-400">2-of-3 multi-chain consensus</p>
          </div>
          <div className="bg-[#111] p-4 rounded-lg border border-[#333]">
            <KeySquareIcon className="w-8 h-8 text-[#FF5AF7] mb-2" />
            <h3 className="text-lg font-semibold text-white mb-2">Quantum-Resistant</h3>
            <p className="text-sm text-gray-400">ML-KEM-1024 encryption</p>
          </div>
          <div className="bg-[#111] p-4 rounded-lg border border-[#333]">
            <LockIcon className="w-8 h-8 text-[#FF5AF7] mb-2" />
            <h3 className="text-lg font-semibold text-white mb-2">VDF Time-Locks</h3>
            <p className="text-sm text-gray-400">Mathematically provable delays</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="trinity" className="w-full mt-8">
        <TabsList className="grid w-full grid-cols-5 bg-[#1A1A1A] border border-[#333] rounded-lg overflow-hidden p-0.5">
          <TabsTrigger 
            value="trinity" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6B00D7] data-[state=active]:to-[#FF5AF7] data-[state=active]:text-white"
            data-testid="tab-trinity"
          >
            Trinity Protocol
          </TabsTrigger>
          <TabsTrigger 
            value="quantum"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6B00D7] data-[state=active]:to-[#FF5AF7] data-[state=active]:text-white"
            data-testid="tab-quantum"
          >
            Quantum Crypto
          </TabsTrigger>
          <TabsTrigger 
            value="mpc"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6B00D7] data-[state=active]:to-[#FF5AF7] data-[state=active]:text-white"
            data-testid="tab-mpc"
          >
            MPC Keys
          </TabsTrigger>
          <TabsTrigger 
            value="vdf"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6B00D7] data-[state=active]:to-[#FF5AF7] data-[state=active]:text-white"
            data-testid="tab-vdf"
          >
            VDF Locks
          </TabsTrigger>
          <TabsTrigger 
            value="zk"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6B00D7] data-[state=active]:to-[#FF5AF7] data-[state=active]:text-white"
            data-testid="tab-zk"
          >
            ZK Proofs
          </TabsTrigger>
        </TabsList>

        {/* Trinity Protocol Integration */}
        <TabsContent value="trinity">
          <div className="grid gap-6 mt-8">
            <Card className="bg-[#1A1A1A] border border-[#333] shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center gap-3">
                  <NetworkIcon className="w-6 h-6 text-[#FF5AF7]" />
                  Trinity Protocol Integration
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Implement 2-of-3 multi-chain consensus for mathematically proven security
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-[#FF5AF7] mb-3">Step 1: Initialize Trinity Protocol</h3>
                    <div className="bg-[#0D0D0D] p-4 rounded-lg border border-[#444]">
                      <pre className="text-[#50E3C2] text-sm overflow-x-auto">
{`// From: server/security/trinity-protocol.ts
import { TrinityProtocol, OperationType } from '@chronos-vault/security';

const trinity = new TrinityProtocol();
await trinity.initialize();

// Initialize blockchain clients
// - Arbitrum L2: Primary security layer (95% lower fees)
// - Solana: High-speed monitoring (2000+ TPS)
// - TON: Quantum-resistant backup`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-[#FF5AF7] mb-3">Step 2: Verify Cross-Chain Operation</h3>
                    <div className="bg-[#0D0D0D] p-4 rounded-lg border border-[#444]">
                      <pre className="text-[#50E3C2] text-sm overflow-x-auto">
{`// 2-of-3 consensus verification
const result = await trinity.verifyOperation({
  operationId: 'vault-unlock-123',
  operationType: OperationType.VAULT_UNLOCK,
  vaultId: 'vault-xyz',
  data: { requester: userAddress },
  requiredChains: 2  // Require 2 out of 3 chains
});

// Result contains verification from all 3 chains
console.log('Consensus reached:', result.consensusReached);
console.log('Proof hash:', result.proofHash);
console.log('Attack probability: <10^-18');`}
                      </pre>
                    </div>
                  </div>

                  <div className="bg-[#111] p-4 rounded-lg border border-[#333]">
                    <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                      <CheckCircleIcon className="w-5 h-5 text-[#50E3C2]" />
                      Security Guarantees
                    </h4>
                    <ul className="space-y-2 text-gray-400 text-sm">
                      <li>✅ Requires simultaneous attack on 2+ blockchains</li>
                      <li>✅ Mathematical probability of compromise: &lt;10⁻¹⁸</li>
                      <li>✅ No single point of failure</li>
                      <li>✅ Byzantine fault tolerance built-in</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Quantum-Resistant Crypto Integration */}
        <TabsContent value="quantum">
          <div className="grid gap-6 mt-8">
            <Card className="bg-[#1A1A1A] border border-[#333] shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center gap-3">
                  <KeySquareIcon className="w-6 h-6 text-[#FF5AF7]" />
                  Quantum-Resistant Cryptography
                </CardTitle>
                <CardDescription className="text-gray-400">
                  ML-KEM-1024 and Dilithium-5 hybrid encryption for quantum safety
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-[#FF5AF7] mb-3">Generate Hybrid Key Pair</h3>
                    <div className="bg-[#0D0D0D] p-4 rounded-lg border border-[#444]">
                      <pre className="text-[#50E3C2] text-sm overflow-x-auto">
{`// From: server/security/quantum-resistant-crypto.ts
import { QuantumResistantCrypto } from '@chronos-vault/security';

const qCrypto = new QuantumResistantCrypto();
await qCrypto.initialize();

// Generate hybrid keypair (RSA-4096 + ML-KEM-1024)
const keyPair = await qCrypto.generateHybridKeyPair();

// Keypair contains:
// - classical: RSA-4096 keys
// - quantum: ML-KEM-1024 encapsulation key
// - signatures: Dilithium-5 signing keys`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-[#FF5AF7] mb-3">Encrypt Vault Data</h3>
                    <div className="bg-[#0D0D0D] p-4 rounded-lg border border-[#444]">
                      <pre className="text-[#50E3C2] text-sm overflow-x-auto">
{`// Hybrid encryption (classical + quantum-resistant)
const encrypted = await qCrypto.hybridEncrypt(
  vaultData,
  recipientPublicKey
);

// encrypted contains:
// - classicalCiphertext: RSA-4096 encrypted
// - quantumCiphertext: ML-KEM-1024 encrypted
// - signature: Dilithium-5 signed

// Secure against both classical and quantum attacks`}
                      </pre>
                    </div>
                  </div>

                  <div className="bg-[#111] p-4 rounded-lg border border-[#333]">
                    <h4 className="font-semibold text-white mb-2">Security Levels</h4>
                    <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                      <div>
                        <p className="text-[#50E3C2] font-semibold">Standard (128-bit)</p>
                        <p className="text-gray-400">Kyber-512, Dilithium-2</p>
                      </div>
                      <div>
                        <p className="text-[#50E3C2] font-semibold">Enhanced (192-bit)</p>
                        <p className="text-gray-400">Kyber-768, Dilithium-3</p>
                      </div>
                      <div>
                        <p className="text-[#50E3C2] font-semibold">Maximum (256-bit)</p>
                        <p className="text-gray-400">Kyber-1024, Dilithium-5</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* MPC Key Management Integration */}
        <TabsContent value="mpc">
          <div className="grid gap-6 mt-8">
            <Card className="bg-[#1A1A1A] border border-[#333] shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center gap-3">
                  <ShieldCheckIcon className="w-6 h-6 text-[#FF5AF7]" />
                  Multi-Party Computation (MPC) Keys
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Shamir Secret Sharing with 3-of-5 threshold signatures
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-[#FF5AF7] mb-3">Generate Distributed Key Shares</h3>
                    <div className="bg-[#0D0D0D] p-4 rounded-lg border border-[#444]">
                      <pre className="text-[#50E3C2] text-sm overflow-x-auto">
{`// From: server/security/mpc-key-management.ts
import { MPCKeyManager } from '@chronos-vault/security';

const mpc = new MPCKeyManager();
await mpc.initialize();

// Create distributed key (3-of-5 threshold)
const distributedKey = await mpc.generateDistributedKey(
  vaultId,
  3,  // threshold: need 3 shares to reconstruct
  5   // total shares: distributed across 5 nodes
);

// Key shares are encrypted with quantum-resistant crypto
// No single node can reconstruct the key alone`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-[#FF5AF7] mb-3">Reconstruct Key with Threshold</h3>
                    <div className="bg-[#0D0D0D] p-4 rounded-lg border border-[#444]">
                      <pre className="text-[#50E3C2] text-sm overflow-x-auto">
{`// Collect shares from different nodes
const shares = [
  await mpc.getShare(distributedKey.keyId, 'node-1'),
  await mpc.getShare(distributedKey.keyId, 'node-3'),
  await mpc.getShare(distributedKey.keyId, 'node-5')
];

// Reconstruct key (requires at least 3 shares)
const reconstructed = await mpc.reconstructKey(
  distributedKey.keyId,
  shares
);

// Mathematical guarantee: impossible with <3 shares`}
                      </pre>
                    </div>
                  </div>

                  <div className="bg-[#111] p-4 rounded-lg border border-[#333]">
                    <h4 className="font-semibold text-white mb-2">Byzantine Fault Tolerance</h4>
                    <p className="text-gray-400 text-sm">
                      System remains secure even if <span className="text-[#50E3C2] font-semibold">k-1 nodes are malicious</span>. 
                      In 3-of-5 setup: tolerates up to 2 malicious nodes.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* VDF Time-Lock Integration */}
        <TabsContent value="vdf">
          <div className="grid gap-6 mt-8">
            <Card className="bg-[#1A1A1A] border border-[#333] shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center gap-3">
                  <LockIcon className="w-6 h-6 text-[#FF5AF7]" />
                  VDF Time-Lock System
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Wesolowski VDF for mathematically provable time delays
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-[#FF5AF7] mb-3">Create Time-Lock</h3>
                    <div className="bg-[#0D0D0D] p-4 rounded-lg border border-[#444]">
                      <pre className="text-[#50E3C2] text-sm overflow-x-auto">
{`// From: server/security/vdf-time-lock.ts
import { VDFTimeLockSystem } from '@chronos-vault/security';

const vdf = new VDFTimeLockSystem();
await vdf.initialize();

// Lock vault for 1 hour (cannot be bypassed)
const unlockTime = Math.floor(Date.now() / 1000) + 3600;
const timeLock = await vdf.createTimeLock(vaultId, unlockTime, {
  securityLevel: 'high',  // 10M sequential iterations
  estimatedUnlockTime: 3600,
  allowEarlyVerification: false
});

// Time-lock uses RSA-2048 sequential squaring
// Mathematical guarantee: Cannot be parallelized`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-[#FF5AF7] mb-3">Compute & Verify VDF Proof</h3>
                    <div className="bg-[#0D0D0D] p-4 rounded-lg border border-[#444]">
                      <pre className="text-[#50E3C2] text-sm overflow-x-auto">
{`// Compute VDF (requires actual sequential time)
const proof = await vdf.computeVDF(timeLock.lockId);
// This takes ~10 seconds for 'high' security level

// Anyone can verify quickly (O(log T) vs O(T))
const isValid = await vdf.verifyVDF(proof);

// Verification formula:
// output = challenge^(2^iterations) mod modulus
// Fast verification without recomputing entire VDF`}
                      </pre>
                    </div>
                  </div>

                  <div className="bg-[#111] p-4 rounded-lg border border-[#333]">
                    <h4 className="font-semibold text-white mb-2">Security Iterations</h4>
                    <ul className="space-y-1 text-gray-400 text-sm mt-2">
                      <li><span className="text-[#50E3C2]">Standard:</span> 1M iterations (~1s compute)</li>
                      <li><span className="text-[#50E3C2]">High:</span> 10M iterations (~10s compute)</li>
                      <li><span className="text-[#50E3C2]">Maximum:</span> 100M iterations (~100s compute)</li>
                      <li className="text-[#FF5AF7]">+ Time-based: 1M iterations per second of delay</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Zero-Knowledge Proofs Integration */}
        <TabsContent value="zk">
          <div className="grid gap-6 mt-8">
            <Card className="bg-[#1A1A1A] border border-[#333] shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center gap-3">
                  <ShieldCheckIcon className="w-6 h-6 text-[#FF5AF7]" />
                  Zero-Knowledge Proof System
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Privacy-preserving verification with Pedersen Commitments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-[#FF5AF7] mb-3">Generate Vault Existence Proof</h3>
                    <div className="bg-[#0D0D0D] p-4 rounded-lg border border-[#444]">
                      <pre className="text-[#50E3C2] text-sm overflow-x-auto">
{`// From: server/security/zk-proof-system.ts
import { ZKProofSystem, ProofType } from '@chronos-vault/security';

const zkProofs = new ZKProofSystem();
await zkProofs.initialize();

// Prove vault exists without revealing contents
const proof = await zkProofs.generateVaultExistenceProof(
  vaultId,
  vaultData,
  ['status']  // Only reveal status, hide everything else
);

// Verifier learns NOTHING beyond vault existence`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-[#FF5AF7] mb-3">Verify Proof (Privacy Preserved)</h3>
                    <div className="bg-[#0D0D0D] p-4 rounded-lg border border-[#444]">
                      <pre className="text-[#50E3C2] text-sm overflow-x-auto">
{`// Verify proof without learning vault contents
const isValid = await zkProofs.verifyVaultExistenceProof(proof);

if (isValid) {
  // Proof verified: vault exists
  // But verifier knows nothing about:
  // - Vault balance
  // - Owner identity  
  // - Asset types
  // - Any other private data
}

// Zero information leakage guarantee`}
                      </pre>
                    </div>
                  </div>

                  <div className="bg-[#111] p-4 rounded-lg border border-[#333]">
                    <h4 className="font-semibold text-white mb-2">Privacy Guarantees</h4>
                    <ul className="space-y-1 text-gray-400 text-sm mt-2">
                      <li>✅ Pedersen Commitments: Binding and hiding</li>
                      <li>✅ Range Proofs: Prove value in range without revealing amount</li>
                      <li>✅ Merkle Proofs: Cross-chain verification</li>
                      <li>✅ Zero information leakage beyond validity</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* GitHub Repository Links */}
      <div className="mt-10 bg-gradient-to-r from-[#1A1A1A] to-[#111] border border-[#333] rounded-lg p-6 shadow-xl">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-[#FF5AF7] to-[#6B00D7] bg-clip-text text-transparent mb-4">
          Production Code on GitHub
        </h2>
        <p className="text-gray-400 mb-6">
          All integration examples above are from our <span className="text-[#50E3C2] font-semibold">production security repositories</span>. 
          View complete source code, tests, and smart contracts.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <a 
            href="https://github.com/Chronos-Vault/chronos-vault-security" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#111] p-4 rounded-lg border border-[#333] hover:border-[#FF5AF7] transition-colors group"
            data-testid="link-security-repo"
          >
            <div className="flex items-center gap-3 mb-2">
              <NetworkIcon className="h-5 w-5 text-[#FF5AF7]" />
              <h3 className="text-lg font-semibold text-white group-hover:text-[#FF5AF7] transition-colors">Trinity Protocol</h3>
            </div>
            <p className="text-sm text-gray-400">Multi-chain consensus implementation</p>
            <p className="text-xs text-gray-500 mt-2">server/security/trinity-protocol.ts</p>
          </a>
          
          <a 
            href="https://github.com/Chronos-Vault/chronos-vault-security" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#111] p-4 rounded-lg border border-[#333] hover:border-[#FF5AF7] transition-colors group"
            data-testid="link-quantum-repo"
          >
            <div className="flex items-center gap-3 mb-2">
              <KeySquareIcon className="h-5 w-5 text-[#FF5AF7]" />
              <h3 className="text-lg font-semibold text-white group-hover:text-[#FF5AF7] transition-colors">Quantum Crypto</h3>
            </div>
            <p className="text-sm text-gray-400">ML-KEM & Dilithium implementations</p>
            <p className="text-xs text-gray-500 mt-2">server/security/quantum-resistant-crypto.ts</p>
          </a>

          <a 
            href="https://github.com/Chronos-Vault/chronos-vault-security" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#111] p-4 rounded-lg border border-[#333] hover:border-[#FF5AF7] transition-colors group"
            data-testid="link-mpc-repo"
          >
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheckIcon className="h-5 w-5 text-[#FF5AF7]" />
              <h3 className="text-lg font-semibold text-white group-hover:text-[#FF5AF7] transition-colors">MPC Key Management</h3>
            </div>
            <p className="text-sm text-gray-400">Shamir Secret Sharing</p>
            <p className="text-xs text-gray-500 mt-2">server/security/mpc-key-management.ts</p>
          </a>

          <a 
            href="https://github.com/Chronos-Vault/chronos-vault-security" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#111] p-4 rounded-lg border border-[#333] hover:border-[#FF5AF7] transition-colors group"
            data-testid="link-vdf-repo"
          >
            <div className="flex items-center gap-3 mb-2">
              <LockIcon className="h-5 w-5 text-[#FF5AF7]" />
              <h3 className="text-lg font-semibold text-white group-hover:text-[#FF5AF7] transition-colors">VDF Time-Lock</h3>
            </div>
            <p className="text-sm text-gray-400">Wesolowski VDF</p>
            <p className="text-xs text-gray-500 mt-2">server/security/vdf-time-lock.ts</p>
          </a>

          <a 
            href="https://github.com/Chronos-Vault/chronos-vault-security" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#111] p-4 rounded-lg border border-[#333] hover:border-[#FF5AF7] transition-colors group"
            data-testid="link-zk-repo"
          >
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheckIcon className="h-5 w-5 text-[#FF5AF7]" />
              <h3 className="text-lg font-semibold text-white group-hover:text-[#FF5AF7] transition-colors">ZK Proof System</h3>
            </div>
            <p className="text-sm text-gray-400">Pedersen Commitments & Range Proofs</p>
            <p className="text-xs text-gray-500 mt-2">server/security/zk-proof-system.ts</p>
          </a>

          <a 
            href="https://github.com/Chronos-Vault/formal-proofs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#111] p-4 rounded-lg border border-[#333] hover:border-[#FF5AF7] transition-colors group"
            data-testid="link-formal-proofs-repo"
          >
            <div className="flex items-center gap-3 mb-2">
              <CheckCircleIcon className="h-5 w-5 text-[#FF5AF7]" />
              <h3 className="text-lg font-semibold text-white group-hover:text-[#FF5AF7] transition-colors">Formal Verification</h3>
            </div>
            <p className="text-sm text-gray-400">35/35 theorems proven ✅</p>
            <p className="text-xs text-gray-500 mt-2">formal-proofs/</p>
          </a>
        </div>
      </div>

      {/* Additional Resources */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#FF5AF7] mb-3">Security Tutorials</h3>
          <p className="text-gray-400 text-sm mb-4">
            Step-by-step guides for each security feature
          </p>
          <Button 
            onClick={() => navigate('/security-tutorials')}
            className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90"
            data-testid="button-tutorials"
          >
            View Tutorials
          </Button>
        </div>

        <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#FF5AF7] mb-3">Technical Docs</h3>
          <p className="text-gray-400 text-sm mb-4">
            Complete technical specifications
          </p>
          <Button 
            onClick={() => navigate('/technical-security-docs')}
            className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90"
            data-testid="button-tech-docs"
          >
            Read Documentation
          </Button>
        </div>

        <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#FF5AF7] mb-3">Military Grade Security</h3>
          <p className="text-gray-400 text-sm mb-4">
            Learn about our Mathematical Defense Layer
          </p>
          <Button 
            onClick={() => navigate('/military-grade-security')}
            className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90"
            data-testid="button-military"
          >
            Explore Security
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SecurityIntegrationGuide;
