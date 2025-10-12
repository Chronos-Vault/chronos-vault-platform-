import React from 'react';
import { Container } from '@/components/ui/container';
import { PageHeader } from '@/components/page-header';
import { Helmet } from 'react-helmet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Key, 
  Code, 
  Network, 
  Fingerprint, 
  HardDrive, 
  MapPin, 
  Brush,
  Lock,
  BrainCircuit,
  Webhook
} from "lucide-react";

export default function TechnicalSpecification() {
  return (
    <>
      <Helmet>
        <title>Technical Specification | ChronosVault</title>
        <meta 
          name="description" 
          content="Detailed technical specification of the Chronos Vault system architecture, security protocols, and integration capabilities." 
        />
      </Helmet>
      
      <Container className="py-12 md:py-16">
        <PageHeader 
          heading="Technical Specification" 
          description="Comprehensive documentation of Chronos Vault's architecture and technology stack" 
          separator
        />
        
        <div className="max-w-5xl mx-auto mt-12">
          <Tabs defaultValue="architecture" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-[#1A1A1A] border border-[#333]">
                <TabsTrigger value="architecture">Architecture</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="integrations">Integrations</TabsTrigger>
                <TabsTrigger value="innovations">Innovations</TabsTrigger>
              </TabsList>
            </div>
            
            {/* ARCHITECTURE TAB */}
            <TabsContent value="architecture" className="mt-0">
              <div className="space-y-8">
                <div className="bg-gradient-to-br from-[#1D1D1D]/95 to-[#151515]/95 p-6 rounded-lg border border-[#333]">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Code className="h-5 w-5 text-[#FF5AF7]" />
                    <span>Core Architecture</span>
                  </h3>
                  
                  <p className="text-gray-300 mb-6">
                    Chronos Vault implements a revolutionary multi-chain architecture that distributes security,
                    functionality, and data across multiple blockchains to create a robust, fault-tolerant
                    system with unprecedented security guarantees.
                  </p>
                  
                  <div className="bg-[#0F0F0F] border border-[#222] rounded-lg p-4 mb-6">
                    <h4 className="text-md font-semibold text-white mb-2">ERC-4626 Tokenized Vault Standard</h4>
                    <p className="text-sm text-gray-400">
                      Our vault implementation extends the ERC-4626 standard to create a tokenized representation of locked assets.
                      This provides composability with the broader DeFi ecosystem while adding our proprietary time-lock mechanisms.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#0F0F0F] border border-[#222] rounded-lg p-4">
                      <h4 className="text-md font-semibold text-white mb-2">Client Layer</h4>
                      <ul className="text-sm text-gray-400 space-y-2">
                        <li>• React.js with TypeScript frontend</li>
                        <li>• Web3.js for blockchain interactions</li>
                        <li>• Multi-wallet connector support</li>
                        <li>• Responsive UI with Tailwind CSS</li>
                      </ul>
                    </div>
                    
                    <div className="bg-[#0F0F0F] border border-[#222] rounded-lg p-4">
                      <h4 className="text-md font-semibold text-white mb-2">Server Layer</h4>
                      <ul className="text-sm text-gray-400 space-y-2">
                        <li>• Node.js with Express backend</li>
                        <li>• PostgreSQL database for metadata</li>
                        <li>• Cross-chain validator network</li>
                        <li>• Proof-of-Authority consensus</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#151515] p-6 rounded-lg border border-[#333]">
                  <h3 className="text-xl font-bold mb-6">Blockchain Implementation</h3>
                  
                  <Accordion type="single" collapsible className="w-full space-y-4">
                    <AccordionItem value="ethereum" className="border border-[#333] rounded-lg px-4">
                      <AccordionTrigger className="py-4 text-md font-semibold hover:no-underline">
                        Ethereum Layer 2 (Arbitrum) Implementation
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-300 pt-0 pb-4">
                        <div className="space-y-4">
                          <p>
                            Ethereum Layer 2 (Arbitrum) serves as the Primary Security layer in Trinity Protocol, maintaining vault ownership records with maximum decentralization while reducing fees by 95% through Arbitrum Layer 2 deployment.
                          </p>
                          
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Smart Contracts</h4>
                            <div className="bg-[#0F0F0F] rounded p-3 text-xs text-gray-400 font-mono overflow-x-auto">
                              <p>// ChronosVault.sol (simplified)</p>
                              <p>contract ChronosVault is ERC4626, Ownable {`{`}</p>
                              <p>&nbsp;&nbsp;mapping(uint256 =&gt; VaultData) public vaults;</p>
                              <p>&nbsp;&nbsp;struct VaultData {`{`}</p>
                              <p>&nbsp;&nbsp;&nbsp;&nbsp;address owner;</p>
                              <p>&nbsp;&nbsp;&nbsp;&nbsp;uint256 unlockTime;</p>
                              <p>&nbsp;&nbsp;&nbsp;&nbsp;bytes32 securityHash;</p>
                              <p>&nbsp;&nbsp;&nbsp;&nbsp;bool isMultiSig;</p>
                              <p>&nbsp;&nbsp;&nbsp;&nbsp;address[] beneficiaries;</p>
                              <p>&nbsp;&nbsp;{"}"}</p>
                              <p>{"}"}</p>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="ton" className="border border-[#333] rounded-lg px-4">
                      <AccordionTrigger className="py-4 text-md font-semibold hover:no-underline">
                        TON Implementation
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-300 pt-0 pb-4">
                        <div className="space-y-4">
                          <p>
                            The TON layer provides high-speed recovery and authentication mechanisms, enabling rapid security operations and user authentication.
                          </p>
                          
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Smart Contracts</h4>
                            <div className="bg-[#0F0F0F] rounded p-3 text-xs text-gray-400 font-mono overflow-x-auto">
                              <p>// TON FunC contract (simplified)</p>
                              <p>() recv_internal(int msg_value, cell in_msg, slice in_msg_body) {`{`}</p>
                              <p>&nbsp;&nbsp;slice cs = in_msg_body;</p>
                              <p>&nbsp;&nbsp;int op = cs~load_uint(32);</p>
                              <p>&nbsp;&nbsp;if (op == op::authenticate) {`{`}</p>
                              <p>&nbsp;&nbsp;&nbsp;&nbsp;int vault_id = cs~load_uint(64);</p>
                              <p>&nbsp;&nbsp;&nbsp;&nbsp;slice signature = cs~load_bits(512);</p>
                              <p>&nbsp;&nbsp;&nbsp;&nbsp;// Verify signature and emit event</p>
                              <p>&nbsp;&nbsp;{`}`}</p>
                              <p>{`}`}</p>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="solana" className="border border-[#333] rounded-lg px-4">
                      <AccordionTrigger className="py-4 text-md font-semibold hover:no-underline">
                        Solana Implementation
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-300 pt-0 pb-4">
                        <div className="space-y-4">
                          <p>
                            Solana serves as the Rapid Validation layer in Trinity Protocol, providing high-frequency monitoring and state verification. Its high-throughput capabilities enable real-time security monitoring across vault operations.
                          </p>
                          
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Program Code</h4>
                            <div className="bg-[#0F0F0F] rounded p-3 text-xs text-gray-400 font-mono overflow-x-auto">
                              <p>// Rust program (simplified)</p>
                              <p>pub fn process_instruction(</p>
                              <p>&nbsp;&nbsp;program_id: &amp;Pubkey,</p>
                              <p>&nbsp;&nbsp;accounts: &amp;[AccountInfo],</p>
                              <p>&nbsp;&nbsp;instruction_data: &amp;[u8],</p>
                              <p>) -&gt; ProgramResult {`{`}</p>
                              <p>&nbsp;&nbsp;match instruction_data[0] {`{`}</p>
                              <p>&nbsp;&nbsp;&nbsp;&nbsp;0 =&gt; monitor_vault_status(accounts),</p>
                              <p>&nbsp;&nbsp;&nbsp;&nbsp;1 =&gt; verify_cross_chain_tx(accounts, &amp;instruction_data[1..]),</p>
                              <p>&nbsp;&nbsp;&nbsp;&nbsp;_ =&gt; Err(ProgramError::InvalidInstructionData),</p>
                              <p>&nbsp;&nbsp;{`}`}</p>
                              <p>{`}`}</p>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
                
                <div className="bg-gradient-to-br from-[#1D1D1D]/95 to-[#151515]/95 p-6 rounded-lg border border-[#333]">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Network className="h-5 w-5 text-[#FF5AF7]" />
                    <span>Cross-Chain Communication</span>
                  </h3>
                  
                  <p className="text-gray-300 mb-6">
                    Chronos Vault implements a secure cross-chain communication protocol that enables atomic operations
                    across multiple blockchains while preserving security and data integrity.
                  </p>
                  
                  <div className="bg-[#0F0F0F] border border-[#222] rounded-lg p-4 mb-6">
                    <h4 className="text-md font-semibold text-white mb-2">Validator Network</h4>
                    <p className="text-sm text-gray-400">
                      A distributed network of validators monitors events across all supported blockchains and facilitates
                      cross-chain operations using a threshold signature scheme. At least 2/3 of validators must sign off
                      on any cross-chain transaction.
                    </p>
                  </div>
                  
                  <div className="bg-[#0F0F0F] border border-[#222] rounded-lg p-4">
                    <h4 className="text-md font-semibold text-white mb-2">Trinity Protocol Bridge</h4>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-[#171717] rounded p-2 border border-[#6B00D7]/30">
                        <p className="text-xs font-semibold text-purple-400">Ethereum Layer 2 (Arbitrum)</p>
                        <p className="text-[10px] text-gray-500">Primary Security</p>
                      </div>
                      <div className="py-1 flex justify-center items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                      </div>
                      <div className="bg-[#171717] rounded p-2 border border-[#6B00D7]/30">
                        <p className="text-xs font-semibold text-purple-400">Solana</p>
                        <p className="text-[10px] text-gray-500">Rapid Validation</p>
                      </div>
                      <div className="py-1 flex justify-center items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#FF5AF7]"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                      </div>
                      <div className="bg-[#171717] rounded p-2 border border-[#6B00D7]/30">
                        <p className="text-xs font-semibold text-purple-400">TON</p>
                        <p className="text-[10px] text-gray-500">Recovery System</p>
                      </div>
                      <div className="py-1 flex justify-center items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#FF5AF7]"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* SECURITY TAB */}
            <TabsContent value="security" className="mt-0">
              <div className="space-y-8">
                <div className="bg-gradient-to-br from-[#1D1D1D]/95 to-[#151515]/95 p-6 rounded-lg border border-[#333]">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-[#FF5AF7]" />
                    <span>Triple-Chain Security Protocol</span>
                  </h3>
                  
                  <p className="text-gray-300 mb-6">
                    Our Triple-Chain Security Protocol distributes security responsibilities across three blockchain networks,
                    creating a system that remains secure even if one or two chains are compromised.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#0F0F0F] border border-[#222] rounded-lg p-4">
                      <h4 className="text-md font-semibold text-white mb-2">Ethereum Layer 2 (Arbitrum)</h4>
                      <ul className="text-sm text-gray-400 space-y-2">
                        <li>• Ownership records</li>
                        <li>• Access control rules</li>
                        <li>• Transaction history</li>
                        <li>• Smart contract security</li>
                      </ul>
                    </div>
                    
                    <div className="bg-[#0F0F0F] border border-[#222] rounded-lg p-4">
                      <h4 className="text-md font-semibold text-white mb-2">TON Layer</h4>
                      <ul className="text-sm text-gray-400 space-y-2">
                        <li>• Recovery mechanisms</li>
                        <li>• Authentication</li>
                        <li>• Beneficiary management</li>
                        <li>• Emergency controls</li>
                      </ul>
                    </div>
                    
                    <div className="bg-[#0F0F0F] border border-[#222] rounded-lg p-4">
                      <h4 className="text-md font-semibold text-white mb-2">Solana Layer</h4>
                      <ul className="text-sm text-gray-400 space-y-2">
                        <li>• High-frequency monitoring</li>
                        <li>• Anomaly detection</li>
                        <li>• Security oracles</li>
                        <li>• Activity logs</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#151515] p-6 rounded-lg border border-[#333]">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Fingerprint className="h-5 w-5 text-[#FF5AF7]" />
                    <span>Zero-Knowledge Privacy Layer</span>
                  </h3>
                  
                  <p className="text-gray-300 mb-6">
                    Chronos Vault implements ZK-SNARKs (Zero-Knowledge Succinct Non-Interactive Arguments of Knowledge)
                    to prove vault status and ownership without revealing private contents or sensitive information.
                  </p>
                  
                  <div className="bg-[#0F0F0F] border border-[#222] rounded-lg p-4 mb-6">
                    <h4 className="text-md font-semibold text-white mb-2">Privacy Features</h4>
                    <ul className="text-sm text-gray-400 space-y-2">
                      <li>• Hidden vault contents with selective disclosure</li>
                      <li>• Shielded transactions for sensitive operations</li>
                      <li>• Privacy-preserving authentication</li>
                      <li>• Stealth addresses for enhanced security</li>
                    </ul>
                  </div>
                  
                  <div className="bg-[#0F0F0F] border border-[#222] rounded-lg p-4">
                    <h4 className="text-md font-semibold text-white mb-2">ZK Circuit Overview</h4>
                    <div className="text-sm text-gray-400">
                      <p className="mb-2">Our ZK system implements the following functions:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-[#171717] p-2 rounded">
                          <span className="text-xs font-semibold text-purple-400">ownershipVerifier</span>
                          <p className="text-[10px] text-gray-500">Proves ownership without revealing private keys</p>
                        </div>
                        <div className="bg-[#171717] p-2 rounded">
                          <span className="text-xs font-semibold text-blue-400">contentExistenceProof</span>
                          <p className="text-[10px] text-gray-500">Proves existence of specific content without revealing it</p>
                        </div>
                        <div className="bg-[#171717] p-2 rounded">
                          <span className="text-xs font-semibold text-green-400">timeVerifier</span>
                          <p className="text-[10px] text-gray-500">Proves time conditions without revealing exact parameters</p>
                        </div>
                        <div className="bg-[#171717] p-2 rounded">
                          <span className="text-xs font-semibold text-red-400">conditionProver</span>
                          <p className="text-[10px] text-gray-500">Proves complex unlock conditions satisfaction</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-[#1D1D1D]/95 to-[#151515]/95 p-6 rounded-lg border border-[#333]">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <BrainCircuit className="h-5 w-5 text-[#FF5AF7]" />
                    <span>AI-Enhanced Security Monitoring</span>
                  </h3>
                  
                  <p className="text-gray-300 mb-6">
                    Our security system leverages machine learning models to monitor vault activities, detect anomalies,
                    and prevent unauthorized access attempts through behavior analysis.
                  </p>
                  
                  <div className="bg-[#0F0F0F] border border-[#222] rounded-lg p-4">
                    <h4 className="text-md font-semibold text-white mb-2">AI Security Features</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-[#171717] p-3 rounded">
                        <h5 className="text-sm font-medium text-[#FF5AF7] mb-1">Behavioral Analysis</h5>
                        <p className="text-xs text-gray-400">ML models learn normal user patterns and flag unusual activity that may indicate compromise.</p>
                      </div>
                      <div className="bg-[#171717] p-3 rounded">
                        <h5 className="text-sm font-medium text-[#FF5AF7] mb-1">Risk Scoring</h5>
                        <p className="text-xs text-gray-400">Real-time risk assessment for each interaction with vaults based on multiple factors.</p>
                      </div>
                      <div className="bg-[#171717] p-3 rounded">
                        <h5 className="text-sm font-medium text-[#FF5AF7] mb-1">Adaptive Security</h5>
                        <p className="text-xs text-gray-400">Security policies that automatically adjust based on threat intelligence and user behavior.</p>
                      </div>
                      <div className="bg-[#171717] p-3 rounded">
                        <h5 className="text-sm font-medium text-[#FF5AF7] mb-1">Predictive Protection</h5>
                        <p className="text-xs text-gray-400">Anticipates potential security issues based on emerging patterns before they occur.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* INTEGRATIONS TAB */}
            <TabsContent value="integrations" className="mt-0">
              <div className="space-y-8">
                <div className="bg-gradient-to-br from-[#1D1D1D]/95 to-[#151515]/95 p-6 rounded-lg border border-[#333]">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Webhook className="h-5 w-5 text-[#FF5AF7]" />
                    <span>Universal Chain Interoperability</span>
                  </h3>
                  
                  <p className="text-gray-300 mb-6">
                    Our modular adapter system enables Chronos Vault to integrate with any major blockchain through
                    standardized interfaces, making it the universal standard for cross-chain vault operations.
                  </p>
                  
                  <div className="bg-[#0F0F0F] border border-[#222] rounded-lg p-4 mb-6">
                    <h4 className="text-md font-semibold text-white mb-2">Integration Architecture</h4>
                    <div className="text-sm text-gray-400">
                      <p className="mb-4">Each blockchain integration consists of four components:</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-[#171717] p-2 rounded text-center">
                          <p className="text-xs font-semibold text-blue-400 mb-1">Adapter Contract</p>
                          <p className="text-[10px] text-gray-500">On-chain smart contract</p>
                        </div>
                        <div className="bg-[#171717] p-2 rounded text-center">
                          <p className="text-xs font-semibold text-green-400 mb-1">Bridge Module</p>
                          <p className="text-[10px] text-gray-500">Cross-chain messaging</p>
                        </div>
                        <div className="bg-[#171717] p-2 rounded text-center">
                          <p className="text-xs font-semibold text-purple-400 mb-1">Client Library</p>
                          <p className="text-[10px] text-gray-500">Frontend integration</p>
                        </div>
                        <div className="bg-[#171717] p-2 rounded text-center">
                          <p className="text-xs font-semibold text-red-400 mb-1">Validator Support</p>
                          <p className="text-[10px] text-gray-500">Network monitoring</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#0F0F0F] border border-[#222] rounded-lg p-4">
                      <h4 className="text-md font-semibold text-white mb-2">Current Integrations</h4>
                      <ul className="text-sm text-gray-400 space-y-2">
                        <li>• Ethereum (EVM-compatible chains)</li>
                        <li>• TON (The Open Network)</li>
                        <li>• Solana</li>
                        <li>• Polygon</li>
                      </ul>
                    </div>
                    
                    <div className="bg-[#0F0F0F] border border-[#222] rounded-lg p-4">
                      <h4 className="text-md font-semibold text-white mb-2">Planned Integrations</h4>
                      <ul className="text-sm text-gray-400 space-y-2">
                        <li>• Bitcoin (via bridging)</li>
                        <li>• Avalanche</li>
                        <li>• Cosmos ecosystem</li>
                        <li>• Polkadot ecosystem</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#151515] p-6 rounded-lg border border-[#333]">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <HardDrive className="h-5 w-5 text-[#FF5AF7]" />
                    <span>ChronosKey Hardware Integration</span>
                  </h3>
                  
                  <p className="text-gray-300 mb-6">
                    The ChronosKey hardware wallet will provide physical security for Chronos Vault users,
                    with specialized features for vault management and inheritance security.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#0F0F0F] border border-[#222] rounded-lg p-4">
                      <h4 className="text-md font-semibold text-white mb-2">Technical Specifications</h4>
                      <ul className="text-sm text-gray-400 space-y-2">
                        <li>• Secure Element (EAL6+) for key storage</li>
                        <li>• Bluetooth LE and NFC connectivity</li>
                        <li>• OLED display for transaction verification</li>
                        <li>• Biometric authentication (fingerprint)</li>
                        <li>• 5+ year battery life with low-power design</li>
                        <li>• Multiple recovery options</li>
                      </ul>
                    </div>
                    
                    <div className="bg-[#0F0F0F] border border-[#222] rounded-lg p-4">
                      <h4 className="text-md font-semibold text-white mb-2">Vault-Specific Features</h4>
                      <ul className="text-sm text-gray-400 space-y-2">
                        <li>• Physical time-lock override capability</li>
                        <li>• Multi-signature coordination</li>
                        <li>• Inheritance key management</li>
                        <li>• Geo-location verification</li>
                        <li>• Emergency vault access protocols</li>
                        <li>• Offline vault status verification</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-[#1D1D1D]/95 to-[#151515]/95 p-6 rounded-lg border border-[#333]">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-[#FF5AF7]" />
                    <span>GeoVault™ Integration</span>
                  </h3>
                  
                  <p className="text-gray-300 mb-6">
                    The GeoVault™ system adds location-based functionality to Chronos Vault, enabling
                    geo-locked vaults and location-based discovery games through mobile integration.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#0F0F0F] border border-[#222] rounded-lg p-4">
                      <h4 className="text-md font-semibold text-white mb-2">Technical Components</h4>
                      <ul className="text-sm text-gray-400 space-y-2">
                        <li>• GPS and location services integration</li>
                        <li>• Cryptographic location proof system</li>
                        <li>• Decentralized location oracles</li>
                        <li>• Augmented reality SDK</li>
                        <li>• Mobile-optimized vault interfaces</li>
                      </ul>
                    </div>
                    
                    <div className="bg-[#0F0F0F] border border-[#222] rounded-lg p-4">
                      <h4 className="text-md font-semibold text-white mb-2">Use Cases</h4>
                      <ul className="text-sm text-gray-400 space-y-2">
                        <li>• Geo-locked inheritance vaults</li>
                        <li>• Location-based treasure hunts</li>
                        <li>• Geographic access controls</li>
                        <li>• Travel-triggered unlocks</li>
                        <li>• Location-verified smart contracts</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* INNOVATIONS TAB */}
            <TabsContent value="innovations" className="mt-0">
              <div className="space-y-8">
                <div className="bg-gradient-to-br from-[#1D1D1D]/95 to-[#151515]/95 p-6 rounded-lg border border-[#333]">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Brush className="h-5 w-5 text-[#FF5AF7]" />
                    <span>NFT Creator Platform</span>
                  </h3>
                  
                  <p className="text-gray-300 mb-6">
                    Our NFT Creator Platform enables artists and creators to design, mint, and sell unique digital assets
                    with time-lock functionality integrated with Chronos Vault's security infrastructure.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#0F0F0F] border border-[#222] rounded-lg p-4">
                      <h4 className="text-md font-semibold text-white mb-2">Technical Capabilities</h4>
                      <ul className="text-sm text-gray-400 space-y-2">
                        <li>• Multi-chain NFT standards support</li>
                        <li>• No-code smart contract generation</li>
                        <li>• Time-release metadata capabilities</li>
                        <li>• Multi-format media support</li>
                        <li>• Vault-linked NFT templates</li>
                      </ul>
                    </div>
                    
                    <div className="bg-[#0F0F0F] border border-[#222] rounded-lg p-4">
                      <h4 className="text-md font-semibold text-white mb-2">Innovation Highlights</h4>
                      <ul className="text-sm text-gray-400 space-y-2">
                        <li>• Time-evolving NFTs that change over time</li>
                        <li>• Digital gift cards with timed crypto releases</li>
                        <li>• Memory capsule NFTs with scheduled reveals</li>
                        <li>• Cross-chain NFT compatibility</li>
                        <li>• Provenance tracking with timestamping</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#151515] p-6 rounded-lg border border-[#333]">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Lock className="h-5 w-5 text-[#FF5AF7]" />
                    <span>Bitcoin Time-Lock Mechanism</span>
                  </h3>
                  
                  <p className="text-gray-300 mb-6">
                    Our specialized Bitcoin integration enables time-locked Bitcoin vaults using native Bitcoin
                    transaction features combined with our cross-chain security architecture.
                  </p>
                  
                  <div className="bg-[#0F0F0F] border border-[#222] rounded-lg p-4 mb-6">
                    <h4 className="text-md font-semibold text-white mb-2">Implementation</h4>
                    <div className="text-sm text-gray-400">
                      <p>Bitcoin vaults are secured using:</p>
                      <ol className="list-decimal pl-5 mt-2 space-y-1">
                        <li>Native timelock transactions (nLockTime)</li>
                        <li>Multi-signature security (2-of-3)</li>
                        <li>Lightning Network integration for low-fee operations</li>
                        <li>Cross-chain monitoring via Chronos validator network</li>
                      </ol>
                    </div>
                  </div>
                  
                  <div className="bg-[#0F0F0F] border border-[#222] rounded-lg p-4">
                    <h4 className="text-md font-semibold text-white mb-2">Halvening Features</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
                      <div className="bg-[#171717] p-2 rounded">
                        <span className="text-xs font-semibold text-yellow-400">Halvening Triggers</span>
                        <p className="text-[10px] text-gray-500">Automatic unlocks on Bitcoin halvening events</p>
                      </div>
                      <div className="bg-[#171717] p-2 rounded">
                        <span className="text-xs font-semibold text-yellow-400">HODL Rewards</span>
                        <p className="text-[10px] text-gray-500">Bonus incentives for long-term vault holders</p>
                      </div>
                      <div className="bg-[#171717] p-2 rounded">
                        <span className="text-xs font-semibold text-yellow-400">Satoshi Counter</span>
                        <p className="text-[10px] text-gray-500">Precise tracking of Bitcoin growth over time</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-[#1D1D1D]/95 to-[#151515]/95 p-6 rounded-lg border border-[#333]">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Key className="h-5 w-5 text-[#FF5AF7]" />
                    <span>Advanced Access Control System</span>
                  </h3>
                  
                  <p className="text-gray-300 mb-6">
                    Our innovative access control system enables complex, conditional access to vaults,
                    supporting various inheritance, corporate, and multi-party scenarios.
                  </p>
                  
                  <div className="bg-[#0F0F0F] border border-[#222] rounded-lg p-4">
                    <h4 className="text-md font-semibold text-white mb-2">Access Control Capabilities</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-[#171717] p-3 rounded">
                        <h5 className="text-sm font-medium text-[#FF5AF7] mb-1">Multi-Signature (M-of-N)</h5>
                        <p className="text-xs text-gray-400">Requires multiple authorized signatures with customizable thresholds for access or management.</p>
                      </div>
                      <div className="bg-[#171717] p-3 rounded">
                        <h5 className="text-sm font-medium text-[#FF5AF7] mb-1">Time-Based Conditions</h5>
                        <p className="text-xs text-gray-400">Access rights that change over time, including graduated release schedules and time-limited permissions.</p>
                      </div>
                      <div className="bg-[#171717] p-3 rounded">
                        <h5 className="text-sm font-medium text-[#FF5AF7] mb-1">External Oracles</h5>
                        <p className="text-xs text-gray-400">Vault access linked to real-world events through oracle services and data feeds.</p>
                      </div>
                      <div className="bg-[#171717] p-3 rounded">
                        <h5 className="text-sm font-medium text-[#FF5AF7] mb-1">Social Recovery</h5>
                        <p className="text-xs text-gray-400">Guardians can help recover access through distributed trust mechanisms and verification.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Container>
    </>
  );
}