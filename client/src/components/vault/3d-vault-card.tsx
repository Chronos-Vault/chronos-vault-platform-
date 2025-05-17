import React from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { SpecializedVaultType } from './vault-type-selector';

interface VaultCard3DProps {
  title: string;
  description: string;
  icon: string;
  color: string;
  features: string[];
  securityLevel: number;
  type: SpecializedVaultType;
  isSelected: boolean;
  onClick: () => void;
}

const VaultCard3D: React.FC<VaultCard3DProps> = ({
  title,
  description,
  icon,
  color,
  features,
  securityLevel,
  type,
  isSelected,
  onClick,
}) => {
  return (
    <div 
      className={`group relative h-full transform-style-3d transition-all duration-500 cursor-pointer ${isSelected ? 'animate-card-float' : 'hover-card-3d'}`}
      onClick={onClick}
    >
      <div 
        className={`h-full relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
          isSelected 
            ? `border-[${color}] shadow-lg animate-glow-pulse-3d` 
            : `border-[${color}]/30 hover:border-[${color}]/70`
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/90 z-0"></div>
        
        {/* Geometric decorative elements */}
        <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-20`} style={{ background: color }}></div>
        <div className={`absolute bottom-0 left-0 w-24 h-24 rounded-full blur-2xl opacity-10`} style={{ background: color }}></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        {/* Selection Indicator */}
        {isSelected && (
          <div className={`absolute top-3 right-3 rounded-full p-1 z-20 animate-pulse`} style={{ background: `${color}20` }}>
            <Check className="h-4 w-4" style={{ color: color }} />
          </div>
        )}
        
        <div className="relative z-10 p-5">
          <div className="flex items-center mb-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center mr-4 border" 
              style={{
                background: `linear-gradient(135deg, ${color}30, ${color}05)`,
                borderColor: `${color}30`
              }}
            >
              <span className="text-2xl">{icon}</span>
            </div>
            <h3 
              className="text-lg font-bold text-white group-hover:text-white transition-colors"
              style={{ textShadow: isSelected ? `0 0 10px ${color}80` : 'none' }}
            >
              {title}
            </h3>
          </div>
          
          <p className="text-sm text-gray-300 mb-4">
            {description}
          </p>
          
          <div className="space-y-2">
            {features.slice(0, 3).map((feature, idx) => (
              <div key={idx} className="flex items-center text-xs text-gray-400">
                <div className="w-1.5 h-1.5 rounded-full mr-2" style={{ background: color }}></div>
                {feature}
              </div>
            ))}
          </div>
          
          <div className="mt-5 flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-2 text-xs font-semibold" style={{ color }}>{securityLevel > 4 ? "Military-Grade" : securityLevel > 3 ? "Advanced" : "Standard"}</div>
              <div className="flex space-x-0.5">
                {[1, 2, 3, 4, 5].map(n => (
                  <div key={n} className={`w-2 h-2 rounded-full ${n <= securityLevel ? '' : 'opacity-30'}`} style={{ background: color }}></div>
                ))}
              </div>
            </div>
            <div className="flex items-center text-xs text-gray-400 group-hover:text-white transition-colors">
              <span>Select</span>
              <ChevronRight className="h-3 w-3 ml-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaultCard3D;