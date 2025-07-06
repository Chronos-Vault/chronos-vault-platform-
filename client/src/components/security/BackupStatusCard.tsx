import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Database, Clock, CheckCircle2 } from 'lucide-react';

type Backup = {
  id: string;
  timestamp: string;
  type: 'AUTOMATED' | 'MANUAL';
  integrityScore: number; // 0-100
  verified: boolean;
};

type RestorePoint = {
  id: string;
  timestamp: string;
  description: string;
};

type BackupStatusCardProps = {
  lastBackup: Backup | null;
  restorePoints: RestorePoint[];
  backupFrequencyHours: number;
  nextBackupTime: string;
  onCreateBackup?: () => void;
  onCreateRestorePoint?: () => void;
  onViewAllBackups?: () => void;
};

/**
 * Card displaying backup status and restore points
 */
export default function BackupStatusCard({
  lastBackup = null,
  restorePoints = [],
  backupFrequencyHours = 24,
  nextBackupTime = 'Unknown',
  onCreateBackup,
  onCreateRestorePoint,
  onViewAllBackups
}: BackupStatusCardProps) {
  // Format date from ISO string
  const formatDate = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  // Format file size in human-readable format
  const formatBackupFrequency = (hours: number): string => {
    if (hours < 1) return `${hours * 60} minutes`;
    if (hours === 1) return '1 hour';
    if (hours < 24) return `${hours} hours`;
    if (hours === 24) return '1 day';
    return `${hours / 24} days`;
  };
  
  return (
    <Card className="hover:border-purple-500 border transition-all duration-300 overflow-hidden relative">
      {/* Background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 to-purple-500/5 z-0"></div>
      
      <CardHeader className="relative z-10">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Backup & Recovery</CardTitle>
          <div className="flex items-center gap-1 text-xs font-medium bg-purple-900/20 px-2 py-1 rounded-full border border-purple-500/30">
            <Clock className="h-3 w-3 text-purple-400" />
            <span>Every {formatBackupFrequency(backupFrequencyHours)}</span>
          </div>
        </div>
        <CardDescription>
          Backup status and restore points
        </CardDescription>
      </CardHeader>
      
      <CardContent className="relative z-10 space-y-5">
        {/* Last Backup Status */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Last Backup</h3>
            {lastBackup?.verified && (
              <div className="flex items-center gap-1 text-xs text-green-500">
                <CheckCircle2 className="h-3 w-3" />
                <span>Verified</span>
              </div>
            )}
          </div>
          
          {lastBackup ? (
            <div className="bg-black/30 p-3 rounded-md space-y-2 border border-purple-900/30">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Timestamp:</span>
                <span>{formatDate(lastBackup.timestamp)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Type:</span>
                <span>{lastBackup.type === 'AUTOMATED' ? 'Automated' : 'Manual'}</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Integrity Score:</span>
                  <span>{lastBackup.integrityScore}%</span>
                </div>
                <Progress value={lastBackup.integrityScore} className="bg-purple-950 h-1.5" />
              </div>
            </div>
          ) : (
            <div className="bg-black/30 p-4 rounded-md text-center text-sm text-muted-foreground border border-purple-900/30">
              No backup available
            </div>
          )}
          
          {/* Next backup info */}
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Next Backup:</span>
            <span>{nextBackupTime}</span>
          </div>
        </div>
        
        {/* Restore Points */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Restore Points</h3>
          
          {restorePoints.length > 0 ? (
            <div className="max-h-36 overflow-y-auto pr-1">
              {restorePoints.map((point) => (
                <div key={point.id} className="flex justify-between items-center py-2 border-b border-border/20 last:border-0 group hover:bg-purple-900/10 px-2 rounded-md transition-colors">
                  <div className="space-y-0.5">
                    <div className="text-xs font-medium">{point.description}</div>
                    <div className="text-[10px] text-muted-foreground">{formatDate(point.timestamp)}</div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    Restore
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-black/30 p-3 rounded-md text-center text-sm text-muted-foreground border border-purple-900/30">
              No restore points available
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="relative z-10 flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={onCreateBackup}
        >
          <Database className="mr-1 h-3.5 w-3.5" />
          Create Backup
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={onCreateRestorePoint}
        >
          <Clock className="mr-1 h-3.5 w-3.5" />
          Create Restore Point
        </Button>
      </CardFooter>
    </Card>
  );
}
