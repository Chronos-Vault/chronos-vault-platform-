import React, { useEffect, useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion, useAnimation, AnimatePresence } from 'framer-motion';

interface RevolutionaryHeroProps {
  onCreateVault: () => void;
}

const RevolutionaryHero: React.FC<RevolutionaryHeroProps> = ({ onCreateVault }) => {
  const controls = useAnimation();
  const orbitRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [timeRemaining, setTimeRemaining] = useState(9043);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number, color: string, speed: number}>>([]);
  const [hologramLines, setHologramLines] = useState<Array<{id: number, delay: number}>>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [isGlowing, setIsGlowing] = useState(false);
  const [activeChain, setActiveChain] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const chains = [
    { id: 1, name: 'TON', color: '#0098EA', icon: 'ri-coin-line' },
    { id: 2, name: 'ETH', color: '#6E78FF', icon: 'ri-ethereum-line' },
    { id: 3, name: 'SOL', color: '#9945FF', icon: 'ri-sun-line' },
    { id: 4, name: 'BTC', color: '#F7931A', icon: 'ri-bit-coin-line' },
  ];

  // Initialize particles
  useEffect(() => {
    const newParticles = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      color: Math.random() > 0.5 ? '#6B00D7' : '#FF5AF7',
      speed: Math.random() * 2 + 0.5,
    }));
    setParticles(newParticles);

    const lines = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      delay: i * 0.05
    }));
    setHologramLines(lines);

    // Run intro animation sequence
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    });

    // Set up timed glowing effect
    const glowInterval = setInterval(() => {
      setIsGlowing(prev => !prev);
    }, 5000);

    // Rotate between active chains
    const chainInterval = setInterval(() => {
      setActiveChain(prev => (prev + 1) % chains.length);
    }, 3000);

    return () => {
      clearInterval(glowInterval);
      clearInterval(chainInterval);
    };
  }, []);

  // Move particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prevParticles =>
        prevParticles.map(particle => ({
          ...particle,
          y: (particle.y - particle.speed * 0.1) % 100, // Move upward
          x: particle.x + Math.sin(particle.y / 10) * 0.1 // Slight sideways drift
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // 3D perspective effect on mousemove
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !orbitRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const moveX = ((e.clientX - centerX) / rect.width) * 20; 
      const moveY = ((e.clientY - centerY) / rect.height) * 20;
      
      orbitRef.current.style.transform = `perspective(1200px) rotateX(${-moveY}deg) rotateY(${moveX}deg)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Countdown timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(prevTime => {
        if (prevTime > 0) return prevTime - 1;
        return 0;
      });
    }, 3600000); // Update once per hour

    return () => clearInterval(interval);
  }, []);

  // Format the time remaining
  const formatTimeRemaining = () => {
    const days = Math.floor(timeRemaining);
    const hours = Math.floor((timeRemaining % 1) * 24);
    return { days, hours };
  };

  const { days } = formatTimeRemaining();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#050505] to-[#0D0D0D] min-h-screen">
      {/* Advanced particle system background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise-texture.png')] mix-blend-overlay opacity-20"></div>
        <div className="absolute inset-0">
          {particles.map(particle => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full z-0"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                backgroundColor: particle.color,
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
                opacity: particle.size > 2.5 ? 0.8 : 0.4,
              }}
              animate={{
                opacity: [0.4, 0.6, 0.4],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2 + particle.speed,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        
        {/* Futuristic grid lines */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          {Array.from({ length: 12 }).map((_, i) => (
            <div 
              key={`h-line-${i}`}
              className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-[#6B00D7]/20 to-transparent opacity-30"
              style={{ top: `${(i + 1) * 8.33}%` }}
            />
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <div 
              key={`v-line-${i}`}
              className="absolute w-[1px] h-full bg-gradient-to-b from-transparent via-[#FF5AF7]/20 to-transparent opacity-30"
              style={{ left: `${(i + 1) * 8.33}%` }}
            />
          ))}
        </div>
        
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-[#6B00D7] rounded-full filter blur-[120px] opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 right-1/4 w-56 h-56 bg-[#FF5AF7] rounded-full filter blur-[140px] opacity-15 animate-pulse-slow" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-3/4 right-1/3 w-40 h-40 bg-[#6B00D7] rounded-full filter blur-[120px] opacity-10 animate-pulse-slow" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="container relative z-10 mx-auto px-4 py-16 md:py-24 flex flex-col h-screen">
        <div className="flex flex-col lg:flex-row items-center justify-between h-full gap-8 lg:gap-16">
          {/* Left content column */}
          <motion.div 
            className="lg:w-1/2 space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
          >
            {/* Badge */}
            <motion.div 
              className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 border border-[#6B00D7]/40 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <span className="flex items-center text-xs font-medium text-[#FF5AF7] tracking-wider uppercase">
                <motion.i 
                  className="ri-shield-keyhole-line mr-1.5"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                ></motion.i>
                <span className="inline-block overflow-hidden">
                  <motion.span 
                    className="inline-block"
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    Triple-Chain Security
                  </motion.span>
                </span>
              </span>
            </motion.div>
            
            {/* Title with advanced animation */}
            <div>
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight tracking-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <span className="inline-block mb-2 text-[12px] md:text-sm uppercase tracking-[0.2em] text-[#FF5AF7] font-semibold">The Future of Asset Security</span>
                <motion.div 
                  className="bg-clip-text text-transparent bg-gradient-to-r from-white via-[#FF5AF7] to-white bg-size-200 animate-bg-pan-slow"
                >
                  Chronos Vault
                </motion.div>
                <motion.div 
                  className="mt-3 text-xl md:text-2xl font-medium text-gray-200 opacity-90 leading-normal"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <span className="text-white font-light">The </span>
                  <span className="font-semibold animate-text-shimmer inline-block bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] via-white to-[#FF5AF7]">Tesla × Rolex × Web3</span>
                  <span className="text-white font-light"> of Digital Vaults</span>
                </motion.div>
              </motion.h1>
            </div>
            
            <motion.p 
              className="text-xl text-gray-300 max-w-xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              The world's most advanced blockchain vault system with quantum-resistant encryption, zero-knowledge proofs, and revolutionary cross-chain security architecture.
            </motion.p>
            
            {/* Chain compatibility */}
            <motion.div 
              className="flex flex-wrap gap-4 items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <div className="text-sm uppercase tracking-wide text-gray-400 font-medium">Secured Across:</div>
              {chains.map((chain, index) => (
                <motion.div 
                  key={chain.id}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all duration-300 ${activeChain === index ? 'bg-gradient-to-r from-[#6B00D7]/30 to-[#FF5AF7]/20 border border-[#6B00D7]/40 scale-110' : 'bg-white/5 border border-white/10'}`}
                  whileHover={{ scale: 1.05 }}
                  style={{
                    boxShadow: activeChain === index ? `0 0 20px ${chain.color}40` : 'none'
                  }}
                >
                  <i className={`${chain.icon} text-[${chain.color}]`}></i>
                  <span className="font-semibold text-white">{chain.name}</span>
                  {activeChain === index && (
                    <motion.div 
                      className="absolute inset-0 rounded-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.2, 0, 0.2] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{ 
                        background: `linear-gradient(90deg, transparent, ${chain.color}30, transparent)`,
                        zIndex: -1
                      }}
                    />
                  )}
                </motion.div>
              ))}
            </motion.div>
            
            {/* CTA Buttons with advanced effects */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
            >
              <motion.div 
                className="relative group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] rounded-xl blur-lg opacity-60 group-hover:opacity-100 transition duration-500 group-hover:duration-200 animate-gradient-slow"></div>
                <Button 
                  onClick={onCreateVault}
                  className="relative bg-[#0D0D0D] w-full px-6 py-6 text-lg font-medium rounded-xl z-10 border border-[#6B00D7]/50 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#6B00D7] via-[#C74DFF] to-[#FF5AF7] opacity-0 group-hover:opacity-20 transition-opacity"></div>
                  <div className="flex items-center justify-center relative z-10">
                    <motion.i 
                      className="ri-shield-keyhole-line mr-2 text-xl text-[#FF5AF7]"
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: "loop", repeatDelay: 5 }}
                    ></motion.i> 
                    <span>Create Your Vault</span>
                  </div>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  variant="outline" 
                  className="w-full px-6 py-6 text-lg font-medium rounded-xl border-2 border-[#6B00D7] hover:border-[#FF5AF7] hover:bg-[#6B00D7]/10 transition-all"
                  asChild
                >
                  <Link href="/documentation/multi-signature-vault">
                    <div className="flex items-center justify-center">
                      <motion.i 
                        className="ri-lock-password-line mr-2 text-xl text-[#FF5AF7]"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      ></motion.i>
                      <span>Multi-Signature Vault</span>
                    </div>
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
            
            {/* Security features with animated icons */}
            <motion.div 
              className="grid grid-cols-2 gap-4 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              {[
                { icon: 'ri-shield-check-line', text: 'Quantum-Resistant Encryption' },
                { icon: 'ri-eye-off-line', text: 'Zero-Knowledge Privacy' },
                { icon: 'ri-time-line', text: 'Time-Locked Protocols' },
                { icon: 'ri-link-m', text: 'Cross-Chain Interoperability' }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + (index * 0.1), duration: 0.5 }}
                >
                  <motion.div 
                    className="w-10 h-10 rounded-lg backdrop-blur-md flex items-center justify-center relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, rgba(107,0,215,0.2) 0%, rgba(255,90,247,0.1) 100%)',
                      border: '1px solid rgba(107,0,215,0.3)'
                    }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <motion.i 
                      className={`${feature.icon} text-[#FF5AF7]`}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                    ></motion.i>
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FF5AF7]/20 to-transparent"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3, delay: index * 0.5 }}
                    />
                  </motion.div>
                  <span className="text-sm text-gray-200 font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Revolutionary 3D Vault */}
          <motion.div 
            className="lg:w-1/2 flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div 
              ref={containerRef} 
              className="relative w-full max-w-lg aspect-[3/4] py-4"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {/* 3D Orbital System with perspective */}
              <div 
                ref={orbitRef} 
                className="absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out cursor-pointer"
                style={{ transformStyle: 'preserve-3d', transform: 'perspective(1000px)' }}
              >
                {/* Orbital rings with depth */}
                <motion.div 
                  className="absolute w-full h-full flex items-center justify-center"
                  style={{ transform: 'translateZ(40px)' }}
                >
                  <motion.div 
                    className="absolute w-[85%] h-[85%] rounded-full border-2 border-[#6B00D7]/30 opacity-60"
                    animate={{ rotateZ: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    style={{ transform: 'rotateX(75deg) translateZ(20px)' }}
                  />
                  <motion.div 
                    className="absolute w-[70%] h-[70%] rounded-full border border-[#FF5AF7]/20 opacity-50"
                    animate={{ rotateZ: -360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    style={{ transform: 'rotateX(75deg) translateZ(40px)' }}
                  />
                  <motion.div 
                    className="absolute w-[55%] h-[55%] rounded-full border-2 border-[#6B00D7]/10 opacity-40"
                    animate={{ rotateZ: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    style={{ transform: 'rotateX(75deg) translateZ(60px)' }}
                  />
                </motion.div>
                
                {/* Quantum particles orbiting */}
                {Array.from({ length: 15 }).map((_, i) => {
                  const angle = (i / 15) * Math.PI * 2;
                  const radius = 130 + (i % 3) * 30;
                  const x = Math.cos(angle) * radius;
                  const z = Math.sin(angle) * radius;
                  const delay = i * 0.2;
                  
                  return (
                    <motion.div
                      key={`quantum-${i}`}
                      className="absolute rounded-full"
                      style={{ 
                        width: `${(i % 4) + 2}px`,
                        height: `${(i % 4) + 2}px`,
                        background: i % 2 === 0 ? '#6B00D7' : '#FF5AF7',
                        boxShadow: `0 0 8px ${i % 2 === 0 ? '#6B00D7' : '#FF5AF7'}`,
                        transform: `translateX(${x}px) translateZ(${z}px) translateY(${-70 - (i % 4) * 20}px)`,
                        opacity: 0.7,
                      }}
                      animate={{
                        opacity: [0.4, 0.8, 0.4],
                        scale: [1, 1.5, 1],
                      }}
                      transition={{
                        duration: 2,
                        delay,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    />
                  );
                })}
                
                {/* Main Vault */}
                <motion.div 
                  className={`relative ${isExpanded ? 'w-[90%] h-[90%]' : 'w-[85%] h-[85%]'} bg-gradient-to-br from-[#12121E] to-[#080811] rounded-2xl overflow-hidden border-[3px] border-[#333]/80 transition-all duration-700 shadow-2xl`}
                  style={{ 
                    boxShadow: isGlowing ? '0 0 60px rgba(107,0,215,0.4)' : '0 0 30px rgba(107,0,215,0.2)',
                    transform: `translateZ(0px) ${isExpanded ? 'scale(1.1)' : 'scale(1)'}`,
                  }}
                  whileHover={{ scale: 1.02 }}
                  animate={{ 
                    boxShadow: isGlowing 
                      ? ['0 0 30px rgba(107,0,215,0.2)', '0 0 60px rgba(107,0,215,0.4)', '0 0 30px rgba(107,0,215,0.2)'] 
                      : '0 0 30px rgba(107,0,215,0.2)'
                  }}
                  transition={{ duration: 2 }}
                >
                  {/* Holographic scan effect */}
                  <div className="absolute inset-0 overflow-hidden opacity-40">
                    {hologramLines.map(line => (
                      <motion.div 
                        key={line.id} 
                        className="absolute h-[2px] w-full bg-gradient-to-r from-transparent via-[#FF5AF7] to-transparent"
                        style={{ 
                          top: `${line.id * 2.5}%`,
                          opacity: 0.4,
                        }}
                        animate={{
                          left: ['-100%', '100%'],
                        }}
                        transition={{
                          duration: 3,
                          delay: line.delay,
                          repeat: Infinity,
                          ease: "linear"  
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Glass reflection */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-30"></div>
                  
                  {/* Secure badge */}
                  <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4">
                    <motion.div 
                      className="w-20 h-20 rounded-full flex items-center justify-center shadow-xl"
                      style={{
                        background: 'linear-gradient(135deg, #6B00D7 0%, #FF5AF7 100%)',
                        border: '2px solid rgba(255,255,255,0.2)'
                      }}
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 5, repeat: Infinity }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <motion.i 
                        className="ri-shield-keyhole-line text-white text-2xl"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      ></motion.i>
                    </motion.div>
                  </div>
                  
                  {/* Status indicator */}
                  <div className="absolute top-6 left-6 flex items-center gap-2">
                    <motion.div 
                      className="w-3 h-3 rounded-full bg-[#FF5AF7]"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{
                        boxShadow: '0 0 10px #FF5AF7'
                      }}
                    />
                    <span className="text-xs font-semibold text-white tracking-widest">QUANTUM SECURED</span>
                  </div>
                  
                  {/* Vault Content */}
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <motion.div 
                      className="mb-4 text-sm font-bold tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-[#6B00D7] via-[#FF5AF7] to-[#6B00D7] animate-gradient-slow"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      CHRONO·VAULT
                    </motion.div>
                    
                    <motion.h3 
                      className="text-2xl md:text-3xl font-bold mb-4 uppercase tracking-wider text-white"
                      animate={{ 
                        textShadow: ['0 0 8px rgba(255,90,247,0.3)', '0 0 16px rgba(255,90,247,0.5)', '0 0 8px rgba(255,90,247,0.3)'] 
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      Triple-Chain Vault
                    </motion.h3>
                    
                    <div className="w-24 h-1 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] rounded-full mb-6"></div>
                    
                    <motion.div 
                      className="relative p-5 border-2 border-[#6B00D7]/20 rounded-xl backdrop-blur-sm bg-black/20 max-w-xs mb-6"
                      whileHover={{ scale: 1.03 }}
                    >
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#050505] px-4 py-1 text-[#FF5AF7] text-xs rounded-full border border-[#6B00D7]/30">
                        <span className="font-semibold">2050 A.D.</span>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        "We entrust this data to future generations. When opened in 2050, may this knowledge help build a more equitable decentralized financial system."
                      </p>
                    </motion.div>
                    
                    {/* Time Remaining */}
                    <motion.div 
                      className="relative w-36 h-36 rounded-full border-4 border-[#6B00D7]/30 flex items-center justify-center"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    >
                      <motion.div 
                        className="absolute inset-3 rounded-full border-2 border-[#FF5AF7]/20 z-0"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                      />
                      
                      {/* Circular time markers */}
                      {Array.from({ length: 12 }).map((_, i) => {
                        const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
                        const x = Math.cos(angle) * 58;
                        const y = Math.sin(angle) * 58;
                        
                        return (
                          <div 
                            key={`marker-${i}`}
                            className="absolute w-1 h-3 bg-[#FF5AF7]/70"
                            style={{
                              left: 'calc(50% - 1px)',
                              top: 'calc(50% - 1.5px)',
                              transform: `rotate(${i * 30}deg) translateY(-58px)`,
                              transformOrigin: 'center 58px'
                            }}
                          />
                        );
                      })}
                      
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                        <div className="text-center">
                          <motion.div 
                            className="text-3xl font-bold text-white"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1, duration: 0.5 }}
                          >
                            {days.toLocaleString()}
                          </motion.div>
                          <motion.div 
                            className="text-xs text-gray-400 uppercase tracking-wider"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.3, duration: 0.5 }}
                          >
                            DAYS REMAINING
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
                
                {/* Data flow lines connecting to vault */}
                {chains.map((chain, i) => {
                  const angle = (i / chains.length) * Math.PI * 2;
                  const radius = 160;
                  const x = Math.cos(angle) * radius;
                  const z = Math.sin(angle) * radius;
                  
                  return (
                    <React.Fragment key={`chain-${chain.id}`}>
                      <motion.div
                        className="absolute flex items-center justify-center rounded-lg bg-black/40 backdrop-blur-md border border-white/10 w-14 h-14 shadow-xl"
                        style={{ 
                          transform: `translateX(${x}px) translateZ(${z}px)`,
                          boxShadow: `0 0 20px ${chain.color}40`
                        }}
                        animate={{ 
                          y: [0, -5, 0],
                          boxShadow: [`0 0 10px ${chain.color}30`, `0 0 20px ${chain.color}50`, `0 0 10px ${chain.color}30`]
                        }}
                        transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
                        whileHover={{ scale: 1.2 }}
                      >
                        <i className={`${chain.icon} text-[${chain.color}] text-xl`}></i>
                      </motion.div>
                      
                      {/* Data flow animation from chain to vault */}
                      <motion.div
                        className="absolute h-[2px] bg-gradient-to-r from-transparent via-white to-transparent"
                        style={{
                          width: radius,
                          transformOrigin: '0 0',
                          transform: `translateX(${x}px) translateZ(${z}px) rotateY(${-angle * (180 / Math.PI) - 90}deg) rotateZ(90deg)`,
                          opacity: 0.3
                        }}
                      >
                        <motion.div 
                          className="absolute top-0 left-0 h-full w-4 rounded"
                          style={{ backgroundColor: chain.color, filter: `blur(2px)` }}
                          animate={{ x: [0, radius, 0] }}
                          transition={{ 
                            duration: 3, 
                            repeat: Infinity, 
                            delay: i * 0.7,
                            ease: "easeInOut" 
                          }}
                        />
                      </motion.div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          onClick={() => {
            const featuresSection = document.querySelector('#features');
            if (featuresSection) featuresSection.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <div className="text-xs text-gray-400 uppercase tracking-widest mb-2">Explore</div>
          <motion.div 
            className="w-8 h-8 flex items-center justify-center rounded-full border border-[#6B00D7]/30"
            whileHover={{ scale: 1.1 }}
          >
            <i className="ri-arrow-down-line text-[#FF5AF7]"></i>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default RevolutionaryHero;
