/**
 * MultiSignatureSwapConfig Component
 * 
 * A component for configuring multi-signature settings for atomic swaps
 */

import React, { useState } from "react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, ShieldCheck, Lock, Plus, Trash2, AlertCircle, Info } from "lucide-react";

interface MultiSignatureSwapConfigProps {
  form: any; // Using any for form type to keep it flexible
}

export function MultiSignatureSwapConfig({ form }: MultiSignatureSwapConfigProps) {
  const [signers, setSigners] = useState<{id: string; name: string; address: string}[]>([
    { id: '1', name: 'You', address: '0x1234...5678' },
    { id: '2', name: 'Exchange', address: '0x8765...4321' }
  ]);
  
  const [newSignerName, setNewSignerName] = useState("");
  const [newSignerAddress, setNewSignerAddress] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const handleAddSigner = () => {
    if (newSignerName && newSignerAddress) {
      const newSigner = {
        id: `${signers.length + 1}`,
        name: newSignerName,
        address: newSignerAddress
      };
      
      setSigners([...signers, newSigner]);
      setNewSignerName("");
      setNewSignerAddress("");
      
      // Update form value
      form.setValue("multiSignatureConfig", {
        ...form.watch("multiSignatureConfig"),
        signers: [...signers, newSigner]
      });
    }
  };
  
  const handleRemoveSigner = (id: string) => {
    const updatedSigners = signers.filter(signer => signer.id !== id);
    setSigners(updatedSigners);
    
    // Update form value
    form.setValue("multiSignatureConfig", {
      ...form.watch("multiSignatureConfig"),
      signers: updatedSigners
    });
  };
  
  const handleRequiredSignaturesChange = (value: string) => {
    // Update form value
    form.setValue("multiSignatureConfig", {
      ...form.watch("multiSignatureConfig"),
      requiredSignatures: parseInt(value, 10)
    });
  };
  
  const handleTimeoutUnitChange = (value: string) => {
    // Update form value
    form.setValue("multiSignatureConfig", {
      ...form.watch("multiSignatureConfig"),
      timeoutUnit: value
    });
  };
  
  // Initialize form values if not already set
  React.useEffect(() => {
    if (!form.watch("multiSignatureConfig")) {
      form.setValue("multiSignatureConfig", {
        requiredSignatures: 2,
        signers: signers,
        timeoutPeriod: 24,
        timeoutUnit: "hours",
        enableSecurityDelay: true,
        securityDelayPeriod: 4
      });
    }
  }, [form, signers]);

  return (
    <div className="space-y-6">
      <Card className="border border-[#FF5AF7]/20 bg-gradient-to-r from-[#1A1A1A] to-[#231A2A]">
        <CardHeader>
          <CardTitle className="text-xl text-[#FF5AF7] font-semibold flex items-center gap-2">
            Multi-Signature Security
            <Badge className="bg-[#FF5AF7] text-white">Enhanced</Badge>
          </CardTitle>
          <CardDescription className="text-gray-300">
            Configure multi-signature requirements for your cross-chain atomic swap
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Signers Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Current Signers</h3>
              <Badge variant="outline" className="bg-[#FF5AF7]/10 border-[#FF5AF7]/30">
                <Users className="mr-1 h-3 w-3" />
                {signers.length} Signers
              </Badge>
            </div>
            
            <div className="space-y-2">
              {signers.map((signer) => (
                <div 
                  key={signer.id} 
                  className="flex items-center justify-between p-3 bg-black/20 border border-[#FF5AF7]/10 rounded-md"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 bg-[#FF5AF7]/20 border border-[#FF5AF7]/30">
                      <AvatarFallback className="text-xs text-[#FF5AF7]">
                        {signer.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{signer.name}</p>
                      <p className="text-xs text-gray-400">{signer.address}</p>
                    </div>
                  </div>
                  {signer.id !== '1' && ( // Don't allow removing yourself
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-gray-400 hover:text-red-400"
                      onClick={() => handleRemoveSigner(signer.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Add New Signer Section */}
          <div className="p-4 border border-dashed border-[#FF5AF7]/20 rounded-md bg-black/10">
            <h3 className="text-sm font-medium mb-3">Add New Signer</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input 
                placeholder="Signer Name" 
                value={newSignerName}
                onChange={(e) => setNewSignerName(e.target.value)}
                className="bg-black/30 border-[#FF5AF7]/20 focus:border-[#FF5AF7]/50"
              />
              <Input 
                placeholder="Wallet Address" 
                value={newSignerAddress}
                onChange={(e) => setNewSignerAddress(e.target.value)}
                className="bg-black/30 border-[#FF5AF7]/20 focus:border-[#FF5AF7]/50"
              />
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="mt-3 border-[#FF5AF7]/30 text-[#FF5AF7] hover:bg-[#FF5AF7]/10"
              onClick={handleAddSigner}
              disabled={!newSignerName || !newSignerAddress}
            >
              <Plus className="mr-1 h-4 w-4" /> Add Signer
            </Button>
          </div>
          
          {/* Required Signatures Configuration */}
          <div className="p-4 bg-black/20 border border-[#FF5AF7]/20 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Required Signatures</h3>
              <Badge variant="outline" className="bg-[#FF5AF7]/10 border-[#FF5AF7]/30">
                <ShieldCheck className="mr-1 h-3 w-3" />
                {form.watch("multiSignatureConfig")?.requiredSignatures || 2} of {signers.length}
              </Badge>
            </div>
            
            <p className="text-xs text-gray-400 mb-4">
              Number of signatures required to approve this atomic swap
            </p>
            
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((num) => (
                <Button 
                  key={num}
                  variant={form.watch("multiSignatureConfig")?.requiredSignatures === num ? "default" : "outline"}
                  size="sm"
                  className={form.watch("multiSignatureConfig")?.requiredSignatures === num 
                    ? "bg-[#FF5AF7] hover:bg-[#FF5AF7]/90" 
                    : "border-[#FF5AF7]/30 text-[#FF5AF7] hover:bg-[#FF5AF7]/10"}
                  onClick={() => handleRequiredSignaturesChange(num.toString())}
                  disabled={num > signers.length}
                >
                  {num} {num === 1 ? "Signature" : "Signatures"}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Advanced Settings Toggle */}
          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="advanced-settings"
              checked={showAdvanced}
              onCheckedChange={setShowAdvanced}
              className="data-[state=checked]:bg-[#FF5AF7]"
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="advanced-settings"
                className="text-sm font-medium leading-none"
              >
                Show Advanced Security Settings
              </label>
            </div>
          </div>
          
          {/* Advanced Security Settings */}
          {showAdvanced && (
            <div className="space-y-4 p-4 bg-black/20 border border-[#FF5AF7]/20 rounded-md">
              <h3 className="text-sm font-medium">Advanced Security Settings</h3>
              
              {/* Timeout Period */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-gray-400">Security Timeout Period</label>
                  <Badge variant="outline" className="bg-black border-gray-700">
                    {form.watch("multiSignatureConfig")?.timeoutPeriod || 24} {form.watch("multiSignatureConfig")?.timeoutUnit || "hours"}
                  </Badge>
                </div>
                <Slider
                  defaultValue={[form.watch("multiSignatureConfig")?.timeoutPeriod || 24]}
                  max={form.watch("multiSignatureConfig")?.timeoutUnit === "minutes" ? 120 : 
                       form.watch("multiSignatureConfig")?.timeoutUnit === "hours" ? 72 : 30}
                  step={form.watch("multiSignatureConfig")?.timeoutUnit === "minutes" ? 10 : 
                       form.watch("multiSignatureConfig")?.timeoutUnit === "hours" ? 4 : 1}
                  onValueChange={(values) => {
                    form.setValue("multiSignatureConfig", {
                      ...form.watch("multiSignatureConfig"),
                      timeoutPeriod: values[0]
                    });
                  }}
                  className="mt-2"
                />
                
                <div className="flex items-center space-x-2 mt-2">
                  <Select 
                    defaultValue={form.watch("multiSignatureConfig")?.timeoutUnit || "hours"}
                    onValueChange={handleTimeoutUnitChange}
                  >
                    <SelectTrigger className="w-28 h-8 text-xs bg-black/30 border-[#FF5AF7]/20">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minutes">Minutes</SelectItem>
                      <SelectItem value="hours">Hours</SelectItem>
                      <SelectItem value="days">Days</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-xs text-gray-400">
                    Time until the transaction can be cancelled if not completed
                  </span>
                </div>
              </div>
              
              {/* Security Delay */}
              <div className="flex items-start space-x-2 pt-2">
                <Checkbox 
                  id="security-delay" 
                  checked={form.watch("multiSignatureConfig")?.enableSecurityDelay} 
                  onCheckedChange={(checked) => {
                    form.setValue("multiSignatureConfig", {
                      ...form.watch("multiSignatureConfig"),
                      enableSecurityDelay: checked
                    });
                  }}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="security-delay"
                    className="text-sm font-medium leading-none"
                  >
                    Enable Security Delay Period
                  </label>
                  <p className="text-xs text-gray-400">
                    Add a mandatory waiting period of {form.watch("multiSignatureConfig")?.securityDelayPeriod || 4} hours before the swap transaction can complete
                  </p>
                </div>
              </div>
              
              {/* Warning Note */}
              <div className="flex items-start space-x-2 p-3 bg-amber-950/20 border border-amber-500/20 rounded-md mt-4">
                <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-amber-200">
                    Advanced security settings provide additional protection against unauthorized transactions but may delay completion of your cross-chain swap.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default MultiSignatureSwapConfig;