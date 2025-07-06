import React, { useState } from "react";
import { PageHeader } from "@/components/page-header";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  Database, 
  Server, 
  Shield, 
  Code, 
  Layers, 
  Cpu,
  Lock,
  Key,
  Network,
  Zap
} from "lucide-react";
import { Link } from "wouter";
import { Helmet } from "react-helmet";

export default function TechnicalSpecPage() {
  const [activeTab, setActiveTab] = useState("architecture");
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6">
      <Helmet>
        <title>Technical Specifications | Chronos Vault</title>
        <meta 
          name="description" 
          content="Detailed technical architecture and specifications for the Chronos Vault multi-chain platform." 
        />
      </Helmet>
      
      <div className="container mx-auto">
        <PageHeader 
          heading="Technical Specifications" 
          description="Detailed technical architecture and implementation specifications for developers and security researchers"
          separator={true}
        />
        
        <div className="mt-12">
          <Tabs
            defaultValue="architecture"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="architecture">Architecture</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="contracts">Smart Contracts</TabsTrigger>
              <TabsTrigger value="advanced">Advanced Features</TabsTrigger>
            </TabsList>
            
            {/* Architecture Tab */}
            <TabsContent value="architecture">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                <motion.div variants={itemVariants}>
                  <Card className="h-full bg-gradient-to-br from-[#1D1D1D]/70 to-[#151515]/70 border border-[#333] backdrop-blur">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-2xl">
                        <Server className="h-6 w-6 text-[#FF5AF7]" />
                        Multi-Chain Architecture
                      </CardTitle>
                      <CardDescription>
                        Our foundational cross-chain implementation
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-300">
                        Chronos Vault employs a sophisticated multi-chain architecture that leverages the unique strengths of each blockchain while mitigating their individual weaknesses, creating a unified security framework.
                      </p>
                      
                      <div className="bg-[#181818] rounded-lg p-4 border border-[#333]">
                        <h3 className="text-xl font-semibold mb-3 text-[#FF5AF7]">Supported Blockchains</h3>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center mt-1">
                              <div className="w-4 h-4 text-blue-500">Ξ</div>
                            </div>
                            <div>
                              <h4 className="font-semibold">Ethereum</h4>
                              <p className="text-sm text-gray-400">Primary contract layer for vault core functionality and cross-chain attestation</p>
                            </div>
                          </li>
                          
                          <li className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-purple-600/20 flex items-center justify-center mt-1">
                              <div className="w-4 h-4 text-purple-500">S</div>
                            </div>
                            <div>
                              <h4 className="font-semibold">Solana</h4>
                              <p className="text-sm text-gray-400">High-throughput chain for frequent operations and transaction verification</p>
                            </div>
                          </li>
                          
                          <li className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-cyan-600/20 flex items-center justify-center mt-1">
                              <div className="w-4 h-4 text-cyan-500">T</div>
                            </div>
                            <div>
                              <h4 className="font-semibold">TON</h4>
                              <p className="text-sm text-gray-400">Scalable network for mass-market applications and high-speed operations</p>
                            </div>
                          </li>
                          
                          <li className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-orange-600/20 flex items-center justify-center mt-1">
                              <div className="w-4 h-4 text-orange-500">₿</div>
                            </div>
                            <div>
                              <h4 className="font-semibold">Bitcoin (Optional)</h4>
                              <p className="text-sm text-gray-400">Secure anchor layer for ultimate settlement finality</p>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" asChild className="w-full">
                        <Link href="/cross-chain-architecture">View Detailed Architecture</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card className="h-full bg-gradient-to-br from-[#1D1D1D]/70 to-[#151515]/70 border border-[#333] backdrop-blur">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-2xl">
                        <Database className="h-6 w-6 text-[#FF5AF7]" />
                        Data Storage Model
                      </CardTitle>
                      <CardDescription>
                        Secure, distributed storage systems
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-300">
                        Our hybrid storage approach combines on-chain and off-chain solutions to optimize for security, performance, and cost-effectiveness while maintaining vault integrity across multiple chains.
                      </p>
                      
                      <div className="bg-[#181818] rounded-lg p-4 border border-[#333]">
                        <h3 className="text-xl font-semibold mb-3 text-[#FF5AF7]">Storage Components</h3>
                        
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold flex items-center gap-2">
                              <Layers className="h-4 w-4 text-blue-500" />
                              On-Chain Storage
                            </h4>
                            <ul className="pl-6 mt-1 text-sm text-gray-400 list-disc">
                              <li>Critical access control metadata</li>
                              <li>Time-lock parameters and validation proofs</li>
                              <li>Cross-chain verification hashes</li>
                              <li>Ownership records and state transitions</li>
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold flex items-center gap-2">
                              <Server className="h-4 w-4 text-green-500" />
                              Decentralized Storage
                            </h4>
                            <ul className="pl-6 mt-1 text-sm text-gray-400 list-disc">
                              <li>IPFS for content-addressable data</li>
                              <li>Arweave for permanent data retention</li>
                              <li>Encrypted vault media content</li>
                              <li>Historical transaction records</li>
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold flex items-center gap-2">
                              <Database className="h-4 w-4 text-purple-500" />
                              Encrypted Index Layer
                            </h4>
                            <ul className="pl-6 mt-1 text-sm text-gray-400 list-disc">
                              <li>User-specific encryption keys (client-side)</li>
                              <li>Content lookup indices with zero-knowledge access</li>
                              <li>Metadata for efficient content retrieval</li>
                              <li>Cross-chain reference mappings</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" asChild className="w-full">
                        <Link href="/storage-architecture">View Storage Specifications</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Card className="h-full bg-gradient-to-br from-[#1D1D1D]/70 to-[#151515]/70 border border-[#333] backdrop-blur">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-2xl">
                        <Network className="h-6 w-6 text-[#FF5AF7]" />
                        Cross-Chain Communication
                      </CardTitle>
                      <CardDescription>
                        Secure bridge technology and message passing
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-300">
                        Our proprietary cross-chain messaging protocol enables secure communication between blockchains, allowing for coordinated vault operations across multiple networks.
                      </p>
                      
                      <div className="bg-[#181818] rounded-lg p-4 border border-[#333]">
                        <h3 className="text-xl font-semibold mb-3 text-[#FF5AF7]">Communication Layer</h3>
                        
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold flex items-center gap-2">
                              <Zap className="h-4 w-4 text-yellow-500" />
                              Message Protocol
                            </h4>
                            <p className="text-sm text-gray-400 mt-1">
                              Our cross-chain messaging implements an optimistic verification model with fallback to zero-knowledge proof verification for disputed transactions, ensuring security while maintaining performance.
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 mt-3">
                            <div className="bg-[#1D1D1D] p-3 rounded border border-[#333]">
                              <h5 className="text-sm font-semibold text-blue-400">Messaging Latency</h5>
                              <p className="text-xs text-gray-400 mt-1">ETH → TON: ~2 minutes</p>
                              <p className="text-xs text-gray-400">SOL → ETH: ~8 minutes</p>
                              <p className="text-xs text-gray-400">TON → SOL: ~4 minutes</p>
                            </div>
                            
                            <div className="bg-[#1D1D1D] p-3 rounded border border-[#333]">
                              <h5 className="text-sm font-semibold text-green-400">Security Properties</h5>
                              <p className="text-xs text-gray-400 mt-1">Double-validation</p>
                              <p className="text-xs text-gray-400">Cryptographic attestation</p>
                              <p className="text-xs text-gray-400">Tamper-proof design</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" asChild className="w-full">
                        <Link href="/cross-chain-messaging">View Messaging Protocol</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Card className="h-full bg-gradient-to-br from-[#1D1D1D]/70 to-[#151515]/70 border border-[#333] backdrop-blur">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-2xl">
                        <Cpu className="h-6 w-6 text-[#FF5AF7]" />
                        Backend Infrastructure
                      </CardTitle>
                      <CardDescription>
                        Cloud and edge computing architecture
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-300">
                        Our infrastructure combines decentralized and traditional cloud systems to create a resilient, high-performance platform with enterprise-grade reliability.
                      </p>
                      
                      <div className="bg-[#181818] rounded-lg p-4 border border-[#333]">
                        <h3 className="text-xl font-semibold mb-3 text-[#FF5AF7]">System Components</h3>
                        
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center mt-1 flex-shrink-0">
                              <Server className="w-4 h-4 text-blue-500" />
                            </div>
                            <div>
                              <h4 className="font-semibold">Distributed Node Network</h4>
                              <p className="text-sm text-gray-400">Geographically distributed nodes across multiple cloud providers with automatic failover and load balancing</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-green-600/20 flex items-center justify-center mt-1 flex-shrink-0">
                              <Database className="w-4 h-4 text-green-500" />
                            </div>
                            <div>
                              <h4 className="font-semibold">Multi-Tier Database System</h4>
                              <p className="text-sm text-gray-400">Combination of high-performance relational databases for transactional data and NoSQL solutions for scalable content storage</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-purple-600/20 flex items-center justify-center mt-1 flex-shrink-0">
                              <Zap className="w-4 h-4 text-purple-500" />
                            </div>
                            <div>
                              <h4 className="font-semibold">Edge Computing Network</h4>
                              <p className="text-sm text-gray-400">Global edge network for low-latency access to frequently accessed vault data and real-time security processing</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" asChild className="w-full">
                        <Link href="/infrastructure-architecture">View Infrastructure Details</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>
            
            {/* Security Tab */}
            <TabsContent value="security">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                <motion.div variants={itemVariants}>
                  <Card className="h-full bg-gradient-to-br from-[#1D1D1D]/70 to-[#151515]/70 border border-[#333] backdrop-blur">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-2xl">
                        <Shield className="h-6 w-6 text-[#FF5AF7]" />
                        Zero-Knowledge Security
                      </CardTitle>
                      <CardDescription>
                        Privacy-preserving authentication system
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-300">
                        Our zero-knowledge authentication system allows users to prove ownership and access rights without revealing sensitive information, maintaining privacy while ensuring security.
                      </p>
                      
                      <div className="bg-[#181818] rounded-lg p-4 border border-[#333]">
                        <h3 className="text-xl font-semibold mb-3 text-[#FF5AF7]">ZK Implementation</h3>
                        
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-semibold">Proof System</h4>
                            <p className="text-sm text-gray-400">
                              zk-SNARKs (Zero-Knowledge Succinct Non-Interactive Arguments of Knowledge) implementation using the Groth16 proving system
                            </p>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold">Cryptographic Foundations</h4>
                            <ul className="pl-6 mt-1 text-sm text-gray-400 list-disc">
                              <li>Elliptic curve cryptography (alt_bn128)</li>
                              <li>Pedersen commitments for hiding input values</li>
                              <li>Secure multi-party computation for setup ceremonies</li>
                              <li>Recursive proof composition for complex access policies</li>
                            </ul>
                          </div>
                          
                          <div className="mt-3 bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/10 p-3 rounded border border-[#6B00D7]/30">
                            <h4 className="font-semibold text-[#FF5AF7]">Security Guarantees</h4>
                            <p className="text-sm text-gray-300 mt-1">
                              Our zero-knowledge system provides information-theoretic privacy with computational soundness under standard cryptographic assumptions.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" asChild className="w-full">
                        <Link href="/zero-knowledge-architecture">View ZK Technical Details</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Card className="h-full bg-gradient-to-br from-[#1D1D1D]/70 to-[#151515]/70 border border-[#333] backdrop-blur">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-2xl">
                        <Lock className="h-6 w-6 text-[#FF5AF7]" />
                        Quantum-Resistant Encryption
                      </CardTitle>
                      <CardDescription>
                        Post-quantum cryptographic security
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-300">
                        Our platform implements quantum-resistant cryptographic algorithms to protect against future threats from quantum computers, ensuring long-term security for time-locked assets.
                      </p>
                      
                      <div className="bg-[#181818] rounded-lg p-4 border border-[#333]">
                        <h3 className="text-xl font-semibold mb-3 text-[#FF5AF7]">Post-Quantum Security</h3>
                        
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold">Algorithm Implementation</h4>
                            <p className="text-sm text-gray-400">
                              We implement NIST-approved post-quantum cryptographic standards combined with traditional algorithms in a hybrid approach.
                            </p>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold">Key Algorithms</h4>
                            <ul className="pl-6 mt-1 text-sm text-gray-400 list-disc">
                              <li>CRYSTALS-Kyber for key encapsulation</li>
                              <li>CRYSTALS-Dilithium for digital signatures</li>
                              <li>FALCON for lightweight signatures</li>
                              <li>SPHINCS+ for hash-based signatures (stateless)</li>
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold">Hybrid Security Model</h4>
                            <p className="text-sm text-gray-400">
                              Combines post-quantum algorithms with traditional cryptography to ensure security against both classical and quantum attacks.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" asChild className="w-full">
                        <Link href="/quantum-resistant-specs">View Quantum Security Details</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Card className="h-full bg-gradient-to-br from-[#1D1D1D]/70 to-[#151515]/70 border border-[#333] backdrop-blur">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-2xl">
                        <Key className="h-6 w-6 text-[#FF5AF7]" />
                        Multi-Signature Protocol
                      </CardTitle>
                      <CardDescription>
                        Threshold signature schemes
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-300">
                        Our custom multi-signature implementation provides flexible threshold controls with cross-chain compatibility, enabling sophisticated access control policies across multiple blockchains.
                      </p>
                      
                      <div className="bg-[#181818] rounded-lg p-4 border border-[#333]">
                        <h3 className="text-xl font-semibold mb-3 text-[#FF5AF7]">Multi-Signature System</h3>
                        
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold">Implementation Approach</h4>
                            <p className="text-sm text-gray-400">
                              Cross-chain threshold signature scheme with support for multiple signature algorithms and flexible policy configurations.
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                            <div className="bg-[#1D1D1D] p-3 rounded border border-[#333]">
                              <h5 className="text-sm font-semibold text-blue-400">Ethereum Implementation</h5>
                              <ul className="text-xs text-gray-400 mt-1 list-disc pl-4">
                                <li>ERC-1271 signature verification</li>
                                <li>Custom optimized gas implementation</li>
                                <li>Metamask and hardware wallet support</li>
                              </ul>
                            </div>
                            
                            <div className="bg-[#1D1D1D] p-3 rounded border border-[#333]">
                              <h5 className="text-sm font-semibold text-green-400">Multi-Chain Features</h5>
                              <ul className="text-xs text-gray-400 mt-1 list-disc pl-4">
                                <li>Cross-chain signature aggregation</li>
                                <li>Heterogeneous key support</li>
                                <li>Temporal signature constraints</li>
                              </ul>
                            </div>
                          </div>
                          
                          <div className="bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/10 p-3 rounded border border-[#6B00D7]/30 mt-3">
                            <h4 className="font-semibold text-[#FF5AF7]">Advanced Features</h4>
                            <p className="text-sm text-gray-300 mt-1">
                              Role-based access control, time-based signature weights, and cross-chain signature verification provide unprecedented flexibility and security.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" asChild className="w-full">
                        <Link href="/multi-signature-specs">View Multi-Signature Details</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Card className="h-full bg-gradient-to-br from-[#1D1D1D]/70 to-[#151515]/70 border border-[#333] backdrop-blur">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-2xl">
                        <Shield className="h-6 w-6 text-[#FF5AF7]" />
                        Behavioral Analysis System
                      </CardTitle>
                      <CardDescription>
                        AI-powered security monitoring
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-300">
                        Our behavioral analysis system uses advanced machine learning algorithms to detect suspicious activities and potential security threats, providing an additional layer of protection for vault assets.
                      </p>
                      
                      <div className="bg-[#181818] rounded-lg p-4 border border-[#333]">
                        <h3 className="text-xl font-semibold mb-3 text-[#FF5AF7]">Security Monitoring</h3>
                        
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold">Detection Capabilities</h4>
                            <ul className="pl-6 mt-1 text-sm text-gray-400 list-disc">
                              <li>Anomalous transaction patterns</li>
                              <li>Unusual access times or locations</li>
                              <li>Atypical withdrawal behavior</li>
                              <li>Suspicious cross-chain activities</li>
                              <li>Multiple failed authentication attempts</li>
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold">Technical Implementation</h4>
                            <p className="text-sm text-gray-400">
                              The system employs a combination of supervised and unsupervised machine learning models, including:
                            </p>
                            <ul className="pl-6 mt-1 text-sm text-gray-400 list-disc">
                              <li>Recurrent neural networks for sequence analysis</li>
                              <li>Isolation forests for anomaly detection</li>
                              <li>Gradient-boosted decision trees for classification</li>
                              <li>Federated learning for privacy-preserving model training</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" asChild className="w-full">
                        <Link href="/behavioral-analysis-system">View Security Analysis Details</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>
            
            {/* Smart Contracts Tab */}
            <TabsContent value="contracts">
              <div className="bg-gradient-to-br from-[#1D1D1D]/70 to-[#151515]/70 border border-[#333] backdrop-blur p-6 rounded-xl mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Code className="h-6 w-6 text-[#FF5AF7]" />
                  Smart Contract Architecture
                </h2>
                <p className="text-gray-300 mb-6">
                  Our smart contract system implements a modular, upgradeable architecture with cross-chain coordination capabilities. All contracts undergo rigorous security audits and formal verification processes.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[#181818] p-4 rounded-lg border border-[#333]">
                    <h3 className="text-lg font-semibold mb-2 text-[#FF5AF7]">Ethereum Contracts</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center justify-between">
                        <span className="text-sm">VaultCore.sol</span>
                        <Badge variant="outline" className="bg-blue-900/30 text-blue-400 border-blue-800">
                          Core
                        </Badge>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-sm">TimeController.sol</span>
                        <Badge variant="outline" className="bg-blue-900/30 text-blue-400 border-blue-800">
                          Core
                        </Badge>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-sm">CrossChainValidator.sol</span>
                        <Badge variant="outline" className="bg-purple-900/30 text-purple-400 border-purple-800">
                          Bridge
                        </Badge>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-sm">MultiSigController.sol</span>
                        <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-800">
                          Security
                        </Badge>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-sm">ZKVerifier.sol</span>
                        <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-800">
                          Security
                        </Badge>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-sm">AssetWrapper.sol</span>
                        <Badge variant="outline" className="bg-yellow-900/30 text-yellow-400 border-yellow-800">
                          Assets
                        </Badge>
                      </li>
                    </ul>
                    <div className="mt-4 text-xs text-gray-400">
                      Gas Optimization: EIP-2929 aware, batch operations, minimal storage
                    </div>
                  </div>
                  
                  <div className="bg-[#181818] p-4 rounded-lg border border-[#333]">
                    <h3 className="text-lg font-semibold mb-2 text-[#FF5AF7]">Solana Programs</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center justify-between">
                        <span className="text-sm">vault_core.rs</span>
                        <Badge variant="outline" className="bg-blue-900/30 text-blue-400 border-blue-800">
                          Core
                        </Badge>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-sm">time_controller.rs</span>
                        <Badge variant="outline" className="bg-blue-900/30 text-blue-400 border-blue-800">
                          Core
                        </Badge>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-sm">bridge_validator.rs</span>
                        <Badge variant="outline" className="bg-purple-900/30 text-purple-400 border-purple-800">
                          Bridge
                        </Badge>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-sm">multi_sig.rs</span>
                        <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-800">
                          Security
                        </Badge>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-sm">asset_manager.rs</span>
                        <Badge variant="outline" className="bg-yellow-900/30 text-yellow-400 border-yellow-800">
                          Assets
                        </Badge>
                      </li>
                    </ul>
                    <div className="mt-4 text-xs text-gray-400">
                      Compute Optimization: BPF validated, compute-unit optimized
                    </div>
                  </div>
                  
                  <div className="bg-[#181818] p-4 rounded-lg border border-[#333]">
                    <h3 className="text-lg font-semibold mb-2 text-[#FF5AF7]">TON Contracts</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center justify-between">
                        <span className="text-sm">vault_core.fc</span>
                        <Badge variant="outline" className="bg-blue-900/30 text-blue-400 border-blue-800">
                          Core
                        </Badge>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-sm">time_lock.fc</span>
                        <Badge variant="outline" className="bg-blue-900/30 text-blue-400 border-blue-800">
                          Core
                        </Badge>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-sm">cross_chain_oracle.fc</span>
                        <Badge variant="outline" className="bg-purple-900/30 text-purple-400 border-purple-800">
                          Bridge
                        </Badge>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-sm">multi_signature.fc</span>
                        <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-800">
                          Security
                        </Badge>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-sm">asset_controller.fc</span>
                        <Badge variant="outline" className="bg-yellow-900/30 text-yellow-400 border-yellow-800">
                          Assets
                        </Badge>
                      </li>
                    </ul>
                    <div className="mt-4 text-xs text-gray-400">
                      Gas Optimization: TVM-specific instruction optimizations
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4 text-[#FF5AF7]">Contract Deployment Addresses</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#333]">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Contract</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Network</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Address</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#333]">
                        <tr>
                          <td className="px-4 py-3 text-sm">VaultCore.sol</td>
                          <td className="px-4 py-3 text-sm">Ethereum Mainnet</td>
                          <td className="px-4 py-3 text-sm font-mono">0x7A23608a8eBe71868013BDA0d900351A83bb4Dc2</td>
                          <td className="px-4 py-3 text-sm">
                            <Badge className="bg-green-900/30 text-green-400 border-green-800">Verified</Badge>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm">VaultCore.sol</td>
                          <td className="px-4 py-3 text-sm">Ethereum Sepolia</td>
                          <td className="px-4 py-3 text-sm font-mono">0x8B791913eB335c0d254Af26B88C7364776AF7dEc</td>
                          <td className="px-4 py-3 text-sm">
                            <Badge className="bg-green-900/30 text-green-400 border-green-800">Verified</Badge>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm">vault_core.rs</td>
                          <td className="px-4 py-3 text-sm">Solana Mainnet</td>
                          <td className="px-4 py-3 text-sm font-mono">ChronoSVauLtX5u6y2R4EBmGjGLvszZ6EaWds1Jm5XLrf</td>
                          <td className="px-4 py-3 text-sm">
                            <Badge className="bg-green-900/30 text-green-400 border-green-800">Verified</Badge>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm">vault_core.fc</td>
                          <td className="px-4 py-3 text-sm">TON Mainnet</td>
                          <td className="px-4 py-3 text-sm font-mono">EQCLltDiWWrQAIkwZQJDtXKyaj_AppfPDf9kw1ssHy9RsKlf</td>
                          <td className="px-4 py-3 text-sm">
                            <Badge className="bg-green-900/30 text-green-400 border-green-800">Verified</Badge>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <Link href="/smart-contracts">
                  <Button size="lg" className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5A00B6] hover:to-[#EE49E6]">
                    View Complete Smart Contract Documentation
                  </Button>
                </Link>
              </div>
            </TabsContent>
            
            {/* Advanced Features Tab */}
            <TabsContent value="advanced">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-8"
              >
                <motion.div variants={itemVariants}>
                  <Card className="bg-gradient-to-br from-[#1D1D1D]/70 to-[#151515]/70 border border-[#333] backdrop-blur">
                    <CardHeader>
                      <CardTitle className="text-2xl">Time-Lock Mechanisms</CardTitle>
                      <CardDescription>
                        Advanced cryptographic time constraints
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 mb-6">
                        Our time-lock implementation uses a combination of on-chain time verification and cryptographic time-lock puzzles to create secure, tamper-proof temporal constraints for vault assets.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[#181818] p-4 rounded-lg border border-[#333]">
                          <h3 className="text-lg font-semibold mb-3 text-[#FF5AF7]">On-Chain Time Verification</h3>
                          <ul className="space-y-2 text-sm text-gray-400">
                            <li className="flex items-start gap-2">
                              <div className="w-5 h-5 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <div className="w-3 h-3 text-blue-500">•</div>
                              </div>
                              <span>Multi-oracle time source aggregation</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-5 h-5 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <div className="w-3 h-3 text-blue-500">•</div>
                              </div>
                              <span>Cross-chain time verification for consensus</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-5 h-5 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <div className="w-3 h-3 text-blue-500">•</div>
                              </div>
                              <span>Time-drift detection and correction</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-5 h-5 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <div className="w-3 h-3 text-blue-500">•</div>
                              </div>
                              <span>Blockchain-specific timestamp handling</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-[#181818] p-4 rounded-lg border border-[#333]">
                          <h3 className="text-lg font-semibold mb-3 text-[#FF5AF7]">Cryptographic Time-Lock Puzzles</h3>
                          <ul className="space-y-2 text-sm text-gray-400">
                            <li className="flex items-start gap-2">
                              <div className="w-5 h-5 rounded-full bg-purple-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <div className="w-3 h-3 text-purple-500">•</div>
                              </div>
                              <span>Sequential proof-of-work mechanism</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-5 h-5 rounded-full bg-purple-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <div className="w-3 h-3 text-purple-500">•</div>
                              </div>
                              <span>Verifiable delay functions (VDFs)</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-5 h-5 rounded-full bg-purple-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <div className="w-3 h-3 text-purple-500">•</div>
                              </div>
                              <span>RSA-based time-lock puzzles</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-5 h-5 rounded-full bg-purple-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <div className="w-3 h-3 text-purple-500">•</div>
                              </div>
                              <span>Tunable security-performance tradeoffs</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="mt-6 bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/10 p-4 rounded-lg border border-[#6B00D7]/30">
                        <h3 className="text-lg font-semibold mb-2 text-[#FF5AF7]">Advanced Time-Lock Features</h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-300">
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#FF5AF7]"></div>
                            <span>Conditional release triggers</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#FF5AF7]"></div>
                            <span>Gradual unlocking schedules</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#FF5AF7]"></div>
                            <span>External event-driven unlocking</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#FF5AF7]"></div>
                            <span>Cross-chain time correlation</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#FF5AF7]"></div>
                            <span>Oracle-based market triggers</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#FF5AF7]"></div>
                            <span>Multi-factor temporal constraints</span>
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" asChild className="w-full">
                        <Link href="/time-lock-architecture">View Time-Lock Technical Details</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Card className="bg-gradient-to-br from-[#1D1D1D]/70 to-[#151515]/70 border border-[#333] backdrop-blur">
                    <CardHeader>
                      <CardTitle className="text-2xl">Geolocation Verification System</CardTitle>
                      <CardDescription>
                        Secure location-based authentication
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 mb-6">
                        Our geolocation verification system provides secure, privacy-preserving location authentication for vaults with geographic access constraints.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-[#181818] p-4 rounded-lg border border-[#333]">
                          <h3 className="text-lg font-semibold mb-3 text-[#FF5AF7]">Location Verification Technology</h3>
                          <ul className="space-y-3 text-sm text-gray-400">
                            <li className="flex items-start gap-2">
                              <div className="w-5 h-5 rounded-full bg-green-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <div className="w-3 h-3 text-green-500">•</div>
                              </div>
                              <div>
                                <span className="font-semibold text-gray-300">Multi-Source Positioning</span>
                                <p>Combines GPS, cellular triangulation, WiFi positioning, and IP geolocation</p>
                              </div>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-5 h-5 rounded-full bg-green-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <div className="w-3 h-3 text-green-500">•</div>
                              </div>
                              <div>
                                <span className="font-semibold text-gray-300">Spoofing Detection</span>
                                <p>Advanced algorithms detect GPS spoofing, VPN usage, and location fraud attempts</p>
                              </div>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-5 h-5 rounded-full bg-green-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <div className="w-3 h-3 text-green-500">•</div>
                              </div>
                              <div>
                                <span className="font-semibold text-gray-300">Privacy Preservation</span>
                                <p>Zero-knowledge proofs verify location claims without revealing exact coordinates</p>
                              </div>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-[#181818] p-4 rounded-lg border border-[#333]">
                          <h3 className="text-lg font-semibold mb-3 text-[#FF5AF7]">Implementation Details</h3>
                          <ul className="space-y-3 text-sm text-gray-400">
                            <li className="flex items-start gap-2">
                              <div className="w-5 h-5 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <div className="w-3 h-3 text-blue-500">•</div>
                              </div>
                              <div>
                                <span className="font-semibold text-gray-300">Location-Based Authentication</span>
                                <p>Secure proof-of-presence protocol with threshold accuracy configuration</p>
                              </div>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-5 h-5 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <div className="w-3 h-3 text-blue-500">•</div>
                              </div>
                              <div>
                                <span className="font-semibold text-gray-300">On-Chain Verification</span>
                                <p>Blockchain-based verification of location proofs with cross-chain validation</p>
                              </div>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-5 h-5 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <div className="w-3 h-3 text-blue-500">•</div>
                              </div>
                              <div>
                                <span className="font-semibold text-gray-300">Geofencing Capabilities</span>
                                <p>Configurable geofences with customizable shape, size, and temporal constraints</p>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="mt-6 bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/10 p-4 rounded-lg border border-[#6B00D7]/30">
                        <h3 className="text-lg font-semibold mb-2 text-[#FF5AF7]">Use Cases</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
                          <div className="bg-[#1A1A1A] p-3 rounded border border-[#6B00D7]/20">
                            <h4 className="font-semibold mb-1">Physical Presence Vaults</h4>
                            <p>Require verified physical presence at specific locations to access vault contents</p>
                          </div>
                          <div className="bg-[#1A1A1A] p-3 rounded border border-[#6B00D7]/20">
                            <h4 className="font-semibold mb-1">Geographic Restrictions</h4>
                            <p>Limit vault accessibility to specified regions, countries, or jurisdictions</p>
                          </div>
                          <div className="bg-[#1A1A1A] p-3 rounded border border-[#6B00D7]/20">
                            <h4 className="font-semibold mb-1">Location-Based Experiences</h4>
                            <p>Create location-activated digital experiences and treasure hunts</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" asChild className="w-full">
                        <Link href="/geolocation-verification-specs">View Geolocation System Details</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}