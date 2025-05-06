import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Shield, RefreshCw } from 'lucide-react';

type SecurityStatusCardProps = {
  securityLevel: 'standard' | 'enhanced' | 'maximum';
  securityScore: number;
  lastChecked: string;
  activeFeatureCount: number;
  totalFeatureCount: number;
  onUpgradeClick?: () => void;
  onCheckNowClick?: () => void;
};

/**
 * Security Status Card showing current security level, score, and last check time
 */
export default function SecurityStatusCard({
  securityLevel = 'standard',
  securityScore = 75,
  lastChecked = 'Never',
  activeFeatureCount = 3,
  totalFeatureCount = 8,
  onUpgradeClick,
  onCheckNowClick
}: SecurityStatusCardProps) {
  // Format for visual display
  const formattedSecurityLevel = securityLevel.charAt(0).toUpperCase() + securityLevel.slice(1);
  
  // Badge color based on security level
  const getBadgeVariant = () => {
    switch(securityLevel) {
      case 'standard': return 'default';
      case 'enhanced': return 'secondary';
      case 'maximum': return 'destructive';
      default: return 'default';
    }
  };
  
  // Progress color based on score
  const getProgressColor = () => {
    if (securityScore < 50) return 'bg-red-500';
    if (securityScore < 75) return 'bg-amber-500';
    return 'bg-green-500';
  };
  
  return (
    <Card className="hover:border-purple-500 border transition-all duration-300 overflow-hidden relative">
      {/* Background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 to-purple-500/5 z-0"></div>
      
      <CardHeader className="relative z-10">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">Security Status</CardTitle>
          <Badge variant={getBadgeVariant()}>
            {formattedSecurityLevel} Level
          </Badge>
        </div>
        <CardDescription>
          Your vault security overview and status
        </CardDescription>
      </CardHeader>
      
      <CardContent className="relative z-10 space-y-5">
        {/* Security Score */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Security Score</span>
            <span className="font-medium">{securityScore}/100</span>
          </div>
          <Progress value={securityScore} className={getProgressColor()} />
        </div>
        
        {/* Features */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Active Features</span>
            <span className="font-medium">{activeFeatureCount}/{totalFeatureCount}</span>
          </div>
          <Progress 
            value={(activeFeatureCount / totalFeatureCount) * 100}
            className="bg-purple-600" 
          />
        </div>
        
        {/* Last Check */}
        <div className="flex justify-between items-center text-sm pt-2 border-t border-border/50">
          <span className="text-muted-foreground">Last Security Check:</span>
          <span>{lastChecked}</span>
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2 relative z-10">
        {securityLevel !== 'maximum' && (
          <Button 
            variant="default" 
            className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
            onClick={onUpgradeClick}
          >
            <Shield className="mr-2 h-4 w-4" />
            Upgrade Security
          </Button>
        )}
        
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={onCheckNowClick}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Check Now
        </Button>
      </CardFooter>
    </Card>
  );
}
