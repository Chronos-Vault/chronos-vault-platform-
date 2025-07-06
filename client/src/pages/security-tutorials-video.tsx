import React from 'react';
import { useLocation } from 'wouter';
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
import { ChevronRightIcon, PlayCircleIcon, DownloadIcon, InfoIcon } from 'lucide-react';

// Import components
import PageHeader from '@/components/layout/page-header';

const SecurityTutorialsVideo = () => {
  const [location, navigate] = useLocation();

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <PageHeader 
        title="Security Feature Video Guides"
        subtitle="Watch comprehensive tutorials on our advanced security features"
        icon={<PlayCircleIcon className="w-10 h-10 text-[#FF5AF7]" />}
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

        {/* Behavioral Authentication Videos */}
        <TabsContent value="behavioral">
          <div className="grid gap-6 mt-8">
            <Card className="bg-[#1A1A1A] border border-[#333] shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Behavioral Authentication Overview</CardTitle>
                <CardDescription className="text-gray-400">
                  A comprehensive introduction to how behavioral authentication protects your assets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-[#111] rounded-lg flex items-center justify-center border border-[#333]">
                  {/* This would be replaced with an actual video player in production */}
                  <div className="text-center p-10">
                    <PlayCircleIcon className="w-20 h-20 text-[#FF5AF7] mx-auto mb-4 opacity-70 hover:opacity-100 transition-opacity cursor-pointer" />
                    <p className="text-gray-200 text-lg">Video Tutorial: Introduction to Behavioral Authentication</p>
                    <p className="text-gray-500 mt-2">Duration: 4:32</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-[#FF5AF7]">What You'll Learn</h3>
                  <ul className="list-disc pl-6 mt-2 text-gray-400 space-y-1">
                    <li>How the system learns your transaction patterns</li>
                    <li>Setting up and training your behavioral profile</li>
                    <li>Understanding security notifications and approvals</li>
                    <li>Privacy protections in behavioral analysis</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-[#333] pt-4">
                <Button variant="outline" className="border-[#333] text-gray-300 hover:bg-[#6B00D7]/10 hover:text-white">
                  <DownloadIcon className="mr-2 h-4 w-4" /> Download Transcript
                </Button>
                <Button onClick={() => navigate('/behavioral-authentication')} className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90 text-white">
                  Try It Yourself <ChevronRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-[#1A1A1A] border border-[#333] shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Configuring Behavioral Authentication</CardTitle>
                <CardDescription className="text-gray-400">
                  Step-by-step guide to setting up and customizing your security preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-[#111] rounded-lg flex items-center justify-center border border-[#333]">
                  {/* This would be replaced with an actual video player in production */}
                  <div className="text-center p-10">
                    <PlayCircleIcon className="w-20 h-20 text-[#FF5AF7] mx-auto mb-4 opacity-70 hover:opacity-100 transition-opacity cursor-pointer" />
                    <p className="text-gray-200 text-lg">Video Tutorial: Setting Up Behavioral Authentication</p>
                    <p className="text-gray-500 mt-2">Duration: 6:15</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-[#FF5AF7]">Tutorial Contents</h3>
                  <ul className="list-disc pl-6 mt-2 text-gray-400 space-y-1">
                    <li>Accessing security settings and enabling the feature</li>
                    <li>Configuring sensitivity levels and alert thresholds</li>
                    <li>Setting up secondary verification methods</li>
                    <li>Testing the system with simulated unusual transactions</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-[#333] pt-4">
                <Button variant="outline" className="border-[#333] text-gray-300 hover:bg-[#6B00D7]/10 hover:text-white">
                  <DownloadIcon className="mr-2 h-4 w-4" /> Download Tutorial PDF
                </Button>
                <Button onClick={() => navigate('/security-tutorials')} className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90 text-white">
                  Written Instructions <ChevronRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Quantum-Resistant Cryptography Videos */}
        <TabsContent value="quantum">
          <div className="grid gap-6 mt-8">
            <Card className="bg-[#1A1A1A] border border-[#333] shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Quantum Computing Threats Explained</CardTitle>
                <CardDescription className="text-gray-400">
                  Understanding why quantum resistance is crucial for long-term asset security
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-[#111] rounded-lg flex items-center justify-center border border-[#333]">
                  {/* This would be replaced with an actual video player in production */}
                  <div className="text-center p-10">
                    <PlayCircleIcon className="w-20 h-20 text-[#FF5AF7] mx-auto mb-4 opacity-70 hover:opacity-100 transition-opacity cursor-pointer" />
                    <p className="text-gray-200 text-lg">Video: Quantum Computing & Blockchain Security</p>
                    <p className="text-gray-500 mt-2">Duration: 7:48</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-[#FF5AF7]">Video Content</h3>
                  <ul className="list-disc pl-6 mt-2 text-gray-400 space-y-1">
                    <li>How quantum computers threaten current cryptography</li>
                    <li>Timeline of quantum computing development</li>
                    <li>Impact on blockchain security and encryption</li>
                    <li>Introduction to post-quantum cryptographic solutions</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-[#333] pt-4">
                <Button variant="outline" className="border-[#333] text-gray-300 hover:bg-[#6B00D7]/10 hover:text-white">
                  <DownloadIcon className="mr-2 h-4 w-4" /> Download Whitepaper
                </Button>
                <Button onClick={() => navigate('/behavioral-authentication?tab=quantum')} className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90 text-white">
                  Explore Quantum Protection <ChevronRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-[#1A1A1A] border border-[#333] shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Implementing Quantum-Resistant Vault Security</CardTitle>
                <CardDescription className="text-gray-400">
                  How to activate and manage quantum-resistant protection for your assets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-[#111] rounded-lg flex items-center justify-center border border-[#333]">
                  {/* This would be replaced with an actual video player in production */}
                  <div className="text-center p-10">
                    <PlayCircleIcon className="w-20 h-20 text-[#FF5AF7] mx-auto mb-4 opacity-70 hover:opacity-100 transition-opacity cursor-pointer" />
                    <p className="text-gray-200 text-lg">Video Tutorial: Setting Up Quantum Protection</p>
                    <p className="text-gray-500 mt-2">Duration: 5:22</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-[#FF5AF7]">Tutorial Contents</h3>
                  <ul className="list-disc pl-6 mt-2 text-gray-400 space-y-1">
                    <li>Enabling quantum-resistant encryption for your vault</li>
                    <li>Choosing appropriate security levels based on asset value</li>
                    <li>Setting up key rotation schedules</li>
                    <li>Backing up quantum-resistant recovery keys</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-[#333] pt-4">
                <Button variant="outline" className="border-[#333] text-gray-300 hover:bg-[#6B00D7]/10 hover:text-white">
                  <InfoIcon className="mr-2 h-4 w-4" /> Technical Specifications
                </Button>
                <Button onClick={() => navigate('/security-tutorials')} className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90 text-white">
                  Written Guide <ChevronRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Social Recovery Videos */}
        <TabsContent value="social">
          <div className="grid gap-6 mt-8">
            <Card className="bg-[#1A1A1A] border border-[#333] shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Social Recovery System Introduction</CardTitle>
                <CardDescription className="text-gray-400">
                  Understanding the guardian-based approach to secure asset recovery
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-[#111] rounded-lg flex items-center justify-center border border-[#333]">
                  {/* This would be replaced with an actual video player in production */}
                  <div className="text-center p-10">
                    <PlayCircleIcon className="w-20 h-20 text-[#FF5AF7] mx-auto mb-4 opacity-70 hover:opacity-100 transition-opacity cursor-pointer" />
                    <p className="text-gray-200 text-lg">Video: Social Recovery Explained</p>
                    <p className="text-gray-500 mt-2">Duration: 6:05</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-[#FF5AF7]">What You'll Learn</h3>
                  <ul className="list-disc pl-6 mt-2 text-gray-400 space-y-1">
                    <li>Benefits of a social recovery system over seed phrases</li>
                    <li>How tiered guardian authority works</li>
                    <li>Understanding time-locked recovery mechanisms</li>
                    <li>Cross-chain verification for increased security</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-[#333] pt-4">
                <Button variant="outline" className="border-[#333] text-gray-300 hover:bg-[#6B00D7]/10 hover:text-white">
                  <DownloadIcon className="mr-2 h-4 w-4" /> Download Transcript
                </Button>
                <Button onClick={() => navigate('/behavioral-authentication?tab=social')} className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90 text-white">
                  Explore Social Recovery <ChevronRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-[#1A1A1A] border border-[#333] shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Setting Up Your Guardian Network</CardTitle>
                <CardDescription className="text-gray-400">
                  Complete walkthrough of configuring your social recovery system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-[#111] rounded-lg flex items-center justify-center border border-[#333]">
                  {/* This would be replaced with an actual video player in production */}
                  <div className="text-center p-10">
                    <PlayCircleIcon className="w-20 h-20 text-[#FF5AF7] mx-auto mb-4 opacity-70 hover:opacity-100 transition-opacity cursor-pointer" />
                    <p className="text-gray-200 text-lg">Video Tutorial: Creating Your Guardian Network</p>
                    <p className="text-gray-500 mt-2">Duration: 8:40</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-[#FF5AF7]">Tutorial Contents</h3>
                  <ul className="list-disc pl-6 mt-2 text-gray-400 space-y-1">
                    <li>Selecting appropriate guardians for your recovery network</li>
                    <li>Assigning guardian roles and authority levels</li>
                    <li>Setting verification thresholds and time-lock periods</li>
                    <li>Testing your recovery system with a simulated recovery</li>
                    <li>Documenting your recovery setup for future reference</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-[#333] pt-4">
                <Button variant="outline" className="border-[#333] text-gray-300 hover:bg-[#6B00D7]/10 hover:text-white">
                  <DownloadIcon className="mr-2 h-4 w-4" /> Download Setup Guide
                </Button>
                <Button onClick={() => navigate('/multi-signature-vault')} className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90 text-white">
                  Related: Multi-Signature Vault <ChevronRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-[#1A1A1A] border border-[#333] shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Recovery Process Demonstration</CardTitle>
                <CardDescription className="text-gray-400">
                  Watch a complete demonstration of the recovery process from start to finish
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-[#111] rounded-lg flex items-center justify-center border border-[#333]">
                  {/* This would be replaced with an actual video player in production */}
                  <div className="text-center p-10">
                    <PlayCircleIcon className="w-20 h-20 text-[#FF5AF7] mx-auto mb-4 opacity-70 hover:opacity-100 transition-opacity cursor-pointer" />
                    <p className="text-gray-200 text-lg">Video Demo: Complete Recovery Process</p>
                    <p className="text-gray-500 mt-2">Duration: 10:15</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-[#FF5AF7]">Demonstration Includes</h3>
                  <ul className="list-disc pl-6 mt-2 text-gray-400 space-y-1">
                    <li>Initiating a recovery request from a new device</li>
                    <li>Guardian notification and verification process</li>
                    <li>Time-lock waiting period and security checks</li>
                    <li>Final recovery approval and asset access restoration</li>
                    <li>Post-recovery security recommendations</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-[#333] pt-4">
                <Button variant="outline" className="border-[#333] text-gray-300 hover:bg-[#6B00D7]/10 hover:text-white">
                  <DownloadIcon className="mr-2 h-4 w-4" /> Recovery Checklist
                </Button>
                <Button onClick={() => navigate('/security-verification')} className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90 text-white">
                  Security Verification Center <ChevronRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-10 bg-gradient-to-r from-[#1A1A1A] to-[#111] border border-[#333] rounded-lg p-6 shadow-xl">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-[#FF5AF7] to-[#6B00D7] bg-clip-text text-transparent">Additional Learning Resources</h2>
        <p className="text-gray-400 mt-2">
          Explore our complete library of security tutorials, technical documentation, and interactive guides
          to get the most out of Chronos Vault's advanced security features.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Button variant="outline" onClick={() => navigate('/security-tutorials')} className="border-[#333] text-gray-300 hover:bg-[#6B00D7]/10 hover:text-white">
            Text-Based Tutorials
          </Button>
          <Button variant="outline" onClick={() => navigate('/security-verification')} className="border-[#333] text-gray-300 hover:bg-[#6B00D7]/10 hover:text-white">
            Security Health Dashboard
          </Button>
          <Button onClick={() => navigate('/premium-features')} className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90 text-white">
            Premium Security Features <ChevronRightIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SecurityTutorialsVideo;