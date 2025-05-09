import React, { useState } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

export interface PriceTarget {
  price: number;
  percentage: number;
  hit?: boolean;
}

export interface StrategyTesterProps {
  strategy: string;
  assetType: string;
  initialAmount: number;
  priceTargets: PriceTarget[];
  timeBasedExits: { date: string; percentage: number }[];
  technicalIndicators: any[];
}

export function StrategyTester({
  strategy,
  assetType,
  initialAmount,
  priceTargets,
  timeBasedExits,
  technicalIndicators
}: StrategyTesterProps) {
  const [timeframe, setTimeframe] = useState<string>("1y");
  const [marketCondition, setMarketCondition] = useState<string>("bull");
  const [volatility, setVolatility] = useState<number>(50);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [hasRun, setHasRun] = useState<boolean>(false);
  
  // Results
  const [strategyReturn, setStrategyReturn] = useState<number>(0);
  const [hodlReturn, setHodlReturn] = useState<number>(0);
  const [marketReturn, setMarketReturn] = useState<number>(0);
  const [maxDrawdown, setMaxDrawdown] = useState<number>(0);
  
  // Charts data
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [priceData, setPriceData] = useState<any[]>([]);
  
  // Run the backtest
  const runBacktest = () => {
    setIsRunning(true);
    
    // Simulate a delay for the backtest
    setTimeout(() => {
      // Generate mock historical data based on parameters
      const historicalData = generateHistoricalData();
      
      // Analyze the strategy performance
      const results = analyzeStrategyPerformance(historicalData);
      
      // Update state with results
      setStrategyReturn(results.strategyReturn);
      setHodlReturn(results.hodlReturn);
      setMarketReturn(results.marketReturn);
      setMaxDrawdown(results.maxDrawdown);
      setPerformanceData(results.performanceData);
      setPriceData(historicalData);
      
      setIsRunning(false);
      setHasRun(true);
    }, 1500);
  };
  
  // Generate mock historical price data based on selected parameters
  const generateHistoricalData = () => {
    const numDataPoints = timeframe === "1m" ? 30 : 
                         timeframe === "3m" ? 90 : 
                         timeframe === "6m" ? 180 : 
                         timeframe === "1y" ? 365 : 
                         timeframe === "3y" ? 1095 : 
                         timeframe === "5y" ? 1825 : 365;
    
    // Start from a reference price (we'll use bitcoin or another asset as example)
    const startPrice = assetType === "BTC" ? 60000 : 
                      assetType === "ETH" ? 3000 : 
                      assetType === "TON" ? 5 : 1000;
    
    const data = [];
    let currentPrice = startPrice;
    
    // Trend bias based on market condition
    const trendBias = marketCondition === "bull" ? 0.002 : 
                      marketCondition === "bear" ? -0.001 : 
                      marketCondition === "crab" ? 0 : 0.001;
    
    // Volatility factor (0-100 scale to 0.001-0.05)
    const volFactor = 0.001 + (volatility / 100) * 0.049;
    
    // Generate price series
    for (let i = 0; i < numDataPoints; i++) {
      // Random daily change with trend bias
      const change = (Math.random() - 0.5) * volFactor + trendBias;
      currentPrice = currentPrice * (1 + change);
      
      // Ensure price doesn't go below 0
      currentPrice = Math.max(currentPrice, 0.01);
      
      // Format date
      const date = new Date();
      date.setDate(date.getDate() - (numDataPoints - i));
      
      data.push({
        date: date.toISOString().split('T')[0],
        price: currentPrice
      });
    }
    
    return data;
  };
  
  // Analyze the performance of our strategy against the historical data
  const analyzeStrategyPerformance = (historicalData: any[]) => {
    // Start with initial investment amount
    let hodlValue = initialAmount;
    let strategyValue = initialAmount;
    let marketValue = initialAmount;
    
    // Keep track of maximum drawdown
    let peakValue = strategyValue;
    let maxDrawdown = 0;
    
    // Simulate different strategies
    const performanceData = [];
    
    // For profit-taking strategy
    let remainingAmount = initialAmount;
    const updatedPriceTargets = [...priceTargets].sort((a, b) => a.price - b.price);
    
    // For each day in our historical data
    for (let i = 0; i < historicalData.length; i++) {
      const currentPrice = historicalData[i].price;
      const startPrice = historicalData[0].price;
      
      // HODL strategy simply holds
      hodlValue = initialAmount * (currentPrice / startPrice);
      
      // Market follows a benchmark index (e.g., S&P 500 average return)
      const marketDailyReturn = 0.0002; // ~7.5% annually
      marketValue = initialAmount * Math.pow(1 + marketDailyReturn, i);
      
      // Strategy value depends on the selected strategy
      if (strategy === 'profit_taking') {
        // Check if any price targets were hit
        for (const target of updatedPriceTargets) {
          // If price reaches or exceeds target and target not yet hit
          if (currentPrice >= target.price && !target.hit) {
            // Mark this target as hit
            target.hit = true;
            
            // Calculate amount to sell
            const amountToSell = initialAmount * (target.percentage / 100);
            remainingAmount -= amountToSell;
            
            // Add sold value to strategy value
            strategyValue = remainingAmount * (currentPrice / startPrice) + amountToSell;
          }
        }
        
        // If no targets hit yet, follow HODL
        if (remainingAmount === initialAmount) {
          strategyValue = hodlValue;
        }
      } else if (strategy === 'dca_exit') {
        // For DCA exit, we'll simulate selling at predefined dates
        const currentDate = historicalData[i].date;
        
        for (const exit of timeBasedExits) {
          if (exit.date === currentDate) {
            const amountToSell = initialAmount * (exit.percentage / 100);
            remainingAmount -= amountToSell;
            strategyValue = remainingAmount * (currentPrice / startPrice) + amountToSell;
          }
        }
        
        if (remainingAmount === initialAmount) {
          strategyValue = hodlValue;
        }
      } else {
        // Diamond hands just holds (same as HODL)
        strategyValue = hodlValue;
      }
      
      // Calculate drawdown
      if (strategyValue > peakValue) {
        peakValue = strategyValue;
      }
      
      const currentDrawdown = (peakValue - strategyValue) / peakValue * 100;
      maxDrawdown = Math.max(maxDrawdown, currentDrawdown);
      
      // Add data point to our performance chart
      performanceData.push({
        date: historicalData[i].date,
        Strategy: strategyValue,
        HODL: hodlValue,
        Market: marketValue
      });
    }
    
    // Calculate final returns as percentages
    const strategyReturn = ((strategyValue - initialAmount) / initialAmount) * 100;
    const hodlReturn = ((hodlValue - initialAmount) / initialAmount) * 100;
    const marketReturn = ((marketValue - initialAmount) / initialAmount) * 100;
    
    return {
      strategyReturn,
      hodlReturn,
      marketReturn,
      maxDrawdown,
      performanceData
    };
  };
  
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-black/20 border-gray-800">
          <CardContent className="pt-6 space-y-4">
            <h3 className="text-lg font-medium">Backtest Parameters</h3>
            
            <div>
              <Label>Timeframe</Label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">1 Month</SelectItem>
                  <SelectItem value="3m">3 Months</SelectItem>
                  <SelectItem value="6m">6 Months</SelectItem>
                  <SelectItem value="1y">1 Year</SelectItem>
                  <SelectItem value="3y">3 Years</SelectItem>
                  <SelectItem value="5y">5 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Market Condition</Label>
              <Select value={marketCondition} onValueChange={setMarketCondition}>
                <SelectTrigger>
                  <SelectValue placeholder="Select market condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bull">Bull Market</SelectItem>
                  <SelectItem value="bear">Bear Market</SelectItem>
                  <SelectItem value="crab">Sideways Market</SelectItem>
                  <SelectItem value="mixed">Mixed Conditions</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Volatility</Label>
                <span className="text-sm">{volatility}%</span>
              </div>
              <Slider
                value={[volatility]}
                min={10}
                max={100}
                step={5}
                onValueChange={(values) => setVolatility(values[0])}
              />
            </div>
            
            <Button 
              onClick={runBacktest} 
              disabled={isRunning}
              className="w-full bg-[#3F51FF] hover:bg-[#3F51FF]/80"
            >
              {isRunning ? (
                <>
                  <i className="ri-loader-4-line animate-spin mr-2"></i>
                  Running Simulation...
                </>
              ) : (
                "Run Backtest"
              )}
            </Button>
          </CardContent>
        </Card>
        
        <Card className="bg-black/20 border-gray-800">
          <CardContent className="pt-6 space-y-4">
            <h3 className="text-lg font-medium">Strategy Settings</h3>
            
            <div>
              <Label>Strategy Type</Label>
              <div className="p-3 bg-gray-900 rounded-md mt-1">
                {strategy === 'diamond_hands' && "Diamond Hands (HODL)"}
                {strategy === 'profit_taking' && "Strategic Profit Taking"}
                {strategy === 'dca_exit' && "Dollar-Cost Average Exit"}
                {strategy === 'halvening_cycle' && "Bitcoin Halving Cycle"}
              </div>
            </div>
            
            {strategy === 'profit_taking' && (
              <div>
                <Label>Price Targets</Label>
                <div className="space-y-2 mt-2">
                  {priceTargets.map((target, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-gray-900 rounded-md">
                      <div className="text-sm">
                        {assetType} @ ${target.price.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400">
                        {target.percentage}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {strategy === 'dca_exit' && (
              <div>
                <Label>Time-Based Exits</Label>
                <div className="space-y-2 mt-2">
                  {timeBasedExits.map((exit, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-gray-900 rounded-md">
                      <div className="text-sm">
                        {new Date(exit.date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-400">
                        {exit.percentage}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {technicalIndicators.length > 0 && (
              <div>
                <Label>Technical Indicators</Label>
                <div className="space-y-2 mt-2">
                  {technicalIndicators.map((indicator, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-gray-900 rounded-md">
                      <div className="text-sm">
                        {indicator.type.toUpperCase()}
                        {indicator.type === 'ma' && ` (${indicator.period})`}
                        {indicator.type === 'rsi' && ` (${indicator.period})`}
                      </div>
                      <div className="text-sm text-gray-400">
                        {indicator.condition} 
                        {indicator.value ? ` ${indicator.value}` : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {hasRun && (
        <>
          <Card className="bg-black/20 border-gray-800">
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Backtest Results</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-black/40 p-3 rounded-lg">
                  <p className="text-xs text-gray-400">Strategy Return</p>
                  <p className={`text-xl font-bold ${strategyReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {strategyReturn.toFixed(2)}%
                  </p>
                </div>
                <div className="bg-black/40 p-3 rounded-lg">
                  <p className="text-xs text-gray-400">Buy & Hold Return</p>
                  <p className={`text-xl font-bold ${hodlReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {hodlReturn.toFixed(2)}%
                  </p>
                </div>
                <div className="bg-black/40 p-3 rounded-lg">
                  <p className="text-xs text-gray-400">Market Benchmark</p>
                  <p className={`text-xl font-bold ${marketReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {marketReturn.toFixed(2)}%
                  </p>
                </div>
                <div className="bg-black/40 p-3 rounded-lg">
                  <p className="text-xs text-gray-400">Max Drawdown</p>
                  <p className="text-xl font-bold text-red-500">
                    {maxDrawdown.toFixed(2)}%
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <Label>Performance Comparison</Label>
                <div className="h-[300px] mt-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#888" 
                        tick={{fill: '#888'}}
                        tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                      />
                      <YAxis 
                        stroke="#888" 
                        tick={{fill: '#888'}}
                        tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
                      />
                      <Tooltip
                        formatter={(value) => [`$${value.toLocaleString()}`, undefined]}
                        labelFormatter={(date) => new Date(date).toLocaleDateString()}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="Strategy" 
                        stroke="#3F51FF" 
                        strokeWidth={2} 
                        dot={false} 
                        activeDot={{ r: 5 }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="HODL" 
                        stroke="#FF5AF7" 
                        strokeWidth={2} 
                        dot={false} 
                        activeDot={{ r: 5 }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="Market" 
                        stroke="#10B981" 
                        strokeWidth={2} 
                        dot={false} 
                        activeDot={{ r: 5 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="mt-6">
                <Label>Price History</Label>
                <div className="h-[200px] mt-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={priceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#888" 
                        tick={{fill: '#888'}}
                        tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                      />
                      <YAxis 
                        stroke="#888" 
                        tick={{fill: '#888'}}
                        tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
                      />
                      <Tooltip
                        formatter={(value) => [`$${value.toLocaleString()}`, undefined]}
                        labelFormatter={(date) => new Date(date).toLocaleDateString()}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#3F51FF" 
                        fill="url(#colorPrice)" 
                        strokeWidth={2} 
                        dot={false} 
                      />
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3F51FF" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3F51FF" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="text-center text-sm text-gray-500">
            <p>
              Note: This backtest uses simulated data based on your selected parameters.
              Past performance is not indicative of future results.
            </p>
          </div>
        </>
      )}
    </div>
  );
}