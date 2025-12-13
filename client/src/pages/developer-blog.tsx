import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Zap, 
  Lock, 
  Globe, 
  Code, 
  Wallet, 
  ArrowRight, 
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Layers,
  GitBranch,
  FileCode,
  ExternalLink
} from "lucide-react";
import { Link } from "wouter";

export default function DeveloperBlog() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#0f0f2a] to-[#0a0a1a] text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF5AF7]/10 via-transparent to-[#6B00D7]/10" />
        <div className="max-w-6xl mx-auto relative z-10">
          <Badge className="mb-4 bg-[#FF5AF7]/20 text-[#FF5AF7] border-[#FF5AF7]/30">
            Developer Documentation
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#FF5AF7] to-[#6B00D7] bg-clip-text text-transparent">
            Trinity Protocol™ v3.5.23
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mb-8">
            Mathematically provable 2-of-3 consensus verification for enterprise-grade 
            multi-chain security. Learn how our HTLC atomic swaps, validator network, 
            and security layers work together.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/bridge">
              <Button className="bg-gradient-to-r from-[#FF5AF7] to-[#6B00D7]" data-testid="button-try-bridge">
                Try the Bridge <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="https://github.com/user/chronos-vault" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-gray-600" data-testid="button-view-github">
                <GitBranch className="mr-2 h-4 w-4" /> View on GitHub
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <Tabs defaultValue="architecture" className="space-y-8">
          <TabsList className="bg-[#1a1a3a] border border-gray-700 p-1 flex-wrap h-auto">
            <TabsTrigger value="architecture" className="data-[state=active]:bg-[#FF5AF7]/20" data-testid="tab-architecture">
              <Layers className="mr-2 h-4 w-4" /> Architecture
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-[#FF5AF7]/20" data-testid="tab-security">
              <Shield className="mr-2 h-4 w-4" /> Security Proofs
            </TabsTrigger>
            <TabsTrigger value="fees" className="data-[state=active]:bg-[#FF5AF7]/20" data-testid="tab-fees">
              <TrendingUp className="mr-2 h-4 w-4" /> Fee Structure
            </TabsTrigger>
            <TabsTrigger value="comparison" className="data-[state=active]:bg-[#FF5AF7]/20" data-testid="tab-comparison">
              <Globe className="mr-2 h-4 w-4" /> Bridge Comparison
            </TabsTrigger>
            <TabsTrigger value="tutorial" className="data-[state=active]:bg-[#FF5AF7]/20" data-testid="tab-tutorial">
              <Code className="mr-2 h-4 w-4" /> Swap Tutorial
            </TabsTrigger>
            <TabsTrigger value="contracts" className="data-[state=active]:bg-[#FF5AF7]/20" data-testid="tab-contracts">
              <FileCode className="mr-2 h-4 w-4" /> Smart Contracts
            </TabsTrigger>
          </TabsList>

          {/* Architecture Tab */}
          <TabsContent value="architecture" className="space-y-6">
            <Card className="bg-[#1a1a3a]/80 border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Layers className="h-6 w-6 text-[#FF5AF7]" />
                  System Architecture
                </CardTitle>
                <CardDescription>
                  How Trinity Protocol's multi-chain consensus works
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="bg-[#0f0f2a] border-blue-500/30">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span className="font-semibold">Arbitrum (PRIMARY)</span>
                      </div>
                      <p className="text-sm text-gray-400">
                        Main security validator. Hosts HTLC contracts, processes swaps, 
                        and provides initial consensus signature.
                      </p>
                      <Badge className="mt-2 bg-blue-500/20 text-blue-400">Chain ID: 421614</Badge>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-[#0f0f2a] border-purple-500/30">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500" />
                        <span className="font-semibold">Solana (MONITOR)</span>
                      </div>
                      <p className="text-sm text-gray-400">
                        High-frequency monitoring with {"<"}5s SLA. Validates cross-chain 
                        state and provides second consensus signature.
                      </p>
                      <Badge className="mt-2 bg-purple-500/20 text-purple-400">Devnet</Badge>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-[#0f0f2a] border-cyan-500/30">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-cyan-500" />
                        <span className="font-semibold">TON (BACKUP)</span>
                      </div>
                      <p className="text-sm text-gray-400">
                        Quantum-resistant recovery with ML-KEM-1024 and CRYSTALS-Dilithium-5. 
                        Emergency backup validator.
                      </p>
                      <Badge className="mt-2 bg-cyan-500/20 text-cyan-400">Testnet</Badge>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-[#0f0f2a] rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold mb-4">2-of-3 Consensus Flow</h3>
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <span className="text-blue-400 font-bold">1</span>
                      </div>
                      <div>
                        <p className="font-semibold">Arbitrum Signs</p>
                        <p className="text-sm text-gray-400">HTLC created on-chain</p>
                      </div>
                    </div>
                    <ArrowRight className="h-6 w-6 text-gray-500 rotate-90 md:rotate-0" />
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <span className="text-purple-400 font-bold">2</span>
                      </div>
                      <div>
                        <p className="font-semibold">Solana Validates</p>
                        <p className="text-sm text-gray-400">Cross-chain verification</p>
                      </div>
                    </div>
                    <ArrowRight className="h-6 w-6 text-gray-500 rotate-90 md:rotate-0" />
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-green-400" />
                      </div>
                      <div>
                        <p className="font-semibold">Consensus Reached</p>
                        <p className="text-sm text-gray-400">2/3 validators agree</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-[#FF5AF7]/10 to-[#6B00D7]/10 rounded-lg p-6 border border-[#FF5AF7]/30">
                  <h3 className="text-lg font-semibold mb-2">Why 2-of-3?</h3>
                  <p className="text-gray-300">
                    Unlike single-chain bridges that can be compromised by one validator, 
                    Trinity Protocol requires agreement from validators on <strong>two different blockchains</strong>. 
                    This means an attacker would need to simultaneously compromise validators 
                    on Arbitrum AND either Solana or TON - a significantly harder attack vector.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Proofs Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="bg-[#1a1a3a]/80 border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Shield className="h-6 w-6 text-[#FF5AF7]" />
                  Mathematical Security Proofs
                </CardTitle>
                <CardDescription>
                  8-layer Mathematical Defense Layer (MDL) protecting your assets
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { layer: 1, name: "Zero-Knowledge Proofs", tech: "Groth16", desc: "Privacy-preserving verification without revealing sensitive data" },
                    { layer: 2, name: "Formal Verification", tech: "Lean 4", desc: "Mathematically proven smart contract correctness" },
                    { layer: 3, name: "MPC Key Management", tech: "Shamir + Kyber", desc: "Distributed key shares - no single point of failure" },
                    { layer: 4, name: "VDF Time-Locks", tech: "Wesolowski", desc: "Unforgeable time delays for emergency operations" },
                    { layer: 5, name: "AI Governance", tech: "Claude Integration", desc: "Anomaly detection and threat response" },
                    { layer: 6, name: "Quantum-Resistant", tech: "ML-KEM-1024", desc: "Future-proof against quantum attacks" },
                    { layer: 7, name: "Trinity Consensus", tech: "2-of-3 Multi-Chain", desc: "Cross-chain validator agreement" },
                    { layer: 8, name: "Trinity Shield", tech: "Intel SGX/AMD SEV", desc: "Hardware-isolated execution enclaves" },
                  ].map((layer) => (
                    <Card key={layer.layer} className="bg-[#0f0f2a] border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#FF5AF7]/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-[#FF5AF7] font-bold text-sm">{layer.layer}</span>
                          </div>
                          <div>
                            <h4 className="font-semibold">{layer.name}</h4>
                            <Badge className="my-1 bg-gray-700 text-gray-300">{layer.tech}</Badge>
                            <p className="text-sm text-gray-400">{layer.desc}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="bg-[#0f0f2a] rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold mb-4">HTLC Security Properties</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5" />
                      <div>
                        <p className="font-medium">Atomic Execution</p>
                        <p className="text-sm text-gray-400">Either the swap completes fully or funds return to sender - no partial states</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5" />
                      <div>
                        <p className="font-medium">Time-Lock Protection</p>
                        <p className="text-sm text-gray-400">7-30 day timelock ensures funds are never permanently locked</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5" />
                      <div>
                        <p className="font-medium">Hash-Lock Verification</p>
                        <p className="text-sm text-gray-400">Cryptographic proof (keccak256) ensures only the intended recipient can claim</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5" />
                      <div>
                        <p className="font-medium">Reentrancy Protection</p>
                        <p className="text-sm text-gray-400">OpenZeppelin ReentrancyGuard prevents flash loan attacks</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fee Structure Tab */}
          <TabsContent value="fees" className="space-y-6">
            <Card className="bg-[#1a1a3a]/80 border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-[#FF5AF7]" />
                  Fee Structure Explained
                </CardTitle>
                <CardDescription>
                  Why we charge 0.001 ETH (~$3) Trinity Fee
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-[#0f0f2a] rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold mb-4">Current Fees</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                        <span className="text-gray-400">Trinity Consensus Fee</span>
                        <span className="font-mono text-[#FF5AF7]">0.001 ETH (~$3)</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                        <span className="text-gray-400">Minimum Swap Amount</span>
                        <span className="font-mono">0.01 ETH (~$30)</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                        <span className="text-gray-400">Gas Cost (estimated)</span>
                        <span className="font-mono">~$0.50-1.00</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Timelock Range</span>
                        <span className="font-mono">7-30 days</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#0f0f2a] rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold mb-4">What the Fee Covers</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-400 mt-2" />
                        <div>
                          <p className="font-medium">Arbitrum Validator</p>
                          <p className="text-sm text-gray-400">On-chain verification, gas subsidy</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-purple-400 mt-2" />
                        <div>
                          <p className="font-medium">Solana Validator</p>
                          <p className="text-sm text-gray-400">Cross-chain state monitoring</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2" />
                        <div>
                          <p className="font-medium">TON Validator</p>
                          <p className="text-sm text-gray-400">Emergency recovery readiness</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-400 mt-2" />
                        <div>
                          <p className="font-medium">Infrastructure</p>
                          <p className="text-sm text-gray-400">RPC nodes, databases, monitoring</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg p-6 border border-yellow-500/30">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-6 w-6 text-yellow-400 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Why 0.01 ETH Minimum?</h3>
                      <p className="text-gray-300 mb-3">
                        The minimum amount prevents <strong>dust attacks</strong> - where attackers flood 
                        the network with thousands of tiny swaps to overwhelm validators and slow down 
                        legitimate transactions.
                      </p>
                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div className="bg-[#0f0f2a] rounded p-3">
                          <p className="text-sm text-gray-400">Attack cost at 0.01 ETH minimum</p>
                          <p className="text-xl font-mono text-green-400">$12,000+ for 400 swaps</p>
                        </div>
                        <div className="bg-[#0f0f2a] rounded p-3">
                          <p className="text-sm text-gray-400">Attack cost at 0.001 ETH minimum</p>
                          <p className="text-xl font-mono text-red-400">Only $1,200 for 400 swaps</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0f0f2a] rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold mb-4">Fee Examples by Swap Size</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left py-2 text-gray-400">Swap Amount</th>
                          <th className="text-left py-2 text-gray-400">Trinity Fee</th>
                          <th className="text-left py-2 text-gray-400">Gas (est.)</th>
                          <th className="text-left py-2 text-gray-400">Total Cost</th>
                          <th className="text-left py-2 text-gray-400">Fee %</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-700/50">
                          <td className="py-2">0.01 ETH ($30)</td>
                          <td className="py-2">$3.00</td>
                          <td className="py-2">$0.75</td>
                          <td className="py-2 text-[#FF5AF7]">$3.75</td>
                          <td className="py-2">12.5%</td>
                        </tr>
                        <tr className="border-b border-gray-700/50">
                          <td className="py-2">0.1 ETH ($300)</td>
                          <td className="py-2">$3.00</td>
                          <td className="py-2">$0.75</td>
                          <td className="py-2 text-[#FF5AF7]">$3.75</td>
                          <td className="py-2">1.25%</td>
                        </tr>
                        <tr className="border-b border-gray-700/50">
                          <td className="py-2">1 ETH ($3,000)</td>
                          <td className="py-2">$3.00</td>
                          <td className="py-2">$0.75</td>
                          <td className="py-2 text-[#FF5AF7]">$3.75</td>
                          <td className="py-2">0.125%</td>
                        </tr>
                        <tr>
                          <td className="py-2">10 ETH ($30,000)</td>
                          <td className="py-2">$3.00</td>
                          <td className="py-2">$0.75</td>
                          <td className="py-2 text-[#FF5AF7]">$3.75</td>
                          <td className="py-2">0.0125%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bridge Comparison Tab */}
          <TabsContent value="comparison" className="space-y-6">
            <Card className="bg-[#1a1a3a]/80 border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Globe className="h-6 w-6 text-[#FF5AF7]" />
                  How We Compare to Other Bridges
                </CardTitle>
                <CardDescription>
                  Trinity Protocol vs. popular cross-chain bridges
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 text-gray-400">Bridge</th>
                        <th className="text-left py-3 text-gray-400">Fee</th>
                        <th className="text-left py-3 text-gray-400">Security Model</th>
                        <th className="text-left py-3 text-gray-400">Validators</th>
                        <th className="text-left py-3 text-gray-400">Hacked?</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-700/50 bg-[#FF5AF7]/5">
                        <td className="py-3 font-semibold text-[#FF5AF7]">Trinity Protocol</td>
                        <td className="py-3">~$3</td>
                        <td className="py-3">2-of-3 Multi-Chain Consensus</td>
                        <td className="py-3">3 (Arbitrum, Solana, TON)</td>
                        <td className="py-3"><Badge className="bg-green-500/20 text-green-400">Never</Badge></td>
                      </tr>
                      <tr className="border-b border-gray-700/50">
                        <td className="py-3">Wormhole</td>
                        <td className="py-3">~$1-2</td>
                        <td className="py-3">Guardian Set (19 validators)</td>
                        <td className="py-3">19</td>
                        <td className="py-3"><Badge className="bg-red-500/20 text-red-400">$320M (2022)</Badge></td>
                      </tr>
                      <tr className="border-b border-gray-700/50">
                        <td className="py-3">Ronin Bridge</td>
                        <td className="py-3">~$0.50</td>
                        <td className="py-3">Multi-sig (5-of-9)</td>
                        <td className="py-3">9</td>
                        <td className="py-3"><Badge className="bg-red-500/20 text-red-400">$625M (2022)</Badge></td>
                      </tr>
                      <tr className="border-b border-gray-700/50">
                        <td className="py-3">LayerZero</td>
                        <td className="py-3">~$2-5</td>
                        <td className="py-3">Oracle + Relayer</td>
                        <td className="py-3">2 entities</td>
                        <td className="py-3"><Badge className="bg-green-500/20 text-green-400">No</Badge></td>
                      </tr>
                      <tr className="border-b border-gray-700/50">
                        <td className="py-3">Multichain</td>
                        <td className="py-3">~$1</td>
                        <td className="py-3">Centralized MPC</td>
                        <td className="py-3">Centralized</td>
                        <td className="py-3"><Badge className="bg-red-500/20 text-red-400">$126M (2023)</Badge></td>
                      </tr>
                      <tr>
                        <td className="py-3">Across Protocol</td>
                        <td className="py-3">~$0.50-2</td>
                        <td className="py-3">Optimistic Verification</td>
                        <td className="py-3">Relayers</td>
                        <td className="py-3"><Badge className="bg-green-500/20 text-green-400">No</Badge></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-[#0f0f2a] rounded-lg p-6 border border-green-500/30">
                    <h3 className="text-lg font-semibold mb-4 text-green-400">What Trinity Does Better</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300"><strong>Multi-chain validators</strong> - Attackers must compromise 2 different blockchains</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300"><strong>Quantum-resistant backup</strong> - TON validator uses post-quantum cryptography</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300"><strong>Hardware security</strong> - Trinity Shield TEE enclaves for validator keys</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300"><strong>Formal verification</strong> - Smart contracts proven correct in Lean 4</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-[#0f0f2a] rounded-lg p-6 border border-yellow-500/30">
                    <h3 className="text-lg font-semibold mb-4 text-yellow-400">Trade-offs</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300"><strong>Higher minimum</strong> - 0.01 ETH vs some bridges at 0.001 ETH</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300"><strong>Slightly higher fee</strong> - $3 vs $1-2 (but you get 3x the validators)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300"><strong>Longer finality</strong> - ~15 seconds for 2/3 consensus vs instant</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-[#FF5AF7]/10 to-[#6B00D7]/10 rounded-lg p-6 border border-[#FF5AF7]/30">
                  <h3 className="text-lg font-semibold mb-2">The Bottom Line</h3>
                  <p className="text-gray-300">
                    Trinity Protocol is designed for <strong>security-conscious users</strong> who value 
                    their assets. Our $3 fee is an insurance premium that gives you 3 independent validators 
                    across 3 different blockchains, quantum-resistant backup, and hardware-secured execution. 
                    For high-value transfers, this peace of mind is worth far more than the small fee difference.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tutorial Tab */}
          <TabsContent value="tutorial" className="space-y-6">
            <Card className="bg-[#1a1a3a]/80 border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Wallet className="h-6 w-6 text-[#FF5AF7]" />
                  How to Connect & Swap
                </CardTitle>
                <CardDescription>
                  Step-by-step guide for developers and users
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <Card className="bg-[#0f0f2a] border-orange-500/30">
                    <CardContent className="p-4 text-center">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" className="w-12 h-12 mx-auto mb-2" />
                      <h4 className="font-semibold">MetaMask</h4>
                      <p className="text-sm text-gray-400">Ethereum & Arbitrum</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-[#0f0f2a] border-purple-500/30">
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 mx-auto mb-2 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <span className="text-2xl">👻</span>
                      </div>
                      <h4 className="font-semibold">Phantom</h4>
                      <p className="text-sm text-gray-400">Solana</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-[#0f0f2a] border-blue-500/30">
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 mx-auto mb-2 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <span className="text-2xl">💎</span>
                      </div>
                      <h4 className="font-semibold">TON Keeper</h4>
                      <p className="text-sm text-gray-400">TON Network</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Step 1: Connect Your Wallet</h3>
                  <div className="bg-[#0a0a1a] rounded-lg p-4 border border-gray-700 font-mono text-sm overflow-x-auto">
                    <pre className="text-gray-300">{`// For MetaMask (Arbitrum)
const connectMetaMask = async () => {
  if (typeof window.ethereum !== 'undefined') {
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });
    
    // Switch to Arbitrum Sepolia
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x66eee' }], // 421614
    });
    
    return accounts[0];
  }
};`}</pre>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Step 2: Initiate a Swap</h3>
                  <div className="bg-[#0a0a1a] rounded-lg p-4 border border-gray-700 font-mono text-sm overflow-x-auto">
                    <pre className="text-gray-300">{`// API Request to initiate HTLC swap
const initiateSwap = async () => {
  const response = await fetch('/api/htlc/swap/initiate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sourceChain: 'arbitrum',
      destinationChain: 'solana',
      amount: '0.01',  // Minimum 0.01 ETH
      recipientAddress: 'YOUR_SOLANA_ADDRESS',
      senderAddress: 'YOUR_ETH_ADDRESS'
    })
  });
  
  const result = await response.json();
  // result.transactionHash - View on Arbiscan
  // result.consensusStatus - 2/3 validators confirmed
  return result;
};`}</pre>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Step 3: Monitor Consensus</h3>
                  <div className="bg-[#0a0a1a] rounded-lg p-4 border border-gray-700 font-mono text-sm overflow-x-auto">
                    <pre className="text-gray-300">{`// Check swap status and consensus
const checkStatus = async (swapId) => {
  const response = await fetch(\`/api/htlc/swap/status/\${swapId}\`);
  const result = await response.json();
  
  console.log(result.consensusStatus);
  // {
  //   arbitrum: "signed",   // ✅ 1/3
  //   solana: "signed",     // ✅ 2/3 - Consensus reached!
  //   ton: "pending",       // Backup validator
  //   count: 2,
  //   required: 2
  // }
  
  return result;
};`}</pre>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-6 border border-green-500/30">
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                    Live Example Transaction
                  </h3>
                  <p className="text-gray-300 mb-4">
                    View a real HTLC swap on Arbitrum Sepolia:
                  </p>
                  <a 
                    href="https://sepolia.arbiscan.io/tx/0x19faaf91396d99a7f426307689a6c943c94098038763818ba568a0f22ff37521" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#FF5AF7] hover:underline"
                  >
                    0x19faaf91...ff37521 <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Smart Contracts Tab */}
          <TabsContent value="contracts" className="space-y-6">
            <Card className="bg-[#1a1a3a]/80 border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <FileCode className="h-6 w-6 text-[#FF5AF7]" />
                  Deployed Smart Contracts
                </CardTitle>
                <CardDescription>
                  All contracts deployed on Arbitrum Sepolia (Chain ID: 421614)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {[
                    { name: "HTLCChronosBridge", address: "0x82C3AbF6036cEE41E151A90FE00181f6b18af8ca", desc: "Main HTLC swap contract" },
                    { name: "TrinityConsensusVerifier", address: "0x59396D58Fa856025bD5249E342729d5550Be151C", desc: "2-of-3 consensus verification" },
                    { name: "TrinityShieldVerifier", address: "0x2971c0c3139F89808F87b2445e53E5Fb83b6A002", desc: "Hardware attestation verification" },
                    { name: "EmergencyMultiSig", address: "0x066A39Af76b625c1074aE96ce9A111532950Fc41", desc: "Emergency recovery multisig" },
                    { name: "TrinityKeeperRegistry", address: "0xAe9bd988011583D87d6bbc206C19e4a9Bda04830", desc: "Keeper node registry" },
                    { name: "TrinityGovernanceTimelock", address: "0xf6b9AB802b323f8Be35ca1C733e155D4BdcDb61b", desc: "Governance with 48h delay" },
                    { name: "CrossChainMessageRelay", address: "0xC6F4f855fc690CB52159eE3B13C9d9Fb8D403E59", desc: "Cross-chain messaging" },
                    { name: "ChronosVaultOptimized", address: "0xAE408eC592f0f865bA0012C480E8867e12B4F32D", desc: "ERC-4626 vault implementation" },
                  ].map((contract) => (
                    <div key={contract.address} className="bg-[#0f0f2a] rounded-lg p-4 border border-gray-700">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div>
                          <h4 className="font-semibold">{contract.name}</h4>
                          <p className="text-sm text-gray-400">{contract.desc}</p>
                        </div>
                        <a 
                          href={`https://sepolia.arbiscan.io/address/${contract.address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-sm text-[#FF5AF7] hover:underline flex items-center gap-1"
                        >
                          {contract.address.slice(0, 10)}...{contract.address.slice(-8)}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-[#0f0f2a] rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold mb-4">Validator Addresses</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span>Arbitrum Validator</span>
                      </div>
                      <code className="text-sm text-gray-400">0x3A92fD5b39Ec9598225DB5b9f15af0523445E3d8</code>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500" />
                        <span>Solana Validator</span>
                      </div>
                      <code className="text-sm text-gray-400">0x2554324ae222673F4C36D1Ae0E58C19fFFf69cd5</code>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-cyan-500" />
                        <span>TON Validator</span>
                      </div>
                      <code className="text-sm text-gray-400">0x9662e22D1f037C7EB370DD0463c597C6cd69B4c4</code>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-[#0f0f2a] rounded-lg p-4 border border-gray-700">
                    <h4 className="font-semibold mb-2">Solana Program</h4>
                    <code className="text-sm text-purple-400 break-all">
                      CYaDJYRqm35udQ8vkxoajSER8oaniQUcV8Vvw5BqJyo2
                    </code>
                    <p className="text-sm text-gray-400 mt-2">Deployed on Devnet</p>
                  </div>
                  <div className="bg-[#0f0f2a] rounded-lg p-4 border border-gray-700">
                    <h4 className="font-semibold mb-2">TON Contract</h4>
                    <code className="text-sm text-cyan-400 break-all">
                      EQeGlYzwupSROVWGucOmKyUDbSaKmPfIpHHP5mV73odL8
                    </code>
                    <p className="text-sm text-gray-400 mt-2">Deployed on Testnet</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-[#FF5AF7]/20 to-[#6B00D7]/20 border-[#FF5AF7]/30">
            <CardContent className="py-8">
              <h2 className="text-2xl font-bold mb-4">Ready to Try Trinity Protocol?</h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Experience the most secure cross-chain bridge with 2-of-3 multi-chain consensus. 
                Connect your wallet and make your first swap today.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/bridge">
                  <Button className="bg-gradient-to-r from-[#FF5AF7] to-[#6B00D7]" data-testid="button-start-swapping">
                    <Zap className="mr-2 h-4 w-4" /> Start Swapping
                  </Button>
                </Link>
                <Link href="/monitoring">
                  <Button variant="outline" className="border-gray-600" data-testid="button-view-scanner">
                    View Trinity Scan
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
