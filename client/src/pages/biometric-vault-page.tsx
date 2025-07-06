import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BiometricAuth } from '@/components/biometric/biometric-auth';
import { VaultBiometricIntegration } from '@/components/biometric/vault-biometric-integration';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Fingerprint, Shield, Clock, Key, Check, X, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BlockchainType } from '@/components/multi-signature/multi-signature-vault';

const BiometricVaultPage: React.FC = () => {
  // Vault settings
  const [vaultName, setVaultName] = useState<string>('My Biometric Vault');
  const [vaultDescription, setVaultDescription] = useState<string>('');
  const [selectedBlockchain, setSelectedBlockchain] = useState<BlockchainType>(BlockchainType.ETHEREUM);
  const [unlockDate, setUnlockDate] = useState<string>('');
  const [biometricVerified, setBiometricVerified] = useState<boolean>(false);
  
  // Mock user ID - in a real app, this would come from authentication
  const userId = 'user-123';
  const username = 'Demo User';
  
  // Security settings
  const [enableBackupKey, setEnableBackupKey] = useState<boolean>(true);
  const [requireBiometricUnlock, setRequireBiometricUnlock] = useState<boolean>(true);
  const [recoveryEmail, setRecoveryEmail] = useState<string>('');
  const [securityLevel, setSecurityLevel] = useState<number>(85);
  
  // Vault state
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [createSuccess, setCreateSuccess] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string | null>(null);
  
  // Handle successful authentication
  const handleBiometricAuthSuccess = (authUserId: string) => {
    setBiometricVerified(true);
    console.log('Biometric authentication successful for user:', authUserId);
  };
  
  // Handle failed authentication
  const handleBiometricAuthFailure = (error: string) => {
    setBiometricVerified(false);
    console.error('Biometric authentication failed:', error);
  };
  
  // Create vault
  const handleCreateVault = async () => {
    // Validate form
    if (!vaultName) {
      setCreateError('Please provide a name for your vault');
      return;
    }
    
    setIsCreating(true);
    setCreateError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setCreateSuccess(true);
      
      // Reset in development mode
      setTimeout(() => {
        setCreateSuccess(false);
        setIsCreating(false);
      }, 5000);
    } catch (error) {
      console.error('Error creating vault:', error);
      setCreateError('Failed to create vault. Please try again.');
      setIsCreating(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Left column - Vault creation form */}
          <div className="w-full md:w-7/12">
            <Card className="bg-black/40 border-gray-800">
              <CardHeader className="border-b border-gray-800 pb-4">
                <div className="flex items-center mb-2">
                  <div className="bg-[#00D7C3]/20 p-2 rounded-full mr-2">
                    <Fingerprint className="h-5 w-5 text-[#00D7C3]" />
                  </div>
                  <CardTitle>Biometric Vault</CardTitle>
                </div>
                <CardDescription>
                  Create a secure vault with fingerprint or facial recognition authentication.
                  This vault type provides an additional layer of security for your digital assets using WebAuthn standards.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-6 space-y-6">
                {/* Vault creation success message */}
                {createSuccess && (
                  <Alert className="bg-green-900/20 border-green-800 mb-6">
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Vault Created Successfully</AlertTitle>
                    <AlertDescription>
                      Your biometric vault has been created. You can now safely store your assets.
                    </AlertDescription>
                  </Alert>
                )}
                
                {/* Error message */}
                {createError && (
                  <Alert className="bg-red-900/20 border-red-800 mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{createError}</AlertDescription>
                  </Alert>
                )}
                
                {/* Vault details */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="vault-name">Vault Name</Label>
                    <Input 
                      id="vault-name" 
                      value={vaultName} 
                      onChange={(e) => setVaultName(e.target.value)} 
                      placeholder="My Biometric Vault"
                      className="bg-black/40 border-gray-700"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vault-description">Description (Optional)</Label>
                    <Textarea 
                      id="vault-description" 
                      value={vaultDescription} 
                      onChange={(e) => setVaultDescription(e.target.value)} 
                      placeholder="Describe the purpose of this vault"
                      className="bg-black/40 border-gray-700 min-h-[80px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="blockchain">Blockchain</Label>
                    <Select 
                      value={selectedBlockchain.toString()} 
                      onValueChange={(value) => setSelectedBlockchain(parseInt(value))}
                    >
                      <SelectTrigger className="bg-black/40 border-gray-700">
                        <SelectValue placeholder="Select a blockchain" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/90 border-gray-700">
                        <SelectItem value={BlockchainType.ETHEREUM.toString()}>Ethereum</SelectItem>
                        <SelectItem value={BlockchainType.SOLANA.toString()}>Solana</SelectItem>
                        <SelectItem value={BlockchainType.TON.toString()}>TON</SelectItem>
                        <SelectItem value={BlockchainType.BITCOIN.toString()}>Bitcoin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="unlock-date">Unlock Date (Optional)</Label>
                    <Input 
                      id="unlock-date" 
                      type="date"
                      value={unlockDate} 
                      onChange={(e) => setUnlockDate(e.target.value)} 
                      className="bg-black/40 border-gray-700"
                    />
                    <p className="text-xs text-gray-500">
                      If set, the vault contents will remain locked until this date.
                      You'll still need biometric authentication to access the vault after the unlock date.
                    </p>
                  </div>
                </div>
                
                {/* Security Options */}
                <div className="space-y-4 pt-4 border-t border-gray-800">
                  <h3 className="font-medium">Security Settings</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Enable Backup Key</h4>
                      <p className="text-xs text-gray-500">
                        Create a backup key for recovery if biometric authentication fails
                      </p>
                    </div>
                    <Switch 
                      checked={enableBackupKey}
                      onCheckedChange={setEnableBackupKey}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Require Biometric for Unlock</h4>
                      <p className="text-xs text-gray-500">
                        Always require biometric authentication for accessing vault
                      </p>
                    </div>
                    <Switch 
                      checked={requireBiometricUnlock}
                      onCheckedChange={setRequireBiometricUnlock}
                    />
                  </div>
                  
                  {enableBackupKey && (
                    <div className="space-y-2">
                      <Label htmlFor="recovery-email">Recovery Email</Label>
                      <Input 
                        id="recovery-email" 
                        type="email"
                        value={recoveryEmail} 
                        onChange={(e) => setRecoveryEmail(e.target.value)} 
                        placeholder="your-email@example.com"
                        className="bg-black/40 border-gray-700"
                      />
                      <p className="text-xs text-gray-500">
                        We'll send recovery instructions to this email if you need to restore access.
                      </p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="security-level">Security Level: {securityLevel}%</Label>
                      <span className="text-sm text-[#00D7C3]">
                        {securityLevel < 60 ? 'Basic' : securityLevel < 80 ? 'Strong' : 'Maximum'}
                      </span>
                    </div>
                    <Slider
                      id="security-level"
                      min={50}
                      max={100}
                      step={5}
                      value={[securityLevel]}
                      onValueChange={(value) => setSecurityLevel(value[0])}
                      className="py-4"
                    />
                    <p className="text-xs text-gray-500">
                      Higher security levels provide more protection but may require additional verification steps.
                    </p>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="border-t border-gray-800 pt-4">
                <Button 
                  className="w-full bg-gradient-to-r from-[#00D7C3] to-[#3F51FF] hover:from-[#00B0A0] hover:to-[#3646E5]"
                  disabled={isCreating || !biometricVerified}
                  onClick={handleCreateVault}
                >
                  {isCreating ? (
                    <>
                      <span className="animate-spin mr-2">⟳</span>
                      Creating Vault...
                    </>
                  ) : !biometricVerified ? (
                    'Verify Biometrics First'
                  ) : (
                    'Create Biometric Vault'
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Right column - Biometric authentication */}
          <div className="w-full md:w-5/12 mt-8 md:mt-0">
            <Tabs defaultValue="authenticate" className="w-full">
              <TabsList className="w-full bg-black/40 border-gray-800">
                <TabsTrigger value="authenticate" className="flex-1">Authenticate</TabsTrigger>
                <TabsTrigger value="settings" className="flex-1">Biometric Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="authenticate" className="pt-6">
                <BiometricAuth 
                  userId={userId}
                  username={username}
                  onAuthSuccess={handleBiometricAuthSuccess}
                  onAuthFailure={handleBiometricAuthFailure}
                  mode="authenticate"
                />
                
                {/* Verification status */}
                <div className="mt-6">
                  <Card className="bg-black/40 border-gray-800">
                    <CardContent className="pt-6">
                      <div className="flex items-center">
                        <div 
                          className={`w-3 h-3 rounded-full mr-2 ${biometricVerified ? 'bg-green-500' : 'bg-red-500'}`}
                        />
                        <span className="font-medium">
                          Biometric Verification: {biometricVerified ? 'Verified' : 'Not Verified'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-2">
                        {biometricVerified 
                          ? 'You can now create your biometric vault.' 
                          : 'You must verify your biometric credentials before creating a vault.'}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="settings" className="pt-6">
                <VaultBiometricIntegration 
                  userId={userId}
                  username={username}
                  onBiometricEnabled={setBiometricVerified}
                  isEnabled={biometricVerified}
                />
              </TabsContent>
            </Tabs>
            
            {/* Security benefits card */}
            <Card className="mt-6 bg-black/40 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <Shield className="w-4 h-4 mr-2 text-[#00D7C3]" />
                  Biometric Security Benefits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-[#00D7C3]/20 p-1.5 rounded-full mr-3 mt-0.5">
                    <Fingerprint className="h-3.5 w-3.5 text-[#00D7C3]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Unique Physical Authentication</h4>
                    <p className="text-xs text-gray-400">
                      Your fingerprint or face ID is unique to you and can't be replicated or stolen like passwords.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-[#00D7C3]/20 p-1.5 rounded-full mr-3 mt-0.5">
                    <Shield className="h-3.5 w-3.5 text-[#00D7C3]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Phishing-Resistant Security</h4>
                    <p className="text-xs text-gray-400">
                      Biometric authentication is immune to phishing attacks since there are no credentials to steal.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-[#00D7C3]/20 p-1.5 rounded-full mr-3 mt-0.5">
                    <Key className="h-3.5 w-3.5 text-[#00D7C3]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Hardware-Backed Cryptography</h4>
                    <p className="text-xs text-gray-400">
                      Your biometric data never leaves your device and is processed in secure hardware enclaves.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-[#00D7C3]/20 p-1.5 rounded-full mr-3 mt-0.5">
                    <Clock className="h-3.5 w-3.5 text-[#00D7C3]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Instant Verification</h4>
                    <p className="text-xs text-gray-400">
                      Access your vault instantly with a quick fingerprint scan or facial recognition.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiometricVaultPage;