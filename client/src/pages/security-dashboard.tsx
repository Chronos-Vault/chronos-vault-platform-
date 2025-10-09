import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Shield, 
  Users, 
  Clock, 
  Fingerprint,
  Smartphone,
  Key,
  CheckCircle,
  AlertCircle,
  Plus,
  Settings,
  Lock,
  Unlock,
  Timer,
  Eye,
  Copy
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MultiSigWallet {
  id: string;
  name: string;
  network: string;
  requiredSignatures: number;
  totalSigners: number;
  signers: string[];
  address: string;
  isActive: boolean;
}

interface HardwareDevice {
  id: string;
  type: string;
  model: string;
  isConnected: boolean;
  supportedNetworks: string[];
  securityLevel: string;
}

interface TimeLockedTransaction {
  id: string;
  network: string;
  recipient: string;
  amount: string;
  unlockTime: string;
  status: string;
  requiredApprovals: number;
  currentApprovals: number;
}

interface SecurityHealthData {
  status: string;
  features: {
    zeroKnowledgePrivacy: boolean;
    quantumResistantEncryption: boolean;
    behavioralAnalysis: boolean;
    multiSignature: boolean;
    dataPersistence: boolean;
    crossChainVerification: boolean;
  };
  metrics: {
    totalIncidents: number;
    blockedAttacks: number;
    challengedTransactions: number;
    healthScore: number;
    lastUpdated: string;
  };
}

