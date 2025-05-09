import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  Calendar, 
  TrendingUp, 
  BarChart3, 
  PieChart as PieChartIcon,
  Info
} from "lucide-react";

// Types
interface PerformanceData {
  id: string;
  name: string;
  date: string;
  price: number;
  performance: number;
  market: number;
  volume: number;
}

interface AssetMetric {
  name: string;
  value: number;
  color: string;
}

interface ComparisonData {
  name: string;
  strategy: number;
  hodl: number;
  market: number;
}

interface DrawdownData {
  date: string;
  value: number;
}

export interface PerformanceAnalyticsProps {
  assetType?: string;
  strategyType?: string;
  vaultId?: number;
  simulationMode?: boolean;
  onMetricsUpdate?: (metrics: any) => void;
}

// Sample data
const generatePerformanceData = (days: number, volatility: number = 1): PerformanceData[] => {
  const data: PerformanceData[] = [];
  const basePrice = 100;
  let currentPrice = basePrice;
  let marketPrice = basePrice;
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    
    // Generate some random performance that generally trends upward
    const performanceChange = (Math.random() - 0.45) * 5 * volatility;
    const marketChange = (Math.random() - 0.48) * 4 * volatility;
    
    currentPrice = Math.max(currentPrice + performanceChange, 50);
    marketPrice = Math.max(marketPrice + marketChange, 50);
    
    data.push({
      id: `day-${i}`,
      name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      date: date.toISOString(),
      price: parseFloat(currentPrice.toFixed(2)),
      performance: parseFloat(((currentPrice / basePrice - 1) * 100).toFixed(2)),
      market: parseFloat(((marketPrice / basePrice - 1) * 100).toFixed(2)),
      volume: Math.floor(Math.random() * 1000 + 500),
    });
  }
  
  return data;
};

const generateComparisonData = (months: number): ComparisonData[] => {
  const data: ComparisonData[] = [];
  
  for (let i = 0; i < months; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - (months - i - 1));
    
    // Strategy generally outperforms HODL which generally outperforms market
    const strategyPerf = 100 * (1 + (0.05 + Math.random() * 0.15) * (i + 1) / months);
    const hodlPerf = 100 * (1 + (0.03 + Math.random() * 0.10) * (i + 1) / months);
    const marketPerf = 100 * (1 + (0.01 + Math.random() * 0.08) * (i + 1) / months);
    
    data.push({
      name: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      strategy: parseFloat(strategyPerf.toFixed(2)),
      hodl: parseFloat(hodlPerf.toFixed(2)),
      market: parseFloat(marketPerf.toFixed(2)),
    });
  }
  
  return data;
};

const generateDrawdownData = (days: number): DrawdownData[] => {
  const data: DrawdownData[] = [];
  let peak = 100;
  let current = peak;
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    
    // Occasionally create drawdowns
    if (Math.random() > 0.8) {
      current = current * (0.90 + Math.random() * 0.08);
    } else if (Math.random() > 0.6) {
      current = current * (1 + Math.random() * 0.03);
      if (current > peak) peak = current;
    }
    
    const drawdown = ((current / peak) - 1) * 100;
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: parseFloat(drawdown.toFixed(2)),
    });
  }
  
  return data;
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#3F51FF'];

export function PerformanceAnalytics({
  assetType = "BTC",
  strategyType = "diamond_hands",
  vaultId,
  simulationMode = false,
  onMetricsUpdate
}: PerformanceAnalyticsProps) {
  const [timeframe, setTimeframe] = useState("90d");
  const [showBenchmark, setShowBenchmark] = useState(true);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [comparisonData, setComparisonData] = useState<ComparisonData[]>([]);
  const [drawdownData, setDrawdownData] = useState<DrawdownData[]>([]);
  const [assetMetrics, setAssetMetrics] = useState<AssetMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Key performance indicators
  const [kpis, setKpis] = useState({
    totalReturn: 0,
    annualizedReturn: 0,
    sharpeRatio: 0,
    maxDrawdown: 0,
    volatility: 0,
    beta: 0,
    alpha: 0,
    winRate: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      // In a real implementation, we would fetch data from an API
      // For now, we'll generate sample data
      let days = 90;
      let volatility = 1;
      
      switch (timeframe) {
        case "30d":
          days = 30;
          volatility = 1.2;
          break;
        case "90d":
          days = 90;
          volatility = 1;
          break;
        case "180d":
          days = 180;
          volatility = 0.9;
          break;
        case "1y":
          days = 365;
          volatility = 0.8;
          break;
        case "all":
          days = 730;
          volatility = 0.7;
          break;
      }
      
      const perfData = generatePerformanceData(days, volatility);
      const drawData = generateDrawdownData(days);
      const compData = generateComparisonData(Math.max(3, Math.ceil(days / 30)));
      
      setPerformanceData(perfData);
      setDrawdownData(drawData);
      setComparisonData(compData);
      
      // Generate metrics
      const lastPrice = perfData[perfData.length - 1].price;
      const firstPrice = perfData[0].price;
      const totalReturn = ((lastPrice / firstPrice) - 1) * 100;
      const daysInYear = 365;
      const yearsElapsed = days / daysInYear;
      const annualizedReturn = (Math.pow(1 + totalReturn / 100, 1 / yearsElapsed) - 1) * 100;
      
      // Calculate volatility (standard deviation of daily returns)
      const dailyReturns = perfData.slice(1).map((day, i) => 
        (day.price / perfData[i].price) - 1
      );
      const meanReturn = dailyReturns.reduce((sum, ret) => sum + ret, 0) / dailyReturns.length;
      const sqDiffs = dailyReturns.map(ret => Math.pow(ret - meanReturn, 2));
      const variance = sqDiffs.reduce((sum, sqDiff) => sum + sqDiff, 0) / sqDiffs.length;
      const volatility = Math.sqrt(variance) * Math.sqrt(daysInYear) * 100;
      
      // Calculate Sharpe Ratio (assuming risk-free rate of 2%)
      const riskFreeRate = 2;
      const sharpeRatio = (annualizedReturn - riskFreeRate) / volatility;
      
      // Find max drawdown
      const maxDrawdown = Math.min(...drawData.map(d => d.value));
      
      // Calculate beta and alpha
      const marketReturns = perfData.slice(1).map((day, i) => 
        (day.market / 100) - (perfData[i].market / 100)
      );
      
      const marketVariance = marketReturns.reduce((sum, ret) => sum + Math.pow(ret, 2), 0) / marketReturns.length;
      const covariance = dailyReturns.reduce((sum, ret, i) => sum + (ret * marketReturns[i]), 0) / dailyReturns.length;
      const beta = covariance / marketVariance;
      
      // Alpha (Jensen's Alpha)
      const marketReturnTotal = ((perfData[perfData.length - 1].market / 100) - (perfData[0].market / 100)) * 100;
      const expectedReturn = riskFreeRate + beta * (marketReturnTotal - riskFreeRate);
      const alpha = annualizedReturn - expectedReturn;
      
      // Win rate (% of days with positive returns)
      const winDays = dailyReturns.filter(ret => ret > 0).length;
      const winRate = (winDays / dailyReturns.length) * 100;
      
      setKpis({
        totalReturn: parseFloat(totalReturn.toFixed(2)),
        annualizedReturn: parseFloat(annualizedReturn.toFixed(2)),
        sharpeRatio: parseFloat(sharpeRatio.toFixed(2)),
        maxDrawdown: parseFloat(maxDrawdown.toFixed(2)),
        volatility: parseFloat(volatility.toFixed(2)),
        beta: parseFloat(beta.toFixed(2)),
        alpha: parseFloat(alpha.toFixed(2)),
        winRate: parseFloat(winRate.toFixed(2))
      });
      
      // Asset allocation metrics
      if (strategyType === "diamond_hands") {
        setAssetMetrics([
          { name: assetType, value: 100, color: COLORS[0] }
        ]);
      } else {
        // For other strategies, show a mix
        setAssetMetrics([
          { name: assetType, value: 70, color: COLORS[0] },
          { name: "USDT", value: 15, color: COLORS[1] },
          { name: "ETH", value: 10, color: COLORS[2] },
          { name: "Other", value: 5, color: COLORS[3] }
        ]);
      }
      
      setIsLoading(false);
      
      // Callback with metrics if provided
      if (onMetricsUpdate) {
        onMetricsUpdate({
          kpis,
          currentAllocation: assetMetrics,
          performanceTrend: perfData.map(d => ({ date: d.name, value: d.performance }))
        });
      }
    };
    
    fetchData();
  }, [timeframe, assetType, strategyType, vaultId, simulationMode, onMetricsUpdate]);

  const getStrategyName = () => {
    switch (strategyType) {
      case "diamond_hands":
        return "HODL Strategy";
      case "profit_taking":
        return "Profit-Taking";
      case "dca_exit":
        return "DCA Exit";
      case "halvening_cycle":
        return "Halvening Cycle";
      default:
        return "Custom Strategy";
    }
  };

  const renderPerfTrend = () => {
    const positive = performanceData.length > 0 && 
      performanceData[performanceData.length - 1].performance > 0;
      
    const latestPerf = performanceData.length > 0 ? 
      performanceData[performanceData.length - 1].performance : 0;
      
    return (
      <div className="flex flex-col">
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold">
            {latestPerf.toFixed(2)}%
          </span>
          <span className={`text-sm ${positive ? 'text-green-500' : 'text-red-500'} flex items-center`}>
            {positive ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
            {Math.abs(latestPerf - (performanceData.length > 1 ? performanceData[performanceData.length - 2].performance : 0)).toFixed(2)}%
          </span>
        </div>
        <span className="text-xs text-gray-500">Total Return</span>
      </div>
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-700 p-3 rounded shadow-lg">
          <p className="text-gray-400 text-xs mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(2)}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="bg-black/40 border-gray-800 lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-indigo-400" />
                  Performance Analysis
                </CardTitle>
                <CardDescription>
                  {getStrategyName()} for {assetType}
                </CardDescription>
              </div>
              <div className="flex space-x-1 bg-gray-800 rounded-md p-1">
                <Button
                  variant={timeframe === "30d" ? "secondary" : "ghost"}
                  size="sm"
                  className="text-xs h-7 px-2"
                  onClick={() => setTimeframe("30d")}
                >
                  30D
                </Button>
                <Button
                  variant={timeframe === "90d" ? "secondary" : "ghost"}
                  size="sm"
                  className="text-xs h-7 px-2"
                  onClick={() => setTimeframe("90d")}
                >
                  90D
                </Button>
                <Button
                  variant={timeframe === "180d" ? "secondary" : "ghost"}
                  size="sm"
                  className="text-xs h-7 px-2"
                  onClick={() => setTimeframe("180d")}
                >
                  180D
                </Button>
                <Button
                  variant={timeframe === "1y" ? "secondary" : "ghost"}
                  size="sm"
                  className="text-xs h-7 px-2"
                  onClick={() => setTimeframe("1y")}
                >
                  1Y
                </Button>
                <Button
                  variant={timeframe === "all" ? "secondary" : "ghost"}
                  size="sm"
                  className="text-xs h-7 px-2"
                  onClick={() => setTimeframe("all")}
                >
                  All
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {isLoading ? (
                <div className="h-full w-full flex items-center justify-center">
                  <div className="h-8 w-8 border-4 border-t-transparent border-indigo-500 rounded-full animate-spin"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={performanceData}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#9CA3AF"
                      tick={{ fontSize: 12 }}
                      tickLine={{ stroke: '#4B5563' }}
                      axisLine={{ stroke: '#4B5563' }}
                      minTickGap={20}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      tick={{ fontSize: 12 }}
                      tickLine={{ stroke: '#4B5563' }}
                      axisLine={{ stroke: '#4B5563' }}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="performance"
                      name="Strategy"
                      stroke="#3F51FF"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                    {showBenchmark && (
                      <Line
                        type="monotone"
                        dataKey="market"
                        name="Market"
                        stroke="#64748B"
                        strokeWidth={1.5}
                        dot={false}
                        strokeDasharray="4 4"
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Switch 
                id="show-benchmark"
                checked={showBenchmark}
                onCheckedChange={setShowBenchmark}
              />
              <Label htmlFor="show-benchmark">Show Market Comparison</Label>
            </div>
          </CardFooter>
        </Card>

        <Card className="bg-black/40 border-gray-800">
          <CardHeader>
            <CardTitle>Strategy Metrics</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <Label className="text-xs text-gray-500">Total Return</Label>
                  <span className={`font-medium ${kpis.totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {kpis.totalReturn >= 0 ? '+' : ''}{kpis.totalReturn}%
                  </span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${kpis.totalReturn >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min(Math.abs(kpis.totalReturn), 100)}%` }}
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <Label className="text-xs text-gray-500">Ann. Return</Label>
                  <span className={`font-medium ${kpis.annualizedReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {kpis.annualizedReturn >= 0 ? '+' : ''}{kpis.annualizedReturn}%
                  </span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${kpis.annualizedReturn >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min(Math.abs(kpis.annualizedReturn), 100)}%` }}
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <Label className="text-xs text-gray-500">Sharpe Ratio</Label>
                  <span className={`font-medium ${kpis.sharpeRatio >= 1 ? 'text-green-500' : kpis.sharpeRatio >= 0 ? 'text-yellow-500' : 'text-red-500'}`}>
                    {kpis.sharpeRatio.toFixed(2)}
                  </span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      kpis.sharpeRatio >= 1 ? 'bg-green-500' : 
                      kpis.sharpeRatio >= 0 ? 'bg-yellow-500' : 
                      'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(Math.abs(kpis.sharpeRatio) * 25, 100)}%` }}
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <Label className="text-xs text-gray-500">Max Drawdown</Label>
                  <span className="font-medium text-red-500">
                    {kpis.maxDrawdown}%
                  </span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500"
                    style={{ width: `${Math.min(Math.abs(kpis.maxDrawdown), 40) * 2.5}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-500">Volatility</Label>
                  <div className="font-medium">{kpis.volatility}%</div>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Beta</Label>
                  <div className="font-medium">{kpis.beta}</div>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Alpha</Label>
                  <div className={`font-medium ${kpis.alpha >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {kpis.alpha >= 0 ? '+' : ''}{kpis.alpha}%
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Win Rate</Label>
                  <div className="font-medium">{kpis.winRate}%</div>
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              {renderPerfTrend()}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-black/40 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
              Strategy Comparison
            </CardTitle>
            <CardDescription>
              Performance vs. HODL and Market
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              {isLoading ? (
                <div className="h-full w-full flex items-center justify-center">
                  <div className="h-8 w-8 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={comparisonData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#9CA3AF"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar 
                      dataKey="strategy" 
                      name="Strategy" 
                      fill="#3F51FF" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="hodl" 
                      name="HODL" 
                      fill="#8884d8" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="market" 
                      name="Market" 
                      fill="#64748B" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
            
            <div className="pt-4 text-sm text-gray-400">
              <div className="flex items-center">
                <Info className="h-4 w-4 mr-2 text-blue-400" />
                <span>Strategy typically outperforms HODL by leveraging market dynamics</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
              Drawdown Analysis
            </CardTitle>
            <CardDescription>
              Historical price drawdowns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              {isLoading ? (
                <div className="h-full w-full flex items-center justify-center">
                  <div className="h-8 w-8 border-4 border-t-transparent border-amber-500 rounded-full animate-spin"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={drawdownData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                  >
                    <defs>
                      <linearGradient id="colorDrawdown" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF4D4D" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#FF4D4D" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#9CA3AF"
                      tick={{ fontSize: 12 }}
                      minTickGap={30}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${value}%`}
                      domain={['dataMin', 0]}
                    />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#FF4D4D" 
                      fillOpacity={1} 
                      fill="url(#colorDrawdown)" 
                      name="Drawdown"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
            
            <div className="pt-4 text-sm text-gray-400">
              <div className="flex items-center">
                <Info className="h-4 w-4 mr-2 text-amber-500" />
                <span>Max drawdown of {Math.abs(kpis.maxDrawdown)}% occurred during market volatility</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-black/40 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChartIcon className="h-5 w-5 mr-2 text-purple-400" />
              Asset Allocation
            </CardTitle>
            <CardDescription>
              Current portfolio distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] flex items-center justify-center">
              {isLoading ? (
                <div className="h-8 w-8 border-4 border-t-transparent border-purple-500 rounded-full animate-spin"></div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={assetMetrics}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      dataKey="value"
                      nameKey="name"
                      label={(entry) => entry.name}
                    >
                      {assetMetrics.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-green-400" />
              Calendar Performance
            </CardTitle>
            <CardDescription>
              Monthly and quarterly returns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="monthly">
              <TabsList className="bg-gray-800 mb-4 w-full">
                <TabsTrigger value="monthly" className="flex-1">Monthly</TabsTrigger>
                <TabsTrigger value="quarterly" className="flex-1">Quarterly</TabsTrigger>
              </TabsList>
              
              <TabsContent value="monthly" className="h-[200px]">
                {isLoading ? (
                  <div className="h-full w-full flex items-center justify-center">
                    <div className="h-8 w-8 border-4 border-t-transparent border-green-500 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    {Array.from({ length: 12 }).map((_, i) => {
                      const monthName = new Date(0, i).toLocaleString('default', { month: 'short' });
                      const value = (Math.random() * 20 - 5).toFixed(1);
                      const isPositive = parseFloat(value) >= 0;
                      
                      return (
                        <div 
                          key={i}
                          className={`rounded border p-2 text-center ${
                            isPositive 
                              ? 'bg-green-900/20 border-green-900/40' 
                              : 'bg-red-900/20 border-red-900/40'
                          }`}
                        >
                          <div className="text-xs text-gray-400 mb-1">{monthName}</div>
                          <div className={`text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                            {isPositive ? '+' : ''}{value}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="quarterly" className="h-[200px]">
                {isLoading ? (
                  <div className="h-full w-full flex items-center justify-center">
                    <div className="h-8 w-8 border-4 border-t-transparent border-green-500 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {Array.from({ length: 4 }).map((_, i) => {
                      const quarterName = `Q${i + 1}`;
                      const value = (Math.random() * 30 - 10).toFixed(1);
                      const isPositive = parseFloat(value) >= 0;
                      
                      return (
                        <div 
                          key={i}
                          className={`rounded border p-3 ${
                            isPositive 
                              ? 'bg-green-900/20 border-green-900/40' 
                              : 'bg-red-900/20 border-red-900/40'
                          }`}
                        >
                          <div className="text-sm text-gray-400 mb-1">{quarterName}</div>
                          <div className={`text-lg font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                            {isPositive ? '+' : ''}{value}%
                          </div>
                          <div className="text-xs text-gray-500 mt-1">vs Market: {(parseFloat(value) - Math.random() * 15).toFixed(1)}%</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {simulationMode && (
        <div className="rounded-md border border-gray-800 bg-blue-950/10 p-4">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-400 mb-1">Simulation Mode Active</h3>
              <p className="text-xs text-gray-400">
                These performance metrics are based on simulated data to help you visualize 
                potential outcomes. Actual results may vary based on market conditions and 
                specific parameters of your investment discipline vault.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PerformanceAnalytics;