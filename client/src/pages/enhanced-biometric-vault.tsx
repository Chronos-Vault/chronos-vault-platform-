import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Fingerprint, 
  Eye, 
  Shield, 
  Clock, 
  Key, 
  Check, 
  X, 
  AlertCircle, 
  CheckCircle, 
  ArrowLeft,
  Brain,
  Lock,
  Scan,
  Upload,
  Smartphone
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';

enum BlockchainType {
  ETHEREUM = 'ethereum',
  TON = 'ton',
  SOLANA = 'solana',
  BITCOIN = 'bitcoin',
  MULTI_CHAIN = 'multi-chain'
}

enum BiometricType {
  FINGERPRINT = 'fingerprint',
  FACIAL = 'facial',
  IRIS = 'iris',
  VOICE = 'voice',
  MULTI_FACTOR = 'multi-factor',
  BEHAVIORAL = 'behavioral'
}

enum SecurityLevel {
  STANDARD = 'standard',
  ENHANCED = 'enhanced',
  QUANTUM_RESISTANT = 'quantum-resistant',
  MAXIMUM = 'maximum'
}

const EnhancedBiometricVault: React.FC = () => {
  // General vault settings
  const [vaultName, setVaultName] = useState<string>('My Advanced Biometric Vault');
  const [vaultDescription, setVaultDescription] = useState<string>('');
  const [selectedBlockchain, setSelectedBlockchain] = useState<BlockchainType>(BlockchainType.MULTI_CHAIN);
  const [unlockDate, setUnlockDate] = useState<string>('');
  
  // Enhanced biometric settings
  const [biometricType, setBiometricType] = useState<BiometricType>(BiometricType.MULTI_FACTOR);
  const [biometricVerified, setBiometricVerified] = useState<boolean>(false);
  const [securityLevel, setSecurityLevel] = useState<SecurityLevel>(SecurityLevel.ENHANCED);
  const [biometricScanProgress, setBiometricScanProgress] = useState<number>(0);
  const [scanActive, setScanActive] = useState<boolean>(false);
  const [verificationStep, setVerificationStep] = useState<number>(1);
  
  // Advanced security settings
  const [enableBackupKey, setEnableBackupKey] = useState<boolean>(true);
  const [enableQuantumResistance, setEnableQuantumResistance] = useState<boolean>(true);
  const [enableZeroKnowledge, setEnableZeroKnowledge] = useState<boolean>(true);
  const [enableBehavioralBiometrics, setEnableBehavioralBiometrics] = useState<boolean>(false);
  const [recoveryEmail, setRecoveryEmail] = useState<string>('');
  const [securityScore, setSecurityScore] = useState<number>(85);
  
  // Asset protection settings
  const [enableCrossChainProtection, setEnableCrossChainProtection] = useState<boolean>(true);
  const [enableAutomaticBackup, setEnableAutomaticBackup] = useState<boolean>(true);
  const [backupFrequency, setBackupFrequency] = useState<string>('daily');
  
  // Vault state
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [createSuccess, setCreateSuccess] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<string>('setup');
  
  const { toast } = useToast();
  
  // Mock user data
  const userId = 'user-123';
  const username = 'Demo User';
  
  // Calculate security score based on settings
  useEffect(() => {
    let score = 70; // Base score
    
    // Add points for each security feature
    if (biometricType === BiometricType.MULTI_FACTOR) score += 10;
    if (enableBackupKey) score += 5;
    if (enableQuantumResistance) score += 8;
    if (enableZeroKnowledge) score += 7;
    if (enableBehavioralBiometrics) score += 10;
    if (recoveryEmail) score += 5;
    if (enableCrossChainProtection) score += 5;
    if (enableAutomaticBackup) score += 5;
    
    // Cap at 100
    setSecurityScore(Math.min(score, 100));
  }, [
    biometricType, 
    enableBackupKey, 
    enableQuantumResistance,
    enableZeroKnowledge,
    enableBehavioralBiometrics,
    recoveryEmail,
    enableCrossChainProtection,
    enableAutomaticBackup
  ]);
  
  // Simulate biometric scan process
  const startBiometricScan = () => {
    setBiometricScanProgress(0);
    setScanActive(true);
    
    // Simulate scan progress
    const interval = setInterval(() => {
      setBiometricScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanActive(false);
          handleBiometricAuthSuccess();
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };
  
  // Handle successful authentication
  const handleBiometricAuthSuccess = () => {
    setBiometricVerified(true);
    toast({
      title: "Biometric Authentication Successful",
      description: "Your biometric identity has been verified and secured with blockchain",
      variant: "default",
    });
    
    // Move to next verification step after a delay
    setTimeout(() => {
      if (verificationStep < 3) {
        setVerificationStep(prev => prev + 1);
      }
    }, 1000);
  };
  
  // Handle vault creation
  const handleCreateVault = () => {
    if (!biometricVerified) {
      toast({
        title: "Biometric Verification Required",
        description: "Please complete the biometric verification process before creating your vault",
        variant: "destructive",
      });
      return;
    }
    
    setIsCreating(true);
    
    // Simulate vault creation
    setTimeout(() => {
      setIsCreating(false);
      setCreateSuccess(true);
      toast({
        title: "Vault Created Successfully",
        description: "Your biometric vault has been created and secured on the blockchain",
        variant: "default",
      });
    }, 2000);
  };
  
  // Helper function to get biometric type icon
  const getBiometricIcon = (type: BiometricType) => {
    switch(type) {
      case BiometricType.FINGERPRINT:
        return <Fingerprint className="h-5 w-5" />;
      case BiometricType.FACIAL:
        return <Eye className="h-5 w-5" />;
      case BiometricType.IRIS:
        return <Eye className="h-5 w-5" />;
      case BiometricType.VOICE:
        return <Smartphone className="h-5 w-5" />;
      case BiometricType.MULTI_FACTOR:
        return <Shield className="h-5 w-5" />;
      case BiometricType.BEHAVIORAL:
        return <Brain className="h-5 w-5" />;
      default:
        return <Fingerprint className="h-5 w-5" />;
    }
  };

  // Get verification step label
  const getVerificationStepLabel = (step: number) => {
    switch(step) {
      case 1:
        return "Initial Biometric Scan";
      case 2:
        return "Zero-Knowledge Proof Generation";
      case 3:
        return "Blockchain Anchoring";
      default:
        return "Complete";
    }
  };
  
  // Render the success view
  const renderSuccessView = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-green-100 mb-8">
        <CheckCircle className="h-12 w-12 text-green-600" />
      </div>
      
      <h2 className="text-2xl font-bold mb-4">Biometric Vault Created Successfully</h2>
      <p className="text-gray-300 mb-8 max-w-md mx-auto">
        Your biometric vault has been created and secured with quantum-resistant encryption and blockchain technology.
      </p>
      
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
        <Link href="/dashboard">
          <Button size="lg" variant="default">
            Go to Dashboard
          </Button>
        </Link>
        <Button 
          size="lg" 
          variant="outline"
          onClick={() => {
            setCreateSuccess(false);
            setVaultName('My Advanced Biometric Vault');
            setVaultDescription('');
            setBiometricVerified(false);
            setVerificationStep(1);
          }}
        >
          Create Another Vault
        </Button>
      </div>
    </motion.div>
  );
  
  // Main render
  if (createSuccess) {
    return renderSuccessView();
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <Link href="/vault-types">
          <Button variant="ghost" className="mb-4 hover:bg-blue-900/10">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Vault Types
          </Button>
        </Link>

        <div className="flex items-center mb-4">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-violet-700 flex items-center justify-center shadow-lg shadow-blue-700/30 mr-4">
            <Eye className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-violet-700">
            Advanced Biometric Vault
          </h1>
        </div>
        
        <p className="text-lg text-gray-300 max-w-3xl">
          Create the most secure biometric vault in the blockchain industry with quantum-resistant encryption and zero-knowledge privacy.
        </p>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Vault Setup */}
        <div className="lg:col-span-2">
          <Tabs 
            value={currentTab} 
            onValueChange={setCurrentTab}
            className="bg-black/30 backdrop-blur-sm rounded-xl border border-gray-800 p-6"
          >
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="setup" className="data-[state=active]:bg-blue-900/30">
                <div className="flex flex-col items-center py-1">
                  <Lock className="h-5 w-5 mb-1" />
                  <span>Vault Setup</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="biometrics" className="data-[state=active]:bg-blue-900/30">
                <div className="flex flex-col items-center py-1">
                  <Eye className="h-5 w-5 mb-1" />
                  <span>Biometrics</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-blue-900/30">
                <div className="flex flex-col items-center py-1">
                  <Shield className="h-5 w-5 mb-1" />
                  <span>Security</span>
                </div>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="setup" className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Vault Details</h2>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="vault-name">Vault Name</Label>
                    <Input 
                      id="vault-name"
                      value={vaultName}
                      onChange={(e) => setVaultName(e.target.value)}
                      className="bg-black/30 border-gray-700"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vault-description">Description (Optional)</Label>
                    <Textarea
                      id="vault-description"
                      value={vaultDescription}
                      onChange={(e) => setVaultDescription(e.target.value)}
                      className="bg-black/30 border-gray-700"
                      placeholder="Add details about this vault's purpose"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="blockchain">Blockchain Network</Label>
                    <Select
                      value={selectedBlockchain}
                      onValueChange={(value) => setSelectedBlockchain(value as BlockchainType)}
                    >
                      <SelectTrigger id="blockchain" className="bg-black/30 border-gray-700">
                        <SelectValue placeholder="Select blockchain" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={BlockchainType.ETHEREUM}>Ethereum</SelectItem>
                        <SelectItem value={BlockchainType.TON}>TON</SelectItem>
                        <SelectItem value={BlockchainType.SOLANA}>Solana</SelectItem>
                        <SelectItem value={BlockchainType.BITCOIN}>Bitcoin</SelectItem>
                        <SelectItem value={BlockchainType.MULTI_CHAIN}>Multi-Chain Protection</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {selectedBlockchain === BlockchainType.MULTI_CHAIN && (
                    <Alert className="bg-blue-900/20 border-blue-800">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Enhanced Security</AlertTitle>
                      <AlertDescription>
                        Multi-chain protection provides the highest level of security by distributing your biometric vault across multiple blockchains.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button 
                  onClick={() => setCurrentTab('biometrics')}
                  className="bg-blue-700 hover:bg-blue-800"
                >
                  Continue to Biometrics
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="biometrics" className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Biometric Authentication</h2>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="biometric-type">Biometric Type</Label>
                    <Select
                      value={biometricType}
                      onValueChange={(value) => setBiometricType(value as BiometricType)}
                    >
                      <SelectTrigger id="biometric-type" className="bg-black/30 border-gray-700">
                        <SelectValue placeholder="Select biometric type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={BiometricType.FINGERPRINT}>Fingerprint</SelectItem>
                        <SelectItem value={BiometricType.FACIAL}>Facial Recognition</SelectItem>
                        <SelectItem value={BiometricType.IRIS}>Iris Scan</SelectItem>
                        <SelectItem value={BiometricType.VOICE}>Voice Recognition</SelectItem>
                        <SelectItem value={BiometricType.MULTI_FACTOR}>Multi-Factor Biometrics</SelectItem>
                        <SelectItem value={BiometricType.BEHAVIORAL}>Behavioral Biometrics</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <p className="text-sm text-gray-400 mt-1">
                      {biometricType === BiometricType.MULTI_FACTOR ? 
                        "Combines multiple biometric factors for maximum security" : 
                        "Single-factor biometric authentication"}
                    </p>
                  </div>
                  
                  <Card className="bg-black/20 border-gray-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        {getBiometricIcon(biometricType)}
                        <span className="ml-2">Biometric Verification</span>
                      </CardTitle>
                      <CardDescription>
                        Complete the verification process to create your vault
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Biometric Scan Process */}
                        <div className="space-y-4">
                          {/* Show steps */}
                          <div className="flex items-center justify-between mb-2">
                            {[1, 2, 3].map((step) => (
                              <div 
                                key={step} 
                                className="flex flex-col items-center"
                              >
                                <div 
                                  className={`w-8 h-8 rounded-full flex items-center justify-center 
                                    ${verificationStep > step ? 'bg-green-500 text-white' : 
                                      verificationStep === step ? 'bg-blue-600 text-white' : 
                                        'bg-gray-700 text-gray-300'}`}
                                >
                                  {verificationStep > step ? 
                                    <Check className="h-5 w-5" /> : 
                                    step}
                                </div>
                                <span className="text-xs mt-1 text-gray-400">
                                  {getVerificationStepLabel(step)}
                                </span>
                              </div>
                            ))}
                          </div>
                          
                          {/* Connect steps with lines */}
                          <div className="relative h-1 bg-gray-700 rounded-full -mt-6 mx-6">
                            <div 
                              className="absolute h-1 bg-blue-600 rounded-full transition-all duration-300"
                              style={{ 
                                width: `${(verificationStep - 1) * 50}%`
                              }}
                            />
                          </div>
                          
                          {/* Scan visualization */}
                          <AnimatePresence mode="wait">
                            {!biometricVerified ? (
                              <motion.div
                                key="scan"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="mt-6"
                              >
                                <div className="relative border-2 border-blue-700 rounded-lg p-4 min-h-[150px] flex flex-col items-center justify-center bg-black/40">
                                  {!scanActive ? (
                                    <div className="text-center">
                                      <Eye className="h-16 w-16 mx-auto mb-4 text-blue-500 opacity-70" />
                                      <p className="text-gray-300 mb-4">Ready to scan your biometric data</p>
                                      <Button 
                                        onClick={startBiometricScan}
                                        className="bg-blue-700 hover:bg-blue-800"
                                      >
                                        Start Scan
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="w-full text-center">
                                      <div className="relative mx-auto w-24 h-24 mb-4">
                                        <div className="absolute inset-0 rounded-full border-4 border-blue-500/30 flex items-center justify-center">
                                          <Eye className="h-10 w-10 text-blue-500 animate-pulse" />
                                        </div>
                                        <svg className="w-24 h-24 absolute top-0 left-0 transform -rotate-90">
                                          <circle
                                            className="text-gray-700"
                                            strokeWidth="4"
                                            stroke="currentColor"
                                            fill="transparent"
                                            r="38"
                                            cx="48"
                                            cy="48"
                                          />
                                          <circle
                                            className="text-blue-500"
                                            strokeWidth="4"
                                            strokeDasharray={`${2 * Math.PI * 38}`}
                                            strokeDashoffset={`${2 * Math.PI * 38 * (1 - biometricScanProgress / 100)}`}
                                            strokeLinecap="round"
                                            stroke="currentColor"
                                            fill="transparent"
                                            r="38"
                                            cx="48"
                                            cy="48"
                                          />
                                        </svg>
                                      </div>
                                      <p className="text-blue-400 animate-pulse mb-2">Scanning...</p>
                                      <p className="text-sm text-gray-400">
                                        {biometricScanProgress < 30 && "Initializing biometric scanner..."}
                                        {biometricScanProgress >= 30 && biometricScanProgress < 60 && "Capturing biometric data..."}
                                        {biometricScanProgress >= 60 && biometricScanProgress < 90 && "Processing secure hash..."}
                                        {biometricScanProgress >= 90 && "Completing verification..."}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            ) : (
                              <motion.div
                                key="verified"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-6"
                              >
                                <Card className="border-green-500/30 bg-green-950/20">
                                  <CardContent className="pt-6">
                                    <div className="flex items-center">
                                      <div className="bg-green-500 p-1 rounded-full mr-3">
                                        <Check className="h-4 w-4 text-black" />
                                      </div>
                                      <div>
                                        <h3 className="font-semibold text-green-400">Biometric Verification Complete</h3>
                                        <p className="text-sm text-gray-400">Your biometric identity is secured and blockchain-ready</p>
                                      </div>
                                    </div>
                                    
                                    {verificationStep === 2 && (
                                      <div className="mt-4 bg-black/40 p-3 rounded-md border border-gray-800">
                                        <p className="text-sm text-gray-300">
                                          <span className="text-blue-400">Creating Zero-Knowledge Proof...</span> Your biometric template is being processed through our zero-knowledge system for maximum privacy protection.
                                        </p>
                                      </div>
                                    )}
                                    
                                    {verificationStep === 3 && (
                                      <div className="mt-4 bg-black/40 p-3 rounded-md border border-gray-800">
                                        <p className="text-sm text-gray-300">
                                          <span className="text-blue-400">Anchoring to Blockchain...</span> A secure hash of your biometric template is being anchored to the blockchain for tamper-proof verification.
                                        </p>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="pt-4 flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentTab('setup')}
                >
                  Back
                </Button>
                <Button 
                  onClick={() => setCurrentTab('security')}
                  className="bg-blue-700 hover:bg-blue-800"
                  disabled={!biometricVerified}
                >
                  Continue to Security
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Advanced Security Settings</h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <Card className="bg-black/20 border-gray-800">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Security Level</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <RadioGroup 
                          value={securityLevel}
                          onValueChange={(value) => setSecurityLevel(value as SecurityLevel)}
                          className="space-y-3"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value={SecurityLevel.STANDARD} id="standard" />
                            <Label htmlFor="standard" className="flex items-center">
                              <Shield className="h-4 w-4 mr-2 text-blue-400" />
                              Standard Security
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value={SecurityLevel.ENHANCED} id="enhanced" />
                            <Label htmlFor="enhanced" className="flex items-center">
                              <Shield className="h-4 w-4 mr-2 text-violet-400" />
                              Enhanced Security
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value={SecurityLevel.QUANTUM_RESISTANT} id="quantum" />
                            <Label htmlFor="quantum" className="flex items-center">
                              <Shield className="h-4 w-4 mr-2 text-green-400" />
                              Quantum-Resistant Security
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value={SecurityLevel.MAXIMUM} id="maximum" />
                            <Label htmlFor="maximum" className="flex items-center">
                              <Shield className="h-4 w-4 mr-2 text-amber-400" />
                              Maximum Security (All Features)
                            </Label>
                          </div>
                        </RadioGroup>
                        
                        {securityLevel === SecurityLevel.MAXIMUM && (
                          <Alert className="mt-4 bg-amber-950/30 border-amber-800/50">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Maximum Security Enabled</AlertTitle>
                            <AlertDescription>
                              This activates all security features including quantum-resistant encryption, zero-knowledge proofs, and behavioral biometrics.
                            </AlertDescription>
                          </Alert>
                        )}
                      </CardContent>
                    </Card>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Security Features */}
                      <Card className="bg-black/20 border-gray-800">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">Security Features</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-start gap-2">
                              <Key className="h-4 w-4 mt-0.5 text-gray-400" />
                              <div>
                                <Label htmlFor="backup-key">Backup Recovery Key</Label>
                                <p className="text-xs text-gray-500">Generate an emergency backup key</p>
                              </div>
                            </div>
                            <Switch 
                              id="backup-key"
                              checked={enableBackupKey}
                              onCheckedChange={setEnableBackupKey}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-start gap-2">
                              <Shield className="h-4 w-4 mt-0.5 text-gray-400" />
                              <div>
                                <Label htmlFor="quantum">Quantum-Resistant Encryption</Label>
                                <p className="text-xs text-gray-500">Future-proof against quantum computing</p>
                              </div>
                            </div>
                            <Switch 
                              id="quantum"
                              checked={enableQuantumResistance}
                              onCheckedChange={setEnableQuantumResistance}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-start gap-2">
                              <Lock className="h-4 w-4 mt-0.5 text-gray-400" />
                              <div>
                                <Label htmlFor="zero-knowledge">Zero-Knowledge Proofs</Label>
                                <p className="text-xs text-gray-500">Enhanced privacy protection</p>
                              </div>
                            </div>
                            <Switch 
                              id="zero-knowledge"
                              checked={enableZeroKnowledge}
                              onCheckedChange={setEnableZeroKnowledge}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-start gap-2">
                              <Brain className="h-4 w-4 mt-0.5 text-gray-400" />
                              <div>
                                <Label htmlFor="behavioral">Behavioral Biometrics</Label>
                                <p className="text-xs text-gray-500">Analyze unique usage patterns</p>
                              </div>
                            </div>
                            <Switch 
                              id="behavioral"
                              checked={enableBehavioralBiometrics}
                              onCheckedChange={setEnableBehavioralBiometrics}
                            />
                          </div>
                          
                          <div className="space-y-1 pt-2">
                            <Label htmlFor="recovery-email">Recovery Email (Optional)</Label>
                            <Input 
                              id="recovery-email"
                              value={recoveryEmail}
                              onChange={(e) => setRecoveryEmail(e.target.value)}
                              placeholder="your@email.com"
                              className="bg-black/30 border-gray-700"
                            />
                          </div>
                        </CardContent>
                      </Card>
                      
                      {/* Asset Protection */}
                      <Card className="bg-black/20 border-gray-800">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">Asset Protection</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-start gap-2">
                              <Lock className="h-4 w-4 mt-0.5 text-gray-400" />
                              <div>
                                <Label htmlFor="cross-chain">Cross-Chain Protection</Label>
                                <p className="text-xs text-gray-500">Secure assets across multiple chains</p>
                              </div>
                            </div>
                            <Switch 
                              id="cross-chain"
                              checked={enableCrossChainProtection}
                              onCheckedChange={setEnableCrossChainProtection}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-start gap-2">
                              <Upload className="h-4 w-4 mt-0.5 text-gray-400" />
                              <div>
                                <Label htmlFor="auto-backup">Automatic Backups</Label>
                                <p className="text-xs text-gray-500">Schedule regular backups</p>
                              </div>
                            </div>
                            <Switch 
                              id="auto-backup"
                              checked={enableAutomaticBackup}
                              onCheckedChange={setEnableAutomaticBackup}
                            />
                          </div>
                          
                          {enableAutomaticBackup && (
                            <div className="space-y-1 pt-2">
                              <Label htmlFor="backup-frequency">Backup Frequency</Label>
                              <Select
                                value={backupFrequency}
                                onValueChange={setBackupFrequency}
                              >
                                <SelectTrigger id="backup-frequency" className="bg-black/30 border-gray-700">
                                  <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="hourly">Hourly</SelectItem>
                                  <SelectItem value="daily">Daily</SelectItem>
                                  <SelectItem value="weekly">Weekly</SelectItem>
                                  <SelectItem value="monthly">Monthly</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* Security Score */}
                    <Card className="bg-black/20 border-gray-800">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Security Score</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label>Current Security Score</Label>
                            <span className={`font-semibold 
                              ${securityScore >= 90 ? 'text-green-400' : 
                                securityScore >= 70 ? 'text-blue-400' : 
                                  securityScore >= 50 ? 'text-amber-400' : 'text-red-400'}`}
                            >
                              {securityScore}/100
                            </span>
                          </div>
                          
                          <div className="h-3 w-full bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-500 rounded-full
                                ${securityScore >= 90 ? 'bg-green-500' : 
                                  securityScore >= 70 ? 'bg-blue-500' : 
                                    securityScore >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                              style={{ width: `${securityScore}%` }}
                            />
                          </div>
                          
                          <p className="text-xs text-gray-400">
                            {securityScore >= 90 ? 'Excellent security configuration' : 
                              securityScore >= 70 ? 'Good security configuration' : 
                                securityScore >= 50 ? 'Moderate security configuration' : 'Basic security configuration'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentTab('biometrics')}
                >
                  Back
                </Button>
                <Button 
                  onClick={handleCreateVault}
                  className="bg-blue-700 hover:bg-blue-800"
                  disabled={isCreating || !biometricVerified}
                >
                  {isCreating ? (
                    <>
                      <span className="mr-2 animate-spin">⟳</span>
                      Creating Vault...
                    </>
                  ) : !biometricVerified ? (
                    'Complete Biometric Verification'
                  ) : (
                    'Create Biometric Vault'
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Right Column - Info Cards */}
        <div className="space-y-6">
          <Card className="bg-black/30 backdrop-blur-sm border-gray-800 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-violet-700" />
            <CardHeader>
              <CardTitle>Why Choose Biometric Vaults?</CardTitle>
              <CardDescription>
                The most secure way to protect your digital assets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-900/30 p-1.5 rounded-full">
                  <Fingerprint className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-medium">Unhackable Security</h4>
                  <p className="text-sm text-gray-400">Your unique biometric signature cannot be duplicated or stolen</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-blue-900/30 p-1.5 rounded-full">
                  <Shield className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-medium">Quantum-Resistant</h4>
                  <p className="text-sm text-gray-400">Future-proof encryption that withstands quantum computing attacks</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-blue-900/30 p-1.5 rounded-full">
                  <Lock className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-medium">Zero-Knowledge Proofs</h4>
                  <p className="text-sm text-gray-400">Verify identity without revealing your biometric data</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-blue-900/30 p-1.5 rounded-full">
                  <Brain className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-medium">Multi-Factor Security</h4>
                  <p className="text-sm text-gray-400">Combine different biometric factors for unbreakable protection</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-950/50 to-violet-950/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-lg">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">Premium Feature</span>
              </CardTitle>
              <CardDescription>
                Zero-Knowledge Biometric Authentication
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300 mb-4">
                Our revolutionary technology verifies your biometric identity without storing actual biometric data, ensuring maximum privacy and security.
              </p>
              <Alert className="bg-blue-900/20 border-blue-800 mt-4">
                <Eye className="h-4 w-4" />
                <AlertTitle>Included with All Biometric Vaults</AlertTitle>
                <AlertDescription className="text-xs">
                  This premium feature is included with all biometric vaults at no extra cost.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnhancedBiometricVault;