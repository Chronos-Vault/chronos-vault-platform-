import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { loadStripe } from '@stripe/stripe-js';
import { 
  PaymentElement, 
  Elements, 
  useStripe, 
  useElements 
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Check for Stripe key
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}

// Load Stripe outside component to avoid recreating on render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface CheckoutFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CheckoutForm = ({ onSuccess, onCancel }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + '/payment-success',
        },
        redirect: 'if_required',
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Payment Successful",
          description: "Thank you for your purchase!",
        });
        onSuccess?.();
      }
    } catch (err: any) {
      toast({
        title: "Payment Error",
        description: err.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      <div className="flex space-x-4">
        <Button 
          type="submit" 
          disabled={!stripe || isLoading} 
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing
            </>
          ) : (
            'Pay Now'
          )}
        </Button>
        
        {onCancel && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isLoading}
            className="w-full"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

interface StripePaymentFormProps {
  amount: number;
  currency?: string;
  description?: string;
  vaultId?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function StripePaymentForm({ 
  amount, 
  currency = 'usd', 
  description, 
  vaultId,
  onSuccess,
  onCancel
}: StripePaymentFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [originalAmount, setOriginalAmount] = useState<number>(amount);
  const [discountedAmount, setDiscountedAmount] = useState<number>(amount);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await apiRequest('POST', '/api/payments/create-payment-intent', {
          amount,
          currency,
          description: description || `Payment for premium vault services`,
          vaultId
        });
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        setClientSecret(data.clientSecret);
        
        if (data.originalAmount && data.amount) {
          setOriginalAmount(data.originalAmount);
          setDiscountedAmount(data.amount);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to initialize payment');
        toast({
          title: "Payment Setup Failed",
          description: err.message || "There was a problem setting up the payment method",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentIntent();
  }, [amount, currency, description, vaultId, toast]);

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-destructive">Payment Error</CardTitle>
          <CardDescription>
            Unable to initialize payment process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">{error}</p>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline" onClick={onCancel}>
            Go Back
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (!clientSecret) {
    return null;
  }

  const hasDiscount = originalAmount > discountedAmount;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Secure Payment</CardTitle>
        <CardDescription>
          Complete your payment for premium vault services
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-muted-foreground">Service fee:</span>
            <span className={hasDiscount ? "line-through text-muted-foreground" : ""}>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currency.toUpperCase(),
              }).format(originalAmount)}
            </span>
          </div>
          
          {hasDiscount && (
            <div className="flex justify-between items-center mb-2">
              <span className="text-green-500 font-medium">CVT Staking Discount:</span>
              <span className="text-green-500 font-medium">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: currency.toUpperCase(),
                }).format(originalAmount - discountedAmount)}
              </span>
            </div>
          )}
          
          <div className="flex justify-between items-center border-t pt-2 font-medium">
            <span>Total:</span>
            <span>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currency.toUpperCase(),
              }).format(discountedAmount)}
            </span>
          </div>
        </div>
        
        <Elements 
          stripe={stripePromise} 
          options={{ 
            clientSecret,
            appearance: {
              theme: 'night',
              variables: {
                colorPrimary: '#6B00D7',
                colorBackground: '#1a1a1a',
                colorText: '#ffffff',
                colorDanger: '#ef4444',
                fontFamily: 'Inter, system-ui, sans-serif',
                spacingUnit: '4px',
                borderRadius: '8px',
              },
            },
          }}
        >
          <CheckoutForm onSuccess={onSuccess} onCancel={onCancel} />
        </Elements>
      </CardContent>
    </Card>
  );
}