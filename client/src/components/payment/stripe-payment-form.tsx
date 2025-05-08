import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck, AlertCircle, CreditCard, QrCode, Copy, Check } from 'lucide-react';

/**
 * CryptoPaymentForm Component 
 * 
 * This component replaces the Stripe payment form with a cryptocurrency payment interface.
 * Users can pay with various cryptocurrencies (ETH, SOL, TON, BTC).
 */

interface CryptoPaymentFormProps {
  amount: number;
  currency?: string;
  description?: string;
  vaultId?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CryptoPaymentForm({ 
  amount, 
  currency = 'usd', 
  description, 
  vaultId,
  onSuccess,
  onCancel
}: CryptoPaymentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCrypto, setSelectedCrypto] = useState<'ETH' | 'SOL' | 'TON' | 'BTC' | null>(null);
  const [paymentStep, setPaymentStep] = useState<'select' | 'details' | 'confirm'>('select');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Mock addresses for different cryptocurrencies
  const addresses = {
    ETH: '0x8e33114e6bdb4fc9a798e4b7d77b5366',
    SOL: 'GvV8G5RFP6Y5sMHWDgM9aL59rTzLv9r4nxLsPjcUKsXm',
    TON: 'EQAvDfYmkVV2zFXzC0Hs2e2RGWJyMXHpnMTXH4jnI2W3AwLb',
    BTC: 'bc1q8e33114e6bdb4fc9a798e4b7d77b5366',
  };

  // Convert USD to crypto amounts (mock values)
  const cryptoAmounts = {
    ETH: (amount / 100 / 3500).toFixed(6),
    SOL: (amount / 100 / 80).toFixed(4),
    TON: (amount / 100 / 5).toFixed(2),
    BTC: (amount / 100 / 60000).toFixed(8),
  };

  const handleCryptoSelect = (crypto: 'ETH' | 'SOL' | 'TON' | 'BTC') => {
    setSelectedCrypto(crypto);
    setPaymentStep('details');
  };

  const handleCopyAddress = () => {
    if (selectedCrypto) {
      navigator.clipboard.writeText(addresses[selectedCrypto]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Address Copied",
        description: "The payment address has been copied to your clipboard.",
      });
    }
  };

  const handleConfirmPayment = () => {
    setIsLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsLoading(false);
      setPaymentStep('confirm');
      
      if (onSuccess) {
        toast({
          title: "Payment Recorded",
          description: "Your payment is being processed on the blockchain.",
        });
        setTimeout(onSuccess, 2000);
      }
    }, 2000);
  };

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

  return (
    <Card className="p-6 border border-gray-800 bg-gradient-to-b from-gray-900 to-gray-950">
      {paymentStep === 'select' && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-center mb-4">Select Payment Method</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col justify-center items-center hover:bg-blue-950/30 hover:border-blue-500"
              onClick={() => handleCryptoSelect('ETH')}
            >
              <div className="h-8 w-8 rounded-full bg-blue-600/20 flex items-center justify-center mb-2">
                <span className="text-blue-500">Ξ</span>
              </div>
              <span>Ethereum</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex flex-col justify-center items-center hover:bg-purple-950/30 hover:border-purple-500"
              onClick={() => handleCryptoSelect('SOL')}
            >
              <div className="h-8 w-8 rounded-full bg-purple-600/20 flex items-center justify-center mb-2">
                <span className="text-purple-500">◎</span>
              </div>
              <span>Solana</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex flex-col justify-center items-center hover:bg-sky-950/30 hover:border-sky-500"
              onClick={() => handleCryptoSelect('TON')}
            >
              <div className="h-8 w-8 rounded-full bg-sky-600/20 flex items-center justify-center mb-2">
                <span className="text-sky-500">💎</span>
              </div>
              <span>TON</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex flex-col justify-center items-center hover:bg-orange-950/30 hover:border-orange-500"
              onClick={() => handleCryptoSelect('BTC')}
            >
              <div className="h-8 w-8 rounded-full bg-orange-600/20 flex items-center justify-center mb-2">
                <span className="text-orange-500">₿</span>
              </div>
              <span>Bitcoin</span>
            </Button>
          </div>
          
          {onCancel && (
            <Button 
              variant="ghost" 
              className="w-full mt-4"
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
        </div>
      )}
      
      {paymentStep === 'details' && selectedCrypto && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">{selectedCrypto} Payment</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setPaymentStep('select')}
            >
              Change
            </Button>
          </div>
          
          <div className="p-4 border border-gray-700 rounded-lg bg-black/20">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-400">Amount</span>
              <span className="text-sm font-medium">${(amount/100).toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Pay with {selectedCrypto}</span>
              <span className="text-sm font-medium">{cryptoAmounts[selectedCrypto]} {selectedCrypto}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <label className="text-sm text-gray-400">Send payment to this address:</label>
            <div className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg break-all text-sm font-mono relative">
              {addresses[selectedCrypto]}
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute right-1 top-1 h-6 w-6 p-0"
                onClick={handleCopyAddress}
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center p-6 border border-dashed border-gray-700 rounded-lg bg-black/20">
            <QrCode className="w-24 h-24 text-gray-500 mb-2" />
            <span className="text-xs text-gray-400">Scan to pay with {selectedCrypto}</span>
          </div>
          
          <div className="space-y-3">
            <Button 
              className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]"
              onClick={handleConfirmPayment}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  I've Sent the Payment
                </>
              )}
            </Button>
            
            {onCancel && (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      )}
      
      {paymentStep === 'confirm' && (
        <div className="flex flex-col items-center justify-center py-6">
          <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
            <Check className="h-8 w-8 text-green-500" />
          </div>
          <h3 className="text-xl font-medium text-green-500 mb-2">Payment Recorded</h3>
          <p className="text-center text-gray-400 mb-6">
            Your payment is being verified on the blockchain. This process typically takes 2-10 minutes to complete.
          </p>
          <p className="text-sm font-medium mb-4">Thank you for your purchase!</p>
        </div>
      )}
    </Card>
  );
}