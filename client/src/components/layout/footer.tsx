import { Link } from "wouter";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#121212] pt-16 pb-8 border-t border-[#333333]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <Link href="/">
              <a className="flex items-center gap-2 mb-6">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center">
                  <span className="text-white font-bold font-poppins text-lg">CV</span>
                </div>
                <h1 className="text-2xl font-poppins font-semibold text-white">
                  <span className="text-[#6B00D7]">Chronos</span> 
                  <span className="text-white">Vault</span>
                </h1>
              </a>
            </Link>
            
            <p className="text-gray-400 mb-6">The Swiss Bank of Web3 — decentralized, unstoppable, and built with beauty and trust at the core.</p>
            
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#6B00D7]/20 transition-all">
                <i className="ri-twitter-x-line"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#6B00D7]/20 transition-all">
                <i className="ri-discord-line"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#6B00D7]/20 transition-all">
                <i className="ri-github-fill"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#6B00D7]/20 transition-all">
                <i className="ri-telegram-line"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-poppins font-semibold text-lg mb-4">Products</h3>
            <ul className="space-y-3">
              <li><Link href="/create-vault"><a className="text-gray-400 hover:text-[#6B00D7] transition-colors">Legacy Vault</a></Link></li>
              <li><Link href="/create-vault"><a className="text-gray-400 hover:text-[#6B00D7] transition-colors">Investment Vault</a></Link></li>
              <li><Link href="/create-vault"><a className="text-gray-400 hover:text-[#6B00D7] transition-colors">Project Vault</a></Link></li>
              <li><Link href="/about"><a className="text-gray-400 hover:text-[#6B00D7] transition-colors">Custom Solutions</a></Link></li>
              <li><Link href="/my-vaults"><a className="text-gray-400 hover:text-[#6B00D7] transition-colors">Vault Analytics</a></Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-poppins font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-[#6B00D7] transition-colors">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#6B00D7] transition-colors">API Reference</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#6B00D7] transition-colors">Security Audits</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#6B00D7] transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#6B00D7] transition-colors">Help Center</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-poppins font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about"><a className="text-gray-400 hover:text-[#6B00D7] transition-colors">About Us</a></Link></li>
              <li><a href="#" className="text-gray-400 hover:text-[#6B00D7] transition-colors">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#6B00D7] transition-colors">Partners</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#6B00D7] transition-colors">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#6B00D7] transition-colors">Press Kit</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[#333333] pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">© {currentYear} Chronos Vault. All rights reserved.</p>
          
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-[#6B00D7] text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-[#6B00D7] text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-[#6B00D7] text-sm transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
