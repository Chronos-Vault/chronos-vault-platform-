import React from 'react';
import { Link, useLocation } from 'wouter';
import { Shield, Activity } from 'lucide-react';

/**
 * Main navigation component for the application
 */
export const NavBar: React.FC = () => {
  const [location] = useLocation();
  
  return (
    <div className="bg-[#121212] border-b border-purple-900/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-xl font-bold bg-gradient-to-r from-purple-400 to-indigo-500 text-transparent bg-clip-text mr-6">
            Chronos Vault
          </div>
          
          <nav className="hidden md:flex space-x-1">
            <NavLink 
              to="/" 
              isActive={location === '/'} 
              icon={<Activity className="h-4 w-4 mr-1.5" />}
            >
              Transaction Monitor
            </NavLink>
            
            <NavLink 
              to="/ton-security" 
              isActive={location === '/ton-security'} 
              icon={<Shield className="h-4 w-4 mr-1.5" />}
            >
              TON Security
            </NavLink>
            
            {/* Add more navigation links as needed */}
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-black/40 rounded-full px-3 py-1 text-xs border border-[#6B00D7]/20">
            <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
            <span className="text-green-400">Mainnet Connected</span>
          </div>
        </div>
      </div>
      
      {/* Mobile navigation */}
      <div className="md:hidden border-t border-purple-900/10 py-2 px-4">
        <div className="flex justify-between">
          <NavLink 
            to="/" 
            isActive={location === '/'} 
            icon={<Activity className="h-4 w-4 mr-1.5" />}
            mobile
          >
            Transactions
          </NavLink>
          
          <NavLink 
            to="/ton-security" 
            isActive={location === '/ton-security'} 
            icon={<Shield className="h-4 w-4 mr-1.5" />}
            mobile
          >
            TON Security
          </NavLink>
          
          {/* Add more mobile navigation links as needed */}
        </div>
      </div>
    </div>
  );
};

interface NavLinkProps {
  to: string;
  isActive: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  mobile?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, isActive, icon, children, mobile }) => {
  const baseStyles = "flex items-center transition-colors duration-200";
  const activeStyles = "bg-[#6B00D7]/10 text-purple-400 border-purple-500";
  const inactiveStyles = "text-gray-400 hover:text-purple-400 border-transparent hover:bg-[#6B00D7]/5";
  
  if (mobile) {
    return (
      <Link href={to} className={`
        ${baseStyles}
        ${isActive ? activeStyles : inactiveStyles}
        px-3 py-1.5 rounded-lg text-xs font-medium
      `}>
        {icon}
        {children}
      </Link>
    );
  }
  
  return (
    <Link href={to} className={`
      ${baseStyles}
      ${isActive ? activeStyles : inactiveStyles}
      px-3 py-1.5 rounded-lg text-sm border-b-2
    `}>
      {icon}
      {children}
    </Link>
  );
};