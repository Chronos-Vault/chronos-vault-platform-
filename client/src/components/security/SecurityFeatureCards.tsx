import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Lock, Brain, Key, Database, Layers, RefreshCw } from 'lucide-react';

type SecurityFeature = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  level: 'standard' | 'enhanced' | 'maximum';
  learnMoreUrl: string;
};

type SecurityFeatureCardProps = {
  feature: SecurityFeature;
  onEnable?: (featureId: string) => void;
  onLearnMore?: (featureId: string) => void;
};

/**
 * Individual security feature card component
 */
const SecurityFeatureCard: React.FC<SecurityFeatureCardProps> = ({ 
  feature, 
  onEnable, 
  onLearnMore 
}) => {
  // Determine badge color based on security level
  const badgeVariant = 
    feature.level === 'standard' ? 'default' :
    feature.level === 'enhanced' ? 'secondary' :
    'destructive';
  
  return (
    <Card className={`border ${feature.enabled ? 'border-purple-500' : 'border-gray-700'} hover:border-purple-400 transition-all duration-300`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="mr-2">
            {feature.icon}
          </div>
          <Badge variant={badgeVariant} className="ml-auto">
            {feature.level.charAt(0).toUpperCase() + feature.level.slice(1)} Security
          </Badge>
        </div>
        <CardTitle className="text-xl mt-2">{feature.title}</CardTitle>
        <CardDescription>{feature.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="px-2 py-1 rounded-md bg-purple-900/30 text-purple-200 text-sm">
          {feature.enabled
            ? "This security feature is active and protecting your vault"
            : "This security feature requires a higher security level"}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="link" 
          onClick={() => onLearnMore?.(feature.id)}
        >
          Learn more
        </Button>
        
        {!feature.enabled && (
          <Button 
            variant="outline" 
            onClick={() => onEnable?.(feature.id)}
          >
            Enable
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

/**
 * Grid of security feature cards to explain available protections
 */
export default function SecurityFeatureCards() {
  // This would come from your security API in a real implementation
  const securityFeatures: SecurityFeature[] = [
    {
      id: 'zero-knowledge',
      title: 'Zero-Knowledge Privacy',
      description: 'Keeps your sensitive vault data private while maintaining verifiability',
      icon: <Shield className="h-6 w-6 text-purple-400" />,
      enabled: true,
      level: 'enhanced',
      learnMoreUrl: '/security/zero-knowledge'
    },
    {
      id: 'quantum-resistant',
      title: 'Quantum-Resistant Encryption',
      description: 'Future-proof protection against quantum computing threats',
      icon: <Lock className="h-6 w-6 text-purple-400" />,
      enabled: true,
      level: 'enhanced',
      learnMoreUrl: '/security/quantum'
    },
    {
      id: 'behavioral-analysis',
      title: 'Behavioral Analysis',
      description: 'AI-powered system that detects suspicious activity in real-time',
      icon: <Brain className="h-6 w-6 text-purple-400" />,
      enabled: true,
      level: 'standard',
      learnMoreUrl: '/security/behavioral'
    },
    {
      id: 'multi-signature',
      title: 'Multi-Signature Security',
      description: 'Requires multiple approvals for high-value operations',
      icon: <Key className="h-6 w-6 text-purple-400" />,
      enabled: true,
      level: 'standard',
      learnMoreUrl: '/security/multi-signature'
    },
    {
      id: 'data-persistence',
      title: 'Data Persistence',
      description: 'Automated backups and restore points protect against data loss',
      icon: <Database className="h-6 w-6 text-purple-400" />,
      enabled: true,
      level: 'standard',
      learnMoreUrl: '/security/data-persistence'
    },
    {
      id: 'cross-chain',
      title: 'Cross-Chain Verification',
      description: 'Verifies vault integrity across multiple blockchains',
      icon: <Layers className="h-6 w-6 text-purple-400" />,
      enabled: true,
      level: 'enhanced',
      learnMoreUrl: '/security/cross-chain'
    },
    {
      id: 'hardware-keys',
      title: 'Hardware Key Security',
      description: 'Requires physical hardware keys for maximum security',
      icon: <Key className="h-6 w-6 text-purple-400" />,
      enabled: false,
      level: 'maximum',
      learnMoreUrl: '/security/hardware-keys'
    },
    {
      id: 'geolocation',
      title: 'Geolocation Verification',
      description: 'Adds location-based security for vault access',
      icon: <RefreshCw className="h-6 w-6 text-purple-400" />,
      enabled: false,
      level: 'maximum',
      learnMoreUrl: '/security/geolocation'
    },
  ];
  
  const handleEnable = (featureId: string) => {
    // In a real implementation, this would call an API to enable the feature
    console.log(`Enable feature: ${featureId}`);
    // Then update UI or show a modal explaining upgrade requirements
  };
  
  const handleLearnMore = (featureId: string) => {
    // In a real implementation, this would navigate to documentation
    // or show a modal with detailed explanation
    console.log(`Learn more about: ${featureId}`);
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Your Security Features</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Chronos Vault protects your assets with these advanced security features
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {securityFeatures.map(feature => (
          <SecurityFeatureCard
            key={feature.id}
            feature={feature}
            onEnable={handleEnable}
            onLearnMore={handleLearnMore}
          />
        ))}
      </div>
    </div>
  );
}
