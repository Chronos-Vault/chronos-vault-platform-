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
                <SecurityRatingCard />
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
      </main>
    </div>
  );
};

export default Home;