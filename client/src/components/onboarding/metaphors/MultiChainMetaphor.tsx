import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Link, Shield, Fingerprint } from 'lucide-react';

// Icons for the different blockchains
const EthereumIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 1.75L5.75 12.25L12 16L18.25 12.25L12 1.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.75 12.25L12 22.25L18.25 12.25L12 16L5.75 12.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SolanaIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.25 8.5H5.75C5.19772 8.5 4.75 8.94772 4.75 9.5V9.5C4.75 10.0523 5.19772 10.5 5.75 10.5H18.25C18.8023 10.5 19.25 10.0523 19.25 9.5V9.5C19.25 8.94772 18.8023 8.5 18.25 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18.25 14.5H5.75C5.19772 14.5 4.75 14.9477 4.75 15.5V15.5C4.75 16.0523 5.19772 16.5 5.75 16.5H18.25C18.8023 16.5 19.25 16.0523 19.25 15.5V15.5C19.25 14.9477 18.8023 14.5 18.25 14.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18.25 2.5H5.75C5.19772 2.5 4.75 2.94772 4.75 3.5V3.5C4.75 4.05228 5.19772 4.5 5.75 4.5H18.25C18.8023 4.5 19.25 4.05228 19.25 3.5V3.5C19.25 2.94772 18.8023 2.5 18.25 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TonIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9.25" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8.75 9.75L12 13L15.25 9.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.75 16.25H15.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const MultiChainMetaphor = () => {
  const [verificationStage, setVerificationStage] = useState(0);
  
  // Simulate the verification process across multiple chains
  useEffect(() => {
    if (verificationStage < 4) {
      const timer = setTimeout(() => {
        setVerificationStage(verificationStage + 1);
      }, 1500);
      
      return () => clearTimeout(timer);
    } else {
      // Reset the animation after a delay
      const resetTimer = setTimeout(() => {
        setVerificationStage(0);
      }, 3000);
      
      return () => clearTimeout(resetTimer);
    }
  }, [verificationStage]);
  
  // The chains in our triple-chain architecture
  const chains = [
    { 
      name: 'TON', 
      role: 'Primary Vault Contract', 
      icon: <TonIcon />, 
      color: 'cyan',
      verified: verificationStage >= 1 
    },
    { 
      name: 'Ethereum', 
      role: 'Security Verification', 
      icon: <EthereumIcon />, 
      color: 'blue',
      verified: verificationStage >= 2 
    },
    { 
      name: 'Solana', 
      role: 'Real-time Monitoring', 
      icon: <SolanaIcon />, 
      color: 'purple',
      verified: verificationStage >= 3 
    }
  ];
  
  return (
    <div className="flex flex-col md:flex-row h-full items-center justify-between gap-6 p-4">
      {/* Visual metaphor */}
      <motion.div 
        className="flex-1 flex justify-center items-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative w-64 h-64 md:w-80 md:h-80">
          {/* Central vault representation */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-blue-600/30 to-blue-900/30 backdrop-blur-sm rounded-lg border-2 border-blue-500/40 flex items-center justify-center"
            animate={{
              boxShadow: verificationStage === 4 
                ? '0 0 30px rgba(59, 130, 246, 0.6)'
                : '0 0 0 rgba(59, 130, 246, 0.4)'
            }}
            transition={{ duration: 0.5 }}
          >
            <Shield className="h-8 w-8 text-blue-400" />
          </motion.div>
          
          {/* Chain nodes positioned around the vault */}
          {chains.map((chain, index) => {
            // Calculate position on a circle
            const angle = (index * (360 / chains.length) + 270) % 360;
            const radians = (angle * Math.PI) / 180;
            const radius = 120; // Distance from center
            const left = Math.cos(radians) * radius + 50;
            const top = Math.sin(radians) * radius + 50;
            
            return (
              <motion.div
                key={chain.name}
                className={`absolute w-20 h-20 -ml-10 -mt-10`}
                style={{ left: `${left}%`, top: `${top}%` }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                {/* Chain node */}
                <motion.div 
                  className={`w-full h-full rounded-full bg-${chain.color}-500/10 border border-${chain.color}-500/30 flex flex-col items-center justify-center p-2`}
                  animate={{
                    scale: chain.verified ? [1, 1.1, 1] : 1,
                    boxShadow: chain.verified 
                      ? `0 0 20px rgba(59, 130, 246, 0.4)`
                      : `0 0 0 rgba(59, 130, 246, 0)`
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-blue-400 mb-1">
                    {chain.icon}
                  </div>
                  <div className="text-xs font-medium text-center text-blue-400/80">{chain.name}</div>
                </motion.div>
                
                {/* Verification check mark */}
                <motion.div
                  className="absolute -right-1 -top-1 bg-blue-500/20 rounded-full p-1"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: chain.verified ? 1 : 0,
                    scale: chain.verified ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <CheckCircle2 className="h-4 w-4 text-blue-400" />
                </motion.div>
                
                {/* Connection line to vault */}
                <motion.div
                  className="absolute top-1/2 left-1/2 w-[120px] h-0.5 bg-gradient-to-r from-transparent to-blue-400/40 origin-left"
                  style={{ 
                    transform: `rotate(${angle + 180}deg)`,
                    transformOrigin: 'left center' 
                  }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                />
              </motion.div>
            );
          })}
          
          {/* Final verification complete indicator */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: verificationStage === 4 ? 1 : 0,
              scale: verificationStage === 4 ? 1 : 0.8
            }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 rounded-full border-2 border-blue-400/30 animate-ping" />
            <div className="absolute inset-0 rounded-full border-4 border-blue-400/20" />
          </motion.div>
        </div>
      </motion.div>
      
      {/* Description */}
      <motion.div 
        className="flex-1 space-y-4"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
          Triple-Chain Security
        </h3>
        
        <div className="space-y-3 text-muted-foreground">
          <p>
            Chronos Vault's revolutionary Triple-Chain Security architecture leverages multiple blockchains for unprecedented protection:
          </p>
          
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <div className="h-6 w-6 flex-shrink-0 mt-0.5 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Fingerprint className="h-4 w-4" />
              </div>
              <span><strong className="text-foreground">Cross-Chain Verification</strong> – Assets are verified on multiple blockchains simultaneously</span>
            </li>
            
            <li className="flex items-start gap-2">
              <div className="h-6 w-6 flex-shrink-0 mt-0.5 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Shield className="h-4 w-4" />
              </div>
              <span><strong className="text-foreground">Defense in Depth</strong> – Compromising one chain isn't enough to access the vault</span>
            </li>
            
            <li className="flex items-start gap-2">
              <div className="h-6 w-6 flex-shrink-0 mt-0.5 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Link className="h-4 w-4" />
              </div>
              <span><strong className="text-foreground">Specialized Chain Roles</strong> – Each blockchain performs specific security functions</span>
            </li>
            
            <li className="flex items-start gap-2">
              <div className="h-6 w-6 flex-shrink-0 mt-0.5 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <span><strong className="text-foreground">Mathematical Consensus</strong> – Uses cryptographic proofs across multiple chains</span>
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};