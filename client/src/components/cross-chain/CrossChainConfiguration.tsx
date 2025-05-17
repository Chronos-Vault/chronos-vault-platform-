import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { BlockchainType } from '@/contexts/multi-chain-context';
import { AlertCircle, Check, Info, Shield, Clock, Zap, Bell, Lock, Settings2, ArrowRight, DollarSign } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Interface for chain configuration
interface ChainConfiguration {
  id: BlockchainType;
  name: string;
  enabled: boolean;
  gasPrice: number; // Only applicable to some chains
  maxFee: number;
  confirmationBlocks: number;
  priorityLevel: 'low' | 'medium' | 'high';
  customRPC?: string;
  provider: 'default' | 'custom';
}

// Interface for security settings
interface SecuritySettings {
  multiSignatureEnabled: boolean;
  timeLocksEnabled: boolean;
  timeoutMinutes: number;
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  highValueThreshold: number;
  requireAdditionalVerification: boolean;
  verificationThreshold: number;
}

// Interface for optimization settings
interface OptimizationSettings {
  autoOptimizeFees: boolean;
  autoOptimizeSpeed: boolean;
  preferSecurity: boolean;
  batchTransactions: boolean;
  maxBatchSize: number;
  dynamicRoutingEnabled: boolean;
  gasMultiplier: number;
  slippageTolerance: number;
}

// Sample initial chain configurations
const initialChainConfigurations: ChainConfiguration[] = [
  {
    id: BlockchainType.ETHEREUM,
    name: 'Ethereum',
    enabled: true,
    gasPrice: 30, // Gwei
    maxFee: 100, // Gwei
    confirmationBlocks: 3,
    priorityLevel: 'medium',
    provider: 'default'
  },
  {
    id: BlockchainType.SOLANA,
    name: 'Solana',
    enabled: true,
    gasPrice: 0.000005, // SOL
    maxFee: 0.001, // SOL
    confirmationBlocks: 32,
    priorityLevel: 'high',
    provider: 'default'
  },
  {
    id: BlockchainType.TON,
    name: 'TON',
    enabled: true,
    gasPrice: 0.05, // TON
    maxFee: 0.5, // TON
    confirmationBlocks: 5,
    priorityLevel: 'medium',
    provider: 'default'
  },
  {
    id: BlockchainType.BITCOIN,
    name: 'Bitcoin',
    enabled: true,
    gasPrice: 10, // Sat/byte
    maxFee: 50, // Sat/byte
    confirmationBlocks: 3,
    priorityLevel: 'low',
    provider: 'default'
  }
];

// Sample initial security settings
const initialSecuritySettings: SecuritySettings = {
  multiSignatureEnabled: false,
  timeLocksEnabled: true,
  timeoutMinutes: 30,
  notificationsEnabled: true,
  emailNotifications: true,
  pushNotifications: false,
  highValueThreshold: 1000, // USD
  requireAdditionalVerification: false,
  verificationThreshold: 5000 // USD
};

// Sample initial optimization settings
const initialOptimizationSettings: OptimizationSettings = {
  autoOptimizeFees: true,
  autoOptimizeSpeed: false,
  preferSecurity: true,
  batchTransactions: false,
  maxBatchSize: 5,
  dynamicRoutingEnabled: true,
  gasMultiplier: 1.1, // 10% extra for faster confirmation
  slippageTolerance: 0.5 // 0.5%
};

