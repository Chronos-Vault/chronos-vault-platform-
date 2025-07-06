import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import TransactionVerificationPanel from '@/components/cross-chain/TransactionVerificationPanel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, ArrowLeft, RefreshCw, CheckCircle, Info } from 'lucide-react';

export default function TransactionVerificationPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('verify');
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);
  
  // Extract transaction ID from URL if present
  const [txId, setTxId] = useState<string>('');
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('tx');
    if (id) {
      setTxId(id);
    }
  }, []);
  
  const handleVerificationComplete = (result: boolean) => {
    setVerificationComplete(true);
    setVerificationResult(result);
    
    toast({
      title: result ? 'Verification Successful' : 'Verification Failed',
      description: result 
        ? 'The transaction has been successfully verified across blockchains.' 
        : 'The transaction could not be fully verified. Please check details.',
      variant: result ? 'default' : 'destructive',
    });
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2"
          onClick={() => setLocation('/')}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Cross-Chain Transaction Verification</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <TransactionVerificationPanel 
            transactionId={txId}
            onVerificationComplete={handleVerificationComplete}
            autoVerify={!!txId}
          />
        </div>
        
        <div className="space-y-6">
          {/* Security Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Triple-Chain Security
              </CardTitle>
              <CardDescription>
                How our cross-chain verification works to protect your assets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="tech">Technical</TabsTrigger>
                  <TabsTrigger value="faq">FAQ</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4 mt-4">
                  <p className="text-sm">
                    Our Triple-Chain Security Architecture leverages three independent blockchains
                    to create an unprecedented level of security for your digital assets.
                  </p>
                  
                  <div className="bg-muted/50 p-3 rounded-md space-y-2">
                    <h4 className="font-medium">Primary Chain (Ethereum)</h4>
                    <p className="text-xs text-muted-foreground">
                      Holds the master record of ownership and access control.
                    </p>
                  </div>
                  
                  <div className="bg-muted/50 p-3 rounded-md space-y-2">
                    <h4 className="font-medium">Validation Chain (Solana)</h4>
                    <p className="text-xs text-muted-foreground">
                      Provides high-frequency monitoring and rapid transaction validation.
                    </p>
                  </div>
                  
                  <div className="bg-muted/50 p-3 rounded-md space-y-2">
                    <h4 className="font-medium">Recovery Chain (TON)</h4>
                    <p className="text-xs text-muted-foreground">
                      Offers emergency recovery systems and secure backup of asset state.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="tech" className="space-y-4 mt-4">
                  <p className="text-sm">
                    Technical implementation of our cross-chain verification system:
                  </p>
                  
                  <ul className="text-xs space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-3.5 w-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Cross-Chain Hashing:</strong> Creating a unified hash from transaction 
                        data across multiple chains to prevent tampering.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-3.5 w-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Threshold Signatures:</strong> Requiring signatures from multiple chains
                        before important operations can be completed.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-3.5 w-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Redundant Storage:</strong> Storing critical data across 
                        multiple chains with sophisticated reconciliation mechanisms.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-3.5 w-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Quantum-Progressive Security:</strong> Adapting security levels based
                        on asset value and risk profile.
                      </span>
                    </li>
                  </ul>
                </TabsContent>
                
                <TabsContent value="faq" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">What if one blockchain fails?</h4>
                    <p className="text-xs text-muted-foreground">
                      Our system is designed to continue functioning even if one or two chains
                      experience issues, using cross-chain verification and recovery mechanisms.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">How secure is this compared to single-chain solutions?</h4>
                    <p className="text-xs text-muted-foreground">
                      Triple-Chain Security is exponentially more secure than single-chain approaches,
                      requiring an attacker to compromise three independent blockchains simultaneously.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Does this affect transaction speeds?</h4>
                    <p className="text-xs text-muted-foreground">
                      Our architecture is optimized to maintain high performance while adding
                      security. Verification happens in parallel across chains with minimal impact.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Status/Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Verification Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {verificationComplete ? (
                <div className={`p-4 rounded-md ${verificationResult ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}>
                  <h3 className={`font-medium ${verificationResult ? 'text-green-700' : 'text-red-700'}`}>
                    {verificationResult ? 'Verification Successful' : 'Verification Failed'}
                  </h3>
                  <p className={`text-sm mt-1 ${verificationResult ? 'text-green-600' : 'text-red-600'}`}>
                    {verificationResult 
                      ? 'The transaction has been successfully verified across blockchains.' 
                      : 'The transaction could not be fully verified. Please check details.'}
                  </p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">
                    No verification performed yet
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setVerificationComplete(false);
                  setVerificationResult(null);
                  setActiveTab('overview');
                }}
                disabled={!verificationComplete}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset Status
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}