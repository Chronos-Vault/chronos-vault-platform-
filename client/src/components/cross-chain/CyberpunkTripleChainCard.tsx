import React, { useState, useEffect, useRef } from 'react';

const CyberpunkTripleChainCard: React.FC = () => {
  // For debugging
  console.log('CyberpunkTripleChainCard rendering');
  const [scanLines, setScanLines] = useState<Array<{id: number, delay: number}>>([]);
  const [glitchActive, setGlitchActive] = useState(false);
  // Initialize dataPoints with default values to prevent undefined errors
  const [dataPoints, setDataPoints] = useState<Array<{active: boolean}>>(
    Array.from({ length: 4 }, () => ({ active: true }))
  );
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Initialize scan lines
  useEffect(() => {
    const lines = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      delay: i * 0.1
    }));
    setScanLines(lines);
    
    // Initialize data points
    setDataPoints(Array.from({ length: 4 }, () => ({ active: true })));
  }, []);
  
  // Add occasional glitch effect for sci-fi movie feel
  useEffect(() => {
    const glitchTimer = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 150);
    }, 10000);

    return () => clearInterval(glitchTimer);
  }, []);

  // Add 3D hover effect for sci-fi movie feel
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 25;
      const rotateY = (centerX - x) / 25;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      card.style.transition = 'transform 0.5s ease';
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
  
  // Simulate data flow animation
  useEffect(() => {
    const animateDataFlow = () => {
      setDataPoints(prev => {
        return prev.map((point, index) => ({
          active: Math.random() > 0.3 // 70% chance to be active
        }));
      });
    };
    
    const dataFlowInterval = setInterval(animateDataFlow, 800);
    return () => clearInterval(dataFlowInterval);
  }, []);

  return (
    <div className="relative max-w-lg mx-auto">
      {/* Main card with holographic effects */}
      <div 
        ref={cardRef} 
        className={`relative h-72 md:h-96 border-2 border-[#6B00D7]/30 bg-[#121212] rounded-3xl flex items-center justify-center shadow-2xl shadow-[#6B00D7]/10 overflow-hidden ${glitchActive ? 'animate-pulse' : ''}`}
        style={{ transition: 'transform 0.1s ease' }}
      >
        {/* Enhanced sci-fi scan lines effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Holographic scan lines - subtle animation */}
          {scanLines.map((line, index) => (
            <div 
              key={line.id} 
              className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-[#FF5AF7]/30 to-transparent"
              style={{ 
                top: `${(line.id * 100) / scanLines.length}%`,
                animation: `scanline-move ${2 + index % 3}s linear infinite`,
                animationDelay: `${index * 0.1}s`,
                opacity: 0.2 + (index % 3) * 0.1
              }} 
            />
          ))}
          
          {/* Cross hairs */}
          <div className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-[#FF5AF7]/40 to-transparent top-1/4"></div>
          <div className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-[#FF5AF7]/40 to-transparent top-3/4"></div>
          <div className="absolute w-[1px] h-full bg-gradient-to-b from-transparent via-[#FF5AF7]/40 to-transparent left-1/4"></div>
          <div className="absolute w-[1px] h-full bg-gradient-to-b from-transparent via-[#FF5AF7]/40 to-transparent left-3/4"></div>
        </div>
        
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#6B00D7]/5 to-[#FF5AF7]/5 opacity-50"></div>
        
        {/* Sci-fi grid pattern overlay */}
        <div className="absolute inset-0 opacity-20" 
          style={{
            backgroundImage: 'linear-gradient(to right, #FF5AF7 1px, transparent 1px), linear-gradient(to bottom, #FF5AF7 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        ></div>
      
        {/* Center CVT with cyberpunk styling */}
        <div className="h-24 w-24 rounded-full bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center relative">
          {/* Pulsating circles behind center */}
          <div className="absolute w-36 h-36 rounded-full bg-[#6B00D7]/5 animate-pulse-slow"></div>
          <div className="absolute w-30 h-30 rounded-full bg-[#6B00D7]/10" 
            style={{ animation: 'pulse 4s ease-in-out infinite' }}></div>
          <div className="absolute w-24 h-24 rounded-full bg-[#6B00D7]/15" 
            style={{ animation: 'pulse 3s ease-in-out infinite' }}></div>
          
          {/* Centered CVT */}
          <div className="h-16 w-16 rounded-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center relative z-10"
            style={{ filter: 'drop-shadow(0 0 10px rgba(255, 90, 247, 0.7))' }}>
            <span className="text-white font-bold text-2xl animate-glow">CVT</span>
          </div>
        </div>
        
        {/* Blockchain connections with enhanced cyberpunk styling */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* TON */}
          <div className="absolute top-10 left-10 md:top-14 md:left-20 flex items-center">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-[#6B00D7]/30 to-[#FF5AF7]/20 flex items-center justify-center shadow-lg"
              style={{ 
                boxShadow: dataPoints[0].active ? '0 0 15px rgba(255, 90, 247, 0.5)' : 'none',
                transition: 'box-shadow 0.3s ease'
              }}>
              <span className="text-white font-semibold">TON</span>
            </div>
            <div className="w-16 md:w-24 h-1 bg-gradient-to-r from-[#6B00D7] to-transparent transform rotate-45 origin-left relative overflow-hidden">
              {/* Data flow animation */}
              {dataPoints[0].active && (
                <div className="h-full w-4 bg-[#FF5AF7] absolute left-0" 
                  style={{ animation: 'dataFlow 1.5s linear infinite' }}></div>
              )}
            </div>
          </div>
          
          {/* Ethereum */}
          <div className="absolute top-10 right-10 md:top-14 md:right-20 flex items-center">
            <div className="w-16 md:w-24 h-1 bg-gradient-to-l from-[#6B00D7] to-transparent transform -rotate-45 origin-right relative overflow-hidden">
              {/* Data flow animation */}
              {dataPoints[1].active && (
                <div className="h-full w-4 bg-[#FF5AF7] absolute right-0" 
                  style={{ animation: 'dataFlowReverse 1.5s linear infinite' }}></div>
              )}
            </div>
            <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-[#6B00D7]/30 to-[#FF5AF7]/20 flex items-center justify-center shadow-lg"
              style={{ 
                boxShadow: dataPoints[1].active ? '0 0 15px rgba(255, 90, 247, 0.5)' : 'none',
                transition: 'box-shadow 0.3s ease'
              }}>
              <span className="text-white font-semibold">ETH</span>
            </div>
          </div>
          
          {/* Solana */}
          <div className="absolute bottom-10 left-10 md:bottom-14 md:left-20 flex items-center">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-[#6B00D7]/30 to-[#FF5AF7]/20 flex items-center justify-center shadow-lg"
              style={{ 
                boxShadow: dataPoints[2].active ? '0 0 15px rgba(255, 90, 247, 0.5)' : 'none',
                transition: 'box-shadow 0.3s ease'
              }}>
              <span className="text-white font-semibold">SOL</span>
            </div>
            <div className="w-16 md:w-24 h-1 bg-gradient-to-r from-[#6B00D7] to-transparent transform -rotate-45 origin-left relative overflow-hidden">
              {/* Data flow animation */}
              {dataPoints[2].active && (
                <div className="h-full w-4 bg-[#FF5AF7] absolute left-0" 
                  style={{ animation: 'dataFlow 1.5s linear infinite' }}></div>
              )}
            </div>
          </div>
          
          {/* Arweave */}
          <div className="absolute bottom-10 right-10 md:bottom-14 md:right-20 flex items-center">
            <div className="w-16 md:w-24 h-1 bg-gradient-to-l from-[#6B00D7] to-transparent transform rotate-45 origin-right relative overflow-hidden">
              {/* Data flow animation */}
              {dataPoints[3].active && (
                <div className="h-full w-4 bg-[#FF5AF7] absolute right-0" 
                  style={{ animation: 'dataFlowReverse 1.5s linear infinite' }}></div>
              )}
            </div>
            <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-[#6B00D7]/30 to-[#FF5AF7]/20 flex items-center justify-center shadow-lg"
              style={{ 
                boxShadow: dataPoints[3].active ? '0 0 15px rgba(255, 90, 247, 0.5)' : 'none',
                transition: 'box-shadow 0.3s ease'
              }}>
              <span className="text-white font-semibold text-xs">AR</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CyberpunkTripleChainCard;