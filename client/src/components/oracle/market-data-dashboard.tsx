import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
  Area,
  BarChart,
  Bar
} from "recharts";

const MOCK_BTC_PRICE_DATA = [
  { date: "2023-01", price: 23000 },
  { date: "2023-02", price: 25000 },
  { date: "2023-03", price: 28000 },
  { date: "2023-04", price: 29500 },
  { date: "2023-05", price: 31000 },
  { date: "2023-06", price: 27000 },
  { date: "2023-07", price: 29000 },
  { date: "2023-08", price: 26000 },
  { date: "2023-09", price: 28000 },
  { date: "2023-10", price: 35000 },
  { date: "2023-11", price: 42000 },
  { date: "2023-12", price: 45000 },
  { date: "2024-01", price: 52000 },
  { date: "2024-02", price: 58000 },
  { date: "2024-03", price: 65000 },
  { date: "2024-04", price: 85000 },
  { date: "2024-05", price: 103000 },
];

const MOCK_TRADING_VOLUME = [
  { date: "2023-01", volume: 123 },
  { date: "2023-02", volume: 156 },
  { date: "2023-03", volume: 145 },
  { date: "2023-04", volume: 178 },
  { date: "2023-05", volume: 210 },
  { date: "2023-06", volume: 198 },
  { date: "2023-07", volume: 176 },
  { date: "2023-08", volume: 187 },
  { date: "2023-09", volume: 201 },
  { date: "2023-10", volume: 234 },
  { date: "2023-11", volume: 321 },
  { date: "2023-12", volume: 345 },
  { date: "2024-01", volume: 298 },
  { date: "2024-02", volume: 319 },
  { date: "2024-03", volume: 376 },
  { date: "2024-04", volume: 412 },
  { date: "2024-05", volume: 489 },
];

const MOCK_HALVING_EVENTS = [
  { date: "2012-11-28", price: 12.5, reward: "25 BTC" },
  { date: "2016-07-09", price: 650, reward: "12.5 BTC" },
  { date: "2020-05-11", price: 8800, reward: "6.25 BTC" },
  { date: "2024-04-20", price: 65000, reward: "3.125 BTC" },
  { date: "2028-04-13", price: null, reward: "1.5625 BTC", estimated: true },
];

const MOCK_ON_CHAIN_METRICS = {
  activeAddresses: 46372,
  averageTransactionValue: 23450,
  hashRate: "520 EH/s",
  blockchainSize: "498 GB",
  mempool: 27890,
  nextDifficulty: "+3.2%",
};

const MOCK_MARKET_SENTIMENT = {
  fearGreedIndex: 76,
  fearGreedLabel: "Greed",
  bullishPercentage: 72,
  bearishPercentage: 28,
  marketCap: "1.98T",
  totalValueLocked: "46.8B",
  averageFees: "$4.24",
};

