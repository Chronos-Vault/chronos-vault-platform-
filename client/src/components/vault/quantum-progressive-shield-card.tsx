import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Shield, ShieldCheck, ShieldOff, ArrowUp, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type SecurityMetrics = {
  vaultId: string;
  securityStrength: number;
  currentTier: string;
  lastUpgrade: string;
  hasZeroKnowledgeProofs: boolean;
  requiredSignatures: number;
  signatures: {
    algorithm: string;
    strength: string;
  };
  encryption: {
    algorithm: string;
    latticeParameters: {
      dimension: number;
      errorDistribution: string;
      ringType: string;
    };
  };
};

type SecurityLevel = {
  id: string;
  name: string;
  minValueThreshold: number;
  maxValueThreshold: number | null;
  description: string;
  securityStrength: number;
  signatureAlgorithm: string;
  encryptionAlgorithm: string;
  hasZeroKnowledgeProofs: boolean;
  requiredSignatures: number;
};

interface QuantumProgressiveShieldCardProps {
  vaultId: string;
  vaultValue: number;
  onSecurityUpgrade?: (newLevel: string) => void;
}

export function QuantumProgressiveShieldCard({ vaultId, vaultValue, onSecurityUpgrade }: QuantumProgressiveShieldCardProps) {
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);
  const [levels, setLevels] = useState<SecurityLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [upgrading, setUpgrading] = useState(false);

  // Fetch security metrics for this vault
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        console.log("Fetching security metrics for vault ID:", vaultId);
        const response = await fetch(`/api/security/progressive-quantum/metrics/${vaultId}`);
        console.log("Security metrics response status:", response.status);
        const data = await response.json();
        console.log("Security metrics response data:", data);
        
        if (data.success) {
          console.log("Setting security metrics:", data.metrics);
          setMetrics(data.metrics);
        } else {
          console.log("Failed to load security metrics:", data.error);
          setError('Failed to load security metrics');
          
          // If metrics don't exist, let's initialize them
          if (response.status === 404 && vaultValue) {
            console.log("Attempting to initialize metrics for vault:", vaultId, "with value:", vaultValue);
            try {
              const initResponse = await fetch('/api/security/progressive-quantum/initialize', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ vaultId, vaultValue })
              });
              
              console.log("Initialization response status:", initResponse.status);
              const initData = await initResponse.json();
              console.log("Initialization data:", initData);
              
              if (initData.success) {
                setMetrics(initData.metrics);
                setError(null); // Clear the error since we successfully initialized
              } else {
                console.error("Failed to initialize security metrics:", initData.error);
              }
            } catch (initError) {
              console.error("Error initializing security metrics:", initError);
            }
          }
        }
      } catch (err) {
        setError('Error connecting to security service');
        console.error('Error fetching security metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    // Fetch security levels
    const fetchLevels = async () => {
      try {
        console.log("Fetching security levels");
        const response = await fetch('/api/security/progressive-quantum/levels');
        console.log("Security levels response status:", response.status);
        const data = await response.json();
        console.log("Security levels data:", data);
        
        if (data.success) {
          console.log("Setting security levels:", data.levels);
          setLevels(data.levels);
        } else {
          console.error("Failed to load security levels:", data.error);
          setError('Failed to load security levels');
        }
      } catch (err) {
        console.error('Error fetching security levels:', err);
      }
    };

    if (vaultId) {
      fetchMetrics();
      fetchLevels();
    } else {
      console.error("No vault ID provided to QuantumProgressiveShieldCard");
      setLoading(false);
    }
  }, [vaultId, vaultValue]);

  // Determine the next available security tier
  const nextSecurityTier = metrics && levels.length ? 
    levels.find(level => level.id !== metrics.currentTier && 
      levels.findIndex(l => l.id === level.id) === 
      levels.findIndex(l => l.id === metrics.currentTier) + 1) : null;

  // Calculate the appropriate tier based on current value
  const getAppropriateSecurityTier = (value: number) => {
    if (!levels.length) return null;
    return levels.find(tier => 
      value >= tier.minValueThreshold && 
      (tier.maxValueThreshold === null || value < tier.maxValueThreshold)
    ) || levels[0];
  };
  
  const currentAppropriateLevel = getAppropriateSecurityTier(vaultValue);
  
  // Determine if current security level is too low for the vault value
  const isSecurityLevelTooLow = metrics && currentAppropriateLevel && 
    levels.findIndex(l => l.id === metrics.currentTier) < 
    levels.findIndex(l => l.id === currentAppropriateLevel.id);

  // Handle security upgrade
  const handleUpgrade = async () => {
    if (!nextSecurityTier) return;
    
    setUpgrading(true);
    
    try {
      const response = await fetch('/api/security/progressive-quantum/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          vaultId,
          newTierId: nextSecurityTier.id
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMetrics(data.metrics);
        if (onSecurityUpgrade) onSecurityUpgrade(nextSecurityTier.id);
      } else {
        setError('Failed to upgrade security level');
      }
    } catch (err) {
      setError('Error connecting to security service');
      console.error('Error upgrading security:', err);
    } finally {
      setUpgrading(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-500" />
            Loading Quantum Shield
          </CardTitle>
          <CardDescription>
            Retrieving quantum security metrics...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-24 flex justify-center items-center">
            <div className="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show error state
  if (error || !metrics) {
    return (
      <Card className="border-red-300">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-red-500">
            <ShieldOff className="h-5 w-5" />
            Quantum Shield Unavailable
          </CardTitle>
          <CardDescription>
            {error || 'Security metrics could not be loaded'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-red-50 rounded-md text-sm text-red-800">
            Your vault is still secure, but advanced quantum protection metrics are unavailable.
            Please try again later or contact support if this problem persists.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden">
      <div 
        className={`absolute top-0 right-0 w-32 h-32 -translate-y-16 translate-x-8 opacity-5 rounded-full
          ${metrics.currentTier === 'standard' ? 'bg-blue-500' :
            metrics.currentTier === 'enhanced' ? 'bg-purple-500' :
            metrics.currentTier === 'advanced' ? 'bg-amber-500' : 'bg-red-500'}`}
      />
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className={`h-5 w-5
              ${metrics.currentTier === 'standard' ? 'text-blue-500' :
                metrics.currentTier === 'enhanced' ? 'text-purple-500' :
                metrics.currentTier === 'advanced' ? 'text-amber-500' : 'text-red-500'}`} 
            />
            Progressive Quantum Shield
            {isSecurityLevelTooLow && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant="destructive" className="ml-2 px-1.5 py-0">
                      <ArrowUp className="h-3 w-3 mr-1" /> Upgrade Needed
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Security level too low for current vault value</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </CardTitle>
          <Badge 
            variant="outline" 
            className={`
              ${metrics.currentTier === 'standard' ? 'bg-blue-50 text-blue-700 border-blue-200' :
               metrics.currentTier === 'enhanced' ? 'bg-purple-50 text-purple-700 border-purple-200' :
               metrics.currentTier === 'advanced' ? 'bg-amber-50 text-amber-700 border-amber-200' :
               'bg-red-50 text-red-700 border-red-200'}
            `}
          >
            {levels.find(l => l.id === metrics.currentTier)?.name || 'Unknown'}
          </Badge>
        </div>
        <CardDescription>
          Progressively strengthening quantum-resistant protection
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Security Strength Indicator */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Security Strength</span>
              <span className="font-medium">{metrics.securityStrength}%</span>
            </div>
            <Progress value={metrics.securityStrength} 
              className={`h-2
                ${metrics.currentTier === 'standard' ? 'bg-blue-100' :
                 metrics.currentTier === 'enhanced' ? 'bg-purple-100' :
                 metrics.currentTier === 'advanced' ? 'bg-amber-100' :
                 'bg-red-100'}
              `}
            />
          </div>
          
          {/* Security Details */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="space-y-0.5">
              <p className="text-muted-foreground text-xs">Signature Algorithm</p>
              <p className="font-mono text-xs">{metrics.signatures.algorithm}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-muted-foreground text-xs">Encryption</p>
              <p className="font-mono text-xs">{metrics.encryption.algorithm}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-muted-foreground text-xs">Required Signatures</p>
              <p>{metrics.requiredSignatures}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-muted-foreground text-xs">Zero-Knowledge Proofs</p>
              <p>{metrics.hasZeroKnowledgeProofs ? 'Enabled' : 'Disabled'}</p>
            </div>
          </div>
          
          <div className="mt-1 text-xs text-muted-foreground">
            Last upgraded: {new Date(metrics.lastUpgrade).toLocaleString()}
          </div>
          
          {/* Upgrade Section */}
          {nextSecurityTier && (
            <>
              <Separator />
              <div className="pt-1 space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-medium">Available Upgrade</h4>
                    <p className="text-xs text-muted-foreground">
                      {nextSecurityTier.description}
                    </p>
                  </div>
                  <Badge variant="secondary">+{nextSecurityTier.securityStrength - metrics.securityStrength}% Security</Badge>
                </div>
                
                <Button 
                  onClick={handleUpgrade}
                  disabled={upgrading}
                  className="w-full"
                  variant={isSecurityLevelTooLow ? "destructive" : "secondary"}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  {upgrading ? 'Upgrading...' : `Upgrade to ${nextSecurityTier.name}`}
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}