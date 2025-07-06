import React from 'react';

interface GlowingBackgroundProps {
  color?: string;
  intensity?: 'low' | 'medium' | 'high';
  animate?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const GlowingBackground: React.FC<GlowingBackgroundProps> = ({
  color = '#6B00D7',
  intensity = 'medium',
  animate = true,
  children,
  className = '',
}) => {
  // Map intensity to opacity values
  const getIntensityValue = () => {
    switch (intensity) {
      case 'low': return '0.08';
      case 'high': return '0.25';
      default: return '0.15';
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Background with subtle grid pattern */}
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      {/* Glowing orbs */}
      <div
        className={`absolute top-0 left-1/4 w-64 h-64 rounded-full blur-3xl ${animate ? 'animate-float-slow' : ''}`}
        style={{ background: `${color}`, opacity: getIntensityValue() }}
      ></div>
      
      <div
        className={`absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full blur-3xl ${animate ? 'animate-float-slow animation-delay-2000' : ''}`}
        style={{ background: `${color}`, opacity: getIntensityValue() }}
      ></div>
      
      {/* Animated scan line - only if animate is true */}
      {animate && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 animate-scan-vertical">
            <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent 0%, ${color}40 50%, transparent 100%)` }}></div>
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default GlowingBackground;