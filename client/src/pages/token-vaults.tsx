import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { PageHeader } from '@/components/page-header';
import { Helmet } from 'react-helmet';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Lock, 
  Unlock, 
  Clock, 
  ArrowRightIcon,
  CoinsIcon,
  LayoutGrid,
  ListIcon
} from 'lucide-react';
import JourneyVaults from '@/components/token/cvt/JourneyVaults';
import OlympicVault3D from '@/components/token/cvt/OlympicVault3D';
import VerificationVaults from '@/components/token/cvt/VerificationVaults';
import { vaultService } from '@/lib/cvt/vault-service';
import { olympicVaultService } from '@/lib/cvt/olympic-vault-service';
import { useToast } from '@/hooks/use-toast';

// Token Vaults Page - Showcasing the CVT token time-locked vaults
const TokenVaultsPage: React.FC = () => {
  const { toast } = useToast();
  const [tokenReleaseVaults, setTokenReleaseVaults] = useState<any[]>([]);
  const [olympicVaults, setOlympicVaults] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Load vault data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Get token release vaults
        const releaseVaults = await vaultService.getTokenReleaseVaults();
        setTokenReleaseVaults(releaseVaults);
        
        // Get Olympic vaults
        const olympicVaultsData = await olympicVaultService.getOlympicVaults();
        setOlympicVaults(olympicVaultsData);
      } catch (error) {
        console.error('Error loading vault data:', error);
        toast({
          title: 'Error Loading Vaults',
          description: 'There was a problem loading the vault data. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [toast]);
  
  return (
    <>
      <Helmet>
        <title>Token Vaults | Chronos Vault</title>
        <meta name="description" content="Explore the Chronos Vault token release schedule and time-locked vaults. View detailed information about CVT token distribution vaults." />
      </Helmet>
      
      <Container>
        <PageHeader
          heading="CVT Token Vaults"
          description="Explore the Chronos Vault token distribution timeline through our secure time-locked vaults. Each vault represents a milestone in the CVT ecosystem development."
          separator={true}
        />
        
        <Tabs defaultValue="journey" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="journey" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Release Journey</span>
            </TabsTrigger>
            <TabsTrigger value="olympic" className="flex items-center gap-2">
              <CoinsIcon className="h-4 w-4" />
              <span>Olympic Vaults</span>
            </TabsTrigger>
            <TabsTrigger value="verification" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>Verification Vaults</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="journey" className="space-y-6">
            {loading ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                      <Clock className="w-12 h-12 mb-4 animate-spin text-purple-600 mx-auto" />
                      <p className="text-lg font-medium">Loading Journey Vaults...</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>CVT Token Release Schedule</CardTitle>
                    <CardDescription>
                      Explore the time-locked vaults containing CVT tokens scheduled for release according to our tokenomics model.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      The CVT token has a fixed supply of 21 million tokens. These tokens are distributed over time through our secure time-locked vaults, ensuring a fair and transparent release schedule. Each vault contains a percentage of the total supply and unlocks at predetermined dates.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                      <div className="flex-1 bg-purple-50 dark:bg-purple-950/20 rounded-lg p-4 border border-purple-100 dark:border-purple-900">
                        <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-2">Vault Security</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          All token vaults are secured by multi-signature smart contracts with time-lock mechanisms, ensuring that tokens cannot be released before their scheduled date.
                        </p>
                      </div>
                      <div className="flex-1 bg-purple-50 dark:bg-purple-950/20 rounded-lg p-4 border border-purple-100 dark:border-purple-900">
                        <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-2">Verification Process</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Each vault release undergoes a community verification process, with all transaction details permanently stored on-chain for maximum transparency.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <JourneyVaults vaults={tokenReleaseVaults} totalSupply={21000000} />
              </>
            )}
          </TabsContent>
          
          <TabsContent value="olympic" className="space-y-6">
            {loading ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                      <Clock className="w-12 h-12 mb-4 animate-spin text-purple-600 mx-auto" />
                      <p className="text-lg font-medium">Loading Olympic Vaults...</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <OlympicVault3D olympicVaults={olympicVaults} />
            )}
          </TabsContent>
          
          <TabsContent value="verification" className="space-y-6">
            {loading ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                      <Clock className="w-12 h-12 mb-4 animate-spin text-purple-600 mx-auto" />
                      <p className="text-lg font-medium">Loading Verification Vaults...</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <VerificationVaults />
            )}
          </TabsContent>
        </Tabs>
      </Container>
    </>
  );
};

export default TokenVaultsPage;