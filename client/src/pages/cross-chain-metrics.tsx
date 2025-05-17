import React from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart4, ArrowUpDown } from "lucide-react";
import CrossChainMetricsMonitorFixed from '@/components/cross-chain/CrossChainMetricsMonitorFixed';

const CrossChainMetricsPage = () => {
  const [_, navigate] = useLocation();

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          className="mb-6 hover:bg-[#6B00D7]/10"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <div className="flex items-center mb-4">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center shadow-lg shadow-[#6B00D7]/30 mr-4">
            <BarChart4 className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
            Cross-Chain Metrics Dashboard
          </h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6 flex items-center">
            <div className="bg-[#242424] rounded-full p-3 mr-4">
              <ArrowUpDown className="h-6 w-6 text-[#FF5AF7]" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">Dynamic Optimization</h3>
              <p className="text-gray-400 text-sm">Automatic asset movement based on chain metrics</p>
            </div>
          </div>
          
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6 flex items-center">
            <div className="bg-[#242424] rounded-full p-3 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-[#FF5AF7]">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">Multi-Chain Analytics</h3>
              <p className="text-gray-400 text-sm">Unified view of metrics across all supported chains</p>
            </div>
          </div>
          
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6 flex items-center">
            <div className="bg-[#242424] rounded-full p-3 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-[#FF5AF7]">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">Real-Time Monitoring</h3>
              <p className="text-gray-400 text-sm">Live tracking of chain performance and efficiency</p>
            </div>
          </div>
        </div>
        
        <p className="text-lg text-gray-300 max-w-3xl mb-8">
          This dashboard provides real-time analytics and comparison metrics across all supported blockchains, 
          enabling intelligent decision-making for optimal transaction routing and asset management.
        </p>
      </div>
      
      <CrossChainMetricsMonitorFixed />
      
      <div className="mt-12 bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">How Cross-Chain Optimization Works</h2>
        <p className="text-gray-400 mb-6">
          Chronos Vault's cross-chain optimization system works behind the scenes to ensure your assets
          and transactions are always using the most efficient blockchain for your needs:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="text-[#FF5AF7] font-semibold text-lg">1. Continuous Monitoring</div>
            <p className="text-gray-400 text-sm">
              Our system actively monitors transaction fees, block times, congestion levels, and security
              metrics across all supported blockchains in real-time.
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="text-[#FF5AF7] font-semibold text-lg">2. Intelligent Analysis</div>
            <p className="text-gray-400 text-sm">
              Advanced algorithms analyze this data with your preferences (speed, cost, security) to
              determine the optimal chain for each operation.
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="text-[#FF5AF7] font-semibold text-lg">3. Seamless Migration</div>
            <p className="text-gray-400 text-sm">
              When beneficial, the system can automatically move assets between chains through secure
              atomic swaps, maintaining complete transaction integrity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrossChainMetricsPage;