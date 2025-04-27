import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const [location] = useLocation();
  const { toast } = useToast();
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const handleConnectWallet = () => {
    // This would be replaced with actual wallet connection logic
    setIsWalletConnected(true);
    toast({
      title: "Wallet Connected",
      description: "Your wallet has been successfully connected.",
      duration: 3000,
    });
  };

  const navigationLinks = [
    { name: "Features", href: "/#features" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "Vaults", href: "/#vaults" },
    { name: "My Vaults", href: "/my-vaults" },
    { name: "About", href: "/about" },
  ];

  return (
    <header className="relative z-20 border-b border-[#333333]/40 backdrop-blur-sm bg-black/50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center shadow-lg shadow-[#6B00D7]/20 group-hover:shadow-[#FF5AF7]/30 transition-all">
              <span className="text-white font-bold font-poppins text-xl">CV</span>
            </div>
            <h1 className="text-3xl font-poppins font-bold text-white">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] group-hover:from-[#FF5AF7] group-hover:to-[#6B00D7] transition-all">Chronos</span> 
              <span className="text-white">Vault</span>
            </h1>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            {navigationLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={`text-gray-300 hover:text-white font-poppins font-medium text-lg transition-all hover:scale-105 ${location === link.href ? 'text-white relative after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r after:from-[#6B00D7] after:to-[#FF5AF7] after:rounded-full' : ''}`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              onClick={handleConnectWallet}
              disabled={isWalletConnected}
              className="hidden md:flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1A1A1A]/80 backdrop-blur-sm border border-[#333333] hover:border-[#6B00D7] hover:shadow-lg hover:shadow-[#6B00D7]/20 transition-all font-poppins"
              variant="outline"
            >
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] animate-pulse"></div>
              {isWalletConnected ? "Connected" : "Connect Wallet"}
            </Button>

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
                className="bg-gradient-to-b from-[#121212] to-[#0A0A0A] border-l border-[#333333] shadow-xl"
              >
                <SheetHeader className="sr-only">
                  <SheetTitle>Mobile Navigation Menu</SheetTitle>
                  <SheetDescription>Navigation links and wallet connection</SheetDescription>
                </SheetHeader>
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center shadow-lg shadow-[#6B00D7]/20">
                        <span className="text-white font-bold font-poppins text-lg">CV</span>
                      </div>
                      <h1 className="text-xl font-poppins font-bold text-white">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">Chronos</span> 
                        <span className="text-white">Vault</span>
                      </h1>
                    </div>
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                        <X className="h-5 w-5 text-white" />
                      </Button>
                    </SheetClose>
                  </div>
                  
                  <div className="flex flex-col gap-7 py-6">
                    {navigationLinks.map((link) => (
                      <SheetClose key={link.name} asChild>
                        <Link 
                          href={link.href}
                          className={`text-xl ${location === link.href 
                            ? 'font-poppins font-semibold text-white bg-gradient-to-r from-[#6B00D7]/20 to-transparent pl-4 py-2 border-l-2 border-[#6B00D7]' 
                            : 'text-gray-300 hover:text-white font-poppins font-medium transition-all hover:translate-x-1'
                          }`}
                        >
                          {link.name}
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                  
                  <div className="mt-auto pt-8 border-t border-[#333333]">
                    <SheetClose asChild>
                      <Button 
                        onClick={handleConnectWallet}
                        disabled={isWalletConnected}
                        className="w-full py-5 rounded-xl bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white font-poppins font-medium text-lg hover:shadow-lg hover:shadow-[#6B00D7]/30 transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-white/90 animate-pulse"></div>
                          {isWalletConnected ? "Connected" : "Connect Wallet"}
                        </div>
                      </Button>
                    </SheetClose>
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
