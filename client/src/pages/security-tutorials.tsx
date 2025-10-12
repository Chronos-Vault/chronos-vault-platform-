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
import { ChevronRightIcon, BookOpenIcon, ShieldCheckIcon, KeySquareIcon, UsersIcon, FileTextIcon } from 'lucide-react';

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
            <Card className="bg-[#1A1A1A] border border-[#333] shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Quantum-Resistant Cryptography Tutorial</CardTitle>
                <CardDescription className="text-gray-400">
                  Learn how to use ML-KEM-1024 and MPC key management for quantum-safe vaults
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-400">
                    Chronos Vault uses <span className="text-[#50E3C2] font-semibold">ML-KEM-1024 (NIST FIPS 203)</span> for quantum-resistant key encapsulation and 
                    <span className="text-[#50E3C2] font-semibold"> 3-of-5 Shamir Secret Sharing</span> for distributed key management. Here's how to use them:
                  </p>
                  
                  <h3 className="text-xl font-semibold mt-6 text-[#FF5AF7]">Step 1: Generate Hybrid Quantum-Resistant Keys</h3>
                  
                  <div className="bg-[#0D0D0D] p-4 rounded-lg border border-[#444] overflow-x-auto mt-4">
                    <pre className="text-sm text-gray-300">
{`// Initialize quantum-resistant crypto system
import { QuantumResistantCrypto } from '@chronos-vault/security';

const quantumCrypto = new QuantumResistantCrypto();
await quantumCrypto.initialize();

// Generate hybrid keys (Classical RSA-4096 + Quantum ML-KEM-1024)
const hybridKeys = await quantumCrypto.generateHybridKeyPair();

console.log('✅ Hybrid keys generated:', {
  classical: hybridKeys.classical.publicKey,
  quantum: hybridKeys.quantum.publicKey,
  combined: hybridKeys.combined.publicKey  // Use this for vault encryption
});`}
                    </pre>
                  </div>
                  
                  <h3 className="text-xl font-semibold mt-6 text-[#FF5AF7]">Step 2: Distribute Keys with MPC (3-of-5 Threshold)</h3>
                  <p className="text-gray-400">
                    Split your vault key into 5 shares where any 3 can reconstruct it. No single node has access to the complete key.
                  </p>
                  
                  <div className="bg-[#0D0D0D] p-4 rounded-lg border border-[#444] overflow-x-auto mt-4">
                    <pre className="text-sm text-gray-300">
{`// Real MPC implementation using Shamir Secret Sharing
import { MPCKeyManagement } from '@chronos-vault/security';

const mpc = new MPCKeyManagement();
await mpc.initialize();

// Generate distributed key (3-of-5 threshold)
const distributedKey = await mpc.generateDistributedKey(
  vaultId,
  3,  // threshold: need 3 shares to reconstruct
  5   // total shares distributed across 5 nodes
);

// Key shares are automatically encrypted with quantum-resistant crypto
// and distributed across Trinity Protocol nodes:
// - 2 nodes on Arbitrum L2
// - 2 nodes on Solana  
// - 1 node on TON

console.log('🔑 Distributed Key Info:');
console.log(\`  - Shares distributed: \${distributedKey.totalShares}\`);
console.log(\`  - Threshold required: \${distributedKey.threshold}\`);
console.log(\`  - Quantum-resistant: YES\`);
console.log(\`  - Public key hash: \${distributedKey.publicKey}\`);`}
                    </pre>
                  </div>
                  
                  <div className="bg-[#111] p-4 rounded-lg border border-[#333] mt-6">
                    <h4 className="text-lg font-medium text-white mb-2">Security Guarantee</h4>
                    <p className="text-gray-400 text-sm">
                      Even if 2 out of 5 nodes are compromised, your vault key remains secure. An attacker needs to simultaneously 
                      compromise <span className="text-[#50E3C2] font-semibold">at least 3 nodes</span> to reconstruct your key - a mathematically negligible probability.
                    </p>
                  </div>
                  
                  <h3 className="text-xl font-semibold mt-6 text-[#FF5AF7]">Step 3: Use in Your Vault</h3>
                  
                  <div className="space-y-4 mt-4">
                    <div className="flex items-start">
                      <div className="bg-[#111] p-2 rounded-full mr-4 border border-[#333]">
                        <KeySquareIcon className="w-6 h-6 text-[#FF5AF7]" />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-white">Encryption</h4>
                        <p className="text-gray-400">
                          Use the hybrid public key to encrypt vault data. Only the distributed private key (requiring 3-of-5 shares) can decrypt it.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-[#111] p-2 rounded-full mr-4 border border-[#333]">
                        <KeySquareIcon className="w-6 h-6 text-[#FF5AF7]" />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-white">Key Reconstruction</h4>
                        <p className="text-gray-400">
                          When unlocking your vault, the system automatically requests key shares from 3 nodes and reconstructs the private key temporarily in secure memory.
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

            <Card className="bg-[#1A1A1A] border border-[#333] shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Best Practices for Quantum-Resistant Security</CardTitle>
                <CardDescription className="text-gray-400">
                  Optimizing your protection against quantum computing threats
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border-b border-[#333] pb-4">
                    <h3 className="text-lg font-semibold mb-2 text-[#FF5AF7]">Regular Security Audits</h3>
                    <p className="text-gray-400">
                      Schedule quarterly reviews of your quantum security settings to ensure they align with the latest 
                      advancements in quantum computing. Our dashboard provides recommendations based on current 
                      technological developments.
                    </p>
                  </div>
                  
                  <div className="border-b border-[#333] pb-4">
                    <h3 className="text-lg font-semibold mb-2 text-[#FF5AF7]">Layered Security Approach</h3>
                    <p className="text-gray-400">
                      Combine quantum-resistant protection with other security features like multi-signature 
                      authorization and behavioral authentication for comprehensive protection.
                    </p>
                  </div>
                  
                  <div className="border-b border-[#333] pb-4">
                    <h3 className="text-lg font-semibold mb-2 text-[#FF5AF7]">Offline Backup Strategy</h3>
                    <p className="text-gray-400">
                      Store quantum-resistant recovery keys in multiple secure offline locations. Consider using 
                      physical security devices specifically designed for post-quantum key storage.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-[#FF5AF7]">Stay Informed</h3>
                    <p className="text-gray-400">
                      Subscribe to our security bulletins to receive updates on quantum computing advancements and 
                      how they affect your protection. We provide automatic security upgrades as standards evolve.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-[#333] pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/security-verification')}
                  className="mt-4 border-[#333] text-gray-300 hover:bg-[#6B00D7]/10 hover:text-white"
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
            <Card className="bg-[#1A1A1A] border border-[#333] shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Social Recovery System Overview</CardTitle>
                <CardDescription className="text-gray-400">
                  How our guardian-based recovery system ensures you never lose access to your assets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-400">
                    Social Recovery provides a secure way to regain access to your vault if you lose your primary access 
                    method. Instead of relying on a single recovery method, it distributes recovery authority among 
                    trusted contacts (guardians) that you designate.
                  </p>
                  
                  <h3 className="text-xl font-semibold mt-6 text-[#FF5AF7]">Key Features</h3>
                  
                  <div className="space-y-4 mt-4">
                    <div className="flex items-start">
                      <div className="bg-[#111] p-2 rounded-full mr-4 border border-[#333]">
                        <UsersIcon className="w-6 h-6 text-[#FF5AF7]" />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-white">Tiered Recovery System</h4>
                        <p className="text-gray-400">
                          Designate different guardians with varying levels of recovery authority, from initiating 
                          the recovery process to providing final approval.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-[#111] p-2 rounded-full mr-4 border border-[#333]">
                        <UsersIcon className="w-6 h-6 text-[#FF5AF7]" />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-white">Time-Locked Recovery</h4>
                        <p className="text-gray-400">
                          Recovery requests can be configured with a waiting period, giving you time to cancel 
                          if the request was unauthorized.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-[#111] p-2 rounded-full mr-4 border border-[#333]">
                        <UsersIcon className="w-6 h-6 text-[#FF5AF7]" />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-white">Cross-Chain Recovery</h4>
                        <p className="text-gray-400">
                          Guardians can verify recovery requests using any supported blockchain, adding flexibility 
                          and redundancy to the recovery process.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-[#333] pt-4">
                <Button 
                  onClick={() => navigate('/behavioral-authentication?tab=social')}
                  className="mt-4 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90 text-white"
                >
                  Go to Social Recovery Dashboard
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-[#1A1A1A] border border-[#333] shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Setting Up Your Guardian Network</CardTitle>
                <CardDescription className="text-gray-400">
                  Steps to configure a robust social recovery system for your vault
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-[#111] p-4 rounded-lg border border-[#333]">
                    <h3 className="text-lg font-semibold mb-2 text-[#FF5AF7]">Step 1: Select Your Guardians</h3>
                    <p className="text-gray-400">
                      Choose trusted individuals or institutions to serve as your recovery guardians. Consider their:
                    </p>
                    <ul className="list-disc pl-6 text-gray-400 mt-2">
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

            <Card className="bg-[#1A1A1A] border border-[#333] shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Guardian Management Best Practices</CardTitle>
                <CardDescription className="text-gray-400">
                  Maintaining a robust and responsive guardian network
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border-b border-[#333] pb-4">
                    <h3 className="text-lg font-semibold mb-2 text-[#FF5AF7]">Regular Guardian Testing</h3>
                    <p className="text-gray-400">
                      Conduct biannual test recovery procedures to ensure your guardians:
                    </p>
                    <ul className="list-disc pl-6 text-gray-400 mt-2">
                      <li>Still have access to their approval methods</li>
                      <li>Remember their role in your recovery process</li>
                      <li>Can respond within your expected timeframe</li>
                    </ul>
                  </div>
                  
                  <div className="border-b border-[#333] pb-4">
                    <h3 className="text-lg font-semibold mb-2 text-[#FF5AF7]">Guardian Rotation Schedule</h3>
                    <p className="text-gray-400">
                      Review and update your guardian network annually:
                    </p>
                    <ul className="list-disc pl-6 text-gray-400 mt-2">
                      <li>Replace guardians you've lost contact with</li>
                      <li>Adjust authority levels based on changing relationships</li>
                      <li>Add new guardians to strengthen network redundancy</li>
                    </ul>
                  </div>
                  
                  <div className="border-b border-[#333] pb-4">
                    <h3 className="text-lg font-semibold mb-2 text-[#FF5AF7]">Guardian Communication Protocol</h3>
                    <p className="text-gray-400">
                      Establish a secure method to communicate with guardians during a recovery process:
                    </p>
                    <ul className="list-disc pl-6 text-gray-400 mt-2">
                      <li>Use pre-arranged verification questions to confirm identities</li>
                      <li>Consider encrypted communication channels </li>
                      <li>Establish emergency contact alternatives if primary methods fail</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-[#FF5AF7]">Documentary Evidence</h3>
                    <p className="text-gray-400">
                      Maintain proper documentation of your social recovery setup:
                    </p>
                    <ul className="list-disc pl-6 text-gray-400 mt-2">
                      <li>Store written instructions for guardians in a secure location</li>
                      <li>Consider legal documentation (especially for high-value vaults)</li>
                      <li>Document any changes to your guardian network with timestamps</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-[#333] pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/multi-signature-vault')}
                  className="mt-4 border-[#333] text-gray-300 hover:bg-[#6B00D7]/10 hover:text-white"
                >
                  Multi-Signature Vault Options
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* GitHub Source Code Links */}
      <div className="mt-10 bg-gradient-to-r from-[#1A1A1A] to-[#111] border border-[#333] rounded-lg p-6 shadow-xl">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-[#FF5AF7] to-[#6B00D7] bg-clip-text text-transparent mb-4">
          View Tutorial Code on GitHub
        </h2>
        <p className="text-gray-400 mb-6">
          All tutorial code examples are from our <span className="text-[#50E3C2] font-semibold">open-source repositories</span>. 
          Copy, modify, and integrate directly into your applications.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a 
            href="https://github.com/Chronos-Vault/chronos-vault-sdk" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#111] p-4 rounded-lg border border-[#333] hover:border-[#FF5AF7] transition-colors group"
            data-testid="link-sdk-tutorials"
          >
            <div className="flex items-center gap-3 mb-2">
              <FileTextIcon className="h-5 w-5 text-[#FF5AF7]" />
              <h3 className="text-lg font-semibold text-white group-hover:text-[#FF5AF7] transition-colors">SDK Examples</h3>
            </div>
            <p className="text-sm text-gray-400">Complete integration tutorials and code samples</p>
            <p className="text-xs text-gray-500 mt-2">examples/quantum-vault-example.ts</p>
          </a>
          
          <a 
            href="https://github.com/Chronos-Vault/chronos-vault-security" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#111] p-4 rounded-lg border border-[#333] hover:border-[#FF5AF7] transition-colors group"
            data-testid="link-security-tutorials"
          >
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheckIcon className="h-5 w-5 text-[#FF5AF7]" />
              <h3 className="text-lg font-semibold text-white group-hover:text-[#FF5AF7] transition-colors">Security Core</h3>
            </div>
            <p className="text-sm text-gray-400">MPC, Quantum Crypto, VDF implementations</p>
            <p className="text-xs text-gray-500 mt-2">server/security/</p>
          </a>
          
          <a 
            href="https://github.com/Chronos-Vault/chronos-vault-contracts" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#111] p-4 rounded-lg border border-[#333] hover:border-[#FF5AF7] transition-colors group"
            data-testid="link-contracts-tutorials"
          >
            <div className="flex items-center gap-3 mb-2">
              <KeySquareIcon className="h-5 w-5 text-[#FF5AF7]" />
              <h3 className="text-lg font-semibold text-white group-hover:text-[#FF5AF7] transition-colors">Smart Contracts</h3>
            </div>
            <p className="text-sm text-gray-400">Arbitrum, Solana, TON contract examples</p>
            <p className="text-xs text-gray-500 mt-2">contracts/</p>
          </a>
        </div>
      </div>

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