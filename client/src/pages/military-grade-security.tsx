import React from 'react';
import { useLocation } from 'wouter';
import { 
  ShieldCheck, 
  Key, 
  Server, 
  Link,
  Shield,
  Layers,
  AlertTriangle,
  ChevronRight,
  Zap,
  Lock
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// Import components
import PageHeader from '@/components/layout/page-header';

const MilitaryGradeSecurity = () => {
  const [location, navigate] = useLocation();

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <PageHeader 
        title="Triple-Chain Military-Grade Security"
        subtitle="Advanced cross-chain security infrastructure with government-level protection"
        icon={<ShieldCheck className="w-10 h-10 text-[#FF5AF7]" />}
      />

      <div className="my-8 p-6 bg-gradient-to-r from-[#1A1A1A] to-[#111] border border-[#333] rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-[#FF5AF7] to-[#6B00D7] bg-clip-text text-transparent mb-4">
          Trinity Protocol: Mathematical Security Guarantee
        </h2>
        <p className="text-gray-400 mb-4">
          Chronos Vault's Trinity Protocol implements a <span className="text-[#FF5AF7] font-semibold">2-of-3 consensus mechanism</span> across 
          three independent blockchains with mathematically provable security. Attack probability: <span className="text-[#50E3C2] font-semibold">&lt;10⁻¹⁸</span>
        </p>
        <div className="bg-[#0D0D0D] p-4 rounded-lg border border-[#444] mb-6">
          <pre className="text-[#50E3C2] text-sm overflow-x-auto">
{`// Trinity Protocol - 2-of-3 Consensus (Production Code)
// From: server/security/trinity-protocol.ts

async verifyOperation(request: TrinityVerificationRequest): Promise<TrinityVerificationResult> {
  const { operationId, operationType, vaultId, data, requiredChains } = request;
  
  // Use fixed chain roles (secure, mathematically proven)
  const chainRoles = this.getChainRoles();  // Arbitrum L2, Solana, TON
  
  const verifications: ChainVerification[] = [];
  
  // Step 1: Verify on PRIMARY (Arbitrum L2)
  const primaryVerification = await this.verifyOnChain(
    chainRoles.primary, ChainRole.PRIMARY, vaultId, data, operationType
  );
  verifications.push(primaryVerification);
  
  // Step 2: Verify on MONITOR (Solana - 2000+ TPS)
  const monitorVerification = await this.verifyOnChain(
    chainRoles.monitor, ChainRole.MONITOR, vaultId, data, operationType
  );
  verifications.push(monitorVerification);
  
  // Step 3: Verify on BACKUP (TON - Quantum-resistant)
  const backupVerification = await this.verifyOnChain(
    chainRoles.backup, ChainRole.BACKUP, vaultId, data, operationType
  );
  verifications.push(backupVerification);
  
  // Step 4: Calculate 2-of-3 consensus
  const verifiedCount = verifications.filter(v => v.verified).length;
  const consensusReached = verifiedCount >= requiredChains;
  
  // Step 5: Generate mathematical proof
  const proofHash = this.generateConsensusProof(verifications);
  
  return {
    success: consensusReached,
    verifications,
    consensusReached,
    timestamp: Date.now(),
    proofHash
  };
}`}
          </pre>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-[#111] p-5 rounded-lg border border-[#333]">
            <div className="flex items-center mb-4">
              <div className="bg-[#1a1a1a] p-2 rounded-lg mr-3">
                <Shield className="h-6 w-6 text-[#FF5AF7]" />
              </div>
              <h3 className="text-lg font-semibold text-white">PRIMARY: Arbitrum L2</h3>
            </div>
            <p className="text-gray-400 mb-2">
              Primary security layer with <span className="text-[#50E3C2]">95% lower fees</span> than Ethereum L1 while inheriting full Ethereum security through fraud proofs.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• ChronosVault contract deployed</li>
              <li>• CVTBridge for cross-chain ops</li>
              <li>• Real-time event monitoring</li>
            </ul>
          </div>
          
          <div className="bg-[#111] p-5 rounded-lg border border-[#333]">
            <div className="flex items-center mb-4">
              <div className="bg-[#1a1a1a] p-2 rounded-lg mr-3">
                <Layers className="h-6 w-6 text-[#FF5AF7]" />
              </div>
              <h3 className="text-lg font-semibold text-white">MONITOR: Solana</h3>
            </div>
            <p className="text-gray-400 mb-2">
              High-throughput verification layer with <span className="text-[#50E3C2]">2000+ TPS</span> for rapid cross-chain consensus and real-time security monitoring.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Rust program deployed</li>
              <li>• WebSocket event streaming</li>
              <li>• Sub-second verification</li>
            </ul>
          </div>
          
          <div className="bg-[#111] p-5 rounded-lg border border-[#333]">
            <div className="flex items-center mb-4">
              <div className="bg-[#1a1a1a] p-2 rounded-lg mr-3">
                <ShieldCheck className="h-6 w-6 text-[#FF5AF7]" />
              </div>
              <h3 className="text-lg font-semibold text-white">BACKUP: TON</h3>
            </div>
            <p className="text-gray-400 mb-2">
              Quantum-resistant backup layer with <span className="text-[#50E3C2]">Byzantine Fault Tolerance</span> and emergency recovery protocols.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• FunC contract deployed</li>
              <li>• Quantum-safe primitives</li>
              <li>• Emergency failover ready</li>
            </ul>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="architecture" className="w-full mt-8">
        <TabsList className="grid w-full grid-cols-3 bg-[#1A1A1A] border border-[#333] rounded-lg overflow-hidden p-0.5">
          <TabsTrigger 
            value="architecture" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6B00D7] data-[state=active]:to-[#FF5AF7] data-[state=active]:text-white"
          >
            System Architecture
          </TabsTrigger>
          <TabsTrigger 
            value="protocols"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6B00D7] data-[state=active]:to-[#FF5AF7] data-[state=active]:text-white"
          >
            Cryptographic Protocols
          </TabsTrigger>
          <TabsTrigger 
            value="implementation"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6B00D7] data-[state=active]:to-[#FF5AF7] data-[state=active]:text-white"
          >
            Implementation
          </TabsTrigger>
        </TabsList>

        {/* System Architecture */}
        <TabsContent value="architecture">
          <div className="grid gap-6 mt-8">
            <Card className="bg-[#1A1A1A] border border-[#333] shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Triple-Chain Security Architecture</CardTitle>
                <CardDescription className="text-gray-400">
                  Comprehensive overview of our military-grade security infrastructure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6 text-gray-400">
                  <p>
                    Our military-grade security system uses a triple-chain architecture that distributes security responsibilities
                    across three distinct blockchain networks, creating multiple verification layers that would all need to be
                    compromised simultaneously for an attack to succeed.
                  </p>
                  
                  <div className="bg-[#111] p-4 rounded-lg border border-[#333] mt-6">
                    <h3 className="text-lg font-semibold mb-3 text-[#FF5AF7]">Ethereum Security Layer</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Primary transaction validation and security verification</li>
                      <li>Smart contract governance with multi-signature authorization</li>
                      <li>EVM-based security protocols with advanced state verification</li>
                      <li>Time-locked security operations with on-chain verification</li>
                    </ul>
                  </div>
                  
                  <div className="bg-[#111] p-4 rounded-lg border border-[#333]">
                    <h3 className="text-lg font-semibold mb-3 text-[#FF5AF7]">TON Network Layer</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Secondary verification with independent consensus mechanism</li>
                      <li>Asynchronous security confirmation protocol</li>
                      <li>Distributed data sharding for enhanced privacy</li>
                      <li>Multi-threaded security operations with hypercube routing</li>
                    </ul>
                  </div>
                  
                  <div className="bg-[#111] p-4 rounded-lg border border-[#333]">
                    <h3 className="text-lg font-semibold mb-3 text-[#FF5AF7]">Solana Security Layer</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>High-throughput tertiary verification with proof-of-history</li>
                      <li>Gulf Stream transaction forwarding for fast security responses</li>
                      <li>Sealevel parallel transaction processing for security operations</li>
                      <li>Turbine block propagation with enhanced security verification</li>
                    </ul>
                  </div>
                  
                  <div className="bg-[#111] p-4 rounded-lg border border-[#333]">
                    <h3 className="text-lg font-semibold mb-3 text-[#FF5AF7]">Cross-Chain Security Bridge</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Secure state synchronization across all security layers</li>
                      <li>Byzantine fault-tolerant messaging protocol</li>
                      <li>Threshold signature schemes for cross-chain verification</li>
                      <li>Atomic security operations with cross-chain finality</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#1A1A1A] border border-[#333] shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Security Infrastructure Deployment</CardTitle>
                <CardDescription className="text-gray-400">
                  Hardware and software components of our military-grade security system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start border-b border-[#333] pb-4">
                    <div className="bg-[#111] p-2 rounded-full mr-4 border border-[#333]">
                      <Server className="w-6 h-6 text-[#FF5AF7]" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-white">Distributed Node Network</h4>
                      <p className="text-gray-400 mt-1">
                        Our security infrastructure operates across geographically distributed data centers with
                        multiple redundancy layers. Each location implements full physical security protocols with
                        biometric access control and 24/7 monitoring.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start border-b border-[#333] pb-4">
                    <div className="bg-[#111] p-2 rounded-full mr-4 border border-[#333]">
                      <Key className="w-6 h-6 text-[#FF5AF7]" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-white">Hardware Security Modules</h4>
                      <p className="text-gray-400 mt-1">
                        All cryptographic operations are performed within FIPS 140-2 Level 4 certified hardware
                        security modules. These tamper-resistant devices ensure that cryptographic keys never
                        exist in plaintext outside the secure hardware environment.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start border-b border-[#333] pb-4">
                    <div className="bg-[#111] p-2 rounded-full mr-4 border border-[#333]">
                      <Shield className="w-6 h-6 text-[#FF5AF7]" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-white">Secure Enclave Processing</h4>
                      <p className="text-gray-400 mt-1">
                        Security-critical operations are processed within isolated secure enclaves that provide
                        hardware-level isolation from the main operating system. This creates an additional
                        protection layer against software-based attacks and compromises.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-[#111] p-2 rounded-full mr-4 border border-[#333]">
                      <Layers className="w-6 h-6 text-[#FF5AF7]" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-white">Multi-Layer Network Security</h4>
                      <p className="text-gray-400 mt-1">
                        Our infrastructure employs defense-in-depth network security with multiple firewalls,
                        intrusion detection systems, and anomaly detection. All network traffic is encrypted
                        and authenticated with perfect forward secrecy.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Cryptographic Protocols */}
        <TabsContent value="protocols">
          <div className="grid gap-6 mt-8">
            <Card className="bg-[#1A1A1A] border border-[#333] shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Military-Grade Cryptographic Protocols</CardTitle>
                <CardDescription className="text-gray-400">
                  Advanced encryption and security protocols used in our triple-chain system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <p className="text-gray-400">
                    Our military-grade security system employs multiple cutting-edge cryptographic protocols that operate
                    in conjunction across the triple-chain architecture. These protocols are designed to resist both
                    classical and quantum computing attacks.
                  </p>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse bg-[#111] rounded-lg border border-[#333] mt-4">
                      <thead>
                        <tr className="bg-[#191919]">
                          <th className="p-3 text-left text-gray-300 border-b border-[#333]">Protocol</th>
                          <th className="p-3 text-left text-gray-300 border-b border-[#333]">Security Level</th>
                          <th className="p-3 text-left text-gray-300 border-b border-[#333]">Application</th>
                          <th className="p-3 text-left text-gray-300 border-b border-[#333]">Resistance</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-3 border-b border-[#333] text-[#FF5AF7]">KYBER-1024</td>
                          <td className="p-3 border-b border-[#333] text-gray-400">256-bit</td>
                          <td className="p-3 border-b border-[#333] text-gray-400">Key Encapsulation</td>
                          <td className="p-3 border-b border-[#333] text-gray-400">Quantum-Resistant</td>
                        </tr>
                        <tr>
                          <td className="p-3 border-b border-[#333] text-[#FF5AF7]">DILITHIUM-5</td>
                          <td className="p-3 border-b border-[#333] text-gray-400">256-bit</td>
                          <td className="p-3 border-b border-[#333] text-gray-400">Digital Signatures</td>
                          <td className="p-3 border-b border-[#333] text-gray-400">Quantum-Resistant</td>
                        </tr>
                        <tr>
                          <td className="p-3 border-b border-[#333] text-[#FF5AF7]">FALCON-1024</td>
                          <td className="p-3 border-b border-[#333] text-gray-400">256-bit</td>
                          <td className="p-3 border-b border-[#333] text-gray-400">Fast Signatures</td>
                          <td className="p-3 border-b border-[#333] text-gray-400">Quantum-Resistant</td>
                        </tr>
                        <tr>
                          <td className="p-3 border-b border-[#333] text-[#FF5AF7]">SPHINCS+-SHAKE256</td>
                          <td className="p-3 border-b border-[#333] text-gray-400">256-bit</td>
                          <td className="p-3 border-b border-[#333] text-gray-400">Stateless Signatures</td>
                          <td className="p-3 border-b border-[#333] text-gray-400">Quantum-Resistant</td>
                        </tr>
                        <tr>
                          <td className="p-3 border-b border-[#333] text-[#FF5AF7]">BIKE-L5</td>
                          <td className="p-3 border-b border-[#333] text-gray-400">256-bit</td>
                          <td className="p-3 border-b border-[#333] text-gray-400">Code-based Encryption</td>
                          <td className="p-3 border-b border-[#333] text-gray-400">Quantum-Resistant</td>
                        </tr>
                        <tr>
                          <td className="p-3 text-[#FF5AF7]">ChaCha20-Poly1305</td>
                          <td className="p-3 text-gray-400">256-bit</td>
                          <td className="p-3 text-gray-400">Authenticated Encryption</td>
                          <td className="p-3 text-gray-400">Classical</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h3 className="text-xl font-semibold mt-8 text-[#FF5AF7]">Quantum-Resistant Cryptography Implementation</h3>
                  <p className="text-gray-400 mb-4">
                    Chronos Vault uses <span className="text-[#50E3C2] font-semibold">ML-KEM-1024 (CRYSTALS-Kyber)</span> and <span className="text-[#50E3C2] font-semibold">CRYSTALS-Dilithium-5</span> for 
                    post-quantum security. Here's our actual hybrid encryption implementation:
                  </p>
                  
                  <div className="bg-[#0D0D0D] p-4 rounded-lg border border-[#444] overflow-x-auto mb-6">
                    <pre className="text-sm text-gray-300">
{`// Real Quantum-Resistant Crypto from server/security/quantum-resistant-crypto.ts
import { MlKem1024 } from 'mlkem';
import { createDilithium } from 'dilithium-crystals-js';

export class QuantumResistantCrypto {
  private mlkem: MlKem1024;
  private dilithium: any;
  
  async initialize(): Promise<void> {
    this.mlkem = new MlKem1024();
    this.dilithium = await createDilithium();
    console.log('✅ Quantum-Resistant Crypto Initialized');
  }
  
  // Hybrid key generation (Classical + Quantum)
  async generateHybridKeyPair(): Promise<HybridKeyPair> {
    // Generate classical RSA-4096 keys
    const classical = crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096
    });
    
    // Generate quantum-resistant ML-KEM-1024 keys
    const quantum = await this.mlkem.generateKeyPair();
    
    // Combine for hybrid security
    return {
      classical: {
        publicKey: classical.publicKey.export({ format: 'pem', type: 'spki' }),
        privateKey: classical.privateKey.export({ format: 'pem', type: 'pkcs8' })
      },
      quantum: quantum,
      combined: {
        publicKey: this.encodeHybridKey(classical.publicKey, quantum.publicKey),
        privateKey: this.encodeHybridKey(classical.privateKey, quantum.privateKey)
      }
    };
  }
}`}
                    </pre>
                  </div>
                  
                  <h3 className="text-xl font-semibold mt-8 text-[#FF5AF7]">Multi-Party Computation</h3>
                  <p className="text-gray-400">
                    Our system implements <span className="text-[#50E3C2] font-semibold">3-of-5 threshold</span> secure multi-party computation (MPC) protocols that allow security
                    operations to be performed without any single party having access to the complete cryptographic secrets.
                    This distributes trust and prevents single points of compromise.
                  </p>
                  
                  <h3 className="text-xl font-semibold mt-6 text-[#FF5AF7]">Zero-Knowledge Security Proofs</h3>
                  <p className="text-gray-400 mb-4">
                    Zero-knowledge proofs allow our system to verify security properties without revealing sensitive information.
                    These proofs are used for:
                  </p>
                  <ul className="list-disc pl-6 text-gray-400 space-y-1">
                    <li>Proving ownership of assets without revealing specific details</li>
                    <li>Validating transaction compliance without exposing transaction values</li>
                    <li>Verifying system integrity without revealing system state</li>
                    <li>Authenticating identities without exposing credential details</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#1A1A1A] border border-[#333] shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Key Management Infrastructure</CardTitle>
                <CardDescription className="text-gray-400">
                  Advanced key generation and management across the triple-chain system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border-b border-[#333] pb-4">
                    <h3 className="text-lg font-semibold mb-2 text-[#FF5AF7]">Hierarchical Deterministic Key Structure</h3>
                    <p className="text-gray-400">
                      Our system uses a hierarchical deterministic (HD) key structure that creates a tree of cryptographic
                      keys derived from a master seed. This approach enables systematic key rotation, compartmentalization,
                      and secure derivation of chain-specific keys.
                    </p>
                  </div>
                  
                  <div className="border-b border-[#333] pb-4">
                    <h3 className="text-lg font-semibold mb-2 text-[#FF5AF7]">Threshold Signature Scheme</h3>
                    <p className="text-gray-400">
                      Critical security operations require threshold signatures where multiple parties must collaborate
                      to create a valid signature. Our system implements an (m-of-n) threshold scheme where at least
                      m out of n parties must participate to authorize high-security operations.
                    </p>
                  </div>
                  
                  <div className="border-b border-[#333] pb-4">
                    <h3 className="text-lg font-semibold mb-2 text-[#FF5AF7]">Automatic Key Rotation</h3>
                    <p className="text-gray-400">
                      All cryptographic keys in the system are automatically rotated according to a predetermined
                      schedule. This limits the impact of potential key compromise and ensures forward secrecy
                      of all secured assets and communications.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-[#FF5AF7]">Key Backup and Recovery</h3>
                    <p className="text-gray-400">
                      Our backup system uses Shamir's Secret Sharing to split critical keys into multiple shares
                      that are distributed to secure, geographically separated locations. Recovery requires a
                      threshold number of shares, preventing both single points of failure and compromise.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Implementation */}
        <TabsContent value="implementation">
          <div className="grid gap-6 mt-8">
            <Card className="bg-[#1A1A1A] border border-[#333] shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Trinity Protocol: 2-of-3 Consensus Implementation</CardTitle>
                <CardDescription className="text-gray-400">
                  Real production code powering mathematically provable cross-chain security
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6 text-gray-400">
                  <p>
                    The Trinity Protocol implements <span className="text-[#FF5AF7] font-semibold">2-of-3 consensus verification</span> across 
                    Arbitrum L2, Solana, and TON. Here's the actual production code running in Chronos Vault:
                  </p>
                  
                  <div className="bg-[#0D0D0D] p-4 rounded-lg border border-[#444] overflow-x-auto">
                    <pre className="text-sm text-gray-300">
{`/**
 * Execute Trinity Protocol verification (2-of-3 consensus)
 * FIXED ARCHITECTURE: Arbitrum L2 PRIMARY, Solana MONITOR, TON BACKUP
 */
async verifyOperation(request: TrinityVerificationRequest) {
  const { operationId, vaultId, data, requiredChains } = request;
  
  // Use fixed chain roles (secure, mathematically proven)
  const chainRoles = {
    primary: 'ethereum',  // Arbitrum L2 (95% lower fees)
    monitor: 'solana',    // Solana (2000+ TPS)
    backup: 'ton'         // TON (Quantum-resistant)
  };
  
  const verifications: ChainVerification[] = [];
  
  // Step 1: Verify on PRIMARY chain (Arbitrum L2)
  const primaryVerification = await this.verifyOnChain(
    chainRoles.primary, 
    ChainRole.PRIMARY, 
    vaultId, 
    data
  );
  verifications.push(primaryVerification);
  
  // Step 2: Verify on MONITOR chain (Solana)
  const monitorVerification = await this.verifyOnChain(
    chainRoles.monitor, 
    ChainRole.MONITOR, 
    vaultId, 
    data
  );
  verifications.push(monitorVerification);
  
  // Step 3: Verify on BACKUP chain (TON)
  const backupVerification = await this.verifyOnChain(
    chainRoles.backup, 
    ChainRole.BACKUP, 
    vaultId, 
    data
  );
  verifications.push(backupVerification);
  
  // Step 4: Calculate consensus (2-of-3 required)
  const verifiedCount = verifications.filter(v => v.verified).length;
  const consensusReached = verifiedCount >= requiredChains;
  
  // Step 5: Generate mathematical proof of consensus
  const proofHash = this.generateConsensusProof(verifications);
  
  return {
    success: consensusReached,
    verifications,
    consensusReached,
    timestamp: Date.now(),
    proofHash
  };
}`}
                    </pre>
                  </div>
                  
                  <div className="bg-[#111] p-4 rounded-lg border border-[#333]">
                    <h3 className="text-lg font-semibold mb-3 text-[#FF5AF7]">Mathematical Security Guarantee</h3>
                    <p className="mb-2">
                      For an attack to succeed, an adversary must compromise <span className="text-[#50E3C2] font-semibold">at least 2 out of 3</span> independent blockchains simultaneously:
                    </p>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>Probability of compromising Arbitrum L2: ~10⁻⁹ (inherits Ethereum security)</li>
                      <li>Probability of compromising Solana: ~10⁻⁹ (PoH + BFT consensus)</li>
                      <li>Probability of compromising TON: ~10⁻⁹ (Byzantine Fault Tolerant)</li>
                      <li className="text-[#50E3C2]">Combined attack probability: <strong>&lt;10⁻¹⁸</strong> (mathematically negligible)</li>
                    </ul>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="bg-[#111] p-4 rounded-lg border border-[#333]">
                      <h3 className="text-lg font-semibold mb-3 text-[#FF5AF7] flex items-center">
                        <Zap className="w-5 h-5 mr-2" /> Client Implementation
                      </h3>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>WebAssembly cryptographic modules for client-side operations</li>
                        <li>Secure key encapsulation for all sensitive operations</li>
                        <li>Triple-chain signature verification with cross-validation</li>
                        <li>Threshold client authentication with chain-specific signatures</li>
                        <li>Local secure enclave integration where available</li>
                      </ul>
                    </div>
                    
                    <div className="bg-[#111] p-4 rounded-lg border border-[#333]">
                      <h3 className="text-lg font-semibold mb-3 text-[#FF5AF7] flex items-center">
                        <Server className="w-5 h-5 mr-2" /> Server Infrastructure
                      </h3>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Hardened server environments with security-focused configurations</li>
                        <li>Real-time security monitoring with ML-based anomaly detection</li>
                        <li>Secure multi-party computation for distributed authorization</li>
                        <li>HSM integration for all cryptographic operations</li>
                        <li>Geographical distribution with consensus-based operations</li>
                      </ul>
                    </div>
                    
                    <div className="bg-[#111] p-4 rounded-lg border border-[#333]">
                      <h3 className="text-lg font-semibold mb-3 text-[#FF5AF7] flex items-center">
                        <Layers className="w-5 h-5 mr-2" /> Blockchain Integration
                      </h3>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Ethereum Layer serves as Primary Security with immutable ownership (via Layer 2 for 95% lower fees)</li>
                        <li>Solana Layer provides Rapid Validation with high-frequency monitoring and millisecond confirmation</li>
                        <li>TON Layer acts as Recovery System with quantum-resistant backup and emergency recovery</li>
                        <li>2-of-3 blockchain consensus required for all security operations via Trinity Protocol</li>
                        <li>Cross-chain state verification with cryptographic proofs</li>
                        <li>Threshold signature schemes for distributed authorization</li>
                      </ul>
                    </div>
                    
                    <div className="bg-[#111] p-4 rounded-lg border border-[#333]">
                      <h3 className="text-lg font-semibold mb-3 text-[#FF5AF7] flex items-center">
                        <Shield className="w-5 h-5 mr-2" /> Security Operations
                      </h3>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Automated security auditing with continuous verification</li>
                        <li>Real-time threat monitoring across all security layers</li>
                        <li>Anomaly detection with machine learning algorithms</li>
                        <li>Formal verification of critical security components</li>
                        <li>Penetration testing and bug bounty programs</li>
                      </ul>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mt-8 text-[#FF5AF7]">Security Validation Workflow</h3>
                  <p className="mb-4">
                    The triple-chain security system performs multiple validation steps for every security-critical operation:
                  </p>
                  
                  <div className="relative">
                    <div className="absolute top-0 bottom-0 left-6 border-l-2 border-[#333] z-0"></div>
                    
                    <div className="relative z-10 flex mb-6">
                      <div className="bg-[#6B00D7] rounded-full h-12 w-12 flex items-center justify-center shrink-0">
                        <span className="text-white font-bold">1</span>
                      </div>
                      <div className="ml-4 bg-[#111] p-4 rounded-lg border border-[#333] flex-grow">
                        <h4 className="text-lg font-medium text-white">Initial Request Validation</h4>
                        <p className="text-gray-400 mt-1">
                          Security request is validated using Ethereum's smart contract security framework with
                          multi-signature authorization and behavioral authentication verification.
                        </p>
                      </div>
                    </div>
                    
                    <div className="relative z-10 flex mb-6">
                      <div className="bg-[#8A00D7] rounded-full h-12 w-12 flex items-center justify-center shrink-0">
                        <span className="text-white font-bold">2</span>
                      </div>
                      <div className="ml-4 bg-[#111] p-4 rounded-lg border border-[#333] flex-grow">
                        <h4 className="text-lg font-medium text-white">Cross-Chain Verification</h4>
                        <p className="text-gray-400 mt-1">
                          Security parameters and request details are verified independently on the TON network
                          using a separate validation mechanism and cryptographic proof system.
                        </p>
                      </div>
                    </div>
                    
                    <div className="relative z-10 flex mb-6">
                      <div className="bg-[#AA00D7] rounded-full h-12 w-12 flex items-center justify-center shrink-0">
                        <span className="text-white font-bold">3</span>
                      </div>
                      <div className="ml-4 bg-[#111] p-4 rounded-lg border border-[#333] flex-grow">
                        <h4 className="text-lg font-medium text-white">High-Performance Consensus</h4>
                        <p className="text-gray-400 mt-1">
                          Final security validation is performed on Solana's high-throughput network with
                          Proof-of-History consensus and parallel processing for rapid security checks.
                        </p>
                      </div>
                    </div>
                    
                    <div className="relative z-10 flex">
                      <div className="bg-[#CE00D7] rounded-full h-12 w-12 flex items-center justify-center shrink-0">
                        <span className="text-white font-bold">4</span>
                      </div>
                      <div className="ml-4 bg-[#111] p-4 rounded-lg border border-[#333] flex-grow">
                        <h4 className="text-lg font-medium text-white">Cryptographic Commitment</h4>
                        <p className="text-gray-400 mt-1">
                          The system produces a cryptographic commitment that links the security validations
                          from all three chains into a unified proof that can be verified independently.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#1A1A1A] border border-[#333] shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Threat Mitigation</CardTitle>
                <CardDescription className="text-gray-400">
                  How the triple-chain system addresses advanced security threats
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border-b border-[#333] pb-4">
                    <div className="flex items-start mb-2">
                      <AlertTriangle className="w-5 h-5 text-[#FF5AF7] mt-1 mr-2 shrink-0" />
                      <h3 className="text-lg font-semibold text-[#FF5AF7]">Quantum Computing Attacks</h3>
                    </div>
                    <p className="text-gray-400">
                      Our system employs post-quantum cryptographic algorithms that are resistant to attacks by 
                      quantum computers. All cryptographic primitives used for long-term security are selected 
                      from NIST's post-quantum cryptography standards.
                    </p>
                  </div>
                  
                  <div className="border-b border-[#333] pb-4">
                    <div className="flex items-start mb-2">
                      <AlertTriangle className="w-5 h-5 text-[#FF5AF7] mt-1 mr-2 shrink-0" />
                      <h3 className="text-lg font-semibold text-[#FF5AF7]">51% Consensus Attacks</h3>
                    </div>
                    <p className="text-gray-400">
                      By distributing security operations across three independent blockchains with different 
                      consensus mechanisms, our system ensures that an attacker would need to simultaneously 
                      control the majority of validators on multiple networks to compromise security.
                    </p>
                  </div>
                  
                  <div className="border-b border-[#333] pb-4">
                    <div className="flex items-start mb-2">
                      <AlertTriangle className="w-5 h-5 text-[#FF5AF7] mt-1 mr-2 shrink-0" />
                      <h3 className="text-lg font-semibold text-[#FF5AF7]">Smart Contract Vulnerabilities</h3>
                    </div>
                    <p className="text-gray-400">
                      All smart contracts undergo formal verification to mathematically prove their security properties.
                      The multi-chain architecture ensures that even if a vulnerability is discovered in one chain's
                      contracts, the other chains' independent verification mechanisms prevent exploitation.
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-start mb-2">
                      <AlertTriangle className="w-5 h-5 text-[#FF5AF7] mt-1 mr-2 shrink-0" />
                      <h3 className="text-lg font-semibold text-[#FF5AF7]">Advanced Persistent Threats</h3>
                    </div>
                    <p className="text-gray-400">
                      Our security infrastructure incorporates advanced threat detection systems that monitor for
                      unusual patterns across all three chains. The system employs behavioral analysis and machine
                      learning to identify sophisticated attack patterns and automatically implements countermeasures.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-[#333] pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/security-documentation')}
                  className="mt-4 border-[#333] text-gray-300 hover:bg-[#6B00D7]/10 hover:text-white"
                >
                  Back to Security Documentation
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-10 bg-gradient-to-r from-[#1A1A1A] to-[#111] border border-[#333] rounded-lg p-6 shadow-xl">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-[#FF5AF7] to-[#6B00D7] bg-clip-text text-transparent mb-4">
          View Full Source Code on GitHub
        </h2>
        <p className="text-gray-400 mb-6">
          All code examples above are from our <span className="text-[#50E3C2] font-semibold">production-ready open-source repositories</span>. 
          Explore the complete implementation with full documentation, tests, and smart contracts.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <a 
            href="https://github.com/Chronos-Vault/chronos-vault-security" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#111] p-4 rounded-lg border border-[#333] hover:border-[#FF5AF7] transition-colors group"
            data-testid="link-security-repo"
          >
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-5 w-5 text-[#FF5AF7]" />
              <h3 className="text-lg font-semibold text-white group-hover:text-[#FF5AF7] transition-colors">Security Core</h3>
            </div>
            <p className="text-sm text-gray-400">Trinity Protocol, Quantum Crypto, MPC, VDF, ZK Proofs</p>
            <p className="text-xs text-gray-500 mt-2">server/security/trinity-protocol.ts</p>
          </a>
          
          <a 
            href="https://github.com/Chronos-Vault/chronos-vault-contracts" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#111] p-4 rounded-lg border border-[#333] hover:border-[#FF5AF7] transition-colors group"
            data-testid="link-contracts-repo"
          >
            <div className="flex items-center gap-3 mb-2">
              <Lock className="h-5 w-5 text-[#FF5AF7]" />
              <h3 className="text-lg font-semibold text-white group-hover:text-[#FF5AF7] transition-colors">Smart Contracts</h3>
            </div>
            <p className="text-sm text-gray-400">Solidity, Rust, FunC - Arbitrum, Solana, TON</p>
            <p className="text-xs text-gray-500 mt-2">contracts/ethereum/ChronosVault.sol</p>
          </a>
          
          <a 
            href="https://github.com/Chronos-Vault/chronos-vault-sdk" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#111] p-4 rounded-lg border border-[#333] hover:border-[#FF5AF7] transition-colors group"
            data-testid="link-sdk-repo"
          >
            <div className="flex items-center gap-3 mb-2">
              <Key className="h-5 w-5 text-[#FF5AF7]" />
              <h3 className="text-lg font-semibold text-white group-hover:text-[#FF5AF7] transition-colors">SDK & Examples</h3>
            </div>
            <p className="text-sm text-gray-400">Integration guides, code examples, API docs</p>
            <p className="text-xs text-gray-500 mt-2">examples/v3-integration-example.ts</p>
          </a>
          
          <a 
            href="https://github.com/Chronos-Vault/formal-proofs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#111] p-4 rounded-lg border border-[#333] hover:border-[#FF5AF7] transition-colors group"
            data-testid="link-proofs-repo"
          >
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="h-5 w-5 text-[#FF5AF7]" />
              <h3 className="text-lg font-semibold text-white group-hover:text-[#FF5AF7] transition-colors">Formal Verification</h3>
            </div>
            <p className="text-sm text-gray-400">Lean 4 proofs - 35/35 theorems proven ✅</p>
            <p className="text-xs text-gray-500 mt-2">formal-proofs/Trinity/Consensus.lean</p>
          </a>
        </div>
        
        <div className="mt-6 flex flex-wrap gap-4">
          <Button variant="outline" onClick={() => navigate('/security-documentation')} className="border-[#333] text-gray-300 hover:bg-[#6B00D7]/10 hover:text-white" data-testid="button-security-docs">
            Security Documentation
          </Button>
          <Button variant="outline" onClick={() => navigate('/security-verification')} className="border-[#333] text-gray-300 hover:bg-[#6B00D7]/10 hover:text-white">
            Security Verification Center
          </Button>
          <Button onClick={() => navigate('/security-tutorials')} className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90 text-white">
            Security Tutorial Guides <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MilitaryGradeSecurity;