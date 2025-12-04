import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { AISecurityDashboard } from '@/components/security/AISecurityDashboard';
import { TripleChainSecurityVerifier } from '@/components/security/TripleChainSecurityVerifier';
import SecurityFeaturePanel from '@/components/cross-chain/SecurityFeaturePanel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Shield, 
  Brain,
  Lock,
  Key,
  AlertTriangle,
  CheckCircle,
  Settings,
  FileText,
  ArrowLeft,
  Eye,
  Fingerprint,
  Smartphone,
  Zap,
  Clock,
  Users,
  BookOpen
} from 'lucide-react';

interface MultiSigWallet {
  id: string;
  name: string;
  network: string;
  requiredSignatures: number;
  totalSigners: number;
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

const SecurityControlCenter = () => {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<string>('ai-monitoring');
  const [vaultId, setVaultId] = useState('vault-1683246549872');
  const [showVerifier, setShowVerifier] = useState(false);
  
  // Multi-sig wallet creation form
  const [newWalletName, setNewWalletName] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('ethereum');
  const [signers, setSigners] = useState(['']);
  const [requiredSigs, setRequiredSigs] = useState(2);

  // Fetch multi-sig wallets from backend API
  const { data: multiSigData, isLoading: loadingWallets } = useQuery<{ status: string; wallets: MultiSigWallet[] }>({
    queryKey: ['/api/security/multisig'],
  });
  const multiSigWallets = multiSigData?.wallets || [];

  // Fetch hardware devices from backend API
  const { data: devicesData, isLoading: loadingDevices } = useQuery<{ status: string; devices: HardwareDevice[] }>({
    queryKey: ['/api/security/devices'],
  });
  const hardwareDevices = devicesData?.devices || [];

  const handleVaultIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vaultId.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a valid Vault ID',
        variant: 'destructive'
      });
      return;
    }
    setShowVerifier(true);
  };

  const handleVerificationComplete = (status: any) => {
    if (status.success) {
      toast({
        title: 'Verification Complete',
        description: 'The vault has been successfully verified across all chains.',
      });
    } else {
      toast({
        title: 'Verification Failed',
        description: 'There was an issue verifying the vault across all chains.',
        variant: 'destructive'
      });
    }
  };

  // Mutation for creating multi-sig wallet
  const createWalletMutation = useMutation({
    mutationFn: async (walletData: {
      name: string;
      network: string;
      requiredSignatures: number;
      totalSigners: number;
      signers: string[];
    }) => {
      return await apiRequest('POST', '/api/security/multisig', walletData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/security/multisig'] });
      toast({
        title: 'Multi-Sig Wallet Created',
        description: `${newWalletName} has been created successfully.`
      });
      // Reset form
      setNewWalletName('');
      setSigners(['']);
      setRequiredSigs(2);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create multi-sig wallet',
        variant: 'destructive'
      });
    }
  });

  const handleCreateMultiSig = () => {
    if (!newWalletName || signers.length < requiredSigs) {
      toast({
        title: 'Invalid Configuration',
        description: 'Please provide a wallet name and enough signers.',
        variant: 'destructive'
      });
      return;
    }

    createWalletMutation.mutate({
      name: newWalletName,
      network: selectedNetwork,
      requiredSignatures: requiredSigs,
      totalSigners: signers.filter(s => s.trim()).length,
      signers: signers.filter(s => s.trim())
    });
  };

  const addSigner = () => {
    setSigners([...signers, '']);
  };

  const updateSigner = (index: number, value: string) => {
    const updated = [...signers];
    updated[index] = value;
    setSigners(updated);
  };

  const removeSigner = (index: number) => {
    if (signers.length > 1) {
      setSigners(signers.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setLocation('/')}
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-[#FF5AF7] to-[#6B00D7] bg-clip-text text-transparent">
              Security Control Center
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Advanced security monitoring, verification, and multi-signature management
            </p>
          </div>
        </div>
        <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
          <Shield className="h-3 w-3 mr-1" />
          System Secure
        </Badge>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 lg:grid-cols-5 w-full bg-[#1a1a1a] border border-[#333]">
          <TabsTrigger value="ai-monitoring" className="flex items-center gap-2" data-testid="tab-ai-monitoring">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">AI Monitoring</span>
            <span className="sm:hidden">AI</span>
          </TabsTrigger>
          <TabsTrigger value="triple-chain" className="flex items-center gap-2" data-testid="tab-triple-chain">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Triple-Chain</span>
            <span className="sm:hidden">3-Chain</span>
          </TabsTrigger>
          <TabsTrigger value="multi-sig" className="flex items-center gap-2" data-testid="tab-multi-sig">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Multi-Sig</span>
            <span className="sm:hidden">M-Sig</span>
          </TabsTrigger>
          <TabsTrigger value="hardware" className="flex items-center gap-2" data-testid="tab-hardware">
            <Key className="h-4 w-4" />
            <span className="hidden sm:inline">Hardware</span>
            <span className="sm:hidden">HW</span>
          </TabsTrigger>
          <TabsTrigger value="docs" className="flex items-center gap-2" data-testid="tab-docs">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Documentation</span>
            <span className="sm:hidden">Docs</span>
          </TabsTrigger>
        </TabsList>

        {/* AI Security Monitoring Tab */}
        <TabsContent value="ai-monitoring" className="space-y-6" data-testid="content-ai-monitoring">
          <AISecurityDashboard vaultId={vaultId} />
        </TabsContent>

        {/* Triple-Chain Verification Tab */}
        <TabsContent value="triple-chain" className="space-y-6" data-testid="content-triple-chain">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="border border-[#333] bg-[#121212]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-[#FF5AF7]" />
                    Triple-Chain Security™ Verification
                  </CardTitle>
                  <CardDescription>
                    Verify vault security across Ethereum, Solana, and TON blockchains
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!showVerifier ? (
                    <form onSubmit={handleVaultIdSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Vault ID</Label>
                        <Input
                          type="text"
                          value={vaultId}
                          onChange={(e) => setVaultId(e.target.value)}
                          placeholder="Enter vault ID to verify"
                          className="bg-black border-[#333] font-mono"
                          data-testid="input-vault-id"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-[#FF5AF7] to-[#6B00D7] hover:opacity-90"
                        data-testid="button-verify-vault"
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        Verify Vault Security
                      </Button>
                    </form>
                  ) : (
                    <div>
                      <TripleChainSecurityVerifier
                        vaultId={vaultId}
                        onVerificationComplete={handleVerificationComplete}
                      />
                      <Button
                        variant="outline"
                        onClick={() => setShowVerifier(false)}
                        className="mt-4 w-full"
                        data-testid="button-verify-another"
                      >
                        Verify Another Vault
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div>
              <SecurityFeaturePanel />
            </div>
          </div>
        </TabsContent>

        {/* Multi-Signature Management Tab */}
        <TabsContent value="multi-sig" className="space-y-6" data-testid="content-multi-sig">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Existing Multi-Sig Wallets */}
            <Card className="border border-[#333] bg-[#121212]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Active Multi-Sig Wallets
                </CardTitle>
                <CardDescription>
                  Manage your multi-signature wallets
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {multiSigWallets.map((wallet) => (
                  <div key={wallet.id} className="p-4 rounded-lg border border-[#333] bg-black">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium">{wallet.name}</h3>
                        <p className="text-sm text-gray-400 font-mono mt-1">{wallet.address}</p>
                      </div>
                      <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-400">
                        Network: <span className="text-white">{wallet.network}</span>
                      </span>
                      <span className="text-gray-400">
                        Signatures: <span className="text-white">{wallet.requiredSignatures}/{wallet.totalSigners}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Create New Multi-Sig */}
            <Card className="border border-[#333] bg-[#121212]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Create Multi-Sig Wallet
                </CardTitle>
                <CardDescription>
                  Set up a new multi-signature wallet
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Wallet Name</Label>
                  <Input
                    value={newWalletName}
                    onChange={(e) => setNewWalletName(e.target.value)}
                    placeholder="e.g., Treasury Vault"
                    className="bg-black border-[#333]"
                    data-testid="input-wallet-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Network</Label>
                  <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
                    <SelectTrigger className="bg-black border-[#333]" data-testid="select-network">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ethereum">Ethereum</SelectItem>
                      <SelectItem value="solana">Solana</SelectItem>
                      <SelectItem value="ton">TON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Required Signatures ({requiredSigs} of {signers.length})</Label>
                  <Input
                    type="number"
                    min={1}
                    max={signers.length}
                    value={requiredSigs}
                    onChange={(e) => setRequiredSigs(Number(e.target.value))}
                    className="bg-black border-[#333]"
                    data-testid="input-required-sigs"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Signers</Label>
                    <Button size="sm" variant="outline" onClick={addSigner} data-testid="button-add-signer">
                      Add Signer
                    </Button>
                  </div>
                  {signers.map((signer, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={signer}
                        onChange={(e) => updateSigner(index, e.target.value)}
                        placeholder="0x... or wallet address"
                        className="bg-black border-[#333] font-mono text-sm"
                        data-testid={`input-signer-${index}`}
                      />
                      {signers.length > 1 && (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeSigner(index)}
                          data-testid={`button-remove-signer-${index}`}
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleCreateMultiSig}
                  className="w-full bg-gradient-to-r from-[#FF5AF7] to-[#6B00D7] hover:opacity-90"
                  data-testid="button-create-multisig"
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Create Multi-Sig Wallet
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Hardware Security Tab */}
        <TabsContent value="hardware" className="space-y-6" data-testid="content-hardware">
          <Card className="border border-[#333] bg-[#121212]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Hardware Security Devices
              </CardTitle>
              <CardDescription>
                Connect and manage hardware wallets for maximum security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {hardwareDevices.map((device) => (
                <div key={device.id} className="p-4 rounded-lg border border-[#333] bg-black">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-[#1a1a1a]">
                        <Smartphone className="h-5 w-5 text-[#FF5AF7]" />
                      </div>
                      <div>
                        <h3 className="font-medium">{device.type} {device.model}</h3>
                        <p className="text-sm text-gray-400 mt-1">
                          {device.supportedNetworks.join(', ')}
                        </p>
                        <Badge className="mt-2 bg-blue-500/10 text-blue-500 border-blue-500/20">
                          {device.securityLevel} Security
                        </Badge>
                      </div>
                    </div>
                    <Badge className={device.isConnected 
                      ? "bg-green-500/10 text-green-500 border-green-500/20"
                      : "bg-gray-500/10 text-gray-500 border-gray-500/20"
                    }>
                      {device.isConnected ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Connected
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Disconnected
                        </>
                      )}
                    </Badge>
                  </div>
                </div>
              ))}
              
              <Button 
                variant="outline" 
                className="w-full"
                data-testid="button-connect-device"
              >
                <Key className="mr-2 h-4 w-4" />
                Connect New Hardware Device
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documentation Tab */}
        <TabsContent value="docs" className="space-y-6" data-testid="content-docs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border border-[#333] bg-[#121212] cursor-pointer hover:border-[#FF5AF7] transition-colors"
                  onClick={() => setLocation('/security-tutorials')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[#FF5AF7]" />
                  Security Tutorials
                </CardTitle>
                <CardDescription>
                  Interactive guides for security best practices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  Learn how to maximize your vault security with step-by-step tutorials on multi-signature setups, hardware wallet integration, and Trinity Protocol verification.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-[#333] bg-[#121212] cursor-pointer hover:border-[#FF5AF7] transition-colors"
                  onClick={() => setLocation('/technical-security-docs')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#6B00D7]" />
                  Technical Documentation
                </CardTitle>
                <CardDescription>
                  In-depth security architecture documentation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  Comprehensive technical documentation covering cryptographic protocols, blockchain integrations, and advanced security features.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-[#333] bg-[#121212] cursor-pointer hover:border-[#FF5AF7] transition-colors"
                  onClick={() => setLocation('/military-grade-security')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  Military-Grade Security
                </CardTitle>
                <CardDescription>
                  Enterprise-level security features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  Explore advanced military-grade encryption, quantum-resistant algorithms, and zero-knowledge proof systems protecting your assets.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-[#333] bg-[#121212] cursor-pointer hover:border-[#FF5AF7] transition-colors"
                  onClick={() => setLocation('/trinity-protocol')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Trinity Protocol
                </CardTitle>
                <CardDescription>
                  Multi-chain consensus system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  Deep dive into our revolutionary 2-of-3 multi-chain consensus protocol ensuring unmatched security across Ethereum, Solana, and TON.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityControlCenter;
