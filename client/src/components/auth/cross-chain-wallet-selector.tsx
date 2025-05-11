import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Wallet, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  SiTon, 
  SiSolana, 
  SiEthereum, 
  SiBitcoin 
} from "react-icons/si";
import { 
  useMultiChain, 
  BlockchainType 
} from '@/contexts/multi-chain-context';

type WalletIconProps = {
  walletName: string;
  size?: number;
  className?: string;
};

// Component to show wallet icons
const WalletIcon: React.FC<WalletIconProps> = ({ walletName, size = 24, className }) => {
  const lowerName = walletName.toLowerCase();
  
  if (lowerName.includes('ton')) {
    return <SiTon size={size} className={className} />;
  } else if (lowerName.includes('solana')) {
    return <SiSolana size={size} className={className} />;
  }
  
  // Default wallet icon
  return <Wallet size={size} className={className} />;
};

type CrossChainWalletSelectorProps = {
  className?: string;
};

const CrossChainWalletSelector: React.FC<CrossChainWalletSelectorProps> = ({ className }) => {
  const [open, setOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedChain, setSelectedChain] = useState<BlockchainType | null>(null);
  const multiChain = useMultiChain();
  
  // Get currently active chain
  const activeChain = multiChain.activeChain;
  const chainStatuses = multiChain.chainStatus;
  
  // Handle wallet connection
  const handleConnectWallet = async (chain: BlockchainType, walletName?: string) => {
    setIsConnecting(true);
    
    try {
      // Set the active chain first
      multiChain.setActiveChain(chain);
      
      // Connect to the chain
      await multiChain.connectChain(chain);
      
      // Close dialog after successful connection
      setOpen(false);
    } catch (error) {
      console.error(`Error connecting to ${chain} wallet:`, error);
    } finally {
      setIsConnecting(false);
    }
  };
  
  // Handle wallet disconnection
  const handleDisconnect = async () => {
    if (activeChain) {
      await multiChain.disconnectChain(activeChain);
    }
  };
  
  // Find a connected chain
  const connectedChain = Object.entries(chainStatuses).find(
    ([_, status]) => status.isConnected
  )?.[0] as BlockchainType | undefined;
  
  // Detect if we're in a mobile context based on className
  const isMobileContext = className?.includes('mobile-version');
  
  // If wallet is connected, show connected state
  if (connectedChain) {
    const status = chainStatuses[connectedChain];
    
    return (
      <Button 
        onClick={handleDisconnect} 
        variant="ghost" 
        size="sm"
        className={cn(
          "text-violet-400 hover:text-violet-300 hover:bg-violet-900/30 flex items-center gap-1",
          isMobileContext ? "h-8 px-2 text-xs min-w-0 w-full" : "",
          className
        )}
      >
        {connectedChain === BlockchainType.TON && <SiTon className="h-3 w-3" />}
        {connectedChain === BlockchainType.SOLANA && <SiSolana className="h-3 w-3" />}
        {multiChain.formatAddress(status.address, connectedChain, isMobileContext ? 3 : 4)}
      </Button>
    );
  }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className={cn(
            "border-violet-500 text-violet-400 hover:text-violet-300 hover:bg-violet-900/30",
            isMobileContext ? "h-8 px-2 text-xs" : "",
            className
          )}
        >
          <Wallet className={cn("h-3 w-3", isMobileContext ? "" : "mr-2")} />
          {isMobileContext ? null : "Connect Wallet"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#121212] border border-[#333]">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Connect Your Wallet</DialogTitle>
          <DialogDescription>
            Select a blockchain network to connect your wallet.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="ton" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="ton" onClick={() => setSelectedChain(BlockchainType.TON)} className="flex items-center gap-2">
              <SiTon className="h-4 w-4 text-teal-500" />
              <span>TON</span>
            </TabsTrigger>
            <TabsTrigger value="solana" onClick={() => setSelectedChain(BlockchainType.SOLANA)} className="flex items-center gap-2">
              <SiSolana className="h-4 w-4 text-purple-500" />
              <span>Solana</span>
            </TabsTrigger>
          </TabsList>
          
          {/* TON Content */}
          <TabsContent value="ton" className="space-y-4">
            <div className="p-4 border border-teal-900/50 rounded-md bg-teal-900/20">
              <h3 className="text-teal-400 font-medium text-lg flex items-center gap-2 mb-2">
                <SiTon className="h-5 w-5" /> TON Wallet
              </h3>
              <p className="text-gray-400 text-sm mb-4">Connect to TON blockchain with TON Connect protocol.</p>
              
              <Button 
                onClick={() => handleConnectWallet(BlockchainType.TON)}
                disabled={isConnecting}
                className="w-full bg-teal-700 hover:bg-teal-800"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <SiTon className="mr-2 h-4 w-4" />
                    Connect TON Wallet
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
          
          {/* Solana Content */}
          <TabsContent value="solana" className="space-y-4">
            <div className="p-4 border border-purple-900/50 rounded-md bg-purple-900/20">
              <h3 className="text-purple-400 font-medium text-lg flex items-center gap-2 mb-2">
                <SiSolana className="h-5 w-5" /> Solana Wallets
              </h3>
              <p className="text-gray-400 text-sm mb-4">Connect to Solana blockchain with your preferred wallet.</p>
              
              <div className="space-y-2">
                {multiChain.availableWallets(BlockchainType.SOLANA).length > 0 ? (
                  multiChain.availableWallets(BlockchainType.SOLANA).map(wallet => (
                    <Button 
                      key={wallet.name}
                      onClick={() => handleConnectWallet(BlockchainType.SOLANA, wallet.name)}
                      disabled={isConnecting}
                      className="w-full bg-purple-700 hover:bg-purple-800 flex justify-start items-center"
                    >
                      {isConnecting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <WalletIcon walletName={wallet.name} size={16} className="mr-2" />
                      )}
                      Connect {wallet.name}
                    </Button>
                  ))
                ) : (
                  <div className="text-center p-4 border border-dashed border-purple-700 rounded-md">
                    <p className="text-sm mb-2">No Solana wallets detected</p>
                    <p className="text-xs text-muted-foreground">
                      Please install a Solana wallet extension like Phantom or Solflare.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          {/* Coming soon tabs */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 border border-[#333] rounded-md opacity-50">
              <div className="flex flex-col items-center justify-center text-center">
                <SiEthereum className="h-6 w-6 text-blue-500 mb-2" />
                <h3 className="text-gray-300 font-medium">Ethereum</h3>
                <p className="text-gray-500 text-xs">Coming Soon</p>
              </div>
            </div>
            <div className="p-4 border border-[#333] rounded-md opacity-50">
              <div className="flex flex-col items-center justify-center text-center">
                <SiBitcoin className="h-6 w-6 text-orange-500 mb-2" />
                <h3 className="text-gray-300 font-medium">Bitcoin</h3>
                <p className="text-gray-500 text-xs">Coming Soon</p>
              </div>
            </div>
          </div>
        </Tabs>
        
        {/* Removed DialogFooter with Close button here that causes duplicate close buttons on mobile */}
      </DialogContent>
    </Dialog>
  );
};

export default CrossChainWalletSelector;