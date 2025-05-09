import React, { useState } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Shield, Zap } from "lucide-react";

export interface EmergencyProtocolsProps {
  enabled: boolean;
  securityLevel: number;
  assetType: string;
  crossChainEnabled: boolean;
}

export function EmergencyProtocols({
  enabled,
  securityLevel,
  assetType,
  crossChainEnabled
}: EmergencyProtocolsProps) {
  const [marketCrashProtection, setMarketCrashProtection] = useState<boolean>(true);
  const [crashThreshold, setCrashThreshold] = useState<number>(20); // percentage drop
  const [timeframe, setTimeframe] = useState<string>("24h");
  
  const [flashCrashProtection, setFlashCrashProtection] = useState<boolean>(true);
  const [volatilityProtection, setVolatilityProtection] = useState<boolean>(true);
  const [volatilityThreshold, setVolatilityThreshold] = useState<number>(50); // percentile
  
  const [recoveryMethod, setRecoveryMethod] = useState<string>("stablecoin");
  const [autoReentry, setAutoReentry] = useState<boolean>(false);
  const [reentryConditions, setReentryConditions] = useState<string>("market_recovery");
  
  const [multiSignatureRequired, setMultiSignatureRequired] = useState<boolean>(securityLevel >= 3);
  const [requiredSignatures, setRequiredSignatures] = useState<number>(2);
  const [authorizedAddresses, setAuthorizedAddresses] = useState<string[]>([
    "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", 
    "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"
  ]);
  const [newAddress, setNewAddress] = useState<string>("");
  
  const handleAddAddress = () => {
    if (newAddress && !authorizedAddresses.includes(newAddress)) {
      setAuthorizedAddresses([...authorizedAddresses, newAddress]);
      setNewAddress("");
    }
  };
  
  const handleRemoveAddress = (address: string) => {
    setAuthorizedAddresses(authorizedAddresses.filter(a => a !== address));
  };
  
  return (
    <div className="space-y-6">
      <div>
        <Alert className="bg-amber-900/20 border-amber-700 text-amber-200">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Emergency Protocol Configuration</AlertTitle>
          <AlertDescription>
            These protocols will activate automatically during extreme market conditions to protect your assets.
          </AlertDescription>
        </Alert>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-black/20 border-gray-800">
          <CardContent className="pt-6 space-y-4">
            <h3 className="text-lg font-medium flex items-center">
              <Shield className="h-5 w-5 mr-2 text-amber-500" />
              Market Crash Protection
            </h3>
            
            <div className="flex items-center justify-between">
              <Label>Enable Market Crash Protection</Label>
              <Switch 
                checked={marketCrashProtection} 
                onCheckedChange={setMarketCrashProtection} 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Crash Threshold</Label>
                <span className="text-sm">{crashThreshold}% drop</span>
              </div>
              <Slider
                disabled={!marketCrashProtection}
                value={[crashThreshold]}
                min={5}
                max={50}
                step={1}
                onValueChange={(values) => setCrashThreshold(values[0])}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Timeframe</Label>
              <Select 
                disabled={!marketCrashProtection}
                value={timeframe} 
                onValueChange={setTimeframe}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">1 hour</SelectItem>
                  <SelectItem value="6h">6 hours</SelectItem>
                  <SelectItem value="24h">24 hours</SelectItem>
                  <SelectItem value="7d">7 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/20 border-gray-800">
          <CardContent className="pt-6 space-y-4">
            <h3 className="text-lg font-medium flex items-center">
              <Zap className="h-5 w-5 mr-2 text-amber-500" />
              Flash Crash & Volatility Protection
            </h3>
            
            <div className="flex items-center justify-between">
              <Label>Enable Flash Crash Protection</Label>
              <Switch 
                checked={flashCrashProtection} 
                onCheckedChange={setFlashCrashProtection} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label>Enable Volatility Protection</Label>
              <Switch 
                checked={volatilityProtection} 
                onCheckedChange={setVolatilityProtection} 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Volatility Threshold</Label>
                <span className="text-sm">{volatilityThreshold}th percentile</span>
              </div>
              <Slider
                disabled={!volatilityProtection}
                value={[volatilityThreshold]}
                min={50}
                max={99}
                step={1}
                onValueChange={(values) => setVolatilityThreshold(values[0])}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-black/20 border-gray-800">
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-medium">Recovery Strategy</h3>
          
          <div className="space-y-2">
            <Label>Asset Protection Method</Label>
            <Select value={recoveryMethod} onValueChange={setRecoveryMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select recovery method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stablecoin">Convert to Stablecoin</SelectItem>
                <SelectItem value="partial_exit">Partial Exit (50%)</SelectItem>
                <SelectItem value="full_exit">Full Exit</SelectItem>
                <SelectItem value="hedge">Hedge Position</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <Label>Automatic Re-entry</Label>
            <Switch 
              checked={autoReentry} 
              onCheckedChange={setAutoReentry} 
            />
          </div>
          
          <div className="space-y-2">
            <Label>Re-entry Conditions</Label>
            <Select 
              disabled={!autoReentry}
              value={reentryConditions} 
              onValueChange={setReentryConditions}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select re-entry conditions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="market_recovery">Market Recovery (Price Stabilizes)</SelectItem>
                <SelectItem value="time_based">Time-based (Wait for Duration)</SelectItem>
                <SelectItem value="volume_based">Volume-based (Trading Activity Normalizes)</SelectItem>
                <SelectItem value="trend_confirmation">Trend Confirmation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      {securityLevel >= 3 && (
        <Card className="bg-black/20 border-gray-800">
          <CardContent className="pt-6 space-y-4">
            <h3 className="text-lg font-medium">Multi-Signature Security</h3>
            
            <div className="flex items-center justify-between">
              <Label>Require Multiple Signatures</Label>
              <Switch 
                checked={multiSignatureRequired} 
                onCheckedChange={setMultiSignatureRequired} 
              />
            </div>
            
            <div className="space-y-2">
              <Label>Required Signatures</Label>
              <Select 
                disabled={!multiSignatureRequired}
                value={requiredSignatures.toString()} 
                onValueChange={(value) => setRequiredSignatures(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Required signatures" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 of {authorizedAddresses.length}</SelectItem>
                  <SelectItem value="3">3 of {authorizedAddresses.length}</SelectItem>
                  <SelectItem value="4">All ({authorizedAddresses.length} of {authorizedAddresses.length})</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Authorized Addresses</Label>
              <div className="space-y-2">
                {authorizedAddresses.map((address, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="bg-gray-900 rounded px-3 py-1.5 text-xs font-mono flex-1 truncate">
                      {address}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleRemoveAddress(address)}
                      className="h-8 w-8 p-0"
                    >
                      <i className="ri-close-line"></i>
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="flex space-x-2 mt-3">
                <Input
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="Add authorized address"
                  className="flex-1"
                />
                <Button onClick={handleAddAddress}>Add</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {crossChainEnabled && (
        <div className="p-4 bg-black/20 border border-gray-800 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-full bg-[#3F51FF]/20">
              <i className="ri-shield-check-line text-[#3F51FF] text-xl"></i>
            </div>
            <div>
              <h3 className="text-base font-medium">Cross-Chain Safety Failover</h3>
              <p className="text-sm text-gray-400 mt-1">
                Your emergency protocols are secured by cross-chain verification. If the primary chain is
                unavailable, safety measures will be enforced through backup chains.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-end">
        <Button className="bg-[#3F51FF] hover:bg-[#3F51FF]/80">Save Emergency Protocols</Button>
      </div>
    </div>
  );
}