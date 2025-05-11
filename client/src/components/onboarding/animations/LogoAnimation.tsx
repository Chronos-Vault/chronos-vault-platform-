import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export const LogoAnimation = ({ 
  onComplete, 
  duration = 3000 
}: { 
  onComplete: () => void;
  duration: number;
}) => {
  const [step, setStep] = useState<'particles' | 'shape' | 'glow' | 'complete'>('particles');
  
  useEffect(() => {
    // Timing for animation steps
    const particlesTimer = setTimeout(() => setStep('shape'), duration * 0.2);
    const shapeTimer = setTimeout(() => setStep('glow'), duration * 0.5);
    const glowTimer = setTimeout(() => setStep('complete'), duration * 0.8);
    const completeTimer = setTimeout(() => onComplete(), duration);
    
    return () => {
      clearTimeout(particlesTimer);
      clearTimeout(shapeTimer);
      clearTimeout(glowTimer);
      clearTimeout(completeTimer);
    };
  }, [duration, onComplete]);

  // Particle settings
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2
  }));

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
      <div className="relative w-80 h-80">
        {/* Particle layer */}
        {step === 'particles' && particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-primary/80"
            initial={{ 
              x: `${particle.x}%`, 
              y: `${particle.y}%`, 
              opacity: 0,
              width: `${particle.size}px`,
              height: `${particle.size}px`
            }}
            animate={{ 
              x: '50%', 
              y: '50%', 
              opacity: [0, 1, 0.8],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: duration * 0.0004,
              repeat: 0,
              ease: "easeInOut"
            }}
          />
        ))}
        
        {/* Logo shape formation */}
        {(step === 'shape' || step === 'glow' || step === 'complete') && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="w-48 h-48 rounded-full border-8 border-primary flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border-4 border-[#FF5AF7] flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-[#FF5AF7]" />
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Glow effect */}
        {(step === 'glow' || step === 'complete') && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-56 h-56 rounded-full bg-primary/20 absolute animate-pulse filter blur-xl" />
            <div className="w-40 h-40 rounded-full bg-[#FF5AF7]/20 absolute animate-pulse filter blur-lg" />
          </motion.div>
        )}
        
        {/* Text appearance */}
        {step === 'complete' && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-[#FF5AF7]">
              Chronos Vault
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              The Future of Digital Asset Security
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};