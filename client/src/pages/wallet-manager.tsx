import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle } from 'lucide-react';
import TonWalletPanel from '@/components/ton/TonWalletPanel';
import TonWalletController from '@/components/ton/TonWalletController';

const WalletManagerPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center space-y-6">
        <h1 className="text-3xl font-bold text-white text-center bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
          Wallet Manager
        </h1>
        
        <p className="text-center text-gray-300 max-w-2xl">
          Connect, manage, and test wallet functionality for different blockchains
        </p>
        
        <div className="flex flex-col gap-4 w-full max-w-6xl mt-8">
          {/* TON Wallet Tabs */}
          <div className="border border-[#6B00D7]/30 rounded-lg p-6 bg-[#121212]/80">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <span className="inline-block rounded-full p-1 mr-2 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.9992 6.03107C16.9992 4.80797 16.0057 3.81445 14.7826 3.81445H5.2158C3.9927 3.81445 2.99917 4.80797 2.99917 6.03107V13.9686C2.99917 15.1917 3.9927 16.1853 5.2158 16.1853H14.7826C16.0057 16.1853 16.9992 15.1917 16.9992 13.9686V6.03107Z" stroke="#121212" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9.99917 11.9997C10.9197 11.9997 11.6659 11.2536 11.6659 10.333C11.6659 9.41245 10.9197 8.66634 9.99917 8.66634C9.07861 8.66634 8.3325 9.41245 8.3325 10.333C8.3325 11.2536 9.07861 11.9997 9.99917 11.9997Z" stroke="#121212" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 12V14" stroke="#121212" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              TON Wallet Integration
            </h2>
            
            <Tabs defaultValue="standard">
              <TabsList className="mb-4 bg-[#1A1A1A]/80 border border-[#333333] p-1">
                <TabsTrigger value="standard" className="data-[state=active]:bg-[#6B00D7] data-[state=active]:text-white">
                  Standard Panel
                </TabsTrigger>
                <TabsTrigger value="advanced" className="data-[state=active]:bg-[#6B00D7] data-[state=active]:text-white">
                  Advanced Controller
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="standard" className="mt-0">
                <TonWalletPanel />
              </TabsContent>
              
              <TabsContent value="advanced" className="mt-0">
                <div className="space-y-4">
                  <div className="p-3 rounded-md bg-amber-900/20 border border-amber-700/30 text-amber-300 flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm">This is an advanced debugging panel for TON wallet connection issues. Use this to troubleshoot connection problems.</p>
                    </div>
                  </div>
                  <TonWalletController />
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* Placeholder for future wallet panels */}
            <div className="border border-[#6B00D7]/30 bg-gradient-to-br from-[#121212]/80 to-[#1A1A1A]/80 backdrop-blur-sm rounded-lg p-6 flex flex-col items-center justify-center h-72">
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
            
            <div className="border border-[#6B00D7]/30 bg-gradient-to-br from-[#121212]/80 to-[#1A1A1A]/80 backdrop-blur-sm rounded-lg p-6 flex flex-col items-center justify-center h-72">
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
    </div>
  );
};

export default WalletManagerPage;
