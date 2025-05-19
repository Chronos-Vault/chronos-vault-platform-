import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Shield,
  Check,
  Lock,
  Key,
  Cpu,
  Database,
  Server,
  Network,
  ShieldAlert,
  ShieldCheck,
  Code,
  RefreshCw,
  ExternalLink,
  ArrowUpRight,
  Zap,
  Loader2,
  BarChart3,
  Layers,
  Clock,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { cn } from "@/lib/utils";

// Simulated quantum security assessment data
const securityScores = {
  overall: 87,
  algorithms: 92,
  keyManagement: 85,
  implementation: 83,
  crossChainProtection: 89,
};

// Simulated advanced protection features
const protectionFeatures = [
  {
    id: "lattice",
    name: "Lattice-Based Cryptography",
    enabled: true,
    strength: 95,
    description: "Using mathematical lattice problems resistant to quantum computing attacks",
    algorithm: "CRYSTALS-Kyber",
    status: "active"
  },
  {
    id: "hash",
    name: "Hash-Based Signatures",
    enabled: true,
    strength: 88,
    description: "Post-quantum digital signatures based on secure hash function properties",
    algorithm: "SPHINCS+",
    status: "active"
  },
  {
    id: "multivariate",
    name: "Multivariate Cryptography",
    enabled: false,
    strength: 78,
    description: "Based on difficulty of solving systems of multivariate equations",
    algorithm: "Rainbow",
    status: "disabled"
  },
  {
    id: "isogeny",
    name: "Isogeny-Based Cryptography",
    enabled: true,
    strength: 86,
    description: "Uses relationships between different elliptic curves for security",
    algorithm: "SIKE",
    status: "active"
  },
  {
    id: "code",
    name: "Code-Based Cryptography",
    enabled: true,
    strength: 91,
    description: "Based on difficulty of decoding linear codes without knowing the code structure",
    algorithm: "Classic McEliece",
    status: "active"
  }
];

// Simulated recent quantum threats detected
const recentThreats = [
  {
    id: "threat-1",
    type: "Grover's Algorithm Attack",
    timestamp: "2025-05-19T15:23:42Z",
    severity: "high",
    status: "mitigated",
    details: "Attempt to use Grover's algorithm to break symmetric key encryption detected and blocked"
  },
  {
    id: "threat-2",
    type: "Shor's Algorithm Simulation",
    timestamp: "2025-05-18T09:12:17Z",
    severity: "critical",
    status: "mitigated",
    details: "Simulated Shor's algorithm attempt against RSA keys detected, quantum-resistant fallback engaged"
  },
  {
    id: "threat-3",
    type: "Quantum Side-Channel Analysis",
    timestamp: "2025-05-17T22:34:09Z",
    severity: "medium",
    status: "investigating",
    details: "Potential side-channel information leakage during key rotation, investigating vulnerability"
  }
];

// Simulated vault assets protected by quantum-resistant encryption
const protectedVaults = [
  {
    id: "vault-qr-1",
    name: "Primary ETH Holdings",
    assetType: "ETH",
    quantumProtected: true,
    lastUpdated: "2025-05-19T12:00:00Z"
  },
  {
    id: "vault-qr-2",
    name: "Multi-chain Reserve",
    assetType: "Multi",
    quantumProtected: true,
    lastUpdated: "2025-05-19T10:30:00Z"
  },
  {
    id: "vault-qr-3",
    name: "Cold Storage Backup",
    assetType: "BTC",
    quantumProtected: true,
    lastUpdated: "2025-05-18T16:45:00Z"
  },
  {
    id: "vault-qr-4",
    name: "Development Fund",
    assetType: "TON",
    quantumProtected: true,
    lastUpdated: "2025-05-18T09:15:00Z"
  }
];

