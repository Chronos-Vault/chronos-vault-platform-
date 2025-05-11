import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { LogoAnimation } from './animations/LogoAnimation';
import { BrandStorySequence } from './animations/BrandStorySequence';

export const WelcomeAnimation = ({ onComplete }: { onComplete: () => void }) => {
  const [animationStage, setAnimationStage] = useState<'logo' | 'story' | 'complete'>('logo');
  
  useEffect(() => {
    if (animationStage === 'complete') {
      onComplete();
    }
  }, [animationStage, onComplete]);

  return (
    <motion.div 
      className="welcome-animation-container h-full w-full flex items-center justify-center bg-gradient-to-br from-background to-background/90"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-3xl w-full mx-auto">
        {animationStage === 'logo' && (
          <LogoAnimation 
            onComplete={() => setAnimationStage('story')} 
            duration={3000} 
          />
        )}
        
        {animationStage === 'story' && (
          <BrandStorySequence 
            onComplete={() => setAnimationStage('complete')} 
            duration={10000}
          />
        )}
      </div>
    </motion.div>
  );
};