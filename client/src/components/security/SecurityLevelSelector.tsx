import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Lock, ShieldCheck, Shield } from 'lucide-react';

type SecurityLevel = {
  id: 'standard' | 'enhanced' | 'maximum';
  name: string;
  description: string;
  features: string[];
  recommendedFor: string;
  activeFeatureCount: number;
  totalFeatureCount: number;
};

type SecurityLevelSelectorProps = {
  currentLevel: 'standard' | 'enhanced' | 'maximum';
  vaultId?: string;
  onLevelSelect?: (level: 'standard' | 'enhanced' | 'maximum') => void;
};

/**
 * Security level selector component for choosing between Standard, Enhanced, and Maximum security
 */
export default function SecurityLevelSelector({ 
  currentLevel = 'standard', 
  vaultId,
  onLevelSelect 
}: SecurityLevelSelectorProps) {
  const securityLevels: SecurityLevel[] = [
    {
      id: 'standard',
      name: 'Standard',
      description: 'Basic protection for everyday vaults',
      features: [
        'Multi-Signature (2-of-N)',
        'Behavioral Analysis',
        'Daily Automated Backups',
        'Basic Cross-Chain Verification'
      ],
      recommendedFor: 'Low-value vaults (under $10,000)',
      activeFeatureCount: 3,
      totalFeatureCount: 8
    },
    {
      id: 'enhanced',
      name: 'Enhanced',
      description: 'Advanced protection for valuable assets',
      features: [
        'Multi-Signature (3-of-N)',
        'Zero-Knowledge Privacy',
        'Quantum-Resistant Encryption',
        'Full Cross-Chain Verification',
        'Geolocation Verification',
        '12-Hour Automated Backups'
      ],
      recommendedFor: 'Medium-value vaults ($10,000 - $100,000)',
      activeFeatureCount: 6,
      totalFeatureCount: 8
    },
    {
      id: 'maximum',
      name: 'Maximum',
      description: 'Military-grade security for high-value assets',
      features: [
        'Multi-Signature (4-of-N)',
        'Hardware Key Requirement',
        'Zero-Knowledge Privacy',
        'Quantum-Resistant Encryption',
        'Full Cross-Chain Verification',
        'Geolocation Verification',
        '6-Hour Automated Backups'
      ],
      recommendedFor: 'High-value vaults (over $100,000)',
      activeFeatureCount: 8,
      totalFeatureCount: 8
    }
  ];

  const getLevelIcon = (level: string) => {
    switch(level) {
      case 'standard':
        return <Shield className="h-8 w-8 text-blue-400" />;
      case 'enhanced':
        return <ShieldCheck className="h-8 w-8 text-purple-400" />;
      case 'maximum':
        return <Lock className="h-8 w-8 text-amber-400" />;
      default:
        return <Shield className="h-8 w-8 text-blue-400" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch(level) {
      case 'standard':
        return 'border-blue-500 bg-blue-950/20';
      case 'enhanced':
        return 'border-purple-500 bg-purple-950/20';
      case 'maximum':
        return 'border-amber-500 bg-amber-950/20';
      default:
        return 'border-blue-500 bg-blue-950/20';
    }
  };

  const getButtonVariant = (level: string) => {
    if (level === currentLevel) return 'default';
    
    switch(level) {
      case 'standard':
        return 'outline';
      case 'enhanced':
        return 'secondary';
      case 'maximum':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const handleSelect = (level: 'standard' | 'enhanced' | 'maximum') => {
    onLevelSelect?.(level);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Security Level Selection</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Choose the protection level that's right for your vault
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {securityLevels.map(level => (
          <Card 
            key={level.id} 
            className={`relative overflow-hidden transition-all duration-300 ${getLevelColor(level.id)} ${currentLevel === level.id ? 'border-2' : 'border'}`}
          >
            {currentLevel === level.id && (
              <div className="absolute top-2 right-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
            )}
            
            <CardHeader>
              <div className="flex items-center space-x-3">
                {getLevelIcon(level.id)}
                <CardTitle>{level.name} Security</CardTitle>
              </div>
              <CardDescription className="pt-2">{level.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-2">RECOMMENDED FOR</p>
                <p className="text-sm font-medium">{level.recommendedFor}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-2">SECURITY FEATURES ({level.activeFeatureCount}/{level.totalFeatureCount})</p>
                <ul className="space-y-1">
                  {level.features.map((feature, i) => (
                    <li key={i} className="text-sm flex items-center">
                      <CheckCircle2 className="h-3 w-3 mr-2 inline text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                variant={getButtonVariant(level.id)}
                className="w-full"
                disabled={currentLevel === level.id}
                onClick={() => handleSelect(level.id)}
              >
                {currentLevel === level.id ? 'Current Level' : `Upgrade to ${level.name}`}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="bg-black/30 p-4 rounded-lg border border-purple-900">
        <p className="text-sm text-muted-foreground">
          <strong>Security Note:</strong> Chronos Vault uses a Triple-Chain Security Architecture with zero-knowledge proofs and quantum-resistant encryption to provide best-in-class protection for your digital assets. Different security levels offer tailored protection based on your needs.
        </p>
      </div>
    </div>
  );
}
