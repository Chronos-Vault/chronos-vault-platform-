import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Shield, 
  Lock, 
  Timer, 
  Globe, 
  Layers, 
  ArrowRight, 
  CheckCircle2,
  Zap,
  Users,
  Award,
  Target,
  Cpu,
  Network
} from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#6B00D7]/10 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#6B00D7]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-[#FF5AF7]/15 rounded-full blur-[120px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6B00D7]/10 border border-[#6B00D7]/30 mb-6">
              <Shield className="h-4 w-4 text-[#6B00D7]" />
              <span className="text-sm text-[#6B00D7] font-medium">Powered by Trinity Protocol™ v3.5.23</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
                The Future of
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] bg-clip-text text-transparent">
                Digital Asset Security
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Chronos Vault combines military-grade cryptography with multi-chain consensus 
              to deliver mathematically provable security for your digital assets.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/vault-types">
                <Button size="lg" className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90 text-white px-8 py-6 text-lg">
                  Explore Vaults
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/monitoring">
                <Button size="lg" variant="outline" className="border-[#333] hover:border-[#6B00D7] px-8 py-6 text-lg">
                  View Trinity Scan
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-[#1a1a1a]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] bg-clip-text text-transparent mb-2">3</div>
              <div className="text-gray-400">Active Chains</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] bg-clip-text text-transparent mb-2">8</div>
              <div className="text-gray-400">Security Layers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] bg-clip-text text-transparent mb-2">2-of-3</div>
              <div className="text-gray-400">Consensus Required</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] bg-clip-text text-transparent mb-2">100%</div>
              <div className="text-gray-400">Wallet-Based Auth</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trinity Protocol Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">Trinity Protocol</span>
              <span className="text-[#6B00D7]">™</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              A mathematically provable 2-of-3 consensus verification system across three independent blockchains
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-[#2a2a2a] hover:border-[#6B00D7]/50 transition-all group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-3xl">⟠</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Arbitrum Sepolia</h3>
                <p className="text-sm text-gray-400 mb-4">Primary Security & Smart Contracts</p>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Live on Testnet
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-[#2a2a2a] hover:border-[#FF5AF7]/50 transition-all group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-3xl">◎</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Solana Devnet</h3>
                <p className="text-sm text-gray-400 mb-4">High-Frequency Monitoring</p>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Live on Devnet
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-[#2a2a2a] hover:border-cyan-500/50 transition-all group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-3xl">💎</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">TON Testnet</h3>
                <p className="text-sm text-gray-400 mb-4">Quantum-Resistant Recovery</p>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Live on Testnet
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="max-w-3xl mx-auto">
            <Card className="bg-gradient-to-r from-[#6B00D7]/10 to-[#FF5AF7]/10 border-[#6B00D7]/30">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-[#6B00D7]" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Verified On-Chain Operations</h4>
                    <p className="text-gray-400 text-sm">
                      All critical operations require cryptographic proof from at least 2 of 3 validator chains before execution. 
                      This multi-chain consensus makes single-point failures mathematically impossible.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mathematical Defense Layer */}
      <section className="py-24 bg-gradient-to-b from-[#0A0A0A] via-[#0f0f0f] to-[#0A0A0A]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF5AF7]/10 border border-[#FF5AF7]/30 mb-6">
              <Layers className="h-4 w-4 text-[#FF5AF7]" />
              <span className="text-sm text-[#FF5AF7] font-medium">8 Cryptographic Layers</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Mathematical Defense Layer™
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Every security claim is mathematically provable, not just audited
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {[
              { icon: Lock, title: "Zero-Knowledge Proofs", desc: "Groth16 ZK-SNARKs", status: "active" },
              { icon: Shield, title: "Formal Verification", desc: "Lean 4 Theorem Prover", status: "complete" },
              { icon: Users, title: "MPC Key Management", desc: "Shamir + CRYSTALS-Kyber", status: "active" },
              { icon: Timer, title: "VDF Time-Locks", desc: "Wesolowski VDF", status: "active" },
              { icon: Cpu, title: "AI + Crypto Governance", desc: "Zero-Trust Automation", status: "active" },
              { icon: Globe, title: "Quantum-Resistant", desc: "ML-KEM + Dilithium-5", status: "active" },
              { icon: Network, title: "Trinity Protocol™", desc: "2-of-3 Multi-Chain", status: "live" },
              { icon: Shield, title: "Trinity Shield™", desc: "Hardware TEE (SGX/SEV)", status: "active" },
            ].map((layer, idx) => (
              <Card key={idx} className="bg-[#141414] border-[#252525] hover:border-[#6B00D7]/50 transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#6B00D7]/10 flex items-center justify-center flex-shrink-0">
                      <layer.icon className="h-5 w-5 text-[#6B00D7]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white text-sm mb-1 truncate">{layer.title}</h4>
                      <p className="text-xs text-gray-500 mb-2">{layer.desc}</p>
                      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs ${
                        layer.status === 'live' 
                          ? 'bg-green-500/10 text-green-400' 
                          : layer.status === 'complete'
                          ? 'bg-blue-500/10 text-blue-400'
                          : 'bg-[#6B00D7]/10 text-[#6B00D7]'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          layer.status === 'live' ? 'bg-green-400 animate-pulse' : 
                          layer.status === 'complete' ? 'bg-blue-400' : 'bg-[#6B00D7]'
                        }`} />
                        {layer.status === 'live' ? 'Live' : layer.status === 'complete' ? 'Complete' : 'Active'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Why Chronos Vault?
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Enterprise-grade security meets beautiful design
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#252525]">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center mb-6">
                <Lock className="h-7 w-7 text-[#6B00D7]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Time-Locked Vaults</h3>
              <p className="text-gray-400">
                Create immutable time-locks that even you cannot bypass. Perfect for generational wealth, 
                scheduled distributions, and investment discipline.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#252525]">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center mb-6">
                <Zap className="h-7 w-7 text-[#FF5AF7]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">HTLC Atomic Swaps</h3>
              <p className="text-gray-400">
                Trustless cross-chain swaps powered by Hash Time-Locked Contracts. 
                Trade between Arbitrum, Solana, and TON with Trinity consensus.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#252525]">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center mb-6">
                <Users className="h-7 w-7 text-[#6B00D7]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Multi-Sig Security</h3>
              <p className="text-gray-400">
                Add beneficiaries, emergency contacts, and multi-signature requirements. 
                Configure complex access rules for enterprise needs.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#252525]">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center mb-6">
                <Award className="h-7 w-7 text-[#FF5AF7]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Gift Crypto Vaults</h3>
              <p className="text-gray-400">
                Send crypto gifts for birthdays, holidays, and special occasions. 
                Beautiful unwrapping experience with time-locks and recovery options.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#252525]">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center mb-6">
                <Target className="h-7 w-7 text-[#6B00D7]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Trinity Scan Explorer</h3>
              <p className="text-gray-400">
                Full visibility into all cross-chain operations. Monitor transactions, 
                consensus status, and validator activity in real-time.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#252525]">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center mb-6">
                <Globe className="h-7 w-7 text-[#FF5AF7]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">7+ Cryptocurrencies</h3>
              <p className="text-gray-400">
                Support for ETH, ARB, SOL, TON, CVT, USDC, and USDT. 
                Network selection for stablecoins across Ethereum, Tron, Arbitrum, and more.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-24 bg-gradient-to-b from-[#0A0A0A] to-[#0f0f0f]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">
              Our Mission
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              We're building a decentralized future where digital asset security transcends time, 
              enabling generational wealth preservation, strategic investment discipline, 
              and transparent fund management — all protected by mathematically provable security.
            </p>
            <div className="inline-flex items-center gap-3">
              <div className="h-1 w-16 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] rounded-full" />
              <p className="text-lg font-medium text-[#6B00D7]">Transforming time into a strategic asset</p>
              <div className="h-1 w-16 bg-gradient-to-r from-[#FF5AF7] to-[#6B00D7] rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20" />
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-[#6B00D7]/30 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-[#FF5AF7]/20 rounded-full blur-[150px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Ready to Secure Your Assets?
            </h2>
            <p className="text-xl text-gray-300 mb-10">
              Join the future of decentralized asset security with Chronos Vault
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/vault-types">
                <Button size="lg" className="bg-white text-black hover:bg-gray-100 px-8 py-6 text-lg font-semibold">
                  Create Your First Vault
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/gift-crypto">
                <Button size="lg" variant="outline" className="border-white/30 hover:border-white text-white px-8 py-6 text-lg">
                  Send a Crypto Gift
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Tagline */}
      <section className="py-12 border-t border-[#1a1a1a]">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            <span className="text-[#6B00D7]">Chronos Vault</span> — Mathematically Proven. Hardware Protected.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
