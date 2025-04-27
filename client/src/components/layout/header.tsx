import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
import { ConnectWalletButton } from "@/components/auth/connect-wallet-button";
import { useAuthContext } from "@/contexts/auth-context";

const Header = () => {
  const [location] = useLocation();
  const { isAuthenticated } = useAuthContext();

  const navigationLinks = [
    { name: "Features", href: "/#features", icon: "✨" },
    { name: "Bitcoin Halving", href: "/bitcoin-halving", icon: "₿" },
    { name: "How It Works", href: "/#how-it-works", icon: "⚙️" },
    { name: "Vaults", href: "/#vaults", icon: "🔐" },
    { name: "My Vaults", href: "/my-vaults", icon: "📊" },
    { name: "CVT Token", href: "/cvt-token", icon: "🪙" },
    { name: "Token Vaults", href: "/token-vaults", icon: "⏳" },
    { name: "Cross-Chain", href: "/cross-chain", icon: "🔄" },
    { name: "TON Integration", href: "/ton-integration", icon: "💎" },
    { name: "Solana Integration", href: "/solana-integration", icon: "◎" },
    { name: "Roadmap", href: "/roadmap", icon: "🗺️" },
    { name: "About", href: "/about", icon: "ℹ️" },
  ];

  return (
    <header className="relative z-20 border-b border-[#6B00D7]/20 backdrop-blur-sm bg-gradient-to-r from-[#121212]/90 to-[#1A1A1A]/90">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center shadow-xl shadow-[#FF5AF7]/40 group-hover:shadow-[#FF5AF7]/50 transition-all p-2.5 border-2 border-white/40 animate-logo-glow">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                <path d="M19 7H5C3.89543 7 3 7.89543 3 9V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V9C21 7.89543 20.1046 7 19 7Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 7V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 14V17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="relative">
              <h1 className="text-xl md:text-2xl font-poppins font-bold text-white">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] group-hover:from-[#FF5AF7] group-hover:to-[#6B00D7] transition-all">Chronos</span> 
                <span className="text-white">Vault</span>
              </h1>
              <div className="absolute -top-3 -right-3 bg-[#FF5AF7] text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold tracking-wider shadow-md shadow-[#FF5AF7]/30 animate-pulse">BETA</div>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            {navigationLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={`flex items-center gap-1.5 text-gray-300 hover:text-white font-poppins font-medium text-lg transition-all hover:scale-105 ${
                  location === link.href 
                  ? 'text-white relative after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r after:from-[#6B00D7] after:to-[#FF5AF7] after:rounded-full' 
                  : ''
                }`}
              >
                <span className="text-base">{link.icon}</span>
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <ConnectWalletButton />
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
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center shadow-xl shadow-[#FF5AF7]/40 p-2 border-2 border-white/40 animate-logo-glow">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                          <path d="M19 7H5C3.89543 7 3 7.89543 3 9V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V9C21 7.89543 20.1046 7 19 7Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M3 7V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 14V17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
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
                  
                  {/* Scrollable navigation container */}
                  <div className="flex-1 overflow-y-auto py-4 pr-2 -mr-2 mobile-menu-scrollbar">
                    <div className="flex flex-col gap-5">
                      {navigationLinks.map((link) => (
                        <SheetClose key={link.name} asChild>
                          <Link 
                            href={link.href}
                            className={`flex items-center gap-3 ${location === link.href 
                              ? 'font-poppins font-semibold text-white bg-gradient-to-r from-[#6B00D7]/20 to-transparent pl-4 py-2 border-l-2 border-[#6B00D7]' 
                              : 'text-gray-300 hover:text-white font-poppins font-medium transition-all hover:translate-x-1'
                            }`}
                          >
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-[#6B00D7]/30 to-[#FF5AF7]/20 shadow-inner shadow-[#6B00D7]/10 border border-[#6B00D7]/20">
                              <span className="text-xl text-[#FF5AF7]">{link.icon}</span>
                            </div>
                            <span className="text-lg">{link.name}</span>
                          </Link>
                        </SheetClose>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4 mt-4 border-t border-[#6B00D7]/30">
                    <div className="w-full py-3 rounded-xl bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white font-poppins font-medium text-lg transition-all">
                      <ConnectWalletButton />
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

export default Header;
