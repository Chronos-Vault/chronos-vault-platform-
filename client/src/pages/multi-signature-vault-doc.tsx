import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Check, Shield, Users, Key, FileText, AlertTriangle, Lock } from "lucide-react";

const MultiSignatureVaultDocPage = () => {
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
            <Users className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
            Multi-Signature Vault
          </h1>
        </div>
        
        <p className="text-xl text-gray-300 max-w-3xl mb-6">
          Enhanced security vault requiring multiple approvals for asset access, implementing distributed authorization across multiple trusted parties.
        </p>

        <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6 max-w-3xl">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Shield className="mr-2 h-5 w-5 text-[#FF5AF7]" /> Key Benefits
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
              <span className="text-gray-300">Prevent single points of failure with distributed authorization</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
              <span className="text-gray-300">Customize approval thresholds (M-of-N signature requirements)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
              <span className="text-gray-300">Implement hierarchical access controls for organization-level security</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
              <span className="text-gray-300">Enable social recovery mechanisms for lost access</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
              <span className="text-gray-300">Combine with other vault types for maximum security</span>
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
            The Multi-Signature Vault implements a sophisticated authorization system that requires 
            multiple parties to approve any transaction or access request. This distributed 
            approach eliminates single points of failure and significantly enhances security for 
            high-value assets.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3 text-white">Key Technologies</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-[#242424] border border-[#333] rounded-lg p-5">
              <div className="flex items-center mb-3">
                <Key className="h-5 w-5 text-[#FF5AF7] mr-3" />
                <h4 className="text-lg font-medium text-white">M-of-N Signature Scheme</h4>
              </div>
              <p className="text-gray-300 text-sm">
                Configurable threshold signatures allowing vault access only when a specified 
                number (M) out of the total authorized signers (N) provide valid signatures. 
                Thresholds can be set to match specific security requirements.
              </p>
            </div>
            
            <div className="bg-[#242424] border border-[#333] rounded-lg p-5">
              <div className="flex items-center mb-3">
                <Users className="h-5 w-5 text-[#FF5AF7] mr-3" />
                <h4 className="text-lg font-medium text-white">Hierarchical Authorization</h4>
              </div>
              <p className="text-gray-300 text-sm">
                Structured approval systems with tiered access levels, allowing organizations 
                to implement governance models where different signers have different weights 
                or roles in the approval process.
              </p>
            </div>
            
            <div className="bg-[#242424] border border-[#333] rounded-lg p-5">
              <div className="flex items-center mb-3">
                <FileText className="h-5 w-5 text-[#FF5AF7] mr-3" />
                <h4 className="text-lg font-medium text-white">Proposal System</h4>
              </div>
              <p className="text-gray-300 text-sm">
                Structured proposal and voting system for vault actions, enabling thorough 
                documentation, discussion, and review of proposed transactions before approvals. 
                Includes notification systems and audit trails.
              </p>
            </div>
            
            <div className="bg-[#242424] border border-[#333] rounded-lg p-5">
              <div className="flex items-center mb-3">
                <AlertTriangle className="h-5 w-5 text-[#FF5AF7] mr-3" />
                <h4 className="text-lg font-medium text-white">Social Recovery</h4>
              </div>
              <p className="text-gray-300 text-sm">
                Built-in mechanisms for recovering access when keys are lost, using trusted 
                guardian networks and time-delayed recovery processes to maintain security 
                while preventing permanent loss of access.
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
            <h3 className="text-xl font-semibold text-white mb-4">1. Vault Configuration</h3>
            <p className="text-gray-300 mb-4">
              Setting up a Multi-Signature Vault involves:
            </p>
            <ul className="space-y-2 text-gray-300 mb-4">
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Designating authorized signers with their public keys or wallet addresses</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Setting the signature threshold (e.g., 2-of-3, 3-of-5, etc.)</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Configuring optional time locks or cool-down periods</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Establishing transaction limits and permissions per signer</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Setting up social recovery guardians (optional)</span>
              </li>
            </ul>
            <p className="text-gray-300">
              Once configured, the vault generates a unique multi-signature smart contract that 
              enforces these rules across all supported blockchains.
            </p>
          </div>
          
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">2. Transaction Initiation</h3>
            <p className="text-gray-300 mb-4">
              When assets need to be accessed or transferred:
            </p>
            <ul className="space-y-2 text-gray-300 mb-4">
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>An authorized signer creates a proposal with transaction details</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>The proposal is recorded on-chain with a unique identifier</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>All authorized signers receive notification of the pending proposal</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Optional time delays begin, preventing immediate execution</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Transaction details are verified by the smart contract</span>
              </li>
            </ul>
            <p className="text-gray-300">
              This transparent process ensures all stakeholders are aware of proposed transactions 
              and can review them before approval.
            </p>
          </div>
          
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">3. Approval Process</h3>
            <p className="text-gray-300 mb-4">
              Collecting the required approvals involves:
            </p>
            <ul className="space-y-2 text-gray-300 mb-4">
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Each authorized signer independently reviews the proposal</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Approvals are provided by signing the transaction with private keys</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Signatures are cryptographically verified on-chain</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>The system tracks the number of valid signatures collected</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Signers can optionally include comments or conditions with approvals</span>
              </li>
            </ul>
            <p className="text-gray-300">
              This distributed approval process ensures no single party can access assets without 
              consensus from the required number of authorized signers.
            </p>
          </div>
          
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">4. Execution & Security</h3>
            <p className="text-gray-300 mb-4">
              Once approvals are collected:
            </p>
            <ul className="space-y-2 text-gray-300 mb-4">
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>The smart contract verifies that the signature threshold has been met</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Any required waiting periods are enforced before execution</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>The transaction is submitted to the blockchain when all conditions are met</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Cross-chain verification ensures seamless asset movement across networks</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>A comprehensive audit trail is maintained of all approvals and actions</span>
              </li>
            </ul>
            <p className="text-gray-300">
              The multi-signature approach combined with our Triple-Chain Security™ architecture 
              provides unparalleled protection against unauthorized access.
            </p>
          </div>
        </div>
      </div>

      {/* Security Levels Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 border-b border-[#333] pb-2">
          Security Configurations
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-[#6B00D7]/20 flex items-center justify-center mr-4">
                <Users className="h-5 w-5 text-[#FF5AF7]" />
              </div>
              <h3 className="text-lg font-semibold text-white">Basic (2-of-3)</h3>
            </div>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Standard 2-of-3 signature requirement</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Instant execution upon approval threshold</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Equal authority among all signers</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Optional recovery guardian</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Ideal for personal or small team use</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-[#6B00D7]/20 flex items-center justify-center mr-4">
                <Lock className="h-5 w-5 text-[#FF5AF7]" />
              </div>
              <h3 className="text-lg font-semibold text-white">Enhanced (3-of-5)</h3>
            </div>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Higher 3-of-5 signature threshold</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>24-hour time delay after threshold met</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Transaction value limits per signer</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>IP-based access restrictions</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Ideal for business treasury management</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-[#6B00D7]/20 flex items-center justify-center mr-4">
                <Shield className="h-5 w-5 text-[#FF5AF7]" />
              </div>
              <h3 className="text-lg font-semibold text-white">Maximum (M-of-N)</h3>
            </div>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Custom M-of-N with weighted signatures</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Hierarchical approval structure</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Multi-day tiered time delays</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Advanced biometric verification</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Ideal for institutional-grade security</span>
              </li>
            </ul>
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
            <h3 className="text-lg font-semibold text-white mb-3">Corporate Treasury</h3>
            <p className="text-gray-300 text-sm">
              Secure company funds with structured approval processes, requiring 
              signatures from multiple officers or board members for transactions.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[#242424] to-[#1E1E1E] border border-[#333] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">DAO Governance</h3>
            <p className="text-gray-300 text-sm">
              Implement decentralized governance for community treasuries with 
              configurable voting thresholds and proposal systems.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[#242424] to-[#1E1E1E] border border-[#333] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Family Estates</h3>
            <p className="text-gray-300 text-sm">
              Create robust inheritance plans with multiple family members as 
              signers, ensuring consensus-based management of family assets.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[#242424] to-[#1E1E1E] border border-[#333] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Joint Ventures</h3>
            <p className="text-gray-300 text-sm">
              Establish secure shared accounts between business partners requiring 
              mutual agreement for financial decisions and distributions.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[#242424] to-[#1E1E1E] border border-[#333] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">High-Value Storage</h3>
            <p className="text-gray-300 text-sm">
              Protect significant digital assets with multiple layers of authorization 
              to prevent theft, fraud, or unauthorized access.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[#242424] to-[#1E1E1E] border border-[#333] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Cross-Organization Escrow</h3>
            <p className="text-gray-300 text-sm">
              Create secure escrow arrangements between multiple parties requiring 
              consensus from representatives of all organizations involved.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <Link href="/vault-types">
          <Button className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#7B10E7] hover:to-[#FF6AF7] text-white px-8 py-6 h-auto text-lg rounded-xl shadow-lg shadow-[#6B00D7]/30 transition-all hover:shadow-xl hover:shadow-[#6B00D7]/40">
            Create Multi-Signature Vault
          </Button>
        </Link>
        <p className="text-gray-400 mt-4">
          Implement distributed security with configurable approval thresholds
        </p>
      </div>
    </div>
  );
};

export default MultiSignatureVaultDocPage;