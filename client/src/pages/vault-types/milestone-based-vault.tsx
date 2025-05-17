import React from 'react';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Trophy, Target, Unlock, Shield, Award } from 'lucide-react';

export default function MilestoneBasedVaultPage() {
  const [_, navigate] = useLocation();

  return (
    <>
      <Helmet>
        <title>Milestone-Based Release Vault | Chronos Vault</title>
        <meta name="description" content="Achievement-triggered asset releases with customizable goal verification and progressive unlocking" />
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
          <div className="inline-flex items-center justify-center p-2 mb-4 rounded-full bg-[#FF9800]/20 border border-[#FF9800]/30">
            <Trophy className="h-8 w-8 text-[#FF9800]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF9800] to-[#6B00D7] mb-4">
            Milestone-Based Release Vault
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            An innovative vault that ties asset unlocking to specific achievement milestones, providing incentives for personal and professional growth.
          </p>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left column - Features */}
          <div className="col-span-1 lg:col-span-2 space-y-8">
            <Card className="bg-black/20 border-gray-800">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-[#FF9800] mb-6">How It Works</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-[#FF9800]/20 p-3 rounded-full">
                      <Target className="h-6 w-6 text-[#FF9800]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Goal Definition & Verification</h3>
                      <p className="text-gray-300">
                        Define specific, measurable goals tied to your personal or professional life. Our verification system works with various data sources to confirm when milestones are achieved.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-[#FF9800]/20 p-3 rounded-full">
                      <Award className="h-6 w-6 text-[#FF9800]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Progressive Asset Release</h3>
                      <p className="text-gray-300">
                        Set up a tiered release system where portions of assets are unlocked as you reach different achievement levels. Create your own reward structure for sustained motivation.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-[#FF9800]/20 p-3 rounded-full">
                      <Unlock className="h-6 w-6 text-[#FF9800]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Customizable Release Conditions</h3>
                      <p className="text-gray-300">
                        Configure various verification methods including third-party integrations, smart contracts, witness verification, or trusted oracle networks to confirm achievements.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-[#FF9800]/20 p-3 rounded-full">
                      <Shield className="h-6 w-6 text-[#FF9800]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Triple-Chain Security</h3>
                      <p className="text-gray-300">
                        All milestone data and achievement verification is secured with our military-grade Triple-Chain Security architecture, ensuring tamper-proof goal tracking.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/20 border-gray-800">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-[#FF9800] mb-6">Key Benefits</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">Self-Motivation System</h3>
                    <p className="text-gray-300">
                      Create powerful incentives for achieving personal or professional goals by linking them directly to financial rewards or digital assets.
                    </p>
                  </div>
                  
                  <div className="border border-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">Objective Achievement Tracking</h3>
                    <p className="text-gray-300">
                      Eliminate subjectivity with transparent, verifiable milestone tracking that provides clear evidence of accomplishments.
                    </p>
                  </div>
                  
                  <div className="border border-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">Habit Formation Tool</h3>
                    <p className="text-gray-300">
                      Perfect for building consistent habits by creating ongoing achievement rewards for maintaining positive behaviors over time.
                    </p>
                  </div>
                  
                  <div className="border border-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">Goal Achievement Acceleration</h3>
                    <p className="text-gray-300">
                      Research shows people are 42% more likely to achieve goals when there are tangible incentives directly tied to specific milestones.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right column - Sidebar */}
          <div className="col-span-1 space-y-8">
            <Card className="bg-gradient-to-br from-[#FF9800]/20 to-black/40 border-[#FF9800]/30">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Perfect For</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-[#FF9800] mr-3"></div>
                    <span className="text-gray-300">Personal development and self-improvement goals</span>
                  </li>
                  <li className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-[#FF9800] mr-3"></div>
                    <span className="text-gray-300">Career advancement and professional achievements</span>
                  </li>
                  <li className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-[#FF9800] mr-3"></div>
                    <span className="text-gray-300">Educational milestones and learning objectives</span>
                  </li>
                  <li className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-[#FF9800] mr-3"></div>
                    <span className="text-gray-300">Health and fitness achievement tracking</span>
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
                        <div className="h-full bg-[#FF9800]" style={{ width: '80%' }}></div>
                      </div>
                      <span className="ml-2 text-[#FF9800] font-medium">4/5</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Complexity Level</div>
                    <div className="flex items-center">
                      <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: '60%' }}></div>
                      </div>
                      <span className="ml-2 text-amber-500 font-medium">3/5</span>
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
                        <div className="text-xs text-gray-400 mb-1">Verification Methods</div>
                        <div className="text-sm font-medium text-white">Multiple</div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Partial Releases</div>
                        <div className="text-sm font-medium text-white">Configurable</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="text-center">
              <Button 
                onClick={() => navigate("/create-vault/milestone-based")}
                className="w-full bg-gradient-to-r from-[#FF9800] to-[#6B00D7] hover:opacity-90 text-white font-medium py-6"
              >
                Create Milestone-Based Vault
              </Button>
              <p className="text-xs text-gray-400 mt-2">
                Includes all premium security features
              </p>
            </div>
          </div>
        </div>
        
        {/* Example Use Cases Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center text-white mb-8">Example Use Cases</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-black/30 border border-gray-800 rounded-lg p-5">
              <div className="rounded-full bg-[#FF9800]/20 w-12 h-12 flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">🏋️</span>
              </div>
              <h3 className="text-lg font-semibold text-[#FF9800] mb-2 text-center">Fitness Transformation</h3>
              <p className="text-gray-300">
                Create a vault that releases funds for your dream vacation when you hit specific weight loss or strength goals. Integrate with fitness trackers for automatic verification.
              </p>
            </div>
            
            <div className="bg-black/30 border border-gray-800 rounded-lg p-5">
              <div className="rounded-full bg-[#FF9800]/20 w-12 h-12 flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">🎓</span>
              </div>
              <h3 className="text-lg font-semibold text-[#FF9800] mb-2 text-center">Educational Achievement</h3>
              <p className="text-gray-300">
                Lock funds for a child's use that are progressively released as they achieve educational milestones, from high school graduation to advanced degrees.
              </p>
            </div>
            
            <div className="bg-black/30 border border-gray-800 rounded-lg p-5">
              <div className="rounded-full bg-[#FF9800]/20 w-12 h-12 flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">💼</span>
              </div>
              <h3 className="text-lg font-semibold text-[#FF9800] mb-2 text-center">Career Advancement</h3>
              <p className="text-gray-300">
                Create incentives for professional growth by setting up asset releases tied to career milestones like certifications, promotions, or business revenue targets.
              </p>
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center text-white mb-8">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-black/30 border border-gray-800 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-[#FF9800] mb-2">How are milestones verified?</h3>
              <p className="text-gray-300">
                We offer multiple verification methods: third-party integration with platforms like fitness apps or educational institutions, trusted witness verification, photo/video evidence, or API connections to verifiable data sources.
              </p>
            </div>
            
            <div className="bg-black/30 border border-gray-800 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-[#FF9800] mb-2">Can I customize the release schedule?</h3>
              <p className="text-gray-300">
                Absolutely. You can create a fully customized release schedule with different percentages of assets unlocked at various milestone achievements, from simple to complex multi-step goals.
              </p>
            </div>
            
            <div className="bg-black/30 border border-gray-800 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-[#FF9800] mb-2">What if a milestone becomes impossible?</h3>
              <p className="text-gray-300">
                Our vault includes contingency options including milestone modification with time delays, override capabilities with multi-signature approval, or alternative achievement paths.
              </p>
            </div>
            
            <div className="bg-black/30 border border-gray-800 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-[#FF9800] mb-2">Can milestones have deadlines?</h3>
              <p className="text-gray-300">
                Yes, you can set time-bound milestones with configurable outcomes for missed deadlines, including extended timeframes, alternative goals, or modified release percentages.
              </p>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to achieve your goals?</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-6">
            Create a powerful incentive system by linking your personal and professional goals to progressive asset releases.
          </p>
          <Button 
            onClick={() => navigate("/create-vault/milestone-based")}
            size="lg"
            className="bg-gradient-to-r from-[#FF9800] to-[#6B00D7] hover:opacity-90 text-white font-medium"
          >
            Create Milestone-Based Vault Now
          </Button>
        </div>
      </div>
    </>
  );
}