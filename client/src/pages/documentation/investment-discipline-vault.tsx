import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Layout from "@/components/layout/Layout";
import { 
  LineChart, 
  Shield, 
  Lock, 
  TrendingUp, 
  Calendar, 
  Bell, 
  CheckCircle, 
  Clock, 
  FileText, 
  Code, 
  HelpCircle, 
  Tag,
  Coins,
  Percent,
  Target,
  ArrowUpRight
} from "lucide-react";

const InvestmentDisciplineVaultDocumentation = () => {
  return (
    <Layout>
      <div className="container mx-auto py-10 px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-blue-500">
              Investment Discipline Vault
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              Maintain unwavering investment strategy through time-locked commitment mechanisms
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button asChild className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600">
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
                  <LineChart className="h-6 w-6 text-emerald-500" />
                  Investment Strategy Enforcement
                </CardTitle>
                <CardDescription>
                  Discover how time-locked commitment systems can transform your investment outcomes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-gradient-to-r from-emerald-50 to-blue-50 p-6 border border-emerald-100 dark:from-emerald-950/20 dark:to-blue-950/20 dark:border-emerald-900/50">
                  <p className="text-lg mb-4">
                    The Investment Discipline Vault represents a revolutionary approach to personal investing by addressing the most common challenge investors face: emotional decision-making that compromises long-term strategies. This specialized vault harnesses blockchain technology to create unbreakable commitments to your investment plan.
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-2 text-emerald-700 dark:text-emerald-400">The Investment Discipline Problem</h3>
                  <p className="mb-4">
                    Study after study has shown that investor behavior, not market performance, is the primary determinant of long-term investment outcomes. Market volatility triggers emotional responses that lead to buying at market peaks and selling during downturns—precisely the opposite of optimal investment strategy. Traditional solutions like financial advisors and automated investing only partially address this fundamental challenge.
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-2 text-emerald-700 dark:text-emerald-400">The Commitment Solution</h3>
                  <p className="mb-4">
                    The Investment Discipline Vault transforms investment discipline from a psychological challenge into a technological certainty. By allowing investors to create binding, time-locked commitments to their investment strategies, the vault removes the possibility of emotion-driven decisions during market turbulence. These commitments are enforced through smart contracts that execute precisely according to predefined rules, regardless of market conditions or emotional state.
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-2 text-emerald-700 dark:text-emerald-400">Adaptable Security Architecture</h3>
                  <p>
                    While enforcing commitment, the vault maintains necessary flexibility through contingency planning. Investors can establish predetermined conditions under which modifications are permitted or emergency access is granted. This creates a system that is rigid enough to prevent impulsive decisions but flexible enough to adapt to genuinely changing circumstances or major life events through carefully designed exception protocols.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="justify-between border-t p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4" />
                  Protect your wealth from your worst investing instincts
                </div>
                <Button variant="outline" asChild>
                  <Link href="/investment-discipline-vault">Create Investment Vault</Link>
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
                  Explore the powerful capabilities of Investment Discipline Vaults
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-lg border bg-card shadow p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Lock className="h-8 w-8 text-emerald-500" />
                      <h3 className="text-xl font-semibold">Time-Locked Strategy Commitment</h3>
                    </div>
                    <p>
                      Create binding commitments to your investment strategy that cannot be altered before a predetermined date. Set time horizons from months to decades, ensuring your long-term investment plan remains intact regardless of short-term market volatility or emotional reactions. The system enforces the strategy's parameters through tamper-proof smart contracts that execute with mathematical precision.
                    </p>
                  </div>
                  
                  <div className="rounded-lg border bg-card shadow p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Calendar className="h-8 w-8 text-emerald-500" />
                      <h3 className="text-xl font-semibold">Scheduled Investment Automation</h3>
                    </div>
                    <p>
                      Establish automated investment schedules that execute with clockwork precision, regardless of market conditions. Configure dollar-cost averaging strategies with customizable parameters, including frequency (daily/weekly/monthly), amount, and target assets. The system automatically rebalances portfolios according to your predetermined asset allocation, maintaining your strategic vision without requiring constant oversight.
                    </p>
                  </div>
                  
                  <div className="rounded-lg border bg-card shadow p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Target className="h-8 w-8 text-emerald-500" />
                      <h3 className="text-xl font-semibold">Goal-Based Exit Conditions</h3>
                    </div>
                    <p>
                      Set specific performance targets as the only conditions under which strategy adjustments are permitted. Establish measurable goals for returns, portfolio value, or timeline milestones that must be met before withdrawal or strategy modification. This prevents emotional decision-making during market volatility while ensuring your investment plan remains aligned with your financial objectives through rule-based exit strategies.
                    </p>
                  </div>
                  
                  <div className="rounded-lg border bg-card shadow p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Bell className="h-8 w-8 text-emerald-500" />
                      <h3 className="text-xl font-semibold">Trigger-Based Rebalancing</h3>
                    </div>
                    <p>
                      Configure intelligent portfolio rebalancing that activates only when specific market conditions or allocation drifts occur. Set threshold parameters that automatically trigger rebalancing when asset allocations deviate beyond your comfort zone. These mathematically precise triggers maintain your strategic asset allocation while potentially capturing additional returns through systematic "buy low, sell high" execution during market volatility.
                    </p>
                  </div>
                  
                  <div className="rounded-lg border bg-card shadow p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Shield className="h-8 w-8 text-emerald-500" />
                      <h3 className="text-xl font-semibold">Downside Protection Mechanisms</h3>
                    </div>
                    <p>
                      Implement sophisticated protective measures that activate only during extreme market conditions. Set parameters for circuit breakers that temporarily pause automated investing during exceptional volatility, establish algorithm-based hedging strategies that deploy during market stress, and configure conditional asset allocation shifts that implement defensive positioning based on quantitative risk metrics rather than emotional responses.
                    </p>
                  </div>
                  
                  <div className="rounded-lg border bg-card shadow p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Clock className="h-8 w-8 text-emerald-500" />
                      <h3 className="text-xl font-semibold">Delayed Decision Framework</h3>
                    </div>
                    <p>
                      Implement a cooling-off period for any investment decisions that deviate from your predetermined strategy. Configure mandatory reflection periods between the request for a strategy change and its execution, requiring multiple confirmations across time. This creates a structured decision process that neutralizes impulsive reactions while still permitting thoughtful strategy adjustments after sufficient reflection and analysis.
                    </p>
                  </div>
                </div>
                
                <div className="mt-8 p-6 border rounded-lg bg-emerald-50 dark:bg-emerald-950/20">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                    <ArrowUpRight className="h-5 w-5" />
                    Performance Enhancement Features
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-white dark:bg-black/20 rounded-lg shadow-sm">
                      <p className="text-sm font-medium">Performance Analytics</p>
                      <p className="text-xs text-muted-foreground mt-1">Detailed tracking against investment goals</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-black/20 rounded-lg shadow-sm">
                      <p className="text-sm font-medium">Strategy Backtesting</p>
                      <p className="text-xs text-muted-foreground mt-1">Historical performance simulation</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-black/20 rounded-lg shadow-sm">
                      <p className="text-sm font-medium">Tax-Optimized Execution</p>
                      <p className="text-xs text-muted-foreground mt-1">Minimize tax impact of transactions</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-black/20 rounded-lg shadow-sm">
                      <p className="text-sm font-medium">Multi-Strategy Vaults</p>
                      <p className="text-xs text-muted-foreground mt-1">Segment investments by time horizon</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-black/20 rounded-lg shadow-sm">
                      <p className="text-sm font-medium">Advisor Integration</p>
                      <p className="text-xs text-muted-foreground mt-1">Professional oversight with constraints</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-black/20 rounded-lg shadow-sm">
                      <p className="text-sm font-medium">Investment Journaling</p>
                      <p className="text-xs text-muted-foreground mt-1">Document rationale for future review</p>
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
                  How investment discipline is enforced through technological safeguards
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-emerald-700 dark:text-emerald-400">Security Philosophy</h3>
                  <p className="text-muted-foreground">
                    The Investment Discipline Vault takes a fundamentally different approach to security than traditional financial services. Rather than primarily protecting assets from external threats, it focuses on protecting your investment strategy from internal psychological vulnerabilities—essentially protecting you from yourself.
                  </p>
                  
                  <div className="rounded-lg border p-4 bg-slate-50 dark:bg-slate-900 mb-6">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Lock className="h-4 w-4 mr-2 text-emerald-500" />
                      Strategy Enforcement Mechanisms
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      The vault's core security systems are designed to enforce your predetermined investment strategy through multiple layers of technological and psychological safeguards:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="bg-white dark:bg-black/20 p-3 rounded border">
                        <span className="font-medium text-emerald-700 dark:text-emerald-400">Time-Binding Contracts</span>
                        <ul className="mt-1 space-y-1 text-muted-foreground">
                          <li>• Temporal commitment enforcement</li>
                          <li>• Immutable execution timelines</li>
                          <li>• Time-based access controls</li>
                        </ul>
                      </div>
                      <div className="bg-white dark:bg-black/20 p-3 rounded border">
                        <span className="font-medium text-emerald-700 dark:text-emerald-400">Multi-Phase Verification</span>
                        <ul className="mt-1 space-y-1 text-muted-foreground">
                          <li>• Cooling period enforcement</li>
                          <li>• Progressive authorization</li>
                          <li>• Decision consistency validation</li>
                        </ul>
                      </div>
                      <div className="bg-white dark:bg-black/20 p-3 rounded border">
                        <span className="font-medium text-emerald-700 dark:text-emerald-400">Algorithmic Guardians</span>
                        <ul className="mt-1 space-y-1 text-muted-foreground">
                          <li>• Strategy deviation detection</li>
                          <li>• Emotional response filtering</li>
                          <li>• Pattern-based intervention</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border p-4 bg-slate-50 dark:bg-slate-900 mb-6">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Shield className="h-4 w-4 mr-2 text-emerald-500" />
                      Behavioral Security Architecture
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      The vault implements a comprehensive behavioral security system based on principles of behavioral economics and psychology:
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start">
                        <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                        <span><strong>Precommitment Protocol</strong> - The vault uses binding precommitment as its primary security mechanism, allowing you to make decisions during periods of rational thinking that cannot be undone during periods of emotional reactivity. This creates a binding contract with your future self.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                        <span><strong>Friction Engineering</strong> - The system strategically implements "beneficial friction" that makes impulsive changes difficult while facilitating adherence to the predetermined strategy. The more significant the strategy deviation, the greater the friction through layered approval requirements.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
                        <span><strong>Cognitive Debiasing</strong> - When strategy modifications are requested, the system implements debiasing interventions, including mandatory consideration of counterarguments, presentation of relevant historical data, and documentation of decision rationale for future self-assessment.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">4</span>
                        <span><strong>Contingency Planning</strong> - The vault requires predefined parameters for emergency access or strategy modification during initial setup, forcing consideration of potential future scenarios when in a rational state rather than during emotional market reactions.</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="rounded-lg border p-4 bg-slate-50 dark:bg-slate-900">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Bell className="h-4 w-4 mr-2 text-emerald-500" />
                      Strategy Deviation Defense System
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      The vault employs a multi-layered approach to protect against strategy deviations:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-3">
                        <h5 className="font-medium text-sm mb-1">Temporal Firewalls</h5>
                        <p className="text-xs text-muted-foreground">
                          Time-based access restrictions that prevent modifications during predefined lockout periods. These can include market volatility-triggered extensions that automatically extend lockout periods during high market turbulence to prevent emotional decision-making precisely when it's most likely to occur.
                        </p>
                      </div>
                      <div className="border rounded-lg p-3">
                        <h5 className="font-medium text-sm mb-1">Multi-Signature Governance</h5>
                        <p className="text-xs text-muted-foreground">
                          Optional configuration requiring approval from multiple parties before significant strategy changes can be implemented. This can include trusted advisors, accountability partners, or your future self through time-separated confirmations, creating a distributed decision model that prevents impulsive actions.
                        </p>
                      </div>
                      <div className="border rounded-lg p-3">
                        <h5 className="font-medium text-sm mb-1">Decision Quality Analysis</h5>
                        <p className="text-xs text-muted-foreground">
                          Automated evaluation of requested changes against historical performance data, current market conditions, and established investment principles. The system can flag potentially harmful decisions with mandatory review periods proportional to the deviation magnitude or estimated long-term impact.
                        </p>
                      </div>
                      <div className="border rounded-lg p-3">
                        <h5 className="font-medium text-sm mb-1">Strategy Commitment Reinforcement</h5>
                        <p className="text-xs text-muted-foreground">
                          Periodic reaffirmation requirements that present your original investment thesis and objectives before allowing continued access. These reinforcement checkpoints strengthen commitment to long-term strategies by reconnecting you with your initial rationale during periods of potential doubt.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-emerald-700 dark:text-emerald-400 mt-6">Backup Security Mechanisms</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4 text-center">
                      <p className="font-medium">Emergency Override</p>
                      <p className="text-sm text-muted-foreground">Predefined conditions for urgent access</p>
                    </div>
                    <div className="border rounded-lg p-4 text-center">
                      <p className="font-medium">Beneficiary Access Protocol</p>
                      <p className="text-sm text-muted-foreground">Successor access rights and limitations</p>
                    </div>
                    <div className="border rounded-lg p-4 text-center">
                      <p className="font-medium">Strategy Adaptation Framework</p>
                      <p className="text-sm text-muted-foreground">Controlled evolution of investment rules</p>
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
                  Advanced implementation details for technical users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="rounded-lg border-2 border-dashed border-muted-foreground/20 p-6">
                    <h3 className="text-xl font-semibold mb-4 text-emerald-700 dark:text-emerald-400">Implementation Architecture</h3>
                    <p className="mb-6">
                      The Investment Discipline Vault implements a sophisticated multi-layer architecture that combines behavioral economics, smart contract technology, and automated execution systems to create enforceable investment commitments.
                    </p>
                    
                    <h4 className="text-lg font-medium mb-2">Strategy Enforcement Layer</h4>
                    <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 mb-6">
                      <h5 className="font-medium mb-2">Smart Contract Framework</h5>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead className="bg-gray-100 dark:bg-gray-800">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Component</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Implementation</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Primary Function</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Blockchain</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                            <tr>
                              <td className="px-4 py-2 text-sm">TimeVaultCore</td>
                              <td className="px-4 py-2 text-sm">Time-based access control</td>
                              <td className="px-4 py-2 text-sm">Temporal commitment enforcement</td>
                              <td className="px-4 py-2 text-sm">Ethereum/TON</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-2 text-sm">StrategyExecutor</td>
                              <td className="px-4 py-2 text-sm">Automated investment execution</td>
                              <td className="px-4 py-2 text-sm">Transaction scheduling and routing</td>
                              <td className="px-4 py-2 text-sm">Cross-chain</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-2 text-sm">DecisionFramework</td>
                              <td className="px-4 py-2 text-sm">Multi-phase verification</td>
                              <td className="px-4 py-2 text-sm">Strategy modification governance</td>
                              <td className="px-4 py-2 text-sm">Ethereum</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-2 text-sm">AllocationManager</td>
                              <td className="px-4 py-2 text-sm">Portfolio rebalancing engine</td>
                              <td className="px-4 py-2 text-sm">Asset allocation maintenance</td>
                              <td className="px-4 py-2 text-sm">Solana</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <h4 className="text-lg font-medium mb-2">Integration Architecture</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                        <h5 className="font-medium mb-2">Exchange Connectivity</h5>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li><span className="font-mono text-xs bg-slate-200 dark:bg-slate-700 px-1 rounded">OrderRouter</span> - Multi-exchange order execution</li>
                          <li><span className="font-mono text-xs bg-slate-200 dark:bg-slate-700 px-1 rounded">LiquidityAggregator</span> - Best execution routing</li>
                          <li><span className="font-mono text-xs bg-slate-200 dark:bg-slate-700 px-1 rounded">TradeSplitter</span> - Large order optimization</li>
                          <li><span className="font-mono text-xs bg-slate-200 dark:bg-slate-700 px-1 rounded">PriceOracle</span> - Multi-source price verification</li>
                          <li><span className="font-mono text-xs bg-slate-200 dark:bg-slate-700 px-1 rounded">SlippageProtector</span> - Transaction safeguard</li>
                        </ul>
                      </div>
                      <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                        <h5 className="font-medium mb-2">Supported Asset Classes</h5>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li><span className="font-mono text-xs bg-slate-200 dark:bg-slate-700 px-1 rounded">Cryptocurrencies</span> - Major and altcoins</li>
                          <li><span className="font-mono text-xs bg-slate-200 dark:bg-slate-700 px-1 rounded">DeFi protocols</span> - Major yield platforms</li>
                          <li><span className="font-mono text-xs bg-slate-200 dark:bg-slate-700 px-1 rounded">Tokenized stocks</span> - Via synthetic wrappers</li>
                          <li><span className="font-mono text-xs bg-slate-200 dark:bg-slate-700 px-1 rounded">Tokenized commodities</span> - Gold, silver backing</li>
                          <li><span className="font-mono text-xs bg-slate-200 dark:bg-slate-700 px-1 rounded">Index tokens</span> - Sector/market exposures</li>
                        </ul>
                      </div>
                    </div>
                    
                    <h4 className="text-lg font-medium mb-2">Implementation Details</h4>
                    <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 mb-6">
                      <p className="text-sm text-muted-foreground mb-3">
                        The Investment Discipline Vault includes several advanced technical components:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="border rounded-lg p-3 bg-white dark:bg-gray-900">
                          <h6 className="font-medium mb-1">Time Oracle System</h6>
                          <ul className="space-y-1 text-muted-foreground">
                            <li>• Multi-source time verification</li>
                            <li>• Tamper-resistant timestamp validation</li>
                            <li>• Cross-chain time synchronization</li>
                            <li>• Temporal access control primitives</li>
                          </ul>
                        </div>
                        <div className="border rounded-lg p-3 bg-white dark:bg-gray-900">
                          <h6 className="font-medium mb-1">Strategy Execution Engine</h6>
                          <ul className="space-y-1 text-muted-foreground">
                            <li>• Rule-based transaction scheduler</li>
                            <li>• Conditional logic evaluation</li>
                            <li>• Gas-efficient time triggers</li>
                            <li>• Error-handling with retry logic</li>
                          </ul>
                        </div>
                        <div className="border rounded-lg p-3 bg-white dark:bg-gray-900">
                          <h6 className="font-medium mb-1">Market Data Integration</h6>
                          <ul className="space-y-1 text-muted-foreground">
                            <li>• Price feed aggregation</li>
                            <li>• On-chain market indicators</li>
                            <li>• Volatility calculation framework</li>
                            <li>• Anomaly detection systems</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <h4 className="text-lg font-medium mb-2">Advanced Features</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <h5 className="font-medium mb-1">Strategy Adaptation Framework</h5>
                        <p className="text-sm text-muted-foreground">
                          The vault includes a sophisticated governance mechanism for strategy modification that balances commitment with necessary adaptation. It implements a multi-phase approval process with time-separation requirements, objective criteria evaluation, and proportional friction based on deviation magnitude. The system maintains a complete audit trail of all modification requests, approvals, and rejections for retrospective analysis.
                        </p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <h5 className="font-medium mb-1">Tax-Optimized Execution</h5>
                        <p className="text-sm text-muted-foreground">
                          The execution engine incorporates tax-awareness when implementing investment strategies. It can preferentially harvest tax losses when rebalancing, intelligently select specific lots for optimal tax treatment, and execute transactions across multiple accounts to maximize tax efficiency. The system maintains comprehensive transaction records with cost basis tracking for seamless tax reporting and optimization analysis.
                        </p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <h5 className="font-medium mb-1">Risk-Responsive Allocation</h5>
                        <p className="text-sm text-muted-foreground">
                          Advanced vault configurations can implement dynamic risk management through quantitative models. The system continuously evaluates multiple risk metrics and can adjust allocations within predefined bounds based on changing market conditions. These adjustments follow strict mathematical rules rather than emotional responses, with clear guardrails preventing extreme allocation shifts during temporary market events.
                        </p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <h5 className="font-medium mb-1">Performance Analytics Engine</h5>
                        <p className="text-sm text-muted-foreground">
                          The vault includes sophisticated performance tracking that goes beyond simple returns calculations. It implements attribution analysis to identify strategy component performance, risk-adjusted return metrics tracking, and benchmark comparison with statistical significance testing. The system can generate detailed reports highlighting adherence to the original strategy and projections toward long-term goals.
                        </p>
                      </div>
                    </div>
                  </div>
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
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-medium mb-2">Why would I want to restrict my own access to my investments?</h3>
                    <p className="text-muted-foreground">
                      This question gets to the heart of the Investment Discipline Vault's purpose. Decades of research in behavioral finance show that investors are their own worst enemies when it comes to long-term performance. During market downturns, our emotional brains override rational decision-making, leading to selling at market bottoms. During bubbles, we succumb to FOMO and buy at peaks. The Investment Discipline Vault allows your rational self to protect your assets from your emotional self.
                      <br /><br />
                      Think of it as similar to a retirement account with early withdrawal penalties, but with much more flexibility and customization. You're not permanently restricting access—you're creating rules that enforce your predetermined strategy and prevent impulsive decisions during emotional market periods. Studies consistently show that investors who maintain disciplined strategies significantly outperform those who make frequent emotional adjustments.
                    </p>
                  </div>
                  
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-medium mb-2">What happens if I genuinely need to change my investment strategy?</h3>
                    <p className="text-muted-foreground">
                      The Investment Discipline Vault is designed to protect against emotional, impulsive changes while still allowing legitimate strategy evolution. The system provides several mechanisms for appropriate modifications:
                      <br /><br />
                      <strong>1. Scheduled Review Periods:</strong> When setting up your vault, you can establish regular review windows (quarterly, annually, etc.) when strategy modifications are permitted after a thorough review process.
                      <br /><br />
                      <strong>2. Conditional Modification Rules:</strong> You can pre-define specific conditions (market events, personal milestones, etc.) that would trigger the ability to revise your strategy.
                      <br /><br />
                      <strong>3. Multi-Phase Approval:</strong> For significant changes outside scheduled periods, the vault implements a cooling-off system requiring multiple confirmations across time, ensuring changes are deliberate rather than impulsive.
                      <br /><br />
                      <strong>4. Emergency Override:</strong> For truly exceptional circumstances, the vault includes an emergency access protocol that requires additional verification steps proportional to the deviation from your original strategy.
                      <br /><br />
                      These mechanisms strike a balance between commitment and flexibility, preventing emotional reactions while accommodating legitimate strategy evolution.
                    </p>
                  </div>
                  
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-medium mb-2">How does the vault handle market crashes or exceptional circumstances?</h3>
                    <p className="text-muted-foreground">
                      The Investment Discipline Vault includes sophisticated contingency planning specifically designed for extreme market events:
                      <br /><br />
                      <strong>Circuit Breakers:</strong> You can configure predefined thresholds for market volatility or drawdowns that temporarily pause automated investing or trigger defensive protocols. These are based on quantitative metrics rather than emotion.
                      <br /><br />
                      <strong>Downside Protection:</strong> Advanced vault configurations can include automatic implementation of hedging strategies or allocation adjustments when specific risk thresholds are breached.
                      <br /><br />
                      <strong>Opportunity Response:</strong> Conversely, you can set rules to automatically increase investment rates during significant market downturns, essentially automating the "be greedy when others are fearful" principle.
                      <br /><br />
                      <strong>Modified Access Rules:</strong> The system allows for special governance during exceptional circumstances, potentially enabling a more streamlined modification process while still preventing purely emotional reactions.
                      <br /><br />
                      Importantly, these contingency mechanisms are defined in advance during rational planning, not during the emotional turmoil of a market crisis, ensuring responses align with your long-term investment philosophy.
                    </p>
                  </div>
                  
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-medium mb-2">What types of investment strategies work best with this vault?</h3>
                    <p className="text-muted-foreground">
                      The Investment Discipline Vault works with virtually any coherent investment strategy, but it particularly enhances strategies that benefit from consistent execution and are vulnerable to emotional interference:
                      <br /><br />
                      <strong>Dollar-Cost Averaging:</strong> Ideal for enforcing regular investments regardless of market conditions, preventing the tendency to invest more during market euphoria and less during downturns.
                      <br /><br />
                      <strong>Strategic Asset Allocation:</strong> Excellent for maintaining target allocations through automated rebalancing, preventing the natural drift toward overweighting recent winners.
                      <br /><br />
                      <strong>Value Investing:</strong> Superb for enforcing contrarian buying during market fear, when value strategies typically find their best opportunities but emotional resistance is highest.
                      <br /><br />
                      <strong>Momentum Strategies:</strong> Effective for enforcing systematic exit rules, preventing the common tendency to hold winners too long due to attachment.
                      <br /><br />
                      <strong>Factor Investing:</strong> Ideal for maintaining exposure to factors (value, quality, etc.) during periods of underperformance when investors typically abandon them before mean reversion.
                      <br /><br />
                      The vault is strategy-agnostic but execution-focused, ensuring whatever approach you choose is implemented with discipline and consistency.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">How do I determine the right balance between commitment and flexibility?</h3>
                    <p className="text-muted-foreground">
                      Finding the optimal balance between unwavering commitment and necessary flexibility is perhaps the most important aspect of configuring your Investment Discipline Vault. Here are key considerations:
                      <br /><br />
                      <strong>Time Horizon Analysis:</strong> Generally, longer-term investments warrant stronger commitment mechanisms. Consider creating multiple vaults with different flexibility levels based on time horizons.
                      <br /><br />
                      <strong>Personal Psychology Assessment:</strong> Be honest about your own behavioral tendencies. If you have a history of emotional investment decisions, consider stronger commitment features. The vault includes a self-assessment tool to help calibrate this.
                      <br /><br />
                      <strong>Strategy Maturity:</strong> Well-tested strategies with clear historical performance characteristics typically warrant stronger commitment than newer approaches still being refined.
                      <br /><br />
                      <strong>Life Stage Consideration:</strong> Investors closer to requiring access to funds typically need more flexibility than those in accumulation phases.
                      <br /><br />
                      <strong>Tiered Flexibility:</strong> Consider implementing graduated access controls where smaller strategy adjustments face less friction than major deviations.
                      <br /><br />
                      The vault configuration process includes a detailed questionnaire and simulation tools to help you identify your optimal commitment-flexibility balance.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t p-4">
                <div className="w-full">
                  <p className="text-sm text-muted-foreground mb-4">
                    Have more questions about using Investment Discipline Vaults to improve your investment outcomes? Our team is available to provide personalized guidance based on your specific financial goals.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="outline" className="flex-1">
                      Contact Support
                    </Button>
                    <Button className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 flex-1" asChild>
                      <Link href="/investment-discipline-vault">Create Investment Vault</Link>
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default InvestmentDisciplineVaultDocumentation;