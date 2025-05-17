import React from 'react';
import { Container } from '@/components/ui/container';
import { PageHeader } from '@/components/page-header';
import { Helmet } from 'react-helmet';
import { Card, CardContent } from '@/components/ui/card';
import { Github, Linkedin, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export default function TeamPage() {
  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "Alexandra Chen",
      role: "Founder & CEO",
      bio: "Alexandra brings over a decade of experience in blockchain security and financial technology. Previously led security teams at major cryptocurrency exchanges and contributed to several open-source blockchain projects.",
      imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      socialLinks: {
        twitter: "https://twitter.com",
        linkedin: "https://linkedin.com",
        github: "https://github.com"
      }
    },
    {
      id: 2,
      name: "Marcus Johnson",
      role: "CTO",
      bio: "Marcus has extensive experience developing secure smart contracts and was an early contributor to Ethereum and TON. His expertise spans multiple blockchain architectures and cryptographic security models.",
      imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      socialLinks: {
        twitter: "https://twitter.com",
        linkedin: "https://linkedin.com",
        github: "https://github.com"
      }
    },
    {
      id: 3,
      name: "Sophia Rodríguez",
      role: "Head of Security",
      bio: "Sophia is a renowned security researcher with a focus on zero-knowledge proofs and multi-chain verification systems. Previously worked at leading cryptocurrency security firms and has discovered critical vulnerabilities in major protocols.",
      imageUrl: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      socialLinks: {
        twitter: "https://twitter.com",
        linkedin: "https://linkedin.com",
        github: "https://github.com"
      }
    },
    {
      id: 4,
      name: "David Kim",
      role: "Lead Blockchain Engineer",
      bio: "David specializes in cross-chain protocols and has built several production DeFi systems. His expertise includes Solana, Ethereum, and TON blockchain technologies with a focus on high-performance systems.",
      imageUrl: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      socialLinks: {
        twitter: "https://twitter.com",
        linkedin: "https://linkedin.com",
        github: "https://github.com"
      }
    },
    {
      id: 5,
      name: "Elena Novak",
      role: "Product Director",
      bio: "Elena has led product development at several successful fintech startups. Her background in both traditional finance and blockchain technology helps bridge the gap between complex security features and user-friendly experiences.",
      imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      socialLinks: {
        twitter: "https://twitter.com",
        linkedin: "https://linkedin.com"
      }
    },
    {
      id: 6,
      name: "James Wilson",
      role: "UX Design Lead",
      bio: "James focuses on creating intuitive interfaces for complex blockchain applications. His design philosophy centers around making advanced security features accessible to both crypto novices and experts alike.",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      socialLinks: {
        twitter: "https://twitter.com",
        linkedin: "https://linkedin.com"
      }
    },
    {
      id: 7,
      name: "Aisha Patel",
      role: "Head of Partnerships",
      bio: "Aisha leads our strategic partnerships across the blockchain ecosystem. With experience at major cryptocurrency exchanges and DeFi protocols, she focuses on creating meaningful integrations that enhance the Chronos Vault ecosystem.",
      imageUrl: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      socialLinks: {
        twitter: "https://twitter.com",
        linkedin: "https://linkedin.com"
      }
    },
    {
      id: 8,
      name: "Michael Zhang",
      role: "Quantum Security Researcher",
      bio: "Michael specializes in post-quantum cryptography and leads our research into quantum-resistant security measures. His work ensures that Chronos Vault remains secure even against future quantum computing threats.",
      imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      socialLinks: {
        twitter: "https://twitter.com",
        linkedin: "https://linkedin.com",
        github: "https://github.com"
      }
    }
  ];

  return (
    <>
      <Helmet>
        <title>Our Team | Chronos Vault</title>
        <meta 
          name="description" 
          content="Meet the team behind Chronos Vault - blockchain security experts, engineers, and visionaries building the future of digital asset protection." 
        />
      </Helmet>
      
      <Container className="py-12 md:py-16">
        <PageHeader 
          heading="Our Team" 
          description="Meet the experts building the future of secure blockchain vaults" 
          separator
        />
        
        <div className="max-w-3xl mx-auto mb-16">
          <div className="bg-card rounded-lg p-6 border border-border">
            <h2 className="text-2xl font-bold mb-4 text-center md:text-left">Our Mission</h2>
            <p className="text-muted-foreground mb-4">
              At Chronos Vault, we've brought together a diverse team of blockchain experts, security researchers, 
              and product innovators united by a common vision: to create the most secure, user-friendly 
              time-locked vaults in the cryptocurrency ecosystem.
            </p>
            <p className="text-muted-foreground">
              Our team members come from backgrounds in cryptography, distributed systems, financial 
              technology, and user experience design. This interdisciplinary approach allows us to build 
              solutions that are not only technically robust but also intuitive for users of all experience levels.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <Card key={member.id} className="overflow-hidden bg-card transition-all hover:shadow-md">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={member.imageUrl} 
                  alt={member.name} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <CardContent className="p-5">
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-sm text-purple-500 dark:text-purple-400 font-medium mb-3">{member.role}</p>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-4">{member.bio}</p>
                
                <div className="flex space-x-2 mt-auto">
                  {member.socialLinks.twitter && (
                    <Button variant="outline" size="icon" asChild className="h-8 w-8 rounded-full">
                      <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                        <Twitter className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {member.socialLinks.linkedin && (
                    <Button variant="outline" size="icon" asChild className="h-8 w-8 rounded-full">
                      <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {member.socialLinks.github && (
                    <Button variant="outline" size="icon" asChild className="h-8 w-8 rounded-full">
                      <a href={member.socialLinks.github} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Join Our Team</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            We're always looking for talented individuals passionate about blockchain security and innovation.
            If you're interested in joining our mission to secure the future of digital assets, check out our open positions.
          </p>
          <Button size="lg" className="mt-2">
            View Open Positions
          </Button>
        </div>
      </Container>
    </>
  );
}