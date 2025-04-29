/**
 * Security Test Dashboard
 * 
 * This component provides a comprehensive testing dashboard for the
 * security features of Chronos Vault, including:
 * - Cross-chain validation testing
 * - Security incident response testing
 * - Zero-knowledge proof system testing
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Check, ChevronDown, ChevronRight, Clock, Lock, RefreshCw, Shield, Zap } from 'lucide-react';
import { getTestEnvironment, TestResult } from '@/lib/cross-chain/TestEnvironment';
import { SecurityIncidentType } from '@/lib/cross-chain/SecurityServiceExports';
import { ZkProofType } from '@/lib/privacy';
import { BlockchainType } from '@/lib/cross-chain/interfaces';
import { CrossChainVerificationResults } from '@/components/security/CrossChainVerificationResults';

function TestDashboard() {
  const [testVaults, setTestVaults] = useState<any[]>([]);
  const [selectedVaultId, setSelectedVaultId] = useState<string>('');
  const [selectedTest, setSelectedTest] = useState<string>('cross-chain');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [expandedResult, setExpandedResult] = useState<string | null>(null);
  const [testInProgress, setTestInProgress] = useState<boolean>(false);
  const [selectedIncidentType, setSelectedIncidentType] = useState<SecurityIncidentType>('unauthorized_access');
  const [selectedProofType, setSelectedProofType] = useState<ZkProofType>(ZkProofType.OWNERSHIP);
  const [selectedChains, setSelectedChains] = useState<BlockchainType[]>(['ETH', 'SOL', 'TON']);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  
  // Initialize test environment and load test vaults
  useEffect(() => {
    const testEnv = getTestEnvironment();
    const vaults = testEnv.getTestVaults();
    setTestVaults(vaults);
    
    if (vaults.length > 0) {
      setSelectedVaultId(vaults[0].id);
    }
  }, []);
  
  const runTest = async () => {
    if (!selectedVaultId) return;
    
    const testEnv = getTestEnvironment();
    setIsLoading(true);
    setTestInProgress(true);
    setExecutionTime(null);
    
    const startTime = performance.now();
    
    try {
      let results: TestResult[] = [];
      
      switch (selectedTest) {
        case 'cross-chain':
          results = [await testEnv.testCrossChainValidation(selectedVaultId)];
          break;
          
        case 'security-incident':
          results = [await testEnv.testSecurityIncidentResponse(selectedVaultId, selectedIncidentType)];
          break;
          
        case 'zk-proof':
          results = [await testEnv.testZkProofSystem(selectedVaultId, selectedProofType)];
          break;
          
        case 'cross-chain-proof':
          results = [await testEnv.testCrossChainProofVerification(selectedVaultId)];
          break;
          
        case 'comprehensive':
          results = await testEnv.runTestSuite(selectedVaultId);
          break;
          
        default:
          results = [];
      }
      
      setTestResults(results);
      setExecutionTime(performance.now() - startTime);
    } catch (error) {
      console.error('Test execution error:', error);
    } finally {
      setIsLoading(false);
      setTestInProgress(false);
    }
  };
  
  const clearResults = () => {
    setTestResults([]);
    setExecutionTime(null);
    setExpandedResult(null);
  };
  
  const toggleResultExpansion = (resultId: string) => {
    if (expandedResult === resultId) {
      setExpandedResult(null);
    } else {
      setExpandedResult(resultId);
    }
  };
  
  return (
    <div className="w-full mx-auto">
      <Card className="bg-background border-border shadow-md">
        <CardHeader className="bg-gradient-to-r from-[#6B00D7]/10 to-[#FF5AF7]/10 rounded-t-lg">
          <CardTitle className="flex items-center text-foreground gap-2">
            <Shield className="h-5 w-5 text-[#FF5AF7]" />
            <span>Chronos Vault Security Testing Dashboard</span>
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Comprehensive testing environment for Triple-Chain Security and Zero-Knowledge Privacy features
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Test Configuration */}
            <div className="lg:col-span-1">
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-medium mb-3">Test Configuration</h3>
                  
                  {/* Vault Selection */}
                  <div className="space-y-2 mb-4">
                    <Label htmlFor="vault-select">Select Test Vault</Label>
                    <Select 
                      value={selectedVaultId} 
                      onValueChange={setSelectedVaultId}
                    >
                      <SelectTrigger id="vault-select">
                        <SelectValue placeholder="Select a vault" />
                      </SelectTrigger>
                      <SelectContent>
                        {testVaults.map(vault => (
                          <SelectItem key={vault.id} value={vault.id}>
                            {vault.id} (Level {vault.securityLevel})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Test Type Selection */}
                  <div className="space-y-2 mb-4">
                    <Label>Test Type</Label>
                    <div className="grid grid-cols-1 gap-2">
                      <Button 
                        variant={selectedTest === 'cross-chain' ? 'default' : 'outline'}
                        className={selectedTest === 'cross-chain' ? 'bg-[#6B00D7] hover:bg-[#5A00B3]' : ''}
                        onClick={() => setSelectedTest('cross-chain')}
                      >
                        Cross-Chain Validation
                      </Button>
                      <Button 
                        variant={selectedTest === 'security-incident' ? 'default' : 'outline'}
                        className={selectedTest === 'security-incident' ? 'bg-[#6B00D7] hover:bg-[#5A00B3]' : ''}
                        onClick={() => setSelectedTest('security-incident')}
                      >
                        Security Incident Response
                      </Button>
                      <Button 
                        variant={selectedTest === 'zk-proof' ? 'default' : 'outline'}
                        className={selectedTest === 'zk-proof' ? 'bg-[#6B00D7] hover:bg-[#5A00B3]' : ''}
                        onClick={() => setSelectedTest('zk-proof')}
                      >
                        ZK Proof System
                      </Button>
                      <Button 
                        variant={selectedTest === 'cross-chain-proof' ? 'default' : 'outline'}
                        className={selectedTest === 'cross-chain-proof' ? 'bg-[#6B00D7] hover:bg-[#5A00B3]' : ''}
                        onClick={() => setSelectedTest('cross-chain-proof')}
                      >
                        Cross-Chain Proof Verification
                      </Button>
                      <Button 
                        variant={selectedTest === 'comprehensive' ? 'default' : 'outline'}
                        className={selectedTest === 'comprehensive' ? 'bg-[#6B00D7] hover:bg-[#5A00B3]' : ''}
                        onClick={() => setSelectedTest('comprehensive')}
                      >
                        Comprehensive Test Suite
                      </Button>
                    </div>
                  </div>
                  
                  {/* Test-specific options */}
                  {selectedTest === 'security-incident' && (
                    <div className="space-y-2 mb-4">
                      <Label htmlFor="incident-type">Incident Type</Label>
                      <Select 
                        value={selectedIncidentType} 
                        onValueChange={(value) => setSelectedIncidentType(value as SecurityIncidentType)}
                      >
                        <SelectTrigger id="incident-type">
                          <SelectValue placeholder="Select incident type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unauthorized_access">Unauthorized Access</SelectItem>
                          <SelectItem value="suspected_fraud">Suspected Fraud</SelectItem>
                          <SelectItem value="abnormal_transfer">Abnormal Transfer</SelectItem>
                          <SelectItem value="multi_sig_failure">Multi-Sig Failure</SelectItem>
                          <SelectItem value="protocol_vulnerability">Protocol Vulnerability</SelectItem>
                          <SelectItem value="data_inconsistency">Data Inconsistency</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  {selectedTest === 'zk-proof' && (
                    <div className="space-y-2 mb-4">
                      <Label htmlFor="proof-type">Proof Type</Label>
                      <Select 
                        value={selectedProofType} 
                        onValueChange={(value) => setSelectedProofType(value as ZkProofType)}
                      >
                        <SelectTrigger id="proof-type">
                          <SelectValue placeholder="Select proof type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={ZkProofType.OWNERSHIP}>Ownership Proof</SelectItem>
                          <SelectItem value={ZkProofType.CONTENT_EXISTENCE}>Content Existence Proof</SelectItem>
                          <SelectItem value={ZkProofType.TIME_CONDITION}>Time Condition Proof</SelectItem>
                          <SelectItem value={ZkProofType.BALANCE_RANGE}>Balance Range Proof</SelectItem>
                          <SelectItem value={ZkProofType.ACCESS_RIGHTS}>Access Rights Proof</SelectItem>
                          <SelectItem value={ZkProofType.MULTI_PARTY}>Multi-Party Proof</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  <div className="space-y-2 mt-6">
                    <Button 
                      onClick={runTest} 
                      disabled={isLoading || !selectedVaultId}
                      className="w-full bg-gradient-to-r from-[#6B00D7] to-[#9242FC] hover:from-[#5A00B3] hover:to-[#7E36DD]"
                    >
                      {isLoading ? (
                        <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Running Test...</>
                      ) : (
                        <><Zap className="mr-2 h-4 w-4" /> Run Test</>
                      )}
                    </Button>
                    
                    {testResults.length > 0 && (
                      <Button 
                        onClick={clearResults} 
                        variant="outline" 
                        className="w-full mt-2"
                      >
                        Clear Results
                      </Button>
                    )}
                  </div>
                </div>
                
                {selectedVaultId && (
                  <div className="border border-border rounded-md p-4 mt-4">
                    <h4 className="font-medium mb-2">Selected Vault Details</h4>
                    {testVaults
                      .filter(vault => vault.id === selectedVaultId)
                      .map(vault => (
                        <div key={vault.id} className="text-sm space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">ID:</span>
                            <span className="font-mono">{vault.id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Owner:</span>
                            <span className="font-mono truncate ml-2" style={{ maxWidth: '160px' }}>{vault.owner}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Security Level:</span>
                            <Badge variant="outline">{vault.securityLevel}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Chains:</span>
                            <div className="flex gap-1">
                              {vault.ethereumAddress && <Badge variant="outline" className="bg-blue-500/10 text-blue-500">ETH</Badge>}
                              {vault.solanaAddress && <Badge variant="outline" className="bg-purple-500/10 text-purple-500">SOL</Badge>}
                              {vault.tonAddress && <Badge variant="outline" className="bg-cyan-500/10 text-cyan-500">TON</Badge>}
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Created:</span>
                            <span>{new Date(vault.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Unlocks:</span>
                            <span>{new Date(vault.unlockTime).toLocaleDateString()}</span>
                          </div>
                        </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Test Results */}
            <div className="lg:col-span-2">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Test Results</h3>
                  {executionTime !== null && (
                    <Badge variant="outline" className="bg-muted/40">
                      Execution Time: {executionTime.toFixed(2)}ms
                    </Badge>
                  )}
                </div>
                
                {testResults.length === 0 ? (
                  <div className="bg-muted/30 rounded-lg p-10 text-center">
                    <Clock className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-foreground mb-2">No Test Results Yet</h4>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Configure your test parameters and click "Run Test" to start testing the security features.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {testResults.map((result, index) => (
                      <Card key={index} className={`border ${result.success ? 'border-green-500/30' : 'border-red-500/30'}`}>
                        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                          <div className="flex items-center">
                            {result.success ? (
                              <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-red-500 mr-2 shrink-0" />
                            )}
                            <CardTitle className={`text-base ${result.success ? 'text-green-500' : 'text-red-500'}`}>
                              {result.success ? 'Success' : 'Failed'}
                            </CardTitle>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleResultExpansion(`${index}`)}
                          >
                            {expandedResult === `${index}` ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        </CardHeader>
                        <CardContent className="px-4 py-2">
                          <p className="text-sm text-muted-foreground">{result.message}</p>
                          
                          {expandedResult === `${index}` && (
                            <>
                              <Separator className="my-3" />
                              <div className="space-y-2 mt-2">
                                <h4 className="text-sm font-medium">Test Details</h4>
                                <div className="bg-muted/30 p-3 rounded-md">
                                  <pre className="text-xs overflow-auto max-h-40">
                                    {JSON.stringify(result.details, null, 2)}
                                  </pre>
                                </div>
                                
                                {result.metrics && (
                                  <div className="mt-3">
                                    <h4 className="text-sm font-medium mb-1">Performance Metrics</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                      <div className="bg-muted/20 p-2 rounded-md">
                                        <p className="text-xs text-muted-foreground">Execution Time</p>
                                        <p className="text-sm">{result.metrics.executionTimeMs.toFixed(2)}ms</p>
                                      </div>
                                      {result.metrics.crossChainLatencyMs && (
                                        <div className="bg-muted/20 p-2 rounded-md">
                                          <p className="text-xs text-muted-foreground">Cross-Chain Latency</p>
                                          <p className="text-sm">{result.metrics.crossChainLatencyMs.toFixed(2)}ms</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="bg-muted/30 px-6 py-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-muted-foreground/70" />
            <span>Chronos Vault Security Testing Environment - Triple-Chain Security Architecture</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
export default TestDashboard;
