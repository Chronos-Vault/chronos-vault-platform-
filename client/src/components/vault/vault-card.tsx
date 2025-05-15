import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { calculateProgress, formatDate, formatTimeLeft } from "@/utils/date-utils";
import { Progress } from "@/components/ui/progress";
import { Vault } from "@shared/schema";
import { Lock, Unlock, Shield, Clock, ArrowRight, Layers, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

interface VaultCardProps {
  vault: Vault;
  variant?: "legacy" | "investment" | "project" | "sovereign" | "quantum" | "cross-chain" | "multi-sig";
  showDetails?: boolean;
}

const VaultCard = ({ vault, variant = "legacy", showDetails = true }: VaultCardProps) => {
  const progress = calculateProgress(vault.createdAt, vault.unlockDate);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  
  // Parse metadata if it exists
  const metadata = vault.metadata ? JSON.parse(vault.metadata) : {};
  const securityLevel = vault.securityLevel || metadata.securityLevel || 3;
  const specializedType = metadata.specializedType || variant;
  const crossChainEnabled = vault.crossChainEnabled || metadata.crossChainEnabled || false;
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHovered) return;
    
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    setRotate({ x: rotateX, y: rotateY });
    setMousePosition({ x, y });
  };
  
  const resetRotation = () => {
    setRotate({ x: 0, y: 0 });
    setIsHovered(false);
  };
  
  const getBgClass = () => {
    switch (variant) {
      case "sovereign":
        return "bg-gradient-to-br from-[#6B00D7]/40 to-[#FF5AF7]/20";
      case "quantum":
        return "bg-gradient-to-br from-[#00B8FF]/30 to-[#00B8FF]/10";
      case "cross-chain":
        return "bg-gradient-to-br from-[#8B00D7]/30 to-[#6B00D7]/10";
      case "multi-sig":
        return "bg-gradient-to-br from-[#FF5AF7]/30 to-[#FF5AF7]/10";
      case "legacy":
        return "bg-gradient-to-br from-[#6B00D7]/20 to-[#6B00D7]/5";
      case "investment":
        return "bg-gradient-to-br from-[#FF5AF7]/20 to-[#FF5AF7]/5";
      case "project":
        return "bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/20";
      default:
        return "bg-gradient-to-br from-[#6B00D7]/20 to-[#6B00D7]/5";
    }
  };
  
  const getIconClass = () => {
    switch (variant) {
      case "sovereign":
        return "ri-shield-keyhole-line text-white text-3xl";
      case "quantum":
        return "ri-lock-password-line text-white text-3xl";
      case "cross-chain":
        return "ri-link-m text-white text-3xl";
      case "multi-sig":
        return "ri-group-line text-white text-3xl";
      case "legacy":
        return "ri-user-heart-line text-white text-3xl";
      case "investment":
        return "ri-line-chart-line text-white text-3xl";
      case "project":
        return "ri-team-line text-white text-3xl";
      default:
        return "ri-user-heart-line text-white text-3xl";
    }
  };
  
  const getSecurityColor = (level: number) => {
    switch (level) {
      case 5: return "#FF5AF7";
      case 4: return "#8B00D7";
      case 3: return "#00B8FF";
      case 2: return "#00D74B";
      case 1: return "#D76B00";
      default: return "#6B00D7";
    }
  };
  
  // 3D lighting effect that follows the mouse
  const getGlowStyles = () => {
    if (!isHovered) return {};
    
    const x = mousePosition.x;
    const y = mousePosition.y;
    const centerX = x;
    const centerY = y;
    
    return {
      background: `radial-gradient(circle at ${centerX}px ${centerY}px, ${getSecurityColor(securityLevel)}20 0%, transparent 50%)`,
    };
  };

  return (
    <div 
      className="perspective-1000 transform-gpu"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={resetRotation}
    >
      <Card 
        className="vault-card bg-[#1A1A1A] border border-[#333333] rounded-xl overflow-hidden hover:border-[#6B00D7]/50 transition-all duration-300 transform-gpu shadow-xl"
        style={{ 
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
        }}
      >
        {/* Lighting overlay */}
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100 z-10"
          style={getGlowStyles()}
        />
        
        <div className={`h-36 sm:h-48 ${getBgClass()} relative overflow-hidden`}>
          {/* Animated security level beam */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              {Array.from({ length: securityLevel }).map((_, i) => (
                <div 
                  key={i}
                  className="absolute inset-0 rounded-full blur-3xl"
                  style={{
                    backgroundColor: getSecurityColor(securityLevel),
                    opacity: 0.05 + (i * 0.03),
                    transform: `scale(${0.5 + (i * 0.1)})`,
                    animation: `pulse ${3 + i}s infinite ease-in-out`,
                  }}
                />
              ))}
            </div>
          </div>
          
          {/* Holographic security pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-black/50 to-black/30 backdrop-blur-sm flex items-center justify-center border border-white/10 shadow-lg">
              <i className={getIconClass()}></i>
            </div>
          </div>
          
          {/* Security level indicator */}
          <div className="absolute top-3 right-3 flex items-center bg-black/30 backdrop-blur-sm rounded-full px-2 py-1 border border-white/10">
            <Shield size={12} className="mr-1" style={{ color: getSecurityColor(securityLevel) }} />
            <span className="text-xs font-medium text-white">Level {securityLevel}</span>
          </div>
          
          {/* Type badge */}
          <div className="absolute top-3 left-3 bg-black/30 backdrop-blur-sm rounded-full px-2 py-1 border border-white/10">
            <span className="text-xs font-medium text-white">{specializedType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1A1A1A] to-transparent h-20"></div>
        </div>
        
        <CardContent className="p-4 sm:p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-lg sm:text-xl text-white">{vault.name}</h3>
            <Badge 
              variant="outline" 
              className={`${vault.isLocked ? 'border-[#FF5AF7] text-[#FF5AF7]' : 'border-[#00D74B] text-[#00D74B]'} flex items-center`}
            >
              {vault.isLocked ? (
                <><Lock size={12} className="mr-1" /> Locked</>
              ) : (
                <><Unlock size={12} className="mr-1" /> Unlocked</>
              )}
            </Badge>
          </div>
          
          <p className="text-gray-400 mb-4 text-xs sm:text-sm line-clamp-2">{vault.description || `Advanced ${specializedType} technology with multi-chain security.`}</p>
          
          {/* Enhanced vault stats */}
          <div className="space-y-3 mb-6">
            {/* Enhanced progress indicator */}
            <div className="relative mb-5">
              <div className="mb-1 flex justify-between items-center">
                <div className="flex items-center">
                  <Clock size={14} className="text-gray-400 mr-1" />
                  <span className="text-xs text-gray-400">Time Remaining</span>
                </div>
                <span className="text-xs font-medium text-white">{formatTimeLeft(vault.unlockDate)}</span>
              </div>
              
              <div className="relative">
                <Progress 
                  value={progress} 
                  className="h-2 rounded-full bg-[#333333]" 
                />
                
                {/* Pulsing indicator for active progress */}
                <div 
                  className="absolute top-0 left-0 h-2 rounded-full transform animate-pulse"
                  style={{ 
                    width: `${progress}%`, 
                    background: `linear-gradient(90deg, transparent, ${getSecurityColor(securityLevel)}50, transparent)`,
                    animation: "progressPulse 2s ease-in-out infinite"
                  }}
                />
              </div>
              
              <div className="flex justify-between mt-1 text-[10px] text-gray-500">
                <span>Created: {formatDate(vault.createdAt)}</span>
                <span>Unlocks: {formatDate(vault.unlockDate)}</span>
              </div>
            </div>
            
            {showDetails && (
              <>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="bg-black/20 p-2 sm:p-3 rounded-lg border border-gray-800">
                    <div className="flex items-center mb-1">
                      <Layers size={12} className="text-gray-400 mr-1" />
                      <span className="text-xs text-gray-400">Asset</span>
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-white">
                      {vault.assetType} {vault.assetAmount}
                    </div>
                  </div>
                  
                  <div className="bg-black/20 p-2 sm:p-3 rounded-lg border border-gray-800">
                    <div className="flex items-center mb-1">
                      <Shield size={12} className="text-gray-400 mr-1" />
                      <span className="text-xs text-gray-400">Security</span>
                    </div>
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div 
                          key={i}
                          className={`w-1.5 h-3 rounded-sm mx-0.5 ${i < securityLevel ? '' : 'opacity-30'}`}
                          style={{ backgroundColor: i < securityLevel ? getSecurityColor(securityLevel) : '#333333' }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Feature tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {crossChainEnabled && (
                    <span className="bg-[#6B00D7]/10 text-[#6B00D7] text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full border border-[#6B00D7]/30">
                      Cross-Chain
                    </span>
                  )}
                  {securityLevel >= 4 && (
                    <span className="bg-[#FF5AF7]/10 text-[#FF5AF7] text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full border border-[#FF5AF7]/30">
                      Quantum-Resistant
                    </span>
                  )}
                  <span className="bg-[#00B8FF]/10 text-[#00B8FF] text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full border border-[#00B8FF]/30">
                    Triple-Chain Security
                  </span>
                </div>
              </>
            )}
          </div>
          
          <Link href={`/vault/${vault.id}`}>
            <Button 
              className="w-full py-2 sm:py-3 rounded-lg bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white font-medium hover:shadow-lg hover:shadow-[#6B00D7]/20 transition-all flex items-center justify-center"
              variant="default"
            >
              <span>View Vault</span>
              <ArrowRight size={16} className="ml-1.5" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default VaultCard;
