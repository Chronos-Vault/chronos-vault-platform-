import React, { useState, useEffect } from 'react';
import { Shield, Lock, EyeOff, Fingerprint, Zap, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface QuantumProgressiveShieldCardProps {
  vaultId: string;
  vaultValue: number;
}

type SecurityTier = {
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

const QuantumProgressiveShieldCard: React.FC<QuantumProgressiveShieldCardProps> = ({ vaultId, vaultValue }) => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [availableTiers, setAvailableTiers] = useState<SecurityTier[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchMetrics();
    fetchAvailableTiers();
  }, [vaultId]);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const response = await apiRequest('GET', `/api/security/progressive-quantum/metrics/${vaultId}`);
      const data = await response.json();
      setMetrics(data.metrics);
    } catch (error) {
      console.error('Error fetching quantum security metrics:', error);
      toast({
        title: "Failed to load security metrics",
        description: "Could not retrieve security metrics for this vault",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableTiers = async () => {
    try {
      const response = await apiRequest('GET', '/api/security/levels');
      const data = await response.json();
      setAvailableTiers(data.levels);
    } catch (error) {
      console.error('Error fetching security tiers:', error);
    }
  };

  const handleInitialize = async () => {
    try {
      setUpdating(true);
      const response = await apiRequest('POST', '/api/security/progressive-quantum/initialize', {
        vaultId,
        vaultValue
      });
      const data = await response.json();
      setMetrics(data.metrics);
      toast({
        title: "Security initialized",
        description: `Quantum-resistant shield initialized at ${data.metrics.securityStrength}% strength`,
      });
    } catch (error) {
      console.error('Error initializing quantum security:', error);
      toast({
        title: "Initialization failed",
        description: "Could not initialize quantum-resistant security",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateValue = async () => {
    try {
      setUpdating(true);
      const response = await apiRequest('POST', '/api/security/progressive-quantum/update-value', {
        vaultId,
        newValue: vaultValue
      });
      const data = await response.json();
      setMetrics(data.metrics);
      
      if (data.upgraded) {
        toast({
          title: "Security level upgraded",
          description: `Vault security automatically strengthened to ${data.metrics.currentTier}`,
        });
      } else {
        toast({
          title: "Security level updated",
          description: "Vault security assessment complete",
        });
      }
    } catch (error) {
      console.error('Error updating security level:', error);
      toast({
        title: "Update failed",
        description: "Could not update quantum-resistant security level",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleUpgrade = async () => {
    // Find the next tier
    if (!metrics || !availableTiers.length) return;
    
    const currentTierIndex = availableTiers.findIndex(t => t.id === metrics.currentTier);
    if (currentTierIndex === -1 || currentTierIndex === availableTiers.length - 1) {
      toast({
        title: "Already at maximum tier",
        description: "This vault is already at the highest security tier",
      });
      return;
    }
    
    const nextTier = availableTiers[currentTierIndex + 1];
    
    try {
      setUpdating(true);
      const response = await apiRequest('POST', '/api/security/progressive-quantum/upgrade', {
        vaultId,
        newTierId: nextTier.id
      });
      const data = await response.json();
      setMetrics(data.metrics);
      toast({
        title: "Security upgraded",
        description: `Quantum-resistant shield upgraded to ${nextTier.name}`,
      });
    } catch (error) {
      console.error('Error upgrading security:', error);
      toast({
        title: "Upgrade failed",
        description: "Could not upgrade quantum-resistant security",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5 text-primary" />
            Loading Quantum Security...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5 text-primary" />
            Quantum-Resistant Shield
          </CardTitle>
          <CardDescription>
            Advanced progressive security that scales with your assets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 items-center justify-center h-40">
            <AlertTriangle className="h-10 w-10 text-amber-500" />
            <p className="text-center text-sm text-muted-foreground">
              Quantum-resistant protection is not yet enabled for this vault.
              Initialize security to protect against quantum computing threats.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleInitialize} disabled={updating} className="w-full">
            {updating ? "Initializing..." : "Initialize Quantum Security"}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const currentTier = availableTiers.find(t => t.id === metrics.currentTier) || {
    name: 'Unknown',
    description: 'Security tier information unavailable'
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5 text-primary" />
            {currentTier.name}
          </CardTitle>
          <Badge 
            variant={metrics.securityStrength > 75 ? "default" : 
                   metrics.securityStrength > 50 ? "secondary" : 
                   "outline"}
            className="ml-2"
          >
            {metrics.securityStrength}% Strength
          </Badge>
        </div>
        <CardDescription>
          {currentTier.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Security Strength</span>
              <span>{metrics.securityStrength}%</span>
            </div>
            <Progress value={metrics.securityStrength} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center">
              <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Encryption: {metrics.encryption.algorithm}</span>
            </div>
            <div className="flex items-center">
              <Fingerprint className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Signatures: {metrics.signatures.algorithm}</span>
            </div>
            <div className="flex items-center">
              <Zap className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Lattice: {metrics.encryption.latticeParameters.dimension}d</span>
            </div>
            <div className="flex items-center">
              <EyeOff className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>
                {metrics.hasZeroKnowledgeProofs ? "ZK Proofs Enabled" : "ZK Proofs Disabled"}
              </span>
            </div>
          </div>

          {metrics.lastUpgrade && (
            <p className="text-xs text-muted-foreground">
              Last upgraded: {new Date(metrics.lastUpgrade).toLocaleString()}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={handleUpdateValue} 
          disabled={updating}
          className="flex-1"
        >
          {updating ? "Updating..." : "Refresh Security"}
        </Button>
        <Button 
          onClick={handleUpgrade} 
          disabled={updating || (availableTiers.findIndex(t => t.id === metrics.currentTier) === availableTiers.length - 1)}
          className="flex-1"
        >
          {updating ? "Upgrading..." : "Upgrade Tier"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuantumProgressiveShieldCard;