import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import DocumentationLayout from '@/components/layout/DocumentationLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  BookOpen, 
  FileText, 
  Shield, 
  Code, 
  Timer, 
  Zap,
  ArrowRight,
  Server,
  Key,
  Lock
} from 'lucide-react';

interface Documentation {
  title: string;
  description: string;
  icon: React.ReactNode;
  sections: {
    title: string;
    content: string;
  }[];
}

// Documentation content mapped by route
const documentationContent: Record<string, Documentation> = {
  "/docs": {
    title: "Documentation",
    description: "Complete documentation for Chronos Vault platform",
    icon: <BookOpen className="w-8 h-8 text-[#FF5AF7]" />,
    sections: [
      {
        title: "Introduction",
        content: "Chronos Vault is a revolutionary multi-chain digital vault platform that provides secure storage and time-locked functionality for digital assets. Our platform leverages advanced blockchain technologies across Ethereum, TON, Solana, and Bitcoin to offer unparalleled security and flexibility."
      },
      {
        title: "Getting Started",
        content: "To get started with Chronos Vault, create an account and connect your preferred wallet. You can then create your first vault by selecting from our range of specialized vault types, each designed for different security needs and use cases."
      },
      {
        title: "Key Features",
        content: "• Multi-Chain Support: Store assets across multiple blockchains\n• Time-Locked Vaults: Schedule asset releases for future dates\n• Zero-Knowledge Security: Enhanced privacy protection\n• Multi-Signature Authorization: Require multiple approvals for vault access\n• Quantum-Resistant Encryption: Future-proof your digital assets"
      }
    ]
  },
  "/roadmap": {
    title: "Roadmap",
    description: "Future developments and planned features",
    icon: <Timer className="w-8 h-8 text-[#FF5AF7]" />,
    sections: [
      {
        title: "Q3 2025",
        content: "• CVT Token Launch on Major Exchanges\n• Cross-Chain Bridge Enhancement\n• Dynamic Fee Optimization System"
      },
      {
        title: "Q4 2025",
        content: "• Mobile App Release (iOS & Android)\n• AI-Powered Vault Analytics\n• Advanced Security Protocol Implementation"
      },
      {
        title: "Q1 2026",
        content: "• Institutional Vault Solutions\n• Layer 2 Scaling Implementation\n• Enhanced Multi-Chain Compatibility"
      },
      {
        title: "Q2 2026",
        content: "• Governance Protocol Launch\n• Cross-Chain Staking Optimization\n• Enterprise API Access"
      }
    ]
  },
  "/smart-contracts": {
    title: "Smart Contracts",
    description: "Technical details about our deployed contracts",
    icon: <Code className="w-8 h-8 text-[#FF5AF7]" />,
    sections: [
      {
        title: "Ethereum Contracts",
        content: "Our Ethereum contracts are deployed on the Ethereum mainnet and various testnets. They handle the core vault functionality, time-locking mechanisms, and cross-chain validation. All contracts have undergone rigorous security audits by leading blockchain security firms."
      },
      {
        title: "TON Contracts",
        content: "The TON blockchain contracts handle high-speed transactions and provide an additional security layer through our proprietary cross-chain validation protocol. These contracts are optimized for minimal gas fees while maintaining maximum security."
      },
      {
        title: "Solana Program",
        content: "Our Solana program leverages the high throughput and low transaction costs of the Solana blockchain to provide efficient operations for frequent vault interactions and complex multi-signature schemes."
      },
      {
        title: "Bitcoin Integration",
        content: "Chronos Vault integrates with Bitcoin through specialized solutions that provide the security of Bitcoin while offering advanced vault functionality not natively available on the Bitcoin blockchain."
      }
    ]
  },
  "/technical-spec": {
    title: "Technical Specifications",
    description: "Detailed technical architecture and specifications",
    icon: <Server className="w-8 h-8 text-[#FF5AF7]" />,
    sections: [
      {
        title: "Architecture Overview",
        content: "Chronos Vault employs a multi-layered architecture with specialized components for security, cross-chain operations, and user interface. The system utilizes a microservices approach for maximum flexibility and resilience."
      },
      {
        title: "Security Infrastructure",
        content: "Our security infrastructure includes multiple layers of protection, including zero-knowledge proofs, quantum-resistant encryption, behavioral analysis, and multi-signature authorization. Each security layer operates independently to provide defense in depth."
      },
      {
        title: "Cross-Chain Protocol",
        content: "The proprietary Cross-Chain Protocol enables seamless asset transfer and validation across supported blockchains. This protocol maintains full transaction traceability while optimizing for gas efficiency and transaction speed."
      },
      {
        title: "Performance Specifications",
        content: "• Transaction Throughput: Up to 500 TPS\n• Average Confirmation Time: 2-15 seconds (chain-dependent)\n• Security Audit Frequency: Continuous with quarterly formal audits\n• System Uptime Target: 99.99%"
      }
    ]
  },
  "/security-tutorials": {
    title: "Security Tutorials",
    description: "Learn how to maximize your vault security",
    icon: <Shield className="w-8 h-8 text-[#FF5AF7]" />,
    sections: [
      {
        title: "Multi-Signature Setup",
        content: "Learn how to configure multi-signature authorization for your vaults to require approval from multiple trusted parties before assets can be accessed or transferred."
      },
      {
        title: "Key Management",
        content: "Proper key management is essential for vault security. This tutorial covers best practices for secure key storage, recovery procedures, and rotation policies."
      },
      {
        title: "Security Alert Configuration",
        content: "Configure custom security alerts to monitor your vaults for suspicious activity. Set up notifications for unusual access patterns, failed authentication attempts, or unexpected transfer requests."
      },
      {
        title: "Regular Security Audits",
        content: "Learn how to perform regular security audits of your vaults, including checking access logs, reviewing authorization settings, and verifying transaction history."
      }
    ]
  },
  "/technical-security-docs": {
    title: "Technical Security Documentation",
    description: "In-depth technical security information",
    icon: <Lock className="w-8 h-8 text-[#FF5AF7]" />,
    sections: [
      {
        title: "Zero-Knowledge Authentication",
        content: "Our zero-knowledge authentication system allows users to prove ownership of assets without revealing sensitive information. This documentation explains the cryptographic principles and implementation details."
      },
      {
        title: "Quantum-Resistant Algorithms",
        content: "Chronos Vault implements post-quantum cryptographic algorithms to protect against threats from future quantum computers. This section covers the specific algorithms used and their security parameters."
      },
      {
        title: "Cross-Chain Security Model",
        content: "The cross-chain security model ensures consistent security policies across all supported blockchains. This documentation explains how validation occurs across chains and how cross-chain attacks are prevented."
      },
      {
        title: "Security Incident Response",
        content: "Our security incident response protocol ensures rapid detection and mitigation of potential security threats. This section covers detection mechanisms, response procedures, and recovery processes."
      }
    ]
  },
  "/security-video-guides": {
    title: "Security Video Guides",
    description: "Video tutorials for secure vault management",
    icon: <FileText className="w-8 h-8 text-[#FF5AF7]" />,
    sections: [
      {
        title: "Video Guides Coming Soon",
        content: "We're currently producing comprehensive video tutorials covering all aspects of vault security and management. Check back soon for detailed video guides!"
      },
      {
        title: "Topics to be Covered",
        content: "• Creating and configuring secure vaults\n• Setting up multi-signature authorization\n• Implementing time-locked asset releases\n• Configuring geolocation restrictions\n• Managing cross-chain assets securely"
      }
    ]
  },
  "/military-grade-security": {
    title: "Military-Grade Security",
    description: "Understanding our highest security standards",
    icon: <Key className="w-8 h-8 text-[#FF5AF7]" />,
    sections: [
      {
        title: "What is Military-Grade Security?",
        content: "Military-grade security refers to the implementation of security standards similar to those used by military organizations. In Chronos Vault, this includes AES-256 encryption, multi-factor authentication, behavioral analysis, and quantum-resistant algorithms."
      },
      {
        title: "Key Security Features",
        content: "• AES-256 Encryption: Industry-leading symmetric encryption\n• Multi-Layer Authentication: Multiple verification factors required\n• Continuous Security Monitoring: 24/7 automated threat detection\n• Tamper-Evident Logs: Cryptographically secured audit trails\n• Zero-Knowledge Architecture: Minimal data exposure"
      },
      {
        title: "Implementation in Chronos Vault",
        content: "All vault types implement military-grade security to varying degrees, with our premium vaults utilizing the full spectrum of security features. This ensures that even our basic vaults provide exceptional security while our premium offerings deliver the highest possible protection."
      },
      {
        title: "Regular Security Assessments",
        content: "Our security infrastructure undergoes regular assessment by leading cybersecurity firms. This includes penetration testing, code audits, and compliance verification to ensure we maintain the highest security standards."
      }
    ]
  }
};

