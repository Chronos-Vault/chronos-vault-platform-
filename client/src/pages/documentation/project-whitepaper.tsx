import React from 'react';
import { Helmet } from 'react-helmet';
import DocumentationLayout from '@/components/layout/DocumentationLayout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Download, 
  FileText,
  Coins,
  Users,
  Lock,
  Shield,
  Globe,
  Clock,
  Zap,
  BarChart3
} from "lucide-react";
import { Link } from 'wouter';

const ProjectWhitepaperDocumentation = () => {
  return (
    <DocumentationLayout>
      <Helmet>
        <title>Chronos Vault Project Whitepaper | Revolutionary Blockchain Time Vault</title>
        <meta 
          name="description" 
          content="Explore the comprehensive whitepaper for Chronos Vault - a revolutionary multi-chain digital vault platform with advanced blockchain security technologies and time-locking mechanisms." 
        />
      </Helmet>
      
      <div className="container mx-auto py-10 px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start mb-10">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
              Chronos Vault Project Whitepaper
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              A comprehensive overview of our revolutionary multi-chain digital vault platform
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            <Button className="flex items-center gap-2">
              <Download size={18} />
              Download PDF
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
            <CardHeader>
              <Clock className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-2" />
              <CardTitle>Time-Locked Security</CardTitle>
              <CardDescription>
                Revolutionary time-based protection for digital assets
              </CardDescription>
            </CardHeader>
            <CardContent>
              Our patented time-lock technology enables unprecedented control over when assets can be accessed and transferred.
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-pink-50 to-blue-50 dark:from-pink-950/20 dark:to-blue-950/20 border-pink-200 dark:border-pink-800">
            <CardHeader>
              <Shield className="h-8 w-8 text-pink-600 dark:text-pink-400 mb-2" />
              <CardTitle>Triple-Chain Architecture</CardTitle>
              <CardDescription>
                Security across multiple blockchain networks
              </CardDescription>
            </CardHeader>
            <CardContent>
              By distributing security across Ethereum, TON, and Solana, we create unprecedented protection against single-blockchain vulnerabilities.
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <Coins className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-2" />
              <CardTitle>CVT Token Economy</CardTitle>
              <CardDescription>
                Powering the platform's governance and services
              </CardDescription>
            </CardHeader>
            <CardContent>
              The CVT token provides governance rights, fee reductions, and access to premium vault features within the ecosystem.
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="mb-10">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">Platform Overview</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="tokenomics">Tokenomics</TabsTrigger>
            <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Platform Overview
                </CardTitle>
                <CardDescription>
                  The fundamental vision and components of Chronos Vault
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">The Chronos Vault Vision</h3>
                  <p>
                    Chronos Vault represents a paradigm shift in digital asset security, combining advanced blockchain 
                    technologies with innovative time-locking mechanisms. Our platform enables users to create secure, 
                    customizable vaults for their digital assets with unprecedented control over when, how, and by whom 
                    these assets can be accessed.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-medium text-lg mb-2 flex items-center gap-2">
                        <Users size={18} className="text-primary" /> User-Centric Design
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Built for both crypto enthusiasts and newcomers, with intuitive interfaces and guided setup processes.
                      </p>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-medium text-lg mb-2 flex items-center gap-2">
                        <Lock size={18} className="text-primary" /> Revolutionary Security
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Quantum-resistant encryption combined with our triple-chain architecture prevents unauthorized access.
                      </p>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-medium text-lg mb-2 flex items-center gap-2">
                        <Zap size={18} className="text-primary" /> Flexible Vault Types
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        22 specialized vault types tailored to different use cases, from inheritance planning to investment discipline.
                      </p>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-medium text-lg mb-2 flex items-center gap-2">
                        <Globe size={18} className="text-primary" /> Cross-Chain Compatibility
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Support for assets across Ethereum, TON, Solana, and Bitcoin, with more chains planned in future releases.
                      </p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Key Differentiators</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="bg-primary/10 p-1 rounded-full mt-1">
                        <ArrowRight className="h-3 w-3 text-primary" />
                      </div>
                      <span>Time-based security that allows assets to be locked for specific durations or until predetermined dates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-primary/10 p-1 rounded-full mt-1">
                        <ArrowRight className="h-3 w-3 text-primary" />
                      </div>
                      <span>Multi-signature capability requiring approval from multiple parties for high-value transactions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-primary/10 p-1 rounded-full mt-1">
                        <ArrowRight className="h-3 w-3 text-primary" />
                      </div>
                      <span>Geo-location verification adding a physical security dimension to digital assets</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-primary/10 p-1 rounded-full mt-1">
                        <ArrowRight className="h-3 w-3 text-primary" />
                      </div>
                      <span>Cross-chain fragmentation distributing security across multiple independent blockchain networks</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="architecture">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Technical Architecture
                </CardTitle>
                <CardDescription>
                  The innovative multi-chain security system behind Chronos Vault
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Triple Chain Protection</h3>
                  <p>
                    Chronos Vault implements a revolutionary security architecture that distributes cryptographic 
                    fragments across Ethereum, TON, and Solana blockchains. This approach ensures that a compromise 
                    of any single blockchain network cannot affect the overall security of your assets.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <Card className="border-l-4 border-l-blue-500">
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">Ethereum Layer</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0 p-4">
                        <ul className="list-disc pl-4 space-y-1 text-sm">
                          <li>Primary transaction logic</li>
                          <li>Smart contract security verification</li>
                          <li>Long-term data storage</li>
                          <li>Digital asset management</li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-l-4 border-l-purple-500">
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">TON Layer</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0 p-4">
                        <ul className="list-disc pl-4 space-y-1 text-sm">
                          <li>High-speed transaction processing</li>
                          <li>Time-based logic execution</li>
                          <li>Multi-signature operations</li>
                          <li>Security authorization fragments</li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-l-4 border-l-green-500">
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">Solana Layer</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0 p-4">
                        <ul className="list-disc pl-4 space-y-1 text-sm">
                          <li>Zero-knowledge proof validation</li>
                          <li>High-throughput operations</li>
                          <li>Oracle data integration</li>
                          <li>Time verification consensus</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Advanced Security Systems</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Quantum-Resistant Encryption</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Our implementation of lattice-based cryptography ensures vault security even against 
                        theoretical quantum computing attacks, future-proofing your digital assets.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Zero-Knowledge Proof System</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Privacy-preserving verification allows for transaction approval without exposing 
                        sensitive data, ensuring complete privacy while maintaining security.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tokenomics">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-primary" />
                  CVT Token Economy
                </CardTitle>
                <CardDescription>
                  The tokenomics model driving the Chronos Vault ecosystem
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Token Utility</h3>
                  <p>
                    The Chronos Vault Token (CVT) is the native utility token powering the entire ecosystem, 
                    providing holders with governance rights, fee reductions, and access to premium features.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Platform Governance</h4>
                      <p className="text-sm text-muted-foreground">
                        CVT holders can propose and vote on changes to platform parameters, fee structures, 
                        and new feature development priorities through decentralized governance.
                      </p>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Fee Discounts</h4>
                      <p className="text-sm text-muted-foreground">
                        Users can stake CVT to receive proportional discounts on platform fees, 
                        with maximum discounts reaching up to 50% for high-tier stakers.
                      </p>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Premium Vault Access</h4>
                      <p className="text-sm text-muted-foreground">
                        Certain advanced vault types and features require CVT staking, creating 
                        tiered access levels that reward long-term token holders.
                      </p>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Ecosystem Incentives</h4>
                      <p className="text-sm text-muted-foreground">
                        Liquidity providers and early vault developers can earn CVT rewards, 
                        encouraging ecosystem growth and service diversification.
                      </p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Token Distribution</h3>
                  <div className="flex justify-center my-8">
                    <div className="w-full max-w-md">
                      <div className="bg-muted/50 p-5 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold">Public Sale</span>
                          <span className="font-bold text-primary">40%</span>
                        </div>
                        <div className="w-full bg-gray-200 h-3 rounded-full mb-4">
                          <div className="bg-primary h-3 rounded-full" style={{ width: '40%' }}></div>
                        </div>
                        
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold">Team & Advisors</span>
                          <span className="font-bold text-primary">15%</span>
                        </div>
                        <div className="w-full bg-gray-200 h-3 rounded-full mb-4">
                          <div className="bg-primary h-3 rounded-full" style={{ width: '15%' }}></div>
                        </div>
                        
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold">Platform Development</span>
                          <span className="font-bold text-primary">20%</span>
                        </div>
                        <div className="w-full bg-gray-200 h-3 rounded-full mb-4">
                          <div className="bg-primary h-3 rounded-full" style={{ width: '20%' }}></div>
                        </div>
                        
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold">Ecosystem Growth</span>
                          <span className="font-bold text-primary">15%</span>
                        </div>
                        <div className="w-full bg-gray-200 h-3 rounded-full mb-4">
                          <div className="bg-primary h-3 rounded-full" style={{ width: '15%' }}></div>
                        </div>
                        
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold">Reserve Fund</span>
                          <span className="font-bold text-primary">10%</span>
                        </div>
                        <div className="w-full bg-gray-200 h-3 rounded-full">
                          <div className="bg-primary h-3 rounded-full" style={{ width: '10%' }}></div>
                        </div>
                      </div>
                      
                      <div className="text-center mt-4">
                        <p className="text-sm text-muted-foreground">
                          Total Supply: 100,000,000 CVT
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="roadmap">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Development Roadmap
                </CardTitle>
                <CardDescription>
                  The strategic path forward for Chronos Vault
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative border-l-2 border-muted pl-6 pb-6 space-y-8">
                  <div className="relative">
                    <div className="absolute -left-[25px] top-1 h-4 w-4 rounded-full border-2 border-primary bg-background"></div>
                    <div>
                      <Badge variant="outline" className="mb-2 bg-primary/10 text-primary">Q2 2024</Badge>
                      <h3 className="text-lg font-medium">Platform Launch</h3>
                      <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                        <li>• Core vault functionality release</li>
                        <li>• Support for ETH, TON, and major ERC-20 tokens</li>
                        <li>• Multi-signature and time-lock vault capabilities</li>
                        <li>• Initial CVT token distribution</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute -left-[25px] top-1 h-4 w-4 rounded-full border-2 border-primary bg-background"></div>
                    <div>
                      <Badge variant="outline" className="mb-2 bg-primary/10 text-primary">Q3 2024</Badge>
                      <h3 className="text-lg font-medium">Feature Expansion</h3>
                      <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                        <li>• Bitcoin integration and specialized Bitcoin vaults</li>
                        <li>• Cross-chain fragment vault release</li>
                        <li>• Mobile application launch</li>
                        <li>• Advanced dashboard analytics</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute -left-[25px] top-1 h-4 w-4 rounded-full border-2 border-muted bg-background"></div>
                    <div>
                      <Badge variant="outline" className="mb-2">Q4 2024</Badge>
                      <h3 className="text-lg font-medium">Ecosystem Growth</h3>
                      <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                        <li>• Launch of developer API</li>
                        <li>• Institutional vault solutions</li>
                        <li>• Enhanced governance mechanisms</li>
                        <li>• Additional blockchain network support</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute -left-[25px] top-1 h-4 w-4 rounded-full border-2 border-muted bg-background"></div>
                    <div>
                      <Badge variant="outline" className="mb-2">Q1-Q2 2025</Badge>
                      <h3 className="text-lg font-medium">Advanced Features</h3>
                      <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                        <li>• DAO integration capabilities</li>
                        <li>• Enhanced cross-chain security protocols</li>
                        <li>• Decentralized identity integration</li>
                        <li>• Layer 2 scaling solutions</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline" asChild>
                  <Link href="/documentation/sovereign-fortress-vault">
                    <div className="flex items-center gap-2">
                      <Shield size={16} />
                      Sovereign Fortress Vault
                    </div>
                  </Link>
                </Button>
                
                <Button asChild>
                  <Link href="/documentation/security-whitepaper">
                    <div className="flex items-center gap-2">
                      Security Whitepaper
                      <ArrowRight size={16} />
                    </div>
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DocumentationLayout>
  );
};

export default ProjectWhitepaperDocumentation;