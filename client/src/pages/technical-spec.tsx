import { useState } from "react";
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
  Zap,
  ExternalLink
} from "lucide-react";
import { Link } from "wouter";
import { Helmet } from "react-helmet";

export default function TechnicalSpecPage() {
  const [activeTab, setActiveTab] = useState("architecture");
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const techStack = {
    frontend: ['React', 'TypeScript', 'TailwindCSS', 'Three.js (3D visualizations)', 'Framer Motion'],
    backend: ['Express.js', 'PostgreSQL', 'Drizzle ORM', 'WebSocket real-time'],
    blockchains: ['Solidity (Arbitrum)', 'Rust (Solana)', 'FunC/Tact (TON)'],
    cryptography: ['ZK-SNARKs (Groth16)', 'MPC (Shamir)', 'VDFs (Wesolowski)', 'Post-Quantum (ML-KEM-1024, Dilithium-5)'],
  };

  const mathematicalDefenseLayers = [
    { layer: 1, name: 'Zero-Knowledge Proofs', tech: 'Groth16', description: 'Privacy-preserving verification without revealing underlying data' },
    { layer: 2, name: 'Formal Verification', tech: 'Lean 4', description: 'Mathematical proofs for smart contract correctness' },
    { layer: 3, name: 'MPC Key Management', tech: '3-of-5 Shamir + Kyber', description: 'Threshold secret sharing with quantum-resistant key encapsulation' },
    { layer: 4, name: 'VDF Time-Locks', tech: 'Wesolowski VDF', description: 'Provable time delays that cannot be accelerated' },
    { layer: 5, name: 'AI + Crypto Governance', tech: 'ML Anomaly Detection', description: 'Math-validated autonomous security decisions' },
    { layer: 6, name: 'Quantum-Resistant Crypto', tech: 'ML-KEM-1024, Dilithium-5', description: 'NIST-approved post-quantum algorithms' },
    { layer: 7, name: 'Trinity Protocol™ Consensus', tech: '2-of-3 Multi-Chain', description: 'Cross-chain verification requiring majority agreement' },
    { layer: 8, name: 'Trinity Shield™ TEE', tech: 'Intel SGX / AMD SEV', description: 'Hardware-isolated validator execution' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] via-[#121218] to-[#0a0a0f] py-12 px-4 sm:px-6">
      <Helmet>
        <title>Technical Specifications | Chronos Vault - Trinity Protocol™</title>
        <meta 
          name="description" 
          content="Technical architecture of Trinity Protocol™: 8 cryptographic security layers, 2-of-3 consensus across Arbitrum, Solana, and TON." 
        />
      </Helmet>
      
      <div className="container mx-auto">
        <PageHeader 
          heading="Technical Specifications" 
          description="Real architecture powering 20 deployed contracts across 3 blockchains"
          separator={true}
        />
        
        <div className="mt-12">
          <Tabs
            defaultValue="architecture"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 mb-8 bg-gray-900/50 border border-gray-800">
              <TabsTrigger value="architecture" className="data-[state=active]:bg-purple-600/30">Architecture</TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-purple-600/30">Security Layers</TabsTrigger>
              <TabsTrigger value="stack" className="data-[state=active]:bg-purple-600/30">Tech Stack</TabsTrigger>
              <TabsTrigger value="consensus" className="data-[state=active]:bg-purple-600/30">Consensus</TabsTrigger>
            </TabsList>
            
            <TabsContent value="architecture">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-8"
              >
                <motion.div variants={itemVariants}>
                  <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border-purple-500/30">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-2xl text-white">
                        <Network className="h-6 w-6 text-[#FF5AF7]" />
                        Trinity Protocol™ Multi-Chain Architecture
                      </CardTitle>
                      <CardDescription className="text-gray-300">
                        Fixed-layer architecture where each blockchain serves a dedicated security role
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-xl bg-purple-900/30 border border-purple-500/40">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-xl">⟠</div>
                            <div>
                              <h3 className="font-bold text-white">Arbitrum Sepolia</h3>
                              <Badge className="bg-purple-600 text-white">PRIMARY</Badge>
                            </div>
                          </div>
                          <ul className="space-y-2 text-sm text-gray-300">
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2" />
                              Immutable ownership records
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2" />
                              ERC-4626 compliant vaults
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2" />
                              HTLC atomic swap contracts
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2" />
                              95% lower fees vs L1
                            </li>
                          </ul>
                          <p className="mt-4 text-xs text-purple-300">14 contracts deployed</p>
                        </div>
                        
                        <div className="p-6 rounded-xl bg-cyan-900/30 border border-cyan-500/40">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center text-xl">◎</div>
                            <div>
                              <h3 className="font-bold text-white">Solana Devnet</h3>
                              <Badge className="bg-cyan-600 text-white">MONITOR</Badge>
                            </div>
                          </div>
                          <ul className="space-y-2 text-sm text-gray-300">
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2" />
                              High-frequency monitoring
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2" />
                              &lt;5 second SLA validation
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2" />
                              SPL token integration
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2" />
                              Cross-program invocations
                            </li>
                          </ul>
                          <p className="mt-4 text-xs text-cyan-300">4 programs deployed</p>
                        </div>
                        
                        <div className="p-6 rounded-xl bg-blue-900/30 border border-blue-500/40">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-xl">💎</div>
                            <div>
                              <h3 className="font-bold text-white">TON Testnet</h3>
                              <Badge className="bg-blue-600 text-white">BACKUP</Badge>
                            </div>
                          </div>
                          <ul className="space-y-2 text-sm text-gray-300">
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2" />
                              Quantum-resistant recovery
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2" />
                              ML-KEM-1024 encryption
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2" />
                              CRYSTALS-Dilithium-5 signatures
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2" />
                              48-hour emergency delay
                            </li>
                          </ul>
                          <p className="mt-4 text-xs text-blue-300">2 contracts deployed</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-gray-900/50 border-gray-800">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <Database className="h-5 w-5 text-[#FF5AF7]" />
                        Data Storage
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-purple-400 mb-2">On-Chain Storage</h4>
                        <ul className="text-sm text-gray-400 space-y-1">
                          <li>• Vault ownership and access control</li>
                          <li>• Time-lock parameters</li>
                          <li>• Cross-chain verification hashes</li>
                          <li>• Consensus state transitions</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-400 mb-2">Off-Chain Storage</h4>
                        <ul className="text-sm text-gray-400 space-y-1">
                          <li>• IPFS for content-addressable data</li>
                          <li>• Arweave for permanent retention</li>
                          <li>• PostgreSQL for app state</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gray-900/50 border-gray-800">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <Zap className="h-5 w-5 text-[#FF5AF7]" />
                        Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg bg-gray-800/50 text-center">
                          <div className="text-2xl font-bold text-purple-400">&lt;5s</div>
                          <div className="text-xs text-gray-400">Validation SLA</div>
                        </div>
                        <div className="p-3 rounded-lg bg-gray-800/50 text-center">
                          <div className="text-2xl font-bold text-cyan-400">20</div>
                          <div className="text-xs text-gray-400">Deployed Contracts</div>
                        </div>
                        <div className="p-3 rounded-lg bg-gray-800/50 text-center">
                          <div className="text-2xl font-bold text-pink-400">3</div>
                          <div className="text-xs text-gray-400">Blockchain Networks</div>
                        </div>
                        <div className="p-3 rounded-lg bg-gray-800/50 text-center">
                          <div className="text-2xl font-bold text-amber-400">8</div>
                          <div className="text-xs text-gray-400">Security Layers</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="security">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border-purple-500/30 mb-6">
                  <CardHeader>
                    <CardTitle className="text-white">Mathematical Defense Layer™ (MDL)</CardTitle>
                    <CardDescription className="text-gray-300">
                      8 cryptographic layers providing defense in depth
                    </CardDescription>
                  </CardHeader>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mathematicalDefenseLayers.map((layer) => (
                    <motion.div key={layer.layer} variants={itemVariants}>
                      <Card className="bg-gray-900/50 border-gray-800 hover:border-purple-500/50 transition-colors">
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center text-white font-bold">
                              {layer.layer}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-white">{layer.name}</h3>
                                <Badge className="bg-purple-600/30 text-purple-300 text-xs">{layer.tech}</Badge>
                              </div>
                              <p className="text-sm text-gray-400">{layer.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="stack">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <motion.div variants={itemVariants}>
                  <Card className="bg-gray-900/50 border-gray-800 h-full">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Layers className="h-5 w-5 text-cyan-400" />
                        Frontend
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {techStack.frontend.map((tech) => (
                          <li key={tech} className="flex items-center gap-2 text-gray-300">
                            <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                            {tech}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Card className="bg-gray-900/50 border-gray-800 h-full">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Server className="h-5 w-5 text-purple-400" />
                        Backend
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {techStack.backend.map((tech) => (
                          <li key={tech} className="flex items-center gap-2 text-gray-300">
                            <div className="w-2 h-2 bg-purple-500 rounded-full" />
                            {tech}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Card className="bg-gray-900/50 border-gray-800 h-full">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Code className="h-5 w-5 text-pink-400" />
                        Blockchain Languages
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {techStack.blockchains.map((tech) => (
                          <li key={tech} className="flex items-center gap-2 text-gray-300">
                            <div className="w-2 h-2 bg-pink-500 rounded-full" />
                            {tech}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Card className="bg-gray-900/50 border-gray-800 h-full">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Lock className="h-5 w-5 text-amber-400" />
                        Cryptography
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {techStack.cryptography.map((tech) => (
                          <li key={tech} className="flex items-center gap-2 text-gray-300">
                            <div className="w-2 h-2 bg-amber-500 rounded-full" />
                            {tech}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="consensus">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                <motion.div variants={itemVariants}>
                  <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border-purple-500/30">
                    <CardHeader>
                      <CardTitle className="text-white">2-of-3 Multi-Chain Consensus</CardTitle>
                      <CardDescription className="text-gray-300">
                        No single validator or chain failure can compromise security
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-800">
                        <div className="text-center mb-6">
                          <div className="text-4xl font-bold bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] bg-clip-text text-transparent">
                            Attack Probability: &lt;10⁻¹⁸
                          </div>
                          <p className="text-sm text-gray-400 mt-2">
                            Mathematically proven security threshold
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-4 rounded-lg bg-purple-900/20 border border-purple-500/30 text-center">
                            <div className="text-purple-400 font-semibold">Arbitrum</div>
                            <div className="text-xs text-gray-400 mt-1">Validator 1</div>
                            <div className="mt-2">
                              <code className="text-xs text-purple-300">0x3A92...d8f8</code>
                            </div>
                          </div>
                          <div className="p-4 rounded-lg bg-cyan-900/20 border border-cyan-500/30 text-center">
                            <div className="text-cyan-400 font-semibold">Solana</div>
                            <div className="text-xs text-gray-400 mt-1">Validator 2</div>
                            <div className="mt-2">
                              <code className="text-xs text-cyan-300">0x2554...cd5</code>
                            </div>
                          </div>
                          <div className="p-4 rounded-lg bg-blue-900/20 border border-blue-500/30 text-center">
                            <div className="text-blue-400 font-semibold">TON</div>
                            <div className="text-xs text-gray-400 mt-1">Validator 3</div>
                            <div className="mt-2">
                              <code className="text-xs text-blue-300">0x9662...B4c4</code>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6 p-4 rounded-lg bg-gray-800/50">
                          <h4 className="font-semibold text-white mb-2">How It Works</h4>
                          <ol className="text-sm text-gray-400 space-y-2">
                            <li>1. User initiates operation (vault access, swap, withdrawal)</li>
                            <li>2. Request broadcast to all 3 chain validators</li>
                            <li>3. Each validator independently verifies and signs</li>
                            <li>4. 2-of-3 signatures required for execution</li>
                            <li>5. Operation executed with cryptographic proof</li>
                          </ol>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Card className="bg-gray-900/50 border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-white">HTLC Atomic Swaps</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-purple-400 mb-3">Supported Swap Pairs</h4>
                          <ul className="space-y-2 text-sm text-gray-300">
                            <li className="flex items-center gap-2">
                              <span className="text-green-400">✓</span>
                              Arbitrum → Solana
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-green-400">✓</span>
                              Solana → Arbitrum
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-green-400">✓</span>
                              Arbitrum → TON
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-green-400">✓</span>
                              TON → Arbitrum
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-green-400">✓</span>
                              Solana → TON
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-green-400">✓</span>
                              TON → Solana
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-purple-400 mb-3">HTLC Guarantees</h4>
                          <ul className="space-y-2 text-sm text-gray-300">
                            <li className="flex items-center gap-2">
                              <Shield className="h-4 w-4 text-purple-400" />
                              Cryptographic atomicity
                            </li>
                            <li className="flex items-center gap-2">
                              <Lock className="h-4 w-4 text-purple-400" />
                              Time-locked refunds
                            </li>
                            <li className="flex items-center gap-2">
                              <Key className="h-4 w-4 text-purple-400" />
                              Hash preimage verification
                            </li>
                            <li className="flex items-center gap-2">
                              <Network className="h-4 w-4 text-purple-400" />
                              Trinity consensus required
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
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
