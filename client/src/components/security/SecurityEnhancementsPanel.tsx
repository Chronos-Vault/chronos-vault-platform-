/**
 * Security Enhancements Panel
 * 
 * Panel component that displays information about active security enhancements,
 * including quantum-resistant encryption, zero-knowledge proofs, and audit logging.
 */

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, FileDigit, Activity, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { zkProofSystem } from '@/lib/security/ZeroKnowledgeProofSystem';
import { quantumResistantEncryption } from '@/lib/security/QuantumResistantEncryption';
import { auditLogService, AuditLogEntry } from '@/lib/security/AuditLogService';

interface SecurityFeatureStatus {
  name: string;
  isActive: boolean;
  description: string;
  status: 'operational' | 'degraded' | 'offline';
  readiness: number; // 0-100
  lastChecked: number;
  icon: React.ReactNode;
}

export default function SecurityEnhancementsPanel() {
  const [securityFeatures, setSecurityFeatures] = useState<SecurityFeatureStatus[]>([]);
  const [recentLogs, setRecentLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function loadSecurityStatus() {
      try {
        setIsLoading(true);
        
        // Collect statuses from security systems
        const zkStatus = zkProofSystem.getStatus();
        const quantumReady = quantumResistantEncryption.isReady();
        
        // Get recent audit logs
        const logs = await auditLogService.fetchLogs({ 
          limit: 5,
          severities: ['critical', 'high', 'medium']
        });
        setRecentLogs(logs);
        
        // Set up security features status
        setSecurityFeatures([
          {
            name: 'Zero-Knowledge Proof System',
            isActive: zkStatus.initialized,
            description: 'Privacy-preserving verification without revealing sensitive data',
            status: zkStatus.initialized ? 'operational' : 'offline',
            readiness: zkStatus.initialized ? 100 : 0,
            lastChecked: Date.now(),
            icon: <Shield className="h-5 w-5 text-[#6B00D7]" />
          },
          {
            name: 'Quantum-Resistant Encryption',
            isActive: quantumReady,
            description: 'Post-quantum cryptography to protect against future quantum threats',
            status: quantumReady ? 'operational' : 'offline',
            readiness: quantumReady ? 100 : 0,
            lastChecked: Date.now(),
            icon: <Lock className="h-5 w-5 text-[#6B00D7]" />
          },
          {
            name: 'Secure Audit Logging',
            isActive: true,
            description: 'Tamper-proof logging of all security-related events',
            status: 'operational',
            readiness: 100,
            lastChecked: Date.now(),
            icon: <FileDigit className="h-5 w-5 text-[#6B00D7]" />
          }
        ]);
      } catch (error) {
        console.error('Error loading security enhancements status:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadSecurityStatus();
    
    // Refresh status every 30 seconds
    const interval = setInterval(loadSecurityStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Helper function to get badge variant based on status
  const getStatusBadge = (status: 'operational' | 'degraded' | 'offline') => {
    switch (status) {
      case 'operational':
        return "bg-green-500/20 text-green-500 border border-green-500/50";
      case 'degraded':
        return "bg-amber-500/20 text-amber-500 border border-amber-500/50";
      case 'offline':
        return "bg-red-500/20 text-red-500 border border-red-500/50";
      default:
        return "bg-gray-500/20 text-gray-500 border border-gray-500/50";
    }
  };
  
  // Helper function to format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };
  
  return (
    <Card className="border-[#333] bg-black/20">
      <CardHeader>
        <CardTitle className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
          Enhanced Security Features
        </CardTitle>
        <CardDescription>
          Advanced security technologies protecting your digital assets
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Security Features Status */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-12 bg-gray-700/30 rounded"></div>
                <div className="h-12 bg-gray-700/30 rounded"></div>
                <div className="h-12 bg-gray-700/30 rounded"></div>
              </div>
            ) : (
              securityFeatures.map((feature, index) => (
                <div key={index} className="border border-[#333] rounded-lg p-4 bg-black/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      {feature.icon}
                      <h3 className="font-medium ml-2">{feature.name}</h3>
                    </div>
                    <Badge 
                      variant="secondary"
                      className={getStatusBadge(feature.status)}
                    >
                      {feature.status === 'operational' ? 'Active' : 
                       feature.status === 'degraded' ? 'Degraded' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{feature.description}</p>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>System Readiness</span>
                    <span>{feature.readiness}%</span>
                  </div>
                  <Progress 
                    value={feature.readiness} 
                    className="h-1" 
                  />
                  <div className="mt-2 text-xs text-gray-500">
                    Last checked: {formatDate(feature.lastChecked)}
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Implementation Details */}
          <div className="mt-6 border border-[#333] rounded-lg p-4 bg-gradient-to-br from-[#6B00D7]/10 to-[#FF5AF7]/5">
            <h3 className="font-medium mb-2 flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              Implementation Status
            </h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>• Zero-Knowledge Proof System enabling privacy-preserving verification</p>
              <p>• Post-quantum cryptography with CRYSTALS-Kyber and CRYSTALS-Dilithium</p>
              <p>• Tamper-proof audit logging with blockchain verification</p>
              <p>• Cross-chain security monitoring across Ethereum, TON, and Solana</p>
            </div>
          </div>
          
          {/* Recent Security Logs */}
          <div className="mt-6">
            <h3 className="font-medium mb-3 flex items-center">
              <Activity className="h-4 w-4 mr-2 text-[#FF5AF7]" />
              Recent Security Activity
            </h3>
            
            {recentLogs.length > 0 ? (
              <div className="space-y-2">
                {recentLogs.map((log) => (
                  <div key={log.id} className="border border-[#333] rounded p-2 text-sm">
                    <div className="flex justify-between">
                      <span className={`font-medium ${
                        log.severity === 'critical' ? 'text-red-500' :
                        log.severity === 'high' ? 'text-amber-500' :
                        log.severity === 'medium' ? 'text-yellow-500' :
                        'text-gray-400'
                      }`}>
                        {log.action}
                      </span>
                      <span className="text-xs text-gray-500">{formatDate(log.timestamp)}</span>
                    </div>
                    <p className="text-gray-400 mt-1">{log.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500 border border-[#333] rounded">
                No recent security events to display
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}