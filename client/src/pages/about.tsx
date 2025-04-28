import { Link } from "wouter";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Shield, Lock, Timer, UserCheck, Globe, Layers } from "lucide-react";

const About = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-b from-[#6B00D7]/10 to-transparent"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-[#FF5AF7]/5 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-[#6B00D7]/5 blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-poppins font-bold text-4xl md:text-5xl mb-6">
              The <span className="text-[#6B00D7]">Swiss Bank</span> of Web3
            </h1>
            <p className="text-gray-300 text-lg mb-10">
              Chronos Vault redefines time-locked assets for the decentralized world, combining 
              military-grade security with elegant design and trustless operation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/create-vault">
                <Button className="cta-button bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] px-8 py-6 rounded-lg font-poppins font-medium text-white shadow-lg hover:shadow-xl hover:shadow-[#6B00D7]/20 transition-all">
                  Start Creating Your Vault
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Mission Section */}
      <section className="py-16 bg-[#121212]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="font-poppins font-bold text-3xl mb-6">Our <span className="text-[#6B00D7]">Mission</span></h2>
              <p className="text-gray-300 mb-6">
                Our mission is to empower individuals and organizations to secure their digital assets with 
                unbreakable time-locked vaults, providing peace of mind and strategic control over their 
                blockchain wealth.
              </p>
              <p className="text-gray-300 mb-6">
                We are building a decentralized future where financial security transcends time, enabling 
                generational wealth preservation, strategic investment discipline, and transparent fund management.
              </p>
              <div className="flex items-center gap-3">
                <div className="h-1 w-12 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] rounded-full"></div>
                <p className="text-lg font-poppins font-medium">Transforming time into a strategic asset</p>
              </div>
            </div>
            
            <div className="order-1 md:order-2 flex justify-center">
              <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
                <div className="absolute inset-0 rounded-full border-4 border-dashed border-[#6B00D7]/30 animate-spin opacity-70" style={{animationDuration: '40s'}}></div>
                <div className="absolute inset-10 rounded-full border-4 border-dashed border-[#FF5AF7]/20 animate-spin opacity-70" style={{animationDuration: '30s', animationDirection: 'reverse'}}></div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-40 h-40 md:w-48 md:h-48 bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/20 rounded-3xl border border-[#333333] glow-border flex items-center justify-center animate-float">
                    <div className="text-center p-6">
                      <div className="font-poppins font-semibold text-2xl text-white mb-2">Chronos</div>
                      <div className="h-1 w-12 mx-auto bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] rounded-full mb-2"></div>
                      <p className="text-gray-300 text-sm">Commanding time through blockchain technology</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 bg-[#1A1A1A]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-poppins font-bold text-3xl">Our Core <span className="text-[#6B00D7]">Values</span></h2>
            <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
              The principles that guide our vision and development of the most secure vault system on the blockchain.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="vault-card bg-[#1E1E1E] border border-[#333333] rounded-xl overflow-hidden hover:border-[#6B00D7]/50 transition-all">
              <CardHeader className="pb-4">
                <div className="h-14 w-14 flex items-center justify-center rounded-lg bg-[#6B00D7]/10 mb-4">
                  <Shield className="h-6 w-6 text-[#6B00D7]" />
                </div>
                <CardTitle>Uncompromising Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  We prioritize security above all else, utilizing battle-tested smart contracts, thorough audits, and 
                  decentralized architecture to ensure your assets remain protected in all circumstances.
                </p>
              </CardContent>
            </Card>
            
            <Card className="vault-card bg-[#1E1E1E] border border-[#333333] rounded-xl overflow-hidden hover:border-[#6B00D7]/50 transition-all">
              <CardHeader className="pb-4">
                <div className="h-14 w-14 flex items-center justify-center rounded-lg bg-[#6B00D7]/10 mb-4">
                  <Lock className="h-6 w-6 text-[#6B00D7]" />
                </div>
                <CardTitle>True Decentralization</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  We believe in the power of trustless systems, creating a vault network that operates without reliance 
                  on central authorities, ensuring your assets remain in your control.
                </p>
              </CardContent>
            </Card>
            
            <Card className="vault-card bg-[#1E1E1E] border border-[#333333] rounded-xl overflow-hidden hover:border-[#6B00D7]/50 transition-all">
              <CardHeader className="pb-4">
                <div className="h-14 w-14 flex items-center justify-center rounded-lg bg-[#6B00D7]/10 mb-4">
                  <Timer className="h-6 w-6 text-[#6B00D7]" />
                </div>
                <CardTitle>Time as an Asset</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  We recognize the strategic value of time constraints in wealth management, enabling users to 
                  harness the power of time-locking for generational planning and investment discipline.
                </p>
              </CardContent>
            </Card>
            
            <Card className="vault-card bg-[#1E1E1E] border border-[#333333] rounded-xl overflow-hidden hover:border-[#6B00D7]/50 transition-all">
              <CardHeader className="pb-4">
                <div className="h-14 w-14 flex items-center justify-center rounded-lg bg-[#6B00D7]/10 mb-4">
                  <UserCheck className="h-6 w-6 text-[#6B00D7]" />
                </div>
                <CardTitle>User Empowerment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  We design intuitive, accessible interfaces that make sophisticated vault technology available to 
                  everyone, regardless of their technical expertise in blockchain systems.
                </p>
              </CardContent>
            </Card>
            
            <Card className="vault-card bg-[#1E1E1E] border border-[#333333] rounded-xl overflow-hidden hover:border-[#6B00D7]/50 transition-all">
              <CardHeader className="pb-4">
                <div className="h-14 w-14 flex items-center justify-center rounded-lg bg-[#6B00D7]/10 mb-4">
                  <Layers className="h-6 w-6 text-[#6B00D7]" />
                </div>
                <CardTitle>Elegant Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  We believe security can be beautiful, merging cutting-edge blockchain technology with luxurious design 
                  to create an experience that feels both powerful and refined.
                </p>
              </CardContent>
            </Card>
            
            <Card className="vault-card bg-[#1E1E1E] border border-[#333333] rounded-xl overflow-hidden hover:border-[#6B00D7]/50 transition-all">
              <CardHeader className="pb-4">
                <div className="h-14 w-14 flex items-center justify-center rounded-lg bg-[#6B00D7]/10 mb-4">
                  <Globe className="h-6 w-6 text-[#6B00D7]" />
                </div>
                <CardTitle>Global Accessibility</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  We are building a borderless vault system that enables anyone, anywhere to secure their digital assets 
                  without reliance on traditional financial systems or geographic limitations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Technology Section */}
      <section className="py-20 bg-[#121212] relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-[#6B00D7]/5 blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-[#FF5AF7]/5 blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-poppins font-bold text-3xl">Advanced <span className="text-[#6B00D7]">Technology</span></h2>
            <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
              The technical foundation that powers our revolutionary time-locked vault system.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="bg-[#1E1E1E] border border-[#333333]">
              <CardHeader>
                <CardTitle className="text-2xl">Smart Contract Architecture</CardTitle>
                <CardDescription>
                  The backbone of our secure vault system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300">
                  Chronos Vault is built on a foundation of thoroughly audited, non-custodial smart contracts 
                  that enforce time-locks at the protocol level, making them impossible to bypass.
                </p>
                
                <div className="bg-[#121212] p-4 rounded-lg border border-[#333333]">
                  <div className="flex items-start mb-4">
                    <div className="p-2 rounded-full bg-[#6B00D7]/10 mr-3">
                      <i className="ri-fingerprint-line text-[#6B00D7]"></i>
                    </div>
                    <div>
                      <div className="font-medium">Non-Custodial Design</div>
                      <p className="text-sm text-gray-400">
                        Your assets remain under your control at all times, with vault operations executed entirely on-chain.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start mb-4">
                    <div className="p-2 rounded-full bg-[#6B00D7]/10 mr-3">
                      <i className="ri-lock-line text-[#6B00D7]"></i>
                    </div>
                    <div>
                      <div className="font-medium">Time Lock Mechanism</div>
                      <p className="text-sm text-gray-400">
                        Cryptographically enforced time constraints that cannot be manipulated or overridden.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="p-2 rounded-full bg-[#6B00D7]/10 mr-3">
                      <i className="ri-shield-check-line text-[#6B00D7]"></i>
                    </div>
                    <div>
                      <div className="font-medium">Security Audits</div>
                      <p className="text-sm text-gray-400">
                        Multiple independent security audits by leading blockchain security firms.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#1E1E1E] border border-[#333333]">
              <CardHeader>
                <CardTitle className="text-2xl">Blockchain Compatibility</CardTitle>
                <CardDescription>
                  Cross-chain support for maximum flexibility
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300">
                  Our vault system is designed to work across multiple blockchain networks, providing 
                  flexibility and future-proofing your assets against network-specific risks.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#121212] p-4 rounded-lg border border-[#333333] flex items-center">
                    <i className="ri-ethereum-line text-2xl mr-3 text-gray-400"></i>
                    <div>
                      <div className="font-medium">Ethereum</div>
                      <p className="text-xs text-gray-400">Primary Network</p>
                    </div>
                  </div>
                  
                  <div className="bg-[#121212] p-4 rounded-lg border border-[#333333] flex items-center">
                    <i className="ri-layout-grid-line text-2xl mr-3 text-gray-400"></i>
                    <div>
                      <div className="font-medium">Polygon</div>
                      <p className="text-xs text-gray-400">Layer 2 Support</p>
                    </div>
                  </div>
                  
                  <div className="bg-[#121212] p-4 rounded-lg border border-[#333333] flex items-center">
                    <i className="ri-bit-coin-line text-2xl mr-3 text-gray-400"></i>
                    <div>
                      <div className="font-medium">Bitcoin</div>
                      <p className="text-xs text-gray-400">Via Wrapped Assets</p>
                    </div>
                  </div>
                  
                  <div className="bg-[#121212] p-4 rounded-lg border border-[#333333] flex items-center">
                    <i className="ri-seedling-line text-2xl mr-3 text-gray-400"></i>
                    <div>
                      <div className="font-medium">Solana</div>
                      <p className="text-xs text-gray-400">Coming Soon</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-[#0F0F0F] relative overflow-hidden">
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-[#6B00D7]/5 blur-3xl"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-poppins font-bold text-3xl">How <span className="text-[#6B00D7]">Chronos Vault</span> Works</h2>
            <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
              Understanding the revolutionary blockchain architecture that powers our secure time-locked vaults.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="mb-16 bg-[#1A1A1A] border border-[#333] p-6 rounded-xl relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6B00D7]/50 to-[#FF5AF7]/50 rounded-xl blur opacity-30"></div>
              <div className="relative">
                <h3 className="text-2xl font-bold mb-4 text-white">Triple-Chain Security System</h3>
                <p className="text-gray-300 mb-6">
                  At the heart of Chronos Vault is our revolutionary Triple-Chain Security system that distributes critical vault data across Ethereum, Solana, and TON blockchain networks simultaneously. This architecture provides unprecedented protection against blockchain-specific vulnerabilities.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-[#151515] p-4 rounded-lg border border-[#333] hover:border-[#6B00D7]/30 transition-all">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 rounded-full bg-[#6B00D7]/10 flex items-center justify-center mr-3">
                        <i className="ri-ethereum-line text-[#6B00D7]"></i>
                      </div>
                      <h4 className="font-medium text-white">Ethereum Layer</h4>
                    </div>
                    <p className="text-sm text-gray-400">
                      Primary security layer that handles vault verification and manages smart contract security governance.
                    </p>
                  </div>
                  
                  <div className="bg-[#151515] p-4 rounded-lg border border-[#333] hover:border-[#FF5AF7]/30 transition-all">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 rounded-full bg-[#FF5AF7]/10 flex items-center justify-center mr-3">
                        <i className="ri-speed-line text-[#FF5AF7]"></i>
                      </div>
                      <h4 className="font-medium text-white">Solana Layer</h4>
                    </div>
                    <p className="text-sm text-gray-400">
                      High-speed transaction layer that manages real-time operations and time calculations with microsecond precision.
                    </p>
                  </div>
                  
                  <div className="bg-[#151515] p-4 rounded-lg border border-[#333] hover:border-[#00C9FF]/30 transition-all">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 rounded-full bg-[#00C9FF]/10 flex items-center justify-center mr-3">
                        <i className="ri-database-2-line text-[#00C9FF]"></i>
                      </div>
                      <h4 className="font-medium text-white">TON Layer</h4>
                    </div>
                    <p className="text-sm text-gray-400">
                      Fault-tolerant backup layer that provides additional data redundancy and recovery capabilities in case of emergency.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-12">
              <div className="relative">
                <div className="absolute left-10 top-0 ml-0.5 h-full w-0.5 bg-gradient-to-b from-[#6B00D7] via-[#FF5AF7] to-[#00C9FF]"></div>
                  
                <div className="relative flex">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] text-white z-10">1</div>
                  <div className="ml-6">
                    <h3 className="font-semibold text-xl text-white mb-3">Vault Creation & Asset Deposit</h3>
                    <p className="text-gray-300 mb-4">
                      When you create a vault, Chronos Vault initializes parallel vault instances on Ethereum, Solana, and TON. Your assets are secured using threshold signature schemes that require consensus from multiple blockchain networks to access.
                    </p>
                    <div className="bg-[#151515] p-4 rounded-lg border border-[#333]">
                      <div className="font-medium text-[#FF5AF7] mb-2">Secure Key Management</div>
                      <p className="text-sm text-gray-400">
                        Your vault keys are cryptographically split using Shamir's Secret Sharing algorithm, with fragments distributed across all three blockchains. This ensures no single blockchain compromise can affect your assets.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="relative flex">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] text-white z-10">2</div>
                  <div className="ml-6">
                    <h3 className="font-semibold text-xl text-white mb-3">Time-Lock Enforcement</h3>
                    <p className="text-gray-300 mb-4">
                      Time-locks are enforced through a consensus mechanism where multiple blockchain oracles must agree on the current time. This prevents any single blockchain's time manipulation from affecting your vault's lock period.
                    </p>
                    <div className="bg-[#151515] p-4 rounded-lg border border-[#333]">
                      <div className="font-medium text-[#FF5AF7] mb-2">Multi-Chain Verification</div>
                      <p className="text-sm text-gray-400">
                        At least two of the three chains must confirm the time-lock expiration before assets can be accessed, providing protection against blockchain-specific vulnerabilities.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="relative flex">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] text-white z-10">3</div>
                  <div className="ml-6">
                    <h3 className="font-semibold text-xl text-white mb-3">Continuous Synchronization</h3>
                    <p className="text-gray-300 mb-4">
                      Our Cross-Chain Validator Network continuously monitors all three blockchains, ensuring data consistency and integrity. This network of decentralized validators manages checkpoint synchronization across chains.
                    </p>
                    <div className="bg-[#151515] p-4 rounded-lg border border-[#333]">
                      <div className="font-medium text-[#FF5AF7] mb-2">Automatic Failover</div>
                      <p className="text-sm text-gray-400">
                        If any blockchain becomes unavailable or compromised, the system automatically falls back to the remaining chains without any user intervention required.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="relative flex">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] text-white z-10">4</div>
                  <div className="ml-6">
                    <h3 className="font-semibold text-xl text-white mb-3">Vault Unlocking & Asset Withdrawal</h3>
                    <p className="text-gray-300 mb-4">
                      When your time-lock expires, the multi-chain consensus mechanism verifies the unlock conditions across all active chains. Upon verification, your assets are released back to your control with the same security guarantees.
                    </p>
                    <div className="bg-[#151515] p-4 rounded-lg border border-[#333]">
                      <div className="font-medium text-[#FF5AF7] mb-2">User Experience</div>
                      <p className="text-sm text-gray-400">
                        While the underlying technology is complex, our user interface abstracts away this complexity. You interact with a single, unified vault experience while benefiting from multi-chain security behind the scenes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="py-20 bg-[#1A1A1A]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-poppins font-bold text-3xl">Our <span className="text-[#6B00D7]">Team</span></h2>
            <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
              A collective of blockchain specialists, security experts, and visionary designers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="bg-[#1E1E1E] border border-[#333333] overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-[#6B00D7]/20 to-[#6B00D7]/5 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-[#1E1E1E] flex items-center justify-center text-3xl font-bold text-[#6B00D7]">
                  A
                </div>
              </div>
              <CardContent className="p-6 text-center">
                <h3 className="font-poppins font-semibold text-xl mb-1">Alexandra Reed</h3>
                <p className="text-[#FF5AF7] text-sm mb-3">Founder & CEO</p>
                <p className="text-gray-400 text-sm">
                  Blockchain security specialist with 8+ years experience in cryptographic systems and smart contract development.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-[#1E1E1E] border border-[#333333] overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-[#6B00D7]/20 to-[#6B00D7]/5 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-[#1E1E1E] flex items-center justify-center text-3xl font-bold text-[#6B00D7]">
                  M
                </div>
              </div>
              <CardContent className="p-6 text-center">
                <h3 className="font-poppins font-semibold text-xl mb-1">Marcus Chen</h3>
                <p className="text-[#FF5AF7] text-sm mb-3">CTO</p>
                <p className="text-gray-400 text-sm">
                  Former lead developer at a major cryptocurrency exchange, specialized in secure wallet systems and blockchain architecture.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-[#1E1E1E] border border-[#333333] overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-[#6B00D7]/20 to-[#6B00D7]/5 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-[#1E1E1E] flex items-center justify-center text-3xl font-bold text-[#6B00D7]">
                  K
                </div>
              </div>
              <CardContent className="p-6 text-center">
                <h3 className="font-poppins font-semibold text-xl mb-1">Kira Nakamura</h3>
                <p className="text-[#FF5AF7] text-sm mb-3">Lead Designer</p>
                <p className="text-gray-400 text-sm">
                  Award-winning UI/UX designer focused on creating elegant, accessible interfaces for complex blockchain applications.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-[#121212] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]"></div>
        <div className="absolute top-1/4 -left-10 w-60 h-60 rounded-full bg-[#6B00D7]/10 blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-[#FF5AF7]/5 blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <Card className="max-w-3xl mx-auto bg-[#1E1E1E] border border-[#333333] rounded-2xl p-8 md:p-12 shadow-xl">
            <CardContent className="p-0">
              <div className="text-center mb-8">
                <h2 className="font-poppins font-bold text-3xl mb-4">Join the Future of Digital Asset Security</h2>
                <p className="text-gray-400">
                  Start building your time-locked vault today and become part of the movement 
                  redefining how assets are secured and transferred in the blockchain era.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/create-vault">
                  <Button className="cta-button bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] px-8 py-4 rounded-lg font-poppins font-medium text-white shadow-lg hover:shadow-xl hover:shadow-[#6B00D7]/20 transition-all">
                    Create Your First Vault
                  </Button>
                </Link>
                <Link href="/#how-it-works">
                  <Button variant="outline" className="px-8 py-4 rounded-lg bg-[#1A1A1A] border border-[#6B00D7]/30 text-white font-poppins font-medium hover:border-[#6B00D7] transition-all">
                    Learn How It Works
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
};

export default About;
