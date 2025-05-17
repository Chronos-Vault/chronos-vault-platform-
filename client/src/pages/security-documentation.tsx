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
import { 
  FileTextIcon, 
  ShieldCheckIcon, 
  KeySquareIcon, 
  UsersIcon, 
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
  HelpCircleIcon
} from 'lucide-react';

// Import components
import PageHeader from '@/components/layout/page-header';

const SecurityDocumentation = () => {
  const [location, navigate] = useLocation();

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <PageHeader 
        title="Security Feature Documentation"
        subtitle="Technical specifications and detailed implementation guides"
        icon={<FileTextIcon className="w-10 h-10 text-[#FF5AF7]" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-[#1A1A1A] to-[#111] border border-[#333] shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-white">
              <ShieldCheckIcon className="w-5 h-5 mr-2 text-[#FF5AF7]" />
              Behavioral Authentication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400">
              AI-powered pattern recognition for transaction security
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => document.getElementById('behavioral-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full border-[#333] text-gray-300 hover:bg-[#6B00D7]/10 hover:text-white"
            >
              View Documentation
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-gradient-to-br from-[#1A1A1A] to-[#111] border border-[#333] shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-white">
              <KeySquareIcon className="w-5 h-5 mr-2 text-[#FF5AF7]" />
              Quantum-Resistant Cryptography
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400">
              Post-quantum encryption for future-proof asset protection
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => document.getElementById('quantum-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full border-[#333] text-gray-300 hover:bg-[#6B00D7]/10 hover:text-white"
            >
              View Documentation
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-gradient-to-br from-[#1A1A1A] to-[#111] border border-[#333] shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-white">
              <UsersIcon className="w-5 h-5 mr-2 text-[#FF5AF7]" />
              Social Recovery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400">
              Advanced guardian-based asset recovery system
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => document.getElementById('social-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full border-[#333] text-gray-300 hover:bg-[#6B00D7]/10 hover:text-white"
            >
              View Documentation
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Behavioral Authentication Documentation */}
      <div id="behavioral-section" className="mb-16 scroll-mt-16">
        <div className="border-b border-[#333] pb-4 mb-8">
          <div className="flex items-center">
            <ShieldCheckIcon className="w-8 h-8 mr-3 text-[#FF5AF7]" />
            <h2 className="text-2xl font-bold text-white">Behavioral Authentication Documentation</h2>
          </div>
          <p className="text-gray-400 mt-2">
            Complete technical implementation of our AI-powered transaction security system
          </p>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-[#FF5AF7]">Technical Overview</h3>
            <div className="bg-[#1A1A1A] shadow-lg rounded-lg p-6 border border-[#333]">
              <p className="text-gray-300 mb-4">
                Behavioral Authentication uses machine learning algorithms to establish a baseline of normal 
                transaction patterns for each user. This pattern recognition serves as a dynamic 
                security layer that complements traditional authentication methods.
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex items-start">
                  <div className="bg-[#111] rounded-full p-2 mr-4 border border-[#333]">
                    <ShieldCheckIcon className="w-5 h-5 text-[#FF5AF7]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Protocol Stack</h4>
                    <p className="text-gray-400 text-sm">
                      Zero-Knowledge ML Analysis → Pattern Recognition Engine → 
                      Anomaly Detection System → Multi-Factor Authentication Trigger
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#111] rounded-full p-2 mr-4 border border-[#333]">
                    <ShieldCheckIcon className="w-5 h-5 text-[#FF5AF7]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Data Processing</h4>
                    <p className="text-gray-400 text-sm">
                      All behavioral data is processed using homomorphic encryption techniques, 
                      allowing pattern analysis without exposing raw transaction details.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#111] rounded-full p-2 mr-4 border border-[#333]">
                    <ShieldCheckIcon className="w-5 h-5 text-[#FF5AF7]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Training Period</h4>
                    <p className="text-gray-400 text-sm">
                      Initial model training requires 7-14 days of transaction activity, 
                      with continuous refinement over time to improve accuracy.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-[#FF5AF7]">Implementation Requirements</h3>
            <div className="bg-[#1A1A1A] shadow-lg rounded-lg p-6 border border-[#333]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2 text-white">Client-Side Requirements</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircleIcon className="w-5 h-5 text-[#50E3C2] mr-2 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">Modern browser with WebAssembly support</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircleIcon className="w-5 h-5 text-[#50E3C2] mr-2 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">Secure local storage for pattern caching</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircleIcon className="w-5 h-5 text-[#50E3C2] mr-2 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">At least one secondary verification method</span>
                    </li>
                    <li className="flex items-center">
                      <AlertCircleIcon className="w-5 h-5 text-amber-400 mr-2 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">Compatible hardware wallet (recommended)</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-white">Server-Side Requirements</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircleIcon className="w-5 h-5 text-[#50E3C2] mr-2 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">Isolated ML processing environment</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircleIcon className="w-5 h-5 text-[#50E3C2] mr-2 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">Secure encrypted model storage</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircleIcon className="w-5 h-5 text-[#50E3C2] mr-2 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">Real-time analytics capability</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircleIcon className="w-5 h-5 text-[#50E3C2] mr-2 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">Audit logging for all security challenges</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-[#FF5AF7]">Configuration Options</h3>
            <div className="bg-[#1A1A1A] shadow-lg overflow-hidden sm:rounded-lg border border-[#333]">
              <ul className="divide-y divide-[#333]">
                <li>
                  <div className="px-4 py-5 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-md font-medium text-[#FF5AF7]">Sensitivity Level</h4>
                          <p className="text-sm text-gray-400">Determines threshold for flagging unusual transactions</p>
                        </div>
                      </div>
                      <div>
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#111] text-[#50E3C2] border border-[#333]">
                          Adjustable
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-300">
                      <p>Options: Low (flag only very unusual), Medium (default), High (strict security)</p>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="px-4 py-5 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-md font-medium text-[#FF5AF7]">Verification Methods</h4>
                          <p className="text-sm text-gray-400">Secondary authentication when unusual activity detected</p>
                        </div>
                      </div>
                      <div>
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#111] text-[#50E3C2] border border-[#333]">
                          Multiple Options
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-300">
                      <p>Options: Hardware wallet, multi-signature, time-delay release, biometric</p>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="px-4 py-5 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-md font-medium text-[#FF5AF7]">Learning Mode</h4>
                          <p className="text-sm text-gray-400">Determines how quickly the system adapts to new patterns</p>
                        </div>
                      </div>
                      <div>
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#111] text-[#50E3C2] border border-[#333]">
                          Adjustable
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-300">
                      <p>Options: Conservative (slow adaptation), Balanced (default), Rapid (quick learning)</p>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="px-4 py-5 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-md font-medium text-[#FF5AF7]">Whitelist Management</h4>
                          <p className="text-sm text-gray-400">Addresses and transaction types to exclude from monitoring</p>
                        </div>
                      </div>
                      <div>
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#111] text-[#50E3C2] border border-[#333]">
                          Customizable
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-300">
                      <p>Maximum 50 addresses per vault, with optional time-limited entries</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => navigate('/security-tutorials')}
              className="border-[#333] text-gray-300 hover:bg-[#6B00D7]/10 hover:text-white"
            >
              View User Tutorials
            </Button>
            <Button 
              className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90 text-white"
              onClick={() => navigate('/behavioral-authentication')}
            >
              Go to Behavioral Authentication
            </Button>
          </div>
        </div>
      </div>

      {/* Quantum-Resistant Cryptography Documentation */}
      <div id="quantum-section" className="mb-16 scroll-mt-16">
        <div className="border-b border-[#333] pb-4 mb-8">
          <div className="flex items-center">
            <KeySquareIcon className="w-8 h-8 mr-3 text-[#FF5AF7]" />
            <h2 className="text-2xl font-bold text-white">Quantum-Resistant Cryptography Documentation</h2>
          </div>
          <p className="text-gray-400 mt-2">
            Technical specifications for our post-quantum encryption implementation
          </p>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-[#FF5AF7]">Cryptographic Framework</h3>
            <div className="bg-[#1A1A1A] shadow-lg rounded-lg p-6 border border-[#333]">
              <p className="text-gray-300 mb-4">
                Our Quantum-Resistant Cryptography implementation uses a combination of lattice-based 
                cryptography and multivariate polynomial schemes to protect against threats from 
                both conventional and quantum computing attacks.
              </p>
              
              <div className="mt-8">
                <h4 className="text-lg font-semibold mb-4 text-white">Security Parameters</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-[#333]">
                    <thead className="bg-[#111]">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-[#FF5AF7] uppercase tracking-wider">Security Level</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-[#FF5AF7] uppercase tracking-wider">Kyber Parameter Set</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-[#FF5AF7] uppercase tracking-wider">Dilithium Parameter Set</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-[#FF5AF7] uppercase tracking-wider">Estimated Security (Bits)</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-[#FF5AF7] uppercase tracking-wider">Recommended Use Case</th>
                      </tr>
                    </thead>
                    <tbody className="bg-[#1A1A1A] divide-y divide-[#333]">
                      <tr>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">Standard</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">Kyber-512</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">Dilithium-2</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">128</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">Personal vaults, moderate value</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">Enhanced</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">Kyber-768</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">Dilithium-3</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">192</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">Business vaults, high value</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">Maximum</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">Kyber-1024</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">Dilithium-5</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">256</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">Enterprise vaults, critical assets</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="text-lg font-semibold mb-4 text-white">Implementation Architecture</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[#111] rounded-lg p-4 border border-[#333]">
                    <h5 className="font-medium text-[#FF5AF7] mb-2">Client-Side Components</h5>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li className="flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-[#50E3C2] mr-2"></span>
                        WebAssembly cryptographic module
                      </li>
                      <li className="flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-[#50E3C2] mr-2"></span>
                        Secure key encapsulation
                      </li>
                      <li className="flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-[#50E3C2] mr-2"></span>
                        Hardware wallet integration
                      </li>
                      <li className="flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-[#50E3C2] mr-2"></span>
                        Local parameter verification
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-[#111] rounded-lg p-4 border border-[#333]">
                    <h5 className="font-medium text-[#FF5AF7] mb-2">Blockchain Integration</h5>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li className="flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-[#50E3C2] mr-2"></span>
                        Quantum-resistant transaction signing
                      </li>
                      <li className="flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-[#50E3C2] mr-2"></span>
                        Cross-chain verification protocols
                      </li>
                      <li className="flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-[#50E3C2] mr-2"></span>
                        Smart contract quantum resistance
                      </li>
                      <li className="flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-[#50E3C2] mr-2"></span>
                        Chain-specific adapters
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-[#111] rounded-lg p-4 border border-[#333]">
                    <h5 className="font-medium text-[#FF5AF7] mb-2">Server-Side Components</h5>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li className="flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-[#50E3C2] mr-2"></span>
                        Parameter distribution service
                      </li>
                      <li className="flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-[#50E3C2] mr-2"></span>
                        Cryptographic state monitoring
                      </li>
                      <li className="flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-[#50E3C2] mr-2"></span>
                        Key rotation orchestration
                      </li>
                      <li className="flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-[#50E3C2] mr-2"></span>
                        Quantum threat monitoring
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="flex items-start">
                  <div className="bg-[#111] rounded-full p-2 mr-4 border border-[#333]">
                    <KeySquareIcon className="w-5 h-5 text-[#FF5AF7]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Primary Algorithms</h4>
                    <p className="text-gray-400 text-sm">
                      CRYSTALS-Kyber (key encapsulation) and CRYSTALS-Dilithium (digital signatures), 
                      both NIST Post-Quantum Cryptography standardization finalists.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#111] rounded-full p-2 mr-4 border border-[#333]">
                    <KeySquareIcon className="w-5 h-5 text-[#FF5AF7]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Hybrid Approach</h4>
                    <p className="text-gray-400 text-sm">
                      Implements dual encryption layers using both traditional elliptic curve and 
                      post-quantum algorithms for maximum security during the transition period.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#111] rounded-full p-2 mr-4 border border-[#333]">
                    <KeySquareIcon className="w-5 h-5 text-[#FF5AF7]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Key Rotation System</h4>
                    <p className="text-gray-400 text-sm">
                      Automatic key rotation based on configurable schedule (default: quarterly), 
                      with emergency rotation capability in response to cryptographic vulnerabilities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Security Parameters</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Security Level
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kyber Parameter Set
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dilithium Parameter Set
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estimated Security (Bits)
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recommended Use Case
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Standard</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Kyber-512</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Dilithium-2</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">128</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Personal vaults, moderate value</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Enhanced</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Kyber-768</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Dilithium-3</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">192</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Business vaults, high value</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Maximum</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Kyber-1024</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Dilithium-5</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">256</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Enterprise vaults, critical assets</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Implementation Architecture</h3>
            <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-medium text-center mb-2 text-blue-600">Client-Side Components</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">WebAssembly cryptographic module</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">Secure key encapsulation</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">Hardware wallet integration</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">Local parameter verification</span>
                    </li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-medium text-center mb-2 text-blue-600">Blockchain Integration</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">Quantum-resistant transaction signing</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">Cross-chain verification protocols</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">Smart contract quantum resistance</span>
                    </li>
                    <li className="flex items-center">
                      <AlertCircleIcon className="w-4 h-4 text-amber-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">Chain-specific adapters</span>
                    </li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-medium text-center mb-2 text-blue-600">Server-Side Components</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">Parameter distribution service</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">Cryptographic state monitoring</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">Key rotation orchestration</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">Quantum threat monitoring</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => navigate('/security-tutorials')}>
              View User Tutorials
            </Button>
            <Button 
              className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90"
              onClick={() => navigate('/behavioral-authentication?tab=quantum')}
            >
              Go to Quantum Protection Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Social Recovery Documentation */}
      <div id="social-section" className="mb-16 scroll-mt-16">
        <div className="border-b border-gray-200 pb-4 mb-8">
          <div className="flex items-center">
            <UsersIcon className="w-8 h-8 mr-3 text-emerald-600" />
            <h2 className="text-2xl font-bold">Social Recovery Documentation</h2>
          </div>
          <p className="text-gray-600 mt-2">
            Technical implementation details for our tiered guardian recovery system
          </p>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Recovery Framework</h3>
            <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
              <p className="text-gray-700 mb-4">
                Our Social Recovery system uses a Shamir's Secret Sharing variant with threshold 
                cryptography to distribute recovery authority across a trusted guardian network,
                providing secure asset recovery without single points of failure.
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex items-start">
                  <div className="bg-emerald-100 rounded-full p-2 mr-4">
                    <UsersIcon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Guardian Management</h4>
                    <p className="text-gray-600 text-sm">
                      Supports designation of up to 15 guardians with tiered authority levels,
                      using threshold signatures to authorize recovery procedures.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-emerald-100 rounded-full p-2 mr-4">
                    <UsersIcon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Time-Lock Mechanism</h4>
                    <p className="text-gray-600 text-sm">
                      Recovery requests implement time-locked procedures with configurable waiting periods
                      and escalation paths for emergency access.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-emerald-100 rounded-full p-2 mr-4">
                    <UsersIcon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Multi-Chain Verification</h4>
                    <p className="text-gray-600 text-sm">
                      Guardian verification can occur across supported blockchains (Ethereum, Solana, TON, Bitcoin),
                      providing redundancy and flexibility during recovery.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Guardian Tier System</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Guardian Tier
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Authority Level
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recovery Capabilities
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Minimum Required
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Primary Guardian</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Highest</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      Initiate recovery, approve recovery, override time-locks in emergency situations
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">At least 1</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Verification Guardian</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Medium</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      Approve recovery requests, verify identity, confirm recovery parameters
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">At least 2</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Limited Guardian</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Basic</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      Provide secondary verification, approve specific recovery types or asset thresholds
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Optional</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Recovery Process Flow</h3>
            <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
              <div className="space-y-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-3 bg-white text-lg font-medium text-gray-900">Phase 1: Initiation</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-md font-semibold mb-2">User Actions</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="bg-green-100 text-green-800 font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">1</span>
                        <span className="text-gray-700 text-sm">Initiates recovery from new device with identity verification</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-green-100 text-green-800 font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">2</span>
                        <span className="text-gray-700 text-sm">Provides basic identity confirmation details</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-green-100 text-green-800 font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">3</span>
                        <span className="text-gray-700 text-sm">Selects recovery type and assets to recover</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-md font-semibold mb-2">System Actions</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="bg-blue-100 text-blue-800 font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">1</span>
                        <span className="text-gray-700 text-sm">Verifies initiation against anti-fraud parameters</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-blue-100 text-blue-800 font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">2</span>
                        <span className="text-gray-700 text-sm">Generates recovery request with unique identifier</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-blue-100 text-blue-800 font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">3</span>
                        <span className="text-gray-700 text-sm">Notifies primary guardians of recovery request</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-3 bg-white text-lg font-medium text-gray-900">Phase 2: Guardian Verification</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-md font-semibold mb-2">Guardian Actions</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="bg-green-100 text-green-800 font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">1</span>
                        <span className="text-gray-700 text-sm">Primary guardian confirms recovery initiation</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-green-100 text-green-800 font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">2</span>
                        <span className="text-gray-700 text-sm">Verification guardians approve request through their preferred chain</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-green-100 text-green-800 font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">3</span>
                        <span className="text-gray-700 text-sm">Required threshold of guardians provide signatures</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-md font-semibold mb-2">System Actions</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="bg-blue-100 text-blue-800 font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">1</span>
                        <span className="text-gray-700 text-sm">Validates guardian signatures across all chains</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-blue-100 text-blue-800 font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">2</span>
                        <span className="text-gray-700 text-sm">Initiates time-lock waiting period based on vault configuration</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-blue-100 text-blue-800 font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">3</span>
                        <span className="text-gray-700 text-sm">Sends notification to original account about pending recovery</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-3 bg-white text-lg font-medium text-gray-900">Phase 3: Recovery Completion</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-md font-semibold mb-2">Final Actions</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="bg-green-100 text-green-800 font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">1</span>
                        <span className="text-gray-700 text-sm">Time-lock period completes without cancellation</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-green-100 text-green-800 font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">2</span>
                        <span className="text-gray-700 text-sm">User completes final identity verification</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-green-100 text-green-800 font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">3</span>
                        <span className="text-gray-700 text-sm">New device establishes secure connection to vault</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-md font-semibold mb-2">System Completion</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="bg-blue-100 text-blue-800 font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">1</span>
                        <span className="text-gray-700 text-sm">Reconstructs vault access credentials using guardian signatures</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-blue-100 text-blue-800 font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">2</span>
                        <span className="text-gray-700 text-sm">Grants appropriate access level based on verification strength</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-blue-100 text-blue-800 font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">3</span>
                        <span className="text-gray-700 text-sm">Records recovery in immutable audit log across all supported chains</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => navigate('/security-tutorials')}>
              View User Tutorials
            </Button>
            <Button 
              className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90"
              onClick={() => navigate('/behavioral-authentication?tab=social')}
            >
              Go to Social Recovery Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-10 bg-gradient-to-r from-[#1A1A1A] to-[#111] border border-[#333] rounded-lg p-6 shadow-xl">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-[#FF5AF7] to-[#6B00D7] bg-clip-text text-transparent">Additional Learning Resources</h2>
        <p className="text-gray-400 mt-2">
          Explore our complete library of security tutorials, technical documentation, and interactive guides to get 
          the most out of Chronos Vault's advanced security features.
        </p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#111] p-4 rounded-lg border border-[#333] hover:border-[#FF5AF7] transition-colors">
            <h5 className="font-medium text-[#FF5AF7] mb-2">Video Tutorials</h5>
            <p className="text-gray-400 text-sm mb-3">Visual guides demonstrating security setup and usage</p>
            <Button 
              variant="outline" 
              size="sm"
              className="w-full border-[#333] text-gray-300 hover:bg-[#6B00D7]/10 hover:text-white"
              onClick={() => navigate('/security-tutorials-video')}
            >
              Watch Now
            </Button>
          </div>
          <div className="bg-[#111] p-4 rounded-lg border border-[#333] hover:border-[#FF5AF7] transition-colors">
            <h5 className="font-medium text-[#FF5AF7] mb-2">Step-by-Step Guides</h5>
            <p className="text-gray-400 text-sm mb-3">Detailed instructions for security optimization</p>
            <Button 
              variant="outline" 
              size="sm"
              className="w-full border-[#333] text-gray-300 hover:bg-[#6B00D7]/10 hover:text-white"
              onClick={() => navigate('/security-tutorials')}
            >
              View Guides
            </Button>
          </div>
          <div className="bg-[#111] p-4 rounded-lg border border-[#333] hover:border-[#FF5AF7] transition-colors">
            <h5 className="font-medium text-[#FF5AF7] mb-2">Security Dashboard</h5>
            <p className="text-gray-400 text-sm mb-3">Manage and monitor your vault security settings</p>
            <Button 
              variant="outline" 
              size="sm"
              className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90 text-white border-0"
              onClick={() => navigate('/security-verification')}
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityDocumentation;