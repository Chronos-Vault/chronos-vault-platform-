import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Check, Shield, Users, Key, Fingerprint, Clock, Bell } from "lucide-react";

const MultiSignatureVaultPage = () => {
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
          Enhanced security through distributed authorization, requiring multiple approvals for asset access and operations.
        </p>

        <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6 max-w-3xl">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Shield className="mr-2 h-5 w-5 text-[#FF5AF7]" /> Key Benefits
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
              <span className="text-gray-300">Eliminates single points of failure through distributed key management</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
              <span className="text-gray-300">Customizable M-of-N signature requirements (2-of-3, 3-of-5, etc.)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
              <span className="text-gray-300">Advanced recovery options to prevent permanent loss of access</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
              <span className="text-gray-300">Corporate governance and treasury management capabilities</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
              <span className="text-gray-300">Triple-Chain Security™ architecture with cross-chain verification</span>
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
            The Multi-Signature Vault implements an advanced distributed authorization system 
            that requires multiple participants to approve any asset movement or vault operation. 
            This creates a significantly more secure storage solution compared to single-signature systems.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3 text-white">Key Technologies</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-[#242424] border border-[#333] rounded-lg p-5">
              <div className="flex items-center mb-3">
                <Key className="h-5 w-5 text-[#FF5AF7] mr-3" />
                <h4 className="text-lg font-medium text-white">Threshold Signatures</h4>
              </div>
              <p className="text-gray-300 text-sm">
                Our implementation uses threshold signature schemes (TSS) where private keys 
                are mathematically split among participants. Each participant holds only a key 
                fragment, and a threshold number of fragments must be combined to create a valid signature.
              </p>
            </div>
            
            <div className="bg-[#242424] border border-[#333] rounded-lg p-5">
              <div className="flex items-center mb-3">
                <Users className="h-5 w-5 text-[#FF5AF7] mr-3" />
                <h4 className="text-lg font-medium text-white">M-of-N Authorization</h4>
              </div>
              <p className="text-gray-300 text-sm">
                Configurable M-of-N signature requirements let you define exactly how many approvals 
                (M) are needed out of the total key holders (N). This allows for flexible governance 
                structures tailored to your specific security needs.
              </p>
            </div>
            
            <div className="bg-[#242424] border border-[#333] rounded-lg p-5">
              <div className="flex items-center mb-3">
                <Fingerprint className="h-5 w-5 text-[#FF5AF7] mr-3" />
                <h4 className="text-lg font-medium text-white">Social Recovery</h4>
              </div>
              <p className="text-gray-300 text-sm">
                Optional social recovery mechanisms allow for key reconstruction in case of loss. 
                Designated trusted contacts can collectively authorize the recovery process 
                after a security waiting period.
              </p>
            </div>
            
            <div className="bg-[#242424] border border-[#333] rounded-lg p-5">
              <div className="flex items-center mb-3">
                <Clock className="h-5 w-5 text-[#FF5AF7] mr-3" />
                <h4 className="text-lg font-medium text-white">Time-Lock Security</h4>
              </div>
              <p className="text-gray-300 text-sm">
                Additional time-lock features can be enabled to add mandatory waiting periods 
                for high-value transactions, giving all signers time to review and potentially 
                veto suspicious operations.
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
            <h3 className="text-xl font-semibold text-white mb-4">1. Vault Creation</h3>
            <p className="text-gray-300 mb-4">
              When creating a Multi-Signature Vault, you'll define the key parameters:
            </p>
            <ul className="space-y-2 text-gray-300 mb-4">
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Number of total signers (N)</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Required approval threshold (M)</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Vault time parameters (optional waiting periods)</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Recovery options configuration</span>
              </li>
            </ul>
            <p className="text-gray-300">
              The vault is created on the primary blockchain (Ethereum) with cross-chain verification mechanisms 
              deployed on supporting chains (Solana and TON) to provide Triple-Chain Security™.
            </p>
          </div>
          
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">2. Signer Onboarding</h3>
            <p className="text-gray-300 mb-4">
              Each designated signer receives an invitation to join the vault:
            </p>
            <ul className="space-y-2 text-gray-300 mb-4">
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Signers connect their wallet addresses to be registered with the vault</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Each signer receives a unique cryptographic key fragment</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Key fragments are stored securely in each signer's wallet</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Optional key fragment backups are offered through encrypted storage</span>
              </li>
            </ul>
            <p className="text-gray-300">
              The vault becomes active once all signers have completed the onboarding process.
            </p>
          </div>
          
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">3. Transaction Approval Process</h3>
            <p className="text-gray-300 mb-4">
              When assets need to be accessed or transferred:
            </p>
            <ul className="space-y-2 text-gray-300 mb-4">
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Any authorized signer can initiate a transaction proposal</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>All signers receive notification of the pending transaction</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Each signer reviews the details and approves or rejects</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Transaction executes automatically once the threshold (M) is reached</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Time-lock settings may add additional waiting periods for execution</span>
              </li>
            </ul>
            <p className="text-gray-300">
              All approval activities are recorded on-chain for maximum transparency and auditability.
            </p>
          </div>
          
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">4. Recovery Mechanisms</h3>
            <p className="text-gray-300 mb-4">
              In case of lost access by one or more signers:
            </p>
            <ul className="space-y-2 text-gray-300 mb-4">
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Social recovery can be initiated if configured during setup</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Recovery requires approval from a designated number of trusted contacts</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>A mandatory waiting period applies to all recovery attempts</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>All recovery attempts are publicized on-chain for transparency</span>
              </li>
            </ul>
            <p className="text-gray-300">
              These recovery mechanisms provide protection against permanent loss while maintaining robust security.
            </p>
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
              Secure company funds with distributed authorization requirements, ensuring 
              no single individual can access or transfer corporate assets.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[#242424] to-[#1E1E1E] border border-[#333] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Family Inheritance</h3>
            <p className="text-gray-300 text-sm">
              Create secure inheritance vaults that require multiple family members to
              authorize access, preventing disputes and unauthorized withdrawals.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[#242424] to-[#1E1E1E] border border-[#333] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">DAO Treasuries</h3>
            <p className="text-gray-300 text-sm">
              Implement secure governance for decentralized autonomous organization treasuries,
              requiring council approval for fund allocation.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[#242424] to-[#1E1E1E] border border-[#333] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">High-Value Storage</h3>
            <p className="text-gray-300 text-sm">
              Protect significant digital assets with military-grade security through 
              distributed authorization and Triple-Chain Security™.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[#242424] to-[#1E1E1E] border border-[#333] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Team Fund Management</h3>
            <p className="text-gray-300 text-sm">
              Manage shared team or project funds with transparent approval processes,
              ensuring accountability and preventing unauthorized spending.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[#242424] to-[#1E1E1E] border border-[#333] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Joint Investments</h3>
            <p className="text-gray-300 text-sm">
              Create secure vaults for joint investment ventures that require partner 
              consensus for allocation decisions and withdrawals.
            </p>
          </div>
        </div>
      </div>

      {/* Security Features Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 border-b border-[#333] pb-2">
          Advanced Security Features
        </h2>

        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-[#6B00D7]/20 flex items-center justify-center mr-4">
                  <Shield className="h-5 w-5 text-[#FF5AF7]" />
                </div>
                <h3 className="text-lg font-semibold text-white">Triple-Chain Security™</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Our signature security architecture provides verification across three separate blockchain 
                networks. Even if one or two chains are compromised, your assets remain protected by the 
                third chain's verification requirements.
              </p>
            </div>
            
            <div className="flex-1 bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-[#6B00D7]/20 flex items-center justify-center mr-4">
                  <Bell className="h-5 w-5 text-[#FF5AF7]" />
                </div>
                <h3 className="text-lg font-semibold text-white">Real-Time Monitoring</h3>
              </div>
              <p className="text-gray-300 text-sm">
                All vault activity is monitored in real-time with immediate notifications sent to all signers. 
                Any unusual activity triggers additional verification requirements and automated security measures.
              </p>
            </div>
          </div>
          
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Security Level Options</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-400 uppercase">
                  <tr>
                    <th scope="col" className="px-4 py-3">Security Level</th>
                    <th scope="col" className="px-4 py-3">Signature Scheme</th>
                    <th scope="col" className="px-4 py-3">Time-Lock</th>
                    <th scope="col" className="px-4 py-3">Cross-Chain Verification</th>
                    <th scope="col" className="px-4 py-3">Recommended For</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#333]">
                    <td className="px-4 py-3 font-medium text-white">Standard (Level 1)</td>
                    <td className="px-4 py-3 text-gray-300">Falcon-512</td>
                    <td className="px-4 py-3 text-gray-300">Optional</td>
                    <td className="px-4 py-3 text-gray-300">2 Chains</td>
                    <td className="px-4 py-3 text-gray-300">Up to $10,000 USD</td>
                  </tr>
                  <tr className="border-b border-[#333]">
                    <td className="px-4 py-3 font-medium text-white">Enhanced (Level 2)</td>
                    <td className="px-4 py-3 text-gray-300">Falcon-1024</td>
                    <td className="px-4 py-3 text-gray-300">Standard</td>
                    <td className="px-4 py-3 text-gray-300">3 Chains</td>
                    <td className="px-4 py-3 text-gray-300">$10,000-$100,000 USD</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-white">Fortress™ (Level 3)</td>
                    <td className="px-4 py-3 text-gray-300">CRYSTALS-Dilithium</td>
                    <td className="px-4 py-3 text-gray-300">Enhanced</td>
                    <td className="px-4 py-3 text-gray-300">3 Chains + Recovery</td>
                    <td className="px-4 py-3 text-gray-300">$100,000+ USD</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Signature Vault Creation Form */}
      <div className="mb-16 bg-[#121212] border border-[#333] rounded-xl p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
          Create Your Multi-Signature Vault
        </h2>
        
        <div className="mb-8">
          <div className="bg-gradient-to-br from-[#1A121F] to-[#18131B] p-4 border border-[#333] rounded-lg">
            <h3 className="text-lg font-medium text-white mb-3 flex items-center">
              <Shield className="h-5 w-5 text-[#FF5AF7] mr-2" /> Triple-Chain Security™ Enabled
            </h3>
            <p className="text-gray-300 text-sm">
              Your Multi-Signature Vault will be secured across Ethereum, Solana, and TON blockchains,
              providing unparalleled security through distributed verification and recovery mechanisms.
            </p>
          </div>
        </div>
        
        <form className="space-y-6">
          {/* Basic Vault Information */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Vault Configuration</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="vaultName" className="block text-sm font-medium text-gray-300 mb-1">
                  Vault Name
                </label>
                <input
                  type="text"
                  id="vaultName"
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-lg text-white focus:ring-2 focus:ring-[#6B00D7] focus:border-transparent"
                  placeholder="Strategic Treasury Vault"
                />
              </div>
              
              <div>
                <label htmlFor="vaultDescription" className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  id="vaultDescription"
                  rows={3}
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-lg text-white focus:ring-2 focus:ring-[#6B00D7] focus:border-transparent"
                  placeholder="Secure multi-signature vault for our organization's treasury..."
                ></textarea>
              </div>
            </div>
          </div>
          
          {/* Threshold Configuration */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Authorization Requirements</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="totalSigners" className="block text-sm font-medium text-gray-300 mb-1">
                    Total Signers (N)
                  </label>
                  <select
                    id="totalSigners"
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-lg text-white focus:ring-2 focus:ring-[#6B00D7] focus:border-transparent"
                  >
                    <option value="2">2 Signers</option>
                    <option value="3" selected>3 Signers</option>
                    <option value="4">4 Signers</option>
                    <option value="5">5 Signers</option>
                    <option value="7">7 Signers</option>
                    <option value="9">9 Signers</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="requiredSigners" className="block text-sm font-medium text-gray-300 mb-1">
                    Required Signatures (M)
                  </label>
                  <select
                    id="requiredSigners"
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-lg text-white focus:ring-2 focus:ring-[#6B00D7] focus:border-transparent"
                  >
                    <option value="2" selected>2 Required (out of 3)</option>
                    <option value="3">3 Required (out of 3)</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    The number of signatures required to authorize transactions
                  </p>
                </div>
              </div>
              
              <div className="bg-[#1A121F] p-4 border border-[#333] rounded-lg">
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="weighted"
                    className="h-4 w-4 text-[#6B00D7] focus:ring-[#6B00D7] bg-[#1A1A1A] border-[#333] rounded"
                  />
                  <label htmlFor="weighted" className="ml-2 text-sm font-medium text-white">
                    Enable weighted signatures
                  </label>
                </div>
                <p className="text-xs text-gray-500">
                  Assign different voting weights to different signers based on their authority level
                </p>
              </div>
            </div>
          </div>
          
          {/* Advanced Security Options */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Advanced Security Options</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#131313] p-4 border border-[#333] rounded-lg flex items-start">
                  <div className="flex items-center h-5 mt-0.5">
                    <input
                      type="checkbox"
                      id="timeLock"
                      className="h-4 w-4 text-[#6B00D7] focus:ring-[#6B00D7] bg-[#1A1A1A] border-[#333] rounded"
                      checked
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="timeLock" className="text-sm font-medium text-white">Time-Lock Protection</label>
                    <p className="text-xs text-gray-500">Adds a mandatory waiting period before high-value transactions can be executed</p>
                    <select
                      id="timeLockPeriod"
                      className="mt-2 w-full px-3 py-2 bg-[#1A1A1A] border border-[#333] rounded-lg text-white text-sm focus:ring-2 focus:ring-[#6B00D7] focus:border-transparent"
                    >
                      <option value="1">1 hour for transactions > 1 ETH</option>
                      <option value="4">4 hours for transactions > 5 ETH</option>
                      <option value="24" selected>24 hours for transactions > 10 ETH</option>
                      <option value="48">48 hours for all transactions</option>
                    </select>
                  </div>
                </div>
                
                <div className="bg-[#131313] p-4 border border-[#333] rounded-lg flex items-start">
                  <div className="flex items-center h-5 mt-0.5">
                    <input
                      type="checkbox"
                      id="socialRecovery"
                      className="h-4 w-4 text-[#6B00D7] focus:ring-[#6B00D7] bg-[#1A1A1A] border-[#333] rounded"
                      checked
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="socialRecovery" className="text-sm font-medium text-white">Social Recovery</label>
                    <p className="text-xs text-gray-500">Enables recovery through trusted contacts if key access is lost</p>
                    <select
                      id="recoveryThreshold"
                      className="mt-2 w-full px-3 py-2 bg-[#1A1A1A] border border-[#333] rounded-lg text-white text-sm focus:ring-2 focus:ring-[#6B00D7] focus:border-transparent"
                    >
                      <option value="2" selected>2 trusted contacts required</option>
                      <option value="3">3 trusted contacts required</option>
                      <option value="5">5 trusted contacts required</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#131313] p-4 border border-[#333] rounded-lg flex items-start">
                <div className="flex items-center h-5 mt-0.5">
                  <input
                    type="checkbox"
                    id="quantumResistant"
                    className="h-4 w-4 text-[#6B00D7] focus:ring-[#6B00D7] bg-[#1A1A1A] border-[#333] rounded"
                    checked
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="quantumResistant" className="text-sm font-medium text-white">Quantum-Resistant Encryption</label>
                  <p className="text-xs text-gray-500">Implements post-quantum cryptographic algorithms for future-proof security</p>
                </div>
              </div>
              
              <div className="bg-[#131313] p-4 border border-[#333] rounded-lg flex items-start">
                <div className="flex items-center h-5 mt-0.5">
                  <input
                    type="checkbox"
                    id="zeroKnowledge"
                    className="h-4 w-4 text-[#6B00D7] focus:ring-[#6B00D7] bg-[#1A1A1A] border-[#333] rounded"
                    checked
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="zeroKnowledge" className="text-sm font-medium text-white">Zero-Knowledge Verification</label>
                  <p className="text-xs text-gray-500">Enhances privacy by enabling signature verification without exposing sensitive information</p>
                </div>
              </div>
              
              <div className="bg-[#131313] p-4 border border-[#333] rounded-lg">
                <h4 className="text-sm font-medium text-white mb-3">Cross-Chain Security Configuration</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-[#1A1A1A] p-3 rounded-lg border border-[#333] flex flex-col items-center justify-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#627EEA]/20 to-[#627EEA]/10 flex items-center justify-center mb-2">
                      <span className="text-lg">⟠</span>
                    </div>
                    <span className="text-xs text-gray-300 font-medium">Ethereum</span>
                    <span className="text-xs text-green-500">Primary</span>
                  </div>
                  
                  <div className="bg-[#1A1A1A] p-3 rounded-lg border border-[#333] flex flex-col items-center justify-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#9945FF]/20 to-[#9945FF]/10 flex items-center justify-center mb-2">
                      <span className="text-lg">◎</span>
                    </div>
                    <span className="text-xs text-gray-300 font-medium">Solana</span>
                    <span className="text-xs text-purple-500">Verification</span>
                  </div>
                  
                  <div className="bg-[#1A1A1A] p-3 rounded-lg border border-[#333] flex flex-col items-center justify-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#0098EA]/20 to-[#0098EA]/10 flex items-center justify-center mb-2">
                      <span className="text-lg">💎</span>
                    </div>
                    <span className="text-xs text-gray-300 font-medium">TON</span>
                    <span className="text-xs text-blue-500">Backup</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Signer Management */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Authorized Signers</h3>
            <div className="space-y-4">
              <div className="bg-[#131313] p-4 border border-[#333] rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/20 flex items-center justify-center mr-3">
                      <Users className="h-4 w-4 text-[#FF5AF7]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">Your Wallet</h4>
                      <p className="text-xs text-gray-500">0xf39...92266 (Connected)</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs font-medium text-[#FF5AF7] bg-[#FF5AF7]/10 rounded-full px-2 py-1">
                      Primary Signer
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-[#1A1A1A] rounded-lg border border-[#333]">
                    <div className="flex items-center">
                      <div className="h-7 w-7 rounded-full bg-[#242424] flex items-center justify-center mr-3">
                        <Key className="h-3 w-3 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Address of additional signer"
                        className="bg-transparent border-none text-sm text-gray-300 focus:ring-0 w-full"
                      />
                    </div>
                    <select className="bg-[#131313] border border-[#333] text-xs text-gray-300 rounded p-1">
                      <option value="1">Weight: 1</option>
                      <option value="2">Weight: 2</option>
                      <option value="3">Weight: 3</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-[#1A1A1A] rounded-lg border border-[#333]">
                    <div className="flex items-center">
                      <div className="h-7 w-7 rounded-full bg-[#242424] flex items-center justify-center mr-3">
                        <Key className="h-3 w-3 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Address of additional signer"
                        className="bg-transparent border-none text-sm text-gray-300 focus:ring-0 w-full"
                      />
                    </div>
                    <select className="bg-[#131313] border border-[#333] text-xs text-gray-300 rounded p-1">
                      <option value="1">Weight: 1</option>
                      <option value="2">Weight: 2</option>
                      <option value="3">Weight: 3</option>
                    </select>
                  </div>
                  
                  <button type="button" className="w-full py-2 border border-dashed border-[#333] rounded-lg text-sm text-gray-400 hover:text-[#FF5AF7] hover:border-[#FF5AF7]/30 transition-colors">
                    + Add another signer
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Security Score */}
          <div className="bg-[#131313] p-5 border border-[#333] rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium text-white flex items-center">
                <Shield className="h-5 w-5 text-[#FF5AF7] mr-2" /> Security Score
              </h3>
              <span className="text-lg font-bold text-[#FF5AF7]">98/100</span>
            </div>
            <div className="w-full bg-[#1A1A1A] rounded-full h-2.5">
              <div className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] h-2.5 rounded-full" style={{ width: '98%' }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Exceptional security configuration with Triple-Chain protection and advanced features
            </p>
          </div>
          
          {/* Creation Button */}
          <div className="pt-4">
            <Button className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#7B10E7] hover:to-[#FF6AF7] text-white py-6 h-auto text-lg rounded-xl shadow-lg shadow-[#6B00D7]/30 transition-all hover:shadow-xl hover:shadow-[#6B00D7]/40">
              Create Multi-Signature Vault
            </Button>
            <p className="text-xs text-center text-gray-500 mt-3">
              By creating this vault, you're implementing industry-leading security with Triple-Chain protection
            </p>
          </div>
        </form>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <Link href="/vault-types">
          <Button variant="outline" className="bg-transparent border border-[#333] text-gray-300 hover:bg-[#1A1A1A] hover:text-white px-8 py-3 rounded-xl transition-all">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Vault Types
          </Button>
        </Link>
        <p className="text-gray-400 mt-4">
          Experience the ultimate security of distributed authorization with Triple-Chain Security™
        </p>
      </div>
    </div>
  );
};

export default MultiSignatureVaultPage;