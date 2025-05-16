import React from 'react';

export type VaultCardProps = {
  title: string;
  description: string;
  icon: string;
  color: string;
  isSelected: boolean;
  onClick: () => void;
  securityLevel?: number;
  complexityLevel?: number;
  features?: string[];
};

const VaultCard: React.FC<VaultCardProps> = ({ 
  title, 
  description, 
  icon, 
  color, 
  isSelected, 
  onClick,
  securityLevel = 3,
  complexityLevel = 2,
  features = []
}) => {
  return (
    <div className="h-full">
      <div 
        className={`
          p-4 rounded-lg cursor-pointer transition-all duration-200 h-full flex flex-col items-center text-center
          ${isSelected ? 'shadow-lg' : 'shadow'} 
          ${isSelected 
            ? 'bg-black/60 border-2' 
            : 'bg-black/40 hover:bg-black/50 border border-gray-800 hover:border-gray-700'
          }
        `}
        style={{
          borderColor: isSelected ? color : undefined,
          boxShadow: isSelected ? `0 0 15px ${color}30` : undefined,
        }}
        onClick={onClick}
      >
        {/* Top section - icon and title */}
        <div 
          className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 text-xl
            ${isSelected 
              ? 'bg-black/70 border border-white/20' 
              : 'bg-black/60'
            }
          `}
          style={{
            boxShadow: isSelected ? `0 0 10px ${color}30` : undefined,
            borderColor: isSelected ? color : undefined
          }}
        >
          {icon}
        </div>
        
        <h3 className={`font-semibold text-base mb-1 ${isSelected ? 'text-white' : 'text-gray-200'}`}>
          {title}
        </h3>
        
        <p className="text-xs text-gray-400 mb-3 max-w-[90%] mx-auto">{description}</p>
        
        {/* Key Technologies */}
        <div className="flex flex-wrap justify-center gap-2 mb-4 w-full">
          <span 
            className="text-[10px] px-2 py-0.5 rounded-full bg-[#6B00D7]/10 border border-[#6B00D7]/30"
            style={{ color: '#8B00D7' }}
          >
            Triple-Chain
          </span>
          <span 
            className="text-[10px] px-2 py-0.5 rounded-full bg-[#FF5AF7]/10 border border-[#FF5AF7]/30"
            style={{ color: '#FF5AF7' }}
          >
            Zero-Knowledge
          </span>
          {securityLevel >= 4 && (
            <span 
              className="text-[10px] px-2 py-0.5 rounded-full bg-[#00D7C3]/10 border border-[#00D7C3]/30"
              style={{ color: '#00D7C3' }}
            >
              Advanced Security
            </span>
          )}
          {securityLevel >= 5 && (
            <span 
              className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30"
              style={{ color: '#FFD700' }}
            >
              Quantum-Resistant
            </span>
          )}
        </div>
        
        {/* Security & Complexity Levels */}
        <div className="grid grid-cols-2 gap-4 mb-4 w-full">
          <div className="flex flex-col items-center">
            <div className="flex justify-center items-center mb-1">
              <span className="text-[10px] text-gray-400 mr-1">Security</span>
              <span className="text-[10px]" style={{ color }}>{securityLevel}/5</span>
            </div>
            <div className="w-full h-2 bg-gray-900 rounded overflow-hidden">
              <div
                className="h-full"
                style={{
                  width: `${(securityLevel / 5) * 100}%`,
                  backgroundColor: color,
                  opacity: 0.7
                }}
              />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex justify-center items-center mb-1">
              <span className="text-[10px] text-gray-400 mr-1">Complexity</span>
              <span className="text-[10px] text-amber-500">{complexityLevel}/5</span>
            </div>
            <div className="w-full h-2 bg-gray-900 rounded overflow-hidden">
              <div
                className="h-full bg-amber-500"
                style={{
                  width: `${(complexityLevel / 5) * 100}%`,
                  opacity: 0.7
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Key Features with Center Alignment */}
        <div className="mt-auto w-full">
          <h4 className="text-xs font-semibold text-gray-300 mb-3 text-center">Key Features:</h4>
          <div className="w-full flex flex-col">
            {features.slice(0, 4).map((feature, i) => (
              <div key={i} className="mb-2.5 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: color }}></div>
                <div className="text-[11px] text-center" style={{ color }}>
                  {feature}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Selected indicator */}
        {isSelected && (
          <div className="mt-3 flex justify-center">
            <span className="text-xs bg-black/50 text-white px-3 py-1 rounded-full border border-white/10 flex items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />
              Selected
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VaultCard;