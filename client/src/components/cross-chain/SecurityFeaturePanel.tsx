/**
 * SecurityFeaturePanel Component
 * 
 * This component displays the various security features of atomic swaps with visualizations
 */

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Users,
  Globe,
  Clock,
  Lock,
  Key,
  AlertCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";

interface SecurityFeaturePanelProps {
  securityScore?: number;
  riskAssessment?: 'low' | 'medium' | 'high';
  securityLevel?: 'standard' | 'enhanced' | 'max';
  useMultiSig?: boolean;
  requiredSignatures?: number;
  signaturesCollected?: number;
  useTripleChainSecurity?: boolean;
  useBackupRecovery?: boolean;
  geolocationRestricted?: boolean;
  geoVerified?: boolean;
  verificationStatus?: 'pending' | 'verified' | 'failed';
  additionalSecurityChecks?: Array<{name: string, status: 'passed' | 'failed' | 'pending', timestamp: number}>;
}

export function SecurityFeaturePanel({
  securityScore = 50,
  riskAssessment = 'medium',
  securityLevel = 'standard',
  useMultiSig = false,
  requiredSignatures = 0,
  signaturesCollected = 0,
  useTripleChainSecurity = false,
  useBackupRecovery = false,
  geolocationRestricted = false,
  geoVerified = false,
  verificationStatus = 'pending',
  additionalSecurityChecks = [],
}: SecurityFeaturePanelProps) {
  
  // Calculate progress color based on security score
  const getProgressColor = () => {
    if (securityScore >= 80) return "bg-green-500";
    if (securityScore >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  // Get assessment badge properties
  const getAssessmentBadge = () => {
    if (riskAssessment === 'low') {
      return { color: "bg-green-500", text: "Low Risk" };
    } else if (riskAssessment === 'medium') {
      return { color: "bg-yellow-500", text: "Medium Risk" };
    } else {
      return { color: "bg-red-500", text: "High Risk" };
    }
  };
  
  // Get verification status badge properties
  const getVerificationBadge = () => {
    if (verificationStatus === 'verified') {
      return { color: "bg-green-500", icon: <CheckCircle2 className="h-3 w-3" />, text: "Verified" };
    } else if (verificationStatus === 'pending') {
      return { color: "bg-yellow-500", icon: <AlertTriangle className="h-3 w-3" />, text: "Pending Verification" };
    } else {
      return { color: "bg-red-500", icon: <XCircle className="h-3 w-3" />, text: "Verification Failed" };
    }
  };
  
  // Get security level badge properties
  const getSecurityLevelBadge = () => {
    if (securityLevel === 'max') {
      return { color: "bg-purple-700", text: "Maximum Security" };
    } else if (securityLevel === 'enhanced') {
      return { color: "bg-[#FF5AF7]", text: "Enhanced Security" };
    } else {
      return { color: "bg-blue-600", text: "Standard Security" };
    }
  };
  
  const assessmentBadge = getAssessmentBadge();
  const verificationBadge = getVerificationBadge();
  const securityLevelBadge = getSecurityLevelBadge();
  
  return (
    <Card className="border border-[#FF5AF7]/20 bg-gradient-to-r from-[#1A1A1A] to-[#231A2A]">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center mb-1">
          <CardTitle className="text-xl text-[#FF5AF7] font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Assessment
          </CardTitle>
          <Badge className={`${securityLevelBadge.color} text-white`}>
            {securityLevelBadge.text}
          </Badge>
        </div>
        <CardDescription className="text-gray-300">
          Comprehensive security analysis for your cross-chain atomic swap
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Security Score */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Security Score</h3>
            <Badge className={`${assessmentBadge.color} text-white`}>
              {assessmentBadge.text}
            </Badge>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-400">
              <span>0</span>
              <span>50</span>
              <span>100</span>
            </div>
            <Progress value={securityScore} className={getProgressColor()} />
            <div className="flex justify-center">
              <span className="text-sm font-semibold">{securityScore}/100</span>
            </div>
          </div>
        </div>
        
        {/* Security Verification Status */}
        <div className="p-3 bg-black/30 border border-[#FF5AF7]/20 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Verification Status</h3>
            <Badge className={`${verificationBadge.color} text-white`}>
              {verificationBadge.icon}
              <span className="ml-1">{verificationBadge.text}</span>
            </Badge>
          </div>
          
          <div className="space-y-3 mt-2">
            {/* Security Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* Multi-signature */}
              <div className={`flex items-center p-2 rounded-md ${useMultiSig ? 'bg-green-950/20 border border-green-500/30' : 'bg-gray-900/50 border border-gray-700/30'}`}>
                <Users className={`h-4 w-4 mr-2 ${useMultiSig ? 'text-green-500' : 'text-gray-500'}`} />
                <div>
                  <p className="text-xs font-medium">
                    Multi-signature Protection
                    {useMultiSig && requiredSignatures > 0 && (
                      <span className="ml-1 text-green-400">
                        ({signaturesCollected}/{requiredSignatures})
                      </span>
                    )}
                  </p>
                </div>
              </div>
              
              {/* Triple Chain Security */}
              <div className={`flex items-center p-2 rounded-md ${useTripleChainSecurity ? 'bg-green-950/20 border border-green-500/30' : 'bg-gray-900/50 border border-gray-700/30'}`}>
                <Lock className={`h-4 w-4 mr-2 ${useTripleChainSecurity ? 'text-green-500' : 'text-gray-500'}`} />
                <div>
                  <p className="text-xs font-medium">Triple-Chain Security</p>
                </div>
              </div>
              
              {/* Backup Recovery */}
              <div className={`flex items-center p-2 rounded-md ${useBackupRecovery ? 'bg-green-950/20 border border-green-500/30' : 'bg-gray-900/50 border border-gray-700/30'}`}>
                <Key className={`h-4 w-4 mr-2 ${useBackupRecovery ? 'text-green-500' : 'text-gray-500'}`} />
                <div>
                  <p className="text-xs font-medium">Backup Recovery</p>
                </div>
              </div>
              
              {/* Geolocation Verification */}
              <div className={`flex items-center p-2 rounded-md ${geolocationRestricted ? (geoVerified ? 'bg-green-950/20 border border-green-500/30' : 'bg-yellow-950/20 border border-yellow-500/30') : 'bg-gray-900/50 border border-gray-700/30'}`}>
                <Globe className={`h-4 w-4 mr-2 ${geolocationRestricted ? (geoVerified ? 'text-green-500' : 'text-yellow-500') : 'text-gray-500'}`} />
                <div>
                  <p className="text-xs font-medium">
                    Geolocation Verification
                    {geolocationRestricted && (
                      <span className={`ml-1 ${geoVerified ? 'text-green-400' : 'text-yellow-400'}`}>
                        {geoVerified ? '(Verified)' : '(Pending)'}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Additional Security Checks */}
            {additionalSecurityChecks.length > 0 && (
              <div className="mt-3">
                <h4 className="text-xs font-medium mb-2">Security Verification Checks</h4>
                <div className="space-y-1">
                  {additionalSecurityChecks.map((check, index) => (
                    <div key={index} className="flex items-center justify-between text-xs p-1 border-b border-gray-800">
                      <span>{check.name}</span>
                      <Badge 
                        variant="outline" 
                        className={
                          check.status === 'passed' ? 'bg-green-900/20 text-green-400 border-green-700/50' :
                          check.status === 'pending' ? 'bg-yellow-900/20 text-yellow-400 border-yellow-700/50' :
                          'bg-red-900/20 text-red-400 border-red-700/50'
                        }
                      >
                        {check.status.charAt(0).toUpperCase() + check.status.slice(1)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Warning Note */}
        {securityScore < 70 && (
          <div className="flex items-start space-x-2 p-3 bg-red-950/20 border border-red-500/20 rounded-md">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-red-200">
                This atomic swap has a low security score. Consider enabling additional security features like multi-signature protection and backup recovery to enhance security.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default SecurityFeaturePanel;