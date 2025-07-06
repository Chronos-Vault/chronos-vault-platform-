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
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Shield, 
  BarChart4, 
  LineChart, 
  Timer, 
  Settings, 
  LockKeyhole, 
  PieChart, 
  TrendingUp, 
  CircleDollarSign,
  BrainCircuit,
  Server,
  Network,
  LucideShield,
  ChevronRight,
  AlertTriangle,
  Lightbulb,
  Fingerprint,
  PlusCircle,
  RefreshCw,
  MinusCircle,
  CheckCircle,
  GitFork
} from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { BlockchainType } from '@/contexts/multi-chain-context';
import { useTon } from '@/contexts/ton-context';
import { useEthereum } from '@/contexts/ethereum-context';
import { useSolana } from '@/contexts/solana-context';
import { SentimentAnalysis } from '@/components/sentiment/sentiment-analysis';
import SentimentAlerts from '@/components/sentiment/sentiment-alerts';
import { SentimentData, sentimentAnalysisService, SentimentLevel } from '@/services/sentiment-analysis-service';
import { TechnicalIndicators, TechnicalIndicator } from '@/components/technical/technical-indicators';
import { MarketDataDashboard } from '@/components/oracle/market-data-dashboard';
import { PortfolioManagement } from '@/components/portfolio/portfolio-management';
import { EmergencyProtocols } from '@/components/emergency/emergency-protocols';
import { StrategyTester } from '@/components/strategy/strategy-tester';
import { VaultDeploymentMonitor } from '@/components/monitoring/vault-deployment-monitor';
import { AdvancedFeaturesDashboard } from '@/components/advanced-features-dashboard';

// Enhanced types
type Chain = 'ethereum' | 'ton' | 'solana' | 'bitcoin' | 'polygon' | 'avalanche' | 'polkadot';
type AssetClass = 'crypto' | 'stocks' | 'commodities' | 'forex' | 'indices' | 'nft' | 'stable';
type ProtectionMechanism = 'quantum' | 'zkp' | 'multisig' | 'timelock' | 'ai' | 'dualchain' | 'triplechain';
type InvestmentAlgorithm = 'market_neutral' | 'momentum' | 'mean_reversion' | 'dca' | 'value' | 'growth' | 'hybrid';
type AutomationLevel = 'manual' | 'semi' | 'full' | 'adaptive' | 'ai_driven';

// Enhanced exit strategy types
type PriceTarget = {
  id: string;
  price: string;
  percentage: number;
  chain: Chain;
  triggerMechanism: 'market' | 'oracle' | 'hybrid' | 'crosschain';
};

type TimeBasedExit = {
  id: string;
  date: string;
  percentage: number;
  rebalanceBefore: boolean;
  notificationThreshold: number; // days before
};

type MarketCondition = {
  id: string;
  type: 'price' | 'halving' | 'event' | 'correlation' | 'volatility' | 'sentiment' | 'onchain';
  description: string;
  value: string;
  threshold: number;
  enabled: boolean;
  chainSpecific?: Chain;
  dataSource?: 'chainlink' | 'pyth' | 'internal' | 'api3' | 'hybrid';
};

type RiskManagementRule = {
  id: string;
  type: 'stopLoss' | 'trailingStop' | 'volatilityBased' | 'correlationBased' | 'timeDecay' | 'sentimentShift';
  threshold: number;
  enabled: boolean;
  applyTo: 'portfolio' | 'asset' | 'strategy';
  recoveryAction?: 'lock' | 'partial_exit' | 'full_exit' | 'hedge' | 'alert';
};

type CrossChainStrategy = {
  enabled: boolean;
  primaryChain: Chain;
  distributions: Record<Chain, number>;
  rebalanceFrequency: 'manual' | 'daily' | 'weekly' | 'monthly' | 'trigger_based';
  bridgePreference: 'native' | 'layerzero' | 'wormhole' | 'hyperlane' | 'automatic';
  gasOptimization: boolean;
};

type InvestmentStrategy = 'diamond_hands' | 'profit_taking' | 'dca_exit' | 'halvening_cycle' | 'ai_adaptive' | 'quantum_arbitrage' | 'strategic_rebalance';

function InvestmentDisciplineVaultAdvanced() {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const ton = useTon();
  const ethereum = useEthereum();
  const solana = useSolana();
  
  // UI State
  const [activeTab, setActiveTab] = useState<string>("basic");
  const [step, setStep] = useState<number>(1);
  const [progress, setProgress] = useState<number>(16);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [deploymentProgress, setDeploymentProgress] = useState<number>(0);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [vaultId, setVaultId] = useState<string>("");
  const [showAdvancedSettings, setShowAdvancedSettings] = useState<boolean>(false);
  
  // Basic vault info
  const [vaultName, setVaultName] = useState<string>('');
  const [assetClasses, setAssetClasses] = useState<AssetClass[]>(['crypto']);
  const [primaryAsset, setPrimaryAsset] = useState<string>('BTC');
  const [initialAmount, setInitialAmount] = useState<string>('');
  const [selectedChains, setSelectedChains] = useState<Chain[]>(['ethereum', 'ton', 'solana']);
  const [primaryChain, setPrimaryChain] = useState<Chain>('ethereum');
  
  // Advanced investment configuration
  const [selectedStrategy, setSelectedStrategy] = useState<InvestmentStrategy>('strategic_rebalance');
  const [automationLevel, setAutomationLevel] = useState<AutomationLevel>('adaptive');
  const [algorithms, setAlgorithms] = useState<InvestmentAlgorithm[]>(['market_neutral', 'dca']);
  const [minHoldPeriod, setMinHoldPeriod] = useState<number>(90); // days
  const [maxLockPeriod, setMaxLockPeriod] = useState<number>(365); // days
  const [reinvestDividends, setReinvestDividends] = useState<boolean>(true);
  const [dynamicRebalancing, setDynamicRebalancing] = useState<boolean>(true);
  const [rebalanceThreshold, setRebalanceThreshold] = useState<number>(5); // percent
  const [rebalanceFrequency, setRebalanceFrequency] = useState<string>('trigger_based');
  
  // Protection mechanisms
  const [protectionMechanisms, setProtectionMechanisms] = useState<ProtectionMechanism[]>(['quantum', 'timelock', 'triplechain']);
  const [securityLevel, setSecurityLevel] = useState<number>(5);
  const [enableEmergencyProtocol, setEnableEmergencyProtocol] = useState<boolean>(true);
  const [emergencyThreshold, setEmergencyThreshold] = useState<number>(25); // percent
  const [recoveryAddresses, setRecoveryAddresses] = useState<string[]>(['']);
  const [earlyWithdrawalFee, setEarlyWithdrawalFee] = useState<boolean>(true);
  const [withdrawalFeePercentage, setWithdrawalFeePercentage] = useState<number>(20);
  const [feeReducesOverTime, setFeeReducesOverTime] = useState<boolean>(true);
  const [multisigThreshold, setMultisigThreshold] = useState<number>(2);
  
  // Price targets for exit strategies
  const [priceTargets, setPriceTargets] = useState<PriceTarget[]>([
    { 
      id: '1', 
      price: '', 
      percentage: 25, 
      chain: 'ethereum',
      triggerMechanism: 'oracle'
    }
  ]);
  
  // Time-based exit strategy
  const [timeBasedExits, setTimeBasedExits] = useState<TimeBasedExit[]>([
    { 
      id: '1',
      date: '', 
      percentage: 50,
      rebalanceBefore: true,
      notificationThreshold: 7
    }
  ]);
  
  // Market conditions for event-based strategies
  const [marketConditions, setMarketConditions] = useState<MarketCondition[]>([
    { 
      id: '1', 
      type: 'halving', 
      description: 'Bitcoin Halving', 
      value: 'next_halving', 
      threshold: 10,
      enabled: true,
      dataSource: 'chainlink'
    },
    { 
      id: '2', 
      type: 'price', 
      description: 'Market Crash Protection', 
      value: '', 
      threshold: 20,
      enabled: false,
      dataSource: 'chainlink'
    },
    {
      id: '3',
      type: 'sentiment',
      description: 'Market Sentiment Shift',
      value: 'bearish',
      threshold: 65,
      enabled: true,
      dataSource: 'internal'
    }
  ]);
  
  // Risk management rules
  const [riskManagementRules, setRiskManagementRules] = useState<RiskManagementRule[]>([
    {
      id: '1',
      type: 'stopLoss',
      threshold: 15,
      enabled: true,
      applyTo: 'portfolio',
      recoveryAction: 'partial_exit'
    },
    {
      id: '2',
      type: 'trailingStop',
      threshold: 10,
      enabled: false,
      applyTo: 'asset',
      recoveryAction: 'lock'
    }
  ]);
  
  // Cross-chain strategy
  const [crossChainStrategy, setCrossChainStrategy] = useState<CrossChainStrategy>({
    enabled: true,
    primaryChain: 'ethereum',
    distributions: {
      'ethereum': 40,
      'ton': 30,
      'solana': 30,
      'bitcoin': 0,
      'polygon': 0,
      'avalanche': 0,
      'polkadot': 0
    },
    rebalanceFrequency: 'trigger_based',
    bridgePreference: 'automatic',
    gasOptimization: true
  });
  
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
      enabled: true
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
  
  // Sentiment analysis data
  const [sentimentData, setSentimentData] = useState<SentimentData | undefined>(undefined);
  const [sentimentRecommendations, setSentimentRecommendations] = useState<string[]>([]);
  const [enableSentimentProtection, setEnableSentimentProtection] = useState<boolean>(true);
  
  // Features
  const [enableAnalytics, setEnableAnalytics] = useState<boolean>(true);
  const [enableAIAssistance, setEnableAIAssistance] = useState<boolean>(true);
  const [enableQuantumResistance, setEnableQuantumResistance] = useState<boolean>(true);
  const [enableCrossChainOptimization, setEnableCrossChainOptimization] = useState<boolean>(true);
  
  // HODL Strategy Configuration
  const [lockDuration, setLockDuration] = useState<'1_year' | '4_years' | 'custom'>('1_year');
  const [customYears, setCustomYears] = useState<number>(0);
  const [customMonths, setCustomMonths] = useState<number>(0);
  const [customDays, setCustomDays] = useState<number>(0);
  const [customHours, setCustomHours] = useState<number>(0);
  const [releaseOption, setReleaseOption] = useState<'full' | 'gradual'>('gradual');
  const [releaseSchedule, setReleaseSchedule] = useState<string>('30_days');
  const [releaseFrequency, setReleaseFrequency] = useState<string>('weekly');
  const [requireApproval, setRequireApproval] = useState<boolean>(true);
  
  // Side effects and handlers  
  useEffect(() => {
    // Update progress based on fields filled
    let totalFields = 0;
    let filledFields = 0;
    
    // Basic fields
    totalFields += 3;
    if (vaultName) filledFields += 1;
    if (initialAmount) filledFields += 1;
    if (primaryAsset) filledFields += 1;
    
    // Strategy fields
    totalFields += 4;
    if (selectedStrategy !== '') filledFields += 1;
    if (minHoldPeriod > 0) filledFields += 1;
    if (automationLevel !== '') filledFields += 1;
    if (algorithms.length > 0) filledFields += 1;
    
    // Security fields
    totalFields += 3;
    if (securityLevel > 0) filledFields += 1;
    if (protectionMechanisms.length > 0) filledFields += 1;
    if (riskManagementRules.length > 0) filledFields += 1;
    
    // Calculate progress percentage
    const newProgress = Math.min(100, Math.round((filledFields / totalFields) * 100));
    setProgress(newProgress);
  }, [
    vaultName, 
    initialAmount, 
    primaryAsset, 
    selectedStrategy, 
    minHoldPeriod, 
    automationLevel,
    algorithms,
    securityLevel,
    protectionMechanisms,
    riskManagementRules
  ]);
  
  // Handlers for price targets
  const handlePriceTargetAdd = () => {
    setPriceTargets([
      ...priceTargets, 
      { 
        id: Date.now().toString(), 
        price: '', 
        percentage: 25,
        chain: primaryChain,
        triggerMechanism: 'oracle'
      }
    ]);
  };
  
  const handlePriceTargetRemove = (id: string) => {
    setPriceTargets(priceTargets.filter(target => target.id !== id));
  };
  
  const handlePriceTargetChange = (id: string, field: keyof PriceTarget, value: any) => {
    setPriceTargets(priceTargets.map(target => {
      if (target.id === id) {
        return { ...target, [field]: value };
      }
      return target;
    }));
  };
  
  // Handlers for time-based exits
  const handleTimeBasedExitAdd = () => {
    setTimeBasedExits([
      ...timeBasedExits,
      { 
        id: Date.now().toString(),
        date: '', 
        percentage: 25,
        rebalanceBefore: true,
        notificationThreshold: 7
      }
    ]);
  };
  
  const handleTimeBasedExitRemove = (id: string) => {
    setTimeBasedExits(timeBasedExits.filter(exit => exit.id !== id));
  };
  
  const handleTimeBasedExitChange = (id: string, field: keyof TimeBasedExit, value: any) => {
    setTimeBasedExits(timeBasedExits.map(exit => {
      if (exit.id === id) {
        return { ...exit, [field]: value };
      }
      return exit;
    }));
  };
  
  // Handlers for market conditions
  const handleMarketConditionAdd = () => {
    setMarketConditions([
      ...marketConditions,
      {
        id: Date.now().toString(),
        type: 'price',
        description: 'New Market Condition',
        value: '',
        threshold: 10,
        enabled: true,
        dataSource: 'chainlink'
      }
    ]);
  };
  
  const handleMarketConditionRemove = (id: string) => {
    setMarketConditions(marketConditions.filter(condition => condition.id !== id));
  };
  
  const handleMarketConditionChange = (id: string, field: keyof MarketCondition, value: any) => {
    setMarketConditions(marketConditions.map(condition => {
      if (condition.id === id) {
        return { ...condition, [field]: value };
      }
      return condition;
    }));
  };
  
  // Handlers for risk management rules
  const handleRiskRuleAdd = () => {
    setRiskManagementRules([
      ...riskManagementRules,
      {
        id: Date.now().toString(),
        type: 'stopLoss',
        threshold: 15,
        enabled: true,
        applyTo: 'portfolio',
        recoveryAction: 'partial_exit'
      }
    ]);
  };
  
  const handleRiskRuleRemove = (id: string) => {
    setRiskManagementRules(riskManagementRules.filter(rule => rule.id !== id));
  };
  
  const handleRiskRuleChange = (id: string, field: keyof RiskManagementRule, value: any) => {
    setRiskManagementRules(riskManagementRules.map(rule => {
      if (rule.id === id) {
        return { ...rule, [field]: value };
      }
      return rule;
    }));
  };
  
  // Handler for cross-chain strategy distributions
  const handleDistributionChange = (chain: Chain, value: number) => {
    setCrossChainStrategy(prev => ({
      ...prev,
      distributions: {
        ...prev.distributions,
        [chain]: value
      }
    }));
  };
  
  // Handler for blockchain selection
  const handleChainSelect = (chain: Chain) => {
    if (selectedChains.includes(chain)) {
      setSelectedChains(selectedChains.filter(c => c !== chain));
      
      // If primary chain is removed, update primary chain
      if (primaryChain === chain && selectedChains.length > 1) {
        setPrimaryChain(selectedChains.find(c => c !== chain) || 'ethereum');
      }
    } else {
      setSelectedChains([...selectedChains, chain]);
    }
  };
  
  // Handler for setting primary chain
  const handleSetPrimaryChain = (chain: Chain) => {
    if (selectedChains.includes(chain)) {
      setPrimaryChain(chain);
      
      // Update cross-chain strategy
      if (crossChainStrategy.enabled) {
        setCrossChainStrategy(prev => ({
          ...prev,
          primaryChain: chain
        }));
      }
    }
  };
  
  // Handler for protection mechanisms
  const handleProtectionMechanismToggle = (mechanism: ProtectionMechanism) => {
    if (protectionMechanisms.includes(mechanism)) {
      setProtectionMechanisms(protectionMechanisms.filter(m => m !== mechanism));
    } else {
      setProtectionMechanisms([...protectionMechanisms, mechanism]);
    }
  };
  
  // Handler for asset classes
  const handleAssetClassToggle = (assetClass: AssetClass) => {
    if (assetClasses.includes(assetClass)) {
      setAssetClasses(assetClasses.filter(a => a !== assetClass));
    } else {
      setAssetClasses([...assetClasses, assetClass]);
    }
  };
  
  // Handler for investment algorithms
  const handleAlgorithmToggle = (algorithm: InvestmentAlgorithm) => {
    if (algorithms.includes(algorithm)) {
      setAlgorithms(algorithms.filter(a => a !== algorithm));
    } else {
      setAlgorithms([...algorithms, algorithm]);
    }
  };
  
  // Calculate total percentage for price targets
  const calculateTotalPercentage = (): number => {
    return priceTargets.reduce((total, target) => total + target.percentage, 0);
  };
  
  // Check if wallet is connected for a blockchain
  const isWalletConnected = (blockchain: Chain): boolean => {
    switch(blockchain) {
      case 'ton':
        return Boolean(ton.isConnected && ton.walletInfo?.address);
      case 'ethereum':
        return Boolean(ethereum.isConnected);
      case 'solana':
        return Boolean(solana.isConnected);
      default:
        return false;
    };
  };
  
  // Input validation function
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
    
    // Check cross-chain distributions if enabled
    if (enableCrossChainOptimization && crossChainStrategy.enabled) {
      const totalDistribution = Object.values(crossChainStrategy.distributions)
        .filter((_, index) => selectedChains.includes(Object.keys(crossChainStrategy.distributions)[index] as Chain))
        .reduce((sum, val) => sum + val, 0);
        
      if (Math.abs(totalDistribution - 100) > 0.1) {
        toast({
          title: "Invalid Cross-Chain Distribution",
          description: `Total cross-chain distribution should equal 100%, currently at ${totalDistribution.toFixed(1)}%`,
          variant: "destructive",
        });
        return false;
      }
    }
    
    return true;
  };
  
  // Form submission handler
  const handleCreateVault = async () => {
    if (!validateInputs()) return;
    
    setIsLoading(true);
    setIsDeploying(true);
    
    try {
      // Simulate deployment progress
      const interval = setInterval(() => {
        setDeploymentProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return prev;
          }
          return prev + Math.floor(Math.random() * 5) + 1;
        });
      }, 800);
      
      // Calculate the minimum unlock date based on the hold period
      const minUnlockDate = new Date();
      minUnlockDate.setDate(minUnlockDate.getDate() + minHoldPeriod);
      
      // Create specialized configuration based on the strategy
      const specializedConfig: Record<string, any> = {
        strategy: selectedStrategy,
        assetClasses: assetClasses,
        primaryAsset: primaryAsset,
        initialAmount: initialAmount,
        minHoldPeriod: minHoldPeriod,
        maxLockPeriod: maxLockPeriod,
        automationLevel: automationLevel,
        algorithms: algorithms,
        reinvestDividends: reinvestDividends,
        dynamicRebalancing: dynamicRebalancing,
        rebalanceThreshold: rebalanceThreshold,
        rebalanceFrequency: rebalanceFrequency,
        protectionMechanisms: protectionMechanisms,
        securityLevel: securityLevel,
        enableEmergencyProtocol: enableEmergencyProtocol,
        emergencyThreshold: emergencyThreshold,
        recoveryAddresses: recoveryAddresses.filter(a => a),
        earlyWithdrawalFee: earlyWithdrawalFee,
        withdrawalFeePercentage: withdrawalFeePercentage,
        feeReducesOverTime: feeReducesOverTime,
        multisigThreshold: multisigThreshold
      };
      
      // Add strategy-specific configuration
      if (selectedStrategy === 'profit_taking') {
        specializedConfig.priceTargets = priceTargets;
        // Add technical indicators if they exist
        if (technicalIndicators.some(indicator => indicator.enabled)) {
          specializedConfig.technicalIndicators = technicalIndicators.filter(indicator => indicator.enabled);
          specializedConfig.usesChainlinkOracles = true;
        }
      } else if (selectedStrategy === 'dca_exit') {
        specializedConfig.timeBasedExits = timeBasedExits;
      } else if (selectedStrategy === 'halvening_cycle' || selectedStrategy === 'ai_adaptive') {
        specializedConfig.marketConditions = marketConditions.filter(c => c.enabled);
      }
      
      // Add risk management rules
      if (riskManagementRules.some(rule => rule.enabled)) {
        specializedConfig.riskManagementRules = riskManagementRules.filter(rule => rule.enabled);
      }
      
      // Add cross-chain strategy if enabled
      if (enableCrossChainOptimization && crossChainStrategy.enabled) {
        specializedConfig.crossChainStrategy = {
          ...crossChainStrategy,
          distributions: Object.fromEntries(
            Object.entries(crossChainStrategy.distributions)
              .filter(([chain]) => selectedChains.includes(chain as Chain))
          )
        };
      }
      
      // Add sentiment analysis protection
      if (enableSentimentProtection) {
        specializedConfig.sentimentProtection = true;
        if (sentimentData) {
          specializedConfig.sentimentData = {
            score: sentimentData.score,
            level: sentimentData.level,
            timestamp: sentimentData.timestamp,
            sources: sentimentData.sources
          };
        }
        if (sentimentRecommendations.length > 0) {
          specializedConfig.sentimentRecommendations = sentimentRecommendations;
        }
      }
      
      // Add advanced features
      specializedConfig.enableAnalytics = enableAnalytics;
      specializedConfig.enableAIAssistance = enableAIAssistance;
      specializedConfig.enableQuantumResistance = enableQuantumResistance;
      
      // Create blockchain-specific configuration
      const blockchainConfig: Record<string, string> = {};
      selectedChains.forEach(chain => {
        switch(chain) {
          case 'ton':
            blockchainConfig.tonContractAddress = ton.walletInfo?.address || 'pending-deployment';
            break;
          case 'ethereum':
            blockchainConfig.ethereumContractAddress = ethereum.isConnected ? 'pending-deployment' : 'pending-deployment';
            break;
          case 'solana':
            blockchainConfig.solanaContractAddress = solana.isConnected ? 'pending-deployment' : 'pending-deployment';
            break;
          case 'bitcoin':
            blockchainConfig.bitcoinAddress = 'pending-derivation';
            break;
          case 'polygon':
            blockchainConfig.polygonContractAddress = 'pending-deployment';
            break;
          case 'avalanche':
            blockchainConfig.avalancheContractAddress = 'pending-deployment';
            break;
          case 'polkadot':
            blockchainConfig.polkadotAddress = 'pending-deployment';
            break;
        }
      });
      
      // Calculate asset value for security level determination
      let calculatedAssetValueUSD = 0;
      
      // Calculate USD value based on asset type
      if (primaryAsset === 'BTC') {
        calculatedAssetValueUSD = parseFloat(initialAmount) * 103106; // Current BTC price
      } else if (primaryAsset === 'ETH') {
        calculatedAssetValueUSD = parseFloat(initialAmount) * 3481;
      } else if (primaryAsset === 'SOL') {
        calculatedAssetValueUSD = parseFloat(initialAmount) * 168;
      } else if (primaryAsset === 'TON') {
        calculatedAssetValueUSD = parseFloat(initialAmount) * 7.24;
      }
      
      // Create vault data for API call
      const vaultData = {
        userId: 1, // This should be the actual user ID from auth
        name: vaultName,
        description: `Advanced Investment Discipline Vault with ${selectedStrategy.replace(/_/g, ' ')} strategy for ${primaryAsset} assets`,
        vaultType: 'investment-discipline-advanced',
        primaryAsset: primaryAsset,
        assetClasses: assetClasses,
        chains: selectedChains,
        primaryChain: primaryChain,
        assetAmount: initialAmount,
        assetValueUSD: calculatedAssetValueUSD.toString(),
        timeLockPeriod: minHoldPeriod,
        unlockDate: minUnlockDate.toISOString(),
        metadata: JSON.stringify({
          specializedType: 'investment-discipline-advanced',
          configuration: specializedConfig,
          blockchains: selectedChains,
          primaryChain: primaryChain,
          assetValueUSD: calculatedAssetValueUSD,
          calculatedAt: new Date().toISOString(),
          version: '2.0'
        }),
        ...blockchainConfig,
        securityLevel: securityLevel,
        crossChainEnabled: enableCrossChainOptimization && crossChainStrategy.enabled,
        privacyEnabled: protectionMechanisms.includes('zkp')
      };
      
      // Simulate API call delay with success
      setTimeout(async () => {
        try {
          // Mock successful response for demo
          const mockResponse = {
            id: `IDV-${Date.now().toString().slice(-8)}`,
            status: 'created',
            deploymentStatus: 'pending',
            createdAt: new Date().toISOString()
          };
          
          setVaultId(mockResponse.id);
          setDeploymentProgress(100);
          setIsSuccess(true);
          
          // Show success toast
          toast({
            title: "Vault Created Successfully",
            description: `Your Investment Discipline Vault (${mockResponse.id}) has been created and is being deployed to the blockchain.`,
            variant: "default",
          });
          
          // Simulate redirect after successful completion
          setTimeout(() => {
            navigate('/dashboard');
          }, 3000);
        } catch (error) {
          console.error("Error creating vault:", error);
          toast({
            title: "Error Creating Vault",
            description: "There was an error creating your vault. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
          setIsDeploying(false);
        }
      }, 5000);
    } catch (error) {
      console.error("Error in vault creation process:", error);
      toast({
        title: "Error Creating Vault",
        description: "There was an error in the vault creation process. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
      setIsDeploying(false);
    }
  };
  
  // Render function for advanced strategy configuration
  const renderAdvancedStrategyConfig = () => {
    switch (selectedStrategy) {
      case 'diamond_hands':
        return (
          <div className="space-y-6">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="lock-duration">Lock Duration</Label>
              <Select 
                value={lockDuration}
                onValueChange={(value) => setLockDuration(value as any)}
              >
                <SelectTrigger id="lock-duration">
                  <SelectValue placeholder="Select lock duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1_year">1 Year (Standard HODL)</SelectItem>
                  <SelectItem value="4_years">4 Years (Full Cycle HODL)</SelectItem>
                  <SelectItem value="custom">Custom Period</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {lockDuration === 'custom' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="custom-years">Years</Label>
                  <Input
                    id="custom-years"
                    type="number"
                    min="0"
                    max="10"
                    value={customYears}
                    onChange={(e) => setCustomYears(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="custom-months">Months</Label>
                  <Input
                    id="custom-months"
                    type="number"
                    min="0"
                    max="11"
                    value={customMonths}
                    onChange={(e) => setCustomMonths(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="custom-days">Days</Label>
                  <Input
                    id="custom-days"
                    type="number"
                    min="0"
                    max="30"
                    value={customDays}
                    onChange={(e) => setCustomDays(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="custom-hours">Hours</Label>
                  <Input
                    id="custom-hours"
                    type="number"
                    min="0"
                    max="23"
                    value={customHours}
                    onChange={(e) => setCustomHours(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            )}
            
            <div className="flex flex-col space-y-2">
              <Label htmlFor="release-option">Release Option</Label>
              <Select 
                value={releaseOption}
                onValueChange={(value) => setReleaseOption(value as any)}
              >
                <SelectTrigger id="release-option">
                  <SelectValue placeholder="Select release option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full Release at Unlock Date</SelectItem>
                  <SelectItem value="gradual">Gradual Release</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {releaseOption === 'gradual' && (
              <>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="release-schedule">Release Period</Label>
                  <Select 
                    value={releaseSchedule}
                    onValueChange={(value) => setReleaseSchedule(value)}
                  >
                    <SelectTrigger id="release-schedule">
                      <SelectValue placeholder="Select release schedule" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7_days">7 Days</SelectItem>
                      <SelectItem value="14_days">14 Days</SelectItem>
                      <SelectItem value="30_days">30 Days</SelectItem>
                      <SelectItem value="60_days">60 Days</SelectItem>
                      <SelectItem value="90_days">90 Days</SelectItem>
                      <SelectItem value="180_days">180 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="release-frequency">Release Frequency</Label>
                  <Select 
                    value={releaseFrequency}
                    onValueChange={(value) => setReleaseFrequency(value)}
                  >
                    <SelectTrigger id="release-frequency">
                      <SelectValue placeholder="Select release frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Biweekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            
            <div className="flex items-center justify-between">
              <Label htmlFor="early-withdrawal-fee">Early Withdrawal Fee</Label>
              <Switch 
                id="early-withdrawal-fee" 
                checked={earlyWithdrawalFee}
                onCheckedChange={setEarlyWithdrawalFee}
              />
            </div>
            
            {earlyWithdrawalFee && (
              <>
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="withdrawal-fee-percentage">Fee Percentage: {withdrawalFeePercentage}%</Label>
                  </div>
                  <Slider
                    id="withdrawal-fee-percentage"
                    min={1}
                    max={50}
                    step={1}
                    value={[withdrawalFeePercentage]}
                    onValueChange={(value) => setWithdrawalFeePercentage(value[0])}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="fee-reduces-over-time">Fee Reduces Over Time</Label>
                  <Switch 
                    id="fee-reduces-over-time" 
                    checked={feeReducesOverTime}
                    onCheckedChange={setFeeReducesOverTime}
                  />
                </div>
              </>
            )}
            
            <div className="flex items-center justify-between">
              <Label htmlFor="require-approval">Require Multisig Approval for Withdrawal</Label>
              <Switch 
                id="require-approval" 
                checked={requireApproval}
                onCheckedChange={setRequireApproval}
              />
            </div>
          </div>
        );
        
      case 'profit_taking':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Price Targets</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePriceTargetAdd}
              >
                <PlusCircle className="h-4 w-4 mr-1" /> Add Target
              </Button>
            </div>
            
            {priceTargets.map((target, index) => (
              <div key={target.id} className="space-y-4 p-4 border rounded-lg relative">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => handlePriceTargetRemove(target.id)}
                  disabled={priceTargets.length <= 1}
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
                
                <div className="flex flex-col space-y-2">
                  <Label htmlFor={`price-${target.id}`}>Target Price</Label>
                  <Input
                    id={`price-${target.id}`}
                    type="text"
                    placeholder={`Target ${index + 1} price in USD`}
                    value={target.price}
                    onChange={(e) => handlePriceTargetChange(target.id, 'price', e.target.value)}
                  />
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Label htmlFor={`percentage-${target.id}`}>Exit Percentage: {target.percentage}%</Label>
                  <Slider
                    id={`percentage-${target.id}`}
                    min={1}
                    max={100}
                    step={1}
                    value={[target.percentage]}
                    onValueChange={(value) => handlePriceTargetChange(target.id, 'percentage', value[0])}
                  />
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Label htmlFor={`chain-${target.id}`}>Verification Chain</Label>
                  <Select 
                    value={target.chain}
                    onValueChange={(value) => handlePriceTargetChange(target.id, 'chain', value)}
                  >
                    <SelectTrigger id={`chain-${target.id}`}>
                      <SelectValue placeholder="Select chain" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedChains.map(chain => (
                        <SelectItem key={chain} value={chain}>
                          {chain.charAt(0).toUpperCase() + chain.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Label htmlFor={`trigger-${target.id}`}>Trigger Mechanism</Label>
                  <Select 
                    value={target.triggerMechanism}
                    onValueChange={(value) => handlePriceTargetChange(target.id, 'triggerMechanism', value)}
                  >
                    <SelectTrigger id={`trigger-${target.id}`}>
                      <SelectValue placeholder="Select trigger mechanism" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="market">Market Price</SelectItem>
                      <SelectItem value="oracle">Oracle Data Feed</SelectItem>
                      <SelectItem value="hybrid">Hybrid (Market + Oracle)</SelectItem>
                      <SelectItem value="crosschain">Cross-Chain Verification</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
            
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Technical Indicators</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-sm text-gray-400 flex items-center">
                      <Lightbulb className="h-4 w-4 mr-1" />
                      Uses Chainlink Oracles
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-[280px]">These indicators use Chainlink oracle data feeds to trigger actions based on market conditions</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="space-y-4">
              {/* Moving Average Indicator */}
              <div className="flex items-center space-x-2">
                <Switch 
                  id="ma-enabled" 
                  checked={technicalIndicators[0].enabled}
                  onCheckedChange={(checked) => {
                    setTechnicalIndicators(technicalIndicators.map(indicator => {
                      if (indicator.id === '1') {
                        return { ...indicator, enabled: checked };
                      }
                      return indicator;
                    }));
                  }}
                />
                <Label htmlFor="ma-enabled">Moving Average (50-day) Crossing Down</Label>
              </div>
              
              {/* RSI Indicator */}
              <div className="flex items-center space-x-2">
                <Switch 
                  id="rsi-enabled" 
                  checked={technicalIndicators[1].enabled}
                  onCheckedChange={(checked) => {
                    setTechnicalIndicators(technicalIndicators.map(indicator => {
                      if (indicator.id === '2') {
                        return { ...indicator, enabled: checked };
                      }
                      return indicator;
                    }));
                  }}
                />
                <Label htmlFor="rsi-enabled">RSI (14-day) Above 70</Label>
              </div>
              
              {/* MACD Indicator */}
              <div className="flex items-center space-x-2">
                <Switch 
                  id="macd-enabled" 
                  checked={technicalIndicators[2].enabled}
                  onCheckedChange={(checked) => {
                    setTechnicalIndicators(technicalIndicators.map(indicator => {
                      if (indicator.id === '3') {
                        return { ...indicator, enabled: checked };
                      }
                      return indicator;
                    }));
                  }}
                />
                <Label htmlFor="macd-enabled">MACD Signal Line Crossing Down</Label>
              </div>
            </div>
            
            <div className="py-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="sentiment-protection">Sentiment-Based Protection</Label>
                <Switch 
                  id="sentiment-protection" 
                  checked={enableSentimentProtection}
                  onCheckedChange={setEnableSentimentProtection}
                />
              </div>
              <p className="text-sm text-gray-400 mt-1">
                Prevents selling during extreme market fear and FOMO during extreme greed
              </p>
            </div>
            
            {enableSentimentProtection && (
              <div className="p-4 bg-gray-800 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Current Market Sentiment</h4>
                <div className="grid grid-cols-5 gap-2 mb-2">
                  {['Extreme Fear', 'Fear', 'Neutral', 'Greed', 'Extreme Greed'].map((sentiment, i) => (
                    <div 
                      key={i}
                      className={`text-xs text-center py-1 rounded ${
                        i === 3 ? 'bg-amber-600/30 text-amber-300' : 'bg-gray-700'
                      }`}
                    >
                      {sentiment}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400">
                  Current reading: <span className="text-amber-300">Greed (72)</span> • Last updated: May 18, 2025
                </p>
              </div>
            )}
          </div>
        );
        
      case 'dca_exit':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Time-Based Exit Points</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleTimeBasedExitAdd}
              >
                <PlusCircle className="h-4 w-4 mr-1" /> Add Exit Point
              </Button>
            </div>
            
            {timeBasedExits.map((exit, index) => (
              <div key={exit.id} className="space-y-4 p-4 border rounded-lg relative">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => handleTimeBasedExitRemove(exit.id)}
                  disabled={timeBasedExits.length <= 1}
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
                
                <div className="flex flex-col space-y-2">
                  <Label htmlFor={`date-${exit.id}`}>Exit Date</Label>
                  <Input
                    id={`date-${exit.id}`}
                    type="date"
                    value={exit.date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => handleTimeBasedExitChange(exit.id, 'date', e.target.value)}
                  />
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Label htmlFor={`percentage-${exit.id}`}>Exit Percentage: {exit.percentage}%</Label>
                  <Slider
                    id={`percentage-${exit.id}`}
                    min={1}
                    max={100}
                    step={1}
                    value={[exit.percentage]}
                    onValueChange={(value) => handleTimeBasedExitChange(exit.id, 'percentage', value[0])}
                  />
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Label htmlFor={`notification-${exit.id}`}>Notification Days Before: {exit.notificationThreshold}</Label>
                  <Slider
                    id={`notification-${exit.id}`}
                    min={1}
                    max={30}
                    step={1}
                    value={[exit.notificationThreshold]}
                    onValueChange={(value) => handleTimeBasedExitChange(exit.id, 'notificationThreshold', value[0])}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor={`rebalance-${exit.id}`}>Rebalance Before Exit</Label>
                  <Switch 
                    id={`rebalance-${exit.id}`} 
                    checked={exit.rebalanceBefore}
                    onCheckedChange={(checked) => handleTimeBasedExitChange(exit.id, 'rebalanceBefore', checked)}
                  />
                </div>
              </div>
            ))}
            
            <div className="flex items-center justify-between">
              <Label htmlFor="dynamic-rebalancing">Dynamic Portfolio Rebalancing</Label>
              <Switch 
                id="dynamic-rebalancing" 
                checked={dynamicRebalancing}
                onCheckedChange={setDynamicRebalancing}
              />
            </div>
            
            {dynamicRebalancing && (
              <div className="flex flex-col space-y-2">
                <Label htmlFor="rebalance-threshold">Rebalance Threshold: {rebalanceThreshold}%</Label>
                <Slider
                  id="rebalance-threshold"
                  min={1}
                  max={20}
                  step={1}
                  value={[rebalanceThreshold]}
                  onValueChange={(value) => setRebalanceThreshold(value[0])}
                />
                <p className="text-sm text-gray-400">
                  Assets will be rebalanced when they drift more than {rebalanceThreshold}% from target allocation
                </p>
              </div>
            )}
          </div>
        );
        
      case 'halvening_cycle':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Market Conditions</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleMarketConditionAdd}
              >
                <PlusCircle className="h-4 w-4 mr-1" /> Add Condition
              </Button>
            </div>
            
            {marketConditions.map((condition) => (
              <div key={condition.id} className="space-y-4 p-4 border rounded-lg relative">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">{condition.description}</h4>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleMarketConditionRemove(condition.id)}
                      disabled={marketConditions.length <= 1}
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                    <Switch 
                      checked={condition.enabled}
                      onCheckedChange={(checked) => handleMarketConditionChange(condition.id, 'enabled', checked)}
                    />
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Label htmlFor={`type-${condition.id}`}>Condition Type</Label>
                  <Select 
                    value={condition.type}
                    onValueChange={(value) => handleMarketConditionChange(condition.id, 'type', value)}
                  >
                    <SelectTrigger id={`type-${condition.id}`}>
                      <SelectValue placeholder="Select condition type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price">Price Movement</SelectItem>
                      <SelectItem value="halving">Bitcoin Halving</SelectItem>
                      <SelectItem value="event">Market Event</SelectItem>
                      <SelectItem value="correlation">Asset Correlation</SelectItem>
                      <SelectItem value="volatility">Volatility Index</SelectItem>
                      <SelectItem value="sentiment">Market Sentiment</SelectItem>
                      <SelectItem value="onchain">On-Chain Metrics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Label htmlFor={`description-${condition.id}`}>Description</Label>
                  <Input
                    id={`description-${condition.id}`}
                    value={condition.description}
                    onChange={(e) => handleMarketConditionChange(condition.id, 'description', e.target.value)}
                  />
                </div>
                
                {condition.type !== 'halving' && (
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor={`value-${condition.id}`}>
                      {condition.type === 'price' ? 'Price Threshold' : 
                        condition.type === 'event' ? 'Event Identifier' : 
                        condition.type === 'correlation' ? 'Correlation Asset' :
                        condition.type === 'volatility' ? 'VIX Value' :
                        condition.type === 'sentiment' ? 'Sentiment Direction' :
                        'Metric Value'}
                    </Label>
                    <Input
                      id={`value-${condition.id}`}
                      value={condition.value}
                      onChange={(e) => handleMarketConditionChange(condition.id, 'value', e.target.value)}
                    />
                  </div>
                )}
                
                <div className="flex flex-col space-y-2">
                  <Label htmlFor={`threshold-${condition.id}`}>Threshold: {condition.threshold}%</Label>
                  <Slider
                    id={`threshold-${condition.id}`}
                    min={1}
                    max={100}
                    step={1}
                    value={[condition.threshold]}
                    onValueChange={(value) => handleMarketConditionChange(condition.id, 'threshold', value[0])}
                  />
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Label htmlFor={`dataSource-${condition.id}`}>Data Source</Label>
                  <Select 
                    value={condition.dataSource}
                    onValueChange={(value) => handleMarketConditionChange(condition.id, 'dataSource', value)}
                  >
                    <SelectTrigger id={`dataSource-${condition.id}`}>
                      <SelectValue placeholder="Select data source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chainlink">Chainlink Oracle</SelectItem>
                      <SelectItem value="pyth">Pyth Network</SelectItem>
                      <SelectItem value="api3">API3 QRNG</SelectItem>
                      <SelectItem value="internal">Internal Data Feed</SelectItem>
                      <SelectItem value="hybrid">Hybrid (Multi-Source)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {(condition.type === 'price' || condition.type === 'onchain') && (
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor={`chain-${condition.id}`}>Chain Specific</Label>
                    <Select 
                      value={condition.chainSpecific}
                      onValueChange={(value) => handleMarketConditionChange(condition.id, 'chainSpecific', value)}
                    >
                      <SelectTrigger id={`chain-${condition.id}`}>
                        <SelectValue placeholder="Select blockchain" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedChains.map(chain => (
                          <SelectItem key={chain} value={chain}>
                            {chain.charAt(0).toUpperCase() + chain.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
        
      case 'ai_adaptive':
      case 'quantum_arbitrage':
      case 'strategic_rebalance':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Strategy Parameters</h3>
              {selectedStrategy === 'ai_adaptive' && (
                <Badge variant="outline" className="bg-indigo-900/40 text-indigo-300 hover:bg-indigo-800/40">
                  <BrainCircuit className="h-3 w-3 mr-1" /> AI-Powered
                </Badge>
              )}
              {selectedStrategy === 'quantum_arbitrage' && (
                <Badge variant="outline" className="bg-purple-900/40 text-purple-300 hover:bg-purple-800/40">
                  <Network className="h-3 w-3 mr-1" /> Quantum-Enhanced
                </Badge>
              )}
              {selectedStrategy === 'strategic_rebalance' && (
                <Badge variant="outline" className="bg-blue-900/40 text-blue-300 hover:bg-blue-800/40">
                  <RefreshCw className="h-3 w-3 mr-1" /> Cross-Chain
                </Badge>
              )}
            </div>
            
            <div className="flex flex-col space-y-2">
              <Label htmlFor="automation-level">Automation Level</Label>
              <Select 
                value={automationLevel}
                onValueChange={(value) => setAutomationLevel(value as any)}
              >
                <SelectTrigger id="automation-level">
                  <SelectValue placeholder="Select automation level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual (Require Approval)</SelectItem>
                  <SelectItem value="semi">Semi-Automatic (Suggest Actions)</SelectItem>
                  <SelectItem value="full">Fully Automatic</SelectItem>
                  <SelectItem value="adaptive">Adaptive (Context Aware)</SelectItem>
                  <SelectItem value="ai_driven">AI-Driven (Predictive)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Investment Algorithms</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'market_neutral', label: 'Market Neutral', icon: <LineChart className="h-3 w-3" /> },
                  { id: 'momentum', label: 'Momentum', icon: <TrendingUp className="h-3 w-3" /> },
                  { id: 'mean_reversion', label: 'Mean Reversion', icon: <RefreshCw className="h-3 w-3" /> },
                  { id: 'dca', label: 'Dollar Cost Averaging', icon: <CircleDollarSign className="h-3 w-3" /> },
                  { id: 'value', label: 'Value Investing', icon: <PieChart className="h-3 w-3" /> },
                  { id: 'growth', label: 'Growth Strategy', icon: <BarChart4 className="h-3 w-3" /> },
                  { id: 'hybrid', label: 'Hybrid Approach', icon: <GitFork className="h-3 w-3" /> }
                ].map(alg => (
                  <div 
                    key={alg.id}
                    onClick={() => handleAlgorithmToggle(alg.id as InvestmentAlgorithm)}
                    className={`cursor-pointer flex items-center p-2 rounded-lg ${
                      algorithms.includes(alg.id as InvestmentAlgorithm) 
                        ? 'bg-purple-900/40 text-white border border-purple-500/50' 
                        : 'bg-gray-800 text-gray-400 border border-gray-700'
                    }`}
                  >
                    <div className="flex items-center">
                      {alg.icon}
                      <span className="ml-2 text-sm">{alg.label}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1">Select one or more algorithms for your investment strategy</p>
            </div>
            
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="min-hold-period">Minimum Hold Period: {minHoldPeriod} days</Label>
              </div>
              <Slider
                id="min-hold-period"
                min={1}
                max={365}
                step={1}
                value={[minHoldPeriod]}
                onValueChange={(value) => setMinHoldPeriod(value[0])}
              />
            </div>
            
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="max-lock-period">Maximum Lock Period: {maxLockPeriod} days</Label>
              </div>
              <Slider
                id="max-lock-period"
                min={minHoldPeriod}
                max={1095} // 3 years
                step={1}
                value={[maxLockPeriod]}
                onValueChange={(value) => setMaxLockPeriod(value[0])}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="reinvest-dividends">Auto-Reinvest Dividends & Yield</Label>
              <Switch 
                id="reinvest-dividends" 
                checked={reinvestDividends}
                onCheckedChange={setReinvestDividends}
              />
            </div>
            
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Risk Management Rules</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRiskRuleAdd}
              >
                <PlusCircle className="h-4 w-4 mr-1" /> Add Rule
              </Button>
            </div>
            
            {riskManagementRules.map((rule) => (
              <div key={rule.id} className="space-y-4 p-4 border rounded-lg relative">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">
                    {rule.type === 'stopLoss' ? 'Stop Loss' : 
                     rule.type === 'trailingStop' ? 'Trailing Stop' : 
                     rule.type === 'volatilityBased' ? 'Volatility Based Exit' : 
                     rule.type === 'correlationBased' ? 'Correlation Protection' : 
                     rule.type === 'timeDecay' ? 'Time Decay Function' : 
                     'Sentiment Shift Protection'}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleRiskRuleRemove(rule.id)}
                      disabled={riskManagementRules.length <= 1}
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                    <Switch 
                      checked={rule.enabled}
                      onCheckedChange={(checked) => handleRiskRuleChange(rule.id, 'enabled', checked)}
                    />
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Label htmlFor={`type-${rule.id}`}>Rule Type</Label>
                  <Select 
                    value={rule.type}
                    onValueChange={(value) => handleRiskRuleChange(rule.id, 'type', value as any)}
                  >
                    <SelectTrigger id={`type-${rule.id}`}>
                      <SelectValue placeholder="Select rule type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stopLoss">Stop Loss</SelectItem>
                      <SelectItem value="trailingStop">Trailing Stop</SelectItem>
                      <SelectItem value="volatilityBased">Volatility Based</SelectItem>
                      <SelectItem value="correlationBased">Correlation Based</SelectItem>
                      <SelectItem value="timeDecay">Time Decay</SelectItem>
                      <SelectItem value="sentimentShift">Sentiment Shift</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Label htmlFor={`threshold-${rule.id}`}>
                    {rule.type === 'stopLoss' || rule.type === 'trailingStop' 
                      ? `Loss Threshold: ${rule.threshold}%` 
                      : `Trigger Threshold: ${rule.threshold}%`}
                  </Label>
                  <Slider
                    id={`threshold-${rule.id}`}
                    min={1}
                    max={50}
                    step={1}
                    value={[rule.threshold]}
                    onValueChange={(value) => handleRiskRuleChange(rule.id, 'threshold', value[0])}
                  />
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Label htmlFor={`applyTo-${rule.id}`}>Apply To</Label>
                  <Select 
                    value={rule.applyTo}
                    onValueChange={(value) => handleRiskRuleChange(rule.id, 'applyTo', value as any)}
                  >
                    <SelectTrigger id={`applyTo-${rule.id}`}>
                      <SelectValue placeholder="Select scope" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="portfolio">Entire Portfolio</SelectItem>
                      <SelectItem value="asset">Per Asset</SelectItem>
                      <SelectItem value="strategy">Per Strategy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Label htmlFor={`recovery-${rule.id}`}>Recovery Action</Label>
                  <Select 
                    value={rule.recoveryAction}
                    onValueChange={(value) => handleRiskRuleChange(rule.id, 'recoveryAction', value as any)}
                  >
                    <SelectTrigger id={`recovery-${rule.id}`}>
                      <SelectValue placeholder="Select recovery action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lock">Lock Assets</SelectItem>
                      <SelectItem value="partial_exit">Partial Exit</SelectItem>
                      <SelectItem value="full_exit">Full Exit</SelectItem>
                      <SelectItem value="hedge">Hedge Position</SelectItem>
                      <SelectItem value="alert">Alert Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
            
            {selectedStrategy === 'strategic_rebalance' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dynamic-rebalancing">Dynamic Rebalancing</Label>
                  <Switch 
                    id="dynamic-rebalancing" 
                    checked={dynamicRebalancing}
                    onCheckedChange={setDynamicRebalancing}
                  />
                </div>
                
                {dynamicRebalancing && (
                  <>
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="rebalance-threshold">Rebalance Threshold: {rebalanceThreshold}%</Label>
                      <Slider
                        id="rebalance-threshold"
                        min={1}
                        max={20}
                        step={1}
                        value={[rebalanceThreshold]}
                        onValueChange={(value) => setRebalanceThreshold(value[0])}
                      />
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="rebalance-frequency">Rebalance Frequency</Label>
                      <Select 
                        value={rebalanceFrequency}
                        onValueChange={(value) => setRebalanceFrequency(value)}
                      >
                        <SelectTrigger id="rebalance-frequency">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="trigger_based">Trigger Based</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        );
        
      default:
        return (
          <div className="flex flex-col space-y-4 items-center justify-center p-6">
            <AlertTriangle className="h-12 w-12 text-yellow-500" />
            <h3 className="text-lg font-medium text-center">Please select an investment strategy first</h3>
            <p className="text-sm text-gray-400 text-center">
              Each strategy has different configuration options that will be displayed here
            </p>
          </div>
        );
    }
  };
  
  // Render the tabs and form
  const renderTabContent = () => {
    switch (activeTab) {
      case "basic":
        return (
          <div className="space-y-6">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="vault-name">Vault Name</Label>
              <Input
                id="vault-name"
                placeholder="Enter a name for your investment vault"
                value={vaultName}
                onChange={(e) => setVaultName(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col space-y-2">
              <Label htmlFor="asset-type">Primary Asset</Label>
              <Select 
                value={primaryAsset}
                onValueChange={setPrimaryAsset}
              >
                <SelectTrigger id="asset-type">
                  <SelectValue placeholder="Select asset type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                  <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                  <SelectItem value="SOL">Solana (SOL)</SelectItem>
                  <SelectItem value="TON">Toncoin (TON)</SelectItem>
                  <SelectItem value="AVAX">Avalanche (AVAX)</SelectItem>
                  <SelectItem value="DOT">Polkadot (DOT)</SelectItem>
                  <SelectItem value="MATIC">Polygon (MATIC)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Label>Asset Classes</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'crypto', label: 'Cryptocurrencies' },
                  { id: 'stocks', label: 'Stocks & Equities' },
                  { id: 'commodities', label: 'Commodities' },
                  { id: 'forex', label: 'Forex' },
                  { id: 'indices', label: 'Indices' },
                  { id: 'nft', label: 'NFTs' },
                  { id: 'stable', label: 'Stablecoins' }
                ].map(assetClass => (
                  <div 
                    key={assetClass.id}
                    onClick={() => handleAssetClassToggle(assetClass.id as AssetClass)}
                    className={`cursor-pointer flex items-center justify-center py-2 rounded-lg text-sm ${
                      assetClasses.includes(assetClass.id as AssetClass) 
                        ? 'bg-purple-900/40 text-white border border-purple-500/50' 
                        : 'bg-gray-800 text-gray-400 border border-gray-700'
                    }`}
                  >
                    {assetClass.label}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Label htmlFor="initial-amount">Initial Amount</Label>
              <Input
                id="initial-amount"
                type="text"
                placeholder={`Enter amount in ${primaryAsset}`}
                value={initialAmount}
                onChange={(e) => setInitialAmount(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col space-y-2">
              <Label>Investment Strategy</Label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'strategic_rebalance', name: 'Strategic Rebalance', description: 'Cross-chain asset rebalancing based on risk-adjusted returns', icon: <RefreshCw className="h-4 w-4" /> },
                  { id: 'ai_adaptive', name: 'AI Adaptive Strategy', description: 'AI-powered strategy that adapts to changing market conditions', icon: <BrainCircuit className="h-4 w-4" /> },
                  { id: 'diamond_hands', name: 'Diamond Hands HODL', description: 'Enforced long-term holding with time-lock mechanism', icon: <LockKeyhole className="h-4 w-4" /> },
                  { id: 'profit_taking', name: 'Strategic Profit Taking', description: 'Automated exit at predefined price targets', icon: <BarChart4 className="h-4 w-4" /> },
                  { id: 'dca_exit', name: 'DCA Exit Strategy', description: 'Gradual market exit on predefined schedule', icon: <Timer className="h-4 w-4" /> },
                  { id: 'halvening_cycle', name: 'Halving Cycle Strategy', description: 'Based on Bitcoin halving cycles and market events', icon: <PieChart className="h-4 w-4" /> },
                  { id: 'quantum_arbitrage', name: 'Quantum Arbitrage', description: 'Cross-chain arbitrage with quantum-resistant security', icon: <Network className="h-4 w-4" /> }
                ].map(strategy => (
                  <div
                    key={strategy.id}
                    onClick={() => setSelectedStrategy(strategy.id as InvestmentStrategy)}
                    className={`cursor-pointer p-3 rounded-lg border transition-all ${
                      selectedStrategy === strategy.id
                        ? 'bg-purple-900/40 border-purple-500/50 shadow-lg shadow-purple-900/20'
                        : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-full mr-3 ${
                          selectedStrategy === strategy.id 
                            ? 'bg-purple-800/50 text-purple-300' 
                            : 'bg-gray-700 text-gray-400'
                        }`}>
                          {strategy.icon}
                        </div>
                        <div>
                          <h3 className={`font-medium ${selectedStrategy === strategy.id ? 'text-white' : 'text-gray-300'}`}>
                            {strategy.name}
                          </h3>
                          <p className="text-xs text-gray-400">{strategy.description}</p>
                        </div>
                      </div>
                      {selectedStrategy === strategy.id && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case "blockchain":
        return (
          <div className="space-y-6">
            <div className="flex flex-col space-y-2">
              <Label className="text-lg">Select Blockchains</Label>
              <p className="text-sm text-gray-400">Choose which blockchains to include in your investment discipline vault</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { id: 'ethereum', name: 'Ethereum', icon: '♦️', color: 'from-blue-600/30 to-indigo-600/30 border-blue-500/30' },
                { id: 'ton', name: 'TON', icon: '💎', color: 'from-blue-400/30 to-blue-600/30 border-blue-400/30' },
                { id: 'solana', name: 'Solana', icon: '◎', color: 'from-purple-600/30 to-fuchsia-600/30 border-purple-500/30' },
                { id: 'bitcoin', name: 'Bitcoin', icon: '₿', color: 'from-orange-600/30 to-amber-600/30 border-orange-500/30' },
                { id: 'polygon', name: 'Polygon', icon: '⬡', color: 'from-indigo-600/30 to-violet-600/30 border-indigo-500/30' },
                { id: 'avalanche', name: 'Avalanche', icon: '❄️', color: 'from-red-600/30 to-rose-600/30 border-red-500/30' },
                { id: 'polkadot', name: 'Polkadot', icon: '●', color: 'from-pink-600/30 to-rose-600/30 border-pink-500/30' }
              ].map(chain => (
                <div
                  key={chain.id}
                  onClick={() => handleChainSelect(chain.id as Chain)}
                  className={`
                    cursor-pointer p-4 rounded-xl 
                    transition-all duration-200 
                    bg-gradient-to-br border-2
                    ${selectedChains.includes(chain.id as Chain) 
                      ? chain.color + ' shadow-lg' 
                      : 'from-transparent to-transparent border-gray-700/50 hover:border-gray-600/50'}
                  `}
                >
                  <div className="flex flex-col items-center text-center space-y-2">
                    <span className="text-2xl">{chain.icon}</span>
                    <span className={`font-medium ${selectedChains.includes(chain.id as Chain) ? 'text-white' : 'text-gray-400'}`}>
                      {chain.name}
                    </span>
                    
                    {selectedChains.includes(chain.id as Chain) && (
                      <div className="mt-2 flex items-center space-x-1">
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetPrimaryChain(chain.id as Chain);
                          }}
                          className={`
                            px-2 py-1 text-xs rounded-full 
                            ${primaryChain === chain.id 
                              ? 'bg-green-900/60 text-green-300 border border-green-500/30' 
                              : 'bg-gray-800/80 text-gray-400 border border-gray-700 hover:bg-gray-700/70'
                            }
                          `}
                        >
                          {primaryChain === chain.id ? 'Primary' : 'Set as primary'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {selectedChains.length > 1 && (
              <div className="pt-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="cross-chain-opt">Cross-Chain Optimization</Label>
                  <Switch 
                    id="cross-chain-opt" 
                    checked={enableCrossChainOptimization}
                    onCheckedChange={setEnableCrossChainOptimization}
                  />
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  Automatically optimize asset allocation across multiple blockchains
                </p>
              </div>
            )}
            
            {enableCrossChainOptimization && selectedChains.length > 1 && (
              <div className="space-y-4 p-4 border border-purple-500/20 rounded-lg bg-purple-950/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Cross-Chain Strategy</h3>
                  <Switch 
                    checked={crossChainStrategy.enabled}
                    onCheckedChange={(checked) => setCrossChainStrategy({...crossChainStrategy, enabled: checked})}
                  />
                </div>
                
                {crossChainStrategy.enabled && (
                  <>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Asset Distribution</Label>
                        {selectedChains.map(chain => (
                          <div key={chain} className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">
                                {chain.charAt(0).toUpperCase() + chain.slice(1)}: {crossChainStrategy.distributions[chain]}%
                              </span>
                              {chain === primaryChain && (
                                <Badge variant="outline" className="text-xs bg-green-900/40 text-green-300 border-green-600/30">
                                  Primary
                                </Badge>
                              )}
                            </div>
                            <Slider
                              min={0}
                              max={100}
                              step={5}
                              value={[crossChainStrategy.distributions[chain]]}
                              onValueChange={(value) => handleDistributionChange(chain, value[0])}
                            />
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <Label htmlFor="bridge-preference">Bridge Preference</Label>
                        <Select 
                          value={crossChainStrategy.bridgePreference}
                          onValueChange={(value) => setCrossChainStrategy({
                            ...crossChainStrategy, 
                            bridgePreference: value as any
                          })}
                        >
                          <SelectTrigger id="bridge-preference">
                            <SelectValue placeholder="Select bridge preference" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="automatic">Automatic (Best Available)</SelectItem>
                            <SelectItem value="layerzero">LayerZero</SelectItem>
                            <SelectItem value="wormhole">Wormhole</SelectItem>
                            <SelectItem value="hyperlane">Hyperlane</SelectItem>
                            <SelectItem value="native">Native Bridges</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <Label htmlFor="rebalance-frequency">Rebalance Frequency</Label>
                        <Select 
                          value={crossChainStrategy.rebalanceFrequency}
                          onValueChange={(value) => setCrossChainStrategy({
                            ...crossChainStrategy, 
                            rebalanceFrequency: value as any
                          })}
                        >
                          <SelectTrigger id="rebalance-frequency">
                            <SelectValue placeholder="Select rebalance frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="manual">Manual Only</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="trigger_based">Trigger-Based</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="gas-optimization">Gas Optimization</Label>
                        <Switch 
                          id="gas-optimization" 
                          checked={crossChainStrategy.gasOptimization}
                          onCheckedChange={(checked) => setCrossChainStrategy({
                            ...crossChainStrategy, 
                            gasOptimization: checked
                          })}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        );
        
      case "strategy":
        return (
          <div className="space-y-6">
            {renderAdvancedStrategyConfig()}
          </div>
        );
        
      case "security":
        return (
          <div className="space-y-6">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="security-level">Security Level: {securityLevel}/5</Label>
              <Slider
                id="security-level"
                min={1}
                max={5}
                step={1}
                value={[securityLevel]}
                onValueChange={(value) => setSecurityLevel(value[0])}
              />
              <div className="grid grid-cols-5 gap-1 mt-1">
                <div className={`h-1 rounded-l ${securityLevel >= 1 ? 'bg-green-500' : 'bg-gray-700'}`}></div>
                <div className={`h-1 ${securityLevel >= 2 ? 'bg-blue-500' : 'bg-gray-700'}`}></div>
                <div className={`h-1 ${securityLevel >= 3 ? 'bg-yellow-500' : 'bg-gray-700'}`}></div>
                <div className={`h-1 ${securityLevel >= 4 ? 'bg-orange-500' : 'bg-gray-700'}`}></div>
                <div className={`h-1 rounded-r ${securityLevel >= 5 ? 'bg-red-500' : 'bg-gray-700'}`}></div>
              </div>
              <div className="text-xs text-gray-400 flex justify-between">
                <span>Basic</span>
                <span>Standard</span>
                <span>Enhanced</span>
                <span>Advanced</span>
                <span>Fortress</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Protection Mechanisms</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'quantum', label: 'Quantum Resistant', icon: <Shield className="h-3 w-3" /> },
                  { id: 'zkp', label: 'Zero-Knowledge Proofs', icon: <Fingerprint className="h-3 w-3" /> },
                  { id: 'multisig', label: 'Multi-Signature', icon: <LucideShield className="h-3 w-3" /> },
                  { id: 'timelock', label: 'Time Lock', icon: <Timer className="h-3 w-3" /> },
                  { id: 'ai', label: 'AI Protection', icon: <BrainCircuit className="h-3 w-3" /> },
                  { id: 'dualchain', label: 'Dual-Chain Verification', icon: <GitFork className="h-3 w-3" /> },
                  { id: 'triplechain', label: 'Triple-Chain Security', icon: <Server className="h-3 w-3" /> }
                ].map(mechanism => (
                  <div 
                    key={mechanism.id}
                    onClick={() => handleProtectionMechanismToggle(mechanism.id as ProtectionMechanism)}
                    className={`cursor-pointer flex items-center justify-center py-2 rounded-lg text-sm ${
                      protectionMechanisms.includes(mechanism.id as ProtectionMechanism) 
                        ? 'bg-purple-900/40 text-white border border-purple-500/50' 
                        : 'bg-gray-800 text-gray-400 border border-gray-700'
                    }`}
                  >
                    <span className="mr-1">{mechanism.icon}</span> {mechanism.label}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1">Select security mechanisms for your vault</p>
            </div>
            
            {protectionMechanisms.includes('multisig') && (
              <div className="flex flex-col space-y-2">
                <Label htmlFor="multisig-threshold">Multisig Threshold: {multisigThreshold} signatures</Label>
                <Slider
                  id="multisig-threshold"
                  min={2}
                  max={5}
                  step={1}
                  value={[multisigThreshold]}
                  onValueChange={(value) => setMultisigThreshold(value[0])}
                />
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <Label htmlFor="emergency-protocol">Emergency Protocol</Label>
              <Switch 
                id="emergency-protocol" 
                checked={enableEmergencyProtocol}
                onCheckedChange={setEnableEmergencyProtocol}
              />
            </div>
            
            {enableEmergencyProtocol && (
              <div className="flex flex-col space-y-2">
                <Label htmlFor="emergency-threshold">Emergency Threshold: {emergencyThreshold}%</Label>
                <p className="text-xs text-gray-400">
                  Assets will be locked if they drop more than {emergencyThreshold}% in value within 24 hours
                </p>
                <Slider
                  id="emergency-threshold"
                  min={5}
                  max={50}
                  step={5}
                  value={[emergencyThreshold]}
                  onValueChange={(value) => setEmergencyThreshold(value[0])}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="recovery-addresses">Recovery Addresses</Label>
              <p className="text-xs text-gray-400">
                Add backup addresses that can recover your assets in case of emergency
              </p>
              {recoveryAddresses.map((address, index) => (
                <div key={index} className="flex space-x-2">
                  <Input
                    value={address}
                    onChange={(e) => {
                      const newAddresses = [...recoveryAddresses];
                      newAddresses[index] = e.target.value;
                      setRecoveryAddresses(newAddresses);
                    }}
                    placeholder="Enter recovery address"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (recoveryAddresses.length > 1) {
                        setRecoveryAddresses(recoveryAddresses.filter((_, i) => i !== index));
                      } else {
                        setRecoveryAddresses(['']);
                      }
                    }}
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRecoveryAddresses([...recoveryAddresses, ''])}
              >
                <PlusCircle className="h-4 w-4 mr-1" /> Add Recovery Address
              </Button>
            </div>
          </div>
        );
        
      case "advanced":
        return (
          <div className="space-y-6">
            <div className="flex flex-col space-y-4">
              <h3 className="text-lg font-medium">Advanced Features</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="analytics" className="block">Advanced Analytics</Label>
                    <p className="text-xs text-gray-400">Detailed performance metrics and insights</p>
                  </div>
                  <Switch 
                    id="analytics" 
                    checked={enableAnalytics}
                    onCheckedChange={setEnableAnalytics}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="ai-assistance" className="block">AI Assistance</Label>
                    <p className="text-xs text-gray-400">Smart suggestions for portfolio management</p>
                  </div>
                  <Switch 
                    id="ai-assistance" 
                    checked={enableAIAssistance}
                    onCheckedChange={setEnableAIAssistance}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="quantum-resistance" className="block">Quantum Resistance</Label>
                    <p className="text-xs text-gray-400">Enhanced encryption against quantum computing</p>
                  </div>
                  <Switch 
                    id="quantum-resistance" 
                    checked={enableQuantumResistance}
                    onCheckedChange={setEnableQuantumResistance}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sentiment-protection" className="block">Sentiment Protection</Label>
                    <p className="text-xs text-gray-400">Market sentiment analysis to prevent emotional decisions</p>
                  </div>
                  <Switch 
                    id="sentiment-protection" 
                    checked={enableSentimentProtection}
                    onCheckedChange={setEnableSentimentProtection}
                  />
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Recovery Options</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="early-withdrawal-fee" className="block">Early Withdrawal Fee</Label>
                    <p className="text-xs text-gray-400">Discourages premature exits during volatility</p>
                  </div>
                  <Switch 
                    id="early-withdrawal-fee" 
                    checked={earlyWithdrawalFee}
                    onCheckedChange={setEarlyWithdrawalFee}
                  />
                </div>
                
                {earlyWithdrawalFee && (
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="withdrawal-fee-percentage">Fee Percentage: {withdrawalFeePercentage}%</Label>
                    </div>
                    <Slider
                      id="withdrawal-fee-percentage"
                      min={1}
                      max={50}
                      step={1}
                      value={[withdrawalFeePercentage]}
                      onValueChange={(value) => setWithdrawalFeePercentage(value[0])}
                    />
                    
                    <div className="flex items-center justify-between mt-2">
                      <Label htmlFor="fee-reduces-over-time">Fee Reduces Over Time</Label>
                      <Switch 
                        id="fee-reduces-over-time" 
                        checked={feeReducesOverTime}
                        onCheckedChange={setFeeReducesOverTime}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
        
      case "review":
        return (
          <div className="space-y-6">
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">Investment Discipline Vault Summary</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Vault Name:</span>
                    <span className="font-medium">{vaultName || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Primary Asset:</span>
                    <span className="font-medium">{primaryAsset}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Initial Amount:</span>
                    <span className="font-medium">{initialAmount || '0'} {primaryAsset}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Strategy Type:</span>
                    <span className="font-medium">{selectedStrategy.replace(/_/g, ' ')}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Security Level:</span>
                    <span className="font-medium">{securityLevel}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Hold Period:</span>
                    <span className="font-medium">Min {minHoldPeriod} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Primary Chain:</span>
                    <span className="font-medium">{primaryChain.charAt(0).toUpperCase() + primaryChain.slice(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Cross-Chain:</span>
                    <span className="font-medium">{enableCrossChainOptimization && crossChainStrategy.enabled ? 'Enabled' : 'Disabled'}</span>
                  </div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <h4 className="font-medium">Blockchains:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedChains.map(chain => (
                    <Badge key={chain} variant="outline" className={
                      chain === primaryChain 
                        ? 'bg-green-900/40 text-green-300 border-green-600/30'
                        : 'bg-gray-800'
                    }>
                      {chain.charAt(0).toUpperCase() + chain.slice(1)}
                      {chain === primaryChain && ' (Primary)'}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2 mt-4">
                <h4 className="font-medium">Protection Mechanisms:</h4>
                <div className="flex flex-wrap gap-2">
                  {protectionMechanisms.map(mechanism => (
                    <Badge key={mechanism} variant="outline" className="bg-purple-900/40 text-purple-300 border-purple-600/30">
                      {mechanism.charAt(0).toUpperCase() + mechanism.slice(1).replace(/([A-Z])/g, ' $1')}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {selectedStrategy === 'strategic_rebalance' && enableCrossChainOptimization && crossChainStrategy.enabled && (
                <div className="mt-4">
                  <h4 className="font-medium">Asset Distribution:</h4>
                  <div className="h-4 w-full bg-gray-700 rounded-full mt-2 overflow-hidden">
                    {selectedChains.map((chain, index) => {
                      // Calculate width and position
                      const width = crossChainStrategy.distributions[chain];
                      const prevWidth = selectedChains
                        .slice(0, index)
                        .reduce((sum, c) => sum + crossChainStrategy.distributions[c], 0);
                      
                      // Define colors for each chain
                      const colors: Record<Chain, string> = {
                        ethereum: 'bg-blue-500',
                        ton: 'bg-blue-400',
                        solana: 'bg-purple-500',
                        bitcoin: 'bg-orange-500',
                        polygon: 'bg-indigo-500',
                        avalanche: 'bg-red-500',
                        polkadot: 'bg-pink-500'
                      };
                      
                      return width > 0 ? (
                        <div 
                          key={chain}
                          className={`h-full ${colors[chain]}`}
                          style={{ 
                            width: `${width}%`, 
                            marginLeft: index === 0 ? '0' : `${prevWidth}%`,
                            position: index === 0 ? 'relative' : 'absolute'
                          }}
                        />
                      ) : null;
                    })}
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-400">
                    {selectedChains.map(chain => (
                      crossChainStrategy.distributions[chain] > 0 ? (
                        <span key={chain}>
                          {chain.charAt(0).toUpperCase() + chain.slice(1)}: {crossChainStrategy.distributions[chain]}%
                        </span>
                      ) : null
                    ))}
                  </div>
                </div>
              )}
              
              {(enableEmergencyProtocol || earlyWithdrawalFee) && (
                <div className="space-y-2 mt-4">
                  <h4 className="font-medium">Safety Mechanisms:</h4>
                  <div className="space-y-1">
                    {enableEmergencyProtocol && (
                      <div className="flex justify-between text-sm">
                        <span>Emergency Protocol:</span>
                        <span>{emergencyThreshold}% threshold</span>
                      </div>
                    )}
                    {earlyWithdrawalFee && (
                      <div className="flex justify-between text-sm">
                        <span>Early Withdrawal Fee:</span>
                        <span>{withdrawalFeePercentage}%{feeReducesOverTime ? ' (reduces over time)' : ''}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">Deployment Information</h3>
              <div className="text-sm space-y-4">
                <p className="text-gray-400">
                  Your Investment Discipline Vault will be deployed to {selectedChains.length} blockchain{selectedChains.length > 1 ? 's' : ''} with {protectionMechanisms.length} security mechanism{protectionMechanisms.length > 1 ? 's' : ''}.
                </p>
                <div className="space-y-1">
                  <p className="text-gray-400">This vault includes advanced features:</p>
                  <ul className="list-disc list-inside space-y-1 pl-2">
                    {enableAnalytics && <li className="text-gray-400">Advanced Analytics Dashboard</li>}
                    {enableAIAssistance && <li className="text-gray-400">AI-Powered Investment Assistance</li>}
                    {enableQuantumResistance && <li className="text-gray-400">Quantum-Resistant Security</li>}
                    {enableSentimentProtection && <li className="text-gray-400">Market Sentiment Protection</li>}
                    {enableCrossChainOptimization && crossChainStrategy.enabled && <li className="text-gray-400">Cross-Chain Asset Optimization</li>}
                  </ul>
                </div>
                <p className="text-gray-400 italic">
                  By creating this vault, you agree to the terms and conditions of Chronos Vault platform.
                </p>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // Main component render
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex flex-col items-center mb-8">
        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-900/30 mb-4">
          <LineChart className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
          Advanced Investment Discipline Vault
        </h1>
        <p className="text-gray-400 mt-2 text-center max-w-2xl">
          Create a sophisticated investment vault with advanced strategies, cross-chain optimization, and quantum-resistant security.
        </p>
      </div>
      
      <div className="mb-8">
        <Progress value={progress} className="h-2 bg-gray-700" />
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>Basic Setup</span>
          <span>Strategy Configuration</span>
          <span>Security</span>
          <span>Review</span>
        </div>
      </div>
      
      {isSuccess ? (
        <Card className="w-full bg-gray-800/50 border-green-500/30">
          <CardHeader className="pb-2">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
            <CardTitle className="text-center text-2xl">Vault Successfully Created!</CardTitle>
            <CardDescription className="text-center">
              Your Investment Discipline Vault is being deployed to the blockchain
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-900/50 p-4 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Vault ID:</span>
                <span className="font-mono">{vaultId}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-400">Status:</span>
                <span className="text-green-400">Deploying</span>
              </div>
            </div>
            <p className="text-center text-gray-400">
              You will be redirected to your dashboard in a moment...
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full border-purple-500/20 bg-gradient-to-b from-gray-800/90 to-gray-900/90 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Create Your Investment Discipline Vault</CardTitle>
            <CardDescription>
              Configure advanced settings to protect your investment strategy across multiple blockchains
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-6 w-full">
                <TabsTrigger value="basic">
                  <span className="hidden sm:inline">Basic</span>
                  <span className="sm:hidden">1</span>
                </TabsTrigger>
                <TabsTrigger value="blockchain">
                  <span className="hidden sm:inline">Blockchains</span>
                  <span className="sm:hidden">2</span>
                </TabsTrigger>
                <TabsTrigger value="strategy">
                  <span className="hidden sm:inline">Strategy</span>
                  <span className="sm:hidden">3</span>
                </TabsTrigger>
                <TabsTrigger value="security">
                  <span className="hidden sm:inline">Security</span>
                  <span className="sm:hidden">4</span>
                </TabsTrigger>
                <TabsTrigger value="advanced">
                  <span className="hidden sm:inline">Advanced</span>
                  <span className="sm:hidden">5</span>
                </TabsTrigger>
                <TabsTrigger value="review">
                  <span className="hidden sm:inline">Review</span>
                  <span className="sm:hidden">6</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab}>
                {renderTabContent()}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="w-full sm:w-auto order-2 sm:order-1">
              <Button 
                variant="outline" 
                onClick={() => {
                  const tabOrder = ["basic", "blockchain", "strategy", "security", "advanced", "review"];
                  const currentIndex = tabOrder.indexOf(activeTab);
                  if (currentIndex > 0) {
                    setActiveTab(tabOrder[currentIndex - 1]);
                  }
                }}
                disabled={activeTab === "basic" || isLoading}
                className="w-full sm:w-auto"
              >
                Previous
              </Button>
            </div>
            <div className="w-full sm:w-auto order-1 sm:order-2 space-x-2 flex">
              {activeTab !== "review" ? (
                <Button 
                  onClick={() => {
                    const tabOrder = ["basic", "blockchain", "strategy", "security", "advanced", "review"];
                    const currentIndex = tabOrder.indexOf(activeTab);
                    if (currentIndex < tabOrder.length - 1) {
                      setActiveTab(tabOrder[currentIndex + 1]);
                    }
                  }}
                  disabled={isLoading}
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button 
                  onClick={handleCreateVault} 
                  disabled={isLoading}
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {isDeploying ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deploying... {deploymentProgress}%
                    </>
                  ) : (
                    'Create Vault'
                  )}
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

export default InvestmentDisciplineVaultAdvanced;