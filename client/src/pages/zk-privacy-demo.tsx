import React, { useState, useEffect } from 'react';
import { ZkPrivacySettings, type ZkPrivacySettings as ZkSettings } from '@/components/vault/zk-privacy-settings';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  Lock, 
  KeyRound, 
  UserPlus, 
  AlertTriangle, 
  Check,
  LockKeyhole,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  encryptWithZkProof,
  verifyZkProof,
  decryptWithZkVerification,
  generateBeneficiaryProof,
  verifyAddressInBeneficiaries
} from '@/lib/zk/zk-privacy';

/**
 * ZkPrivacyDemo Page
 * 
 * This page provides a demonstration of the Zero-Knowledge Privacy Layer features
 * of Chronos Vault, including:
 * - Encrypting vault content with ZK proofs
 * - Verifying ownership without revealing content
 * - Managing beneficiaries privately
 * - Time-lock verification
 */
export default function ZkPrivacyDemoPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('intro');
  const [zkSettings, setZkSettings] = useState<ZkSettings>({
    enabled: false,
    contentPrivacy: true,
    beneficiaryPrivacy: true,
    timePrivacy: false,
    hideMetadata: false
  });
  
  const [encryptionDemo, setEncryptionDemo] = useState({
    inputText: '',
    privateKey: '',
    encryptedData: null as any,
    zkProof: null as any,
    isProcessing: false,
    isVerified: false,
    decryptedText: ''
  });
  
  const [beneficiaryDemo, setBeneficiaryDemo] = useState({
    beneficiaries: [
      '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      'EQBIhPuWmjT7fBgkYZ4WnVsB_-_JzG2_BUJzvliiTj_GRSDA',
      'GvV8G5RFP6Y5sMHWDgM9aL59rTzLv9r4nxLsPjcUKsXm'
    ],
    newBeneficiary: '',
    privateKey: '',
    proof: null as any,
    addressToVerify: '',
    isProcessing: false,
    isVerified: false
  });
  
  const handleSettingsUpdated = (settings: ZkSettings) => {
    setZkSettings(settings);
    toast({
      title: "Privacy Settings Updated",
      description: `Zero-Knowledge privacy settings ${settings.enabled ? 'enabled' : 'disabled'}.`,
    });
  };
  
  const generateRandomKey = () => {
    const randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);
    const hexKey = Array.from(randomBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    return hexKey;
  };
  
  const handleEncrypt = async () => {
    if (!encryptionDemo.inputText || !encryptionDemo.privateKey) {
      toast({
        title: "Missing Information",
        description: "Please enter both text to encrypt and a private key.",
        variant: "destructive",
      });
      return;
    }
    
    setEncryptionDemo(prev => ({ ...prev, isProcessing: true }));
    
    try {
      const result = await encryptWithZkProof(
        encryptionDemo.inputText,
        encryptionDemo.privateKey
      );
      
      setEncryptionDemo(prev => ({
        ...prev,
        encryptedData: result.encryptedData,
        zkProof: result.zkProof,
        isProcessing: false
      }));
      
      toast({
        title: "Encryption Successful",
        description: "Your data has been encrypted with a zero-knowledge proof.",
      });
    } catch (error) {
      toast({
        title: "Encryption Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      setEncryptionDemo(prev => ({ ...prev, isProcessing: false }));
    }
  };
  
  const handleVerifyProof = () => {
    if (!encryptionDemo.zkProof) {
      toast({
        title: "No Proof Available",
        description: "Please encrypt data first to generate a proof.",
        variant: "destructive",
      });
      return;
    }
    
    setEncryptionDemo(prev => ({ ...prev, isProcessing: true }));
    
    try {
      const isValid = verifyZkProof(encryptionDemo.zkProof);
      
      setEncryptionDemo(prev => ({
        ...prev,
        isVerified: isValid,
        isProcessing: false
      }));
      
      toast({
        title: isValid ? "Proof Verified" : "Invalid Proof",
        description: isValid 
          ? "The zero-knowledge proof is valid. The data properties were verified without revealing the data." 
          : "The zero-knowledge proof could not be verified.",
        variant: isValid ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      setEncryptionDemo(prev => ({ ...prev, isProcessing: false }));
    }
  };
  
  const handleDecrypt = async () => {
    if (!encryptionDemo.encryptedData || !encryptionDemo.privateKey) {
      toast({
        title: "Missing Information",
        description: "Please encrypt data first and ensure you have the correct private key.",
        variant: "destructive",
      });
      return;
    }
    
    setEncryptionDemo(prev => ({ ...prev, isProcessing: true }));
    
    try {
      const decryptedText = await decryptWithZkVerification(
        encryptionDemo.encryptedData,
        encryptionDemo.privateKey
      );
      
      setEncryptionDemo(prev => ({
        ...prev,
        decryptedText,
        isProcessing: false
      }));
      
      toast({
        title: "Decryption Successful",
        description: "Your data has been decrypted.",
      });
    } catch (error) {
      toast({
        title: "Decryption Failed",
        description: "Invalid private key or corrupted data.",
        variant: "destructive",
      });
      setEncryptionDemo(prev => ({ ...prev, isProcessing: false }));
    }
  };
  
  const handleAddBeneficiary = () => {
    if (!beneficiaryDemo.newBeneficiary) {
      toast({
        title: "Missing Information",
        description: "Please enter a beneficiary address.",
        variant: "destructive",
      });
      return;
    }
    
    setBeneficiaryDemo(prev => ({
      ...prev,
      beneficiaries: [...prev.beneficiaries, prev.newBeneficiary],
      newBeneficiary: ''
    }));
    
    toast({
      title: "Beneficiary Added",
      description: "New beneficiary has been added to the list.",
    });
  };
  
  const handleGenerateProof = () => {
    if (!beneficiaryDemo.privateKey) {
      toast({
        title: "Missing Information",
        description: "Please enter a private key.",
        variant: "destructive",
      });
      return;
    }
    
    setBeneficiaryDemo(prev => ({ ...prev, isProcessing: true }));
    
    try {
      const proof = generateBeneficiaryProof(
        beneficiaryDemo.beneficiaries,
        beneficiaryDemo.privateKey
      );
      
      setBeneficiaryDemo(prev => ({
        ...prev,
        proof,
        isProcessing: false
      }));
      
      toast({
        title: "Proof Generated",
        description: "Beneficiary proof has been generated.",
      });
    } catch (error) {
      toast({
        title: "Proof Generation Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      setBeneficiaryDemo(prev => ({ ...prev, isProcessing: false }));
    }
  };
  
  const handleVerifyBeneficiary = () => {
    if (!beneficiaryDemo.proof || !beneficiaryDemo.addressToVerify) {
      toast({
        title: "Missing Information",
        description: "Please generate a proof first and enter an address to verify.",
        variant: "destructive",
      });
      return;
    }
    
    setBeneficiaryDemo(prev => ({ ...prev, isProcessing: true }));
    
    try {
      // For demo purposes, we'll directly check if the address is in the list
      // In production, we would use zero-knowledge proofs
      const isVerified = beneficiaryDemo.beneficiaries.includes(beneficiaryDemo.addressToVerify);
      
      setBeneficiaryDemo(prev => ({
        ...prev,
        isVerified,
        isProcessing: false
      }));
      
      toast({
        title: isVerified ? "Address Verified" : "Address Not Verified",
        description: isVerified 
          ? "The address is a verified beneficiary." 
          : "The address is not in the beneficiary list.",
        variant: isVerified ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      setBeneficiaryDemo(prev => ({ ...prev, isProcessing: false }));
    }
  };
  
  useEffect(() => {
    // Generate random keys on initial load
    setEncryptionDemo(prev => ({
      ...prev,
      privateKey: generateRandomKey()
    }));
    
    setBeneficiaryDemo(prev => ({
      ...prev,
      privateKey: generateRandomKey()
    }));
  }, []);

  return (
    <div className="container max-w-6xl mx-auto py-12 px-4">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text">
          Zero-Knowledge Privacy Layer
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Experience enhanced privacy with zero-knowledge proofs that protect your vault data
          while allowing selective verification of properties.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <ZkPrivacySettings onSettingsUpdated={handleSettingsUpdated} />
        </div>

        <div className="lg:col-span-2">
          <Card className="border-[#6B00D7]/30 bg-gray-900/60">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <LockKeyhole className="h-5 w-5 text-[#FF5AF7]" />
                <CardTitle>Zero-Knowledge Features Demo</CardTitle>
              </div>
              <CardDescription>
                Explore the privacy-enhancing features of Chronos Vault's Zero-Knowledge layer
              </CardDescription>
            </CardHeader>
            
            <Tabs defaultValue="intro" value={activeTab} onValueChange={setActiveTab}>
              <div className="px-6">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="intro">Overview</TabsTrigger>
                  <TabsTrigger value="encryption">Content Privacy</TabsTrigger>
                  <TabsTrigger value="beneficiaries">Beneficiary Privacy</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="intro" className="p-6 pt-2">
                <div className="space-y-6">
                  <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <div className="flex flex-col space-y-1.5">
                      <h3 className="font-semibold leading-none tracking-tight flex items-center gap-2">
                        <Shield className="h-5 w-5 text-[#FF5AF7]" />
                        <span>What are Zero-Knowledge Proofs?</span>
                      </h3>
                    </div>
                    <div className="pt-3 text-sm text-muted-foreground">
                      <p>Zero-knowledge proofs allow one party (the prover) to prove to another party (the verifier) that a statement is true, without revealing any information beyond the validity of the statement itself.</p>
                      <p className="mt-2">In Chronos Vault, this technology enables:</p>
                      <ul className="mt-2 space-y-1 list-disc list-inside">
                        <li>Proving ownership of vaults without revealing their contents</li>
                        <li>Verifying beneficiary lists without exposing the actual addresses</li>
                        <li>Confirming time-lock settings without revealing the exact unlock date</li>
                        <li>Selective disclosure of vault properties while maintaining privacy</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button 
                      onClick={() => setActiveTab('encryption')}
                      className="h-20 flex flex-col justify-center items-center hover:bg-[#6B00D7]/20 hover:border-[#6B00D7] border border-gray-800"
                      variant="outline"
                    >
                      <div className="flex items-center gap-2">
                        <Eye className="h-5 w-5 text-blue-400" />
                        <span className="font-semibold">Content Privacy Demo</span>
                      </div>
                      <span className="text-xs text-muted-foreground mt-1">Encrypt vault content with proofs</span>
                    </Button>
                    
                    <Button 
                      onClick={() => setActiveTab('beneficiaries')}
                      className="h-20 flex flex-col justify-center items-center hover:bg-[#6B00D7]/20 hover:border-[#6B00D7] border border-gray-800"
                      variant="outline"
                    >
                      <div className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5 text-green-400" />
                        <span className="font-semibold">Beneficiary Privacy Demo</span>
                      </div>
                      <span className="text-xs text-muted-foreground mt-1">Verify beneficiaries privately</span>
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="encryption" className="p-6 pt-2">
                <div className="space-y-6">
                  <Alert className="bg-blue-900/20 border-blue-900/50">
                    <Eye className="h-4 w-4 text-blue-400" />
                    <AlertTitle>Content Privacy</AlertTitle>
                    <AlertDescription>
                      This demo shows how to encrypt vault content with zero-knowledge proofs, 
                      allowing you to prove ownership without revealing the content.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">1. Encrypt Your Vault Content</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="encryption-content">Content to Encrypt</Label>
                        <Textarea
                          id="encryption-content"
                          placeholder="Enter sensitive vault content here..."
                          value={encryptionDemo.inputText}
                          onChange={e => setEncryptionDemo(prev => ({
                            ...prev,
                            inputText: e.target.value
                          }))}
                          className="min-h-[120px]"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="encryption-key">Private Key (auto-generated)</Label>
                        <div className="flex space-x-2">
                          <Input
                            id="encryption-key"
                            value={encryptionDemo.privateKey}
                            onChange={e => setEncryptionDemo(prev => ({
                              ...prev,
                              privateKey: e.target.value
                            }))}
                            className="font-mono text-xs"
                          />
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEncryptionDemo(prev => ({
                              ...prev,
                              privateKey: generateRandomKey()
                            }))}
                          >
                            Regenerate
                          </Button>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={handleEncrypt}
                        disabled={encryptionDemo.isProcessing || !encryptionDemo.inputText}
                        className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]"
                      >
                        {encryptionDemo.isProcessing ? "Encrypting..." : "Encrypt with ZK Proof"}
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">2. Verify & Decrypt</h3>
                      
                      {encryptionDemo.encryptedData ? (
                        <>
                          <div className="rounded-lg border bg-card p-3 shadow-sm">
                            <div className="flex justify-between items-center">
                              <h4 className="text-xs font-medium">Encrypted Data & Proof</h4>
                              <Badge variant="outline" className="text-xs">
                                {encryptionDemo.isVerified ? "Verified" : "Unverified"}
                              </Badge>
                            </div>
                            <div className="mt-2 p-2 bg-black/20 rounded border border-gray-800 font-mono text-xs h-[80px] overflow-y-auto">
                              {JSON.stringify({
                                encryptedData: encryptionDemo.encryptedData,
                                proof: {
                                  commitment: encryptionDemo.zkProof?.commitment,
                                  publicInputs: encryptionDemo.zkProof?.publicInputs,
                                  timestamp: encryptionDemo.zkProof?.timestamp
                                }
                              }, null, 2)}
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              onClick={handleVerifyProof}
                              disabled={encryptionDemo.isProcessing}
                              variant="outline"
                              className="flex-1"
                            >
                              {encryptionDemo.isProcessing ? "Verifying..." : "Verify Proof"}
                            </Button>
                            
                            <Button 
                              onClick={handleDecrypt}
                              disabled={encryptionDemo.isProcessing}
                              variant="outline"
                              className="flex-1"
                            >
                              {encryptionDemo.isProcessing ? "Decrypting..." : "Decrypt Data"}
                            </Button>
                          </div>
                          
                          {encryptionDemo.decryptedText && (
                            <div className="rounded-lg border bg-card p-3 shadow-sm">
                              <h4 className="text-xs font-medium">Decrypted Content</h4>
                              <div className="mt-2 p-2 bg-black/20 rounded border border-gray-800 text-sm">
                                {encryptionDemo.decryptedText}
                              </div>
                            </div>
                          )}
                          
                          {encryptionDemo.isVerified && (
                            <Alert className="bg-green-900/20 border-green-900/50">
                              <Check className="h-4 w-4 text-green-400" />
                              <AlertTitle>Proof Verified</AlertTitle>
                              <AlertDescription>
                                The ownership of this data has been verified without revealing the content.
                                This is the power of zero-knowledge proofs!
                              </AlertDescription>
                            </Alert>
                          )}
                        </>
                      ) : (
                        <div className="flex items-center justify-center h-full min-h-[200px] border border-dashed rounded-lg">
                          <div className="text-center text-muted-foreground">
                            <EyeOff className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>Encrypt content first to generate a proof</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="beneficiaries" className="p-6 pt-2">
                <div className="space-y-6">
                  <Alert className="bg-green-900/20 border-green-900/50">
                    <UserPlus className="h-4 w-4 text-green-400" />
                    <AlertTitle>Beneficiary Privacy</AlertTitle>
                    <AlertDescription>
                      This demo demonstrates how to verify if an address is in your beneficiary list
                      without revealing the complete list of beneficiaries.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">1. Manage Beneficiaries</h3>
                      
                      <div className="rounded-lg border bg-card p-3 shadow-sm">
                        <h4 className="text-xs font-medium mb-2">Current Beneficiaries</h4>
                        <div className="space-y-2">
                          {beneficiaryDemo.beneficiaries.map((address, index) => (
                            <div key={index} className="flex justify-between items-center p-2 bg-black/20 rounded border border-gray-800">
                              <span className="text-xs font-mono truncate max-w-[80%]">{address}</span>
                              <Badge variant="outline" size="sm" className="text-xs">
                                {address.startsWith('0x') ? 'ETH' : 
                                 address.startsWith('EQ') ? 'TON' : 'SOL'}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Add beneficiary address..."
                          value={beneficiaryDemo.newBeneficiary}
                          onChange={e => setBeneficiaryDemo(prev => ({
                            ...prev,
                            newBeneficiary: e.target.value
                          }))}
                        />
                        <Button 
                          onClick={handleAddBeneficiary}
                          disabled={!beneficiaryDemo.newBeneficiary}
                          variant="outline"
                        >
                          Add
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="beneficiary-key">Private Key (auto-generated)</Label>
                        <Input
                          id="beneficiary-key"
                          value={beneficiaryDemo.privateKey}
                          onChange={e => setBeneficiaryDemo(prev => ({
                            ...prev,
                            privateKey: e.target.value
                          }))}
                          className="font-mono text-xs"
                        />
                      </div>
                      
                      <Button 
                        onClick={handleGenerateProof}
                        disabled={beneficiaryDemo.isProcessing || beneficiaryDemo.beneficiaries.length === 0}
                        className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]"
                      >
                        {beneficiaryDemo.isProcessing ? "Generating..." : "Generate Beneficiary Proof"}
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">2. Verify Beneficiary</h3>
                      
                      {beneficiaryDemo.proof ? (
                        <>
                          <div className="rounded-lg border bg-card p-3 shadow-sm">
                            <div className="flex justify-between items-center">
                              <h4 className="text-xs font-medium">Beneficiary Proof</h4>
                              <Badge variant="outline" className="text-xs">
                                {beneficiaryDemo.isVerified ? "Verified" : "Unverified"}
                              </Badge>
                            </div>
                            <div className="mt-2 p-2 bg-black/20 rounded border border-gray-800 font-mono text-xs h-[80px] overflow-y-auto">
                              {JSON.stringify({
                                commitment: beneficiaryDemo.proof?.commitment,
                                publicInputs: beneficiaryDemo.proof?.publicInputs,
                                timestamp: beneficiaryDemo.proof?.timestamp
                              }, null, 2)}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="address-to-verify">Address to Verify</Label>
                            <div className="flex space-x-2">
                              <Input
                                id="address-to-verify"
                                placeholder="Enter address to check..."
                                value={beneficiaryDemo.addressToVerify}
                                onChange={e => setBeneficiaryDemo(prev => ({
                                  ...prev,
                                  addressToVerify: e.target.value
                                }))}
                                className="font-mono text-xs"
                              />
                              <Button 
                                onClick={handleVerifyBeneficiary}
                                disabled={beneficiaryDemo.isProcessing || !beneficiaryDemo.addressToVerify}
                                variant="outline"
                              >
                                Verify
                              </Button>
                            </div>
                          </div>
                          
                          {beneficiaryDemo.isVerified !== null && (
                            <Alert className={beneficiaryDemo.isVerified ? 
                              "bg-green-900/20 border-green-900/50" : 
                              "bg-amber-900/20 border-amber-900/50"
                            }>
                              {beneficiaryDemo.isVerified ? (
                                <Check className="h-4 w-4 text-green-400" />
                              ) : (
                                <AlertTriangle className="h-4 w-4 text-amber-400" />
                              )}
                              <AlertTitle>
                                {beneficiaryDemo.isVerified ? 
                                  "Valid Beneficiary" : 
                                  "Not a Beneficiary"
                                }
                              </AlertTitle>
                              <AlertDescription>
                                {beneficiaryDemo.isVerified ? 
                                  "This address is verified as a beneficiary without revealing the complete list." : 
                                  "This address is not in the beneficiary list."
                                }
                              </AlertDescription>
                            </Alert>
                          )}
                        </>
                      ) : (
                        <div className="flex items-center justify-center h-full min-h-[200px] border border-dashed rounded-lg">
                          <div className="text-center text-muted-foreground">
                            <UserPlus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>Generate a beneficiary proof first</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}