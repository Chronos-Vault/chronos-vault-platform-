import React, { useState, useEffect } from 'react';
import { 
  ArrowLeftRight,
  ArrowRight, 
  Loader2, 
  AlertCircle,
  CheckCircle,
  InfoIcon,
  RefreshCw,
  DollarSign,
  Clock,
  ChevronDown,
  Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { BlockchainType, TransferRoute } from '@/lib/cross-chain/interfaces';
import { crossChainBridge, NETWORK_CONFIG, SUPPORTED_TOKENS, NetworkConfig } from '@/lib/cross-chain/bridge';
import CrossChainVisualizer from './CrossChainVisualizer';
import { useBlockchain } from '@/contexts/BlockchainContext';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Types
type TokenOption = typeof SUPPORTED_TOKENS[BlockchainType][0];

interface TransferState {
  status: 'idle' | 'loading' | 'success' | 'error';
  txId?: string;
  txHash?: string;
  errorMessage?: string;
  transferProgress?: number;
  route?: {
    path: Array<{
      network: BlockchainType;
      protocol: string;
    }>;
    estimatedTime: number;
  };
}

// For simplified simulation, we'll use local state to mimic wallet connection
// In a real application, we would use the actual wallet connection from the BlockchainContext

export default function CrossChainTransfer() {
  const { toast } = useToast();
  const blockchain = useBlockchain();
  const [walletConnected, setWalletConnected] = useState(false);
  const [currentTransfer, setCurrentTransfer] = useState<any>(null);
  const [transferPriority, setTransferPriority] = useState<'speed' | 'cost' | 'security'>('speed');
  
  // Check wallet connection
  useEffect(() => {
    // Check if any wallet is connected
    setWalletConnected(blockchain.connectedWallets.length > 0);
  }, [blockchain.connectedWallets]);
  
  const handleConnectWallet = (event: React.MouseEvent<HTMLButtonElement>) => {
    // In a real implementation, this would use the BlockchainContext
    // For now, we'll just simulate a successful connection
    setWalletConnected(true);
  };
  
  // Form state
  const [sourceChain, setSourceChain] = useState<BlockchainType>('TON');
  const [targetChain, setTargetChain] = useState<BlockchainType>('ETH');
  const [sourceToken, setSourceToken] = useState<string>('');
  const [targetToken, setTargetToken] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [transferState, setTransferState] = useState<TransferState>({ status: 'idle' });
  
  // Get network configurations
  const sourceChainData = NETWORK_CONFIG[sourceChain];
  const targetChainData = NETWORK_CONFIG[targetChain];
  
  // Create a list of blockchain options for dropdowns
  const chainOptions = Object.keys(NETWORK_CONFIG) as BlockchainType[];
  
  // Additional state for advanced features
  const [estimatedFee, setEstimatedFee] = useState<number>(0);
  const [estimatedTime, setEstimatedTime] = useState<string>('');
  const [transferRoute, setTransferRoute] = useState<TransferRoute | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [isValidPair, setIsValidPair] = useState<boolean>(true);
  
  // Update token options when chain changes
  useEffect(() => {
    if (sourceChain && SUPPORTED_TOKENS[sourceChain]?.length > 0) {
      setSourceToken(SUPPORTED_TOKENS[sourceChain][0].symbol);
    } else {
      setSourceToken('');
    }
  }, [sourceChain]);
  
  useEffect(() => {
    if (targetChain && SUPPORTED_TOKENS[targetChain]?.length > 0) {
      // Try to match the source token if available on target chain
      const matchedToken = SUPPORTED_TOKENS[targetChain].find(
        t => t.symbol === sourceToken
      );
      setTargetToken(matchedToken ? matchedToken.symbol : SUPPORTED_TOKENS[targetChain][0].symbol);
    } else {
      setTargetToken('');
    }
  }, [targetChain, sourceToken]);
  
  // Fetch fee estimation when relevant parameters change
  useEffect(() => {
    if (sourceChain && targetChain && sourceToken && targetToken && amount) {
      fetchFeeEstimate();
      fetchTransferRoute();
      fetchExchangeRate();
    }
  }, [sourceChain, targetChain, sourceToken, targetToken, amount, transferPriority]);
  
  // Function to fetch fee estimate from API
  const fetchFeeEstimate = async () => {
    try {
      // Only fetch if we have all required parameters
      if (!sourceChain || !targetChain || !sourceToken || !targetToken || !amount || isNaN(Number(amount)) || Number(amount) <= 0) {
        return;
      }
      
      const response = await apiRequest('GET', `/api/cross-chain/estimate-fee?sourceChain=${sourceChain}&targetChain=${targetChain}&amount=${amount}&sourceToken=${sourceToken}&targetToken=${targetToken}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch fee estimate');
      }
      
      const data = await response.json();
      setEstimatedFee(data.fee);
      
    } catch (error) {
      console.error('Error fetching fee estimate:', error);
      setEstimatedFee(0);
    }
  };
  
  // Function to fetch transfer route
  const fetchTransferRoute = async () => {
    try {
      // Only fetch if we have required parameters
      if (!sourceChain || !targetChain) {
        return;
      }
      
      const response = await apiRequest('GET', `/api/cross-chain/route?sourceChain=${sourceChain}&targetChain=${targetChain}&priority=${transferPriority}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch transfer route');
      }
      
      const data = await response.json();
      setTransferRoute(data.route);
      
      // Also fetch estimated time
      const timeResponse = await apiRequest('GET', `/api/cross-chain/estimate-time?sourceChain=${sourceChain}&targetChain=${targetChain}`);
      
      if (timeResponse.ok) {
        const timeData = await timeResponse.json();
        setEstimatedTime(timeData.estimatedTime);
      }
      
    } catch (error) {
      console.error('Error fetching transfer route:', error);
      setTransferRoute(null);
      setEstimatedTime('');
    }
  };
  
  // Function to fetch exchange rate
  const fetchExchangeRate = async () => {
    try {
      // Only fetch if we have required parameters
      if (!sourceChain || !targetChain || !sourceToken || !targetToken) {
        return;
      }
      
      const response = await apiRequest('GET', `/api/cross-chain/rates?sourceChain=${sourceChain}&targetChain=${targetChain}&sourceToken=${sourceToken}&targetToken=${targetToken}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch exchange rate');
      }
      
      const data = await response.json();
      setExchangeRate(data.rate);
      
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
      setExchangeRate(null);
    }
  };
  
  // Function to check if tokens are bridgeable
  const checkTokenBridgeable = async () => {
    try {
      // Only check if we have required parameters
      if (!sourceChain || !targetChain || !sourceToken) {
        return;
      }
      
      const response = await apiRequest('GET', `/api/cross-chain/is-bridgeable?sourceChain=${sourceChain}&targetChain=${targetChain}&tokenSymbol=${sourceToken}`);
      
      if (!response.ok) {
        throw new Error('Failed to check if token is bridgeable');
      }
      
      const data = await response.json();
      setIsValidPair(data.bridgeable);
      
    } catch (error) {
      console.error('Error checking if token is bridgeable:', error);
      setIsValidPair(false);
    }
  };
  
  // Calculate received amount based on exchange rate
  const calculatedReceiveAmount = (exchangeRate && amount && !isNaN(Number(amount))) 
    ? (Number(amount) * (exchangeRate || 1)).toFixed(6) 
    : amount;
  
  // Enhanced transfer function using the new API
  const handleTransfer = async () => {
    if (!sourceChain || !targetChain || !sourceToken || !targetToken || !amount) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setTransferState({ status: 'loading' });
      
      // API call to initiate transfer
      const response = await apiRequest('POST', '/api/cross-chain/transfer', {
        sourceChain,
        targetChain,
        sourceToken,
        targetToken,
        amount: Number(amount),
        priority: transferPriority,
        // In a real implementation, we would get these from a wallet
        sender: 'UQCctckQeh8Xo8-_U4L8PpXtjMBlG71S8PD8QZvr9OzmJkpA',
        recipient: 'GSQmkmYN5gZ5BFiccWc45Q2RMVnqGbYXG3UP4mH3RC5F'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Transfer failed');
      }
      
      const data = await response.json();
      
      // Store the transfer data
      setCurrentTransfer(data);
      
      // Success state
      setTransferState({ 
        status: 'success', 
        txId: data.id,
        txHash: data.txHash,
        route: data.route,
        transferProgress: 0
      });
      
      toast({
        title: "Transfer Initiated",
        description: "Your cross-chain transfer has been initiated successfully!",
        variant: "default",
      });
      
      // Start periodic status checks
      startStatusCheck(data.id);
      
    } catch (error: any) {
      console.error('Transfer error:', error);
      
      const errorMessage = error?.message || 'An unknown error occurred';
      
      setTransferState({ 
        status: 'error',
        errorMessage
      });
      
      toast({
        title: "Transfer Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };
  
  // Function to check transfer status periodically
  const startStatusCheck = (transactionId: string) => {
    // Set up an interval to check status
    const checkInterval = setInterval(async () => {
      try {
        const response = await apiRequest('GET', `/api/cross-chain/status/${transactionId}`);
        
        if (!response.ok) {
          throw new Error('Failed to check status');
        }
        
        const data = await response.json();
        
        // Update the transfer state with progress
        setTransferState(prevState => ({
          ...prevState,
          status: data.status,
          transferProgress: data.progress
        }));
        
        // If transfer is completed or failed, stop checking
        if (data.status === 'completed' || data.status === 'failed') {
          clearInterval(checkInterval);
        }
        
      } catch (error) {
        console.error('Error checking transfer status:', error);
        // Don't change the status on error, just log it
      }
    }, 5000); // Check every 5 seconds
    
    // Return a cleanup function
    return () => {
      clearInterval(checkInterval);
    };
  };
  
  // Reset the form
  const resetForm = () => {
    setSourceChain('TON');
    setTargetChain('ETH');
    setSourceToken('');
    setTargetToken('');
    setAmount('');
    setTransferState({ status: 'idle' });
    setCurrentTransfer(null);
    setTransferPriority('speed');
  };
  
  return (
    <Card className="w-full max-w-2xl mx-auto border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <ArrowLeftRight className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Cross-Chain Asset Transfer</CardTitle>
              <CardDescription>
                Transfer assets seamlessly between different blockchain networks
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="text-primary border-primary/30">
            Beta
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        {!walletConnected ? (
          <div className="text-center p-6">
            <div className="mb-4">
              <AlertCircle className="h-12 w-12 text-primary/60 mx-auto mb-2" />
              <h3 className="text-lg font-semibold mb-1">Wallet Connection Required</h3>
              <p className="text-gray-500 mb-4">
                Connect your wallet to use cross-chain transfer features
              </p>
              <Button onClick={() => blockchain.connectTON()} className="bg-gradient-to-r from-primary to-purple-700">
                Connect Wallet
              </Button>
            </div>
          </div>
        ) : transferState.status === 'success' ? (
          <div className="text-center p-6">
            <div className="mb-6">
              <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Transfer Initiated!</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Your transfer from {sourceChainData?.name} to {targetChainData?.name} has been initiated.
                You will receive {amount} {targetToken} on {targetChainData?.name} shortly.
              </p>
              
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-6 mx-auto max-w-md">
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Transaction Hash:</span>
                  <span className="text-gray-900 dark:text-gray-200 font-mono">
                    {transferState.txHash?.substring(0, 10)}...{transferState.txHash?.substring(56)}
                  </span>
                </div>
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Estimated Time:</span>
                  <span className="text-gray-900 dark:text-gray-200">{estimatedTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Status:</span>
                  <span className="text-primary font-medium">Processing</span>
                </div>
              </div>
              
              <Button onClick={resetForm} variant="outline" className="mr-2">
                Start New Transfer
              </Button>
              <Button className="bg-primary">
                View Transaction
              </Button>
            </div>
          </div>
        ) : transferState.status === 'error' ? (
          <div className="text-center p-6">
            <div className="mb-6">
              <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Transfer Failed</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {transferState.errorMessage || "There was an error processing your transfer."}
              </p>
              
              <Button onClick={resetForm} variant="outline" className="mr-2">
                Try Again
              </Button>
              <Button className="bg-primary">
                Contact Support
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Source Chain</label>
                <Select 
                  value={sourceChain} 
                  onValueChange={(value: BlockchainType) => setSourceChain(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source chain" />
                  </SelectTrigger>
                  <SelectContent>
                    {chainOptions.map((chain) => (
                      <SelectItem key={chain} value={chain}>
                        <div className="flex items-center">
                          <span className="mr-2">{NETWORK_CONFIG[chain].logoUrl}</span>
                          <span>{NETWORK_CONFIG[chain].name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Target Chain</label>
                <Select 
                  value={targetChain} 
                  onValueChange={(value: BlockchainType) => setTargetChain(value)} 
                  disabled={!sourceChain}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select target chain" />
                  </SelectTrigger>
                  <SelectContent>
                    {chainOptions
                      .filter(chain => chain !== sourceChain)
                      .map((chain) => (
                        <SelectItem key={chain} value={chain}>
                          <div className="flex items-center">
                            <span className="mr-2">{NETWORK_CONFIG[chain].logoUrl}</span>
                            <span>{NETWORK_CONFIG[chain].name}</span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Source Token</label>
                <Select value={sourceToken} onValueChange={setSourceToken} disabled={!sourceChain}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select token" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_TOKENS[sourceChain].map((token) => (
                      <SelectItem key={token.symbol} value={token.symbol}>
                        <div className="flex items-center">
                          <span className="mr-2">{token.logo}</span>
                          <span>{token.symbol} - {token.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Target Token</label>
                <Select value={targetToken} onValueChange={setTargetToken} disabled={!targetChain}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select token" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_TOKENS[targetChain].map((token) => (
                      <SelectItem key={token.symbol} value={token.symbol}>
                        <div className="flex items-center">
                          <span className="mr-2">{token.logo}</span>
                          <span>{token.symbol} - {token.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Amount</label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pr-16"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  {sourceToken}
                </div>
              </div>
            </div>
            
            {sourceChain && targetChain && sourceToken && targetToken && amount && (
              <>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                  <h4 className="font-medium mb-3 flex items-center gap-1.5">
                    <InfoIcon className="h-4 w-4 text-gray-500" />
                    <span>Transfer Details</span>
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">You send:</span>
                      <span className="font-medium">{amount} {sourceToken} on {sourceChainData?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">You receive:</span>
                      <span className="font-medium">{amount} {targetToken} on {targetChainData?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Estimated fee:</span>
                      <span className="font-medium">{estimatedFee.toFixed(5)} {sourceToken}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Estimated time:</span>
                      <span className="font-medium">{estimatedTime}</span>
                    </div>
                  </div>
                </div>
                
                <Alert className="bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-600">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    Cross-chain transfers are subject to network conditions. Once initiated, transfers cannot be canceled.
                  </AlertDescription>
                </Alert>
              </>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-end">
        {walletConnected && transferState.status === 'idle' && (
          <Button 
            className="bg-gradient-to-r from-primary to-purple-700 shadow-md w-full sm:w-auto"
            disabled={!sourceChain || !targetChain || !sourceToken || !targetToken || !amount || Number(amount) <= 0}
            onClick={handleTransfer}
          >
            <span className="flex items-center">
              Initiate Transfer
              <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}