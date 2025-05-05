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

  // Simulate security hash updates - with reduced frequency and complexity
  useEffect(() => {
    // Only update a single character at a time to reduce CPU load
    const interval = setInterval(() => {
      const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_';
      
      // Choose which hash to update (top or bottom)
      const updateTop = Math.random() > 0.5;
      
      if (updateTop) {
        // Randomly change just one character in the top hash
        const position = Math.floor(Math.random() * hashDisplay.top.length);
        const newChar = characters.charAt(Math.floor(Math.random() * characters.length));
        const newTopHash = hashDisplay.top.substring(0, position) + 
                          newChar + 
                          hashDisplay.top.substring(position + 1);
        
        setHashDisplay(prev => ({
          ...prev,
          top: newTopHash
        }));
      } else {
        // Randomly change just one character in the bottom hash
        const position = Math.floor(Math.random() * hashDisplay.bottom.length);
        const newChar = characters.charAt(Math.floor(Math.random() * characters.length));
        const newBottomHash = hashDisplay.bottom.substring(0, position) + 
                             newChar + 
                             hashDisplay.bottom.substring(position + 1);
        
        setHashDisplay(prev => ({
          ...prev,
          bottom: newBottomHash
        }));
      }
    }, 5000); // Reduced frequency from 2000ms to 5000ms
    
    return () => clearInterval(interval);
  }, [hashDisplay]);

  return (
    <section className="relative overflow-hidden bg-[#080808] py-20 flex items-center justify-center min-h-[90vh]">
      {/* Background grid - simpler */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-[#6B00D7] rounded-full filter blur-[120px] opacity-10"></div>
      <div className="absolute bottom-1/3 right-1/4 w-56 h-56 bg-[#FF5AF7] rounded-full filter blur-[140px] opacity-10"></div>
      
      <div className="container mx-auto px-4 z-10 max-w-5xl">
        {/* Main header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#6B00D7]/20 border border-[#6B00D7]/40 mb-6">
            <span className="text-xs font-medium text-[#FF5AF7] tracking-wider uppercase flex items-center">
              <Shield className="w-3.5 h-3.5 text-[#FF5AF7] mr-1.5" />
              <span>TRIPLE-CHAIN SECURITY ARCHITECTURE</span>
            </span>
          </div>
          
          <h1 className="font-bold mb-4">
            <span className="hero-title">Unbreakable Vault Technology</span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Pioneering the most sophisticated security architecture ever developed for digital assets
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left column - Security Dashboard */}
          <div className="relative mx-auto lg:mx-0 max-w-md w-full">
            {/* Top hash display */}
            <div className="text-xs text-[#FF5AF7]/70 font-mono mb-2 overflow-hidden whitespace-nowrap">
              {hashDisplay.top}
            </div>
            
            {/* Main security card */}
            <div className="relative mb-3">
              <div className="relative bg-[#121212] border-2 border-[#333] rounded-xl p-8 shadow-[0_0_30px_rgba(107,0,215,0.3)]">
                {/* Hologram scan effect - reduced */}
                <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                  {scanLines.slice(0, 10).map(line => (
                    <div 
                      key={line.id} 
                      className="absolute h-[1px] w-full bg-[#FF5AF7]/30"
                      style={{ 
                        top: `${(line.id * 100) / 10}%`
                      }} 
                    />
                  ))}
                </div>
                
                {/* Security rating */}
                <div className="text-center mb-8">
                  <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">SECURITY RATING:</div>
                  <div className="text-2xl font-bold text-[#FF5AF7]">{securityRating}%</div>
                </div>
                
                {/* Central Shield Icon - simplified */}
                <div className="relative flex justify-center items-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-[#6B00D7]/10 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-[#6B00D7]/20 flex items-center justify-center">
                      <div className="relative z-10 bg-[#121212] border-2 border-[#6B00D7]/40 rounded-full p-4 shadow-[0_0_15px_rgba(107,0,215,0.4)]">
                        <Shield className="w-10 h-10 text-[#FF5AF7]" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Connection points - simplified */}
                  <div className="absolute w-full h-full pointer-events-none">
                    {[45, 135, 225, 315].map((angle, index) => (
                      <div 
                        key={index}
                        className="absolute w-3 h-3 rounded-full bg-[#FF5AF7]"
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
          </div>
          
          {/* Right column - Features and CTA */}
          <div className="space-y-8">
            {/* Security features - simplified */}
            <div className="flex flex-wrap gap-2">
              {securityFeatures.map((feature) => (
                <div 
                  key={feature.id} 
                  className="bg-[#121212]/50 border border-[#333] rounded-full py-2 px-4 flex items-center"
                >
                  <div className="h-2 w-2 rounded-full bg-[#FF5AF7] mr-2"></div>
                  <span className="text-sm text-white">{feature.name}</span>
                </div>
              ))}
            </div>
            
            {/* Call to action */}
            <div className="relative pt-10">
              <div className="absolute -top-5 left-0 w-full">
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#6B00D7] to-transparent opacity-50"></div>
              </div>
              
              <div className="flex flex-col space-y-4">
                <Button 
                  onClick={onCreateVault} 
                  className="w-full py-6 text-lg bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90 transition-opacity border-0 shadow-lg shadow-[#6B00D7]/20"
                >
                  <Lock className="mr-2" /> Create Secure Vault
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full py-6 text-lg border-2 border-[#6B00D7] hover:border-[#FF5AF7] hover:bg-[#6B00D7]/10 transition-all text-white"
                  asChild
                >
                  <Link href="/multi-signature-vault">
                    <LockKeyhole className="mr-2" /> Multi-Signature Vault
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CyberpunkHolographicHero;