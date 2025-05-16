import { useState } from 'react';
import { motion } from 'framer-motion';
import { TonWalletSelector } from '@/components/ton/TonWalletSelector';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Clock, Lock, Shield, Calendar, ArrowRight, AlertCircle, CheckCircle2, Zap } from 'lucide-react';
import { WalletInfo, ConnectionStatus } from '@/lib/ton/enhanced-ton-connector';

export default function TonSpecificVaultPage() {
  const [selectedTab, setSelectedTab] = useState('create');
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [vaultName, setVaultName] = useState('');
  const [unlockDate, setUnlockDate] = useState('');
  const [securityLevel, setSecurityLevel] = useState('standard');
  const [useSmartRecovery, setUseSmartRecovery] = useState(false);
  const [isCreatingVault, setIsCreatingVault] = useState(false);
  const [vaultCreated, setVaultCreated] = useState(false);
  const [vaultCreationStep, setVaultCreationStep] = useState(0);
  const { toast } = useToast();

  // Calculate today + 1 year as default date
  const defaultDate = new Date();
  defaultDate.setFullYear(defaultDate.getFullYear() + 1);
  const defaultDateString = defaultDate.toISOString().split('T')[0];

  // Handle wallet connection
  const handleWalletConnected = (wallet: WalletInfo) => {
    setWalletInfo(wallet);
    toast({
      title: 'Wallet Connected',
      description: `Successfully connected to ${wallet.name}`,
      variant: 'default',
    });
  };

  // Handle wallet disconnection
  const handleWalletDisconnected = () => {
    setWalletInfo(null);
    toast({
      title: 'Wallet Disconnected',
      description: 'Your TON wallet has been disconnected',
      variant: 'default',
    });
  };

  // Handle vault creation
  const handleCreateVault = async () => {
    if (!walletInfo) {
      toast({
        title: 'Wallet Required',
        description: 'Please connect your TON wallet to create a vault',
        variant: 'destructive',
      });
      return;
    }

    if (!vaultName) {
      toast({
        title: 'Vault Name Required',
        description: 'Please enter a name for your vault',
        variant: 'destructive',
      });
      return;
    }

    if (!unlockDate) {
      toast({
        title: 'Unlock Date Required',
        description: 'Please select when your vault should unlock',
        variant: 'destructive',
      });
      return;
    }

    // Simulate vault creation
    setIsCreatingVault(true);
    setVaultCreationStep(1);

    // Simulate TON blockchain interaction
    setTimeout(() => {
      setVaultCreationStep(2);
      
      setTimeout(() => {
        setVaultCreationStep(3);
        
        setTimeout(() => {
          setVaultCreationStep(4);
          setIsCreatingVault(false);
          setVaultCreated(true);
          
          toast({
            title: 'Vault Created Successfully',
            description: `Your TON-optimized vault "${vaultName}" has been created!`,
            variant: 'default',
          });
        }, 2000);
      }, 2000);
    }, 2000);
  };

  // Render vault creation progress
  const renderCreationProgress = () => {
    return (
      <div className="space-y-4 mt-6">
        <div className="flex items-center space-x-3">
          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${vaultCreationStep >= 1 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
            {vaultCreationStep > 1 ? <CheckCircle2 className="h-5 w-5" /> : '1'}
          </div>
          <div className="flex-1">
            <p className={`font-medium ${vaultCreationStep >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
              Initializing TON contract
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${vaultCreationStep >= 2 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
            {vaultCreationStep > 2 ? <CheckCircle2 className="h-5 w-5" /> : '2'}
          </div>
          <div className="flex-1">
            <p className={`font-medium ${vaultCreationStep >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
              Creating vault parameters
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${vaultCreationStep >= 3 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
            {vaultCreationStep > 3 ? <CheckCircle2 className="h-5 w-5" /> : '3'}
          </div>
          <div className="flex-1">
            <p className={`font-medium ${vaultCreationStep >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
              Configuring time-lock mechanism
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${vaultCreationStep >= 4 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
            {vaultCreationStep > 4 ? <CheckCircle2 className="h-5 w-5" /> : '4'}
          </div>
          <div className="flex-1">
            <p className={`font-medium ${vaultCreationStep >= 4 ? 'text-primary' : 'text-muted-foreground'}`}>
              Finalizing vault on TON blockchain
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Render security level explanation
  const renderSecurityLevelInfo = () => {
    const levels = {
      standard: {
        title: 'Standard Security',
        description: 'Basic time-lock protection with TON native security.',
        features: ['TON blockchain verification', 'Standard encryption', 'Basic access control'],
        icon: <Shield className="h-12 w-12 text-primary" />,
        fee: 'Low fee (≈ 0.1 TON)'
      },
      enhanced: {
        title: 'Enhanced Security',
        description: 'Advanced protection with cross-chain verification on Ethereum.',
        features: ['TON + Ethereum verification', 'Advanced encryption', 'Multi-factor authentication'],
        icon: <Shield className="h-12 w-12 text-primary" />,
        fee: 'Medium fee (≈ 0.5 TON)'
      },
      fortress: {
        title: 'Fortress Security',
        description: 'Maximum protection with Triple-Chain Security™ verification.',
        features: ['TON + Ethereum + Solana verification', 'Quantum-resistant encryption', 'Advanced anomaly detection'],
        icon: <Shield className="h-12 w-12 text-primary" />,
        fee: 'Higher fee (≈ 1.0 TON)'
      }
    };

    const level = levels[securityLevel as keyof typeof levels];

    return (
      <div className="mt-6 p-4 bg-accent/50 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-background flex items-center justify-center">
            {level.icon}
          </div>
          <div>
            <h3 className="text-lg font-medium">{level.title}</h3>
            <p className="text-sm text-muted-foreground">{level.description}</p>
            <p className="text-sm font-medium mt-1 text-primary">{level.fee}</p>
          </div>
        </div>
        <div className="mt-3">
          <p className="text-sm font-medium mb-1">Features:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            {level.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-screen-xl mx-auto px-4 py-8 md:py-12">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              TON-Optimized <span className="text-gradient-primary">Vault</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl">
              Create specialized vaults that leverage TON's unique capabilities for faster transactions and lower fees.
            </p>
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center justify-between p-4 bg-card rounded-lg border shadow-sm">
            <div className="flex-1">
              <h3 className="font-medium text-lg">Connect TON Wallet</h3>
              <p className="text-muted-foreground">
                Connect your TON wallet to create and manage specialized vaults.
              </p>
            </div>
            <TonWalletSelector
              onWalletConnected={handleWalletConnected}
              onWalletDisconnected={handleWalletDisconnected}
              buttonVariant="default"
              showAddress={true}
            />
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Form */}
            <div className="lg:col-span-2">
              <Tabs
                defaultValue="create"
                value={selectedTab}
                onValueChange={setSelectedTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="create">Create Vault</TabsTrigger>
                  <TabsTrigger value="manage">Manage Vaults</TabsTrigger>
                </TabsList>
                
                <TabsContent value="create">
                  {vaultCreated ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 bg-card rounded-lg border shadow-sm text-center"
                    >
                      <div className="h-24 w-24 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
                        <CheckCircle2 className="h-12 w-12 text-green-600" />
                      </div>
                      <h2 className="text-2xl font-bold mb-2">Vault Created Successfully!</h2>
                      <p className="text-muted-foreground mb-6">
                        Your TON-optimized vault "{vaultName}" has been created and is securely stored on the TON blockchain.
                      </p>
                      <Button
                        onClick={() => {
                          setVaultCreated(false);
                          setVaultName('');
                          setUnlockDate('');
                          setSecurityLevel('standard');
                          setUseSmartRecovery(false);
                          setSelectedTab('manage');
                        }}
                      >
                        View My Vaults
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </motion.div>
                  ) : isCreatingVault ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 bg-card rounded-lg border shadow-sm"
                    >
                      <h2 className="text-xl font-semibold mb-2">Creating Your TON Vault</h2>
                      <p className="text-muted-foreground mb-4">
                        Please wait while we create your vault on the TON blockchain. This process is much faster and cheaper than other blockchains!
                      </p>
                      {renderCreationProgress()}
                    </motion.div>
                  ) : (
                    <Card>
                      <CardHeader>
                        <CardTitle>Create TON-Optimized Vault</CardTitle>
                        <CardDescription>
                          Leverage TON's speed and efficiency to create a time-locked vault with lower fees.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="vault-name">Vault Name</Label>
                          <Input
                            id="vault-name"
                            placeholder="Enter a name for your vault"
                            value={vaultName}
                            onChange={(e) => setVaultName(e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="unlock-date">Unlock Date</Label>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <Input
                              id="unlock-date"
                              type="date"
                              value={unlockDate || defaultDateString}
                              onChange={(e) => setUnlockDate(e.target.value)}
                              min={new Date().toISOString().split('T')[0]}
                            />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Your vault will be locked until this date
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="security-level">Security Level</Label>
                          <Select
                            value={securityLevel}
                            onValueChange={setSecurityLevel}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select security level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="standard">Standard (TON Only)</SelectItem>
                              <SelectItem value="enhanced">Enhanced (TON + Ethereum)</SelectItem>
                              <SelectItem value="fortress">Fortress (Triple-Chain)</SelectItem>
                            </SelectContent>
                          </Select>
                          {renderSecurityLevelInfo()}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="smart-recovery"
                            checked={useSmartRecovery}
                            onCheckedChange={setUseSmartRecovery}
                          />
                          <Label htmlFor="smart-recovery" className="cursor-pointer">
                            Enable Smart Recovery
                          </Label>
                          <div className="ml-auto text-muted-foreground text-xs font-medium bg-accent px-2 py-1 rounded">
                            TON Exclusive
                          </div>
                        </div>
                        
                        {useSmartRecovery && (
                          <div className="p-4 bg-accent/50 rounded-lg">
                            <h4 className="font-medium flex items-center gap-2">
                              <Zap className="h-4 w-4 text-primary" />
                              Smart Recovery Enabled
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              This TON-exclusive feature allows recovery access to the vault through a secure multi-step verification process if the primary unlock conditions cannot be met.
                            </p>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" onClick={() => setSelectedTab('manage')}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateVault} disabled={!walletInfo}>
                          Create Vault
                        </Button>
                      </CardFooter>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="manage">
                  <Card>
                    <CardHeader>
                      <CardTitle>Manage TON Vaults</CardTitle>
                      <CardDescription>
                        View and manage your existing TON-optimized vaults.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {vaultCreated ? (
                        <div className="space-y-4">
                          <div className="p-4 bg-card border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                  <Lock className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <h3 className="font-medium">{vaultName}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    Unlocks on {new Date(unlockDate).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded">
                                  Active
                                </span>
                                <Button variant="ghost" size="icon">
                                  <ArrowRight className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          <p className="text-center text-sm text-muted-foreground">
                            You have 1 active TON vault.
                          </p>
                        </div>
                      ) : (
                        <div className="py-8 text-center">
                          <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                            <Lock className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <h3 className="mt-4 text-lg font-medium">No Vaults Found</h3>
                          <p className="mt-2 text-muted-foreground">
                            You haven't created any TON-optimized vaults yet.
                          </p>
                          <Button 
                            variant="outline" 
                            className="mt-4"
                            onClick={() => setSelectedTab('create')}
                          >
                            Create Your First Vault
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Right Column: TON Benefits */}
            <div>
              <Card className="bg-gradient-to-br from-[#0088CC]/10 to-[#0088CC]/5">
                <CardHeader>
                  <CardTitle>TON Vault Benefits</CardTitle>
                  <CardDescription>
                    Special advantages of using TON for your digital vaults
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#0088CC]/10 flex items-center justify-center">
                      <Zap className="h-5 w-5 text-[#0088CC]" />
                    </div>
                    <div>
                      <h3 className="font-medium">Lower Fees</h3>
                      <p className="text-sm text-muted-foreground">
                        TON's efficient architecture means you pay significantly less in transaction fees compared to Ethereum.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#0088CC]/10 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-[#0088CC]" />
                    </div>
                    <div>
                      <h3 className="font-medium">Faster Transactions</h3>
                      <p className="text-sm text-muted-foreground">
                        TON processes transactions in seconds rather than minutes, providing near-instant vault creation.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#0088CC]/10 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-[#0088CC]" />
                    </div>
                    <div>
                      <h3 className="font-medium">Native Time-Lock Support</h3>
                      <p className="text-sm text-muted-foreground">
                        TON's smart contract architecture has built-in support for time-based operations, making time-locked vaults more efficient.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#0088CC]/10 flex items-center justify-center">
                      <AlertCircle className="h-5 w-5 text-[#0088CC]" />
                    </div>
                    <div>
                      <h3 className="font-medium">Smart Recovery</h3>
                      <p className="text-sm text-muted-foreground">
                        TON-exclusive feature that enables secure recovery options without compromising vault security.
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Triple-Chain Security™</span>: Optionally combine TON's speed with Ethereum and Solana for maximum security.
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}