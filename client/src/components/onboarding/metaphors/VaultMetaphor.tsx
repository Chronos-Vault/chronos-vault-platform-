import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, ShieldCheck } from 'lucide-react';

export const VaultMetaphor = () => {
  const [animationState, setAnimationState] = useState<'locked' | 'unlocked' | 'secure'>('locked');
  const [isInteractive, setIsInteractive] = useState(false);
  
  // Auto-play animation sequence on first render
  useEffect(() => {
    const lockTimer = setTimeout(() => setAnimationState('unlocked'), 1000);
    const secureTimer = setTimeout(() => {
      setAnimationState('secure');
      setIsInteractive(true);
    }, 2500);
    
    return () => {
      clearTimeout(lockTimer);
      clearTimeout(secureTimer);
    };
  }, []);
  
  // Handle user interaction
  const handleVaultClick = () => {
    if (!isInteractive) return;
    
    setAnimationState(current => {
      switch (current) {
        case 'locked': return 'unlocked';
        case 'unlocked': return 'secure';
        case 'secure': return 'locked';
        default: return 'locked';
      }
    });
  };
  
  return (
    <div className="vault-metaphor relative h-64 w-full flex flex-col items-center justify-center">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-xl overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-4 opacity-10">
          {Array.from({ length: 36 }).map((_, i) => (
            <div key={i} className="border border-primary rounded-md"></div>
          ))}
        </div>
      </div>
      
      {/* Vault structure */}
      <motion.div 
        className={`vault-outer relative w-40 h-40 rounded-2xl overflow-hidden border-4 cursor-pointer
          ${animationState === 'secure' 
            ? 'border-[#FF5AF7]' 
            : animationState === 'unlocked' 
              ? 'border-amber-500' 
              : 'border-primary'
          } bg-background shadow-lg`}
        onClick={handleVaultClick}
        animate={{
          scale: animationState === 'locked' ? 1 : animationState === 'unlocked' ? 1.05 : 1.1,
          rotate: animationState === 'locked' ? 0 : animationState === 'unlocked' ? 2 : 0
        }}
        transition={{ duration: 0.5 }}
      >
        {/* Vault door */}
        <motion.div 
          className={`vault-door absolute inset-0 z-10 border-2 rounded-xl 
            ${animationState === 'secure' 
              ? 'border-[#FF5AF7] bg-[#FF5AF7]/10' 
              : animationState === 'unlocked' 
                ? 'border-amber-500 bg-amber-500/10' 
                : 'border-primary bg-primary/10'
            }`}
          animate={{
            rotateY: animationState === 'locked' ? 0 : -50,
            x: animationState === 'locked' ? 0 : 40,
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* Vault handle */}
          <motion.div 
            className={`absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full 
              ${animationState === 'secure' 
                ? 'bg-[#FF5AF7]' 
                : animationState === 'unlocked' 
                  ? 'bg-amber-500' 
                  : 'bg-primary'
              } flex items-center justify-center text-white`}
            animate={{
              rotate: animationState === 'locked' ? 0 : animationState === 'unlocked' ? 180 : 360,
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {animationState === 'locked' ? (
              <Lock className="h-6 w-6" />
            ) : animationState === 'unlocked' ? (
              <Unlock className="h-6 w-6" />
            ) : (
              <ShieldCheck className="h-6 w-6" />
            )}
          </motion.div>
        </motion.div>
        
        {/* Vault interior */}
        <div className="vault-interior absolute inset-0 flex items-center justify-center">
          {/* Digital assets visualization */}
          <motion.div 
            className="digital-assets grid grid-cols-2 gap-2"
            animate={{
              opacity: animationState === 'locked' ? 0.3 : 1,
              scale: animationState === 'locked' ? 0.9 : 1.1,
            }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="asset w-12 h-12 rounded-lg bg-blue-500/30 border border-blue-500 flex items-center justify-center"
              animate={{
                y: animationState === 'secure' ? [0, -10, 0] : 0,
              }}
              transition={{ 
                duration: 2, 
                repeat: animationState === 'secure' ? Infinity : 0,
                repeatType: "mirror" 
              }}
            >
              <span className="text-blue-500 text-xs font-bold">BTC</span>
            </motion.div>
            <motion.div 
              className="asset w-12 h-12 rounded-lg bg-purple-500/30 border border-purple-500 flex items-center justify-center"
              animate={{
                y: animationState === 'secure' ? [0, -8, 0] : 0,
              }}
              transition={{ 
                duration: 1.7, 
                repeat: animationState === 'secure' ? Infinity : 0,
                repeatType: "mirror",
                delay: 0.2 
              }}
            >
              <span className="text-purple-500 text-xs font-bold">ETH</span>
            </motion.div>
            <motion.div 
              className="asset w-12 h-12 rounded-lg bg-green-500/30 border border-green-500 flex items-center justify-center"
              animate={{
                y: animationState === 'secure' ? [0, -6, 0] : 0,
              }}
              transition={{ 
                duration: 1.5, 
                repeat: animationState === 'secure' ? Infinity : 0,
                repeatType: "mirror",
                delay: 0.3 
              }}
            >
              <span className="text-green-500 text-xs font-bold">TON</span>
            </motion.div>
            <motion.div 
              className="asset w-12 h-12 rounded-lg bg-amber-500/30 border border-amber-500 flex items-center justify-center"
              animate={{
                y: animationState === 'secure' ? [0, -7, 0] : 0,
              }}
              transition={{ 
                duration: 2.2, 
                repeat: animationState === 'secure' ? Infinity : 0,
                repeatType: "mirror",
                delay: 0.4 
              }}
            >
              <span className="text-amber-500 text-xs font-bold">SOL</span>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Status text */}
      <motion.div 
        className="status-text mt-6 text-center"
        animate={{
          opacity: 1,
          y: [20, 0]
        }}
        transition={{ duration: 0.5 }}
      >
        <p className={`font-medium ${
          animationState === 'secure' 
            ? 'text-[#FF5AF7]' 
            : animationState === 'unlocked' 
              ? 'text-amber-500' 
              : 'text-primary'
        }`}>
          {animationState === 'locked' 
            ? 'Assets Locked Securely' 
            : animationState === 'unlocked' 
              ? 'Assets Accessible' 
              : 'Triple-Chain Protection Active'
          }
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {isInteractive ? 'Click the vault to toggle states' : 'Watch the vault animation...'}
        </p>
      </motion.div>
    </div>
  );
};