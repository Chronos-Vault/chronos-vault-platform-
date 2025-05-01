import { Link, useLocation } from 'wouter';
import { useMultiChain, BlockchainType } from '@/contexts/multi-chain-context';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const [location] = useLocation();
  const { isConnected, walletInfo, connectChain, disconnectChain } = useMultiChain();

  const isActive = (path: string) => {
    return location === path ? 'bg-primary/10 text-primary' : 'text-foreground/70 hover:text-primary';
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                Chronos Vault
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/">
              <div className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/')} cursor-pointer`}>
                Home
              </div>
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1">
                  Vaults <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <Link href="/vault-types">
                  <DropdownMenuItem className="cursor-pointer">
                    Create Vault
                  </DropdownMenuItem>
                </Link>
                <Link href="/my-vaults">
                  <DropdownMenuItem className="cursor-pointer">
                    My Vaults
                  </DropdownMenuItem>
                </Link>
                <Link href="/advanced-vault-new">
                  <DropdownMenuItem className="cursor-pointer">
                    Advanced Options
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1">
                  Networks <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <Link href="/ethereum-integration">
                  <DropdownMenuItem className="cursor-pointer">
                    Ethereum
                  </DropdownMenuItem>
                </Link>
                <Link href="/solana-integration">
                  <DropdownMenuItem className="cursor-pointer">
                    Solana
                  </DropdownMenuItem>
                </Link>
                <Link href="/ton-integration">
                  <DropdownMenuItem className="cursor-pointer">
                    TON
                  </DropdownMenuItem>
                </Link>
                <Link href="/cross-chain-security">
                  <DropdownMenuItem className="cursor-pointer">
                    Security Dashboard
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/cvt-token">
              <div className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/cvt-token')} cursor-pointer`}>
                CVT Token
              </div>
            </Link>
            
            <Link href="/about">
              <div className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/about')} cursor-pointer`}>
                About
              </div>
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isConnected ? (
            <div className="hidden md:flex items-center gap-2">
              <div className="text-xs">
                {walletInfo.ethereum.isConnected && (
                  <span className="px-2 py-1 bg-purple-600/10 text-purple-600 rounded-full mr-2">
                    ETH Connected
                  </span>
                )}
                {walletInfo.solana.isConnected && (
                  <span className="px-2 py-1 bg-green-600/10 text-green-600 rounded-full mr-2">
                    SOL Connected
                  </span>
                )}
                {walletInfo.ton.isConnected && (
                  <span className="px-2 py-1 bg-blue-600/10 text-blue-600 rounded-full">
                    TON Connected
                  </span>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={() => disconnectChain(walletInfo.ethereum.isConnected ? BlockchainType.ETHEREUM : walletInfo.solana.isConnected ? BlockchainType.SOLANA : BlockchainType.TON)}>
                Disconnect
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="default" size="sm" onClick={() => connectChain(BlockchainType.ETHEREUM)}>
                Connect Wallet
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
