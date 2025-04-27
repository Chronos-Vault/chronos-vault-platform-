import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useSolana } from '../contexts/solana-context';
import { SolanaCluster } from '../lib/solana/solana-service';
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
          <CardFooter className="flex justify-center">
            {!isConnected ? (
              <Button 
                onClick={handleConnectWallet} 
                disabled={isConnecting}
                className="w-full"
              >
                {isConnecting ? "Connecting..." : "Connect Solana Wallet"}
              </Button>
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
                onClick={() => switchNetwork(SolanaCluster.LOCALNET)}
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

            <Card>
              <CardHeader>
                <CardTitle>Create Time-Locked Vault</CardTitle>
                <CardDescription>Lock SOL until a specific date</CardDescription>
              </CardHeader>
              <CardContent>
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
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleCreateVault} 
                  disabled={creatingVault || !vaultAmount || !unlockDate}
                  className="w-full"
                >
                  {creatingVault ? "Creating..." : "Create Vault"}
                </Button>
              </CardFooter>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}