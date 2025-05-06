import React from 'react';
import { cn } from '@/lib/utils';

type SecurityHealthComponent = {
  name: string;
  score: number; // 0-100
  weight: number; // 0-1
};

type SecurityHealthGaugeProps = {
  score: number; // 0-100
  size?: 'small' | 'medium' | 'large';
  showDetails?: boolean;
  components?: SecurityHealthComponent[];
  onComponentClick?: (component: SecurityHealthComponent) => void;
  className?: string;
};

/**
 * A circular gauge showing the security health score
 */
export default function SecurityHealthGauge({
  score,
  size = 'medium',
  showDetails = false,
  components,
  onComponentClick,
  className
}: SecurityHealthGaugeProps) {
  // Size dimensions
  const sizeConfig = {
    small: {
      width: 60,
      height: 60,
      strokeWidth: 5,
      fontSize: 'text-lg',
      labelSize: 'text-[8px]'
    },
    medium: {
      width: 100,
      height: 100,
      strokeWidth: 8,
      fontSize: 'text-2xl',
      labelSize: 'text-xs'
    },
    large: {
      width: 140,
      height: 140,
      strokeWidth: 10,
      fontSize: 'text-3xl',
      labelSize: 'text-sm'
    }
  };
  
  const { width, height, strokeWidth, fontSize, labelSize } = sizeConfig[size];
  const radius = (width - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const cleanScore = Math.min(100, Math.max(0, score)); // Ensure score is between 0-100
  const dashoffset = circumference - (cleanScore / 100) * circumference;
  
  // Determine color based on score
  const getColor = () => {
    if (cleanScore < 50) return 'text-red-500';
    if (cleanScore < 75) return 'text-amber-500';
    return 'text-green-500';
  };
  
  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className="relative" style={{ width, height }}>
        {/* Background Circle */}
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="absolute"
        >
          <circle
            cx={width / 2}
            cy={height / 2}
            r={radius}
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            className="text-muted-foreground/20"
          />
        </svg>
        
        {/* Progress Circle */}
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="absolute"
          style={{ transform: 'rotate(-90deg)' }}
        >
          <circle
            cx={width / 2}
            cy={height / 2}
            r={radius}
            strokeWidth={strokeWidth}
            stroke="currentColor"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            fill="transparent"
            className={getColor()}
          />
        </svg>
        
        {/* Score Text */}
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center"
        >
          <div className={cn('font-bold', fontSize, getColor())}>{cleanScore}</div>
          <div className={cn('text-muted-foreground', labelSize)}>Security</div>
        </div>
      </div>
      
      {/* Components Breakdown */}
      {showDetails && components && (
        <div className="mt-4 w-full">
          <h4 className={cn("font-medium mb-2", labelSize)}>Components:</h4>
          <div className="space-y-2">
            {components.map((component) => (
              <div 
                key={component.name} 
                className="w-full"
                onClick={() => onComponentClick?.(component)}
              >
                <div className="flex justify-between text-xs">
                  <span>{component.name}</span>
                  <span>{component.score}</span>
                </div>
                <div className="h-1.5 w-full bg-muted overflow-hidden rounded-full">
                  <div 
                    className={cn(
                      "h-full rounded-full",
                      component.score < 50 ? 'bg-red-500' : 
                      component.score < 75 ? 'bg-amber-500' : 'bg-green-500'
                    )}
                    style={{ width: `${component.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
