import React from 'react';

type VaultCardProps = {
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

const NewVaultCard: React.FC<VaultCardProps> = ({
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
    <div 
      className={`
        p-4 rounded-lg cursor-pointer h-full 
        ${isSelected ? 'bg-black/60 border-2' : 'bg-black/40 hover:bg-black/50 border border-gray-800 hover:border-gray-700'}
      `}
      style={{
        borderColor: isSelected ? color : undefined,
        boxShadow: isSelected ? `0 0 15px ${color}30` : undefined,
      }}
      onClick={onClick}
    >
      {/* Icon and Title Section */}
      <div className="flex flex-col items-center mb-4">
        <div 
          className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 text-xl
            ${isSelected ? 'bg-black/70 border border-white/20' : 'bg-black/60'}
          `}
          style={{
            boxShadow: isSelected ? `0 0 10px ${color}30` : undefined,
            borderColor: isSelected ? color : undefined
          }}
        >
          {icon}
        </div>
        
        <h3 className={`font-semibold text-base ${isSelected ? 'text-white' : 'text-gray-200'}`}>
          {title}
        </h3>
        
        <p className="text-xs text-gray-400 mt-1 text-center max-w-[90%]">
          {description}
        </p>
      </div>
      
      {/* Tags Section */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
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
      </div>
      
      {/* Security & Complexity */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-gray-400">Security</span>
            <span className="text-[10px]" style={{ color }}>{securityLevel}/5</span>
          </div>
          <div className="w-full h-1.5 bg-gray-900 rounded overflow-hidden">
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
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-gray-400">Complexity</span>
            <span className="text-[10px] text-amber-500">{complexityLevel}/5</span>
          </div>
          <div className="w-full h-1.5 bg-gray-900 rounded overflow-hidden">
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
      
      {/* Key Features Section */}
      <div className="mt-2">
        <h4 className="text-xs font-semibold text-gray-300 mb-2">Key Features:</h4>
        <ul className="grid grid-cols-1 gap-1.5">
          {features.slice(0, 4).map((feature, i) => (
            <li key={i} className="flex items-start">
              <span 
                className="inline-block w-2 h-2 rounded-full mt-1.5 mr-2" 
                style={{ backgroundColor: color }}
              />
              <span 
                className="text-[11px]" 
                style={{ color }}
              >
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Selected Indicator */}
      {isSelected && (
        <div className="mt-3 flex justify-center">
          <span className="text-xs bg-black/50 text-white px-3 py-1 rounded-full border border-white/10 flex items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />
            Selected
          </span>
        </div>
      )}
    </div>
  );
};

export default NewVaultCard;