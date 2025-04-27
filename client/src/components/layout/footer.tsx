import { Link } from "wouter";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-[#121212] to-[#0A0A0A] pt-20 pb-10 border-t border-[#333333] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]"></div>
      <div className="absolute top-1/3 -left-40 w-80 h-80 rounded-full bg-[#6B00D7]/5 blur-[100px]"></div>
      <div className="absolute bottom-1/3 -right-40 w-80 h-80 rounded-full bg-[#FF5AF7]/5 blur-[100px]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
          <div>
            <Link href="/" className="flex items-center gap-3 mb-8 group">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center shadow-lg shadow-[#6B00D7]/20 group-hover:shadow-[#FF5AF7]/30 transition-all">
                <span className="text-white font-bold font-poppins text-xl">CV</span>
              </div>
              <h1 className="text-3xl font-poppins font-bold text-white">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] group-hover:from-[#FF5AF7] group-hover:to-[#6B00D7] transition-all">Chronos</span> 
                <span className="text-white">Vault</span>
              </h1>
            </Link>
            
            <p className="text-gray-300 mb-8 text-lg font-poppins">The Swiss Bank of Web3 — decentralized, unstoppable, and built with beauty and trust at the core.</p>
            
            <div className="flex space-x-4">
              <a href="#" className="w-12 h-12 rounded-full bg-[#1A1A1A] flex items-center justify-center text-gray-400 hover:text-white border border-transparent hover:border-[#6B00D7] hover:shadow-lg hover:shadow-[#6B00D7]/20 transition-all">
                <i className="ri-twitter-x-line text-xl"></i>
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-[#1A1A1A] flex items-center justify-center text-gray-400 hover:text-white border border-transparent hover:border-[#6B00D7] hover:shadow-lg hover:shadow-[#6B00D7]/20 transition-all">
                <i className="ri-discord-line text-xl"></i>
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-[#1A1A1A] flex items-center justify-center text-gray-400 hover:text-white border border-transparent hover:border-[#6B00D7] hover:shadow-lg hover:shadow-[#6B00D7]/20 transition-all">
                <i className="ri-github-fill text-xl"></i>
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-[#1A1A1A] flex items-center justify-center text-gray-400 hover:text-white border border-transparent hover:border-[#6B00D7] hover:shadow-lg hover:shadow-[#6B00D7]/20 transition-all">
                <i className="ri-telegram-line text-xl"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-poppins font-bold text-xl mb-5 text-white">Products</h3>
            <ul className="space-y-4">
              <li><Link href="/create-vault" className="text-gray-300 hover:text-[#FF5AF7] transition-all font-poppins hover:translate-x-1 inline-flex">Legacy Vault</Link></li>
              <li><Link href="/create-vault" className="text-gray-300 hover:text-[#FF5AF7] transition-all font-poppins hover:translate-x-1 inline-flex">Investment Vault</Link></li>
              <li><Link href="/create-vault" className="text-gray-300 hover:text-[#FF5AF7] transition-all font-poppins hover:translate-x-1 inline-flex">Project Vault</Link></li>
              <li><Link href="/about" className="text-gray-300 hover:text-[#FF5AF7] transition-all font-poppins hover:translate-x-1 inline-flex">Custom Solutions</Link></li>
              <li><Link href="/my-vaults" className="text-gray-300 hover:text-[#FF5AF7] transition-all font-poppins hover:translate-x-1 inline-flex">Vault Analytics</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-poppins font-bold text-xl mb-5 text-white">Resources</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-300 hover:text-[#FF5AF7] transition-all font-poppins hover:translate-x-1 inline-flex">Documentation</a></li>
              <li><a href="#" className="text-gray-300 hover:text-[#FF5AF7] transition-all font-poppins hover:translate-x-1 inline-flex">API Reference</a></li>
              <li><a href="#" className="text-gray-300 hover:text-[#FF5AF7] transition-all font-poppins hover:translate-x-1 inline-flex">Security Audits</a></li>
              <li><a href="#" className="text-gray-300 hover:text-[#FF5AF7] transition-all font-poppins hover:translate-x-1 inline-flex">Blog</a></li>
              <li><a href="#" className="text-gray-300 hover:text-[#FF5AF7] transition-all font-poppins hover:translate-x-1 inline-flex">Help Center</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-poppins font-bold text-xl mb-5 text-white">Company</h3>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-gray-300 hover:text-[#FF5AF7] transition-all font-poppins hover:translate-x-1 inline-flex">About Us</Link></li>
              <li><a href="#" className="text-gray-300 hover:text-[#FF5AF7] transition-all font-poppins hover:translate-x-1 inline-flex">Careers</a></li>
              <li><a href="#" className="text-gray-300 hover:text-[#FF5AF7] transition-all font-poppins hover:translate-x-1 inline-flex">Partners</a></li>
              <li><a href="#" className="text-gray-300 hover:text-[#FF5AF7] transition-all font-poppins hover:translate-x-1 inline-flex">Contact</a></li>
              <li><a href="#" className="text-gray-300 hover:text-[#FF5AF7] transition-all font-poppins hover:translate-x-1 inline-flex">Press Kit</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[#333333] pt-10 pb-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#6B00D7]/30 to-[#FF5AF7]/30 flex items-center justify-center mr-3">
              <span className="text-white font-bold font-poppins text-xs">CV</span>
            </div>
            <p className="text-gray-400 font-poppins">© {currentYear} <span className="text-white">Chronos Vault</span>. All rights reserved.</p>
          </div>
          
          <div className="flex space-x-8 mt-6 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-[#FF5AF7] font-poppins transition-all hover:translate-y-[-2px]">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-[#FF5AF7] font-poppins transition-all hover:translate-y-[-2px]">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-[#FF5AF7] font-poppins transition-all hover:translate-y-[-2px]">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
