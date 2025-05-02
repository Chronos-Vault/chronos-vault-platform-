import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useCVTToken } from '@/contexts/cvt-token-context';
import { useMultiChain } from '@/contexts/multi-chain-context';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Clock, Shield, Lock, Unlock, Sparkles, Zap, ExternalLink, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

interface CVTPaymentProps {
  vaultId?: string;
  amount?: number;
  description?: string;
}

const CVTPaymentPage = () => {
  const params = useParams<{ vaultId: string }>();
  const vaultId = params?.vaultId;
  const [selectedFeature, setSelectedFeature] = useState<'security' | 'privacy' | 'crosschain' | 'aimonitor'>('security');
  const [_, navigate] = useLocation();
  const { tokenBalance, refreshBalances } = useCVTToken();
  const { isAnyWalletConnected } = useMultiChain();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Define pricing in CVT tokens
  const featurePricing = {
    security: 50,
    privacy: 75, 
    crosschain: 100,
    aimonitor: 150
  };
  
  // Feature descriptions
  const featureDescriptions = {
    security: {
      title: "Advanced Security Protocol",
      description: "Multi-signature protection and enhanced encryption",
      benefits: [
        "Requires multiple signatures to access vault contents",
        "Military-grade encryption for sensitive data",
        "Decentralized security verification",
        "Real-time security alerts"
      ]
    },
    privacy: {
      title: "Zero-Knowledge Privacy Layer",
      description: "Maximum privacy with zero-knowledge proofs",
      benefits: [
        "Hide transaction details while maintaining verification",
        "Preserve ownership privacy across blockchains",
        "Fully encrypted metadata",
        "Anonymous ownership transfers"
      ]
    },
    crosschain: {
      title: "Cross-Chain Compatibility",
      description: "Secure your assets across multiple blockchains",
      benefits: [
        "Simultaneous protection across Ethereum, Solana, and TON",
        "Cross-chain transaction verification",
        "Unified security monitoring across blockchains",
        "Seamless asset transfers between chains"
      ]
    },
    aimonitor: {
      title: "AI Security Monitoring",
      description: "Advanced threat detection and prevention",
      benefits: [
        "24/7 AI-powered security monitoring",
        "Predictive threat analysis and prevention",
        "Anomaly detection for suspicious activities",
        "Automated incident response"
      ]
    }
  };
  
  // Handle payment with CVT tokens
  const handlePayWithCVT = async () => {
    if (!isAnyWalletConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to use CVT tokens for payment.",
        variant: "destructive",
      });
      return;
    }
    
    const selectedPrice = featurePricing[selectedFeature];
    const userTokens = parseFloat(tokenBalance || '0');
    
    if (userTokens < selectedPrice) {
      toast({
        title: "Insufficient CVT Balance",
        description: `You need at least ${selectedPrice} CVT tokens. Your balance: ${userTokens.toFixed(2)} CVT.`,
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // This would typically call a smart contract function to transfer tokens
      // For demo, we'll simulate a successful transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // After successful payment, update the vault with the new feature
      // In a real implementation, this would be handled by a smart contract
      
      toast({
        title: "Feature Purchased Successfully",
        description: `Your vault has been enhanced with ${featureDescriptions[selectedFeature].title}.`,
      });
      
      // Refresh token balance after purchase
      await refreshBalances();
      
      // Redirect to vault details page after successful payment
      setTimeout(() => {
        if (vaultId) {
          navigate(`/vault/${vaultId}`);
        } else {
          navigate('/my-vaults');
        }
      }, 2000);
      
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <section className="py-16 min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#121212]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost" 
            className="mb-8 text-gray-400 hover:text-white"
            onClick={() => vaultId ? navigate(`/vault/${vaultId}`) : navigate('/my-vaults')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {vaultId ? 'Back to Vault Details' : 'Back to My Vaults'}
          </Button>
          
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text">
              Enhance Your Vault with CVT Tokens
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Use your CVT tokens to unlock premium security and privacy features
            </p>
            
            {isAnyWalletConnected && (
              <div className="mt-4 inline-flex items-center px-4 py-2 rounded-full bg-[#6B00D7]/10 border border-[#6B00D7]/30">
                <Sparkles className="h-4 w-4 text-[#FF5AF7] mr-2" />
                <span className="text-white font-medium">Your CVT Balance:</span>
                <span className="ml-2 text-[#FF5AF7] font-bold">{parseFloat(tokenBalance || '0').toFixed(2)} CVT</span>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {(['security', 'privacy', 'crosschain', 'aimonitor'] as const).map((feature) => {
              const details = featureDescriptions[feature];
              const price = featurePricing[feature];
              const isSelected = selectedFeature === feature;
              
              return (
                <Card 
                  key={feature}
                  className={`cursor-pointer transition-all ${isSelected ? 'border-[#6B00D7] bg-[#1A1A1A]/60' : 'border-gray-700 bg-[#161616]'}`}
                  onClick={() => setSelectedFeature(feature)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className={`${isSelected ? 'text-[#FF5AF7]' : 'text-white'}`}>
                      {details.title}
                    </CardTitle>
                    <CardDescription>
                      {details.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold mb-4 flex items-center">
                      <Zap className={`h-5 w-5 mr-2 ${isSelected ? 'text-[#FF5AF7]' : 'text-gray-400'}`} />
                      <span>{price} CVT</span>
                    </div>
                    <ul className="space-y-2">
                      {details.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <div className="h-4 w-4 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-[#FF5AF7] text-xs">✓</span>
                          </div>
                          <span className="text-gray-300">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <Card className="border-[#6B00D7]/30 bg-gray-900/60 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]"></div>
            
            <CardHeader>
              <CardTitle>
                <div className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-[#FF5AF7]" />
                  {featureDescriptions[selectedFeature].title}
                </div>
              </CardTitle>
              <CardDescription>
                Complete your purchase with CVT tokens
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Order Summary</h3>
                  <Separator className="my-3" />
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-gray-300">{featureDescriptions[selectedFeature].title}</span>
                      {vaultId && <p className="text-sm text-gray-400">Vault ID: {vaultId}</p>}
                    </div>
                    <span className="font-semibold">{featurePricing[selectedFeature]} CVT</span>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>{featurePricing[selectedFeature]} CVT</span>
                  </div>
                </div>
                
                {!isAnyWalletConnected ? (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-md p-4 text-center">
                    <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-red-500" />
                    <h3 className="text-lg font-medium text-red-400 mb-1">Wallet Not Connected</h3>
                    <p className="text-sm text-gray-300 mb-4">Please connect your wallet to proceed with CVT token payment</p>
                    <Button 
                      className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5800B3] hover:to-[#FF46E8] text-white"
                      onClick={() => navigate('/wallet-manager')}
                    >
                      Connect Wallet
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-[#6B00D7]/10 border border-[#6B00D7]/30 rounded-md p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-gray-300">Your CVT Balance</span>
                        </div>
                        <span className="font-bold text-[#FF5AF7]">{parseFloat(tokenBalance || '0').toFixed(2)} CVT</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5800B3] hover:to-[#FF46E8] text-white"
                      onClick={handlePayWithCVT}
                      disabled={isProcessing || parseFloat(tokenBalance || '0') < featurePricing[selectedFeature]}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing Payment...
                        </>
                      ) : parseFloat(tokenBalance || '0') < featurePricing[selectedFeature] ? (
                        'Insufficient CVT Balance'
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Pay with {featurePricing[selectedFeature]} CVT
                        </>
                      )}
                    </Button>
                    
                    <div className="flex justify-center">
                      <Button 
                        variant="link" 
                        className="text-gray-400 hover:text-[#FF5AF7]" 
                        onClick={() => navigate(`/premium-payment/${vaultId}`)}
                      >
                        Prefer to pay with card instead?
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CVTPaymentPage;