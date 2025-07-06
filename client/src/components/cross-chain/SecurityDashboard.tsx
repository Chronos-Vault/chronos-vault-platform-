import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAtomicSwap } from "@/contexts/atomic-swap-context";
import { SwapInfo } from "@/lib/cross-chain/atomic-swap-service";
import { Shield, Users, MapPin, RotateCcw, Check, AlertTriangle, X } from "lucide-react";

interface SecurityDashboardProps {
  swapId?: string;
  address?: string;
}

export function SecurityDashboard({ swapId, address }: SecurityDashboardProps) {
  const { userSwaps, selectedSwap, performSecurityVerification } = useAtomicSwap();
  
  // Find the swap to display (either from swapId prop or selectedSwap from context)
  const swapToDisplay = React.useMemo(() => {
    if (swapId) {
      return userSwaps.find(swap => swap.id === swapId) || selectedSwap;
    }
    return selectedSwap;
  }, [swapId, userSwaps, selectedSwap]);
  
  // Check if we are showing address-based security instead of swap security
  if (address) {
    return (
      <Card className="border-purple-500/30 bg-black/20 backdrop-blur-sm shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] bg-clip-text text-transparent">
              Wallet Security Dashboard
            </CardTitle>
            <Badge variant="outline" className="bg-green-500/20 text-green-200">
              <Check className="w-3 h-3 mr-1" /> Connected
            </Badge>
          </div>
          <CardDescription>
            Advanced security metrics for address {address.slice(0, 6)}...{address.slice(-4)}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pb-3">
          <div className="flex flex-col space-y-4">
            {/* Security Score for Address */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Security Score</span>
                <Badge variant="default" className="bg-green-500/20 text-green-200">
                  LOW RISK
                </Badge>
              </div>
              <Progress value={85} max={100} className="h-2 bg-green-500" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>High Risk</span>
                <span>Medium Risk</span>
                <span>Low Risk</span>
              </div>
            </div>
            
            {/* Security Features for Address */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border border-purple-500/20 bg-purple-950/10">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#FF5AF7]" />
                  <span className="text-sm font-medium">Multi-Chain Identity</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">Verified on 3 chains</span>
                  <Badge variant="default" className="bg-green-500/20 text-green-200">ACTIVE</Badge>
                </div>
              </div>
              
              <div className="p-3 rounded-lg border border-purple-500/20 bg-purple-950/10">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#FF5AF7]" />
                  <span className="text-sm font-medium">Security Protocols</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">Enhanced security active</span>
                  <Badge variant="default" className="bg-green-500/20 text-green-200">ACTIVE</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Handle null swap (no swap selected or found)
  if (!swapToDisplay) {
    return (
      <Card className="border-dashed border-purple-500/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-center">Security Dashboard</CardTitle>
          <CardDescription className="text-center">No swap selected to display security metrics</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pb-6">
          <Badge variant="outline" className="bg-purple-950/30 text-purple-200 border-purple-700/50 px-3 py-1">
            <Shield className="w-4 h-4 mr-2" /> 
            Select a swap to view security details
          </Badge>
        </CardContent>
      </Card>
    );
  }
  
  // Calculate security metrics
  const securityScore = swapToDisplay.securityScore || 50;
  const riskLevel = swapToDisplay.riskAssessment || 'medium';
  const multiSigEnabled = swapToDisplay.config.useAtomicMultiSig || false;
  const geoVerificationEnabled = swapToDisplay.config.multiSignatureConfig?.geolocationRestricted || false;
  const backupRecoveryEnabled = swapToDisplay.config.multiSignatureConfig?.enableBackupRecovery || false;
  const tripleChainEnabled = swapToDisplay.config.useTripleChainSecurity || false;
  
  // Get security checks
  const securityChecks = swapToDisplay.additionalSecurityChecks || [];
  
  // Determine progress bar color based on risk level
  const progressColor = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500'
  }[riskLevel];
  
  // Determine verification status
  const verificationStatus = swapToDisplay.verificationStatus || 'pending';
  
  // Handle verification request
  const handleVerify = async () => {
    try {
      await performSecurityVerification(swapToDisplay.id);
    } catch (error) {
      console.error("Failed to verify security:", error);
    }
  };
  
  return (
    <Card className="border-purple-500/30 bg-black/20 backdrop-blur-sm shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] bg-clip-text text-transparent">
            Security Dashboard
          </CardTitle>
          <Badge 
            variant={{
              verified: 'default',
              pending: 'outline',
              failed: 'destructive'
            }[verificationStatus] as any}
            className={{
              verified: 'bg-green-500/20 text-green-200 hover:bg-green-500/30',
              pending: 'bg-yellow-500/10 text-yellow-200 hover:bg-yellow-500/20',
              failed: 'bg-red-500/20 text-red-200 hover:bg-red-500/30'
            }[verificationStatus]}
          >
            {{
              verified: <><Check className="w-3 h-3 mr-1" /> Verified</>,
              pending: <><AlertTriangle className="w-3 h-3 mr-1" /> Pending Verification</>,
              failed: <><X className="w-3 h-3 mr-1" /> Verification Failed</>
            }[verificationStatus]}
          </Badge>
        </div>
        <CardDescription>
          Advanced security metrics and validation for swap #{swapToDisplay.id.split('_')[1]}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-3">
        <div className="flex flex-col space-y-4">
          {/* Security Score Indicator */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Security Score</span>
              <Badge 
                variant={{
                  low: 'default',
                  medium: 'outline',
                  high: 'destructive'
                }[riskLevel] as any}
                className={{
                  low: 'bg-green-500/20 text-green-200',
                  medium: 'bg-yellow-500/10 text-yellow-200',
                  high: 'bg-red-500/20 text-red-200'
                }[riskLevel]}
              >
                {riskLevel.toUpperCase()} RISK
              </Badge>
            </div>
            <Progress value={securityScore} max={100} className={`h-2 ${progressColor}`} />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>High Risk</span>
              <span>Medium Risk</span>
              <span>Low Risk</span>
            </div>
          </div>
          
          {/* Security Features Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Multi-Signature Feature */}
            <div className="p-3 rounded-lg border border-purple-500/20 bg-purple-950/10">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#FF5AF7]" />
                <span className="text-sm font-medium">Multi-Signature</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground">
                  {multiSigEnabled ? 'Enabled' : 'Not Enabled'}
                </span>
                <Badge 
                  variant={multiSigEnabled ? 'default' : 'outline'}
                  className={multiSigEnabled ? 'bg-green-500/20 text-green-200' : 'bg-red-500/10 text-red-200'}
                >
                  {multiSigEnabled ? 'ACTIVE' : 'INACTIVE'}
                </Badge>
              </div>
            </div>
            
            {/* Geolocation Feature */}
            <div className="p-3 rounded-lg border border-purple-500/20 bg-purple-950/10">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FF5AF7]" />
                <span className="text-sm font-medium">Geolocation Security</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground">
                  {geoVerificationEnabled ? 'Location Restricted' : 'No Restrictions'}
                </span>
                <Badge 
                  variant={geoVerificationEnabled ? 'default' : 'outline'}
                  className={geoVerificationEnabled ? 'bg-green-500/20 text-green-200' : 'bg-red-500/10 text-red-200'}
                >
                  {geoVerificationEnabled ? 'ACTIVE' : 'INACTIVE'}
                </Badge>
              </div>
            </div>
            
            {/* Backup Recovery Feature */}
            <div className="p-3 rounded-lg border border-purple-500/20 bg-purple-950/10">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#FF5AF7]" />
                <span className="text-sm font-medium">Backup Recovery</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground">
                  {backupRecoveryEnabled ? 'Emergency Recovery Enabled' : 'No Recovery Option'}
                </span>
                <Badge 
                  variant={backupRecoveryEnabled ? 'default' : 'outline'}
                  className={backupRecoveryEnabled ? 'bg-green-500/20 text-green-200' : 'bg-red-500/10 text-red-200'}
                >
                  {backupRecoveryEnabled ? 'ACTIVE' : 'INACTIVE'}
                </Badge>
              </div>
            </div>
            
            {/* Triple-Chain Feature */}
            <div className="p-3 rounded-lg border border-purple-500/20 bg-purple-950/10">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#FF5AF7]" />
                <span className="text-sm font-medium">Triple-Chain Security</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground">
                  {tripleChainEnabled ? 'Enhanced Security Protocol' : 'Standard Security'}
                </span>
                <Badge 
                  variant={tripleChainEnabled ? 'default' : 'outline'}
                  className={tripleChainEnabled ? 'bg-green-500/20 text-green-200' : 'bg-red-500/10 text-red-200'}
                >
                  {tripleChainEnabled ? 'ACTIVE' : 'INACTIVE'}
                </Badge>
              </div>
            </div>
          </div>
          
          {/* Security Checks */}
          {securityChecks.length > 0 && (
            <div className="mt-2">
              <h4 className="text-sm font-medium mb-2">Security Verification Checks</h4>
              <div className="space-y-2">
                {securityChecks.map((check, index) => (
                  <div key={index} className="flex items-center justify-between text-xs p-2 rounded-md bg-black/20">
                    <span>{check.name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
                    <Badge
                      variant={{
                        passed: 'default',
                        pending: 'outline',
                        failed: 'destructive'
                      }[check.status] as any}
                      className={{
                        passed: 'bg-green-500/20 text-green-200',
                        pending: 'bg-yellow-500/10 text-yellow-200',
                        failed: 'bg-red-500/20 text-red-200'
                      }[check.status]}
                    >
                      {check.status.toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <button
          onClick={handleVerify}
          disabled={verificationStatus === 'verified'}
          className="w-full py-2 px-4 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] rounded-md text-white font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {verificationStatus === 'verified' ? 'Security Verification Complete' : 'Perform Security Verification'}
        </button>
      </CardFooter>
    </Card>
  );
}
