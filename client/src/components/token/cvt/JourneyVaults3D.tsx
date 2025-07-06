import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LockIcon,
  UnlockIcon,
  CalendarIcon,
  CheckCircleIcon,
  ShieldIcon,
  LayersIcon,
  ArrowRightIcon,
  BarChart3Icon,
  InfoIcon,
  ExternalLinkIcon,
  Sparkles
} from "lucide-react";
import VaultVisualization from './VaultVisualization';

// Define the TokenReleasePhase interface which represents a single CVT release phase
export interface TokenReleasePhase {
  id: number;
  year: number;
  releaseDate: string; // ISO date
  percentage: number;
  tokens: number;
  releaseDescription: string;
  status: 'released' | 'upcoming' | 'inProgress';
  vaultTheme: string;
  vaultImageUrl?: string;
}

// Interface for the component props
interface JourneyVaultProps {
  vaults: TokenReleasePhase[];
  totalSupply: number;
}

// Format large numbers with commas
function formatNumber(num: number) {
  return new Intl.NumberFormat().format(Math.round(num));
}

// Calculate time until a target date with more precision
function calculateTimeUntil(targetDate: string) {
  const now = new Date();
  const target = new Date(targetDate);
  const diffMs = target.getTime() - now.getTime();
  
  // If the target date is in the past, return all zeros
  if (diffMs <= 0) {
    return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  
  // Calculate years, months, days, hours, minutes, and seconds
  const diffSecs = Math.floor(diffMs / 1000);
  const years = Math.floor(diffSecs / (365 * 24 * 60 * 60));
  const remainingSecs = diffSecs % (365 * 24 * 60 * 60);
  
  const months = Math.floor(remainingSecs / (30 * 24 * 60 * 60));
  const afterMonthsSecs = remainingSecs % (30 * 24 * 60 * 60);
  
  const days = Math.floor(afterMonthsSecs / (24 * 60 * 60));
  const afterDaysSecs = afterMonthsSecs % (24 * 60 * 60);
  
  const hours = Math.floor(afterDaysSecs / (60 * 60));
  const afterHoursSecs = afterDaysSecs % (60 * 60);
  
  const minutes = Math.floor(afterHoursSecs / 60);
  const seconds = afterHoursSecs % 60;
  
  return { years, months, days, hours, minutes, seconds };
}

// Mini timer component specifically for vault cards
const VaultCardTimer: React.FC<{
  targetDate: string;
  themeColor: string;
  shadowColor: string;
  isReleased: boolean;
}> = ({ targetDate, themeColor, shadowColor, isReleased }) => {
  const now = new Date();
  const target = new Date(targetDate);
  const diffMs = target.getTime() - now.getTime();
  
  // If already released or past date
  if (isReleased || diffMs <= 0) {
    return (
      <div 
        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-center py-2 rounded-lg transform-style-3d"
        style={{ 
          transform: 'translateZ(8px)',
          boxShadow: '0 8px 12px -4px rgba(5, 150, 105, 0.4)'
        }}
      >
        <div className="font-bold flex items-center justify-center">
          <CheckCircleIcon className="w-4 h-4 mr-1.5" />
          <span>Released</span>
        </div>
      </div>
    );
  }
  
  // Calculate time remaining
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
  
  // State for the timer
  const [timeLeft, setTimeLeft] = useState({ days, hours, minutes, seconds });
  const [animateSeconds, setAnimateSeconds] = useState(false);
  
  // Update timer every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const target = new Date(targetDate);
      const diff = target.getTime() - now.getTime();
      
      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      // Animate seconds change
      setAnimateSeconds(true);
      setTimeout(() => setAnimateSeconds(false), 300);
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [targetDate]);
  
  return (
    <div 
      className="bg-gradient-to-r text-white p-2 rounded-lg transform-style-3d"
      style={{ 
        background: `linear-gradient(to right, ${themeColor}CC, ${themeColor})`,
        transform: 'translateZ(8px)',
        boxShadow: `0 8px 15px -4px ${shadowColor}`
      }}
    >
      <div className="text-xs font-bold mb-1 text-center">Opening In</div>
      <div className="grid grid-cols-4 gap-1 transform-style-3d">
        <div className="transform-style-3d">
          <div 
            className="bg-white/10 backdrop-blur-[1px] rounded p-1 text-center shadow-inner transform"
            style={{ transform: 'translateZ(4px)' }}
          >
            <div className="text-sm font-bold">{timeLeft.days}</div>
            <div className="text-[9px] uppercase">days</div>
          </div>
        </div>
        <div className="transform-style-3d">
          <div 
            className="bg-white/10 backdrop-blur-[1px] rounded p-1 text-center shadow-inner transform"
            style={{ transform: 'translateZ(4px)' }}
          >
            <div className="text-sm font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
            <div className="text-[9px] uppercase">hrs</div>
          </div>
        </div>
        <div className="transform-style-3d">
          <div 
            className="bg-white/10 backdrop-blur-[1px] rounded p-1 text-center shadow-inner transform"
            style={{ transform: 'translateZ(4px)' }}
          >
            <div className="text-sm font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
            <div className="text-[9px] uppercase">min</div>
          </div>
        </div>
        <div className="transform-style-3d" style={{ perspective: '800px' }}>
          <div 
            className={`bg-white/10 backdrop-blur-[1px] rounded p-1 text-center shadow-inner transform transition-transform duration-300 ${animateSeconds ? 'scale-110' : 'scale-100'}`}
            style={{ 
              transform: 'translateZ(4px)',
              animation: animateSeconds ? 'timer-pulse 0.3s ease-out' : 'none' 
            }}
          >
            <div className="text-sm font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
            <div className="text-[9px] uppercase">sec</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced 3D Vault/Vault component with timer
const Vault3DCard: React.FC<{
  vault: TokenReleasePhase;
  onClick: () => void;
  getVaultThemeGradient: (theme: string) => string;
  getVaultThemeGradientBackground: (theme: string) => string;
}> = ({ vault, onClick, getVaultThemeGradient, getVaultThemeGradientBackground }) => {
  // Generate a random angle for the floating animation
  const randomAngle = Math.random() * 2 - 1; // Between -1 and 1
  
  // Get theme color for timer
  const getThemeColor = () => {
    switch(vault.vaultTheme) {
      case 'genesis': return '#8B5CF6';
      case 'quantum': return '#3B82F6';
      case 'cosmic': return '#6366F1';
      case 'nebula': return '#8B5CF6';
      case 'aurora': return '#D946EF';
      case 'infinity': return '#EC4899';
      default: return '#8B5CF6';
    }
  };
  
  // Get shadow color for timer
  const getShadowColor = () => {
    switch(vault.vaultTheme) {
      case 'genesis': return 'rgba(139, 92, 246, 0.4)';
      case 'quantum': return 'rgba(59, 130, 246, 0.4)';
      case 'cosmic': return 'rgba(99, 102, 241, 0.4)';
      case 'nebula': return 'rgba(139, 92, 246, 0.4)';
      case 'aurora': return 'rgba(217, 70, 239, 0.4)';
      case 'infinity': return 'rgba(236, 72, 153, 0.4)';
      default: return 'rgba(139, 92, 246, 0.4)';
    }
  };
  
  return (
    <div 
      className="group perspective cursor-pointer mb-16"
      onClick={onClick}
      style={{ perspective: '2000px' }}
    >
      <div 
        className="relative preserve-3d group-hover:rotate-y-[25deg] group-hover:rotate-x-[5deg] duration-700 transition-all animate-float"
        style={{ 
          transformStyle: 'preserve-3d',
          animation: `float 6s ease-in-out ${Math.random() * 2}s infinite alternate`,
          transformOrigin: 'center center'
        }}
      >
        {/* Outer glow effect */}
        <div 
          className="absolute -inset-2 bg-gradient-to-r opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-700 rounded-xl -z-10"
          style={{
            background: vault.status === 'released' 
              ? 'radial-gradient(circle, rgba(34, 197, 94, 0.4) 0%, transparent 70%)'
              : `radial-gradient(circle, ${getVaultThemeGradient(vault.vaultTheme).split(' ')[1].replace('to-', 'rgba(')}0.4) 0%, transparent 70%)`,
          }}
        ></div>
      
        {/* Main 3D vault container */}
        <div className="transform-style-3d backface-hidden">
          {/* Front face of the 3D card */}
          <div 
            className="backface-hidden w-full rounded-xl overflow-hidden shadow-2xl group-hover:shadow-[0_35px_60px_-15px_rgba(139,92,246,0.3)] transition-all duration-700 transform-style-3d"
            style={{
              background: vault.status === 'released' 
                ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(0, 0, 0, 0.05))'
                : `linear-gradient(135deg, ${getVaultThemeGradientBackground(vault.vaultTheme)})`,
              borderTop: `3px solid ${vault.status === 'released' ? '#22c55e' : '#8b5cf6'}`,
              boxShadow: vault.status === 'released'
                ? '0 20px 25px -5px rgba(34, 197, 94, 0.15), 0 10px 10px -5px rgba(34, 197, 94, 0.1)'
                : '0 20px 25px -5px rgba(139, 92, 246, 0.15), 0 10px 10px -5px rgba(139, 92, 246, 0.1)',
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
              transform: 'translateZ(10px)',
              minHeight: '400px'
            }}
          >
            {/* Card shine effects - moves with mouse */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700" 
              style={{
                background: `linear-gradient(105deg, transparent 20%, ${vault.status === 'released' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(139, 92, 246, 0.2)'} 40%, ${vault.status === 'released' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(139, 92, 246, 0.2)'} 60%, transparent 80%)`,
                backgroundSize: '200% 100%',
                animation: 'shine 3s infinite linear',
              }}
            ></div>
            
            {/* Card top glow effects */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700 glow-effect" 
              style={{
                background: `radial-gradient(circle at 50% 0%, ${vault.status === 'released' ? 'rgba(34, 197, 94, 0.8)' : 'rgba(139, 92, 246, 0.8)'}, transparent 60%)`,
              }}
            ></div>
            
            {/* Card inner content */}
            <div className="p-6 relative transform-style-3d">
              {/* Header with vault name and status */}
              <div className="flex justify-between items-start mb-3 relative">
                <h3 
                  className={`text-2xl font-bold bg-gradient-to-br ${getVaultThemeGradient(vault.vaultTheme)} bg-clip-text text-transparent`}
                  style={{ 
                    textShadow: vault.status === 'released' 
                      ? '0 2px 10px rgba(34, 197, 94, 0.2)' 
                      : '0 2px 10px rgba(139, 92, 246, 0.2)',
                    transform: 'translateZ(5px)',
                  }}
                >
                  {vault.vaultTheme === 'genesis' ? 'Genesis Vault' : `${vault.year} Vault`}
                </h3>
                <Badge 
                  variant={vault.status === 'released' ? 'default' : 'secondary'} 
                  className={`${vault.status === 'released' ? 'bg-green-500' : ''} px-3 py-1 text-white shadow-lg`}
                  style={{ 
                    transform: 'translateZ(15px)',
                    boxShadow: vault.status === 'released' 
                      ? '0 4px 12px rgba(34, 197, 94, 0.3)' 
                      : '0 4px 12px rgba(139, 92, 246, 0.3)'
                  }}
                >
                  {vault.status === 'released' ? 'Released' : 'Locked'}
                </Badge>
              </div>
              
              {/* Vault description */}
              <p 
                className="text-sm text-muted-foreground mb-4 relative"
                style={{ transform: 'translateZ(2px)' }}
              >
                {vault.releaseDescription}
              </p>
              
              {/* Release date display */}
              <div 
                className="flex items-center text-sm font-medium text-muted-foreground mb-4 relative"
                style={{ transform: 'translateZ(8px)' }}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 mr-3 shadow-inner group-hover:shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)] transition-all">
                  <CalendarIcon className="h-4 w-4 text-purple-500" />
                </div>
                <span className="font-medium">{new Date(vault.releaseDate).toLocaleDateString(undefined, { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              
              {/* 3D Timer Component */}
              <div className="mb-4 transform-style-3d">
                <VaultCardTimer 
                  targetDate={vault.releaseDate}
                  themeColor={getThemeColor()}
                  shadowColor={getShadowColor()}
                  isReleased={vault.status === 'released'}
                />
              </div>
              
              {/* Token metrics section */}
              <div className="pt-4 border-t border-slate-200/30 dark:border-slate-700/30 relative transform-style-3d" style={{ transform: 'translateZ(5px)' }}>
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Token Amount</div>
                    <div 
                      className="font-bold text-lg"
                      style={{ 
                        background: `linear-gradient(to right, #fff, ${vault.status === 'released' ? '#22c55e' : '#8b5cf6'})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: vault.status === 'released' 
                          ? '0 2px 4px rgba(34, 197, 94, 0.2)' 
                          : '0 2px 4px rgba(139, 92, 246, 0.2)',
                      }}
                    >
                      {formatNumber(vault.tokens)} CVT
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground mb-1">Supply Percentage</div>
                    <div 
                      className="font-bold text-lg"
                      style={{ 
                        background: `linear-gradient(to right, #fff, ${vault.status === 'released' ? '#22c55e' : '#8b5cf6'})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: vault.status === 'released' 
                          ? '0 2px 4px rgba(34, 197, 94, 0.2)' 
                          : '0 2px 4px rgba(139, 92, 246, 0.2)',
                      }}
                    >
                      {vault.percentage}%
                    </div>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div 
                  className="relative h-2 mt-2 mb-5 w-full bg-slate-100/30 dark:bg-slate-800/30 rounded-full overflow-hidden shadow-inner"
                  style={{ boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)' }}
                >
                  <div 
                    className={`absolute top-0 left-0 h-full rounded-full transition-all group-hover:scale-x-105 origin-left ${
                      vault.status === 'released' 
                        ? 'bg-gradient-to-r from-green-400 to-green-600' 
                        : `bg-gradient-to-r ${getVaultThemeGradient(vault.vaultTheme)}`
                    }`}
                    style={{ 
                      width: `${vault.percentage}%`,
                      boxShadow: vault.status === 'released' 
                        ? '0 0 10px rgba(34, 197, 94, 0.4)' 
                        : '0 0 10px rgba(139, 92, 246, 0.4)',
                    }}
                  ></div>
                  <div 
                    className="absolute inset-0 bg-white/10 rounded-full"
                    style={{ clipPath: `polygon(${vault.percentage}% 0, 100% 0, 100% 100%, ${vault.percentage}% 100%)` }}
                  ></div>
                </div>
                
                {/* Details button */}
                <Button 
                  variant={vault.status === 'released' ? 'default' : 'secondary'}
                  size="default" 
                  className="mt-2 w-full justify-between items-center group-hover:scale-[1.05] transition-transform font-semibold"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                  }}
                  style={{
                    background: vault.status === 'released' 
                      ? 'linear-gradient(to right, #22c55e, #16a34a)'
                      : `linear-gradient(to right, ${getVaultThemeGradient(vault.vaultTheme).split(' ')[1].replace('to-', '')}, ${getVaultThemeGradient(vault.vaultTheme).split(' ')[0].replace('from-', '')})`,
                    boxShadow: vault.status === 'released' 
                      ? '0 8px 15px rgba(34, 197, 94, 0.2)' 
                      : '0 8px 15px rgba(139, 92, 246, 0.2)',
                    transform: 'translateZ(15px)',
                    height: '42px'
                  }}
                >
                  <span>View Details</span>
                  <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Back face with 3D effect (subtle shadow) */}
          <div 
            className="absolute backface-hidden w-full h-full -z-10 translate-z-[-5px] rounded-xl"
            style={{
              background: vault.status === 'released' 
                ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.05), rgba(0, 0, 0, 0.02))'
                : `linear-gradient(135deg, ${getVaultThemeGradientBackground(vault.vaultTheme)})`,
              transform: 'rotateY(180deg) translateZ(-5px)',
              opacity: 0.7,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
              backfaceVisibility: 'hidden'
            }}
          ></div>
          
          {/* 3D edge effects */}
          <div 
            className="absolute top-0 left-0 right-0 h-4 transform-style-3d"
            style={{
              background: vault.status === 'released' 
                ? 'linear-gradient(to bottom, #22c55e, transparent)'
                : `linear-gradient(to bottom, ${getVaultThemeGradient(vault.vaultTheme).split(' ')[1].replace('to-', '')}, transparent)`,
              transform: 'rotateX(-90deg) translateZ(10px)',
              opacity: 0.7,
              transformOrigin: 'top'
            }}
          ></div>
          
          {/* Bottom edge */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-4 transform-style-3d"
            style={{
              background: vault.status === 'released' 
                ? 'linear-gradient(to top, rgba(34, 197, 94, 0.3), transparent)'
                : `linear-gradient(to top, rgba(139, 92, 246, 0.3), transparent)`,
              transform: 'rotateX(90deg) translateZ(10px)',
              opacity: 0.7,
              transformOrigin: 'bottom'
            }}
          ></div>
          
          {/* Left edge */}
          <div 
            className="absolute top-0 left-0 bottom-0 w-4 transform-style-3d"
            style={{
              background: vault.status === 'released' 
                ? 'linear-gradient(to right, rgba(34, 197, 94, 0.3), transparent)'
                : `linear-gradient(to right, rgba(139, 92, 246, 0.3), transparent)`,
              transform: 'rotateY(90deg) translateZ(10px)',
              opacity: 0.7,
              transformOrigin: 'left'
            }}
          ></div>
          
          {/* Right edge */}
          <div 
            className="absolute top-0 right-0 bottom-0 w-4 transform-style-3d"
            style={{
              background: vault.status === 'released' 
                ? 'linear-gradient(to left, rgba(34, 197, 94, 0.3), transparent)'
                : `linear-gradient(to left, rgba(139, 92, 246, 0.3), transparent)`,
              transform: 'rotateY(-90deg) translateZ(10px)',
              opacity: 0.7,
              transformOrigin: 'right'
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

// Real-time timer component with seconds and enhanced 3D effects
const RealTimeCountdown: React.FC<{
  timeUntil: ReturnType<typeof calculateTimeUntil>;
}> = ({ timeUntil: initialTime }) => {
  const [timeUntil, setTimeUntil] = useState(initialTime);
  const [animateSeconds, setAnimateSeconds] = useState(false);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimateSeconds(true);
      setTimeout(() => setAnimateSeconds(false), 500);
      
      setTimeUntil(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        } else if (prev.months > 0) {
          return { ...prev, months: prev.months - 1, days: 30, hours: 23, minutes: 59, seconds: 59 };
        } else if (prev.years > 0) {
          return { ...prev, years: prev.years - 1, months: 11, days: 30, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Custom 3D digit component for time units
  const TimeDigit3D: React.FC<{
    value: string | number;
    label: string;
    gradientFrom: string;
    gradientTo: string;
    shadowColor: string;
    size?: 'lg' | 'md' | 'sm';
    delay?: number;
  }> = ({ value, label, gradientFrom, gradientTo, shadowColor, size = 'lg', delay = 0 }) => {
    const boxShadow = `0 10px 30px -5px ${shadowColor}`;
    
    // Size-dependent styling
    const getStyles = () => {
      switch(size) {
        case 'lg':
          return {
            container: "p-4",
            text: "text-3xl md:text-4xl",
            label: "text-xs md:text-sm",
            translateZ: "translate-z-12",
            width: "w-full"
          };
        case 'md':
          return {
            container: "p-3",
            text: "text-2xl md:text-3xl",
            label: "text-xs",
            translateZ: "translate-z-8",
            width: "w-full"
          };
        case 'sm':
          return {
            container: "p-2",
            text: "text-xl md:text-2xl",
            label: "text-[10px]",
            translateZ: "translate-z-6",
            width: "w-full"
          };
      }
    };
    
    const styles = getStyles();
    
    return (
      <div 
        className={`perspective`}
        style={{ 
          animation: `float ${6 + delay}s ease-in-out ${delay}s infinite alternate`,
          transformStyle: 'preserve-3d'
        }}
      >
        <div className="transform-style-3d hover:rotate-y-10 hover:rotate-x-5 duration-500 group">
          {/* Main box */}
          <div 
            className={`relative overflow-hidden ${styles.width} rounded-xl shadow-2xl backface-hidden transform ${styles.translateZ} transition-transform duration-500`}
            style={{
              background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
              boxShadow,
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Glass overlay */}
            <div 
              className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50 backdrop-blur-[1px] group-hover:opacity-30 transition-opacity"
            ></div>
            
            {/* Top edge shine */}
            <div className="absolute top-0 left-0 w-full h-1 bg-white/40 group-hover:bg-white/60 transition-colors"></div>
            
            {/* Inner container with padding */}
            <div className={`${styles.container} relative transform-style-3d`}>
              <div 
                className={`${styles.text} font-bold text-white group-hover:scale-110 transition-transform duration-500`}
                style={{ 
                  textShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
                  fontFamily: "'Space Grotesk', sans-serif",
                  transform: 'translateZ(5px)',
                }}
              >
                {value}
              </div>
              <div 
                className={`${styles.label} text-white/90 font-medium tracking-wide mt-1 group-hover:text-white transition-colors`}
                style={{ transform: 'translateZ(2px)' }}
              >
                {label}
              </div>
            </div>
            
            {/* Bottom inner shadow */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-black/20 to-transparent"
            ></div>
            
            {/* Pulsing glow effect */}
            <div 
              className="absolute -inset-1 opacity-0 group-hover:opacity-40 transition-opacity duration-500"
              style={{
                background: `radial-gradient(circle at center, ${gradientFrom}CC, transparent 70%)`,
                filter: 'blur(10px)',
                transform: 'translateZ(-2px)'
              }}
            ></div>
          </div>
          
          {/* Back face shadow for 3D effect */}
          <div 
            className="absolute inset-0 bg-black/20 rounded-xl -z-10 blur-sm"
            style={{
              transform: 'translateZ(-2px) scale(0.96)',
              opacity: 0.6
            }}
          ></div>
          
          {/* Behind face */}
          <div 
            className="absolute inset-0 backface-hidden rounded-xl -z-10"
            style={{ 
              background: `linear-gradient(135deg, ${gradientTo}88, ${gradientFrom}88)`,
              transform: 'translateZ(-1px) scale(0.98)',
              boxShadow: `inset 0 0 20px rgba(0, 0, 0, 0.3)`,
              opacity: 0.7
            }}
          ></div>
          
          {/* Top face */}
          <div 
            className="absolute top-0 left-0 right-0 h-4 transform"
            style={{
              background: gradientFrom,
              transform: 'rotateX(-90deg) translateZ(12px)',
              transformOrigin: 'top',
              opacity: 0.8
            }}
          ></div>
          
          {/* Bottom face */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-4 transform"
            style={{
              background: gradientTo,
              transform: 'rotateX(90deg) translateZ(12px)',
              transformOrigin: 'bottom',
              opacity: 0.8
            }}
          ></div>
        </div>
      </div>
    );
  };
  
  // Separator component with pulsing animation
  const TimeSeparator: React.FC = () => (
    <div className="flex flex-col justify-center items-center h-full">
      <div 
        className={`text-xl md:text-3xl font-bold text-purple-400 transform-style-3d`}
        style={{
          textShadow: '0 0 10px rgba(139, 92, 246, 0.8)',
          animation: 'pulse-glow 1s ease-in-out infinite',
          transform: 'translateZ(5px)'
        }}
      >
        :
      </div>
      <div className="h-3"></div>
    </div>
  );
  
  return (
    <div className="perspective" style={{ perspective: '2000px' }}>
      <div 
        className="transform-style-3d rounded-xl p-5 bg-gradient-to-br from-purple-900/10 to-indigo-900/5 backdrop-blur-sm border border-purple-500/10 shadow-xl"
        style={{ boxShadow: '0 25px 50px -12px rgba(139, 92, 246, 0.2)' }}
      >
        {/* Main time units */}
        <div className="grid grid-cols-3 gap-5 mb-6">
          <TimeDigit3D
            value={timeUntil.years}
            label="Years"
            gradientFrom="#8B5CF6"
            gradientTo="#4338CA"
            shadowColor="rgba(79, 70, 229, 0.4)"
            size="lg"
            delay={0.2}
          />
          
          <TimeDigit3D
            value={timeUntil.months}
            label="Months"
            gradientFrom="#6366F1"
            gradientTo="#4F46E5"
            shadowColor="rgba(79, 70, 229, 0.4)"
            size="lg"
            delay={0.5}
          />
          
          <TimeDigit3D
            value={timeUntil.days}
            label="Days"
            gradientFrom="#A855F7"
            gradientTo="#7C3AED"
            shadowColor="rgba(139, 92, 246, 0.4)"
            size="lg"
            delay={0.1}
          />
        </div>
        
        {/* Hours, minutes, seconds with 3D effect */}
        <div className="flex items-center justify-between gap-2 mt-2">
          <div className="w-[31%]">
            <TimeDigit3D
              value={String(timeUntil.hours).padStart(2, '0')}
              label="Hours"
              gradientFrom="#EC4899"
              gradientTo="#BE185D"
              shadowColor="rgba(236, 72, 153, 0.3)"
              size="sm"
              delay={0.3}
            />
          </div>
          
          <div className="flex justify-center" style={{ width: '3%' }}>
            <TimeSeparator />
          </div>
          
          <div className="w-[31%]">
            <TimeDigit3D
              value={String(timeUntil.minutes).padStart(2, '0')}
              label="Minutes"
              gradientFrom="#10B981"
              gradientTo="#047857"
              shadowColor="rgba(16, 185, 129, 0.3)"
              size="sm"
              delay={0.4}
            />
          </div>
          
          <div className="flex justify-center" style={{ width: '3%' }}>
            <TimeSeparator />
          </div>
          
          <div className="w-[31%]">
            <div 
              className={`transform-style-3d transition-transform duration-300 ${animateSeconds ? 'scale-[1.05]' : 'scale-100'}`}
              style={{ 
                animation: animateSeconds ? 'timer-pulse 0.5s ease-out' : 'none',
              }}
            >
              <TimeDigit3D
                value={String(timeUntil.seconds).padStart(2, '0')}
                label="Seconds"
                gradientFrom="#F59E0B"
                gradientTo="#D97706"
                shadowColor="rgba(245, 158, 11, 0.3)"
                size="sm"
                delay={0}
              />
            </div>
          </div>
        </div>
        
        {/* Pulsing background effect */}
        <div 
          className="absolute inset-0 -z-10 rounded-xl opacity-10"
          style={{
            background: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.6) 0%, transparent 70%)',
            animation: 'pulse 4s infinite ease-in-out'
          }}
        ></div>
      </div>
    </div>
  );
};

const JourneyVaults3D: React.FC<JourneyVaultProps> = ({ vaults, totalSupply }) => {
  const [activeVaultId, setActiveVaultId] = useState<number | null>(null);
  const [showVisualization, setShowVisualization] = useState(false);
  const [currentTab, setCurrentTab] = useState("grid");
  
  // Get the active vault if one is selected
  const activeVault = activeVaultId !== null ? vaults.find(v => v.id === activeVaultId) : null;
  
  // Get the next upcoming release (the first one that's not released)
  const nextRelease = vaults.find(v => v.status !== 'released');
  
  // Calculate the time until the next release
  const timeUntilRelease = nextRelease ? calculateTimeUntil(nextRelease.releaseDate) : { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  
  // Calculate the total released percentage
  const totalReleasedPercentage = vaults
    .filter(v => v.status === 'released')
    .reduce((sum, v) => sum + v.percentage, 0);
    
  // Calculate the total released tokens
  const totalReleasedTokens = vaults
    .filter(v => v.status === 'released')
    .reduce((sum, v) => sum + v.tokens, 0);
  
  // Function to get a vault theme color
  const getVaultThemeColor = (theme: string) => {
    const themeColors: Record<string, string> = {
      genesis: 'bg-purple-600',
      quantum: 'bg-blue-600',
      cosmic: 'bg-indigo-600',
      nebula: 'bg-violet-600',
      aurora: 'bg-fuchsia-600',
      infinity: 'bg-pink-600'
    };
    
    return themeColors[theme] || 'bg-gray-600';
  };
  
  // Function to get a vault theme gradient
  const getVaultThemeGradient = (theme: string) => {
    const themeGradients: Record<string, string> = {
      genesis: 'from-purple-600 to-purple-900',
      quantum: 'from-blue-600 to-blue-900',
      cosmic: 'from-indigo-600 to-indigo-900',
      nebula: 'from-violet-600 to-violet-900',
      aurora: 'from-fuchsia-600 to-fuchsia-900',
      infinity: 'from-pink-600 to-pink-900'
    };
    
    return themeGradients[theme] || 'from-gray-600 to-gray-900';
  };
  
  // Get CSS gradient background value for vault theme
  const getVaultThemeGradientBackground = (theme: string): string => {
    const themeBackgrounds: Record<string, string> = {
      genesis: 'rgba(147, 51, 234, 0.05), transparent',
      quantum: 'rgba(37, 99, 235, 0.05), transparent',
      cosmic: 'rgba(79, 70, 229, 0.05), transparent',
      nebula: 'rgba(139, 92, 246, 0.05), transparent',
      aurora: 'rgba(192, 38, 211, 0.05), transparent',
      infinity: 'rgba(219, 39, 119, 0.05), transparent'
    };
    
    return themeBackgrounds[theme] || 'rgba(147, 51, 234, 0.05), transparent';
  };
  
  // Add custom CSS for 3D effects
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .perspective { perspective: 2000px; }
      .preserve-3d { transform-style: preserve-3d; }
      .backface-hidden { backface-visibility: hidden; }
      .rotate-y-10 { transform: rotateY(10deg); }
      .rotate-y-5 { transform: rotateY(5deg); }
      .-rotate-y-10 { transform: rotateY(-10deg); }
      .-rotate-y-5 { transform: rotateY(-5deg); }
      .rotate-x-10 { transform: rotateX(10deg); }
      .rotate-x-5 { transform: rotateX(5deg); }
      .-rotate-x-10 { transform: rotateX(-10deg); }
      .-rotate-x-5 { transform: rotateX(-5deg); }
      .rotate-y-[20deg] { transform: rotateY(20deg); }
      .translate-z-1 { transform: translateZ(1px); }
      .translate-z-2 { transform: translateZ(2px); }
      .translate-z-4 { transform: translateZ(4px); }
      .translate-z-6 { transform: translateZ(6px); }
      .translate-z-8 { transform: translateZ(8px); }
      .translate-z-12 { transform: translateZ(12px); }
      .transform-style-3d { transform-style: preserve-3d; }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return (
    <>
      {/* Page header with animated background */}
      <div className="relative overflow-hidden rounded-xl mb-8 bg-gradient-to-r from-purple-900/80 to-indigo-900/80 p-6">
        <div className="absolute inset-0 bg-grid-white/10 bg-grid"></div>
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-purple-500 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10">
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">21-Year Journey Vaults</h2>
            <p className="text-purple-200/90">
              Track the legendary ChronosVault token release schedule through secure time-locked vaults
            </p>
          </div>
          <Button 
            onClick={() => setShowVisualization(true)}
            className="mt-4 md:mt-0 bg-white/10 backdrop-blur-md border-purple-300/20 hover:bg-white/20 text-white shadow-xl shadow-purple-900/20"
          >
            <BarChart3Icon className="mr-2 h-4 w-4" />
            View Distribution Visualization
          </Button>
        </div>
      </div>
      
      {/* Status cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
        <Card className="md:col-span-2 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <LockIcon className="mr-2 h-4 w-4 text-amber-500" />
              Next Vault Unlock
            </CardTitle>
          </CardHeader>
          <CardContent>
            {nextRelease ? (
              <>
                <div className="mb-2">
                  <div className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">{nextRelease.year}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(nextRelease.releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
                
                <RealTimeCountdown timeUntil={timeUntilRelease} />
              </>
            ) : (
              <div className="text-center py-8 bg-gradient-to-br from-green-50 to-transparent dark:from-green-900/20 dark:to-transparent rounded-lg">
                <div className="text-lg font-medium text-green-600 dark:text-green-400">All vaults released</div>
                <div className="text-sm text-muted-foreground">Distribution complete</div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <CheckCircleIcon className="mr-2 h-4 w-4 text-green-500" />
              Released Supply
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-3">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-muted-foreground">Progress</span>
                <span className="text-sm font-medium">{Math.round(totalReleasedPercentage)}%</span>
              </div>
              <div className="relative h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full" 
                     style={{ width: `${totalReleasedPercentage}%` }}></div>
                <div className="absolute top-0 w-1 h-full bg-white/20" 
                     style={{ left: `${totalReleasedPercentage}%`, display: totalReleasedPercentage >= 100 ? 'none' : 'block' }}></div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">{formatNumber(totalReleasedTokens)}</div>
                <div className="text-sm text-muted-foreground">CVT Tokens</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Total Supply</div>
                <div className="font-semibold text-base">{formatNumber(totalSupply)} CVT</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <ShieldIcon className="mr-2 h-4 w-4 text-blue-500" />
              Multi-Chain Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 mr-2 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">T</span>
                  </div>
                  <span className="font-medium">TON Mainnet</span>
                </div>
                <Badge variant="outline" className="font-mono text-xs bg-blue-50 dark:bg-blue-900/30">
                  0:242176c..
                </Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 mr-2 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">E</span>
                  </div>
                  <span className="font-medium">Ethereum</span>
                </div>
                <Badge variant="outline" className="font-mono text-xs bg-purple-50 dark:bg-purple-900/30">
                  0x83c7f4b9..
                </Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-green-600 mr-2 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">S</span>
                  </div>
                  <span className="font-medium">Solana</span>
                </div>
                <Badge variant="outline" className="font-mono text-xs bg-green-50 dark:bg-green-900/30">
                  5VLnDdKBU..
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs for different views */}
      <div className="mb-12">
        <Tabs defaultValue="grid" className="w-full" onValueChange={setCurrentTab}>
          <TabsList className="mb-6 w-full justify-start bg-transparent border-b pb-px">
            <TabsTrigger 
              value="grid" 
              className={`${currentTab === 'grid' ? 'border-b-2 border-purple-500 text-purple-600 dark:text-purple-400' : ''} rounded-none`}
            >
              <div className="flex items-center">
                <div className="grid grid-cols-2 gap-0.5 mr-2">
                  <div className="w-2 h-2 bg-current rounded-sm"></div>
                  <div className="w-2 h-2 bg-current rounded-sm"></div>
                  <div className="w-2 h-2 bg-current rounded-sm"></div>
                  <div className="w-2 h-2 bg-current rounded-sm"></div>
                </div>
                Grid View
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="timeline" 
              className={`${currentTab === 'timeline' ? 'border-b-2 border-purple-500 text-purple-600 dark:text-purple-400' : ''} rounded-none`}
            >
              <div className="flex items-center">
                <div className="w-4 h-4 mr-2 border-l-2 border-current">
                  <div className="w-2 h-2 bg-current rounded-full mt-1 -ml-1"></div>
                </div>
                Timeline View
              </div>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="grid" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vaults.map((vault) => (
                <Vault3DCard 
                  key={vault.id} 
                  vault={vault}
                  onClick={() => setActiveVaultId(vault.id)}
                  getVaultThemeGradient={getVaultThemeGradient}
                  getVaultThemeGradientBackground={getVaultThemeGradientBackground}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="timeline" className="space-y-4">
            <div className="relative pt-10 pb-6">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-blue-500 to-violet-500 rounded"></div>
              
              {/* Timeline Points */}
              {vaults.map((vault, index) => {
                const isLast = index === vaults.length - 1;
                const isOdd = index % 2 === 1;
                
                return (
                  <div key={vault.id} className={`relative ${isLast ? '' : 'mb-40'}`}>
                    {/* Year Marker with 3D effect */}
                    <div className="perspective">
                      <div 
                        className={`absolute left-1/2 transform -translate-x-1/2 top-0 w-14 h-14 rounded-full flex items-center justify-center group z-10 transform-style-3d`}
                      >
                        <div 
                          className={`absolute inset-0 rounded-full ${
                            vault.status === 'released' 
                              ? 'bg-green-500' 
                              : `bg-gradient-to-br ${getVaultThemeGradient(vault.vaultTheme)}`
                          } opacity-20 animate-pulse`}
                        ></div>
                        <div 
                          className={`absolute inset-1 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center ring-4 ${
                            vault.status === 'released' 
                              ? 'ring-green-500' 
                              : `ring-${getVaultThemeColor(vault.vaultTheme).replace('bg-', '')}`
                          } backface-hidden transform translate-z-6 transition-transform group-hover:translate-z-8 duration-300 shadow-lg`}
                        >
                          <span 
                            className={`text-xl font-bold ${
                              vault.status === 'released' 
                                ? 'text-green-600 dark:text-green-500' 
                                : `text-${getVaultThemeColor(vault.vaultTheme).replace('bg-', '')} dark:text-${getVaultThemeColor(vault.vaultTheme).replace('bg-', '')}`
                            }`}
                          >
                            {vault.year}
                          </span>
                        </div>
                        
                        {/* Shadow element */}
                        <div className="absolute inset-2 rounded-full bg-black/20 -z-10 blur-sm transform -translate-z-1"></div>
                      </div>
                    </div>
                    
                    {/* Content with alternating sides */}
                    <div className={`flex ${isOdd ? 'flex-row-reverse' : 'flex-row'}`}>
                      {/* Year and Date */}
                      <div className={`w-1/2 ${isOdd ? 'pl-12' : 'pr-12'} flex ${isOdd ? 'justify-start' : 'justify-end'}`}>
                        <div className={`text-${isOdd ? 'left' : 'right'}`}>
                          <h3 className={`font-bold text-3xl bg-gradient-to-r ${getVaultThemeGradient(vault.vaultTheme)} bg-clip-text text-transparent`}>{vault.year}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(vault.releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      
                      {/* Details Card */}
                      <div className={`w-1/2 ${isOdd ? 'pr-12' : 'pl-12'}`}>
                        <div className="perspective">
                          <div 
                            className="w-full preserve-3d group hover:rotate-y-[10deg] duration-500 transition-all cursor-pointer"
                            onClick={() => setActiveVaultId(vault.id)}
                          >
                            <Card className="overflow-hidden backface-hidden">
                              <div 
                                className={`h-2 w-full bg-gradient-to-r ${getVaultThemeGradient(vault.vaultTheme)}`}
                                style={{
                                  boxShadow: '0 4px 12px -2px rgba(139, 92, 246, 0.2)'
                                }}
                              ></div>
                              <div className={`absolute inset-0 ${getVaultThemeGradient(vault.vaultTheme)} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                              
                              <CardContent className="p-4 relative">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <h4 className={`font-medium text-lg bg-gradient-to-r ${getVaultThemeGradient(vault.vaultTheme)} bg-clip-text text-transparent`}>
                                      {vault.vaultTheme === 'genesis' ? 'Genesis Vault' : `${vault.year} Vault`}
                                    </h4>
                                    <p className="text-sm text-muted-foreground mt-1">{vault.releaseDescription}</p>
                                  </div>
                                  <Badge 
                                    variant={vault.status === 'released' ? 'default' : 'secondary'} 
                                    className={vault.status === 'released' 
                                      ? 'bg-green-500 shadow-sm shadow-green-500/20' 
                                      : 'shadow-sm'
                                    }
                                  >
                                    {vault.status === 'released' ? 'Released' : 'Locked'}
                                  </Badge>
                                </div>
                                
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 mb-3">
                                  <div className="flex items-center justify-between text-sm">
                                    <div>
                                      <div className="text-xs text-muted-foreground mb-0.5">Token Amount</div>
                                      <div className="font-semibold">{formatNumber(vault.tokens)} CVT</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-xs text-muted-foreground mb-0.5">Percentage</div>
                                      <div className="font-semibold">{vault.percentage}%</div>
                                    </div>
                                  </div>
                                  
                                  <div className="relative h-2 mt-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div 
                                      className={`absolute top-0 left-0 h-full rounded-full group-hover:animate-pulse ${
                                        vault.status === 'released' 
                                          ? 'bg-gradient-to-r from-green-400 to-green-600' 
                                          : `bg-gradient-to-r ${getVaultThemeGradient(vault.vaultTheme)}`
                                      }`}
                                      style={{ width: `${vault.percentage}%` }}
                                    ></div>
                                  </div>
                                </div>
                                
                                <Button 
                                  variant={vault.status === 'released' ? 'default' : 'secondary'}
                                  size="sm" 
                                  className="w-full justify-between items-center group-hover:scale-[1.02] transition-transform shadow-md"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveVaultId(vault.id);
                                  }}
                                  style={{
                                    background: vault.status === 'released' 
                                      ? 'linear-gradient(to right, #22c55e, #16a34a)'
                                      : `linear-gradient(to right, ${getVaultThemeGradient(vault.vaultTheme).split(' ')[1].replace('to-', '')}, ${getVaultThemeGradient(vault.vaultTheme).split(' ')[0].replace('from-', '')})`
                                  }}
                                >
                                  <span>View Details</span>
                                  <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                              </CardContent>
                            </Card>
                            
                            {/* Shadow effect for 3D */}
                            <div 
                              className="absolute w-full h-full -z-10 transform -translate-z-2 -rotate-y-180 rounded-lg opacity-30 group-hover:opacity-40 transition-opacity"
                              style={{
                                background: vault.status === 'released' 
                                  ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), transparent)'
                                  : `linear-gradient(135deg, ${getVaultThemeGradientBackground(vault.vaultTheme)})`,
                                filter: 'blur(8px)',
                                boxShadow: vault.status === 'released'
                                  ? '0 15px 30px -15px rgba(34, 197, 94, 0.3)'
                                  : '0 15px 30px -15px rgba(139, 92, 246, 0.3)'
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Vault Details Dialog with enhanced 3D effects - Fixed scrolling issues */}
      <Dialog open={activeVaultId !== null} onOpenChange={(open) => !open && setActiveVaultId(null)}>
        {activeVault && (
          <DialogContent className="max-w-4xl max-h-[90vh] p-0 shadow-2xl border-0 backdrop-blur-md overflow-hidden">
            {/* Animated background gradient */}
            <div 
              className={`absolute inset-0 bg-gradient-to-br ${getVaultThemeGradient(activeVault.vaultTheme)} opacity-5`}
              aria-hidden="true"
            />
            
            {/* Corner elements for 3D effect */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-purple-400/30 rounded-tl-xl"></div>
            <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-purple-400/30 rounded-tr-xl"></div>
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-purple-400/30 rounded-bl-xl"></div>
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-purple-400/30 rounded-br-xl"></div>
            
            <div className="relative p-8 overflow-y-auto max-h-[85vh] perspective" style={{ perspective: '2000px' }}>
              {/* Top gradient bar */}
              <div 
                className={`h-2 absolute top-0 inset-x-0 bg-gradient-to-r ${getVaultThemeGradient(activeVault.vaultTheme)}`}
                style={{
                  boxShadow: '0 4px 12px -2px rgba(139, 92, 246, 0.2)'
                }}
              />
              
              {/* Title section with 3D effect */}
              <div className="perspective mb-8">
                <div className="transform-style-3d">
                  <div className="backface-hidden transform translate-z-4">
                    <DialogHeader className="text-center">
                      <div className="flex flex-col items-center">
                        <Badge 
                          variant={activeVault.status === 'released' ? 'default' : 'secondary'} 
                          className={`${activeVault.status === 'released' ? 'bg-green-500' : ''} text-sm px-6 py-1 mb-3 shadow-md`}
                        >
                          {activeVault.status === 'released' ? 'Released' : 'Locked Until ' + activeVault.year}
                        </Badge>
                        <DialogTitle className={`text-4xl font-bold bg-gradient-to-r ${getVaultThemeGradient(activeVault.vaultTheme)} bg-clip-text text-transparent`}>
                          {activeVault.vaultTheme === 'genesis' ? 'Genesis Vault' : `${activeVault.year} Vault`}
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground mt-2 max-w-2xl">
                          {activeVault.releaseDescription}
                        </DialogDescription>
                      </div>
                    </DialogHeader>
                  </div>
                  <div 
                    className="absolute inset-0 transform -translate-z-2 opacity-20 blur-sm"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${activeVault.status === 'released' ? 'rgba(34, 197, 94, 0.6)' : 'rgba(139, 92, 246, 0.6)'}, transparent 70%)`
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="perspective">
                  <div className="transform-style-3d hover:rotate-y-5 hover:rotate-x-5 duration-300 transition-transform">
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-slate-200/20 dark:border-slate-700/30 shadow-xl backface-hidden transform translate-z-4">
                      <h4 className="font-semibold mb-4 flex items-center text-lg">
                        <InfoIcon className="mr-2 h-5 w-5 text-purple-500" />
                        Vault Details
                      </h4>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                          <span className="text-muted-foreground">Status:</span>
                          <span className="font-medium">
                            {activeVault.status === 'released' ? (
                              <span className="flex items-center text-green-500">
                                <UnlockIcon className="mr-1 h-4 w-4" />
                                Released
                              </span>
                            ) : (
                              <span className="flex items-center text-amber-500">
                                <LockIcon className="mr-1 h-4 w-4" />
                                Time-Locked
                              </span>
                            )}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                          <span className="text-muted-foreground">Release Date:</span>
                          <span className="font-medium">{new Date(activeVault.releaseDate).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                          <span className="text-muted-foreground">Token Amount:</span>
                          <span className="font-medium">{formatNumber(activeVault.tokens)} CVT</span>
                        </div>
                        
                        <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                          <span className="text-muted-foreground">Percentage of Supply:</span>
                          <span className="font-medium">{activeVault.percentage}%</span>
                        </div>
                        
                        <div className="mt-2">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-muted-foreground">Allocation</span>
                            <span className="text-sm font-medium">{activeVault.percentage}%</span>
                          </div>
                          <div className="relative h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                            <div 
                              className={`absolute top-0 left-0 h-full rounded-full ${
                                activeVault.status === 'released' 
                                  ? 'bg-gradient-to-r from-green-400 to-green-600' 
                                  : `bg-gradient-to-r ${getVaultThemeGradient(activeVault.vaultTheme)}`
                              }`}
                              style={{ width: `${activeVault.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <h4 className="font-semibold mb-4 flex items-center text-lg">
                        <ShieldIcon className="mr-2 h-5 w-5 text-purple-500" />
                        Security Verification
                      </h4>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                          <span className="text-muted-foreground">Verification Method:</span>
                          <span className="font-medium">Multi-Chain Time-Lock</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                          <span className="text-muted-foreground">Required Signatures:</span>
                          <span className="font-medium">7 of 11 validators</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                          <span className="text-muted-foreground">Permanent Storage:</span>
                          <span className="font-medium">Arweave</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Shadow effect */}
                    <div 
                      className="absolute inset-0 -z-10 transform -translate-z-2 rounded-xl opacity-50"
                      style={{
                        background: activeVault.status === 'released' 
                          ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), transparent)'
                          : `linear-gradient(135deg, ${getVaultThemeGradientBackground(activeVault.vaultTheme)})`,
                        filter: 'blur(8px)'
                      }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-4 flex items-center text-lg">
                    <LayersIcon className="mr-2 h-5 w-5 text-purple-500" />
                    Blockchain Verification
                  </h4>
                  
                  <div className="space-y-4 perspective">
                    <div className="transform-style-3d hover:rotate-y-5 duration-300 transition-transform">
                      <div className="backface-hidden transform translate-z-4">
                        <Card className="overflow-hidden hover:shadow-lg transition duration-300 border border-slate-200/20 dark:border-slate-800/30">
                          <div className="h-3 w-full bg-gradient-to-r from-blue-400 to-blue-600" style={{boxShadow: '0 2px 8px -2px rgba(59, 130, 246, 0.4)'}}/>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mr-2 shadow-md">
                                  <span className="text-white text-xs font-bold">T</span>
                                </div>
                                <span className="font-medium">TON Mainnet</span>
                              </div>
                              <a 
                                href={`https://tonscan.org/address/0:242176c24e843a2e8c0cac3346d8adc4466307f26e17076a305a02f4040075e0`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-700 transform transition-transform hover:scale-110 flex items-center bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <span className="mr-1 text-xs">Explorer</span>
                                <ExternalLinkIcon className="h-3 w-3" />
                              </a>
                            </div>
                            <div className="mt-3 p-3 rounded-md bg-blue-50 dark:bg-blue-900/20 text-xs font-mono text-blue-800 dark:text-blue-300 break-all shadow-inner">
                              0:242176c24e843a2e8c0cac3346d8adc4466307f26e17076a305a02f4040075e0
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      <div 
                        className="absolute inset-0 -z-10 transform -translate-z-2 rounded-xl opacity-30"
                        style={{
                          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), transparent)',
                          filter: 'blur(4px)'
                        }}
                      ></div>
                    </div>
                    
                    <div className="transform-style-3d hover:-rotate-y-5 duration-300 transition-transform">
                      <div className="backface-hidden transform translate-z-4">
                        <Card className="overflow-hidden hover:shadow-lg transition duration-300 border border-slate-200/20 dark:border-slate-800/30">
                          <div className="h-3 w-full bg-gradient-to-r from-purple-400 to-purple-600" style={{boxShadow: '0 2px 8px -2px rgba(147, 51, 234, 0.4)'}}/>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mr-2 shadow-md">
                                  <span className="text-white text-xs font-bold">E</span>
                                </div>
                                <span className="font-medium">Ethereum</span>
                              </div>
                              <a 
                                href={`https://etherscan.io/address/0x83c7f4b952e2a1c71f86f3b21e9c83d5a9c58621`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-purple-500 hover:text-purple-700 transform transition-transform hover:scale-110 flex items-center bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded-md"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <span className="mr-1 text-xs">Explorer</span>
                                <ExternalLinkIcon className="h-3 w-3" />
                              </a>
                            </div>
                            <div className="mt-3 p-3 rounded-md bg-purple-50 dark:bg-purple-900/20 text-xs font-mono text-purple-800 dark:text-purple-300 break-all shadow-inner">
                              0x83c7f4b952e2a1c71f86f3b21e9c83d5a9c58621
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      <div 
                        className="absolute inset-0 -z-10 transform -translate-z-2 rounded-xl opacity-30"
                        style={{
                          background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1), transparent)',
                          filter: 'blur(4px)'
                        }}
                      ></div>
                    </div>
                    
                    <div className="transform-style-3d hover:rotate-y-5 duration-300 transition-transform">
                      <div className="backface-hidden transform translate-z-4">
                        <Card className="overflow-hidden hover:shadow-lg transition duration-300 border border-slate-200/20 dark:border-slate-800/30">
                          <div className="h-3 w-full bg-gradient-to-r from-green-400 to-green-600" style={{boxShadow: '0 2px 8px -2px rgba(34, 197, 94, 0.4)'}}/>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mr-2 shadow-md">
                                  <span className="text-white text-xs font-bold">S</span>
                                </div>
                                <span className="font-medium">Solana</span>
                              </div>
                              <a 
                                href={`https://explorer.solana.com/address/5VLnDdKBUBUoxEWiNcD9imoT9N7nQPZXv43T4rdXUJwh`}
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-green-500 hover:text-green-700 transform transition-transform hover:scale-110 flex items-center bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <span className="mr-1 text-xs">Explorer</span>
                                <ExternalLinkIcon className="h-3 w-3" />
                              </a>
                            </div>
                            <div className="mt-3 p-3 rounded-md bg-green-50 dark:bg-green-900/20 text-xs font-mono text-green-800 dark:text-green-300 break-all shadow-inner">
                              5VLnDdKBUBUoxEWiNcD9imoT9N7nQPZXv43T4rdXUJwh
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      <div 
                        className="absolute inset-0 -z-10 transform -translate-z-2 rounded-xl opacity-30"
                        style={{
                          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), transparent)',
                          filter: 'blur(4px)'
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
      
      {/* Distribution Visualization Dialog */}
      <Dialog open={showVisualization} onOpenChange={setShowVisualization}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto backdrop-blur-md border-0 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 to-blue-900/5"></div>
          <DialogHeader className="relative z-10">
            <DialogTitle className="text-2xl">CVT Token Distribution Visualization</DialogTitle>
            <DialogDescription>
              Explore the 21-year distribution journey of ChronosToken (CVT) across multiple releases
            </DialogDescription>
          </DialogHeader>
          
          <VaultVisualization vaults={vaults} totalSupply={totalSupply} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default JourneyVaults3D;