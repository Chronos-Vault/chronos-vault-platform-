import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle2, Lock, LockKeyhole, Network, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

interface CyberpunkHolographicHeroProps {
  onCreateVault: () => void;
}

const CyberpunkHolographicHero: React.FC<CyberpunkHolographicHeroProps> = ({ onCreateVault }) => {
  const [securityRating, setSecurityRating] = useState(100);
  const [securityFeatures, setSecurityFeatures] = useState([
    { id: 1, name: 'Military-Grade Encryption', active: true },
    { id: 2, name: 'Triple-Chain Verification', active: true },
    { id: 3, name: 'Quantum-Resistant Algorithms', active: true },
    { id: 4, name: 'Zero-Knowledge Privacy', active: true },
  ]);
  const [scanLines, setScanLines] = useState<Array<{id: number, delay: number}>>([]);
  const [hashDisplay, setHashDisplay] = useState({
    top: 'SXFE7bb82Egdh4j8dFcg3X1HE2t000c6',
    bottom: 'ED8cp_j4_g8t33ygbLwk-3pfFHsiNadbXZJ3'
  });
  
  // Initialize scan lines
  useEffect(() => {
    const lines = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      delay: i * 0.1
    }));
    setScanLines(lines);
  }, []);

  // Simulate security hash updates
  useEffect(() => {
    const interval = setInterval(() => {
      const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_';
      let newTopHash = '';
      let newBottomHash = '';
      
      for (let i = 0; i < hashDisplay.top.length; i++) {
        if (Math.random() > 0.8) {
          newTopHash += characters.charAt(Math.floor(Math.random() * characters.length));
        } else {
          newTopHash += hashDisplay.top[i];
        }
      }
      
      for (let i = 0; i < hashDisplay.bottom.length; i++) {
        if (Math.random() > 0.8) {
          newBottomHash += characters.charAt(Math.floor(Math.random() * characters.length));
        } else {
          newBottomHash += hashDisplay.bottom[i];
        }
      }
      
      setHashDisplay({
        top: newTopHash,
        bottom: newBottomHash
      });
    }, 2000);
    
    return () => clearInterval(interval);
  }, [hashDisplay]);

  return (
    <section className="relative overflow-hidden bg-[#080808] min-h-screen flex flex-col justify-center">
      {/* Background grid and effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
      <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-[#6B00D7] rounded-full filter blur-[120px] opacity-20 animate-pulse-slow"></div>
      <div className="absolute bottom-1/3 right-1/4 w-56 h-56 bg-[#FF5AF7] rounded-full filter blur-[140px] opacity-15 animate-pulse-slow" style={{animationDelay: '1s'}}></div>
      
      <div className="container mx-auto px-4 z-10 py-16 md:py-10">
        {/* Main header */}
        <div className="text-center mb-8">
          <motion.div 
            className="inline-flex items-center px-3 py-1 rounded-full bg-[#6B00D7]/20 border border-[#6B00D7]/40 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-xs font-medium text-[#FF5AF7] tracking-wider uppercase flex items-center">
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }} 
                transition={{ duration: 2, repeat: Infinity }}
                className="mr-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-[#FF5AF7]" />
              </motion.div>
              <span>TRIPLE-CHAIN SECURITY ARCHITECTURE</span>
            </span>
          </motion.div>
          
          <motion.h1
            className="font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <span className="hero-title">Unbreakable Vault Technology</span>
          </motion.h1>
          
          <motion.p
            className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Pioneering the most sophisticated security architecture ever developed for digital assets
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-4">
          {/* Left column - Security Dashboard */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {/* Top hash display */}
            <div className="text-xs text-[#FF5AF7]/70 font-mono mb-2 overflow-hidden whitespace-nowrap">
              {hashDisplay.top}
            </div>
            
            {/* Main security card */}
            <div className="relative mb-3 perspective-1000">
              <div className="relative bg-[#121212] border-2 border-[#333] rounded-xl p-8 transform-style-3d shadow-[0_0_30px_rgba(107,0,215,0.3)] hover:shadow-[0_0_50px_rgba(107,0,215,0.4)] transition-all duration-500">
                {/* Hologram scan effect */}
                <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                  {scanLines.map(line => (
                    <div 
                      key={line.id} 
                      className="absolute h-[1px] w-full bg-[#FF5AF7]/30 animate-scan-horizontal"
                      style={{ 
                        top: `${(line.id * 100) / scanLines.length}%`, 
                        animationDelay: `${line.delay}s`,
                        animationDuration: '4s'
                      }} 
                    />
                  ))}
                </div>
                
                {/* Security rating */}
                <div className="text-center mb-8">
                  <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">SECURITY RATING:</div>
                  <div className="text-2xl font-bold text-[#FF5AF7] animate-pulse-subtle">{securityRating}%</div>
                </div>
                
                {/* Central Shield Icon */}
                <div className="relative flex justify-center items-center mb-6">
                  <div className="absolute w-32 h-32 rounded-full bg-[#6B00D7]/5 animate-pulse-slow"></div>
                  <div className="absolute w-24 h-24 rounded-full bg-[#6B00D7]/10 animate-pulse-slow" style={{ animationDelay: '0.5s' }}></div>
                  <div className="absolute w-16 h-16 rounded-full bg-[#6B00D7]/20 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
                  
                  <div className="relative z-10 bg-[#121212] border-2 border-[#6B00D7]/40 rounded-full p-4 shadow-[0_0_15px_rgba(107,0,215,0.4)]">
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <Shield className="w-10 h-10 text-[#FF5AF7]" />
                    </motion.div>
                  </div>
                  
                  {/* Connection points */}
                  <div className="absolute w-full h-full pointer-events-none">
                    {[45, 135, 225, 315].map((angle, index) => (
                      <div 
                        key={index}
                        className="absolute w-3 h-3 rounded-full bg-[#FF5AF7] shadow-[0_0_10px_rgba(255,90,247,0.8)]"
                        style={{
                          top: `${50 + 40 * Math.sin(angle * Math.PI / 180)}%`,
                          left: `${50 + 40 * Math.cos(angle * Math.PI / 180)}%`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom hash display */}
            <div className="text-xs text-[#FF5AF7]/70 font-mono mt-2 overflow-hidden whitespace-nowrap">
              {hashDisplay.bottom}
            </div>
            
            {/* Blockchain connections */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-[#121212] border border-[#333] rounded-lg p-3 flex items-center space-x-2">
                <div className="flex-shrink-0 p-1.5 rounded bg-[#6B00D7]/20 text-[#6B00D7]">
                  <Network className="w-4 h-4" />
                </div>
                <div className="text-sm">ETH Secured</div>
              </div>
              
              <div className="bg-[#121212] border border-[#333] rounded-lg p-3 flex items-center space-x-2">
                <div className="flex-shrink-0 p-1.5 rounded bg-[#6B00D7]/20 text-[#6B00D7]">
                  <Network className="w-4 h-4" />
                </div>
                <div className="text-sm">TON Secured</div>
              </div>
            </div>
          </motion.div>
          
          {/* Right column - Features and CTA */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            {/* Security features */}
            <div className="space-y-3">
              {securityFeatures.map((feature) => (
                <motion.div 
                  key={feature.id} 
                  className="bg-[#121212]/50 backdrop-blur-sm border border-[#333] rounded-full py-2 px-4 inline-flex items-center mr-3 mb-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + feature.id * 0.1, duration: 0.4 }}
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(107,0,215,0.2)' }}
                >
                  <div className="h-2 w-2 rounded-full bg-[#FF5AF7] mr-2 shadow-[0_0_5px_rgba(255,90,247,0.8)]"></div>
                  <span className="text-sm text-white">{feature.name}</span>
                </motion.div>
              ))}
            </div>
            
            {/* Call to action */}
            <motion.div
              className="relative pt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              <div className="absolute -top-5 left-0 w-full">
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#6B00D7] to-transparent opacity-50"></div>
              </div>
              
              <div className="flex flex-col space-y-4">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    onClick={onCreateVault} 
                    className="w-full py-6 text-lg bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90 transition-opacity border-0 shadow-lg shadow-[#6B00D7]/20"
                  >
                    <Lock className="mr-2" /> Create Secure Vault
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    variant="outline" 
                    className="w-full py-6 text-lg border-2 border-[#6B00D7] hover:border-[#FF5AF7] hover:bg-[#6B00D7]/10 transition-all text-white"
                    asChild
                  >
                    <Link href="/multi-signature-vault">
                      <LockKeyhole className="mr-2" /> Multi-Signature Vault
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CyberpunkHolographicHero;