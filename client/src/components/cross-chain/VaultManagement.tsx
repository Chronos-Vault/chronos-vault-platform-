import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEthereum } from '@/contexts/ethereum-context';
import { useSolana } from '@/contexts/solana-context';
import { useTon } from '@/contexts/ton-context';
import { useMultiChain, BlockchainType } from '@/contexts/multi-chain-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DatePicker } from '@/components/ui/date-picker';
import { BlockchainIcon } from '@/components/blockchain/BlockchainIcon';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, KeyIcon, LockIcon, UnlockIcon, UsersIcon, TimerIcon, SendIcon, PlusIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface Vault {
  id: string;
  name: string;
  unlockTime: number; // UNIX timestamp
  beneficiaries?: Array<{ address: string; share: number }>;
  totalBalance: string;
  currency: string;
  chain: BlockchainType;
}

export function VaultManagement() {
  const { currentChain } = useMultiChain();
  const ethereum = useEthereum();
  const solana = useSolana();
  const ton = useTon();
  const { toast } = useToast();
  
  // State for vaults
  const [vaults, setVaults] = useState<Vault[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVault, setSelectedVault] = useState<Vault | null>(null);
  
  // State for creating a new vault
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newVaultName, setNewVaultName] = useState('');
  const [unlockDate, setUnlockDate] = useState<Date | undefined>(undefined);
  const [initialDeposit, setInitialDeposit] = useState('');
  const [creatingVault, setCreatingVault] = useState(false);
  
  // State for depositing to a vault
  const [depositAmount, setDepositAmount] = useState('');
  const [depositing, setDepositing] = useState(false);
  
  // Get active tab state
  const [activeTab, setActiveTab] = useState('my-vaults');
  
  // Mock data (would be replaced with real implementation)
  const mockVaults: Vault[] = [
    {
      id: 'eth-1',
      name: 'Retirement Fund',
      unlockTime: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 year from now
      beneficiaries: [
        { address: '0x1234...5678', share: 100 },
      ],
      totalBalance: '2.5',
      currency: 'ETH',
      chain: BlockchainType.ETHEREUM
    },
    {
      id: 'sol-1',
      name: 'College Savings',
      unlockTime: Date.now() + 180 * 24 * 60 * 60 * 1000, // 6 months from now
      beneficiaries: [
        { address: 'sol123...456', share: 50 },
        { address: 'sol789...abc', share: 50 },
      ],
      totalBalance: '45',
      currency: 'SOL',
      chain: BlockchainType.SOLANA
    }
  ];
  
  // Load vaults
  useEffect(() => {
    const loadVaults = async () => {
      setLoading(true);
      
      try {
        // This would be replaced with actual API calls to each blockchain
        setTimeout(() => {
          // Simulate loading vaults from different chains
          setVaults(mockVaults);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading vaults:', error);
        setLoading(false);
      }
    };
    
    loadVaults();
  }, [currentChain]);
  
  const handleCreateVault = async () => {
    if (!newVaultName || !unlockDate || !initialDeposit) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in all fields to create a vault.',
        variant: 'destructive'
      });
      return;
    }
    
    setCreatingVault(true);
    
    try {
      // Convert to UNIX timestamp
      const unlockTime = Math.floor(unlockDate.getTime() / 1000);
      
      if (currentChain === BlockchainType.ETHEREUM) {
        // For Ethereum
        const result = await ethereum.createVault({
          name: newVaultName,
          unlockTime: unlockTime,
          initialDeposit: initialDeposit
        });
        
        if (result.success) {
          toast({
            title: 'Vault Created',
            description: `Your Ethereum vault has been created with address ${result.vaultAddress}`,
          });
          
          // Reset form and refresh vaults
          setNewVaultName('');
          setUnlockDate(undefined);
          setInitialDeposit('');
          setShowCreateForm(false);
          // Should refresh vaults here
        } else {
          toast({
            title: 'Error',
            description: result.error || 'Failed to create vault',
            variant: 'destructive'
          });
        }
      } else if (currentChain === BlockchainType.SOLANA) {
        // For Solana
        const result = await solana.createVault({
          unlockTime: unlockTime,
          amount: initialDeposit,
          comment: newVaultName
        });
        
        if (result.success) {
          toast({
            title: 'Vault Created',
            description: `Your Solana vault has been created with address ${result.vaultAddress}`,
          });
          
          // Reset form and refresh vaults
          setNewVaultName('');
          setUnlockDate(undefined);
          setInitialDeposit('');
          setShowCreateForm(false);
          // Should refresh vaults here
        } else {
          toast({
            title: 'Error',
            description: result.error || 'Failed to create vault',
            variant: 'destructive'
          });
        }
      } else if (currentChain === BlockchainType.TON) {
        // For TON
        // TON implementation would go here
        toast({
          title: 'Coming Soon',
          description: 'TON vault creation is coming soon!',
        });
      }
    } catch (error) {
      console.error('Error creating vault:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while creating your vault.',
        variant: 'destructive'
      });
    } finally {
      setCreatingVault(false);
    }
  };
  
  const handleDeposit = async () => {
    if (!selectedVault || !depositAmount) {
      toast({
        title: 'Missing Fields',
        description: 'Please select a vault and enter a deposit amount.',
        variant: 'destructive'
      });
      return;
    }
    
    setDepositing(true);
    
    try {
      // Chain-specific deposit logic
      if (selectedVault.chain === BlockchainType.ETHEREUM) {
        // Ethereum deposit (mock)
        toast({
          title: 'Deposit Successful',
          description: `You've deposited ${depositAmount} ETH to ${selectedVault.name}`,
        });
      } else if (selectedVault.chain === BlockchainType.SOLANA) {
        // Solana deposit (mock)
        toast({
          title: 'Deposit Successful',
          description: `You've deposited ${depositAmount} SOL to ${selectedVault.name}`,
        });
      } else if (selectedVault.chain === BlockchainType.TON) {
        // TON deposit (mock)
        toast({
          title: 'Deposit Successful',
          description: `You've deposited ${depositAmount} TON to ${selectedVault.name}`,
        });
      }
      
      // Reset deposit form
      setDepositAmount('');
      setSelectedVault(null);
      
      // Should refresh vaults here
    } catch (error) {
      console.error('Error depositing to vault:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while making your deposit.',
        variant: 'destructive'
      });
    } finally {
      setDepositing(false);
    }
  };
  
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  const isUnlocked = (unlockTime: number): boolean => {
    return Date.now() > unlockTime;
  };
  
  return (
    <div className="space-y-6">
      <Card className="bg-white/5 backdrop-blur-sm border-purple-500/10">
        <CardHeader>
          <CardTitle>Cross-Chain Vault Management</CardTitle>
          <CardDescription>
            Create and manage secure time-locked vaults across multiple blockchains
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="my-vaults" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="my-vaults">My Vaults</TabsTrigger>
              <TabsTrigger value="create-vault">Create New Vault</TabsTrigger>
            </TabsList>
            
            <TabsContent value="my-vaults">
              {loading ? (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">Loading your vaults...</p>
                </div>
              ) : vaults.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">
                    You don't have any vaults yet. Create one to get started!
                  </p>
                  <Button 
                    onClick={() => setActiveTab('create-vault')}
                    className="mt-4 bg-gradient-to-r from-[#6B00D7] to-[#C570FF] hover:from-[#5A00B8] hover:to-[#B14DFF]"
                  >
                    Create Your First Vault
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 mt-4">
                  {vaults.map((vault) => (
                    <Card 
                      key={vault.id}
                      className={`bg-white/5 hover:bg-white/10 transition-all cursor-pointer
                        ${selectedVault?.id === vault.id ? 'ring-2 ring-[#6B00D7]' : ''}
                      `}
                      onClick={() => setSelectedVault(selectedVault?.id === vault.id ? null : vault)}
                    >
                      <CardHeader className="pb-2 pt-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <BlockchainIcon blockchain={vault.chain} size={16} />
                            <CardTitle className="text-base font-medium">{vault.name}</CardTitle>
                          </div>
                          <Badge variant={isUnlocked(vault.unlockTime) ? 'success' : 'outline'}>
                            {isUnlocked(vault.unlockTime) ? (
                              <UnlockIcon className="w-3 h-3 mr-1" />
                            ) : (
                              <LockIcon className="w-3 h-3 mr-1" />
                            )}
                            {isUnlocked(vault.unlockTime) ? 'Unlocked' : 'Locked'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1 flex items-center">
                              <TimerIcon className="mr-1 h-3 w-3" /> Unlock Date
                            </p>
                            <p className="text-sm">{formatDate(vault.unlockTime)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1 flex items-center">
                              <KeyIcon className="mr-1 h-3 w-3" /> Balance
                            </p>
                            <p className="text-sm font-medium">
                              {vault.totalBalance} {vault.currency}
                            </p>
                          </div>
                          {vault.beneficiaries && vault.beneficiaries.length > 0 && (
                            <div className="col-span-2">
                              <p className="text-sm text-muted-foreground mb-1 flex items-center">
                                <UsersIcon className="mr-1 h-3 w-3" /> Beneficiaries
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {vault.beneficiaries.map((beneficiary, index) => (
                                  <Badge key={index} variant="secondary">
                                    {beneficiary.address} ({beneficiary.share}%)
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {selectedVault && (
                    <Card className="bg-white/5 mt-6">
                      <CardHeader>
                        <CardTitle className="text-base">
                          Deposit to {selectedVault.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <Label htmlFor="deposit-amount">Amount ({selectedVault.currency})</Label>
                            <Input
                              id="deposit-amount"
                              placeholder={`0.00 ${selectedVault.currency}`}
                              value={depositAmount}
                              onChange={(e) => setDepositAmount(e.target.value)}
                            />
                          </div>
                          <Button
                            className="self-end bg-gradient-to-r from-[#6B00D7] to-[#C570FF] hover:from-[#5A00B8] hover:to-[#B14DFF]"
                            onClick={handleDeposit}
                            disabled={depositing || !depositAmount}
                          >
                            <SendIcon className="mr-2 h-4 w-4" />
                            {depositing ? 'Depositing...' : 'Deposit'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="create-vault">
              <div className="space-y-4 mt-4">
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="vault-name">Vault Name</Label>
                    <Input
                      id="vault-name"
                      placeholder="My Retirement Fund"
                      value={newVaultName}
                      onChange={(e) => setNewVaultName(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label>Unlock Date</Label>
                    <DatePicker
                      date={unlockDate}
                      setDate={(date) => setUnlockDate(date)}
                      placeholder="When can the vault be unlocked?"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="initial-deposit">Initial Deposit ({currentChain === BlockchainType.ETHEREUM ? 'ETH' : currentChain === BlockchainType.SOLANA ? 'SOL' : 'TON'})</Label>
                    <Input
                      id="initial-deposit"
                      placeholder="0.00"
                      value={initialDeposit}
                      onChange={(e) => setInitialDeposit(e.target.value)}
                    />
                  </div>
                </div>
                
                <Alert className="bg-violet-950/20 border border-violet-500/20">
                  <AlertDescription className="text-violet-200">
                    Creating a vault will require you to sign a transaction from your connected {currentChain} wallet.
                  </AlertDescription>
                </Alert>
                
                <div className="flex justify-end">
                  <Button
                    className="bg-gradient-to-r from-[#6B00D7] to-[#C570FF] hover:from-[#5A00B8] hover:to-[#B14DFF]"
                    onClick={handleCreateVault}
                    disabled={creatingVault || !newVaultName || !unlockDate || !initialDeposit}
                  >
                    <PlusIcon className="mr-2 h-4 w-4" />
                    {creatingVault ? 'Creating...' : 'Create Vault'}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}