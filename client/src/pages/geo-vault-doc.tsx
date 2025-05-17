import React from 'react';
import { Link } from 'wouter';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MapPin, Shield, Globe, Lock, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const GeoVaultDocPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header Section */}
      <div className="mb-12">
        <Link href="/vault-school">
          <Button variant="ghost" className="mb-6 hover:bg-[#00D74B]/10">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Vault School
          </Button>
        </Link>

        <div className="flex items-center mb-4">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#00D74B] to-[#47A0FF] flex items-center justify-center shadow-lg shadow-[#00D74B]/30 mr-4">
            <MapPin className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00D74B] to-[#47A0FF]">
            Geolocation Vault
          </h1>
        </div>
        
        <p className="text-xl text-gray-300 max-w-3xl mb-6">
          Advanced vault security with location-based authentication, enabling physical presence requirements for asset access.
        </p>

        <div className="flex flex-wrap gap-3 mb-8">
          <Badge variant="secondary" className="bg-[#00D74B]/20 text-[#00D74B] border-[#00D74B]/50">
            <Globe className="h-3 w-3 mr-1" /> Geographic Authentication
          </Badge>
          <Badge variant="secondary" className="bg-[#00D74B]/20 text-[#00D74B] border-[#00D74B]/50">
            <Shield className="h-3 w-3 mr-1" /> Physical Security Layer
          </Badge>
          <Badge variant="secondary" className="bg-[#00D74B]/20 text-[#00D74B] border-[#00D74B]/50">
            <MapPin className="h-3 w-3 mr-1" /> GPS-Verified Access
          </Badge>
          <Badge variant="secondary" className="bg-[#00D74B]/20 text-[#00D74B] border-[#00D74B]/50">
            <Lock className="h-3 w-3 mr-1" /> Location-Restricted Transactions
          </Badge>
          <Badge variant="secondary" className="bg-[#00D74B]/20 text-[#00D74B] border-[#00D74B]/50">
            <Clock className="h-3 w-3 mr-1" /> Time-Location Integration
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <Card className="bg-black/50 border border-[#00D74B]/20">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold text-[#00D74B] mb-4">How Geolocation Vaults Work</h2>
            <p className="text-gray-300 mb-4">
              Geolocation vaults add a physical security layer to your digital assets by requiring 
              you to be in a specific location to access your vault.
            </p>
            
            <Separator className="my-6 bg-[#00D74B]/20" />
            
            <h3 className="text-xl font-semibold mb-3">Key Features</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="text-[#00D74B] mr-2">•</span>
                <span>Define circular, polygon, or country-based boundaries</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#00D74B] mr-2">•</span>
                <span>Real-time GPS verification during transactions</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#00D74B] mr-2">•</span>
                <span>Configurable accuracy requirements (10m to 1km)</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#00D74B] mr-2">•</span>
                <span>Optional multi-factor authentication with location</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#00D74B] mr-2">•</span>
                <span>Combine with time-based restrictions for enhanced security</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border border-[#00D74B]/20">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold text-[#00D74B] mb-4">Use Cases</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-white">Business Transaction Security</h3>
                <p className="text-gray-300">
                  Limit high-value business transactions to your office location only, preventing
                  unauthorized access from other locations.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-white">Secure Inheritance Planning</h3>
                <p className="text-gray-300">
                  Ensure heirs must visit a specific location (e.g., a lawyer's office) to
                  access inheritance assets.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-white">Travel Security</h3>
                <p className="text-gray-300">
                  Create country-specific vaults that only activate when you're traveling abroad,
                  with limited funds for your journey.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-white">Physical Branch Banking</h3>
                <p className="text-gray-300">
                  Require physical presence at specific locations to access certain corporate accounts
                  or high-value assets.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Technical Implementation */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-[#00D74B] mb-6">Technical Implementation</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-black/50 border border-[#00D74B]/20">
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <MapPin className="h-5 w-5 text-[#00D74B] mr-2" />
                <h3 className="text-xl font-medium">Boundary Types</h3>
              </div>
              <p className="text-gray-300">
                Configure your vault with circular boundaries (center point + radius),
                polygon boundaries (multiple coordinates), or country-level boundaries
                for macro-level security.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-black/50 border border-[#00D74B]/20">
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <Shield className="h-5 w-5 text-[#00D74B] mr-2" />
                <h3 className="text-xl font-medium">Verification System</h3>
              </div>
              <p className="text-gray-300">
                Our system uses GPS, IP geolocation, and cell tower triangulation
                to verify your physical presence with high accuracy before
                authorizing access to your vault.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-black/50 border border-[#00D74B]/20">
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <Clock className="h-5 w-5 text-[#00D74B] mr-2" />
                <h3 className="text-xl font-medium">Time-Location Integration</h3>
              </div>
              <p className="text-gray-300">
                Combine location restrictions with time windows, allowing access only
                during business hours at your office or specific days at designated locations.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Security & Privacy */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-[#00D74B] mb-6">Security & Privacy</h2>
        
        <Card className="bg-black/50 border border-[#00D74B]/20 mb-8">
          <CardContent className="pt-6">
            <p className="text-gray-300 mb-4">
              While geolocation vaults add a powerful security layer, we've implemented
              several features to protect your privacy and ensure system reliability:
            </p>
            
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="text-[#00D74B] mr-2">•</span>
                <span>
                  <strong className="text-white">Accuracy Control:</strong> You define the required accuracy level,
                  from precise (10m) to general area (1km+).
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[#00D74B] mr-2">•</span>
                <span>
                  <strong className="text-white">Privacy-Preserving Verification:</strong> Location data is verified
                  on-device using zero-knowledge proofs, not stored on our servers.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[#00D74B] mr-2">•</span>
                <span>
                  <strong className="text-white">Fallback Mechanisms:</strong> Emergency access options
                  available through multi-signature verification if location access is impossible.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[#00D74B] mr-2">•</span>
                <span>
                  <strong className="text-white">Anti-Spoofing Protection:</strong> Advanced detection
                  of GPS spoofing attempts and location falsification.
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <Link href="/vault-types">
          <Button className="bg-gradient-to-r from-[#00D74B] to-[#47A0FF] hover:from-[#00E750] hover:to-[#50A8FF] text-white px-8 py-6 h-auto text-lg rounded-xl shadow-lg shadow-[#00D74B]/30 transition-all hover:shadow-xl hover:shadow-[#00D74B]/40">
            Create Geolocation Vault
          </Button>
        </Link>
        <p className="text-gray-400 mt-4">
          Add a physical security layer to your digital assets with location-based authentication
        </p>
      </div>
    </div>
  );
};

export default GeoVaultDocPage;