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
                  
                  <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link href="/technical-specification" className="block">
                      <div className="bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/10 border border-[#6B00D7]/30 rounded-lg p-4 hover:from-[#6B00D7]/30 hover:to-[#FF5AF7]/20 transition-all">
                        <h4 className="font-semibold text-white flex items-center gap-2">
                          <span className="text-xl">🧪</span>
                          Technical Specifications
                        </h4>
                        <p className="text-gray-300 mt-1">Explore the detailed technical architecture and specifications of the Chronos Vault platform.</p>
                      </div>
                    </Link>
                    <Link href="/cvt-tokenomics" className="block">
                      <div className="bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/10 border border-[#6B00D7]/30 rounded-lg p-4 hover:from-[#6B00D7]/30 hover:to-[#FF5AF7]/20 transition-all">
                        <h4 className="font-semibold text-white flex items-center gap-2">
                          <span className="text-xl">📊</span>
                          CVT Tokenomics
                        </h4>
                        <p className="text-gray-300 mt-1">Learn about the ChronosVault Token (CVT), its deflationary model, and distribution schedule.</p>
                      </div>
                    </Link>
                    <Link href="/project-whitepaper" className="block">
                      <div className="bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/10 border border-[#6B00D7]/30 rounded-lg p-4 hover:from-[#6B00D7]/30 hover:to-[#FF5AF7]/20 transition-all">
                        <h4 className="font-semibold text-white flex items-center gap-2">
                          <span className="text-xl">📑</span>
                          Project Whitepaper
                        </h4>
                        <p className="text-gray-300 mt-1">Read the comprehensive overview of the Chronos Vault platform, architecture, and vision.</p>
                      </div>
                    </Link>
                    <Link href="/whitepaper" className="block">
                      <div className="bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/10 border border-[#6B00D7]/30 rounded-lg p-4 hover:from-[#6B00D7]/30 hover:to-[#FF5AF7]/20 transition-all">
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
                  Permanent Storage
                </h2>
                
                <div className="space-y-4 text-gray-300">
                  <p>
                    Chronos Vault integrates with decentralized storage networks to provide permanent, tamper-proof storage for vault contents that endures far beyond the lifetime of traditional storage systems.
                  </p>
                  
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
                  Ethereum Integration
                </h2>
                
                <div className="space-y-4 text-gray-300">
                  <p>
                    Ethereum integration provides robust security and programmability through ERC-4626 compliant tokenized vaults and advanced smart contracts that enable conditional unlocking and multi-signature control.
                  </p>
                  
                  <div className="bg-[#141414] rounded-lg border border-[#333] p-4">
                    <h3 className="font-semibold text-white mb-2">Ethereum Features</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>ERC-4626 compliant tokenized vaults for maximum interoperability</li>
                      <li>Multi-signature vault control with customizable thresholds</li>
                      <li>Integration with Ethereum Name Service (ENS) for user-friendly addressing</li>
                      <li>Support for all ERC-20 tokens and ERC-721/ERC-1155 NFTs</li>
                      <li>Layer 2 integration with Polygon, Arbitrum, and Optimism for lower fees</li>
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