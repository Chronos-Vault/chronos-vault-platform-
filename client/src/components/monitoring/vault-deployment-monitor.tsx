import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Activity,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Info,
  RefreshCw,
  Check,
  FileLock2,
  Shield,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

type VaultDeploymentStatus = 
  | 'pending'
  | 'in_progress'
  | 'deployed'
  | 'failed'
  | 'canceled';

type BlockchainNetwork =
  | 'ethereum'
  | 'solana'
  | 'ton'
  | 'bitcoin';

type SecurityVerification = {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'pending' | 'in_progress';
  timestamp?: number;
  description: string;
};

type DeploymentStep = {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  timestamp?: number;
  network?: BlockchainNetwork;
  details?: string;
  transactionHash?: string;
  progressPercentage?: number;
};

interface VaultDeployment {
  id: string;
  name: string;
  status: VaultDeploymentStatus;
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
  vaultType: string;
  networks: BlockchainNetwork[];
  primaryNetwork: BlockchainNetwork;
  securityLevel: number;
  steps: DeploymentStep[];
  verifications: SecurityVerification[];
  estimatedTimeRemaining?: number; // in seconds
  errorMessage?: string;
}

interface VaultDeploymentMonitorProps {
  deploymentId?: string;
  onRefresh?: () => void;
  onComplete?: (deploymentId: string) => void;
}

