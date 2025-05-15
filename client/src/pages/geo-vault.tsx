import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Check, Shield, MapPin, Lock, Globe, Map, RadarIcon } from "lucide-react";

const GeoVaultPage = () => {
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
            <MapPin className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
            Geo-Location Vault
          </h1>
        </div>
        
        <p className="text-xl text-gray-300 max-w-3xl mb-6">
          Advanced vault security with location-based authentication, enabling physical presence requirements for asset access.
        </p>

        <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6 max-w-3xl">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Shield className="mr-2 h-5 w-5 text-[#FF5AF7]" /> Key Benefits
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
              <span className="text-gray-300">Require physical presence at specific locations to access assets</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
              <span className="text-gray-300">Privacy-preserving location verification that protects user anonymity</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
              <span className="text-gray-300">Customizable geofencing with variable radius and accuracy requirements</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
              <span className="text-gray-300">Multi-location support for distributed teams or multi-party access</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
              <span className="text-gray-300">Combines with other security factors for enhanced protection</span>
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
            The Geo-Location Vault implements a sophisticated location-based authentication system 
            that requires users to be physically present at specific coordinates to access their assets. 
            This creates a powerful additional security layer beyond standard digital authentication.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3 text-white">Key Technologies</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-[#242424] border border-[#333] rounded-lg p-5">
              <div className="flex items-center mb-3">
                <MapPin className="h-5 w-5 text-[#FF5AF7] mr-3" />
                <h4 className="text-lg font-medium text-white">Zero-Knowledge Location Proofs</h4>
              </div>
              <p className="text-gray-300 text-sm">
                Our proprietary zero-knowledge location proof system allows verification of a 
                user's physical location without exposing the actual coordinates to the 
                blockchain or third parties, preserving privacy while ensuring security.
              </p>
            </div>
            
            <div className="bg-[#242424] border border-[#333] rounded-lg p-5">
              <div className="flex items-center mb-3">
                <RadarIcon className="h-5 w-5 text-[#FF5AF7] mr-3" />
                <h4 className="text-lg font-medium text-white">Dynamic Geofencing</h4>
              </div>
              <p className="text-gray-300 text-sm">
                Configurable geofencing allows for definition of geographical boundaries with 
                adjustable precision. Options range from tight radius requirements (10-50 meters)
                to wider areas (1-5 kilometers) depending on security needs.
              </p>
            </div>
            
            <div className="bg-[#242424] border border-[#333] rounded-lg p-5">
              <div className="flex items-center mb-3">
                <Globe className="h-5 w-5 text-[#FF5AF7] mr-3" />
                <h4 className="text-lg font-medium text-white">Multi-Location Authentication</h4>
              </div>
              <p className="text-gray-300 text-sm">
                The vault can be configured to allow access from multiple distinct locations, 
                enabling distributed teams or multi-party access scenarios while maintaining 
                strong security through physical presence requirements.
              </p>
            </div>
            
            <div className="bg-[#242424] border border-[#333] rounded-lg p-5">
              <div className="flex items-center mb-3">
                <Lock className="h-5 w-5 text-[#FF5AF7] mr-3" />
                <h4 className="text-lg font-medium text-white">Tamper-Resistant Verification</h4>
              </div>
              <p className="text-gray-300 text-sm">
                Advanced anti-spoofing measures detect and block common location spoofing 
                techniques. The system uses multi-factor verification including device 
                signals, network characteristics, and environmental data points.
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
            <h3 className="text-xl font-semibold text-white mb-4">1. Location Registration</h3>
            <p className="text-gray-300 mb-4">
              When creating a Geo-Location Vault, the initial setup involves:
            </p>
            <ul className="space-y-2 text-gray-300 mb-4">
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Secure registration of one or more authorized locations</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Definition of geofence radius and precision requirements</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Configuring additional security parameters and recovery options</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Cryptographic hashing of location data to protect privacy</span>
              </li>
            </ul>
            <p className="text-gray-300">
              Location information is stored as cryptographic commitments rather than raw coordinates, 
              ensuring that the actual locations are never exposed on-chain.
            </p>
          </div>
          
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">2. Location Verification Process</h3>
            <p className="text-gray-300 mb-4">
              When a user attempts to access the vault:
            </p>
            <ul className="space-y-2 text-gray-300 mb-4">
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>The user's device generates a location proof using current GPS coordinates</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>A zero-knowledge proof confirms presence within the authorized geofence</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>The proof is submitted to the blockchain for verification</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Anti-spoofing verification checks are performed</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Location proof is combined with other authentication factors (if configured)</span>
              </li>
            </ul>
            <p className="text-gray-300">
              The verification happens without exposing the user's actual location, preserving privacy 
              while proving presence within the authorized geofence.
            </p>
          </div>
          
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">3. Multi-Location Authentication</h3>
            <p className="text-gray-300 mb-4">
              For vaults with multiple authorized locations:
            </p>
            <ul className="space-y-2 text-gray-300 mb-4">
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Each location can have unique access parameters and permissions</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Locations can be designated for specific users in multi-party scenarios</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Access logs record which location was used for each authentication</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Time restrictions can be applied to specific locations (e.g., business hours only)</span>
              </li>
            </ul>
            <p className="text-gray-300">
              This flexibility allows for sophisticated access control patterns while maintaining 
              the physical presence requirement.
            </p>
          </div>
          
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">4. Cross-Chain Security Architecture</h3>
            <p className="text-gray-300 mb-4">
              Geo-Location Vaults leverage our Triple-Chain Security™ architecture:
            </p>
            <ul className="space-y-2 text-gray-300 mb-4">
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Ethereum manages ownership records and access control policies</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Solana handles high-frequency monitoring of location verification attempts</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>TON provides backup security and emergency recovery operations</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Location metadata is verified across all chains for maximum security</span>
              </li>
            </ul>
            <p className="text-gray-300">
              This multi-chain approach ensures that even if a single blockchain is compromised, 
              the location verification remains secure.
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
            <h3 className="text-xl font-semibold text-white mb-4">Location Privacy Protection</h3>
            <p className="text-gray-300 mb-4">
              Our Geo-Location Vault maintains strict privacy with several technical measures:
            </p>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
                <span>
                  <strong className="text-white">Zero-Knowledge Proofs:</strong> Location verification uses zero-knowledge proofs 
                  that confirm presence in a geofence without revealing exact coordinates.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
                <span>
                  <strong className="text-white">Private Metadata:</strong> Location details are never publicly stored on 
                  any blockchain, using cryptographic commitments instead.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
                <span>
                  <strong className="text-white">Local Processing:</strong> Location verification begins on the user's device, 
                  with only proof of verification (not location data) transmitted.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
                <span>
                  <strong className="text-white">Obfuscated Access Logs:</strong> Authentication records show verification 
                  occurred but do not reveal which specific location was used in multi-location setups.
                </span>
              </li>
            </ul>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Map className="h-6 w-6 text-[#FF5AF7] mr-3" />
                <h3 className="text-lg font-semibold text-white">Anti-Spoofing Protection</h3>
              </div>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start">
                  <span className="text-[#FF5AF7] mr-2">•</span>
                  <span><strong className="text-white">Device Integrity:</strong> Verification of device security state and GPS tampering detection</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FF5AF7] mr-2">•</span>
                  <span><strong className="text-white">Network Analysis:</strong> Detection of VPN, proxies and location spoofing services</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FF5AF7] mr-2">•</span>
                  <span><strong className="text-white">Multi-Signal Verification:</strong> Cell tower, WiFi, and other signals cross-checked</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FF5AF7] mr-2">•</span>
                  <span><strong className="text-white">Temporal Consistency:</strong> Verification of location movement patterns for authenticity</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FF5AF7] mr-2">•</span>
                  <span><strong className="text-white">Behavioral Analysis:</strong> Optional AI monitoring for unusual access patterns</span>
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
                  <p className="ml-5 mt-1">Basic location verification with 500m radius geofence</p>
                </li>
                <li>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-blue-400 mr-2"></div>
                    <strong className="text-white">Enhanced (Level 2)</strong>
                  </div>
                  <p className="ml-5 mt-1">Precise location verification with 100m radius and anti-spoofing</p>
                </li>
                <li>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-purple-400 mr-2"></div>
                    <strong className="text-white">Fortress™ (Level 3)</strong>
                  </div>
                  <p className="ml-5 mt-1">Military-grade verification with 50m radius, full anti-spoofing suite, and behavioral monitoring</p>
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
            <h3 className="text-lg font-semibold text-white mb-3">Corporate Treasuries</h3>
            <p className="text-gray-300 text-sm">
              Restrict high-value treasury access to authorized office locations
              for additional corporate governance and security.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[#242424] to-[#1E1E1E] border border-[#333] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Secure Remote Teams</h3>
            <p className="text-gray-300 text-sm">
              Enable distributed teams to access shared resources only from 
              authorized office or secure home locations.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[#242424] to-[#1E1E1E] border border-[#333] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Regulatory Compliance</h3>
            <p className="text-gray-300 text-sm">
              Comply with geo-fencing requirements for regulated digital assets
              that must remain within specific jurisdictions.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[#242424] to-[#1E1E1E] border border-[#333] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Multi-Location Businesses</h3>
            <p className="text-gray-300 text-sm">
              Manage shared assets across multiple office locations with location-specific
              access permissions and security policies.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[#242424] to-[#1E1E1E] border border-[#333] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Secure Estate Planning</h3>
            <p className="text-gray-300 text-sm">
              Require beneficiaries to be physically present at specific locations
              (law office, bank, etc.) to access inheritance assets.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[#242424] to-[#1E1E1E] border border-[#333] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">High-Security Storage</h3>
            <p className="text-gray-300 text-sm">
              Add an additional physical security layer for extremely sensitive
              digital assets requiring maximum protection.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <Link href="/vault-types">
          <Button className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#7B10E7] hover:to-[#FF6AF7] text-white px-8 py-6 h-auto text-lg rounded-xl shadow-lg shadow-[#6B00D7]/30 transition-all hover:shadow-xl hover:shadow-[#6B00D7]/40">
            Create Geo-Location Vault
          </Button>
        </Link>
        <p className="text-gray-400 mt-4">
          Add a physical presence requirement to your digital asset security
        </p>
      </div>
    </div>
  );
};

export default GeoVaultPage;