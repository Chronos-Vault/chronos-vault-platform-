import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocumentationLayout from "@/components/layout/DocumentationLayout";
import { 
  MoveRight, 
  Shield, 
  Clock, 
  UserPlus, 
  ScrollText,
  FileCheck, 
  Scale, 
  Key
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function InheritancePlanningVaultDocumentation() {
  return (
    <DocumentationLayout
      title="Inheritance Planning Vault"
      description="Secure estate planning with conditional access for beneficiaries"
      icon="🌳"
      cta={
        <Link href="/inheritance-planning-vault">
          <Button size="lg" className="mt-6 gap-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300">
            Create Inheritance Vault <MoveRight className="size-4" />
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
            <h2 className="text-3xl font-bold tracking-tight">Estate Planning for Digital Assets</h2>
            <p className="text-lg text-muted-foreground">
              The Inheritance Planning Vault is designed to securely transfer digital assets to your beneficiaries 
              according to your specific wishes. Whether you're planning for immediate family, extended family, 
              or charitable organizations, this vault ensures your digital assets are distributed according to 
              your predetermined plan.
            </p>
            
            <div className="grid gap-6 mt-8 md:grid-cols-2">
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <Shield className="size-10 text-amber-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Beneficiary Management</h3>
                <p className="text-muted-foreground">
                  Easily add, remove, and manage beneficiaries with customizable allocation percentages and roles.
                  Maintain complete control over who receives your assets and under what conditions.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <Clock className="size-10 text-amber-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Time-Based Distribution</h3>
                <p className="text-muted-foreground">
                  Schedule asset distributions based on specific dates, events, or conditions. Create structured 
                  release schedules for younger beneficiaries or gradual transitions.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <UserPlus className="size-10 text-amber-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Multi-Jurisdiction Support</h3>
                <p className="text-muted-foreground">
                  Configure your estate plan to comply with different jurisdictional requirements, ensuring your 
                  wishes are respected regardless of location or legal frameworks.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <ScrollText className="size-10 text-amber-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Legal Documentation</h3>
                <p className="text-muted-foreground">
                  Store important legal documents alongside your assets, including wills, trusts, and other estate 
                  planning documentation, ensuring beneficiaries have everything they need.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="features" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Comprehensive Features</h2>
            <p className="text-lg text-muted-foreground">
              The Inheritance Planning Vault includes a rich set of features designed specifically for secure 
              estate planning and asset transfer. From conditional releases to multimedia preservation, 
              this vault ensures your digital legacy is preserved and distributed exactly as you intend.
            </p>
            
            <div className="space-y-4 mt-6">
              <div className="border rounded-lg p-6 bg-card shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <UserPlus className="mr-3 text-amber-500" />
                  Beneficiary Management System
                </h3>
                <p className="text-muted-foreground mb-4">
                  Our comprehensive beneficiary management system allows you to:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2 text-amber-500">•</span> 
                    Add multiple beneficiaries with custom allocation percentages
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-amber-500">•</span> 
                    Define relationships and roles for each beneficiary
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-amber-500">•</span> 
                    Set up hierarchical inheritance structures with primary and contingent beneficiaries
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-amber-500">•</span> 
                    Include personal messages and instructions for each beneficiary
                  </li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-6 bg-card shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Clock className="mr-3 text-amber-500" />
                  Scheduled Asset Distribution
                </h3>
                <p className="text-muted-foreground mb-4">
                  Create sophisticated distribution schedules:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2 text-amber-500">•</span> 
                    Time-based releases at specific dates or intervals
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-amber-500">•</span> 
                    Age-based releases (e.g., when a beneficiary turns 21, 25, 30, etc.)
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-amber-500">•</span> 
                    Milestone-based releases tied to specific life events
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-amber-500">•</span> 
                    Phased distribution plans for spreading inheritances over time
                  </li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-6 bg-card shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Scale className="mr-3 text-amber-500" />
                  Conditional Release Mechanisms
                </h3>
                <p className="text-muted-foreground mb-4">
                  Set conditions for asset release:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2 text-amber-500">•</span> 
                    Multi-signature approval requirements from trustees or executors
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-amber-500">•</span> 
                    Documented verification of specific conditions being met
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-amber-500">•</span> 
                    Behavioral incentives and conditions for responsible inheritance
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-amber-500">•</span> 
                    Emergency override provisions for unexpected circumstances
                  </li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-6 bg-card shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <FileCheck className="mr-3 text-amber-500" />
                  Legal Documentation Storage
                </h3>
                <p className="text-muted-foreground mb-4">
                  Secure storage for essential documents:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2 text-amber-500">•</span> 
                    Store legally binding wills and testaments in digital format
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-amber-500">•</span> 
                    Include trust documents and executor instructions
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-amber-500">•</span> 
                    Maintain proof of authenticity with tamper-evident storage
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-amber-500">•</span> 
                    Include audio or video recordings of personal wishes and messages
                  </li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-6 bg-card shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Key className="mr-3 text-amber-500" />
                  Multi-Jurisdictional Compliance
                </h3>
                <p className="text-muted-foreground mb-4">
                  Navigate complex legal environments:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2 text-amber-500">•</span> 
                    Templates and guidance for different legal jurisdictions
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-amber-500">•</span> 
                    Compatibility with international inheritance laws
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-amber-500">•</span> 
                    Cross-border asset distribution mechanisms
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-amber-500">•</span> 
                    Compliance documentation for tax and regulatory purposes
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Estate Planning Security</h2>
            <p className="text-lg text-muted-foreground">
              The Inheritance Planning Vault implements multiple layers of security designed specifically for 
              the sensitive nature of estate planning and beneficiary management. Our security measures ensure 
              your wishes are followed while protecting against unauthorized access or tampering.
            </p>
            
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl p-6 my-6">
              <h3 className="text-xl font-bold text-amber-800 dark:text-amber-300 mb-3">Triple-Chain Security™ Protection</h3>
              <p className="text-amber-700 dark:text-amber-400">
                All inheritance plans are secured using our revolutionary Triple-Chain Security™ protocol, 
                distributing security verification across three distinct blockchain networks for unparalleled 
                protection against tampering or unauthorized changes.
              </p>
            </div>
            
            <div className="grid gap-6 mt-6 md:grid-cols-2">
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <h3 className="text-xl font-bold mb-3">Executor Verification</h3>
                <p className="text-muted-foreground">
                  Secure multi-signature requirements for executors and trustees, ensuring only authorized 
                  individuals can trigger distributions or modifications to the inheritance plan.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <h3 className="text-xl font-bold mb-3">Tamper-Proof Audit Trail</h3>
                <p className="text-muted-foreground">
                  Comprehensive logging of all changes and access attempts, creating an immutable record of all 
                  interactions with your inheritance plan for legal verification and security.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <h3 className="text-xl font-bold mb-3">Quantum-Resistant Encryption</h3>
                <p className="text-muted-foreground">
                  Future-proof encryption technology ensures your inheritance plan remains secure for decades 
                  to come, even against advanced quantum computing threats.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <h3 className="text-xl font-bold mb-3">Legal Verification Layer</h3>
                <p className="text-muted-foreground">
                  Optional integration with traditional legal frameworks, combining blockchain security with 
                  conventional legal protections for comprehensive estate planning.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="technical" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Technical Specifications</h2>
            <p className="text-lg text-muted-foreground">
              The Inheritance Planning Vault leverages advanced blockchain technology, smart contracts, and 
              cryptographic techniques to provide a secure and compliant estate planning solution. Our 
              technical implementation ensures both security and legal compliance.
            </p>
            
            <div className="mt-8 space-y-6">
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Blockchain Implementation</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Trinity Protocol: 2-of-3 Chain Security:</h4>
                    <p className="text-muted-foreground">
                      Fixed-role architecture: Ethereum Layer (Primary Security via Layer 2 for 95% lower fees), Solana Layer (Rapid Validation with millisecond confirmation), 
                      and TON Layer (Recovery System with quantum-resistant backup) provide 2-of-3 consensus protection.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Fixed Chain Roles:</h4>
                    <p className="text-muted-foreground">
                      Ethereum handles primary ownership and access control; Solana provides high-frequency monitoring; TON enables emergency recovery.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Smart Contract Standards:</h4>
                    <p className="text-muted-foreground">ERC-4626 (Tokenized Vault), ERC-721 (for beneficiary NFTs), cross-chain compatibility</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Consensus Mechanism:</h4>
                    <p className="text-muted-foreground">2-of-3 multi-chain validation with Layer 2 optimization for Ethereum transactions</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Cryptographic Security</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Encryption Algorithm:</h4>
                    <p className="text-muted-foreground">Post-quantum lattice-based encryption (CRYSTALS-Kyber)</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Document Integrity:</h4>
                    <p className="text-muted-foreground">SHA-3 based Merkle tree verification with cross-chain anchoring</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Access Control:</h4>
                    <p className="text-muted-foreground">Threshold Signature Scheme (TSS) for multi-party authentication</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Legal Integration Framework</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Document Verification:</h4>
                    <p className="text-muted-foreground">Digital signature system compliant with eIDAS (EU) and ESIGN Act (US)</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Legal Triggers:</h4>
                    <p className="text-muted-foreground">Oracle integration for verification of real-world events and legal status changes</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Compliance Management:</h4>
                    <p className="text-muted-foreground">Jurisdiction-specific rule engines for multi-regional compliance</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">System Performance</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Document Storage:</h4>
                    <p className="text-muted-foreground">Distributed storage across IPFS with encrypted redundancy</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Transaction Finality:</h4>
                    <p className="text-muted-foreground">Cross-chain confirmation within 5 minutes for critical operations</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Scalability:</h4>
                    <p className="text-muted-foreground">Supports up to 100 beneficiaries with complex conditional logic</p>
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
              Common questions about our Inheritance Planning Vault and estate planning on the blockchain.
            </p>
            
            <div className="mt-8 space-y-6">
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-amber-700 dark:text-amber-400 mb-2">Is my inheritance plan legally binding?</h3>
                <p className="text-muted-foreground">
                  The Inheritance Planning Vault provides a technologically secure way to express your wishes, but 
                  legal recognition varies by jurisdiction. For maximum legal protection, we recommend using our vault 
                  in conjunction with traditional legal documents prepared by an estate attorney. Our system allows you 
                  to store these legal documents alongside your digital assets.
                </p>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-amber-700 dark:text-amber-400 mb-2">How do beneficiaries claim their inheritance?</h3>
                <p className="text-muted-foreground">
                  Beneficiaries receive secure notifications when assets are available for them. They'll need to 
                  complete a verification process which can include identity verification, multi-factor authentication, 
                  and possibly executor approval depending on your configured settings. The system guides them through 
                  this process step by step.
                </p>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-amber-700 dark:text-amber-400 mb-2">Can I update my inheritance plan after creating it?</h3>
                <p className="text-muted-foreground">
                  Yes, you maintain full control over your inheritance plan during your lifetime. You can add or remove 
                  beneficiaries, adjust distribution percentages, modify conditions, and update stored documents. Every 
                  change is securely logged with timestamped proof of your authorization.
                </p>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-amber-700 dark:text-amber-400 mb-2">What happens if a beneficiary cannot be located?</h3>
                <p className="text-muted-foreground">
                  You can configure contingency plans for each beneficiary. Options include redirecting assets to alternate 
                  beneficiaries after a specified waiting period, donating to designated charities, or establishing more 
                  complex fallback distribution rules. The system will execute your specified contingency plan if primary 
                  distribution fails.
                </p>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-amber-700 dark:text-amber-400 mb-2">How are tax obligations handled?</h3>
                <p className="text-muted-foreground">
                  The vault includes documentation features for tax planning, but tax obligations vary widely by jurisdiction 
                  and asset type. We recommend consulting with a tax professional to understand the implications for your 
                  specific situation. The vault can store tax-related instructions and documentation for executors and 
                  beneficiaries.
                </p>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-amber-700 dark:text-amber-400 mb-2">Can I include digital assets from multiple blockchains?</h3>
                <p className="text-muted-foreground">
                  Yes, our Inheritance Planning Vault supports assets from any blockchain network, including Bitcoin, 
                  Ethereum, TON, Solana, and others. The system manages the technical complexity of cross-chain asset 
                  management while providing a unified interface for both you and your beneficiaries.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DocumentationLayout>
  );
}