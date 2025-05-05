import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LockIcon, ShieldIcon, ClockIcon, ArrowRight, Diamond, Sparkle } from 'lucide-react';
import { useAuthContext } from '@/contexts/auth-context';
import { Link } from 'wouter';

export function Hero() {
  const { isAuthenticated } = useAuthContext();
  const [scrolled, setScrolled] = useState(false);
  const titleControls = useAnimation();
  const heroRef = useRef(null);
  const isInView = useInView(heroRef, { once: false, amount: 0.5 });

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  // Start the 3D title animation when in view
  useEffect(() => {
    if (isInView) {
      // Floating 3D animation
      const floatSequence = async () => {
        while (true) {
          await titleControls.start({
            rotateX: 10, 
            rotateY: 15, 
            z: 50,
            transition: { duration: 3, ease: "easeInOut" }
          });
          await titleControls.start({
            rotateX: -5, 
            rotateY: -10, 
            z: 30,
            transition: { duration: 3, ease: "easeInOut" }
          });
          await titleControls.start({
            rotateX: 0, 
            rotateY: 0, 
            z: 0,
            transition: { duration: 3, ease: "easeInOut" }
          });
        }
      };
      floatSequence();
    }
  }, [isInView, titleControls]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 10 }
    },
  };

  return (
    <section ref={heroRef} className="relative overflow-hidden min-h-[100vh] flex items-center">
      {/* 3D Background with Light & Shadow Effects */}
      <div className="absolute inset-0 perspective-1000">
        {/* Dark metallic background */}
        <div className="absolute inset-0 bg-[#080808] z-0"></div>
        
        {/* Luxury gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] to-black opacity-80 z-1"></div>
        
        {/* Premium light effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-2">
          {/* Ambient glow points */}
          <div className="absolute top-1/4 -left-20 w-[40vw] h-[40vw] rounded-full bg-gradient-radial from-[#9F00FF] to-transparent opacity-10 blur-[120px]"></div>
          <div className="absolute bottom-1/4 -right-20 w-[30vw] h-[30vw] rounded-full bg-gradient-radial from-[#FF5AF7] to-transparent opacity-10 blur-[100px]"></div>
          <div className="absolute top-1/3 right-1/4 w-[20vw] h-[20vw] rounded-full bg-gradient-radial from-[#C87DFF] to-transparent opacity-5 blur-[80px]"></div>
        </div>
        
        {/* High-end metal grid pattern */}
        <div className="absolute inset-0 z-2">
          <div className="h-full w-full bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>
        
        {/* Moving light reflection effect */}
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-[#9F00FF]/10 to-transparent transform -skew-y-6 animate-pulse-slow z-2 opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-full h-40 bg-gradient-to-t from-[#FF5AF7]/10 to-transparent transform skew-y-6 animate-pulse-slow animation-delay-2000 z-2 opacity-20"></div>
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-10 sm:py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto text-center perspective-1000"
        >
          {/* Premium Badge */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#1A1A1A] to-[#0D0D0D] rounded-full border border-[#333] shadow-lg shadow-black/20 backdrop-blur-sm">
              <Diamond className="h-4 w-4 mr-2 text-[#FF5AF7]" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-[#C87DFF] to-white font-medium">
                Triple-Chain Security Architecture
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer rounded-full"></div>
            </div>
          </motion.div>

          {/* 3D Title Container with perspective - Tesla x Rolex x Web3 luxury design */}
          <motion.div 
            variants={itemVariants} 
            className="relative perspective-1000 mb-8 py-10 transform-style-3d px-4"
          >
            {/* 3D Title that floats and rotates slightly */}
            <motion.div 
              className="relative perspective-1000 inline-block"
              style={{ transformStyle: 'preserve-3d' }}
              animate={titleControls}
            >
              {/* Title shadow/reflection on the "floor" */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-4/5 h-12 bg-gradient-to-t from-[#9F00FF]/30 to-transparent blur-xl rounded-full transform -translateZ-20 opacity-60 scale-75"></div>

              {/* Massive Eye-Catching 3D Title */}
              <div className="relative h-[300px] lg:h-[350px] flex items-center justify-center overflow-visible p-4 mb-6">
                {/* Premium glow background */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#9F00FF]/30 via-[#FF5AF7]/20 to-[#9F00FF]/30 rounded-full blur-3xl opacity-80"></div>
                
                <div className="relative w-full">
                  {/* MEGA 3D TITLE */}
                  <h1 className="mega-title text-7xl sm:text-8xl md:text-9xl lg:text-[120px] font-black text-center leading-none mb-2">
                    {/* Giant glowing Title */}
                    <span className="animate-mega-pulse text-3d text-white block">
                      CHRONOS VAULT
                    </span>
                  </h1>
                  
                  {/* Animated ticker subtitle */}
                  <div className="ticker-container text-3xl sm:text-4xl md:text-5xl font-bold mt-6 sm:mt-8 mx-auto max-w-3xl">
                    <div className="ticker-wrapper ticker-animate">
                      <div className="ticker-text text-metal">
                        TIMELESS SECURITY
                      </div>
                      <div className="ticker-text bg-clip-text text-transparent bg-gradient-to-r from-[#9F00FF] via-[#FF5AF7] to-[#C87DFF]">
                        THE FUTURE OF VAULTS
                      </div>
                    </div>
                  </div>
                </div>

                {/* Luxury sparkle highlights */}
                <Sparkle className="absolute top-4 right-1/4 h-6 w-6 text-white opacity-70 animate-pulse-slow" />
                <Sparkle className="absolute top-0 left-1/3 h-5 w-5 text-[#FF5AF7] opacity-60 animate-pulse-slow animation-delay-1000" />
                <Sparkle className="absolute bottom-1/4 left-1/3 h-4 w-4 text-[#9F00FF] opacity-60 animate-pulse-slow animation-delay-2000" />
              </div>
            </motion.div>
          </motion.div>

          {/* Luxury Metal & Diamond Divider */}
          <motion.div variants={itemVariants} className="relative flex justify-center items-center py-4 mb-4">
            <div className="w-60 h-[1px] bg-gradient-to-r from-transparent via-[#C87DFF] to-transparent"></div>
            <div className="absolute w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-[#1A1A1A] to-black border border-[#333] shadow-lg">
              <div className="w-4 h-4 transform rotate-45 bg-gradient-to-br from-[#9F00FF] to-[#FF5AF7] animate-pulse-slow">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent"></div>
              </div>
            </div>
          </motion.div>

          {/* Premium Subtitle with 3D Effect - now merged with rotating title above */}
          <motion.div variants={itemVariants} className="mb-12 perspective-1000">
            <div className="transform-style-3d relative">
              <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4 mt-6">
                The <span className="text-[#FF5AF7] font-medium">ultimate</span> fusion of <span className="text-[#9F00FF] font-medium">precision engineering</span> and <span className="text-[#C87DFF] font-medium">cutting-edge technology</span>
              </p>
            </div>
          </motion.div>

          {/* Premium CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-5 justify-center mb-20">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90 text-white font-medium text-lg px-10 py-7 rounded-xl shadow-xl shadow-[#6B00D7]/30 hover:shadow-[#FF5AF7]/40 transition-all relative overflow-hidden group"
            >
              {/* Fancy hover light effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
              
              <Link href={isAuthenticated ? "/my-vaults" : "/#features"} className="flex items-center">
                <span>{isAuthenticated ? "My Vaults" : "Explore Features"}</span>
                <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-[#1A1A1A]/50 text-white hover:border-[#6B00D7] border-[#333] text-lg px-10 py-7 rounded-xl backdrop-blur-sm transition-all relative overflow-hidden group"
            >
              {/* Subtle glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#6B00D7]/0 via-[#6B00D7]/10 to-[#6B00D7]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <Link href={isAuthenticated ? "/create-vault" : "/#how-it-works"}>
                {isAuthenticated ? "Create New Vault" : "How It Works"}
              </Link>
            </Button>
          </motion.div>

          {/* Luxury Feature Cards */}
          <motion.div 
            variants={containerVariants}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              { 
                icon: <LockIcon className="h-7 w-7 text-[#FF5AF7]" />, 
                title: "Military-Grade Security", 
                description: "Immutable blockchain technology keeps your assets secured with unbreakable encryption." 
              },
              { 
                icon: <ClockIcon className="h-7 w-7 text-[#FF5AF7]" />, 
                title: "Time-Locked Protection", 
                description: "Set precise unlocking dates that cannot be altered once committed to the chain." 
              },
              { 
                icon: <ShieldIcon className="h-7 w-7 text-[#FF5AF7]" />, 
                title: "Multi-Chain Support", 
                description: "Native support for Ethereum, Solana, and TON blockchains in a unified interface." 
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-gradient-to-b from-[#1A1A1A] to-[#0D0D0D] p-8 rounded-3xl border border-[#333] hover:border-[#6B00D7]/50 transition-all group relative overflow-hidden backdrop-blur-sm"
              >
                {/* Subtle corner highlight */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#FF5AF7]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Premium icon container */}
                <div className="flex items-center justify-center h-18 w-18 rounded-2xl bg-gradient-to-br from-[#0D0D0D] to-[#1A1A1A] mb-6 mx-auto shadow shadow-[#6B00D7]/10 border border-[#6B00D7]/20 group-hover:border-[#6B00D7]/40 p-4 transition-all relative">
                  {/* Reflective light effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-2xl"></div>
                  {feature.icon}
                </div>
                
                <h3 className="text-2xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-lg">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Premium Accent Light Effects */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#9F00FF]/50 to-transparent blur opacity-80"></div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] blur-2xl opacity-30"></div>
    </section>
  );
}

export default Hero;