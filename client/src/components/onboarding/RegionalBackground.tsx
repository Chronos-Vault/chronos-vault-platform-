import { motion } from 'framer-motion';

type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export const RegionalBackground = ({ 
  region, 
  timeOfDay 
}: { 
  region: string | null;
  timeOfDay: TimeOfDay;
}) => {
  // Background colors based on time of day
  const timeColors = {
    morning: {
      from: '#FCEFD6',
      to: '#E9F7FF',
      accent: '#FFB347'
    },
    afternoon: {
      from: '#A7D9FE',
      to: '#C9EEFF',
      accent: '#4D8FE1'
    },
    evening: {
      from: '#5B4E8C',
      to: '#FF9190',
      accent: '#FF5AF7'
    },
    night: {
      from: '#0E1125',
      to: '#2C2D3C',
      accent: '#6B00D7'
    }
  };

  // Get colors based on time of day
  const colors = timeColors[timeOfDay];
  
  // Visual elements that represent different regions
  const getRegionalElements = () => {
    if (!region) return null;
    
    const elements: Record<string, JSX.Element> = {
      'United States': (
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute bottom-0 left-10 w-28 h-48 bg-accent rounded-t-lg"></div>
          <div className="absolute bottom-0 left-40 w-32 h-64 bg-accent rounded-t-lg"></div>
          <div className="absolute bottom-0 left-80 w-40 h-72 bg-accent rounded-t-lg"></div>
          <div className="absolute bottom-0 right-20 w-36 h-56 bg-accent rounded-t-lg"></div>
        </div>
      ),
      'United Kingdom': (
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute bottom-0 left-1/4 w-24 h-40 bg-accent rounded-t-lg"></div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-28 h-64 bg-accent rounded-t-lg"></div>
          <div className="absolute bottom-0 right-1/4 w-20 h-36 bg-accent rounded-t-lg"></div>
          <div className="absolute top-10 left-20 w-16 h-16 rounded-full bg-accent/50 blur-xl"></div>
        </div>
      ),
      'Japan': (
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute top-10 right-10 w-24 h-24 rounded-full bg-red-500/70"></div>
          <div className="absolute bottom-0 left-10 w-20 h-60 bg-accent rounded-t-lg"></div>
          <div className="absolute bottom-0 left-40 w-16 h-48 bg-accent rounded-t-lg"></div>
          <div className="absolute bottom-0 right-40 w-24 h-72 bg-accent rounded-t-lg"></div>
          <div className="absolute bottom-0 right-10 w-20 h-56 bg-accent rounded-t-lg"></div>
        </div>
      ),
      'China': (
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-yellow-500/70"></div>
          <div className="absolute top-16 left-16 w-4 h-4 rounded-full bg-yellow-600/90"></div>
          <div className="absolute bottom-0 left-1/4 w-36 h-80 bg-accent rounded-t-lg"></div>
          <div className="absolute bottom-0 right-1/4 w-40 h-64 bg-accent rounded-t-lg"></div>
        </div>
      ),
      'Australia': (
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute bottom-0 left-20 w-48 h-32 bg-accent rounded-t-lg"></div>
          <div className="absolute bottom-0 right-40 w-52 h-28 bg-accent rounded-t-lg"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-yellow-400 rounded-full"></div>
        </div>
      ),
      'Russia': (
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white via-blue-500 to-red-500 opacity-40"></div>
          <div className="absolute bottom-0 left-10 w-32 h-48 bg-accent rounded-t-lg"></div>
          <div className="absolute bottom-0 left-1/2 w-48 h-36 bg-accent rounded-t-lg"></div>
          <div className="absolute bottom-0 right-10 w-24 h-64 bg-accent rounded-t-lg"></div>
        </div>
      ),
      'India': (
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-blue-500/60"></div>
          <div className="absolute bottom-0 left-10 w-40 h-48 bg-accent rounded-t-lg"></div>
          <div className="absolute bottom-0 right-10 w-36 h-56 bg-accent rounded-t-lg"></div>
        </div>
      ),
      'Brazil': (
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-32 h-32 rounded-full bg-yellow-400/60"></div>
          <div className="absolute bottom-0 left-20 w-48 h-40 bg-accent rounded-t-lg"></div>
          <div className="absolute bottom-0 right-40 w-32 h-64 bg-accent rounded-t-lg"></div>
        </div>
      )
    };
    
    // Return specific regional element or default to United States
    return elements[region] || elements['United States'];
  };

  // Function to generate floating particles based on time of day
  const getTimeParticles = () => {
    const particleCount = timeOfDay === 'night' ? 30 : 15;
    
    return Array.from({ length: particleCount }).map((_, i) => {
      const size = Math.random() * 4 + 2;
      const initialX = Math.random() * 100;
      const initialY = Math.random() * 100;
      const duration = Math.random() * 8 + 12;
      const delay = Math.random() * 5;
      
      return (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: colors.accent,
            opacity: 0.4,
            left: `${initialX}%`,
            top: `${initialY}%`
          }}
          animate={{
            y: [0, -20, 0, 20, 0],
            x: [0, 10, 0, -10, 0],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration,
            delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      );
    });
  };

  return (
    <div 
      className="absolute inset-0 overflow-hidden"
      style={{
        background: `linear-gradient(to bottom right, ${colors.from}, ${colors.to})`,
      }}
    >
      {/* Time-based particles */}
      {getTimeParticles()}
      
      {/* Region-specific elements */}
      {getRegionalElements()}
      
      {/* Time of day overlay */}
      <div 
        className={`absolute inset-0 ${
          timeOfDay === 'night' ? 'backdrop-brightness-50' : 
          timeOfDay === 'evening' ? 'backdrop-brightness-75' : ''
        }`}
      />
    </div>
  );
};