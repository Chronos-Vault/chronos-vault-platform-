import React from 'react';
import { Container } from '@/components/ui/container';
import { PageHeader } from '@/components/page-header';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Code, Database, Workflow, Lightbulb, Braces, Server, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TeamDepartment {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  expertise: string[];
}

export default function TeamPage() {
  const departments: TeamDepartment[] = [
    {
      id: 'security',
      name: 'Security & Cryptography',
      description: 'Our security experts design and implement the robust cryptographic infrastructure that powers Chronos Vault. The team focuses on zero-knowledge proofs, multi-chain verification systems, and quantum-resistant cryptography.',
      icon: <Shield className="h-8 w-8" />,
      color: 'bg-purple-100 text-purple-900 dark:bg-purple-900/20 dark:text-purple-300',
      expertise: [
        'Zero-Knowledge Proof Systems',
        'Post-Quantum Cryptography',
        'Secure Multi-Party Computation',
        'Cryptographic Verification Protocols',
        'Hardware Security Integration',
        'Security Audit & Vulnerability Assessment'
      ]
    },
    {
      id: 'blockchain',
      name: 'Blockchain Engineering',
      description: 'Responsible for secure smart contract development and cross-chain protocols. This team has deep expertise in multiple blockchain architectures including Ethereum, TON, Solana, and Bitcoin.',
      icon: <Code className="h-8 w-8" />,
      color: 'bg-blue-100 text-blue-900 dark:bg-blue-900/20 dark:text-blue-300',
      expertise: [
        'Smart Contract Development',
        'Cross-Chain Protocol Design',
        'Blockchain Interoperability',
        'Layer 2 Scaling Solutions',
        'Transaction Verification Systems',
        'Triple-Chain Security Architecture'
      ]
    },
    {
      id: 'distributed',
      name: 'Distributed Systems',
      description: 'Builds the fault-tolerant infrastructure that enables Chronos Vault to maintain high availability and consistent performance across global networks even under challenging conditions.',
      icon: <Server className="h-8 w-8" />,
      color: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-300',
      expertise: [
        'Consensus Algorithms',
        'Distributed Database Systems',
        'Global State Synchronization',
        'Peer-to-Peer Networks',
        'High-Availability Architecture',
        'System Scalability & Performance'
      ]
    },
    {
      id: 'product',
      name: 'Product & Design',
      description: 'Transforms complex blockchain security concepts into intuitive user experiences. This team bridges the gap between advanced cryptographic features and user-friendly interfaces.',
      icon: <Lightbulb className="h-8 w-8" />,
      color: 'bg-amber-100 text-amber-900 dark:bg-amber-900/20 dark:text-amber-300',
      expertise: [
        'Vault UX Research & Design',
        'Blockchain UX Patterns',
        'Security Visualization',
        'Cross-Platform Experience',
        'Accessibility & Internationalization',
        'Gamification of Security Concepts'
      ]
    },
    {
      id: 'research',
      name: 'Research & Innovation',
      description: 'Our R&D department works on next-generation vault technologies including quantum-resistant algorithms, biometric security, and advanced time-lock mechanisms.',
      icon: <Braces className="h-8 w-8" />,
      color: 'bg-red-100 text-red-900 dark:bg-red-900/20 dark:text-red-300',
      expertise: [
        'Temporal Key Derivation',
        'Geographic Authentication Systems',
        'Behavioral Biometrics',
        'Quantum Communication Protocols',
        'Decentralized Identity Management',
        'Blockchain Academic Research'
      ]
    },
    {
      id: 'infrastructure',
      name: 'Technical Infrastructure',
      description: 'Maintains the secure cloud and edge infrastructure that supports our vault platform, ensuring reliability, scalability and optimal performance.',
      icon: <Database className="h-8 w-8" />,
      color: 'bg-cyan-100 text-cyan-900 dark:bg-cyan-900/20 dark:text-cyan-300',
      expertise: [
        'Secure Cloud Infrastructure',
        'DevSecOps Practices',
        'Hardware Security Modules',
        'Vault Monitoring Systems',
        'Distributed Backup Protocols',
        'Node Management & Synchronization'
      ]
    },
    {
      id: 'protocol',
      name: 'Protocol Governance',
      description: 'Responsible for the CVT token ecosystem, protocol governance mechanisms, and coordination with our community of vault users and developers.',
      icon: <Workflow className="h-8 w-8" />,
      color: 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/20 dark:text-indigo-300',
      expertise: [
        'Token Economics',
        'On-Chain Governance Systems',
        'DAO Coordination & Structure',
        'Protocol Upgrade Mechanisms',
        'Community-Led Development',
        'Tokenomics & Incentive Design'
      ]
    },
    {
      id: 'compliance',
      name: 'Security & Compliance',
      description: 'Ensures our platform meets global security standards while adhering to evolving regulatory frameworks across multiple jurisdictions.',
      icon: <Lock className="h-8 w-8" />,
      color: 'bg-gray-100 text-gray-900 dark:bg-gray-700/40 dark:text-gray-300',
      expertise: [
        'Regulatory Compliance',
        'Security Certification',
        'Risk Assessment',
        'Security Incident Response',
        'Vault Privacy Standards',
        'Third-Party Security Audits'
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Core Teams | Chronos Vault</title>
        <meta 
          name="description" 
          content="Meet the specialized teams behind Chronos Vault - experts in blockchain security, cryptography, and distributed systems building the future of digital asset protection." 
        />
      </Helmet>
      
      <Container className="py-12 md:py-16">
        <PageHeader 
          heading="Core Teams" 
          description="Our specialized departments working together to build the most secure blockchain vaults" 
          separator
        />
        
        <div className="max-w-3xl mx-auto mb-16">
          <div className="bg-gradient-to-br from-purple-50/90 to-indigo-50/90 dark:from-purple-950/20 dark:to-indigo-950/20 rounded-lg p-6 border border-purple-100 dark:border-purple-900/30 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-4 text-center md:text-left bg-gradient-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-indigo-300">Our Collective Mission</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              At Chronos Vault, we've assembled specialized teams of blockchain experts from around the world,
              working together on a common vision: creating the most secure and accessible time-locked
              vaults in the decentralized ecosystem.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Our collective expertise spans cryptography, distributed systems, security research, and
              user experience design. This interdisciplinary approach enables us to build solutions that
              maintain the highest security standards while remaining intuitive for users of all experience levels.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {departments.map((dept) => (
            <Card key={dept.id} className="overflow-hidden bg-card border transition-all hover:shadow-md">
              <CardHeader className={`${dept.color} border-b border-border`}>
                <div className="flex items-center gap-3">
                  {dept.icon}
                  <CardTitle>{dept.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-5">
                <p className="text-muted-foreground mb-6">{dept.description}</p>
                
                <h4 className="font-semibold text-sm mb-3">Core Expertise:</h4>
                <div className="flex flex-wrap gap-2">
                  {dept.expertise.map((skill, i) => (
                    <Badge 
                      key={i} 
                      variant="outline" 
                      className="bg-background/50"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t">
                <div className="w-full flex justify-end">
                  <Button variant="ghost" size="sm" className="text-xs">
                    Learn more
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-br from-purple-50/90 to-indigo-50/90 dark:from-purple-950/20 dark:to-indigo-950/20 rounded-lg p-8 border border-purple-100 dark:border-purple-900/30 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-indigo-300">Join Our Collective</h2>
            <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-6">
              We're continuously looking for talented individuals passionate about blockchain security,
              cryptography, and creating exceptional user experiences in the decentralized space.
            </p>
            <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
              Explore Open Positions
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
}