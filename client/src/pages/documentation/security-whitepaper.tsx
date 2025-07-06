import React from 'react';
import DocumentationLayout from "@/components/layout/DocumentationLayout";
import { 
  Shield, 
  Lock, 
  Key, 
  FileText, 
  BarChart, 
  RefreshCcw, 
  Network, 
  CheckCircle,
  Users,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

const SecurityWhitepaperDocumentation = () => {
  return (
    <DocumentationLayout>
      <div className="container mx-auto py-10 px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
              Chronos Vault Security Whitepaper
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              A comprehensive overview of our industry-leading multi-chain security architecture
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
            <Button className="flex items-center gap-2">
              <FileText size={18} />
              Download PDF
            </Button>
            <Link href="/documentation/quantum-resistant-vault">
              <Button variant="outline" className="flex items-center gap-2">
                <Lock size={18} />
                Quantum Resistant Vault
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200 dark:border-purple-800">
            <CardHeader>
              <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-2" />
              <CardTitle>Triple Chain Architecture</CardTitle>
              <CardDescription>
                Our patented security system operating across Ethereum, TON, and Solana
              </CardDescription>
            </CardHeader>
            <CardContent>
              Security fragments distributed across three independent blockchains create an unprecedented level of protection against single-point failures.
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <Lock className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-2" />
              <CardTitle>Quantum-Resistant Encryption</CardTitle>
              <CardDescription>
                Future-proof cryptographic protocols resistant to quantum computing attacks
              </CardDescription>
            </CardHeader>
            <CardContent>
              Our implementation of lattice-based cryptography ensures vault security even against theoretical quantum computing threats.
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-950/20 dark:to-teal-950/20 border-cyan-200 dark:border-cyan-800">
            <CardHeader>
              <Key className="h-8 w-8 text-cyan-600 dark:text-cyan-400 mb-2" />
              <CardTitle>Zero-Knowledge Proof System</CardTitle>
              <CardDescription>
                Privacy-preserving verification with zero data exposure
              </CardDescription>
            </CardHeader>
            <CardContent>
              Our ZK system allows for verification without revealing sensitive information, ensuring complete privacy while maintaining security.
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="mb-10">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="implementation">Implementation</TabsTrigger>
            <TabsTrigger value="audits">Security Audits</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Security Overview
                </CardTitle>
                <CardDescription>
                  The foundational security principles behind Chronos Vault
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Core Security Principles</h3>
                  <p>
                    Chronos Vault is built on the principles of decentralization, mathematical security, and defense in depth. 
                    Our multi-chain security architecture distributes risk across multiple blockchain networks while maintaining 
                    a seamless user experience.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full mt-1">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Defense in Depth</h4>
                        <p className="text-sm text-muted-foreground">Multiple layers of security that must all be compromised for an attack to succeed</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full mt-1">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Cross-Chain Verification</h4>
                        <p className="text-sm text-muted-foreground">Transactions verified by independent validators across multiple blockchains</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full mt-1">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Post-Quantum Security</h4>
                        <p className="text-sm text-muted-foreground">Cryptographic algorithms resistant to attacks from quantum computers</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full mt-1">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Privacy-Preserving Proofs</h4>
                        <p className="text-sm text-muted-foreground">Zero-knowledge protocols that verify without revealing sensitive data</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Security Commitment</h3>
                  <p>
                    Our commitment to security goes beyond technology. We maintain a rigorous security testing program
                    including regular third-party audits, bug bounties, and security assessments by leading blockchain
                    security firms.
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Badge variant="outline" className="bg-primary/5 text-primary">Regular Security Audits</Badge>
                    <Badge variant="outline" className="bg-primary/5 text-primary">Bug Bounty Program</Badge>
                    <Badge variant="outline" className="bg-primary/5 text-primary">Open Source Verification</Badge>
                    <Badge variant="outline" className="bg-primary/5 text-primary">Formal Verification</Badge>
                    <Badge variant="outline" className="bg-primary/5 text-primary">Penetration Testing</Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline" asChild>
                  <Link href="/documentation/cross-chain-fragment-vault">
                    <div className="flex items-center gap-2">
                      <Network size={16} />
                      Cross-Chain Fragment Vault
                    </div>
                  </Link>
                </Button>
                
                <Button asChild>
                  <Link href="/documentation/sovereign-fortress-vault">
                    <div className="flex items-center gap-2">
                      Sovereign Fortress Vault
                      <Shield size={16} />
                    </div>
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="architecture">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5 text-primary" />
                  Security Architecture
                </CardTitle>
                <CardDescription>
                  Technical details of our multi-chain security implementation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Triple Chain Protection</h3>
                  <p>
                    Our security architecture distributes cryptographic fragments across Ethereum, TON, and Solana 
                    blockchains, requiring consensus from all three networks for critical operations. This ensures 
                    that a compromise of any single blockchain cannot affect vault security.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <Card className="border-l-4 border-l-blue-500">
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">Ethereum Layer</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0 p-4">
                        <ul className="list-disc pl-4 space-y-1 text-sm">
                          <li>Smart contract security verification</li>
                          <li>EVM execution environment</li>
                          <li>Long-term data storage</li>
                          <li>Access control matrix</li>
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
                          <li>Quantum-resistant verification</li>
                          <li>Time-based logic execution</li>
                          <li>Multi-signature operations</li>
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
                          <li>Parallel processing capabilities</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Security by Consensus</h3>
                  <p>
                    Critical operations require cryptographic consensus across all blockchain networks, creating
                    a security threshold that is mathematically impossible to breach without compromising multiple
                    independent blockchain networks simultaneously.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="implementation">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-primary" />
                  Technical Implementation
                </CardTitle>
                <CardDescription>
                  How our security systems work in practice
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Zero-Knowledge Implementation</h3>
                  <p>
                    Our zero-knowledge proof system utilizes the latest advancements in ZK-SNARKs and ZK-STARKs
                    to provide verifiable transactions without revealing sensitive data. This ensures complete
                    privacy while maintaining security and compliance.
                  </p>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Lattice-Based Cryptography</h3>
                  <p>
                    To achieve quantum resistance, we implement lattice-based cryptography, specifically the
                    CRYSTALS-Kyber and CRYSTALS-Dilithium algorithms recommended by NIST for post-quantum
                    cryptographic standards.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="audits">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Security Audits
                </CardTitle>
                <CardDescription>
                  Third-party verifications of our security architecture
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Audit Reports</h3>
                  <p>
                    Our smart contracts and security systems have undergone rigorous auditing by leading
                    blockchain security firms, with all findings addressed and solutions implemented.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-base flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          ChainSecurity Audit
                        </CardTitle>
                        <CardDescription>May 2024</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0 p-4">
                        <p className="text-sm mb-4">Comprehensive audit of smart contracts and cross-chain mechanics.</p>
                        <Button variant="outline" size="sm">View Report</Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-base flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          CertiK Security Assessment
                        </CardTitle>
                        <CardDescription>April 2024</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0 p-4">
                        <p className="text-sm mb-4">Formal verification of zero-knowledge implementation.</p>
                        <Button variant="outline" size="sm">View Report</Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline" asChild>
                  <Link href="/documentation/dynamic-security-vault">
                    <div className="flex items-center gap-2">
                      <RefreshCcw size={16} />
                      Dynamic Security Vault
                    </div>
                  </Link>
                </Button>
                
                <Button asChild>
                  <Link href="/documentation/quantum-resistant-vault">
                    <div className="flex items-center gap-2">
                      Quantum Resistant Vault
                      <Shield size={16} />
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

export default SecurityWhitepaperDocumentation;

function Code({ className, ...props }: React.ComponentProps<typeof Network>) {
  return <Network className={className} {...props} />;
}