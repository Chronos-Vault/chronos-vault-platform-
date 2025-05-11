import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from '@/contexts/onboarding-context';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const WelcomeAnimation = () => {
  const { completeCurrentStep } = useOnboarding();
  const [animationComplete, setAnimationComplete] = useState(false);
  
  // Start animation sequence when component mounts
  useEffect(() => {
    // Auto-complete animation after 5 seconds
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-black">
      {/* Background gradient elements */}
      <motion.div
        className="absolute w-full h-full bg-gradient-radial from-purple-900/20 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />
      
      <motion.div
        className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-purple-900/30 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
      />
      
      {/* Logo animation */}
      <motion.div
        className="relative z-10 mb-10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            className="w-16 h-16 md:w-20 md:h-20 text-white"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
              fill="currentColor"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            <motion.path
              d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"
              fill="currentColor"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, delay: 1, ease: "easeInOut" }}
            />
          </svg>
        </div>
      </motion.div>
      
      {/* Title animation */}
      <motion.h1
        className="relative z-10 text-4xl md:text-6xl font-bold text-white mb-4 text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 1, ease: "easeOut" }}
      >
        Chronos Vault
      </motion.h1>
      
      {/* Subtitle animation */}
      <motion.p
        className="relative z-10 text-xl md:text-2xl text-white/80 mb-10 text-center max-w-md px-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 1.5, ease: "easeOut" }}
      >
        Secure your digital future with time-locked blockchain vaults
      </motion.p>
      
      {/* Continue button */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: animationComplete ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button
          size="lg"
          className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white"
          onClick={completeCurrentStep}
        >
          Begin Journey <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </motion.div>
    </div>
  );
};

export default WelcomeAnimation;