import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, User, Clock, ChevronRight, AlertTriangle, Shield, LockKeyhole } from "lucide-react";
import { formatDate, truncateAddress } from "@/lib/utils";
import TimeLockProgress from "@/components/vault/time-lock-progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ProofVerificationCard, ProofVerificationSummary } from "@/components/Proof-of-Reservation";

const VaultDetails = () => {
  const [location, params] = useLocation();
  const { toast } = useToast();
  const vaultId = parseInt(params.id as string);
  const [tab, setTab] = useState("overview");

  const { data: vaultData, isLoading, error } = useQuery({
    queryKey: [`/api/vaults/${vaultId}`],
  });

  if (isLoading) {
    return (
      <section className="py-16 min-h-screen">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost" 
            className="mb-8 text-gray-400 hover:text-white"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-6 w-full max-w-lg mb-8" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <Skeleton className="h-8 w-40 mb-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-28 w-full mb-4" />
                  <Skeleton className="h-40 w-full" />
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="mb-8">
                <CardHeader>
                  <Skeleton className="h-6 w-32 mb-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-6 w-full mb-3" />
                  <Skeleton className="h-6 w-full mb-3" />
                  <Skeleton className="h-6 w-full mb-3" />
                  <Skeleton className="h-6 w-full" />
                </CardContent>
              </Card>
              
              <Skeleton className="h-40 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !vaultData) {
    return (
      <section className="py-16 min-h-screen">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost" 
            className="mb-8 text-gray-400 hover:text-white"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <Card className="bg-red-500/10 border-red-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Error Loading Vault
              </CardTitle>
              <CardDescription>
                We encountered an issue while loading your vault details. Please try again.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  const handleWithdrawAssets = async () => {
    try {
      await apiRequest("PUT", `/api/vaults/${vaultId}`, { isLocked: false });
      toast({
        title: "Assets Withdrawn",
        description: "Your assets have been successfully withdrawn from the vault.",
      });
      window.location.reload();
    } catch (error) {
      toast({
        title: "Withdrawal Failed",
        description: "There was an error processing your withdrawal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getVaultIcon = (type: string) => {
    switch (type) {
      case "legacy":
        return <i className="ri-user-heart-line text-[#6B00D7] text-xl mr-2"></i>;
      case "investment":
        return <i className="ri-line-chart-line text-[#FF5AF7] text-xl mr-2"></i>;
      case "project":
        return <i className="ri-team-line text-white text-xl mr-2"></i>;
      default:
        return <i className="ri-shield-keyhole-line text-[#6B00D7] text-xl mr-2"></i>;
    }
  };

  return (
    <section className="py-16 min-h-screen">
      <div className="container mx-auto px-4">
        <Button
          variant="ghost" 
          className="mb-8 text-gray-400 hover:text-white"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <div className="flex items-center gap-2">
              {getVaultIcon(vaultData.vaultType)}
              <h1 className="font-poppins font-bold text-3xl">{vaultData.name}</h1>
              <Badge variant={vaultData.isLocked ? "default" : "secondary"} className="ml-3">
                {vaultData.isLocked ? "Locked" : "Unlocked"}
              </Badge>
            </div>
            <p className="text-gray-400 mt-2">{vaultData.description}</p>
          </div>
          
          {!vaultData.isLocked && (
            <div className="mt-4 md:mt-0">
              <Button
                className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white"
                onClick={handleWithdrawAssets}
              >
                <i className="ri-wallet-3-line mr-2"></i>
                Withdraw Assets
              </Button>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card className="bg-[#1E1E1E] border border-[#333333]">
              <CardHeader className="pb-2">
                <Tabs defaultValue="overview" onValueChange={setTab}>
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    {vaultData.beneficiaries && vaultData.beneficiaries.length > 0 && (
                      <TabsTrigger value="beneficiaries">Beneficiaries</TabsTrigger>
                    )}
                    <TabsTrigger value="security">Security</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              
              <CardContent>
                <TabsContent value="overview" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-poppins font-semibold mb-4">Vault Information</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm text-gray-400">Vault Type</div>
                          <div className="font-medium capitalize flex items-center mt-1">
                            {getVaultIcon(vaultData.vaultType)}
                            {vaultData.vaultType} Vault
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-gray-400">Created On</div>
                          <div className="font-medium flex items-center gap-2 mt-1">
                            <Clock className="h-4 w-4 text-[#6B00D7]" />
                            {formatDate(vaultData.createdAt)}
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-gray-400">Unlock Date</div>
                          <div className="font-medium flex items-center gap-2 mt-1">
                            <LockKeyhole className="h-4 w-4 text-[#FF5AF7]" />
                            {formatDate(vaultData.unlockDate)}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-poppins font-semibold mb-4">Asset Information</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm text-gray-400">Asset Type</div>
                          <div className="font-medium mt-1">{vaultData.assetType}</div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-gray-400">Asset Amount</div>
                          <div className="font-medium text-xl mt-1">{vaultData.assetAmount} {vaultData.assetType}</div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-gray-400">Status</div>
                          <div className="font-medium mt-1">
                            {vaultData.isLocked ? (
                              <span className="text-[#6B00D7]">Time-Locked</span>
                            ) : (
                              <span className="text-[#FF5AF7]">Available for Withdrawal</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="details" className="space-y-6 mt-4">
                  <div>
                    <h3 className="text-lg font-poppins font-semibold mb-4">Time Lock Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Lock Period</div>
                        <div className="font-medium">{vaultData.timeLockPeriod} days</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Early Withdrawal</div>
                        <div className="font-medium text-red-400">Not Available</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Start Date</div>
                        <div className="font-medium">{formatDate(vaultData.createdAt)}</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Unlock Date</div>
                        <div className="font-medium">{formatDate(vaultData.unlockDate)}</div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-poppins font-semibold mb-4">Transaction History</h3>
                    
                    <div className="bg-[#121212] rounded-lg p-4 border border-[#333333]">
                      <div className="flex items-center justify-center h-24 text-gray-400 text-sm">
                        <div className="text-center">
                          <i className="ri-history-line text-2xl mb-2 block"></i>
                          <span>No transaction history available yet</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="beneficiaries" className="space-y-4 mt-4">
                  {vaultData.beneficiaries && vaultData.beneficiaries.length > 0 ? (
                    <>
                      <h3 className="text-lg font-poppins font-semibold mb-4">Beneficiary Information</h3>
                      
                      <div className="space-y-4">
                        {vaultData.beneficiaries.map((beneficiary: any) => (
                          <div key={beneficiary.id} className="bg-[#121212] rounded-lg p-4 border border-[#333333]">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center">
                                  <User className="h-5 w-5 mr-2 text-[#6B00D7]" />
                                  <div className="font-medium">{beneficiary.name}</div>
                                </div>
                                <div className="text-sm text-gray-400 mt-1">
                                  {truncateAddress(beneficiary.walletAddress)}
                                </div>
                              </div>
                              <Badge>{beneficiary.share}%</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="py-8 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#6B00D7]/10 mb-4">
                        <User className="h-8 w-8 text-[#6B00D7]" />
                      </div>
                      <h3 className="text-lg font-poppins font-medium mb-2">No Beneficiaries Added</h3>
                      <p className="text-gray-400 text-sm max-w-md mx-auto">
                        You haven't added any beneficiaries to this vault yet. Beneficiaries can access vault assets after unlocking conditions are met.
                      </p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="security" className="space-y-6 mt-4">
                  <div className="grid grid-cols-1 gap-6">
                    {/* Proof of Reservation - Main Verification Card */}
                    <div>
                      <h3 className="text-lg font-poppins font-semibold mb-4">Proof of Reservation</h3>
                      <ProofVerificationCard vaultId={vaultId} />
                    </div>
                    
                    {/* Security Information */}
                    <div>
                      <h3 className="text-lg font-poppins font-semibold mb-4">Security Information</h3>
                      
                      <div className="space-y-4">
                        <div className="bg-[#121212] rounded-lg p-4 border border-[#333333] flex items-start">
                          <div className="mr-3 p-2 bg-[#6B00D7]/10 rounded-full">
                            <Shield className="h-5 w-5 text-[#6B00D7]" />
                          </div>
                          <div>
                            <div className="font-medium">Smart Contract Security</div>
                            <p className="text-sm text-gray-400 mt-1">
                              Your assets are secured by audited smart contracts on the blockchain, ensuring 
                              that only you can access them after the time lock expires.
                            </p>
                          </div>
                        </div>
                        
                        <div className="bg-[#121212] rounded-lg p-4 border border-[#333333] flex items-start">
                          <div className="mr-3 p-2 bg-[#FF5AF7]/10 rounded-full">
                            <LockKeyhole className="h-5 w-5 text-[#FF5AF7]" />
                          </div>
                          <div>
                            <div className="font-medium">Time Lock Protection</div>
                            <p className="text-sm text-gray-400 mt-1">
                              The time lock mechanism is enforced at the protocol level, making it 
                              impossible to access the assets before the specified unlock date.
                            </p>
                          </div>
                        </div>
                        
                        <div className="bg-[#121212] rounded-lg p-4 border border-[#333333] flex items-start">
                          <div className="mr-3 p-2 bg-[#6B00D7]/10 rounded-full">
                            <i className="ri-eye-line text-[#6B00D7] text-lg"></i>
                          </div>
                          <div>
                            <div className="font-medium">Transparent & Verifiable</div>
                            <p className="text-sm text-gray-400 mt-1">
                              All vault parameters and conditions are publicly verifiable on the blockchain, 
                              ensuring complete transparency and trustless operation.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="bg-[#1E1E1E] border border-[#333333] mb-8">
              <CardHeader>
                <CardTitle className="text-lg">Security Dashboard</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Time Lock Status</h4>
                  <TimeLockProgress 
                    createdAt={vaultData.createdAt}
                    unlockDate={vaultData.unlockDate}
                    isLocked={vaultData.isLocked}
                  />
                </div>
                
                {/* Integrate the Security Dashboard */}
                <ProofSecurityDashboard
                  vaultId={vaultId}
                  createdAt={vaultData.createdAt}
                  unlockDate={vaultData.unlockDate}
                  isLocked={vaultData.isLocked}
                />
              </CardContent>
              {vaultData.isLocked && (
                <CardFooter className="pt-0">
                  <p className="text-xs text-gray-400">
                    This vault is time-locked and the assets cannot be withdrawn until the unlock date.
                  </p>
                </CardFooter>
              )}
            </Card>
            
            <Card className="bg-gradient-to-br from-[#6B00D7]/10 to-[#FF5AF7]/10 border border-[#333333]">
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Link href="/about">
                    <Button variant="outline" className="w-full justify-between border-[#6B00D7]/30 hover:border-[#6B00D7] hover:bg-[#6B00D7]/5 transition-all">
                      <div className="flex items-center">
                        <i className="ri-question-line mr-2 text-[#6B00D7]"></i>
                        Learn about Vaults
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  
                  <Button variant="outline" className="w-full justify-between border-[#FF5AF7]/30 hover:border-[#FF5AF7] hover:bg-[#FF5AF7]/5 transition-all">
                    <div className="flex items-center">
                      <i className="ri-customer-service-2-line mr-2 text-[#FF5AF7]"></i>
                      Contact Support
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VaultDetails;
