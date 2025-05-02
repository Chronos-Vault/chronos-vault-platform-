import React from 'react';
import { Button } from '@/components/ui/button';
import TonWalletPanel from '@/components/ton/TonWalletPanel';
import Layout from '@/components/layout/Layout';

const WalletManagerPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center space-y-6">
          <h1 className="text-3xl font-bold text-white text-center bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
            Wallet Manager
          </h1>
          
          <p className="text-center text-gray-300 max-w-2xl">
            Connect, manage, and test wallet functionality for different blockchains
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl mt-8">
            <TonWalletPanel />
            
            {/* Placeholder for future wallet panels */}
            <div className="border border-[#6B00D7]/30 bg-gradient-to-br from-[#121212]/80 to-[#1A1A1A]/80 backdrop-blur-sm rounded-lg p-6 flex flex-col items-center justify-center h-96">
              <div className="text-center text-gray-400">
                <p className="text-lg font-medium mb-2">Ethereum Wallet</p>
                <p className="text-sm mb-6">Coming soon</p>
                <Button 
                  disabled
                  className="bg-gray-800/50 text-gray-500 border border-gray-700 cursor-not-allowed"
                >
                  Not Available Yet
                </Button>
              </div>
            </div>
            
            <div className="border border-[#6B00D7]/30 bg-gradient-to-br from-[#121212]/80 to-[#1A1A1A]/80 backdrop-blur-sm rounded-lg p-6 flex flex-col items-center justify-center h-96">
              <div className="text-center text-gray-400">
                <p className="text-lg font-medium mb-2">Solana Wallet</p>
                <p className="text-sm mb-6">Coming soon</p>
                <Button 
                  disabled
                  className="bg-gray-800/50 text-gray-500 border border-gray-700 cursor-not-allowed"
                >
                  Not Available Yet
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WalletManagerPage;
