import React, { useState, useEffect } from 'react';
// Blockchain payments only - no Stripe as per requirements
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Blockchain payments only - no Stripe functionality as per requirements

// Define equivalent blockchain token amounts for each subscription tier
const SUBSCRIPTION_TOKENS = {
  monthly: {
    basic: { eth: 0.01, sol: 0.5, ton: 2, btc: 0.0005 },
    pro: { eth: 0.02, sol: 1, ton: 5, btc: 0.001 },
    enterprise: { eth: 0.05, sol: 2.5, ton: 10, btc: 0.0025 }
  },
  yearly: {
    basic: { eth: 0.1, sol: 5, ton: 20, btc: 0.005 },
    pro: { eth: 0.2, sol: 10, ton: 50, btc: 0.01 },
    enterprise: { eth: 0.5, sol: 25, ton: 100, btc: 0.025 }
  }
};

// Pricing details (these will be displayed to the user)
const PRICING_DETAILS = {
  monthly: {
    basic: {
      price: 9.99,
      name: 'Basic',
      features: [
        'Up to 5 secure vaults',
        'Multi-signature security',
        'Basic encryption',
        'Email support'
      ]
    },
    pro: {
      price: 19.99,
      name: 'Professional',
      features: [
        'Up to 20 secure vaults',
        'Advanced encryption',
        'Multi-chain support',
        'Priority support',
        'Advanced analytics'
      ]
    },
    enterprise: {
      price: 49.99,
      name: 'Enterprise',
      features: [
        'Unlimited secure vaults',
        'Military-grade encryption',
        'Full cross-chain compatibility',
        'Dedicated account manager',
        'Custom security features',
        'API access'
      ]
    }
  },
  yearly: {
    basic: {
      price: 99.99,
      name: 'Basic',
      features: [
        'Up to 5 secure vaults',
        'Multi-signature security',
        'Basic encryption',
        'Email support',
        'Save 16% vs monthly'
      ]
    },
    pro: {
      price: 199.99,
      name: 'Professional',
      features: [
        'Up to 20 secure vaults',
        'Advanced encryption',
        'Multi-chain support',
        'Priority support',
        'Advanced analytics',
        'Save 16% vs monthly'
      ]
    },
    enterprise: {
      price: 499.99,
      name: 'Enterprise',
      features: [
        'Unlimited secure vaults',
        'Military-grade encryption',
        'Full cross-chain compatibility',
        'Dedicated account manager',
        'Custom security features',
        'API access',
        'Save 16% vs monthly'
      ]
    }
  }
};

interface SubscriptionFormProps {
  userId: number;
  billingCycle: 'monthly' | 'yearly';
  planType: 'basic' | 'pro' | 'enterprise';
}

