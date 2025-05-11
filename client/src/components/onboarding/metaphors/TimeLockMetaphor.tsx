import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, ArrowRight, Lock, Unlock } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

export const TimeLockMetaphor = () => {
  const [timeOffset, setTimeOffset] = useState(50);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [targetDate, setTargetDate] = useState(new Date());
  
  // Initialize with animation
  useEffect(() => {
    // Set initial dates
    const now = new Date();
    const future = new Date();
    future.setMonth(future.getMonth() + 6); // 6 months in the future
    setCurrentDate(now);
    setTargetDate(future);
    
    // Animation timing
    const animateTimer = setTimeout(() => {
      setTimeOffset(85);
      setIsUnlocked(true);
    }, 2000);
    
    const interactiveTimer = setTimeout(() => {
      setIsInteractive(true);
    }, 3000);
    
    return () => {
      clearTimeout(animateTimer);
      clearTimeout(interactiveTimer);
    };
  }, []);
  
  // Update target date based on slider
  useEffect(() => {
    const now = new Date();
    const future = new Date();
    // Scale between 1 month and 5 years
    const months = Math.floor(1 + (timeOffset / 100) * 59);
    future.setMonth(now.getMonth() + months);
    setTargetDate(future);
    
    // Determine if unlocked (for demonstration purposes)
    setIsUnlocked(timeOffset > 80);
  }, [timeOffset]);
  
  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Calculate number of months between dates
  const monthsBetween = (d1: Date, d2: Date) => {
    const years = d2.getFullYear() - d1.getFullYear();
    const months = d2.getMonth() - d1.getMonth();
    return years * 12 + months;
  };
  
  return (
    <div className="time-lock-metaphor h-64 w-full flex flex-col items-center justify-center relative">
      {/* Timeline visualization */}
      <div className="timeline-container w-full max-w-md mb-6 px-4">
        <div className="relative pt-10 pb-4">
          {/* Timeline track */}
          <div className="absolute top-10 left-0 right-0 h-1 bg-muted rounded-full" />
          
          {/* Progress indicator */}
          <motion.div 
            className="absolute top-10 left-0 h-1 bg-primary rounded-full"
            style={{ width: `${timeOffset}%` }}
            initial={{ width: '0%' }}
            animate={{ width: `${timeOffset}%` }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Current date marker */}
          <div className="absolute top-6 left-0 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
              <Calendar className="h-4 w-4" />
            </div>
            <span className="text-xs mt-1 text-muted-foreground">Now</span>
            <span className="text-xs font-mono mt-1 text-primary">{formatDate(currentDate)}</span>
          </div>
          
          {/* Target date marker */}
          <motion.div 
            className="absolute top-6 flex flex-col items-center"
            style={{ left: `${timeOffset}%`, transform: 'translateX(-50%)' }}
            animate={{ 
              left: `${timeOffset}%`,
              scale: isUnlocked ? [1, 1.1, 1] : 1
            }}
            transition={{ 
              duration: 0.5,
              scale: {
                duration: 0.5,
                repeat: isUnlocked ? 2 : 0,
                repeatType: 'reverse',
              }
            }}
          >
            <div className={`w-8 h-8 rounded-full ${isUnlocked ? 'bg-green-500' : 'bg-[#FF5AF7]'} flex items-center justify-center text-white`}>
              <Clock className="h-4 w-4" />
            </div>
            <span className="text-xs mt-1 text-muted-foreground">Unlock Date</span>
            <span className={`text-xs font-mono mt-1 ${isUnlocked ? 'text-green-500' : 'text-[#FF5AF7]'}`}>{formatDate(targetDate)}</span>
          </motion.div>
          
          {/* Arrow indicator */}
          <div className="absolute top-10 left-[25%] flex flex-col items-center">
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
          
          <div className="absolute top-10 left-[50%] flex flex-col items-center">
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
          
          <div className="absolute top-10 left-[75%] flex flex-col items-center">
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>
      
      {/* Asset visualization */}
      <div className="asset-container relative mb-6 flex items-center justify-center">
        <motion.div 
          className={`w-16 h-16 rounded-xl border-2 ${
            isUnlocked ? 'border-green-500 bg-green-500/10' : 'border-[#FF5AF7] bg-[#FF5AF7]/10'
          } flex items-center justify-center`}
          animate={{ 
            scale: isUnlocked ? 1.1 : 1,
            rotate: isUnlocked ? [0, 5, 0, -5, 0] : 0
          }}
          transition={{
            scale: { duration: 0.5 },
            rotate: { 
              duration: 1, 
              repeat: isUnlocked ? Infinity : 0, 
              repeatDelay: 1
            }
          }}
        >
          <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-[#FF5AF7]">
            CVT
          </span>
        </motion.div>
        
        {/* Lock indicator */}
        <motion.div 
          className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full ${
            isUnlocked ? 'bg-green-500' : 'bg-[#FF5AF7]'
          } flex items-center justify-center text-white shadow-lg`}
          animate={{ 
            scale: isUnlocked ? [1, 1.2, 1] : 1,
            rotate: isUnlocked ? 360 : 0
          }}
          transition={{
            scale: { 
              duration: 0.5,
              repeat: isUnlocked ? 1 : 0,
              repeatType: 'reverse'
            },
            rotate: { duration: 0.5 }
          }}
        >
          {isUnlocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
        </motion.div>
      </div>
      
      {/* Time adjustment slider (interactive after animation) */}
      {isInteractive && (
        <div className="time-slider w-full max-w-md px-8">
          <p className="text-sm text-center mb-2 text-muted-foreground">
            Adjust unlock time: <span className="font-medium text-foreground">{monthsBetween(currentDate, targetDate)} months</span>
          </p>
          <Slider
            value={[timeOffset]}
            min={1}
            max={100}
            step={1}
            onValueChange={(values) => setTimeOffset(values[0])}
          />
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>1 month</span>
            <span>2.5 years</span>
            <span>5 years</span>
          </div>
        </div>
      )}
      
      {/* Status message */}
      <motion.p 
        className={`mt-4 text-sm ${isUnlocked ? 'text-green-500' : 'text-[#FF5AF7]'}`}
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ delay: 0.5 }}
      >
        {isUnlocked 
          ? '✓ Time condition met - assets unlocked!'
          : `🔒 Assets locked until ${formatDate(targetDate)}`
        }
      </motion.p>
      
      {isInteractive && (
        <p className="text-xs text-muted-foreground mt-1">
          Drag the slider to set different time-lock periods
        </p>
      )}
    </div>
  );
};