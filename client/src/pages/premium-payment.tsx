import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useParams, useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

// Make sure to call loadStripe outside of a component's render to avoid
// recreating the Stripe object on every render
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface CheckoutFormProps {
  amount: number;
  vaultId?: string;
  description?: string;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ amount, vaultId, description }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentStatus, setPaymentStatus] = useState<string>('');
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      toast({
        title: "Payment Error",
        description: "Card element not found",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('Processing payment...');

    try {
      // Create payment intent on the server
      const response = await apiRequest('POST', '/api/payments/create-payment-intent', {
        amount,
        vaultId,
        description: description || `Premium vault features - ${vaultId}`
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = await response.json();

      // Confirm the payment with Stripe.js
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
        setPaymentStatus('Payment failed: ' + error.message);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        toast({
          title: "Payment Successful",
          description: "Your vault has been upgraded with premium features!",
        });
        setPaymentStatus('Payment successful!');
        
        // Redirect to vault details page after successful payment
        setTimeout(() => {
          if (vaultId) {
            setLocation(`/vaults/${vaultId}`);
          } else {
            setLocation('/my-vaults');
          }
        }, 2000);
      }
    } catch (error) {
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: "destructive",
      });
      setPaymentStatus('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="card-element">Card Details</Label>
          <div className="p-3 border rounded-md bg-background">
            <CardElement id="card-element" options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }} />
          </div>
        </div>
        
        {paymentStatus && (
          <div className={`text-sm ${paymentStatus.includes('failed') ? 'text-red-500' : paymentStatus.includes('success') ? 'text-green-500' : 'text-blue-500'}`}>
            {paymentStatus}
          </div>
        )}
        
        <Button 
          type="submit" 
          disabled={!stripe || isProcessing}
          className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5500AB] hover:to-[#FF46E8] text-white"
        >
          {isProcessing ? 'Processing...' : `Pay $${(amount / 100).toFixed(2)}`}
        </Button>
      </div>
    </form>
  );
};

const PremiumPaymentPage: React.FC = () => {
  const params = useParams<{ vaultId: string }>();
  const vaultId = params?.vaultId;
  const [activeTab, setActiveTab] = useState<'standard' | 'premium' | 'elite'>('premium');

  // Define premium tiers
  const pricingOptions = {
    standard: {
      name: "Standard",
      price: 1995, // $19.95
      features: [
        "Multi-signature security",
        "Cross-chain compatibility",
        "1-year time-lock vaults",
        "Basic analytics"
      ]
    },
    premium: {
      name: "Premium",
      price: 4995, // $49.95
      features: [
        "All Standard features",
        "Advanced security measures",
        "10-year time-lock vaults",
        "Enhanced privacy options",
        "Detailed analytics dashboard"
      ]
    },
    elite: {
      name: "Elite",
      price: 9995, // $99.95
      features: [
        "All Premium features",
        "Military-grade encryption",
        "Unlimited time-lock periods",
        "Zero-knowledge privacy layer",
        "AI-enhanced security monitoring",
        "Priority support"
      ]
    }
  };

  const selectedPlan = pricingOptions[activeTab];

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text">
            Upgrade Your Vault Security
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Enhance your digital vault with premium security features and extended capabilities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {Object.entries(pricingOptions).map(([key, option]) => (
            <Card 
              key={key} 
              className={`cursor-pointer border ${activeTab === key ? 'border-[#6B00D7]' : 'border-gray-700'} hover:border-[#6B00D7] transition-all`}
              onClick={() => setActiveTab(key as 'standard' | 'premium' | 'elite')}
            >
              <CardHeader>
                <CardTitle className={activeTab === key ? 'text-[#FF5AF7]' : ''}>{option.name}</CardTitle>
                <CardDescription>
                  <span className="text-2xl font-bold">${(option.price / 100).toFixed(2)}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {option.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-[#FF5AF7] text-xs">✓</span>
                      </div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-[#6B00D7]/30 bg-gray-900/60">
          <CardHeader>
            <CardTitle>Complete Your {selectedPlan.name} Plan Purchase</CardTitle>
            <CardDescription>Secure payment processed by Stripe</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Order Summary</h3>
                <Separator className="my-3" />
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-gray-300">{selectedPlan.name} Plan</span>
                    {vaultId && <p className="text-sm text-gray-400">Vault ID: {vaultId}</p>}
                  </div>
                  <span className="font-semibold">${(selectedPlan.price / 100).toFixed(2)}</span>
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${(selectedPlan.price / 100).toFixed(2)}</span>
                </div>
              </div>
              
              <Elements stripe={stripePromise}>
                <CheckoutForm 
                  amount={selectedPlan.price} 
                  vaultId={vaultId} 
                  description={`${selectedPlan.name} Plan for Chronos Vault`}
                />
              </Elements>
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm text-gray-400">
            <p>Your data is secured with end-to-end encryption</p>
            <p>Need help? Contact our support team at support@chronosvault.io</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PremiumPaymentPage;