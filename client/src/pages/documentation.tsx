import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";

export default function Documentation() {
  const [_, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#121212] to-[#1A1A1A] text-white pb-20">
      <div className="container mx-auto px-4 py-12">
        <PageHeader
          heading="Chronos Vault Documentation"
          description="Comprehensive guides, API references, and explanations of core concepts"
          separator={true}
        />

        {/* Main Documentation Content */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Table of Contents */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-[#1D1D1D] to-[#151515] rounded-xl border border-[#333] p-5 sticky top-24">
              <h3 className="text-xl font-bold mb-4 pb-3 border-b border-[#333]">Table of Contents</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-[#FF5AF7] font-medium mb-2">Getting Started</h4>
                  <ul className="space-y-2 pl-2">
                    <li>
                      <a href="#introduction" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6B00D7]"></span>
                        Introduction
                      </a>
                    </li>
                    <li>
                      <a href="#key-concepts" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6B00D7]"></span>
                        Key Concepts
                      </a>
                    </li>
                    <li>
                      <a href="#quick-start" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6B00D7]"></span>
                        Quick Start Guide
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-[#FF5AF7] font-medium mb-2">Core Features</h4>
                  <ul className="space-y-2 pl-2">
                    <li>
                      <a href="#triple-chain" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6B00D7]"></span>
                        Triple-Chain Security
                      </a>
                    </li>
                    <li>
                      <a href="#atomic-swaps" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6B00D7]"></span>
                        Cross-Chain Atomic Swaps
                      </a>
                    </li>
                    <li>
                      <Link href="/storage" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF5AF7]"></span>
                        <span className="text-[#FF5AF7] font-medium">Decentralized Storage</span>
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-[#FF5AF7] font-medium mb-2">Blockchain Integrations</h4>
                  <ul className="space-y-2 pl-2">
                    <li>
                      <a href="#ethereum" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6B00D7]"></span>
                        Ethereum Layer 2 Integration
                      </a>
                    </li>
                    <li>
                      <a href="#solana" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6B00D7]"></span>
                        Solana Integration
                      </a>
                    </li>
                    <li>
                      <a href="#ton" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6B00D7]"></span>
                        TON Integration
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-[#FF5AF7] font-medium mb-2">🛡️ Mathematical Defense Layer</h4>
                  <ul className="space-y-2 pl-2">
                    <li>
                      <a href="#mdl-overview" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6B00D7]"></span>
                        MDL Overview
                      </a>
                    </li>
                    <li>
                      <a href="#zk-proofs" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6B00D7]"></span>
                        Zero-Knowledge Proofs
                      </a>
                    </li>
                    <li>
                      <a href="#quantum-crypto" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6B00D7]"></span>
                        Quantum-Resistant Crypto
                      </a>
                    </li>
                    <li>
                      <a href="#mpc" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6B00D7]"></span>
                        Multi-Party Computation
                      </a>
                    </li>
                    <li>
                      <a href="#vdf" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6B00D7]"></span>
                        Verifiable Delay Functions
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-[#FF5AF7] font-medium mb-2">Developer Resources</h4>
                  <ul className="space-y-2 pl-2">
                    <li>
                      <a href="#github-repos" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6B00D7]"></span>
                        GitHub Repositories
                      </a>
                    </li>
                    <li>
                      <a href="#integration-guide" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6B00D7]"></span>
                        Integration Guide
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-[#FF5AF7] font-medium mb-2">Advanced Topics</h4>
                  <ul className="space-y-2 pl-2">
                    <li>
                      <a href="#cvt-token" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6B00D7]"></span>
                        CVT Token
                      </a>
                    </li>
                    <li>
                      <a href="#inheritance" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6B00D7]"></span>
                        Multi-Chain Inheritance
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Introduction Section */}
            <section id="introduction" className="scroll-mt-24">
              <div className="bg-gradient-to-br from-[#1D1D1D] to-[#151515] rounded-xl border border-[#333] p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6B00D7]/30 to-[#FF5AF7]/20 flex items-center justify-center">
                    <span className="text-xl">📚</span>
                  </div>
                  Introduction to Chronos Vault
                </h2>
                
                <div className="space-y-4 text-gray-300">
                  <p>
                    Chronos Vault is a revolutionary decentralized platform for creating tamper-proof digital time vaults. It leverages the security and unique capabilities of multiple blockchains to provide a secure, flexible system for locking assets until a future date or event.
                  </p>
                  
                  <div className="bg-[#6B00D7]/10 border border-[#6B00D7]/30 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">Key Innovations</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Multi-chain architecture with Ethereum Layer 2 (Arbitrum), Solana, and TON integration</li>
                      <li>Triple-chain security model for unprecedented reliability</li>
                      <li>Cross-chain atomic swaps for asset conversion while time-locked</li>
                      <li>Permanent storage through IPFS and Arweave integration</li>
                      <li>Smart conditional unlocking based on market events or security parameters</li>
                    </ul>
                  </div>
                  
                  <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link href="/technical-spec">
                      <div className="bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/10 border border-[#6B00D7]/30 rounded-lg p-4 hover:from-[#6B00D7]/30 hover:to-[#FF5AF7]/20 transition-all cursor-pointer">
                        <h4 className="font-semibold text-white flex items-center gap-2">
                          <span className="text-xl">🧪</span>
                          Technical Specifications
                        </h4>
                        <p className="text-gray-300 mt-1">Explore the detailed technical architecture and specifications of the Chronos Vault platform.</p>
                      </div>
                    </Link>
                    <Link href="/cvt-tokenomics">
                      <div className="bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/10 border border-[#6B00D7]/30 rounded-lg p-4 hover:from-[#6B00D7]/30 hover:to-[#FF5AF7]/20 transition-all cursor-pointer">
                        <h4 className="font-semibold text-white flex items-center gap-2">
                          <span className="text-xl">📊</span>
                          CVT Tokenomics
                        </h4>
                        <p className="text-gray-300 mt-1">Learn about the ChronosVault Token (CVT), its deflationary model, and distribution schedule.</p>
                      </div>
                    </Link>
                    <Link href="/project-whitepaper">
                      <div className="bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/10 border border-[#6B00D7]/30 rounded-lg p-4 hover:from-[#6B00D7]/30 hover:to-[#FF5AF7]/20 transition-all cursor-pointer">
                        <h4 className="font-semibold text-white flex items-center gap-2">
                          <span className="text-xl">📑</span>
                          Project Whitepaper
                        </h4>
                        <p className="text-gray-300 mt-1">Read the comprehensive overview of the Chronos Vault platform, architecture, and vision.</p>
                      </div>
                    </Link>
                    <Link href="/whitepaper">
                      <div className="bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/10 border border-[#6B00D7]/30 rounded-lg p-4 hover:from-[#6B00D7]/30 hover:to-[#FF5AF7]/20 transition-all cursor-pointer">
                        <h4 className="font-semibold text-white flex items-center gap-2">
                          <span className="text-xl">💎</span>
                          CVT Whitepaper
                        </h4>
                        <p className="text-gray-300 mt-1">Dive into the detailed tokenomics of the ChronosVault Token (CVT) and its utility within the ecosystem.</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Key Concepts Section */}
            <section id="key-concepts" className="scroll-mt-24">
              <div className="bg-gradient-to-br from-[#1D1D1D] to-[#151515] rounded-xl border border-[#333] p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6B00D7]/30 to-[#FF5AF7]/20 flex items-center justify-center">
                    <span className="text-xl">🔑</span>
                  </div>
                  Key Concepts
                </h2>
                
                <div className="space-y-6 text-gray-300">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Time Vaults</h3>
                    <p>
                      Time vaults are smart contract-powered containers that secure digital assets until a predetermined unlock date or event. These vaults implement cryptographic time-locks that cannot be bypassed, ensuring assets remain secure until their intended release.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Cross-Chain Functionality</h3>
                    <p>
                      Chronos Vault operates across multiple blockchains simultaneously, utilizing each chain's unique advantages to create a more robust, efficient platform. Assets can be stored on their native chains while still benefiting from cross-chain security and features.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Vault Types</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      <div className="p-4 bg-[#141414] rounded-lg border border-[#333] hover:border-[#6B00D7] transition-all">
                        <div className="font-semibold text-[#FF5AF7] mb-2">Legacy Vault</div>
                        <p className="text-sm">Secure your digital legacy for future generations with inheritance features.</p>
                      </div>
                      <div className="p-4 bg-[#141414] rounded-lg border border-[#333] hover:border-[#6B00D7] transition-all">
                        <div className="font-semibold text-[#FF5AF7] mb-2">Investment Vault</div>
                        <p className="text-sm">Lock assets for a specific period with automated investment strategies.</p>
                      </div>
                      <div className="p-4 bg-[#141414] rounded-lg border border-[#333] hover:border-[#6B00D7] transition-all">
                        <div className="font-semibold text-[#FF5AF7] mb-2">Multi-Signature Vault</div>
                        <p className="text-sm">Require multiple approvals for enhanced security and collaborative control.</p>
                      </div>
                      <div className="p-4 bg-[#141414] rounded-lg border border-[#333] hover:border-[#6B00D7] transition-all">
                        <div className="font-semibold text-[#FF5AF7] mb-2">Event-Triggered Vault</div>
                        <p className="text-sm">Configure unlocking based on specific blockchain or real-world events.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Start Guide */}
            <section id="quick-start" className="scroll-mt-24">
              <div className="bg-gradient-to-br from-[#1D1D1D] to-[#151515] rounded-xl border border-[#333] p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6B00D7]/30 to-[#FF5AF7]/20 flex items-center justify-center">
                    <span className="text-xl">🚀</span>
                  </div>
                  Quick Start Guide
                </h2>
                
                <div className="space-y-5 text-gray-300">
                  <div className="flex">
                    <div className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shrink-0">1</div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-white">Connect Your Wallet</h3>
                      <p className="mt-1">Connect any supported wallet (MetaMask, WalletConnect, Phantom, or TON Wallet) to get started.</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shrink-0">2</div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-white">Create Your Vault</h3>
                      <p className="mt-1">Navigate to the Create Vault page and select your preferred vault type.</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shrink-0">3</div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-white">Configure Settings</h3>
                      <p className="mt-1">Set your time lock parameters, security preferences, and optionally add beneficiaries.</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shrink-0">4</div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-white">Deposit Assets</h3>
                      <p className="mt-1">Transfer your assets to the vault. Multiple asset types from different blockchains are supported.</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shrink-0">5</div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-white">Manage Your Vault</h3>
                      <p className="mt-1">Monitor your vault's status, adjust settings (when permitted), and track performance through the My Vaults dashboard.</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-center">
                  <Button 
                    className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5500AB] hover:to-[#FF46E8] text-white font-bold rounded-lg px-6 py-3 shadow-glow hover:shadow-lg hover:shadow-[#FF5AF7]/40 transition-all"
                    onClick={() => setLocation("/create-vault")}
                  >
                    Create Your First Vault
                  </Button>
                </div>
              </div>
            </section>

            {/* Core Features Sections */}
            <section id="triple-chain" className="scroll-mt-24">
              <div className="bg-gradient-to-br from-[#1D1D1D] to-[#151515] rounded-xl border border-[#333] p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6B00D7]/30 to-[#FF5AF7]/20 flex items-center justify-center">
                    <span className="text-xl">🔗</span>
                  </div>
                  Triple-Chain Security
                </h2>
                
                <div className="space-y-4 text-gray-300">
                  <p>
                    Our revolutionary <strong className="text-[#FF5AF7]">Trinity Protocol: 2-of-3 Chain Security</strong> provides 
                    unparalleled protection through fixed-role blockchain architecture. Each chain serves a specific purpose, 
                    combining their strengths for maximum security.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="p-4 bg-[#141414] rounded-lg border border-[#6B00D7]/50">
                      <h4 className="font-semibold text-white mb-2">Ethereum Layer 2 (Arbitrum)</h4>
                      <p className="text-sm mb-1"><span className="text-[#FF5AF7] font-medium">Primary Security</span> - Immutable ownership and access control via Arbitrum Layer 2 for 95% lower fees</p>
                      <p className="text-xs text-gray-400">Status: LAYER 2 OPTIMIZED</p>
                    </div>
                    <div className="p-4 bg-[#141414] rounded-lg border border-[#6B00D7]/50">
                      <h4 className="font-semibold text-white mb-2">Solana Layer</h4>
                      <p className="text-sm mb-1"><span className="text-[#FF5AF7] font-medium">Rapid Validation</span> - High-frequency monitoring with millisecond confirmation</p>
                      <p className="text-xs text-gray-400">Status: NETWORK ACTIVE</p>
                    </div>
                    <div className="p-4 bg-[#141414] rounded-lg border border-[#6B00D7]/50">
                      <h4 className="font-semibold text-white mb-2">TON Layer</h4>
                      <p className="text-sm mb-1"><span className="text-[#FF5AF7] font-medium">Recovery System</span> - Quantum-resistant backup and emergency recovery</p>
                      <p className="text-xs text-gray-400">Status: NETWORK ACTIVE</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <Button
                      variant="outline"
                      className="border border-[#6B00D7] bg-[#1A1A1A] text-[#FF5AF7] hover:bg-[#6B00D7]/20 font-medium rounded-lg px-4 py-2 text-sm transition-all"
                      onClick={() => setLocation("/revolutionary-features#triple-chain")}
                    >
                      Learn More About Triple-Chain Security
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            {/* Cross-Chain Atomic Swaps */}
            <section id="atomic-swaps" className="scroll-mt-24 mt-12">
              <div className="bg-gradient-to-br from-[#1D1D1D] to-[#151515] rounded-xl border border-[#333] p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6B00D7]/30 to-[#FF5AF7]/20 flex items-center justify-center">
                    <span className="text-xl">🔄</span>
                  </div>
                  Cross-Chain Atomic Swaps
                </h2>
                
                <div className="space-y-4 text-gray-300">
                  <p>
                    Atomic swaps allow for trustless exchange of assets between different blockchains within your vault, maintaining security and eliminating counterparty risk during transactions.
                  </p>
                  
                  <div className="bg-[#141414] rounded-lg border border-[#333] p-4">
                    <h3 className="font-semibold text-white mb-2">How Atomic Swaps Work</h3>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>Assets from different chains are locked in specialized smart contracts</li>
                      <li>Hash-timelocked contracts (HTLCs) ensure that either both parties receive their assets or the transaction completely reverts</li>
                      <li>The process is intermediary-free and fully automated</li>
                      <li>Complete transaction occurs atomically - it either happens completely or not at all</li>
                    </ol>
                  </div>
                  
                  <div className="flex items-center gap-4 overflow-x-auto py-3 px-2 no-scrollbar">
                    <div className="bg-[#141414] rounded-lg border border-[#333] p-3 min-w-[180px]">
                      <h4 className="font-semibold text-white mb-1 flex items-center gap-1">
                        <span className="text-[#FF5AF7]">⚡</span> Lightning Fast
                      </h4>
                      <p className="text-xs text-gray-300">Cross-chain transactions settle in minutes rather than hours</p>
                    </div>
                    
                    <div className="bg-[#141414] rounded-lg border border-[#333] p-3 min-w-[180px]">
                      <h4 className="font-semibold text-white mb-1 flex items-center gap-1">
                        <span className="text-[#FF5AF7]">🛡️</span> Trustless
                      </h4>
                      <p className="text-xs text-gray-300">No need to trust exchanges or intermediaries with your assets</p>
                    </div>
                    
                    <div className="bg-[#141414] rounded-lg border border-[#333] p-3 min-w-[180px]">
                      <h4 className="font-semibold text-white mb-1 flex items-center gap-1">
                        <span className="text-[#FF5AF7]">📊</span> Liquid
                      </h4>
                      <p className="text-xs text-gray-300">Convert assets without withdrawing from your vault</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Permanent Storage */}
            <section id="storage" className="scroll-mt-24 mt-12">
              <div className="bg-gradient-to-br from-[#1D1D1D] to-[#151515] rounded-xl border border-[#333] p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6B00D7]/30 to-[#FF5AF7]/20 flex items-center justify-center">
                    <span className="text-xl">🗄️</span>
                  </div>
                  Decentralized Storage
                </h2>
                
                <div className="space-y-4 text-gray-300">
                  <p>
                    Chronos Vault integrates with decentralized storage networks to provide permanent, tamper-proof storage for vault contents that endures far beyond the lifetime of traditional storage systems.
                  </p>
                  
                  <div className="mt-5">
                    <Link href="/storage" className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#6B00D7]/30 to-[#FF5AF7]/30 hover:from-[#6B00D7]/40 hover:to-[#FF5AF7]/40 rounded-xl border border-[#FF5AF7]/30 text-white font-medium transition-all transform hover:translate-y-[-2px]">
                      <span className="text-xl">🚀</span>
                      Visit Storage Page
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="p-4 bg-[#141414] rounded-lg border border-[#333]">
                      <h4 className="font-semibold text-[#00C9FF] mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M27.5 55C42.6878 55 55 42.6878 55 27.5C55 12.3122 42.6878 0 27.5 0C12.3122 0 0 12.3122 0 27.5C0 42.6878 12.3122 55 27.5 55Z" fill="#00C9FF" fillOpacity="0.2"/>
                          <path d="M49.9543 24.1173H43.0357C41.4938 14.7647 33.5279 7.51479 23.9279 7.51479C13.1573 7.51479 4.375 16.297 4.375 27.0677C4.375 37.8383 13.1573 46.6206 23.9279 46.6206H49.9543C52.3357 46.6206 54.2647 44.6916 54.2647 42.3103C54.2647 39.9289 52.3357 38 49.9543 38H49.0787C51.0993 36.0709 52.2103 33.3541 52.2103 30.3603C52.2103 27.3664 51.0993 24.5581 49.0787 22.7206H49.9543C52.3357 22.7206 54.2647 20.7916 54.2647 18.4103C54.2647 16.029 52.3357 14.1 49.9543 14.1C47.573 14.1 45.644 16.029 45.644 18.4103C45.644 20.7916 47.573 22.7206 49.9543 22.7206H49.0787M43.0357 30.3603C43.0357 35.0935 39.2583 38.8709 34.5252 38.8709C29.792 38.8709 26.0146 35.0935 26.0146 30.3603C26.0146 25.6272 29.792 21.8497 34.5252 21.8497C39.2583 21.8497 43.0357 25.6272 43.0357 30.3603Z" stroke="#00C9FF" strokeWidth="2.5"/>
                        </svg>
                        Arweave Storage
                      </h4>
                      <p className="text-sm">Permanent, immutable storage with a one-time payment model. Data is stored forever through an endowment mechanism, making it ideal for critical documents and legacy planning.</p>
                    </div>
                    
                    <div className="p-4 bg-[#141414] rounded-lg border border-[#333]">
                      <h4 className="font-semibold text-[#65D87E] mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" viewBox="0 0 80 89" xmlns="http://www.w3.org/2000/svg">
                          <path d="M40 0L0 22V66.5L40 89L80 66.5V22L40 0ZM12.4 61.79V31.65L40 16.57L67.6 31.65V61.79L40 76.85L12.4 61.79Z" fill="#65D87E" fillOpacity="0.5"/>
                        </svg>
                        IPFS Integration
                      </h4>
                      <p className="text-sm">Content-addressed distributed storage with high availability. Perfect for media files and content that needs to be accessed frequently. We ensure pinning through multiple reliable services.</p>
                    </div>
                  </div>
                  
                  <div className="p-4 mt-2 bg-[#6B00D7]/10 border border-[#6B00D7]/30 rounded-lg">
                    <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                      <span className="text-xl">🔒</span>
                      End-to-End Encryption
                    </h4>
                    <p className="text-sm">All data is encrypted before leaving your device. Only you and your designated beneficiaries can decrypt and access your vault contents, providing privacy while leveraging public networks.</p>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Blockchain Integrations */}
            <section id="ethereum" className="scroll-mt-24 mt-12">
              <div className="bg-gradient-to-br from-[#1D1D1D] to-[#151515] rounded-xl border border-[#333] p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6B00D7]/30 to-[#FF5AF7]/20 flex items-center justify-center">
                    <span className="text-xl">Ξ</span>
                  </div>
                  Ethereum Layer 2 (Arbitrum) Integration
                </h2>
                
                <div className="space-y-4 text-gray-300">
                  <p>
                    Ethereum Layer 2 (Arbitrum) integration provides robust security and programmability through ERC-4626 compliant tokenized vaults and advanced smart contracts that enable conditional unlocking and multi-signature control, with 95% lower fees.
                  </p>
                  
                  <div className="bg-[#141414] rounded-lg border border-[#333] p-4">
                    <h3 className="font-semibold text-white mb-2">Ethereum Layer 2 Features</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>ERC-4626 compliant tokenized vaults for maximum interoperability</li>
                      <li>Multi-signature vault control with customizable thresholds</li>
                      <li>Integration with Ethereum Name Service (ENS) for user-friendly addressing</li>
                      <li>Support for all ERC-20 tokens and ERC-721/ERC-1155 NFTs</li>
                      <li>Deployed on Arbitrum Layer 2 for 95% lower fees while maintaining Ethereum security</li>
                    </ul>
                  </div>
                  
                  <div className="flex justify-end mt-2">
                    <Button
                      variant="outline"
                      className="border border-[#6B00D7] bg-[#1A1A1A] text-[#FF5AF7] hover:bg-[#6B00D7]/20 font-medium rounded-lg px-4 py-2 text-sm transition-all"
                      onClick={() => setLocation("/ethereum-integration")}
                    >
                      Learn More About Ethereum Integration
                    </Button>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Solana Integration */}
            <section id="solana" className="scroll-mt-24 mt-12">
              <div className="bg-gradient-to-br from-[#1D1D1D] to-[#151515] rounded-xl border border-[#333] p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6B00D7]/30 to-[#FF5AF7]/20 flex items-center justify-center">
                    <span className="text-xl">◎</span>
                  </div>
                  Solana Integration
                </h2>
                
                <div className="space-y-4 text-gray-300">
                  <p>
                    Solana's high-speed, low-fee blockchain enables blazing-fast vault interactions and real-time monitoring capabilities with throughput that supports thousands of transactions per second.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="p-4 bg-[#141414] rounded-lg border border-[#333]">
                      <h4 className="font-semibold text-white mb-2">Rapid Interactions</h4>
                      <p className="text-sm">Transaction finality in less than a second enables immediate vault status updates and real-time monitoring.</p>
                    </div>
                    
                    <div className="p-4 bg-[#141414] rounded-lg border border-[#333]">
                      <h4 className="font-semibold text-white mb-2">Advanced Programmability</h4>
                      <p className="text-sm">Solana's programming model enables complex vault logic without the constraints of Ethereum's gas model.</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-2">
                    <Button
                      variant="outline"
                      className="border border-[#6B00D7] bg-[#1A1A1A] text-[#FF5AF7] hover:bg-[#6B00D7]/20 font-medium rounded-lg px-4 py-2 text-sm transition-all"
                      onClick={() => setLocation("/solana-integration")}
                    >
                      Learn More About Solana Integration
                    </Button>
                  </div>
                </div>
              </div>
            </section>
            
            {/* TON Integration */}
            <section id="ton" className="scroll-mt-24 mt-12">
              <div className="bg-gradient-to-br from-[#1D1D1D] to-[#151515] rounded-xl border border-[#333] p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6B00D7]/30 to-[#FF5AF7]/20 flex items-center justify-center">
                    <span className="text-xl">💎</span>
                  </div>
                  TON Integration
                </h2>
                
                <div className="space-y-4 text-gray-300">
                  <p>
                    The Open Network (TON) provides our platform with resilient fallback mechanisms, enhanced user accessibility through Telegram integration, and sophisticated smart contract recovery options.
                  </p>
                  
                  <div className="p-4 bg-[#141414] rounded-lg border border-[#333]">
                    <h3 className="font-semibold text-white mb-2">TON Features</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Seamless Telegram Mini App integration for billions of potential users</li>
                      <li>FunC smart contracts providing recovery mechanisms for vault access</li>
                      <li>Infinite sharding architecture supporting massive scalability</li>
                      <li>Low transaction fees even during high network congestion</li>
                    </ul>
                  </div>
                  
                  <div className="flex justify-end mt-2">
                    <Button
                      variant="outline"
                      className="border border-[#6B00D7] bg-[#1A1A1A] text-[#FF5AF7] hover:bg-[#6B00D7]/20 font-medium rounded-lg px-4 py-2 text-sm transition-all"
                      onClick={() => setLocation("/ton-integration")}
                    >
                      Learn More About TON Integration
                    </Button>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Mathematical Defense Layer Overview */}
            <section id="mdl-overview" className="scroll-mt-24 mt-12">
              <div className="bg-gradient-to-br from-[#1D1D1D] to-[#151515] rounded-xl border border-[#333] p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6B00D7]/30 to-[#FF5AF7]/20 flex items-center justify-center">
                    <span className="text-xl">🛡️</span>
                  </div>
                  Mathematical Defense Layer (MDL)
                </h2>
                
                <div className="space-y-4 text-gray-300">
                  <div className="bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/10 border border-[#6B00D7]/50 rounded-lg p-5">
                    <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                      <span className="text-2xl">🔐</span> Trust Math, Not Humans
                    </h3>
                    <p className="text-lg">
                      The world's first <strong className="text-[#FF5AF7]">mathematically provable</strong> blockchain security system where every security claim is cryptographically verifiable, not just audited.
                    </p>
                  </div>
                  
                  <p>
                    Unlike traditional platforms that rely on audits and trust, Chronos Vault provides <strong className="text-white">mathematical proofs</strong>. Every security claim is verifiable through cryptographic evidence, not human promises.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="p-4 bg-[#141414] rounded-lg border border-[#6B00D7]/50">
                      <h4 className="font-semibold text-[#FF5AF7] mb-2">7 Security Layers</h4>
                      <ul className="text-sm space-y-1 list-disc pl-4">
                        <li>Zero-Knowledge Proofs (Groth16)</li>
                        <li>Quantum-Resistant Crypto (ML-KEM-1024)</li>
                        <li>Multi-Party Computation (3-of-5 Shamir)</li>
                        <li>Verifiable Delay Functions (Wesolowski VDF)</li>
                        <li>AI + Cryptographic Governance</li>
                        <li>Formal Verification (Symbolic Execution)</li>
                        <li>Trinity Protocol (2-of-3 Multi-Chain)</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-[#141414] rounded-lg border border-[#6B00D7]/50">
                      <h4 className="font-semibold text-[#FF5AF7] mb-2">Mathematical Guarantees</h4>
                      <ul className="text-sm space-y-1 list-disc pl-4">
                        <li>Privacy: Verifier learns nothing beyond validity</li>
                        <li>Time-Locks: Provably impossible to bypass</li>
                        <li>Key Distribution: No single point of failure</li>
                        <li>Quantum Safety: Resistant to Shor's algorithm</li>
                        <li>AI Decisions: Cryptographically validated</li>
                        <li>Contract Security: Formally proven</li>
                        <li>Multi-Chain: 2-of-3 consensus required</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Zero-Knowledge Proofs */}
            <section id="zk-proofs" className="scroll-mt-24 mt-12">
              <div className="bg-gradient-to-br from-[#1D1D1D] to-[#151515] rounded-xl border border-[#333] p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6B00D7]/30 to-[#FF5AF7]/20 flex items-center justify-center">
                    <span className="text-xl">🔍</span>
                  </div>
                  Zero-Knowledge Proofs
                </h2>
                
                <div className="space-y-4 text-gray-300">
                  <p>
                    Privacy-preserving verification using <strong className="text-[#FF5AF7]">Groth16 protocol</strong> with SnarkJS. Prove vault ownership without revealing your private key or identity.
                  </p>
                  
                  <div className="bg-[#141414] rounded-lg border border-[#333] p-4 font-mono text-sm overflow-x-auto">
                    <div className="text-[#FF5AF7]">// Generate commitment (hides sensitive data)</div>
                    <div className="text-gray-400">const commitment = await zkService.generateCommitment(secretValue, salt);</div>
                    <div className="mt-2 text-[#FF5AF7]">// Verify without revealing secret</div>
                    <div className="text-gray-400">const isValid = await zkService.verifyCommitment(commitment);</div>
                  </div>
                  
                  <div className="p-4 bg-[#6B00D7]/10 border border-[#6B00D7]/30 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Mathematical Guarantee</h4>
                    <p className="text-sm font-mono">∀ proof P: verified(P) ⟹ verifier_learns_nothing_beyond_validity(P)</p>
                    <p className="text-sm mt-2">Proof generation: ~5-20ms | Verification: ~2-10ms</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Quantum-Resistant Cryptography */}
            <section id="quantum-crypto" className="scroll-mt-24 mt-12">
              <div className="bg-gradient-to-br from-[#1D1D1D] to-[#151515] rounded-xl border border-[#333] p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6B00D7]/30 to-[#FF5AF7]/20 flex items-center justify-center">
                    <span className="text-xl">⚛️</span>
                  </div>
                  Quantum-Resistant Cryptography
                </h2>
                
                <div className="space-y-4 text-gray-300">
                  <p>
                    NIST-approved post-quantum cryptography protecting against future quantum computers using <strong className="text-[#FF5AF7]">ML-KEM-1024</strong> and <strong className="text-[#FF5AF7]">CRYSTALS-Dilithium-5</strong>.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-[#141414] rounded-lg border border-[#333]">
                      <h4 className="font-semibold text-white mb-2">Key Exchange</h4>
                      <p className="text-sm">ML-KEM-1024 (NIST FIPS 203) - Secure key encapsulation mechanism resistant to quantum attacks</p>
                    </div>
                    <div className="p-4 bg-[#141414] rounded-lg border border-[#333]">
                      <h4 className="font-semibold text-white mb-2">Digital Signatures</h4>
                      <p className="text-sm">CRYSTALS-Dilithium-5 - Highest security level post-quantum signatures</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-[#6B00D7]/10 border border-[#6B00D7]/30 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Mathematical Guarantee</h4>
                    <p className="text-sm font-mono">∀ attack A using Shor's algorithm: P(success) = negligible</p>
                    <p className="text-sm mt-2">Encryption: ~10-20ms | Future-proof security</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Multi-Party Computation */}
            <section id="mpc" className="scroll-mt-24 mt-12">
              <div className="bg-gradient-to-br from-[#1D1D1D] to-[#151515] rounded-xl border border-[#333] p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6B00D7]/30 to-[#FF5AF7]/20 flex items-center justify-center">
                    <span className="text-xl">🔑</span>
                  </div>
                  Multi-Party Computation (MPC)
                </h2>
                
                <div className="space-y-4 text-gray-300">
                  <p>
                    Distributed key management using <strong className="text-[#FF5AF7]">Shamir Secret Sharing</strong> with 3-of-5 threshold. No single point of failure - your vault keys are mathematically distributed.
                  </p>
                  
                  <div className="bg-[#141414] rounded-lg border border-[#333] p-4">
                    <h3 className="font-semibold text-white mb-2">How MPC Works</h3>
                    <ol className="list-decimal pl-5 space-y-2 text-sm">
                      <li>Master key is split into 5 shares using polynomial interpolation</li>
                      <li>Each share is encrypted with quantum-resistant crypto</li>
                      <li>Shares are distributed across 5 independent nodes</li>
                      <li>Minimum 3 shares required to reconstruct the key</li>
                      <li>Byzantine Fault Tolerant - secure against malicious nodes</li>
                    </ol>
                  </div>
                  
                  <div className="p-4 bg-[#6B00D7]/10 border border-[#6B00D7]/30 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Mathematical Guarantee</h4>
                    <p className="text-sm font-mono">∀ MPC key K: reconstruct(K) requires ≥ 3 threshold shares</p>
                    <p className="text-sm mt-2">Key generation: ~50-100ms | Zero single points of failure</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Verifiable Delay Functions */}
            <section id="vdf" className="scroll-mt-24 mt-12">
              <div className="bg-gradient-to-br from-[#1D1D1D] to-[#151515] rounded-xl border border-[#333] p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6B00D7]/30 to-[#FF5AF7]/20 flex items-center justify-center">
                    <span className="text-xl">⏰</span>
                  </div>
                  Verifiable Delay Functions (VDF)
                </h2>
                
                <div className="space-y-4 text-gray-300">
                  <p>
                    Provable time-locks using <strong className="text-[#FF5AF7]">Wesolowski VDF</strong> with RSA-2048 groups. Time-locks that cannot be bypassed - even by vault creators or administrators.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-[#141414] rounded-lg border border-[#333]">
                      <h4 className="font-semibold text-white mb-2">Sequential Computation</h4>
                      <p className="text-sm">VDF requires O(T) sequential operations that cannot be parallelized - making time enforcement mathematically guaranteed</p>
                    </div>
                    <div className="p-4 bg-[#141414] rounded-lg border border-[#333]">
                      <h4 className="font-semibold text-white mb-2">Fast Verification</h4>
                      <p className="text-sm">Verification takes O(log T) time with Fiat-Shamir non-interactive proofs</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-[#6B00D7]/10 border border-[#6B00D7]/30 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Mathematical Guarantee</h4>
                    <p className="text-sm font-mono">∀ VDF computation: unlock_before_T_iterations = impossible</p>
                    <p className="text-sm mt-2">Provably enforceable time-locks with cryptographic certainty</p>
                  </div>
                </div>
              </div>
            </section>

            {/* GitHub Repositories */}
            <section id="github-repos" className="scroll-mt-24 mt-12">
              <div className="bg-gradient-to-br from-[#1D1D1D] to-[#151515] rounded-xl border border-[#333] p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6B00D7]/30 to-[#FF5AF7]/20 flex items-center justify-center">
                    <i className="ri-github-fill"></i>
                  </div>
                  GitHub Repositories
                </h2>
                
                <div className="space-y-4 text-gray-300">
                  <p>
                    All Chronos Vault code is open-source and available on GitHub. Explore the implementation of the Mathematical Defense Layer and contribute to the future of blockchain security.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a href="https://github.com/Chronos-Vault/chronos-vault-security" target="_blank" rel="noopener noreferrer" className="block p-4 bg-[#141414] rounded-lg border border-[#333] hover:border-[#6B00D7] transition-all group">
                      <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                        <i className="ri-shield-star-line text-[#FF5AF7]"></i>
                        chronos-vault-security
                      </h4>
                      <p className="text-sm mb-2">Mathematical Defense Layer implementation - ZK proofs, quantum crypto, MPC, VDF, AI governance, formal verification</p>
                      <div className="flex items-center gap-2 text-xs text-[#6B00D7] group-hover:text-[#FF5AF7]">
                        <span>View Repository</span>
                        <i className="ri-arrow-right-line"></i>
                      </div>
                    </a>
                    
                    <a href="https://github.com/Chronos-Vault/chronos-vault-contracts" target="_blank" rel="noopener noreferrer" className="block p-4 bg-[#141414] rounded-lg border border-[#333] hover:border-[#6B00D7] transition-all group">
                      <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                        <i className="ri-file-code-line text-[#FF5AF7]"></i>
                        chronos-vault-contracts
                      </h4>
                      <p className="text-sm mb-2">Smart contracts for Ethereum/Arbitrum, Solana programs, TON contracts, and ZK circuits (Circom)</p>
                      <div className="flex items-center gap-2 text-xs text-[#6B00D7] group-hover:text-[#FF5AF7]">
                        <span>View Repository</span>
                        <i className="ri-arrow-right-line"></i>
                      </div>
                    </a>
                    
                    <a href="https://github.com/Chronos-Vault/chronos-vault-platform-" target="_blank" rel="noopener noreferrer" className="block p-4 bg-[#141414] rounded-lg border border-[#333] hover:border-[#6B00D7] transition-all group">
                      <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                        <i className="ri-apps-line text-[#FF5AF7]"></i>
                        chronos-vault-platform
                      </h4>
                      <p className="text-sm mb-2">Full-stack platform - React frontend, Express backend, multi-chain integrations, vault management system</p>
                      <div className="flex items-center gap-2 text-xs text-[#6B00D7] group-hover:text-[#FF5AF7]">
                        <span>View Repository</span>
                        <i className="ri-arrow-right-line"></i>
                      </div>
                    </a>
                    
                    <a href="https://github.com/Chronos-Vault/chronos-vault-sdk" target="_blank" rel="noopener noreferrer" className="block p-4 bg-[#141414] rounded-lg border border-[#333] hover:border-[#6B00D7] transition-all group">
                      <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                        <i className="ri-code-box-line text-[#FF5AF7]"></i>
                        chronos-vault-sdk
                      </h4>
                      <p className="text-sm mb-2">Developer SDK and integration libraries for building on Chronos Vault</p>
                      <div className="flex items-center gap-2 text-xs text-[#6B00D7] group-hover:text-[#FF5AF7]">
                        <span>View Repository</span>
                        <i className="ri-arrow-right-line"></i>
                      </div>
                    </a>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/10 border border-[#6B00D7]/30 rounded-lg">
                    <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                      <i className="ri-star-line text-[#FF5AF7]"></i>
                      Main Organization
                    </h4>
                    <p className="text-sm mb-3">Visit our GitHub organization to explore all repositories and contribute to the project</p>
                    <a href="https://github.com/Chronos-Vault" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-[#6B00D7] hover:bg-[#5500AB] text-white rounded-lg transition-all">
                      <i className="ri-github-fill"></i>
                      <span>github.com/Chronos-Vault</span>
                      <i className="ri-external-link-line text-sm"></i>
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* Integration Guide */}
            <section id="integration-guide" className="scroll-mt-24 mt-12">
              <div className="bg-gradient-to-br from-[#1D1D1D] to-[#151515] rounded-xl border border-[#333] p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6B00D7]/30 to-[#FF5AF7]/20 flex items-center justify-center">
                    <span className="text-xl">🔧</span>
                  </div>
                  Integration Guide
                </h2>
                
                <div className="space-y-4 text-gray-300">
                  <p>
                    Integrate Chronos Vault's Mathematical Defense Layer into your application for enterprise-grade security with cryptographic guarantees.
                  </p>
                  
                  <div className="bg-[#141414] rounded-lg border border-[#333] p-4 font-mono text-sm overflow-x-auto">
                    <div className="text-[#FF5AF7]">// Initialize Mathematical Defense Layer</div>
                    <div className="text-gray-400">import {'{ MathematicalDefenseLayer }'} from '@chronos-vault/security';</div>
                    <div className="mt-2 text-gray-400">const mdl = new MathematicalDefenseLayer();</div>
                    <div className="text-gray-400">await mdl.initialize();</div>
                    <div className="mt-3 text-[#FF5AF7]">// Create secure vault with all 7 layers</div>
                    <div className="text-gray-400">const vault = await mdl.createSecureVault({'{'}</div>
                    <div className="text-gray-400 pl-4">vaultId: 'vault-001',</div>
                    <div className="text-gray-400 pl-4">assetValue: 1000000,</div>
                    <div className="text-gray-400 pl-4">securityLevel: 'maximum'</div>
                    <div className="text-gray-400">{'}'});</div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="p-3 bg-[#141414] rounded-lg border border-[#333]">
                      <h4 className="font-semibold text-[#FF5AF7] text-sm mb-1">Step 1</h4>
                      <p className="text-xs">Install SDK from npm or clone from GitHub</p>
                    </div>
                    <div className="p-3 bg-[#141414] rounded-lg border border-[#333]">
                      <h4 className="font-semibold text-[#FF5AF7] text-sm mb-1">Step 2</h4>
                      <p className="text-xs">Initialize MDL and configure security parameters</p>
                    </div>
                    <div className="p-3 bg-[#141414] rounded-lg border border-[#333]">
                      <h4 className="font-semibold text-[#FF5AF7] text-sm mb-1">Step 3</h4>
                      <p className="text-xs">Create vaults with mathematical proof generation</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <Link href="/developer-portal" className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5500AB] hover:to-[#FF46E8] text-white rounded-lg transition-all">
                      <span>Visit Developer Portal</span>
                      <i className="ri-arrow-right-line"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </section>
            
            {/* CVT Token */}
            <section id="cvt-token" className="scroll-mt-24 mt-12">
              <div className="bg-gradient-to-br from-[#1D1D1D] to-[#151515] rounded-xl border border-[#333] p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6B00D7]/30 to-[#FF5AF7]/20 flex items-center justify-center">
                    <span className="text-xl">🪙</span>
                  </div>
                  CVT Token
                </h2>
                
                <div className="space-y-4 text-gray-300">
                  <p>
                    The Chronos Vault Token (CVT) powers the platform's ecosystem, providing governance rights, premium features, and enhanced vault capabilities to token holders.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="p-4 bg-[#141414] rounded-lg border border-[#333]">
                      <h4 className="font-semibold text-[#FF5AF7] mb-2">Staking Benefits</h4>
                      <ul className="text-sm space-y-1 list-disc pl-4">
                        <li>Higher storage limits</li>
                        <li>Reduced platform fees</li>
                        <li>Advanced security features</li>
                        <li>Early access to new features</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-[#141414] rounded-lg border border-[#333]">
                      <h4 className="font-semibold text-[#FF5AF7] mb-2">Governance</h4>
                      <ul className="text-sm space-y-1 list-disc pl-4">
                        <li>Voting on platform upgrades</li>
                        <li>Fee structure proposals</li>
                        <li>Integration selections</li>
                        <li>Treasury management</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-[#141414] rounded-lg border border-[#333]">
                      <h4 className="font-semibold text-[#FF5AF7] mb-2">Cross-Chain Utility</h4>
                      <ul className="text-sm space-y-1 list-disc pl-4">
                        <li>Multi-chain deployment</li>
                        <li>Seamless bridge functionality</li>
                        <li>Unified ecosystem currency</li>
                        <li>Validator incentives</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-2">
                    <Button
                      variant="outline"
                      className="border border-[#6B00D7] bg-[#1A1A1A] text-[#FF5AF7] hover:bg-[#6B00D7]/20 font-medium rounded-lg px-4 py-2 text-sm transition-all"
                      onClick={() => setLocation("/cvt-token")}
                    >
                      Learn More About CVT Token
                    </Button>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Multi-Chain Inheritance */}
            <section id="inheritance" className="scroll-mt-24 mt-12">
              <div className="bg-gradient-to-br from-[#1D1D1D] to-[#151515] rounded-xl border border-[#333] p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6B00D7]/30 to-[#FF5AF7]/20 flex items-center justify-center">
                    <span className="text-xl">📜</span>
                  </div>
                  Multi-Chain Inheritance
                </h2>
                
                <div className="space-y-4 text-gray-300">
                  <p>
                    Multi-Chain Inheritance allows you to securely pass on digital assets and information to your designated beneficiaries across multiple blockchains, with sophisticated controls and privacy safeguards.
                  </p>
                  
                  <div className="p-4 bg-[#141414] rounded-lg border border-[#333]">
                    <h3 className="font-semibold text-white mb-2">Inheritance Features</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <span className="font-medium text-[#FF5AF7]">Beneficiary Management</span>
                        <p className="text-sm mt-1">Designate multiple beneficiaries with different access levels and inheritance allocations.</p>
                      </li>
                      <li>
                        <span className="font-medium text-[#FF5AF7]">Proof-of-Life System</span>
                        <p className="text-sm mt-1">Configurable check-in requirements prevent premature vault access with customizable grace periods.</p>
                      </li>
                      <li>
                        <span className="font-medium text-[#FF5AF7]">Staged Release</span>
                        <p className="text-sm mt-1">Set up time-phased releases of assets or information based on dates or beneficiary actions.</p>
                      </li>
                      <li>
                        <span className="font-medium text-[#FF5AF7]">Cross-Chain Consolidation</span>
                        <p className="text-sm mt-1">Automatically converts and consolidates assets from multiple chains to the beneficiary's preferred blockchain.</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Call to Action */}
            <div className="text-center py-8 mt-12">
              <p className="text-gray-400 mb-6">For more detailed information and interactive demonstrations, visit our Revolutionary Features page:</p>
              <Button
                className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5500AB] hover:to-[#FF46E8] text-white font-bold rounded-lg px-6 py-3 shadow-glow hover:shadow-lg hover:shadow-[#FF5AF7]/40 transition-all"
                onClick={() => setLocation("/revolutionary-features")}
              >
                Explore Revolutionary Features
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}