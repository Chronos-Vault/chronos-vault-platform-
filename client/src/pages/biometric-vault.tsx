import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Check, Shield, Fingerprint, Lock, Eye, Smartphone, Server } from "lucide-react";

const BiometricVaultPage = () => {
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
            <Fingerprint className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
            Biometric Vault
          </h1>
        </div>
        
        <p className="text-xl text-gray-300 max-w-3xl mb-6">
          Advanced vault security using privacy-preserving biometric authentication combined with blockchain technology.
        </p>

        <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6 max-w-3xl">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Shield className="mr-2 h-5 w-5 text-[#FF5AF7]" /> Key Benefits
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
              <span className="text-gray-300">Seamless authentication using biometric data you already have</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
              <span className="text-gray-300">Zero-knowledge biometric verification preserves your privacy</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
              <span className="text-gray-300">Multi-factor authentication combining biometrics with other security methods</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
              <span className="text-gray-300">Offline verification capabilities for robust access even without connectivity</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
              <span className="text-gray-300">Advanced recovery protocols to prevent permanent loss of access</span>
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
            The Biometric Vault combines the convenience and security of biometric authentication with 
            blockchain-based asset management. It uses zero-knowledge proofs to verify biometric data 
            without storing actual biometric information on the blockchain.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3 text-white">Key Technologies</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-[#242424] border border-[#333] rounded-lg p-5">
              <div className="flex items-center mb-3">
                <Fingerprint className="h-5 w-5 text-[#FF5AF7] mr-3" />
                <h4 className="text-lg font-medium text-white">Zero-Knowledge Biometrics</h4>
              </div>
              <p className="text-gray-300 text-sm">
                Our proprietary zero-knowledge biometric verification system converts your biometric data
                into cryptographic proofs without storing the actual biometric information. This maintains 
                privacy while enabling secure authentication.
              </p>
            </div>
            
            <div className="bg-[#242424] border border-[#333] rounded-lg p-5">
              <div className="flex items-center mb-3">
                <Lock className="h-5 w-5 text-[#FF5AF7] mr-3" />
                <h4 className="text-lg font-medium text-white">Multi-Factor Security</h4>
              </div>
              <p className="text-gray-300 text-sm">
                Biometric authentication is combined with other security factors like device authentication,
                time-based access rules, and optional PIN codes for maximum security with customizable
                verification requirements.
              </p>
            </div>
            
            <div className="bg-[#242424] border border-[#333] rounded-lg p-5">
              <div className="flex items-center mb-3">
                <Eye className="h-5 w-5 text-[#FF5AF7] mr-3" />
                <h4 className="text-lg font-medium text-white">Biometric Modalities</h4>
              </div>
              <p className="text-gray-300 text-sm">
                Support for multiple biometric modalities including fingerprint, facial recognition, 
                and voice recognition. The system selects the most appropriate and secure method based 
                on your device capabilities.
              </p>
            </div>
            
            <div className="bg-[#242424] border border-[#333] rounded-lg p-5">
              <div className="flex items-center mb-3">
                <Smartphone className="h-5 w-5 text-[#FF5AF7] mr-3" />
                <h4 className="text-lg font-medium text-white">On-Device Processing</h4>
              </div>
              <p className="text-gray-300 text-sm">
                Biometric data is processed exclusively on your local device using secure enclaves
                and trusted execution environments. Only the verification results are transmitted,
                never the biometric data itself.
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
            <h3 className="text-xl font-semibold text-white mb-4">1. Vault Creation & Enrollment</h3>
            <p className="text-gray-300 mb-4">
              Setting up a Biometric Vault involves these key steps:
            </p>
            <ul className="space-y-2 text-gray-300 mb-4">
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Create a vault on the blockchain with standard parameters</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Complete biometric enrollment on your device using your preferred modality</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Your device generates cryptographic verification tokens from your biometric data</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Configure additional security factors and recovery options</span>
              </li>
            </ul>
            <p className="text-gray-300">
              During enrollment, no biometric data leaves your device. Instead, cryptographic verification
              tokens derived from your biometrics are registered with the vault contract.
            </p>
          </div>
          
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">2. Authentication Process</h3>
            <p className="text-gray-300 mb-4">
              When you need to access your vault:
            </p>
            <ul className="space-y-2 text-gray-300 mb-4">
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Provide biometric verification on your device (fingerprint, face scan, etc.)</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Your device generates a zero-knowledge proof of your biometric verification</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>The proof is submitted to the blockchain for verification</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Secondary verification factors are processed if configured</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Upon successful verification, vault access is granted</span>
              </li>
            </ul>
            <p className="text-gray-300">
              All verification occurs in a privacy-preserving manner, with blockchain-based cryptographic 
              validation ensuring the authenticity of the verification.
            </p>
          </div>
          
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">3. Cross-Chain Security Architecture</h3>
            <p className="text-gray-300 mb-4">
              Biometric Vaults implement our Triple-Chain Security™ architecture:
            </p>
            <ul className="space-y-2 text-gray-300 mb-4">
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Primary vault contract on Ethereum manages ownership and access control</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Solana verification contract provides high-speed monitoring of verification attempts</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>TON backup security system handles emergency recovery operations</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Optional Bitcoin timestamping for additional verification security</span>
              </li>
            </ul>
            <p className="text-gray-300">
              This multi-chain approach provides redundancy and enhanced security against blockchain-specific vulnerabilities.
            </p>
          </div>
          
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">4. Recovery System</h3>
            <p className="text-gray-300 mb-4">
              In case of lost device access or biometric changes:
            </p>
            <ul className="space-y-2 text-gray-300 mb-4">
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Primary recovery through designated backup devices with previously enrolled biometrics</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Secondary recovery through multi-signature verification from trusted contacts</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Tertiary recovery through time-locked backup key with waiting period</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>All recovery attempts are publicly logged on the blockchain for security</span>
              </li>
            </ul>
            <p className="text-gray-300">
              The tiered recovery system ensures you'll never permanently lose access to your assets while maintaining high security.
            </p>
          </div>
        </div>
      </div>

      {/* Privacy & Security Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 border-b border-[#333] pb-2">
          Privacy & Security Guarantees
        </h2>
        
        <div className="space-y-6">
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Privacy Preservation</h3>
            <p className="text-gray-300 mb-4">
              Our biometric vault system guarantees your privacy through several technical measures:
            </p>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
                <span>
                  <strong className="text-white">Zero Storage:</strong> Your actual biometric data is never stored on our servers 
                  or on the blockchain. Only verification tokens are used.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
                <span>
                  <strong className="text-white">Local Processing:</strong> All biometric data processing occurs exclusively 
                  within your device's secure enclave or trusted execution environment.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
                <span>
                  <strong className="text-white">Zero-Knowledge Proofs:</strong> Authentication uses zero-knowledge proofs that verify 
                  identity without revealing any information about your biometrics.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
                <span>
                  <strong className="text-white">One-Way Derivation:</strong> Verification tokens are derived through one-way 
                  cryptographic functions, making it impossible to reverse-engineer your biometric data.
                </span>
              </li>
            </ul>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Server className="h-6 w-6 text-[#FF5AF7] mr-3" />
                <h3 className="text-lg font-semibold text-white">Technical Specifications</h3>
              </div>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start">
                  <span className="text-[#FF5AF7] mr-2">•</span>
                  <span><strong className="text-white">Biometric Templates:</strong> ISO/IEC 24745 compliant</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FF5AF7] mr-2">•</span>
                  <span><strong className="text-white">ZKP System:</strong> Bulletproofs or zk-SNARKs depending on security level</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FF5AF7] mr-2">•</span>
                  <span><strong className="text-white">Key Derivation:</strong> Argon2id with high memory and computation parameters</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FF5AF7] mr-2">•</span>
                  <span><strong className="text-white">Encryption:</strong> XChaCha20-Poly1305 for device-to-blockchain communication</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FF5AF7] mr-2">•</span>
                  <span><strong className="text-white">Secure Element:</strong> Utilizes device hardware security modules when available</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Shield className="h-6 w-6 text-[#FF5AF7] mr-3" />
                <h3 className="text-lg font-semibold text-white">Security Levels</h3>
              </div>
              <ul className="space-y-4 text-gray-300 text-sm">
                <li>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-green-400 mr-2"></div>
                    <strong className="text-white">Standard (Level 1)</strong>
                  </div>
                  <p className="ml-5 mt-1">Single biometric factor with device authentication</p>
                </li>
                <li>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-blue-400 mr-2"></div>
                    <strong className="text-white">Enhanced (Level 2)</strong>
                  </div>
                  <p className="ml-5 mt-1">Multi-modal biometrics with 2-factor authentication</p>
                </li>
                <li>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-purple-400 mr-2"></div>
                    <strong className="text-white">Fortress™ (Level 3)</strong>
                  </div>
                  <p className="ml-5 mt-1">Multi-modal biometrics, multi-factor auth, and time-based access controls</p>
                </li>
              </ul>
            </div>
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
            <h3 className="text-lg font-semibold text-white mb-3">Personal Digital Identity</h3>
            <p className="text-gray-300 text-sm">
              Secure personal credentials, identity documents, and digital identification 
              with the convenience of biometric access.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[#242424] to-[#1E1E1E] border border-[#333] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">High-Value Asset Protection</h3>
            <p className="text-gray-300 text-sm">
              Provide additional security for high-value cryptocurrency or NFT assets
              by requiring biometric verification for transactions.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[#242424] to-[#1E1E1E] border border-[#333] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Medical Records Storage</h3>
            <p className="text-gray-300 text-sm">
              Store sensitive medical data with strict privacy controls and biometric 
              access requirements for both patients and authorized providers.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[#242424] to-[#1E1E1E] border border-[#333] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Private Key Backup</h3>
            <p className="text-gray-300 text-sm">
              Securely store cryptocurrency wallet private keys with biometric recovery,
              eliminating the need for seed phrases or physical backups.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[#242424] to-[#1E1E1E] border border-[#333] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Personal Legal Documents</h3>
            <p className="text-gray-300 text-sm">
              Store wills, trusts, and other sensitive legal documents with biometric 
              access control and designated beneficiary provisions.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[#242424] to-[#1E1E1E] border border-[#333] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Enterprise Authentication</h3>
            <p className="text-gray-300 text-sm">
              Implement role-based access control for enterprise systems with biometric
              verification for enhanced corporate security.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <Link href="/vault-types">
          <Button className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#7B10E7] hover:to-[#FF6AF7] text-white px-8 py-6 h-auto text-lg rounded-xl shadow-lg shadow-[#6B00D7]/30 transition-all hover:shadow-xl hover:shadow-[#6B00D7]/40">
            Create Biometric Vault
          </Button>
        </Link>
        <p className="text-gray-400 mt-4">
          Experience seamless security with privacy-preserving biometric authentication
        </p>
      </div>
    </div>
  );
};

export default BiometricVaultPage;