import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocumentationLayout from "@/components/layout/DocumentationLayout";
import { 
  MoveRight, 
  Zap, 
  Activity, 
  Timer, 
  Link2,
  Lock, 
  BarChart, 
  Server
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function PaymentChannelVaultDocumentation() {
  return (
    <DocumentationLayout
      title="Payment Channel Vault"
      description="Optimized for high-frequency transactions with instant settlement"
      icon="💸"
      cta={
        <Link href="/payment-channel-vault">
          <Button size="lg" className="mt-6 gap-2 bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-400 hover:to-cyan-300">
            Create Payment Channel Vault <MoveRight className="size-4" />
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
            <h2 className="text-3xl font-bold tracking-tight">High-Frequency Transaction Solution</h2>
            <p className="text-lg text-muted-foreground">
              The Payment Channel Vault is specifically designed for scenarios requiring fast, numerous 
              transactions with minimal fees and instant settlement. This vault type leverages layer-2 
              technology to enable thousands of transactions per second without congesting the blockchain.
            </p>
            
            <div className="grid gap-6 mt-8 md:grid-cols-2">
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <Zap className="size-10 text-sky-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Instant Settlements</h3>
                <p className="text-muted-foreground">
                  Experience sub-second transaction confirmations without waiting for on-chain block validation,
                  enabling real-time payment experiences for users and applications.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <Activity className="size-10 text-sky-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Micro-Transaction Support</h3>
                <p className="text-muted-foreground">
                  Conduct thousands of small-value transactions without prohibitive gas fees, making
                  micro-payments and streaming payments economically viable.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <Timer className="size-10 text-sky-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Payment Streaming</h3>
                <p className="text-muted-foreground">
                  Enable continuous payment flows in real-time, allowing for per-second billing models,
                  content streaming payments, and other time-based payment needs.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <Link2 className="size-10 text-sky-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Cross-Platform Compatibility</h3>
                <p className="text-muted-foreground">
                  Integrate with multiple blockchains and payment systems, allowing seamless 
                  operation across different networks and ecosystems.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="features" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Comprehensive Features</h2>
            <p className="text-lg text-muted-foreground">
              Our Payment Channel Vault includes a full suite of features designed to maximize transaction 
              efficiency, minimize costs, and enable new payment models that were previously impossible 
              on traditional blockchain networks.
            </p>
            
            <div className="space-y-4 mt-6">
              <div className="border rounded-lg p-6 bg-card shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Activity className="mr-3 text-sky-500" />
                  Off-Chain Transaction Capabilities
                </h3>
                <p className="text-muted-foreground mb-4">
                  Process transactions off the main blockchain for superior performance:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2 text-sky-500">•</span> 
                    Conduct thousands of transactions without touching the main chain
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-sky-500">•</span> 
                    Reduce gas fees by up to 99% compared to on-chain transactions
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-sky-500">•</span> 
                    Scale to thousands of transactions per second regardless of chain congestion
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-sky-500">•</span> 
                    Choose when to settle to the main chain based on business needs
                  </li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-6 bg-card shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Server className="mr-3 text-sky-500" />
                  Batched Settlement Options
                </h3>
                <p className="text-muted-foreground mb-4">
                  Optimize cost efficiency through strategic settlement:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2 text-sky-500">•</span> 
                    Combine hundreds or thousands of transactions into a single on-chain settlement
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-sky-500">•</span> 
                    Schedule automatic settlements based on time, value thresholds, or custom rules
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-sky-500">•</span> 
                    Optimize gas usage by settling during low network congestion periods
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-sky-500">•</span> 
                    Maintain full cryptographic proof of all transactions in each batch
                  </li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-6 bg-card shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Timer className="mr-3 text-sky-500" />
                  Payment Streaming Functionality
                </h3>
                <p className="text-muted-foreground mb-4">
                  Enable continuous payment flows:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2 text-sky-500">•</span> 
                    Stream payments per second, minute, hour, or custom time intervals
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-sky-500">•</span> 
                    Start and stop payment streams with millisecond precision
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-sky-500">•</span> 
                    Support variable rate payment streams based on usage or other metrics
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-sky-500">•</span> 
                    Enable pay-as-you-go models for various digital services
                  </li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-6 bg-card shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Zap className="mr-3 text-sky-500" />
                  Low-Latency Operations
                </h3>
                <p className="text-muted-foreground mb-4">
                  Experience instant transaction processing:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2 text-sky-500">•</span> 
                    Sub-second transaction confirmations for real-time user experience
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-sky-500">•</span> 
                    Predictable performance regardless of blockchain network congestion
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-sky-500">•</span> 
                    Eliminate the uncertainty of waiting for block confirmations
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-sky-500">•</span> 
                    High reliability with 99.9% uptime guarantee
                  </li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-6 bg-card shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Lock className="mr-3 text-sky-500" />
                  Conditional Payment Release
                </h3>
                <p className="text-muted-foreground mb-4">
                  Set rules for when payments are executed:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2 text-sky-500">•</span> 
                    Implement time-based conditions for automatic payment execution
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-sky-500">•</span> 
                    Create oracle-based triggers linked to real-world events or data
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-sky-500">•</span> 
                    Enable multi-signature requirements for payment authorization
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-sky-500">•</span> 
                    Support escrow-like functionality with conditional releases
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Security Architecture</h2>
            <p className="text-lg text-muted-foreground">
              The Payment Channel Vault implements multiple security layers to ensure that off-chain 
              transactions maintain the same security guarantees as on-chain operations, while adding 
              additional protections specific to payment channel technology.
            </p>
            
            <div className="bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900 rounded-xl p-6 my-6">
              <h3 className="text-xl font-bold text-sky-800 dark:text-sky-300 mb-3">Triple-Chain Security™ Protection</h3>
              <p className="text-sky-700 dark:text-sky-400">
                All payment channels are secured using our revolutionary Triple-Chain Security™ protocol, 
                utilizing three distinct blockchain networks to verify and protect channel states, providing 
                unprecedented security for your high-frequency transaction needs.
              </p>
            </div>
            
            <div className="grid gap-6 mt-6 md:grid-cols-2">
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <h3 className="text-xl font-bold mb-3">Cryptographic State Verification</h3>
                <p className="text-muted-foreground">
                  Every transaction within a payment channel is cryptographically signed and verified, 
                  creating an immutable audit trail that can be used to prove the current state in case 
                  of disputes.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <h3 className="text-xl font-bold mb-3">Fraud-Proof System</h3>
                <p className="text-muted-foreground">
                  Our payment channels include built-in fraud detection with automatic challenge periods, 
                  allowing any party to submit proof of the correct channel state if a malicious actor 
                  attempts to submit an outdated or invalid state.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <h3 className="text-xl font-bold mb-3">Automatic Channel Monitoring</h3>
                <p className="text-muted-foreground">
                  24/7 automated monitoring of all payment channels with instant alerts for any suspicious 
                  activity, ensuring rapid response to potential security threats.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <h3 className="text-xl font-bold mb-3">Guaranteed Settlement Mechanism</h3>
                <p className="text-muted-foreground">
                  Multi-chain backup settlement ensures that even in the event of primary chain congestion 
                  or technical issues, your transactions will still be processed and settled securely.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="technical" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Technical Specifications</h2>
            <p className="text-lg text-muted-foreground">
              The Payment Channel Vault utilizes cutting-edge blockchain technology to achieve unparalleled 
              transaction throughput, cost efficiency, and latency performance while maintaining security.
            </p>
            
            <div className="mt-8 space-y-6">
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Layer-2 Technology Stack</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Channel Protocol:</h4>
                    <p className="text-muted-foreground">Optimized state channels with multi-party support</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Primary Chain:</h4>
                    <p className="text-muted-foreground">Ethereum (for settlement) with TON optimized channels</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Secondary Chains:</h4>
                    <p className="text-muted-foreground">Solana (for high-throughput channels) and Bitcoin (for Bitcoin Lightning integration)</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Smart Contract Standards:</h4>
                    <p className="text-muted-foreground">ERC-1155 (for channel tokens) with custom ChronosVault payment protocol extensions</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Performance Metrics</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Transaction Throughput:</h4>
                    <p className="text-muted-foreground">Up to 10,000 transactions per second per channel</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Latency:</h4>
                    <p className="text-muted-foreground">Average confirmation time of 50-100ms</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Cost Efficiency:</h4>
                    <p className="text-muted-foreground">Approximately 0.0001% of on-chain transaction costs for typical operations</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Channel Capacity:</h4>
                    <p className="text-muted-foreground">Up to 1,000,000 transactions before settlement required</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Security Implementation</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Cryptographic Protocol:</h4>
                    <p className="text-muted-foreground">ECDSA with secp256k1 and optional quantum-resistant signature schemes</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">State Validation:</h4>
                    <p className="text-muted-foreground">Multi-signature state updates with monotonically increasing nonce values</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Dispute Resolution:</h4>
                    <p className="text-muted-foreground">Automated on-chain challenge-response protocol with 72-hour challenge period</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Watchtower Service:</h4>
                    <p className="text-muted-foreground">Distributed network of state monitors with triple redundancy</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Integrations & Compatibility</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">API Support:</h4>
                    <p className="text-muted-foreground">RESTful and GraphQL APIs with WebSocket real-time updates</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">SDK Support:</h4>
                    <p className="text-muted-foreground">JavaScript/TypeScript, Python, Go, and Rust client libraries</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Protocol Interoperability:</h4>
                    <p className="text-muted-foreground">Compatible with Bitcoin Lightning Network, Raiden Network, and custom solutions</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Fiat On/Off Ramps:</h4>
                    <p className="text-muted-foreground">Integration with major fiat payment processors and exchanges</p>
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
              Common questions about our Payment Channel Vault and off-chain transaction technology.
            </p>
            
            <div className="mt-8 space-y-6">
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-sky-700 dark:text-sky-400 mb-2">What happens if a party goes offline during a payment channel session?</h3>
                <p className="text-muted-foreground">
                  If any party goes offline during an active channel session, the most recent valid signed state 
                  remains enforceable. Our system includes automatic "watchtowers" that monitor channels and can 
                  initiate settlement on your behalf if needed. Additionally, you can configure automatic settlement 
                  triggers based on inactivity periods to ensure your funds are always secure.
                </p>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-sky-700 dark:text-sky-400 mb-2">How much can I save on transaction fees with a Payment Channel Vault?</h3>
                <p className="text-muted-foreground">
                  The cost savings are substantial. For example, if you normally conduct 1,000 on-chain transactions 
                  at $0.50 per transaction, that would cost $500. With our Payment Channel Vault, you only pay for 
                  channel opening and final settlement (approximately $1-2 total) plus a small platform fee of 0.05%, 
                  resulting in potential savings of over 99% for high-volume transaction scenarios.
                </p>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-sky-700 dark:text-sky-400 mb-2">Can I use Payment Channel Vaults with any cryptocurrency?</h3>
                <p className="text-muted-foreground">
                  Yes, our Payment Channel Vault supports multiple cryptocurrencies across different blockchains. 
                  We currently support Ethereum (and ERC-20 tokens), TON, Solana (and SPL tokens), and Bitcoin. 
                  Each channel operates with a specific cryptocurrency, but you can create multiple channels for 
                  different assets. We also support wrapped tokens for cross-chain functionality.
                </p>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-sky-700 dark:text-sky-400 mb-2">How secure are off-chain transactions compared to on-chain ones?</h3>
                <p className="text-muted-foreground">
                  Off-chain transactions in our Payment Channel Vault maintain the same cryptographic security as 
                  on-chain transactions. Every transaction is signed with the same secure methods used on the blockchain. 
                  The primary difference is that these transactions aren't immediately broadcast to the network. Instead, 
                  they're accumulated and can be settled on-chain at any time. Our Triple-Chain Security™ adds additional 
                  protection by utilizing multiple blockchains for verification and dispute resolution.
                </p>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-sky-700 dark:text-sky-400 mb-2">What happens if there's a dispute between parties in a payment channel?</h3>
                <p className="text-muted-foreground">
                  Our system includes a comprehensive dispute resolution mechanism. If there's a disagreement about 
                  the current state of a channel, either party can initiate a dispute by submitting their latest 
                  signed state to the blockchain. This triggers a challenge period (typically 72 hours) during which 
                  the other party can submit a more recent signed state. After the challenge period, the most recent 
                  valid state is considered final, and the channel is settled accordingly.
                </p>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-sky-700 dark:text-sky-400 mb-2">Can I integrate Payment Channel Vaults into my own application or service?</h3>
                <p className="text-muted-foreground">
                  Absolutely! We offer comprehensive SDKs in multiple programming languages and well-documented 
                  APIs for seamless integration. Our system can be embedded into web applications, mobile apps, 
                  gaming platforms, content delivery networks, and any other service requiring high-frequency 
                  microtransactions. Our technical team is also available for custom integration support for 
                  enterprise clients.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DocumentationLayout>
  );
}