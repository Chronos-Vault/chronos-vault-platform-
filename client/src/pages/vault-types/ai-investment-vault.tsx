import React from 'react';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Brain, TrendingUp, AlertTriangle, ShieldCheck, BarChart3 } from 'lucide-react';

export default function AIInvestmentVaultPage() {
  const [_, navigate] = useLocation();

  return (
    <>
      <Helmet>
        <title>AI-Assisted Investment Vault | Chronos Vault</title>
        <meta name="description" content="AI-powered investment strategies with market trend analysis and optimal trading suggestions" />
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
          <div className="inline-flex items-center justify-center p-2 mb-4 rounded-full bg-[#00E676]/20 border border-[#00E676]/30">
            <Brain className="h-8 w-8 text-[#00E676]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00E676] to-[#6B00D7] mb-4">
            AI-Assisted Investment Vault
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            A revolutionary vault that uses artificial intelligence to analyze market trends and suggest optimal times for transactions.
          </p>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left column - Features */}
          <div className="col-span-1 lg:col-span-2 space-y-8">
            <Card className="bg-black/20 border-gray-800">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-[#00E676] mb-6">How It Works</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-[#00E676]/20 p-3 rounded-full">
                      <TrendingUp className="h-6 w-6 text-[#00E676]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">AI Market Analysis</h3>
                      <p className="text-gray-300">
                        Our advanced AI constantly analyzes market trends, volatility patterns, and trading volumes across multiple exchanges to identify optimal entry and exit points.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-[#00E676]/20 p-3 rounded-full">
                      <BarChart3 className="h-6 w-6 text-[#00E676]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Customizable Strategies</h3>
                      <p className="text-gray-300">
                        Define your investment goals, risk tolerance, and preferred assets. The AI will create a personalized strategy based on your parameters and adapt as market conditions change.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-[#00E676]/20 p-3 rounded-full">
                      <AlertTriangle className="h-6 w-6 text-[#00E676]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Risk Assessment</h3>
                      <p className="text-gray-300">
                        The system continuously evaluates market risks and security threats, providing real-time alerts and recommendations to protect your investments during turbulent periods.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-[#00E676]/20 p-3 rounded-full">
                      <ShieldCheck className="h-6 w-6 text-[#00E676]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Triple-Chain Security</h3>
                      <p className="text-gray-300">
                        All AI-assisted transactions are secured with our military-grade Triple-Chain Security architecture, requiring verification across Ethereum, TON, and Solana networks.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/20 border-gray-800">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-[#00E676] mb-6">Key Benefits</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">Emotion-Free Trading</h3>
                    <p className="text-gray-300">
                      Remove emotional decision-making from your investment strategy with AI-driven analysis based purely on data and proven market patterns.
                    </p>
                  </div>
                  
                  <div className="border border-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">24/7 Market Monitoring</h3>
                    <p className="text-gray-300">
                      Markets never sleep, and neither does our AI. Continuous monitoring ensures you never miss an opportunity, even when you're offline.
                    </p>
                  </div>
                  
                  <div className="border border-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">Advanced Technical Analysis</h3>
                    <p className="text-gray-300">
                      Leverage sophisticated technical indicators and pattern recognition that would typically require years of trading experience.
                    </p>
                  </div>
                  
                  <div className="border border-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">Adaptable Strategies</h3>
                    <p className="text-gray-300">
                      As market conditions change, your strategy evolves. The AI continuously learns from market behaviors and adjusts its approach.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right column - Sidebar */}
          <div className="col-span-1 space-y-8">
            <Card className="bg-gradient-to-br from-[#00E676]/20 to-black/40 border-[#00E676]/30">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Perfect For</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-[#00E676] mr-3"></div>
                    <span className="text-gray-300">Crypto traders seeking optimal entry/exit points</span>
                  </li>
                  <li className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-[#00E676] mr-3"></div>
                    <span className="text-gray-300">Investors looking for data-driven strategies</span>
                  </li>
                  <li className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-[#00E676] mr-3"></div>
                    <span className="text-gray-300">Those who want to avoid emotional trading decisions</span>
                  </li>
                  <li className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-[#00E676] mr-3"></div>
                    <span className="text-gray-300">Busy professionals who can't monitor markets 24/7</span>
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
                        <div className="h-full bg-[#00E676]" style={{ width: '100%' }}></div>
                      </div>
                      <span className="ml-2 text-[#00E676] font-medium">5/5</span>
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
                        <div className="text-xs text-gray-400 mb-1">Update Frequency</div>
                        <div className="text-sm font-medium text-white">Real-time</div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Strategy Customization</div>
                        <div className="text-sm font-medium text-white">Advanced</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="text-center">
              <Button 
                onClick={() => navigate("/create-vault/ai-investment")}
                className="w-full bg-gradient-to-r from-[#00E676] to-[#6B00D7] hover:opacity-90 text-white font-medium py-6"
              >
                Create AI-Investment Vault
              </Button>
              <p className="text-xs text-gray-400 mt-2">
                Includes all premium security features
              </p>
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center text-white mb-8">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-black/30 border border-gray-800 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-[#00E676] mb-2">How accurate is the AI analysis?</h3>
              <p className="text-gray-300">
                Our AI systems have been trained on decades of market data and continuously learn from new patterns. While no prediction system is perfect, our models consistently outperform traditional technical analysis by identifying subtle correlations across global markets.
              </p>
            </div>
            
            <div className="bg-black/30 border border-gray-800 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-[#00E676] mb-2">Can I override the AI recommendations?</h3>
              <p className="text-gray-300">
                Absolutely. The AI provides recommendations, but you maintain full control. You can set parameters for automatic actions or choose to review all suggestions before execution.
              </p>
            </div>
            
            <div className="bg-black/30 border border-gray-800 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-[#00E676] mb-2">What markets and assets are supported?</h3>
              <p className="text-gray-300">
                The system supports major cryptocurrency markets, traditional stock indexes, forex pairs, and commodity futures. Custom markets can be added based on data availability.
              </p>
            </div>
            
            <div className="bg-black/30 border border-gray-800 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-[#00E676] mb-2">How is my strategy data protected?</h3>
              <p className="text-gray-300">
                All strategy data is encrypted with quantum-resistant algorithms and distributed across our Triple-Chain security architecture. Your investment strategies remain completely private.
              </p>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to optimize your investment strategy?</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-6">
            Leverage the power of artificial intelligence to make data-driven investment decisions and maximize your returns.
          </p>
          <Button 
            onClick={() => navigate("/create-vault/ai-investment")}
            size="lg"
            className="bg-gradient-to-r from-[#00E676] to-[#6B00D7] hover:opacity-90 text-white font-medium"
          >
            Create AI-Investment Vault Now
          </Button>
        </div>
      </div>
    </>
  );
}