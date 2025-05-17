import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlockchainType } from '@/contexts/multi-chain-context';
import { ArrowRight, Shield, Zap, DollarSign, Clock, AlertTriangle, XCircle, CheckCircle2 } from "lucide-react";
import CrossChainMetricsService from '@/services/cross-chain-metrics-service';

// Operation types
export enum OperationType {
  TRANSFER = 'transfer',
  SWAP = 'swap',
  BRIDGE = 'bridge'
}

// Transaction status types
export enum TransactionStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

// Interface for cross-chain operation
interface CrossChainOperation {
  id: string;
  type: OperationType;
  sourceChain: BlockchainType;
  destinationChain: BlockchainType;
  amount: number;
  asset: string;
  timestamp: Date;
  status: TransactionStatus;
  fee: number;
  estimatedCompletionTime: Date;
  prioritizeSpeed: boolean;
  prioritizeSecurity: boolean;
}

// Mock data for demo
const AVAILABLE_ASSETS = [
  { symbol: 'ETH', name: 'Ethereum', chains: [BlockchainType.ETHEREUM] },
  { symbol: 'WETH', name: 'Wrapped Ethereum', chains: [BlockchainType.ETHEREUM, BlockchainType.SOLANA] },
  { symbol: 'SOL', name: 'Solana', chains: [BlockchainType.SOLANA] },
  { symbol: 'WSOL', name: 'Wrapped Solana', chains: [BlockchainType.ETHEREUM, BlockchainType.SOLANA] },
  { symbol: 'TON', name: 'Toncoin', chains: [BlockchainType.TON] },
  { symbol: 'WTON', name: 'Wrapped Toncoin', chains: [BlockchainType.ETHEREUM, BlockchainType.TON] },
  { symbol: 'BTC', name: 'Bitcoin', chains: [BlockchainType.BITCOIN] },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', chains: [BlockchainType.ETHEREUM, BlockchainType.SOLANA] },
  { symbol: 'USDT', name: 'Tether', chains: [BlockchainType.ETHEREUM, BlockchainType.SOLANA, BlockchainType.TON] },
  { symbol: 'USDC', name: 'USD Coin', chains: [BlockchainType.ETHEREUM, BlockchainType.SOLANA, BlockchainType.TON] },
];

// Sample operation history for demo
const SAMPLE_OPERATIONS: CrossChainOperation[] = [
  {
    id: 'op-1747415183043',
    type: OperationType.TRANSFER,
    sourceChain: BlockchainType.ETHEREUM,
    destinationChain: BlockchainType.SOLANA,
    amount: 1.5,
    asset: 'ETH',
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    status: TransactionStatus.COMPLETED,
    fee: 0.015,
    estimatedCompletionTime: new Date(Date.now() - 1200000), // 20 minutes ago
    prioritizeSpeed: true,
    prioritizeSecurity: false
  },
  {
    id: 'op-1747465080153',
    type: OperationType.SWAP,
    sourceChain: BlockchainType.TON,
    destinationChain: BlockchainType.ETHEREUM,
    amount: 50,
    asset: 'TON',
    timestamp: new Date(Date.now() - 7200000), // 2 hours ago
    status: TransactionStatus.COMPLETED,
    fee: 0.25,
    estimatedCompletionTime: new Date(Date.now() - 5400000), // 1.5 hours ago
    prioritizeSpeed: false,
    prioritizeSecurity: true
  },
  {
    id: 'op-1747412728894',
    type: OperationType.BRIDGE,
    sourceChain: BlockchainType.SOLANA,
    destinationChain: BlockchainType.TON,
    amount: 25,
    asset: 'SOL',
    timestamp: new Date(Date.now() - 900000), // 15 minutes ago
    status: TransactionStatus.PROCESSING,
    fee: 0.12,
    estimatedCompletionTime: new Date(Date.now() + 600000), // 10 minutes from now
    prioritizeSpeed: true,
    prioritizeSecurity: true
  },
  {
    id: 'op-1747466106529',
    type: OperationType.TRANSFER,
    sourceChain: BlockchainType.BITCOIN,
    destinationChain: BlockchainType.ETHEREUM,
    amount: 0.05,
    asset: 'BTC',
    timestamp: new Date(Date.now() - 300000), // 5 minutes ago
    status: TransactionStatus.PENDING,
    fee: 0.0005,
    estimatedCompletionTime: new Date(Date.now() + 1800000), // 30 minutes from now
    prioritizeSpeed: false,
    prioritizeSecurity: true
  },
  {
    id: 'op-1747452030116',
    type: OperationType.SWAP,
    sourceChain: BlockchainType.ETHEREUM,
    destinationChain: BlockchainType.BITCOIN,
    amount: 1000,
    asset: 'USDT',
    timestamp: new Date(Date.now() - 86400000), // 1 day ago
    status: TransactionStatus.FAILED,
    fee: 5.5,
    estimatedCompletionTime: new Date(Date.now() - 82800000), // 23 hours ago
    prioritizeSpeed: true,
    prioritizeSecurity: false
  }
];