// Blockchain Payment Form for Subscriptions
const BlockchainSubscriptionForm: React.FC<SubscriptionFormProps> = ({ userId, billingCycle, planType }) => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('');
  const [selectedChain, setSelectedChain] = useState<'eth' | 'sol' | 'ton' | 'btc'>('eth');
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsProcessing(true);
    setStatus(`Processing ${selectedChain.toUpperCase()} subscription payment...`);

    try {
      // Simulating blockchain payment for subscription
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Subscription Active",
        description: `Your ${PRICING_DETAILS[billingCycle][planType].name} subscription is now active!`,
      });
      setStatus('Subscription active!');
      
      // Redirect to dashboard or profile page
      setTimeout(() => {
        setLocation('/dashboard');
      }, 2000);
    } catch (error) {
      toast({
        title: "Subscription Error",
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: "destructive",
      });
      setStatus('Subscription failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const planDetails = PRICING_DETAILS[billingCycle][planType];
  const tokens = SUBSCRIPTION_TOKENS[billingCycle][planType];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-bold mb-2">Subscription Summary</h3>
        <p className="text-gray-300 mb-1">{planDetails.name} Plan ({billingCycle})</p>
        <p className="text-xl font-bold">${planDetails.price.toFixed(2)}{billingCycle === 'monthly' ? '/month' : '/year'}</p>
      </div>

      <Separator />
      
      <div className="space-y-3">
        <Label>Select Payment Method</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button 
            type="button" 
            variant={selectedChain === 'eth' ? 'default' : 'outline'}
            className={selectedChain === 'eth' ? 'bg-blue-500 hover:bg-blue-600' : ''}
            onClick={() => setSelectedChain('eth')}
          >
            Ethereum ({tokens.eth} ETH)
          </Button>
          <Button 
            type="button" 
            variant={selectedChain === 'sol' ? 'default' : 'outline'}
            className={selectedChain === 'sol' ? 'bg-purple-500 hover:bg-purple-600' : ''}
            onClick={() => setSelectedChain('sol')}
          >
            Solana ({tokens.sol} SOL)
          </Button>
          <Button 
            type="button" 
            variant={selectedChain === 'ton' ? 'default' : 'outline'}
            className={selectedChain === 'ton' ? 'bg-sky-500 hover:bg-sky-600' : ''}
            onClick={() => setSelectedChain('ton')}
          >
            TON ({tokens.ton} TON)
          </Button>
          <Button 
            type="button" 
            variant={selectedChain === 'btc' ? 'default' : 'outline'}
            className={selectedChain === 'btc' ? 'bg-orange-500 hover:bg-orange-600' : ''}
            onClick={() => setSelectedChain('btc')}
          >
            Bitcoin ({tokens.btc} BTC)
          </Button>
        </div>
      </div>
      
      {status && (
        <div className={`text-sm ${status.includes('failed') ? 'text-red-500' : status.includes('active') ? 'text-green-500' : 'text-blue-500'}`}>
          {status}
        </div>
      )}
      
      <Button 
        type="submit" 
        disabled={isProcessing}
        className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5500AB] hover:to-[#FF46E8] text-white"
      >
        {isProcessing ? 'Processing...' : `Subscribe Now with ${selectedChain.toUpperCase()}`}
      </Button>
      
      <p className="text-xs text-gray-400 text-center">
        By subscribing, you agree to our terms of service and privacy policy.
        You can cancel your subscription at any time from your account settings.
      </p>
    </form>
  );
};

const SubscriptionPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'pro' | 'enterprise'>('pro');
  const [userId, setUserId] = useState<number>(1); // This would typically come from auth context

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text">
            Chronos Vault Subscription
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Secure your digital assets with our premium subscription plans
          </p>
          
          <div className="mt-8 inline-flex items-center space-x-2 bg-gray-800/50 p-1 rounded-lg">
            <Button 
              variant={billingCycle === 'monthly' ? 'default' : 'outline'}
              onClick={() => setBillingCycle('monthly')}
              className={billingCycle === 'monthly' ? 'bg-[#6B00D7]' : ''}
            >
              Monthly
            </Button>
            <Button 
              variant={billingCycle === 'yearly' ? 'default' : 'outline'}
              onClick={() => setBillingCycle('yearly')}
              className={billingCycle === 'yearly' ? 'bg-[#6B00D7]' : ''}
            >
              Yearly (Save 16%)
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {['basic', 'pro', 'enterprise'].map((plan) => {
            const planKey = plan as 'basic' | 'pro' | 'enterprise';
            const details = PRICING_DETAILS[billingCycle][planKey];
            
            return (
              <Card 
                key={plan} 
                className={`cursor-pointer ${selectedPlan === planKey ? 'border-[#6B00D7] bg-gray-900/60' : 'border-gray-700'} hover:border-[#6B00D7] transition-all`}
                onClick={() => setSelectedPlan(planKey)}
              >
                <CardHeader>
                  <CardTitle>{details.name}</CardTitle>
                  <CardDescription>
                    <span className="text-2xl font-bold">${details.price.toFixed(2)}</span>
                    <span className="text-sm">{billingCycle === 'monthly' ? '/month' : '/year'}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {details.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-[#FF5AF7] text-xs">✓</span>
                        </div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant={selectedPlan === planKey ? 'default' : 'outline'}
                    className={`w-full ${selectedPlan === planKey ? 'bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]' : ''}`}
                    onClick={() => setSelectedPlan(planKey)}
                  >
                    {selectedPlan === planKey ? 'Selected' : 'Select Plan'}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <div className="max-w-md mx-auto">
          <Card className="border-[#6B00D7]/30 bg-gray-900/60">
            <CardHeader>
              <CardTitle>Complete Your Subscription</CardTitle>
              <CardDescription>Select blockchain payment method below</CardDescription>
            </CardHeader>
            <CardContent>
              <BlockchainSubscriptionForm 
                userId={userId}
                billingCycle={billingCycle}
                planType={selectedPlan}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;