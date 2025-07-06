import React, { useState } from 'react';
import { Shield, Check, Star, ArrowRight, Lock, Info } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface SecurityLevel {
  id: number;
  name: string;
  description: string;
  primaryAlgorithm: string;
  secondaryAlgorithm: string;
  color: string;
  icon: React.ReactNode;
  valueRange?: string;
  badge?: string;
  recommended?: boolean;
}

interface SecurityLevelSelectorProps {
  selectedLevel: number;
  onChange: (level: number) => void;
  className?: string;
}

const SecurityLevelSelector: React.FC<SecurityLevelSelectorProps> = ({
  selectedLevel,
  onChange,
  className
}) => {
  const [hoveredLevel, setHoveredLevel] = useState<number | null>(null);

  const securityLevels: SecurityLevel[] = [
    {
      id: 1,
      name: "Standard",
      description: "Basic security suitable for lower value assets",
      primaryAlgorithm: "Falcon-512",
      secondaryAlgorithm: "Kyber-512",
      color: "#D76B00",
      icon: <Shield size={18} />,
      valueRange: "< 1,000 USD"
    },
    {
      id: 2,
      name: "Enhanced",
      description: "Medium-grade security for valuable assets",
      primaryAlgorithm: "Falcon-1024",
      secondaryAlgorithm: "Kyber-768",
      color: "#00D74B",
      icon: <Shield size={18} />,
      valueRange: "1,000 - 10,000 USD"
    },
    {
      id: 3,
      name: "Maximum",
      description: "High-grade security for high-value assets",
      primaryAlgorithm: "CRYSTALS-Dilithium",
      secondaryAlgorithm: "Kyber-1024",
      color: "#00B8FF",
      icon: <Shield size={18} />,
      valueRange: "10,000 - 100,000 USD",
      recommended: true
    },
    {
      id: 4,
      name: "Fortress™",
      description: "Military-grade security for critical assets",
      primaryAlgorithm: "SPHINCS+",
      secondaryAlgorithm: "FrodoKEM-1344",
      color: "#FF5AF7",
      icon: <Star size={18} />,
      badge: "★",
      valueRange: "> 100,000 USD"
    }
  ];

  const getSelectionStatus = (levelId: number) => {
    if (selectedLevel === levelId) return 'selected';
    if (hoveredLevel === levelId) return 'hovered';
    return 'default';
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-[#6B00D7]">Sovereign Fortress™ Security Protocol Level</h3>
        <p className="text-sm text-gray-400">Select the security level appropriate for your asset value</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {securityLevels.map((level) => {
          const status = getSelectionStatus(level.id);
          const isSelected = status === 'selected';
          const isHovered = status === 'hovered';
          
          return (
            <Card
              key={level.id}
              className={cn(
                "relative cursor-pointer border transition-all overflow-hidden",
                isSelected ? "shadow-lg transform-gpu scale-[1.02]" : "shadow hover:shadow-md",
                isSelected ? "bg-gradient-to-b from-black/60 to-black/40" : "bg-black/20"
              )}
              style={{
                borderColor: isSelected ? level.color : 'transparent',
                borderWidth: isSelected ? '2px' : '1px',
                boxShadow: isSelected ? `0 0 20px ${level.color}50` : undefined,
              }}
              onClick={() => onChange(level.id)}
              onMouseEnter={() => setHoveredLevel(level.id)}
              onMouseLeave={() => setHoveredLevel(null)}
            >
              {/* Selected checkmark */}
              {isSelected && (
                <div 
                  className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center z-10"
                  style={{ backgroundColor: level.color }}
                >
                  <Check size={12} className="text-black" />
                </div>
              )}
              
              {/* Security beams - only visible when selected */}
              {isSelected && (
                <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
                  <div className="absolute inset-0 opacity-10">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div 
                        key={i}
                        className="absolute inset-0 rounded-full blur-3xl"
                        style={{
                          backgroundColor: level.color,
                          opacity: 0.1 + (i * 0.05),
                          transform: `scale(${0.6 + (i * 0.1)})`,
                          animation: `pulse ${2 + i}s infinite ease-in-out`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Badge for premium level */}
              {level.badge && (
                <div 
                  className="absolute top-0 left-0 w-7 h-7 flex items-center justify-center text-sm font-bold"
                  style={{ color: level.color }}
                >
                  {level.badge}
                </div>
              )}
              
              <div className="p-4 relative z-10">
                <div className="flex items-center mb-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                    style={{ 
                      backgroundColor: `${level.color}20`,
                      boxShadow: `0 0 10px ${level.color}40`
                    }}
                  >
                    <div style={{ color: level.color }}>
                      {level.icon}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center">
                      <h4 
                        className="font-medium"
                        style={{ color: isSelected ? level.color : 'white' }}
                      >
                        {level.id}. {level.name}
                      </h4>
                      
                      {level.recommended && (
                        <span 
                          className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full"
                          style={{ 
                            backgroundColor: `${level.color}20`,
                            color: level.color,
                            border: `1px solid ${level.color}40`
                          }}
                        >
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">{level.description}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {/* Algorithm details */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-black/30 rounded p-2 text-center">
                      <div className="text-[10px] text-gray-500 mb-1">Primary</div>
                      <div 
                        className="text-xs font-mono"
                        style={{ color: isSelected ? level.color : 'white' }}
                      >
                        {level.primaryAlgorithm}
                      </div>
                    </div>
                    
                    <div className="bg-black/30 rounded p-2 text-center">
                      <div className="text-[10px] text-gray-500 mb-1">Secondary</div>
                      <div 
                        className="text-xs font-mono"
                        style={{ color: isSelected ? level.color : 'white' }}
                      >
                        {level.secondaryAlgorithm}
                      </div>
                    </div>
                  </div>
                  
                  {/* Security level visualization */}
                  <div className="mt-3">
                    <div className="flex justify-between items-center text-[10px] text-gray-500 mb-1">
                      <span>Security Strength</span>
                      {level.valueRange && <span>{level.valueRange}</span>}
                    </div>
                    
                    <div className="flex bg-gray-900 h-2 rounded-full overflow-hidden">
                      {[1, 2, 3, 4].map((secLevel) => (
                        <div
                          key={secLevel}
                          className="h-full transition-all duration-300"
                          style={{
                            width: '25%',
                            backgroundColor: secLevel <= level.id 
                              ? (secLevel === level.id ? level.color : getColorForLevel(secLevel)) 
                              : '#333',
                            opacity: secLevel <= level.id ? 1 : 0.3,
                            boxShadow: secLevel === level.id && isSelected 
                              ? `0 0 10px ${level.color}` 
                              : 'none'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Value recommendation */}
                {level.valueRange && (
                  <div 
                    className="mt-4 pt-3 border-t border-gray-800 text-[10px] text-gray-400 flex items-center"
                  >
                    <Info size={12} className="mr-1 flex-shrink-0" style={{ color: level.color }} />
                    <span>Recommended for assets valued at {level.valueRange}</span>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
      
      <Button 
        className="mt-4 w-full sm:w-auto bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90 transition-opacity" 
        onClick={() => console.log("Security level confirmed:", selectedLevel)}
      >
        <div className="flex items-center">
          <Lock size={16} className="mr-2" />
          <span>Apply Security Protocol</span>
          <ArrowRight size={16} className="ml-2" />
        </div>
      </Button>
    </div>
  );
};

function getColorForLevel(level: number): string {
  switch (level) {
    case 1: return '#D76B00';
    case 2: return '#00D74B';
    case 3: return '#00B8FF';
    case 4: return '#FF5AF7';
    default: return '#6B00D7';
  }
}

export default SecurityLevelSelector;