import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Brain,
  TrendingUp,
  AlertTriangle, 
  ShieldCheck, 
  BarChart3, 
  ChevronDown,
  ChevronUp,
  LineChart,
  CandlestickChart,
  Zap,
  Clock,
  LucideGlobe,
  Settings,
  BarChart2,
  Briefcase,
  Coins
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Enum for risk tolerance levels
enum RiskTolerance {
  CONSERVATIVE = 'conservative',
  MODERATE = 'moderate',
  AGGRESSIVE = 'aggressive',
  CUSTOM = 'custom'
}

// Enum for investment strategies
enum InvestmentStrategy {
  VALUE_INVESTING = 'value_investing',
  GROWTH_INVESTING = 'growth_investing',
  MOMENTUM_TRADING = 'momentum_trading',
  DOLLAR_COST_AVERAGING = 'dollar_cost_averaging',
  SWING_TRADING = 'swing_trading',
  CUSTOM = 'custom'
}

// Enum for AI model types
enum AIModelType {
  BALANCED = 'balanced',
  PATTERN_RECOGNITION = 'pattern_recognition',
  TREND_FOLLOWING = 'trend_following',
  SENTIMENT_ANALYSIS = 'sentiment_analysis',
  QUANTUM_PREDICTION = 'quantum_prediction'
}

// Enum for market categories
enum MarketCategory {
  CRYPTO = 'crypto',
  STOCKS = 'stocks',
  FOREX = 'forex',
  COMMODITIES = 'commodities',
  ALL = 'all'
}

const AIAssistedInvestmentVault: React.FC = () => {
  const { toast } = useToast();
  
  // Form state
  const [vaultName, setVaultName] = useState<string>('My AI Investment Vault');
  const [vaultDescription, setVaultDescription] = useState<string>('');
  const [riskTolerance, setRiskTolerance] = useState<RiskTolerance>(RiskTolerance.MODERATE);
  const [investmentStrategy, setInvestmentStrategy] = useState<InvestmentStrategy>(InvestmentStrategy.VALUE_INVESTING);
  const [aiModelType, setAIModelType] = useState<AIModelType>(AIModelType.BALANCED);
  const [marketCategory, setMarketCategory] = useState<MarketCategory>(MarketCategory.CRYPTO);
  
  // Risk settings
  const [maxDrawdown, setMaxDrawdown] = useState<number>(20); // percentage
  const [leverageAllowed, setLeverageAllowed] = useState<boolean>(false);
  const [maxLeverage, setMaxLeverage] = useState<number>(2);
  const [stopLossEnabled, setStopLossEnabled] = useState<boolean>(true);
  const [stopLossPercentage, setStopLossPercentage] = useState<number>(10);
  const [takeProfitEnabled, setTakeProfitEnabled] = useState<boolean>(true);
  const [takeProfitPercentage, setTakeProfitPercentage] = useState<number>(30);
  
  // AI analysis settings
  const [technicalAnalysisWeight, setTechnicalAnalysisWeight] = useState<number>(50);
  const [fundamentalAnalysisWeight, setFundamentalAnalysisWeight] = useState<number>(50);
  const [sentimentAnalysisWeight, setSentimentAnalysisWeight] = useState<number>(0);
  const [macroeconomicFactorsWeight, setMacroeconomicFactorsWeight] = useState<number>(0);
  
  // Asset allocation
  const [maxSingleAssetAllocation, setMaxSingleAssetAllocation] = useState<number>(30); // percentage
  const [rebalancingFrequency, setRebalancingFrequency] = useState<string>("monthly");
  const [enableDynamicRebalancing, setEnableDynamicRebalancing] = useState<boolean>(true);
  
  // Specific assets
  const [selectedAssets, setSelectedAssets] = useState<string[]>([
    'BTC', 'ETH', 'TON', 'SOL', 'ADA'
  ]);
  const [availableAssets, setAvailableAssets] = useState<{id: string, name: string, category: string}[]>([
    {id: 'BTC', name: 'Bitcoin', category: 'crypto'},
    {id: 'ETH', name: 'Ethereum', category: 'crypto'},
    {id: 'TON', name: 'Toncoin', category: 'crypto'},
    {id: 'SOL', name: 'Solana', category: 'crypto'},
    {id: 'ADA', name: 'Cardano', category: 'crypto'},
    {id: 'DOT', name: 'Polkadot', category: 'crypto'},
    {id: 'AVAX', name: 'Avalanche', category: 'crypto'},
    {id: 'LINK', name: 'Chainlink', category: 'crypto'},
    {id: 'AAPL', name: 'Apple Inc.', category: 'stocks'},
    {id: 'MSFT', name: 'Microsoft', category: 'stocks'},
    {id: 'GOOGL', name: 'Alphabet', category: 'stocks'},
    {id: 'AMZN', name: 'Amazon', category: 'stocks'},
    {id: 'TSLA', name: 'Tesla', category: 'stocks'},
    {id: 'EURUSD', name: 'EUR/USD', category: 'forex'},
    {id: 'GBPUSD', name: 'GBP/USD', category: 'forex'},
    {id: 'USDJPY', name: 'USD/JPY', category: 'forex'},
    {id: 'GOLD', name: 'Gold', category: 'commodities'},
    {id: 'SILVER', name: 'Silver', category: 'commodities'},
    {id: 'OIL', name: 'Crude Oil', category: 'commodities'},
  ]);
  
  // Advanced settings
  const [enableNotifications, setEnableNotifications] = useState<boolean>(true);
  const [enableAutomaticTrading, setEnableAutomaticTrading] = useState<boolean>(false);
  const [enableCrossChainOptimization, setEnableCrossChainOptimization] = useState<boolean>(true);
  const [timeHorizon, setTimeHorizon] = useState<string>("long_term");
  const [enableEmergencyStop, setEnableEmergencyStop] = useState<boolean>(true);
  const [emergencyEmail, setEmergencyEmail] = useState<string>('');
  
  // UI state
  const [currentTab, setCurrentTab] = useState<string>('strategy');
  const [filteredAssets, setFilteredAssets] = useState(availableAssets);
  const [assetSearchTerm, setAssetSearchTerm] = useState('');
  const [analysisScore, setAnalysisScore] = useState<number>(0);
  const [deploymentProgress, setDeploymentProgress] = useState<number>(0);
  const [aiTrainingProgress, setAiTrainingProgress] = useState<number>(0);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [vaultId, setVaultId] = useState<string>('');
  
  // Update filtered assets when marketCategory or searchTerm changes
  useEffect(() => {
    let filtered = availableAssets;
    
    // Filter by market category
    if (marketCategory !== MarketCategory.ALL) {
      filtered = filtered.filter(asset => asset.category === marketCategory);
    }
    
    // Filter by search term
    if (assetSearchTerm) {
      filtered = filtered.filter(asset => 
        asset.id.toLowerCase().includes(assetSearchTerm.toLowerCase()) || 
        asset.name.toLowerCase().includes(assetSearchTerm.toLowerCase())
      );
    }
    
    setFilteredAssets(filtered);
  }, [marketCategory, assetSearchTerm, availableAssets]);
  
  // Update technical and fundamental analysis weights to ensure they add up to 100
  useEffect(() => {
    const total = technicalAnalysisWeight + fundamentalAnalysisWeight + 
                  sentimentAnalysisWeight + macroeconomicFactorsWeight;
    
    if (total !== 100) {
      // Adjust values proportionally to add up to 100
      const factor = 100 / total;
      setTechnicalAnalysisWeight(Math.round(technicalAnalysisWeight * factor));
      setFundamentalAnalysisWeight(Math.round(fundamentalAnalysisWeight * factor));
      setSentimentAnalysisWeight(Math.round(sentimentAnalysisWeight * factor));
      setMacroeconomicFactorsWeight(100 - Math.round(technicalAnalysisWeight * factor) - 
                                    Math.round(fundamentalAnalysisWeight * factor) - 
                                    Math.round(sentimentAnalysisWeight * factor));
    }
  }, [technicalAnalysisWeight, fundamentalAnalysisWeight, sentimentAnalysisWeight, macroeconomicFactorsWeight]);
  
  // Update analysis score based on settings
  useEffect(() => {
    let score = 50; // Base score
    
    // Add points for diversification
    if (selectedAssets.length >= 10) score += 15;
    else if (selectedAssets.length >= 5) score += 10;
    else if (selectedAssets.length >= 3) score += 5;
    
    // Add points for risk management
    if (stopLossEnabled) score += 5;
    if (takeProfitEnabled) score += 5;
    if (maxDrawdown < 25) score += 5;
    
    // Add points for AI sophistication
    if (aiModelType === AIModelType.QUANTUM_PREDICTION) score += 10;
    if (technicalAnalysisWeight > 0 && 
        fundamentalAnalysisWeight > 0 && 
        sentimentAnalysisWeight > 0 && 
        macroeconomicFactorsWeight > 0) score += 10;
    
    // Add points for safety features
    if (enableEmergencyStop) score += 5;
    if (emergencyEmail) score += 5;
    if (enableCrossChainOptimization) score += 5;
    
    // Cap at 100
    setAnalysisScore(Math.min(score, 100));
  }, [
    selectedAssets.length,
    stopLossEnabled,
    takeProfitEnabled,
    maxDrawdown,
    aiModelType,
    technicalAnalysisWeight,
    fundamentalAnalysisWeight,
    sentimentAnalysisWeight,
    macroeconomicFactorsWeight,
    enableEmergencyStop,
    emergencyEmail,
    enableCrossChainOptimization
  ]);
  
  // Toggle asset selection
  const toggleAssetSelection = (assetId: string) => {
    if (selectedAssets.includes(assetId)) {
      setSelectedAssets(selectedAssets.filter(id => id !== assetId));
    } else {
      setSelectedAssets([...selectedAssets, assetId]);
    }
  };
  
  // Validate form before submission
  const validateForm = (): boolean => {
    if (!vaultName.trim()) {
      toast({
        title: "Vault name required",
        description: "Please provide a name for your AI investment vault",
        variant: "destructive",
      });
      return false;
    }
    
    if (selectedAssets.length === 0) {
      toast({
        title: "No assets selected",
        description: "Please select at least one asset for the AI to analyze",
        variant: "destructive",
      });
      return false;
    }
    
    if (technicalAnalysisWeight + fundamentalAnalysisWeight + 
        sentimentAnalysisWeight + macroeconomicFactorsWeight !== 100) {
      toast({
        title: "Invalid analysis weights",
        description: "Analysis weights must add up to 100%",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };
  
  // Simulated vault deployment
  const deployVault = () => {
    if (!validateForm()) return;
    
    setIsDeploying(true);
    setDeploymentProgress(0);
    
    // Simulate deployment process
    const deployInterval = setInterval(() => {
      setDeploymentProgress(prev => {
        if (prev >= 100) {
          clearInterval(deployInterval);
          setIsDeploying(false);
          
          // Start AI training process
          startAITraining();
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };
  
  // Simulated AI training
  const startAITraining = () => {
    setIsTraining(true);
    setAiTrainingProgress(0);
    
    // Simulate AI training process
    const trainingInterval = setInterval(() => {
      setAiTrainingProgress(prev => {
        if (prev >= 100) {
          clearInterval(trainingInterval);
          setIsTraining(false);
          
          // Generate fake vault ID
          const randomHex = [...Array(16)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
          setVaultId(`ai-${randomHex}`);
          
          setIsSuccess(true);
          toast({
            title: "AI Investment Vault created",
            description: "Your AI-powered investment vault has been successfully created and the AI model has been trained on your selected assets.",
          });
          return 100;
        }
        return prev + 1;
      });
    }, 150);
  };
  
  // Get risk tolerance description
  const getRiskToleranceDescription = (level: RiskTolerance) => {
    switch(level) {
      case RiskTolerance.CONSERVATIVE:
        return "Prioritizes capital preservation with lower but more consistent returns";
      case RiskTolerance.MODERATE:
        return "Balanced approach with moderate growth potential and reasonable risk";
      case RiskTolerance.AGGRESSIVE:
        return "Maximizes growth potential with higher volatility and risk";
      case RiskTolerance.CUSTOM:
        return "Customized risk parameters based on your specific preferences";
      default:
        return "";
    }
  };
  
  // Get investment strategy description
  const getStrategyDescription = (strategy: InvestmentStrategy) => {
    switch(strategy) {
      case InvestmentStrategy.VALUE_INVESTING:
        return "Identifies undervalued assets based on fundamental analysis";
      case InvestmentStrategy.GROWTH_INVESTING:
        return "Focuses on assets with high growth potential above market average";
      case InvestmentStrategy.MOMENTUM_TRADING:
        return "Capitalizes on continuing market trends and price movements";
      case InvestmentStrategy.DOLLAR_COST_AVERAGING:
        return "Regular investments regardless of price to average out volatility";
      case InvestmentStrategy.SWING_TRADING:
        return "Captures short to medium-term gains through market swings";
      case InvestmentStrategy.CUSTOM:
        return "Tailored strategy combining multiple approaches based on AI analysis";
      default:
        return "";
    }
  };
  
  // Get AI model description
  const getAIModelDescription = (model: AIModelType) => {
    switch(model) {
      case AIModelType.BALANCED:
        return "General-purpose model with balanced emphasis across all analysis types";
      case AIModelType.PATTERN_RECOGNITION:
        return "Specializes in identifying recurring chart patterns and technical signals";
      case AIModelType.TREND_FOLLOWING:
        return "Optimized for detecting and following established market trends";
      case AIModelType.SENTIMENT_ANALYSIS:
        return "Emphasizes market sentiment from news, social media, and on-chain data";
      case AIModelType.QUANTUM_PREDICTION:
        return "Advanced quantum-resistant model with superior predictive capabilities";
      default:
        return "";
    }
  };
  
  // Render success state
  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-[#00E676]/20 mb-8">
            <Brain className="h-12 w-12 text-[#00E676]" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">AI Investment Vault Created!</h1>
          <p className="text-xl text-gray-300 mb-8">
            Your AI-powered investment vault has been successfully created and the AI model has been trained on your selected assets.
          </p>
          
          <Card className="bg-[#151515] border-[#333] mb-8">
            <CardHeader>
              <CardTitle>Vault Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between bg-[#1A1A1A] p-3 rounded-md mb-4">
                <div className="font-mono text-sm text-gray-300">{vaultId}</div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    navigator.clipboard.writeText(vaultId);
                    toast({
                      title: "Vault ID copied",
                      description: "Vault ID copied to clipboard",
                    });
                  }}
                  className="text-[#00E676] hover:text-[#20F696] hover:bg-[#00E676]/10"
                >
                  Copy ID
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">AI Model</p>
                  <p className="text-white">{aiModelType.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</p>
                </div>
                <div>
                  <p className="text-gray-500">Risk Tolerance</p>
                  <p className="text-white">{riskTolerance.charAt(0).toUpperCase() + riskTolerance.slice(1)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Strategy</p>
                  <p className="text-white">
                    {investmentStrategy.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Analysis Score</p>
                  <p className="text-white">{analysisScore}/100</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
            <Link href="/dashboard">
              <Button 
                className="bg-gradient-to-r from-[#00E676] to-[#6B00D7] hover:from-[#10F686] hover:to-[#7B10E7] text-white px-8 py-6 h-auto text-lg rounded-xl shadow-lg"
              >
                Go to Dashboard
              </Button>
            </Link>
            <Button 
              variant="outline"
              className="border-[#00E676]/50 text-[#00E676] hover:bg-[#00E676]/10"
              onClick={() => {
                setIsSuccess(false);
                setVaultName('My AI Investment Vault');
                setVaultDescription('');
                setDeploymentProgress(0);
                setAiTrainingProgress(0);
                setVaultId('');
                setCurrentTab('strategy');
              }}
            >
              Create Another Vault
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <Link href="/vault-types">
          <Button variant="ghost" className="mb-4 hover:bg-[#00E676]/10">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Vault Types
          </Button>
        </Link>

        <div className="flex items-center mb-4">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#00E676] to-[#6B00D7] flex items-center justify-center shadow-lg shadow-[#00E676]/30 mr-4">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00E676] to-[#6B00D7]">
            AI-Assisted Investment Vault
          </h1>
        </div>
        
        <p className="text-lg text-gray-300 max-w-3xl">
          Create an advanced investment vault powered by artificial intelligence to analyze markets, identify trends, and optimize your trading strategy.
        </p>
        
        <div className="flex flex-wrap gap-3 mt-4">
          <Badge variant="secondary" className="bg-[#00E676]/20 text-[#00E676] border-[#00E676]/50">
            <TrendingUp className="h-3 w-3 mr-1" /> AI-Powered Analysis
          </Badge>
          <Badge variant="secondary" className="bg-[#6B00D7]/20 text-[#6B00D7] border-[#6B00D7]/50">
            <BarChart3 className="h-3 w-3 mr-1" /> Customizable Strategies
          </Badge>
          <Badge variant="secondary" className="bg-[#FF5AF7]/20 text-[#FF5AF7] border-[#FF5AF7]/50">
            <Brain className="h-3 w-3 mr-1" /> Emotion-Free Trading
          </Badge>
        </div>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Vault Setup */}
        <div className="lg:col-span-2">
          <Tabs 
            value={currentTab} 
            onValueChange={setCurrentTab}
            className="bg-black/30 backdrop-blur-sm rounded-xl border border-gray-800 p-6"
          >
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="strategy" className="data-[state=active]:bg-[#00E676]/30">
                <div className="flex flex-col items-center py-1">
                  <LineChart className="h-5 w-5 mb-1" />
                  <span>Strategy</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="assets" className="data-[state=active]:bg-[#6B00D7]/30">
                <div className="flex flex-col items-center py-1">
                  <Briefcase className="h-5 w-5 mb-1" />
                  <span>Assets</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="aiSettings" className="data-[state=active]:bg-[#FF5AF7]/30">
                <div className="flex flex-col items-center py-1">
                  <Brain className="h-5 w-5 mb-1" />
                  <span>AI Settings</span>
                </div>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="strategy" className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Vault Details</h2>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="vault-name">Vault Name</Label>
                    <Input 
                      id="vault-name"
                      value={vaultName}
                      onChange={(e) => setVaultName(e.target.value)}
                      className="bg-black/30 border-gray-700"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vault-description">Description (Optional)</Label>
                    <Textarea
                      id="vault-description"
                      value={vaultDescription}
                      onChange={(e) => setVaultDescription(e.target.value)}
                      className="bg-black/30 border-gray-700"
                      placeholder="Add details about this vault's investment goals"
                    />
                  </div>
                </div>
                
                <Separator className="my-6 bg-gray-800" />
                
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Investment Strategy</h2>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Risk Tolerance</Label>
                      <RadioGroup 
                        value={riskTolerance} 
                        onValueChange={(value) => setRiskTolerance(value as RiskTolerance)}
                        className="grid grid-cols-1 gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2 border border-gray-800 rounded-lg p-3 hover:bg-[#00E676]/5 cursor-pointer">
                          <RadioGroupItem value={RiskTolerance.CONSERVATIVE} id="conservative" className="text-[#00E676]" />
                          <Label htmlFor="conservative" className="cursor-pointer flex-1">
                            <div className="flex flex-col">
                              <span className="font-medium">Conservative</span>
                              <span className="text-sm text-gray-400">{getRiskToleranceDescription(RiskTolerance.CONSERVATIVE)}</span>
                            </div>
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-2 border border-gray-800 rounded-lg p-3 hover:bg-[#00E676]/5 cursor-pointer">
                          <RadioGroupItem value={RiskTolerance.MODERATE} id="moderate" className="text-[#00E676]" />
                          <Label htmlFor="moderate" className="cursor-pointer flex-1">
                            <div className="flex flex-col">
                              <span className="font-medium">Moderate</span>
                              <span className="text-sm text-gray-400">{getRiskToleranceDescription(RiskTolerance.MODERATE)}</span>
                            </div>
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-2 border border-gray-800 rounded-lg p-3 hover:bg-[#00E676]/5 cursor-pointer">
                          <RadioGroupItem value={RiskTolerance.AGGRESSIVE} id="aggressive" className="text-[#00E676]" />
                          <Label htmlFor="aggressive" className="cursor-pointer flex-1">
                            <div className="flex flex-col">
                              <span className="font-medium">Aggressive</span>
                              <span className="text-sm text-gray-400">{getRiskToleranceDescription(RiskTolerance.AGGRESSIVE)}</span>
                            </div>
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-2 border border-gray-800 rounded-lg p-3 hover:bg-[#00E676]/5 cursor-pointer">
                          <RadioGroupItem value={RiskTolerance.CUSTOM} id="custom" className="text-[#00E676]" />
                          <Label htmlFor="custom" className="cursor-pointer flex-1">
                            <div className="flex flex-col">
                              <span className="font-medium">Custom</span>
                              <span className="text-sm text-gray-400">{getRiskToleranceDescription(RiskTolerance.CUSTOM)}</span>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    {riskTolerance === RiskTolerance.CUSTOM && (
                      <div className="pl-6 border-l-2 border-gray-800 space-y-6 mt-4">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <Label htmlFor="max-drawdown">Maximum Drawdown</Label>
                            <span>{maxDrawdown}%</span>
                          </div>
                          <Slider
                            id="max-drawdown"
                            min={5}
                            max={50}
                            step={1}
                            value={[maxDrawdown]}
                            onValueChange={(value) => setMaxDrawdown(value[0])}
                            className="[&>span]:bg-[#00E676]"
                          />
                          <div className="flex justify-between text-xs text-gray-400">
                            <span>5% (Lower Risk)</span>
                            <span>50% (Higher Risk)</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="leverage-toggle" className="cursor-pointer">Allow Leverage</Label>
                            <p className="text-xs text-gray-400">Enable trading with borrowed funds</p>
                          </div>
                          <Switch 
                            id="leverage-toggle"
                            checked={leverageAllowed}
                            onCheckedChange={setLeverageAllowed}
                            className="data-[state=checked]:bg-[#00E676]"
                          />
                        </div>
                        
                        {leverageAllowed && (
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <Label htmlFor="max-leverage">Maximum Leverage</Label>
                              <span>{maxLeverage}x</span>
                            </div>
                            <Slider
                              id="max-leverage"
                              min={1}
                              max={10}
                              step={1}
                              value={[maxLeverage]}
                              onValueChange={(value) => setMaxLeverage(value[0])}
                              className="[&>span]:bg-[#00E676]"
                            />
                            <div className="flex justify-between text-xs text-gray-400">
                              <span>1x (No Leverage)</span>
                              <span>10x (High Leverage)</span>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="stop-loss-toggle" className="cursor-pointer">Stop-Loss</Label>
                            <p className="text-xs text-gray-400">Automatically sell if price drops to limit losses</p>
                          </div>
                          <Switch 
                            id="stop-loss-toggle"
                            checked={stopLossEnabled}
                            onCheckedChange={setStopLossEnabled}
                            className="data-[state=checked]:bg-[#00E676]"
                          />
                        </div>
                        
                        {stopLossEnabled && (
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <Label htmlFor="stop-loss-percentage">Stop-Loss Percentage</Label>
                              <span>{stopLossPercentage}%</span>
                            </div>
                            <Slider
                              id="stop-loss-percentage"
                              min={1}
                              max={30}
                              step={1}
                              value={[stopLossPercentage]}
                              onValueChange={(value) => setStopLossPercentage(value[0])}
                              className="[&>span]:bg-[#00E676]"
                            />
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="take-profit-toggle" className="cursor-pointer">Take-Profit</Label>
                            <p className="text-xs text-gray-400">Automatically sell if price rises to secure gains</p>
                          </div>
                          <Switch 
                            id="take-profit-toggle"
                            checked={takeProfitEnabled}
                            onCheckedChange={setTakeProfitEnabled}
                            className="data-[state=checked]:bg-[#00E676]"
                          />
                        </div>
                        
                        {takeProfitEnabled && (
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <Label htmlFor="take-profit-percentage">Take-Profit Percentage</Label>
                              <span>{takeProfitPercentage}%</span>
                            </div>
                            <Slider
                              id="take-profit-percentage"
                              min={5}
                              max={100}
                              step={1}
                              value={[takeProfitPercentage]}
                              onValueChange={(value) => setTakeProfitPercentage(value[0])}
                              className="[&>span]:bg-[#00E676]"
                            />
                          </div>
                        )}
                      </div>
                    )}
                    
                    <Separator className="my-6 bg-gray-800" />
                    
                    <div className="space-y-2">
                      <Label>Investment Approach</Label>
                      <RadioGroup 
                        value={investmentStrategy} 
                        onValueChange={(value) => setInvestmentStrategy(value as InvestmentStrategy)}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2 border border-gray-800 rounded-lg p-3 hover:bg-[#00E676]/5 cursor-pointer">
                          <RadioGroupItem value={InvestmentStrategy.VALUE_INVESTING} id="value_investing" className="text-[#00E676]" />
                          <Label htmlFor="value_investing" className="cursor-pointer flex-1">
                            <div className="flex flex-col">
                              <span className="font-medium">Value Investing</span>
                              <span className="text-xs text-gray-400">{getStrategyDescription(InvestmentStrategy.VALUE_INVESTING)}</span>
                            </div>
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-2 border border-gray-800 rounded-lg p-3 hover:bg-[#00E676]/5 cursor-pointer">
                          <RadioGroupItem value={InvestmentStrategy.GROWTH_INVESTING} id="growth_investing" className="text-[#00E676]" />
                          <Label htmlFor="growth_investing" className="cursor-pointer flex-1">
                            <div className="flex flex-col">
                              <span className="font-medium">Growth Investing</span>
                              <span className="text-xs text-gray-400">{getStrategyDescription(InvestmentStrategy.GROWTH_INVESTING)}</span>
                            </div>
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-2 border border-gray-800 rounded-lg p-3 hover:bg-[#00E676]/5 cursor-pointer">
                          <RadioGroupItem value={InvestmentStrategy.MOMENTUM_TRADING} id="momentum_trading" className="text-[#00E676]" />
                          <Label htmlFor="momentum_trading" className="cursor-pointer flex-1">
                            <div className="flex flex-col">
                              <span className="font-medium">Momentum Trading</span>
                              <span className="text-xs text-gray-400">{getStrategyDescription(InvestmentStrategy.MOMENTUM_TRADING)}</span>
                            </div>
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-2 border border-gray-800 rounded-lg p-3 hover:bg-[#00E676]/5 cursor-pointer">
                          <RadioGroupItem value={InvestmentStrategy.DOLLAR_COST_AVERAGING} id="dollar_cost_averaging" className="text-[#00E676]" />
                          <Label htmlFor="dollar_cost_averaging" className="cursor-pointer flex-1">
                            <div className="flex flex-col">
                              <span className="font-medium">Dollar Cost Averaging</span>
                              <span className="text-xs text-gray-400">{getStrategyDescription(InvestmentStrategy.DOLLAR_COST_AVERAGING)}</span>
                            </div>
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-2 border border-gray-800 rounded-lg p-3 hover:bg-[#00E676]/5 cursor-pointer">
                          <RadioGroupItem value={InvestmentStrategy.SWING_TRADING} id="swing_trading" className="text-[#00E676]" />
                          <Label htmlFor="swing_trading" className="cursor-pointer flex-1">
                            <div className="flex flex-col">
                              <span className="font-medium">Swing Trading</span>
                              <span className="text-xs text-gray-400">{getStrategyDescription(InvestmentStrategy.SWING_TRADING)}</span>
                            </div>
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-2 border border-gray-800 rounded-lg p-3 hover:bg-[#00E676]/5 cursor-pointer">
                          <RadioGroupItem value={InvestmentStrategy.CUSTOM} id="custom_strategy" className="text-[#00E676]" />
                          <Label htmlFor="custom_strategy" className="cursor-pointer flex-1">
                            <div className="flex flex-col">
                              <span className="font-medium">Custom Strategy</span>
                              <span className="text-xs text-gray-400">{getStrategyDescription(InvestmentStrategy.CUSTOM)}</span>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="time-horizon">Time Horizon</Label>
                      <Select 
                        value={timeHorizon} 
                        onValueChange={setTimeHorizon}
                      >
                        <SelectTrigger className="bg-black/30 border-gray-700">
                          <SelectValue placeholder="Select time horizon" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="short_term">Short Term (Days to Weeks)</SelectItem>
                          <SelectItem value="medium_term">Medium Term (Months to a Year)</SelectItem>
                          <SelectItem value="long_term">Long Term (1+ Years)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button 
                  onClick={() => setCurrentTab('assets')}
                  className="bg-[#00E676] hover:bg-[#10F686] text-white"
                >
                  Continue to Assets
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="assets" className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Asset Selection</h2>
                <p className="text-sm text-gray-400">
                  Select the assets you'd like your AI to analyze and potentially trade or invest in.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Label htmlFor="market-category">Market Category</Label>
                    <Select 
                      value={marketCategory} 
                      onValueChange={(value) => setMarketCategory(value as MarketCategory)}
                    >
                      <SelectTrigger className="bg-black/30 border-gray-700 mt-2">
                        <SelectValue placeholder="Select market category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={MarketCategory.ALL}>All Markets</SelectItem>
                        <SelectItem value={MarketCategory.CRYPTO}>Cryptocurrencies</SelectItem>
                        <SelectItem value={MarketCategory.STOCKS}>Stocks</SelectItem>
                        <SelectItem value={MarketCategory.FOREX}>Forex</SelectItem>
                        <SelectItem value={MarketCategory.COMMODITIES}>Commodities</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex-1">
                    <Label htmlFor="asset-search">Search Assets</Label>
                    <Input
                      id="asset-search"
                      placeholder="Search by name or symbol..."
                      value={assetSearchTerm}
                      onChange={(e) => setAssetSearchTerm(e.target.value)}
                      className="bg-black/30 border-gray-700 mt-2"
                    />
                  </div>
                </div>
                
                <div className="space-y-2 mt-4">
                  <div className="border border-gray-800 rounded-lg">
                    <div className="p-3 bg-gray-900/30 border-b border-gray-800 flex items-center justify-between">
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-2 text-[#00E676]" />
                        <span className="font-medium">Available Assets</span>
                      </div>
                      <span className="text-sm text-gray-400">{selectedAssets.length} selected</span>
                    </div>
                    
                    <div className="max-h-[350px] overflow-y-auto">
                      {filteredAssets.length === 0 ? (
                        <div className="p-6 text-center text-gray-400">
                          No assets found. Try a different search term or category.
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-800">
                          {filteredAssets.map((asset) => (
                            <div 
                              key={asset.id}
                              className={`flex items-center p-3 hover:bg-black/40 cursor-pointer ${
                                selectedAssets.includes(asset.id) ? 'bg-[#00E676]/5' : ''
                              }`}
                              onClick={() => toggleAssetSelection(asset.id)}
                            >
                              <Checkbox
                                checked={selectedAssets.includes(asset.id)}
                                onCheckedChange={() => toggleAssetSelection(asset.id)}
                                className="text-[#00E676] border-gray-600 data-[state=checked]:border-[#00E676] data-[state=checked]:bg-[#00E676]"
                              />
                              
                              <div className="ml-3 flex-1">
                                <div className="flex items-center">
                                  <span className="font-medium">{asset.id}</span>
                                  <span className="ml-2 text-sm text-gray-400">{asset.name}</span>
                                </div>
                              </div>
                              
                              <Badge className={`
                                ${asset.category === 'crypto' ? 'bg-blue-900/20 text-blue-400 border-blue-900/50' : 
                                  asset.category === 'stocks' ? 'bg-green-900/20 text-green-400 border-green-900/50' :
                                  asset.category === 'forex' ? 'bg-amber-900/20 text-amber-400 border-amber-900/50' :
                                  'bg-purple-900/20 text-purple-400 border-purple-900/50'}
                              `}>
                                {asset.category.charAt(0).toUpperCase() + asset.category.slice(1)}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <Separator className="my-6 bg-gray-800" />
                
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Asset Allocation Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <Label htmlFor="max-allocation">Maximum Single Asset Allocation</Label>
                        <span>{maxSingleAssetAllocation}%</span>
                      </div>
                      <Slider
                        id="max-allocation"
                        min={5}
                        max={100}
                        step={5}
                        value={[maxSingleAssetAllocation]}
                        onValueChange={(value) => setMaxSingleAssetAllocation(value[0])}
                        className="[&>span]:bg-[#00E676]"
                      />
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>5% (Highly Diversified)</span>
                        <span>100% (Single Asset)</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="rebalancing-frequency">Rebalancing Frequency</Label>
                      <Select 
                        value={rebalancingFrequency} 
                        onValueChange={setRebalancingFrequency}
                      >
                        <SelectTrigger className="bg-black/30 border-gray-700">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="dynamic-rebalancing" className="cursor-pointer">Dynamic Rebalancing</Label>
                        <p className="text-xs text-gray-400">Automatically adjust allocations based on market conditions</p>
                      </div>
                      <Switch 
                        id="dynamic-rebalancing"
                        checked={enableDynamicRebalancing}
                        onCheckedChange={setEnableDynamicRebalancing}
                        className="data-[state=checked]:bg-[#00E676]"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentTab('strategy')}
                >
                  Back
                </Button>
                <Button 
                  onClick={() => setCurrentTab('aiSettings')}
                  className="bg-[#6B00D7] hover:bg-[#7B10E7] text-white"
                  disabled={selectedAssets.length === 0}
                >
                  Continue to AI Settings
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="aiSettings" className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">AI Configuration</h2>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>AI Model Type</Label>
                    <RadioGroup 
                      value={aiModelType} 
                      onValueChange={(value) => setAIModelType(value as AIModelType)}
                      className="grid grid-cols-1 gap-3 mt-2"
                    >
                      <div className="flex items-center space-x-2 border border-gray-800 rounded-lg p-3 hover:bg-[#FF5AF7]/5 cursor-pointer">
                        <RadioGroupItem value={AIModelType.BALANCED} id="balanced" className="text-[#FF5AF7]" />
                        <Label htmlFor="balanced" className="cursor-pointer flex-1">
                          <div className="flex flex-col">
                            <span className="font-medium">Balanced AI</span>
                            <span className="text-sm text-gray-400">{getAIModelDescription(AIModelType.BALANCED)}</span>
                          </div>
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 border border-gray-800 rounded-lg p-3 hover:bg-[#FF5AF7]/5 cursor-pointer">
                        <RadioGroupItem value={AIModelType.PATTERN_RECOGNITION} id="pattern_recognition" className="text-[#FF5AF7]" />
                        <Label htmlFor="pattern_recognition" className="cursor-pointer flex-1">
                          <div className="flex flex-col">
                            <span className="font-medium">Pattern Recognition</span>
                            <span className="text-sm text-gray-400">{getAIModelDescription(AIModelType.PATTERN_RECOGNITION)}</span>
                          </div>
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 border border-gray-800 rounded-lg p-3 hover:bg-[#FF5AF7]/5 cursor-pointer">
                        <RadioGroupItem value={AIModelType.TREND_FOLLOWING} id="trend_following" className="text-[#FF5AF7]" />
                        <Label htmlFor="trend_following" className="cursor-pointer flex-1">
                          <div className="flex flex-col">
                            <span className="font-medium">Trend Following</span>
                            <span className="text-sm text-gray-400">{getAIModelDescription(AIModelType.TREND_FOLLOWING)}</span>
                          </div>
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 border border-gray-800 rounded-lg p-3 hover:bg-[#FF5AF7]/5 cursor-pointer">
                        <RadioGroupItem value={AIModelType.SENTIMENT_ANALYSIS} id="sentiment_analysis" className="text-[#FF5AF7]" />
                        <Label htmlFor="sentiment_analysis" className="cursor-pointer flex-1">
                          <div className="flex flex-col">
                            <span className="font-medium">Sentiment Analysis</span>
                            <span className="text-sm text-gray-400">{getAIModelDescription(AIModelType.SENTIMENT_ANALYSIS)}</span>
                          </div>
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 border border-gray-800 rounded-lg p-3 hover:bg-[#FF5AF7]/5 cursor-pointer">
                        <RadioGroupItem value={AIModelType.QUANTUM_PREDICTION} id="quantum_prediction" className="text-[#FF5AF7]" />
                        <Label htmlFor="quantum_prediction" className="cursor-pointer flex-1">
                          <div className="flex flex-col">
                            <span className="font-medium">Quantum Prediction</span>
                            <span className="text-sm text-gray-400">{getAIModelDescription(AIModelType.QUANTUM_PREDICTION)}</span>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <Separator className="my-6 bg-gray-800" />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Analysis Weighting</h3>
                    <p className="text-sm text-gray-400">
                      Determine how much weight the AI should give to different types of analysis. Total must equal 100%.
                    </p>
                    
                    <div className="space-y-6 mt-4">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <Label htmlFor="technical-analysis">Technical Analysis Weight</Label>
                          <span>{technicalAnalysisWeight}%</span>
                        </div>
                        <Slider
                          id="technical-analysis"
                          min={0}
                          max={100}
                          step={5}
                          value={[technicalAnalysisWeight]}
                          onValueChange={(value) => setTechnicalAnalysisWeight(value[0])}
                          className="[&>span]:bg-[#FF5AF7]"
                        />
                        <p className="text-xs text-gray-400">
                          Chart patterns, indicators, and price action
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <Label htmlFor="fundamental-analysis">Fundamental Analysis Weight</Label>
                          <span>{fundamentalAnalysisWeight}%</span>
                        </div>
                        <Slider
                          id="fundamental-analysis"
                          min={0}
                          max={100}
                          step={5}
                          value={[fundamentalAnalysisWeight]}
                          onValueChange={(value) => setFundamentalAnalysisWeight(value[0])}
                          className="[&>span]:bg-[#FF5AF7]"
                        />
                        <p className="text-xs text-gray-400">
                          Project fundamentals, tokenomics, and on-chain metrics
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <Label htmlFor="sentiment-analysis">Sentiment Analysis Weight</Label>
                          <span>{sentimentAnalysisWeight}%</span>
                        </div>
                        <Slider
                          id="sentiment-analysis"
                          min={0}
                          max={100}
                          step={5}
                          value={[sentimentAnalysisWeight]}
                          onValueChange={(value) => setSentimentAnalysisWeight(value[0])}
                          className="[&>span]:bg-[#FF5AF7]"
                        />
                        <p className="text-xs text-gray-400">
                          Social media trends, news sentiment, and community activity
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <Label htmlFor="macroeconomic-factors">Macroeconomic Factors Weight</Label>
                          <span>{macroeconomicFactorsWeight}%</span>
                        </div>
                        <Slider
                          id="macroeconomic-factors"
                          min={0}
                          max={100}
                          step={5}
                          value={[macroeconomicFactorsWeight]}
                          onValueChange={(value) => setMacroeconomicFactorsWeight(value[0])}
                          className="[&>span]:bg-[#FF5AF7]"
                        />
                        <p className="text-xs text-gray-400">
                          Global economic trends, regulations, and market correlations
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between bg-[#1A1A1A] p-3 rounded-md">
                        <span className="font-medium">Total Weighting</span>
                        <span className={`font-medium ${
                          technicalAnalysisWeight + fundamentalAnalysisWeight + 
                          sentimentAnalysisWeight + macroeconomicFactorsWeight === 100 ? 
                          'text-green-500' : 'text-red-500'
                        }`}>
                          {technicalAnalysisWeight + fundamentalAnalysisWeight + 
                           sentimentAnalysisWeight + macroeconomicFactorsWeight}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-6 bg-gray-800" />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Advanced Settings</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="notifications-toggle" className="cursor-pointer">Enable Notifications</Label>
                          <p className="text-xs text-gray-400">Get alerts for significant market movements and AI recommendations</p>
                        </div>
                        <Switch 
                          id="notifications-toggle"
                          checked={enableNotifications}
                          onCheckedChange={setEnableNotifications}
                          className="data-[state=checked]:bg-[#FF5AF7]"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="auto-trading-toggle" className="cursor-pointer">Automatic Trading</Label>
                          <p className="text-xs text-gray-400">Allow AI to execute trades automatically based on analysis</p>
                        </div>
                        <Switch 
                          id="auto-trading-toggle"
                          checked={enableAutomaticTrading}
                          onCheckedChange={setEnableAutomaticTrading}
                          className="data-[state=checked]:bg-[#FF5AF7]"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="cross-chain-toggle" className="cursor-pointer">Cross-Chain Optimization</Label>
                          <p className="text-xs text-gray-400">Analyze opportunities across different blockchains for maximum efficiency</p>
                        </div>
                        <Switch 
                          id="cross-chain-toggle"
                          checked={enableCrossChainOptimization}
                          onCheckedChange={setEnableCrossChainOptimization}
                          className="data-[state=checked]:bg-[#FF5AF7]"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="emergency-stop-toggle" className="cursor-pointer">Emergency Stop Protocol</Label>
                          <p className="text-xs text-gray-400">Halt all AI activity during extreme market conditions</p>
                        </div>
                        <Switch 
                          id="emergency-stop-toggle"
                          checked={enableEmergencyStop}
                          onCheckedChange={setEnableEmergencyStop}
                          className="data-[state=checked]:bg-[#FF5AF7]"
                        />
                      </div>
                      
                      {enableEmergencyStop && (
                        <div className="pl-6 border-l-2 border-gray-800 space-y-3 mt-2">
                          <div className="space-y-2">
                            <Label htmlFor="emergency-email">Emergency Contact Email (Optional)</Label>
                            <Input 
                              id="emergency-email"
                              type="email" 
                              placeholder="your@email.com"
                              value={emergencyEmail}
                              onChange={(e) => setEmergencyEmail(e.target.value)}
                              className="bg-black/30 border-gray-700"
                            />
                            <p className="text-xs text-gray-400">
                              You'll be notified if the emergency protocol is activated.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-6 space-y-6">
                {!isDeploying && !isTraining ? (
                  <Button 
                    onClick={deployVault}
                    className="w-full bg-gradient-to-r from-[#00E676] to-[#6B00D7] hover:from-[#10F686] hover:to-[#7B10E7] text-white h-12 text-lg font-semibold"
                    disabled={technicalAnalysisWeight + fundamentalAnalysisWeight + 
                             sentimentAnalysisWeight + macroeconomicFactorsWeight !== 100}
                  >
                    Create AI Investment Vault
                  </Button>
                ) : (
                  <div className="space-y-4">
                    {isDeploying && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Deploying vault infrastructure...</span>
                          <span>{deploymentProgress}%</span>
                        </div>
                        <Progress value={deploymentProgress} className="h-2 [&>div]:bg-[#6B00D7]" />
                        <p className="text-sm text-gray-400">
                          {deploymentProgress < 30 && "Creating vault architecture..."}
                          {deploymentProgress >= 30 && deploymentProgress < 60 && "Setting up security protocols..."}
                          {deploymentProgress >= 60 && deploymentProgress < 90 && "Configuring investment parameters..."}
                          {deploymentProgress >= 90 && "Finalizing deployment..."}
                        </p>
                      </div>
                    )}
                    
                    {isTraining && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Training AI model...</span>
                          <span>{aiTrainingProgress}%</span>
                        </div>
                        <Progress value={aiTrainingProgress} className="h-2 [&>div]:bg-[#00E676]" />
                        <p className="text-sm text-gray-400">
                          {aiTrainingProgress < 25 && "Loading historical data..."}
                          {aiTrainingProgress >= 25 && aiTrainingProgress < 50 && "Training on market patterns..."}
                          {aiTrainingProgress >= 50 && aiTrainingProgress < 75 && "Optimizing prediction accuracy..."}
                          {aiTrainingProgress >= 75 && "Finalizing AI model..."}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex justify-between">
                  <Button 
                    variant="outline"
                    onClick={() => setCurrentTab('assets')}
                    disabled={isDeploying || isTraining}
                  >
                    Back
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Right Column - Info Cards */}
        <div className="space-y-6">
          <Card className="bg-black/30 backdrop-blur-sm border-gray-800 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-[#00E676] to-[#6B00D7]" />
            <CardHeader>
              <CardTitle>Analysis Score</CardTitle>
              <CardDescription>
                AI effectiveness based on your configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm text-gray-300">Effectiveness Score</span>
                  <span className={`font-bold text-xl ${
                    analysisScore >= 80 ? 'text-green-500' : 
                    analysisScore >= 60 ? 'text-amber-500' : 
                    'text-red-500'
                  }`}>
                    {analysisScore}%
                  </span>
                </div>
                <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      analysisScore >= 80 ? 'bg-green-500' : 
                      analysisScore >= 60 ? 'bg-amber-500' : 
                      'bg-red-500'
                    }`} 
                    style={{ width: `${analysisScore}%` }}
                  />
                </div>
                
                <Alert className={`mt-3 bg-${analysisScore >= 80 ? '[#00E676]' : analysisScore >= 60 ? 'amber-500' : 'red-500'}/10 border-${analysisScore >= 80 ? '[#00E676]' : analysisScore >= 60 ? 'amber-500' : 'red-500'}/30`}>
                  <Brain className={`h-4 w-4 text-${analysisScore >= 80 ? '[#00E676]' : analysisScore >= 60 ? 'amber-500' : 'red-500'}`} />
                  <AlertTitle className={`text-${analysisScore >= 80 ? '[#00E676]' : analysisScore >= 60 ? 'amber-500' : 'red-500'}`}>
                    {analysisScore >= 80 ? 'Excellent Configuration' : 
                     analysisScore >= 60 ? 'Good Configuration' : 
                     'Basic Configuration'}
                  </AlertTitle>
                  <AlertDescription className="text-gray-300">
                    {analysisScore >= 80 ? 'Your AI model is optimally configured for sophisticated market analysis.' : 
                     analysisScore >= 60 ? 'Your configuration provides good analysis capabilities but could be improved.' : 
                     'Consider enhancing your configuration to improve AI effectiveness.'}
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-[#00E676]/20 to-[#6B00D7]/20 border-gray-800">
            <CardHeader>
              <CardTitle className="text-lg">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E676] to-[#6B00D7]">Key Features</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-[#00E676]/20 p-1.5 rounded-full">
                  <Brain className="h-5 w-5 text-[#00E676]" />
                </div>
                <div>
                  <h4 className="font-medium">Intelligent Analysis</h4>
                  <p className="text-sm text-gray-400">Advanced AI analyzes markets 24/7</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-[#6B00D7]/20 p-1.5 rounded-full">
                  <CandlestickChart className="h-5 w-5 text-[#6B00D7]" />
                </div>
                <div>
                  <h4 className="font-medium">Pattern Recognition</h4>
                  <p className="text-sm text-gray-400">Identifies subtle trends in market data</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-[#FF5AF7]/20 p-1.5 rounded-full">
                  <AlertTriangle className="h-5 w-5 text-[#FF5AF7]" />
                </div>
                <div>
                  <h4 className="font-medium">Risk Assessment</h4>
                  <p className="text-sm text-gray-400">Continuous monitoring for potential risks</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-[#00E676]/20 p-1.5 rounded-full">
                  <Zap className="h-5 w-5 text-[#00E676]" />
                </div>
                <div>
                  <h4 className="font-medium">Emotion-Free Trading</h4>
                  <p className="text-sm text-gray-400">Removes emotional bias from decisions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Alert className="bg-[#00E676]/10 border-[#00E676]/30">
            <ShieldCheck className="h-4 w-4 text-[#00E676]" />
            <AlertTitle className="text-[#00E676]">Triple-Chain Security</AlertTitle>
            <AlertDescription className="text-gray-300">
              All AI-powered vaults are secured with our military-grade Triple-Chain Security architecture.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
};

export default AIAssistedInvestmentVault;