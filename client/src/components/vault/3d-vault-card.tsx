import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Motion } from '../../components/ui/motion';

interface VaultCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  route: string;
  className?: string;
}

const VaultCard: React.FC<VaultCardProps> = ({
  id,
  title,
  description,
  icon,
  color,
  route,
  className = '',
}) => {
  const [, setLocation] = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  const handleCardClick = () => {
    setLocation(route);
  };

  return (
    <Motion.div
      className={`relative group cursor-pointer overflow-hidden rounded-xl h-full ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      whileHover={{
        scale: 1.03,
        transition: { duration: 0.2 }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Card Background with gradient */}
      <div 
        className="absolute inset-0 transition-all duration-500"
        style={{
          background: `linear-gradient(135deg, ${color}20 0%, rgba(0,0,0,0.7) 100%)`,
          borderWidth: '1px',
          borderColor: `${color}30`,
        }}
      />
      
      {/* Hover Effect - Glow */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at center, ${color}90 0%, transparent 70%)`,
        }}
      />
      
      {/* Content Container */}
      <div className="relative z-10 p-6 flex flex-col h-full">
        {/* Icon with colored background */}
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
          style={{ background: `${color}30` }}
        >
          <div className="text-2xl" style={{ color }}>{icon}</div>
        </div>
        
        <h3 
          className="text-xl font-bold mb-2 transition-colors duration-300" 
          style={{ color: isHovered ? color : 'white' }}
        >
          {title}
        </h3>
        
        <p className="text-gray-300 text-sm flex-grow">{description}</p>
        
        {/* Learn More Button */}
        <div 
          className="mt-4 inline-flex items-center text-sm font-medium transition-colors duration-300"
          style={{ color }}
        >
          Select this vault
          <svg 
            className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </div>
      
      {/* Animated border effect on hover */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ 
            border: `1px solid ${color}60`,
            boxShadow: `0 0 15px ${color}30`,
            borderRadius: 'inherit',
          }}
        />
      </div>
    </Motion.div>
  );
};

export default VaultCard;