const CrossChainControlPanel: React.FC = () => {
  // State for the operation form
  const [sourceChain, setSourceChain] = useState<BlockchainType>(BlockchainType.ETHEREUM);
  const [destinationChain, setDestinationChain] = useState<BlockchainType>(BlockchainType.SOLANA);
  const [operationType, setOperationType] = useState<OperationType>(OperationType.TRANSFER);
  const [amount, setAmount] = useState<string>('1.0');
  const [asset, setAsset] = useState<string>('ETH');
  const [prioritizeSpeed, setPrioritizeSpeed] = useState<boolean>(false);
  const [prioritizeSecurity, setPrioritizeSecurity] = useState<boolean>(false);
  const [slippageTolerance, setSlippageTolerance] = useState<number>(0.5);
  
  // State for estimated metrics
  const [estimatedFee, setEstimatedFee] = useState<number>(0);
  const [estimatedTime, setEstimatedTime] = useState<number>(0);
  const [securityScore, setSecurityScore] = useState<number>(0);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  
  // State for operation history
  const [operations, setOperations] = useState<CrossChainOperation[]>(SAMPLE_OPERATIONS);
  const [filteredOperations, setFilteredOperations] = useState<CrossChainOperation[]>(SAMPLE_OPERATIONS);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Available assets filtered by source chain
  const [availableSourceAssets, setAvailableSourceAssets] = useState<typeof AVAILABLE_ASSETS>([]);
  
  // Ref to metrics service
  const metricsService = CrossChainMetricsService.getInstance();
  
  // Update available assets when source chain changes
  useEffect(() => {
    setAvailableSourceAssets(AVAILABLE_ASSETS.filter(a => a.chains.includes(sourceChain)));
    
    // Set default asset for this chain
    const defaultAsset = AVAILABLE_ASSETS.find(a => a.chains.includes(sourceChain));
    if (defaultAsset) {
      setAsset(defaultAsset.symbol);
    }
  }, [sourceChain]);
  
  // Update destination chain if it's the same as source
  useEffect(() => {
    if (destinationChain === sourceChain) {
      // Set to a different chain
      const chains = Object.values(BlockchainType).filter(chain => 
        typeof chain === 'string' && chain !== sourceChain
      );
      
      if (chains.length > 0) {
        setDestinationChain(chains[0] as BlockchainType);
      }
    }
  }, [sourceChain, destinationChain]);
  
  // Calculate metrics when parameters change
  useEffect(() => {
    const calculateMetrics = async () => {
      setIsCalculating(true);
      
      try {
        // Simulate API call for fee estimation
        const amountValue = parseFloat(amount) || 0;
        
        // Get optimal chain based on preferences
        const optimalChain = await metricsService.getOptimalChain(
          amountValue,
          prioritizeSecurity,
          prioritizeSpeed
        );
        
        // If optimal chain is different from selected, adjust fee estimation
        const isBestChain = optimalChain === sourceChain;
        
        // Simulate metrics based on chain data
        const sourceMetrics = await metricsService.getChainMetrics(sourceChain);
        const destMetrics = await metricsService.getChainMetrics(destinationChain);
        
        // Calculate metrics based on operation type and chain characteristics
        let fee = sourceMetrics.transactionFee;
        if (operationType === OperationType.BRIDGE || operationType === OperationType.SWAP) {
          fee += destMetrics.transactionFee * 0.5; // bridges/swaps cost more
        }
        
        // Adjust for amount (larger amounts have higher fees)
        fee = fee + (Math.log(amountValue + 1) * 0.01);
        
        // Adjust for prioritizations
        if (prioritizeSpeed) fee *= 1.25;
        if (prioritizeSecurity) fee *= 1.2;
        
        // Calculate estimated time based on block times and congestion
        const baseTimeInSeconds = sourceMetrics.averageBlockTime * 3; // average confirmations
        const destTimeInSeconds = operationType !== OperationType.TRANSFER ? 
          destMetrics.averageBlockTime * 2 : 0;
        
        // Calculate congestion factor (1.0 - 2.0)
        const sourceCongestion = 1 + (sourceMetrics.congestionLevel / 100);
        const destCongestion = 1 + (destMetrics.congestionLevel / 100);
        
        // Calculate total estimated time in minutes
        const totalTimeInSeconds = 
          (baseTimeInSeconds * sourceCongestion) + 
          (destTimeInSeconds * destCongestion);
        
        // Calculate security score (weighted average of both chains)
        let secScore = sourceMetrics.securityScore;
        if (operationType !== OperationType.TRANSFER) {
          secScore = (sourceMetrics.securityScore * 0.6) + (destMetrics.securityScore * 0.4);
        }
        
        // Update state with calculated metrics
        setEstimatedFee(parseFloat(fee.toFixed(4)));
        setEstimatedTime(Math.ceil(totalTimeInSeconds / 60)); // convert to minutes
        setSecurityScore(Math.round(secScore));
      } catch (error) {
        console.error('Error calculating metrics:', error);
      } finally {
        setIsCalculating(false);
      }
    };
    
    calculateMetrics();
  }, [sourceChain, destinationChain, operationType, amount, prioritizeSpeed, prioritizeSecurity, slippageTolerance]);
  
  // Filter operations based on status
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredOperations(operations);
    } else {
      setFilteredOperations(operations.filter(op => op.status === statusFilter));
    }
  }, [statusFilter, operations]);
  
  // Handle operation execution
  const handleExecuteOperation = () => {
    // Create new operation object
    const newOperation: CrossChainOperation = {
      id: `op-${Date.now()}`,
      type: operationType,
      sourceChain,
      destinationChain,
      amount: parseFloat(amount),
      asset,
      timestamp: new Date(),
      status: TransactionStatus.PENDING,
      fee: estimatedFee,
      estimatedCompletionTime: new Date(Date.now() + (estimatedTime * 60 * 1000)),
      prioritizeSpeed,
      prioritizeSecurity
    };
    
    // Add to operations list
    setOperations([newOperation, ...operations]);
    
    // Reset form (except chains and asset)
    setAmount('1.0');
    setPrioritizeSpeed(false);
    setPrioritizeSecurity(false);
    setSlippageTolerance(0.5);
    
    // In a real app, we would send this to the backend
    console.log('Executing operation:', newOperation);
  };
  
  // Helper for getting status display
  const getStatusDisplay = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.PENDING:
        return (
          <div className="flex items-center text-yellow-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>Pending</span>
          </div>
        );
      case TransactionStatus.PROCESSING:
        return (
          <div className="flex items-center text-blue-500">
            <Zap className="h-4 w-4 mr-1" />
            <span>Processing</span>
          </div>
        );
      case TransactionStatus.COMPLETED:
        return (
          <div className="flex items-center text-green-500">
            <CheckCircle2 className="h-4 w-4 mr-1" />
            <span>Completed</span>
          </div>
        );
      case TransactionStatus.FAILED:
        return (
          <div className="flex items-center text-red-500">
            <XCircle className="h-4 w-4 mr-1" />
            <span>Failed</span>
          </div>
        );
      default:
        return status;
    }
  };
  
  // Component for the operation form
  const OperationForm = () => (
    <Card className="bg-[#1A1A1A] border-[#333] shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white">Cross-Chain Operation Control</CardTitle>
        <CardDescription className="text-gray-400">
          Configure and execute operations across multiple blockchains
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Source Chain Selector */}
          <div className="space-y-2">
            <Label htmlFor="sourceChain" className="text-white">Source Chain</Label>
            <Select 
              value={sourceChain} 
              onValueChange={(value: string) => setSourceChain(value as BlockchainType)}
            >
              <SelectTrigger id="sourceChain" className="bg-[#242424] border-[#333] text-white">
                <SelectValue placeholder="Select source chain" />
              </SelectTrigger>
              <SelectContent className="bg-[#242424] border-[#333]">
                <SelectItem value={BlockchainType.ETHEREUM} className="text-white hover:bg-[#333]">Ethereum</SelectItem>
                <SelectItem value={BlockchainType.SOLANA} className="text-white hover:bg-[#333]">Solana</SelectItem>
                <SelectItem value={BlockchainType.TON} className="text-white hover:bg-[#333]">TON</SelectItem>
                <SelectItem value={BlockchainType.BITCOIN} className="text-white hover:bg-[#333]">Bitcoin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Destination Chain Selector */}
          <div className="space-y-2">
            <Label htmlFor="destinationChain" className="text-white">Destination Chain</Label>
            <Select 
              value={destinationChain} 
              onValueChange={(value: string) => setDestinationChain(value as BlockchainType)}
            >
              <SelectTrigger id="destinationChain" className="bg-[#242424] border-[#333] text-white">
                <SelectValue placeholder="Select destination chain" />
              </SelectTrigger>
              <SelectContent className="bg-[#242424] border-[#333]">
                {Object.values(BlockchainType)
                  .filter(chain => typeof chain === 'string' && chain !== sourceChain)
                  .map((chain) => (
                    <SelectItem key={chain} value={chain} className="text-white hover:bg-[#333]">
                      {chain.charAt(0).toUpperCase() + chain.slice(1)}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Operation Type */}
        <div className="space-y-2">
          <Label htmlFor="operationType" className="text-white">Operation Type</Label>
          <Select 
            value={operationType} 
            onValueChange={(value: string) => setOperationType(value as OperationType)}
          >
            <SelectTrigger id="operationType" className="bg-[#242424] border-[#333] text-white">
              <SelectValue placeholder="Select operation type" />
            </SelectTrigger>
            <SelectContent className="bg-[#242424] border-[#333]">
              <SelectItem value={OperationType.TRANSFER} className="text-white hover:bg-[#333]">Transfer (Same Asset)</SelectItem>
              <SelectItem value={OperationType.SWAP} className="text-white hover:bg-[#333]">Swap (Change Asset)</SelectItem>
              <SelectItem value={OperationType.BRIDGE} className="text-white hover:bg-[#333]">Bridge (Cross-Chain)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Asset Selector */}
          <div className="space-y-2">
            <Label htmlFor="asset" className="text-white">Asset</Label>
            <Select 
              value={asset} 
              onValueChange={setAsset}
            >
              <SelectTrigger id="asset" className="bg-[#242424] border-[#333] text-white">
                <SelectValue placeholder="Select asset" />
              </SelectTrigger>
              <SelectContent className="bg-[#242424] border-[#333]">
                {availableSourceAssets.map((asset) => (
                  <SelectItem key={asset.symbol} value={asset.symbol} className="text-white hover:bg-[#333]">
                    {asset.symbol} - {asset.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-white">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-[#242424] border-[#333] text-white"
              placeholder="Enter amount"
              min="0"
              step="0.01"
            />
          </div>
        </div>
        
        {/* Advanced Operation Settings */}
        <div className="p-4 bg-[#242424] rounded-lg space-y-4">
          <h3 className="text-white font-medium">Advanced Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Prioritize Speed Switch */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="prioritizeSpeed" className="text-white">Prioritize Speed</Label>
                <p className="text-xs text-gray-400">Pay higher fees for faster processing</p>
              </div>
              <Switch
                id="prioritizeSpeed"
                checked={prioritizeSpeed}
                onCheckedChange={setPrioritizeSpeed}
              />
            </div>
            
            {/* Prioritize Security Switch */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="prioritizeSecurity" className="text-white">Prioritize Security</Label>
                <p className="text-xs text-gray-400">Enhanced verification for critical operations</p>
              </div>
              <Switch
                id="prioritizeSecurity"
                checked={prioritizeSecurity}
                onCheckedChange={setPrioritizeSecurity}
              />
            </div>
          </div>
          
          {/* Slippage Tolerance (only for swaps) */}
          {operationType === OperationType.SWAP && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="slippageTolerance" className="text-white">Slippage Tolerance: {slippageTolerance}%</Label>
              </div>
              <Slider
                id="slippageTolerance"
                value={[slippageTolerance]}
                onValueChange={(values) => setSlippageTolerance(values[0])}
                max={5}
                step={0.1}
                className="w-full"
              />
              <p className="text-xs text-gray-400">Maximum allowed price movement during swap execution</p>
            </div>
          )}
        </div>
        
        {/* Estimated Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-[#242424] border-[#333]">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <DollarSign className="h-8 w-8 text-[#6B00D7] mb-2" />
                <h3 className="text-gray-400 text-sm font-medium">Estimated Fee</h3>
                {isCalculating ? (
                  <div className="animate-pulse h-6 w-20 bg-[#333] rounded mt-1"></div>
                ) : (
                  <p className="text-2xl font-bold text-white">${estimatedFee}</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#242424] border-[#333]">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Clock className="h-8 w-8 text-[#6B00D7] mb-2" />
                <h3 className="text-gray-400 text-sm font-medium">Estimated Time</h3>
                {isCalculating ? (
                  <div className="animate-pulse h-6 w-20 bg-[#333] rounded mt-1"></div>
                ) : (
                  <p className="text-2xl font-bold text-white">{estimatedTime} min</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#242424] border-[#333]">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Shield className="h-8 w-8 text-[#6B00D7] mb-2" />
                <h3 className="text-gray-400 text-sm font-medium">Security Score</h3>
                {isCalculating ? (
                  <div className="animate-pulse h-6 w-20 bg-[#333] rounded mt-1"></div>
                ) : (
                  <div className="flex items-center">
                    <p className="text-2xl font-bold text-white">{securityScore}/100</p>
                    <div className={`ml-2 h-3 w-3 rounded-full ${
                      securityScore > 80 ? 'bg-green-500' : 
                      securityScore > 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleExecuteOperation}
          className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white font-semibold hover:bg-gradient-to-r hover:from-[#6B00D7]/90 hover:to-[#FF5AF7]/90"
          disabled={isCalculating || !amount || parseFloat(amount) <= 0}
        >
          Execute Operation
        </Button>
      </CardFooter>
    </Card>
  );
  
  // Component for operation history
  const OperationHistory = () => (
    <Card className="bg-[#1A1A1A] border-[#333] shadow-xl mt-8">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-bold text-white">Operation History</CardTitle>
            <CardDescription className="text-gray-400">
              Track and manage your cross-chain operations
            </CardDescription>
          </div>
          
          <Select 
            value={statusFilter} 
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[150px] bg-[#242424] border-[#333] text-white h-8">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-[#242424] border-[#333]">
              <SelectItem value="all" className="text-white hover:bg-[#333]">All</SelectItem>
              <SelectItem value={TransactionStatus.PENDING} className="text-white hover:bg-[#333]">Pending</SelectItem>
              <SelectItem value={TransactionStatus.PROCESSING} className="text-white hover:bg-[#333]">Processing</SelectItem>
              <SelectItem value={TransactionStatus.COMPLETED} className="text-white hover:bg-[#333]">Completed</SelectItem>
              <SelectItem value={TransactionStatus.FAILED} className="text-white hover:bg-[#333]">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {filteredOperations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No operations found</p>
            </div>
          ) : (
            filteredOperations.map((operation) => (
              <div key={operation.id} className="bg-[#242424] rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-white font-semibold">{operation.type.charAt(0).toUpperCase() + operation.type.slice(1)}</span>
                    <span className="mx-2 text-gray-500">•</span>
                    <span className="text-gray-400">{operation.asset}</span>
                    <span className="mx-2 text-gray-500">•</span>
                    <span className="text-white font-medium">{operation.amount}</span>
                  </div>
                  {getStatusDisplay(operation.status)}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">From</p>
                    <p className="text-white capitalize">{operation.sourceChain}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">To</p>
                    <p className="text-white capitalize">{operation.destinationChain}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Fee</p>
                    <p className="text-white">${operation.fee.toFixed(4)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Time</p>
                    <p className="text-white">{operation.timestamp.toLocaleTimeString()}</p>
                  </div>
                </div>
                
                {operation.status === TransactionStatus.PENDING || operation.status === TransactionStatus.PROCESSING ? (
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center text-yellow-500">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Estimated completion: {operation.estimatedCompletionTime.toLocaleTimeString()}</span>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-7 px-2 text-xs border-[#6B00D7] text-[#FF5AF7] hover:bg-[#6B00D7]/10"
                    >
                      View Details
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-7 px-2 text-xs border-[#6B00D7] text-[#FF5AF7] hover:bg-[#6B00D7]/10"
                    >
                      View Details
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="control" className="w-full">
        <TabsList className="w-full bg-[#242424] border-b border-[#333] mb-6">
          <TabsTrigger value="control" className="flex-1 data-[state=active]:bg-[#333] text-gray-300 data-[state=active]:text-white">
            Operation Control
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex-1 data-[state=active]:bg-[#333] text-gray-300 data-[state=active]:text-white">
            Analytics & Monitoring
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex-1 data-[state=active]:bg-[#333] text-gray-300 data-[state=active]:text-white">
            Configuration
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="control" className="space-y-4">
          <OperationForm />
          <OperationHistory />
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card className="bg-[#1A1A1A] border-[#333] shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white">Cross-Chain Analytics</CardTitle>
              <CardDescription className="text-gray-400">
                Performance insights and optimization recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-gray-400">Analytics dashboard is under development</p>
                <p className="text-sm text-gray-500 mt-2">Check back soon for detailed cross-chain analytics</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card className="bg-[#1A1A1A] border-[#333] shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white">Cross-Chain Configuration</CardTitle>
              <CardDescription className="text-gray-400">
                Manage your cross-chain settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-gray-400">Configuration panel is under development</p>
                <p className="text-sm text-gray-500 mt-2">Check back soon for advanced cross-chain settings</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CrossChainControlPanel;