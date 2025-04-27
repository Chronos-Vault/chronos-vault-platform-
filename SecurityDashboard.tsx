import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  AlertCircle,
  Lock,
  Fingerprint,
  Users,
  Eye,
  RefreshCw,
  Activity,
  Server,
  Database,
  Network,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { securityServiceAggregator } from '@/lib/cross-chain/SecurityServiceAggregator';
import { SecurityIncident } from '@/lib/cross-chain/SecurityIncidentResponseService';
import { MonitoringAlert } from '@/lib/cross-chain/TransactionMonitoringService';
import { AnomalyDetectionResult } from '@/lib/cross-chain/AnomalyDetectionService';
import { SecureTransferRequest } from '@/lib/cross-chain/SecureCrossChainService';
import { SignatureRequest } from '@/lib/cross-chain/MultiSignatureService';
import { BlockchainType } from '@/lib/cross-chain/interfaces';

interface SecurityDashboardProps {
  address?: string;
  blockchain?: BlockchainType;
  showFullDashboard?: boolean;
}

export default function SecurityDashboard({ 
  address, 
  blockchain = 'TON',
  showFullDashboard = false
}: SecurityDashboardProps) {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [securityModulesStatus, setSecurityModulesStatus] = useState<Record<string, {
    operational: boolean;
    lastCheckTime: number;
    errorCount: number;
  }>>({});
  const [criticalIncidents, setCriticalIncidents] = useState<SecurityIncident[]>([]);
  const [pendingSignatures, setPendingSignatures] = useState<SignatureRequest[]>([]);
  const [highRiskTransfers, setHighRiskTransfers] = useState<SecureTransferRequest[]>([]);
  const [activeAlerts, setActiveAlerts] = useState<MonitoringAlert[]>([]);
  const [highSeverityAnomalies, setHighSeverityAnomalies] = useState<AnomalyDetectionResult[]>([]);
  const [addressReport, setAddressReport] = useState<{
    isValid: boolean;
    isBlacklisted: boolean;
    threatIndicators: any[];
    transactionHistory: any[];
    securityIncidents: SecurityIncident[];
    riskScore: number;
    riskFactors: string[];
  } | null>(null);
  
  // Load security data
  useEffect(() => {
    loadSecurityData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(() => {
      loadSecurityData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Load address report if address is provided
  useEffect(() => {
    if (address && blockchain) {
      loadAddressReport(address, blockchain);
    }
  }, [address, blockchain]);
  
  const loadSecurityData = () => {
    // Get security modules status
    setSecurityModulesStatus(securityServiceAggregator.getSecurityModulesStatus());
    
    // Get critical incidents
    setCriticalIncidents(securityServiceAggregator.getCriticalSecurityIncidents());
    
    // Get pending signatures
    setPendingSignatures(securityServiceAggregator.getPendingMultiSignatureRequests());
    
    // Get high risk transfers
    setHighRiskTransfers(securityServiceAggregator.getHighRiskTransfers());
    
    // Get active alerts
    setActiveAlerts(securityServiceAggregator.getActiveSecurityAlerts());
    
    // Get high severity anomalies
    setHighSeverityAnomalies(securityServiceAggregator.getHighSeverityAnomalies());
  };
  
  const loadAddressReport = (address: string, blockchain: BlockchainType) => {
    setAddressReport(securityServiceAggregator.getAddressSecurityReport(address, blockchain));
  };
  
  // Render security status indicator
  const renderSecurityStatus = () => {
    const allOperational = Object.values(securityModulesStatus)
      .every(status => status.operational);
    
    const hasCriticalIncidents = criticalIncidents.length > 0;
    const hasPendingSignatures = pendingSignatures.length > 0;
    
    if (hasCriticalIncidents) {
      return (
        <div className="flex items-center">
          <ShieldAlert className="h-5 w-5 text-red-500 mr-2" />
          <span className="font-medium text-red-500">Critical Security Incidents</span>
        </div>
      );
    } else if (!allOperational) {
      return (
        <div className="flex items-center">
          <ShieldAlert className="h-5 w-5 text-amber-500 mr-2" />
          <span className="font-medium text-amber-500">Security Modules Degraded</span>
        </div>
      );
    } else if (hasPendingSignatures) {
      return (
        <div className="flex items-center">
          <Shield className="h-5 w-5 text-amber-500 mr-2" />
          <span className="font-medium text-amber-500">Pending Security Approvals</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center">
          <ShieldCheck className="h-5 w-5 text-green-500 mr-2" />
          <span className="font-medium text-green-500">Security Systems Operational</span>
        </div>
      );
    }
  };
  
  // Render badge for risk level
  const renderRiskBadge = (score: number) => {
    if (score < 30) {
      return (
        <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
          <ShieldCheck className="h-3 w-3 mr-1" />
          Low Risk
        </Badge>
      );
    } else if (score < 60) {
      return (
        <Badge variant="outline" className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800">
          <Shield className="h-3 w-3 mr-1" />
          Medium Risk
        </Badge>
      );
    } else if (score < 80) {
      return (
        <Badge variant="outline" className="bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800">
          <AlertTriangle className="h-3 w-3 mr-1" />
          High Risk
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800">
          <ShieldAlert className="h-3 w-3 mr-1" />
          Critical Risk
        </Badge>
      );
    }
  };
  
  // Format date for display
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };
  
  // Render security matrix (overview of all security systems)
  const renderSecurityMatrix = () => {
    const moduleIcons: Record<string, React.ReactNode> = {
      'validation': <Shield className="h-4 w-4" />,
      'multisig': <Users className="h-4 w-4" />,
      'monitoring': <Activity className="h-4 w-4" />,
      'zkproof': <Fingerprint className="h-4 w-4" />,
      'hsm': <Database className="h-4 w-4" />,
      'threat-intel': <AlertCircle className="h-4 w-4" />,
      'anomaly-detection': <AlertTriangle className="h-4 w-4" />,
      'incident-response': <Shield className="h-4 w-4" />
    };
    
    const moduleNames: Record<string, string> = {
      'validation': 'Validation Service',
      'multisig': 'Multi-Signature',
      'monitoring': 'Transaction Monitoring',
      'zkproof': 'Zero-Knowledge Proofs',
      'hsm': 'Hardware Security Module',
      'threat-intel': 'Threat Intelligence',
      'anomaly-detection': 'Anomaly Detection',
      'incident-response': 'Incident Response'
    };
    
    return (
      <Table>
        <TableCaption>Security module status</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Module</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Check</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(securityModulesStatus).map(([moduleId, status]) => (
            <TableRow key={moduleId}>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  {moduleIcons[moduleId]}
                  <span className="ml-2">{moduleNames[moduleId]}</span>
                </div>
              </TableCell>
              <TableCell>
                {status.operational ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Operational
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <XCircle className="h-4 w-4 mr-1" />
                    Degraded
                  </div>
                )}
              </TableCell>
              <TableCell>{formatDate(status.lastCheckTime)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };
  
  // Render active incidents
  const renderActiveIncidents = () => {
    if (criticalIncidents.length === 0) {
      return (
        <div className="p-4 text-center text-gray-500">
          No critical incidents at this time
        </div>
      );
    }
    
    return (
      <Accordion type="single" collapsible className="w-full">
        {criticalIncidents.map(incident => (
          <AccordionItem key={incident.id} value={incident.id}>
            <AccordionTrigger>
              <div className="flex items-center">
                <ShieldAlert className="h-4 w-4 text-red-500 mr-2" />
                <span>{incident.description}</span>
                <Badge className="ml-2" variant="destructive">
                  {incident.severity.toUpperCase()}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Status:</span> {incident.status}
                </div>
                <div>
                  <span className="font-medium">Created:</span> {formatDate(incident.timestamp)}
                </div>
                <div>
                  <span className="font-medium">Details:</span> {incident.details}
                </div>
                {incident.sourceAddress && (
                  <div>
                    <span className="font-medium">Source Address:</span> {incident.sourceAddress}
                  </div>
                )}
                {incident.targetAddress && (
                  <div>
                    <span className="font-medium">Target Address:</span> {incident.targetAddress}
                  </div>
                )}
                <div className="pt-2">
                  <span className="font-medium">Mitigation Steps:</span>
                  <ul className="list-disc pl-5 mt-1">
                    {incident.mitigationSteps.map(step => (
                      <li key={step.id} className="text-sm mb-1">
                        {step.action} - 
                        <span className={
                          step.status === 'completed' ? 'text-green-600' :
                          step.status === 'in-progress' ? 'text-blue-600' :
                          step.status === 'failed' ? 'text-red-600' :
                          'text-gray-600'
                        }>
                          {' '}{step.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  };
  
  // Render pending signatures
  const renderPendingSignatures = () => {
    if (pendingSignatures.length === 0) {
      return (
        <div className="p-4 text-center text-gray-500">
          No pending signatures at this time
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {pendingSignatures.map(request => (
          <Card key={request.id} className="overflow-hidden">
            <CardHeader className="bg-amber-50 dark:bg-amber-900/20 py-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <Users className="h-4 w-4 mr-2 text-amber-600" />
                Multi-Signature Request
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 text-sm">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="font-medium">Amount:</span>
                  <span>{request.amount} {request.token}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">From:</span>
                  <span className="truncate max-w-[200px]">{request.sourceAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">To:</span>
                  <span className="truncate max-w-[200px]">{request.targetAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Signatures:</span>
                  <span>{request.currentSignatures.length} / {request.requiredSignatures}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Expiration:</span>
                  <span>{formatDate(request.expiration)}</span>
                </div>
              </div>
              
              <div className="mt-4">
                <Progress value={(request.currentSignatures.length / request.requiredSignatures) * 100} className="h-2" />
              </div>
              
              {request.currentSignatures.length > 0 && (
                <div className="mt-4">
                  <div className="font-medium mb-1">Current Signers:</div>
                  <div className="space-y-1">
                    {request.currentSignatures.map(sig => (
                      <div key={sig.signer} className="flex justify-between text-xs">
                        <span>{sig.signer}</span>
                        <span>{formatDate(sig.timestamp)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-gray-50 dark:bg-gray-800/20 py-3 px-4">
              <Button variant="outline" className="w-full" size="sm">
                <Fingerprint className="h-4 w-4 mr-2" />
                Sign Request
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };
  
  // Render address security report
  const renderAddressReport = () => {
    if (!addressReport) {
      return (
        <div className="p-4 text-center text-gray-500">
          No address data available
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Address Security Report</h3>
          {addressReport.isBlacklisted ? (
            <Badge variant="destructive">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Blacklisted
            </Badge>
          ) : (
            renderRiskBadge(addressReport.riskScore)
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <Progress value={addressReport.riskScore} className="h-2" />
          </div>
          <span className="text-sm font-medium whitespace-nowrap">
            Risk Score: {addressReport.riskScore}/100
          </span>
        </div>
        
        {addressReport.riskFactors.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Risk Factors:</h4>
            <ul className="space-y-1 text-sm">
              {addressReport.riskFactors.map((factor, index) => (
                <li key={index} className="flex items-start">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mt-0.5 mr-1.5" />
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {addressReport.threatIndicators.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Threat Intelligence:</h4>
            <ul className="space-y-1 text-sm">
              {addressReport.threatIndicators.map((indicator, index) => (
                <li key={index} className="flex items-start">
                  <AlertCircle className="h-3.5 w-3.5 text-red-500 mt-0.5 mr-1.5" />
                  <span>
                    <span className="font-medium">{indicator.threatType}</span>: {indicator.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {addressReport.securityIncidents.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Security Incidents:</h4>
            <ul className="space-y-1 text-sm">
              {addressReport.securityIncidents.map((incident, index) => (
                <li key={index} className="flex items-start">
                  <ShieldAlert className="h-3.5 w-3.5 text-red-500 mt-0.5 mr-1.5" />
                  <span>
                    <span className="font-medium">{incident.type}</span>: {incident.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="pt-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Transaction History:</span>
            <span>{addressReport.transactionHistory.length} transactions</span>
          </div>
        </div>
      </div>
    );
  };

  // Compact view for showing in sidebars
  if (!showFullDashboard) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-md font-semibold flex items-center">
            <Lock className="h-4 w-4 mr-2 text-primary" />
            Security Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              {renderSecurityStatus()}
              <Button variant="ghost" size="icon" onClick={loadSecurityData}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            
            {criticalIncidents.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md text-sm text-red-700 dark:text-red-300">
                <div className="font-medium flex items-center mb-1">
                  <ShieldAlert className="h-4 w-4 mr-1.5" />
                  Critical Security Alerts
                </div>
                <div>
                  {criticalIncidents.length} critical incident{criticalIncidents.length !== 1 ? 's' : ''} detected.
                </div>
              </div>
            )}
            
            {pendingSignatures.length > 0 && (
              <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md text-sm text-amber-700 dark:text-amber-300">
                <div className="font-medium flex items-center mb-1">
                  <Users className="h-4 w-4 mr-1.5" />
                  Pending Approvals
                </div>
                <div>
                  {pendingSignatures.length} transaction{pendingSignatures.length !== 1 ? 's' : ''} require{pendingSignatures.length === 1 ? 's' : ''} authorization.
                </div>
              </div>
            )}
            
            {address && addressReport && (
              <div className="border-t border-gray-200 dark:border-gray-800 pt-3 mt-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Address Risk Score</h3>
                  {renderRiskBadge(addressReport.riskScore)}
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="flex-1">
                    <Progress value={addressReport.riskScore} className="h-2" />
                  </div>
                  <span className="text-xs font-medium whitespace-nowrap">
                    {addressReport.riskScore}/100
                  </span>
                </div>
                
                {addressReport.riskFactors.length > 0 && (
                  <div className="mt-2">
                    <ul className="space-y-1">
                      {addressReport.riskFactors.slice(0, 2).map((factor, index) => (
                        <li key={index} className="flex items-start text-xs">
                          <AlertTriangle className="h-3 w-3 text-amber-500 mt-0.5 mr-1" />
                          <span>{factor}</span>
                        </li>
                      ))}
                      {addressReport.riskFactors.length > 2 && (
                        <li className="text-xs text-gray-500">
                          + {addressReport.riskFactors.length - 2} more risk factors
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Full dashboard view
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Security Dashboard</h2>
        <Button variant="outline" size="sm" className="gap-1" onClick={loadSecurityData}>
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Shield className="h-5 w-5 mr-2 text-primary" />
              Security Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="py-2">{renderSecurityStatus()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-primary" />
              Critical Incidents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="py-2">
              {criticalIncidents.length === 0 ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  No critical incidents
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <ShieldAlert className="h-4 w-4 mr-2" />
                  {criticalIncidents.length} critical incident{criticalIncidents.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Lock className="h-5 w-5 mr-2 text-primary" />
              Pending Signatures
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="py-2">
              {pendingSignatures.length === 0 ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  No pending signatures
                </div>
              ) : (
                <div className="flex items-center text-amber-600">
                  <Users className="h-4 w-4 mr-2" />
                  {pendingSignatures.length} pending signature{pendingSignatures.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
          <TabsTrigger value="signatures">Multi-Signature</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="address">Address Report</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Matrix</CardTitle>
              <CardDescription>
                Status of all security modules in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderSecurityMatrix()}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="incidents" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Critical Security Incidents</CardTitle>
              <CardDescription>
                Incidents requiring immediate attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderActiveIncidents()}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="signatures" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Multi-Signature Requests</CardTitle>
              <CardDescription>
                Transactions requiring additional approvals
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderPendingSignatures()}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="alerts" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Alerts</CardTitle>
              <CardDescription>
                Recent security alerts from monitoring systems
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeAlerts.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No active alerts at this time
                </div>
              ) : (
                <div className="space-y-4">
                  {activeAlerts.map(alert => (
                    <div key={alert.id} className="p-3 border border-gray-200 dark:border-gray-800 rounded-md">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start">
                          {alert.severity === 'critical' ? (
                            <ShieldAlert className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                          ) : alert.severity === 'high' ? (
                            <AlertTriangle className="h-5 w-5 text-orange-500 mr-2 mt-0.5" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                          )}
                          <div>
                            <div className="font-medium">
                              {alert.alertType.replace('_', ' ')}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {alert.details}
                            </div>
                          </div>
                        </div>
                        <Badge 
                          variant={
                            alert.severity === 'critical' ? 'destructive' :
                            alert.severity === 'high' ? 'destructive' :
                            alert.severity === 'medium' ? 'outline' : 'secondary'
                          }
                        >
                          {alert.severity}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        {formatDate(alert.timestamp)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="address" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Address Security Report</CardTitle>
              <CardDescription>
                Comprehensive security analysis for blockchain addresses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderAddressReport()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}