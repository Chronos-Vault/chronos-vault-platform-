import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, AlertTriangle, CheckCircle, Activity, Shield, Lock } from 'lucide-react';

type SecurityEvent = {
  id: string;
  timestamp: string;
  type: 'SECURITY_CHECK' | 'BEHAVIORAL_ALERT' | 'FEATURE_CHANGE' | 'ANOMALY_DETECTED' | 'VERIFICATION';
  description: string;
  result: 'PASSED' | 'FAILED' | 'WARNING' | 'INFO';
  riskLevel: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
};

type SecurityActivityCardProps = {
  activities: SecurityEvent[];
  onViewAll?: () => void;
  onViewDetails?: (eventId: string) => void;
};

/**
 * Card showing recent security events and alerts
 */
export default function SecurityActivityCard({
  activities = [],
  onViewAll,
  onViewDetails
}: SecurityActivityCardProps) {
  // Format to human-readable relative time
  const formatRelativeTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };
  
  // Get icon for event type
  const getEventIcon = (type: SecurityEvent['type'], result: SecurityEvent['result']) => {
    if (result === 'FAILED' || result === 'WARNING') {
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    }
    
    switch(type) {
      case 'SECURITY_CHECK':
        return <Shield className="h-4 w-4 text-green-500" />;
      case 'BEHAVIORAL_ALERT':
        return <Activity className="h-4 w-4 text-blue-500" />;
      case 'FEATURE_CHANGE':
        return <Lock className="h-4 w-4 text-purple-500" />;
      case 'VERIFICATION':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'ANOMALY_DETECTED':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Shield className="h-4 w-4 text-gray-500" />;
    }
  };
  
  // Get badge color for risk level
  const getRiskBadge = (riskLevel: SecurityEvent['riskLevel']) => {
    switch(riskLevel) {
      case 'NONE':
        return <Badge variant="outline" className="text-green-500 border-green-500/30">None</Badge>;
      case 'LOW':
        return <Badge variant="outline" className="text-blue-500 border-blue-500/30">Low</Badge>;
      case 'MEDIUM':
        return <Badge variant="outline" className="text-amber-500 border-amber-500/30">Medium</Badge>;
      case 'HIGH':
        return <Badge variant="outline" className="text-orange-500 border-orange-500/30">High</Badge>;
      case 'CRITICAL':
        return <Badge variant="outline" className="text-red-500 border-red-500/30">Critical</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  return (
    <Card className="hover:border-purple-500 border transition-all duration-300 overflow-hidden relative">
      {/* Background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 to-purple-500/5 z-0"></div>
      
      <CardHeader className="relative z-10">
        <CardTitle className="text-xl">Recent Activity</CardTitle>
        <CardDescription>
          Security events and system checks
        </CardDescription>
      </CardHeader>
      
      <CardContent className="relative z-10 px-2 overflow-hidden">
        {activities.length === 0 ? (
          <div className="text-center p-4 text-muted-foreground">
            No recent security activity to display
          </div>
        ) : (
          <div className="space-y-1">
            {activities.map((activity) => (
              <div 
                key={activity.id} 
                className="flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer"
                onClick={() => onViewDetails?.(activity.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {getEventIcon(activity.type, activity.result)}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{formatRelativeTime(activity.timestamp)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getRiskBadge(activity.riskLevel)}
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="relative z-10">
        <Button 
          variant="ghost" 
          className="w-full text-sm" 
          onClick={onViewAll}
        >
          View All Activity
        </Button>
      </CardFooter>
    </Card>
  );
}
