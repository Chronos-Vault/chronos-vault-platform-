import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useVaultContract } from "@/hooks/use-contracts";
import { SecurityLevel, VaultType } from "@/lib/contract-interfaces";
import { useMultiChain } from "@/contexts/multi-chain-context";
import { motion } from "framer-motion";

interface BitcoinData {
  currentBlockHeight: number;
  currentPrice: number;
  subsidy?: {
    current: number;
    next: number;
  };
  nextHalving?: {
    blockHeight: number;
    blocksRemaining: number;
    estimatedTimeRemaining: {
      days: number;
      hours: number;
    };
    percentage: number;
  };
  totalBitcoin?: {
    mined: number;
    remaining: number;
    total: number;
  };
}

// Sample data (Would be fetched from real API in production)
const SAMPLE_BITCOIN_DATA: BitcoinData = {
  currentBlockHeight: 843209,
  currentPrice: 64835.42,
  subsidy: {
    current: 3.125,
    next: 1.5625
  },
  nextHalving: {
    blockHeight: 840000,
    blocksRemaining: 0, // Already happened in April 2024
    estimatedTimeRemaining: {
      days: 0,
      hours: 0
    },
    percentage: 100
  },
  totalBitcoin: {
    mined: 19560342,
    remaining: 1439658,
    total: 21000000
  }
};

export function BitcoinHalvingVault() {
  const [bitcoinData, setBitcoinData] = useState<BitcoinData>(SAMPLE_BITCOIN_DATA);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { createVault } = useVaultContract();

  useEffect(() => {
    const fetchBitcoinData = async () => {
      try {
        // In production, would fetch real data from blockchain API
        // const response = await fetch("https://mempool.space/api/v1/blocks/tip/height");
        // const blockHeight = await response.json();
        
        // Just simulating data update for now to avoid API dependencies
        setTimeout(() => {
          setBitcoinData({
            ...SAMPLE_BITCOIN_DATA,
            currentBlockHeight: SAMPLE_BITCOIN_DATA.currentBlockHeight + 1
          });
        }, 600000); // Update every 10 minutes
      } catch (error) {
        console.error("Error fetching Bitcoin data:", error);
      }
    };

    fetchBitcoinData();
    // Would set up interval in production: setInterval(fetchBitcoinData, 600000);
    
    return () => {
      // Would clear interval in production
    };
  }, []);

  const handleCreateHalvingVault = async () => {
    try {
      setLoading(true);
      
      // Calculate next halving block (approximately every 210,000 blocks)
      const nextHalvingBlock = Math.ceil(bitcoinData.currentBlockHeight / 210000) * 210000;
      
      // Estimate date (roughly 10 minutes per block, converted to timestamp)
      const now = new Date();
      const minutesRemaining = (nextHalvingBlock - bitcoinData.currentBlockHeight) * 10;
      const unlockDate = new Date(now.getTime() + minutesRemaining * 60 * 1000);
      
      await createVault({
        asset: "0xbtc", // Would use actual token address in production
        name: "Bitcoin Halving Vault",
        symbol: "BTHV",
        unlockTime: Math.floor(unlockDate.getTime() / 1000),
        securityLevel: SecurityLevel.ENHANCED,
        accessKey: "halving2028", // Would generate a secure key in production
        isPublic: true,
        vaultType: VaultType.INVESTMENT,
      });
      
      toast({
        title: "Halving Vault Created",
        description: "Your Bitcoin Halving Vault has been created successfully!",
      });
    } catch (error) {
      console.error("Error creating halving vault:", error);
      toast({
        title: "Creation Failed",
        description: "Failed to create Bitcoin Halving Vault",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-[#1a1a1a] to-[#232323] border-[#6B00D7] border-opacity-50 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]"></div>
        
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold flex items-center">
            <svg className="w-6 h-6 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-7.59V4h2v5h3v2h-3v2h-2V9H8V7h3z"/>
            </svg>
            Bitcoin Halving Vault
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Secure assets until the next Bitcoin halving event
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Current BTC Price</span>
              <span className="font-medium">${bitcoinData.currentPrice.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Block Height</span>
              <span className="font-medium">{bitcoinData.currentBlockHeight.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Last Halving</span>
              <span className="font-medium">Block 840,000</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Next Halving</span>
              <span className="font-medium">Block 1,050,000</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Current Reward</span>
              <span className="font-medium">{bitcoinData.subsidy?.current} BTC</span>
            </div>
          </div>
          
          <div className="pt-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">Progress to Next Halving</span>
              <span className="text-zinc-400">~{Math.floor((bitcoinData.currentBlockHeight - 840000) / 2100)}%</span>
            </div>
            <Progress value={(bitcoinData.currentBlockHeight - 840000) / 2100} className="h-2 bg-[#333333]" />
          </div>
          
          <div className="p-3 bg-[#0f0f0f] bg-opacity-50 rounded-md border border-[#333333] text-sm">
            <p className="text-zinc-300">
              The next Bitcoin halving is expected in <span className="text-[#FF5AF7] font-medium">~{Math.floor((1050000 - bitcoinData.currentBlockHeight) / 144)} days</span>.
              Creating a vault locked until this event may be a lucrative investment strategy.
            </p>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            onClick={handleCreateHalvingVault}
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#6B00D7] to-[#9500FF] hover:from-[#8400FF] hover:to-[#B700FF] text-white font-medium py-2 rounded-md transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? "Creating Vault..." : "Create Halving Vault"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}