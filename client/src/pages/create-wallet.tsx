import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  Shield, 
  Key, 
  Eye, 
  EyeOff,
  Download,
  Copy,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Lock,
  Fingerprint,
  Cpu
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';

export default function CreateWalletPage() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [walletName, setWalletName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [backupCompleted, setBackupCompleted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [selectedChains, setSelectedChains] = useState(['ethereum', 'solana', 'ton']);
  const [seedPhrase, setSeedPhrase] = useState('');
  const [walletCreated, setWalletCreated] = useState(false);

  // Mock seed phrase generation - replace with real cryptographic generation
  const generateSeedPhrase = () => {
    const words = [
      'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract',
      'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid',
      'acoustic', 'acquire', 'across', 'act', 'action', 'actor', 'actress', 'actual'
    ];
    
    const phrase = Array.from({ length: 12 }, () => 
      words[Math.floor(Math.random() * words.length)]
    ).join(' ');
    
    setSeedPhrase(phrase);
  };

  const handleCreateWallet = async () => {
    if (!walletName || !password || password !== confirmPassword) {
      toast({
        title: "Invalid Input",
        description: "Please fill all fields correctly",
        variant: "destructive",
      });
      return;
    }

    if (!termsAccepted) {
      toast({
        title: "Terms Required",
        description: "Please accept the terms and conditions",
        variant: "destructive",
      });
      return;
    }

    // Generate seed phrase and move to backup step
    generateSeedPhrase();
    setStep(2);
  };

  const handleBackupComplete = () => {
    if (!backupCompleted) {
      toast({
        title: "Backup Required",
        description: "Please confirm you have safely stored your seed phrase",
        variant: "destructive",
      });
      return;
    }
    
    setWalletCreated(true);
    setStep(3);
    
    toast({
      title: "Wallet Created Successfully",
      description: "Your Chronos Wallet is ready with Trinity Protocol security",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Copied to clipboard",
    });
  };

  const downloadBackup = () => {
    const backupData = {
      walletName,
      seedPhrase,
      chains: selectedChains,
      created: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chronos-wallet-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const chainOptions = [
    { id: 'ethereum', name: 'Ethereum', color: 'bg-blue-500', icon: '⟠' },
    { id: 'solana', name: 'Solana', color: 'bg-purple-500', icon: '◎' },
    { id: 'ton', name: 'TON', color: 'bg-cyan-500', icon: '💎' },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative px-6 py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-cyan-900/20"></div>
        
        <div className="relative max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="p-4 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl">
                <Wallet className="w-10 h-10" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Create Chronos Wallet
              </h1>
            </div>
            
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Create your secure multi-chain wallet protected by Trinity Protocol with quantum-resistant encryption
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((stepNum) => (
                <React.Fragment key={stepNum}>
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                    step >= stepNum 
                      ? 'bg-gradient-to-r from-purple-500 to-cyan-500 border-purple-500 text-white' 
                      : 'border-gray-600 text-gray-400'
                  }`}>
                    {step > stepNum ? <CheckCircle className="w-5 h-5" /> : stepNum}
                  </div>
                  {stepNum < 3 && (
                    <div className={`w-16 h-0.5 transition-all ${
                      step > stepNum ? 'bg-gradient-to-r from-purple-500 to-cyan-500' : 'bg-gray-600'
                    }`}></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="max-w-2xl mx-auto">
            {step === 1 && (
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Key className="w-6 h-6 text-purple-400" />
                    Wallet Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Wallet Name */}
                  <div>
                    <Label htmlFor="walletName">Wallet Name</Label>
                    <Input
                      id="walletName"
                      value={walletName}
                      onChange={(e) => setWalletName(e.target.value)}
                      placeholder="My Chronos Wallet"
                      className="mt-2 bg-gray-800 border-gray-700"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <Label htmlFor="password">Master Password</Label>
                    <div className="relative mt-2">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a strong password"
                        className="bg-gray-800 border-gray-700 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="mt-2 bg-gray-800 border-gray-700"
                    />
                  </div>

                  {/* Chain Selection */}
                  <div>
                    <Label>Supported Chains</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                      {chainOptions.map((chain) => (
                        <div key={chain.id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{chain.icon}</span>
                              <span className="font-semibold">{chain.name}</span>
                            </div>
                            <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                          </div>
                          <p className="text-sm text-gray-400">Trinity Protocol Security</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Security Features */}
                  <div className="bg-gray-800/30 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-green-400" />
                      Security Features
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-blue-400" />
                        <span>Quantum Resistant</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Fingerprint className="w-4 h-4 text-purple-400" />
                        <span>Zero-Knowledge</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-cyan-400" />
                        <span>Trinity Protocol</span>
                      </div>
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={termsAccepted}
                      onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                    />
                    <Label htmlFor="terms" className="text-sm text-gray-300">
                      I agree to the <Link href="/terms-of-service" className="text-purple-400 hover:text-purple-300">Terms of Service</Link> and understand that I am responsible for securely storing my seed phrase
                    </Label>
                  </div>

                  <Button
                    onClick={handleCreateWallet}
                    className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
                    disabled={!walletName || !password || !termsAccepted}
                  >
                    Create Wallet
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-yellow-400" />
                    Secure Your Wallet
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-yellow-900/20 border border-yellow-600/30 p-4 rounded-lg">
                    <h3 className="font-semibold text-yellow-400 mb-2">Important Security Notice</h3>
                    <p className="text-sm text-gray-300">
                      Your seed phrase is the master key to your wallet. Store it securely offline and never share it with anyone.
                    </p>
                  </div>

                  <div>
                    <Label>Your 12-Word Seed Phrase</Label>
                    <div className="mt-3 p-4 bg-gray-800 border border-gray-600 rounded-lg">
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {seedPhrase.split(' ').map((word, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-gray-900 rounded">
                            <span className="text-xs text-gray-400 w-4">{index + 1}</span>
                            <span className="font-mono">{word}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(seedPhrase)}
                          className="flex-1"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={downloadBackup}
                          className="flex-1"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="backup"
                      checked={backupCompleted}
                      onCheckedChange={(checked) => setBackupCompleted(checked === true)}
                    />
                    <Label htmlFor="backup" className="text-sm text-gray-300">
                      I have safely stored my seed phrase and understand that losing it means losing access to my wallet
                    </Label>
                  </div>

                  <Button
                    onClick={handleBackupComplete}
                    className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
                    disabled={!backupCompleted}
                  >
                    Continue to Wallet
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            )}

            {step === 3 && walletCreated && (
              <Card className="bg-gray-900/50 border-green-600/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    Wallet Created Successfully
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 text-center">
                  <div className="p-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Wallet className="w-10 h-10 text-white" />
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-4">Welcome to Chronos Wallet!</h2>
                    <p className="text-gray-400 mb-6">
                      Your multi-chain wallet "{walletName}" is now protected by Trinity Protocol security across Ethereum, Solana, and TON networks.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      <div className="p-4 bg-gray-800/50 rounded-lg">
                        <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
                        <h3 className="font-semibold">Quantum Secure</h3>
                        <p className="text-sm text-gray-400">Protected by advanced cryptography</p>
                      </div>
                      <div className="p-4 bg-gray-800/50 rounded-lg">
                        <Cpu className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                        <h3 className="font-semibold">Trinity Protocol</h3>
                        <p className="text-sm text-gray-400">Triple-chain verification</p>
                      </div>
                      <div className="p-4 bg-gray-800/50 rounded-lg">
                        <Key className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                        <h3 className="font-semibold">Your Keys</h3>
                        <p className="text-sm text-gray-400">You own and control everything</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link href="/wallet" className="flex-1">
                        <Button className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600">
                          Access My Wallet
                        </Button>
                      </Link>
                      <Link href="/my-vaults" className="flex-1">
                        <Button variant="outline" className="w-full">
                          Create Your First Vault
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}