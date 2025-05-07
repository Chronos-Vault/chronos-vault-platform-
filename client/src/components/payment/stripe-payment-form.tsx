import { useState, useEffect } from 'react';
import { useStripe, useElements, PaymentElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck, AlertCircle } from 'lucide-react';

// Make sure to call loadStripe outside of a component's render to avoid
// recreating the Stripe object on every render
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface CheckoutFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CheckoutForm = ({ onSuccess, onCancel }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-confirmation`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message || 'An unexpected error occurred');
        toast({
          title: "Payment Failed",
          description: error.message || 'An unexpected error occurred',
          variant: "destructive",
        });
      } else {
        // The payment has been processed successfully
        toast({
          title: "Payment Successful",
          description: "Thank you for your subscription!",
          variant: "default",
        });
        if (onSuccess) onSuccess();
      }
    } catch (e: any) {
      setErrorMessage(e.message || 'An unexpected error occurred');
      toast({
        title: "Payment Error",
        description: e.message || 'An unexpected error occurred',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <PaymentElement />
        
        {errorMessage && (
          <div className="flex items-center p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
            {errorMessage}
          </div>
        )}
      </div>
      
      <div className="flex flex-col gap-4">
        <Button 
          type="submit" 
          className="w-full" 
          disabled={!stripe || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <ShieldCheck className="mr-2 h-4 w-4" />
              Secure Payment
            </>
          )}
        </Button>
        
        {onCancel && (
          <Button 
            type="button" 
            variant="outline" 
            className="w-full" 
            onClick={onCancel}
            disabled={isLoading}
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function createPaymentIntent() {
      try {
        setIsLoading(true);
        setError(null);
        
        const payload = {
          amount,
          currency,
          description,
          ...(vaultId && { vaultId })
        };
        
        const response = await fetch('/api/payments/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create payment intent');
        }
        
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (e: any) {
        setError(e.message || 'An error occurred while setting up the payment');
        toast({
          title: "Payment Setup Failed",
          description: e.message || 'An error occurred while setting up the payment',
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    createPaymentIntent();
  }, [amount, currency, description, vaultId, toast]);

  if (isLoading) {
    return (
      <Card className="p-6 flex flex-col items-center justify-center min-h-[200px]">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground text-sm">Setting up payment...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 flex flex-col items-center justify-center min-h-[200px]">
        <AlertCircle className="h-10 w-10 text-destructive mb-4" />
        <p className="text-destructive font-semibold mb-2">Payment Setup Failed</p>
        <p className="text-muted-foreground text-sm text-center">{error}</p>
        {onCancel && (
          <Button onClick={onCancel} variant="outline" className="mt-4">
            Go Back
          </Button>
        )}
      </Card>
    );
  }

  if (!clientSecret) {
    return (
      <Card className="p-6 flex flex-col items-center justify-center min-h-[200px]">
        <AlertCircle className="h-10 w-10 text-amber-500 mb-4" />
        <p className="text-amber-500 font-semibold mb-2">Unable to Initialize Payment</p>
        <p className="text-muted-foreground text-sm text-center">
          The payment system is temporarily unavailable. Please try again later.
        </p>
        {onCancel && (
          <Button onClick={onCancel} variant="outline" className="mt-4">
            Go Back
          </Button>
        )}
      </Card>
    );
  }

  // Stripe Elements options
  const options = {
    clientSecret,
    appearance: {
      theme: 'night',
      variables: {
        colorPrimary: '#6B00D7',
        colorBackground: '#1A1A1A',
        colorText: '#FFFFFF',
        colorDanger: '#EF4444',
        fontFamily: 'Inter, system-ui, sans-serif',
      },
    },
  };

  return (
    <Card className="p-6 border border-gray-800 bg-gradient-to-b from-gray-900 to-gray-950">
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm onSuccess={onSuccess} onCancel={onCancel} />
      </Elements>
    </Card>
  );
}