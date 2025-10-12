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
            <h3 className="text-xl font-semibold mb-4 text-[#FF5AF7]">Security Parameters</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#333] border border-[#333] rounded-lg">
                <thead className="bg-[#111]">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#FF5AF7] uppercase tracking-wider">
                      Security Level
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#FF5AF7] uppercase tracking-wider">
                      Kyber Parameter Set
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#FF5AF7] uppercase tracking-wider">
                      Dilithium Parameter Set
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#FF5AF7] uppercase tracking-wider">
                      Estimated Security (Bits)
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#FF5AF7] uppercase tracking-wider">
                      Recommended Use Case
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#1A1A1A] divide-y divide-[#333]">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">Standard</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">Kyber-512</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">Dilithium-2</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">128</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">Personal vaults, moderate value</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">Enhanced</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">Kyber-768</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">Dilithium-3</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">192</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">Business vaults, high value</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">Maximum</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">Kyber-1024</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">Dilithium-5</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">256</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">Enterprise vaults, critical assets</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-[#FF5AF7]">Implementation Architecture</h3>
            <div className="bg-[#1A1A1A] shadow rounded-lg p-6 border border-[#333]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border border-[#333] rounded-lg p-4 bg-[#111]">
                  <h4 className="font-medium text-center mb-2 text-[#FF5AF7]">Client-Side Components</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircleIcon className="w-4 h-4 text-[#50E3C2] mr-2 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">WebAssembly cryptographic module</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircleIcon className="w-4 h-4 text-[#50E3C2] mr-2 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">Secure key encapsulation</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircleIcon className="w-4 h-4 text-[#50E3C2] mr-2 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">Hardware wallet integration</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircleIcon className="w-4 h-4 text-[#50E3C2] mr-2 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">Local parameter verification</span>
                    </li>
                  </ul>
                </div>

                <div className="border border-[#333] rounded-lg p-4 bg-[#111]">
                  <h4 className="font-medium text-center mb-2 text-[#FF5AF7]">Blockchain Integration</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircleIcon className="w-4 h-4 text-[#50E3C2] mr-2 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">Quantum-resistant transaction signing</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircleIcon className="w-4 h-4 text-[#50E3C2] mr-2 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">Cross-chain verification protocols</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircleIcon className="w-4 h-4 text-[#50E3C2] mr-2 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">Smart contract quantum resistance</span>
                    </li>
                    <li className="flex items-center">
                      <AlertCircleIcon className="w-4 h-4 text-amber-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">Chain-specific adapters</span>
                    </li>
                  </ul>
                </div>

                <div className="border border-[#333] rounded-lg p-4 bg-[#111]">
                  <h4 className="font-medium text-center mb-2 text-[#FF5AF7]">Server-Side Components</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircleIcon className="w-4 h-4 text-[#50E3C2] mr-2 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">Parameter distribution service</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircleIcon className="w-4 h-4 text-[#50E3C2] mr-2 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">Cryptographic state monitoring</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircleIcon className="w-4 h-4 text-[#50E3C2] mr-2 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">Key rotation orchestration</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircleIcon className="w-4 h-4 text-[#50E3C2] mr-2 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">Quantum threat monitoring</span>
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
        <div className="border-b border-[#333] pb-4 mb-8">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-[#111] border border-[#333]">
              <UsersIcon className="w-6 h-6 text-[#FF5AF7]" />
            </div>
            <h2 className="text-2xl font-bold ml-3 bg-gradient-to-r from-white via-[#FF5AF7] to-[#6B00D7] bg-clip-text text-transparent">Social Recovery Documentation</h2>
          </div>
          <p className="text-gray-400 mt-2">
            Technical implementation details for our tiered guardian recovery system
          </p>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Recovery Framework</h3>
            <div className="bg-gradient-to-r from-[#1A1A1A] to-[#111] shadow-xl rounded-lg p-6 border border-[#333]">
              <p className="text-gray-300 mb-4">
                Our Social Recovery system uses a Shamir's Secret Sharing variant with threshold 
                cryptography to distribute recovery authority across a trusted guardian network,
                providing secure asset recovery without single points of failure.
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex items-start">
                  <div className="bg-[#111] rounded-full p-2 mr-4 border border-[#333]">
                    <UsersIcon className="w-5 h-5 text-[#FF5AF7]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Guardian Management</h4>
                    <p className="text-gray-400 text-sm">
                      Supports designation of up to 15 guardians with tiered authority levels,
                      using threshold signatures to authorize recovery procedures.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#111] rounded-full p-2 mr-4 border border-[#333]">
                    <UsersIcon className="w-5 h-5 text-[#FF5AF7]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Time-Lock Mechanism</h4>
                    <p className="text-gray-400 text-sm">
                      Recovery requests implement time-locked procedures with configurable waiting periods
                      and escalation paths for emergency access.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#111] rounded-full p-2 mr-4 border border-[#333]">
                    <UsersIcon className="w-5 h-5 text-[#FF5AF7]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Multi-Chain Verification</h4>
                    <p className="text-gray-400 text-sm">
                      Guardian verification can occur across supported blockchains (Ethereum, Solana, TON, Bitcoin),
                      providing redundancy and flexibility during recovery.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Guardian Tier System</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#333] border border-[#333] rounded-lg">
                <thead className="bg-[#111]">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#FF5AF7] uppercase tracking-wider">
                      Guardian Tier
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#FF5AF7] uppercase tracking-wider">
                      Authority Level
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#FF5AF7] uppercase tracking-wider">
                      Recovery Capabilities
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#FF5AF7] uppercase tracking-wider">
                      Minimum Required
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#1A1A1A] divide-y divide-[#333]">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">Primary Guardian</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">Highest</td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      Initiate recovery, approve recovery, override time-locks in emergency situations
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">At least 1</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">Verification Guardian</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">Medium</td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      Approve recovery requests, verify identity, confirm recovery parameters
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">At least 2</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">Limited Guardian</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">Basic</td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      Provide secondary verification, approve specific recovery types or asset thresholds
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">Optional</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Recovery Process Flow</h3>
            <div className="bg-gradient-to-r from-[#1A1A1A] to-[#111] shadow-xl rounded-lg p-6 border border-[#333]">
              <div className="space-y-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-[#333]"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-3 bg-[#111] text-lg font-medium text-[#FF5AF7] border border-[#333] rounded-full">Phase 1: Initiation</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-md font-semibold mb-2 text-white">User Actions</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="bg-[#111] text-[#50E3C2] font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 border border-[#333]">1</span>
                        <span className="text-gray-300 text-sm">Initiates recovery from new device with identity verification</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-[#111] text-[#50E3C2] font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 border border-[#333]">2</span>
                        <span className="text-gray-300 text-sm">Provides basic identity confirmation details</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-[#111] text-[#50E3C2] font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 border border-[#333]">3</span>
                        <span className="text-gray-300 text-sm">Selects recovery type and assets to recover</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-md font-semibold mb-2 text-white">System Actions</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="bg-[#111] text-[#FF5AF7] font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 border border-[#333]">1</span>
                        <span className="text-gray-300 text-sm">Verifies initiation against anti-fraud parameters</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-[#111] text-[#FF5AF7] font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 border border-[#333]">2</span>
                        <span className="text-gray-300 text-sm">Generates recovery request with unique identifier</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-[#111] text-[#FF5AF7] font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 border border-[#333]">3</span>
                        <span className="text-gray-300 text-sm">Notifies primary guardians of recovery request</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-[#333]"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-3 bg-[#111] text-lg font-medium text-[#FF5AF7] border border-[#333] rounded-full">Phase 2: Guardian Verification</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-md font-semibold mb-2 text-white">Guardian Actions</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="bg-[#111] text-[#50E3C2] font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 border border-[#333]">1</span>
                        <span className="text-gray-300 text-sm">Primary guardian confirms recovery initiation</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-[#111] text-[#50E3C2] font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 border border-[#333]">2</span>
                        <span className="text-gray-300 text-sm">Verification guardians approve request through their preferred chain</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-[#111] text-[#50E3C2] font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 border border-[#333]">3</span>
                        <span className="text-gray-300 text-sm">Required threshold of guardians provide signatures</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-md font-semibold mb-2 text-white">System Actions</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="bg-[#111] text-[#FF5AF7] font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 border border-[#333]">1</span>
                        <span className="text-gray-300 text-sm">Validates guardian signatures across all chains</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-[#111] text-[#FF5AF7] font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 border border-[#333]">2</span>
                        <span className="text-gray-300 text-sm">Initiates time-lock waiting period based on vault configuration</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-[#111] text-[#FF5AF7] font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 border border-[#333]">3</span>
                        <span className="text-gray-300 text-sm">Sends notification to original account about pending recovery</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-[#333]"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-3 bg-[#111] text-lg font-medium text-[#FF5AF7] border border-[#333] rounded-full">Phase 3: Recovery Completion</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-md font-semibold mb-2 text-white">Final Actions</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="bg-[#111] text-[#50E3C2] font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 border border-[#333]">1</span>
                        <span className="text-gray-300 text-sm">Time-lock period completes without cancellation</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-[#111] text-[#50E3C2] font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 border border-[#333]">2</span>
                        <span className="text-gray-300 text-sm">User completes final identity verification</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-[#111] text-[#50E3C2] font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 border border-[#333]">3</span>
                        <span className="text-gray-300 text-sm">New device establishes secure connection to vault</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-md font-semibold mb-2 text-white">System Completion</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="bg-[#111] text-[#FF5AF7] font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 border border-[#333]">1</span>
                        <span className="text-gray-300 text-sm">Reconstructs vault access credentials using guardian signatures</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-[#111] text-[#FF5AF7] font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 border border-[#333]">2</span>
                        <span className="text-gray-300 text-sm">Grants appropriate access level based on verification strength</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-[#111] text-[#FF5AF7] font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 border border-[#333]">3</span>
                        <span className="text-gray-300 text-sm">Records recovery in immutable audit log across all supported chains</span>
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

      {/* VDF Time-Lock Documentation */}
      <div id="vdf-section" className="mb-16 scroll-mt-16">
        <div className="border-b border-[#333] pb-4 mb-8">
          <div className="flex items-center">
            <KeySquareIcon className="w-8 h-8 mr-3 text-[#FF5AF7]" />
            <h2 className="text-2xl font-bold text-white">VDF Time-Lock System Documentation</h2>
          </div>
          <p className="text-gray-400 mt-2">
            Mathematically provable time-locks using Verifiable Delay Functions (Wesolowski VDF)
          </p>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-[#FF5AF7]">What is VDF Time-Lock?</h3>
            <div className="bg-[#1A1A1A] shadow-lg rounded-lg p-6 border border-[#333]">
              <p className="text-gray-300 mb-4">
                A <span className="text-[#50E3C2] font-semibold">Verifiable Delay Function (VDF)</span> creates cryptographic time-locks that 
                are <span className="text-[#50E3C2] font-semibold">mathematically impossible to bypass</span> - even by the vault creator. 
                The system requires <span className="text-[#50E3C2] font-semibold">actual sequential computation time</span>, which cannot be parallelized.
              </p>

              <div className="bg-[#0D0D0D] p-4 rounded-lg border border-[#444] overflow-x-auto mt-4">
                <pre className="text-[#50E3C2] text-sm">
{`// VDF Time-Lock System (Production Code)
// From: server/security/vdf-time-lock.ts

async createTimeLock(
  vaultId: string,
  unlockTime: number,
  config: TimeLockConfig = {
    securityLevel: 'high',
    estimatedUnlockTime: 3600,
    allowEarlyVerification: false
  }
): Promise<VDFTimeLock> {
  console.log(\`⏰ Creating VDF time-lock for vault \${vaultId}\`);
  console.log(\`   Unlock time: \${new Date(unlockTime * 1000).toISOString()}\`);
  console.log(\`   Security level: \${config.securityLevel}\`);

  const now = Math.floor(Date.now() / 1000);
  const delaySeconds = Math.max(0, unlockTime - now);

  // Calculate required iterations based on delay
  const baseIterations = this.SECURITY_ITERATIONS[config.securityLevel];
  const timeBasedIterations = BigInt(delaySeconds * this.ITERATIONS_PER_SECOND);
  const iterations = baseIterations + timeBasedIterations;

  // Generate RSA modulus for VDF group
  const { modulus, challenge } = await this.generateVDFParameters(vaultId);

  const timeLock: VDFTimeLock = {
    lockId: \`vdf-\${vaultId}-\${Date.now()}\`,
    vaultId,
    unlockTime,
    createdAt: now,
    iterations,
    modulus,
    challenge,
    isUnlocked: false
  };

  this.timeLocks.set(timeLock.lockId, timeLock);

  console.log(\`✅ Time-lock created: \${timeLock.lockId}\`);
  console.log(\`   - Required iterations: \${iterations.toLocaleString()}\`);
  console.log(\`   - Estimated compute time: \${(Number(iterations) / this.ITERATIONS_PER_SECOND).toFixed(1)}s\`);
  console.log(\`   - Mathematical guarantee: Cannot be bypassed\`);

  return timeLock;
}`}
                </pre>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-[#FF5AF7]">Mathematical Guarantee</h3>
            <div className="bg-[#1A1A1A] shadow-lg rounded-lg p-6 border border-[#333]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#111] p-4 rounded-lg border border-[#333]">
                  <h4 className="font-medium text-[#FF5AF7] mb-2">Sequential Squaring</h4>
                  <p className="text-gray-400 text-sm">
                    VDF computes: <code className="text-[#50E3C2]">output = challenge^(2^iterations) mod modulus</code>
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    This requires <span className="text-[#50E3C2] font-semibold">sequential computation</span> - cannot be parallelized.
                  </p>
                </div>
                
                <div className="bg-[#111] p-4 rounded-lg border border-[#333]">
                  <h4 className="font-medium text-[#FF5AF7] mb-2">Fast Verification</h4>
                  <p className="text-gray-400 text-sm">
                    Verification: <code className="text-[#50E3C2]">O(log T)</code> vs Computation: <code className="text-[#50E3C2]">O(T)</code>
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Anyone can verify the proof quickly without recomputing the entire VDF.
                  </p>
                </div>
                
                <div className="bg-[#111] p-4 rounded-lg border border-[#333]">
                  <h4 className="font-medium text-[#FF5AF7] mb-2">RSA-2048 Security</h4>
                  <p className="text-gray-400 text-sm">
                    Uses RSA-2048 groups for sequential squaring operation.
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Same security level as <span className="text-[#50E3C2] font-semibold">Chia Network and Ethereum</span> VDF implementations.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 bg-[#111] p-4 rounded-lg border border-[#333]">
                <h4 className="font-medium text-white mb-2">Security Levels</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><span className="text-[#50E3C2] font-semibold">Standard:</span> 1M iterations (~1 second compute time)</li>
                  <li><span className="text-[#50E3C2] font-semibold">High:</span> 10M iterations (~10 seconds compute time)</li>
                  <li><span className="text-[#50E3C2] font-semibold">Maximum:</span> 100M iterations (~100 seconds compute time)</li>
                  <li className="text-[#FF5AF7]">Plus time-based iterations: 1M per second of delay</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-[#FF5AF7]">Use Cases</h3>
            <div className="bg-[#1A1A1A] shadow-lg rounded-lg p-6 border border-[#333]">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-[#111] rounded-full p-2 mr-4 border border-[#333]">
                    <ShieldCheckIcon className="w-5 h-5 text-[#FF5AF7]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Time-Delayed Transactions</h4>
                    <p className="text-gray-400 text-sm">
                      Lock funds with guaranteed release after specified time. Perfect for wills, vesting schedules, and time-based contracts.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#111] rounded-full p-2 mr-4 border border-[#333]">
                    <ShieldCheckIcon className="w-5 h-5 text-[#FF5AF7]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Emergency Cooldown</h4>
                    <p className="text-gray-400 text-sm">
                      Add mandatory waiting periods for sensitive operations. Cannot be bypassed even if private keys are compromised.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#111] rounded-full p-2 mr-4 border border-[#333]">
                    <ShieldCheckIcon className="w-5 h-5 text-[#FF5AF7]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Fair Exchange Protocols</h4>
                    <p className="text-gray-400 text-sm">
                      Create trustless escrow with time-based guarantees. Funds release only after provable time delay.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ZK Proof System Documentation */}
      <div id="zk-section" className="mb-16 scroll-mt-16">
        <div className="border-b border-[#333] pb-4 mb-8">
          <div className="flex items-center">
            <ShieldCheckIcon className="w-8 h-8 mr-3 text-[#FF5AF7]" />
            <h2 className="text-2xl font-bold text-white">Zero-Knowledge Proof System Documentation</h2>
          </div>
          <p className="text-gray-400 mt-2">
            Privacy-preserving verification using Pedersen Commitments and Range Proofs
          </p>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-[#FF5AF7]">What are Zero-Knowledge Proofs?</h3>
            <div className="bg-[#1A1A1A] shadow-lg rounded-lg p-6 border border-[#333]">
              <p className="text-gray-300 mb-4">
                Zero-Knowledge Proofs allow you to <span className="text-[#50E3C2] font-semibold">prove a statement is true without revealing any information</span> beyond the validity of the statement itself. Perfect for privacy-preserving vault verification.
              </p>

              <div className="bg-[#0D0D0D] p-4 rounded-lg border border-[#444] overflow-x-auto mt-4">
                <pre className="text-[#50E3C2] text-sm">
{`// Zero-Knowledge Proof System (Production Code)
// From: server/security/zk-proof-system.ts

async generateVaultExistenceProof(
  vaultId: string,
  vaultData: any,
  revealFields: string[] = []
): Promise<VaultStateProof> {
  const stateHash = this.computeStateCommitment(vaultData);
  
  const publicInputs = [
    vaultId,
    stateHash,
    ...revealFields.map(field => vaultData[field]?.toString() || '')
  ];
  
  const proof = await this.generateProof(
    ProofType.VAULT_EXISTENCE,
    {
      vaultId,
      vaultData,
      revealFields
    },
    publicInputs
  );
  
  return {
    vaultId,
    stateHash,
    proof,
    verified: true
  };
}

// Verify proof without revealing vault contents
async verifyVaultExistenceProof(proof: VaultStateProof): Promise<boolean> {
  const verified = await this.verifyProof(proof.proof);
  return verified;  // Verifier learns NOTHING beyond validity
}`}
                </pre>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-[#FF5AF7]">Privacy Guarantees</h3>
            <div className="bg-[#1A1A1A] shadow-lg rounded-lg p-6 border border-[#333]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#111] p-4 rounded-lg border border-[#333]">
                  <h4 className="font-medium text-[#FF5AF7] mb-2">Zero Information Leakage</h4>
                  <p className="text-gray-400 text-sm">
                    Verifier learns <span className="text-[#50E3C2] font-semibold">nothing beyond validity</span> - vault contents, balances, and ownership remain private.
                  </p>
                </div>
                
                <div className="bg-[#111] p-4 rounded-lg border border-[#333]">
                  <h4 className="font-medium text-[#FF5AF7] mb-2">Pedersen Commitments</h4>
                  <p className="text-gray-400 text-sm">
                    Cryptographic commitments that are <span className="text-[#50E3C2] font-semibold">binding and hiding</span> - impossible to forge or reverse.
                  </p>
                </div>
                
                <div className="bg-[#111] p-4 rounded-lg border border-[#333]">
                  <h4 className="font-medium text-[#FF5AF7] mb-2">Range Proofs</h4>
                  <p className="text-gray-400 text-sm">
                    Prove balance is within range <span className="text-[#50E3C2] font-semibold">without revealing exact amount</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GitHub Source Code Links */}
      <div className="mt-10 bg-gradient-to-r from-[#1A1A1A] to-[#111] border border-[#333] rounded-lg p-6 shadow-xl">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-[#FF5AF7] to-[#6B00D7] bg-clip-text text-transparent mb-4">
          Explore Open Source Code on GitHub
        </h2>
        <p className="text-gray-400 mb-6">
          All code examples on this page are from our <span className="text-[#50E3C2] font-semibold">production-ready open-source repositories</span>. 
          View complete implementations with tests, documentation, and smart contracts.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a 
            href="https://github.com/Chronos-Vault/chronos-vault-security" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#111] p-4 rounded-lg border border-[#333] hover:border-[#FF5AF7] transition-colors group"
            data-testid="link-vdf-repo"
          >
            <div className="flex items-center gap-3 mb-2">
              <KeySquareIcon className="h-5 w-5 text-[#FF5AF7]" />
              <h3 className="text-lg font-semibold text-white group-hover:text-[#FF5AF7] transition-colors">VDF Time-Lock System</h3>
            </div>
            <p className="text-sm text-gray-400">Wesolowski VDF implementation with provable delays</p>
            <p className="text-xs text-gray-500 mt-2">server/security/vdf-time-lock.ts</p>
          </a>
          
          <a 
            href="https://github.com/Chronos-Vault/chronos-vault-security" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#111] p-4 rounded-lg border border-[#333] hover:border-[#FF5AF7] transition-colors group"
            data-testid="link-quantum-repo"
          >
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheckIcon className="h-5 w-5 text-[#FF5AF7]" />
              <h3 className="text-lg font-semibold text-white group-hover:text-[#FF5AF7] transition-colors">Quantum-Resistant Crypto</h3>
            </div>
            <p className="text-sm text-gray-400">ML-KEM-1024, Dilithium-5, hybrid encryption</p>
            <p className="text-xs text-gray-500 mt-2">server/security/quantum-resistant-crypto.ts</p>
          </a>
          
          <a 
            href="https://github.com/Chronos-Vault/chronos-vault-security" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#111] p-4 rounded-lg border border-[#333] hover:border-[#FF5AF7] transition-colors group"
            data-testid="link-mpc-repo"
          >
            <div className="flex items-center gap-3 mb-2">
              <UsersIcon className="h-5 w-5 text-[#FF5AF7]" />
              <h3 className="text-lg font-semibold text-white group-hover:text-[#FF5AF7] transition-colors">MPC Key Management</h3>
            </div>
            <p className="text-sm text-gray-400">Shamir Secret Sharing, 3-of-5 threshold signatures</p>
            <p className="text-xs text-gray-500 mt-2">server/security/mpc-key-management.ts</p>
          </a>
          
          <a 
            href="https://github.com/Chronos-Vault/chronos-vault-security" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#111] p-4 rounded-lg border border-[#333] hover:border-[#FF5AF7] transition-colors group"
            data-testid="link-zk-repo"
          >
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheckIcon className="h-5 w-5 text-[#FF5AF7]" />
              <h3 className="text-lg font-semibold text-white group-hover:text-[#FF5AF7] transition-colors">Zero-Knowledge Proofs</h3>
            </div>
            <p className="text-sm text-gray-400">Pedersen Commitments, Range Proofs, privacy-preserving verification</p>
            <p className="text-xs text-gray-500 mt-2">server/security/zk-proof-system.ts</p>
          </a>
          
          <a 
            href="https://github.com/Chronos-Vault/formal-proofs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#111] p-4 rounded-lg border border-[#333] hover:border-[#FF5AF7] transition-colors group"
            data-testid="link-formal-proofs-repo"
          >
            <div className="flex items-center gap-3 mb-2">
              <CheckCircleIcon className="h-5 w-5 text-[#FF5AF7]" />
              <h3 className="text-lg font-semibold text-white group-hover:text-[#FF5AF7] transition-colors">Formal Verification</h3>
            </div>
            <p className="text-sm text-gray-400">35/35 theorems proven in Lean 4 ✅</p>
            <p className="text-xs text-gray-500 mt-2">formal-proofs/VDF/TimeLock.lean</p>
          </a>
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