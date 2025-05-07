import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { bitcoinService, BitcoinNetworkStats, BitcoinPrice, BitcoinHalvingInfo } from '@/lib/bitcoin/bitcoin-service';

// Define the context type
interface BitcoinContextType {
  networkStats: BitcoinNetworkStats | null;
  priceData: BitcoinPrice | null;
  halvingInfo: BitcoinHalvingInfo | null;
  nextHalvingDate: Date;
  daysUntilHalving: number;
  halvingCycleProgress: number;
  isLoading: boolean;
  refreshData: () => Promise<void>;
}

// Create the context
const BitcoinContext = createContext<BitcoinContextType | undefined>(undefined);

// Provider props interface
interface BitcoinProviderProps {
  children: ReactNode;
}

// Provider component
export function BitcoinProvider({ children }: BitcoinProviderProps) {
  const [networkStats, setNetworkStats] = useState<BitcoinNetworkStats | null>(null);
  const [priceData, setPriceData] = useState<BitcoinPrice | null>(null);
  const [halvingInfo, setHalvingInfo] = useState<BitcoinHalvingInfo | null>(null);
  const [nextHalvingDate, setNextHalvingDate] = useState<Date>(bitcoinService.getNextHalvingDate());
  const [daysUntilHalving, setDaysUntilHalving] = useState<number>(bitcoinService.calculateDaysUntilHalving());
  const [halvingCycleProgress, setHalvingCycleProgress] = useState<number>(bitcoinService.calculateHalvingCycleProgress());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch all Bitcoin data
  const fetchBitcoinData = async () => {
    try {
      setIsLoading(true);
      
      // Get updated halving date information
      const calculatedNextHalvingDate = bitcoinService.getNextHalvingDate();
      setNextHalvingDate(calculatedNextHalvingDate);
      setDaysUntilHalving(bitcoinService.calculateDaysUntilHalving());
      setHalvingCycleProgress(bitcoinService.calculateHalvingCycleProgress());
      
      // Load network stats, price, and halving info
      const [stats, price, halving] = await Promise.all([
        bitcoinService.getNetworkStats(),
        bitcoinService.getBitcoinPrice(),
        bitcoinService.getHalvingInfo()
      ]);
      
      setNetworkStats(stats);
      setPriceData(price);
      setHalvingInfo(halving);
    } catch (error) {
      console.error('Failed to fetch Bitcoin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on initial render
  useEffect(() => {
    fetchBitcoinData();
    
    // Set up polling interval for real-time data (every 60 seconds)
    const interval = setInterval(() => {
      fetchBitcoinData();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Provide context value
  const contextValue: BitcoinContextType = {
    networkStats,
    priceData,
    halvingInfo,
    nextHalvingDate,
    daysUntilHalving,
    halvingCycleProgress,
    isLoading,
    refreshData: fetchBitcoinData
  };

  return (
    <BitcoinContext.Provider value={contextValue}>
      {children}
    </BitcoinContext.Provider>
  );
}

// Custom hook for using the Bitcoin context
export function useBitcoin() {
  const context = useContext(BitcoinContext);
  
  if (context === undefined) {
    throw new Error('useBitcoin must be used within a BitcoinProvider');
  }
  
  return context;
}