import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Shield, Calendar, Users, Check, AlertTriangle } from 'lucide-react';
import { TransactionErrorHandler } from '@/components/transactions/TransactionErrorHandler';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

/**
 * Time Lock Vault Page
 * 
 * Full-featured time-lock vault with configurable time periods
 * and beneficiary management using TON blockchain.
 */
const TimeLockVaultPage: React.FC = () => {
  // State for vault configuration
  const [vaultName, setVaultName] = useState('');
  const [unlockDate, setUnlockDate] = useState('');
  const [unlockPeriod, setUnlockPeriod] = useState(30); // days
  const [extendable, setExtendable] = useState(true);
  const [securityLevel, setSecurityLevel] = useState('standard');
  const [isLocked, setIsLocked] = useState(false);
  const [lockProgress, setLockProgress] = useState(0);

  // Demo function to simulate locking assets
  const handleLockAssets = () => {
    if (!vaultName || !unlockDate) {
      return;
    }
    
    setIsLocked(true);
    setLockProgress(0);
    
    // Simulate lock progress
    const interval = setInterval(() => {
      setLockProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  return (
    <div className="container mx-auto py-6 relative z-10 bg-gradient-to-b from-[#121212] to-[#19141E]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Time Lock Vault</h1>
        <p className="text-muted-foreground">
          Secure your assets with time-based locking mechanisms
        </p>
      </div>
      
      {/* Display transaction errors if any */}
      <TransactionErrorHandler position="top" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border border-[#6B00D7]/20 bg-gradient-to-b from-[#1A1A1A] to-[#121212] shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-400" />
                Vault Configuration
              </CardTitle>
              <CardDescription>
                Configure time lock parameters and security settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="vaultName">Vault Name</Label>
                  <Input 
                    id="vaultName"
                    placeholder="Enter a name for your vault"
                    value={vaultName}
                    onChange={(e) => setVaultName(e.target.value)}
                    className="bg-black/30 border-gray-700"
                    disabled={isLocked}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="unlockDate">Unlock Date</Label>
                    <Input 
                      id="unlockDate"
                      type="date"
                      value={unlockDate}
                      onChange={(e) => setUnlockDate(e.target.value)}
                      className="bg-black/30 border-gray-700"
                      disabled={isLocked}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="securityLevel">Security Level</Label>
                    <Select 
                      defaultValue={securityLevel} 
                      onValueChange={setSecurityLevel}
                      disabled={isLocked}
                    >
                      <SelectTrigger className="bg-black/30 border-gray-700">
                        <SelectValue placeholder="Select security level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="enhanced">Enhanced</SelectItem>
                        <SelectItem value="maximum">Maximum</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Time Lock Period (days): {unlockPeriod}</Label>
                  <Slider 
                    defaultValue={[unlockPeriod]} 
                    max={365} 
                    min={1} 
                    step={1} 
                    onValueChange={(value) => setUnlockPeriod(value[0])}
                    disabled={isLocked}
                    className="py-4"
                  />
                </div>
                
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="extendable" className="flex items-center gap-2 cursor-pointer">
                    <Calendar className="h-4 w-4 text-purple-400" />
                    Allow time extension
                  </Label>
                  <Switch 
                    id="extendable" 
                    checked={extendable}
                    onCheckedChange={setExtendable}
                    disabled={isLocked}
                  />
                </div>
                
                {isLocked ? (
                  <div className="bg-black/30 rounded-lg p-4 border border-green-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <h3 className="font-medium text-green-500">Vault Successfully Locked</h3>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">
                      Your assets are now securely locked until {new Date(unlockDate).toLocaleDateString()} 
                      ({unlockPeriod} days from now).
                    </p>
                    <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-green-300" 
                        style={{ width: `${lockProgress}%` }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <Button 
                    onClick={handleLockAssets}
                    className="w-full" 
                    disabled={!vaultName || !unlockDate}
                  >
                    Lock Assets in Vault
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6 border border-[#6B00D7]/20 bg-gradient-to-b from-[#1A1A1A] to-[#121212] shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-400" />
                Beneficiary Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-800/20 flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium">Primary Owner</p>
                      <p className="text-xs text-muted-foreground">0x8Ab...F3e1</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-green-500">Active</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-800/20 flex items-center justify-center">
                      <Users className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium">Recovery Guardian</p>
                      <p className="text-xs text-muted-foreground">0x92c...A2b7</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-green-500">Active</p>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full" disabled={isLocked}>
                  Add Beneficiary
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="border border-[#6B00D7]/20 bg-gradient-to-b from-[#1A1A1A] to-[#121212] shadow-md">
            <CardHeader>
              <CardTitle>Vault Assets</CardTitle>
              <CardDescription>
                Secured by time lock mechanism
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-800/20 flex items-center justify-center">
                      <span className="text-blue-400 font-bold">T</span>
                    </div>
                    <div>
                      <p className="font-medium">TON</p>
                      <p className="text-xs text-muted-foreground">Toncoin</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">100.00</p>
                    <p className="text-xs text-muted-foreground">≈ $340.00</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-800/20 flex items-center justify-center">
                      <span className="text-purple-400 font-bold">C</span>
                    </div>
                    <div>
                      <p className="font-medium">CVT</p>
                      <p className="text-xs text-muted-foreground">Chronos Tokens</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">500.00</p>
                    <p className="text-xs text-muted-foreground">≈ $1,250.00</p>
                  </div>
                </div>
                
                <Button className="w-full mt-4" variant="outline" disabled={isLocked}>
                  Add Assets
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6 border border-[#6B00D7]/20 bg-gradient-to-b from-[#1A1A1A] to-[#121212] shadow-md">
            <CardHeader>
              <CardTitle>Time Lock Security</CardTitle>
              <CardDescription>
                Advanced protection features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center p-2 rounded-md bg-black/20 border border-purple-900/20">
                  <Shield className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Multi-Chain Verification</p>
                    <p className="text-xs text-gray-400">Time validated across multiple blockchains</p>
                  </div>
                </div>
                
                <div className="flex items-center p-2 rounded-md bg-black/20 border border-indigo-900/20">
                  <Clock className="h-5 w-5 text-indigo-400 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Time Oracle Integration</p>
                    <p className="text-xs text-gray-400">Secure and tamper-proof time verification</p>
                  </div>
                </div>
                
                <div className="flex items-center p-2 rounded-md bg-black/20 border border-blue-900/20">
                  <Users className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Emergency Override</p>
                    <p className="text-xs text-gray-400">Multi-signature recovery method</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 border border-amber-500/20 bg-amber-500/5 rounded-md">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-400">Time Lock Warning</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Assets locked in this vault cannot be accessed before the configured unlock date without
                      multi-signature approval from recovery guardians.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TimeLockVaultPage;