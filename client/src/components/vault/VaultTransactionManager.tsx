import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2, AlertCircle, ArrowRight, Key, Shield, RefreshCw } from 'lucide-react';
import { useEthereum } from '@/contexts/ethereum-context';
import { useSolana } from '@/contexts/solana-context';
import { useTon } from '@/contexts/ton-context';
import { BlockchainType } from '@/lib/web3Config';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

type TransactionStatus = 'idle' | 'preparing' | 'ready' | 'signing' | 'broadcasting' | 'confirming' | 'completed' | 'error';

interface TransactionConfig {
  blockchain: BlockchainType;
  contractType: string;
  vaultName: string;
  assetAmount: string;
  assetType: string;
  timeLockPeriod: number;
  recipients?: string[];
  requireMultiSig?: boolean;
  threshold?: number;
  signers?: { address: string }[];
  geoLock?: boolean;
  metadata?: Record<string, any>;
}

interface VaultTransactionManagerProps {
  config: TransactionConfig;
  onTransactionComplete?: (txHash: string, vaultAddress: string) => void;
  onError?: (error: string) => void;
  className?: string;
}

export function VaultTransactionManager({
  config,
  onTransactionComplete,
  onError,
  className
}: VaultTransactionManagerProps) {
  const { toast } = useToast();
  const { isConnected: isEthConnected, connect: connectEth, signTransaction: signEthTransaction } = useEthereum();
  const { isConnected: isSolConnected, connect: connectSol, signTransaction: signSolTransaction } = useSolana();
  const { isConnected: isTonConnected, connect: connectTon, signTransaction: signTonTransaction } = useTon();
  
  const [status, setStatus] = useState<TransactionStatus>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [txHash, setTxHash] = useState<string>('');
  const [vaultAddress, setVaultAddress] = useState<string>('');
  const [estimatedFee, setEstimatedFee] = useState<string>('');
  
  // Reset state if config changes
  useEffect(() => {
    setStatus('idle');
    setStatusMessage('');
    setErrorMessage('');
    setTxHash('');
    setVaultAddress('');
  }, [config]);
  
  // Check if wallet is connected
  const isConnected = () => {
    switch (config.blockchain) {
      case BlockchainType.ETHEREUM:
        return isEthConnected;
      case BlockchainType.SOLANA:
        return isSolConnected;
      case BlockchainType.TON:
        return isTonConnected;
      default:
        return false;
    }
  };
  
  // Connect to wallet
  const connectWallet = async () => {
    try {
      switch (config.blockchain) {
        case BlockchainType.ETHEREUM:
          await connectEth();
          break;
        case BlockchainType.SOLANA:
          await connectSol();
          break;
        case BlockchainType.TON:
          await connectTon();
          break;
      }
    } catch (error) {
      setErrorMessage(`Failed to connect wallet: ${error instanceof Error ? error.message : 'Unknown error'}`);
      if (onError) onError(`Failed to connect wallet: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  
  // Start transaction preparation
  const prepareTransaction = async () => {
    if (!isConnected()) {
      setErrorMessage('Please connect your wallet first');
      return;
    }
    
    setStatus('preparing');
    setStatusMessage('Preparing transaction data...');
    
    try {
      // Simulate blockchain-specific fee estimation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      switch (config.blockchain) {
        case BlockchainType.ETHEREUM:
          setEstimatedFee('0.00042 ETH');
          break;
        case BlockchainType.SOLANA:
          setEstimatedFee('0.000005 SOL');
          break;
        case BlockchainType.TON:
          setEstimatedFee('0.05 TON');
          break;
      }
      
      setStatus('ready');
      setStatusMessage('Transaction ready to sign');
    } catch (error) {
      setStatus('error');
      setErrorMessage(`Failed to prepare transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
      if (onError) onError(`Failed to prepare transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  
  // Sign and send transaction
  const signAndSendTransaction = async () => {
    if (status !== 'ready') {
      setErrorMessage('Transaction is not ready to sign');
      return;
    }
    
    setStatus('signing');
    setStatusMessage('Please sign the transaction in your wallet...');
    
    try {
      // Handle blockchain-specific signing
      let signature: string = '';
      
      switch (config.blockchain) {
        case BlockchainType.ETHEREUM:
          signature = await signEthTransaction({
            contractType: config.contractType,
            params: {
              name: config.vaultName,
              amount: config.assetAmount,
              tokenType: config.assetType,
              lockPeriod: config.timeLockPeriod,
              multiSig: config.requireMultiSig,
              threshold: config.threshold || 1,
              signers: config.signers || [],
              geoLock: config.geoLock || false,
              metadata: config.metadata || {}
            }
          });
          break;
        case BlockchainType.SOLANA:
          signature = await signSolTransaction({
            contractType: config.contractType,
            params: {
              name: config.vaultName,
              amount: config.assetAmount,
              tokenType: config.assetType,
              lockPeriod: config.timeLockPeriod,
              multiSig: config.requireMultiSig,
              threshold: config.threshold || 1,
              signers: config.signers || [],
              geoLock: config.geoLock || false,
              metadata: config.metadata || {}
            }
          });
          break;
        case BlockchainType.TON:
          signature = await signTonTransaction({
            contractType: config.contractType,
            params: {
              name: config.vaultName,
              amount: config.assetAmount,
              tokenType: config.assetType,
              lockPeriod: config.timeLockPeriod,
              multiSig: config.requireMultiSig,
              threshold: config.threshold || 1,
              signers: config.signers || [],
              geoLock: config.geoLock || false,
              metadata: config.metadata || {}
            }
          });
          break;
      }
      
      if (!signature) {
        throw new Error('Transaction was not signed');
      }
      
      setTxHash(signature);
      setStatus('broadcasting');
      setStatusMessage('Broadcasting transaction to the network...');
      
      // Simulate transaction broadcast and confirmation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setStatus('confirming');
      setStatusMessage('Waiting for blockchain confirmation...');
      
      // Simulate transaction confirmation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate a simulated vault address
      let generatedVaultAddress = '';
      switch (config.blockchain) {
        case BlockchainType.ETHEREUM:
          generatedVaultAddress = `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
          break;
        case BlockchainType.SOLANA:
          generatedVaultAddress = Array(44).fill(0).map(() => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 62)]).join('');
          break;
        case BlockchainType.TON:
          generatedVaultAddress = `EQ${Array(44).fill(0).map(() => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'[Math.floor(Math.random() * 64)]).join('')}`;
          break;
      }
      
      setVaultAddress(generatedVaultAddress);
      setStatus('completed');
      setStatusMessage('Vault created successfully!');
      
      toast({
        title: 'Vault Creation Successful',
        description: `Your ${config.vaultName} vault has been deployed to the blockchain.`,
      });
      
      if (onTransactionComplete) {
        onTransactionComplete(signature, generatedVaultAddress);
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage(`Transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      if (onError) onError(`Transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  
  const retry = () => {
    setStatus('idle');
    setErrorMessage('');
    setStatusMessage('');
  };
  
  return (
    <div className={className}>
      <Card className="border border-[#6B00D7]/30 bg-gradient-to-br from-[#121212]/80 to-[#1A1A1A]/80 backdrop-blur-sm">
        <CardContent className="p-5 space-y-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Vault Creation Transaction</h3>
              <Badge className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white border-0">
                {config.blockchain.toUpperCase()}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Vault Type:</span>
                <span className="text-white font-medium">{config.contractType}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Asset:</span>
                <span className="text-white font-medium">{config.assetAmount} {config.assetType}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Time Lock:</span>
                <span className="text-white font-medium">{config.timeLockPeriod} days</span>
              </div>
              {config.requireMultiSig && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Multi-Signature:</span>
                  <span className="text-white font-medium">{config.threshold} of {config.signers?.length} required</span>
                </div>
              )}
              {estimatedFee && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Estimated Fee:</span>
                  <span className="text-white font-medium">{estimatedFee}</span>
                </div>
              )}
            </div>
            
            {status === 'error' && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            
            <div className="pt-2">
              {status === 'idle' && !isConnected() && (
                <Button
                  className="w-full bg-gradient-to-r from-[#6B00D7]/90 to-[#FF5AF7]/90 hover:from-[#7B10E7] hover:to-[#FF6AF7] text-white"
                  onClick={connectWallet}
                >
                  <Key className="h-4 w-4 mr-2" />
                  Connect {config.blockchain} Wallet
                </Button>
              )}
              
              {status === 'idle' && isConnected() && (
                <Button
                  className="w-full bg-gradient-to-r from-[#6B00D7]/90 to-[#FF5AF7]/90 hover:from-[#7B10E7] hover:to-[#FF6AF7] text-white"
                  onClick={prepareTransaction}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Prepare Vault Transaction
                </Button>
              )}
              
              {status === 'preparing' && (
                <Button
                  className="w-full bg-[#6B00D7]/50 text-white cursor-not-allowed"
                  disabled
                >
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {statusMessage}
                </Button>
              )}
              
              {status === 'ready' && (
                <Button
                  className="w-full bg-gradient-to-r from-[#6B00D7]/90 to-[#FF5AF7]/90 hover:from-[#7B10E7] hover:to-[#FF6AF7] text-white"
                  onClick={signAndSendTransaction}
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Sign & Create Vault
                </Button>
              )}
              
              {(status === 'signing' || status === 'broadcasting' || status === 'confirming') && (
                <Button
                  className="w-full bg-[#6B00D7]/50 text-white cursor-not-allowed"
                  disabled
                >
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {statusMessage}
                </Button>
              )}
              
              {status === 'completed' && (
                <div className="space-y-3">
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white cursor-default"
                    disabled
                  >
                    <Check className="h-4 w-4 mr-2" />
                    {statusMessage}
                  </Button>
                  
                  {vaultAddress && (
                    <div className="bg-[#1A1A1A] border border-[#6B00D7]/20 rounded-md p-3">
                      <p className="text-xs text-gray-400 mb-1">Vault Address:</p>
                      <p className="text-xs font-mono text-gray-300 break-all">{vaultAddress}</p>
                    </div>
                  )}
                  
                  {txHash && (
                    <div className="bg-[#1A1A1A] border border-[#6B00D7]/20 rounded-md p-3">
                      <p className="text-xs text-gray-400 mb-1">Transaction Hash:</p>
                      <p className="text-xs font-mono text-gray-300 break-all">{txHash}</p>
                    </div>
                  )}
                </div>
              )}
              
              {status === 'error' && (
                <Button
                  className="w-full bg-[#1A1A1A] border border-[#6B00D7]/30 text-white hover:bg-[#252525]"
                  onClick={retry}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
