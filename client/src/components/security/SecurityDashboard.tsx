import React from 'react';
import SecurityStatusCard from './SecurityStatusCard';
import ProtectionFeaturesCard from './ProtectionFeaturesCard';
import SecurityActivityCard from './SecurityActivityCard';
import BackupStatusCard from './BackupStatusCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

/**
 * Comprehensive Security Dashboard displaying all security-related information
 */
export default function SecurityDashboard() {
  const { toast } = useToast();
  const [upgradeDialogOpen, setUpgradeDialogOpen] = React.useState(false);
  const [targetSecurityLevel, setTargetSecurityLevel] = React.useState<'enhanced' | 'maximum'>('enhanced');
  
  // Mock data - in a real implementation, this would come from your security API
  const securityStatus = {
    level: 'enhanced' as const,
    score: 85,
    lastChecked: 'May 6, 2025, 10:30 AM',
    activeFeatureCount: 6,
    totalFeatureCount: 8
  };
  
  const securityFeatures = [
    {
      id: 'zero-knowledge',
      name: 'Zero-Knowledge Privacy',
      description: 'Keeps sensitive vault data private while maintaining verifiability',
      enabled: true,
      requiresUpgrade: false
    },
    {
      id: 'quantum-resistant',
      name: 'Quantum-Resistant Encryption',
      description: 'Protection against quantum computing threats',
      enabled: true,
      requiresUpgrade: false
    },
    {
      id: 'behavioral-analysis',
      name: 'Behavioral Analysis',
      description: 'AI-powered suspicious activity detection',
      enabled: true,
      requiresUpgrade: false
    },
    {
      id: 'multi-signature',
      name: 'Multi-Signature Security',
      description: 'Requires multiple approvals for operations',
      enabled: true,
      requiresUpgrade: false
    },
    {
      id: 'data-persistence',
      name: 'Data Persistence',
      description: 'Automated backups and restore points',
      enabled: true,
      requiresUpgrade: false
    },
    {
      id: 'cross-chain',
      name: 'Cross-Chain Verification',
      description: 'Verifies vault integrity across blockchains',
      enabled: true,
      requiresUpgrade: false
    },
    {
      id: 'hardware-keys',
      name: 'Hardware Key Security',
      description: 'Requires physical hardware keys',
      enabled: false,
      requiresUpgrade: true,
      requiresLevel: 'maximum' as const
    },
    {
      id: 'geolocation',
      name: 'Geolocation Verification',
      description: 'Adds location-based security for access',
      enabled: false,
      requiresUpgrade: true,
      requiresLevel: 'maximum' as const
    },
  ];
  
  const securityActivities = [
    {
      id: 'act-001',
      timestamp: '2025-05-06T10:30:00Z',
      type: 'SECURITY_CHECK' as const,
      description: 'Routine security verification completed',
      result: 'PASSED' as const,
      riskLevel: 'NONE' as const
    },
    {
      id: 'act-002',
      timestamp: '2025-05-06T09:15:00Z',
      type: 'BEHAVIORAL_ALERT' as const,
      description: 'Login from new location detected',
      result: 'WARNING' as const,
      riskLevel: 'LOW' as const
    },
    {
      id: 'act-003',
      timestamp: '2025-05-05T22:45:00Z',
      type: 'VERIFICATION' as const,
      description: 'Cross-chain verification successful',
      result: 'PASSED' as const,
      riskLevel: 'NONE' as const
    },
    {
      id: 'act-004',
      timestamp: '2025-05-05T18:20:00Z',
      type: 'FEATURE_CHANGE' as const,
      description: 'Quantum-resistant encryption enabled',
      result: 'PASSED' as const,
      riskLevel: 'NONE' as const
    }
  ];
  
  const backupStatus = {
    lastBackup: {
      id: 'bkp-001',
      timestamp: '2025-05-06T00:00:00Z',
      type: 'AUTOMATED' as const,
      integrityScore: 100,
      verified: true
    },
    restorePoints: [
      {
        id: 'rp-001',
        timestamp: '2025-05-05T12:00:00Z',
        description: 'Pre-feature update point'
      },
      {
        id: 'rp-002',
        timestamp: '2025-05-04T08:30:00Z',
        description: 'Weekly restore point'
      },
      {
        id: 'rp-003',
        timestamp: '2025-05-01T00:00:00Z',
        description: 'Monthly restore point'
      }
    ],
    backupFrequencyHours: 12,
    nextBackupTime: 'May 6, 2025, 12:00 PM'
  };
  
  // Event handlers
  const handleUpgradeSecurity = () => {
    setTargetSecurityLevel(securityStatus.level === 'standard' ? 'enhanced' : 'maximum');
    setUpgradeDialogOpen(true);
  };
  
  const handleSecurityCheck = () => {
    toast({
      title: "Security Check Initiated",
      description: "Running comprehensive security verification...",
    });
    
    // In a real implementation, this would call your API
    setTimeout(() => {
      toast({
        title: "Security Check Complete",
        description: "All systems secure. No issues detected.",
      });
    }, 2000);
  };
  
  const handleToggleFeature = (featureId: string, enabled: boolean) => {
    toast({
      title: enabled ? "Feature Enabled" : "Feature Disabled",
      description: `${featureId.replace(/-/g, ' ')} has been ${enabled ? 'enabled' : 'disabled'}.`,
    });
  };
  
  const handleCreateBackup = () => {
    toast({
      title: "Manual Backup Initiated",
      description: "Creating a new backup of your vault data...",
    });
    
    // In a real implementation, this would call your API
    setTimeout(() => {
      toast({
        title: "Backup Complete",
        description: "Your vault data has been successfully backed up.",
      });
    }, 2000);
  };
  
  const handleCreateRestorePoint = () => {
    toast({
      title: "Restore Point Created",
      description: "A new restore point has been created for your vault.",
    });
  };
  
  const confirmUpgrade = () => {
    toast({
      title: "Security Level Upgraded",
      description: `Your security level has been upgraded to ${targetSecurityLevel}.`,
    });
    setUpgradeDialogOpen(false);
  };
  
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Security Dashboard</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Manage your vault security settings and monitor security status
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Security Status Card */}
        <SecurityStatusCard 
          securityLevel={securityStatus.level}
          securityScore={securityStatus.score}
          lastChecked={securityStatus.lastChecked}
          activeFeatureCount={securityStatus.activeFeatureCount}
          totalFeatureCount={securityStatus.totalFeatureCount}
          onUpgradeClick={handleUpgradeSecurity}
          onCheckNowClick={handleSecurityCheck}
        />
        
        {/* Protection Features Card */}
        <ProtectionFeaturesCard 
          features={securityFeatures}
          currentSecurityLevel={securityStatus.level}
          onToggleFeature={handleToggleFeature}
          onUpgradeLevel={handleUpgradeSecurity}
        />
        
        {/* Security Activity Card */}
        <SecurityActivityCard 
          activities={securityActivities}
          onViewAll={() => {}}
          onViewDetails={(id) => {
            toast({
              title: "Security Event Details",
              description: `Viewing details for event ${id}`,
            });
          }}
        />
        
        {/* Backup Status Card */}
        <BackupStatusCard 
          lastBackup={backupStatus.lastBackup}
          restorePoints={backupStatus.restorePoints}
          backupFrequencyHours={backupStatus.backupFrequencyHours}
          nextBackupTime={backupStatus.nextBackupTime}
          onCreateBackup={handleCreateBackup}
          onCreateRestorePoint={handleCreateRestorePoint}
          onViewAllBackups={() => {}}
        />
      </div>
      
      {/* Security Upgrade Dialog */}
      <Dialog open={upgradeDialogOpen} onOpenChange={setUpgradeDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upgrade Security Level</DialogTitle>
            <DialogDescription>
              You are about to upgrade your security level to <span className="font-semibold text-purple-500">{targetSecurityLevel}</span>.
              This will enable additional security features and increase protection for your vault.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">New Security Features:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {securityFeatures
                  .filter(f => f.requiresUpgrade && f.requiresLevel === targetSecurityLevel)
                  .map(f => (
                    <li key={f.id} className="text-sm">{f.name}</li>
                  ))}
              </ul>
            </div>
            
            {targetSecurityLevel === 'maximum' && (
              <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-md">
                <p className="text-sm text-amber-200">⚠️ Maximum security level may require additional verification steps for certain operations.</p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setUpgradeDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={confirmUpgrade}>
              Upgrade Security
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
