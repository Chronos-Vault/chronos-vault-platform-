import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Alert, 
  AlertDescription, 
  AlertTitle 
} from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Wallet, 
  ArrowRight, 
  Loader2, 
  AlertCircle, 
  Clock, 
  ShieldCheck,
  ArrowUpDown,
  Lock,
  Unlock,
  ChevronRight,
  Shield,
  Coins
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SimpleTonButton from '@/components/ton/SimpleTonButton';
import { useTon } from '@/contexts/ton-context';
import { tonContractService, VaultData, CVTTokenData } from '@/lib/ton/ton-contract-service';
import { tonService } from '@/lib/ton/ton-service';

const TONIntegrationPage: React.FC = () => {
  const { toast } = useToast();
  const { 
    isConnected, 
    isConnecting, 
    walletInfo, 
    sendTON, 
    createVault,
    connect,
    disconnect
  } = useTon();
  
  // State for transfer form
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for vault creation form
  const [vaultRecipient, setVaultRecipient] = useState('');
  const [vaultAmount, setVaultAmount] = useState('');
  const [vaultDuration, setVaultDuration] = useState('1m'); // Default 1 month
  const [vaultComment, setVaultComment] = useState('');
  const [isCreatingVault, setIsCreatingVault] = useState(false);
  
  // State for vault and token data
  const [cvtTokenData, setCvtTokenData] = useState<CVTTokenData | null>(null);
  const [ownedVaults, setOwnedVaults] = useState<VaultData[]>([]);
  const [isLoadingTokenData, setIsLoadingTokenData] = useState(false);
  const [isLoadingVaults, setIsLoadingVaults] = useState(false);
  
  // CVT token transfer state
  const [cvtRecipient, setCvtRecipient] = useState('');
  const [cvtAmount, setCvtAmount] = useState('');
  const [isTransferringCVT, setIsTransferringCVT] = useState(false);
  
  // CVT staking state
  const [stakingAmount, setStakingAmount] = useState('');
  const [stakingDuration, setStakingDuration] = useState('3m'); // Default 3 months
  const [isStaking, setIsStaking] = useState(false);
  
  // Load CVT token data and vaults when wallet is connected
  useEffect(() => {
    if (isConnected && walletInfo) {
      loadCVTTokenData();
      loadOwnedVaults();
    } else {
      setCvtTokenData(null);
      setOwnedVaults([]);
    }
  }, [isConnected, walletInfo]);
  
  // Load CVT token data
  const loadCVTTokenData = async () => {
    if (!isConnected || !walletInfo) return;
    
    setIsLoadingTokenData(true);
    try {
      const tokenData = await tonContractService.getCVTTokenData(walletInfo.address);
      setCvtTokenData(tokenData);
    } catch (error) {
      console.error('Error loading CVT token data:', error);
    } finally {
      setIsLoadingTokenData(false);
    }
  };
  
  // Load owned vaults
  const loadOwnedVaults = async () => {
    if (!isConnected || !walletInfo) return;
    
    setIsLoadingVaults(true);
    try {
      const vaults = await tonContractService.getOwnedVaults();
      setOwnedVaults(vaults);
    } catch (error) {
      console.error('Error loading owned vaults:', error);
    } finally {
      setIsLoadingVaults(false);
    }
  };
  
  // Handle CVT token transfer
  const handleTransferCVT = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cvtRecipient) {
      toast({
        title: 'Recipient Required',
        description: 'Please enter a recipient address.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!cvtAmount || isNaN(parseFloat(cvtAmount)) || parseFloat(cvtAmount) <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount greater than 0.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsTransferringCVT(true);
    
    try {
      const result = await tonContractService.transferCVT(cvtRecipient, cvtAmount);
      
      if (result.success) {
        toast({
          title: 'CVT Transfer Successful',
          description: `Successfully sent ${cvtAmount} CVT to ${cvtRecipient.substring(0, 6)}...${cvtRecipient.substring(cvtRecipient.length - 4)}`,
          variant: 'default',
        });
        setCvtRecipient('');
        setCvtAmount('');
        // Refresh token data
        loadCVTTokenData();
      } else {
        toast({
          title: 'CVT Transfer Failed',
          description: result.error || 'Unknown error occurred',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'CVT Transfer Failed',
        description: error.message || 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsTransferringCVT(false);
    }
  };
  
  // Handle CVT token staking
  const handleStakeCVT = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stakingAmount || isNaN(parseFloat(stakingAmount)) || parseFloat(stakingAmount) <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount greater than 0.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsStaking(true);
    
    try {
      // Convert duration to seconds
      let durationSeconds: number;
      
      switch(stakingDuration) {
        case '3m':
          durationSeconds = 90 * 24 * 60 * 60; // 90 days
          break;
        case '6m':
          durationSeconds = 180 * 24 * 60 * 60; // 180 days
          break;
        case '1y':
          durationSeconds = 365 * 24 * 60 * 60; // 365 days
          break;
        case '2y':
          durationSeconds = 2 * 365 * 24 * 60 * 60; // 2 years
          break;
        case '4y':
          durationSeconds = 4 * 365 * 24 * 60 * 60; // 4 years
          break;
        default:
          durationSeconds = 90 * 24 * 60 * 60; // default to 90 days
      }
      
      const result = await tonContractService.stakeCVT(stakingAmount, durationSeconds);
      
      if (result.success) {
        toast({
          title: 'CVT Staking Successful',
          description: `Successfully staked ${stakingAmount} CVT for ${stakingDuration.replace('m', ' months').replace('y', ' years')}`,
          variant: 'default',
        });
        setStakingAmount('');
        // Refresh token data
        loadCVTTokenData();
      } else {
        toast({
          title: 'CVT Staking Failed',
          description: result.error || 'Unknown error occurred',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'CVT Staking Failed',
        description: error.message || 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsStaking(false);
    }
  };
  
  // Handle CVT token unstaking
  const handleUnstakeCVT = async () => {
    try {
      setIsStaking(true);
      
      const result = await tonContractService.unstakeCVT();
      
      if (result.success) {
        toast({
          title: 'CVT Unstaking Successful',
          description: 'Successfully unstaked your CVT tokens',
          variant: 'default',
        });
        // Refresh token data
        loadCVTTokenData();
      } else {
        toast({
          title: 'CVT Unstaking Failed',
          description: result.error || 'Unknown error occurred',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'CVT Unstaking Failed',
        description: error.message || 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsStaking(false);
    }
  };
  
  // Handle TON transfer
  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recipient) {
      toast({
        title: 'Recipient Required',
        description: 'Please enter a recipient address.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount greater than 0.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await sendTON(recipient, amount);
      
      if (result.success) {
        toast({
          title: 'Transfer Successful',
          description: `Successfully sent ${amount} TON to ${recipient.substring(0, 6)}...${recipient.substring(recipient.length - 4)}`,
          variant: 'default',
        });
        setRecipient('');
        setAmount('');
      } else {
        toast({
          title: 'Transfer Failed',
          description: result.error || 'Unknown error occurred',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Transfer Failed',
        description: error.message || 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle vault creation
  const handleCreateVault = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!vaultAmount || isNaN(parseFloat(vaultAmount)) || parseFloat(vaultAmount) <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount greater than 0.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsCreatingVault(true);
    
    try {
      // Convert duration to seconds
      let unlockTimeSeconds: number;
      const now = Math.floor(Date.now() / 1000); // current time in seconds
      
      switch(vaultDuration) {
        case '1m':
          unlockTimeSeconds = now + (30 * 24 * 60 * 60); // 30 days
          break;
        case '3m':
          unlockTimeSeconds = now + (90 * 24 * 60 * 60); // 90 days
          break;
        case '6m':
          unlockTimeSeconds = now + (180 * 24 * 60 * 60); // 180 days
          break;
        case '1y':
          unlockTimeSeconds = now + (365 * 24 * 60 * 60); // 365 days
          break;
        case '4y':
          unlockTimeSeconds = now + (4 * 365 * 24 * 60 * 60); // 4 years
          break;
        default:
          unlockTimeSeconds = now + (30 * 24 * 60 * 60); // default to 30 days
      }
      
      const result = await createVault({
        unlockTime: unlockTimeSeconds,
        recipient: vaultRecipient || undefined, // if empty, use sender's address
        amount: vaultAmount,
        comment: vaultComment || undefined
      });
      
      if (result.success) {
        toast({
          title: 'Vault Created Successfully',
          description: `Time-locked vault created with ${vaultAmount} TON. Unlocks in ${vaultDuration.replace('m', ' months').replace('y', ' years')}`,
          variant: 'default',
        });
        setVaultAmount('');
        setVaultRecipient('');
        setVaultComment('');
      } else {
        toast({
          title: 'Vault Creation Failed',
          description: result.error || 'Unknown error occurred',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Vault Creation Failed',
        description: error.message || 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsCreatingVault(false);
    }
  };
  
  // Format balance display
  const formatBalance = (balance: string | undefined) => {
    if (!balance) return '0';
    
    // Consider TON has 9 decimal places
    const balanceNum = parseFloat(balance);
    if (balanceNum === 0) return '0';
    if (balanceNum < 0.01) return '< 0.01';
    
    return balanceNum.toFixed(2);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#121212] to-[#1A1A1A] text-white">
      <Header />
      <main className="flex-1 pb-20">
        <Helmet>
          <title>TON Integration | Chronos Vault</title>
          <meta name="description" content="Chronos Vault TON blockchain integration" />
        </Helmet>
        
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#0088CC] to-[#33AAFF]">
                TON Blockchain Integration
              </h1>
              <p className="text-xl text-gray-300">
                Securely manage your TON assets with Chronos Vault's time-locked vaults
              </p>
            </div>
            
            {/* Wallet Connection Card */}
            <Card className="mb-8 border-[#0088CC]/30 bg-gradient-to-b from-black/40 to-[#0088CC]/5 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Wallet className="mr-2 h-6 w-6 text-[#0088CC]" />
                  TON Wallet
                </CardTitle>
                <CardDescription>
                  Connect your TON wallet to create vaults and transfer assets
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    {isConnected && walletInfo ? (
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <span className="text-gray-400 mr-2">Address:</span>
                          <span className="font-mono text-sm">{walletInfo.address}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-400 mr-2">Balance:</span>
                          <span className="font-mono text-xl font-bold text-[#0088CC]">
                            {formatBalance(walletInfo.balance)} TON
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-400 mr-2">Network:</span>
                          <span className="text-sm">
                            {walletInfo.network === 'mainnet' ? 'Mainnet' : 'Testnet'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="py-4">
                        <Alert className="bg-blue-900/20 border-blue-400/30">
                          <AlertCircle className="h-4 w-4 text-blue-400" />
                          <AlertTitle>Wallet not connected</AlertTitle>
                          <AlertDescription>
                            Connect your TON wallet to access all features
                          </AlertDescription>
                        </Alert>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <SimpleTonButton 
                      variant="default" 
                      size="lg"
                      className="w-full md:w-auto"
                      isConnected={isConnected}
                      isConnecting={isConnecting}
                      address={walletInfo?.address}
                      onConnect={() => {
                        console.log("Connecting to TON wallet...")
                        return connect();
                      }}
                      onDisconnect={() => {
                        console.log("Disconnecting from TON wallet...")
                        return disconnect();
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* CVT Token Data Card */}
            {isConnected && (
              <Card className="mb-8 border-purple-700/30 bg-gradient-to-b from-black/40 to-purple-700/5 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <Coins className="mr-2 h-6 w-6 text-purple-500" />
                    CVT Token
                  </CardTitle>
                  <CardDescription>
                    Chronos Vault Token - Utility and Governance
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  {isLoadingTokenData ? (
                    <div className="py-8 flex justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                    </div>
                  ) : cvtTokenData ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-black/20 rounded-lg p-4 border border-purple-700/20">
                          <div className="text-sm text-gray-400 mb-1">CVT Balance</div>
                          <div className="text-2xl font-bold text-purple-500">{formatBalance(cvtTokenData.balance)}</div>
                        </div>
                        
                        <div className="bg-black/20 rounded-lg p-4 border border-purple-700/20">
                          <div className="text-sm text-gray-400 mb-1">Total Supply</div>
                          <div className="text-xl font-medium">{Number(cvtTokenData.totalSupply).toLocaleString()}</div>
                        </div>
                      </div>
                      
                      {cvtTokenData.isStaking && (
                        <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-700/30">
                          <div className="flex items-center mb-2">
                            <Shield className="h-5 w-5 text-purple-500 mr-2" />
                            <div className="text-lg font-medium">Active Staking</div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <div className="text-sm text-gray-400">Staked Amount</div>
                              <div className="text-lg font-medium">{formatBalance(cvtTokenData.stakingAmount || '0')} CVT</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-400">Unlock Date</div>
                              <div className="text-lg font-medium">
                                {cvtTokenData.stakingEndTime 
                                  ? new Date(cvtTokenData.stakingEndTime * 1000).toLocaleDateString() 
                                  : 'N/A'}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-400">Estimated Reward</div>
                              <div className="text-lg font-medium text-green-500">
                                {formatBalance(cvtTokenData.stakingReward || '0')} CVT
                              </div>
                            </div>
                          </div>
                          <div className="mt-4">
                            <Button
                              onClick={handleUnstakeCVT}
                              disabled={isStaking}
                              variant="outline"
                              className="border-purple-700 text-purple-400 hover:bg-purple-900/30"
                            >
                              {isStaking ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Unlock className="mr-2 h-4 w-4" />
                              )}
                              Unstake CVT
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-4">
                      <Alert className="bg-purple-900/20 border-purple-400/30">
                        <AlertCircle className="h-4 w-4 text-purple-400" />
                        <AlertTitle>No CVT Data Available</AlertTitle>
                        <AlertDescription>
                          Connect your TON wallet to view CVT token data
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            {/* Functionality Tabs */}
            <Tabs defaultValue="transfer" className="space-y-6">
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="transfer">Transfer TON</TabsTrigger>
                <TabsTrigger value="vault">Create Vault</TabsTrigger>
                <TabsTrigger value="cvt">CVT Transfer</TabsTrigger>
                <TabsTrigger value="staking">CVT Staking</TabsTrigger>
              </TabsList>
              
              {/* Transfer Tab */}
              <TabsContent value="transfer">
                <Card className="border-[#0088CC]/30 bg-gradient-to-b from-black/40 to-[#0088CC]/5">
                  <CardHeader>
                    <CardTitle>Transfer TON</CardTitle>
                    <CardDescription>
                      Send TON to any wallet address
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <form onSubmit={handleTransfer} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="recipient">Recipient Address</Label>
                        <Input
                          id="recipient"
                          placeholder="EQ..."
                          value={recipient}
                          onChange={(e) => setRecipient(e.target.value)}
                          disabled={!isConnected || isSubmitting}
                          className="bg-black/20 border-[#0088CC]/30"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount (TON)</Label>
                        <Input
                          id="amount"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          disabled={!isConnected || isSubmitting}
                          className="bg-black/20 border-[#0088CC]/30"
                        />
                      </div>
                    </form>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      type="submit"
                      onClick={handleTransfer}
                      disabled={!isConnected || isSubmitting}
                      className="w-full bg-[#0088CC] hover:bg-[#0099DD] text-white"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send TON <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {/* Vault Tab */}
              <TabsContent value="vault">
                <Card className="border-[#0088CC]/30 bg-gradient-to-b from-black/40 to-[#0088CC]/5">
                  <CardHeader>
                    <CardTitle>Create Time-Locked Vault</CardTitle>
                    <CardDescription>
                      Lock your TON assets for a specified period of time
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <form onSubmit={handleCreateVault} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="vaultAmount">Amount to Lock (TON)</Label>
                        <Input
                          id="vaultAmount"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          value={vaultAmount}
                          onChange={(e) => setVaultAmount(e.target.value)}
                          disabled={!isConnected || isCreatingVault}
                          className="bg-black/20 border-[#0088CC]/30"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="vaultDuration">Lock Duration</Label>
                        <Select 
                          value={vaultDuration} 
                          onValueChange={setVaultDuration}
                          disabled={!isConnected || isCreatingVault}
                        >
                          <SelectTrigger id="vaultDuration" className="bg-black/20 border-[#0088CC]/30">
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1m">1 Month</SelectItem>
                            <SelectItem value="3m">3 Months</SelectItem>
                            <SelectItem value="6m">6 Months</SelectItem>
                            <SelectItem value="1y">1 Year</SelectItem>
                            <SelectItem value="4y">4 Years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="vaultRecipient">Recipient (Optional)</Label>
                        <Input
                          id="vaultRecipient"
                          placeholder="If empty, funds return to your wallet"
                          value={vaultRecipient}
                          onChange={(e) => setVaultRecipient(e.target.value)}
                          disabled={!isConnected || isCreatingVault}
                          className="bg-black/20 border-[#0088CC]/30"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="vaultComment">Comment (Optional)</Label>
                        <Input
                          id="vaultComment"
                          placeholder="Add a note about this vault"
                          value={vaultComment}
                          onChange={(e) => setVaultComment(e.target.value)}
                          disabled={!isConnected || isCreatingVault}
                          className="bg-black/20 border-[#0088CC]/30"
                        />
                      </div>
                    </form>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      type="submit"
                      onClick={handleCreateVault}
                      disabled={!isConnected || isCreatingVault}
                      className="w-full bg-[#0088CC] hover:bg-[#0099DD] text-white"
                    >
                      {isCreatingVault ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Vault...
                        </>
                      ) : (
                        <>
                          <Lock className="mr-2 h-4 w-4" />
                          Create Time Vault
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {/* CVT Transfer Tab */}
              <TabsContent value="cvt">
                <Card className="border-purple-700/30 bg-gradient-to-b from-black/40 to-purple-700/5">
                  <CardHeader>
                    <CardTitle>Transfer CVT Tokens</CardTitle>
                    <CardDescription>
                      Send CVT tokens to any TON wallet address
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <form onSubmit={handleTransferCVT} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cvtRecipient">Recipient Address</Label>
                        <Input
                          id="cvtRecipient"
                          placeholder="EQ..."
                          value={cvtRecipient}
                          onChange={(e) => setCvtRecipient(e.target.value)}
                          disabled={!isConnected || isTransferringCVT}
                          className="bg-black/20 border-purple-700/30"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cvtAmount">Amount (CVT)</Label>
                        <Input
                          id="cvtAmount"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          value={cvtAmount}
                          onChange={(e) => setCvtAmount(e.target.value)}
                          disabled={!isConnected || isTransferringCVT}
                          className="bg-black/20 border-purple-700/30"
                        />
                      </div>
                    </form>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      type="submit"
                      onClick={handleTransferCVT}
                      disabled={!isConnected || isTransferringCVT}
                      className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white"
                    >
                      {isTransferringCVT ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send CVT <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {/* CVT Staking Tab */}
              <TabsContent value="staking">
                <Card className="border-purple-700/30 bg-gradient-to-b from-black/40 to-purple-700/5">
                  <CardHeader>
                    <CardTitle>Stake CVT Tokens</CardTitle>
                    <CardDescription>
                      Stake your CVT tokens to earn rewards and boost your vault security level
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <form onSubmit={handleStakeCVT} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="stakingAmount">Amount to Stake (CVT)</Label>
                        <Input
                          id="stakingAmount"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          value={stakingAmount}
                          onChange={(e) => setStakingAmount(e.target.value)}
                          disabled={!isConnected || isStaking}
                          className="bg-black/20 border-purple-700/30"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="stakingDuration">Staking Period</Label>
                        <Select 
                          value={stakingDuration} 
                          onValueChange={setStakingDuration}
                          disabled={!isConnected || isStaking}
                        >
                          <SelectTrigger id="stakingDuration" className="bg-black/20 border-purple-700/30">
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3m">3 Months (8% APY)</SelectItem>
                            <SelectItem value="6m">6 Months (12% APY)</SelectItem>
                            <SelectItem value="1y">1 Year (18% APY)</SelectItem>
                            <SelectItem value="2y">2 Years (24% APY)</SelectItem>
                            <SelectItem value="4y">4 Years (32% APY)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </form>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      type="submit"
                      onClick={handleStakeCVT}
                      disabled={!isConnected || isStaking}
                      className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white"
                    >
                      {isStaking ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Staking...
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="mr-2 h-4 w-4" />
                          Stake CVT Tokens
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TONIntegrationPage;