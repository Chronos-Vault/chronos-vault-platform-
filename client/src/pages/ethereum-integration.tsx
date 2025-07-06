import React, { useState } from 'react';
import { useEthereum } from '@/contexts/ethereum-context';
import { useMultiChain, BlockchainType } from '@/contexts/multi-chain-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/page-header';
import { RefreshCw, SendHorizontal, Calendar, ArrowRightCircle, KeyRound } from 'lucide-react';

/**
 * Ethereum Integration Page
 * 
 * Demonstrates Ethereum blockchain integration features including:
 * - Wallet connection
 * - Account information
 * - Network switching
 * - Sending ETH
 * - Creating time-locked vaults
 */
const EthereumIntegrationPage: React.FC = () => {
  // Connection state
  const { connectChain, chainStatus } = useMultiChain();
  const { 
    walletInfo, 
    isConnected, 
    isConnecting, 
    connectionStatus,
    connect, 
    disconnect,
    sendETH,
    createVault,
    switchNetwork,
    availableNetworks,
    currentNetwork
  } = useEthereum();
  
  // Form state for sending ETH
  const [sendAmount, setSendAmount] = useState<string>('0.01');
  const [recipient, setRecipient] = useState<string>('');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Form state for vault creation
  const [vaultAmount, setVaultAmount] = useState<string>('0.1');
  const [vaultRecipient, setVaultRecipient] = useState<string>('');
  const [unlockDate, setUnlockDate] = useState<string>('');
  const [vaultAddress, setVaultAddress] = useState<string | null>(null);
  const [isCreatingVault, setIsCreatingVault] = useState<boolean>(false);
  
  // Handle wallet connection
  const handleConnect = async () => {
    setError(null);
    try {
      const success = await connect();
      if (!success) {
        setError('Failed to connect. Please make sure you have MetaMask installed.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect');
    }
  };
  
  // Handle wallet disconnection
  const handleDisconnect = async () => {
    setError(null);
    try {
      await disconnect();
    } catch (err: any) {
      setError(err.message || 'Failed to disconnect');
    }
  };
  
  // Handle sending ETH
  const handleSendETH = async () => {
    setError(null);
    setTxHash(null);
    
    if (!recipient || !sendAmount) {
      setError('Recipient address and amount are required');
      return;
    }
    
    try {
      const result = await sendETH(recipient, sendAmount);
      if (result.success && result.transactionHash) {
        setTxHash(result.transactionHash);
      } else {
        setError(result.error || 'Transaction failed');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send ETH');
    }
  };
  
  // Handle vault creation
  const handleCreateVault = async () => {
    setError(null);
    setVaultAddress(null);
    setIsCreatingVault(true);
    
    if (!vaultAmount) {
      setError('Amount is required');
      setIsCreatingVault(false);
      return;
    }
    
    // Calculate unlock time from unlock date
    const unlockTime = unlockDate ? Math.floor(new Date(unlockDate).getTime() / 1000) : Math.floor(Date.now() / 1000) + 86400; // Default to 24 hours
    
    try {
      const result = await createVault({
        unlockTime,
        amount: vaultAmount,
        recipient: vaultRecipient || undefined
      });
      
      if (result.success && result.vaultAddress) {
        setVaultAddress(result.vaultAddress);
      } else {
        setError(result.error || 'Failed to create vault');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create vault');
    } finally {
      setIsCreatingVault(false);
    }
  };
  
  // Network switching handler
  const handleNetworkSwitch = async (network: string) => {
    setError(null);
    try {
      await switchNetwork(network as any);
    } catch (err: any) {
      setError(err.message || 'Failed to switch network');
    }
  };
  
  // Format ETH amount with commas and limited decimals
  const formatETH = (amount: string | null) => {
    if (!amount) return '0';
    const value = parseFloat(amount);
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    });
  };
  
  return (
    <div className="container px-4 py-8 mx-auto">
      <PageHeader 
        heading="Ethereum Integration" 
        description="Connect your Ethereum wallet and interact with the Ethereum blockchain"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* Connection Card */}
        <Card className="md:col-span-1 border-purple-900/30 backdrop-blur-sm bg-black/40">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <KeyRound className="mr-2 h-5 w-5 text-purple-400" />
              Wallet Connection
            </CardTitle>
            <CardDescription>
              Connect your Ethereum wallet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isConnected && walletInfo ? (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-gray-400">Address</Label>
                  <div className="mt-1 font-mono text-sm break-all">
                    {walletInfo.address}
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm text-gray-400">Balance</Label>
                  <div className="mt-1 text-lg font-medium">
                    {formatETH(walletInfo.balance)} ETH
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm text-gray-400">Network</Label>
                  <div className="mt-1 font-medium">
                    {walletInfo.network}
                  </div>
                </div>
                
                <div className="pt-2">
                  <Label className="text-sm text-gray-400">Switch Network</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {availableNetworks.map(network => (
                      <Button
                        key={network.id}
                        variant={currentNetwork === network.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleNetworkSwitch(network.id)}
                      >
                        {network.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-400 mb-4">
                  No wallet connected. Connect your Ethereum wallet to interact with the blockchain.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            {isConnected ? (
              <Button 
                variant="destructive" 
                onClick={handleDisconnect}
                disabled={isConnecting}
              >
                Disconnect
              </Button>
            ) : (
              <Button 
                onClick={handleConnect}
                disabled={isConnecting}
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            )}
          </CardFooter>
        </Card>
        
        {/* Main Functionality Card */}
        <Card className="md:col-span-2 border-purple-900/30 backdrop-blur-sm bg-black/40">
          <CardHeader>
            <CardTitle className="text-xl">Ethereum Features</CardTitle>
            <CardDescription>
              Send ETH and create time-locked vaults on Ethereum
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isConnected ? (
              <Tabs defaultValue="send" className="space-y-4">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="send">Send ETH</TabsTrigger>
                  <TabsTrigger value="vault">Create Vault</TabsTrigger>
                </TabsList>
                
                <TabsContent value="send" className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="recipient">Recipient Address</Label>
                      <Input
                        id="recipient"
                        placeholder="0x..."
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="amount">Amount (ETH)</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.001"
                        min="0"
                        placeholder="0.01"
                        value={sendAmount}
                        onChange={(e) => setSendAmount(e.target.value)}
                      />
                    </div>
                    
                    <Button 
                      className="w-full mt-2" 
                      onClick={handleSendETH}
                    >
                      <SendHorizontal className="mr-2 h-4 w-4" />
                      Send ETH
                    </Button>
                    
                    {txHash && (
                      <Alert className="mt-4 bg-green-950/40 border-green-700">
                        <CheckIcon className="h-4 w-4 text-green-500" />
                        <AlertTitle className="text-green-500">Transaction Sent!</AlertTitle>
                        <AlertDescription className="font-mono text-xs break-all">
                          Transaction Hash: {txHash}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="vault" className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="amount">Amount to Lock (ETH)</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.1"
                        value={vaultAmount}
                        onChange={(e) => setVaultAmount(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="unlockDate">Unlock Date</Label>
                      <div className="flex">
                        <Input
                          id="unlockDate"
                          type="datetime-local"
                          value={unlockDate}
                          onChange={(e) => setUnlockDate(e.target.value)}
                        />
                        <Button 
                          variant="outline" 
                          className="ml-2" 
                          onClick={() => {
                            const date = new Date();
                            date.setDate(date.getDate() + 1);
                            setUnlockDate(date.toISOString().slice(0, 16));
                          }}
                        >
                          <Calendar className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Assets will be locked until this date and time. Default is 24 hours from now.
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="vaultRecipient">Beneficiary Address (Optional)</Label>
                      <Input
                        id="vaultRecipient"
                        placeholder="0x... (Leave empty to use your address)"
                        value={vaultRecipient}
                        onChange={(e) => setVaultRecipient(e.target.value)}
                      />
                    </div>
                    
                    <Button 
                      className="w-full mt-2" 
                      onClick={handleCreateVault}
                      disabled={isCreatingVault}
                    >
                      <ArrowRightCircle className="mr-2 h-4 w-4" />
                      {isCreatingVault ? 'Creating...' : 'Create Time-Locked Vault'}
                    </Button>
                    
                    {vaultAddress && (
                      <Alert className="mt-4 bg-green-950/40 border-green-700">
                        <CheckIcon className="h-4 w-4 text-green-500" />
                        <AlertTitle className="text-green-500">Vault Created!</AlertTitle>
                        <AlertDescription className="font-mono text-xs break-all">
                          Vault Address: {vaultAddress}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400">Connect your wallet to use Ethereum features</p>
                <Button className="mt-4" onClick={handleConnect}>
                  Connect Wallet
                </Button>
              </div>
            )}
            
            {error && (
              <Alert className="mt-4 bg-red-950/40 border-red-700">
                <AlertTriangleIcon className="h-4 w-4 text-red-500" />
                <AlertTitle className="text-red-500">Error</AlertTitle>
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Icons
const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const AlertTriangleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
);

export default EthereumIntegrationPage;