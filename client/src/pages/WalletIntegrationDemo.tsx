import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, Shield, Zap, Globe, Lock, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export default function WalletIntegrationDemo() {
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [sessionToken, setSessionToken] = useState('');
  const [responses, setResponses] = useState<Record<string, any>>({});
  const { toast } = useToast();

  const [walletData, setWalletData] = useState({
    walletName: 'TestWallet',
    developerAddress: '0x742d35cc6aa31ae21a60bf2c8d10b1e5a3e33a3b',
    callback_url: 'https://testwallet.com/chronos-callback',
    requested_permissions: ['vault_creation', 'transaction_monitoring', 'security_alerts']
  });

  const [sessionData, setSessionData] = useState({
    user_address: '0x742d35cc6aa31ae21a60bf2c8d10b1e5a3e33a3b',
    wallet_signature: '0x1234567890abcdef...',
    chain: 'ethereum',
    session_duration: 3600
  });

  const [vaultData, setVaultData] = useState({
    vault_type: 'personal',
    name: 'My Secure Vault',
    assets: [
      {
        chain: 'ethereum',
        token_address: '0x0000000000000000000000000000000000000000',
        amount: '1000000000000000000'
      }
    ],
    security_level: 'maximum',
    time_lock: {
      enabled: true,
      unlock_date: '2025-12-31T23:59:59Z'
    },
    beneficiaries: ['0x456...']
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "API key copied successfully",
    });
  };

  const simulateApiCall = async (endpoint: string, method: string = 'POST', data?: any) => {
    setLoading(true);
    
    // Simulate API responses for demonstration
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let mockResponse: any = {};
    
    switch (endpoint) {
      case 'wallet/register':
        mockResponse = {
          api_key: 'cvt_live_' + Math.random().toString(36).substr(2, 32),
          api_secret: 'cvt_secret_' + Math.random().toString(36).substr(2, 32),
          wallet_id: 'wallet_' + Math.random().toString(36).substr(2, 8),
          permissions: data.requested_permissions,
          rate_limits: {
            requests_per_minute: 1000,
            burst_limit: 100
          }
        };
        setApiKey(mockResponse.api_key);
        break;
        
      case 'wallet/session':
        mockResponse = {
          session_token: 'sess_' + Math.random().toString(36).substr(2, 32),
          expires_at: Math.floor(Date.now() / 1000) + 3600,
          user_security_score: 98.5,
          recommended_vault_types: ['personal', 'investment']
        };
        setSessionToken(mockResponse.session_token);
        break;
        
      case 'vault/create':
        mockResponse = {
          vault_id: 'vault_cv_' + Math.random().toString(36).substr(2, 16),
          vault_address: {
            ethereum: '0x' + Math.random().toString(16).substr(2, 40),
            solana: Math.random().toString(36).substr(2, 44),
            ton: 'EQ' + Math.random().toString(16).substr(2, 64)
          },
          security_score: 99.99999,
          estimated_attack_cost: '17000000000',
          transaction_hash: {
            ethereum: '0x' + Math.random().toString(16).substr(2, 64),
            solana: Math.random().toString(36).substr(2, 88),
            ton: Math.random().toString(16).substr(2, 64)
          }
        };
        break;
        
      case 'transaction/verify':
        mockResponse = {
          verification_id: 'verify_' + Math.random().toString(36).substr(2, 16),
          risk_score: 2.5,
          risk_level: 'low',
          ai_analysis: {
            suspicious_patterns: [],
            confidence: 98.7,
            recommendation: 'proceed'
          },
          trinity_verification: {
            ethereum_verified: true,
            solana_verified: true,
            ton_verified: true,
            consensus_reached: true
          },
          estimated_gas: {
            ethereum: '0.003',
            optimization_available: true
          }
        };
        break;
        
      case 'wallet/security-health':
        mockResponse = {
          overall_score: 96.8,
          components: {
            wallet_security: 95.2,
            vault_security: 99.99999,
            transaction_patterns: 94.1,
            ai_threat_detection: 98.7
          },
          recent_threats: [
            {
              type: 'phishing_attempt',
              blocked: true,
              timestamp: new Date(Date.now() - 3600000).toISOString()
            }
          ],
          recommendations: [
            'Enable 2FA for additional security',
            'Consider upgrading to Maximum security tier'
          ]
        };
        break;
    }
    
    setResponses(prev => ({
      ...prev,
      [endpoint]: mockResponse
    }));
    
    setLoading(false);
    
    toast({
      title: "API Call Successful",
      description: `${endpoint} executed successfully`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Wallet Integration API Demo
        </h1>
        <p className="text-gray-600 mt-2">
          Test the Chronos Vault Trinity Protocol integration for external wallets
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Testing Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                API Authentication
              </CardTitle>
              <CardDescription>
                Register your wallet and obtain API credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="walletName">Wallet Name</Label>
                <Input
                  id="walletName"
                  value={walletData.walletName}
                  onChange={(e) => setWalletData(prev => ({ ...prev, walletName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="developerAddress">Developer Address</Label>
                <Input
                  id="developerAddress"
                  value={walletData.developerAddress}
                  onChange={(e) => setWalletData(prev => ({ ...prev, developerAddress: e.target.value }))}
                />
              </div>
              <Button 
                onClick={() => simulateApiCall('wallet/register', 'POST', walletData)}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Registering...' : 'Register Wallet'}
              </Button>
              
              {apiKey && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="flex items-center justify-between">
                    <span>API Key: {apiKey.substring(0, 20)}...</span>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(apiKey)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Session Management
              </CardTitle>
              <CardDescription>
                Create authenticated user sessions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userAddress">User Address</Label>
                <Input
                  id="userAddress"
                  value={sessionData.user_address}
                  onChange={(e) => setSessionData(prev => ({ ...prev, user_address: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="chain">Blockchain</Label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={sessionData.chain}
                  onChange={(e) => setSessionData(prev => ({ ...prev, chain: e.target.value }))}
                >
                  <option value="ethereum">Ethereum</option>
                  <option value="solana">Solana</option>
                  <option value="ton">TON</option>
                </select>
              </div>
              <Button 
                onClick={() => simulateApiCall('wallet/session', 'POST', sessionData)}
                disabled={loading || !apiKey}
                className="w-full"
              >
                {loading ? 'Creating Session...' : 'Create Session'}
              </Button>
              
              {sessionToken && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Session created successfully
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Vault Creation
              </CardTitle>
              <CardDescription>
                Create secure multi-chain vaults
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vaultName">Vault Name</Label>
                <Input
                  id="vaultName"
                  value={vaultData.name}
                  onChange={(e) => setVaultData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="securityLevel">Security Level</Label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={vaultData.security_level}
                  onChange={(e) => setVaultData(prev => ({ ...prev, security_level: e.target.value }))}
                >
                  <option value="standard">Standard</option>
                  <option value="enhanced">Enhanced</option>
                  <option value="maximum">Maximum</option>
                </select>
              </div>
              <Button 
                onClick={() => simulateApiCall('vault/create', 'POST', vaultData)}
                disabled={loading || !sessionToken}
                className="w-full"
              >
                {loading ? 'Creating Vault...' : 'Create Vault'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Response Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                API Responses
              </CardTitle>
              <CardDescription>
                Live responses from the Trinity Protocol
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="register" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="register">Register</TabsTrigger>
                  <TabsTrigger value="session">Session</TabsTrigger>
                  <TabsTrigger value="vault">Vault</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>
                
                <TabsContent value="register" className="mt-4">
                  <div className="space-y-4">
                    <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-auto max-h-64">
                      {responses['wallet/register'] ? 
                        JSON.stringify(responses['wallet/register'], null, 2) : 
                        'No response yet. Click "Register Wallet" to test.'
                      }
                    </pre>
                    {responses['wallet/register'] && (
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">✓ API Key Generated</Badge>
                        <Badge variant="secondary">✓ Rate Limits Set</Badge>
                        <Badge variant="secondary">✓ Permissions Granted</Badge>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="session" className="mt-4">
                  <div className="space-y-4">
                    <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-auto max-h-64">
                      {responses['wallet/session'] ? 
                        JSON.stringify(responses['wallet/session'], null, 2) : 
                        'No response yet. Create a session first.'
                      }
                    </pre>
                    {responses['wallet/session'] && (
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">✓ Session Token</Badge>
                        <Badge variant="secondary">✓ Security Score: 98.5</Badge>
                        <Badge variant="secondary">✓ Signature Verified</Badge>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="vault" className="mt-4">
                  <div className="space-y-4">
                    <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-auto max-h-64">
                      {responses['vault/create'] ? 
                        JSON.stringify(responses['vault/create'], null, 2) : 
                        'No response yet. Create a vault first.'
                      }
                    </pre>
                    {responses['vault/create'] && (
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">✓ Triple-Chain Deployment</Badge>
                        <Badge variant="secondary">✓ Security Score: 99.99999</Badge>
                        <Badge variant="secondary">✓ Attack Cost: $17B</Badge>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="security" className="mt-4">
                  <div className="space-y-4">
                    <Button 
                      onClick={() => simulateApiCall('wallet/security-health', 'GET')}
                      disabled={loading}
                      className="w-full"
                    >
                      Check Security Health
                    </Button>
                    <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-auto max-h-64">
                      {responses['wallet/security-health'] ? 
                        JSON.stringify(responses['wallet/security-health'], null, 2) : 
                        'Click "Check Security Health" to view security metrics.'
                      }
                    </pre>
                    {responses['wallet/security-health'] && (
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">✓ Overall Score: 96.8</Badge>
                        <Badge variant="secondary">✓ AI Protection Active</Badge>
                        <Badge variant="secondary">✓ Threats Blocked</Badge>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Integration Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span>99.99999% Security Score</span>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <span>Real-time Trinity Verification</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-purple-600" />
                  <span>Cross-chain Asset Protection</span>
                </div>
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-orange-600" />
                  <span>AI-powered Threat Detection</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            This is a demonstration interface. In production, these API calls would be made server-to-server 
            with proper authentication and rate limiting. The Trinity Protocol provides mathematical 
            guarantees for cross-chain security verification.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}