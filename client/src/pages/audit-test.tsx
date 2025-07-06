import { useState } from 'react';
import { BlockchainType } from '@shared/types';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function SmartContractAuditTest() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<any>(null);
  const [contract, setContract] = useState({
    address: '',
    blockchain: 'ETH' as BlockchainType,
    name: '',
    sourceCode: '',
  });
  const [options, setOptions] = useState({
    deepScan: true,
    crossChainVerification: true,
    formalVerification: false,
    simulateAttacks: false,
  });

  const handleContractChange = (field: string, value: string) => {
    setContract((prev) => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (field: string, value: boolean) => {
    setOptions((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contract.address || !contract.blockchain || !contract.name) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await apiRequest('POST', '/api/audit/contract', {
        contract,
        options
      });
      
      const result = await response.json();
      setAuditResult(result);
      
      toast({
        title: "Audit Completed",
        description: `Security Score: ${result.securityScore}/100`,
      });
    } catch (error: any) {
      console.error('Audit error:', error);
      toast({
        title: "Audit Failed",
        description: error.message || "Failed to complete audit",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const getRecommendation = (description: string) => {
    // Simulate generating a recommendation
    return `Implement stronger ${description.toLowerCase()} protections to increase security.`;
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Smart Contract Audit</h1>
          <p className="text-muted-foreground">
            Analyze your smart contracts for security vulnerabilities and best practices
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Audit Form */}
          <Card>
            <CardHeader>
              <CardTitle>Contract Details</CardTitle>
              <CardDescription>
                Enter your smart contract details for security analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="address">Contract Address</Label>
                  <Input
                    id="address"
                    placeholder="0x123...abc"
                    value={contract.address}
                    onChange={(e) => handleContractChange('address', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Contract Name</Label>
                  <Input
                    id="name"
                    placeholder="MyContract"
                    value={contract.name}
                    onChange={(e) => handleContractChange('name', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="blockchain">Blockchain</Label>
                  <Select
                    value={contract.blockchain}
                    onValueChange={(value) => handleContractChange('blockchain', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select blockchain" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ETH">Ethereum</SelectItem>
                      <SelectItem value="SOL">Solana</SelectItem>
                      <SelectItem value="TON">TON</SelectItem>
                      <SelectItem value="POLYGON">Polygon</SelectItem>
                      <SelectItem value="BTC">Bitcoin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sourceCode">Source Code (Optional)</Label>
                  <Textarea
                    id="sourceCode"
                    placeholder="Paste your smart contract code here..."
                    rows={8}
                    value={contract.sourceCode}
                    onChange={(e) => handleContractChange('sourceCode', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Providing source code allows for more thorough analysis
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Label>Audit Options</Label>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="deepScan"
                      checked={options.deepScan}
                      onChange={(e) => handleOptionChange('deepScan', e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="deepScan" className="font-normal cursor-pointer">
                      Perform Deep Scan
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="crossChainVerification"
                      checked={options.crossChainVerification}
                      onChange={(e) => handleOptionChange('crossChainVerification', e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="crossChainVerification" className="font-normal cursor-pointer">
                      Cross-Chain Verification
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="formalVerification"
                      checked={options.formalVerification}
                      onChange={(e) => handleOptionChange('formalVerification', e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="formalVerification" className="font-normal cursor-pointer">
                      Formal Verification
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="simulateAttacks"
                      checked={options.simulateAttacks}
                      onChange={(e) => handleOptionChange('simulateAttacks', e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="simulateAttacks" className="font-normal cursor-pointer">
                      Simulate Attack Vectors
                    </Label>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubmit} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Auditing...
                  </>
                ) : (
                  "Audit Contract"
                )}
              </Button>
            </CardFooter>
          </Card>
          
          {/* Audit Results */}
          <Card>
            <CardHeader>
              <CardTitle>Audit Results</CardTitle>
              <CardDescription>
                {auditResult 
                  ? `Security Score: ${auditResult.securityScore}/100`
                  : "Results will appear here after audit completion"}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[500px] overflow-y-auto">
              {loading && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Analyzing smart contract vulnerabilities...
                    </p>
                  </div>
                </div>
              )}
              
              {!loading && !auditResult && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-muted-foreground">
                    <p>No audit results yet</p>
                  </div>
                </div>
              )}
              
              {!loading && auditResult && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">Overview</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-muted rounded-md">
                        <p className="text-sm font-medium">Security Score</p>
                        <p className="text-xl font-bold">{auditResult.securityScore}/100</p>
                      </div>
                      <div className="p-3 bg-muted rounded-md">
                        <p className="text-sm font-medium">Status</p>
                        <p className="text-xl font-bold capitalize">{auditResult.status}</p>
                      </div>
                      <div className="p-3 bg-muted rounded-md">
                        <p className="text-sm font-medium">Issues Found</p>
                        <p className="text-xl font-bold">{auditResult.findings?.length || 0}</p>
                      </div>
                      <div className="p-3 bg-muted rounded-md">
                        <p className="text-sm font-medium">Scan Duration</p>
                        <p className="text-xl font-bold">{Math.round(auditResult.executionTimeMs / 1000)}s</p>
                      </div>
                    </div>
                  </div>
                  
                  {auditResult.findings?.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg">Vulnerabilities</h3>
                      {auditResult.findings.map((finding: any, index: number) => (
                        <Alert key={index} variant={
                          finding.severity === 'CRITICAL' ? 'destructive' : 
                          finding.severity === 'HIGH' ? 'destructive' : 
                          'default'
                        }>
                          <AlertTitle className="flex items-center">
                            <span className="capitalize font-semibold">{finding.severity}</span>: {finding.title}
                          </AlertTitle>
                          <AlertDescription className="mt-2 space-y-2">
                            <p>{finding.description}</p>
                            <p className="font-medium">Impact: {finding.impact}</p>
                            <p className="font-medium">Recommendation: {finding.recommendation}</p>
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  )}
                  
                  {auditResult.recommendations?.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg">Recommendations</h3>
                      <ul className="space-y-2 list-disc list-inside">
                        {auditResult.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="text-muted-foreground">{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {auditResult.gasEfficiency && (
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">Gas Efficiency</h3>
                      <div className="p-3 bg-muted rounded-md">
                        <div className="flex justify-between items-center">
                          <p className="font-medium">Score</p>
                          <p className="font-bold">{auditResult.gasEfficiency.score}/100</p>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="font-medium">Potential Savings</p>
                          <p className="font-bold">{auditResult.gasEfficiency.estimatedSavings}%</p>
                        </div>
                      </div>
                      
                      {auditResult.gasEfficiency.recommendations?.length > 0 && (
                        <div className="mt-2">
                          <p className="font-medium">Optimization Suggestions:</p>
                          <ul className="mt-1 space-y-1 list-disc list-inside">
                            {auditResult.gasEfficiency.recommendations.map((rec: string, index: number) => (
                              <li key={index} className="text-sm text-muted-foreground">{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {auditResult.crossChainSecurity && (
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">Cross-Chain Security</h3>
                      <div className="p-3 bg-muted rounded-md">
                        <div className="flex justify-between items-center">
                          <p className="font-medium">Score</p>
                          <p className="font-bold">{auditResult.crossChainSecurity.score}/100</p>
                        </div>
                      </div>
                      
                      {auditResult.crossChainSecurity.inconsistencies?.length > 0 && (
                        <div className="mt-2">
                          <p className="font-medium">Detected Inconsistencies:</p>
                          <ul className="mt-1 space-y-1 list-disc list-inside">
                            {auditResult.crossChainSecurity.inconsistencies.map((inc: any, index: number) => (
                              <li key={index} className="text-sm text-muted-foreground">
                                {inc.description} (Chains: {inc.chains.join(', ')})
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}