import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useSolana } from '../contexts/solana-context';
import { SolanaCluster } from '../types/solana';
import { solanaContractService } from '../lib/solana/solana-contract-service';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from '@/components/page-header';

export default function SolanaIntegrationPage() {
  const { toast } = useToast();
  const { 
    isConnected,
    isConnecting,
    walletInfo,
    connect,
    disconnect,
    sendSOL,
    createVault,
    switchNetwork
  } = useSolana();

  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Vault creation state
  const [vaultAmount, setVaultAmount] = useState('');
  const [unlockDate, setUnlockDate] = useState('');
  const [vaultRecipient, setVaultRecipient] = useState('');
  const [vaultComment, setVaultComment] = useState('');
  const [creatingVault, setCreatingVault] = useState(false);

  const handleConnectWallet = async () => {
    try {
      const success = await connect();
      if (success) {
        toast({
          title: "Wallet Connected",
          description: "Successfully connected to Solana wallet",
        });
      } else {
        toast({
          title: "Connection Failed",
          description: "Failed to connect to Solana wallet",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Error",
        description: "An error occurred while connecting to the wallet",
        variant: "destructive",
      });
    }
  };

  const handleDisconnectWallet = async () => {
    try {
      const success = await disconnect();
      if (success) {
        toast({
          title: "Wallet Disconnected",
          description: "Successfully disconnected from Solana wallet",
        });
      }
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      toast({
        title: "Disconnection Error",
        description: "An error occurred while disconnecting the wallet",
        variant: "destructive",
      });
    }
  };

  const handleSendSOL = async () => {
    if (!recipientAddress || !amount) {
      toast({
        title: "Missing Information",
        description: "Please provide both recipient address and amount",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const result = await sendSOL(recipientAddress, amount);
      
      if (result.success) {
        toast({
          title: "Transaction Successful",
          description: `Successfully sent ${amount} SOL to ${recipientAddress.substring(0, 10)}...`,
        });
        
        // Reset form
        setRecipientAddress('');
        setAmount('');
      } else {
        toast({
          title: "Transaction Failed",
          description: result.error || "Failed to send SOL",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error sending SOL:", error);
      toast({
        title: "Transaction Error",
        description: "An error occurred during the transaction",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateVault = async () => {
    if (!vaultAmount || !unlockDate) {
      toast({
        title: "Missing Information",
        description: "Please provide both amount and unlock date",
        variant: "destructive",
      });
      return;
    }

    try {
      setCreatingVault(true);
      
      // Convert unlock date to timestamp
      const unlockTimestamp = new Date(unlockDate).getTime() / 1000;
      
      const result = await createVault({
        unlockTime: unlockTimestamp,
        recipient: vaultRecipient || undefined,
        amount: vaultAmount,
        comment: vaultComment || undefined
      });
      
      if (result.success) {
        toast({
          title: "Vault Created",
          description: `Successfully created a vault with ${vaultAmount} SOL to be unlocked on ${new Date(unlockTimestamp * 1000).toLocaleDateString()}`,
        });
        
        // Reset form
        setVaultAmount('');
        setUnlockDate('');
        setVaultRecipient('');
        setVaultComment('');
      } else {
        toast({
          title: "Vault Creation Failed",
          description: result.error || "Failed to create vault",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating vault:", error);
      toast({
        title: "Vault Creation Error",
        description: "An error occurred while creating the vault",
        variant: "destructive",
      });
    } finally {
      setCreatingVault(false);
    }
  };

  // Advanced vault types
  const [multiSigState, setMultiSigState] = useState({
    amount: '',
    signers: '',
    threshold: 2,
    description: ''
  });
  
  const [geoLockState, setGeoLockState] = useState({
    amount: '',
    latitude: 0,
    longitude: 0,
    radius: 100,
    description: ''
  });
  
  interface VaultDetails {
    exists: boolean;
    balance?: string;
    unlockTime?: number;
    owner?: string;
    beneficiary?: string;
    isMultiSig?: boolean;
    isGeoLocked?: boolean;
    description?: string;
    error?: string;
  }
  
  const [lookupState, setLookupState] = useState<{
    vaultAddress: string;
    vaultDetails: VaultDetails | null;
    loading: boolean;
  }>({
    vaultAddress: '',
    vaultDetails: null,
    loading: false
  });
  
  const [creatingMultiSig, setCreatingMultiSig] = useState(false);
  const [creatingGeoLock, setCreatingGeoLock] = useState(false);
  
  // Handle multi-sig vault creation
  const handleCreateMultiSigVault = async () => {
    if (!multiSigState.amount || !multiSigState.signers) {
      toast({
        title: "Missing Information",
        description: "Please provide amount and signers",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setCreatingMultiSig(true);
      
      // Parse signers (comma separated list of addresses)
      const signersList = multiSigState.signers.split(',').map(s => s.trim());
      
      const result = await solanaContractService.createMultiSigVault({
        amount: multiSigState.amount,
        signers: signersList,
        threshold: multiSigState.threshold,
        description: multiSigState.description || undefined
      });
      
      if (result.success) {
        toast({
          title: "Multi-Sig Vault Created",
          description: `Successfully created a multi-sig vault with ${multiSigState.amount} SOL with ${signersList.length} signers`,
        });
        
        // Reset form
        setMultiSigState({
          amount: '',
          signers: '',
          threshold: 2,
          description: ''
        });
      } else {
        toast({
          title: "Multi-Sig Vault Creation Failed",
          description: result.error || "Failed to create multi-sig vault",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating multi-sig vault:", error);
      toast({
        title: "Vault Creation Error",
        description: "An error occurred while creating the multi-sig vault",
        variant: "destructive",
      });
    } finally {
      setCreatingMultiSig(false);
    }
  };
  
  // Handle geo-locked vault creation
  const handleCreateGeoLockedVault = async () => {
    if (!geoLockState.amount || (geoLockState.latitude === 0 && geoLockState.longitude === 0)) {
      toast({
        title: "Missing Information",
        description: "Please provide amount and location",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setCreatingGeoLock(true);
      
      const result = await solanaContractService.createGeoLockedVault({
        amount: geoLockState.amount,
        latitude: geoLockState.latitude,
        longitude: geoLockState.longitude,
        radiusMeters: geoLockState.radius,
        description: geoLockState.description || undefined
      });
      
      if (result.success) {
        toast({
          title: "Geo-Locked Vault Created",
          description: `Successfully created a geo-locked vault with ${geoLockState.amount} SOL at location (${geoLockState.latitude}, ${geoLockState.longitude})`,
        });
        
        // Reset form
        setGeoLockState({
          amount: '',
          latitude: 0,
          longitude: 0,
          radius: 100,
          description: ''
        });
      } else {
        toast({
          title: "Geo-Locked Vault Creation Failed",
          description: result.error || "Failed to create geo-locked vault",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating geo-locked vault:", error);
      toast({
        title: "Vault Creation Error",
        description: "An error occurred while creating the geo-locked vault",
        variant: "destructive",
      });
    } finally {
      setCreatingGeoLock(false);
    }
  };
  
  // Handle vault lookup
  const handleVaultLookup = async () => {
    if (!lookupState.vaultAddress) {
      toast({
        title: "Missing Information",
        description: "Please provide a vault address",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLookupState(prev => ({ ...prev, loading: true }));
      
      const details = await solanaContractService.getVaultDetails(lookupState.vaultAddress);
      
      setLookupState(prev => ({ 
        ...prev, 
        vaultDetails: details,
        loading: false 
      }));
      
      if (!details.exists) {
        toast({
          title: "Vault Not Found",
          description: details.error || "No vault found at the provided address",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error looking up vault:", error);
      toast({
        title: "Lookup Error",
        description: "An error occurred while looking up the vault",
        variant: "destructive",
      });
      setLookupState(prev => ({ ...prev, loading: false, vaultDetails: null }));
    }
  };

  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        heading="Solana Integration" 
        description="Connect to Solana blockchain and manage time-locked vaults"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Solana Wallet</CardTitle>
            <CardDescription>Connect to your Solana wallet to interact with the blockchain</CardDescription>
          </CardHeader>
          <CardContent>
            {isConnected && walletInfo ? (
              <div className="space-y-4">
                <div>
                  <Label>Address</Label>
                  <div className="font-mono text-sm bg-secondary p-2 rounded mt-1 break-all">
                    {walletInfo.address}
                  </div>
                </div>
                <div>
                  <Label>Balance</Label>
                  <div className="text-xl font-bold">{walletInfo.balance} SOL</div>
                </div>
                <div>
                  <Label>Network</Label>
                  <div className="capitalize">{walletInfo.network}</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground mb-4">No wallet connected</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            {!isConnected ? (
              <>
                <Button 
                  onClick={handleConnectWallet} 
                  disabled={isConnecting}
                  className="w-full"
                >
                  {isConnecting ? "Connecting..." : "Connect Any Solana Wallet"}
                </Button>
                
                <div className="text-sm text-muted-foreground mt-2">
                  Available wallets:
                </div>
                
                <div className="grid grid-cols-2 gap-2 w-full">
                  {useSolana().availableWallets.length > 0 ? (
                    useSolana().availableWallets.map((wallet) => (
                      <Button
                        key={wallet.name}
                        variant="outline"
                        size="sm"
                        className="justify-start gap-2"
                        onClick={() => {
                          // Connect to specific wallet
                          setIsLoading(true);
                          connect(wallet.name)
                            .then((success) => {
                              if (success) {
                                toast({
                                  title: "Wallet Connected",
                                  description: `Successfully connected to ${wallet.name} wallet`,
                                });
                              } else {
                                toast({
                                  title: "Connection Failed",
                                  description: `Failed to connect to ${wallet.name} wallet`,
                                  variant: "destructive",
                                });
                              }
                            })
                            .catch((error) => {
                              console.error(`Error connecting to ${wallet.name}:`, error);
                              toast({
                                title: "Connection Error",
                                description: `An error occurred connecting to ${wallet.name}`,
                                variant: "destructive",
                              });
                            })
                            .finally(() => {
                              setIsLoading(false);
                            });
                        }}
                      >
                        {/* You can add wallet icons here in the future */}
                        {wallet.name}
                      </Button>
                    ))
                  ) : (
                    <div className="col-span-2 text-center text-xs text-muted-foreground">
                      No Solana wallets detected. Please install a wallet extension like Phantom or Solflare.
                    </div>
                  )}
                </div>
                
                {isConnecting && (
                  <div className="flex items-center justify-center mt-1">
                    <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mr-2"></div>
                    <span className="text-xs">Connecting...</span>
                  </div>
                )}
              </>
            ) : (
              <Button 
                onClick={handleDisconnectWallet} 
                variant="outline" 
                className="w-full"
              >
                Disconnect Wallet
              </Button>
            )}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Network Settings</CardTitle>
            <CardDescription>Switch between different Solana networks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              <Button 
                variant="outline" 
                onClick={() => switchNetwork(SolanaCluster.MAINNET)}
                className="justify-start"
              >
                Mainnet Beta
              </Button>
              <Button 
                variant="outline" 
                onClick={() => switchNetwork(SolanaCluster.TESTNET)}
                className="justify-start"
              >
                Testnet
              </Button>
              <Button 
                variant="outline" 
                onClick={() => switchNetwork(SolanaCluster.DEVNET)}
                className="justify-start"
              >
                Devnet
              </Button>
              <Button 
                variant="outline" 
                onClick={() => switchNetwork(SolanaCluster.TESTNET)}
                className="justify-start"
              >
                Localnet
              </Button>
            </div>
          </CardContent>
        </Card>

        {isConnected && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Send SOL</CardTitle>
                <CardDescription>Transfer SOL to another wallet address</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipient">Recipient Address</Label>
                    <Input
                      id="recipient"
                      value={recipientAddress}
                      onChange={(e) => setRecipientAddress(e.target.value)}
                      placeholder="Enter Solana address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (SOL)</Label>
                    <Input
                      id="amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      type="number"
                      min="0"
                      step="0.001"
                      placeholder="0.0"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleSendSOL} 
                  disabled={isLoading || !recipientAddress || !amount}
                  className="w-full"
                >
                  {isLoading ? "Sending..." : "Send SOL"}
                </Button>
              </CardFooter>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Create Solana Vaults</CardTitle>
                <CardDescription>Lock SOL securely with different vault types</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="time-lock">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="time-lock">Time-Locked</TabsTrigger>
                    <TabsTrigger value="multi-sig">Multi-Signature</TabsTrigger>
                    <TabsTrigger value="geo-lock">Geo-Locked</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="time-lock" className="mt-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="vaultAmount">Amount to Lock (SOL)</Label>
                        <Input
                          id="vaultAmount"
                          value={vaultAmount}
                          onChange={(e) => setVaultAmount(e.target.value)}
                          type="number"
                          min="0"
                          step="0.001"
                          placeholder="0.0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="unlockDate">Unlock Date</Label>
                        <Input
                          id="unlockDate"
                          value={unlockDate}
                          onChange={(e) => setUnlockDate(e.target.value)}
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="vaultRecipient">Recipient (Optional)</Label>
                        <Input
                          id="vaultRecipient"
                          value={vaultRecipient}
                          onChange={(e) => setVaultRecipient(e.target.value)}
                          placeholder="Recipient's Solana address"
                        />
                        <p className="text-xs text-muted-foreground">If left empty, funds will return to your wallet</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="vaultComment">Comment (Optional)</Label>
                        <Input
                          id="vaultComment"
                          value={vaultComment}
                          onChange={(e) => setVaultComment(e.target.value)}
                          placeholder="Add a note to this vault"
                        />
                      </div>
                      <Button 
                        onClick={handleCreateVault} 
                        disabled={creatingVault || !vaultAmount || !unlockDate}
                        className="w-full mt-4"
                      >
                        {creatingVault ? "Creating..." : "Create Time-Locked Vault"}
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="multi-sig" className="mt-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="multiSigAmount">Amount to Lock (SOL)</Label>
                        <Input
                          id="multiSigAmount"
                          value={multiSigState.amount}
                          onChange={(e) => setMultiSigState({...multiSigState, amount: e.target.value})}
                          type="number"
                          min="0"
                          step="0.001"
                          placeholder="0.0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="multiSigSigners">Signer Addresses</Label>
                        <Input
                          id="multiSigSigners"
                          value={multiSigState.signers}
                          onChange={(e) => setMultiSigState({...multiSigState, signers: e.target.value})}
                          placeholder="Comma-separated list of signer addresses"
                        />
                        <p className="text-xs text-muted-foreground">Enter multiple addresses separated by commas</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="multiSigThreshold">Required Signatures</Label>
                        <Input
                          id="multiSigThreshold"
                          value={multiSigState.threshold}
                          onChange={(e) => setMultiSigState({...multiSigState, threshold: parseInt(e.target.value)})}
                          type="number"
                          min="1"
                          placeholder="2"
                        />
                        <p className="text-xs text-muted-foreground">Number of signatures required to withdraw</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="multiSigDescription">Description (Optional)</Label>
                        <Input
                          id="multiSigDescription"
                          value={multiSigState.description}
                          onChange={(e) => setMultiSigState({...multiSigState, description: e.target.value})}
                          placeholder="Purpose of this multi-sig vault"
                        />
                      </div>
                      <Button 
                        onClick={handleCreateMultiSigVault} 
                        disabled={creatingMultiSig || !multiSigState.amount || !multiSigState.signers}
                        className="w-full mt-4"
                      >
                        {creatingMultiSig ? "Creating..." : "Create Multi-Signature Vault"}
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="geo-lock" className="mt-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="geoLockAmount">Amount to Lock (SOL)</Label>
                        <Input
                          id="geoLockAmount"
                          value={geoLockState.amount}
                          onChange={(e) => setGeoLockState({...geoLockState, amount: e.target.value})}
                          type="number"
                          min="0"
                          step="0.001"
                          placeholder="0.0"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="geoLockLatitude">Latitude</Label>
                          <Input
                            id="geoLockLatitude"
                            value={geoLockState.latitude}
                            onChange={(e) => setGeoLockState({...geoLockState, latitude: parseFloat(e.target.value)})}
                            type="number"
                            step="0.000001"
                            placeholder="40.7128"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="geoLockLongitude">Longitude</Label>
                          <Input
                            id="geoLockLongitude"
                            value={geoLockState.longitude}
                            onChange={(e) => setGeoLockState({...geoLockState, longitude: parseFloat(e.target.value)})}
                            type="number"
                            step="0.000001"
                            placeholder="-74.0060"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="geoLockRadius">Radius (meters)</Label>
                        <Input
                          id="geoLockRadius"
                          value={geoLockState.radius}
                          onChange={(e) => setGeoLockState({...geoLockState, radius: parseInt(e.target.value)})}
                          type="number"
                          min="10"
                          placeholder="100"
                        />
                        <p className="text-xs text-muted-foreground">Area within which the vault can be unlocked</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="geoLockDescription">Description (Optional)</Label>
                        <Input
                          id="geoLockDescription"
                          value={geoLockState.description}
                          onChange={(e) => setGeoLockState({...geoLockState, description: e.target.value})}
                          placeholder="Purpose of this geo-locked vault"
                        />
                      </div>
                      <Button 
                        onClick={handleCreateGeoLockedVault} 
                        disabled={creatingGeoLock || !geoLockState.amount || (geoLockState.latitude === 0 && geoLockState.longitude === 0)}
                        className="w-full mt-4"
                      >
                        {creatingGeoLock ? "Creating..." : "Create Geo-Locked Vault"}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Vault Lookup</CardTitle>
                <CardDescription>View details of an existing vault</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="vaultLookupAddress">Vault Address</Label>
                      <Input
                        id="vaultLookupAddress"
                        value={lookupState.vaultAddress}
                        onChange={(e) => setLookupState({...lookupState, vaultAddress: e.target.value})}
                        placeholder="Enter vault address to look up"
                      />
                    </div>
                    <div className="pt-8">
                      <Button 
                        onClick={handleVaultLookup} 
                        disabled={lookupState.loading || !lookupState.vaultAddress}
                      >
                        {lookupState.loading ? "Loading..." : "Lookup"}
                      </Button>
                    </div>
                  </div>
                  
                  {lookupState.vaultDetails && lookupState.vaultDetails.exists && (
                    <div className="mt-6 border rounded-lg p-4 bg-secondary/30">
                      <h3 className="font-semibold text-lg mb-4">Vault Details</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Balance</h4>
                          <p className="font-bold">{lookupState.vaultDetails.balance} SOL</p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Unlock Time</h4>
                          <p>{lookupState.vaultDetails.unlockTime ? new Date(lookupState.vaultDetails.unlockTime * 1000).toLocaleString() : 'N/A'}</p>
                        </div>
                        
                        <div className="col-span-2">
                          <h4 className="text-sm font-medium text-muted-foreground">Owner</h4>
                          <p className="font-mono text-xs break-all">{lookupState.vaultDetails.owner}</p>
                        </div>
                        
                        <div className="col-span-2">
                          <h4 className="text-sm font-medium text-muted-foreground">Beneficiary</h4>
                          <p className="font-mono text-xs break-all">{lookupState.vaultDetails.beneficiary}</p>
                        </div>
                        
                        <div className="col-span-2">
                          <h4 className="text-sm font-medium text-muted-foreground">Vault Type</h4>
                          <div className="flex gap-2 mt-1">
                            {lookupState.vaultDetails.isMultiSig && (
                              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">Multi-Sig</span>
                            )}
                            {lookupState.vaultDetails.isGeoLocked && (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">Geo-Locked</span>
                            )}
                            {!lookupState.vaultDetails.isMultiSig && !lookupState.vaultDetails.isGeoLocked && (
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">Time-Locked</span>
                            )}
                          </div>
                        </div>
                        
                        {lookupState.vaultDetails.description && (
                          <div className="col-span-2">
                            <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                            <p>{lookupState.vaultDetails.description}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-4">
                        <Button 
                          onClick={() => {
                            solanaContractService.withdrawFromVault({ 
                              vaultAddress: lookupState.vaultAddress 
                            }).then(result => {
                              if (result.success) {
                                toast({
                                  title: "Withdrawal Successful",
                                  description: `Successfully withdrew from vault`,
                                });
                              } else {
                                toast({
                                  title: "Withdrawal Failed",
                                  description: result.error || "Failed to withdraw from vault",
                                  variant: "destructive",
                                });
                              }
                            });
                          }} 
                          variant="outline"
                        >
                          Attempt Withdrawal
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}