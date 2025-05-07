import React from 'react';
import Navbar from './Navbar';
import Footer from './footer';
import FloatingTransactionMonitor from '@/components/transactions/FloatingTransactionMonitor';
import { useLocation } from 'wouter';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [location] = useLocation();
  const isTransactionMonitorPage = location === '/transaction-monitor';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      
      {/* Only show the floating button when NOT on the Transaction Monitor page */}
      {!isTransactionMonitorPage && <FloatingTransactionMonitor />}
    </div>
  );
};

export default Layout;