export function MarketDataDashboard() {
  const [timeframe, setTimeframe] = useState<string>("1y");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  useEffect(() => {
    // In a real application, we would load real data here
    setIsLoading(true);
    
    // Simulate an API delay
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timeout);
  }, [timeframe]);
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="price" className="w-full">
        <TabsList className="grid grid-cols-4 bg-gray-800/50">
          <TabsTrigger value="price">Price Data</TabsTrigger>
          <TabsTrigger value="indicators">Market Indicators</TabsTrigger>
          <TabsTrigger value="on-chain">On-Chain Metrics</TabsTrigger>
          <TabsTrigger value="halving">Halving Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="price" className="mt-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">BTC Price History</h3>
            <div className="flex space-x-1">
              <button
                onClick={() => setTimeframe("1m")}
                className={`px-2 py-1 text-xs rounded ${timeframe === "1m" ? "bg-[#3F51FF] text-white" : "bg-gray-800"}`}
              >
                1M
              </button>
              <button
                onClick={() => setTimeframe("3m")}
                className={`px-2 py-1 text-xs rounded ${timeframe === "3m" ? "bg-[#3F51FF] text-white" : "bg-gray-800"}`}
              >
                3M
              </button>
              <button
                onClick={() => setTimeframe("6m")}
                className={`px-2 py-1 text-xs rounded ${timeframe === "6m" ? "bg-[#3F51FF] text-white" : "bg-gray-800"}`}
              >
                6M
              </button>
              <button
                onClick={() => setTimeframe("1y")}
                className={`px-2 py-1 text-xs rounded ${timeframe === "1y" ? "bg-[#3F51FF] text-white" : "bg-gray-800"}`}
              >
                1Y
              </button>
              <button
                onClick={() => setTimeframe("all")}
                className={`px-2 py-1 text-xs rounded ${timeframe === "all" ? "bg-[#3F51FF] text-white" : "bg-gray-800"}`}
              >
                ALL
              </button>
            </div>
          </div>
          
          <Card className="bg-black/20 border-gray-800">
            <CardContent className="pt-6">
              <div className="h-[300px]">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="animate-spin w-8 h-8 border-4 border-[#3F51FF] border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={MOCK_BTC_PRICE_DATA.slice(-12)}>
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3F51FF" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3F51FF" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#888" 
                        tick={{fill: '#888'}}
                      />
                      <YAxis 
                        stroke="#888" 
                        tick={{fill: '#888'}}
                        tickFormatter={(value) => `$${(value / 1000)}k`}
                        domain={['dataMin - 5000', 'dataMax + 5000']}
                      />
                      <Tooltip 
                        formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Price']}
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#3F51FF" 
                        fillOpacity={1}
                        fill="url(#colorPrice)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
              
              <div className="grid grid-cols-4 gap-4 mt-6">
                <div className="bg-black/40 p-3 rounded-lg">
                  <p className="text-xs text-gray-400">Current Price</p>
                  <p className="text-xl font-bold">${MOCK_BTC_PRICE_DATA[MOCK_BTC_PRICE_DATA.length - 1].price.toLocaleString()}</p>
                </div>
                <div className="bg-black/40 p-3 rounded-lg">
                  <p className="text-xs text-gray-400">All Time High</p>
                  <p className="text-xl font-bold">$103,000</p>
                </div>
                <div className="bg-black/40 p-3 rounded-lg">
                  <p className="text-xs text-gray-400">30d Change</p>
                  <p className="text-xl font-bold text-green-500">+21.2%</p>
                </div>
                <div className="bg-black/40 p-3 rounded-lg">
                  <p className="text-xs text-gray-400">Market Cap</p>
                  <p className="text-xl font-bold">$1.98T</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-black/20 border-gray-800">
              <CardHeader>
                <CardTitle>Trading Volume</CardTitle>
                <CardDescription>24h trading volume in billions USD</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={MOCK_TRADING_VOLUME.slice(-6)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="date" stroke="#888" tick={{fill: '#888'}} />
                      <YAxis stroke="#888" tick={{fill: '#888'}} />
                      <Tooltip 
                        formatter={(value) => [`$${value}B`, 'Volume']}
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      <Bar dataKey="volume" fill="#3F51FF" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/20 border-gray-800">
              <CardHeader>
                <CardTitle>Market Sentiment</CardTitle>
                <CardDescription>Fear & Greed Index and market sentiment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-6">
                  <div className="relative w-32 h-32">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-3xl font-bold">{MOCK_MARKET_SENTIMENT.fearGreedIndex}</div>
                      <div className="text-xs mt-6">{MOCK_MARKET_SENTIMENT.fearGreedLabel}</div>
                    </div>
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="#222"
                        strokeWidth="16"
                        fill="transparent"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke={MOCK_MARKET_SENTIMENT.fearGreedIndex > 50 ? "#10b981" : "#ef4444"}
                        strokeWidth="16"
                        fill="transparent"
                        strokeDasharray="351.86"
                        strokeDashoffset={351.86 - (351.86 * MOCK_MARKET_SENTIMENT.fearGreedIndex) / 100}
                      />
                    </svg>
                  </div>
                  
                  <div className="space-y-4 flex-1">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Bullish</span>
                        <span>{MOCK_MARKET_SENTIMENT.bullishPercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500"
                          style={{ width: `${MOCK_MARKET_SENTIMENT.bullishPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Bearish</span>
                        <span>{MOCK_MARKET_SENTIMENT.bearishPercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-red-500"
                          style={{ width: `${MOCK_MARKET_SENTIMENT.bearishPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="indicators" className="mt-4 space-y-4">
          <Card className="bg-black/20 border-gray-800">
            <CardHeader>
              <CardTitle>Technical Indicators</CardTitle>
              <CardDescription>Aggregated signals from 26 technical indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-900/20 border border-green-900 rounded p-3">
                  <div className="text-center">
                    <div className="text-sm text-green-400">BUY</div>
                    <div className="text-2xl font-bold text-green-400">14</div>
                  </div>
                </div>
                
                <div className="bg-gray-800/60 border border-gray-700 rounded p-3">
                  <div className="text-center">
                    <div className="text-sm text-gray-400">NEUTRAL</div>
                    <div className="text-2xl font-bold text-gray-400">7</div>
                  </div>
                </div>
                
                <div className="bg-red-900/20 border border-red-900 rounded p-3">
                  <div className="text-center">
                    <div className="text-sm text-red-400">SELL</div>
                    <div className="text-2xl font-bold text-red-400">5</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">RSI (14)</span>
                  <span className="text-sm px-2 py-0.5 rounded bg-green-900/20 text-green-400">BUY</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">MACD (12,26,9)</span>
                  <span className="text-sm px-2 py-0.5 rounded bg-green-900/20 text-green-400">BUY</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">MA (50)</span>
                  <span className="text-sm px-2 py-0.5 rounded bg-green-900/20 text-green-400">BUY</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">MA (200)</span>
                  <span className="text-sm px-2 py-0.5 rounded bg-green-900/20 text-green-400">BUY</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Stochastic (14,3,3)</span>
                  <span className="text-sm px-2 py-0.5 rounded bg-gray-800 text-gray-400">NEUTRAL</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Bollinger Bands (20)</span>
                  <span className="text-sm px-2 py-0.5 rounded bg-red-900/20 text-red-400">SELL</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="on-chain" className="mt-4 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-black/20 border-gray-800">
              <CardHeader>
                <CardTitle>Network Health</CardTitle>
                <CardDescription>Key metrics about blockchain network status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Hash Rate</span>
                    <span className="font-mono">{MOCK_ON_CHAIN_METRICS.hashRate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Addresses (24h)</span>
                    <span className="font-mono">{MOCK_ON_CHAIN_METRICS.activeAddresses.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Mempool Size</span>
                    <span className="font-mono">{MOCK_ON_CHAIN_METRICS.mempool.toLocaleString()} txs</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Avg. Transaction Value</span>
                    <span className="font-mono">${MOCK_ON_CHAIN_METRICS.averageTransactionValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Blockchain Size</span>
                    <span className="font-mono">{MOCK_ON_CHAIN_METRICS.blockchainSize}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Next Difficulty Adjustment</span>
                    <span className="font-mono text-green-500">{MOCK_ON_CHAIN_METRICS.nextDifficulty}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/20 border-gray-800">
              <CardHeader>
                <CardTitle>Market Health</CardTitle>
                <CardDescription>Liquidity and market depth metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Market Cap</span>
                    <span className="font-mono">${MOCK_MARKET_SENTIMENT.marketCap}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Value Locked (DeFi)</span>
                    <span className="font-mono">${MOCK_MARKET_SENTIMENT.totalValueLocked}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Avg. Transaction Fee</span>
                    <span className="font-mono">{MOCK_MARKET_SENTIMENT.averageFees}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">F&G Index</span>
                    <span className="font-mono">{MOCK_MARKET_SENTIMENT.fearGreedIndex} ({MOCK_MARKET_SENTIMENT.fearGreedLabel})</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">BTC Dominance</span>
                    <span className="font-mono">53.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Exchange Net Flow</span>
                    <span className="font-mono text-red-500">-2,145 BTC</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="halving" className="mt-4 space-y-4">
          <Card className="bg-black/20 border-gray-800">
            <CardHeader>
              <CardTitle>Bitcoin Halving Cycle Analysis</CardTitle>
              <CardDescription>Historical and projected impact of Bitcoin halving events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="py-2 px-3 text-left">Halving Event</th>
                        <th className="py-2 px-3 text-right">Date</th>
                        <th className="py-2 px-3 text-right">Price</th>
                        <th className="py-2 px-3 text-right">Block Reward</th>
                        <th className="py-2 px-3 text-right">Peak After</th>
                        <th className="py-2 px-3 text-right">% Gain</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-800">
                        <td className="py-2 px-3">1st Halving</td>
                        <td className="py-2 px-3 text-right">Nov 28, 2012</td>
                        <td className="py-2 px-3 text-right">$12.50</td>
                        <td className="py-2 px-3 text-right">25 BTC</td>
                        <td className="py-2 px-3 text-right">$1,178</td>
                        <td className="py-2 px-3 text-right text-green-500">+9,320%</td>
                      </tr>
                      <tr className="border-b border-gray-800">
                        <td className="py-2 px-3">2nd Halving</td>
                        <td className="py-2 px-3 text-right">Jul 9, 2016</td>
                        <td className="py-2 px-3 text-right">$650</td>
                        <td className="py-2 px-3 text-right">12.5 BTC</td>
                        <td className="py-2 px-3 text-right">$19,783</td>
                        <td className="py-2 px-3 text-right text-green-500">+2,943%</td>
                      </tr>
                      <tr className="border-b border-gray-800">
                        <td className="py-2 px-3">3rd Halving</td>
                        <td className="py-2 px-3 text-right">May 11, 2020</td>
                        <td className="py-2 px-3 text-right">$8,800</td>
                        <td className="py-2 px-3 text-right">6.25 BTC</td>
                        <td className="py-2 px-3 text-right">$69,044</td>
                        <td className="py-2 px-3 text-right text-green-500">+685%</td>
                      </tr>
                      <tr className="border-b border-gray-800">
                        <td className="py-2 px-3">4th Halving</td>
                        <td className="py-2 px-3 text-right">Apr 20, 2024</td>
                        <td className="py-2 px-3 text-right">$65,000</td>
                        <td className="py-2 px-3 text-right">3.125 BTC</td>
                        <td className="py-2 px-3 text-right">?</td>
                        <td className="py-2 px-3 text-right">?</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3">5th Halving (Est.)</td>
                        <td className="py-2 px-3 text-right">Apr 13, 2028</td>
                        <td className="py-2 px-3 text-right">?</td>
                        <td className="py-2 px-3 text-right">1.5625 BTC</td>
                        <td className="py-2 px-3 text-right">?</td>
                        <td className="py-2 px-3 text-right">?</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="bg-black/30 rounded-lg p-4">
                  <h4 className="text-sm font-medium mb-2">Halving Cycle Insights</h4>
                  <p className="text-sm text-gray-400">
                    Each Bitcoin halving reduces the emission rate of new bitcoins, creating a supply shock.
                    Historically, halvings have preceded major bull runs, though with diminishing returns.
                    The current cycle (post-4th halving) has a maximum projected ceiling around $250,000-$350,000
                    based on previous patterns, but past performance is not indicative of future results.
                  </p>
                </div>
                
                <div className="flex items-center justify-between bg-[#3F51FF]/10 rounded-lg p-4">
                  <div>
                    <h4 className="text-sm font-medium text-[#3F51FF]">Next Halving Countdown</h4>
                    <p className="text-sm text-gray-400">Estimated: April 13, 2028</p>
                  </div>
                  <div className="text-xl font-bold font-mono">1,070 days</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}