import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

export const WelcomeAnimation = ({ onComplete }: { onComplete: () => void }) => {
  // Animation states
  const [logoAnimationComplete, setLogoAnimationComplete] = useState(false);
  const [showTagline, setShowTagline] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [showButton, setShowButton] = useState(false);
  
  // Trigger sequence of animations
  useEffect(() => {
    // Show tagline after the logo animation
    const taglineTimer = setTimeout(() => {
      setShowTagline(true);
    }, 2000);
    
    // Show description after tagline
    const descriptionTimer = setTimeout(() => {
      setShowDescription(true);
    }, 3500);
    
    // Show button last
    const buttonTimer = setTimeout(() => {
      setShowButton(true);
    }, 5000);
    
    return () => {
      clearTimeout(taglineTimer);
      clearTimeout(descriptionTimer);
      clearTimeout(buttonTimer);
    };
  }, []);
  
  return (
    <div className="welcome-animation flex flex-col items-center justify-center h-full w-full">
      <motion.div
        className="logo-animation mb-12 relative"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          duration: 1.5
        }}
        onAnimationComplete={() => setLogoAnimationComplete(true)}
      >
        {/* Logo with glow effect */}
        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-primary to-[#FF5AF7] flex items-center justify-center relative">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-tr from-primary to-[#FF5AF7] rounded-full blur-xl opacity-40"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.4, 0.6, 0.4]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary to-[#FF5AF7] opacity-90" />
          
          <div className="z-10 font-bold text-4xl bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
            CV
          </div>
          
          {/* Orbiting elements */}
          {logoAnimationComplete && (
            <>
              <motion.div
                className="absolute w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm border border-white/40"
                animate={{
                  rotate: 360
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  top: "calc(50% - 3px)",
                  left: "calc(50% - 3px)",
                  transformOrigin: "center",
                  translate: "-50% -50%",
                  offsetPath: "path('M 0 -70 A 70 70 0 1 1 1 -70 A 70 70 0 1 1 0 -70')",
                  offsetDistance: "25%"
                }}
              />
              
              <motion.div
                className="absolute w-4 h-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/30"
                animate={{
                  rotate: -360
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  top: "calc(50% - 2px)",
                  left: "calc(50% - 2px)",
                  transformOrigin: "center",
                  translate: "-50% -50%",
                  offsetPath: "path('M 0 -85 A 85 85 0 1 0 1 -85 A 85 85 0 1 0 0 -85')",
                  offsetDistance: "75%"
                }}
              />
            </>
          )}
        </div>
      </motion.div>
      
      <AnimatePresence>
        {showTagline && (
          <motion.h1
            className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-[#FF5AF7] text-center max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Chronos Vault
          </motion.h1>
        )}
        
        {showDescription && (
          <motion.p
            className="text-xl text-muted-foreground text-center max-w-lg mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            The revolutionary multi-chain platform for secure time-locked digital vaults
          </motion.p>
        )}
        
        {showButton && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Button size="lg" onClick={onComplete} className="gap-2">
              Get Started <ChevronRight className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};