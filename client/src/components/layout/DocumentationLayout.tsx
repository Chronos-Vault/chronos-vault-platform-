import React from 'react';
import { Link } from 'wouter';
import Footer from './footer';
import logoPath from "@assets/IMG_3753.jpeg";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

interface DocumentationLayoutProps {
  children: React.ReactNode;
}

/**
 * A simplified layout component for documentation pages
 * that doesn't require onboarding context and avoids header duplication
 */
const DocumentationLayout: React.FC<DocumentationLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Simple Documentation-specific header */}
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
            
            {/* Mobile menu - simplified for docs */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <button className="rounded-full p-2 bg-[#333] hover:bg-[#444] transition-colors">
                    <Menu className="h-6 w-6 text-gray-300" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-[#121212] border-l border-[#333] p-0 w-[85vw] sm:w-[400px]">
                  <div className="flex flex-col h-full">
                    <div className="px-6 py-6 border-b border-[#333]">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-white/40">
                          <img src={logoPath} alt="Chronos Vault Logo" className="w-full h-full object-cover" />
                        </div>
                        <div className="relative">
                          <h2 className="text-xl font-bold text-white">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">Chronos</span> 
                            <span className="text-white">Vault</span>
                          </h2>
                          <div className="absolute -top-3 -right-3 bg-[#FF5AF7] text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold tracking-wider shadow-md shadow-[#FF5AF7]/30">BETA</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto py-4 px-6">
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <Link href="/" className="block text-white font-medium py-2 px-4 rounded hover:bg-[#333] transition-colors">Home</Link>
                          <Link href="/vault-types" className="block text-white font-medium py-2 px-4 rounded hover:bg-[#333] transition-colors">Vault Types</Link>
                          <Link href="/vault-school" className="block text-white font-medium py-2 px-4 rounded hover:bg-[#333] transition-colors">Vault School</Link>
                          <Link href="/documentation" className="block text-white font-medium py-2 px-4 rounded hover:bg-[#333] transition-colors">Documentation</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            
            {/* Desktop menu */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
              <Link href="/vault-types" className="text-gray-300 hover:text-white transition-colors">Vault Types</Link>
              <Link href="/vault-school" className="text-gray-300 hover:text-white transition-colors">Vault School</Link>
              <Link href="/documentation" className="text-gray-300 hover:text-white transition-colors">Documentation</Link>
            </div>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default DocumentationLayout;