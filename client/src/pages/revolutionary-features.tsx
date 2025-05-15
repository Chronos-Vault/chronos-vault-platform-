import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
// Header is now provided by the Layout component
import Footer from "@/components/layout/footer";

export default function RevolutionaryFeatures() {
  const [_, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#121212] to-[#1A1A1A] text-white">
      {/* Header is now provided by the Layout component */}
      <main className="flex-1 pb-20">
        <div className="container mx-auto px-4 py-12">
          <PageHeader
            heading="Revolutionary Vault Technologies"
            description="Explore our pioneering features that redefine blockchain security and privacy"
            separator={true}
          />

          {/* Triple Chain Security */}
          <section className="mt-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="px-2 sm:px-0">
                <div className="bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 w-fit rounded-full px-4 py-1.5 mb-4">
                  <span className="text-sm font-medium text-[#FF5AF7]">Chain Redundancy</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Triple-Chain </span>
                  <span className="animate-text-shine bg-gradient-to-r from-[#6B00D7] via-[#FF5AF7] to-[#6B00D7] bg-clip-text text-transparent bg-300% inline-block">Security</span>
                </h2>
                <p className="text-gray-300 text-base sm:text-lg mb-6 leading-relaxed">
                  Our revolutionary Triple-Chain Security system distributes your vault data across Ethereum, Solana, and TON networks simultaneously, creating an unprecedented level of protection against single-chain vulnerabilities.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <i className="ri-checkbox-circle-fill text-[#FF5AF7]"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Ethereum Security Layer</h4>
                      <p className="text-gray-400 text-sm sm:text-base">Leverages Ethereum's battle-tested security and robust consensus mechanisms as the primary security foundation.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <i className="ri-checkbox-circle-fill text-[#FF5AF7]"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Solana Speed Layer</h4>
                      <p className="text-gray-400 text-sm sm:text-base">Utilizes Solana's high-speed transactions and low-cost operations for quick access and responsive vault interactions.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <i className="ri-checkbox-circle-fill text-[#FF5AF7]"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">TON Backup Layer</h4>
                      <p className="text-gray-400 text-sm sm:text-base">Employs TON's scalable architecture as a resilient fallback system, ensuring continuous vault access under any circumstances.</p>
                    </div>
                  </div>
                </div>
                
                <Button
                  className="w-full sm:w-auto bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5500AB] hover:to-[#FF46E8] text-white font-bold rounded-lg px-6 py-3 shadow-glow hover:shadow-lg hover:shadow-[#FF5AF7]/40 transition-all"
                  onClick={() => setLocation("/vault-types")}
                >
                  Experience Triple-Chain Security
                </Button>
              </div>
              
              <div className="relative mt-8 md:mt-0">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] rounded-lg blur-sm opacity-75"></div>
                <div className="relative bg-[#1D1D1D] p-4 sm:p-6 rounded-lg border border-[#333] z-10">
                  <div className="rounded-lg bg-[#121212] p-4 sm:p-6 border border-[#333]">
                    <h3 className="text-lg sm:text-xl font-semibold mb-4 text-white">How Triple-Chain Security Works</h3>
                    
                    <div className="space-y-4 sm:space-y-6">
                      <div className="space-y-2">
                        <div className="font-medium text-[#FF5AF7]">1. Data Distribution</div>
                        <p className="text-gray-300 text-xs sm:text-sm">When you create a vault, essential vault data is cryptographically split and distributed across the three blockchain networks using Shamir's Secret Sharing algorithm.</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="font-medium text-[#FF5AF7]">2. Synchronization Mechanism</div>
                        <p className="text-gray-300 text-xs sm:text-sm">Our cross-chain validator network continuously monitors each blockchain for data consistency and integrity using secure multi-party computation protocols.</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="font-medium text-[#FF5AF7]">3. Fallback Protocols</div>
                        <p className="text-gray-300 text-xs sm:text-sm">In the event that any network becomes unavailable, the system automatically reconstructs vault data from the remaining networks with zero downtime.</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="font-medium text-[#FF5AF7]">4. Chain-Specific Advantages</div>
                        <p className="text-gray-300 text-xs sm:text-sm">Each chain provides unique security benefits: Ethereum's immutability, Solana's performance, and TON's capacity for complex recovery logic.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Cross-Chain Atomic Swaps */}
          <section className="mt-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="order-2 md:order-1 relative mt-8 md:mt-0">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF5AF7] to-blue-500 rounded-lg blur-sm opacity-75"></div>
                <div className="relative bg-[#1D1D1D] p-4 sm:p-6 rounded-lg border border-[#333] z-10">
                  <div className="rounded-lg bg-[#121212] p-4 sm:p-6 border border-[#333]">
                    <h3 className="text-lg sm:text-xl font-semibold mb-4 text-white">Technical Implementation</h3>
                    
                    <div className="space-y-4 sm:space-y-6">
                      <div className="space-y-2">
                        <div className="font-medium text-[#FF5AF7]">Hashlock Technology</div>
                        <p className="text-gray-300 text-xs sm:text-sm">Our atomic swaps utilize Hash Time-Locked Contracts (HTLCs) to ensure that either both sides of a swap complete successfully or neither does, eliminating counterparty risk.</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="font-medium text-[#FF5AF7]">Trustless Infrastructure</div>
                        <p className="text-gray-300 text-xs sm:text-sm">The entire swap process is handled by smart contracts with no intermediary custody, maintaining the trustless nature of decentralized technology.</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="font-medium text-[#FF5AF7]">Price Oracles</div>
                        <p className="text-gray-300 text-xs sm:text-sm">Integration with Chainlink price feeds ensures that price-triggered swaps execute based on reliable, tamper-proof market data.</p>
                      </div>
                      
                      <div className="bg-[#FF5AF7]/10 rounded p-3 border border-[#FF5AF7]/30">
                        <div className="flex items-center gap-2 mb-1">
                          <i className="ri-lightbulb-flash-line text-[#FF5AF7]"></i>
                          <span className="font-medium text-white text-sm">Example</span>
                        </div>
                        <p className="text-xs text-gray-300">A user stores ETH in a vault with a price trigger at $5,000. When ETH reaches this price, the system automatically converts a portion to stablecoins to lock in profits while maintaining the vault's time-lock properties.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-1 md:order-2 px-2 sm:px-0">
                <div className="bg-gradient-to-r from-[#FF5AF7]/20 to-blue-500/20 w-fit rounded-full px-4 py-1.5 mb-4">
                  <span className="text-sm font-medium text-[#FF5AF7]">Asset Conversion</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Cross-Chain </span>
                  <span className="animate-text-shine bg-gradient-to-r from-[#FF5AF7] via-blue-500 to-[#FF5AF7] bg-clip-text text-transparent bg-300% inline-block">Atomic Swaps</span>
                </h2>
                <p className="text-gray-300 text-base sm:text-lg mb-6 leading-relaxed">
                  Our revolutionary Cross-Chain Atomic Swap technology enables seamless asset conversions within your vault, allowing you to optimize your holdings without compromising security or time-lock guarantees.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#FF5AF7]/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <i className="ri-checkbox-circle-fill text-[#FF5AF7]"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Automatic Cross-Chain Conversions</h4>
                      <p className="text-gray-400 text-sm sm:text-base">Convert assets between Ethereum, Solana, TON, and other supported chains without ever leaving the security of your vault.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#FF5AF7]/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <i className="ri-checkbox-circle-fill text-[#FF5AF7]"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Price-Triggered Auto-Swaps</h4>
                      <p className="text-gray-400 text-sm sm:text-base">Set price thresholds that automatically trigger conversions between assets, allowing your vault to react to market conditions.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#FF5AF7]/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <i className="ri-checkbox-circle-fill text-[#FF5AF7]"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Yield Optimization Strategies</h4>
                      <p className="text-gray-400 text-sm sm:text-base">Choose from predefined strategies that optimize for growth, stability, or balanced returns while maintaining the security of your time-locked assets.</p>
                    </div>
                  </div>
                </div>
                
                <Button
                  className="w-full sm:w-auto bg-gradient-to-r from-[#FF5AF7] to-blue-500 hover:from-[#FF46E8] hover:to-blue-600 text-white font-bold rounded-lg px-6 py-3 shadow-glow hover:shadow-lg hover:shadow-[#FF5AF7]/40 transition-all"
                  onClick={() => setLocation("/create-vault")}
                >
                  Try Atomic Swaps
                </Button>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}