import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Check, Shield, LineChart, Clock, ArrowUpRight, Lock, TrendingUp } from "lucide-react";

const InvestmentDisciplineVaultDocPage = () => {
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
            <LineChart className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
            Investment Discipline Vault
          </h1>
        </div>
        
        <p className="text-xl text-gray-300 max-w-3xl mb-6">
          A specialized vault designed to enforce investment discipline through time-locked commitment mechanisms and strategy automation.
        </p>

        <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6 max-w-3xl">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Shield className="mr-2 h-5 w-5 text-[#FF5AF7]" /> Key Benefits
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
              <span className="text-gray-300">Enforce disciplined investment strategies through time-locked commitments</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
              <span className="text-gray-300">Prevent emotional selling during market volatility</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
              <span className="text-gray-300">Automate dollar-cost averaging and other systematic investment strategies</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
              <span className="text-gray-300">Implement preset profit-taking triggers and stop-loss protections</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
              <span className="text-gray-300">Track investment performance with detailed analytics</span>
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
            The Investment Discipline Vault extends our standard vault architecture with specialized 
            components designed to enforce investment discipline and automate strategic investment decisions. 
            It combines secure asset management with strategy enforcement mechanisms.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3 text-white">Key Technologies</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-[#242424] border border-[#333] rounded-lg p-5">
              <div className="flex items-center mb-3">
                <Clock className="h-5 w-5 text-[#FF5AF7] mr-3" />
                <h4 className="text-lg font-medium text-white">Time-Bound Commitment System</h4>
              </div>
              <p className="text-gray-300 text-sm">
                Assets are locked for predetermined periods using time-lock smart contracts, 
                enforcing holding periods regardless of market conditions. Different assets 
                can have various lock periods based on strategy requirements.
              </p>
            </div>
            
            <div className="bg-[#242424] border border-[#333] rounded-lg p-5">
              <div className="flex items-center mb-3">
                <ArrowUpRight className="h-5 w-5 text-[#FF5AF7] mr-3" />
                <h4 className="text-lg font-medium text-white">Automated Strategy Execution</h4>
              </div>
              <p className="text-gray-300 text-sm">
                Smart contracts automatically execute predefined investment strategies such as 
                dollar-cost averaging, portfolio rebalancing, or gradual profit taking. 
                Once configured, these strategies operate without requiring manual intervention.
              </p>
            </div>
            
            <div className="bg-[#242424] border border-[#333] rounded-lg p-5">
              <div className="flex items-center mb-3">
                <Lock className="h-5 w-5 text-[#FF5AF7] mr-3" />
                <h4 className="text-lg font-medium text-white">Condition-Based Unlocking</h4>
              </div>
              <p className="text-gray-300 text-sm">
                Beyond simple time-based locks, vaults can be configured with condition-based 
                unlocking parameters such as price targets, blockchain events (like Bitcoin halvings), 
                or market indicators. These create strategic entry and exit points.
              </p>
            </div>
            
            <div className="bg-[#242424] border border-[#333] rounded-lg p-5">
              <div className="flex items-center mb-3">
                <TrendingUp className="h-5 w-5 text-[#FF5AF7] mr-3" />
                <h4 className="text-lg font-medium text-white">Performance Analytics Engine</h4>
              </div>
              <p className="text-gray-300 text-sm">
                Built-in analytics track investment performance against various benchmarks and 
                provide visual representations of strategy effectiveness. The system calculates 
                ROI, volatility metrics, and comparative performance indicators.
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
            <h3 className="text-xl font-semibold text-white mb-4">1. Strategy Configuration</h3>
            <p className="text-gray-300 mb-4">
              Setting up an Investment Discipline Vault involves:
            </p>
            <ul className="space-y-2 text-gray-300 mb-4">
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Selecting a primary investment strategy (HODL, DCA, Value Averaging, etc.)</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Defining time parameters for asset locks (e.g., 1 year, 4 years, until a specific date)</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Setting up automation rules for recurring purchases or sales</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Configuring conditional triggers for special actions (profit-taking, rebalancing)</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Enabling emergency override conditions (if desired)</span>
              </li>
            </ul>
            <p className="text-gray-300">
              The vault generates a transparent strategy contract that codifies these rules and 
              makes them immutable once activated, ensuring discipline will be maintained.
            </p>
          </div>
          
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">2. Strategy Enforcement Mechanisms</h3>
            <p className="text-gray-300 mb-4">
              The vault enforces investment discipline through multiple mechanisms:
            </p>
            <ul className="space-y-2 text-gray-300 mb-4">
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Time-locked smart contracts prevent premature asset withdrawal</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Automated buying at predetermined intervals for DCA strategies</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Incremental profit-taking at preset price targets</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Portfolio rebalancing when asset allocations drift beyond thresholds</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Optional external verifiers for strategy compliance</span>
              </li>
            </ul>
            <p className="text-gray-300">
              These mechanisms operate autonomously once the vault is activated, removing 
              emotional decision-making from the investment process.
            </p>
          </div>
          
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">3. Oracle Integration</h3>
            <p className="text-gray-300 mb-4">
              For price-based conditions and triggers, the vault integrates with multiple oracles:
            </p>
            <ul className="space-y-2 text-gray-300 mb-4">
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Chainlink price feeds for reliable on-chain price data</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Specialized oracles for market indicators and economic data</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Multi-oracle verification for critical price-based decisions</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Tamper-proof execution based on verified external data</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Median price calculations to prevent oracle manipulation</span>
              </li>
            </ul>
            <p className="text-gray-300">
              This oracle architecture ensures that investment strategies dependent on market 
              conditions can execute reliably and securely.
            </p>
          </div>
          
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">4. Performance Monitoring & Analytics</h3>
            <p className="text-gray-300 mb-4">
              The vault provides comprehensive monitoring and analysis tools:
            </p>
            <ul className="space-y-2 text-gray-300 mb-4">
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Real-time performance tracking against strategy benchmarks</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Comparative analysis showing performance vs. market indexes</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Detailed transaction history with strategy context for each action</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Projected outcomes based on current performance and market conditions</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Performance notifications and summary reports</span>
              </li>
            </ul>
            <p className="text-gray-300">
              These tools provide transparency into strategy performance without allowing 
              emotional reactions to impact the disciplined execution of the investment plan.
            </p>
          </div>
        </div>
      </div>

      {/* Strategy Templates Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 border-b border-[#333] pb-2">
          Pre-Configured Strategy Templates
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-[#6B00D7]/20 flex items-center justify-center mr-4">
                <Clock className="h-5 w-5 text-[#FF5AF7]" />
              </div>
              <h3 className="text-lg font-semibold text-white">Diamond Hands HODL</h3>
            </div>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span><strong className="text-white">Time Lock:</strong> Minimum 4-year complete asset lock</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span><strong className="text-white">Strategy:</strong> Pure buy-and-hold with zero selling allowed</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span><strong className="text-white">Features:</strong> Bitcoin halving-aligned unlock dates, emergency-only override</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span><strong className="text-white">Best For:</strong> Long-term Bitcoin or blue-chip crypto believers</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-[#6B00D7]/20 flex items-center justify-center mr-4">
                <ArrowUpRight className="h-5 w-5 text-[#FF5AF7]" />
              </div>
              <h3 className="text-lg font-semibold text-white">Automated DCA</h3>
            </div>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span><strong className="text-white">Time Lock:</strong> Configured per asset, typically 2+ years</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span><strong className="text-white">Strategy:</strong> Automated recurring purchases at preset intervals</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span><strong className="text-white">Features:</strong> Stablecoin reserve management, automatic execution</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span><strong className="text-white">Best For:</strong> Regular investors seeking portfolio growth with reduced volatility</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-[#6B00D7]/20 flex items-center justify-center mr-4">
                <TrendingUp className="h-5 w-5 text-[#FF5AF7]" />
              </div>
              <h3 className="text-lg font-semibold text-white">Strategic Profit-Taking</h3>
            </div>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span><strong className="text-white">Time Lock:</strong> Dynamic, based on price targets rather than time</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span><strong className="text-white">Strategy:</strong> Tiered profit-taking at predetermined price levels</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span><strong className="text-white">Features:</strong> Configurable percentage sales at each tier, partial profit locking</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span><strong className="text-white">Best For:</strong> Investors seeking profit protection in volatile markets</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-[#6B00D7]/20 flex items-center justify-center mr-4">
                <Lock className="h-5 w-5 text-[#FF5AF7]" />
              </div>
              <h3 className="text-lg font-semibold text-white">Balanced Portfolio Keeper</h3>
            </div>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span><strong className="text-white">Time Lock:</strong> Minimum 1-year with partial rebalancing allowed</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span><strong className="text-white">Strategy:</strong> Automatic portfolio rebalancing to maintain target allocations</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span><strong className="text-white">Features:</strong> Drift thresholds, tax-efficiency optimization, custom asset classes</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span><strong className="text-white">Best For:</strong> Diversified investors seeking structured risk management</span>
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
            <h3 className="text-lg font-semibold text-white mb-3">Long-Term HODL Discipline</h3>
            <p className="text-gray-300 text-sm">
              For investors who believe in long-term appreciation but struggle to avoid 
              selling during market volatility, enforcing true "diamond hands" strategy.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[#242424] to-[#1E1E1E] border border-[#333] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Automated DCA Programs</h3>
            <p className="text-gray-300 text-sm">
              Implement consistent dollar-cost averaging strategies that continue 
              regardless of market conditions, removing emotion from buying decisions.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[#242424] to-[#1E1E1E] border border-[#333] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Structured Profit-Taking</h3>
            <p className="text-gray-300 text-sm">
              Enforce discipline around taking profits at predetermined levels, 
              preventing the common mistakes of selling too early or too late.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[#242424] to-[#1E1E1E] border border-[#333] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Group Investment Clubs</h3>
            <p className="text-gray-300 text-sm">
              Create shared investment strategies for investment clubs or DAOs where 
              rules are transparently enforced for all participants equally.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[#242424] to-[#1E1E1E] border border-[#333] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Education Portfolios</h3>
            <p className="text-gray-300 text-sm">
              Build investment portfolios for education funds with preset time horizons 
              and increasingly conservative allocations as the target date approaches.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[#242424] to-[#1E1E1E] border border-[#333] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Corporate Treasury Management</h3>
            <p className="text-gray-300 text-sm">
              Implement transparent investment policies for corporate treasuries with 
              governance controls and predefined risk management strategies.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <Link href="/vault-types">
          <Button className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#7B10E7] hover:to-[#FF6AF7] text-white px-8 py-6 h-auto text-lg rounded-xl shadow-lg shadow-[#6B00D7]/30 transition-all hover:shadow-xl hover:shadow-[#6B00D7]/40">
            Create Investment Discipline Vault
          </Button>
        </Link>
        <p className="text-gray-400 mt-4">
          Transform your investment strategy with automated discipline and time-locked commitments
        </p>
      </div>
    </div>
  );
};

export default InvestmentDisciplineVaultDocPage;