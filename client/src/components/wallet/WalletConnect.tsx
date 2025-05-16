import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBlockchain } from '@/hooks/use-blockchain';
import { TonkeeperIcon, TonhubIcon, OpenMaskIcon, MyTonWalletIcon } from './ton-wallet-icons';

// Import wallet icons from elsewhere or define them here
const EthereumIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="20" fill="#627EEA"/>
    <path d="M20 8V16.1875L26.6562 19.125L20 8Z" fill="white" fillOpacity="0.602"/>
    <path d="M20 8L13.3438 19.125L20 16.1875V8Z" fill="white"/>
    <path d="M20 27.0625V32L26.6562 21.75L20 27.0625Z" fill="white" fillOpacity="0.602"/>
    <path d="M20 32V27.0625L13.3438 21.75L20 32Z" fill="white"/>
    <path d="M20 25.375L26.6562 20.0625L20 16.1875V25.375Z" fill="white" fillOpacity="0.2"/>
    <path d="M13.3438 20.0625L20 25.375V16.1875L13.3438 20.0625Z" fill="white" fillOpacity="0.602"/>
  </svg>
);

const SolanaIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="20" fill="#000000"/>
    <path d="M12.6562 25.375C12.8125 25.2188 13.0312 25.125 13.25 25.125H29.75C30.0938 25.125 30.25 25.5312 30.0312 25.75L27.3438 28.4375C27.1875 28.5938 26.9688 28.6875 26.75 28.6875H10.25C9.90625 28.6875 9.75 28.2812 9.96875 28.0625L12.6562 25.375Z" fill="url(#paint0_linear_1_3)"/>
    <path d="M12.6562 11.5625C12.8125 11.4062 13.0312 11.3125 13.25 11.3125H29.75C30.0938 11.3125 30.25 11.7188 30.0312 11.9375L27.3438 14.625C27.1875 14.7812 26.9688 14.875 26.75 14.875H10.25C9.90625 14.875 9.75 14.4688 9.96875 14.25L12.6562 11.5625Z" fill="url(#paint1_linear_1_3)"/>
    <path d="M27.3438 18.4375C27.1875 18.2812 26.9688 18.1875 26.75 18.1875H10.25C9.90625 18.1875 9.75 18.5938 9.96875 18.8125L12.6562 21.5C12.8125 21.6562 13.0312 21.75 13.25 21.75H29.75C30.0938 21.75 30.25 21.3438 30.0312 21.125L27.3438 18.4375Z" fill="url(#paint2_linear_1_3)"/>
    <defs>
      <linearGradient id="paint0_linear_1_3" x1="10.6562" y1="30.0312" x2="27.5" y2="17.8125" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00FFA3"/>
        <stop offset="1" stopColor="#DC1FFF"/>
      </linearGradient>
      <linearGradient id="paint1_linear_1_3" x1="10.6562" y1="30.0312" x2="27.5" y2="17.8125" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00FFA3"/>
        <stop offset="1" stopColor="#DC1FFF"/>
      </linearGradient>
      <linearGradient id="paint2_linear_1_3" x1="10.6562" y1="30.0312" x2="27.5" y2="17.8125" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00FFA3"/>
        <stop offset="1" stopColor="#DC1FFF"/>
      </linearGradient>
    </defs>
  </svg>
);

const BitcoinIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="20" fill="#F7931A"/>
    <path d="M27.5 17.5C27.0625 15.125 24.875 14.5 22.5 14.75V11.25H20.625V14.625C20.125 14.625 19.5625 14.625 19.0625 14.625V11.25H17.1875V14.75H14.5V16.75C14.5 16.75 15.875 16.6875 15.8125 16.75C16.6875 16.75 16.9375 17.25 17 17.6875V24.0625C16.9375 24.375 16.75 24.75 16.1875 24.75C16.25 24.75 14.875 24.75 14.875 24.75L14.5 27H17.1875V30.5H19.0625V27.0625H20.625V30.5H22.5V27C25.75 26.8125 28 26.125 28.5 23.125C28.8125 20.75 27.6875 19.625 26 19.1875C27.125 18.625 27.8125 17.625 27.5 17.5ZM24.9375 22.6875C24.9375 24.625 22 24.625 20.6875 24.625V20.75C22 20.75 24.9375 20.625 24.9375 22.6875ZM23.9375 18.1875C23.9375 19.9375 21.5 19.9375 20.6875 19.9375V16.4375C21.5 16.4375 23.9375 16.3125 23.9375 18.1875Z" fill="white"/>
  </svg>
);

export default function WalletConnect() {
  const [open, setOpen] = useState(false);
  const { connect, disconnect, isConnected, connectedWallet } = useBlockchain();

  // Handle connection
  const handleConnect = (chain: string, wallet: string) => {
    connect(chain, wallet);
    setOpen(false);
  };

  return (
    <div>
      {isConnected && connectedWallet ? (
        <div className="flex flex-col items-start gap-2">
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">Connected to</div>
            <Badge variant="outline" className="bg-primary/10 border-primary/30 text-xs">
              {connectedWallet.chain.toUpperCase()} - {connectedWallet.wallet}
            </Badge>
          </div>
          <div className="font-mono text-xs text-muted-foreground truncate max-w-full">
            {connectedWallet.address}
          </div>
          <div className="flex gap-2 mt-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setOpen(true)}
            >
              Change Wallet
            </Button>
            <Button 
              size="sm" 
              variant="destructive" 
              onClick={disconnect}
            >
              Disconnect
            </Button>
          </div>
        </div>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600">
              Connect Wallet
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Connect Wallet</DialogTitle>
              <DialogDescription>
                Choose a blockchain network and connect your wallet
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="ton" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="ton">TON</TabsTrigger>
                <TabsTrigger value="ethereum">Ethereum</TabsTrigger>
                <TabsTrigger value="solana">Solana</TabsTrigger>
                <TabsTrigger value="bitcoin">Bitcoin</TabsTrigger>
              </TabsList>
              
              <TabsContent value="ton" className="mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleConnect('ton', 'tonkeeper')}
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors"
                  >
                    <TonkeeperIcon />
                    <span className="text-sm font-medium">Tonkeeper</span>
                  </button>
                  
                  <button
                    onClick={() => handleConnect('ton', 'tonhub')}
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors"
                  >
                    <TonhubIcon />
                    <span className="text-sm font-medium">TON Hub</span>
                  </button>
                  
                  <button
                    onClick={() => handleConnect('ton', 'openmask')}
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors"
                  >
                    <OpenMaskIcon />
                    <span className="text-sm font-medium">OpenMask</span>
                  </button>
                  
                  <button
                    onClick={() => handleConnect('ton', 'mytonwallet')}
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors"
                  >
                    <MyTonWalletIcon />
                    <span className="text-sm font-medium">MyTonWallet</span>
                  </button>
                </div>
              </TabsContent>
              
              <TabsContent value="ethereum" className="mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleConnect('ethereum', 'metamask')}
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors"
                  >
                    <EthereumIcon />
                    <span className="text-sm font-medium">MetaMask</span>
                  </button>
                  
                  <button
                    onClick={() => handleConnect('ethereum', 'walletconnect')}
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors"
                  >
                    <EthereumIcon />
                    <span className="text-sm font-medium">WalletConnect</span>
                  </button>
                </div>
              </TabsContent>
              
              <TabsContent value="solana" className="mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleConnect('solana', 'phantom')}
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors"
                  >
                    <SolanaIcon />
                    <span className="text-sm font-medium">Phantom</span>
                  </button>
                  
                  <button
                    onClick={() => handleConnect('solana', 'solflare')}
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors"
                  >
                    <SolanaIcon />
                    <span className="text-sm font-medium">Solflare</span>
                  </button>
                </div>
              </TabsContent>
              
              <TabsContent value="bitcoin" className="mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleConnect('bitcoin', 'xverse')}
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors"
                  >
                    <BitcoinIcon />
                    <span className="text-sm font-medium">Xverse</span>
                  </button>
                  
                  <button
                    onClick={() => handleConnect('bitcoin', 'unisat')}
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors"
                  >
                    <BitcoinIcon />
                    <span className="text-sm font-medium">Unisat</span>
                  </button>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}