import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, PhoneCall, ShieldAlert, Wallet } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface EmergencyConfig {
  enableEmergencyWithdrawal: boolean;
  emergencyContact: string;
  contactMethod: string;
  marketCrashThreshold: number;
  securityIncidentResponse: string;
  autoSellThreshold: number | null;
  enableInsurance: boolean;
  recoveryAddress: string;
  multiSigRequired: boolean;
  panicButtonEnabled: boolean;
  additionalSigners: string[];
}

export interface EmergencyProtocolsProps {
  defaultConfig?: Partial<EmergencyConfig>;
  onConfigChange?: (config: EmergencyConfig) => void;
  readOnly?: boolean;
}

export function EmergencyProtocols({
  defaultConfig,
  onConfigChange,
  readOnly = false
}: EmergencyProtocolsProps) {
  const [config, setConfig] = useState<EmergencyConfig>({
    enableEmergencyWithdrawal: defaultConfig?.enableEmergencyWithdrawal ?? false,
    emergencyContact: defaultConfig?.emergencyContact ?? "",
    contactMethod: defaultConfig?.contactMethod ?? "email",
    marketCrashThreshold: defaultConfig?.marketCrashThreshold ?? 30,
    securityIncidentResponse: defaultConfig?.securityIncidentResponse ?? "freeze",
    autoSellThreshold: defaultConfig?.autoSellThreshold ?? null,
    enableInsurance: defaultConfig?.enableInsurance ?? false,
    recoveryAddress: defaultConfig?.recoveryAddress ?? "",
    multiSigRequired: defaultConfig?.multiSigRequired ?? false,
    panicButtonEnabled: defaultConfig?.panicButtonEnabled ?? false,
    additionalSigners: defaultConfig?.additionalSigners ?? []
  });

  const [newSigner, setNewSigner] = useState("");

  const handleConfigChange = (updates: Partial<EmergencyConfig>) => {
    if (readOnly) return;
    
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    onConfigChange?.(newConfig);
  };

  const addSigner = () => {
    if (readOnly || !newSigner) return;
    
    const signers = [...config.additionalSigners, newSigner];
    handleConfigChange({ additionalSigners: signers });
    setNewSigner("");
  };

  const removeSigner = (index: number) => {
    if (readOnly) return;
    
    const signers = [...config.additionalSigners];
    signers.splice(index, 1);
    handleConfigChange({ additionalSigners: signers });
  };

  const securityColor = (config.marketCrashThreshold <= 20) 
    ? "bg-red-500" 
    : config.marketCrashThreshold <= 40 
      ? "bg-orange-500" 
      : config.marketCrashThreshold <= 60 
        ? "bg-yellow-500" 
        : "bg-green-500";

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-black/40 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShieldAlert className="h-5 w-5 mr-2 text-red-400" />
              Emergency Controls
            </CardTitle>
            <CardDescription>
              Configure safety measures for extreme market conditions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emergency-withdrawal" className="text-sm font-medium">
                  Emergency Withdrawal
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  Allow withdrawal before lock period in emergency situations
                </p>
              </div>
              <Switch
                id="emergency-withdrawal"
                checked={config.enableEmergencyWithdrawal}
                onCheckedChange={(checked) => handleConfigChange({ enableEmergencyWithdrawal: checked })}
                disabled={readOnly}
              />
            </div>

            {config.enableEmergencyWithdrawal && (
              <div className="rounded-md border border-yellow-900/50 bg-yellow-950/20 p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="market-crash" className="text-sm font-medium">
                    Market Crash Threshold
                  </Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="market-crash"
                      min={10}
                      max={90}
                      step={5}
                      value={[config.marketCrashThreshold]}
                      onValueChange={(val) => handleConfigChange({ marketCrashThreshold: val[0] })}
                      className="flex-1"
                      disabled={readOnly}
                    />
                    <div 
                      className={cn(
                        "w-12 h-8 rounded flex items-center justify-center text-white font-medium",
                        securityColor
                      )}
                    >
                      {config.marketCrashThreshold}%
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Trigger emergency protocol if market drops by this percentage
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="security-response" className="text-sm font-medium">
                    Security Incident Response
                  </Label>
                  <Select
                    value={config.securityIncidentResponse}
                    onValueChange={(val) => handleConfigChange({ securityIncidentResponse: val })}
                    disabled={readOnly}
                  >
                    <SelectTrigger id="security-response" className="bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Select response" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                      <SelectItem value="freeze">Freeze Assets</SelectItem>
                      <SelectItem value="transfer">Transfer to Recovery Address</SelectItem>
                      <SelectItem value="sell">Auto-Sell to Stablecoin</SelectItem>
                      <SelectItem value="notify">Notify Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {config.securityIncidentResponse === "sell" && (
                  <div className="space-y-2">
                    <Label htmlFor="auto-sell" className="text-sm font-medium">
                      Auto-Sell Threshold
                    </Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        id="auto-sell"
                        min={5}
                        max={50}
                        step={5}
                        value={[config.autoSellThreshold || 20]}
                        onValueChange={(val) => handleConfigChange({ autoSellThreshold: val[0] })}
                        className="flex-1"
                        disabled={readOnly}
                      />
                      <div className="w-12 h-8 bg-red-900/30 rounded border border-red-900 flex items-center justify-center">
                        {config.autoSellThreshold || 20}%
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Assets are sold if market drops by this percentage in 24 hours
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <div>
                <Label className="text-sm font-medium">
                  Vault Insurance
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  Enable protection against smart contract vulnerabilities
                </p>
              </div>
              <Switch
                checked={config.enableInsurance}
                onCheckedChange={(checked) => handleConfigChange({ enableInsurance: checked })}
                disabled={readOnly}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <Label className="text-sm font-medium">
                  Panic Button
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  Enable one-click emergency asset protection
                </p>
              </div>
              <Switch
                checked={config.panicButtonEnabled}
                onCheckedChange={(checked) => handleConfigChange({ panicButtonEnabled: checked })}
                disabled={readOnly}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center">
              <PhoneCall className="h-5 w-5 mr-2 text-blue-400" />
              Contact & Recovery
            </CardTitle>
            <CardDescription>
              Set up emergency contacts and recovery options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emergency-contact" className="text-sm font-medium">
                Emergency Contact
              </Label>
              <Input
                id="emergency-contact"
                placeholder="Email or phone number"
                className="bg-gray-800 border-gray-700"
                value={config.emergencyContact}
                onChange={(e) => handleConfigChange({ emergencyContact: e.target.value })}
                readOnly={readOnly}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Contact Method
              </Label>
              <RadioGroup
                value={config.contactMethod}
                onValueChange={(value) => handleConfigChange({ contactMethod: value })}
                className="flex flex-row space-x-4"
                disabled={readOnly}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="email" id="email" />
                  <Label htmlFor="email" className="cursor-pointer">Email</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sms" id="sms" />
                  <Label htmlFor="sms" className="cursor-pointer">SMS</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="push" id="push" />
                  <Label htmlFor="push" className="cursor-pointer">Push</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recovery-address" className="text-sm font-medium">
                Recovery Address
              </Label>
              <Input
                id="recovery-address"
                placeholder="Blockchain address for emergency recovery"
                className="bg-gray-800 border-gray-700 font-mono text-sm"
                value={config.recoveryAddress}
                onChange={(e) => handleConfigChange({ recoveryAddress: e.target.value })}
                readOnly={readOnly}
              />
              <p className="text-xs text-gray-500">
                Assets will be sent here in case of emergency
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <Label className="text-sm font-medium">
                  Multi-Signature Recovery
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  Require multiple signatures for emergency actions
                </p>
              </div>
              <Switch
                checked={config.multiSigRequired}
                onCheckedChange={(checked) => handleConfigChange({ multiSigRequired: checked })}
                disabled={readOnly}
              />
            </div>

            {config.multiSigRequired && (
              <div className="rounded-md border border-blue-900/50 bg-blue-950/20 p-4 space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Additional Signers
                  </Label>
                  
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Wallet address"
                      className="bg-gray-800 border-gray-700 font-mono text-sm flex-1"
                      value={newSigner}
                      onChange={(e) => setNewSigner(e.target.value)}
                      readOnly={readOnly}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addSigner}
                      disabled={readOnly || !newSigner}
                      className="border-gray-700 text-xs"
                    >
                      Add
                    </Button>
                  </div>
                  
                  {config.additionalSigners.length > 0 ? (
                    <div className="space-y-2 mt-2">
                      {config.additionalSigners.map((signer, index) => (
                        <div key={index} className="flex justify-between items-center bg-gray-800/50 rounded-md px-3 py-2">
                          <div className="flex items-center space-x-2">
                            <Wallet className="h-3 w-3 text-blue-400" />
                            <span className="text-xs font-mono truncate max-w-[200px]">
                              {signer}
                            </span>
                          </div>
                          {!readOnly && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSigner(index)}
                              className="h-6 w-6 p-0 text-gray-400 hover:text-red-400"
                            >
                              &times;
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">
                      No additional signers added
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-black/40 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
            Emergency Response Simulator
          </CardTitle>
          <CardDescription>
            Test your emergency protocols in a simulated environment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="market-crash">
            <TabsList className="bg-gray-800 mb-4">
              <TabsTrigger value="market-crash">Market Crash</TabsTrigger>
              <TabsTrigger value="security-breach">Security Breach</TabsTrigger>
              <TabsTrigger value="smart-contract">Smart Contract</TabsTrigger>
            </TabsList>
            
            <TabsContent value="market-crash" className="space-y-4">
              <div className="bg-gradient-to-r from-red-950/30 to-black/30 rounded-md border border-red-900/40 p-4">
                <h3 className="text-lg font-medium mb-2 text-red-400">Market Crash Simulation</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Test your vault's response to a severe market downturn
                </p>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-black/40 p-3 rounded border border-gray-800">
                      <h4 className="text-xs font-medium text-gray-300 mb-1">Crash Severity</h4>
                      <div className="flex items-center justify-between">
                        <Select defaultValue="moderate">
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-sm h-8">
                            <SelectValue placeholder="Select severity" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-gray-700">
                            <SelectItem value="mild">Mild (10-20%)</SelectItem>
                            <SelectItem value="moderate">Moderate (20-40%)</SelectItem>
                            <SelectItem value="severe">Severe (40-60%)</SelectItem>
                            <SelectItem value="extreme">Extreme (60%+)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="bg-black/40 p-3 rounded border border-gray-800">
                      <h4 className="text-xs font-medium text-gray-300 mb-1">Duration</h4>
                      <div className="flex items-center justify-between">
                        <Select defaultValue="days">
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-sm h-8">
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-gray-700">
                            <SelectItem value="minutes">Minutes</SelectItem>
                            <SelectItem value="hours">Hours</SelectItem>
                            <SelectItem value="days">Days</SelectItem>
                            <SelectItem value="weeks">Weeks</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button variant="destructive" size="sm">
                      Run Simulation
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="rounded-md border border-gray-800 p-4">
                <h3 className="text-sm font-medium mb-2">Simulation Results</h3>
                <p className="text-sm text-gray-500">
                  Run a simulation to see how your emergency protocols would respond
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="security-breach" className="space-y-4">
              <div className="bg-gradient-to-r from-yellow-950/30 to-black/30 rounded-md border border-yellow-900/40 p-4">
                <h3 className="text-lg font-medium mb-2 text-yellow-400">Security Breach Simulation</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Test your vault's response to potential security incidents
                </p>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-black/40 p-3 rounded border border-gray-800">
                      <h4 className="text-xs font-medium text-gray-300 mb-1">Breach Type</h4>
                      <div className="flex items-center justify-between">
                        <Select defaultValue="unauthorized">
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-sm h-8">
                            <SelectValue placeholder="Select breach type" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-gray-700">
                            <SelectItem value="unauthorized">Unauthorized Access</SelectItem>
                            <SelectItem value="malicious">Malicious Transaction</SelectItem>
                            <SelectItem value="phishing">Phishing Attempt</SelectItem>
                            <SelectItem value="exploit">Smart Contract Exploit</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="bg-black/40 p-3 rounded border border-gray-800">
                      <h4 className="text-xs font-medium text-gray-300 mb-1">Severity</h4>
                      <div className="flex items-center justify-between">
                        <Select defaultValue="high">
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-sm h-8">
                            <SelectValue placeholder="Select severity" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-gray-700">
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button variant="destructive" size="sm">
                      Run Simulation
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="rounded-md border border-gray-800 p-4">
                <h3 className="text-sm font-medium mb-2">Simulation Results</h3>
                <p className="text-sm text-gray-500">
                  Run a simulation to see how your emergency protocols would respond
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="smart-contract" className="space-y-4">
              <div className="bg-gradient-to-r from-blue-950/30 to-black/30 rounded-md border border-blue-900/40 p-4">
                <h3 className="text-lg font-medium mb-2 text-blue-400">Smart Contract Simulation</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Test your vault's response to smart contract vulnerabilities
                </p>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-black/40 p-3 rounded border border-gray-800">
                      <h4 className="text-xs font-medium text-gray-300 mb-1">Vulnerability Type</h4>
                      <div className="flex items-center justify-between">
                        <Select defaultValue="reentrancy">
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-sm h-8">
                            <SelectValue placeholder="Select vulnerability" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-gray-700">
                            <SelectItem value="reentrancy">Reentrancy</SelectItem>
                            <SelectItem value="overflow">Integer Overflow</SelectItem>
                            <SelectItem value="frontrunning">Front-running</SelectItem>
                            <SelectItem value="logic">Logic Error</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="bg-black/40 p-3 rounded border border-gray-800">
                      <h4 className="text-xs font-medium text-gray-300 mb-1">Contract</h4>
                      <div className="flex items-center justify-between">
                        <Select defaultValue="vault">
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-sm h-8">
                            <SelectValue placeholder="Select contract" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-gray-700">
                            <SelectItem value="vault">Main Vault</SelectItem>
                            <SelectItem value="strategy">Investment Strategy</SelectItem>
                            <SelectItem value="oracle">Price Oracle</SelectItem>
                            <SelectItem value="bridge">Cross-Chain Bridge</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button variant="destructive" size="sm">
                      Run Simulation
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="rounded-md border border-gray-800 p-4">
                <h3 className="text-sm font-medium mb-2">Simulation Results</h3>
                <p className="text-sm text-gray-500">
                  Run a simulation to see how your emergency protocols would respond
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="rounded-md border border-amber-900/30 bg-amber-950/10 p-4">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-amber-500 mb-1">Important Security Notice</h3>
            <p className="text-xs text-gray-400">
              Emergency protocols are designed to protect your assets in exceptional circumstances. 
              These measures bypass normal vault time-lock restrictions and may incur additional fees 
              or slippage during execution. Always ensure your emergency contact information and 
              recovery addresses are up-to-date.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmergencyProtocols;