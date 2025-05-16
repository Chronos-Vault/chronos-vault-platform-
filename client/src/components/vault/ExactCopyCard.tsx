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

const ExactCopyCard: React.FC<VaultCardProps> = ({
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
      className={`p-5 rounded-lg cursor-pointer border text-center ${
        isSelected 
          ? 'bg-black/40 border-[' + color + ']' 
          : 'bg-black/20 border-gray-800 hover:border-gray-700'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center mb-3 justify-center">
        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center mr-3 text-2xl">
          {icon}
        </div>
        <div>
          <h3 className="font-medium text-white">{title}</h3>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-1.5 mb-3 justify-center">
        <span className="text-xs px-2 py-0.5 rounded-full bg-[#6B00D7]/20 text-[#9E00FF] border border-[#6B00D7]/30">
          Triple-Chain
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-[#FF5AF7]/20 text-[#FF5AF7] border border-[#FF5AF7]/30">
          Zero-Knowledge
        </span>
        {securityLevel >= 4 && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#00D7C3]/20 text-[#00D7C3] border border-[#00D7C3]/30">
            Advanced Security
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-3 text-center">
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-400">Security</span>
            <span className="text-xs" style={{ color }}>{securityLevel}/5</span>
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
            <span className="text-xs text-gray-400">Complexity</span>
            <span className="text-xs text-amber-500">{complexityLevel}/5</span>
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
      
      <div className="text-center mb-3">
        <h4 className="text-xs font-semibold text-gray-300 mb-2 text-center">Key Features:</h4>
        <div className="flex flex-col items-center">
          {features.slice(0, 4).map((feature, i) => (
            <div key={i} className="mb-2 flex items-center justify-center">
              <span 
                className="inline-block w-2 h-2 rounded-full mr-2" 
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-gray-300">{feature}</span>
            </div>
          ))}
        </div>
      </div>
      
      {isSelected && (
        <div className="mt-3 text-xs text-center">
          <span className="inline-flex items-center text-green-400">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
              <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18457 2.99721 7.13633 4.39828 5.49707C5.79935 3.85782 7.69279 2.71538 9.79619 2.24015C11.8996 1.76491 14.1003 1.98234 16.07 2.86" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Selected
          </span>
        </div>
      )}
    </div>
  );
};

export default ExactCopyCard;