import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Shield, 
  Activity,
  RefreshCw
} from 'lucide-react';
import { 
  securityServiceAggregator, 
  CrossChainVerificationResult 
} from '@/lib/cross-chain/SecurityServiceAggregator';
import { SecurityMetrics, NetworkSecurityStatus } from '@/lib/cross-chain/SecurityServiceAggregator';

interface SecurityDashboardProps {
  vaultId?: string;
  address?: string;
}

export const CrossChainSecurityDashboard: React.FC<SecurityDashboardProps> = ({
  vaultId,
  address
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [verificationResult, setVerificationResult] = useState<CrossChainVerificationResult | null>(null);
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Function to load security status
  const loadSecurityStatus = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // If we have an address, get security metrics
      if (address) {
        const metrics = await securityServiceAggregator.getSecurityMetrics(address);
        setSecurityMetrics(metrics);
      }
      
      // If we have a vault ID, verify it across chains
      if (vaultId) {
        const result = await securityServiceAggregator.verifyVaultTripleChain(vaultId);
        setVerificationResult(result);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load security status');
      console.error('Security dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Load security status on component mount
  useEffect(() => {
    loadSecurityStatus();
  }, [vaultId, address]);
  
  // Helper to get status icon
  const getStatusIcon = (status: boolean | undefined) => {
    if (status === undefined) return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
    return status 
      ? <CheckCircle className="h-6 w-6 text-green-500" /> 
      : <XCircle className="h-6 w-6 text-red-500" />;
  };
  
  // Helper to get status color
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-purple-900">
          Triple-Chain Security Status
        </h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={loadSecurityStatus}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Verification Result Card */}
      {vaultId && verificationResult && (
        <Card className="border-2 border-purple-200">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle className="flex items-center text-purple-900">
              <Shield className="h-6 w-6 mr-2 text-purple-600" />
              Vault Verification Status
            </CardTitle>
            <CardDescription>
              Cross-chain security verification across Ethereum, Solana, and TON
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-sm text-gray-500">Overall Status</span>
                <div className="flex items-center mt-1">
                  <Badge className={getStatusColor(verificationResult.overallStatus)}>
                    {verificationResult.overallStatus.toUpperCase()}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-500">Last Verified</span>
                <div className="text-sm font-medium">
                  {new Date(verificationResult.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
            
            <div className="space-y-6 mt-4">
              {/* Ethereum Status */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <svg className="h-6 w-6 text-blue-700" viewBox="0 0 32 32" fill="none">
                        <path d="M16 4L8 16L16 12L24 16L16 4Z" fill="currentColor" />
                        <path d="M16 12L8 16L16 20L24 16L16 12Z" fill="currentColor" />
                        <path d="M16 20L8 16L16 28L24 16L16 20Z" fill="currentColor" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Ethereum</h3>
                      <p className="text-xs text-gray-500">Ownership & Authorization</p>
                    </div>
                  </div>
                  {getStatusIcon(verificationResult.ethereumStatus.verified)}
                </div>
                
                <div className="mt-2 text-sm">
                  {verificationResult.ethereumStatus.blockNumber && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Block:</span>
                      <span className="font-mono">{verificationResult.ethereumStatus.blockNumber}</span>
                    </div>
                  )}
                  {verificationResult.ethereumStatus.error && (
                    <div className="text-red-500 mt-1">
                      Error: {verificationResult.ethereumStatus.error}
                    </div>
                  )}
                </div>
              </div>

              {/* Solana Status */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-purple-100 to-fuchsia-100 p-2 rounded-full mr-3">
                      <svg className="h-6 w-6 text-purple-700" viewBox="0 0 32 32" fill="none">
                        <path d="M10.5 6L6 10.5L21.5 26L26 21.5L10.5 6Z" fill="currentColor" />
                        <path d="M6 21.5L10.5 26L16 20.5L11.5 16L6 21.5Z" fill="currentColor" />
                        <path d="M21.5 6L16 11.5L20.5 16L26 10.5L21.5 6Z" fill="currentColor" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Solana</h3>
                      <p className="text-xs text-gray-500">High-Speed Monitoring</p>
                    </div>
                  </div>
                  {getStatusIcon(verificationResult.solanaStatus.verified)}
                </div>
                
                <div className="mt-2 text-sm">
                  {verificationResult.solanaStatus.slot && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Slot:</span>
                      <span className="font-mono">{verificationResult.solanaStatus.slot}</span>
                    </div>
                  )}
                  {verificationResult.solanaStatus.error && (
                    <div className="text-red-500 mt-1">
                      Error: {verificationResult.solanaStatus.error}
                    </div>
                  )}
                </div>
              </div>
              
              {/* TON Status */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <svg className="h-6 w-6 text-blue-800" viewBox="0 0 32 32" fill="none">
                        <path d="M16 4L8 28L16 24L24 28L16 4Z" fill="currentColor" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">TON</h3>
                      <p className="text-xs text-gray-500">Backup & Recovery</p>
                    </div>
                  </div>
                  {getStatusIcon(verificationResult.tonStatus.verified)}
                </div>
                
                <div className="mt-2 text-sm">
                  {verificationResult.tonStatus.blockId && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Block:</span>
                      <span className="font-mono">{verificationResult.tonStatus.blockId.substring(0, 10)}...</span>
                    </div>
                  )}
                  {verificationResult.tonStatus.error && (
                    <div className="text-red-500 mt-1">
                      Error: {verificationResult.tonStatus.error}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gradient-to-r from-purple-50 to-pink-50 flex flex-col items-start">
            <p className="text-sm text-gray-600 mb-2">
              Triple-Chain Security protects your vault by verifying its status across multiple blockchains.
              {verificationResult.verified 
                ? ' Your vault is currently secured by all three blockchains.' 
                : ' Your vault has verification issues that need attention.'}
            </p>
            {!verificationResult.verified && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadSecurityStatus}
                className="mt-2"
              >
                Verify Again
              </Button>
            )}
          </CardFooter>
        </Card>
      )}

      {/* Security Metrics Card */}
      {address && securityMetrics && (
        <Card className="border-2 border-purple-200">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle className="flex items-center text-purple-900">
              <Activity className="h-6 w-6 mr-2 text-purple-600" />
              Security Dashboard
            </CardTitle>
            <CardDescription>
              Comprehensive security metrics and monitoring
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* Security Score */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Security Score</span>
                  <span className={`text-sm font-medium ${
                    securityMetrics.securityScore > 70 
                      ? 'text-green-600' 
                      : securityMetrics.securityScore > 40 
                        ? 'text-yellow-600' 
                        : 'text-red-600'
                  }`}>
                    {securityMetrics.securityScore}/100
                  </span>
                </div>
                <Progress value={securityMetrics.securityScore} className="h-2" />
                <div className="flex justify-between mt-1">
                  <Badge variant={securityMetrics.riskLevel === 'low' ? 'default' : 'outline'} className="bg-green-100 text-green-800 hover:bg-green-100">
                    Low Risk
                  </Badge>
                  <Badge variant={securityMetrics.riskLevel === 'medium' ? 'default' : 'outline'} className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                    Medium Risk
                  </Badge>
                  <Badge variant={securityMetrics.riskLevel === 'high' ? 'default' : 'outline'} className="bg-red-100 text-red-800 hover:bg-red-100">
                    High Risk
                  </Badge>
                </div>
              </div>

              {/* Network Status */}
              <div>
                <h3 className="text-sm font-medium mb-3">Blockchain Network Status</h3>
                <div className="grid grid-cols-3 gap-4">
                  {securityMetrics.networkStatuses.map((network, index) => (
                    <div key={index} className="border rounded-lg p-3 text-center">
                      <div className={`text-xs font-medium ${
                        network.status === 'normal' 
                          ? 'text-green-600' 
                          : network.status === 'alert' 
                            ? 'text-yellow-600' 
                            : 'text-red-600'
                      }`}>
                        {network.blockchain}
                      </div>
                      <div className="mt-1">
                        {network.status === 'normal' ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                        ) : network.status === 'alert' ? (
                          <AlertTriangle className="h-5 w-5 text-yellow-500 mx-auto" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {network.status === 'normal' ? 'Normal' : network.status === 'alert' ? 'Alert' : 'Incident'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monitoring Status */}
              <div className="flex justify-between items-center border rounded-lg p-4">
                <div>
                  <h3 className="font-medium">Active Monitoring</h3>
                  <p className="text-xs text-gray-500">
                    {securityMetrics.activeMonitoring 
                      ? 'Real-time security monitoring is active' 
                      : 'Security monitoring is not enabled'}
                  </p>
                </div>
                <Badge className={securityMetrics.activeMonitoring 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
                }>
                  {securityMetrics.activeMonitoring ? 'ACTIVE' : 'INACTIVE'}
                </Badge>
              </div>

              {/* Incidents & Alerts Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="border rounded-lg p-3">
                  <h3 className="text-sm font-medium">Security Incidents</h3>
                  <div className="text-2xl font-bold mt-1 text-center">
                    {securityMetrics.securityIncidents.length}
                  </div>
                </div>
                <div className="border rounded-lg p-3">
                  <h3 className="text-sm font-medium">Monitoring Alerts</h3>
                  <div className="text-2xl font-bold mt-1 text-center">
                    {securityMetrics.monitoringAlerts.length}
                  </div>
                </div>
                <div className="border rounded-lg p-3">
                  <h3 className="text-sm font-medium">Detected Anomalies</h3>
                  <div className="text-2xl font-bold mt-1 text-center">
                    {securityMetrics.anomalies.length}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gradient-to-r from-purple-50 to-pink-50 flex justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => securityServiceAggregator.triggerSecurityScan(address)}
            >
              Run Security Scan
            </Button>
            <Button 
              variant={securityMetrics.activeMonitoring ? "outline" : "default"}
              size="sm" 
              onClick={() => securityMetrics.activeMonitoring
                ? securityServiceAggregator.deactivateEnhancedMonitoring(address)
                : securityServiceAggregator.activateEnhancedMonitoring(address)
              }
            >
              {securityMetrics.activeMonitoring ? 'Disable Monitoring' : 'Enable Monitoring'}
            </Button>
          </CardFooter>
        </Card>
      )}

      {loading && !verificationResult && !securityMetrics && (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      )}
    </div>
  );
};

export default CrossChainSecurityDashboard;