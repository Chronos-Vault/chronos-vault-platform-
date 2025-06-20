import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import logoPath from "@assets/IMG_3753.jpeg";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Menu, X, Settings, Bug } from "lucide-react";
import CrossChainWalletSelector from "@/components/auth/cross-chain-wallet-selector";
// import { BitcoinWalletConnector } from "@/components/bitcoin/bitcoin-wallet-connector";
import { useAuthContext } from "@/contexts/auth-context";
import { useDevMode } from "@/contexts/dev-mode-context";

const Header = () => {
  const [location] = useLocation();
  const { isAuthenticated } = useAuthContext();
  const { devModeEnabled, toggleDevMode, isDevelopmentEnvironment } = useDevMode();

  // Desktop navigation links (streamlined for better UX)
  const desktopNavigationLinks = [
    { name: "Wallets", href: "/wallet", icon: "💳" },
    { name: "Vaults", href: "/vault-types", icon: "🔐" },
    { name: "Explore", href: "#", icon: "🔍", children: [
      { name: "📊 Cross-Chain Monitor", href: "/cross-chain-monitor", highlight: true },
      { name: "📈 Cross-Chain Metrics", href: "/cross-chain-metrics", highlight: true, isNew: true },
      { name: "📈 Transaction Monitor", href: "/transaction-monitor" },
      { name: "📝 Transaction Verification", href: "/transaction-verification" }, 
      { name: "🔄 Cross-Chain Bridge", href: "/cross-chain-bridge" },
      { name: "⚛️ Atomic Swaps", href: "/cross-chain-atomic-swap" },
      { name: "🛡️ Security Dashboard", href: "/cross-chain-security" },
      { name: "📚 Vault Explorer", href: "/my-vaults" }
    ]},
    { name: "Vault School", href: "#", icon: "🎓", children: [
      { name: "📘 Smart Contract Vault", href: "/smart-contract-vault", highlight: true },
      { name: "🔒 Multi-Signature Vault", href: "/multi-signature-vault-new" },
      { name: "📱 Biometric Vault", href: "/biometric-vault" }, 
      { name: "🧩 Cross-Chain Vault", href: "/cross-chain-vault" },
      { name: "🌎 Geo-Location Vault", href: "/geo-vault" },
      { name: "⏰ Time-Lock Memory Vault", href: "/specialized-vault?type=memory-vault" },
      { name: "💎 Investment Discipline Vault", href: "/investment-discipline-vault" }
    ]},
    { name: "Security", href: "/security-verification-demo", icon: "🔒" },
    { name: "CVT Token", href: "/cvt-token", icon: "🪙" },
    { name: "Docs", href: "/documentation", icon: "📄" },
  ];
  
  // Mobile navigation with streamlined categories for better UX
  const mobileCategoryMenu = [
    {
      id: "main",
      title: "Main",
      icon: "🏠",
      items: [
        { name: "Home", href: "/", icon: "🏠" },
        { name: "Vaults", href: "/vault-types", icon: "🔐" },
      ]
    },
    {
      id: "explore",
      title: "Explore",
      icon: "🔍",
      items: [
        { name: "Cross-Chain Monitor", href: "/cross-chain-monitor", icon: "📊", highlight: true },
        { name: "Cross-Chain Metrics", href: "/cross-chain-metrics", icon: "📈", highlight: true, isNew: true },
        { name: "Transaction Monitor", href: "/transaction-monitor", icon: "📈" },
        { name: "Transaction Verification", href: "/transaction-verification", icon: "📝" },
        { name: "Cross-Chain Bridge", href: "/cross-chain-bridge", icon: "🔄" },
        { name: "Atomic Swaps", href: "/cross-chain-atomic-swap", icon: "⚛️" },
        { name: "Security Dashboard", href: "/cross-chain-security", icon: "🛡️" },
        { name: "Vault Explorer", href: "/my-vaults", icon: "📚" },
      ]
    },
    {
      id: "vault-school",
      title: "Vault School",
      icon: "🎓",
      items: [
        { name: "Smart Contract Vault", href: "/smart-contract-vault", icon: "📘", highlight: true },
        { name: "Multi-Signature Vault", href: "/multi-signature-vault-new", icon: "🔒" },
        { name: "Biometric Vault", href: "/biometric-vault", icon: "📱" },
        { name: "Cross-Chain Vault", href: "/cross-chain-vault", icon: "🧩" },
        { name: "Geo-Location Vault", href: "/geo-vault", icon: "🌎" },
        { name: "Time-Lock Memory Vault", href: "/specialized-vault?type=memory-vault", icon: "⏰" },
        { name: "Investment Vault", href: "/investment-discipline-vault", icon: "💎" },
      ]
    },
    {
      id: "features",
      title: "Features",
      icon: "✨",
      items: [
        { name: "Security", href: "/security-verification-demo", icon: "🔒", highlight: true },
        { name: "Multi-Signature", href: "/multi-signature-vault", icon: "👥" },
        { name: "Bitcoin Halving", href: "/bitcoin-halving", icon: "₿" },
      ]
    },
    {
      id: "resources",
      title: "Resources",
      icon: "📚",
      items: [
        { name: "CVT Token", href: "/cvt-token", icon: "🪙" },
        { name: "Docs", href: "/documentation", icon: "📄" },
        { name: "About", href: "/about", icon: "ℹ️" },
      ]
    }
  ];

  return (
    <header className="relative z-20 border-b border-[#6B00D7]/20 backdrop-blur-sm bg-gradient-to-r from-[#121212]/90 to-[#1A1A1A]/90">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-12 w-12 rounded-full flex items-center justify-center shadow-xl shadow-[#FF5AF7]/40 group-hover:shadow-[#FF5AF7]/50 transition-all overflow-hidden border-2 border-white/40 animate-logo-glow">
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
          
          <div className="hidden md:flex items-center gap-1 lg:gap-4">
            {desktopNavigationLinks.map((link) => (
              link.children ? (
                <DropdownMenu key={link.name}>
                  <DropdownMenuTrigger className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-300 hover:text-white font-poppins font-medium text-sm lg:text-base transition-all hover:bg-[#6B00D7]/10">
                    <span className="text-base">{link.icon}</span>
                    <div className="relative">
                      <span className="truncate">{link.name}</span>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-56 bg-[#1A1A1A] border border-[#333] shadow-xl">
                    {link.children.map((childLink) => (
                      <Link key={childLink.name} href={childLink.href}>
                        <DropdownMenuItem 
                          className={`flex items-center py-2 gap-2 cursor-pointer hover:bg-[#333] ${
                            childLink.highlight ? 'relative bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 border border-[#FF5AF7]/30 text-[#FF5AF7] shadow-sm' : ''
                          }`}
                        >
                          <span className="truncate">{childLink.name}</span>
                          {childLink.isNew && (
                            <div className="bg-[#FF5AF7] text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold tracking-wider shadow-md shadow-[#FF5AF7]/30 animate-pulse">NEW</div>
                          )}
                        </DropdownMenuItem>
                      </Link>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-300 hover:text-white font-poppins font-medium text-sm lg:text-base transition-all hover:bg-[#6B00D7]/10 ${
                    location === link.href 
                    ? 'text-white bg-[#6B00D7]/20 relative after:absolute after:bottom-[6px] after:left-[10px] after:right-[10px] after:h-[2px] after:bg-gradient-to-r after:from-[#6B00D7] after:to-[#FF5AF7] after:rounded-full' 
                    : ''
                  }`}
                >
                  <span className="text-base">{link.icon}</span>
                  <div className="relative">
                    <span className="truncate">{link.name}</span>
                  </div>
                </Link>
              )
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              {isDevelopmentEnvironment && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className={`rounded-full p-2 ${devModeEnabled 
                        ? 'bg-amber-500/10 text-amber-500 border-amber-500/50 hover:bg-amber-500/20' 
                        : 'bg-gray-800/50 text-gray-400 border-gray-700 hover:bg-gray-800'}`}
                    >
                      <Bug className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-[#1A1A1A] border border-[#333] shadow-xl">
                    <DropdownMenuItem 
                      className="flex items-center gap-2 cursor-pointer hover:bg-[#333]"
                      onClick={toggleDevMode}
                    >
                      <Bug className={`h-4 w-4 ${devModeEnabled ? 'text-amber-500' : 'text-gray-400'}`} />
                      <span>Development Mode: {devModeEnabled ? 'ON' : 'OFF'}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-[#333]" />
                    <DropdownMenuItem className="hover:bg-[#333]">
                      <span className="text-xs text-gray-500">
                        Dev mode bypasses wallet requirements
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
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
                      <Link href="/" className="block">
                        <div className="h-12 w-12 rounded-full flex items-center justify-center shadow-xl shadow-[#FF5AF7]/40 overflow-hidden border-2 border-white/40 animate-logo-glow">
                          <img src={logoPath} alt="Chronos Vault Logo" className="w-full h-full object-cover" />
                        </div>
                      </Link>
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
                  
                  {/* Mobile navigation with improved UX and accessibility */}
                  <div className="flex-1 overflow-y-auto py-4 pr-2 -mr-2 mobile-menu-scrollbar">
                    <div className="flex flex-col gap-6">
                      {mobileCategoryMenu.map((category) => (
                        <div key={category.id} className="space-y-3">
                          <div className="flex items-center gap-2 pl-2 pr-3 border-b border-[#6B00D7]/30 pb-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#6B00D7]/50 to-[#FF5AF7]/30 shadow-inner shadow-[#6B00D7]/20">
                              <span className="text-lg">{category.icon}</span>
                            </div>
                            <h3 className="text-[#FF5AF7] font-medium tracking-wide">{category.title}</h3>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-2 pl-1">
                            {category.items.map((link) => (
                              <SheetClose key={link.name} asChild>
                                <Link 
                                  href={link.href}
                                  className={`flex items-center gap-3 px-3 py-3 rounded-lg ${location === link.href 
                                    ? 'bg-[#6B00D7]/20 text-white font-poppins font-semibold border-l-2 border-[#FF5AF7]' 
                                    : 'text-gray-300 hover:text-white hover:bg-[#6B00D7]/10 font-poppins font-medium transition-all'
                                  } ${link.highlight ? 'relative bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 border border-[#FF5AF7]/30 text-[#FF5AF7] shadow-sm' : ''}`}
                                >
                                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-[#6B00D7]/30 to-[#FF5AF7]/20 shadow-inner shadow-[#6B00D7]/10 border border-[#6B00D7]/20">
                                    <span className="text-xl text-[#FF5AF7]">{link.icon}</span>
                                  </div>
                                  <div className="relative">
                                    <span className="text-base">{link.name}</span>
                                    {link.isNew ? (
                                      <div className="absolute -top-3 -right-6 bg-[#FF5AF7] text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold tracking-wider shadow-md shadow-[#FF5AF7]/30 animate-pulse">NEW</div>
                                    ) : null}
                                  </div>
                                </Link>
                              </SheetClose>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4 mt-4 border-t border-[#6B00D7]/30 space-y-4">
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-[#FF5AF7] mb-3 flex items-center">
                        <div className="h-10 w-10 mr-2 rounded-full flex items-center justify-center shadow-xl shadow-[#FF5AF7]/40 overflow-hidden border-2 border-white/40 animate-logo-glow">
                          <img src={logoPath} alt="Chronos Vault Logo" className="w-full h-full object-cover" />
                        </div>
                        Connect Wallet
                      </h3>
                      <CrossChainWalletSelector className="w-full" />
                      {/* <div className="mt-3">
                        <BitcoinWalletConnector />
                      </div> */}
                    </div>
                    
                    {isDevelopmentEnvironment && (
                      <div className="mt-2 pt-3 border-t border-[#6B00D7]/30">
                        <h3 className="text-sm font-medium text-[#FF5AF7] mb-2">Developer Options</h3>
                        <div 
                          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${
                            devModeEnabled 
                              ? 'bg-amber-500/10 border border-amber-500/40' 
                              : 'bg-gray-800/50 border border-gray-700'
                          }`}
                          onClick={toggleDevMode}
                        >
                          <div className="flex items-center gap-3">
                            <Bug className={`h-5 w-5 ${devModeEnabled ? 'text-amber-500' : 'text-gray-400'}`} />
                            <div>
                              <div className="text-sm font-medium">Development Mode</div>
                              <div className="text-xs text-gray-400">Bypass wallet requirements</div>
                            </div>
                          </div>
                          <div className={`h-4 w-7 rounded-full relative flex items-center p-0.5 ${
                            devModeEnabled ? 'bg-amber-500' : 'bg-gray-700'
                          }`}>
                            <div className={`h-3 w-3 rounded-full bg-white absolute transition-all ${
                              devModeEnabled ? 'translate-x-3' : 'translate-x-0'
                            }`}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;