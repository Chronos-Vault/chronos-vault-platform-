import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocumentationLayout from "@/components/layout/DocumentationLayout";
import { 
  MoveRight, 
  Bitcoin, 
  Clock, 
  TrendingUp, 
  LineChart,
  Lock, 
  BarChart3, 
  Server
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function BitcoinHalvingVaultDocumentation() {
  return (
    <DocumentationLayout
      title="Bitcoin Halving Vault"
      description="Bitcoin-specific vault optimized for halving cycle investment strategy"
      icon="₿"
      cta={
        <Link href="/bitcoin-halving-vault">
          <Button size="lg" className="mt-6 gap-2 bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-400 hover:to-amber-300">
            Create Bitcoin Halving Vault <MoveRight className="size-4" />
          </Button>
        </Link>
      }
    >
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Bitcoin Halving Cycle Strategy</h2>
            <p className="text-lg text-muted-foreground">
              The Bitcoin Halving Vault is specifically engineered for investors who want to 
              align their strategy with Bitcoin's four-year halving cycle. This specialized vault helps 
              you maintain discipline during market volatility and optimize your long-term Bitcoin investment strategy.
            </p>
            
            <div className="grid gap-6 mt-8 md:grid-cols-2">
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <Bitcoin className="size-10 text-orange-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Halving-Synchronized Timelock</h3>
                <p className="text-muted-foreground">
                  Automatically secure your Bitcoin until specific points in the Bitcoin halving cycle, helping
                  you maintain a long-term perspective through market volatility.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <TrendingUp className="size-10 text-orange-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Price Target Automation</h3>
                <p className="text-muted-foreground">
                  Set predetermined price targets for automatic unlocking, enabling you to take profits
                  at psychological resistance levels without emotional decision-making.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <LineChart className="size-10 text-orange-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Cycle Analysis Tools</h3>
                <p className="text-muted-foreground">
                  Access advanced analytics and historical cycle comparisons to help you make 
                  data-driven decisions about your Bitcoin investment strategy.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <Clock className="size-10 text-orange-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">DCA Exit Strategy</h3>
                <p className="text-muted-foreground">
                  Implement a dollar-cost averaging exit strategy, automatically selling predetermined 
                  portions of your holdings at specified intervals or price points.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="features" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Comprehensive Features</h2>
            <p className="text-lg text-muted-foreground">
              Our Bitcoin Halving Vault includes a rich set of features specifically designed to help you 
              optimize your investment strategy around Bitcoin's halving cycles, with tools for analysis,
              automation, and disciplined execution.
            </p>
            
            <div className="space-y-4 mt-6">
              <div className="border rounded-lg p-6 bg-card shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Clock className="mr-3 text-orange-500" />
                  Halving Cycle-Based Time Locks
                </h3>
                <p className="text-muted-foreground mb-4">
                  Synchronize your investment strategy with Bitcoin's predictable supply schedule:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2 text-orange-500">•</span> 
                    Lock assets until specific halving events (e.g., next halving, halving + 1 year)
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-orange-500">•</span> 
                    Configure partial unlocks at predetermined cycle phases
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-orange-500">•</span> 
                    Receive alerts for upcoming halving-related events
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-orange-500">•</span> 
                    Historical overlay visualizations for cycle comparison
                  </li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-6 bg-card shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <TrendingUp className="mr-3 text-orange-500" />
                  BTC Price Target Automation
                </h3>
                <p className="text-muted-foreground mb-4">
                  Set and forget price-based triggers for your investment strategy:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2 text-orange-500">•</span> 
                    Configurable price targets for automated partial withdrawals
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-orange-500">•</span> 
                    Percentage-based or fixed BTC amount withdrawal options
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-orange-500">•</span> 
                    Multi-tier price target system (e.g., 25% at $100K, 25% at $150K)
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-orange-500">•</span> 
                    Price data verified through multiple oracles for security
                  </li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-6 bg-card shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <LineChart className="mr-3 text-orange-500" />
                  Historical Cycle Analysis Tools
                </h3>
                <p className="text-muted-foreground mb-4">
                  Make data-driven decisions with comprehensive analytics:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2 text-orange-500">•</span> 
                    Interactive data visualization of previous halving cycles
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-orange-500">•</span> 
                    Post-halving performance metrics and pattern recognition
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-orange-500">•</span> 
                    On-chain metrics correlation with previous cycle phases
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-orange-500">•</span> 
                    Customizable indicators for strategy development
                  </li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-6 bg-card shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <BarChart3 className="mr-3 text-orange-500" />
                  Automatic Profit Taking at Cycle Peaks
                </h3>
                <p className="text-muted-foreground mb-4">
                  Maximize returns with strategic exit planning:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2 text-orange-500">•</span> 
                    AI-assisted cycle peak prediction algorithms
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-orange-500">•</span> 
                    Dollar-cost averaging exit strategy implementation
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-orange-500">•</span> 
                    Configurable risk tolerance and confidence thresholds
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-orange-500">•</span> 
                    Emergency override options with multi-factor authentication
                  </li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-6 bg-card shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Lock className="mr-3 text-orange-500" />
                  Cold Storage Security Integration
                </h3>
                <p className="text-muted-foreground mb-4">
                  Enterprise-grade security for your Bitcoin holdings:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2 text-orange-500">•</span> 
                    Optional integration with hardware wallet solutions
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-orange-500">•</span> 
                    Multi-signature security options (2-of-3, 3-of-5, etc.)
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-orange-500">•</span> 
                    Inheritance and recovery planning tools
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-orange-500">•</span> 
                    Geographically distributed security architecture
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Bitcoin-Specific Security</h2>
            <p className="text-lg text-muted-foreground">
              The Bitcoin Halving Vault implements multiple security layers specifically designed for 
              Bitcoin's UTXO model and unique security considerations, ensuring your long-term investment
              strategy is protected with the highest standards of cryptographic security.
            </p>
            
            <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 rounded-xl p-6 my-6">
              <h3 className="text-xl font-bold text-orange-800 dark:text-orange-300 mb-3">Triple-Chain Security™ Protection</h3>
              <p className="text-orange-700 dark:text-orange-400">
                While our Bitcoin Halving Vault primarily secures Bitcoin, it leverages our revolutionary 
                Triple-Chain Security™ protocol for the vault's control mechanism, distributing security 
                verification across three distinct blockchain networks for unparalleled protection.
              </p>
            </div>
            
            <div className="grid gap-6 mt-6 md:grid-cols-2">
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <h3 className="text-xl font-bold mb-3">Bitcoin Script Timelock</h3>
                <p className="text-muted-foreground">
                  Utilizes Bitcoin's native CHECKLOCKTIMEVERIFY to enforce time-based locking at the 
                  protocol level, ensuring that funds cannot be released before specified block heights 
                  corresponding to halving events.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <h3 className="text-xl font-bold mb-3">Multi-Signature Protection</h3>
                <p className="text-muted-foreground">
                  Optional P2SH or P2WSH multi-signature setups requiring authorization from multiple 
                  keys for transactions, with configurable M-of-N requirements for both time-based 
                  and condition-based unlocks.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <h3 className="text-xl font-bold mb-3">Taproot-Enhanced Privacy</h3>
                <p className="text-muted-foreground">
                  Leverages Bitcoin's Taproot functionality to enhance privacy and efficiency of complex 
                  spending conditions, obscuring the exact release conditions from blockchain observers.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <h3 className="text-xl font-bold mb-3">Oracle-Resistant Price Verification</h3>
                <p className="text-muted-foreground">
                  Price target conditions are verified through a decentralized network of oracles 
                  with a consensus mechanism, preventing manipulation and ensuring accurate triggering 
                  of price-based conditions.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="technical" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Technical Specifications</h2>
            <p className="text-lg text-muted-foreground">
              The Bitcoin Halving Vault utilizes advanced blockchain technology tailored specifically 
              for Bitcoin's unique features, combining on-chain script execution with sophisticated 
              off-chain monitoring and verification systems.
            </p>
            
            <div className="mt-8 space-y-6">
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Bitcoin Implementation</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Protocol Version:</h4>
                    <p className="text-muted-foreground">Bitcoin Core v24.0+ compatible</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Script Types:</h4>
                    <p className="text-muted-foreground">P2TR (Taproot), P2WSH (SegWit), P2SH-P2WSH (Nested SegWit)</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Time-Lock Mechanism:</h4>
                    <p className="text-muted-foreground">CLTV (OP_CHECKLOCKTIMEVERIFY) with block height targeting for halving events</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Fee Management:</h4>
                    <p className="text-muted-foreground">Dynamic fee estimation with CPFP (Child Pays For Parent) support</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Halving Cycle Integration</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Halving Detection:</h4>
                    <p className="text-muted-foreground">Block subsidy monitoring at 210,000 block intervals</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Timing Accuracy:</h4>
                    <p className="text-muted-foreground">±100 blocks (approximately 16.7 hours) around target halving block</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Historical Data:</h4>
                    <p className="text-muted-foreground">Full Bitcoin price and on-chain metrics for all previous halving cycles</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Cycle Phase Identification:</h4>
                    <p className="text-muted-foreground">Proprietary algorithm identifying 5 distinct phases in each halving cycle</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Price Target System</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Price Data Sources:</h4>
                    <p className="text-muted-foreground">5 independent price oracles with 3-of-5 consensus requirement</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Price Verification Method:</h4>
                    <p className="text-muted-foreground">Time-weighted average price (TWAP) over 24-hour period</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Trigger Precision:</h4>
                    <p className="text-muted-foreground">Configurable threshold percentage (default: within 1% of target)</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Exit Strategy Types:</h4>
                    <p className="text-muted-foreground">Stepped percentage, fixed amount, or proportional to price increase</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">System Requirements</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Minimum Transaction Size:</h4>
                    <p className="text-muted-foreground">0.001 BTC (100,000 sats) recommended minimum</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Maximum Withdrawal Stages:</h4>
                    <p className="text-muted-foreground">Up to 12 distinct partial withdrawal levels per vault</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Supported Wallet Types:</h4>
                    <p className="text-muted-foreground">Hardware wallets (Ledger, Trezor), software wallets, and watch-only configurations</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Data Storage:</h4>
                    <p className="text-muted-foreground">Minimal on-chain footprint with secure off-chain encrypted backup</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="faq" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">
              Common questions about our Bitcoin Halving Vault and how it can enhance your Bitcoin investment strategy.
            </p>
            
            <div className="mt-8 space-y-6">
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-orange-700 dark:text-orange-400 mb-2">What exactly is a Bitcoin halving and why build a vault around it?</h3>
                <p className="text-muted-foreground">
                  Bitcoin halving is a programmed event where the reward for mining new blocks is cut in half, occurring approximately every four years (every 210,000 blocks). This reduces the rate at which new Bitcoin is created, affecting supply dynamics. Historically, halving events have preceded significant price appreciation cycles.
                  <br /><br />
                  Our Bitcoin Halving Vault is designed to help investors leverage this cyclical pattern by providing tools to implement time-based strategies synchronized with the halving schedule, helping maintain investment discipline through the volatility that typically occurs during these cycles.
                </p>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-orange-700 dark:text-orange-400 mb-2">How does the price target automation feature work?</h3>
                <p className="text-muted-foreground">
                  The price target automation feature allows you to set specific Bitcoin price levels at which a portion of your holdings will automatically unlock. For example, you might configure the vault to release 20% of your Bitcoin when the price reaches $100,000, another 30% at $150,000, and so on.
                  <br /><br />
                  When configuring price targets, you'll specify the price level, the percentage or amount to release, and optional conditions like requiring the price to maintain that level for a specified period. The system uses multiple independent price oracles to verify when conditions are met, ensuring accurate and manipulation-resistant triggering.
                </p>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-orange-700 dark:text-orange-400 mb-2">What happens if I need emergency access to my Bitcoin before the scheduled unlock time?</h3>
                <p className="text-muted-foreground">
                  While the primary purpose of the vault is to enforce investment discipline, we understand that unexpected situations may arise. The vault includes an emergency override option that can be configured during setup. Depending on your chosen security level, emergency access typically requires:
                  <br /><br />
                  • Multi-factor authentication (typically 3+ factors)
                  <br />
                  • A delay period (typically 24-72 hours) during which you'll receive multiple notifications
                  <br />
                  • Possible verification through secondary designated contacts
                  <br /><br />
                  These measures ensure you can access your funds in a genuine emergency while protecting against impulsive decisions during market volatility.
                </p>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-orange-700 dark:text-orange-400 mb-2">How accurate are the historical cycle analysis tools in predicting future performance?</h3>
                <p className="text-muted-foreground">
                  Our historical analysis tools provide comprehensive data visualization and pattern recognition from previous halving cycles, but we emphasize that past performance does not guarantee future results. Bitcoin's market has evolved significantly since its early days, and each cycle has unique characteristics.
                  <br /><br />
                  The tools are best used for developing context and understanding potential scenarios rather than making precise predictions. We provide confidence intervals and highlight when current conditions diverge from historical patterns. The system is designed to help you make informed decisions rather than rely on automated predictions alone.
                </p>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-orange-700 dark:text-orange-400 mb-2">Does using the Bitcoin Halving Vault require me to give up control of my private keys?</h3>
                <p className="text-muted-foreground">
                  No, we offer multiple security configurations to accommodate different preferences:
                  <br /><br />
                  • Self-Custody Option: Your Bitcoin remains secured by your own hardware wallet, with time-lock and conditional release logic enforced through multi-signature arrangements where you maintain control of the primary keys.
                  <br /><br />
                  • Shared-Custody Option: For users who prefer additional security, we offer a configuration where the vault is secured through a multi-signature setup with keys distributed between you, our secure key management system, and optionally a trusted third party.
                  <br /><br />
                  Both options maintain the core security and time-lock features while giving you flexibility in how you manage custody.
                </p>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-orange-700 dark:text-orange-400 mb-2">Can I customize the DCA exit strategy to my specific investment goals?</h3>
                <p className="text-muted-foreground">
                  Yes, the Dollar-Cost Averaging (DCA) exit strategy is highly customizable. You can configure:
                  <br /><br />
                  • Distribution Schedule: Time-based (e.g., monthly withdrawals) or event-based (e.g., after specific price increases)
                  <br />
                  • Distribution Amounts: Fixed Bitcoin amounts, percentage-based portions, or value-based withdrawals
                  <br />
                  • Duration: Compressed (e.g., exit over 3 months) or extended (e.g., gradually exit over a full year)
                  <br />
                  • Conditions: Add conditions like minimum price requirements or maximum drawdown protections
                  <br /><br />
                  The system also allows you to simulate different DCA exit strategies against historical data to help you evaluate potential outcomes before committing to a specific approach.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DocumentationLayout>
  );
}