export function VaultDeploymentMonitor({
  deploymentId,
  onRefresh,
  onComplete
}: VaultDeploymentMonitorProps) {
  const [activeTab, setActiveTab] = useState<string>('steps');
  const [deployment, setDeployment] = useState<VaultDeployment | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [expandedSteps, setExpandedSteps] = useState<string[]>([]);
  const [expandedVerifications, setExpandedVerifications] = useState<string[]>([]);
  
  // Fetch deployment data
  useEffect(() => {
    if (!deploymentId) {
      setIsLoading(false);
      return;
    }
    
    fetchDeploymentData();
    
    // Poll for updates
    const intervalId = setInterval(() => {
      if (deployment?.status !== 'in_progress') {
        clearInterval(intervalId);
        return;
      }
      
      fetchDeploymentData();
    }, 5000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [deploymentId, deployment?.status]);
  
  // Update current step index when steps change
  useEffect(() => {
    if (!deployment) return;
    
    const inProgressIndex = deployment.steps.findIndex(step => step.status === 'in_progress');
    if (inProgressIndex !== -1) {
      setCurrentStepIndex(inProgressIndex);
      // Expand current step
      setExpandedSteps([deployment.steps[inProgressIndex].id]);
      return;
    }
    
    const pendingIndex = deployment.steps.findIndex(step => step.status === 'pending');
    if (pendingIndex !== -1) {
      setCurrentStepIndex(pendingIndex);
      return;
    }
    
    // If no in_progress or pending steps, set to last step
    setCurrentStepIndex(deployment.steps.length - 1);
  }, [deployment?.steps]);
  
  const fetchDeploymentData = async () => {
    setIsLoading(true);
    
    try {
      // In a real implementation, fetch from API
      // For demo, generate sample data
      const sampleDeployment = generateSampleDeployment(deploymentId || 'sample-id');
      setDeployment(sampleDeployment);
    } catch (error) {
      console.error("Error fetching deployment data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper function to generate sample deployment data
  const generateSampleDeployment = (id: string): VaultDeployment => {
    const now = Date.now();
    const fiveMinutesAgo = now - 5 * 60 * 1000;
    
    // Generate steps based on networks
    const networks: BlockchainNetwork[] = ['ethereum', 'solana', 'ton'];
    const primaryNetwork: BlockchainNetwork = 'ethereum';
    
    const steps: DeploymentStep[] = [
      {
        id: 'preparation',
        name: 'Preparation',
        status: 'completed',
        timestamp: fiveMinutesAgo,
        details: 'Compiling and validating vault contracts',
        progressPercentage: 100
      },
      {
        id: 'deploy-ethereum',
        name: 'Deploy to Ethereum',
        status: 'completed',
        timestamp: fiveMinutesAgo + 60 * 1000,
        network: 'ethereum',
        details: 'Primary vault contract deployed successfully',
        transactionHash: '0x3a8e7f0d6a55d3d5e4302c1f85c2f7a8e9c2b5f1',
        progressPercentage: 100
      },
      {
        id: 'deploy-solana',
        name: 'Deploy to Solana',
        status: 'in_progress',
        timestamp: now - 2 * 60 * 1000,
        network: 'solana',
        details: 'Deploying verification contract',
        progressPercentage: 70
      },
      {
        id: 'deploy-ton',
        name: 'Deploy to TON',
        status: 'pending',
        network: 'ton',
        details: 'Waiting for Solana deployment to complete',
        progressPercentage: 0
      },
      {
        id: 'verification',
        name: 'Cross-Chain Verification',
        status: 'pending',
        details: 'Waiting for all chain deployments to complete',
        progressPercentage: 0
      },
      {
        id: 'activation',
        name: 'Vault Activation',
        status: 'pending',
        details: 'Final vault activation and setup',
        progressPercentage: 0
      }
    ];
    
    // Generate security verifications
    const verifications: SecurityVerification[] = [
      {
        id: 'code-audit',
        name: 'Contract Code Audit',
        status: 'passed',
        timestamp: fiveMinutesAgo - 30 * 1000,
        description: 'Automated contract code analysis completed with no high severity issues found'
      },
      {
        id: 'key-verification',
        name: 'Access Key Verification',
        status: 'passed',
        timestamp: fiveMinutesAgo,
        description: 'Vault access keys properly generated and securely stored'
      },
      {
        id: 'time-lock',
        name: 'Time-Lock Mechanisms',
        status: 'in_progress',
        description: 'Verifying time-lock parameters across all chains'
      },
      {
        id: 'cross-chain',
        name: 'Cross-Chain Security',
        status: 'pending',
        description: 'Waiting for all deployments to complete before verifying cross-chain security'
      }
    ];
    
    // Calculate overall status
    const failedSteps = steps.filter(step => step.status === 'failed');
    const pendingSteps = steps.filter(step => step.status === 'pending' || step.status === 'in_progress');
    
    let status: VaultDeploymentStatus = 'in_progress';
    if (failedSteps.length > 0) {
      status = 'failed';
    } else if (pendingSteps.length === 0) {
      status = 'deployed';
    }
    
    // Estimate time remaining (in seconds)
    // Rough estimation: 2 minutes per pending step, 1 minute per in_progress step
    const estimatedTimeRemaining = 
      pendingSteps.filter(step => step.status === 'pending').length * 120 +
      pendingSteps.filter(step => step.status === 'in_progress').length * 60;
    
    return {
      id,
      name: 'Investment Discipline Vault',
      status,
      createdAt: fiveMinutesAgo - 60 * 1000,
      updatedAt: now,
      completedAt: status === 'deployed' ? now : undefined,
      vaultType: 'investment-discipline',
      networks,
      primaryNetwork,
      securityLevel: 3,
      steps,
      verifications,
      estimatedTimeRemaining: status === 'in_progress' ? estimatedTimeRemaining : undefined,
      errorMessage: status === 'failed' ? 'Deployment failed due to contract verification error' : undefined
    };
  };
  
  // Format time remaining in a human-readable format
  const formatTimeRemaining = (seconds?: number): string => {
    if (!seconds) return 'Unknown';
    
    if (seconds < 60) {
      return `${seconds} seconds`;
    }
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ${remainingSeconds > 0 ? `${remainingSeconds} seconds` : ''}`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    return `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMinutes > 0 ? `${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}` : ''}`;
  };
  
  // Format timestamp in a human-readable format
  const formatTimestamp = (timestamp?: number): string => {
    if (!timestamp) return 'N/A';
    
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  // Get status badge for deployment
  const getStatusBadge = (status: VaultDeploymentStatus) => {
    switch (status) {
      case 'deployed':
        return (
          <Badge className="bg-green-600 hover:bg-green-700">
            Deployed
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge className="bg-blue-600 hover:bg-blue-700">
            In Progress
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-600 hover:bg-yellow-700">
            Pending
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-red-600 hover:bg-red-700">
            Failed
          </Badge>
        );
      case 'canceled':
        return (
          <Badge className="bg-gray-600 hover:bg-gray-700">
            Canceled
          </Badge>
        );
      default:
        return null;
    }
  };
  
  // Get icon for step status
  const getStepStatusIcon = (status: DeploymentStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-gray-400" />;
      default:
        return null;
    }
  };
  
  // Get icon for verification status
  const getVerificationStatusIcon = (status: SecurityVerification['status']) => {
    switch (status) {
      case 'passed':
        return <ShieldCheck className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'failed':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-gray-400" />;
      default:
        return null;
    }
  };
  
  // Get network icon and color
  const getNetworkIcon = (network?: BlockchainNetwork) => {
    if (!network) return null;
    
    switch (network) {
      case 'ethereum':
        return <span className="text-blue-400">ETH</span>;
      case 'solana':
        return <span className="text-purple-400">SOL</span>;
      case 'ton':
        return <span className="text-cyan-400">TON</span>;
      case 'bitcoin':
        return <span className="text-amber-400">BTC</span>;
      default:
        return null;
    }
  };
  
  // Get overall deployment progress percentage
  const getOverallProgress = (): number => {
    if (!deployment) return 0;
    
    const totalSteps = deployment.steps.length;
    const completedSteps = deployment.steps.filter(step => step.status === 'completed').length;
    const inProgressStep = deployment.steps.find(step => step.status === 'in_progress');
    
    let inProgressValue = 0;
    if (inProgressStep && inProgressStep.progressPercentage) {
      inProgressValue = inProgressStep.progressPercentage / 100;
    }
    
    return Math.round(((completedSteps + inProgressValue) / totalSteps) * 100);
  };
  
  // Toggle step expansion
  const toggleStepExpansion = (stepId: string) => {
    if (expandedSteps.includes(stepId)) {
      setExpandedSteps(expandedSteps.filter(id => id !== stepId));
    } else {
      setExpandedSteps([...expandedSteps, stepId]);
    }
  };
  
  // Toggle verification expansion
  const toggleVerificationExpansion = (verificationId: string) => {
    if (expandedVerifications.includes(verificationId)) {
      setExpandedVerifications(expandedVerifications.filter(id => id !== verificationId));
    } else {
      setExpandedVerifications([...expandedVerifications, verificationId]);
    }
  };
  
  // Handle manual refresh button click
  const handleRefresh = () => {
    fetchDeploymentData();
    if (onRefresh) onRefresh();
  };
  
  // Handle view vault button click
  const handleViewVault = () => {
    if (onComplete && deployment) {
      onComplete(deployment.id);
    }
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <Card className="w-full bg-black/40 border-gray-800">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <div className="h-8 w-8 border-4 border-t-transparent border-indigo-500 rounded-full animate-spin"></div>
            <p className="text-gray-400">Loading deployment status...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Render no deployment state
  if (!deployment) {
    return (
      <Card className="w-full bg-black/40 border-gray-800">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <Info className="h-12 w-12 text-gray-500" />
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-300 mb-1">No Deployment Found</h3>
              <p className="text-gray-500">No active vault deployment was found with the provided ID</p>
            </div>
            <Button onClick={handleRefresh} variant="outline" className="mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full bg-black/40 border-gray-800">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center text-xl">
              <FileLock2 className="h-5 w-5 mr-2 text-indigo-400" />
              Vault Deployment
            </CardTitle>
            <CardDescription className="mt-1">
              {deployment.name}
            </CardDescription>
          </div>
          {getStatusBadge(deployment.status)}
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Overall progress bar */}
        <div className="px-6 py-3 bg-black/20 border-t border-b border-gray-800">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm font-medium">Deployment Progress</div>
            <div className="text-sm text-gray-400">{getOverallProgress()}%</div>
          </div>
          <Progress value={getOverallProgress()} className="h-2" />
          
          {deployment.status === 'in_progress' && deployment.estimatedTimeRemaining && (
            <div className="text-xs text-gray-500 mt-2 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              Estimated time remaining: {formatTimeRemaining(deployment.estimatedTimeRemaining)}
            </div>
          )}
        </div>
        
        {/* Error message if failed */}
        {deployment.status === 'failed' && deployment.errorMessage && (
          <div className="px-6 py-3 bg-red-950/20 border-b border-red-900/50">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-red-400">Deployment Failed</div>
                <div className="text-xs text-gray-400 mt-1">{deployment.errorMessage}</div>
              </div>
            </div>
          </div>
        )}
        
        {/* Deployment information */}
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">Security Level</div>
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-1 text-indigo-400" />
                Level {deployment.securityLevel}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 mb-1">Primary Network</div>
              <div className="flex items-center">
                {getNetworkIcon(deployment.primaryNetwork)}
                <span className="ml-1 capitalize">{deployment.primaryNetwork}</span>
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 mb-1">Created</div>
              <div>{formatTimestamp(deployment.createdAt)}</div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 mb-1">
                {deployment.status === 'deployed' ? 'Completed' : 'Last Updated'}
              </div>
              <div>
                {deployment.status === 'deployed' && deployment.completedAt
                  ? formatTimestamp(deployment.completedAt)
                  : formatTimestamp(deployment.updatedAt)}
              </div>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 bg-gray-800/60">
              <TabsTrigger value="steps">Deployment Steps</TabsTrigger>
              <TabsTrigger value="security">Security Verifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="steps" className="mt-4 space-y-4">
              {deployment.steps.map((step, index) => (
                <div 
                  key={step.id}
                  className={cn(
                    "border rounded-md overflow-hidden",
                    index === currentStepIndex 
                      ? "border-indigo-800 bg-indigo-950/20" 
                      : "border-gray-800 bg-black/20",
                    expandedSteps.includes(step.id) ? "mb-4" : ""
                  )}
                >
                  <div 
                    className={cn(
                      "p-3 flex items-center justify-between cursor-pointer",
                      expandedSteps.includes(step.id) ? "border-b border-gray-800" : ""
                    )}
                    onClick={() => toggleStepExpansion(step.id)}
                  >
                    <div className="flex items-center">
                      {getStepStatusIcon(step.status)}
                      <span className="ml-2 font-medium">{step.name}</span>
                      {step.network && (
                        <span className="ml-2 text-xs px-2 py-0.5 bg-gray-800 rounded-full">
                          {getNetworkIcon(step.network)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center">
                      {step.timestamp && (
                        <span className="text-xs text-gray-500 mr-2">
                          {formatTimestamp(step.timestamp)}
                        </span>
                      )}
                      <ChevronRight className={cn(
                        "h-4 w-4 transition-transform",
                        expandedSteps.includes(step.id) ? "rotate-90" : ""
                      )} />
                    </div>
                  </div>
                  
                  {expandedSteps.includes(step.id) && (
                    <div className="p-3 text-sm">
                      <p className="text-gray-400 mb-2">{step.details}</p>
                      
                      {step.status === 'in_progress' && step.progressPercentage !== undefined && (
                        <div className="mt-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-gray-500">Progress</span>
                            <span className="text-xs text-gray-500">{step.progressPercentage}%</span>
                          </div>
                          <Progress value={step.progressPercentage} className="h-1.5" />
                        </div>
                      )}
                      
                      {step.transactionHash && (
                        <div className="mt-3 bg-gray-900 rounded p-2 flex justify-between items-center">
                          <div className="text-xs font-mono text-gray-400 truncate">
                            Transaction: {step.transactionHash}
                          </div>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="security" className="mt-4 space-y-4">
              {deployment.verifications.map((verification) => (
                <div 
                  key={verification.id}
                  className={cn(
                    "border rounded-md overflow-hidden bg-black/20",
                    verification.status === 'failed' 
                      ? "border-red-900/50" 
                      : verification.status === 'passed'
                        ? "border-green-900/50"
                        : "border-gray-800",
                    expandedVerifications.includes(verification.id) ? "mb-4" : ""
                  )}
                >
                  <div 
                    className={cn(
                      "p-3 flex items-center justify-between cursor-pointer",
                      expandedVerifications.includes(verification.id) ? "border-b border-gray-800" : ""
                    )}
                    onClick={() => toggleVerificationExpansion(verification.id)}
                  >
                    <div className="flex items-center">
                      {getVerificationStatusIcon(verification.status)}
                      <span className="ml-2 font-medium">{verification.name}</span>
                    </div>
                    <div className="flex items-center">
                      {verification.timestamp && (
                        <span className="text-xs text-gray-500 mr-2">
                          {formatTimestamp(verification.timestamp)}
                        </span>
                      )}
                      <ChevronRight className={cn(
                        "h-4 w-4 transition-transform",
                        expandedVerifications.includes(verification.id) ? "rotate-90" : ""
                      )} />
                    </div>
                  </div>
                  
                  {expandedVerifications.includes(verification.id) && (
                    <div className="p-3 text-sm">
                      <p className="text-gray-400">{verification.description}</p>
                    </div>
                  )}
                </div>
              ))}
              
              <div className="bg-indigo-950/20 border border-indigo-900/30 rounded-md p-4 mt-4">
                <div className="flex items-start">
                  <div className="bg-indigo-900/40 p-2 rounded-full mr-3">
                    <Shield className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Triple-Chain Security Architecture</h4>
                    <p className="text-xs text-gray-400">
                      Your vault is secured by our proprietary Triple-Chain Security Architecture, distributing security responsibilities across Ethereum, Solana, and TON networks for maximum protection and redundancy.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t border-gray-800 p-6">
        <Button
          variant="outline"
          className="border-gray-700"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Status
        </Button>
        
        {deployment.status === 'deployed' && (
          <Button onClick={handleViewVault} className="bg-indigo-600 hover:bg-indigo-700">
            <Check className="h-4 w-4 mr-2" />
            View Vault
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default VaultDeploymentMonitor;