import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, LockKeyhole, Calendar } from 'lucide-react';

export const TimeLockMetaphor = () => {
  const [countdown, setCountdown] = useState(5);
  const [isUnlocked, setIsUnlocked] = useState(false);
  
  // Simulate a countdown timer for the vault unlock visualization
  useEffect(() => {
    if (countdown > 0 && !isUnlocked) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !isUnlocked) {
      setIsUnlocked(true);
      
      // Reset after a delay
      const resetTimer = setTimeout(() => {
        setIsUnlocked(false);
        setCountdown(5);
      }, 3000);
      
      return () => clearTimeout(resetTimer);
    }
  }, [countdown, isUnlocked]);
  
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
          {/* Clock face background */}
          <motion.div 
            className="absolute inset-0 rounded-full border-8 border-pink-500/40 bg-gradient-to-br from-pink-900/20 to-pink-700/20 backdrop-blur-sm shadow-lg flex items-center justify-center"
            animate={{
              boxShadow: isUnlocked
                ? '0 0 30px rgba(236, 72, 153, 0.6)'
                : '0 0 0 rgba(236, 72, 153, 0.4)'
            }}
            transition={{ duration: 0.5 }}
          >
            {/* Clock hands */}
            <div className="relative w-3/4 h-3/4">
              {/* Hour markers */}
              {Array.from({ length: 12 }).map((_, i) => (
                <div 
                  key={i} 
                  className="absolute w-full h-full"
                  style={{ transform: `rotate(${i * 30}deg)` }}
                >
                  <div className="absolute top-0 left-1/2 w-1 h-3 -ml-0.5 bg-pink-300/60 rounded-full" />
                </div>
              ))}
              
              {/* Minute hand */}
              <motion.div
                className="absolute w-0.5 h-1/2 bg-pink-300 rounded-full left-1/2 bottom-1/2 origin-bottom -ml-0.25"
                initial={{ rotate: 0 }}
                animate={{ rotate: isUnlocked ? 360 : [0, 60, 120, 180, 240, 300, 360] }}
                transition={{ 
                  duration: isUnlocked ? 0.5 : 5, 
                  ease: isUnlocked ? "easeInOut" : "linear",
                  repeat: isUnlocked ? 0 : Infinity,
                }}
              />
              
              {/* Hour hand */}
              <motion.div
                className="absolute w-1 h-1/3 bg-pink-400 rounded-full left-1/2 bottom-1/2 origin-bottom -ml-0.5"
                initial={{ rotate: 0 }}
                animate={{ rotate: isUnlocked ? 360 : [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360] }}
                transition={{ 
                  duration: isUnlocked ? 1 : 60, 
                  ease: isUnlocked ? "easeInOut" : "linear",
                  repeat: isUnlocked ? 0 : Infinity,
                }}
              />
              
              {/* Center dot */}
              <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-pink-500 rounded-full -mt-1.5 -ml-1.5" />
            </div>
          </motion.div>
          
          {/* Lock that appears during countdown */}
          <motion.div
            className={`absolute inset-0 flex items-center justify-center ${isUnlocked ? 'opacity-0' : 'opacity-100'}`}
            animate={{ scale: isUnlocked ? 0.8 : 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-black/50 backdrop-blur-sm w-16 h-16 rounded-full flex items-center justify-center text-pink-400">
              {isUnlocked ? (
                <LockKeyhole className="h-8 w-8" />
              ) : (
                <div className="text-2xl font-bold">{countdown}</div>
              )}
            </div>
          </motion.div>
          
          {/* Calendar icon that appears when unlocked */}
          <motion.div
            className="absolute bottom-4 right-4"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: isUnlocked ? 1 : 0,
              scale: isUnlocked ? 1 : 0
            }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-pink-500/20 p-3 rounded-full">
              <Calendar className="h-8 w-8 text-pink-400" />
            </div>
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
        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-pink-600">
          Time-Lock Mechanism
        </h3>
        
        <div className="space-y-3 text-muted-foreground">
          <p>
            Chronos Vault's time-lock feature ensures your assets remain securely locked until a precise future date:
          </p>
          
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <div className="h-6 w-6 flex-shrink-0 mt-0.5 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-400">
                <span className="text-xs">✓</span>
              </div>
              <span><strong className="text-foreground">Temporal Control</strong> – Set unlock dates with precision down to the minute</span>
            </li>
            
            <li className="flex items-start gap-2">
              <div className="h-6 w-6 flex-shrink-0 mt-0.5 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-400">
                <span className="text-xs">✓</span>
              </div>
              <span><strong className="text-foreground">Mathematically Enforced</strong> – No one, not even you, can unlock early</span>
            </li>
            
            <li className="flex items-start gap-2">
              <div className="h-6 w-6 flex-shrink-0 mt-0.5 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-400">
                <span className="text-xs">✓</span>
              </div>
              <span><strong className="text-foreground">Global Time Synchronization</strong> – Uses blockchain consensus time</span>
            </li>
            
            <li className="flex items-start gap-2">
              <div className="h-6 w-6 flex-shrink-0 mt-0.5 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-400">
                <span className="text-xs">✓</span>
              </div>
              <span><strong className="text-foreground">Automatic Execution</strong> – Assets become available exactly when scheduled</span>
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};