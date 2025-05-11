import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlockchainDemo } from './demos/BlockchainDemo';
import { AssetVisualization } from './demos/AssetVisualization';
import { SecurityLevelExplainer } from './demos/SecurityLevelExplainer';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export const BlockchainConcepts = ({ onComplete }: { onComplete: () => void }) => {
  const [conceptIndex, setConceptIndex] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);
  
  const concepts = [
    {
      title: 'Blockchain Technology',
      description: 'The secure foundation for digital asset management',
      component: <BlockchainDemo onInteract={() => setUserInteracted(true)} />
    },
    {
      title: 'Digital Assets',
      description: 'Understanding the different types of assets you can secure',
      component: <AssetVisualization onInteract={() => setUserInteracted(true)} />
    },
    {
      title: 'Security Levels',
      description: 'Choose the right protection level for your needs',
      component: <SecurityLevelExplainer onInteract={() => setUserInteracted(true)} />
    }
  ];
  
  const nextConcept = () => {
    if (conceptIndex < concepts.length - 1) {
      setConceptIndex(conceptIndex + 1);
      setUserInteracted(false);
    } else {
      onComplete();
    }
  };
  
  const prevConcept = () => {
    if (conceptIndex > 0) {
      setConceptIndex(conceptIndex - 1);
      setUserInteracted(false);
    }
  };

  return (
    <div className="blockchain-concepts-container p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-[#FF5AF7]">
        {concepts[conceptIndex].title}
      </h2>
      <p className="text-muted-foreground mb-8">{concepts[conceptIndex].description}</p>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={conceptIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="concept-demo-container bg-card/50 backdrop-blur-sm border border-muted rounded-xl shadow-sm overflow-hidden"
        >
          {concepts[conceptIndex].component}
        </motion.div>
      </AnimatePresence>
      
      <div className="mt-8 flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={prevConcept}
          disabled={conceptIndex === 0}
          size="lg"
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </Button>
        
        <div className="flex space-x-2">
          {concepts.map((_, i) => (
            <div 
              key={i}
              className={`h-2 w-8 rounded-full ${
                i === conceptIndex ? 'bg-primary' : 'bg-muted'
              } transition-all duration-300`}
            />
          ))}
        </div>
        
        <Button 
          onClick={nextConcept}
          disabled={!userInteracted && conceptIndex !== concepts.length - 1}
          size="lg"
          className="gap-2"
        >
          {conceptIndex === concepts.length - 1 ? 'Complete' : 'Next'} <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      {!userInteracted && conceptIndex !== concepts.length - 1 && (
        <p className="text-center mt-4 text-sm text-muted-foreground">
          Interact with the demo to continue
        </p>
      )}

      <Button 
        variant="ghost" 
        onClick={onComplete}
        className="mt-6 mx-auto block text-sm text-muted-foreground hover:text-primary"
      >
        Skip Tutorial
      </Button>
    </div>
  );
};