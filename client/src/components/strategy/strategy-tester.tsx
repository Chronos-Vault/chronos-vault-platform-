import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  PlayCircle, 
  PauseCircle,
  ChevronDown, 
  Settings, 
  Calendar, 
  BarChart, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Hourglass,
  RefreshCw,
  Plus,
  Info
} from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  Area, 
  AreaChart, 
  BarChart as RechartsBarChart,
  Bar,
  ReferenceLine
} from 'recharts';

interface StrategyTesterProps {
  assetSymbol?: string;
  strategyType?: 'hodl' | 'dca_exit' | 'profit_taking' | 'halvening_cycle';
  defaultConfig?: any;
  onSimulationComplete?: (results: SimulationResult) => void;
}

export interface HistoricalPrice {
  date: string;
  price: number;
  volume: number;
}

export interface SimulationResult {
  initialInvestment: number;
  finalValue: number;
  profitLoss: number;
  profitLossPercentage: number;
  transactions: SimulationTransaction[];
  metrics: {
    maxDrawdown: number;
    volatility: number;
    sharpeRatio: number;
    successRate: number;
    timeInMarket: number;
    avgHoldingPeriod: number;
  };
  timeline: {
    date: string;
    portfolioValue: number;
    marketValue: number;
    holdValue: number;
    cash: number;
    asset: number;
    action?: string;
  }[];
}

interface SimulationTransaction {
  date: string;
  type: 'buy' | 'sell';
  price: number;
  amount: number;
  value: number;
  trigger: string;
}

