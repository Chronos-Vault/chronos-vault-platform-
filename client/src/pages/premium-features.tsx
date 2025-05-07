import { useState } from 'react';
import { StripePaymentForm } from '@/components/payment/stripe-payment-form';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Zap, Cpu, Lock, Check } from 'lucide-react';
import { useDevMode } from '@/hooks/use-dev-mode';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';

// Define product tiers
const PRODUCTS = [
  {
    id: 'vault_basic',
    name: 'Basic Security',
    price: 24.99,
    icon: Shield,
    features: [
      'Time-locked vault protection',
      'Basic encryption',
      'Single-chain security',
      'Standard support',
      '1 vault included'
    ]
  },
  {
    id: 'vault_advanced',
    name: 'Advanced Security',
    price: 59.99,
    icon: Zap,
    features: [
      'Multi-signature security',
      'Cross-chain verification',
      'Advanced encryption',
      'Priority support',
      '5 vaults included'
    ],
    popular: true
  },
  {
    id: 'vault_enterprise',
    name: 'Enterprise Security',
    price: 199.99,
    icon: Cpu,
    features: [
      'Triple-chain security',
      'Zero-knowledge privacy',
      'Quantum-resistant encryption',
      'Dedicated support',
      'Unlimited vaults'
    ]
  }
];

export default function PremiumFeaturesPage() {
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[1]); // Default to Advanced
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const { isDevMode } = useDevMode();
  const { toast } = useToast();

  const handlePaymentSuccess = () => {
    toast({
      title: "Premium Features Activated",
      description: `Your ${selectedProduct.name} package has been activated.`,
    });
    setShowPaymentForm(false);
  };

  const handleSubmitForDevMode = () => {
    toast({
      title: "Developer Mode Active",
      description: "Premium features activated for testing.",
    });
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1500);
  };

  return (
    <div className="container max-w-7xl mx-auto py-12">
      <div className="space-y-4 text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Premium Security Features</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Enhance your vault security with our premium features. We offer multiple tiers of protection to meet your needs.
        </p>
      </div>

      {!showPaymentForm ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {PRODUCTS.map((product) => (
              <Card 
                key={product.id} 
                className={`relative overflow-hidden ${product.popular ? 'border-primary shadow-lg shadow-primary/20' : ''}`}
              >
                {product.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium">
                    MOST POPULAR
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <product.icon className="h-6 w-6 text-primary" />
                    <CardTitle>{product.name}</CardTitle>
                  </div>
                  <CardDescription>
                    <span className="text-3xl font-bold">${product.price}</span> /month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {product.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant={product.popular ? "default" : "outline"} 
                    className="w-full"
                    onClick={() => {
                      setSelectedProduct(product);
                      if (isDevMode) {
                        handleSubmitForDevMode();
                      } else {
                        setShowPaymentForm(true);
                      }
                    }}
                  >
                    Select Plan
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="text-center space-y-4 border-t pt-8">
            <h3 className="text-xl font-medium">CVT Token Staking Benefits</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Staking CVT tokens provides substantial discounts on premium features:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Vault Guardian</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-bold text-xl text-primary">75% Discount</p>
                  <p className="text-sm text-muted-foreground">Stake 1,000+ CVT</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Vault Architect</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-bold text-xl text-primary">90% Discount</p>
                  <p className="text-sm text-muted-foreground">Stake 10,000+ CVT</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Vault Sovereign</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-bold text-xl text-primary">100% Free</p>
                  <p className="text-sm text-muted-foreground">Stake 100,000+ CVT</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      ) : (
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Complete Your Purchase</h2>
            <p className="text-muted-foreground">
              You're purchasing the <strong>{selectedProduct.name}</strong> package
            </p>
          </div>
          
          <StripePaymentForm 
            amount={selectedProduct.price}
            description={`Chronos Vault ${selectedProduct.name} Subscription`}
            onSuccess={handlePaymentSuccess}
            onCancel={() => setShowPaymentForm(false)}
          />
          
          <div className="text-center mt-6">
            <Button 
              variant="ghost" 
              onClick={() => setShowPaymentForm(false)}
            >
              Back to plans
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}