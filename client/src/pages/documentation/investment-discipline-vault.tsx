import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import DocumentationLayout from "@/components/layout/DocumentationLayout";
import { 
  BarChart, 
  Shield, 
  Lock, 
  TrendingUp, 
  Timer,
  CheckCircle, 
  AlertTriangle, 
  Calendar,
  Code, 
  HelpCircle,
  LineChart,
  Target,
  Clock,
  BrainCircuit,
  HandCoins
} from "lucide-react";

const InvestmentDisciplineVaultDocumentation = () => {
  return (
    <DocumentationLayout>
      <div className="container mx-auto py-10 px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-blue-600">
              Investment Discipline Vault
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              Smart time-locked investing with emotion-resistant mechanisms
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button asChild className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700">
              <Link href="/vault-types">View All Vault Types</Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-5 w-full mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-6 w-6 text-emerald-500" />
                  Behavioral Finance Protection
                </CardTitle>
                <CardDescription>
                  Overcome the psychological barriers to successful investing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-gradient-to-r from-emerald-50 to-blue-50 p-6 border border-emerald-100 dark:from-emerald-950/20 dark:to-blue-950/20 dark:border-emerald-900/50">
                  <p className="text-lg mb-4">
                    The Investment Discipline Vault is a specialized blockchain solution designed to solve the most persistent problem in investing: human psychology. By creating a sophisticated time-locked investment framework with conditional release mechanisms, the vault helps investors overcome emotional biases, behavioral inconsistency, and short-term thinking that typically undermine long-term financial success.
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-2 text-emerald-700 dark:text-emerald-400">Emotion-Resistant Architecture</h3>
                  <p className="mb-4">
                    Unlike conventional investment accounts that provide unrestricted access, the Investment Discipline Vault implements commitment mechanisms that protect investors from their own psychological vulnerabilities. The vault's emotion-resistant architecture creates a powerful barrier against panic selling during market volatility, impulsive portfolio adjustments, and the natural human tendency to chase recent performance—allowing your rational investment plan to work as designed.
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-2 text-emerald-700 dark:text-emerald-400">Strategic Time-Locking</h3>
                  <p className="mb-4">
                    The core of the vault's effectiveness comes from its sophisticated time-locking mechanisms. You can structure your investments with predefined holding periods that align with your true long-term objectives, create graduated access schedules that allow partial liquidity while maintaining core positions, and implement cooling-off periods that prevent reactionary decisions during market turbulence. These temporal constraints become powerful allies in maintaining investment discipline.
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-2 text-emerald-700 dark:text-emerald-400">Rule-Based Investment Execution</h3>
                  <p>
                    Beyond basic time-locking, the vault incorporates advanced rule-based execution systems that automate your investment strategy according to predefined parameters. Implement systematic investment plans with automatic periodic purchases, create rules-based rebalancing that maintains your target asset allocation, and design conditional release structures that adapt to market conditions or personal circumstances. This removes the burden of constantly making active decisions and helps maintain consistency.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="justify-between border-t p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4" />
                  Turn psychological barriers into structural advantages
                </div>
                <Button variant="outline" asChild>
                  <Link href="/investment-discipline-vault">Create Discipline Vault</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="features">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-emerald-500" />
                  Key Features
                </CardTitle>
                <CardDescription>
                  Explore the unique capabilities of Investment Discipline Vaults
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-lg border bg-card shadow p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Timer className="h-8 w-8 text-emerald-500" />
                      <h3 className="text-xl font-semibold">Customizable Time-Lock Parameters</h3>
                    </div>
                    <p>
                      Configure time constraints that match your specific investment goals and psychological profile. Create fixed-term locks for core long-term holdings, implement graduated release schedules that provide increasing access over time, set up recurring investment windows that only allow rebalancing at predetermined intervals, and design emergency access protocols with appropriate verification requirements and cooling-off periods. The flexible framework can be tailored to your unique financial plan.
                    </p>
                  </div>
                  
                  <div className="rounded-lg border bg-card shadow p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Calendar className="h-8 w-8 text-emerald-500" />
                      <h3 className="text-xl font-semibold">Systematic Investment Programs</h3>
                    </div>
                    <p>
                      Implement automated investment schedules that ensure disciplined capital deployment regardless of market conditions. Configure dollar-cost averaging programs with customizable frequency and amount parameters, design value-averaging plans that adjust contributions based on portfolio performance, create automated reinvestment systems for dividends and interest, and implement systematic withdrawal schedules for retirement or income-focused strategies.
                    </p>
                  </div>
                  
                  <div className="rounded-lg border bg-card shadow p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Target className="h-8 w-8 text-emerald-500" />
                      <h3 className="text-xl font-semibold">Rule-Based Rebalancing System</h3>
                    </div>
                    <p>
                      Maintain your target asset allocation without emotional interference through the automated rebalancing engine. Set threshold-based rebalancing rules that trigger when allocations drift beyond specified parameters, implement time-based rebalancing on a fixed schedule, create custom rebalancing logic based on multiple conditions, and design intelligent tax-aware rebalancing that minimizes tax implications while maintaining allocation targets.
                    </p>
                  </div>
                  
                  <div className="rounded-lg border bg-card shadow p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <BrainCircuit className="h-8 w-8 text-emerald-500" />
                      <h3 className="text-xl font-semibold">Behavioral Guardrails</h3>
                    </div>
                    <p>
                      Protect yourself from common behavioral investment mistakes with specialized guardrail mechanisms. Implement circuit breakers that temporarily restrict access during extreme market volatility, create staged confirmation requirements for large transactions, design automatic diversification rules that prevent concentration risk, and configure perspective-enhancing notifications that provide historical context during market events to combat recency bias.
                    </p>
                  </div>
                  
                  <div className="rounded-lg border bg-card shadow p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <LineChart className="h-8 w-8 text-emerald-500" />
                      <h3 className="text-xl font-semibold">Goal-Based Portfolio Structures</h3>
                    </div>
                    <p>
                      Organize investments according to specific financial objectives with targeted security parameters. Create separate sub-portfolios for different time horizons (short, medium, and long-term goals), implement liability-matching portfolios with customized time-release schedules aligned to future financial needs, design goal-specific investment policies with appropriate risk parameters, and track progress toward each financial objective with dedicated performance metrics.
                    </p>
                  </div>
                  
                  <div className="rounded-lg border bg-card shadow p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <HandCoins className="h-8 w-8 text-emerald-500" />
                      <h3 className="text-xl font-semibold">Conditional Access Framework</h3>
                    </div>
                    <p>
                      Create sophisticated conditional release structures that adapt to changing circumstances. Define market-condition triggers that modify access rules during significant market events, implement milestone-based unlocking tied to portfolio performance or contribution goals, create life-event exceptions that provide appropriate access for major financial needs, and design multi-signature governance for joint financial relationships or family investments.
                    </p>
                  </div>
                </div>
                
                <div className="mt-8 p-6 border rounded-lg bg-emerald-50 dark:bg-emerald-950/20">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                    <Clock className="h-5 w-5" />
                    Custom Strategy Templates
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-white dark:bg-black/20 rounded-lg shadow-sm">
                      <p className="text-sm font-medium">Retirement Optimization</p>
                      <p className="text-xs text-muted-foreground mt-1">Age-based investment strategy with progressive access</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-black/20 rounded-lg shadow-sm">
                      <p className="text-sm font-medium">Education Funding</p>
                      <p className="text-xs text-muted-foreground mt-1">Time-targeted strategy for educational expenses</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-black/20 rounded-lg shadow-sm">
                      <p className="text-sm font-medium">Value Investor</p>
                      <p className="text-xs text-muted-foreground mt-1">Counter-cyclical discipline framework</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-black/20 rounded-lg shadow-sm">
                      <p className="text-sm font-medium">Next Generation Legacy</p>
                      <p className="text-xs text-muted-foreground mt-1">Multi-decade wealth transfer structure</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-black/20 rounded-lg shadow-sm">
                      <p className="text-sm font-medium">Entrepreneur Liquidity</p>
                      <p className="text-xs text-muted-foreground mt-1">Business exit wealth preservation system</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-black/20 rounded-lg shadow-sm">
                      <p className="text-sm font-medium">Income Distribution</p>
                      <p className="text-xs text-muted-foreground mt-1">Sustainable withdrawal framework</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-emerald-500" />
                  Security Architecture
                </CardTitle>
                <CardDescription>
                  How we protect your investment strategy and assets
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-emerald-700 dark:text-emerald-400">Security Philosophy</h3>
                  <p className="text-muted-foreground">
                    The Investment Discipline Vault's security architecture operates on two fundamental levels: protecting your assets from external threats and protecting your strategy from internal psychological vulnerabilities. This dual-layer approach creates a comprehensive security system that addresses both traditional cybersecurity concerns and the unique behavioral challenges of investment management. The vault implements multiple independent security mechanisms that work together to ensure both your assets and your investment discipline remain intact.
                  </p>
                  
                  <div className="rounded-lg border p-4 bg-slate-50 dark:bg-slate-900 mb-6">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Lock className="h-4 w-4 mr-2 text-emerald-500" />
                      Asset Security Framework
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      The fundamental security mechanisms protecting your investment assets:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="bg-white dark:bg-black/20 p-3 rounded border">
                        <span className="text-emerald-500 font-semibold block mb-1">Triple Chain Security</span>
                        All investment positions are secured through cross-chain verification on Ethereum, Solana, and TON networks, ensuring that even if one blockchain were compromised, your assets remain protected.
                      </div>
                      <div className="bg-white dark:bg-black/20 p-3 rounded border">
                        <span className="text-emerald-500 font-semibold block mb-1">Multi-Signature Authentication</span>
                        Critical investment operations require authentication through multiple verification factors, creating defense-in-depth that prevents unauthorized access even if individual credentials are compromised.
                      </div>
                      <div className="bg-white dark:bg-black/20 p-3 rounded border">
                        <span className="text-emerald-500 font-semibold block mb-1">Transaction Verification System</span>
                        All investment transactions undergo multi-stage verification with cryptographic validation across multiple chains, creating an immutable audit trail of all portfolio activities.
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border p-4 bg-slate-50 dark:bg-slate-900 mb-6">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Timer className="h-4 w-4 mr-2 text-emerald-500" />
                      Temporal Security Mechanisms
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Time-based security features that protect your investment strategy:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="bg-white dark:bg-black/20 p-3 rounded border">
                        <span className="text-emerald-500 font-semibold block mb-1">Cryptographic Time-Locking</span>
                        Portfolio access constraints are enforced through advanced cryptographic time-lock puzzles, creating mathematically verifiable temporal security that cannot be circumvented.
                      </div>
                      <div className="bg-white dark:bg-black/20 p-3 rounded border">
                        <span className="text-emerald-500 font-semibold block mb-1">Decentralized Temporal Validation</span>
                        Time constraints are validated through consensus across multiple independent time sources, preventing manipulation of time-dependent access controls.
                      </div>
                      <div className="bg-white dark:bg-black/20 p-3 rounded border">
                        <span className="text-emerald-500 font-semibold block mb-1">Progressive Access Control</span>
                        Multi-stage authentication requirements increase proportionally with the significance of investment changes, creating appropriate friction for consequential decisions.
                      </div>
                      <div className="bg-white dark:bg-black/20 p-3 rounded border">
                        <span className="text-emerald-500 font-semibold block mb-1">Temporal Recovery Protocols</span>
                        Emergency access mechanisms include mandatory time delays with automated notifications, allowing intervention if unauthorized access is attempted.
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border p-4 bg-slate-50 dark:bg-slate-900">
                    <h4 className="font-medium mb-2 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2 text-emerald-500" />
                      Behavioral Security System
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Advanced mechanisms protecting your investment strategy from psychological vulnerabilities:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="bg-white dark:bg-black/20 p-3 rounded border">
                        <span className="text-emerald-500 font-semibold block mb-1">Volatility-Adaptive Access Controls</span>
                        Access restrictions automatically adjust during periods of extreme market volatility, protecting against emotionally-driven decisions during market stress.
                      </div>
                      <div className="bg-white dark:bg-black/20 p-3 rounded border">
                        <span className="text-emerald-500 font-semibold block mb-1">Cognitive Debiasing Protocols</span>
                        Transaction interfaces implement "cooling off" periods, contextual information displays, and commitment reminders that mitigate common cognitive biases.
                      </div>
                      <div className="bg-white dark:bg-black/20 p-3 rounded border">
                        <span className="text-emerald-500 font-semibold block mb-1">Strategy Deviation Alerts</span>
                        Automated monitoring detects and flags potential deviations from your investment policy statement, providing accountability to your stated strategy.
                      </div>
                      <div className="bg-white dark:bg-black/20 p-3 rounded border">
                        <span className="text-emerald-500 font-semibold block mb-1">Psychological Verification Layers</span>
                        Major portfolio changes require explicit acknowledgment of investment principles and confirmation of alignment with long-term objectives.
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technical">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-6 w-6 text-emerald-500" />
                  Technical Specifications
                </CardTitle>
                <CardDescription>
                  Detailed technical information about Investment Discipline Vaults
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="rounded-lg border p-4">
                    <h3 className="text-lg font-medium mb-3 text-emerald-600">Time-Lock Implementation</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-medium mb-2">Temporal Security Architecture</h4>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                          <li>Cryptographic time-lock puzzles with verifiable delay functions</li>
                          <li>Decentralized timestamp oracle verification across networks</li>
                          <li>Smart contract time-bound access controls with on-chain validation</li>
                          <li>Time-verification consensus requiring multi-chain agreement</li>
                          <li>Temporal policy enforcement through distributed validation</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Time-Lock Configuration Options</h4>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                          <li>Fixed-term locks: 1 month to 30 years with calendar/block height specification</li>
                          <li>Graduated release schedules: Progressive unlocking with custom intervals</li>
                          <li>Conditional time modifiers based on portfolio value or market metrics</li>
                          <li>Rolling time-locks with automatic renewal capabilities</li>
                          <li>Mixed-duration frameworks with separate rules by asset class</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border p-4">
                    <h3 className="text-lg font-medium mb-3 text-emerald-600">Investment Rule Engine</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-medium mb-2">Rule Implementation Framework</h4>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                          <li>Declarative rule specification with formal verification</li>
                          <li>Cross-chain rule enforcement with distributed execution</li>
                          <li>Rule priority hierarchies for conflict resolution</li>
                          <li>Conditional logic support with complex boolean operations</li>
                          <li>Temporal rule scheduling with calendar/block triggers</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Rule Types and Parameters</h4>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                          <li>Automatic investment rules: Amount, frequency, target allocation</li>
                          <li>Rebalancing rules: Threshold triggers, frequency, priority order</li>
                          <li>Withdrawal rules: Schedule, amount calculation, source determination</li>
                          <li>Tax-optimization rules: Lot selection, loss harvesting parameters</li>
                          <li>Emergency override rules: Condition definition, verification requirements</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border p-4">
                    <h3 className="text-lg font-medium mb-3 text-emerald-600">Asset Support and Portfolio Management</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-medium mb-2">Supported Asset Types</h4>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                          <li>Native cryptocurrencies: ETH, SOL, TON, BTC (via wrapped tokens)</li>
                          <li>Tokens: ERC-20, SPL, TRC-20 with standards compliance verification</li>
                          <li>DeFi positions: Liquidity provider tokens, yield-bearing assets</li>
                          <li>Tokenized traditional assets: Tokenized equities, bonds, commodities</li>
                          <li>NFTs with liquidity profiles and valuation mechanisms</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Portfolio Structures</h4>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                          <li>Multi-portfolio organization with separate security policies</li>
                          <li>Goal-based sub-portfolios with specified objectives</li>
                          <li>Hierarchical asset classification system with custom categories</li>
                          <li>Asset isolation through separate contract deployments</li>
                          <li>Cross-portfolio dependency management and constraints</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border p-4">
                    <h3 className="text-lg font-medium mb-3 text-emerald-600">Analytics and Reporting System</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-medium mb-2">Performance Metrics</h4>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                          <li>Time-weighted and money-weighted return calculations</li>
                          <li>Risk-adjusted performance metrics (Sharpe, Sortino ratios)</li>
                          <li>Benchmark comparisons with custom reference indices</li>
                          <li>Attribution analysis across asset classes and strategies</li>
                          <li>Goal progress tracking against targeted objectives</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Behavioral Analytics</h4>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                          <li>Discipline adherence scoring against stated strategy</li>
                          <li>Emotional response pattern identification during volatility</li>
                          <li>Strategy consistency metrics across market cycles</li>
                          <li>Behavioral bias detection through action pattern analysis</li>
                          <li>Long-term decision quality assessment frameworks</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-4">
                    The Investment Discipline Vault combines sophisticated cryptographic time-locking, cross-chain rule enforcement, and behavioral security mechanisms to create a comprehensive system for maintaining investment discipline. The technical implementation focuses on creating verifiable constraints that protect your long-term strategy while maintaining appropriate flexibility for legitimate financial needs and changing circumstances.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faq">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-6 w-6 text-emerald-500" />
                  Frequently Asked Questions
                </CardTitle>
                <CardDescription>
                  Common questions about Investment Discipline Vaults
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">What happens if I need emergency access to my investments?</h3>
                    <p className="text-muted-foreground">
                      The Investment Discipline Vault includes thoughtfully designed emergency access protocols:
                      <br /><br />
                      <strong>Emergency Access Policy:</strong> When setting up your vault, you define what constitutes a legitimate emergency and configure appropriate verification requirements. This creates a predefined framework for exceptional circumstances while preventing impulsive decisions.
                      <br /><br />
                      <strong>Verification Process:</strong> Emergency access typically requires enhanced identity verification, explicit acknowledgment of the policy exception, and often includes a mandatory cooling-off period (typically 24-72 hours) that allows for reflection before significant withdrawals.
                      <br /><br />
                      <strong>Partial Access Option:</strong> Most users configure their vaults to allow limited emergency access (e.g., up to 20% of assets) with simplified verification, while maintaining stronger protections on the core portfolio.
                      <br /><br />
                      <strong>Designated Emergency Fund:</strong> For optimal financial planning, we recommend maintaining a separate, fully liquid emergency fund outside the Discipline Vault for true emergencies, allowing your long-term investments to remain protected by the vault's discipline-enhancing constraints.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">How does the vault help me maintain investment discipline during market volatility?</h3>
                    <p className="text-muted-foreground">
                      The vault implements multiple mechanisms specifically designed for market turbulence:
                      <br /><br />
                      <strong>Volatility-Adaptive Access Controls:</strong> During periods of extreme market volatility (automatically detected through on-chain price oracles), the system can implement enhanced access restrictions that create additional reflection time before allowing significant portfolio changes.
                      <br /><br />
                      <strong>Contextual Decision Framework:</strong> When accessing your vault during volatile periods, the interface presents historical context, your documented investment strategy, and personalized reminders about long-term objectives to counter recency bias and emotional reactions.
                      <br /><br />
                      <strong>Automated Counter-Cyclical Execution:</strong> Many users configure rule-based rebalancing that automatically executes counter-cyclical trades during volatility (buying assets that have declined, selling those that have appreciated), systematically implementing "buy low, sell high" without requiring manual intervention.
                      <br /><br />
                      <strong>Emotional Circuit Breakers:</strong> Optional features include self-imposed "circuit breakers" that temporarily restrict access after significant market movements, allowing emotions to stabilize before making important investment decisions.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Can I customize the investment rules and time-locks for different parts of my portfolio?</h3>
                    <p className="text-muted-foreground">
                      Yes, the vault supports sophisticated portfolio segmentation:
                      <br /><br />
                      <strong>Multi-Portfolio Structure:</strong> You can create multiple sub-portfolios within your vault, each with its own security parameters, time constraints, and investment rules. This allows you to implement different strategies for different financial goals or time horizons.
                      <br /><br />
                      <strong>Asset-Specific Rules:</strong> Within each portfolio, you can configure different rules for different asset classes or even individual positions. For example, you might implement stronger time-locks on your core long-term holdings while allowing more flexibility with a smaller portion designated for tactical opportunities.
                      <br /><br />
                      <strong>Goal-Based Configuration:</strong> The system supports organizing your investments by financial goal (retirement, education, home purchase, etc.), with appropriate time constraints aligned to each goal's time horizon and importance.
                      <br /><br />
                      <strong>Progressive Time Structures:</strong> You can implement graduated time-locks where portions of your portfolio become available at different intervals, creating appropriate liquidity while maintaining long-term discipline for core assets.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">How does the vault handle changing market conditions or shifts in my financial situation?</h3>
                    <p className="text-muted-foreground">
                      The vault balances commitment with appropriate flexibility:
                      <br /><br />
                      <strong>Strategy Adjustment Windows:</strong> Most users configure periodic "strategy adjustment windows" (e.g., quarterly or annually) when comprehensive portfolio review and strategy updates are permitted, allowing for thoughtful adaptation while preventing frequent impulsive changes.
                      <br /><br />
                      <strong>Conditional Modification Rules:</strong> You can implement rules that automatically adjust your investment strategy based on predefined conditions—such as changing asset allocation as you approach retirement, or modifying contribution amounts based on your income.
                      <br /><br />
                      <strong>Life Event Exceptions:</strong> The vault supports defining specific life events (career changes, family additions, relocation) that trigger temporary modification permissions, allowing you to adapt your strategy to significant life changes while maintaining protection against purely emotional decisions.
                      <br /><br />
                      <strong>Guided Modification Process:</strong> When making strategy adjustments, the system implements a structured decision process that helps ensure changes are well-reasoned and aligned with long-term objectives rather than reactions to short-term market movements.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">How does the Investment Discipline Vault differ from traditional retirement accounts?</h3>
                    <p className="text-muted-foreground">
                      While both encourage long-term investing, there are several key differences:
                      <br /><br />
                      <strong>Customizable Constraints:</strong> Unlike retirement accounts with standardized rules, the Discipline Vault allows you to create personalized commitment devices tailored to your specific psychological tendencies, financial goals, and investment strategy.
                      <br /><br />
                      <strong>Asset Flexibility:</strong> The vault supports a wide range of digital assets across multiple blockchains, allowing diversification beyond traditional financial instruments, while implementing appropriate discipline for these often-volatile assets.
                      <br /><br />
                      <strong>Behavioral Intelligence:</strong> Traditional accounts focus primarily on tax advantages, while the Discipline Vault specifically addresses behavioral challenges with sophisticated mechanisms like volatility-adaptive controls, contextual decision frameworks, and cognitive debiasing protocols.
                      <br /><br />
                      <strong>Programmable Investment Policy:</strong> The vault's rule-based execution system allows you to codify your entire investment strategy—including contributions, asset allocation, rebalancing, and withdrawal plans—into programmable logic that executes automatically while protecting against impulsive overrides.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t p-4">
                <div className="w-full">
                  <p className="text-sm text-muted-foreground mb-4">
                    Have more questions about enhancing your investment discipline through structured time-locking? Our investment strategy specialists can provide personalized guidance on configuring the optimal vault for your specific financial goals and behavioral tendencies.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="outline" className="flex-1">
                      Contact Support
                    </Button>
                    <Button className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 flex-1" asChild>
                      <Link href="/investment-discipline-vault">Create Discipline Vault</Link>
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DocumentationLayout>
  );
};

export default InvestmentDisciplineVaultDocumentation;