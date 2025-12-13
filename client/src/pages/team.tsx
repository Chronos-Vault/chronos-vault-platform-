import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, Code, Database, Workflow, Lightbulb, Braces, Server, Lock,
  Users, Globe, Award, Building2, ArrowRight, Mail, Briefcase,
  Rocket, Target, Heart, Zap, UserPlus, ExternalLink
} from 'lucide-react';
import { SiGithub, SiX } from 'react-icons/si';

interface OpenRole {
  id: string;
  title: string;
  tier: 'leadership' | 'core' | 'bounty';
  description: string;
  requirements: string[];
  compensation: string[];
  icon: JSX.Element;
  priority: 'high' | 'medium';
}

export default function TeamPage() {
  const openRoles: OpenRole[] = [
    {
      id: 'ceo',
      title: 'CEO / Co-Founder',
      tier: 'leadership',
      description: 'Lead the company vision, strategy, and growth. The founder is stepping into an Advisor role - this is a real leadership opportunity.',
      requirements: ['Strategic vision for blockchain security', 'Leadership experience', 'Understanding of DeFi ecosystem', 'Commitment to building long-term'],
      compensation: ['Significant equity ownership', 'Major CVT token allocation', 'Salary when funded', 'Real leadership title'],
      icon: <Target className="h-6 w-6" />,
      priority: 'high'
    },
    {
      id: 'cto',
      title: 'CTO / Technical Co-Founder',
      tier: 'leadership',
      description: 'Own the technical architecture across Arbitrum, Solana, and TON. Lead all engineering decisions for Trinity Protocol.',
      requirements: ['Deep blockchain development experience', 'Multi-chain architecture knowledge', 'Smart contract expertise', 'Team leadership skills'],
      compensation: ['Significant equity ownership', 'Major CVT token allocation', 'Salary when funded', 'Real leadership title'],
      icon: <Code className="h-6 w-6" />,
      priority: 'high'
    },
    {
      id: 'solidity-dev',
      title: 'Solidity / Smart Contract Developer',
      tier: 'core',
      description: 'Expand our Arbitrum contract suite. Work on ChronosVault, HTLC bridges, and security infrastructure.',
      requirements: ['Solidity expertise', 'Experience with upgradeable patterns (UUPS)', 'Gas optimization skills', 'Security auditing background (bonus)'],
      compensation: ['CVT allocation (2-year vesting)', 'Revenue share from features built', 'Path to equity for exceptional contributors'],
      icon: <Shield className="h-6 w-6" />,
      priority: 'high'
    },
    {
      id: 'rust-dev',
      title: 'Rust Developer (Solana)',
      tier: 'core',
      description: 'Extend our deployed Solana programs. Build cross-program invocations and SPL token integrations.',
      requirements: ['Rust proficiency', 'Anchor framework experience', 'Previous Solana deployments', 'Understanding of SPL tokens'],
      compensation: ['CVT allocation (2-year vesting)', 'Revenue share from features built', 'Path to equity for exceptional contributors'],
      icon: <Braces className="h-6 w-6" />,
      priority: 'high'
    },
    {
      id: 'fullstack-dev',
      title: 'Full-Stack Developer',
      tier: 'core',
      description: 'React/TypeScript frontend development. Build dashboard, monitoring tools, and real-time WebSocket systems.',
      requirements: ['React/TypeScript expertise', 'Web3 wallet integration', 'Real-time systems experience', 'Modern UI/UX sensibility'],
      compensation: ['CVT allocation (2-year vesting)', 'Revenue share from features built', 'Path to equity for exceptional contributors'],
      icon: <Database className="h-6 w-6" />,
      priority: 'medium'
    },
    {
      id: 'crypto-engineer',
      title: 'Cryptography Engineer',
      tier: 'core',
      description: 'ZK-SNARK circuit development and MPC protocol implementation. Work on the Mathematical Defense Layer.',
      requirements: ['ZK proof experience (Groth16)', 'MPC protocols knowledge', 'Post-quantum cryptography (bonus)', 'Strong mathematics background'],
      compensation: ['CVT allocation (2-year vesting)', 'Revenue share from features built', 'Path to equity for exceptional contributors'],
      icon: <Lock className="h-6 w-6" />,
      priority: 'medium'
    },
    {
      id: 'devops',
      title: 'DevOps / Infrastructure',
      tier: 'core',
      description: 'Multi-chain node management, monitoring, and cloud deployment. Maintain high availability across all networks.',
      requirements: ['Cloud infrastructure experience', 'Blockchain node operation', 'Monitoring and alerting systems', 'Security-first mindset'],
      compensation: ['CVT allocation (2-year vesting)', 'Revenue share from features built', 'Path to equity for exceptional contributors'],
      icon: <Server className="h-6 w-6" />,
      priority: 'medium'
    }
  ];

  const founderInfo = {
    role: 'Founder & Advisor',
    background: '3+ years building Trinity Protocol solo. Invested personal time and resources. Stepping into Advisor role to let new leaders take the helm.',
    vision: 'Build mathematically provable security for multi-chain assets. Prevent bridge hacks and single points of failure through 2-of-3 consensus.',
    commitment: "This isn't a whitepaper project. 23 contracts deployed across 3 blockchains. Working code, not promises."
  };

  const projectStats = [
    { value: '23', label: 'Deployed Contracts', icon: <Code className="h-5 w-5" /> },
    { value: '3', label: 'Blockchain Networks', icon: <Globe className="h-5 w-5" /> },
    { value: '3+', label: 'Years Development', icon: <Award className="h-5 w-5" /> },
    { value: 'Open', label: 'Leadership Roles', icon: <Users className="h-5 w-5" /> },
  ];

  const whyJoin = [
    {
      icon: <Rocket className="h-8 w-8" />,
      title: 'Be Early',
      description: 'The first engineers at Uniswap and Solana became legends. This is that moment for blockchain security.'
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: 'Real Ownership',
      description: 'Not just tokens - actual equity for co-founders. The CEO and CTO roles are genuinely open.'
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: 'Cutting-Edge Tech',
      description: 'Work on ZK-SNARKs, multi-chain consensus, post-quantum cryptography, and hardware security.'
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: 'Mission-Driven',
      description: 'Every bridge hack, every rug pull - we can prevent that with mathematics, not trust assumptions.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Join the Team | Chronos Vault - Trinity Protocol™</title>
        <meta name="description" content="Trinity Protocol is seeking co-founders and core contributors. Leadership roles (CEO, CTO) are open. 3+ years of development, 23 deployed contracts. Join us." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] via-[#121218] to-[#0a0a0f]">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#FF5AF7]/10 to-transparent blur-3xl" />

          <div className="container mx-auto px-4 py-16 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                We're Hiring Co-Founders
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-[#FF5AF7] bg-clip-text text-transparent">
                Join Trinity Protocol
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                This isn't "join my startup and work for me." This is "join me and we'll build this together, with you leading."
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
            >
              {projectStats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center"
                  data-testid={`project-stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className="flex justify-center mb-2 text-[#FF5AF7]">{stat.icon}</div>
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 pb-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-16"
          >
            <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border-purple-500/30">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center">
                    <Lightbulb className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white">The Founder's Message</CardTitle>
                    <p className="text-sm text-purple-300">{founderInfo.role}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p><strong className="text-white">Background:</strong> {founderInfo.background}</p>
                <p><strong className="text-white">Vision:</strong> {founderInfo.vision}</p>
                <p><strong className="text-white">Proof of Work:</strong> {founderInfo.commitment}</p>
                <div className="pt-4 border-t border-purple-500/20">
                  <p className="text-[#FF5AF7] font-medium">
                    "I'm not looking for employees. I'm looking for future leaders who want to own and run something meaningful."
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Why Join <span className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] bg-clip-text text-transparent">Now</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyJoin.map((reason, index) => (
                <Card key={index} className="bg-gray-900/50 border-gray-800 hover:border-purple-500/50 transition-colors">
                  <CardContent className="pt-6 text-center">
                    <div className="text-[#FF5AF7] mb-4 flex justify-center">{reason.icon}</div>
                    <h3 className="text-lg font-semibold text-white mb-2">{reason.title}</h3>
                    <p className="text-sm text-gray-400">{reason.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-2 text-center">
              Open <span className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] bg-clip-text text-transparent">Positions</span>
            </h2>
            <p className="text-gray-400 text-center mb-8 max-w-2xl mx-auto">
              Leadership roles come with equity and the chance to shape the company's direction. Core contributors get CVT tokens and revenue share.
            </p>

            <div className="space-y-6">
              {openRoles.filter(r => r.tier === 'leadership').length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-purple-400 mb-4 flex items-center gap-2">
                    <Target className="h-5 w-5" /> Leadership Positions (Equity + Tokens)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {openRoles.filter(r => r.tier === 'leadership').map((role) => (
                      <Card key={role.id} className="bg-gradient-to-br from-purple-900/20 to-pink-900/10 border-purple-500/30 hover:border-purple-400/50 transition-colors">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="text-[#FF5AF7]">{role.icon}</div>
                              <div>
                                <CardTitle className="text-white text-lg">{role.title}</CardTitle>
                                <Badge className="mt-1 bg-purple-600/30 text-purple-300 border-purple-500/50">
                                  {role.priority === 'high' ? 'High Priority' : 'Open'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-sm text-gray-300">{role.description}</p>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Requirements</p>
                            <ul className="text-sm text-gray-400 space-y-1">
                              {role.requirements.slice(0, 3).map((req, i) => (
                                <li key={i} className="flex items-center gap-2">
                                  <div className="w-1 h-1 bg-purple-500 rounded-full" />
                                  {req}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Compensation</p>
                            <ul className="text-sm text-green-400 space-y-1">
                              {role.compensation.map((comp, i) => (
                                <li key={i} className="flex items-center gap-2">
                                  <div className="w-1 h-1 bg-green-500 rounded-full" />
                                  {comp}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-xl font-semibold text-cyan-400 mb-4 flex items-center gap-2">
                  <Code className="h-5 w-5" /> Core Contributors (Tokens + Revenue Share)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {openRoles.filter(r => r.tier === 'core').map((role) => (
                    <Card key={role.id} className="bg-gray-900/50 border-gray-800 hover:border-cyan-500/50 transition-colors">
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-3">
                          <div className="text-cyan-400">{role.icon}</div>
                          <div>
                            <CardTitle className="text-white text-base">{role.title}</CardTitle>
                            <Badge className="mt-1 bg-cyan-600/20 text-cyan-300 border-cyan-500/30 text-xs">
                              {role.priority === 'high' ? 'High Priority' : 'Open'}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-400 mb-2">{role.description}</p>
                        <ul className="text-xs text-gray-500 space-y-1">
                          {role.requirements.slice(0, 2).map((req, i) => (
                            <li key={i}>• {req}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mb-16"
          >
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-center">Contribution Tiers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 rounded-lg bg-gray-800/50">
                    <h4 className="text-lg font-semibold text-amber-400 mb-2">Tier 1: Bounty</h4>
                    <p className="text-sm text-gray-400 mb-3">Specific tasks (bug fixes, small features)</p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>• CVT tokens per task</li>
                      <li>• No long-term commitment</li>
                      <li>• Flexible participation</li>
                    </ul>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-cyan-900/20 border border-cyan-500/30">
                    <h4 className="text-lg font-semibold text-cyan-400 mb-2">Tier 2: Core</h4>
                    <p className="text-sm text-gray-400 mb-3">Ongoing work (10+ hours/week)</p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>• CVT allocation (2-year vesting)</li>
                      <li>• Revenue share on features built</li>
                      <li>• Path to equity</li>
                    </ul>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-purple-900/20 border border-purple-500/30">
                    <h4 className="text-lg font-semibold text-purple-400 mb-2">Tier 3: Leadership</h4>
                    <p className="text-sm text-gray-400 mb-3">Full commitment as co-founder</p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>• Significant equity ownership</li>
                      <li>• Major CVT token allocation</li>
                      <li>• Salary when funded</li>
                      <li>• Real leadership title (CEO, CTO)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-center"
          >
            <Card className="bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/20 border-[#FF5AF7]/30">
              <CardContent className="py-12">
                <h2 className="text-3xl font-bold text-white mb-4">Ready to Build the Future?</h2>
                <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                  Send your background, which role interests you, and why decentralized security matters to you.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="mailto:chronosvault@chronosvault.org">
                    <Button className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90 text-white px-8">
                      <Mail className="h-4 w-4 mr-2" />
                      chronosvault@chronosvault.org
                    </Button>
                  </a>
                  <a href="https://github.com/Chronos-Vault/chronos-vault-platform-" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8">
                      <SiGithub className="h-4 w-4 mr-2" />
                      View GitHub Repository
                      <ExternalLink className="h-3 w-3 ml-2" />
                    </Button>
                  </a>
                </div>
                <p className="text-sm text-gray-500 mt-6">
                  I read every message personally. If your vision aligns with ours, we'll talk.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
}
