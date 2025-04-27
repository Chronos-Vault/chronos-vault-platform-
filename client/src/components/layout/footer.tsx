import { Link } from "wouter";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-[#242424] to-[#1E1E1E] pt-20 pb-10 border-t border-[#6B00D7]/30 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]"></div>
      <div className="absolute top-1/3 -left-40 w-80 h-80 rounded-full bg-[#6B00D7]/10 blur-[100px]"></div>
      <div className="absolute bottom-1/3 -right-40 w-80 h-80 rounded-full bg-[#FF5AF7]/10 blur-[100px]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
          <div>
            <Link href="/" className="flex items-center gap-3 mb-8 group">
              <div className="h-14 w-14 rounded-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center shadow-lg shadow-[#6B00D7]/20 group-hover:shadow-[#FF5AF7]/30 transition-all p-3.5">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                  <path d="M19 7H5C3.89543 7 3 7.89543 3 9V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V9C21 7.89543 20.1046 7 19 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 7V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 14V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="relative">
                <h1 className="text-3xl font-poppins font-bold text-white">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] group-hover:from-[#FF5AF7] group-hover:to-[#6B00D7] transition-all">Chronos</span> 
                  <span className="text-white">Vault</span>
                </h1>
                <div className="absolute -top-4 -right-4 bg-[#FF5AF7] text-white text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wider shadow-md shadow-[#FF5AF7]/30 animate-pulse">BETA</div>
              </div>
            </Link>
            
            <p className="text-gray-200 mb-8 text-lg font-poppins">The Swiss Bank of Web3 — decentralized, unstoppable, and built with beauty and trust at the core.</p>
            
            <div className="flex space-x-4">
              <a href="#" className="w-12 h-12 rounded-full bg-[#6B00D7]/10 flex items-center justify-center text-[#FF5AF7] hover:text-white border border-[#6B00D7]/30 hover:border-[#FF5AF7] hover:shadow-lg hover:shadow-[#FF5AF7]/20 transition-all">
                <i className="ri-twitter-x-line text-xl"></i>
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-[#6B00D7]/10 flex items-center justify-center text-[#FF5AF7] hover:text-white border border-[#6B00D7]/30 hover:border-[#FF5AF7] hover:shadow-lg hover:shadow-[#FF5AF7]/20 transition-all">
                <i className="ri-discord-line text-xl"></i>
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-[#6B00D7]/10 flex items-center justify-center text-[#FF5AF7] hover:text-white border border-[#6B00D7]/30 hover:border-[#FF5AF7] hover:shadow-lg hover:shadow-[#FF5AF7]/20 transition-all">
                <i className="ri-github-fill text-xl"></i>
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-[#6B00D7]/10 flex items-center justify-center text-[#FF5AF7] hover:text-white border border-[#6B00D7]/30 hover:border-[#FF5AF7] hover:shadow-lg hover:shadow-[#FF5AF7]/20 transition-all">
                <i className="ri-telegram-line text-xl"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-poppins font-bold text-xl mb-5 text-white">Products</h3>
            <ul className="space-y-4">
              <li><Link href="/create-vault" className="text-gray-200 hover:text-[#FF5AF7] transition-all font-poppins hover:translate-x-1 inline-flex">Legacy Vault</Link></li>
              <li><Link href="/create-vault" className="text-gray-200 hover:text-[#FF5AF7] transition-all font-poppins hover:translate-x-1 inline-flex">Investment Vault</Link></li>
              <li><Link href="/create-vault" className="text-gray-200 hover:text-[#FF5AF7] transition-all font-poppins hover:translate-x-1 inline-flex">Project Vault</Link></li>
              <li><Link href="/about" className="text-gray-200 hover:text-[#FF5AF7] transition-all font-poppins hover:translate-x-1 inline-flex">Custom Solutions</Link></li>
              <li><Link href="/my-vaults" className="text-gray-200 hover:text-[#FF5AF7] transition-all font-poppins hover:translate-x-1 inline-flex">Vault Analytics</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-poppins font-bold text-xl mb-5 text-white">Resources</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-200 hover:text-[#FF5AF7] transition-all font-poppins hover:translate-x-1 inline-flex">Documentation</a></li>
              <li><a href="#" className="text-gray-200 hover:text-[#FF5AF7] transition-all font-poppins hover:translate-x-1 inline-flex">API Reference</a></li>
              <li><a href="#" className="text-gray-200 hover:text-[#FF5AF7] transition-all font-poppins hover:translate-x-1 inline-flex">Security Audits</a></li>
              <li><a href="#" className="text-gray-200 hover:text-[#FF5AF7] transition-all font-poppins hover:translate-x-1 inline-flex">Blog</a></li>
              <li><a href="#" className="text-gray-200 hover:text-[#FF5AF7] transition-all font-poppins hover:translate-x-1 inline-flex">Help Center</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-poppins font-bold text-xl mb-5 text-white">Company</h3>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-gray-200 hover:text-[#FF5AF7] transition-all font-poppins hover:translate-x-1 inline-flex">About Us</Link></li>
              <li><a href="#" className="text-gray-200 hover:text-[#FF5AF7] transition-all font-poppins hover:translate-x-1 inline-flex">Careers</a></li>
              <li><a href="#" className="text-gray-200 hover:text-[#FF5AF7] transition-all font-poppins hover:translate-x-1 inline-flex">Partners</a></li>
              <li><a href="#" className="text-gray-200 hover:text-[#FF5AF7] transition-all font-poppins hover:translate-x-1 inline-flex">Contact</a></li>
              <li><a href="#" className="text-gray-200 hover:text-[#FF5AF7] transition-all font-poppins hover:translate-x-1 inline-flex">Press Kit</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[#6B00D7]/30 pt-10 pb-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-[#6B00D7]/40 to-[#FF5AF7]/30 flex items-center justify-center mr-3 p-2 shadow-inner shadow-[#6B00D7]/10">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                <path d="M19 7H5C3.89543 7 3 7.89543 3 9V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V9C21 7.89543 20.1046 7 19 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 7V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 14V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="text-gray-200 font-poppins">© {currentYear} <span className="text-white font-semibold">Chronos Vault</span>. All rights reserved.</p>
          </div>
          
          <div className="flex space-x-8 mt-6 md:mt-0">
            <a href="#" className="text-gray-200 hover:text-[#FF5AF7] font-poppins transition-all hover:translate-y-[-2px]">Privacy Policy</a>
            <a href="#" className="text-gray-200 hover:text-[#FF5AF7] font-poppins transition-all hover:translate-y-[-2px]">Terms of Service</a>
            <a href="#" className="text-gray-200 hover:text-[#FF5AF7] font-poppins transition-all hover:translate-y-[-2px]">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
