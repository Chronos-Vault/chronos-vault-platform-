import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { PageHeader } from "@/components/page-header";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import CreateSmartContractVault from "@/components/vault/create-smart-contract-vault";
import { vaultContractService } from "@/lib/ethereum/vault-contract-service";
import { Button } from "@/components/ui/button";

export default function CreateSmartContractVaultPage() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [activeTab, setActiveTab] = useState("create");
  
  // Check wallet connection status on component mount
  useEffect(() => {
    checkWalletConnection();
  }, []);

  // Function to check if wallet is connected
  const checkWalletConnection = () => {
    const isConnected = vaultContractService.isWalletConnected();
    setIsWalletConnected(isConnected);
  };

  // Function to handle wallet connection
  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      const success = await vaultContractService.connectWallet();
      setIsWalletConnected(success);
      if (!success) {
        console.error("Failed to connect wallet");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Smart Contract Vault - Chronos Vault</title>
        <meta
          name="description"
          content="Create your own ERC-4626 compliant Smart Contract Vault with advanced security features and time-lock functionality."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#121212]">
        <Container>
          <PageHeader
            heading="Create Smart Contract Vault"
            description="Deploy your own ERC-4626 compliant vault with time-lock functionality and Triple-Chain Security"
          />

          {!isWalletConnected ? (
            <div className="mt-8 max-w-2xl mx-auto">
              <Alert variant="default" className="bg-[#151515] border-[#333] mb-8">
                <AlertCircle className="h-4 w-4 text-[#FF5AF7]" />
                <AlertTitle className="text-white">Wallet Connection Required</AlertTitle>
                <AlertDescription className="text-gray-400">
                  To create a Smart Contract Vault, you need to connect your Ethereum wallet first.
                </AlertDescription>
              </Alert>

              <div className="bg-[#151515] border border-[#333] rounded-lg p-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
                <p className="text-gray-400 mb-8">
                  Connect your Ethereum wallet to create and manage your Smart Contract Vaults. 
                  Your wallet will be used to sign transactions and interact with the blockchain.
                </p>
                <Button
                  onClick={handleConnectWallet}
                  disabled={isConnecting}
                  className="bg-[#6B00D7] hover:bg-[#8400FF] text-white px-8 py-2 rounded-md"
                >
                  {isConnecting ? "Connecting..." : "Connect Wallet"}
                </Button>
                <div className="mt-6 text-gray-500 text-sm">
                  Supported wallets: MetaMask, Coinbase Wallet, WalletConnect
                </div>
              </div>
            </div>
          ) : (
            <Tabs
              defaultValue="create"
              className="mt-8"
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                <TabsTrigger value="create">Create Vault</TabsTrigger>
                <TabsTrigger value="manage">Manage Vaults</TabsTrigger>
              </TabsList>

              <TabsContent value="create" className="py-6">
                <CreateSmartContractVault />
              </TabsContent>

              <TabsContent value="manage" className="py-6">
                <div className="text-center p-12 bg-[#151515] border border-[#333] rounded-lg">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Vault Management Coming Soon
                  </h3>
                  <p className="text-gray-400">
                    The vault management interface is currently under development. 
                    Check back soon to view and manage your deployed vaults.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </Container>
      </div>
    </>
  );
}