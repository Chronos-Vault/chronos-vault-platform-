import { Route, Switch } from 'wouter';
import HomePage from './pages/home';
import NotFoundPage from './pages/not-found';
import CreateTonVaultPage from './pages/create-ton-vault';
import CrossChainBridgePage from './pages/cross-chain-bridge';
import CvtStakingPage from './pages/cvt-staking';
import PlaceholderPage from './pages/placeholder-page';
import { Toaster } from '@/components/ui/toaster';
import MainHeader from './components/layout/MainHeader';
import Footer from './components/layout/footer';

function App() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainHeader />
      <main className="flex-1">
        <Switch>
          {/* Main pages that exist */}
          <Route path="/" component={HomePage} />
          <Route path="/bridge" component={CrossChainBridgePage} />
          <Route path="/cross-chain-bridge" component={CrossChainBridgePage} />
          <Route path="/create-vault" component={CreateTonVaultPage} />
          <Route path="/staking" component={CvtStakingPage} />
          
          {/* Features section placeholders */}
          <Route path="/vault-types">
            {() => <PlaceholderPage pageName="Vault Types" description="Explore our comprehensive selection of secure vault options for different asset protection needs." />}
          </Route>
          <Route path="/vault-school">
            {() => <PlaceholderPage pageName="Vault School Hub" description="Learn about all vault types and security features in our comprehensive education center." />}
          </Route>
          <Route path="/smart-contract-vault">
            {() => <PlaceholderPage pageName="Smart Contract Vault" description="ERC-4626 compliant tokenized vault with advanced smart contract security features." />}
          </Route>
          <Route path="/multi-signature-vault-new">
            {() => <PlaceholderPage pageName="Multi-Signature Vault" description="Enhanced security requiring multiple approvals for secure asset access." />}
          </Route>
          <Route path="/biometric-vault">
            {() => <PlaceholderPage pageName="Biometric Vault" description="Secure vaults with cutting-edge biometric authentication." />}
          </Route>
          <Route path="/cross-chain-vault">
            {() => <PlaceholderPage pageName="Cross-Chain Vault" description="Assets secured across multiple blockchain networks with Triple-Chain Security." />}
          </Route>
          <Route path="/geo-vault">
            {() => <PlaceholderPage pageName="Geo-Location Vault" description="Access controlled by physical location requirements for enhanced security." />}
          </Route>
          <Route path="/specialized-vault-memory">
            {() => <PlaceholderPage pageName="Time-Lock Memory Vault" description="Store digital assets with multimedia memories in time-locked vaults." />}
          </Route>
          <Route path="/investment-discipline-vault">
            {() => <PlaceholderPage pageName="Investment Discipline Vault" description="Strategy-based vaults for investment discipline and asset protection." />}
          </Route>
          
          {/* Explore section placeholders */}
          <Route path="/cross-chain-monitor">
            {() => <PlaceholderPage pageName="Cross-Chain Monitor" description="Comprehensive monitoring dashboard for all integrated blockchain networks." />}
          </Route>
          <Route path="/transaction-monitor">
            {() => <PlaceholderPage pageName="Transaction Monitor" description="Monitor transaction status and activity across all connected chains." />}
          </Route>
          <Route path="/transaction-verification">
            {() => <PlaceholderPage pageName="Transaction Verification" description="Verify individual transactions across multiple blockchains." />}
          </Route>
          <Route path="/cross-chain-atomic-swap">
            {() => <PlaceholderPage pageName="Atomic Swaps" description="Peer-to-peer trading between blockchain networks with atomic guarantees." />}
          </Route>
          <Route path="/cross-chain-vs-atomic-swap">
            {() => <PlaceholderPage pageName="Bridge vs Swap" description="Comparison of cross-chain bridges and atomic swaps." />}
          </Route>
          <Route path="/cross-chain-security">
            {() => <PlaceholderPage pageName="Cross-Chain Security" description="Explore our Triple-Chain Security Architecture across TON, Ethereum and Solana." />}
          </Route>
          <Route path="/security-verification-demo">
            {() => <PlaceholderPage pageName="Security Verification" description="Demonstration of our security verification systems and ZK privacy shield." />}
          </Route>
          <Route path="/my-vaults">
            {() => <PlaceholderPage pageName="My Vaults" description="Browse and manage your existing vaults." />}
          </Route>
          
          {/* Token section placeholders */}
          <Route path="/cvt-token">
            {() => <PlaceholderPage pageName="CVT Token" description="The native utility token of the Chronos Vault platform." />}
          </Route>
          <Route path="/cvt-utility">
            {() => <PlaceholderPage pageName="CVT Utility" description="Explore the benefits and utility of holding CVT tokens." />}
          </Route>
          <Route path="/cvt-tokenomics">
            {() => <PlaceholderPage pageName="CVT Tokenomics" description="Detailed information about CVT token supply, distribution and economics." />}
          </Route>
          <Route path="/bitcoin-halving">
            {() => <PlaceholderPage pageName="Bitcoin Halving Vault" description="Special vaults timed to Bitcoin halving cycles for long-term hodlers." />}
          </Route>
          <Route path="/gift-crypto">
            {() => <PlaceholderPage pageName="Gift Crypto" description="Create and send crypto gift vaults to friends and family." />}
          </Route>
          <Route path="/token-vaults">
            {() => <PlaceholderPage pageName="Token Vaults" description="Specialized vaults for token management and protection." />}
          </Route>
          
          {/* Documentation section placeholders */}
          <Route path="/whitepaper">
            {() => <PlaceholderPage pageName="CVT Whitepaper" description="Technical whitepaper detailing the Chronos Vault platform." />}
          </Route>
          <Route path="/technical-specification">
            {() => <PlaceholderPage pageName="Technical Specifications" description="Detailed technical architecture and specifications." />}
          </Route>
          <Route path="/smart-contracts">
            {() => <PlaceholderPage pageName="Smart Contracts" description="Contract addresses and audit information." />}
          </Route>
          <Route path="/roadmap">
            {() => <PlaceholderPage pageName="Roadmap" description="Project development timeline and future plans." />}
          </Route>
          <Route path="/documentation">
            {() => <PlaceholderPage pageName="Documentation" description="Developer and user resources." />}
          </Route>
          <Route path="/audit-test">
            {() => <PlaceholderPage pageName="Smart Contract Audit" description="Security audit information for Chronos Vault contracts." />}
          </Route>
          <Route path="/about">
            {() => <PlaceholderPage pageName="About Us" description="Learn about the Chronos Vault team and mission." />}
          </Route>
          <Route path="/faq">
            {() => <PlaceholderPage pageName="FAQ" description="Frequently asked questions about Chronos Vault." />}
          </Route>
          
          {/* Fallback */}
          <Route component={NotFoundPage} />
        </Switch>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;