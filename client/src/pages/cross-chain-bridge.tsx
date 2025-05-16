import { useEffect } from 'react';
import { useLocation } from 'wouter';

// Importing the components for the redirect notification
import { Loader2, ArrowRight } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

export default function CrossChainBridgePage() {
  const [, navigate] = useLocation();
  
  // Auto-redirect after 3 seconds
  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      navigate('/fixed-cross-chain-bridge');
    }, 3000);
    
    return () => clearTimeout(redirectTimer);
  }, [navigate]);
  
  return (
    <div className="container py-10 max-w-xl mx-auto">
      <Card className="border-purple-800/20">
        <CardHeader>
          <CardTitle className="text-2xl">Cross-Chain Bridge</CardTitle>
          <CardDescription>
            Redirecting to the enhanced bridge experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <AlertTitle>Redirecting...</AlertTitle>
            <AlertDescription>
              We've upgraded our Cross-Chain Bridge. You'll be redirected to the new version in a few seconds.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <div className="text-sm">Redirecting to enhanced bridge version</div>
            <Progress value={60} className="h-2" />
          </div>
          
          <Button 
            onClick={() => navigate('/fixed-cross-chain-bridge')}
            className="w-full"
          >
            Go to Enhanced Bridge Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}