import { useState, useEffect } from "react";
import { calculateTimeRemaining } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface TimeLockProgressProps {
  createdAt: Date | string;
  unlockDate: Date | string;
  isLocked: boolean;
}

const TimeLockProgress = ({ createdAt, unlockDate, isLocked }: TimeLockProgressProps) => {
  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining(unlockDate));
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    // Calculate total duration and elapsed time
    const start = new Date(createdAt).getTime();
    const end = new Date(unlockDate).getTime();
    const now = Date.now();
    const totalDuration = end - start;
    const elapsed = now - start;
    
    // Calculate progress percentage (0-100)
    const currentProgress = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
    setProgress(Math.round(currentProgress));
    
    // Update remaining time every second
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(unlockDate));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [createdAt, unlockDate]);
  
  if (!isLocked) {
    return (
      <div className="bg-[#1E1E1E] border border-[#333333] rounded-lg p-4 text-center">
        <div className="text-lg font-poppins font-medium text-[#FF5AF7] mb-2">Vault Unlocked</div>
        <p className="text-gray-400 text-sm">This vault has been unlocked and assets are available for withdrawal.</p>
      </div>
    );
  }
  
  return (
    <div className="bg-[#1E1E1E] border border-[#333333] rounded-lg p-4">
      <div className="flex justify-between mb-2">
        <div className="text-gray-400 text-sm">Time Lock Progress</div>
        <div className="text-sm font-medium">{progress}%</div>
      </div>
      
      <Progress value={progress} className="h-2 mb-4" />
      
      <div className="text-center p-2 mt-2">
        <p className="text-gray-300 text-sm mb-1">Time Remaining Until Unlock</p>
        <div className="grid grid-cols-4 gap-2 mt-2">
          <div className="bg-[#121212] rounded p-2">
            <div className="text-lg font-poppins font-medium text-[#6B00D7]">{timeRemaining.days}</div>
            <div className="text-xs text-gray-400">Days</div>
          </div>
          <div className="bg-[#121212] rounded p-2">
            <div className="text-lg font-poppins font-medium text-[#6B00D7]">{timeRemaining.hours}</div>
            <div className="text-xs text-gray-400">Hours</div>
          </div>
          <div className="bg-[#121212] rounded p-2">
            <div className="text-lg font-poppins font-medium text-[#6B00D7]">{timeRemaining.minutes}</div>
            <div className="text-xs text-gray-400">Minutes</div>
          </div>
          <div className="bg-[#121212] rounded p-2">
            <div className="text-lg font-poppins font-medium text-[#6B00D7]">{timeRemaining.seconds}</div>
            <div className="text-xs text-gray-400">Seconds</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeLockProgress;
