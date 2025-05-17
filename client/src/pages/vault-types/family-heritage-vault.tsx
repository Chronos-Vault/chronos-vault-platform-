import React from 'react';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, UsersRound, Graduation, HeartHandshake, Shield, BookOpen } from 'lucide-react';

export default function FamilyHeritageVaultPage() {
  const [_, navigate] = useLocation();

  return (
    <>
      <Helmet>
        <title>Family Heritage Vault | Chronos Vault</title>
        <meta name="description" content="Secure generational wealth transfer with educational modules and gradual inheritance mechanisms" />
      </Helmet>

      <div className="container mx-auto py-12 px-4">
        {/* Back button */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate("/vault-types")}
            className="flex items-center space-x-2 text-gray-400 hover:text-white border-gray-700 hover:border-[#6B00D7]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Vault Types</span>
          </Button>
        </div>
        
        {/* Hero section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-2 mb-4 rounded-full bg-[#E040FB]/20 border border-[#E040FB]/30">
            <UsersRound className="h-8 w-8 text-[#E040FB]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#E040FB] to-[#6B00D7] mb-4">
            Family Heritage Vault
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            A specialized vault designed for generational wealth transfer with educational modules and gradual inheritance mechanisms.
          </p>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left column - Features */}
          <div className="col-span-1 lg:col-span-2 space-y-8">
            <Card className="bg-black/20 border-gray-800">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-[#E040FB] mb-6">How It Works</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-[#E040FB]/20 p-3 rounded-full">
                      <HeartHandshake className="h-6 w-6 text-[#E040FB]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Multi-Generational Planning</h3>
                      <p className="text-gray-300">
                        Create a comprehensive inheritance plan that spans multiple generations with customizable rules, conditions, and asset allocation strategies for smooth wealth transfer.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-[#E040FB]/20 p-3 rounded-full">
                      <Graduation className="h-6 w-6 text-[#E040FB]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Educational Integration</h3>
                      <p className="text-gray-300">
                        Embed personalized educational content and financial literacy resources directly into the vault, ensuring heirs understand the responsibilities and knowledge needed for wealth stewardship.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-[#E040FB]/20 p-3 rounded-full">
                      <BookOpen className="h-6 w-6 text-[#E040FB]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Gradual Transfer Mechanisms</h3>
                      <p className="text-gray-300">
                        Design a phased inheritance process with age-based milestones, educational achievements, and other customizable conditions for responsible wealth transition over time.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-[#E040FB]/20 p-3 rounded-full">
                      <Shield className="h-6 w-6 text-[#E040FB]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Family Governance Protocols</h3>
                      <p className="text-gray-300">
                        Establish transparent decision-making frameworks and dispute resolution mechanisms with configurable voting rights and multi-signature requirements for family members.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/20 border-gray-800">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-[#E040FB] mb-6">Key Benefits</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">Wealth Preservation</h3>
                    <p className="text-gray-300">
                      Protect family assets across generations with advanced security measures and structured inheritance plans that maintain wealth integrity.
                    </p>
                  </div>
                  
                  <div className="border border-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">Values Transmission</h3>
                    <p className="text-gray-300">
                      Pass down not just assets but also family values, wisdom, and vision through customized educational modules and personal messages.
                    </p>
                  </div>
                  
                  <div className="border border-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">Responsible Inheritance</h3>
                    <p className="text-gray-300">
                      Reduce the risks of sudden wealth syndrome by gradually introducing heirs to their inheritance through educational milestones and age-appropriate access.
                    </p>
                  </div>
                  
                  <div className="border border-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">Family Unity</h3>
                    <p className="text-gray-300">
                      Foster harmony and cooperation with transparent governance structures, clear expectations, and equitable asset distribution frameworks.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right column - Sidebar */}
          <div className="col-span-1 space-y-8">
            <Card className="bg-gradient-to-br from-[#E040FB]/20 to-black/40 border-[#E040FB]/30">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Perfect For</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-[#E040FB] mr-3"></div>
                    <span className="text-gray-300">Family business succession planning</span>
                  </li>
                  <li className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-[#E040FB] mr-3"></div>
                    <span className="text-gray-300">Multi-generational wealth transfer</span>
                  </li>
                  <li className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-[#E040FB] mr-3"></div>
                    <span className="text-gray-300">Parents concerned about responsible inheritance</span>
                  </li>
                  <li className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-[#E040FB] mr-3"></div>
                    <span className="text-gray-300">Family legacy preservation</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="bg-black/20 border-gray-800">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Technical Specifications</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Security Level</div>
                    <div className="flex items-center">
                      <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-[#E040FB]" style={{ width: '100%' }}></div>
                      </div>
                      <span className="ml-2 text-[#E040FB] font-medium">5/5</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Complexity Level</div>
                    <div className="flex items-center">
                      <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: '80%' }}></div>
                      </div>
                      <span className="ml-2 text-amber-500 font-medium">4/5</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-700">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Triple-Chain Security</div>
                        <div className="text-sm font-medium text-white">Enabled</div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Quantum Resistance</div>
                        <div className="text-sm font-medium text-white">Enabled</div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Educational Modules</div>
                        <div className="text-sm font-medium text-white">Included</div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Governance Tools</div>
                        <div className="text-sm font-medium text-white">Advanced</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="text-center">
              <Button 
                onClick={() => navigate("/create-vault/family-heritage")}
                className="w-full bg-gradient-to-r from-[#E040FB] to-[#6B00D7] hover:opacity-90 text-white font-medium py-6"
              >
                Create Family Heritage Vault
              </Button>
              <p className="text-xs text-gray-400 mt-2">
                Includes all premium security features
              </p>
            </div>
          </div>
        </div>
        
        {/* Special Features Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center text-white mb-8">Special Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-black/30 border border-gray-800 rounded-lg p-5">
              <div className="rounded-full bg-[#E040FB]/20 w-12 h-12 flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-lg font-semibold text-[#E040FB] mb-2 text-center">Financial Education Library</h3>
              <p className="text-gray-300">
                Customizable educational content covering investing, financial planning, wealth management, and family business concepts tailored to heir ages and knowledge levels.
              </p>
            </div>
            
            <div className="bg-black/30 border border-gray-800 rounded-lg p-5">
              <div className="rounded-full bg-[#E040FB]/20 w-12 h-12 flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-lg font-semibold text-[#E040FB] mb-2 text-center">Legacy Letters</h3>
              <p className="text-gray-300">
                Record personal messages, family history, and values statements that are delivered to heirs at specified milestones, preserving your wisdom for future generations.
              </p>
            </div>
            
            <div className="bg-black/30 border border-gray-800 rounded-lg p-5">
              <div className="rounded-full bg-[#E040FB]/20 w-12 h-12 flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">⚖️</span>
              </div>
              <h3 className="text-lg font-semibold text-[#E040FB] mb-2 text-center">Family Constitution</h3>
              <p className="text-gray-300">
                Create a comprehensive governance framework with decision-making protocols, conflict resolution mechanisms, and family values for harmonious wealth management.
              </p>
            </div>
            
            <div className="bg-black/30 border border-gray-800 rounded-lg p-5">
              <div className="rounded-full bg-[#E040FB]/20 w-12 h-12 flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">🔄</span>
              </div>
              <h3 className="text-lg font-semibold text-[#E040FB] mb-2 text-center">Adaptive Inheritance Path</h3>
              <p className="text-gray-300">
                Intelligent distribution mechanisms that adjust based on heir maturity, financial literacy assessments, and responsible wealth management demonstrations.
              </p>
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center text-white mb-8">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-black/30 border border-gray-800 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-[#E040FB] mb-2">How is this different from a traditional trust?</h3>
              <p className="text-gray-300">
                Unlike traditional trusts, our Family Heritage Vault combines advanced blockchain security with interactive educational components and flexible governance structures. It integrates digital asset management with legacy preservation, offering greater transparency and customization than conventional legal trusts.
              </p>
            </div>
            
            <div className="bg-black/30 border border-gray-800 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-[#E040FB] mb-2">Can multiple family members have administration rights?</h3>
              <p className="text-gray-300">
                Yes, the vault supports sophisticated multi-signature governance with customizable roles and permissions. You can create a family council with various permission levels for different members, from full administrative control to limited viewing rights.
              </p>
            </div>
            
            <div className="bg-black/30 border border-gray-800 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-[#E040FB] mb-2">How are educational requirements verified?</h3>
              <p className="text-gray-300">
                Our system offers multiple verification options including direct integration with educational platforms, completion of built-in financial literacy modules with assessments, or multi-party verification by designated family trustees.
              </p>
            </div>
            
            <div className="bg-black/30 border border-gray-800 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-[#E040FB] mb-2">Is this legally binding like a traditional will?</h3>
              <p className="text-gray-300">
                The Family Heritage Vault can work alongside traditional legal documents. While it provides powerful technical controls for digital assets, we recommend coordinating with legal professionals to ensure alignment with your overall estate planning for maximum effectiveness.
              </p>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to secure your family's legacy?</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-6">
            Create a comprehensive inheritance plan that preserves not just your wealth, but your values and wisdom for generations to come.
          </p>
          <Button 
            onClick={() => navigate("/create-vault/family-heritage")}
            size="lg"
            className="bg-gradient-to-r from-[#E040FB] to-[#6B00D7] hover:opacity-90 text-white font-medium"
          >
            Create Family Heritage Vault Now
          </Button>
        </div>
      </div>
    </>
  );
}