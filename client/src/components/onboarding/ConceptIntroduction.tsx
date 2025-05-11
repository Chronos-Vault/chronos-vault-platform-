import { motion } from 'framer-motion';
import { useState } from 'react';
import { VaultMetaphor } from './metaphors/VaultMetaphor';
import { TimeLockMetaphor } from './metaphors/TimeLockMetaphor'; 
import { MultiChainMetaphor } from './metaphors/MultiChainMetaphor';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export const ConceptIntroduction = ({ onComplete }: { onComplete: () => void }) => {
  const [currentConcept, setCurrentConcept] = useState<'vault' | 'timelock' | 'multichain'>('vault');
  
  const concepts = [
    { 
      id: 'vault', 
      title: 'Secure Digital Vault', 
      description: 'Your assets are protected with military-grade encryption. The Chronos Vault system provides a secure, decentralized way to store your digital assets with multiple layers of protection.',
      metaphor: <VaultMetaphor />
    },
    { 
      id: 'timelock', 
      title: 'Time-Lock Technology', 
      description: 'Lock assets until a specific date in the future. Time-locks are cryptographically enforced and cannot be circumvented, ensuring your assets remain secure until the predetermined unlock date.',
      metaphor: <TimeLockMetaphor />
    },
    { 
      id: 'multichain', 
      title: 'Triple-Chain Security', 
      description: 'Protection across Ethereum, Solana, and TON networks. Our unique Triple-Chain Security Architecture distributes security responsibility across multiple blockchains for unprecedented protection.',
      metaphor: <MultiChainMetaphor />
    }
  ];

  const currentIndex = concepts.findIndex(c => c.id === currentConcept);
  
  const goToNextConcept = () => {
    if (currentIndex === concepts.length - 1) {
      onComplete();
    } else {
      setCurrentConcept(concepts[currentIndex + 1].id as any);
    }
  };
  
  const goToPrevConcept = () => {
    if (currentIndex > 0) {
      setCurrentConcept(concepts[currentIndex - 1].id as any);
    }
  };

  return (
    <div className="concept-introduction max-w-5xl mx-auto p-6">
      <motion.div 
        className="concept-content"
        key={currentConcept}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-[#FF5AF7]">
            {concepts[currentIndex].title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {concepts[currentIndex].description}
          </p>
        </div>
        
        <div className="metaphor-container h-64 mb-8 bg-card/50 backdrop-blur-sm border border-muted rounded-xl shadow-sm overflow-hidden p-4">
          {concepts[currentIndex].metaphor}
        </div>

        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={goToPrevConcept}
            disabled={currentIndex === 0}
            size="lg"
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>
          
          <div className="flex space-x-2">
            {concepts.map((c, i) => (
              <div 
                key={c.id} 
                className={`h-2 w-12 rounded-full transition-all duration-300 ${currentIndex === i ? 'bg-primary' : 'bg-muted'}`}
              />
            ))}
          </div>
          
          <Button 
            onClick={goToNextConcept}
            size="lg"
            className="gap-2"
          >
            {currentIndex === concepts.length - 1 ? 'Get Started' : 'Next'} <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
      
      <Button 
        variant="ghost" 
        onClick={onComplete}
        className="mt-6 mx-auto block text-sm text-muted-foreground hover:text-primary"
      >
        Skip Introduction
      </Button>
    </div>
  );
};