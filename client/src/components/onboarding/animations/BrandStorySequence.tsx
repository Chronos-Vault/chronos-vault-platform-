import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Lock, Shield, Clock, Network } from 'lucide-react';

export const BrandStorySequence = ({
  onComplete,
  duration = 10000
}: {
  onComplete: () => void;
  duration: number;
}) => {
  const [storyStep, setStoryStep] = useState<number>(0);
  
  const storySteps = [
    {
      title: "Traditional Security",
      description: "Physical assets protected by traditional means",
      icon: <Lock className="w-12 h-12 text-primary/80" />,
      animation: "fade-right"
    },
    {
      title: "Digital Evolution",
      description: "Digital assets require new protection methods",
      icon: <Shield className="w-12 h-12 text-primary/90" />,
      animation: "fade-up"
    },
    {
      title: "Time-Locked Security",
      description: "Assets secured with temporal guarantees",
      icon: <Clock className="w-12 h-12 text-[#FF5AF7]/90" />,
      animation: "fade-down"
    },
    {
      title: "Multi-Chain Protection",
      description: "Triple-Chain Security Architecture",
      icon: <Network className="w-12 h-12 text-[#FF5AF7]" />,
      animation: "fade-left"
    }
  ];
  
  useEffect(() => {
    const interval = duration / storySteps.length;
    
    // Progress through steps
    const timer = setInterval(() => {
      setStoryStep(current => {
        const next = current + 1;
        return next < storySteps.length ? next : current;
      });
    }, interval);
    
    // Complete sequence after full duration
    const completeTimer = setTimeout(() => {
      onComplete();
    }, duration);
    
    return () => {
      clearInterval(timer);
      clearTimeout(completeTimer);
    };
  }, [duration, storySteps.length, onComplete]);

  const getAnimationVariants = (animation: string) => {
    const baseTransition = { duration: 0.6, ease: "easeOut" };
    
    const variants = {
      "fade-right": {
        initial: { opacity: 0, x: -50 },
        animate: { opacity: 1, x: 0, transition: baseTransition },
        exit: { opacity: 0, x: 50, transition: baseTransition }
      },
      "fade-left": {
        initial: { opacity: 0, x: 50 },
        animate: { opacity: 1, x: 0, transition: baseTransition },
        exit: { opacity: 0, x: -50, transition: baseTransition }
      },
      "fade-up": {
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0, transition: baseTransition },
        exit: { opacity: 0, y: -50, transition: baseTransition }
      },
      "fade-down": {
        initial: { opacity: 0, y: -50 },
        animate: { opacity: 1, y: 0, transition: baseTransition },
        exit: { opacity: 0, y: 50, transition: baseTransition }
      }
    };
    
    return variants[animation as keyof typeof variants];
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black/5 rounded-xl overflow-hidden p-8">
      <div className="relative h-80 w-full flex items-center justify-center">
        {/* Background elements */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[400px] h-[400px] rounded-full bg-gradient-to-br from-primary/5 to-[#FF5AF7]/5 animate-spin-slow" />
          <div className="w-[300px] h-[300px] rounded-full bg-gradient-to-tr from-primary/10 to-[#FF5AF7]/10 animate-reverse-spin" />
        </div>
        
        {/* Current step content */}
        <motion.div
          key={storyStep}
          className="text-center z-10 p-6 bg-background/80 backdrop-blur-sm rounded-xl border border-primary/20 shadow-lg"
          {...getAnimationVariants(storySteps[storyStep].animation)}
        >
          <div className="flex justify-center mb-4">
            {storySteps[storyStep].icon}
          </div>
          <h2 className="text-xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-[#FF5AF7]">
            {storySteps[storyStep].title}
          </h2>
          <p className="text-muted-foreground">
            {storySteps[storyStep].description}
          </p>
        </motion.div>
      </div>
      
      {/* Progress indicator */}
      <div className="flex gap-2 mt-4">
        {storySteps.map((_, i) => (
          <div 
            key={i} 
            className={`h-1.5 rounded-full ${i <= storyStep ? 'bg-primary' : 'bg-muted'} transition-all duration-300`}
            style={{ width: i === storyStep ? '2rem' : '1rem' }}
          />
        ))}
      </div>
      
      {/* Skip button */}
      <button 
        onClick={onComplete}
        className="mt-6 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        Skip Intro
      </button>
    </div>
  );
};