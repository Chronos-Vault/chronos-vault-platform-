import React from 'react';
import { useLocation, Link } from 'wouter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRightIcon, BookOpenIcon, ShieldCheckIcon, KeySquareIcon, UsersIcon } from 'lucide-react';

// Import components
import PageHeader from '@/components/layout/page-header';

const SecurityTutorials = () => {
  const [location, navigate] = useLocation();

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <PageHeader 
        title="Security Feature Tutorials"
        subtitle="Learn how to use our advanced security features to protect your digital assets"
        icon={<BookOpenIcon className="w-10 h-10 text-[#FF5AF7]" />}
      />

      <Tabs defaultValue="behavioral" className="w-full mt-8">
        <TabsList className="grid w-full grid-cols-3 bg-[#1A1A1A] border border-[#333] rounded-lg overflow-hidden p-0.5">
          <TabsTrigger 
            value="behavioral" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6B00D7] data-[state=active]:to-[#FF5AF7] data-[state=active]:text-white"
          >
            Behavioral Authentication
          </TabsTrigger>
          <TabsTrigger 
            value="quantum"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6B00D7] data-[state=active]:to-[#FF5AF7] data-[state=active]:text-white"
          >
            Quantum-Resistant Cryptography
          </TabsTrigger>
          <TabsTrigger 
            value="social"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6B00D7] data-[state=active]:to-[#FF5AF7] data-[state=active]:text-white"
          >
            Social Recovery
          </TabsTrigger>
        </TabsList>

        {/* Behavioral Authentication */}
        <TabsContent value="behavioral">
          <div className="grid gap-6 mt-8">
            <Card className="bg-[#1A1A1A] border border-[#333] shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white">What is Behavioral Authentication?</CardTitle>
                <CardDescription className="text-gray-400">
                  Understand how our AI-powered system protects your assets by learning your transaction patterns
                </CardDescription>
              </CardHeader>
              <CardContent className="text-gray-300">
                <div className="space-y-4">
                  <p className="text-gray-300">
                    Behavioral Authentication is an advanced security feature that uses machine learning algorithms to
                    analyze your transaction patterns, creating a unique behavioral fingerprint that helps identify
                    unusual activity.
                  </p>
                  
                  <h3 className="text-xl font-semibold mt-6 text-[#FF5AF7]">How It Works</h3>
                  
                  <div className="space-y-4 mt-4">
                    <div className="flex items-start">
                      <div className="bg-[#6B00D7]/20 p-2 rounded-full mr-4">
                        <ShieldCheckIcon className="w-6 h-6 text-[#FF5AF7]" />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-white">Pattern Recognition</h4>
                        <p className="text-gray-400">
                          The system learns from your normal transaction behaviors including timing, amounts, 
                          frequencies, and blockchain destinations.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-[#6B00D7]/20 p-2 rounded-full mr-4">
                        <ShieldCheckIcon className="w-6 h-6 text-[#FF5AF7]" />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-white">Real-time Detection</h4>
                        <p className="text-gray-400">
                          When a transaction deviates from your established patterns, the system requires additional
                          verification to ensure it's truly you.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-[#6B00D7]/20 p-2 rounded-full mr-4">
                        <ShieldCheckIcon className="w-6 h-6 text-[#FF5AF7]" />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-white">Privacy-Preserving</h4>
                        <p className="text-gray-400">
                          Your behavioral data is processed using zero-knowledge techniques, ensuring your privacy
                          is maintained while still providing robust security.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-[#333]">
                <Button 
                  onClick={() => navigate('/behavioral-authentication')}
                  className="mt-4 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90"
                >
                  Go to Behavioral Authentication Dashboard
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-[#1A1A1A] border border-[#333] shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Getting Started with Behavioral Authentication</CardTitle>
                <CardDescription className="text-gray-400">
                  Simple steps to activate and use behavioral authentication for your vaults
                </CardDescription>
              </CardHeader>
              <CardContent className="text-gray-300">
                <div className="space-y-6">
                  <div className="bg-[#111] p-4 rounded-lg border border-[#333]">
                    <h3 className="text-lg font-semibold mb-2 text-[#FF5AF7]">Step 1: Enable the Feature</h3>
                    <p className="text-gray-400">
                      Navigate to your vault settings and enable "Behavioral Authentication". You'll need to confirm 
                      this action with your wallet signature.
                    </p>
                  </div>
                  
                  <div className="bg-[#111] p-4 rounded-lg border border-[#333]">
                    <h3 className="text-lg font-semibold mb-2 text-[#FF5AF7]">Step 2: Training Period</h3>
                    <p className="text-gray-400">
                      The system needs to learn your normal behavior. During the first 7-14 days, perform your usual 
                      transactions. The system will analyze these to establish your baseline patterns.
                    </p>
                  </div>
                  
                  <div className="bg-[#111] p-4 rounded-lg border border-[#333]">
                    <h3 className="text-lg font-semibold mb-2 text-[#FF5AF7]">Step 3: Set Verification Preferences</h3>
                    <p className="text-gray-400">
                      Choose your preferred secondary verification methods when unusual activity is detected:
                      hardware wallet, multi-signature approval, or time-delay release.
                    </p>
                  </div>
                  
                  <div className="bg-[#111] p-4 rounded-lg border border-[#333]">
                    <h3 className="text-lg font-semibold mb-2 text-[#FF5AF7]">Step 4: Regular Review</h3>
                    <p className="text-gray-400">
                      Periodically check your Behavioral Authentication dashboard to see detected patterns 
                      and any security notifications. You can adjust sensitivity levels as needed.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1A1A1A] border border-[#333] shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Troubleshooting Behavioral Authentication</CardTitle>
                <CardDescription className="text-gray-400">
                  Common issues and how to resolve them
                </CardDescription>
              </CardHeader>
              <CardContent className="text-gray-300">
                <div className="space-y-6">
                  <div className="border-b border-[#333] pb-4">
                    <h3 className="text-lg font-semibold mb-2 text-[#FF5AF7]">Too Many Security Challenges</h3>
                    <p className="text-gray-400 mb-2">
                      If you're getting too many verification requests for legitimate transactions:
                    </p>
                    <ul className="list-disc pl-6 text-gray-400">
                      <li>Decrease the sensitivity level in your security settings</li>
                      <li>Ensure your training period included diverse transaction types</li>
                      <li>Add common transaction destinations to your whitelist</li>
                    </ul>
                  </div>
                  
                  <div className="border-b border-[#333] pb-4">
                    <h3 className="text-lg font-semibold mb-2 text-[#FF5AF7]">System Not Detecting Unusual Activity</h3>
                    <p className="text-gray-400 mb-2">
                      If you're concerned the system isn't providing enough security:
                    </p>
                    <ul className="list-disc pl-6 text-gray-400">
                      <li>Increase the sensitivity level in your security settings</li>
                      <li>Ensure you've completed the full training period</li>
                      <li>Add additional security layers like multi-signature approval</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-[#FF5AF7]">Locked Out of Your Vault</h3>
                    <p className="text-gray-400 mb-2">
                      If behavioral analysis has temporarily restricted your access:
                    </p>
                    <ul className="list-disc pl-6 text-gray-400">
                      <li>Complete the secondary verification process you've configured</li>
                      <li>Use your social recovery option if you've set one up</li>
                      <li>Contact support with your backup verification codes</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-[#333]">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/security-verification')}
                  className="mt-4 border-[#6B00D7] text-[#FF5AF7] hover:bg-[#6B00D7]/10"
                >
                  View Security Verification Options
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Quantum-Resistant Cryptography */}
        <TabsContent value="quantum">
          <div className="grid gap-6 mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Understanding Quantum-Resistant Cryptography</CardTitle>
                <CardDescription>
                  How our post-quantum cryptographic systems protect your assets from future threats
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Quantum-Resistant Cryptography uses advanced mathematical algorithms that are designed to withstand
                    attacks from quantum computers, which could potentially break traditional encryption methods.
                  </p>
                  
                  <h3 className="text-xl font-semibold mt-6">Core Technologies</h3>
                  
                  <div className="space-y-4 mt-4">
                    <div className="flex items-start">
                      <div className="bg-[#111] p-2 rounded-full mr-4 border border-[#333]">
                        <KeySquareIcon className="w-6 h-6 text-[#FF5AF7]" />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-white">Lattice-Based Cryptography</h4>
                        <p className="text-gray-400">
                          Our system uses lattice-based algorithms which rely on the hardness of certain mathematical
                          problems that even quantum computers find difficult to solve.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-[#111] p-2 rounded-full mr-4 border border-[#333]">
                        <KeySquareIcon className="w-6 h-6 text-[#FF5AF7]" />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-white">Dynamic Key Rotation</h4>
                        <p className="text-gray-400">
                          The system automatically rotates cryptographic keys according to a schedule, limiting the
                          window of opportunity for any potential attacker.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-[#111] p-2 rounded-full mr-4 border border-[#333]">
                        <KeySquareIcon className="w-6 h-6 text-[#FF5AF7]" />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-white">Progressive Security Strength</h4>
                        <p className="text-gray-400">
                          Our implementation gradually upgrades encryption standards as quantum computing advances,
                          ensuring your assets remain protected against emerging threats.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => navigate('/behavioral-authentication?tab=quantum')}
                  className="mt-4 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90"
                >
                  Go to Quantum-Resistant Dashboard
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-[#1A1A1A] border border-[#333] shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Setting Up Quantum-Resistant Protection</CardTitle>
                <CardDescription className="text-gray-400">
                  How to enable and configure quantum-resistant security for your vaults
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-[#111] p-4 rounded-lg border border-[#333]">
                    <h3 className="text-lg font-semibold mb-2 text-[#FF5AF7]">Step 1: Enable Quantum Protection</h3>
                    <p className="text-gray-400">
                      In your vault creation process or vault settings, select the "Quantum-Resistant Security" 
                      option. This will apply post-quantum algorithms to your vault's encryption layer.
                    </p>
                  </div>
                  
                  <div className="bg-[#111] p-4 rounded-lg border border-[#333]">
                    <h3 className="text-lg font-semibold mb-2 text-[#FF5AF7]">Step 2: Choose Security Level</h3>
                    <p className="text-gray-400">
                      Select your desired security strength level. Higher levels provide more protection but may 
                      require slightly more processing time for transactions.
                    </p>
                    <ul className="list-disc pl-6 text-gray-400 mt-2">
                      <li><strong className="text-white">Standard:</strong> Suitable for most users, balancing security and performance</li>
                      <li><strong className="text-white">Enhanced:</strong> Higher security parameters for sensitive assets</li>
                      <li><strong className="text-white">Maximum:</strong> Highest security level for critical assets</li>
                    </ul>
                  </div>
                  
                  <div className="bg-[#111] p-4 rounded-lg border border-[#333]">
                    <h3 className="text-lg font-semibold mb-2 text-[#FF5AF7]">Step 3: Key Rotation Schedule</h3>
                    <p className="text-gray-400">
                      Set a schedule for automatic key rotation. Options range from monthly to yearly rotations, 
                      with more frequent rotations providing better security at the cost of requiring you to 
                      re-authenticate more often.
                    </p>
                  </div>
                  
                  <div className="bg-[#111] p-4 rounded-lg border border-[#333]">
                    <h3 className="text-lg font-semibold mb-2 text-[#FF5AF7]">Step 4: Backup Your Recovery Data</h3>
                    <p className="text-gray-400">
                      After enabling quantum-resistant protection, you'll receive a special recovery key. Store this 
                      securely offline, as it's essential for accessing your vault if standard methods fail.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Best Practices for Quantum-Resistant Security</CardTitle>
                <CardDescription>
                  Optimizing your protection against quantum computing threats
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-2">Regular Security Audits</h3>
                    <p className="text-gray-700">
                      Schedule quarterly reviews of your quantum security settings to ensure they align with the latest 
                      advancements in quantum computing. Our dashboard provides recommendations based on current 
                      technological developments.
                    </p>
                  </div>
                  
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-2">Layered Security Approach</h3>
                    <p className="text-gray-700">
                      Combine quantum-resistant protection with other security features like multi-signature 
                      authorization and behavioral authentication for comprehensive protection.
                    </p>
                  </div>
                  
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-2">Offline Backup Strategy</h3>
                    <p className="text-gray-700">
                      Store quantum-resistant recovery keys in multiple secure offline locations. Consider using 
                      physical security devices specifically designed for post-quantum key storage.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Stay Informed</h3>
                    <p className="text-gray-700">
                      Subscribe to our security bulletins to receive updates on quantum computing advancements and 
                      how they affect your protection. We provide automatic security upgrades as standards evolve.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/security-verification')}
                  className="mt-4"
                >
                  View Security Health Dashboard
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Social Recovery */}
        <TabsContent value="social">
          <div className="grid gap-6 mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Social Recovery System Overview</CardTitle>
                <CardDescription>
                  How our guardian-based recovery system ensures you never lose access to your assets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Social Recovery provides a secure way to regain access to your vault if you lose your primary access 
                    method. Instead of relying on a single recovery method, it distributes recovery authority among 
                    trusted contacts (guardians) that you designate.
                  </p>
                  
                  <h3 className="text-xl font-semibold mt-6">Key Features</h3>
                  
                  <div className="space-y-4 mt-4">
                    <div className="flex items-start">
                      <div className="bg-primary/10 p-2 rounded-full mr-4">
                        <UsersIcon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium">Tiered Recovery System</h4>
                        <p className="text-gray-600">
                          Designate different guardians with varying levels of recovery authority, from initiating 
                          the recovery process to providing final approval.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-primary/10 p-2 rounded-full mr-4">
                        <UsersIcon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium">Time-Locked Recovery</h4>
                        <p className="text-gray-600">
                          Recovery requests can be configured with a waiting period, giving you time to cancel 
                          if the request was unauthorized.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-primary/10 p-2 rounded-full mr-4">
                        <UsersIcon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium">Cross-Chain Recovery</h4>
                        <p className="text-gray-600">
                          Guardians can verify recovery requests using any supported blockchain, adding flexibility 
                          and redundancy to the recovery process.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => navigate('/behavioral-authentication?tab=social')}
                  className="mt-4 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90"
                >
                  Go to Social Recovery Dashboard
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Setting Up Your Guardian Network</CardTitle>
                <CardDescription>
                  Steps to configure a robust social recovery system for your vault
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold mb-2">Step 1: Select Your Guardians</h3>
                    <p className="text-gray-700">
                      Choose trusted individuals or institutions to serve as your recovery guardians. Consider their:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 mt-2">
                      <li>Technical proficiency with blockchain technology</li>
                      <li>Availability in emergency situations</li>
                      <li>Geographic distribution (avoid selecting guardians all from one location)</li>
                      <li>Relationship to you (avoid choosing only family members or only colleagues)</li>
                    </ul>
                  </div>
                  
                  <div className="bg-[#111] p-4 rounded-lg border border-[#333]">
                    <h3 className="text-lg font-semibold mb-2 text-[#FF5AF7]">Step 2: Assign Guardian Roles</h3>
                    <p className="text-gray-400">
                      Define the authority level for each guardian:
                    </p>
                    <ul className="list-disc pl-6 text-gray-400 mt-2">
                      <li><strong className="text-white">Primary Guardians:</strong> Can initiate and approve recovery processes</li>
                      <li><strong className="text-white">Verification Guardians:</strong> Must verify recovery requests but cannot initiate them</li>
                      <li><strong className="text-white">Limited Guardians:</strong> Can only approve specific transaction types or asset amounts</li>
                    </ul>
                  </div>
                  
                  <div className="bg-[#111] p-4 rounded-lg border border-[#333]">
                    <h3 className="text-lg font-semibold mb-2 text-[#FF5AF7]">Step 3: Configure Recovery Thresholds</h3>
                    <p className="text-gray-400">
                      Set the minimum number of guardian approvals needed to complete a recovery:
                    </p>
                    <ul className="list-disc pl-6 text-gray-400 mt-2">
                      <li>For standard recovery: typically requires approval from at least 3 guardians or 60% of your network</li>
                      <li>For emergency recovery (faster but with transaction limits): typically requires 2 guardians</li>
                      <li>For full vault recovery (all assets): typically requires all primary guardians plus 50% of verification guardians</li>
                    </ul>
                  </div>
                  
                  <div className="bg-[#111] p-4 rounded-lg border border-[#333]">
                    <h3 className="text-lg font-semibold mb-2 text-[#FF5AF7]">Step 4: Establish Time-Lock Parameters</h3>
                    <p className="text-gray-400">
                      Configure the waiting period before a recovery request is processed. This gives you time to
                      cancel the recovery if it was initiated fraudulently.
                    </p>
                    <ul className="list-disc pl-6 text-gray-400 mt-2">
                      <li>Standard waiting period: 3-7 days</li>
                      <li>Expedited recovery (requires more guardians): 24-48 hours</li>
                      <li>Emergency access (limited functionality): 4-12 hours</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Guardian Management Best Practices</CardTitle>
                <CardDescription>
                  Maintaining a robust and responsive guardian network
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-2">Regular Guardian Testing</h3>
                    <p className="text-gray-700">
                      Conduct biannual test recovery procedures to ensure your guardians:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 mt-2">
                      <li>Still have access to their approval methods</li>
                      <li>Remember their role in your recovery process</li>
                      <li>Can respond within your expected timeframe</li>
                    </ul>
                  </div>
                  
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-2">Guardian Rotation Schedule</h3>
                    <p className="text-gray-700">
                      Review and update your guardian network annually:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 mt-2">
                      <li>Replace guardians you've lost contact with</li>
                      <li>Adjust authority levels based on changing relationships</li>
                      <li>Add new guardians to strengthen network redundancy</li>
                    </ul>
                  </div>
                  
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-2">Guardian Communication Protocol</h3>
                    <p className="text-gray-700">
                      Establish a secure method to communicate with guardians during a recovery process:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 mt-2">
                      <li>Use pre-arranged verification questions to confirm identities</li>
                      <li>Consider encrypted communication channels </li>
                      <li>Establish emergency contact alternatives if primary methods fail</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Documentary Evidence</h3>
                    <p className="text-gray-700">
                      Maintain proper documentation of your social recovery setup:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 mt-2">
                      <li>Store written instructions for guardians in a secure location</li>
                      <li>Consider legal documentation (especially for high-value vaults)</li>
                      <li>Document any changes to your guardian network with timestamps</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/multi-signature-vault')}
                  className="mt-4"
                >
                  Multi-Signature Vault Options
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-10 bg-gradient-to-r from-[#1A1A1A] to-[#111] border border-[#333] rounded-lg p-6 shadow-xl">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-[#FF5AF7] to-[#6B00D7] bg-clip-text text-transparent">Need More Help?</h2>
        <p className="text-gray-400 mt-2">
          If you have specific questions about any of our security features or need assistance setting them up, 
          our support team is here to help.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Button variant="outline" onClick={() => navigate('/faq')} className="border-[#333] text-gray-300 hover:bg-[#6B00D7]/10 hover:text-white">
            View FAQ
          </Button>
          <Button variant="outline" onClick={() => navigate('/security-protocols')} className="border-[#333] text-gray-300 hover:bg-[#6B00D7]/10 hover:text-white">
            Security Protocols Overview
          </Button>
          <Button onClick={() => navigate('/security-verification')} className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90 text-white">
            Security Verification Center <ChevronRightIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SecurityTutorials;