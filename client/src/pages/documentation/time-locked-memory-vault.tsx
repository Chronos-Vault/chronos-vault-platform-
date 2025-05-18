import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Layout from "@/components/layout/Layout";
import { 
  Clock, 
  Image, 
  File, 
  Shield, 
  Heart, 
  Gift, 
  Calendar, 
  FileText, 
  Code, 
  HelpCircle 
} from "lucide-react";

const TimeLockedMemoryVaultDocumentation = () => {
  return (
    <Layout>
      <div className="container mx-auto py-10 px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-orange-500">
              Time-Locked Memory Vault
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              Preserve cherished memories and digital legacies for future access
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button asChild className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600">
              <Link href="/vault-types">View All Vault Types</Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-5 w-full mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="creation">Creation Guide</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-6 w-6 text-pink-500" />
                  What is a Time-Locked Memory Vault?
                </CardTitle>
                <CardDescription>
                  Explore the concept of digital time capsules for your most precious memories
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-gradient-to-r from-pink-50 to-orange-50 p-6 border border-pink-100 dark:from-pink-950/20 dark:to-orange-950/20 dark:border-pink-900/50">
                  <p className="text-lg mb-4">
                    Time-Locked Memory Vaults are specialized digital time capsules designed to preserve and protect cherished memories, important life moments, and personal messages for future access by yourself or designated recipients.
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-2 text-pink-700 dark:text-pink-400">Core Concept</h3>
                  <p className="mb-4">
                    These vaults combine secure blockchain technology with multimedia content storage to create time-locked capsules that can only be accessed after a predetermined date or trigger event. Unlike standard digital storage, these vaults provide tamper-proof preservation with emotional resonance, allowing you to create lasting digital legacies.
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-2 text-pink-700 dark:text-pink-400">Emotional Technology</h3>
                  <p className="mb-4">
                    Time-Locked Memory Vaults represent a significant evolution in how we preserve important life moments. By combining advanced security with a focus on emotional significance, these vaults transform digital content into meaningful time capsules that connect past and future moments in a personal, secure way.
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-2 text-pink-700 dark:text-pink-400">Applications</h3>
                  <p>
                    These specialized vaults are perfect for preserving wedding memories for milestone anniversaries, recording messages for children's future birthdays, documenting personal growth journeys, preserving family histories and traditions, creating surprise milestone gifts, and establishing digital legacies that connect generations.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="justify-between border-t p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Heart className="h-4 w-4" />
                  Preserve moments that matter for exactly when they're needed
                </div>
                <Button variant="outline" asChild>
                  <Link href="/time-locked-memory-vault-new">Create Memory Vault</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="features">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-6 w-6 text-pink-500" />
                  Key Features of Time-Locked Memory Vaults
                </CardTitle>
                <CardDescription>
                  Discover the unique capabilities that make these vaults special
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-lg border bg-card shadow p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Clock className="h-8 w-8 text-pink-500" />
                      <h3 className="text-xl font-semibold">Precision Time Locking</h3>
                    </div>
                    <p>
                      Set specific future dates and times for vault unlocking with to-the-minute precision. You can schedule access for birthdays, anniversaries, graduations, or any significant future milestone. The blockchain-based timing mechanism ensures tamper-proof accuracy.
                    </p>
                  </div>
                  
                  <div className="rounded-lg border bg-card shadow p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Image className="h-8 w-8 text-pink-500" />
                      <h3 className="text-xl font-semibold">Multimedia Memory Storage</h3>
                    </div>
                    <p>
                      Store a rich collection of personal multimedia content including high-resolution photos, HD videos, audio recordings, written messages, and interactive elements. Advanced compression techniques maintain quality while proprietary preservation algorithms prevent format obsolescence.
                    </p>
                  </div>
                  
                  <div className="rounded-lg border bg-card shadow p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Calendar className="h-8 w-8 text-pink-500" />
                      <h3 className="text-xl font-semibold">Event-Based Triggers</h3>
                    </div>
                    <p>
                      Beyond simple date-based unlocking, vaults can be configured to open based on specific life events through a secure verification system. This allows for creating messages that will be delivered at significant life transitions like graduations, marriages, or other milestones.
                    </p>
                  </div>
                  
                  <div className="rounded-lg border bg-card shadow p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Shield className="h-8 w-8 text-pink-500" />
                      <h3 className="text-xl font-semibold">Recipient Authentication</h3>
                    </div>
                    <p>
                      Designate specific recipients with secure authentication methods to ensure your memories reach only their intended audience. Multi-factor verification options include biometric confirmation, knowledge-based questions, and secure digital identifiers for maximum security.
                    </p>
                  </div>
                  
                  <div className="rounded-lg border bg-card shadow p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Heart className="h-8 w-8 text-pink-500" />
                      <h3 className="text-xl font-semibold">Emotional Impact Design</h3>
                    </div>
                    <p>
                      Custom unlock experiences create emotionally resonant moments. Choose from cinematic reveal animations, personalized interfaces, and thematic presentations that enhance the emotional significance of the content. Background music, visual themes, and personalized messages create a meaningful experience.
                    </p>
                  </div>
                  
                  <div className="rounded-lg border bg-card shadow p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <File className="h-8 w-8 text-pink-500" />
                      <h3 className="text-xl font-semibold">Legacy Preservation</h3>
                    </div>
                    <p>
                      Advanced digital preservation techniques ensure your memories remain accessible despite technological changes. Content is maintained in modern formats through automatic migration algorithms, and the distributed blockchain storage provides redundancy to prevent data loss over decades.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="creation">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-pink-500" />
                  Memory Vault Creation Guide
                </CardTitle>
                <CardDescription>
                  Step-by-step process for creating meaningful time capsules
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-pink-700 dark:text-pink-400">Creating Your Memory Vault</h3>
                  
                  <div className="rounded-lg border p-6 space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300 font-semibold">1</div>
                        <h4 className="text-lg font-medium">Choose Your Memory Theme</h4>
                      </div>
                      <p className="text-muted-foreground ml-11">
                        Begin by selecting the primary purpose and emotional theme of your memory vault. Options include celebration vaults, legacy messages, milestone records, future gifts, personal journals, and family history archives. Your selection will customize the interface and preservation options.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300 font-semibold">2</div>
                        <h4 className="text-lg font-medium">Upload Your Content</h4>
                      </div>
                      <p className="text-muted-foreground ml-11">
                        Add your memories through our intuitive media uploader that supports photos, videos, audio recordings, documents, and written messages. Our system automatically optimizes your content for long-term preservation while maintaining quality. You can organize content into sections and add descriptive context.
                      </p>
                      <div className="ml-11 grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                        <div className="border rounded-lg p-3 text-center text-sm text-muted-foreground">
                          <Image className="h-5 w-5 mx-auto mb-1" />
                          Photos up to 50MB each
                        </div>
                        <div className="border rounded-lg p-3 text-center text-sm text-muted-foreground">
                          <File className="h-5 w-5 mx-auto mb-1" />
                          Videos up to 2GB each
                        </div>
                        <div className="border rounded-lg p-3 text-center text-sm text-muted-foreground">
                          <File className="h-5 w-5 mx-auto mb-1" />
                          Documents and audio
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300 font-semibold">3</div>
                        <h4 className="text-lg font-medium">Set Your Time Lock Parameters</h4>
                      </div>
                      <p className="text-muted-foreground ml-11">
                        Configure when and how your vault will unlock. Options include specific calendar dates, time intervals (e.g., "20 years from now"), event-based triggers with verification methods, recurring date access (like annual birthday messages), and multi-phase unlocking for content that reveals gradually over time.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300 font-semibold">4</div>
                        <h4 className="text-lg font-medium">Designate Recipients and Access Controls</h4>
                      </div>
                      <p className="text-muted-foreground ml-11">
                        Specify who can access your vault when it unlocks. Options range from personal access only, to designated individuals with secure verification methods, to family groups with hierarchical access permissions. You can also set viewing limitations, download permissions, and sharing capabilities.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300 font-semibold">5</div>
                        <h4 className="text-lg font-medium">Customize the Unlock Experience</h4>
                      </div>
                      <p className="text-muted-foreground ml-11">
                        Design how your memories will be presented when the vault unlocks. Select from cinematic reveal animations, personalized welcome messages, custom layouts, background music, and thematic visual elements. These elements combine to create an emotionally resonant experience for recipients.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300 font-semibold">6</div>
                        <h4 className="text-lg font-medium">Preservation and Security Settings</h4>
                      </div>
                      <p className="text-muted-foreground ml-11">
                        Configure advanced preservation options including format migration preferences, redundancy levels, and decentralized storage allocation. Set security parameters like access notification preferences, authentication requirements, and optional backup access methods for emergency situations.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300 font-semibold">7</div>
                        <h4 className="text-lg font-medium">Complete Your Vault Creation</h4>
                      </div>
                      <p className="text-muted-foreground ml-11">
                        Review all settings, preview the unlock experience, and confirm your vault creation. Your content will be securely encrypted, fragmented, and distributed across our blockchain network, creating a tamper-proof time capsule that will preserve your memories exactly as you intended until the designated unlock time.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t p-4">
                <div className="w-full">
                  <Button className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600" asChild>
                    <Link href="/time-locked-memory-vault-new">Create Your Memory Vault Now</Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="technical">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-6 w-6 text-pink-500" />
                  Technical Specifications
                </CardTitle>
                <CardDescription>
                  Under-the-hood details of the memory preservation technology
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="rounded-lg border-2 border-dashed border-muted-foreground/20 p-6">
                    <h3 className="text-xl font-semibold mb-4 text-pink-700 dark:text-pink-400">Memory Preservation Architecture</h3>
                    <p className="mb-4">
                      Time-Locked Memory Vaults utilize a specialized technical architecture designed for long-term digital preservation with emotional integrity, combining advanced cryptography with distributed storage systems.
                    </p>
                    
                    <h4 className="text-lg font-medium mb-2">Storage and Preservation</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                        <h5 className="font-medium mb-2">Content Processing Pipeline</h5>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li>Advanced media compression with preservation focus</li>
                          <li>Perceptual hashing for content integrity verification</li>
                          <li>Format-neutral storage with automatic migration capability</li>
                          <li>Contextual metadata embedding for relational preservation</li>
                        </ul>
                      </div>
                      <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                        <h5 className="font-medium mb-2">Distributed Storage System</h5>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li>Content fragmentation across multiple blockchain networks</li>
                          <li>Geographic redundancy with 99.99999% durability rating</li>
                          <li>Self-healing storage with automatic corruption detection</li>
                          <li>Content-addressed storage for immutable references</li>
                        </ul>
                      </div>
                    </div>
                    
                    <h4 className="text-lg font-medium mb-2">Time-Locking Mechanism</h4>
                    <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 mb-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium mb-2">Core Time Verification</h5>
                          <ul className="text-sm space-y-1 text-muted-foreground">
                            <li>Blockchain timestamp attestation across multiple networks</li>
                            <li>Threshold-based distributed time oracle integration</li>
                            <li>Time-Locked Encryption using verifiable delay functions</li>
                            <li>Temporal consensus mechanism requiring multi-chain verification</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium mb-2">Trigger Implementation</h5>
                          <ul className="text-sm space-y-1 text-muted-foreground">
                            <li>Event oracle integration for real-world trigger verification</li>
                            <li>Multi-signature confirmation for subjective event verification</li>
                            <li>Recursive unlock scheduling for graduated content release</li>
                            <li>Conditional logic trees for complex unlock scenarios</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <h4 className="text-lg font-medium mb-2">Emotional Technology Components</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="border rounded-lg p-4">
                        <h5 className="font-medium mb-2">Contextual Presentation Engine</h5>
                        <p className="text-sm text-muted-foreground">
                          Dynamic rendering system that presents content with emotional context preservation, including relationship-aware content sequencing and environmental adaptability for optimal emotional impact.
                        </p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <h5 className="font-medium mb-2">Narrative Construction System</h5>
                        <p className="text-sm text-muted-foreground">
                          AI-assisted organization of multimedia elements into coherent emotional narratives, maintaining creator intent while optimizing for emotional resonance regardless of future viewing context.
                        </p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <h5 className="font-medium mb-2">Temporal Context Preservation</h5>
                        <p className="text-sm text-muted-foreground">
                          Advanced metadata systems that maintain the cultural, technological, and personal context of created memories, ensuring future viewers understand the significance regardless of temporal distance.
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="text-lg font-medium mb-2">Security Implementation</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-100 dark:bg-gray-800">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Security Layer</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Implementation</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Purpose</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                          <tr>
                            <td className="px-4 py-2 text-sm">Encryption</td>
                            <td className="px-4 py-2 text-sm">Quantum-resistant hybrid encryption (AES-256 + NTRU)</td>
                            <td className="px-4 py-2 text-sm">Long-term content protection against advanced decryption attempts</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 text-sm">Access Control</td>
                            <td className="px-4 py-2 text-sm">Multi-factor authentication with biometric options</td>
                            <td className="px-4 py-2 text-sm">Recipient verification ensuring only intended viewers access content</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 text-sm">Integrity</td>
                            <td className="px-4 py-2 text-sm">Cross-chain merkle proofs with continual verification</td>
                            <td className="px-4 py-2 text-sm">Tamper detection and proof of non-modification over time</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 text-sm">Persistence</td>
                            <td className="px-4 py-2 text-sm">Multi-network distribution with redundancy factor of 7</td>
                            <td className="px-4 py-2 text-sm">Protection against network failures or blockchain obsolescence</td>
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
                  <HelpCircle className="h-6 w-6 text-pink-500" />
                  Frequently Asked Questions
                </CardTitle>
                <CardDescription>
                  Common questions about Time-Locked Memory Vaults
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-medium mb-2">How long can I lock memories for?</h3>
                    <p className="text-muted-foreground">
                      Time-Locked Memory Vaults support lock periods ranging from 1 day to 100 years. Our specialized long-term preservation technology ensures that content remains accessible and technologically compatible regardless of how far in the future you set your unlock date. For extremely long timeframes (25+ years), we recommend our Legacy tier with enhanced preservation protocols.
                    </p>
                  </div>
                  
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-medium mb-2">What happens if the intended recipient isn't available when the vault unlocks?</h3>
                    <p className="text-muted-foreground">
                      You can configure backup recipient options and contingency plans during vault creation. Options include delayed secondary releases, alternative recipient hierarchies, and custodial access provisions. For family legacy vaults, we recommend setting up a family access tree that designates alternative recipients if primary ones aren't available. The system sends multiple notifications before and after unlock dates.
                    </p>
                  </div>
                  
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-medium mb-2">Can I add content to a vault after I've created it?</h3>
                    <p className="text-muted-foreground">
                      Yes, most vault types allow for additions until their lock date activates. Our Standard and Premium vaults support "time-window additions" where you can designate a period during which new content can be added before final locking. Memorial and Legacy vaults feature "contribution periods" where designated family members can add memories to collective vaults before permanent sealing.
                    </p>
                  </div>
                  
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-medium mb-2">How secure are the memories stored in these vaults?</h3>
                    <p className="text-muted-foreground">
                      Time-Locked Memory Vaults implement multiple layers of security. All content is encrypted using quantum-resistant algorithms before being fragmented and distributed across multiple blockchain networks. This approach eliminates single points of failure while providing mathematical guarantees against unauthorized access. Our system undergoes regular security audits and penetration testing by independent third parties, maintaining bank-grade security standards with emotional content preservation specialization.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">How do I ensure media formats will still be accessible in the distant future?</h3>
                    <p className="text-muted-foreground">
                      Our proprietary Format Evolution Protocol automatically migrates your content to maintain compatibility with current viewing technologies. Content is stored in format-neutral representations with periodic validation and transformation as needed. For long-term vaults (10+ years), we implement advanced format prediction models and maintain original bitstreams alongside evolved formats. This ensures that regardless of how technology changes, your memories remain accessible with their original quality and emotional integrity intact.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t p-4">
                <div className="w-full">
                  <p className="text-sm text-muted-foreground mb-4">
                    Have more questions about Time-Locked Memory Vaults? Our support team is available to help with any inquiries about creating your perfect digital time capsule.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="outline" className="flex-1">
                      Contact Support
                    </Button>
                    <Button className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 flex-1" asChild>
                      <Link href="/time-locked-memory-vault-new">Create Memory Vault</Link>
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default TimeLockedMemoryVaultDocumentation;