import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Check, Shield, Clock, Image, Video, MessageSquare, Calendar, Save, Upload, Lock, Users, Globe, Bell, Key } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useTon } from "@/contexts/ton-context";
import { useEthereum } from "@/contexts/ethereum-context";
import { useSolana } from "@/contexts/solana-context";

const TimeLockedMemoryVault = () => {
  const { toast } = useToast();
  const ton = useTon();
  const ethereum = useEthereum();
  const solana = useSolana();
  
  // UI State
  const [activeTab, setActiveTab] = useState<string>("basic");
  const [step, setStep] = useState<number>(1);
  const [uploadedImages, setUploadedImages] = useState<number>(0);
  const [uploadedVideos, setUploadedVideos] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  // Vault Configuration
  const [vaultName, setVaultName] = useState<string>("");
  const [vaultDescription, setVaultDescription] = useState<string>("");
  const [primaryBlockchain, setPrimaryBlockchain] = useState<string>("ethereum");
  const [unlockDate, setUnlockDate] = useState<string>("");
  const [unlockEvent, setUnlockEvent] = useState<string>("date");
  const [beneficiaries, setBeneficiaries] = useState<string[]>([]);
  const [beneficiaryInput, setBeneficiaryInput] = useState<string>("");
  const [personalMessage, setPersonalMessage] = useState<string>("");
  const [storageLevel, setStorageLevel] = useState<number>(50);
  const [enableBackup, setEnableBackup] = useState<boolean>(true);
  const [recoveryOption, setRecoveryOption] = useState<string>("social");
  const [recoveryThreshold, setRecoveryThreshold] = useState<number>(2);
  
  // Progress
  const [securityScore, setSecurityScore] = useState<number>(0);
  const [encryptionStatus, setEncryptionStatus] = useState<string>("pending");

  // Step navigation
  const nextStep = () => {
    if (step < 6) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  // Handle blockchain selection 
  const handleBlockchainSelect = (chain: string) => {
    setPrimaryBlockchain(chain);
    
    // Update security score based on selection
    let newScore = securityScore;
    
    if (chain === "ethereum") newScore = 70;
    if (chain === "ton") newScore = 75;
    if (chain === "solana") newScore = 72;
    
    // Bonus for enabling cross-chain backup
    if (enableBackup) newScore += 15;
    
    setSecurityScore(newScore);
    
    toast({
      title: "Blockchain Selected",
      description: `Your vault will be primarily deployed on ${chain.charAt(0).toUpperCase() + chain.slice(1)} blockchain.`,
    });
  };

  // Add beneficiary
  const addBeneficiary = () => {
    if (beneficiaryInput && !beneficiaries.includes(beneficiaryInput)) {
      setBeneficiaries([...beneficiaries, beneficiaryInput]);
      setBeneficiaryInput("");
      
      toast({
        title: "Beneficiary Added",
        description: "The beneficiary has been added to the vault access list.",
      });
    }
  };

  // Remove beneficiary
  const removeBeneficiary = (index: number) => {
    const newBeneficiaries = [...beneficiaries];
    newBeneficiaries.splice(index, 1);
    setBeneficiaries(newBeneficiaries);
  };

  // Simulate media upload
  const handleMediaUpload = (type: 'image' | 'video') => {
    setIsProcessing(true);
    
    setTimeout(() => {
      if (type === 'image') {
        setUploadedImages(uploadedImages + 1);
      } else {
        setUploadedVideos(uploadedVideos + 1);
      }
      setIsProcessing(false);
      
      toast({
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Uploaded`,
        description: "Your file has been encrypted and securely stored.",
      });
    }, 1500);
  };

  // Security levels
  const getSecurityLevel = () => {
    if (securityScore >= 90) return "Maximum";
    if (securityScore >= 75) return "Advanced";
    if (securityScore >= 60) return "Enhanced";
    if (securityScore >= 40) return "Standard";
    return "Basic";
  };

  // Final vault creation
  const createVault = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      
      toast({
        title: "Memory Vault Created Successfully",
        description: "Your time-locked memory vault has been created and your assets are now securely stored.",
      });
    }, 2500);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header Section */}
      <div className="mb-8">
        <Link href="/vault-school">
          <Button variant="ghost" className="mb-6 hover:bg-[#6B00D7]/10">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Vault School
          </Button>
        </Link>

        <div className="flex items-center mb-4">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center shadow-lg shadow-[#6B00D7]/30 mr-4">
            <Clock className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
            Time-Locked Memory Vault
          </h1>
        </div>
        
        <p className="text-xl text-gray-300 max-w-3xl mb-6">
          Create a specialized vault that combines digital assets with multimedia memories, securely time-locked until a future date.
        </p>
        
        {/* Step Indicator */}
        <div className="w-full bg-[#1A1A1A] h-2 rounded-full mb-8">
          <div 
            className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 6) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Vault Creation Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <Card className="bg-[#1A1A1A] border-[#333] shadow-xl shadow-[#6B00D7]/5">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Basic Information</CardTitle>
                <CardDescription>
                  Let's start by setting up the basic details of your memory vault
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="vault-name">Vault Name</Label>
                  <Input 
                    id="vault-name" 
                    placeholder="Enter a name for your memory vault" 
                    value={vaultName}
                    onChange={(e) => setVaultName(e.target.value)}
                    className="bg-[#242424] border-[#333] focus:border-[#6B00D7]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="vault-description">Description (Optional)</Label>
                  <Textarea 
                    id="vault-description" 
                    placeholder="Describe the purpose of this memory vault" 
                    value={vaultDescription}
                    onChange={(e) => setVaultDescription(e.target.value)}
                    className="bg-[#242424] border-[#333] focus:border-[#6B00D7]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Primary Blockchain</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      type="button"
                      variant={primaryBlockchain === "ethereum" ? "default" : "outline"}
                      className={`flex flex-col space-y-2 h-auto py-4 ${
                        primaryBlockchain === "ethereum" 
                          ? "bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] border-transparent" 
                          : "bg-[#242424] border-[#333] hover:bg-[#2A2A2A]"
                      }`}
                      onClick={() => handleBlockchainSelect("ethereum")}
                    >
                      <div className="w-10 h-10 rounded-full bg-[#242424] flex items-center justify-center mx-auto">
                        <svg className="w-6 h-6 text-white" viewBox="0 0 784.37 1277.39" xmlns="http://www.w3.org/2000/svg">
                          <path fill="currentColor" d="M392.07 0L385.5 22.8V873.5l6.57 6.55 296.9-175.5-296.9-704.55z"/>
                          <path fill="currentColor" d="M392.07 0L95.16 704.55 392.07 880.05V472.3V0z"/>
                          <path fill="currentColor" d="M392.07 956.52l-3.65 4.44v236.54l3.65 10.7 297.02-418.7-297.02 167.02z"/>
                          <path fill="currentColor" d="M392.07 1208.2V956.52L95.16 789.5l296.91 418.7z"/>
                          <path fill="currentColor" d="M392.07 880.05l296.9-175.5-296.9-135.15v310.65z"/>
                          <path fill="currentColor" d="M95.16 704.55l296.91 175.5V569.4L95.16 704.55z"/>
                        </svg>
                      </div>
                      <span>Ethereum</span>
                    </Button>
                    
                    <Button
                      type="button"
                      variant={primaryBlockchain === "ton" ? "default" : "outline"}
                      className={`flex flex-col space-y-2 h-auto py-4 ${
                        primaryBlockchain === "ton" 
                          ? "bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] border-transparent" 
                          : "bg-[#242424] border-[#333] hover:bg-[#2A2A2A]"
                      }`}
                      onClick={() => handleBlockchainSelect("ton")}
                    >
                      <div className="w-10 h-10 rounded-full bg-[#242424] flex items-center justify-center mx-auto">
                        <svg className="w-6 h-6 text-white" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                          <path fill="currentColor" d="M16 0c8.837 0 16 7.163 16 16s-7.163 16-16 16S0 24.837 0 16 7.163 0 16 0zm0 5.915c-5.561 0-10.085 4.524-10.085 10.085S10.439 26.085 16 26.085 26.085 21.561 26.085 16 21.561 5.915 16 5.915zm-3.31 14.74v-6.543c0-.216.087-.422.24-.575l.156-.155c.152-.151.358-.24.574-.24h4.68c.216 0 .422.089.574.24l.155.155c.152.153.239.359.239.575v6.344c0 .262-.157.498-.399.6h-.001l-.005.003-2.52 1.11c-.228.1-.488.1-.716 0l-2.519-1.11-.005-.002-.002-.001c-.242-.102-.4-.339-.399-.6-.001 0-.001 0 0 0l-.001.199zm1.12-6.344v5.266l1.985.873L17.789 19.578V14.311h-2.995c-.023 0-.045-.01-.061-.26l-.042-.043a.085.085 0 01-.026-.06zm7.77-3.523v9.867c0 .262-.157.498-.399.6h-.001l-.005.003-4.785 2.112c-.228.1-.488.1-.716 0l-4.785-2.112-.005-.002-.002-.001c-.242-.102-.4-.339-.399-.6V10.788c0-.262.157-.498.399-.6h.003l.005-.002L16 8.075c.228-.1.487-.1.716 0l2.117 1c.307.129.307.563 0 .693l-1.716.8c-.228.1-.487.1-.716 0l-.096-.045-.43.92.277.129c.229.1.488.1.716 0l.346-.161c.126.07.264.113.404.124l.114.004h.017c.25 0 .491-.09.68-.253.16-.14.276-.327.329-.537l.015-.075.002-.016.001-.009V9.633l.332-.155c.228-.1.488-.1.716 0l2.313 1.02.5.002.1.001c.242.102.4.339.399.601v.686z"/>
                        </svg>
                      </div>
                      <span>TON</span>
                    </Button>
                    
                    <Button
                      type="button"
                      variant={primaryBlockchain === "solana" ? "default" : "outline"}
                      className={`flex flex-col space-y-2 h-auto py-4 ${
                        primaryBlockchain === "solana" 
                          ? "bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] border-transparent" 
                          : "bg-[#242424] border-[#333] hover:bg-[#2A2A2A]"
                      }`}
                      onClick={() => handleBlockchainSelect("solana")}
                    >
                      <div className="w-10 h-10 rounded-full bg-[#242424] flex items-center justify-center mx-auto">
                        <svg className="w-6 h-6 text-white" viewBox="0 0 397.7 311.7" xmlns="http://www.w3.org/2000/svg">
                          <path fill="currentColor" d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7zm0-164.7c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7zm317.4-58.2c2.4-2.4 5.7-3.8 9.2-3.8H9.2c-5.8 0-8.7 7-4.6 11.1L67.3 85c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z"/>
                        </svg>
                      </div>
                      <span>Solana</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between border-t border-[#333] pt-6">
                <Button variant="outline" disabled>
                  Previous
                </Button>
                <Button 
                  onClick={nextStep}
                  disabled={!vaultName || !primaryBlockchain}
                  className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white"
                >
                  Next: Unlock Settings
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Step 2: Unlock Settings */}
          {step === 2 && (
            <Card className="bg-[#1A1A1A] border-[#333] shadow-xl shadow-[#6B00D7]/5">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Unlock Settings</CardTitle>
                <CardDescription>
                  Define when your memory vault should unlock for access
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Unlock Method</Label>
                  <RadioGroup defaultValue="date" value={unlockEvent} onValueChange={setUnlockEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <RadioGroupItem
                        value="date"
                        id="unlock-date"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="unlock-date"
                        className="flex flex-col items-start justify-between rounded-md border-2 border-[#333] bg-[#242424] p-4 hover:bg-[#2A2A2A] hover:border-[#6B00D7] peer-data-[state=checked]:border-[#FF5AF7] [&:has([data-state=checked])]:border-[#FF5AF7]"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <Calendar className="h-6 w-6 text-[#FF5AF7]" />
                          <span className="text-lg font-medium">Specific Date</span>
                        </div>
                        <span className="text-sm text-gray-400">
                          The vault will unlock on an exact calendar date that you specify
                        </span>
                      </Label>
                    </div>
                    
                    <div>
                      <RadioGroupItem
                        value="event"
                        id="unlock-event"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="unlock-event"
                        className="flex flex-col items-start justify-between rounded-md border-2 border-[#333] bg-[#242424] p-4 hover:bg-[#2A2A2A] hover:border-[#6B00D7] peer-data-[state=checked]:border-[#FF5AF7] [&:has([data-state=checked])]:border-[#FF5AF7]"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <Clock className="h-6 w-6 text-[#FF5AF7]" />
                          <span className="text-lg font-medium">Blockchain Event</span>
                        </div>
                        <span className="text-sm text-gray-400">
                          The vault will unlock based on specific blockchain events (e.g., Bitcoin halving)
                        </span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {unlockEvent === "date" ? (
                  <div className="space-y-2">
                    <Label htmlFor="unlock-date-input">Select Unlock Date</Label>
                    <Input 
                      id="unlock-date-input" 
                      type="date" 
                      value={unlockDate}
                      onChange={(e) => setUnlockDate(e.target.value)}
                      className="bg-[#242424] border-[#333] focus:border-[#6B00D7]"
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <p className="text-sm text-gray-400 mt-1">
                      Must be at least 24 hours in the future. The further in the future, the higher the security score.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="unlock-event-select">Select Blockchain Event</Label>
                    <Select onValueChange={(value) => setUnlockDate(value)}>
                      <SelectTrigger className="bg-[#242424] border-[#333]">
                        <SelectValue placeholder="Select an event" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#242424] border-[#333]">
                        <SelectItem value="bitcoin-halving">Bitcoin Halving (April 2024)</SelectItem>
                        <SelectItem value="eth-upgrade">Ethereum Protocol Upgrade</SelectItem>
                        <SelectItem value="market-condition">Market Condition Trigger</SelectItem>
                        <SelectItem value="multi-chain-milestone">Multi-Chain Milestone</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-400 mt-1">
                      Blockchain events provide deterministic unlock conditions verified by multiple networks.
                    </p>
                  </div>
                )}
                
                <div className="p-4 bg-[#242424] rounded-lg border border-[#333]">
                  <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
                    <Lock className="h-5 w-5 text-[#FF5AF7]" />
                    <span>Time-Lock Security</span>
                  </h3>
                  <p className="text-sm text-gray-300 mb-4">
                    Your selected unlock condition uses multiple cryptographic time-lock mechanisms:
                  </p>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start">
                      <span className="text-[#FF5AF7] mr-2">•</span>
                      <span>Smart contract enforcement prevents access until conditions are met</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FF5AF7] mr-2">•</span>
                      <span>Verifiable delay functions create mathematical time-locks</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FF5AF7] mr-2">•</span>
                      <span>Cross-chain verification adds redundant security</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FF5AF7] mr-2">•</span>
                      <span>Time-lock encryption secures media content and messages</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between border-t border-[#333] pt-6">
                <Button variant="outline" onClick={prevStep}>
                  Previous
                </Button>
                <Button 
                  onClick={nextStep}
                  disabled={!unlockDate}
                  className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white"
                >
                  Next: Beneficiaries
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Step 3: Beneficiaries */}
          {step === 3 && (
            <Card className="bg-[#1A1A1A] border-[#333] shadow-xl shadow-[#6B00D7]/5">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Beneficiaries</CardTitle>
                <CardDescription>
                  Add people who will receive access to the Memory Vault when it unlocks
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="beneficiary-input">Add Beneficiary</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="beneficiary-input" 
                      placeholder="Wallet address or email" 
                      value={beneficiaryInput}
                      onChange={(e) => setBeneficiaryInput(e.target.value)}
                      className="bg-[#242424] border-[#333] focus:border-[#6B00D7] flex-1"
                    />
                    <Button 
                      onClick={addBeneficiary}
                      disabled={!beneficiaryInput}
                      className="bg-[#6B00D7] hover:bg-[#6B00D7]/80 text-white"
                    >
                      Add
                    </Button>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    Enter wallet addresses for on-chain notification or email addresses for off-chain notification.
                  </p>
                </div>
                
                {beneficiaries.length > 0 ? (
                  <div className="space-y-2">
                    <Label>Current Beneficiaries</Label>
                    <div className="bg-[#242424] border border-[#333] rounded-lg p-4 max-h-60 overflow-y-auto">
                      {beneficiaries.map((beneficiary, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b border-[#333] last:border-0">
                          <span className="text-sm text-gray-300 truncate max-w-md">{beneficiary}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeBeneficiary(index)}
                            className="h-8 text-gray-400 hover:text-white hover:bg-[#FF5AF7]/10"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6 bg-[#242424] border border-dashed border-[#333] rounded-lg">
                    <Users className="h-10 w-10 text-gray-500 mx-auto mb-3" />
                    <p className="text-gray-400">No beneficiaries added yet</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Add at least one beneficiary who will receive access to your memory vault
                    </p>
                  </div>
                )}
                
                <div className="p-4 bg-[#242424] rounded-lg border border-[#333]">
                  <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
                    <Bell className="h-5 w-5 text-[#FF5AF7]" />
                    <span>Notification Settings</span>
                  </h3>
                  <p className="text-sm text-gray-300 mb-4">
                    When your vault unlocks, beneficiaries will be notified through:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-email" className="cursor-pointer flex items-center gap-2 text-sm text-gray-300">
                        Email notifications
                      </Label>
                      <Switch id="notify-email" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-chain" className="cursor-pointer flex items-center gap-2 text-sm text-gray-300">
                        On-chain notifications
                      </Label>
                      <Switch id="notify-chain" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-app" className="cursor-pointer flex items-center gap-2 text-sm text-gray-300">
                        App notifications
                      </Label>
                      <Switch id="notify-app" defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between border-t border-[#333] pt-6">
                <Button variant="outline" onClick={prevStep}>
                  Previous
                </Button>
                <Button 
                  onClick={nextStep}
                  disabled={beneficiaries.length === 0}
                  className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white"
                >
                  Next: Media Content
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Step 4: Media Content */}
          {step === 4 && (
            <Card className="bg-[#1A1A1A] border-[#333] shadow-xl shadow-[#6B00D7]/5">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Media Content</CardTitle>
                <CardDescription>
                  Upload photos, videos, and other media to include in your memory vault
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <Tabs defaultValue="photos" className="w-full">
                  <TabsList className="grid grid-cols-3 bg-[#242424]">
                    <TabsTrigger value="photos" className="data-[state=active]:bg-[#6B00D7]/20 data-[state=active]:text-[#FF5AF7]">
                      Photos
                    </TabsTrigger>
                    <TabsTrigger value="videos" className="data-[state=active]:bg-[#6B00D7]/20 data-[state=active]:text-[#FF5AF7]">
                      Videos
                    </TabsTrigger>
                    <TabsTrigger value="message" className="data-[state=active]:bg-[#6B00D7]/20 data-[state=active]:text-[#FF5AF7]">
                      Message
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="photos" className="pt-4">
                    <div className="p-6 bg-[#242424] border border-dashed border-[#333] rounded-lg text-center">
                      <Image className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-white mb-2">Upload Photos</h3>
                      <p className="text-sm text-gray-400 mb-4">
                        Add photos that will be stored securely and revealed when the vault unlocks
                      </p>
                      
                      <Button
                        onClick={() => handleMediaUpload('image')}
                        disabled={isProcessing}
                        className="bg-[#6B00D7] hover:bg-[#6B00D7]/80 text-white"
                      >
                        {isProcessing ? (
                          <>Processing...</>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Select Photos
                          </>
                        )}
                      </Button>
                      
                      {uploadedImages > 0 && (
                        <div className="mt-4 text-left">
                          <Label>Uploaded Photos</Label>
                          <div className="mt-2 p-3 bg-[#1A1A1A] rounded-md border border-[#333]">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-300">
                                {uploadedImages} photo{uploadedImages !== 1 ? 's' : ''} uploaded
                              </span>
                              <Badge className="bg-[#6B00D7]/30 text-[#FF5AF7] hover:bg-[#6B00D7]/40">
                                Encrypted
                              </Badge>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="videos" className="pt-4">
                    <div className="p-6 bg-[#242424] border border-dashed border-[#333] rounded-lg text-center">
                      <Video className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-white mb-2">Upload Videos</h3>
                      <p className="text-sm text-gray-400 mb-4">
                        Add videos that will be stored securely and revealed when the vault unlocks
                      </p>
                      
                      <Button
                        onClick={() => handleMediaUpload('video')}
                        disabled={isProcessing}
                        className="bg-[#6B00D7] hover:bg-[#6B00D7]/80 text-white"
                      >
                        {isProcessing ? (
                          <>Processing...</>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Select Videos
                          </>
                        )}
                      </Button>
                      
                      {uploadedVideos > 0 && (
                        <div className="mt-4 text-left">
                          <Label>Uploaded Videos</Label>
                          <div className="mt-2 p-3 bg-[#1A1A1A] rounded-md border border-[#333]">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-300">
                                {uploadedVideos} video{uploadedVideos !== 1 ? 's' : ''} uploaded
                              </span>
                              <Badge className="bg-[#6B00D7]/30 text-[#FF5AF7] hover:bg-[#6B00D7]/40">
                                Encrypted
                              </Badge>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="message" className="pt-4">
                    <div className="space-y-4">
                      <Label htmlFor="personal-message">Personal Message</Label>
                      <Textarea 
                        id="personal-message" 
                        placeholder="Write a message that will be revealed when the vault unlocks..." 
                        className="min-h-[200px] bg-[#242424] border-[#333] focus:border-[#6B00D7]"
                        value={personalMessage}
                        onChange={(e) => setPersonalMessage(e.target.value)}
                      />
                      <p className="text-sm text-gray-400">
                        This message will be encrypted and only revealed when the vault unlocks.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="p-4 bg-[#242424] rounded-lg border border-[#333]">
                  <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
                    <Save className="h-5 w-5 text-[#FF5AF7]" />
                    <span>Storage Settings</span>
                  </h3>
                  
                  <div className="space-y-4 mt-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label htmlFor="storage-level">Storage Redundancy Level</Label>
                        <span className="text-sm text-[#FF5AF7]">{storageLevel}%</span>
                      </div>
                      <Slider
                        id="storage-level"
                        defaultValue={[50]}
                        max={100}
                        step={10}
                        onValueChange={(value) => setStorageLevel(value[0])}
                        className="[&>[role=slider]]:bg-[#FF5AF7]"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Higher redundancy ensures data remains accessible even if some storage providers fail.
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enable-backup" className="cursor-pointer flex items-center gap-2 text-sm text-gray-300">
                        Enable cross-chain backup
                      </Label>
                      <Switch 
                        id="enable-backup" 
                        checked={enableBackup}
                        onCheckedChange={setEnableBackup} 
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between border-t border-[#333] pt-6">
                <Button variant="outline" onClick={prevStep}>
                  Previous
                </Button>
                <Button 
                  onClick={nextStep}
                  disabled={uploadedImages === 0 && uploadedVideos === 0 && !personalMessage}
                  className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white"
                >
                  Next: Recovery Options
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Step 5: Recovery Options */}
          {step === 5 && (
            <Card className="bg-[#1A1A1A] border-[#333] shadow-xl shadow-[#6B00D7]/5">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Recovery Options</CardTitle>
                <CardDescription>
                  Configure recovery methods in case of lost access credentials
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Primary Recovery Method</Label>
                  <RadioGroup defaultValue="social" value={recoveryOption} onValueChange={setRecoveryOption} className="grid grid-cols-1 gap-4">
                    <div>
                      <RadioGroupItem
                        value="social"
                        id="recovery-social"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="recovery-social"
                        className="flex flex-col items-start justify-between rounded-md border-2 border-[#333] bg-[#242424] p-4 hover:bg-[#2A2A2A] hover:border-[#6B00D7] peer-data-[state=checked]:border-[#FF5AF7] [&:has([data-state=checked])]:border-[#FF5AF7]"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <Users className="h-6 w-6 text-[#FF5AF7]" />
                          <span className="text-lg font-medium">Social Recovery</span>
                        </div>
                        <span className="text-sm text-gray-400">
                          Trusted contacts can collectively authorize recovery after a security waiting period
                        </span>
                      </Label>
                    </div>
                    
                    <div>
                      <RadioGroupItem
                        value="geo"
                        id="recovery-geo"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="recovery-geo"
                        className="flex flex-col items-start justify-between rounded-md border-2 border-[#333] bg-[#242424] p-4 hover:bg-[#2A2A2A] hover:border-[#6B00D7] peer-data-[state=checked]:border-[#FF5AF7] [&:has([data-state=checked])]:border-[#FF5AF7]"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <Globe className="h-6 w-6 text-[#FF5AF7]" />
                          <span className="text-lg font-medium">Geo-Location Recovery</span>
                        </div>
                        <span className="text-sm text-gray-400">
                          Requires physical presence in specific predefined locations to initiate recovery
                        </span>
                      </Label>
                    </div>
                    
                    <div>
                      <RadioGroupItem
                        value="multi"
                        id="recovery-multi"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="recovery-multi"
                        className="flex flex-col items-start justify-between rounded-md border-2 border-[#333] bg-[#242424] p-4 hover:bg-[#2A2A2A] hover:border-[#6B00D7] peer-data-[state=checked]:border-[#FF5AF7] [&:has([data-state=checked])]:border-[#FF5AF7]"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <Key className="h-6 w-6 text-[#FF5AF7]" />
                          <span className="text-lg font-medium">Multi-Chain Key Sharding</span>
                        </div>
                        <span className="text-sm text-gray-400">
                          Recovery keys are sharded across multiple blockchains for maximum security and availability
                        </span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {recoveryOption === "social" && (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label htmlFor="recovery-threshold">Required Approvals for Recovery</Label>
                        <span className="text-sm text-[#FF5AF7]">{recoveryThreshold} people</span>
                      </div>
                      <Slider
                        id="recovery-threshold"
                        defaultValue={[2]}
                        min={1}
                        max={5}
                        step={1}
                        onValueChange={(value) => setRecoveryThreshold(value[0])}
                        className="[&>[role=slider]]:bg-[#FF5AF7]"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Higher thresholds provide better security but require more coordination for recovery.
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="p-4 bg-[#242424] rounded-lg border border-[#333]">
                  <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
                    <Shield className="h-5 w-5 text-[#FF5AF7]" />
                    <span>Recovery Security Features</span>
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="mandatory-waiting" className="cursor-pointer flex items-center gap-2 text-sm text-gray-300">
                        Mandatory waiting period (7 days)
                      </Label>
                      <Switch id="mandatory-waiting" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="public-notice" className="cursor-pointer flex items-center gap-2 text-sm text-gray-300">
                        Public on-chain recovery notice
                      </Label>
                      <Switch id="public-notice" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="emergency-cancel" className="cursor-pointer flex items-center gap-2 text-sm text-gray-300">
                        Emergency recovery cancellation
                      </Label>
                      <Switch id="emergency-cancel" defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between border-t border-[#333] pt-6">
                <Button variant="outline" onClick={prevStep}>
                  Previous
                </Button>
                <Button 
                  onClick={nextStep}
                  className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white"
                >
                  Next: Review & Create
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Step 6: Review & Create */}
          {step === 6 && (
            <Card className="bg-[#1A1A1A] border-[#333] shadow-xl shadow-[#6B00D7]/5">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Review & Create Vault</CardTitle>
                <CardDescription>
                  Review your Memory Vault settings before creation
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium text-white">Basic Settings</h3>
                    <div className="bg-[#242424] rounded-lg p-4 border border-[#333]">
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-400">Vault Name:</dt>
                          <dd className="text-sm font-medium text-white">{vaultName}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-400">Primary Blockchain:</dt>
                          <dd className="text-sm font-medium text-white capitalize">{primaryBlockchain}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-400">Unlock Method:</dt>
                          <dd className="text-sm font-medium text-white capitalize">{unlockEvent === "date" ? "Specific Date" : "Blockchain Event"}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-400">Unlock Date:</dt>
                          <dd className="text-sm font-medium text-white">{unlockDate}</dd>
                        </div>
                      </dl>
                    </div>
                    
                    <h3 className="text-lg font-medium text-white">Content</h3>
                    <div className="bg-[#242424] rounded-lg p-4 border border-[#333]">
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-400">Images:</dt>
                          <dd className="text-sm font-medium text-white">{uploadedImages} uploaded</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-400">Videos:</dt>
                          <dd className="text-sm font-medium text-white">{uploadedVideos} uploaded</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-400">Message:</dt>
                          <dd className="text-sm font-medium text-white">{personalMessage ? "Included" : "None"}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-400">Storage Redundancy:</dt>
                          <dd className="text-sm font-medium text-white">{storageLevel}%</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium text-white">Beneficiaries</h3>
                    <div className="bg-[#242424] rounded-lg p-4 border border-[#333]">
                      {beneficiaries.length > 0 ? (
                        <ul className="space-y-1 max-h-28 overflow-y-auto">
                          {beneficiaries.map((beneficiary, index) => (
                            <li key={index} className="text-sm text-gray-300 truncate">
                              {beneficiary}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-400">No beneficiaries added</p>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-medium text-white">Recovery</h3>
                    <div className="bg-[#242424] rounded-lg p-4 border border-[#333]">
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-400">Recovery Method:</dt>
                          <dd className="text-sm font-medium text-white capitalize">{recoveryOption === "social" ? "Social Recovery" : recoveryOption === "geo" ? "Geo-Location Recovery" : "Multi-Chain Key Sharding"}</dd>
                        </div>
                        {recoveryOption === "social" && (
                          <div className="flex justify-between">
                            <dt className="text-sm text-gray-400">Required Approvals:</dt>
                            <dd className="text-sm font-medium text-white">{recoveryThreshold}</dd>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-400">Waiting Period:</dt>
                          <dd className="text-sm font-medium text-white">7 days</dd>
                        </div>
                      </dl>
                    </div>
                    
                    <h3 className="text-lg font-medium text-white">Security Rating</h3>
                    <div className="bg-[#242424] rounded-lg p-4 border border-[#333]">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">Security Score:</span>
                        <span className="text-sm font-medium text-white">{securityScore}/100</span>
                      </div>
                      <div className="w-full bg-[#1A1A1A] h-2 rounded-full">
                        <div 
                          className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] h-2 rounded-full"
                          style={{ width: `${securityScore}%` }}
                        ></div>
                      </div>
                      <div className="mt-2 text-right">
                        <span className="text-xs font-medium" style={{ color: securityScore >= 75 ? '#FF5AF7' : '#FFB800' }}>
                          {getSecurityLevel()} Security
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-[#1A1A1A] border border-dashed border-[#333] rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <Clock className="h-6 w-6 text-[#FF5AF7]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white mb-1">Final Confirmation</h3>
                      <p className="text-sm text-gray-300">
                        By creating this vault, you confirm that:
                      </p>
                      <ul className="mt-2 space-y-1">
                        <li className="text-sm text-gray-400 flex items-start">
                          <span className="mr-2 text-[#FF5AF7]">•</span>
                          <span>All content will be encrypted and inaccessible until the unlock date/event</span>
                        </li>
                        <li className="text-sm text-gray-400 flex items-start">
                          <span className="mr-2 text-[#FF5AF7]">•</span>
                          <span>The time-lock parameters cannot be modified after creation</span>
                        </li>
                        <li className="text-sm text-gray-400 flex items-start">
                          <span className="mr-2 text-[#FF5AF7]">•</span>
                          <span>Recovery options require the defined verification steps and waiting periods</span>
                        </li>
                        <li className="text-sm text-gray-400 flex items-start">
                          <span className="mr-2 text-[#FF5AF7]">•</span>
                          <span>Storage fees are paid upfront to ensure long-term availability</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between border-t border-[#333] pt-6">
                <Button variant="outline" onClick={prevStep}>
                  Previous
                </Button>
                <Button 
                  onClick={createVault}
                  disabled={isProcessing}
                  className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white min-w-[150px]"
                >
                  {isProcessing ? (
                    <>Creating Vault...</>
                  ) : (
                    <>Create Memory Vault</>
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="bg-[#1A1A1A] border-[#333] shadow-xl shadow-[#6B00D7]/5 sticky top-8">
            <CardHeader>
              <CardTitle className="text-xl text-white">Vault Configuration</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Security Score</span>
                  <span className="text-white font-medium">{securityScore}/100</span>
                </div>
                <div className="w-full bg-[#242424] h-2 rounded-full">
                  <div 
                    className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${securityScore}%` }}
                  ></div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium" style={{ color: securityScore >= 75 ? '#FF5AF7' : '#FFB800' }}>
                    {getSecurityLevel()} Security
                  </span>
                </div>
              </div>
              
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Basic Details</span>
                  <Badge 
                    variant="outline" 
                    className={`${step >= 1 ? 'bg-[#6B00D7]/20 text-[#FF5AF7]' : 'bg-transparent'}`}
                  >
                    {step >= 1 && vaultName ? 'Complete' : 'Pending'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Unlock Settings</span>
                  <Badge 
                    variant="outline" 
                    className={`${step >= 2 && unlockDate ? 'bg-[#6B00D7]/20 text-[#FF5AF7]' : 'bg-transparent'}`}
                  >
                    {step >= 2 && unlockDate ? 'Complete' : 'Pending'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Beneficiaries</span>
                  <Badge 
                    variant="outline" 
                    className={`${step >= 3 && beneficiaries.length > 0 ? 'bg-[#6B00D7]/20 text-[#FF5AF7]' : 'bg-transparent'}`}
                  >
                    {step >= 3 && beneficiaries.length > 0 ? 'Complete' : 'Pending'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Media Content</span>
                  <Badge 
                    variant="outline" 
                    className={`${
                      step >= 4 && (uploadedImages > 0 || uploadedVideos > 0 || personalMessage) 
                        ? 'bg-[#6B00D7]/20 text-[#FF5AF7]' 
                        : 'bg-transparent'
                    }`}
                  >
                    {step >= 4 && (uploadedImages > 0 || uploadedVideos > 0 || personalMessage) ? 'Complete' : 'Pending'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Recovery Options</span>
                  <Badge 
                    variant="outline" 
                    className={`${step >= 5 ? 'bg-[#6B00D7]/20 text-[#FF5AF7]' : 'bg-transparent'}`}
                  >
                    {step >= 5 ? 'Complete' : 'Pending'}
                  </Badge>
                </div>
              </div>
              
              <div className="pt-4 border-t border-[#333]">
                <h3 className="text-lg font-medium text-white mb-3">Vault Features</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
                    <span className="text-sm text-gray-300">Time-locked digital + multimedia storage</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
                    <span className="text-sm text-gray-300">Multiple unlock conditions (date or events)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
                    <span className="text-sm text-gray-300">Decentralized & encrypted media storage</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
                    <span className="text-sm text-gray-300">Multiple beneficiaries with notification</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
                    <span className="text-sm text-gray-300">Flexible recovery mechanisms</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TimeLockedMemoryVault;