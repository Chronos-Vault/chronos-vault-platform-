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
                      <a href="#storage" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6B00D7]"></span>
                        Permanent Storage
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-[#FF5AF7] font-medium mb-2">Blockchain Integrations</h4>
                  <ul className="space-y-2 pl-2">
                    <li>
                      <a href="#ethereum" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6B00D7]"></span>
                        Ethereum Integration
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
                      <li>Multi-chain architecture with Ethereum, Solana, and TON integration</li>
                      <li>Triple-chain security model for unprecedented reliability</li>
                      <li>Cross-chain atomic swaps for asset conversion while time-locked</li>
                      <li>Permanent storage through IPFS and Arweave integration</li>
                      <li>Smart conditional unlocking based on market events or security parameters</li>
                    </ul>
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
                    Our revolutionary Triple-Chain Security system distributes your vault data across Ethereum, Solana, and TON networks simultaneously, creating an unprecedented level of protection against single-chain vulnerabilities.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="p-4 bg-[#141414] rounded-lg border border-[#333]">
                      <h4 className="font-semibold text-white mb-2">Ethereum Layer</h4>
                      <p className="text-sm">Provides robust security and immutability as the primary security foundation.</p>
                    </div>
                    <div className="p-4 bg-[#141414] rounded-lg border border-[#333]">
                      <h4 className="font-semibold text-white mb-2">Solana Layer</h4>
                      <p className="text-sm">Enables high-speed transactions and responsive vault interactions.</p>
                    </div>
                    <div className="p-4 bg-[#141414] rounded-lg border border-[#333]">
                      <h4 className="font-semibold text-white mb-2">TON Layer</h4>
                      <p className="text-sm">Acts as a resilient fallback system with complex recovery logic capabilities.</p>
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

            {/* More sections would follow for other core features */}
            <div className="text-center py-8">
              <p className="text-gray-400 mb-6">For more detailed information on other features, please see our Revolutionary Features page:</p>
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