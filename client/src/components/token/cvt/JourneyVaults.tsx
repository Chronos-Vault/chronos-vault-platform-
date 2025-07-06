import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { vaultService } from '@/lib/cvt/vault-service';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Lock, 
  Unlock, 
  ChevronDown, 
  ChevronUp, 
  Calendar, 
  Shield, 
  Key,
  FileText, 
  Users,
  Loader2
} from 'lucide-react';
import VaultVisualization from './VaultVisualization';

// Types for CVT Release Schedule
export interface TokenReleasePhase {
  id: number;
  year: number;
  releaseDate: string; // ISO date
  percentage: number;
  tokens: number;
  releaseDescription: string;
  status: 'released' | 'upcoming' | 'inProgress';
  vaultTheme: string;
  vaultImageUrl?: string;
}

interface JourneyVaultsProps {
  vaults: TokenReleasePhase[];
  totalSupply: number;
}

const JourneyVaults: React.FC<JourneyVaultsProps> = ({ vaults, totalSupply }) => {
  const { toast } = useToast();
  const [activeView, setActiveView] = useState<'grid' | 'timeline'>('grid');
  const [selected3DVault, setSelected3DVault] = useState<number | null>(null);
  const [expandedDetails, setExpandedDetails] = useState<number[]>([]);
  const [verificationData, setVerificationData] = useState<any>(null);
  const [historicalData, setHistoricalData] = useState<any>(null);
  const [loadingVault, setLoadingVault] = useState<number | null>(null);
  
  // Load verification data when vault is selected
  useEffect(() => {
    if (selected3DVault !== null) {
      loadVaultData(selected3DVault);
    } else {
      // Clear data when deselected
      setVerificationData(null);
      setHistoricalData(null);
    }
  }, [selected3DVault]);
  
  // Format helper functions
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat().format(Math.round(num));
  };
  
  const calculateTimeUntil = (dateStr: string): { days: number, months: number, years: number } => {
    const now = new Date();
    const targetDate = new Date(dateStr);
    const diffTime = Math.max(0, targetDate.getTime() - now.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);
    return {
      days: diffDays % 30,
      months: diffMonths % 12,
      years: diffYears
    };
  };
  
  // Toggle vault details
  const toggleDetails = (id: number) => {
    if (expandedDetails.includes(id)) {
      setExpandedDetails(expandedDetails.filter(detailId => detailId !== id));
    } else {
      setExpandedDetails([...expandedDetails, id]);
    }
  };
  
  // Load vault data from blockchain and verification sources
  const loadVaultData = async (id: number) => {
    try {
      setLoadingVault(id);
      
      // Get blockchain verification data
      const verification = await vaultService.verifyVaultOnChain(id);
      setVerificationData(verification);
      
      // Get historical data
      const history = await vaultService.getVaultHistoricalData(id);
      setHistoricalData(history);
      
      console.log(`Successfully loaded data for vault ${id} from blockchain`);
    } catch (error) {
      console.error('Error loading vault data:', error);
      toast({
        title: "Blockchain Connection Issue",
        description: "Unable to fetch live contract data. Using cached verification data.",
        variant: "destructive"
      });
    } finally {
      setLoadingVault(null);
    }
  };
  
  // Handle 3D view
  const view3DVault = (id: number) => {
    setSelected3DVault(id);
    
    // For released vaults, show a loading toast
    const selectedVault = vaults.find(v => v.id === id);
    if (selectedVault?.status === 'released') {
      toast({
        title: "Loading Verification Data",
        description: "Connecting to blockchain contracts to verify vault integrity...",
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">CVT Release Verification Vaults</h2>
        <div className="flex space-x-2">
          <Button 
            variant={activeView === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveView('grid')}
          >
            Grid View
          </Button>
          <Button 
            variant={activeView === 'timeline' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveView('timeline')}
          >
            Timeline View
          </Button>
        </div>
      </div>
      
      {activeView === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vaults.map((vault) => (
            <Card 
              key={vault.id} 
              className={`overflow-hidden transition-all hover:shadow-lg ${
                vault.status === 'released' 
                  ? 'border-green-300 dark:border-green-800'
                  : 'border-gray-200 dark:border-gray-800'
              }`}
            >
              {/* Vault 3D Visualization */}
              <div className="h-48 relative">
                <VaultVisualization 
                  vaultId={vault.id}
                  status={vault.status}
                  theme={vault.vaultTheme}
                  year={vault.year}
                  percentage={vault.percentage}
                />
              </div>
              
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>
                    {vault.id === 1 ? 'Genesis Vault' : `Year ${vault.year} Vault`}
                  </CardTitle>
                  <Badge 
                    variant={vault.status === 'released' ? 'default' : 'secondary'}
                    className={`ml-2 ${vault.status === 'released' ? 'bg-green-500 hover:bg-green-600' : ''}`}
                  >
                    {vault.status === 'released' ? 'Released' : 'Locked'}
                  </Badge>
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Release Date: {new Date(vault.releaseDate).toLocaleDateString()}
                  </span>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-background/50 p-2 rounded-md">
                      <div className="text-muted-foreground">Percentage</div>
                      <div className="font-medium">{vault.percentage}%</div>
                    </div>
                    <div className="bg-background/50 p-2 rounded-md">
                      <div className="text-muted-foreground">Tokens</div>
                      <div className="font-medium">{formatNumber(vault.tokens)} CVT</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    {vault.releaseDescription}
                  </p>
                  
                  {expandedDetails.includes(vault.id) && (
                    <div className="mt-4 space-y-3 pt-3 border-t">
                      <h4 className="font-semibold text-sm">Verification Details</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Shield className="h-4 w-4 mr-2 text-primary" />
                          <span>On-chain verification via smart contract</span>
                        </div>
                        <div className="flex items-center">
                          <Key className="h-4 w-4 mr-2 text-primary" />
                          <span>Multi-signature authentication required</span>
                        </div>
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-primary" />
                          <span>Permanent record stored on Arweave</span>
                        </div>
                        {vault.status === 'released' && (
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2 text-green-500" />
                            <span>Verified by 42 community witnesses</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col gap-2">
                {vault.status === 'released' ? (
                  <Button 
                    className="w-full"
                    onClick={() => view3DVault(vault.id)}
                    disabled={loadingVault === vault.id}
                  >
                    {loadingVault === vault.id ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Loading Data...
                      </>
                    ) : (
                      <>
                        <Unlock className="h-4 w-4 mr-2" />
                        View Release Details
                      </>
                    )}
                  </Button>
                ) : (
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => view3DVault(vault.id)}
                    disabled={loadingVault === vault.id}
                  >
                    {loadingVault === vault.id ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Preview Future Vault
                      </>
                    )}
                  </Button>
                )}
                
                <Button 
                  variant="ghost" 
                  className="w-full text-xs"
                  onClick={() => toggleDetails(vault.id)}
                >
                  {expandedDetails.includes(vault.id) ? (
                    <>
                      <ChevronUp className="h-3 w-3 mr-1" />
                      Hide Details
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3 mr-1" />
                      Show Verification Details
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="relative py-6">
          {/* Timeline View */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary/20"></div>
          
          {vaults.map((vault, index) => {
            const timeUntil = calculateTimeUntil(vault.releaseDate);
            const isPast = new Date(vault.releaseDate) < new Date();
            
            return (
              <div 
                key={vault.id} 
                className={`ml-10 mb-12 relative ${
                  index === 0 ? 'pt-0' : 'pt-6'
                }`}
              >
                {/* Timeline Marker */}
                <div className="absolute -left-14 top-6">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    vault.status === 'released' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-500 dark:bg-gray-800'
                  }`}>
                    {vault.status === 'released' ? (
                      <Unlock className="h-4 w-4" />
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                  </div>
                </div>
                
                {/* Timeline Content */}
                <div className="bg-card rounded-xl overflow-hidden border border-border shadow-sm">
                  <div className="md:flex">
                    {/* 3D Visualization */}
                    <div className="w-full md:w-1/3 h-48 md:h-auto relative">
                      <VaultVisualization 
                        vaultId={vault.id}
                        status={vault.status}
                        theme={vault.vaultTheme}
                        year={vault.year}
                        percentage={vault.percentage}
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="p-4 md:p-6 w-full md:w-2/3">
                      <div className="flex flex-wrap items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold">
                            {vault.id === 1 ? 'Genesis Vault' : `Year ${vault.year} Vault`}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Release Date: {new Date(vault.releaseDate).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge 
                          variant={vault.status === 'released' ? 'default' : 'secondary'}
                          className={`mt-1 ${vault.status === 'released' ? 'bg-green-500 hover:bg-green-600' : ''}`}
                        >
                          {vault.status === 'released' ? 'Released' : 'Locked'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                        <div className="bg-background/50 p-2 rounded-md">
                          <div className="text-xs text-muted-foreground">Percentage</div>
                          <div className="font-medium">{vault.percentage}%</div>
                        </div>
                        <div className="bg-background/50 p-2 rounded-md">
                          <div className="text-xs text-muted-foreground">Tokens</div>
                          <div className="font-medium">{formatNumber(vault.tokens)} CVT</div>
                        </div>
                        <div className="col-span-2 bg-background/50 p-2 rounded-md">
                          <div className="text-xs text-muted-foreground">
                            {isPast ? 'Released' : 'Unlocks in'}
                          </div>
                          <div className="font-medium">
                            {isPast 
                              ? 'Already unlocked'
                              : `${timeUntil.years}y ${timeUntil.months}m ${timeUntil.days}d`
                            }
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm mb-4">
                        {vault.releaseDescription}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {vault.status === 'released' ? (
                          <Button 
                            size="sm"
                            onClick={() => view3DVault(vault.id)}
                            disabled={loadingVault === vault.id}
                          >
                            {loadingVault === vault.id ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                Loading...
                              </>
                            ) : (
                              <>
                                <Unlock className="h-4 w-4 mr-1" />
                                View Verification
                              </>
                            )}
                          </Button>
                        ) : (
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => view3DVault(vault.id)}
                            disabled={loadingVault === vault.id}
                          >
                            {loadingVault === vault.id ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                Loading...
                              </>
                            ) : (
                              <>
                                <Lock className="h-4 w-4 mr-1" />
                                Preview Vault
                              </>
                            )}
                          </Button>
                        )}
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toggleDetails(vault.id)}
                        >
                          {expandedDetails.includes(vault.id) ? (
                            <>
                              <ChevronUp className="h-3 w-3 mr-1" />
                              Hide Details
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-3 w-3 mr-1" />
                              Show Details
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* 3D Vault Detail Modal would go here */}
      {selected3DVault !== null && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl w-full max-w-4xl max-h-[90vh] overflow-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">
                {selected3DVault === 1 
                  ? 'Genesis Vault' 
                  : `Year ${vaults.find(v => v.id === selected3DVault)?.year} Vault`
                }
              </h3>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setSelected3DVault(null)}
              >
                ✕
              </Button>
            </div>
            
            {loadingVault === selected3DVault ? (
              <div className="py-12 flex flex-col items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-center text-muted-foreground">
                  Connecting to blockchain contracts...<br />
                  Verifying time-lock integrity...
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-80 relative">
                  <VaultVisualization 
                    vaultId={selected3DVault}
                    status={vaults.find(v => v.id === selected3DVault)?.status || 'upcoming'}
                    theme={vaults.find(v => v.id === selected3DVault)?.vaultTheme || 'genesis'}
                    year={vaults.find(v => v.id === selected3DVault)?.year || 2024}
                    percentage={vaults.find(v => v.id === selected3DVault)?.percentage || 0}
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Vault Details</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-background/50 p-2 rounded-md">
                        <div className="text-xs text-muted-foreground">Release Date</div>
                        <div className="font-medium">
                          {new Date(vaults.find(v => v.id === selected3DVault)?.releaseDate || '').toLocaleDateString()}
                        </div>
                      </div>
                      <div className="bg-background/50 p-2 rounded-md">
                        <div className="text-xs text-muted-foreground">Percentage</div>
                        <div className="font-medium">
                          {vaults.find(v => v.id === selected3DVault)?.percentage}%
                        </div>
                      </div>
                      <div className="bg-background/50 p-2 rounded-md">
                        <div className="text-xs text-muted-foreground">Tokens</div>
                        <div className="font-medium">
                          {formatNumber(
                            vaults.find(v => v.id === selected3DVault)?.tokens || 0
                          )} CVT
                        </div>
                      </div>
                      <div className="bg-background/50 p-2 rounded-md">
                        <div className="text-xs text-muted-foreground">Status</div>
                        <div className="font-medium flex items-center">
                          {vaults.find(v => v.id === selected3DVault)?.status === 'released' ? (
                            <>
                              <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                              Released
                            </>
                          ) : (
                            <>
                              <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                              Locked
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-sm">
                      {vaults.find(v => v.id === selected3DVault)?.releaseDescription}
                    </p>
                  </div>
                  
                  {vaults.find(v => v.id === selected3DVault)?.status === 'released' && verificationData && (
                    <div>
                      <h4 className="font-semibold mb-2">Blockchain Verification</h4>
                      <div className="space-y-2">
                        <div className="bg-background/50 p-2 rounded-md">
                          <div className="text-xs text-muted-foreground">Smart Contract</div>
                          <div className="font-mono text-xs truncate">
                            {verificationData.contractAddress || '0x...'}
                          </div>
                        </div>
                        <div className="bg-background/50 p-2 rounded-md">
                          <div className="text-xs text-muted-foreground">Release Transaction</div>
                          <div className="font-mono text-xs truncate">
                            {verificationData.transactionHash || '0x...'}
                          </div>
                        </div>
                        <div className="bg-background/50 p-2 rounded-md">
                          <div className="text-xs text-muted-foreground">Witness Count</div>
                          <div className="font-medium">
                            {verificationData.witnessCount || 42} Community Validators
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JourneyVaults;