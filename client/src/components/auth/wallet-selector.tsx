import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SiTon, SiSolana, SiEthereum, SiBitcoin } from "react-icons/si";
import { useAuthContext } from '@/contexts/auth-context';
import { useSolana } from '@/contexts/solana-context';
import { truncateAddress } from '@/lib/utils';

type WalletSelectorProps = {
  className?: string;
}

const WalletSelector: React.FC<WalletSelectorProps> = ({ className }) => {
  const [open, setOpen] = useState(false);
  const { address, isConnected, isAuthenticated, signIn, signOut } = useAuthContext();
  const solana = useSolana();
  const [selectedBlockchain, setSelectedBlockchain] = useState<string | null>(null);

  // If already connected, show the connected wallet
  if (isConnected && isAuthenticated) {
    return (
      <Button 
        onClick={() => signOut()} 
        variant="ghost" 
        size="sm"
        className={cn("text-violet-400 hover:text-violet-300 hover:bg-violet-900/30", className)}
      >
        <Wallet className="mr-2 h-4 w-4" />
        {truncateAddress(address || '')}
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className={cn("border-violet-500 text-violet-400 hover:text-violet-300 hover:bg-violet-900/30", className)}
        >
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#121212] border border-[#333]">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Choose Blockchain</DialogTitle>
          <DialogDescription>
            Select which blockchain you want to connect to.
          </DialogDescription>
        </DialogHeader>
        
        {!selectedBlockchain ? (
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center h-24 bg-gradient-to-br from-[#6B00D7]/10 to-[#FF5AF7]/10 hover:from-[#6B00D7]/20 hover:to-[#FF5AF7]/20"
              onClick={() => setSelectedBlockchain('ton')}
            >
              <SiTon className="h-8 w-8 mb-2 text-teal-500" />
              <span>TON</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center h-24 bg-gradient-to-br from-[#6B00D7]/10 to-[#FF5AF7]/10 hover:from-[#6B00D7]/20 hover:to-[#FF5AF7]/20"
              onClick={() => setSelectedBlockchain('solana')}
            >
              <SiSolana className="h-8 w-8 mb-2 text-purple-500" />
              <span>Solana</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center h-24 bg-gradient-to-br from-[#6B00D7]/10 to-[#FF5AF7]/10 hover:from-[#6B00D7]/20 hover:to-[#FF5AF7]/20 opacity-50 cursor-not-allowed"
              disabled
            >
              <SiEthereum className="h-8 w-8 mb-2 text-blue-500" />
              <span>Ethereum</span>
              <span className="text-xs mt-1">Coming Soon</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center h-24 bg-gradient-to-br from-[#6B00D7]/10 to-[#FF5AF7]/10 hover:from-[#6B00D7]/20 hover:to-[#FF5AF7]/20 opacity-50 cursor-not-allowed"
              disabled
            >
              <SiBitcoin className="h-8 w-8 mb-2 text-orange-500" />
              <span>Bitcoin</span>
              <span className="text-xs mt-1">Coming Soon</span>
            </Button>
          </div>
        ) : selectedBlockchain === 'ton' ? (
          <div className="py-4 space-y-4">
            <Button 
              className="w-full bg-teal-600 hover:bg-teal-700" 
              onClick={() => {
                signIn();
                setOpen(false);
              }}
            >
              <SiTon className="mr-2 h-4 w-4" />
              Connect TON Wallet
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setSelectedBlockchain(null)}
            >
              Back to blockchain selection
            </Button>
          </div>
        ) : selectedBlockchain === 'solana' ? (
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              {solana.availableWallets.length > 0 ? (
                solana.availableWallets.map(wallet => (
                  <Button 
                    key={wallet.name}
                    className="w-full bg-purple-600 hover:bg-purple-700 justify-start" 
                    onClick={() => {
                      solana.connect(wallet.name);
                      setOpen(false);
                    }}
                  >
                    <SiSolana className="mr-2 h-4 w-4" />
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
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setSelectedBlockchain(null)}
            >
              Back to blockchain selection
            </Button>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default WalletSelector;