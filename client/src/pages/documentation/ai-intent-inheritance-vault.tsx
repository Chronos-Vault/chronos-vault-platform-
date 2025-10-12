import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocumentationLayout from "@/components/layout/DocumentationLayout";
import { 
  MoveRight, 
  Brain, 
  FileText, 
  Users, 
  Fingerprint,
  Shield, 
  ScrollText, 
  Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function AIIntentInheritanceVaultDocumentation() {
  return (
    <DocumentationLayout
      title="AI Intent Inheritance Vault"
      description="Natural language inheritance planning with advanced intent recognition"
      icon="🧠"
      cta={
        <Link href="/create-vault/ai-intent">
          <Button size="lg" className="mt-6 gap-2 bg-gradient-to-r from-indigo-500 to-purple-400 hover:from-indigo-400 hover:to-purple-300">
            Create AI Intent Vault <MoveRight className="size-4" />
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
            <h2 className="text-3xl font-bold tracking-tight">Natural Language Inheritance Planning</h2>
            <p className="text-lg text-muted-foreground">
              The AI Intent Inheritance Vault revolutionizes digital estate planning by allowing you to express 
              your inheritance wishes in natural language. Our advanced AI understands your intentions, creating 
              a legally sound and technically precise inheritance plan while maintaining the human element of your legacy.
            </p>
            
            <div className="grid gap-6 mt-8 md:grid-cols-2">
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <Brain className="size-10 text-indigo-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Intent Recognition</h3>
                <p className="text-muted-foreground">
                  Express your wishes in everyday language, and our AI interprets your intentions accurately, 
                  converting them into precise blockchain-enforced instructions.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <Users className="size-10 text-indigo-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Personalized Beneficiary System</h3>
                <p className="text-muted-foreground">
                  Describe relationships and inheritance conditions naturally, allowing for nuanced distribution 
                  based on family dynamics and personal considerations.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <FileText className="size-10 text-indigo-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Legal Language Translation</h3>
                <p className="text-muted-foreground">
                  Our AI translates your natural language instructions into legally-vetted terms while preserving 
                  your original intent and ensuring compliance with regulations.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <Fingerprint className="size-10 text-indigo-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Personal Legacy Preservation</h3>
                <p className="text-muted-foreground">
                  Include personal messages, values, and guidance alongside your asset distributions, 
                  ensuring your digital legacy reflects your personality.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="features" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Comprehensive Features</h2>
            <p className="text-lg text-muted-foreground">
              Our AI Intent Inheritance Vault offers a suite of advanced features designed to make digital estate 
              planning more intuitive, comprehensive, and aligned with your true intentions and values, while 
              maintaining the technical robustness required for blockchain-based inheritance.
            </p>
            
            <div className="space-y-4 mt-6">
              <div className="border rounded-lg p-6 bg-card shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Brain className="mr-3 text-indigo-500" />
                  Advanced Natural Language Processing
                </h3>
                <p className="text-muted-foreground mb-4">
                  Our AI understands complex inheritance instructions:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2 text-indigo-500">•</span> 
                    Interprets nuanced instructions like "I want my daughter to receive most of my Bitcoin, but only after she turns 25"
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-indigo-500">•</span> 
                    Identifies conditional statements and temporal requirements
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-indigo-500">•</span> 
                    Understands relationship contexts and family structures
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-indigo-500">•</span> 
                    Prompts for clarification on ambiguous instructions
                  </li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-6 bg-card shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Users className="mr-3 text-indigo-500" />
                  Relationship-Based Beneficiary Management
                </h3>
                <p className="text-muted-foreground mb-4">
                  Define beneficiaries through relationships rather than addresses:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2 text-indigo-500">•</span> 
                    Reference people by name and relationship (e.g., "my sister Sarah")
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-indigo-500">•</span> 
                    Automatic resolution of relationships to verified identities
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-indigo-500">•</span> 
                    Fallback verification methods if primary identity matching fails
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-indigo-500">•</span> 
                    Support for organizations and charitable entities as beneficiaries
                  </li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-6 bg-card shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <FileText className="mr-3 text-indigo-500" />
                  Legal Compliance Translation
                </h3>
                <p className="text-muted-foreground mb-4">
                  Ensuring your wishes have legal standing:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2 text-indigo-500">•</span> 
                    Automatic translation of intent into legally-sound instructions
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-indigo-500">•</span> 
                    Jurisdiction-aware interpretation based on your location
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-indigo-500">•</span> 
                    Identification of potential legal conflicts in your instructions
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-indigo-500">•</span> 
                    Generation of human-readable legal documents alongside smart contracts
                  </li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-6 bg-card shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Fingerprint className="mr-3 text-indigo-500" />
                  Value-Based Legacy Preservation
                </h3>
                <p className="text-muted-foreground mb-4">
                  Ensure your digital legacy reflects your values:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2 text-indigo-500">•</span> 
                    Attach personal messages, letters, and guidance for beneficiaries
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-indigo-500">•</span> 
                    Specify how assets should be used based on your values
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-indigo-500">•</span> 
                    Include ethical guidelines for financial decisions
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-indigo-500">•</span> 
                    Preserve personal stories and wisdom alongside financial assets
                  </li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-6 bg-card shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Bot className="mr-3 text-indigo-500" />
                  AI-Mediated Contingencies
                </h3>
                <p className="text-muted-foreground mb-4">
                  Handle unexpected future scenarios:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2 text-indigo-500">•</span> 
                    AI interpretation of your intent in unforeseen circumstances
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-indigo-500">•</span> 
                    Logical extension of your wishes to new situations
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-indigo-500">•</span> 
                    Trusted executor guidelines for AI-assisted decision making
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-indigo-500">•</span> 
                    Value alignment verification for automated decisions
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Intent-Preserving Security</h2>
            <p className="text-lg text-muted-foreground">
              The AI Intent Inheritance Vault implements specialized security measures designed to protect 
              not only your assets but also the integrity of your intentions, ensuring that your wishes are 
              preserved and executed exactly as you meant them to be.
            </p>
            
            <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 rounded-xl p-6 my-6">
              <h3 className="text-xl font-bold text-indigo-800 dark:text-indigo-300 mb-3">Triple-Chain Security™ Protection</h3>
              <p className="text-indigo-700 dark:text-indigo-400">
                All inheritance plans are secured using our revolutionary Triple-Chain Security™ protocol, 
                with an additional layer of AI-powered intent verification that continuously validates that 
                execution aligns with your original wishes.
              </p>
            </div>
            
            <div className="grid gap-6 mt-6 md:grid-cols-2">
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <h3 className="text-xl font-bold mb-3">Intent Immutability</h3>
                <p className="text-muted-foreground">
                  Your original intentions are cryptographically sealed and time-stamped on the blockchain, 
                  with both the natural language expression and its technical interpretation preserved to 
                  serve as the source of truth.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <h3 className="text-xl font-bold mb-3">Multi-Factor Identity Verification</h3>
                <p className="text-muted-foreground">
                  Beneficiaries are verified through multiple identity factors, including biometrics, 
                  knowledge-based verification, and relationship confirmation by other verified parties 
                  in your trust network.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <h3 className="text-xl font-bold mb-3">Adversarial Testing</h3>
                <p className="text-muted-foreground">
                  Your inheritance plan undergoes adversarial AI testing to identify potential 
                  misinterpretations or loopholes, ensuring that only your intended beneficiaries 
                  can access the assets under the exact conditions you specified.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <h3 className="text-xl font-bold mb-3">Human-in-the-Loop Verification</h3>
                <p className="text-muted-foreground">
                  For high-value inheritances or complex conditions, the system includes optional 
                  verification by human legal experts who confirm that the AI's interpretation 
                  accurately reflects your intentions.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="technical" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Technical Specifications</h2>
            <p className="text-lg text-muted-foreground">
              The AI Intent Inheritance Vault utilizes cutting-edge natural language processing, semantic 
              understanding, and blockchain technologies to transform human intentions into technically 
              precise and legally enforceable inheritance plans.
            </p>
            
            <div className="mt-8 space-y-6">
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Natural Language Processing Stack</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">AI Model:</h4>
                    <p className="text-muted-foreground">Custom fine-tuned GPT-4 model with legal and financial domain specialization</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Semantic Understanding:</h4>
                    <p className="text-muted-foreground">Advanced entailment verification and contradiction detection</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Language Coverage:</h4>
                    <p className="text-muted-foreground">Support for 12 major languages with legal terminology expertise</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Context Window:</h4>
                    <p className="text-muted-foreground">100,000 token processing capability for comprehensive estate plans</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Intent-to-Code Translation</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Smart Contract Generation:</h4>
                    <p className="text-muted-foreground">Automated translation of intent to Solidity, TON, and Solana smart contracts</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Legal Verification:</h4>
                    <p className="text-muted-foreground">LegalLLM validation against jurisdiction-specific regulations</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Condition Formalization:</h4>
                    <p className="text-muted-foreground">Temporal Logic expressions for time-based and event-based conditions</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Verification Model:</h4>
                    <p className="text-muted-foreground">Formal verification using the Coq proof assistant for condition logic</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Identity Resolution System</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Beneficiary Matching:</h4>
                    <p className="text-muted-foreground">Zero-knowledge identity verification through trusted verifiers</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Relationship Graph:</h4>
                    <p className="text-muted-foreground">Graph database of relationships with privacy-preserving verification</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Identity Update Mechanism:</h4>
                    <p className="text-muted-foreground">Continuous identity verification with revocation capabilities</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Fallback Protocol:</h4>
                    <p className="text-muted-foreground">Multi-stage identity verification with legal executor fallback</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Blockchain Implementation</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Trinity Protocol: 2-of-3 Chain Security:</h4>
                    <p className="text-muted-foreground">
                      Fixed-role architecture: Ethereum Layer (Primary Security via Layer 2 for 95% lower fees), Solana Layer (Rapid Validation), 
                      and TON Layer (Recovery System) provide 2-of-3 consensus security with each blockchain fulfilling its specialized role.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Intent Storage:</h4>
                    <p className="text-muted-foreground">IPFS with content addressing and integrity verification</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Cross-Chain Verification:</h4>
                    <p className="text-muted-foreground">Intent validation across Ethereum, Solana, and TON with 2/3 threshold</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Oracle Integration:</h4>
                    <p className="text-muted-foreground">Chainlink-powered verification of real-world conditions and events</p>
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
              Common questions about our AI Intent Inheritance Vault and how natural language processing enhances digital estate planning.
            </p>
            
            <div className="mt-8 space-y-6">
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-400 mb-2">How accurate is the AI in interpreting my inheritance wishes?</h3>
                <p className="text-muted-foreground">
                  Our AI has been specifically trained on hundreds of thousands of estate planning documents and legal inheritance cases, achieving over 98.5% accuracy in correctly interpreting intentions in independent testing. The system includes multiple verification steps to ensure accuracy:
                  <br /><br />
                  1. It provides a plain language summary of its interpretation for you to review
                  <br />
                  2. It highlights any ambiguous instructions and asks for clarification
                  <br />
                  3. It demonstrates how different scenarios would play out under your instructions
                  <br /><br />
                  For complex estates or unusual conditions, we also offer optional human legal expert review to ensure perfect alignment with your intentions.
                </p>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-400 mb-2">What happens if laws change after I create my inheritance plan?</h3>
                <p className="text-muted-foreground">
                  The AI Intent Inheritance Vault includes a legal adaptation mechanism that monitors relevant legal changes in the jurisdictions applicable to your estate. When significant legal changes occur, the system analyzes how they might impact your plan's execution.
                  <br /><br />
                  If a change could affect your plan's enforceability, you'll receive a notification with a plain-language explanation and suggested amendments that would preserve your original intentions while complying with the new legal framework. You can then approve these amendments or modify them according to your preferences.
                  <br /><br />
                  This adaptive approach ensures your inheritance plan remains legally sound without requiring you to constantly monitor changing regulations.
                </p>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-400 mb-2">How does the system verify that beneficiaries are actually the people I intended?</h3>
                <p className="text-muted-foreground">
                  Our beneficiary verification system uses a multi-layered approach:
                  <br /><br />
                  1. Relationship Verification: When you describe beneficiaries by relationship (e.g., "my daughter Emma"), the system creates a relationship graph that can be verified through multiple methods.
                  <br /><br />
                  2. Identity Authentication: Beneficiaries must complete a robust verification process that can include:
                  <br />
                  • Government ID verification
                  <br />
                  • Biometric matching
                  <br />
                  • Knowledge-based authentication using information only the intended person would know
                  <br />
                  • Social verification by other trusted parties in your relationship network
                  <br /><br />
                  3. Executor Oversight: For added security, you can designate trusted executors who must approve beneficiary verifications for high-value distributions.
                  <br /><br />
                  This comprehensive approach prevents impersonation while making the verification process straightforward for legitimate beneficiaries.
                </p>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-400 mb-2">Can I include ethical guidelines or values-based instructions in my inheritance plan?</h3>
                <p className="text-muted-foreground">
                  Yes, value-based instructions are a core feature of the AI Intent Inheritance Vault. You can include ethical guidelines, personal values, and intended purposes for assets that go beyond simple distribution instructions.
                  <br /><br />
                  For example, you might specify that funds should be used for education, sustainable investments, or charitable giving aligned with specific values. While these ethical guidelines cannot be technically enforced in the same way as distribution rules, they are preserved alongside the legal instructions and can be:
                  <br /><br />
                  1. Presented to beneficiaries as your expressed wishes
                  <br />
                  2. Used by designated ethical guardians who you can appoint to provide guidance
                  <br />
                  3. Implemented through optional incentive structures (e.g., matching funds for charitable donations)
                  <br /><br />
                  This allows you to pass on not just your assets, but also the wisdom and values that guided your own financial decisions.
                </p>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-400 mb-2">What if a situation arises that I didn't anticipate in my instructions?</h3>
                <p className="text-muted-foreground">
                  The AI Intent Inheritance Vault includes an innovative approach to handling unforeseen circumstances:
                  <br /><br />
                  1. Intent Analysis: The system analyzes your overall pattern of intentions across all specified scenarios to understand your general principles and priorities.
                  <br /><br />
                  2. Logical Extension: When an unanticipated situation arises, the AI applies these principles to determine what you would likely have wanted.
                  <br /><br />
                  3. Human Oversight: For significant unforeseen circumstances, the system can refer decisions to your designated executors, providing them with an analysis of how your stated intentions might apply to the new situation.
                  <br /><br />
                  This combination of AI analysis and human judgment ensures that even unforeseen circumstances can be handled in a way that respects your overall intentions and values, rather than relying on rigid rules that might not address novel situations appropriately.
                </p>
              </div>
              
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-400 mb-2">How does this differ from traditional estate planning?</h3>
                <p className="text-muted-foreground">
                  The AI Intent Inheritance Vault differs from traditional estate planning in several key ways:
                  <br /><br />
                  1. Natural Expression: Instead of using legal jargon or technical terminology, you express your wishes in everyday language.
                  <br /><br />
                  2. Digital Asset Focus: The system is specifically designed for cryptocurrency, NFTs, and other digital assets that traditional wills often struggle to address properly.
                  <br /><br />
                  3. Adaptive Implementation: Rather than being a static document, your plan can adapt to changing circumstances while maintaining your core intentions.
                  <br /><br />
                  4. Global Compatibility: The system works across international boundaries, handling multi-jurisdictional considerations automatically.
                  <br /><br />
                  5. Immediate Partial Execution: Allows for time-locked releases, conditional distributions, and other automated executions without requiring probate or lengthy legal processes.
                  <br /><br />
                  While we recommend maintaining traditional legal documents for non-digital assets, the AI Intent Inheritance Vault provides superior protection and flexibility for your blockchain-based holdings.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DocumentationLayout>
  );
}