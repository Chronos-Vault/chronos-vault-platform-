import React from 'react';
import { Shield, ShieldCheck, Lock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type SecurityBadgeProps = {
  level: 'standard' | 'enhanced' | 'maximum';
  size?: 'small' | 'medium' | 'large';
  showTooltip?: boolean;
  animate?: boolean;
  className?: string;
};

/**
 * A badge showing the security level of a vault or resource
 */
export default function SecurityBadge({
  level,
  size = 'medium',
  showTooltip = true,
  animate = true,
  className
}: SecurityBadgeProps) {
  // Define size classes
  const sizeClasses = {
    small: 'h-5 w-5',
    medium: 'h-6 w-6',
    large: 'h-8 w-8'
  };
  
  // Define color classes based on security level
  const colorClasses = {
    standard: 'text-blue-400 bg-blue-950/30 border-blue-500/30',
    enhanced: 'text-purple-400 bg-purple-950/30 border-purple-500/30',
    maximum: 'text-amber-400 bg-amber-950/30 border-amber-500/30'
  };
  
  // Define animation classes
  const animationClass = animate ? 'animate-pulse' : '';
  
  // Get the appropriate icon based on security level
  const getIcon = () => {
    switch(level) {
      case 'standard':
        return <Shield className={sizeClasses[size]} />;
      case 'enhanced':
        return <ShieldCheck className={sizeClasses[size]} />;
      case 'maximum':
        return <Lock className={sizeClasses[size]} />;
      default:
        return <Shield className={sizeClasses[size]} />;
    }
  };
  
  // Get the tooltip content based on security level
  const getTooltipContent = () => {
    switch(level) {
      case 'standard':
        return (
          <div className="space-y-1 max-w-xs">
            <h4 className="font-medium">Standard Security</h4>
            <p className="text-xs text-muted-foreground">Basic protection for everyday vaults with multi-signature security, behavioral analysis, and daily backups.</p>
          </div>
        );
      case 'enhanced':
        return (
          <div className="space-y-1 max-w-xs">
            <h4 className="font-medium">Enhanced Security</h4>
            <p className="text-xs text-muted-foreground">Advanced protection with zero-knowledge privacy, quantum-resistant encryption, and cross-chain verification.</p>
          </div>
        );
      case 'maximum':
        return (
          <div className="space-y-1 max-w-xs">
            <h4 className="font-medium">Maximum Security</h4>
            <p className="text-xs text-muted-foreground">Military-grade protection with hardware key requirements, full quantum resistance, and comprehensive geolocation verification.</p>
          </div>
        );
      default:
        return <p>Unknown security level</p>;
    }
  };
  
  const badge = (
    <div className={cn(
      'flex items-center justify-center rounded-full border p-1',
      colorClasses[level],
      animationClass,
      className
    )}>
      {getIcon()}
    </div>
  );
  
  if (!showTooltip) {
    return badge;
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badge}
        </TooltipTrigger>
        <TooltipContent>
          {getTooltipContent()}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
