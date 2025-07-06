import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import DocumentationLayout from "@/components/layout/DocumentationLayout";
import { 
  Lock, Shield, Users, Key, History, 
  CheckCircle2, AlertTriangle, FileText, 
  Code, Zap, HelpCircle
} from "lucide-react";

const MultiSignatureVaultDocumentation = () => {
  return (
    <DocumentationLayout>
      <div className="container mx-auto py-10 px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              Multi-Signature Vault
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              Enhanced security requiring multiple approvals for asset access
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Link href="/vault-types">View All Vault Types</Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-5 w-full mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-6 w-6 text-purple-500" />
                  What is a Multi-Signature Vault?
                </CardTitle>
                <CardDescription>
                  A comprehensive overview of multi-signature technology and its applications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 p-6 border border-purple-100 dark:from-purple-950/20 dark:to-pink-950/20 dark:border-purple-900/50">
                  <p className="text-lg mb-4">
                    Multi-Signature (Multi-Sig) vaults represent an advanced security paradigm in blockchain technology, requiring multiple cryptographic signatures from different authorized parties to execute transactions or access assets.
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-2 text-purple-700 dark:text-purple-400">Core Concept</h3>
                  <p className="mb-4">
                    Unlike traditional single-signature wallets, Multi-Sig vaults implement an M-of-N authentication scheme: from a total of N authorized key holders, at least M must provide their signatures to authorize access or transactions. This creates a robust security mechanism that mitigates single points of failure.
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-2 text-purple-700 dark:text-purple-400">Security Benefits</h3>
                  <ul className="list-disc pl-6 space-y-2 mb-4">
                    <li>Prevents unauthorized access even if one or more keys are compromised</li>
                    <li>Distributes custody across multiple parties, reducing centralized risk</li>
                    <li>Creates a consensus requirement for all actions, preventing unilateral decisions</li>
                    <li>Enables organizational governance and approval workflows</li>
                    <li>Provides protection against individual key loss through redundancy</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold mb-2 text-purple-700 dark:text-purple-400">Applications</h3>
                  <p>
                    Multi-Signature vaults are ideal for organizations, family wealth management, business partnerships, high-value assets, and any scenario where distributed approval is beneficial for security or governance purposes.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="justify-between border-t p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  Enhanced security with distributed access control
                </div>
                <Button variant="outline" asChild>
                  <Link href="/specialized-vault-creation?vault=multi-signature">Create Multi-Signature Vault</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="features">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-6 w-6 text-purple-500" />
                  Key Features of Multi-Signature Vaults
                </CardTitle>
                <CardDescription>
                  Detailed examination of advanced multi-signature capabilities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-lg border bg-card shadow p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Users className="h-8 w-8 text-purple-500" />
                      <h3 className="text-xl font-semibold">Configurable M-of-N Requirements</h3>
                    </div>
                    <p>
                      Customize your security threshold by defining exactly how many signatures (M) are required from the total authorized signatories (N). This flexibility allows balancing security and operational efficiency based on your specific needs.
                    </p>
                  </div>
                  
                  <div className="rounded-lg border bg-card shadow p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Key className="h-8 w-8 text-purple-500" />
                      <h3 className="text-xl font-semibold">Distributed Authorization</h3>
                    </div>
                    <p>
                      Divide authorization powers across multiple individuals, departments, or entities. This distributes responsibility and prevents single points of failure in your security architecture.
                    </p>
                  </div>
                  
                  <div className="rounded-lg border bg-card shadow p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Zap className="h-8 w-8 text-purple-500" />
                      <h3 className="text-xl font-semibold">Customizable Approval Thresholds</h3>
                    </div>
                    <p>
                      Set different approval requirements based on transaction types or values. For example, require more signatures for high-value transfers while maintaining fewer signatures for routine operations.
                    </p>
                  </div>
                  
                  <div className="rounded-lg border bg-card shadow p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <History className="h-8 w-8 text-purple-500" />
                      <h3 className="text-xl font-semibold">Social Recovery Options</h3>
                    </div>
                    <p>
                      Implement sophisticated recovery mechanisms through trusted contacts. This ensures access to assets can be regained even if some keys are lost, while maintaining security against unauthorized recovery attempts.
                    </p>
                  </div>
                  
                  <div className="rounded-lg border bg-card shadow p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <FileText className="h-8 w-8 text-purple-500" />
                      <h3 className="text-xl font-semibold">Hierarchical Approval Workflows</h3>
                    </div>
                    <p>
                      Create structured approval sequences that match your organization's hierarchy. Implement tiered authorization levels requiring specific approvers for sensitive operations while allowing more flexibility for routine tasks.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-purple-500" />
                  Security Architecture
                </CardTitle>
                <CardDescription>
                  Detailed examination of the multi-signature security model
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-purple-700 dark:text-purple-400">Cryptographic Foundation</h3>
                  <p className="text-muted-foreground">
                    Multi-signature security is built on robust cryptographic principles, combining threshold signatures and distributed key management to create an advanced security infrastructure.
                  </p>
                  
                  <div className="rounded-lg border p-4 bg-slate-50 dark:bg-slate-900">
                    <h4 className="font-medium mb-2 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                      Security Considerations
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start">
                        <span className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">!</span>
                        <span>Secure key storage is critical - each participant must maintain strong security practices for their individual keys</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">!</span>
                        <span>Physical separation of keys is recommended - distribute keys across different geographical locations when possible</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">!</span>
                        <span>Carefully consider the M-of-N threshold - too low reduces security, too high increases operational risk</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">!</span>
                        <span>Document recovery procedures and ensure all participants understand the security model</span>
                      </li>
                    </ul>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-purple-700 dark:text-purple-400 mt-6">Security Implementation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">On-Chain Security</h4>
                      <p className="text-sm text-muted-foreground">
                        Multi-signature transactions are validated at the blockchain protocol level, ensuring that the required threshold of signatures is cryptographically verified before any transaction is executed.
                      </p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Zero-Knowledge Proofs</h4>
                      <p className="text-sm text-muted-foreground">
                        Our implementation incorporates zero-knowledge verification to allow signature validation without exposing sensitive key material, enhancing privacy while maintaining security.
                      </p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Time-Locked Security</h4>
                      <p className="text-sm text-muted-foreground">
                        Optional time-delay parameters can be implemented, requiring a waiting period between signature collection and execution for high-value transactions.
                      </p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Audit Trail</h4>
                      <p className="text-sm text-muted-foreground">
                        Comprehensive immutable logging of all signature activities, providing complete transparency and accountability for all authorization actions.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technical">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-6 w-6 text-purple-500" />
                  Technical Specifications
                </CardTitle>
                <CardDescription>
                  Technical details and implementation aspects of multi-signature technology
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="rounded-lg border-2 border-dashed border-muted-foreground/20 p-6">
                    <h3 className="text-xl font-semibold mb-4 text-purple-700 dark:text-purple-400">Implementation Architecture</h3>
                    <p className="mb-4">
                      Our Multi-Signature Vault implements secure threshold signature schemes across multiple blockchain networks, creating a unified security layer with cross-chain compatibility.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                        <h4 className="font-medium mb-2">Ethereum Implementation</h4>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li>ERC-1271 compatible signature verification</li>
                          <li>Gas-optimized contract architecture</li>
                          <li>Solidity v0.8.x implementation</li>
                          <li>Proxy-based upgradeable design</li>
                        </ul>
                      </div>
                      <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                        <h4 className="font-medium mb-2">TON Implementation</h4>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li>Smart Contract based validation</li>
                          <li>FunC optimized implementation</li>
                          <li>Jetton integration for token assets</li>
                          <li>TL-B schema compliant messaging</li>
                        </ul>
                      </div>
                      <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                        <h4 className="font-medium mb-2">Solana Implementation</h4>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li>Program Derived Addresses (PDAs)</li>
                          <li>Rust-based on-chain program</li>
                          <li>Account model optimized storage</li>
                          <li>Instruction-based transaction flow</li>
                        </ul>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-4 text-purple-700 dark:text-purple-400">Cryptographic Specifications</h3>
                    <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 mb-6">
                      <h4 className="font-medium mb-2">Signature Schemes</h4>
                      <ul className="text-sm space-y-2 text-muted-foreground">
                        <li><span className="font-mono text-xs bg-slate-200 dark:bg-slate-700 px-1 rounded">ECDSA</span> - Utilized for Ethereum and Bitcoin-compatible signing</li>
                        <li><span className="font-mono text-xs bg-slate-200 dark:bg-slate-700 px-1 rounded">Ed25519</span> - Implemented for Solana and other modern chains</li>
                        <li><span className="font-mono text-xs bg-slate-200 dark:bg-slate-700 px-1 rounded">BLS</span> - Available for aggregated signature options</li>
                        <li><span className="font-mono text-xs bg-slate-200 dark:bg-slate-700 px-1 rounded">Schnorr</span> - Supported for advanced threshold signing</li>
                      </ul>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-4 text-purple-700 dark:text-purple-400">Performance Characteristics</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-100 dark:bg-gray-800">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Metric</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ethereum</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">TON</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Solana</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                          <tr>
                            <td className="px-4 py-2 text-sm">Confirmation Time</td>
                            <td className="px-4 py-2 text-sm">30-60 seconds</td>
                            <td className="px-4 py-2 text-sm">5-10 seconds</td>
                            <td className="px-4 py-2 text-sm">0.4-0.8 seconds</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 text-sm">Gas/Fees (Average)</td>
                            <td className="px-4 py-2 text-sm">0.003-0.008 ETH</td>
                            <td className="px-4 py-2 text-sm">0.05-0.15 TON</td>
                            <td className="px-4 py-2 text-sm">0.000005-0.00001 SOL</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 text-sm">Max Signatures</td>
                            <td className="px-4 py-2 text-sm">20 (gas limited)</td>
                            <td className="px-4 py-2 text-sm">32</td>
                            <td className="px-4 py-2 text-sm">50+</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faq">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-6 w-6 text-purple-500" />
                  Frequently Asked Questions
                </CardTitle>
                <CardDescription>
                  Common questions and answers about Multi-Signature Vaults
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-medium mb-2">What happens if one signer loses their key?</h3>
                    <p className="text-muted-foreground">
                      This depends on your M-of-N configuration. If you set up a 2-of-3 signature requirement, losing one key still allows the remaining two signers to access the vault and potentially reconfigure it. However, if you have a 2-of-2 setup, losing one key could result in permanent loss of access, which is why we recommend implementing recovery mechanisms.
                    </p>
                  </div>
                  
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-medium mb-2">How do I set up a Multi-Signature Vault for my organization?</h3>
                    <p className="text-muted-foreground">
                      Creating a Multi-Signature Vault for an organization typically involves identifying the appropriate signatories, determining the signature threshold, generating unique keys for each authorized signer, and configuring the vault with these parameters. Our guided setup process walks you through each step, including security recommendations and governance considerations.
                    </p>
                  </div>
                  
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-medium mb-2">Can I change the signature requirements after creating the vault?</h3>
                    <p className="text-muted-foreground">
                      Yes, Multi-Signature Vaults allow reconfiguration of the signature requirements. However, any changes to the vault configuration (adding/removing signers or changing thresholds) require approval using the existing signature requirements. This ensures security is maintained during reconfiguration.
                    </p>
                  </div>
                  
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-medium mb-2">Are there delays in processing Multi-Signature transactions?</h3>
                    <p className="text-muted-foreground">
                      Multi-Signature transactions require collecting signatures from multiple parties, which can introduce operational delays depending on signer availability. Additionally, some configurations include optional time-delay parameters for security purposes. Standard blockchain confirmation times also apply once all signatures are collected.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">What blockchain networks support Multi-Signature Vaults?</h3>
                    <p className="text-muted-foreground">
                      Our Multi-Signature Vault implementation supports Ethereum, TON, and Solana networks, with each implementation optimized for the specific characteristics and capabilities of these blockchains. Cross-chain operations are also supported through our unified interface, allowing management of multi-signature requirements across different networks.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t p-4">
                <div className="w-full">
                  <p className="text-sm text-muted-foreground mb-4">
                    Have more questions about Multi-Signature Vaults? Contact our support team or explore our extensive documentation.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="outline" className="flex-1">
                      Contact Support
                    </Button>
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex-1">
                      <Link href="/specialized-vault-creation?vault=multi-signature">Create Multi-Signature Vault</Link>
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DocumentationLayout>
  );
};

export default MultiSignatureVaultDocumentation;