import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  ArrowLeft, Shield, Users, Clock, ChevronRight, Wallet, UserPlus, Minus,
  Plus, CheckCircle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { BlockchainType } from '@/contexts/multi-chain-context';

const MultiSignatureVaultNewPage: React.FC = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [signers, setSigners] = useState([{ name: "", address: "", email: "" }]);
  const [threshold, setThreshold] = useState(1);
  const [timelock, setTimelock] = useState(false);
  const [timelockDuration, setTimelockDuration] = useState(24);
  const [crossChainVerification, setCrossChainVerification] = useState(false);
  const [selectedBlockchain, setSelectedBlockchain] = useState<BlockchainType>(BlockchainType.TON);
  const [vaultName, setVaultName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [vaultId, setVaultId] = useState("");

  // Add new signer
  const addSigner = () => {
    if (signers.length < 10) {
      setSigners([...signers, { name: "", address: "", email: "" }]);
      if (threshold === signers.length) {
        setThreshold(threshold + 1);
      }
    }
  };

  // Remove signer
  const removeSigner = (index: number) => {
    if (signers.length > 1) {
      const newSigners = signers.filter((_, i) => i !== index);
      setSigners(newSigners);
      if (threshold > newSigners.length) {
        setThreshold(newSigners.length);
      }
    }
  };

  // Handle signer input changes
  const handleSignerChange = (index: number, field: string, value: string) => {
    const newSigners = [...signers];
    newSigners[index] = { ...newSigners[index], [field]: value };
    setSigners(newSigners);
  };

  // Generate vault ID
  const generateVaultId = () => {
    return "msig-" + Math.random().toString(36).substring(2, 10);
  };

  // Submit form
  const handleSubmit = () => {
    setIsLoading(true);
    
    // Validation
    if (!vaultName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a name for your vault.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    if (signers.some(signer => !signer.address.trim())) {
      toast({
        title: "Missing Information",
        description: "All signers must have a valid address.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    // Success simulation
    setTimeout(() => {
      const newVaultId = generateVaultId();
      setVaultId(newVaultId);
      setIsCreated(true);
      toast({
        title: "Success!",
        description: `Multi-Signature Vault created with ID: ${newVaultId}`,
      });
      setIsLoading(false);
    }, 2000);
  };

  // Reset form for a new vault
  const createNewVault = () => {
    setCurrentStep(1);
    setVaultName("");
    setSigners([{ name: "", address: "", email: "" }]);
    setThreshold(1);
    setTimelock(false);
    setTimelockDuration(24);
    setCrossChainVerification(false);
    setIsCreated(false);
    setVaultId("");
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header Section */}
      <div className="mb-6">
        <Link href="/vault-types">
          <Button variant="ghost" className="mb-4 hover:bg-[#6B00D7]/10">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Vault Types
          </Button>
        </Link>

        <div className="flex items-center mb-2">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center shadow-lg shadow-[#6B00D7]/30 mr-4">
            <Users className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
            Multi-Signature Vault
          </h1>
        </div>
      </div>
      
      {/* Success View */}
      {isCreated ? (
        <div className="max-w-3xl mx-auto">
          <Card className="bg-gradient-to-br from-[#1A1A1A] to-[#222] border border-[#333] overflow-hidden">
            <CardContent className="pt-6 pb-8 px-6">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-[#6B00D7]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-10 w-10 text-[#FF5AF7]" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Vault Created Successfully!</h2>
                <p className="text-gray-300 mb-6">Your Multi-Signature Vault is now active and ready to use</p>
                <div className="bg-[#111] rounded-md p-3 mb-4 flex items-center justify-center">
                  <span className="font-mono text-[#FF5AF7] font-medium">{vaultId}</span>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="grid grid-cols-2 gap-3 bg-[#222] p-3 rounded-md">
                  <div>
                    <p className="text-sm text-gray-400">Vault Name</p>
                    <p className="font-medium">{vaultName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Blockchain</p>
                    <p className="font-medium">
                      {selectedBlockchain === BlockchainType.TON ? "TON" : 
                       selectedBlockchain === BlockchainType.ETHEREUM ? "Ethereum" : 
                       selectedBlockchain === BlockchainType.SOLANA ? "Solana" : "Unknown"}
                    </p>
                  </div>
                </div>
                
                <div className="bg-[#222] p-3 rounded-md">
                  <p className="text-sm text-gray-400 mb-2">Signature Requirement</p>
                  <p className="font-medium">{threshold} of {signers.length} signatures required</p>
                </div>
                
                {timelock && (
                  <div className="bg-[#222] p-3 rounded-md">
                    <p className="text-sm text-gray-400 mb-2">Time-Lock Protection</p>
                    <p className="font-medium">{timelockDuration} hour waiting period</p>
                  </div>
                )}
                
                {crossChainVerification && (
                  <div className="bg-[#222] p-3 rounded-md">
                    <p className="text-sm text-gray-400 mb-2">Cross-Chain Verification</p>
                    <p className="font-medium">Enabled</p>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  variant="outline" 
                  className="flex-1 border-[#6B00D7] text-[#FF5AF7] hover:bg-[#6B00D7]/10"
                  onClick={createNewVault}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Another Vault
                </Button>
                <Link href="/my-vaults">
                  <Button 
                    className="flex-1 sm:min-w-[180px] bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#7B10E7] hover:to-[#FF6AF7]"
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    Go to My Vaults
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-6">
            <div className={`h-10 w-10 rounded-full ${currentStep >= 1 ? 'bg-[#6B00D7]' : 'bg-gray-700'} flex items-center justify-center mr-2`}>
              <span className="text-white font-bold">1</span>
            </div>
            <div className={`h-1 w-12 ${currentStep >= 2 ? 'bg-[#6B00D7]' : 'bg-gray-700'} mx-1`}></div>
            <div className={`h-10 w-10 rounded-full ${currentStep >= 2 ? 'bg-[#6B00D7]' : 'bg-gray-700'} flex items-center justify-center mr-2`}>
              <span className="text-white font-bold">2</span>
            </div>
            <div className={`h-1 w-12 ${currentStep >= 3 ? 'bg-[#6B00D7]' : 'bg-gray-700'} mx-1`}></div>
            <div className={`h-10 w-10 rounded-full ${currentStep >= 3 ? 'bg-[#6B00D7]' : 'bg-gray-700'} flex items-center justify-center`}>
              <span className="text-white font-bold">3</span>
            </div>
          </div>
          
          {/* Form Steps */}
          <div className="max-w-3xl mx-auto bg-[#1A1A1A] border border-[#333] rounded-lg overflow-hidden">
            {/* Step 1: Basic Vault Information */}
            {currentStep === 1 && (
              <div className="p-6">
                <h2 className="text-xl font-bold mb-6 text-white">Basic Vault Information</h2>
                
                <div className="space-y-5">
                  <div>
                    <Label htmlFor="vault-name">Vault Name</Label>
                    <Input 
                      id="vault-name" 
                      placeholder="e.g., Family Emergency Fund" 
                      value={vaultName}
                      onChange={(e) => setVaultName(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label>Blockchain</Label>
                    <Select 
                      value={selectedBlockchain.toString()} 
                      onValueChange={(value) => {
                        const blockchainValue = Number(value);
                        if (blockchainValue === BlockchainType.TON ||
                            blockchainValue === BlockchainType.ETHEREUM ||
                            blockchainValue === BlockchainType.SOLANA) {
                          setSelectedBlockchain(blockchainValue);
                        }
                      }}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select a blockchain" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={BlockchainType.TON.toString()}>TON</SelectItem>
                        <SelectItem value={BlockchainType.ETHEREUM.toString()}>Ethereum</SelectItem>
                        <SelectItem value={BlockchainType.SOLANA.toString()}>Solana</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <Button 
                      onClick={() => setCurrentStep(2)}
                      className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#7B10E7] hover:to-[#FF6AF7]"
                    >
                      Next <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 2: Signers and Threshold */}
            {currentStep === 2 && (
              <div className="p-6">
                <h2 className="text-xl font-bold mb-6 text-white">Signers & Threshold</h2>
                
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <Label>Signers ({signers.length})</Label>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={addSigner}
                        disabled={signers.length >= 10}
                      >
                        <UserPlus className="h-4 w-4 mr-1" /> Add Signer
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {signers.map((signer, index) => (
                        <Card key={index} className="bg-[#222]">
                          <CardContent className="pt-4">
                            <div className="flex justify-between items-start mb-3">
                              <span className="font-medium text-white">Signer #{index + 1}</span>
                              {signers.length > 1 && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-7 w-7 p-0" 
                                  onClick={() => removeSigner(index)}
                                >
                                  <Minus className="h-4 w-4 text-red-400" />
                                </Button>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <Label htmlFor={`signer-name-${index}`}>Name (Optional)</Label>
                                <Input
                                  id={`signer-name-${index}`}
                                  placeholder="e.g., John Doe"
                                  value={signer.name}
                                  onChange={(e) => handleSignerChange(index, 'name', e.target.value)}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`signer-address-${index}`}>Blockchain Address</Label>
                                <Input
                                  id={`signer-address-${index}`}
                                  placeholder="Enter wallet address"
                                  value={signer.address}
                                  onChange={(e) => handleSignerChange(index, 'address', e.target.value)}
                                  className="mt-1"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <Label htmlFor={`signer-email-${index}`}>Email (Optional)</Label>
                                <Input
                                  id={`signer-email-${index}`}
                                  placeholder="e.g., john@example.com"
                                  value={signer.email}
                                  onChange={(e) => handleSignerChange(index, 'email', e.target.value)}
                                  className="mt-1"
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label>Required Signatures (M of N)</Label>
                    <div className="mt-2">
                      <p className="mb-2 text-sm text-gray-400">
                        {threshold} of {signers.length} signatures required
                      </p>
                      <Slider
                        value={[threshold]}
                        min={1}
                        max={signers.length}
                        step={1}
                        onValueChange={(value) => setThreshold(value[0])}
                        className="mt-2"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-4">
                    <Button 
                      variant="ghost" 
                      onClick={() => setCurrentStep(1)}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button 
                      onClick={() => setCurrentStep(3)}
                      className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#7B10E7] hover:to-[#FF6AF7]"
                    >
                      Next <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 3: Advanced Security Options */}
            {currentStep === 3 && (
              <div className="p-6">
                <h2 className="text-xl font-bold mb-6 text-white">Advanced Security</h2>
                
                <div className="space-y-5">
                  <Card className="bg-[#222] border-[#333]">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-[#FF5AF7]" /> Time-Lock Protection
                          </h3>
                          <p className="text-sm text-gray-400 mt-1">
                            Add mandatory waiting period
                          </p>
                        </div>
                        <Switch 
                          checked={timelock} 
                          onCheckedChange={setTimelock} 
                        />
                      </div>
                      
                      {timelock && (
                        <div className="mt-4">
                          <Label>Hours</Label>
                          <div className="flex items-center mt-2">
                            <Input
                              type="number"
                              min={1}
                              max={168}
                              value={timelockDuration}
                              onChange={(e) => setTimelockDuration(parseInt(e.target.value) || 24)}
                              className="w-24 mr-2"
                            />
                            <span>hours</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-[#222] border-[#333]">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold flex items-center">
                            <Shield className="h-4 w-4 mr-2 text-[#FF5AF7]" /> Cross-Chain Verification
                          </h3>
                          <p className="text-sm text-gray-400 mt-1">
                            Verify across multiple chains
                          </p>
                        </div>
                        <Switch 
                          checked={crossChainVerification} 
                          onCheckedChange={setCrossChainVerification} 
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="flex justify-between pt-4">
                    <Button 
                      variant="ghost" 
                      onClick={() => setCurrentStep(2)}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button 
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#7B10E7] hover:to-[#FF6AF7]"
                    >
                      {isLoading ? (
                        <>Creating Vault...</>
                      ) : (
                        <>Create Vault</>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MultiSignatureVaultNewPage;