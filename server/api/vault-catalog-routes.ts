/**
 * Vault Catalog API Routes
 * Provides complete catalog of all 22 vault types with metadata
 * Used by Vault School Hub and related documentation pages
 */

import { Router, Request, Response } from 'express';

const router = Router();

export interface VaultType {
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  category: 'security' | 'blockchain' | 'investment' | 'legacy' | 'premium';
  features: string[];
  primaryChains: ('arbitrum' | 'solana' | 'ton' | 'bitcoin' | 'ethereum')[];
  securityLevel: 1 | 2 | 3 | 4 | 5;
  documentationPath: string;
  tags: string[];
  status: 'beta' | 'ga' | 'coming-soon';
  icon: string;
  gradientColors: string;
  creationEndpoint?: string;
  securityProtocols: string[];
}

const vaultCatalog: VaultType[] = [
  {
    id: 'smart-contract-vault',
    name: 'Smart Contract Vault™',
    shortDescription: 'ERC-4626 compliant tokenized vault with cross-chain security verification',
    longDescription: 'The Smart Contract Vault leverages the ERC-4626 tokenized vault standard for maximum DeFi compatibility. It features Triple-Chain Security™ architecture with quantum-resistant encryption options and programmable time-lock mechanisms.',
    category: 'blockchain',
    features: [
      'ERC-4626 standard compliance for maximum compatibility',
      'Triple-Chain Security™ architecture for robust protection',
      'Quantum-resistant encryption options',
      'Cross-chain verification of ownership',
      'Programmable time-lock mechanisms',
      'Automated yield optimization'
    ],
    primaryChains: ['arbitrum', 'ethereum'],
    securityLevel: 4,
    documentationPath: '/smart-contract-vault',
    tags: ['erc4626', 'defi', 'yield', 'tokenized'],
    status: 'ga',
    icon: '📘',
    gradientColors: 'from-blue-600 to-cyan-500',
    creationEndpoint: '/api/vaults/create',
    securityProtocols: ['Trinity Protocol', 'ZK-Proofs', 'Formal Verification']
  },
  {
    id: 'multi-signature-vault',
    name: 'Multi-Signature Vault™',
    shortDescription: 'Enhanced security requiring multiple approvals for asset access',
    longDescription: 'The Multi-Signature Vault implements configurable M-of-N signature requirements with distributed authorization across multiple keys. Perfect for DAOs, corporate treasuries, and high-value asset protection.',
    category: 'security',
    features: [
      'Configurable M-of-N signature requirements',
      'Distributed authorization across multiple keys',
      'Customizable approval thresholds',
      'Social recovery options',
      'Hierarchical approval workflows',
      'Time-delayed multi-sig operations'
    ],
    primaryChains: ['arbitrum', 'solana', 'ton'],
    securityLevel: 5,
    documentationPath: '/documentation/multi-signature-vault',
    tags: ['multisig', 'dao', 'corporate', 'treasury'],
    status: 'ga',
    icon: '🔒',
    gradientColors: 'from-purple-600 to-pink-600',
    creationEndpoint: '/api/vault-creation/multi-sig',
    securityProtocols: ['Trinity Protocol', 'ECDSA Multi-Party Computation', 'Threshold Signatures']
  },
  {
    id: 'biometric-vault',
    name: 'Biometric Vault™',
    shortDescription: 'Secure vaults with advanced biometric authentication mechanisms',
    longDescription: 'The Biometric Vault uses zero-knowledge biometric verification for fingerprint, face, and voice recognition. Your biometric data never leaves your device - only cryptographic proofs are used for authentication.',
    category: 'security',
    features: [
      'Fingerprint, face, and voice recognition support',
      'Zero-knowledge biometric verification',
      'Privacy-preserving authentication',
      'Multi-factor identity confirmation',
      'Offline verification capabilities',
      'Device binding with hardware attestation'
    ],
    primaryChains: ['arbitrum', 'solana'],
    securityLevel: 4,
    documentationPath: '/documentation/biometric-vault',
    tags: ['biometric', 'zk', 'privacy', 'mobile'],
    status: 'ga',
    icon: '📱',
    gradientColors: 'from-emerald-500 to-teal-500',
    securityProtocols: ['ZK-Biometrics', 'Device Attestation', 'Trinity Protocol']
  },
  {
    id: 'cross-chain-vault',
    name: 'Cross-Chain Vault™',
    shortDescription: 'Assets secured across multiple blockchain networks simultaneously',
    longDescription: 'The Cross-Chain Vault distributes security across Arbitrum, Solana, and TON blockchains. Leveraging Trinity Protocol\'s 2-of-3 consensus, your assets remain protected even if one chain is compromised.',
    category: 'blockchain',
    features: [
      'Multi-chain asset protection',
      'Cross-chain verification of ownership',
      'Distributed security across networks',
      'Blockchain agnostic asset management',
      'Fallback chain redundancy',
      'Real-time cross-chain state sync'
    ],
    primaryChains: ['arbitrum', 'solana', 'ton'],
    securityLevel: 5,
    documentationPath: '/cross-chain-vault',
    tags: ['crosschain', 'trinity', 'multichain'],
    status: 'ga',
    icon: '🌐',
    gradientColors: 'from-indigo-600 to-purple-600',
    securityProtocols: ['Trinity Protocol 2-of-3', 'HTLC Atomic Swaps', 'Cross-Chain Merkle Proofs']
  },
  {
    id: 'cross-chain-fragment-vault',
    name: 'Cross-Chain Fragment Vault™',
    shortDescription: 'Fragments your assets across multiple chains for enhanced security',
    longDescription: 'The Fragment Vault uses Shamir Secret Sharing to split your assets across Arbitrum (40%), Solana (30%), and TON (30%). Recovery requires fragments from at least 2 of 3 chains.',
    category: 'blockchain',
    features: [
      'Automatic asset fragmentation across chains',
      'Triple-chain verification for access',
      'Recovery mechanism with multi-sig backup',
      'Full or partial fragment recovery options',
      'Chain-specific security optimization',
      'Shamir Secret Sharing (2-of-3)'
    ],
    primaryChains: ['arbitrum', 'solana', 'ton'],
    securityLevel: 5,
    documentationPath: '/documentation/cross-chain-fragment-vault',
    tags: ['fragment', 'shamir', 'distributed', 'crosschain'],
    status: 'ga',
    icon: '🧩',
    gradientColors: 'from-violet-600 to-indigo-600',
    creationEndpoint: '/api/vault-creation/fragment',
    securityProtocols: ['Shamir Secret Sharing', 'Trinity Protocol', 'MPC Key Management']
  },
  {
    id: 'time-lock-vault',
    name: 'Time-Lock Vault™',
    shortDescription: 'Assets locked until a specific date with VDF mathematical proofs',
    longDescription: 'The Time-Lock Vault uses Verifiable Delay Functions (VDFs) to create mathematically proven time locks. Assets cannot be accessed before the unlock date - not even by the vault creator.',
    category: 'investment',
    features: [
      'Verifiable Delay Function (VDF) time-locks',
      'Mathematically enforced unlock dates',
      'Partial early withdrawal options',
      'Scheduled release schedules',
      'Time-based access controls',
      'No early access - even for owner'
    ],
    primaryChains: ['arbitrum', 'ethereum'],
    securityLevel: 4,
    documentationPath: '/documentation/time-lock-vault',
    tags: ['timelock', 'vdf', 'hodl', 'discipline'],
    status: 'ga',
    icon: '⏰',
    gradientColors: 'from-blue-500 to-cyan-500',
    creationEndpoint: '/api/vault-creation/time-lock',
    securityProtocols: ['Wesolowski VDF', 'Trinity Protocol', 'Smart Contract Enforcement']
  },
  {
    id: 'quantum-resistant-vault',
    name: 'Quantum-Resistant Vault™',
    shortDescription: 'Future-proof security against quantum computing threats',
    longDescription: 'The Quantum-Resistant Vault uses ML-KEM-1024 (Kyber) and CRYSTALS-Dilithium-5 post-quantum cryptography. Your assets are protected against both classical and quantum computer attacks.',
    category: 'security',
    features: [
      'ML-KEM-1024 (Kyber) key encapsulation',
      'CRYSTALS-Dilithium-5 digital signatures',
      'NIST-approved post-quantum algorithms',
      'Hybrid classical/quantum encryption',
      'Future-proof key storage',
      'Quantum-safe backup recovery'
    ],
    primaryChains: ['ton', 'arbitrum'],
    securityLevel: 5,
    documentationPath: '/documentation/quantum-resistant-vault',
    tags: ['quantum', 'pqc', 'future-proof', 'kyber', 'dilithium'],
    status: 'ga',
    icon: '⚛️',
    gradientColors: 'from-emerald-600 to-green-500',
    securityProtocols: ['ML-KEM-1024', 'CRYSTALS-Dilithium-5', 'TON Quantum Layer']
  },
  {
    id: 'quantum-progressive-vault',
    name: 'Quantum Progressive Vault™',
    shortDescription: 'Security that increases over time with progressive quantum upgrades',
    longDescription: 'The Quantum Progressive Vault automatically upgrades its cryptographic protection as your assets grow. Starts with standard encryption and progressively adds quantum-resistant layers.',
    category: 'security',
    features: [
      'Progressive security tier upgrades',
      'Automatic quantum algorithm rotation',
      'Value-based security scaling',
      'Seamless cryptographic migration',
      'Zero-downtime upgrades',
      'Multi-tier quantum protection'
    ],
    primaryChains: ['arbitrum', 'ton'],
    securityLevel: 5,
    documentationPath: '/documentation/quantum-progressive-vault',
    tags: ['quantum', 'progressive', 'scaling', 'advanced'],
    status: 'ga',
    icon: '📈',
    gradientColors: 'from-purple-600 to-violet-600',
    creationEndpoint: '/api/progressive-quantum/create',
    securityProtocols: ['Progressive Quantum Shield', 'ML-KEM Hybrid', 'Trinity Protocol']
  },
  {
    id: 'bitcoin-halving-vault',
    name: 'Bitcoin Halving Vault™',
    shortDescription: 'Timed releases aligned with Bitcoin halving events',
    longDescription: 'The Bitcoin Halving Vault automatically releases portions of your assets at each Bitcoin halving event. Perfect for long-term Bitcoin maximalists who believe in the 4-year cycle.',
    category: 'investment',
    features: [
      'Automatic halving cycle detection',
      'Configurable release percentages',
      'Cross-chain Bitcoin verification',
      'Halving countdown integration',
      'Multi-cycle planning',
      'BTC-denominated value tracking'
    ],
    primaryChains: ['bitcoin', 'arbitrum'],
    securityLevel: 4,
    documentationPath: '/documentation/bitcoin-halving-vault',
    tags: ['bitcoin', 'halving', 'hodl', 'btc'],
    status: 'ga',
    icon: '₿',
    gradientColors: 'from-orange-500 to-yellow-500',
    securityProtocols: ['Bitcoin Verification', 'Trinity Protocol', 'Time-Lock Contracts']
  },
  {
    id: 'geo-location-vault',
    name: 'Geo-Location Vault™',
    shortDescription: 'Location-based security for physical presence authentication',
    longDescription: 'The Geo-Location Vault requires physical presence at specified coordinates for asset access. Perfect for safe deposit box-style security with cryptographic enforcement.',
    category: 'security',
    features: [
      'GPS coordinate verification',
      'Zero-knowledge location proofs',
      'Multi-location unlock options',
      'Geofencing boundaries',
      'Privacy-preserving location',
      'Anti-spoofing mechanisms'
    ],
    primaryChains: ['arbitrum', 'solana'],
    securityLevel: 4,
    documentationPath: '/documentation/geo-location-vault',
    tags: ['geolocation', 'physical', 'presence', 'gps'],
    status: 'ga',
    icon: '📍',
    gradientColors: 'from-emerald-500 to-teal-500',
    securityProtocols: ['ZK-Location Proofs', 'GPS Attestation', 'Trinity Protocol']
  },
  {
    id: 'time-locked-memory-vault',
    name: 'Time-Locked Memory Vault™',
    shortDescription: 'Secure digital legacy with timed multimedia releases',
    longDescription: 'The Memory Vault preserves your digital memories with scheduled releases. Store encrypted messages, photos, and videos to be revealed to loved ones at specific future dates.',
    category: 'legacy',
    features: [
      'Encrypted multimedia storage',
      'Scheduled message releases',
      'Multi-recipient distribution',
      'Conditional access triggers',
      'Arweave/IPFS integration',
      'Private viewing keys'
    ],
    primaryChains: ['arbitrum', 'ton'],
    securityLevel: 4,
    documentationPath: '/documentation/time-locked-memory-vault',
    tags: ['memory', 'legacy', 'multimedia', 'family'],
    status: 'ga',
    icon: '📸',
    gradientColors: 'from-pink-500 to-rose-500',
    securityProtocols: ['Encrypted Storage', 'Time-Lock VDF', 'Trinity Protocol']
  },
  {
    id: 'nft-powered-vault',
    name: 'NFT-Powered Vault™',
    shortDescription: 'Digital asset security tied to NFT ownership',
    longDescription: 'The NFT-Powered Vault uses NFT ownership as the access key. Transfer access by transferring the NFT, enabling tradeable vault access and creative use cases.',
    category: 'blockchain',
    features: [
      'NFT-based access control',
      'Tradeable vault ownership',
      'Multi-NFT unlock requirements',
      'ERC-721/1155 compatibility',
      'Royalty-enabled transfers',
      'Collection-gated access'
    ],
    primaryChains: ['arbitrum', 'ethereum', 'solana'],
    securityLevel: 3,
    documentationPath: '/documentation/nft-powered-vault',
    tags: ['nft', 'tradeable', 'collectible', 'web3'],
    status: 'ga',
    icon: '🎨',
    gradientColors: 'from-fuchsia-500 to-purple-500',
    securityProtocols: ['NFT Verification', 'On-chain Ownership', 'Trinity Protocol']
  },
  {
    id: 'ai-assisted-investment-vault',
    name: 'AI-Assisted Investment Vault™',
    shortDescription: 'Intelligent investment optimization with AI governance',
    longDescription: 'The AI-Assisted Vault uses Claude AI for governance decisions and investment optimization. Human oversight with AI-powered analysis for better decision-making.',
    category: 'investment',
    features: [
      'AI-powered investment analysis',
      'Governance proposal evaluation',
      'Risk assessment automation',
      'Market condition monitoring',
      'Human-AI hybrid decisions',
      'Explainable AI recommendations'
    ],
    primaryChains: ['arbitrum', 'solana'],
    securityLevel: 4,
    documentationPath: '/documentation/ai-assisted-investment-vault',
    tags: ['ai', 'governance', 'investment', 'automation'],
    status: 'ga',
    icon: '🤖',
    gradientColors: 'from-violet-600 to-purple-500',
    securityProtocols: ['AI Governance Layer', 'Human Override', 'Trinity Protocol']
  },
  {
    id: 'family-heritage-vault',
    name: 'Family Heritage Vault™',
    shortDescription: 'Generational wealth transfer with multi-level access',
    longDescription: 'The Heritage Vault is designed for multi-generational wealth transfer with hierarchical access controls. Create inheritance structures with conditions and gradual handovers.',
    category: 'legacy',
    features: [
      'Multi-generational access tiers',
      'Conditional inheritance triggers',
      'Gradual handover schedules',
      'Family member verification',
      'Estate planning integration',
      'Trust-style distributions'
    ],
    primaryChains: ['arbitrum', 'ton'],
    securityLevel: 4,
    documentationPath: '/documentation/family-heritage-vault',
    tags: ['family', 'inheritance', 'estate', 'trust'],
    status: 'ga',
    icon: '👨‍👩‍👧‍👦',
    gradientColors: 'from-red-500 to-pink-500',
    securityProtocols: ['Multi-level Access', 'Trinity Protocol', 'Intent Inheritance']
  },
  {
    id: 'investment-discipline-vault',
    name: 'Investment Discipline Vault™',
    shortDescription: 'Structured investment strategies with time-based controls',
    longDescription: 'The Discipline Vault enforces DCA strategies and prevents emotional trading. Set up automated investment rules that cannot be bypassed.',
    category: 'investment',
    features: [
      'Dollar-cost averaging automation',
      'Emotional trading prevention',
      'Scheduled investment execution',
      'Withdrawal cooldown periods',
      'Strategy locking mechanisms',
      'Performance tracking'
    ],
    primaryChains: ['arbitrum', 'ethereum'],
    securityLevel: 3,
    documentationPath: '/documentation/investment-discipline-vault',
    tags: ['dca', 'discipline', 'automation', 'strategy'],
    status: 'ga',
    icon: '📊',
    gradientColors: 'from-sky-500 to-blue-500',
    securityProtocols: ['Smart Contract Enforcement', 'Time-Locks', 'Trinity Protocol']
  },
  {
    id: 'milestone-based-vault',
    name: 'Milestone-Based Vault™',
    shortDescription: 'Conditional releases based on achievements or events',
    longDescription: 'The Milestone Vault releases assets based on verifiable achievements. Connect to oracles for educational degrees, business milestones, or personal goals.',
    category: 'investment',
    features: [
      'Oracle-verified milestones',
      'Multi-milestone requirements',
      'Partial release options',
      'Educational achievement tracking',
      'Business goal integration',
      'Third-party verification'
    ],
    primaryChains: ['arbitrum', 'solana'],
    securityLevel: 3,
    documentationPath: '/documentation/milestone-based-vault',
    tags: ['milestone', 'achievement', 'oracle', 'conditional'],
    status: 'ga',
    icon: '🏆',
    gradientColors: 'from-amber-500 to-orange-500',
    securityProtocols: ['Oracle Verification', 'Chainlink Integration', 'Trinity Protocol']
  },
  {
    id: 'intent-inheritance-vault',
    name: 'Intent Inheritance Vault™',
    shortDescription: 'AI-powered intent understanding for complex inheritance rules',
    longDescription: 'The Intent Inheritance Vault uses AI to understand complex inheritance wishes expressed in natural language. Converts your intentions into enforceable smart contract logic.',
    category: 'legacy',
    features: [
      'Natural language intent parsing',
      'AI-powered rule generation',
      'Complex condition handling',
      'Multi-beneficiary distribution',
      'Adaptive inheritance logic',
      'Legal document integration'
    ],
    primaryChains: ['arbitrum', 'ton'],
    securityLevel: 4,
    documentationPath: '/documentation/intent-inheritance-vault',
    tags: ['intent', 'ai', 'inheritance', 'nlp'],
    status: 'ga',
    icon: '📜',
    gradientColors: 'from-amber-600 to-yellow-500',
    creationEndpoint: '/api/intent-inheritance/create',
    securityProtocols: ['AI Intent Engine', 'Formal Verification', 'Trinity Protocol']
  },
  {
    id: 'zk-privacy-vault',
    name: 'ZK Privacy Vault™',
    shortDescription: 'Complete transaction privacy with zero-knowledge proofs',
    longDescription: 'The ZK Privacy Vault uses Groth16 zero-knowledge proofs to hide transaction amounts, sender, and recipient while maintaining verifiable security.',
    category: 'security',
    features: [
      'Groth16 ZK-SNARK proofs',
      'Hidden transaction amounts',
      'Anonymous deposits/withdrawals',
      'Verifiable without disclosure',
      'Regulatory compliance options',
      'Selective disclosure'
    ],
    primaryChains: ['arbitrum', 'ethereum'],
    securityLevel: 5,
    documentationPath: '/documentation/zk-privacy-vault',
    tags: ['zk', 'privacy', 'anonymous', 'groth16'],
    status: 'ga',
    icon: '🕶️',
    gradientColors: 'from-gray-700 to-gray-900',
    securityProtocols: ['Groth16 ZK-SNARKs', 'Zero-Knowledge Shield', 'Trinity Protocol']
  },
  {
    id: 'diamond-hands-vault',
    name: 'Diamond Hands Vault™',
    shortDescription: 'Extreme HODL vault with no early exit options',
    longDescription: 'The Diamond Hands Vault is for true believers. Once locked, assets cannot be accessed until the unlock date - no exceptions, no emergency exits, no keys to lose.',
    category: 'investment',
    features: [
      'Absolute time-lock enforcement',
      'No emergency withdrawal',
      'Immutable unlock dates',
      'On-chain commitment proof',
      'HODL streak tracking',
      'Community leaderboards'
    ],
    primaryChains: ['arbitrum', 'bitcoin'],
    securityLevel: 5,
    documentationPath: '/documentation/diamond-hands-vault',
    tags: ['hodl', 'diamond-hands', 'commitment', 'bitcoin'],
    status: 'ga',
    icon: '💎',
    gradientColors: 'from-cyan-400 to-blue-500',
    securityProtocols: ['Immutable Time-Lock', 'No-Exit Enforcement', 'Trinity Protocol']
  },
  {
    id: 'social-recovery-vault',
    name: 'Social Recovery Vault™',
    shortDescription: 'Wallet recovery through trusted social connections',
    longDescription: 'The Social Recovery Vault allows you to designate trusted guardians who can help recover access if you lose your keys. No single guardian can access funds alone.',
    category: 'security',
    features: [
      'Guardian designation system',
      'M-of-N recovery threshold',
      'Time-delayed recovery',
      'Guardian rotation',
      'No single point of failure',
      'Email/social verification'
    ],
    primaryChains: ['arbitrum', 'solana', 'ton'],
    securityLevel: 4,
    documentationPath: '/documentation/social-recovery-vault',
    tags: ['recovery', 'social', 'guardians', 'backup'],
    status: 'ga',
    icon: '🤝',
    gradientColors: 'from-green-500 to-emerald-500',
    securityProtocols: ['Guardian Network', 'Threshold Recovery', 'Trinity Protocol']
  },
  {
    id: 'sovereign-fortress-vault',
    name: 'Sovereign Fortress Vault™',
    shortDescription: 'Ultimate all-in-one vault with supreme security flexibility',
    longDescription: 'The Sovereign Fortress is our most advanced vault combining all security features: multi-sig, quantum resistance, cross-chain fragments, biometrics, time-locks, and AI governance.',
    category: 'premium',
    features: [
      'All security features combined',
      'Customizable security layers',
      'Maximum flexibility',
      'Enterprise-grade protection',
      'White-glove onboarding',
      'Dedicated security team'
    ],
    primaryChains: ['arbitrum', 'solana', 'ton', 'bitcoin'],
    securityLevel: 5,
    documentationPath: '/documentation/sovereign-fortress-vault',
    tags: ['premium', 'enterprise', 'all-in-one', 'fortress'],
    status: 'ga',
    icon: '🏰',
    gradientColors: 'from-slate-700 to-gray-900',
    securityProtocols: ['All 8 MDL Layers', 'Trinity Shield TEE', 'Full Formal Verification']
  },
  {
    id: 'chronos-vault-optimized',
    name: 'ChronosVault Optimized™',
    shortDescription: 'ERC-4626 investment vault with yield optimization',
    longDescription: 'ChronosVault Optimized is our flagship investment vault following the ERC-4626 standard. It automatically optimizes yield while maintaining Trinity Protocol security.',
    category: 'premium',
    features: [
      'ERC-4626 yield vault',
      'Automated yield strategies',
      'Gas-optimized operations',
      'Real-time APY tracking',
      'Multiple strategy selection',
      'Institutional-grade custody'
    ],
    primaryChains: ['arbitrum', 'ethereum'],
    securityLevel: 5,
    documentationPath: '/chronos-vault-optimized',
    tags: ['yield', 'optimized', 'erc4626', 'investment'],
    status: 'ga',
    icon: '⚡',
    gradientColors: 'from-yellow-500 to-orange-500',
    securityProtocols: ['Trinity Protocol', 'Formal Verification', 'Audit Framework']
  }
];