const CrossChainConfiguration: React.FC = () => {
  // State for various configuration settings
  const [activeTab, setActiveTab] = useState('chains');
  const [chainConfigurations, setChainConfigurations] = useState<ChainConfiguration[]>(initialChainConfigurations);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(initialSecuritySettings);
  const [optimizationSettings, setOptimizationSettings] = useState<OptimizationSettings>(initialOptimizationSettings);
  const [selectedChain, setSelectedChain] = useState<BlockchainType>(BlockchainType.ETHEREUM);
  const [isLoading, setIsLoading] = useState(false);

  // Helper to find the currently selected chain configuration
  const getSelectedChainConfig = (): ChainConfiguration => {
    return chainConfigurations.find(chain => chain.id === selectedChain) || chainConfigurations[0];
  };

  // Handle saving chain configurations
  const handleSaveChainConfigurations = async () => {
    setIsLoading(true);
    
    try {
      // Here we would call an API to save the configurations
      // For now, we'll just simulate a delay and success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Configuration saved",
        description: "Your chain configurations have been updated successfully.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error saving configuration",
        description: "There was a problem saving your configurations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle saving security settings
  const handleSaveSecuritySettings = async () => {
    setIsLoading(true);
    
    try {
      // Here we would call an API to save the security settings
      // For now, we'll just simulate a delay and success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Security settings saved",
        description: "Your security preferences have been updated successfully.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error saving security settings",
        description: "There was a problem saving your security settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle saving optimization settings
  const handleSaveOptimizationSettings = async () => {
    setIsLoading(true);
    
    try {
      // Here we would call an API to save the optimization settings
      // For now, we'll just simulate a delay and success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Optimization settings saved",
        description: "Your optimization preferences have been updated successfully.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error saving optimization settings",
        description: "There was a problem saving your optimization settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update a specific chain configuration
  const updateChainConfig = (id: BlockchainType, updates: Partial<ChainConfiguration>) => {
    setChainConfigurations(prevConfigs => {
      return prevConfigs.map(config => {
        if (config.id === id) {
          return { ...config, ...updates };
        }
        return config;
      });
    });
  };
  
  // Component for Chain Configuration
  const ChainConfigTab = () => {
    const selectedConfig = getSelectedChainConfig();
    
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {chainConfigurations.map(chain => (
            <Card 
              key={chain.id}
              className={`bg-[#1A1A1A] border-[#333] hover:border-[#6B00D7] cursor-pointer transition-all ${
                selectedChain === chain.id ? 'border-[#6B00D7] ring-1 ring-[#6B00D7]' : ''
              }`}
              onClick={() => setSelectedChain(chain.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-bold text-white">{chain.name}</CardTitle>
                  <Switch 
                    checked={chain.enabled}
                    onCheckedChange={(checked) => updateChainConfig(chain.id, { enabled: checked })}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Priority: {chain.priorityLevel}</span>
                  <span className={chain.enabled ? 'text-green-400' : 'text-gray-500'}>
                    {chain.enabled ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Detailed chain configuration */}
        {selectedConfig && (
          <Card className="bg-[#1A1A1A] border-[#333] shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white">{selectedConfig.name} Configuration</CardTitle>
              <CardDescription className="text-gray-400">
                Configure network settings for {selectedConfig.name}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Provider selection */}
              <div className="space-y-2">
                <Label htmlFor="provider" className="text-white">Provider</Label>
                <Select 
                  value={selectedConfig.provider} 
                  onValueChange={(value) => updateChainConfig(selectedConfig.id, { provider: value as 'default' | 'custom' })}
                >
                  <SelectTrigger id="provider" className="bg-[#242424] border-[#333] text-white">
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#242424] border-[#333]">
                    <SelectItem value="default" className="text-white hover:bg-[#333]">Default Provider</SelectItem>
                    <SelectItem value="custom" className="text-white hover:bg-[#333]">Custom RPC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Custom RPC URL */}
              {selectedConfig.provider === 'custom' && (
                <div className="space-y-2">
                  <Label htmlFor="customRPC" className="text-white">Custom RPC URL</Label>
                  <Input
                    id="customRPC"
                    type="text"
                    value={selectedConfig.customRPC || ''}
                    onChange={(e) => updateChainConfig(selectedConfig.id, { customRPC: e.target.value })}
                    className="bg-[#242424] border-[#333] text-white"
                    placeholder={`Enter custom RPC URL for ${selectedConfig.name}`}
                  />
                </div>
              )}
              
              {/* Gas Price / Fee settings */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="gasPrice" className="text-white">
                    {selectedConfig.id === BlockchainType.ETHEREUM ? 'Gas Price (Gwei)' : 
                     selectedConfig.id === BlockchainType.SOLANA ? 'Transaction Fee (SOL)' :
                     selectedConfig.id === BlockchainType.TON ? 'Transaction Fee (TON)' :
                     'Fee Rate (Sat/byte)'}
                  </Label>
                  <span className="text-gray-400 text-sm">{selectedConfig.gasPrice}</span>
                </div>
                <Slider
                  id="gasPrice"
                  value={[selectedConfig.gasPrice]}
                  onValueChange={(values) => updateChainConfig(selectedConfig.id, { gasPrice: values[0] })}
                  max={selectedConfig.id === BlockchainType.ETHEREUM ? 100 : 
                       selectedConfig.id === BlockchainType.SOLANA ? 0.01 :
                       selectedConfig.id === BlockchainType.TON ? 1 : 100}
                  step={selectedConfig.id === BlockchainType.ETHEREUM ? 1 : 
                        selectedConfig.id === BlockchainType.SOLANA ? 0.000001 :
                        selectedConfig.id === BlockchainType.TON ? 0.01 : 1}
                  className="w-full"
                />
              </div>
              
              {/* Max Fee settings */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="maxFee" className="text-white">
                    {selectedConfig.id === BlockchainType.ETHEREUM ? 'Max Fee (Gwei)' : 
                     selectedConfig.id === BlockchainType.SOLANA ? 'Max Fee (SOL)' :
                     selectedConfig.id === BlockchainType.TON ? 'Max Fee (TON)' :
                     'Max Fee Rate (Sat/byte)'}
                  </Label>
                  <span className="text-gray-400 text-sm">{selectedConfig.maxFee}</span>
                </div>
                <Slider
                  id="maxFee"
                  value={[selectedConfig.maxFee]}
                  onValueChange={(values) => updateChainConfig(selectedConfig.id, { maxFee: values[0] })}
                  max={selectedConfig.id === BlockchainType.ETHEREUM ? 300 : 
                       selectedConfig.id === BlockchainType.SOLANA ? 0.1 :
                       selectedConfig.id === BlockchainType.TON ? 5 : 200}
                  step={selectedConfig.id === BlockchainType.ETHEREUM ? 1 : 
                        selectedConfig.id === BlockchainType.SOLANA ? 0.0001 :
                        selectedConfig.id === BlockchainType.TON ? 0.1 : 1}
                  className="w-full"
                />
              </div>
              
              {/* Confirmation blocks */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="confirmationBlocks" className="text-white">Required Confirmations</Label>
                  <span className="text-gray-400 text-sm">{selectedConfig.confirmationBlocks} blocks</span>
                </div>
                <Slider
                  id="confirmationBlocks"
                  value={[selectedConfig.confirmationBlocks]}
                  onValueChange={(values) => updateChainConfig(selectedConfig.id, { confirmationBlocks: values[0] })}
                  min={1}
                  max={selectedConfig.id === BlockchainType.ETHEREUM ? 12 : 
                       selectedConfig.id === BlockchainType.SOLANA ? 64 :
                       selectedConfig.id === BlockchainType.TON ? 10 : 6}
                  step={1}
                  className="w-full"
                />
              </div>
              
              {/* Priority Level */}
              <div className="space-y-2">
                <Label htmlFor="priorityLevel" className="text-white">Priority Level</Label>
                <Select 
                  value={selectedConfig.priorityLevel} 
                  onValueChange={(value) => updateChainConfig(selectedConfig.id, { priorityLevel: value as 'low' | 'medium' | 'high' })}
                >
                  <SelectTrigger id="priorityLevel" className="bg-[#242424] border-[#333] text-white">
                    <SelectValue placeholder="Select priority level" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#242424] border-[#333]">
                    <SelectItem value="low" className="text-white hover:bg-[#333]">Low (Cheaper)</SelectItem>
                    <SelectItem value="medium" className="text-white hover:bg-[#333]">Medium (Balanced)</SelectItem>
                    <SelectItem value="high" className="text-white hover:bg-[#333]">High (Faster)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Blockchain-specific settings */}
              {selectedConfig.id === BlockchainType.ETHEREUM && (
                <div className="p-4 bg-[#242424] rounded-lg space-y-4">
                  <h3 className="text-white font-medium">Ethereum-Specific Settings</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableEIP1559" className="text-white">Enable EIP-1559</Label>
                      <p className="text-xs text-gray-400">Use EIP-1559 fee market for more predictable gas fees</p>
                    </div>
                    <Switch
                      id="enableEIP1559"
                      checked={true}
                      onCheckedChange={(checked) => {}}
                    />
                  </div>
                </div>
              )}
              
              {selectedConfig.id === BlockchainType.SOLANA && (
                <div className="p-4 bg-[#242424] rounded-lg space-y-4">
                  <h3 className="text-white font-medium">Solana-Specific Settings</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="commitmentLevel" className="text-white">Commitment Level</Label>
                    <Select defaultValue="confirmed">
                      <SelectTrigger id="commitmentLevel" className="bg-[#1A1A1A] border-[#333] text-white">
                        <SelectValue placeholder="Select commitment level" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1A1A1A] border-[#333]">
                        <SelectItem value="processed" className="text-white hover:bg-[#333]">Processed (Fastest)</SelectItem>
                        <SelectItem value="confirmed" className="text-white hover:bg-[#333]">Confirmed (Standard)</SelectItem>
                        <SelectItem value="finalized" className="text-white hover:bg-[#333]">Finalized (Safest)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              
              {selectedConfig.id === BlockchainType.TON && (
                <div className="p-4 bg-[#242424] rounded-lg space-y-4">
                  <h3 className="text-white font-medium">TON-Specific Settings</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableWitnesses" className="text-white">Enable Witness Signatures</Label>
                      <p className="text-xs text-gray-400">Use additional witness signatures for enhanced security</p>
                    </div>
                    <Switch
                      id="enableWitnesses"
                      checked={false}
                      onCheckedChange={(checked) => {}}
                    />
                  </div>
                </div>
              )}
              
              {selectedConfig.id === BlockchainType.BITCOIN && (
                <div className="p-4 bg-[#242424] rounded-lg space-y-4">
                  <h3 className="text-white font-medium">Bitcoin-Specific Settings</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="addressFormat" className="text-white">Address Format</Label>
                    <Select defaultValue="segwit">
                      <SelectTrigger id="addressFormat" className="bg-[#1A1A1A] border-[#333] text-white">
                        <SelectValue placeholder="Select address format" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1A1A1A] border-[#333]">
                        <SelectItem value="legacy" className="text-white hover:bg-[#333]">Legacy (P2PKH)</SelectItem>
                        <SelectItem value="segwit" className="text-white hover:bg-[#333]">SegWit (P2SH-P2WPKH)</SelectItem>
                        <SelectItem value="nativeSegwit" className="text-white hover:bg-[#333]">Native SegWit (Bech32)</SelectItem>
                        <SelectItem value="taproot" className="text-white hover:bg-[#333]">Taproot (P2TR)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-end">
              <Button 
                onClick={handleSaveChainConfigurations}
                className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white font-semibold hover:bg-gradient-to-r hover:from-[#6B00D7]/90 hover:to-[#FF5AF7]/90"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Configuration'}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    );
  };
  
  // Component for Security Settings tab
  const SecuritySettingsTab = () => (
    <div className="space-y-8">
      {/* Main security settings card */}
      <Card className="bg-[#1A1A1A] border-[#333] shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">Security Settings</CardTitle>
          <CardDescription className="text-gray-400">
            Configure security preferences for cross-chain operations
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Multi-signature settings */}
          <div className="p-4 bg-[#242424] rounded-lg space-y-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-[#6B00D7] mr-2" />
                <h3 className="text-white font-medium">Multi-Signature Security</h3>
              </div>
              <Switch
                checked={securitySettings.multiSignatureEnabled}
                onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, multiSignatureEnabled: checked }))}
              />
            </div>
            
            {securitySettings.multiSignatureEnabled && (
              <div className="space-y-4 pl-7">
                <div className="space-y-2">
                  <Label className="text-white">Required Signatures</Label>
                  <Select defaultValue="2">
                    <SelectTrigger className="bg-[#1A1A1A] border-[#333] text-white">
                      <SelectValue placeholder="Select required signatures" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1A1A] border-[#333]">
                      <SelectItem value="2" className="text-white hover:bg-[#333]">2 of 3</SelectItem>
                      <SelectItem value="3" className="text-white hover:bg-[#333]">3 of 5</SelectItem>
                      <SelectItem value="custom" className="text-white hover:bg-[#333]">Custom Configuration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-white">Only for High-Value Transactions</Label>
                    <p className="text-xs text-gray-400">Apply multi-signature only to transactions above threshold</p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-white">High-Value Threshold (USD)</Label>
                  <Input
                    type="number"
                    value={securitySettings.highValueThreshold}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, highValueThreshold: parseFloat(e.target.value) }))}
                    className="bg-[#1A1A1A] border-[#333] text-white"
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Time-lock settings */}
          <div className="p-4 bg-[#242424] rounded-lg space-y-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-[#FF5AF7] mr-2" />
                <h3 className="text-white font-medium">Time-Lock Protection</h3>
              </div>
              <Switch
                checked={securitySettings.timeLocksEnabled}
                onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, timeLocksEnabled: checked }))}
              />
            </div>
            
            {securitySettings.timeLocksEnabled && (
              <div className="space-y-4 pl-7">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-white">Time-Lock Duration (minutes)</Label>
                    <span className="text-gray-400 text-sm">{securitySettings.timeoutMinutes} min</span>
                  </div>
                  <Slider
                    value={[securitySettings.timeoutMinutes]}
                    onValueChange={(values) => setSecuritySettings(prev => ({ ...prev, timeoutMinutes: values[0] }))}
                    min={5}
                    max={1440} // 24 hours
                    step={5}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-white">Time-Lock Override Method</Label>
                  <Select defaultValue="2fa">
                    <SelectTrigger className="bg-[#1A1A1A] border-[#333] text-white">
                      <SelectValue placeholder="Select override method" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1A1A] border-[#333]">
                      <SelectItem value="2fa" className="text-white hover:bg-[#333]">2FA Verification</SelectItem>
                      <SelectItem value="email" className="text-white hover:bg-[#333]">Email Confirmation</SelectItem>
                      <SelectItem value="multi" className="text-white hover:bg-[#333]">Multi-Signature Approval</SelectItem>
                      <SelectItem value="none" className="text-white hover:bg-[#333]">No Override (Strict)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
          
          {/* Notification settings */}
          <div className="p-4 bg-[#242424] rounded-lg space-y-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-[#FFB800] mr-2" />
                <h3 className="text-white font-medium">Security Notifications</h3>
              </div>
              <Switch
                checked={securitySettings.notificationsEnabled}
                onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, notificationsEnabled: checked }))}
              />
            </div>
            
            {securitySettings.notificationsEnabled && (
              <div className="space-y-4 pl-7">
                <div className="flex items-center justify-between">
                  <Label className="text-white">Email Notifications</Label>
                  <Switch
                    checked={securitySettings.emailNotifications}
                    onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, emailNotifications: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-white">Push Notifications</Label>
                  <Switch
                    checked={securitySettings.pushNotifications}
                    onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, pushNotifications: checked }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-white">Notification Events</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="event1" className="rounded border-[#333] bg-[#1A1A1A]" defaultChecked />
                      <label htmlFor="event1" className="text-sm text-gray-300">Transaction Initiated</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="event2" className="rounded border-[#333] bg-[#1A1A1A]" defaultChecked />
                      <label htmlFor="event2" className="text-sm text-gray-300">Transaction Completed</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="event3" className="rounded border-[#333] bg-[#1A1A1A]" defaultChecked />
                      <label htmlFor="event3" className="text-sm text-gray-300">Transaction Failed</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="event4" className="rounded border-[#333] bg-[#1A1A1A]" defaultChecked />
                      <label htmlFor="event4" className="text-sm text-gray-300">Security Alert</label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Additional verification */}
          <div className="p-4 bg-[#242424] rounded-lg space-y-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <Lock className="h-5 w-5 text-[#0095FF] mr-2" />
                <h3 className="text-white font-medium">Additional Verification</h3>
              </div>
              <Switch
                checked={securitySettings.requireAdditionalVerification}
                onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, requireAdditionalVerification: checked }))}
              />
            </div>
            
            {securitySettings.requireAdditionalVerification && (
              <div className="space-y-4 pl-7">
                <div className="space-y-2">
                  <Label className="text-white">Verification Threshold (USD)</Label>
                  <Input
                    type="number"
                    value={securitySettings.verificationThreshold}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, verificationThreshold: parseFloat(e.target.value) }))}
                    className="bg-[#1A1A1A] border-[#333] text-white"
                  />
                  <p className="text-xs text-gray-400">Transactions above this amount will require additional verification</p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-white">Verification Method</Label>
                  <Select defaultValue="2fa">
                    <SelectTrigger className="bg-[#1A1A1A] border-[#333] text-white">
                      <SelectValue placeholder="Select verification method" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1A1A] border-[#333]">
                      <SelectItem value="2fa" className="text-white hover:bg-[#333]">Two-Factor Authentication</SelectItem>
                      <SelectItem value="email" className="text-white hover:bg-[#333]">Email Verification</SelectItem>
                      <SelectItem value="sms" className="text-white hover:bg-[#333]">SMS Verification</SelectItem>
                      <SelectItem value="biometric" className="text-white hover:bg-[#333]">Biometric Verification</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end">
          <Button 
            onClick={handleSaveSecuritySettings}
            className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white font-semibold hover:bg-gradient-to-r hover:from-[#6B00D7]/90 hover:to-[#FF5AF7]/90"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Security Settings'}
          </Button>
        </CardFooter>
      </Card>
      
      {/* Security recommendations */}
      <Card className="bg-[#1A1A1A] border-[#333] shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">Security Recommendations</CardTitle>
          <CardDescription className="text-gray-400">
            Personalized security recommendations based on your activity
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border border-yellow-500/20 bg-yellow-500/5 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-white font-medium mb-1">Enable Multi-Signature for Large Transfers</h3>
                <p className="text-sm text-gray-400">Your account has processed several high-value transactions (over $10,000) in the past month. We recommend enabling multi-signature security for enhanced protection.</p>
                <Button variant="link" className="text-yellow-500 p-0 h-auto mt-1">
                  Enable Multi-Signature
                </Button>
              </div>
            </div>
            
            <div className="p-4 border border-[#6B00D7]/20 bg-[#6B00D7]/5 rounded-lg flex items-start">
              <Info className="h-5 w-5 text-[#6B00D7] mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-white font-medium mb-1">Enhance Bitcoin Transaction Security</h3>
                <p className="text-sm text-gray-400">Consider upgrading to Native SegWit addresses for your Bitcoin transactions to benefit from lower fees and improved security features.</p>
                <Button variant="link" className="text-[#6B00D7] p-0 h-auto mt-1">
                  Update Bitcoin Settings
                </Button>
              </div>
            </div>
            
            <div className="p-4 border border-green-500/20 bg-green-500/5 rounded-lg flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-white font-medium mb-1">Security Status: Strong</h3>
                <p className="text-sm text-gray-400">Your current security configuration provides strong protection for your cross-chain operations. Continue monitoring your security settings as your transaction patterns evolve.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  
  // Component for Optimization Settings tab
  const OptimizationSettingsTab = () => (
    <div className="space-y-8">
      {/* Main optimization settings card */}
      <Card className="bg-[#1A1A1A] border-[#333] shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">Optimization Settings</CardTitle>
          <CardDescription className="text-gray-400">
            Configure preferences for optimizing cross-chain operations
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Auto-optimization settings */}
          <div className="p-4 bg-[#242424] rounded-lg space-y-4">
            <h3 className="text-white font-medium mb-2">Automatic Optimization</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autoOptimizeFees" className="text-white">Auto-Optimize Fees</Label>
                <p className="text-xs text-gray-400">Automatically adjust fees based on network conditions</p>
              </div>
              <Switch
                id="autoOptimizeFees"
                checked={optimizationSettings.autoOptimizeFees}
                onCheckedChange={(checked) => setOptimizationSettings(prev => ({ ...prev, autoOptimizeFees: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autoOptimizeSpeed" className="text-white">Auto-Optimize for Speed</Label>
                <p className="text-xs text-gray-400">Prioritize transaction speed when network congestion is high</p>
              </div>
              <Switch
                id="autoOptimizeSpeed"
                checked={optimizationSettings.autoOptimizeSpeed}
                onCheckedChange={(checked) => setOptimizationSettings(prev => ({ ...prev, autoOptimizeSpeed: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="preferSecurity" className="text-white">Prefer Security Over Speed</Label>
                <p className="text-xs text-gray-400">Prioritize transaction security over execution speed</p>
              </div>
              <Switch
                id="preferSecurity"
                checked={optimizationSettings.preferSecurity}
                onCheckedChange={(checked) => setOptimizationSettings(prev => ({ ...prev, preferSecurity: checked }))}
              />
            </div>
          </div>
          
          {/* Batch processing settings */}
          <div className="p-4 bg-[#242424] rounded-lg space-y-4">
            <h3 className="text-white font-medium mb-2">Batch Processing</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="batchTransactions" className="text-white">Enable Transaction Batching</Label>
                <p className="text-xs text-gray-400">Group multiple transactions together to reduce fees</p>
              </div>
              <Switch
                id="batchTransactions"
                checked={optimizationSettings.batchTransactions}
                onCheckedChange={(checked) => setOptimizationSettings(prev => ({ ...prev, batchTransactions: checked }))}
              />
            </div>
            
            {optimizationSettings.batchTransactions && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="maxBatchSize" className="text-white">Maximum Batch Size</Label>
                  <span className="text-gray-400 text-sm">{optimizationSettings.maxBatchSize} operations</span>
                </div>
                <Slider
                  id="maxBatchSize"
                  value={[optimizationSettings.maxBatchSize]}
                  onValueChange={(values) => setOptimizationSettings(prev => ({ ...prev, maxBatchSize: values[0] }))}
                  min={2}
                  max={20}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-400">Maximum number of operations to include in a single batch</p>
              </div>
            )}
          </div>
          
          {/* Routing settings */}
          <div className="p-4 bg-[#242424] rounded-lg space-y-4">
            <h3 className="text-white font-medium mb-2">Smart Routing</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dynamicRoutingEnabled" className="text-white">Dynamic Route Optimization</Label>
                <p className="text-xs text-gray-400">Automatically select the optimal cross-chain route</p>
              </div>
              <Switch
                id="dynamicRoutingEnabled"
                checked={optimizationSettings.dynamicRoutingEnabled}
                onCheckedChange={(checked) => setOptimizationSettings(prev => ({ ...prev, dynamicRoutingEnabled: checked }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="routingPreference" className="text-white">Routing Preference</Label>
              <Select defaultValue="balanced">
                <SelectTrigger id="routingPreference" className="bg-[#1A1A1A] border-[#333] text-white">
                  <SelectValue placeholder="Select routing preference" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1A1A] border-[#333]">
                  <SelectItem value="cost" className="text-white hover:bg-[#333]">Lowest Cost</SelectItem>
                  <SelectItem value="speed" className="text-white hover:bg-[#333]">Fastest Execution</SelectItem>
                  <SelectItem value="balanced" className="text-white hover:bg-[#333]">Balanced Approach</SelectItem>
                  <SelectItem value="security" className="text-white hover:bg-[#333]">Maximum Security</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Advanced optimization settings */}
          <div className="p-4 bg-[#242424] rounded-lg space-y-4">
            <h3 className="text-white font-medium mb-2">Advanced Optimization</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="gasMultiplier" className="text-white">Gas Price Multiplier</Label>
                <span className="text-gray-400 text-sm">{optimizationSettings.gasMultiplier}x</span>
              </div>
              <Slider
                id="gasMultiplier"
                value={[optimizationSettings.gasMultiplier]}
                onValueChange={(values) => setOptimizationSettings(prev => ({ ...prev, gasMultiplier: values[0] }))}
                min={0.8}
                max={2}
                step={0.05}
                className="w-full"
              />
              <p className="text-xs text-gray-400">Multiplier applied to estimated gas price (higher = faster, more expensive)</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="slippageTolerance" className="text-white">Slippage Tolerance</Label>
                <span className="text-gray-400 text-sm">{optimizationSettings.slippageTolerance}%</span>
              </div>
              <Slider
                id="slippageTolerance"
                value={[optimizationSettings.slippageTolerance]}
                onValueChange={(values) => setOptimizationSettings(prev => ({ ...prev, slippageTolerance: values[0] }))}
                min={0.1}
                max={5}
                step={0.1}
                className="w-full"
              />
              <p className="text-xs text-gray-400">Maximum allowed price impact for swaps and bridges</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="executionStrategy" className="text-white">Execution Strategy</Label>
              <Select defaultValue="parallel">
                <SelectTrigger id="executionStrategy" className="bg-[#1A1A1A] border-[#333] text-white">
                  <SelectValue placeholder="Select execution strategy" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1A1A] border-[#333]">
                  <SelectItem value="sequential" className="text-white hover:bg-[#333]">Sequential (One by One)</SelectItem>
                  <SelectItem value="parallel" className="text-white hover:bg-[#333]">Parallel (Simultaneous)</SelectItem>
                  <SelectItem value="hybrid" className="text-white hover:bg-[#333]">Hybrid (Adaptive)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400">Strategy for executing multiple cross-chain operations</p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end">
          <Button 
            onClick={handleSaveOptimizationSettings}
            className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white font-semibold hover:bg-gradient-to-r hover:from-[#6B00D7]/90 hover:to-[#FF5AF7]/90"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Optimization Settings'}
          </Button>
        </CardFooter>
      </Card>
      
      {/* Performance insights */}
      <Card className="bg-[#1A1A1A] border-[#333] shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">Performance Insights</CardTitle>
          <CardDescription className="text-gray-400">
            Optimization insights based on your transaction history
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            <div className="p-4 rounded-lg border border-[#333] bg-gradient-to-r from-[#1A1A1A] to-[#242424]">
              <div className="flex items-start">
                <div className="bg-[#6B00D7]/10 p-3 rounded-full mr-4 flex-shrink-0">
                  <Zap className="h-6 w-6 text-[#6B00D7]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Speed Optimization Opportunity</h3>
                  <p className="text-gray-400 mb-3">Based on your transaction patterns, adjusting your gas strategy could improve confirmation times by up to 35%.</p>
                  
                  <div className="bg-[#1A1A1A] p-3 rounded-md mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-300">Current Average Confirmation</span>
                      <span className="text-[#FF5AF7] text-sm">12.4 minutes</span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-300">Optimized Confirmation</span>
                      <span className="text-green-400 text-sm">8.1 minutes</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Additional Cost</span>
                      <span className="text-yellow-400 text-sm">+15%</span>
                    </div>
                  </div>
                  
                  <Button className="bg-[#6B00D7] hover:bg-[#6B00D7]/90 text-white px-4 py-2 rounded-md text-sm font-medium w-full">
                    Apply Speed Optimization
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-lg border border-[#333] bg-gradient-to-r from-[#1A1A1A] to-[#242424]">
              <div className="flex items-start">
                <div className="bg-[#FF5AF7]/10 p-3 rounded-full mr-4 flex-shrink-0">
                  <DollarSign className="h-6 w-6 text-[#FF5AF7]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Fee Optimization Opportunity</h3>
                  <p className="text-gray-400 mb-3">You could reduce transaction fees by up to 22% by batching similar transactions and optimizing execution timing.</p>
                  
                  <div className="bg-[#1A1A1A] p-3 rounded-md mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-300">Current Average Fee</span>
                      <span className="text-[#FF5AF7] text-sm">$12.75 per tx</span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-300">Optimized Fee</span>
                      <span className="text-green-400 text-sm">$9.95 per tx</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Estimated Monthly Savings</span>
                      <span className="text-green-400 text-sm">$84.00</span>
                    </div>
                  </div>
                  
                  <Button className="bg-[#FF5AF7] hover:bg-[#FF5AF7]/90 text-white px-4 py-2 rounded-md text-sm font-medium w-full">
                    Apply Fee Optimization
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  
  // Component for Advanced Config tab
  const AdvancedConfigTab = () => (
    <div className="space-y-8">
      <Card className="bg-[#1A1A1A] border-[#333] shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">Advanced Configuration</CardTitle>
          <CardDescription className="text-gray-400">
            Advanced settings for cross-chain infrastructure
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* API Configuration */}
          <div className="p-4 bg-[#242424] rounded-lg space-y-4">
            <h3 className="text-white font-medium mb-2">API Configuration</h3>
            
            <div className="space-y-2">
              <Label htmlFor="apiRateLimit" className="text-white">API Rate Limit (requests per minute)</Label>
              <Select defaultValue="100">
                <SelectTrigger id="apiRateLimit" className="bg-[#1A1A1A] border-[#333] text-white">
                  <SelectValue placeholder="Select rate limit" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1A1A] border-[#333]">
                  <SelectItem value="50" className="text-white hover:bg-[#333]">50 req/min</SelectItem>
                  <SelectItem value="100" className="text-white hover:bg-[#333]">100 req/min</SelectItem>
                  <SelectItem value="250" className="text-white hover:bg-[#333]">250 req/min</SelectItem>
                  <SelectItem value="500" className="text-white hover:bg-[#333]">500 req/min</SelectItem>
                  <SelectItem value="unlimited" className="text-white hover:bg-[#333]">Unlimited</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="webhookUrl" className="text-white">Webhook URL for Notifications</Label>
              <Input
                id="webhookUrl"
                placeholder="https://your-webhook-endpoint.com/events"
                className="bg-[#1A1A1A] border-[#333] text-white"
              />
              <p className="text-xs text-gray-400">Receive real-time updates about cross-chain operations</p>
            </div>
          </div>
          
          {/* Custom RPC Configuration */}
          <div className="p-4 bg-[#242424] rounded-lg space-y-4">
            <h3 className="text-white font-medium mb-2">Custom RPC Configuration</h3>
            
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <Label className="text-white">Network</Label>
                </div>
                <div className="col-span-2">
                  <Label className="text-white">RPC URL</Label>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="col-span-1">
                  <span className="text-gray-300">Ethereum Mainnet</span>
                </div>
                <div className="col-span-2">
                  <Input 
                    placeholder="https://mainnet.infura.io/v3/your-api-key" 
                    className="bg-[#1A1A1A] border-[#333] text-white"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="col-span-1">
                  <span className="text-gray-300">Solana Mainnet</span>
                </div>
                <div className="col-span-2">
                  <Input 
                    placeholder="https://api.mainnet-beta.solana.com" 
                    className="bg-[#1A1A1A] border-[#333] text-white"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="col-span-1">
                  <span className="text-gray-300">Bitcoin</span>
                </div>
                <div className="col-span-2">
                  <Input 
                    placeholder="https://btc-mainnet.example.com/api" 
                    className="bg-[#1A1A1A] border-[#333] text-white"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="col-span-1">
                  <span className="text-gray-300">TON</span>
                </div>
                <div className="col-span-2">
                  <Input 
                    placeholder="https://toncenter.example.com/api/v2/jsonRPC" 
                    className="bg-[#1A1A1A] border-[#333] text-white"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Advanced Security */}
          <div className="p-4 bg-[#242424] rounded-lg space-y-4">
            <h3 className="text-white font-medium mb-2">Advanced Security</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="zeroKnowledgeProofs" className="text-white">Enable Zero-Knowledge Proofs</Label>
                <p className="text-xs text-gray-400">Enhance privacy with zero-knowledge verification</p>
              </div>
              <Switch id="zeroKnowledgeProofs" defaultChecked={true} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="multiChainVerification" className="text-white">Triple-Chain Verification</Label>
                <p className="text-xs text-gray-400">Verify high-value transactions across multiple chains</p>
              </div>
              <Switch id="multiChainVerification" defaultChecked={true} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fallbackChain" className="text-white">Fallback Chain</Label>
              <Select defaultValue="eth">
                <SelectTrigger id="fallbackChain" className="bg-[#1A1A1A] border-[#333] text-white">
                  <SelectValue placeholder="Select fallback chain" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1A1A] border-[#333]">
                  <SelectItem value="eth" className="text-white hover:bg-[#333]">Ethereum</SelectItem>
                  <SelectItem value="sol" className="text-white hover:bg-[#333]">Solana</SelectItem>
                  <SelectItem value="ton" className="text-white hover:bg-[#333]">TON</SelectItem>
                  <SelectItem value="btc" className="text-white hover:bg-[#333]">Bitcoin</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400">Chain to use for backup verification if primary fails</p>
            </div>
          </div>
          
          {/* Monitoring Configuration */}
          <div className="p-4 bg-[#242424] rounded-lg space-y-4">
            <h3 className="text-white font-medium mb-2">Monitoring Configuration</h3>
            
            <div className="space-y-2">
              <Label htmlFor="loggingLevel" className="text-white">Logging Level</Label>
              <Select defaultValue="info">
                <SelectTrigger id="loggingLevel" className="bg-[#1A1A1A] border-[#333] text-white">
                  <SelectValue placeholder="Select logging level" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1A1A] border-[#333]">
                  <SelectItem value="error" className="text-white hover:bg-[#333]">Error</SelectItem>
                  <SelectItem value="warn" className="text-white hover:bg-[#333]">Warning</SelectItem>
                  <SelectItem value="info" className="text-white hover:bg-[#333]">Info</SelectItem>
                  <SelectItem value="debug" className="text-white hover:bg-[#333]">Debug</SelectItem>
                  <SelectItem value="verbose" className="text-white hover:bg-[#333]">Verbose</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="anomalyDetection" className="text-white">Anomaly Detection</Label>
                <p className="text-xs text-gray-400">Detect and flag unusual cross-chain activity</p>
              </div>
              <Switch id="anomalyDetection" defaultChecked={true} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="performanceMonitoring" className="text-white">Performance Monitoring</Label>
                <p className="text-xs text-gray-400">Track and analyze cross-chain operation performance</p>
              </div>
              <Switch id="performanceMonitoring" defaultChecked={true} />
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline"
            className="border-[#333] text-gray-400 hover:bg-[#333] hover:text-white"
          >
            Reset to Defaults
          </Button>
          <Button 
            className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white font-semibold hover:bg-gradient-to-r hover:from-[#6B00D7]/90 hover:to-[#FF5AF7]/90"
          >
            Save Advanced Configuration
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="chains" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full bg-[#242424] border-b border-[#333] mb-6">
          <TabsTrigger value="chains" className="flex-1 data-[state=active]:bg-[#333] text-gray-300 data-[state=active]:text-white">
            Chain Configuration
          </TabsTrigger>
          <TabsTrigger value="security" className="flex-1 data-[state=active]:bg-[#333] text-gray-300 data-[state=active]:text-white">
            Security Settings
          </TabsTrigger>
          <TabsTrigger value="optimization" className="flex-1 data-[state=active]:bg-[#333] text-gray-300 data-[state=active]:text-white">
            Optimization
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex-1 data-[state=active]:bg-[#333] text-gray-300 data-[state=active]:text-white">
            Advanced
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="chains">
          <ChainConfigTab />
        </TabsContent>
        
        <TabsContent value="security">
          <SecuritySettingsTab />
        </TabsContent>
        
        <TabsContent value="optimization">
          <OptimizationSettingsTab />
        </TabsContent>
        
        <TabsContent value="advanced">
          <AdvancedConfigTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CrossChainConfiguration;