export function StrategyTester({
  assetSymbol = 'BTC',
  strategyType = 'hodl',
  defaultConfig,
  onSimulationComplete
}: StrategyTesterProps) {
  // Strategy configuration
  const [config, setConfig] = useState<any>(defaultConfig || {
    // Default HODL strategy
    initialInvestment: 10000,
    entryDate: '2020-03-01',
    exitDate: '2023-03-01',
    minHoldPeriod: 180, // days
    takeProfitAt: null,
    stopLossAt: null,
    // DCA exit
    exitSchedule: [],
    // Profit taking
    priceTargets: [],
    technicalTriggers: [],
    // Halvening
    halvingWindow: 60, // days before/after halving
    entryType: 'before', // before or after halving
    exitType: 'percentage', // percentage or time
    exitPercentage: 300,
    exitDays: 365
  });
  
  // Simulation state
  const [timeframe, setTimeframe] = useState<'1d' | '1w' | '1m'>('1d');
  const [simulationSpeed, setSimulationSpeed] = useState<number>(3);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [historicalPrices, setHistoricalPrices] = useState<HistoricalPrice[]>([]);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [activeMarkers, setActiveMarkers] = useState<{date: string, type: string}[]>([]);
  const [compareMode, setCompareMode] = useState<boolean>(true);
  const [showTransactions, setShowTransactions] = useState<boolean>(false);
  
  // Comparison mode setup
  const [compareStrategies, setCompareStrategies] = useState<string[]>(['hodl', 'market']);
  const [availableStrategies] = useState<{id: string, name: string}[]>([
    {id: 'hodl', name: 'HODL'},
    {id: 'dca_exit', name: 'DCA Exit'},
    {id: 'profit_taking', name: 'Profit Taking'},
    {id: 'halvening_cycle', name: 'Halvening Cycle'}
  ]);
  
  // Fetch historical price data
  useEffect(() => {
    fetchHistoricalPrices();
  }, [assetSymbol, timeframe]);
  
  const fetchHistoricalPrices = async () => {
    // In a real implementation, this would call an API
    // For simulation, generate sample data
    const startDate = new Date('2018-01-01');
    const endDate = new Date('2023-03-01');
    const prices: HistoricalPrice[] = [];
    
    let currentDate = new Date(startDate);
    let currentPrice = 5000; // Starting price for BTC around Jan 2018
    
    let dayCounter = 0;
    
    while (currentDate <= endDate) {
      dayCounter++;
      
      // Skip data points based on timeframe
      if (
        (timeframe === '1w' && dayCounter % 7 !== 0) ||
        (timeframe === '1m' && dayCounter % 30 !== 0)
      ) {
        // Add some randomness to the price (simulating daily volatility)
        const change = (Math.random() - 0.48) * (currentPrice * 0.03); // 3% max daily change
        currentPrice = Math.max(100, currentPrice + change);
        
        currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
        continue;
      }
      
      // Simulate the major price movements
      if (currentDate < new Date('2018-12-15')) {
        // Bear market 2018
        const change = (Math.random() - 0.55) * (currentPrice * 0.06);
        currentPrice = Math.max(3000, currentPrice + change);
      } else if (currentDate < new Date('2020-03-15')) {
        // Sideways/slow recovery
        const change = (Math.random() - 0.48) * (currentPrice * 0.04);
        currentPrice = Math.max(3500, currentPrice + change);
      } else if (currentDate < new Date('2020-05-01')) {
        // Covid crash
        const change = (Math.random() - 0.6) * (currentPrice * 0.08);
        currentPrice = Math.max(4000, currentPrice + change);
      } else if (currentDate < new Date('2021-04-15')) {
        // Bull market 2020-2021
        const change = (Math.random() - 0.35) * (currentPrice * 0.07);
        currentPrice = Math.max(5000, currentPrice + change);
      } else if (currentDate < new Date('2022-01-01')) {
        // Mid-2021 correction and recovery
        const change = (Math.random() - 0.52) * (currentPrice * 0.06);
        currentPrice = Math.max(30000, currentPrice + change);
      } else if (currentDate < new Date('2022-11-15')) {
        // 2022 bear market
        const change = (Math.random() - 0.58) * (currentPrice * 0.05);
        currentPrice = Math.max(15000, currentPrice + change);
      } else {
        // 2023 recovery
        const change = (Math.random() - 0.4) * (currentPrice * 0.04);
        currentPrice = Math.max(16000, currentPrice + change);
      }
      
      // Add some randomized volume
      const volume = Math.floor(Math.random() * 10000) + 5000;
      
      prices.push({
        date: currentDate.toISOString().split('T')[0],
        price: Math.round(currentPrice * 100) / 100,
        volume
      });
      
      currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
    }
    
    setHistoricalPrices(prices);
  };
  
  // Start the simulation
  const startSimulation = async () => {
    if (historicalPrices.length === 0) {
      console.error("No historical price data available");
      return;
    }
    
    setIsSimulating(true);
    setProgress(0);
    
    // Filter prices to the configured date range
    const filteredPrices = historicalPrices.filter(p => {
      const date = p.date;
      return date >= config.entryDate && date <= config.exitDate;
    });
    
    if (filteredPrices.length === 0) {
      console.error("No prices found in the configured date range");
      setIsSimulating(false);
      return;
    }
    
    let step = 0;
    const totalSteps = filteredPrices.length;
    const startTime = Date.now();
    
    // Initialize simulation state
    let currentCash = config.initialInvestment;
    let currentAssets = 0;
    let transactions: SimulationTransaction[] = [];
    let timeline: SimulationResult['timeline'] = [];
    let markers: {date: string, type: string}[] = [];
    
    // Buy at the start for HODL strategies
    if (strategyType === 'hodl') {
      const entryPrice = filteredPrices[0].price;
      const amount = currentCash / entryPrice;
      
      transactions.push({
        date: filteredPrices[0].date,
        type: 'buy',
        price: entryPrice,
        amount,
        value: currentCash,
        trigger: 'Entry Date'
      });
      
      markers.push({
        date: filteredPrices[0].date,
        type: 'entry'
      });
      
      currentAssets = amount;
      currentCash = 0;
    }
    
    // For DCA exit, pre-calculate exit points
    let dcaExitPoints: {date: string, percentage: number}[] = [];
    if (strategyType === 'dca_exit' && config.exitSchedule && config.exitSchedule.length > 0) {
      // Sort by date
      const sortedSchedule = [...config.exitSchedule].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      dcaExitPoints = sortedSchedule;
    }
    
    // For profit taking, pre-calculate price targets
    let profitTargets: {price: number, percentage: number}[] = [];
    if (strategyType === 'profit_taking' && config.priceTargets && config.priceTargets.length > 0) {
      // Sort by price
      const sortedTargets = [...config.priceTargets].sort((a, b) => a.price - b.price);
      profitTargets = sortedTargets;
    }
    
    // Track previous halving dates
    const halvingDates = [
      '2020-05-11',
      '2024-04-20',
      '2028-05-01'
    ];
    
    // Halvening cycle logic
    let nextHalvingDate = null;
    let entryDone = false;
    let exitDone = false;
    
    if (strategyType === 'halvening_cycle') {
      // Find the next halving after entry date
      for (const halvingDate of halvingDates) {
        if (new Date(halvingDate) > new Date(config.entryDate)) {
          nextHalvingDate = halvingDate;
          break;
        }
      }
    }
    
    // Simulation interval
    const interval = setInterval(() => {
      if (step >= totalSteps) {
        clearInterval(interval);
        finishSimulation(transactions, timeline, markers);
        return;
      }
      
      const price = filteredPrices[step];
      const portfolioValue = currentCash + (currentAssets * price.price);
      
      // Calculate HODL and market performance for comparison
      const initialHoldAssets = config.initialInvestment / filteredPrices[0].price;
      const holdValue = initialHoldAssets * price.price;
      const marketPerformance = config.initialInvestment * (price.price / filteredPrices[0].price);
      
      // Add to timeline
      timeline.push({
        date: price.date,
        portfolioValue,
        marketValue: marketPerformance,
        holdValue,
        cash: currentCash,
        asset: currentAssets,
      });
      
      // Strategy-specific logic
      switch (strategyType) {
        case 'hodl':
          // Check if minimum hold period has passed
          const entryDate = new Date(filteredPrices[0].date);
          const currentDate = new Date(price.date);
          const daysDiff = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
          
          // Exit conditions for HODL strategy
          if (daysDiff >= config.minHoldPeriod) {
            // Take profit check
            if (config.takeProfitAt && portfolioValue >= config.initialInvestment * (1 + config.takeProfitAt/100) && currentAssets > 0) {
              const sellValue = currentAssets * price.price;
              transactions.push({
                date: price.date,
                type: 'sell',
                price: price.price,
                amount: currentAssets,
                value: sellValue,
                trigger: 'Take Profit'
              });
              
              markers.push({
                date: price.date,
                type: 'take-profit'
              });
              
              currentCash += sellValue;
              currentAssets = 0;
              
              timeline[timeline.length - 1].action = 'Take Profit';
            }
            
            // Stop loss check
            if (config.stopLossAt && portfolioValue <= config.initialInvestment * (1 - config.stopLossAt/100) && currentAssets > 0) {
              const sellValue = currentAssets * price.price;
              transactions.push({
                date: price.date,
                type: 'sell',
                price: price.price,
                amount: currentAssets,
                value: sellValue,
                trigger: 'Stop Loss'
              });
              
              markers.push({
                date: price.date,
                type: 'stop-loss'
              });
              
              currentCash += sellValue;
              currentAssets = 0;
              
              timeline[timeline.length - 1].action = 'Stop Loss';
            }
          }
          
          // Final exit at the end date
          if (step === totalSteps - 1 && currentAssets > 0) {
            const sellValue = currentAssets * price.price;
            transactions.push({
              date: price.date,
              type: 'sell',
              price: price.price,
              amount: currentAssets,
              value: sellValue,
              trigger: 'Exit Date'
            });
            
            markers.push({
              date: price.date,
              type: 'exit'
            });
            
            currentCash += sellValue;
            currentAssets = 0;
            
            timeline[timeline.length - 1].action = 'Exit';
          }
          break;
          
        case 'dca_exit':
          // Initial buy if we haven't done it yet
          if (step === 0) {
            const entryPrice = price.price;
            const amount = currentCash / entryPrice;
            
            transactions.push({
              date: price.date,
              type: 'buy',
              price: entryPrice,
              amount,
              value: currentCash,
              trigger: 'Entry Date'
            });
            
            markers.push({
              date: price.date,
              type: 'entry'
            });
            
            currentAssets = amount;
            currentCash = 0;
            
            timeline[timeline.length - 1].action = 'Entry';
          }
          
          // Check if we should DCA out at this date
          if (dcaExitPoints.length > 0) {
            for (let i = 0; i < dcaExitPoints.length; i++) {
              if (price.date === dcaExitPoints[i].date && currentAssets > 0) {
                const percentToSell = dcaExitPoints[i].percentage / 100;
                const amountToSell = currentAssets * percentToSell;
                const sellValue = amountToSell * price.price;
                
                transactions.push({
                  date: price.date,
                  type: 'sell',
                  price: price.price,
                  amount: amountToSell,
                  value: sellValue,
                  trigger: `DCA Exit ${dcaExitPoints[i].percentage}%`
                });
                
                markers.push({
                  date: price.date,
                  type: 'dca-exit'
                });
                
                currentAssets -= amountToSell;
                currentCash += sellValue;
                
                timeline[timeline.length - 1].action = `DCA Exit ${dcaExitPoints[i].percentage}%`;
              }
            }
          }
          
          // Final exit at the end date
          if (step === totalSteps - 1 && currentAssets > 0) {
            const sellValue = currentAssets * price.price;
            transactions.push({
              date: price.date,
              type: 'sell',
              price: price.price,
              amount: currentAssets,
              value: sellValue,
              trigger: 'Final Exit'
            });
            
            markers.push({
              date: price.date,
              type: 'exit'
            });
            
            currentCash += sellValue;
            currentAssets = 0;
            
            timeline[timeline.length - 1].action = 'Final Exit';
          }
          break;
          
        case 'profit_taking':
          // Initial buy if we haven't done it yet
          if (step === 0) {
            const entryPrice = price.price;
            const amount = currentCash / entryPrice;
            
            transactions.push({
              date: price.date,
              type: 'buy',
              price: entryPrice,
              amount,
              value: currentCash,
              trigger: 'Entry Date'
            });
            
            markers.push({
              date: price.date,
              type: 'entry'
            });
            
            currentAssets = amount;
            currentCash = 0;
            
            timeline[timeline.length - 1].action = 'Entry';
          }
          
          // Check profit targets
          if (profitTargets.length > 0 && currentAssets > 0) {
            for (let i = 0; i < profitTargets.length; i++) {
              const target = profitTargets[i];
              
              if (price.price >= target.price && !target.hit) {
                const percentToSell = target.percentage / 100;
                const amountToSell = initialHoldAssets * percentToSell;
                
                // Don't sell more than we have
                const actualAmountToSell = Math.min(amountToSell, currentAssets);
                const sellValue = actualAmountToSell * price.price;
                
                transactions.push({
                  date: price.date,
                  type: 'sell',
                  price: price.price,
                  amount: actualAmountToSell,
                  value: sellValue,
                  trigger: `Profit Target $${target.price}`
                });
                
                markers.push({
                  date: price.date,
                  type: 'profit-target'
                });
                
                currentAssets -= actualAmountToSell;
                currentCash += sellValue;
                
                target.hit = true;
                
                timeline[timeline.length - 1].action = `Profit Target $${target.price}`;
              }
            }
          }
          
          // Final exit at the end date
          if (step === totalSteps - 1 && currentAssets > 0) {
            const sellValue = currentAssets * price.price;
            transactions.push({
              date: price.date,
              type: 'sell',
              price: price.price,
              amount: currentAssets,
              value: sellValue,
              trigger: 'Final Exit'
            });
            
            markers.push({
              date: price.date,
              type: 'exit'
            });
            
            currentCash += sellValue;
            currentAssets = 0;
            
            timeline[timeline.length - 1].action = 'Final Exit';
          }
          break;
          
        case 'halvening_cycle':
          // Check if we're within the entry window
          if (nextHalvingDate && !entryDone) {
            const halvingDateObj = new Date(nextHalvingDate);
            const currentDateObj = new Date(price.date);
            
            // Calculate days difference
            const daysDiff = Math.floor((halvingDateObj.getTime() - currentDateObj.getTime()) / (1000 * 60 * 60 * 24));
            
            // Check if we should enter based on the config
            if (
              (config.entryType === 'before' && daysDiff <= config.halvingWindow && daysDiff > 0) ||
              (config.entryType === 'after' && daysDiff >= -config.halvingWindow && daysDiff < 0)
            ) {
              // Buy
              const entryPrice = price.price;
              const amount = currentCash / entryPrice;
              
              transactions.push({
                date: price.date,
                type: 'buy',
                price: entryPrice,
                amount,
                value: currentCash,
                trigger: `Halving Entry (${daysDiff > 0 ? daysDiff + ' days before' : Math.abs(daysDiff) + ' days after'} halving)`
              });
              
              markers.push({
                date: price.date,
                type: 'halving-entry'
              });
              
              currentAssets = amount;
              currentCash = 0;
              entryDone = true;
              
              timeline[timeline.length - 1].action = 'Halving Entry';
            }
          }
          
          // Check if we should exit
          if (entryDone && !exitDone && currentAssets > 0) {
            const entryTransaction = transactions.find(t => t.type === 'buy');
            if (entryTransaction) {
              const entryPrice = entryTransaction.price;
              const entryDate = new Date(entryTransaction.date);
              const currentDateObj = new Date(price.date);
              
              // Calculate days since entry
              const daysSinceEntry = Math.floor((currentDateObj.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
              
              // Check if we should exit based on the config
              if (
                (config.exitType === 'percentage' && price.price >= entryPrice * (1 + config.exitPercentage/100)) ||
                (config.exitType === 'time' && daysSinceEntry >= config.exitDays)
              ) {
                // Sell
                const sellValue = currentAssets * price.price;
                
                transactions.push({
                  date: price.date,
                  type: 'sell',
                  price: price.price,
                  amount: currentAssets,
                  value: sellValue,
                  trigger: config.exitType === 'percentage' 
                    ? `Target ${config.exitPercentage}% profit reached` 
                    : `${config.exitDays} days holding period reached`
                });
                
                markers.push({
                  date: price.date,
                  type: 'halving-exit'
                });
                
                currentCash += sellValue;
                currentAssets = 0;
                exitDone = true;
                
                timeline[timeline.length - 1].action = 'Halving Exit';
              }
            }
          }
          
          // Final exit at the end date
          if (step === totalSteps - 1 && currentAssets > 0) {
            const sellValue = currentAssets * price.price;
            transactions.push({
              date: price.date,
              type: 'sell',
              price: price.price,
              amount: currentAssets,
              value: sellValue,
              trigger: 'Final Exit'
            });
            
            markers.push({
              date: price.date,
              type: 'exit'
            });
            
            currentCash += sellValue;
            currentAssets = 0;
            
            timeline[timeline.length - 1].action = 'Final Exit';
          }
          break;
      }
      
      // Calculate progress
      setProgress(Math.min(100, (step / totalSteps) * 100));
      
      // Increment step based on simulation speed
      step += simulationSpeed;
      
      // Ensure we don't skip the last step
      if (step > totalSteps - 1 && step - simulationSpeed < totalSteps - 1) {
        step = totalSteps - 1;
      }
    }, 50);
    
    return () => clearInterval(interval);
  };
  
  const finishSimulation = (transactions: SimulationTransaction[], timeline: SimulationResult['timeline'], markers: {date: string, type: string}[]) => {
    if (timeline.length === 0) {
      setIsSimulating(false);
      return;
    }
    
    // Calculate final value and profit/loss
    const finalValue = timeline[timeline.length - 1].portfolioValue;
    const profitLoss = finalValue - config.initialInvestment;
    const profitLossPercentage = (profitLoss / config.initialInvestment) * 100;
    
    // Calculate additional metrics
    const holdingPeriods: number[] = [];
    let maxDrawdown = 0;
    let peakValue = timeline[0].portfolioValue;
    
    for (let i = 0; i < timeline.length; i++) {
      // Calculate drawdown
      peakValue = Math.max(peakValue, timeline[i].portfolioValue);
      const drawdown = (peakValue - timeline[i].portfolioValue) / peakValue * 100;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    }
    
    // Calculate holding periods
    let buyDate: Date | null = null;
    for (const tx of transactions) {
      if (tx.type === 'buy') {
        buyDate = new Date(tx.date);
      } else if (tx.type === 'sell' && buyDate) {
        const sellDate = new Date(tx.date);
        const days = Math.floor((sellDate.getTime() - buyDate.getTime()) / (1000 * 60 * 60 * 24));
        holdingPeriods.push(days);
        buyDate = null;
      }
    }
    
    // Calculate volatility (standard deviation of daily returns)
    const dailyReturns: number[] = [];
    for (let i = 1; i < timeline.length; i++) {
      const prevValue = timeline[i-1].portfolioValue;
      const currentValue = timeline[i].portfolioValue;
      const dailyReturn = (currentValue / prevValue) - 1;
      dailyReturns.push(dailyReturn);
    }
    
    const averageReturn = dailyReturns.reduce((sum, val) => sum + val, 0) / dailyReturns.length;
    const variance = dailyReturns.reduce((sum, val) => sum + Math.pow(val - averageReturn, 2), 0) / dailyReturns.length;
    const volatility = Math.sqrt(variance) * Math.sqrt(252) * 100; // Annualized volatility in percentage
    
    // Calculate Sharpe ratio (assuming risk-free rate of 2%)
    const riskFreeRate = 2;
    const annualizedReturn = Math.pow(finalValue / config.initialInvestment, 252 / timeline.length) - 1;
    const sharpeRatio = (annualizedReturn * 100 - riskFreeRate) / volatility;
    
    // Calculate time in market
    const timeInMarket = holdingPeriods.reduce((sum, days) => sum + days, 0) / 
      (Math.floor((new Date(timeline[timeline.length-1].date).getTime() - new Date(timeline[0].date).getTime()) / (1000 * 60 * 60 * 24))) * 100;
    
    // Set result
    const result: SimulationResult = {
      initialInvestment: config.initialInvestment,
      finalValue,
      profitLoss,
      profitLossPercentage,
      transactions,
      metrics: {
        maxDrawdown,
        volatility,
        sharpeRatio,
        successRate: transactions.filter(tx => tx.type === 'sell' && tx.value > 0).length / transactions.filter(tx => tx.type === 'sell').length * 100,
        timeInMarket,
        avgHoldingPeriod: holdingPeriods.length > 0 ? holdingPeriods.reduce((sum, val) => sum + val, 0) / holdingPeriods.length : 0
      },
      timeline
    };
    
    setResult(result);
    setActiveMarkers(markers);
    setIsSimulating(false);
    setProgress(100);
    
    // Callback
    if (onSimulationComplete) {
      onSimulationComplete(result);
    }
  };
  
  // Reset the simulation
  const resetSimulation = () => {
    setResult(null);
    setActiveMarkers([]);
    setProgress(0);
  };
  
  // Custom tooltip component for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const matchingTimeline = result?.timeline.find(item => item.date === label);
      const action = matchingTimeline?.action;
      
      return (
        <div className="bg-black/80 border border-gray-700 p-3 rounded shadow-lg">
          <p className="text-gray-300 text-sm font-medium mb-1">{label}</p>
          
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: ${entry.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          ))}
          
          {action && (
            <div className="mt-2 pt-2 border-t border-gray-700">
              <p className="text-xs text-blue-400">{action}</p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };
  
  // Markers for transaction points
  const renderMarkers = () => {
    if (!result) return null;
    
    // Extract all the dates that have a transaction
    const transactionDates = new Set(result.transactions.map(tx => tx.date));
    
    // Get all the unique dates in the timeline
    const allDates = result.timeline.map(t => t.date);
    
    // Map for date to index
    const dateToIndex: Record<string, number> = {};
    allDates.forEach((date, index) => {
      dateToIndex[date] = index;
    });
    
    return activeMarkers.map((marker, index) => {
      const dateIndex = dateToIndex[marker.date];
      if (dateIndex === undefined) return null;
      
      // Get the corresponding timeline entry
      const timelineEntry = result.timeline[dateIndex];
      if (!timelineEntry) return null;
      
      const xPos = `${(dateIndex / (allDates.length - 1)) * 100}%`;
      const yPos = '50%';
      
      let color = '';
      let icon = null;
      
      switch (marker.type) {
        case 'entry':
          color = 'text-green-500';
          icon = <ArrowUpRight className="h-4 w-4" />;
          break;
        case 'exit':
          color = 'text-red-500';
          icon = <ArrowDownRight className="h-4 w-4" />;
          break;
        case 'take-profit':
          color = 'text-green-500';
          icon = <CheckCircle2 className="h-4 w-4" />;
          break;
        case 'stop-loss':
          color = 'text-red-500';
          icon = <XCircle className="h-4 w-4" />;
          break;
        case 'profit-target':
          color = 'text-amber-500';
          icon = <CheckCircle2 className="h-4 w-4" />;
          break;
        case 'dca-exit':
          color = 'text-blue-500';
          icon = <ArrowDownRight className="h-4 w-4" />;
          break;
        case 'halving-entry':
          color = 'text-purple-500';
          icon = <ArrowUpRight className="h-4 w-4" />;
          break;
        case 'halving-exit':
          color = 'text-purple-500';
          icon = <ArrowDownRight className="h-4 w-4" />;
          break;
        default:
          color = 'text-gray-500';
          icon = <Info className="h-4 w-4" />;
      }
      
      return (
        <div 
          key={`marker-${index}`}
          className={`absolute cursor-pointer ${color}`}
          style={{
            left: xPos,
            top: yPos,
            transform: 'translate(-50%, -50%)'
          }}
          title={`${marker.type} on ${marker.date}`}
        >
          {icon}
        </div>
      );
    });
  };
  
  // Format currency value
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  // Render strategy config form based on strategy type
  const renderStrategyConfig = () => {
    switch (strategyType) {
      case 'hodl':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minHoldPeriod">Minimum Hold Period (days)</Label>
                <div className="flex items-center space-x-2">
                  <Slider 
                    id="minHoldPeriod"
                    value={[config.minHoldPeriod || 180]}
                    min={1}
                    max={365}
                    step={1}
                    onValueChange={(value) => setConfig({...config, minHoldPeriod: value[0]})}
                  />
                  <span className="w-12 text-center">{config.minHoldPeriod || 180}</span>
                </div>
              </div>
              
              <div>
                <Label htmlFor="initialInvestment">Initial Investment ($)</Label>
                <Input 
                  id="initialInvestment"
                  type="number"
                  value={config.initialInvestment}
                  onChange={(e) => setConfig({...config, initialInvestment: parseFloat(e.target.value)})}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="entryDate">Entry Date</Label>
                <Input 
                  id="entryDate"
                  type="date"
                  value={config.entryDate}
                  onChange={(e) => setConfig({...config, entryDate: e.target.value})}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              
              <div>
                <Label htmlFor="exitDate">Exit Date</Label>
                <Input 
                  id="exitDate"
                  type="date"
                  value={config.exitDate}
                  onChange={(e) => setConfig({...config, exitDate: e.target.value})}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="takeProfitAt">Take Profit (%)</Label>
                <div className="flex items-center space-x-2">
                  <Slider 
                    id="takeProfitAt"
                    value={[config.takeProfitAt || 0]}
                    min={0}
                    max={1000}
                    step={10}
                    onValueChange={(value) => setConfig({...config, takeProfitAt: value[0]})}
                    disabled={!config.takeProfitEnabled}
                  />
                  <span className="w-16 text-center">{config.takeProfitAt || 0}%</span>
                </div>
                <div className="flex items-center mt-1">
                  <Switch 
                    id="takeProfitEnabled"
                    checked={config.takeProfitEnabled}
                    onCheckedChange={(checked) => setConfig({...config, takeProfitEnabled: checked, takeProfitAt: checked ? config.takeProfitAt || 100 : null})}
                  />
                  <Label htmlFor="takeProfitEnabled" className="ml-2 text-sm">Enable Take Profit</Label>
                </div>
              </div>
              
              <div>
                <Label htmlFor="stopLossAt">Stop Loss (%)</Label>
                <div className="flex items-center space-x-2">
                  <Slider 
                    id="stopLossAt"
                    value={[config.stopLossAt || 0]}
                    min={0}
                    max={100}
                    step={5}
                    onValueChange={(value) => setConfig({...config, stopLossAt: value[0]})}
                    disabled={!config.stopLossEnabled}
                  />
                  <span className="w-16 text-center">{config.stopLossAt || 0}%</span>
                </div>
                <div className="flex items-center mt-1">
                  <Switch 
                    id="stopLossEnabled"
                    checked={config.stopLossEnabled}
                    onCheckedChange={(checked) => setConfig({...config, stopLossEnabled: checked, stopLossAt: checked ? config.stopLossAt || 20 : null})}
                  />
                  <Label htmlFor="stopLossEnabled" className="ml-2 text-sm">Enable Stop Loss</Label>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'dca_exit':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="initialInvestment">Initial Investment ($)</Label>
                <Input 
                  id="initialInvestment"
                  type="number"
                  value={config.initialInvestment}
                  onChange={(e) => setConfig({...config, initialInvestment: parseFloat(e.target.value)})}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              
              <div>
                <Label htmlFor="entryDate">Entry Date</Label>
                <Input 
                  id="entryDate"
                  type="date"
                  value={config.entryDate}
                  onChange={(e) => setConfig({...config, entryDate: e.target.value})}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>DCA Exit Schedule</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  className="border-gray-700"
                  onClick={() => {
                    const exitSchedule = [...(config.exitSchedule || [])];
                    
                    // Add a new exit point
                    // Default to 3 months after entry with 25% sale
                    const entryDate = new Date(config.entryDate);
                    entryDate.setMonth(entryDate.getMonth() + 3);
                    const defaultExitDate = entryDate.toISOString().split('T')[0];
                    
                    exitSchedule.push({
                      date: defaultExitDate,
                      percentage: 25
                    });
                    
                    setConfig({...config, exitSchedule});
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Exit Point
                </Button>
              </div>
              
              {config.exitSchedule && config.exitSchedule.length > 0 ? (
                <div className="space-y-2">
                  {config.exitSchedule.map((exit: any, index: number) => (
                    <div key={index} className="flex items-center space-x-2 bg-black/30 border border-gray-800 p-2 rounded">
                      <Input 
                        type="date"
                        value={exit.date}
                        onChange={(e) => {
                          const exitSchedule = [...config.exitSchedule];
                          exitSchedule[index].date = e.target.value;
                          setConfig({...config, exitSchedule});
                        }}
                        className="bg-gray-800 border-gray-700 flex-1"
                      />
                      <div className="flex items-center space-x-2 w-32">
                        <Input 
                          type="number"
                          value={exit.percentage}
                          onChange={(e) => {
                            const exitSchedule = [...config.exitSchedule];
                            exitSchedule[index].percentage = Math.min(100, Math.max(1, parseInt(e.target.value)));
                            setConfig({...config, exitSchedule});
                          }}
                          className="bg-gray-800 border-gray-700 w-16"
                        />
                        <span>%</span>
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        className="text-gray-400 hover:text-red-400"
                        onClick={() => {
                          const exitSchedule = [...config.exitSchedule];
                          exitSchedule.splice(index, 1);
                          setConfig({...config, exitSchedule});
                        }}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 bg-black/30 border border-gray-800 rounded">
                  <p className="text-gray-500">No exit points configured</p>
                  <p className="text-xs text-gray-600 mt-1">Add exit points to sell portions of your investment over time</p>
                </div>
              )}
            </div>
            
            <div>
              <Label htmlFor="exitDate">Final Exit Date</Label>
              <Input 
                id="exitDate"
                type="date"
                value={config.exitDate}
                onChange={(e) => setConfig({...config, exitDate: e.target.value})}
                className="bg-gray-800 border-gray-700"
              />
              <p className="text-xs text-gray-500 mt-1">Any remaining assets will be sold on this date</p>
            </div>
          </div>
        );
        
      case 'profit_taking':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="initialInvestment">Initial Investment ($)</Label>
                <Input 
                  id="initialInvestment"
                  type="number"
                  value={config.initialInvestment}
                  onChange={(e) => setConfig({...config, initialInvestment: parseFloat(e.target.value)})}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              
              <div>
                <Label htmlFor="entryDate">Entry Date</Label>
                <Input 
                  id="entryDate"
                  type="date"
                  value={config.entryDate}
                  onChange={(e) => setConfig({...config, entryDate: e.target.value})}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Price Targets</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  className="border-gray-700"
                  onClick={() => {
                    const priceTargets = [...(config.priceTargets || [])];
                    
                    // Get entry price (approximate)
                    const entryDate = new Date(config.entryDate);
                    const entryDateStr = entryDate.toISOString().split('T')[0];
                    const entryPrice = historicalPrices.find(p => p.date === entryDateStr)?.price || 10000;
                    
                    // Default to 2x entry price and 25% sale
                    priceTargets.push({
                      price: Math.round(entryPrice * 2),
                      percentage: 25
                    });
                    
                    setConfig({...config, priceTargets});
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Price Target
                </Button>
              </div>
              
              {config.priceTargets && config.priceTargets.length > 0 ? (
                <div className="space-y-2">
                  {config.priceTargets.map((target: any, index: number) => (
                    <div key={index} className="flex items-center space-x-2 bg-black/30 border border-gray-800 p-2 rounded">
                      <div className="flex items-center space-x-2 flex-1">
                        <span>$</span>
                        <Input 
                          type="number"
                          value={target.price}
                          onChange={(e) => {
                            const priceTargets = [...config.priceTargets];
                            priceTargets[index].price = Math.max(1, parseInt(e.target.value));
                            setConfig({...config, priceTargets});
                          }}
                          className="bg-gray-800 border-gray-700"
                        />
                      </div>
                      <div className="flex items-center space-x-2 w-32">
                        <Input 
                          type="number"
                          value={target.percentage}
                          onChange={(e) => {
                            const priceTargets = [...config.priceTargets];
                            priceTargets[index].percentage = Math.min(100, Math.max(1, parseInt(e.target.value)));
                            setConfig({...config, priceTargets});
                          }}
                          className="bg-gray-800 border-gray-700 w-16"
                        />
                        <span>%</span>
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        className="text-gray-400 hover:text-red-400"
                        onClick={() => {
                          const priceTargets = [...config.priceTargets];
                          priceTargets.splice(index, 1);
                          setConfig({...config, priceTargets});
                        }}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 bg-black/30 border border-gray-800 rounded">
                  <p className="text-gray-500">No price targets configured</p>
                  <p className="text-xs text-gray-600 mt-1">Add price targets to sell portions of your investment at specific prices</p>
                </div>
              )}
            </div>
            
            <div>
              <Label htmlFor="exitDate">Final Exit Date</Label>
              <Input 
                id="exitDate"
                type="date"
                value={config.exitDate}
                onChange={(e) => setConfig({...config, exitDate: e.target.value})}
                className="bg-gray-800 border-gray-700"
              />
              <p className="text-xs text-gray-500 mt-1">Any remaining assets will be sold on this date</p>
            </div>
          </div>
        );
        
      case 'halvening_cycle':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="initialInvestment">Initial Investment ($)</Label>
                <Input 
                  id="initialInvestment"
                  type="number"
                  value={config.initialInvestment}
                  onChange={(e) => setConfig({...config, initialInvestment: parseFloat(e.target.value)})}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              
              <div>
                <Label htmlFor="halvingWindow">Halving Window (days)</Label>
                <div className="flex items-center space-x-2">
                  <Slider 
                    id="halvingWindow"
                    value={[config.halvingWindow || 60]}
                    min={1}
                    max={180}
                    step={1}
                    onValueChange={(value) => setConfig({...config, halvingWindow: value[0]})}
                  />
                  <span className="w-12 text-center">{config.halvingWindow || 60}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Number of days before/after halving to enter</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Entry Timing</Label>
                <div className="space-y-1 mt-2">
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      id="entryBefore" 
                      name="entryType" 
                      className="mr-2" 
                      checked={config.entryType === 'before'}
                      onChange={() => setConfig({...config, entryType: 'before'})}
                    />
                    <Label htmlFor="entryBefore" className="text-sm">Before Halving</Label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      id="entryAfter" 
                      name="entryType" 
                      className="mr-2" 
                      checked={config.entryType === 'after'}
                      onChange={() => setConfig({...config, entryType: 'after'})}
                    />
                    <Label htmlFor="entryAfter" className="text-sm">After Halving</Label>
                  </div>
                </div>
              </div>
              
              <div>
                <Label>Exit Strategy</Label>
                <div className="space-y-1 mt-2">
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      id="exitPercentage" 
                      name="exitType" 
                      className="mr-2" 
                      checked={config.exitType === 'percentage'}
                      onChange={() => setConfig({...config, exitType: 'percentage'})}
                    />
                    <Label htmlFor="exitPercentage" className="text-sm">Percentage Gain</Label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      id="exitTime" 
                      name="exitType" 
                      className="mr-2" 
                      checked={config.exitType === 'time'}
                      onChange={() => setConfig({...config, exitType: 'time'})}
                    />
                    <Label htmlFor="exitTime" className="text-sm">Time Period</Label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {config.exitType === 'percentage' ? (
                <div>
                  <Label htmlFor="exitPercentage">Target Profit (%)</Label>
                  <div className="flex items-center space-x-2">
                    <Slider 
                      id="exitPercentage"
                      value={[config.exitPercentage || 300]}
                      min={10}
                      max={1000}
                      step={10}
                      onValueChange={(value) => setConfig({...config, exitPercentage: value[0]})}
                    />
                    <span className="w-16 text-center">{config.exitPercentage || 300}%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Exit when reaching this profit percentage</p>
                </div>
              ) : (
                <div>
                  <Label htmlFor="exitDays">Hold Duration (days)</Label>
                  <div className="flex items-center space-x-2">
                    <Slider 
                      id="exitDays"
                      value={[config.exitDays || 365]}
                      min={30}
                      max={730}
                      step={30}
                      onValueChange={(value) => setConfig({...config, exitDays: value[0]})}
                    />
                    <span className="w-16 text-center">{config.exitDays || 365}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Exit after holding for this many days</p>
                </div>
              )}
              
              <div>
                <Label htmlFor="entryDate">Analysis Start Date</Label>
                <Input 
                  id="entryDate"
                  type="date"
                  value={config.entryDate}
                  onChange={(e) => setConfig({...config, entryDate: e.target.value})}
                  className="bg-gray-800 border-gray-700"
                />
                <p className="text-xs text-gray-500 mt-1">Simulation start date</p>
              </div>
            </div>
            
            <div>
              <Label htmlFor="exitDate">Analysis End Date</Label>
              <Input 
                id="exitDate"
                type="date"
                value={config.exitDate}
                onChange={(e) => setConfig({...config, exitDate: e.target.value})}
                className="bg-gray-800 border-gray-700"
              />
              <p className="text-xs text-gray-500 mt-1">Simulation end date</p>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // Get a friendly name for the strategy
  const getStrategyName = () => {
    switch (strategyType) {
      case 'hodl':
        return 'HODL Strategy';
      case 'dca_exit':
        return 'DCA Exit Strategy';
      case 'profit_taking':
        return 'Profit Taking Strategy';
      case 'halvening_cycle':
        return 'Halvening Cycle Strategy';
      default:
        return 'Custom Strategy';
    }
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="config">
        <div className="flex justify-between items-center mb-4">
          <TabsList className="bg-gray-800">
            <TabsTrigger value="config">Strategy Setup</TabsTrigger>
            <TabsTrigger value="results" disabled={!result}>Results</TabsTrigger>
            <TabsTrigger value="metrics" disabled={!result}>Analysis</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-2">
            <Select
              value={timeframe}
              onValueChange={(value: any) => setTimeframe(value)}
            >
              <SelectTrigger className="w-32 bg-gray-800 border-gray-700">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="1d">Daily</SelectItem>
                <SelectItem value="1w">Weekly</SelectItem>
                <SelectItem value="1m">Monthly</SelectItem>
              </SelectContent>
            </Select>
            
            {result ? (
              <Button
                variant="outline"
                size="sm"
                onClick={resetSimulation}
                className="border-gray-700"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Reset
              </Button>
            ) : isSimulating ? (
              <Button
                variant="outline"
                size="sm"
                disabled
                className="border-gray-700"
              >
                <Hourglass className="h-4 w-4 mr-1 animate-pulse" />
                Running...
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={startSimulation}
                disabled={historicalPrices.length === 0}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <PlayCircle className="h-4 w-4 mr-1" />
                Simulate
              </Button>
            )}
          </div>
        </div>
        
        <TabsContent value="config" className="space-y-4">
          <Card className="bg-black/40 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2 text-indigo-400" />
                {getStrategyName()} Configuration
              </CardTitle>
              <CardDescription>
                Configure parameters for backtesting the {strategyType.replace('_', ' ')} strategy
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderStrategyConfig()}
            </CardContent>
            {!result && (
              <CardFooter>
                <Button
                  onClick={startSimulation}
                  disabled={historicalPrices.length === 0 || isSimulating}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  {isSimulating ? (
                    <>
                      <Hourglass className="h-4 w-4 mr-2 animate-pulse" />
                      Running Simulation...
                    </>
                  ) : (
                    <>
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Run Simulation
                    </>
                  )}
                </Button>
              </CardFooter>
            )}
          </Card>
          
          {isSimulating && (
            <Card className="bg-black/40 border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Simulation Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-400">
                  <span>Processing...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="results" className="space-y-4">
          {result && (
            <>
              <Card className="bg-black/40 border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <BarChart className="h-5 w-5 mr-2 text-indigo-400" />
                    Simulation Results
                  </CardTitle>
                  <CardDescription>
                    Performance of {getStrategyName()} for {assetSymbol} from {config.entryDate} to {config.exitDate}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-black/20 border border-gray-800 rounded-md p-4">
                      <div className="text-gray-400 text-sm mb-1">Initial Investment</div>
                      <div className="text-xl font-semibold">{formatCurrency(result.initialInvestment)}</div>
                    </div>
                    
                    <div className="bg-black/20 border border-gray-800 rounded-md p-4">
                      <div className="text-gray-400 text-sm mb-1">Final Value</div>
                      <div className="text-xl font-semibold">{formatCurrency(result.finalValue)}</div>
                    </div>
                    
                    <div className="bg-black/20 border border-gray-800 rounded-md p-4">
                      <div className="text-gray-400 text-sm mb-1">Profit/Loss</div>
                      <div className={`text-xl font-semibold ${result.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {formatCurrency(result.profitLoss)} ({result.profitLossPercentage.toFixed(2)}%)
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={result.timeline}>
                        <defs>
                          <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#818cf8" stopOpacity={0.1}/>
                          </linearGradient>
                          <linearGradient id="marketGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#9ca3af" stopOpacity={0.1}/>
                          </linearGradient>
                          <linearGradient id="holdGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fill: '#9ca3af' }}
                          tickLine={{ stroke: '#4b5563' }}
                          axisLine={{ stroke: '#4b5563' }}
                          minTickGap={50}
                        />
                        <YAxis 
                          tick={{ fill: '#9ca3af' }}
                          tickLine={{ stroke: '#4b5563' }}
                          axisLine={{ stroke: '#4b5563' }}
                          tickFormatter={(value) => `$${value.toLocaleString()}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        
                        <Area 
                          type="monotone" 
                          dataKey="portfolioValue" 
                          name="Strategy" 
                          stroke="#818cf8" 
                          fillOpacity={1}
                          fill="url(#portfolioGradient)"
                        />
                        
                        {compareMode && (
                          <>
                            {compareStrategies.includes('market') && (
                              <Area
                                type="monotone"
                                dataKey="marketValue"
                                name="Market"
                                stroke="#9ca3af"
                                fillOpacity={0}
                              />
                            )}
                            
                            {compareStrategies.includes('hodl') && (
                              <Area
                                type="monotone"
                                dataKey="holdValue"
                                name="HODL"
                                stroke="#10b981"
                                fillOpacity={0}
                              />
                            )}
                          </>
                        )}
                      </AreaChart>
                    </ResponsiveContainer>
                    
                    {/* Transaction markers */}
                    {renderMarkers()}
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="compareMode" 
                        checked={compareMode}
                        onCheckedChange={setCompareMode}
                      />
                      <Label htmlFor="compareMode">Compare with other strategies</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="showTransactions"
                        checked={showTransactions}
                        onCheckedChange={setShowTransactions}
                      />
                      <Label htmlFor="showTransactions">Show transactions</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {showTransactions && (
                <Card className="bg-black/40 border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Transactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[250px]">
                      {result.transactions.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead className="text-right">Price</TableHead>
                              <TableHead className="text-right">Amount</TableHead>
                              <TableHead className="text-right">Value</TableHead>
                              <TableHead>Trigger</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {result.transactions.map((tx, i) => (
                              <TableRow key={i}>
                                <TableCell>{tx.date}</TableCell>
                                <TableCell>
                                  <Badge className={tx.type === 'buy' ? 'bg-green-600' : 'bg-red-600'}>
                                    {tx.type.toUpperCase()}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">${tx.price.toLocaleString()}</TableCell>
                                <TableCell className="text-right">{tx.amount.toFixed(6)}</TableCell>
                                <TableCell className="text-right">${tx.value.toLocaleString()}</TableCell>
                                <TableCell>{tx.trigger}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <div className="text-center py-12 text-gray-500">
                          <p>No transactions recorded</p>
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="metrics" className="space-y-4">
          {result && (
            <>
              <Card className="bg-black/40 border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <BarChart className="h-5 w-5 mr-2 text-indigo-400" />
                    Performance Metrics
                  </CardTitle>
                  <CardDescription>
                    Detailed analysis of strategy performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-black/20 border border-gray-800 rounded-md p-4">
                      <div className="text-gray-400 text-sm mb-1">Max Drawdown</div>
                      <div className="text-xl font-semibold text-amber-500">-{result.metrics.maxDrawdown.toFixed(2)}%</div>
                    </div>
                    
                    <div className="bg-black/20 border border-gray-800 rounded-md p-4">
                      <div className="text-gray-400 text-sm mb-1">Volatility</div>
                      <div className="text-xl font-semibold">{result.metrics.volatility.toFixed(2)}%</div>
                    </div>
                    
                    <div className="bg-black/20 border border-gray-800 rounded-md p-4">
                      <div className="text-gray-400 text-sm mb-1">Sharpe Ratio</div>
                      <div className={`text-xl font-semibold ${result.metrics.sharpeRatio >= 1 ? 'text-green-500' : result.metrics.sharpeRatio >= 0 ? 'text-amber-500' : 'text-red-500'}`}>
                        {result.metrics.sharpeRatio.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-black/20 border border-gray-800 rounded-md p-4">
                      <div className="text-gray-400 text-sm mb-1">Success Rate</div>
                      <div className="text-xl font-semibold">{result.metrics.successRate.toFixed(2)}%</div>
                    </div>
                    
                    <div className="bg-black/20 border border-gray-800 rounded-md p-4">
                      <div className="text-gray-400 text-sm mb-1">Time in Market</div>
                      <div className="text-xl font-semibold">{result.metrics.timeInMarket.toFixed(2)}%</div>
                    </div>
                    
                    <div className="bg-black/20 border border-gray-800 rounded-md p-4">
                      <div className="text-gray-400 text-sm mb-1">Avg Holding Period</div>
                      <div className="text-xl font-semibold">{Math.round(result.metrics.avgHoldingPeriod)} days</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-black/40 border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Strategy Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            {
                              name: 'Return',
                              Strategy: result.profitLossPercentage,
                              HODL: ((result.timeline[result.timeline.length - 1].holdValue / result.initialInvestment) - 1) * 100,
                              Market: ((result.timeline[result.timeline.length - 1].marketValue / result.initialInvestment) - 1) * 100
                            }
                          ]}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="name" tick={{ fill: '#9ca3af' }} />
                          <YAxis
                            tickFormatter={(value) => `${value.toFixed(0)}%`}
                            tick={{ fill: '#9ca3af' }}
                          />
                          <Tooltip
                            formatter={(value: any) => [`${value.toFixed(2)}%`, 'Return']}
                            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
                          />
                          <Legend verticalAlign="top" height={36} />
                          <Bar dataKey="Strategy" fill="#818cf8" />
                          <Bar dataKey="HODL" fill="#10b981" />
                          <Bar dataKey="Market" fill="#9ca3af" />
                          <ReferenceLine y={0} stroke="#4b5563" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-black/40 border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Drawdown Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={result.timeline.map((point, i, arr) => {
                            // Calculate the running maximum value up to this point
                            let maxValue = 0;
                            for (let j = 0; j <= i; j++) {
                              maxValue = Math.max(maxValue, arr[j].portfolioValue);
                            }
                            
                            // Calculate the drawdown percentage
                            const drawdown = ((point.portfolioValue / maxValue) - 1) * 100;
                            
                            return {
                              date: point.date,
                              drawdown: drawdown
                            };
                          })}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis
                            dataKey="date"
                            tick={{ fill: '#9ca3af' }}
                            minTickGap={50}
                          />
                          <YAxis
                            tickFormatter={(value) => `${value.toFixed(0)}%`}
                            tick={{ fill: '#9ca3af' }}
                          />
                          <Tooltip
                            formatter={(value: any) => [`${value.toFixed(2)}%`, 'Drawdown']}
                            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
                            labelFormatter={(label) => `Date: ${label}`}
                          />
                          <ReferenceLine y={0} stroke="#4b5563" />
                          <Line
                            type="monotone"
                            dataKey="drawdown"
                            stroke="#ef4444"
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default StrategyTester;