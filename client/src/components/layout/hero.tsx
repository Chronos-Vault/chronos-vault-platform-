import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LockIcon, ShieldIcon, ClockIcon, ArrowRight } from 'lucide-react';
import { useAuthContext } from '@/contexts/auth-context';
import { Link } from 'wouter';

export function Hero() {
  const { isAuthenticated } = useAuthContext();
  const [scrolled, setScrolled] = useState(false);

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
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#121212] to-[#0A0A0A] z-0"></div>
      <div className="absolute inset-0 opacity-20 z-1">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#6B00D7] blur-3xl"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 200 + 50}px`,
              height: `${Math.random() * 200 + 50}px`,
              opacity: Math.random() * 0.5,
              animation: `pulse ${Math.random() * 10 + 10}s infinite alternate ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
      
      {/* Grid Lines */}
      <div className="absolute inset-0 z-1">
        <div className="h-full w-full bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-[#6B00D7]/10 to-[#FF5AF7]/10 rounded-full border border-[#6B00D7]/30 mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] font-medium">
                The Swiss Bank of Web3
              </span>
            </div>
          </motion.div>

          <motion.h1 
            variants={itemVariants} 
            className="text-4xl md:text-6xl font-bold mb-6 text-white"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Secure Your </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">Digital Legacy</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"> Across Time</span>
          </motion.h1>

          <motion.p 
            variants={itemVariants} 
            className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            A trustless vault protocol that locks your digital assets with unbreakable time mechanisms, ensuring your wealth remains secure for generations.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90 text-white font-medium text-lg px-8 py-6 rounded-xl shadow-xl shadow-[#6B00D7]/20 hover:shadow-[#FF5AF7]/30 transition-all"
            >
              <Link href={isAuthenticated ? "/my-vaults" : "/#features"}>
                {isAuthenticated ? "My Vaults" : "Explore Features"}
              </Link>
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-[#1A1A1A]/50 text-white hover:border-[#6B00D7] border-[#333] text-lg px-8 py-6 rounded-xl backdrop-blur-sm transition-all"
            >
              <Link href={isAuthenticated ? "/create-vault" : "/#how-it-works"}>
                {isAuthenticated ? "Create New Vault" : "How It Works"}
              </Link>
            </Button>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              { 
                icon: <LockIcon className="h-6 w-6 text-[#FF5AF7]" />, 
                title: "Military-Grade Security", 
                description: "Immutable blockchain technology keeps your assets secured with unbreakable encryption." 
              },
              { 
                icon: <ClockIcon className="h-6 w-6 text-[#FF5AF7]" />, 
                title: "Time-Locked Protection", 
                description: "Set precise unlocking dates that cannot be altered once committed to the chain." 
              },
              { 
                icon: <ShieldIcon className="h-6 w-6 text-[#FF5AF7]" />, 
                title: "Multi-Chain Support", 
                description: "Native support for Ethereum, Solana, and TON blockchains in a unified interface." 
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-gradient-to-b from-[#1A1A1A] to-[#121212] p-6 rounded-2xl border border-[#333] hover:border-[#6B00D7]/50 transition-all group"
              >
                <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 mb-4 mx-auto shadow-inner shadow-[#6B00D7]/10 border border-[#6B00D7]/20 group-hover:from-[#6B00D7]/30 group-hover:to-[#FF5AF7]/20 transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Foreground Accent Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] blur-2xl opacity-60"></div>
    </section>
  );
}

export default Hero;