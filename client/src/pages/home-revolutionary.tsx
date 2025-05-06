import React, { useEffect } from 'react';
import { useLocation } from "wouter";
import SecurityRatingCard from "@/components/security/SecurityRatingCard";
import RevolutionaryHero from "@/components/hero/RevolutionaryHero";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { motion } from 'framer-motion';
import { useCVTToken } from "@/contexts/cvt-token-context";

const Home = () => {
  const [_, setLocation] = useLocation();
  const { tokenBalance } = useCVTToken();

  // Sample vault data for display purposes
  const sampleVault = {
    id: 1,
    userId: 1,
    name: "Legacy Vault",
    description: "My legacy assets for future generations",
    vaultType: "legacy",
    assetType: "ETH",
    assetAmount: "25.48",
    timeLockPeriod: 730, // 2 years
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
    unlockDate: new Date(Date.now() + 640 * 24 * 60 * 60 * 1000), // ~1.75 years from now
    isLocked: true,
    securityLevel: 3,
    ethereumContractAddress: "0x1234...",
    solanaContractAddress: "9z4E...",
    tonContractAddress: "EQA9...",
    unlockConditionType: "date",
    privacyEnabled: true,
    crossChainEnabled: true,
    metadata: {
      securityLayers: ["ethereum", "solana", "ton"],
      storageType: "ipfs",
      atomicSwapsEnabled: true,
      zkProofs: true
    }
  };

  // Handle smooth scrolling for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && anchor.hash && anchor.hash.startsWith('#')) {
        e.preventDefault();
        const targetId = anchor.hash;
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  const FeatureCard = ({ icon, title, description }: { icon: string, title: string, description: string }) => (
    <motion.div 
      className="bg-gradient-to-b from-[#0F0F15] to-[#080810] border border-[#6B00D7]/20 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-[#6B00D7]/10 transition-all h-full"
      whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(107, 0, 215, 0.2)' }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <div className="p-6 h-full flex flex-col">
        <div className="mb-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center">
            <i className={`${icon} text-[#FF5AF7] text-xl`}></i>
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-3 text-white">{title}</h3>
        <p className="text-gray-400 flex-grow">{description}</p>
      </div>
    </motion.div>
  );

  return (
    <div className="flex flex-col bg-[#050505] text-white font-poppins">
      <main className="flex-1">
        {/* Hero Section using RevolutionaryHero component */}
        <RevolutionaryHero onCreateVault={() => setLocation("/create-vault")} />
        
        {/* Triple-Chain Security Architecture Section */}
        <section id="features" className="py-20 md:py-28 bg-gradient-to-b from-[#050505] to-[#0A0A10] overflow-hidden relative border-t border-[#6B00D7]/10">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-[10%] left-[5%] w-32 h-32 rounded-full bg-[#6B00D7]/10 blur-3xl"></div>
            <div className="absolute bottom-[20%] right-[10%] w-40 h-40 rounded-full bg-[#FF5AF7]/10 blur-3xl"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="flex flex-col lg:flex-row gap-16 items-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="lg:w-1/2 order-2 lg:order-1 space-y-6">
                <motion.h2 
                  className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  Triple-Chain Security Architecture
                </motion.h2>
                <motion.p 
                  className="text-gray-300 mb-8 text-lg leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  Chronos Vault leverages the unique capabilities of multiple blockchains to provide unprecedented security, performance, and functionality that no single-chain solution can match.
                </motion.p>
                
                <div className="space-y-8">
                  <motion.div 
                    className="flex gap-5"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    viewport={{ once: true, margin: "-100px" }}
                  >
                    <div className="h-14 w-14 flex-shrink-0 rounded-xl bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center border border-[#6B00D7]/30">
                      <i className="ri-shield-check-line text-2xl text-[#FF5AF7]"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Triple-Chain Security Matrix</h3>
                      <p className="text-gray-400">Your assets are secured across Ethereum, Solana, and TON simultaneously, creating a security matrix that's effectively impenetrable by design.</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex gap-5"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    viewport={{ once: true, margin: "-100px" }}
                  >
                    <div className="h-14 w-14 flex-shrink-0 rounded-xl bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center border border-[#6B00D7]/30">
                      <i className="ri-link-m text-2xl text-[#FF5AF7]"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Quantum-Resistant Cross-Chain Bridge</h3>
                      <p className="text-gray-400">Our proprietary bridge technology ensures seamless asset flow across blockchains with quantum-resistant cryptography and zero-knowledge verification.</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex gap-5"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    viewport={{ once: true, margin: "-100px" }}
                  >
                    <div className="h-14 w-14 flex-shrink-0 rounded-xl bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center border border-[#6B00D7]/30">
                      <i className="ri-cpu-line text-2xl text-[#FF5AF7]"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Blockchain-Optimized Operations</h3>
                      <p className="text-gray-400">We select the ideal blockchain for each operation — TON for speed, Ethereum for smart contracts, Solana for scalability — giving you the best of each network.</p>
                    </div>
                  </motion.div>
                </div>
              </div>
              
              <motion.div 
                className="lg:w-1/2 order-1 lg:order-2 relative"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                {/* Triple Chain Security Visualization */}
                <div className="relative max-w-lg mx-auto">
                  <SecurityRatingCard />
                </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
            
        {/* Revolutionary Security Features */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-[#0A0A10] to-[#050505]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <motion.h2 
                className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                Revolutionary Security Architecture
              </motion.h2>
              <motion.p 
                className="text-lg text-gray-300 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                Experience unparalleled security and innovation with our cutting-edge vault technology that sets new standards for digital asset protection
              </motion.p>
            </div>
              
            {/* Grid of features */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 max-w-7xl mx-auto">
              <FeatureCard 
                icon="ri-lock-password-line"
                title="Military-Grade Encryption"
                description="Quantum-resistant encryption algorithms ensure your assets remain secure against even the most advanced computational threats."
              />
              
              <FeatureCard 
                icon="ri-shield-keyhole-line"
                title="Multi-Signature Security"
                description="Require multiple authorized parties to approve vault access, creating a distribution of trust for maximum security."
              />
              
              <FeatureCard 
                icon="ri-eye-off-line"
                title="Zero-Knowledge Privacy"
                description="Our ZK-proof technology allows verification without revealing sensitive vault information, maintaining complete privacy."
              />
              
              <FeatureCard 
                icon="ri-time-line"
                title="Time-Locked Protocols"
                description="Set precise unlock conditions with tamper-proof time-lock mechanisms verified across multiple independent blockchain networks."
              />
              
              <FeatureCard 
                icon="ri-global-line"
                title="Cross-Chain Compatibility"
                description="Native support for Ethereum, Solana, TON, and Bitcoin ensures your vault works seamlessly with the entire blockchain ecosystem."
              />
              
              <FeatureCard 
                icon="ri-cpu-line"
                title="AI Security Monitoring"
                description="Advanced AI systems continuously monitor blockchain activity to detect and prevent unauthorized access attempts."
              />
            </div>
          </div>
        </section>
        
        {/* Specialized Vault Types Section */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-[#050505] to-[#0A0A10] border-t border-[#6B00D7]/10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <motion.h2 
                className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                Specialized Vault Types
              </motion.h2>
              <motion.p 
                className="text-lg text-gray-300 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                Tailor your digital vault experience to your specific needs with our specialized, purpose-built vault solutions
              </motion.p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-7xl mx-auto">
              <motion.div 
                className="bg-gradient-to-b from-[#0A0A10] to-[#050505] border border-[#6B00D7]/20 rounded-xl overflow-hidden h-full flex flex-col"
                whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(107, 0, 215, 0.2)' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="h-40 bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <motion.div 
                        key={`scan-${i}`}
                        className="absolute h-[1px] w-full bg-[#FF5AF7]"
                        style={{ top: `${i * 20}%` }}
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                      />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <i className="ri-git-branch-line text-6xl text-[#FF5AF7]/80"></i>
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-semibold mb-4 text-white text-center">Legacy Vaults</h3>
                  <p className="text-gray-400 mb-6 flex-grow">Secure digital inheritance with time-locked assets and customizable conditions for your loved ones. Automatically transfer assets on predetermined events with quantum-secure guarantees.</p>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-auto"
                  >
                    <Link 
                      to="/create-vault" 
                      className="bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 hover:from-[#6B00D7]/30 hover:to-[#FF5AF7]/30 text-[#FF5AF7] border border-[#6B00D7]/40 rounded-lg py-3 px-4 block text-center transition-colors font-medium"
                    >
                      Create Legacy Vault
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-gradient-to-b from-[#0A0A10] to-[#050505] border border-[#6B00D7]/20 rounded-xl overflow-hidden h-full flex flex-col"
                whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(107, 0, 215, 0.2)' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="h-40 bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <motion.div 
                        key={`scan-${i}`}
                        className="absolute w-[1px] h-full bg-[#FF5AF7]"
                        style={{ left: `${i * 20}%` }}
                        animate={{ y: ['-100%', '100%'] }}
                        transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                      />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <i className="ri-shield-keyhole-line text-6xl text-[#FF5AF7]/80"></i>
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-semibold mb-4 text-white text-center">Multi-Signature Vaults</h3>
                  <p className="text-gray-400 mb-6 flex-grow">Distribute trust across multiple authorized parties with our advanced multi-signature technology for high-value assets and organizational treasury management.</p>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-auto"
                  >
                    <Link 
                      to="/multi-signature-vault" 
                      className="bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 hover:from-[#6B00D7]/30 hover:to-[#FF5AF7]/30 text-[#FF5AF7] border border-[#6B00D7]/40 rounded-lg py-3 px-4 block text-center transition-colors font-medium"
                    >
                      Create Multi-Sig Vault
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-gradient-to-b from-[#0A0A10] to-[#050505] border border-[#6B00D7]/20 rounded-xl overflow-hidden h-full flex flex-col"
                whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(107, 0, 215, 0.2)' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="h-40 bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <motion.div 
                        key={`radial-${i}`}
                        className="absolute w-40 h-40 rounded-full border border-[#FF5AF7]/50"
                        style={{ 
                          left: '50%', 
                          top: '50%', 
                          transform: 'translate(-50%, -50%) scale(0)',
                          opacity: 0.5
                        }}
                        animate={{
                          scale: [0, 3],
                          opacity: [0.5, 0]
                        }}
                        transition={{ 
                          duration: 4, 
                          repeat: Infinity, 
                          delay: i * 0.5,
                          repeatDelay: 0
                        }}
                      />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <i className="ri-global-line text-6xl text-[#FF5AF7]/80"></i>
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-semibold mb-4 text-white text-center">Cross-Chain Vaults</h3>
                  <p className="text-gray-400 mb-6 flex-grow">Utilize Cross-chain atomic swaps and advanced bridging technology to secure assets across multiple blockchains simultaneously for maximum security and flexibility.</p>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-auto"
                  >
                    <Link 
                      to="/cross-chain-vault" 
                      className="bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 hover:from-[#6B00D7]/30 hover:to-[#FF5AF7]/30 text-[#FF5AF7] border border-[#6B00D7]/40 rounded-lg py-3 px-4 block text-center transition-colors font-medium"
                    >
                      Create Cross-Chain Vault
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* CVT Token Section */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-[#0A0A10] to-[#050505] border-t border-[#6B00D7]/10">
          <div className="container mx-auto px-4">
            <motion.div 
              className="flex flex-col lg:flex-row gap-16 items-center max-w-7xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="lg:w-1/2 order-2 lg:order-1 space-y-6">
                <motion.h2 
                  className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  Chronos Vault Token (CVT)
                </motion.h2>
                <motion.p 
                  className="text-gray-300 mb-8 text-lg leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  The revolutionary utility token that powers the entire Chronos Vault ecosystem, providing exclusive benefits, reduced fees, and governance rights.
                </motion.p>
                
                <div className="space-y-8">
                  <motion.div 
                    className="flex gap-5"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    viewport={{ once: true, margin: "-100px" }}
                  >
                    <div className="h-14 w-14 flex-shrink-0 rounded-xl bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center border border-[#6B00D7]/30">
                      <i className="ri-coins-line text-2xl text-[#FF5AF7]"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Tiered Benefits System</h3>
                      <p className="text-gray-400">Stake CVT tokens to unlock premium tiers: Vault Guardian (1,000+ CVT), Vault Architect (10,000+ CVT), and Vault Sovereign (100,000+ CVT) with increasing benefits.</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex gap-5"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    viewport={{ once: true, margin: "-100px" }}
                  >
                    <div className="h-14 w-14 flex-shrink-0 rounded-xl bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center border border-[#6B00D7]/30">
                      <i className="ri-percent-line text-2xl text-[#FF5AF7]"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Deflationary Tokenomics</h3>
                      <p className="text-gray-400">A portion of all vault fees are used to buy back and burn CVT tokens, creating a deflationary structure that increases token value over time.</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex gap-5"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    viewport={{ once: true, margin: "-100px" }}
                  >
                    <div className="h-14 w-14 flex-shrink-0 rounded-xl bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center border border-[#6B00D7]/30">
                      <i className="ri-government-line text-2xl text-[#FF5AF7]"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Governance Rights</h3>
                      <p className="text-gray-400">CVT holders can vote on protocol upgrades, feature additions, and ecosystem decisions through our decentralized governance system.</p>
                    </div>
                  </motion.div>
                </div>
                
                <motion.div 
                  className="mt-10"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <Link to="/cvt-token" className="text-[#FF5AF7] font-semibold inline-flex items-center group">
                    <span>Learn more about CVT Tokenomics</span>
                    <i className="ri-arrow-right-line ml-2 transform transition-transform group-hover:translate-x-1"></i>
                  </Link>
                </motion.div>
              </div>
              
              <motion.div 
                className="lg:w-1/2 order-1 lg:order-2 relative"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="relative max-w-md mx-auto">
                  {/* CVT Token 3D Visualization */}
                  <div className="relative aspect-square rounded-3xl overflow-hidden border border-[#6B00D7]/30 bg-gradient-to-br from-[#0A0A10] to-[#050505]">
                    {/* Orbital rings */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div 
                        className="w-3/4 h-3/4 rounded-full border border-[#6B00D7]/10"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        style={{ transform: 'rotateX(70deg)' }}
                      ></motion.div>
                      <motion.div 
                        className="w-2/3 h-2/3 rounded-full border border-[#FF5AF7]/10"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        style={{ transform: 'rotateX(70deg)' }}
                      ></motion.div>
                      <motion.div 
                        className="w-1/2 h-1/2 rounded-full border border-[#6B00D7]/20"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        style={{ transform: 'rotateX(70deg)' }}
                      ></motion.div>
                    </div>
                    
                    {/* CVT Token */}
                    <motion.div 
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 aspect-square"
                      animate={{ y: ['-10px', '10px', '-10px'] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <div className="w-full h-full rounded-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center shadow-[0_0_40px_rgba(107,0,215,0.6)]">
                        <div className="w-[90%] h-[90%] rounded-full bg-[#080808] flex items-center justify-center">
                          <span className="text-white font-bold text-4xl">CVT</span>
                        </div>
                      </div>
                    </motion.div>
                    
                    {/* Tier Badges */}
                    <motion.div 
                      className="absolute bottom-10 left-10 flex flex-col items-center"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      viewport={{ once: true, margin: "-100px" }}
                    >
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#7B68EE]/20 to-[#7B68EE]/40 flex items-center justify-center border border-[#7B68EE]/60">
                        <i className="ri-shield-line text-2xl text-white"></i>
                      </div>
                      <div className="mt-2 text-xs font-medium text-center text-[#7B68EE]">Guardian</div>
                    </motion.div>
                    
                    <motion.div 
                      className="absolute bottom-10 right-10 flex flex-col items-center"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      viewport={{ once: true, margin: "-100px" }}
                    >
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#C0C0C0]/20 to-[#C0C0C0]/40 flex items-center justify-center border border-[#C0C0C0]/60">
                        <i className="ri-building-line text-2xl text-white"></i>
                      </div>
                      <div className="mt-2 text-xs font-medium text-center text-[#C0C0C0]">Architect</div>
                    </motion.div>
                    
                    <motion.div 
                      className="absolute top-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                      viewport={{ once: true, margin: "-100px" }}
                    >
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#FFD700]/20 to-[#FFD700]/40 flex items-center justify-center border border-[#FFD700]/60">
                        <i className="ri-vip-crown-line text-2xl text-white"></i>
                      </div>
                      <div className="mt-2 text-xs font-medium text-center text-[#FFD700]">Sovereign</div>
                    </motion.div>
                    
                    {/* Floating percentage markers */}
                    <motion.div 
                      className="absolute top-1/4 right-1/4 px-2 py-1 bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 rounded-md text-xs font-bold text-white border border-[#6B00D7]/30"
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                    >
                      -75%
                    </motion.div>
                    
                    <motion.div 
                      className="absolute top-1/3 left-1/4 px-2 py-1 bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 rounded-md text-xs font-bold text-white border border-[#6B00D7]/30"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                    >
                      -90%
                    </motion.div>
                    
                    <motion.div 
                      className="absolute bottom-1/4 right-1/3 px-2 py-1 bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 rounded-md text-xs font-bold text-white border border-[#6B00D7]/30"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 4, repeat: Infinity, delay: 1.5 }}
                    >
                      -100%
                    </motion.div>
                    
                    {/* CVT Balance */}
                    <div className="absolute bottom-6 left-0 right-0 mx-auto w-max px-4 py-2 bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 rounded-lg text-center border border-[#6B00D7]/30">
                      <div className="text-sm text-gray-400">Your Balance</div>
                      <div className="text-xl font-bold text-white">{ tokenBalance ? tokenBalance : '0.00' } CVT</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
