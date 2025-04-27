import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
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
  Wallet, 
  ArrowRight, 
  Loader2, 
  AlertCircle, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import TonConnectButton from '@/components/ton/TonConnectButton';
import { useTon } from '@/contexts/ton-context';

const TONIntegrationPage: React.FC = () => {
  const { toast } = useToast();
  const { 
    isConnected, 
    isConnecting, 
    walletInfo, 
    sendTON, 
    createVault 
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
    <>
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
                  <TonConnectButton 
                    variant="default" 
                    size="lg"
                    className="w-full md:w-auto"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Functionality Tabs */}
          <Tabs defaultValue="transfer" className="space-y-6">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="transfer">Transfer TON</TabsTrigger>
              <TabsTrigger value="vault">Create Time Vault</TabsTrigger>
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
                    Lock your TON assets until a future date
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
                      <Label htmlFor="vaultRecipient">
                        Recipient Address (Optional)
                      </Label>
                      <Input
                        id="vaultRecipient"
                        placeholder="Leave empty to use your address"
                        value={vaultRecipient}
                        onChange={(e) => setVaultRecipient(e.target.value)}
                        disabled={!isConnected || isCreatingVault}
                        className="bg-black/20 border-[#0088CC]/30"
                      />
                      <p className="text-xs text-gray-400">
                        If left empty, the funds will be sent back to your wallet when unlocked.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="vaultComment">Comment (Optional)</Label>
                      <Input
                        id="vaultComment"
                        placeholder="Add a note to your vault"
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
                        <Clock className="mr-2 h-4 w-4" />
                        Create Time Vault
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Information Card */}
          <div className="mt-8">
            <Card className="bg-black/40 border-[#0088CC]/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <ShieldCheck className="h-10 w-10 text-[#0088CC] mt-1" />
                  <div>
                    <h3 className="text-lg font-medium mb-1">TON Blockchain Security</h3>
                    <p className="text-gray-400 text-sm">
                      Chronos Vault leverages TON's advanced security features to create tamper-proof 
                      time-locked vaults. Your assets remain secure on the blockchain until the 
                      specified unlock time.
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-[#0088CC]/10 text-[#0088CC] rounded-md text-xs">
                        Military-grade encryption
                      </span>
                      <span className="px-2 py-1 bg-[#0088CC]/10 text-[#0088CC] rounded-md text-xs">
                        Smart contract security
                      </span>
                      <span className="px-2 py-1 bg-[#0088CC]/10 text-[#0088CC] rounded-md text-xs">
                        Time-lock technology
                      </span>
                      <span className="px-2 py-1 bg-[#0088CC]/10 text-[#0088CC] rounded-md text-xs">
                        Decentralized verification
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default TONIntegrationPage;