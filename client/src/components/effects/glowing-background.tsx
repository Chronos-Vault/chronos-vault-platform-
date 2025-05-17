import React from 'react';

interface GlowingBackgroundProps {
  children: React.ReactNode;
  className?: string;
  primaryColor?: string;
  secondaryColor?: string;
  intensity?: 'low' | 'medium' | 'high';
  animate?: boolean;
  pattern?: 'dots' | 'grid' | 'none';
}

const GlowingBackground: React.FC<GlowingBackgroundProps> = ({
  children,
  className = '',
  primaryColor = '#6B00D7',
  secondaryColor = '#FF5AF7',
  intensity = 'medium',
  animate = true,
  pattern = 'grid'
}) => {
  // Calculate opacity based on intensity
  const getOpacity = (base: number) => {
    switch (intensity) {
      case 'low': return base * 0.5;
      case 'high': return base * 1.5;
      default: return base;
    }
  };

  // Generate pattern class
  const getPatternClass = () => {
    switch (pattern) {
      case 'dots': return 'bg-dots-pattern';
      case 'grid': return 'bg-grid-pattern';
      default: return '';
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      {/* Animated background gradients */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary glow */}
        <div 
          className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3 ${animate ? 'animate-pulse-slow' : ''}`}
          style={{ 
            background: primaryColor,
            opacity: getOpacity(0.15)
          }}
        />
        
        {/* Secondary glow */}
        <div 
          className={`absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3 ${animate ? 'animate-pulse-slow animation-delay-1000' : ''}`}
          style={{ 
            background: secondaryColor,
            opacity: getOpacity(0.15)
          }}
        />

        {/* Central accent */}
        <div 
          className={`absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 ${animate ? 'animate-pulse-slow animation-delay-2000' : ''}`}
          style={{ 
            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
            opacity: getOpacity(0.1)
          }}
        />
        
        {/* Pattern overlay */}
        {pattern !== 'none' && (
          <div className={`absolute inset-0 ${getPatternClass()} opacity-10`}></div>
        )}
      </div>

      {/* Actual content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GlowingBackground;