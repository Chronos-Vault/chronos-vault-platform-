import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Button } from "@/components/ui/button";
import ThreeDHeroBackground from './3DHeroBackground';

interface EnhancedHeroProps {
  onCreateVault: () => void;
}

const EnhancedHero: React.FC<EnhancedHeroProps> = ({ onCreateVault }) => {
  const [scanLines, setScanLines] = useState<Array<{ id: number; delay: number }>>([]);
  const orbitalsRef = useRef<HTMLDivElement>(null);
  const [rotationDegree, setRotationDegree] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(heroRef, { once: false, amount: 0.3 });
  const titleControls = useAnimation();
  const rotatingTextRef = useRef<HTMLDivElement>(null);
  const [rotatingTextIndex, setRotatingTextIndex] = useState(0);
  const rotatingTexts = [
    "Secure Your Future in Web3",
    "Triple-Chain Security Architecture",
    "Quantum-Resistant Encryption",
    "Next-Generation Digital Vaults"
  ];
  
  // Create scanlines with staggered delay
  useEffect(() => {
    const lines = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      delay: i * 0.1
    }));
    setScanLines(lines);
  }, []);

  // Subtle mouse-follow 3D effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!orbitalsRef.current || !heroRef.current) return;
      
      const rect = heroRef.current.getBoundingClientRect();
      const { clientX, clientY } = e;
      
      // Calculate position relative to the hero section
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      
      // Calculate the percentage of mouse position relative to hero dimensions
      const xPercent = ((x / rect.width) - 0.5) * 15; // -7.5 to 7.5 degrees
      const yPercent = ((y / rect.height) - 0.5) * 10; // -5 to 5 degrees
      
      // Apply the transformation with a smooth transition
      orbitalsRef.current.style.transform = `perspective(1000px) rotateY(${xPercent}deg) rotateX(${-yPercent}deg)`;
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove);
      return () => heroElement.removeEventListener('mousemove', handleMouseMove);
    }
    return undefined;
  }, []);

  // Rotate time remaining countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setRotationDegree(prev => (prev + 1) % 360);
    }, 120);
    return () => clearInterval(interval);
  }, []);

  // Rotating text effect
  useEffect(() => {
    const interval = setInterval(() => {
      setRotatingTextIndex(prev => (prev + 1) % rotatingTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // 3D floating effect for title
  useEffect(() => {
    if (isInView) {
      const floatSequence = async () => {
        while (true) {
          await titleControls.start({
            rotateX: 5, 
            rotateY: 10, 
            z: 20,
            transition: { duration: 2.5, ease: "easeInOut" }
          });
          await titleControls.start({
            rotateX: -3, 
            rotateY: -5, 
            z: 10,
            transition: { duration: 2.5, ease: "easeInOut" }
          });
          await titleControls.start({
            rotateX: 0, 
            rotateY: 0, 
            z: 0,
            transition: { duration: 2.5, ease: "easeInOut" }
          });
        }
      };
      floatSequence();
    }
  }, [isInView, titleControls]);

  // Generate particles
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    opacity: Math.random() * 0.5 + 0.1,
    speed: Math.random() * 60 + 20,
    delay: Math.random() * 5
  }));

  return (
    <section ref={heroRef} className="relative hero-gradient min-h-screen overflow-hidden pt-12 pb-20 md:pt-16 md:pb-32 flex items-center">
      {/* 3D Background with Three.js */}
      <ThreeDHeroBackground />
      
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-[#080808] opacity-50"></div>
      
      {/* Additional visual elements */}
      <div className="absolute inset-0 -z-5 pointer-events-none">
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#6B00D7] rounded-full filter blur-[180px] opacity-10 animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FF5AF7] rounded-full filter blur-[180px] opacity-10 animate-pulse-slow" style={{animationDelay: '1s'}}></div>
        
        {/* Circuit pattern background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Scanline effect */}
        <div className="absolute inset-0 overflow-hidden opacity-5 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full animate-scan-vertical"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="w-full md:w-1/2 space-y-8">
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 border border-[#6B00D7]/30 backdrop-blur-sm mb-2"
            >
              <span className="flex items-center text-xs md:text-sm font-medium text-[#FF5AF7]">
                <i className="ri-shield-keyhole-line mr-2"></i>
                Triple-Chain Security
              </span>
            </motion.div>
            
            {/* Title with animation */}
            <div className="animate-slide-lr">
              <motion.h1 
                animate={titleControls}
                className="font-poppins font-bold"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <span className="hero-title animate-glow whitespace-nowrap">Chronos Vault</span>
                <div className="mt-2 text-xl md:text-2xl font-medium text-gray-200 opacity-90">
                  <span className="animate-text-3d inline-block">
                    The Tesla × Rolex × Web3 of Digital Vaults
                  </span>
                </div>
              </motion.h1>
              
              {/* Rotating text headline */}
              <div ref={rotatingTextRef} className="h-12 mt-4 overflow-hidden">
                {rotatingTexts.map((text, index) => (
                  <motion.div 
                    key={text}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ 
                      y: rotatingTextIndex === index ? 0 : 40, 
                      opacity: rotatingTextIndex === index ? 1 : 0 
                    }}
                    transition={{ duration: 0.5 }}
                    className={rotatingTextIndex === index ? "block" : "hidden"}
                  >
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF5AF7] to-[#6B00D7]">
                      {text}
                    </h2>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-gray-300 max-w-xl"
            >
              The most sophisticated digital vault system ever created, combining Triple-Chain Security, Zero-Knowledge Privacy, and Quantum-Resistant Encryption.
            </motion.p>
            
            {/* Multi-chain notification */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-2 mb-5 rounded-xl bg-[#1A1A1A]/50 border border-[#6B00D7]/20 p-3 flex flex-wrap items-center backdrop-blur-sm"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center mr-3">
                <i className="ri-global-line text-white"></i>
              </div>
              <div>
                <div className="text-white font-medium">Multi-Chain Compatibility</div>
                <div className="flex flex-wrap gap-2 mt-1">
                  <div className="px-2 py-1 bg-[#3c3483]/40 rounded-md text-white text-xs font-semibold flex items-center">
                    <i className="ri-ethereum-line mr-1"></i> ETH
                  </div>
                  <div className="px-2 py-1 bg-[#9945FF]/40 rounded-md text-white text-xs font-semibold flex items-center">
                    <i className="ri-sun-line mr-1"></i> SOL
                  </div>
                  <div className="px-2 py-1 bg-[#0098EA]/40 rounded-md text-white text-xs font-semibold flex items-center">
                    <i className="ri-bit-coin-line mr-1"></i> TON
                  </div>
                  <div className="px-2 py-1 bg-[#f7931a]/40 rounded-md text-white text-xs font-semibold flex items-center">
                    <i className="ri-bit-coin-line mr-1"></i> BTC
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button 
                onClick={onCreateVault}
                className="cta-button prismatic-border bg-gradient-to-r from-[#6B00D7] via-[#C74DFF] to-[#FF5AF7] animate-gradient-slow px-6 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl hover:shadow-[#6B00D7]/20 transition-all hover:scale-105 transform duration-300"
              >
                <div className="flex items-center">
                  <i className="ri-shield-keyhole-line mr-2 text-xl"></i> 
                  <span>Create Your Vault</span>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="border-2 border-[#6B00D7] hover:border-[#FF5AF7] text-white px-6 py-6 text-lg font-semibold rounded-xl transition-all hover:bg-[#6B00D7]/10 backdrop-blur-sm"
                asChild
              >
                <a href="#features">
                  <div className="flex items-center">
                    <i className="ri-lock-password-line mr-2 text-xl"></i>
                    <span>Multi-Signature Vault</span>
                  </div>
                </a>
              </Button>
            </motion.div>
            
            {/* Security features */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="grid grid-cols-2 gap-4 pt-4"
            >
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <div className="w-8 h-8 rounded-full bg-[#6B00D7]/20 flex items-center justify-center">
                  <i className="ri-shield-check-line text-[#FF5AF7]"></i>
                </div>
                <span>Military-Grade Encryption</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <div className="w-8 h-8 rounded-full bg-[#6B00D7]/20 flex items-center justify-center">
                  <i className="ri-lock-line text-[#FF5AF7]"></i>
                </div>
                <span>Zero-Knowledge Privacy</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <div className="w-8 h-8 rounded-full bg-[#6B00D7]/20 flex items-center justify-center">
                  <i className="ri-time-line text-[#FF5AF7]"></i>
                </div>
                <span>Time-Locked Protocols</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <div className="w-8 h-8 rounded-full bg-[#6B00D7]/20 flex items-center justify-center">
                  <i className="ri-global-line text-[#FF5AF7]"></i>
                </div>
                <span>Cross-Chain Compatibility</span>
              </div>
            </motion.div>
          </div>
          
          {/* 3D Vault Visualization */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="w-full md:w-1/2 flex justify-center relative z-20"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div ref={orbitalsRef} className="relative transition-transform duration-300 ease-out" style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}>
              {/* Orbital rings with 3D effect */}
              <div className="relative w-[350px] h-[530px] md:w-[450px] md:h-[650px] flex items-center justify-center">
                {/* Dynamic orbital rings with 3D perspective */}
                <div className="absolute w-full h-full flex items-center justify-center">
                  <div className="absolute w-80 h-80 md:w-[450px] md:h-[450px] rounded-full border border-[#6B00D7]/30 animate-spin-slow opacity-40" style={{animationDuration: '25s', transform: 'rotateX(80deg)'}}></div>
                  <div className="absolute w-72 h-72 md:w-[400px] md:h-[400px] rounded-full border border-[#FF5AF7]/20 animate-spin-slow opacity-40" style={{animationDuration: '20s', animationDirection: 'reverse', transform: 'rotateX(70deg)'}}></div>
                  <div className="absolute w-64 h-64 md:w-[350px] md:h-[350px] rounded-full border-2 border-[#6B00D7]/10 animate-spin-slow opacity-30" style={{animationDuration: '15s', transform: 'rotateX(60deg)'}}></div>
                </div>
                
                {/* Quantum particles */}
                {Array.from({ length: 15 }).map((_, i) => (
                  <div 
                    key={`particle-${i}`}
                    className="absolute rounded-full animate-float opacity-70"
                    style={{
                      width: `${Math.random() * 6 + 2}px`,
                      height: `${Math.random() * 6 + 2}px`,
                      background: Math.random() > 0.5 ? '#6B00D7' : '#FF5AF7',
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDuration: `${Math.random() * 10 + 5}s`,
                      animationDelay: `${Math.random() * 5}s`,
                      boxShadow: `0 0 10px ${Math.random() > 0.5 ? '#6B00D7' : '#FF5AF7'}`
                    }}
                  />
                ))}
                
                {/* Main vault - with premium luxury design */}
                <div className="relative w-72 h-[520px] md:w-[400px] md:h-[620px] bg-gradient-to-br from-[#1A1A1A] to-black rounded-3xl shadow-2xl border-4 border-[#333333] glow-border flex items-center justify-center overflow-hidden backdrop-blur-lg" style={{transform: 'translateZ(50px)'}}> {/* Added 3D transform with Z translation */}
                  {/* Hologram security lines */}
                  <div className="absolute inset-0 overflow-hidden opacity-20">
                    <div className="absolute top-0 left-0 right-0 h-full w-full">
                      {scanLines.map(line => (
                        <div 
                          key={line.id} 
                          className="absolute h-[1px] w-full bg-[#FF5AF7] animate-scan"
                          style={{ 
                            top: `${line.id * 3.3}%`, 
                            left: 0, 
                            animationDelay: `${line.delay}s`,
                            opacity: 0.4
                          }} 
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Premium glass reflection */}
                  <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-white via-transparent to-transparent"></div>
                  
                  {/* Security badge */}
                  <div className="absolute -top-5 -right-5 w-20 h-20 rounded-full bg-gradient-to-r from-[#6B00D7] via-[#C74DFF] to-[#FF5AF7] animate-gradient-slow flex items-center justify-center text-white text-2xl shadow-xl shadow-[#FF5AF7]/30 border-2 border-white/20 z-20">
                    <i className="ri-shield-keyhole-line"></i>
                  </div>
                  
                  {/* Premium status marker */}
                  <div className="absolute top-6 left-6 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF5AF7] animate-pulse-slow shadow-glow-sm"></div>
                    <span className="text-xs font-bold text-white tracking-widest">QUANTUM SECURED</span>
                  </div>
                  
                  {/* Content */}
                  <div className="text-center p-6 z-10 mt-6 w-full">
                    <div className="text-lg font-bold uppercase tracking-widest mb-4 animate-text-3d bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] via-[#FF5AF7] to-[#6B00D7]">
                      CHRONO·VAULT
                    </div>
                    
                    <div className="font-poppins font-extrabold text-3xl md:text-4xl mb-4 title-3d">THE TIME VAULT</div>
                    
                    <div className="flex justify-center mb-6">
                      <div className="h-1 w-44 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] rounded-full"></div>
                    </div>
                    
                    <div className="relative mb-8 p-5 text-base text-white leading-relaxed border-2 border-[#6B00D7]/40 rounded-lg backdrop-blur-sm bg-black/30">
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-black px-4 py-1 text-[#FF5AF7] text-sm font-bold uppercase tracking-wider border border-[#6B00D7]/50 rounded-full">
                        2050 A.D.
                      </div>
                      
                      <p className="font-medium animate-text-3d tracking-wide">
                        "We trust in your power to protect this knowledge. When opened in 2050, may our message guide your civilization toward harmony with technology and nature."
                      </p>
                    </div>
                    
                    {/* Countdown timer with rotational effect */}
                    <div style={{ transform: `rotate(${rotationDegree}deg)` }} className="w-48 h-48 mx-auto relative mb-6 transition-all duration-100 ease-linear">
                      <div className="absolute inset-0 rounded-full border-4 border-[#6B00D7]/30"></div>
                      <div className="absolute inset-2 rounded-full border-4 border-[#FF5AF7]/20"></div>
                      <div className="absolute inset-4 rounded-full border-4 border-[#6B00D7]/10"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-white">9,043</div>
                          <div className="text-xs text-gray-400 uppercase mt-1">DAYS REMAINING</div>
                        </div>
                      </div>
                      
                      {/* Rotational markers */}
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div 
                          key={`marker-${i}`}
                          className="absolute w-1 h-3 bg-[#FF5AF7]/70"
                          style={{
                            left: '50%',
                            top: '0',
                            transformOrigin: 'bottom center',
                            transform: `translateX(-50%) rotate(${i * 30}deg) translateY(-12px)`
                          }}
                        />
                      ))}
                    </div>
                    
                    <div className="flex justify-center space-x-2">
                      <div className="px-3 py-1 rounded-md bg-[#6B00D7]/30 text-xs text-white font-semibold">QUANTUM ENCRYPTED</div>
                      <div className="px-3 py-1 rounded-md bg-[#FF5AF7]/30 text-xs text-white font-semibold">TRIPLE-CHAIN</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedHero;