import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Info, Shield, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type SecurityTipProps = {
  tip: {
    id: string;
    title: string;
    message: string;
    actionLabel?: string;
    actionUrl?: string;
    dismissable?: boolean;
  };
  variant?: 'info' | 'warning' | 'suggestion' | 'alert';
  icon?: React.ReactNode;
  onActionClick?: () => void;
  onDismiss?: () => void;
  className?: string;
};

/**
 * Contextual security tip component that can show security information,
 * warnings, and suggestions to users
 */
export default function SecurityTip({
  tip,
  variant = 'info',
  icon,
  onActionClick,
  onDismiss,
  className
}: SecurityTipProps) {
  // Background and border colors based on variant
  const variantStyles = {
    info: 'bg-blue-950/20 border-blue-500/30',
    warning: 'bg-amber-950/20 border-amber-500/30',
    suggestion: 'bg-purple-950/20 border-purple-500/30',
    alert: 'bg-red-950/20 border-red-500/30'
  };
  
  // Text color based on variant
  const textColor = {
    info: 'text-blue-400',
    warning: 'text-amber-400',
    suggestion: 'text-purple-400',
    alert: 'text-red-400'
  };
  
  // Default icon based on variant if none provided
  const getDefaultIcon = () => {
    switch(variant) {
      case 'info':
        return <Info className="h-5 w-5" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5" />;
      case 'suggestion':
        return <Shield className="h-5 w-5" />;
      case 'alert':
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };
  
  return (
    <Card className={cn(
      'backdrop-blur-sm border shadow-lg animate-fadeIn',
      variantStyles[variant],
      className
    )}>
      <CardContent className="p-4">
        <div className="flex gap-3">
          {/* Icon */}
          <div className={cn('flex-shrink-0 mt-0.5', textColor[variant])}>
            {icon || getDefaultIcon()}
          </div>
          
          {/* Content */}
          <div className="flex-1">
            <h4 className="text-sm font-medium mb-1">{tip.title}</h4>
            <p className="text-xs text-muted-foreground">{tip.message}</p>
            
            {/* Action Button */}
            {tip.actionLabel && (
              <Button 
                variant="link" 
                size="sm" 
                className={cn('px-0 mt-2 h-auto', textColor[variant])}
                onClick={onActionClick}
              >
                {tip.actionLabel}
              </Button>
            )}
          </div>
          
          {/* Dismiss Button */}
          {tip.dismissable && (
            <button 
              className="flex-shrink-0 text-muted-foreground hover:text-foreground" 
              onClick={onDismiss}
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
