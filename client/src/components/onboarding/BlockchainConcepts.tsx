import { useState } from 'react';
import { motion } from 'framer-motion';
import { BlockchainDemo } from './demos/BlockchainDemo';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

export const BlockchainConcepts = ({ onComplete }: { onComplete: () => void }) => {
  const [isInteractive, setIsInteractive] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  const handleInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };
  
  return (
    <div className="blockchain-concepts p-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <motion.h2 
          className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-[#FF5AF7]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Understanding Blockchain
        </motion.h2>
        
        <motion.p 
          className="text-lg text-muted-foreground max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Explore how blockchain technology creates a secure, immutable foundation for Chronos Vault
        </motion.p>
      </div>
      
      <div className="demo-container p-4 bg-card/50 backdrop-blur-sm border border-muted rounded-xl shadow-sm mb-8">
        <BlockchainDemo onInteract={handleInteraction} />
      </div>
      
      <div className="key-concepts grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div 
          className="concept-card p-4 bg-card border border-muted rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <h3 className="text-xl font-semibold mb-2">Immutability</h3>
          <p className="text-muted-foreground text-sm">
            Once data is written to the blockchain, it cannot be altered or deleted, ensuring the integrity of your vault records.
          </p>
        </motion.div>
        
        <motion.div 
          className="concept-card p-4 bg-card border border-muted rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <h3 className="text-xl font-semibold mb-2">Decentralization</h3>
          <p className="text-muted-foreground text-sm">
            Your vault is secured across multiple blockchain networks with no single point of failure or central authority.
          </p>
        </motion.div>
        
        <motion.div 
          className="concept-card p-4 bg-card border border-muted rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <h3 className="text-xl font-semibold mb-2">Cryptography</h3>
          <p className="text-muted-foreground text-sm">
            Advanced encryption algorithms protect your assets and ensure only authorized access when time-lock conditions are met.
          </p>
        </motion.div>
      </div>
      
      <div className="text-center">
        <Button 
          onClick={onComplete} 
          size="lg"
          className="gap-2"
        >
          Continue <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};