import { useState } from "react";
import { useDevMode } from "@/contexts/dev-mode-context";
import { useMultiChain } from "@/contexts/multi-chain-context";
import { PageHeader } from "@/components/page-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

export default function FAQPage() {
  const [activeTab, setActiveTab] = useState("general");
  const { devModeEnabled } = useDevMode();
  const { walletInfo } = useMultiChain();
  
  // Animation variants for fade-in effect
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
    <div className="min-h-screen bg-gradient-to-b from-[#121212] to-[#1A1A1A] text-white pb-20">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <PageHeader
            heading="Frequently Asked Questions"
            description="Everything you need to know about Chronos Vault's Trinity Protocol™ Security Architecture"
            separator={true}
          />
        </motion.div>

        <motion.div 
          className="mt-10 mb-16 p-6 rounded-xl bg-gradient-to-br from-[#6B00D7]/10 to-[#FF5AF7]/5 border border-[#6B00D7]/20 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">Chronos Vault: The Future of Secure Asset Vaults</h2>
          <p className="mt-2 text-gray-300">
            Our revolutionary multi-chain architecture secures your digital assets across Ethereum, Solana, TON, and Bitcoin with military-grade encryption and time-locked controls.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 rounded-lg bg-[#6B00D7]/10 border border-[#6B00D7]/30">
              <h3 className="text-lg font-semibold text-purple-400">Fixed Layer Architecture</h3>
              <p className="text-sm text-gray-300">Ethereum Layer 2 for primary security, Solana for rapid validation, TON for quantum-resistant backup</p>
            </div>
            <div className="p-4 rounded-lg bg-[#6B00D7]/10 border border-[#6B00D7]/30">
              <h3 className="text-lg font-semibold text-[#FF5AF7]">2-of-3 Mathematical Consensus</h3>
              <p className="text-sm text-gray-300">Trinity Protocol secures your vault across all 3 layers with multi-chain verification</p>
            </div>
            <div className="p-4 rounded-lg bg-[#6B00D7]/10 border border-[#6B00D7]/30">
              <h3 className="text-lg font-semibold text-[#FF5AF7]">Layer 2 Optimized</h3>
              <p className="text-sm text-gray-300">Ethereum Layer 2 deployment provides 95% lower fees while maintaining maximum security</p>
            </div>
          </div>
        </motion.div>

        <div className="mt-12">
          <Tabs defaultValue="general" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-8 bg-[#1A1A1A]">
              <TabsTrigger value="general" className="data-[state=active]:bg-[#6B00D7]/20 data-[state=active]:text-white">
                General
              </TabsTrigger>
              <TabsTrigger value="technical" className="data-[state=active]:bg-[#6B00D7]/20 data-[state=active]:text-white">
                Technical
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-[#6B00D7]/20 data-[state=active]:text-white">
                Security
              </TabsTrigger>
              <TabsTrigger value="tokens" className="data-[state=active]:bg-[#6B00D7]/20 data-[state=active]:text-white">
                CVT Token
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <Accordion type="single" collapsible className="w-full">
                  <motion.div variants={itemVariants}>
                    <AccordionItem value="what-is-chronos-vault">
                      <AccordionTrigger className="text-lg font-semibold">
                        What is Chronos Vault?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-300">
                        <p className="mb-4">
                          Chronos Vault is a revolutionary decentralized platform for creating secure, tamper-proof digital time vaults across multiple blockchain networks. Our platform combines the security strengths of Ethereum, Solana, TON, and Bitcoin to provide unparalleled protection for your digital assets.
                        </p>
                        <p>
                          Think of it as a high-tech safe deposit box with customizable time locks, multi-signature security, and the ability to store any type of digital asset. Built with luxury branding (Tesla × Rolex × Web3), Chronos Vault is the gold standard for digital asset security.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <AccordionItem value="vault-types">
                      <AccordionTrigger className="text-lg font-semibold">
                        What types of vaults can I create?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-300">
                        <p className="mb-4">
                          Chronos Vault offers three main categories of vaults:
                        </p>
                        <ul className="list-disc pl-6 space-y-3">
                          <li>
                            <span className="font-semibold text-[#FF5AF7]">Basic Time Vaults:</span> Simple time-locked containers for your assets with customizable unlock dates.
                          </li>
                          <li>
                            <span className="font-semibold text-[#FF5AF7]">Advanced Security Vaults:</span> Enhanced vaults with multi-signature requirements, authorized retrievers, and cross-chain verification.
                          </li>
                          <li>
                            <span className="font-semibold text-[#FF5AF7]">Specialized Vaults:</span> Purpose-built vaults like Memory Capsules (multimedia + assets), Diamond Hands (Bitcoin with halvening dates), and Legacy Vaults (inheritance planning).
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <AccordionItem value="blockchain-support">
                      <AccordionTrigger className="text-lg font-semibold">
                        Which blockchains does Chronos Vault support?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-300">
                        <p className="mb-4">
                          Chronos Vault currently supports:
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center">
                              <span>Ξ</span>
                            </div>
                            <div>
                              <p className="font-semibold">Ethereum Layer 2</p>
                              <p className="text-xs text-purple-400">Primary Security (95% lower fees)</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                              <span>◎</span>
                            </div>
                            <div>
                              <p className="font-semibold">Solana</p>
                              <p className="text-xs text-purple-400">Rapid Validation</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                              <span>💎</span>
                            </div>
                            <div>
                              <p className="font-semibold">TON</p>
                              <p className="text-xs text-purple-400">Recovery System</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center">
                              <span>₿</span>
                            </div>
                            <div>
                              <p className="font-semibold">Bitcoin</p>
                              <p className="text-xs">Diamond Hands vaults</p>
                            </div>
                          </div>
                        </div>
                        <p className="mt-4">
                          Our expansion roadmap includes Avalanche and Polygon in Phase 1, followed by Cardano and Polkadot in Phase 2.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <AccordionItem value="cross-chain">
                      <AccordionTrigger className="text-lg font-semibold">
                        What is cross-chain functionality?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-300">
                        <p className="mb-4">
                          Cross-chain functionality allows Chronos Vault to leverage the strengths of multiple blockchain networks simultaneously. This includes:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li><span className="font-semibold">Asset Transfers:</span> Move assets between different blockchain networks securely</li>
                          <li><span className="font-semibold">Security Verification:</span> Use multiple networks to validate vault status and transactions</li>
                          <li><span className="font-semibold">Recovery Options:</span> If one network experiences issues, others provide backup functionality</li>
                          <li><span className="font-semibold">Atomic Swaps:</span> Direct peer-to-peer trading between blockchain networks</li>
                        </ul>
                        <p className="mt-4">
                          Our cross-chain bridge, atomic swap functionality, security dashboard, transaction verification, and monitoring dashboard provide a comprehensive suite of tools for managing assets across multiple blockchains.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                </Accordion>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="technical">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={activeTab === "technical" ? "visible" : "hidden"}
              >
                <Accordion type="single" collapsible className="w-full">
                  <motion.div variants={itemVariants}>
                    <AccordionItem value="architecture">
                      <AccordionTrigger className="text-lg font-semibold">
                        What is Trinity Protocol?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-300">
                        <p className="mb-4">
                          Our Trinity Protocol is a fixed-role multi-chain security system where each blockchain serves a specific purpose. <strong className="text-[#FF5AF7]">Ethereum Layer 2 provides primary security with 95% lower fees</strong>, while Solana and TON provide rapid validation and quantum-resistant backup protection.
                        </p>
                        <div className="space-y-4 my-4">
                          <div className="p-3 bg-[#6B00D7]/10 border border-[#6B00D7]/30 rounded-lg">
                            <h4 className="font-semibold text-purple-400">How It Works</h4>
                            <p className="text-sm mt-2">Each blockchain has a dedicated security role. The Trinity Protocol uses 2-of-3 mathematical consensus across all three layers, with Ethereum Layer 2 handling primary ownership records at 95% lower cost.</p>
                          </div>

                          <div className="p-3 bg-[#1D1D1D] rounded-lg border border-[#6B00D7]/30">
                            <h4 className="font-semibold text-purple-400">Ethereum Layer 2: Primary Security</h4>
                            <p className="text-sm">Immutable ownership records via Layer 2 deployment for 95% lower fees while maintaining maximum decentralization.</p>
                          </div>
                          
                          <div className="p-3 bg-[#1D1D1D] rounded-lg border border-[#6B00D7]/30">
                            <h4 className="font-semibold text-purple-400">Solana: Rapid Validation</h4>
                            <p className="text-sm">High-frequency monitoring and state verification with lightning-fast transaction speeds for real-time security.</p>
                          </div>
                          
                          <div className="p-3 bg-[#1D1D1D] rounded-lg border border-[#6B00D7]/30">
                            <h4 className="font-semibold text-purple-400">TON: Recovery System</h4>
                            <p className="text-sm">Quantum-resistant backup and recovery layer ensuring long-term asset protection.</p>
                          </div>
                        </div>
                        <p className="text-purple-400 font-medium">
                          🔒 Fixed Layer Security: 2-of-3 blockchain verification protects your vault. Even if one layer is compromised, your assets remain secure with Ethereum Layer 2 providing affordable primary security!
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <AccordionItem value="smart-contracts">
                      <AccordionTrigger className="text-lg font-semibold">
                        How do the smart contracts work?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-300">
                        <p className="mb-4">
                          Chronos Vault utilizes specialized smart contracts on each supported blockchain:
                        </p>
                        <div className="space-y-4 my-4">
                          <div className="p-3 bg-[#1D1D1D] rounded-lg border border-[#333]">
                            <h4 className="font-semibold text-[#FF5AF7]">TON Contracts (FunC)</h4>
                            <ul className="list-disc pl-6 text-sm space-y-1 mt-2">
                              <li>ChronosVault.fc: Main vault contract</li>
                              <li>CVT token contracts: Jetton implementation for the native token</li>
                              <li>Bridge contracts: Cross-chain functionality</li>
                              <li>Testnet Contract: <span className="font-mono text-xs bg-[#000] p-1 rounded">EQAvDfYmkVV2zFXzC0Hs2e2RGWJyMXHpnMTXH4jnI2W3AwLb</span></li>
                            </ul>
                          </div>
                          
                          <div className="p-3 bg-[#1D1D1D] rounded-lg border border-[#333]">
                            <h4 className="font-semibold text-[#FF5AF7]">Ethereum Contracts (Solidity)</h4>
                            <ul className="list-disc pl-6 text-sm space-y-1 mt-2">
                              <li>ChronosVault.sol: ERC-4626 compliant vault</li>
                              <li>CVTBridge.sol: Cross-chain bridge</li>
                              <li>Security features: Reentrancy guards, overflow protection, access controls</li>
                            </ul>
                          </div>
                          
                          <div className="p-3 bg-[#1D1D1D] rounded-lg border border-[#333]">
                            <h4 className="font-semibold text-[#FF5AF7]">Solana Programs (Rust)</h4>
                            <ul className="list-disc pl-6 text-sm space-y-1 mt-2">
                              <li>chronos_vault.rs: Main vault program</li>
                              <li>cvt_bridge.rs: Cross-chain bridge implementation</li>
                              <li>High-speed transaction monitoring programs</li>
                            </ul>
                          </div>
                        </div>
                        <p>
                          All contracts undergo rigorous security audits and feature advanced safeguards against common vulnerabilities. Our Smart Contract Audit tool allows developers to analyze contracts for security issues.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <AccordionItem value="developer-tools">
                      <AccordionTrigger className="text-lg font-semibold">
                        What developer tools are available?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-300">
                        <p className="mb-4">
                          Chronos Vault offers a comprehensive set of developer tools:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                          <div className="p-3 bg-[#1D1D1D] rounded-lg border border-[#333]">
                            <h4 className="font-semibold text-[#FF5AF7]">Open SDK</h4>
                            <p className="text-sm mt-1">Complete development kit for integrating Chronos Vault functionality into third-party applications and services</p>
                          </div>
                          
                          <div className="p-3 bg-[#1D1D1D] rounded-lg border border-[#333]">
                            <h4 className="font-semibold text-[#FF5AF7]">API Documentation</h4>
                            <p className="text-sm mt-1">Comprehensive API references with examples for all platform functionality</p>
                          </div>
                          
                          <div className="p-3 bg-[#1D1D1D] rounded-lg border border-[#333]">
                            <h4 className="font-semibold text-[#FF5AF7]">Smart Contract Templates</h4>
                            <p className="text-sm mt-1">Pre-audited contract templates for different vault types and security levels</p>
                          </div>
                          
                          <div className="p-3 bg-[#1D1D1D] rounded-lg border border-[#333]">
                            <h4 className="font-semibold text-[#FF5AF7]">Smart Contract Audit Tool</h4>
                            <p className="text-sm mt-1">Security analysis tool for auditing custom vault contracts across multiple blockchains</p>
                          </div>
                        </div>
                        <p className="mb-2">
                          Developer Mode enables testing without actual blockchain connections and includes:
                        </p>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Wallet requirement bypass for testing</li>
                          <li>Visual indicators in UI for development states</li>
                          <li>localStorage persistence of settings</li>
                          <li>Blockchain-specific simulation options</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <AccordionItem value="error-handling">
                      <AccordionTrigger className="text-lg font-semibold">
                        How does error handling work across multiple chains?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-300">
                        <p className="mb-4">
                          Our cross-chain error handling system provides robust recovery options:
                        </p>
                        <div className="space-y-3 my-4">
                          <div className="p-3 bg-[#1D1D1D] rounded-lg border border-[#333]">
                            <h4 className="font-semibold text-[#FF5AF7]">Blockchain-Specific Handlers</h4>
                            <p className="text-sm mt-1">Specialized error handlers for each blockchain (Ethereum, Solana, TON) that understand network-specific errors and can implement appropriate recovery strategies</p>
                          </div>
                          
                          <div className="p-3 bg-[#1D1D1D] rounded-lg border border-[#333]">
                            <h4 className="font-semibold text-[#FF5AF7]">Fallback Chain Mechanisms</h4>
                            <p className="text-sm mt-1">If a transaction fails on one chain, the system can automatically retry on alternative chains using predefined fallback paths (ethereum→solana→ton→ethereum, bitcoin→ethereum)</p>
                          </div>
                          
                          <div className="p-3 bg-[#1D1D1D] rounded-lg border border-[#333]">
                            <h4 className="font-semibold text-[#FF5AF7]">Trinity Protocol™ Verification</h4>
                            <p className="text-sm mt-1">Critical operations require confirmation from multiple chains, ensuring that errors on a single chain don't compromise security</p>
                          </div>
                          
                          <div className="p-3 bg-[#1D1D1D] rounded-lg border border-[#333]">
                            <h4 className="font-semibold text-[#FF5AF7]">Comprehensive Monitoring</h4>
                            <p className="text-sm mt-1">Real-time monitoring of all blockchain networks with automated alerts for any anomalies or failures</p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <AccordionItem value="trinity-consensus">
                      <AccordionTrigger className="text-lg font-semibold">
                        How does Trinity Protocol's 2-of-3 consensus work?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-300">
                        <p className="mb-4">
                          Trinity Protocol requires agreement from at least 2 out of 3 blockchains (Arbitrum, Solana, TON) for critical vault operations, providing mathematical security guarantees.
                        </p>
                        <div className="space-y-3 my-4">
                          <div className="p-3 bg-[#1D1D1D] rounded-lg border border-[#6B00D7]/30">
                            <h4 className="font-semibold text-purple-400">Consensus Mechanism</h4>
                            <p className="text-sm mt-1">Each vault operation is verified across all three chains. The operation succeeds only when at least 2 chains confirm validity, preventing single-point failures.</p>
                          </div>
                          
                          <div className="p-3 bg-[#1D1D1D] rounded-lg border border-[#6B00D7]/30">
                            <h4 className="font-semibold text-purple-400">State Synchronization</h4>
                            <p className="text-sm mt-1">Cross-chain state proofs ensure all three blockchains maintain consistent vault state. Any discrepancy triggers automatic reconciliation.</p>
                          </div>
                          
                          <div className="p-3 bg-[#1D1D1D] rounded-lg border border-[#6B00D7]/30">
                            <h4 className="font-semibold text-purple-400">Attack Resistance</h4>
                            <p className="text-sm mt-1">An attacker would need to simultaneously compromise 2 of 3 independent blockchains—mathematically negligible probability (&lt;10^-18).</p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <AccordionItem value="circuit-breaker">
                      <AccordionTrigger className="text-lg font-semibold">
                        What is the Circuit Breaker mechanism?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-300">
                        <p className="mb-4">
                          The Circuit Breaker is Trinity Protocol's emergency protection system that automatically halts suspicious vault operations to prevent attacks.
                        </p>
                        <div className="space-y-3 my-4">
                          <div className="p-3 bg-[#1D1D1D] rounded-lg border border-red-500/30">
                            <h4 className="font-semibold text-red-400">Automatic Detection</h4>
                            <p className="text-sm mt-1">Continuously monitors for anomalies: rapid withdrawals, unusual access patterns, or consensus failures across chains.</p>
                          </div>
                          
                          <div className="p-3 bg-[#1D1D1D] rounded-lg border border-red-500/30">
                            <h4 className="font-semibold text-red-400">Instant Freeze</h4>
                            <p className="text-sm mt-1">When triggered, all vault operations are immediately frozen across all three chains until manual review confirms safety.</p>
                          </div>
                          
                          <div className="p-3 bg-[#1D1D1D] rounded-lg border border-red-500/30">
                            <h4 className="font-semibold text-red-400">Recovery Process</h4>
                            <p className="text-sm mt-1">After investigation, vault owner can reset the circuit breaker with multi-signature approval across at least 2 chains.</p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <AccordionItem value="trinity-events">
                      <AccordionTrigger className="text-lg font-semibold">
                        How do Trinity Protocol event subscriptions work?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-300">
                        <p className="mb-4">
                          Real-time event subscriptions allow monitoring of vault state changes across all three blockchains simultaneously.
                        </p>
                        <div className="space-y-3 my-4">
                          <div className="p-3 bg-[#1D1D1D] rounded-lg border border-[#6B00D7]/30">
                            <h4 className="font-semibold text-purple-400">Multi-Chain Events</h4>
                            <p className="text-sm mt-1">Subscribe to VaultCreated, VaultUnlocked, ConsensusReached, CircuitBreakerTriggered events from any blockchain.</p>
                          </div>
                          
                          <div className="p-3 bg-[#1D1D1D] rounded-lg border border-[#6B00D7]/30">
                            <h4 className="font-semibold text-purple-400">WebSocket Streams</h4>
                            <p className="text-sm mt-1">Low-latency WebSocket connections provide instant notifications when vault state changes on any chain.</p>
                          </div>
                          
                          <div className="p-3 bg-[#1D1D1D] rounded-lg border border-[#6B00D7]/30">
                            <h4 className="font-semibold text-purple-400">Consensus Verification</h4>
                            <p className="text-sm mt-1">Each event includes cross-chain proof data, allowing independent verification of 2-of-3 consensus achievement.</p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                </Accordion>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="security">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={activeTab === "security" ? "visible" : "hidden"}
              >
                <Accordion type="single" collapsible className="w-full">
                  <motion.div variants={itemVariants}>
                    <AccordionItem value="security-levels">
                      <AccordionTrigger className="text-lg font-semibold">
                        What security levels are available?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-300">
                        <p className="mb-4">
                          Chronos Vault offers three security levels, each with progressively stronger protections:
                        </p>
                        <div className="space-y-4 my-4">
                          <div className="p-3 bg-[#1D1D1D] rounded-lg border border-[#333]">
                            <h4 className="flex items-center font-semibold">
                              <span className="text-[#FF5AF7]">Level 1: Basic Time-Lock</span>
                              <Badge className="ml-2 bg-blue-600">Basic</Badge>
                            </h4>
                            <ul className="list-disc pl-6 text-sm space-y-1 mt-2">
                              <li>Simple time-lock mechanism</li>
                              <li>Preset unlock date</li>
                              <li>Owner-only access after unlock date</li>
                              <li>Single-chain security (Ethereum)</li>
                            </ul>
                          </div>
                          
                          <div className="p-3 bg-[#1D1D1D] rounded-lg border border-[#333]">
                            <h4 className="flex items-center font-semibold">
                              <span className="text-[#FF5AF7]">Level 2: Advanced Access Control</span>
                              <Badge className="ml-2 bg-purple-600">Standard</Badge>
                            </h4>
                            <ul className="list-disc pl-6 text-sm space-y-1 mt-2">
                              <li>Enhanced time-lock with emergency override options</li>
                              <li>Access key requirements for additional security</li>
                              <li>Authorized retrievers list</li>
                              <li>Dual-chain security (Ethereum + Solana)</li>
                            </ul>
                          </div>
                          
                          <div className="p-3 bg-[#1D1D1D] rounded-lg border border-[#333]">
                            <h4 className="flex items-center font-semibold">
                              <span className="text-[#FF5AF7]">Level 3: Maximum Security</span>
                              <Badge className="ml-2 bg-pink-600">Premium</Badge>
                            </h4>
                            <ul className="list-disc pl-6 text-sm space-y-1 mt-2">
                              <li>Cross-chain verification for all operations</li>
                              <li>Multi-signature requirements (configurable threshold)</li>
                              <li>Geographic restrictions option</li>
                              <li>Full Trinity Protocol™ security (Ethereum + Solana + TON)</li>
                              <li>Zero-knowledge proof options for maximum privacy</li>
                            </ul>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <AccordionItem value="quantum-security">
                      <AccordionTrigger className="text-lg font-semibold">
                        What is Quantum-Progressive Security?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-300">
                        <p className="mb-4">
                          Our Quantum-Progressive security system automatically scales protection based on the value of assets being secured:
                        </p>
                        <div className="space-y-4 my-4">
                          <div className="p-3 bg-[#1D1D1D] rounded-lg border border-[#333]">
                            <h4 className="font-semibold text-[#FF5AF7]">Standard (0-10K USD)</h4>
                            <ul className="list-disc pl-6 text-sm space-y-1 mt-2">
                              <li>Falcon-512 signatures</li>
                              <li>Kyber-512 encryption</li>
                              <li>Standard blockchain security</li>
                            </ul>
                          </div>
                          
                          <div className="p-3 bg-[#1D1D1D] rounded-lg border border-[#333]">
                            <h4 className="font-semibold text-[#FF5AF7]">Enhanced (10K-100K USD)</h4>
                            <ul className="list-disc pl-6 text-sm space-y-1 mt-2">
                              <li>Falcon-1024 signatures</li>
                              <li>Kyber-768 encryption</li>
                              <li>Multi-signature requirements</li>
                              <li>Cross-chain verification</li>
                            </ul>
                          </div>
                          
                          <div className="p-3 bg-[#1D1D1D] rounded-lg border border-[#333]">
                            <h4 className="font-semibold text-[#FF5AF7]">Advanced (100K-1M USD)</h4>
                            <ul className="list-disc pl-6 text-sm space-y-1 mt-2">
                              <li>CRYSTALS-Dilithium signatures</li>
                              <li>Kyber-1024 encryption</li>
                              <li>Zero-knowledge proofs</li>
                              <li>Trinity Protocol™ verification for all operations</li>
                            </ul>
                          </div>
                          
                          <div className="p-3 bg-[#1D1D1D] rounded-lg border border-[#333]">
                            <h4 className="font-semibold text-[#FF5AF7]">Maximum (1M+ USD)</h4>
                            <ul className="list-disc pl-6 text-sm space-y-1 mt-2">
                              <li>SPHINCS+ signatures</li>
                              <li>FrodoKEM-1344 encryption</li>
                              <li>Hybrid encryption systems</li>
                              <li>Custom security solutions with full redundancy</li>
                            </ul>
                          </div>
                        </div>
                        <p>
                          This approach ensures that even assets protected today will remain secure in a post-quantum computing environment.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <AccordionItem value="multi-signature">
                      <AccordionTrigger className="text-lg font-semibold">
                        How does Multi-Signature security work?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-300">
                        <p className="mb-4">
                          Multi-signature security requires multiple authorized parties to approve access to a vault:
                        </p>
                        <div className="space-y-1 my-4">
                          <div className="p-3 bg-[#1D1D1D] rounded-lg border border-[#333]">
                            <h4 className="font-semibold text-[#FF5AF7]">Configuration Options</h4>
                            <ul className="list-disc pl-6 text-sm space-y-1 mt-2">
                              <li><span className="font-medium">M-of-N Threshold:</span> Configure how many signatures (M) are required out of the total authorized signers (N)</li>
                              <li><span className="font-medium">Example:</span> A 2-of-3 vault requires any 2 out of 3 authorized signers to approve access</li>
                              <li><span className="font-medium">Custom Rules:</span> Set role-based permissions where certain actions require specific signers</li>
                            </ul>
                          </div>
                          
                          <div className="p-3 bg-[#1D1D1D] rounded-lg border border-[#333]">
                            <h4 className="font-semibold text-[#FF5AF7]">Security Benefits</h4>
                            <ul className="list-disc pl-6 text-sm space-y-1 mt-2">
                              <li>Prevents single points of failure in access control</li>
                              <li>Protects against compromised credentials of a single party</li>
                              <li>Enables organizational governance of high-value assets</li>
                              <li>Creates a secure approval workflow for critical operations</li>
                            </ul>
                          </div>
                          
                          <div className="p-3 bg-[#1D1D1D] rounded-lg border border-[#333]">
                            <h4 className="font-semibold text-[#FF5AF7]">Implementation</h4>
                            <ul className="list-disc pl-6 text-sm space-y-1 mt-2">
                              <li>On-chain signature verification across multiple blockchains</li>
                              <li>Cross-chain signature aggregation for maximum security</li>
                              <li>Real-time approval tracking dashboard</li>
                              <li>Notification system for pending signature requests</li>
                            </ul>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <AccordionItem value="monitoring">
                      <AccordionTrigger className="text-lg font-semibold">
                        How does AI-Enhanced Security Monitoring work?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-300">
                        <p className="mb-4">
                          Our security monitoring system uses AI to provide proactive protection:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                          <div className="p-3 bg-[#1D1D1D] rounded-lg border border-[#333]">
                            <h4 className="font-semibold text-[#FF5AF7]">Anomaly Detection</h4>
                            <p className="text-sm mt-1">AI models identify unusual patterns in access attempts, transaction requests, and network activity that might indicate security threats</p>
                          </div>
                          
                          <div className="p-3 bg-[#1D1D1D] rounded-lg border border-[#333]">
                            <h4 className="font-semibold text-[#FF5AF7]">Threat Intelligence</h4>
                            <p className="text-sm mt-1">Real-time monitoring of known threat vectors and vulnerability databases to preemptively protect against emerging attack methods</p>
                          </div>
                          
                          <div className="p-3 bg-[#1D1D1D] rounded-lg border border-[#333]">
                            <h4 className="font-semibold text-[#FF5AF7]">Cross-Chain Validation</h4>
                            <p className="text-sm mt-1">Automated verification of transactions and vault status across multiple blockchains to detect inconsistencies or attack attempts</p>
                          </div>
                          
                          <div className="p-3 bg-[#1D1D1D] rounded-lg border border-[#333]">
                            <h4 className="font-semibold text-[#FF5AF7]">Adaptive Security</h4>
                            <p className="text-sm mt-1">Security protocols that adapt to changing risk levels based on AI analysis of current conditions and threat landscapes</p>
                          </div>
                        </div>
                        <p>
                          The monitoring dashboard provides real-time visibility into security status, alerts, and protective actions across all blockchain networks.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                </Accordion>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="tokens">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={activeTab === "tokens" ? "visible" : "hidden"}
              >
                <Accordion type="single" collapsible className="w-full">
                  <motion.div variants={itemVariants}>
                    <AccordionItem value="cvt-token">
                      <AccordionTrigger className="text-lg font-semibold">
                        What is the CVT Token?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-300">
                        <p className="mb-4">
                          ChronosToken (CVT) is the native utility token of the Chronos Vault platform:
                        </p>
                        <div className="space-y-4 my-4">
                          <div className="p-3 bg-[#1D1D1D] rounded-lg border border-[#333]">
                            <h4 className="font-semibold text-[#FF5AF7]">Token Economics</h4>
                            <ul className="list-disc pl-6 text-sm space-y-1 mt-2">
                              <li>Fixed supply of 21,000,000 CVT</li>
                              <li>Deflationary mechanism with buyback and burn</li>
                              <li>Time-locked release schedule</li>
                              <li>Available across TON, Ethereum, and Solana networks</li>
                            </ul>
                          </div>
                          
                          <div className="p-3 bg-[#1D1D1D] rounded-lg border border-[#333]">
                            <h4 className="font-semibold text-[#FF5AF7]">Utility Functions</h4>
                            <ul className="list-disc pl-6 text-sm space-y-1 mt-2">
                              <li>Pay for platform fees and services</li>
                              <li>Unlock premium features and vault types</li>
                              <li>Participate in platform governance</li>
                              <li>Stake for fee discounts and rewards</li>
                            </ul>
                          </div>
                          
                          <div className="p-3 bg-[#1D1D1D] rounded-lg border border-[#333]">
                            <h4 className="font-semibold text-[#FF5AF7]">Staking Tiers</h4>
                            <table className="w-full text-sm mt-2">
                              <thead>
                                <tr className="border-b border-[#444]">
                                  <th className="text-left py-2">Tier</th>
                                  <th className="text-left py-2">Requirement</th>
                                  <th className="text-left py-2">Benefits</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-[#444]">
                                  <td className="py-2">Vault Guardian</td>
                                  <td className="py-2">1,000+ CVT</td>
                                  <td className="py-2">75% fee reduction</td>
                                </tr>
                                <tr className="border-b border-[#444]">
                                  <td className="py-2">Vault Architect</td>
                                  <td className="py-2">10,000+ CVT</td>
                                  <td className="py-2">90% fee reduction</td>
                                </tr>
                                <tr>
                                  <td className="py-2">Vault Sovereign</td>
                                  <td className="py-2">100,000+ CVT</td>
                                  <td className="py-2">100% fee reduction</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <AccordionItem value="token-staking">
                      <AccordionTrigger className="text-lg font-semibold">
                        How does CVT staking work?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-300">
                        <p className="mb-4">
                          Staking CVT tokens provides multiple benefits to platform users:
                        </p>
                        <div className="space-y-4 my-4">
                          <div className="p-3 bg-[#1D1D1D] rounded-lg border border-[#333]">
                            <h4 className="font-semibold text-[#FF5AF7]">Staking Mechanism</h4>
                            <ul className="list-disc pl-6 text-sm space-y-1 mt-2">
                              <li>Lock CVT tokens in the platform's staking contract</li>
                              <li>Choose between flexible staking (withdraw anytime) or fixed-term staking (higher rewards)</li>
                              <li>Staking contracts available on TON, Ethereum, and Solana</li>
                              <li>Cross-chain staking bridge for unified rewards across networks</li>
                            </ul>
                          </div>
                          
                          <div className="p-3 bg-[#1D1D1D] rounded-lg border border-[#333]">
                            <h4 className="font-semibold text-[#FF5AF7]">Rewards Structure</h4>
                            <ul className="list-disc pl-6 text-sm space-y-1 mt-2">
                              <li>Base staking rewards from platform fee distribution</li>
                              <li>Bonus rewards for longer staking periods</li>
                              <li>Special rewards for participating in network security</li>
                              <li>Governance weight proportional to staking amount and duration</li>
                            </ul>
                          </div>
                          
                          <div className="p-3 bg-[#1D1D1D] rounded-lg border border-[#333]">
                            <h4 className="font-semibold text-[#FF5AF7]">Premium Access</h4>
                            <ul className="list-disc pl-6 text-sm space-y-1 mt-2">
                              <li>Staking unlocks access to premium vault features</li>
                              <li>Higher security levels available based on staking tier</li>
                              <li>Priority customer support for higher staking tiers</li>
                              <li>Beta access to new features before public release</li>
                            </ul>
                          </div>
                        </div>
                        <p>
                          The TON staking contract is available at <span className="font-mono text-xs bg-[#000] p-1 rounded">EQDi_PSI1WbigxBKCj7vEz2pAvUQfw0IFZz9Sz2aGHUFNpSw</span>
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <AccordionItem value="tokenized-vaults">
                      <AccordionTrigger className="text-lg font-semibold">
                        What are tokenized vaults?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-300">
                        <p className="mb-4">
                          Chronos Vault implements tokenized vaults following the ERC-4626 standard:
                        </p>
                        <div className="space-y-4 my-4">
                          <div className="p-3 bg-[#1D1D1D] rounded-lg border border-[#333]">
                            <h4 className="font-semibold text-[#FF5AF7]">Tokenization Benefits</h4>
                            <ul className="list-disc pl-6 text-sm space-y-1 mt-2">
                              <li>Each vault represents a unique token that can be transferred or used in other DeFi protocols</li>
                              <li>Ownership verification through standard blockchain mechanisms</li>
                              <li>Standardized interfaces for integrating with other financial protocols</li>
                              <li>Support for complex ownership structures and permissions</li>
                            </ul>
                          </div>
                          
                          <div className="p-3 bg-[#1D1D1D] rounded-lg border border-[#333]">
                            <h4 className="font-semibold text-[#FF5AF7]">ERC-4626 Compliance</h4>
                            <ul className="list-disc pl-6 text-sm space-y-1 mt-2">
                              <li>Standardized accounting and interaction methods</li>
                              <li>Compatible with major wallets and interfaces</li>
                              <li>Support for advanced yield strategies</li>
                              <li>Composable with other DeFi protocols</li>
                            </ul>
                          </div>
                          
                          <div className="p-3 bg-[#1D1D1D] rounded-lg border border-[#333]">
                            <h4 className="font-semibold text-[#FF5AF7]">Cross-Chain Capabilities</h4>
                            <ul className="list-disc pl-6 text-sm space-y-1 mt-2">
                              <li>Vault tokens can be bridged across supported networks</li>
                              <li>Consistent representation of vault status across chains</li>
                              <li>Unified view of all assets regardless of underlying blockchain</li>
                              <li>Secure cross-chain verification of token validity</li>
                            </ul>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <AccordionItem value="roadmap">
                      <AccordionTrigger className="text-lg font-semibold">
                        What's on the CVT token roadmap?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-300">
                        <p className="mb-4">
                          The CVT token roadmap includes several exciting developments:
                        </p>
                        <div className="relative ml-4 pl-6 border-l-2 border-[#6B00D7] my-4">
                          <div className="mb-6 relative">
                            <div className="absolute -left-[29px] top-0 w-5 h-5 rounded-full bg-[#6B00D7]"></div>
                            <h4 className="font-semibold text-[#FF5AF7] mb-1">Q2 2025: Protocol Fee Distribution</h4>
                            <p className="text-sm">Implementation of protocol fee sharing to CVT stakers based on staking tier and duration</p>
                          </div>
                          
                          <div className="mb-6 relative">
                            <div className="absolute -left-[29px] top-0 w-5 h-5 rounded-full bg-[#6B00D7]"></div>
                            <h4 className="font-semibold text-[#FF5AF7] mb-1">Q3 2025: Governance Launch</h4>
                            <p className="text-sm">Introduction of decentralized governance protocol allowing CVT holders to vote on platform upgrades and parameter changes</p>
                          </div>
                          
                          <div className="mb-6 relative">
                            <div className="absolute -left-[29px] top-0 w-5 h-5 rounded-full bg-[#6B00D7]"></div>
                            <h4 className="font-semibold text-[#FF5AF7] mb-1">Q4 2025: Yield Optimization</h4>
                            <p className="text-sm">Advanced yield strategies for vaulted assets with rewards paid in CVT tokens</p>
                          </div>
                          
                          <div className="relative">
                            <div className="absolute -left-[29px] top-0 w-5 h-5 rounded-full bg-[#6B00D7]"></div>
                            <h4 className="font-semibold text-[#FF5AF7] mb-1">Q1 2026: Multi-Chain Expansion</h4>
                            <p className="text-sm">Expansion to additional blockchains with unified CVT liquidity pools and cross-chain rewards</p>
                          </div>
                        </div>
                        <p>
                          All developments are focused on increasing CVT utility while maintaining the deflationary tokenomics model that provides value to long-term holders.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                </Accordion>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Development Mode Indicator */}
        {devModeEnabled && (
          <div className="mt-12 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-300">
            <h3 className="text-lg font-semibold mb-2">
              <span className="mr-2">⚙️</span>
              Developer Mode Active
            </h3>
            <p className="text-sm mb-3">You're viewing this site in developer mode. Some features may be simulated.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-1">Connected Wallets:</h4>
                <ul className="list-disc pl-6">
                  <li>ETH: {walletInfo.ethereum.isConnected ? walletInfo.ethereum.address.substring(0, 8) + '...' : 'Not Connected'}</li>
                  <li>SOL: {walletInfo.solana.isConnected ? walletInfo.solana.address.substring(0, 8) + '...' : 'Not Connected'}</li>
                  <li>TON: {walletInfo.ton.isConnected ? walletInfo.ton.address.substring(0, 8) + '...' : 'Not Connected'}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-1">Active Features:</h4>
                <ul className="list-disc pl-6">
                  <li>Trinity Protocol™ Security</li>
                  <li>Cross-Chain Bridge</li>
                  <li>AI-Enhanced Monitoring</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-1">Test Networks:</h4>
                <ul className="list-disc pl-6">
                  <li>Ethereum Sepolia</li>
                  <li>Solana Devnet</li>
                  <li>TON Testnet</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}