// Page that handles various documentation routes
const DocumentationPage: React.FC = () => {
  const [location] = useLocation();
  const [doc, setDoc] = useState<Documentation | null>(null);
  
  useEffect(() => {
    // Get documentation content based on current route
    const content = documentationContent[location];
    if (content) {
      setDoc(content);
    } else {
      // Default to main docs if route not found
      setDoc(documentationContent['/docs']);
    }
  }, [location]);
  
  if (!doc || !doc.icon) {
    return <div>Loading...</div>;
  }
  
  return (
    <DocumentationLayout
      title={doc.title}
      description={doc.description}
      icon={doc.icon ? String(doc.icon) : undefined}
    >
      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="overview" className="w-full mb-8">
          <TabsList className="grid grid-cols-3 w-full mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="related">Related</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-8">
            {doc.sections.map((section, index) => (
              <div key={index} className="bg-black/30 border border-purple-900/20 rounded-lg p-6 hover:border-purple-900/40 transition-all duration-300">
                <h2 className="text-2xl font-bold text-[#FF5AF7] mb-3">{section.title}</h2>
                <div className="text-gray-300 whitespace-pre-line">
                  {section.content}
                </div>
              </div>
            ))}
            
            <div className="flex justify-center mt-8">
              <Button asChild className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#FF5AF7] hover:to-[#6B00D7]">
                <Link href="/my-vaults">
                  Create Your Vault <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="details">
            <div className="bg-black/30 border border-purple-900/20 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-[#FF5AF7] mb-4">Additional Information</h2>
              <p className="text-gray-300 mb-4">
                For more detailed information about {doc.title.toLowerCase()}, please visit our comprehensive
                knowledge base or contact our support team.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <Button variant="outline" className="border-purple-900/50 hover:bg-purple-900/20">
                  <Link href="/vault-school-hub">Visit Vault School Hub</Link>
                </Button>
                <Button variant="outline" className="border-purple-900/50 hover:bg-purple-900/20">
                  <Link href="/support">Contact Support</Link>
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="related">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black/30 border border-purple-900/20 rounded-lg p-6 hover:border-purple-900/40 transition-all duration-300">
                <h3 className="text-xl font-bold text-[#FF5AF7] mb-3">Security Documentation</h3>
                <p className="text-gray-300 mb-4">
                  Learn about our advanced security features and protocols.
                </p>
                <Button variant="link" asChild className="text-[#FF5AF7] p-0">
                  <Link href="/technical-security-docs">
                    View Security Docs <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              <div className="bg-black/30 border border-purple-900/20 rounded-lg p-6 hover:border-purple-900/40 transition-all duration-300">
                <h3 className="text-xl font-bold text-[#FF5AF7] mb-3">Vault Types</h3>
                <p className="text-gray-300 mb-4">
                  Explore our various vault types and their specialized features.
                </p>
                <Button variant="link" asChild className="text-[#FF5AF7] p-0">
                  <Link href="/vault-types">
                    View Vault Types <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              <div className="bg-black/30 border border-purple-900/20 rounded-lg p-6 hover:border-purple-900/40 transition-all duration-300">
                <h3 className="text-xl font-bold text-[#FF5AF7] mb-3">Tokenomics</h3>
                <p className="text-gray-300 mb-4">
                  Understand the CVT token economics and utility.
                </p>
                <Button variant="link" asChild className="text-[#FF5AF7] p-0">
                  <Link href="/tokenomics">
                    View Tokenomics <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              <div className="bg-black/30 border border-purple-900/20 rounded-lg p-6 hover:border-purple-900/40 transition-all duration-300">
                <h3 className="text-xl font-bold text-[#FF5AF7] mb-3">Developer Resources</h3>
                <p className="text-gray-300 mb-4">
                  Access technical documentation and API references.
                </p>
                <Button variant="link" asChild className="text-[#FF5AF7] p-0">
                  <Link href="/smart-contracts">
                    View Developer Docs <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DocumentationLayout>
  );
};

export default DocumentationPage;