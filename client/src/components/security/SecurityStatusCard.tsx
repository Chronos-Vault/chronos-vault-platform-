import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, ShieldAlert, RefreshCw, ArrowRight } from 'lucide-react';
import SecurityHealthGauge from './SecurityHealthGauge';

type SecurityStatusCardProps = {
  securityLevel: 'standard' | 'enhanced' | 'maximum';
  securityScore: number; // 0-100
  lastChecked: string;
  activeFeatureCount: number;
  totalFeatureCount: number;
  onUpgradeClick?: () => void;
  onCheckNowClick?: () => void;
};

/**
 * Card showing current security status and score
 */
export default function SecurityStatusCard({
  securityLevel = 'standard',
  securityScore = 0,
  lastChecked = 'Unknown',
  activeFeatureCount = 0,
  totalFeatureCount = 0,
  onUpgradeClick,
  onCheckNowClick
}: SecurityStatusCardProps) {
  // Get color and label based on security level
  const getSecurityLevelInfo = () => {
    switch(securityLevel) {
      case 'standard':
        return { color: 'text-blue-400', label: 'Standard' };
      case 'enhanced':
        return { color: 'text-purple-400', label: 'Enhanced' };
      case 'maximum':
        return { color: 'text-amber-400', label: 'Maximum' };
      default:
        return { color: 'text-blue-400', label: 'Standard' };
    }
  };
  
  const { color, label } = getSecurityLevelInfo();
  
  // Get indicator component based on security score
  const getScoreIndicator = () => {
    if (securityScore >= 80) {
      return <ShieldCheck className="h-5 w-5 text-green-500" />;
    }
    return <ShieldAlert className="h-5 w-5 text-amber-500" />;
  };
  
  return (
    <Card className="hover:border-purple-500 border transition-all duration-300 overflow-hidden relative">
      {/* Background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 to-purple-500/5 z-0"></div>
      
      <CardHeader className="relative z-10">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Security Status</CardTitle>
          <div className={`flex items-center gap-1 text-sm font-medium ${color}`}>
            {label}
          </div>
        </div>
        <CardDescription>
          Overall security health and status
        </CardDescription>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <div className="flex flex-col items-center justify-center mb-4">
          <SecurityHealthGauge score={securityScore} size="medium" />
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Security Features:</span>
            <span className="text-sm font-medium">{activeFeatureCount}/{totalFeatureCount} Active</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Last Security Check:</span>
            <span className="text-sm font-medium">{lastChecked}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Security Status:</span>
            <div className="flex items-center gap-1">
              {getScoreIndicator()}
              <span className="text-sm font-medium">
                {securityScore >= 80 ? 'Secure' : 'Action Needed'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="relative z-10 flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={onCheckNowClick}
        >
          <RefreshCw className="mr-1 h-3.5 w-3.5" />
          Check Now
        </Button>
        
        {securityLevel !== 'maximum' && (
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1"
            onClick={onUpgradeClick}
          >
            Upgrade
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