const QuantumResistantPage: React.FC = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPerformingAudit, setIsPerformingAudit] = useState(false);
  const [lastAuditTime, setLastAuditTime] = useState<Date>(new Date());
  
  // Simulated refreshing quantum security status
  const refreshSecurityStatus = () => {
    setIsRefreshing(true);
    
    // Simulate network delay
    setTimeout(() => {
      setIsRefreshing(false);
      setLastAuditTime(new Date());
      
      toast({
        title: "Security Status Updated",
        description: "Quantum resistance metrics have been refreshed with latest data",
      });
    }, 2000);
  };
  
  // Simulate a full quantum security audit
  const performQuantumAudit = () => {
    setIsPerformingAudit(true);
    
    // Simulate longer audit process
    setTimeout(() => {
      setIsPerformingAudit(false);
      setLastAuditTime(new Date());
      
      toast({
        title: "Quantum Security Audit Complete",
        description: "All systems verified against latest quantum attack vectors",
        variant: "default",
      });
    }, 4000);
  };
  
  return (
    <div className="container max-w-7xl py-10">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
              Quantum-Resistant Protection
            </h1>
            <p className="text-muted-foreground">
              Advanced security protocols designed to withstand quantum computing attacks
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={refreshSecurityStatus}
              disabled={isRefreshing}
              className="border-[#6B00D7] text-[#6B00D7] hover:bg-[#6B00D7]/10"
            >
              {isRefreshing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Status
                </>
              )}
            </Button>
            
            <Button
              onClick={() => navigate('/quantum-resistant-vault')}
              className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90"
            >
              <Shield className="mr-2 h-4 w-4" />
              Create New Quantum Vault
            </Button>
          </div>
        </div>
        
        {/* Status Overview */}
        <Card className="border-[#333]">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <ShieldCheck className="mr-2 h-5 w-5 text-[#6B00D7]" />
              Quantum Protection Status
            </CardTitle>
            <CardDescription>
              Last updated: {lastAuditTime.toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Security</span>
                  <span className="font-bold">{securityScores.overall}%</span>
                </div>
                <Progress 
                  value={securityScores.overall} 
                  className="h-2 bg-gray-200 dark:bg-gray-700" 
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Algorithms</span>
                  <span className="font-bold">{securityScores.algorithms}%</span>
                </div>
                <Progress 
                  value={securityScores.algorithms}
                  className="h-2 bg-gray-200 dark:bg-gray-700" 
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Key Management</span>
                  <span className="font-bold">{securityScores.keyManagement}%</span>
                </div>
                <Progress 
                  value={securityScores.keyManagement}
                  className="h-2 bg-gray-200 dark:bg-gray-700" 
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Implementation</span>
                  <span className="font-bold">{securityScores.implementation}%</span>
                </div>
                <Progress 
                  value={securityScores.implementation}
                  className="h-2 bg-gray-200 dark:bg-gray-700" 
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Cross-Chain</span>
                  <span className="font-bold">{securityScores.crossChainProtection}%</span>
                </div>
                <Progress 
                  value={securityScores.crossChainProtection}
                  className="h-2 bg-gray-200 dark:bg-gray-700" 
                />
              </div>
            </div>
            
            {/* Security Status Banner */}
            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-start">
                <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-full mr-4">
                  <ShieldCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-800 dark:text-green-300">
                    Quantum Protection Active
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Your assets are secured with NIST-approved post-quantum cryptographic standards. 
                    Currently using CRYSTALS-Kyber (Level 5) for key encapsulation and CRYSTALS-Dilithium (Level 3) for signatures.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Main Content Tabs */}
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="overview">
              <Shield className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="algorithms">
              <Cpu className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Algorithms</span>
            </TabsTrigger>
            <TabsTrigger value="threats">
              <ShieldAlert className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Threat Detection</span>
            </TabsTrigger>
            <TabsTrigger value="vaults">
              <Database className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Protected Vaults</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quantum Computing Threat Intelligence</CardTitle>
                <CardDescription>Current quantum computing landscape and its impact on cryptography</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4 bg-blue-50/30 dark:bg-blue-950/30">
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full mr-2">
                        <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="font-semibold">Current Quantum Capability</h3>
                    </div>
                    <p className="text-sm">
                      Latest public quantum computers have reached 433 qubits. Experts estimate 4,000+ qubits 
                      would be needed to break RSA-2048 using Shor's algorithm.
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-purple-50/30 dark:bg-purple-950/30">
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-full mr-2">
                        <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h3 className="font-semibold">Timeline Projections</h3>
                    </div>
                    <p className="text-sm">
                      Cryptographically relevant quantum computers could emerge between 2026-2030. Our systems
                      are designed to be resilient well before this window.
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-emerald-50/30 dark:bg-emerald-950/30">
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-full mr-2">
                        <Layers className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <h3 className="font-semibold">Defense Strategy</h3>
                    </div>
                    <p className="text-sm">
                      We implement a hybrid approach combining conventional encryption with post-quantum
                      algorithms for maximum protection during the transition period.
                    </p>
                  </div>
                </div>
                
                <Alert className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
                  <AlertTitle className="flex items-center text-amber-800 dark:text-amber-400">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    "Harvest Now, Decrypt Later" Threat
                  </AlertTitle>
                  <AlertDescription className="text-amber-700 dark:text-amber-300">
                    Adversaries may collect currently encrypted data to decrypt it once quantum computers become 
                    powerful enough. Our quantum-resistant encryption protects against this future threat today.
                  </AlertDescription>
                </Alert>
                
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium mb-1">Perform Comprehensive Quantum Security Audit</h3>
                    <p className="text-sm text-muted-foreground">
                      Evaluate all cryptographic systems against current quantum computing threats and vulnerabilities
                    </p>
                  </div>
                  <Button
                    onClick={performQuantumAudit}
                    disabled={isPerformingAudit}
                    variant="outline"
                    className="min-w-[160px]"
                  >
                    {isPerformingAudit ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Auditing...
                      </>
                    ) : (
                      <>
                        <Key className="mr-2 h-4 w-4" />
                        Start Audit
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="algorithms" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Post-Quantum Cryptographic Algorithms</CardTitle>
                <CardDescription>NIST-approved quantum-resistant algorithms protecting your assets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {protectionFeatures.map((feature) => (
                    <div 
                      key={feature.id}
                      className={cn(
                        "border rounded-lg p-4",
                        feature.enabled 
                          ? "bg-gradient-to-r from-blue-50/30 to-indigo-50/30 dark:from-blue-950/20 dark:to-indigo-950/20" 
                          : "bg-gray-50/50 dark:bg-gray-900/20"
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <div className={cn(
                            "p-2 rounded-full mr-3",
                            feature.enabled 
                              ? "bg-blue-100 dark:bg-blue-900/50" 
                              : "bg-gray-100 dark:bg-gray-800/50"
                          )}>
                            <Code className={cn(
                              "h-5 w-5",
                              feature.enabled 
                                ? "text-blue-600 dark:text-blue-400" 
                                : "text-gray-400 dark:text-gray-500"
                            )} />
                          </div>
                          <div>
                            <h3 className="font-semibold flex items-center">
                              {feature.name}
                              {feature.enabled && (
                                <Badge className="ml-2 bg-green-500 text-white">Active</Badge>
                              )}
                              {!feature.enabled && (
                                <Badge className="ml-2 bg-gray-400 text-white">Disabled</Badge>
                              )}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center justify-end">
                            <span className="text-sm font-medium mr-2">Strength:</span>
                            <div className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-950">
                              <span className={cn(
                                "font-bold text-sm",
                                feature.strength >= 90 ? "text-green-500" :
                                feature.strength >= 80 ? "text-blue-500" :
                                "text-amber-500"
                              )}>
                                {feature.strength}%
                              </span>
                            </div>
                          </div>
                          <p className="text-xs mt-2 text-muted-foreground">
                            {feature.algorithm}
                          </p>
                        </div>
                      </div>
                      
                      {feature.enabled && (
                        <div className="mt-3 pt-3 border-t text-sm flex justify-between items-center">
                          <span className="text-muted-foreground">Implementation Status: <span className="text-green-600 dark:text-green-400">Fully Deployed</span></span>
                          
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                            View Details <ArrowUpRight className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                      )}
                      
                      {!feature.enabled && (
                        <div className="mt-3 pt-3 border-t text-sm flex justify-between items-center">
                          <span className="text-muted-foreground">Enable this algorithm for enhanced protection</span>
                          
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                            Enable <Zap className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="threats" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quantum Threat Detection</CardTitle>
                <CardDescription>Monitoring and mitigating potential quantum computing attacks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentThreats.map((threat) => (
                    <div 
                      key={threat.id}
                      className={cn(
                        "border rounded-lg p-4",
                        threat.severity === "critical" 
                          ? "bg-red-50/20 dark:bg-red-950/20 border-red-200 dark:border-red-900/40" 
                          : threat.severity === "high"
                            ? "bg-orange-50/20 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900/40"
                            : "bg-yellow-50/20 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900/40"
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-start">
                          <div className={cn(
                            "p-2 rounded-full mr-3 mt-1",
                            threat.severity === "critical" 
                              ? "bg-red-100 dark:bg-red-900/50" 
                              : threat.severity === "high"
                                ? "bg-orange-100 dark:bg-orange-900/50"
                                : "bg-yellow-100 dark:bg-yellow-900/50"
                          )}>
                            <ShieldAlert className={cn(
                              "h-5 w-5",
                              threat.severity === "critical" 
                                ? "text-red-600 dark:text-red-400" 
                                : threat.severity === "high"
                                  ? "text-orange-600 dark:text-orange-400"
                                  : "text-yellow-600 dark:text-yellow-400"
                            )} />
                          </div>
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-semibold">
                                {threat.type}
                              </h3>
                              <Badge className={cn(
                                "ml-2",
                                threat.severity === "critical" 
                                  ? "bg-red-500" 
                                  : threat.severity === "high"
                                    ? "bg-orange-500"
                                    : "bg-yellow-500"
                              )}>
                                {threat.severity.charAt(0).toUpperCase() + threat.severity.slice(1)}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {threat.details}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <Badge className={cn(
                            threat.status === "mitigated" 
                              ? "bg-green-500" 
                              : "bg-blue-500"
                          )}>
                            {threat.status.charAt(0).toUpperCase() + threat.status.slice(1)}
                          </Badge>
                          <p className="text-xs mt-2 text-muted-foreground">
                            {new Date(threat.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t text-sm flex justify-between items-center">
                        <span className="text-muted-foreground flex items-center">
                          <Network className="h-3 w-3 mr-1" />
                          Security event logged and notifications sent
                        </span>
                        
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                          View Details <ArrowUpRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex justify-center pt-4">
                    <Button variant="outline">
                      View All Threat Logs <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="vaults" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quantum-Protected Vaults</CardTitle>
                <CardDescription>Assets secured with post-quantum encryption</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Vault Name</th>
                        <th className="text-left py-3 px-4">Asset Type</th>
                        <th className="text-left py-3 px-4">Protection Status</th>
                        <th className="text-left py-3 px-4">Last Updated</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {protectedVaults.map((vault) => (
                        <tr key={vault.id} className="border-b hover:bg-gray-50/50 dark:hover:bg-gray-900/30">
                          <td className="py-3 px-4 font-medium">{vault.name}</td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className="border-purple-200 text-purple-700 dark:border-purple-700 dark:text-purple-300">
                              {vault.assetType}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            {vault.quantumProtected ? (
                              <div className="flex items-center text-green-600 dark:text-green-400">
                                <Shield className="h-4 w-4 mr-1" />
                                Quantum Protected
                              </div>
                            ) : (
                              <div className="flex items-center text-yellow-600 dark:text-yellow-400">
                                <ShieldAlert className="h-4 w-4 mr-1" />
                                Standard Protection
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground text-sm">
                            {new Date(vault.lastUpdated).toLocaleString()}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm" className="h-8 px-3">
                                View
                              </Button>
                              <Button variant="outline" size="sm" className="h-8 px-3">
                                Manage
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6 flex justify-between items-center p-4 border rounded-lg bg-blue-50/30 dark:bg-blue-950/30">
                  <div>
                    <h3 className="font-medium">Create New Quantum-Protected Vault</h3>
                    <p className="text-sm text-muted-foreground">
                      Set up a new vault with advanced post-quantum security features
                    </p>
                  </div>
                  <Button
                    onClick={() => navigate('/quantum-resistant-vault')}
                    className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90"
                  >
                    <Database className="mr-2 h-4 w-4" />
                    Create Vault
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Bottom Resources Section */}
        <Card className="border-[#333] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
          <CardHeader>
            <CardTitle>Quantum Computing Learning Resources</CardTitle>
            <CardDescription>
              Understanding the impact of quantum computing on blockchain security
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <a 
              href="#" 
              className="block p-4 rounded-lg border bg-white/90 dark:bg-black/20 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold flex items-center text-[#6B00D7] dark:text-[#FF5AF7]">
                <FileText className="h-4 w-4 mr-2" />
                Quantum Cryptography Whitepaper
              </h3>
              <p className="text-sm mt-2 text-muted-foreground">
                Comprehensive explanation of quantum threats and our cryptographic defenses
              </p>
            </a>
            
            <a 
              href="#" 
              className="block p-4 rounded-lg border bg-white/90 dark:bg-black/20 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold flex items-center text-[#6B00D7] dark:text-[#FF5AF7]">
                <Code className="h-4 w-4 mr-2" />
                NIST Post-Quantum Standards
              </h3>
              <p className="text-sm mt-2 text-muted-foreground">
                Overview of standardized algorithms for post-quantum cryptography
              </p>
            </a>
            
            <a 
              href="#" 
              className="block p-4 rounded-lg border bg-white/90 dark:bg-black/20 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold flex items-center text-[#6B00D7] dark:text-[#FF5AF7]">
                <Server className="h-4 w-4 mr-2" />
                Quantum-Safe Implementation Guide
              </h3>
              <p className="text-sm mt-2 text-muted-foreground">
                Step-by-step tutorial for using our quantum-resistant features
              </p>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuantumResistantPage;