import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { BlockchainType } from '@/contexts/multi-chain-context';
import { useTon } from '@/contexts/ton-context';
import { useEthereum } from '@/contexts/ethereum-context';
import { useSolana } from '@/contexts/solana-context';
import { SentimentGauge, SentimentAlert, SentimentRecommendations } from '@/components/sentiment/sentiment-gauge';
import { SentimentData, sentimentAnalysisService, SentimentLevel } from '@/services/sentiment-analysis-service';
import { TechnicalIndicators, TechnicalIndicator } from '@/components/technical/technical-indicators';

// Exit strategy types
type PriceTarget = {
  id: string;
  price: string;
  percentage: number;
};

type TimeBasedExit = {
  date: string;
  percentage: number;
};

type MarketCondition = {
  id: string;
  type: 'price' | 'halving' | 'event';
  description: string;
  value: string;
  enabled: boolean;
};

type InvestmentStrategy = 'diamond_hands' | 'profit_taking' | 'dca_exit' | 'halvening_cycle';

function InvestmentDisciplineVault() {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const ton = useTon();
  const ethereum = useEthereum();
  const solana = useSolana();
  
  // Basic vault info
  const [vaultName, setVaultName] = useState<string>('');
  const [assetType, setAssetType] = useState<string>('BTC');
  const [initialAmount, setInitialAmount] = useState<string>('');
  const [selectedBlockchain, setSelectedBlockchain] = useState<BlockchainType>(BlockchainType.ETHEREUM);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Sentiment analysis data
  const [sentimentData, setSentimentData] = useState<SentimentData | undefined>(undefined);
  const [sentimentRecommendations, setSentimentRecommendations] = useState<string[]>([]);
  const [enableSentimentProtection, setEnableSentimentProtection] = useState<boolean>(true);
  
  // Technical indicators for on-chain triggers
  const [technicalIndicators, setTechnicalIndicators] = useState<TechnicalIndicator[]>([
    {
      id: '1',
      type: 'ma',
      period: 50,
      condition: 'crossing_down',
      value: 0,
      enabled: true
    },
    {
      id: '2',
      type: 'rsi',
      period: 14,
      condition: 'above',
      value: 70,
      enabled: false
    },
    {
      id: '3',
      type: 'macd',
      period: 12,
      secondaryPeriod: 26,
      signalPeriod: 9,
      condition: 'crossing_down',
      enabled: false
    }
  ]);
  
  // Investment strategy config
  const [selectedStrategy, setSelectedStrategy] = useState<InvestmentStrategy>('diamond_hands');
  const [minHoldPeriod, setMinHoldPeriod] = useState<number>(90); // days
  const [priceTargets, setPriceTargets] = useState<PriceTarget[]>([
    { id: '1', price: '', percentage: 25 }
  ]);
  const [timeBasedExits, setTimeBasedExits] = useState<TimeBasedExit[]>([
    { date: '', percentage: 50 }
  ]);
  const [marketConditions, setMarketConditions] = useState<MarketCondition[]>([
    { 
      id: '1', 
      type: 'halving', 
      description: 'Bitcoin Halving', 
      value: 'next_halving', 
      enabled: true 
    },
    { 
      id: '2', 
      type: 'price', 
      description: 'Market Crash Protection', 
      value: '', 
      enabled: false 
    }
  ]);
  const [step, setStep] = useState<number>(1);
  
  // Features
  const [enableRebalancing, setEnableRebalancing] = useState<boolean>(false);
  const [enableEmergencyProtocol, setEnableEmergencyProtocol] = useState<boolean>(true);
  const [enableAnalytics, setEnableAnalytics] = useState<boolean>(true);
  
  // Security
  const [securityLevel, setSecurityLevel] = useState<number>(3);
  const [crossChainEnabled, setCrossChainEnabled] = useState<boolean>(false);
  
  // Handlers
  const handlePriceTargetAdd = () => {
    setPriceTargets([
      ...priceTargets, 
      { id: Date.now().toString(), price: '', percentage: 25 }
    ]);
  };
  
  const handlePriceTargetRemove = (id: string) => {
    setPriceTargets(priceTargets.filter(target => target.id !== id));
  };
  
  const handlePriceTargetChange = (id: string, field: 'price' | 'percentage', value: string | number) => {
    setPriceTargets(priceTargets.map(target => {
      if (target.id === id) {
        return { ...target, [field]: value };
      }
      return target;
    }));
  };
  
  const handleTimeBasedExitAdd = () => {
    setTimeBasedExits([
      ...timeBasedExits,
      { date: '', percentage: 25 }
    ]);
  };
  
  const handleTimeBasedExitRemove = (index: number) => {
    setTimeBasedExits(timeBasedExits.filter((_, i) => i !== index));
  };
  
  const handleTimeBasedExitChange = (index: number, field: 'date' | 'percentage', value: string | number) => {
    setTimeBasedExits(timeBasedExits.map((exit, i) => {
      if (i === index) {
        return { ...exit, [field]: value };
      }
      return exit;
    }));
  };
  
  const handleMarketConditionChange = (id: string, field: 'value' | 'enabled', value: string | boolean) => {
    setMarketConditions(marketConditions.map(condition => {
      if (condition.id === id) {
        return { ...condition, [field]: value };
      }
      return condition;
    }));
  };
  
  const handleBlockchainSelect = (blockchain: BlockchainType) => {
    setSelectedBlockchain(blockchain);
  };
  
  const isWalletConnected = (blockchain: BlockchainType): boolean => {
    switch(blockchain) {
      case BlockchainType.TON:
        return Boolean(ton.isConnected && ton.walletInfo?.address);
      case BlockchainType.ETHEREUM:
        return Boolean(ethereum.isConnected);
      case BlockchainType.SOLANA:
        return Boolean(solana.isConnected);
      default:
        return false;
    };
  };
  
  const calculateTotalPercentage = (): number => {
    return priceTargets.reduce((total, target) => total + target.percentage, 0);
  };
  
  const validateInputs = (): boolean => {
    if (!vaultName) {
      toast({
        title: "Vault Name Required",
        description: "Please provide a name for your investment vault",
        variant: "destructive",
      });
      return false;
    }
    
    if (!initialAmount || isNaN(parseFloat(initialAmount)) || parseFloat(initialAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please provide a valid initial investment amount",
        variant: "destructive",
      });
      return false;
    }
    
    if (selectedStrategy === 'profit_taking') {
      // Validate price targets
      if (priceTargets.length === 0) {
        toast({
          title: "Price Targets Required",
          description: "Please add at least one price target for your profit-taking strategy",
          variant: "destructive",
        });
        return false;
      }
      
      const invalidTargets = priceTargets.some(
        target => !target.price || isNaN(parseFloat(target.price)) || parseFloat(target.price) <= 0
      );
      
      if (invalidTargets) {
        toast({
          title: "Invalid Price Targets",
          description: "Please provide valid price targets for all exit points",
          variant: "destructive",
        });
        return false;
      }
      
      const totalPercentage = calculateTotalPercentage();
      if (totalPercentage !== 100) {
        toast({
          title: "Invalid Distribution",
          description: `Total profit-taking percentage should equal 100%, currently at ${totalPercentage}%`,
          variant: "destructive",
        });
        return false;
      }
      
      // Validate technical indicators if any are enabled
      const enabledIndicators = technicalIndicators.filter(indicator => indicator.enabled);
      if (enabledIndicators.length > 0) {
        // Validate RSI indicators
        const invalidRSI = enabledIndicators
          .filter(indicator => indicator.type === 'rsi')
          .some(indicator => !indicator.value || indicator.value < 0 || indicator.value > 100);
        
        if (invalidRSI) {
          toast({
            title: "Invalid RSI Configuration",
            description: "RSI values must be between 0 and 100",
            variant: "destructive",
          });
          return false;
        }
      }
    } else if (selectedStrategy === 'dca_exit') {
      // Validate time-based exits
      if (timeBasedExits.length === 0) {
        toast({
          title: "Time Exits Required",
          description: "Please add at least one time-based exit point for your DCA exit strategy",
          variant: "destructive",
        });
        return false;
      }
      
      const invalidDates = timeBasedExits.some(exit => !exit.date);
      
      if (invalidDates) {
        toast({
          title: "Invalid Dates",
          description: "Please provide valid dates for all exit points",
          variant: "destructive",
        });
        return false;
      }
    }
    
    return true;
  };
  
  const handleCreateVault = async () => {
    if (!validateInputs()) return;
    
    setIsLoading(true);
    
    try {
      // Calculate the minimum unlock date based on the hold period
      const minUnlockDate = new Date();
      minUnlockDate.setDate(minUnlockDate.getDate() + minHoldPeriod);
      
      // Create specialized configuration based on the strategy
      const specializedConfig: Record<string, any> = {
        strategy: selectedStrategy,
        assetType: assetType,
        initialAmount: initialAmount,
        minHoldPeriod: minHoldPeriod,
        enableRebalancing: enableRebalancing,
        enableEmergencyProtocol: enableEmergencyProtocol,
        enableAnalytics: enableAnalytics,
        securityLevel: securityLevel,
        crossChainEnabled: crossChainEnabled,
      };
      
      // Add strategy-specific configuration
      if (selectedStrategy === 'profit_taking') {
        specializedConfig.priceTargets = priceTargets;
        // Add technical indicators if they exist
        if (technicalIndicators.length > 0) {
          specializedConfig.technicalIndicators = technicalIndicators.filter(indicator => indicator.enabled);
          specializedConfig.usesChainlinkOracles = true;
        }
      } else if (selectedStrategy === 'dca_exit') {
        specializedConfig.timeBasedExits = timeBasedExits;
      } else if (selectedStrategy === 'halvening_cycle') {
        specializedConfig.marketConditions = marketConditions.filter(c => c.enabled);
      }
      
      // Add sentiment analysis protection
      specializedConfig.sentimentProtection = enableSentimentProtection;
      if (sentimentData) {
        specializedConfig.sentimentData = {
          value: sentimentData.value,
          classification: sentimentData.classification,
          timestamp: sentimentData.timestamp,
          source: sentimentData.source
        };
      }
      if (sentimentRecommendations.length > 0) {
        specializedConfig.sentimentRecommendations = sentimentRecommendations;
      }
      
      // Create blockchain-specific configuration
      const blockchainConfig: Record<string, string> = {};
      if (selectedBlockchain === BlockchainType.TON) {
        blockchainConfig.tonContractAddress = ton.walletInfo?.address || '';
      } else if (selectedBlockchain === BlockchainType.ETHEREUM) {
        blockchainConfig.ethereumContractAddress = ethereum.isConnected ? 'pending-deployment' : '';
      } else if (selectedBlockchain === BlockchainType.SOLANA) {
        blockchainConfig.solanaContractAddress = solana.isConnected ? 'pending-deployment' : '';
      }
      
      // Calculate asset value for security level determination
      let calculatedAssetValueUSD = 0;
      
      // Calculate USD value based on asset type
      if (assetType === 'BTC') {
        calculatedAssetValueUSD = parseFloat(initialAmount) * 103106; // Current BTC price
      } else if (assetType === 'ETH') {
        calculatedAssetValueUSD = parseFloat(initialAmount) * 3481;
      } else if (assetType === 'SOL') {
        calculatedAssetValueUSD = parseFloat(initialAmount) * 168;
      } else if (assetType === 'TON') {
        calculatedAssetValueUSD = parseFloat(initialAmount) * 7.24;
      }
      
      // Create vault data for API call
      const vaultData = {
        userId: 1, // This should be the actual user ID from auth
        name: vaultName,
        description: `Investment Discipline Vault with ${selectedStrategy.replace('_', ' ')} strategy for ${assetType} assets`,
        vaultType: 'diamond-hands', // Using the existing vault type ID
        assetType: selectedBlockchain,
        assetAmount: initialAmount,
        assetValueUSD: calculatedAssetValueUSD.toString(),
        timeLockPeriod: minHoldPeriod,
        unlockDate: minUnlockDate.toISOString(),
        metadata: JSON.stringify({
          specializedType: 'investment-discipline',
          configuration: specializedConfig,
          blockchain: selectedBlockchain,
          assetValueUSD: calculatedAssetValueUSD,
          calculatedAt: new Date().toISOString()
        }),
        ...blockchainConfig,
        securityLevel: securityLevel,
        crossChainEnabled: crossChainEnabled,
        privacyEnabled: true
      };
      
      // Make the API call to create the vault
      const response = await apiRequest('POST', '/api/vaults', vaultData);
      const createdVault = await response.json();
      
      // Create a success message based on the selected strategy
      let successMessage = '';
      
      switch (selectedStrategy) {
        case 'diamond_hands':
          successMessage = `Your HODL vault has been created. Assets will be locked for a minimum of ${minHoldPeriod} days.`;
          break;
        case 'profit_taking':
          successMessage = `Your Profit-Taking vault has been created with ${priceTargets.length} price target${priceTargets.length > 1 ? 's' : ''}.`;
          if (technicalIndicators.length > 0) {
            const enabledIndicators = technicalIndicators.filter(indicator => indicator.enabled);
            if (enabledIndicators.length > 0) {
              successMessage += ` ${enabledIndicators.length} technical indicator${enabledIndicators.length > 1 ? 's' : ''} will use Chainlink price feeds.`;
            }
          }
          break;
        case 'dca_exit':
          successMessage = `Your DCA Exit vault has been created with systematic selling over ${timeBasedExits.length} period${timeBasedExits.length > 1 ? 's' : ''}.`;
          break;
        case 'halvening_cycle':
          successMessage = `Your Halvening Cycle vault has been created, targeting the next Bitcoin halving event.`;
          break;
      }
      
      toast({
        title: "Investment Vault Created Successfully",
        description: successMessage,
      });
      
      navigate('/my-vaults');
    } catch (error: any) {
      toast({
        title: "Error Creating Vault",
        description: error.message || "There was an error creating your investment vault",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderStrategyConfig = () => {
    switch (selectedStrategy) {
      case 'diamond_hands':
        return (
          <div className="space-y-4">
            <div className="bg-gray-900/50 rounded-lg p-4 border border-[#3F51FF]/30">
              <div className="flex items-center mb-4">
                <div className="bg-[#3F51FF]/20 p-3 rounded-full mr-3">
                  <i className="ri-hand-coin-line text-[#3F51FF] text-xl"></i>
                </div>
                <div>
                  <h4 className="text-white font-medium">Diamond Hands Strategy</h4>
                  <p className="text-xs text-gray-400">Long-term holding strategy to avoid emotional selling</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-gray-300">Minimum Hold Period (days)</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <Slider
                      value={[minHoldPeriod]}
                      min={30}
                      max={1460} // 4 years
                      step={30}
                      onValueChange={(value) => setMinHoldPeriod(value[0])}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-300 w-12 text-right">{minHoldPeriod}</span>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>30d</span>
                    <span>1y</span>
                    <span>2y</span>
                    <span>4y</span>
                  </div>
                </div>
                
                <Separator className="my-4 bg-gray-800" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-gray-900/20 border-gray-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-[#3F51FF]">Emergency Protocol</CardTitle>
                      <CardDescription className="text-xs">Protection against extreme market events</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Enable Emergency Exit</span>
                        <Switch 
                          checked={enableEmergencyProtocol} 
                          onCheckedChange={setEnableEmergencyProtocol} 
                        />
                      </div>
                      {enableEmergencyProtocol && (
                        <p className="text-xs text-gray-500 mt-2">
                          Allows emergency access during extreme market crashes (-80% or more)
                        </p>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gray-900/20 border-gray-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-[#3F51FF]">Analytics Panel</CardTitle>
                      <CardDescription className="text-xs">Track investment progress</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Enable Analytics</span>
                        <Switch 
                          checked={enableAnalytics} 
                          onCheckedChange={setEnableAnalytics} 
                        />
                      </div>
                      {enableAnalytics && (
                        <p className="text-xs text-gray-500 mt-2">
                          View performance metrics without ability to withdraw
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-black/20 rounded-md">
                <p className="text-xs text-gray-400">
                  <span className="font-medium text-white">Security Tip:</span> The Diamond Hands strategy is designed to help you overcome emotional selling during market turbulence. Assets will be completely locked until the minimum hold period has passed.
                </p>
              </div>
            </div>
          </div>
        );
        
      case 'profit_taking':
        return (
          <div className="space-y-4">
            <div className="bg-gray-900/50 rounded-lg p-4 border border-[#3F51FF]/30">
              <div className="flex items-center mb-4">
                <div className="bg-[#3F51FF]/20 p-3 rounded-full mr-3">
                  <i className="ri-line-chart-line text-[#3F51FF] text-xl"></i>
                </div>
                <div>
                  <h4 className="text-white font-medium">Profit-Taking Strategy</h4>
                  <p className="text-xs text-gray-400">Pre-define price points for taking profits</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-gray-300">Base Hold Period (days)</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <Slider
                      value={[minHoldPeriod]}
                      min={0}
                      max={365}
                      step={1}
                      onValueChange={(value) => setMinHoldPeriod(value[0])}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-300 w-12 text-right">{minHoldPeriod}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum period before any profit-taking can occur
                  </p>
                </div>
                
                <Separator className="my-4 bg-gray-800" />
                
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-sm text-gray-300">Price Targets</Label>
                    <Badge className="bg-[#3F51FF]/90 hover:bg-[#3F51FF]">
                      Total: {calculateTotalPercentage()}%
                    </Badge>
                  </div>
                  
                  {priceTargets.map((target, index) => (
                    <div key={target.id} className="flex items-center space-x-3 mb-3">
                      <div className="flex-1">
                        <Input
                          type="text"
                          placeholder={`Target price in ${assetType === 'BTC' ? 'USD' : 'USD'}`}
                          value={target.price}
                          onChange={(e) => handlePriceTargetChange(target.id, 'price', e.target.value)}
                          className="bg-gray-800 border-gray-700"
                        />
                      </div>
                      <div className="w-16">
                        <Input
                          type="number"
                          min="1"
                          max="100"
                          value={target.percentage}
                          onChange={(e) => handlePriceTargetChange(target.id, 'percentage', parseInt(e.target.value) || 0)}
                          className="bg-gray-800 border-gray-700"
                        />
                      </div>
                      <div className="w-10 text-sm text-gray-300">%</div>
                      {priceTargets.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handlePriceTargetRemove(target.id)}
                          className="h-8 w-8 text-gray-400 hover:text-white"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </Button>
                      )}
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handlePriceTargetAdd}
                    className="mt-2 border-[#3F51FF]/30 hover:bg-[#3F51FF]/10 text-[#3F51FF] w-full"
                  >
                    <i className="ri-add-line mr-1"></i> Add Price Target
                  </Button>
                  
                  <p className="text-xs text-gray-500 mt-2">
                    Define price targets and percentage of holdings to sell at each target
                  </p>
                </div>
                
                <Separator className="my-4 bg-gray-800" />
                
                {/* Technical Indicators Section */}
                <div>
                  <Label className="text-sm text-gray-300 mb-3 block">Technical Analysis Triggers</Label>
                  
                  <TechnicalIndicators 
                    indicators={technicalIndicators}
                    onChange={setTechnicalIndicators}
                  />
                  
                  <p className="text-xs text-gray-500 mt-2">
                    Set up automated exit conditions based on technical indicators with Chainlink oracle data
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'dca_exit':
        return (
          <div className="space-y-4">
            <div className="bg-gray-900/50 rounded-lg p-4 border border-[#3F51FF]/30">
              <div className="flex items-center mb-4">
                <div className="bg-[#3F51FF]/20 p-3 rounded-full mr-3">
                  <i className="ri-calendar-line text-[#3F51FF] text-xl"></i>
                </div>
                <div>
                  <h4 className="text-white font-medium">DCA Exit Strategy</h4>
                  <p className="text-xs text-gray-400">Systematic selling at regular intervals</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-gray-300">Base Hold Period (days)</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <Slider
                      value={[minHoldPeriod]}
                      min={0}
                      max={365}
                      step={1}
                      onValueChange={(value) => setMinHoldPeriod(value[0])}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-300 w-12 text-right">{minHoldPeriod}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum period before any selling can begin
                  </p>
                </div>
                
                <Separator className="my-4 bg-gray-800" />
                
                <div>
                  <Label className="text-sm text-gray-300 mb-3 block">Time-Based Exit Points</Label>
                  
                  {timeBasedExits.map((exit, index) => (
                    <div key={index} className="flex items-center space-x-3 mb-3">
                      <div className="flex-1">
                        <Input
                          type="date"
                          value={exit.date}
                          onChange={(e) => handleTimeBasedExitChange(index, 'date', e.target.value)}
                          className="bg-gray-800 border-gray-700"
                        />
                      </div>
                      <div className="w-16">
                        <Input
                          type="number"
                          min="1"
                          max="100"
                          value={exit.percentage}
                          onChange={(e) => handleTimeBasedExitChange(index, 'percentage', parseInt(e.target.value) || 0)}
                          className="bg-gray-800 border-gray-700"
                        />
                      </div>
                      <div className="w-10 text-sm text-gray-300">%</div>
                      {timeBasedExits.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleTimeBasedExitRemove(index)}
                          className="h-8 w-8 text-gray-400 hover:text-white"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </Button>
                      )}
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleTimeBasedExitAdd}
                    className="mt-2 border-[#3F51FF]/30 hover:bg-[#3F51FF]/10 text-[#3F51FF] w-full"
                  >
                    <i className="ri-add-line mr-1"></i> Add Exit Date
                  </Button>
                  
                  <p className="text-xs text-gray-500 mt-2">
                    Define dates for systematic selling regardless of market price
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'halvening_cycle':
        return (
          <div className="space-y-4">
            <div className="bg-gray-900/50 rounded-lg p-4 border border-[#3F51FF]/30">
              <div className="flex items-center mb-4">
                <div className="bg-[#3F51FF]/20 p-3 rounded-full mr-3">
                  <i className="ri-bitcoin-line text-[#3F51FF] text-xl"></i>
                </div>
                <div>
                  <h4 className="text-white font-medium">Halvening Cycle Strategy</h4>
                  <p className="text-xs text-gray-400">Time investments to Bitcoin's halvening event</p>
                </div>
              </div>
              
              <div className="p-4 bg-black/30 rounded-lg mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="text-sm font-medium text-white">Next Bitcoin Halvening</h5>
                    <p className="text-xs text-gray-400">Estimated date: April 13, 2028</p>
                  </div>
                  <Badge className="bg-[#F7931A]/80">~1071 days</Badge>
                </div>
                <Separator className="my-3 bg-gray-800" />
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-xs text-gray-500">Current Block</p>
                    <p className="text-sm font-medium text-white">895,875</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Blocks Until Halving</p>
                    <p className="text-sm font-medium text-white">154,125</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-gray-300">Post-Halvening Hold Period (days)</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <Slider
                      value={[minHoldPeriod]}
                      min={0}
                      max={365}
                      step={1}
                      onValueChange={(value) => setMinHoldPeriod(value[0])}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-300 w-12 text-right">{minHoldPeriod}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Additional days to hold after the halvening event occurs
                  </p>
                </div>
                
                <Separator className="my-4 bg-gray-800" />
                
                <div>
                  <Label className="text-sm text-gray-300 mb-3 block">Market Conditions</Label>
                  
                  {marketConditions.map((condition) => (
                    <div key={condition.id} className="flex items-center space-x-4 mb-3">
                      <Switch 
                        checked={condition.enabled} 
                        onCheckedChange={(checked) => handleMarketConditionChange(condition.id, 'enabled', checked)} 
                      />
                      <div className="flex-1">
                        <p className="text-sm text-gray-300">{condition.description}</p>
                        {condition.type === 'price' && condition.enabled && (
                          <Input
                            type="text"
                            placeholder="Price threshold"
                            value={condition.value}
                            onChange={(e) => handleMarketConditionChange(condition.id, 'value', e.target.value)}
                            className="mt-2 bg-gray-800 border-gray-700"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  const renderStepContent = () => {
    switch (step) {
      case 1: // Basic Info
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Create Investment Discipline Vault</h2>
              <p className="text-gray-400">Configure a vault that enforces investment discipline through programmable rules</p>
            </div>
            
            {/* Market Sentiment Alert - shows only in extreme conditions */}
            <SentimentAlert assetSymbol={assetType} sentimentData={sentimentData} />
            
            <Card className="bg-black/40 border-gray-800">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Set up the core details of your investment vault</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="vaultName">Vault Name</Label>
                  <Input
                    id="vaultName"
                    placeholder="E.g., BTC Long-Term HODL Vault"
                    value={vaultName}
                    onChange={(e) => setVaultName(e.target.value)}
                    className="bg-gray-800 border-gray-700 mt-1"
                  />
                </div>
                
                <div>
                  <Label>Asset Type</Label>
                  <Select 
                    value={assetType} 
                    onValueChange={(value) => {
                      setAssetType(value);
                      // Fetch sentiment data when asset type changes
                      sentimentAnalysisService.getSentiment(value)
                        .then(data => setSentimentData(data))
                        .catch(err => console.error("Error fetching sentiment data:", err));
                      
                      sentimentAnalysisService.getActionRecommendations(value)
                        .then(recs => setSentimentRecommendations(recs))
                        .catch(err => console.error("Error fetching recommendations:", err));
                    }}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 mt-1">
                      <SelectValue placeholder="Select Asset" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                      <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                      <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                      <SelectItem value="SOL">Solana (SOL)</SelectItem>
                      <SelectItem value="TON">TON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="initialAmount">Initial Amount</Label>
                  <div className="relative mt-1">
                    <Input
                      id="initialAmount"
                      placeholder={`Amount in ${assetType}`}
                      value={initialAmount}
                      onChange={(e) => setInitialAmount(e.target.value)}
                      className="bg-gray-800 border-gray-700 pr-12"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                      {assetType}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/40 border-gray-800">
              <CardHeader>
                <CardTitle>Investment Strategy</CardTitle>
                <CardDescription>Choose how you want to enforce investment discipline</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="diamond_hands" onValueChange={(value) => setSelectedStrategy(value as InvestmentStrategy)}>
                  <TabsList className="grid grid-cols-2 md:grid-cols-4">
                    <TabsTrigger value="diamond_hands">HODL</TabsTrigger>
                    <TabsTrigger value="profit_taking">Profit-Taking</TabsTrigger>
                    <TabsTrigger value="dca_exit">DCA Exit</TabsTrigger>
                    <TabsTrigger value="halvening_cycle">Halvening Cycle</TabsTrigger>
                  </TabsList>
                  <div className="mt-4 bg-gray-900/30 rounded-lg p-4">
                    {selectedStrategy === 'diamond_hands' && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-[#3F51FF]">Diamond Hands Strategy</h4>
                        <p className="text-xs text-gray-400">Lock your assets for a fixed period to avoid emotional selling during market volatility. Perfect for long-term HODLers who want to enforce discipline.</p>
                      </div>
                    )}
                    {selectedStrategy === 'profit_taking' && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-[#3F51FF]">Profit-Taking Strategy</h4>
                        <p className="text-xs text-gray-400">Pre-define price targets at which to take profits. The vault will automatically execute sales when those prices are reached.</p>
                      </div>
                    )}
                    {selectedStrategy === 'dca_exit' && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-[#3F51FF]">DCA Exit Strategy</h4>
                        <p className="text-xs text-gray-400">Dollar-cost average your exit by splitting sales across multiple dates, regardless of price. Reduces timing risk and emotional decision-making.</p>
                      </div>
                    )}
                    {selectedStrategy === 'halvening_cycle' && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-[#3F51FF]">Halvening Cycle Strategy</h4>
                        <p className="text-xs text-gray-400">Align your investment with Bitcoin's halvening cycles. Lock assets until after the next halvening event to capture potential appreciation.</p>
                      </div>
                    )}
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        );
        
      case 2: // Strategy Configuration
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">{selectedStrategy === 'diamond_hands' ? 'HODL' : selectedStrategy === 'profit_taking' ? 'Profit-Taking' : selectedStrategy === 'dca_exit' ? 'DCA Exit' : 'Halvening Cycle'} Strategy</h2>
              <p className="text-gray-400">Configure the specific parameters for your investment strategy</p>
            </div>
            
            {renderStrategyConfig()}
          </div>
        );
        
      case 3: // Blockchain & Security
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Security Configuration</h2>
              <p className="text-gray-400">Set up vault security options and blockchain preferences</p>
            </div>
            
            <Card className="bg-black/40 border-gray-800">
              <CardHeader>
                <CardTitle>Blockchain Selection</CardTitle>
                <CardDescription>Choose which blockchain to deploy your vault on</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div 
                    className={`p-4 rounded-lg cursor-pointer border transition-colors ${selectedBlockchain === BlockchainType.ETHEREUM ? 'border-[#627EEA] bg-[#627EEA]/10' : 'border-gray-700 bg-black/20 hover:bg-black/30'}`}
                    onClick={() => handleBlockchainSelect(BlockchainType.ETHEREUM)}
                  >
                    <div className="flex items-center">
                      <div className="bg-[#627EEA]/20 p-2 rounded-full mr-2">
                        <i className="ri-ethereum-fill text-[#627EEA]"></i>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-white">Ethereum</h4>
                        <p className="text-xs text-gray-400">Main ownership records</p>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className={`p-4 rounded-lg cursor-pointer border transition-colors ${selectedBlockchain === BlockchainType.SOLANA ? 'border-[#14F195] bg-[#14F195]/10' : 'border-gray-700 bg-black/20 hover:bg-black/30'}`}
                    onClick={() => handleBlockchainSelect(BlockchainType.SOLANA)}
                  >
                    <div className="flex items-center">
                      <div className="bg-[#14F195]/20 p-2 rounded-full mr-2">
                        <i className="ri-sun-fill text-[#14F195]"></i>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-white">Solana</h4>
                        <p className="text-xs text-gray-400">High-speed monitoring</p>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className={`p-4 rounded-lg cursor-pointer border transition-colors ${selectedBlockchain === BlockchainType.TON ? 'border-[#0098EA] bg-[#0098EA]/10' : 'border-gray-700 bg-black/20 hover:bg-black/30'}`}
                    onClick={() => handleBlockchainSelect(BlockchainType.TON)}
                  >
                    <div className="flex items-center">
                      <div className="bg-[#0098EA]/20 p-2 rounded-full mr-2">
                        <i className="ri-currency-fill text-[#0098EA]"></i>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-white">TON</h4>
                        <p className="text-xs text-gray-400">Backup & recovery</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Label className="text-sm text-gray-300">Connection Status</Label>
                  <div className="p-3 mt-1 rounded-lg bg-black/20 border border-gray-800">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${isWalletConnected(selectedBlockchain) ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                      <span className="text-sm text-gray-300">
                        {isWalletConnected(selectedBlockchain) 
                          ? `Connected to ${selectedBlockchain} wallet` 
                          : `Not connected to ${selectedBlockchain} wallet`}
                      </span>
                    </div>
                    {!isWalletConnected(selectedBlockchain) && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2 w-full bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700"
                      >
                        Connect Wallet
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/40 border-gray-800">
              <CardHeader>
                <CardTitle>Market Sentiment Analysis</CardTitle>
                <CardDescription>AI-powered protection against emotional investing decisions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <SentimentGauge
                      assetSymbol={assetType}
                      onSentimentUpdate={setSentimentData}
                    />
                  </div>
                  <div className="lg:col-span-2 bg-black/30 rounded-lg p-4 border border-gray-800">
                    <h3 className="text-lg font-medium text-gray-200 mb-2">
                      AI Investment Recommendations
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Our AI analyzes market sentiment to help prevent emotional decision-making during extreme market conditions.
                    </p>
                    
                    <SentimentRecommendations
                      assetSymbol={assetType}
                      onRecommendationsUpdate={setSentimentRecommendations}
                    />
                    
                    <div className="mt-6 pt-4 border-t border-gray-800">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="enable-sentiment-protection" className="text-sm font-medium text-gray-300">
                            Enable Sentiment Protection
                          </Label>
                          <p className="text-xs text-gray-500 mt-1">
                            Automatically adjust your strategy during extreme market conditions
                          </p>
                        </div>
                        <Switch
                          id="enable-sentiment-protection"
                          checked={enableSentimentProtection}
                          onCheckedChange={setEnableSentimentProtection}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/40 border-gray-800">
              <CardHeader>
                <CardTitle>Security Features</CardTitle>
                <CardDescription>Enhance the security of your investment vault</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm text-gray-300">Security Level</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <Slider
                      value={[securityLevel]}
                      min={1}
                      max={5}
                      step={1}
                      onValueChange={(value) => setSecurityLevel(value[0])}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-300 w-12 text-right">{securityLevel}/5</span>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>Basic</span>
                    <span>Standard</span>
                    <span>Enhanced</span>
                    <span>Advanced</span>
                    <span>Maximum</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <Label className="text-sm text-gray-300">Cross-Chain Verification</Label>
                    <p className="text-xs text-gray-500">Verify transactions across multiple blockchains</p>
                  </div>
                  <Switch 
                    checked={crossChainEnabled} 
                    onCheckedChange={setCrossChainEnabled} 
                  />
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <Label className="text-sm text-gray-300">Portfolio Rebalancing</Label>
                    <p className="text-xs text-gray-500">Maintain target allocation percentages</p>
                  </div>
                  <Switch 
                    checked={enableRebalancing} 
                    onCheckedChange={setEnableRebalancing} 
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#3F51FF] to-[#8F9FFF]">
              Investment Discipline Vault
            </h1>
            <p className="text-gray-400 mt-1">
              Create programmatic rules to enforce investment discipline and avoid emotional decisions
            </p>
          </div>
          
          <div className="hidden md:block">
            <Badge className="bg-[#3F51FF] hover:bg-[#3F51FF]/80">
              Step {step} of 3
            </Badge>
          </div>
        </div>
        
        <div className="w-full bg-gray-800 h-1 mt-6 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#3F51FF] to-[#8F9FFF] transition-all duration-300" 
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="min-h-[400px]">
        {renderStepContent()}
      </div>
      
      <div className="mt-8 flex justify-between">
        {step > 1 ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={isLoading}
            className="border-gray-700 bg-black/20 hover:bg-black/40"
          >
            Previous
          </Button>
        ) : (
          <div></div>
        )}
        
        {step < 3 ? (
          <Button
            type="button"
            onClick={() => setStep(step + 1)}
            disabled={isLoading}
            className="bg-[#3F51FF] hover:bg-[#3F51FF]/80"
          >
            Next
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleCreateVault}
            disabled={isLoading}
            className="bg-[#3F51FF] hover:bg-[#3F51FF]/80"
          >
            {isLoading ? (
              <>
                <i className="ri-loader-4-line animate-spin mr-2"></i>
                Creating Vault...
              </>
            ) : (
              'Create Vault'
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

export default InvestmentDisciplineVault;