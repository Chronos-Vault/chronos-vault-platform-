import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

/**
 * Temporary navigation bar component for testing
 * This will help us determine if there's an issue with the header component
 */
const TemporaryNavBar = () => {
  const [location] = useLocation();
  
  return (
    <div className="bg-black p-4 fixed top-20 right-4 z-50 border-2 border-[#FF5AF7] rounded-lg shadow-lg">
      <div className="flex flex-col gap-2">
        <h2 className="text-[#FF5AF7] font-bold mb-2">Quick Navigation</h2>
        
        <Link href="/" className={`text-white hover:text-[#FF5AF7] ${location === '/' ? 'font-bold' : ''}`}>
          Home
        </Link>
        
        <Link href="/create-vault" className={`text-white hover:text-[#FF5AF7] ${location === '/create-vault' ? 'font-bold' : ''}`}>
          Create Vault
        </Link>
        
        <Link href="/my-vaults" className={`text-white hover:text-[#FF5AF7] ${location === '/my-vaults' ? 'font-bold' : ''}`}>
          My Vaults
        </Link>
        
        <Link href="/storage" className={`text-[#FF5AF7] font-bold border px-2 py-1 rounded-md border-[#FF5AF7] animate-pulse`}>
          Storage
        </Link>
        
        <Link href="/gift-crypto" className={`text-white hover:text-[#FF5AF7] ${location === '/gift-crypto' ? 'font-bold' : ''}`}>
          Gift Crypto
        </Link>
        
        <Button 
          className="mt-2 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white"
          onClick={() => window.location.href = '/storage'}
        >
          Go to Storage
        </Button>
      </div>
    </div>
  );
};

export default TemporaryNavBar;