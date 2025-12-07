import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  ChevronLeft, 
  Download, 
  FileText, 
  Shield, 
  Cpu,
  Network,
  Layers,
  Lock,
  Globe,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Copy,
  BookOpen,
  Code2,
  Database,
  Server,
  Clock,
  Users,
  Activity,
  Atom,
  Binary,
  Fingerprint,
  Key,
  ShieldCheck,
  Target,
  TrendingUp,
  Verified
} from "lucide-react";
import { SiEthereum, SiSolana } from 'react-icons/si';

const TrinityProtocolPaper = () => {
  const [_, setLocation] = useLocation();
  const [selectedTab, setSelectedTab] = useState("abstract");
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(text);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const sections = [
    { id: "abstract", label: "Abstract", icon: BookOpen },
    { id: "problem", label: "Problem Statement", icon: AlertTriangle },
    { id: "architecture", label: "Architecture", icon: Layers },
    { id: "consensus", label: "2-of-3 Consensus", icon: Shield },
    { id: "mdl", label: "Mathematical Defense", icon: Binary },
    { id: "chains", label: "Multi-Chain", icon: Network },
    { id: "tee", label: "Trinity Shield TEE", icon: Cpu },
    { id: "htlc", label: "HTLC Atomic Swaps", icon: Zap },
    { id: "contracts", label: "Smart Contracts", icon: Code2 },
    { id: "security", label: "Security Analysis", icon: ShieldCheck },
    { id: "conclusion", label: "Conclusion", icon: Target }
  ];

  const deployedContracts = {
    arbitrum: [
      { name: "TrinityConsensusVerifier", address: "0x59396D58Fa856025bD5249E342729d5550Be151C" },
      { name: "TrinityShieldVerifier", address: "0x2971c0c3139F89808F87b2445e53E5Fb83b6A002" },
      { name: "TrinityShieldVerifierV2", address: "0xf111D291afdf8F0315306F3f652d66c5b061F4e3" },
      { name: "EmergencyMultiSig", address: "0x066A39Af76b625c1074aE96ce9A111532950Fc41" },
      { name: "TrinityKeeperRegistry", address: "0xAe9bd988011583D87d6bbc206C19e4a9Bda04830" },
      { name: "TrinityGovernanceTimelock", address: "0xf6b9AB802b323f8Be35ca1C733e155D4BdcDb61b" },
      { name: "CrossChainMessageRelay", address: "0xC6F4f855fc690CB52159eE3B13C9d9Fb8D403E59" },
      { name: "TrinityExitGateway", address: "0xE6FeBd695e4b5681DCF274fDB47d786523796C04" },
      { name: "TrinityFeeSplitter", address: "0x4F777c8c7D3Ea270c7c6D9Db8250ceBe1648A058" },
      { name: "TrinityRelayerCoordinator", address: "0x4023B7307BF9e1098e0c34F7E8653a435b20e635" },
      { name: "HTLCChronosBridge", address: "0xc0B9C6cfb6e39432977693d8f2EBd4F2B5f73824" },
      { name: "HTLCArbToL1", address: "0xaDDAC5670941416063551c996e169b0fa569B8e1" },
      { name: "ChronosVaultOptimized", address: "0xAE408eC592f0f865bA0012C480E8867e12B4F32D" },
      { name: "TestERC20", address: "0x4567853BE0d5780099E3542Df2e00C5B633E0161" }
    ],
    validators: [
      { chain: "Arbitrum (Chain ID 1)", address: "0x3A92fD5b39Ec9598225DB5b9f15af0523445E3d8" },
      { chain: "Solana (Chain ID 2)", address: "0x2554324ae222673F4C36D1Ae0E58C19fFFf69cd5" },
      { chain: "TON (Chain ID 3)", address: "0x9662e22D1f037C7EB370DD0463c597C6cd69B4c4" }
    ],
    solana: { programId: "CYaDJYRqm35udQ8vkxoajSER8oaniQUcV8Vvw5BqJyo2", wallet: "AjWeKXXgLpb2Cy3LfmqPjms3UkN1nAi596qBi8fRdLLQ" },
    ton: [
      { name: "TrinityConsensus", address: "EQeGlYzwupSROVWGucOmKyUDbSaKmPfIpHHP5mV73odL8" },
      { name: "ChronosVault", address: "EQjUVidQfn4m-Rougn0fol7ECCthba2HV0M6xz9zAfax4" },
      { name: "CrossChainBridge", address: "EQgWobA9D4u6Xem3B8e6Sde_NEFZYicyy7_5_XvOT18mA" }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Trinity Protocol Paper v3.5.20 | Multi-Chain Consensus Verification System</title>
        <meta 
          name="description" 
          content="Technical paper for Trinity Protocol - a mathematically provable 2-of-3 consensus verification system for enterprise-grade multi-chain security across Arbitrum, Solana, and TON." 
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-[#0A0612] via-[#0D0818] to-[#0A0612]">
        {/* Header */}
        <div className="border-b border-[#6B00D7]/20 bg-black/40 backdrop-blur-sm sticky top-16 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setLocation('/project-whitepaper')}
                  className="text-gray-400 hover:text-white"
                  data-testid="button-back-whitepaper"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Back to Whitepaper
                </Button>
                <Separator orientation="vertical" className="h-6 bg-[#6B00D7]/30" />
                <div>
                  <h1 className="text-xl md:text-2xl font-bold">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] via-[#FF5AF7] to-[#0098EA]">
                      Trinity Protocol™
                    </span>
                  </h1>
                  <p className="text-xs text-gray-400">Technical Paper v3.5.20 | December 2025</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-[#14F195] text-[#14F195]">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Production Ready
                </Badge>
                <Badge variant="outline" className="border-[#FF5AF7] text-[#FF5AF7]">
                  Testnet Deployed
                </Badge>
                <Button variant="outline" size="sm" className="border-[#6B00D7]/50 hover:bg-[#6B00D7]/20" data-testid="button-download-pdf">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <Card className="bg-black/40 border-[#6B00D7]/30 sticky top-40">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-400 uppercase tracking-wider">Contents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setSelectedTab(section.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all ${
                        selectedTab === section.id
                          ? 'bg-[#6B00D7]/20 text-[#FF5AF7] border-l-2 border-[#FF5AF7]'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                      data-testid={`nav-section-${section.id}`}
                    >
                      <section.icon className="w-4 h-4" />
                      <span className="text-sm">{section.label}</span>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
                {/* Abstract */}
                <TabsContent value="abstract" className="space-y-6 mt-0">
                  <Card className="bg-black/40 border-[#6B00D7]/30">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#6B00D7]/20">
                          <BookOpen className="w-6 h-6 text-[#FF5AF7]" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl">Abstract</CardTitle>
                          <CardDescription>Executive Summary of Trinity Protocol</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="prose prose-invert max-w-none">
                      <p className="text-gray-300 leading-relaxed text-lg">
                        <strong className="text-[#FF5AF7]">Trinity Protocol™</strong> is a mathematically provable 2-of-3 consensus verification system 
                        designed for enterprise-grade multi-chain security. By requiring independent validation from any 2 of 3 blockchain networks 
                        (Arbitrum Layer 2, Solana, and TON), the protocol eliminates single points of failure and provides cryptographically 
                        verifiable security guarantees.
                      </p>

                      <div className="my-8 p-6 rounded-xl bg-gradient-to-r from-[#6B00D7]/10 via-[#FF5AF7]/10 to-[#0098EA]/10 border border-[#6B00D7]/30">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                          <Verified className="w-5 h-5 text-[#14F195]" />
                          Core Innovation
                        </h3>
                        <p className="text-gray-300 m-0">
                          Unlike traditional multi-signature schemes that rely on trusted parties, Trinity Protocol leverages 
                          <strong className="text-white"> independent blockchain networks as validators</strong>. Each chain operates with 
                          different consensus mechanisms, validator sets, and security models—creating defense-in-depth that no single 
                          compromise can breach.
                        </p>
                      </div>

                      <h3 className="text-xl font-bold text-white mt-8 mb-4">Key Specifications</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-black/40 border border-[#6B00D7]/20">
                          <div className="text-[#FF5AF7] font-semibold mb-2">Consensus Model</div>
                          <div className="text-white text-lg">2-of-3 Multi-Chain</div>
                          <div className="text-gray-400 text-sm mt-1">Byzantine fault tolerant with n=3, f=1</div>
                        </div>
                        <div className="p-4 rounded-lg bg-black/40 border border-[#6B00D7]/20">
                          <div className="text-[#0098EA] font-semibold mb-2">Chains Supported</div>
                          <div className="text-white text-lg">Arbitrum, Solana, TON</div>
                          <div className="text-gray-400 text-sm mt-1">EVM, SVM, and TVM compatibility</div>
                        </div>
                        <div className="p-4 rounded-lg bg-black/40 border border-[#6B00D7]/20">
                          <div className="text-[#14F195] font-semibold mb-2">Security Layers</div>
                          <div className="text-white text-lg">8 Mathematical Defense Layers</div>
                          <div className="text-gray-400 text-sm mt-1">Including Trinity Shield™ TEE (Layer 8)</div>
                        </div>
                        <div className="p-4 rounded-lg bg-black/40 border border-[#6B00D7]/20">
                          <div className="text-[#FF5AF7] font-semibold mb-2">Quantum Resistance</div>
                          <div className="text-white text-lg">ML-KEM-1024 + Dilithium-5</div>
                          <div className="text-gray-400 text-sm mt-1">NIST FIPS 203/204 compliant</div>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-white mt-8 mb-4">Target Applications</h3>
                      <ul className="space-y-2 text-gray-300">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-[#14F195] mt-0.5 flex-shrink-0" />
                          <span><strong className="text-white">DeFi Protocols</strong> — Secure vault operations, liquidity management, and cross-chain settlements</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-[#14F195] mt-0.5 flex-shrink-0" />
                          <span><strong className="text-white">DAOs & Governance</strong> — Trustless multi-chain treasury management and voting</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-[#14F195] mt-0.5 flex-shrink-0" />
                          <span><strong className="text-white">Institutional Custody</strong> — Enterprise-grade asset protection with mathematical guarantees</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-[#14F195] mt-0.5 flex-shrink-0" />
                          <span><strong className="text-white">Cross-Chain Bridges</strong> — Trustless HTLC atomic swaps with consensus verification</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Problem Statement */}
                <TabsContent value="problem" className="space-y-6 mt-0">
                  <Card className="bg-black/40 border-[#6B00D7]/30">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-red-500/20">
                          <AlertTriangle className="w-6 h-6 text-red-400" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl">Problem Statement</CardTitle>
                          <CardDescription>Current Limitations in Blockchain Security</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="prose prose-invert max-w-none">
                      <h3 className="text-xl font-bold text-white mb-4">The Trust Problem</h3>
                      <p className="text-gray-300 leading-relaxed">
                        The blockchain industry faces a fundamental paradox: systems designed to be <em>trustless</em> still require users 
                        to <em>trust</em> security claims based on human audits, not mathematical proof. This introduces several critical vulnerabilities:
                      </p>

                      <div className="space-y-4 my-6">
                        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                          <h4 className="text-red-400 font-semibold mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Single Point of Failure
                          </h4>
                          <p className="text-gray-300 m-0">
                            Traditional multi-sig wallets rely on a single blockchain. If that chain is compromised, exploited, 
                            or experiences a consensus failure, all assets are at risk. The $600M+ in bridge hacks demonstrates this vulnerability.
                          </p>
                        </div>

                        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                          <h4 className="text-red-400 font-semibold mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Audit-Based Security
                          </h4>
                          <p className="text-gray-300 m-0">
                            Smart contract audits are point-in-time assessments by humans. They can miss edge cases, novel attack vectors, 
                            and don't provide ongoing guarantees. "Audited" doesn't mean "secure."
                          </p>
                        </div>

                        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                          <h4 className="text-red-400 font-semibold mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Centralized Bridge Operators
                          </h4>
                          <p className="text-gray-300 m-0">
                            Most cross-chain bridges rely on centralized relayers or small validator sets. This concentration of 
                            trust creates attractive targets for attackers and represents a regression from blockchain's decentralization ideals.
                          </p>
                        </div>

                        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                          <h4 className="text-red-400 font-semibold mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Quantum Threat Horizon
                          </h4>
                          <p className="text-gray-300 m-0">
                            Current cryptographic standards (secp256k1, Ed25519) are vulnerable to quantum attacks. NIST estimates 
                            cryptographically relevant quantum computers may arrive by 2030-2035, requiring migration to post-quantum algorithms.
                          </p>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-white mt-8 mb-4">Industry Statistics</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-lg bg-black/40 border border-red-500/30 text-center">
                          <div className="text-3xl font-bold text-red-400">$3.8B+</div>
                          <div className="text-gray-400 text-sm mt-1">Lost to DeFi exploits in 2022</div>
                        </div>
                        <div className="p-4 rounded-lg bg-black/40 border border-red-500/30 text-center">
                          <div className="text-3xl font-bold text-red-400">$1.7B</div>
                          <div className="text-gray-400 text-sm mt-1">Lost to bridge hacks alone</div>
                        </div>
                        <div className="p-4 rounded-lg bg-black/40 border border-red-500/30 text-center">
                          <div className="text-3xl font-bold text-red-400">82%</div>
                          <div className="text-gray-400 text-sm mt-1">Of hacked protocols were audited</div>
                        </div>
                      </div>

                      <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-[#6B00D7]/10 to-[#14F195]/10 border border-[#14F195]/30">
                        <h3 className="text-xl font-bold text-[#14F195] mb-3">Trinity Protocol's Solution</h3>
                        <p className="text-gray-300 m-0">
                          Trinity Protocol addresses these challenges by distributing trust across three independent blockchain networks, 
                          implementing 8 layers of mathematical defense, and providing cryptographically verifiable security guarantees 
                          that don't rely on human auditors or centralized operators.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Architecture */}
                <TabsContent value="architecture" className="space-y-6 mt-0">
                  <Card className="bg-black/40 border-[#6B00D7]/30">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#6B00D7]/20">
                          <Layers className="w-6 h-6 text-[#FF5AF7]" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl">System Architecture</CardTitle>
                          <CardDescription>Multi-Chain Consensus Verification Design</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="prose prose-invert max-w-none">
                      <h3 className="text-xl font-bold text-white mb-4">Architectural Overview</h3>
                      
                      {/* Architecture Diagram */}
                      <div className="my-6 p-6 rounded-xl bg-black/60 border border-[#6B00D7]/30">
                        <div className="text-center mb-6">
                          <div className="inline-block p-4 rounded-xl bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 border border-[#FF5AF7]/30">
                            <div className="text-lg font-bold text-white">Trinity Protocol Core</div>
                            <div className="text-sm text-gray-400">2-of-3 Consensus Engine</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div className="p-4 rounded-lg bg-[#6B00D7]/10 border border-[#6B00D7]/30">
                            <SiEthereum className="w-8 h-8 mx-auto text-[#627EEA] mb-2" />
                            <div className="font-semibold text-white">Arbitrum L2</div>
                            <div className="text-xs text-gray-400 mt-1">Primary Security</div>
                            <div className="text-xs text-[#6B00D7] mt-2">Intel SGX + secp256k1</div>
                          </div>
                          <div className="p-4 rounded-lg bg-[#14F195]/10 border border-[#14F195]/30">
                            <SiSolana className="w-8 h-8 mx-auto text-[#14F195] mb-2" />
                            <div className="font-semibold text-white">Solana</div>
                            <div className="text-xs text-gray-400 mt-1">High-Frequency Monitor</div>
                            <div className="text-xs text-[#14F195] mt-2">Intel SGX + Ed25519</div>
                          </div>
                          <div className="p-4 rounded-lg bg-[#0098EA]/10 border border-[#0098EA]/30">
                            <Globe className="w-8 h-8 mx-auto text-[#0098EA] mb-2" />
                            <div className="font-semibold text-white">TON</div>
                            <div className="text-xs text-gray-400 mt-1">Emergency Recovery</div>
                            <div className="text-xs text-[#0098EA] mt-2">AMD SEV + Dilithium-5</div>
                          </div>
                        </div>
                        
                        <div className="mt-6 text-center">
                          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#14F195]/10 border border-[#14F195]/30">
                            <CheckCircle2 className="w-4 h-4 text-[#14F195]" />
                            <span className="text-sm text-white">Any 2 chains must agree for operation approval</span>
                          </div>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-white mt-8 mb-4">Chain Responsibilities</h3>
                      <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-[#6B00D7]/10 border border-[#6B00D7]/30">
                          <div className="flex items-center gap-3 mb-2">
                            <SiEthereum className="w-5 h-5 text-[#627EEA]" />
                            <h4 className="font-bold text-white m-0">Arbitrum Layer 2 — Primary Security Chain</h4>
                          </div>
                          <ul className="text-gray-300 m-0 space-y-1">
                            <li>• Hosts core smart contracts (TrinityConsensusVerifier, ChronosVault)</li>
                            <li>• EVM compatibility for maximum tooling support</li>
                            <li>• Inherits Ethereum's security guarantees via optimistic rollups</li>
                            <li>• Intel SGX TEE with secp256k1 ECDSA signatures</li>
                          </ul>
                        </div>

                        <div className="p-4 rounded-lg bg-[#14F195]/10 border border-[#14F195]/30">
                          <div className="flex items-center gap-3 mb-2">
                            <SiSolana className="w-5 h-5 text-[#14F195]" />
                            <h4 className="font-bold text-white m-0">Solana — High-Frequency Monitor</h4>
                          </div>
                          <ul className="text-gray-300 m-0 space-y-1">
                            <li>• Sub-5 second SLA for monitoring operations</li>
                            <li>• Real-time proof submission with RPC failover</li>
                            <li>• Parallel transaction processing for throughput</li>
                            <li>• Intel SGX TEE with Ed25519 EdDSA signatures</li>
                          </ul>
                        </div>

                        <div className="p-4 rounded-lg bg-[#0098EA]/10 border border-[#0098EA]/30">
                          <div className="flex items-center gap-3 mb-2">
                            <Globe className="w-5 h-5 text-[#0098EA]" />
                            <h4 className="font-bold text-white m-0">TON — Emergency Recovery & Quantum-Safe Storage</h4>
                          </div>
                          <ul className="text-gray-300 m-0 space-y-1">
                            <li>• Quantum-resistant recovery procedures (ML-KEM-1024, Dilithium-5)</li>
                            <li>• 3-of-3 validator approval for emergency operations</li>
                            <li>• 48-hour delay for quantum-recovery operations</li>
                            <li>• AMD SEV-SNP TEE for highest isolation guarantee</li>
                          </ul>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-white mt-8 mb-4">Component Layers</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-[#6B00D7]/30">
                              <th className="text-left py-3 text-[#FF5AF7]">Layer</th>
                              <th className="text-left py-3 text-[#FF5AF7]">Component</th>
                              <th className="text-left py-3 text-[#FF5AF7]">Function</th>
                            </tr>
                          </thead>
                          <tbody className="text-gray-300">
                            <tr className="border-b border-[#6B00D7]/10">
                              <td className="py-3">Application</td>
                              <td>ChronosVault, HTLC Bridge</td>
                              <td>User-facing vault and swap operations</td>
                            </tr>
                            <tr className="border-b border-[#6B00D7]/10">
                              <td className="py-3">Consensus</td>
                              <td>TrinityConsensusVerifier</td>
                              <td>2-of-3 multi-chain proof verification</td>
                            </tr>
                            <tr className="border-b border-[#6B00D7]/10">
                              <td className="py-3">Security</td>
                              <td>TrinityShieldVerifier</td>
                              <td>TEE attestation and enclave verification</td>
                            </tr>
                            <tr className="border-b border-[#6B00D7]/10">
                              <td className="py-3">Coordination</td>
                              <td>RelayerCoordinator</td>
                              <td>Cross-chain message routing and nonce management</td>
                            </tr>
                            <tr className="border-b border-[#6B00D7]/10">
                              <td className="py-3">Infrastructure</td>
                              <td>KeeperRegistry, Timelock</td>
                              <td>Automation, governance, and access control</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* 2-of-3 Consensus */}
                <TabsContent value="consensus" className="space-y-6 mt-0">
                  <Card className="bg-black/40 border-[#6B00D7]/30">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#14F195]/20">
                          <Shield className="w-6 h-6 text-[#14F195]" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl">2-of-3 Consensus Mechanism</CardTitle>
                          <CardDescription>Byzantine Fault Tolerant Multi-Chain Verification</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="prose prose-invert max-w-none">
                      <h3 className="text-xl font-bold text-white mb-4">Consensus Model</h3>
                      <p className="text-gray-300 leading-relaxed">
                        Trinity Protocol implements a <strong className="text-white">2-of-3 threshold consensus</strong> where 
                        operations require cryptographic approval from any two of the three participating blockchain networks. 
                        This provides Byzantine fault tolerance with parameters <code>n=3, f=1</code>.
                      </p>

                      <div className="my-6 p-6 rounded-xl bg-gradient-to-r from-[#6B00D7]/10 to-[#14F195]/10 border border-[#6B00D7]/30">
                        <h4 className="text-lg font-bold text-white mb-3">Mathematical Guarantee</h4>
                        <div className="font-mono text-sm bg-black/40 p-4 rounded-lg text-[#14F195]">
                          <div>∀ operation O:</div>
                          <div className="ml-4">execute(O) ⟹ ∃ chains C₁, C₂ ∈ {'{'}Arbitrum, Solana, TON{'}'}:</div>
                          <div className="ml-8">verify(O, C₁) ∧ verify(O, C₂) ∧ C₁ ≠ C₂</div>
                        </div>
                        <p className="text-gray-400 text-sm mt-3 m-0">
                          Every operation requires independent verification from two distinct blockchain networks before execution.
                        </p>
                      </div>

                      <h3 className="text-xl font-bold text-white mt-8 mb-4">Verification Flow</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-4 p-4 rounded-lg bg-black/40 border border-[#6B00D7]/20">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#6B00D7] flex items-center justify-center text-white font-bold">1</div>
                          <div>
                            <h4 className="text-white font-semibold m-0">Operation Initiation</h4>
                            <p className="text-gray-400 m-0 mt-1">User submits operation request to primary chain (Arbitrum)</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 rounded-lg bg-black/40 border border-[#6B00D7]/20">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#6B00D7] flex items-center justify-center text-white font-bold">2</div>
                          <div>
                            <h4 className="text-white font-semibold m-0">Cross-Chain Broadcast</h4>
                            <p className="text-gray-400 m-0 mt-1">RelayerCoordinator broadcasts operation hash to Solana and TON</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 rounded-lg bg-black/40 border border-[#6B00D7]/20">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#6B00D7] flex items-center justify-center text-white font-bold">3</div>
                          <div>
                            <h4 className="text-white font-semibold m-0">Independent Validation</h4>
                            <p className="text-gray-400 m-0 mt-1">Each chain's validator verifies operation within TEE enclave</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 rounded-lg bg-black/40 border border-[#6B00D7]/20">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#6B00D7] flex items-center justify-center text-white font-bold">4</div>
                          <div>
                            <h4 className="text-white font-semibold m-0">Proof Submission</h4>
                            <p className="text-gray-400 m-0 mt-1">Validators submit signed attestations back to TrinityConsensusVerifier</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 rounded-lg bg-[#14F195]/10 border border-[#14F195]/30">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#14F195] flex items-center justify-center text-black font-bold">5</div>
                          <div>
                            <h4 className="text-white font-semibold m-0">Consensus Achieved</h4>
                            <p className="text-gray-400 m-0 mt-1">With 2+ valid proofs, operation executes automatically</p>
                          </div>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-white mt-8 mb-4">Fault Tolerance Analysis</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-[#6B00D7]/30">
                              <th className="text-left py-3 text-[#FF5AF7]">Scenario</th>
                              <th className="text-left py-3 text-[#FF5AF7]">System Status</th>
                              <th className="text-left py-3 text-[#FF5AF7]">Result</th>
                            </tr>
                          </thead>
                          <tbody className="text-gray-300">
                            <tr className="border-b border-[#6B00D7]/10">
                              <td className="py-3">All 3 chains operational</td>
                              <td className="py-3"><Badge className="bg-[#14F195]/20 text-[#14F195]">Optimal</Badge></td>
                              <td className="py-3">Full consensus, fastest execution</td>
                            </tr>
                            <tr className="border-b border-[#6B00D7]/10">
                              <td className="py-3">1 chain down/compromised</td>
                              <td className="py-3"><Badge className="bg-yellow-500/20 text-yellow-400">Degraded</Badge></td>
                              <td className="py-3">System continues with 2-of-2</td>
                            </tr>
                            <tr className="border-b border-[#6B00D7]/10">
                              <td className="py-3">2 chains down/compromised</td>
                              <td className="py-3"><Badge className="bg-red-500/20 text-red-400">Halted</Badge></td>
                              <td className="py-3">Operations paused, funds safe</td>
                            </tr>
                            <tr className="border-b border-[#6B00D7]/10">
                              <td className="py-3">1 chain submits false proof</td>
                              <td className="py-3"><Badge className="bg-[#14F195]/20 text-[#14F195]">Protected</Badge></td>
                              <td className="py-3">Rejected—needs 2 valid proofs</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <h3 className="text-xl font-bold text-white mt-8 mb-4">On-Chain Validators</h3>
                      <div className="space-y-2">
                        {deployedContracts.validators.map((v, i) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-[#6B00D7]/20">
                            <span className="text-gray-300">{v.chain}</span>
                            <div className="flex items-center gap-2">
                              <code className="text-xs text-[#FF5AF7] bg-black/40 px-2 py-1 rounded">{v.address}</code>
                              <button 
                                onClick={() => copyToClipboard(v.address)}
                                className="p-1 hover:bg-white/10 rounded transition-colors"
                                data-testid={`button-copy-validator-${i}`}
                              >
                                <Copy className={`w-4 h-4 ${copiedAddress === v.address ? 'text-[#14F195]' : 'text-gray-400'}`} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Mathematical Defense Layer */}
                <TabsContent value="mdl" className="space-y-6 mt-0">
                  <Card className="bg-black/40 border-[#6B00D7]/30">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#FF5AF7]/20">
                          <Binary className="w-6 h-6 text-[#FF5AF7]" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl">Mathematical Defense Layer (MDL)</CardTitle>
                          <CardDescription>8 Cryptographic Security Layers</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="prose prose-invert max-w-none">
                      <p className="text-gray-300 leading-relaxed">
                        The Mathematical Defense Layer is our revolutionary security architecture where 
                        <strong className="text-[#FF5AF7]"> every security claim is mathematically provable</strong>. 
                        Unlike traditional platforms relying on audits, MDL provides cryptographic evidence 
                        that can be independently verified.
                      </p>

                      <div className="space-y-4 my-6">
                        {[
                          {
                            layer: 1,
                            name: "Zero-Knowledge Proof Engine",
                            tech: "Groth16 with SnarkJS/Circom",
                            color: "#6B00D7",
                            description: "Privacy-preserving verification where verifier learns nothing beyond validity",
                            guarantee: "∀ proof P: verified(P) ⟹ verifier_learns_nothing"
                          },
                          {
                            layer: 2,
                            name: "Formal Verification Pipeline",
                            tech: "Lean 4, Symbolic Execution, SMT Solving",
                            color: "#FF5AF7",
                            description: "Mathematical proof that no exploit paths exist in verified contracts",
                            guarantee: "∀ contract C: proven_secure(C) ⟹ ¬∃ exploit_path(C)"
                          },
                          {
                            layer: 3,
                            name: "Multi-Party Computation",
                            tech: "Shamir Secret Sharing + CRYSTALS-Kyber",
                            color: "#0098EA",
                            description: "3-of-5 threshold signatures with quantum-safe key encryption",
                            guarantee: "reconstruct(K) requires ≥ 3 threshold shares"
                          },
                          {
                            layer: 4,
                            name: "Verifiable Delay Functions",
                            tech: "Wesolowski VDF with RSA-2048",
                            color: "#14F195",
                            description: "Mathematically guaranteed time-locks that cannot be accelerated",
                            guarantee: "unlock_before_T_iterations = impossible"
                          },
                          {
                            layer: 5,
                            name: "AI + Cryptographic Governance",
                            tech: "Multi-layer validation pipeline",
                            color: "#6B00D7",
                            description: "AI proposals validated through ZK proofs → Formal verification → MPC → VDF → Consensus",
                            guarantee: "executed(P) ⟹ mathematically_proven(P) ∧ consensus(P, 2/3)"
                          },
                          {
                            layer: 6,
                            name: "Quantum-Resistant Cryptography",
                            tech: "ML-KEM-1024, CRYSTALS-Dilithium-5",
                            color: "#FF5AF7",
                            description: "NIST FIPS 203/204 compliant post-quantum algorithms",
                            guarantee: "secure_against_quantum(Shor, Grover)"
                          },
                          {
                            layer: 7,
                            name: "Trinity Protocol Consensus",
                            tech: "2-of-3 Multi-Chain BFT",
                            color: "#0098EA",
                            description: "Byzantine fault tolerant verification across independent blockchains",
                            guarantee: "execute(O) ⟹ verify(O, C₁) ∧ verify(O, C₂)"
                          },
                          {
                            layer: 8,
                            name: "Trinity Shield™ TEE",
                            tech: "Intel SGX / AMD SEV-SNP",
                            color: "#14F195",
                            description: "Hardware-isolated execution with remote attestation verification",
                            guarantee: "signing_keys ∉ accessible_memory"
                          }
                        ].map((layer) => (
                          <div 
                            key={layer.layer} 
                            className="p-4 rounded-lg border"
                            style={{ 
                              backgroundColor: `${layer.color}10`,
                              borderColor: `${layer.color}30`
                            }}
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <div 
                                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white"
                                style={{ backgroundColor: layer.color }}
                              >
                                {layer.layer}
                              </div>
                              <div>
                                <h4 className="font-bold text-white m-0">{layer.name}</h4>
                                <div className="text-xs" style={{ color: layer.color }}>{layer.tech}</div>
                              </div>
                            </div>
                            <p className="text-gray-300 text-sm m-0 mb-2">{layer.description}</p>
                            <code className="text-xs bg-black/40 px-2 py-1 rounded block" style={{ color: layer.color }}>
                              {layer.guarantee}
                            </code>
                          </div>
                        ))}
                      </div>

                      <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-[#6B00D7]/10 to-[#FF5AF7]/10 border border-[#FF5AF7]/30">
                        <h3 className="text-xl font-bold text-white mb-3">Tagline</h3>
                        <p className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] via-[#FF5AF7] to-[#0098EA] m-0">
                          "Mathematically Proven. Hardware Protected."
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Multi-Chain Integration */}
                <TabsContent value="chains" className="space-y-6 mt-0">
                  <Card className="bg-black/40 border-[#6B00D7]/30">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#0098EA]/20">
                          <Network className="w-6 h-6 text-[#0098EA]" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl">Multi-Chain Integration</CardTitle>
                          <CardDescription>Deployment Status Across Three Networks</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="prose prose-invert max-w-none">
                      <h3 className="text-xl font-bold text-white mb-4">Arbitrum Sepolia (Chain ID: 421614)</h3>
                      <Badge className="bg-[#14F195]/20 text-[#14F195] mb-4">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        DEPLOYED
                      </Badge>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-[#6B00D7]/30">
                              <th className="text-left py-3 text-[#FF5AF7]">Contract</th>
                              <th className="text-left py-3 text-[#FF5AF7]">Address</th>
                            </tr>
                          </thead>
                          <tbody className="text-gray-300">
                            {deployedContracts.arbitrum.map((contract, i) => (
                              <tr key={i} className="border-b border-[#6B00D7]/10">
                                <td className="py-3 text-white">{contract.name}</td>
                                <td className="py-3">
                                  <div className="flex items-center gap-2">
                                    <code className="text-xs text-[#FF5AF7]">{contract.address}</code>
                                    <button 
                                      onClick={() => copyToClipboard(contract.address)}
                                      className="p-1 hover:bg-white/10 rounded transition-colors"
                                      data-testid={`button-copy-contract-${i}`}
                                    >
                                      <Copy className={`w-3 h-3 ${copiedAddress === contract.address ? 'text-[#14F195]' : 'text-gray-400'}`} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <h3 className="text-xl font-bold text-white mt-8 mb-4">Solana Devnet</h3>
                      <Badge className="bg-[#14F195]/20 text-[#14F195] mb-4">
                        <Activity className="w-3 h-3 mr-1" />
                        ACTIVE (MONITOR Role)
                      </Badge>
                      
                      <div className="p-4 rounded-lg bg-[#14F195]/10 border border-[#14F195]/30">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="text-gray-400 text-sm">Program ID</div>
                            <code className="text-xs text-[#14F195] break-all">{deployedContracts.solana.programId}</code>
                          </div>
                          <div>
                            <div className="text-gray-400 text-sm">Deployment Wallet</div>
                            <code className="text-xs text-[#14F195] break-all">{deployedContracts.solana.wallet}</code>
                          </div>
                        </div>
                        <div className="mt-4 text-gray-300 text-sm">
                          <strong className="text-white">Features:</strong> High-frequency monitoring (&lt;5s SLA), RPC failover, Trinity consensus proof submission
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-white mt-8 mb-4">TON Testnet</h3>
                      <Badge className="bg-[#14F195]/20 text-[#14F195] mb-4">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        DEPLOYED
                      </Badge>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-[#6B00D7]/30">
                              <th className="text-left py-3 text-[#FF5AF7]">Contract</th>
                              <th className="text-left py-3 text-[#FF5AF7]">Address</th>
                            </tr>
                          </thead>
                          <tbody className="text-gray-300">
                            {deployedContracts.ton.map((contract, i) => (
                              <tr key={i} className="border-b border-[#6B00D7]/10">
                                <td className="py-3 text-white">{contract.name}</td>
                                <td className="py-3">
                                  <code className="text-xs text-[#0098EA]">{contract.address}</code>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="mt-4 text-gray-300 text-sm">
                        <strong className="text-white">Features:</strong> Quantum-resistant recovery (ML-KEM-1024, CRYSTALS-Dilithium-5), 3-of-3 validator approval, 48-hour delay
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Trinity Shield TEE */}
                <TabsContent value="tee" className="space-y-6 mt-0">
                  <Card className="bg-black/40 border-[#6B00D7]/30">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#14F195]/20">
                          <Cpu className="w-6 h-6 text-[#14F195]" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl">Trinity Shield™ TEE (Layer 8)</CardTitle>
                          <CardDescription>Hardware-Isolated Trusted Execution Environment</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="prose prose-invert max-w-none">
                      <p className="text-gray-300 leading-relaxed">
                        Trinity Shield™ is our custom in-house TEE solution providing 
                        <strong className="text-[#14F195]"> hardware-isolated execution</strong> for multi-chain validators. 
                        Validator signing keys never leave the secure enclave, ensuring protection even if the host system is compromised.
                      </p>

                      <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-[#6B00D7]/10 border border-[#6B00D7]/30">
                          <div className="flex items-center gap-2 mb-3">
                            <Cpu className="w-5 h-5 text-[#6B00D7]" />
                            <h4 className="font-bold text-white m-0">Intel SGX</h4>
                          </div>
                          <ul className="text-gray-300 text-sm space-y-1 m-0">
                            <li>• Arbitrum and Solana validators</li>
                            <li>• secp256k1 ECDSA (Arbitrum)</li>
                            <li>• Ed25519 EdDSA (Solana)</li>
                            <li>• Intel Xeon E-2300+ required</li>
                          </ul>
                        </div>
                        
                        <div className="p-4 rounded-lg bg-[#0098EA]/10 border border-[#0098EA]/30">
                          <div className="flex items-center gap-2 mb-3">
                            <Server className="w-5 h-5 text-[#0098EA]" />
                            <h4 className="font-bold text-white m-0">AMD SEV-SNP</h4>
                          </div>
                          <ul className="text-gray-300 text-sm space-y-1 m-0">
                            <li>• TON validator (highest isolation)</li>
                            <li>• CRYSTALS-Dilithium-5 signatures</li>
                            <li>• ML-KEM-1024 key encapsulation</li>
                            <li>• AMD EPYC 7003+ required</li>
                          </ul>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-white mt-8 mb-4">Security Properties</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-black/40 border border-[#6B00D7]/20">
                          <Key className="w-5 h-5 text-[#FF5AF7] mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="text-white font-semibold m-0">Hardware Key Isolation</h4>
                            <p className="text-gray-400 text-sm m-0">Validator signing keys generated and stored within enclave memory, never accessible to host OS</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-black/40 border border-[#6B00D7]/20">
                          <Fingerprint className="w-5 h-5 text-[#14F195] mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="text-white font-semibold m-0">Remote Attestation</h4>
                            <p className="text-gray-400 text-sm m-0">On-chain verification via TrinityShieldVerifier contract confirms enclave authenticity</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-black/40 border border-[#6B00D7]/20">
                          <Code2 className="w-5 h-5 text-[#0098EA] mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="text-white font-semibold m-0">Lean Proof Integration</h4>
                            <p className="text-gray-400 text-sm m-0">Enclave code matches formally verified Lean 4 specifications</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-black/40 border border-[#6B00D7]/20">
                          <Atom className="w-5 h-5 text-[#FF5AF7] mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="text-white font-semibold m-0">Quantum-Resistant TON Enclave</h4>
                            <p className="text-gray-400 text-sm m-0">Post-quantum cryptography (ML-KEM-1024, Dilithium-5) for future-proof security</p>
                          </div>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-white mt-8 mb-4">Attestation Verification</h3>
                      <div className="bg-black/60 rounded-lg p-4 overflow-x-auto">
                        <pre className="text-sm text-gray-300 m-0">
{`// TrinityShieldVerifierV2.sol
function verifyAttestation(
    bytes calldata quote,
    bytes32 expectedMrEnclave,
    bytes32 expectedMrSigner
) external view returns (bool) {
    // Verify SGX/SEV quote signature
    require(verifyQuoteSignature(quote), "Invalid quote");
    
    // Extract and verify enclave measurements
    (bytes32 mrEnclave, bytes32 mrSigner) = extractMeasurements(quote);
    require(mrEnclave == expectedMrEnclave, "MRENCLAVE mismatch");
    require(mrSigner == expectedMrSigner, "MRSIGNER mismatch");
    
    // Verify against registered validator
    require(registeredEnclaves[mrEnclave], "Enclave not registered");
    
    return true;
}`}
                        </pre>
                      </div>

                      <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-[#14F195]/10 to-[#0098EA]/10 border border-[#14F195]/30">
                        <h3 className="text-xl font-bold text-[#14F195] mb-3">Validator Onboarding</h3>
                        <p className="text-gray-300 m-0">
                          Community operators can become Trinity validators through the onboarding system at 
                          <code className="mx-2 text-[#FF5AF7]">/validator-onboarding</code>. The workflow includes:
                          hardware verification, TEE attestation generation, and on-chain registration.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* HTLC Atomic Swaps */}
                <TabsContent value="htlc" className="space-y-6 mt-0">
                  <Card className="bg-black/40 border-[#6B00D7]/30">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#FF5AF7]/20">
                          <Zap className="w-6 h-6 text-[#FF5AF7]" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl">HTLC Atomic Swaps</CardTitle>
                          <CardDescription>Trustless Cross-Chain Asset Exchange</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="prose prose-invert max-w-none">
                      <p className="text-gray-300 leading-relaxed">
                        Trinity Protocol enables <strong className="text-[#FF5AF7]">trustless Hash Time-Locked Contract (HTLC) atomic swaps</strong> 
                        where swaps are registered on the Arbitrum contract and require 2-of-3 consensus from validators on all three chains.
                      </p>

                      <h3 className="text-xl font-bold text-white mt-6 mb-4">HTLC Properties</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                        <div className="p-4 rounded-lg bg-black/40 border border-[#6B00D7]/20">
                          <Lock className="w-6 h-6 text-[#6B00D7] mb-2" />
                          <h4 className="text-white font-semibold m-0">Hash Lock</h4>
                          <p className="text-gray-400 text-sm m-0 mt-2">
                            Funds locked by cryptographic hash. Recipient must provide preimage to claim.
                          </p>
                        </div>
                        <div className="p-4 rounded-lg bg-black/40 border border-[#6B00D7]/20">
                          <Clock className="w-6 h-6 text-[#FF5AF7] mb-2" />
                          <h4 className="text-white font-semibold m-0">Time Lock</h4>
                          <p className="text-gray-400 text-sm m-0 mt-2">
                            Automatic refund if swap not completed within timeout period.
                          </p>
                        </div>
                        <div className="p-4 rounded-lg bg-black/40 border border-[#6B00D7]/20">
                          <Shield className="w-6 h-6 text-[#14F195] mb-2" />
                          <h4 className="text-white font-semibold m-0">Consensus Verification</h4>
                          <p className="text-gray-400 text-sm m-0 mt-2">
                            2-of-3 Trinity validators must confirm swap validity before execution.
                          </p>
                        </div>
                        <div className="p-4 rounded-lg bg-black/40 border border-[#6B00D7]/20">
                          <Atom className="w-6 h-6 text-[#0098EA] mb-2" />
                          <h4 className="text-white font-semibold m-0">Atomicity</h4>
                          <p className="text-gray-400 text-sm m-0 mt-2">
                            Either both legs complete successfully, or both are refunded. No partial execution.
                          </p>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-white mt-8 mb-4">Swap Flow</h3>
                      <div className="bg-black/60 rounded-lg p-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#6B00D7] flex items-center justify-center text-white font-bold">1</div>
                            <div className="flex-1 p-3 rounded bg-[#6B00D7]/10 border border-[#6B00D7]/30">
                              <span className="text-white">Alice creates HTLC on Chain A with hash(secret)</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#FF5AF7] flex items-center justify-center text-white font-bold">2</div>
                            <div className="flex-1 p-3 rounded bg-[#FF5AF7]/10 border border-[#FF5AF7]/30">
                              <span className="text-white">Bob creates matching HTLC on Chain B with same hash</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#14F195] flex items-center justify-center text-black font-bold">3</div>
                            <div className="flex-1 p-3 rounded bg-[#14F195]/10 border border-[#14F195]/30">
                              <span className="text-white">Trinity validators verify both HTLCs (2-of-3 consensus)</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#0098EA] flex items-center justify-center text-white font-bold">4</div>
                            <div className="flex-1 p-3 rounded bg-[#0098EA]/10 border border-[#0098EA]/30">
                              <span className="text-white">Alice reveals secret to claim on Chain B</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#6B00D7] flex items-center justify-center text-white font-bold">5</div>
                            <div className="flex-1 p-3 rounded bg-[#6B00D7]/10 border border-[#6B00D7]/30">
                              <span className="text-white">Bob uses revealed secret to claim on Chain A</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-white mt-8 mb-4">Contract Interface</h3>
                      <div className="bg-black/60 rounded-lg p-4 overflow-x-auto">
                        <pre className="text-sm text-gray-300 m-0">
{`// HTLCChronosBridge.sol
struct Swap {
    address initiator;
    address recipient;
    address token;
    uint256 amount;
    bytes32 hashLock;
    uint256 timelock;
    uint8 sourceChain;
    uint8 destChain;
    SwapStatus status;
}

function createSwap(
    address recipient,
    address token,
    uint256 amount,
    bytes32 hashLock,
    uint256 timelock,
    uint8 destChain
) external returns (bytes32 swapId);

function completeSwap(
    bytes32 swapId,
    bytes32 preimage,
    bytes[] calldata trinityProofs
) external;

function refundSwap(bytes32 swapId) external;`}
                        </pre>
                      </div>

                      <div className="mt-8 p-4 rounded-lg bg-[#14F195]/10 border border-[#14F195]/30">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="w-5 h-5 text-[#14F195]" />
                          <span className="text-white font-semibold">Deployed Contract</span>
                        </div>
                        <code className="text-sm text-[#14F195]">HTLCChronosBridge: 0xc0B9C6cfb6e39432977693d8f2EBd4F2B5f73824</code>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Smart Contracts */}
                <TabsContent value="contracts" className="space-y-6 mt-0">
                  <Card className="bg-black/40 border-[#6B00D7]/30">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#6B00D7]/20">
                          <Code2 className="w-6 h-6 text-[#6B00D7]" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl">Smart Contract Architecture</CardTitle>
                          <CardDescription>Core Protocol Contracts</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="prose prose-invert max-w-none">
                      <h3 className="text-xl font-bold text-white mb-4">Contract Categories</h3>
                      
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-lg font-semibold text-[#FF5AF7] mb-3">Consensus Layer</h4>
                          <div className="space-y-2">
                            <div className="p-3 rounded-lg bg-black/40 border border-[#6B00D7]/20">
                              <div className="flex items-center justify-between">
                                <span className="text-white font-medium">TrinityConsensusVerifier</span>
                                <Badge variant="outline" className="border-[#14F195] text-[#14F195]">Core</Badge>
                              </div>
                              <p className="text-gray-400 text-sm m-0 mt-1">
                                Verifies 2-of-3 consensus proofs from multi-chain validators
                              </p>
                            </div>
                            <div className="p-3 rounded-lg bg-black/40 border border-[#6B00D7]/20">
                              <div className="flex items-center justify-between">
                                <span className="text-white font-medium">TrinityShieldVerifierV2</span>
                                <Badge variant="outline" className="border-[#14F195] text-[#14F195]">Core</Badge>
                              </div>
                              <p className="text-gray-400 text-sm m-0 mt-1">
                                TEE attestation verification with enclave measurement validation
                              </p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-[#0098EA] mb-3">Vault Layer</h4>
                          <div className="space-y-2">
                            <div className="p-3 rounded-lg bg-black/40 border border-[#6B00D7]/20">
                              <div className="flex items-center justify-between">
                                <span className="text-white font-medium">ChronosVaultOptimized</span>
                                <Badge variant="outline" className="border-[#FF5AF7] text-[#FF5AF7]">ERC-4626</Badge>
                              </div>
                              <p className="text-gray-400 text-sm m-0 mt-1">
                                Investment vault with 2-of-3 consensus for all operations
                              </p>
                            </div>
                            <div className="p-3 rounded-lg bg-black/40 border border-[#6B00D7]/20">
                              <div className="flex items-center justify-between">
                                <span className="text-white font-medium">HTLCChronosBridge</span>
                                <Badge variant="outline" className="border-[#0098EA] text-[#0098EA]">Bridge</Badge>
                              </div>
                              <p className="text-gray-400 text-sm m-0 mt-1">
                                HTLC atomic swaps with Trinity consensus verification
                              </p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-[#14F195] mb-3">Infrastructure Layer</h4>
                          <div className="space-y-2">
                            <div className="p-3 rounded-lg bg-black/40 border border-[#6B00D7]/20">
                              <span className="text-white font-medium">TrinityKeeperRegistry</span>
                              <p className="text-gray-400 text-sm m-0 mt-1">Automation and keeper management</p>
                            </div>
                            <div className="p-3 rounded-lg bg-black/40 border border-[#6B00D7]/20">
                              <span className="text-white font-medium">TrinityGovernanceTimelock</span>
                              <p className="text-gray-400 text-sm m-0 mt-1">Governance proposals with time-delayed execution</p>
                            </div>
                            <div className="p-3 rounded-lg bg-black/40 border border-[#6B00D7]/20">
                              <span className="text-white font-medium">CrossChainMessageRelay</span>
                              <p className="text-gray-400 text-sm m-0 mt-1">Message routing between chains</p>
                            </div>
                            <div className="p-3 rounded-lg bg-black/40 border border-[#6B00D7]/20">
                              <span className="text-white font-medium">TrinityRelayerCoordinator</span>
                              <p className="text-gray-400 text-sm m-0 mt-1">Relayer registration and nonce management</p>
                            </div>
                            <div className="p-3 rounded-lg bg-black/40 border border-[#6B00D7]/20">
                              <span className="text-white font-medium">TrinityFeeSplitter</span>
                              <p className="text-gray-400 text-sm m-0 mt-1">Centralized fee distribution</p>
                            </div>
                            <div className="p-3 rounded-lg bg-black/40 border border-[#6B00D7]/20">
                              <span className="text-white font-medium">TrinityExitGateway</span>
                              <p className="text-gray-400 text-sm m-0 mt-1">Withdrawal processing and exit management</p>
                            </div>
                            <div className="p-3 rounded-lg bg-black/40 border border-[#6B00D7]/20">
                              <span className="text-white font-medium">EmergencyMultiSig</span>
                              <p className="text-gray-400 text-sm m-0 mt-1">Emergency operations with multi-signature control</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-white mt-8 mb-4">Security Features</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-black/40 border border-[#6B00D7]/20">
                          <CheckCircle2 className="w-5 h-5 text-[#14F195] mb-2" />
                          <h4 className="text-white font-semibold m-0">ReentrancyGuard</h4>
                          <p className="text-gray-400 text-sm m-0">All state-changing functions protected</p>
                        </div>
                        <div className="p-4 rounded-lg bg-black/40 border border-[#6B00D7]/20">
                          <CheckCircle2 className="w-5 h-5 text-[#14F195] mb-2" />
                          <h4 className="text-white font-semibold m-0">Pausable</h4>
                          <p className="text-gray-400 text-sm m-0">Emergency pause capability</p>
                        </div>
                        <div className="p-4 rounded-lg bg-black/40 border border-[#6B00D7]/20">
                          <CheckCircle2 className="w-5 h-5 text-[#14F195] mb-2" />
                          <h4 className="text-white font-semibold m-0">AccessControl</h4>
                          <p className="text-gray-400 text-sm m-0">Role-based permissions with timelock</p>
                        </div>
                        <div className="p-4 rounded-lg bg-black/40 border border-[#6B00D7]/20">
                          <CheckCircle2 className="w-5 h-5 text-[#14F195] mb-2" />
                          <h4 className="text-white font-semibold m-0">OpenZeppelin v5</h4>
                          <p className="text-gray-400 text-sm m-0">Industry-standard base contracts</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Security Analysis */}
                <TabsContent value="security" className="space-y-6 mt-0">
                  <Card className="bg-black/40 border-[#6B00D7]/30">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#14F195]/20">
                          <ShieldCheck className="w-6 h-6 text-[#14F195]" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl">Security Analysis</CardTitle>
                          <CardDescription>Threat Model and Mitigations</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="prose prose-invert max-w-none">
                      <h3 className="text-xl font-bold text-white mb-4">Threat Model</h3>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-[#6B00D7]/30">
                              <th className="text-left py-3 text-[#FF5AF7]">Threat</th>
                              <th className="text-left py-3 text-[#FF5AF7]">Risk Level</th>
                              <th className="text-left py-3 text-[#FF5AF7]">Mitigation</th>
                            </tr>
                          </thead>
                          <tbody className="text-gray-300">
                            <tr className="border-b border-[#6B00D7]/10">
                              <td className="py-3">Single chain compromise</td>
                              <td className="py-3"><Badge className="bg-yellow-500/20 text-yellow-400">Medium</Badge></td>
                              <td className="py-3">2-of-3 consensus requires two chains</td>
                            </tr>
                            <tr className="border-b border-[#6B00D7]/10">
                              <td className="py-3">Validator key compromise</td>
                              <td className="py-3"><Badge className="bg-[#14F195]/20 text-[#14F195]">Low</Badge></td>
                              <td className="py-3">Keys isolated in TEE enclaves</td>
                            </tr>
                            <tr className="border-b border-[#6B00D7]/10">
                              <td className="py-3">Relayer manipulation</td>
                              <td className="py-3"><Badge className="bg-[#14F195]/20 text-[#14F195]">Low</Badge></td>
                              <td className="py-3">Proofs verified on-chain, relayer is untrusted</td>
                            </tr>
                            <tr className="border-b border-[#6B00D7]/10">
                              <td className="py-3">Quantum attacks</td>
                              <td className="py-3"><Badge className="bg-[#14F195]/20 text-[#14F195]">Low</Badge></td>
                              <td className="py-3">ML-KEM-1024 + Dilithium-5 on TON</td>
                            </tr>
                            <tr className="border-b border-[#6B00D7]/10">
                              <td className="py-3">Smart contract exploit</td>
                              <td className="py-3"><Badge className="bg-yellow-500/20 text-yellow-400">Medium</Badge></td>
                              <td className="py-3">Formal verification, 62% theorems proven</td>
                            </tr>
                            <tr className="border-b border-[#6B00D7]/10">
                              <td className="py-3">TEE side-channel attack</td>
                              <td className="py-3"><Badge className="bg-[#14F195]/20 text-[#14F195]">Low</Badge></td>
                              <td className="py-3">Constant-time crypto, AMD SEV for highest security</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <h3 className="text-xl font-bold text-white mt-8 mb-4">Formal Verification Results</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                        <div className="p-4 rounded-lg bg-black/40 border border-[#14F195]/30 text-center">
                          <div className="text-3xl font-bold text-[#14F195]">62%</div>
                          <div className="text-gray-400 text-sm mt-1">Theorems Proven (21/34)</div>
                        </div>
                        <div className="p-4 rounded-lg bg-black/40 border border-[#14F195]/30 text-center">
                          <div className="text-3xl font-bold text-[#14F195]">84%</div>
                          <div className="text-gray-400 text-sm mt-1">Invariants Holding (16/19)</div>
                        </div>
                        <div className="p-4 rounded-lg bg-black/40 border border-[#14F195]/30 text-center">
                          <div className="text-3xl font-bold text-[#14F195]">0</div>
                          <div className="text-gray-400 text-sm mt-1">Critical Vulnerabilities</div>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-white mt-8 mb-4">Verified Contracts</h3>
                      <ul className="space-y-2 text-gray-300">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#14F195]" />
                          <span>CVTBridge — All critical paths verified</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#14F195]" />
                          <span>ChronosVault — Deposit/withdraw invariants holding</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#14F195]" />
                          <span>CrossChainBridgeOptimized — Message integrity proven</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#14F195]" />
                          <span>TrinityConsensusVerifier — Consensus logic verified</span>
                        </li>
                      </ul>

                      <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-[#6B00D7]/10 to-[#14F195]/10 border border-[#14F195]/30">
                        <h3 className="text-xl font-bold text-white mb-3">Security Guarantee</h3>
                        <div className="font-mono text-sm bg-black/40 p-4 rounded-lg text-[#14F195]">
                          <div>∀ contract C ∈ Trinity:</div>
                          <div className="ml-4">proven_secure(C) ⟹ ¬∃ exploit_path(C)</div>
                          <div className="mt-2">∀ operation O:</div>
                          <div className="ml-4">execute(O) ⟹ consensus(O, 2/3) ∧ tee_verified(O)</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Conclusion */}
                <TabsContent value="conclusion" className="space-y-6 mt-0">
                  <Card className="bg-black/40 border-[#6B00D7]/30">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#FF5AF7]/20">
                          <Target className="w-6 h-6 text-[#FF5AF7]" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl">Conclusion</CardTitle>
                          <CardDescription>Summary and Future Directions</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="prose prose-invert max-w-none">
                      <p className="text-gray-300 leading-relaxed text-lg">
                        Trinity Protocol™ represents a fundamental advancement in blockchain security architecture. 
                        By distributing trust across three independent blockchain networks and implementing 8 layers 
                        of mathematical defense, we have created a system where security claims are 
                        <strong className="text-[#FF5AF7]"> cryptographically verifiable, not just audited</strong>.
                      </p>

                      <h3 className="text-xl font-bold text-white mt-8 mb-4">Key Achievements</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                        <div className="p-4 rounded-lg bg-[#14F195]/10 border border-[#14F195]/30">
                          <TrendingUp className="w-6 h-6 text-[#14F195] mb-2" />
                          <h4 className="text-white font-semibold m-0">Production Ready</h4>
                          <p className="text-gray-400 text-sm m-0 mt-2">
                            14 contracts deployed on Arbitrum Sepolia, active Solana program, TON contracts live
                          </p>
                        </div>
                        <div className="p-4 rounded-lg bg-[#FF5AF7]/10 border border-[#FF5AF7]/30">
                          <Shield className="w-6 h-6 text-[#FF5AF7] mb-2" />
                          <h4 className="text-white font-semibold m-0">Mathematically Proven</h4>
                          <p className="text-gray-400 text-sm m-0 mt-2">
                            62% theorems proven, 84% invariants holding, zero critical vulnerabilities
                          </p>
                        </div>
                        <div className="p-4 rounded-lg bg-[#0098EA]/10 border border-[#0098EA]/30">
                          <Atom className="w-6 h-6 text-[#0098EA] mb-2" />
                          <h4 className="text-white font-semibold m-0">Quantum Resistant</h4>
                          <p className="text-gray-400 text-sm m-0 mt-2">
                            NIST FIPS 203/204 compliant ML-KEM-1024 and Dilithium-5 implementation
                          </p>
                        </div>
                        <div className="p-4 rounded-lg bg-[#6B00D7]/10 border border-[#6B00D7]/30">
                          <Cpu className="w-6 h-6 text-[#6B00D7] mb-2" />
                          <h4 className="text-white font-semibold m-0">Hardware Protected</h4>
                          <p className="text-gray-400 text-sm m-0 mt-2">
                            Trinity Shield™ TEE with Intel SGX and AMD SEV-SNP support
                          </p>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-white mt-8 mb-4">Future Roadmap</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-black/40 border border-[#6B00D7]/20">
                          <div className="w-6 h-6 rounded-full bg-[#6B00D7] flex items-center justify-center text-white text-xs font-bold">Q1</div>
                          <div>
                            <h4 className="text-white font-semibold m-0">Mainnet Deployment</h4>
                            <p className="text-gray-400 text-sm m-0">Arbitrum One, Solana Mainnet, TON Mainnet deployment</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-black/40 border border-[#6B00D7]/20">
                          <div className="w-6 h-6 rounded-full bg-[#FF5AF7] flex items-center justify-center text-white text-xs font-bold">Q2</div>
                          <div>
                            <h4 className="text-white font-semibold m-0">Validator Network Expansion</h4>
                            <p className="text-gray-400 text-sm m-0">Community validator onboarding, decentralized operation</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-black/40 border border-[#6B00D7]/20">
                          <div className="w-6 h-6 rounded-full bg-[#14F195] flex items-center justify-center text-black text-xs font-bold">Q3</div>
                          <div>
                            <h4 className="text-white font-semibold m-0">Additional Chain Integration</h4>
                            <p className="text-gray-400 text-sm m-0">Base, Optimism, and other L2 support</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-black/40 border border-[#6B00D7]/20">
                          <div className="w-6 h-6 rounded-full bg-[#0098EA] flex items-center justify-center text-white text-xs font-bold">Q4</div>
                          <div>
                            <h4 className="text-white font-semibold m-0">Full Formal Verification</h4>
                            <p className="text-gray-400 text-sm m-0">100% theorem coverage, third-party audit completion</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-[#6B00D7]/20 via-[#FF5AF7]/20 to-[#0098EA]/20 border border-[#FF5AF7]/30 text-center">
                        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] via-[#FF5AF7] to-[#0098EA] mb-4">
                          "Mathematically Proven. Hardware Protected."
                        </h3>
                        <p className="text-gray-300 m-0">
                          Trinity Protocol — The future of cross-chain security is here.
                        </p>
                      </div>

                      <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <Button 
                          onClick={() => setLocation('/trinity-protocol')}
                          className="bg-[#6B00D7] hover:bg-[#5a00b5]"
                          data-testid="button-view-dashboard"
                        >
                          View Trinity Dashboard
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                        <Button 
                          onClick={() => setLocation('/validator-onboarding')}
                          variant="outline"
                          className="border-[#FF5AF7] text-[#FF5AF7] hover:bg-[#FF5AF7]/10"
                          data-testid="button-become-validator"
                        >
                          Become a Validator
                          <Users className="w-4 h-4 ml-2" />
                        </Button>
                        <Button 
                          onClick={() => setLocation('/monitoring')}
                          variant="outline"
                          className="border-[#0098EA] text-[#0098EA] hover:bg-[#0098EA]/10"
                          data-testid="button-trinity-scan"
                        >
                          Trinity Scan Explorer
                          <Activity className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrinityProtocolPaper;
