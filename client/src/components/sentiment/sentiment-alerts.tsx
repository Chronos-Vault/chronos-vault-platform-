import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  SentimentAlert,
  TimeRange
} from '@/services/sentiment-analysis-service';
import {
  AlertTriangle,
  Info,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Clock,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SentimentAlertsProps {
  alerts: SentimentAlert[];
  isLoading?: boolean;
  maxAlerts?: number;
  compact?: boolean;
  timeRange?: TimeRange;
}

export function SentimentAlerts({
  alerts,
  isLoading = false,
  maxAlerts = 5,
  compact = false,
  timeRange = '24h'
}: SentimentAlertsProps) {
  const [displayedAlerts, setDisplayedAlerts] = useState<SentimentAlert[]>([]);
  
  // Update displayed alerts when props change
  useEffect(() => {
    if (alerts && alerts.length > 0) {
      // Sort by timestamp descending (newest first)
      const sortedAlerts = [...alerts].sort((a, b) => b.timestamp - a.timestamp);
      // Limit to maxAlerts
      setDisplayedAlerts(sortedAlerts.slice(0, maxAlerts));
    } else {
      setDisplayedAlerts([]);
    }
  }, [alerts, maxAlerts]);
  
  // Format timestamp
  const formatTimestamp = (timestamp: number): string => {
    const now = new Date();
    const alertDate = new Date(timestamp);
    const diffMs = now.getTime() - alertDate.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    }
    
    const diffHours = Math.round(diffMs / 3600000);
    if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    }
    
    const diffDays = Math.round(diffMs / 86400000);
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };
  
  // Get icon for alert source
  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'twitter':
      case 'reddit':
        return <MessageSquare className="h-4 w-4" />;
      case 'news_articles':
        return <Info className="h-4 w-4" />;
      case 'blockchain_metrics':
        return <TrendingUp className="h-4 w-4" />;
      case 'exchange_data':
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };
  
  // Get color for sentiment level
  const getSentimentColor = (level: string): string => {
    if (level.includes('bullish')) return 'text-green-500';
    if (level.includes('bearish')) return 'text-red-500';
    return 'text-gray-500';
  };
  
  // Get impact badge color
  const getImpactColor = (impact: 'high' | 'medium' | 'low'): string => {
    switch (impact) {
      case 'high':
        return 'bg-red-600';
      case 'medium':
        return 'bg-amber-600';
      case 'low':
        return 'bg-gray-600';
      default:
        return 'bg-gray-600';
    }
  };
  
  // Get time range text
  const getTimeRangeText = (range: TimeRange): string => {
    switch (range) {
      case '24h':
        return 'Last 24 hours';
      case '7d':
        return 'Last 7 days';
      case '30d':
        return 'Last 30 days';
      case '90d':
        return 'Last 90 days';
      default:
        return 'Recent alerts';
    }
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <Card className="bg-black/40 border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Sentiment Alerts</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex justify-center items-center h-40">
            <div className="h-6 w-6 border-4 border-t-transparent border-indigo-500 rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Render no alerts state
  if (!displayedAlerts.length) {
    return (
      <Card className="bg-black/40 border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Sentiment Alerts</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col items-center justify-center h-40 text-gray-500">
            <Info className="h-8 w-8 mb-2 text-gray-600" />
            <p>No sentiment alerts available</p>
            <p className="text-xs mt-1">Check back later for updates</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-black/40 border-gray-800">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Sentiment Alerts</CardTitle>
          <Badge variant="outline" className="text-xs bg-black/30">
            {getTimeRangeText(timeRange)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {displayedAlerts.map((alert) => (
            <div 
              key={alert.id}
              className="py-2 border-b border-gray-800 last:border-0"
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className={cn(
                  "text-sm font-medium",
                  getSentimentColor(alert.level)
                )}>
                  {alert.title}
                </h3>
                <Badge className={cn(
                  "text-xs",
                  getImpactColor(alert.impact)
                )}>
                  {alert.impact}
                </Badge>
              </div>
              
              {!compact && (
                <p className="text-xs text-gray-400 mb-2">{alert.description}</p>
              )}
              
              <div className="flex justify-between items-center text-xs text-gray-500">
                <div className="flex items-center">
                  {getSourceIcon(alert.source)}
                  <span className="ml-1 capitalize">{alert.source.replace('_', ' ')}</span>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatTimestamp(alert.timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default SentimentAlerts;