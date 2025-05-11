import { Link } from "wouter";
import logoPath from '@assets/IMG_3753.jpeg';

const Footer = ({ className = '' }: { className?: string }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`bg-gradient-to-b from-[#1A1A1A] to-[#121212] pt-20 pb-10 border-t border-[#6B00D7]/20 relative overflow-hidden ${className}`}>
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]"></div>
      <div className="absolute top-1/3 -left-40 w-80 h-80 rounded-full bg-[#6B00D7]/10 blur-[100px]"></div>
      <div className="absolute bottom-1/3 -right-40 w-80 h-80 rounded-full bg-[#FF5AF7]/10 blur-[100px]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
          <div>
            <Link href="/" className="flex items-center gap-3 mb-8 group">
              <div className="h-14 w-14 rounded-full flex items-center justify-center shadow-lg shadow-[#6B00D7]/20 group-hover:shadow-[#FF5AF7]/30 transition-all overflow-hidden border-2 border-white/20">
                <img src={logoPath} alt="Chronos Vault Logo" className="w-full h-full object-cover" />
              </div>
              <div className="relative">
                <h1 className="text-3xl font-poppins font-bold text-white">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] group-hover:from-[#FF5AF7] group-hover:to-[#6B00D7] transition-all">Chronos</span> 
                  <span className="text-white">Vault</span>
                </h1>
                <div className="absolute -top-4 -right-4 bg-[#FF5AF7] text-white text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wider shadow-md shadow-[#FF5AF7]/30 animate-pulse">BETA</div>
              </div>
            </Link>
            
            <p className="text-gray-300 mb-8 text-lg font-poppins font-light">Revolutionary digital asset vault platform — decentralized, unstoppable, and built with security and elegance at the core.</p>
            
            <div className="flex space-x-4">
              <a href="https://x.com/chronosvaultx?s=21" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#6B00D7]/10 flex items-center justify-center text-[#FF5AF7] hover:text-white border border-[#6B00D7]/30 hover:border-[#FF5AF7] hover:shadow-lg hover:shadow-[#FF5AF7]/20 transition-all">
                <i className="ri-twitter-x-line text-xl"></i>
              </a>
              <a href="https://discord.gg/z7uhRcAw" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#6B00D7]/10 flex items-center justify-center text-[#FF5AF7] hover:text-white border border-[#6B00D7]/30 hover:border-[#FF5AF7] hover:shadow-lg hover:shadow-[#FF5AF7]/20 transition-all">
                <i className="ri-discord-line text-xl"></i>
              </a>
              <a href="https://github.com/Chronos-Vault" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#6B00D7]/10 flex items-center justify-center text-[#FF5AF7] hover:text-white border border-[#6B00D7]/30 hover:border-[#FF5AF7] hover:shadow-lg hover:shadow-[#FF5AF7]/20 transition-all">
                <i className="ri-github-fill text-xl"></i>
              </a>
              <a href="https://t.me/chronosvaultnetwork" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#6B00D7]/10 flex items-center justify-center text-[#FF5AF7] hover:text-white border border-[#6B00D7]/30 hover:border-[#FF5AF7] hover:shadow-lg hover:shadow-[#FF5AF7]/20 transition-all">
                <i className="ri-telegram-line text-xl"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-poppins font-semibold text-xl mb-5 text-white">Products</h3>
            <ul className="space-y-4">
              <li><Link href="/multi-signature-vault" className="text-gray-300 hover:text-[#FF5AF7] transition-all font-poppins font-light hover:translate-x-1 inline-flex">Multi-Signature Vault</Link></li>
              <li><Link href="/cross-chain-vault" className="text-gray-300 hover:text-[#FF5AF7] transition-all font-poppins font-light hover:translate-x-1 inline-flex">Cross-Chain Vault</Link></li>
              <li><Link href="/token-vaults" className="text-gray-300 hover:text-[#FF5AF7] transition-all font-poppins font-light hover:translate-x-1 inline-flex">Token Vaults</Link></li>
              <li><Link href="/bitcoin-halving-vault" className="text-gray-300 hover:text-[#FF5AF7] transition-all font-poppins font-light hover:translate-x-1 inline-flex">Bitcoin Halving Vault</Link></li>
              <li><Link href="/my-vaults" className="text-gray-300 hover:text-[#FF5AF7] transition-all font-poppins font-light hover:translate-x-1 inline-flex">My Vaults</Link></li>
              <li><Link href="/storage" className="text-gray-300 hover:text-[#FF5AF7] transition-all font-poppins font-light hover:translate-x-1 inline-flex">Decentralized Storage</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-poppins font-semibold text-xl mb-5 text-white">Resources</h3>
            <ul className="space-y-4">
              <li><Link href="/documentation" className="text-gray-300 hover:text-[#FF5AF7] transition-all font-poppins font-light hover:translate-x-1 inline-flex">Documentation</Link></li>
              <li><Link href="/technical-specification" className="text-gray-300 hover:text-[#FF5AF7] transition-all font-poppins font-light hover:translate-x-1 inline-flex">Technical Specs</Link></li>
              <li><Link href="/project-whitepaper" className="text-gray-300 hover:text-[#FF5AF7] transition-all font-poppins font-light hover:translate-x-1 inline-flex">Project Whitepaper</Link></li>
              <li><Link href="/whitepaper" className="text-gray-300 hover:text-[#FF5AF7] transition-all font-poppins font-light hover:translate-x-1 inline-flex">CVT Whitepaper</Link></li>
              <li><a href="https://github.com/Chronos-Vault" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#FF5AF7] transition-all font-poppins font-light hover:translate-x-1 inline-flex">GitHub</a></li>
              <li><a href="https://t.me/chronosvaultnetwork" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#FF5AF7] transition-all font-poppins font-light hover:translate-x-1 inline-flex">Telegram</a></li>
              <li><a href="https://discord.gg/z7uhRcAw" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#FF5AF7] transition-all font-poppins font-light hover:translate-x-1 inline-flex">Discord</a></li>
              <li><Link href="/security-testing" className="text-gray-300 hover:text-[#FF5AF7] transition-all font-poppins font-light hover:translate-x-1 inline-flex">Security Testing</Link></li>
              <li><Link href="/cross-chain-security" className="text-gray-300 hover:text-[#FF5AF7] transition-all font-poppins font-light hover:translate-x-1 inline-flex">Cross-Chain Security</Link></li>
              <li><Link href="/security-verification-demo" className="text-gray-300 hover:text-[#FF5AF7] transition-all font-poppins font-light hover:translate-x-1 inline-flex">Triple-Chain Verification</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-poppins font-semibold text-xl mb-5 text-white">Company</h3>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-gray-300 hover:text-[#FF5AF7] transition-all font-poppins font-light hover:translate-x-1 inline-flex">About Us</Link></li>
              <li><Link href="/roadmap" className="text-gray-300 hover:text-[#FF5AF7] transition-all font-poppins font-light hover:translate-x-1 inline-flex">Roadmap</Link></li>
              <li><Link href="/project-whitepaper" className="text-gray-300 hover:text-[#FF5AF7] transition-all font-poppins font-light hover:translate-x-1 inline-flex">Project Whitepaper</Link></li>
              <li><Link href="/whitepaper" className="text-gray-300 hover:text-[#FF5AF7] transition-all font-poppins font-light hover:translate-x-1 inline-flex">CVT Whitepaper</Link></li>
              <li><a href="https://x.com/chronosvaultx?s=21" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#FF5AF7] transition-all font-poppins font-light hover:translate-x-1 inline-flex">Twitter (X)</a></li>
              <li><a href="mailto:chronosvault@chronosvault.org" className="text-gray-300 hover:text-[#FF5AF7] transition-all font-poppins font-light hover:translate-x-1 inline-flex">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[#6B00D7]/20 pt-10 pb-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center mr-3 overflow-hidden shadow-inner shadow-[#6B00D7]/10 border border-white/10">
              <img src={logoPath} alt="Chronos Vault Logo" className="w-full h-full object-cover" />
            </div>
            <p className="text-gray-300 font-poppins font-light">© {currentYear} <span className="text-white font-medium">Chronos Vault</span>. All rights reserved.</p>
          </div>
          
          <div className="flex space-x-8 mt-6 md:mt-0">
            <a href="#" className="text-gray-300 hover:text-[#FF5AF7] font-poppins font-light transition-all hover:translate-y-[-2px]">Privacy Policy</a>
            <a href="#" className="text-gray-300 hover:text-[#FF5AF7] font-poppins font-light transition-all hover:translate-y-[-2px]">Terms of Service</a>
            <a href="#" className="text-gray-300 hover:text-[#FF5AF7] font-poppins font-light transition-all hover:translate-y-[-2px]">Cookie Policy</a>
            <Link href="/storage" className="text-gray-300 hover:text-[#FF5AF7] font-poppins font-light transition-all hover:translate-y-[-2px]">Storage</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
