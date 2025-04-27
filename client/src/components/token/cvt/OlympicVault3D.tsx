import React, { useState, useEffect } from 'react';
import { OlympicVault, olympicVaultService } from '@/lib/cvt/olympic-vault-service';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRightIcon, CalendarIcon, CheckCircleIcon, LockIcon, Medal as MedalIcon, 
         Flame as FireIcon, Snowflake as SnowflakeIcon, Globe as GlobeIcon, Unlock as UnlockIcon, Timer as TimerIcon } from 'lucide-react';

/**
 * Enhanced 3D Olympic Vault Component
 * Features beautiful 3D vaults with real-time countdown timers for Olympic events
 */

// Helper functions
const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Calculate time remaining to a target date
const calculateTimeRemaining = (targetDate: Date | string): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} => {
  const now = new Date();
  const targetDateObj = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
  const difference = targetDateObj.getTime() - now.getTime();
  
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);
  
  return { days, hours, minutes, seconds };
};

// Timer component with 3D effects and seconds display
const OlympicTimer: React.FC<{
  targetDate: string;
  vaultType: 'summer' | 'winter';
  isUnlocked: boolean;
}> = ({ targetDate, vaultType, isUnlocked }) => {
  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining(targetDate));
  const [animateSeconds, setAnimateSeconds] = useState(false);
  
  useEffect(() => {
    if (isUnlocked) return;
    
    const timer = setInterval(() => {
      const newTime = calculateTimeRemaining(targetDate);
      setTimeRemaining(newTime);
      setAnimateSeconds(true);
      setTimeout(() => setAnimateSeconds(false), 300);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [targetDate, isUnlocked]);
  
  if (isUnlocked) {
    return (
      <div 
        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-center py-3 px-4 rounded-lg transform-style-3d"
        style={{ 
          transform: 'translateZ(8px)',
          boxShadow: '0 8px 16px -4px rgba(16, 185, 129, 0.4)'
        }}
      >
        <div className="font-bold text-lg flex items-center justify-center">
          <UnlockIcon className="w-5 h-5 mr-2" />
          <span>Vault Unlocked</span>
        </div>
      </div>
    );
  }
  
  // Get colors based on vault type
  const getGradientColors = () => {
    return vaultType === 'summer' 
      ? { from: '#F59E0B', to: '#D97706', shadow: 'rgba(245, 158, 11, 0.4)' }
      : { from: '#60A5FA', to: '#3B82F6', shadow: 'rgba(59, 130, 246, 0.4)' };
  };
  
  const colors = getGradientColors();
  
  return (
    <div 
      className="transform-style-3d rounded-xl overflow-hidden shadow-2xl"
      style={{ perspective: '1000px' }}
    >
      <div 
        className="bg-gradient-to-r text-white p-4 rounded-lg transform-style-3d"
        style={{ 
          background: `linear-gradient(to right, ${colors.from}CC, ${colors.to})`,
          transform: 'translateZ(5px)',
          boxShadow: `0 10px 20px -5px ${colors.shadow}`
        }}
      >
        <div className="text-sm font-bold mb-2 text-center flex items-center justify-center">
          <TimerIcon className="w-4 h-4 mr-2" />
          <span>Opening Ceremony Countdown</span>
        </div>
        
        <div className="grid grid-cols-4 gap-2 transform-style-3d">
          <div className="transform-style-3d">
            <div 
              className="bg-white/10 backdrop-blur-[1px] rounded-lg p-2 text-center shadow-inner transform"
              style={{ transform: 'translateZ(10px)' }}
            >
              <div className="text-2xl font-bold">{timeRemaining.days}</div>
              <div className="text-xs uppercase font-medium">days</div>
            </div>
          </div>
          
          <div className="transform-style-3d">
            <div 
              className="bg-white/10 backdrop-blur-[1px] rounded-lg p-2 text-center shadow-inner transform"
              style={{ transform: 'translateZ(10px)' }}
            >
              <div className="text-2xl font-bold">{String(timeRemaining.hours).padStart(2, '0')}</div>
              <div className="text-xs uppercase font-medium">hours</div>
            </div>
          </div>
          
          <div className="transform-style-3d">
            <div 
              className="bg-white/10 backdrop-blur-[1px] rounded-lg p-2 text-center shadow-inner transform"
              style={{ transform: 'translateZ(10px)' }}
            >
              <div className="text-2xl font-bold">{String(timeRemaining.minutes).padStart(2, '0')}</div>
              <div className="text-xs uppercase font-medium">min</div>
            </div>
          </div>
          
          <div className="transform-style-3d">
            <div 
              className={`bg-white/10 backdrop-blur-[1px] rounded-lg p-2 text-center shadow-inner transform transition-transform duration-300 ${animateSeconds ? 'scale-110' : 'scale-100'}`}
              style={{ 
                transform: 'translateZ(10px)',
                animation: animateSeconds ? 'timer-pulse 0.3s ease-out' : 'none' 
              }}
            >
              <div 
                className="text-2xl font-bold"
                style={{ textShadow: animateSeconds ? '0 0 8px rgba(255, 255, 255, 0.8)' : 'none' }}
              >
                {String(timeRemaining.seconds).padStart(2, '0')}
              </div>
              <div className="text-xs uppercase font-medium">sec</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 3D Olympic Vault card component
const OlympicVault3DCard: React.FC<{
  vault: OlympicVault;
  onClick: () => void;
}> = ({ vault, onClick }) => {
  const isSummer = vault.type === 'summer';
  const vaultIcon = isSummer ? <FireIcon className="h-5 w-5" /> : <SnowflakeIcon className="h-5 w-5" />;
  const vaultColors = isSummer 
    ? { primary: '#F59E0B', secondary: '#D97706', gradient: 'from-amber-500 to-amber-700' }
    : { primary: '#60A5FA', secondary: '#3B82F6', gradient: 'from-blue-500 to-blue-700' };
  
  return (
    <div 
      className="group perspective cursor-pointer"
      onClick={onClick}
      style={{ perspective: '2000px' }}
    >
      <div 
        className="relative preserve-3d group-hover:rotate-y-[20deg] group-hover:rotate-x-[5deg] duration-700 transition-all animate-float"
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
            background: `radial-gradient(circle, ${vaultColors.primary}66, transparent 70%)`,
          }}
        ></div>
      
        {/* Card body */}
        <div 
          className="backface-hidden w-full h-full rounded-xl overflow-hidden shadow-xl border border-slate-200/20 dark:border-slate-700/20 group-hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] transition-all duration-700"
          style={{
            background: `linear-gradient(135deg, ${vault.isUnlocked ? 'rgba(34, 197, 94, 0.1)' : `rgba(${isSummer ? '245, 158, 11' : '59, 130, 246'}, 0.1)`}, rgba(0, 0, 0, 0.05))`,
            borderTop: `3px solid ${vault.isUnlocked ? '#22c55e' : vaultColors.primary}`,
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden',
            transform: 'translateZ(10px)'
          }}
        >
          {/* Card shine effects */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700" 
            style={{
              background: `linear-gradient(105deg, transparent 20%, rgba(255, 255, 255, 0.2) 40%, rgba(255, 255, 255, 0.2) 60%, transparent 80%)`,
              backgroundSize: '200% 100%',
              animation: 'shine 3s infinite linear',
            }}
          ></div>
          
          {/* Header with host city and year */}
          <div className="relative p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                {vaultIcon}
                <h3 
                  className={`text-2xl font-bold ml-2 bg-gradient-to-br ${vaultColors.gradient} bg-clip-text text-transparent`}
                  style={{ 
                    textShadow: `0 2px 10px ${vaultColors.primary}33`,
                    transform: 'translateZ(5px)',
                  }}
                >
                  {vault.year}
                </h3>
              </div>
              
              <Badge 
                variant={vault.isUnlocked ? 'default' : 'secondary'} 
                className={`${vault.isUnlocked ? 'bg-green-500' : ''} px-3 py-1 text-white`}
                style={{ 
                  transform: 'translateZ(8px)',
                  boxShadow: `0 4px 12px ${vault.isUnlocked ? 'rgba(34, 197, 94, 0.3)' : 'rgba(0, 0, 0, 0.15)'}`
                }}
              >
                {vault.isUnlocked ? 'Unlocked' : 'Locked'}
              </Badge>
            </div>
            
            <div className="flex items-center mb-4" style={{ transform: 'translateZ(3px)' }}>
              <GlobeIcon className="h-5 w-5 mr-2 text-muted-foreground" />
              <span className="font-semibold text-lg">{vault.location}</span>
            </div>
            
            <p 
              className="text-sm text-muted-foreground mb-4"
              style={{ transform: 'translateZ(2px)' }}
            >
              {vault.description}
            </p>
            
            <div 
              className="flex items-center text-sm font-medium text-muted-foreground mb-4"
              style={{ transform: 'translateZ(4px)' }}
            >
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 mr-2 shadow-inner">
                <CalendarIcon className="h-4 w-4 text-slate-500" />
              </div>
              <span>{formatDate(vault.unlockDate)}</span>
            </div>
            
            {/* 3D Timer Component */}
            <div className="mb-4" style={{ transform: 'translateZ(6px)' }}>
              <OlympicTimer 
                targetDate={vault.unlockDate}
                vaultType={vault.type}
                isUnlocked={vault.isUnlocked}
              />
            </div>
            
            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-slate-200/20 dark:border-slate-700/20" style={{ transform: 'translateZ(5px)' }}>
              <Button 
                variant={vault.isUnlocked ? 'default' : 'secondary'}
                size="lg" 
                className="w-full justify-between items-center group-hover:scale-[1.03] transition-transform"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
                style={{
                  background: vault.isUnlocked 
                    ? 'linear-gradient(to right, #22c55e, #16a34a)'
                    : `linear-gradient(to right, ${vaultColors.primary}, ${vaultColors.secondary})`,
                  boxShadow: vault.isUnlocked 
                    ? '0 8px 15px rgba(34, 197, 94, 0.2)' 
                    : `0 8px 15px ${isSummer ? 'rgba(245, 158, 11, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`,
                  transform: 'translateZ(10px)',
                }}
              >
                <span>View Olympic Vault</span>
                <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* 3D edge effects */}
        <div 
          className="absolute top-0 left-0 right-0 h-3 transform-style-3d"
          style={{
            background: `linear-gradient(to bottom, ${vaultColors.primary}, transparent)`,
            transform: 'rotateX(-90deg) translateZ(10px)',
            opacity: 0.7,
            transformOrigin: 'top'
          }}
        ></div>
        
        {/* Bottom edge */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-3 transform-style-3d"
          style={{
            background: `linear-gradient(to top, ${vaultColors.primary}80, transparent)`,
            transform: 'rotateX(90deg) translateZ(10px)',
            opacity: 0.5,
            transformOrigin: 'bottom'
          }}
        ></div>
        
        {/* Left edge */}
        <div 
          className="absolute top-0 left-0 bottom-0 w-3 transform-style-3d"
          style={{
            background: `linear-gradient(to right, ${vaultColors.primary}80, transparent)`,
            transform: 'rotateY(90deg) translateZ(10px)',
            opacity: 0.5,
            transformOrigin: 'left'
          }}
        ></div>
        
        {/* Right edge */}
        <div 
          className="absolute top-0 right-0 bottom-0 w-3 transform-style-3d"
          style={{
            background: `linear-gradient(to left, ${vaultColors.primary}80, transparent)`,
            transform: 'rotateY(-90deg) translateZ(10px)',
            opacity: 0.5,
            transformOrigin: 'right'
          }}
        ></div>
      </div>
    </div>
  );
};

// Main Olympic Vault 3D Grid component
interface OlympicVaults3DProps {
  olympicVaults: OlympicVault[];
}

const OlympicVaults3D: React.FC<OlympicVaults3DProps> = ({ olympicVaults }) => {
  const [activeVaultId, setActiveVaultId] = useState<number | null>(null);
  const [currentTab, setCurrentTab] = useState('all');
  const [loading, setLoading] = useState(false);
  
  // Get the active vault if one is selected
  const activeVault = activeVaultId !== null ? olympicVaults.find(v => v.id === activeVaultId) : null;
  
  // Filter vaults based on the active tab
  const filteredVaults = React.useMemo(() => {
    switch (currentTab) {
      case 'summer':
        return olympicVaults.filter(v => v.type === 'summer');
      case 'winter':
        return olympicVaults.filter(v => v.type === 'winter');
      default:
        return olympicVaults;
    }
  }, [olympicVaults, currentTab]);
  
  return (
    <div className="space-y-8">
      {/* Olympic Games header with themed background */}
      <div className="relative overflow-hidden rounded-xl mb-6 bg-gradient-to-r from-blue-900/80 to-indigo-900/80 p-6">
        <div className="absolute inset-0 bg-grid-white/10"></div>
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-blue-500 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        
        <div className="relative z-10">
          <div className="flex items-center">
            <MedalIcon className="h-8 w-8 text-amber-400 mr-3" />
            <h2 className="text-3xl font-bold text-white">Olympic Games Vaults</h2>
          </div>
          <p className="text-blue-100 mt-2 max-w-3xl">
            Special time-locked vaults that synchronize with the Olympic Games cycle, 
            unlocking with each Opening Ceremony to reveal historic moments and predictions.
          </p>
        </div>
      </div>
      
      {/* Tabs and content */}
      <Tabs defaultValue="all" value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="all" className="text-base">All Olympic Vaults</TabsTrigger>
          <TabsTrigger value="summer" className="text-base">
            <FireIcon className="h-4 w-4 mr-2" />
            Summer Games
          </TabsTrigger>
          <TabsTrigger value="winter" className="text-base">
            <SnowflakeIcon className="h-4 w-4 mr-2" />
            Winter Games
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVaults.map(vault => (
              <OlympicVault3DCard 
                key={vault.id}
                vault={vault}
                onClick={() => setActiveVaultId(vault.id)}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="summer" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVaults.map(vault => (
              <OlympicVault3DCard 
                key={vault.id}
                vault={vault}
                onClick={() => setActiveVaultId(vault.id)}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="winter" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVaults.map(vault => (
              <OlympicVault3DCard 
                key={vault.id}
                vault={vault}
                onClick={() => setActiveVaultId(vault.id)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Olympic Vault Detail Dialog */}
      <Dialog open={activeVaultId !== null} onOpenChange={(open) => !open && setActiveVaultId(null)}>
        {activeVault && (
          <DialogContent className="max-w-4xl max-h-[90vh] p-0 shadow-2xl border-0 backdrop-blur-md overflow-hidden">
            {/* Background gradient */}
            <div 
              className={`absolute inset-0 bg-gradient-to-br ${activeVault.capsuleType === 'summer' ? 'from-amber-500/5 to-amber-800/5' : 'from-blue-500/5 to-blue-800/5'} opacity-100`}
              aria-hidden="true"
            />
            
            {/* 3D corner effects */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-white/10 rounded-tl-xl"></div>
            <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-white/10 rounded-tr-xl"></div>
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-white/10 rounded-bl-xl"></div>
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-white/10 rounded-br-xl"></div>
            
            <div className="relative p-8 overflow-y-auto max-h-[85vh] perspective" style={{ perspective: '2000px' }}>
              {/* Top gradient bar */}
              <div 
                className="h-2 absolute top-0 inset-x-0"
                style={{
                  background: `linear-gradient(to right, ${activeVault.capsuleType === 'summer' ? '#F59E0B, #D97706' : '#60A5FA, #3B82F6'})`,
                  boxShadow: '0 4px 12px -2px rgba(0, 0, 0, 0.2)'
                }}
              />
              
              {/* Title section with 3D effect */}
              <div className="perspective mb-8">
                <div className="transform-style-3d">
                  <div className="backface-hidden transform translate-z-4">
                    <DialogHeader className="text-center">
                      <div className="flex flex-col items-center">
                        <Badge 
                          variant={activeVault.isUnlocked ? 'default' : 'secondary'} 
                          className={`${activeVault.isUnlocked ? 'bg-green-500' : ''} text-sm px-6 py-1 mb-3`}
                        >
                          {activeVault.isUnlocked ? 'Unlocked' : `Locked Until ${formatDate(activeVault.unlockDate)}`}
                        </Badge>
                        <DialogTitle className="text-4xl font-bold">
                          <span 
                            className={`bg-gradient-to-r ${activeVault.capsuleType === 'summer' ? 'from-amber-500 to-amber-700' : 'from-blue-500 to-blue-700'} bg-clip-text text-transparent`}
                          >
                            {activeVault.name}
                          </span>
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground mt-2 max-w-2xl">
                          {activeVault.description}
                        </DialogDescription>
                      </div>
                    </DialogHeader>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left column - Vault details */}
                <div className="perspective">
                  <div className="transform-style-3d hover:rotate-y-5 hover:rotate-x-5 duration-300 transition-transform">
                    <div 
                      className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-slate-200/20 dark:border-slate-700/30 shadow-xl backface-hidden transform translate-z-4"
                    >
                      <h4 className="font-semibold mb-4 flex items-center text-lg">
                        <MedalIcon className="mr-2 h-5 w-5 text-amber-500" />
                        Olympic Vault Details
                      </h4>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-slate-50/20 dark:bg-slate-800/30 rounded-lg">
                          <span className="text-muted-foreground">Olympic Year:</span>
                          <span className="font-medium">{activeVault.olympicYear}</span>
                        </div>
                        
                        <div className="flex justify-between items-center p-3 bg-slate-50/20 dark:bg-slate-800/30 rounded-lg">
                          <span className="text-muted-foreground">Host City:</span>
                          <span className="font-medium">{activeVault.hostCity}</span>
                        </div>
                        
                        <div className="flex justify-between items-center p-3 bg-slate-50/20 dark:bg-slate-800/30 rounded-lg">
                          <span className="text-muted-foreground">Type:</span>
                          <span className="font-medium flex items-center">
                            {activeVault.capsuleType === 'summer' ? (
                              <>
                                <FireIcon className="h-4 w-4 mr-1 text-amber-500" />
                                Summer Olympics
                              </>
                            ) : (
                              <>
                                <SnowflakeIcon className="h-4 w-4 mr-1 text-blue-500" />
                                Winter Olympics
                              </>
                            )}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center p-3 bg-slate-50/20 dark:bg-slate-800/30 rounded-lg">
                          <span className="text-muted-foreground">Unlock Date:</span>
                          <span className="font-medium">{formatDate(activeVault.unlockDate)}</span>
                        </div>
                        
                        <div className="flex justify-between items-center p-3 bg-slate-50/20 dark:bg-slate-800/30 rounded-lg">
                          <span className="text-muted-foreground">Status:</span>
                          <span className="font-medium">
                            {activeVault.isUnlocked ? (
                              <span className="flex items-center text-green-500">
                                <UnlockIcon className="mr-1 h-4 w-4" />
                                Unlocked
                              </span>
                            ) : (
                              <span className="flex items-center text-amber-500">
                                <LockIcon className="mr-1 h-4 w-4" />
                                Time-Locked
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* 3D shadow effect */}
                    <div 
                      className="absolute inset-0 -z-10 rounded-xl opacity-50"
                      style={{
                        background: activeVault.capsuleType === 'summer' 
                          ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), transparent)'
                          : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), transparent)',
                        transform: 'translateZ(-2px)',
                        filter: 'blur(8px)'
                      }}
                    ></div>
                  </div>
                </div>
                
                {/* Right column - Vault content & timer */}
                <div className="space-y-6">
                  <div className="transform-style-3d hover:-rotate-y-5 hover:rotate-x-5 duration-300 transition-transform">
                    <div className="backface-hidden transform translate-z-4">
                      <h4 className="font-semibold mb-4 flex items-center text-lg">
                        <TimerIcon className="mr-2 h-5 w-5 text-purple-500" />
                        Countdown Timer
                      </h4>
                      
                      <div className="mb-6">
                        <OlympicTimer 
                          targetDate={activeVault.unlockDate}
                          vaultType={activeVault.capsuleType || activeVault.type}
                          isUnlocked={activeVault.isUnlocked}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="transform-style-3d hover:rotate-y-5 duration-300 transition-transform">
                    <div className="backface-hidden transform translate-z-4">
                      <Card className="overflow-hidden hover:shadow-lg transition duration-300 border border-slate-200/20 dark:border-slate-800/30">
                        <CardContent className="p-5">
                          <h4 className="font-semibold mb-4 flex items-center text-lg">
                            <GlobeIcon className="mr-2 h-5 w-5 text-green-500" />
                            Message Content
                          </h4>
                          
                          <p className="text-muted-foreground">
                            {activeVault.messageContent || "This vault's message is time-locked until the opening ceremony."}
                          </p>
                          
                          {!activeVault.isUnlocked && (
                            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-800 dark:text-amber-300 text-sm">
                              <div className="flex items-start">
                                <LockIcon className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                                <p>
                                  This content is securely time-locked until the opening ceremony of the {activeVault.olympicYear} Olympic Games in {activeVault.hostCity}. 
                                  Return on {formatDate(activeVault.unlockDate)} to access the complete vault.
                                </p>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div 
                      className="absolute inset-0 -z-10 rounded-xl opacity-30"
                      style={{
                        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), transparent)',
                        transform: 'translateZ(-2px)',
                        filter: 'blur(4px)'
                      }}
                    ></div>
                  </div>
                  
                  <div className="transform-style-3d hover:-rotate-y-5 duration-300 transition-transform">
                    <div className="backface-hidden transform translate-z-4">
                      <Card className="overflow-hidden hover:shadow-lg transition duration-300 border border-slate-200/20 dark:border-slate-800/30">
                        <CardContent className="p-5">
                          <h4 className="font-semibold mb-4 flex items-center text-lg">
                            <GlobeIcon className="mr-2 h-5 w-5 text-blue-500" />
                            Blockchain Verification
                          </h4>
                          
                          <div className="p-3 rounded-md bg-blue-50 dark:bg-blue-900/20 text-xs font-mono text-blue-800 dark:text-blue-300 break-all shadow-inner">
                            {activeVault.blockchainAddress}
                          </div>
                          
                          <div className="mt-4 flex justify-between">
                            <div className="text-sm text-muted-foreground">
                              <span className="font-medium">Signatures:</span> {activeVault.signatureCount}/7 required
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <span className="font-medium">Media Items:</span> {activeVault.mediaCount}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div 
                      className="absolute inset-0 -z-10 rounded-xl opacity-30"
                      style={{
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), transparent)',
                        transform: 'translateZ(-2px)',
                        filter: 'blur(4px)'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default OlympicVaults3D;