import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocumentationLayout from "@/components/layout/DocumentationLayout";
import { 
  MoveRight, 
  Target, 
  Trophy, 
  Unlock, 
  Award,
  Shield, 
  CheckCircle, 
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function MilestoneBasedVaultDocumentation() {
  return (
    <DocumentationLayout
      title="Milestone-Based Release Vault"
      description="Unlocks assets when you achieve personal goals"
      icon="🏆"
      cta={
        <Link href="/create-vault/milestone">
          <Button size="lg" className="mt-6 gap-2 bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-400 hover:to-yellow-300">
            Create Milestone Vault <MoveRight className="size-4" />
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
            <h2 className="text-3xl font-bold tracking-tight">Achievement-Driven Asset Management</h2>
            <p className="text-lg text-muted-foreground">
              The Milestone-Based Release Vault transforms your assets into powerful motivational tools 
              by linking them to your personal and professional achievements. Set meaningful goals, 
              verify your progress, and unlock rewards as you achieve milestones.
            </p>
            
            <div className="grid gap-6 mt-8 md:grid-cols-2">
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <Target className="size-10 text-orange-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Goal-Based Unlocking</h3>
                <p className="text-muted-foreground">
                  Link asset releases to specific achievements, creating a powerful incentive system 
                  that rewards your progress with predetermined asset unlocks.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <Trophy className="size-10 text-orange-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Achievement Verification</h3>
                <p className="text-muted-foreground">
                  Choose from multiple verification methods, from trusted third-party attestations 
                  to data-driven proof systems that validate your accomplishments.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <Unlock className="size-10 text-orange-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Progressive Release System</h3>
                <p className="text-muted-foreground">
                  Set up tiered achievement levels with corresponding asset releases, creating 
                  a progression system that scales rewards with your level of accomplishment.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <Award className="size-10 text-orange-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Personal Development Integration</h3>
                <p className="text-muted-foreground">
                  Transform financial management into a growth tool by integrating with personal 
                  development frameworks and goal tracking systems.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="features" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Comprehensive Features</h2>
            <p className="text-lg text-muted-foreground">
              Our Milestone-Based Release Vault offers a complete suite of features designed to transform 
              your asset management into a powerful motivational and achievement-tracking system, all while 
              maintaining the highest standards of security and flexibility.
            </p>
            
            <div className="space-y-4 mt-6">
              <div className="border rounded-lg p-6 bg-card shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Target className="mr-3 text-orange-500" />
                  Customizable Goal Configuration
                </h3>
                <p className="text-muted-foreground mb-4">
                  Create personalized achievement frameworks:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2 text-orange-500">•</span> 
                    Define specific, measurable goals across multiple life domains
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-orange-500">•</span> 
                    Set timeframes, milestones, and completion criteria
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-orange-500">•</span> 
                    Create nested goal hierarchies with prerequisites
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-orange-500">•</span> 
                    Implement flexible scoring systems for partial achievements
                  </li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-6 bg-card shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Trophy className="mr-3 text-orange-500" />
                  Multi-Method Verification System
                </h3>
                <p className="text-muted-foreground mb-4">
                  Choose how your achievements are validated:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2 text-orange-500">•</span> 
                    Trusted witness attestations from designated verifiers
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-orange-500">•</span> 
                    Data-driven verification through API integrations with fitness apps, educational platforms, etc.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-orange-500">•</span> 
                    Documentary evidence verification with zero-knowledge proofs
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-orange-500">•</span> 
                    Multi-party consensus verification for community goals
                  </li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-6 bg-card shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Unlock className="mr-3 text-orange-500" />
                  Asset Release Customization
                </h3>
                <p className="text-muted-foreground mb-4">
                  Configure flexible reward structures:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2 text-orange-500">•</span> 
                    Percentage-based asset releases tied to achievement levels
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-orange-500">•</span> 
                    Fixed amount distributions for specific milestone completions
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-orange-500">•</span> 
                    Bonus release mechanisms for exceeding targets or early completion
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-orange-500">•</span> 
                    Time-weighted progressive releases for sustained achievements
                  </li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-6 bg-card shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <CheckCircle className="mr-3 text-orange-500" />
                  Progress Tracking Dashboard
                </h3>
                <p className="text-muted-foreground mb-4">
                  Monitor your journey to achievement:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2 text-orange-500">•</span> 
                    Visual progress indicators for all goals and milestones
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-orange-500">•</span> 
                    Achievement history and milestone completion timeline
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-orange-500">•</span> 
                    Asset release forecasting based on current progress rates
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-orange-500">•</span> 
                    Customizable alerts and reminders for goal deadlines
                  </li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-6 bg-card shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Award className="mr-3 text-orange-500" />
                  Integration Capabilities
                </h3>
                <p className="text-muted-foreground mb-4">
                  Connect with your existing tools and communities:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2 text-orange-500">•</span> 
                    API connections to goal tracking and habit formation apps
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-orange-500">•</span> 
                    Fitness platform integrations for health and wellness goals
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-orange-500">•</span> 
                    Educational achievement verification through learning platforms
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-orange-500">•</span> 
                    Community goal sharing and group achievement tracking
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Achievement-Specific Security</h2>
            <p className="text-lg text-muted-foreground">
              The Milestone-Based Release Vault combines our standard blockchain security with specialized 
              verification and validation systems designed to ensure the integrity of achievement claims 
              while protecting both your assets and personal data.
            </p>
            
            <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 rounded-xl p-6 my-6">
              <h3 className="text-xl font-bold text-orange-800 dark:text-orange-300 mb-3">Triple-Chain Security™ Protection</h3>
              <p className="text-orange-700 dark:text-orange-400">
                All assets in your Milestone-Based Release Vault are secured with our revolutionary
                Triple-Chain Security™ protocol, distributing security verification across three
                distinct blockchain networks with additional verification checks for milestone achievements.
              </p>
            </div>
            
            <div className="grid gap-6 mt-6 md:grid-cols-2">
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <h3 className="text-xl font-bold mb-3">Verification Integrity Protection</h3>
                <p className="text-muted-foreground">
                  Our multi-layer verification system prevents manipulation of achievement evidence 
                  through cryptographic signatures, timestamp validation, and cross-reference verification 
                  across multiple trusted sources.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <h3 className="text-xl font-bold mb-3">Anti-Collusion Controls</h3>
                <p className="text-muted-foreground">
                  For social verification methods, our system implements sophisticated anti-collusion 
                  measures including randomized verifier selection, blind verification processes, and 
                  reputation-staking mechanisms to ensure honest attestations.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <h3 className="text-xl font-bold mb-3">Privacy-Preserving Verification</h3>
                <p className="text-muted-foreground">
                  Our zero-knowledge proof system allows you to verify achievements without exposing 
                  sensitive personal data, enabling verification of metrics like income thresholds, 
                  health statistics, or test scores without revealing the underlying data.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <h3 className="text-xl font-bold mb-3">Dispute Resolution Protocol</h3>
                <p className="text-muted-foreground">
                  In cases where achievement verification is contested, our secure multi-party resolution 
                  system provides a fair and transparent process for reviewing evidence and determining 
                  milestone completion status.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="technical" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Technical Specifications</h2>
            <p className="text-lg text-muted-foreground">
              The Milestone-Based Release Vault is built on a sophisticated technical framework that enables 
              secure achievement verification, flexible goal tracking, and automated asset releases based 
              on validated accomplishments.
            </p>
            
            <div className="mt-8 space-y-6">
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Goal Framework Architecture</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Goal Structure:</h4>
                    <p className="text-muted-foreground">Hierarchical goal organization with nestable sub-goals and dependency mapping</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Achievement Metrics:</h4>
                    <p className="text-muted-foreground">Supports boolean completion, numerical ranges, frequency-based tasks, and cumulative metrics</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Timeline Management:</h4>
                    <p className="text-muted-foreground">Configurable deadlines, recurring milestones, and adaptive timeframes</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Scoring System:</h4>
                    <p className="text-muted-foreground">Weighted achievement calculation with partial completion recognition</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Verification Mechanisms</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Trusted Attestation:</h4>
                    <p className="text-muted-foreground">Multi-signature verification system with configurable trusted party thresholds</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Data Integration:</h4>
                    <p className="text-muted-foreground">OAuth API connections to 30+ external platforms with encrypted data transmission</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Evidence Storage:</h4>
                    <p className="text-muted-foreground">IPFS-based tamper-proof storage with selective encryption for sensitive documents</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Zero-Knowledge Proofs:</h4>
                    <p className="text-muted-foreground">zk-SNARKs implementation for private data verification without exposure</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Release Logic System</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Conditional Triggers:</h4>
                    <p className="text-muted-foreground">Complex boolean logic for multi-condition achievement recognition</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Distribution Methods:</h4>
                    <p className="text-muted-foreground">Percentage-based, fixed amount, staged release, and bonus acceleration options</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Time Constraints:</h4>
                    <p className="text-muted-foreground">Deadline-based modifiers with early completion bonuses and expiration handling</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Fallback Mechanisms:</h4>
                    <p className="text-muted-foreground">Configurable partial release options for near-miss scenarios and contingency planning</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Smart Contract Implementation</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Contract Type:</h4>
                    <p className="text-muted-foreground">ERC-4626 compliant tokenized vault with milestone extensions</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Oracle Integration:</h4>
                    <p className="text-muted-foreground">Chainlink-powered external data verification with multi-source consensus</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Cross-Chain Support:</h4>
                    <p className="text-muted-foreground">Asset management across Ethereum, Solana, and TON with synchronized milestone tracking</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Gas Optimization:</h4>
                    <p className="text-muted-foreground">Layer-2 verification processing with mainnet anchoring for cost-efficient operation</p>
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
              Common questions about our Milestone-Based Release Vault and how it can transform your asset 
              management into a powerful motivational system.
            </p>
            
            <div className="mt-8 space-y-6">
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-orange-700 dark:text-orange-400 mb-2">What types of achievements can be used with this vault?</h3>
                <p className="text-muted-foreground">
                  The Milestone-Based Release Vault supports a wide spectrum of achievement types:
                  <br /><br />
                  • Personal Development: Educational certifications, skills mastery, learning milestones
                  <br />
                  • Health & Fitness: Weight goals, fitness accomplishments, wellness habits
                  <br />
                  • Financial: Savings targets, debt reduction, investment milestones
                  <br />
                  • Professional: Career advancement, business growth metrics, project completions
                  <br />
                  • Creative: Portfolio development, artistic output, publication achievements
                  <br /><br />
                  The system is designed to be highly customizable, allowing you to define achievements that are meaningful to you personally. You can create simple "completed/not completed" goals or complex multi-stage achievements with measurable metrics.
                </p>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-orange-700 dark:text-orange-400 mb-2">How does the verification process work?</h3>
                <p className="text-muted-foreground">
                  Our verification system offers multiple methods to validate your achievements, based on your preferences and the nature of your goals:
                  <br /><br />
                  1. Trusted Verifiers: You can designate specific people (mentors, coaches, supervisors) who can verify your accomplishments through our secure attestation system. Verifiers use multi-factor authentication and digitally sign their confirmations.
                  <br /><br />
                  2. Data Integrations: For measurable goals, we can connect directly to platforms like fitness apps, learning platforms, or financial services (with your permission) to automatically verify data-based achievements.
                  <br /><br />
                  3. Documentary Evidence: Upload certificates, completion records, or other evidence to our secure system. For privacy-sensitive documents, our zero-knowledge proof system can verify authenticity without exposing confidential details.
                  <br /><br />
                  4. Multi-Party Consensus: For community or group goals, we offer a collective verification system where multiple participants can confirm milestone completion.
                  <br /><br />
                  All verification methods include timestamping, cryptographic signatures, and tamper-proof storage to ensure the integrity of achievement records.
                </p>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-orange-700 dark:text-orange-400 mb-2">What happens if I don't achieve a milestone?</h3>
                <p className="text-muted-foreground">
                  Our system is designed to be flexible and accommodate real-world complexities:
                  <br /><br />
                  • Partial Completion: For quantifiable goals, you can set up partial releases based on your percentage of completion (e.g., reaching 80% of a target could release 70% of the associated assets).
                  <br /><br />
                  • Deadline Extensions: You can configure the vault to allow a certain number of timeline adjustments, either automatically or through verification by your designated trusted parties.
                  <br /><br />
                  • Alternative Achievements: Set up "either/or" goal structures where completing alternative achievements can substitute for the original milestone.
                  <br /><br />
                  • Fallback Plans: You can establish contingency rules that activate after certain periods, such as a gradual release schedule that begins if milestones remain unmet after a specified date.
                  <br /><br />
                  The vault is ultimately under your control, so you always retain the ability to release your assets through the emergency access provisions, though this typically requires additional verification steps.
                </p>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-orange-700 dark:text-orange-400 mb-2">Can I use this for team or family goals?</h3>
                <p className="text-muted-foreground">
                  Yes, the Milestone-Based Release Vault has powerful collaborative features:
                  <br /><br />
                  • Group Achievements: Set up milestones that require multiple participants to complete their individual contributions, with assets released when the collective goal is achieved.
                  <br /><br />
                  • Family Planning: Create educational funds that release based on academic achievements, or savings plans that unlock as financial literacy milestones are reached.
                  <br /><br />
                  • Team Incentives: Business teams can establish shared performance metrics with reward distributions when targets are met.
                  <br /><br />
                  • Accountability Partnerships: Set up mutual goals with a partner where both parties must verify each other's progress.
                  <br /><br />
                  For group vaults, we offer advanced features like proportional distribution based on contribution level, leader/admin verification roles, and customizable privacy settings to control what information is shared within the group.
                </p>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-orange-700 dark:text-orange-400 mb-2">What types of assets can I store in this vault?</h3>
                <p className="text-muted-foreground">
                  The Milestone-Based Release Vault supports a diverse range of digital assets:
                  <br /><br />
                  • Cryptocurrencies: All major cryptocurrencies including Bitcoin, Ethereum, TON, and hundreds of altcoins
                  <br /><br />
                  • Tokens: ERC-20, ERC-721 (NFTs), and other standard tokens across supported blockchains
                  <br /><br />
                  • Digital Rewards: Custom tokens, access credentials, or digital gift cards that can be programmed to release upon achievement
                  <br /><br />
                  • Access Keys: Keys to additional content, services, or premium features that unlock with progress
                  <br /><br />
                  While the vault primarily holds digital assets, you can also create symbolic connections to traditional assets through our tokenization partners, where real-world value is represented by on-chain tokens that can be released based on your achievements.
                </p>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-orange-700 dark:text-orange-400 mb-2">How can I track my progress toward milestones?</h3>
                <p className="text-muted-foreground">
                  Our comprehensive progress tracking system includes:
                  <br /><br />
                  • Visual Dashboard: Interactive visual representations of your goals, progress, and remaining milestones
                  <br /><br />
                  • Detailed Analytics: Quantitative tracking of completion percentages, timelines, and projected completion dates
                  <br /><br />
                  • Journal Integration: A built-in reflection system to document your journey and insights as you work toward your goals
                  <br /><br />
                  • Notification System: Customizable alerts for approaching deadlines, milestone achievements, and verification updates
                  <br /><br />
                  • Progress Sharing: Optional secure sharing of progress metrics with trusted supporters or accountability partners
                  <br /><br />
                  For integrated goals (connected to external platforms), real-time progress updates are synchronized automatically. For manually verified goals, you can submit progress updates at any time, with pending verification status clearly indicated until confirmed by your designated verifiers.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DocumentationLayout>
  );
}