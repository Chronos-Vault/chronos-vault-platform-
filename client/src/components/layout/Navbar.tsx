import { Link, useLocation } from 'wouter';
import { useMultiChain, BlockchainType } from '@/contexts/multi-chain-context';
import logoPath from '@assets/IMG_3726.jpeg';
import { Button } from '@/components/ui/button';
import { ChevronDown, Menu, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";
import CrossChainWalletSelector from "@/components/auth/cross-chain-wallet-selector";

const Navbar = () => {
  const [location] = useLocation();
  const { isConnected, walletInfo, connectChain, disconnectChain } = useMultiChain();

  const isActive = (path: string) => {
    return location === path ? 'bg-primary/10 text-primary' : 'text-foreground/70 hover:text-primary';
  };
  
  // Mobile navigation with categories for a comprehensive mobile menu
  const mobileCategoryMenu = [
    {
      id: "main",
      title: "Main Navigation",
      icon: "🏠",
      items: [
        { name: "Home", href: "/", icon: "🏠" },
        { name: "Create Vault", href: "/vault-types", icon: "🔒" },
        { name: "My Vaults", href: "/my-vaults", icon: "📊" },
        { name: "Gift Crypto", href: "/gift-crypto", icon: "🎁", highlight: true },
      ]
    },
    {
      id: "features",
      title: "Advanced Features",
      icon: "✨",
      items: [
        { name: "Bitcoin Halving", href: "/bitcoin-halving", icon: "₿" },
        { name: "CVT Token", href: "/cvt-token", icon: "🪙" },
        { name: "CVT Utility", href: "/cvt-utility", icon: "⚡" },
        { name: "Token Vaults", href: "/token-vaults", icon: "⏳" },
        { name: "Multi-Signature Vault", href: "/multi-signature-vault-new", icon: "🔐", highlight: true },
        { name: "Cross-Chain Features", href: "/cross-chain", icon: "🔄" },
        { name: "Atomic Swaps", href: "/cross-chain-atomic-swap", icon: "⚛️", highlight: true },
        { name: "Cross-Chain vs Atomic Swaps", href: "/cross-chain-vs-atomic-swap", icon: "📘" },
        { name: "Security Testing", href: "/security-testing", icon: "🔒" },
        { name: "Security Features", href: "/security", icon: "🛡️", highlight: true },
        { name: "Transaction Monitor", href: "/transaction-monitor", icon: "📊", highlight: true },
        { name: "Advanced Security Demo", href: "/security-verification-demo", icon: "🔍", highlight: true },
        { name: "ZK Privacy Demo", href: "/zk-privacy-demo", icon: "🔐", highlight: true },
        { name: "Vault Explorer", href: "/vault-explorer", icon: "🔎", highlight: true },
      ]
    },
    {
      id: "blockchains",
      title: "Blockchain Integrations",
      icon: "⛓️",
      items: [
        { name: "TON Integration", href: "/ton-integration", icon: "💎" },
        { name: "Solana Integration", href: "/solana-integration", icon: "◎" },
        { name: "Ethereum Integration", href: "/ethereum-integration", icon: "Ξ" },
      ]
    },
    {
      id: "resources",
      title: "Resources & Documentation",
      icon: "📚",
      items: [
        { name: "Documentation", href: "/documentation", icon: "📄" },
        { name: "Technical Specification", href: "/technical-specification", icon: "🧪" },
        { name: "CVT Tokenomics", href: "/cvt-tokenomics", icon: "📊" },
        { name: "Revolutionary Features", href: "/revolutionary-features", icon: "🚀" },
        { name: "About", href: "/about", icon: "ℹ️" },
        { name: "Roadmap", href: "/roadmap", icon: "🗺️" },
      ]
    }
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-full flex items-center justify-center shadow-xl shadow-[#FF5AF7]/40 group-hover:shadow-[#FF5AF7]/50 transition-all overflow-hidden border-2 border-white/40 animate-logo-glow">
              <img src={logoPath} alt="Chronos Vault Logo" className="w-full h-full object-cover" />
            </div>
            <div className="relative">
              <h1 className="text-xl md:text-2xl font-poppins font-bold text-white">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] group-hover:from-[#FF5AF7] group-hover:to-[#6B00D7] transition-all">Chronos</span> 
                <span className="text-white">Vault</span>
              </h1>
              <div className="absolute -top-3 -right-3 bg-[#FF5AF7] text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold tracking-wider shadow-md shadow-[#FF5AF7]/30 animate-pulse">BETA</div>
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
              <DropdownMenuContent className="w-56">
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
                <Link href="/cross-chain-atomic-swap">
                  <DropdownMenuItem className="cursor-pointer">
                    <span className="flex items-center gap-1"><span>⚛️</span> Atomic Swaps</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/cross-chain-vs-atomic-swap">
                  <DropdownMenuItem className="cursor-pointer">
                    <span className="flex items-center gap-1"><span>📘</span> Cross-Chain vs Atomic Swaps</span>
                  </DropdownMenuItem>
                </Link>

              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/security-verification-demo">
              <Button variant="outline" className="hidden lg:flex relative items-center gap-1 mr-1 border-[#6B00D7]/50 hover:border-[#FF5AF7]/80 hover:bg-[#6B00D7]/10 text-[#FF5AF7]">
                <span className="flex items-center gap-1">
                  <span>🔍</span> Security Demo
                </span>
                <span className="absolute -top-2 -right-2 bg-[#FF5AF7] text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold tracking-wider shadow-md shadow-[#FF5AF7]/30 animate-pulse">NEW</span>
              </Button>
            </Link>
            
            <Link href="/transaction-monitor">
              <Button variant="outline" className="hidden lg:flex relative items-center gap-1 mr-1 border-[#FF5AF7]/50 hover:border-[#6B00D7]/80 hover:bg-[#FF5AF7]/10 text-[#6B00D7]">
                <span className="flex items-center gap-1">
                  <span>📊</span> Transaction Monitor
                </span>
                <span className="absolute -top-2 -right-2 bg-[#6B00D7] text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold tracking-wider shadow-md shadow-[#6B00D7]/30">LIVE</span>
              </Button>
            </Link>

            <Link href="/zk-privacy-demo">
              <Button variant="outline" className="hidden lg:flex relative items-center gap-1 mr-1 border-[#6B00D7]/50 hover:border-[#FF5AF7]/80 hover:bg-[#6B00D7]/10 text-[#FF5AF7]">
                <span className="flex items-center gap-1">
                  <span>🔐</span> ZK Privacy
                </span>
                <span className="absolute -top-2 -right-2 bg-[#FF5AF7] text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold tracking-wider shadow-md shadow-[#FF5AF7]/30 animate-pulse">NEW</span>
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1">
                  Security <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <Link href="/security">
                  <DropdownMenuItem className="cursor-pointer">
                    <span className="flex items-center gap-1"><span>🛡️</span> Security Features</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/cross-chain-security">
                  <DropdownMenuItem className="cursor-pointer">
                    Chain Security
                  </DropdownMenuItem>
                </Link>
                <Link href="/security-testing">
                  <DropdownMenuItem className="cursor-pointer">
                    Security Testing
                  </DropdownMenuItem>
                </Link>
                <Link href="/transaction-monitor">
                  <DropdownMenuItem className="cursor-pointer">
                    <span className="flex items-center gap-1"><span>📊</span> Transaction Monitor</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/security-verification-demo">
                  <DropdownMenuItem className="cursor-pointer">
                    <span className="flex items-center gap-1"><span>🔍</span> Advanced Security Demo</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/vault-explorer">
                  <DropdownMenuItem className="cursor-pointer">
                    <span className="flex items-center gap-1"><span>🔎</span> Vault Explorer</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/audit-test">
                  <DropdownMenuItem className="cursor-pointer">
                    <span className="flex items-center gap-1"><span>🔍</span> Smart Contract Audit</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/zk-privacy-demo">
                  <DropdownMenuItem className="cursor-pointer">
                    <span className="flex items-center gap-1"><span>🔐</span> ZK Privacy Demo</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/multi-signature-vault-new">
                  <DropdownMenuItem className="cursor-pointer">
                    <span className="flex items-center gap-1"><span>🔐</span> Multi-Signature Vault</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1">
                  CVT Token <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <Link href="/cvt-token">
                  <DropdownMenuItem className="cursor-pointer">
                    Token Overview
                  </DropdownMenuItem>
                </Link>
                <Link href="/cvt-utility">
                  <DropdownMenuItem className="cursor-pointer">
                    <span className="flex items-center gap-1"><span>⚡</span> CVT Utility</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/cvt-tokenomics">
                  <DropdownMenuItem className="cursor-pointer">
                    Tokenomics
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link href="/about">
              <div className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/about')} cursor-pointer`}>
                About
              </div>
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <CrossChainWalletSelector />
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="md:hidden p-2 rounded-xl bg-[#1A1A1A]/80 backdrop-blur-sm border border-[#333333] hover:border-[#6B00D7] transition-all"
              >
                <Menu className="h-6 w-6 text-white" />
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className="bg-gradient-to-b from-[#242424] to-[#1E1E1E] border-l border-[#6B00D7]/30 shadow-xl"
            >
              <SheetHeader className="sr-only">
                <SheetTitle>Mobile Navigation Menu</SheetTitle>
                <SheetDescription>Navigation links and wallet connection</SheetDescription>
              </SheetHeader>
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center shadow-xl shadow-[#FF5AF7]/40 overflow-hidden border-2 border-white/40 animate-logo-glow">
                      <img src={logoPath} alt="Chronos Vault Logo" className="w-full h-full object-cover" />
                    </div>
                    <div className="relative">
                      <h1 className="text-lg font-poppins font-bold text-white">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">Chronos</span> 
                        <span className="text-white">Vault</span>
                      </h1>
                      <div className="absolute -top-3 -right-3 bg-[#FF5AF7] text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold tracking-wider shadow-md shadow-[#FF5AF7]/30 animate-pulse">BETA</div>
                    </div>
                  </div>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                      <X className="h-5 w-5 text-white" />
                    </Button>
                  </SheetClose>
                </div>
                
                {/* Innovative scrollable navigation with categories */}
                <div className="flex-1 overflow-y-auto py-4 pr-2 -mr-2 mobile-menu-scrollbar">
                  <div className="flex flex-col gap-8">
                    {mobileCategoryMenu.map((category) => (
                      <div key={category.id} className="space-y-4">
                        <div className="flex items-center gap-2 px-2 border-b border-[#6B00D7]/20 pb-2">
                          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-[#6B00D7]/50 to-[#FF5AF7]/30 shadow-inner shadow-[#6B00D7]/20">
                            <span className="text-lg">{category.icon}</span>
                          </div>
                          <h3 className="text-[#FF5AF7] font-medium tracking-wide">{category.title}</h3>
                        </div>
                        
                        <div className="flex flex-col gap-4 pl-2">
                          {category.items.map((link) => (
                            <SheetClose key={link.name} asChild>
                              <Link 
                                href={link.href}
                                className={`flex items-center gap-3 ${location === link.href 
                                  ? 'font-poppins font-semibold text-white bg-gradient-to-r from-[#6B00D7]/20 to-transparent pl-4 py-2 border-l-2 border-[#6B00D7]' 
                                  : 'text-gray-300 hover:text-white font-poppins font-medium transition-all hover:translate-x-1'
                                } ${link.highlight ? 'relative rounded-lg bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 border border-[#FF5AF7]/30 text-[#FF5AF7]' : ''}`}
                              >
                                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-[#6B00D7]/30 to-[#FF5AF7]/20 shadow-inner shadow-[#6B00D7]/10 border border-[#6B00D7]/20">
                                  <span className="text-xl text-[#FF5AF7]">{link.icon}</span>
                                </div>
                                <span className="text-base">{link.name}</span>
                              </Link>
                            </SheetClose>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 mt-4 border-t border-[#6B00D7]/30 space-y-3">
                  <CrossChainWalletSelector className="w-full" />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
