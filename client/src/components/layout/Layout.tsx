import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <footer className="py-6 border-t">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Chronos Vault. All rights reserved.
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/documentation" className="text-sm text-muted-foreground hover:text-primary">
                Documentation
              </a>
              <a href="/whitepaper" className="text-sm text-muted-foreground hover:text-primary">
                Whitepaper
              </a>
              <a href="/security-testing" className="text-sm text-muted-foreground hover:text-primary">
                Security
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
