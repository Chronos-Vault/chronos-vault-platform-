import React, { useState, useEffect } from 'react';
import { useEthereum } from '@/contexts/ethereum-context';
import { useSolana } from '@/contexts/solana-context';
import { useTon } from '@/contexts/ton-context';
import { useMultiChain, BlockchainType } from '@/contexts/multi-chain-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { LockIcon, UnlockIcon, CalendarIcon, Wallet, Plus } from 'lucide-react';
import { SiEthereum, SiSolana, SiTon } from 'react-icons/si';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface VaultProps {
  id: string;
  name: string;
  blockchain: BlockchainType;
  balance: string;
  unlockTime: Date;
  symbol: string;
  address: string;
  isLocked: boolean;
}

export function VaultManagement() {
  const { currentChain } = useMultiChain();
  const { isConnected: isEthConnected, walletInfo: ethInfo, createVault: createEthVault, getUserVaults: getEthVaults, getVaultDetails: getEthVaultDetails } = useEthereum();
  const { isConnected: isSolConnected, walletInfo: solInfo } = useSolana();
  const { isConnected: isTonConnected, walletInfo: tonInfo } = useTon();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<BlockchainType>(currentChain);
  const [vaults, setVaults] = useState<VaultProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [selectedVault, setSelectedVault] = useState<VaultProps | null>(null);
  
  // Form states
  const [unlockDate, setUnlockDate] = useState<Date | undefined>(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)); // 30 days from now
  const [amount, setAmount] = useState<string>('0.1');
  const [vaultName, setVaultName] = useState<string>('');
  const [depositAmount, setDepositAmount] = useState<string>('0.05');

  useEffect(() => {
    loadVaults();
  }, [activeTab, isEthConnected, isSolConnected, isTonConnected]);

  const loadVaults = async () => {
    setLoading(true);
    try {
      if (activeTab === BlockchainType.ETHEREUM && isEthConnected) {
        const response = await getEthVaults();
        if (response.success && response.vaults) {
          const vaultDetails = await Promise.all(
            response.vaults.map(async (address: string) => {
              const details = await getEthVaultDetails(address);
              if (details.success && details.details) {
                return {
                  id: address,
                  name: details.details.name,
                  blockchain: BlockchainType.ETHEREUM,
                  balance: details.details.balance,
                  unlockTime: new Date(details.details.unlockTime * 1000),
                  symbol: details.details.symbol,
                  address,
                  isLocked: Date.now() < details.details.unlockTime * 1000
                };
              }
              return null;
            })
          );
          setVaults(vaultDetails.filter(Boolean) as VaultProps[]);
        } else {
          setVaults([]);
        }
      } else if (activeTab === BlockchainType.SOLANA && isSolConnected) {
        // Implement Solana vault loading
        // For now use placeholder data
        // This should be replaced with actual data from Solana service
        setVaults([]);
      } else if (activeTab === BlockchainType.TON && isTonConnected) {
        // Implement TON vault loading
        // For now use placeholder data
        // This should be replaced with actual data from TON service
        setVaults([]);
      } else {
        setVaults([]);
      }
    } catch (error) {
      console.error('Error loading vaults:', error);
      setVaults([]);
    }
    setLoading(false);
  };

  const handleCreateVault = async () => {
    try {
      if (activeTab === BlockchainType.ETHEREUM && isEthConnected) {
        // Calculate unlock time as Unix timestamp
        const unlockTimestamp = Math.floor((unlockDate?.getTime() || Date.now()) / 1000);
        
        const response = await createEthVault({
          unlockTime: unlockTimestamp,
          amount,
          comment: vaultName
        });
        
        if (response.success) {
          toast({
            title: 'Vault Created',
            description: `Your vault was created successfully at ${response.vaultAddress}`,
          });
          setCreateDialogOpen(false);
          loadVaults();
        } else {
          toast({
            variant: 'destructive',
            title: 'Error Creating Vault',
            description: response.error || 'Unknown error occurred',
          });
        }
      } else if (activeTab === BlockchainType.SOLANA && isSolConnected) {
        // Implement Solana vault creation
        toast({
          title: 'Not Implemented',
          description: 'Solana vault creation is not yet implemented',
        });
      } else if (activeTab === BlockchainType.TON && isTonConnected) {
        // Implement TON vault creation
        toast({
          title: 'Not Implemented',
          description: 'TON vault creation is not yet implemented',
        });
      }
    } catch (error) {
      console.error('Error creating vault:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create vault',
      });
    }
  };

  const handleDepositToVault = async () => {
    if (!selectedVault) return;
    
    try {
      // Implementation depends on blockchain type
      toast({
        title: 'Deposit Initiated',
        description: `Depositing ${depositAmount} to vault ${selectedVault.name}`,
      });
      setDepositDialogOpen(false);
      // After successful deposit, reload vaults
      loadVaults();
    } catch (error) {
      console.error('Error depositing to vault:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to deposit to vault',
      });
    }
  };

  const getBlockchainIcon = (blockchain: BlockchainType) => {
    switch (blockchain) {
      case BlockchainType.ETHEREUM:
        return <SiEthereum className="h-4 w-4" />;
      case BlockchainType.SOLANA:
        return <SiSolana className="h-4 w-4" />;
      case BlockchainType.TON:
        return <SiTon className="h-4 w-4" />;
      default:
        return <Wallet className="h-4 w-4" />;
    }
  };

  const getBlockchainName = (blockchain: BlockchainType) => {
    switch (blockchain) {
      case BlockchainType.ETHEREUM:
        return 'Ethereum';
      case BlockchainType.SOLANA:
        return 'Solana';
      case BlockchainType.TON:
        return 'TON';
      default:
        return 'Unknown';
    }
  };

  const getBlockchainCurrency = (blockchain: BlockchainType) => {
    switch (blockchain) {
      case BlockchainType.ETHEREUM:
        return 'ETH';
      case BlockchainType.SOLANA:
        return 'SOL';
      case BlockchainType.TON:
        return 'TON';
      default:
        return '';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isConnected = () => {
    if (activeTab === BlockchainType.ETHEREUM) return isEthConnected;
    if (activeTab === BlockchainType.SOLANA) return isSolConnected;
    if (activeTab === BlockchainType.TON) return isTonConnected;
    return false;
  };

  return (
    <Card className="w-full bg-white/5 backdrop-blur-sm border-purple-500/10">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-bold">Time-Locked Vaults</CardTitle>
            <CardDescription>
              Manage your time-locked vaults across blockchains
            </CardDescription>
          </div>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
              >
                <Plus className="h-4 w-4 mr-2" /> Create Vault
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Time-Locked Vault</DialogTitle>
                <DialogDescription>
                  Lock your assets until a future date with Chronos Vault's secure time-lock system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="vault-name">Vault Name</Label>
                  <Input 
                    id="vault-name" 
                    placeholder="My Savings Vault" 
                    value={vaultName}
                    onChange={(e) => setVaultName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="unlock-date">Unlock Date</Label>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 opacity-50" />
                    <DatePicker
                      date={unlockDate}
                      setDate={setUnlockDate}
                      disabled={(date) => date < new Date()}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="amount">Initial Deposit ({getBlockchainCurrency(activeTab)})</Label>
                  <Input 
                    id="amount" 
                    type="number" 
                    min="0.001" 
                    step="0.001" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline" className="bg-purple-500/10 text-purple-300 border-purple-500/50">
                    {getBlockchainIcon(activeTab)} {getBlockchainName(activeTab)}
                  </Badge>
                  Your vault will be created on {getBlockchainName(activeTab)}.
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                  onClick={handleCreateVault}
                >
                  Create Vault
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Deposit Dialog */}
          <Dialog open={depositDialogOpen} onOpenChange={setDepositDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Deposit to Vault</DialogTitle>
                <DialogDescription>
                  Add funds to your {selectedVault?.name} vault.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="deposit-amount">Amount ({getBlockchainCurrency(activeTab)})</Label>
                  <Input 
                    id="deposit-amount" 
                    type="number" 
                    min="0.001" 
                    step="0.001" 
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current Balance:</span>
                    <span>{selectedVault?.balance} {getBlockchainCurrency(activeTab)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Unlock Date:</span>
                    <span>{selectedVault?.unlockTime ? formatDate(selectedVault.unlockTime) : '-'}</span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDepositDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleDepositToVault}>Deposit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as BlockchainType)}>
          <TabsList className="grid grid-cols-3 mb-4 bg-white/5">
            <TabsTrigger value={BlockchainType.ETHEREUM} className="data-[state=active]:bg-purple-500/20">
              <div className="flex items-center gap-2">
                <SiEthereum />
                <span className="hidden sm:inline">Ethereum</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value={BlockchainType.SOLANA} className="data-[state=active]:bg-purple-500/20">
              <div className="flex items-center gap-2">
                <SiSolana />
                <span className="hidden sm:inline">Solana</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value={BlockchainType.TON} className="data-[state=active]:bg-purple-500/20">
              <div className="flex items-center gap-2">
                <SiTon />
                <span className="hidden sm:inline">TON</span>
              </div>
            </TabsTrigger>
          </TabsList>

          {!isConnected() ? (
            <div className="text-center py-8">
              <Wallet className="h-12 w-12 mx-auto text-muted-foreground opacity-30 mb-3" />
              <h3 className="text-lg font-semibold mb-1">Wallet Not Connected</h3>
              <p className="text-muted-foreground mb-4">Connect your wallet to view and manage your vaults</p>
            </div>
          ) : loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : vaults.length === 0 ? (
            <div className="text-center py-8">
              <LockIcon className="h-12 w-12 mx-auto text-muted-foreground opacity-30 mb-3" />
              <h3 className="text-lg font-semibold mb-1">No Vaults Found</h3>
              <p className="text-muted-foreground mb-4">You don't have any vaults on {getBlockchainName(activeTab)} yet</p>
              <Button 
                onClick={() => setCreateDialogOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
              >
                <Plus className="h-4 w-4 mr-2" /> Create Your First Vault
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Unlock Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vaults.map((vault) => (
                    <TableRow key={vault.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {getBlockchainIcon(vault.blockchain)}
                          <span>{vault.name || 'Unnamed Vault'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {vault.balance} {getBlockchainCurrency(vault.blockchain)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3 opacity-70" />
                          {formatDate(vault.unlockTime)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {vault.isLocked ? (
                          <Badge variant="outline" className="bg-amber-500/10 text-amber-300 border-amber-500/50">
                            <LockIcon className="h-3 w-3 mr-1" /> Locked
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-green-500/10 text-green-300 border-green-500/50">
                            <UnlockIcon className="h-3 w-3 mr-1" /> Unlocked
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedVault(vault);
                            setDepositDialogOpen(true);
                          }}
                          className="mr-2"
                        >
                          Deposit
                        </Button>
                        <Button 
                          size="sm"
                          disabled={vault.isLocked}
                        >
                          {vault.isLocked ? 'Locked' : 'Withdraw'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}