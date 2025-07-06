import React, { useState } from 'react';
import { Link } from 'wouter';
import SecurityLevelSelector from '@/components/vault/security-level-selector';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Info, Star } from 'lucide-react';

const SecurityProtocolsPage: React.FC = () => {
  const [selectedSecurityLevel, setSelectedSecurityLevel] = useState(3);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Link href="/vault-types-selector">
          <Button variant="ghost" size="sm" className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-[#6B00D7]">Security Protocols</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <SecurityLevelSelector 
            selectedLevel={selectedSecurityLevel}
            onChange={setSelectedSecurityLevel}
          />
          
          <div className="mt-8">
            <div className="flex items-center mb-2">
              <Shield className="h-5 w-5 text-[#6B00D7] mr-2" />
              <h2 className="text-xl font-semibold">About Sovereign Fortress™ Security</h2>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Our Sovereign Fortress™ Security Protocol employs cutting-edge post-quantum cryptographic algorithms to secure your digital assets against both current and future threats, including quantum computing attacks.
            </p>
            
            <div className="bg-[#6B00D7]/10 border border-[#6B00D7]/20 rounded-lg p-4">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-[#6B00D7] mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-white mb-1">Why Post-Quantum Cryptography Matters</h3>
                  <p className="text-xs text-gray-400">
                    Quantum computers pose a significant threat to traditional cryptographic algorithms. Our security protocols implement NIST-approved post-quantum cryptographic algorithms designed to withstand attacks from both classical and quantum computers, ensuring your assets remain secure for decades to come.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="bg-black/20 border border-gray-800 rounded-lg p-4">
              <h3 className="text-sm font-medium text-white mb-2">Triple-Chain Verification</h3>
              <p className="text-xs text-gray-400">
                Assets are verified across Ethereum, Solana, and TON blockchains, creating a secure multi-chain verification system that prevents single-chain vulnerabilities.
              </p>
            </div>
            
            <div className="bg-black/20 border border-gray-800 rounded-lg p-4">
              <h3 className="text-sm font-medium text-white mb-2">Zero-Knowledge Privacy Layer</h3>
              <p className="text-xs text-gray-400">
                All security levels include our proprietary zero-knowledge privacy layer, ensuring your vault contents remain private while still maintaining verifiable proof of existence.
              </p>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-b from-[#1A1A1A] to-[#111] border border-gray-800 rounded-lg p-6 sticky top-6">
            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] bg-clip-text text-transparent">Security Protocol Summary</h3>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium mb-1">Selected Level:</div>
                <div className="bg-black/30 rounded-lg p-3 flex items-center">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center mr-2"
                    style={{ 
                      backgroundColor: getColorForLevel(selectedSecurityLevel)+'20',
                      color: getColorForLevel(selectedSecurityLevel)
                    }}
                  >
                    {selectedSecurityLevel === 4 ? <Star size={12} /> : <Shield size={12} />}
                  </div>
                  <div>
                    <span className="font-medium" style={{ color: getColorForLevel(selectedSecurityLevel) }}>
                      Level {selectedSecurityLevel}: {getLevelName(selectedSecurityLevel)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-1">Primary Algorithm:</div>
                <div className="bg-black/30 rounded-lg p-3">
                  <code className="text-xs font-mono" style={{ color: getColorForLevel(selectedSecurityLevel) }}>
                    {getPrimaryAlgorithm(selectedSecurityLevel)}
                  </code>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-1">Secondary Algorithm:</div>
                <div className="bg-black/30 rounded-lg p-3">
                  <code className="text-xs font-mono" style={{ color: getColorForLevel(selectedSecurityLevel) }}>
                    {getSecondaryAlgorithm(selectedSecurityLevel)}
                  </code>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-1">Key Strength:</div>
                <div className="bg-black/30 rounded-lg p-3">
                  <div className="flex items-center">
                    <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          width: `${selectedSecurityLevel * 25}%`,
                          backgroundColor: getColorForLevel(selectedSecurityLevel)
                        }}
                      />
                    </div>
                    <span className="ml-3 text-xs font-medium" style={{ color: getColorForLevel(selectedSecurityLevel) }}>
                      {selectedSecurityLevel * 25}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-800">
                <div className="flex items-start">
                  <Info className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-400">
                    Security settings can be adjusted later in your vault settings.
                  </p>
                </div>
              </div>
              
              <div className="pt-4">
                <Link href="/create-vault">
                  <Button 
                    className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90 transition-opacity" 
                  >
                    Continue to Vault Creation
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function getColorForLevel(level: number): string {
  switch (level) {
    case 1: return '#D76B00';
    case 2: return '#00D74B';
    case 3: return '#00B8FF';
    case 4: return '#FF5AF7';
    default: return '#6B00D7';
  }
}

function getLevelName(level: number): string {
  switch (level) {
    case 1: return 'Standard';
    case 2: return 'Enhanced';
    case 3: return 'Maximum';
    case 4: return 'Fortress™';
    default: return 'Unknown';
  }
}

function getPrimaryAlgorithm(level: number): string {
  switch (level) {
    case 1: return 'Falcon-512';
    case 2: return 'Falcon-1024';
    case 3: return 'CRYSTALS-Dilithium';
    case 4: return 'SPHINCS+';
    default: return 'Unknown';
  }
}

function getSecondaryAlgorithm(level: number): string {
  switch (level) {
    case 1: return 'Kyber-512';
    case 2: return 'Kyber-768';
    case 3: return 'Kyber-1024';
    case 4: return 'FrodoKEM-1344';
    default: return 'Unknown';
  }
}

export default SecurityProtocolsPage;