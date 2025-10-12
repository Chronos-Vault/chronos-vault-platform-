import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Check, Shield, Link as LinkIcon, Globe, Zap, Lock, ArrowRightLeft } from "lucide-react";

const CrossChainVaultPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header Section */}
      <div className="mb-12">
        <Link href="/vault-school">
          <Button variant="ghost" className="mb-6 hover:bg-[#6B00D7]/10">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Vault School
          </Button>
        </Link>

        <div className="flex items-center mb-4">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center shadow-lg shadow-[#6B00D7]/30 mr-4">
            <LinkIcon className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
            Cross-Chain Vault
          </h1>
        </div>
        
        <p className="text-xl text-gray-300 max-w-3xl mb-6">
          Advanced asset security across multiple blockchain networks with distributed verification and fault tolerance.
        </p>

        <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6 max-w-3xl">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Shield className="mr-2 h-5 w-5 text-[#FF5AF7]" /> Key Benefits
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
              <span className="text-gray-300">Enhanced security through cross-chain verification mechanisms</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
              <span className="text-gray-300">Protection against single-blockchain vulnerabilities or failures</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
              <span className="text-gray-300">Support for assets across Ethereum, Solana, TON, and Bitcoin networks</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
              <span className="text-gray-300">Extensible architecture supporting future blockchain integrations</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
              <span className="text-gray-300">Fallback blockchain security with automatic recovery mechanisms</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Technical Overview Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 border-b border-[#333] pb-2">
          Technical Overview
        </h2>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300">
            The Cross-Chain Vault leverages the unique security features of multiple blockchain networks 
            to create a robust, distributed vault system. Asset ownership and access controls are verified 
            across multiple chains, creating a security architecture with no single point of failure.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3 text-white">Key Technologies</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-[#242424] border border-[#333] rounded-lg p-5">
              <div className="flex items-center mb-3">
                <LinkIcon className="h-5 w-5 text-[#FF5AF7] mr-3" />
                <h4 className="text-lg font-medium text-white">Cross-Chain Messaging</h4>
              </div>
              <p className="text-gray-300 text-sm">
                Our proprietary cross-chain messaging protocol enables secure communication between 
                different blockchain networks. This allows vault operations to be verified and confirmed 
                across multiple chains simultaneously.
              </p>
            </div>
            
            <div className="bg-[#242424] border border-[#333] rounded-lg p-5">
              <div className="flex items-center mb-3">
                <Lock className="h-5 w-5 text-[#FF5AF7] mr-3" />
                <h4 className="text-lg font-medium text-white">Distributed Verification</h4>
              </div>
              <p className="text-gray-300 text-sm">
                Asset access requires verification from multiple blockchains according to your chosen 
                security level. This means that even if one blockchain is compromised, your assets 
                remain protected by the verification requirements of other chains.
              </p>
            </div>
            
            <div className="bg-[#242424] border border-[#333] rounded-lg p-5">
              <div className="flex items-center mb-3">
                <Globe className="h-5 w-5 text-[#FF5AF7] mr-3" />
                <h4 className="text-lg font-medium text-white">Chain-Specific Roles</h4>
              </div>
              <p className="text-gray-300 text-sm">
                Our revolutionary Trinity Protocol: 2-of-3 Chain Security uses fixed-role architecture for maximum security. 
                Ethereum Layer (Primary Security via Layer 2 for 95% lower fees), Solana Layer (Rapid Validation for high-frequency monitoring), 
                and TON Layer (Recovery System with quantum-resistant backup) work together in 2-of-3 consensus for unparalleled protection.
              </p>
            </div>
            
            <div className="bg-[#242424] border border-[#333] rounded-lg p-5">
              <div className="flex items-center mb-3">
                <Zap className="h-5 w-5 text-[#FF5AF7] mr-3" />
                <h4 className="text-lg font-medium text-white">Automatic Fallback</h4>
              </div>
              <p className="text-gray-300 text-sm">
                If any blockchain in the security architecture experiences issues, the system
                automatically falls back to alternative chains for continued operation. This ensures
                uninterrupted access to your assets even during network outages.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 border-b border-[#333] pb-2">
          How It Works
        </h2>
        
        <div className="space-y-6 mb-8">
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">1. Multi-Chain Vault Creation</h3>
            <p className="text-gray-300 mb-4">
              Creating a Cross-Chain Vault involves these key steps:
            </p>
            <ul className="space-y-2 text-gray-300 mb-4">
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Ethereum Layer serves as Primary Security with immutable ownership and access control (via Layer 2 for 95% lower fees)</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Solana Layer provides Rapid Validation with high-frequency monitoring and millisecond confirmation</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>TON Layer acts as Recovery System with quantum-resistant backup and emergency recovery</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Cross-chain initialization transactions establish trust between all three layers</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>2-of-3 verification requirements synchronized across all layers for maximum security</span>
              </li>
            </ul>
            <p className="text-gray-300">
              This multi-chain deployment creates a distributed security architecture where no single 
              blockchain has complete control over your assets.
            </p>
          </div>
          
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">2. Triple-Chain Security™ Architecture</h3>
            <p className="text-gray-300 mb-4">
              Our signature security model distributes verification across three chains:
            </p>
            <ul className="space-y-2 text-gray-300 mb-4">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-cyan-900/30 text-cyan-400 flex items-center justify-center mr-2 mt-0.5">
                  <span className="text-sm font-bold">T</span>
                </div>
                <div>
                  <span className="font-medium text-cyan-400">TON Layer (Primary)</span>
                  <p className="mt-0.5">Manages primary vault operations and asset management</p>
                </div>
              </li>
              <li className="flex items-start mt-3">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-900/30 text-green-400 flex items-center justify-center mr-2 mt-0.5">
                  <span className="text-sm font-bold">S</span>
                </div>
                <div>
                  <span className="font-medium text-green-400">Solana Layer (Monitoring)</span>
                  <p className="mt-0.5">Provides high-frequency monitoring and rapid validation</p>
                </div>
              </li>
              <li className="flex items-start mt-3">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-900/30 text-blue-400 flex items-center justify-center mr-2 mt-0.5">
                  <span className="text-sm font-bold">E</span>
                </div>
                <div>
                  <span className="font-medium text-blue-400">Ethereum Layer (Validation)</span>
                  <p className="mt-0.5">Provides secondary validation and security verification</p>
                </div>
              </li>
              <li className="flex items-start mt-3">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-orange-900/30 text-orange-400 flex items-center justify-center mr-2 mt-0.5">
                  <span className="text-sm font-bold">B</span>
                </div>
                <div>
                  <span className="font-medium text-orange-400">Bitcoin Layer (Optional)</span>
                  <p className="mt-0.5">Provides immutable timestamping and additional verification</p>
                </div>
              </li>
            </ul>
            <p className="text-gray-300">
              This architecture ensures that even if an entire blockchain network is compromised, 
              your assets remain protected by the security of the other chains.
            </p>
          </div>
          
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">3. Cross-Chain Verification Process</h3>
            <p className="text-gray-300 mb-4">
              When accessing or transferring assets from your vault:
            </p>
            <ul className="space-y-2 text-gray-300 mb-4">
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Access request is initiated on the primary chain (Ethereum)</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Verification request is propagated to secondary chains (Solana and TON)</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Each blockchain validates the request according to its specific security rules</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Verification confirmations are sent back to the primary chain</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Access is granted only when required number of chains confirm verification</span>
              </li>
            </ul>
            <p className="text-gray-300">
              This distributed verification process creates multiple security layers that must all be
              passed before access is granted to your assets.
            </p>
          </div>
          
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">4. Fault Tolerance & Recovery</h3>
            <p className="text-gray-300 mb-4">
              The Cross-Chain Vault includes sophisticated fault tolerance:
            </p>
            <ul className="space-y-2 text-gray-300 mb-4">
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Automatic detection of blockchain network issues or outages</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Intelligent adjustment of verification requirements during network disruptions</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Fallback chain activation if primary or secondary chains are unavailable</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Recovery synchronization when networks are restored</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Emergency access protocols for catastrophic multi-chain failures</span>
              </li>
            </ul>
            <p className="text-gray-300">
              These mechanisms ensure continuous access to your assets while maintaining high security standards
              even during network disruptions or attacks.
            </p>
          </div>
        </div>
      </div>

      {/* Cross-Chain Transaction Flow Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 border-b border-[#333] pb-2">
          Cross-Chain Transaction Flow
        </h2>
        
        <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-white mb-5">Transaction Verification Sequence</h3>
          
          <div className="relative">
            {/* Timeline connector */}
            <div className="absolute left-[19px] top-0 h-full w-0.5 bg-gradient-to-b from-[#6B00D7] to-[#FF5AF7]"></div>
            
            <div className="space-y-8">
              <div className="relative flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#6B00D7] flex items-center justify-center z-10 mr-4">
                  <span className="text-white font-bold">1</span>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white mb-2">Initiation</h4>
                  <p className="text-gray-300">
                    User signs a transaction request with their wallet, which is submitted to the Ethereum primary vault contract.
                    The request includes the operation type, asset details, and destination information.
                  </p>
                </div>
              </div>
              
              <div className="relative flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#8A29E0] flex items-center justify-center z-10 mr-4">
                  <span className="text-white font-bold">2</span>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white mb-2">Cross-Chain Propagation</h4>
                  <p className="text-gray-300">
                    The request details and signature are propagated to verification contracts on Solana and TON through
                    our cross-chain messaging protocol. Each blockchain receives the verification request along with cryptographic proofs.
                  </p>
                </div>
              </div>
              
              <div className="relative flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#AD54E9] flex items-center justify-center z-10 mr-4">
                  <span className="text-white font-bold">3</span>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white mb-2">Parallel Verification</h4>
                  <p className="text-gray-300">
                    Each blockchain independently verifies the request according to its specific security rules.
                    Solana performs high-speed security checks while TON validates against backup security parameters.
                    Optional Bitcoin timestamping may be included for additional verification.
                  </p>
                </div>
              </div>
              
              <div className="relative flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#D17FF3] flex items-center justify-center z-10 mr-4">
                  <span className="text-white font-bold">4</span>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white mb-2">Response Aggregation</h4>
                  <p className="text-gray-300">
                    Verification results are sent back to the primary Ethereum contract, which aggregates the responses.
                    The vault requires a minimum threshold of positive verifications before proceeding with the operation.
                  </p>
                </div>
              </div>
              
              <div className="relative flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#FF5AF7] flex items-center justify-center z-10 mr-4">
                  <span className="text-white font-bold">5</span>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white mb-2">Execution</h4>
                  <p className="text-gray-300">
                    Once sufficient verifications are received and all security checks pass, the operation is executed
                    on the primary chain. All actions are logged across all participating blockchains for
                    maximum transparency and security.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Security Level Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase">
                <tr>
                  <th scope="col" className="px-4 py-3">Security Level</th>
                  <th scope="col" className="px-4 py-3">Required Chains</th>
                  <th scope="col" className="px-4 py-3">Verification Type</th>
                  <th scope="col" className="px-4 py-3">Response Time</th>
                  <th scope="col" className="px-4 py-3">Recommended For</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#333]">
                  <td className="px-4 py-3 font-medium text-white">Standard (Level 1)</td>
                  <td className="px-4 py-3 text-gray-300">2 of 3 chains</td>
                  <td className="px-4 py-3 text-gray-300">Basic verification</td>
                  <td className="px-4 py-3 text-gray-300">~30 seconds</td>
                  <td className="px-4 py-3 text-gray-300">Up to $10,000 USD</td>
                </tr>
                <tr className="border-b border-[#333]">
                  <td className="px-4 py-3 font-medium text-white">Enhanced (Level 2)</td>
                  <td className="px-4 py-3 text-gray-300">3 of 3 chains</td>
                  <td className="px-4 py-3 text-gray-300">Enhanced verification</td>
                  <td className="px-4 py-3 text-gray-300">~1 minute</td>
                  <td className="px-4 py-3 text-gray-300">$10,000-$100,000 USD</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-white">Fortress™ (Level 3)</td>
                  <td className="px-4 py-3 text-gray-300">3 + Bitcoin</td>
                  <td className="px-4 py-3 text-gray-300">Advanced verification</td>
                  <td className="px-4 py-3 text-gray-300">10+ minutes</td>
                  <td className="px-4 py-3 text-gray-300">$100,000+ USD</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 border-b border-[#333] pb-2">
          Ideal Use Cases
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-[#242424] to-[#1E1E1E] border border-[#333] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">High-Value Asset Protection</h3>
            <p className="text-gray-300 text-sm">
              Secure extremely valuable digital assets with the highest level of
              protection across multiple blockchain networks.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[#242424] to-[#1E1E1E] border border-[#333] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Multi-Chain Portfolio</h3>
            <p className="text-gray-300 text-sm">
              Manage assets across different blockchain networks with a unified
              security model and cross-chain accessibility.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[#242424] to-[#1E1E1E] border border-[#333] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Mission-Critical DeFi</h3>
            <p className="text-gray-300 text-sm">
              Protect assets used in DeFi with fault-tolerant security that maintains
              access even during single blockchain disruptions.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[#242424] to-[#1E1E1E] border border-[#333] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Institutional Treasury</h3>
            <p className="text-gray-300 text-sm">
              Implement enterprise-grade security for organizational funds with
              distributed verification and attestation.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[#242424] to-[#1E1E1E] border border-[#333] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Cross-Chain Applications</h3>
            <p className="text-gray-300 text-sm">
              Secure assets used by cross-chain applications and protocols with
              native multi-chain security architecture.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[#242424] to-[#1E1E1E] border border-[#333] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Blockchain Agnostic Storage</h3>
            <p className="text-gray-300 text-sm">
              Create future-proof storage solutions not dependent on any single
              blockchain's continued dominance or stability.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <Link href="/vault-types">
          <Button className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#7B10E7] hover:to-[#FF6AF7] text-white px-8 py-6 h-auto text-lg rounded-xl shadow-lg shadow-[#6B00D7]/30 transition-all hover:shadow-xl hover:shadow-[#6B00D7]/40">
            Create Cross-Chain Vault
          </Button>
        </Link>
        <p className="text-gray-400 mt-4">
          Experience breakthrough security with distributed verification across multiple blockchains
        </p>
      </div>
    </div>
  );
};

export default CrossChainVaultPage;