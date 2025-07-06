import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import DocumentationLayout from "@/components/layout/DocumentationLayout";
import { 
  Fingerprint, Shield, LockKeyhole, Users, Key, 
  ScanFace, CheckCircle2, AlertTriangle, 
  FileText, Code, Zap, HelpCircle
} from "lucide-react";

const BiometricVaultDocumentation = () => {
  return (
    <DocumentationLayout>
      <div className="container mx-auto py-10 px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              Biometric Vault
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              Advanced vault security with biometric authentication
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Link href="/vault-types">View All Vault Types</Link>
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="w-full mb-8">
          <TabsList className="grid grid-cols-4 w-full mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-8">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Fingerprint className="h-8 w-8 text-pink-500" />
                  <div>
                    <CardTitle>What is a Biometric Vault?</CardTitle>
                    <CardDescription>Secure your digital assets with your unique biological traits</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  The Biometric Vault is an advanced security solution that uses your unique biological characteristics to protect your digital assets. Unlike traditional password-based authentication systems, biometric vaults utilize physiological or behavioral traits that are unique to you, such as fingerprints, facial features, voice patterns, or even heartbeat rhythms.
                </p>
                <p>
                  This technology offers a significant security advantage as biometric traits are extremely difficult to duplicate or steal, providing a higher level of protection than traditional authentication methods.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-card border rounded-lg p-4 flex flex-col items-center text-center">
                    <Fingerprint className="h-10 w-10 text-pink-500 mb-3" />
                    <h3 className="font-medium mb-2">Biological Authentication</h3>
                    <p className="text-sm text-muted-foreground">Uses your unique biological traits for unmatched security</p>
                  </div>
                  <div className="bg-card border rounded-lg p-4 flex flex-col items-center text-center">
                    <ScanFace className="h-10 w-10 text-pink-500 mb-3" />
                    <h3 className="font-medium mb-2">Multi-Factor Verification</h3>
                    <p className="text-sm text-muted-foreground">Combines multiple biometric factors for enhanced security</p>
                  </div>
                  <div className="bg-card border rounded-lg p-4 flex flex-col items-center text-center">
                    <Shield className="h-10 w-10 text-pink-500 mb-3" />
                    <h3 className="font-medium mb-2">Blockchain Integration</h3>
                    <p className="text-sm text-muted-foreground">Securely stores biometric templates on the blockchain</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Key className="h-8 w-8 text-pink-500" />
                  <div>
                    <CardTitle>Key Benefits</CardTitle>
                    <CardDescription>Advantages of using biometric authentication for your digital assets</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium">Impossible to Lose or Forget</span>
                      <p className="text-muted-foreground">Unlike passwords or keys, your biometrics are always with you and cannot be forgotten.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium">Extremely Difficult to Replicate</span>
                      <p className="text-muted-foreground">High-quality biometric sensors can detect spoofing attempts and require the actual living person.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium">Convenient and Fast Access</span>
                      <p className="text-muted-foreground">Access your vault in seconds with a simple touch or glance, no need to remember complex passwords.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium">Immutable Audit Trail</span>
                      <p className="text-muted-foreground">Every access attempt is recorded on the blockchain, providing an unchangeable record of vault activity.</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-8">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Shield className="h-8 w-8 text-pink-500" />
                  <div>
                    <CardTitle>Security Architecture</CardTitle>
                    <CardDescription>How biometric vaults protect your digital assets</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  The Biometric Vault employs a sophisticated multi-layered security architecture that combines cutting-edge biometric verification with blockchain technology:
                </p>
                
                <h3 className="text-lg font-medium mt-6">Biometric Template Storage</h3>
                <p className="text-muted-foreground">
                  Your biometric data is never stored directly. Instead, we create mathematical templates derived from your biometric traits. These templates cannot be reverse-engineered to recreate your original biometric information, protecting your privacy even in the unlikely event of a data breach.
                </p>
                
                <h3 className="text-lg font-medium mt-4">Zero-Knowledge Proofs</h3>
                <p className="text-muted-foreground">
                  We utilize zero-knowledge proofs to verify your biometric identity without exposing any actual biometric data. This means the system can confirm you are who you claim to be without storing or transmitting sensitive biometric information.
                </p>
                
                <h3 className="text-lg font-medium mt-4">Multi-Chain Security</h3>
                <p className="text-muted-foreground">
                  Your vault access rights are distributed across multiple blockchains (Ethereum, TON, Solana), ensuring that even if one chain experiences issues, your assets remain secure and accessible.
                </p>
                
                <div className="p-4 border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900/50 rounded-lg mt-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-800 dark:text-amber-300">Security Recommendation</h4>
                      <p className="text-sm text-amber-700 dark:text-amber-400">
                        For maximum security, we recommend combining your Biometric Vault with another authentication factor, such as a hardware security key or a trusted device.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Users className="h-8 w-8 text-pink-500" />
                  <div>
                    <CardTitle>Access Control & Recovery</CardTitle>
                    <CardDescription>Managing access and contingency planning</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="text-lg font-medium mb-3">Designated Recovery Contacts</h3>
                <p className="text-muted-foreground mb-4">
                  You can designate trusted individuals as recovery contacts who can help you regain access to your vault in case of emergency. This process requires multiple verification steps and has built-in timelock mechanisms.
                </p>
                
                <h3 className="text-lg font-medium mb-3">Multi-Signature Requirements</h3>
                <p className="text-muted-foreground mb-4">
                  For high-value assets, you can configure your vault to require multiple biometric verifications from different authorized individuals, similar to a multi-signature wallet.
                </p>
                
                <h3 className="text-lg font-medium mb-3">Timelocked Recovery Process</h3>
                <p className="text-muted-foreground">
                  Recovery attempts initiate a mandatory waiting period (configurable from 24 hours to 30 days) during which notifications are sent to all your registered devices and contacts, providing ample time to detect and stop unauthorized recovery attempts.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="technical" className="space-y-8">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Code className="h-8 w-8 text-pink-500" />
                  <div>
                    <CardTitle>Technical Implementation</CardTitle>
                    <CardDescription>How biometric data works with blockchain technology</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="text-lg font-medium">Biometric Template Creation</h3>
                <p className="text-muted-foreground mb-4">
                  When you register your biometric traits, our system generates a mathematical template using a one-way transformation algorithm. This template represents your unique traits without storing the actual biometric data.
                </p>
                
                <div className="p-4 bg-card border rounded-lg my-4 overflow-x-auto">
                  <pre className="text-xs text-muted-foreground">
                    <code>
{`// Example pseudocode for biometric template generation
function generateBiometricTemplate(biometricData) {
  const preprocessed = preprocessBiometricData(biometricData);
  const features = extractFeatures(preprocessed);
  const template = applyOneWayTransformation(features);
  
  // Only the template is stored, original data is discarded
  return template;
}`}
                    </code>
                  </pre>
                </div>
                
                <h3 className="text-lg font-medium mt-6">Blockchain Integration</h3>
                <p className="text-muted-foreground mb-4">
                  The biometric template is further processed through a cryptographic hashing function and stored on the blockchain as a commitment. Your actual biometric data never leaves your device.
                </p>
                
                <h3 className="text-lg font-medium mt-4">Authentication Process</h3>
                <p className="text-muted-foreground">
                  During authentication, a new template is generated from your presented biometric trait and compared with the stored template. This comparison happens on your device and only a verification result is sent to the blockchain for validation.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-card border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Supported Biometric Types:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Fingerprint (up to 10 fingers)</li>
                      <li>• Facial recognition</li>
                      <li>• Voice pattern authentication</li>
                      <li>• Iris scanning</li>
                      <li>• Handwritten signature dynamics</li>
                      <li>• Heart rhythm (with compatible devices)</li>
                    </ul>
                  </div>
                  <div className="bg-card border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Technical Specifications:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Template size: 2048-bit minimum</li>
                      <li>• False Acceptance Rate (FAR): &lt;0.00001%</li>
                      <li>• False Rejection Rate (FRR): &lt;0.1%</li>
                      <li>• Liveness detection: Required</li>
                      <li>• Encryption: AES-256 + secp256k1</li>
                      <li>• Tamper-evident storage</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <FileText className="h-8 w-8 text-pink-500" />
                  <div>
                    <CardTitle>Compatibility & Requirements</CardTitle>
                    <CardDescription>What you need to use a Biometric Vault</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="text-lg font-medium mb-3">Device Requirements</h3>
                <p className="text-muted-foreground mb-4">
                  To use the full capabilities of a Biometric Vault, you'll need a device with built-in biometric sensors (such as a smartphone with fingerprint reader or facial recognition) or compatible external biometric devices.
                </p>
                
                <h3 className="text-lg font-medium mb-3">Supported Platforms</h3>
                <ul className="space-y-2 text-muted-foreground mb-4">
                  <li>• iOS 14+ (requires Face ID or Touch ID)</li>
                  <li>• Android 10+ (with biometric hardware)</li>
                  <li>• Windows 10/11 (with Windows Hello compatible devices)</li>
                  <li>• macOS (with Touch ID)</li>
                </ul>
                
                <h3 className="text-lg font-medium mb-3">Blockchain Requirements</h3>
                <p className="text-muted-foreground">
                  The Biometric Vault operates across multiple blockchains, requiring small amounts of native tokens for transaction fees:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Ethereum: Small amount of ETH for gas fees</li>
                  <li>• TON: Small amount of Toncoin for transaction fees</li>
                  <li>• Solana: Small amount of SOL for transaction fees</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="faq" className="space-y-8">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <HelpCircle className="h-8 w-8 text-pink-500" />
                  <div>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                    <CardDescription>Common questions about Biometric Vaults</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Is my biometric data stored on the blockchain?</h3>
                  <p className="text-muted-foreground">
                    No. Your actual biometric data never leaves your device. Only mathematical templates derived from your biometrics are used, and even these are further processed through cryptographic hashing before being referenced on the blockchain.
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-2">What happens if my biometric trait changes (e.g., facial injury)?</h3>
                  <p className="text-muted-foreground">
                    Biometric systems are designed to accommodate minor changes over time. For significant changes, you can use your secondary authentication methods to access your vault and update your biometric templates.
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-2">What if someone forces me to open my vault under duress?</h3>
                  <p className="text-muted-foreground">
                    You can set up a "duress signal" - a slightly modified version of your biometric input that appears to grant access but actually locks down the vault and sends silent alerts to your emergency contacts.
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-2">What if I lose access to all my biometric authentication devices?</h3>
                  <p className="text-muted-foreground">
                    During vault setup, you establish a recovery process involving designated trusted contacts and/or backup authentication methods. This provides a secure way to regain access, typically with a mandatory timelock period.
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Can biometric vaults be inherited?</h3>
                  <p className="text-muted-foreground">
                    Yes. You can set up inheritance protocols that activate after specific conditions are met (like inactivity period). Designated heirs would need to complete a verification process, after which a timelock countdown begins before access is granted.
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Are there any fees associated with using a Biometric Vault?</h3>
                  <p className="text-muted-foreground">
                    Basic biometric vault functionality is included with your Chronos Vault account. Advanced features like multi-person authentication and inheritance planning may require premium subscription levels.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Don't see your question answered here? Contact our support team for more information or check our <a href="#" className="text-primary hover:underline">comprehensive documentation</a>.
                </p>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Zap className="h-8 w-8 text-pink-500" />
                  <div>
                    <CardTitle>Getting Started</CardTitle>
                    <CardDescription>Ready to create your Biometric Vault?</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <p className="mb-6 max-w-2xl mx-auto">
                  Experience the next level of security for your digital assets with a personalized Biometric Vault. Setup takes just minutes with a compatible device.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <Link href="/specialized-vault-biometric">Create Biometric Vault</Link>
                  </Button>
                  <Button variant="outline">
                    <Link href="/vault-types">Compare Vault Types</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DocumentationLayout>
  );
};

export default BiometricVaultDocumentation;