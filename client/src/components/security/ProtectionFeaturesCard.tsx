import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Shield, Lock, Brain, Key, Database, Layers, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type SecurityFeature = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  requiresUpgrade: boolean;
  requiresLevel?: 'standard' | 'enhanced' | 'maximum';
};

type ProtectionFeaturesCardProps = {
  features: SecurityFeature[];
  currentSecurityLevel: 'standard' | 'enhanced' | 'maximum';
  onToggleFeature?: (featureId: string, enabled: boolean) => void;
  onUpgradeLevel?: () => void;
};

/**
 * Card component displaying active protection features with toggle controls
 */
export default function ProtectionFeaturesCard({
  features = [],
  currentSecurityLevel = 'standard',
  onToggleFeature,
  onUpgradeLevel
}: ProtectionFeaturesCardProps) {
  // Helper function to get feature icon
  const getFeatureIcon = (featureId: string) => {
    switch(featureId) {
      case 'zero-knowledge':
        return <Shield className="h-4 w-4 text-purple-400" />;
      case 'quantum-resistant':
        return <Lock className="h-4 w-4 text-purple-400" />;
      case 'behavioral-analysis':
        return <Brain className="h-4 w-4 text-purple-400" />;
      case 'multi-signature':
        return <Key className="h-4 w-4 text-purple-400" />;
      case 'data-persistence':
        return <Database className="h-4 w-4 text-purple-400" />;
      case 'cross-chain':
        return <Layers className="h-4 w-4 text-purple-400" />;
      default:
        return <Shield className="h-4 w-4 text-purple-400" />;
    }
  };
  
  return (
    <Card className="hover:border-purple-500 border transition-all duration-300 overflow-hidden relative">
      {/* Background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 to-purple-500/5 z-0"></div>
      
      <CardHeader className="relative z-10">
        <CardTitle className="text-xl">Protection Features</CardTitle>
        <CardDescription>
          Configure your active security features
        </CardDescription>
      </CardHeader>
      
      <CardContent className="relative z-10 space-y-4">
        <div className="space-y-5">
          {features.map((feature) => (
            <div key={feature.id} className="flex justify-between items-center">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  {getFeatureIcon(feature.id)}
                  <Label htmlFor={feature.id} className="text-sm font-medium">
                    {feature.name}
                  </Label>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground">
                          <Info className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs text-xs">{feature.description}</p>
                        {feature.requiresUpgrade && feature.requiresLevel && (
                          <p className="max-w-xs text-xs mt-1 font-semibold">
                            Requires {feature.requiresLevel.charAt(0).toUpperCase() + feature.requiresLevel.slice(1)} security level
                          </p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {feature.requiresUpgrade && (
                  <span className="text-xs text-muted-foreground">
                    {feature.requiresLevel === 'enhanced' ? 'Enhanced' : 'Maximum'}
                  </span>
                )}
                <Switch
                  id={feature.id}
                  checked={feature.enabled}
                  disabled={feature.requiresUpgrade}
                  onCheckedChange={(checked) => onToggleFeature?.(feature.id, checked)}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="relative z-10">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full" 
          onClick={onUpgradeLevel}
          disabled={currentSecurityLevel === 'maximum'}
        >
          {currentSecurityLevel === 'maximum' ? 
            'Maximum Security Active' : 
            `Upgrade to ${currentSecurityLevel === 'standard' ? 'Enhanced' : 'Maximum'} Security`}
        </Button>
      </CardFooter>
    </Card>
  );
}
