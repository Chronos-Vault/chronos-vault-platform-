import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlockchainType } from '@/contexts/multi-chain-context';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Loader2, TrendingUp, TrendingDown, AlertTriangle, Zap, Shield, DollarSign, Clock, ArrowRight } from "lucide-react";
import CrossChainMetricsService from '@/services/cross-chain-metrics-service';
import CrossChainOperationsService, { BlockchainMetrics } from '@/services/cross-chain-operations-service';

// Interface for historical metrics data point
interface HistoricalMetricsDataPoint {
  timestamp: string;
  ethereum: number;
  solana: number;
  ton: number;
  bitcoin: number;
}

// Interface for operation metrics
interface OperationMetrics {
  operationType: string;
  count: number;
  successRate: number;
  avgCompletionTime: number;
  avgFee: number;
}

// Interface for chain comparison metrics
interface ChainComparisonMetrics {
  name: string;
  transactionSpeed: number;
  cost: number;
  security: number;
  popularity: number;
}

// Interface for fee history data point
interface FeeHistoryDataPoint {
  date: string;
  ethereum: number;
  solana: number;
  ton: number;
  bitcoin: number;
}

// Interface for analytics service
interface AnalyticsService {
  isLoading: boolean;
  historicalPerformanceData: HistoricalMetricsDataPoint[];
  operationMetrics: OperationMetrics[];
  chainComparisonData: ChainComparisonMetrics[];
  feeHistoryData: FeeHistoryDataPoint[];
  securityScoresByChain: { name: string; value: number; color: string }[];
  transactionVolumeData: { name: string; value: number; color: string }[];
  // Add more as needed
}

// Sample colors for charts
const COLORS = ['#6B00D7', '#FF5AF7', '#FFB800', '#0095FF', '#00D084', '#FF6B6B'];

const CrossChainAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('performance');
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [analyticsService, setAnalyticsService] = useState<AnalyticsService>({
    isLoading: true,
    historicalPerformanceData: [],
    operationMetrics: [],
    chainComparisonData: [],
    feeHistoryData: [],
    securityScoresByChain: [],
    transactionVolumeData: []
  });
  
  // Service references
  const metricsService = CrossChainMetricsService.getInstance();
  const operationsService = CrossChainOperationsService.getInstance();
  
  useEffect(() => {
    const loadAnalyticsData = async () => {
      try {
        // Load all analytics data
        const blockchainMetrics = await operationsService.getBlockchainMetrics();
        
        // Generate sample historical performance data
        const historicalData = generateHistoricalPerformanceData();
        
        // Generate sample operation metrics
        const opMetrics = generateOperationMetrics();
        
        // Generate chain comparison data
        const chainComparison = generateChainComparisonData(blockchainMetrics);
        
        // Generate fee history data
        const feeHistory = generateFeeHistoryData();
        
        // Generate security scores by chain
        const securityScores = generateSecurityScoresByChain(blockchainMetrics);
        
        // Generate transaction volume data
        const txVolume = generateTransactionVolumeData();
        
        // Update state with all loaded data
        setAnalyticsService({
          isLoading: false,
          historicalPerformanceData: historicalData,
          operationMetrics: opMetrics,
          chainComparisonData: chainComparison,
          feeHistoryData: feeHistory,
          securityScoresByChain: securityScores,
          transactionVolumeData: txVolume
        });
      } catch (error) {
        console.error('Error loading analytics data:', error);
        // In a real app, we would handle this error and display it to the user
      }
    };
    
    loadAnalyticsData();
  }, []);
  
  // Helper function to generate historical performance data
  const generateHistoricalPerformanceData = (): HistoricalMetricsDataPoint[] => {
    const data: HistoricalMetricsDataPoint[] = [];
    const now = new Date();
    
    // Generate data for the last 30 days
    for (let i = 30; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      data.push({
        timestamp: date.toISOString().split('T')[0],
        ethereum: 85 + Math.random() * 10, // 85-95 range
        solana: 90 + Math.random() * 8, // 90-98 range
        ton: 88 + Math.random() * 7, // 88-95 range
        bitcoin: 92 + Math.random() * 5 // 92-97 range
      });
    }
    
    return data;
  };
  
  // Helper function to generate operation metrics
  const generateOperationMetrics = (): OperationMetrics[] => {
    return [
      {
        operationType: 'Transfer',
        count: 156,
        successRate: 98.7,
        avgCompletionTime: 8.3,
        avgFee: 0.0045
      },
      {
        operationType: 'Swap',
        count: 83,
        successRate: 96.4,
        avgCompletionTime: 12.6,
        avgFee: 0.008
      },
      {
        operationType: 'Bridge',
        count: 42,
        successRate: 95.2,
        avgCompletionTime: 18.9,
        avgFee: 0.012
      }
    ];
  };
  
  // Helper function to generate chain comparison data
  const generateChainComparisonData = (blockchainMetrics: BlockchainMetrics): ChainComparisonMetrics[] => {
    return [
      {
        name: 'Ethereum',
        transactionSpeed: calculateNormalizedSpeed(blockchainMetrics[BlockchainType.ETHEREUM].blockTime),
        cost: calculateNormalizedCost(blockchainMetrics[BlockchainType.ETHEREUM].transactionFee),
        security: blockchainMetrics[BlockchainType.ETHEREUM].securityScore,
        popularity: 85
      },
      {
        name: 'Solana',
        transactionSpeed: calculateNormalizedSpeed(blockchainMetrics[BlockchainType.SOLANA].blockTime),
        cost: calculateNormalizedCost(blockchainMetrics[BlockchainType.SOLANA].transactionFee),
        security: blockchainMetrics[BlockchainType.SOLANA].securityScore,
        popularity: 72
      },
      {
        name: 'TON',
        transactionSpeed: calculateNormalizedSpeed(blockchainMetrics[BlockchainType.TON].blockTime),
        cost: calculateNormalizedCost(blockchainMetrics[BlockchainType.TON].transactionFee),
        security: blockchainMetrics[BlockchainType.TON].securityScore,
        popularity: 68
      },
      {
        name: 'Bitcoin',
        transactionSpeed: calculateNormalizedSpeed(blockchainMetrics[BlockchainType.BITCOIN].blockTime),
        cost: calculateNormalizedCost(blockchainMetrics[BlockchainType.BITCOIN].transactionFee),
        security: blockchainMetrics[BlockchainType.BITCOIN].securityScore,
        popularity: 90
      }
    ];
  };
  
  // Helper function to normalize speed scores (lower block times are better)
  const calculateNormalizedSpeed = (blockTime: number): number => {
    // Inverse relationship - lower block times should result in higher scores
    // Using a log scale to handle the wide range of block times
    // Normalizing to a 0-100 scale where 100 is instantaneous and 0 is very slow
    
    // For reference:
    // Bitcoin: ~600 seconds
    // Ethereum: ~12 seconds
    // Solana: ~0.4 seconds
    // TON: ~5 seconds
    
    if (blockTime <= 0) return 100; // Safety check
    
    // Calculate score where smaller block times result in higher scores
    const maxBlockTime = 600; // Bitcoin's block time as reference
    const score = 100 - (Math.log(blockTime + 1) / Math.log(maxBlockTime + 1)) * 100;
    return Math.max(Math.min(score, 100), 0); // Ensure score is between 0-100
  };
  
  // Helper function to normalize cost scores (lower fees are better)
  const calculateNormalizedCost = (fee: number): number => {
    // Inverse relationship - lower fees should result in higher scores
    // Normalizing to a 0-100 scale where 100 is free and 0 is expensive
    
    // For reference:
    // Ethereum: ~0.002 ETH
    // Solana: ~0.0002 SOL
    // TON: ~0.0008 TON
    // Bitcoin: ~0.0004 BTC
    
    if (fee <= 0) return 100; // Safety check
    
    // Calculate score where smaller fees result in higher scores
    const maxFee = 0.01; // Reference point for max fee
    const score = 100 - (fee / maxFee) * 100;
    return Math.max(Math.min(score, 100), 0); // Ensure score is between 0-100
  };
  
  // Helper function to generate fee history data
  const generateFeeHistoryData = (): FeeHistoryDataPoint[] => {
    const data: FeeHistoryDataPoint[] = [];
    const now = new Date();
    
    // Generate data for the last 30 days
    for (let i = 30; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Simulate some fee fluctuations based on market conditions
      const dayOfMonth = date.getDate();
      const marketFactor = 1 + Math.sin(dayOfMonth / 5) * 0.2; // Fluctuation factor
      
      data.push({
        date: date.toISOString().split('T')[0],
        ethereum: 0.002 * marketFactor * (1 + Math.random() * 0.1),
        solana: 0.0002 * marketFactor * (1 + Math.random() * 0.1),
        ton: 0.0008 * marketFactor * (1 + Math.random() * 0.1),
        bitcoin: 0.0004 * marketFactor * (1 + Math.random() * 0.1)
      });
    }
    
    return data;
  };
  
  // Helper function to generate security scores by chain
  const generateSecurityScoresByChain = (blockchainMetrics: BlockchainMetrics): { name: string; value: number; color: string }[] => {
    return [
      { 
        name: 'Ethereum', 
        value: blockchainMetrics[BlockchainType.ETHEREUM].securityScore,
        color: '#6B00D7'
      },
      { 
        name: 'Solana', 
        value: blockchainMetrics[BlockchainType.SOLANA].securityScore,
        color: '#FF5AF7'
      },
      { 
        name: 'TON', 
        value: blockchainMetrics[BlockchainType.TON].securityScore,
        color: '#FFB800'
      },
      { 
        name: 'Bitcoin', 
        value: blockchainMetrics[BlockchainType.BITCOIN].securityScore,
        color: '#0095FF'
      }
    ];
  };
  
  // Helper function to generate transaction volume data
  const generateTransactionVolumeData = (): { name: string; value: number; color: string }[] => {
    return [
      { name: 'Ethereum', value: 42, color: '#6B00D7' },
      { name: 'Solana', value: 28, color: '#FF5AF7' },
      { name: 'TON', value: 18, color: '#FFB800' },
      { name: 'Bitcoin', value: 12, color: '#0095FF' }
    ];
  };
  
  // Component for Performance tab
  const PerformanceTab = () => (
    <div className="space-y-8">
      {/* Performance overview */}
      <Card className="bg-[#1A1A1A] border-[#333] shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">Performance Overview</CardTitle>
          <CardDescription className="text-gray-400">
            Cross-chain performance metrics over time
          </CardDescription>
          
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-sm text-gray-400">Period:</span>
            <div className="flex rounded-md overflow-hidden border border-[#333]">
              <button 
                className={`px-3 py-1 text-xs ${selectedPeriod === '7d' ? 'bg-[#6B00D7] text-white' : 'bg-[#242424] text-gray-300'}`}
                onClick={() => setSelectedPeriod('7d')}
              >
                7D
              </button>
              <button 
                className={`px-3 py-1 text-xs ${selectedPeriod === '30d' ? 'bg-[#6B00D7] text-white' : 'bg-[#242424] text-gray-300'}`}
                onClick={() => setSelectedPeriod('30d')}
              >
                30D
              </button>
              <button 
                className={`px-3 py-1 text-xs ${selectedPeriod === '90d' ? 'bg-[#6B00D7] text-white' : 'bg-[#242424] text-gray-300'}`}
                onClick={() => setSelectedPeriod('90d')}
              >
                90D
              </button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {analyticsService.isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 text-[#6B00D7] animate-spin" />
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={
                    selectedPeriod === '7d' 
                      ? analyticsService.historicalPerformanceData.slice(-7) 
                      : selectedPeriod === '30d' 
                        ? analyticsService.historicalPerformanceData 
                        : analyticsService.historicalPerformanceData
                  }
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis 
                    dataKey="timestamp" 
                    stroke="#999" 
                    tick={{ fill: '#999' }}
                  />
                  <YAxis 
                    stroke="#999" 
                    tick={{ fill: '#999' }}
                    domain={[80, 100]}
                    label={{ 
                      value: 'Performance Score', 
                      angle: -90, 
                      position: 'insideLeft',
                      fill: '#999'
                    }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#242424', 
                      border: '1px solid #333',
                      color: '#fff'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="ethereum" 
                    stroke="#6B00D7" 
                    activeDot={{ r: 8 }}
                    name="Ethereum"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="solana" 
                    stroke="#FF5AF7" 
                    activeDot={{ r: 8 }}
                    name="Solana"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="ton" 
                    stroke="#FFB800" 
                    activeDot={{ r: 8 }}
                    name="TON"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="bitcoin" 
                    stroke="#0095FF" 
                    activeDot={{ r: 8 }}
                    name="Bitcoin"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Operation metrics */}
      <Card className="bg-[#1A1A1A] border-[#333] shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">Operation Metrics</CardTitle>
          <CardDescription className="text-gray-400">
            Performance metrics by operation type
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {analyticsService.isLoading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 text-[#6B00D7] animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#333]">
                    <th className="px-4 py-3 text-left text-gray-400">Operation Type</th>
                    <th className="px-4 py-3 text-left text-gray-400">Count</th>
                    <th className="px-4 py-3 text-left text-gray-400">Success Rate</th>
                    <th className="px-4 py-3 text-left text-gray-400">Avg. Completion Time</th>
                    <th className="px-4 py-3 text-left text-gray-400">Avg. Fee</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsService.operationMetrics.map((metric, index) => (
                    <tr key={index} className="border-b border-[#333]">
                      <td className="px-4 py-3 text-white">{metric.operationType}</td>
                      <td className="px-4 py-3 text-white">{metric.count}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <span className={`${
                            metric.successRate >= 98 
                              ? 'text-green-400' 
                              : metric.successRate >= 95 
                                ? 'text-yellow-400' 
                                : 'text-red-400'
                          }`}>
                            {metric.successRate}%
                          </span>
                          {metric.successRate >= 98 ? (
                            <TrendingUp className="h-4 w-4 ml-2 text-green-400" />
                          ) : metric.successRate >= 95 ? (
                            <AlertTriangle className="h-4 w-4 ml-2 text-yellow-400" />
                          ) : (
                            <TrendingDown className="h-4 w-4 ml-2 text-red-400" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-white">{metric.avgCompletionTime} mins</td>
                      <td className="px-4 py-3 text-white">${metric.avgFee.toFixed(4)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Chain comparison */}
      <Card className="bg-[#1A1A1A] border-[#333] shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">Chain Comparison</CardTitle>
          <CardDescription className="text-gray-400">
            Performance comparison across different blockchains
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {analyticsService.isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 text-[#6B00D7] animate-spin" />
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analyticsService.chainComparisonData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#999"
                    tick={{ fill: '#999' }}
                  />
                  <YAxis 
                    stroke="#999"
                    tick={{ fill: '#999' }}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#242424', 
                      border: '1px solid #333',
                      color: '#fff'
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="transactionSpeed" 
                    name="Speed" 
                    fill="#6B00D7"
                  />
                  <Bar 
                    dataKey="cost" 
                    name="Cost Efficiency" 
                    fill="#FF5AF7"
                  />
                  <Bar 
                    dataKey="security" 
                    name="Security" 
                    fill="#FFB800"
                  />
                  <Bar 
                    dataKey="popularity" 
                    name="Popularity" 
                    fill="#0095FF"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
  
  // Component for Cost Analysis tab
  const CostAnalysisTab = () => (
    <div className="space-y-8">
      {/* Fee trends */}
      <Card className="bg-[#1A1A1A] border-[#333] shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">Fee Trends</CardTitle>
          <CardDescription className="text-gray-400">
            Historical transaction fee data across blockchains
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {analyticsService.isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 text-[#6B00D7] animate-spin" />
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={analyticsService.feeHistoryData.slice(-30)} // Last 30 days
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorEthereum" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6B00D7" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6B00D7" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorSolana" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF5AF7" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#FF5AF7" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorTon" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFB800" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#FFB800" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorBitcoin" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0095FF" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0095FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    stroke="#999"
                    tick={{ fill: '#999' }}
                  />
                  <YAxis 
                    stroke="#999"
                    tick={{ fill: '#999' }}
                    label={{ 
                      value: 'Transaction Fee (USD)', 
                      angle: -90, 
                      position: 'insideLeft',
                      fill: '#999'
                    }}
                  />
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#242424', 
                      border: '1px solid #333',
                      color: '#fff'
                    }}
                    formatter={(value) => ['$' + Number(value).toFixed(6), '']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="ethereum" 
                    stroke="#6B00D7" 
                    fillOpacity={1} 
                    fill="url(#colorEthereum)"
                    name="Ethereum"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="solana" 
                    stroke="#FF5AF7" 
                    fillOpacity={1} 
                    fill="url(#colorSolana)"
                    name="Solana"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="ton" 
                    stroke="#FFB800" 
                    fillOpacity={1} 
                    fill="url(#colorTon)"
                    name="TON"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="bitcoin" 
                    stroke="#0095FF" 
                    fillOpacity={1} 
                    fill="url(#colorBitcoin)"
                    name="Bitcoin"
                  />
                  <Legend />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Cost comparison cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[#1A1A1A] border-[#333] shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white">Transaction Volume Distribution</CardTitle>
            <CardDescription className="text-gray-400">
              Volume distribution across blockchains
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {analyticsService.isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 text-[#6B00D7] animate-spin" />
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsService.transactionVolumeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {analyticsService.transactionVolumeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: '#242424', 
                        border: '1px solid #333',
                        color: '#fff'
                      }}
                      formatter={(value) => [`${value}%`, 'Volume']}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-[#1A1A1A] border-[#333] shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white">Cost Optimization Opportunities</CardTitle>
            <CardDescription className="text-gray-400">
              Opportunities to reduce cross-chain operation costs
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-[#242424] rounded-lg flex items-start">
                <div className="bg-[#6B00D7]/20 p-2 rounded-full mr-4">
                  <DollarSign className="h-6 w-6 text-[#6B00D7]" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Use Solana for high-frequency transfers</h3>
                  <p className="text-gray-400 text-sm">Ethereum fees are currently 10x higher than Solana. Moving small-value, high-frequency transfers to Solana could reduce costs by up to 90%.</p>
                </div>
              </div>
              
              <div className="p-4 bg-[#242424] rounded-lg flex items-start">
                <div className="bg-[#FF5AF7]/20 p-2 rounded-full mr-4">
                  <Clock className="h-6 w-6 text-[#FF5AF7]" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Schedule Bitcoin operations during low-fee periods</h3>
                  <p className="text-gray-400 text-sm">Bitcoin fees vary significantly by time of day. Scheduling operations during off-peak hours (04:00-09:00 UTC) could save 30-40% on fees.</p>
                </div>
              </div>
              
              <div className="p-4 bg-[#242424] rounded-lg flex items-start">
                <div className="bg-[#FFB800]/20 p-2 rounded-full mr-4">
                  <Zap className="h-6 w-6 text-[#FFB800]" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Batch multiple transfers together</h3>
                  <p className="text-gray-400 text-sm">Batching multiple transfers into a single transaction can reduce overall costs by up to 60% on Ethereum and Bitcoin.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
  
  // Component for Security Analysis tab
  const SecurityAnalysisTab = () => (
    <div className="space-y-8">
      {/* Security scores */}
      <Card className="bg-[#1A1A1A] border-[#333] shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">Security Scores by Chain</CardTitle>
          <CardDescription className="text-gray-400">
            Comprehensive security analysis across blockchains
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {analyticsService.isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 text-[#6B00D7] animate-spin" />
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analyticsService.securityScoresByChain}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#999"
                    tick={{ fill: '#999' }}
                  />
                  <YAxis 
                    stroke="#999"
                    tick={{ fill: '#999' }}
                    domain={[0, 100]}
                    label={{ 
                      value: 'Security Score', 
                      angle: -90, 
                      position: 'insideLeft',
                      fill: '#999'
                    }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#242424', 
                      border: '1px solid #333',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="value" name="Security Score">
                    {analyticsService.securityScoresByChain.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Security recommendations */}
      <Card className="bg-[#1A1A1A] border-[#333] shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">Security Recommendations</CardTitle>
          <CardDescription className="text-gray-400">
            Personalized security enhancements for your cross-chain operations
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            <div className="border border-[#333] rounded-lg overflow-hidden">
              <div className="flex items-center justify-between bg-[#242424] p-4">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-[#6B00D7] mr-2" />
                  <h3 className="text-white font-medium">High-Value Transaction Security</h3>
                </div>
                <div className="text-sm px-3 py-1 rounded-full bg-[#6B00D7]/20 text-[#FF5AF7]">
                  High Priority
                </div>
              </div>
              <div className="p-4 space-y-3">
                <p className="text-gray-300">For transactions over $10,000 equivalent value, enable the following enhanced security measures:</p>
                <ul className="list-disc list-inside text-gray-400 space-y-1">
                  <li>Multi-signature verification (currently used for only 22% of high-value transactions)</li>
                  <li>Secondary chain verification through Triple-Chain Security Architecture</li>
                  <li>72-hour time-lock with override capabilities</li>
                </ul>
                <div className="pt-2">
                  <button className="text-[#FF5AF7] hover:text-[#FF5AF7]/80 text-sm font-medium flex items-center">
                    Configure Security Settings <ArrowRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="border border-[#333] rounded-lg overflow-hidden">
              <div className="flex items-center justify-between bg-[#242424] p-4">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-[#FFB800] mr-2" />
                  <h3 className="text-white font-medium">Chain-Specific Security Optimizations</h3>
                </div>
                <div className="text-sm px-3 py-1 rounded-full bg-[#FFB800]/20 text-[#FFB800]">
                  Medium Priority
                </div>
              </div>
              <div className="p-4 space-y-3">
                <p className="text-gray-300">Based on your transaction patterns, consider these chain-specific security optimizations:</p>
                <ul className="list-disc list-inside text-gray-400 space-y-1">
                  <li>Ethereum: Implement EIP-1559 fee strategies for more reliable transaction confirmations</li>
                  <li>Solana: Increase commitment level to 'finalized' for sensitive transactions</li>
                  <li>TON: Enable witness signatures for large transfers</li>
                  <li>Bitcoin: Use native SegWit (Bech32) addresses for enhanced security and lower fees</li>
                </ul>
                <div className="pt-2">
                  <button className="text-[#FFB800] hover:text-[#FFB800]/80 text-sm font-medium flex items-center">
                    Review Chain Settings <ArrowRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="border border-[#333] rounded-lg overflow-hidden">
              <div className="flex items-center justify-between bg-[#242424] p-4">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-[#0095FF] mr-2" />
                  <h3 className="text-white font-medium">Security Notification Enhancements</h3>
                </div>
                <div className="text-sm px-3 py-1 rounded-full bg-[#0095FF]/20 text-[#0095FF]">
                  Recommended
                </div>
              </div>
              <div className="p-4 space-y-3">
                <p className="text-gray-300">Your security notification settings could be improved:</p>
                <ul className="list-disc list-inside text-gray-400 space-y-1">
                  <li>Enable push notifications for all cross-chain operations</li>
                  <li>Configure email alerts for transfers above $1,000</li>
                  <li>Set up secondary verification for unusual transaction patterns</li>
                </ul>
                <div className="pt-2">
                  <button className="text-[#0095FF] hover:text-[#0095FF]/80 text-sm font-medium flex items-center">
                    Update Notification Settings <ArrowRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  
  // Component for Optimization tab
  const OptimizationTab = () => (
    <div className="space-y-8">
      {/* Optimization opportunities */}
      <Card className="bg-[#1A1A1A] border-[#333] shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">Optimization Recommendations</CardTitle>
          <CardDescription className="text-gray-400">
            Personalized recommendations to improve cross-chain operations
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            <div className="p-4 rounded-lg border border-[#333] bg-gradient-to-r from-[#1A1A1A] to-[#242424]">
              <div className="flex items-start">
                <div className="bg-[#6B00D7]/10 p-3 rounded-full mr-4">
                  <Zap className="h-6 w-6 text-[#6B00D7]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Speed Optimization</h3>
                  <p className="text-gray-400 mb-3">Our AI analysis has detected opportunities to significantly improve transaction speeds across your most frequently used chains.</p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="bg-[#1A1A1A] p-3 rounded-md">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-300">Ethereum → Solana Bridge</span>
                        <span className="text-[#FF5AF7] text-sm">Up to 65% faster</span>
                      </div>
                      <p className="text-xs text-gray-400">By using the optimized bridge path through our high-throughput relay network, you can reduce Ethereum to Solana transfer times from ~21 min to ~7 min.</p>
                    </div>
                    
                    <div className="bg-[#1A1A1A] p-3 rounded-md">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-300">TON Transaction Finality</span>
                        <span className="text-[#FF5AF7] text-sm">Up to 40% faster</span>
                      </div>
                      <p className="text-xs text-gray-400">By increasing gas allocation by just 15%, you can achieve significantly faster finality for TON operations while maintaining cost efficiency.</p>
                    </div>
                  </div>
                  
                  <button className="bg-[#6B00D7] hover:bg-[#6B00D7]/90 text-white px-4 py-2 rounded-md text-sm font-medium w-full">
                    Apply Speed Optimizations
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-lg border border-[#333] bg-gradient-to-r from-[#1A1A1A] to-[#242424]">
              <div className="flex items-start">
                <div className="bg-[#FF5AF7]/10 p-3 rounded-full mr-4">
                  <DollarSign className="h-6 w-6 text-[#FF5AF7]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Cost Optimization</h3>
                  <p className="text-gray-400 mb-3">Based on your transaction patterns, we've identified opportunities to reduce fees by optimizing your cross-chain strategy.</p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="bg-[#1A1A1A] p-3 rounded-md">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-300">Transaction Batching</span>
                        <span className="text-[#6B00D7] text-sm">Save up to 45%</span>
                      </div>
                      <p className="text-xs text-gray-400">For your recurring Ethereum transfers, batching 5-8 transactions together could save approximately 45% on total gas fees.</p>
                    </div>
                    
                    <div className="bg-[#1A1A1A] p-3 rounded-md">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-300">Solana Fee Strategy</span>
                        <span className="text-[#6B00D7] text-sm">Save up to 30%</span>
                      </div>
                      <p className="text-xs text-gray-400">Using our dynamic fee calculation for Solana operations can reduce your average transaction cost by ~30% with minimal impact on confirmation times.</p>
                    </div>
                  </div>
                  
                  <button className="bg-[#FF5AF7] hover:bg-[#FF5AF7]/90 text-white px-4 py-2 rounded-md text-sm font-medium w-full">
                    Apply Cost Optimizations
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-lg border border-[#333] bg-gradient-to-r from-[#1A1A1A] to-[#242424]">
              <div className="flex items-start">
                <div className="bg-[#FFB800]/10 p-3 rounded-full mr-4">
                  <Shield className="h-6 w-6 text-[#FFB800]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Security-Efficiency Balance</h3>
                  <p className="text-gray-400 mb-3">Optimizing the balance between security and efficiency based on transaction type and value.</p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="bg-[#1A1A1A] p-3 rounded-md">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-300">Tiered Security Model</span>
                        <span className="text-[#0095FF] text-sm">Balanced optimization</span>
                      </div>
                      <p className="text-xs text-gray-400">Implement a dynamic security tier system that adjusts verification requirements based on transaction value and risk profile.</p>
                    </div>
                  </div>
                  
                  <button className="bg-[#FFB800] hover:bg-[#FFB800]/90 text-white px-4 py-2 rounded-md text-sm font-medium w-full">
                    Configure Security Tiers
                  </button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="performance" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full bg-[#242424] border-b border-[#333] mb-6">
          <TabsTrigger value="performance" className="flex-1 data-[state=active]:bg-[#333] text-gray-300 data-[state=active]:text-white">
            Performance
          </TabsTrigger>
          <TabsTrigger value="cost" className="flex-1 data-[state=active]:bg-[#333] text-gray-300 data-[state=active]:text-white">
            Cost Analysis
          </TabsTrigger>
          <TabsTrigger value="security" className="flex-1 data-[state=active]:bg-[#333] text-gray-300 data-[state=active]:text-white">
            Security Analysis
          </TabsTrigger>
          <TabsTrigger value="optimization" className="flex-1 data-[state=active]:bg-[#333] text-gray-300 data-[state=active]:text-white">
            Optimization
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance">
          <PerformanceTab />
        </TabsContent>
        
        <TabsContent value="cost">
          <CostAnalysisTab />
        </TabsContent>
        
        <TabsContent value="security">
          <SecurityAnalysisTab />
        </TabsContent>
        
        <TabsContent value="optimization">
          <OptimizationTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CrossChainAnalytics;