export default function SecurityDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [securityHealth, setSecurityHealth] = useState<SecurityHealthData | null>(null);
  const [multiSigWallets, setMultiSigWallets] = useState<MultiSigWallet[]>([]);
  const [hardwareDevices, setHardwareDevices] = useState<HardwareDevice[]>([]);
  const [timeLockedTxs, setTimeLockedTxs] = useState<TimeLockedTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Multi-sig wallet creation form
  const [newWalletName, setNewWalletName] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('ethereum');
  const [signers, setSigners] = useState(['']);
  const [requiredSigs, setRequiredSigs] = useState(2);

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    setIsLoading(true);
    try {
      // Fetch real Mathematical Defense Layer status from backend
      const securityResponse = await fetch('/api/security/health');
      const securityData = await securityResponse.json();
      
      console.log('Mathematical Defense Layer Status:', securityData);
      
      // Store Mathematical Defense Layer metrics
      setSecurityHealth(securityData);
      
      // Note: Mathematical Defense Layer data will be displayed in the overview tab
      // Multi-sig wallets and other features use their respective endpoints
      
      // Load mock data temporarily for demonstration (will be replaced with real endpoints)
      setMultiSigWallets([
        {
          id: 'wallet_001',
          name: 'Treasury Vault',
          network: 'ethereum',
          requiredSignatures: 3,
          totalSigners: 5,
          signers: ['0x123...', '0x456...', '0x789...', '0xabc...', '0xdef...'],
          address: '0x742d35cc6aa31ae21a60bf2c8d10b1e5a3e33a3b',
          isActive: true
        }
      ]);

      setHardwareDevices([
        {
          id: 'ledger_001',
          type: 'Ledger',
          model: 'Nano X',
          isConnected: true,
          supportedNetworks: ['ethereum', 'solana', 'bitcoin'],
          securityLevel: 'Maximum'
        }
      ]);

      setTimeLockedTxs([
        {
          id: 'timelock_001',
          network: 'ethereum',
          recipient: '0x987fcdeb21fcac5f123...',
          amount: '10.5 ETH',
          unlockTime: new Date(Date.now() + 86400000).toISOString(), // 24 hours from now
          status: 'locked',
          requiredApprovals: 2,
          currentApprovals: 1
        }
      ]);
    } catch (error) {
      console.error('Failed to load security data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createMultiSigWallet = async () => {
    if (!newWalletName || signers.filter(s => s.trim()).length < 2) {
      toast({
        title: "Invalid Input",
        description: "Please provide a wallet name and at least 2 signers",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/multisig/wallets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newWalletName,
          network: selectedNetwork,
          signers: signers.filter(s => s.trim()),
          requiredSignatures: requiredSigs
        })
      });

      const result = await response.json();
      
      if (result.status === 'success') {
        toast({
          title: "Multi-Sig Wallet Created",
          description: `${newWalletName} wallet deployed successfully`,
        });
        setNewWalletName('');
        setSigners(['']);
        loadSecurityData();
      }
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "Failed to create multi-signature wallet",
        variant: "destructive",
      });
    }
  };

  const detectHardwareWallets = async () => {
    try {
      const response = await fetch('/api/hardware-wallet/devices/detect');
      const result = await response.json();
      
      if (result.status === 'success') {
        setHardwareDevices(result.data.devices);
        toast({
          title: "Hardware Scan Complete",
          description: `Found ${result.data.count} connected device(s)`,
        });
      }
    } catch (error) {
      toast({
        title: "Scan Failed",
        description: "Failed to detect hardware wallets",
        variant: "destructive",
      });
    }
  };

  const setupBiometric = async (deviceId: string) => {
    try {
      const response = await fetch('/api/hardware-wallet/biometric/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'current_user',
          deviceId,
          biometricType: 'fingerprint'
        })
      });

      const result = await response.json();
      
      if (result.status === 'success') {
        toast({
          title: "Biometric Setup Complete",
          description: "Fingerprint authentication enabled",
        });
      }
    } catch (error) {
      toast({
        title: "Setup Failed",
        description: "Failed to setup biometric authentication",
        variant: "destructive",
      });
    }
  };

  const addSigner = () => {
    setSigners([...signers, '']);
  };

  const updateSigner = (index: number, value: string) => {
    const newSigners = [...signers];
    newSigners[index] = value;
    setSigners(newSigners);
  };

  const removeSigner = (index: number) => {
    if (signers.length > 1) {
      setSigners(signers.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Security Dashboard
          </h1>
          <p className="text-gray-400">
            Advanced security features powered by Trinity Protocol
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="multisig" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Multi-Signature
            </TabsTrigger>
            <TabsTrigger value="hardware" className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              Hardware Wallets
            </TabsTrigger>
            <TabsTrigger value="timelock" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Time-Locked
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gray-900/50 border-green-500/30">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-green-400">
                    <Users className="w-5 h-5" />
                    Multi-Sig Wallets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{multiSigWallets.length}</div>
                  <p className="text-sm text-gray-400">Active wallets</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-blue-500/30">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-blue-400">
                    <Key className="w-5 h-5" />
                    Hardware Devices
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{hardwareDevices.filter(d => d.isConnected).length}</div>
                  <p className="text-sm text-gray-400">Connected devices</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-purple-500/30">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-purple-400">
                    <Clock className="w-5 h-5" />
                    Time-Locked
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{timeLockedTxs.length}</div>
                  <p className="text-sm text-gray-400">Pending transactions</p>
                </CardContent>
              </Card>
            </div>

            {/* Mathematical Defense Layer Status */}
            <Card className="bg-gray-900/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-400" />
                  Mathematical Defense Layer
                </CardTitle>
              </CardHeader>
              <CardContent>
                {securityHealth ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-3 bg-purple-500/10 rounded-lg">
                        <div className="text-2xl font-bold text-purple-400">{securityHealth.metrics.healthScore}%</div>
                        <p className="text-xs text-gray-400">Health Score</p>
                      </div>
                      <div className="text-center p-3 bg-green-500/10 rounded-lg">
                        <div className="text-2xl font-bold text-green-400">{securityHealth.metrics.blockedAttacks}</div>
                        <p className="text-xs text-gray-400">Blocked Attacks</p>
                      </div>
                      <div className="text-center p-3 bg-blue-500/10 rounded-lg">
                        <div className="text-2xl font-bold text-blue-400">{securityHealth.metrics.totalIncidents}</div>
                        <p className="text-xs text-gray-400">Total Incidents</p>
                      </div>
                      <div className="text-center p-3 bg-orange-500/10 rounded-lg">
                        <div className="text-2xl font-bold text-orange-400">{securityHealth.metrics.challengedTransactions}</div>
                        <p className="text-xs text-gray-400">Challenged Txs</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-gray-300">Active Security Systems:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className={`flex items-center gap-3 p-3 rounded-lg ${securityHealth.features.zeroKnowledgePrivacy ? 'bg-green-500/10' : 'bg-gray-500/10'}`}>
                          {securityHealth.features.zeroKnowledgePrivacy ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-gray-400" />
                          )}
                          <div>
                            <p className="font-medium">Zero-Knowledge Privacy</p>
                            <p className="text-xs text-gray-400">Groth16 Protocol</p>
                          </div>
                        </div>
                        <div className={`flex items-center gap-3 p-3 rounded-lg ${securityHealth.features.quantumResistantEncryption ? 'bg-green-500/10' : 'bg-gray-500/10'}`}>
                          {securityHealth.features.quantumResistantEncryption ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-gray-400" />
                          )}
                          <div>
                            <p className="font-medium">Quantum-Resistant Crypto</p>
                            <p className="text-xs text-gray-400">ML-KEM-1024 + Dilithium-5</p>
                          </div>
                        </div>
                        <div className={`flex items-center gap-3 p-3 rounded-lg ${securityHealth.features.behavioralAnalysis ? 'bg-green-500/10' : 'bg-gray-500/10'}`}>
                          {securityHealth.features.behavioralAnalysis ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-gray-400" />
                          )}
                          <div>
                            <p className="font-medium">Behavioral Analysis</p>
                            <p className="text-xs text-gray-400">AI-powered threat detection</p>
                          </div>
                        </div>
                        <div className={`flex items-center gap-3 p-3 rounded-lg ${securityHealth.features.multiSignature ? 'bg-green-500/10' : 'bg-gray-500/10'}`}>
                          {securityHealth.features.multiSignature ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-gray-400" />
                          )}
                          <div>
                            <p className="font-medium">Multi-Signature Gateway</p>
                            <p className="text-xs text-gray-400">3-of-5 MPC threshold</p>
                          </div>
                        </div>
                        <div className={`flex items-center gap-3 p-3 rounded-lg ${securityHealth.features.dataPersistence ? 'bg-green-500/10' : 'bg-gray-500/10'}`}>
                          {securityHealth.features.dataPersistence ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-gray-400" />
                          )}
                          <div>
                            <p className="font-medium">Data Persistence</p>
                            <p className="text-xs text-gray-400">Redundant storage</p>
                          </div>
                        </div>
                        <div className={`flex items-center gap-3 p-3 rounded-lg ${securityHealth.features.crossChainVerification ? 'bg-green-500/10' : 'bg-gray-500/10'}`}>
                          {securityHealth.features.crossChainVerification ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-gray-400" />
                          )}
                          <div>
                            <p className="font-medium">Cross-Chain Verification</p>
                            <p className="text-xs text-gray-400">2-of-3 Trinity consensus</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <p className="text-xs text-gray-400">
                        Last Updated: {new Date(securityHealth.metrics.lastUpdated).toLocaleString()}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Multi-Signature Tab */}
          <TabsContent value="multisig" className="space-y-6">
            {/* Create New Multi-Sig Wallet */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Create Multi-Signature Wallet
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="walletName">Wallet Name</Label>
                    <Input
                      id="walletName"
                      value={newWalletName}
                      onChange={(e) => setNewWalletName(e.target.value)}
                      placeholder="Treasury Vault"
                      className="bg-gray-800 border-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="network">Network</Label>
                    <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
                      <SelectTrigger className="bg-gray-800 border-gray-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ethereum">Ethereum</SelectItem>
                        <SelectItem value="solana">Solana</SelectItem>
                        <SelectItem value="ton">TON</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Signers</Label>
                  {signers.map((signer, index) => (
                    <div key={index} className="flex gap-2 mt-2">
                      <Input
                        value={signer}
                        onChange={(e) => updateSigner(index, e.target.value)}
                        placeholder="0x742d35cc6aa31ae21a60bf2c8d10b1e5a3e33a3b"
                        className="bg-gray-800 border-gray-600"
                      />
                      {signers.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeSigner(index)}
                          className="border-red-500 text-red-400"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addSigner}
                    className="mt-2"
                  >
                    Add Signer
                  </Button>
                </div>

                <div>
                  <Label htmlFor="requiredSigs">Required Signatures</Label>
                  <Input
                    id="requiredSigs"
                    type="number"
                    value={requiredSigs}
                    onChange={(e) => setRequiredSigs(Number(e.target.value))}
                    min={1}
                    max={signers.filter(s => s.trim()).length}
                    className="bg-gray-800 border-gray-600"
                  />
                </div>

                <Button onClick={createMultiSigWallet} className="w-full">
                  Create Multi-Signature Wallet
                </Button>
              </CardContent>
            </Card>

            {/* Existing Multi-Sig Wallets */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle>Your Multi-Signature Wallets</CardTitle>
              </CardHeader>
              <CardContent>
                {multiSigWallets.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No multi-signature wallets created yet</p>
                ) : (
                  <div className="space-y-4">
                    {multiSigWallets.map((wallet) => (
                      <div key={wallet.id} className="p-4 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold">{wallet.name}</h3>
                          <Badge variant={wallet.isActive ? 'default' : 'secondary'}>
                            {wallet.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-400">Network</p>
                            <p className="capitalize">{wallet.network}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Required Signatures</p>
                            <p>{wallet.requiredSignatures}/{wallet.totalSigners}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Address</p>
                            <p className="font-mono text-xs">{wallet.address.slice(0, 10)}...</p>
                          </div>
                          <div>
                            <Button size="sm" variant="outline">
                              <Settings className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hardware Wallets Tab */}
          <TabsContent value="hardware" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Hardware Wallet Integration</h2>
              <Button onClick={detectHardwareWallets}>
                <Smartphone className="w-4 h-4 mr-2" />
                Scan for Devices
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hardwareDevices.map((device) => (
                <Card key={device.id} className="bg-gray-900/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Key className="w-5 h-5" />
                      {device.type} {device.model}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${device.isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                      <span className="text-sm">{device.isConnected ? 'Connected' : 'Disconnected'}</span>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Supported Networks</p>
                      <div className="flex flex-wrap gap-1">
                        {device.supportedNetworks.map((network) => (
                          <Badge key={network} variant="outline" className="text-xs">
                            {network}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-400 mb-2">Security Level</p>
                      <Badge variant={device.securityLevel === 'Maximum' ? 'default' : 'secondary'}>
                        {device.securityLevel}
                      </Badge>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setupBiometric(device.id)}
                        className="flex items-center gap-1"
                      >
                        <Fingerprint className="w-4 h-4" />
                        Setup Biometric
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {hardwareDevices.length === 0 && (
              <Card className="bg-gray-900/50 border-gray-700">
                <CardContent className="text-center py-12">
                  <Key className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Hardware Wallets Detected</h3>
                  <p className="text-gray-400 mb-4">
                    Connect your Ledger, Trezor, or other hardware wallet to get started
                  </p>
                  <Button onClick={detectHardwareWallets}>
                    Scan for Devices
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Time-Locked Transactions Tab */}
          <TabsContent value="timelock" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="w-5 h-5" />
                  Time-Locked Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {timeLockedTxs.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No time-locked transactions</p>
                ) : (
                  <div className="space-y-4">
                    {timeLockedTxs.map((tx) => (
                      <div key={tx.id} className="p-4 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Lock className="w-4 h-4 text-yellow-400" />
                            <span className="font-medium">{tx.amount}</span>
                          </div>
                          <Badge variant={tx.status === 'locked' ? 'secondary' : 'default'}>
                            {tx.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-400">Network</p>
                            <p className="capitalize">{tx.network}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Recipient</p>
                            <p className="font-mono text-xs">{tx.recipient.slice(0, 10)}...</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Unlock Time</p>
                            <p className="text-xs">{new Date(tx.unlockTime).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Approvals</p>
                            <p>{tx.currentApprovals}/{tx.requiredApprovals}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}