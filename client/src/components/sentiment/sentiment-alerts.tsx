import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Bell, CheckSquare, Clock, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SentimentAlert {
  id: string;
  type: 'warning' | 'opportunity' | 'info' | 'risk';
  title: string;
  description: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
  dismissed?: boolean;
}

interface SentimentAlertsProps {
  alerts: SentimentAlert[];
  isLoading?: boolean;
  maxAlerts?: number;
  compact?: boolean;
  timeRange?: string;
}

export function SentimentAlerts({
  alerts,
  isLoading = false,
  maxAlerts,
  compact = false,
  timeRange = '24h'
}: SentimentAlertsProps) {
  // Filter alerts to only show the specified max number
  const displayedAlerts = maxAlerts ? alerts.slice(0, maxAlerts) : alerts;
  
  // Get icon for alert type
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-400" />;
      case 'opportunity':
        return <Zap className="h-5 w-5 text-green-400" />;
      case 'info':
        return <Bell className="h-5 w-5 text-blue-400" />;
      case 'risk':
        return <AlertTriangle className="h-5 w-5 text-red-400" />;
      default:
        return <Bell className="h-5 w-5 text-gray-400" />;
    }
  };
  
  // Get style for alert type
  const getAlertStyle = (type: string, priority: string): string => {
    switch (type) {
      case 'warning':
        return priority === 'high' ? 'border-amber-500 bg-amber-500/10' : 'border-amber-500/50 bg-amber-500/5';
      case 'opportunity':
        return priority === 'high' ? 'border-green-500 bg-green-500/10' : 'border-green-500/50 bg-green-500/5';
      case 'info':
        return priority === 'high' ? 'border-blue-500 bg-blue-500/10' : 'border-blue-500/50 bg-blue-500/5';
      case 'risk':
        return priority === 'high' ? 'border-red-500 bg-red-500/10' : 'border-red-500/50 bg-red-500/5';
      default:
        return 'border-gray-500 bg-gray-500/10';
    }
  };
  
  // Get style for priority badge
  const getPriorityStyle = (priority: string): string => {
    switch (priority) {
      case 'high':
        return 'bg-red-500 text-white';
      case 'medium':
        return 'bg-amber-500 text-white';
      case 'low':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };
  
  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <Card className="bg-black/40 border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Bell className="h-5 w-5 mr-2 text-indigo-400" />
            Sentiment Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex justify-center items-center h-40">
            <div className="h-6 w-6 border-4 border-t-transparent border-indigo-500 rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Render compact view
  if (compact) {
    if (displayedAlerts.length === 0) {
      return (
        <Card className="bg-black/40 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Bell className="h-5 w-5 mr-2 text-indigo-400" />
              Sentiment Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
              <CheckSquare className="h-8 w-8 mb-2 text-gray-600" />
              <p>No alerts in the last {timeRange}</p>
            </div>
          </CardContent>
        </Card>
      );
    }
    
    return (
      <Card className="bg-black/40 border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Bell className="h-5 w-5 mr-2 text-indigo-400" />
            Sentiment Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {displayedAlerts.map(alert => (
            <Alert 
              key={alert.id} 
              className={cn("border-l-4", getAlertStyle(alert.type, alert.priority))}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <AlertTitle className="flex items-center text-sm font-medium">
                    {getAlertIcon(alert.type)}
                    <span className="ml-2">{alert.title}</span>
                  </AlertTitle>
                  <AlertDescription className="text-xs mt-1 text-gray-400">
                    {alert.description}
                  </AlertDescription>
                </div>
                <Badge 
                  variant="outline" 
                  className={cn("text-[10px] ml-2", getPriorityStyle(alert.priority))}
                >
                  {alert.priority}
                </Badge>
              </div>
            </Alert>
          ))}
          
          {alerts.length > maxAlerts! && (
            <div className="pt-1 text-center">
              <span className="text-xs text-indigo-400 cursor-pointer hover:underline">
                View {alerts.length - maxAlerts!} more alerts
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
  
  // Render full view
  return (
    <Card className="bg-black/40 border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Bell className="h-5 w-5 mr-2 text-indigo-400" />
          Sentiment Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {displayedAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <CheckSquare className="h-8 w-8 mb-2 text-gray-600" />
            <p>No alerts detected in the last {timeRange}</p>
            <p className="text-xs mt-1">Market sentiment is currently stable</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedAlerts.map(alert => (
              <div 
                key={alert.id} 
                className={cn(
                  "p-4 rounded-lg border-l-4", 
                  getAlertStyle(alert.type, alert.priority)
                )}
              >
                <div className="flex justify-between mb-2">
                  <div className="flex items-center">
                    {getAlertIcon(alert.type)}
                    <h4 className="ml-2 font-medium">{alert.title}</h4>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={cn("text-[10px]", getPriorityStyle(alert.priority))}
                  >
                    {alert.priority}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-300 my-2">
                  {alert.description}
                </p>
                
                <div className="flex items-center text-xs text-gray-500 mt-3">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{formatDate(alert.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default SentimentAlerts;