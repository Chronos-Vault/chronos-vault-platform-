import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  Key, 
  UserPlus, 
  Clock, 
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDevMode } from '@/contexts/dev-mode-context';

interface ZkPrivacySettingsProps {
  vaultId?: number;
  onSettingsUpdated?: (settings: ZkPrivacySettings) => void;
}

export interface ZkPrivacySettings {
  enabled: boolean;
  contentPrivacy: boolean;
  beneficiaryPrivacy: boolean;
  timePrivacy: boolean;
  hideMetadata: boolean;
}

/**
 * ZkPrivacySettings Component
 * 
 * This component provides a user interface for configuring the Zero-Knowledge
 * privacy settings for a vault. It allows users to control which aspects of their
 * vault use zero-knowledge proofs for enhanced privacy.
 */
export function ZkPrivacySettings({ 
  vaultId, 
  onSettingsUpdated 
}: ZkPrivacySettingsProps) {
  const { toast } = useToast();
  const { devModeEnabled } = useDevMode();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<ZkPrivacySettings>({
    enabled: false,
    contentPrivacy: true,
    beneficiaryPrivacy: true,
    timePrivacy: false,
    hideMetadata: false
  });

  // Update a single setting and call the onSettingsUpdated callback
  const updateSetting = (settingName: keyof ZkPrivacySettings, value: boolean) => {
    const newSettings = { ...settings, [settingName]: value };
    
    // If the main switch is turned off, disable everything
    if (settingName === 'enabled' && value === false) {
      newSettings.contentPrivacy = false;
      newSettings.beneficiaryPrivacy = false;
      newSettings.timePrivacy = false;
      newSettings.hideMetadata = false;
    }
    
    // If any individual privacy setting is enabled, make sure the main switch is on
    if (settingName !== 'enabled' && value === true) {
      newSettings.enabled = true;
    }
    
    setSettings(newSettings);
    
    if (onSettingsUpdated) {
      onSettingsUpdated(newSettings);
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    
    try {
      // In a real implementation, we would save these settings to the server
      // For demonstration, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast({
        title: "Privacy Settings Updated",
        description: "Your zero-knowledge privacy settings have been saved.",
      });
    } catch (error) {
      toast({
        title: "Error Saving Settings",
        description: "There was a problem saving your privacy settings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-[#6B00D7]/30 bg-gradient-to-b from-gray-900 to-gray-950">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-[#FF5AF7]" />
            <CardTitle>Zero-Knowledge Privacy Settings</CardTitle>
          </div>
          <Badge 
            variant={settings.enabled ? "default" : "outline"}
            className={settings.enabled ? "bg-[#6B00D7] text-white" : ""}
          >
            {settings.enabled ? "Enabled" : "Disabled"}
          </Badge>
        </div>
        <CardDescription>
          Control which aspects of your vault use zero-knowledge proofs for enhanced privacy.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center space-x-2">
              <Lock className="h-4 w-4 text-[#FF5AF7]" />
              <div className="font-medium">Enable Zero-Knowledge Privacy</div>
            </div>
            <div className="text-sm text-muted-foreground">
              Master switch for all zero-knowledge features
            </div>
          </div>
          <Switch
            checked={settings.enabled}
            onCheckedChange={(value) => updateSetting('enabled', value)}
          />
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Privacy Options</h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-blue-400" />
              <div className="text-sm">Vault Content Privacy</div>
            </div>
            <Switch
              checked={settings.contentPrivacy}
              disabled={!settings.enabled}
              onCheckedChange={(value) => updateSetting('contentPrivacy', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <UserPlus className="h-4 w-4 text-green-400" />
              <div className="text-sm">Beneficiary Privacy</div>
            </div>
            <Switch
              checked={settings.beneficiaryPrivacy}
              disabled={!settings.enabled}
              onCheckedChange={(value) => updateSetting('beneficiaryPrivacy', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-amber-400" />
              <div className="text-sm">Time-Lock Privacy</div>
            </div>
            <Switch
              checked={settings.timePrivacy}
              disabled={!settings.enabled}
              onCheckedChange={(value) => updateSetting('timePrivacy', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <EyeOff className="h-4 w-4 text-red-400" />
              <div className="text-sm">Hide Vault Metadata</div>
            </div>
            <Switch
              checked={settings.hideMetadata}
              disabled={!settings.enabled}
              onCheckedChange={(value) => updateSetting('hideMetadata', value)}
            />
          </div>
        </div>

        {devModeEnabled && (
          <Alert className="bg-amber-900/20 border-amber-900/50">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <AlertTitle>Developer Mode Active</AlertTitle>
            <AlertDescription>
              In developer mode, zero-knowledge proofs are simulated for testing purposes.
            </AlertDescription>
          </Alert>
        )}

        {settings.enabled && (
          <Alert className="bg-blue-900/20 border-blue-900/50">
            <CheckCircle2 className="h-4 w-4 text-blue-400" />
            <AlertTitle>Enhanced Privacy Active</AlertTitle>
            <AlertDescription>
              Zero-knowledge proofs allow you to prove certain properties about your vault without revealing sensitive data.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>

      <CardFooter>
        <Button 
          onClick={handleSaveSettings} 
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5500AB] hover:to-[#FF46E8]"
        >
          {loading ? "Saving..." : "Save Privacy Settings"}
        </Button>
      </CardFooter>
    </Card>
  );
}