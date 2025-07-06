import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocumentationLayout from "@/components/layout/DocumentationLayout";
import { 
  MoveRight, 
  Users, 
  Briefcase, 
  GraduationCap, 
  BookOpen,
  Shield, 
  Clock, 
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function FamilyHeritageVaultDocumentation() {
  return (
    <DocumentationLayout
      title="Family Heritage Vault"
      description="Secure generational wealth transfer with education"
      icon="👪"
      cta={
        <Link href="/create-vault/family-heritage">
          <Button size="lg" className="mt-6 gap-2 bg-gradient-to-r from-green-500 to-teal-400 hover:from-green-400 hover:to-teal-300">
            Create Family Heritage Vault <MoveRight className="size-4" />
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
            <h2 className="text-3xl font-bold tracking-tight">Multi-Generational Wealth Management</h2>
            <p className="text-lg text-muted-foreground">
              The Family Heritage Vault combines secure asset transfer across generations with built-in 
              financial education and values transmission, ensuring your family legacy includes both 
              wealth and wisdom for generations to come.
            </p>
            
            <div className="grid gap-6 mt-8 md:grid-cols-2">
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <Users className="size-10 text-green-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Structured Inheritance</h3>
                <p className="text-muted-foreground">
                  Create inheritance plans with custom rules, conditions, and milestones to ensure 
                  responsible asset distribution across multiple generations with legal recognition.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <GraduationCap className="size-10 text-green-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Financial Education</h3>
                <p className="text-muted-foreground">
                  Integrate educational requirements for heirs, unlocking access to assets as they 
                  develop financial literacy, investment knowledge, and wealth management skills.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <BookOpen className="size-10 text-green-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Values & Legacy Preservation</h3>
                <p className="text-muted-foreground">
                  Transmit family stories, values, and wisdom alongside assets through multimedia 
                  content, ethical guidelines, and personal messages to future generations.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <Briefcase className="size-10 text-green-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Family Business Continuity</h3>
                <p className="text-muted-foreground">
                  Establish governance frameworks for family businesses or investment partnerships, 
                  with succession plans and decision-making protocols for sustainable management.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="features" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Comprehensive Features</h2>
            <p className="text-lg text-muted-foreground">
              Our Family Heritage Vault offers an extensive suite of features designed to address the 
              complex needs of inter-generational wealth transfer, combining powerful financial tools 
              with educational resources and family legacy preservation.
            </p>
            
            <div className="space-y-4 mt-6">
              <div className="border rounded-lg p-6 bg-card shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Users className="mr-3 text-green-500" />
                  Multi-Generational Planning
                </h3>
                <p className="text-muted-foreground mb-4">
                  Create inheritance structures that span generations:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">•</span> 
                    Customizable family tree mapping with integrated inheritance paths
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">•</span> 
                    Asset distribution rules for multiple generational tiers
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">•</span> 
                    Contingency planning for family structure changes
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">•</span> 
                    Adaptive inheritance structures that evolve with family growth
                  </li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-6 bg-card shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <GraduationCap className="mr-3 text-green-500" />
                  Financial Education Integration
                </h3>
                <p className="text-muted-foreground mb-4">
                  Empower future generations with financial knowledge:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">•</span> 
                    Age-appropriate financial literacy modules and assessments
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">•</span> 
                    Investment and money management skill verification
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">•</span> 
                    Stepwise asset access tied to educational milestones
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">•</span> 
                    Customizable curriculum aligned with family values and asset types
                  </li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-6 bg-card shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Briefcase className="mr-3 text-green-500" />
                  Family Business & Governance
                </h3>
                <p className="text-muted-foreground mb-4">
                  Ensure seamless business continuity across generations:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">•</span> 
                    Family constitution and governance framework creation
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">•</span> 
                    Business succession planning with milestone-based transition
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">•</span> 
                    Role-based access and responsibilities assignment
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">•</span> 
                    Voting mechanisms for family business decisions
                  </li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-6 bg-card shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <BookOpen className="mr-3 text-green-500" />
                  Legacy & Values Preservation
                </h3>
                <p className="text-muted-foreground mb-4">
                  Transmit more than just financial assets:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">•</span> 
                    Multimedia family history archives with immutable storage
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">•</span> 
                    Personal messages and ethical guidelines for future generations
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">•</span> 
                    Family values declaration with continuity verification
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">•</span> 
                    Philanthropic vision and charitable giving frameworks
                  </li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-6 bg-card shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Clock className="mr-3 text-green-500" />
                  Adaptive Access Controls
                </h3>
                <p className="text-muted-foreground mb-4">
                  Customize how and when assets are accessed:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">•</span> 
                    Age-gated access with progressive release schedules
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">•</span> 
                    Achievement-based distribution triggers for responsible wealth transfer
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">•</span> 
                    Emergency access provisions with multi-party verification
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">•</span> 
                    Spending limits and utilization guidelines for inherited assets
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Multi-Generational Security</h2>
            <p className="text-lg text-muted-foreground">
              The Family Heritage Vault incorporates specialized security features designed for 
              long-term asset protection across generations, combining our standard blockchain 
              security with family-specific protections and governance structures.
            </p>
            
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-xl p-6 my-6">
              <h3 className="text-xl font-bold text-green-800 dark:text-green-300 mb-3">Triple-Chain Security™ Protection</h3>
              <p className="text-green-700 dark:text-green-400">
                All assets in your Family Heritage Vault are secured with our revolutionary
                Triple-Chain Security™ protocol, distributing security verification across three
                distinct blockchain networks with specialized family governance protections.
              </p>
            </div>
            
            <div className="grid gap-6 mt-6 md:grid-cols-2">
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <h3 className="text-xl font-bold mb-3">Generational Key Management</h3>
                <p className="text-muted-foreground">
                  Our multi-generational key system enables controlled access transfer between 
                  generations without compromising security, using age-gated progressive key 
                  sharing with biometric verification and legal identity confirmation.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <h3 className="text-xl font-bold mb-3">Family Governance Security</h3>
                <p className="text-muted-foreground">
                  Implement secure family governance structures with multi-signature approval 
                  requirements, role-based access controls, and configurable voting thresholds 
                  for major decisions affecting family assets.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <h3 className="text-xl font-bold mb-3">Long-Term Preservation Guarantees</h3>
                <p className="text-muted-foreground">
                  Family values, stories, and educational content are preserved through distributed 
                  multi-chain storage with periodic content verification, ensuring availability and 
                  integrity for future generations regardless of technological changes.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <h3 className="text-xl font-bold mb-3">Legal Integration & Recognition</h3>
                <p className="text-muted-foreground">
                  Our vault integrates with legal inheritance frameworks through cryptographic 
                  proof generation for court recognition, jurisdiction-specific compliance, and 
                  compatibility with traditional estate planning instruments.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="technical" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Technical Specifications</h2>
            <p className="text-lg text-muted-foreground">
              The Family Heritage Vault is built on a comprehensive technical framework designed 
              for multi-generational asset management, educational integration, and secure governance 
              with long-term viability at its core.
            </p>
            
            <div className="mt-8 space-y-6">
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Family Structure Management</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Relationship Modeling:</h4>
                    <p className="text-muted-foreground">Graph-based family relationship mapping with automatic inheritance path calculation</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Identity Verification:</h4>
                    <p className="text-muted-foreground">Multi-factor authentication with biometric, legal, and family confirmation components</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Access Transition:</h4>
                    <p className="text-muted-foreground">Progressive key sharing with time-locked and condition-based transfer mechanisms</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Governance Structure:</h4>
                    <p className="text-muted-foreground">Customizable voting weights, role assignments, and multi-signature authorization frameworks</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Educational Integration System</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Learning Framework:</h4>
                    <p className="text-muted-foreground">Modular financial education system with age-appropriate content progression</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Assessment Verification:</h4>
                    <p className="text-muted-foreground">Zero-knowledge proof system for private knowledge verification without exposing answers</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Progress Tracking:</h4>
                    <p className="text-muted-foreground">On-chain educational milestone recording with tamper-proof achievement history</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Content Delivery:</h4>
                    <p className="text-muted-foreground">Multimedia educational resources with decentralized storage and access control</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Asset Distribution Mechanics</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Distribution Triggers:</h4>
                    <p className="text-muted-foreground">Multi-condition smart contracts with age, education, and milestone-based execution</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Release Schedules:</h4>
                    <p className="text-muted-foreground">Configurable tiered distribution with percentage-based, fixed amount, and time-based options</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Usage Constraints:</h4>
                    <p className="text-muted-foreground">Purpose-specific fund allocation with verification of appropriate utilization</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Governance Approvals:</h4>
                    <p className="text-muted-foreground">Multi-party authorization requirements with configurable threshold signatures</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Legacy Preservation Architecture</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Content Storage:</h4>
                    <p className="text-muted-foreground">Distributed IPFS-based storage with content addressing and periodic verification</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Media Types:</h4>
                    <p className="text-muted-foreground">Support for text, audio, video, and interactive content with format migration capabilities</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Accessibility Control:</h4>
                    <p className="text-muted-foreground">Time-gated content release with personalized message delivery at specified events</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Longevity Protection:</h4>
                    <p className="text-muted-foreground">Multi-chain redundancy and format-agnostic storage for technology-resistant preservation</p>
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
              Common questions about our Family Heritage Vault and how it can help preserve and 
              transfer both wealth and wisdom across generations.
            </p>
            
            <div className="mt-8 space-y-6">
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-green-700 dark:text-green-400 mb-2">How does the Family Heritage Vault differ from standard inheritance planning?</h3>
                <p className="text-muted-foreground">
                  The Family Heritage Vault goes far beyond traditional inheritance planning in several important ways:
                  <br /><br />
                  1. Multi-Generational Scope: While standard inheritance typically focuses on the immediate next generation, our vault enables planning across multiple generations with sophisticated inheritance paths and conditions.
                  <br /><br />
                  2. Education Integration: Traditional inheritance simply transfers assets; our system integrates financial education to ensure heirs are prepared to manage their inheritance responsibly before receiving full access.
                  <br /><br />
                  3. Values and Legacy Preservation: Beyond financial assets, we provide robust tools for preserving family stories, values, and wisdom to ensure your legacy includes the principles and knowledge that created the wealth.
                  <br /><br />
                  4. Governance Frameworks: For family businesses or investment partnerships, we offer comprehensive governance structures that evolve over time, whereas traditional inheritance often results in fragmented ownership without clear decision-making protocols.
                  <br /><br />
                  5. Technological Resilience: Our system is designed for long-term preservation across decades or even centuries, with technological adaptability and legal recognition built into the core architecture.
                </p>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-green-700 dark:text-green-400 mb-2">How does the educational component of the vault work?</h3>
                <p className="text-muted-foreground">
                  Our educational system is designed to be both comprehensive and customizable:
                  <br /><br />
                  • Educational Framework: You can select from pre-built financial education curricula or create your own, covering topics from basic financial literacy to advanced investment strategies, entrepreneurship, and wealth preservation.
                  <br /><br />
                  • Progressive Learning: Content is age-appropriate and builds sequentially, with modules unlocking as heirs demonstrate proficiency in foundational concepts.
                  <br /><br />
                  • Assessment Methods: Knowledge verification uses a combination of interactive quizzes, case studies, practical exercises, and demonstrated real-world application of concepts.
                  <br /><br />
                  • Asset Unlocking: You can link educational achievements directly to asset access, with options ranging from simple completion requirements to demonstrated proficiency thresholds or practical application of knowledge.
                  <br /><br />
                  • Custom Family Wisdom: Beyond standard financial education, you can incorporate family-specific wisdom, business principles, or investment philosophies that have been successful for your family.
                  <br /><br />
                  The system balances rigor with flexibility, ensuring heirs have necessary knowledge while allowing you to tailor educational requirements to your family's specific needs and values.
                </p>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-green-700 dark:text-green-400 mb-2">Can I integrate existing legal documents and estate plans?</h3>
                <p className="text-muted-foreground">
                  Yes, the Family Heritage Vault is designed to complement and enhance your existing legal framework:
                  <br /><br />
                  • Legal Document Integration: You can securely store and reference traditional wills, trusts, and other legal documents within the system, creating a comprehensive repository of all inheritance-related material.
                  <br /><br />
                  • Cryptographic Verification: Traditional documents can be cryptographically hashed and stored on-chain, creating immutable proof of their existence and content at specific points in time.
                  <br /><br />
                  • Jurisdictional Compliance: The system can be configured to generate jurisdiction-specific legal attestations that meet local requirements for digital records and signatures.
                  <br /><br />
                  • Professional Collaboration: The vault includes access controls for estate attorneys, financial advisors, and trustees, allowing secure collaboration with your professional team.
                  <br /><br />
                  • Hybrid Enforcement: You can create inheritance structures that combine traditional legal enforcement with blockchain-based automated execution for the best of both worlds.
                  <br /><br />
                  We recommend working with your legal advisor to ensure proper integration between traditional estate planning instruments and the vault's digital capabilities.
                </p>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-green-700 dark:text-green-400 mb-2">How are family changes like marriages, births, or divorces handled?</h3>
                <p className="text-muted-foreground">
                  Our system includes robust mechanisms for handling family evolution over time:
                  <br /><br />
                  • Family Tree Updates: The vault's relationship graph can be updated to reflect marriages, births, adoptions, and other additions to the family structure, with verification procedures to confirm legitimate changes.
                  <br /><br />
                  • Conditional Inheritance Rules: You can establish inheritance rules that automatically adapt to family changes, such as per-capita distributions that adjust as new family members are added.
                  <br /><br />
                  • Divorce Protection: Assets can be protected through prenuptial requirements, separate property designations, and contingent inheritance paths that activate in case of divorce.
                  <br /><br />
                  • Guardian Provisions: For minor children, you can establish detailed guardianship instructions, including financial support structures and educational requirements for guardians.
                  <br /><br />
                  • Amendment Authority: You can designate trusted individuals who have limited authority to update family information after your passing, with multi-signature requirements and audit trails to prevent misuse.
                  <br /><br />
                  The system strikes a balance between establishing clear inheritance plans and maintaining the flexibility to accommodate the natural evolution of family structures over generations.
                </p>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-green-700 dark:text-green-400 mb-2">How does the vault help with family business succession?</h3>
                <p className="text-muted-foreground">
                  For family businesses, the vault offers specialized tools for successful transitions:
                  <br /><br />
                  • Leadership Succession Framework: Create detailed succession plans with qualification criteria, training requirements, and staged transition processes for key leadership positions.
                  <br /><br />
                  • Ownership Transfer Structure: Establish gradual ownership transfer mechanisms that maintain business stability while transitioning control to the next generation.
                  <br /><br />
                  • Business Knowledge Preservation: Document critical business knowledge, relationships, processes, and trade secrets in secure, access-controlled repositories for future leadership.
                  <br /><br />
                  • Governance Systems: Define board structures, voting rights, dispute resolution processes, and decision-making protocols that evolve through succession events.
                  <br /><br />
                  • Contingency Planning: Create detailed backup plans for unexpected succession scenarios, including interim leadership provisions and emergency decision-making protocols.
                  <br /><br />
                  • Value Alignment: Ensure business operations continue to align with family values through documented principles, ethical guidelines, and regular governance reviews.
                  <br /><br />
                  These tools help overcome the common challenges in family business succession, significantly improving the odds of successful transition beyond the typical three-generation lifespan of family enterprises.
                </p>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-green-700 dark:text-green-400 mb-2">How long can a Family Heritage Vault remain viable and accessible?</h3>
                <p className="text-muted-foreground">
                  The vault is engineered for exceptional longevity through multiple technical and design strategies:
                  <br /><br />
                  • Multi-Chain Redundancy: Critical data is stored across multiple blockchain networks, ensuring survival even if individual chains become obsolete.
                  <br /><br />
                  • Technology-Agnostic Storage: Content is stored in format-agnostic ways with migration paths to adapt to evolving technology standards.
                  <br /><br />
                  • Legal Continuity: The system generates legally recognized documentation that can be enforced through traditional legal systems regardless of technological changes.
                  <br /><br />
                  • Institutional Integration: Optional connections to established financial and legal institutions provide additional continuity guarantees.
                  <br /><br />
                  • Progressive Access Transfer: Each generation receives the knowledge and authority to maintain and update the system for the next generation.
                  <br /><br />
                  While no digital system can guarantee perpetual access, the Family Heritage Vault is designed with a target operational lifespan of at least 100+ years, with periodic technology migrations and legal framework updates to maintain continuity across changing technological and regulatory landscapes.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DocumentationLayout>
  );
}