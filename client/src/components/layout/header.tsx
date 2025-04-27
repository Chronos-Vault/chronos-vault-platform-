import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
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
    <header className="relative z-20">
      <div className="container mx-auto px-4 py-5">
        <nav className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center">
              <span className="text-white font-bold font-poppins text-lg">CV</span>
            </div>
            <h1 className="text-2xl font-poppins font-semibold text-white">
              <span className="text-[#6B00D7]">Chronos</span> 
              <span className="text-white">Vault</span>
            </h1>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            {navigationLinks.map((link) => (
              <Link key={link.name} href={link.href}>
                <a className={`text-gray-300 hover:text-white transition-colors ${location === link.href ? 'text-white' : ''}`}>
                  {link.name}
                </a>
              </Link>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              onClick={handleConnectWallet}
              disabled={isWalletConnected}
              className="hidden md:block px-5 py-2.5 rounded-lg bg-[#1A1A1A] border border-[#333333] hover:border-[#6B00D7] transition-all"
              variant="outline"
            >
              {isWalletConnected ? "Connected" : "Connect Wallet"}
            </Button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#1A1A1A] border-[#333333]">
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center">
                        <span className="text-white font-bold font-poppins text-sm">CV</span>
                      </div>
                      <h1 className="text-xl font-poppins font-semibold text-white">
                        <span className="text-[#6B00D7]">Chronos</span> 
                        <span className="text-white">Vault</span>
                      </h1>
                    </div>
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon">
                        <X className="h-5 w-5" />
                      </Button>
                    </SheetClose>
                  </div>
                  
                  <div className="flex flex-col gap-6 py-4">
                    {navigationLinks.map((link) => (
                      <SheetClose key={link.name} asChild>
                        <Link href={link.href}>
                          <a className={`text-gray-300 hover:text-white transition-colors ${location === link.href ? 'text-white font-medium' : ''}`}>
                            {link.name}
                          </a>
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                  
                  <div className="mt-auto pt-6 border-t border-[#333333]">
                    <SheetClose asChild>
                      <Button 
                        onClick={handleConnectWallet}
                        disabled={isWalletConnected}
                        className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white hover:opacity-90"
                      >
                        {isWalletConnected ? "Connected" : "Connect Wallet"}
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
