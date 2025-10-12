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
          System Overview
        </h2>
        <p className="text-gray-400 mb-6">
          Our military-grade security infrastructure implements a triple-chain verification system that ensures
          maximum protection against sophisticated attacks. This system combines hardware security modules,
          distributed consensus protocols, and quantum-resistant cryptography across three separate blockchain networks.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-[#111] p-5 rounded-lg border border-[#333]">
            <div className="flex items-center mb-4">
              <div className="bg-[#1a1a1a] p-2 rounded-lg mr-3">
                <Shield className="h-6 w-6 text-[#FF5AF7]" />
              </div>
              <h3 className="text-lg font-semibold text-white">Layer 1: Primary Defense</h3>
            </div>
            <p className="text-gray-400">
              High-performance blockchain with tamper-proof consensus and military-grade encryption for the first 
              layer of security validation.
            </p>
          </div>
          
          <div className="bg-[#111] p-5 rounded-lg border border-[#333]">
            <div className="flex items-center mb-4">
              <div className="bg-[#1a1a1a] p-2 rounded-lg mr-3">
                <Layers className="h-6 w-6 text-[#FF5AF7]" />
              </div>
              <h3 className="text-lg font-semibold text-white">Layer 2: Independent Verification</h3>
            </div>
            <p className="text-gray-400">
              Secondary blockchain network that independently verifies all transactions and maintains 
              separate security protocols and encryption standards.
            </p>
          </div>
          
          <div className="bg-[#111] p-5 rounded-lg border border-[#333]">
            <div className="flex items-center mb-4">
              <div className="bg-[#1a1a1a] p-2 rounded-lg mr-3">
                <ShieldCheck className="h-6 w-6 text-[#FF5AF7]" />
              </div>
              <h3 className="text-lg font-semibold text-white">Layer 3: Fallback Security</h3>
            </div>
            <p className="text-gray-400">
              Tertiary blockchain with different architectural approach that serves as both a security fallback
              and final verification layer with separate validation mechanisms.
            </p>
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

                  <h3 className="text-xl font-semibold mt-8 text-[#FF5AF7]">Multi-Party Computation</h3>
                  <p className="text-gray-400">
                    Our system implements threshold secure multi-party computation (MPC) protocols that allow security
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
                <CardTitle className="text-2xl text-white">System Implementation Overview</CardTitle>
                <CardDescription className="text-gray-400">
                  Technical implementation details of the triple-chain security system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6 text-gray-400">
                  <p>
                    The implementation of our military-grade security system spans multiple technology layers and
                    blockchains. The system architecture is designed with defense-in-depth principles, ensuring
                    that multiple security layers must be compromised simultaneously for an attack to succeed.
                  </p>
                  
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
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-[#FF5AF7] to-[#6B00D7] bg-clip-text text-transparent">Additional Resources</h2>
        <p className="text-gray-400 mt-2">
          Explore detailed technical specifications and integration guides for our military-grade security system.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Button variant="outline" onClick={() => navigate('/security-documentation')} className="border-[#333] text-gray-300 hover:bg-[#6B00D7]/10 hover:text-white">
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