/**
 * GET /api/vault-catalog
 * Returns all 22 vault types with complete metadata
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const categories = [...new Set(vaultCatalog.map(v => v.category))];
    const securityVaults = vaultCatalog.filter(v => v.category === 'security').length;
    const blockchainVaults = vaultCatalog.filter(v => v.category === 'blockchain').length;
    const investmentVaults = vaultCatalog.filter(v => v.category === 'investment').length;
    const legacyVaults = vaultCatalog.filter(v => v.category === 'legacy').length;
    const premiumVaults = vaultCatalog.filter(v => v.category === 'premium').length;
    
    res.json({
      success: true,
      totalVaults: vaultCatalog.length,
      categories: {
        security: securityVaults,
        blockchain: blockchainVaults,
        investment: investmentVaults,
        legacy: legacyVaults,
        premium: premiumVaults
      },
      vaultTypes: vaultCatalog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch vault catalog'
    });
  }
});

/**
 * GET /api/vault-catalog/:id
 * Returns details for a specific vault type
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const vault = vaultCatalog.find(v => v.id === req.params.id);
    
    if (!vault) {
      return res.status(404).json({
        success: false,
        error: 'Vault type not found'
      });
    }
    
    res.json({
      success: true,
      vaultType: vault
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch vault type'
    });
  }
});

/**
 * GET /api/vault-catalog/category/:category
 * Returns vault types filtered by category
 */
router.get('/category/:category', async (req: Request, res: Response) => {
  try {
    const validCategories = ['security', 'blockchain', 'investment', 'legacy', 'premium'];
    const category = req.params.category;
    
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid category'
      });
    }
    
    const vaults = vaultCatalog.filter(v => v.category === category);
    
    res.json({
      success: true,
      category,
      count: vaults.length,
      vaultTypes: vaults
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch vault types by category'
    });
  }
});

/**
 * GET /api/vault-catalog/security-protocols
 * Returns unique security protocols used across all vaults
 */
router.get('/meta/security-protocols', async (_req: Request, res: Response) => {
  try {
    const allProtocols = vaultCatalog.flatMap(v => v.securityProtocols);
    const uniqueProtocols = [...new Set(allProtocols)].sort();
    
    res.json({
      success: true,
      count: uniqueProtocols.length,
      protocols: uniqueProtocols
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch security protocols'
    });
  }
});

export default router;
