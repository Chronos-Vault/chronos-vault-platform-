import React from 'react';
import { motion } from 'framer-motion';

const SecurityRatingCard: React.FC = () => {
  return (
    <div className="relative max-w-lg mx-auto">
      {/* Top Hash */}
      <div className="text-center text-xs text-[#6B00D7] font-mono mb-2 opacity-70 overflow-hidden">
        <motion.div
          animate={{ x: [-20, 0, -20] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        >
          0xf7A8c5e55a9341a6aRBc85f9bF888B81546aE85039...
        </motion.div>
      </div>

      {/* Main Security Card */}
      <div className="relative rounded-2xl overflow-hidden border border-[#6B00D7]/30 bg-[#121212]/90 backdrop-blur-md">
        {/* Grid pattern background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        
        {/* Glow effects */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#6B00D7]/10 to-[#FF5AF7]/10"></div>
        
        {/* Scan line effect */}
        <motion.div 
          className="absolute inset-0 overflow-hidden"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div 
              key={`scanline-${i}`}
              className="absolute h-[1px] w-full bg-[#FF5AF7]/20"
              style={{ top: `${(i * 100) / 20}%` }}
              animate={{ scaleX: [0.5, 1.2, 0.5] }}
              transition={{ duration: 3 + (i % 3), repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </motion.div>

        {/* Connection points and glowing dots */}
        <div className="relative p-8 flex flex-col items-center justify-center min-h-[280px]">
          {/* Top Rating Bar */}
          <div className="absolute top-3 left-1/2 transform -translate-x-1/2 bg-[#000]/80 backdrop-blur-sm px-5 py-1.5 rounded-lg border border-[#6B00D7]/40">
            <h3 className="text-center uppercase tracking-wider text-sm font-medium text-white">
              SECURITY RATING:&nbsp;
              <span className="font-bold text-[#FF5AF7]">100%</span>
            </h3>
          </div>
          
          {/* Connection dots */}
          <motion.div 
            className="absolute top-8 left-8 h-3 w-3 rounded-full bg-[#FF5AF7]"
            animate={{ opacity: [1, 0.4, 1], boxShadow: ['0 0 8px rgba(255, 90, 247, 0.8)', '0 0 12px rgba(255, 90, 247, 0.4)', '0 0 8px rgba(255, 90, 247, 0.8)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          <motion.div 
            className="absolute top-8 right-8 h-3 w-3 rounded-full bg-[#FF5AF7]"
            animate={{ opacity: [1, 0.4, 1], boxShadow: ['0 0 8px rgba(255, 90, 247, 0.8)', '0 0 12px rgba(255, 90, 247, 0.4)', '0 0 8px rgba(255, 90, 247, 0.8)'] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
          
          <motion.div 
            className="absolute bottom-8 left-8 h-3 w-3 rounded-full bg-[#FF5AF7]"
            animate={{ opacity: [1, 0.4, 1], boxShadow: ['0 0 8px rgba(255, 90, 247, 0.8)', '0 0 12px rgba(255, 90, 247, 0.4)', '0 0 8px rgba(255, 90, 247, 0.8)'] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          
          <motion.div 
            className="absolute bottom-8 right-8 h-3 w-3 rounded-full bg-[#FF5AF7]"
            animate={{ opacity: [1, 0.4, 1], boxShadow: ['0 0 8px rgba(255, 90, 247, 0.8)', '0 0 12px rgba(255, 90, 247, 0.4)', '0 0 8px rgba(255, 90, 247, 0.8)'] }}
            transition={{ duration: 2.7, repeat: Infinity }}
          />
          
          {/* Security Shield */}
          <div className="relative">
            {/* Pulsing circles behind shield */}
            <motion.div 
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-[#6B00D7]/10"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            
            <motion.div 
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-[#6B00D7]/20"
              animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            
            {/* Shield Icon */}
            <motion.div 
              className="relative z-10 bg-[#6B00D7]/20 backdrop-blur-sm w-20 h-20 rounded-full border border-[#6B00D7]/50 flex items-center justify-center"
              animate={{ boxShadow: ['0 0 15px rgba(107, 0, 215, 0.3)', '0 0 25px rgba(107, 0, 215, 0.5)', '0 0 15px rgba(107, 0, 215, 0.3)'] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <motion.div 
                className="text-[#FF5AF7] text-4xl flex items-center justify-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Hash */}
      <div className="text-center text-xs text-[#6B00D7] font-mono mt-2 opacity-70 overflow-hidden">
        <motion.div
          animate={{ x: [20, 0, 20] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        >
          E0pGa_t1_g6EtJydbLvwk.3pPfMn1HwdG0DWKU3X...
        </motion.div>
      </div>

      {/* Security Features List */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3">
        {[
          { id: 1, name: "Military-Grade Encryption" },
          { id: 2, name: "Triple-Chain Verification" },
          { id: 3, name: "Quantum-Resistant Algorithms" },
          { id: 4, name: "Zero-Knowledge Privacy" }
        ].map((feature) => (
          <motion.div 
            key={feature.id}
            className="bg-[#121212]/50 backdrop-blur-sm rounded-full border border-[#6B00D7]/20 px-4 py-2 flex items-center gap-2"
            whileHover={{ borderColor: 'rgba(255, 90, 247, 0.4)', backgroundColor: 'rgba(107, 0, 215, 0.1)' }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 * feature.id }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <div className="h-3 w-3 rounded-full bg-[#FF5AF7] opacity-80 animate-pulse"></div>
            <span className="text-white text-sm">{feature.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SecurityRatingCard;