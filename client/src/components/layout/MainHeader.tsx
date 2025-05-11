import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import logoPath from "@assets/IMG_3753.jpeg";
import { useMultiChain, BlockchainType } from "@/contexts/multi-chain-context";
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
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Menu, X, Settings, Bug } from "lucide-react";
import CrossChainWalletSelector from "@/components/auth/cross-chain-wallet-selector";
import { BitcoinWalletConnector } from "@/components/bitcoin/bitcoin-wallet-connector";
import { useAuthContext } from "@/contexts/auth-context";
import { useDevMode } from "@/contexts/dev-mode-context";
import React from "react";

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { 
    isNew?: boolean; 
    highlight?: boolean;
  }
>(({ className, title, children, isNew, highlight, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors",
            highlight 
              ? "bg-gradient-to-r from-[#6B00D7]/10 to-[#FF5AF7]/10 border border-[#FF5AF7]/30 text-[#FF5AF7] hover:bg-[#333]" 
              : "hover:bg-[#333] text-gray-300 hover:text-white",
            className
          )}
          {...props}
        >
          <div className="relative text-sm font-medium leading-none">
            {title}
            {isNew && (
              <span className="absolute -top-3 -right-3 bg-[#FF5AF7] text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold tracking-wider shadow-md shadow-[#FF5AF7]/30 animate-pulse">
                NEW
              </span>
            )}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

interface MobileNavLink {
  name: string;
  href: string;
  icon: string;
  highlight?: boolean;
  isNew?: boolean;
  isAction?: boolean;
  action?: () => void;
}

interface MobileNavCategory {
  id: string;
  title: string;
  icon: string;
  items: MobileNavLink[];
}

const MainHeader = () => {
  const [location] = useLocation();
  const { isAuthenticated } = useAuthContext();

  // Combined contexts for functionality
  const multiChain = useMultiChain();
  const { 
    devModeEnabled, 
    toggleDevMode, 
    isDevelopmentEnvironment,
    bypassWalletRequirements, 
    setBypassWalletRequirements 
  } = useDevMode();
  
  // Mobile navigation with categories
  const mobileCategoryMenu: MobileNavCategory[] = [
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
      id: "developer",
      title: "Developer",
      icon: "🧪",
      items: [
        { name: "API Documentation", href: "/documentation", icon: "📚", highlight: true },
        { name: "SDK Access", href: "/documentation#sdk", icon: "💻", highlight: true },
        { name: "Smart Contract Audit", href: "/audit-test", icon: "🔍", highlight: true },
        { name: "Contract Templates", href: "/documentation#templates", icon: "📄", highlight: true },
        { name: `Dev Mode ${devModeEnabled ? 'On' : 'Off'}`, href: "#", icon: "🛠️", isAction: true, action: () => toggleDevMode() },
        { name: `Bypass Wallet ${devModeEnabled && bypassWalletRequirements ? 'On' : 'Off'}`, href: "#", icon: "⚡", isAction: true, action: () => setBypassWalletRequirements(!bypassWalletRequirements) },
      ]
    },
    {
      id: "explore",
      title: "Explore",
      icon: "🔍",
      items: [
        { name: "Cross-Chain Monitor", href: "/cross-chain-monitor", icon: "📊", highlight: true, isNew: true },
        { name: "Transaction Monitor", href: "/transaction-monitor", icon: "📈" },
        { name: "Transaction Verification", href: "/transaction-verification", icon: "📝" },
        { name: "Cross-Chain Bridge", href: "/cross-chain-bridge", icon: "🔄" },
        { name: "Atomic Swaps", href: "/cross-chain-atomic-swap", icon: "⚛️" },
        { name: "Security Dashboard", href: "/cross-chain-security", icon: "🛡️" },
        { name: "Vault Explorer", href: "/my-vaults", icon: "📚" },
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
        { name: "Tokenomics", href: "/tokenomics", icon: "📊" },
        { name: "Whitepaper", href: "/whitepaper", icon: "📑" },
        { name: "Smart Contracts", href: "/smart-contracts", icon: "📜" },
        { name: "Roadmap", href: "/roadmap", icon: "🗺️" },
        { name: "Team", href: "/team", icon: "👥" },
        { name: "Docs", href: "/documentation", icon: "📄" },
        { name: "FAQ", href: "/faq", icon: "❓" },
        { name: "About", href: "/about", icon: "ℹ️" }
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
          
          {/* Desktop Navigation Menu */}
          <div className="hidden md:flex items-center gap-4">
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink 
                    asChild
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent text-gray-300 hover:text-white hover:bg-[#6B00D7]/10",
                      location === "/vault-types" ? "text-white bg-[#6B00D7]/20" : ""
                    )}
                  >
                    <Link href="/vault-types">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="text-base">🔐</span> Vaults
                      </span>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-gray-300 hover:text-white hover:bg-[#6B00D7]/10">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="text-base">🔍</span> Explore
                    </span>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-2 p-4 bg-[#1A1A1A] border border-[#333] shadow-xl">
                      <ListItem
                        href="/cross-chain-monitor"
                        title="📊 Cross-Chain Monitor"
                        highlight={true}
                        isNew={true}
                      >
                        Comprehensive monitoring dashboard for all blockchain networks
                      </ListItem>
                      <ListItem 
                        href="/transaction-verification" 
                        title="📝 Transaction Verification"
                      >
                        Verify individual transactions across multiple blockchains
                      </ListItem>
                      <ListItem 
                        href="/cross-chain-bridge" 
                        title="🔄 Cross-Chain Bridge"
                      >
                        Transfer assets between different blockchain networks
                      </ListItem>
                      <ListItem 
                        href="/cross-chain-atomic-swap" 
                        title="⚛️ Atomic Swaps"
                      >
                        Peer-to-peer trading between blockchain networks
                      </ListItem>
                      <ListItem 
                        href="/cross-chain-security" 
                        title="🛡️ Security Dashboard"
                      >
                        Security monitoring for cross-chain operations
                      </ListItem>
                      <ListItem 
                        href="/my-vaults" 
                        title="📚 Vault Explorer"
                      >
                        Browse and manage your existing vaults
                      </ListItem>
                      <ListItem 
                        href="/transaction-monitor" 
                        title="📈 Transaction Monitor"
                      >
                        Monitor transaction status and activity
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink 
                    asChild
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent text-gray-300 hover:text-white hover:bg-[#6B00D7]/10",
                      location === "/security-verification-demo" ? "text-white bg-[#6B00D7]/20" : ""
                    )}
                  >
                    <Link href="/security-verification-demo">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="text-base">🔒</span> Security
                      </span>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-gray-300 hover:text-white hover:bg-[#6B00D7]/10">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="text-base">📚</span> Resources
                    </span>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-2 p-4 md:grid-cols-2 bg-[#1A1A1A] border border-[#333] shadow-xl">
                      <ListItem 
                        href="/cvt-token" 
                        title="🪙 CVT Token"
                      >
                        Platform native utility token
                      </ListItem>
                      <ListItem 
                        href="/tokenomics" 
                        title="📊 Tokenomics"
                      >
                        Token distribution and economics
                      </ListItem>
                      <ListItem 
                        href="/whitepaper" 
                        title="📑 Whitepaper"
                      >
                        Technical project documentation
                      </ListItem>
                      <ListItem 
                        href="/smart-contracts" 
                        title="📜 Smart Contracts"
                      >
                        Contract addresses and audits
                      </ListItem>
                      <ListItem 
                        href="/roadmap" 
                        title="🗺️ Roadmap"
                      >
                        Project development timeline
                      </ListItem>
                      <ListItem 
                        href="/team" 
                        title="👥 Team"
                      >
                        Core team and advisors
                      </ListItem>
                      <ListItem 
                        href="/documentation" 
                        title="📄 Docs"
                      >
                        Developer and user resources
                      </ListItem>
                      <ListItem 
                        href="/faq" 
                        title="❓ FAQ"
                      >
                        Frequently asked questions
                      </ListItem>
                      <ListItem 
                        href="/about" 
                        title="ℹ️ About"
                      >
                        About Chronos Vault
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
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
              <BitcoinWalletConnector />
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
                          
                          {/* For Resources category with many links, use a grid layout */}
                          {category.id === "resources" ? (
                            <div className="grid grid-cols-2 gap-2 pl-1">
                              {category.items.map((link) => (
                                <SheetClose key={link.name} asChild>
                                  {link.isAction ? (
                                    <button
                                      onClick={link.action}
                                      className={`flex flex-col items-center justify-center gap-1 px-2 py-3 rounded-lg text-center w-full
                                        text-gray-300 hover:text-white hover:bg-[#6B00D7]/10 font-poppins font-medium transition-all
                                        ${link.highlight ? 'relative bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 border border-[#FF5AF7]/30 text-[#FF5AF7] shadow-sm' : ''}`}
                                    >
                                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-[#6B00D7]/30 to-[#FF5AF7]/20 shadow-inner shadow-[#6B00D7]/10 border border-[#6B00D7]/20">
                                        <span className="text-xl text-[#FF5AF7]">{link.icon}</span>
                                      </div>
                                      <div className="relative">
                                        <span className="text-sm">{link.name}</span>
                                        {link.isNew ? (
                                          <div className="absolute -top-3 -right-6 bg-[#FF5AF7] text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold tracking-wider shadow-md shadow-[#FF5AF7]/30 animate-pulse">NEW</div>
                                        ) : null}
                                      </div>
                                    </button>
                                  ) : (
                                    <Link 
                                      href={link.href}
                                      className={`flex flex-col items-center justify-center gap-1 px-2 py-3 rounded-lg text-center ${location === link.href 
                                        ? 'bg-[#6B00D7]/20 text-white font-poppins font-semibold' 
                                        : 'text-gray-300 hover:text-white hover:bg-[#6B00D7]/10 font-poppins font-medium transition-all'
                                      } ${link.highlight ? 'relative bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 border border-[#FF5AF7]/30 text-[#FF5AF7] shadow-sm' : ''}`}
                                    >
                                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-[#6B00D7]/30 to-[#FF5AF7]/20 shadow-inner shadow-[#6B00D7]/10 border border-[#6B00D7]/20">
                                        <span className="text-xl text-[#FF5AF7]">{link.icon}</span>
                                      </div>
                                      <div className="relative">
                                        <span className="text-sm">{link.name}</span>
                                        {link.isNew ? (
                                          <div className="absolute -top-3 -right-6 bg-[#FF5AF7] text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold tracking-wider shadow-md shadow-[#FF5AF7]/30 animate-pulse">NEW</div>
                                        ) : null}
                                      </div>
                                    </Link>
                                  )}
                                </SheetClose>
                              ))}
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 gap-2 pl-1">
                              {category.items.map((link) => (
                                <SheetClose key={link.name} asChild>
                                  {link.isAction ? (
                                    <button
                                      onClick={link.action}
                                      className={`flex items-center gap-3 px-3 py-3 rounded-lg w-full text-left
                                        text-gray-300 hover:text-white hover:bg-[#6B00D7]/10 font-poppins font-medium transition-all
                                        ${link.highlight ? 'relative bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 border border-[#FF5AF7]/30 text-[#FF5AF7] shadow-sm' : ''}
                                      `}
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
                                    </button>
                                  ) : (
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
                                  )}
                                </SheetClose>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4 mt-4 border-t border-[#6B00D7]/30">
                    {/* More compact wallet and dev mode controls */}
                    <div className="grid grid-cols-2 gap-3 px-1">
                      {/* Wallet Connection - Left column */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Settings className="h-4 w-4 text-[#FF5AF7]" />
                          <span className="text-[#FF5AF7] font-medium text-sm">Connect Wallets</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <CrossChainWalletSelector className="mobile-version" />
                          <BitcoinWalletConnector className="mobile-version" />
                        </div>
                      </div>

                      {/* Development Mode - Right column */}
                      {isDevelopmentEnvironment && (
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Bug className={`h-4 w-4 ${devModeEnabled ? 'text-amber-500' : 'text-gray-400'}`} />
                            <span className={`font-medium text-sm ${devModeEnabled ? 'text-amber-500' : 'text-gray-400'}`}>
                              Dev Mode
                            </span>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={toggleDevMode}
                            className={`px-2 text-xs h-8 justify-center ${
                              devModeEnabled 
                                ? 'bg-amber-500/10 text-amber-500 border-amber-500/50 hover:bg-amber-500/20' 
                                : 'bg-gray-800/50 text-gray-400 border-gray-700 hover:bg-gray-800'
                            }`}
                          >
                            {devModeEnabled ? 'Disable' : 'Enable'}
                          </Button>
                          <p className="text-xs text-gray-500 leading-tight">
                            Bypass wallet requirements
                          </p>
                        </div>
                      )}
                    </div>
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

export default MainHeader;