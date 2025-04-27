import React from 'react';
import { Container } from '@/components/ui/container';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';
import { Link } from 'wouter';
import { ArrowLeft, Bitcoin, Shield, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAuthContext } from '@/contexts/auth-context';

export default function BitcoinHalvingVaultPage() {
  const { isAuthenticated } = useAuthContext();

  return (
    <>
      <Helmet>
        <title>Create Bitcoin Halving Vault | ChronosVault</title>
        <meta 
          name="description" 
          content="Create your customized Bitcoin halving vault to secure your assets until the next halving." 
        />
      </Helmet>
      
      <Container className="py-12 md:py-16">
        <div className="mb-6">
          <Link href="/bitcoin-halving" className="inline-flex items-center text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Bitcoin Halving
          </Link>
        </div>
        
        <PageHeader 
          heading="Create Bitcoin Halving Vault" 
          description="Set up a time-locked vault synchronized with the Bitcoin halving cycle" 
          separator
        />
        
        {!isAuthenticated ? (
          <div className="mt-10">
            <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border-orange-200 dark:border-orange-800/70 shadow-lg overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
                    <AlertTriangle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
                <CardTitle className="text-center text-orange-900 dark:text-orange-300">
                  Wallet Connection Required
                </CardTitle>
                <CardDescription className="text-center text-orange-700 dark:text-orange-400">
                  Please connect your wallet to create a Bitcoin Halving Vault
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center pb-8">
                <p className="text-orange-700 dark:text-orange-400 mb-8">
                  To create a Bitcoin Halving Vault, you need to connect your wallet first. This allows us to securely
                  associate your vault with your blockchain identity.
                </p>
                <Button 
                  variant="default" 
                  className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white"
                >
                  Connect Wallet
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="border-orange-200 dark:border-orange-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bitcoin className="h-5 w-5 text-orange-600" />
                    Bitcoin Halving Vault Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure your Bitcoin vault parameters to align with the halving cycle
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid grid-cols-3 w-full">
                      <TabsTrigger value="basic">Basic Settings</TabsTrigger>
                      <TabsTrigger value="timeline">Timeline</TabsTrigger>
                      <TabsTrigger value="security">Security</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="basic" className="mt-6 space-y-6">
                      <div>
                        <Label htmlFor="vault-name">Vault Name</Label>
                        <Input 
                          id="vault-name" 
                          placeholder="My Bitcoin Halving Vault" 
                          className="mt-1.5" 
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="initial-deposit">Initial Deposit (BTC)</Label>
                        <Input 
                          id="initial-deposit" 
                          type="number" 
                          placeholder="0.1" 
                          className="mt-1.5" 
                        />
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Minimum deposit: 0.01 BTC
                        </p>
                      </div>
                      
                      <div>
                        <Label>Vault Type</Label>
                        <RadioGroup defaultValue="personal" className="grid grid-cols-2 gap-4 mt-3">
                          <div>
                            <RadioGroupItem 
                              value="personal" 
                              id="personal" 
                              className="peer sr-only" 
                            />
                            <Label 
                              htmlFor="personal" 
                              className="flex flex-col items-center justify-between rounded-md border-2 border-orange-200 dark:border-orange-800/50 bg-transparent p-4 hover:bg-orange-100/50 dark:hover:bg-orange-900/20 hover:border-orange-300 dark:hover:border-orange-700 peer-data-[state=checked]:border-orange-600 dark:peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:bg-orange-100/70 dark:peer-data-[state=checked]:bg-orange-900/30 transition-all cursor-pointer"
                            >
                              <div className="mb-2 rounded-full p-2.5 bg-orange-100 dark:bg-orange-900/40">
                                <Bitcoin className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                              </div>
                              <span className="text-base font-medium text-center">Personal Vault</span>
                              <span className="text-xs text-center text-gray-500 dark:text-gray-400 mt-1">
                                Single owner control
                              </span>
                            </Label>
                          </div>
                          
                          <div>
                            <RadioGroupItem 
                              value="multi-sig" 
                              id="multi-sig" 
                              className="peer sr-only" 
                            />
                            <Label 
                              htmlFor="multi-sig" 
                              className="flex flex-col items-center justify-between rounded-md border-2 border-orange-200 dark:border-orange-800/50 bg-transparent p-4 hover:bg-orange-100/50 dark:hover:bg-orange-900/20 hover:border-orange-300 dark:hover:border-orange-700 peer-data-[state=checked]:border-orange-600 dark:peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:bg-orange-100/70 dark:peer-data-[state=checked]:bg-orange-900/30 transition-all cursor-pointer"
                            >
                              <div className="mb-2 rounded-full p-2.5 bg-orange-100 dark:bg-orange-900/40">
                                <Shield className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                              </div>
                              <span className="text-base font-medium text-center">Multi-Signature</span>
                              <span className="text-xs text-center text-gray-500 dark:text-gray-400 mt-1">
                                Requires 2-of-3 approval
                              </span>
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="timeline" className="mt-6 space-y-6">
                      <div>
                        <Label>Unlock Time</Label>
                        <RadioGroup defaultValue="after-halving" className="space-y-3 mt-3">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="after-halving" id="after-halving" />
                            <Label htmlFor="after-halving" className="font-normal cursor-pointer">
                              After Bitcoin Halving (April 2024 + customizable period)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="custom-date" id="custom-date" />
                            <Label htmlFor="custom-date" className="font-normal cursor-pointer">
                              Custom unlock date
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <div>
                        <Label htmlFor="lock-duration">Post-Halving Lock Period</Label>
                        <Select defaultValue="6months">
                          <SelectTrigger className="mt-1.5">
                            <SelectValue placeholder="Select lock duration" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3months">3 months after halving</SelectItem>
                            <SelectItem value="6months">6 months after halving</SelectItem>
                            <SelectItem value="1year">1 year after halving</SelectItem>
                            <SelectItem value="nexthalving">Until next halving (~4 years)</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-orange-600 dark:text-orange-400 mt-2">
                          Longer lock periods earn additional CVT token rewards!
                        </p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="security" className="mt-6 space-y-6">
                      <div>
                        <Label>Security Level</Label>
                        <RadioGroup defaultValue="enhanced" className="space-y-3 mt-3">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="basic" id="basic" />
                            <Label htmlFor="basic" className="font-normal cursor-pointer">
                              Basic (Standard security)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="enhanced" id="enhanced" />
                            <Label htmlFor="enhanced" className="font-normal cursor-pointer">
                              Enhanced (Additional verification steps)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="advanced" id="advanced" />
                            <Label htmlFor="advanced" className="font-normal cursor-pointer">
                              Advanced (Multi-factor authentication)
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="public-vault">Public Vault</Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Visible in the public vault explorer
                          </p>
                        </div>
                        <Switch id="public-vault" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="diamond-hands">Diamond Hands Challenge</Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Participate in the Bitcoin HODLer challenge
                          </p>
                        </div>
                        <Switch id="diamond-hands" defaultChecked />
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="border-t border-orange-200 dark:border-orange-800/50 pt-6 flex flex-col sm:flex-row gap-4">
                  <Button variant="outline" className="border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/20">
                    Save as Draft
                  </Button>
                  <Button 
                    variant="default" 
                    className="sm:flex-1 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white"
                  >
                    Create Bitcoin Halving Vault
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div>
              <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border-orange-200 dark:border-orange-800/70 shadow-lg sticky top-24">
                <CardHeader>
                  <CardTitle className="text-orange-900 dark:text-orange-300">
                    Bitcoin Halving Vault Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-orange-600 dark:text-orange-400 text-sm font-bold">✓</span>
                    </div>
                    <p className="text-orange-700 dark:text-orange-400 text-sm">
                      <strong>Forced HODL:</strong> Remove the temptation to sell during market dips
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-orange-600 dark:text-orange-400 text-sm font-bold">✓</span>
                    </div>
                    <p className="text-orange-700 dark:text-orange-400 text-sm">
                      <strong>Halving Premium:</strong> Take advantage of potential price appreciation following halvings
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-orange-600 dark:text-orange-400 text-sm font-bold">✓</span>
                    </div>
                    <p className="text-orange-700 dark:text-orange-400 text-sm">
                      <strong>Enhanced Security:</strong> Multi-signature protection and advanced security features
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-orange-600 dark:text-orange-400 text-sm font-bold">✓</span>
                    </div>
                    <p className="text-orange-700 dark:text-orange-400 text-sm">
                      <strong>Rewards:</strong> Earn CVT tokens based on lock-up period and amount
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-orange-600 dark:text-orange-400 text-sm font-bold">✓</span>
                    </div>
                    <p className="text-orange-700 dark:text-orange-400 text-sm">
                      <strong>Diamond Hands Badge:</strong> Earn special status and benefits by completing the challenge
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-orange-200 dark:border-orange-800/50 pt-4 flex-col items-start">
                  <p className="text-xs text-orange-600 dark:text-orange-500 mb-4">
                    Lock your Bitcoin until after the next halving to maximize your potential returns based on historical price patterns.
                  </p>
                  <Link href="/bitcoin-halving" className="text-sm text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 underline">
                    Learn more about Bitcoin halving cycles
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </Container>
    </>
  );
}